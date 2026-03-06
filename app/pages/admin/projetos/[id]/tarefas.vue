<template>
  <div>
    <!-- Filtros rápidos -->
    <div class="flex items-center gap-3 mb-6">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar tarefa..."
        class="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand text-sm w-64"
      >
      <!-- Criar Tarefa Rapida -->
      <form @submit.prevent="criarNovaTarefa" class="flex flex-1 gap-2">
        <input 
          v-model="novaTarefaTitulo"
          required
          type="text"
          placeholder="Adicionar nova tarefa a Refinar (Enter para salvar)"
          class="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand text-sm"
        >
        <button
          type="submit"
          :disabled="criando"
          class="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          {{ criando ? '+' : '+' }}
        </button>
      </form>

      <div class="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/70 p-1">
        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          :class="modoVisualizacao === 'kanban' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800'"
          @click="modoVisualizacao = 'kanban'"
        >
          Kanban
        </button>
        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          :class="modoVisualizacao === 'lista' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800'"
          @click="modoVisualizacao = 'lista'"
        >
          Lista
        </button>
      </div>
    </div>

    <!-- Kanban Board -->
    <div v-if="modoVisualizacao === 'kanban'" class="overflow-x-auto pb-4">
      <div class="flex items-start gap-4 min-w-max">
        <section
          v-for="coluna in colunas"
          :key="coluna.status"
          class="w-80 flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 h-[600px]"
          @dragover.prevent
          @drop="onDrop(coluna.status)"
        >
          <!-- Cabeçalho Coluna -->
          <header class="mb-3 flex items-center justify-between gap-2 px-1">
            <div class="flex items-center gap-2">
              <div 
                class="w-2.5 h-2.5 rounded-full"
                :class="{
                  'bg-purple-500': coluna.status === 'refinar',
                  'bg-orange-400': coluna.status === 'fazer',
                  'bg-blue-500': coluna.status === 'em_progresso',
                  'bg-yellow-400': coluna.status === 'sob_revisao',
                  'bg-emerald-500': coluna.status === 'concluido',
                }"
              />
              <h3 class="text-sm font-semibold text-zinc-200">{{ coluna.titulo }}</h3>
            </div>
            <span class="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{{ tarefasPorStatus[coluna.status]?.length || 0 }}</span>
          </header>

          <!-- Itens -->
          <div class="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <article
              v-for="t in tarefasPorStatus[coluna.status]"
              :key="t.id"
              draggable="true"
              @dragstart="onDragStart(t.id)"
              class="rounded-lg border border-zinc-800 bg-zinc-950 p-3 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors group"
            >
              <div class="flex justify-between items-start gap-2 mb-2">
                <span class="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{{ t.codigo || 'T-' + t.id }}</span>
                <span 
                  class="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium"
                  :class="{
                    'bg-red-500/10 text-red-400': t.prioridade === 'urgente',
                    'bg-orange-500/10 text-orange-400': t.prioridade === 'alta',
                    'bg-blue-500/10 text-blue-400': t.prioridade === 'media',
                    'bg-zinc-800 text-zinc-400': t.prioridade === 'baixa',
                  }"
                >{{ t.prioridade }}</span>
              </div>
              <p class="text-sm text-zinc-100 font-medium leading-snug mb-3">
                {{ t.titulo }}
              </p>
              
              <div class="flex items-center justify-between text-xs text-zinc-500">
                <div class="flex items-center gap-2">
                  <span v-if="t.horas_estimadas" class="flex flex-col">
                    <span class="text-[10px]">Horas</span>
                    <span class="font-medium text-zinc-300">{{ getHorasExecutadasDisplay(t) }}/{{ t.horas_estimadas }}h</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleTimerTarefa(t)"
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-900 hover:opacity-90"
                    :title="tarefaRodandoId === t.id ? 'Pausar' : 'Iniciar'"
                  >
                    {{ tarefaRodandoId === t.id ? '||' : '>' }}
                  </button>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editarTarefa(t.id)" class="text-brand hover:underline">Editar</button>
                    <button @click="excluirTarefa(t.id)" class="text-red-400 hover:underline">Excluir</button>
                  </div>
                </div>
              </div>
            </article>

            <div v-if="!tarefasPorStatus[coluna.status]?.length" class="h-10 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-600">
               Solte aqui
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Lista por Status -->
    <div v-else class="space-y-4">
      <section
        v-for="coluna in colunas"
        :key="`lista-${coluna.status}`"
        class="overflow-visible rounded-xl border border-zinc-800 bg-zinc-900/40"
        :class="statusBorderLeftClass[coluna.status]"
      >
        <header class="flex items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2">
          <div class="flex items-center gap-2">
            <span
              class="h-2 w-2 rounded-full"
              :class="{
                'bg-purple-500': coluna.status === 'refinar',
                'bg-orange-400': coluna.status === 'fazer',
                'bg-blue-500': coluna.status === 'em_progresso',
                'bg-yellow-400': coluna.status === 'sob_revisao',
                'bg-emerald-500': coluna.status === 'concluido',
              }"
            />
            <h3 class="text-sm font-semibold text-zinc-100">{{ coluna.titulo }}</h3>
            <span class="text-xs text-zinc-400">{{ tarefasPorStatus[coluna.status]?.length || 0 }}</span>
          </div>
        </header>

        <div class="overflow-x-auto overflow-y-visible">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-zinc-800 bg-zinc-950/50">
                <th class="w-[4%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  <input type="checkbox" class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-brand focus:ring-brand">
                </th>
                <th class="w-[36%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tarefa</th>
                <th class="w-[8%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Resp.</th>
                <th class="w-[14%] px-0 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th class="w-[14%] px-0 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tipo</th>
                <th class="w-[14%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Prazo</th>
                <th class="w-[10%] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Horas</th>
                <th class="w-[8%] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Progresso</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in tarefasPorStatus[coluna.status]"
                :key="`lista-row-${t.id}`"
                class="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
              >
                <td class="px-3 py-3 align-middle">
                  <input type="checkbox" class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-brand focus:ring-brand">
                </td>
                <td class="px-4 py-3 align-middle">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">{{ t.codigo || `T-${t.id}` }}</span>
                    <span class="text-sm font-medium text-zinc-100">{{ t.titulo }}</span>
                  </div>
                </td>
                <td class="px-3 py-3 align-middle">
                  <div class="flex items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-semibold text-zinc-100">
                      {{ getResponsavelInitials(t.responsavel_texto) }}
                    </div>
                  </div>
                </td>
                <td class="px-0 py-0 align-middle">
                  <select
                    :value="t.status"
                    class="h-12 w-full appearance-none border-x border-zinc-800 text-center text-sm font-semibold text-white focus:outline-none"
                    :class="statusCellClass[t.status]"
                    @change="alterarStatusInline(t, ($event.target as HTMLSelectElement).value as ProjetoTarefa['status'])"
                  >
                    <option v-for="opcao in statusOptions" :key="`status-${t.id}-${opcao.value}`" :value="opcao.value">
                      {{ opcao.label }}
                    </option>
                  </select>
                </td>
                <td class="px-0 py-0 align-middle">
                  <select
                    :value="t.tipo"
                    class="h-12 w-full appearance-none border-r border-zinc-800 text-center text-sm font-semibold text-white focus:outline-none"
                    :class="tipoCellClass[t.tipo]"
                    @change="alterarTipoInline(t, ($event.target as HTMLSelectElement).value as ProjetoTarefa['tipo'])"
                  >
                    <option v-for="opcao in tipoOptions" :key="`tipo-${t.id}-${opcao.value}`" :value="opcao.value">
                      {{ opcao.label }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-3 align-middle text-sm text-zinc-300">{{ formatPrazoRange(t) }}</td>
                <td class="px-4 py-3 align-middle text-sm text-zinc-200">
                  <div class="flex items-center justify-between gap-2">
                    <span>
                      <span class="font-semibold text-brand">{{ getHorasExecutadasDisplay(t) }}</span>
                      <span class="text-zinc-400"> / {{ formatHoras(t.horas_estimadas || 0) }}h</span>
                    </span>
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-900 hover:opacity-90"
                      @click="toggleTimerTarefa(t)"
                    >
                      {{ tarefaRodandoId === t.id ? '||' : '>' }}
                    </button>
                  </div>
                </td>
                <td class="px-3 py-3 align-middle text-xs text-zinc-400">{{ formatProgresso(t.progresso) }}</td>
              </tr>

              <tr v-if="!tarefasPorStatus[coluna.status]?.length">
                <td colspan="8" class="px-4 py-3 text-xs text-zinc-600">Nenhuma tarefa nesta etapa.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="!tarefasFiltradas.length" class="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
        Nenhuma tarefa encontrada para o filtro atual.
      </div>
    </div>

    <div
      v-if="modalEdicaoAberto"
      class="fixed inset-0 z-[10020] flex items-center justify-center bg-black/70 p-4"
      @click.self="fecharModalEdicao"
    >
      <div class="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div class="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h3 class="text-lg font-semibold text-zinc-100">Editar Tarefa</h3>
          <button
            type="button"
            class="rounded-md p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            @click="fecharModalEdicao"
          >
            x
          </button>
        </div>

        <form class="space-y-4 p-5" @submit.prevent="salvarEdicaoTarefa">
          <div>
            <label class="mb-1 block text-sm font-medium text-zinc-300">Titulo</label>
            <input
              v-model="formEdicao.titulo"
              type="text"
              required
              class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:outline-none"
            >
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Status</label>
              <select
                v-model="formEdicao.status"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
                <option value="refinar">A Refinar</option>
                <option value="fazer">A Fazer</option>
                <option value="em_progresso">Em Progresso</option>
                <option value="sob_revisao">Sob Revisao</option>
                <option value="concluido">Concluido</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Prioridade</label>
              <select
                v-model="formEdicao.prioridade"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Horas estimadas</label>
              <input
                v-model.number="formEdicao.horas_estimadas"
                type="number"
                min="0"
                step="0.5"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Data de inicio</label>
              <input
                v-model="formEdicao.prazo_inicio"
                type="date"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Prazo</label>
              <input
                v-model="formEdicao.prazo_fim"
                type="date"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-brand focus:outline-none"
              >
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-300">Responsavel</label>
              <select
                v-model="formEdicao.responsavel_texto"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-brand focus:outline-none"
              >
                <option value="">Sem responsavel</option>
                <option
                  v-for="membro in equipeOptions"
                  :key="membro.id"
                  :value="membro.nome"
                >
                  {{ membro.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
              @click="fecharModalEdicao"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="salvandoEdicao"
              class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ salvandoEdicao ? 'Salvando...' : 'Salvar alteracoes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace, ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import { fetchTarefasByProjetoId, updateTarefaStatus, createTarefa, deleteTarefa, updateTarefa, fetchEquipeMembros } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const { showConfirm, showAlert } = useUiFeedback()

const { data: tarefas, pending, refresh } = await useAsyncData(
  `tarefas-proj-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const { data: equipeMembros, refresh: refreshEquipeMembros } = await useAsyncData(
  `admin-equipe-membros-tarefas-${props.projeto.id}`,
  () => fetchEquipeMembros(),
  {
    server: false,
    default: () => []
  }
)

const colunas = [
  { status: 'refinar', titulo: 'A Refinar' },
  { status: 'fazer', titulo: 'A Fazer' },
  { status: 'em_progresso', titulo: 'Em Progresso' },
  { status: 'sob_revisao', titulo: 'Sob Revisão' },
  { status: 'concluido', titulo: 'Concluído' }
] as const

const filtroBusca = ref('')
const modoVisualizacao = ref<'kanban' | 'lista'>('kanban')
const novaTarefaTitulo = ref('')
const criando = ref(false)
const dragId = ref<number | null>(null)
const modalEdicaoAberto = ref(false)
const salvandoEdicao = ref(false)
const tarefaEditandoId = ref<number | null>(null)
const tarefaRodandoId = ref<number | null>(null)
const timerInicioMs = ref<number | null>(null)
const timerBaseSegundos = ref(0)
const tickMs = ref(Date.now())
let timerTickHandle: ReturnType<typeof setInterval> | null = null
const salvandoTimer = ref(false)
const workspaceTimer = useWorkspaceRunningTimerState()
const stopRequestHandledAt = ref<number | null>(null)
const formEdicao = reactive({
  titulo: '',
  status: 'refinar' as ProjetoTarefa['status'],
  prioridade: 'media' as ProjetoTarefa['prioridade'],
  horas_estimadas: 0,
  prazo_inicio: '',
  prazo_fim: '',
  responsavel_texto: '',
})

const equipeOptions = computed(() => {
  return (equipeMembros.value || [])
    .filter((membro) => Boolean(membro.nome))
    .map((membro) => {
      const nome = (membro.nome || '').trim()
      const cargo = (membro.cargo || '').trim()
      return {
        id: membro.id,
        nome,
        label: cargo ? `${nome} (${cargo})` : nome
      }
    })
})

const statusLabels: Record<ProjetoTarefa['status'], string> = {
  refinar: 'A Refinar',
  fazer: 'A Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisao',
  concluido: 'Concluido'
}

const statusCellClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-purple-600',
  fazer: 'bg-amber-500',
  em_progresso: 'bg-blue-600',
  sob_revisao: 'bg-orange-500',
  concluido: 'bg-emerald-600'
}

const statusOptions: Array<{ value: ProjetoTarefa['status']; label: string }> = [
  { value: 'refinar', label: 'Refinar' },
  { value: 'fazer', label: 'Fazer' },
  { value: 'em_progresso', label: 'Em Progresso' },
  { value: 'sob_revisao', label: 'Sob Revisao' },
  { value: 'concluido', label: 'Concluido' }
]

const tipoCellClass: Record<ProjetoTarefa['tipo'], string> = {
  funcionalidade: 'bg-emerald-600',
  bug: 'bg-red-600',
  melhoria: 'bg-fuchsia-600',
  documentacao: 'bg-sky-600',
  design: 'bg-violet-600'
}

const tipoOptions: Array<{ value: ProjetoTarefa['tipo']; label: string }> = [
  { value: 'funcionalidade', label: 'Funcionalidade' },
  { value: 'bug', label: 'Bug' },
  { value: 'melhoria', label: 'Refatura' },
  { value: 'documentacao', label: 'Documentacao' },
  { value: 'design', label: 'Design' }
]

const statusClasses: Record<ProjetoTarefa['status'], string> = {
  refinar: 'bg-purple-500/10 text-purple-300',
  fazer: 'bg-orange-500/10 text-orange-300',
  em_progresso: 'bg-blue-500/10 text-blue-300',
  sob_revisao: 'bg-yellow-500/10 text-yellow-300',
  concluido: 'bg-emerald-500/10 text-emerald-300'
}

const statusBorderLeftClass: Record<ProjetoTarefa['status'], string> = {
  refinar: 'border-l-2 border-l-purple-500/80',
  fazer: 'border-l-2 border-l-orange-400/80',
  em_progresso: 'border-l-2 border-l-blue-500/80',
  sob_revisao: 'border-l-2 border-l-yellow-400/80',
  concluido: 'border-l-2 border-l-emerald-500/80'
}

const tarefasFiltradas = computed(() => {
  const termo = filtroBusca.value.toLowerCase().trim()
  return (tarefas.value || []).filter((t) => {
    if (!termo) return true
    return t.titulo.toLowerCase().includes(termo) || (t.codigo || '').toLowerCase().includes(termo)
  })
})

const tarefasPorStatus = computed(() => {
  const map = Object.fromEntries(colunas.map(c => [c.status, [] as ProjetoTarefa[]])) as Record<string, ProjetoTarefa[]>

  for (const t of tarefasFiltradas.value) {
    if (map[t.status]) {
      map[t.status].push(t)
    }
  }
  return map
})

function formatHoras(value: number): string {
  return Number((value || 0).toFixed(2)).toString()
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return ''
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : ''
}

function capitalizeLabel(value: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getResponsavelInitials(nome: string | null): string {
  if (!nome) return '-'
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '-'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
}

function formatPrazoRange(t: ProjetoTarefa): string {
  const toDate = (value: string | null) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d
  }

  const inicio = toDate(t.prazo_inicio)
  const fim = toDate(t.prazo_fim)

  const fmt = (d: Date | null) => d
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(d)
      .replace('.', '')
    : '--'

  if (!inicio && !fim) return '--'
  if (!inicio && fim) return fmt(fim)
  if (inicio && !fim) return fmt(inicio)
  return `${fmt(inicio)} -> ${fmt(fim)}`
}

async function selecionarStatus(tarefa: ProjetoTarefa, novoStatus: ProjetoTarefa['status']) {
  if (tarefa.status === novoStatus) return

  const statusAnterior = tarefa.status
  tarefas.value = (tarefas.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, status: novoStatus } : item
  )

  const { error } = await updateTarefaStatus(tarefa.id, novoStatus)
  if (error) {
    tarefas.value = (tarefas.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, status: statusAnterior } : item
    )
    showAlert('Erro ao atualizar status: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  await refresh()
}

async function selecionarTipo(tarefa: ProjetoTarefa, novoTipo: ProjetoTarefa['tipo']) {
  if (tarefa.tipo === novoTipo) return

  const tipoAnterior = tarefa.tipo
  tarefas.value = (tarefas.value || []).map((item) =>
    item.id === tarefa.id ? { ...item, tipo: novoTipo } : item
  )

  const { error } = await updateTarefa(tarefa.id, { tipo: novoTipo })
  if (error) {
    tarefas.value = (tarefas.value || []).map((item) =>
      item.id === tarefa.id ? { ...item, tipo: tipoAnterior } : item
    )
    showAlert('Erro ao atualizar tipo: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  await refresh()
}

async function alterarStatusInline(tarefa: ProjetoTarefa, novoStatus: ProjetoTarefa['status']) {
  await selecionarStatus(tarefa, novoStatus)
}

async function alterarTipoInline(tarefa: ProjetoTarefa, novoTipo: ProjetoTarefa['tipo']) {
  await selecionarTipo(tarefa, novoTipo)
}

function formatPrazo(t: ProjetoTarefa): string {
  if (!t.prazo_inicio && !t.prazo_fim) return '-'

  const toDate = (value: string | null) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d
  }

  const inicio = toDate(t.prazo_inicio)
  const fim = toDate(t.prazo_fim)

  const fmt = (d: Date | null) => d
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
    : '-'

  if (!inicio && fim) return fmt(fim)
  if (inicio && !fim) return fmt(inicio)
  return `${fmt(inicio)} - ${fmt(fim)}`
}

function formatProgresso(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `${Math.max(0, Math.min(100, Math.round(Number(value))))}%`
}

function getHorasExecutadasValue(t: ProjetoTarefa): number {
  if (tarefaRodandoId.value !== t.id || !timerInicioMs.value) {
    return Number(t.horas_executadas || 0)
  }

  const elapsedSegundos = Math.floor((tickMs.value - timerInicioMs.value) / 1000)
  const totalSegundos = timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  return totalSegundos / 3600
}

function getHorasExecutadasDisplay(t: ProjetoTarefa): string {
  return formatHoras(getHorasExecutadasValue(t))
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

  const tarefaAtual = (tarefas.value || []).find((t) => t.id === tarefaRodandoId.value)
  if (!tarefaAtual) return

  const elapsedSegundos = Math.floor((tickMs.value - timerInicioMs.value) / 1000)
  workspaceTimer.value = {
    ...workspaceTimer.value,
    active: true,
    projetoId: props.projeto.id,
    tarefaId: tarefaAtual.id,
    tarefaCodigo: tarefaAtual.codigo || `T-${tarefaAtual.id}`,
    tarefaTitulo: tarefaAtual.titulo || '',
    startedAtMs: timerInicioMs.value,
    baseSegundos: timerBaseSegundos.value,
    elapsedSegundos: timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  }
}

async function persistirHorasExecutadas(id: number, horasExecutadas: number) {
  const { error } = await updateTarefa(id, {
    horas_executadas: Number(horasExecutadas.toFixed(4))
  })

  if (error) {
    showAlert('Erro ao salvar horas da tarefa: ' + error, { title: 'Erro', type: 'error' })
    return false
  }

  tarefas.value = (tarefas.value || []).map((t) =>
    t.id === id ? { ...t, horas_executadas: Number(horasExecutadas.toFixed(4)) } : t
  )

  return true
}

async function pararTimerAtual() {
  if (!tarefaRodandoId.value || !timerInicioMs.value) return true
  if (salvandoTimer.value) return false

  salvandoTimer.value = true
  const elapsedSegundos = Math.floor((Date.now() - timerInicioMs.value) / 1000)
  const totalSegundos = timerBaseSegundos.value + Math.max(elapsedSegundos, 0)
  const totalHoras = totalSegundos / 3600
  const taskId = tarefaRodandoId.value

  const ok = await persistirHorasExecutadas(taskId, totalHoras)
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
      showAlert('Cronometro pausado.', { title: 'Tempo', type: 'info', duration: 1800 })
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

watch(
  () => workspaceTimer.value.stopRequestAt,
  async (stopRequestAt) => {
    if (!stopRequestAt) return
    if (stopRequestHandledAt.value === stopRequestAt) return
    stopRequestHandledAt.value = stopRequestAt

    if (!workspaceTimer.value.active) return
    if (workspaceTimer.value.projetoId !== props.projeto.id) return

    await pararTimerAtual()
  }
)

onBeforeUnmount(() => {
  pararTickTimer()
  resetWorkspaceRunningTimerState()
})

function onDragStart(id: number) {
  dragId.value = id
}

async function onDrop(newStatus: string) {
  const id = dragId.value
  dragId.value = null
  if (!id) return

  const current = tarefas.value || []
  const idx = current.findIndex(x => x.id === id)
  if (idx === -1) return

  const tarefaAtual = current[idx]
  if (tarefaAtual.status === newStatus) return

  const oldStatus = tarefaAtual.status

  // Atualiza de forma imutavel para garantir reatividade imediata no computed
  tarefas.value = current.map((t) =>
    t.id === id ? { ...t, status: newStatus as ProjetoTarefa['status'] } : t
  )

  const { error } = await updateTarefaStatus(id, newStatus as ProjetoTarefa['status'])
  if (error) {
    tarefas.value = (tarefas.value || []).map((t) =>
      t.id === id ? { ...t, status: oldStatus } : t
    )
    alert('Erro ao mover tarefa: ' + error)
    return
  }

  await refresh()
}

async function criarNovaTarefa() {
  if (!novaTarefaTitulo.value.trim()) return
  criando.value = true
  const { error } = await createTarefa({
    projeto_id: props.projeto.id,
    titulo: novaTarefaTitulo.value.trim(),
    status: 'refinar',
    prioridade: 'media',
    tipo: 'funcionalidade'
  })
  
  if (!error) {
    novaTarefaTitulo.value = ''
    refresh()
  } else {
    alert('Erro ao criar: ' + error)
  }
  criando.value = false
}

async function editarTarefa(id: number) {
  if (!(equipeMembros.value || []).length) {
    await refreshEquipeMembros()
  }

  const tarefa = (tarefas.value || []).find((t) => t.id === id)
  if (!tarefa) {
    showAlert('Tarefa nao encontrada para edicao.', { title: 'Aviso', type: 'warning' })
    return
  }

  tarefaEditandoId.value = tarefa.id
  formEdicao.titulo = tarefa.titulo || ''
  formEdicao.status = tarefa.status
  formEdicao.prioridade = tarefa.prioridade
  formEdicao.horas_estimadas = Number(tarefa.horas_estimadas) || 0
  formEdicao.prazo_inicio = toDateInputValue(tarefa.prazo_inicio)
  formEdicao.prazo_fim = toDateInputValue(tarefa.prazo_fim)
  formEdicao.responsavel_texto = tarefa.responsavel_texto || ''
  modalEdicaoAberto.value = true
}

function fecharModalEdicao() {
  if (salvandoEdicao.value) return
  modalEdicaoAberto.value = false
  tarefaEditandoId.value = null
}

async function salvarEdicaoTarefa() {
  if (!tarefaEditandoId.value) return
  if (!formEdicao.titulo.trim()) {
    showAlert('Informe um titulo para a tarefa.', { title: 'Aviso', type: 'warning' })
    return
  }
  if (formEdicao.prazo_inicio && formEdicao.prazo_fim && formEdicao.prazo_fim < formEdicao.prazo_inicio) {
    showAlert('A data de fim deve ser maior ou igual a data de inicio.', { title: 'Aviso', type: 'warning' })
    return
  }

  salvandoEdicao.value = true
  const id = tarefaEditandoId.value

  const payload = {
    titulo: formEdicao.titulo.trim(),
    status: formEdicao.status,
    prioridade: formEdicao.prioridade,
    horas_estimadas: Number(formEdicao.horas_estimadas) || 0,
    prazo_inicio: formEdicao.prazo_inicio || null,
    prazo_fim: formEdicao.prazo_fim || null,
    responsavel_texto: formEdicao.responsavel_texto.trim() || null,
  }

  const { error } = await updateTarefa(id, payload)
  if (error) {
    showAlert('Erro ao salvar tarefa: ' + error, { title: 'Erro', type: 'error' })
    salvandoEdicao.value = false
    return
  }

  tarefas.value = (tarefas.value || []).map((t) =>
    t.id === id ? { ...t, ...payload } : t
  )

  await refresh()
  salvandoEdicao.value = false
  modalEdicaoAberto.value = false
  tarefaEditandoId.value = null
  showAlert('Tarefa atualizada com sucesso.', { title: 'Sucesso', type: 'success' })
}

async function excluirTarefa(id: number) {
  if (tarefaRodandoId.value === id) {
    const okStop = await pararTimerAtual()
    if (!okStop) return
  }

  const ok = await showConfirm({
    title: 'Excluir tarefa',
    message: 'Deseja realmente excluir esta tarefa? Esta ação não pode ser desfeita.',
    confirmLabel: 'Excluir tarefa',
    cancelLabel: 'Cancelar',
    danger: true,
  })
  if (!ok) return

  const { error } = await deleteTarefa(id)
  if (error) {
    showAlert('Erro ao excluir tarefa: ' + error, { title: 'Erro', type: 'error' })
    return
  }

  refresh()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
  border-radius: 10px;
}
</style>