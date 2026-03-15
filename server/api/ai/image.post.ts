/**
 * POST /api/ai/image
 * Gera imagem via DALL-E (OpenAI) ou Imagen (Gemini).
 * Body: { provider: 'chatgpt' | 'gemini', prompt: string }
 * Retorna: { imageBase64?: string, mimeType?: string } ou erro.
 */

import { requireAuth } from '~~/server/utils/auth'
import { openAICreateImage } from '~~/server/utils/aiOpenAI'
import { geminiCreateImage } from '~~/server/utils/aiGemini'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const config = useRuntimeConfig(event)
  const body = await readBody<{ provider: 'chatgpt' | 'gemini'; prompt: string }>(event)

  if (!body?.provider || typeof body.prompt !== 'string' || !body.prompt.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body deve ter provider e prompt (string não vazia)',
    })
  }

  const provider = body.provider
  const prompt = body.prompt.trim()

  if (provider === 'chatgpt') {
    const apiKey = config.openaiApiKey
    const result = await openAICreateImage(apiKey, prompt)
    if (result.error) {
      throw createError({ statusCode: 502, statusMessage: result.error })
    }
    return {
      imageBase64: result.b64 ?? result.url,
      mimeType: result.url ? undefined : (result.b64 ? 'image/png' : undefined),
    }
  }

  if (provider === 'gemini') {
    const apiKey = config.geminiApiKey
    const result = await geminiCreateImage(apiKey, prompt)
    if (result.error) {
      throw createError({ statusCode: 502, statusMessage: result.error })
    }
    return {
      imageBase64: result.b64,
      mimeType: result.mimeType ?? 'image/png',
    }
  }

  throw createError({ statusCode: 400, statusMessage: 'Provider inválido' })
})
