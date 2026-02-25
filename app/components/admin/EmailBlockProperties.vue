<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-900">Propriedades do Bloco</h3>

      <div v-if="bloco === null" class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
      Selecione um bloco para editar
    </div>

    <template v-else>
      <!-- Tipo de Bloco (read-only) -->
      <div>
        <label class="block text-xs font-medium text-gray-700">Tipo</label>
        <input
          :value="bloco.tipo"
          disabled
          class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
        />
      </div>

      <!-- Conteudo por tipo de bloco -->
      <template v-if="bloco.tipo === 'paragrafo' || bloco.tipo === 'titulo'">
        <div>
          <label class="block text-xs font-medium text-gray-700">Texto</label>
          <textarea
            v-model="bloco.dados.texto"
            @input="updateBloco"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            :rows="bloco.tipo === 'titulo' ? 2 : 4"
            placeholder="Digite o texto..."
          />
        </div>
      </template>

      <!-- Imagem -->
      <template v-else-if="bloco.tipo === 'imagem'">
        <div>
          <label class="block text-xs font-medium text-gray-700">URL da Imagem</label>
          <input
            v-model="bloco.dados.url"
            @input="updateBloco"
            type="url"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="https://..."
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Texto Alternativo</label>
          <input
            v-model="bloco.dados.alt"
            @input="updateBloco"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="Descricao da imagem..."
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Largura (px)</label>
          <input
            v-model.number="bloco.dados.width"
            @input="updateBloco"
            type="number"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="600"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Altura (px)</label>
          <input
            v-model.number="bloco.dados.height"
            @input="updateBloco"
            type="number"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="400"
          />
        </div>
      </template>

      <!-- Botao -->
      <template v-else-if="bloco.tipo === 'botao'">
        <div>
          <label class="block text-xs font-medium text-gray-700">Texto do Botao</label>
          <input
            v-model="bloco.dados.texto"
            @input="updateBloco"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="Clique aqui"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Link</label>
          <input
            v-model="bloco.dados.link"
            @input="updateBloco"
            type="url"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            placeholder="https://..."
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Cor de Fundo</label>
          <div class="mt-1 flex items-center gap-2">
            <input
              v-model="bloco.estilos.backgroundColor"
              @input="updateBloco"
              type="color"
              class="h-10 w-12 cursor-pointer rounded border border-gray-300"
            />
            <input
              v-model="bloco.estilos.backgroundColor"
              @input="updateBloco"
              type="text"
              class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="#667eea"
            />
          </div>
        </div>
      </template>

      <!-- Header -->
      <template v-else-if="bloco.tipo === 'header'">
        <div>
          <label class="block text-xs font-medium text-gray-700">Titulo</label>
          <input
            v-model="bloco.dados.titulo"
            @input="updateBloco"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Subtitulo</label>
          <input
            v-model="bloco.dados.subtitulo"
            @input="updateBloco"
            type="text"
            class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700">Cor de Fundo</label>
          <input
            v-model="bloco.estilos.backgroundColor"
            @input="updateBloco"
            type="color"
            class="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-300"
          />
        </div>
      </template>

      <!-- Espacamento generico -->
      <div class="border-t border-gray-200 pt-4">
        <label class="block text-xs font-medium text-gray-700">Espacamento Interno (px)</label>
        <input
          v-model.number="bloco.estilos.padding"
          @input="updateBloco"
          type="number"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          placeholder="16"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700">Margem Externa (px)</label>
        <input
          v-model.number="bloco.estilos.margin"
          @input="updateBloco"
          type="number"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          placeholder="0"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Bloco {
  tipo: string
  dados?: Record<string, any>
  estilos?: Record<string, any>
}

const props = defineProps({
  bloco: {
    type: Object as () => Bloco | null,
    default: null,
  },
})

const emit = defineEmits<{
  update: [value: Bloco]
}>()

const updateBloco = () => {
  if (props.bloco) {
    emit('update', props.bloco)
  }
}
</script>
