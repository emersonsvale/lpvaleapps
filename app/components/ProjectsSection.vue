<template>
  <section class="py-20">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-medium mb-6">
          Cases incríveis <span class="block">que construímos</span>
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conheça alguns dos aplicativos mobile e web que desenvolvemos e como ajudamos nossos clientes a alcançar seus objetivos digitais com tecnologia de ponta.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto">
        <div v-for="i in 4" :key="i" class="rounded-lg bg-muted/30 h-[480px] animate-pulse" />
      </div>

      <!-- Empty state -->
      <p v-else-if="!projetos?.length" class="text-center text-muted-foreground py-12">
        Nenhum projeto disponível no momento.
      </p>

      <!-- Grid de projetos -->
      <div
        v-else
        ref="gridRef"
        class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto"
      >
        <div
          v-for="(projeto, index) in projetos"
          :key="projeto.id"
          :data-index="index"
          :style="{ opacity: cardOpacities[index] ?? 1 }"
          class="group project-card"
        >
          <div class="relative">
            <div class="relative mx-auto max-w-full">
              <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                <div class="relative bg-black h-[480px]">
                  <img
                    v-if="imageUrl(projeto)"
                    :src="imageUrl(projeto)!"
                    :alt="`Interface do projeto ${projeto.titulo ?? 'Vale Apps'}`"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full bg-muted/50 flex items-center justify-center">
                    <span class="text-muted-foreground text-sm">Sem imagem</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                  <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3 flex-wrap">
                        <h3 class="text-2xl md:text-3xl font-medium text-white">
                          {{ projeto.titulo ?? 'Projeto' }}
                        </h3>
                        <div v-if="hasAnyLink(projeto)" class="flex items-center gap-2">
                          <a
                            v-if="projeto.link_web"
                            :href="projeto.link_web"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="`Visitar site do ${projeto.titulo ?? 'projeto'}`"
                            class="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            title="Visitar site"
                          >
                            <PhGlobe :size="20" />
                          </a>
                          <a
                            v-if="projeto.link_google"
                            :href="projeto.link_google"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="`Abrir na Google Play: ${projeto.titulo ?? 'projeto'}`"
                            class="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            title="Google Play"
                          >
                            <PhGooglePlayLogo :size="20" />
                          </a>
                          <a
                            v-if="projeto.link_apple"
                            :href="projeto.link_apple"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="`Abrir na App Store: ${projeto.titulo ?? 'projeto'}`"
                            class="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            title="App Store"
                          >
                            <PhAppleLogo :size="20" />
                          </a>
                        </div>
                      </div>
                      <p class="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl line-clamp-4">
                        {{ projeto.descricao ?? '' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { PhGlobe, PhGooglePlayLogo, PhAppleLogo } from '@phosphor-icons/vue'
import type { Projeto } from '~/composables/useProjetos'

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
