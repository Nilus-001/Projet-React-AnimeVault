import { type ReactNode, useId, useState } from "react";
import type { AnimeStatus } from "../../../types/anime.ts";
import { STATUS_META } from "../../../utils/anime.ts";
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

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft";

function FilterIcon() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-primary-soft"
        >
            <path d="M4 5h16l-6 7.5V19l-4 1.5v-8L4 5Z" />
        </svg>
    );
}

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

function Chip({
    label,
    count,
    selected,
    onClick,
}: {
    label: string;
    count?: number;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${focusRing} ${
                selected
                    ? "bg-primary-soft text-on-primary-soft"
                    : "bg-surface-high text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
            }`}
        >
            {label}
            {count !== undefined && (
                <span className={selected ? "text-on-primary-soft/70" : "text-on-surface-variant/70"}>{count}</span>
            )}
        </button>
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
                    <FilterIcon />
                    Filters
                </h2>
                <button
                    type="button"
                    onClick={() => onChange(clearFilters(filters))}
                    disabled={activeCount === 0}
                    className={`rounded text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-on-surface-variant ${focusRing}`}
                >
                    Clear{activeCount > 0 && ` (${activeCount})`}
                </button>
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
                    <span className="rounded-md bg-tertiary-soft/15 px-2 py-0.5 text-xs font-bold text-tertiary-soft">
                        {filters.minScore > SCORE_MIN ? `★ ${filters.minScore.toFixed(1)}+` : "Any"}
                    </span>
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
                        <Chip
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
                            <Chip
                                key={studio.name}
                                label={studio.name}
                                count={studio.count}
                                selected={filters.studios.includes(studio.name)}
                                onClick={() => update({ studios: toggleValue(filters.studios, studio.name) })}
                            />
                        ))}
                    </div>
                    {studios.length > STUDIOS_PREVIEW && (
                        <button
                            type="button"
                            onClick={() => setShowAllStudios((value) => !value)}
                            aria-expanded={showAllStudios}
                            className={`self-start rounded text-xs font-semibold text-primary-soft transition-colors hover:text-white ${focusRing}`}
                        >
                            {showAllStudios ? "Show less" : `Show all (${studios.length})`}
                        </button>
                    )}
                </FilterSection>
            )}
        </aside>
    );
}

export default CatalogueFilters;
