/**
 * PUT /api/agents/:id - Atualiza agente (apenas dono).
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id obrigatório' })

  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const body = await readBody<{
    nome?: string
    slug?: string
    descricao?: string
    instrucoes_sistema?: string
    provider?: 'chatgpt' | 'gemini'
  }>(event)

  const { data: existing } = await supabase.from('ai_agents').select('created_by').eq('id', id).single()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Agente não encontrado' })
  if (existing.created_by && existing.created_by !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Sem permissão para editar este agente' })
  }

  const updates: Record<string, unknown> = {}
  if (body?.nome !== undefined) updates.nome = body.nome.trim()
  if (body?.slug !== undefined) updates.slug = body.slug.trim()
  if (body?.descricao !== undefined) updates.descricao = body.descricao?.trim() ?? ''
  if (body?.instrucoes_sistema !== undefined) updates.instrucoes_sistema = body.instrucoes_sistema?.trim() ?? ''
  if (body?.provider !== undefined) updates.provider = body.provider

  if (Object.keys(updates).length === 0) {
    const { data } = await supabase.from('ai_agents').select('*').eq('id', id).single()
    return data
  }

  const { data, error } = await supabase
    .from('ai_agents')
    .update(updates)
    .eq('id', id)
    .select('id, nome, slug, descricao, instrucoes_sistema, provider, created_by, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Slug já existe' })
    throw createError({ statusCode: 502, statusMessage: error.message })
  }
  return data
})
