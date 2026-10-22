import type { AnimeSort } from "../types/anime.ts";

export type CatalogueFilters = {
    query: string;
    genre: string | null;
    sort: AnimeSort;
};

export const SORT_OPTIONS: { value: AnimeSort; label: string }[] = [
    { value: "default", label: "Default" },
    { value: "score", label: "Top rated" },
    { value: "popularity", label: "Most popular" },
    { value: "title", label: "Title A–Z" },
];

export const DEFAULT_FILTERS: CatalogueFilters = {
    query: "",
    genre: null,
    sort: "default",
};

export function countActiveFilters(filters: CatalogueFilters): number {
    return (filters.genre ? 1 : 0) + (filters.sort !== "default" ? 1 : 0);
}

export function clearFilters(filters: CatalogueFilters): CatalogueFilters {
    return { ...DEFAULT_FILTERS, query: filters.query };
}
