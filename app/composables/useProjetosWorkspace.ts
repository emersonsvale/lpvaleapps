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
    orcamento_total: number
    orcamento_consumido: number
    prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
    responsavel_texto: string | null
    cliente_id?: number | null
    contrato_id?: number | null
    proposta_id?: number | null
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
    responsavel_texto: string | null
    ordem_coluna: number
    ordem_global: number
    concluida_em: string | null
    created_at?: string
    updated_at?: string
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
    return data as ProjetoAdminWorkspace[]
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
    return data as ProjetoAdminWorkspace | null
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
    return data as ProjetoTarefa[]
}

export async function createTarefa(
    input: Partial<Omit<ProjetoTarefa, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ data: ProjetoTarefa | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }
    const { data, error } = await supabase.from('projetos_tarefas').insert(input).select().single()
    if (error) return { data: null, error: error.message }
    return { data: data as ProjetoTarefa, error: null }
}

export async function updateTarefa(
    id: number,
    input: Partial<Omit<ProjetoTarefa, 'id' | 'created_at' | 'updated_at' | 'projeto_id'>>
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }
    const { error } = await supabase.from('projetos_tarefas').update(input).eq('id', id)
    return { error: error?.message ?? null }
}

export async function updateTarefaStatus(id: number, novoStatus: ProjetoTarefa['status']): Promise<{ error: string | null }> {
    return updateTarefa(id, { status: novoStatus })
}
