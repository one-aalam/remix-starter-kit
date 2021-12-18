import { LoaderFunction, redirect, useLoaderData, useActionData, Form, useTransition, ActionFunction, json, Link, unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "remix"
import { User } from '@supabase/supabase-js'
import { supabase } from '~/lib/supabase/supabase.server'
import { isAuthenticated, getUserByRequestToken } from "~/lib/auth"
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
    return { profile , user, error, profileId: params.id }
}

let uploadHandler = unstable_createFileUploadHandler({
    directory: "public/uploads",
    maxFileSize: 5_000_000,
    file: ({ filename }) => filename
});


export let action: ActionFunction = async ({ request }) => {
    const { user } = await getUserByRequestToken(request)
    let form = await unstable_parseMultipartFormData(
        request,
        uploadHandler
    );

    // const form = await request.formData()
    const file = form.get('avatar')
    const username = form.get('username')
    const website = form.get('website')
    console.log(file)
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
    const { profile, user, profileId } = useLoaderData<{ profile:ProfileAttrs, user?: User, profileId: string }>()
    const errors = useActionData<ProfileAttrs>()

    return (
        <AppLayout user={user}>
            <div className="flex flex-col justify-center items-center relative">
                <div className="py-8 flex flex-col place-items-center">
                    <div>
                        <div className="text-purple-600 pb-4 text-2xl border-b mb-4 uppercase text-center">Profile Details</div>
                        <small className="h-4 inline-block text-gray-500">This page demonstrates the currently unstable Remix multi-part/form support. For the stable approach go to <Link to={`/profile/${profileId}/edit`}>profile</Link> page. </small>
                        <Form className="w-full px-10 py-8" method="post" encType="multipart/form-data">
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
                                <div className="w-full mb-6 text-center">
                                    <div className="flex flex-col gap-3 items-center space-x-6">
                                        <label className="block" htmlFor="avatar">
                                            <span className="sr-only">Choose profile photo</span>
                                            <input type="file" name="avatar" className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                            " accept="image/*" />
                                        </label>
                                    </div>
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
