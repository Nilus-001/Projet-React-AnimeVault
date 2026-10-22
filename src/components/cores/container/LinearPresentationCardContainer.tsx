import type { ReactNode } from "react";
import AppBasicCard from "../cards/AppBasicCard.tsx";
import type { Anime } from "../../../types/anime.ts";
import AppBadge from "../badges/AppBadge.tsx";
import AppChip from "../chips/AppChip.tsx";
import AppButton from "../buttons/AppButton.tsx";
import EmptyState from "../feedback/EmptyState.tsx";
export type AnimeCard = Pick<Anime, "id" | "title" | "image" | "episodes"> & {
    subtitle?: string;
    currentEpisode?: number;
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
                        <h2 className="text-xl font-bold text-on-surface">
                            {title}
                        </h2>
                        {subtitle && (
                            <AppChip variant="solid">{subtitle}</AppChip>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex shrink-0 items-center gap-3">
                        {actions}
                    </div>
                )}
            </header>

            {items.length === 0 ? (
                <EmptyState size="sm" message={emptyMessage} />
            ) : (
                <ul className="flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto pb-2">
                    {items.map((anime) => {
                        const { currentEpisode, episodes } = anime;
                        const hasProgress = currentEpisode !== undefined;
                        const isComplete =
                            hasProgress &&
                            episodes !== null &&
                            currentEpisode >= episodes;

                        return (
                            <li
                                key={anime.id}
                                className="w-56 shrink-0 snap-start"
                            >
                                <AppBasicCard
                                    img={anime.image}
                                    link={`/anime/${anime.id}`}
                                    title={anime.title}
                                    subtitle={anime.subtitle}
                                    topLeft={
                                        hasProgress ? (
                                            <AppBadge>
                                                Ep {anime.currentEpisode} /{" "}
                                                {anime.episodes ?? "?"}
                                            </AppBadge>
                                        ) : anime.badge ? (
                                            <AppBadge>{anime.badge}</AppBadge>
                                        ) : undefined
                                    }
                                    topRight={
                                        onAddEpisode && hasProgress ? (
                                            <AppButton
                                                variant="primary"
                                                size="sm"
                                                icon="plus"
                                                onClick={() =>
                                                    onAddEpisode(anime)
                                                }
                                                disabled={isComplete}
                                                aria-label={`Mark one more episode of ${anime.title} as watched`}
                                                className="h-7 px-2"
                                            >
                                                1 ep
                                            </AppButton>
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
