import { useEffect, useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import AppNavBar, { type NavItem } from "../cores/nav/AppNavBar.tsx";
import PageContainer from "../cores/container/PageContainer.tsx";

const NAV_ITEMS: NavItem[] = [
    { key: "home", label: "Home", href: "/" },
    { key: "catalogue", label: "Catalogue", href: "/catalogue" },
    // { key: "seasonal", label: "Seasonal & Airing", href: "/seasonal" },
    // { key: "detail", label: "Anime Detail", href: "/anime" },
    // { key: "vault", label: "My Vault", href: "/vault" },
];

const MOBILE_NAV_ID = "mobile-navigation";

const iconButton =
    "relative grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/70";

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close the mobile menu with Escape.
    useEffect(() => {
        if (!isMenuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMenuOpen]);

    return (
        <header className="border-b border-white/5 bg-neutral">
            <PageContainer className="flex items-center gap-6 py-3">
                <Link
                    to="/"
                    className="flex shrink-0 flex-row items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/70"
                >
                    <img src={logo} alt="" className="h-10 w-10" />
                    <span className="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                        AnimeVault
                    </span>
                </Link>

                <AppNavBar items={NAV_ITEMS} className="hidden lg:block" />

                <div className="ml-auto flex items-center gap-1">
                    <button type="button" aria-label="Notifications" className={iconButton}>
                        <svg
                            aria-hidden
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
                            <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
                        </svg>
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-400 ring-2 ring-neutral" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls={MOBILE_NAV_ID}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className={`${iconButton} lg:hidden`}
                    >
                        <svg
                            aria-hidden
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </PageContainer>

            {isMenuOpen && (
                <PageContainer className="pb-4 lg:hidden">
                    <AppNavBar
                        id={MOBILE_NAV_ID}
                        items={NAV_ITEMS}
                        orientation="vertical"
                        onNavigate={() => setIsMenuOpen(false)}
                    />
                </PageContainer>
            )}
        </header>
    );
}
