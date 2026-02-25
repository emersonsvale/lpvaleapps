<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Editar Cliente</h1>
    <p class="text-zinc-400 mb-6">Atualize dados, status do funil e histórico de interações.</p>

    <div v-if="pending" class="text-zinc-500">Carregando...</div>
    <div v-else-if="!cliente" class="text-zinc-500">Cliente não encontrado.</div>
    <AdminClienteForm
      v-else
      :cliente-id="id"
      :initial="cliente"
      @success="onSuccess"
      @deleted="onDeleted"
    />
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
