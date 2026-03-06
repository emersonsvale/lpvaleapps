<template>
  <div v-if="pending" class="p-6 text-zinc-400">Carregando workspace...</div>
  <div v-else-if="error || !projeto" class="p-6 text-red-400">
    Erro ao carregar projeto ou projeto não encontrado.
  </div>
  <div v-else class="space-y-6">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <div class="w-8 h-8 rounded bg-brand/10 flex items-center justify-center">
            <PhFolderOpen class="w-4 h-4 text-brand" />
          </div>
          <h1 class="text-2xl font-semibold text-zinc-100">{{ projeto.nome }}</h1>
          <span 
            class="text-[11px] px-2 py-0.5 rounded-md font-medium"
            :class="{
              'bg-zinc-800 text-zinc-300': projeto.status === 'iniciando',
              'bg-blue-500/20 text-blue-400': projeto.status === 'em_andamento',
              'bg-orange-500/20 text-orange-400': projeto.status === 'pausado',
              'bg-emerald-500/20 text-emerald-400': projeto.status === 'concluido',
              'bg-red-500/20 text-red-400': projeto.status === 'cancelado'
            }"
          >
            {{ projeto.status === 'em_andamento' ? 'Em andamento' : projeto.status === 'concluido' ? 'Concluído' : projeto.status.charAt(0).toUpperCase() + projeto.status.slice(1) }}
          </span>
        </div>
        <p class="text-sm text-zinc-400 flex items-center gap-2">
          <span>Cliente: {{ projeto.cliente_nome || 'Nenhum' }}</span>
        </p>
      </div>
      <div>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors"
          @click="abrirModalNovaTarefa"
        >
          + Nova Tarefa
        </button>
      </div>
    </header>

    <!-- Tabs Horizontais -->
    <nav class="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        type="button"
        class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors"
        :class="route.path === tab.path || (tab.exact === false && route.path.startsWith(tab.path)) ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
        @click="irParaAba(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Conteúdo da Aba -->
    <NuxtPage :key="route.fullPath" :projeto="projeto" @refresh="refresh" />

    <!-- Modal Nova Tarefa -->
    <div v-if="modalNovaTarefaAberto" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        class="absolute inset-0 bg-black/70"
        @click="fecharModalNovaTarefa"
      />

      <div class="relative w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <header class="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 class="text-3xl font-semibold text-zinc-100">Nova Tarefa</h2>
          <button
            type="button"
            class="text-zinc-500 hover:text-zinc-300"
            @click="fecharModalNovaTarefa"
          >
            x
          </button>
        </header>

        <form class="space-y-4 px-6 py-5" @submit.prevent="salvarNovaTarefa">
          <div>
            <label for="nova-tarefa-titulo" class="mb-1 block text-sm font-medium text-zinc-200">Titulo</label>
            <input
              id="nova-tarefa-titulo"
              v-model="formNovaTarefa.titulo"
              type="text"
              required
              placeholder="Nome da tarefa..."
              class="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            >
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="nova-tarefa-area" class="mb-1 block text-sm font-medium text-zinc-200">Area</label>
              <select
                id="nova-tarefa-area"
                v-model="formNovaTarefa.tipo"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                <option disabled value="">Selecionar</option>
                <option v-for="opcao in opcoesArea" :key="opcao.value" :value="opcao.value">{{ opcao.label }}</option>
              </select>
            </div>

            <div>
              <label for="nova-tarefa-etapa" class="mb-1 block text-sm font-medium text-zinc-200">Etapa</label>
              <select
                id="nova-tarefa-etapa"
                v-model="formNovaTarefa.status"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                <option v-for="opcao in opcoesEtapa" :key="opcao.value" :value="opcao.value">{{ opcao.label }}</option>
              </select>
            </div>
          </div>

          <div>
            <label for="nova-tarefa-responsavel" class="mb-1 block text-sm font-medium text-zinc-200">Responsavel</label>
            <select
              id="nova-tarefa-responsavel"
              v-model="formNovaTarefa.responsavel_texto"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
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

          <div>
            <label for="nova-tarefa-horas-estimadas" class="mb-1 block text-sm font-medium text-zinc-200">Horas estimadas</label>
            <input
              id="nova-tarefa-horas-estimadas"
              v-model.number="formNovaTarefa.horas_estimadas"
              type="number"
              min="0"
              step="0.5"
              placeholder="Ex: 8"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
            >
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="nova-tarefa-prazo-inicio" class="mb-1 block text-sm font-medium text-zinc-200">Data de inicio</label>
              <input
                id="nova-tarefa-prazo-inicio"
                v-model="formNovaTarefa.prazo_inicio"
                type="date"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
            </div>

            <div>
              <label for="nova-tarefa-prazo" class="mb-1 block text-sm font-medium text-zinc-200">Data de fim (prazo)</label>
              <input
                id="nova-tarefa-prazo"
                v-model="formNovaTarefa.prazo_fim"
                type="date"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
            </div>
          </div>

          <p v-if="erroNovaTarefa" class="text-sm text-red-400">{{ erroNovaTarefa }}</p>

          <footer class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              class="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 hover:bg-zinc-800"
              @click="fecharModalNovaTarefa"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="salvandoNovaTarefa || !formNovaTarefa.titulo.trim() || !formNovaTarefa.tipo"
              class="rounded-lg bg-zinc-100 px-4 py-2 text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ salvandoNovaTarefa ? 'Criando...' : 'Criar Tarefa' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhFolderOpen } from '@phosphor-icons/vue'
import { createTarefa, fetchEquipeMembros, fetchProjetoWorkspaceById, type ProjetoTarefa } from '~/composables/useProjetosWorkspace'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const projetoId = Number(route.params.id)

const { data: projeto, pending, error, refresh } = await useAsyncData(
  `admin-projeto-${projetoId}`,
  () => fetchProjetoWorkspaceById(projetoId),
  {
    server: false,
    default: () => null
  }
)

const { data: equipeMembros, refresh: refreshEquipeMembros } = await useAsyncData(
  `admin-equipe-membros-${projetoId}`,
  () => fetchEquipeMembros(),
  {
    server: false,
    default: () => []
  }
)

const tabs = computed(() => {
  const base = `/admin/projetos/${projetoId}`
  return [
    { label: 'Resumo', path: base, exact: true },
    { label: 'Tarefas', path: `${base}/tarefas`, exact: false },
    { label: 'Requisitos', path: `${base}/requisitos`, exact: false },
    { label: 'Documentação', path: `${base}/documentacao`, exact: false },
    // Outras abas (Arvore, Extrato, Gantt, Releases, Configuracoes)
    { label: 'Extrato de Horas', path: `${base}/extrato`, exact: false },
    { label: 'Configurações', path: `${base}/configuracoes`, exact: false }
  ]
})

const modalNovaTarefaAberto = ref(false)
const salvandoNovaTarefa = ref(false)
const erroNovaTarefa = ref<string | null>(null)

const opcoesArea: Array<{ label: string; value: ProjetoTarefa['tipo'] }> = [
  { label: 'Funcionalidade', value: 'funcionalidade' },
  { label: 'Bug', value: 'bug' },
  { label: 'Melhoria', value: 'melhoria' },
  { label: 'Documentacao', value: 'documentacao' },
  { label: 'Design', value: 'design' }
]

const opcoesEtapa: Array<{ label: string; value: ProjetoTarefa['status'] }> = [
  { label: 'Refinar', value: 'refinar' },
  { label: 'Fazer', value: 'fazer' },
  { label: 'Em Progresso', value: 'em_progresso' },
  { label: 'Sob Revisao', value: 'sob_revisao' },
  { label: 'Concluido', value: 'concluido' }
]

const formNovaTarefa = reactive<{
  titulo: string
  tipo: '' | ProjetoTarefa['tipo']
  status: ProjetoTarefa['status']
  responsavel_texto: string
  horas_estimadas: number
  prazo_inicio: string
  prazo_fim: string
}>({
  titulo: '',
  tipo: '',
  status: 'refinar',
  responsavel_texto: '',
  horas_estimadas: 0,
  prazo_inicio: '',
  prazo_fim: ''
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

function resetFormNovaTarefa() {
  formNovaTarefa.titulo = ''
  formNovaTarefa.tipo = ''
  formNovaTarefa.status = 'refinar'
  formNovaTarefa.responsavel_texto = ''
  formNovaTarefa.horas_estimadas = 0
  formNovaTarefa.prazo_inicio = ''
  formNovaTarefa.prazo_fim = ''
  erroNovaTarefa.value = null
}

async function abrirModalNovaTarefa() {
  if (!(equipeMembros.value || []).length) {
    await refreshEquipeMembros()
  }
  modalNovaTarefaAberto.value = true
  erroNovaTarefa.value = null
}

function fecharModalNovaTarefa() {
  if (salvandoNovaTarefa.value) return
  modalNovaTarefaAberto.value = false
  resetFormNovaTarefa()
}

async function salvarNovaTarefa() {
  if (!projeto.value) return
  if (!formNovaTarefa.titulo.trim()) {
    erroNovaTarefa.value = 'Informe o titulo da tarefa.'
    return
  }
  if (!formNovaTarefa.tipo) {
    erroNovaTarefa.value = 'Selecione uma area para a tarefa.'
    return
  }
  if (formNovaTarefa.prazo_inicio && formNovaTarefa.prazo_fim && formNovaTarefa.prazo_fim < formNovaTarefa.prazo_inicio) {
    erroNovaTarefa.value = 'A data de fim deve ser maior ou igual a data de inicio.'
    return
  }

  salvandoNovaTarefa.value = true
  erroNovaTarefa.value = null

  const { error } = await createTarefa({
    projeto_id: projeto.value.id,
    titulo: formNovaTarefa.titulo.trim(),
    tipo: formNovaTarefa.tipo,
    status: formNovaTarefa.status,
    prioridade: 'media',
    responsavel_texto: formNovaTarefa.responsavel_texto || null,
    horas_estimadas: Number(formNovaTarefa.horas_estimadas) || 0,
    prazo_inicio: formNovaTarefa.prazo_inicio || null,
    prazo_fim: formNovaTarefa.prazo_fim || null
  })

  if (error) {
    erroNovaTarefa.value = error
    salvandoNovaTarefa.value = false
    return
  }

  await refreshNuxtData(`tarefas-proj-${projeto.value.id}`)
  salvandoNovaTarefa.value = false
  modalNovaTarefaAberto.value = false
  resetFormNovaTarefa()

  if (!route.path.endsWith('/tarefas')) {
    await navigateTo(`/admin/projetos/${projeto.value.id}/tarefas`)
  }
}

function irParaAba(path: string) {
  if (route.path === path) return
  navigateTo(path)
}
</script>