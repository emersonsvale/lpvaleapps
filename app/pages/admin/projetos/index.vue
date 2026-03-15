<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Projetos</h1>
        <p class="text-zinc-400">Acompanhe a operação e entrega dos seus projetos em andamento.</p>
      </div>
      <NuxtLink
        to="/admin/projetos/novo"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity"
      >
        <span>+ Novo Projeto</span>
      </NuxtLink>
    </div>

    <section class="flex flex-wrap items-center gap-3">
      <div class="inline-flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/70 p-1">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="abaAtiva === 'projetos' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'"
          @click="abaAtiva = 'projetos'"
        >
          Projetos
        </button>
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="abaAtiva === 'meu_dia' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'"
          @click="abaAtiva = 'meu_dia'"
        >
          Meu Dia
        </button>
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="abaAtiva === 'minhas_tarefas' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'"
          @click="abaAtiva = 'minhas_tarefas'"
        >
          Minhas tarefas
        </button>
      </div>

      <p class="text-sm text-zinc-500">
        {{ descricaoAbaAtiva }}
      </p>
    </section>

    <!-- Filtros (ocultos em Meu Dia) -->
    <section v-if="abaAtiva !== 'meu_dia'" class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        v-model="filtroBusca"
        type="text"
        :placeholder="placeholderBusca"
        class="md:col-span-3 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand"
      >
      <select
        v-model="filtroStatus"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-brand"
      >
        <option
          v-for="opcao in opcoesStatusFiltro"
          :key="`${abaAtiva}-${opcao.value}`"
          :value="opcao.value"
        >
          {{ opcao.label }}
        </option>
      </select>
    </section>

    <!-- Aba Meu Dia -->
    <div v-if="abaAtiva === 'meu_dia'" class="space-y-6">
      <p class="text-sm text-zinc-500">
        Resumo de <strong class="text-zinc-300">{{ dataDeHojeFormatada }}</strong>
        <span v-if="membroEquipeLogado?.nome" class="ml-2">— {{ membroEquipeLogado.nome }}</span>
      </p>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Horas trabalhadas hoje</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ formatHorasMeuDia(horasTrabalhadasHoje) }}h</p>
        </article>
        <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Tarefas com atividade</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ tarefasExecutadasHoje.length }}</p>
        </article>
        <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Meta do dia (8h)</p>
          <p class="mt-2 text-2xl font-semibold" :class="progressoMetaDia >= 100 ? 'text-emerald-400' : 'text-zinc-100'">
            {{ progressoMetaDia }}%
          </p>
        </article>
        <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Lançamentos hoje</p>
          <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ lancamentosDoDia.length }}</p>
        </article>
      </section>

      <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-medium text-zinc-200">Progresso do dia</h2>
          <span class="text-sm text-zinc-500">{{ formatHorasMeuDia(horasTrabalhadasHoje) }}h de 8h</span>
        </div>
        <div class="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 rounded-full"
            :class="progressoMetaDia >= 100 ? 'bg-emerald-500' : 'bg-brand'"
            :style="{ width: `${Math.min(progressoMetaDia, 100)}%` }"
          />
        </div>
      </section>

      <section class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <header class="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
          <h2 class="text-base font-semibold text-zinc-100">Tarefas em que você trabalhou hoje (todos os projetos)</h2>
          <button
            type="button"
            class="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
            @click="refreshMeuDia"
          >
            Atualizar
          </button>
        </header>
        <div v-if="pendingMeuDia" class="px-4 py-10 text-center text-sm text-zinc-500">Carregando...</div>
        <div v-else-if="!tarefasExecutadasHoje.length" class="px-4 py-10 text-center text-sm text-zinc-500">
          Nenhuma tarefa registrada hoje. Use o cronômetro nas tarefas para lançar horas.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-zinc-800">
                <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Projeto / Tarefa</th>
                <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Horas hoje</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tarefasExecutadasHoje"
                :key="`${item.projetoId}-${item.tarefaId}`"
                class="border-b border-zinc-800/80 hover:bg-zinc-800/30 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-xs font-medium text-zinc-400">{{ item.projetoNome }} · {{ item.codigo }}</span>
                    <span class="text-sm text-zinc-200">{{ item.titulo }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-block rounded px-2 py-0.5 text-xs font-medium" :class="corStatusMeuDia(item.status)">
                    {{ statusLabelMeuDia(item.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-sm font-medium text-zinc-100">
                  {{ formatHorasMeuDia(item.horasHoje) }}h
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-else-if="abaAtiva === 'projetos' && pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando projetos...
    </div>
    <div v-else-if="abaAtiva === 'projetos' && error" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      {{ error }}
    </div>
    <div v-else-if="abaAtiva === 'projetos'" class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-3">
      <NuxtLink
        v-for="p in projetosFiltrados"
        :key="p.id"
        :to="`/admin/projetos/${p.id}`"
        class="block p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/40 transition-colors group"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PhFolderOpen class="w-5 h-5 text-brand" />
            </div>
            <div class="min-w-0">
              <h2 class="font-semibold text-zinc-100 truncate">{{ p.nome }}</h2>
              <p class="text-sm text-zinc-400 truncate mt-0.5">
                <span v-if="p.cliente_nome">{{ p.cliente_nome }}</span>
                <span v-else>Sem cliente vinculado</span>
              </p>
            </div>
          </div>
          
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span
              class="text-xs px-2.5 py-1 rounded-md font-medium"
              :class="{
                'bg-zinc-800 text-zinc-300': p.status === 'iniciando',
                'bg-blue-500/20 text-blue-400': p.status === 'em_andamento',
                'bg-orange-500/20 text-orange-400': p.status === 'pausado',
                'bg-emerald-500/20 text-emerald-400': p.status === 'concluido',
                'bg-red-500/20 text-red-400': p.status === 'cancelado'
              }"
            >
              {{ p.status === 'em_andamento' ? 'Em andamento' : p.status === 'concluido' ? 'Concluído' : p.status.charAt(0).toUpperCase() + p.status.slice(1) }}
            </span>
          </div>
        </div>

        <div class="mt-6 flex items-center gap-4">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1.5 text-xs">
              <span class="text-zinc-500">Progresso</span>
              <span class="font-medium text-zinc-300">{{ getProjetoProgressoPercentual(p.id) }}%</span>
            </div>
            <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand transition-all duration-500" 
                :style="{ width: `${getProjetoProgressoPercentual(p.id)}%` }"
              />
            </div>
          </div>

          <div class="flex items-center gap-4 shrink-0 text-xs text-zinc-500">
            <span class="flex items-center gap-1.5" title="Tarefas concluídas">
              <PhCalendarBlank class="w-4 h-4" />
              {{ getProjetoTarefasConcluidas(p.id) }} de {{ getProjetoTotalTarefas(p.id) }} tarefas
            </span>
          </div>
        </div>
      </NuxtLink>

      <div v-if="!projetosFiltrados.length" class="lg:col-span-2 rounded-xl border border-dashed border-zinc-700 p-8 text-center bg-zinc-900/30">
        <PhFolderOpen class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <p class="text-zinc-400">Nenhum projeto encontrado.</p>
        <NuxtLink to="/admin/projetos/novo" class="inline-block mt-3 text-brand hover:underline">
          Criar primeiro projeto
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="pendingTarefas" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando tarefas do usuario...
    </div>
    <div v-else-if="errorTarefas" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      {{ errorTarefas }}
    </div>
    <div v-else-if="!identificadoresResponsavelUsuario.length" class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-400">
      Nao foi possivel identificar o nome do usuario logado para cruzar com os responsaveis das tarefas.
    </div>
    <div v-else class="space-y-4">
      <section class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span class="text-[11px] uppercase tracking-wider text-zinc-500">Total</span>
          <strong class="mt-2 block text-2xl font-semibold text-zinc-100">{{ minhasTarefasResumo.total }}</strong>
          <p class="mt-1 text-sm text-zinc-500">tarefas atribuidas</p>
        </div>
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span class="text-[11px] uppercase tracking-wider text-zinc-500">Em progresso</span>
          <strong class="mt-2 block text-2xl font-semibold text-zinc-100">{{ minhasTarefasResumo.emProgresso }}</strong>
          <p class="mt-1 text-sm text-zinc-500">rodando agora</p>
        </div>
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span class="text-[11px] uppercase tracking-wider text-zinc-500">Concluidas</span>
          <strong class="mt-2 block text-2xl font-semibold text-zinc-100">{{ minhasTarefasResumo.concluidas }}</strong>
          <p class="mt-1 text-sm text-zinc-500">ja finalizadas</p>
        </div>
      </section>

      <div v-if="!tarefasUsuarioFiltradas.length" class="rounded-xl border border-dashed border-zinc-700 p-8 text-center bg-zinc-900/30">
        <PhListChecks class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <p class="text-zinc-300">Nenhuma tarefa encontrada para o usuario logado.</p>
        <p class="mt-1 text-sm text-zinc-500">Ajuste os filtros ou atribua tarefas com o mesmo nome usado no login.</p>
      </div>

      <article
        v-for="item in tarefasUsuarioFiltradas"
        :key="item.id"
        class="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-md bg-zinc-800 px-2 py-1 text-[11px] font-medium text-zinc-400">{{ item.codigo || `T-${item.id}` }}</span>
                <span class="rounded-md px-2.5 py-1 text-[11px] font-medium" :class="taskStatusBadgeClass[item.status]">
                  {{ taskStatusLabels[item.status] }}
                </span>
                <span class="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-400">
                  {{ item.projeto?.nome || 'Projeto sem nome' }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <select
                  class="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-100 transition-colors focus:border-brand focus:outline-none"
                  :value="item.status"
                  @click.stop
                  @change="alterarStatusMinhaTarefa(item, ($event.target as HTMLSelectElement).value as ProjetoTarefa['status'])"
                >
                  <option
                    v-for="opcao in taskStatusOptions"
                    :key="`minhas-tarefas-status-${item.id}-${opcao.value}`"
                    :value="opcao.value"
                  >
                    {{ opcao.label }}
                  </option>
                </select>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
                  @click.stop.prevent="irParaEdicaoTarefa(item)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="inline-flex min-w-[88px] items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                  :class="tarefaRodandoId === item.id ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25' : 'bg-brand text-black hover:opacity-90'"
                  @click.stop.prevent="toggleTimerTarefa(item)"
                >
                  {{ tarefaRodandoId === item.id ? 'Pausar' : 'Iniciar' }}
                </button>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-semibold text-zinc-100">{{ item.titulo }}</h2>
              <p class="mt-1 text-sm text-zinc-500">
                {{ item.projeto?.cliente_nome || 'Sem cliente vinculado' }}
              </p>
            </div>

            <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
              <span
                v-for="tag in item.tags"
                :key="`minha-tarefa-${item.id}-${tag}`"
                class="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="grid min-w-full grid-cols-2 gap-3 sm:min-w-[360px] lg:w-[420px]">
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span class="text-[10px] uppercase tracking-wider text-zinc-500">Prazo</span>
              <p class="mt-1 text-sm font-medium text-zinc-100">{{ formatPrazoTarefa(item.prazo_inicio, item.prazo_fim) }}</p>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span class="text-[10px] uppercase tracking-wider text-zinc-500">Horas</span>
              <p class="mt-1 text-sm font-medium text-zinc-100">{{ getHorasExecutadasDisplay(item) }} / {{ formatHorasResumo(item.horas_estimadas) }}h</p>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span class="text-[10px] uppercase tracking-wider text-zinc-500">Progresso</span>
              <p class="mt-1 text-sm font-medium text-zinc-100">{{ formatProgresso(item.progresso) }}</p>
            </div>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span class="text-[10px] uppercase tracking-wider text-zinc-500">Tipo</span>
              <p class="mt-1 text-sm font-medium text-zinc-100">{{ capitalizeLabel(item.tipo) }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhFolderOpen, PhCalendarBlank, PhListChecks } from '@phosphor-icons/vue'
import type { ProjetoAdminWorkspace, ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import { createLancamentoHora, fetchEquipeMembros, fetchLancamentosHorasDoDiaByUsuario, fetchProjetosWorkspace, fetchTarefasWorkspace, updateTarefaStatus } from '~/composables/useProjetosWorkspace'
import { useSupabase } from '~/composables/useSupabase'
import { hydrateWorkspaceRunningTimerState, persistWorkspaceRunningTimerState, resetWorkspaceRunningTimerState, useWorkspaceRunningTimerState } from '~/composables/useWorkspaceRunningTimer'

definePageMeta({ layout: 'admin' })

const { user, loadSession } = useAuth()
const { showAlert } = useUiFeedback()
await loadSession()
const workspaceTimer = useWorkspaceRunningTimerState()

hydrateWorkspaceRunningTimerState()

const { data: projetos, pending, error } = await useAsyncData(
  'admin-projetos-workspace',
  fetchProjetosWorkspace,
  {
    server: false,
    default: () => []
  }
)

const { data: tarefasWorkspace, pending: pendingTarefas, error: errorTarefas } = await useAsyncData(
  'admin-projetos-workspace-tarefas',
  fetchTarefasWorkspace,
  {
    server: false,
    default: () => []
  }
)

const { data: equipeMembros } = await useAsyncData(
  'admin-projetos-workspace-equipe',
  fetchEquipeMembros,
  {
    server: false,
    default: () => []
  }
)

const dataDeHoje = computed(() => new Date().toISOString().slice(0, 10))

const { data: lancamentosMeuDia, pending: pendingMeuDia, refresh: refreshMeuDia } = await useAsyncData(
  'meu-dia-lancamentos',
  async () => {
    const dataHoje = new Date().toISOString().slice(0, 10)
    const eqId = membroEquipeLogado.value?.id ?? null
    const uid = user.value?.id ?? null
    if (eqId == null && !uid) return []
    return fetchLancamentosHorasDoDiaByUsuario(dataHoje, eqId, uid)
  },
  { server: false, default: () => [] }
)

const abaAtiva = ref<'projetos' | 'meu_dia' | 'minhas_tarefas'>('projetos')
const filtroBusca = ref('')
const filtroStatus = ref<string>('todos')
const tarefaRodandoId = ref<number | null>(null)
const timerInicioMs = ref<number | null>(null)
const timerBaseSegundos = ref(0)
const tickMs = ref(Date.now())
const salvandoTimer = ref(false)
const stopRequestHandledAt = ref<number | null>(null)
let timerTickHandle: ReturnType<typeof setInterval> | null = null

const taskStatusLabels: Record<ProjetoTarefa['status'], string> = {
  refinar: 'A Refinar',
  fazer: 'A Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisao',
  concluido: 'Concluido'
}

const taskStatusOptions: Array<{ value: ProjetoTarefa['status']; label: string }> = [
  { value: 'refinar', label: 'A Refinar' },
  { value: 'fazer', label: 'A Fazer' },
  { value: 'em_progresso', label: 'Em Progresso' },
  { value: 'sob_revisao', label: 'Sob Revisao' },
  { value: 'concluido', label: 'Concluido' }
]

const taskStatusBadgeClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-purple-500/15 text-purple-300',
  fazer: 'bg-orange-500/15 text-orange-300',
  em_progresso: 'bg-blue-500/15 text-blue-300',
  sob_revisao: 'bg-yellow-500/15 text-yellow-300',
  concluido: 'bg-emerald-500/15 text-emerald-300'
}

const descricaoAbaAtiva = computed(() => {
  if (abaAtiva.value === 'projetos') return 'Visao geral dos projetos ativos e planejados.'
  if (abaAtiva.value === 'meu_dia') return 'Horas trabalhadas, tarefas executadas e progresso do dia em todos os projetos.'
  return 'Tarefas atribuidas ao usuario logado em todos os projetos.'
})

const placeholderBusca = computed(() => {
  return abaAtiva.value === 'projetos'
    ? 'Buscar projeto por nome ou cliente...'
    : 'Buscar tarefa, projeto, cliente ou tag...'
})

const opcoesStatusFiltro = computed(() => {
  if (abaAtiva.value === 'projetos') {
    return [
      { value: 'todos', label: 'Todos os status' },
      { value: 'iniciando', label: 'Iniciando' },
      { value: 'em_andamento', label: 'Em andamento' },
      { value: 'pausado', label: 'Pausado' },
      { value: 'concluido', label: 'Concluido' },
      { value: 'cancelado', label: 'Cancelado' }
    ]
  }

  return [
    { value: 'todos', label: 'Todos os status' },
    { value: 'refinar', label: 'A Refinar' },
    { value: 'fazer', label: 'A Fazer' },
    { value: 'em_progresso', label: 'Em Progresso' },
    { value: 'sob_revisao', label: 'Sob Revisao' },
    { value: 'concluido', label: 'Concluido' }
  ]
})

const projetoPorId = computed(() => {
  return new Map((projetos.value ?? []).map(projeto => [projeto.id, projeto]))
})

const membroEquipeLogado = computed(() => {
  const userId = user.value?.id || null
  if (!userId) return null

  return (equipeMembros.value || []).find((membro) => membro.uid === userId) || null
})

const identificadoresResponsavelUsuario = computed(() => {
  const metadata = user.value?.user_metadata || {}
  const candidates = new Set<string>()

  const addCandidate = (value: unknown) => {
    const normalized = normalizeResponsavelMatch(value)
    if (normalized) {
      candidates.add(normalized)
    }
  }

  addCandidate(metadata.nome)
  addCandidate(metadata.name)
  addCandidate(metadata.full_name)
  addCandidate(metadata.display_name)
  addCandidate(metadata.user_name)
  addCandidate(membroEquipeLogado.value?.nome)

  const emailPrefix = user.value?.email?.split('@')[0]?.replace(/[._-]+/g, ' ')
  addCandidate(emailPrefix)

  return Array.from(candidates)
})

const tarefasUsuario = computed(() => {
  const identificadores = new Set(identificadoresResponsavelUsuario.value)

  return (tarefasWorkspace.value ?? [])
    .filter((tarefa) => {
      const responsavel = normalizeResponsavelMatch(tarefa.responsavel_texto)
      return Boolean(responsavel) && identificadores.has(responsavel)
    })
    .map((tarefa) => ({
      ...tarefa,
      projeto: projetoPorId.value.get(tarefa.projeto_id) || null
    }))
    .sort((left, right) => {
      const leftPrazo = left.prazo_fim ? new Date(left.prazo_fim).getTime() : Number.MAX_SAFE_INTEGER
      const rightPrazo = right.prazo_fim ? new Date(right.prazo_fim).getTime() : Number.MAX_SAFE_INTEGER

      if (left.status === 'em_progresso' && right.status !== 'em_progresso') return -1
      if (right.status === 'em_progresso' && left.status !== 'em_progresso') return 1
      if (leftPrazo !== rightPrazo) return leftPrazo - rightPrazo
      return (right.updated_at || '').localeCompare(left.updated_at || '')
    })
})

const tarefasUsuarioFiltradas = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  return tarefasUsuario.value.filter((tarefa) => {
    if (filtroStatus.value !== 'todos' && tarefa.status !== filtroStatus.value) return false

    if (!termo) return true

    const values = [
      tarefa.titulo,
      tarefa.codigo || '',
      tarefa.projeto?.nome || '',
      tarefa.projeto?.cliente_nome || '',
      tarefa.tipo,
      ...(tarefa.tags || [])
    ].map(value => value.toLowerCase())

    return values.some(value => value.includes(termo))
  })
})

const minhasTarefasResumo = computed(() => {
  return tarefasUsuario.value.reduce((acc, tarefa) => {
    acc.total += 1
    if (tarefa.status === 'em_progresso') acc.emProgresso += 1
    if (tarefa.status === 'concluido') acc.concluidas += 1
    return acc
  }, {
    total: 0,
    emProgresso: 0,
    concluidas: 0
  })
})

// Meu Dia: resumo do dia em todos os projetos
const lancamentosDoDia = computed(() => lancamentosMeuDia.value ?? [])
const horasTrabalhadasHoje = computed(() =>
  lancamentosDoDia.value.reduce((acc, l) => acc + Number(l.horas || 0), 0)
)
const META_HORAS_DIA = 8
const progressoMetaDia = computed(() => {
  if (META_HORAS_DIA <= 0) return 0
  const p = (horasTrabalhadasHoje.value / META_HORAS_DIA) * 100
  return Math.round(Math.min(p, 100))
})
const dataDeHojeFormatada = computed(() => {
  const d = new Date(dataDeHoje.value + 'T12:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(d)
})
const tarefasWorkspacePorId = computed(() => new Map((tarefasWorkspace.value ?? []).map((t) => [t.id, t])))
interface TarefaDoDiaItem {
  tarefaId: number
  projetoId: number
  projetoNome: string
  codigo: string
  titulo: string
  status: ProjetoTarefa['status']
  horasHoje: number
}
const tarefasExecutadasHoje = computed(() => {
  const map = new Map<number, { projetoId: number; horas: number }>()
  for (const l of lancamentosDoDia.value) {
    const tid = l.tarefa_id
    if (tid == null) continue
    const horas = Number(l.horas || 0)
    const existing = map.get(tid)
    if (existing) {
      existing.horas += horas
    } else {
      map.set(tid, { projetoId: l.projeto_id, horas })
    }
  }
  const result: TarefaDoDiaItem[] = []
  for (const [tarefaId, { projetoId, horas }] of map) {
    const tarefa = tarefasWorkspacePorId.value.get(tarefaId)
    const projeto = projetoPorId.value.get(projetoId)
    result.push({
      tarefaId,
      projetoId,
      projetoNome: projeto?.nome ?? 'Projeto',
      codigo: tarefa?.codigo ?? `T-${tarefaId}`,
      titulo: tarefa?.titulo ?? 'Tarefa',
      status: tarefa?.status ?? 'refinar',
      horasHoje: horas
    })
  }
  result.sort((a, b) => b.horasHoje - a.horasHoje)
  return result
})
const statusLabelsMeuDia: Record<ProjetoTarefa['status'], string> = {
  refinar: 'Refinar',
  fazer: 'Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisão',
  concluido: 'Concluído'
}
function statusLabelMeuDia(s: ProjetoTarefa['status']) {
  return statusLabelsMeuDia[s] ?? s
}
function corStatusMeuDia(s: ProjetoTarefa['status']) {
  switch (s) {
    case 'concluido': return 'bg-emerald-500/20 text-emerald-400'
    case 'em_progresso': return 'bg-blue-500/20 text-blue-400'
    case 'sob_revisao': return 'bg-amber-500/20 text-amber-400'
    case 'fazer': return 'bg-zinc-500/20 text-zinc-400'
    default: return 'bg-zinc-600/20 text-zinc-300'
  }
}
function formatHorasMeuDia(value: number) {
  return Number((value || 0).toFixed(2)).toString()
}

const tarefasPorProjeto = computed(() => {
  const resumo = new Map<number, { total: number; concluidas: number }>()

  for (const tarefa of tarefasWorkspace.value ?? []) {
    const atual = resumo.get(tarefa.projeto_id) || { total: 0, concluidas: 0 }
    atual.total += 1

    if (tarefa.status === 'concluido') {
      atual.concluidas += 1
    }

    resumo.set(tarefa.projeto_id, atual)
  }

  return resumo
})

const projetosFiltrados = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()
  return (projetos.value ?? []).filter((p) => {
    if (filtroStatus.value !== 'todos' && p.status !== filtroStatus.value) return false
    
    if (termo) {
      const pNome = p.nome.toLowerCase()
      const pCliente = (p.cliente_nome || '').toLowerCase()
      if (!pNome.includes(termo) && !pCliente.includes(termo)) {
        return false
      }
    }
    return true
  })
})

function getProjetoTotalTarefas(projetoId: number) {
  return tarefasPorProjeto.value.get(projetoId)?.total || 0
}

function getProjetoTarefasConcluidas(projetoId: number) {
  return tarefasPorProjeto.value.get(projetoId)?.concluidas || 0
}

function getProjetoProgressoPercentual(projetoId: number) {
  const total = getProjetoTotalTarefas(projetoId)
  if (!total) return 0

  const concluidas = getProjetoTarefasConcluidas(projetoId)
  return Math.round((concluidas / total) * 100)
}

watch(abaAtiva, (nova) => {
  filtroBusca.value = ''
  filtroStatus.value = 'todos'
  if (nova === 'meu_dia') refreshMeuDia()
})

watch(
  tarefasWorkspace,
  () => {
    restaurarTimerDaWorkspace()
  },
  { immediate: true }
)

watch(
  () => workspaceTimer.value.stopRequestAt,
  async (stopRequestAt) => {
    if (!stopRequestAt) return
    if (stopRequestHandledAt.value === stopRequestAt) return
    stopRequestHandledAt.value = stopRequestAt
    await pararTimerAtual()
  }
)

onBeforeUnmount(() => {
  pararTickTimer()
})

function normalizeResponsavelMatch(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .toLowerCase()
}

function formatPrazoTarefa(inicio: string | null, fim: string | null) {
  if (!inicio && !fim) return 'A definir'
  if (!inicio && fim) return formatarData(fim)
  if (inicio && !fim) return formatarData(inicio)
  return `${formatarData(inicio as string)} -> ${formatarData(fim as string)}`
}

function formatHorasResumo(value: number | null | undefined) {
  return Number((value || 0).toFixed(2)).toString()
}

function calculateProgressPercent(horasEstimadas: number | null | undefined, horasExecutadas: number | null | undefined): number {
  const estimado = Math.max(0, Number(horasEstimadas || 0))
  const realizado = Math.max(0, Number(horasExecutadas || 0))

  if (estimado <= 0) {
    return realizado > 0 ? 100 : 0
  }

  return Math.max(0, Math.min(100, Math.round((realizado / estimado) * 100)))
}

function getTimerAutorTexto(fallback?: string | null) {
  const metadata = user.value?.user_metadata || {}
  const candidates = [
    metadata.nome,
    metadata.name,
    metadata.full_name,
    metadata.display_name,
    metadata.user_name,
    membroEquipeLogado.value?.nome,
    user.value?.email?.split('@')[0]?.replace(/[._-]+/g, ' '),
    fallback
  ]

  for (const candidate of candidates) {
    const normalized = String(candidate ?? '').trim()
    if (normalized) return normalized
  }

  return null
}

function getTimerAutorContext() {
  return {
    equipeId: membroEquipeLogado.value?.id ?? null,
    autorUid: user.value?.id ?? null,
  }
}

function getHorasExecutadasValueAt(tarefa: ProjetoTarefa, currentTickMs: number) {
  if (tarefaRodandoId.value !== tarefa.id || !timerInicioMs.value) {
    return Number(tarefa.horas_executadas || 0)
  }

  const elapsedSegundos = Math.floor((currentTickMs - timerInicioMs.value) / 1000)
  const totalSegundos = timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  return totalSegundos / 3600
}

function getHorasExecutadasDisplay(tarefa: ProjetoTarefa) {
  return formatHorasResumo(getHorasExecutadasValueAt(tarefa, tickMs.value))
}

function formatProgresso(value: number | null | undefined) {
  if (value === null || value === undefined) return '0%'
  return `${Math.max(0, Math.min(100, Math.round(Number(value))))}%`
}

function capitalizeLabel(value: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function iniciarTickTimer() {
  if (timerTickHandle) return
  timerTickHandle = setInterval(() => {
    tickMs.value = Date.now()
    atualizarWorkspaceTimerEstado()
  }, 1000)
}

function pararTickTimer() {
  if (!timerTickHandle) return
  clearInterval(timerTickHandle)
  timerTickHandle = null
}

function atualizarWorkspaceTimerEstado() {
  if (!tarefaRodandoId.value || !timerInicioMs.value) return

  const tarefaAtual = (tarefasWorkspace.value || []).find((t) => t.id === tarefaRodandoId.value)
  if (!tarefaAtual) return

  const elapsedSegundos = Math.floor((tickMs.value - timerInicioMs.value) / 1000)
  persistWorkspaceRunningTimerState({
    ...workspaceTimer.value,
    active: true,
    projetoId: tarefaAtual.projeto_id,
    tarefaId: tarefaAtual.id,
    tarefaCodigo: tarefaAtual.codigo || `T-${tarefaAtual.id}`,
    tarefaTitulo: tarefaAtual.titulo || '',
    startedAtMs: timerInicioMs.value,
    baseSegundos: timerBaseSegundos.value,
    elapsedSegundos: timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  })
}

function restaurarTimerDaWorkspace() {
  const timerAtivo = workspaceTimer.value
  if (!timerAtivo.active || !timerAtivo.tarefaId || !timerAtivo.startedAtMs) return

  const tarefaAtual = (tarefasWorkspace.value || []).find((t) => t.id === timerAtivo.tarefaId)
  if (!tarefaAtual) return

  tarefaRodandoId.value = tarefaAtual.id
  timerBaseSegundos.value = Math.max(0, Math.floor(timerAtivo.baseSegundos || 0))
  timerInicioMs.value = timerAtivo.startedAtMs
  tickMs.value = Date.now()
  atualizarWorkspaceTimerEstado()
  iniciarTickTimer()
}

function aplicarLancamentoTimerLocal(taskId: number, projetoId: number, horasSessao: number) {
  tarefasWorkspace.value = (tarefasWorkspace.value || []).map((tarefa) => {
    if (tarefa.id !== taskId) return tarefa

    const horasExecutadas = Number((Number(tarefa.horas_executadas || 0) + horasSessao).toFixed(4))
    return {
      ...tarefa,
      horas_executadas: horasExecutadas,
      progresso: calculateProgressPercent(tarefa.horas_estimadas, horasExecutadas)
    }
  })

  projetos.value = (projetos.value || []).map((projeto) =>
    projeto.id === projetoId
      ? { ...projeto, horas_executadas: Number((Number(projeto.horas_executadas || 0) + horasSessao).toFixed(4)) }
      : projeto
  )
}

async function registrarSessaoTimer(tarefa: ProjetoTarefa, duracaoSegundos: number, startedAtMs: number) {
  if (duracaoSegundos <= 0) {
    return true
  }

  const finalizadoEm = new Date()
  const iniciadoEm = new Date(startedAtMs)
  const horasSessao = Number((duracaoSegundos / 3600).toFixed(4))
  const autorContext = getTimerAutorContext()
  const { error } = await createLancamentoHora({
    projeto_id: tarefa.projeto_id,
    tarefa_id: tarefa.id,
    equipe_id: autorContext.equipeId,
    autor_uid: autorContext.autorUid,
    data: finalizadoEm.toISOString().slice(0, 10),
    descricao: `Cronometro: ${tarefa.codigo || `T-${tarefa.id}`} ${tarefa.titulo}`,
    horas: horasSessao,
    tipo: 'execucao',
    autor_texto: getTimerAutorTexto(tarefa.responsavel_texto),
    iniciado_em: iniciadoEm.toISOString(),
    finalizado_em: finalizadoEm.toISOString(),
    duracao_segundos: duracaoSegundos
  })

  if (error) {
    showAlert('Erro ao registrar sessão de tempo: ' + error, { title: 'Erro', type: 'error' })
    return false
  }

  aplicarLancamentoTimerLocal(tarefa.id, tarefa.projeto_id, horasSessao)
  return true
}

async function pararTimerAtual() {
  if (!tarefaRodandoId.value || !timerInicioMs.value) return true
  if (salvandoTimer.value) return false

  salvandoTimer.value = true
  const elapsedSegundos = Math.max(Math.floor((Date.now() - timerInicioMs.value) / 1000), 0)
  const taskId = tarefaRodandoId.value
  const tarefaAtual = (tarefasWorkspace.value || []).find((tarefa) => tarefa.id === taskId)

  const ok = tarefaAtual ? await registrarSessaoTimer(tarefaAtual, elapsedSegundos, timerInicioMs.value) : false
  salvandoTimer.value = false
  if (!ok) return false

  tarefaRodandoId.value = null
  timerInicioMs.value = null
  timerBaseSegundos.value = 0
  pararTickTimer()
  resetWorkspaceRunningTimerState()
  return true
}

async function toggleTimerTarefa(tarefa: ProjetoTarefa) {
  if (salvandoTimer.value) return

  if (tarefaRodandoId.value === tarefa.id) {
    const ok = await pararTimerAtual()
    if (ok) {
      showAlert('Cronometro pausado e sessão registrada.', { title: 'Tempo', type: 'info', duration: 1800 })
    }
    return
  }

  if (tarefaRodandoId.value && tarefaRodandoId.value !== tarefa.id) {
    const ok = await pararTimerAtual()
    if (!ok) return
  }

  tarefaRodandoId.value = tarefa.id
  timerBaseSegundos.value = Math.floor(Number(tarefa.horas_executadas || 0) * 3600)
  timerInicioMs.value = Date.now()
  tickMs.value = Date.now()
  atualizarWorkspaceTimerEstado()
  iniciarTickTimer()
  showAlert('Cronometro iniciado para esta tarefa.', { title: 'Tempo', type: 'success', duration: 1800 })
}

async function irParaEdicaoTarefa(tarefa: ProjetoTarefa) {
  await navigateTo(`/admin/projetos/${tarefa.projeto_id}/tarefas?tarefa=${tarefa.id}`)
}

async function alterarStatusMinhaTarefa(tarefa: ProjetoTarefa, novoStatus: ProjetoTarefa['status']) {
  if (tarefa.status === novoStatus) return

  const statusAnterior = tarefa.status
  tarefasWorkspace.value = (tarefasWorkspace.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, status: novoStatus } : item
  )

  const { error } = await updateTarefaStatus(tarefa.id, novoStatus)
  if (error) {
    tarefasWorkspace.value = (tarefasWorkspace.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, status: statusAnterior } : item
    )
    showAlert('Erro ao atualizar status: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  showAlert('Status atualizado com sucesso.', { title: 'Tarefa', type: 'success', duration: 1800 })
}

function formatarData(data: string) {
  if (!data) return ''
  const d = new Date(data + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d)
}
</script>
