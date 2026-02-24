export interface ProjetoAdmin {
  id: number
  created_at?: string
  titulo: string | null
  descricao: string | null
  capa: string | null
  imgens: string[] | null
  h2: string | null
  categoria_projeto: number[] | null
  ferramentas: number[] | null
  likes: number | null
  link_web: string | null
  link_google: string | null
  link_apple: string | null
  ranking: number | null
  mobile: boolean | null
  imagem_celular: string | null
  imagem_pc: string | null
  parceiro: string | null
  desafio: string | null
  slug: string | null
  valeapps: boolean | null
}

export interface CategoriaRow {
  id: number
  nome: string | null
}

export interface FerramentaRow {
  id: number
  nome: string | null
}

/** Lista categorias para o select do formulário. */
export async function fetchCategorias(): Promise<CategoriaRow[]> {
  const supabase = useSupabase()
  if (!supabase) return []
  const { data, error } = await supabase.from('categorias_proejto').select('id, nome').order('nome')
  if (error) {
    console.warn('[useProjetosAdmin] Erro categorias:', error.message)
    return []
  }
  return (data ?? []) as CategoriaRow[]
}

/** Lista ferramentas para o select do formulário. */
export async function fetchFerramentas(): Promise<FerramentaRow[]> {
  const supabase = useSupabase()
  if (!supabase) return []
  const { data, error } = await supabase.from('ferramentas').select('id, nome').order('nome')
  if (error) {
    console.warn('[useProjetosAdmin] Erro ferramentas:', error.message)
    return []
  }
  return (data ?? []) as FerramentaRow[]
}

/** Busca um projeto por id (admin). */
export async function fetchProjetoById(id: number): Promise<ProjetoAdmin | null> {
  const supabase = useSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.from('projetos').select('*').eq('id', id).maybeSingle()
  if (error) {
    console.warn('[useProjetosAdmin] Erro ao buscar projeto:', error.message)
    return null
  }
  return data as ProjetoAdmin | null
}

/** Cria um novo projeto. */
export async function createProjeto(
  input: Partial<Omit<ProjetoAdmin, 'id' | 'created_at'>>
): Promise<{ data: ProjetoAdmin | null; error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { data: null, error: 'Supabase não configurado' }
  const { data, error } = await supabase.from('projetos').insert(input).select().single()
  if (error) return { data: null, error: error.message }
  return { data: data as ProjetoAdmin, error: null }
}

/** Atualiza projeto por id. */
export async function updateProjeto(
  id: number,
  input: Partial<Omit<ProjetoAdmin, 'id' | 'created_at'>>
): Promise<{ error: string | null }> {
  const supabase = useSupabase()
  if (!supabase) return { error: 'Supabase não configurado' }
  const { error } = await supabase.from('projetos').update(input).eq('id', id)
  return { error: error?.message ?? null }
}
