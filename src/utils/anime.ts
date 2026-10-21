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

const MONTH_YEAR_FR = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" });

function formatMonthYear(iso: string | null): string | null {
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : MONTH_YEAR_FR.format(date);
}

export function formatAiredRange(aired: Anime["aired"]): string | null {
    const from = formatMonthYear(aired.from);
    const to = formatMonthYear(aired.to);
    if (from && to) return from === to ? from : `${from} – ${to}`;
    if (from) return `Depuis ${from}`;
    return aired.label;
}

export function formatRatingShort(rating: Anime["rating"]): string | null {
    if (!rating) return null;
    return rating.split(" - ")[0].trim() || null;
}

export function formatEpisodes(episodes: Anime["episodes"]): string | null {
    if (episodes === null) return null;
    return `${episodes} ${episodes > 1 ? "épisodes" : "épisode"}`;
}

export const STATUS_LABEL_FR: Record<AnimeStatus, string> = {
    "Finished Airing": "Terminé",
    "Currently Airing": "En cours",
    "Not yet aired": "À venir",
};
