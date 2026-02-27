<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Blog</h1>
        <p class="text-zinc-400">Gerencie artigos, status de publicação e SEO do blog.</p>
      </div>
      <NuxtLink
        to="/admin/blog/novo"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity"
      >
        <span>+ Novo artigo</span>
      </NuxtLink>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Total</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metrics.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Publicados</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ metrics.published }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Agendados</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metrics.scheduled }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Rascunhos</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metrics.draft }}</p>
      </article>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por título ou slug"
        class="md:col-span-3 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      />
      <select
        v-model="statusFilter"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="all">Todos os status</option>
        <option value="published">Publicado</option>
        <option value="scheduled">Agendado</option>
        <option value="draft">Rascunho</option>
      </select>
    </section>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando artigos...
    </div>
    <div v-else-if="errorMessage" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      {{ errorMessage }}
    </div>
    <div v-else class="space-y-3">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="font-medium text-zinc-100 truncate">{{ post.title }}</p>
            <p class="text-zinc-500 text-sm truncate">/blog/{{ post.slug }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-md" :class="statusBadgeClass(post.status)">
              {{ statusLabel(post.status) }}
            </span>
            <span v-if="post.noindex" class="text-xs px-2 py-1 rounded-md bg-red-500/20 text-red-300">Noindex</span>
            <NuxtLink
              :to="`/admin/blog/editar/${post.id}`"
              class="text-sm px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              Editar
            </NuxtLink>
            <a
              v-if="post.status === 'published'"
              :href="`/blog/${post.slug}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              Ver artigo
            </a>
            <button
              v-if="post.status !== 'published'"
              type="button"
              class="text-sm px-3 py-1.5 rounded-md border border-brand/40 text-brand hover:bg-brand/10 transition-colors"
              @click="handlePublish(post.id)"
            >
              Publicar
            </button>
            <button
              v-if="post.status === 'published'"
              type="button"
              class="text-sm px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
              @click="handleUnpublish(post.id)"
            >
              Voltar para rascunho
            </button>
          </div>
        </div>
      </article>

      <div v-if="!filteredPosts.length" class="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
        <p class="text-zinc-400">Nenhum artigo encontrado com os filtros atuais.</p>
        <NuxtLink to="/admin/blog/novo" class="inline-block mt-3 text-brand hover:underline">Criar artigo</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  fetchBlogPostsAdmin,
  publishBlogPost,
  unpublishBlogPost,
  type BlogPostAdminListItem,
  type BlogStatus,
} from '~/composables/useBlogPosts'

definePageMeta({ layout: 'admin' })

const pending = ref(true)
const errorMessage = ref('')
const posts = ref<BlogPostAdminListItem[]>([])
const search = ref('')
const statusFilter = ref<BlogStatus | 'all'>('all')

async function loadPosts() {
  pending.value = true
  errorMessage.value = ''
  try {
    posts.value = await fetchBlogPostsAdmin()
  }
  catch (error: any) {
    errorMessage.value = error?.message || 'Erro ao carregar artigos'
  }
  finally {
    pending.value = false
  }
}

onMounted(loadPosts)

const filteredPosts = computed(() => {
  const term = search.value.trim().toLowerCase()
  return posts.value.filter((post) => {
    if (statusFilter.value !== 'all' && post.status !== statusFilter.value) return false
    if (!term) return true
    return post.title.toLowerCase().includes(term) || post.slug.toLowerCase().includes(term)
  })
})

const metrics = computed(() => {
  const total = posts.value.length
  const published = posts.value.filter((item) => item.status === 'published').length
  const scheduled = posts.value.filter((item) => item.status === 'scheduled').length
  const draft = posts.value.filter((item) => item.status === 'draft').length
  return { total, published, scheduled, draft }
})

function statusLabel(status: BlogStatus) {
  if (status === 'published') return 'Publicado'
  if (status === 'scheduled') return 'Agendado'
  return 'Rascunho'
}

function statusBadgeClass(status: BlogStatus) {
  if (status === 'published') return 'bg-brand/20 text-brand'
  if (status === 'scheduled') return 'bg-blue-500/20 text-blue-300'
  return 'bg-zinc-700 text-zinc-300'
}

async function handlePublish(id: number) {
  const { error } = await publishBlogPost(id)
  if (error) {
    alert('Erro ao publicar: ' + error)
    return
  }
  await loadPosts()
}

async function handleUnpublish(id: number) {
  const { error } = await unpublishBlogPost(id)
  if (error) {
    alert('Erro ao voltar para rascunho: ' + error)
    return
  }
  await loadPosts()
}
</script>
