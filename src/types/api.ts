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
    trailer: string | null;
    approved: boolean;
    titles: ApiTitle[];
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    title_synonyms: string[];
    type?: string | null;
    source: string | null;
    episodes: number | null;
    status: string;
    airing: boolean;
    aired: ApiAired;
    duration: string | null;
    rating: string | null;
    score: number | null;
    scored_by?: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    season: string | null;
    year: number | null;
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

export type ApiPagination = {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
        count: number;
        total: number;
        per_page: number;
    };
};

export type ApiListResponse<T> = {
    data: T[];
    pagination?: ApiPagination;
};

export type ApiItemResponse<T> = {
    data: T;
};
