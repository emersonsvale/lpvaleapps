export const applyTemplateVariables = (text: string, vars: Record<string, unknown>) => {
    let result = text || ''
    Object.entries(vars).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
        result = result.replace(regex, String(value ?? ''))
    })
    return result
}

const escapeHtml = (text: string) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

const convertPlainTextTokensToHtml = (plainText: string) => {
    let html = escapeHtml(plainText)

    html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\[w:(400|500|600|700|800)\]([\s\S]+?)\[\/w\]/g, '<span style="font-weight: $1;">$2</span>')
    html = html.replace(/\[color:(#[0-9a-fA-F]{3,8})\]([\s\S]+?)\[\/color\]/g, '<span style="color: $1;">$2</span>')
    html = html.replace(/\[size:([1-9][0-9]?px)\]([\s\S]+?)\[\/size\]/g, '<span style="font-size: $1;">$2</span>')

    const trimmed = html.trim()
    if (!trimmed) {
        return '<p></p>'
    }

    // Keep a single text flow so span markers (color/size/weight) can cover multiple paragraphs.
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`
}

export const renderEmailContent = (source: string, vars: Record<string, unknown>) => {
    const interpolated = applyTemplateVariables(source || '', vars)

    if (!interpolated.trim()) {
        return '<p>Conteudo vazio</p>'
    }

    // Keep compatibility with older templates that were saved as raw HTML.
    const hasHtmlTag = /<\/?[a-z][\s\S]*>/i.test(interpolated)
    if (hasHtmlTag) {
        return interpolated
    }

    return convertPlainTextTokensToHtml(interpolated)
}
