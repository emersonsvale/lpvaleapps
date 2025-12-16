<template>
  <svg
    ref="svgRef"
    width="100%"
    height="100%"
    viewBox="0 0 300 100"
    xmlns="http://www.w3.org/2000/svg"
    @mouseenter="setHovered(true)"
    @mouseleave="setHovered(false)"
    @mousemove="handleMouseMove"
    :class="cn('select-none uppercase cursor-pointer', className)"
  >
    <defs>
      <linearGradient
        id="textGradient"
        gradientUnits="userSpaceOnUse"
        cx="50%"
        cy="50%"
        r="25%"
      >
        <template v-if="hovered">
          <stop offset="0%" stop-color="#eab308" />
          <stop offset="25%" stop-color="#ef4444" />
          <stop offset="50%" stop-color="#80eeb4" />
          <stop offset="75%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </template>
      </linearGradient>
      
      <radialGradient
        id="revealMask"
        gradientUnits="userSpaceOnUse"
        r="20%"
        :cx="maskPosition.cx"
        :cy="maskPosition.cy"
      >
        <stop offset="0%" stop-color="white" />
        <stop offset="100%" stop-color="black" />
      </radialGradient>
      
      <mask id="textMask">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
      </mask>
    </defs>
    
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      stroke-width="0.3"
      class="fill-transparent stroke-neutral-200 font-bold text-7xl dark:stroke-neutral-800"
      :style="{ opacity: hovered ? 0.35 : 0 }"
    >
      {{ text }}
    </text>
    
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      stroke-width="0.3"
      class="fill-transparent stroke-[#FFC000] font-bold text-7xl dark:stroke-[#FFC00099]"
      :style="{
        strokeDashoffset: animatedStroke.strokeDashoffset,
        strokeDasharray: animatedStroke.strokeDasharray,
        opacity: 0.5
      }"
    >
      {{ text }}
    </text>
    
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      stroke="url(#textGradient)"
      stroke-width="0.3"
      mask="url(#textMask)"
      class="fill-transparent font-bold text-7xl"
      style="opacity: 0.5"
    >
      {{ text }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

interface Props {
  text: string
  duration?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 0,
  className: ''
})

const svgRef = ref<SVGSVGElement>()
const cursor = reactive({ x: 0, y: 0 })
const hovered = ref(false)
const maskPosition = reactive({ cx: '50%', cy: '50%' })
const animatedStroke = reactive({
  strokeDashoffset: 1000,
  strokeDasharray: 1000
})

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

const setHovered = (value: boolean) => {
  hovered.value = value
}

const handleMouseMove = (e: MouseEvent) => {
  cursor.x = e.clientX
  cursor.y = e.clientY
}

watch([() => cursor.x, () => cursor.y], () => {
  if (svgRef.value && cursor.x !== null && cursor.y !== null) {
    const svgRect = svgRef.value.getBoundingClientRect()
    const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
    const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100
    
    maskPosition.cx = `${cxPercentage}%`
    maskPosition.cy = `${cyPercentage}%`
  }
})

onMounted(() => {
  // Animate stroke on mount
  setTimeout(() => {
    animatedStroke.strokeDashoffset = 0
  }, 100)
})
</script>
