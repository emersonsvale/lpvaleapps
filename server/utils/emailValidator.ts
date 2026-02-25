/**
 * Validacao de emails e templates.
 */

export interface ValidationError {
    campo: string
    mensagem: string
}

export interface ValidationResult {
    valido: boolean
    erros: ValidationError[]
}

/**
 * Valida se um email tem formato correto.
 */
export function validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

/**
 * Valida se um email e de um dominio descartavel/temporario.
 */
export function validarDominioEmail(email: string): boolean {
    const dominiosDescartaveis = [
        'tempmail.com',
        'throwaway.email',
        '10minutemail.com',
        'guerrillamail.com',
        'mailinator.com',
        'maildrop.cc',
        'trashmail.com',
    ]

    const dominio = email.split('@')[1]?.toLowerCase()
    return !dominiosDescartaveis.includes(dominio)
}

/**
 * Valida tipos de template permitidos.
 */
export const TIPOS_TEMPLATE_VALIDOS = [
    'boas_vindas',
    'proposta',
    'leads',
    'newsletter',
    'admin',
    'relatorio',
] as const

export type TipoTemplate = (typeof TIPOS_TEMPLATE_VALIDOS)[number]

export function validarTipoTemplate(tipo: string): boolean {
    return TIPOS_TEMPLATE_VALIDOS.includes(tipo as TipoTemplate)
}

/**
 * Valida status de email permitidos.
 */
export const STATUS_EMAIL_VALIDOS = ['pending', 'sending', 'sent', 'failed', 'bounced'] as const

export type StatusEmail = (typeof STATUS_EMAIL_VALIDOS)[number]

export function validarStatusEmail(status: string): boolean {
    return STATUS_EMAIL_VALIDOS.includes(status as StatusEmail)
}

/**
 * Valida um objeto de opcoes de envio de email.
 */
export function validarOpcoesSend(opcoes: any): ValidationResult {
    const erros: ValidationError[] = []

    // Validar email destinatario
    if (!opcoes.para) {
        erros.push({
            campo: 'para',
            mensagem: 'Email destinatario e obrigatorio',
        })
    }
    else if (!validarEmail(opcoes.para)) {
        erros.push({
            campo: 'para',
            mensagem: 'Email destinatario invalido',
        })
    }
    else if (!validarDominioEmail(opcoes.para)) {
        erros.push({
            campo: 'para',
            mensagem: 'Email com dominio temporario/descartavel nao e permitido',
        })
    }

    // Validar origem do conteudo:
    // - templateId/templateSlug, OU
    // - assunto + conteudo customizados
    const temTemplate = Boolean(opcoes.templateId || opcoes.templateSlug)
    const temConteudoCustomizado = Boolean(opcoes.assunto && opcoes.conteudo)

    if (!temTemplate && !temConteudoCustomizado) {
        erros.push({
            campo: 'template',
            mensagem: 'Informe template (ID/slug) ou assunto + conteudo para envio customizado',
        })
    }

    // Validar assunto se e customizado
    if (opcoes.assunto && typeof opcoes.assunto !== 'string') {
        erros.push({
            campo: 'assunto',
            mensagem: 'Assunto deve ser texto',
        })
    }

    // Validar variaveis (se fornecidas)
    if (opcoes.variaveis && typeof opcoes.variaveis !== 'object') {
        erros.push({
            campo: 'variaveis',
            mensagem: 'Variaveis deve ser um objeto',
        })
    }

    return {
        valido: erros.length === 0,
        erros,
    }
}

/**
 * Valida um template antes de salvar.
 */
export function validarTemplate(template: any): ValidationResult {
    const erros: ValidationError[] = []

    // Nome obrigatorio
    if (!template.nome || template.nome.trim().length === 0) {
        erros.push({
            campo: 'nome',
            mensagem: 'Nome do template e obrigatorio',
        })
    }
    else if (template.nome.length > 255) {
        erros.push({
            campo: 'nome',
            mensagem: 'Nome do template nao pode ter mais de 255 caracteres',
        })
    }

    // Slug obrigatorio
    if (!template.slug || template.slug.trim().length === 0) {
        erros.push({
            campo: 'slug',
            mensagem: 'Slug e obrigatorio',
        })
    }
    else if (!/^[a-z0-9-]+$/.test(template.slug)) {
        erros.push({
            campo: 'slug',
            mensagem: 'Slug nao pode conter espacos ou caracteres especiais (apenas a-z, 0-9, -)',
        })
    }

    // Tipo obrigatorio
    if (!validarTipoTemplate(template.tipo)) {
        erros.push({
            campo: 'tipo',
            mensagem: `Tipo invalido. Tipos permitidos: ${TIPOS_TEMPLATE_VALIDOS.join(', ')}`,
        })
    }

    // Assunto obrigatorio
    if (!template.assunto || template.assunto.trim().length === 0) {
        erros.push({
            campo: 'assunto',
            mensagem: 'Assunto e obrigatorio',
        })
    }

    // Content obrigatorio (HTML)
    if (!template.conteudo_html || template.conteudo_html.trim().length === 0) {
        erros.push({
            campo: 'conteudo_html',
            mensagem: 'Conteudo HTML e obrigatorio',
        })
    }

    // Variaveis deve ser array
    if (template.variaveis_suportadas && !Array.isArray(template.variaveis_suportadas)) {
        erros.push({
            campo: 'variaveis_suportadas',
            mensagem: 'Variaveis suportadas deve ser um array',
        })
    }

    return {
        valido: erros.length === 0,
        erros,
    }
}

/**
 * Valida dados de bloco para construtor visual.
 */
export function validarBloco(bloco: any): ValidationResult {
    const erros: ValidationError[] = []

    const tiposValidos = ['header', 'titulo', 'paragrafo', 'imagem', 'botao', 'divisor', 'social', 'footer']

    if (!bloco.tipo || !tiposValidos.includes(bloco.tipo)) {
        erros.push({
            campo: 'tipo',
            mensagem: `Tipo de bloco invalido. Tipos permitidos: ${tiposValidos.join(', ')}`,
        })
    }

    if (typeof bloco.posicao !== 'number' || bloco.posicao < 0) {
        erros.push({
            campo: 'posicao',
            mensagem: 'Posicao deve ser um numero nao-negativo',
        })
    }

    if (!bloco.dados || typeof bloco.dados !== 'object') {
        erros.push({
            campo: 'dados',
            mensagem: 'Dados do bloco e obrigatorio e deve ser um objeto',
        })
    }

    // Validacoes especificas por tipo
    if (bloco.tipo === 'titulo') {
        if (!bloco.dados.texto) {
            erros.push({
                campo: 'dados.texto',
                mensagem: 'Titulo deve ter texto',
            })
        }
    }

    if (bloco.tipo === 'paragrafo') {
        if (!bloco.dados.texto) {
            erros.push({
                campo: 'dados.texto',
                mensagem: 'Paragrafo deve ter texto',
            })
        }
    }

    if (bloco.tipo === 'imagem') {
        if (!bloco.dados.url) {
            erros.push({
                campo: 'dados.url',
                mensagem: 'Imagem deve ter URL',
            })
        }
        else if (!validarURL(bloco.dados.url)) {
            erros.push({
                campo: 'dados.url',
                mensagem: 'URL da imagem invalida',
            })
        }
    }

    if (bloco.tipo === 'botao') {
        if (!bloco.dados.texto) {
            erros.push({
                campo: 'dados.texto',
                mensagem: 'Botao deve ter texto',
            })
        }
        if (!bloco.dados.link || !validarURL(bloco.dados.link)) {
            erros.push({
                campo: 'dados.link',
                mensagem: 'Botao deve ter um link valido',
            })
        }
    }

    return {
        valido: erros.length === 0,
        erros,
    }
}

/**
 * Valida se uma URL e valida.
 */
export function validarURL(url: string): boolean {
    try {
        new URL(url)
        return true
    }
    catch {
        return false
    }
}

/**
 * Sanitiza HTML para evitar XSS.
 * Remove tags perigosas mas mantem estilos basicos.
 */
export function sanitizarHTML(html: string): string {
    // Lista de tags permitidas
    const TAGS_PERMITIDAS = [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'div',
        'span',
        'a',
        'img',
        'ul',
        'ol',
        'li',
        'table',
        'tr',
        'td',
        'th',
        'tbody',
        'thead',
        'tfoot',
        'blockquote',
        'pre',
        'code',
        'button',
    ]

    // Lista de atributos permitidos por tag
    const ATTRS_PERMITIDAS: {
        [key: string]: string[]
    } = {
        '*': ['class', 'style', 'id'],
        a: ['href', 'title', 'target'],
        img: ['src', 'alt', 'width', 'height'],
        button: ['type', 'onclick'],
    }

    // Remover scripts
    let resultado = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    resultado = resultado.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')

    return resultado
}

/**
 * Valida se todos os campos de variaveis necessarios foram preenchidos.
 */
export function validarVariaveisTemplate(
    variavelisNecessarias: string[],
    variaveisProvididas: Record<string, any>,
): ValidationResult {
    const erros: ValidationError[] = []

    for (const variavel of variavelisNecessarias) {
        // Extrair nome da variavel: "{{ nome }}" => "nome"
        const nomeVariavel = variavel.replace(/{{\\s*|\\s*}}/g, '').trim()

        if (!variaveisProvididas.hasOwnProperty(nomeVariavel)) {
            erros.push({
                campo: `variaveis.${nomeVariavel}`,
                mensagem: `Variavel obrigatoria nao fornecida: {{ ${nomeVariavel} }}`,
            })
        }
    }

    return {
        valido: erros.length === 0,
        erros,
    }
}
