<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Blog</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Novo artigo</h1>
        <p class="text-zinc-400 mt-2">Crie um novo post com foco em SEO, indexação e conversão.</p>
      </div>
      <NuxtLink
        to="/admin/blog"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminBlogPostForm @success="onSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

function onSuccess() {
  navigateTo('/admin/blog')
}
</script>
