import type { ApiAvailabilityStatus, ApiProduct, ApiProductList, ApiReview } from "../types/api.ts";
import type { Anime, AnimeDetail, AnimeSeason, AnimeStatus, NamedRef, Paginated, Review } from "../types/anime.ts";

const STATUS_BY_AVAILABILITY: Record<ApiAvailabilityStatus, AnimeStatus> = {
    "In Stock": "Finished Airing",
    "Low Stock": "Currently Airing",
    "Out of Stock": "Not yet aired",
};

const SEASONS: AnimeSeason[] = ["winter", "spring", "summer", "fall"];

const WEEKDAYS = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];

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
    return { day, time: "23:00", timezone: "Asia/Tokyo", string: `${day} at 23:00 (JST)` };
}

function toReview(review: ApiReview): Review {
    return {
        author: review.reviewerName,
        score: review.rating * 2,
        comment: review.comment,
        date: review.date,
    };
}

export function toAnime(product: ApiProduct): Anime {
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
        duration: product.weight != null ? `${product.weight} min per ep` : null,
        rating: product.minimumOrderQuantity >= 13 ? "PG-13 - Teens 13 or older" : "G - All Ages",

        status,
        airing: status === "Currently Airing",
        aired: { from: product.meta?.createdAt ?? null, to: product.meta?.updatedAt ?? null, label: null },
        season: SEASONS[product.id % SEASONS.length],
        year: validDate ? created.getFullYear() : null,
        broadcast: toBroadcast(product.id),

        score: product.rating != null ? Math.round(product.rating * 200) / 100 : null,
        rank: null,
        popularity: null,
        members: product.stock != null ? product.stock * 100 : null,
        favorites: product.reviews?.length ?? 0,

        studios: product.brand ? [toRef(product.brand)] : [],
        producers: [],
        licensors: [],
        genres: [toRef(category)],
        themes: [...new Set(tags.map(capitalize))].filter((name) => name !== category).map(toRef),
        demographics: [],

        streaming: [],
        external: [],
    };
}

export function toAnimeDetail(product: ApiProduct): AnimeDetail {
    return {
        ...toAnime(product),
        explicitGenres: [],
        relations: [],
        openings: [],
        endings: [],
        reviews: (product.reviews ?? []).map(toReview),
    };
}

export function toAnimeList(products: ApiProduct[]): Anime[] {
    return products.map(toAnime);
}

export function toAnimePage(response: ApiProductList): Paginated<Anime> {
    const perPage = response.limit || response.products.length || 1;
    return {
        items: toAnimeList(response.products),
        page: Math.floor(response.skip / perPage) + 1,
        lastPage: Math.max(1, Math.ceil(response.total / perPage)),
        total: response.total,
        perPage,
    };
}

const AVAILABILITY_BY_STATUS: Record<AnimeStatus, ApiAvailabilityStatus> = {
    "Finished Airing": "In Stock",
    "Currently Airing": "Low Stock",
    "Not yet aired": "Out of Stock",
};

const EMPTY_PRODUCT: Omit<ApiProduct, "id" | "title"> = {
    description: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    tags: [],
    sku: "",
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "",
    minimumOrderQuantity: 1,
    meta: { createdAt: "", updatedAt: "", barcode: "", qrCode: "" },
    images: [],
    thumbnail: "",
};

function toSlug(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function parseWeight(duration: string | null): number | null {
    const match = duration?.match(/^(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : null;
}

function toApiReview(review: Review, original?: ApiReview): ApiReview {
    return {
        rating: review.score / 2,
        comment: review.comment,
        date: review.date,
        reviewerName: review.author,
        reviewerEmail: original?.reviewerEmail ?? "",
    };
}

function toApiReviews(reviews: Review[], originals: ApiReview[] = []): ApiReview[] {
    return reviews.map((review) =>
        toApiReview(
            review,
            originals.find((item) => item.reviewerName === review.author && item.date === review.date),
        ),
    );
}

function toMinimumOrderQuantity(rating: string | null, original?: number): number {
    const isTeen = rating?.startsWith("PG-13") ?? false;
    if (original !== undefined && original >= 13 === isTeen) return original;
    return isTeen ? 13 : 1;
}

export function toProduct(anime: Anime | AnimeDetail, base: Partial<ApiProduct> = {}): ApiProduct {
    const meta = { ...EMPTY_PRODUCT.meta, ...base.meta };
    const category = anime.genres[0]?.name ?? anime.source;

    return {
        ...EMPTY_PRODUCT,
        ...base,
        id: anime.id,
        title: anime.title,
        description: anime.synopsis ?? base.description ?? "",
        category: category ? toSlug(category) : (base.category ?? ""),
        rating: anime.score !== null ? anime.score / 2 : (base.rating ?? 0),
        stock: anime.episodes ?? base.stock ?? 0,
        tags: anime.synonyms.length > 0 ? anime.synonyms : (base.tags ?? []),
        brand: anime.studios[0]?.name ?? base.brand,
        sku: anime.titleJapanese ?? base.sku ?? "",
        weight: parseWeight(anime.duration) ?? base.weight ?? 0,
        availabilityStatus: AVAILABILITY_BY_STATUS[anime.status],
        reviews: "reviews" in anime ? toApiReviews(anime.reviews, base.reviews) : (base.reviews ?? []),
        minimumOrderQuantity: toMinimumOrderQuantity(anime.rating, base.minimumOrderQuantity),
        meta: {
            ...meta,
            createdAt: anime.aired.from ?? meta.createdAt,
            updatedAt: anime.aired.to ?? meta.updatedAt,
        },
        images: base.images?.length ? [anime.image, ...base.images.filter((img) => img !== anime.image)] : [anime.image],
        thumbnail: base.thumbnail ?? anime.image,
    };
}
