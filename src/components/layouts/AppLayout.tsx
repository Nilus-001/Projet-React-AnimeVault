import type { ReactNode } from "react";
import AppHeader from "./AppHeader.tsx";
import AppFooter from "./AppFooter.tsx";

function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral">
            <a
                href="#main-content"
                className="sr-only rounded-lg bg-primary-soft px-4 py-2 font-semibold text-on-primary-soft focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
                Skip to content
            </a>
            <AppHeader />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}

export default AppLayout;
