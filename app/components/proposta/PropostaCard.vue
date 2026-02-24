<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay } }"
    class="proposta-card"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
</script>
