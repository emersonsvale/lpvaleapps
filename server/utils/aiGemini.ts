/**
 * Integração com Google Gemini: chat e geração de imagens (Imagen).
 * Chave em runtimeConfig: geminiApiKey (variável de ambiente: NUXT_GEMINI_API_KEY ou GEMINI_API_KEY no .env)
 */

import { GoogleGenAI } from '@google/genai'

const GEMINI_CHAT_MODEL = 'gemini-2.5-flash'

export async function geminiChat(
  apiKey: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { model?: string }
): Promise<{ text: string; error?: string }> {
  if (!apiKey?.trim()) {
    return { text: '', error: 'Gemini API key não configurada (NUXT_GEMINI_API_KEY no .env)' }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const systemContent = messages.find((m) => m.role === 'system')?.content
    const turnMessages = messages.filter((m) => m.role !== 'system')
    const contents = turnMessages.map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }))
    const prompt = systemContent
      ? [{ role: 'user' as const, parts: [{ text: systemContent }] }, ...contents].map((c) => c.parts[0].text).join('\n\n')
      : contents.map((c) => c.parts[0].text).join('\n\n')

    const response = await ai.models.generateContent({
      model: options?.model ?? GEMINI_CHAT_MODEL,
      contents: prompt,
    })
    const text = response.text ?? ''
    return { text }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { text: '', error: `Gemini: ${msg}` }
  }
}

export async function geminiCreateImage(
  apiKey: string,
  prompt: string
): Promise<{ b64?: string; mimeType?: string; error?: string }> {
  if (!apiKey?.trim()) {
    return { error: 'Gemini API key não configurada (NUXT_GEMINI_API_KEY no .env)' }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: {
        numberOfImages: 1,
      },
    })
    const first = response.generatedImages?.[0]?.image
    if (first?.imageBytes) {
      return {
        b64: first.imageBytes,
        mimeType: first.mimeType ?? 'image/png',
      }
    }
    return { error: 'Gemini não retornou imagem' }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { error: `Gemini Imagem: ${msg}` }
  }
}
