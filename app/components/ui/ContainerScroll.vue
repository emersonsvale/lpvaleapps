<template>
  <div
    ref="containerRef"
    class="flex items-center justify-center relative"
    :style="{ perspective: '1000px' }"
  >
    <div
      class="w-full relative"
      :style="{
        rotateX: `${rotate}deg`,
        transformStyle: 'preserve-3d',
      }"
    >
      <div
        :style="{
          boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
          borderRadius: `${20 * scale}px`,
          transform: `scale(${scale}) rotateX(${rotateX}deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'bottom',
        }"
        class="mx-auto w-full border-4 border-[#6C6C6C] p-2 bg-[#222222] md:p-6 transition-all duration-700 ease-out"
      >
        <div
          :style="{
            borderRadius: `${16 * scale}px`,
          }"
          class="bg-gray-100 h-full w-full overflow-hidden md:rounded-lg md:p-4"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  rotate?: number
  scale?: number
  rotateX?: number
}

const props = withDefaults(defineProps<Props>(), {
  rotate: 0,
  scale: 1,
  rotateX: 0
})

const containerRef = ref<HTMLDivElement>()
const rotate = ref(props.rotate)
const scale = ref(props.scale)
const rotateX = ref(props.rotateX)

const handleScroll = () => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
  
  // Animate rotation and scale based on scroll
  rotate.value = scrollProgress * 50
  scale.value = 1 - scrollProgress * 0.1
  rotateX.value = scrollProgress * 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial call
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
