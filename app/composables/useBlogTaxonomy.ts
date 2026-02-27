export interface BlogCategory {
    id: number
    slug: string
    name: string
    description: string | null
}

export interface BlogTag {
    id: number
    slug: string
    name: string
}

function normalizeSlug(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_categories')
        .select('id, slug, name, description')
        .order('name', { ascending: true })

    if (error) {
        console.warn('[useBlogTaxonomy] Erro categorias:', error.message)
        return []
    }

    return (data ?? []) as BlogCategory[]
}

export async function fetchBlogTags(): Promise<BlogTag[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_tags')
        .select('id, slug, name')
        .order('name', { ascending: true })

    if (error) {
        console.warn('[useBlogTaxonomy] Erro tags:', error.message)
        return []
    }

    return (data ?? []) as BlogTag[]
}

export async function createBlogCategory(input: {
    name: string
    slug?: string
    description?: string | null
}): Promise<{ data: BlogCategory | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = {
        name: input.name.trim(),
        slug: normalizeSlug(input.slug?.trim() || input.name),
        description: input.description?.trim() || null,
    }

    const { data, error } = await supabase
        .from('blog_categories')
        .insert(payload)
        .select('id, slug, name, description')
        .single()

    if (error) return { data: null, error: error.message }
    return { data: data as BlogCategory, error: null }
}

export async function createBlogTag(input: {
    name: string
    slug?: string
}): Promise<{ data: BlogTag | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const payload = {
        name: input.name.trim(),
        slug: normalizeSlug(input.slug?.trim() || input.name),
    }

    const { data, error } = await supabase
        .from('blog_tags')
        .insert(payload)
        .select('id, slug, name')
        .single()

    if (error) return { data: null, error: error.message }
    return { data: data as BlogTag, error: null }
}
