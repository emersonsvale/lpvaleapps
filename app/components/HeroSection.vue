<template>
  <div class="relative min-h-screen">
    <main class="overflow-hidden relative z-10">
      <section class="relative isolate overflow-hidden">
        <div class="absolute inset-0">
          <video
            class="absolute inset-0 h-full w-full object-cover object-center brightness-90 contrast-125 saturate-110"
            src="/videohome (1).mp4"
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline
            preload="metadata"
            disablepictureinpicture
            controlslist="nodownload nofullscreen noremoteplayback"
            aria-hidden="true"
          />
          <div class="absolute inset-0 bg-black/45" />
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,196,0,0.10),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.45)_55%,hsl(var(--background))_100%)]" />
        </div>
        <div class="relative pt-24 pb-24 md:pb-32">
          <div class="mx-auto max-w-5xl px-6">
            <div class="sm:mx-auto lg:mr-auto">
              <ClientOnly>
                <div
                  v-motion
                  :initial="{ opacity: 0 }"
                  :enter="{ 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    }
                  }"
                >
                  <!-- Badge animada -->
                  <div 
                    v-motion
                    :initial="transitionVariants.item.hidden"
                    :enter="{ ...transitionVariants.item.visible, transition: { ...transitionVariants.item.visible.transition, delay: 300 } }"
                    class="mb-6 lg:mt-4"
                  >
                    <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5 text-sm text-brand backdrop-blur-sm">
                      <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                      </span>
                      Desenvolvimento Ágil &middot; Resultados Reais
                    </span>
                  </div>

                  <h1 class="pt-2 max-w-3xl text-balance text-5xl font-medium md:text-7xl lg:pt-4 leading-[1.1]">
                    <BlurText 
                      text="Transformamos ideias em produtos digitais de alto impacto"
                      :delay="500"
                      :duration="1200"
                    />
                  </h1>
                  <p class="mt-6 max-w-2xl text-pretty text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <BlurText 
                      text="Desenvolvimento mobile, web, IA e automação para acelerar o crescimento da sua empresa. Aplicativos iOS, Android e web com tecnologia de ponta."
                      :delay="1500"
                      :duration="1000"
                    />
                  </p>

                  <!-- CTAs -->
                  <div 
                    v-motion
                    :initial="transitionVariants.item.hidden"
                    :enter="transitionVariants.item.visible"
                    class="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <button
                      type="button"
                      class="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand text-black font-semibold rounded-xl hover:bg-brand/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,192,0,0.3)] hover:-translate-y-0.5"
                      @click="openTypebot({ source: 'hero-cta', message: 'Começar meu projeto' })"
                    >
                      <PhRocketLaunch :size="20" weight="bold" />
                      Começar Meu Projeto
                      <PhArrowRight :size="16" weight="bold" class="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <a 
                      href="#projetos"
                      class="inline-flex items-center gap-2 px-6 py-3.5 border border-white/[0.15] text-foreground/80 rounded-xl hover:bg-white/5 hover:border-white/[0.25] transition-all duration-300 backdrop-blur-sm"
                    >
                      <PhPlay :size="18" weight="fill" class="text-brand" />
                      Ver Projetos
                    </a>
                  </div>

                  <!-- Social proof -->
                  <div 
                    v-motion
                    :initial="transitionVariants.item.hidden"
                    :enter="{ ...transitionVariants.item.visible, transition: { ...transitionVariants.item.visible.transition, delay: 600 } }"
                    class="mt-12 flex items-center gap-6 text-sm text-muted-foreground"
                  >
                    <div class="flex items-center gap-2">
                      <div class="flex -space-x-2">
                        <div class="w-8 h-8 rounded-full bg-brand/20 border-2 border-background flex items-center justify-center text-xs font-bold text-brand">V</div>
                        <div class="w-8 h-8 rounded-full bg-green-500/20 border-2 border-background flex items-center justify-center text-xs font-bold text-green-400">Z</div>
                        <div class="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-background flex items-center justify-center text-xs font-bold text-blue-400">O</div>
                      </div>
                      <span>+20 projetos entregues</span>
                    </div>
                    <div class="hidden sm:block w-px h-4 bg-white/10"></div>
                    <div class="hidden sm:flex items-center gap-1.5">
                      <PhStar :size="16" weight="fill" class="text-brand" />
                      <PhStar :size="16" weight="fill" class="text-brand" />
                      <PhStar :size="16" weight="fill" class="text-brand" />
                      <PhStar :size="16" weight="fill" class="text-brand" />
                      <PhStar :size="16" weight="fill" class="text-brand" />
                      <span class="ml-1">5.0 de satisfação</span>
                    </div>
                  </div>
                </div>
                <template #fallback>
                  <div>
                    <div class="mb-6 lg:mt-4">
                      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/5 text-sm text-brand">
                        Desenvolvimento Ágil &middot; Resultados Reais
                      </span>
                    </div>
                    <h1 class="pt-2 max-w-3xl text-balance text-5xl font-medium md:text-7xl lg:pt-4 leading-[1.1]">
                      Transformamos ideias em produtos digitais de alto impacto
                    </h1>
                    <p class="mt-6 max-w-2xl text-pretty text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Desenvolvimento mobile, web, IA e automação para acelerar o crescimento da sua empresa. Aplicativos iOS, Android e web com tecnologia de ponta.
                    </p>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-background pb-16 pt-16 md:pb-32 w-full">
        <div class="w-full">
          <div class="text-center mb-8 px-6">
            <p class="text-sm uppercase tracking-widest text-muted-foreground/60 font-medium">Tecnologias que utilizamos</p>
          </div>
          <LogoLoop />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import LogoLoop from '~/components/ui/LogoLoop.vue'
import BlurText from '~/components/ui/BlurText.vue'
import { PhRocketLaunch, PhArrowRight, PhPlay, PhStar } from '@phosphor-icons/vue'

const { openTypebot } = useTypebot()

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(125% 125% at 50% 100%, transparent 0%, var(--background) 75%);
}
</style>
