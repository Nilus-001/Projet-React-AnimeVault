import type { ReactNode } from "react";
import AppBasicCard from "../cards/AppBasicCard.tsx";
import type { Anime } from "../../../types/anime.ts";

/** Card data derived from the shared Anime type. */
export type AnimeCard = Pick<Anime, "id" | "title" | "image" | "episodes"> & {
    subtitle?: string;
    /** When set, an "Ep x / y" badge and the "+1 ep" button are shown. */
    currentEpisode?: number;
    /** Extra badge shown when there is no progress (e.g. broadcast time). */
    badge?: string;
};

type LinearPresentationCardContainerProps = {
    title: string;
    subtitle?: string;
    icon?: string;
    actions?: ReactNode;
    items: AnimeCard[];
    emptyMessage?: string;
    onAddEpisode?: (anime: AnimeCard) => void;
};

function LinearPresentationCardContainer({
    title,
    subtitle,
    icon,
    actions,
    items,
    emptyMessage = "Nothing to show yet.",
    onAddEpisode,
}: LinearPresentationCardContainerProps) {
    return (
        <section className="flex flex-col gap-5">
            <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {icon && (
                        <span
                            aria-hidden
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-lg text-on-primary-soft"
                        >
                            {icon}
                        </span>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
                        {subtitle && (
                            <span className="rounded-full bg-surface-high px-2.5 py-0.5 text-xs font-semibold text-on-surface-variant">
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>

                {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
            </header>

            {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-on-surface-variant">
                    {emptyMessage}
                </p>
            ) : (
                <ul className="flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-2">
                    {items.map((anime) => {
                        const { currentEpisode, episodes } = anime;
                        const hasProgress = currentEpisode !== undefined;
                        const isComplete = hasProgress && episodes !== null && currentEpisode >= episodes;

                        return (
                            <li key={anime.id} className="w-56 shrink-0 snap-start">
                                <AppBasicCard
                                    img={anime.image}
                                    link={`/anime/${anime.id}`}
                                    title={anime.title}
                                    subtitle={anime.subtitle}
                                    topLeft={
                                        hasProgress ? (
                                            <span className="rounded bg-neutral/70 px-2 py-0.5 text-xs font-bold text-on-surface backdrop-blur-sm">
                                                Ep {anime.currentEpisode} / {anime.episodes ?? "?"}
                                            </span>
                                        ) : anime.badge ? (
                                            <span className="rounded bg-neutral/70 px-2 py-0.5 text-xs font-bold text-on-surface backdrop-blur-sm">
                                                {anime.badge}
                                            </span>
                                        ) : undefined
                                    }
                                    topRight={
                                        onAddEpisode && hasProgress ? (
                                            <button
                                                type="button"
                                                onClick={() => onAddEpisode(anime)}
                                                disabled={isComplete}
                                                aria-label={`Mark one more episode of ${anime.title} as watched`}
                                                className="rounded-lg bg-primary-soft px-2 py-1 text-xs font-bold text-on-primary-soft shadow-glow transition-colors hover:bg-primary-soft/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                +1 ep
                                            </button>
                                        ) : undefined
                                    }
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export default LinearPresentationCardContainer;
