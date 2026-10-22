import { useEffect } from "react";
import { useParams } from "react-router";
import AppButton from "../../components/cores/buttons/AppButton.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import { ErrorState, LoadingState } from "../../components/cores/feedback/AsyncFeedback.tsx";
import AnimeHero from "../../components/features/anime-detail/AnimeHero.tsx";
import AnimeSynopsis from "../../components/features/anime-detail/AnimeSynopsis.tsx";
import AnimeActionsBar from "../../components/features/anime-detail/AnimeActionsBar.tsx";
import { ApiError, getAnimeById } from "../../api/search/anime.ts";
import { useAsync } from "../../hooks/useAsync.ts";

function AnimeNotFound() {
    return (
        <PageContainer className="flex flex-col items-center gap-4 py-24 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Anime introuvable</h1>
            <p className="text-on-surface-variant">Cet anime n'existe pas ou n'est plus disponible.</p>
            <AppButton to="/catalogue">Retour au catalogue</AppButton>
        </PageContainer>
    );
}

function AnimeDetail() {
    const { id } = useParams();
    const animeId = Number(id);
    const validId = Number.isInteger(animeId) && animeId > 0;

    const { status, data: anime, error, reload } = useAsync(
        () => (validId ? getAnimeById(animeId) : Promise.resolve(null)),
        [animeId, validId],
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [animeId]);

    if (status === "loading") return <PageContainer><LoadingState /></PageContainer>;

    if (status === "error") {
        if (error instanceof ApiError && error.status === 404) return <AnimeNotFound />;
        return (
            <PageContainer className="py-10">
                <ErrorState onRetry={reload} />
            </PageContainer>
        );
    }

    if (!anime) return <AnimeNotFound />;

    return (
        <>
            <AnimeHero anime={anime} />
            <PageContainer className="flex flex-col gap-6 py-10">
                <AnimeSynopsis key={anime.id} anime={anime} />
                <AnimeActionsBar animeId={anime.id} />
            </PageContainer>
        </>
    );
}

export default AnimeDetail;
