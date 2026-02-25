<template>
  <!-- Overlay no mobile quando menu aberto -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
      aria-hidden="true"
      @click="open = false"
    />
  </Teleport>
  <!-- Menu lateral: fixo na tela (fixed top-0 left-0). Mobile = drawer. -->
  <aside
    class="admin-sidebar flex flex-col border-r border-zinc-800 bg-zinc-900 w-64 shrink-0 fixed left-0 top-0 z-50 h-screen max-lg:transition-transform max-lg:duration-200"
    :class="open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'"
  >
    <!-- Logo / Marca -->
    <div class="p-5 border-b border-zinc-800/80">
      <NuxtLink to="/admin" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-brand/20 flex items-center justify-center">
          <PhCode class="w-5 h-5 text-brand" />
        </div>
        <div>
          <span class="font-semibold text-zinc-100">Vale Apps</span>
          <span class="block text-[11px] text-zinc-500 uppercase tracking-wider">Gestão</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navegação -->
    <nav class="flex-1 overflow-y-auto py-4">
      <p class="px-4 mb-2 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Visão geral</p>
      <ul class="space-y-0.5 px-3">
        <li>
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin') && route.path === '/admin' ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhChartLine class="w-5 h-5 shrink-0 opacity-80" />
            <span>Dashboard</span>
          </NuxtLink>
        </li>
      </ul>

      <p class="px-4 mt-6 mb-2 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Gestão</p>
      <ul class="space-y-0.5 px-3">
        <li>
          <NuxtLink
            to="/admin/portifolio"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/portifolio') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhFolderOpen class="w-5 h-5 shrink-0 opacity-80" />
            <span>Portifolio</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/propostas"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/propostas') && route.path !== '/admin/propostas/nova' ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhFileText class="w-5 h-5 shrink-0 opacity-80" />
            <span>Propostas</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Usuário e Sair -->
    <div class="p-3 border-t border-zinc-800/80 space-y-1">
      <p v-if="user?.email" class="text-xs text-zinc-500 truncate px-2 py-1" :title="user.email">
        {{ user.email }}
      </p>
      <button
        type="button"
        class="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-colors"
        @click="handleLogout"
      >
        <PhSignOut class="w-5 h-5 shrink-0" />
        <span>Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  PhCode,
  PhChartLine,
  PhFolderOpen,
  PhFileText,
  PhPlus,
  PhSignOut
} from '@phosphor-icons/vue'

const route = useRoute()
const { user, signOut } = useAuth()

const open = defineModel<boolean>({ default: false })

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

async function handleLogout() {
  await signOut()
  await navigateTo('/admin/login')
}
</script>
