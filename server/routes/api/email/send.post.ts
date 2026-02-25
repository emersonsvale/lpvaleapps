/**
 * POST /api/email/send
 * Envia um email via Resend
 * Requer autenticacao
 */

import { createEmailService } from '~~/server/utils/emailService'
import { requireAuth } from '~~/server/utils/auth'
import { validarOpcoesSend } from '~~/server/utils/emailValidator'

export default defineEventHandler(async (event) => {
    // Verificar autenticacao
    const user = await requireAuth(event)

    const body = await readBody(event)

    // Validar request
    const validacao = validarOpcoesSend(body)
    if (!validacao.valido) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validacao falhou',
            data: validacao.erros,
        })
    }

    try {
        // Instanciar servico de email
        const emailService = await createEmailService(event)

        // Enviar email
        const resultado = await emailService.sendEmail({
            templateId: body.templateId,
            templateSlug: body.templateSlug,
            para: body.para,
            paraNome: body.paraNome,
            assunto: body.assunto,
            conteudo: body.conteudo,
            variaveis: body.variaveis,
            usuarioId: user.id,
            metadados: body.metadados,
        })

        if (!resultado.success) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Erro ao enviar email',
                data: { erro: resultado.error },
            })
        }

        return {
            sucesso: true,
            logId: resultado.logId,
            messageId: resultado.messageId,
            mensagem: 'Email enviado com sucesso',
        }
    }
    catch (erro: any) {
        console.error('[/api/email/send] Erro:', erro)

        throw createError({
            statusCode: 500,
            statusMessage: erro.message || 'Erro ao enviar email',
        })
    }
})
