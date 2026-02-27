import { marked } from 'marked'

export type BlogStatus = 'draft' | 'scheduled' | 'published'

export interface BlogPost {
    id: number
    created_at: string
    updated_at: string
    slug: string
    title: string
    excerpt: string
    content_markdown: string | null
    content_html: string
    status: BlogStatus
    published_at: string | null
    scheduled_at: string | null
    author_name: string | null
    cover_image: string | null
    cover_alt: string | null
    reading_time: number | null
    canonical_url: string | null
    seo_title: string | null
    seo_description: string | null
    focus_keyword: string | null
    og_image: string | null
    noindex: boolean
}

export interface BlogPostInput {
    slug: string
    title: string
    excerpt: string
    content_markdown?: string | null
    content_html?: string | null
    status?: BlogStatus
    published_at?: string | null
    scheduled_at?: string | null
    author_name?: string | null
    cover_image?: string | null
    cover_alt?: string | null
    reading_time?: number | null
    canonical_url?: string | null
    seo_title?: string | null
    seo_description?: string | null
    focus_keyword?: string | null
    og_image?: string | null
    noindex?: boolean
}

export interface BlogPostAdminListItem {
    id: number
    title: string
    slug: string
    status: BlogStatus
    updated_at: string
    published_at: string | null
    scheduled_at: string | null
    noindex: boolean
}

export interface BlogPostPublicView extends BlogPost {
    categories: Array<{ id: number; slug: string; name: string }>
    tags: Array<{ id: number; slug: string; name: string }>
}

export interface BlogPostsPublicResult {
    posts: BlogPostPublicView[]
    total: number
}

export interface BlogImageUploadResult {
    url: string
    path: string
}

const BLOG_IMAGES_BUCKET = 'blog-images'

function resolveImageExtension(file: File): string {
    const fromName = file.name.split('.').pop()?.toLowerCase()
    if (fromName && /^[a-z0-9]+$/i.test(fromName)) return fromName

    if (file.type === 'image/jpeg') return 'jpg'
    if (file.type === 'image/png') return 'png'
    if (file.type === 'image/webp') return 'webp'
    if (file.type === 'image/avif') return 'avif'
    if (file.type === 'image/gif') return 'gif'
    return 'jpg'
}

export async function uploadBlogCoverImage(
    file: File,
    options?: { slug?: string }
): Promise<{ data: BlogImageUploadResult | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    if (!file.type?.startsWith('image/')) {
        return { data: null, error: 'Arquivo inválido. Envie uma imagem.' }
    }

    const maxSizeMb = 10
    if (file.size > maxSizeMb * 1024 * 1024) {
        return { data: null, error: `A imagem deve ter no máximo ${maxSizeMb}MB.` }
    }

    const safeSlug = normalizeBlogSlug(options?.slug || 'blog-post') || 'blog-post'
    const ext = resolveImageExtension(file)
    const filePath = `covers/${safeSlug}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase
        .storage
        .from(BLOG_IMAGES_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
        })

    if (uploadError) {
        return {
            data: null,
            error: uploadError.message || 'Falha ao enviar imagem para o storage.',
        }
    }

    const { data: publicData } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(filePath)
    const publicUrl = publicData?.publicUrl

    if (!publicUrl) {
        return {
            data: null,
            error: 'Upload concluído, mas não foi possível obter URL pública da imagem.',
        }
    }

    return {
        data: {
            url: publicUrl,
            path: filePath,
        },
        error: null,
    }
}

export function normalizeBlogSlug(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export function estimateReadingTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = text ? text.split(' ').length : 0
    return Math.max(1, Math.ceil(words / 200))
}

export async function markdownToHtml(markdown: string): Promise<string> {
    return marked.parse(markdown || '', { async: false }) as string
}

function nowIso(): string {
    return new Date().toISOString()
}

async function fetchPostCategories(postId: number): Promise<Array<{ id: number; slug: string; name: string }>> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_post_categories')
        .select('blog_categories(id, slug, name)')
        .eq('post_id', postId)

    if (error) {
        console.warn('[useBlogPosts] Erro categorias do post:', error.message)
        return []
    }

    return (data ?? [])
        .map((item: any) => item.blog_categories)
        .filter(Boolean)
}

async function fetchPostTags(postId: number): Promise<Array<{ id: number; slug: string; name: string }>> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_post_tags')
        .select('blog_tags(id, slug, name)')
        .eq('post_id', postId)

    if (error) {
        console.warn('[useBlogPosts] Erro tags do post:', error.message)
        return []
    }

    return (data ?? [])
        .map((item: any) => item.blog_tags)
        .filter(Boolean)
}

export async function fetchBlogPostCategoryIds(postId: number): Promise<number[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_post_categories')
        .select('category_id')
        .eq('post_id', postId)

    if (error) {
        console.warn('[useBlogPosts] Erro ids categorias:', error.message)
        return []
    }

    return (data ?? []).map((item: any) => item.category_id)
}

export async function fetchBlogPostTagIds(postId: number): Promise<number[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_post_tags')
        .select('tag_id')
        .eq('post_id', postId)

    if (error) {
        console.warn('[useBlogPosts] Erro ids tags:', error.message)
        return []
    }

    return (data ?? []).map((item: any) => item.tag_id)
}

async function syncPostCategories(postId: number, categoryIds: number[]): Promise<string | null> {
    const supabase = useSupabase()
    if (!supabase) return 'Supabase não configurado'

    const { error: deleteError } = await supabase.from('blog_post_categories').delete().eq('post_id', postId)
    if (deleteError) return deleteError.message

    if (!categoryIds.length) return null

    const payload = categoryIds.map((category_id) => ({ post_id: postId, category_id }))
    const { error: insertError } = await supabase.from('blog_post_categories').insert(payload)
    return insertError?.message ?? null
}

async function syncPostTags(postId: number, tagIds: number[]): Promise<string | null> {
    const supabase = useSupabase()
    if (!supabase) return 'Supabase não configurado'

    const { error: deleteError } = await supabase.from('blog_post_tags').delete().eq('post_id', postId)
    if (deleteError) return deleteError.message

    if (!tagIds.length) return null

    const payload = tagIds.map((tag_id) => ({ post_id: postId, tag_id }))
    const { error: insertError } = await supabase.from('blog_post_tags').insert(payload)
    return insertError?.message ?? null
}

function normalizePostInput(input: BlogPostInput): Omit<BlogPostInput, 'slug'> & { slug: string } {
    const contentHtml = input.content_html?.trim() || ''
    const contentMarkdown = input.content_markdown?.trim() || null
    const resolvedHtml = contentHtml || (contentMarkdown ? (marked.parse(contentMarkdown, { async: false }) as string) : '<p></p>')

    return {
        ...input,
        slug: normalizeBlogSlug(input.slug),
        title: input.title.trim(),
        excerpt: input.excerpt.trim(),
        content_markdown: contentMarkdown,
        content_html: resolvedHtml,
        reading_time: input.reading_time ?? estimateReadingTime(resolvedHtml),
        seo_title: input.seo_title?.trim() || input.title.trim(),
        seo_description: input.seo_description?.trim() || input.excerpt.trim(),
        canonical_url: input.canonical_url?.trim() || null,
        cover_image: input.cover_image?.trim() || null,
        cover_alt: input.cover_alt?.trim() || null,
        focus_keyword: input.focus_keyword?.trim() || null,
        og_image: input.og_image?.trim() || null,
        author_name: input.author_name?.trim() || 'Vale Apps',
        status: input.status ?? 'draft',
        noindex: !!input.noindex,
    }
}

export async function fetchBlogPostsAdmin(options?: {
    status?: BlogStatus | 'all'
    search?: string
}): Promise<BlogPostAdminListItem[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    let query = supabase
        .from('blog_posts')
        .select('id, title, slug, status, updated_at, published_at, scheduled_at, noindex')
        .order('updated_at', { ascending: false })

    if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status)
    }

    if (options?.search?.trim()) {
        const term = options.search.trim()
        query = query.or(`title.ilike.%${term}%,slug.ilike.%${term}%`)
    }

    const { data, error } = await query

    if (error) {
        console.warn('[useBlogPosts] Erro lista admin:', error.message)
        return []
    }

    return (data ?? []) as BlogPostAdminListItem[]
}

export async function fetchBlogPostById(id: number): Promise<BlogPost | null> {
    const supabase = useSupabase()
    if (!supabase) return null

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        console.warn('[useBlogPosts] Erro post por id:', error.message)
        return null
    }

    return data as BlogPost | null
}

export async function createBlogPost(
    input: BlogPostInput,
    relations?: { categoryIds?: number[]; tagIds?: number[] }
): Promise<{ data: BlogPost | null; error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { data: null, error: 'Supabase não configurado' }

    const normalized = normalizePostInput(input)

    let publishedAt = normalized.published_at ?? null
    let scheduledAt = normalized.scheduled_at ?? null

    if (normalized.status === 'published' && !publishedAt) {
        publishedAt = nowIso()
    }

    if (normalized.status !== 'scheduled') {
        scheduledAt = null
    }

    const { data, error } = await supabase
        .from('blog_posts')
        .insert({
            ...normalized,
            published_at: publishedAt,
            scheduled_at: scheduledAt,
        })
        .select('*')
        .single()

    if (error) return { data: null, error: error.message }

    const post = data as BlogPost

    if (relations?.categoryIds) {
        const relationError = await syncPostCategories(post.id, relations.categoryIds)
        if (relationError) return { data: post, error: relationError }
    }

    if (relations?.tagIds) {
        const relationError = await syncPostTags(post.id, relations.tagIds)
        if (relationError) return { data: post, error: relationError }
    }

    return { data: post, error: null }
}

export async function updateBlogPost(
    id: number,
    input: Partial<BlogPostInput>,
    relations?: { categoryIds?: number[]; tagIds?: number[] }
): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const current = await fetchBlogPostById(id)
    if (!current) return { error: 'Post não encontrado' }

    const merged: BlogPostInput = {
        slug: input.slug ?? current.slug,
        title: input.title ?? current.title,
        excerpt: input.excerpt ?? current.excerpt,
        content_markdown: input.content_markdown ?? current.content_markdown,
        content_html: input.content_html ?? current.content_html,
        status: input.status ?? current.status,
        published_at: input.published_at ?? current.published_at,
        scheduled_at: input.scheduled_at ?? current.scheduled_at,
        author_name: input.author_name ?? current.author_name,
        cover_image: input.cover_image ?? current.cover_image,
        cover_alt: input.cover_alt ?? current.cover_alt,
        reading_time: input.reading_time ?? current.reading_time,
        canonical_url: input.canonical_url ?? current.canonical_url,
        seo_title: input.seo_title ?? current.seo_title,
        seo_description: input.seo_description ?? current.seo_description,
        focus_keyword: input.focus_keyword ?? current.focus_keyword,
        og_image: input.og_image ?? current.og_image,
        noindex: input.noindex ?? current.noindex,
    }

    const normalized = normalizePostInput(merged)

    let publishedAt = normalized.published_at ?? null
    let scheduledAt = normalized.scheduled_at ?? null

    if (normalized.status === 'published' && !publishedAt) {
        publishedAt = nowIso()
    }

    if (normalized.status !== 'scheduled') {
        scheduledAt = null
    }

    const { error } = await supabase
        .from('blog_posts')
        .update({
            ...normalized,
            published_at: publishedAt,
            scheduled_at: scheduledAt,
        })
        .eq('id', id)

    if (error) return { error: error.message }

    if (relations?.categoryIds) {
        const relationError = await syncPostCategories(id, relations.categoryIds)
        if (relationError) return { error: relationError }
    }

    if (relations?.tagIds) {
        const relationError = await syncPostTags(id, relations.tagIds)
        if (relationError) return { error: relationError }
    }

    return { error: null }
}

export async function publishBlogPost(id: number): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'published', published_at: nowIso(), scheduled_at: null })
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function scheduleBlogPost(id: number, isoDate: string): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'scheduled', scheduled_at: isoDate })
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function unpublishBlogPost(id: number): Promise<{ error: string | null }> {
    const supabase = useSupabase()
    if (!supabase) return { error: 'Supabase não configurado' }

    const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'draft', published_at: null, scheduled_at: null })
        .eq('id', id)

    return { error: error?.message ?? null }
}

export async function fetchPublicBlogPosts(options?: {
    page?: number
    pageSize?: number
    categorySlug?: string
    tagSlug?: string
}): Promise<BlogPostsPublicResult> {
    const supabase = useSupabase()
    if (!supabase) return { posts: [], total: 0 }

    const page = Math.max(1, options?.page ?? 1)
    const pageSize = Math.min(24, Math.max(1, options?.pageSize ?? 9))

    let allowedIds: number[] | null = null

    if (options?.categorySlug) {
        const { data } = await supabase
            .from('blog_post_categories')
            .select('post_id, blog_categories!inner(slug)')
            .eq('blog_categories.slug', options.categorySlug)

        allowedIds = (data ?? []).map((item: any) => item.post_id)
    }

    if (options?.tagSlug) {
        const { data } = await supabase
            .from('blog_post_tags')
            .select('post_id, blog_tags!inner(slug)')
            .eq('blog_tags.slug', options.tagSlug)

        const tagIds = (data ?? []).map((item: any) => item.post_id)
        allowedIds = allowedIds ? allowedIds.filter((id) => tagIds.includes(id)) : tagIds
    }

    if (allowedIds && allowedIds.length === 0) {
        return { posts: [], total: 0 }
    }

    let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .eq('noindex', false)
        .lte('published_at', nowIso())
        .order('published_at', { ascending: false, nullsFirst: false })

    if (allowedIds) {
        query = query.in('id', allowedIds)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
        console.warn('[useBlogPosts] Erro posts públicos:', error.message)
        return { posts: [], total: 0 }
    }

    const basePosts = (data ?? []) as BlogPost[]
    const posts = await Promise.all(
        basePosts.map(async (post) => {
            const [categories, tags] = await Promise.all([
                fetchPostCategories(post.id),
                fetchPostTags(post.id),
            ])
            return { ...post, categories, tags }
        })
    )

    return {
        posts,
        total: count ?? 0,
    }
}

export async function fetchPublicBlogPostBySlug(slug: string): Promise<BlogPostPublicView | null> {
    const supabase = useSupabase()
    if (!supabase) return null

    const normalizedSlug = normalizeBlogSlug(slug)

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', normalizedSlug)
        .eq('status', 'published')
        .eq('noindex', false)
        .lte('published_at', nowIso())
        .maybeSingle()

    if (error || !data) {
        if (error) console.warn('[useBlogPosts] Erro post público por slug:', error.message)
        return null
    }

    const post = data as BlogPost
    const [categories, tags] = await Promise.all([
        fetchPostCategories(post.id),
        fetchPostTags(post.id),
    ])

    return {
        ...post,
        categories,
        tags,
    }
}

export async function fetchRelatedBlogPosts(
    currentPostId: number,
    limit = 3
): Promise<BlogPost[]> {
    const supabase = useSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('noindex', false)
        .lte('published_at', nowIso())
        .neq('id', currentPostId)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit)

    if (error) {
        console.warn('[useBlogPosts] Erro posts relacionados:', error.message)
        return []
    }

    return (data ?? []) as BlogPost[]
}
