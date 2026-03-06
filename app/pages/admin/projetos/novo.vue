<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-100">Novo Projeto</h1>
        <p class="text-zinc-400 text-sm mt-1">Crie um novo workspace vinculando clientes, contratos ou propostas.</p>
      </div>
      <NuxtLink to="/admin/projetos" class="text-sm text-zinc-400 hover:text-zinc-200">Cancelar</NuxtLink>
    </div>

    <form @submit.prevent="salvar" class="space-y-6">
      <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1.5">Nome do Projeto *</label>
          <input v-model="form.nome" type="text" required class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand" placeholder="Ex: App de Logística">
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1.5">Slug (URL) *</label>
          <input v-model="form.slug" type="text" required class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand" placeholder="app-logistica">
          <p class="text-xs text-zinc-500 mt-1">Identificador único</p>
        </div>

        <ClientOnly>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">Cliente (CRM)</label>
              <select v-model="form.cliente_id" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
                <option :value="null">Nenhum</option>
                <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">Contrato</label>
              <select v-model="form.contrato_id" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
                <option :value="null">Nenhum</option>
                <option v-for="c in contratos" :key="c.id" :value="c.id">{{ c.titulo || ('Contrato #' + c.id) }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">Proposta</label>
              <select v-model="form.proposta_id" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
                <option :value="null">Nenhuma</option>
                <option v-for="p in propostas" :key="p.id" :value="p.id">{{ p.nome_proejeto || ('Proposta #' + p.id) }}</option>
              </select>
            </div>
          </div>
          <template #fallback>
            <div class="p-4 text-center text-sm text-zinc-500">Carregando referências...</div>
          </template>
        </ClientOnly>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">Data Início</label>
            <input v-model="form.data_inicio" type="date" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">Previsão de Entrega</label>
            <input v-model="form.data_fim_prevista" type="date" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">Prioridade</label>
            <select v-model="form.prioridade" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">Horas Vendidas</label>
            <input
              v-model="form.horas_previstas"
              type="number"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand"
              placeholder="Ex: 120"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1.5">Orçamento Estimado (R$)</label>
            <input v-model="form.orcamento_total" type="number" step="0.01" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand">
          </div>
        </div>
      </div>

      <div v-if="erro" class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {{ erro }}
      </div>

      <div class="flex justify-end gap-3">
        <NuxtLink to="/admin/projetos" class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">Cancelar</NuxtLink>
        <button type="submit" :disabled="salvando" class="px-6 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
          {{ salvando ? 'Salvando...' : 'Criar Projeto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createProjetoWorkspace } from '~/composables/useProjetosWorkspace'

definePageMeta({ layout: 'admin' })

const client = useSupabase()
const salvando = ref(false)
const erro = ref('')

const clientes = ref<{id: number, nome: string}[]>([])
const contratos = ref<{id: number, titulo: string}[]>([])
const propostas = ref<{id: number, nome_proejeto: string}[]>([])

onMounted(async () => {
  if (!client) return
  const [{ data: cData }, { data: contData }, { data: pData }] = await Promise.all([
    client.from('crm_clientes').select('id, nome').order('nome'),
    client.from('contratos').select('id, titulo').order('id', { ascending: false }),
    client.from('proposta').select('id, nome_proejeto').order('id', { ascending: false })
  ])
  if (cData) clientes.value = cData
  if (contData) contratos.value = contData
  if (pData) propostas.value = pData
})

const form = reactive({
  nome: '',
  slug: '',
  cliente_id: null as number | null,
  contrato_id: null as number | null,
  proposta_id: null as number | null,
  status: 'iniciando' as const,
  data_inicio: '',
  data_fim_prevista: '',
  prioridade: 'media' as const,
  horas_previstas: 0,
  orcamento_total: 0,
})

watch(() => form.nome, (val) => {
  if (!form.slug || form.slug === gerarSlug(val.slice(0, -1))) {
    form.slug = gerarSlug(val)
  }
})

function gerarSlug(str: string) {
  if (!str) return ''
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

async function salvar() {
  if (!form.nome || !form.slug) return
  salvando.value = true
  erro.value = ''

  let cliente_nome_resolvido = null
  if (form.cliente_id && clientes.value.length > 0) {
    const selectedClient = clientes.value.find(c => c.id === form.cliente_id)
    if (selectedClient) {
      cliente_nome_resolvido = selectedClient.nome
    }
  }

  const payload = {
    nome: form.nome,
    slug: form.slug,
    cliente_id: form.cliente_id,
    cliente_nome: cliente_nome_resolvido,
    contrato_id: form.contrato_id,
    proposta_id: form.proposta_id,
    status: form.status,
    data_inicio: form.data_inicio || null,
    data_fim_prevista: form.data_fim_prevista || null,
    prioridade: form.prioridade,
    horas_previstas: Number(form.horas_previstas) || 0,
    orcamento_total: Number(form.orcamento_total) || 0,
  }

  const { data, error } = await createProjetoWorkspace(payload)

  if (error) {
    erro.value = error
    salvando.value = false
  } else if (data) {
    await navigateTo(`/admin/projetos/${data.id || ''}`)
  }
}
</script>
