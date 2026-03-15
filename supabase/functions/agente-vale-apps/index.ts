import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { fetchDadosCompletosProjeto } from "./fetch-projeto-data.ts"
import { executeTool, OPENAI_TOOLS, GEMINI_TOOL_DECLARATIONS } from "./agente-tools.ts"
import { getQueryEmbedding } from "./embed.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

type Provider = "chatgpt" | "gemini"

interface MensagemHistorico {
  role: "user" | "assistant"
  content: string
}

interface RequestBody {
  mensagem?: string
  projeto_id?: number | null
  projeto_nome?: string | null
  provider?: Provider
  historico?: MensagemHistorico[]
}

function jsonRes(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

function buildSystemPrompt(
  projetoId: number | null,
  projetoNome: string | null,
  dadosProjeto: string | null,
): string {
  const partes: string[] = [
    "Você é o assistente inteligente do sistema Vale Apps.",
    "Responda SEMPRE em português brasileiro e em markdown bem formatado.",
    "",
    "REGRAS OBRIGATÓRIAS:",
    "1. NUNCA peça ao usuário o nome, ID ou qualquer dado do projeto — você JÁ tem TUDO abaixo.",
    "2. Use os DADOS REAIS para responder sobre tarefas, horas, consumo, orçamento, documentação, requisitos, releases, responsáveis e qualquer métrica.",
    "3. Quando o usuário perguntar sobre \"este projeto\", \"o projeto\", \"consumo\", \"horas\", \"quem fez\", \"tarefas\", \"documentação\" etc., use EXCLUSIVAMENTE os dados abaixo.",
    "4. Para perguntas sobre consumo em valor, custo ou \"quanto já foi consumido\" em dinheiro: use o campo \"Custo das horas executadas (valor hora × horas)\" quando existir nos dados — esse é o custo real das horas já trabalhadas; se o \"Orçamento consumido (lançado)\" for zero, responda com o custo das horas executadas e deixe claro que é o valor das horas já trabalhadas.",
    "5. Apresente dados de forma organizada: use tabelas markdown, listas, percentuais e destaques em negrito.",
    "6. Se algum dado não existir nos dados fornecidos, diga que não há registro — NUNCA invente dados.",
    "7. Você pode CRIAR, EDITAR e EXCLUIR tarefas do projeto. Use as ferramentas criar_tarefa, editar_tarefa, excluir_tarefa. Para editar ou excluir use o ID numérico da tarefa que aparece nos dados do projeto.",
    "8. Ao CRIAR tarefa: interprete a mensagem do usuário para extrair (1) o que é a tarefa → titulo (obrigatório) e, se fizer sentido, descricao; (2) quanto tempo vai levar → horas_estimadas (em horas; ex.: \"2h\", \"vou levar 4 horas\", \"meio dia\" ≈ 4h). Só chame criar_tarefa quando tiver pelo menos um titulo claro. Se o usuário não deixou claro qual é a tarefa ou deu só uma ideia vaga, PERGUNTE uma vez (ex.: \"Qual o título da tarefa?\" ou \"Quanto tempo você estima para essa tarefa?\") em vez de inventar. Não invente título nem horas — se faltar informação essencial, pergunte antes de criar.",
  ]

  if (projetoId != null && projetoId >= 1) {
    partes.push("")
    partes.push("---")
    partes.push(`PROJETO ATUAL: "${projetoNome ?? `ID ${projetoId}`}" (ID: ${projetoId})`)
  }

  if (dadosProjeto) {
    partes.push("")
    partes.push("---")
    partes.push("DADOS COMPLETOS DO PROJETO (fonte real do banco de dados):")
    partes.push("")
    partes.push(dadosProjeto)
  }

  return partes.join("\n")
}

// ---------------------------------------------------------------------------
// LLM call (com suporte a tool calling)
// ---------------------------------------------------------------------------

const MAX_HISTORICO = 20
const MAX_TOOL_ROUNDS = 3

interface ToolCallSpec {
  id: string
  name: string
  args: Record<string, unknown>
}

interface LLMResult {
  text: string | null
  toolCalls: ToolCallSpec[] | null
  /** Só preenchido para OpenAI quando há tool_calls (para rodada de follow-up). */
  openAIAssistantMessage?: { role: "assistant"; content: string | null; tool_calls: Array<{ id: string; function: { name: string; arguments: string } }> }
}

type GeminiPart = { text?: string; functionCall?: { name: string; args: Record<string, unknown> }; functionResponse?: { name: string; response: Record<string, unknown> } }

function buildGeminiContents(historico: MensagemHistorico[], userMessage: string): Array<{ role: string; parts: GeminiPart[] }> {
  const contents: Array<{ role: string; parts: GeminiPart[] }> = []
  for (const m of historico) {
    const role = m.role === "user" ? "user" : "model"
    contents.push({ role, parts: [{ text: m.content }] })
  }
  contents.push({ role: "user", parts: [{ text: userMessage }] })
  return contents
}

function buildOpenAIMessages(historico: MensagemHistorico[], userMessage: string): Array<{ role: "system" | "user" | "assistant"; content: string } | { role: "tool"; tool_call_id: string; content: string }> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string } | { role: "tool"; tool_call_id: string; content: string }> = []
  for (const m of historico) {
    messages.push({ role: m.role as "user" | "assistant", content: m.content })
  }
  messages.push({ role: "user", content: userMessage })
  return messages
}

async function callLLM(
  systemPrompt: string,
  userMessage: string,
  provider: Provider,
  historico: MensagemHistorico[],
  options: {
    useTools: boolean
    openAIAssistantMessage?: { role: "assistant"; content: string | null; tool_calls: Array<{ id: string; function: { name: string; arguments: string } }> }
    toolResults?: Array<{ id: string; content: string }>
  },
): Promise<LLMResult> {
  const hist = Array.isArray(historico) ? historico.slice(-MAX_HISTORICO) : []

  if (provider === "gemini") {
    const key = Deno.env.get("GEMINI_API_KEY")
    if (!key) return { text: "**Erro Gemini:** Configure `GEMINI_API_KEY` nos secrets da Edge Function no Supabase (Settings → Edge Functions → Secrets).", toolCalls: null }

    let contents = buildGeminiContents(hist, userMessage)
    const geminiBody: Record<string, unknown> = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
    }
    if (options.useTools) {
      geminiBody.tools = [{ functionDeclarations: GEMINI_TOOL_DECLARATIONS }]
    }

    const tryGemini = async (model: string): Promise<{ ok: boolean; status: number; bodyText: string }> => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        },
      )
      const bodyText = await res.text()
      return { ok: res.ok, status: res.status, bodyText }
    }

    try {
      let result = await tryGemini("gemini-2.5-flash")
      if (!result.ok && (result.status === 400 || result.status === 404)) {
        result = await tryGemini("gemini-1.5-flash")
      }
      const { ok, status, bodyText } = result

      if (!ok) {
        let errMsg = bodyText
        try {
          const errJson = JSON.parse(bodyText) as { error?: { message?: string } }
          if (errJson?.error?.message) errMsg = errJson.error.message
        } catch {
          // ignore
        }
        return { text: `**Erro Gemini (${status}):** ${errMsg}\n\nVerifique a chave em [Google AI Studio](https://aistudio.google.com/apikey) e o secret \`GEMINI_API_KEY\` no Supabase.`, toolCalls: null }
      }
      const data = JSON.parse(bodyText) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string; functionCall?: { name: string; args?: Record<string, unknown> } }> } }>
        error?: { message?: string }
      }
      if (data.error?.message) return { text: `**Erro Gemini:** ${data.error.message}`, toolCalls: null }
      const parts = data.candidates?.[0]?.content?.parts ?? []
      let text: string | null = null
      const toolCalls: ToolCallSpec[] = []
      for (const p of parts) {
        if (p.text) text = (text ?? "") + p.text
        if (p.functionCall?.name) {
          toolCalls.push({
            id: `gemini-${toolCalls.length}`,
            name: p.functionCall.name,
            args: (p.functionCall.args ?? {}) as Record<string, unknown>,
          })
        }
      }
      return { text: text || null, toolCalls: toolCalls.length ? toolCalls : null }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return { text: `**Erro ao chamar Gemini:** ${msg}`, toolCalls: null }
    }
  }

  const key = Deno.env.get("OPENAI_API_KEY")
  if (!key) return { text: "**Erro ChatGPT:** Configure `OPENAI_API_KEY` nos secrets da Edge Function ou use o modelo Gemini.", toolCalls: null }

  type OpenAIMessage =
    | { role: "system" | "user" | "assistant"; content: string }
    | { role: "assistant"; content: string | null; tool_calls: Array<{ id: string; function: { name: string; arguments: string } }> }
    | { role: "tool"; tool_call_id: string; content: string }
  let messages: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    ...buildOpenAIMessages(hist, userMessage),
  ]
  if (options.openAIAssistantMessage) {
    messages.push(options.openAIAssistantMessage)
    if (options.toolResults) {
      for (const tr of options.toolResults) {
        messages.push({ role: "tool", tool_call_id: tr.id, content: tr.content })
      }
    }
  }

  const body: Record<string, unknown> = {
    model: "gpt-4o",
    messages,
    max_tokens: 2048,
  }
  if (options.useTools && !options.openAIAssistantMessage) {
    body.tools = OPENAI_TOOLS
    body.tool_choice = "auto"
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    })
    const bodyText = await res.text()
    if (!res.ok) {
      let errMsg = bodyText
      try {
        const errJson = JSON.parse(bodyText) as { error?: { message?: string } }
        if (errJson?.error?.message) errMsg = errJson.error.message
      } catch {
        // ignore
      }
      return { text: `**Erro OpenAI (${res.status}):** ${errMsg}`, toolCalls: null }
    }
    const data = JSON.parse(bodyText) as {
      choices?: Array<{
        message?: {
          content?: string | null
          tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>
        }
      }>
    }
    const msg = data.choices?.[0]?.message
    if (!msg) return { text: "Sem resposta do ChatGPT.", toolCalls: null }
    const toolCallsRaw = msg.tool_calls
    if (toolCallsRaw?.length) {
      const toolCalls: ToolCallSpec[] = toolCallsRaw.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        args: (() => {
          try {
            return JSON.parse(tc.function.arguments || "{}") as Record<string, unknown>
          } catch {
            return {}
          }
        })(),
      }))
      return {
        text: msg.content?.trim() || null,
        toolCalls,
        openAIAssistantMessage: { role: "assistant", content: msg.content ?? null, tool_calls: toolCallsRaw },
      }
    }
    return { text: msg.content?.trim() ?? "Sem resposta do ChatGPT.", toolCalls: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { text: `**Erro ao chamar ChatGPT:** ${msg}`, toolCalls: null }
  }
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonRes({ error: "Não autenticado. Token Bearer obrigatório." }, 401)
    }

    const body = (await req.json()) as RequestBody
    const mensagem = typeof body.mensagem === "string" ? body.mensagem.trim() : ""
    if (!mensagem) {
      return jsonRes({ error: "Campo mensagem é obrigatório." }, 400)
    }

    const projetoId =
      body.projeto_id != null && Number.isFinite(Number(body.projeto_id)) && Number(body.projeto_id) >= 1
        ? Number(body.projeto_id)
        : null

    const projetoNome =
      body.projeto_nome != null && String(body.projeto_nome).trim()
        ? String(body.projeto_nome).trim()
        : null

    const provider: Provider = body.provider === "gemini" ? "gemini" : "chatgpt"
    const historico: MensagemHistorico[] = Array.isArray(body.historico)
      ? body.historico.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      : []

    let dadosProjeto: string | null = null
    if (projetoId != null && projetoId >= 1) {
      const url = Deno.env.get("SUPABASE_URL")
      const anon = Deno.env.get("SUPABASE_ANON_KEY")
      if (url && anon) {
        try {
          const queryEmbedding = await getQueryEmbedding(mensagem)
          dadosProjeto = await fetchDadosCompletosProjeto(url, anon, authHeader, projetoId, queryEmbedding ?? undefined)
        } catch (_) {
          // segue sem dados do projeto; o LLM ainda responde
        }
      }
    }

    const systemPrompt = buildSystemPrompt(projetoId, projetoNome, dadosProjeto)
    let llmResult = await callLLM(systemPrompt, mensagem, provider, historico, { useTools: true })

    let resposta = llmResult.text ?? ""

    if (llmResult.toolCalls?.length) {
      const url = Deno.env.get("SUPABASE_URL")
      const anon = Deno.env.get("SUPABASE_ANON_KEY")
      if (url && anon) {
        const supabase = createClient(url, anon, { global: { headers: { Authorization: authHeader } } })
        const toolResults: Array<{ id: string; content: string }> = []
        for (const tc of llmResult.toolCalls) {
          const result = await executeTool(tc.name, tc.args, supabase, projetoId)
          const content = JSON.stringify({ success: result.success, message: result.message, data: result.data })
          toolResults.push({ id: tc.id, content })
        }
        const acoesTexto = toolResults
          .map((tr) => {
            try {
              const r = JSON.parse(tr.content) as { success?: boolean; message?: string }
              return `- ${r.success ? "✅" : "❌"} ${r.message ?? tr.content}`
            } catch {
              return `- ${tr.content}`
            }
          })
          .join("\n")
        resposta = (resposta ? resposta + "\n\n" : "") + "**Ações realizadas:**\n" + acoesTexto

        if (provider === "chatgpt" && llmResult.openAIAssistantMessage && toolResults.length > 0) {
          const followUp = await callLLM(systemPrompt, mensagem, provider, historico, {
            useTools: false,
            openAIAssistantMessage: llmResult.openAIAssistantMessage,
            toolResults,
          })
          if (followUp.text) resposta = followUp.text + (acoesTexto ? "\n\n" + "**Ações realizadas:**\n" + acoesTexto : "")
        }
      } else {
        resposta = (resposta ? resposta + "\n\n" : "") + "**Erro:** Não foi possível executar as ações (Supabase não configurado)."
      }
    }

    if (!resposta.trim()) resposta = "Sem resposta."

    return jsonRes({ resposta })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return jsonRes({ error: `Erro ao processar: ${msg}` }, 500)
  }
})
