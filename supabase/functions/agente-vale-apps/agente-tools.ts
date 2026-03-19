/**
 * Ferramentas do agente: criar, editar e excluir tarefas.
 * Executadas via Supabase com o JWT do usuário (RLS aplicado).
 */

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

const TAREFA_STATUS = ["refinar", "fazer", "em_progresso", "sob_revisao", "concluido"] as const
const TAREFA_TIPO = ["funcionalidade", "bug", "melhoria", "documentacao", "design"] as const
const TAREFA_PRIORIDADE = ["baixa", "media", "alta", "urgente"] as const

export interface ToolResult {
  success: boolean
  message: string
  data?: unknown
}

function normalizeTags(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return (v as unknown[])
    .map((x) => String(x ?? "").trim().slice(0, 40))
    .filter(Boolean)
}

function clampStatus(s: string): string {
  const lower = s?.toLowerCase?.() ?? ""
  return TAREFA_STATUS.includes(lower as typeof TAREFA_STATUS[number]) ? lower : "fazer"
}

function clampTipo(s: string): string {
  const lower = s?.toLowerCase?.() ?? ""
  return TAREFA_TIPO.includes(lower as typeof TAREFA_TIPO[number]) ? lower : "funcionalidade"
}

function clampPrioridade(s: string): string {
  const lower = s?.toLowerCase?.() ?? ""
  return TAREFA_PRIORIDADE.includes(lower as typeof TAREFA_PRIORIDADE[number]) ? lower : "media"
}

function normalizeDate(v: unknown): string | null {
  if (typeof v === "string") {
    const trimmed = v.trim()
    // Valida se é uma data no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }
  }
  return null
}

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  supabase: SupabaseClient,
  projetoId: number | null,
): Promise<ToolResult> {
  if (name === "criar_tarefa") {
    return criarTarefa(args, supabase, projetoId)
  }
  if (name === "editar_tarefa") {
    return editarTarefa(args, supabase)
  }
  if (name === "excluir_tarefa") {
    return excluirTarefa(args, supabase)
  }
  return { success: false, message: `Ferramenta desconhecida: ${name}` }
}

async function criarTarefa(
  args: Record<string, unknown>,
  supabase: SupabaseClient,
  projetoId: number | null,
): Promise<ToolResult> {
  if (projetoId == null || projetoId < 1) {
    return { success: false, message: "É necessário estar em um projeto para criar tarefas." }
  }

  const titulo = typeof args.titulo === "string" ? args.titulo.trim() : ""
  if (!titulo) {
    return { success: false, message: "O campo 'titulo' é obrigatório para criar uma tarefa." }
  }

  const payload: Record<string, unknown> = {
    projeto_id: projetoId,
    titulo,
    descricao: typeof args.descricao === "string" ? args.descricao.trim() || null : null,
    status: clampStatus((args.status as string) ?? "fazer"),
    tipo: clampTipo((args.tipo as string) ?? "funcionalidade"),
    prioridade: clampPrioridade((args.prioridade as string) ?? "media"),
    tags: normalizeTags(args.tags ?? []),
    responsavel_texto: typeof args.responsavel_texto === "string" ? (args.responsavel_texto.trim() || null) : null,
    horas_estimadas: Number(args.horas_estimadas) || 0,
    sprint: typeof args.sprint === "string" ? (args.sprint.trim() || null) : null,
    release: typeof args.release === "string" ? (args.release.trim() || null) : null,
    prazo_inicio: normalizeDate(args.prazo_inicio),
    prazo_fim: normalizeDate(args.prazo_fim),
  }

  const { data, error } = await supabase.from("projetos_tarefas").insert(payload).select("id, titulo, status").single()

  if (error) {
    return { success: false, message: `Erro ao criar tarefa: ${error.message}` }
  }
  return {
    success: true,
    message: `Tarefa criada: "${(data as { titulo?: string }).titulo}" (ID: ${(data as { id?: number }).id})`,
    data: { id: (data as { id?: number }).id, titulo: (data as { titulo?: string }).titulo, status: (data as { status?: string }).status },
  }
}

async function editarTarefa(args: Record<string, unknown>, supabase: SupabaseClient): Promise<ToolResult> {
  const id = args.tarefa_id != null ? Number(args.tarefa_id) : null
  if (id == null || !Number.isFinite(id) || id < 1) {
    return { success: false, message: "É obrigatório informar 'tarefa_id' (ID da tarefa) para editar." }
  }

  const payload: Record<string, unknown> = {}
  if (args.titulo !== undefined) payload.titulo = typeof args.titulo === "string" ? args.titulo.trim() : ""
  if (args.descricao !== undefined) payload.descricao = typeof args.descricao === "string" ? args.descricao.trim() || null : null
  if (args.status !== undefined) payload.status = clampStatus((args.status as string) ?? "")
  if (args.tipo !== undefined) payload.tipo = clampTipo((args.tipo as string) ?? "")
  if (args.prioridade !== undefined) payload.prioridade = clampPrioridade((args.prioridade as string) ?? "")
  if (args.tags !== undefined) payload.tags = normalizeTags(args.tags)
  if (args.responsavel_texto !== undefined) payload.responsavel_texto = typeof args.responsavel_texto === "string" ? (args.responsavel_texto.trim() || null) : null
  if (args.horas_estimadas !== undefined) payload.horas_estimadas = Number(args.horas_estimadas) || 0
  if (args.sprint !== undefined) payload.sprint = typeof args.sprint === "string" ? (args.sprint.trim() || null) : null
  if (args.release !== undefined) payload.release = typeof args.release === "string" ? (args.release.trim() || null) : null
  if (args.prazo_inicio !== undefined) payload.prazo_inicio = normalizeDate(args.prazo_inicio)
  if (args.prazo_fim !== undefined) payload.prazo_fim = normalizeDate(args.prazo_fim)

  if (Object.keys(payload).length === 0) {
    return { success: false, message: "Informe ao menos um campo para editar (titulo, descricao, status, tipo, prioridade, tags, etc.)." }
  }

  const { error } = await supabase.from("projetos_tarefas").update(payload).eq("id", id)

  if (error) {
    return { success: false, message: `Erro ao editar tarefa: ${error.message}` }
  }
  return { success: true, message: `Tarefa ${id} atualizada com sucesso.`, data: { id, ...payload } }
}

async function excluirTarefa(args: Record<string, unknown>, supabase: SupabaseClient): Promise<ToolResult> {
  const id = args.tarefa_id != null ? Number(args.tarefa_id) : null
  if (id == null || !Number.isFinite(id) || id < 1) {
    return { success: false, message: "É obrigatório informar 'tarefa_id' (ID da tarefa) para excluir." }
  }

  const { error } = await supabase.from("projetos_tarefas").delete().eq("id", id)

  if (error) {
    return { success: false, message: `Erro ao excluir tarefa: ${error.message}` }
  }
  return { success: true, message: `Tarefa ${id} excluída com sucesso.`, data: { id } }
}

// ---------------------------------------------------------------------------
// Schemas para OpenAI (tools) e Gemini (functionDeclarations)
// ---------------------------------------------------------------------------

export const OPENAI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "criar_tarefa",
      description: "Cria uma nova tarefa no projeto atual. O usuário pode descrever em linguagem natural: o que é a tarefa (título/descrição), quanto tempo vai levar (ex.: '2 horas', '4h') e datas de início/fim (ex.: '2025-03-20'). Extraia titulo (obrigatório), opcionalmente descricao, horas_estimadas (em número) e prazos (formato YYYY-MM-DD). Só chame quando tiver título claro; se faltar informação, pergunte ao usuário antes.",
      parameters: {
        type: "object",
        properties: {
          titulo: { type: "string", description: "Título da tarefa (obrigatório). Use o que o usuário descreveu como a tarefa." },
          descricao: { type: "string", description: "Descrição opcional, se o usuário deu mais detalhes." },
          status: { type: "string", enum: TAREFA_STATUS, description: "Status: refinar, fazer, em_progresso, sob_revisao, concluido" },
          tipo: { type: "string", enum: TAREFA_TIPO, description: "Tipo: funcionalidade, bug, melhoria, documentacao, design" },
          prioridade: { type: "string", enum: TAREFA_PRIORIDADE, description: "Prioridade: baixa, media, alta, urgente" },
          tags: { type: "array", items: { type: "string" }, description: "Lista de tags" },
          responsavel_texto: { type: "string", description: "Nome do responsável (texto livre)" },
          horas_estimadas: { type: "number", description: "Horas estimadas (ex.: usuário disse '2h' → 2, 'vou levar 4 horas' → 4)." },
          sprint: { type: "string", description: "Sprint" },
          release: { type: "string", description: "Release" },
          prazo_inicio: { type: "string", description: "Data de início do prazo (formato: YYYY-MM-DD, ex.: '2025-03-20'). Extraia do contexto quando o usuário mencionar datas." },
          prazo_fim: { type: "string", description: "Data de fim do prazo (formato: YYYY-MM-DD, ex.: '2025-03-25'). Extraia do contexto quando o usuário mencionar prazos ou datas de entrega." },
        },
        required: ["titulo"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "editar_tarefa",
      description: "Edita uma tarefa existente. Use quando o usuário pedir para alterar, atualizar ou modificar uma tarefa. O tarefa_id deve ser o ID numérico da tarefa (está nos dados do projeto).",
      parameters: {
        type: "object",
        properties: {
          tarefa_id: { type: "number", description: "ID da tarefa a editar (obrigatório)" },
          titulo: { type: "string", description: "Novo título" },
          descricao: { type: "string", description: "Nova descrição" },
          status: { type: "string", enum: TAREFA_STATUS },
          tipo: { type: "string", enum: TAREFA_TIPO },
          prioridade: { type: "string", enum: TAREFA_PRIORIDADE },
          tags: { type: "array", items: { type: "string" } },
          responsavel_texto: { type: "string" },
          horas_estimadas: { type: "number" },
          sprint: { type: "string" },
          release: { type: "string" },
          prazo_inicio: { type: "string", description: "Data de início (formato: YYYY-MM-DD)" },
          prazo_fim: { type: "string", description: "Data de fim (formato: YYYY-MM-DD)" },
        },
        required: ["tarefa_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "excluir_tarefa",
      description: "Exclui uma tarefa. Use quando o usuário pedir para remover, excluir ou apagar uma tarefa. O tarefa_id deve ser o ID numérico da tarefa.",
      parameters: {
        type: "object",
        properties: {
          tarefa_id: { type: "number", description: "ID da tarefa a excluir (obrigatório)" },
        },
        required: ["tarefa_id"],
      },
    },
  },
]

export const GEMINI_TOOL_DECLARATIONS = [
  {
    name: "criar_tarefa",
    description: "Cria uma nova tarefa no projeto atual. O usuário pode descrever em linguagem natural: o que é a tarefa (título/descrição), quanto tempo vai levar (ex.: '2 horas', '4h') e datas de início/fim (ex.: '2025-03-20'). Extraia titulo (obrigatório), opcionalmente descricao, horas_estimadas (em número) e prazos (formato YYYY-MM-DD). Só chame quando tiver título claro; se faltar informação, pergunte ao usuário antes.",
    parameters: {
      type: "object",
      properties: {
        titulo: { type: "string", description: "Título da tarefa (obrigatório). Use o que o usuário descreveu como a tarefa." },
        descricao: { type: "string", description: "Descrição opcional." },
        status: { type: "string", enum: TAREFA_STATUS },
        tipo: { type: "string", enum: TAREFA_TIPO },
        prioridade: { type: "string", enum: TAREFA_PRIORIDADE },
        tags: { type: "array", items: { type: "string" } },
        responsavel_texto: { type: "string" },
        horas_estimadas: { type: "number", description: "Horas estimadas (ex.: '2h' → 2, '4 horas' → 4)." },
        sprint: { type: "string" },
        release: { type: "string" },
        prazo_inicio: { type: "string", description: "Data de início do prazo (formato: YYYY-MM-DD, ex.: '2025-03-20')." },
        prazo_fim: { type: "string", description: "Data de fim do prazo (formato: YYYY-MM-DD, ex.: '2025-03-25')." },
      },
      required: ["titulo"],
    },
  },
  {
    name: "editar_tarefa",
    description: "Edita uma tarefa existente. Use quando o usuário pedir para alterar, atualizar ou modificar uma tarefa. O tarefa_id deve ser o ID numérico da tarefa (está nos dados do projeto).",
    parameters: {
      type: "object",
      properties: {
        tarefa_id: { type: "number", description: "ID da tarefa a editar (obrigatório)" },
        titulo: { type: "string" },
        descricao: { type: "string" },
        status: { type: "string", enum: TAREFA_STATUS },
        tipo: { type: "string", enum: TAREFA_TIPO },
        prioridade: { type: "string", enum: TAREFA_PRIORIDADE },
        tags: { type: "array", items: { type: "string" } },
        responsavel_texto: { type: "string" },
        horas_estimadas: { type: "number" },
        sprint: { type: "string" },
        release: { type: "string" },
        prazo_inicio: { type: "string", description: "Data de início (formato: YYYY-MM-DD)" },
        prazo_fim: { type: "string", description: "Data de fim (formato: YYYY-MM-DD)" },
      },
      required: ["tarefa_id"],
    },
  },
  {
    name: "excluir_tarefa",
    description: "Exclui uma tarefa. Use quando o usuário pedir para remover, excluir ou apagar uma tarefa. O tarefa_id deve ser o ID numérico da tarefa.",
    parameters: {
      type: "object",
      properties: {
        tarefa_id: { type: "number", description: "ID da tarefa a excluir (obrigatório)" },
      },
      required: ["tarefa_id"],
    },
  },
]
