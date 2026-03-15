/**
 * DELETE /api/agents/:id - Remove agente (apenas dono).
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data: existing } = await supabase.from('ai_agents').select('created_by').eq('id', id).single()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Agente não encontrado' })
  if (existing.created_by && existing.created_by !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão para excluir este agente' })
  }

  const { error } = await supabase.from('ai_agents').delete().eq('id', id)
  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return { ok: true }
})
