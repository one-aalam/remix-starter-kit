import { PropsWithChildren, ReactElement } from "react";
import type { User } from '@supabase/supabase-js'
import { Form, useTransition } from 'remix'

type AppHeaderProps = {
    user?: User
}

function AppHeader({ user }: PropsWithChildren<AppHeaderProps>): ReactElement {
    const transition = useTransition()
    return (
        <nav className="w-full py-3 bg-blue-50 shadow-md ">
            <div className="container flex justify-end place-content-end">
                <ul className="list-none flex gap-4 text-center">
                    <li className="flex gap-2">
                    {transition.state === 'submitting' ?? <em>signing out, </em>}{ user?.email }{transition.state === 'submitting' ?? <em>...</em>} &nbsp;
                        <Form method="post" action="/signout">
                            <button type="submit" className="px-4 py-1 rounded-md bg-cyan-500 text-white shadow-lg shadow-cyan-500/50" disabled={transition.state === 'submitting'}>Sign Out</button>
                        </Form>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default AppHeader
