import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import AppSearchBar from "../../components/cores/searchBar/AppSearchBar.tsx";
import Breadcrumb from "../../components/cores/breadcrumb/Breadcrumb.tsx";
import AppPagination from "../../components/cores/pagination/AppPagination.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import CatalogueResultGrid from "../../components/features/catalogue/CatalogueResultGrid.tsx";
import CatalogueFilters from "../../components/features/catalogue/CatalogueFilters.tsx";
import { ErrorState, LoadingState } from "../../components/cores/feedback/AsyncFeedback.tsx";
import { getAllAnime } from "../../api/search/anime.ts";
import { useAsync } from "../../hooks/useAsync.ts";
import {
    type CatalogueFilters as Filters,
    applyFilters,
    buildFacets,
    clearFilters,
    countActiveFilters,
    countByStatus,
    filtersToParams,
    parseFilters,
} from "../../utils/catalogueFilters.ts";

const PER_PAGE = 9;
const FILTERS_PANEL_ID = "catalogue-filters";

const secondaryButton =
    "rounded-xl bg-surface-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft";

function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { status, data, reload } = useAsync(getAllAnime, []);

    const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
    const page = Math.max(1, Math.floor(Number(searchParams.get("page")) || 1));
    const activeCount = countActiveFilters(filters);

    const all = useMemo(() => data ?? [], [data]);
    const genreFacets = useMemo(() => buildFacets(all, (anime) => anime.genres), [all]);
    const studioFacets = useMemo(() => buildFacets(all, (anime) => anime.studios), [all]);
    const statusCounts = useMemo(() => countByStatus(all), [all]);
    const results = useMemo(() => applyFilters(all, filters), [all, filters]);

    const lastPage = Math.max(1, Math.ceil(results.length / PER_PAGE));
    const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const updateFilters = (next: Filters) => {
        setSearchParams(filtersToParams(next), { replace: true });
    };

    const handleSearch = (value: string) => {
        setSearchParams(filtersToParams({ ...filters, query: value }));
    };

    const handlePageChange = (next: number) => {
        const params = filtersToParams(filters);
        if (next > 1) params.set("page", String(next));
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const emptyState =
        results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
                <p className="text-lg font-bold text-on-surface">No results</p>
                <p className="text-sm text-on-surface-variant">
                    {filters.query
                        ? `No anime matches “${filters.query}”${activeCount > 0 ? " with these filters" : ""}.`
                        : "No anime matches these filters."}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {activeCount > 0 && (
                        <button type="button" onClick={() => updateFilters(clearFilters(filters))} className={secondaryButton}>
                            Clear filters
                        </button>
                    )}
                    {filters.query && (
                        <button type="button" onClick={() => handleSearch("")} className={secondaryButton}>
                            Clear search
                        </button>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
                <p className="text-lg font-bold text-on-surface">This page is empty</p>
                <button type="button" onClick={() => handlePageChange(1)} className={secondaryButton}>
                    Back to first page
                </button>
            </div>
        );

    return (
        <PageContainer className="flex flex-col gap-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Catalogue", to: "/catalogue" },
                    { label: filters.query ? `Search: “${filters.query}”` : "Search" },
                ]}
            />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Catalogue</h1>
                <p className="text-sm text-on-surface-variant" aria-live="polite">
                    {status === "success" && (
                        <>
                            {results.length} {results.length === 1 ? "result" : "results"}
                            {filters.query && ` for “${filters.query}”`}
                        </>
                    )}
                </p>
            </div>

            <AppSearchBar defaultValue={filters.query} onSearch={handleSearch} onClear={() => handleSearch("")} />

            {status === "loading" && <LoadingState />}
            {status === "error" && <ErrorState onRetry={reload} />}

            {status === "success" && (
                <>
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((open) => !open)}
                        aria-expanded={filtersOpen}
                        aria-controls={FILTERS_PANEL_ID}
                        className={`flex items-center justify-center gap-2 lg:hidden ${secondaryButton}`}
                    >
                        {filtersOpen ? "Hide filters" : "Show filters"}
                        {activeCount > 0 && (
                            <span className="grid size-5 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-on-primary-soft">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                        <CatalogueFilters
                            id={FILTERS_PANEL_ID}
                            filters={filters}
                            genres={genreFacets}
                            studios={studioFacets}
                            statusCounts={statusCounts}
                            onChange={updateFilters}
                            className={`${filtersOpen ? "flex" : "hidden"} lg:sticky lg:top-6 lg:flex`}
                        />

                        <div className="flex min-w-0 flex-col gap-6">
                            <CatalogueResultGrid items={pageItems} emptyState={emptyState} />
                            <AppPagination page={page} lastPage={lastPage} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </>
            )}
        </PageContainer>
    );
}

export default Catalogue;
