type LoadingStateProps = {
    label?: string;
    className?: string;
};

export function LoadingState({ label = "Chargement…", className = "" }: LoadingStateProps) {
    return (
        <div role="status" className={`flex flex-col items-center gap-3 py-16 text-center ${className}`}>
            <span aria-hidden className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-primary-soft" />
            <p className="text-sm text-on-surface-variant">{label}</p>
        </div>
    );
}

type ErrorStateProps = {
    message?: string;
    onRetry?: () => void;
    className?: string;
};

export function ErrorState({ message = "Impossible de charger les données.", onRetry, className = "" }: ErrorStateProps) {
    return (
        <div role="alert" className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center ${className}`}>
            <p className="text-lg font-bold text-on-surface">Erreur</p>
            <p className="text-sm text-on-surface-variant">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 rounded-xl bg-surface-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
                >
                    Réessayer
                </button>
            )}
        </div>
    );
}
