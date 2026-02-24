<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Editar Proposta</h1>
    <p class="text-zinc-400 mb-6">Altere os dados e salve. O link para o cliente permanece o mesmo se o slug não for alterado.</p>
    <div v-if="pending" class="text-zinc-500">Carregando...</div>
    <div v-else-if="!proposta" class="text-zinc-500">Proposta não encontrada.</div>
    <AdminPropostaForm
      v-else
      :proposta-id="id"
      :initial="proposta"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { fetchPropostaById } from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const { data: proposta, pending } = await useAsyncData(
  `proposta-${id}`,
  () => fetchPropostaById(id)
)

function onSuccess() {
  navigateTo('/admin/propostas')
}
</script>
