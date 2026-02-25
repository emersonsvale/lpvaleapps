<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Modalidade da proposta</label>
      <select
        v-model="form.tipo_proposta"
        class="w-full md:w-80 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-brand/50"
      >
        <option value="empreitada">Escopo fechado / Empreitada</option>
        <option value="hora">Por hora (valor/hora + etapas)</option>
      </select>
    </div>

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

    <div v-if="!isHora" class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

    <div v-else class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Valor da hora (R$)</label>
          <input
            v-model.number="form.valor_hora"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Total de horas</label>
          <input
            :value="resumoHora.totalHoras"
            type="number"
            class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100"
            readonly
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Valor total (R$)</label>
          <input
            :value="resumoHora.totalValor"
            type="number"
            class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100"
            readonly
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

      <div class="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 text-sm text-zinc-300">
        <p class="font-medium text-zinc-200">Cálculo do investimento</p>
        <p class="mt-1">
          {{ resumoHora.totalHoras }}h × {{ formatarMoeda(form.valor_hora ?? 0) }} =
          <span class="font-semibold text-zinc-100">{{ formatarMoeda(resumoHora.totalValor) }}</span>
        </p>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <label class="block text-sm font-medium text-zinc-300">Etapas / Tarefas por hora</label>
          <button
            type="button"
            class="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            @click="adicionarEtapa"
          >
            + Adicionar etapa
          </button>
        </div>

        <div
          v-for="(item, index) in form.proposta_itens_hora"
          :key="`item-${index}`"
          class="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
        >
          <div class="md:col-span-4">
            <label class="block text-xs text-zinc-500 mb-1">Etapa</label>
            <input
              v-model="item.etapa"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
              placeholder="Ex: Design"
            />
          </div>
          <div class="md:col-span-4">
            <label class="block text-xs text-zinc-500 mb-1">Descrição (opcional)</label>
            <input
              v-model="item.descricao"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
              placeholder="Ex: telas principais"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-zinc-500 mb-1">Horas</label>
            <input
              v-model.number="item.horas"
              type="number"
              step="0.5"
              min="0"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            />
          </div>
          <div class="md:col-span-1">
            <label class="block text-xs text-zinc-500 mb-1">Subtotal</label>
            <input
              :value="(Number(item.horas || 0) * Number(form.valor_hora || 0)).toFixed(2)"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100"
              readonly
            />
          </div>
          <div class="md:col-span-1 flex items-end">
            <button
              type="button"
              class="w-full px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              :disabled="form.proposta_itens_hora.length <= 1"
              @click="removerEtapa(index)"
            >
              Remover
            </button>
          </div>
        </div>
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

    <div class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5">
      <h3 class="text-sm font-medium text-zinc-300">Condições comerciais</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Validade do orçamento (dias)</label>
          <input
            v-model.number="form.validade_orcamento_dias"
            type="number"
            min="0"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Suporte pós-entrega (dias)</label>
          <input
            v-model.number="form.suporte_dias"
            type="number"
            min="0"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <label class="block text-sm font-medium text-zinc-300">Forma de pagamento</label>
          <p class="text-xs text-zinc-500">Total base: {{ formatarMoeda(valorBasePagamento) }}</p>
        </div>

        <div
          v-for="(parcela, index) in form.forma_pagamento"
          :key="`parcela-${index}`"
          class="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
        >
          <div class="md:col-span-5">
            <label class="block text-xs text-zinc-500 mb-1">Descrição</label>
            <input
              v-model="parcela.descricao"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-zinc-500 mb-1">Percentual (%)</label>
            <input
              v-model.number="parcela.percentual"
              type="number"
              min="0"
              max="100"
              step="0.01"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs text-zinc-500 mb-1">Marco (horas)</label>
            <input
              v-model.number="parcela.marco_horas"
              type="number"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            />
          </div>
          <div class="md:col-span-3">
            <label class="block text-xs text-zinc-500 mb-1">Valor (R$)</label>
            <input
              :value="formatarMoeda(formaPagamentoCalculada[index]?.valor ?? 0)"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100"
              readonly
            />
          </div>
        </div>

        <p
          v-if="Math.abs(percentualTotalPagamento - 100) > 0.01"
          class="text-xs text-amber-400"
        >
          A soma dos percentuais está em {{ percentualTotalPagamento.toFixed(2) }}%. O ideal é 100%.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Condições (uma por linha)</label>
        <textarea
          v-model="form.condicoes_texto"
          rows="4"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: Validade do orçamento: 15 dias"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Garantias (uma por linha)</label>
        <textarea
          v-model="form.garantias_texto"
          rows="3"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: Suporte técnico por 7 dias após entrega"
        />
      </div>
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
      <ClientOnly>
        <AdminRichTextEditor
          v-model="form.mais_info"
          placeholder="Detalhes adicionais da proposta..."
        />
      </ClientOnly>
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
import {
  calcularResumoHora,
  createProposta,
  slugifyProposta,
  updateProposta,
  type PropostaHoraItem,
  type PropostaFormaPagamentoItem,
  type PropostaRow,
  type TipoProjeto,
  type TipoProposta,
  type TipoServico,
  type Entrega,
} from '~/composables/usePropostas'

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

function createEtapa(index: number): PropostaHoraItem {
  return {
    etapa: `Etapa ${index + 1}`,
    descricao: null,
    horas: 0,
    valor_hora: 0,
    subtotal: 0,
    ordem: index
  }
}

function createFormaPagamentoPadrao(totalHoras = 0): PropostaFormaPagamentoItem[] {
  const marcoMetade = totalHoras > 0 ? Number((totalHoras / 2).toFixed(2)) : null
  return [
    {
      descricao: '50% no aceite da proposta',
      percentual: 50,
      valor: 0,
      marco_horas: null
    },
    {
      descricao: '30% na metade do projeto',
      percentual: 30,
      valor: 0,
      marco_horas: marcoMetade
    },
    {
      descricao: '20% na entrega final',
      percentual: 20,
      valor: 0,
      marco_horas: totalHoras > 0 ? totalHoras : null
    }
  ]
}

function normalizarLinhasTexto(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map(item => String(item ?? '').trim())
    .filter(Boolean)
}

function linhasParaTexto(value: unknown, fallback: string[]): string {
  const linhas = normalizarLinhasTexto(value)
  return (linhas.length ? linhas : fallback).join('\n')
}

function parseLinhasTextarea(value: string): string[] {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(valor) ? valor : 0)
}

const initialTipoProposta = (props.initial?.tipo_proposta ?? 'empreitada') as TipoProposta
const initialItensHora = (props.initial?.proposta_itens_hora ?? []) as PropostaHoraItem[]
const initialTotalHoras = Number(props.initial?.total_horas ?? 0)
const condicoesPadrao = [
  'Validade do orçamento: 15 dias',
  'O escopo poderá sofrer alterações caso haja novas solicitações não previstas.',
  'Pagamento via PIX ou transferência bancária.',
  'O início do desenvolvimento está condicionado ao pagamento da primeira parcela.'
]
const garantiasPadrao = [
  'Suporte técnico para correções de bugs por 7 dias após a entrega final.',
  'Ajustes e evoluções fora do escopo serão cobrados separadamente.'
]

const form = reactive({
  tipo_proposta: initialTipoProposta,
  nome_proejeto: props.initial?.nome_proejeto ?? '',
  tipo_projeto: (props.initial?.tipo_projeto as TipoProjeto | '') ?? '',
  nome_cliente: props.initial?.nome_cliente ?? '',
  email_cliente: props.initial?.email_cliente ?? '',
  telefone_cliente: props.initial?.telefone_cliente ?? '',
  valor_bruto: props.initial?.valor_bruto ?? undefined,
  valor_final: props.initial?.valor_final ?? undefined,
  valor_hora: props.initial?.valor_hora ?? undefined,
  total_horas: props.initial?.total_horas ?? undefined,
  prazo_dias: props.initial?.prazo_dias ?? undefined,
  dias_corridos_ou_ulteis: props.initial?.dias_corridos_ou_ulteis ?? '',
  validade_orcamento_dias: props.initial?.validade_orcamento_dias ?? 15,
  suporte_dias: props.initial?.suporte_dias ?? 7,
  condicoes_texto: linhasParaTexto(props.initial?.condicoes, condicoesPadrao),
  garantias_texto: linhasParaTexto(props.initial?.garantias, garantiasPadrao),
  forma_pagamento: (props.initial?.forma_pagamento?.length
    ? props.initial.forma_pagamento
    : createFormaPagamentoPadrao(initialTotalHoras)
  ).map(item => ({
    descricao: item.descricao,
    percentual: Number(item.percentual ?? 0),
    valor: Number(item.valor ?? 0),
    marco_horas: item.marco_horas == null ? null : Number(item.marco_horas)
  })),
  tipos_servicos_enuns: (props.initial?.tipos_servicos_enuns ?? []) as TipoServico[],
  entregas: (props.initial?.entregas ?? []) as Entrega[],
  mais_info: props.initial?.mais_info ?? '',
  slug: props.initial?.slug ?? '',
  proposta_itens_hora: initialItensHora.length
    ? initialItensHora.map((item, index) => ({
        etapa: item.etapa || `Etapa ${index + 1}`,
        descricao: item.descricao || null,
        horas: Number(item.horas || 0),
        valor_hora: Number(item.valor_hora || props.initial?.valor_hora || 0),
        subtotal: Number(item.subtotal || 0),
        ordem: Number(item.ordem ?? index)
      }))
    : [createEtapa(0)]
})

const saving = ref(false)
const isHora = computed(() => form.tipo_proposta === 'hora')
const resumoHora = computed(() => calcularResumoHora(form.proposta_itens_hora, form.valor_hora ?? 0))
const valorBasePagamento = computed(() => {
  if (isHora.value) return resumoHora.value.totalValor
  return Number(form.valor_final ?? form.valor_bruto ?? 0)
})
const formaPagamentoCalculada = computed(() => {
  return form.forma_pagamento.map((item) => {
    const percentual = Math.max(0, Number(item.percentual || 0))
    const valor = Number((valorBasePagamento.value * percentual / 100).toFixed(2))
    return {
      descricao: item.descricao?.trim() || 'Parcela',
      percentual,
      valor,
      marco_horas: item.marco_horas == null ? null : Number(item.marco_horas)
    }
  })
})
const percentualTotalPagamento = computed(() => {
  return form.forma_pagamento.reduce((acc, item) => acc + Number(item.percentual || 0), 0)
})

watch(
  () => resumoHora.value.totalHoras,
  (totalHoras) => {
    if (!isHora.value) return
    if (!form.forma_pagamento.length) {
      form.forma_pagamento = createFormaPagamentoPadrao(totalHoras)
      return
    }

    form.forma_pagamento = form.forma_pagamento.map((parcela, index) => {
      if (index === 1) {
        return { ...parcela, marco_horas: totalHoras > 0 ? Number((totalHoras / 2).toFixed(2)) : parcela.marco_horas }
      }
      if (index === 2) {
        return { ...parcela, marco_horas: totalHoras > 0 ? totalHoras : parcela.marco_horas }
      }
      return parcela
    })
  }
)

watch(
  () => form.tipo_proposta,
  (tipo) => {
    if (tipo === 'hora' && form.proposta_itens_hora.length === 0) {
      form.proposta_itens_hora.push(createEtapa(0))
    }
  }
)

function adicionarEtapa() {
  form.proposta_itens_hora.push(createEtapa(form.proposta_itens_hora.length))
}

function removerEtapa(index: number) {
  if (form.proposta_itens_hora.length <= 1) return
  form.proposta_itens_hora.splice(index, 1)
}

async function onSubmit() {
  saving.value = true
  try {
    let slugFinal = form.slug?.trim() || null

    if (isHora.value && resumoHora.value.itens.length === 0) {
      alert('Adicione ao menos uma etapa com horas para proposta por hora.')
      return
    }
    
    if (props.propostaId) {
      const { error } = await updateProposta(props.propostaId, {
        tipo_proposta: form.tipo_proposta,
        nome_proejeto: form.nome_proejeto || null,
        tipo_projeto: form.tipo_projeto || null,
        nome_cliente: form.nome_cliente || null,
        email_cliente: form.email_cliente || null,
        telefone_cliente: form.telefone_cliente || null,
        valor_bruto: isHora.value ? resumoHora.value.totalValor : (form.valor_bruto ?? null),
        valor_final: isHora.value ? resumoHora.value.totalValor : (form.valor_final ?? null),
        valor_hora: isHora.value ? (form.valor_hora ?? 0) : null,
        total_horas: isHora.value ? resumoHora.value.totalHoras : null,
        prazo_dias: form.prazo_dias ?? null,
        dias_corridos_ou_ulteis: form.dias_corridos_ou_ulteis || null,
        validade_orcamento_dias: form.validade_orcamento_dias ?? null,
        suporte_dias: form.suporte_dias ?? null,
        forma_pagamento: formaPagamentoCalculada.value.length ? formaPagamentoCalculada.value : null,
        condicoes: parseLinhasTextarea(form.condicoes_texto),
        garantias: parseLinhasTextarea(form.garantias_texto),
        tipos_servicos_enuns: form.tipos_servicos_enuns.length ? form.tipos_servicos_enuns : null,
        entregas: form.entregas.length ? form.entregas : null,
        mais_info: form.mais_info || null,
        slug: slugFinal,
        proposta_itens_hora: isHora.value
          ? resumoHora.value.itens.map((item, index) => ({
              ...item,
              valor_hora: Number(form.valor_hora ?? 0),
              ordem: index
            }))
          : []
      })
      if (error) {
        alert('Erro ao atualizar: ' + error)
        return
      }
      emit('success', { ...form, id: props.propostaId } as PropostaRow)
    } else {
      // Para novas propostas, gerar slug automático a partir do nome
      if (!slugFinal && form.nome_proejeto) {
        slugFinal = slugifyProposta(form.nome_proejeto)
      }
      
      const { data, error } = await createProposta({
        tipo_proposta: form.tipo_proposta,
        nome_proejeto: form.nome_proejeto || null,
        tipo_projeto: form.tipo_projeto || null,
        nome_cliente: form.nome_cliente || null,
        email_cliente: form.email_cliente || null,
        telefone_cliente: form.telefone_cliente || null,
        valor_bruto: isHora.value ? resumoHora.value.totalValor : (form.valor_bruto ?? null),
        valor_final: isHora.value ? resumoHora.value.totalValor : (form.valor_final ?? null),
        valor_hora: isHora.value ? (form.valor_hora ?? 0) : null,
        total_horas: isHora.value ? resumoHora.value.totalHoras : null,
        prazo_dias: form.prazo_dias ?? null,
        dias_corridos_ou_ulteis: form.dias_corridos_ou_ulteis || null,
        validade_orcamento_dias: form.validade_orcamento_dias ?? null,
        suporte_dias: form.suporte_dias ?? null,
        forma_pagamento: formaPagamentoCalculada.value.length ? formaPagamentoCalculada.value : null,
        condicoes: parseLinhasTextarea(form.condicoes_texto),
        garantias: parseLinhasTextarea(form.garantias_texto),
        tipos_servicos_enuns: form.tipos_servicos_enuns.length ? form.tipos_servicos_enuns : null,
        entregas: form.entregas.length ? form.entregas : null,
        mais_info: form.mais_info || null,
        slug: slugFinal,
        proposta_itens_hora: isHora.value
          ? resumoHora.value.itens.map((item, index) => ({
              ...item,
              valor_hora: Number(form.valor_hora ?? 0),
              ordem: index
            }))
          : []
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
