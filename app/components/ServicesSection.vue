<template>
  <section class="pb-8 pt-8 md:pb-20">
    <div class="mx-auto max-w-7xl px-2 md:px-8">
      <div class="rounded-lg bg-zinc-900/95 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-stretch overflow-hidden" style="min-height:420px;">
        <div class="flex-1 flex flex-col justify-center items-center md:items-start px-8 py-12 md:py-0 md:pl-12 md:pr-0 text-center md:text-left">
          <h2 class="text-3xl md:text-4xl font-medium mb-4 text-white">Seu projeto do começo ao fim</h2>
          <p class="text-lg text-zinc-300 max-w-md">Oferecemos soluções completas de desenvolvimento mobile, web e automação para transformar suas ideias em aplicativos de sucesso com tecnologia de ponta.</p>
        </div>
        <div class="flex-1 flex items-center justify-center p-4 md:p-8">
          <CardSwap :width="500" :height="320" class="relative z-0">
            <template #card-0>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
                  <PhDeviceMobile :size="32" class="text-brand" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Desenvolvimento Mobile</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Apps nativos e híbridos para iOS e Android com performance otimizada.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhAppleLogo :size="14" /> iOS</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhAndroidLogo :size="14" /> Android</span>
                </div>
              </div>
            </template>
            <template #card-1>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PhGlobe :size="32" class="text-green-600" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Desenvolvimento Web</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Aplicações web modernas, responsivas e de alta performance.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhCode :size="14" /> Vue.js</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhCode :size="14" /> React</span>
                </div>
              </div>
            </template>
            <template #card-2>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PhPaintBrush :size="32" class="text-purple-600" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">UI/UX Design</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Interfaces intuitivas e experiências de usuário excepcionais.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhFigmaLogo :size="14" /> Figma</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhPalette :size="14" /> Design System</span>
                </div>
              </div>
            </template>
            <template #card-3>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PhCloud :size="32" class="text-orange-600" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Cloud & DevOps</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Infraestrutura escalável e deploy automatizado na nuvem.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhGear :size="14" /> AWS</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhRocket :size="14" /> CI/CD</span>
                </div>
              </div>
            </template>
            <template #card-4>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PhLightbulb :size="32" class="text-teal-600" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Consultoria Tech</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Estratégia digital e arquitetura de soluções personalizadas.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhChartLine :size="14" /> Estratégia</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhUsers :size="14" /> Mentoria</span>
                </div>
              </div>
            </template>
            <template #card-5>
              <div class="flex flex-col items-center justify-center w-full h-full p-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-lg">
                <div class="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PhWrench :size="32" class="text-red-600" />
                </div>
                <h3 class="text-xl font-bold mb-2 text-center text-white">Suporte & Manutenção</h3>
                <p class="text-zinc-300 text-center text-sm mb-4">Monitoramento 24/7 e atualizações contínuas dos seus apps.</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhShield :size="14" /> Segurança</span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-white"><PhClock :size="14" /> 24/7</span>
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
  PhClock
} from '@phosphor-icons/vue'
</script>
