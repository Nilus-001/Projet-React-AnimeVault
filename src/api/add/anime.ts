import type { Anime } from "../../types/anime.ts";
import { API_URL } from "../config.ts";
import { ApiError } from "../search/anime.ts";
import { productToAnime, AnimeToProduct } from "../mappers.ts";
import type { ApiProduct } from "../../types/api.ts";

export async function addAnime(data: Anime): Promise<Anime> {
    const { id: _id, ...product } = AnimeToProduct(data);
    const response = await fetchToAdd<ApiProduct>("/products/add", product);
    return productToAnime(response);
}

async function fetchToAdd<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(API_URL + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new ApiError(response.status);
    return (await response.json()) as T;
}
