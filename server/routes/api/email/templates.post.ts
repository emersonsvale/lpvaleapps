/**
 * POST /api/email/templates
 * Criar ou atualizar um template de email.
 * Requer autenticacao de admin.
 */

import { requireAdmin, requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'
import { validarTemplate } from '~~/server/utils/emailValidator'

export default defineEventHandler(async (event) => {
    // Verificar autenticacao e admin
    const user = await requireAuth(event)
    await requireAdmin(event)

    const body = await readBody(event)

    // Validar template
    const validacao = validarTemplate(body)
    if (!validacao.valido) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validacao falhou',
            data: validacao.erros,
        })
    }

    try {
        const supabase = useSupabaseServer()

        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        const agora = new Date().toISOString()

        // Dados do template
        const dadosTemplate = {
            nome: body.nome,
            slug: body.slug,
            tipo: body.tipo,
            descricao: body.descricao || null,
            assunto: body.assunto,
            conteudo_html: body.conteudo_html,
            conteudo_texto: body.conteudo_texto || null,
            variaveis_suportadas: body.variaveis_suportadas || [],
            blocos: body.blocos || [],
            ativo: body.ativo !== false,
            atualizado_em: agora,
            atualizado_por: user.id,
        }

        let resultado

        if (body.id) {
            // Atualizar template existente
            const { data, error } = await supabase
                .from('email_templates')
                .update(dadosTemplate)
                .eq('id', body.id)
                .select('*')
                .single()

            if (error) {
                throw new Error(`Erro ao atualizar template: ${error.message}`)
            }

            resultado = data
        }
        else {
            // Criar novo template
            const { data, error } = await supabase
                .from('email_templates')
                .insert([
                    {
                        ...dadosTemplate,
                        criado_em: agora,
                        criado_por: user.id,
                        versao: 1,
                    },
                ])
                .select('*')
                .single()

            if (error) {
                // Verificar se e erro de slug duplicado
                if (error.message.includes('unique')) {
                    throw new Error('Slug do template ja existe. Use outro slug.')
                }
                throw new Error(`Erro ao criar template: ${error.message}`)
            }

            resultado = data
        }

        // Se ha blocos, salvar tambem
        if (body.blocos && body.blocos.length > 0) {
            // Deletar blocos antigos se e atualizacao
            if (body.id) {
                await supabase.from('email_blocks').delete().eq('template_id', resultado.id)
            }

            // Inserir novos blocos
            const blocos = body.blocos.map((bloco: any, index: number) => ({
                template_id: resultado.id,
                tipo: bloco.tipo,
                posicao: index,
                dados: bloco.dados || {},
                estilos: bloco.estilos || {},
            }))

            const { error: errorBlocos } = await supabase.from('email_blocks').insert(blocos)

            if (errorBlocos) {
                console.error('[/api/email/templates POST] Erro ao salvar blocos:', errorBlocos)
            }
        }

        return {
            sucesso: true,
            template: resultado,
            mensagem: body.id ? 'Template atualizado com sucesso' : 'Template criado com sucesso',
        }
    }
    catch (erro: any) {
        console.error('[/api/email/templates POST] Erro:', erro)

        throw createError({
            statusCode: 500,
            statusMessage: erro.message || 'Erro ao salvar template',
        })
    }
})
