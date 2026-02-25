<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">CRM de Clientes</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar cliente</h1>
        <p class="text-zinc-400 mt-2">Atualize dados, status do funil e mantenha histórico comercial consistente.</p>
      </div>
      <NuxtLink
        to="/admin/clientes"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando cliente...</div>
    <div v-else-if="!cliente" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Cliente não encontrado.</div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminClienteForm
        :cliente-id="id"
        :initial="cliente"
        @success="onSuccess"
        @deleted="onDeleted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchCRMClienteById, type CRMCliente } from '~/composables/useClientesCRM'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const { data: cliente, pending } = await useAsyncData(
  `crm-cliente-${id}`,
  () => fetchCRMClienteById(id)
)

function onSuccess(clienteAtualizado: CRMCliente) {
  alert(`Cliente ${clienteAtualizado.nome} atualizado com sucesso.`)
  navigateTo('/admin/clientes')
}

function onDeleted() {
  alert('Cliente removido com sucesso.')
  navigateTo('/admin/clientes')
}
</script>
