/**
 * Chat com o agente IA do Vale Apps via Supabase Edge Function.
 * Edge Function: agente-vale-apps (Text-to-SQL + RAG vetorial).
 * O cliente Supabase envia automaticamente o JWT da sessão (Authorization: Bearer).
 * RLS no backend exige usuário autenticado.
 */

export interface AgenteResposta {
  resposta: string
}

export type AgenteProvider = 'chatgpt' | 'gemini'

export interface MensagemHistorico {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentePayload {
  mensagem: string
  projeto_id: number | null
  projeto_nome?: string | null
  provider?: AgenteProvider
  historico?: MensagemHistorico[]
}

/**
 * Envia a mensagem para a Edge Function agente-vale-apps.
 * Envia projeto_id, projeto_nome e historico da conversa para o agente manter contexto.
 */
export function useChatProjeto() {
  async function enviarMensagem(
    projetoId: number | null,
    mensagem: string,
    projetoNome?: string | null,
    provider: AgenteProvider = 'chatgpt',
    historico: MensagemHistorico[] = []
  ): Promise<{ resposta?: string; error?: string }> {
    const supabase = useSupabase()
    if (!supabase) {
      return { error: 'Supabase não está configurado.' }
    }

    const texto = (mensagem ?? '').trim()
    if (!texto) {
      return { error: 'Digite uma mensagem.' }
    }

    const idNum =
      projetoId != null && Number.isFinite(Number(projetoId)) && Number(projetoId) >= 1
        ? Number(projetoId)
        : null

    const body: AgentePayload = {
      mensagem: texto,
      projeto_id: idNum,
      projeto_nome: (projetoNome ?? '').trim() || null,
      provider,
      historico: Array.isArray(historico) && historico.length > 0 ? historico : undefined,
    }

    try {
      const { data, error } = await supabase.functions.invoke<AgenteResposta & { error?: string }>(
        'agente-vale-apps',
        { body }
      )

      if (error) {
        const msg = error.message ?? 'Erro ao processar sua pergunta. Tente novamente.'
        return { error: msg }
      }

      const payload = data as { resposta?: string; error?: string } | null
      if (payload?.error) {
        return { error: payload.error }
      }

      const resposta = payload?.resposta
      if (typeof resposta !== 'string') {
        return { error: 'Resposta inválida. Tente novamente.' }
      }

      return { resposta }
    } catch (e) {
      const err = e as Error & { message?: string }
      const msg =
        err?.message ??
        'Não foi possível conectar ao agente. Verifique sua conexão e tente novamente.'
      return { error: msg }
    }
  }

  return { enviarMensagem }
}
