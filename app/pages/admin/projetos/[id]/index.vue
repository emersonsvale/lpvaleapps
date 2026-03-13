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
            <span class="text-zinc-300">{{ totalHorasExecutadas }}h</span>
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
            <span class="text-zinc-300">{{ formatarData(dataInicioTarefas) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Previsão Atual</span>
            <span class="text-zinc-300">{{ formatarData(previsaoAtualTarefas) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-zinc-500">Data Real de Entrega</span>
            <span class="text-zinc-300">{{ formatarData(dataRealEntregaTarefas) }}</span>
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

const totalHorasExecutadas = computed(() => {
  return Number(
    (tarefasProjeto.value || []).reduce((acc, tarefa) => acc + Number(tarefa.horas_executadas || 0), 0).toFixed(4)
  )
})

const progressoTarefasPercentual = computed(() => {
  if (!totalTarefas.value) return 0
  return Math.round((tarefasConcluidas.value / totalTarefas.value) * 100)
})

const saldoHoras = computed(() => {
  return Number(((props.projeto?.horas_previstas || 0) - totalHorasExecutadas.value).toFixed(4))
})

function normalizeDateValue(value?: string | null) {
  if (!value) return null
  const normalized = String(value).slice(0, 10)
  const date = new Date(`${normalized}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : normalized
}

const dataInicioTarefas = computed(() => {
  const datas = (tarefasProjeto.value || [])
    .map(tarefa => normalizeDateValue(tarefa.prazo_inicio))
    .filter((value): value is string => Boolean(value))
    .sort()

  return datas[0] || props.projeto?.data_inicio || null
})

const previsaoAtualTarefas = computed(() => {
  const datasFim = (tarefasProjeto.value || [])
    .map(tarefa => normalizeDateValue(tarefa.prazo_fim))
    .filter((value): value is string => Boolean(value))
    .sort()

  if (datasFim.length) {
    return datasFim[datasFim.length - 1]
  }

  const datasInicio = (tarefasProjeto.value || [])
    .map(tarefa => normalizeDateValue(tarefa.prazo_inicio))
    .filter((value): value is string => Boolean(value))
    .sort()

  return datasInicio[datasInicio.length - 1] || props.projeto?.data_fim_prevista || null
})

const dataRealEntregaTarefas = computed(() => {
  const datasConclusao = (tarefasProjeto.value || [])
    .filter(tarefa => tarefa.status === 'concluido')
    .map(tarefa => normalizeDateValue(tarefa.concluida_em || tarefa.updated_at || null))
    .filter((value): value is string => Boolean(value))
    .sort()

  return datasConclusao[datasConclusao.length - 1] || props.projeto?.data_fim_real || null
})

function formatarData(data?: string | null) {
  if (!data) return '-'
  const normalized = normalizeDateValue(data)
  if (!normalized) return '-'
  const d = new Date(`${normalized}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
}
</script>