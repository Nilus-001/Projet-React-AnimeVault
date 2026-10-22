import type { Anime } from "../../../types/anime.ts";
import { formatSeason, getDisplayTitle } from "../../../utils/anime.ts";
import AppBadge from "../../cores/badges/AppBadge.tsx";
import ScoreBadge from "../../cores/badges/ScoreBadge.tsx";
import AppButton from "../../cores/buttons/AppButton.tsx";

type AnimePosterProps = {
    anime: Pick<Anime, "title" | "titleEnglish" | "image" | "rank" | "score" | "season" | "year" | "trailer">;
};

function AnimePoster({ anime }: AnimePosterProps) {
    const season = formatSeason(anime);

    return (
        <div className="flex w-64 shrink-0 flex-col gap-3 sm:w-72 lg:w-80">
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-surface-high shadow-2xl shadow-black/60">
                <img src={anime.image} alt={getDisplayTitle(anime)} className="h-full w-full object-cover" />

                {anime.rank !== null && (
                    <AppBadge variant="accent" className="absolute left-3 top-3">
                        #{anime.rank} au classement
                    </AppBadge>
                )}

                <ScoreBadge score={anime.score} hideWhenEmpty className="absolute right-3 top-3 text-sm" />

                {season && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-end bg-linear-to-t from-neutral/90 to-transparent p-3 pt-12">
                        <AppBadge>{season}</AppBadge>
                    </div>
                )}
            </div>

            {anime.trailer && (
                <AppButton href={anime.trailer} variant="primary" icon="play" fullWidth>
                    Voir le trailer
                    <span className="sr-only">(nouvel onglet)</span>
                </AppButton>
            )}
        </div>
    );
}

export default AnimePoster;
