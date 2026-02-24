<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Nome do projeto</label>
        <input
          v-model="form.nome_proejeto"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-brand/50"
          placeholder="Ex: App de delivery"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Tipo de projeto</label>
        <select
          v-model="form.tipo_projeto"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-brand/50"
        >
          <option value="">Selecione</option>
          <option v-for="t in tiposProjeto" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-zinc-300 mb-2">Cliente</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-zinc-500 mb-1">Nome</label>
          <input
            v-model="form.nome_cliente"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
        <div>
          <label class="block text-xs text-zinc-500 mb-1">E-mail</label>
          <input
            v-model="form.email_cliente"
            type="email"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
        <div>
          <label class="block text-xs text-zinc-500 mb-1">Telefone</label>
          <input
            v-model="form.telefone_cliente"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Valor bruto (R$)</label>
        <input
          v-model.number="form.valor_bruto"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Valor final (R$)</label>
        <input
          v-model.number="form.valor_final"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Prazo (dias)</label>
        <input
          v-model.number="form.prazo_dias"
          type="number"
          min="0"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Dias corridos ou úteis?</label>
      <select
        v-model="form.dias_corridos_ou_ulteis"
        class="w-full md:w-48 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
      >
        <option value="">Selecione</option>
        <option value="corridos">Corridos</option>
        <option value="uteis">Úteis</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Tipos de serviço</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="s in tiposServico"
          :key="s"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
          :class="form.tipos_servicos_enuns?.includes(s) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
        >
          <input
            v-model="form.tipos_servicos_enuns"
            type="checkbox"
            :value="s"
            class="sr-only"
          />
          <span>{{ s }}</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-2">Entregas</label>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="e in entregas"
          :key="e"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors"
          :class="form.entregas?.includes(e) ? 'bg-brand/20 border-brand/50 text-brand' : 'bg-zinc-900 border-zinc-700 text-zinc-400'"
        >
          <input
            v-model="form.entregas"
            type="checkbox"
            :value="e"
            class="sr-only"
          />
          <span>{{ e }}</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Mais informações</label>
      <textarea
        v-model="form.mais_info"
        rows="4"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500"
        placeholder="Detalhes adicionais da proposta..."
      />
    </div>

    <div v-if="!propostaId">
      <label class="block text-sm font-medium text-zinc-300 mb-1">Slug (opcional – usado no link para o cliente)</label>
      <input
        v-model="form.slug"
        type="text"
        class="w-full md:w-96 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        placeholder="Deixe em branco para gerar automaticamente"
      />
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="saving"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 disabled:opacity-50"
      >
        {{ saving ? 'Salvando...' : (propostaId ? 'Atualizar' : 'Criar proposta') }}
      </button>
      <NuxtLink
        to="/admin/propostas"
        class="px-4 py-2 rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800"
      >
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { PropostaRow, TipoProjeto, TipoServico, Entrega } from '~/composables/usePropostas'

const tiposProjeto: TipoProjeto[] = [
  'Web APP',
  'Web Responsivo',
  'Mobile APP',
  'Automação',
  'Gerenciamento',
  'Manutenção'
]

const tiposServico: TipoServico[] = [
  'Planejamento e Conceito',
  'Design',
  'UI/UX Design',
  'Design responsivo',
  'Wireframes e protótipos interativos',
  'Desenvolvimento',
  'Frontend',
  'Backend',
  'Infraestrutura',
  'Segurança',
  'Testes',
  'Publicação',
  'Manutenção',
  'Marketing e Lançamento',
  'Criptografia de dados sensíveis',
  'Certificados SSL para segurança de navegação.',
  'Pagamentos e Assinaturas',
  'Integração com sistemas de pagamento',
  'Configuração de planos de assinatura',
  'Gestão de cobranças recorrentes e faturas.',
  'Publicação e Implantação',
  'Analytics e Feedback',
  'Integrações',
  'Ferramentas externas',
  'Integração com serviços em nuvem'
]

const entregas: Entrega[] = [
  'Produto Funcional',
  'Web App',
  'App Mobile',
  'SaaS',
  'Documentação',
  'Manual do Usuário',
  'Documentação Técnica',
  'Código-Fonte',
  'Design',
  'Arquivos finais do design',
  'Infraestrutura Configurada',
  'Servidor configurado',
  'Banco de dados implementado',
  'Funcionalidades Desenvolvidas',
  'Funcionalidades do MVP implementadas e testadas',
  'Integrações externas funcionando',
  'Web App Link de produção com domínio configurado.',
  'SaaS Site e plataforma acessíveis via domínio personalizado.',
  'Apoio Pós-Lançamento',
  'Suporte técnico para ajustes iniciais.',
  'Cronograma de manutenção'
]

const props = defineProps<{
  propostaId?: number
  initial?: Partial<PropostaRow>
}>()

const emit = defineEmits<{
  success: [proposta: PropostaRow]
  cancel: []
}>()

const { createProposta, updateProposta } = await import('~/composables/usePropostas')

const form = reactive({
  nome_proejeto: props.initial?.nome_proejeto ?? '',
  tipo_projeto: (props.initial?.tipo_projeto as TipoProjeto | '') ?? '',
  nome_cliente: props.initial?.nome_cliente ?? '',
  email_cliente: props.initial?.email_cliente ?? '',
  telefone_cliente: props.initial?.telefone_cliente ?? '',
  valor_bruto: props.initial?.valor_bruto ?? undefined,
  valor_final: props.initial?.valor_final ?? undefined,
  prazo_dias: props.initial?.prazo_dias ?? undefined,
  dias_corridos_ou_ulteis: props.initial?.dias_corridos_ou_ulteis ?? '',
  tipos_servicos_enuns: (props.initial?.tipos_servicos_enuns ?? []) as TipoServico[],
  entregas: (props.initial?.entregas ?? []) as Entrega[],
  mais_info: props.initial?.mais_info ?? '',
  slug: props.initial?.slug ?? ''
})

const saving = ref(false)

async function onSubmit() {
  saving.value = true
  try {
    if (props.propostaId) {
      const { error } = await updateProposta(props.propostaId, {
        nome_proejeto: form.nome_proejeto || null,
        tipo_projeto: form.tipo_projeto || null,
        nome_cliente: form.nome_cliente || null,
        email_cliente: form.email_cliente || null,
        telefone_cliente: form.telefone_cliente || null,
        valor_bruto: form.valor_bruto ?? null,
        valor_final: form.valor_final ?? null,
        prazo_dias: form.prazo_dias ?? null,
        dias_corridos_ou_ulteis: form.dias_corridos_ou_ulteis || null,
        tipos_servicos_enuns: form.tipos_servicos_enuns.length ? form.tipos_servicos_enuns : null,
        entregas: form.entregas.length ? form.entregas : null,
        mais_info: form.mais_info || null,
        slug: form.slug?.trim() || null
      })
      if (error) {
        alert('Erro ao atualizar: ' + error)
        return
      }
      emit('success', { ...form, id: props.propostaId } as PropostaRow)
    } else {
      const { data, error } = await createProposta({
        nome_proejeto: form.nome_proejeto || null,
        tipo_projeto: form.tipo_projeto || null,
        nome_cliente: form.nome_cliente || null,
        email_cliente: form.email_cliente || null,
        telefone_cliente: form.telefone_cliente || null,
        valor_bruto: form.valor_bruto ?? null,
        valor_final: form.valor_final ?? null,
        prazo_dias: form.prazo_dias ?? null,
        dias_corridos_ou_ulteis: form.dias_corridos_ou_ulteis || null,
        tipos_servicos_enuns: form.tipos_servicos_enuns.length ? form.tipos_servicos_enuns : null,
        entregas: form.entregas.length ? form.entregas : null,
        mais_info: form.mais_info || null,
        slug: form.slug?.trim() || null
      })
      if (error) {
        alert('Erro ao criar: ' + error)
        return
      }
      if (data) emit('success', data)
    }
  } finally {
    saving.value = false
  }
}
</script>
