<template>
  <div class="flex h-[calc(100vh-8rem)] max-h-[720px] gap-4">
    <aside class="w-64 shrink-0 flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div class="p-3 border-b border-zinc-800 space-y-2">
        <button
          type="button"
          class="w-full rounded-lg bg-brand px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-brand/90 transition-colors"
          @click="abrirFormNova"
        >
          + Nova conversa
        </button>
        <form
          v-if="mostrarFormConv"
          class="rounded-lg border border-zinc-700 bg-zinc-800/80 p-2 space-y-2"
          @submit.prevent="salvarFormConv"
        >
          <input
            v-model="formTitulo"
            type="text"
            placeholder="Título"
            class="w-full rounded-lg border border-zinc-600 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
            required
          >
          <textarea
            v-model="formDescricao"
            rows="2"
            placeholder="Descrição (opcional)"
            class="w-full rounded-lg border border-zinc-600 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none resize-none"
          />
          <div class="flex gap-1">
            <button type="submit" class="flex-1 rounded-lg bg-brand px-2 py-1.5 text-xs font-medium text-zinc-900">
              {{ editandoConvId ? 'Salvar' : 'Criar' }}
            </button>
            <button type="button" class="rounded-lg border border-zinc-600 px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700" @click="fecharFormConv">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <ul class="flex-1 overflow-y-auto p-2">
        <li v-for="c in conversations" :key="c.id" class="group relative">
          <button
            type="button"
            class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors pr-8"
            :class="conversationId === c.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'"
            @click="selecionarConversa(c.id)"
          >
            <span class="block truncate">{{ c.titulo || 'Sem título' }}</span>
            <span v-if="c.descricao" class="mt-0.5 block truncate text-xs text-zinc-500">{{ c.descricao }}</span>
            <span class="text-xs text-zinc-500">{{ formatDate(c.updated_at) }}</span>
          </button>
          <button
            type="button"
            class="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-zinc-200 transition-opacity"
            aria-label="Editar título e descrição"
            @click.stop="abrirFormEditar(c)"
          >
            <PhPencilSimple class="h-3.5 w-3.5" />
          </button>
        </li>
        <li v-if="!conversations.length && !loadingConv" class="py-4 text-center text-sm text-zinc-500">
          Nenhuma conversa
        </li>
      </ul>
    </aside>

    <section class="flex flex-1 min-w-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/45 overflow-hidden">
      <div v-if="!agent" class="flex flex-1 items-center justify-center text-zinc-500">
        Carregando...
      </div>
      <template v-else>
        <div class="shrink-0 border-b border-zinc-800 px-4 py-3">
          <h2 class="font-semibold text-zinc-100">{{ agent.nome }}</h2>
          <p class="text-xs text-zinc-500">Conversa salva automaticamente</p>
        </div>

        <div ref="scrollRef" class="flex-1 overflow-y-auto p-4 min-h-0">
          <div v-if="!conversationId && !messages.length" class="flex h-full flex-col items-center justify-center text-center">
            <p class="text-zinc-400">Escolha uma conversa ou envie uma mensagem para começar.</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="m in messages"
              :key="m.id"
              class="flex"
              :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[85%] rounded-xl px-4 py-3 text-[15px]"
                :class="m.role === 'user' ? 'bg-brand/20 text-zinc-100 border border-brand/30' : 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/80'"
              >
                <template v-if="m.role === 'user'">
                  <p class="whitespace-pre-wrap break-words">{{ m.content }}</p>
                </template>
                <template v-else>
                  <div class="chat-prose prose prose-invert prose-sm max-w-none" v-html="renderMarkdown(m.content)" />
                  <div v-if="m.image_base64" class="mt-3 rounded-lg overflow-hidden">
                    <img
                      :src="imageSrc(m.image_base64, m.image_mime_type)"
                      alt="Imagem"
                      class="max-w-full max-h-60 object-contain"
                    >
                  </div>
                </template>
              </div>
            </div>
            <div v-if="sending" class="flex items-center gap-2 text-zinc-400 text-sm">
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Pensando...
            </div>
          </div>
        </div>

        <footer class="shrink-0 border-t border-zinc-800 p-4">
          <form class="flex gap-2" @submit.prevent="enviar">
            <textarea
              ref="textareaInputRef"
              v-model="input"
              rows="1"
              placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
              class="flex-1 min-w-0 rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-60 resize-none min-h-[44px] overflow-y-auto"
              :disabled="sending"
              @keydown.enter="onEnterInput($event)"
              @input="ajustarAlturaTextarea"
            />
            <button
              type="submit"
              :disabled="!input.trim() || sending"
              class="rounded-xl bg-brand px-4 py-2.5 text-zinc-900 hover:bg-brand/90 disabled:opacity-50 transition-colors"
            >
              Enviar
            </button>
          </form>
          <p v-if="erro" class="mt-2 text-sm text-red-400">{{ erro }}</p>
        </footer>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { PhPencilSimple } from '@phosphor-icons/vue'
import type { AiAgent, AiConversation, AiMessage } from '~/types/ai-agents'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const { get } = useAgents()
const { listByAgent, create, getWithMessages, updateConversation, sendMessage } = useAgentConversations()

const agent = ref<AiAgent | null>(null)
const conversations = ref<AiConversation[]>([])
const conversationId = ref<string | null>(null)
const messages = ref<AiMessage[]>([])
const input = ref('')
const sending = ref(false)
const loadingConv = ref(true)
const erro = ref<string | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const textareaInputRef = ref<HTMLTextAreaElement | null>(null)
const mostrarFormConv = ref(false)
const formTitulo = ref('')
const formDescricao = ref('')
const editandoConvId = ref<string | null>(null)

function ajustarAlturaTextarea() {
  nextTick(() => {
    const el = textareaInputRef.value
    if (!el) return
    el.style.height = 'auto'
    const maxPx = typeof window !== 'undefined' ? window.innerHeight * 0.3 : 300
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`
  })
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  try {
    return marked.parse(text, { async: false }) as string
  } catch {
    return text
  }
}

function imageSrc(base64OrUrl: string, mime?: string | null): string {
  if (base64OrUrl.startsWith('data:') || base64OrUrl.startsWith('http')) return base64OrUrl
  return `data:${mime || 'image/png'};base64,${base64OrUrl}`
}

function formatDate(s: string) {
  const d = new Date(s)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

async function carregarAgent() {
  if (!id.value) return
  agent.value = await get(id.value)
}

async function carregarConversas() {
  if (!id.value) return
  loadingConv.value = true
  try {
    conversations.value = await listByAgent(id.value)
  } finally {
    loadingConv.value = false
  }
}

async function selecionarConversa(cid: string) {
  conversationId.value = cid
  const data = await getWithMessages(cid)
  messages.value = data.messages ?? []
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    scrollRef.value?.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
  })
}

function abrirFormNova() {
  editandoConvId.value = null
  formTitulo.value = ''
  formDescricao.value = ''
  mostrarFormConv.value = true
}

function abrirFormEditar(c: AiConversation) {
  editandoConvId.value = c.id
  formTitulo.value = c.titulo || ''
  formDescricao.value = c.descricao || ''
  mostrarFormConv.value = true
}

function fecharFormConv() {
  mostrarFormConv.value = false
  editandoConvId.value = null
}

async function salvarFormConv() {
  if (!id.value) return
  const titulo = formTitulo.value.trim()
  if (!titulo) return
  if (editandoConvId.value) {
    try {
      await updateConversation(editandoConvId.value, { titulo, descricao: formDescricao.value.trim() || undefined })
      const idx = conversations.value.findIndex((x) => x.id === editandoConvId.value)
      if (idx !== -1) {
        conversations.value[idx] = { ...conversations.value[idx], titulo, descricao: formDescricao.value.trim() || null }
      }
      fecharFormConv()
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      const c = await create(id.value, { titulo, descricao: formDescricao.value.trim() || undefined })
      conversations.value = [c, ...conversations.value]
      conversationId.value = c.id
      messages.value = []
      fecharFormConv()
    } catch (e) {
      console.error(e)
    }
  }
}

function onEnterInput(e: KeyboardEvent) {
  if (e.shiftKey) return
  e.preventDefault()
  enviar()
}

async function enviar() {
  const texto = input.value.trim()
  if (!texto || !id.value || sending.value) return

  input.value = ''
  nextTick(ajustarAlturaTextarea)
  erro.value = null
  sending.value = true

  const userMsg: AiMessage = {
    id: `temp-${Date.now()}`,
    conversation_id: conversationId.value || '',
    role: 'user',
    content: texto,
    image_base64: null,
    image_mime_type: null,
    created_at: new Date().toISOString(),
  }
  messages.value = [...messages.value, userMsg]
  scrollToBottom()

  try {
    const res = await sendMessage(id.value, texto, conversationId.value ?? undefined)
    conversationId.value = res.conversation_id
    if (!conversations.value.some((c) => c.id === res.conversation_id)) {
      const list = await listByAgent(id.value)
      conversations.value = list
    }
    messages.value = [...messages.value, {
      id: `assistant-${Date.now()}`,
      conversation_id: res.conversation_id,
      role: 'assistant',
      content: res.text,
      image_base64: null,
      image_mime_type: null,
      created_at: new Date().toISOString(),
    }]
    scrollToBottom()
  } catch (e: any) {
    erro.value = e?.data?.message || e?.message || 'Erro ao enviar.'
    messages.value = messages.value.filter((m) => m.id !== userMsg.id)
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  await carregarAgent()
  await carregarConversas()
})
</script>

<style scoped>
.chat-prose :deep(p) { margin: 0 0 0.5em; }
.chat-prose :deep(p:last-child) { margin-bottom: 0; }
.chat-prose :deep(code) { @apply bg-zinc-700/80 rounded px-1.5 py-0.5 text-sm; }
.chat-prose :deep(pre) { @apply rounded-lg p-3 overflow-x-auto text-sm; }
</style>
