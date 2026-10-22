import type {
    ApiAvailabilityStatus,
    ApiProduct,
    ApiProductList,
    ApiReview,
} from "../types/api.ts";
import type {
    Anime,
    AnimeDetail,
    AnimeSeason,
    AnimeStatus,
    NamedRef,
    Paginated,
    Review,
} from "../types/anime.ts";
import type { AnimeFormValues } from "../components/features/anime-addition/AnimeAddForm.tsx";

const STATUS_BY_AVAILABILITY: Record<ApiAvailabilityStatus, AnimeStatus> = {
    "In Stock": "Finished Airing",
    "Low Stock": "Currently Airing",
    "Out of Stock": "Not yet aired",
};

const SEASONS: AnimeSeason[] = ["winter", "spring", "summer", "fall"];

const WEEKDAYS = [
    "Mondays",
    "Tuesdays",
    "Wednesdays",
    "Thursdays",
    "Fridays",
    "Saturdays",
    "Sundays",
];

function hashId(value: string): number {
    return [...value].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);
}

function capitalize(value: string): string {
    const text = value.replace(/-/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function toRef(name: string): NamedRef {
    return { id: hashId(name), name };
}

function toStatus(availability: ApiAvailabilityStatus): AnimeStatus {
    return STATUS_BY_AVAILABILITY[availability] ?? "Finished Airing";
}

function toBroadcast(id: number): Anime["broadcast"] {
    const day = WEEKDAYS[id % WEEKDAYS.length];
    return {
        day,
        time: "23:00",
        timezone: "Asia/Tokyo",
        string: `${day} at 23:00 (JST)`,
    };
}

function toReview(review: ApiReview): Review {
    return {
        author: review.reviewerName,
        score: review.rating * 2,
        comment: review.comment,
        date: review.date,
    };
}

export function productToAnime(product: ApiProduct): Anime {
    const created = new Date(product.meta?.createdAt ?? "");
    const validDate = !Number.isNaN(created.getTime());
    const status = toStatus(product.availabilityStatus);
    const tags = product.tags ?? [];
    const category = capitalize(product.category);

    return {
        id: product.id,
        url: `https://dummyjson.com/products/${product.id}`,

        title: product.title,
        titleEnglish: product.title,
        titleJapanese: product.sku ?? null,
        synonyms: tags,

        image: product.images?.[0] ?? product.thumbnail,
        trailer: null,
        synopsis: product.description ?? null,

        source: category,
        episodes: product.stock ?? null,
        duration:
            product.weight != null ? `${product.weight} min per ep` : null,
        rating:
            product.minimumOrderQuantity >= 13
                ? "PG-13 - Teens 13 or older"
                : "G - All Ages",

        status,
        airing: status === "Currently Airing",
        aired: {
            from: product.meta?.createdAt ?? null,
            to: product.meta?.updatedAt ?? null,
            label: null,
        },
        season: SEASONS[product.id % SEASONS.length],
        year: validDate ? created.getFullYear() : null,
        broadcast: toBroadcast(product.id),

        score:
            product.rating != null
                ? Math.round(product.rating * 200) / 100
                : null,
        rank: null,
        popularity: null,
        members: product.stock != null ? product.stock * 100 : null,
        favorites: product.reviews?.length ?? 0,

        studios: product.brand ? [toRef(product.brand)] : [],
        producers: [],
        licensors: [],
        genres: [toRef(category)],
        themes: [...new Set(tags.map(capitalize))]
            .filter((name) => name !== category)
            .map(toRef),
        demographics: [],

        streaming: [],
        external: [],
    };
}

export function toAnimeDetail(product: ApiProduct): AnimeDetail {
    return {
        ...productToAnime(product),
        explicitGenres: [],
        relations: [],
        openings: [],
        endings: [],
        reviews: (product.reviews ?? []).map(toReview),
    };
}

export function toAnimeList(products: ApiProduct[]): Anime[] {
    return products.map(productToAnime);
}

export function toAnimePage(
    response: ApiProductList,
    requestedPerPage?: number,
): Paginated<Anime> {
    const perPage =
        requestedPerPage || response.limit || response.products.length || 1;
    return {
        items: toAnimeList(response.products),
        page: Math.floor(response.skip / perPage) + 1,
        lastPage: Math.max(1, Math.ceil(response.total / perPage)),
        total: response.total,
        perPage,
    };
}

export function AnimeToProduct(anime: Anime): ApiProduct {
    const category = anime.genres[0]?.name ?? anime.source ?? "";
    const weight = Number(anime.duration?.match(/^(\d+(?:\.\d+)?)/)?.[1] ?? 0);
    const availability: Record<AnimeStatus, ApiAvailabilityStatus> = {
        "Finished Airing": "In Stock",
        "Currently Airing": "Low Stock",
        "Not yet aired": "Out of Stock",
    };

    return {
        id: anime.id,
        title: anime.title,
        description: anime.synopsis ?? "",
        category: category.toLowerCase().replace(/\s+/g, "-"),
        price: 0,
        discountPercentage: 0,
        rating: anime.score !== null ? anime.score / 2 : 0,
        stock: anime.episodes ?? 0,
        tags: anime.synonyms,
        brand: anime.studios[0]?.name,
        sku: anime.titleJapanese ?? "",
        weight,
        dimensions: { width: 0, height: 0, depth: 0 },
        warrantyInformation: "",
        shippingInformation: "",
        availabilityStatus: availability[anime.status],
        reviews: [],
        returnPolicy: "",
        minimumOrderQuantity: anime.rating?.startsWith("PG-13") ? 13 : 1,
        meta: {
            createdAt: anime.aired.from ?? "",
            updatedAt: anime.aired.to ?? "",
            barcode: "",
            qrCode: "",
        },
        images: [anime.image],
        thumbnail: anime.image,
    };
}

export function AnimeFormValueToAnime(value: AnimeFormValues): Anime {
    const genre = capitalize(value.genre);
    const status = value.status;

    return {
        id: 0,
        url: "",

        title: value.title.trim(),
        titleEnglish: value.title.trim(),
        titleJapanese: null,
        synonyms: [value.genre],

        image: value.image.trim(),
        trailer: null,
        synopsis: value.synopsis.trim(),

        source: genre,
        episodes: Number(value.episodes),
        duration: null,
        rating: null,

        status,
        airing: status === "Currently Airing",
        aired: { from: new Date().toISOString(), to: null, label: null },
        season: null,
        year: new Date().getFullYear(),
        broadcast: { day: null, time: null, timezone: null, string: null },

        score: Number(value.score),
        rank: null,
        popularity: null,
        members: null,
        favorites: 0,

        studios: [],
        producers: [],
        licensors: [],
        genres: [toRef(genre)],
        themes: [],
        demographics: [],

        streaming: [],
        external: [],
    };
}
