/**
 * DELETE /api/email/templates
 * Exclui um template de email.
 * Requer autenticacao.
 */

import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)
    const body = await readBody(event)

    if (!body?.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do template e obrigatorio',
        })
    }

    try {
        const supabase = useSupabaseServer()

        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        // Remove blocos vinculados antes de excluir o template.
        const { error: blocosError } = await supabase
            .from('email_blocks')
            .delete()
            .eq('template_id', body.id)

        if (blocosError) {
            throw new Error(`Erro ao excluir blocos do template: ${blocosError.message}`)
        }

        const { error: templateError } = await supabase
            .from('email_templates')
            .delete()
            .eq('id', body.id)

        if (templateError) {
            throw new Error(`Erro ao excluir template: ${templateError.message}`)
        }

        return {
            sucesso: true,
            mensagem: 'Template excluido com sucesso',
            excluido_por: user.id,
        }
    }
    catch (erro: any) {
        console.error('[/api/email/templates DELETE] Erro:', erro)

        throw createError({
            statusCode: 500,
            statusMessage: erro.message || 'Erro ao excluir template',
        })
    }
})
