<template>
  <section class="relative bg-background">
    <!-- Header Section -->
    <div class="container mx-auto px-6 pb-2 pt-6">
      <div
        v-motion
        :initial="headerReveal.initial"
        :visible-once="headerReveal.visibleOnce"
        class="text-center max-w-4xl mx-auto"
      >
        <p class="text-sm uppercase tracking-widest text-brand mb-4 font-medium">
          NOSSOS SERVIÇOS
        </p>
        <h2 class="text-5xl md:text-7xl font-medium mb-6 leading-tight">
          Você pensa, <span class="block text-brand">nós construímos</span>
        </h2>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transformamos sua visão em realidade digital com soluções completas de desenvolvimento.
        </p>

        <!-- Section progress indicator -->
        <div class="flex items-center justify-center gap-2 mt-10">
          <button 
            v-for="(label, index) in sectionLabels" 
            :key="index"
            @click="scrollToStickySection(index)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 cursor-pointer"
            :class="activeSection === index 
              ? 'bg-brand/10 text-brand border border-brand/20' 
              : 'text-zinc-600 hover:text-zinc-400 border border-transparent'"
          >
            <span class="w-1.5 h-1.5 rounded-full transition-all duration-500" :class="activeSection === index ? 'bg-brand' : 'bg-zinc-700'"></span>
            <span class="hidden sm:inline">{{ label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sticky Scroll Sections -->
    <div class="relative">
      <!-- Section 1 - Web App Development -->
      <div 
        ref="section1"
        class="sticky-section sticky-section--first"
        :class="{ 'is-active': activeSection === 0 }"
      >
        <div class="container mx-auto px-6 pt-4 pb-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <!-- Left Column -->
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 border border-brand/10 text-brand text-sm font-medium">
                <PhGlobe :size="14" />
                Web
              </div>
              <h3 class="text-5xl md:text-6xl font-medium">Desenvolvimento Web</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                O desenvolvimento do seu produto não precisa mais levar meses. Com nossa abordagem moderna e utilização inteligente de tecnologias como Vue.js, React e Next.js, você pode lançar aplicativos web completos e escaláveis em semanas.
              </p>
              <!-- Image -->
              <div class="relative h-64 w-full mt-8 overflow-hidden rounded-xl">
                <img 
                  src="/6822eda0e7eeae0b4a26549b_Web App Development.avif" 
                  alt="Desenvolvimento de aplicações web modernas - SaaS, dashboards B2B e sistemas web responsivos"
                  class="w-full h-full object-cover"
                  width="800"
                  height="256"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div v-for="(item, i) in webFeatures" :key="i" class="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-xl">
                  <component :is="item.icon" :size="22" class="text-brand" />
                </div>
                <div>
                  <h4 class="font-semibold text-lg mb-1.5">{{ item.title }}</h4>
                  <p class="text-muted-foreground text-sm leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2 - Mobile App Development -->
      <div 
        ref="section2"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 1 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-sm font-medium">
                <PhDeviceMobile :size="14" />
                Mobile
              </div>
              <h3 class="text-5xl md:text-6xl font-medium">Desenvolvimento Mobile</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Utilizando as tecnologias mais modernas como Flutter, React Native e desenvolvimento nativo, entregamos aplicativos mobile para iOS e Android com máxima eficiência, performance e experiência do usuário.
              </p>
              <div class="relative h-64 w-full mt-8 overflow-hidden rounded-xl">
                <img 
                  src="/6822eda0b0430eb3b83683ed_Mobile App Development.avif" 
                  alt="Desenvolvimento de aplicativos mobile - iOS, Android e cross-platform com Flutter e React Native"
                  class="w-full h-full object-cover"
                  width="800"
                  height="256"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="(item, i) in mobileFeatures" :key="i" class="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500/10 rounded-xl">
                  <component :is="item.icon" :size="22" class="text-blue-400" />
                </div>
                <div>
                  <h4 class="font-semibold text-lg mb-1.5">{{ item.title }}</h4>
                  <p class="text-muted-foreground text-sm leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3 - Automação -->
      <div 
        ref="section3"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 2 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-400 text-sm font-medium">
                <PhRobot :size="14" />
                Automação
              </div>
              <h3 class="text-5xl md:text-6xl font-medium">Automação</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Acabe com as planilhas e com dezenas de sistemas diferentes em telas distintas, através de uma solução de automação sob medida!
              </p>
              <div class="relative h-64 w-full mt-8 overflow-hidden rounded-xl">
                <img
                  src="/68220c098ed4ed1d7d323d4c_FlutterFlow.avif"
                  alt="Automação de processos e integração entre sistemas"
                  class="w-full h-full object-cover"
                  width="800"
                  height="256"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="(item, i) in automationFeatures" :key="i" class="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-500/10 rounded-xl">
                  <component :is="item.icon" :size="22" class="text-purple-400" />
                </div>
                <div>
                  <h4 class="font-semibold text-lg mb-1.5">{{ item.title }}</h4>
                  <p class="text-muted-foreground text-sm leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4 - IA -->
      <div 
        ref="section4"
        class="sticky-section"
        :class="{ 'is-active': activeSection === 3 }"
      >
        <div class="container mx-auto px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm font-medium">
                <PhBrain :size="14" />
                Inteligência Artificial
              </div>
              <h3 class="text-5xl md:text-6xl font-medium">Soluções com IA</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Aplicamos IA para extrair insights, automatizar decisões e criar experiências mais inteligentes no seu produto — desde assistentes e análise de dados até funcionalidades que aprendem com o uso.
              </p>
              <div class="relative h-64 w-full mt-8 overflow-hidden rounded-xl">
                <img
                  src="/6822eda0b0430eb3b83683ed_Mobile App Development.avif"
                  alt="Soluções com Inteligência Artificial - IA aplicada a negócios"
                  class="w-full h-full object-cover"
                  width="800"
                  height="256"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="(item, i) in aiFeatures" :key="i" class="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300">
                <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl">
                  <component :is="item.icon" :size="22" class="text-emerald-400" />
                </div>
                <div>
                  <h4 class="font-semibold text-lg mb-1.5">{{ item.title }}</h4>
                  <p class="text-muted-foreground text-sm leading-relaxed">{{ item.description }}</p>
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
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
import { sectionTitleReveal } from '~/composables/useScrollRevealVariants'
import {
  PhSquaresFour,
  PhGear,
  PhGlobe,
  PhDeviceMobile,
  PhArrowsOut,
  PhPaperPlaneTilt,
  PhRobot,
  PhPlugsConnected,
  PhBrain,
  PhChartLineUp,
  PhCpu
} from '@phosphor-icons/vue'

const headerReveal = sectionTitleReveal

const sectionLabels = ['Web', 'Mobile', 'Automação', 'IA']

const webFeatures = [
  { icon: markRaw(PhSquaresFour), title: 'Dashboards B2B', description: 'Soluções focadas na experiência do usuário B2B e fluxos de trabalho otimizados.' },
  { icon: markRaw(PhGear), title: 'Aplicações SaaS', description: 'Desenvolvimento completo de SaaS incluindo design, desenvolvimento e integrações de pagamento.' },
  { icon: markRaw(PhGlobe), title: 'Aplicações Web', description: 'Expertise em UI/UX para produtos personalizados e centrados no usuário.' },
]

const mobileFeatures = [
  { icon: markRaw(PhArrowsOut), title: 'Cross-platform', description: 'Experiências escaláveis para iOS, Android e Web com um único código.' },
  { icon: markRaw(PhDeviceMobile), title: 'Apps Empresariais', description: 'Experiência de usuário premium para aplicativos mobile empresariais.' },
  { icon: markRaw(PhPaperPlaneTilt), title: 'Low-code', description: 'Criação de apps mobile customizados e completos em tempo recorde.' },
]

const automationFeatures = [
  { icon: markRaw(PhRobot), title: 'Workflows Inteligentes', description: 'Conectamos seus sistemas e eliminamos tarefas repetitivas com automação.' },
  { icon: markRaw(PhPlugsConnected), title: 'Integração de Sistemas', description: 'Um único painel para dados espalhados em planilhas e ferramentas diferentes.' },
  { icon: markRaw(PhGear), title: 'Solução Sob Medida', description: 'Automação desenhada para o seu processo, sem adaptar seu negócio a ferramentas genéricas.' },
]

const aiFeatures = [
  { icon: markRaw(PhBrain), title: 'Assistentes com IA', description: 'Atendimento, suporte e produtividade com modelos de linguagem integrados ao seu fluxo.' },
  { icon: markRaw(PhChartLineUp), title: 'Análise e Insights', description: 'Extração de padrões, previsões e recomendações a partir dos seus dados.' },
  { icon: markRaw(PhCpu), title: 'Features Inteligentes', description: 'Recursos personalizados que evoluem com o uso e melhoram a experiência.' },
]

const section1 = ref<HTMLElement>()
const section2 = ref<HTMLElement>()
const section3 = ref<HTMLElement>()
const section4 = ref<HTMLElement>()

const activeSection = ref(0)

const scrollToStickySection = (index: number) => {
  const sections = [section1, section2, section3, section4]
  const target = sections[index]?.value
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const updateActiveSection = () => {
  const sections = [section1, section2, section3, section4]
  const viewportHeight = window.innerHeight

  sections.forEach((sectionRef, index) => {
    if (!sectionRef.value) return

    const rect = sectionRef.value.getBoundingClientRect()
    const sectionTop = rect.top
    const sectionCenter = sectionTop + rect.height / 2

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
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.sticky-section--first {
  align-items: flex-start;
  padding-top: 20px;
}

.sticky-section:not(.is-active) {
  opacity: 0.25;
  transform: scale(0.97);
}

.sticky-section.is-active {
  opacity: 1;
  z-index: 2;
  transform: scale(1);
}

.sticky-section > div {
  width: 100%;
}
</style>
