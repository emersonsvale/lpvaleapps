<template>
  <FloatingNav :nav-items="navItems" />

  <main class="min-h-screen bg-background pt-32 pb-20 md:pt-36 md:pb-24">
    <div class="container mx-auto px-6 max-w-6xl">
      <header class="mb-10">
        <p class="text-sm uppercase tracking-widest text-brand mb-3 font-medium">Blog Vale Apps</p>
        <h1 class="text-4xl md:text-6xl font-medium leading-tight mb-4">
          Conteúdo sobre <span class="text-brand">produto digital</span>, apps e IA
        </h1>
        <p class="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Guias práticos, tendências e estratégias para empresas que querem crescer com desenvolvimento web, mobile, automação e inteligência artificial.
        </p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label class="block text-xs text-muted-foreground uppercase tracking-wide mb-2">Categoria</label>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              :to="buildListUrl(undefined, tagParam, 1)"
              class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
              :class="!categoryParam ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'"
            >
              Todas
            </NuxtLink>
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="buildListUrl(category.slug, tagParam, 1)"
              class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
              :class="categoryParam === category.slug ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <div>
          <label class="block text-xs text-muted-foreground uppercase tracking-wide mb-2">Tag</label>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              :to="buildListUrl(categoryParam, undefined, 1)"
              class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
              :class="!tagParam ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'"
            >
              Todas
            </NuxtLink>
            <NuxtLink
              v-for="tag in tags"
              :key="tag.id"
              :to="buildListUrl(categoryParam, tag.slug, 1)"
              class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
              :class="tagParam === tag.slug ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'"
            >
              {{ tag.name }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <section v-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.id"
          class="rounded-2xl border border-white/[0.06] bg-zinc-900/60 overflow-hidden hover:border-brand/20 transition-colors"
        >
          <NuxtLink :to="`/blog/${post.slug}`" class="block">
            <img
              v-if="post.cover_image"
              :src="post.cover_image"
              :alt="post.cover_alt || post.title"
              class="w-full h-48 object-cover"
              width="640"
              height="384"
              loading="lazy"
            />
            <div v-else class="w-full h-48 bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">Sem imagem</div>
          </NuxtLink>

          <div class="p-5 space-y-3">
            <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span>{{ formatDate(post.published_at || post.created_at) }}</span>
              <span>&middot;</span>
              <span>{{ post.reading_time || 1 }} min de leitura</span>
            </div>

            <h2 class="text-xl font-semibold text-zinc-100 leading-tight">
              <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-brand transition-colors">
                {{ post.title }}
              </NuxtLink>
            </h2>

            <p class="text-zinc-400 text-sm leading-relaxed line-clamp-3">{{ post.excerpt }}</p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="category in post.categories"
                :key="`category-${post.id}-${category.id}`"
                class="text-[11px] px-2 py-1 rounded-md bg-brand/10 text-brand"
              >
                {{ category.name }}
              </span>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-500">
        Nenhum artigo encontrado para os filtros atuais.
      </section>

      <nav v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
        <NuxtLink
          v-for="page in totalPages"
          :key="page"
          :to="buildListUrl(categoryParam, tagParam, page)"
          class="px-3 py-1.5 rounded-lg border text-sm transition-colors"
          :class="page === currentPage ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'"
        >
          {{ page }}
        </NuxtLink>
      </nav>
    </div>
  </main>
</template>

<script setup lang="ts">
import { PhHouse, PhChatCircle, PhBriefcase, PhCode, PhArticle } from '@phosphor-icons/vue'
import { fetchPublicBlogPosts } from '~/composables/useBlogPosts'
import { fetchBlogCategories, fetchBlogTags } from '~/composables/useBlogTaxonomy'

const FloatingNav = defineAsyncComponent(() => import('~/components/ui/FloatingNav.vue'))

const navItems = [
  { name: 'Início', link: '/', icon: PhHouse },
  { name: 'Projetos', link: '/#projetos', icon: PhBriefcase },
  { name: 'Serviços', link: '/#servicos', icon: PhCode },
  { name: 'Blog', link: '/blog', icon: PhArticle },
  { name: 'Contato', link: '/#contato', icon: PhChatCircle },
]

const route = useRoute()
const pageSize = 9
const { setPageSEO, generateBreadcrumb } = useSEO()

const currentPage = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isFinite(value) && value > 0 ? value : 1
})

const categoryParam = computed(() => (typeof route.query.categoria === 'string' ? route.query.categoria : undefined))
const tagParam = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : undefined))

const { data } = await useAsyncData(
  () => `blog-list-${currentPage.value}-${categoryParam.value || 'all'}-${tagParam.value || 'all'}`,
  async () => {
    const [postsResult, categories, tags] = await Promise.all([
      fetchPublicBlogPosts({
        page: currentPage.value,
        pageSize,
        categorySlug: categoryParam.value,
        tagSlug: tagParam.value,
      }),
      fetchBlogCategories(),
      fetchBlogTags(),
    ])

    return {
      posts: postsResult.posts,
      total: postsResult.total,
      categories,
      tags,
    }
  },
  {
    watch: [currentPage, categoryParam, tagParam],
  }
)

const posts = computed(() => data.value?.posts ?? [])
const total = computed(() => data.value?.total ?? 0)
const categories = computed(() => data.value?.categories ?? [])
const tags = computed(() => data.value?.tags ?? [])
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

const canonicalUrl = computed(() => {
  const query = new URLSearchParams()
  if (categoryParam.value) query.set('categoria', categoryParam.value)
  if (tagParam.value) query.set('tag', tagParam.value)
  if (currentPage.value > 1) query.set('page', String(currentPage.value))

  const queryString = query.toString()
  return `https://valeapps.com.br/blog${queryString ? `?${queryString}` : ''}`
})

setPageSEO({
  title: 'Blog Vale Apps | Desenvolvimento Web, Mobile, IA e Automação',
  description: 'Artigos sobre desenvolvimento de aplicativos, software sob medida, IA, automação e crescimento digital para empresas.',
  keywords: 'blog desenvolvimento de apps, software sob medida, IA para empresas, automação de processos, desenvolvimento web e mobile',
  url: canonicalUrl.value,
  type: 'website',
})

generateBreadcrumb([
  { name: 'Início', url: '/' },
  { name: 'Blog', url: '/blog' },
])

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildListUrl(category?: string, tag?: string, page = 1) {
  const query = new URLSearchParams()
  if (category) query.set('categoria', category)
  if (tag) query.set('tag', tag)
  if (page > 1) query.set('page', String(page))
  const queryString = query.toString()
  return `/blog${queryString ? `?${queryString}` : ''}`
}
</script>
