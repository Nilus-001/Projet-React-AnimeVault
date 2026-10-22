import type { Anime } from "../../../types/anime.ts";
import AppButton from "../../cores/buttons/AppButton.tsx";
import AppAlert from "../../cores/feedback/AppAlert.tsx";
import { STATUS_META, formatScore, joinNames } from "../../../utils/anime.ts";

type AnimeCreatedSummaryProps = {
    anime: Anime;
    onCreateAnother: () => void;
};

function AnimeCreatedSummary({ anime, onCreateAnother }: AnimeCreatedSummaryProps) {
    return (
        <div className="flex flex-col gap-6">
            <AppAlert variant="success" title="Anime added successfully!">
                Here is the information returned by the API.
            </AppAlert>

            <article className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-surface p-6 sm:flex-row sm:p-8">
                <img
                    src={anime.image}
                    alt={anime.title}
                    className="aspect-[450/636] w-40 shrink-0 rounded-xl bg-neutral object-cover"
                />

                <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-on-surface-variant">ID #{anime.id}</p>
                    <h2 className="text-2xl font-extrabold text-white">{anime.title}</h2>
                    <ul className="flex flex-col gap-1 text-sm text-on-surface">
                        <li>Genre: {joinNames(anime.genres) || "—"}</li>
                        <li>Status: {STATUS_META[anime.status].label}</li>
                        <li>Episodes: {anime.episodes ?? "—"}</li>
                        <li>Score: {formatScore(anime.score)}</li>
                    </ul>
                    {anime.synopsis && <p className="text-sm text-on-surface-variant">{anime.synopsis}</p>}
                </div>
            </article>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <AppButton variant="surface" size="lg" onClick={onCreateAnother}>
                    Add another anime
                </AppButton>
                <AppButton variant="primary" size="lg" to={`/anime/${anime.id}`}>
                    View details
                </AppButton>
            </div>
        </div>
    );
}

export default AnimeCreatedSummary;
