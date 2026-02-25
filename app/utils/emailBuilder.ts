export interface EmailBlock {
    tipo: string
    dados?: Record<string, any>
    estilos?: Record<string, any>
}

const defaultWrapperStyle = 'max-width:600px;margin:0 auto;padding:20px;font-family:Arial, sans-serif;color:#111827;'

function styleToString(estilos?: Record<string, any>): string {
    if (!estilos) return ''
    return Object.entries(estilos)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
            const cssKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
            return `${cssKey}:${value}`
        })
        .join(';')
}

function renderBlock(block: EmailBlock): string {
    const dados = block.dados || {}
    const style = styleToString(block.estilos)

    switch (block.tipo) {
        case 'header':
            return `
        <div style="${style};padding:24px;background:#111827;color:#ffffff;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:24px;">${dados.titulo || 'Titulo'}</h1>
          ${dados.subtitulo ? `<p style=\"margin:8px 0 0;font-size:14px;\">${dados.subtitulo}</p>` : ''}
        </div>
      `
        case 'titulo':
            return `<h2 style="${style};font-size:20px;margin:16px 0;">${dados.texto || 'Titulo'}</h2>`
        case 'paragrafo':
            return `<p style="${style};font-size:14px;line-height:1.6;">${dados.texto || 'Paragrafo...'} </p>`
        case 'imagem':
            return `<img src="${dados.url || ''}" alt="${dados.alt || 'Imagem'}" style="${style};max-width:100%;height:auto;display:block;" />`
        case 'botao':
            return `
        <a href="${dados.link || '#'}" style="${style};display:inline-block;background:#6366f1;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
          ${dados.texto || 'Botao'}
        </a>
      `
        case 'divisor':
            return `<hr style="${style};border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />`
        case 'social':
            return `<div style="${style};font-size:12px;">${dados.texto || 'Redes sociais'}</div>`
        case 'footer':
            return `<div style="${style};font-size:12px;color:#6b7280;text-align:center;margin-top:24px;">${dados.texto || 'Rodape'}</div>`
        default:
            return ''
    }
}

export function blocksToHtml(blocks: EmailBlock[]): string {
    const body = blocks.map(renderBlock).join('\n')
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div style="${defaultWrapperStyle}">
    ${body}
  </div>
</body>
</html>`
}

export function normalizeVariables(input: string): string[] {
    if (!input) return []
    const raw = input
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

    return raw.map(item => {
        const clean = item.replace(/{{|}}/g, '').trim()
        return `{{ ${clean} }}`
    })
}
