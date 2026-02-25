/**
 * Utilitarios de autenticacao para server routes.
 */

import type { H3Event } from 'h3'
import { useSupabaseServer } from '~~/server/utils/supabase'

export interface AuthUser {
    id: string
    email: string
    user_metadata: Record<string, any>
}

/**
 * Requer que o usuario esteja autenticado.
 * Retorna o usuario autenticado ou lanca erro 401.
 */
export async function requireAuth(event: H3Event): Promise<AuthUser> {
    // Obter header de autorizacao
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Nao autenticado. Token Bearer obrigatorio.',
        })
    }

    const token = authHeader.slice(7)

    try {
        const supabase = useSupabaseServer()

        if (!supabase) {
            throw new Error('Supabase nao esta configurado')
        }

        // Verificar token com Supabase
        const { data, error } = await supabase.auth.getUser(token)

        if (error || !data.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Token invalido ou expirado',
            })
        }

        return {
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata || {},
        }
    }
    catch (erro: any) {
        if (erro.statusCode) {
            throw erro
        }

        throw createError({
            statusCode: 401,
            statusMessage: 'Erro ao validar autenticacao',
        })
    }
}

/**
 * Requer que o usuario seja admin.
 * Lanca erro 403 se nao for admin.
 */
export async function requireAdmin(event: H3Event): Promise<void> {
    const user = await requireAuth(event)

    if (user.user_metadata?.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado. Permissao de admin obrigatoria.',
        })
    }
}

/**
 * Obtem usuario autenticado ou retorna null se nao autenticado.
 */
export async function getAuthUserOptional(event: H3Event): Promise<AuthUser | null> {
    try {
        return await requireAuth(event)
    }
    catch {
        return null
    }
}

/**
 * Verifica se usuario tem uma permissao especifica.
 */
export function hasPermission(user: AuthUser, permissao: string): boolean {
    const permissoes = user.user_metadata?.permissoes || []
    return permissoes.includes(permissao) || user.user_metadata?.role === 'admin'
}
