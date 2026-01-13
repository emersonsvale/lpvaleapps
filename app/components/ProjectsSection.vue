<template>
  <section class="py-20">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-medium mb-6">
          Projetos que <span class="block">desenvolvemos</span>
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conheça alguns dos aplicativos mobile e web que desenvolvemos e como ajudamos nossos clientes a alcançar seus objetivos digitais com tecnologia de ponta.
        </p>
      </div>
      
      <!-- Grid de 2 colunas - Formato Showcase -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
        <!-- Card 1 - Fenci -->
        <div 
          ref="card1"
          :style="{ opacity: cardOpacities[0] }"
          class="group project-card"
        >
          <div class="relative">
            <!-- Mockup Laptop -->
            <div class="relative mx-auto max-w-full">
              <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                <!-- Screen -->
                <div class="relative bg-black h-[400px]">
                  <img 
                    src="https://framerusercontent.com/images/PYGY312hsQiQ9amSP5A6phSgc.png" 
                    alt="Interface do aplicativo Fenci - Gestão financeira pessoal multiplataforma"
                    class="w-full h-full object-cover"
                  />
                  <!-- Overlay com gradiente para legibilidade do texto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                  
                  <!-- Texto sobreposto -->
                  <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-2xl md:text-3xl font-medium text-white">Fenci</h3>
                        <a href="https://fenci.com.br" target="_blank" rel="noopener noreferrer" aria-label="Visitar site do Fenci" class="text-white/80 hover:text-white transition-colors">
                          <PhArrowSquareOut :size="20" />
                        </a>
                      </div>
                      <p class="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                        Aplicativo de gestão financeira pessoal multiplataforma desenvolvido para iOS, Android e Web. Sistema completo de controle de fluxo de caixa, gestão de cartões de crédito, metas financeiras, investimentos e assinatura premium integrada com Stripe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2 - Oohh Food -->
        <div 
          ref="card2"
          :style="{ opacity: cardOpacities[1] }"
          class="group project-card"
        >
          <div class="relative">
            <!-- Mockup Laptop -->
            <div class="relative mx-auto max-w-full">
              <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                <!-- Screen -->
                <div class="relative bg-black h-[400px]">
                  <img 
                    src="https://framerusercontent.com/images/YJXDxS5wiD3ORjqqItb6Mh2ZJzo.png" 
                    alt="Interface do sistema Oohh Food - Gestão completa para restaurantes"
                    class="w-full h-full object-cover"
                  />
                  <!-- Overlay com gradiente para legibilidade do texto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                  
                  <!-- Texto sobreposto -->
                  <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-2xl md:text-3xl font-medium text-white">Oohh Food</h3>
                        <a href="https://app.oohhfood.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Visitar site do Oohh Food" class="text-white/80 hover:text-white transition-colors">
                          <PhArrowSquareOut :size="20" />
                        </a>
                      </div>
                      <p class="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                        Sistema completo de gestão para restaurantes desenvolvido para otimizar operações. Solução integrada que cobre desde pedidos na mesa até delivery online, facilitando a administração do estabelecimento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3 - Zapifine -->
        <div 
          ref="card3"
          :style="{ opacity: cardOpacities[2] }"
          class="group project-card"
        >
          <div class="relative">
            <!-- Mockup Laptop -->
            <div class="relative mx-auto max-w-full">
              <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                <!-- Screen -->
                <div class="relative bg-black h-[400px]">
                  <img 
                    src="https://framerusercontent.com/images/YfIR4f46Xn2tXf0JrrN6tbHVvAA.png" 
                    alt="Interface da plataforma Zapifine - Automação WhatsApp com IA e CRM"
                    class="w-full h-full object-cover"
                  />
                  <!-- Overlay com gradiente para legibilidade do texto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                  
                  <!-- Texto sobreposto -->
                  <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-2xl md:text-3xl font-medium text-white">Zapifine</h3>
                        <a href="https://app.zapifine.com/" target="_blank" rel="noopener noreferrer" aria-label="Visitar site do Zapifine" class="text-white/80 hover:text-white transition-colors">
                          <PhArrowSquareOut :size="20" />
                        </a>
                      </div>
                      <p class="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                        Plataforma SaaS multi-tenant de automação WhatsApp com inteligência artificial. Sistema completo com CRM integrado, automação de atendimento e sistema de cobrança recorrente para escalar seu negócio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4 - BroGym -->
        <div 
          ref="card4"
          :style="{ opacity: cardOpacities[3] }"
          class="group project-card"
        >
          <div class="relative">
            <!-- Mockup Laptop -->
            <div class="relative mx-auto max-w-full">
              <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden">
                <!-- Screen -->
                <div class="relative bg-black h-[400px]">
                  <img 
                    src="/Gemini_Generated_Image_8hkox38hkox38hko.png" 
                    alt="Interface do aplicativo BroGym - Treino com IA"
                    class="w-full h-full object-cover"
                  />
                  <!-- Overlay com gradiente para legibilidade do texto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                  
                  <!-- Texto sobreposto -->
                  <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-2xl md:text-3xl font-medium text-white">BroGym: Treino com IA</h3>
                        <a href="https://brogym.valeapps.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Visitar site do BroGym" class="text-white/80 hover:text-white transition-colors">
                          <PhArrowSquareOut :size="20" />
                        </a>
                      </div>
                      <p class="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                        O BroGym é uma aplicação mobile desenvolvida para preencher a lacuna entre o treino amador e a orientação profissional. O objetivo foi criar uma solução escalável onde a Inteligência Artificial atua como um personal trainer, adaptando rotinas de exercícios baseadas no feedback diário do usuário.
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
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  PhArrowSquareOut
} from '@phosphor-icons/vue'

// Refs para os cards
const card1 = ref<HTMLElement>()
const card2 = ref<HTMLElement>()
const card3 = ref<HTMLElement>()
const card4 = ref<HTMLElement>()

// Opacidades dos cards (inicialmente todos visíveis)
const cardOpacities = ref([1, 1, 1, 1])

// Função para calcular opacidade baseada na posição do scroll
const updateCardOpacities = () => {
  const cards = [card1, card2, card3, card4]
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

/* Aplicar box-sizing: content-box aos mockups de laptop */
.project-card .relative.bg-gradient-to-b {
  box-sizing: content-box;
}
</style>