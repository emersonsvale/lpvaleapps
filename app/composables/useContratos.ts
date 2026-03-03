export type ContratoStatus = 'rascunho' | 'enviado' | 'assinado' | 'encerrado' | 'cancelado'

export interface ContratoClausulaItem {
    heading: string
    content: string
}

export interface ContratoAnexoLinkItem {
    titulo: string
    url: string
}

export interface ContratoRow {
    id: number
    created_at: string
    updated_at: string
    titulo: string
    cliente_nome: string
    cliente_email: string | null
    cliente_telefone: string | null
    status: ContratoStatus
    valor_total: number | null
    data_inicio: string | null
    data_fim: string | null
    data_assinatura: string | null
    descricao: string | null
    observacoes: string | null
    contrato_introducao: string | null
    contrato_clausulas: ContratoClausulaItem[]
    contrato_anexos_links: ContratoAnexoLinkItem[]
    proposta_id: number | null
    // Campos do documento contratual
    cliente_endereco: string | null
    cliente_cep: string | null
    cliente_cnpj: string | null
    prazo_dias: number | null
    prazo_garantia_dias: number | null
    condicoes_pagamento: string | null
    valor_hora_suporte: number | null
    multa_absorcao: string | null
    percentual_resilicao: string | null
    email_suporte: string | null
    canal_atendimento: string | null
    banco_nome: string | null
    banco_agencia: string | null
    banco_conta: string | null
    chave_pix: string | null
    cidade_foro: string | null
    estado_foro: string | null
}

export interface ContratoUpsertInput {
    titulo?: string
    cliente_nome?: string
    cliente_email?: string | null
    cliente_telefone?: string | null
    status?: ContratoStatus | null
    valor_total?: number | null
    data_inicio?: string | null
    data_fim?: string | null
    data_assinatura?: string | null
    descricao?: string | null
    observacoes?: string | null
    contrato_introducao?: string | null
    contrato_clausulas?: ContratoClausulaItem[] | null
    contrato_anexos_links?: ContratoAnexoLinkItem[] | null
    proposta_id?: number | null
    // Campos do documento contratual
    cliente_endereco?: string | null
    cliente_cep?: string | null
    cliente_cnpj?: string | null
    prazo_dias?: number | null
    prazo_garantia_dias?: number | null
    condicoes_pagamento?: string | null
    valor_hora_suporte?: number | null
    multa_absorcao?: string | null
    percentual_resilicao?: string | null
    email_suporte?: string | null
    canal_atendimento?: string | null
    banco_nome?: string | null
    banco_agencia?: string | null
    banco_conta?: string | null
    chave_pix?: string | null
    cidade_foro?: string | null
    estado_foro?: string | null
}

const STATUS_DEFAULT: ContratoStatus = 'rascunho'

const CONTRATO_STATUS: Array<{ status: ContratoStatus; titulo: string }> = [
    { status: 'rascunho', titulo: 'Rascunho' },
    { status: 'enviado', titulo: 'Enviado' },
    { status: 'assinado', titulo: 'Assinado' },
    { status: 'encerrado', titulo: 'Encerrado' },
    { status: 'cancelado', titulo: 'Cancelado' }
]

function toNumber(value: unknown): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100
}

function normalizarStatus(value?: string | null): ContratoStatus {
    switch (value) {
        case 'enviado':
        case 'assinado':
        case 'encerrado':
        case 'cancelado':
            return value
        default:
            return STATUS_DEFAULT
    }
}

function normalizarContrato(item: ContratoRow): ContratoRow {
    return {
        ...item,
        status: normalizarStatus(item.status),
        valor_total: item.valor_total == null ? null : roundMoney(toNumber(item.valor_total)),
        contrato_introducao: item.contrato_introducao ?? null,
        contrato_clausulas: normalizarClausulas(item.contrato_clausulas),
        contrato_anexos_links: normalizarAnexosLinks(item.contrato_anexos_links),
    }
}

function normalizarClausulas(value: unknown): ContratoClausulaItem[] {
    if (!Array.isArray(value)) return []

    return value
        .map((item) => {
            const heading = String((item as ContratoClausulaItem | null)?.heading ?? '').trim()
            const content = String((item as ContratoClausulaItem | null)?.content ?? '').trim()
            if (!heading && !content) return null
            return { heading, content }
        })
        .filter((item): item is ContratoClausulaItem => !!item)
}

function normalizarAnexosLinks(value: unknown): ContratoAnexoLinkItem[] {
    if (!Array.isArray(value)) return []

    return value
        .map((item) => {
            const titulo = String((item as ContratoAnexoLinkItem | null)?.titulo ?? '').trim()
            const url = String((item as ContratoAnexoLinkItem | null)?.url ?? '').trim()
            if (!titulo || !url) return null
            return { titulo, url }
        })
        .filter((item): item is ContratoAnexoLinkItem => !!item)
}

function buildContratoPayload(input: ContratoUpsertInput) {
    return {
        titulo: String(input.titulo ?? '').trim(),
        cliente_nome: String(input.cliente_nome ?? '').trim(),
        cliente_email: input.cliente_email?.trim()?.toLowerCase() || null,
        cliente_telefone: input.cliente_telefone?.trim() || null,
        status: normalizarStatus(input.status),
        valor_total: input.valor_total == null ? null : roundMoney(Math.max(0, toNumber(input.valor_total))),
        data_inicio: input.data_inicio || null,
        data_fim: input.data_fim || null,
        data_assinatura: input.data_assinatura || null,
        descricao: input.descricao?.trim() || null,
        observacoes: input.observacoes?.trim() || null,
        contrato_introducao: input.contrato_introducao?.trim() || null,
        contrato_clausulas: normalizarClausulas(input.contrato_clausulas),
        contrato_anexos_links: normalizarAnexosLinks(input.contrato_anexos_links),
        proposta_id: input.proposta_id ?? null,
        // Campos do documento contratual
        cliente_endereco: input.cliente_endereco?.trim() || null,
        cliente_cep: input.cliente_cep?.trim() || null,
        cliente_cnpj: input.cliente_cnpj?.trim() || null,
        prazo_dias: input.prazo_dias ?? null,
        prazo_garantia_dias: input.prazo_garantia_dias ?? null,
        condicoes_pagamento: input.condicoes_pagamento?.trim() || null,
        valor_hora_suporte: input.valor_hora_suporte ?? null,
        multa_absorcao: input.multa_absorcao?.trim() || null,
        percentual_resilicao: input.percentual_resilicao?.trim() || null,
        email_suporte: input.email_suporte?.trim() || null,
        canal_atendimento: input.canal_atendimento?.trim() || null,
        banco_nome: input.banco_nome?.trim() || null,
        banco_agencia: input.banco_agencia?.trim() || null,
        banco_conta: input.banco_conta?.trim() || null,
        chave_pix: input.chave_pix?.trim() || null,
        cidade_foro: input.cidade_foro?.trim() || null,
        estado_foro: input.estado_foro?.trim() || null,
    }
}

export function getContratoStatusOptions() {
    return CONTRATO_STATUS
}

export function getContratoStatusTitle(status: ContratoStatus): string {
    return CONTRATO_STATUS.find(item => item.status === status)?.titulo ?? status
}

export async function fetchContratos(): Promise<ContratoRow[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('[useContratos] Erro ao listar contratos:', error.message)
        return []
    }

    return ((data ?? []) as ContratoRow[]).map(normalizarContrato)
}

export async function fetchContratoById(id: number): Promise<ContratoRow | null> {
    const supabase = useSupabase()
    if (!supabase) return null

    const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        console.warn('[useContratos] Erro ao buscar contrato:', error.message)
        return null
    }

    return data ? normalizarContrato(data as ContratoRow) : null
}

export async function createContrato(
    input: ContratoUpsertInput
): Promise<{ data: ContratoRow | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = buildContratoPayload(input)
    if (!payload.titulo) return { data: null, error: 'Título do contrato é obrigatório' }
    if (!payload.cliente_nome) return { data: null, error: 'Nome do cliente é obrigatório' }

    const { data, error } = await supabase
        .from('contratos')
        .insert(payload)
        .select('*')
        .single()

    if (error) return { data: null, error: error.message }

    return { data: normalizarContrato(data as ContratoRow), error: null }
}

export async function updateContrato(
    id: number,
    input: ContratoUpsertInput
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const payload = buildContratoPayload(input)
    if (!payload.titulo) return { error: 'Título do contrato é obrigatório' }
    if (!payload.cliente_nome) return { error: 'Nome do cliente é obrigatório' }

    const { error } = await supabase
        .from('contratos')
        .update(payload)
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function updateContratoStatus(
    id: number,
    status: ContratoStatus
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('contratos')
        .update({ status: normalizarStatus(status) })
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function deleteContrato(id: number): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id)

    return { error: error?.message ?? null }
}