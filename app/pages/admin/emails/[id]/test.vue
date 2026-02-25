<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-zinc-100">Teste de Envio</h2>
        <p class="text-sm text-zinc-500">Envie o template para um email de teste</p>
      </div>
      <NuxtLink to="/admin/emails" class="text-sm text-brand hover:underline">Voltar</NuxtLink>
    </div>

    <div v-if="erro" class="rounded-lg border border-red-900/40 bg-red-900/20 p-4 text-sm text-red-200">
      {{ erro }}
    </div>

    <div v-if="sucesso" class="rounded-lg border border-emerald-900/40 bg-emerald-900/20 p-4 text-sm text-emerald-200">
      {{ sucesso }}
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
      <div>
        <label class="text-xs text-zinc-400">Email destinatario</label>
        <input v-model="emailPara" type="email" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100" placeholder="teste@exemplo.com" />
      </div>
      <div>
        <label class="text-xs text-zinc-400">Variaveis (JSON)</label>
        <textarea v-model="variaveisTexto" rows="6" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100"></textarea>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand/90"
          :disabled="enviando"
          @click="enviarTeste"
        >
          {{ enviando ? 'Enviando...' : 'Enviar Teste' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const emails = useEmail()

const enviando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref<string | null>(null)
const emailPara = ref('')
const variaveisTexto = ref('{\n  "nome": "Joao"\n}')

const parseVars = () => {
  try {
    return JSON.parse(variaveisTexto.value || '{}')
  }
  catch {
    return {}
  }
}

const enviarTeste = async () => {
  erro.value = null
  sucesso.value = null
  enviando.value = true

  try {
    const resultado = await emails.sendEmail({
      templateId: Number(route.params.id),
      para: emailPara.value,
      variaveis: parseVars(),
    })

    if (!resultado.sucesso) {
      throw new Error(resultado.erro || 'Erro ao enviar teste')
    }

    sucesso.value = 'Email de teste enviado com sucesso'
  }
  catch (e: any) {
    erro.value = e.message || 'Erro ao enviar teste'
  }
  finally {
    enviando.value = false
  }
}
</script>
