export type TipoProjeto = 'Web APP' | 'Web Responsivo' | 'Mobile APP' | 'Automação' | 'Gerenciamento' | 'Manutenção'

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

export interface PropostaRow {
  id: number
  created_at: string
  tipo_projeto: TipoProjeto | null
  nome_cliente: string | null
  valor_bruto: number | null
  valor_final: number | null
  prazo_dias: number | null
  telefone_cliente: string | null
  email_cliente: string | null
  tipos_servicos_enuns: TipoServico[] | null
  entregas: Entrega[] | null
  mais_info: string | null
  nome_proejeto: string | null
  dias_corridos_ou_ulteis: string | null
  slug: string | null
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
  return (data ?? []) as PropostaRow[]
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
  return data as PropostaRow | null
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
  return data as PropostaRow | null
}

/** Cria proposta e retorna o registro com id; gera slug se não informado. */
export async function createProposta(
  input: Omit<PropostaRow, 'id' | 'created_at'>
): Promise<{ data: PropostaRow | null; error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { data: null, error: 'Supabase não configurado' }
  const slugInformado = input.slug?.trim() || null
  const { data: inserted, error } = await supabase
    .from('proposta')
    .insert({
      tipo_projeto: input.tipo_projeto,
      nome_cliente: input.nome_cliente,
      valor_bruto: input.valor_bruto,
      valor_final: input.valor_final,
      prazo_dias: input.prazo_dias,
      telefone_cliente: input.telefone_cliente,
      email_cliente: input.email_cliente,
      tipos_servicos_enuns: input.tipos_servicos_enuns,
      entregas: input.entregas,
      mais_info: input.mais_info,
      nome_proejeto: input.nome_proejeto,
      dias_corridos_ou_ulteis: input.dias_corridos_ou_ulteis,
      slug: slugInformado
    })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  const row = inserted as PropostaRow
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
  input: Partial<Omit<PropostaRow, 'id' | 'created_at'>>
): Promise<{ error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { error: 'Supabase não configurado' }
  const { error } = await supabase.from('proposta').update(input).eq('id', id)
  return { error: error?.message ?? null }
}
