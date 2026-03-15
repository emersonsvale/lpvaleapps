<template>
  <div class="flex flex-col h-[calc(100vh-8rem)] max-h-[720px]">
    <div class="flex flex-1 min-h-0 gap-4">
      <!-- Sidebar: conversas do especialista -->
      <aside
        v-if="modo === 'especialista' && agenteId"
        class="w-64 shrink-0 flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/45 overflow-hidden"
      >
        <div class="p-3 border-b border-zinc-800/80 space-y-2">
          <button
            type="button"
            class="w-full rounded-lg bg-brand px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-brand/90 transition-colors"
            :disabled="carregandoConv"
            @click="abrirFormNovaConversa"
          >
            + Nova conversa
          </button>
          <form
            v-if="mostrarFormConversa"
            class="rounded-lg border border-zinc-700 bg-zinc-800/80 p-2 space-y-2"
            @submit.prevent="salvarFormConversa"
          >
            <input
              v-model="formConversaTitulo"
              type="text"
              placeholder="Título"
              class="w-full rounded-lg border border-zinc-600 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
              required
            >
            <textarea
              v-model="formConversaDescricao"
              rows="2"
              placeholder="Descrição (opcional)"
              class="w-full rounded-lg border border-zinc-600 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none resize-none"
            />
            <div class="flex gap-1">
              <button type="submit" class="flex-1 rounded-lg bg-brand px-2 py-1.5 text-xs font-medium text-zinc-900">
                {{ editandoConversaId ? 'Salvar' : 'Criar' }}
              </button>
              <button type="button" class="rounded-lg border border-zinc-600 px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700" @click="fecharFormConversa">
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <ul class="flex-1 overflow-y-auto p-2 min-h-0">
          <li v-for="c in conversasEspecialista" :key="c.id" class="group relative">
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors pr-8"
              :class="conversationIdEspecialista === c.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
              @click="selecionarConversaEspecialista(c.id)"
            >
              <span class="block truncate">{{ c.titulo || 'Sem título' }}</span>
              <span v-if="c.descricao" class="mt-0.5 block truncate text-xs text-zinc-500">{{ c.descricao }}</span>
              <span class="text-xs text-zinc-500">{{ formatarDataConv(c.updated_at) }}</span>
            </button>
            <button
              type="button"
              class="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-zinc-200 transition-opacity"
              aria-label="Editar título e descrição"
              @click.stop="abrirFormEditarConversa(c)"
            >
              <PhPencilSimple class="h-3.5 w-3.5" />
            </button>
          </li>
          <li v-if="!conversasEspecialista.length && !carregandoConv" class="py-4 text-center text-sm text-zinc-500">
            Nenhuma conversa
          </li>
        </ul>
      </aside>

      <section class="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div class="shrink-0 px-5 py-4 border-b border-zinc-800/80 space-y-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-zinc-500">Assistente</p>
            <h1 class="text-xl font-semibold text-zinc-100 mt-1">Chat IA</h1>
            <p class="text-zinc-400 mt-1 text-sm">Converse com ChatGPT/Gemini ou chame um especialista (agente com conhecimento próprio).</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-zinc-500">Usar:</span>
              <select
                v-model="modo"
                class="rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
                aria-label="Modo de chat"
              >
                <option value="geral">Assistente geral</option>
                <option value="especialista">Especialista</option>
              </select>
            </div>
            <template v-if="modo === 'especialista'">
              <select
                v-model="agenteId"
                class="rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer min-w-[200px]"
                aria-label="Escolher especialista"
              >
                <option value="">
                  {{ agentes.length ? 'Selecione um agente...' : 'Carregando...' }}
                </option>
                <option v-for="a in agentes" :key="a.id" :value="a.id">
                  {{ a.nome }} ({{ a.provider === 'chatgpt' ? 'ChatGPT' : 'Gemini' }})
                </option>
              </select>
            </template>
          </div>
        </div>

        <div ref="chatScrollRef" class="flex-1 overflow-y-auto p-5 min-h-0">
          <p v-if="erroCarregarConversa" class="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {{ erroCarregarConversa }}
          </p>
          <div v-if="carregandoMensagens" class="flex items-center justify-center gap-2 py-8 text-zinc-400">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Carregando conversa...
          </div>
          <template v-else>
        <div v-if="!mensagens.length && !carregando" class="text-center py-10">
          <p class="text-zinc-400 leading-relaxed mb-6">Faça uma pergunta ou peça ajuda com texto, código ou ideias.</p>
          <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Sugestões</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="(prompt, idx) in PROMPTS_PREDEFINIDOS"
              :key="idx"
              type="button"
              class="rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-2.5 text-left text-sm text-zinc-200 hover:bg-zinc-700 hover:border-zinc-500 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-zinc-900"
              @click="usarPrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>
        <div v-else :key="conversationIdEspecialista || 'geral'" class="space-y-5">
          <div
            v-for="(msg, i) in mensagens"
            :key="(conversationIdEspecialista || '') + '-' + i"
            class="chat-bubble rounded-xl px-4 py-3 text-[15px] leading-relaxed"
            :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'"
          >
            <p v-if="msg.role === 'user'" class="whitespace-pre-wrap break-words text-zinc-100">{{ msg.content }}</p>
            <template v-else>
              <div
                v-if="msg.content"
                class="chat-prose prose prose-invert prose-sm max-w-none"
                v-html="renderMarkdown(msg.content)"
              />
              <div v-if="msg.imageBase64" class="mt-3 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50">
                <img
                  :src="imageSrc(msg.imageBase64, msg.mimeType)"
                  alt="Imagem gerada"
                  class="max-w-full max-h-80 w-auto h-auto object-contain"
                >
              </div>
            </template>
          </div>
          <div v-if="carregando" class="flex items-center gap-3 text-zinc-400 text-base py-2">
            <span class="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true" />
            <span>{{ carregandoImagem ? 'Gerando imagem...' : 'Pensando...' }}</span>
          </div>
        </div>
          <p v-if="erro" class="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 leading-relaxed">{{ erro }}</p>
          </template>
        </div>

        <footer class="shrink-0 border-t border-zinc-800/80 p-4">
        <div class="flex gap-2 items-center">
          <select
            v-if="modo === 'geral'"
            v-model="provider"
            class="shrink-0 rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2.5 text-sm font-medium text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer disabled:opacity-60"
            :disabled="carregando"
            aria-label="Modelo de IA"
          >
            <option v-for="opt in OPCOES_MODELO" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <textarea
            ref="textareaMensagemRef"
            v-model="mensagem"
            rows="1"
            placeholder="Digite uma mensagem ou descreva uma imagem... (Shift+Enter para nova linha)"
            class="flex-1 min-w-0 rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none min-h-[44px] overflow-y-auto"
            :disabled="carregando"
            aria-label="Mensagem"
            @keydown.enter="onEnterMensagem($event)"
            @input="ajustarAlturaTextarea"
          />
          <button
            type="button"
            class="rounded-xl px-3 py-2.5 text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-brand text-zinc-900 hover:bg-brand/90 shrink-0"
            :disabled="carregando"
            aria-label="Enviar mensagem"
            title="Enviar mensagem"
            @click="enviarMensagem()"
          >
            <PhPaperPlaneTilt class="h-5 w-5" />
          </button>
          <button
            v-if="modo === 'geral'"
            type="button"
            class="rounded-xl px-3 py-2.5 text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600 bg-zinc-800 hover:bg-zinc-700 shrink-0"
            :disabled="carregando"
            aria-label="Gerar imagem"
            title="Gerar imagem a partir da descrição"
            @click="gerarImagem()"
          >
            <PhImage class="h-5 w-5" />
          </button>
        </div>
        <div class="flex justify-end mt-2">
          <button
            v-if="mensagens.length > 0"
            type="button"
            class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            @click="limparConversa()"
          >
            Limpar conversa
          </button>
        </div>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { PhPaperPlaneTilt, PhImage, PhPencilSimple } from '@phosphor-icons/vue'
import type { ProvedorIa } from '~/composables/useProjectAiChat'

definePageMeta({ layout: 'admin' })

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  imageBase64?: string
  mimeType?: string
}

const OPCOES_MODELO: Array<{ value: ProvedorIa; label: string }> = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' }
]

const PROMPTS_PREDEFINIDOS = [
  'Explique em poucas linhas o que é um API REST.',
  'Me ajude a escrever um resumo para reunião.',
  'Sugira boas práticas para documentar um projeto.',
  'Como organizar tarefas em um backlog?'
]

const { sendChat, generateImage } = useProjectAiChat()
const { list } = useAgents()
const { listByAgent, create: createConversation, getWithMessages, updateConversation, sendMessage: sendAgentMessage } = useAgentConversations()

const modo = ref<'geral' | 'especialista'>('geral')
const agenteId = ref('')
const agentes = ref<Array<{ id: string; nome: string; provider: string }>>([])
const conversationIdEspecialista = ref<string | null>(null)
const conversasEspecialista = ref<Array<{ id: string; titulo: string; descricao?: string | null; updated_at: string }>>([])
const mostrarFormConversa = ref(false)
const formConversaTitulo = ref('')
const formConversaDescricao = ref('')
const editandoConversaId = ref<string | null>(null)
const carregandoConv = ref(false)
const carregandoMensagens = ref(false)
const erroCarregarConversa = ref<string | null>(null)

const mensagem = ref('')
const mensagens = ref<ChatMessage[]>([])
const carregando = ref(false)
const carregandoImagem = ref(false)
const erro = ref<string | null>(null)
const provider = ref<ProvedorIa>('gemini')
const chatScrollRef = ref<HTMLElement | null>(null)
const textareaMensagemRef = ref<HTMLTextAreaElement | null>(null)

const route = useRoute()

function ajustarAlturaTextarea() {
  nextTick(() => {
    const el = textareaMensagemRef.value
    if (!el) return
    el.style.height = 'auto'
    const maxPx = typeof window !== 'undefined' ? window.innerHeight * 0.3 : 300
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`
  })
}

onMounted(async () => {
  if (route.query.modo === 'especialista') {
    modo.value = 'especialista'
  }
  if (route.query.agenteId && typeof route.query.agenteId === 'string') {
    agenteId.value = route.query.agenteId
  }
  try {
    agentes.value = await list()
  } catch (e) {
    console.error(e)
  }
})

watch(agenteId, async (id) => {
  conversationIdEspecialista.value = null
  mensagens.value = []
  if (!id) {
    conversasEspecialista.value = []
    return
  }
  carregandoConv.value = true
  try {
    conversasEspecialista.value = await listByAgent(id)
  } catch (e) {
    console.error(e)
    conversasEspecialista.value = []
  } finally {
    carregandoConv.value = false
  }
})

function abrirFormNovaConversa() {
  editandoConversaId.value = null
  formConversaTitulo.value = ''
  formConversaDescricao.value = ''
  mostrarFormConversa.value = true
}

function abrirFormEditarConversa(c: { id: string; titulo: string; descricao?: string | null }) {
  editandoConversaId.value = c.id
  formConversaTitulo.value = c.titulo || ''
  formConversaDescricao.value = c.descricao || ''
  mostrarFormConversa.value = true
}

function fecharFormConversa() {
  mostrarFormConversa.value = false
  editandoConversaId.value = null
}

async function salvarFormConversa() {
  if (!agenteId.value) return
  const titulo = formConversaTitulo.value.trim()
  if (!titulo) return
  if (editandoConversaId.value) {
    try {
      await updateConversation(editandoConversaId.value, {
        titulo,
        descricao: formConversaDescricao.value.trim() || undefined,
      })
      const idx = conversasEspecialista.value.findIndex((x) => x.id === editandoConversaId.value)
      if (idx !== -1) {
        conversasEspecialista.value[idx] = {
          ...conversasEspecialista.value[idx],
          titulo,
          descricao: formConversaDescricao.value.trim() || null,
        }
      }
      fecharFormConversa()
    } catch (e: any) {
      console.error(e)
    }
  } else {
    carregandoConv.value = true
    try {
      const c = await createConversation(agenteId.value, {
        titulo,
        descricao: formConversaDescricao.value.trim() || undefined,
      })
      conversasEspecialista.value = [c, ...conversasEspecialista.value]
      conversationIdEspecialista.value = c.id
      mensagens.value = []
      fecharFormConversa()
    } catch (e: any) {
      console.error(e)
    } finally {
      carregandoConv.value = false
    }
  }
}

function formatarDataConv(s: string) {
  const d = new Date(s)
  const hoje = new Date()
  if (d.toDateString() === hoje.toDateString()) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}


async function selecionarConversaEspecialista(cid: string) {
  conversationIdEspecialista.value = cid
  erroCarregarConversa.value = null
  carregandoMensagens.value = true
  mensagens.value = []
  try {
    const headers = await getAuthHeadersChat()
    const data = await $fetch<{ messages?: Array<{ role: string; content: string; image_base64?: string | null; image_mime_type?: string | null }> }>(
      `/api/conversations/${cid}`,
      { headers }
    )
    const msgs = (data.messages ?? []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content ?? '',
      imageBase64: m.image_base64 ?? undefined,
      mimeType: m.image_mime_type ?? undefined,
    }))
    mensagens.value = msgs
    nextTick(() => scrollToBottom())
  } catch (e: any) {
    console.error(e)
    erroCarregarConversa.value = e?.data?.message ?? e?.message ?? 'Não foi possível carregar a conversa.'
    mensagens.value = []
  } finally {
    carregandoMensagens.value = false
  }
}

async function getAuthHeadersChat(): Promise<Record<string, string>> {
  const supabase = useSupabase()
  if (!supabase) throw new Error('Supabase não está disponível')
  const { data } = await supabase.auth.getSession()
  let token = data.session?.access_token
  if (!token) {
    const { data: refresh } = await supabase.auth.refreshSession()
    token = refresh.session?.access_token
  }
  if (!token) throw new Error('Sessão expirada. Faça login novamente.')
  return { Authorization: `Bearer ${token}` }
}

function imageSrc(base64OrUrl: string, mimeType?: string): string {
  if (base64OrUrl.startsWith('data:') || base64OrUrl.startsWith('http')) return base64OrUrl
  const mime = mimeType || 'image/png'
  return `data:${mime};base64,${base64OrUrl}`
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  try {
    return marked.parse(text, { async: false }) as string
  } catch {
    return text
  }
}

function scrollToBottom() {
  nextTick(() => {
    const el = chatScrollRef.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })
}
watch([mensagens, carregando], scrollToBottom, { deep: true })

function limparConversa() {
  mensagens.value = []
  erro.value = null
  erroCarregarConversa.value = null
  if (modo.value === 'especialista') conversationIdEspecialista.value = null
}

function onEnterMensagem(e: KeyboardEvent) {
  if (e.shiftKey) return
  e.preventDefault()
  enviarMensagem()
}

function usarPrompt(texto: string) {
  if (!texto.trim() || carregando.value) return
  mensagem.value = texto.trim()
  nextTick(() => enviarMensagem())
}

async function enviarMensagem() {
  const texto = mensagem.value.trim()
  if (!texto || carregando.value) return

  const usarEspecialista = modo.value === 'especialista' && agenteId.value
  if (usarEspecialista && !agenteId.value) return

  mensagem.value = ''
  nextTick(ajustarAlturaTextarea)
  erro.value = null
  erroCarregarConversa.value = null
  mensagens.value = [...mensagens.value, { role: 'user', content: texto }]
  carregando.value = true
  carregandoImagem.value = false

  try {
    if (usarEspecialista) {
      const res = await sendAgentMessage(agenteId.value, texto, conversationIdEspecialista.value ?? undefined)
      conversationIdEspecialista.value = res.conversation_id
      try {
        const data = await getWithMessages(res.conversation_id)
        mensagens.value = (data.messages ?? []).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          imageBase64: m.image_base64 ?? undefined,
          mimeType: m.image_mime_type ?? undefined,
        }))
      } catch {
        mensagens.value = [...mensagens.value, { role: 'assistant', content: res.text }]
      }
      try {
        conversasEspecialista.value = await listByAgent(agenteId.value)
      } catch {
        // mantém lista atual
      }
    } else {
      const systemMessage = { role: 'system' as const, content: 'Você é um assistente prestativo. Responda de forma clara e objetiva.' }
      const history = mensagens.value.slice(0, -1).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
      const apiMessages = [systemMessage, ...history, { role: 'user' as const, content: texto }]
      const result = await sendChat(provider.value, apiMessages)
      if (result.error) {
        erro.value = result.error
        mensagens.value = mensagens.value.slice(0, -1)
        return
      }
      if (result.text) {
        mensagens.value = [...mensagens.value, { role: 'assistant', content: result.text }]
      } else {
        erro.value = 'Nenhuma resposta recebida. Tente novamente.'
        mensagens.value = mensagens.value.slice(0, -1)
      }
    }
  } catch (e: any) {
    erro.value = e?.data?.message ?? e?.message ?? 'Erro ao enviar.'
    mensagens.value = mensagens.value.slice(0, -1)
  } finally {
    carregando.value = false
  }
}

async function gerarImagem() {
  const texto = mensagem.value.trim()
  if (!texto || carregando.value) return

  mensagem.value = ''
  erro.value = null
  mensagens.value = [...mensagens.value, { role: 'user', content: texto }]
  carregando.value = true
  carregandoImagem.value = true

  try {
    const result = await generateImage(provider.value, texto)

    if (result.error) {
      erro.value = result.error
      mensagens.value = mensagens.value.slice(0, -1)
      return
    }

    if (result.imageBase64) {
      mensagens.value = [
        ...mensagens.value,
        {
          role: 'assistant',
          content: `Imagem gerada: "${texto}"`,
          imageBase64: result.imageBase64,
          mimeType: result.mimeType,
        },
      ]
    } else {
      erro.value = 'Não foi possível gerar a imagem. Tente novamente.'
      mensagens.value = mensagens.value.slice(0, -1)
    }
  } finally {
    carregando.value = false
    carregandoImagem.value = false
  }
}
</script>

<style scoped>
.chat-bubble-user {
  @apply ml-auto max-w-[85%] bg-brand/20 text-zinc-100 border border-brand/30;
}
.chat-bubble-assistant {
  @apply mr-auto max-w-[85%] bg-zinc-800/80 text-zinc-200 border border-zinc-700/80;
}
.chat-prose :deep(p) { margin: 0 0 0.5em; }
.chat-prose :deep(p:last-child) { margin-bottom: 0; }
.chat-prose :deep(ul), .chat-prose :deep(ol) { margin: 0.5em 0; padding-left: 1.25em; }
.chat-prose :deep(code) { @apply bg-zinc-700/80 rounded px-1.5 py-0.5 text-sm; }
.chat-prose :deep(pre) { @apply rounded-lg p-3 overflow-x-auto text-sm; }
</style>
