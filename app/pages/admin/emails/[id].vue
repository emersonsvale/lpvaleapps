<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Templates de Email</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Editar template</h1>
        <p class="text-sm text-zinc-500 mt-2">Atualize conteúdo, assunto e variáveis com preview em tempo real.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          @click="voltar"
        >
          Voltar
        </button>
        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand/90 disabled:bg-zinc-700"
          :disabled="salvando"
          @click="salvarTemplate"
        >
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="rounded-lg border border-red-900/40 bg-red-900/20 p-4 text-sm text-red-200">
      {{ erro }}
    </div>

    <!-- Sucesso -->
    <div v-if="sucesso" class="rounded-lg border border-green-900/40 bg-green-900/20 p-4 text-sm text-green-200">
      Template salvo com sucesso!
    </div>

    <!-- Carregando -->
    <div v-if="carregando" class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-500">
      Carregando template...
    </div>

    <!-- Conteúdo -->
    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          <textarea
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
            class="w-full rounded-lg bg-white"
            style="height: 400px; border: 1px solid #3f3f46;"
            sandbox="allow-same-origin"
            title="Email preview"
          />
        </div>

        <!-- Envio de teste -->
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <p class="text-xs font-medium text-zinc-400">Enviar Email de Teste</p>

          <div v-if="erroEnvio" class="rounded-lg border border-red-900/40 bg-red-900/20 p-3 text-xs text-red-200">
            {{ erroEnvio }}
          </div>

          <div v-if="sucessoEnvio" class="rounded-lg border border-green-900/40 bg-green-900/20 p-3 text-xs text-green-200">
            {{ sucessoEnvio }}
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-2">Email destinatário</label>
            <input
              v-model="emailTeste"
              type="email"
              class="w-full rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
              placeholder="teste@exemplo.com"
            />
          </div>

          <button
            type="button"
            class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand/90 disabled:bg-zinc-700"
            :disabled="enviandoTeste"
            @click="enviarEmailTeste"
          >
            {{ enviandoTeste ? 'Enviando...' : 'Enviar Teste Agora' }}
          </button>
        </div>

        <!-- Info de envio -->
        <div class="rounded-xl border border-brand/30 bg-brand/10 p-4 space-y-2">
          <p class="text-xs font-medium text-brand">Próximos passos</p>
          <ul class="text-xs text-zinc-300 space-y-1 list-disc list-inside">
            <li>Salve o template</li>
            <li>Acesse a página de testes para enviar email de teste</li>
            <li>Use o template em propostas ou fluxos de CRM</li>
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
  title: 'Editar Template - Vale Apps Admin',
})

const route = useRoute()
const emails = useEmail()
const salvando = ref(false)
const carregando = ref(true)
const erro = ref<string | null>(null)
const sucesso = ref(false)
const enviandoTeste = ref(false)
const emailTeste = ref('')
const erroEnvio = ref<string | null>(null)
const sucessoEnvio = ref<string | null>(null)

const template = reactive({
  id: null as string | null,
  nome: '',
  slug: '',
  tipo: 'sistema',
  assunto: '',
  conteudo_html: '',
  ativo: true,
})

const variaveisTexto = ref('')
const previewVarsText = ref('{\n  "nome": "João",\n  "email": "cliente@exemplo.com"\n}')

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

const assuntoPreview = computed(() => {
  return applyVariables(template.assunto || 'Assunto do email', parsePreviewVars())
})

const htmlPreview = computed(() => {
  return applyVariables(template.conteudo_html || '<p>Conteúdo vazio</p>', parsePreviewVars())
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

const carregarTemplate = async () => {
  carregando.value = true
  erro.value = null
  sucesso.value = false

  try {
    const id = String(route.params.id)
    const lista = await emails.getTemplates()
    const encontrado = lista.find(item => String(item.id) === id)

    if (!encontrado) {
      throw new Error('Template não encontrado')
    }

    template.id = encontrado.id
    template.nome = encontrado.nome
    template.slug = encontrado.slug
    template.tipo = encontrado.tipo
    template.assunto = encontrado.assunto
    template.conteudo_html = encontrado.conteudo_html || ''
    template.ativo = encontrado.ativo

    variaveisTexto.value = (encontrado.variaveis_suportadas || []).join(', ')
  } catch (e: any) {
    erro.value = e.message || 'Erro ao carregar template'
  } finally {
    carregando.value = false
  }
}

const salvarTemplate = async () => {
  salvando.value = true
  erro.value = null
  sucesso.value = false

  try {
    const variaveis = variaveisTexto.value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)

    const resultado = await emails.saveTemplate({
      id: template.id,
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

    sucesso.value = true
    setTimeout(() => {
      navigateTo('/admin/emails')
    }, 1500)
  } catch (e: any) {
    erro.value = e.message || 'Erro ao salvar template'
  } finally {
    salvando.value = false
  }
}

const voltar = () => {
  navigateTo('/admin/emails')
}

const enviarEmailTeste = async () => {
  erroEnvio.value = null
  sucessoEnvio.value = null

  if (!emailTeste.value.trim()) {
    erroEnvio.value = 'Informe um email para envio de teste'
    return
  }

  enviandoTeste.value = true

  try {
    const resultado = await emails.sendEmail({
      para: emailTeste.value.trim(),
      assunto: template.assunto || 'Sem assunto',
      conteudo: template.conteudo_html || '<p>Conteúdo vazio</p>',
      variaveis: parsePreviewVars(),
      metadados: {
        origem: 'admin-emails-edit',
        templateId: template.id,
      },
    })

    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro ao enviar email de teste')
    }

    sucessoEnvio.value = 'Email de teste enviado com sucesso'
  } catch (e: any) {
    erroEnvio.value = e.message || 'Erro ao enviar email de teste'
  } finally {
    enviandoTeste.value = false
  }
}

onMounted(carregarTemplate)
</script>
