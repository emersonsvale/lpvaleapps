<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Nova Proposta</h1>
    <p class="text-zinc-400 mb-6">Escolha entre empreitada ou por hora, preencha os dados e gere o link para o cliente.</p>
    <AdminPropostaForm @success="onSuccess" />
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
