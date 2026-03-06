<template>
  <div class="mt-6 space-y-4">
    <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Horas Previstas</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ formatHoras(totalHorasPrevistas) }}h</p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Horas Executadas</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ formatHoras(totalHorasExecutadas) }}h</p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Saldo de Horas</p>
        <p
          class="mt-2 text-2xl font-semibold"
          :class="saldoHoras < 0 ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ formatHoras(saldoHoras) }}h
        </p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Consumo de Horas</p>
        <p class="mt-2 text-2xl font-semibold text-zinc-100">{{ percentualHorasConsumidas }}%</p>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Orcamento Total</p>
        <p class="mt-2 text-xl font-semibold text-zinc-100">{{ formatMoeda(orcamentoTotal) }}</p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Orcamento Consumido</p>
        <p class="mt-2 text-xl font-semibold text-zinc-100">{{ formatMoeda(orcamentoConsumido) }}</p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Saldo Financeiro</p>
        <p
          class="mt-2 text-xl font-semibold"
          :class="saldoFinanceiro < 0 ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ formatMoeda(saldoFinanceiro) }}
        </p>
      </article>

      <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p class="text-xs uppercase tracking-wider text-zinc-500">Custo Medio por Hora</p>
        <p class="mt-2 text-xl font-semibold text-zinc-100">{{ formatMoeda(custoMedioHora) }}</p>
      </article>
    </section>

    <section class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <header class="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div>
          <h2 class="text-base font-semibold text-zinc-100">Lancamentos por Tarefa</h2>
          <p class="text-xs text-zinc-500">Baseado em horas executadas e atualizacoes das tarefas do projeto.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
          @click="refreshTarefas"
        >
          Atualizar
        </button>
      </header>

      <div v-if="pending" class="px-4 py-10 text-center text-sm text-zinc-500">Carregando extrato...</div>

      <div v-else-if="!lancamentos.length" class="px-4 py-10 text-center text-sm text-zinc-500">
        Nenhum lancamento encontrado. As tarefas com horas executadas aparecerao aqui.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-zinc-800 bg-zinc-950/60">
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tarefa</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Responsavel</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Estimadas</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Executadas</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Consumo</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Custo Aprox.</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Ult. Atualizacao</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in lancamentos"
              :key="item.id"
              class="border-b border-zinc-900/90 hover:bg-zinc-950/50"
            >
              <td class="px-4 py-3 text-sm text-zinc-100">
                <div class="flex items-center gap-2">
                  <span class="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ item.codigo }}</span>
                  <span>{{ item.titulo }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-zinc-300">{{ item.responsavel || '-' }}</td>
              <td class="px-4 py-3 text-xs text-zinc-300">
                <span class="rounded-md bg-zinc-800 px-2 py-1">{{ statusLabel(item.status) }}</span>
              </td>
              <td class="px-4 py-3 text-right text-sm text-zinc-300">{{ formatHoras(item.horasEstimadas) }}h</td>
              <td class="px-4 py-3 text-right text-sm font-medium text-zinc-100">{{ formatHoras(item.horasExecutadas) }}h</td>
              <td class="px-4 py-3 text-right text-sm text-zinc-300">{{ formatPercent(item.percentualConsumo) }}</td>
              <td class="px-4 py-3 text-right text-sm text-zinc-300">{{ formatMoeda(item.custoAproximado) }}</td>
              <td class="px-4 py-3 text-right text-xs text-zinc-500">{{ formatDateTime(item.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fetchTarefasByProjetoId, type ProjetoAdminWorkspace, type ProjetoTarefa } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()

const { data: tarefas, pending, refresh: refreshTarefas } = await useAsyncData(
  `extrato-projeto-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const totalHorasPrevistas = computed(() => {
  const projetoPrevistas = Number(props.projeto.horas_previstas || 0)
  const tarefasPrevistas = (tarefas.value || []).reduce((acc, item) => acc + Number(item.horas_estimadas || 0), 0)
  return Math.max(projetoPrevistas, tarefasPrevistas)
})

const totalHorasExecutadas = computed(() => {
  return (tarefas.value || []).reduce((acc, item) => acc + Number(item.horas_executadas || 0), 0)
})

const saldoHoras = computed(() => totalHorasPrevistas.value - totalHorasExecutadas.value)

const percentualHorasConsumidas = computed(() => {
  if (totalHorasPrevistas.value <= 0) return 0
  return Math.round((totalHorasExecutadas.value / totalHorasPrevistas.value) * 100)
})

const orcamentoTotal = computed(() => Number(props.projeto.orcamento_total || 0))
const orcamentoConsumido = computed(() => Number(props.projeto.orcamento_consumido || 0))
const saldoFinanceiro = computed(() => orcamentoTotal.value - orcamentoConsumido.value)

const custoMedioHora = computed(() => {
  if (totalHorasExecutadas.value <= 0) return 0
  return orcamentoConsumido.value / totalHorasExecutadas.value
})

const lancamentos = computed(() => {
  const source = (tarefas.value || []) as ProjetoTarefa[]
  return source
    .filter((item) => Number(item.horas_executadas || 0) > 0 || Number(item.horas_estimadas || 0) > 0)
    .map((item) => {
      const horasExecutadas = Number(item.horas_executadas || 0)
      const horasEstimadas = Number(item.horas_estimadas || 0)
      const percentualConsumo = horasEstimadas > 0 ? (horasExecutadas / horasEstimadas) * 100 : 0

      return {
        id: item.id,
        codigo: item.codigo || `T-${item.id}`,
        titulo: item.titulo,
        responsavel: item.responsavel_texto,
        status: item.status,
        horasEstimadas,
        horasExecutadas,
        percentualConsumo,
        custoAproximado: horasExecutadas * custoMedioHora.value,
        updatedAt: item.updated_at || item.created_at || null
      }
    })
    .sort((a, b) => b.horasExecutadas - a.horasExecutadas)
})

function formatHoras(value: number): string {
  return Number((value || 0).toFixed(2)).toString()
}

function formatPercent(value: number): string {
  return `${Math.max(0, Math.round(value))}%`
}

function formatMoeda(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(Number(value || 0))
}

function formatDateTime(value: string | null): string {
  if (!value) return '--'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '--'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

function statusLabel(status: ProjetoTarefa['status']): string {
  const map: Record<ProjetoTarefa['status'], string> = {
    refinar: 'Refinar',
    fazer: 'Fazer',
    em_progresso: 'Em Progresso',
    sob_revisao: 'Sob Revisao',
    concluido: 'Concluido'
  }
  return map[status]
}
</script>