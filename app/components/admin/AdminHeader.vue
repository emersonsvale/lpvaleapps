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

    <div class="flex items-center gap-3">
      <!-- Timer -->
      <div v-if="timerState.active" class="hidden md:flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/90 px-2 py-1.5 text-xs text-zinc-200">
        <button
          type="button"
          class="flex min-w-0 items-center gap-2 text-left"
          title="Abrir tarefa em execucao"
          @click="abrirTarefaAtiva"
        >
          <span class="max-w-[220px] truncate text-zinc-300">#{{ timerState.tarefaCodigo || timerState.tarefaId }} {{ timerState.tarefaTitulo }}</span>
          <span class="font-semibold text-zinc-100">{{ timerClock }}</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-sm px-1 py-0.5 text-white transition-colors hover:text-zinc-200"
          title="Parar cronometro"
          @click.stop="solicitarParadaTimer"
        >
          <PhStopCircle :size="20" weight="fill" class="text-white" />
        </button>
      </div>

      <!-- User info -->
      <NuxtLink
        to="/admin/perfil"
        class="hidden sm:flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-zinc-800/60 transition-colors"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
          <img
            v-if="profile?.avatar_url"
            :src="profile.avatar_url"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <PhUserCircle v-else class="w-5 h-5 text-zinc-500" />
        </div>
        <div class="hidden md:block min-w-0">
          <p class="text-sm font-medium text-zinc-200 truncate max-w-[140px]">{{ profile?.nome || user?.email || '' }}</p>
          <p v-if="profile?.cargo" class="text-[11px] text-zinc-500 truncate max-w-[140px]">{{ profile.cargo }}</p>
        </div>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { PhList, PhUserCircle, PhStopCircle } from '@phosphor-icons/vue'

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

const { user } = useAuth()
const { profile, loadProfile } = useProfile()

onMounted(() => {
  loadProfile()
})

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
