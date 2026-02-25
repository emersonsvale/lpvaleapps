<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-zinc-100">Preview do Template</h2>
        <p class="text-sm text-zinc-500">Visualize o email antes do envio</p>
      </div>
      <NuxtLink to="/admin/emails" class="text-sm text-brand hover:underline">Voltar</NuxtLink>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <label class="text-xs text-zinc-400">Variaveis para preview (JSON)</label>
      <textarea v-model="previewVarsText" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100"></textarea>
    </div>

    <div v-if="erro" class="rounded-lg border border-red-900/40 bg-red-900/20 p-4 text-sm text-red-200">
      {{ erro }}
    </div>

    <div v-if="carregando" class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-500">
      Carregando preview...
    </div>

    <div v-else class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <EmailPreview :html-renderizado="htmlPreview" :assunto="assuntoPreview" :loading="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EmailPreview from '~/components/admin/EmailPreview.vue'

const route = useRoute()
const emails = useEmail()

const carregando = ref(true)
const erro = ref<string | null>(null)
const template = ref<any | null>(null)
const previewVarsText = ref('{\n  "nome": "Joao"\n}')

const parsePreviewVars = () => {
  try {
    return JSON.parse(previewVarsText.value || '{}')
  }
  catch {
    return {}
  }
}

const applyVariables = (texto: string, vars: Record<string, any>) => {
  let result = texto || ''
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, String(value ?? ''))
  })
  return result
}

const htmlPreview = computed(() => {
  if (!template.value?.conteudo_html) return ''
  return applyVariables(template.value.conteudo_html, parsePreviewVars())
})

const assuntoPreview = computed(() => {
  if (!template.value?.assunto) return 'Assunto do email'
  return applyVariables(template.value.assunto, parsePreviewVars())
})

const carregarTemplate = async () => {
  carregando.value = true
  erro.value = null

  try {
    const id = Number(route.params.id)
    const lista = await emails.getTemplates()
    template.value = lista.find(item => item.id === id) || null

    if (!template.value) {
      throw new Error('Template nao encontrado')
    }
  }
  catch (e: any) {
    erro.value = e.message || 'Erro ao carregar template'
  }
  finally {
    carregando.value = false
  }
}

onMounted(carregarTemplate)
</script>
