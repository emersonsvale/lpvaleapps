export interface Projeto {
  id: number
  titulo: string | null
  descricao: string | null
  capa: string | null
  imgens: string[] | null
  link_web: string | null
  link_google: string | null
  link_apple: string | null
  ranking: number | null
  mobile: boolean | null
  slug: string | null
  created_at?: string
  categoria_projeto?: number[]
  ferramentas?: number[]
  categoriasNomes: string[]
  ferramentasNomes: string[]
}

/** Converte IDs (number ou string) do array para números. */
function toIdArray(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw.map((v) => (typeof v === 'number' ? v : parseInt(String(v), 10))).filter((n) => !Number.isNaN(n))
}

/**
 * Busca projetos no Supabase ordenados por ranking, com nomes de categorias e ferramentas.
 * Retorna array vazio se Supabase não estiver configurado ou em caso de erro.
 */
export async function useProjetos(): Promise<Projeto[]> {
  const supabase = useSupabase()
  if (!supabase) return []

  const [projetosRes, categoriasRes, ferramentasRes] = await Promise.all([
    supabase
      .from('projetos')
      .select('id, titulo, descricao, capa, imgens, link_web, link_google, link_apple, ranking, mobile, slug, created_at, categoria_projeto, ferramentas')
      .eq('valeapps', true)
      .order('ranking', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true }),
    supabase.from('categorias_proejto').select('id, nome'),
    supabase.from('ferramentas').select('id, nome')
  ])

  if (projetosRes.error) {
    console.warn('[useProjetos] Erro ao carregar projetos:', projetosRes.error.message)
    return []
  }

  const categoriasMap = new Map<number, string>()
  if (!categoriasRes.error && categoriasRes.data) {
    for (const row of categoriasRes.data as { id: number; nome: string | null }[]) {
      categoriasMap.set(row.id, row.nome ?? '')
    }
  }

  const ferramentasMap = new Map<number, string>()
  if (!ferramentasRes.error && ferramentasRes.data) {
    for (const row of ferramentasRes.data as { id: number; nome: string | null }[]) {
      ferramentasMap.set(row.id, row.nome ?? '')
    }
  }

  const projetos = (projetosRes.data ?? []) as (Omit<Projeto, 'categoriasNomes' | 'ferramentasNomes'> & {
    categoria_projeto?: unknown
    ferramentas?: unknown
  })[]

  return projetos.map((p) => {
    const catIds = toIdArray(p.categoria_projeto)
    const ferIds = toIdArray(p.ferramentas)
    return {
      ...p,
      categoriasNomes: catIds.map((id) => categoriasMap.get(id) ?? '').filter(Boolean),
      ferramentasNomes: ferIds.map((id) => ferramentasMap.get(id) ?? '').filter(Boolean)
    } as Projeto
  })
}
