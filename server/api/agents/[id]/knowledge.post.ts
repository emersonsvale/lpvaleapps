/**
 * POST /api/agents/:id/knowledge - Adiciona conhecimento (texto).
 * Body: { tipo: 'text', titulo?, conteudo_texto }
 * Para arquivo use POST .../knowledge/upload com formData.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const { data: agent } = await supabase.from('ai_agents').select('created_by').eq('id', id).single()
  if (!agent) throw createError({ statusCode: 404, statusMessage: 'Agente não encontrado' })
  if (agent.created_by && agent.created_by !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão' })
  }

  const body = await readBody<{ tipo: 'text'; titulo?: string; conteudo_texto: string }>(event)
  if (body?.tipo !== 'text' || typeof body.conteudo_texto !== 'string' || !body.conteudo_texto.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'tipo "text" e conteudo_texto obrigatórios' })
  }

  const { data, error } = await supabase
    .from('ai_agent_knowledge')
    .insert({
      agent_id: id,
      tipo: 'text',
      titulo: body.titulo?.trim() || null,
      conteudo_texto: body.conteudo_texto.trim(),
    })
    .select('id, agent_id, tipo, titulo, conteudo_texto, storage_path, nome_arquivo, mime_type, created_at')
    .single()

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data
})
