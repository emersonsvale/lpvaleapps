<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-zinc-300 mb-1">Nome do cliente *</label>
        <input
          v-model="form.nome"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: João Silva"
          minlength="3"
          maxlength="120"
          required
          @input="form.nome = limitarTexto(form.nome, 120)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Empresa</label>
        <input
          v-model="form.empresa"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: Silva Tech"
          maxlength="120"
          @input="form.empresa = limitarTexto(form.empresa, 120)"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="cliente@email.com"
          maxlength="120"
          @input="form.email = limitarEmail(form.email)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Telefone</label>
        <input
          v-model="form.telefone"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="(11) 99999-0000"
          inputmode="numeric"
          maxlength="15"
          @input="onTelefoneInput"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Responsável</label>
        <input
          v-model="form.responsavel"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Ex: Emerson"
          maxlength="80"
          @input="form.responsavel = limitarTexto(form.responsavel, 80)"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Status</label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
          <option v-for="coluna in colunasStatus" :key="coluna.status" :value="coluna.status">{{ coluna.titulo }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Prioridade</label>
        <select
          v-model="form.prioridade"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Origem</label>
        <input
          v-model="form.origem"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="Site, indicação..."
          maxlength="60"
          @input="form.origem = limitarTexto(form.origem, 60)"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Próximo follow-up</label>
        <input
          :value="proximoFollowupTexto"
          type="text"
          inputmode="numeric"
          maxlength="10"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="25/02/2026"
          @input="onProximoFollowupInput"
          @blur="onProximoFollowupBlur"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Valor potencial (R$)</label>
        <input
          :value="valorPotencialTexto"
          type="text"
          inputmode="numeric"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="R$ 0,00"
          @input="onValorPotencialInput"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Proposta vinculada</label>
        <select
          v-model="form.proposta_id"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        >
          <option :value="null">Sem proposta vinculada</option>
          <option
            v-for="proposta in propostasOptions"
            :key="proposta.id"
            :value="proposta.id"
          >
            #{{ proposta.id }} · {{ proposta.nome_proejeto || proposta.nome_cliente || `Proposta ${proposta.id}` }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-1">Tags (separadas por vírgula)</label>
        <input
          v-model="form.tags_text"
          type="text"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          placeholder="SaaS, mobile, urgente"
          maxlength="180"
          @input="form.tags_text = normalizarTagsTexto(form.tags_text)"
        >
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-zinc-300 mb-1">Observações</label>
      <textarea
        v-model="form.observacoes"
        rows="4"
        class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
        placeholder="Contexto comercial, objeções, necessidades, etc."
      />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        class="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar cliente') }}
      </button>
      <button
        v-if="isEdit"
        type="button"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        @click="confirmarExclusao"
      >
        Excluir cliente
      </button>
      <span v-if="erro" class="text-sm text-red-400">{{ erro }}</span>
    </div>

    <section v-if="clienteAtualId" class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-medium text-zinc-300">Interações</h3>
        <span class="text-xs text-zinc-500">Histórico comercial do cliente</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div class="md:col-span-2">
          <label class="block text-xs text-zinc-500 mb-1">Tipo</label>
          <select
            v-model="interacaoForm.tipo"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          >
            <option value="nota">Nota</option>
            <option value="ligacao">Ligação</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-mail</option>
            <option value="reuniao">Reunião</option>
            <option value="proposta">Proposta</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-zinc-500 mb-1">Data da interação</label>
          <input
            v-model="interacaoForm.data_interacao"
            type="datetime-local"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-zinc-500 mb-1">Próxima ação</label>
          <input
            :value="proximaAcaoTexto"
            type="text"
            inputmode="numeric"
            maxlength="10"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="25/02/2026"
            @input="onProximaAcaoInput"
            @blur="onProximaAcaoBlur"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div class="md:col-span-4">
          <label class="block text-xs text-zinc-500 mb-1">Resumo *</label>
          <input
            v-model="interacaoForm.resumo"
            type="text"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="Ex: cliente pediu ajuste no escopo"
            maxlength="180"
            @input="interacaoForm.resumo = limitarTexto(interacaoForm.resumo, 180)"
          >
        </div>
        <div>
          <label class="block text-xs text-zinc-500 mb-1">Valor citado (R$)</label>
          <input
            :value="valorMencionadoTexto"
            type="text"
            inputmode="numeric"
            class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
            placeholder="R$ 0,00"
            @input="onValorMencionadoInput"
          >
        </div>
      </div>

      <div>
        <label class="block text-xs text-zinc-500 mb-1">Detalhes</label>
        <textarea
          v-model="interacaoForm.detalhes"
          rows="3"
          class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100"
          maxlength="1200"
          @input="interacaoForm.detalhes = limitarTexto(interacaoForm.detalhes, 1200)"
        />
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="px-3 py-2 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
          :disabled="salvandoInteracao"
          @click="adicionarInteracao"
        >
          {{ salvandoInteracao ? 'Adicionando...' : 'Adicionar interação' }}
        </button>
        <span v-if="erroInteracao" class="text-sm text-red-400">{{ erroInteracao }}</span>
      </div>

      <div v-if="interacoesOrdenadas.length === 0" class="text-sm text-zinc-500">
        Nenhuma interação registrada até agora.
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="interacao in interacoesOrdenadas"
          :key="interacao.id"
          class="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm font-medium text-zinc-200">{{ interacao.resumo }}</p>
            <span class="text-xs text-zinc-500">{{ formatarDataHora(interacao.data_interacao) }}</span>
          </div>
          <p class="text-xs text-zinc-500 mt-1">{{ tituloTipo(interacao.tipo) }}</p>
          <p v-if="interacao.detalhes" class="text-sm text-zinc-300 mt-2">{{ interacao.detalhes }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span v-if="interacao.proxima_acao">Próxima ação: {{ formatarData(interacao.proxima_acao) }}</span>
            <span v-if="interacao.valor_mencionado != null">Valor: {{ formatarMoeda(interacao.valor_mencionado) }}</span>
          </div>
        </li>
      </ul>
    </section>
  </form>
</template>

<script setup lang="ts">
import {
  createCRMCliente,
  createCRMInteracao,
  deleteCRMCliente,
  type CRMCliente,
  type CRMInteracao,
  type CRMInteracaoInput,
  getCRMStatusColumns,
  updateCRMCliente,
} from '~/composables/useClientesCRM'
import { fetchPropostas, type PropostaRow } from '~/composables/usePropostas'

const props = defineProps<{
  clienteId?: number
  initial?: CRMCliente | null
}>()

const emit = defineEmits<{
  success: [CRMCliente]
  deleted: []
}>()

const colunasStatus = getCRMStatusColumns()
const isEdit = computed(() => !!props.clienteId)
const clienteAtualId = ref<number | null>(props.clienteId ?? null)
const propostasOptions = ref<PropostaRow[]>([])
const VALOR_MAXIMO = 999999999.99
const VALOR_MAXIMO_CENTAVOS = 99999999999

const form = reactive({
  nome: props.initial?.nome ?? '',
  empresa: props.initial?.empresa ?? '',
  email: props.initial?.email ?? '',
  telefone: props.initial?.telefone ?? '',
  origem: props.initial?.origem ?? 'site',
  status: props.initial?.status ?? 'lead',
  prioridade: props.initial?.prioridade ?? 'media',
  valor_potencial: props.initial?.valor_potencial ?? null as number | null,
  proximo_followup: props.initial?.proximo_followup ?? '',
  responsavel: props.initial?.responsavel ?? '',
  proposta_id: props.initial?.proposta_id ?? null as number | null,
  observacoes: props.initial?.observacoes ?? '',
  tags_text: (props.initial?.tags ?? []).join(', ')
})

const interacoes = ref<CRMInteracao[]>(props.initial?.crm_interacoes ?? [])
const valorPotencialTexto = ref('')
const valorMencionadoTexto = ref('')
const proximoFollowupTexto = ref('')
const proximaAcaoTexto = ref('')

const interacaoForm = reactive({
  tipo: 'nota',
  resumo: '',
  detalhes: '',
  data_interacao: '',
  proxima_acao: '',
  valor_mencionado: null as number | null
})

const salvando = ref(false)
const erro = ref<string | null>(null)
const salvandoInteracao = ref(false)
const erroInteracao = ref<string | null>(null)

const interacoesOrdenadas = computed(() => {
  return [...interacoes.value].sort((a, b) => {
    const timeA = new Date(a.data_interacao).getTime()
    const timeB = new Date(b.data_interacao).getTime()
    return timeB - timeA
  })
})

onMounted(async () => {
  propostasOptions.value = await fetchPropostas()
  valorPotencialTexto.value = form.valor_potencial == null ? '' : formatarMoeda(form.valor_potencial)
  proximoFollowupTexto.value = formatarIsoParaDataBR(form.proximo_followup)
})

function limitarTexto(valor: string, limite: number) {
  return String(valor ?? '').slice(0, limite)
}

function limitarEmail(valor: string) {
  return String(valor ?? '')
    .replace(/\s+/g, '')
    .slice(0, 120)
}

function normalizarTagsTexto(valor: string) {
  return String(valor ?? '')
    .replace(/\s{2,}/g, ' ')
    .replace(/,+/g, ',')
    .slice(0, 180)
}

function formatarTelefoneBR(valor: string) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`
  if (digitos.length <= 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
}

function onTelefoneInput() {
  form.telefone = formatarTelefoneBR(form.telefone)
}

function aplicarMascaraDataBR(valor: string) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

function parseDataBRParaIso(valor: string) {
  const match = String(valor ?? '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null

  const [, diaTexto, mesTexto, anoTexto] = match
  const dia = Number(diaTexto)
  const mes = Number(mesTexto)
  const ano = Number(anoTexto)

  if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > 2100) return null

  const data = new Date(Date.UTC(ano, mes - 1, dia))
  if (data.getUTCFullYear() !== ano || data.getUTCMonth() !== (mes - 1) || data.getUTCDate() !== dia) return null

  return `${anoTexto}-${mesTexto}-${diaTexto}`
}

function formatarIsoParaDataBR(valor: string | null | undefined) {
  if (!valor) return ''
  const parteData = String(valor).slice(0, 10)
  const match = parteData.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return ''
  const [, ano, mes, dia] = match
  return `${dia}/${mes}/${ano}`
}

function onProximoFollowupInput(event: Event) {
  const valor = (event.target as HTMLInputElement).value
  const mascarado = aplicarMascaraDataBR(valor)
  proximoFollowupTexto.value = mascarado
  form.proximo_followup = parseDataBRParaIso(mascarado) || ''
}

function onProximoFollowupBlur() {
  if (!proximoFollowupTexto.value) {
    form.proximo_followup = ''
    return
  }

  const iso = parseDataBRParaIso(proximoFollowupTexto.value)
  if (!iso) {
    proximoFollowupTexto.value = ''
    form.proximo_followup = ''
    return
  }

  form.proximo_followup = iso
  proximoFollowupTexto.value = formatarIsoParaDataBR(iso)
}

function onProximaAcaoInput(event: Event) {
  const valor = (event.target as HTMLInputElement).value
  const mascarado = aplicarMascaraDataBR(valor)
  proximaAcaoTexto.value = mascarado
  interacaoForm.proxima_acao = parseDataBRParaIso(mascarado) || ''
}

function onProximaAcaoBlur() {
  if (!proximaAcaoTexto.value) {
    interacaoForm.proxima_acao = ''
    return
  }

  const iso = parseDataBRParaIso(proximaAcaoTexto.value)
  if (!iso) {
    proximaAcaoTexto.value = ''
    interacaoForm.proxima_acao = ''
    return
  }

  interacaoForm.proxima_acao = iso
  proximaAcaoTexto.value = formatarIsoParaDataBR(iso)
}

function extrairCentavos(valor: string) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 11)
  if (!digitos) return null
  const centavos = Number(digitos)
  return Math.min(centavos, VALOR_MAXIMO_CENTAVOS)
}

function onValorPotencialInput(event: Event) {
  const valorDigitado = (event.target as HTMLInputElement).value
  const centavos = extrairCentavos(valorDigitado)

  if (centavos == null) {
    form.valor_potencial = null
    valorPotencialTexto.value = ''
    return
  }

  form.valor_potencial = Math.min(centavos / 100, VALOR_MAXIMO)
  valorPotencialTexto.value = formatarMoeda(form.valor_potencial)
}

function onValorMencionadoInput(event: Event) {
  const valorDigitado = (event.target as HTMLInputElement).value
  const centavos = extrairCentavos(valorDigitado)

  if (centavos == null) {
    interacaoForm.valor_mencionado = null
    valorMencionadoTexto.value = ''
    return
  }

  interacaoForm.valor_mencionado = Math.min(centavos / 100, VALOR_MAXIMO)
  valorMencionadoTexto.value = formatarMoeda(interacaoForm.valor_mencionado)
}

async function onSubmit() {
  salvando.value = true
  erro.value = null

  const payload = {
    nome: limitarTexto(form.nome, 120),
    empresa: limitarTexto(form.empresa, 120) || null,
    email: limitarEmail(form.email) || null,
    telefone: formatarTelefoneBR(form.telefone) || null,
    origem: limitarTexto(form.origem, 60) || 'site',
    status: form.status,
    prioridade: form.prioridade,
    valor_potencial: form.valor_potencial == null ? null : Math.min(Math.max(form.valor_potencial, 0), VALOR_MAXIMO),
    proximo_followup: form.proximo_followup || null,
    responsavel: limitarTexto(form.responsavel, 80) || null,
    proposta_id: form.proposta_id == null ? null : Number(form.proposta_id),
    observacoes: String(form.observacoes ?? '').trim() || null,
    tags: form.tags_text
      .split(',')
      .map(tag => limitarTexto(tag.trim(), 30))
      .filter(Boolean)
      .slice(0, 10)
  }

  if (props.clienteId) {
    const { error } = await updateCRMCliente(props.clienteId, payload)
    if (error) {
      erro.value = error
      salvando.value = false
      return
    }

    const atualizado: CRMCliente = {
      ...(props.initial as CRMCliente),
      ...payload,
      id: props.clienteId,
      status: payload.status as CRMCliente['status'],
      prioridade: payload.prioridade as CRMCliente['prioridade'],
      tags: payload.tags,
      crm_interacoes: interacoes.value,
      created_at: props.initial?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ultima_interacao_em: props.initial?.ultima_interacao_em || null
    }

    emit('success', atualizado)
    salvando.value = false
    return
  }

  const { data, error } = await createCRMCliente(payload)
  if (error || !data) {
    erro.value = error || 'Não foi possível criar cliente'
    salvando.value = false
    return
  }

  clienteAtualId.value = data.id
  emit('success', data)
  salvando.value = false
}

async function confirmarExclusao() {
  if (!props.clienteId) return
  if (!import.meta.client) return
  const ok = window.confirm('Deseja realmente excluir este cliente e todo o histórico de interações?')
  if (!ok) return

  const { error } = await deleteCRMCliente(props.clienteId)
  if (error) {
    erro.value = error
    return
  }

  emit('deleted')
}

async function adicionarInteracao() {
  if (!clienteAtualId.value) return
  salvandoInteracao.value = true
  erroInteracao.value = null

  const payload: CRMInteracaoInput = {
    cliente_id: clienteAtualId.value,
    tipo: interacaoForm.tipo as CRMInteracaoInput['tipo'],
    resumo: limitarTexto(interacaoForm.resumo, 180),
    detalhes: limitarTexto(interacaoForm.detalhes, 1200) || null,
    data_interacao: interacaoForm.data_interacao ? new Date(interacaoForm.data_interacao).toISOString() : null,
    proxima_acao: interacaoForm.proxima_acao || null,
    valor_mencionado: interacaoForm.valor_mencionado == null
      ? null
      : Math.min(Math.max(interacaoForm.valor_mencionado, 0), VALOR_MAXIMO)
  }

  const { data, error } = await createCRMInteracao(payload)
  if (error || !data) {
    erroInteracao.value = error || 'Não foi possível adicionar interação'
    salvandoInteracao.value = false
    return
  }

  interacoes.value = [data, ...interacoes.value]
  interacaoForm.tipo = 'nota'
  interacaoForm.resumo = ''
  interacaoForm.detalhes = ''
  interacaoForm.data_interacao = ''
  interacaoForm.proxima_acao = ''
  interacaoForm.valor_mencionado = null
  valorMencionadoTexto.value = ''
  proximaAcaoTexto.value = ''

  salvandoInteracao.value = false
}

function formatarData(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(valor))
}

function formatarDataHora(valor: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(valor))
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function tituloTipo(tipo: CRMInteracao['tipo']) {
  switch (tipo) {
    case 'ligacao':
      return 'Ligação'
    case 'whatsapp':
      return 'WhatsApp'
    case 'email':
      return 'E-mail'
    case 'reuniao':
      return 'Reunião'
    case 'proposta':
      return 'Proposta'
    default:
      return 'Nota'
  }
}
</script>
