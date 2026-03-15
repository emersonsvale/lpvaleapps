/**
 * Composable para conversas dos agentes (listar, criar, carregar com mensagens, chat).
 */

import type { AiConversation, AiMessage } from '~/types/ai-agents'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = useSupabase()
  if (!supabase) throw new Error('Supabase não está disponível')
  const { data } = await supabase.auth.getSession()
  let token = data.session?.access_token
  if (!token) {
    const { data: refresh } = await supabase.auth.refreshSession()
    token = refresh.session?.access_token
  }
  if (!token) throw new Error('Sessão expirada. Faça login novamente.')
  return { Authorization: `Bearer ${token}` }
}

export interface ConversationWithMessages extends AiConversation {
  messages: AiMessage[]
}

export function useAgentConversations() {
  async function listByAgent(agentId: string): Promise<AiConversation[]> {
    const headers = await getAuthHeaders()
    const data = await $fetch<AiConversation[]>(`/api/agents/${agentId}/conversations`, { headers })
    return data ?? []
  }

  async function create(
    agentId: string,
    opts?: { titulo?: string; descricao?: string }
  ): Promise<AiConversation> {
    const headers = await getAuthHeaders()
    return $fetch<AiConversation>('/api/conversations', {
      method: 'POST',
      headers,
      body: {
        agent_id: agentId,
        titulo: opts?.titulo?.trim() || 'Nova conversa',
        descricao: opts?.descricao?.trim() || undefined,
      },
    })
  }

  async function getWithMessages(conversationId: string): Promise<ConversationWithMessages> {
    const headers = await getAuthHeaders()
    return $fetch<ConversationWithMessages>(`/api/conversations/${conversationId}`, { headers })
  }

  async function updateConversation(
    conversationId: string,
    payload: { titulo?: string; descricao?: string }
  ): Promise<AiConversation> {
    const headers = await getAuthHeaders()
    return $fetch<AiConversation>(`/api/conversations/${conversationId}`, {
      method: 'PUT',
      headers,
      body: payload,
    })
  }

  /** @deprecated Use updateConversation */
  async function updateTitle(conversationId: string, titulo: string): Promise<AiConversation> {
    return updateConversation(conversationId, { titulo })
  }

  async function remove(conversationId: string): Promise<void> {
    const headers = await getAuthHeaders()
    await $fetch(`/api/conversations/${conversationId}`, { method: 'DELETE', headers })
  }

  async function sendMessage(agentId: string, message: string, conversationId?: string): Promise<{ conversation_id: string; text: string }> {
    const headers = await getAuthHeaders()
    return $fetch<{ conversation_id: string; text: string }>('/api/ai/agent-chat', {
      method: 'POST',
      headers,
      body: { agent_id: agentId, conversation_id: conversationId || undefined, message },
    })
  }

  return {
    listByAgent,
    create,
    getWithMessages,
    updateTitle,
    updateConversation,
    remove,
    sendMessage,
  }
}
