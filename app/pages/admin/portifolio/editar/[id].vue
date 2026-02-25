<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Portfólio</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar projeto</h1>
        <p class="text-zinc-400 mt-2">Atualize informações de exibição, links e posicionamento do projeto.</p>
      </div>
      <NuxtLink
        to="/admin/portifolio"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando projeto...</div>
    <div v-else-if="!projeto" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Projeto não encontrado.</div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminProjetoForm
        :projeto-id="id"
        :initial="projeto"
        @success="onSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchProjetoById } from '~/composables/useProjetosAdmin'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const { data: projeto, pending } = await useAsyncData(
  `projeto-admin-${id}`,
  () => fetchProjetoById(id)
)

function onSuccess() {
  navigateTo('/admin/portifolio')
}
</script>
