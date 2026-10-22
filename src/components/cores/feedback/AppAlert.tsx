import type { ReactNode } from "react";
import AppIcon from "../icons/AppIcon.tsx";

export type AlertVariant = "success" | "error" | "info";

type AppAlertProps = {
    variant?: AlertVariant;
    title: ReactNode;
    children?: ReactNode;
    actions?: ReactNode;
    className?: string;
};

const VARIANTS: Record<AlertVariant, { box: string; icon: string }> = {
    success: {
        box: "border-emerald-400/30 bg-emerald-400/10",
        icon: "bg-emerald-400/20 text-emerald-300",
    },
    error: {
        box: "border-rose-400/30 bg-rose-400/10",
        icon: "bg-rose-400/20 text-rose-300",
    },
    info: {
        box: "border-primary-soft/30 bg-primary-soft/10",
        icon: "bg-primary-soft/20 text-primary-soft",
    },
};

function AppAlert({
    variant = "info",
    title,
    children,
    actions,
    className = "",
}: AppAlertProps) {
    const styles = VARIANTS[variant];

    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-start ${styles.box} ${className}`}
        >
            <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
            >
                {variant === "error" ? (
                    <span aria-hidden className="text-sm font-black">
                        !
                    </span>
                ) : (
                    <AppIcon
                        name="check"
                        className="size-4"
                        strokeWidth={2.5}
                    />
                )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="font-bold text-on-surface">{title}</p>
                {children && (
                    <div className="text-sm text-on-surface-variant">
                        {children}
                    </div>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export default AppAlert;
