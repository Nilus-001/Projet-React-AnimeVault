import {API_URL} from "../config.ts";

const BASE_NB_MAX_RETRY : number = 10;
async function fetchUrl(url: string) {
    try {
        let response =  await fetch(url);
        let nb_try : number = 0;
        while (!response.ok || nb_try < BASE_NB_MAX_RETRY) {
            nb_try++;
            response = await fetch(url);
        }

        return response;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function searchAnimeByName(query: string) {
    const url = API_URL + "/anime/search?query=" + encodeURIComponent(query);
}
