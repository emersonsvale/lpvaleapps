<template>
  <section class="py-24 md:py-32 relative overflow-hidden">
    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand/[0.04] rounded-full blur-[120px]"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div
        v-motion
        :initial="sectionTitleReveal.initial"
        :visible-once="sectionTitleReveal.visibleOnce"
        class="text-center mb-16"
      >
        <p class="text-sm uppercase tracking-widest text-brand mb-4 font-medium">Vamos conversar</p>
        <h2 class="text-4xl md:text-6xl font-medium mb-6 leading-tight">
          Pronto para transformar <span class="block">sua ideia em <span class="text-brand">realidade</span>?</span>
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Conte-nos sobre seu projeto. Respondemos em até 24 horas com uma proposta personalizada para suas necessidades.
        </p>
      </div>

      <!-- CTA Cards -->
      <div
        v-motion
        :initial="ctaReveal.initial"
        :visible-once="ctaReveal.visibleOnce"
        class="max-w-3xl mx-auto"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <!-- WhatsApp Card -->
          <a
            href="https://wa.me/5511969210065?text=Olá! Gostaria de começar meu projeto com a Vale Apps."
            target="_blank"
            rel="noopener noreferrer"
            class="group relative p-6 rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm hover:border-green-500/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(34,197,94,0.1)]"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors duration-300">
                <PhWhatsappLogo :size="24" class="text-green-500" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">WhatsApp</h3>
                <p class="text-sm text-zinc-400">Resposta rápida. Fale diretamente com nossa equipe.</p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-sm text-zinc-500 group-hover:text-green-400 transition-colors duration-300">
              <span>Iniciar conversa</span>
              <PhArrowRight :size="14" class="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>

          <!-- Email Card -->
          <a
            href="mailto:contato@valeapps.com.br?subject=Quero começar meu projeto"
            class="group relative p-6 rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-sm hover:border-brand/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,192,0,0.08)]"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors duration-300">
                <PhEnvelope :size="24" class="text-brand" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-brand transition-colors duration-300">E-mail</h3>
                <p class="text-sm text-zinc-400">Envie detalhes do seu projeto por e-mail.</p>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-sm text-zinc-500 group-hover:text-brand transition-colors duration-300">
              <span>Enviar e-mail</span>
              <PhArrowRight :size="14" class="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>
        </div>

        <!-- Main CTA -->
        <div class="text-center">
          <a 
            href="https://wa.me/5511969210065?text=Olá! Gostaria de começar meu projeto com a Vale Apps."
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-3 px-10 py-5 bg-brand text-black font-bold text-lg rounded-2xl hover:bg-brand/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,192,0,0.3)] hover:-translate-y-0.5"
          >
            <PhRocketLaunch :size="22" weight="bold" />
            Começar Meu Projeto
            <PhArrowRight :size="18" weight="bold" class="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p class="mt-4 text-sm text-zinc-500">Sem compromisso &middot; Resposta em até 24h &middot; Orçamento gratuito</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PhWhatsappLogo, PhEnvelope, PhArrowRight, PhRocketLaunch } from '@phosphor-icons/vue'
import { sectionTitleReveal, useRevealFadeUp } from '~/composables/useScrollRevealVariants'

const ctaReveal = useRevealFadeUp({ y: 20 })
</script>