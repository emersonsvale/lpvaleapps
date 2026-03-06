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

    <!-- Filtros -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar projeto por nome ou cliente..."
        class="md:col-span-3 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand"
      >
      <select
        v-model="filtroStatus"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-brand"
      >
        <option value="todos">Todos os status</option>
        <option value="iniciando">Iniciando</option>
        <option value="em_andamento">Em andamento</option>
        <option value="pausado">Pausado</option>
        <option value="concluido">Concluído</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </section>

    <!-- Lista -->
    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando projetos...
    </div>
    <div v-else-if="error" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-3">
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
              <span class="font-medium text-zinc-300">{{ p.progresso_percentual }}%</span>
            </div>
            <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-brand transition-all duration-500" 
                :style="{ width: `${Math.min(100, Math.max(0, p.progresso_percentual))}%` }"
              />
            </div>
          </div>

          <div class="flex items-center gap-4 shrink-0 text-xs text-zinc-500">
            <span v-if="p.data_fim_prevista" class="flex items-center gap-1.5" title="Entrega prevista">
              <PhCalendarBlank class="w-4 h-4" />
              {{ formatarData(p.data_fim_prevista) }}
            </span>
            <span v-else class="flex items-center gap-1.5">
              <PhCalendarBlank class="w-4 h-4" />
               A definir
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
  </div>
</template>

<script setup lang="ts">
import { PhFolderOpen, PhCalendarBlank } from '@phosphor-icons/vue'
import { fetchProjetosWorkspace } from '~/composables/useProjetosWorkspace'

definePageMeta({ layout: 'admin' })

const { data: projetos, pending, error } = await useAsyncData(
  'admin-projetos-workspace',
  fetchProjetosWorkspace,
  {
    server: false,
    default: () => []
  }
)

const filtroBusca = ref('')
const filtroStatus = ref<string>('todos')

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

function formatarData(data: string) {
  if (!data) return ''
  const d = new Date(data + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(d)
}
</script>
