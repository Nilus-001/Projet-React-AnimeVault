import type { ReactNode } from "react";

type EmptyStateProps = {
    title?: ReactNode;
    message?: ReactNode;
    actions?: ReactNode;
    size?: "sm" | "md";
    role?: "status" | "alert";
    className?: string;
};

function EmptyState({
    title,
    message,
    actions,
    size = "md",
    role,
    className = "",
}: EmptyStateProps) {
    return (
        <div
            role={role}
            className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 text-center ${
                size === "md" ? "py-16" : "py-8"
            } ${className}`}
        >
            {title && (
                <p className="text-lg font-bold text-on-surface">{title}</p>
            )}
            {message && (
                <p className="text-sm text-on-surface-variant">{message}</p>
            )}
            {actions && (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export default EmptyState;
