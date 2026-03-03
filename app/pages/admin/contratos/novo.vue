<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Gestão de Contratos</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Gerar contrato</h1>
        <p class="text-zinc-400 mt-2">
          Preencha os dados abaixo para gerar o contrato de prestação de serviços. Você pode importar dados de uma proposta existente.
        </p>
      </div>
      <NuxtLink
        to="/admin/contratos"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <!-- Importar da Proposta -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Importar da Proposta</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Selecionar proposta</label>
          <select
            v-model="propostaSelecionadaId"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            @change="importarProposta"
          >
            <option :value="null">— Nenhuma (preencher manualmente) —</option>
            <option v-for="p in propostas" :key="p.id" :value="p.id">
              #{{ p.id }} · {{ p.nome_proejeto || p.nome_cliente || 'Proposta sem nome' }}
              {{ p.valor_final ? ` — ${fmtMoeda(p.valor_final)}` : '' }}
            </option>
          </select>
        </div>
        <div v-if="propostaSelecionadaId" class="text-sm text-emerald-400">
          Dados importados da proposta #{{ propostaSelecionadaId }}
        </div>
      </div>
    </section>

    <!-- Dados do Contratante -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Dados do Contratante</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Razão Social / Nome completo *</label>
          <input
            v-model="form.clienteRazaoSocial"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Nome completo ou razão social do cliente"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">CNPJ</label>
          <input
            v-model="form.clienteCnpj"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="00.000.000/0000-00"
            maxlength="18"
            @input="onCnpjInput"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-zinc-400 mb-1">Endereço completo</label>
          <input
            v-model="form.clienteEndereco"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">CEP</label>
          <input
            v-model="form.clienteCep"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="00000-000"
            maxlength="9"
            @input="onCepInput"
          />
        </div>
      </div>
    </section>

    <!-- Prazo e Garantia -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Prazo e Garantia</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Prazo de entrega (dias úteis) *</label>
          <input
            v-model.number="form.prazoDias"
            type="number"
            min="1"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="120"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Prazo de garantia (dias) *</label>
          <input
            v-model.number="form.prazoGarantiaDias"
            type="number"
            min="1"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="90"
          />
        </div>
      </div>
    </section>

    <!-- Valores e Pagamento -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Valores e Pagamento</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Valor total do projeto (R$) *</label>
          <input
            :value="valorTotalTexto"
            type="text"
            inputmode="numeric"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="R$ 0,00"
            @input="onValorTotalInput"
          />
          <p v-if="form.valorTotal > 0" class="text-xs text-zinc-500 mt-1 italic">
            {{ valorExtenso }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Valor hora suporte avulso (R$)</label>
          <input
            :value="valorHoraSuporteTexto"
            type="text"
            inputmode="numeric"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="R$ 0,00"
            @input="onValorHoraSuporteInput"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-zinc-400 mb-1">Condições de pagamento</label>
          <textarea
            v-model="form.condicoesPagamento"
            rows="3"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Ex: 30% na assinatura, 40% na entrega do protótipo, 30% na entrega final"
          />
        </div>
      </div>
    </section>

    <!-- Multas e Penalidades -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Multas e Penalidades</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Multa absorção profissional (R$)</label>
          <input
            v-model="form.multaAbsorcao"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="100.000,00"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Percentual resilição (%)</label>
          <input
            v-model="form.percentualResilicao"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="80%"
          />
        </div>
      </div>
    </section>

    <!-- Dados Bancários (Vale Apps) -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Dados Bancários (Vale Apps)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Banco</label>
          <input
            v-model="form.bancoNome"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Nome do banco"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Agência</label>
          <input
            v-model="form.bancoAgencia"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="0000"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Conta Corrente</label>
          <input
            v-model="form.bancoConta"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="00000-0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Chave PIX</label>
          <input
            v-model="form.chavePix"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="CNPJ, e-mail ou telefone"
          />
        </div>
      </div>
    </section>

    <!-- Suporte e Foro -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Suporte e Foro</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">E-mail de suporte</label>
          <input
            v-model="form.emailSuporte"
            type="email"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="suporte@valeapps.com.br"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Canal de atendimento</label>
          <input
            v-model="form.canalAtendimento"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="WhatsApp / E-mail"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Cidade do foro</label>
          <input
            v-model="form.cidadeForo"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Imperatriz"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Estado do foro</label>
          <input
            v-model="form.estadoForo"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Maranhão"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1">Data da assinatura</label>
          <input
            v-model="form.dataAssinatura"
            type="date"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          />
        </div>
      </div>
    </section>

    <!-- Ações -->
    <section class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="px-5 py-2.5 rounded-lg bg-brand text-black font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          @click="visualizarContrato"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Visualizar Contrato
        </button>

        <button
          type="button"
          class="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          @click="baixarWord"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Word
        </button>

        <button
          type="button"
          class="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          @click="imprimirPDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir / PDF
        </button>

        <div class="w-full border-t border-zinc-800 my-1" />

        <button
          type="button"
          class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
          :disabled="salvando"
          @click="salvarContrato"
        >
          {{ salvando ? 'Salvando...' : 'Salvar contrato no sistema' }}
        </button>

        <span v-if="msgErro" class="text-sm text-red-400">{{ msgErro }}</span>
        <span v-if="msgSucesso" class="text-sm text-emerald-400">{{ msgSucesso }}</span>
      </div>
    </section>

    <!-- Preview inline (modal fullscreen) -->
    <Teleport to="body">
      <div
        v-if="showPreview"
        class="fixed inset-0 z-[9999] bg-black/80 flex flex-col"
      >
        <!-- Toolbar -->
        <div class="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-3">
          <span class="text-zinc-100 font-semibold text-sm">Pré-visualização do Contrato</span>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:opacity-90"
              @click="imprimirPDF"
            >
              Imprimir / PDF
            </button>
            <button
              class="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:opacity-90"
              @click="baixarWord"
            >
              Download Word
            </button>
            <button
              class="px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-600"
              @click="showPreview = false"
            >
              Fechar
            </button>
          </div>
        </div>
        <!-- Contrato renderizado -->
        <div class="flex-1 overflow-auto bg-zinc-200 p-4 md:p-8">
          <div
            class="max-w-[820px] mx-auto bg-white shadow-xl rounded-sm"
            style="padding: 48px 40px; font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.7; color: #1a1a1a;"
          >
            <div class="contrato-preview-container" v-html="previewHTML" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { createContrato, type ContratoRow } from '~/composables/useContratos'
import { fetchPropostas, type PropostaRow } from '~/composables/usePropostas'
import {
  type ContratoDocumentData,
  EMPRESA_DEFAULTS,
  getDefaultDocumentData,
  mapPropostaToDocumentData,
  valorPorExtenso,
  generateContratoHTML,
  openContratoPreview,
  downloadContratoAsWord,
} from '~/composables/useContratoDocument'
import { marked } from 'marked'

definePageMeta({ layout: 'admin' })

// ─── Propostas ─────────────────────────────────────────────────────────────────
const { data: propostasData } = await useAsyncData('admin-propostas-select', fetchPropostas)
const propostas = computed(() => propostasData.value ?? [])
const propostaSelecionadaId = ref<number | null>(null)

// ─── Formulário ────────────────────────────────────────────────────────────────
const form = reactive<ContratoDocumentData>(getDefaultDocumentData())

const salvando = ref(false)
const msgErro = ref('')
const msgSucesso = ref('')
const showPreview = ref(false)

// ─── Campos de moeda formatados ────────────────────────────────────────────────
const valorTotalTexto = ref('')
const valorHoraSuporteTexto = ref('')
const VALOR_MAXIMO_CENTAVOS = 99999999999

const valorExtenso = computed(() => {
  if (!form.valorTotal || form.valorTotal <= 0) return ''
  return valorPorExtenso(form.valorTotal)
})

function fmtMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function onValorInput(event: Event, campo: 'valorTotal' | 'valorHoraSuporte') {
  const target = event.target as HTMLInputElement | null
  const digits = (target?.value ?? '').replace(/\D/g, '').slice(0, 11)

  if (!digits) {
    form[campo] = 0
    if (campo === 'valorTotal') valorTotalTexto.value = ''
    else valorHoraSuporteTexto.value = ''
    return
  }

  const centavos = Math.min(Number(digits), VALOR_MAXIMO_CENTAVOS)
  const valor = centavos / 100
  form[campo] = Number.isFinite(valor) ? Number(valor.toFixed(2)) : 0

  const formatted = fmtMoeda(form[campo])
  if (campo === 'valorTotal') valorTotalTexto.value = formatted
  else valorHoraSuporteTexto.value = formatted
}

function onValorTotalInput(e: Event) { onValorInput(e, 'valorTotal') }
function onValorHoraSuporteInput(e: Event) { onValorInput(e, 'valorHoraSuporte') }

// ─── Máscaras ──────────────────────────────────────────────────────────────────
function onCnpjInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  const digits = (target?.value ?? '').replace(/\D/g, '').slice(0, 14)
  form.clienteCnpj = digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function onCepInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  const digits = (target?.value ?? '').replace(/\D/g, '').slice(0, 8)
  form.clienteCep = digits.replace(/(\d{5})(\d)/, '$1-$2')
}

// ─── Importar proposta ─────────────────────────────────────────────────────────
function importarProposta() {
  if (!propostaSelecionadaId.value) return

  const proposta = propostas.value.find((p: PropostaRow) => p.id === propostaSelecionadaId.value)
  if (!proposta) return

  const dados = mapPropostaToDocumentData(proposta)

  if (dados.clienteRazaoSocial) form.clienteRazaoSocial = dados.clienteRazaoSocial
  if (dados.valorTotal) {
    form.valorTotal = dados.valorTotal
    valorTotalTexto.value = fmtMoeda(dados.valorTotal)
  }
  if (dados.prazoDias) form.prazoDias = dados.prazoDias
  if (dados.prazoGarantiaDias) form.prazoGarantiaDias = dados.prazoGarantiaDias
  if (dados.condicoesPagamento) form.condicoesPagamento = dados.condicoesPagamento
}

// ─── Preview ───────────────────────────────────────────────────────────────────
const previewHTML = computed(() => {
  // Usa a mesma lógica de preenchimento do template
  // mas retorna só o conteúdo HTML (sem o wrapper do documento inteiro)
  const { generateContratoHTML: _gen, ...rest } = { generateContratoHTML }
  // Gera o HTML completo e extrai o body
  const fullHTML = generateContratoHTML(form)
  // Extrair apenas o conteúdo do .content-wrapper
  const match = fullHTML.match(/<div class="content-wrapper">([\s\S]*?)<\/div>\s*<\/body>/)
  return match?.[1] ?? ''
})

function visualizarContrato() {
  showPreview.value = true
}

// ─── Downloads ─────────────────────────────────────────────────────────────────
function imprimirPDF() {
  openContratoPreview(form)
}

function baixarWord() {
  const nome = form.clienteRazaoSocial
    ? `Contrato_${form.clienteRazaoSocial.replace(/[^a-zA-Z0-9À-ÿ ]/g, '').replace(/\s+/g, '_')}`
    : 'Contrato_Prestacao_Servicos'
  downloadContratoAsWord(form, nome)
}

// ─── Salvar contrato ───────────────────────────────────────────────────────────
async function salvarContrato() {
  if (salvando.value) return
  msgErro.value = ''
  msgSucesso.value = ''

  if (!form.clienteRazaoSocial.trim()) {
    msgErro.value = 'Informe a razão social / nome do contratante.'
    return
  }

  salvando.value = true

  try {
    const titulo = `Contrato - ${form.clienteRazaoSocial}`
    const { data, error } = await createContrato({
      titulo,
      cliente_nome: form.clienteRazaoSocial,
      cliente_email: null,
      cliente_telefone: null,
      status: 'rascunho',
      valor_total: form.valorTotal || null,
      data_inicio: null,
      data_fim: null,
      data_assinatura: form.dataAssinatura || null,
      descricao: `Contrato gerado automaticamente. Prazo: ${form.prazoDias} dias úteis. Garantia: ${form.prazoGarantiaDias} dias.`,
      observacoes: null,
      proposta_id: propostaSelecionadaId.value,
      // Campos do documento
      cliente_endereco: form.clienteEndereco || null,
      cliente_cep: form.clienteCep || null,
      cliente_cnpj: form.clienteCnpj || null,
      prazo_dias: form.prazoDias || null,
      prazo_garantia_dias: form.prazoGarantiaDias || null,
      condicoes_pagamento: form.condicoesPagamento || null,
      valor_hora_suporte: form.valorHoraSuporte || null,
      multa_absorcao: form.multaAbsorcao || null,
      percentual_resilicao: form.percentualResilicao || null,
      email_suporte: form.emailSuporte || null,
      canal_atendimento: form.canalAtendimento || null,
      banco_nome: form.bancoNome || null,
      banco_agencia: form.bancoAgencia || null,
      banco_conta: form.bancoConta || null,
      chave_pix: form.chavePix || null,
      cidade_foro: form.cidadeForo || null,
      estado_foro: form.estadoForo || null,
    })

    if (error || !data) {
      msgErro.value = error || 'Não foi possível salvar o contrato.'
      return
    }

    msgSucesso.value = `Contrato #${data.id} salvo com sucesso!`
    setTimeout(() => navigateTo(`/admin/contratos/editar/${data.id}`), 1500)
  } finally {
    salvando.value = false
  }
}
</script>

<style>
/* Estilos para o preview inline do contrato */
.contrato-preview-container h1 {
  font-size: 18pt;
  text-align: center;
  margin-bottom: 24px;
  color: #111;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.3;
}
.contrato-preview-container h4 {
  font-size: 13pt;
  margin-top: 24px;
  margin-bottom: 10px;
  color: #111;
  font-family: Arial, Helvetica, sans-serif;
}
.contrato-preview-container p {
  margin-bottom: 8px;
  text-align: justify;
}
.contrato-preview-container ul,
.contrato-preview-container ol {
  margin-left: 24px;
  margin-bottom: 8px;
}
.contrato-preview-container li {
  margin-bottom: 4px;
  text-align: justify;
}
.contrato-preview-container table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 10pt;
}
.contrato-preview-container th,
.contrato-preview-container td {
  border: 1px solid #555;
  padding: 6px 8px;
  text-align: left;
}
.contrato-preview-container th {
  background: #f0f0f0;
  font-weight: bold;
  font-family: Arial, sans-serif;
  font-size: 9pt;
}
.contrato-preview-container hr {
  border: none;
  border-top: 2px solid #333;
  margin: 28px 0;
}
.contrato-preview-container strong {
  color: #000;
}
</style>