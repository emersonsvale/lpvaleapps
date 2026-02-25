<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Portfólio</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Novo projeto</h1>
        <p class="text-zinc-400 mt-2">Cadastre um novo projeto no portfólio com links e classificações completas.</p>
      </div>
      <NuxtLink
        to="/admin/portifolio"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminProjetoForm @success="onSuccess" />
    </div>

    <div class="rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-zinc-300">
      Preencha título, slug e ranking para manter o portfólio organizado e com boa navegabilidade.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

function onSuccess() {
  navigateTo('/admin/portifolio')
}
</script>
