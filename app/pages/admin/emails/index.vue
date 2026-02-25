<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-zinc-100">Templates de Email</h1>
        <p class="text-sm text-zinc-500 mt-1">Gerencie templates, status e tipos de comunicação do CRM.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          to="/admin/emails/new#envio-teste"
          class="px-4 py-2 border border-zinc-700 text-zinc-100 rounded-lg hover:border-zinc-500 transition-colors text-sm font-medium"
        >
          Enviar E-mail
        </NuxtLink>
        <NuxtLink
          to="/admin/emails/new"
          class="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors text-sm font-medium"
        >
          + Novo Template
        </NuxtLink>
      </div>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Total de templates</p>
        <p class="text-2xl font-semibold text-zinc-100 mt-1">{{ metricas.total }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Templates ativos</p>
        <p class="text-2xl font-semibold text-emerald-300 mt-1">{{ metricas.ativos }}</p>
      </article>
      <article class="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
        <p class="text-xs text-zinc-500">Tipos cadastrados</p>
        <p class="text-2xl font-semibold text-brand mt-1">{{ metricas.tipos }}</p>
      </article>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        v-model="filtroBusca"
        type="text"
        placeholder="Buscar por nome, slug ou assunto"
        class="md:col-span-2 w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
      >
      <select
        v-model="filtroTipo"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="">Todos os tipos</option>
        <option v-for="tipo in tiposDisponiveis" :key="tipo" :value="tipo">{{ tipo }}</option>
      </select>
      <select
        v-model="filtroAtivo"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="todos">Todos os status</option>
        <option value="ativos">Somente ativos</option>
        <option value="inativos">Somente inativos</option>
      </select>
    </section>

    <div v-if="pending" class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-500">
      Carregando templates...
    </div>

    <div v-else-if="error" class="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-200 text-sm">
      Erro ao carregar templates: {{ error }}
    </div>

    <div
      v-else-if="!templatesFiltrados.length"
      class="rounded-lg border border-dashed border-zinc-700 p-8 text-center"
    >
      <PhEnvelopeSimple class="w-12 h-12 text-zinc-600 mx-auto mb-3 opacity-50" />
      <p class="text-zinc-400 text-sm">Nenhum template encontrado para os filtros atuais</p>
      <NuxtLink
        to="/admin/emails/new"
        class="inline-block mt-3 text-sm text-brand hover:underline"
      >
        Criar novo template →
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="template in templatesFiltrados"
        :key="template.id"
        class="rounded-lg border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors overflow-hidden group"
      >
        <div class="flex items-start justify-between p-4 border-b border-zinc-800/50">
          <div class="flex-1">
            <h3 class="font-medium text-zinc-100">{{ template.nome }}</h3>
            <p class="text-xs text-zinc-500 mt-1">{{ template.slug }}</p>
          </div>
          <span
            class="px-2 py-1 rounded text-xs font-medium"
            :class="getBadgeClass(template.tipo)"
          >
            {{ template.tipo }}
          </span>
        </div>

        <div class="p-4 space-y-3">
          <div>
            <p class="text-xs text-zinc-500 mb-1">Assunto</p>
            <p class="text-sm text-zinc-300 line-clamp-2">{{ template.assunto }}</p>
          </div>

          <div v-if="template.variaveis_suportadas && template.variaveis_suportadas.length > 0">
            <p class="text-xs text-zinc-500 mb-1">Variáveis</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="v in template.variaveis_suportadas"
                :key="v"
                class="px-2 py-0.5 rounded bg-brand/10 text-brand text-xs"
              >
                {{ v }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 pt-2">
            <p class="text-xs text-zinc-500">Criado em {{ formatarData(template.criado_em) }}</p>
            <div
              class="w-2 h-2 rounded-full transition-colors"
              :class="template.ativo ? 'bg-green-500' : 'bg-zinc-600'"
            ></div>
            <span class="text-xs text-zinc-500">
              {{ template.ativo ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
        </div>

        <div class="border-t border-zinc-800/50 bg-zinc-900/30 px-4 py-3 flex gap-2">
          <NuxtLink
            :to="`/admin/emails/${template.id}`"
            class="flex-1 py-1.5 px-3 bg-brand/20 text-brand hover:bg-brand/30 rounded text-xs font-medium transition-colors text-center"
          >
            Editar
          </NuxtLink>
          <NuxtLink
            :to="`/admin/emails/${template.id}/preview`"
            class="flex-1 py-1.5 px-3 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded text-xs font-medium transition-colors text-center"
          >
            Visualizar
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhEnvelopeSimple } from '@phosphor-icons/vue'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Email Templates - Vale Apps Admin',
})

interface EmailTemplate {
  id: string
  nome: string
  slug: string
  tipo: 'sistema' | 'marketing' | 'notificacao'
  assunto: string
  variaveis_suportadas?: string[]
  ativo: boolean
  criado_em: string
}

const supabase = useSupabase()

const { data: templates, pending, error } = useAsyncData(
  'email-templates',
  async () => {
    if (!supabase) return []
    const { data, error: err } = await supabase
      .from('email_templates')
      .select('*')
      .order('criado_em', { ascending: false })
    if (err) {
      console.error('Erro ao buscar templates:', err)
      throw err
    }
    return (data || []) as EmailTemplate[]
  }
)

const filtroBusca = ref('')
const filtroTipo = ref<EmailTemplate['tipo'] | ''>('')
const filtroAtivo = ref<'todos' | 'ativos' | 'inativos'>('todos')

const tiposDisponiveis = computed(() => {
  return Array.from(new Set((templates.value ?? []).map(item => item.tipo)))
})

const templatesFiltrados = computed(() => {
  const termo = filtroBusca.value.trim().toLowerCase()

  return (templates.value ?? []).filter((template) => {
    if (filtroTipo.value && template.tipo !== filtroTipo.value) return false
    if (filtroAtivo.value === 'ativos' && !template.ativo) return false
    if (filtroAtivo.value === 'inativos' && template.ativo) return false

    if (!termo) return true
    const alvo = `${template.nome} ${template.slug} ${template.assunto}`.toLowerCase()
    return alvo.includes(termo)
  })
})

const metricas = computed(() => {
  const lista = templates.value ?? []
  return {
    total: lista.length,
    ativos: lista.filter(item => item.ativo).length,
    tipos: new Set(lista.map(item => item.tipo)).size,
  }
})

function formatarData(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(valor))
}

function getBadgeClass(tipo: string) {
  const classes: Record<string, string> = {
    sistema: 'bg-blue-500/20 text-blue-200',
    marketing: 'bg-purple-500/20 text-purple-200',
    notificacao: 'bg-orange-500/20 text-orange-200'
  }
  return classes[tipo] || 'bg-zinc-700/50 text-zinc-300'
}
</script>
