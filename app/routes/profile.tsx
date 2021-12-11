import { useEffect, useRef, useState } from 'react'
import { LoaderFunction, redirect, useLoaderData, Form, ActionFunction, useFetcher, useTransition } from "remix"
import { User, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.server'
import { isAuthenticated, getUserByRequestToken } from "~/lib/auth"
import { getSupabaseClient } from "~/lib/supabase.client"
import AppLayout from '../components/AppLayout'

type ProfileAttrs = {
    username?: string,
    website?: string,
    avatar_url?:string,
}

export const handle = {
    // Need by Remix to load Supabase JS client-side from CDN. Use only for scenraios where it's absolutely necessary
    useSupabaseClient: () => true
};

export let loader: LoaderFunction = async ({ request }) => {
    if (!(await isAuthenticated(request))) return redirect('/auth')
    const { user } = await getUserByRequestToken(request)
    const { data: profile , error } = await supabase.from('profiles').select(`username, website, avatar_url`).single()
    return { profile , user, error }
}

export default function Profile() {
    const { profile, user } = useLoaderData<{ profile:ProfileAttrs, user?: User }>()
    const [ avatarUrl, setAvatarUrl ] = useState<string>(profile?.avatar_url || '')
    const [ avatarLoading, setAvatarLoading ] = useState<boolean>(false)
    const supa = useRef<SupabaseClient>()

    useEffect(() => {
        fetch('/config').then(res => res.json()).then(config => {
            if (config && config.supabaseToken) supa.current = getSupabaseClient(config.supabaseToken)
            // const { user  } = await supa.current?.auth.api.getUser(config.supabaseToken)
        })
        return () => {}
    }, [])

    async function handleFileChange(event: any) {
        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('You must select an image to upload.');
        }
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        setAvatarLoading(true)
        let resp = await supa.current?.storage.from('avatars').upload(filePath, file);
        if (resp?.error) { throw resp.error }

        await supa.current?.from('profiles').upsert({ id: user?.id, avatar_url: filePath })
        let downloadingImage = new Image();
        downloadingImage.onload = function () {
            setAvatarUrl(filePath)
            setAvatarLoading(false)
        };
        downloadingImage.src = `/images/avatars/${filePath}`
    }

    return (
        <AppLayout user={user}>
            <div className="flex flex-col justify-center items-center relative">
                <div className="py-2 flex flex-col place-items-center">
                    <div>
                        <div className="mt-2 text-center">
                            <div className="flex flex-col gap-3 items-center space-x-6">
                                <div className="shrink-0">
                                    <img className="w-36 h-36 object-cover rounded-full shadow-lg" src={`/images/avatars/${avatarUrl}`} alt={profile?.username} />
                                </div>
                                <label className="block" htmlFor="avatar-upload">
                                    <span className="sr-only">Choose profile photo</span>
                                    <input type="file" name="avatar-upload" className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-violet-50 file:text-violet-700
                                        hover:file:bg-violet-100
                                    " accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <small className="h-4 inline-block text-gray-500">{avatarLoading ? `updating...`: `choose an image file to update your profile pic`}</small>
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
