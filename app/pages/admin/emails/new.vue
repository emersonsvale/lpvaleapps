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
              <option value="sistema">Sistema</option>
              <option value="marketing">Marketing</option>
              <option value="notificacao">Notificação</option>
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
            v-model="template.assunto"
            type="text"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
            placeholder="Ex: Bem-vindo {{ nome }}!"
          />
          <p class="text-xs text-zinc-500">Use <span v-pre>{{ variableName }}</span> para inserir variáveis</p>
        </div>

        <!-- Conteúdo HTML -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
          <label class="block text-xs font-medium text-zinc-400">Conteúdo do Email (HTML)</label>
          <div class="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-950/40 p-2">
            <button
              type="button"
              class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
              @mousedown.prevent
              @click="aplicarNegrito"
            >
              Negrito
            </button>

            <div class="flex items-center gap-2">
              <span class="text-xs text-zinc-400">Peso</span>
              <select
                v-model="pesoTextoSelecionado"
                class="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-brand/50 focus:outline-none"
              >
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
              </select>
              <button
                type="button"
                class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
                @mousedown.prevent
                @click="aplicarPeso"
              >
                Aplicar peso
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-zinc-400">Cor</span>
              <input
                v-model="corTextoSelecionado"
                type="color"
                class="h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-zinc-950"
              />
              <button
                type="button"
                class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
                @mousedown.prevent
                @click="aplicarCor"
              >
                Aplicar cor
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-zinc-400">Tamanho</span>
              <select
                v-model="tamanhoTextoSelecionado"
                class="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-brand/50 focus:outline-none"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
              </select>
              <button
                type="button"
                class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
                @mousedown.prevent
                @click="aplicarTamanho"
              >
                Aplicar tamanho
              </button>
            </div>
          </div>
          <textarea
            ref="conteudoHtmlTextarea"
            v-model="template.conteudo_html"
            class="w-full h-96 rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 font-mono focus:border-brand/50 focus:outline-none resize-none"
            placeholder="<h1>Olá {{ nome }}!</h1>&#10;<p>Bem-vindo ao nosso sistema.</p>"
          />
          <p class="text-xs text-zinc-500">Escreva HTML puro. Use <span v-pre>{{ variableName }}</span> para variáveis.</p>
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
          <label class="block text-xs font-medium text-zinc-400">Testar com Variáveis (JSON)</label>
          <textarea
            v-model="previewVarsText"
            class="w-full h-32 rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 font-mono focus:border-brand/50 focus:outline-none resize-none"
          />
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
  tipo: 'sistema',
  assunto: '',
  conteudo_html: '',
  ativo: true,
})

const variaveisTexto = ref('nome, email, empresa')
const previewVarsText = ref('{\n  "nome": "João Silva",\n  "email": "joao@empresa.com",\n  "empresa": "Empresa Brasil"\n}')
const RESEND_FREE_PLAN_DELAY_MS = 1200
const conteudoHtmlTextarea = ref<HTMLTextAreaElement | null>(null)
const pesoTextoSelecionado = ref('700')
const corTextoSelecionado = ref('#ffc000')
const tamanhoTextoSelecionado = ref('18px')

const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const parsePreviewVars = () => {
  try {
    return JSON.parse(previewVarsText.value || '{}')
  } catch {
    return {}
  }
}

const applyVariables = (texto: string, vars: Record<string, any>) => {
  let result = texto
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, String(value ?? ''))
  })
  return result
}

const escapeHtml = (texto: string) => {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const formatarConteudoPreview = (conteudo: string) => {
  const temHtml = /<\/?[a-z][\s\S]*>/i.test(conteudo)

  if (temHtml) {
    return conteudo
  }

  const textoSeguro = escapeHtml(conteudo)
  const paragrafos = textoSeguro
    .split(/\n{2,}/g)
    .map(paragrafo => paragrafo.trim())
    .filter(paragrafo => paragrafo.length > 0)

  if (paragrafos.length === 0) {
    return '<p></p>'
  }

  return paragrafos
    .map(paragrafo => `<p>${paragrafo.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

const assuntoPreview = computed(() => {
  return applyVariables(template.assunto || 'Assunto do email', parsePreviewVars())
})

const htmlPreview = computed(() => {
  const conteudoInterpolado = applyVariables(template.conteudo_html || '', parsePreviewVars())

  if (!conteudoInterpolado.trim()) {
    return '<p>Conteúdo vazio</p>'
  }

  return formatarConteudoPreview(conteudoInterpolado)
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
  variaveisTexto.value = 'nome, email, empresa'
  previewVarsText.value = '{\n  "nome": "João Silva",\n  "email": "joao@empresa.com",\n  "empresa": "Empresa Brasil"\n}'
}

const aplicarNaSelecao = (abertura: string, fechamento: string) => {
  const textarea = conteudoHtmlTextarea.value
  if (!textarea) return

  const inicio = textarea.selectionStart ?? 0
  const fim = textarea.selectionEnd ?? inicio
  const conteudoAtual = template.conteudo_html || ''
  const temSelecao = fim > inicio
  const textoSelecionado = temSelecao ? conteudoAtual.slice(inicio, fim) : 'texto'

  template.conteudo_html =
    conteudoAtual.slice(0, inicio)
    + abertura
    + textoSelecionado
    + fechamento
    + conteudoAtual.slice(fim)

  nextTick(() => {
    const novaPosicaoInicio = inicio + abertura.length
    const novaPosicaoFim = novaPosicaoInicio + textoSelecionado.length
    textarea.focus()
    textarea.setSelectionRange(novaPosicaoInicio, novaPosicaoFim)
  })
}

const aplicarNegrito = () => {
  aplicarNaSelecao('<strong>', '</strong>')
}

const aplicarPeso = () => {
  aplicarNaSelecao(`<span style="font-weight: ${pesoTextoSelecionado.value};">`, '</span>')
}

const aplicarCor = () => {
  aplicarNaSelecao(`<span style="color: ${corTextoSelecionado.value};">`, '</span>')
}

const aplicarTamanho = () => {
  aplicarNaSelecao(`<span style="font-size: ${tamanhoTextoSelecionado.value};">`, '</span>')
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
        conteudo: template.conteudo_html || '<p>Conteúdo vazio</p>',
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
