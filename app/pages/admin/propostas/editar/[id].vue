<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Propostas</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar proposta</h1>
        <p class="text-zinc-400 mt-2">Ajuste escopo e condições comerciais. O link permanece igual se o slug não mudar.</p>
      </div>
      <NuxtLink
        to="/admin/propostas"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando proposta...</div>
    <div v-else-if="!proposta" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Proposta não encontrada.</div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminPropostaForm
        :proposta-id="id"
        :initial="proposta"
        @success="onSuccess"
      />
    </div>
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
