<template>
  <div class="space-y-6">
    <section class="grid grid-cols-1 mb-6">
      <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-medium text-zinc-200">Progresso geral</h2>
          <span class="text-2xl font-semibold text-zinc-100">{{ progressoTarefasPercentual }}%</span>
        </div>
        <div class="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-brand transition-all duration-500" 
            :style="{ width: `${progressoTarefasPercentual}%` }"
          />
        </div>
        <p class="mt-2 text-sm text-zinc-500">
          {{ tarefasConcluidas }} de {{ totalTarefas }} tarefas concluidas
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Horas -->
      <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
        <h3 class="font-medium text-zinc-200 flex items-center gap-2">
          Métricas de Horas
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Horas Previstas</span>
            <span class="text-zinc-300">{{ projeto?.horas_previstas || 0 }}h</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Horas Executadas</span>
            <span class="text-zinc-300">{{ projeto?.horas_executadas || 0 }}h</span>
          </div>
          <hr class="border-zinc-800" />
          <div class="flex justify-between text-sm font-medium">
            <span class="text-zinc-400">Saldo</span>
            <span :class="saldoHoras >= 0 ? 'text-brand' : 'text-red-400'">
              {{ saldoHoras > 0 ? '+' : '' }}{{ saldoHoras }}h
            </span>
          </div>
        </div>
      </section>

      <!-- Prazos -->
      <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4">
        <h3 class="font-medium text-zinc-200 flex items-center gap-2">
          Prazos
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Data de Início</span>
            <span class="text-zinc-300">{{ formatarData(projeto?.data_inicio) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Previsão Atual</span>
            <span class="text-zinc-300">{{ formatarData(projeto?.data_fim_prevista) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Data Real de Entrega</span>
            <span class="text-zinc-300">{{ formatarData(projeto?.data_fim_real) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'
import { fetchTarefasByProjetoId } from '~/composables/useProjetosWorkspace'

const props = defineProps<{
  projeto: ProjetoAdminWorkspace
}>()

const { data: tarefasProjeto } = await useAsyncData(
  `tarefas-proj-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const totalTarefas = computed(() => (tarefasProjeto.value || []).length)

const tarefasConcluidas = computed(() => {
  return (tarefasProjeto.value || []).filter(tarefa => tarefa.status === 'concluido').length
})

const progressoTarefasPercentual = computed(() => {
  if (!totalTarefas.value) return 0
  return Math.round((tarefasConcluidas.value / totalTarefas.value) * 100)
})

const saldoHoras = computed(() => {
  return (props.projeto?.horas_previstas || 0) - (props.projeto?.horas_executadas || 0)
})

function formatarData(data?: string | null) {
  if (!data) return '-'
  const d = new Date(data + 'T00:00:00')
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
}
</script>