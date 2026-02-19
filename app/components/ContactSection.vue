<template>
  <section class="py-20 relative overflow-hidden">
    <div class="container mx-auto px-6">
      <div
        v-motion
        :initial="sectionTitleReveal.initial"
        :visible-once="sectionTitleReveal.visibleOnce"
        class="text-center mb-16"
      >
        <h2 class="text-4xl md:text-5xl font-medium mb-6">
          Vamos Criar Algo Incrível Juntos?
        </h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transforme sua ideia em um aplicativo mobile ou web de sucesso. Entre em contato conosco e descubra como podemos impulsionar seu negócio com desenvolvimento de alta qualidade e tecnologia moderna.
        </p>
      </div>

      <div
        v-motion
        :initial="ctaReveal.initial"
        :visible-once="ctaReveal.visibleOnce"
        class="text-center"
      >
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/5511969210065?text=Olá! Gostaria de começar meu projeto com a Vale Apps."
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="border text-lg font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-10 py-5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors inline-flex items-center gap-2">

              Começar Meu Projeto
              <span class="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-brand to-transparent h-px" />
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { sectionTitleReveal, useRevealFadeUp } from '~/composables/useScrollRevealVariants'

const ctaReveal = useRevealFadeUp({ y: 20 })
</script>