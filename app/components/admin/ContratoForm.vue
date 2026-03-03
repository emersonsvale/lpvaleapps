<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Título do contrato *</label>
        <input
          v-model="form.titulo"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: Contrato de Desenvolvimento SaaS"
          minlength="3"
          maxlength="160"
          required
          @input="form.titulo = limitarTexto(form.titulo, 160)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Status</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
          <option v-for="op in statusOptions" :key="op.status" :value="op.status">{{ op.titulo }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Nome do cliente *</label>
        <input
          v-model="form.cliente_nome"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: João Silva"
          minlength="3"
          maxlength="120"
          required
          @input="form.cliente_nome = limitarTexto(form.cliente_nome, 120)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">E-mail do cliente</label>
        <input
          v-model="form.cliente_email"
          type="email"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="cliente@email.com"
          maxlength="120"
          @input="form.cliente_email = limitarEmail(form.cliente_email)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Telefone do cliente</label>
        <input
          v-model="form.cliente_telefone"
          type="text"
          inputmode="numeric"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="(11) 99999-0000"
          maxlength="15"
          @input="onTelefoneInput"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Valor total (R$)</label>
        <input
          :value="valorTotalTexto"
          type="text"
          inputmode="numeric"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="R$ 0,00"
          @input="onValorTotalInput"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Início</label>
        <input
          v-model="form.data_inicio"
          type="date"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Fim</label>
        <input
          v-model="form.data_fim"
          type="date"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Assinatura</label>
        <input
          v-model="form.data_assinatura"
          type="date"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
      <textarea
        v-model="form.descricao"
        rows="4"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        placeholder="Resumo do escopo e obrigações principais"
        maxlength="4000"
        @input="form.descricao = limitarTexto(form.descricao, 4000)"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Observações</label>
      <textarea
        v-model="form.observacoes"
        rows="4"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        placeholder="Notas internas do contrato"
        maxlength="4000"
        @input="form.observacoes = limitarTexto(form.observacoes, 4000)"
      />
    </div>

    <!-- Campos do documento contratual (colapsável) -->
    <details class="border border-zinc-800 rounded-lg">
      <summary class="cursor-pointer px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800/40 transition-colors rounded-lg">
        Dados do documento contratual
      </summary>
      <div class="p-4 space-y-4 border-t border-zinc-800">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">CNPJ do cliente</label>
            <input v-model="form.cliente_cnpj" type="text" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="00.000.000/0000-00" maxlength="18" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-zinc-400 mb-1">Endereço do cliente</label>
            <input v-model="form.cliente_endereco" type="text" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="Rua, número, bairro, cidade - UF" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">CEP</label>
            <input v-model="form.cliente_cep" type="text" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="00000-000" maxlength="9" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">Prazo entrega (dias úteis)</label>
            <input v-model.number="form.prazo_dias" type="number" min="1" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="120" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">Garantia (dias)</label>
            <input v-model.number="form.prazo_garantia_dias" type="number" min="1" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="90" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Condições de pagamento</label>
          <textarea v-model="form.condicoes_pagamento" rows="2" class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100" placeholder="Ex: 30% assinatura, 40% protótipo, 30% entrega" maxlength="2000" />
        </div>
      </div>
    </details>

    <div class="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar contrato') }}
      </button>
      <button
        v-if="isEdit"
        type="button"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        @click="confirmarExclusao"
      >
        Excluir contrato
      </button>
      <button
        v-if="isEdit"
        type="button"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
        @click="gerarDocumento"
      >
        Gerar documento
      </button>
      <span v-if="erro" class="text-sm text-red-400">{{ erro }}</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  createContrato,
  deleteContrato,
  getContratoStatusOptions,
  type ContratoRow,
  updateContrato,
} from '~/composables/useContratos'
import {
  type ContratoDocumentData,
  EMPRESA_DEFAULTS,
  openContratoPreview,
} from '~/composables/useContratoDocument'

const props = defineProps<{
  contratoId?: number
  initial?: ContratoRow | null
}>()

const emit = defineEmits<{
  success: [ContratoRow]
  deleted: []
}>()

const statusOptions = getContratoStatusOptions()
const isEdit = computed(() => !!props.contratoId)

const form = reactive({
  titulo: props.initial?.titulo ?? '',
  cliente_nome: props.initial?.cliente_nome ?? '',
  cliente_email: props.initial?.cliente_email ?? '',
  cliente_telefone: props.initial?.cliente_telefone ?? '',
  status: props.initial?.status ?? 'rascunho',
  valor_total: props.initial?.valor_total ?? null as number | null,
  data_inicio: props.initial?.data_inicio ?? '',
  data_fim: props.initial?.data_fim ?? '',
  data_assinatura: props.initial?.data_assinatura ?? '',
  descricao: props.initial?.descricao ?? '',
  observacoes: props.initial?.observacoes ?? '',
  // Campos do documento contratual
  cliente_endereco: props.initial?.cliente_endereco ?? '',
  cliente_cep: props.initial?.cliente_cep ?? '',
  cliente_cnpj: props.initial?.cliente_cnpj ?? '',
  prazo_dias: props.initial?.prazo_dias ?? null as number | null,
  prazo_garantia_dias: props.initial?.prazo_garantia_dias ?? null as number | null,
  condicoes_pagamento: props.initial?.condicoes_pagamento ?? '',
})

const salvando = ref(false)
const erro = ref('')
const valorTotalTexto = ref('')
const VALOR_MAXIMO_CENTAVOS = 99999999999

watch(
  () => props.initial,
  (valor) => {
    if (!valor) return
    form.titulo = valor.titulo ?? ''
    form.cliente_nome = valor.cliente_nome ?? ''
    form.cliente_email = valor.cliente_email ?? ''
    form.cliente_telefone = valor.cliente_telefone ?? ''
    form.status = valor.status ?? 'rascunho'
    form.valor_total = valor.valor_total ?? null
    form.data_inicio = valor.data_inicio ?? ''
    form.data_fim = valor.data_fim ?? ''
    form.data_assinatura = valor.data_assinatura ?? ''
    form.descricao = valor.descricao ?? ''
    form.observacoes = valor.observacoes ?? ''
    form.cliente_endereco = valor.cliente_endereco ?? ''
    form.cliente_cep = valor.cliente_cep ?? ''
    form.cliente_cnpj = valor.cliente_cnpj ?? ''
    form.prazo_dias = valor.prazo_dias ?? null
    form.prazo_garantia_dias = valor.prazo_garantia_dias ?? null
    form.condicoes_pagamento = valor.condicoes_pagamento ?? ''
    syncValorTotalTexto()
  },
  { immediate: true }
)

function limitarTexto(valor: string | null | undefined, max = 200): string {
  return String(valor ?? '').slice(0, max)
}

function limitarEmail(valor: string | null | undefined): string {
  return String(valor ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .slice(0, 120)
}

function syncValorTotalTexto() {
  if (form.valor_total == null || Number.isNaN(form.valor_total)) {
    valorTotalTexto.value = ''
    return
  }

  valorTotalTexto.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(form.valor_total)
}

function onTelefoneInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  const raw = target?.value ?? form.cliente_telefone ?? ''
  const digits = raw.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 10) {
    form.cliente_telefone = digits
      .replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, d1, d2, d3) => {
        if (!d1) return ''
        if (!d2) return `(${d1}`
        if (!d3) return `(${d1}) ${d2}`
        return `(${d1}) ${d2}-${d3}`
      })
      .trim()
    return
  }

  form.cliente_telefone = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

function onValorTotalInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  const digits = (target?.value ?? '').replace(/\D/g, '').slice(0, 11)

  if (!digits) {
    form.valor_total = null
    valorTotalTexto.value = ''
    return
  }

  const centavos = Math.min(Number(digits), VALOR_MAXIMO_CENTAVOS)
  const valor = centavos / 100
  form.valor_total = Number.isFinite(valor) ? Number(valor.toFixed(2)) : null
  valorTotalTexto.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(form.valor_total ?? 0)
}

function buildPayload() {
  return {
    titulo: form.titulo,
    cliente_nome: form.cliente_nome,
    cliente_email: form.cliente_email,
    cliente_telefone: form.cliente_telefone,
    status: form.status,
    valor_total: form.valor_total,
    data_inicio: form.data_inicio || null,
    data_fim: form.data_fim || null,
    data_assinatura: form.data_assinatura || null,
    descricao: form.descricao,
    observacoes: form.observacoes,
    cliente_endereco: form.cliente_endereco || null,
    cliente_cep: form.cliente_cep || null,
    cliente_cnpj: form.cliente_cnpj || null,
    prazo_dias: form.prazo_dias,
    prazo_garantia_dias: form.prazo_garantia_dias,
    condicoes_pagamento: form.condicoes_pagamento || null,
  }
}

async function onSubmit() {
  if (salvando.value) return
  erro.value = ''

  if (!form.titulo.trim()) {
    erro.value = 'Informe o título do contrato.'
    return
  }

  if (!form.cliente_nome.trim()) {
    erro.value = 'Informe o nome do cliente.'
    return
  }

  salvando.value = true

  try {
    if (isEdit.value && props.contratoId) {
      const { error } = await updateContrato(props.contratoId, buildPayload())
      if (error) {
        erro.value = error
        return
      }

      emit('success', {
        ...(props.initial as ContratoRow),
        ...buildPayload(),
        id: props.contratoId,
        created_at: props.initial?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ContratoRow)
      return
    }

    const { data, error } = await createContrato(buildPayload())
    if (error || !data) {
      erro.value = error || 'Não foi possível criar o contrato.'
      return
    }

    emit('success', data)
  } finally {
    salvando.value = false
  }
}

async function confirmarExclusao() {
  if (!props.contratoId) return
  const ok = confirm('Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.')
  if (!ok) return

  erro.value = ''
  salvando.value = true

  try {
    const { error } = await deleteContrato(props.contratoId)
    if (error) {
      erro.value = error
      return
    }

    emit('deleted')
  } finally {
    salvando.value = false
  }
}

function gerarDocumento() {
  const docData: ContratoDocumentData = {
    clienteRazaoSocial: form.cliente_nome || '',
    clienteEndereco: form.cliente_endereco || '',
    clienteCep: form.cliente_cep || '',
    clienteCnpj: form.cliente_cnpj || '',
    prazoDias: form.prazo_dias || 120,
    prazoGarantiaDias: form.prazo_garantia_dias || 90,
    valorTotal: form.valor_total || 0,
    condicoesPagamento: form.condicoes_pagamento || '',
    valorHoraSuporte: 0,
    multaAbsorcao: '100.000,00',
    percentualResilicao: '80%',
    emailSuporte: EMPRESA_DEFAULTS.emailSuporte,
    canalAtendimento: EMPRESA_DEFAULTS.canalAtendimento,
    bancoNome: EMPRESA_DEFAULTS.bancoNome,
    bancoAgencia: EMPRESA_DEFAULTS.bancoAgencia,
    bancoConta: EMPRESA_DEFAULTS.bancoConta,
    chavePix: EMPRESA_DEFAULTS.chavePix,
    cidadeForo: EMPRESA_DEFAULTS.cidadeForo,
    estadoForo: EMPRESA_DEFAULTS.estadoForo,
    dataAssinatura: form.data_assinatura || '',
  }
  openContratoPreview(docData)
}
</script>