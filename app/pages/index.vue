<template>
  <div class="min-h-screen bg-background">
    <!-- Loading state inicial com logo animada -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!isReady" class="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
        <div class="flex flex-col items-center gap-6">
          <!-- Logo com animação -->
          <div class="logo-loading-container">
            <img
              src="/logo-header.png"
              alt="Vale Apps"
              class="logo-loading"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Conteúdo principal - só aparece quando tudo estiver carregado -->
    <Suspense>
      <template #default>
        <div v-show="isReady" class="min-h-screen">
          <!-- Navigation -->
          <FloatingNav :nav-items="navItems" />
          
          <!-- Hero Section -->
          <section id="inicio">
            <HeroSection />
          </section>

          <!-- Projetos Section -->
          <section id="projetos">
            <ProjectsSection />
          </section>

          <!-- Serviços Sticky Section -->
          <ServicesStickySection />

          <!-- Development Comparison Section -->
          <DevelopmentComparisonSection />

          <!-- Serviços Section -->
          <section id="servicos">
            <ServicesSection />
          </section>

          <!-- Contato Section -->
          <section id="contato">
            <ContactSection />
          </section>

          <!-- FAQ Section -->
          <section id="faq">
            <FAQSection />
          </section>

          <!-- Footer -->
          <EnhancedFooter />
        </div>
      </template>
      
      <template #fallback>
        <div class="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
          <div class="flex flex-col items-center gap-6">
            <!-- Logo com animação -->
            <div class="logo-loading-container">
              <img
                src="/logo-header.png"
                alt="Vale Apps"
                class="logo-loading"
              />
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { PhHouse, PhChatCircle, PhBriefcase, PhCode } from '@phosphor-icons/vue'

// Estado de carregamento
const isReady = ref(false)

// Lazy loading dos componentes para melhor performance
const FloatingNav = defineAsyncComponent(() => import('~/components/ui/FloatingNav.vue'))
const HeroSection = defineAsyncComponent(() => import('~/components/HeroSection.vue'))
const ProjectsSection = defineAsyncComponent(() => import('~/components/ProjectsSection.vue'))
const ServicesStickySection = defineAsyncComponent(() => import('~/components/ServicesStickySection.vue'))
const DevelopmentComparisonSection = defineAsyncComponent(() => import('~/components/DevelopmentComparisonSection.vue'))
const ServicesSection = defineAsyncComponent(() => import('~/components/ServicesSection.vue'))
const ContactSection = defineAsyncComponent(() => import('~/components/ContactSection.vue'))
const FAQSection = defineAsyncComponent(() => import('~/components/FAQSection.vue'))
const EnhancedFooter = defineAsyncComponent(() => import('~/components/EnhancedFooter.vue'))

// SEO otimizado
const { setPageSEO, generateBreadcrumb } = useSEO()

setPageSEO({
  title: 'Vale Apps - Desenvolvimento de Aplicativos Mobile e Web | Soluções Digitais',
  description: 'Transformamos suas ideias em soluções digitais extraordinárias. Desenvolvimento de apps mobile, web, IA e automação. Acelere seu negócio 10x mais rápido.',
  keywords: 'desenvolvimento de apps, aplicativos mobile, desenvolvimento web, React Native, Flutter, Vue.js, React, produtos digitais, Vale Apps, IA, automação, soluções digitais, startup, MVP',
  url: 'https://valeapps.com.br/',
  type: 'website'
})

// Breadcrumb para SEO
generateBreadcrumb([
  { name: 'Início', url: '/' }
])

// Itens de navegação com scroll suave para seções
const navItems = [
  {
    name: "Início",
    link: "#inicio",
    icon: PhHouse,
  },
  {
    name: "Projetos", 
    link: "#projetos",
    icon: PhBriefcase,
  },
  {
    name: "Serviços",
    link: "#servicos", 
    icon: PhCode,
  },
  {
    name: "Contato",
    link: "#contato",
    icon: PhChatCircle,
  },
]

// Aguardar tudo estar pronto antes de mostrar o conteúdo
onMounted(async () => {
  // Aguardar múltiplos ticks para garantir que:
  // 1. Os componentes assíncronos foram carregados (Suspense)
  // 2. Os componentes estão montados no DOM
  // 3. As animações (v-motion, BlurText) estão inicializadas
  await nextTick()
  await nextTick()
  await nextTick()
  
  // Pequeno delay adicional para garantir que as animações CSS estão prontas
  // Isso evita o FOUC (Flash of Unstyled Content)
  setTimeout(() => {
    isReady.value = true
  }, 200)
})
</script>

<style scoped>
.logo-loading-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-loading {
  width: 50px;
  height: auto;
  max-width: 90vw;
  animation: logoFadeInScale 0.8s ease-out forwards,
             logoPulse 2s ease-in-out 0.8s infinite,
             logoGlow 2s ease-in-out 0.8s infinite;
  opacity: 0;
  transform: scale(0.8);
  filter: drop-shadow(0 0 20px rgba(255, 192, 0, 0.3));
}

@keyframes logoFadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes logoGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(255, 192, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(255, 192, 0, 0.6));
  }
}

/* Responsivo */
@media (max-width: 640px) {
  .logo-loading {
    width: 80px;
  }
}
</style>