<template>
  <footer class="bg-[#0F0F11]/10 relative h-fit overflow-hidden">
    <div class="max-w-7xl mx-auto p-8 md:p-14 z-40 relative">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
        <!-- Brand section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="footerCol.visibleOnce"
          class="flex flex-col space-y-4"
        >
          <div class="flex items-center space-x-2">
            <Logo class="h-8" />
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Transformamos suas ideias em aplicativos incríveis com tecnologia de ponta e design excepcional.
          </p>
        </div>

        <!-- Services section -->
        <div
          v-motion
          :initial="footerCol.initial"
          :visible-once="{ ...footerCol.visibleOnce, transition: { ...footerCol.visibleOnce.transition, delay: 60 } }"
        >
          <h4 class="text-white text-lg font-semibold mb-6">Serviços</h4>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service.label" class="relative">
              <a
                :href="service.href"
                class="hover:text-brand transition-colors text-muted-foreground"
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
          <h4 class="text-white text-lg font-semibold mb-6">Empresa</h4>
          <ul class="space-y-3">
            <li v-for="link in companyLinks" :key="link.label">
              <a
                :href="link.href"
                class="hover:text-brand transition-colors text-muted-foreground"
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
          <h4 class="text-white text-lg font-semibold mb-6">Contato</h4>
          <ul class="space-y-4">
            <li v-for="(item, i) in contactInfo" :key="i" class="flex items-center space-x-3">
              <component :is="item.icon" :size="18" class="text-brand" />
              <a
                v-if="item.href"
                :href="item.href"
                class="hover:text-brand transition-colors text-muted-foreground"
              >
                {{ item.text }}
              </a>
              <span
                v-else
                class="hover:text-brand transition-colors text-muted-foreground"
              >
                {{ item.text }}
              </span>
            </li>
          </ul>
        </div>
      </div>

<hr class="border-t border-transparent my-8" />

      <!-- Footer bottom -->
      <div class="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 relative z-50">
        <!-- Social icons -->
        <div class="flex space-x-6 text-gray-400">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-brand transition-colors cursor-pointer relative z-50"
          >
            <component :is="social.icon" :size="20" />
          </a>
        </div>

        <!-- Copyright -->
        <div class="text-center md:text-left text-muted-foreground">
          <p class="flex items-center gap-2 mb-2">
            &copy; 2025 Vale Soluções Digitais LTDA - 61.712.285/0001-88
            <span class="mx-2">•</span>
            Feito com <PhHeart :size="16" class="text-red-500" /> e muito <PhCoffee :size="16" class="text-amber-600" />
          </p>
          <p class="text-sm flex gap-4">
            <NuxtLink to="/politica-privacidade" class="hover:text-brand transition-colors">
              Política de Privacidade
            </NuxtLink>
            <span>•</span>
            <NuxtLink to="/termos-servicos" class="hover:text-brand transition-colors">
              Termos de Serviços
            </NuxtLink>
          </p>
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

// Services data
const services = [
  { label: 'Desenvolvimento Mobile', href: '#' },
  { label: 'Aplicações Web', href: '#' },
  { label: 'UI/UX Design', href: '#' },
]

// Company links data
const companyLinks = [

  { label: 'Política de Privacidade', href: '/politica-privacidade' },
  { label: 'Termos de Serviços', href: '/termos-servicos' },
]

// Contact info data
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

// Social media icons
const socialLinks = [
  { icon: PhInstagramLogo, label: 'Instagram', href: 'https://www.instagram.com/valeappss/' },
  { icon: PhLinkedinLogo, label: 'LinkedIn', href: 'https://www.linkedin.com/company/valeapps/' },
  { icon: Globe, label: 'Website', href: 'https://valeapps.com.br' },
]
</script>
