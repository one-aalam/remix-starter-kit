import type { SupabaseClient } from '@supabase/supabase-js'

declare global {
    interface Window {
        supabaseClient: SupabaseClient;
    }
}

export {}
