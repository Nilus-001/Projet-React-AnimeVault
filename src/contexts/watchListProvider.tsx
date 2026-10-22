import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import type { Anime } from "../types/anime.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";

const WATCHLIST_STORAGE_KEY = "anivault-watchlist";
const PROGRESS_STORAGE_KEY = "anivault-progress";

type EpisodeProgress = Record<string, number>;

const isWatchList = (value: unknown): value is Anime["id"][] =>
    Array.isArray(value) && value.every((item) => typeof item === "number");

const isEpisodeProgress = (value: unknown): value is EpisodeProgress =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === "number");

type WatchListContextValue = {
    watchList: Anime["id"][];
    addToWatchList: (animeId: Anime["id"]) => void;
    removeFromWatchList: (animeId: Anime["id"]) => void;
    isInWatchList: (animeId: Anime["id"]) => boolean;
    getEpisode: (animeId: Anime["id"]) => number;
    incrementEpisode: (animeId: Anime["id"], totalEpisodes: number | null) => void;
};

const WatchListContext = createContext<WatchListContextValue | null>(null);

export function WatchListProvider({ children }: { children: ReactNode }) {
    const [watchList, setWatchList] = useLocalStorage<Anime["id"][]>(WATCHLIST_STORAGE_KEY, [], isWatchList);
    const [progress, setProgress] = useLocalStorage<EpisodeProgress>(PROGRESS_STORAGE_KEY, {}, isEpisodeProgress);

    const addToWatchList = useCallback(
        (animeId: Anime["id"]) => {
            setWatchList((prev) => (prev.includes(animeId) ? prev : [...prev, animeId]));
        },
        [setWatchList],
    );

    const removeFromWatchList = useCallback(
        (animeId: Anime["id"]) => {
            setWatchList((prev) => prev.filter((item) => item !== animeId));
        },
        [setWatchList],
    );

    const isInWatchList = useCallback((animeId: Anime["id"]) => watchList.includes(animeId), [watchList]);

    const getEpisode = useCallback((animeId: Anime["id"]) => progress[animeId] ?? 0, [progress]);

    const incrementEpisode = useCallback(
        (animeId: Anime["id"], totalEpisodes: number | null) => {
            setProgress((prev) => {
                const current = prev[animeId] ?? 0;
                const next = totalEpisodes === null ? current + 1 : Math.min(current + 1, totalEpisodes);
                return next === current ? prev : { ...prev, [animeId]: next };
            });
        },
        [setProgress],
    );

    const value = useMemo(
        () => ({ watchList, addToWatchList, removeFromWatchList, isInWatchList, getEpisode, incrementEpisode }),
        [watchList, addToWatchList, removeFromWatchList, isInWatchList, getEpisode, incrementEpisode],
    );

    return <WatchListContext.Provider value={value}>{children}</WatchListContext.Provider>;
}

export function useWatchListContext() {
    const context = useContext(WatchListContext);
    if (!context) {
        throw new Error("useWatchListContext must be used within a WatchListProvider");
    }
    return context;
}
