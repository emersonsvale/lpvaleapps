<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex">
    <!-- Menu lateral: sempre visível em desktop; drawer em mobile -->
    <AdminNavMenu v-model:open="menuOpen" />
    <!-- Área de conteúdo: margem esquerda só no desktop (menu fixo tem 256px) -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <AdminHeader :title="pageTitle" :breadcrumbs="breadcrumbs" @toggle-menu="menuOpen = !menuOpen" />
      <main class="flex-1 overflow-auto">
        <div class="p-6 max-w-6xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { loadSession } = useAuth()
const menuOpen = ref(false)

onMounted(() => {
  loadSession()
})

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path === '/admin/portifolio') return 'Portifolio'
  if (path === '/admin/portifolio/nova') return 'Novo projeto'
  if (path.match(/^\/admin\/portifolio\/editar\/\d+$/)) return 'Editar projeto'
  if (path === '/admin/propostas') return 'Propostas'
  if (path === '/admin/propostas/nova') return 'Nova Proposta'
  if (path.match(/^\/admin\/propostas\/editar\/\d+$/)) return 'Editar Proposta'
  if (path === '/admin/clientes') return 'CRM Clientes'
  if (path === '/admin/clientes/novo') return 'Novo Cliente'
  if (path.match(/^\/admin\/clientes\/editar\/\d+$/)) return 'Editar Cliente'
  if (path === '/admin/emails') return 'Templates de Email'
  if (path === '/admin/emails/new') return 'Novo Template'
  if (path.match(/^\/admin\/emails\/[^/]+$/)) return 'Editar Template'
  if (path.match(/^\/admin\/emails\/[^/]+\/preview$/)) return 'Preview do Template'
  if (path.match(/^\/admin\/emails\/[^/]+\/test$/)) return 'Teste de Template'
  return 'Admin'
})

const breadcrumbs = computed(() => {
  const path = route.path
  const list: { label: string; path?: string }[] = [{ label: 'Dashboard', path: '/admin' }]
  if (path === '/admin') return list
  if (path.startsWith('/admin/portifolio')) {
    list.push({ label: 'Portifolio', path: '/admin/portifolio' })
    if (path === '/admin/portifolio/nova') list.push({ label: 'Novo' })
    else if (path.match(/\/editar\/\d+$/)) list.push({ label: 'Editar' })
    return list
  }
  if (path.startsWith('/admin/propostas')) {
    list.push({ label: 'Propostas', path: '/admin/propostas' })
    if (path === '/admin/propostas/nova') list.push({ label: 'Nova' })
    else if (path.match(/\/editar\/\d+$/)) list.push({ label: 'Editar' })
    return list
  }
  if (path.startsWith('/admin/clientes')) {
    list.push({ label: 'CRM Clientes', path: '/admin/clientes' })
    if (path === '/admin/clientes/novo') list.push({ label: 'Novo' })
    else if (path.match(/\/editar\/\d+$/)) list.push({ label: 'Editar' })
    return list
  }
  if (path.startsWith('/admin/emails')) {
    list.push({ label: 'Templates de Email', path: '/admin/emails' })
    if (path === '/admin/emails/new') list.push({ label: 'Novo' })
    else if (path.match(/\/preview$/)) list.push({ label: 'Preview' })
    else if (path.match(/\/test$/)) list.push({ label: 'Teste' })
    else if (path.match(/^\/admin\/emails\/[^/]+$/)) list.push({ label: 'Editar' })
    return list
  }
  return list
})
</script>
