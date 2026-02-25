export type ClienteStatus =
    | 'lead'
    | 'contato_inicial'
    | 'proposta_enviada'
    | 'negociacao'
    | 'fechado_ganho'
    | 'fechado_perdido'

export type ClientePrioridade = 'baixa' | 'media' | 'alta'

export type InteracaoTipo = 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'proposta' | 'nota'

export interface CRMInteracao {
    id: number
    cliente_id: number
    created_at: string
    updated_at: string
    tipo: InteracaoTipo
    resumo: string
    detalhes: string | null
    data_interacao: string
    proxima_acao: string | null
    valor_mencionado: number | null
}

export interface CRMCliente {
    id: number
    created_at: string
    updated_at: string
    nome: string
    empresa: string | null
    email: string | null
    telefone: string | null
    origem: string
    status: ClienteStatus
    prioridade: ClientePrioridade
    valor_potencial: number | null
    proximo_followup: string | null
    responsavel: string | null
    tags: string[] | null
    observacoes: string | null
    ultima_interacao_em: string | null
    proposta_id: number | null
    crm_interacoes?: CRMInteracao[]
}

export interface CRMClienteUpsertInput {
    nome?: string
    empresa?: string | null
    email?: string | null
    telefone?: string | null
    origem?: string | null
    status?: ClienteStatus | null
    prioridade?: ClientePrioridade | null
    valor_potencial?: number | null
    proximo_followup?: string | null
    responsavel?: string | null
    tags?: string[] | null
    observacoes?: string | null
    proposta_id?: number | null
}

export interface CRMInteracaoInput {
    cliente_id: number
    tipo?: InteracaoTipo | null
    resumo: string
    detalhes?: string | null
    data_interacao?: string | null
    proxima_acao?: string | null
    valor_mencionado?: number | null
}

const STATUS_DEFAULT: ClienteStatus = 'lead'
const PRIORIDADE_DEFAULT: ClientePrioridade = 'media'

const CRM_STATUS_COLUNAS: Array<{ status: ClienteStatus; titulo: string }> = [
    { status: 'lead', titulo: 'Lead' },
    { status: 'contato_inicial', titulo: 'Contato inicial' },
    { status: 'proposta_enviada', titulo: 'Proposta enviada' },
    { status: 'negociacao', titulo: 'Negociação' },
    { status: 'fechado_ganho', titulo: 'Fechado ganho' },
    { status: 'fechado_perdido', titulo: 'Fechado perdido' }
]

function toNumber(value: unknown): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100
}

function normalizarStatus(value?: string | null): ClienteStatus {
    switch (value) {
        case 'contato_inicial':
        case 'proposta_enviada':
        case 'negociacao':
        case 'fechado_ganho':
        case 'fechado_perdido':
            return value
        default:
            return STATUS_DEFAULT
    }
}

function normalizarPrioridade(value?: string | null): ClientePrioridade {
    switch (value) {
        case 'baixa':
        case 'alta':
            return value
        default:
            return PRIORIDADE_DEFAULT
    }
}

function normalizarInteracaoTipo(value?: string | null): InteracaoTipo {
    switch (value) {
        case 'ligacao':
        case 'whatsapp':
        case 'email':
        case 'reuniao':
        case 'proposta':
            return value
        default:
            return 'nota'
    }
}

function normalizarTags(value: unknown): string[] | null {
    if (!Array.isArray(value)) return null
    const tags = value
        .map(tag => String(tag ?? '').trim())
        .filter(Boolean)
    return tags.length ? tags : null
}

function normalizarCliente(item: CRMCliente): CRMCliente {
    return {
        ...item,
        status: normalizarStatus(item.status),
        prioridade: normalizarPrioridade(item.prioridade),
        valor_potencial: item.valor_potencial == null ? null : roundMoney(toNumber(item.valor_potencial)),
        tags: normalizarTags(item.tags),
        crm_interacoes: item.crm_interacoes?.map((interacao) => ({
            ...interacao,
            tipo: normalizarInteracaoTipo(interacao.tipo),
            valor_mencionado: interacao.valor_mencionado == null ? null : roundMoney(toNumber(interacao.valor_mencionado))
        }))
    }
}

function buildClientePayload(input: CRMClienteUpsertInput) {
    return {
        nome: String(input.nome ?? '').trim(),
        empresa: input.empresa?.trim() || null,
        email: input.email?.trim().toLowerCase() || null,
        telefone: input.telefone?.trim() || null,
        origem: input.origem?.trim() || 'site',
        status: normalizarStatus(input.status),
        prioridade: normalizarPrioridade(input.prioridade),
        valor_potencial: input.valor_potencial == null ? null : roundMoney(Math.max(0, toNumber(input.valor_potencial))),
        proximo_followup: input.proximo_followup || null,
        responsavel: input.responsavel?.trim() || null,
        tags: normalizarTags(input.tags),
        observacoes: input.observacoes?.trim() || null,
        proposta_id: input.proposta_id ?? null
    }
}

export function getCRMStatusColumns() {
    return CRM_STATUS_COLUNAS
}

export function getCRMStatusTitle(status: ClienteStatus): string {
    return CRM_STATUS_COLUNAS.find(col => col.status === status)?.titulo ?? status
}

export async function fetchCRMClientes(): Promise<CRMCliente[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('crm_clientes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('[useClientesCRM] Erro ao listar clientes:', error.message)
        return []
    }

    return ((data ?? []) as CRMCliente[]).map(normalizarCliente)
}

export async function fetchCRMClienteById(id: number): Promise<CRMCliente | null> {
    const supabase = useSupabase()
    if (!supabase) return null

    const { data, error } = await supabase
        .from('crm_clientes')
        .select(`
      *,
      crm_interacoes (*)
    `)
        .eq('id', id)
        .order('data_interacao', { foreignTable: 'crm_interacoes', ascending: false })
        .maybeSingle()

    if (error) {
        console.warn('[useClientesCRM] Erro ao buscar cliente:', error.message)
        return null
    }

    return data ? normalizarCliente(data as CRMCliente) : null
}

export async function createCRMCliente(
    input: CRMClienteUpsertInput
): Promise<{ data: CRMCliente | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = buildClientePayload(input)
    if (!payload.nome) return { data: null, error: 'Nome do cliente é obrigatório' }

    const { data, error } = await supabase
        .from('crm_clientes')
        .insert(payload)
        .select('*')
        .single()

    if (error) return { data: null, error: error.message }

    return {
        data: normalizarCliente(data as CRMCliente),
        error: null
    }
}

export async function updateCRMCliente(
    id: number,
    input: CRMClienteUpsertInput
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const payload = buildClientePayload(input)
    if (!payload.nome) return { error: 'Nome do cliente é obrigatório' }

    const { error } = await supabase
        .from('crm_clientes')
        .update(payload)
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function updateCRMClienteStatus(
    id: number,
    status: ClienteStatus
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('crm_clientes')
        .update({ status: normalizarStatus(status) })
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function deleteCRMCliente(id: number): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('crm_clientes')
        .delete()
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function createCRMInteracao(
    input: CRMInteracaoInput
): Promise<{ data: CRMInteracao | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = {
        cliente_id: input.cliente_id,
        tipo: normalizarInteracaoTipo(input.tipo),
        resumo: String(input.resumo ?? '').trim(),
        detalhes: input.detalhes?.trim() || null,
        data_interacao: input.data_interacao || new Date().toISOString(),
        proxima_acao: input.proxima_acao || null,
        valor_mencionado: input.valor_mencionado == null ? null : roundMoney(Math.max(0, toNumber(input.valor_mencionado)))
    }

    if (!payload.resumo) return { data: null, error: 'Resumo da interação é obrigatório' }

    const { data, error } = await supabase
        .from('crm_interacoes')
        .insert(payload)
        .select('*')
        .single()

    if (error) return { data: null, error: error.message }

    const normalizada = {
        ...(data as CRMInteracao),
        tipo: normalizarInteracaoTipo((data as CRMInteracao).tipo),
        valor_mencionado: (data as CRMInteracao).valor_mencionado == null ? null : roundMoney(toNumber((data as CRMInteracao).valor_mencionado))
    }

    return { data: normalizada, error: null }
}

export interface CRMMetrics {
    total: number
    ativos: number
    ganhos: number
    perdidos: number
    followupsHoje: number
    valorPipeline: number
    ticketMedio: number
}

export function calcularCRMMetrics(clientes: CRMCliente[]): CRMMetrics {
    const hoje = new Date().toISOString().slice(0, 10)

    const total = clientes.length
    const ativos = clientes.filter(c => !['fechado_ganho', 'fechado_perdido'].includes(c.status)).length
    const ganhos = clientes.filter(c => c.status === 'fechado_ganho').length
    const perdidos = clientes.filter(c => c.status === 'fechado_perdido').length
    const followupsHoje = clientes.filter(c => c.proximo_followup && c.proximo_followup <= hoje).length
    const valorPipeline = roundMoney(
        clientes
            .filter(c => c.status !== 'fechado_perdido')
            .reduce((acc, c) => acc + toNumber(c.valor_potencial ?? 0), 0)
    )

    const ticketBase = clientes
        .filter(c => c.status === 'fechado_ganho' && (c.valor_potencial ?? 0) > 0)
        .map(c => toNumber(c.valor_potencial))

    const ticketMedio = ticketBase.length
        ? roundMoney(ticketBase.reduce((acc, valor) => acc + valor, 0) / ticketBase.length)
        : 0

    return {
        total,
        ativos,
        ganhos,
        perdidos,
        followupsHoje,
        valorPipeline,
        ticketMedio
    }
}
