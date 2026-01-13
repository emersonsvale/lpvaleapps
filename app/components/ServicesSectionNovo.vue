<template>
  <section class="py-20">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Projetos que <p>desenvolvemos</p>
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conheça alguns dos aplicativos que desenvolvemos e como ajudamos nossos clientes a alcançar seus objetivos digitais.
        </p>
      </div>
      
      <!-- Bento Grid Layout - Exatamente como Inspira UI -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <!-- Card 1 - Fenci (Grande - 2 colunas) -->
        <div 
          ref="card1"
          :style="{ opacity: cardOpacities[0] }"
          class="md:col-span-2 group relative overflow-hidden rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <!-- Imagem real do projeto -->
          <div class="relative h-56 overflow-hidden">
            <img 
              src="https://framerusercontent.com/images/PYGY312hsQiQ9amSP5A6phSgc.png" 
              alt="Fenci App Interface"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/0 group-hover:from-black/5 to-transparent transition-all duration-300"></div>
          </div>
          
          <div class="p-6">
            <div class="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-3">
              Fintech
            </div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-2xl font-bold">Fenci</h3>
              <a href="https://fenci.com.br" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors">
                <PhArrowSquareOut :size="20" />
              </a>
            </div>
            <p class="text-muted-foreground mb-4">
              Aplicativo de gestão financeira pessoal multiplataforma (mobile e web). Controle de fluxo de caixa, cartões de crédito, metas financeiras, investimentos e assinatura premium com Stripe.
            </p>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span>Em produção</span>
              </div>
              <div class="flex items-center gap-1">
                <PhGlobe :size="14" />
                <span>fenci.com.br</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2 - Estatísticas (1 coluna) -->
        <div 
          ref="card2"
          :style="{ opacity: cardOpacities[1] }"
          class="group relative overflow-hidden rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <div class="text-center">
            <PhTrendUp :size="32" class="text-muted-foreground mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <div class="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">50+</div>
            <div class="text-sm font-medium mb-1 transition-colors duration-300">Projetos Entregues</div>
            <div class="text-xs text-muted-foreground">Nos últimos 2 anos</div>
          </div>
        </div>

        <!-- Card 3 - Oohh Food (1 coluna) -->
        <div 
          ref="card3"
          :style="{ opacity: cardOpacities[2] }"
          class="group relative overflow-hidden rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <!-- Imagem real do projeto -->
          <div class="relative h-40 overflow-hidden">
            <img 
              src="https://framerusercontent.com/images/YJXDxS5wiD3ORjqqItb6Mh2ZJzo.png" 
              alt="Oohh Food Interface"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/0 group-hover:from-black/5 to-transparent transition-all duration-300"></div>
          </div>
          
          <div class="p-6">
            <div class="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-3">
              Food Tech
            </div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-xl font-bold">Oohh Food</h3>
              <a href="https://app.oohhfood.com.br/" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors">
                <PhArrowSquareOut :size="18" />
              </a>
            </div>
            <p class="text-muted-foreground mb-4">
              Gestão completa para restaurantes. Do pedido na mesa ao delivery online.
            </p>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span>Em produção</span>
              </div>
              <div class="flex items-center gap-1">
                <PhGlobe :size="14" />
                <span>oohhfood.com.br</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4 - Zapifine (1 coluna) -->
        <div 
          ref="card4"
          :style="{ opacity: cardOpacities[3] }"
          class="group relative overflow-hidden rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <!-- Imagem real do projeto -->
          <div class="relative h-40 overflow-hidden">
            <img 
              src="https://framerusercontent.com/images/YfIR4f46Xn2tXf0JrrN6tbHVvAA.png" 
              alt="Zapifine Interface"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/0 group-hover:from-black/5 to-transparent transition-all duration-300"></div>
          </div>
          
          <div class="p-6">
            <div class="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-3">
              AI SaaS
            </div>
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-xl font-bold">Zapifine</h3>
              <a href="https://app.zapifine.com/" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors">
                <PhArrowSquareOut :size="18" />
              </a>
            </div>
            <p class="text-muted-foreground mb-4">
              SaaS Multi-tenant de automação WhatsApp com IA. CRM integrado e cobrança recorrente.
            </p>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span>Em produção</span>
              </div>
              <div class="flex items-center gap-1">
                <PhGlobe :size="14" />
                <span>zapifine.com</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5 - Tecnologias (1 coluna) -->
        <div 
          ref="card5"
          :style="{ opacity: cardOpacities[4] }"
          class="group relative overflow-hidden rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <div class="flex items-center gap-2 mb-4">
            <PhCode :size="20" class="text-muted-foreground group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span class="font-semibold text-sm transition-colors duration-300">Stack</span>
          </div>
          <div class="space-y-2">
          </div>
        </div>

        <!-- Card 6 - CTA (3 colunas - largura total) -->
        <div 
          ref="card6"
          :style="{ opacity: cardOpacities[5] }"
          class="md:col-span-3 group relative overflow-hidden rounded-lg p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer project-card"
        >
          <div class="text-center">
            <PhRocket :size="32" class="text-muted-foreground mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" />
            <h3 class="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">Pronto para o próximo projeto?</h3>
            <p class="text-muted-foreground mb-6 max-w-2xl mx-auto transition-colors duration-300">
              Vamos transformar sua ideia em realidade com tecnologia de ponta e design excepcional.
            </p>
            <div class="group-hover:scale-105 transition-transform duration-300">
              <a 
                href="https://wa.me/5511969210065?text=Olá! Gostaria de iniciar um projeto com a Vale Apps."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg">
                  Iniciar Projeto
                </Button>
              </a>
            </div>
          </div>
          <!-- Efeito de brilho animado -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  PhTrendUp,
  PhCode,
  PhRocket,
  PhArrowSquareOut,
  PhGlobe
} from '@phosphor-icons/vue'
import Button from '~/components/ui/Button.vue'

// Refs para os cards
const card1 = ref<HTMLElement>()
const card2 = ref<HTMLElement>()
const card3 = ref<HTMLElement>()
const card4 = ref<HTMLElement>()
const card5 = ref<HTMLElement>()
const card6 = ref<HTMLElement>()

// Opacidades dos cards (inicialmente todos visíveis)
const cardOpacities = ref([1, 1, 1, 1, 1, 1])

// Função para calcular opacidade baseada na posição do scroll
const updateCardOpacities = () => {
  const cards = [card1, card2, card3, card4, card5, card6]
  const viewportHeight = window.innerHeight
  const scrollY = window.scrollY

  cards.forEach((cardRef, index) => {
    if (!cardRef.value) return

    const rect = cardRef.value.getBoundingClientRect()
    const cardTop = rect.top + scrollY
    const cardBottom = cardTop + rect.height
    
    // Se o card já passou completamente (está acima do viewport)
    if (cardBottom < scrollY) {
      // Calcula a distância que o card já passou
      const distancePassed = scrollY - cardBottom
      // Fade out progressivo: quanto mais longe, mais transparente
      // Máximo de 500px para fade completo
      const fadeDistance = 500
      const opacity = Math.max(0, 1 - (distancePassed / fadeDistance))
      cardOpacities.value[index] = opacity
    } else {
      // Card ainda está visível ou não passou ainda
      cardOpacities.value[index] = 1
    }
  })
}

// Listener de scroll
let scrollListener: (() => void) | null = null

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

<style scoped>
.project-card {
  transition: opacity 0.3s ease-out;
}
</style>