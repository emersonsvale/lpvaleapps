<template>
  <header class="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
    <div class="flex items-center gap-3 min-w-0">
      <button
        type="button"
        class="lg:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-colors"
        aria-label="Abrir menu"
        @click="$emit('toggle-menu')"
      >
        <PhList class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-semibold text-zinc-100 truncate">{{ title }}</h1>
      <nav v-if="breadcrumbs.length" class="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
        <span v-for="(crumb, i) in breadcrumbs" :key="crumb.path" class="flex items-center gap-2">
          <NuxtLink
            v-if="crumb.path"
            :to="crumb.path"
            class="hover:text-zinc-300 transition-colors"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span v-else class="text-zinc-400">{{ crumb.label }}</span>
          <span v-if="i < breadcrumbs.length - 1" class="text-zinc-600">/</span>
        </span>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { PhList } from '@phosphor-icons/vue'

interface Breadcrumb {
  label: string
  path?: string
}

  withDefaults(
  defineProps<{
    title: string
    breadcrumbs?: Breadcrumb[]
  }>(),
  { breadcrumbs: () => [] }
)
defineEmits<{
  'toggle-menu': []
}>()
</script>
