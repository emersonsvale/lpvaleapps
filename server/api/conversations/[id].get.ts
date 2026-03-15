/**
 * GET /api/conversations/:id - Obtém conversa com mensagens.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data: conv, error: convError } = await supabase
    .from('ai_conversations')
    .select('id, agent_id, titulo, descricao, created_by, created_at, updated_at')
    .eq('id', id)
    .single()

  if (convError || !conv) {
    throw createError({ statusCode: conv?.code === 'PGRST116' ? 404 : 502, statusMessage: convError?.message ?? 'Não encontrado' })
  }
  if (conv.created_by != null && conv.created_by !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })
  }

  const { data: messages, error: msgError } = await supabase
    .from('ai_messages')
    .select('id, conversation_id, role, content, image_base64, image_mime_type, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (msgError) throw createError({ statusCode: 502, statusMessage: msgError.message })

  return { ...conv, messages: messages ?? [] }
})
