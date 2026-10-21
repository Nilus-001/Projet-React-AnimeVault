import type { ApiAnime, ApiAnimeListResponse, ApiEntityRef, ApiRelation } from "../types/api.ts";
import type { Anime, AnimeDetail, AnimeRelation, AnimeSeason, AnimeStatus, NamedRef } from "../types/anime.ts";

const STATUSES: readonly AnimeStatus[] = ["Finished Airing", "Currently Airing", "Not yet aired"];
const SEASONS: readonly AnimeSeason[] = ["winter", "spring", "summer", "fall"];

function oneOf<T extends string>(value: string | null | undefined, allowed: readonly T[]): T | null {
    return value != null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

const orNull = <T>(value: T | null | undefined): T | null => (value === "" || value == null ? null : value);

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
        titleEnglish: orNull(api.title_english),
        titleJapanese: orNull(api.title_japanese),
        synonyms: api.title_synonyms ?? [],

        image: api.images,
        trailer: orNull(api.trailer),
        synopsis: orNull(api.synopsis),

        source: orNull(api.source),
        episodes: api.episodes ?? null,
        duration: orNull(api.duration),
        rating: orNull(api.rating),

        status: oneOf(api.status, STATUSES) ?? (api.airing ? "Currently Airing" : "Finished Airing"),
        airing: api.airing,
        aired: {
            from: api.aired?.from ?? null,
            to: api.aired?.to ?? null,
            label: api.aired?.string ?? null,
        },
        season: oneOf(api.season?.toLowerCase(), SEASONS),
        year: api.year ?? null,
        broadcast: {
            day: api.broadcast?.day ?? null,
            time: api.broadcast?.time ?? null,
            timezone: api.broadcast?.timezone ?? null,
            string: api.broadcast?.string ?? null,
        },

        score: api.score ?? null,
        rank: api.rank ?? null,
        popularity: api.popularity ?? null,
        members: api.members ?? null,
        favorites: api.favorites ?? null,

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

export function toAnimeList(res: ApiAnimeListResponse): Anime[] {
    return res.data.map(toAnime);
}
