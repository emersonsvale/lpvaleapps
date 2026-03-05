<template>
  <div class="flex flex-col h-[70vh] items-center justify-center p-12 text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl mt-6">
    <Icon name="ph:chart-bar-duotone" class="w-16 h-16 opacity-50 mb-4" />
    <h2 class="text-xl font-semibold text-zinc-200 mb-2">Gantt & Releases</h2>
    <p class="text-sm max-w-sm text-center">Visão de Roadmap e Gantt Chart será implementada em futuras atualizações. Utilize as abas de Tarefas e Resumo para gestão atual.</p>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'
const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
</script>