/**
 * POST /api/ai/chat
 * Envia mensagens para ChatGPT ou Gemini e retorna a resposta.
 * Body: { provider: 'chatgpt' | 'gemini', messages: Array<{ role: 'system'|'user'|'assistant', content: string }> }
 */

import { requireAuth } from '~~/server/utils/auth'
import { openAIChat } from '~~/server/utils/aiOpenAI'
import { geminiChat } from '~~/server/utils/aiGemini'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const config = useRuntimeConfig(event)
  const body = await readBody<{
    provider: 'chatgpt' | 'gemini'
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  }>(event)

  if (!body?.provider || !Array.isArray(body.messages) || !body.messages.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body deve ter provider e messages (array não vazio)',
    })
  }

  const provider = body.provider
  const messages = body.messages

  if (provider === 'chatgpt') {
    const apiKey = config.openaiApiKey
    const result = await openAIChat(apiKey, messages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>)
    if (result.error) {
      throw createError({ statusCode: 502, statusMessage: result.error })
    }
    return { text: result.text }
  }

  if (provider === 'gemini') {
    const apiKey = config.geminiApiKey
    const result = await geminiChat(apiKey, messages)
    if (result.error) {
      throw createError({ statusCode: 502, statusMessage: result.error })
    }
    return { text: result.text }
  }

  throw createError({ statusCode: 400, statusMessage: 'Provider inválido' })
})
