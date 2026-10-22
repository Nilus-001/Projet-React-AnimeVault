import { type FormEvent, useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton.tsx";
import AppIconButton from "../buttons/AppIconButton.tsx";
import AppIcon from "../icons/AppIcon.tsx";

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuery(defaultValue);
    }, [defaultValue]);

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
                <AppIcon name="search" className="size-4 text-primary-soft" />
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search anime"
                    className="min-w-0 flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                />
                {query && <AppIconButton icon="close" label="Clear search" size="sm" onClick={handleClear} />}
            </div>

            <AppButton type="submit" variant="primary" size="lg" icon="search" aria-label={buttonLabel}>
                <span className="hidden sm:inline">{buttonLabel}</span>
            </AppButton>
        </form>
    );
}

export default AppSearchBar;
