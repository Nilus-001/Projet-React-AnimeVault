import { useMemo } from "react";
import { useSearchParams } from "react-router";
import AppSearchBar from "../../components/cores/searchBar/AppSearchBar.tsx";
import Breadcrumb from "../../components/cores/breadcrumb/Breadcrumb.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import CatalogueResultGrid from "../../components/features/catalogue/CatalogueResultGrid.tsx";
import { MOCK_ANIME } from "../../mocks/anime.ts";
import type { Anime } from "../../types/anime.ts";

//! ------------------------------ MOCK -----------------------------------------

function filterByTitle(list: Anime[], query: string): Anime[] {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((anime) =>
        [anime.title, anime.titleEnglish, anime.titleJapanese].some((t) => t?.toLowerCase().includes(q)),
    );
}
//! ------------------------------  -----------------------------------------


function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    //! ------------------------------ MOCK -----------------------------------------

    const results = useMemo(() => filterByTitle(MOCK_ANIME, query), [query]);
    //! ------------------------------  -----------------------------------------

    const handleSearch = (value: string) => {
        setSearchParams(value ? { q: value } : {});
    };

    return (
        <PageContainer className="flex flex-col gap-6 py-6">
            <Breadcrumb items={[{ label: "Catalogue", to: "/catalogue" }, { label: query ? `Search: “${query}”` : "Search" }]} />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Catalogue</h1>
                <p className="text-sm text-on-surface-variant" aria-live="polite">
                    {results.length} {results.length === 1 ? "result" : "results"}
                    {query && ` for “${query}”`}
                </p>
            </div>

            <AppSearchBar defaultValue={query} onSearch={handleSearch} onClear={() => handleSearch("")} />

            <CatalogueResultGrid
                items={results}
                emptyState={
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
                        <p className="text-lg font-bold text-on-surface">No results</p>
                        <p className="text-sm text-on-surface-variant">
                            No anime matches “{query}”. Try another title.
                        </p>
                        <button
                            type="button"
                            onClick={() => handleSearch("")}
                            className="mt-2 rounded-xl bg-surface-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
                        >
                            Clear search
                        </button>
                    </div>
                }
            />
        </PageContainer>
    );
}

export default Catalogue;
