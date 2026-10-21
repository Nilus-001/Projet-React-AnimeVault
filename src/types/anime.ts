/**
 * Single source of truth for anime data in the app (camelCase, UI-friendly).
 * Built from the raw API shape (`ApiAnime`, src/types/api.ts) by `toAnime()` in src/api/mappers.ts.
 */

export type AnimeStatus = "Finished Airing" | "Currently Airing" | "Not yet aired";

export type AnimeType = "TV" | "Movie" | "OVA" | "ONA" | "Special" | "TV Special" | "Music" | "CM" | "PV";

export type AnimeSeason = "winter" | "spring" | "summer" | "fall";

/**
 * Origin of the adaptation, as sent by MAL ("Original", "Manga", "Light novel", "Web manga"…).
 * Kept open (`string & {}`) because MAL has many values, while still autocompleting the common ones.
 */
export type AnimeSource =
    | "Original"
    | "Manga"
    | "Web manga"
    | "4-koma manga"
    | "Light novel"
    | "Novel"
    | "Web novel"
    | "Visual novel"
    | "Game"
    | "Other"
    | (string & {});

/** Studio, producer, licensor, genre, theme or demographic. The id is needed for API filters. */
export type NamedRef = {
    id: number;
    name: string;
};

export type ExternalLink = {
    name: string;
    url: string;
};

export type AnimeBroadcast = {
    /** Plural weekday, e.g. "Fridays". */
    day: string | null;
    /** "HH:mm" (JST). */
    time: string | null;
    timezone: string | null;
    /** Human readable, e.g. "Fridays at 23:00 (JST)". */
    string: string | null;
};

export type AnimeAired = {
    /** ISO 8601. */
    from: string | null;
    to: string | null;
    /** e.g. "Apr 5, 1998 to Sep 27, 1998". */
    label: string | null;
};

/** What lists, cards, the banner and the catalogue need. */
export type Anime = {
    /** MyAnimeList id (`mal_id`). */
    id: number;
    /** MyAnimeList page. */
    url: string;

    /** Default (romaji) title. */
    title: string;
    titleEnglish: string | null;
    titleJapanese: string | null;
    synonyms: string[];

    /** Poster URL. */
    image: string;
    trailer: string | null;
    synopsis: string | null;

    type: AnimeType | null;
    source: AnimeSource | null;
    episodes: number | null;
    /** e.g. "24 min per ep". */
    duration: string | null;
    /** Age rating, e.g. "PG-13 - Teens 13 or older". */
    rating: string | null;

    status: AnimeStatus;
    airing: boolean;
    aired: AnimeAired;
    season: AnimeSeason | null;
    year: number | null;
    broadcast: AnimeBroadcast;

    score: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;

    studios: NamedRef[];
    producers: NamedRef[];
    licensors: NamedRef[];
    genres: NamedRef[];
    themes: NamedRef[];
    demographics: NamedRef[];

    /** Legal streaming platforms (Netflix, Crunchyroll…). */
    streaming: ExternalLink[];
    /** Wikipedia, AniList… */
    external: ExternalLink[];
};

export type AnimeRelation = {
    /** "Sequel", "Prequel", "Adaptation"… */
    relation: string;
    entries: NamedRef[];
};

/** Extra fields only needed by the detail page. */
export type AnimeDetail = Anime & {
    explicitGenres: NamedRef[];
    relations: AnimeRelation[];
    openings: string[];
    endings: string[];
};

/** Local user data: how far the user is in a given anime. */
export type WatchProgress = {
    animeId: Anime["id"];
    currentEpisode: number;
};

export type Paginated<T> = {
    items: T[];
    page: number;
    lastPage: number;
    hasNextPage: boolean;
    total: number;
    perPage: number;
};
