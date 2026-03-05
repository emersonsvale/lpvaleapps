<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Templates de Email</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Novo template</h1>
        <p class="text-sm text-zinc-500 mt-2">Crie e valide templates de email com preview e envio de teste.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink
          to="/admin/emails"
          class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
        >
          Voltar para listagem
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          @click="resetarTemplate"
        >
          Limpar
        </button>
        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand/90 disabled:bg-zinc-700"
          :disabled="salvando"
          @click="salvarTemplate"
        >
          {{ salvando ? 'Salvando...' : 'Salvar Template' }}
        </button>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="rounded-lg border border-red-900/40 bg-red-900/20 p-4 text-sm text-red-200">
      {{ erro }}
    </div>

    <!-- Conteúdo -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Painel esquerdo: Editor -->
      <div class="space-y-6">
        <!-- Informações básicas -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-2">Nome do Template</label>
            <input
              v-model="template.nome"
              type="text"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
              placeholder="Ex: Boas-vindas"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-2">Slug</label>
            <input
              v-model="template.slug"
              type="text"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
              placeholder="Ex: boas-vindas"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-2">Tipo</label>
            <select
              v-model="template.tipo"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
            >
              <option value="boas_vindas">Boas-vindas</option>
              <option value="proposta">Proposta</option>
              <option value="leads">Leads</option>
              <option value="newsletter">Newsletter</option>
              <option value="admin">Admin</option>
              <option value="relatorio">Relatório</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="template.ativo"
              type="checkbox"
              id="ativo"
              class="rounded border-zinc-700 bg-zinc-950/40"
            />
            <label for="ativo" class="text-sm text-zinc-300">Ativo</label>
          </div>
        </div>

        <!-- Assunto -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <label class="block text-xs font-medium text-zinc-400">Assunto do Email</label>
          <input
            ref="assuntoInputRef"
            v-model="template.assunto"
            type="text"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
            placeholder="Ex: Bem-vindo {{ nome }}!"
          />
          <p class="text-xs text-zinc-500">Use <span v-pre>{{ variableName }}</span> para inserir variáveis</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="variavel in variaveisSugestao"
              :key="`assunto-var-${variavel}`"
              type="button"
              class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
              @click="inserirVariavelNoAssunto(variavel)"
            >
              {{ formatarTokenVariavel(variavel) }}
            </button>
          </div>
        </div>

        <!-- Conteúdo do Email -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <label class="block text-xs font-medium text-zinc-400">Conteúdo do Email</label>
          <AdminEmailRichTextEditor v-model="template.conteudo_html" :available-variables="variaveisSugestao" />
          <p class="text-xs text-zinc-500">Digite normalmente e use <span v-pre>{{ variableName }}</span> para variáveis dinâmicas.</p>
        </div>

        <!-- Variáveis -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <label class="block text-xs font-medium text-zinc-400">Variáveis Suportadas</label>
          <input
            v-model="variaveisTexto"
            type="text"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
            placeholder="nome, email, empresa"
          />
          <p class="text-xs text-zinc-500">Separadas por vírgula</p>
        </div>
      </div>

      <!-- Painel direito: Preview -->
      <div class="space-y-6">
        <!-- Teste com variáveis -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <label class="block text-xs font-medium text-zinc-400">Testar com Variáveis</label>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs text-zinc-400">Nome</label>
              <input
                v-model="previewVars.nome"
                type="text"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
                placeholder="Nome"
              >
            </div>
            <div>
              <label class="mb-1 block text-xs text-zinc-400">E-mail</label>
              <input
                v-model="previewVars.email"
                type="email"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
                placeholder="E-mail"
              >
            </div>
            <div>
              <label class="mb-1 block text-xs text-zinc-400">Empresa</label>
              <input
                v-model="previewVars.empresa"
                type="text"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
                placeholder="Empresa"
              >
            </div>
            <div>
              <label class="mb-1 block text-xs text-zinc-400">Contato</label>
              <input
                v-model="previewVars.contato"
                type="text"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
                placeholder="Contato"
              >
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs text-zinc-400">Responsável</label>
              <input
                v-model="previewVars.responsavel"
                type="text"
                class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
                placeholder="Responsável"
              >
            </div>
          </div>
        </div>

        <!-- Preview do assunto -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <p class="text-xs font-medium text-zinc-400">Prévia do Assunto</p>
          <div class="rounded-lg bg-zinc-950/40 border border-zinc-700/50 p-3">
            <p class="text-sm text-zinc-300">{{ assuntoPreview }}</p>
          </div>
        </div>

        <!-- Preview do email -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <p class="text-xs font-medium text-zinc-400">Prévia do Email</p>
          <iframe
            :srcdoc="iframeSrcdoc"
            class="w-full rounded-lg bg-white border border-zinc-700/50"
            style="height: 400px; border: 1px solid #3f3f46;"
            sandbox="allow-same-origin"
            title="Email preview"
          />
        </div>

        <!-- Envio em lote -->
        <div id="envio-teste" class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <p class="text-xs font-medium text-zinc-400">Enviar E-mails</p>

          <div v-if="erroEnvio" class="rounded-lg border border-red-900/40 bg-red-900/20 p-3 text-xs text-red-200">
            {{ erroEnvio }}
          </div>

          <div v-if="sucessoEnvio" class="rounded-lg border border-green-900/40 bg-green-900/20 p-3 text-xs text-green-200">
            {{ sucessoEnvio }}
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-2">Lista de destinatários</label>
            <textarea
              v-model="listaEmailsTexto"
              rows="5"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
              placeholder="contato1@empresa.com&#10;contato2@empresa.com"
            />
            <p class="mt-2 text-xs text-zinc-500">Separe por linha, vírgula ou ponto e vírgula.</p>
          </div>

          <button
            type="button"
            class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand/90 disabled:bg-zinc-700"
            :disabled="enviandoTeste"
            @click="enviarEmails"
          >
            {{ enviandoTeste ? 'Enviando...' : 'Enviar E-mails Agora' }}
          </button>
        </div>

        <!-- Info de envio -->
        <div class="rounded-xl border border-brand/30 bg-brand/10 p-4 space-y-2">
          <p class="text-xs font-medium text-brand">Próximos passos</p>
          <ul class="text-xs text-zinc-300 space-y-1 list-disc list-inside">
            <li>Preencha os campos do formulário</li>
            <li>Visualize o preview em tempo real</li>
            <li>Salve o template para disponibilizar no CRM</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { applyTemplateVariables, renderEmailContent } from '~/utils/emailContentFormatter'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Novo Template - Vale Apps Admin',
})

const emails = useEmail()
const salvando = ref(false)
const erro = ref<string | null>(null)
const enviandoTeste = ref(false)
const listaEmailsTexto = ref('')
const erroEnvio = ref<string | null>(null)
const sucessoEnvio = ref<string | null>(null)

const template = reactive({
  nome: '',
  slug: '',
  tipo: 'boas_vindas',
  assunto: '',
  conteudo_html: '',
  ativo: true,
})

const variaveisTexto = ref('nome, email, empresa, contato, responsavel')
const assuntoInputRef = ref<HTMLInputElement | null>(null)
const previewVars = reactive({
  nome: 'João Silva',
  email: 'joao@empresa.com',
  empresa: 'Empresa Brasil',
  contato: '(11) 99999-0000',
  responsavel: 'Emerson',
})
const RESEND_FREE_PLAN_DELAY_MS = 1200

const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const variaveisSugestao = computed(() => {
  const lista = variaveisTexto.value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)

  if (lista.length > 0) return lista
  return ['nome', 'email', 'empresa', 'contato', 'responsavel']
})

const inserirVariavelNoAssunto = (variavel: string) => {
  const token = `{{ ${variavel} }}`
  const input = assuntoInputRef.value

  if (!input) {
    const separador = template.assunto && !template.assunto.endsWith(' ') ? ' ' : ''
    template.assunto = `${template.assunto}${separador}${token}`
    return
  }

  const inicio = input.selectionStart ?? template.assunto.length
  const fim = input.selectionEnd ?? inicio

  template.assunto = template.assunto.slice(0, inicio) + token + template.assunto.slice(fim)

  nextTick(() => {
    input.focus()
    const cursor = inicio + token.length
    input.setSelectionRange(cursor, cursor)
  })
}

const formatarTokenVariavel = (variavel: string) => `{{ ${variavel} }}`

const parsePreviewVars = () => ({
  nome: previewVars.nome,
  email: previewVars.email,
  empresa: previewVars.empresa,
  contato: previewVars.contato,
  responsavel: previewVars.responsavel,
})

const assuntoPreview = computed(() => {
  return applyTemplateVariables(template.assunto || 'Assunto do email', parsePreviewVars())
})

const htmlPreview = computed(() => {
  return renderEmailContent(template.conteudo_html || '', parsePreviewVars())
})

const iframeSrcdoc = computed(() => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${htmlPreview.value}
        </body>
      </html>
    `
})

const resetarTemplate = () => {
  template.nome = ''
  template.slug = ''
  template.tipo = 'sistema'
  template.assunto = ''
  template.conteudo_html = ''
  template.ativo = true
  template.tipo = 'boas_vindas'
  variaveisTexto.value = 'nome, email, empresa, contato, responsavel'
  previewVars.nome = 'João Silva'
  previewVars.email = 'joao@empresa.com'
  previewVars.empresa = 'Empresa Brasil'
  previewVars.contato = '(11) 99999-0000'
  previewVars.responsavel = 'Emerson'
}

const salvarTemplate = async () => {
  salvando.value = true
  erro.value = null

  try {
    const variaveis = variaveisTexto.value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)

    const resultado = await emails.saveTemplate({
      nome: template.nome,
      slug: template.slug,
      tipo: template.tipo,
      assunto: template.assunto,
      conteudo_html: template.conteudo_html,
      variaveis_suportadas: variaveis,
      ativo: template.ativo,
    })

    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro ao salvar template')
    }

    await navigateTo('/admin/emails')
  } catch (e: any) {
    erro.value = e.message || 'Erro ao salvar template'
  } finally {
    salvando.value = false
  }
}

const parseDestinatarios = () => {
  return listaEmailsTexto.value
    .split(/[\n,;]+/g)
    .map(email => email.trim())
    .filter(email => email.length > 0)
}

const enviarEmails = async () => {
  erroEnvio.value = null
  sucessoEnvio.value = null

  const destinatarios = parseDestinatarios()

  if (destinatarios.length === 0) {
    erroEnvio.value = 'Informe ao menos um email para envio'
    return
  }

  enviandoTeste.value = true

  try {
    let enviados = 0
    const falhas: Array<{ email: string; motivo: string }> = []
    const variaveis = parsePreviewVars()

    for (const [index, destinatario] of destinatarios.entries()) {

      const resultado = await emails.sendEmail({
        para: destinatario,
        assunto: template.assunto || 'Sem assunto',
        conteudo: renderEmailContent(template.conteudo_html || '', variaveis),
        variaveis,
        metadados: {
          origem: 'admin-emails-new',
        },
      })

      if (resultado.sucesso) {
        enviados += 1
      } else {
        falhas.push({
          email: destinatario,
          motivo: resultado.erro || 'Falha no envio',
        })
      }

      if (index < destinatarios.length - 1) {
        await esperar(RESEND_FREE_PLAN_DELAY_MS)
      }
    }

    if (enviados === 0) {
      const detalhes = falhas
        .slice(0, 3)
        .map(falha => `${falha.email}: ${falha.motivo}`)
        .join(' | ')

      throw new Error(`Nenhum e-mail foi enviado. ${detalhes}`)
    }

    if (falhas.length > 0) {
      const emailsFalha = falhas.map(f => f.email).join(', ')
      sucessoEnvio.value = `Enviados: ${enviados}. Falhas: ${falhas.length} (${emailsFalha})`
    } else {
      sucessoEnvio.value = `Todos os ${enviados} e-mails foram enviados com sucesso`
    }
  } catch (e: any) {
    erroEnvio.value = e.message || 'Erro ao enviar e-mails'
  } finally {
    enviandoTeste.value = false
  }
}
</script>
