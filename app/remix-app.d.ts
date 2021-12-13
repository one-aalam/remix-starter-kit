import type { SupabaseScript } from './lib/supabase'

declare global {
    interface Window {
        ENV: {
            SUPABASE_URL: string,
            SUPABASE_KEY: string

        },
        supabase?: SupabaseScript;
    }
}

export {}
