import type { Anime } from "../../../types/anime.ts";
import {
    STATUS_LABEL_FR,
    formatAiredRange,
    formatEpisodes,
    formatRatingShort,
    getDisplayTitle,
    joinNames,
} from "../../../utils/anime.ts";
import AppChip from "../../cores/chips/AppChip.tsx";
import AppChipList from "../../cores/chips/AppChipList.tsx";
import StatusBadge from "../../cores/badges/StatusBadge.tsx";

type AnimeHeaderInfoProps = {
    anime: Pick<
        Anime,
        | "title"
        | "titleEnglish"
        | "titleJapanese"
        | "studios"
        | "episodes"
        | "aired"
        | "duration"
        | "rating"
        | "status"
        | "genres"
        | "themes"
        | "demographics"
    >;
};

function AnimeHeaderInfo({ anime }: AnimeHeaderInfoProps) {
    const displayTitle = getDisplayTitle(anime);
    const studios = joinNames(anime.studios);
    const romaji = anime.title !== displayTitle ? anime.title : null;

    const overline = [
        studios
            ? {
                  key: "studios",
                  text: studios,
                  className:
                      "font-bold uppercase tracking-widest text-primary-soft",
              }
            : null,
        romaji
            ? {
                  key: "romaji",
                  text: romaji,
                  className: "font-semibold text-on-surface-variant",
              }
            : null,
        anime.titleJapanese
            ? {
                  key: "japanese",
                  text: anime.titleJapanese,
                  className: "text-tertiary-soft",
                  lang: "ja",
              }
            : null,
    ].filter((item) => item !== null);

    const pills = [
        formatEpisodes(anime.episodes),
        formatAiredRange(anime.aired),
        anime.duration,
        formatRatingShort(anime.rating),
    ].filter((pill): pill is string => Boolean(pill));

    const tags = [...anime.genres, ...anime.themes, ...anime.demographics];

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-center lg:text-left">
            {overline.length > 0 && (
                <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm lg:justify-start">
                    {overline.map((item, i) => (
                        <span
                            key={item.key}
                            className="flex items-center gap-2"
                        >
                            {i > 0 && (
                                <span
                                    aria-hidden
                                    className="text-on-surface-variant/50"
                                >
                                    •
                                </span>
                            )}
                            <span className={item.className} lang={item.lang}>
                                {item.text}
                            </span>
                        </span>
                    ))}
                </p>
            )}

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {displayTitle}
            </h1>

            <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {pills.map((pill) => (
                    <li key={pill}>
                        <AppChip variant="solid">{pill}</AppChip>
                    </li>
                ))}
                <li>
                    <StatusBadge
                        status={anime.status}
                        label={STATUS_LABEL_FR[anime.status]}
                        variant="pill"
                    />
                </li>
            </ul>

            <AppChipList
                variant="tag"
                label="Genres et thèmes"
                className="justify-center lg:justify-start"
                items={tags.map((tag) => ({
                    key: `${tag.id}-${tag.name}`,
                    label: tag.name,
                }))}
            />
        </div>
    );
}

export default AnimeHeaderInfo;
