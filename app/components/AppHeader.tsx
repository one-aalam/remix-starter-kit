import { PropsWithChildren, ReactElement } from "react";
import type { User } from '@supabase/supabase-js'
import { Form } from 'remix'

import Button from './Button'

type AppHeaderProps = {
    user?: User
}

function AppHeader({ user }: PropsWithChildren<AppHeaderProps>): ReactElement {
    return (
        <nav className="w-full py-3 bg-blue-50 shadow-md ">
            <div className="container flex justify-end place-content-end">
                <ul className="list-none flex gap-4 text-center">
                    <li className="flex gap-2">
                        { user?.email } &nbsp;
                        <Form method="post" action="/signout">
                            <Button type="submit" size='xs' variant="secondary">Sign Out</Button>
                        </Form>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default AppHeader
