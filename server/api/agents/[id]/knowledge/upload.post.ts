/**
 * POST /api/agents/:id/knowledge/upload - Upload de arquivo para conhecimento do agente.
 * FormData: file (arquivo). Tipos aceitos: PDF, TXT, MD, JSON, CSV.
 * O conteúdo de TXT/MD é extraído e salvo em conteudo_texto para uso no contexto do chat.
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

const TEXT_MIMES = ['text/plain', 'text/markdown', 'text/csv', 'application/json']

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

  const form = await readMultipartFormData(event)
  const file = form?.find((f) => f.name === 'file' && f.data)
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Envie um arquivo (campo "file")' })
  }

  const mimeType = file.type || 'application/octet-stream'
  const allowed = ['application/pdf', 'text/plain', 'text/markdown', 'application/json', 'text/csv']
  if (!allowed.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipo de arquivo não permitido. Use PDF, TXT, MD, JSON ou CSV.' })
  }

  const safeName = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const storagePath = `${id}/${safeName}`

  const { error: uploadErr } = await supabase.storage
    .from('agent-knowledge')
    .upload(storagePath, file.data, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadErr) throw createError({ statusCode: 502, statusMessage: uploadErr.message })

  let conteudoTexto: string | null = null
  if (TEXT_MIMES.includes(mimeType)) {
    try {
      conteudoTexto = new TextDecoder('utf-8').decode(file.data)
    } catch {
      conteudoTexto = null
    }
  }

  const { data, error } = await supabase
    .from('ai_agent_knowledge')
    .insert({
      agent_id: id,
      tipo: 'file',
      titulo: file.filename,
      conteudo_texto: conteudoTexto,
      storage_path: storagePath,
      nome_arquivo: file.filename,
      mime_type: mimeType,
    })
    .select('id, agent_id, tipo, titulo, conteudo_texto, storage_path, nome_arquivo, mime_type, created_at')
    .single()

  if (error) throw createError({ statusCode: 502, statusMessage: error.message })
  return data
})
