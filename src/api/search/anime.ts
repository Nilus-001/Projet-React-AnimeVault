import { API_URL } from "../config.ts";
import { toAnimeDetail, toAnimeList, toAnimePage } from "../mappers.ts";
import type {
    ApiCategory,
    ApiProduct,
    ApiProductList,
} from "../../types/api.ts";
import type {
    Anime,
    AnimeDetail,
    AnimeSort,
    CatalogueQuery,
    Genre,
    Paginated,
} from "../../types/anime.ts";

const MAX_RETRY = 3;

export class ApiError extends Error {
    status: number;

    constructor(status: number) {
        super(`HTTP ${status}`);
        this.name = "ApiError";
        this.status = status;
    }
}

async function get<T>(path: string): Promise<T> {
    let lastError: unknown = null;
    for (let attempt = 0; attempt < MAX_RETRY; attempt++) {
        try {
            const response = await fetch(API_URL + path);
            if (response.ok) return (await response.json()) as T;
            lastError = new ApiError(response.status);
            if (response.status < 500) break;
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError;
}

function pageQuery(page: number, perPage: number): string {
    return `limit=${perPage}&skip=${(page - 1) * perPage}`;
}

const SORT_PARAMS: Record<
    AnimeSort,
    { sortBy: string; order: "asc" | "desc" } | null
> = {
    default: null,
    score: { sortBy: "rating", order: "desc" },
    title: { sortBy: "title", order: "asc" },
    popularity: { sortBy: "stock", order: "desc" },
};

let allAnimeCache: Promise<Anime[]> | null = null;

export function getAllAnime(): Promise<Anime[]> {
    allAnimeCache ??= get<ApiProductList>("/products?limit=0")
        .then((response) => toAnimeList(response.products))
        .catch((err) => {
            allAnimeCache = null;
            throw err;
        });
    return allAnimeCache;
}

let genresCache: Promise<Genre[]> | null = null;

export function getGenres(): Promise<Genre[]> {
    genresCache ??= get<ApiCategory[]>("/products/categories")
        .then((categories) =>
            categories.map(({ slug, name }) => ({ slug, name })),
        )
        .catch((err) => {
            genresCache = null;
            throw err;
        });
    return genresCache;
}

export async function getCatalogue({
    query,
    genre,
    sort,
    page,
    perPage,
}: CatalogueQuery): Promise<Paginated<Anime>> {
    const params = new URLSearchParams({
        limit: String(perPage),
        skip: String((page - 1) * perPage),
    });

    const sortParams = SORT_PARAMS[sort];
    if (sortParams) {
        params.set("sortBy", sortParams.sortBy);
        params.set("order", sortParams.order);
    }

    let path = "/products";
    if (query) {
        path = "/products/search";
        params.set("q", query);
    } else if (genre) {
        path = `/products/category/${encodeURIComponent(genre)}`;
    }

    return toAnimePage(
        await get<ApiProductList>(`${path}?${params}`),
        perPage,
    );
}

export async function getAnimePage(
    page = 1,
    perPage = 20,
): Promise<Paginated<Anime>> {
    return toAnimePage(
        await get<ApiProductList>(`/products?${pageQuery(page, perPage)}`),
        perPage,
    );
}

export async function searchAnimeByName(
    query: string,
    page = 1,
    perPage = 20,
): Promise<Paginated<Anime>> {
    const q = encodeURIComponent(query.trim());
    return toAnimePage(
        await get<ApiProductList>(
            `/products/search?q=${q}&${pageQuery(page, perPage)}`,
        ),
        perPage,
    );
}

export async function getAnimeByGenre(
    slug: string,
    page = 1,
    perPage = 20,
): Promise<Paginated<Anime>> {
    const path = `/products/category/${encodeURIComponent(slug)}?${pageQuery(page, perPage)}`;
    return toAnimePage(await get<ApiProductList>(path), perPage);
}

export async function getAnimeById(id: number): Promise<AnimeDetail> {
    return toAnimeDetail(await get<ApiProduct>(`/products/${id}`));
}
