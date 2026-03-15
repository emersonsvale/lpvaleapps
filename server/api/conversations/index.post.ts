/**
 * POST /api/conversations - Cria conversa.
 * Body: { agent_id, titulo?, descricao? }
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const body = await readBody<{ agent_id: string; titulo?: string; descricao?: string }>(event)
  if (!body?.agent_id?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'agent_id obrigatório' })
  }

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      agent_id: body.agent_id.trim(),
      titulo: body.titulo?.trim() || 'Nova conversa',
      descricao: body.descricao?.trim() || null,
      created_by: user.id,
    })
    .select('id, agent_id, titulo, descricao, created_by, created_at, updated_at')
    .single()

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data
})
