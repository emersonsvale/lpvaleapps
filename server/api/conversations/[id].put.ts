/**
 * PUT /api/conversations/:id - Atualiza título e/ou descrição da conversa.
 * Body: { titulo?, descricao? } (ao menos um)
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data: existing } = await supabase
    .from('ai_conversations')
    .select('created_by')
    .eq('id', id)
    .single()

  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Conversa não encontrada' })
  if (existing.created_by !== user.id) throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })

  const body = await readBody<{ titulo?: string; descricao?: string }>(event)
  const updates: Record<string, string | null> = {}
  if (body?.titulo !== undefined) updates.titulo = body.titulo?.trim() ?? ''
  if (body?.descricao !== undefined) updates.descricao = body.descricao?.trim() || null
  if (Object.keys(updates).length === 0) throw createError({ statusCode: 400, statusMessage: 'Envie titulo e/ou descricao' })

  const { data, error } = await supabase
    .from('ai_conversations')
    .update(updates)
    .eq('id', id)
    .select('id, agent_id, titulo, descricao, created_by, created_at, updated_at')
    .single()

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data
})
