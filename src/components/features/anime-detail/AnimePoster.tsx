import type { Anime } from "../../../types/anime.ts";
import { formatScore, formatSeason, getDisplayTitle } from "../../../utils/anime.ts";

type AnimePosterProps = {
    anime: Pick<Anime, "title" | "titleEnglish" | "image" | "rank" | "score" | "season" | "year" | "trailer">;
};

function PlayIcon() {
    return (
        <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
    );
}

function AnimePoster({ anime }: AnimePosterProps) {
    const season = formatSeason(anime);

    return (
        <div className="flex w-64 shrink-0 flex-col gap-3 sm:w-72 lg:w-80">
            <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-surface-high shadow-2xl shadow-black/60">
                <img src={anime.image} alt={getDisplayTitle(anime)} className="h-full w-full object-cover" />

                {anime.rank !== null && (
                    <span className="absolute left-3 top-3 rounded-lg bg-tertiary-soft px-2 py-1 text-xs font-bold text-neutral shadow">
                        #{anime.rank} au classement
                    </span>
                )}

                {anime.score !== null && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-neutral/85 px-2.5 py-1 text-sm font-bold text-on-surface backdrop-blur-sm">
                        <span aria-hidden className="text-tertiary-soft">
                            ★
                        </span>
                        <span className="sr-only">Note </span>
                        {formatScore(anime.score)}
                    </span>
                )}

                {season && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-end bg-linear-to-t from-neutral/90 to-transparent p-3 pt-12">
                        <span className="rounded-md bg-surface-high/90 px-2 py-0.5 text-xs font-semibold text-on-surface">
                            {season}
                        </span>
                    </div>
                )}
            </div>

            {anime.trailer && (
                <a
                    href={anime.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary-soft px-4 py-2.5 text-sm font-semibold text-on-primary-soft shadow-glow transition-colors hover:bg-primary-soft/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
                >
                    <PlayIcon />
                    Voir le trailer
                    <span className="sr-only">(nouvel onglet)</span>
                </a>
            )}
        </div>
    );
}

export default AnimePoster;
