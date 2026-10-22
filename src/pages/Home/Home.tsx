import { useMemo } from "react";
import AppBanner from "../../components/cores/banner/AppBanner.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import LinearPresentationCardContainer, {
    type AnimeCard,
} from "../../components/cores/container/LinearPresentationCardContainer.tsx";
import {
    ErrorState,
    LoadingState,
} from "../../components/cores/feedback/AsyncFeedback.tsx";
import { getAllAnime } from "../../api/search/anime.ts";
import { useAsync } from "../../hooks/useAsync.ts";
import type { Anime } from "../../types/anime.ts";
import { useWatchListContext } from "../../contexts/watchListProvider.tsx";
import { airsOn, getDisplayTitle, getTodayWeekday } from "../../utils/anime.ts";

function toAnimeCard(anime: Anime, extra: Partial<AnimeCard> = {}): AnimeCard {
    return {
        id: anime.id,
        title: getDisplayTitle(anime),
        subtitle:
            anime.title !== getDisplayTitle(anime)
                ? anime.title
                : (anime.titleJapanese ?? undefined),
        image: anime.image,
        episodes: anime.episodes,
        ...extra,
    };
}

function Home() {
    const weekday = getTodayWeekday();
    const { status, data, reload } = useAsync(getAllAnime, []);
    const { watchList, getEpisode, incrementEpisode } = useWatchListContext();

    const animeById = useMemo(
        () => new Map((data ?? []).map((anime) => [anime.id, anime])),
        [data],
    );
    const airing = useMemo(
        () => (data ?? []).filter((anime) => anime.airing),
        [data],
    );
    const bannerSlides = useMemo(
        () =>
            [...airing]
                .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                .slice(0, 3),
        [airing],
    );

    const continueWatching = watchList.flatMap((animeId) => {
        const anime = animeById.get(animeId);
        return anime
            ? [toAnimeCard(anime, { currentEpisode: getEpisode(animeId) })]
            : [];
    });

    const airingToday = airing
        .filter((anime) => airsOn(anime, weekday))
        .map((anime) =>
            toAnimeCard(anime, {
                badge: anime.broadcast.time
                    ? `${anime.broadcast.time} JST`
                    : undefined,
            }),
        );

    return (
        <>
            <h1 className="sr-only">AnimeVault — Home</h1>

            {status === "loading" && <LoadingState className="py-32" />}

            {status === "error" && (
                <PageContainer className="py-10">
                    <ErrorState onRetry={reload} />
                </PageContainer>
            )}

            {status === "success" && (
                <>
                    {bannerSlides.length > 0 && (
                        <AppBanner slides={bannerSlides} />
                    )}

                    <PageContainer className="flex flex-col gap-10 py-8">
                        <LinearPresentationCardContainer
                            title="Continue Watching"
                            icon="▶"
                            items={continueWatching}
                            emptyMessage="Add anime to your watchlist to see them here."
                            onAddEpisode={(anime) =>
                                incrementEpisode(anime.id, anime.episodes)
                            }
                        />
                        <LinearPresentationCardContainer
                            title={`Airing Today – ${weekday} Schedule`}
                            icon="▶"
                            items={airingToday}
                            emptyMessage={`Nothing airing on ${weekday}.`}
                        />
                    </PageContainer>
                </>
            )}
        </>
    );
}

export default Home;
