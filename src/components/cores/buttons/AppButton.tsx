import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";
import AppIcon, { type IconName } from "../icons/AppIcon.tsx";
import { focusRing } from "../../../styles/ui.ts";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "neutral" | "surface" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: IconName;
    iconRight?: IconName;
    fullWidth?: boolean;
    className?: string;
    children?: ReactNode;
};

type AsButton = BaseProps & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { to?: undefined; href?: undefined };
type AsLink = BaseProps & Omit<LinkProps, keyof BaseProps> & { href?: undefined };
type AsAnchor = BaseProps & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & { href: string; to?: undefined };

export type AppButtonProps = AsButton | AsLink | AsAnchor;

const VARIANTS: Record<ButtonVariant, string> = {
    primary: "bg-primary-soft text-on-primary-soft shadow-glow hover:bg-primary-soft/90",
    secondary: "bg-secondary-soft text-secondary hover:bg-secondary-soft/90",
    tertiary: "bg-tertiary-soft text-neutral hover:bg-tertiary-soft/90",
    neutral: "bg-on-surface text-neutral hover:bg-on-surface/90",
    surface: "bg-surface-high text-on-surface hover:bg-white/10",
    ghost: "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
    link: "text-primary-soft hover:text-white",
};

const SIZES: Record<ButtonSize, string> = {
    sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
    md: "h-10 gap-2 rounded-xl px-4 text-sm",
    lg: "h-12 gap-2 rounded-xl px-5 text-sm",
};

const ICON_SIZES: Record<ButtonSize, string> = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-4",
};

export function buttonClasses({
    variant = "surface",
    size = "md",
    fullWidth = false,
    className = "",
}: Pick<BaseProps, "variant" | "size" | "fullWidth" | "className">): string {
    const layout = variant === "link" ? "gap-1 rounded text-sm" : SIZES[size];
    return [
        "inline-flex shrink-0 items-center justify-center font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        focusRing,
        layout,
        VARIANTS[variant],
        fullWidth ? "w-full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
}

function AppButton(props: AppButtonProps) {
    const { variant, size = "md", icon, iconRight, fullWidth, className, children, ...rest } = props;
    const classes = buttonClasses({ variant, size, fullWidth, className });
    const iconClass = ICON_SIZES[size];

    const content = (
        <>
            {icon && <AppIcon name={icon} className={iconClass} />}
            {children}
            {iconRight && <AppIcon name={iconRight} className={iconClass} />}
        </>
    );

    if (rest.to !== undefined) {
        return (
            <Link {...(rest as Omit<AsLink, keyof BaseProps>)} className={classes}>
                {content}
            </Link>
        );
    }

    if (rest.href !== undefined) {
        const anchor = rest as Omit<AsAnchor, keyof BaseProps>;
        const external = /^https?:\/\//.test(anchor.href);
        return (
            <a
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                {...anchor}
                className={classes}
            >
                {content}
            </a>
        );
    }

    const { type = "button", ...button } = rest as Omit<AsButton, keyof BaseProps>;
    return (
        <button type={type} {...button} className={classes}>
            {content}
        </button>
    );
}

export default AppButton;
