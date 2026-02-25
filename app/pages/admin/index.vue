<template>
  <div class="space-y-8">
    <section class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-5 md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-zinc-500">Painel administrativo</p>
          <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Visão geral da operação</h1>
          <p class="text-zinc-400 mt-2">Acompanhe pipeline comercial, CRM e gestão de conteúdo em um único lugar.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink to="/admin/propostas/nova" class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity">+ Nova proposta</NuxtLink>
          <NuxtLink to="/admin/clientes/novo" class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">+ Novo cliente</NuxtLink>
          <NuxtLink to="/admin/emails/new" class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">+ Novo template</NuxtLink>
        </div>
      </div>
    </section>

    <section>
      <h2 class="sr-only">Métricas</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Projetos no portfólio</p>
              <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ stats?.projetos ?? 0 }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center"><PhFolderOpen class="w-5 h-5 text-brand" /></div>
          </div>
          <NuxtLink to="/admin/portifolio" class="mt-3 inline-block text-sm text-brand hover:underline">Ver projetos →</NuxtLink>
        </article>

        <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Total de propostas</p>
              <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ stats?.propostas ?? 0 }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center"><PhFileText class="w-5 h-5 text-brand" /></div>
          </div>
          <p class="mt-3 text-xs text-zinc-500">{{ propostasAprovadas }} aprovadas · {{ propostasExecucao }} em execução</p>
        </article>

        <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Clientes no CRM</p>
              <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ stats?.clientes ?? 0 }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center"><PhUsersThree class="w-5 h-5 text-brand" /></div>
          </div>
          <p class="mt-3 text-xs text-zinc-500">{{ followupsVencidosHoje }} follow-ups vencidos/hoje</p>
        </article>

        <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Valor potencial</p>
              <p class="text-2xl font-semibold text-brand mt-1">{{ valorTotalFormatado }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center"><PhTrendUp class="w-5 h-5 text-brand" /></div>
          </div>
          <p class="mt-3 text-xs text-zinc-500">Soma de propostas com valor final</p>
        </article>

        <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 border-dashed hover:border-brand/40 hover:bg-brand/5 transition-colors">
          <NuxtLink to="/admin/propostas/nova" class="flex flex-col h-full">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center"><PhPlus class="w-5 h-5 text-brand" /></div>
              <div>
                <p class="font-medium text-zinc-200">Ação rápida</p>
                <p class="text-sm text-zinc-500">Criar proposta comercial</p>
              </div>
            </div>
            <span class="mt-3 inline-block text-sm text-brand font-medium">Criar agora →</span>
          </NuxtLink>
        </article>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div>
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-lg font-semibold text-zinc-100">Últimas propostas</h2>
          <NuxtLink to="/admin/propostas" class="text-sm text-brand hover:underline">Ver todas</NuxtLink>
        </div>
        <div v-if="pending" class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500">Carregando...</div>
        <div v-else-if="ultimasPropostas.length === 0" class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500">
          Nenhuma proposta ainda. Crie a primeira em <NuxtLink to="/admin/propostas/nova" class="text-brand hover:underline">Nova Proposta</NuxtLink>.
        </div>
        <div v-else class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
          <ul class="divide-y divide-zinc-800/80">
            <li
              v-for="p in ultimasPropostas"
              :key="p.id"
              class="px-5 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-zinc-200">{{ p.nome_proejeto || p.nome_cliente || 'Proposta #' + p.id }}</p>
                  <p v-if="p.nome_cliente" class="text-sm text-zinc-500">{{ p.nome_cliente }}</p>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">{{ p.tipo_proposta === 'hora' ? 'Por hora' : 'Empreitada' }}</span>
                    <span class="text-[11px] px-2 py-0.5 rounded-md" :class="badgeStatusProposta(p.status_proposta)">{{ tituloStatusProposta(p.status_proposta) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium text-brand">{{ resumoFinanceiro(p) }}</p>
                  <div class="mt-2 flex items-center justify-end gap-2">
                    <a v-if="p.slug" :href="linkProposta(p.slug)" target="_blank" rel="noopener" class="text-sm text-zinc-400 hover:text-brand">Link</a>
                    <NuxtLink :to="`/admin/propostas/editar/${p.id}`" class="text-sm text-zinc-400 hover:text-zinc-200">Editar</NuxtLink>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between gap-4 mb-4">
          <h2 class="text-lg font-semibold text-zinc-100">Clientes recentes</h2>
          <NuxtLink to="/admin/clientes" class="text-sm text-brand hover:underline">Ver CRM</NuxtLink>
        </div>
        <div v-if="pending" class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500">Carregando...</div>
        <div v-else-if="ultimosClientes.length === 0" class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500">Nenhum cliente no CRM ainda.</div>
        <div v-else class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
          <ul class="divide-y divide-zinc-800/80">
            <li
              v-for="cliente in ultimosClientes"
              :key="cliente.id"
              class="px-5 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-zinc-200">{{ cliente.nome }}</p>
                  <p v-if="cliente.empresa" class="text-sm text-zinc-500">{{ cliente.empresa }}</p>
                  <p class="text-xs text-zinc-500 mt-2">{{ tituloStatusCliente(cliente.status) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-brand">{{ formatarMoeda(cliente.valor_potencial ?? 0) }}</p>
                  <NuxtLink :to="`/admin/clientes/editar/${cliente.id}`" class="mt-2 inline-block text-sm text-zinc-400 hover:text-zinc-200">Editar</NuxtLink>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CRMCliente } from '~/composables/useClientesCRM'
import type { PropostaRow } from '~/composables/usePropostas'
import { PhFolderOpen, PhFileText, PhPlus, PhTrendUp, PhUsersThree } from '@phosphor-icons/vue'
import { fetchCRMClientes } from '~/composables/useClientesCRM'
import { fetchPropostas } from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

const supabase = useSupabase()

const { data: dashboardData, pending } = useAsyncData(
  'admin-dashboard',
  async () => {
    let projetos = 0
    if (supabase) {
      const { count } = await supabase.from('projetos').select('*', { count: 'exact', head: true })
      projetos = count ?? 0
    }
    const propostasList = await fetchPropostas()
    const clientesList = await fetchCRMClientes()
    const propostas = propostasList.length
    const valorTotal = propostasList.reduce((s, p) => s + (p.valor_final ?? 0), 0)
    const clientes = clientesList.length
    return { projetos, propostas, valorTotal, propostasList, clientes, clientesList }
  }
)

const stats = computed(() =>
  dashboardData.value
    ? {
        projetos: dashboardData.value.projetos,
        propostas: dashboardData.value.propostas,
        clientes: dashboardData.value.clientes,
        valorTotal: dashboardData.value.valorTotal
      }
    : null
)

const propostasOrdenadas = computed(() => {
  return [...(dashboardData.value?.propostasList ?? [])].sort((a, b) => {
    const timeA = new Date(a.created_at ?? 0).getTime()
    const timeB = new Date(b.created_at ?? 0).getTime()
    return timeB - timeA
  }) as PropostaRow[]
})

const clientesOrdenados = computed(() => {
  return [...(dashboardData.value?.clientesList ?? [])].sort((a, b) => {
    const timeA = new Date(a.updated_at ?? 0).getTime()
    const timeB = new Date(b.updated_at ?? 0).getTime()
    return timeB - timeA
  }) as CRMCliente[]
})

const ultimasPropostas = computed(() => propostasOrdenadas.value.slice(0, 5))
const ultimosClientes = computed(() => clientesOrdenados.value.slice(0, 5))

const propostasAprovadas = computed(() => {
  return propostasOrdenadas.value.filter(item => item.status_proposta === 'aprovada').length
})

const propostasExecucao = computed(() => {
  return propostasOrdenadas.value.filter(item => item.status_proposta === 'em_execucao').length
})

const followupsVencidosHoje = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return clientesOrdenados.value.filter((cliente) => {
    if (!cliente.proximo_followup) return false
    const data = new Date(cliente.proximo_followup)
    data.setHours(0, 0, 0, 0)
    return data.getTime() <= hoje.getTime()
  }).length
})

const valorTotalFormatado = computed(() => {
  const v = dashboardData.value?.valorTotal ?? 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
})

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function tituloStatusCliente(status: CRMCliente['status']) {
  switch (status) {
    case 'contato_inicial':
      return 'Contato inicial'
    case 'proposta_enviada':
      return 'Proposta enviada'
    case 'negociacao':
      return 'Negociação'
    case 'fechado_ganho':
      return 'Fechado ganho'
    case 'fechado_perdido':
      return 'Fechado perdido'
    default:
      return 'Lead'
  }
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

function tituloStatusProposta(status: PropostaRow['status_proposta']) {
  if (status === 'em_analise') return 'Em análise'
  if (status === 'aprovada') return 'Aprovada'
  if (status === 'em_execucao') return 'Em execução'
  if (status === 'entregue') return 'Entregue'
  if (status === 'cancelada') return 'Cancelada'
  return 'Nova'
}

function badgeStatusProposta(status: PropostaRow['status_proposta']) {
  if (status === 'aprovada') return 'bg-emerald-500/15 text-emerald-300'
  if (status === 'em_execucao') return 'bg-brand/20 text-brand'
  if (status === 'entregue') return 'bg-blue-500/15 text-blue-300'
  if (status === 'cancelada') return 'bg-red-500/15 text-red-300'
  if (status === 'em_analise') return 'bg-amber-500/15 text-amber-300'
  return 'bg-zinc-800 text-zinc-400'
}

function linkProposta(slug: string) {
  if (import.meta.client) return `${window.location.origin}/proposta/${slug}`
  const config = useRuntimeConfig().public
  const base = (config.baseURL as string) || ''
  return `${base.replace(/\/$/, '')}/proposta/${slug}`
}
</script>
