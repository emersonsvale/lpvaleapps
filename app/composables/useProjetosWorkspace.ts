import { useSupabase } from '~/composables/useSupabase'

export interface ProjetoAdminWorkspace {
    id: number
    nome: string
    slug: string
    status: 'iniciando' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado'
    cliente_nome: string | null
    fase: string | null
    progresso_percentual: number
    data_inicio: string | null
    data_fim_prevista: string | null
    data_fim_real: string | null
    horas_previstas: number
    horas_executadas: number
    valor_hora_vendida: number
    orcamento_total: number
    orcamento_consumido: number
    prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
    responsavel_texto: string | null
    cliente_id?: number | null
    contrato_id?: number | null
    proposta_id?: number | null
    descricao_comercial?: string | null
    tech_stack?: string[] | null
    status_visualizacao?: 'interno' | 'cliente' | 'portfolio' | null
    tags: any
    created_at?: string
    updated_at?: string
}

export interface ProjetoTarefa {
    id: number
    projeto_id: number
    codigo: string | null
    titulo: string
    descricao: string | null
    tags: string[] | null
    status: 'refinar' | 'fazer' | 'em_progresso' | 'sob_revisao' | 'concluido'
    tipo: 'funcionalidade' | 'bug' | 'melhoria' | 'documentacao' | 'design'
    prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
    prazo_inicio: string | null
    prazo_fim: string | null
    horas_estimadas: number
    horas_executadas: number
    progresso: number
    sprint: string | null
    release: string | null
    arvore: string | null
    pacote: string | null
    responsavel_equipe_id?: number | null
    responsavel_texto: string | null
    pai_id?: number | null
    ordem_coluna: number
    ordem_global: number
    concluida_em: string | null
    created_at?: string
    updated_at?: string
}

export interface ProjetoLancamentoHora {
    id: number
    projeto_id: number
    tarefa_id: number | null
    equipe_id?: number | null
    autor_uid?: string | null
    data: string
    descricao: string | null
    horas: number
    tipo: 'execucao' | 'ajuste'
    autor_texto: string | null
    iniciado_em?: string | null
    finalizado_em?: string | null
    duracao_segundos?: number | null
    created_at?: string
}

export interface ProjetoCompraHora {
    id: number
    projeto_id: number
    data_compra: string
    descricao: string | null
    horas: number
    valor_hora: number
    valor_total: number
    observacoes?: string | null
    created_at?: string
    updated_at?: string
}

export interface EquipeMembro {
    id: number
    nome: string | null
    cargo: string | null
    foto?: string | null
    uid?: string | null
}

export function normalizeProjetoTarefaTags(value: unknown): string[] {
    if (!Array.isArray(value)) return []

    const normalized: string[] = []
    const seen = new Set<string>()

    for (const item of value) {
        const tag = String(item ?? '')
            .replace(/\s{2,}/g, ' ')
            .trim()
            .slice(0, 40)

        if (!tag) continue

        const key = tag.toLocaleLowerCase('pt-BR')
        if (seen.has(key)) continue

        seen.add(key)
        normalized.push(tag)
    }

    return normalized
}

export function isProjetoTarefaPrincipal(tarefa: Pick<ProjetoTarefa, 'pai_id'>): boolean {
    return tarefa.pai_id === null || tarefa.pai_id === undefined
}

export function filterProjetoTarefasPrincipais<T extends Pick<ProjetoTarefa, 'pai_id'>>(tarefas: T[] | null | undefined): T[] {
    return (tarefas || []).filter(isProjetoTarefaPrincipal)
}

function normalizeProjetoTarefa(item: ProjetoTarefa): ProjetoTarefa {
    return {
        ...item,
        tags: normalizeProjetoTarefaTags(item.tags)
    }
}

function roundHoras(value: number | null | undefined): number {
    return Number((Number(value || 0)).toFixed(4))
}

function roundCurrency(value: number | null | undefined): number {
    return Number((Number(value || 0)).toFixed(2))
}

function calculateTaskProgress(horasEstimadas: number | null | undefined, horasExecutadas: number | null | undefined): number {
    const estimado = Math.max(0, Number(horasEstimadas || 0))
    const realizado = Math.max(0, Number(horasExecutadas || 0))

    if (estimado <= 0) {
        return realizado > 0 ? 100 : 0
    }

    return Math.max(0, Math.min(100, Math.round((realizado / estimado) * 100)))
}

function applyDerivedHorasToTarefa(item: ProjetoTarefa, horasExecutadas: number): ProjetoTarefa {
    const horas = roundHoras(horasExecutadas)
    return normalizeProjetoTarefa({
        ...item,
        horas_executadas: horas,
        progresso: calculateTaskProgress(item.horas_estimadas, horas)
    })
}

function applyDerivedHorasToProjeto(item: ProjetoAdminWorkspace, horasExecutadas: number): ProjetoAdminWorkspace {
    return {
        ...item,
        horas_executadas: roundHoras(horasExecutadas)
    }
}

interface ProjetoComprasResumo {
    totalHorasCompradas: number
    totalValorComprado: number
    valorHoraMedia: number
}

function buildComprasResumoVazio(): ProjetoComprasResumo {
    return {
        totalHorasCompradas: 0,
        totalValorComprado: 0,
        valorHoraMedia: 0
    }
}

function applyDerivedResumoComprasToProjeto(item: ProjetoAdminWorkspace, resumo?: ProjetoComprasResumo | null): ProjetoAdminWorkspace {
    const source = resumo || buildComprasResumoVazio()

    return {
        ...item,
        horas_previstas: source.totalHorasCompradas,
        orcamento_total: source.totalValorComprado,
        valor_hora_vendida: source.valorHoraMedia
    }
}

function sumHorasByKey<T extends number | null>(rows: Array<{ key: T; horas: number | string | null | undefined }>): Map<number, number> {
    const totals = new Map<number, number>()

    for (const row of rows) {
        if (row.key === null || row.key === undefined) continue
        const key = Number(row.key)
        if (!Number.isFinite(key)) continue
        totals.set(key, roundHoras((totals.get(key) || 0) + Number(row.horas || 0)))
    }

    return totals
}

async function fetchHorasLancadasPorProjetoIds(supabase: NonNullable<ReturnType<typeof useSupabase>>, projetoIds: number[]) {
    if (!projetoIds.length) return new Map<number, number>()

    const { data, error } = await supabase
        .from('projetos_lancamentos_horas')
        .select('projeto_id, horas')
        .in('projeto_id', projetoIds)

    if (error) {
        console.warn('[fetchHorasLancadasPorProjetoIds] Erro:', error.message)
        return new Map<number, number>()
    }

    return sumHorasByKey(((data as Array<{ projeto_id: number | null; horas: number | string | null }> | null) || []).map((item) => ({
        key: item.projeto_id,
        horas: item.horas
    })))
}

async function fetchHorasLancadasPorTarefaIds(supabase: NonNullable<ReturnType<typeof useSupabase>>, tarefaIds: number[], projetoId?: number) {
    if (!tarefaIds.length) return new Map<number, number>()

    let query = supabase
        .from('projetos_lancamentos_horas')
        .select('tarefa_id, horas')
        .in('tarefa_id', tarefaIds)

    if (typeof projetoId === 'number') {
        query = query.eq('projeto_id', projetoId)
    }

    const { data, error } = await query

    if (error) {
        console.warn('[fetchHorasLancadasPorTarefaIds] Erro:', error.message)
        return new Map<number, number>()
    }

    return sumHorasByKey(((data as Array<{ tarefa_id: number | null; horas: number | string | null }> | null) || []).map((item) => ({
        key: item.tarefa_id,
        horas: item.horas
    })))
}

async function fetchComprasResumoByProjetoIds(
    supabase: NonNullable<ReturnType<typeof useSupabase>>,
    projetos: ProjetoAdminWorkspace[]
) {
    if (!projetos.length) return new Map<number, ProjetoComprasResumo>()

    const projetoIds = projetos.map((item) => item.id)
    const fallbackMap = new Map<number, ProjetoComprasResumo>(
        projetos.map((item) => [item.id, buildComprasResumoVazio()])
    )

    const { data, error } = await supabase
        .from('projetos_compras_horas')
        .select('projeto_id, horas, valor_hora, valor_total')
        .in('projeto_id', projetoIds)

    if (error) {
        console.warn('[fetchComprasResumoByProjetoIds] Erro:', error.message)
        return fallbackMap
    }

    const resumoMap = new Map<number, ProjetoComprasResumo>()

    for (const item of ((data as Array<{ projeto_id: number | null; horas: number | string | null; valor_hora: number | string | null; valor_total: number | string | null }> | null) || [])) {
        if (item.projeto_id == null) continue
        const projetoId = Number(item.projeto_id)
        const horas = roundHoras(item.horas)
        const valorTotal = roundCurrency(item.valor_total ?? (Number(item.horas || 0) * Number(item.valor_hora || 0)))

        const atual = resumoMap.get(projetoId) || {
            totalHorasCompradas: 0,
            totalValorComprado: 0,
            valorHoraMedia: 0
        }

        atual.totalHorasCompradas = roundHoras(atual.totalHorasCompradas + horas)
        atual.totalValorComprado = roundCurrency(atual.totalValorComprado + valorTotal)
        atual.valorHoraMedia = atual.totalHorasCompradas > 0
            ? roundCurrency(atual.totalValorComprado / atual.totalHorasCompradas)
            : 0
        resumoMap.set(projetoId, atual)
    }

    for (const projeto of projetos) {
        if (!resumoMap.has(projeto.id)) {
            resumoMap.set(projeto.id, fallbackMap.get(projeto.id) || buildComprasResumoVazio())
        }
    }

    return resumoMap
}

function normalizeProjetoTarefaPayload<T extends Record<string, any>>(input: T): T {
    if (!Object.prototype.hasOwnProperty.call(input, 'tags')) {
        return input
    }

    return {
        ...input,
        tags: normalizeProjetoTarefaTags(input.tags)
    }
}

// ==========================================
// API DE PROJETOS
// ==========================================

export async function fetchProjetosWorkspace(): Promise<ProjetoAdminWorkspace[]> {
    const supabase = useSupabase()
    if (!supabase) return []
    const { data, error } = await supabase
        .from('projetos_admin')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('[fetchProjetosWorkspace] Erro:', error.message)
        return []
    }

    const projetos = (data as ProjetoAdminWorkspace[] | null) || []
    const horasPorProjeto = await fetchHorasLancadasPorProjetoIds(supabase, projetos.map((item) => item.id))
    const comprasResumoPorProjeto = await fetchComprasResumoByProjetoIds(supabase, projetos)

    return projetos.map((item) => {
        const projetoComResumo = applyDerivedResumoComprasToProjeto(item, comprasResumoPorProjeto.get(item.id))
        return applyDerivedHorasToProjeto(projetoComResumo, horasPorProjeto.get(item.id) || 0)
    })
}

export async function fetchProjetoWorkspaceById(id: number): Promise<ProjetoAdminWorkspace | null> {
    const supabase = useSupabase()
    if (!supabase) return null
    const { data, error } = await supabase
        .from('projetos_admin')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        console.warn('[fetchProjetoWorkspaceById] Erro:', error.message)
        return null
    }

    const projeto = data as ProjetoAdminWorkspace | null
    if (!projeto) return null

    const horasPorProjeto = await fetchHorasLancadasPorProjetoIds(supabase, [id])
    const comprasResumoPorProjeto = await fetchComprasResumoByProjetoIds(supabase, [projeto])
    const projetoComResumo = applyDerivedResumoComprasToProjeto(projeto, comprasResumoPorProjeto.get(id))
    return applyDerivedHorasToProjeto(projetoComResumo, horasPorProjeto.get(id) || 0)
}

export async function createProjetoWorkspace(
    input: Partial<Omit<ProjetoAdminWorkspace, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ data: ProjetoAdminWorkspace | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }
    const { data, error } = await supabase.from('projetos_admin').insert(input).select().single()
    if (error) return { data: null, error: error.message }
    return { data: data as ProjetoAdminWorkspace, error: null }
}

export async function updateProjetoWorkspace(
    id: number,
    input: Partial<Omit<ProjetoAdminWorkspace, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }
    const { error } = await supabase.from('projetos_admin').update(input).eq('id', id)
    return { error: error?.message ?? null }
}


// ==========================================
// API DE TAREFAS
// ==========================================

export async function fetchTarefasByProjetoId(projetoId: number): Promise<ProjetoTarefa[]> {
    const supabase = useSupabase()
    if (!supabase) return []
    const { data, error } = await supabase
        .from('projetos_tarefas')
        .select('*')
        .eq('projeto_id', projetoId)
        .order('ordem_coluna', { ascending: true })

    if (error) {
        console.warn('[fetchTarefasByProjetoId] Erro:', error.message)
        return []
    }

    const tarefas = (data as ProjetoTarefa[] | null) || []
    const horasPorTarefa = await fetchHorasLancadasPorTarefaIds(supabase, tarefas.map((item) => item.id), projetoId)
    return tarefas.map((item) => applyDerivedHorasToTarefa(item, horasPorTarefa.get(item.id) || 0))
}

export async function fetchTarefasWorkspace(): Promise<ProjetoTarefa[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('projetos_tarefas')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        console.warn('[fetchTarefasWorkspace] Erro:', error.message)
        return []
    }

    const tarefas = (data as ProjetoTarefa[] | null) || []
    const horasPorTarefa = await fetchHorasLancadasPorTarefaIds(supabase, tarefas.map((item) => item.id))
    return tarefas.map((item) => applyDerivedHorasToTarefa(item, horasPorTarefa.get(item.id) || 0))
}

export async function fetchLancamentosHorasByProjetoId(projetoId: number): Promise<ProjetoLancamentoHora[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('projetos_lancamentos_horas')
        .select('*')
        .eq('projeto_id', projetoId)
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('[fetchLancamentosHorasByProjetoId] Erro:', error.message)
        return []
    }

    return (data as ProjetoLancamentoHora[] | null) || []
}

export async function fetchComprasHorasByProjetoId(projetoId: number): Promise<ProjetoCompraHora[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('projetos_compras_horas')
        .select('*')
        .eq('projeto_id', projetoId)
        .order('data_compra', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('[fetchComprasHorasByProjetoId] Erro:', error.message)
        return []
    }

    return ((data as ProjetoCompraHora[] | null) || []).map((item) => ({
        ...item,
        horas: roundHoras(item.horas),
        valor_hora: roundCurrency(item.valor_hora),
        valor_total: roundCurrency(item.valor_total)
    }))
}

/**
 * Lançamentos de horas do usuário em uma data, em todos os projetos.
 * Filtra por equipe_id e/ou autor_uid.
 */
export async function fetchLancamentosHorasDoDiaByUsuario(
    data: string,
    equipeId: number | null,
    autorUid: string | null
): Promise<ProjetoLancamentoHora[]> {
    const supabase = useSupabase()
    if (!supabase) return []
    if (equipeId == null && !autorUid) return []

    const dataNorm = String(data || '').slice(0, 10)
    if (!dataNorm) return []

    let query = supabase
        .from('projetos_lancamentos_horas')
        .select('*')
        .eq('data', dataNorm)
        .order('created_at', { ascending: false })

    if (equipeId != null && autorUid) {
        query = query.or(`equipe_id.eq.${equipeId},autor_uid.eq.${autorUid}`)
    } else if (equipeId != null) {
        query = query.eq('equipe_id', equipeId)
    } else {
        query = query.eq('autor_uid', autorUid)
    }

    const { data: rows, error } = await query

    if (error) {
        console.warn('[fetchLancamentosHorasDoDiaByUsuario] Erro:', error.message)
        return []
    }

    return (rows as ProjetoLancamentoHora[] | null) || []
}

export async function createTarefa(
    input: Partial<Omit<ProjetoTarefa, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ data: ProjetoTarefa | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }
    const payload = normalizeProjetoTarefaPayload(input)
    const { data, error } = await supabase.from('projetos_tarefas').insert(payload).select().single()
    if (error) return { data: null, error: error.message }
    return { data: normalizeProjetoTarefa(data as ProjetoTarefa), error: null }
}

export async function updateTarefa(
    id: number,
    input: Partial<Omit<ProjetoTarefa, 'id' | 'created_at' | 'updated_at' | 'projeto_id'>>
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }
    const payload = normalizeProjetoTarefaPayload(input)
    const { error } = await supabase.from('projetos_tarefas').update(payload).eq('id', id)
    return { error: error?.message ?? null }
}

export async function updateTarefaStatus(id: number, novoStatus: ProjetoTarefa['status']): Promise<{ error: string | null }> {
    return updateTarefa(id, { status: novoStatus })
}

export async function createLancamentoHora(
    input: Partial<Omit<ProjetoLancamentoHora, 'id' | 'created_at'>>
): Promise<{ data: ProjetoLancamentoHora | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const { data, error } = await supabase
        .from('projetos_lancamentos_horas')
        .insert(input)
        .select()
        .single()

    if (error) return { data: null, error: error.message }
    return { data: data as ProjetoLancamentoHora, error: null }
}

export async function createProjetoCompraHora(
    input: Partial<Omit<ProjetoCompraHora, 'id' | 'created_at' | 'updated_at' | 'valor_total'>>
): Promise<{ data: ProjetoCompraHora | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = {
        ...input,
        horas: roundHoras(input.horas),
        valor_hora: roundCurrency(input.valor_hora)
    }

    const { data, error } = await supabase
        .from('projetos_compras_horas')
        .insert(payload)
        .select('*')
        .single()

    if (error) return { data: null, error: error.message }

    return {
        data: {
            ...(data as ProjetoCompraHora),
            horas: roundHoras((data as ProjetoCompraHora).horas),
            valor_hora: roundCurrency((data as ProjetoCompraHora).valor_hora),
            valor_total: roundCurrency((data as ProjetoCompraHora).valor_total)
        },
        error: null
    }
}

export async function deleteTarefa(id: number): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase.from('projetos_tarefas').delete().eq('id', id)
    return { error: error?.message ?? null }
}

export async function fetchEquipeMembros(): Promise<EquipeMembro[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('equipe')
        .select('id, nome, cargo, foto, uid')
        .not('nome', 'is', null)
        .order('nome', { ascending: true })

    if (error) {
        console.warn('[fetchEquipeMembros] Erro:', error.message)
        return []
    }

    return data as EquipeMembro[]
}
