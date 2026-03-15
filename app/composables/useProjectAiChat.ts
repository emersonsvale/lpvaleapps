/**
 * Composable para chat e geração de imagens por IA no contexto do projeto.
 * Usa as rotas /api/ai/chat e /api/ai/image com autenticação Supabase.
 */

export type ProvedorIa = 'chatgpt' | 'gemini'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

async function getAuthToken(): Promise<string> {
  const supabase = useSupabase()
  if (!supabase) {
    throw new Error('Supabase não está disponível')
  }
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.access_token) {
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError || !refreshData.session?.access_token) {
      throw new Error('Sessão expirada. Faça login novamente.')
    }
    return refreshData.session.access_token
  }
  return data.session.access_token
}

export function useProjectAiChat() {
  async function sendChat(
    provider: ProvedorIa,
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<{ text: string; error?: string }> {
    try {
      const token = await getAuthToken()
      const res = await $fetch<{ text: string }>('/api/ai/chat', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { provider, messages },
      })
      return { text: res.text }
    } catch (e: any) {
      const msg = e?.data?.message ?? e?.message ?? e?.statusMessage ?? String(e)
      return { text: '', error: msg }
    }
  }

  async function generateImage(
    provider: ProvedorIa,
    prompt: string
  ): Promise<{ imageBase64?: string; mimeType?: string; error?: string }> {
    try {
      const token = await getAuthToken()
      const res = await $fetch<{ imageBase64?: string; mimeType?: string }>('/api/ai/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { provider, prompt },
      })
      return {
        imageBase64: res.imageBase64,
        mimeType: res.mimeType ?? 'image/png',
      }
    } catch (e: any) {
      const msg = e?.data?.message ?? e?.message ?? e?.statusMessage ?? String(e)
      return { error: msg }
    }
  }

  return { sendChat, generateImage }
}
