<template>
  <div class="h-full w-full bg-gray-100 p-4">
    <!-- Canvas -->
    <div
      ref="canvas"
      @drop="onDrop"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      :class="isDragging ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white'"
      class="mx-auto w-full max-w-2xl rounded-lg border-2 border-dashed border-gray-300 shadow-sm transition"
      style="min-height: 400px"
    >
      <!-- Placeholder -->
      <div v-if="blocos.length === 0" class="flex h-full items-center justify-center text-gray-400">
        <div class="text-center">
          <p class="text-lg font-medium">Arraste blocos aqui</p>
          <p class="text-sm">Ou comece digitando conteudo</p>
        </div>
      </div>

      <!-- Blocos -->
      <div class="space-y-2 p-4">
        <div
          v-for="(bloco, index) in blocos"
          :key="index"
          @click="selecionarBloco(index)"
          :class="indexSelecionado === index ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-gray-300'"
          class="relative cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition"
        >
          <!-- Remove button -->
          <button
            @click.stop="removerBloco(index)"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            x
          </button>

          <!-- Bloco content -->
          <div v-if="bloco.tipo === 'titulo'" class="text-2xl font-bold">
            {{ bloco.dados?.texto || 'Titulo' }}
          </div>
          <div v-else-if="bloco.tipo === 'paragrafo'" class="text-sm text-gray-700">
            {{ bloco.dados?.texto || 'Paragrafo...' }}
          </div>
          <div v-else-if="bloco.tipo === 'imagem'" class="flex items-center justify-center bg-gray-100 py-8">
            [Imagem] {{ bloco.dados?.alt || 'Imagem' }}
          </div>
          <div v-else-if="bloco.tipo === 'botao'" class="inline-block rounded-lg px-4 py-2 bg-purple-600 text-white">
            {{ bloco.dados?.texto || 'Botao' }}
          </div>
          <div v-else-if="bloco.tipo === 'divisor'" class="my-2 border-t border-gray-400"></div>
          <div v-else class="text-xs text-gray-500">{{ bloco.tipo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Bloco {
  tipo: string
  dados?: Record<string, any>
  estilos?: Record<string, any>
}

const props = defineProps({
  blocos: {
    type: Array as () => Bloco[],
    default: () => [],
  },
})

const emit = defineEmits<{
  'update:blocos': [value: Bloco[]]
  'select-bloco': [index: number]
}>()

const isDragging = ref(false)
const indexSelecionado = ref<number | null>(null)

const onDragOver = (e: DragEvent) => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  e.preventDefault()

  const tipoBloco = e.dataTransfer?.getData('tipoBloco')

  if (!tipoBloco) return

  const novoBloco: Bloco = {
    tipo: tipoBloco,
    dados: {},
    estilos: {},
  }

  emit('update:blocos', [...props.blocos, novoBloco])
}

const removerBloco = (index: number) => {
  const novosBlocos = props.blocos.filter((_, i) => i !== index)
  emit('update:blocos', novosBlocos)

  if (indexSelecionado.value === index) {
    indexSelecionado.value = null
  }
}

const selecionarBloco = (index: number) => {
  indexSelecionado.value = index
  emit('select-bloco', index)
}
</script>
