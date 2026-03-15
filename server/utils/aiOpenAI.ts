/**
 * Integração com OpenAI: chat (GPT) e geração de imagens (DALL-E).
 * Chaves em runtimeConfig: openaiApiKey
 */

export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function openAIChat(
  apiKey: string,
  messages: OpenAIChatMessage[],
  options?: { model?: string; maxTokens?: number }
): Promise<{ text: string; error?: string }> {
  if (!apiKey?.trim()) {
    return { text: '', error: 'OpenAI API key não configurada (OPENAI_API_KEY no .env)' }
  }

  const model = options?.model ?? 'gpt-4o-mini'
  const maxTokens = options?.maxTokens ?? 1024

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      return { text: '', error: `OpenAI: ${res.status} ${errBody}` }
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
      error?: { message?: string }
    }
    if (data.error?.message) {
      return { text: '', error: data.error.message }
    }
    const content = data.choices?.[0]?.message?.content ?? ''
    return { text: content }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { text: '', error: `OpenAI: ${msg}` }
  }
}

export async function openAICreateImage(
  apiKey: string,
  prompt: string,
  options?: { size?: '1024x1024' | '1792x1024' | '1024x1792' }
): Promise<{ url?: string; b64?: string; error?: string }> {
  if (!apiKey?.trim()) {
    return { error: 'OpenAI API key não configurada (OPENAI_API_KEY no .env)' }
  }

  const size = options?.size ?? '1024x1024'

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        response_format: 'b64_json',
        quality: 'standard',
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      return { error: `OpenAI Images: ${res.status} ${errBody}` }
    }

    const data = (await res.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>
      error?: { message?: string }
    }
    if (data.error?.message) {
      return { error: data.error.message }
    }
    const first = data.data?.[0]
    if (first?.b64_json) {
      return { b64: first.b64_json }
    }
    if (first?.url) {
      return { url: first.url }
    }
    return { error: 'Resposta da OpenAI sem imagem' }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { error: `OpenAI Images: ${msg}` }
  }
}
