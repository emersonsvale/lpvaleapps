import { useSupabaseServer } from '~~/server/utils/supabase'

function normalizeSlugVariants(slug: string): string[] {
    const trimmed = slug.trim()
    if (!trimmed) return []

    const variants = [trimmed]
    const normalized = trimmed.toLowerCase().replace(/_/g, '-')

    if (normalized !== trimmed) {
        variants.push(normalized)
    }

    return variants
}

export default defineEventHandler(async (event) => {
    const slugParam = getRouterParam(event, 'slug')
    const slug = typeof slugParam === 'string' ? slugParam : ''
    const variants = normalizeSlugVariants(slug)

    if (!variants.length) {
        throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' })
    }

    const supabase = useSupabaseServer()
    if (!supabase) {
        throw createError({ statusCode: 503, statusMessage: 'Supabase não disponível' })
    }

    const { data, error } = await supabase
        .from('proposta')
        .select('*')
        .in('slug', variants)
        .limit(1)
        .maybeSingle()

    if (error) {
        throw createError({ statusCode: 502, statusMessage: error.message })
    }

    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Proposta não encontrada' })
    }

    let itensHora: Record<string, unknown>[] = []

    if (data.tipo_proposta === 'hora' && data.id) {
        const { data: itemsData, error: itemsError } = await supabase
            .from('proposta_itens_hora')
            .select('*')
            .eq('proposta_id', data.id)
            .order('ordem', { ascending: true })

        if (itemsError) {
            throw createError({ statusCode: 502, statusMessage: itemsError.message })
        }

        itensHora = (itemsData ?? []) as Record<string, unknown>[]
    }

    return {
        ...data,
        proposta_itens_hora: itensHora,
    }
})