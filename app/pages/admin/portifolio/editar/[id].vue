<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Editar projeto</h1>
    <p class="text-zinc-400 mb-6">Altere os dados do projeto.</p>
    <div v-if="pending" class="text-zinc-500">Carregando...</div>
    <div v-else-if="!projeto" class="text-zinc-500">Projeto não encontrado.</div>
    <AdminProjetoForm
      v-else
      :projeto-id="id"
      :initial="projeto"
      @success="onSuccess"
    />
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
