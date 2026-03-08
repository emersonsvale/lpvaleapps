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

    <div v-if="timerState.active" class="hidden md:flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/90 px-2 py-1.5 text-xs text-zinc-200">
      <button
        type="button"
        class="flex min-w-0 items-center gap-2 text-left"
        title="Abrir tarefa em execucao"
        @click="abrirTarefaAtiva"
      >
        <span class="max-w-[220px] truncate text-zinc-300">#{{ timerState.tarefaCodigo || timerState.tarefaId }} {{ timerState.tarefaTitulo }}</span>
        <span class="font-semibold text-zinc-100">{{ timerClock }}</span>
        <span class="text-emerald-400">></span>
      </button>
      <button
        type="button"
        class="rounded-sm bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-500"
        title="Parar cronometro"
        @click.stop="solicitarParadaTimer"
      >
        []
      </button>
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

const timerState = useWorkspaceRunningTimerState()
const nowMs = ref(Date.now())
let timerClockHandle: ReturnType<typeof setInterval> | null = null

const timerClock = computed(() => {
  void nowMs.value
  return formatWorkspaceTimerClock(getWorkspaceRunningTimerElapsedSegundos(timerState.value))
})

function syncTimerClock() {
  nowMs.value = Date.now()
}

function startTimerClock() {
  if (timerClockHandle || !timerState.value.active) return
  syncTimerClock()
  timerClockHandle = setInterval(syncTimerClock, 1000)
}

function stopTimerClock() {
  if (!timerClockHandle) return
  clearInterval(timerClockHandle)
  timerClockHandle = null
}

function solicitarParadaTimer() {
  timerState.value.stopRequestAt = Date.now()
}

async function abrirTarefaAtiva() {
  if (!timerState.value.projetoId || !timerState.value.tarefaId) return

  await navigateTo({
    path: `/admin/projetos/${timerState.value.projetoId}/tarefas`,
    query: {
      tarefa: String(timerState.value.tarefaId)
    }
  })
}

onMounted(() => {
  hydrateWorkspaceRunningTimerState()
  syncTimerClock()

  if (timerState.value.active) {
    startTimerClock()
  }
})

watch(
  () => timerState.value.active,
  (active) => {
    if (active) {
      startTimerClock()
      return
    }

    stopTimerClock()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopTimerClock()
})
</script>
