<template>
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-gray-900">Blocos Disponiveis</h3>

    <div class="space-y-2">
      <!-- Texto -->
      <div
        draggable="true"
        @dragstart="onDragStart('paragrafo', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">TXT</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Paragrafo</div>
          <div class="text-xs text-gray-500">Texto normal</div>
        </div>
      </div>

      <!-- Titulo -->
      <div
        draggable="true"
        @dragstart="onDragStart('titulo', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">H1</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Titulo</div>
          <div class="text-xs text-gray-500">Texto destacado</div>
        </div>
      </div>

      <!-- Imagem -->
      <div
        draggable="true"
        @dragstart="onDragStart('imagem', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">IMG</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Imagem</div>
          <div class="text-xs text-gray-500">Adicione imagens</div>
        </div>
      </div>

      <!-- Botao -->
      <div
        draggable="true"
        @dragstart="onDragStart('botao', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">BTN</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Botao</div>
          <div class="text-xs text-gray-500">CTA com link</div>
        </div>
      </div>

      <!-- Divisor -->
      <div
        draggable="true"
        @dragstart="onDragStart('divisor', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">HR</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Divisor</div>
          <div class="text-xs text-gray-500">Linha separadora</div>
        </div>
      </div>

      <!-- Header -->
      <div
        draggable="true"
        @dragstart="onDragStart('header', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">HDR</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Header</div>
          <div class="text-xs text-gray-500">Cabecalho colorido</div>
        </div>
      </div>

      <!-- Footer -->
      <div
        draggable="true"
        @dragstart="onDragStart('footer', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">FTR</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Rodape</div>
          <div class="text-xs text-gray-500">Informacoes de contato</div>
        </div>
      </div>

      <!-- Social -->
      <div
        draggable="true"
        @dragstart="onDragStart('social', $event)"
        class="flex cursor-move items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition"
      >
        <span class="text-lg">SOC</span>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">Redes Sociais</div>
          <div class="text-xs text-gray-500">Links de redes</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const onDragStart = (tipoBloco: string, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('tipoBloco', tipoBloco)
  }
}
</script>
