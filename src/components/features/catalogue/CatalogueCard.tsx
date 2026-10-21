import AppBasicCard from "../../cores/cards/AppBasicCard.tsx";
import type { Anime } from "../../../types/anime.ts";
import { STATUS_META, formatScore, getDisplayTitle, joinNames } from "../../../utils/anime.ts";

export type CatalogueAnime = Pick<
    Anime,
    "id" | "title" | "titleEnglish" | "image" | "synopsis" | "studios" | "genres" | "status" | "score" | "episodes"
>;

type CatalogueCardProps = {
    anime: CatalogueAnime;
};

function CatalogueCard({ anime }: CatalogueCardProps) {
    const status = STATUS_META[anime.status];

    return (
        <AppBasicCard
            img={anime.image}
            link={`/anime/${anime.id}`}
            title={getDisplayTitle(anime)}
            height={180}
            eyebrow={
                <>
                    <span className="truncate font-semibold text-indigo-300">
                        {joinNames(anime.studios) || "Unknown studio"}
                    </span>
                    <span className="shrink-0 font-semibold">
                        {anime.episodes ?? "?"} eps
                    </span>
                </>
            }
            topRight={
                <span className="rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    <span className="text-amber-400" aria-hidden>
                        ★
                    </span>{" "}
                    <span className="sr-only">Score </span>
                    {formatScore(anime.score)}
                </span>
            }
        >
            {anime.synopsis && <p className="line-clamp-2 text-sm text-on-surface-variant">{anime.synopsis}</p>}

            <ul className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 3).map((genre) => (
                    <li key={genre.id} className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                        {genre.name}
                    </li>
                ))}
            </ul>

            <p className={`text-right text-xs font-semibold ${status.className}`}>{status.label}</p>
        </AppBasicCard>
    );
}

export default CatalogueCard;
