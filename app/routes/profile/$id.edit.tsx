import { useState } from 'react'
import { LoaderFunction, redirect, useLoaderData, useActionData, Form, useTransition, ActionFunction, json } from "remix"
import { User } from '@supabase/supabase-js'
import { supabase } from '~/lib/supabase/supabase.server'
import { isAuthenticated, getUserByRequestToken } from "~/lib/auth"
import { getSupabaseClient } from '~/lib/supabase/supabase.client'
import AppLayout from '~/components/AppLayout'

type ProfileAttrs = {
    username?: string,
    website?: string,
    avatar_url?:string,
}

export let loader: LoaderFunction = async ({ request, params }) => {
    if (!(await isAuthenticated(request))) return redirect('/auth')
    const { user } = await getUserByRequestToken(request)
    const { data: profile , error } = await supabase.from('profiles').select(`username, website, avatar_url`).eq('id', params.id).single()
    if (!profile) throw new Response("Not Found", {
        status: 404
    });
    return { profile , user, error }
}

export let action: ActionFunction = async ({ request }) => {
    const { user } = await getUserByRequestToken(request)
    const form = await request.formData()
    const username = form.get('username')
    const website = form.get('website')
    let errors: Omit<ProfileAttrs, 'avatar_url'> & { service?: Array<string>}= {}


    if (typeof username !== 'string' || username.length < 3) { // BYOV - Bring your own validation
        errors.username = 'fill-in a valid username!'
    }

    if (typeof website !== 'string' || website.length < 3) { // BYOV - Bring your own validation
        errors.website = 'fill-in a valid website!'
    }

    if (Object.keys(errors).length) {
        return json(errors, { status: 422 });
    }

    try {
        const { error } = await supabase.from('profiles').upsert({ username,  website, id: user.id , updated_at: new Date()})
        if(error) {
            errors.service = [ error.message ]
        }
    } catch(error) {
        // @ts-ignore
        errors.service = [ error.message ]
    }

    if (Object.keys(errors).length) {
        return json(errors, { status: 422 });
    }

    return redirect('/profile')
}

export default function ProfileEdit() {
    const transition = useTransition()
    const { profile, user } = useLoaderData<{ profile:ProfileAttrs, user?: User }>()
    const errors = useActionData<ProfileAttrs>()
    const [ avatarUrl, setAvatarUrl ] = useState<string>(profile?.avatar_url || '')
    const [ avatarLoading, setAvatarLoading ] = useState<boolean>(false)

    async function handleFileChange(event: any) {
        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('You must select an image to upload.');
        }
        const supabaseClient = await getSupabaseClient()
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        setAvatarLoading(true)
        let resp = await supabaseClient?.storage.from('avatars').upload(filePath, file);
        if (resp?.error) { throw resp.error }

        await supabaseClient.from('profiles').upsert({ id: user?.id, avatar_url: filePath })
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
                <div className="py-8 flex flex-col place-items-center">
                    <div>
                        <div className="text-purple-600 pb-4 text-2xl border-b mb-4 uppercase text-center">Profile Picture</div>
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
                        <br/>
                        <div className="text-purple-600 pb-4 text-2xl border-b mb-4 uppercase text-center">Profile Details</div>
                        <Form className="w-full px-10 py-8" method="post">
                            <fieldset>
                                {/* <legend className="text-purple-600 pb-4 text-2xl border-b mb-4 uppercase">Profile Details</legend> */}
                                <div className="w-full mb-6">
                                    <label className="block uppercase font-semibold text-gray-600 text-base" htmlFor="username">Username</label>
                                    <input id="username" className="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none" name="username" type="text" required placeholder="your username" defaultValue={profile.username} />
                                    <div className="h-3 text-xs">{errors?.username && errors.username}</div>
                                </div>
                                <div className="w-full mb-6">
                                    <label className="block uppercase font-semibold text-gray-600 text-base" htmlFor="website">Website</label>
                                    <input id="website" className="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none" name="website" type="text" required placeholder="Your website." defaultValue={profile.website} />
                                    <div className="h-3 text-xs">{errors?.website && errors.website}</div>
                                </div>
                                <div className="w-full mb-6 flex flex-col justify-between place-items-center">
                                    <button type="submit" className={`btn btn-primary ${transition.state === 'submitting' && 'loading'}`} disabled={transition.state === 'submitting'}>Update Profile</button>
                                </div>
                            </fieldset>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>)
}
