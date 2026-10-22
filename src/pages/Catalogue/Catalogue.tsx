import { useMemo, useState } from "react";
import AppSearchBar from "../../components/cores/searchBar/AppSearchBar.tsx";
import Breadcrumb from "../../components/cores/breadcrumb/Breadcrumb.tsx";
import AppPagination from "../../components/cores/pagination/AppPagination.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import CatalogueResultGrid from "../../components/features/catalogue/CatalogueResultGrid.tsx";
import CatalogueFilters from "../../components/features/catalogue/CatalogueFilters.tsx";
import { ErrorState, LoadingState } from "../../components/cores/feedback/AsyncFeedback.tsx";
import EmptyState from "../../components/cores/feedback/EmptyState.tsx";
import AppButton from "../../components/cores/buttons/AppButton.tsx";
import { getAllAnime } from "../../api/search/anime.ts";
import { useAsync } from "../../hooks/useAsync.ts";
import { useCatalogueFilters } from "../../contexts/catalogueFiltersProvider.tsx";
import { applyFilters, buildFacets, countActiveFilters, countByStatus } from "../../utils/catalogueFilters.ts";

const PER_PAGE = 9;
const FILTERS_PANEL_ID = "catalogue-filters";

function Catalogue() {
    const { filters, page, setFilters, setQuery, setPage, clearAllFilters } = useCatalogueFilters();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { status, data, reload } = useAsync(getAllAnime, []);

    const activeCount = countActiveFilters(filters);

    const all = useMemo(() => data ?? [], [data]);
    const genreFacets = useMemo(() => buildFacets(all, (anime) => anime.genres), [all]);
    const studioFacets = useMemo(() => buildFacets(all, (anime) => anime.studios), [all]);
    const statusCounts = useMemo(() => countByStatus(all), [all]);
    const results = useMemo(() => applyFilters(all, filters), [all, filters]);

    const lastPage = Math.max(1, Math.ceil(results.length / PER_PAGE));
    const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (value: string) => {
        setQuery(value);
    };

    const handlePageChange = (next: number) => {
        setPage(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const emptyState =
        results.length === 0 ? (
            <EmptyState
                title="No results"
                message={
                    filters.query
                        ? `No anime matches “${filters.query}”${activeCount > 0 ? " with these filters" : ""}.`
                        : "No anime matches these filters."
                }
                actions={
                    <>
                        {activeCount > 0 && (
                            <AppButton onClick={clearAllFilters}>Clear filters</AppButton>
                        )}
                        {filters.query && <AppButton onClick={() => handleSearch("")}>Clear search</AppButton>}
                    </>
                }
            />
        ) : (
            <EmptyState
                title="This page is empty"
                actions={<AppButton onClick={() => handlePageChange(1)}>Back to first page</AppButton>}
            />
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
                    <AppButton
                        icon="filter"
                        onClick={() => setFiltersOpen((open) => !open)}
                        aria-expanded={filtersOpen}
                        aria-controls={FILTERS_PANEL_ID}
                        className="lg:hidden"
                    >
                        {filtersOpen ? "Hide filters" : "Show filters"}
                        {activeCount > 0 && (
                            <span className="grid size-5 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-on-primary-soft">
                                {activeCount}
                            </span>
                        )}
                    </AppButton>

                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                        <CatalogueFilters
                            id={FILTERS_PANEL_ID}
                            filters={filters}
                            genres={genreFacets}
                            studios={studioFacets}
                            statusCounts={statusCounts}
                            onChange={setFilters}
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
