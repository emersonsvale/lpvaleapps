<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-950/40 p-2">
      <button
        type="button"
        class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
        @mousedown.prevent
        @click="applyBold"
      >
        Negrito
      </button>

      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-400">Peso</span>
        <select
          v-model="selectedWeight"
          class="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-brand/50 focus:outline-none"
        >
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
        </select>
        <button
          type="button"
          class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
          @mousedown.prevent
          @click="applyWeight"
        >
          Aplicar peso
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-400">Cor</span>
        <input
          v-model="selectedColor"
          type="color"
          class="h-7 w-10 cursor-pointer rounded border border-zinc-700 bg-zinc-950"
        >
        <button
          type="button"
          class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
          @mousedown.prevent
          @click="applyColor"
        >
          Aplicar cor
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-400">Tamanho</span>
        <select
          v-model="selectedSize"
          class="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 focus:border-brand/50 focus:outline-none"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
        <button
          type="button"
          class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-200 hover:border-zinc-500"
          @mousedown.prevent
          @click="applySize"
        >
          Aplicar tamanho
        </button>
      </div>
    </div>

    <textarea
      ref="editorRef"
      :value="modelValue"
      class="h-96 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2 font-mono text-sm text-zinc-100 focus:border-brand/50 focus:outline-none"
      placeholder="Digite o conteudo do email em texto normal..."
      @input="onInput"
    />

    <div v-if="availableVariablesNormalized.length" class="flex flex-wrap gap-2">
      <button
        v-for="variableName in availableVariablesNormalized"
        :key="`body-var-${variableName}`"
        type="button"
        class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
        @mousedown.prevent
        @click="insertVariable(variableName)"
      >
        {{ formatVariableToken(variableName) }}
      </button>
    </div>

    <p class="text-xs text-zinc-500">
      Texto normal. Os botoes aplicam estilo automaticamente no preview/envio.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  availableVariables?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLTextAreaElement | null>(null)
const selectedWeight = ref('700')
const selectedColor = ref('#ffc000')
const selectedSize = ref('18px')

const availableVariablesNormalized = computed(() => {
  return (props.availableVariables || [])
    .map(item => item.trim())
    .filter(item => item.length > 0)
})

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const applyOnSelection = (openTag: string, closeTag: string, fallbackText = 'texto') => {
  const textarea = editorRef.value
  if (!textarea) return

  const fullText = props.modelValue || ''
  const start = textarea.selectionStart ?? 0
  const end = textarea.selectionEnd ?? start
  const hasSelection = end > start
  const selectedText = hasSelection ? fullText.slice(start, end) : fallbackText

  const updated =
    fullText.slice(0, start)
    + openTag
    + selectedText
    + closeTag
    + fullText.slice(end)

  emit('update:modelValue', updated)

  nextTick(() => {
    const cursorStart = start + openTag.length
    const cursorEnd = cursorStart + selectedText.length
    textarea.focus()
    textarea.setSelectionRange(cursorStart, cursorEnd)
  })
}

const applyBold = () => applyOnSelection('**', '**')
const applyWeight = () => applyOnSelection(`[w:${selectedWeight.value}]`, '[/w]')
const applyColor = () => applyOnSelection(`[color:${selectedColor.value}]`, '[/color]')
const applySize = () => applyOnSelection(`[size:${selectedSize.value}]`, '[/size]')
const insertVariable = (variableName: string) => applyOnSelection(`{{ ${variableName} }}`, '', variableName)
const formatVariableToken = (variableName: string) => `{{ ${variableName} }}`
</script>
