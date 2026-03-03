<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Contratos</h1>
        <p class="text-zinc-400">Crie, acompanhe e mantenha o histórico dos contratos comerciais.</p>
      </div>
      <NuxtLink
        to="/admin/contratos/novo"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        + Novo Contrato
      </NuxtLink>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Total de contratos</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metricas.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Assinados</p>
        <p class="text-2xl font-semibold text-emerald-300 mt-1">{{ metricas.assinados }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Em aberto</p>
        <p class="text-2xl font-semibold text-amber-300 mt-1">{{ metricas.emAberto }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Valor total</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ formatarMoeda(metricas.valorTotal) }}</p>
      </article>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar por título, cliente, email ou telefone"
        class="md:col-span-2 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      >
      <select
        v-model="filtroStatus"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="todos">Todos os status</option>
        <option v-for="op in statusOptions" :key="op.status" :value="op.status">
          {{ op.titulo }}
        </option>
      </select>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando contratos...</div>
    <div v-else-if="erro" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">{{ erro }}</div>
    <div v-else-if="contratosFiltrados.length === 0" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Nenhum contrato encontrado.
    </div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[960px] text-sm">
          <thead class="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
            <tr>
              <th class="text-left font-medium px-4 py-3">Contrato</th>
              <th class="text-left font-medium px-4 py-3">Cliente</th>
              <th class="text-left font-medium px-4 py-3">Status</th>
              <th class="text-left font-medium px-4 py-3">Período</th>
              <th class="text-left font-medium px-4 py-3">Valor</th>
              <th class="text-right font-medium px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800/80">
            <tr v-for="contrato in contratosFiltrados" :key="contrato.id" class="hover:bg-zinc-800/30 transition-colors">
              <td class="px-4 py-3">
                <p class="font-medium text-zinc-200">{{ contrato.titulo }}</p>
                <p class="text-xs text-zinc-500">#{{ contrato.id }} · {{ formatarDataHora(contrato.created_at) }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="text-zinc-200">{{ contrato.cliente_nome }}</p>
                <p v-if="contrato.cliente_email" class="text-xs text-zinc-500">{{ contrato.cliente_email }}</p>
                <p v-if="contrato.cliente_telefone" class="text-xs text-zinc-500">{{ contrato.cliente_telefone }}</p>
              </td>
              <td class="px-4 py-3">
                <select
                  :value="contrato.status"
                  class="w-full px-2 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                  @change="onSelectStatusChange(contrato.id, $event)"
                >
                  <option v-for="op in statusOptions" :key="`${contrato.id}-${op.status}`" :value="op.status">
                    {{ op.titulo }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3 text-zinc-400">
                <p>{{ formatarDataOuTraco(contrato.data_inicio) }} → {{ formatarDataOuTraco(contrato.data_fim) }}</p>
                <p class="text-xs text-zinc-500">Assinatura: {{ formatarDataOuTraco(contrato.data_assinatura) }}</p>
              </td>
              <td class="px-4 py-3 text-brand font-medium">{{ formatarMoeda(contrato.valor_total ?? 0) }}</td>
              <td class="px-4 py-3 text-right">
                <NuxtLink
                  :to="`/admin/contratos/editar/${contrato.id}`"
                  class="text-zinc-300 hover:text-zinc-100"
                >
                  Editar
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  fetchContratos,
  getContratoStatusOptions,
  type ContratoRow,
  type ContratoStatus,
  updateContratoStatus,
} from '~/composables/useContratos'

definePageMeta({ layout: 'admin' })

const { data: contratos, pending, error: erro } = await useAsyncData('admin-contratos', fetchContratos)
const filtroBusca = ref('')
const filtroStatus = ref<ContratoStatus | 'todos'>('todos')
const statusOptions = getContratoStatusOptions()

const contratosFiltrados = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  return (contratos.value ?? []).filter((contrato) => {
    if (filtroStatus.value !== 'todos' && contrato.status !== filtroStatus.value) return false

    if (!termo) return true

    const alvo = [
      contrato.titulo,
      contrato.cliente_nome,
      contrato.cliente_email,
      contrato.cliente_telefone,
      contrato.descricao,
      contrato.observacoes,
    ]
      .map(item => String(item ?? '').toLowerCase())
      .join(' ')

    return alvo.includes(termo)
  })
})

const metricas = computed(() => {
  const lista = contratosFiltrados.value
  const assinados = lista.filter(item => item.status === 'assinado').length
  const emAberto = lista.filter(item => item.status === 'rascunho' || item.status === 'enviado').length
  const valorTotal = lista.reduce((acc, item) => acc + (item.valor_total ?? 0), 0)

  return {
    total: lista.length,
    assinados,
    emAberto,
    valorTotal,
  }
})

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarDataHora(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(valor))
}

function formatarDataOuTraco(valor: string | null) {
  if (!valor) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(valor))
}

async function onSelectStatusChange(contratoId: number, event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target?.value) return
  await atualizarStatus(contratoId, target.value as ContratoStatus)
}

async function atualizarStatus(contratoId: number, novoStatus: ContratoStatus) {
  const lista = contratos.value ?? []
  const contrato = lista.find((item) => item.id === contratoId)
  if (!contrato) return
  if (contrato.status === novoStatus) return

  const statusAnterior = contrato.status
  atualizarStatusLocal(contratoId, novoStatus)

  const { error } = await updateContratoStatus(contratoId, novoStatus)
  if (error) {
    atualizarStatusLocal(contratoId, statusAnterior)
    alert(`Erro ao atualizar status: ${error}`)
  }
}

function atualizarStatusLocal(contratoId: number, status: ContratoStatus) {
  if (!contratos.value) return

  contratos.value = contratos.value.map((item) => {
    if (item.id !== contratoId) return item
    return {
      ...item,
      status,
      updated_at: new Date().toISOString(),
    } as ContratoRow
  })
}
</script>