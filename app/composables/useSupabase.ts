import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Cliente Supabase singleton. Use NUXT_PUBLIC_SUPABASE_URL e
 * NUXT_PUBLIC_SUPABASE_ANON_KEY no .env. Funciona em SSR e no browser.
 */
export function useSupabase(): SupabaseClient | null {
  if (client) return client

  const config = useRuntimeConfig().public
  const url = config.supabaseUrl as string
  const key = config.supabaseAnonKey as string

  if (!url || !key) return null

  client = createClient(url, key)
  return client
}
