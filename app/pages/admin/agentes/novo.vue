<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-100">Novo agente</h1>
      <p class="text-zinc-400 mt-1">Defina nome, instruções e provedor (ChatGPT ou Gemini).</p>
    </div>

    <form class="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6" @submit.prevent="salvar">
      <div>
        <label for="nome" class="block text-sm font-medium text-zinc-300">Nome</label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          required
          class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          placeholder="Ex: Vendas, Eng. de Software"
        >
      </div>
      <div>
        <label for="descricao" class="block text-sm font-medium text-zinc-300">Descrição (opcional)</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          rows="2"
          class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          placeholder="Breve descrição do papel do agente"
        />
      </div>
      <div>
        <label for="instrucoes" class="block text-sm font-medium text-zinc-300">Instruções de sistema</label>
        <p class="mt-0.5 text-xs text-zinc-500">Define o comportamento e o tom do agente. Use também para regras de negócio.</p>
        <textarea
          id="instrucoes"
          v-model="form.instrucoes_sistema"
          rows="5"
          required
          class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          placeholder="Ex: Você é um especialista em vendas. Responda de forma objetiva e use os dados fornecidos para embasar respostas."
        />
      </div>
      <div>
        <label for="provider" class="block text-sm font-medium text-zinc-300">Provedor de IA</label>
        <select
          id="provider"
          v-model="form.provider"
          class="mt-1 w-full rounded-xl border border-zinc-600 bg-zinc-950 px-4 py-2.5 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          <option value="gemini">Gemini</option>
          <option value="chatgpt">ChatGPT</option>
        </select>
      </div>
      <div class="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          :disabled="saving"
          class="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-brand/90 disabled:opacity-50 transition-colors"
        >
          {{ saving ? 'Salvando...' : 'Criar agente' }}
        </button>
        <NuxtLink to="/admin/agentes" class="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
          Cancelar
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const router = useRouter()
const { create } = useAgents()

const form = ref({
  nome: '',
  descricao: '',
  instrucoes_sistema: 'Você é um assistente prestativo. Use o conhecimento fornecido para responder com precisão.',
  provider: 'gemini' as 'chatgpt' | 'gemini',
})
const saving = ref(false)

async function salvar() {
  if (!form.value.nome.trim()) return
  saving.value = true
  try {
    const agent = await create({
      nome: form.value.nome.trim(),
      descricao: form.value.descricao?.trim() || undefined,
      instrucoes_sistema: form.value.instrucoes_sistema?.trim() || 'Você é um assistente prestativo.',
      provider: form.value.provider,
    })
    await navigateTo(`/admin/agentes/${agent.id}`)
  } catch (e: any) {
    console.error(e)
    alert(e?.data?.message || e?.message || 'Erro ao criar agente.')
  } finally {
    saving.value = false
  }
}
</script>
