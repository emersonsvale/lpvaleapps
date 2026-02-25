<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">CRM de Clientes</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Novo cliente</h1>
        <p class="text-zinc-400 mt-2">Cadastre o contato comercial e inicie o acompanhamento no funil.</p>
      </div>
      <NuxtLink
        to="/admin/clientes"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminClienteForm @success="onSuccess" />
    </div>

    <div class="rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-zinc-300">
      Sugestão: preencha telefone, origem e próximo follow-up para não perder timing comercial.
    </div>
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
