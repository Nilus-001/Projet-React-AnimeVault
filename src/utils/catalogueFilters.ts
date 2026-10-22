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

const STATUS_PARAM: Record<AnimeStatus, string> = {
    "Currently Airing": "airing",
    "Finished Airing": "finished",
    "Not yet aired": "upcoming",
};

function readList(params: URLSearchParams, key: string): string[] {
    return (params.get(key) ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}

export function parseFilters(params: URLSearchParams): CatalogueFilters {
    const statusValues = readList(params, "status");
    const score = Number(params.get("score"));

    return {
        query: params.get("q") ?? "",
        statuses: FILTER_STATUSES.filter((status) => statusValues.includes(STATUS_PARAM[status])),
        genres: readList(params, "genres"),
        studios: readList(params, "studios"),
        minScore: Number.isFinite(score) && score > SCORE_MIN ? Math.min(score, SCORE_MAX) : SCORE_MIN,
    };
}

export function filtersToParams(filters: CatalogueFilters): URLSearchParams {
    const params = new URLSearchParams();
    const query = filters.query.trim();
    if (query) params.set("q", query);
    if (filters.statuses.length > 0) params.set("status", filters.statuses.map((s) => STATUS_PARAM[s]).join(","));
    if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
    if (filters.studios.length > 0) params.set("studios", filters.studios.join(","));
    if (filters.minScore > SCORE_MIN) params.set("score", String(filters.minScore));
    return params;
}

export function countActiveFilters(filters: CatalogueFilters): number {
    return (
        filters.statuses.length +
        filters.genres.length +
        filters.studios.length +
        (filters.minScore > SCORE_MIN ? 1 : 0)
    );
}

export function clearFilters(filters: CatalogueFilters): CatalogueFilters {
    return { query: filters.query, statuses: [], genres: [], studios: [], minScore: SCORE_MIN };
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
