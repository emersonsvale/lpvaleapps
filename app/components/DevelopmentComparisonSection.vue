<template>
  <section class="py-20 md:py-32 relative overflow-hidden bg-background">
    <div class="container mx-auto px-6">
      <div
        v-motion
        :initial="sectionTitleReveal.initial"
        :visible-once="sectionTitleReveal.visibleOnce"
        class="max-w-4xl mx-auto text-center mb-16 md:mb-20"
      >
        <p class="text-sm uppercase tracking-widest text-brand mb-4 font-medium">Velocidade é tudo</p>
        <h2 class="text-4xl md:text-6xl font-medium mb-6 leading-tight">
          Acelere seu <span class="text-brand">desenvolvimento</span>
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Com nossa metodologia ágil e tecnologias modernas, entregamos em semanas o que outros fazem em meses.
        </p>
      </div>

      <!-- Comparison Timelines -->
      <div class="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <!-- Vale Apps Timeline -->
        <div
          v-motion
          :initial="timelineReveal.initial"
          :visible-once="timelineReveal.visibleOnce"
          ref="valeTimelineRef"
          class="relative p-8 md:p-10 lg:p-12 rounded-2xl border border-brand/10 bg-brand/[0.02]"
        >
          <div class="flex items-center gap-4 mb-8 md:mb-10">
            <div class="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <PhLightning :size="20" weight="fill" class="text-brand" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-white">Vale Apps</h3>
              <p class="text-sm text-zinc-400">Desenvolvimento ágil e acelerado</p>
            </div>
          </div>

          <div class="relative">
            <!-- Row 1: Icons/Dots above the line -->
            <div class="relative h-14 mb-3">
              <!-- Start dot -->
              <div class="absolute left-0 bottom-0 flex items-center justify-start">
                <div
                  class="w-5 h-5 rounded-full ring-4 transition-all duration-500"
                  :class="timelineProgress >= 3
                    ? 'bg-brand ring-brand/25 shadow-[0_0_14px_rgba(255,192,0,0.65),0_0_28px_rgba(255,192,0,0.35)] animate-[pulse_2s_ease-in-out_infinite]'
                    : 'bg-brand/40 ring-brand/10'"
                ></div>
              </div>
              <!-- Week 8-12 icon -->
              <div class="absolute left-[40%] bottom-0 -translate-x-1/2 flex items-end justify-center">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500"
                  :class="timelineProgress >= 40 && timelineProgress < 52
                    ? 'bg-brand/25 border-brand/55 scale-125 -translate-y-2 shadow-[0_0_28px_rgba(255,192,0,0.45),0_0_56px_rgba(255,192,0,0.25)] animate-bounce'
                    : timelineProgress >= 52
                      ? 'bg-brand/18 border-brand/45 scale-110 shadow-[0_0_22px_rgba(255,192,0,0.32)] animate-[pulse_2.2s_ease-in-out_infinite]'
                      : 'bg-brand/5 border-brand/20 opacity-70 scale-95'"
                >
                  <PhRocket
                    :size="18"
                    weight="fill"
                    class="text-brand transition-transform duration-300"
                    :class="timelineProgress >= 40 ? 'scale-110' : 'scale-100'"
                  />
                </div>
              </div>
              <!-- Week 16 dot -->
              <div class="absolute left-[70%] bottom-0 -translate-x-1/2 flex items-center justify-center">
                <div
                  class="w-5 h-5 rounded-full ring-2 transition-all duration-500"
                  :class="timelineProgress >= 70
                    ? 'bg-brand/80 ring-brand/25 shadow-[0_0_10px_rgba(255,192,0,0.45),0_0_20px_rgba(255,192,0,0.22)] animate-[pulse_2.3s_ease-in-out_infinite]'
                    : 'bg-brand/35 ring-brand/10'"
                ></div>
              </div>
              <!-- Week 20 dot -->
              <div class="absolute right-0 bottom-0 flex items-center justify-end">
                <div
                  class="w-5 h-5 rounded-full ring-2 transition-all duration-700"
                  :class="timelineProgress >= 98
                    ? 'bg-brand ring-brand/30 scale-110 shadow-[0_0_12px_rgba(255,192,0,0.5),0_0_24px_rgba(255,192,0,0.25)] animate-[pulse_2.6s_ease-in-out_infinite]'
                    : 'bg-brand/35 ring-brand/10 scale-95'"
                ></div>
              </div>
            </div>

            <!-- Row 2: The timeline bar -->
            <div class="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-brand via-brand to-brand/60 rounded-full transition-all duration-[2000ms] ease-out"
                :style="{ width: `${timelineProgress}%` }"
              ></div>
            </div>

            <!-- Row 3: Text labels below the line -->
            <div class="relative h-20 mt-3">
              <!-- Start label -->
              <div
                class="absolute left-0 top-0 transition-all duration-700"
                :class="timelineProgress >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
              >
                <span class="text-sm font-semibold text-white">Hoje</span>
              </div>
              <!-- Week 8-12 label -->
              <div
                class="absolute left-[40%] top-0 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-700"
                :class="timelineProgress >= 45 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
              >
                <div class="text-xs text-brand font-semibold mb-0.5">SEMANAS 8–12</div>
                <div class="text-sm font-bold text-white">App v1 no ar</div>
                <div class="text-xs text-zinc-500 mt-0.5">MVP funcionando</div>
              </div>
              <!-- Week 16 label -->
              <div
                class="absolute left-[70%] top-0 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-700"
                :class="timelineProgress >= 75 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
              >
                <div class="text-xs text-zinc-500 mb-0.5">SEMANA 16</div>
                <div class="text-sm font-semibold text-zinc-300">App v2</div>
              </div>
              <!-- Week 20 label -->
              <div
                class="absolute right-0 top-0 text-right whitespace-nowrap transition-all duration-700 origin-top-right"
                :class="timelineProgress >= 100 ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-2 scale-95'"
              >
                <div class="text-xs text-zinc-500 mb-0.5">SEMANA 20</div>
                <div class="text-sm font-bold text-white">App v3</div>
                <div class="text-xs text-zinc-500 mt-0.5">Produto maduro</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Regular Development Timeline -->
        <div
          v-motion
          :initial="timelineReveal.initial"
          :visible-once="timelineReveal.visibleOnce"
          class="relative p-8 md:p-10 lg:p-12 rounded-2xl border border-white/[0.04] bg-zinc-900/30"
        >
          <div class="flex items-center gap-4 mb-8 md:mb-10">
            <div class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <PhClock :size="20" class="text-zinc-500" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-zinc-400">Desenvolvimento Tradicional</h3>
              <p class="text-sm text-zinc-600">Processo convencional</p>
            </div>
          </div>

          <div class="relative">
            <!-- Row 1: Dots above the line -->
            <div class="relative h-10 mb-3">
              <!-- Start dot -->
              <div class="absolute left-0 bottom-0 flex items-center justify-start">
                <div
                  class="w-5 h-5 rounded-full ring-4 transition-all duration-500"
                  :class="timelineProgress >= 3
                    ? 'bg-zinc-500 ring-zinc-800 shadow-[0_0_10px_rgba(161,161,170,0.35)] animate-[pulse_2.2s_ease-in-out_infinite]'
                    : 'bg-zinc-700 ring-zinc-900'"
                ></div>
              </div>
              <!-- Week 12 dot -->
              <div class="absolute left-[40%] bottom-0 -translate-x-1/2 flex items-center justify-center">
                <div
                  class="w-5 h-5 rounded-full transition-all duration-500"
                  :class="timelineProgress >= 40
                    ? 'bg-zinc-500 shadow-[0_0_8px_rgba(113,113,122,0.35)] animate-[pulse_2.5s_ease-in-out_infinite]'
                    : 'bg-zinc-700'"
                ></div>
              </div>
              <!-- Week 20 dot -->
              <div class="absolute right-0 bottom-0 flex items-center justify-end">
                <div
                  class="w-5 h-5 rounded-full transition-all duration-700"
                  :class="timelineProgress >= 98
                    ? 'bg-zinc-400 scale-110 shadow-[0_0_10px_rgba(161,161,170,0.4)] animate-[pulse_2.8s_ease-in-out_infinite]'
                    : 'bg-zinc-600 scale-95'"
                ></div>
              </div>
            </div>

            <!-- Row 2: The timeline bar -->
            <div class="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-zinc-600 rounded-full transition-all duration-[3000ms] ease-out"
                :style="{ width: `${timelineProgress}%` }"
              ></div>
            </div>

            <!-- Row 3: Text labels below the line -->
            <div class="relative h-16 mt-3">
              <!-- Start label -->
              <div
                class="absolute left-0 top-0 transition-all duration-700"
                :class="timelineProgress >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
              >
                <span class="text-sm font-semibold text-zinc-500">Hoje</span>
              </div>
              <!-- Week 12 label -->
              <div
                class="absolute left-[40%] top-0 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-700"
                :class="timelineProgress >= 45 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
              >
                <div class="text-xs text-zinc-600 mb-0.5">SEMANA 12</div>
                <div class="text-sm text-zinc-600 line-through">Ainda em dev</div>
              </div>
              <!-- Week 20 label -->
              <div
                class="absolute right-0 top-0 text-right whitespace-nowrap transition-all duration-700 origin-top-right"
                :class="timelineProgress >= 100 ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-2 scale-95'"
              >
                <div class="text-xs text-zinc-600 mb-0.5">SEMANA 20+</div>
                <div class="text-sm font-semibold text-zinc-500">App v1</div>
                <div class="text-xs text-zinc-600 mt-0.5">Primeira versão</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats row -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, delay: 300 } }"
          class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-12"
        >
          <div class="text-center p-5 md:p-6 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
            <div class="text-3xl md:text-4xl font-bold text-brand mb-2">3x</div>
            <div class="text-sm text-zinc-500">Mais rápido</div>
          </div>
          <div class="text-center p-5 md:p-6 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
            <div class="text-3xl md:text-4xl font-bold text-brand mb-2">-40%</div>
            <div class="text-sm text-zinc-500">Custo</div>
          </div>
          <div class="text-center p-5 md:p-6 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
            <div class="text-3xl md:text-4xl font-bold text-brand mb-2">v3</div>
            <div class="text-sm text-zinc-500">Em 20 semanas</div>
          </div>
          <div class="text-center p-5 md:p-6 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
            <div class="text-3xl md:text-4xl font-bold text-brand mb-2">∞</div>
            <div class="text-sm text-zinc-500">Iterações</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhLightning, PhRocket, PhClock } from '@phosphor-icons/vue'
import { sectionTitleReveal, useRevealFadeUpStagger } from '~/composables/useScrollRevealVariants'

const timelineReveal = useRevealFadeUpStagger(100)
const valeTimelineRef = ref<HTMLElement>()
const timelineProgress = ref(0)
const hasAnimatedTimeline = ref(false)

let progressRaf: number | null = null
let timelineObserver: IntersectionObserver | null = null

const animateTimelineProgress = () => {
  if (hasAnimatedTimeline.value) return
  hasAnimatedTimeline.value = true

  const duration = 3400
  const start = performance.now()

  const step = (currentTime: number) => {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    timelineProgress.value = Math.round(easedProgress * 100)

    if (progress < 1) {
      progressRaf = requestAnimationFrame(step)
    }
  }

  progressRaf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!valeTimelineRef.value) return

  timelineObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateTimelineProgress()
          timelineObserver?.disconnect()
          timelineObserver = null
          break
        }
      }
    },
    {
      threshold: 0.35,
      rootMargin: '0px 0px -10% 0px'
    }
  )

  timelineObserver.observe(valeTimelineRef.value)
})

onUnmounted(() => {
  timelineObserver?.disconnect()

  if (progressRaf !== null) {
    cancelAnimationFrame(progressRaf)
  }
})
</script>
