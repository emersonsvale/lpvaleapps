<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Navigation -->
    <FloatingNav :nav-items="navItems" />
    
    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center pt-24 pb-16">
      <div class="container mx-auto px-6 text-center">
        <!-- Error Code with Fuzzy Effect -->
        <div class="mb-8">
          <FuzzyText 
            text="404"
            class="text-8xl md:text-9xl font-bold text-brand"
            :duration="1500"
          />
        </div>

        <!-- Error Message -->
        <div class="mb-8">
          <FuzzyText 
            text="Página não encontrada"
            class="text-3xl md:text-4xl font-bold mb-4"
            :duration="2000"
          />
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ops! A página que você está procurando não existe ou foi movida. 
            Que tal voltar para o início e explorar nossos serviços?
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <NuxtLink to="/">
            <span class="border text-lg font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-10 py-5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors inline-flex items-center gap-2">
              <PhHouse :size="20" />
              Voltar ao Início
              <span class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-brand to-transparent h-px" />
            </span>
          </NuxtLink>
          
          <NuxtLink to="/#contato">
            <span class="border text-lg font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-10 py-5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors inline-flex items-center gap-2">
              <PhChatCircle :size="20" />
              Falar Conosco
              <span class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-brand to-transparent h-px" />
            </span>
          </NuxtLink>
        </div>

        <!-- Error Details (only in development) -->
        <div v-if="isDev && error" class="bg-card border rounded-lg p-6 max-w-2xl mx-auto text-left">
          <h3 class="text-lg font-semibold mb-4 text-red-500">Detalhes do Erro (Desenvolvimento)</h3>
          <div class="space-y-2 text-sm">
            <p><strong>Status:</strong> {{ error.statusCode }}</p>
            <p><strong>Mensagem:</strong> {{ error.statusMessage }}</p>
            <p v-if="error.url"><strong>URL:</strong> {{ error.url }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Contact Section -->
    <ContactSection />

    <!-- Footer -->
    <EnhancedFooter />
  </div>
</template>

<script setup lang="ts">
import { PhHouse, PhChatCircle, PhUser, PhBriefcase, PhCode } from '@phosphor-icons/vue'
import FloatingNav from '~/components/ui/FloatingNav.vue'
import EnhancedFooter from '~/components/EnhancedFooter.vue'
import ContactSection from '~/components/ContactSection.vue'
import FuzzyText from '~/components/ui/FuzzyText.vue'

// Props do erro (fornecidas automaticamente pelo Nuxt)
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    url?: string
  }
}>()

// Verificar se está em desenvolvimento
const isDev = process.dev

// Meta tags para SEO
useHead({
  title: `Erro ${props.error?.statusCode || 404} - Vale Apps`,
  meta: [
    {
      name: 'description',
      content: 'Página não encontrada. Volte ao início e explore nossos serviços de desenvolvimento web, mobile e soluções digitais.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})

// Navigation items
const navItems = [
  {
    name: 'Início',
    link: '/',
    icon: PhHouse
  },
  {
    name: 'Serviços',
    link: '/#servicos',
    icon: PhCode
  },
  {
    name: 'Projetos',
    link: '/#projetos',
    icon: PhBriefcase
  },
  {
    name: 'Sobre',
    link: '/#sobre',
    icon: PhUser
  },
  {
    name: 'Contato',
    link: '/#contato',
    icon: PhChatCircle
  }
]

// Função para limpar o erro e voltar
const handleError = () => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Página não encontrada'
  })
}
</script>

<style scoped>
/* Animação adicional para o container */
.container {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>