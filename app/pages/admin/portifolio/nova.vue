<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Novo projeto</h1>
    <p class="text-zinc-400 mb-6">Cadastre um novo projeto no portfólio.</p>
    <AdminProjetoForm @success="onSuccess" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

function onSuccess() {
  navigateTo('/admin/portifolio')
}
</script>
