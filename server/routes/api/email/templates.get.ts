/**
 * GET /api/email/templates
 * Lista templates de email disponiveis.
 * Usuarios autenticados veem todos os templates.
 */

import { requireAuth } from '~~/server/utils/auth'
import { useSupabaseServer } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
    try {
        await requireAuth(event)
        const supabase = useSupabaseServer()

        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        let query = supabase.from('email_templates').select('*')

        query = query.order('tipo', { ascending: true }).order('nome', { ascending: true })

        const { data, error } = await query

        if (error) {
            throw new Error(`Erro ao buscar templates: ${error.message}`)
        }

        return {
            sucesso: true,
            templates: data || [],
            total: data?.length || 0,
        }
    }
    catch (erro: any) {
        console.error('[/api/email/templates GET] Erro:', erro)

        if (erro?.statusCode) {
            throw erro
        }

        throw createError({
            statusCode: 500,
            statusMessage: erro.message || 'Erro ao buscar templates',
        })
    }
})
