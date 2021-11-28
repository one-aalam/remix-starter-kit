import { LoaderFunction, redirect, useLoaderData, Form, ActionFunction } from "remix"
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { isAuthenticated, getUserByRequestToken } from "~/lib/auth"
import AppLayout from '../components/AppLayout'

type ProfileAttrs = {
    username?: string,
    website?: string,
    avatar_url?:string,
}

export let loader: LoaderFunction = async ({ request }) => {
    if (!(await isAuthenticated(request))) return redirect('/auth')
    const { user } = await getUserByRequestToken(request)
    const { data: profile , error } = await supabase.from('profiles').select(`username, website, avatar_url`).single()
    return { profile , user, error }
}

export default function Profile() {
    const { profile, user } = useLoaderData<{ profile:ProfileAttrs, user?: User }>()
    return (
        <AppLayout user={user}>
            <div className="flex flex-col justify-center items-center relative">
                <div className="py-2 flex flex-col place-items-center">
                    <div>
                        <div className="mt-2 text-center">
                            <div className="avatar relative flex flex-col place-items-center">
                                <label className="mb-8 w-36 h-36 mask mask-hexagon shadow-lg bg-gray-200" htmlFor="single">
                                    <img src={`/images/avatars/${profile.avatar_url}`} alt={profile?.username} />
                                </label>
                            </div>
                        </div>
                        <div className="profile-detail my-4 flex flex-col place-items-center">
                            <h2 className="text-4xl mb-1">Howdie, { profile?.username }!</h2>
                            <span className="inline-block px-2 py-1 bg-gray-400 text-white rounded-full">{ profile?.website }</span>
                        </div>
                    </div>
                </div>
                <div className="rounded-md shadow-2xl bg-green-800 w-3/5 overflow-hidden mt-4 text-center">
                            <h3 className="px-2 py-1 text-white">User from Supabase</h3>
                            <small className="bg-gray-800 text-white px-4 py-2 w-full inline-block">{JSON.stringify(user)}</small>
                </div>
            </div>
        </AppLayout>)
}
