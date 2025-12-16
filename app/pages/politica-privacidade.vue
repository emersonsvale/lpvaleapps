<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
    <FloatingNav :nav-items="navItems" />
    
    <!-- Main Content -->
    <main class="pt-40 pb-16">
      <div class="container mx-auto px-6 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p class="text-muted-foreground text-lg">
            Última atualização: 07 de julho de 2025
          </p>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <div class="bg-card border rounded-lg p-8 mb-8">
            <p class="text-lg leading-relaxed mb-6">
              Na Vale Apps, levamos sua privacidade a sério. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e compartilhamos seus dados, incluindo dados vinculados à sua Conta Google, de forma transparente e segura.
            </p>
          </div>

          <!-- Section 1 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">1. Dados que coletamos</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">Coletamos dados fornecidos por você ou autorizados durante o uso dos nossos serviços, incluindo:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Nome, e-mail, telefone e outros dados informados manualmente;</li>
                <li>Dados da Conta Google, como nome, endereço de e-mail e foto de perfil, quando você realiza login via Google.</li>
              </ul>
            </div>
          </section>

          <!-- Section 2 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">2. Finalidade do uso dos dados</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">Utilizamos seus dados para:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Autenticação e acesso à plataforma (via Google OAuth);</li>
                <li>Comunicação direta com você (e-mails transacionais, suporte);</li>
                <li>Melhorias no sistema e personalização da experiência;</li>
                <li>Cumprimento de obrigações legais.</li>
              </ul>
            </div>
          </section>

          <!-- Section 3 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">3. Compartilhamento de dados</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">Não vendemos seus dados. Podemos compartilhar suas informações apenas com:</p>
              <ul class="list-disc pl-6 space-y-2">
                <li>Provedores de serviço (ex: ferramentas de e-mail e suporte);</li>
                <li>Autoridades legais, quando houver obrigação judicial.</li>
              </ul>
            </div>
          </section>

          <!-- Section 4 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">4. Armazenamento e segurança</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Seus dados são armazenados em ambientes seguros, com criptografia (HTTPS, TLS) e acesso restrito. Seguimos boas práticas para evitar acessos não autorizados, vazamentos ou perdas.
              </p>
            </div>
          </section>

          <!-- Section 5 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">5. Retenção e exclusão</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Armazenamos os dados enquanto forem necessários para a finalidade original ou exigido por lei. Você pode solicitar a exclusão total a qualquer momento, entrando em contato conosco.
              </p>
            </div>
          </section>

          <!-- Section 6 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">6. Seus direitos</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">Você tem direito de:</p>
              <ul class="list-disc pl-6 space-y-2 mb-4">
                <li>Acessar seus dados;</li>
                <li>Corrigir informações incorretas;</li>
                <li>Solicitar exclusão;</li>
                <li>Revogar o uso da Conta Google.</li>
              </ul>
              <p class="font-medium">
                Entre em contato pelo e-mail 
                <a href="mailto:contato@valeapps.com.br" class="text-brand hover:underline">
                  contato@valeapps.com.br
                </a> 
                para exercer seus direitos.
              </p>
            </div>
          </section>

          <!-- Section 7 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">7. Consentimento e atualizações</h2>
            <div class="bg-card border rounded-lg p-6">
              <p>
                Ao utilizar nossos serviços, você concorda com esta Política de Privacidade. Podemos atualizá-la a qualquer momento, e você será notificado sobre mudanças relevantes.
              </p>
            </div>
          </section>

          <!-- Section 8 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 text-foreground">8. Integração com Google Calendar</h2>
            <div class="bg-card border rounded-lg p-6">
              <p class="mb-4">
                Ao utilizar a funcionalidade de agendamentos integrada ao Google Calendar, você autoriza nosso sistema a acessar, criar, editar e excluir eventos no seu calendário pessoal.
              </p>
              <p>
                Essa integração é usada exclusivamente para sincronizar compromissos entre a plataforma Vale Apps e sua agenda Google. Nenhuma informação do seu calendário é compartilhada com terceiros, e os dados são usados apenas para garantir que seus agendamentos estejam atualizados em ambas as plataformas.
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
  title: 'Política de Privacidade - Vale Apps | Proteção de Dados',
  description: 'Política de Privacidade da Vale Apps. Saiba como coletamos, usamos e protegemos seus dados pessoais de forma transparente e segura conforme LGPD.',
  keywords: 'política de privacidade, proteção de dados, LGPD, Vale Apps, privacidade, dados pessoais, segurança',
  url: 'https://valeapps.com.br/politica-privacidade',
  type: 'article',
  publishedTime: '2025-12-16T00:00:00Z',
  modifiedTime: new Date().toISOString()
})

// Breadcrumb para SEO
generateBreadcrumb([
  { name: 'Início', url: '/' },
  { name: 'Política de Privacidade' }
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