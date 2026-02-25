<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Novo Cliente</h1>
    <p class="text-zinc-400 mb-6">Cadastre um cliente no CRM e inicie o acompanhamento comercial.</p>
    <AdminClienteForm @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
import type { CRMCliente } from '~/composables/useClientesCRM'

definePageMeta({ layout: 'admin' })

function onSuccess(cliente: CRMCliente) {
  alert(`Cliente ${cliente.nome} criado com sucesso.`)
  navigateTo(`/admin/clientes/editar/${cliente.id}`)
}
</script>
