<template>
  <footer class="bg-[#0F0F11]/10 relative h-fit overflow-hidden">
    <div class="max-w-7xl mx-auto p-8 md:p-14 z-40 relative">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
        <!-- Brand section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="footerCol.visibleOnce"
          class="flex flex-col space-y-5"
        >
          <div class="flex items-center space-x-2">
            <Logo class="h-8" />
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Transformamos suas ideias em aplicativos incríveis com tecnologia de ponta e design excepcional.
          </p>
          <!-- Social icons inline with brand -->
          <div class="flex space-x-3 pt-1">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-brand hover:border-brand/20 hover:bg-brand/5 transition-all duration-300 relative z-50"
            >
              <component :is="social.icon" :size="16" />
            </a>
          </div>
        </div>

        <!-- Services section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="{ ...footerCol.visibleOnce, transition: { ...footerCol.visibleOnce.transition, delay: 60 } }"
        >
          <h4 class="text-white text-sm font-semibold uppercase tracking-wider mb-6">Serviços</h4>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service.label" class="relative">
              <a
                :href="service.href"
                class="text-sm hover:text-brand transition-colors text-muted-foreground hover:translate-x-0.5 inline-block transition-transform duration-200"
              >
                {{ service.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Company section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="{ ...footerCol.visibleOnce, transition: { ...footerCol.visibleOnce.transition, delay: 120 } }"
        >
          <h4 class="text-white text-sm font-semibold uppercase tracking-wider mb-6">Empresa</h4>
          <ul class="space-y-3">
            <li v-for="link in companyLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-sm hover:text-brand transition-colors text-muted-foreground hover:translate-x-0.5 inline-block transition-transform duration-200"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="{ ...footerCol.visibleOnce, transition: { ...footerCol.visibleOnce.transition, delay: 180 } }"
        >
          <h4 class="text-white text-sm font-semibold uppercase tracking-wider mb-6">Contato</h4>
          <ul class="space-y-4">
            <li v-for="(item, i) in contactInfo" :key="i" class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-brand/5 flex items-center justify-center flex-shrink-0">
                <component :is="item.icon" :size="16" class="text-brand" />
              </div>
              <a
                v-if="item.href"
                :href="item.href"
                class="text-sm hover:text-brand transition-colors text-muted-foreground"
              >
                {{ item.text }}
              </a>
              <span
                v-else
                class="text-sm text-muted-foreground"
              >
                {{ item.text }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="border-t border-white/[0.04] my-8" />

      <!-- Footer bottom -->
      <div class="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 relative z-50">
        <!-- Copyright -->
        <div class="text-center md:text-left text-muted-foreground/70">
          <p class="flex items-center gap-2 text-xs">
            &copy; 2026 Vale Soluções Digitais LTDA
            <span class="hidden sm:inline mx-1 text-white/10">|</span>
            <span class="hidden sm:inline">61.712.285/0001-88</span>
          </p>
        </div>

        <!-- Legal links -->
        <div class="flex items-center gap-4 text-xs text-muted-foreground/60">
          <NuxtLink to="/politica-privacidade" class="hover:text-brand transition-colors">
            Política de Privacidade
          </NuxtLink>
          <span class="text-white/10">|</span>
          <NuxtLink to="/termos-servicos" class="hover:text-brand transition-colors">
            Termos de Serviços
          </NuxtLink>
        </div>

        <!-- Made with -->
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground/50">
          <span>Feito com</span>
          <PhHeart :size="12" weight="fill" class="text-red-500" />
          <span>e muito</span>
          <PhCoffee :size="12" class="text-amber-600" />
        </div>
      </div>
    </div>

    <!-- Text hover effect -->
    <div class="lg:flex hidden h-[30rem] -mt-52 -mb-36">
      <TextHoverEffect text="Vale Apps" class="z-10" />
    </div>

    <FooterBackgroundGradient />
  </footer>
</template>

<script setup lang="ts">
import { useRevealFade } from '~/composables/useScrollRevealVariants'
import { Mail, Globe } from 'lucide-vue-next'
import { PhInstagramLogo, PhLinkedinLogo, PhWhatsappLogo } from '@phosphor-icons/vue'
import { PhHeart, PhCoffee } from '@phosphor-icons/vue'
import Logo from '~/components/ui/Logo.vue'
import TextHoverEffect from '~/components/ui/TextHoverEffect.vue'
import FooterBackgroundGradient from '~/components/ui/FooterBackgroundGradient.vue'

const footerCol = useRevealFade()

const services = [
  { label: 'Desenvolvimento Mobile', href: '#servicos' },
  { label: 'Aplicações Web', href: '#servicos' },
  { label: 'UI/UX Design', href: '#servicos' },
  { label: 'Automação & IA', href: '#servicos' },
]

const companyLinks = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Política de Privacidade', href: '/politica-privacidade' },
  { label: 'Termos de Serviços', href: '/termos-servicos' },
]

const contactInfo = [
  {
    icon: Mail,
    text: 'contato@valeapps.com.br',
    href: 'mailto:contato@valeapps.com.br',
  },
  {
    icon: PhWhatsappLogo,
    text: '(11) 96921-0065',
    href: 'https://wa.me/5511969210065',
  },
]

const socialLinks = [
  { icon: PhInstagramLogo, label: 'Instagram', href: 'https://www.instagram.com/valeappss/' },
  { icon: PhLinkedinLogo, label: 'LinkedIn', href: 'https://www.linkedin.com/company/valeapps/' },
  { icon: Globe, label: 'Website', href: 'https://valeapps.com.br' },
]
</script>
