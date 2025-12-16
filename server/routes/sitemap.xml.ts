export default defineEventHandler(async (event) => {
    // Configurar headers para XML
    setHeader(event, 'content-type', 'application/xml')

    const baseUrl = 'https://valeapps.com.br'
    const currentDate = new Date().toISOString().split('T')[0]

    // URLs do site
    const urls = [
        {
            loc: baseUrl,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '1.0'
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
        },
        // Seções importantes da página principal
        {
            loc: `${baseUrl}/#inicio`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '0.9'
        },
        {
            loc: `${baseUrl}/#projetos`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '0.8'
        },
        {
            loc: `${baseUrl}/#servicos`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '0.8'
        },
        {
            loc: `${baseUrl}/#contato`,
            lastmod: currentDate,
            changefreq: 'weekly',
            priority: '0.7'
        }
    ]

    // Gerar XML do sitemap
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