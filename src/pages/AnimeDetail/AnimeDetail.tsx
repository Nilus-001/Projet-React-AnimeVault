import { useEffect } from "react";
import { Link, useParams } from "react-router";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import AnimeHero from "../../components/features/anime-detail/AnimeHero.tsx";
import AnimeSynopsis from "../../components/features/anime-detail/AnimeSynopsis.tsx";
import { MOCK_ANIME_BY_ID } from "../../mocks/anime.ts";

function AnimeNotFound() {
    return (
        <PageContainer className="flex flex-col items-center gap-4 py-24 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Anime introuvable</h1>
            <p className="text-on-surface-variant">Cet anime n'existe pas ou n'est plus disponible.</p>
            <Link
                to="/catalogue"
                className="rounded-xl bg-surface-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
            >
                Retour au catalogue
            </Link>
        </PageContainer>
    );
}

function AnimeDetail() {
    const { id } = useParams();
    const animeId = Number(id);
    const anime = Number.isInteger(animeId) ? MOCK_ANIME_BY_ID.get(animeId) : undefined;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [animeId]);

    if (!anime) return <AnimeNotFound />;

    return (
        <>
            <AnimeHero anime={anime} />
            <PageContainer className="py-10">
                <AnimeSynopsis key={anime.id} anime={anime} />
            </PageContainer>
        </>
    );
}

export default AnimeDetail;
