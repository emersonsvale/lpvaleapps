<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Blog</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar artigo</h1>
        <p class="text-zinc-400 mt-2">Atualize conteúdo, taxonomia, status e metadados SEO.</p>
      </div>
      <NuxtLink
        to="/admin/blog"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Carregando artigo...</div>
    <div v-else-if="!post" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">Artigo não encontrado.</div>
    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminBlogPostForm
        :post-id="id"
        :initial="post"
        :initial-category-ids="categoryIds"
        :initial-tag-ids="tagIds"
        @success="onSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  fetchBlogPostById,
  fetchBlogPostCategoryIds,
  fetchBlogPostTagIds,
} from '~/composables/useBlogPosts'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

const { data, pending } = await useAsyncData(`blog-post-admin-${id}`, async () => {
  const [post, categoryIds, tagIds] = await Promise.all([
    fetchBlogPostById(id),
    fetchBlogPostCategoryIds(id),
    fetchBlogPostTagIds(id),
  ])

  return {
    post,
    categoryIds,
    tagIds,
  }
})

const post = computed(() => data.value?.post ?? null)
const categoryIds = computed(() => data.value?.categoryIds ?? [])
const tagIds = computed(() => data.value?.tagIds ?? [])

function onSuccess() {
  navigateTo('/admin/blog')
}
</script>
