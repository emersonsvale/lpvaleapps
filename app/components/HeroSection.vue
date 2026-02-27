<template>
  <div class="relative min-h-screen">
    <!-- Dark Veil Background -->
    <div class="absolute inset-0 w-full h-full">
      <DarkVeil
        :hue-shift="0"
        :noise-intensity="0.01"
        :scanline-intensity="0"
        :speed="0.4"
        :scanline-frequency="0"
        :warp-amount="0.08"
        :resolution-scale="1"
      />
    </div>
    
    <main class="overflow-hidden relative z-10">
      <section>
        <div class="relative pt-24">
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
                    <a 
                      href="https://wa.me/5511969210065?text=Olá! Gostaria de começar meu projeto com a Vale Apps."
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group relative inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand text-black font-semibold rounded-xl hover:bg-brand/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,192,0,0.3)] hover:-translate-y-0.5"
                    >
                      <PhRocketLaunch :size="20" weight="bold" />
                      Começar Meu Projeto
                      <PhArrowRight :size="16" weight="bold" class="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
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
              <div class="relative">
                <div
                  aria-hidden="true"
                  class="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <ContainerScroll>
                  <img
                    class="bg-background aspect-[15/8] relative hidden rounded-lg dark:block w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva"
                    width="2700"
                    height="1440"
                  />
                  <img
                    class="aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva"
                    width="2700"
                    height="1440"
                  />
                </ContainerScroll>
              </div>
            </div>
            <template #fallback>
              <div class="relative">
                <div
                  aria-hidden="true"
                  class="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div class="mx-auto max-w-5xl px-6">
                  <img
                    class="bg-background aspect-[15/8] relative hidden rounded-lg dark:block w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva"
                    width="2700"
                    height="1440"
                  />
                  <img
                    class="aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </template>
          </ClientOnly>
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
import DarkVeil from '~/components/ui/DarkVeil.vue'
import ContainerScroll from '~/components/ui/ContainerScroll.vue'
import LogoLoop from '~/components/ui/LogoLoop.vue'
import BlurText from '~/components/ui/BlurText.vue'
import { PhRocketLaunch, PhArrowRight, PhPlay, PhStar } from '@phosphor-icons/vue'

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
