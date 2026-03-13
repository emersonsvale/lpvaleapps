<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
      aria-hidden="true"
      @click="open = false"
    />
  </Teleport>

  <aside
    class="admin-sidebar flex flex-col border-r border-zinc-800 bg-zinc-900 w-64 shrink-0 fixed left-0 top-0 z-50 h-screen max-lg:transition-transform max-lg:duration-200"
    :class="open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'"
  >
    <div class="p-5 border-b border-zinc-800/80">
      <NuxtLink to="/admin" class="flex items-center gap-3">
        <img src="/logo-header.png" alt="Logo Vale Apps" class="h-5 w-auto object-contain" />
        <div>
          <span class="font-semibold text-zinc-100">Vale Apps</span>
          <span class="block text-[11px] text-zinc-500 uppercase tracking-wider">Gestão</span>
        </div>
      </NuxtLink>
    </div>

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
            to="/admin/projetos"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/projetos') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhStack class="w-5 h-5 shrink-0 opacity-80" />
            <span>Projetos</span>
          </NuxtLink>
        </li>
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
        <li>
          <NuxtLink
            to="/admin/clientes"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/clientes') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhUsersThree class="w-5 h-5 shrink-0 opacity-80" />
            <span>CRM Clientes</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/contratos"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/contratos') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
              <PhFileText class="w-5 h-5 shrink-0 opacity-80" />
            <span>Contratos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/blog"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/blog') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhArticle class="w-5 h-5 shrink-0 opacity-80" />
            <span>Blog</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/admin/emails"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="isActive('/admin/emails') ? 'bg-brand/15 text-brand' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'"
            @click="open = false"
          >
            <PhEnvelopeSimple class="w-5 h-5 shrink-0 opacity-80" />
            <span>Emails</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="p-3 border-t border-zinc-800/80 space-y-1">
      <NuxtLink
        to="/admin/perfil"
        class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
        @click="open = false"
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
        <div class="min-w-0 flex-1">
          <p class="text-sm text-zinc-200 truncate">{{ profile?.nome || user?.email || '' }}</p>
          <p v-if="profile?.cargo" class="text-[11px] text-zinc-500 truncate">{{ profile.cargo }}</p>
          <p v-else-if="user?.email" class="text-[11px] text-zinc-500 truncate">{{ user.email }}</p>
        </div>
      </NuxtLink>
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
  PhUsersThree,
  PhSignOut,
  PhEnvelopeSimple,
  PhArticle,
  PhStack,
  PhUserCircle,
} from '@phosphor-icons/vue'

const route = useRoute()
const { user, signOut } = useAuth()
const { profile, loadProfile } = useProfile()

onMounted(() => {
  loadProfile()
})

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
