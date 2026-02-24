<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Redirecionando /proposta sem slug -->
    <div v-if="!slug" class="flex min-h-screen items-center justify-center">
      <p class="text-sm text-muted-foreground">Redirecionando...</p>
    </div>
    <!-- Loading -->
    <div v-else-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p class="text-sm text-muted-foreground">Carregando proposta...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!proposta" class="flex min-h-screen items-center justify-center p-4">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-lg text-muted-foreground">Proposta não encontrada ou link inválido.</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-brand hover:text-brand-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao site
        </NuxtLink>
      </div>
    </div>

    <!-- Proposal Content -->
    <article v-else class="max-w-3xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
      <!-- Header -->
      <header
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        class="mb-10"
      >
        <NuxtLink
          to="/"
          class="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Vale Apps
        </NuxtLink>

        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          {{ proposta.nome_proejeto || 'Proposta' }}
        </h1>
        <p v-if="proposta.nome_cliente" class="text-muted-foreground mt-2 text-base sm:text-lg">
          Proposta para {{ proposta.nome_cliente }}
        </p>
      </header>

      <!-- Cards -->
      <section class="space-y-5">
        <!-- Tipo de Projeto -->
        <PropostaCard
          v-if="proposta.tipo_projeto"
          :delay="100"
        >
          <CardLabel>Tipo de projeto</CardLabel>
          <p class="font-medium text-foreground">{{ proposta.tipo_projeto }}</p>
        </PropostaCard>

        <!-- Valor + Prazo -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          <div class="proposta-card">
            <CardLabel>Valor</CardLabel>
            <p class="text-2xl sm:text-3xl font-bold text-brand tracking-tight">
              {{ proposta.valor_final != null ? formatarMoeda(proposta.valor_final) : '—' }}
            </p>
          </div>
          <div class="proposta-card">
            <CardLabel>Prazo</CardLabel>
            <p class="font-medium text-foreground text-lg">
              {{ proposta.prazo_dias != null
                ? `${proposta.prazo_dias} dias (${proposta.dias_corridos_ou_ulteis || 'corridos'})`
                : '—'
              }}
            </p>
          </div>
        </div>

        <!-- Serviços incluídos -->
        <PropostaCard
          v-if="proposta.tipos_servicos_enuns?.length"
          :delay="300"
        >
          <CardLabel>Serviços incluídos</CardLabel>
          <ul class="space-y-2 mt-1">
            <li
              v-for="s in proposta.tipos_servicos_enuns"
              :key="s"
              class="flex items-start gap-2.5 text-foreground"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/80" />
              {{ s }}
            </li>
          </ul>
        </PropostaCard>

        <!-- Entregas -->
        <PropostaCard
          v-if="proposta.entregas?.length"
          :delay="400"
        >
          <CardLabel>Entregas</CardLabel>
          <ul class="space-y-2 mt-1">
            <li
              v-for="e in proposta.entregas"
              :key="e"
              class="flex items-start gap-2.5 text-foreground"
            >
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/80" />
              {{ e }}
            </li>
          </ul>
        </PropostaCard>

        <!-- Mais Informações (Markdown) -->
        <PropostaCard
          v-if="proposta.mais_info"
          :delay="500"
        >
          <CardLabel>Mais informações</CardLabel>
          <div class="proposta-prose mt-3" v-html="renderedMaisInfo" />
        </PropostaCard>
      </section>

      <!-- Footer -->
      <footer
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 500, delay: 700 } }"
        class="mt-14 pt-8 border-t border-border text-center"
      >
        <p class="text-sm text-muted-foreground">Dúvidas? Entre em contato com a Vale Apps.</p>
        <NuxtLink
          to="/#contato"
          class="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-300 transition-colors mt-1"
        >
          Página de contato
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'proposta-slug',
})

import { marked } from 'marked'
import { fetchPropostaBySlug } from '~/composables/usePropostas'
import PropostaCard from '~/components/proposta/PropostaCard.vue'
import CardLabel from '~/components/proposta/CardLabel.vue'

const route = useRoute()
const slugParam = route.params.slug
const slugArray = Array.isArray(slugParam) ? slugParam : slugParam ? [slugParam] : []
const slug = (slugArray.length > 0 ? slugArray[0] : '') ?? ''

// /proposta sem slug -> redireciona para home
if (!slug) {
  await navigateTo('/', { replace: true })
}

const { data: proposta, pending } = await useAsyncData(
  `proposta-${slug || 'empty'}`,
  () => (slug ? fetchPropostaBySlug(slug) : Promise.resolve(null)),
  { watch: [() => route.params.slug] }
)

const renderedMaisInfo = computed(() => {
  if (!proposta.value?.mais_info) return ''
  try {
    const raw = proposta.value.mais_info
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .trim()
    if (!raw) return ''
    return marked.parse(raw, { breaks: true }) as string
  } catch {
    return proposta.value.mais_info
  }
})

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
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
