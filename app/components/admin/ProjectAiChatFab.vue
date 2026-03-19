<template>
  <div class="project-ai-chat-fab">
    <!-- Painel do chat (card flutuante) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <aside
        v-if="aberto"
        ref="asideRef"
        class="fixed z-[4900] flex flex-col rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden"
        :class="posLeft == null ? 'bottom-24 right-6' : ''"
        aria-label="Chat de IA do projeto"
        :style="painelStyle"
      >
        <header class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
          <div
            class="flex items-center gap-2 min-w-0 cursor-move select-none rounded-lg py-1 pr-2 -ml-1 hover:bg-zinc-800/50 transition-colors"
            title="Arraste para mover o chat"
            @mousedown.prevent="iniciarDrag"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 pointer-events-none">
              <PhRobot class="h-5 w-5 text-brand" />
            </div>
            <h2 class="text-base font-semibold text-zinc-100 truncate pointer-events-none">Chat IA</h2>
          </div>
          <div class="flex items-center gap-2">
            <select
              v-model="provider"
              class="rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer disabled:opacity-60"
              :disabled="carregando"
              aria-label="Modelo de IA"
            >
              <option v-for="opt in OPCOES_MODELO" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <div class="flex items-center gap-1">
              <button
                v-if="mensagens.length > 0"
                type="button"
                class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                aria-label="Limpar conversa"
                title="Limpar conversa"
                @click="limparConversa()"
              >
                <PhTrash class="h-5 w-5" />
              </button>
              <button
                type="button"
                class="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                aria-label="Fechar chat"
                @click="aberto = false"
              >
                <PhX class="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div ref="chatScrollRef" class="flex-1 overflow-y-auto p-4 min-h-0 chat-scroll">
          <div v-if="!mensagens.length && !carregando" class="text-center py-6">
            <p v-if="projetoId" class="text-sm text-zinc-500 mb-2">Projeto atual: <strong class="text-zinc-300">{{ projetoNome || `ID ${projetoId}` }}</strong></p>
            <p class="text-base text-zinc-400 leading-relaxed mb-5">Pergunte sobre o Vale Apps. O agente usa dados do sistema (SQL + busca vetorial) para responder.</p>
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
          <div v-else class="space-y-5">
            <div
              v-for="(msg, i) in mensagens"
              :key="i"
              class="chat-bubble rounded-xl px-4 py-3 text-[15px] leading-relaxed"
              :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'"
            >
              <p v-if="msg.role === 'user'" class="whitespace-pre-wrap break-words text-zinc-100">{{ msg.content }}</p>
              <div
                v-else
                class="chat-prose"
                v-html="renderMarkdown(msg.content)"
              />
            </div>
            <div v-if="carregando" class="flex items-center gap-3 text-zinc-400 text-base py-2">
              <span class="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden="true" />
              <span>Pensando... (pode levar alguns segundos)</span>
            </div>
          </div>

          <p v-if="erro" class="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-base text-red-400 leading-relaxed">{{ erro }}</p>
        </div>

        <footer class="shrink-0 border-t border-zinc-800 p-3">
          <div class="flex gap-2 items-center">
            <textarea
              ref="textareaMensagemRef"
              v-model="mensagem"
              rows="1"
              placeholder="Digite sua pergunta... (Shift+Enter para nova linha)"
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
              aria-label="Enviar"
              @click="enviarMensagem()"
            >
              <PhPaperPlaneTilt class="h-5 w-5" />
            </button>
          </div>
        </footer>

        <!-- Alça para redimensionar -->
        <div
          ref="resizeHandleRef"
          class="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800/80 rounded-tl-lg"
          aria-label="Redimensionar chat"
          title="Arraste para redimensionar"
          @mousedown.prevent="iniciarResize"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12L6 6v4H2v4h4v4l6-6zm0 0l6-6v4h4v4h-4v4l-6-6z" />
          </svg>
        </div>
      </aside>
    </Transition>

    <!-- Botão flutuante (junto ao painel quando ele foi movido) -->
    <button
      type="button"
      class="fixed z-[4800] flex h-14 w-14 items-center justify-center rounded-full bg-brand text-zinc-900 shadow-lg transition-transform hover:scale-105 hover:shadow-brand/25 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-zinc-900"
      :class="posLeft == null ? 'bottom-6 right-6' : ''"
      :style="fabStyle"
      aria-label="Abrir chat de IA"
      @click="aberto = !aberto"
    >
      <PhRobot class="h-7 w-7" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { PhRobot, PhX, PhPaperPlaneTilt, PhTrash } from '@phosphor-icons/vue'
import { useChatProjeto, type AgenteProvider } from '~/composables/useChatProjeto'

const OPCOES_MODELO: Array<{ value: AgenteProvider; label: string }> = [
  { value: 'chatgpt', label: 'ChatGPT (gpt-4o)' },
  { value: 'gemini', label: 'Gemini' }
]

const PROMPTS_PREDEFINIDOS = [
  'Resuma tudo sobre este projeto.',
  'Como está o consumo de horas e orçamento?',
  'Quem fez quais tarefas?',
  'Quais tarefas estão pendentes ou em progresso?',
  'Mostre a documentação do projeto.',
  'Quais são os requisitos e releases?',
]

const props = withDefaults(
  defineProps<{
    projetoId?: number | null
    projetoNome?: string | null
  }>(),
  { projetoId: null, projetoNome: null }
)

const route = useRoute()
const { enviarMensagem: enviarParaEdgeFunction } = useChatProjeto()

const aberto = ref(false)
const mensagem = ref('')
const mensagens = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const carregando = ref(false)
const erro = ref<string | null>(null)
const provider = ref<AgenteProvider>('chatgpt')

// Tamanho redimensionável do painel (largura em px, altura em vh)
const CHAT_MIN_W = 320
const CHAT_MAX_W = 900
const CHAT_MIN_H_VH = 40
const CHAT_MAX_H_VH = 90
const chatWidth = ref(448)
const chatHeightVh = ref(75)
const resizeHandleRef = ref<HTMLElement | null>(null)

// Posição ao arrastar (null = posição padrão bottom-right)
const asideRef = ref<HTMLElement | null>(null)
const posLeft = ref<number | null>(null)
const posTop = ref<number | null>(null)

const painelStyle = computed(() => {
  const base: Record<string, string> = {
    width: `${chatWidth.value}px`,
    height: `${chatHeightVh.value}vh`,
    maxWidth: 'calc(100vw - 3rem)',
    minWidth: `${CHAT_MIN_W}px`,
    maxHeight: '90vh',
    minHeight: `${CHAT_MIN_H_VH}vh`
  }
  if (posLeft.value != null && posTop.value != null) {
    base.left = `${posLeft.value}px`
    base.top = `${posTop.value}px`
    base.bottom = 'auto'
    base.right = 'auto'
  }
  return base
})

const FAB_SIZE = 56
const FAB_GAP = 8

const fabStyle = computed(() => {
  if (posLeft.value == null || posTop.value == null) return {}
  const winH = typeof window !== 'undefined' ? window.innerHeight : 600
  const panelHeightPx = (chatHeightVh.value / 100) * winH
  return {
    left: `${posLeft.value + chatWidth.value - FAB_SIZE}px`,
    top: `${posTop.value + panelHeightPx + FAB_GAP}px`,
    bottom: 'auto',
    right: 'auto'
  }
})

function iniciarDrag(e: MouseEvent) {
  const el = asideRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const startX = e.clientX
  const startY = e.clientY
  const startLeft = posLeft.value ?? rect.left
  const startTop = posTop.value ?? rect.top
  if (posLeft.value == null || posTop.value == null) {
    posLeft.value = rect.left
    posTop.value = rect.top
  }

  const heightPx = (chatHeightVh.value / 100) * window.innerHeight

  function onMove(moveEvent: MouseEvent) {
    let newLeft = startLeft + (moveEvent.clientX - startX)
    let newTop = startTop + (moveEvent.clientY - startY)
    const minLeft = -chatWidth.value + 80
    const maxLeft = window.innerWidth - 80
    const minTop = -heightPx + 80
    const maxTop = window.innerHeight - 80
    newLeft = Math.min(maxLeft, Math.max(minLeft, newLeft))
    newTop = Math.min(maxTop, Math.max(minTop, newTop))
    posLeft.value = newLeft
    posTop.value = newTop
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'move'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function iniciarResize(e: MouseEvent) {
  const startX = e.clientX
  const startY = e.clientY
  const startW = chatWidth.value
  const startVh = chatHeightVh.value
  const startHpx = (startVh / 100) * window.innerHeight

  function onMove(moveEvent: MouseEvent) {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY
    const newW = Math.min(CHAT_MAX_W, Math.max(CHAT_MIN_W, startW + dx))
    const newHpx = Math.min((CHAT_MAX_H_VH / 100) * window.innerHeight, Math.max((CHAT_MIN_H_VH / 100) * window.innerHeight, startHpx + dy))
    const newVh = (newHpx / window.innerHeight) * 100
    chatWidth.value = newW
    chatHeightVh.value = Math.min(CHAT_MAX_H_VH, Math.max(CHAT_MIN_H_VH, newVh))
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'se-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/** ID do projeto: prop tem prioridade; senão tira da URL (/admin/projetos/:id). */
const projetoId = computed(() => {
  const fromProp = props.projetoId
  if (fromProp != null && fromProp !== undefined) {
    const n = Number(fromProp)
    if (Number.isFinite(n) && n >= 1) return n
  }
  const pathId = route.params.id
  if (pathId != null && pathId !== undefined) {
    const n = Number(pathId)
    if (Number.isFinite(n) && n >= 1) return n
  }
  return null
})

const projetoNome = computed(() => (props.projetoNome ?? '').trim() || null)

function limparErro() {
  erro.value = null
}

function limparConversa() {
  mensagens.value = []
  limparErro()
}

const chatScrollRef = ref<HTMLElement | null>(null)
const textareaMensagemRef = ref<HTMLTextAreaElement | null>(null)

function ajustarAlturaTextarea() {
  nextTick(() => {
    const el = textareaMensagemRef.value
    if (!el) return
    el.style.height = 'auto'
    const maxPx = typeof window !== 'undefined' ? window.innerHeight * 0.3 : 300
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`
  })
}
function scrollToBottom() {
  nextTick(() => {
    const el = chatScrollRef.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })
}
watch([mensagens, carregando], scrollToBottom, { deep: true })

function usarPrompt(texto: string) {
  if (!texto.trim() || carregando.value) return
  mensagem.value = texto.trim()
  nextTick(() => enviarMensagem())
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  try {
    return marked.parse(text, { async: false }) as string
  } catch {
    return text
  }
}

function onEnterMensagem(e: KeyboardEvent) {
  if (e.shiftKey) return
  e.preventDefault()
  enviarMensagem()
}

async function enviarMensagem() {
  const texto = mensagem.value.trim()
  if (!texto || carregando.value) return

  mensagem.value = ''
  nextTick(ajustarAlturaTextarea)
  limparErro()
  mensagens.value = [...mensagens.value, { role: 'user' as const, content: texto }]
  carregando.value = true

  try {
    const historico = mensagens.value.slice(0, -1)
    const result = await enviarParaEdgeFunction(projetoId.value, texto, projetoNome.value, provider.value, historico)

    if (result.error) {
      erro.value = result.error
      mensagens.value = mensagens.value.slice(0, -1)
      return
    }

    if (result.resposta) {
      mensagens.value = [...mensagens.value, { role: 'assistant' as const, content: result.resposta }]
    } else {
      erro.value = 'Nenhuma resposta recebida. Tente novamente.'
      mensagens.value = mensagens.value.slice(0, -1)
    }
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.chat-scroll {
  font-size: 15px;
  line-height: 1.6;
}

.chat-bubble-user {
  margin-left: 1.5rem;
  background: rgb(39 39 42);
  color: rgb(243 244 246);
}

.chat-bubble-assistant {
  margin-right: 1rem;
  background: rgb(39 39 42 / 0.7);
  color: rgb(228 228 231);
}

/* Prose da resposta da IA (Markdown) */
.chat-prose :deep(p) {
  margin: 0 0 0.75em;
  line-height: 1.65;
  color: rgb(228 228 231);
}
.chat-prose :deep(p:last-child) {
  margin-bottom: 0;
}
.chat-prose :deep(p + p) {
  margin-top: 0.75em;
}
.chat-prose :deep(strong) {
  font-weight: 600;
  color: rgb(244 244 245);
}
.chat-prose :deep(ul),
.chat-prose :deep(ol) {
  margin: 0.6em 0 0.75em;
  padding-left: 1.5em;
  line-height: 1.65;
}
.chat-prose :deep(li) {
  margin: 0.25em 0;
}
.chat-prose :deep(li::marker) {
  color: rgb(161 161 170);
}
.chat-prose :deep(h1),
.chat-prose :deep(h2),
.chat-prose :deep(h3) {
  margin: 1em 0 0.5em;
  font-weight: 600;
  color: rgb(244 244 245);
  line-height: 1.35;
}
.chat-prose :deep(h1) { font-size: 1.15em; }
.chat-prose :deep(h2) { font-size: 1.08em; }
.chat-prose :deep(h3) { font-size: 1em; }
.chat-prose :deep(h1:first-child),
.chat-prose :deep(h2:first-child),
.chat-prose :deep(h3:first-child) {
  margin-top: 0;
}
.chat-prose :deep(code) {
  background: rgb(24 24 27);
  color: rgb(250 250 250);
  padding: 0.2em 0.4em;
  border-radius: 0.375rem;
  font-size: 0.92em;
  font-family: ui-monospace, monospace;
}
.chat-prose :deep(pre) {
  margin: 0.75em 0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  background: rgb(24 24 27);
  line-height: 1.5;
}
.chat-prose :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.9em;
}
.chat-prose :deep(blockquote) {
  margin: 0.75em 0;
  padding-left: 1rem;
  border-left: 3px solid rgb(82 82 91);
  color: rgb(212 212 216);
}
.chat-prose :deep(a) {
  color: rgb(250 204 21);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.chat-prose :deep(a:hover) {
  color: rgb(253 224 71);
}
</style>
