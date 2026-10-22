import { NavLink } from "react-router";
import { focusRing } from "../../../styles/ui.ts";

export type NavItem = {
    key: string;
    label: string;
    href: string;
};

type AppNavBarProps = {
    items?: NavItem[];
    orientation?: "horizontal" | "vertical";
    className?: string;
    id?: string;
    onNavigate?: () => void;
};

const base = `whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${focusRing}`;

export default function AppNavBar({
    items = [],
    orientation = "horizontal",
    className = "",
    id,
    onNavigate,
}: AppNavBarProps) {
    const layout = orientation === "horizontal" ? "items-center gap-2" : "flex-col items-stretch gap-1";

    return (
        <nav id={id} aria-label="Main navigation" className={`rounded-lg bg-surface px-3 py-2 ${className}`}>
            <ul className={`flex ${layout}`}>
                {items.map((item) => (
                    <li key={item.key}>
                        <NavLink
                            to={item.href}
                            end={item.href === "/"}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `${base} ${orientation === "vertical" ? "block py-2.5" : ""} ${
                                    isActive
                                        ? "bg-surface-high text-primary-muted"
                                        : "text-on-surface hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
