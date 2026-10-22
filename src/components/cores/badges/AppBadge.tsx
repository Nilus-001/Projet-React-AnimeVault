import type { ReactNode } from "react";

export type BadgeVariant = "overlay" | "accent" | "soft" | "score";

type AppBadgeProps = {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
};

const VARIANTS: Record<BadgeVariant, string> = {
    overlay: "rounded-md bg-neutral/75 px-2 py-0.5 text-xs font-bold text-on-surface backdrop-blur-sm",
    accent: "rounded-lg bg-tertiary-soft px-2 py-1 text-xs font-bold text-neutral shadow",
    soft: "rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-on-surface-variant",
    score: "rounded-md bg-tertiary-soft/15 px-2.5 py-1 text-[11px] font-bold text-tertiary-soft",
};

function AppBadge({ children, variant = "overlay", className = "" }: AppBadgeProps) {
    return <span className={`inline-flex items-center gap-1 ${VARIANTS[variant]} ${className}`}>{children}</span>;
}

export default AppBadge;
