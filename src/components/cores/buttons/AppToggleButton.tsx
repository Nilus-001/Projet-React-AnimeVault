import type { ReactNode } from "react";

export type ToggleButtonColor = "primary" | "secondary" | "tertiary" | "neutral";

type AppToggleButtonProps = {
    condition: boolean;
    onTrue: () => void;
    onFalse: () => void;
    labelTrue?: string;
    labelFalse?: string;
    iconTrue?: ReactNode;
    iconFalse?: ReactNode;
    color?: ToggleButtonColor;
    className?: string;
};

const activeColorClasses: Record<ToggleButtonColor, string> = {
    primary: "bg-primary-soft text-on-primary-soft shadow-glow hover:bg-primary-soft/90 focus-visible:outline-primary-soft",
    secondary: "bg-secondary-soft text-secondary hover:bg-secondary-soft/90 focus-visible:outline-secondary-soft",
    tertiary: "bg-tertiary-soft text-neutral hover:bg-tertiary-soft/90 focus-visible:outline-tertiary-soft",
    neutral: "bg-on-surface text-neutral hover:bg-on-surface/90 focus-visible:outline-on-surface",
};

const inactiveColorClasses: Record<ToggleButtonColor, string> = {
    primary: "bg-surface-high text-on-surface hover:bg-white/10 focus-visible:outline-primary-soft",
    secondary: "bg-surface-high text-on-surface hover:bg-white/10 focus-visible:outline-secondary-soft",
    tertiary: "bg-surface-high text-on-surface hover:bg-white/10 focus-visible:outline-tertiary-soft",
    neutral: "bg-surface-high text-on-surface hover:bg-white/10 focus-visible:outline-on-surface",
};

function AppToggleButton({
    condition,
    onTrue,
    onFalse,
    labelTrue,
    labelFalse,
    iconTrue,
    iconFalse,
    color = "primary",
    className = "",
}: AppToggleButtonProps) {
    const label = condition ? labelTrue : labelFalse;
    const icon = condition ? iconTrue : iconFalse;
    const colorClasses = condition ? activeColorClasses[color] : inactiveColorClasses[color];

    const handleClick = () => {
        if (condition) {
            onTrue();
        } else {
            onFalse();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={condition}
            aria-label={!label ? (condition ? "On" : "Off") : undefined}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${colorClasses} ${className}`}
        >
            {icon && <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden>{icon}</span>}
            {label && <span>{label}</span>}
        </button>
    );
}

export default AppToggleButton;
