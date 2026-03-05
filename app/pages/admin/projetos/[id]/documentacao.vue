<template>
  <div class="flex gap-6 h-[70vh]">
    <!-- Sidebar de Documentos -->
    <div class="w-64 flex flex-col border-r border-zinc-800 pr-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-zinc-300">SumÃ¡rio</h3>
        <button
          @click="novoDocumento"
          class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-brand transition-colors"
          title="Novo Documento"
        >
          <Icon name="ph:plus-bold" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-1">
        <button
          v-for="doc in documentos"
          :key="doc.id"
          class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate"
          :class="[
            documentoSelecionado?.id === doc.id
              ? 'bg-brand/10 text-brand font-medium'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          ]"
          @click="selecionarDocumento(doc)"
        >
          {{ doc.titulo || 'Sem tÃ­tulo' }}
        </button>
        <div v-if="!documentos?.length" class="text-xs text-zinc-500 py-4 text-center">
          Nenhum documento criado
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div class="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <template v-if="documentoSelecionado">
        <!-- Header do Editor -->
        <div class="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
          <input
            v-model="documentoSelecionado.titulo"
            class="bg-transparent text-lg font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none flex-1"
            placeholder="TÃ­tulo do Documento..."
            @blur="salvarAutomatico"
          />
          <div class="flex flex-col items-end">
             <span class="text-xs text-zinc-500 mb-1">
              {{ salvando ? 'Salvando...' : 'Salvo automÃ¡tico ativado' }}
            </span>
            <button
              @click="excluirDocumentoSelecionado"
              class="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
            >
              Excluir Documento
            </button>
          </div>
        </div>

        <!-- Ãrea de Texto do Editor -->
        <div class="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <textarea
            v-model="documentoSelecionado.conteudo"
            class="w-full h-full min-h-full bg-transparent text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none"
            placeholder="Comece a digitar o conteÃºdo do documento com Markdown..."
            @input="debouncedSalvar"
          ></textarea>
        </div>
      </template>
      <div v-else class="flex flex-col items-center justify-center flex-1 text-zinc-500 space-y-4 text-center">
        <Icon name="ph:files-duotone" class="w-16 h-16 opacity-50" />
        <p>Selecione um documento na barra lateral ou <br><button @click="novoDocumento" class="text-brand hover:underline">crie um novo</button>.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const client = useSupabase()

type ProjetoDoc = {
  id: number
  projeto_id: number
  titulo: string
  conteudo: string
  criado_em: string
  atualizado_em: string
}

const { data: documentos, pending, refresh } = await useAsyncData(
  `docs-proj-${props.projeto.id}`,
  async () => {
    if (!client) return null
    const { data } = await client
      .from('projetos_docs')
      .select('*')
      .eq('projeto_id', props.projeto.id)
      .order('criado_em', { ascending: true })
    return data as ProjetoDoc[] | null
  }
)

const documentoSelecionado = ref<ProjetoDoc | null>(null)
const salvando = ref(false)

let salvarTimeout: any = null

function debouncedSalvar() {
  clearTimeout(salvarTimeout)
  salvarTimeout = setTimeout(() => {
    salvarAutomatico()
  }, 1000)
}

async function salvarAutomatico() {
  if (!client) return
  if (!documentoSelecionado.value?.id) return
  salvando.value = true
  
  const { error } = await client
    .from('projetos_docs')
    .update({ 
      titulo: documentoSelecionado.value.titulo,
      conteudo: documentoSelecionado.value.conteudo 
    })
    .eq('id', documentoSelecionado.value.id)

  salvando.value = false
  if (error) console.error('Erro ao salvar:', error)
}

async function novoDocumento() {
  if (!client) return
  const { data, error } = await client
    .from('projetos_docs')
    .insert({
      projeto_id: props.projeto.id,
      titulo: 'Novo Documento',
      conteudo: ''
    })
    .select()
    .single()

  if (error || !data) {
    alert('Erro ao criar: ' + error?.message)
    return
  }
  
  await refresh()
  documentoSelecionado.value = documentos.value?.find(d => d.id === data.id) || null
}

function selecionarDocumento(doc: ProjetoDoc) {
  documentoSelecionado.value = doc
}

async function excluirDocumentoSelecionado() {
  if (!client) return
  if (!documentoSelecionado.value) return
  if (!confirm('Excluir este documento permamentemente?')) return

  const { error } = await client
    .from('projetos_docs')
    .delete()
    .eq('id', documentoSelecionado.value.id)

  if (error) {
    alert('Erro: ' + error.message)
    return
  }

  documentoSelecionado.value = null
  refresh()
}

// Iniciar com o primeiro documento selecionado caso exista e nada esteja selecionado
watch(documentos, (docs) => {
  if (docs && docs.length > 0 && !documentoSelecionado.value) {
    documentoSelecionado.value = docs[0]
  }
}, { immediate: true })

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
  border-radius: 10px;
}
</style>
