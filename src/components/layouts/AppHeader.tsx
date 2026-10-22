import { useEffect, useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import AppNavBar, { type NavItem } from "../cores/nav/AppNavBar.tsx";
import PageContainer from "../cores/container/PageContainer.tsx";
import AppIconButton from "../cores/buttons/AppIconButton.tsx";
import { focusRing } from "../../styles/ui.ts";

const NAV_ITEMS: NavItem[] = [
    { key: "home", label: "Home", href: "/" },
    { key: "catalogue", label: "Catalogue", href: "/catalogue" },
];

const MOBILE_NAV_ID = "mobile-navigation";

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    className={`flex shrink-0 flex-row items-center gap-3 rounded-lg ${focusRing}`}
                >
                    <img src={logo} alt="" className="h-10 w-10" />
                    <span className="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                        AnimeVault
                    </span>
                </Link>

                <AppNavBar items={NAV_ITEMS} className="hidden lg:block" />

                <div className="ml-auto flex items-center gap-1">
                    <AppIconButton icon="bell" label="Notifications" dot />

                    <AppIconButton
                        icon={isMenuOpen ? "close" : "menu"}
                        label={isMenuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls={MOBILE_NAV_ID}
                        className="lg:hidden"
                    />
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
