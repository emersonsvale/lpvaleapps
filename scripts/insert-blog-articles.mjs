import { readFileSync } from 'fs'
import { marked } from 'marked'

// Configurar marked
marked.setOptions({
    breaks: true,
    gfm: true,
})

function parseArticleFile(filePath) {
    const content = readFileSync(filePath, 'utf-8')

    // Extrair metadados (entre as linhas ---), compatível com Windows/Unix line endings
    const metadataMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
    if (!metadataMatch) {
        throw new Error('Formato de arquivo inválido')
    }

    const metadataText = metadataMatch[1]
    const markdownContent = metadataMatch[2].trim()

    // Parse dos metadados
    const metadata = {}
    metadataText.split(/\r?\n/).forEach(line => {
        line = line.trim()
        if (!line) return

        const match = line.match(/^([A-ZÀ-ÚÇ_]+):\s*(.+)$/)
        if (match) {
            let key = match[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            metadata[key] = match[2].trim()
        }
    })

    return {
        slug: metadata.slug,
        title: metadata.titulo,
        excerpt: metadata.excerpt,
        content_markdown: markdownContent,
        author_name: metadata.author,
        cover_image: metadata.cover_image,
        cover_alt: metadata.cover_alt,
        reading_time: parseInt(metadata.reading_time),
        seo_title: metadata.seo_title,
        seo_description: metadata.seo_description,
        focus_keyword: metadata.focus_keyword,
    }
}

async function generateSQL(articleData) {
    // Converter markdown para HTML
    const contentHtml = await marked.parse(articleData.content_markdown)

    // Escapar aspas simples para SQL
    const escape = (str) => str ? str.replace(/'/g, "''") : ''

    return `INSERT INTO blog_posts (
    slug,
    title,
    excerpt,
    content_markdown,
    content_html,
    status,
    published_at,
    author_name,
    cover_image,
    cover_alt,
    reading_time,
    seo_title,
    seo_description,
    focus_keyword,
    noindex,
    created_at,
    updated_at
) VALUES (
    '${escape(articleData.slug)}',
    '${escape(articleData.title)}',
    '${escape(articleData.excerpt)}',
    '${escape(articleData.content_markdown)}',
    '${escape(contentHtml)}',
    'published',
    NOW(),
    '${escape(articleData.author_name)}',
    '${escape(articleData.cover_image)}',
    '${escape(articleData.cover_alt)}',
    ${articleData.reading_time},
    '${escape(articleData.seo_title)}',
    '${escape(articleData.seo_description)}',
    '${escape(articleData.focus_keyword)}',
    false,
    NOW(),
    NOW()
);`
}

async function main() {
    console.log('🚀 Gerando SQLs para os artigos...\n')

    const articles = [
        { file: './scripts/artigos/01-comecei-meu-saas-com-lovable.md', num: 1 },
        { file: './scripts/artigos/02-limitacoes-vibe-coding-quando-contratar.md', num: 2 },
        { file: './scripts/artigos/03-de-lovable-para-producao.md', num: 3 },
    ]

    const allSQLs = []

    for (const { file, num } of articles) {
        try {
            console.log(`📄 Processando: ${file}`)
            const articleData = parseArticleFile(file)
            const sql = await generateSQL(articleData)
            allSQLs.push(sql)
            console.log(`✅ ${articleData.title}`)
            console.log('')
        } catch (error) {
            console.error(`❌ Erro ao processar ${file}:`, error.message)
            console.log('')
        }
    }

    // Salvar arquivo SQL
    const { writeFileSync } = await import('fs')
    const fullSQL = `-- Artigos sobre Lovable e Vibe Coding
-- Gerado automaticamente em ${new Date().toISOString()}

${allSQLs.join('\n\n')}
`

    writeFileSync('./scripts/generated-blog-insert.sql', fullSQL)
    console.log(`\n✨ SQL gerado com sucesso em: ./scripts/generated-blog-insert.sql`)
    console.log(`\nAgora você pode executar este SQL no Supabase.`)
}

main().catch(console.error)
