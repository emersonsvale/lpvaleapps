<template>
  <div class="min-h-screen bg-background">
    <!-- Loading -->
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p class="text-sm text-muted-foreground">Carregando proposta...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!proposta" class="flex min-h-screen items-center justify-center p-4">
      <div class="text-center space-y-4">
        <h2 class="text-2xl font-semibold">Proposta não encontrada</h2>
        <p class="text-muted-foreground">O projeto solicitado não existe ou o link é inválido.</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-brand hover:text-brand-300">
          ← Voltar para a home
        </NuxtLink>
      </div>
    </div>

    <!-- Proposta Landing -->
    <div v-else class="relative">
      <!-- DarkVeil Background -->
      <div class="fixed inset-0 w-full h-full pointer-events-none -z-10">
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

      <!-- Navigation -->
      <FloatingNav :nav-items="navItems" />

      <!-- Content -->
      <main class="relative z-10">
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center">
          <div class="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-brand/10 via-brand/5 to-transparent" />
          
          <div class="relative pt-20 pb-24 px-4 sm:px-6 w-full">
            <div class="mx-auto max-w-4xl">
              <!-- Back button -->
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
                class="mb-12"
              >
                <NuxtLink
                  to="/"
                  class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  <span>← Voltar</span>
                </NuxtLink>
              </div>

              <!-- Title -->
              <div
                v-motion
                :initial="{ opacity: 0 }"
                :enter="{ 
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.3,
                  }
                }"
              >
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.15] mb-4 sm:mb-5">
                  <BlurText 
                    :text="proposta.nome_proejeto || 'Proposta Comercial'"
                    :delay="300"
                    :duration="1200"
                  />
                </h1>
                <p class="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  <BlurText 
                    :text="heroDescricao"
                    :delay="1200"
                    :duration="1000"
                  />
                </p>
              </div>

              <!-- Key metrics -->
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 1800 } }"
                class="mt-10 sm:mt-12 grid gap-3 sm:gap-4 w-full"
                :class="isPropostaHora ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'"
              >
                <div class="rounded-lg border border-brand/20 bg-brand/5 backdrop-blur-sm p-3 sm:p-4">
                  <p class="text-[0.65rem] sm:text-xs uppercase tracking-widest text-brand font-medium">Investimento</p>
                  <p class="mt-2 sm:mt-2.5 text-lg sm:text-2xl font-semibold text-foreground">{{ valorFormatado }}</p>
                </div>
                <div class="rounded-lg border border-border bg-card/30 backdrop-blur-sm p-3 sm:p-4">
                  <p class="text-[0.65rem] sm:text-xs uppercase tracking-widest text-muted-foreground font-medium">Prazo</p>
                  <p class="mt-2 sm:mt-2.5 text-base sm:text-lg font-semibold text-foreground">{{ prazoTexto }}</p>
                </div>
                <div class="rounded-lg border border-border bg-card/30 backdrop-blur-sm p-3 sm:p-4">
                  <p class="text-[0.65rem] sm:text-xs uppercase tracking-widest text-muted-foreground font-medium">Modalidade</p>
                  <p class="mt-2 sm:mt-2.5 text-base sm:text-lg font-semibold text-foreground">{{ modalidadeTexto }}</p>
                </div>
                <div v-if="isPropostaHora" class="rounded-lg border border-border bg-card/30 backdrop-blur-sm p-3 sm:p-4">
                  <p class="text-[0.65rem] sm:text-xs uppercase tracking-widest text-muted-foreground font-medium">Total de horas</p>
                  <p class="mt-2 sm:mt-2.5 text-base sm:text-lg font-semibold text-foreground">{{ totalHorasTexto }}</p>
                </div>
              </div>

              <!-- CTAs -->
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 2100 } }"
                class="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
              >
                <a
                  :href="whatsAppAprovacaoLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-brand text-black font-semibold text-sm sm:text-base rounded-lg hover:bg-brand-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,192,0,0.3)] hover:-translate-y-0.5"
                >
                  Aprovar proposta
                  <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  :href="whatsAppDuvidasLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 border border-brand/20 bg-card/40 backdrop-blur-sm text-foreground font-semibold text-sm sm:text-base rounded-lg hover:border-brand hover:text-brand transition-all duration-300"
                >
                  Dúvidas?
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Execution Plan Section -->
        <section class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              class="text-center mb-12 sm:mb-14"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Como funciona</p>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-5 leading-tight">
                Seu projeto em <span class="text-brand">3 etapas</span>
              </h2>
              <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Entrega previsível com checkpoints claros e validações progressivas.
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-4 sm:gap-5">
              <div
                v-for="(etapa, index) in etapasProjeto"
                :key="etapa.titulo"
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 150 } }"
                class="group rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-5 sm:p-6 hover:border-brand/40 transition-all duration-300"
              >
                <div class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand font-semibold mb-3 text-sm group-hover:bg-brand/25 transition-colors">
                  {{ index + 1 }}
                </div>
                <h3 class="text-base sm:text-lg font-semibold mb-2.5">{{ etapa.titulo }}</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">{{ etapa.descricao }}</p>
                <p class="text-xs text-brand font-medium uppercase tracking-widest">{{ etapa.prazo }}</p>
              </div>
            </div>
          </div>
        </section>

        <section v-if="isPropostaHora" class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              class="text-center mb-12 sm:mb-14"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Composição por hora</p>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-5 leading-tight">
                Distribuição de <span class="text-brand">etapas e esforço</span>
              </h2>
              <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transparência total sobre horas por etapa e formação do valor final do projeto.
              </p>
            </div>

            <div class="rounded-xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden">
              <div class="grid grid-cols-12 gap-3 px-4 py-3 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                <div class="col-span-5">Etapa</div>
                <div class="col-span-3">Descrição</div>
                <div class="col-span-2 text-right">Horas</div>
                <div class="col-span-2 text-right">Subtotal</div>
              </div>

              <div
                v-for="item in itensHora"
                :key="`${item.etapa}-${item.ordem}`"
                class="grid grid-cols-12 gap-3 px-4 py-3 border-b border-border/60 last:border-b-0 text-sm"
              >
                <div class="col-span-5 font-medium text-foreground">{{ item.etapa }}</div>
                <div class="col-span-3 text-muted-foreground">{{ item.descricao || '—' }}</div>
                <div class="col-span-2 text-right text-foreground">{{ formatarHoras(item.horas) }}</div>
                <div class="col-span-2 text-right text-foreground">{{ formatarMoeda(item.subtotal) }}</div>
              </div>

              <div class="grid grid-cols-12 gap-3 px-4 py-4 bg-brand/5 text-sm font-semibold">
                <div class="col-span-8 text-right text-muted-foreground">Total</div>
                <div class="col-span-2 text-right text-foreground">{{ totalHorasTexto }}</div>
                <div class="col-span-2 text-right text-brand">{{ valorFormatado }}</div>
              </div>
            </div>

            <p class="mt-4 text-xs text-muted-foreground">
              Valor/hora aplicado: {{ valorHoraFormatado }}
            </p>
          </div>
        </section>

        <section class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div class="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
                class="rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-5 sm:p-6"
              >
                <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Forma de pagamento</p>
                <ul class="space-y-2.5 sm:space-y-3">
                  <li
                    v-for="(parcela, index) in formaPagamentoProposta"
                    :key="`${parcela.descricao}-${index}`"
                    class="text-xs sm:text-sm text-muted-foreground"
                  >
                    <span class="font-medium text-foreground">{{ parcela.percentual }}%</span>
                    · {{ parcela.descricao }} ·
                    <span class="font-medium text-foreground">{{ formatarMoeda(parcela.valor) }}</span>
                    <span v-if="parcela.marco_horas != null" class="text-xs text-muted-foreground"> ({{ formatarHoras(parcela.marco_horas) }})</span>
                  </li>
                </ul>
              </div>

              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
                class="rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-5 sm:p-6"
              >
                <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Condições</p>
                <ul class="space-y-2.5 sm:space-y-3">
                  <li
                    v-for="(item, index) in condicoesProposta"
                    :key="`condicao-${index}`"
                    class="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                  >
                    <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 260 } }"
              class="mt-6 rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-5 sm:p-6"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Garantias</p>
              <ul class="space-y-2.5 sm:space-y-3">
                <li
                  v-for="(item, index) in garantiasProposta"
                  :key="`garantia-${index}`"
                  class="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Services & Deliverables -->
        <section class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div class="grid md:grid-cols-2 gap-6 sm:gap-8">
              <!-- Services -->
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
              >
                <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Inclusos</p>
                <h3 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">Serviços</h3>
                <ul class="space-y-2.5 sm:space-y-3">
                  <li v-for="s in proposta.tipos_servicos_enuns || ['Serviços personalizados']" :key="s" class="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                    <span>{{ s }}</span>
                  </li>
                </ul>
              </div>

              <!-- Deliverables -->
              <div
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
              >
                <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Resultados</p>
                <h3 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5">Entregáveis</h3>
                <ul class="space-y-2.5 sm:space-y-3">
                  <li v-for="e in proposta.entregas || ['Entrega final pronta para uso']" :key="e" class="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                    <span>{{ e }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Why Choose Section -->
        <section class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              class="text-center mb-12 sm:mb-14"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Garantias</p>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-5 leading-tight">
                Por que essa proposta é <span class="text-brand">segura</span>
              </h2>
            </div>

            <div class="grid md:grid-cols-3 gap-4 sm:gap-5">
              <div
                v-for="(item, index) in argumentosConversao"
                :key="item.titulo"
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 150 } }"
                class="rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-5 sm:p-6 hover:border-brand/40 transition-all duration-300"
              >
                <h3 class="text-base sm:text-lg font-semibold mb-2.5">{{ item.titulo }}</h3>
                <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">{{ item.descricao }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Cases Section -->
        <section v-if="casesDestaque.length" class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-4xl">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              class="text-center mb-12 sm:mb-14"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Cases</p>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-5 leading-tight">
                Projetos que <span class="text-brand">já validaram</span> nossa metodologia
              </h2>
              <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Conheça os aplicativos publicados e em funcionamento com foco em resultado real.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <article
                v-for="(projeto, index) in casesDestaque"
                :key="projeto.id"
                v-motion
                :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 100 } }"
                class="group rounded-2xl border border-brand/10 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-brand/40 transition-all duration-300"
              >
                <!-- Image -->
                <div class="relative h-48 overflow-hidden bg-muted/20">
                  <img
                    v-if="projectImage(projeto)"
                    :src="projectImage(projeto)!"
                    :alt="`Projeto ${projeto.titulo || 'Vale Apps'}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-muted-foreground text-sm">Sem imagem</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                  <h3 class="text-lg font-semibold mb-2 group-hover:text-brand transition-colors">{{ projeto.titulo || 'Projeto' }}</h3>
                  <p class="text-sm text-muted-foreground line-clamp-2 mb-4">{{ projeto.descricao || 'Projeto desenvolvido com foco em experiência.' }}</p>
                  <a
                    v-if="projectLink(projeto)"
                    :href="projectLink(projeto)!"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex text-sm text-brand hover:text-brand-300 transition-colors"
                  >
                    Ver case →
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- Additional Info Section -->
        <section v-if="proposta.mais_info" class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div class="mx-auto max-w-3xl">
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
              class="rounded-xl border border-brand/10 bg-card/40 backdrop-blur-sm p-6 sm:p-8 md:p-10"
            >
              <p class="text-xs sm:text-sm uppercase tracking-widest text-brand mb-3 sm:mb-4 font-medium">Detalhes</p>
              <div class="proposta-prose text-foreground text-xs sm:text-sm" v-html="renderedMaisInfo" />
            </div>
          </div>
        </section>

        <!-- Final CTA Section -->
        <section class="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
            class="mx-auto max-w-3xl rounded-xl border border-brand/30 bg-gradient-to-b from-brand/15 to-brand/5 backdrop-blur-sm p-6 sm:p-8 md:p-10 text-center"
          >
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-4 leading-tight">
              Pronto para <span class="text-brand">começar?</span>
            </h2>
            <p class="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
              Se a proposta faz sentido, iniciamos seu projeto imediatamente com onboarding, cronograma detalhado e kickoff de execução.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                :href="whatsAppAprovacaoLink"
                target="_blank"
                rel="noopener noreferrer"
                class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-brand text-black font-semibold text-sm sm:text-base rounded-lg hover:bg-brand-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,192,0,0.3)] hover:-translate-y-0.5"
              >
                Aprovar agora
                <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                :href="whatsAppDuvidasLink"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 border border-brand/20 bg-card/40 backdrop-blur-sm text-foreground font-semibold text-sm sm:text-base rounded-lg hover:border-brand hover:text-brand transition-all duration-300"
              >
                Falar com especialista
              </a>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="py-10 sm:py-12 px-4 sm:px-6 border-t border-border/40 mt-16 sm:mt-20">
          <div class="mx-auto max-w-4xl text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2024 Vale Apps. Desenvolvimento de soluções digitais sob medida.</p>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { marked } from 'marked'
import { fetchPropostaBySlug, type PropostaFormaPagamentoItem, type PropostaHoraItem } from '~/composables/usePropostas'
import { useProjetos, type Projeto } from '~/composables/useProjetos'

definePageMeta({
  name: 'proposta-slug',
})

// Lazy load dos componentes
const DarkVeil = defineAsyncComponent(() => import('~/components/ui/DarkVeil.vue'))
const FloatingNav = defineAsyncComponent(() => import('~/components/ui/FloatingNav.vue'))
const BlurText = defineAsyncComponent(() => import('~/components/ui/BlurText.vue'))

const route = useRoute()
const slug = String(route.params.slug || '').trim()
const whatsappNumber = '5511969210065'

// Debug log
if (process.client) {
  console.log('[PROPOSTA DEBUG]', { slug, routeParams: route.params })
}

// Nav items para FloatingNav
const navItems = [
  { name: 'Como funciona', link: '#como-funciona' },
  { name: 'Serviços', link: '#servicos' },
  { name: 'Cases', link: '#cases' },
  { name: 'Fechar', link: '#cta' },
]

const { data: proposta, pending } = await useAsyncData(
  `proposta-${slug || 'empty'}`,
  async () => {
    const result = slug ? await fetchPropostaBySlug(slug) : null
    if (process.client) {
      console.log('[PROPOSTA RESULT]', { slug, found: !!result, proposta: result })
    }
    return result
  },
  { watch: [() => route.params.slug] }
)

const { data: projetosData } = await useAsyncData('proposta-cases', () => useProjetos())

const casesDestaque = computed(() => (projetosData.value ?? []).slice(0, 6))

const prazoTexto = computed(() => {
  if (!proposta.value?.prazo_dias) return 'A definir'
  return `${proposta.value.prazo_dias} dias (${proposta.value.dias_corridos_ou_ulteis || 'corridos'})`
})

const isPropostaHora = computed(() => proposta.value?.tipo_proposta === 'hora')

const itensHora = computed(() => {
  const itens = (proposta.value?.proposta_itens_hora ?? []) as PropostaHoraItem[]
  return [...itens].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
})

const totalHorasTexto = computed(() => {
  if (!isPropostaHora.value) return '-'
  const total = proposta.value?.total_horas ?? itensHora.value.reduce((acc, item) => acc + (item.horas ?? 0), 0)
  return formatarHoras(total)
})

const modalidadeTexto = computed(() => {
  if (isPropostaHora.value) return 'Por hora'
  return 'Escopo fechado'
})

const valorHoraFormatado = computed(() => {
  const valorHora = proposta.value?.valor_hora
  if (!valorHora && valorHora !== 0) return 'Sob consulta'
  return `${formatarMoeda(valorHora)} / hora`
})

const nomeCliente = computed(() => proposta.value?.nome_cliente?.trim() || 'cliente')
const nomeProjeto = computed(() => proposta.value?.nome_proejeto?.trim() || 'projeto')

const valorFormatado = computed(() =>
  proposta.value?.valor_final != null ? formatarMoeda(proposta.value.valor_final) : 'Sob consulta'
)

const condicoesPadrao = computed(() => {
  const validade = proposta.value?.validade_orcamento_dias ?? 15
  return [
    `Validade do orçamento: ${validade} dias.`,
    'O escopo poderá sofrer alterações caso haja novas solicitações não previstas.',
    'Pagamento via PIX ou transferência bancária.',
    'O início do desenvolvimento está condicionado ao pagamento da primeira parcela.'
  ]
})

const condicoesProposta = computed(() => {
  const condicoes = proposta.value?.condicoes ?? []
  return condicoes.length ? condicoes : condicoesPadrao.value
})

const garantiasPadrao = computed(() => {
  const suporte = proposta.value?.suporte_dias ?? 7
  return [
    `Suporte técnico para correções de bugs por ${suporte} dias após a entrega final.`,
    'Ajustes e evoluções fora do escopo serão cobrados separadamente.'
  ]
})

const garantiasProposta = computed(() => {
  const garantias = proposta.value?.garantias ?? []
  return garantias.length ? garantias : garantiasPadrao.value
})

const formaPagamentoProposta = computed(() => {
  const valorTotal = proposta.value?.valor_final ?? 0
  const totalHoras = proposta.value?.total_horas ?? 0
  const itens = (proposta.value?.forma_pagamento ?? []) as PropostaFormaPagamentoItem[]

  if (itens.length) {
    return itens.map(item => ({
      descricao: item.descricao,
      percentual: Number(item.percentual ?? 0),
      valor: Number(item.valor ?? 0),
      marco_horas: item.marco_horas == null ? null : Number(item.marco_horas)
    }))
  }

  return [
    {
      descricao: 'No aceite da proposta',
      percentual: 50,
      valor: Number((valorTotal * 0.5).toFixed(2)),
      marco_horas: null
    },
    {
      descricao: 'Na metade do projeto',
      percentual: 30,
      valor: Number((valorTotal * 0.3).toFixed(2)),
      marco_horas: totalHoras > 0 ? Number((totalHoras / 2).toFixed(2)) : null
    },
    {
      descricao: 'Na entrega final',
      percentual: 20,
      valor: Number((valorTotal * 0.2).toFixed(2)),
      marco_horas: totalHoras > 0 ? totalHoras : null
    }
  ]
})

const heroDescricao = computed(() => {
  if (proposta.value?.nome_cliente) {
    return `Criamos esta landing de proposta para ${proposta.value.nome_cliente}, com escopo focado em entrega real, velocidade e retorno sobre investimento.`
  }
  return 'Esta proposta foi montada para transformar sua ideia em um produto digital com alta percepção de valor e execução segura.'
})

const selosConfianca = [
  'Processo transparente',
  'Entrega por etapas',
  'Suporte contínuo',
  'Foco em ROI'
]

const argumentosConversao = computed(() => [
  {
    titulo: 'Escopo orientado a resultado',
    descricao: 'Cada item desta proposta foi pensado para gerar avanço mensurável no seu negócio.'
  },
  {
    titulo: 'Risco reduzido por etapas',
    descricao: 'Trabalhamos com checkpoints claros para validar entregas e manter previsibilidade.'
  },
  {
    titulo: 'Equipe dedicada ao projeto',
    descricao: 'Você terá acompanhamento próximo durante todo o desenvolvimento até a entrega final.'
  }
])

const etapasProjeto = computed(() => {
  const totalDias = proposta.value?.prazo_dias || 30
  const etapa1 = Math.max(5, Math.round(totalDias * 0.3))
  const etapa2 = Math.max(10, Math.round(totalDias * 0.65))

  return [
    {
      titulo: 'Imersão e definição fina',
      descricao: 'Alinhamos objetivos, fluxos e prioridades para execução sem retrabalho.',
      prazo: `Dias 1 a ${etapa1}`
    },
    {
      titulo: 'Construção do núcleo do produto',
      descricao: 'Implementamos as funcionalidades centrais com validações progressivas.',
      prazo: `Dias ${etapa1 + 1} a ${etapa2}`
    },
    {
      titulo: 'Polimento, publicação e validação',
      descricao: 'Finalizamos qualidade, ajustes de performance e entrega pronta para uso.',
      prazo: `Dias ${etapa2 + 1} a ${totalDias}`
    }
  ]
})

const whatsAppAprovacaoLink = computed(() => {
  const msg = `Olá, equipe Vale Apps. Quero aprovar a proposta "${nomeProjeto.value}".`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
})

const whatsAppDuvidasLink = computed(() => {
  const msg = `Olá, equipe Vale Apps. Tenho dúvidas sobre a proposta "${nomeProjeto.value}".`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
})

const emailAprovacaoLink = computed(() => {
  const subject = `Aprovação da proposta - ${nomeProjeto.value}`
  const body = `Olá, equipe Vale Apps.%0D%0A%0D%0AConfirmo a aprovação da proposta "${nomeProjeto.value}" para ${nomeCliente.value}.%0D%0A%0D%0AObrigado.`
  return `mailto:contato@valeapps.com.br?subject=${encodeURIComponent(subject)}&body=${body}`
})

const renderedMaisInfo = computed(() => {
  if (!proposta.value?.mais_info) return ''
  try {
    const raw = proposta.value.mais_info
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .trim()
    if (!raw) return ''

    const pareceHtml = /<\/?[a-z][\s\S]*>/i.test(raw)
    if (pareceHtml) return raw

    return marked.parse(raw, { breaks: true }) as string
  } catch {
    return proposta.value.mais_info
  }
})

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarHoras(horas: number) {
  if (!Number.isFinite(horas)) return '0h'
  const valor = Math.round((horas + Number.EPSILON) * 100) / 100
  return `${valor}h`
}

function projectImage(projeto: Projeto): string | null {
  if (projeto.capa) return projeto.capa
  const imagens = projeto.imgens
  return Array.isArray(imagens) && imagens.length ? (imagens[0] ?? null) : null
}

function projectLink(projeto: Projeto): string | null {
  return projeto.link_web || projeto.link_google || projeto.link_apple || null
}

const pageTitle = computed(() =>
  proposta.value?.nome_proejeto
    ? `${proposta.value.nome_proejeto} — Vale Apps`
    : 'Proposta — Vale Apps'
)
const pageDescription = computed(() =>
  proposta.value?.nome_proejeto
    ? `Proposta comercial: ${proposta.value.nome_proejeto} para ${proposta.value.nome_cliente || 'cliente'}`
    : 'Proposta comercial Vale Apps'
)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})
</script>
