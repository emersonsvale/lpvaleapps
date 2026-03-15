/**
 * POST /api/agents - Cria agente (autenticado).
 * Body: { nome, slug?, descricao?, instrucoes_sistema?, provider? }
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const body = await readBody<{
    nome: string
    slug?: string
    descricao?: string
    instrucoes_sistema?: string
    provider?: 'chatgpt' | 'gemini'
  }>(event)

  if (!body?.nome?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'nome é obrigatório' })
  }

  const slug = (body.slug?.trim() || slugify(body.nome)) as string
  const { data, error } = await supabase
    .from('ai_agents')
    .insert({
      nome: body.nome.trim(),
      slug,
      descricao: body.descricao?.trim() ?? '',
      instrucoes_sistema: body.instrucoes_sistema?.trim() ?? 'Você é um assistente prestativo.',
      provider: body.provider ?? 'gemini',
      created_by: user.id,
    })
    .select('id, nome, slug, descricao, instrucoes_sistema, provider, created_by, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Slug já existe' })
    throw createError({ statusCode: 502, statusMessage: error.message })
  }
  return data
})
