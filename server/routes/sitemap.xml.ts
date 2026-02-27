import { useSupabaseServer } from '../utils/supabase'

export default defineEventHandler(async (event) => {
    setHeader(event, 'content-type', 'application/xml')

    const baseUrl = 'https://valeapps.com.br'
    const currentDate = new Date().toISOString().split('T')[0]
    const supabase = useSupabaseServer()

    const urls = [
        {
            loc: baseUrl,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '1.0'
        },
        {
            loc: `${baseUrl}/blog`,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: '0.8'
        },
        {
            loc: `${baseUrl}/politica-privacidade`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.3'
        },
        {
            loc: `${baseUrl}/termos-servicos`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.3'
        }
    ]

    if (supabase) {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('slug, updated_at, published_at')
            .eq('status', 'published')
            .eq('noindex', false)
            .order('published_at', { ascending: false, nullsFirst: false })

        if (!error && data?.length) {
            const now = new Date()
            for (const post of data) {
                if (!post.slug) continue
                if (post.published_at && new Date(post.published_at) > now) continue

                urls.push({
                    loc: `${baseUrl}/blog/${post.slug}`,
                    lastmod: (post.updated_at || post.published_at || currentDate).split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.7'
                })
            }
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemap
})