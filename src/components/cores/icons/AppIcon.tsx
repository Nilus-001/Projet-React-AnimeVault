import type { ReactNode } from "react";

const ICONS = {
    search: { paths: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></> },
    close: { paths: <path d="M18 6 6 18M6 6l12 12" /> },
    menu: { paths: <path d="M4 6h16M4 12h16M4 18h16" /> },
    bell: { paths: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></> },
    "chevron-left": { paths: <path d="m15 6-6 6 6 6" /> },
    "chevron-right": { paths: <path d="m9 6 6 6-6 6" /> },
    plus: { paths: <path d="M12 5v14M5 12h14" /> },
    check: { paths: <path d="m5 12.5 4.5 4.5L19 7" /> },
    filter: { paths: <path d="M4 5h16l-6 7.5V19l-4 1.5v-8L4 5Z" /> },
    clock: { paths: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
    play: { paths: <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />, filled: true },
    pause: { paths: <path d="M7 5h4v14H7zM13 5h4v14h-4z" />, filled: true },
} satisfies Record<string, { paths: ReactNode; filled?: boolean }>;

export type IconName = keyof typeof ICONS;

type AppIconProps = {
    name: IconName;
    className?: string;
    strokeWidth?: number;
};

function AppIcon({ name, className = "size-4", strokeWidth = 2 }: AppIconProps) {
    const icon: { paths: ReactNode; filled?: boolean } = ICONS[name];
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill={icon.filled ? "currentColor" : "none"}
            stroke={icon.filled ? "none" : "currentColor"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 ${className}`}
        >
            {icon.paths}
        </svg>
    );
}

export default AppIcon;
