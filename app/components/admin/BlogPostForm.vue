<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
          placeholder="Ex: Quanto custa desenvolver um app em 2026"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Slug (URL)</label>
        <input
          v-model="form.slug"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
          placeholder="ex: quanto-custa-desenvolver-um-app"
          required
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Resumo (excerpt)</label>
      <textarea
        v-model="form.excerpt"
        rows="3"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
        placeholder="Resumo curto para listagem e meta description"
        required
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Status</label>
        <select v-model="form.status" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100">
          <option value="draft">Rascunho</option>
          <option value="scheduled">Agendado</option>
          <option value="published">Publicado</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Publicado em</label>
        <input
          v-model="form.published_at"
          type="datetime-local"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Agendado para</label>
        <input
          v-model="form.scheduled_at"
          type="datetime-local"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          :disabled="form.status !== 'scheduled'"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Autor</label>
        <input
          v-model="form.author_name"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Vale Apps"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Palavra-chave foco</label>
        <input
          v-model="form.focus_keyword"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="desenvolvimento de aplicativos"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Imagem de capa (URL ou upload)</label>
        <input
          v-model="form.cover_image"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="https://..."
        />
        <div class="mt-2 flex items-center gap-2">
          <input
            ref="coverFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onCoverFileChange"
          />
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs disabled:opacity-50"
            :disabled="uploadingCover"
            @click="openCoverFilePicker"
          >
            {{ uploadingCover ? 'Enviando imagem...' : 'Fazer upload' }}
          </button>
          <span class="text-xs text-zinc-500">JPG, PNG, WEBP, AVIF ou GIF (até 10MB)</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Alt da capa</label>
        <input
          v-model="form.cover_alt"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Descrição da imagem para SEO e acessibilidade"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">SEO title</label>
        <input
          v-model="form.seo_title"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Título SEO (até ~60 chars)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">SEO description</label>
        <input
          v-model="form.seo_description"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Meta description (até ~160 chars)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">OG image (URL)</label>
        <input
          v-model="form.og_image"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="https://..."
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Canonical URL (opcional)</label>
        <input
          v-model="form.canonical_url"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="https://valeapps.com.br/blog/..."
        />
      </div>
      <div class="flex items-end gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="form.noindex" type="checkbox" class="rounded border-zinc-600 bg-zinc-900 text-brand" />
          <span class="text-sm text-zinc-300">Noindex (não indexar no Google)</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">Categorias</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <label
            v-for="category in categories"
            :key="category.id"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
            :class="selectedCategoryIds.includes(category.id) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
          >
            <input
              v-model="selectedCategoryIds"
              type="checkbox"
              :value="category.id"
              class="sr-only"
            />
            <span>{{ category.name }}</span>
          </label>
        </div>
        <div class="flex gap-2">
          <input
            v-model="newCategoryName"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Nova categoria"
          />
          <button type="button" class="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800" @click="addCategory">
            +
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">Tags</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <label
            v-for="tag in tags"
            :key="tag.id"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
            :class="selectedTagIds.includes(tag.id) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
          >
            <input
              v-model="selectedTagIds"
              type="checkbox"
              :value="tag.id"
              class="sr-only"
            />
            <span>{{ tag.name }}</span>
          </label>
        </div>
        <div class="flex gap-2">
          <input
            v-model="newTagName"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Nova tag"
          />
          <button type="button" class="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800" @click="addTag">
            +
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <label class="block text-sm font-medium text-zinc-300">Conteúdo em Markdown</label>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
          @click="syncHtmlFromMarkdown"
        >
          Gerar HTML do Markdown
        </button>
      </div>
      <textarea
        v-model="form.content_markdown"
        rows="12"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-sm"
        placeholder="# Título do artigo\n\nEscreva o conteúdo em markdown..."
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-zinc-300">Conteúdo HTML (render final)</label>
      <AdminRichTextEditor v-model="form.content_html" />
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400 grid grid-cols-1 md:grid-cols-3 gap-3">
      <p>Slug: <span class="text-zinc-200">/{{ form.slug || 'sem-slug' }}</span></p>
      <p>SEO title: <span :class="seoTitleLength > 60 ? 'text-red-300' : 'text-zinc-200'">{{ seoTitleLength }} chars</span></p>
      <p>SEO desc: <span :class="seoDescriptionLength > 160 ? 'text-red-300' : 'text-zinc-200'">{{ seoDescriptionLength }} chars</span></p>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="saving"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 disabled:opacity-50"
      >
        {{ saving ? 'Salvando...' : (postId ? 'Atualizar post' : 'Criar post') }}
      </button>
      <NuxtLink
        to="/admin/blog"
        class="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800"
      >
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlogPosts'
import {
  createBlogPost,
  markdownToHtml,
  normalizeBlogSlug,
  uploadBlogCoverImage,
  updateBlogPost,
} from '~/composables/useBlogPosts'
import {
  createBlogCategory,
  createBlogTag,
  fetchBlogCategories,
  fetchBlogTags,
  type BlogCategory,
  type BlogTag,
} from '~/composables/useBlogTaxonomy'

const props = defineProps<{
  postId?: number
  initial?: BlogPost | null
  initialCategoryIds?: number[]
  initialTagIds?: number[]
}>()

const emit = defineEmits<{
  success: []
}>()

const categories = ref<BlogCategory[]>([])
const tags = ref<BlogTag[]>([])
const selectedCategoryIds = ref<number[]>([])
const selectedTagIds = ref<number[]>([])
const saving = ref(false)
const uploadingCover = ref(false)
const newCategoryName = ref('')
const newTagName = ref('')
const slugTouched = ref(false)
const coverFileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content_markdown: '',
  content_html: '<p></p>',
  status: 'draft' as 'draft' | 'scheduled' | 'published',
  published_at: '',
  scheduled_at: '',
  author_name: 'Vale Apps',
  cover_image: '',
  cover_alt: '',
  canonical_url: '',
  seo_title: '',
  seo_description: '',
  focus_keyword: '',
  og_image: '',
  noindex: false,
})

const seoTitleLength = computed(() => (form.seo_title || '').trim().length)
const seoDescriptionLength = computed(() => (form.seo_description || '').trim().length)

function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDateTimeLocal(value: string): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

function hydrateFromInitial(initial?: BlogPost | null) {
  form.slug = initial?.slug ?? ''
  form.title = initial?.title ?? ''
  form.excerpt = initial?.excerpt ?? ''
  form.content_markdown = initial?.content_markdown ?? ''
  form.content_html = initial?.content_html ?? '<p></p>'
  form.status = initial?.status ?? 'draft'
  form.published_at = toDateTimeLocal(initial?.published_at)
  form.scheduled_at = toDateTimeLocal(initial?.scheduled_at)
  form.author_name = initial?.author_name ?? 'Vale Apps'
  form.cover_image = initial?.cover_image ?? ''
  form.cover_alt = initial?.cover_alt ?? ''
  form.canonical_url = initial?.canonical_url ?? ''
  form.seo_title = initial?.seo_title ?? ''
  form.seo_description = initial?.seo_description ?? ''
  form.focus_keyword = initial?.focus_keyword ?? ''
  form.og_image = initial?.og_image ?? ''
  form.noindex = initial?.noindex ?? false

  selectedCategoryIds.value = props.initialCategoryIds ?? []
  selectedTagIds.value = props.initialTagIds ?? []
}

watch(
  () => props.initial,
  (next) => {
    hydrateFromInitial(next)
  },
  { immediate: true }
)

watch(
  () => form.title,
  (value) => {
    if (slugTouched.value) return
    form.slug = normalizeBlogSlug(value || '')
  }
)

watch(
  () => form.slug,
  () => {
    if (form.slug) slugTouched.value = true
  }
)

onMounted(async () => {
  const [loadedCategories, loadedTags] = await Promise.all([
    fetchBlogCategories(),
    fetchBlogTags(),
  ])
  categories.value = loadedCategories
  tags.value = loadedTags
})

function openCoverFilePicker() {
  coverFileInput.value?.click()
}

async function onCoverFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingCover.value = true

  try {
    const { data, error } = await uploadBlogCoverImage(file, {
      slug: form.slug || form.title,
    })

    if (error || !data) {
      alert(error || 'Erro ao fazer upload da imagem')
      return
    }

    form.cover_image = data.url

    if (!form.cover_alt?.trim() && form.title?.trim()) {
      form.cover_alt = `Capa do artigo ${form.title.trim()}`
    }
  }
  finally {
    uploadingCover.value = false
    input.value = ''
  }
}

async function syncHtmlFromMarkdown() {
  form.content_html = await markdownToHtml(form.content_markdown || '')
}

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  const { data, error } = await createBlogCategory({ name: newCategoryName.value })
  if (error || !data) {
    alert(error || 'Erro ao criar categoria')
    return
  }
  categories.value.push(data)
  categories.value.sort((a, b) => a.name.localeCompare(b.name))
  selectedCategoryIds.value = Array.from(new Set([...selectedCategoryIds.value, data.id]))
  newCategoryName.value = ''
}

async function addTag() {
  if (!newTagName.value.trim()) return
  const { data, error } = await createBlogTag({ name: newTagName.value })
  if (error || !data) {
    alert(error || 'Erro ao criar tag')
    return
  }
  tags.value.push(data)
  tags.value.sort((a, b) => a.name.localeCompare(b.name))
  selectedTagIds.value = Array.from(new Set([...selectedTagIds.value, data.id]))
  newTagName.value = ''
}

async function onSubmit() {
  if (!form.title.trim()) {
    alert('Título é obrigatório')
    return
  }

  if (!form.slug.trim()) {
    alert('Slug é obrigatório')
    return
  }

  if (!form.excerpt.trim()) {
    alert('Resumo é obrigatório')
    return
  }

  if (form.status === 'scheduled' && !form.scheduled_at) {
    alert('Defina a data de agendamento para posts agendados')
    return
  }

  if (!form.content_html?.trim() && form.content_markdown?.trim()) {
    await syncHtmlFromMarkdown()
  }

  if (!form.content_html?.trim()) {
    alert('Conteúdo do post é obrigatório')
    return
  }

  saving.value = true

  try {
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content_markdown: form.content_markdown || null,
      content_html: form.content_html,
      status: form.status,
      published_at: fromDateTimeLocal(form.published_at),
      scheduled_at: fromDateTimeLocal(form.scheduled_at),
      author_name: form.author_name,
      cover_image: form.cover_image || null,
      cover_alt: form.cover_alt || null,
      canonical_url: form.canonical_url || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      focus_keyword: form.focus_keyword || null,
      og_image: form.og_image || null,
      noindex: form.noindex,
    }

    if (props.postId) {
      const { error } = await updateBlogPost(props.postId, payload, {
        categoryIds: selectedCategoryIds.value,
        tagIds: selectedTagIds.value,
      })
      if (error) {
        alert('Erro ao atualizar: ' + error)
        return
      }
    }
    else {
      const { error } = await createBlogPost(payload, {
        categoryIds: selectedCategoryIds.value,
        tagIds: selectedTagIds.value,
      })
      if (error) {
        alert('Erro ao criar: ' + error)
        return
      }
    }

    emit('success')
  }
  finally {
    saving.value = false
  }
}
</script>
