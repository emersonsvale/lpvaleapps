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

// Referência da imagem na pasta public
const logoUrl = '/logo-vale-apps.png'

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
</script>