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
              :class="[
                feature.bgColor,
                'grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-8 p-8 md:p-12 rounded-lg mb-16 sticky'
              ]"
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
    bgColor: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://fenci.com.br",
    technologies: ["Vue.js", "Node.js", "Stripe", "MongoDB"]
  },
  {
    title: "Zapifine - Automação WhatsApp",
    category: "AI SaaS",
    description: "SaaS Multi-tenant de automação WhatsApp com IA. CRM integrado, chatbots inteligentes e cobrança recorrente. Plataforma completa para gestão de relacionamento com clientes.",
    imageUrl: "https://framerusercontent.com/images/YfIR4f46Xn2tXf0JrrN6tbHVvAA.png?width=800&height=600",
    bgColor: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://app.zapifine.com",
    technologies: ["React", "OpenAI", "WhatsApp API", "PostgreSQL"]
  },
  {
    title: "Oohh Food - Gestão Restaurantes",
    category: "Food Tech",
    description: "Gestão completa para restaurantes. Do pedido na mesa ao delivery online. Sistema integrado de comandas, cardápio digital, gestão de estoque e relatórios financeiros.",
    imageUrl: "https://framerusercontent.com/images/YJXDxS5wiD3ORjqqItb6Mh2ZJzo.png?width=800&height=600",
    bgColor: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-200",
    link: "https://app.oohhfood.com.br",
    technologies: ["Flutter", "Firebase", "Node.js", "MySQL"]
  }
]

// Refs for intersection observer
const headerRef = ref<HTMLElement>()
const pRef = ref<HTMLElement>()

// Usar intersection observer otimizado
const { isIntersecting: headerInView } = useIntersectionObserver(
  headerRef,
  () => {},
  { threshold: 0.1, rootMargin: '50px' }
)

const { isIntersecting: pInView } = useIntersectionObserver(
  pRef,
  () => {},
  { threshold: 0.1, rootMargin: '50px' }
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
</script>
