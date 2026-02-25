<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Portfólio</h1>
        <p class="text-zinc-400">Gerencie os projetos publicados no site e os destaques da Vale Apps.</p>
      </div>
      <NuxtLink
        to="/admin/portifolio/nova"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity"
      >
        <span>+ Novo projeto</span>
      </NuxtLink>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Total de projetos</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metricas.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Vale Apps</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ metricas.valeApps }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Outros projetos</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metricas.outros }}</p>
      </article>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar por título ou slug"
        class="md:col-span-3 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      >
      <select
        v-model="filtroTipo"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="todos">Todos os tipos</option>
        <option value="valeapps">Somente Vale Apps</option>
        <option value="outros">Somente outros</option>
      </select>
    </section>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando projetos...
    </div>
    <div v-else-if="error" class="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
      {{ error }}
    </div>
    <div v-else class="space-y-3">
      <article
        v-for="p in projetosFiltrados"
        :key="p.id"
        class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
      >
        <div class="min-w-0">
          <p class="font-medium text-zinc-100 truncate">{{ p.titulo || 'Sem título' }}</p>
          <p class="text-zinc-500 text-sm truncate">/{{ p.slug || 'sem-slug' }}</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
            Ranking: {{ p.ranking ?? '-' }}
          </span>
          <span
            class="text-xs px-2 py-1 rounded-md"
            :class="p.valeapps ? 'bg-brand/20 text-brand' : 'bg-zinc-700 text-zinc-300'"
          >
            {{ p.valeapps ? 'Vale Apps' : 'Outro' }}
          </span>
          <NuxtLink
            :to="`/admin/portifolio/editar/${p.id}`"
            class="text-sm px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
          >
            Editar
          </NuxtLink>
        </div>
      </article>

      <div v-if="!projetosFiltrados.length" class="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
        <p class="text-zinc-400">Nenhum projeto encontrado com os filtros atuais.</p>
        <NuxtLink to="/admin/portifolio/nova" class="inline-block mt-3 text-brand hover:underline">Criar projeto</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabase()
const { data: projetos, pending, error } = await useAsyncData(
  'admin-projetos',
  async () => {
    if (!supabase) return []
    const { data, error: e } = await supabase
      .from('projetos')
      .select('id, titulo, slug, valeapps, ranking')
      .order('ranking', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true })
    if (e) throw new Error(e.message)
    return data ?? []
  }
)

const filtroBusca = ref('')
const filtroTipo = ref<'todos' | 'valeapps' | 'outros'>('todos')

const projetosFiltrados = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  return (projetos.value ?? []).filter((projeto) => {
    if (filtroTipo.value === 'valeapps' && !projeto.valeapps) return false
    if (filtroTipo.value === 'outros' && projeto.valeapps) return false

    if (!termo) return true
    const titulo = String(projeto.titulo ?? '').toLowerCase()
    const slug = String(projeto.slug ?? '').toLowerCase()
    return titulo.includes(termo) || slug.includes(termo)
  })
})

const metricas = computed(() => {
  const total = (projetos.value ?? []).length
  const valeApps = (projetos.value ?? []).filter(item => item.valeapps).length
  return {
    total,
    valeApps,
    outros: total - valeApps,
  }
})
</script>
