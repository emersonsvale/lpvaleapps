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
        <p class="text-xs uppercase tracking-wider text-zinc-500">Valor Hora Vendida</p>
        <p class="mt-2 text-xl font-semibold text-zinc-100">{{ formatMoeda(valorHoraVendida) }}</p>
      </article>
    </section>

    <!-- Relatorio para Cliente -->
    <section class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <header class="flex flex-col gap-3 border-b border-zinc-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-base font-semibold text-zinc-100">Relatorio para Cliente</h2>
          <p class="text-xs text-zinc-500">Selecione o periodo e gere um PDF a partir dos lançamentos reais de tempo.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model="relatorioDataInicio"
            type="date"
            class="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
          <span class="text-xs text-zinc-500">ate</span>
          <input
            v-model="relatorioDataFim"
            type="date"
            class="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
          <button
            type="button"
            class="rounded-lg bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!relatorioDataInicio || !relatorioDataFim"
            @click="gerarRelatorioPDF"
          >
            Gerar PDF
          </button>
        </div>
      </header>

      <div v-if="lancamentosFiltrados.length" class="px-4 py-3">
        <p class="text-xs text-zinc-400">
          {{ lancamentosFiltrados.length }} lançamento(s) no periodo selecionado
          — Total de <strong class="text-zinc-200">{{ formatHoras(horasExecutadasPeriodo) }}h</strong> executadas
        </p>
      </div>
      <div v-else-if="relatorioDataInicio && relatorioDataFim" class="px-4 py-6 text-center text-xs text-zinc-500">
        Nenhum lançamento neste periodo.
      </div>
    </section>

    <section class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <header class="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div>
          <h2 class="text-base font-semibold text-zinc-100">Lançamentos de Tempo</h2>
          <p class="text-xs text-zinc-500">Cada play do cronômetro gera uma linha separada neste extrato.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
          @click="Promise.all([refreshTarefas(), refreshLancamentos()])"
        >
          Atualizar
        </button>
      </header>

      <div v-if="pending || pendingLancamentos" class="px-4 py-10 text-center text-sm text-zinc-500">Carregando extrato...</div>

      <div v-else-if="!lancamentos.length" class="px-4 py-10 text-center text-sm text-zinc-500">
        Nenhum lançamento encontrado. Assim que um cronômetro for encerrado, ele aparecerá aqui.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-zinc-800 bg-zinc-950/60">
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Data</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tarefa</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Autor</th>
              <th class="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Duração</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Horas</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Custo Aprox.</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Início</th>
              <th class="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Fim</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in lancamentos"
              :key="item.id"
              class="border-b border-zinc-900/90 hover:bg-zinc-950/50"
            >
              <td class="px-4 py-3 text-xs text-zinc-500">{{ formatDateTime(item.updatedAt || item.data) }}</td>
              <td class="px-4 py-3 text-sm text-zinc-100">
                <div class="flex items-center gap-2">
                  <span class="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ item.codigo }}</span>
                  <span>{{ item.titulo }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-zinc-300">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                    <img
                      v-if="item.responsavelFoto"
                      :src="item.responsavelFoto"
                      :alt="item.responsavel || 'Responsável'"
                      class="h-full w-full object-cover"
                    >
                    <span v-else>{{ getResponsavelInitials(item.responsavel) }}</span>
                  </div>
                  <span>{{ item.responsavel || '-' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-zinc-300">
                <span class="rounded-md bg-zinc-800 px-2 py-1">{{ statusLabel(item.status) }}</span>
              </td>
              <td class="px-4 py-3 text-right text-sm text-zinc-300">{{ formatDuracao(item.duracaoSegundos) }}</td>
              <td class="px-4 py-3 text-right text-sm font-medium text-zinc-100">{{ formatHoras(item.horasExecutadas) }}h</td>
              <td class="px-4 py-3 text-right text-sm text-zinc-300">{{ formatMoeda(item.custoAproximado) }}</td>
              <td class="px-4 py-3 text-right text-xs text-zinc-500">{{ formatDateTime(item.iniciadoEm) }}</td>
              <td class="px-4 py-3 text-right text-xs text-zinc-500">{{ formatDateTime(item.finalizadoEm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { fetchEquipeMembros, fetchLancamentosHorasByProjetoId, fetchTarefasByProjetoId, type ProjetoAdminWorkspace, type ProjetoLancamentoHora, type ProjetoTarefa } from '~/composables/useProjetosWorkspace'
import { openRelatorioHoras } from '~/composables/useRelatorioHoras'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()

const { data: tarefas, pending, refresh: refreshTarefas } = await useAsyncData(
  `extrato-projeto-${props.projeto.id}`,
  () => fetchTarefasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const { data: lancamentosBrutos, pending: pendingLancamentos, refresh: refreshLancamentos } = await useAsyncData(
  `extrato-projeto-lancamentos-${props.projeto.id}`,
  () => fetchLancamentosHorasByProjetoId(props.projeto.id),
  {
    server: false,
    default: () => []
  }
)

const { data: equipeMembros } = await useAsyncData(
  `extrato-projeto-equipe-${props.projeto.id}`,
  () => fetchEquipeMembros(),
  {
    server: false,
    default: () => []
  }
)

// ==========================================
// RESUMO GERAL
// ==========================================

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
const valorHoraVendida = computed(() => {
  const valorHoraProjeto = Number(props.projeto.valor_hora_vendida || 0)
  if (valorHoraProjeto > 0) return valorHoraProjeto

  const horasVendidasFinanceiras = Number(props.projeto.horas_previstas || 0)
  if (horasVendidasFinanceiras <= 0) return 0

  return orcamentoTotal.value / horasVendidasFinanceiras
})

const orcamentoConsumido = computed(() => {
  return Number((totalHorasExecutadas.value * valorHoraVendida.value).toFixed(2))
})
const saldoFinanceiro = computed(() => orcamentoTotal.value - orcamentoConsumido.value)

const custoMedioHora = computed(() => {
  return valorHoraVendida.value
})

const tarefasPorId = computed(() => {
  return new Map((tarefas.value || []).map((tarefa) => [tarefa.id, tarefa]))
})

const equipePorId = computed(() => {
  return new Map((equipeMembros.value || []).map((membro) => [membro.id, membro]))
})

function getResponsavelFoto(item: ProjetoLancamentoHora) {
  const membro = item.equipe_id ? equipePorId.value.get(item.equipe_id) || null : null
  return membro?.foto || null
}

function getResponsavelInitials(nome: string | null | undefined): string {
  const safe = String(nome || '').trim()
  if (!safe) return '--'
  const partes = safe.split(/\s+/).filter(Boolean)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
}

// ==========================================
// LANCAMENTOS (TABELA GERAL)
// ==========================================

const statusLabelsMap: Record<ProjetoTarefa['status'], string> = {
  refinar: 'Refinar',
  fazer: 'Fazer',
  em_progresso: 'Em Progresso',
  sob_revisao: 'Sob Revisao',
  concluido: 'Concluido'
}

const lancamentos = computed(() => {
  const source = (lancamentosBrutos.value || []) as ProjetoLancamentoHora[]
  return source
    .map((item) => {
      const tarefa = item.tarefa_id ? tarefasPorId.value.get(item.tarefa_id) || null : null
      const horasExecutadas = Number(item.horas || 0)
      const horasEstimadas = Number(tarefa?.horas_estimadas || 0)
      const percentualConsumo = horasEstimadas > 0 ? (horasExecutadas / horasEstimadas) * 100 : 0

      return {
        id: item.id,
        tarefaId: item.tarefa_id,
        codigo: tarefa?.codigo || (item.tarefa_id ? `T-${item.tarefa_id}` : '-'),
        titulo: tarefa?.titulo || item.descricao || 'Lançamento sem tarefa',
        responsavel: item.autor_texto || tarefa?.responsavel_texto || '-',
        responsavelFoto: getResponsavelFoto(item),
        status: tarefa?.status || null,
        horasEstimadas,
        horasExecutadas,
        percentualConsumo,
        custoAproximado: horasExecutadas * custoMedioHora.value,
        data: item.data,
        iniciadoEm: item.iniciado_em || null,
        finalizadoEm: item.finalizado_em || item.created_at || null,
        duracaoSegundos: Number(item.duracao_segundos || Math.round(horasExecutadas * 3600)),
        updatedAt: item.finalizado_em || item.created_at || null
      }
    })
    .sort((a, b) => new Date(b.updatedAt || b.data).getTime() - new Date(a.updatedAt || a.data).getTime())
})

// ==========================================
// RELATORIO PARA CLIENTE
// ==========================================

const relatorioDataInicio = ref('')
const relatorioDataFim = ref('')

const lancamentosFiltrados = computed(() => {
  if (!relatorioDataInicio.value || !relatorioDataFim.value) return []

  const inicio = relatorioDataInicio.value
  const fim = relatorioDataFim.value

  return lancamentos.value.filter((item) => {
    const dataBase = item.finalizadoEm || item.updatedAt || item.data || null
    if (!dataBase) return false
    const dataItem = dataBase.slice(0, 10)
    return dataItem >= inicio && dataItem <= fim
  })
})

const horasExecutadasPeriodo = computed(() => {
  return lancamentosFiltrados.value.reduce((acc, item) => acc + item.horasExecutadas, 0)
})

function gerarRelatorioPDF() {
  if (!relatorioDataInicio.value || !relatorioDataFim.value) return

  const itensAgrupados = new Map<number | string, {
    codigo: string
    titulo: string
    responsavel: string
    responsavelFoto: string | null
    status: string
    horasEstimadas: number
    horasExecutadas: number
    percentualConsumo: number
  }>()

  for (const item of lancamentosFiltrados.value) {
    const key = item.tarefaId || `sem-tarefa-${item.id}`
    const existente = itensAgrupados.get(key)

    if (existente) {
      existente.horasExecutadas += item.horasExecutadas
      existente.percentualConsumo = existente.horasEstimadas > 0
        ? (existente.horasExecutadas / existente.horasEstimadas) * 100
        : 0
      continue
    }

    itensAgrupados.set(key, {
      codigo: item.codigo,
      titulo: item.titulo,
      responsavel: item.responsavel,
      responsavelFoto: item.responsavelFoto || null,
      status: item.status ? statusLabelsMap[item.status] || item.status : 'Sem status',
      horasEstimadas: item.horasEstimadas,
      horasExecutadas: item.horasExecutadas,
      percentualConsumo: item.horasEstimadas > 0 ? (item.horasExecutadas / item.horasEstimadas) * 100 : 0
    })
  }

  const itens = Array.from(itensAgrupados.values())

  openRelatorioHoras({
    projetoNome: props.projeto.nome,
    clienteNome: props.projeto.cliente_nome,
    periodoInicio: relatorioDataInicio.value,
    periodoFim: relatorioDataFim.value,
    horasPrevistas: totalHorasPrevistas.value,
    horasExecutadas: totalHorasExecutadas.value,
    saldoHoras: saldoHoras.value,
    percentualConsumo: percentualHorasConsumidas.value,
    horasNoPeriodo: itens.reduce((acc, i) => acc + i.horasExecutadas, 0),
    itens: itens.map((item) => ({
      codigo: item.codigo,
      titulo: item.titulo,
      responsavel: item.responsavel,
      responsavelFoto: item.responsavelFoto,
      status: statusLabelsMap[item.status] || item.status,
      horasEstimadas: item.horasEstimadas,
      horasExecutadas: item.horasExecutadas,
      percentualConsumo: item.percentualConsumo,
    })),
  })
}

// ==========================================
// HELPERS
// ==========================================

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

function formatDuracao(segundos: number | null | undefined): string {
  const total = Math.max(0, Math.floor(Number(segundos || 0)))
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const restanteSegundos = total % 60

  return [horas, minutos, restanteSegundos].map((valor) => String(valor).padStart(2, '0')).join(':')
}

function statusLabel(status: ProjetoTarefa['status'] | null): string {
  if (!status) return 'Sem status'
  return statusLabelsMap[status]
}
</script>
