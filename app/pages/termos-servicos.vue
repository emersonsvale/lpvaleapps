<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <FloatingNav :nav-items="navItems" />
    
    <!-- Main Content -->
    <main class="pt-32 pb-16">
      <div class="container mx-auto px-6 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Termos de Serviços
          </h1>
          <p class="text-muted-foreground text-lg">
            Última atualização: 17 de julho de 2025
          </p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <div class="bg-card border rounded-lg p-8 mb-8">
            <p class="text-lg leading-relaxed mb-6">
              Estes Termos de Serviço regem o uso dos serviços oferecidos pela Vale Apps. Ao acessar nosso site ou sistema, você concorda com as condições abaixo.
            </p>
          </div>

          <!-- Section 1 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">1. Aceitação dos termos</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Ao utilizar qualquer funcionalidade da Vale Apps, você confirma que leu, compreendeu e aceita integralmente estes termos.
              </p>
            </div>
          </section>

          <!-- Section 2 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">2. Serviços oferecidos</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                A Vale Apps fornece soluções digitais sob medida com foco em desenvolvimento web/mobile, automações, IA e integrações low-code, incluindo autenticação com Conta Google.
              </p>
            </div>
          </section>

          <!-- Section 3 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">3. Conta do usuário e Google Login</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Ao utilizar login via Conta Google, você nos autoriza a acessar informações básicas do seu perfil (nome, e-mail, foto). Esses dados são usados apenas para autenticação e personalização do serviço.
              </p>
            </div>
          </section>

          <!-- Section 4 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">4. Integração com Google Calendar</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">
                A funcionalidade de agendamentos da plataforma utiliza integração com a API do Google Calendar, mediante autorização do usuário. Ao aceitar os termos e realizar login com sua Conta Google, você autoriza a criação, edição e exclusão de eventos diretamente em sua agenda.
              </p>
              <p>
                Essa integração é usada exclusivamente para facilitar a organização de compromissos e garantir a sincronização entre o sistema Vale Apps e seu calendário pessoal.
              </p>
            </div>
          </section>

          <!-- Section 5 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">5. Responsabilidades do usuário</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">Você se compromete a:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Fornecer informações corretas;</li>
                <li>Usar o serviço de forma ética e legal;</li>
                <li>Não repassar ou compartilhar credenciais de acesso.</li>
              </ul>
            </div>
          </section>

          <!-- Section 6 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">6. Propriedade intelectual</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Todo o conteúdo, design e código fonte pertencem à Vale Apps, salvo quando indicado. É proibida a reprodução não autorizada.
              </p>
            </div>
          </section>

          <!-- Section 7 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">7. Limitação de responsabilidade</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">A Vale Apps não se responsabiliza por:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Perdas indiretas ou lucros cessantes;</li>
                <li>Uso indevido por parte do usuário;</li>
                <li>Problemas externos como quedas de conexão.</li>
              </ul>
            </div>
          </section>

          <!-- Section 8 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">8. Alterações nos termos</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Podemos alterar estes termos a qualquer momento. Se mudanças significativas forem feitas, informaremos por e-mail ou no próprio sistema.
              </p>
            </div>
          </section>

          <!-- Section 9 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">9. Foro e legislação</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Estes termos são regidos pela legislação brasileira. Em caso de conflito, fica eleito o foro da comarca de Imperatriz - MA.
              </p>
            </div>
          </section>

          <!-- Section 10 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">10. Contato</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Em caso de dúvidas, fale com a gente pelo e-mail 
                <a href="mailto:contato@valeapps.com.br" class="text-brand hover:underline">
                  contato@valeapps.com.br
                </a>.
              </p>
            </div>
          </section>

          <!-- Contact Section -->
          <ContactSection />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <EnhancedFooter />
  </div>
</template>

<script setup lang="ts">
import { PhHouse, PhChatCircle, PhUser, PhBriefcase, PhCode } from '@phosphor-icons/vue'
import FloatingNav from '~/components/ui/FloatingNav.vue'
import EnhancedFooter from '~/components/EnhancedFooter.vue'
import ContactSection from '~/components/ContactSection.vue'

// SEO otimizado
const { setPageSEO, generateBreadcrumb } = useSEO()

setPageSEO({
  title: 'Termos de Serviços - Vale Apps | Condições de Uso',
  description: 'Termos de Serviços da Vale Apps. Conheça as condições de uso dos nossos serviços de desenvolvimento web, mobile e soluções digitais.',
  keywords: 'termos de serviços, condições de uso, Vale Apps, desenvolvimento web, mobile, contratos, serviços digitais',
  url: 'https://valeapps.com.br/termos-servicos',
  type: 'article',
  publishedTime: '2025-12-16T00:00:00Z',
  modifiedTime: new Date().toISOString()
})

// Breadcrumb para SEO
generateBreadcrumb([
  { name: 'Início', url: '/' },
  { name: 'Termos de Serviços' }
])

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
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose h2 {
  color: hsl(var(--foreground));
}

.prose p {
  color: hsl(var(--foreground));
}

.prose ul li {
  color: hsl(var(--foreground));
}
</style>