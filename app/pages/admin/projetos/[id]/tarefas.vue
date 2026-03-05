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
    </div>

    <!-- Kanban Board -->
    <div class="overflow-x-auto pb-4">
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
                    <span class="font-medium text-zinc-300">{{ t.horas_executadas || 0 }}/{{ t.horas_estimadas }}h</span>
                  </span>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editarTarefa(t.id)" class="text-brand hover:underline">Editar</button>
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
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace, ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import { fetchTarefasByProjetoId, updateTarefaStatus, createTarefa } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()

const { data: tarefas, pending, refresh } = await useAsyncData(
  `tarefas-proj-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id)
)

const colunas = [
  { status: 'refinar', titulo: 'A Refinar' },
  { status: 'fazer', titulo: 'A Fazer' },
  { status: 'em_progresso', titulo: 'Em Progresso' },
  { status: 'sob_revisao', titulo: 'Sob Revisão' },
  { status: 'concluido', titulo: 'Concluído' }
] as const

const filtroBusca = ref('')
const novaTarefaTitulo = ref('')
const criando = ref(false)
const dragId = ref<number | null>(null)

const tarefasPorStatus = computed(() => {
  const map = Object.fromEntries(colunas.map(c => [c.status, [] as ProjetoTarefa[]])) as Record<string, ProjetoTarefa[]>
  const termo = filtroBusca.value.toLowerCase().trim()

  for (const t of (tarefas.value || [])) {
    if (termo && !t.titulo.toLowerCase().includes(termo) && !(t.codigo || '').toLowerCase().includes(termo)) {
      continue
    }
    if (map[t.status]) {
      map[t.status].push(t)
    }
  }
  return map
})

function onDragStart(id: number) {
  dragId.value = id
}

async function onDrop(newStatus: string) {
  const id = dragId.value
  dragId.value = null
  if (!id) return

  const t = tarefas.value?.find(x => x.id === id)
  if (t && t.status !== newStatus) {
    const oldStatus = t.status
    // Optimistic UI
    t.status = newStatus as any
    const { error } = await updateTarefaStatus(id, newStatus as any)
    if (error) {
      t.status = oldStatus
      alert('Erro ao mover tarefa: ' + error)
    }
  }
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

function editarTarefa(id: number) {
  // Poderia abrir um modal. Por enquanto, focado no happy path,
  // ou em um navigateTo para `/admin/projetos/${props.projeto.id}/tarefas/${id}`
  alert('Abre modal de edição detalhada para tarefe ' + id)
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