import type { User } from '@supabase/supabase-js'
import { supabaseToken } from '../cookies'
import { supabase } from './supabase/supabase.server'

export const getToken = async (request: any) : Promise<string | null> => {
    const cookieHeader = request.headers.get("Cookie");
    return (await supabaseToken.parse(cookieHeader));
}

export const isAuthenticated = async(request: any, validateAndReturnUser: boolean = false) : Promise<{ user: User | null} | any> => {
    const token = await getToken(request)
    if (!token && !validateAndReturnUser) return false
    if (validateAndReturnUser) {
        const { user, error } = await getUserByToken(token!)
        if(error) {
            return false
        }
        return { user }
    }
    return true
}

export const getUserByToken = async(token: string) : Promise<{ user: User | null} | any> => {
    supabase.auth.setAuth(token)
    const { user, error } = await supabase.auth.api.getUser(token)
    return { user, error }
}

// @ts-ignore
export const getUserByRequestToken = async(request: any) => await getUserByToken(await getToken(request))
