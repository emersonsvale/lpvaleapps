/**
 * GET /api/agents - Lista agentes do usuário (autenticado).
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data, error } = await supabase
    .from('ai_agents')
    .select('id, nome, slug, descricao, instrucoes_sistema, provider, created_by, created_at, updated_at')
    .eq('created_by', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: error.message })
  }
  return data ?? []
})
