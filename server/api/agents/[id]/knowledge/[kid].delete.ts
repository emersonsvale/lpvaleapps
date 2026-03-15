/**
 * DELETE /api/agents/:id/knowledge/:kid - Remove item de conhecimento.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  const kid = getRouterParam(event, 'kid')
  if (!id || !kid) throw createError({ statusCode: 400, statusMessage: 'id e kid obrigatórios' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data: agent } = await supabase.from('ai_agents').select('created_by').eq('id', id).single()
  if (!agent) throw createError({ statusCode: 404, statusMessage: 'Agente não encontrado' })
  if (agent.created_by && agent.created_by !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })
  }

  const { error } = await supabase
    .from('ai_agent_knowledge')
    .delete()
    .eq('id', kid)
    .eq('agent_id', id)

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return { ok: true }
})
