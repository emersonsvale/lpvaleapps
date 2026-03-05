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
        <NuxtLink :to="`/admin/projetos/${projeto.id}/tarefas/nova`" class="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors">
          + Nova Tarefa
        </NuxtLink>
      </div>
    </header>

    <!-- Tabs Horizontais -->
    <nav class="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
      <NuxtLink v-for="tab in tabs" :key="tab.path" :to="tab.path"
        class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors"
        :class="route.path === tab.path || (tab.exact === false && route.path.startsWith(tab.path)) ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'"
      >
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <!-- Conteúdo da Aba -->
    <NuxtPage :projeto="projeto" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { PhFolderOpen } from '@phosphor-icons/vue'
import { fetchProjetoWorkspaceById } from '~/composables/useProjetosWorkspace'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const projetoId = Number(route.params.id)

const { data: projeto, pending, error, refresh } = await useAsyncData(
  `admin-projeto-${projetoId}`,
  () => fetchProjetoWorkspaceById(projetoId)
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
</script>