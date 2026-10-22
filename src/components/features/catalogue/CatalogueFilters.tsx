import { type ReactNode, useId, useState } from "react";
import type { AnimeStatus } from "../../../types/anime.ts";
import { STATUS_META } from "../../../utils/anime.ts";
import AppButton from "../../cores/buttons/AppButton.tsx";
import AppFilterChip from "../../cores/chips/AppFilterChip.tsx";
import AppBadge from "../../cores/badges/AppBadge.tsx";
import AppIcon from "../../cores/icons/AppIcon.tsx";
import {
    type CatalogueFilters as Filters,
    type FacetOption,
    FILTER_STATUSES,
    SCORE_MAX,
    SCORE_MIN,
    SCORE_STEP,
    clearFilters,
    countActiveFilters,
    toggleValue,
} from "../../../utils/catalogueFilters.ts";

type CatalogueFiltersProps = {
    id?: string;
    filters: Filters;
    genres: FacetOption[];
    studios: FacetOption[];
    statusCounts: Record<AnimeStatus, number>;
    onChange: (next: Filters) => void;
    className?: string;
};

const STUDIOS_PREVIEW = 8;

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
    studios,
    statusCounts,
    onChange,
    className = "",
}: CatalogueFiltersProps) {
    const [showAllStudios, setShowAllStudios] = useState(false);
    const scoreId = useId();
    const activeCount = countActiveFilters(filters);

    const visibleStudios = showAllStudios
        ? studios
        : [
              ...studios.slice(0, STUDIOS_PREVIEW),
              ...studios.slice(STUDIOS_PREVIEW).filter((studio) => filters.studios.includes(studio.name)),
          ];

    const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

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
                <AppButton
                    variant="link"
                    onClick={() => onChange(clearFilters(filters))}
                    disabled={activeCount === 0}
                    className="text-xs"
                >
                    Clear{activeCount > 0 && ` (${activeCount})`}
                </AppButton>
            </div>

            <FilterSection title="Status">
                <div className="flex flex-col gap-1">
                    {FILTER_STATUSES.map((status) => {
                        const checked = filters.statuses.includes(status);
                        const meta = STATUS_META[status];
                        return (
                            <label
                                key={status}
                                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-within:outline-2 focus-within:outline-primary-soft ${
                                    checked ? "bg-surface-high font-semibold text-on-surface" : "text-on-surface-variant hover:bg-white/5"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span aria-hidden className={`size-2 rounded-full bg-current ${meta.className}`} />
                                    {meta.label}
                                    <span className="text-xs text-on-surface-variant/70">{statusCounts[status]}</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => update({ statuses: toggleValue(filters.statuses, status) })}
                                    className="size-4 accent-primary-soft"
                                />
                            </label>
                        );
                    })}
                </div>
            </FilterSection>

            <FilterSection title="Minimum rating">
                <div className="flex items-center justify-between">
                    <label htmlFor={scoreId} className="text-sm text-on-surface-variant">
                        Score
                    </label>
                    <AppBadge variant="score">{filters.minScore > SCORE_MIN ? `★ ${filters.minScore.toFixed(1)}+` : "Any"}</AppBadge>
                </div>
                <input
                    id={scoreId}
                    type="range"
                    min={SCORE_MIN}
                    max={SCORE_MAX}
                    step={SCORE_STEP}
                    value={filters.minScore}
                    onChange={(e) => update({ minScore: Number(e.target.value) })}
                    aria-valuetext={filters.minScore > SCORE_MIN ? `${filters.minScore} or more` : "Any score"}
                    className="w-full cursor-pointer accent-tertiary-soft"
                />
                <div aria-hidden className="flex justify-between text-[10px] font-semibold text-on-surface-variant/70">
                    <span>{SCORE_MIN}</span>
                    <span>7.5</span>
                    <span>{SCORE_MAX}</span>
                </div>
            </FilterSection>

            <FilterSection title="Genres">
                <div className="flex flex-wrap gap-1.5">
                    {genres.map((genre) => (
                        <AppFilterChip
                            key={genre.name}
                            label={genre.name}
                            selected={filters.genres.includes(genre.name)}
                            onClick={() => update({ genres: toggleValue(filters.genres, genre.name) })}
                        />
                    ))}
                </div>
            </FilterSection>

            {studios.length > 0 && (
                <FilterSection title="Studios">
                    <div className="flex flex-wrap gap-1.5">
                        {visibleStudios.map((studio) => (
                            <AppFilterChip
                                key={studio.name}
                                label={studio.name}
                                count={studio.count}
                                selected={filters.studios.includes(studio.name)}
                                onClick={() => update({ studios: toggleValue(filters.studios, studio.name) })}
                            />
                        ))}
                    </div>
                    {studios.length > STUDIOS_PREVIEW && (
                        <AppButton
                            variant="link"
                            onClick={() => setShowAllStudios((value) => !value)}
                            aria-expanded={showAllStudios}
                            className="self-start text-xs"
                        >
                            {showAllStudios ? "Show less" : `Show all (${studios.length})`}
                        </AppButton>
                    )}
                </FilterSection>
            )}
        </aside>
    );
}

export default CatalogueFilters;
