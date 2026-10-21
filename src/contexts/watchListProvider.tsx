import {createContext, type ReactElement, useContext, useState} from "react";
import type {Anime} from "../types/anime.ts";

const WatchListContext = createContext();

export function WatchListProvider({ children }: ReactElement ) {
    const [watchList, setWatchList] = useState<Anime[]>([]);

    const addToWatchList = (anime:Anime) => {
        setWatchList((prevWatchList : Anime[]):Anime[] => [...prevWatchList, anime]);
    }

    const removeToWatchList = (anime : Anime) => {
        setWatchList((prevWatchList: Anime[]):Anime[] => prevWatchList.filter((item : Anime) => item.id !== anime.id));
    }

    return (
        <WatchListContext.Provider value={{ watchList, addToWatchList, removeToWatchList }}>
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
