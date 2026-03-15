<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex">
    <!-- Menu lateral: sempre visível em desktop; drawer em mobile -->
    <AdminNavMenu v-model:open="menuOpen" />
    <!-- Área de conteúdo: margem esquerda só no desktop (menu fixo tem 256px) -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <AdminHeader :title="pageTitle" :breadcrumbs="breadcrumbs" @toggle-menu="menuOpen = !menuOpen" />
      <main class="flex-1 overflow-auto">
        <div class="p-6 w-full">
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
  if (path === '/admin/chat-ia') return 'Chat IA'
  if (path === '/admin/agentes') return 'Agentes especialistas'
  if (path === '/admin/agentes/novo') return 'Novo agente'
  if (path.match(/^\/admin\/agentes\/[^/]+$/)) return 'Editar agente'
  if (path.match(/^\/admin\/agentes\/[^/]+\/chat$/)) return 'Chat com agente'
  if (path === '/admin/projetos') return 'Projetos'
  if (path === '/admin/projetos/novo') return 'Novo Projeto'
  if (path.match(/^\/admin\/projetos\/\d+(\/.*)?$/)) return 'Workspace do Projeto'
  if (path === '/admin/portifolio') return 'Portifolio'
  if (path === '/admin/portifolio/nova') return 'Novo projeto'
  if (path.match(/^\/admin\/portifolio\/editar\/\d+$/)) return 'Editar projeto'
  if (path === '/admin/propostas') return 'Propostas'
  if (path === '/admin/propostas/nova') return 'Nova Proposta'
  if (path.match(/^\/admin\/propostas\/editar\/\d+$/)) return 'Editar Proposta'
  if (path === '/admin/clientes') return 'CRM Clientes'
  if (path === '/admin/clientes/novo') return 'Novo Cliente'
  if (path.match(/^\/admin\/clientes\/editar\/\d+$/)) return 'Editar Cliente'
  if (path === '/admin/contratos') return 'Contratos'
  if (path === '/admin/contratos/novo') return 'Novo Contrato'
  if (path.match(/^\/admin\/contratos\/editar\/\d+$/)) return 'Editar Contrato'
  if (path === '/admin/blog') return 'Blog'
  if (path === '/admin/blog/novo') return 'Novo Artigo'
  if (path.match(/^\/admin\/blog\/editar\/\d+$/)) return 'Editar Artigo'
  if (path === '/admin/emails') return 'Templates de Email'
  if (path === '/admin/emails/new') return 'Novo Template'
  if (path.match(/^\/admin\/emails\/[^/]+$/)) return 'Editar Template'
  if (path.match(/^\/admin\/emails\/[^/]+\/preview$/)) return 'Preview do Template'
  if (path.match(/^\/admin\/emails\/[^/]+\/test$/)) return 'Teste de Template'
  if (path === '/admin/perfil') return 'Meu Perfil'
  return 'Admin'
})

const breadcrumbs = computed(() => {
  const path = route.path
  const list: { label: string; path?: string }[] = [{ label: 'Dashboard', path: '/admin' }]
  if (path === '/admin') return list
  if (path === '/admin/chat-ia') {
    list.push({ label: 'Chat IA' })
    return list
  }
  if (path === '/admin/agentes') {
    list.push({ label: 'Agentes' })
    return list
  }
  if (path === '/admin/agentes/novo') {
    list.push({ label: 'Agentes', path: '/admin/agentes' }, { label: 'Novo' })
    return list
  }
  if (path.match(/^\/admin\/agentes\/[^/]+$/)) {
    list.push({ label: 'Agentes', path: '/admin/agentes' }, { label: 'Editar' })
    return list
  }
  if (path.match(/^\/admin\/agentes\/[^/]+\/chat$/)) {
    list.push({ label: 'Agentes', path: '/admin/agentes' }, { label: 'Chat' })
    return list
  }
  if (path.startsWith('/admin/projetos')) {
    list.push({ label: 'Projetos', path: '/admin/projetos' })
    if (path === '/admin/projetos/novo') list.push({ label: 'Novo' })
    else if (path.match(/^\/admin\/projetos\/\d+(\/.*)?$/)) list.push({ label: 'Workspace' })
    return list
  }
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
  if (path.startsWith('/admin/contratos')) {
    list.push({ label: 'Contratos', path: '/admin/contratos' })
    if (path === '/admin/contratos/novo') list.push({ label: 'Novo' })
    else if (path.match(/\/editar\/\d+$/)) list.push({ label: 'Editar' })
    return list
  }
  if (path.startsWith('/admin/blog')) {
    list.push({ label: 'Blog', path: '/admin/blog' })
    if (path === '/admin/blog/novo') list.push({ label: 'Novo' })
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
  if (path === '/admin/perfil') {
    list.push({ label: 'Meu Perfil' })
    return list
  }
  return list
})
</script>
