type AppSpinnerProps = {
    size?: "sm" | "md" | "lg";
    className?: string;
};

const SIZES = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-8 border-2",
};

function AppSpinner({ size = "sm", className = "" }: AppSpinnerProps) {
    return (
        <span
            aria-hidden
            className={`inline-block shrink-0 animate-spin rounded-full border-current/25 border-t-current ${SIZES[size]} ${className}`}
        />
    );
}

export default AppSpinner;
