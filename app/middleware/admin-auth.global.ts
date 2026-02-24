/**
 * Protege todas as rotas /admin exceto /admin/login.
 * No servidor não temos sessão (Supabase usa localStorage no client), então a checagem é só no client.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  if (import.meta.server) return

  const supabase = useSupabase()
  if (!supabase) {
    return navigateTo('/admin/login')
  }

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo('/admin/login')
  }
})
