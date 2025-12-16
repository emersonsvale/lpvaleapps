<template>
  <img
    :src="logoUrl"
    alt="Vale Apps - Soluções Digitais"
    :class="cn('h-5 w-auto', className)"
  />
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

// Import da imagem usando Vite
const logoUrl = new URL('~/assets/logo-vale-apps.png', import.meta.url).href

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
</script>