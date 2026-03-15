<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100">Agentes especialistas</h1>
        <p class="text-zinc-400 mt-1">Crie agentes como Vendas, Eng. de Software e alimente com dados e arquivos.</p>
      </div>
      <NuxtLink
        to="/admin/agentes/novo"
        class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-brand/90 transition-colors"
      >
        <PhPlus class="w-5 h-5" />
        Novo agente
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>

    <div v-else-if="!agents.length" class="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-12 text-center">
      <PhRobot class="mx-auto h-12 w-12 text-zinc-500" />
      <p class="mt-4 text-zinc-400">Nenhum agente ainda.</p>
      <NuxtLink to="/admin/agentes/novo" class="mt-4 inline-block text-brand hover:underline">Criar o primeiro agente</NuxtLink>
    </div>

    <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="agent in agents"
        :key="agent.id"
        class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold text-zinc-100 truncate">{{ agent.nome }}</h2>
            <p class="mt-1 text-sm text-zinc-500">{{ agent.slug }}</p>
            <p v-if="agent.descricao" class="mt-2 line-clamp-2 text-sm text-zinc-400">{{ agent.descricao }}</p>
          </div>
          <span class="shrink-0 rounded-lg bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400">
            {{ agent.provider === 'chatgpt' ? 'ChatGPT' : 'Gemini' }}
          </span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            :to="`/admin/agentes/${agent.id}`"
            class="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Configurar
          </NuxtLink>
          <button
            type="button"
            class="rounded-lg bg-brand/20 px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/30 transition-colors"
            @click="navigateTo({ path: '/admin/chat-ia', query: { modo: 'especialista', agenteId: agent.id } })"
          >
            Conversar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { PhPlus, PhRobot } from '@phosphor-icons/vue'
import type { AiAgent } from '~/types/ai-agents'

definePageMeta({ layout: 'admin' })

const { list } = useAgents()
const agents = ref<AiAgent[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    agents.value = await list()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
