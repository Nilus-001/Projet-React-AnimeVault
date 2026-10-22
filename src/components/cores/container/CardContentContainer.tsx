import { type ReactNode, useId } from "react";

type CardContentContainerProps = {
    content: ReactNode;
    title?: ReactNode;
    actions?: ReactNode;
    className?: string;
};

function CardContentContainer({ content, title, actions, className = "" }: CardContentContainerProps) {
    const titleId = useId();
    const hasHeader = Boolean(title || actions);

    return (
        <section
            aria-labelledby={title ? titleId : undefined}
            className={`flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface p-6 sm:p-8 ${className}`}
        >
            {hasHeader && (
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                    {title && (
                        <h2 id={titleId} className="text-2xl font-bold text-on-surface">
                            {title}
                        </h2>
                    )}
                    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
                </header>
            )}
            <div className="flex flex-col gap-4">{content}</div>
        </section>
    );
}

export default CardContentContainer;
