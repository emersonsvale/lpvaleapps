<template>
  <div class="space-y-8">
    <!-- Cards de métricas -->
    <section>
      <h2 class="sr-only">Métricas</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700/80 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Projetos no portfólio</p>
              <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ stats?.projetos ?? 0 }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
              <PhFolderOpen class="w-5 h-5 text-brand" />
            </div>
          </div>
          <NuxtLink
            to="/admin/portifolio"
            class="mt-3 inline-block text-sm text-brand hover:underline"
          >
            Ver projetos →
          </NuxtLink>
        </div>

        <div
          class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700/80 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Total de propostas</p>
              <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ stats?.propostas ?? 0 }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
              <PhFileText class="w-5 h-5 text-brand" />
            </div>
          </div>
          <NuxtLink
            to="/admin/propostas"
            class="mt-3 inline-block text-sm text-brand hover:underline"
          >
            Ver propostas →
          </NuxtLink>
        </div>

        <div
          class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 hover:border-zinc-700/80 transition-colors sm:col-span-2 lg:col-span-1"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-500">Valor total (propostas)</p>
              <p class="text-2xl font-semibold text-brand mt-1">{{ valorTotalFormatado }}</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
              <PhTrendUp class="w-5 h-5 text-brand" />
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 border-dashed hover:border-brand/40 hover:bg-brand/5 transition-colors sm:col-span-2 lg:col-span-1"
        >
          <NuxtLink to="/admin/propostas/nova" class="flex flex-col h-full">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                <PhPlus class="w-5 h-5 text-brand" />
              </div>
              <div>
                <p class="font-medium text-zinc-200">Nova Proposta</p>
                <p class="text-sm text-zinc-500">Criar e enviar link ao cliente</p>
              </div>
            </div>
            <span class="mt-3 inline-block text-sm text-brand font-medium">Criar proposta →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Últimas propostas -->
    <section>
      <div class="flex items-center justify-between gap-4 mb-4">
        <h2 class="text-lg font-semibold text-zinc-100">Últimas propostas</h2>
        <NuxtLink
          to="/admin/propostas"
          class="text-sm text-brand hover:underline"
        >
          Ver todas
        </NuxtLink>
      </div>
      <div v-if="pending" class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500">
        Carregando...
      </div>
      <div
        v-else-if="ultimasPropostas.length === 0"
        class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-8 text-center text-zinc-500"
      >
        Nenhuma proposta ainda. Crie a primeira em <NuxtLink to="/admin/propostas/nova" class="text-brand hover:underline">Nova Proposta</NuxtLink>.
      </div>
      <div v-else class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
        <ul class="divide-y divide-zinc-800/80">
          <li
            v-for="p in ultimasPropostas"
            :key="p.id"
            class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-800/30 transition-colors"
          >
            <div>
              <p class="font-medium text-zinc-200">{{ p.nome_proejeto || p.nome_cliente || 'Proposta #' + p.id }}</p>
              <p v-if="p.nome_cliente" class="text-sm text-zinc-500">{{ p.nome_cliente }}</p>
              <p class="text-xs text-zinc-500 mt-1">
                {{ p.tipo_proposta === 'hora' ? 'Por hora' : 'Empreitada' }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-medium text-brand">{{ resumoFinanceiro(p) }}</span>
              <div class="flex items-center gap-2">
                <a
                  v-if="p.slug"
                  :href="linkProposta(p.slug)"
                  target="_blank"
                  rel="noopener"
                  class="text-sm text-zinc-400 hover:text-brand"
                >
                  Link
                </a>
                <NuxtLink
                  :to="`/admin/propostas/editar/${p.id}`"
                  class="text-sm text-zinc-400 hover:text-zinc-200"
                >
                  Editar
                </NuxtLink>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropostaRow } from '~/composables/usePropostas'
import { PhFolderOpen, PhFileText, PhPlus, PhTrendUp } from '@phosphor-icons/vue'
import { fetchPropostas } from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

const supabase = useSupabase()

const { data: dashboardData, pending } = await useAsyncData(
  'admin-dashboard',
  async () => {
    let projetos = 0
    if (supabase) {
      const { count } = await supabase.from('projetos').select('*', { count: 'exact', head: true })
      projetos = count ?? 0
    }
    const propostasList = await fetchPropostas()
    const propostas = propostasList.length
    const valorTotal = propostasList.reduce((s, p) => s + (p.valor_final ?? 0), 0)
    return { projetos, propostas, valorTotal, propostasList }
  }
)

const stats = computed(() =>
  dashboardData.value
    ? {
        projetos: dashboardData.value.projetos,
        propostas: dashboardData.value.propostas,
        valorTotal: dashboardData.value.valorTotal
      }
    : null
)

const ultimasPropostas = computed(() => (dashboardData.value?.propostasList ?? []).slice(0, 5) as PropostaRow[])

const valorTotalFormatado = computed(() => {
  const v = dashboardData.value?.valorTotal ?? 0
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
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

function linkProposta(slug: string) {
  if (import.meta.client) return `${window.location.origin}/proposta/${slug}`
  const config = useRuntimeConfig().public
  const base = (config.baseURL as string) || ''
  return `${base.replace(/\/$/, '')}/proposta/${slug}`
}
</script>
