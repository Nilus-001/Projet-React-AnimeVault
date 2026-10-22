import AppBasicCard from "../../cores/cards/AppBasicCard.tsx";
import type { Anime } from "../../../types/anime.ts";
import { getDisplayTitle, joinNames } from "../../../utils/anime.ts";
import ScoreBadge from "../../cores/badges/ScoreBadge.tsx";
import StatusBadge from "../../cores/badges/StatusBadge.tsx";
import AppChipList from "../../cores/chips/AppChipList.tsx";

export type CatalogueAnime = Pick<
    Anime,
    "id" | "title" | "titleEnglish" | "image" | "synopsis" | "studios" | "genres" | "status" | "score" | "episodes"
>;

type CatalogueCardProps = {
    anime: CatalogueAnime;
};

function CatalogueCard({ anime }: CatalogueCardProps) {
    return (
        <AppBasicCard
            img={anime.image}
            link={`/anime/${anime.id}`}
            title={getDisplayTitle(anime)}
            height={180}
            eyebrow={
                <>
                    <span className="truncate font-semibold text-primary-soft">
                        {joinNames(anime.studios) || "Unknown studio"}
                    </span>
                    <span className="shrink-0 font-semibold">
                        {anime.episodes ?? "?"} eps
                    </span>
                </>
            }
            topRight={<ScoreBadge score={anime.score} />}
        >
            {anime.synopsis && <p className="line-clamp-2 text-sm text-on-surface-variant">{anime.synopsis}</p>}

            <AppChipList items={anime.genres.slice(0, 3).map((genre) => ({ key: genre.id, label: genre.name }))} />

            <StatusBadge status={anime.status} className="text-right" />
        </AppBasicCard>
    );
}

export default CatalogueCard;
