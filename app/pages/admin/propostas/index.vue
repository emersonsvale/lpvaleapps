<template>
  <div>
    <h1 class="text-2xl font-semibold text-zinc-100 mb-2">Propostas</h1>
    <p class="text-zinc-400 mb-6">Lista de propostas. Envie o link da proposta para o cliente analisar.</p>
    <div v-if="pending" class="text-zinc-500">Carregando...</div>
    <div v-else-if="erro" class="text-red-400">{{ erro }}</div>
    <div v-else class="space-y-3">
      <div
        v-for="p in propostas"
        :key="p.id"
        class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50"
      >
        <div>
          <span class="font-medium text-zinc-200">{{ p.nome_proejeto || p.nome_cliente || 'Proposta #' + p.id }}</span>
          <span v-if="p.nome_cliente" class="text-zinc-500 text-sm block">{{ p.nome_cliente }}</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span v-if="p.valor_final != null" class="text-brand font-medium">
            {{ formatarMoeda(p.valor_final) }}
          </span>
          <a
            v-if="p.slug"
            :href="linkProposta(p.slug)"
            target="_blank"
            rel="noopener"
            class="text-sm text-brand hover:underline"
          >
            Ver proposta →
          </a>
          <NuxtLink
            :to="`/admin/propostas/editar/${p.id}`"
            class="text-sm text-zinc-400 hover:text-zinc-200"
          >
            Editar
          </NuxtLink>
        </div>
      </div>
      <p v-if="propostas.length === 0" class="text-zinc-500">Nenhuma proposta. Crie uma em Nova Proposta.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchPropostas } from '~/composables/usePropostas'

definePageMeta({ layout: 'admin' })

const { data: propostas, pending, error: erro } = await useAsyncData('admin-propostas', fetchPropostas)

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function linkProposta(slug: string) {
  if (import.meta.client) return `${window.location.origin}/proposta/${slug}`
  const config = useRuntimeConfig().public
  const base = (config.baseURL as string) || ''
  return `${base.replace(/\/$/, '')}/proposta/${slug}`
}
</script>
