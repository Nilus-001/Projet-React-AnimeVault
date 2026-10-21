import type { Anime, AnimeStatus, NamedRef } from "../types/anime.ts";

export function getDisplayTitle(anime: Pick<Anime, "title" | "titleEnglish">): string {
    return anime.titleEnglish ?? anime.title;
}

export function formatSeason(anime: Pick<Anime, "season" | "year">): string | null {
    if (!anime.season) return anime.year ? String(anime.year) : null;
    const season = anime.season.charAt(0).toUpperCase() + anime.season.slice(1);
    return anime.year ? `${season} ${anime.year}` : season;
}

export function formatScore(score: Anime["score"]): string {
    return score === null ? "N/A" : score.toFixed(2);
}

export const STATUS_META: Record<AnimeStatus, { label: string; className: string }> = {
    "Finished Airing": { label: "Finished", className: "text-pink-400" },
    "Currently Airing": { label: "Airing", className: "text-emerald-400" },
    "Not yet aired": { label: "Upcoming", className: "text-amber-300" },
};

export function getTodayWeekday(): string {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export function airsOn(anime: Pick<Anime, "broadcast">, weekday: string): boolean {
    return anime.broadcast.day?.toLowerCase().startsWith(weekday.toLowerCase()) ?? false;
}

export function joinNames(refs: NamedRef[], separator = ", "): string {
    return refs.map((ref) => ref.name).join(separator);
}
