import { type FormEvent, useRef, useState } from "react";

type IconProps = { className?: string };

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const SearchIcon = ({ className }: IconProps) => (
    <svg {...iconProps} className={className}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
);

const CloseIcon = ({ className }: IconProps) => (
    <svg {...iconProps} className={className}>
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

type AppSearchBarProps = {
    onSearch: (query: string) => void;
    onClear?: () => void;
    placeholder?: string;
    defaultValue?: string;
    buttonLabel?: string;
};

function AppSearchBar({
    onSearch,
    onClear,
    placeholder = "Search anime by title…",
    defaultValue = "",
    buttonLabel = "Search",
}: AppSearchBarProps) {
    const [query, setQuery] = useState(defaultValue);
    const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep the input in sync when the value comes from outside (URL change).
    // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    if (defaultValue !== prevDefaultValue) {
        setPrevDefaultValue(defaultValue);
        setQuery(defaultValue);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    const handleClear = () => {
        setQuery("");
        inputRef.current?.focus();
        onClear?.();
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 rounded-2xl border border-white/5 bg-surface p-2"
        >
            <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-neutral px-4 focus-within:ring-2 focus-within:ring-primary/60">
                <SearchIcon className="size-4 shrink-0 text-primary-soft" />
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search anime"
                    className="min-w-0 flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search"
                        className="shrink-0 rounded text-on-surface-variant transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        <CloseIcon className="size-4" />
                    </button>
                )}
            </div>

            <button
                type="submit"
                aria-label={buttonLabel}
                className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary-soft px-5 text-sm font-semibold text-on-primary-soft shadow-glow transition-colors hover:bg-primary-soft/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
            >
                <SearchIcon className="size-4" />
                <span className="hidden sm:inline">{buttonLabel}</span>
            </button>
        </form>
    );
}

export default AppSearchBar;
