import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { type CatalogueFilters, DEFAULT_FILTERS, clearFilters } from "../utils/catalogueFilters.ts";

type CatalogueFiltersState = {
    filters: CatalogueFilters;
    page: number;
};

type CatalogueFiltersContextValue = CatalogueFiltersState & {
    setFilters: (next: CatalogueFilters) => void;
    setQuery: (query: string) => void;
    setPage: (page: number) => void;
    clearAllFilters: () => void;
    resetAll: () => void;
};

const INITIAL_STATE: CatalogueFiltersState = { filters: DEFAULT_FILTERS, page: 1 };

const CatalogueFiltersContext = createContext<CatalogueFiltersContextValue | null>(null);

export function CatalogueFiltersProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CatalogueFiltersState>(INITIAL_STATE);

    const setFilters = useCallback((next: CatalogueFilters) => {
        setState({ filters: next, page: 1 });
    }, []);

    const setQuery = useCallback((query: string) => {
        setState((prev) => ({ filters: { ...prev.filters, query: query.trim() }, page: 1 }));
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
        () => ({ ...state, setFilters, setQuery, setPage, clearAllFilters, resetAll }),
        [state, setFilters, setQuery, setPage, clearAllFilters, resetAll],
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
