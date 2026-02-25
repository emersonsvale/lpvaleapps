<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-zinc-500">Propostas</p>
        <h1 class="text-2xl font-semibold text-zinc-100 mt-1">Nova proposta</h1>
        <p class="text-zinc-400 mt-2">Escolha a modalidade, preencha o escopo comercial e gere o link para o cliente.</p>
      </div>
      <NuxtLink
        to="/admin/propostas"
        class="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Voltar para listagem
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-6">
      <AdminPropostaForm @success="onSuccess" />
    </div>

    <div class="rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-zinc-300">
      Dica: mantenha o nome do projeto e os valores comerciais consistentes para facilitar negociações e revisões futuras.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropostaRow } from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

function linkProposta(slug: string) {
  if (import.meta.client) return `${window.location.origin}/proposta/${slug}`
  const config = useRuntimeConfig().public
  const base = (config.baseURL as string) || ''
  return `${base.replace(/\/$/, '')}/proposta/${slug}`
}

function onSuccess(proposta: PropostaRow) {
  const url = proposta.slug ? linkProposta(proposta.slug) : ''
  if (url) {
    if (import.meta.client && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      alert('Proposta criada! Link copiado para a área de transferência:\n' + url)
    } else {
      alert('Proposta criada! Link para o cliente:\n' + url)
    }
  } else {
    alert('Proposta criada!')
  }
  navigateTo('/admin/propostas')
}
</script>
