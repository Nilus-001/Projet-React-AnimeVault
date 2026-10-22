import type { ReactNode } from "react";
import type { AnimeSort, Genre } from "../../../types/anime.ts";
import AppButton from "../../cores/buttons/AppButton.tsx";
import AppFilterChip from "../../cores/chips/AppFilterChip.tsx";
import AppIcon from "../../cores/icons/AppIcon.tsx";
import { type CatalogueFilters as Filters, SORT_OPTIONS, countActiveFilters } from "../../../utils/catalogueFilters.ts";

type CatalogueFiltersProps = {
    id?: string;
    filters: Filters;
    genres: Genre[];
    onGenreChange: (genre: string | null) => void;
    onSortChange: (sort: AnimeSort) => void;
    onClear: () => void;
    className?: string;
};

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {title}
            </legend>
            {children}
        </fieldset>
    );
}

function CatalogueFilters({
    id,
    filters,
    genres,
    onGenreChange,
    onSortChange,
    onClear,
    className = "",
}: CatalogueFiltersProps) {
    const activeCount = countActiveFilters(filters);

    return (
        <aside
            id={id}
            aria-label="Filters"
            className={`flex-col gap-6 rounded-2xl border border-white/5 bg-surface p-5 ${className}`}
        >
            <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
                    <AppIcon name="filter" className="size-4 text-primary-soft" />
                    Filters
                </h2>
                <AppButton variant="link" onClick={onClear} disabled={activeCount === 0} className="text-xs">
                    Clear{activeCount > 0 && ` (${activeCount})`}
                </AppButton>
            </div>

            <FilterSection title="Sort by">
                <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map((option) => (
                        <AppFilterChip
                            key={option.value}
                            label={option.label}
                            selected={filters.sort === option.value}
                            onClick={() => onSortChange(option.value)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Genre">
                {filters.query && (
                    <p className="text-xs text-on-surface-variant">Choosing a genre clears the current search.</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                    <AppFilterChip label="All" selected={filters.genre === null} onClick={() => onGenreChange(null)} />
                    {genres.map((genre) => (
                        <AppFilterChip
                            key={genre.slug}
                            label={genre.name}
                            selected={filters.genre === genre.slug}
                            onClick={() => onGenreChange(filters.genre === genre.slug ? null : genre.slug)}
                        />
                    ))}
                </div>
            </FilterSection>
        </aside>
    );
}

export default CatalogueFilters;
