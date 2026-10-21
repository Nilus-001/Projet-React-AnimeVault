export type AnimeStatus = "Finished Airing" | "Currently Airing" | "Not yet aired";

export type AnimeSeason = "winter" | "spring" | "summer" | "fall";

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

export type NamedRef = {
    id: number;
    name: string;
};

export type ExternalLink = {
    name: string;
    url: string;
};

export type AnimeBroadcast = {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
};

export type AnimeAired = {
    from: string | null;
    to: string | null;
    label: string | null;
};

export type AnimeRelation = {
    relation: string;
    entries: NamedRef[];
};

export type Anime = {
    id: number;
    url: string;

    title: string;
    titleEnglish: string | null;
    titleJapanese: string | null;
    synonyms: string[];

    image: string;
    trailer: string | null;
    synopsis: string | null;

    source: AnimeSource | null;
    episodes: number | null;
    duration: string | null;
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

    streaming: ExternalLink[];
    external: ExternalLink[];
};

export type AnimeDetail = Anime & {
    explicitGenres: NamedRef[];
    relations: AnimeRelation[];
    openings: string[];
    endings: string[];
};

export type WatchProgress = {
    animeId: Anime["id"];
    currentEpisode: number;
};

export type Paginated<T> = {
    items: T[];
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
};
