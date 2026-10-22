import { focusRing } from "../../../styles/ui.ts";

type AppFilterChipProps = {
    label: string;
    selected: boolean;
    onClick: () => void;
    count?: number;
    className?: string;
};

function AppFilterChip({ label, selected, onClick, count, className = "" }: AppFilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${focusRing} ${
                selected
                    ? "bg-primary-soft text-on-primary-soft"
                    : "bg-surface-high text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
            } ${className}`}
        >
            {label}
            {count !== undefined && (
                <span className={selected ? "text-on-primary-soft/70" : "text-on-surface-variant/70"}>{count}</span>
            )}
        </button>
    );
}

export default AppFilterChip;
