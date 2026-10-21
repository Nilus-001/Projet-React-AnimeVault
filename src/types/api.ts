export type ApiEntityRef = {
    mal_id: number;
    type: string;
    name: string;
    url: string;
};

export type ApiTitle = {
    type: string;
    title: string;
};

export type ApiDateParts = {
    day: number | null;
    month: number | null;
    year: number | null;
};

export type ApiAired = {
    from: string | null;
    to: string | null;
    prop: {
        from: ApiDateParts;
        to: ApiDateParts;
    };
    string: string | null;
};

export type ApiBroadcast = {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
};

export type ApiLink = {
    name: string;
    url: string;
};

export type ApiRelation = {
    relation: string;
    entry: ApiEntityRef[];
};

export type ApiAnime = {
    mal_id: number;
    url: string;
    images: string;
    trailer: string;
    approved: boolean;
    titles: ApiTitle[];
    title: string;
    title_english: string;
    title_japanese: string;
    title_synonyms: string[];
    source: string;
    episodes: number | null;
    status: string;
    airing: boolean;
    aired: ApiAired;
    duration: string;
    rating: string;
    score: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    season: string;
    year: number;
    broadcast: ApiBroadcast;
    producers: ApiEntityRef[];
    licensors: ApiEntityRef[];
    studios: ApiEntityRef[];
    genres: ApiEntityRef[];
    explicit_genres: ApiEntityRef[];
    themes: ApiEntityRef[];
    demographics: ApiEntityRef[];
    relations: ApiRelation[];
    theme: {
        openings: string[];
        endings: string[];
    };
    external: ApiLink[];
    streaming: ApiLink[];
};

export type ApiAnimeListResponse = {
    data: ApiAnime[];
};
