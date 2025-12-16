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

// Usar URL absoluta temporariamente para testar
const logoUrl = 'https://framerusercontent.com/images/qNkZZGqsnFsa83IKgjnsMSUPI.png'

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}
</script>