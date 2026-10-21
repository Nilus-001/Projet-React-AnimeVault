import { Link } from "react-router";

export type BreadcrumbItem = { label: string; to?: string };

function Chevron() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3 text-on-surface-variant/70"
        >
            <path d="m9 6 6 6-6 6" />
        </svg>
    );
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={`${i}-${item.label}`} className="flex items-center gap-2">
                            {isLast || !item.to ? (
                                <span aria-current={isLast ? "page" : undefined} className="font-bold text-on-surface">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.to}
                                    className="text-on-surface-variant transition-colors hover:text-on-surface focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                >
                                    {item.label}
                                </Link>
                            )}
                            {!isLast && <Chevron />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
