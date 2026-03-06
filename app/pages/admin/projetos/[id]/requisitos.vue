<template>
  <div class="h-[70vh] flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-zinc-100">Requisitos do Sistema</h2>
      <button
        @click="abrirNovoModal"
        class="flex items-center gap-2 px-4 py-2 bg-brand text-zinc-950 font-semibold rounded-lg hover:bg-brand/90 transition-colors"
      >
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        Novo Requisito
      </button>
    </div>

    <!-- Tabela de Requisitos -->
    <div class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-y-auto custom-scrollbar">
      <table class="w-full text-left border-collapse">
        <thead class="bg-zinc-950/50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 w-24">CÃ³d</th>
            <th class="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">DescriÃ§Ã£o</th>
            <th class="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 w-32">Status</th>
            <th class="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 w-32">AÃ§Ãµes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/50">
          <tr v-for="req in requisitos" :key="req.id" class="hover:bg-zinc-800/30 transition-colors group">
            <td class="px-4 py-3">
              <span class="text-xs font-medium text-zinc-500 font-mono">REQ-{{ req.id }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm text-zinc-200 block max-w-2xl truncate">{{ req.descricao }}</span>
            </td>
            <td class="px-4 py-3">
              <select
                v-model="req.status"
                @change="atualizarStatus(req.id, req.status)"
                class="bg-transparent text-xs font-medium focus:outline-none cursor-pointer p-1 rounded-md"
                :class="{
                  'text-zinc-500': req.status === 'pendente',
                  'text-blue-400': req.status === 'aprovado',
                  'text-emerald-400': req.status === 'concluido',
                  'text-red-400': req.status === 'escopo_alterado',
                }"
              >
                <option value="pendente" class="bg-zinc-900">Pendente</option>
                <option value="aprovado" class="bg-zinc-900">Aprovado</option>
                <option value="concluido" class="bg-zinc-900">ConcluÃ­do</option>
                <option value="escopo_alterado" class="bg-zinc-900">Escopo Alt.</option>
              </select>
            </td>
            <td class="px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="excluir(req.id)" class="text-xs text-red-500 hover:text-red-400 transition-colors p-1">Excluir</button>
            </td>
          </tr>
          <tr v-if="!requisitos?.length">
            <td colspan="4" class="px-4 py-8 text-center text-zinc-500 text-sm">
               Nenhum requisito cadastrado ainda.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjetoAdminWorkspace } from '~/composables/useProjetosWorkspace'

const props = defineProps<{ projeto: ProjetoAdminWorkspace }>()
const client = useSupabase()

type ProjetoRequisito = {
  id: number
  projeto_id: number
  descricao: string
  tipo: string
  status: string
}

const { data: requisitos, pending, refresh } = await useAsyncData(
  `requisitos-proj-${props.projeto.id}`,
  async () => {
    if (!client) return null
    const { data } = await client
      .from('projetos_requisitos')
      .select('*')
      .eq('projeto_id', props.projeto.id)
      .order('id', { ascending: false })
    return data as ProjetoRequisito[] | null
  },
  {
    server: false,
    default: () => []
  }
)

async function abrirNovoModal() {
  if (!client) return
  const descricao = prompt('DescriÃ§Ã£o do novo requisito:')
  if (!descricao?.trim()) return

  const { error } = await client
    .from('projetos_requisitos')
    .insert({
      projeto_id: props.projeto.id,
      descricao: descricao.trim(),
      tipo: 'funcional',
      status: 'pendente'
    })

  if (error) {
    alert('Erro ao criar: ' + error.message)
    return
  }

  refresh()
}

async function atualizarStatus(id: number, status: string) {
  if (!client) return
  const { error } = await client
    .from('projetos_requisitos')
    .update({ status })
    .eq('id', id)

  if (error) {
    alert('Erro ao atualizar status: ' + error.message)
    refresh()
  }
}

async function excluir(id: number) {
  if (!client) return
  if (!confirm('Excluir este requisito?')) return
  const { error } = await client
    .from('projetos_requisitos')
    .delete()
    .eq('id', id)

  if (!error) refresh()
}
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
