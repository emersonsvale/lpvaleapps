<template>
  <section class="pb-16 pt-16 md:pb-28 md:pt-8">
    <div class="mx-auto max-w-7xl px-4 md:px-8">
      <div class="rounded-2xl bg-zinc-900/80 border border-white/[0.06] shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden backdrop-blur-sm" style="min-height:500px;">
        <div
          v-motion
          :initial="revealLeft.initial"
          :visible-once="revealLeft.visibleOnce"
          class="flex-1 flex flex-col justify-center items-center md:items-start px-8 py-14 md:py-16 md:pl-14 lg:pl-16 md:pr-4 text-center md:text-left"
        >
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-brand text-sm font-medium mb-8">
            <PhStack :size="14" />
            Soluções Completas
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 text-white leading-tight">Seu projeto do <span class="text-brand">começo ao fim</span></h2>
          <p class="text-lg text-zinc-400 max-w-md leading-relaxed">Oferecemos soluções completas de desenvolvimento mobile, web e automação para transformar suas ideias em aplicativos de sucesso.</p>
          
          <!-- Mini features list -->
          <div class="mt-10 space-y-4 hidden md:block">
            <div v-for="(feature, i) in miniFeatures" :key="i" class="flex items-center gap-3 text-sm text-zinc-400">
              <PhCheckCircle :size="18" weight="fill" class="text-brand flex-shrink-0" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
        <div
          v-motion
          :initial="revealRight.initial"
          :visible-once="revealRight.visibleOnce"
          class="flex-1 flex items-center justify-center p-6 md:p-10"
        >
          <CardSwap :width="500" :height="320" class="relative z-0">
            <template #card-0>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                  <PhDeviceMobile :size="28" class="text-brand" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Desenvolvimento Mobile</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Apps nativos e híbridos para iOS e Android com performance otimizada.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhAppleLogo :size="14" /> iOS</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhAndroidLogo :size="14" /> Android</span>
                </div>
              </div>
            </template>
            <template #card-1>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <PhGlobe :size="28" class="text-green-500" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Desenvolvimento Web</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Aplicações web modernas, responsivas e de alta performance.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhCode :size="14" /> Vue.js</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhCode :size="14" /> React</span>
                </div>
              </div>
            </template>
            <template #card-2>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <PhPaintBrush :size="28" class="text-purple-500" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">UI/UX Design</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Interfaces intuitivas e experiências de usuário excepcionais.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhFigmaLogo :size="14" /> Figma</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhPalette :size="14" /> Design</span>
                </div>
              </div>
            </template>
            <template #card-3>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <PhCloud :size="28" class="text-orange-500" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Cloud & DevOps</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Infraestrutura escalável e deploy automatizado na nuvem.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhGear :size="14" /> AWS</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhRocket :size="14" /> CI/CD</span>
                </div>
              </div>
            </template>
            <template #card-4>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <PhLightbulb :size="28" class="text-teal-500" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Consultoria Tech</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Estratégia digital e arquitetura de soluções personalizadas.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhChartLine :size="14" /> Estratégia</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhUsers :size="14" /> Mentoria</span>
                </div>
              </div>
            </template>
            <template #card-5>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-xl bg-zinc-950 border border-white/[0.06] shadow-lg">
                <div class="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                  <PhWrench :size="28" class="text-red-500" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Suporte & Manutenção</h3>
                <p class="text-zinc-400 text-center text-sm mb-4 leading-relaxed">Monitoramento 24/7 e atualizações contínuas dos seus apps.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhShield :size="14" /> Segurança</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 rounded-lg text-sm text-zinc-300 border border-white/[0.04]"><PhClock :size="14" /> 24/7</span>
                </div>
              </div>
            </template>
          </CardSwap>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CardSwap from '~/components/ui/CardSwap.vue'
import { useRevealFromLeft, useRevealFromRight } from '~/composables/useScrollRevealVariants'
import {
  PhDeviceMobile,
  PhGlobe,
  PhPaintBrush,
  PhCloud,
  PhLightbulb,
  PhWrench,
  PhAppleLogo,
  PhAndroidLogo,
  PhCode,
  PhFigmaLogo,
  PhPalette,
  PhGear,
  PhRocket,
  PhChartLine,
  PhUsers,
  PhShield,
  PhClock,
  PhStack,
  PhCheckCircle
} from '@phosphor-icons/vue'

const revealLeft = useRevealFromLeft()
const revealRight = useRevealFromRight()

const miniFeatures = [
  'Do conceito ao deploy em produção',
  'Tecnologias modernas e escaláveis',
  'Suporte e manutenção contínua',
  'Design centrado no usuário'
]
</script>
