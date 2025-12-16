<template>
  <div class="fuzzy-text-container">
    <span 
      ref="textRef"
      :class="className"
      class="fuzzy-text"
    >
      {{ displayText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

interface FuzzyTextProps {
  text: string
  className?: string
  duration?: number
  animateOnHover?: boolean
}

const props = withDefaults(defineProps<FuzzyTextProps>(), {
  text: '',
  className: '',
  duration: 2000,
  animateOnHover: false
})

const textRef = useTemplateRef<HTMLSpanElement>('textRef')
const displayText = ref('')

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

let animationId: number | null = null
let timeoutId: NodeJS.Timeout | null = null

const animateText = () => {
  if (!props.text) return

  const targetText = props.text
  const steps = 20
  const stepDuration = props.duration / steps
  let currentStep = 0

  const animate = () => {
    if (currentStep >= steps) {
      displayText.value = targetText
      return
    }

    let result = ''
    for (let i = 0; i < targetText.length; i++) {
      if (targetText[i] === ' ') {
        result += ' '
      } else if (i < (currentStep / steps) * targetText.length) {
        result += targetText[i]
      } else {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
    }

    displayText.value = result
    currentStep++

    timeoutId = setTimeout(animate, stepDuration)
  }

  animate()
}

const handleMouseEnter = () => {
  if (props.animateOnHover) {
    if (timeoutId) clearTimeout(timeoutId)
    animateText()
  }
}

onMounted(() => {
  if (!props.animateOnHover) {
    // Delay inicial antes de começar a animação
    setTimeout(() => {
      animateText()
    }, 500)
  } else {
    displayText.value = props.text
  }

  if (props.animateOnHover && textRef.value) {
    textRef.value.addEventListener('mouseenter', handleMouseEnter)
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
  if (animationId) cancelAnimationFrame(animationId)
  
  if (textRef.value) {
    textRef.value.removeEventListener('mouseenter', handleMouseEnter)
  }
})
</script>

<style scoped>
.fuzzy-text-container {
  display: inline-block;
}

.fuzzy-text {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 0.1em;
}
</style>