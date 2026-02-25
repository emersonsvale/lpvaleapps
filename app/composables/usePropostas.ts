export type TipoProjeto = 'Web APP' | 'Web Responsivo' | 'Mobile APP' | 'Automação' | 'Gerenciamento' | 'Manutenção'
export type TipoProposta = 'empreitada' | 'hora'
export type StatusProposta = 'nova' | 'em_analise' | 'aprovada' | 'em_execucao' | 'entregue' | 'cancelada'

export type TipoServico =
  | 'Planejamento e Conceito'
  | 'Design'
  | 'UI/UX Design'
  | 'Design responsivo'
  | 'Wireframes e protótipos interativos'
  | 'Desenvolvimento'
  | 'Frontend'
  | 'Backend'
  | 'Infraestrutura'
  | 'Segurança'
  | 'Testes'
  | 'Publicação'
  | 'Manutenção'
  | 'Marketing e Lançamento'
  | 'Criptografia de dados sensíveis'
  | 'Certificados SSL para segurança de navegação.'
  | 'Pagamentos e Assinaturas'
  | 'Integração com sistemas de pagamento'
  | 'Configuração de planos de assinatura'
  | 'Gestão de cobranças recorrentes e faturas.'
  | 'Publicação e Implantação'
  | 'Analytics e Feedback'
  | 'Integrações'
  | 'Ferramentas externas'
  | 'Integração com serviços em nuvem'

export type Entrega =
  | 'Produto Funcional'
  | 'Web App'
  | 'App Mobile'
  | 'SaaS'
  | 'Documentação'
  | 'Manual do Usuário'
  | 'Documentação Técnica'
  | 'Código-Fonte'
  | 'Design'
  | 'Arquivos finais do design'
  | 'Infraestrutura Configurada'
  | 'Servidor configurado'
  | 'Banco de dados implementado'
  | 'Funcionalidades Desenvolvidas'
  | 'Funcionalidades do MVP implementadas e testadas'
  | 'Integrações externas funcionando'
  | 'Web App Link de produção com domínio configurado.'
  | 'SaaS Site e plataforma acessíveis via domínio personalizado.'
  | 'Apoio Pós-Lançamento'
  | 'Suporte técnico para ajustes iniciais.'
  | 'Cronograma de manutenção'

export interface PropostaHoraItem {
  id?: number
  proposta_id?: number
  created_at?: string
  etapa: string
  descricao: string | null
  horas: number
  valor_hora: number
  subtotal: number
  ordem: number
}

export interface PropostaFormaPagamentoItem {
  descricao: string
  percentual: number
  valor: number
  marco_horas: number | null
}

export interface PropostaRow {
  id: number
  created_at: string
  tipo_proposta: TipoProposta | null
  status_proposta: StatusProposta | null
  tipo_projeto: TipoProjeto | null
  nome_cliente: string | null
  valor_bruto: number | null
  valor_final: number | null
  valor_hora: number | null
  total_horas: number | null
  prazo_dias: number | null
  telefone_cliente: string | null
  email_cliente: string | null
  tipos_servicos_enuns: TipoServico[] | null
  entregas: Entrega[] | null
  mais_info: string | null
  nome_proejeto: string | null
  dias_corridos_ou_ulteis: string | null
  validade_orcamento_dias: number | null
  suporte_dias: number | null
  forma_pagamento: PropostaFormaPagamentoItem[] | null
  condicoes: string[] | null
  garantias: string[] | null
  slug: string | null
  proposta_itens_hora?: PropostaHoraItem[] | null
}

export interface PropostaUpsertInput {
  tipo_proposta?: TipoProposta | null
  status_proposta?: StatusProposta | null
  tipo_projeto?: TipoProjeto | null
  nome_cliente?: string | null
  valor_bruto?: number | null
  valor_final?: number | null
  valor_hora?: number | null
  total_horas?: number | null
  prazo_dias?: number | null
  telefone_cliente?: string | null
  email_cliente?: string | null
  tipos_servicos_enuns?: TipoServico[] | null
  entregas?: Entrega[] | null
  mais_info?: string | null
  nome_proejeto?: string | null
  dias_corridos_ou_ulteis?: string | null
  validade_orcamento_dias?: number | null
  suporte_dias?: number | null
  forma_pagamento?: PropostaFormaPagamentoItem[] | null
  condicoes?: string[] | null
  garantias?: string[] | null
  slug?: string | null
  proposta_itens_hora?: PropostaHoraItem[] | null
}

export interface PropostaResumoHora {
  totalHoras: number
  totalValor: number
  itens: PropostaHoraItem[]
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function toNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizarListaTexto(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const linhas = value
    .map(item => String(item ?? '').trim())
    .filter(Boolean)
  return linhas.length ? linhas : null
}

function normalizarFormaPagamento(value: unknown): PropostaFormaPagamentoItem[] | null {
  if (!Array.isArray(value)) return null

  const itens = value
    .map((item) => {
      const src = item as Partial<PropostaFormaPagamentoItem>
      const descricao = String(src?.descricao ?? '').trim()
      const percentual = Math.max(0, toNumber(src?.percentual))
      const valor = Math.max(0, toNumber(src?.valor))
      const marco_horas = src?.marco_horas == null ? null : Math.max(0, toNumber(src.marco_horas))

      if (!descricao) return null

      return {
        descricao,
        percentual,
        valor: roundMoney(valor),
        marco_horas,
      }
    })
    .filter((item): item is PropostaFormaPagamentoItem => !!item)

  return itens.length ? itens : null
}

function normalizarTipoProposta(value?: string | null): TipoProposta {
  return value === 'hora' ? 'hora' : 'empreitada'
}

function normalizarStatusProposta(value?: string | null): StatusProposta {
  switch (value) {
    case 'em_analise':
    case 'aprovada':
    case 'em_execucao':
    case 'entregue':
    case 'cancelada':
      return value
    default:
      return 'nova'
  }
}

function normalizarItensHora(itens: PropostaHoraItem[] | null | undefined, valorHoraPadrao: number): PropostaHoraItem[] {
  return (itens ?? [])
    .map((item, index) => {
      const horas = Math.max(0, toNumber(item.horas))
      const valorHora = Math.max(0, toNumber(item.valor_hora || valorHoraPadrao))
      const subtotal = roundMoney(horas * valorHora)
      return {
        id: item.id,
        proposta_id: item.proposta_id,
        created_at: item.created_at,
        etapa: item.etapa?.trim() || `Etapa ${index + 1}`,
        descricao: item.descricao?.trim() || null,
        horas,
        valor_hora: valorHora,
        subtotal,
        ordem: toNumber(item.ordem) || index
      }
    })
    .filter(item => item.etapa && item.horas > 0)
}

export function calcularResumoHora(
  itens: PropostaHoraItem[] | null | undefined,
  valorHoraPadrao: number | null | undefined
): PropostaResumoHora {
  const valorHora = Math.max(0, toNumber(valorHoraPadrao))
  const itensNormalizados = normalizarItensHora(itens, valorHora)
  const totalHoras = itensNormalizados.reduce((acc, item) => acc + item.horas, 0)
  const totalValor = roundMoney(itensNormalizados.reduce((acc, item) => acc + item.subtotal, 0))

  return {
    totalHoras: roundMoney(totalHoras),
    totalValor,
    itens: itensNormalizados
  }
}

async function fetchItensHora(propostaId: number): Promise<PropostaHoraItem[]> {
  const supabase = useSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('proposta_itens_hora')
    .select('*')
    .eq('proposta_id', propostaId)
    .order('ordem', { ascending: true })

  if (error) {
    console.warn('[usePropostas] Erro ao buscar itens por hora:', error.message)
    return []
  }

  const itens = (data ?? []) as PropostaHoraItem[]
  return itens.map(item => ({
    ...item,
    horas: toNumber(item.horas),
    valor_hora: toNumber(item.valor_hora),
    subtotal: toNumber(item.subtotal),
    ordem: toNumber(item.ordem)
  }))
}

async function replaceItensHora(propostaId: number, itens: PropostaHoraItem[]): Promise<string | null> {
  const supabase = useSupabase()
  if (!supabase) return 'Supabase não configurado'

  const { error: deleteError } = await supabase
    .from('proposta_itens_hora')
    .delete()
    .eq('proposta_id', propostaId)

  if (deleteError) return deleteError.message
  if (!itens.length) return null

  const payload = itens.map((item, index) => ({
    proposta_id: propostaId,
    etapa: item.etapa,
    descricao: item.descricao,
    horas: item.horas,
    valor_hora: item.valor_hora,
    subtotal: item.subtotal,
    ordem: index
  }))

  const { error: insertError } = await supabase.from('proposta_itens_hora').insert(payload)
  return insertError?.message ?? null
}

/** Gera slug único a partir do título/nome e id. */
export function slugifyProposta(nomeProjeto: string, id?: number): string {
  const base = nomeProjeto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'proposta'
  return id ? `${base}-${id}` : base
}

/** Lista todas as propostas (admin). */
export async function fetchPropostas(): Promise<PropostaRow[]> {
  const supabase = useSupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('proposta')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[usePropostas] Erro ao listar:', error.message)
    return []
  }

  return ((data ?? []) as PropostaRow[]).map(item => ({
    ...item,
    tipo_proposta: normalizarTipoProposta(item.tipo_proposta),
    status_proposta: normalizarStatusProposta(item.status_proposta),
    valor_hora: item.valor_hora != null ? toNumber(item.valor_hora) : null,
    total_horas: item.total_horas != null ? toNumber(item.total_horas) : null,
    validade_orcamento_dias: item.validade_orcamento_dias != null ? toNumber(item.validade_orcamento_dias) : null,
    suporte_dias: item.suporte_dias != null ? toNumber(item.suporte_dias) : null,
    forma_pagamento: normalizarFormaPagamento(item.forma_pagamento),
    condicoes: normalizarListaTexto(item.condicoes),
    garantias: normalizarListaTexto(item.garantias),
  }))
}

/** Normaliza slug para busca: aceita tanto "Projeto_Varzea_Play" quanto "projeto-varzea-play". */
function normalizarSlugParaBusca(slug: string): string[] {
  const s = slug.trim()
  if (!s) return []
  const variantes = [s]
  const normalizado = s.toLowerCase().replace(/_/g, '-')
  if (normalizado !== s) variantes.push(normalizado)
  return variantes
}

/** Busca proposta por slug (página pública do cliente). Aceita slug exato ou com _/-. */
export async function fetchPropostaBySlug(slug: string): Promise<PropostaRow | null> {
  const supabase = useSupabase()
  if (!supabase || !slug?.trim()) return null

  const variantes = normalizarSlugParaBusca(slug)
  if (variantes.length === 0) return null

  if (process.client) {
    console.log('[fetchPropostaBySlug]', { slug, variantes })
  }

  const { data, error } = await supabase
    .from('proposta')
    .select('*')
    .in('slug', variantes)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.warn('[usePropostas] Erro ao buscar por slug:', error.message)
    return null
  }

  if (process.client) {
    console.log('[fetchPropostaBySlug RESULT]', { slug, variantes, found: !!data })
  }

  if (!data) return null

  const proposta = {
    ...(data as PropostaRow),
    tipo_proposta: normalizarTipoProposta((data as PropostaRow).tipo_proposta),
    status_proposta: normalizarStatusProposta((data as PropostaRow).status_proposta),
    valor_hora: (data as PropostaRow).valor_hora != null ? toNumber((data as PropostaRow).valor_hora) : null,
    total_horas: (data as PropostaRow).total_horas != null ? toNumber((data as PropostaRow).total_horas) : null,
    validade_orcamento_dias: (data as PropostaRow).validade_orcamento_dias != null ? toNumber((data as PropostaRow).validade_orcamento_dias) : null,
    suporte_dias: (data as PropostaRow).suporte_dias != null ? toNumber((data as PropostaRow).suporte_dias) : null,
    forma_pagamento: normalizarFormaPagamento((data as PropostaRow).forma_pagamento),
    condicoes: normalizarListaTexto((data as PropostaRow).condicoes),
    garantias: normalizarListaTexto((data as PropostaRow).garantias),
    proposta_itens_hora: null
  } as PropostaRow

  if (proposta.tipo_proposta === 'hora' && proposta.id) {
    proposta.proposta_itens_hora = await fetchItensHora(proposta.id)
  }

  return proposta
}

/** Busca proposta por id (admin). */
export async function fetchPropostaById(id: number): Promise<PropostaRow | null> {
  const supabase = useSupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('proposta')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.warn('[usePropostas] Erro ao buscar por id:', error.message)
    return null
  }
  if (!data) return null

  const proposta = {
    ...(data as PropostaRow),
    tipo_proposta: normalizarTipoProposta((data as PropostaRow).tipo_proposta),
    status_proposta: normalizarStatusProposta((data as PropostaRow).status_proposta),
    valor_hora: (data as PropostaRow).valor_hora != null ? toNumber((data as PropostaRow).valor_hora) : null,
    total_horas: (data as PropostaRow).total_horas != null ? toNumber((data as PropostaRow).total_horas) : null,
    validade_orcamento_dias: (data as PropostaRow).validade_orcamento_dias != null ? toNumber((data as PropostaRow).validade_orcamento_dias) : null,
    suporte_dias: (data as PropostaRow).suporte_dias != null ? toNumber((data as PropostaRow).suporte_dias) : null,
    forma_pagamento: normalizarFormaPagamento((data as PropostaRow).forma_pagamento),
    condicoes: normalizarListaTexto((data as PropostaRow).condicoes),
    garantias: normalizarListaTexto((data as PropostaRow).garantias),
    proposta_itens_hora: null
  } as PropostaRow

  if (proposta.tipo_proposta === 'hora') {
    proposta.proposta_itens_hora = await fetchItensHora(proposta.id)
  }

  return proposta
}

/** Cria proposta e retorna o registro com id; gera slug se não informado. */
export async function createProposta(
  input: PropostaUpsertInput
): Promise<{ data: PropostaRow | null; error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { data: null, error: 'Supabase não configurado' }

  const tipoProposta = normalizarTipoProposta(input.tipo_proposta)
  const resumoHora = tipoProposta === 'hora'
    ? calcularResumoHora(input.proposta_itens_hora, input.valor_hora)
    : null

  if (tipoProposta === 'hora' && (!resumoHora || resumoHora.itens.length === 0)) {
    return { data: null, error: 'Adicione ao menos uma etapa com horas para proposta por hora.' }
  }

  const slugInformado = input.slug?.trim() || null
  const statusProposta = normalizarStatusProposta(input.status_proposta)
  const { data: inserted, error } = await supabase
    .from('proposta')
    .insert({
      tipo_proposta: tipoProposta,
      status_proposta: statusProposta,
      tipo_projeto: input.tipo_projeto,
      nome_cliente: input.nome_cliente,
      valor_bruto: tipoProposta === 'hora' ? resumoHora?.totalValor ?? null : input.valor_bruto,
      valor_final: tipoProposta === 'hora' ? resumoHora?.totalValor ?? null : input.valor_final,
      valor_hora: tipoProposta === 'hora' ? Math.max(0, toNumber(input.valor_hora)) : null,
      total_horas: tipoProposta === 'hora' ? resumoHora?.totalHoras ?? null : null,
      prazo_dias: input.prazo_dias,
      telefone_cliente: input.telefone_cliente,
      email_cliente: input.email_cliente,
      tipos_servicos_enuns: input.tipos_servicos_enuns,
      entregas: input.entregas,
      mais_info: input.mais_info,
      nome_proejeto: input.nome_proejeto,
      dias_corridos_ou_ulteis: input.dias_corridos_ou_ulteis,
      validade_orcamento_dias: input.validade_orcamento_dias,
      suporte_dias: input.suporte_dias,
      forma_pagamento: normalizarFormaPagamento(input.forma_pagamento),
      condicoes: normalizarListaTexto(input.condicoes),
      garantias: normalizarListaTexto(input.garantias),
      slug: slugInformado
    })
    .select()
    .single()
  if (error) return { data: null, error: error.message }

  const row = {
    ...(inserted as PropostaRow),
    tipo_proposta: tipoProposta,
    status_proposta: statusProposta,
    valor_hora: tipoProposta === 'hora' ? Math.max(0, toNumber(input.valor_hora)) : null,
    total_horas: tipoProposta === 'hora' ? resumoHora?.totalHoras ?? null : null,
    validade_orcamento_dias: input.validade_orcamento_dias != null ? toNumber(input.validade_orcamento_dias) : null,
    suporte_dias: input.suporte_dias != null ? toNumber(input.suporte_dias) : null,
    forma_pagamento: normalizarFormaPagamento(input.forma_pagamento),
    condicoes: normalizarListaTexto(input.condicoes),
    garantias: normalizarListaTexto(input.garantias),
    proposta_itens_hora: null
  } as PropostaRow

  if (tipoProposta === 'hora' && row.id && resumoHora) {
    const itensError = await replaceItensHora(row.id, resumoHora.itens)
    if (itensError) return { data: null, error: itensError }
    row.proposta_itens_hora = resumoHora.itens
  }

  if (!row.slug && row.id) {
    const newSlug = slugifyProposta(row.nome_proejeto || 'proposta', row.id)
    await supabase.from('proposta').update({ slug: newSlug }).eq('id', row.id)
    row.slug = newSlug
  }
  return { data: row, error: null }
}

/** Atualiza proposta por id. */
export async function updateProposta(
  id: number,
  input: PropostaUpsertInput
): Promise<{ error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { error: 'Supabase não configurado' }

  const tipoProposta = normalizarTipoProposta(input.tipo_proposta)
  const statusProposta = input.status_proposta == null
    ? undefined
    : normalizarStatusProposta(input.status_proposta)
  const resumoHora = tipoProposta === 'hora'
    ? calcularResumoHora(input.proposta_itens_hora, input.valor_hora)
    : null

  if (tipoProposta === 'hora' && (!resumoHora || resumoHora.itens.length === 0)) {
    return { error: 'Adicione ao menos uma etapa com horas para proposta por hora.' }
  }

  const payload: PropostaUpsertInput = {
    tipo_proposta: tipoProposta,
    status_proposta: statusProposta,
    tipo_projeto: input.tipo_projeto,
    nome_cliente: input.nome_cliente,
    valor_bruto: tipoProposta === 'hora' ? resumoHora?.totalValor ?? null : input.valor_bruto,
    valor_final: tipoProposta === 'hora' ? resumoHora?.totalValor ?? null : input.valor_final,
    valor_hora: tipoProposta === 'hora' ? Math.max(0, toNumber(input.valor_hora)) : null,
    total_horas: tipoProposta === 'hora' ? resumoHora?.totalHoras ?? null : null,
    prazo_dias: input.prazo_dias,
    telefone_cliente: input.telefone_cliente,
    email_cliente: input.email_cliente,
    tipos_servicos_enuns: input.tipos_servicos_enuns,
    entregas: input.entregas,
    mais_info: input.mais_info,
    nome_proejeto: input.nome_proejeto,
    dias_corridos_ou_ulteis: input.dias_corridos_ou_ulteis,
    validade_orcamento_dias: input.validade_orcamento_dias,
    suporte_dias: input.suporte_dias,
    forma_pagamento: normalizarFormaPagamento(input.forma_pagamento),
    condicoes: normalizarListaTexto(input.condicoes),
    garantias: normalizarListaTexto(input.garantias),
    slug: input.slug,
  }

  const { error } = await supabase.from('proposta').update(payload).eq('id', id)
  if (error) return { error: error.message }

  if (tipoProposta === 'hora' && resumoHora) {
    const itensError = await replaceItensHora(id, resumoHora.itens)
    return { error: itensError }
  }

  const clearItensError = await replaceItensHora(id, [])
  return { error: clearItensError }
}

export async function updatePropostaStatus(
  id: number,
  status: StatusProposta
): Promise<{ error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { error: 'Supabase não configurado' }

  const statusNormalizado = normalizarStatusProposta(status)
  const { error } = await supabase
    .from('proposta')
    .update({ status_proposta: statusNormalizado })
    .eq('id', id)

  return { error: error?.message ?? null }
}
