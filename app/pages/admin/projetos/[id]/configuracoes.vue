<template>
  <div class="max-w-4xl mx-auto p-8 bg-zinc-900 border border-zinc-800 rounded-xl mt-6">
    <h2 class="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
      <Icon name="ph:gear-six-duotone" class="w-6 h-6 text-brand" />
      Configurações do Projeto
    </h2>

    <form @submit.prevent="salvar" class="space-y-6">
      <div class="grid grid-cols-1 gap-6">
        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-300">Nome do Projeto</span>
          <input
            v-model="form.nome"
            required
            type="text"
            class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            placeholder="Nome do projeto"
          />
        </label>
      </div>

      <ClientOnly>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label class="block space-y-2">
            <span class="text-sm font-medium text-zinc-300">Cliente (CRM)</span>
            <select
              v-model="form.cliente_id"
              class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand appearance-none cursor-pointer"
            >
              <option :value="null">Nenhum</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }}</option>
            </select>
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-medium text-zinc-300">Contrato Base</span>
            <select
              v-model="form.contrato_id"
              class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand appearance-none cursor-pointer"
            >
              <option :value="null">Nenhum</option>
              <option v-for="c in contratos" :key="c.id" :value="c.id">{{ c.titulo || 'Contrato #' + c.id }}</option>
            </select>
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-medium text-zinc-300">Proposta Base</span>
            <select
              v-model="form.proposta_id"
              class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand appearance-none cursor-pointer"
            >
              <option :value="null">Nenhuma</option>
              <option v-for="p in propostas" :key="p.id" :value="p.id">{{ p.nome_proejeto || 'Proposta #' + p.id }}</option>
            </select>
          </label>
        </div>
        <template #fallback>
          <div class="p-4 text-center text-sm text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            Carregando referências do CRM...
          </div>
        </template>
      </ClientOnly>

      <div class="grid grid-cols-2 gap-6">
        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-300">Status Oculto/Público (Portfolio)</span>
          <select
            v-model="form.status_visualizacao"
            class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand appearance-none cursor-pointer"
          >
            <option value="interno">Apenas Interno (Admin)</option>
            <option value="cliente">Visível para o Cliente</option>
            <option value="portfolio">Público (Portfólio)</option>
          </select>
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-zinc-300">Tecnologias Envolvidas (separadas por vírgula)</span>
          <input
            v-model="form.tech_stack"
            type="text"
            class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            placeholder="Ex: Vue, Nuxt, Supabase"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article class="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Horas contratadas</p>
          <strong class="mt-2 block text-xl font-semibold text-zinc-100">{{ formatHoras(props.projeto.horas_previstas) }}</strong>
        </article>

        <article class="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Valor médio da hora</p>
          <strong class="mt-2 block text-xl font-semibold text-zinc-100">{{ formatMoeda(props.projeto.valor_hora_vendida) }}</strong>
        </article>

        <article class="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <p class="text-xs uppercase tracking-wider text-zinc-500">Valor total vendido</p>
          <strong class="mt-2 block text-xl font-semibold text-zinc-100">{{ formatMoeda(props.projeto.orcamento_total) }}</strong>
        </article>
      </div>

      <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
        Horas contratadas e valores por hora agora são controlados pelo histórico em <strong>Extrato de Horas</strong>. Use essa tela apenas para dados cadastrais do projeto.
      </div>

       <label class="block space-y-2">
        <span class="text-sm font-medium text-zinc-300">Descrição Comercial / Resumo</span>
        <textarea
          v-model="form.descricao_comercial"
          rows="4"
          class="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
          placeholder="Descrição breve para relatórios e portfólio"
        ></textarea>
      </label>

      <div class="flex items-center justify-between pt-6 border-t border-zinc-800">
        <button
          type="button"
          @click="excluirProjeto"
          class="px-4 py-2 font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Excluir Projeto Definitivamente
        </button>
        <button
          type="submit"
          :disabled="salvando"
          class="px-6 py-3 font-semibold text-zinc-950 bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {{ salvando ? 'Salvando...' : 'Salvar Configurações' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace' 
import { useSupabase } from '~/composables/useSupabase'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const emit = defineEmits<{
  (e: 'refresh'): void
}>()
const client = useSupabase()
const salvando = ref(false)

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

const form = ref({
  nome: props.projeto.nome,
  descricao_comercial: props.projeto.descricao_comercial,
  cliente_id: props.projeto.cliente_id as number | null,
  contrato_id: props.projeto.contrato_id as number | null,
  proposta_id: props.projeto.proposta_id as number | null,
  tech_stack: props.projeto.tech_stack?.join(', ') || '',
  status_visualizacao: props.projeto.status_visualizacao || 'interno'
})

async function salvar() {
  if (!client) return
  salvando.value = true

  const techs = form.value.tech_stack
    ? form.value.tech_stack.split(',').map(x => x.trim()).filter(Boolean)
    : []
  
  let cliente_nome_resolvido = null
  if (form.value.cliente_id && clientes.value.length > 0) {
    const selectedClient = clientes.value.find(c => c.id === form.value.cliente_id)
    if (selectedClient) {
      cliente_nome_resolvido = selectedClient.nome
    }
  }
  
  const payload: Record<string, unknown> = {
    nome: form.value.nome,
    cliente_nome: cliente_nome_resolvido || '',
    descricao_comercial: (form.value.descricao_comercial || '').trim(),
    cliente_id: form.value.cliente_id || null,
    contrato_id: form.value.contrato_id || null,
    proposta_id: form.value.proposta_id || null,
    tech_stack: techs,
    status_visualizacao: form.value.status_visualizacao || 'interno'
  }

  const { error } = await client
    .from('projetos_admin')
    .update(payload)
    .eq('id', props.projeto.id)

  salvando.value = false
  if (error) {
    console.error('[configuracoes-projeto] Erro ao salvar:', error)
    alert(`Erro ao salvar configurações: ${error.message}`)
  } else {
    emit('refresh')
    alert('Salvo com sucesso!')
  }
}

async function excluirProjeto() {
  if (!client) return
  if (!confirm('ATENÇÃO! Tem certeza absoluta que deseja apagar este projeto e todas as suas tarefas/documentações relacionadas?')) return
  const { error } = await client
    .from('projetos_admin')
    .delete()
    .eq('id', props.projeto.id)

  if (error) {
    alert('Erro ao apagar: ' + error.message)
    return
  }

  navigateTo('/admin/projetos')
}

function formatMoeda(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  }).format(Number(value || 0))
}

function formatHoras(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value || 0)) + 'h'
}
</script>
