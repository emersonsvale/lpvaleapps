import { readFileSync, writeFileSync } from 'fs'

const fullSQL = readFileSync('./scripts/generated-blog-insert.sql', 'utf-8')

// Dividir por INSERT INTO
const inserts = fullSQL
    .split(/(?=INSERT INTO blog_posts)/)
    .filter(s => s.trim().startsWith('INSERT'))

inserts.forEach((insert, index) => {
    const num = index + 1
    const content = `-- Artigo ${num} sobre Lovable e Vibe Coding\n\n${insert}`
    writeFileSync(`./scripts/generated-blog-insert-${num}.sql`, content)
    console.log(`✅ Criado: generated-blog-insert-${num}.sql`)
})

console.log(`\n✨ ${inserts.length} arquivos SQL criados!`)
