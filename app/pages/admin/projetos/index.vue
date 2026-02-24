<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100 mb-1">Projetos</h1>
        <p class="text-zinc-400">Projetos do portfólio (site e valeapps).</p>
      </div>
      <NuxtLink
        to="/admin/projetos/nova"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90"
      >
        <span>+ Novo projeto</span>
      </NuxtLink>
    </div>
    <div v-if="pending" class="text-zinc-500">Carregando...</div>
    <div v-else-if="error" class="text-red-400">{{ error }}</div>
    <div v-else class="space-y-3">
      <div
        v-for="p in projetos"
        :key="p.id"
        class="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50"
      >
        <div>
          <span class="font-medium text-zinc-200">{{ p.titulo || 'Sem título' }}</span>
          <span v-if="p.slug" class="text-zinc-500 text-sm ml-2">/ {{ p.slug }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="text-xs px-2 py-1 rounded"
            :class="p.valeapps ? 'bg-brand/20 text-brand' : 'bg-zinc-700 text-zinc-400'"
          >
            {{ p.valeapps ? 'Vale Apps' : 'Outro' }}
          </span>
          <NuxtLink
            :to="`/admin/projetos/editar/${p.id}`"
            class="text-sm text-zinc-400 hover:text-brand"
          >
            Editar
          </NuxtLink>
        </div>
      </div>
      <p v-if="projetos.length === 0" class="text-zinc-500">Nenhum projeto cadastrado. Crie o primeiro em Novo projeto.</p>
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
</script>
