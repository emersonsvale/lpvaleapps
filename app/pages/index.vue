<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <FloatingNav :nav-items="navItems" />
    
    <!-- Hero Section -->
    <section id="inicio">
      <HeroSection />
    </section>

    <!-- Projetos Section -->
    <section id="projetos">
      <StickyScrollCards />
    </section>

    <!-- Serviços Section -->
    <section id="servicos">
      <ServicesSection />
    </section>

    <!-- Contato Section -->
    <section id="contato">
      <ContactSection />
    </section>

    <!-- Footer -->
    <EnhancedFooter />
  </div>
</template>

<script setup lang="ts">
import { PhHouse, PhChatCircle, PhBriefcase, PhCode } from '@phosphor-icons/vue'

// Lazy loading dos componentes para melhor performance
const FloatingNav = defineAsyncComponent(() => import('~/components/ui/FloatingNav.vue'))
const HeroSection = defineAsyncComponent(() => import('~/components/HeroSection.vue'))
const StickyScrollCards = defineAsyncComponent(() => import('~/components/ui/StickyScrollCards.vue'))
const ServicesSection = defineAsyncComponent(() => import('~/components/ServicesSection.vue'))
const ContactSection = defineAsyncComponent(() => import('~/components/ContactSection.vue'))
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
</script>