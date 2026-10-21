import { useState } from "react";
import AppBanner from "../../components/cores/banner/AppBanner.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import LinearPresentationCardContainer, {
    type AnimeCard,
} from "../../components/cores/container/LinearPresentationCardContainer.tsx";
import { MOCK_ANIME, MOCK_ANIME_BY_ID, MOCK_WATCH_PROGRESS } from "../../mocks/anime.ts";
import type { Anime, WatchProgress } from "../../types/anime.ts";
import { airsOn, getDisplayTitle, getTodayWeekday } from "../../utils/anime.ts";
//! ------------------------------ MOCK -----------------------------------------

function toAnimeCard(anime: Anime, extra: Partial<AnimeCard> = {}): AnimeCard {
    return {
        id: anime.id,
        title: getDisplayTitle(anime),
        subtitle: anime.title !== getDisplayTitle(anime) ? anime.title : (anime.titleJapanese ?? undefined),
        image: anime.image,
        episodes: anime.episodes,
        ...extra,
    };
}

const airing = MOCK_ANIME.filter((anime) => anime.status === "Currently Airing");

const BANNER_SLIDES = [...airing].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
//! ------------------------------  -----------------------------------------




function Home() {
    const [progress, setProgress] = useState<WatchProgress[]>(MOCK_WATCH_PROGRESS);
    const weekday = getTodayWeekday();




    //! ------------------------------ MOCK -----------------------------------------
    const incrementEpisode = (animeId: number) => {
        setProgress((prev) =>
            prev.map((entry) => {
                if (entry.animeId !== animeId) return entry;
                const total = MOCK_ANIME_BY_ID.get(animeId)?.episodes ?? Infinity;
                return { ...entry, currentEpisode: Math.min(entry.currentEpisode + 1, total) };
            }),
        );
    };

    const continueWatching = progress.flatMap((entry) => {
        const anime = MOCK_ANIME_BY_ID.get(entry.animeId);
        return anime ? [toAnimeCard(anime, { currentEpisode: entry.currentEpisode })] : [];
    });

    const airingToday = airing
        .filter((anime) => airsOn(anime, weekday))
        .map((anime) =>
            toAnimeCard(anime, { badge: anime.broadcast.time ? `${anime.broadcast.time} JST` : undefined }),
        );
    //! ------------------------------  -----------------------------------------


    return (
        <>
            <h1 className="sr-only">AnimeVault — Home</h1>
            <AppBanner slides={BANNER_SLIDES} />

            <PageContainer className="flex flex-col gap-10 py-8">
                <LinearPresentationCardContainer
                    title="Continue Watching"
                    icon="▶"
                    items={continueWatching}
                    emptyMessage="You are not watching anything yet."
                    onAddEpisode={(anime) => incrementEpisode(anime.id)}
                />
                <LinearPresentationCardContainer
                    title={`Airing Today – ${weekday} Schedule`}
                    icon="▶"
                    items={airingToday}
                    emptyMessage={`Nothing airing on ${weekday}.`}
                />
            </PageContainer>
        </>
    );
}

export default Home;
