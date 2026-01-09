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
                  <h1 class="pt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:pt-12">
                    <BlurText 
                      text="Construa produtos digitais modernos com eficiência."
                      :delay="500"
                      :duration="1200"
                    />
                  </h1>
                  <p class="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                    <BlurText 
                      text="Na Vale Apps, unimos tecnologia, design e automação para acelerar o crescimento da sua empresa com soluções sob medida."
                      :delay="1500"
                      :duration="1000"
                    />
                  </p>
                  <div 
                    v-motion
                    :initial="transitionVariants.item.hidden"
                    :enter="transitionVariants.item.visible"
                    class="mt-6 flex items-center gap-2"
                  >
                  </div>
                </div>
                <template #fallback>
                  <!-- Fallback com estilo inicial invisível para evitar FOUC -->
                  <div class="opacity-0">
                    <h1 class="pt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:pt-12">
                      Construa produtos digitais modernos com eficiência.
                    </h1>
                    <p class="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                      Na Vale Apps, unimos tecnologia, design e automação para acelerar o crescimento da sua empresa com soluções sob medida.
                    </p>
                    <div class="mt-6 flex items-center gap-2">
                    </div>
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
                    alt="Dashboard dark theme"
                    width="2700"
                    height="1440"
                  />
                  <img
                    class="aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard light theme"
                    width="2700"
                    height="1440"
                  />
                </ContainerScroll>
              </div>
            </div>
            <template #fallback>
              <!-- Fallback invisível para evitar FOUC -->
              <div class="relative opacity-0">
                <div
                  aria-hidden="true"
                  class="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div class="mx-auto max-w-5xl px-6">
                  <img
                    class="bg-background aspect-[15/8] relative hidden rounded-lg dark:block w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard dark theme"
                    width="2700"
                    height="1440"
                  />
                  <img
                    class="aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden"
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center"
                    alt="Dashboard light theme"
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

.group-hover\:blur-xs:hover {
  filter: blur(1px);
}
</style>
