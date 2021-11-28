import { PropsWithChildren, ReactElement } from "react";

function SiteLayout({ children }: PropsWithChildren<{}>): ReactElement {
    return (
        <div className="remix-app">
            <header className="remix-app__header">
                {/* Header content goes here..HeaderContent? */}
            </header>
            <div className="remix-app__main">
                <div className="container mx-auto remix-app__main-content">{children}</div>
            </div>
            <footer className="remix-app__footer">
                {/* Footer content goes here..FooterContent? */}
            </footer>
        </div>
    )
}

export default SiteLayout;
