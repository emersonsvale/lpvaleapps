<template>
  <div class="font-sans">
    <div class="px-[5%]">
      <div class="max-w-7xl mx-auto">
        <section class="py-24 md:py-48 flex flex-col items-center">
          <!-- Animated Header -->
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 
              ref="headerRef"
              :class="[
                'text-4xl md:text-5xl font-bold transition-all duration-700 ease-out text-gray-900 dark:text-white',
                headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              ]"
              style="transform-style: preserve-3d"
            >
              Projetos que Transformam Negócios
            </h2>
            <p 
              ref="pRef"
              :class="[
                'text-lg text-gray-600 dark:text-gray-300 mt-4 transition-all duration-700 ease-out delay-200',
                pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              ]"
              style="transform-style: preserve-3d"
            >
              Conheça alguns dos aplicativos que desenvolvemos e como ajudamos nossos clientes a alcançar seus objetivos digitais
            </p>
          </div>

          <!-- Sticky Cards Container -->
          <div class="w-full">
            <div
              v-for="(feature, index) in features"
              :key="index"
              :ref="el => setCardRef(el, index)"
              :style="{ 
                opacity: cardOpacities[index],
                transition: 'opacity 0.3s ease-out'
              }"
              class="grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-8 p-8 md:p-12 rounded-lg mb-16 sticky"
              style="top: 200px"
            >
              <!-- Card Content -->
              <div class="flex flex-col justify-center">
                <div class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium mb-4 w-fit">
                  {{ feature.category }}
                </div>
                <h3 class="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {{ feature.title }}
                </h3>
                <p :class="feature.textColor" class="mb-6">
                  {{ feature.description }}
                </p>
                <div v-if="feature.technologies" class="flex flex-wrap gap-2 mb-6">
                  <span 
                    v-for="tech in feature.technologies"
                    :key="tech"
                    class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium"
                  >
                    {{ tech }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2 text-sm">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="font-medium">No ar</span>
                  </div>
                  <a 
                    v-if="feature.link"
                    :href="feature.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 text-sm font-medium hover:underline transition-all duration-200 hover:scale-105"
                  >
                    <PhGlobe :size="16" />
                    <span>Visitar site</span>
                    <PhArrowSquareOut :size="16" />
                  </a>
                </div>
              </div>

              <!-- Card Image -->
              <div class="image-wrapper mt-8 md:mt-0">
                <img 
                  :src="optimizeImageUrl(feature.imageUrl, 800, 600)" 
                  :srcset="createImageSrcSet(feature.imageUrl, [400, 600, 800])"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  :alt="feature.title"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-auto rounded shadow-lg object-cover transition-opacity duration-300 opacity-0"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhGlobe, PhArrowSquareOut } from '@phosphor-icons/vue'

// Composable para otimização de imagens
const { optimizeImageUrl, createImageSrcSet } = useImageOptimization()

// Data for the feature cards
const features = [
  {
    title: "Fenci - Gestão Financeira",
    category: "Fintech",
    description: "Aplicativo de gestão financeira pessoal multiplataforma (mobile e web). Controle de fluxo de caixa, cartões de crédito, metas financeiras, investimentos e assinatura premium com Stripe.",
    imageUrl: "https://framerusercontent.com/images/PYGY312hsQiQ9amSP5A6phSgc.png?width=800&height=600",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://fenci.com.br",
    
  },
  {
    title: "Zapifine - Automação WhatsApp",
    category: "AI SaaS",
    description: "SaaS Multi-tenant de automação WhatsApp com IA. CRM integrado, chatbots inteligentes e cobrança recorrente. Plataforma completa para gestão de relacionamento com clientes.",
    imageUrl: "https://framerusercontent.com/images/YfIR4f46Xn2tXf0JrrN6tbHVvAA.png?width=800&height=600",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://app.zapifine.com",
  },
  {
    title: "Oohh Food - Gestão Restaurantes",
    category: "Food Tech",
    description: "Gestão completa para restaurantes. Do pedido na mesa ao delivery online. Sistema integrado de comandas, cardápio digital, gestão de estoque e relatórios financeiros.",
    imageUrl: "https://framerusercontent.com/images/YJXDxS5wiD3ORjqqItb6Mh2ZJzo.png?width=800&height=600",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://app.oohhfood.com.br",
  }
]

// Refs for intersection observer
const headerRef = ref<HTMLElement>()
const pRef = ref<HTMLElement>()

// Refs para os cards sticky
const cardRefs = ref<(HTMLElement | null)[]>([])
const cardOpacities = ref<number[]>([1, 1, 1])
const cardOriginalTops = ref<number[]>([])

// Função para setar refs dos cards
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    cardRefs.value[index] = el
    // Guardar a posição original do card no DOM
    if (cardOriginalTops.value[index] === undefined) {
      const rect = el.getBoundingClientRect()
      cardOriginalTops.value[index] = rect.top + window.scrollY
    }
  }
}

// Função para calcular opacidades baseadas no scroll
// O primeiro card some primeiro, depois o segundo, depois o terceiro...
const updateCardOpacities = () => {
  const stickyTop = 300 // Valor do top dos cards sticky
  
  cardRefs.value.forEach((card, index) => {
    if (!card) return
    
    const rect = card.getBoundingClientRect()
    const cardTop = rect.top
    const cardBottom = rect.bottom
    
    // Verificar se este card está sticky
    const isSticky = Math.abs(cardTop - stickyTop) < 15
    
    let isBeingOverlapped = false
    let fadeRatio = 0
    
    if (isSticky) {
      // Card está sticky, verificar se há um card DEPOIS dele que está se aproximando
      // O fade deve começar ANTES do próximo card ficar sticky
      for (let i = index + 1; i < cardRefs.value.length; i++) {
        const nextCard = cardRefs.value[i]
        if (!nextCard) continue
        
        const nextRect = nextCard.getBoundingClientRect()
        const nextCardTop = nextRect.top
        const nextCardBottom = nextRect.bottom
        
        // Verificar se o próximo card está sticky OU se está se aproximando do stickyTop
        const isNextSticky = Math.abs(nextCardTop - stickyTop) < 15
        const distanceToSticky = nextCardTop - stickyTop
        
        // Se o próximo card está sticky OU está a menos de 300px do stickyTop
        if (isNextSticky || (distanceToSticky > 0 && distanceToSticky < 300)) {
          isBeingOverlapped = true
          
          if (isNextSticky) {
            // Próximo card já está sticky e sobrepondo
            const overlapStart = stickyTop
            const overlapEnd = Math.min(nextCardBottom, cardBottom)
            const overlapHeight = Math.max(0, overlapEnd - overlapStart)
            fadeRatio = Math.min(1, overlapHeight / rect.height)
          } else {
            // Próximo card está se aproximando - começar fade antes
            // Quanto mais próximo do stickyTop, mais transparente
            // Inverter: quando distanceToSticky = 300, fadeRatio = 0
            // quando distanceToSticky = 0, fadeRatio = 1
            fadeRatio = Math.min(1, (300 - distanceToSticky) / 300)
          }
          break
        }
      }
    } else {
      // Card não está sticky
      // Se o bottom do card está acima do stickyTop, já passou completamente
      if (cardBottom < stickyTop) {
        // Card já passou completamente - opacidade 0
        cardOpacities.value[index] = 0
        return // Pular para o próximo card
      }
      // Se está acima do stickyTop mas ainda não passou completamente, aplicar fade
      if (cardTop < stickyTop) {
        isBeingOverlapped = true
        const distancePassed = stickyTop - cardTop
        const fadeDistance = 100
        fadeRatio = Math.min(1, distancePassed / fadeDistance)
      }
    }
    
    // Aplicar fade out baseado na sobreposição ou distância
    if (isBeingOverlapped) {
      // Quanto mais sobreposto/distante, mais transparente
      // Garantir que quando fadeRatio >= 1, opacidade seja 0
      cardOpacities.value[index] = fadeRatio >= 1 ? 0 : Math.max(0, 1 - fadeRatio)
    } else {
      // Se não está sendo sobreposto, manter visível
      cardOpacities.value[index] = 1
    }
  })
}

// Listener de scroll
let scrollListener: (() => void) | null = null

// Usar intersection observer otimizado
const { isIntersecting: headerInView } = useIntersectionObserver(
  headerRef,
  () => {},
  { threshold: 0, rootMargin: '50px' }
)

const { isIntersecting: pInView } = useIntersectionObserver(
  pRef,
  () => {},
  { threshold: 0, rootMargin: '50px' }
)

// Image handlers
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = "https://placehold.co/800x600/cccccc/ffffff?text=Image+Not+Found"
}

const handleImageLoad = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.opacity = '1'
}

// Setup scroll listener
onMounted(() => {
  // Atualizar opacidades inicialmente
  updateCardOpacities()
  
  // Adicionar listener de scroll otimizado
  scrollListener = () => {
    requestAnimationFrame(updateCardOpacities)
  }
  
  window.addEventListener('scroll', scrollListener, { passive: true })
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener)
  }
})
</script>
