/**
 * GET /api/agents/:id/knowledge - Lista conhecimento do agente.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data, error } = await supabase
    .from('ai_agent_knowledge')
    .select('id, agent_id, tipo, titulo, conteudo_texto, storage_path, nome_arquivo, mime_type, created_at')
    .eq('agent_id', id)
    .order('created_at', { ascending: true })

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data ?? []
})
