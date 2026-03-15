export type AiProvider = 'chatgpt' | 'gemini'
export type AiKnowledgeType = 'text' | 'file'

export interface AiAgent {
  id: string
  nome: string
  slug: string
  descricao: string | null
  instrucoes_sistema: string
  provider: AiProvider
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AiAgentKnowledge {
  id: string
  agent_id: string
  tipo: AiKnowledgeType
  titulo: string | null
  conteudo_texto: string | null
  storage_path: string | null
  nome_arquivo: string | null
  mime_type: string | null
  created_at: string
}

export interface AiConversation {
  id: string
  agent_id: string
  titulo: string
  descricao: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AiMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  image_base64: string | null
  image_mime_type: string | null
  created_at: string
}
