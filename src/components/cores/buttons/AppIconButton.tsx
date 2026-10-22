import type { ComponentPropsWithoutRef } from "react";
import AppIcon, { type IconName } from "../icons/AppIcon.tsx";
import { focusRing } from "../../../styles/ui.ts";

type AppIconButtonProps = Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "aria-label"
> & {
    icon: IconName;
    label: string;
    variant?: "ghost" | "surface" | "primary";
    size?: "sm" | "md";
    dot?: boolean;
};

const VARIANTS = {
    ghost: "text-on-surface-variant hover:bg-white/5 hover:text-white",
    surface: "bg-surface-high text-on-surface hover:bg-white/10",
    primary: "bg-primary-soft text-on-primary-soft hover:bg-primary-soft/90",
};

const SIZES = {
    sm: { box: "size-7 rounded-lg", icon: "size-4" },
    md: { box: "size-10 rounded-xl", icon: "size-5" },
};

function AppIconButton({
    icon,
    label,
    variant = "ghost",
    size = "md",
    dot = false,
    type = "button",
    className = "",
    ...rest
}: AppIconButtonProps) {
    return (
        <button
            type={type}
            aria-label={label}
            {...rest}
            className={`relative grid shrink-0 place-items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing} ${SIZES[size].box} ${VARIANTS[variant]} ${className}`}
        >
            <AppIcon name={icon} className={SIZES[size].icon} />
            {dot && (
                <span
                    aria-hidden
                    className="absolute right-2 top-2 size-2 rounded-full bg-pink-400 ring-2 ring-neutral"
                />
            )}
        </button>
    );
}

export default AppIconButton;
