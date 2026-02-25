/**
 * Utilitários de Supabase para server
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseServerInstance: SupabaseClient | null = null

/**
 * Cria ou retorna instância singleton de cliente Supabase para servidor
 * Usa credenciais de admin para operações no servidor
 */
export function useSupabaseServer(): SupabaseClient | null {
    if (supabaseServerInstance) {
        return supabaseServerInstance
    }

    const config = useRuntimeConfig()

    const supabaseUrl = config.public.supabaseUrl
    const supabaseAdminKey = config.supabaseAdminKey

    if (!supabaseUrl) {
        console.error('[useSupabaseServer] NUXT_PUBLIC_SUPABASE_URL não está configurada')
        return null
    }

    if (!supabaseAdminKey) {
        console.error('[useSupabaseServer] NUXT_SUPABASE_ADMIN_KEY não está configurada')
        return null
    }

    try {
        supabaseServerInstance = createClient(supabaseUrl, supabaseAdminKey, {
            auth: {
                persistSession: false,
            },
        })

        return supabaseServerInstance
    }
    catch (erro: any) {
        console.error('[useSupabaseServer] Erro ao criar cliente Supabase:', erro)
        return null
    }
}

/**
 * Reset da instância (útil para testes)
 */
export function resetSupabaseServerInstance(): void {
    supabaseServerInstance = null
}
