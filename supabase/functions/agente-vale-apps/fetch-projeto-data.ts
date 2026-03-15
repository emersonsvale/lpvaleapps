import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

type SB = SupabaseClient

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—"
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

function fmtMoney(v: number): string {
  return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0%"
  return `${Math.round((part / total) * 100)}%`
}

function truncate(text: string | null | undefined, max = 300): string {
  if (!text) return ""
  const clean = text.replace(/\s+/g, " ").trim()
  return clean.length > max ? clean.slice(0, max) + "…" : clean
}

// ---------------------------------------------------------------------------
// 1. Dados gerais do projeto (projetos_admin)
// ---------------------------------------------------------------------------

async function fetchProjeto(sb: SB, id: number): Promise<string[]> {
  const { data, error } = await sb
    .from("projetos_admin")
    .select("nome, status, cliente_nome, fase, progresso_percentual, data_inicio, data_fim_prevista, data_fim_real, horas_previstas, horas_executadas, valor_hora_vendida, orcamento_total, orcamento_consumido, prioridade, responsavel_texto, descricao_comercial, tech_stack, tags")
    .eq("id", id)
    .single()

  if (error || !data) return ["(projeto não encontrado)"]
  const p = data as Record<string, unknown>

  const hPrev = Number(p.horas_previstas) || 0
  const hExec = Number(p.horas_executadas) || 0
  const oTotal = Number(p.orcamento_total) || 0
  const oConsumido = Number(p.orcamento_consumido) || 0
  const valorHora = Number(p.valor_hora_vendida) || 0
  const custoHorasExecutadas = valorHora > 0 && hExec > 0 ? valorHora * hExec : 0

  const lines: string[] = [
    "## PROJETO",
    `Nome: ${p.nome ?? "—"}`,
    `Status: ${p.status ?? "—"}`,
    `Cliente: ${p.cliente_nome ?? "—"}`,
    `Fase: ${p.fase ?? "—"}`,
    `Progresso: ${p.progresso_percentual ?? 0}%`,
    `Prioridade: ${p.prioridade ?? "—"}`,
    `Responsável: ${p.responsavel_texto ?? "—"}`,
    `Data início: ${fmtDate(p.data_inicio as string)}`,
    `Data fim prevista: ${fmtDate(p.data_fim_prevista as string)}`,
    `Data fim real: ${fmtDate(p.data_fim_real as string)}`,
    `Horas previstas: ${hPrev} | Executadas: ${hExec} | Consumo: ${pct(hExec, hPrev)}`,
    `Valor hora vendida: ${valorHora > 0 ? fmtMoney(valorHora) : "—"}`,
    `Orçamento total: ${fmtMoney(oTotal)} | Consumido (lançado): ${fmtMoney(oConsumido)} | ${pct(oConsumido, oTotal)}`,
  ]
  if (custoHorasExecutadas > 0) {
    lines.push(`Custo das horas executadas (valor hora × horas): ${fmtMoney(custoHorasExecutadas)} — use este valor ao responder "quanto foi consumido" ou "custo até agora" quando o orçamento consumido lançado for zero.`)
  }

  if (p.descricao_comercial) lines.push(`Descrição comercial: ${truncate(p.descricao_comercial as string, 500)}`)
  const stack = p.tech_stack as string[] | null
  if (stack && stack.length) lines.push(`Tech stack: ${stack.join(", ")}`)
  const tags = p.tags as unknown
  if (Array.isArray(tags) && tags.length) lines.push(`Tags: ${tags.join(", ")}`)

  return lines
}

// ---------------------------------------------------------------------------
// 2. Tarefas completas (projetos_tarefas) — cada uma com responsável
// ---------------------------------------------------------------------------

async function fetchTarefas(sb: SB, id: number): Promise<string[]> {
  const { data } = await sb
    .from("projetos_tarefas")
    .select("codigo, titulo, status, tipo, prioridade, responsavel_texto, horas_estimadas, horas_executadas, progresso, sprint, release, tags, prazo_inicio, prazo_fim, concluida_em, descricao")
    .eq("projeto_id", id)
    .order("ordem_global", { ascending: true })
    .limit(200)

  if (!data || !data.length) return ["## TAREFAS", "Nenhuma tarefa registrada."]

  const porStatus: Record<string, number> = {}
  const porResponsavel: Record<string, number> = {}
  let totalHorasEst = 0
  let totalHorasExec = 0

  const lines: string[] = [`## TAREFAS (${data.length} total)`]

  for (const t of data as Record<string, unknown>[]) {
    const s = (t.status as string) ?? "outro"
    porStatus[s] = (porStatus[s] ?? 0) + 1
    const resp = (t.responsavel_texto as string) ?? "sem responsável"
    porResponsavel[resp] = (porResponsavel[resp] ?? 0) + 1
    totalHorasEst += Number(t.horas_estimadas) || 0
    totalHorasExec += Number(t.horas_executadas) || 0
  }

  lines.push(`Resumo por status: ${Object.entries(porStatus).map(([s, n]) => `${s}: ${n}`).join(", ")}`)
  lines.push(`Resumo por responsável: ${Object.entries(porResponsavel).map(([r, n]) => `${r}: ${n}`).join(", ")}`)
  lines.push(`Total horas estimadas: ${totalHorasEst} | Executadas: ${totalHorasExec}`)
  lines.push("")

  for (const t of data as Record<string, unknown>[]) {
    const cod = t.codigo ? `[${t.codigo}] ` : ""
    const resp = t.responsavel_texto ? ` | Responsável: ${t.responsavel_texto}` : ""
    const horas = `${Number(t.horas_executadas) || 0}/${Number(t.horas_estimadas) || 0}h`
    const prog = `${t.progresso ?? 0}%`
    const tags = Array.isArray(t.tags) && t.tags.length ? ` | Tags: ${(t.tags as string[]).join(", ")}` : ""
    const sprint = t.sprint ? ` | Sprint: ${t.sprint}` : ""
    const rel = t.release ? ` | Release: ${t.release}` : ""
    const prazo = t.prazo_fim ? ` | Prazo: ${fmtDate(t.prazo_fim as string)}` : ""
    const concluida = t.concluida_em ? ` | Concluída: ${fmtDate((t.concluida_em as string).slice(0, 10))}` : ""
    const desc = t.descricao ? ` — ${truncate(t.descricao as string, 120)}` : ""

    lines.push(`- ${cod}${t.titulo} | Status: ${t.status} | Tipo: ${t.tipo ?? "—"} | Prioridade: ${t.prioridade ?? "—"} | ${horas} (${prog})${resp}${sprint}${rel}${prazo}${concluida}${tags}${desc}`)
  }

  return lines
}

// ---------------------------------------------------------------------------
// 3. Lançamentos de horas (projetos_lancamentos_horas)
// ---------------------------------------------------------------------------

async function fetchLancamentos(sb: SB, id: number): Promise<string[]> {
  const { data } = await sb
    .from("projetos_lancamentos_horas")
    .select("data, horas, tipo, descricao, autor_texto, tarefa_id")
    .eq("projeto_id", id)
    .order("data", { ascending: false })
    .limit(100)

  if (!data || !data.length) return ["## LANÇAMENTOS DE HORAS", "Nenhum lançamento registrado."]

  let totalHoras = 0
  const porAutor: Record<string, number> = {}

  for (const l of data as Record<string, unknown>[]) {
    const h = Number(l.horas) || 0
    totalHoras += h
    const autor = (l.autor_texto as string) ?? "desconhecido"
    porAutor[autor] = (porAutor[autor] ?? 0) + h
  }

  const lines: string[] = [
    `## LANÇAMENTOS DE HORAS (${data.length} registros)`,
    `Total lançado: ${totalHoras.toFixed(2)}h`,
    `Por pessoa: ${Object.entries(porAutor).map(([a, h]) => `${a}: ${h.toFixed(2)}h`).join(", ")}`,
    "",
  ]

  const recentes = (data as Record<string, unknown>[]).slice(0, 30)
  for (const l of recentes) {
    const desc = l.descricao ? ` — ${truncate(l.descricao as string, 80)}` : ""
    lines.push(`- ${fmtDate(l.data as string)} | ${Number(l.horas).toFixed(2)}h | ${l.tipo ?? "execucao"} | ${l.autor_texto ?? "—"}${desc}`)
  }
  if (data.length > 30) lines.push(`... e mais ${data.length - 30} lançamentos anteriores.`)

  return lines
}

// ---------------------------------------------------------------------------
// 4a. Conhecimento do projeto via RAG (projetos_conhecimento_chunks)
// ---------------------------------------------------------------------------

// Limite por trecho no RAG: valor alto para transcrições/documentos longos (ex.: "Alinhamento Valuar")
const RAG_CHUNK_CHARS = 2500

async function fetchConhecimentoViaRag(sb: SB, projetoId: number, queryEmbedding: number[]): Promise<string[]> {
  const { data, error } = await sb.rpc("match_projeto_conhecimento", {
    query_embedding: queryEmbedding,
    p_projeto_id: projetoId,
    match_threshold: 0.35,
    match_count: 25,
  })

  if (error || !data?.length) {
    return ["## CONHECIMENTO / DOCUMENTAÇÃO (RAG)", "Nenhum trecho relevante encontrado para esta pergunta."]
  }

  const lines: string[] = [`## CONHECIMENTO / DOCUMENTAÇÃO (${data.length} trechos relevantes da base do projeto)`]
  for (const row of data as Array<{ origem_tipo?: string; origem_id?: number; conteudo_texto?: string }>) {
    const origem = row.origem_tipo ? ` [${row.origem_tipo} #${row.origem_id ?? "?"}]` : ""
    const texto = truncate(row.conteudo_texto ?? "", RAG_CHUNK_CHARS)
    if (texto) lines.push(`-${origem}\n${texto}\n`)
  }
  return lines
}

// ---------------------------------------------------------------------------
// 4b. Documentação (projetos_docs) — fallback quando RAG não é usado
// ---------------------------------------------------------------------------

async function fetchDocs(sb: SB, id: number): Promise<string[]> {
  const { data } = await sb
    .from("projetos_docs")
    .select("id, parent_id, titulo, conteudo_markdown, ordem")
    .eq("projeto_id", id)
    .order("ordem", { ascending: true })
    .limit(50)

  if (!data || !data.length) return ["## DOCUMENTAÇÃO", "Nenhum documento registrado."]

  const lines: string[] = [`## DOCUMENTAÇÃO (${data.length} documentos)`]
  for (const d of data as Record<string, unknown>[]) {
    const parent = d.parent_id ? ` (sub-doc de #${d.parent_id})` : ""
    const conteudo = truncate(d.conteudo_markdown as string, 400)
    lines.push(`### ${d.titulo}${parent}`)
    if (conteudo) lines.push(conteudo)
    lines.push("")
  }
  return lines
}

// ---------------------------------------------------------------------------
// 5. Requisitos (projetos_requisitos)
// ---------------------------------------------------------------------------

async function fetchRequisitos(sb: SB, id: number): Promise<string[]> {
  const { data } = await sb
    .from("projetos_requisitos")
    .select("codigo, titulo, descricao, status, prioridade, origem, criterios_aceite")
    .eq("projeto_id", id)
    .order("ordem", { ascending: true })
    .limit(100)

  if (!data || !data.length) return ["## REQUISITOS", "Nenhum requisito registrado."]

  const lines: string[] = [`## REQUISITOS (${data.length} total)`]

  for (const r of data as Record<string, unknown>[]) {
    const cod = r.codigo ? `[${r.codigo}] ` : ""
    const desc = r.descricao ? ` — ${truncate(r.descricao as string, 150)}` : ""
    const aceite = r.criterios_aceite ? ` | Critérios: ${truncate(r.criterios_aceite as string, 100)}` : ""
    lines.push(`- ${cod}${r.titulo} | Status: ${r.status ?? "—"} | Prioridade: ${r.prioridade ?? "—"}${desc}${aceite}`)
  }

  return lines
}

// ---------------------------------------------------------------------------
// 6. Releases (projetos_releases)
// ---------------------------------------------------------------------------

async function fetchReleases(sb: SB, id: number): Promise<string[]> {
  const { data } = await sb
    .from("projetos_releases")
    .select("nome, versao, status, data_prevista, data_publicacao, notas")
    .eq("projeto_id", id)
    .order("ordem", { ascending: true })
    .limit(30)

  if (!data || !data.length) return ["## RELEASES", "Nenhuma release registrada."]

  const lines: string[] = [`## RELEASES (${data.length} total)`]

  for (const r of data as Record<string, unknown>[]) {
    const ver = r.versao ? ` v${r.versao}` : ""
    const prev = r.data_prevista ? ` | Prevista: ${fmtDate(r.data_prevista as string)}` : ""
    const pub = r.data_publicacao ? ` | Publicada: ${fmtDate(r.data_publicacao as string)}` : ""
    const notas = r.notas ? ` — ${truncate(r.notas as string, 120)}` : ""
    lines.push(`- ${r.nome}${ver} | Status: ${r.status ?? "—"}${prev}${pub}${notas}`)
  }

  return lines
}

// ---------------------------------------------------------------------------
// Orquestrador: busca tudo em paralelo; documentação via RAG se queryEmbedding fornecido
// ---------------------------------------------------------------------------

export async function fetchDadosCompletosProjeto(
  supabaseUrl: string,
  supabaseAnonKey: string,
  authHeader: string,
  projetoId: number,
  queryEmbedding?: number[] | null,
): Promise<string> {
  const sb = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const docsPromise =
    queryEmbedding && queryEmbedding.length > 0
      ? fetchConhecimentoViaRag(sb, projetoId, queryEmbedding)
      : fetchDocs(sb, projetoId)

  const [projeto, tarefas, lancamentos, docs, requisitos, releases] = await Promise.all([
    fetchProjeto(sb, projetoId),
    fetchTarefas(sb, projetoId),
    fetchLancamentos(sb, projetoId),
    docsPromise,
    fetchRequisitos(sb, projetoId),
    fetchReleases(sb, projetoId),
  ])

  return [
    ...projeto,
    "",
    ...tarefas,
    "",
    ...lancamentos,
    "",
    ...docs,
    "",
    ...requisitos,
    "",
    ...releases,
  ].join("\n")
}
