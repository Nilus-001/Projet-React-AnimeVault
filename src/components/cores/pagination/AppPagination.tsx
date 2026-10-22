type AppPaginationProps = {
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
};

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(page: number, lastPage: number, siblingCount: number): PageItem[] {
    const totalSlots = siblingCount * 2 + 5;
    if (lastPage <= totalSlots) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const start = Math.max(2, page - siblingCount);
    const end = Math.min(lastPage - 1, page + siblingCount);
    const showStartEllipsis = start > 3;
    const showEndEllipsis = end < lastPage - 2;

    const items: PageItem[] = [1];

    if (showStartEllipsis) {
        items.push("ellipsis-start");
    } else {
        for (let p = 2; p < start; p++) items.push(p);
    }

    for (let p = start; p <= end; p++) items.push(p);

    if (showEndEllipsis) {
        items.push("ellipsis-end");
    } else {
        for (let p = end + 1; p < lastPage; p++) items.push(p);
    }

    items.push(lastPage);
    return items;
}

function Arrow({ direction }: { direction: "left" | "right" }) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
        >
            <path d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
        </svg>
    );
}

const baseButton =
    "flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft";
const idleButton = "bg-surface-high text-on-surface hover:bg-white/10";
const activeButton = "bg-primary-soft text-on-primary-soft shadow-glow";
const disabledButton = "cursor-not-allowed bg-surface-high/50 text-on-surface-variant/50";

function AppPagination({ page, lastPage, onPageChange, siblingCount = 1, className = "" }: AppPaginationProps) {
    if (lastPage <= 1) return null;

    const isFirst = page <= 1;
    const isLast = page >= lastPage;
    const items = getPageItems(page, lastPage, siblingCount);

    const goTo = (target: number) => {
        const next = Math.min(Math.max(1, target), lastPage);
        if (next !== page) onPageChange(next);
    };

    return (
        <nav aria-label="Pagination" className={`flex justify-center ${className}`}>
            <ul className="flex flex-wrap items-center justify-center gap-2">
                <li>
                    <button
                        type="button"
                        onClick={() => goTo(page - 1)}
                        disabled={isFirst}
                        aria-label="Previous page"
                        className={`${baseButton} ${isFirst ? disabledButton : idleButton}`}
                    >
                        <Arrow direction="left" />
                        <span className="hidden sm:inline">Prev</span>
                    </button>
                </li>

                {items.map((item) =>
                    typeof item === "number" ? (
                        <li key={item}>
                            <button
                                type="button"
                                onClick={() => goTo(item)}
                                aria-label={`Page ${item}`}
                                aria-current={item === page ? "page" : undefined}
                                className={`${baseButton} ${item === page ? activeButton : idleButton}`}
                            >
                                {item}
                            </button>
                        </li>
                    ) : (
                        <li key={item} aria-hidden className="flex h-10 min-w-6 items-end justify-center pb-2 text-on-surface-variant">
                            …
                        </li>
                    ),
                )}

                <li>
                    <button
                        type="button"
                        onClick={() => goTo(page + 1)}
                        disabled={isLast}
                        aria-label="Next page"
                        className={`${baseButton} ${isLast ? disabledButton : idleButton}`}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <Arrow direction="right" />
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default AppPagination;
