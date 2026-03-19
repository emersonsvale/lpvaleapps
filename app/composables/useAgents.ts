/**
 * Composable para CRUD de agentes especialistas (tipo Gems/ChatGPT projects).
 * Usa /api/agents com autenticação Bearer.
 */

import type { AiAgent, AiAgentKnowledge } from '~/types/ai-agents'

async function getAuthHeaders(): Promise<Record<string, string>> {
  // Preferir sessão já carregada pelo useAuth (layout) para evitar race no primeiro load
  const auth = useAuth()
  let token = auth.session.value?.access_token ?? null
  if (!token) {
    const supabase = useSupabase()
    if (!supabase) throw new Error('Supabase não está disponível')
    const { data } = await supabase.auth.getSession()
    token = data.session?.access_token ?? null
  }
  if (!token) {
    const supabase = useSupabase()
    if (supabase) {
      const { data: refresh } = await supabase.auth.refreshSession()
      token = refresh.session?.access_token ?? null
    }
  }
  if (!token) throw new Error('Sessão expirada. Faça login novamente.')
  return { Authorization: `Bearer ${token}` }
}

export function useAgents() {
  async function list(): Promise<AiAgent[]> {
    const headers = await getAuthHeaders()
    const data = await $fetch<AiAgent[]>('/api/agents', { headers })
    return data ?? []
  }

  async function get(id: string): Promise<AiAgent | null> {
    const headers = await getAuthHeaders()
    try {
      return await $fetch<AiAgent>(`/api/agents/${id}`, { headers })
    } catch (e: any) {
      if (e?.statusCode === 404) return null
      throw e
    }
  }

  async function create(payload: {
    nome: string
    slug?: string
    descricao?: string
    instrucoes_sistema?: string
    provider?: 'chatgpt' | 'gemini'
  }): Promise<AiAgent> {
    const headers = await getAuthHeaders()
    return $fetch<AiAgent>('/api/agents', {
      method: 'POST',
      headers,
      body: payload,
    })
  }

  async function update(
    id: string,
    payload: Partial<{ nome: string; slug: string; descricao: string; instrucoes_sistema: string; provider: 'chatgpt' | 'gemini' }>
  ): Promise<AiAgent> {
    const headers = await getAuthHeaders()
    return $fetch<AiAgent>(`/api/agents/${id}`, {
      method: 'PUT',
      headers,
      body: payload,
    })
  }

  async function remove(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    await $fetch(`/api/agents/${id}`, { method: 'DELETE', headers })
  }

  async function listKnowledge(agentId: string): Promise<AiAgentKnowledge[]> {
    const headers = await getAuthHeaders()
    const data = await $fetch<AiAgentKnowledge[]>(`/api/agents/${agentId}/knowledge`, { headers })
    return data ?? []
  }

  async function addKnowledgeText(agentId: string, payload: { titulo?: string; conteudo_texto: string }): Promise<AiAgentKnowledge> {
    const headers = await getAuthHeaders()
    return $fetch<AiAgentKnowledge>(`/api/agents/${agentId}/knowledge`, {
      method: 'POST',
      headers,
      body: { tipo: 'text', ...payload },
    })
  }

  async function uploadKnowledgeFile(agentId: string, file: File): Promise<AiAgentKnowledge> {
    const headers = await getAuthHeaders()
    const form = new FormData()
    form.append('file', file)
    return $fetch<AiAgentKnowledge>(`/api/agents/${agentId}/knowledge/upload`, {
      method: 'POST',
      headers,
      body: form,
    })
  }

  async function removeKnowledge(agentId: string, knowledgeId: string): Promise<void> {
    const headers = await getAuthHeaders()
    await $fetch(`/api/agents/${agentId}/knowledge/${knowledgeId}`, { method: 'DELETE', headers })
  }

  return {
    list,
    get,
    create,
    update,
    remove,
    listKnowledge,
    addKnowledgeText,
    uploadKnowledgeFile,
    removeKnowledge,
  }
}
