import type { Anime, AnimeBroadcast, NamedRef, WatchProgress } from "../types/anime.ts";

/**
 * Mock data used while the UI skeleton is being built.
 * Will be replaced by Jikan (MyAnimeList) API calls.
 */

const poster = (n: number) => `https://picsum.photos/seed/anivault-${n}/450/636`;

const broadcast = (day: string, time: string): AnimeBroadcast => ({
    day,
    time,
    timezone: "Asia/Tokyo",
    string: `${day} at ${time} (JST)`,
});

const NO_BROADCAST: AnimeBroadcast = { day: null, time: null, timezone: null, string: null };

/** MyAnimeList genre ids (useful later for the `genres=` API filter). */
const GENRE_IDS: Record<string, number> = {
    Action: 1,
    Adventure: 2,
    Comedy: 4,
    Mystery: 7,
    Drama: 8,
    Fantasy: 10,
    Horror: 14,
    Romance: 22,
    "Sci-Fi": 24,
    Sports: 30,
    "Slice of Life": 36,
    Supernatural: 37,
    "Award Winning": 46,
};

/** Fake studio ids: stable per name, not real MAL ids. */
const studioIds = new Map<string, number>();
const studioRef = (name: string): NamedRef => {
    if (!studioIds.has(name)) studioIds.set(name, 1000 + studioIds.size);
    return { id: studioIds.get(name)!, name };
};
const genreRef = (name: string): NamedRef => ({ id: GENRE_IDS[name] ?? 0, name });

/** Mocks only spell out what the UI shows; the rest gets neutral defaults. */
type MockAnime = Omit<Anime, "studios" | "genres" | keyof typeof MOCK_DEFAULTS | "url" | "airing"> &
    Partial<Pick<Anime, keyof typeof MOCK_DEFAULTS | "airing">> & {
        studios: string[];
        genres: string[];
    };

const MOCK_DEFAULTS = {
    synonyms: [] as string[],
    trailer: null,
    source: null,
    duration: "24 min per ep",
    rating: "PG-13 - Teens 13 or older",
    aired: { from: null, to: null, label: null },
    rank: null,
    popularity: null,
    members: null,
    favorites: null,
    producers: [] as NamedRef[],
    licensors: [] as NamedRef[],
    themes: [] as NamedRef[],
    demographics: [] as NamedRef[],
    streaming: [] as Anime["streaming"],
    external: [] as Anime["external"],
} satisfies Partial<Anime>;

const toMockAnime = ({ studios, genres, ...rest }: MockAnime): Anime => ({
    ...MOCK_DEFAULTS,
    url: `https://myanimelist.net/anime/${rest.id}`,
    ...rest,
    airing: rest.airing ?? rest.status === "Currently Airing",
    studios: studios.map(studioRef),
    genres: genres.map(genreRef),
});

const MOCK_INPUT: MockAnime[] = [
    {
        id: 1,
        title: "Sousou no Frieren",
        titleEnglish: "Frieren: Beyond Journey's End",
        titleJapanese: "葬送のフリーレン",
        image: poster(1),
        synopsis:
            "Decades after the ten-year quest of the hero party, elven mage Frieren embarks on a quiet pilgrimage across human territories.",
        type: "TV",
        episodes: 28,
        status: "Currently Airing",
        score: 9.3,
        season: "fall",
        year: 2023,
        broadcast: broadcast("Fridays", "23:00"),
        studios: ["Madhouse"],
        genres: ["Adventure", "Drama", "Fantasy"],
    },
    {
        id: 2,
        title: "Ore dake Level Up na Ken",
        titleEnglish: "Solo Leveling",
        titleJapanese: "俺だけレベルアップな件",
        image: poster(2),
        synopsis: "The weakest hunter gains the ability to level up and grows stronger without limits.",
        type: "TV",
        episodes: 12,
        status: "Currently Airing",
        score: 8.25,
        season: "winter",
        year: 2024,
        broadcast: broadcast("Saturdays", "00:00"),
        studios: ["A-1 Pictures"],
        genres: ["Action", "Adventure", "Fantasy"],
    },
    {
        id: 3,
        title: "Dandadan",
        titleEnglish: "Dan Da Dan",
        titleJapanese: "ダンダダン",
        image: poster(3),
        synopsis: "A skeptic of ghosts and a believer in aliens team up after both are proven right.",
        type: "TV",
        episodes: 12,
        status: "Currently Airing",
        score: 8.55,
        season: "fall",
        year: 2024,
        broadcast: broadcast("Thursdays", "23:30"),
        studios: ["Science SARU"],
        genres: ["Action", "Comedy", "Supernatural"],
    },
    {
        id: 4,
        title: "Kusuriya no Hitorigoto 2nd Season",
        titleEnglish: "The Apothecary Diaries Season 2",
        titleJapanese: "薬屋のひとりごと 第2期",
        image: poster(4),
        synopsis:
            "Maomao keeps solving poisonings and palace intrigues while the mystery around Jinshi deepens.",
        type: "TV",
        episodes: 24,
        status: "Finished Airing",
        score: 8.9,
        season: "winter",
        year: 2025,
        broadcast: broadcast("Fridays", "23:40"),
        studios: ["OLM", "TOHO animation STUDIO"],
        genres: ["Drama", "Mystery"],
    },
    {
        id: 5,
        title: "Kaijuu 8-gou",
        titleEnglish: "Kaiju No. 8",
        titleJapanese: "怪獣８号",
        image: poster(5),
        synopsis:
            "A kaiju cleaner who once dreamed of joining the Defense Force suddenly gains the power to turn into a kaiju himself.",
        type: "TV",
        episodes: 12,
        status: "Finished Airing",
        score: 8.3,
        season: "spring",
        year: 2024,
        broadcast: broadcast("Saturdays", "23:00"),
        studios: ["Production I.G"],
        genres: ["Action", "Sci-Fi"],
    },
    {
        id: 6,
        title: "Oshi no Ko",
        titleEnglish: "[Oshi No Ko]",
        titleJapanese: "【推しの子】",
        image: poster(6),
        synopsis:
            "A doctor is reborn as the child of the idol he adored, and sets out to uncover the dark side of the entertainment industry.",
        type: "TV",
        episodes: 11,
        status: "Finished Airing",
        score: 8.6,
        season: "spring",
        year: 2023,
        broadcast: broadcast("Wednesdays", "23:00"),
        studios: ["Doga Kobo"],
        genres: ["Drama", "Supernatural"],
    },
    {
        id: 7,
        title: "Jujutsu Kaisen",
        titleEnglish: "Jujutsu Kaisen",
        titleJapanese: "呪術廻戦",
        image: poster(7),
        synopsis:
            "After swallowing a cursed finger, Yuji Itadori joins a secret school of sorcerers fighting curses.",
        type: "TV",
        episodes: 24,
        status: "Finished Airing",
        score: 8.6,
        season: "fall",
        year: 2020,
        broadcast: broadcast("Saturdays", "01:25"),
        studios: ["MAPPA"],
        genres: ["Action", "Award Winning", "Supernatural"],
    },
    {
        id: 8,
        title: "Spy x Family",
        titleEnglish: "Spy x Family",
        titleJapanese: "SPY×FAMILY",
        image: poster(8),
        synopsis:
            "A spy, an assassin and a telepath pretend to be a family — none of them knowing the others' secrets.",
        type: "TV",
        episodes: 12,
        status: "Currently Airing",
        score: 8.5,
        season: "spring",
        year: 2022,
        broadcast: broadcast("Mondays", "23:00"),
        studios: ["Wit Studio", "CloverWorks"],
        genres: ["Action", "Comedy"],
    },
    {
        id: 9,
        title: "Blue Lock",
        titleEnglish: "Blue Lock",
        titleJapanese: "ブルーロック",
        image: poster(9),
        synopsis:
            "Three hundred strikers are locked in a facility to forge the world's most egotistical forward.",
        type: "TV",
        episodes: 24,
        status: "Currently Airing",
        score: 8.2,
        season: "fall",
        year: 2022,
        broadcast: broadcast("Sundays", "01:30"),
        studios: ["8bit"],
        genres: ["Sports"],
    },
    {
        id: 10,
        title: "Chainsaw Man",
        titleEnglish: "Chainsaw Man",
        titleJapanese: "チェンソーマン",
        image: poster(10),
        synopsis:
            "Denji merges with his chainsaw devil dog Pochita and becomes a devil hunter for Public Safety.",
        type: "TV",
        episodes: 12,
        status: "Currently Airing",
        score: 8.5,
        season: "fall",
        year: 2022,
        broadcast: broadcast("Tuesdays", "00:00"),
        studios: ["MAPPA"],
        genres: ["Action", "Fantasy"],
    },
    {
        id: 11,
        title: "Hikaru ga Shinda Natsu",
        titleEnglish: "The Summer Hikaru Died",
        titleJapanese: "光が死んだ夏",
        image: poster(11),
        synopsis:
            "Yoshiki realises his best friend Hikaru has been replaced by something else — and chooses to stay by its side.",
        type: "TV",
        episodes: 12,
        status: "Currently Airing",
        score: 8.2,
        season: "summer",
        year: 2025,
        broadcast: broadcast("Wednesdays", "00:00"),
        studios: ["CygamesPictures"],
        genres: ["Horror", "Mystery", "Supernatural"],
    },
    {
        id: 12,
        title: "Tongari Boushi no Atelier",
        titleEnglish: "Witch Hat Atelier",
        titleJapanese: "とんがり帽子のアトリエ",
        image: poster(12),
        synopsis:
            "Coco, a village girl, discovers that magic is drawn — and becomes the apprentice of the witch Qifrey.",
        type: "TV",
        episodes: null,
        status: "Not yet aired",
        score: null,
        season: null,
        year: null,
        broadcast: NO_BROADCAST,
        studios: ["Bug Films"],
        genres: ["Adventure", "Fantasy"],
    },
];

export const MOCK_ANIME: Anime[] = MOCK_INPUT.map(toMockAnime);

export const MOCK_ANIME_BY_ID: ReadonlyMap<number, Anime> = new Map(
    MOCK_ANIME.map((anime) => [anime.id, anime]),
);

/** Mock "Continue Watching" list (only finished shows, so it never overlaps "Airing Today"). */
export const MOCK_WATCH_PROGRESS: WatchProgress[] = [
    { animeId: 4, currentEpisode: 7 },
    { animeId: 7, currentEpisode: 15 },
    { animeId: 5, currentEpisode: 3 },
    { animeId: 6, currentEpisode: 10 },
];
