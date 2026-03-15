/**
 * GET /api/agents/:id/conversations - Lista conversas do agente.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('id, agent_id, titulo, descricao, created_by, created_at, updated_at')
    .eq('agent_id', id)
    .eq('created_by', user.id)
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data ?? []
})
