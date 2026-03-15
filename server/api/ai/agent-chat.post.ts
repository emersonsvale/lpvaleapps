/**
 * POST /api/ai/agent-chat
 * Chat com agente especialista: usa instruções + conhecimento do agente e persiste na conversa.
 * Body: { agent_id, conversation_id?, message }
 */
import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'
import { openAIChat } from '~~/server/utils/aiOpenAI'
import { geminiChat } from '~~/server/utils/aiGemini'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const config = useRuntimeConfig(event)
  const supabase = useSupabaseServer()
  if (!supabase) throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })

  const body = await readBody<{
    agent_id: string
    conversation_id?: string
    message: string
  }>(event)

  if (!body?.agent_id?.trim() || typeof body.message !== 'string' || !body.message.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'agent_id e message obrigatórios' })
  }

  const agentId = body.agent_id.trim()
  const userContent = body.message.trim()

  const { data: agent, error: agentErr } = await supabase
    .from('ai_agents')
    .select('id, nome, instrucoes_sistema, provider')
    .eq('id', agentId)
    .single()

  if (agentErr || !agent) {
    throw createError({ statusCode: 404, statusMessage: 'Agente não encontrado' })
  }

  let conversationId = body.conversation_id?.trim() || null

  if (conversationId) {
    const { data: conv } = await supabase
      .from('ai_conversations')
      .select('id, created_by, agent_id')
      .eq('id', conversationId)
      .single()
    if (!conv || conv.created_by !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Conversa não encontrada ou sem permissão' })
    }
    if (conv.agent_id !== agentId) {
      throw createError({ statusCode: 400, statusMessage: 'Conversa não pertence a este agente' })
    }
  } else {
    const { data: newConv, error: createErr } = await supabase
      .from('ai_conversations')
      .insert({
        agent_id: agentId,
        titulo: userContent.slice(0, 50) + (userContent.length > 50 ? '...' : ''),
        created_by: user.id,
      })
      .select('id')
      .single()
    if (createErr) throw createError({ statusCode: 502, statusMessage: createErr.message })
    conversationId = newConv!.id
  }

  const { data: knowledgeRows } = await supabase
    .from('ai_agent_knowledge')
    .select('tipo, titulo, conteudo_texto')
    .eq('agent_id', agentId)
    .not('conteudo_texto', 'is', null)

  let knowledgeBlock = ''
  if (knowledgeRows?.length) {
    const parts = knowledgeRows
      .filter((k) => k.conteudo_texto)
      .map((k) => (k.titulo ? `### ${k.titulo}\n${k.conteudo_texto}` : k.conteudo_texto))
    if (parts.length) knowledgeBlock = '\n\nConhecimento do agente (use para responder):\n' + parts.join('\n\n---\n\n')
  }

  const systemContent = (agent.instrucoes_sistema || 'Você é um assistente prestativo.') + knowledgeBlock

  const { data: existingMessages } = await supabase
    .from('ai_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  const apiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemContent },
    ...(existingMessages ?? []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userContent },
  ]

  const provider = agent.provider === 'chatgpt' ? 'chatgpt' : 'gemini'
  const apiKey = provider === 'chatgpt' ? config.openaiApiKey : config.geminiApiKey
  if (!apiKey?.trim()) {
    throw createError({
      statusCode: 502,
      statusMessage: provider === 'chatgpt' ? 'OpenAI não configurada' : 'Gemini não configurada',
    })
  }

  const result =
    provider === 'chatgpt'
      ? await openAIChat(apiKey, apiMessages)
      : await geminiChat(apiKey, apiMessages)

  if (result.error) {
    throw createError({ statusCode: 502, statusMessage: result.error })
  }

  const assistantText = result.text || ''

  const { error: insUserErr } = await supabase.from('ai_messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: userContent,
  })
  if (insUserErr) throw createError({ statusCode: 502, statusMessage: insUserErr.message })

  const { error: insAssErr } = await supabase.from('ai_messages').insert({
    conversation_id: conversationId,
    role: 'assistant',
    content: assistantText,
  })
  if (insAssErr) throw createError({ statusCode: 502, statusMessage: insAssErr.message })

  await supabase
    .from('ai_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return {
    conversation_id: conversationId,
    text: assistantText,
  }
})
