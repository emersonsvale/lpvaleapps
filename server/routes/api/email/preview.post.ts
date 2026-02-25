/**
 * POST /api/email/preview
 * Gera preview HTML de um template com dados de teste.
 * Nao envia o email, apenas retorna o HTML renderizado.
 */

import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        await requireAuth(event)
        const body = await readBody(event)

        // Validar request
        if (!body.templateId && !body.templateSlug && !body.conteudo_html) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Template ID, slug ou conteudo HTML e obrigatorio',
            })
        }

        const supabase = useSupabaseServer()
        if (!supabase) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Supabase nao esta configurado',
            })
        }
        let template: any = null
        let conteudoHtml = body.conteudo_html || ''
        let assunto = body.assunto || ''

        // Se tem template ID ou slug, buscar do BD
        if (body.templateId || body.templateSlug) {
            const coluna = body.templateId ? 'id' : 'slug'
            const valor = body.templateId || body.templateSlug

            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .eq(coluna, valor)
                .single()

            if (error) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Template nao encontrado',
                })
            }

            template = data
            conteudoHtml = template.conteudo_html
            assunto = template.assunto
        }

        // Interpolacao de variaveis
        const variaveis = body.variaveis || {}

        const interpolarVariaveis = (texto: string) => {
            if (!texto) return texto

            let resultado = texto
            Object.entries(variaveis).forEach(([chave, valor]) => {
                const regex = new RegExp(`{{\\s*${chave}\\s*}}`, 'g')
                resultado = resultado.replace(regex, String(valor || ''))
            })
            return resultado
        }

        const htmlRenderizado = interpolarVariaveis(conteudoHtml)
        const assuntoRenderizado = interpolarVariaveis(assunto)

        return {
            sucesso: true,
            preview: {
                assunto: assuntoRenderizado,
                html: htmlRenderizado,
                template: template ? {
                    id: template.id,
                    nome: template.nome,
                    tipo: template.tipo,
                    variaveis_suportadas: template.variaveis_suportadas,
                } : null,
            },
        }
    }
    catch (erro: any) {
        console.error('[/api/email/preview POST] Erro:', erro)

        throw createError({
            statusCode: 500,
            statusMessage: erro.message || 'Erro ao gerar preview',
        })
    }
})
