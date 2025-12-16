<template>
  <div class="blur-text-container">
    <span
      v-for="(word, wordIndex) in words"
      :key="`word-${wordIndex}`"
      class="word"
    >
      <span
        v-for="(char, charIndex) in word.split('')"
        :key="`char-${wordIndex}-${charIndex}`"
        class="char"
        :style="getCharStyle(wordIndex, charIndex)"
      >
        {{ char }}
      </span>
      <span v-if="wordIndex < words.length - 1" class="space"> </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  delay?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 1000
})

const words = computed(() => props.text.split(' '))

const getCharStyle = (wordIndex: number, charIndex: number) => {
  const animationDelay = props.delay + (wordIndex * 100) + (charIndex * 50)
  return {
    animationDelay: `${animationDelay}ms`,
    animationDuration: `${props.duration}ms`
  }
}
</script>

<style scoped>
.blur-text-container {
  display: inline-block;
}

.word {
  display: inline-block;
}

.char {
  display: inline-block;
  filter: blur(8px);
  opacity: 0;
  animation: blur-in ease-out forwards;
}

.space {
  display: inline-block;
  width: 0.25em;
}

@keyframes blur-in {
  0% {
    filter: blur(8px);
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>