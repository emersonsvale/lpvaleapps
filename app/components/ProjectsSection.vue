<template>
  <section class="py-20 md:py-32">
    <div class="container mx-auto px-6">
      <div
        v-motion
        :initial="sectionTitleReveal.initial"
        :visible-once="sectionTitleReveal.visibleOnce"
        class="text-center mb-16 md:mb-20"
      >
        <p class="text-sm uppercase tracking-widest text-brand mb-4 font-medium">Portfólio</p>
        <h2 class="text-4xl md:text-6xl font-medium mb-6 leading-tight">
          Cases que <span class="text-brand">transformam</span> <span class="block">negócios</span>
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Conheça os aplicativos e plataformas que desenvolvemos para nossos clientes com tecnologia de ponta.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div v-for="i in 3" :key="i" class="rounded-2xl bg-muted/20 h-[520px] animate-pulse border border-white/[0.03]" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!projetos?.length" class="text-center py-20">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/20 flex items-center justify-center">
          <PhBriefcase :size="28" class="text-muted-foreground" />
        </div>
        <p class="text-muted-foreground">Nenhum projeto disponível no momento.</p>
      </div>

      <!-- Grid de projetos -->
      <div
        v-else
        ref="gridRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        <article
          v-for="(projeto, index) in projetos"
          :key="projeto.id"
          v-motion
          :initial="cardReveal.initial"
          :visible-once="{ ...cardReveal.visibleOnce, transition: { ...cardReveal.visibleOnce.transition, delay: index * 100 } }"
          :data-index="index"
          :style="{ opacity: cardOpacities[index] ?? 1 }"
          class="group project-card"
        >
          <div class="relative h-full">
            <div class="relative bg-zinc-900/80 rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden h-full transition-all duration-500 hover:border-brand/20 hover:shadow-[0_8px_40px_rgba(255,192,0,0.08)]">
              <!-- Image container -->
              <div class="relative h-[320px] md:h-[360px] overflow-hidden">
                <img
                  v-if="imageUrl(projeto)"
                  :src="imageUrl(projeto)!"
                  :alt="`Interface do projeto ${projeto.titulo ?? 'Vale Apps'}`"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width="600"
                  height="360"
                />
                <div v-else class="w-full h-full bg-muted/20 flex items-center justify-center">
                  <PhImage :size="40" class="text-muted-foreground/40" />
                </div>
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                
                <!-- Links floating top-right -->
                <div v-if="hasAnyLink(projeto)" class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <a
                    v-if="projeto.link_web"
                    :href="projeto.link_web"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Visitar site do ${projeto.titulo ?? 'projeto'}`"
                    class="p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-brand hover:bg-black/60 transition-all duration-200 border border-white/10"
                    title="Visitar site"
                  >
                    <PhGlobe :size="18" />
                  </a>
                  <a
                    v-if="projeto.link_google"
                    :href="projeto.link_google"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Abrir na Google Play: ${projeto.titulo ?? 'projeto'}`"
                    class="p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-brand hover:bg-black/60 transition-all duration-200 border border-white/10"
                    title="Google Play"
                  >
                    <PhGooglePlayLogo :size="18" />
                  </a>
                  <a
                    v-if="projeto.link_apple"
                    :href="projeto.link_apple"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Abrir na App Store: ${projeto.titulo ?? 'projeto'}`"
                    class="p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-brand hover:bg-black/60 transition-all duration-200 border border-white/10"
                    title="App Store"
                  >
                    <PhAppleLogo :size="18" />
                  </a>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 md:p-7">
                <h3 class="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-brand transition-colors duration-300">
                  {{ projeto.titulo ?? 'Projeto' }}
                </h3>
                <p class="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3">
                  {{ projeto.descricao ?? '' }}
                </p>
                
                <!-- Bottom bar -->
                <div class="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-xs text-zinc-500 font-medium uppercase tracking-wider">No ar</span>
                  </div>
                  <div v-if="projeto.link_web" class="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-brand transition-colors duration-300">
                    <span>Ver projeto</span>
                    <PhArrowUpRight :size="14" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { PhGlobe, PhGooglePlayLogo, PhAppleLogo, PhArrowUpRight, PhImage, PhBriefcase } from '@phosphor-icons/vue'
import { sectionTitleReveal, useRevealFadeUpStagger } from '~/composables/useScrollRevealVariants'
import type { Projeto } from '~/composables/useProjetos'

const cardReveal = useRevealFadeUpStagger(0)

const { data: projetosData, pending } = await useAsyncData('projetos-section', () => useProjetos())
const projetos = computed(() => projetosData.value ?? [])

const gridRef = ref<HTMLElement>()
const cardOpacities = ref<number[]>([])

function imageUrl(projeto: Projeto): string | null {
  if (projeto.capa) return projeto.capa
  const imgs = projeto.imgens
  if (Array.isArray(imgs) && imgs.length > 0) return imgs[0]
  return null
}

function hasAnyLink(projeto: Projeto): boolean {
  return !!(projeto.link_web?.trim() || projeto.link_google?.trim() || projeto.link_apple?.trim())
}

function updateCardOpacities() {
  if (!gridRef.value) return
  const cards = gridRef.value.querySelectorAll<HTMLElement>('.project-card')
  const viewportHeight = window.innerHeight
  const scrollY = window.scrollY
  const next = Array.from(cards).map((el, index) => {
    const rect = el.getBoundingClientRect()
    const cardTop = rect.top + scrollY
    const cardBottom = cardTop + rect.height
    if (cardBottom < scrollY) {
      const distancePassed = scrollY - cardBottom
      const fadeDistance = 500
      return Math.max(0, 1 - distancePassed / fadeDistance)
    }
    return 1
  })
  cardOpacities.value = next
}

let scrollListener: (() => void) | null = null

function attachScroll() {
  updateCardOpacities()
  scrollListener = () => requestAnimationFrame(updateCardOpacities)
  window.addEventListener('scroll', scrollListener, { passive: true })
}

function detachScroll() {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
    scrollListener = null
  }
}

onMounted(() => {
  attachScroll()
})

onUnmounted(() => {
  detachScroll()
})

watch(projetos, () => {
  cardOpacities.value = (projetos.value ?? []).map(() => 1)
}, { immediate: true })
</script>

<style scoped>
.project-card {
  transition: opacity 0.3s ease-out;
}

.project-card .relative.bg-gradient-to-b {
  box-sizing: content-box;
}
</style>
