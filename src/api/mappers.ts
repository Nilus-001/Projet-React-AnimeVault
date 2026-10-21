import type {
    ApiAnime,
    ApiEntityRef,
    ApiListResponse,
    ApiRelation,
} from "../types/api.ts";
import type {
    Anime,
    AnimeDetail,
    AnimeRelation,
    AnimeSeason,
    AnimeStatus,
    AnimeType,
    NamedRef,
    Paginated,
} from "../types/anime.ts";

const STATUSES: readonly AnimeStatus[] = ["Finished Airing", "Currently Airing", "Not yet aired"];
const SEASONS: readonly AnimeSeason[] = ["winter", "spring", "summer", "fall"];
const TYPES: readonly AnimeType[] = ["TV", "Movie", "OVA", "ONA", "Special", "TV Special", "Music", "CM", "PV"];

function oneOf<T extends string>(value: string | null | undefined, allowed: readonly T[]): T | null {
    return value != null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function toStatus(api: ApiAnime): AnimeStatus {
    return oneOf(api.status, STATUSES) ?? (api.airing ? "Currently Airing" : "Finished Airing");
}

const toRef = (ref: ApiEntityRef): NamedRef => ({ id: ref.mal_id, name: ref.name });
const toRefs = (refs: ApiEntityRef[] | null | undefined): NamedRef[] => (refs ?? []).map(toRef);

const toRelation = (rel: ApiRelation): AnimeRelation => ({
    relation: rel.relation,
    entries: toRefs(rel.entry),
});

export function toAnime(api: ApiAnime): Anime {
    return {
        id: api.mal_id,
        url: api.url,

        title: api.title,
        titleEnglish: api.title_english,
        titleJapanese: api.title_japanese,
        synonyms: api.title_synonyms ?? [],

        image: api.images,
        trailer: api.trailer,
        synopsis: api.synopsis,

        type: oneOf(api.type, TYPES),
        source: api.source,
        episodes: api.episodes,
        duration: api.duration,
        rating: api.rating,

        status: toStatus(api),
        airing: api.airing,
        aired: {
            from: api.aired?.from ?? null,
            to: api.aired?.to ?? null,
            label: api.aired?.string ?? null,
        },
        season: oneOf(api.season?.toLowerCase(), SEASONS),
        year: api.year,
        broadcast: {
            day: api.broadcast?.day ?? null,
            time: api.broadcast?.time ?? null,
            timezone: api.broadcast?.timezone ?? null,
            string: api.broadcast?.string ?? null,
        },

        score: api.score,
        rank: api.rank,
        popularity: api.popularity,
        members: api.members,
        favorites: api.favorites,

        studios: toRefs(api.studios),
        producers: toRefs(api.producers),
        licensors: toRefs(api.licensors),
        genres: toRefs(api.genres),
        themes: toRefs(api.themes),
        demographics: toRefs(api.demographics),

        streaming: api.streaming ?? [],
        external: api.external ?? [],
    };
}

export function toAnimeDetail(api: ApiAnime): AnimeDetail {
    return {
        ...toAnime(api),
        explicitGenres: toRefs(api.explicit_genres),
        relations: (api.relations ?? []).map(toRelation),
        openings: api.theme?.openings ?? [],
        endings: api.theme?.endings ?? [],
    };
}

export function toPaginatedAnime(res: ApiListResponse<ApiAnime>): Paginated<Anime> {
    const items = res.data.map(toAnime);
    const p = res.pagination;
    return {
        items,
        page: p?.current_page ?? 1,
        lastPage: p?.last_visible_page ?? 1,
        hasNextPage: p?.has_next_page ?? false,
        total: p?.items.total ?? items.length,
        perPage: p?.items.per_page ?? items.length,
    };
}
