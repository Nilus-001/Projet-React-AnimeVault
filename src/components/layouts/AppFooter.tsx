import { Link } from "react-router";
import PageContainer from "../cores/container/PageContainer.tsx";

type FooterLink =
    | { label: string; to: string; external?: false }
    | { label: string; href: string; external: true };

const links: FooterLink[] = [
    { label: "Discord Community", href: "https://discord.gg/your-invite", external: true },
    { label: "Public API", href: "https://api.anivault.com/docs", external: true },
    { label: "Changelog", to: "/changelog" },
    { label: "Privacy & Terms", to: "/privacy" },
];

const CURRENT_YEAR = new Date().getFullYear();

const linkClass =
    "whitespace-nowrap text-sm font-bold text-on-surface transition-colors hover:text-white " +
    "focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-soft";

function AppFooter() {
    return (
        <footer className="w-full border-t border-outline bg-linear-to-b from-neutral to-neutral-deep">
            <PageContainer className="grid grid-cols-1 items-center gap-7 py-10 lg:grid-cols-[1.3fr_auto_1fr] lg:gap-10 lg:pb-10 lg:pt-14">
                <div>
                    <p className="mb-2 flex items-baseline gap-1.5 text-xl font-extrabold tracking-tight text-on-surface">
                        AnimeVault
                        <span className="font-mono text-[11px] font-medium text-on-surface-variant">v2.4.0</span>
                    </p>
                    <p className="max-w-105 text-sm leading-normal text-on-surface/85">
                        The hyper-focused digital sanctum for anime analysts, collectors, and seasonal trackers.
                        Curating archival motion art.
                    </p>
                </div>

                <nav aria-label="Footer">
                    <ul className="flex flex-wrap gap-x-6 gap-y-3.5">
                        {links.map((item) => (
                            <li key={item.label}>
                                {item.external ? (
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link to={item.to} className={linkClass}>
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <p className="text-sm text-on-surface-variant lg:text-right">
                    © {CURRENT_YEAR} AnimeVault. All rights reserved.
                </p>
            </PageContainer>
        </footer>
    );
}

export default AppFooter;
