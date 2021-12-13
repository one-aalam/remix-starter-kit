import { ActionFunction, redirect } from "remix";
import { supabase } from '../lib/supabase/supabase.server'
import { supabaseToken } from '../cookies'
import { getToken } from '../lib/auth'


export let action: ActionFunction = async ({ request }) => {
    const token = await getToken(request)
    const { error } = await supabase.auth.api.signOut(token!)
    return redirect('/auth', {
        headers: {
            "Set-Cookie": await supabaseToken.serialize('', { maxAge: 0 })
        }
    })
}
