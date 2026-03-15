/**
 * Gera embedding da mensagem do usuário para RAG (OpenAI text-embedding-3-small, 1536 dims).
 * Usado para buscar trechos relevantes da documentação do projeto em match_projeto_docs.
 */
export async function getQueryEmbedding(text: string): Promise<number[] | null> {
  const key = Deno.env.get("OPENAI_API_KEY")
  if (!key?.trim()) return null

  const trimmed = text.trim()
  if (!trimmed) return null

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: trimmed.slice(0, 8000),
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("OpenAI embeddings error:", res.status, errText)
      return null
    }

    const data = (await res.json()) as { data?: Array<{ embedding?: number[] }> }
    const embedding = data.data?.[0]?.embedding
    return Array.isArray(embedding) ? embedding : null
  } catch (e) {
    console.error("getQueryEmbedding error:", e)
    return null
  }
}
