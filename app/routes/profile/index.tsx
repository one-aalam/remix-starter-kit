import { LoaderFunction, redirect, useLoaderData, Link, useCatch } from "remix"
import { User } from '@supabase/supabase-js'
import { supabase } from '~/lib/supabase/supabase.server'
import { isAuthenticated, getUserByRequestToken } from "~/lib/auth"
import AppLayout from '~/components/AppLayout'

type ProfileAttrs = {
    username?: string,
    website?: string,
    avatar_url?:string,
}

export let loader: LoaderFunction = async ({ request }) => {
    if (!(await isAuthenticated(request))) return redirect('/auth')
    const { user } = await getUserByRequestToken(request)
    const { data: profile , error } = await supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single()
    if (!profile) throw new Response(user.id, {
        status: 404,
    });
    return { profile , user, error }
}

export default function Profile() {
    const { profile, user } = useLoaderData<{ profile:ProfileAttrs, user?: User }>()

    return (
        <AppLayout user={user}>
            <div className="flex flex-col justify-center items-center relative">
                <div className="py-8 flex flex-col place-items-center">
                    <div>
                        {profile?.avatar_url && <div className="mt-2 text-center">
                            <div className="flex flex-col gap-3 items-center space-x-6">
                                <div className="shrink-0">
                                    <img className="w-36 h-36 object-cover rounded-full shadow-lg" src={`/images/avatars/${profile.avatar_url}`} alt={profile?.username} />
                                </div>
                            </div>
                        </div> }
                        <div className="profile-detail my-4 flex flex-col place-items-center">
                            <h2 className="text-4xl mb-1">Howdie, { profile?.username || user?.email }!</h2>
                            { profile?.website && <span className="inline-block px-2 py-1 bg-gray-400 text-white rounded-full">{ profile?.website }</span>}
                            <br/>
                            <Link className="px-4 py-1 rounded-md text-white bg-indigo-500 shadow-lg shadow-indigo-500/50" to={`/profile/${user?.id}/edit`}>Update Profile Details</Link>
                        </div>
                    </div>
                </div>
                <div className="rounded-md bg-green-800 shadow-2xl shadow-green-500/50 w-3/5 overflow-hidden mt-4 text-center">
                    <h3 className="px-2 py-1 text-white">User from Supabase</h3>
                    <small className="bg-gray-800 text-white px-4 py-2 w-full inline-block">{JSON.stringify(user)}</small>
                </div>
            </div>
        </AppLayout>)
}

export function CatchBoundary() {
    const caught = useCatch()
    if(caught.status === 404) {
        return (
            <AppLayout user={undefined}>
                <div className="flex flex-col justify-center items-center relative">
                    <div className="py-8 flex flex-col place-items-center">
                        <h3 className="text-3xl text-purple-600">First login? You wanna update your profile details? 🙂</h3>
                        <br/>
                        <Link className="px-4 py-1 rounded-md text-white bg-indigo-500 shadow-lg shadow-indigo-500/50" to={`/profile/${caught.data}/edit`}>Update Profile Details</Link>
                    </div>
                </div>
            </AppLayout>
        )
    }
}

export function ErrorBoundary({ error }: { error: Error }) {
    return (
          <div>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <hr />
            <p>
              Hey, developer, you should replace this with what you want your
              users to see.
            </p>
          </div>
    );
  }
