import type { ReactNode } from "react";

export type ChipVariant = "subtle" | "solid" | "tag";

type AppChipProps = {
    children: ReactNode;
    variant?: ChipVariant;
    dot?: boolean;
    className?: string;
};

const VARIANTS: Record<ChipVariant, string> = {
    subtle: "rounded-md bg-white/5 px-2.5 py-1 font-medium text-on-surface-variant",
    solid: "rounded-full bg-surface-high px-3 py-1 font-semibold text-on-surface-variant",
    tag: "rounded-lg bg-surface px-3 py-1 font-semibold text-on-surface",
};

function AppChip({
    children,
    variant = "subtle",
    dot = false,
    className = "",
}: AppChipProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-xs ${VARIANTS[variant]} ${className}`}
        >
            {dot && (
                <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-current"
                />
            )}
            {children}
        </span>
    );
}

export default AppChip;
