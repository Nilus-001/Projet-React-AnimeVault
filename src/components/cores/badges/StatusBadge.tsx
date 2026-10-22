import type { AnimeStatus } from "../../../types/anime.ts";
import { STATUS_META } from "../../../utils/anime.ts";
import AppChip from "../chips/AppChip.tsx";

type StatusBadgeProps = {
    status: AnimeStatus;
    label?: string;
    variant?: "text" | "pill";
    className?: string;
};

function StatusBadge({ status, label, variant = "text", className = "" }: StatusBadgeProps) {
    const meta = STATUS_META[status];
    const text = label ?? meta.label;

    if (variant === "pill") {
        return (
            <AppChip variant="solid" dot className={`${meta.className} ${className}`}>
                {text}
            </AppChip>
        );
    }

    return <span className={`text-xs font-semibold ${meta.className} ${className}`}>{text}</span>;
}

export default StatusBadge;
