import type { SupabaseClient} from '@supabase/supabase-js'

const getSupabaseClient = (token: string): SupabaseClient => {
    const { createClient } = window.supabase
    const client: SupabaseClient =  createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_KEY)
    client.auth.setAuth(token)
    return client
}

export { getSupabaseClient }
