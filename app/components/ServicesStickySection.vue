<template>
  <section class="relative bg-background">
    <!-- Header Section -->
    <div class="container mx-auto px-6 py-6">
      <div class="text-center max-w-4xl mx-auto">
        <p class="text-sm uppercase tracking-wider text-brand mb-4">
          TUDO QUE FAZEMOS FAZEMOS INTENSAMENTE
        </p>
        <h2 class="text-5xl md:text-7xl font-medium mb-6">
          Você pensa, <span class="block">nós construímos</span>
        </h2>
        <p class="text-xl text-muted-foreground">
          Transformamos sua visão em realidade digital. Nossa expertise em desenvolvimento mobile, web e automação une-se à sua ideia para criar soluções que impulsionam resultados.
        </p>
      </div>
    </div>

    <!-- Sticky Scroll Sections -->
    <div class="relative">
      <!-- Section 1 - FlutterFlow -->
      <div 
        ref="section1"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 0 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <!-- Left Column -->
            <div class="space-y-6">
              <h3 class="text-5xl md:text-6xl font-medium">Desenvolvimento com FlutterFlow</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Utilizamos FlutterFlow para ajudar mais de 30 empresas de todos os tamanhos a entrar no mercado em tempo recorde. Desenvolvemos aplicativos mobile e web totalmente escaláveis, com performance nativa e experiência de usuário excepcional.
              </p>
              <!-- Image -->
              <div class="relative h-64 w-full mt-8">
                <img 
                  src="/68220c098ed4ed1d7d323d4c_FlutterFlow.avif" 
                  alt="Desenvolvimento de aplicativos mobile e web com FlutterFlow - Plataforma low-code para criação rápida de apps"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhPaperPlaneTilt :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento Cross-platform com Flutter & FlutterFlow</h4>
                  <p class="text-muted-foreground">
                    Criamos aplicativos nativos iOS/Android e web responsivos a partir de uma única base de código.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhCode :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Código Customizado FlutterFlow</h4>
                  <p class="text-muted-foreground">
                    Desenvolvimento ilimitado importando código Flutter customizado para funcionalidades avançadas.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhLink :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Integrações com FlutterFlow</h4>
                  <p class="text-muted-foreground">
                    Integramos APIs customizadas, ferramentas de negócio e provedores de pagamento como Stripe e RevenueCat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 - Web App Development -->
      <div 
        ref="section2"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 1 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <!-- Left Column -->
            <div class="space-y-6">
              <h3 class="text-5xl md:text-6xl font-medium">Desenvolvimento Web</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                O desenvolvimento do seu produto não precisa mais levar meses. Com nossa abordagem moderna e utilização inteligente de tecnologias como Vue.js, React e Next.js, você pode lançar aplicativos web completos e escaláveis em semanas.
              </p>
              <!-- Image -->
              <div class="relative h-64 w-full mt-8">
                <img 
                  src="/6822eda0e7eeae0b4a26549b_Web App Development.avif" 
                  alt="Desenvolvimento de aplicações web modernas - SaaS, dashboards B2B e sistemas web responsivos"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhSquaresFour :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento de Dashboard B2B</h4>
                  <p class="text-muted-foreground">
                    Criamos soluções focadas na experiência do usuário B2B e fluxos de trabalho otimizados.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhGear :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento de Aplicações SaaS Web</h4>
                  <p class="text-muted-foreground">
                    Desenvolvimento completo de aplicativos SaaS incluindo design, desenvolvimento e integrações de pagamento.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhGlobe :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Design e Desenvolvimento de Aplicações Web</h4>
                  <p class="text-muted-foreground">
                    Expertise em UI/UX para produtos personalizados e centrados no usuário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3 - Mobile App Development -->
      <div 
        ref="section3"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 2 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <!-- Left Column -->
            <div class="space-y-6">
              <h3 class="text-5xl md:text-6xl font-medium">Desenvolvimento Mobile</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Utilizando as tecnologias mais modernas como Flutter, React Native e desenvolvimento nativo, entregamos aplicativos mobile para iOS e Android com máxima eficiência, performance e experiência do usuário.
              </p>
              <!-- Image -->
              <div class="relative h-64 w-full mt-8">
                <img 
                  src="/6822eda0b0430eb3b83683ed_Mobile App Development.avif" 
                  alt="Desenvolvimento de aplicativos mobile - iOS, Android e cross-platform com Flutter e React Native"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhArrowsOut :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento Cross-platform</h4>
                  <p class="text-muted-foreground">
                    Desenvolvemos experiências escaláveis e fáceis de manter para iOS, Android e Web.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhDeviceMobile :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento de Apps Mobile para Negócios</h4>
                  <p class="text-muted-foreground">
                    Entregamos experiência de usuário de primeira linha para aplicativos mobile empresariais.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                  <PhPaperPlaneTilt :size="24" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-bold text-lg mb-2">Desenvolvimento Low-code</h4>
                  <p class="text-muted-foreground">
                    Low-code permite criar aplicativos mobile customizados e completos em tempo recorde.
                  </p>
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
  PhCode,
  PhPaperPlaneTilt,
  PhLink,
  PhMonitor,
  PhSquaresFour,
  PhGear,
  PhGlobe,
  PhDeviceMobile,
  PhArrowsOut
} from '@phosphor-icons/vue'

const section1 = ref<HTMLElement>()
const section2 = ref<HTMLElement>()
const section3 = ref<HTMLElement>()

const activeSection = ref(0)

const updateActiveSection = () => {
  const sections = [section1, section2, section3]
  const viewportHeight = window.innerHeight

  sections.forEach((sectionRef, index) => {
    if (!sectionRef.value) return

    const rect = sectionRef.value.getBoundingClientRect()
    const sectionTop = rect.top
    const sectionCenter = sectionTop + rect.height / 2

    // Se o centro da seção está no viewport
    if (sectionCenter >= 0 && sectionCenter <= viewportHeight) {
      activeSection.value = index
    }
  })
}

let scrollListener: (() => void) | null = null

onMounted(() => {
  updateActiveSection()
  
  scrollListener = () => {
    requestAnimationFrame(updateActiveSection)
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
.sticky-section {
  position: sticky;
  top: 0;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: hsl(var(--background));
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.sticky-section:not(.is-active) {
  opacity: 0.4;
  transform: scale(0.98);
}

.sticky-section.is-active {
  opacity: 1;
  z-index: 2;
  transform: scale(1);
}

/* Garantir que cada seção tenha altura suficiente para o scroll */
.sticky-section > div {
  width: 100%;
}
</style>
