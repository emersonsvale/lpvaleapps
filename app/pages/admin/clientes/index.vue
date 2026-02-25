<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-2">CRM de Clientes</h1>
        <p class="text-zinc-400">Gerencie leads, oportunidades e negociações em um funil completo.</p>
      </div>
      <NuxtLink
        to="/admin/clientes/novo"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        + Novo Cliente
      </NuxtLink>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Clientes totais</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metrics.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Pipeline ativo</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metrics.ativos }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Follow-up vencido/hoje</p>
        <p class="text-2xl font-semibold text-amber-300 mt-1">{{ metrics.followupsHoje }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Valor em pipeline</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ formatarMoeda(metrics.valorPipeline) }}</p>
      </article>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar por nome, empresa, email ou telefone"
        class="md:col-span-2 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      >
      <select
        v-model="filtroPrioridade"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="">Todas as prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>
      <select
        v-model="filtroStatus"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="">Todos os status</option>
        <option v-for="coluna in colunasKanban" :key="coluna.status" :value="coluna.status">
          {{ coluna.titulo }}
        </option>
      </select>
    </div>

    <div v-if="possuiFiltros" class="-mt-2">
      <button
        type="button"
        class="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        @click="limparFiltros"
      >
        Limpar filtros
      </button>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando clientes...</div>
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
              {{ clientesPorStatus[coluna.status]?.length || 0 }}
            </span>
          </header>

          <div class="space-y-3">
            <article
              v-for="cliente in clientesPorStatus[coluna.status]"
              :key="cliente.id"
              class="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors"
              draggable="true"
              @dragstart="onDragStart(cliente.id)"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-medium text-zinc-100 text-sm leading-snug">{{ cliente.nome }}</p>
                  <p v-if="cliente.empresa" class="text-zinc-500 text-xs mt-1">{{ cliente.empresa }}</p>
                </div>
                <span
                  class="text-[10px] px-2 py-1 rounded-md border"
                  :class="badgePrioridade(cliente.prioridade)"
                >
                  {{ tituloPrioridade(cliente.prioridade) }}
                </span>
              </div>

              <div class="mt-2 space-y-1 text-xs text-zinc-500">
                <p v-if="cliente.email" class="truncate">{{ cliente.email }}</p>
                <p v-if="cliente.telefone">{{ cliente.telefone }}</p>
                <p v-if="cliente.proximo_followup">Follow-up: {{ formatarData(cliente.proximo_followup) }}</p>
              </div>

              <div class="mt-3 flex items-center justify-between gap-2">
                <span class="text-brand font-medium text-xs">{{ formatarMoeda(cliente.valor_potencial ?? 0) }}</span>
                <NuxtLink
                  :to="`/admin/clientes/editar/${cliente.id}`"
                  class="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Editar
                </NuxtLink>
              </div>

              <select
                :value="cliente.status"
                class="mt-3 w-full px-2 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                @change="onSelectStatusChange(cliente.id, $event)"
              >
                <option v-for="op in colunasKanban" :key="`${cliente.id}-${op.status}`" :value="op.status">
                  {{ op.titulo }}
                </option>
              </select>
            </article>

            <p v-if="!(clientesPorStatus[coluna.status]?.length)" class="text-zinc-600 text-xs">Sem clientes</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  calcularCRMMetrics,
  fetchCRMClientes,
  getCRMStatusColumns,
  type CRMCliente,
  type ClientePrioridade,
  type ClienteStatus,
  updateCRMClienteStatus,
} from '~/composables/useClientesCRM'

definePageMeta({ layout: 'admin' })

const { data: clientes, pending, error: erro } = await useAsyncData('admin-crm-clientes', fetchCRMClientes)
const clienteArrastadoId = ref<number | null>(null)
const filtroBusca = ref('')
const filtroPrioridade = ref<ClientePrioridade | ''>('')
const filtroStatus = ref<ClienteStatus | ''>('')

const colunasKanban = getCRMStatusColumns()

const clientesFiltrados = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  return (clientes.value ?? []).filter((cliente) => {
    if (filtroPrioridade.value && cliente.prioridade !== filtroPrioridade.value) return false
    if (filtroStatus.value && cliente.status !== filtroStatus.value) return false

    if (!termo) return true

    const alvo = [
      cliente.nome,
      cliente.empresa,
      cliente.email,
      cliente.telefone,
      cliente.origem,
      ...(cliente.tags ?? [])
    ]
      .map(item => String(item ?? '').toLowerCase())
      .join(' ')

    return alvo.includes(termo)
  })
})

const metrics = computed(() => calcularCRMMetrics(clientesFiltrados.value))
const possuiFiltros = computed(() => Boolean(filtroBusca.value || filtroPrioridade.value || filtroStatus.value))

const clientesPorStatus = computed(() => {
  const mapa = Object.fromEntries(
    colunasKanban.map(coluna => [coluna.status, [] as CRMCliente[]])
  ) as Record<ClienteStatus, CRMCliente[]>

  for (const cliente of clientesFiltrados.value) {
    if (!mapa[cliente.status]) {
      mapa.lead.push(cliente)
      continue
    }
    mapa[cliente.status].push(cliente)
  }

  for (const coluna of colunasKanban) {
    mapa[coluna.status].sort((a, b) => {
      const timeA = new Date(a.updated_at).getTime()
      const timeB = new Date(b.updated_at).getTime()
      return timeB - timeA
    })
  }

  return mapa
})

function onDragStart(clienteId: number) {
  clienteArrastadoId.value = clienteId
}

async function onDrop(status: ClienteStatus) {
  const clienteId = clienteArrastadoId.value
  clienteArrastadoId.value = null
  if (!clienteId) return

  await moverStatus(clienteId, status)
}

async function onSelectStatusChange(clienteId: number, event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target?.value) return
  await moverStatus(clienteId, target.value as ClienteStatus)
}

async function moverStatus(clienteId: number, novoStatus: ClienteStatus) {
  const lista = clientes.value ?? []
  const cliente = lista.find(item => item.id === clienteId)
  if (!cliente) return
  if (cliente.status === novoStatus) return

  const statusAnterior = cliente.status
  atualizarStatusLocal(clienteId, novoStatus)

  const { error } = await updateCRMClienteStatus(clienteId, novoStatus)
  if (error) {
    atualizarStatusLocal(clienteId, statusAnterior)
    alert(`Erro ao atualizar status: ${error}`)
  }
}

function atualizarStatusLocal(clienteId: number, status: ClienteStatus) {
  if (!clientes.value) return
  clientes.value = clientes.value.map((item) => {
    if (item.id !== clienteId) return item
    return {
      ...item,
      status,
      updated_at: new Date().toISOString(),
    }
  })
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarData(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(valor))
}

function tituloPrioridade(prioridade: ClientePrioridade) {
  if (prioridade === 'alta') return 'Alta'
  if (prioridade === 'baixa') return 'Baixa'
  return 'Média'
}

function badgePrioridade(prioridade: ClientePrioridade) {
  if (prioridade === 'alta') return 'border-red-500/40 text-red-300 bg-red-500/10'
  if (prioridade === 'baixa') return 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
  return 'border-amber-500/40 text-amber-300 bg-amber-500/10'
}

function limparFiltros() {
  filtroBusca.value = ''
  filtroPrioridade.value = ''
  filtroStatus.value = ''
}
</script>
