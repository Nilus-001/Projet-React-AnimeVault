import type { ReactNode } from "react";
import AppButton, { type ButtonSize } from "./AppButton.tsx";
import type { IconName } from "../icons/AppIcon.tsx";

export type ToggleButtonColor =
    "primary" | "secondary" | "tertiary" | "neutral";

type AppToggleButtonProps = {
    condition: boolean;
    onTrue: () => void;
    onFalse: () => void;
    labelTrue?: ReactNode;
    labelFalse?: ReactNode;
    iconTrue?: IconName;
    iconFalse?: IconName;
    color?: ToggleButtonColor;
    size?: ButtonSize;
    className?: string;
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
    size = "md",
    className = "",
}: AppToggleButtonProps) {
    const label = condition ? labelTrue : labelFalse;

    return (
        <AppButton
            variant={condition ? color : "surface"}
            size={size}
            icon={condition ? iconTrue : iconFalse}
            onClick={condition ? onTrue : onFalse}
            aria-pressed={condition}
            aria-label={label ? undefined : condition ? "On" : "Off"}
            className={className}
        >
            {label}
        </AppButton>
    );
}

export default AppToggleButton;
