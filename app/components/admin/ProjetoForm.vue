<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input
          v-model="form.titulo"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-brand/50"
          placeholder="Nome do projeto"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Slug (URL)</label>
        <input
          v-model="form.slug"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
          placeholder="ex: meu-projeto"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
      <textarea
        v-model="form.descricao"
        rows="3"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
        placeholder="Breve descrição do projeto"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Imagem de capa (URL)</label>
      <input
        v-model="form.capa"
        type="url"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        placeholder="https://..."
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Link Web</label>
        <input
          v-model="form.link_web"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="https://..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Link Google Play</label>
        <input
          v-model="form.link_google"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Link App Store</label>
        <input
          v-model="form.link_apple"
          type="url"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Ranking (ordem de exibição)</label>
        <input
          v-model.number="form.ranking"
          type="number"
          min="0"
          class="w-full md:w-32 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
      <div class="flex items-end gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="form.mobile" type="checkbox" class="rounded border-zinc-600 bg-zinc-900 text-brand" />
          <span class="text-sm text-zinc-300">Projeto mobile</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="form.valeapps" type="checkbox" class="rounded border-zinc-600 bg-zinc-900 text-brand" />
          <span class="text-sm text-zinc-300">Exibir no site Vale Apps</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Categorias</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="c in categorias"
          :key="c.id"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
          :class="form.categoria_projeto?.includes(c.id) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
        >
          <input
            v-model="form.categoria_projeto"
            type="checkbox"
            :value="c.id"
            class="sr-only"
          />
          <span>{{ c.nome || 'Sem nome' }}</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Ferramentas</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="f in ferramentas"
          :key="f.id"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
          :class="form.ferramentas?.includes(f.id) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
        >
          <input
            v-model="form.ferramentas"
            type="checkbox"
            :value="f.id"
            class="sr-only"
          />
          <span>{{ f.nome || 'Sem nome' }}</span>
        </label>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="saving"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 disabled:opacity-50"
      >
        {{ saving ? 'Salvando...' : (projetoId ? 'Atualizar' : 'Criar projeto') }}
      </button>
      <NuxtLink
        to="/admin/portifolio"
        class="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800"
      >
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ProjetoAdmin, CategoriaRow, FerramentaRow } from '~/composables/useProjetosAdmin'
import {
  fetchCategorias,
  fetchFerramentas,
  fetchProjetoById,
  createProjeto,
  updateProjeto
} from '~/composables/useProjetosAdmin'

const props = defineProps<{
  projetoId?: number
  initial?: Partial<ProjetoAdmin> | null
}>()

const emit = defineEmits<{
  success: []
}>()

const categorias = ref<CategoriaRow[]>([])
const ferramentas = ref<FerramentaRow[]>([])
const saving = ref(false)

const form = reactive({
  titulo: props.initial?.titulo ?? '',
  descricao: props.initial?.descricao ?? '',
  slug: props.initial?.slug ?? '',
  capa: props.initial?.capa ?? '',
  link_web: props.initial?.link_web ?? '',
  link_google: props.initial?.link_google ?? '',
  link_apple: props.initial?.link_apple ?? '',
  ranking: props.initial?.ranking ?? 0,
  mobile: props.initial?.mobile ?? false,
  valeapps: props.initial?.valeapps ?? false,
  categoria_projeto: (props.initial?.categoria_projeto ?? []) as number[],
  ferramentas: (props.initial?.ferramentas ?? []) as number[]
})

onMounted(async () => {
  categorias.value = await fetchCategorias()
  ferramentas.value = await fetchFerramentas()
})

watch(
  () => props.initial,
  (next) => {
    if (!next) return
    form.titulo = next.titulo ?? ''
    form.descricao = next.descricao ?? ''
    form.slug = next.slug ?? ''
    form.capa = next.capa ?? ''
    form.link_web = next.link_web ?? ''
    form.link_google = next.link_google ?? ''
    form.link_apple = next.link_apple ?? ''
    form.ranking = next.ranking ?? 0
    form.mobile = next.mobile ?? false
    form.valeapps = next.valeapps ?? false
    form.categoria_projeto = next.categoria_projeto ?? []
    form.ferramentas = next.ferramentas ?? []
  },
  { immediate: true }
)

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      titulo: form.titulo?.trim() || null,
      descricao: form.descricao?.trim() || null,
      slug: form.slug?.trim() || null,
      capa: form.capa?.trim() || null,
      link_web: form.link_web?.trim() || null,
      link_google: form.link_google?.trim() || null,
      link_apple: form.link_apple?.trim() || null,
      ranking: form.ranking ?? null,
      mobile: form.mobile ?? false,
      valeapps: form.valeapps ?? false,
      categoria_projeto: form.categoria_projeto.length ? form.categoria_projeto : null,
      ferramentas: form.ferramentas.length ? form.ferramentas : null
    }
    if (props.projetoId) {
      const { error } = await updateProjeto(props.projetoId, payload)
      if (error) {
        alert('Erro ao atualizar: ' + error)
        return
      }
    } else {
      const { data, error } = await createProjeto(payload)
      if (error) {
        alert('Erro ao criar: ' + error)
        return
      }
      if (!data) return
    }
    emit('success')
  } finally {
    saving.value = false
  }
}
</script>
