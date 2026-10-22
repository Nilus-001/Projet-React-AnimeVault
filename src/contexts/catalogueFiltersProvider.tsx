import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { AnimeSort } from "../types/anime.ts";
import { type CatalogueFilters, DEFAULT_FILTERS, clearFilters } from "../utils/catalogueFilters.ts";

type CatalogueFiltersState = {
    filters: CatalogueFilters;
    page: number;
};

type CatalogueFiltersContextValue = CatalogueFiltersState & {
    setQuery: (query: string) => void;
    setGenre: (genre: string | null) => void;
    setSort: (sort: AnimeSort) => void;
    setPage: (page: number) => void;
    clearAllFilters: () => void;
    resetAll: () => void;
};

const INITIAL_STATE: CatalogueFiltersState = { filters: DEFAULT_FILTERS, page: 1 };

const CatalogueFiltersContext = createContext<CatalogueFiltersContextValue | null>(null);

export function CatalogueFiltersProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CatalogueFiltersState>(INITIAL_STATE);

    const setQuery = useCallback((query: string) => {
        const value = query.trim();
        setState((prev) => ({
            filters: { ...prev.filters, query: value, genre: value ? null : prev.filters.genre },
            page: 1,
        }));
    }, []);

    const setGenre = useCallback((genre: string | null) => {
        setState((prev) => ({
            filters: { ...prev.filters, genre, query: genre ? "" : prev.filters.query },
            page: 1,
        }));
    }, []);

    const setSort = useCallback((sort: AnimeSort) => {
        setState((prev) => ({ filters: { ...prev.filters, sort }, page: 1 }));
    }, []);

    const setPage = useCallback((page: number) => {
        setState((prev) => ({ ...prev, page: Math.max(1, Math.floor(page)) }));
    }, []);

    const clearAllFilters = useCallback(() => {
        setState((prev) => ({ filters: clearFilters(prev.filters), page: 1 }));
    }, []);

    const resetAll = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    const value = useMemo(
        () => ({ ...state, setQuery, setGenre, setSort, setPage, clearAllFilters, resetAll }),
        [state, setQuery, setGenre, setSort, setPage, clearAllFilters, resetAll],
    );

    return <CatalogueFiltersContext.Provider value={value}>{children}</CatalogueFiltersContext.Provider>;
}

export function useCatalogueFilters() {
    const context = useContext(CatalogueFiltersContext);
    if (!context) {
        throw new Error("useCatalogueFilters must be used within a CatalogueFiltersProvider");
    }
    return context;
}
