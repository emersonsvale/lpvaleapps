<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Propostas</h1>
        <p class="text-zinc-400">Acompanhe o funil comercial e avance propostas com mais previsibilidade.</p>
      </div>
      <NuxtLink
        to="/admin/propostas/nova"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        + Nova Proposta
      </NuxtLink>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Total de propostas</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metricas.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Aprovadas</p>
        <p class="text-2xl font-semibold text-emerald-300 mt-1">{{ metricas.aprovadas }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Em execução</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ metricas.emExecucao }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Valor potencial</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ formatarMoeda(metricas.valorTotal) }}</p>
      </article>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Filtrar por cliente ou projeto..."
        class="md:col-span-2 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      >
      <select
        v-model="filtroStatus"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="todos">Todos os status</option>
        <option v-for="op in colunasKanban" :key="op.status" :value="op.status">
          {{ op.titulo }}
        </option>
      </select>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando propostas...</div>
    <div v-else-if="erro" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">{{ erro }}</div>
    <div v-else class="overflow-x-auto pb-2">
      <div class="flex items-start gap-4 min-w-max">
        <section
          v-for="coluna in colunasKanban"
          :key="coluna.status"
          class="w-[280px] rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 min-h-[460px]"
          @dragover.prevent
          @drop="onDrop(coluna.status)"
        >
          <header class="mb-3 flex items-center justify-between gap-2">
            <h2 class="text-sm font-semibold text-zinc-200">{{ coluna.titulo }}</h2>
            <span class="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">
              {{ propostasPorStatus[coluna.status]?.length || 0 }}
            </span>
          </header>

          <div class="space-y-3">
            <article
              v-for="p in propostasPorStatus[coluna.status]"
              :key="p.id"
              class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors"
              draggable="true"
              @dragstart="onDragStart(p.id)"
            >
              <p class="font-medium text-zinc-100 text-sm leading-snug">{{ p.nome_proejeto || p.nome_cliente || 'Proposta #' + p.id }}</p>
              <p v-if="p.nome_cliente" class="text-zinc-500 text-xs mt-1">{{ p.nome_cliente }}</p>
              <p class="text-zinc-500 text-[11px] mt-1">
                {{ p.tipo_proposta === 'hora' ? 'Por hora' : 'Empreitada' }}
              </p>

              <div class="mt-2 flex items-center justify-between gap-2">
                <span class="text-brand font-medium text-xs">{{ resumoFinanceiro(p) }}</span>
                <NuxtLink
                  :to="`/admin/propostas/editar/${p.id}`"
                  class="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Editar
                </NuxtLink>
              </div>

              <a
                v-if="p.slug"
                :href="linkProposta(p.slug)"
                target="_blank"
                rel="noopener"
                class="mt-2 inline-block text-xs text-brand hover:underline"
              >
                Ver proposta →
              </a>

              <select
                :value="p.status_proposta || 'nova'"
                class="mt-3 w-full px-2 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                @change="onSelectStatusChange(p.id, $event)"
              >
                <option v-for="op in colunasKanban" :key="`${p.id}-${op.status}`" :value="op.status">
                  {{ op.titulo }}
                </option>
              </select>
            </article>

            <p v-if="!(propostasPorStatus[coluna.status]?.length)" class="text-zinc-600 text-xs">Sem propostas</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  fetchPropostas,
  updatePropostaStatus,
  type PropostaRow,
  type StatusProposta,
} from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

const { data: propostas, pending, error: erro } = await useAsyncData('admin-propostas', fetchPropostas)
const propostaArrastadaId = ref<number | null>(null)
const filtroBusca = ref('')
const filtroStatus = ref<StatusProposta | 'todos'>('todos')

const colunasKanban: Array<{ status: StatusProposta; titulo: string }> = [
  { status: 'nova', titulo: 'Nova' },
  { status: 'em_analise', titulo: 'Em análise' },
  { status: 'aprovada', titulo: 'Aprovada' },
  { status: 'em_execucao', titulo: 'Em execução' },
  { status: 'entregue', titulo: 'Entregue' },
  { status: 'cancelada', titulo: 'Cancelada' },
]

const propostasPorStatus = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  const mapa = Object.fromEntries(
    colunasKanban.map(coluna => [coluna.status, [] as PropostaRow[]])
  ) as Record<StatusProposta, PropostaRow[]>

  for (const proposta of propostas.value ?? []) {
    if (termo) {
      const nomeProjeto = (proposta.nome_proejeto ?? '').toLowerCase()
      const nomeCliente = (proposta.nome_cliente ?? '').toLowerCase()
      if (!nomeProjeto.includes(termo) && !nomeCliente.includes(termo)) {
        continue
      }
    }

    if (filtroStatus.value !== 'todos' && (proposta.status_proposta ?? 'nova') !== filtroStatus.value) {
      continue
    }

    const status = (proposta.status_proposta ?? 'nova') as StatusProposta
    if (!mapa[status]) {
      mapa.nova.push(proposta)
      continue
    }
    mapa[status].push(proposta)
  }

  for (const coluna of colunasKanban) {
    mapa[coluna.status].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return timeB - timeA
    })
  }

  return mapa
})

const metricas = computed(() => {
  const lista = propostas.value ?? []
  const aprovadas = lista.filter(item => item.status_proposta === 'aprovada').length
  const emExecucao = lista.filter(item => item.status_proposta === 'em_execucao').length
  const valorTotal = lista.reduce((acc, item) => acc + (item.valor_final ?? 0), 0)

  return {
    total: lista.length,
    aprovadas,
    emExecucao,
    valorTotal,
  }
})

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function resumoFinanceiro(proposta: PropostaRow): string {
  if (proposta.tipo_proposta === 'hora') {
    const horas = proposta.total_horas ?? 0
    const valor = proposta.valor_final ?? 0
    return `${horas}h · ${formatarMoeda(valor)}`
  }

  if (proposta.valor_final != null) {
    return formatarMoeda(proposta.valor_final)
  }

  return 'Sob consulta'
}

function onDragStart(propostaId: number) {
  propostaArrastadaId.value = propostaId
}

async function onDrop(status: StatusProposta) {
  const propostaId = propostaArrastadaId.value
  propostaArrastadaId.value = null
  if (!propostaId) return

  await moverStatus(propostaId, status)
}

async function onSelectStatus(propostaId: number, status: StatusProposta) {
  await moverStatus(propostaId, status)
}

async function onSelectStatusChange(propostaId: number, event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target?.value) return
  await onSelectStatus(propostaId, target.value as StatusProposta)
}

async function moverStatus(propostaId: number, novoStatus: StatusProposta) {
  const lista = propostas.value ?? []
  const proposta = lista.find(item => item.id === propostaId)
  if (!proposta) return
  if ((proposta.status_proposta ?? 'nova') === novoStatus) return

  const statusAnterior = proposta.status_proposta ?? 'nova'
  atualizarStatusLocal(propostaId, novoStatus)

  const { error } = await updatePropostaStatus(propostaId, novoStatus)
  if (error) {
    atualizarStatusLocal(propostaId, statusAnterior)
    alert(`Erro ao atualizar status: ${error}`)
  }
}

function atualizarStatusLocal(propostaId: number, status: StatusProposta) {
  if (!propostas.value) return
  propostas.value = propostas.value.map((item) => {
    if (item.id !== propostaId) return item
    return {
      ...item,
      status_proposta: status,
    }
  })
}

function linkProposta(slug: string) {
  if (import.meta.client) return `${window.location.origin}/proposta/${slug}`
  const config = useRuntimeConfig().public
  const base = (config.baseURL as string) || ''
  return `${base.replace(/\/$/, '')}/proposta/${slug}`
}
</script>
