import { useSearchParams } from "react-router";
import AppSearchBar from "../../components/cores/searchBar/AppSearchBar.tsx";
import Breadcrumb from "../../components/cores/breadcrumb/Breadcrumb.tsx";
import AppPagination from "../../components/cores/pagination/AppPagination.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import CatalogueResultGrid from "../../components/features/catalogue/CatalogueResultGrid.tsx";
import { ErrorState, LoadingState } from "../../components/cores/feedback/AsyncFeedback.tsx";
import { getAnimePage, searchAnimeByName } from "../../api/search/anime.ts";
import { useAsync } from "../../hooks/useAsync.ts";

const PER_PAGE = 8;

function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const requestedPage = Number(searchParams.get("page")) || 1;

    const page = Math.max(1, Math.floor(requestedPage));

    const { status, data, reload } = useAsync(
        () => (query.trim() ? searchAnimeByName(query, page, PER_PAGE) : getAnimePage(page, PER_PAGE)),
        [query, page],
    );

    const total = data?.total ?? 0;
    const lastPage = data?.lastPage ?? 1;
    const pageItems = data?.items ?? [];

    const handleSearch = (value: string) => {
        setSearchParams(value ? { q: value } : {});
    };

    const handlePageChange = (next: number) => {
        const params = new URLSearchParams(searchParams);
        if (next > 1) {
            params.set("page", String(next));
        } else {
            params.delete("page");
        }
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <PageContainer className="flex flex-col gap-6 py-6">
            <Breadcrumb items={[{ label: "Catalogue", to: "/catalogue" }, { label: query ? `Search: “${query}”` : "Search" }]} />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Catalogue</h1>
                <p className="text-sm text-on-surface-variant" aria-live="polite">
                    {status === "success" && (
                        <>
                            {total} {total === 1 ? "result" : "results"}
                            {query && ` for “${query}”`}
                        </>
                    )}
                </p>
            </div>

            <AppSearchBar defaultValue={query} onSearch={handleSearch} onClear={() => handleSearch("")} />

            {status === "loading" && <LoadingState />}
            {status === "error" && <ErrorState onRetry={reload} />}

            {status === "success" && (
                <CatalogueResultGrid
                    items={pageItems}
                    emptyState={
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
                            <p className="text-lg font-bold text-on-surface">No results</p>
                            <p className="text-sm text-on-surface-variant">
                                {query ? `No anime matches “${query}”. Try another title.` : "This page is empty."}
                            </p>
                            <button
                                type="button"
                                onClick={() => handleSearch("")}
                                className="mt-2 rounded-xl bg-surface-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
                            >
                                {query ? "Clear search" : "Back to first page"}
                            </button>
                        </div>
                    }
                />
            )}

            {status === "success" && (
                <AppPagination page={page} lastPage={lastPage} onPageChange={handlePageChange} className="mt-4" />
            )}
        </PageContainer>
    );
}

export default Catalogue;
