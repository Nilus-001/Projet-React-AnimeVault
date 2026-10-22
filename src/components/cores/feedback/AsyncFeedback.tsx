import AppButton from "../buttons/AppButton.tsx";
import EmptyState from "./EmptyState.tsx";

type LoadingStateProps = {
    label?: string;
    className?: string;
};

export function LoadingState({
    label = "Chargement…",
    className = "",
}: LoadingStateProps) {
    return (
        <div
            role="status"
            className={`flex flex-col items-center gap-3 py-16 text-center ${className}`}
        >
            <span
                aria-hidden
                className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-primary-soft"
            />
            <p className="text-sm text-on-surface-variant">{label}</p>
        </div>
    );
}

type ErrorStateProps = {
    message?: string;
    onRetry?: () => void;
    className?: string;
};

export function ErrorState({
    message = "Impossible to load the data",
    onRetry,
    className = "",
}: ErrorStateProps) {
    return (
        <EmptyState
            role="alert"
            title="Error"
            message={message}
            className={className}
            actions={onRetry && <AppButton onClick={onRetry}>Retry</AppButton>}
        />
    );
}
