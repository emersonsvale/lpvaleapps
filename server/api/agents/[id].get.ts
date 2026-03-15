/**
 * GET /api/agents/:id - Obtém um agente (apenas dono).
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
    .from('ai_agents')
    .select('id, nome, slug, descricao, instrucoes_sistema, provider, created_by, created_at, updated_at')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw createError({ statusCode: error?.code === 'PGRST116' ? 404 : 502, statusMessage: error?.message ?? 'Não encontrado' })
  }
  if (data.created_by && data.created_by !== user.id) {
    throw createError({ statusCode: 404, statusMessage: 'Não encontrado' })
  }
  return data
})
