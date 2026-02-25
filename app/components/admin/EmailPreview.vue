<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-900">Preview do Email</h3>

    <!-- Controles -->
    <div class="flex gap-2">
      <button
        @click="tamanho = 'mobile'"
        :class="tamanho === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="rounded-lg px-3 py-1 text-sm font-medium transition"
      >
        Mobile
      </button>
      <button
        @click="tamanho = 'tablet'"
        :class="tamanho === 'tablet' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="rounded-lg px-3 py-1 text-sm font-medium transition"
      >
        Tablet
      </button>
      <button
        @click="tamanho = 'desktop'"
        :class="tamanho === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="rounded-lg px-3 py-1 text-sm font-medium transition"
      >
        Desktop
      </button>

      <div class="ml-auto flex items-center gap-2">
        <input
          type="checkbox"
          v-model="darkMode"
          id="darkModeToggle"
          class="cursor-pointer"
        />
        <label for="darkModeToggle" class="cursor-pointer text-sm">Dark Mode</label>
      </div>
    </div>

    <!-- Container de Preview -->
    <div
      :class="[
        'rounded-lg border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-50 p-4 transition',
        darkMode && 'from-gray-900 to-gray-800',
      ]"
      :style="{ 'min-height': '500px' }"
    >
      <!-- Frame de Email -->
      <div
        :style="{
          width: tamanhoPixels[tamanho],
          margin: '0 auto',
        }"
        class="mx-auto rounded-lg bg-white shadow-lg overflow-hidden"
      >
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-gray-500">Gerando preview...</div>
        </div>

        <!-- HTML renderizado -->
        <div
          v-else-if="htmlRenderizado"
          v-html="htmlRenderizado"
          :class="darkMode && 'dark'"
          class="prose prose-sm max-w-none p-0"
        ></div>

        <!-- Vazio -->
        <div v-else class="flex items-center justify-center py-12 text-gray-400">
          <p>Sem conteudo para exibir</p>
        </div>
      </div>
    </div>

    <!-- Assunto -->
    <div>
      <label class="block text-xs font-medium text-gray-700">Assunto do Email</label>
      <input
        :value="assunto"
        disabled
        class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  htmlRenderizado: {
    type: String,
    required: true,
  },
  assunto: {
    type: String,
    default: 'Assunto do Email',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const tamanho = ref<'mobile' | 'tablet' | 'desktop'>('desktop')
const darkMode = ref(false)

const tamanhoPixels = {
  mobile: '375px',
  tablet: '600px',
  desktop: '600px',
}
</script>

<style scoped>
:deep(.prose) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:deep(.dark) {
  background: #1f2937;
  color: #f3f4f6;
}

:deep(.dark h1),
:deep(.dark h2),
:deep(.dark h3) {
  color: #f3f4f6;
}

:deep(.dark p) {
  color: #e5e7eb;
}
</style>
