import {createContext, type ReactNode, useCallback, useContext, useMemo, useState} from "react";
import type {Anime} from "../types/anime.ts";

type WatchListContextValue = {
    watchList: Anime[];
    addToWatchList: (anime: Anime) => void;
    removeFromWatchList: (animeId: Anime["id"]) => void;
    isInWatchList: (animeId: Anime["id"]) => boolean;
};

const WatchListContext = createContext<WatchListContextValue | null>(null);

export function WatchListProvider({ children }: { children: ReactNode } ) {
    const [watchList, setWatchList] = useState<Anime[]>([]);

    const addToWatchList = useCallback((anime:Anime) => {
        setWatchList((prev) => (prev.some((item) => item.id === anime.id) ? prev : [...prev, anime]));
    }, [])

    const removeFromWatchList = useCallback((animeId: Anime["id"]) => {
        setWatchList((prev) => prev.filter((item) => item.id !== animeId));
    }, [])

    const isInWatchList =
        useCallback((animeId: Anime["id"]) => watchList.some((item) => item.id === animeId),
        [watchList],
    );

    const value = useMemo(
        () => ({ watchList, addToWatchList, removeFromWatchList, isInWatchList }),
        [watchList, addToWatchList, removeFromWatchList, isInWatchList],
    );

    return (
        <WatchListContext.Provider value={value}>
        {children}
        </WatchListContext.Provider>
    )
}

export function useWatchListContext(){
    const context = useContext(WatchListContext);
    if (!context) {
        throw new Error('useWatchListContext must be used within a WatchListProvider');
    }
    return context;
}
