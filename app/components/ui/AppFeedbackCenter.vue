<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-0 z-[10040]">
      <TransitionGroup
        enter-active-class="transition duration-250 ease-out"
        enter-from-class="opacity-0 translate-y-3"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-180 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
        class="absolute right-4 top-4 flex w-[min(92vw,420px)] flex-col gap-3"
        tag="div"
      >
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto overflow-hidden rounded-xl border bg-zinc-950/95 shadow-2xl backdrop-blur"
          :class="toastClass(toast.type)"
        >
          <div class="flex items-start gap-3 p-4">
            <div class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="dotClass(toast.type)" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-zinc-100">{{ toast.title }}</p>
              <p class="mt-1 whitespace-pre-line text-sm text-zinc-300">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              class="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
              @click="removeToast(toast.id)"
            >
              Fechar
            </button>
          </div>
        </article>
      </TransitionGroup>

      <Transition
        enter-active-class="transition duration-220 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-160 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="confirmState"
          class="pointer-events-auto absolute inset-0 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-[2px]"
          @click.self="resolveConfirm(false)"
        >
          <section class="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div class="h-1.5 w-full" :class="confirmState.danger ? 'bg-red-500/80' : 'bg-brand/80'" />
            <div class="space-y-3 p-5">
              <h2 class="text-lg font-semibold text-zinc-100">{{ confirmState.title }}</h2>
              <p class="whitespace-pre-line text-sm text-zinc-300">{{ confirmState.message }}</p>
            </div>
            <div class="flex justify-end gap-2 border-t border-zinc-800 bg-zinc-900/50 p-4">
              <button
                type="button"
                class="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                @click="resolveConfirm(false)"
              >
                {{ confirmState.cancelLabel }}
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                :class="confirmState.danger ? 'bg-red-600 text-white' : 'bg-brand text-black'"
                @click="resolveConfirm(true)"
              >
                {{ confirmState.confirmLabel }}
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, confirmState, removeToast, resolveConfirm } = useUiFeedback()

function toastClass(type: 'info' | 'success' | 'warning' | 'error') {
  if (type === 'success') return 'border-emerald-500/30'
  if (type === 'warning') return 'border-amber-500/30'
  if (type === 'error') return 'border-red-500/35'
  return 'border-zinc-700'
}

function dotClass(type: 'info' | 'success' | 'warning' | 'error') {
  if (type === 'success') return 'bg-emerald-400'
  if (type === 'warning') return 'bg-amber-400'
  if (type === 'error') return 'bg-red-400'
  return 'bg-brand'
}
</script>
