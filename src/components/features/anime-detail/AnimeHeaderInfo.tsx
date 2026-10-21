import type { Anime } from "../../../types/anime.ts";
import {
    STATUS_LABEL_FR,
    STATUS_META,
    formatAiredRange,
    formatEpisodes,
    formatRatingShort,
    getDisplayTitle,
    joinNames,
} from "../../../utils/anime.ts";

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

const pillBase = "rounded-full bg-surface-high px-3 py-1 text-xs font-semibold";

function AnimeHeaderInfo({ anime }: AnimeHeaderInfoProps) {
    const displayTitle = getDisplayTitle(anime);
    const studios = joinNames(anime.studios);
    const romaji = anime.title !== displayTitle ? anime.title : null;

    const overline = [
        studios ? { key: "studios", text: studios, className: "font-bold uppercase tracking-widest text-primary-soft" } : null,
        romaji ? { key: "romaji", text: romaji, className: "font-semibold text-on-surface-variant" } : null,
        anime.titleJapanese
            ? { key: "japanese", text: anime.titleJapanese, className: "text-tertiary-soft", lang: "ja" }
            : null,
    ].filter((item) => item !== null);

    const pills = [
        formatEpisodes(anime.episodes),
        formatAiredRange(anime.aired),
        anime.duration,
        formatRatingShort(anime.rating),
    ].filter((pill): pill is string => Boolean(pill));

    const tags = [...anime.genres, ...anime.themes, ...anime.demographics];
    const status = STATUS_META[anime.status];

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-center lg:text-left">
            {overline.length > 0 && (
                <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm lg:justify-start">
                    {overline.map((item, i) => (
                        <span key={item.key} className="flex items-center gap-2">
                            {i > 0 && (
                                <span aria-hidden className="text-on-surface-variant/50">
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
                    <li key={pill} className={`${pillBase} text-on-surface-variant`}>
                        {pill}
                    </li>
                ))}
                <li className={`flex items-center gap-1.5 ${pillBase} ${status.className}`}>
                    <span aria-hidden className="size-1.5 rounded-full bg-current" />
                    {STATUS_LABEL_FR[anime.status]}
                </li>
            </ul>

            {tags.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-2 lg:justify-start" aria-label="Genres et thèmes">
                    {tags.map((tag) => (
                        <li
                            key={`${tag.id}-${tag.name}`}
                            className="rounded-lg bg-surface px-3 py-1 text-xs font-semibold text-on-surface"
                        >
                            {tag.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AnimeHeaderInfo;
