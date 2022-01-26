import { ReactElement } from "react";

function StarterKit(): ReactElement {
    return (
        <article className="text-center mb-8">
            <h2 className="text-4xl font-semibold app__title">Remix Starter Kit</h2>
            <small className="inline-block border-1 bg-yellow-300 px-2"><strong>Remix</strong> with all the <em>bells</em> and <em>whistles</em>.</small>
        </article>
    )
}

export default StarterKit
