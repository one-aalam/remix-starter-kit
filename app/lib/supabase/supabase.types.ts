import type { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseScript = {
    createClient: (supabaseUrl: string, supabaseKey: string) => SupabaseClient
}
