<template>
  <div class="space-y-8">
    <div v-if="loading" class="flex justify-center py-12">
      <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>

    <template v-else-if="agent">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-zinc-100">{{ agent.nome }}</h1>
          <p class="text-zinc-500 mt-1">{{ agent.slug }} · {{ agent.provider === 'chatgpt' ? 'ChatGPT' : 'Gemini' }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-brand/90 transition-colors"
            @click="irParaChat"
          >
            <PhChatCircle class="w-5 h-5" />
            Conversar
          </button>
          <button
            type="button"
            class="rounded-xl border border-red-500/50 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            @click="confirmarExclusao"
          >
            Excluir
          </button>
        </div>
      </div>

      <section class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 class="text-lg font-medium text-zinc-200">Configuração</h2>
        <form class="mt-4 space-y-4" @submit.prevent="salvar">
          <div>
            <label for="nome" class="block text-sm font-medium text-zinc-400">Nome</label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              required
              class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100"
            >
          </div>
          <div>
            <label for="descricao" class="block text-sm font-medium text-zinc-400">Descrição</label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              rows="2"
              class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100"
            />
          </div>
          <div>
            <label for="instrucoes" class="block text-sm font-medium text-zinc-400">Instruções de sistema</label>
            <textarea
              id="instrucoes"
              v-model="form.instrucoes_sistema"
              rows="5"
              required
              class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100"
            />
          </div>
          <div>
            <label for="provider" class="block text-sm font-medium text-zinc-400">Provedor</label>
            <select id="provider" v-model="form.provider" class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100">
              <option value="gemini">Gemini</option>
              <option value="chatgpt">ChatGPT</option>
            </select>
          </div>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-brand/90 disabled:opacity-50"
          >
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </form>
      </section>

      <section class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 class="text-lg font-medium text-zinc-200">Conhecimento</h2>
        <p class="mt-1 text-sm text-zinc-500">Texto e arquivos (PDF, TXT, MD, JSON, CSV) usados para dar contexto ao agente nas respostas.</p>

        <div class="mt-4 space-y-4">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
              @click="mostrarFormTexto = true"
            >
              + Adicionar texto
            </button>
            <label class="cursor-pointer rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700">
              <input type="file" class="sr-only" accept=".pdf,.txt,.md,.json,.csv" @change="onFileSelect">
              + Enviar arquivo
            </label>
          </div>

          <div v-if="mostrarFormTexto" class="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
            <input
              v-model="novoTexto.titulo"
              type="text"
              placeholder="Título (opcional)"
              class="mb-2 w-full rounded-lg border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
            <textarea
              v-model="novoTexto.conteudo_texto"
              rows="4"
              placeholder="Conteúdo que o agente usará como referência..."
              class="w-full rounded-lg border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            />
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                class="rounded-lg bg-brand px-3 py-1.5 text-sm text-zinc-900"
                :disabled="!novoTexto.conteudo_texto?.trim() || salvandoTexto"
                @click="adicionarTexto"
              >
                {{ salvandoTexto ? 'Salvando...' : 'Adicionar' }}
              </button>
              <button type="button" class="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm text-zinc-400" @click="mostrarFormTexto = false; novoTexto = { titulo: '', conteudo_texto: '' }">
                Cancelar
              </button>
            </div>
          </div>

          <ul v-if="knowledge.length" class="divide-y divide-zinc-800">
            <li v-for="k in knowledge" :key="k.id" class="flex items-start justify-between gap-2 py-3">
              <div class="min-w-0 flex-1">
                <span class="text-xs font-medium text-zinc-500 uppercase">{{ k.tipo }}</span>
                <p class="font-medium text-zinc-200">{{ k.titulo || (k.tipo === 'text' ? 'Texto' : k.nome_arquivo) || 'Sem título' }}</p>
                <p v-if="k.conteudo_texto" class="mt-1 line-clamp-2 text-sm text-zinc-500">{{ k.conteudo_texto }}</p>
              </div>
              <button
                type="button"
                class="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-red-400"
                aria-label="Remover"
                :disabled="removendo === k.id"
                @click="removerConhecimento(k.id)"
              >
                <PhTrash class="h-4 w-4" />
              </button>
            </li>
          </ul>
          <p v-else class="py-4 text-center text-sm text-zinc-500">Nenhum item de conhecimento ainda.</p>
        </div>
      </section>
    </template>

    <div v-else class="rounded-xl border border-zinc-800 p-8 text-center text-zinc-400">
      Agente não encontrado.
      <NuxtLink to="/admin/agentes" class="ml-1 text-brand hover:underline">Voltar</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhChatCircle, PhTrash } from '@phosphor-icons/vue'
import type { AiAgent, AiAgentKnowledge } from '~/types/ai-agents'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const { get, update, remove, listKnowledge, addKnowledgeText, uploadKnowledgeFile, removeKnowledge } = useAgents()

const agent = ref<AiAgent | null>(null)
const loading = ref(true)
const saving = ref(false)
const form = ref({ nome: '', descricao: '', instrucoes_sistema: '', provider: 'gemini' as 'chatgpt' | 'gemini' })
const knowledge = ref<AiAgentKnowledge[]>([])
const mostrarFormTexto = ref(false)
const novoTexto = ref({ titulo: '', conteudo_texto: '' })
const salvandoTexto = ref(false)
const removendo = ref<string | null>(null)

async function carregar() {
  if (!id.value) return
  loading.value = true
  try {
    agent.value = await get(id.value)
    if (agent.value) {
      form.value = {
        nome: agent.value.nome,
        descricao: agent.value.descricao ?? '',
        instrucoes_sistema: agent.value.instrucoes_sistema,
        provider: agent.value.provider,
      }
      knowledge.value = await listKnowledge(id.value)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(carregar)

async function salvar() {
  if (!agent.value) return
  saving.value = true
  try {
    agent.value = await update(agent.value.id, form.value)
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Erro ao salvar.')
  } finally {
    saving.value = false
  }
}

async function adicionarTexto() {
  if (!id.value || !novoTexto.value.conteudo_texto?.trim()) return
  salvandoTexto.value = true
  try {
    await addKnowledgeText(id.value, {
      titulo: novoTexto.value.titulo?.trim() || undefined,
      conteudo_texto: novoTexto.value.conteudo_texto.trim(),
    })
    knowledge.value = await listKnowledge(id.value)
    novoTexto.value = { titulo: '', conteudo_texto: '' }
    mostrarFormTexto.value = false
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Erro ao adicionar.')
  } finally {
    salvandoTexto.value = false
  }
}

async function onFileSelect(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !id.value) return
  try {
    await uploadKnowledgeFile(id.value, file)
    knowledge.value = await listKnowledge(id.value)
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Erro no upload.')
  }
  input.value = ''
}

async function removerConhecimento(kid: string) {
  if (!id.value) return
  removendo.value = kid
  try {
    await removeKnowledge(id.value, kid)
    knowledge.value = knowledge.value.filter((k) => k.id !== kid)
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Erro ao remover.')
  } finally {
    removendo.value = null
  }
}

function irParaChat() {
  if (!agent.value?.id) return
  navigateTo({ path: '/admin/chat-ia', query: { modo: 'especialista', agenteId: agent.value.id } })
}

function confirmarExclusao() {
  if (!agent.value || !confirm('Excluir este agente e todas as conversas?')) return
  remove(agent.value.id).then(() => navigateTo('/admin/agentes')).catch((e) => alert(e?.message || 'Erro ao excluir.'))
}
</script>
