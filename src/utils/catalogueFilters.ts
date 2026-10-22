import type { Anime, AnimeStatus, NamedRef } from "../types/anime.ts";

export type CatalogueFilters = {
    query: string;
    statuses: AnimeStatus[];
    genres: string[];
    studios: string[];
    minScore: number;
};

export type FacetOption = {
    name: string;
    count: number;
};

export const SCORE_MIN = 5;
export const SCORE_MAX = 10;
export const SCORE_STEP = 0.5;

export const FILTER_STATUSES: AnimeStatus[] = ["Currently Airing", "Finished Airing", "Not yet aired"];

export const DEFAULT_FILTERS: CatalogueFilters = {
    query: "",
    statuses: [],
    genres: [],
    studios: [],
    minScore: SCORE_MIN,
};

export function countActiveFilters(filters: CatalogueFilters): number {
    return (
        filters.statuses.length +
        filters.genres.length +
        filters.studios.length +
        (filters.minScore > SCORE_MIN ? 1 : 0)
    );
}

export function clearFilters(filters: CatalogueFilters): CatalogueFilters {
    return { ...DEFAULT_FILTERS, query: filters.query };
}

export function toggleValue<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function matchesAny(refs: NamedRef[], selected: string[]): boolean {
    return selected.length === 0 || refs.some((ref) => selected.includes(ref.name));
}

export function applyFilters(list: Anime[], filters: CatalogueFilters): Anime[] {
    const query = filters.query.trim().toLowerCase();

    return list.filter((anime) => {
        if (query) {
            const haystack = [anime.title, anime.titleEnglish, ...anime.studios.map((s) => s.name)];
            if (!haystack.some((text) => text?.toLowerCase().includes(query))) return false;
        }
        if (filters.statuses.length > 0 && !filters.statuses.includes(anime.status)) return false;
        if (!matchesAny(anime.genres, filters.genres)) return false;
        if (!matchesAny(anime.studios, filters.studios)) return false;
        if (filters.minScore > SCORE_MIN && (anime.score ?? 0) < filters.minScore) return false;
        return true;
    });
}

export function buildFacets(list: Anime[], pick: (anime: Anime) => NamedRef[]): FacetOption[] {
    const counts = new Map<string, number>();
    for (const anime of list) {
        for (const name of new Set(pick(anime).map((ref) => ref.name))) {
            counts.set(name, (counts.get(name) ?? 0) + 1);
        }
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function countByStatus(list: Anime[]): Record<AnimeStatus, number> {
    const counts: Record<AnimeStatus, number> = { "Currently Airing": 0, "Finished Airing": 0, "Not yet aired": 0 };
    for (const anime of list) counts[anime.status] += 1;
    return counts;
}
