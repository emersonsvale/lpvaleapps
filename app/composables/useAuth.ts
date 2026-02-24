import type { User, Session } from '@supabase/supabase-js'

/**
 * Autenticação do admin via Supabase Auth.
 * signIn/signOut e estado do usuário/sessão.
 */
export function useAuth() {
  const supabase = useSupabase()
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)

  async function loadSession() {
    if (!supabase) return
    const {
      data: { session: s }
    } = await supabase.auth.getSession()
    session.value = s
    user.value = s?.user ?? null
  }

  async function signIn(email: string, password: string) {
    if (!supabase) return { error: 'Supabase não configurado' }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    user.value = data.user
    session.value = data.session
    return { error: null }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  return { user, session, signIn, signOut, loadSession }
}
