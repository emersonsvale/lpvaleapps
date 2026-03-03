<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Gestão de Contratos</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar contrato</h1>
        <p class="text-zinc-400 mt-2">Atualize informações, status e observações do contrato.</p>
      </div>
      <NuxtLink
        to="/admin/contratos"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando contrato...</div>
    <div v-else-if="!contrato" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Contrato não encontrado.</div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminContratoForm
        :contrato-id="id"
        :initial="contrato"
        @success="onSuccess"
        @deleted="onDeleted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchContratoById, type ContratoRow } from '~/composables/useContratos'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const { data: contrato, pending } = await useAsyncData(
  `contrato-${id}`,
  () => fetchContratoById(id)
)

function onSuccess(contratoAtualizado: ContratoRow) {
  alert(`Contrato ${contratoAtualizado.titulo} atualizado com sucesso.`)
  navigateTo('/admin/contratos')
}

function onDeleted() {
  alert('Contrato removido com sucesso.')
  navigateTo('/admin/contratos')
}
</script>