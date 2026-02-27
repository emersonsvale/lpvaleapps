<template>
  <FloatingNav :nav-items="navItems" />

  <main v-if="post" class="min-h-screen bg-background">
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        class="h-full bg-gradient-to-r from-brand-400 via-brand to-brand-300 transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(255,192,0,0.4)]"
        :style="{ width: `${readingProgress}%` }"
      />
    </div>

    <!-- Breadcrumb Navigation -->
    <nav class="container mx-auto px-6 max-w-4xl pt-32 md:pt-36 pb-4">
      <ol class="flex items-center gap-1.5 text-sm text-zinc-500">
        <li>
          <NuxtLink to="/" class="hover:text-zinc-300 transition-colors">Início</NuxtLink>
        </li>
        <li class="select-none">/</li>
        <li>
          <NuxtLink to="/blog" class="hover:text-zinc-300 transition-colors">Blog</NuxtLink>
        </li>
        <li class="select-none">/</li>
        <li class="text-zinc-400 truncate max-w-[200px] md:max-w-xs">{{ post.title }}</li>
      </ol>
    </nav>

    <article class="container mx-auto px-6 max-w-4xl">
      <!-- Article Header -->
      <header class="mb-10 pt-6 md:pt-8">
        <!-- Categories -->
        <div v-if="post.categories?.length" class="flex flex-wrap items-center gap-2 mb-5">
          <span
            v-for="cat in post.categories"
            :key="`cat-${cat.id}`"
            class="text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20"
          >
            {{ cat.name }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium leading-[1.15] text-zinc-50 mb-5 tracking-tight">
          {{ post.title }}
        </h1>

        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed mb-6 max-w-3xl">
          {{ post.excerpt }}
        </p>

        <!-- Author & Meta Row -->
        <div class="flex flex-wrap items-center gap-4 pb-6 border-b border-zinc-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand/30 to-brand/10 border border-brand/20 flex items-center justify-center text-brand font-semibold text-sm">
              {{ (post.author_name || 'VA').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-medium text-zinc-200">{{ post.author_name || 'Vale Apps' }}</p>
              <p class="text-xs text-zinc-500">{{ formatDate(post.published_at || post.created_at) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 ml-auto">
            <span class="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-full">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ post.reading_time || 1 }} min de leitura
            </span>
            <!-- Share Button -->
            <button
              @click="sharePost"
              class="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand bg-zinc-800/50 hover:bg-brand/10 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
              :title="copied ? 'Link copiado!' : 'Compartilhar'"
            >
              <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              <svg v-else class="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ copied ? 'Copiado!' : 'Compartilhar' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <figure v-if="post.cover_image" class="mb-12 -mx-2 sm:-mx-4 md:-mx-8 lg:-mx-16">
        <div class="relative overflow-hidden rounded-2xl group">
          <img
            :src="post.cover_image"
            :alt="post.cover_alt || post.title"
            class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            width="1200"
            height="630"
            loading="eager"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </figure>

      <!-- Content Layout: Main + Sidebar -->
      <div class="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
        <!-- Main Content -->
        <section ref="contentRef" class="prose-content min-w-0" v-html="post.content_html" />

        <!-- Sticky Table of Contents (Desktop) -->
        <aside v-if="toc.length > 1" class="hidden lg:block">
          <nav class="sticky top-24">
            <p class="text-[11px] uppercase tracking-widest text-zinc-500 font-medium mb-3">Neste artigo</p>
            <ul class="space-y-1 border-l border-zinc-800">
              <li v-for="(item, i) in toc" :key="i">
                <a
                  :href="`#${item.id}`"
                  class="block pl-3 py-1 text-[13px] leading-snug border-l-2 -ml-px transition-all duration-200"
                  :class="activeTocId === item.id
                    ? 'border-brand text-brand font-medium'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'"
                  @click.prevent="scrollToHeading(item.id)"
                >
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      <!-- Tags & Share Footer -->
      <footer class="mt-14 pt-8 border-t border-zinc-800/80">
        <!-- Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mb-8">
          <NuxtLink
            v-for="tag in post.tags"
            :key="`tag-${tag.id}`"
            :to="`/blog?tag=${tag.slug}`"
            class="text-xs px-3 py-1.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/50
                   hover:bg-brand/10 hover:text-brand hover:border-brand/30 transition-all duration-200"
          >
            #{{ tag.name }}
          </NuxtLink>
        </div>

        <!-- CTA Section -->
        <div class="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.08] via-brand/[0.04] to-transparent p-8 md:p-10 my-8">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-brand/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex-1">
              <p class="text-xl md:text-2xl font-medium text-zinc-100 mb-2">
                Quer transformar sua ideia em realidade?
              </p>
              <p class="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                A Vale Apps cria produtos digitais de alto impacto — web, mobile e IA. Fale com nossa equipe e acelere seu projeto.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/5511969210065?text=Olá! Vim do blog e quero tirar uma ideia do papel."
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-black font-medium
                       hover:bg-brand-300 hover:shadow-[0_0_24px_rgba(255,192,0,0.25)] transition-all duration-300 text-sm"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Falar no WhatsApp
              </a>
              <NuxtLink
                to="/#contato"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300
                       hover:border-brand/40 hover:text-brand transition-all duration-300 text-sm"
              >
                Solicitar orçamento
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Back to Blog -->
        <div class="flex items-center justify-between pt-4">
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand transition-colors duration-200 group"
          >
            <svg class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Voltar para o Blog
          </NuxtLink>
          <button
            @click="scrollToTop"
            class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-brand transition-colors duration-200 cursor-pointer group"
          >
            Voltar ao topo
            <svg class="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12l7-7 7 7M12 5v14"/></svg>
          </button>
        </div>
      </footer>

      <!-- Related Posts -->
      <section v-if="relatedPosts.length" class="mt-16 mb-20">
        <div class="flex items-center gap-3 mb-8">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <h2 class="text-lg font-medium text-zinc-300 shrink-0">Leia também</h2>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <article
            v-for="related in relatedPosts"
            :key="related.id"
            class="group rounded-2xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden
                   hover:border-brand/30 hover:bg-zinc-900/60 transition-all duration-300"
          >
            <NuxtLink :to="`/blog/${related.slug}`" class="block p-5">
              <p class="text-[11px] uppercase tracking-wider text-zinc-600 mb-3">
                {{ formatDate(related.published_at || related.created_at) }}
              </p>
              <h3 class="font-medium text-zinc-200 leading-snug mb-3 group-hover:text-brand transition-colors duration-200 line-clamp-2">
                {{ related.title }}
              </h3>
              <p class="text-sm text-zinc-500 line-clamp-2 mb-4">{{ related.excerpt }}</p>
              <span class="inline-flex items-center gap-1 text-xs text-zinc-600 group-hover:text-brand/80 transition-colors duration-200">
                Ler artigo
                <svg class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </NuxtLink>
          </article>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { PhHouse, PhChatCircle, PhBriefcase, PhCode, PhArticle } from '@phosphor-icons/vue'
import { fetchPublicBlogPostBySlug, fetchRelatedBlogPosts } from '~/composables/useBlogPosts'

const FloatingNav = defineAsyncComponent(() => import('~/components/ui/FloatingNav.vue'))

const navItems = [
  { name: 'Início', link: '/', icon: PhHouse },
  { name: 'Projetos', link: '/#projetos', icon: PhBriefcase },
  { name: 'Serviços', link: '/#servicos', icon: PhCode },
  { name: 'Blog', link: '/blog', icon: PhArticle },
  { name: 'Contato', link: '/#contato', icon: PhChatCircle },
]

const route = useRoute()
const slug = String(route.params.slug || '')
const { setPageSEO, generateBreadcrumb, generateBlogPostingSchema } = useSEO()

const { data } = await useAsyncData(`blog-post-${slug}`, async () => {
  const post = await fetchPublicBlogPostBySlug(slug)
  if (!post) return null

  const relatedPosts = await fetchRelatedBlogPosts(post.id, 3)
  return {
    post,
    relatedPosts,
  }
})

const post = computed(() => data.value?.post ?? null)
const relatedPosts = computed(() => data.value?.relatedPosts ?? [])

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post não encontrado' })
}

// ─── Reading Progress ─────────────────────────────────────
const readingProgress = ref(0)
const contentRef = ref<HTMLElement | null>(null)

function updateReadingProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

// ─── Share ─────────────────────────────────────────────────
const copied = ref(false)

async function sharePost() {
  const url = `https://valeapps.com.br/blog/${post.value?.slug}`
  if (navigator.share) {
    try {
      await navigator.share({ title: post.value?.title, url })
    } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Table of Contents ────────────────────────────────────
interface TocItem { id: string; text: string }
const toc = ref<TocItem[]>([])
const activeTocId = ref('')

function buildToc() {
  if (!contentRef.value) return
  const headings = contentRef.value.querySelectorAll('h2')
  const items: TocItem[] = []
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = `section-${i}`
    }
    items.push({ id: h.id, text: h.textContent?.trim() || '' })
  })
  toc.value = items
}

function updateActiveToc() {
  if (!contentRef.value) return
  const headings = contentRef.value.querySelectorAll('h2')
  let currentId = ''
  headings.forEach(h => {
    const rect = h.getBoundingClientRect()
    if (rect.top <= 120) currentId = h.id
  })
  activeTocId.value = currentId
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('scroll', updateActiveToc, { passive: true })
  nextTick(() => buildToc())
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('scroll', updateActiveToc)
})

const canonicalUrl = computed(() => post.value?.canonical_url || `https://valeapps.com.br/blog/${post.value?.slug}`)

setPageSEO({
  title: post.value.seo_title || post.value.title,
  description: post.value.seo_description || post.value.excerpt,
  keywords: post.value.focus_keyword || 'blog vale apps, desenvolvimento web, desenvolvimento mobile, IA, automação',
  image: post.value.og_image || post.value.cover_image || 'https://valeapps.com.br/og-image.png',
  url: canonicalUrl.value,
  type: 'article',
  author: post.value.author_name || 'Vale Apps',
  publishedTime: post.value.published_at || post.value.created_at,
  modifiedTime: post.value.updated_at,
})

generateBreadcrumb([
  { name: 'Início', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: post.value.title, url: `/blog/${post.value.slug}` },
])

generateBlogPostingSchema({
  title: post.value.title,
  description: post.value.excerpt,
  slug: post.value.slug,
  image: post.value.og_image || post.value.cover_image || undefined,
  authorName: post.value.author_name || 'Vale Apps',
  datePublished: post.value.published_at || post.value.created_at,
  dateModified: post.value.updated_at,
})

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
/* ─── Prose Content ───────────────────────────────────────── */
.prose-content {
  color: rgb(212 212 216);
  line-height: 1.85;
  font-size: 1.0625rem;
}

.prose-content :deep(h2) {
  color: rgb(250 250 250);
  margin: 2.5rem 0 1rem;
  font-size: 1.65rem;
  line-height: 2.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  scroll-margin-top: 5rem;
}

.prose-content :deep(h2)::before {
  content: '';
  display: block;
  width: 2rem;
  height: 3px;
  background: rgb(255 192 0 / 0.5);
  border-radius: 2px;
  margin-bottom: 0.6rem;
}

.prose-content :deep(h3) {
  color: rgb(244 244 245);
  margin: 2rem 0 .75rem;
  font-size: 1.3rem;
  line-height: 1.75rem;
  font-weight: 600;
  scroll-margin-top: 5rem;
}

.prose-content :deep(p) {
  margin: 1.15rem 0;
}

.prose-content :deep(p + p) {
  margin-top: 0.85rem;
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
  margin: 1.25rem 0;
  padding-left: 1.5rem;
}

.prose-content :deep(ul) {
  list-style: none;
}

.prose-content :deep(ul li) {
  position: relative;
  padding-left: 0.25rem;
}

.prose-content :deep(ul li)::before {
  content: '▸';
  color: rgb(255 192 0 / 0.6);
  position: absolute;
  left: -1.2rem;
  font-size: 0.85em;
}

.prose-content :deep(ol) {
  list-style: decimal;
}

.prose-content :deep(ol li)::marker {
  color: rgb(255 192 0 / 0.6);
  font-weight: 600;
}

.prose-content :deep(li) {
  margin-bottom: 0.4rem;
  line-height: 1.7;
}

.prose-content :deep(blockquote) {
  margin: 1.75rem 0;
  border-left: 3px solid rgb(255 192 0 / 0.4);
  padding: 1rem 1.25rem;
  background: rgb(255 192 0 / 0.04);
  border-radius: 0 0.75rem 0.75rem 0;
  color: rgb(161 161 170);
  font-style: italic;
}

.prose-content :deep(blockquote p) {
  margin: 0;
}

.prose-content :deep(a) {
  color: rgb(255 192 0);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgb(255 192 0 / 0.3);
  transition: text-decoration-color 0.2s;
}

.prose-content :deep(a:hover) {
  text-decoration-color: rgb(255 192 0);
}

.prose-content :deep(strong) {
  color: rgb(250 250 250);
  font-weight: 600;
}

.prose-content :deep(code) {
  background: rgb(39 39 42 / 0.8);
  color: rgb(255 213 102);
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  border: 1px solid rgb(63 63 70 / 0.5);
}

.prose-content :deep(pre) {
  margin: 1.75rem 0;
  padding: 1.25rem 1.5rem;
  background: rgb(24 24 27);
  border: 1px solid rgb(39 39 42);
  border-radius: 0.75rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
}

.prose-content :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: rgb(212 212 216);
}

.prose-content :deep(img) {
  border-radius: 0.75rem;
  margin: 2rem 0;
}

.prose-content :deep(table) {
  width: 100%;
  margin: 1.75rem 0;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.prose-content :deep(thead) {
  border-bottom: 2px solid rgb(255 192 0 / 0.2);
}

.prose-content :deep(th) {
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: rgb(250 250 250);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prose-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(39 39 42);
}

.prose-content :deep(tr:hover td) {
  background: rgb(255 192 0 / 0.03);
}

.prose-content :deep(hr) {
  margin: 2.5rem 0;
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, rgb(63 63 70), transparent);
}
</style>
