import { type FocusEvent, useEffect, useState } from "react";
import type { Anime } from "../../../types/anime.ts";
import { formatScore, formatSeason, getDisplayTitle, joinNames } from "../../../utils/anime.ts";
import PageContainer from "../container/PageContainer.tsx";

/** A banner slide is a subset of the shared Anime type: any Anime can be passed directly. */
export type BannerSlide = Pick<
    Anime,
    | "id"
    | "title"
    | "titleEnglish"
    | "titleJapanese"
    | "image"
    | "synopsis"
    | "genres"
    | "score"
    | "studios"
    | "season"
    | "year"
    | "status"
    | "broadcast"
>;

type AppBannerProps = {
    slides: BannerSlide[];
    interval?: number;
};

const BASE_INTERVAL = 6000;

export default function AppBanner({ slides, interval = BASE_INTERVAL }: AppBannerProps) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isStopped, setIsStopped] = useState(false);

    const count = slides.length;
    const isPaused = isHovered || isFocused || isStopped;

    useEffect(() => {
        // Nothing to rotate (also avoids `% 0` -> NaN when the list is empty).
        if (count <= 1 || isPaused) return;
        const id = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
        return () => clearTimeout(id);
    }, [index, count, interval, isPaused]);

    if (count === 0) return null;

    // Stay in range if the slides list shrinks.
    const activeIndex = index % count;
    const current = slides[activeIndex];
    const season = formatSeason(current);
    const subtitle = [current.title, current.titleJapanese]
        .filter((t) => t && t !== getDisplayTitle(current))
        .join(" • ");

    const handleBlur = (e: FocusEvent<HTMLElement>) => {
        // Only resume when focus actually leaves the carousel.
        if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
    };

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured anime"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className="relative isolate overflow-hidden bg-neutral text-on-surface"
        >
            {slides.map((s, i) => (
                <img
                    key={s.id}
                    src={s.image}
                    alt=""
                    className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
                        i === activeIndex ? "opacity-40" : "opacity-0"
                    }`}
                />
            ))}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-neutral via-neutral/60 to-transparent" />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-neutral via-neutral/50 to-transparent" />

            <PageContainer className="flex min-h-130 items-end justify-between gap-10 pb-12 pt-24">
                <div
                    className="flex max-w-xl flex-col gap-4"
                    aria-live={isPaused ? "polite" : "off"}
                    aria-atomic="true"
                >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        {season && (
                            <span className="rounded-md bg-white/10 px-2.5 py-1 text-slate-300">{season}</span>
                        )}
                        <span className="rounded-md bg-amber-400/20 px-2.5 py-1 text-amber-300">
                            ★ {formatScore(current.score)}
                        </span>
                        {current.studios.length > 0 && (
                            <span className="text-slate-300">Studio {joinNames(current.studios)}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                            {getDisplayTitle(current)}
                        </h2>
                        {subtitle && <p className="text-sm font-semibold text-indigo-300">{subtitle}</p>}
                    </div>

                    {current.synopsis && (
                        <p className="line-clamp-3 text-base leading-relaxed text-slate-300">{current.synopsis}</p>
                    )}

                    <ul className="flex flex-wrap items-center gap-2">
                        {current.genres.map((genre) => (
                            <li
                                key={genre.id}
                                className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
                            >
                                {genre.name}
                            </li>
                        ))}
                    </ul>

                    {current.status === "Currently Airing" && current.broadcast.string && (
                        <p className="flex items-center gap-2 text-sm text-slate-300">
                            <svg
                                aria-hidden
                                viewBox="0 0 24 24"
                                className="h-4 w-4 text-amber-300"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 2" />
                            </svg>
                            Next episode:
                            <span className="font-semibold text-indigo-200">{current.broadcast.string}</span>
                        </p>
                    )}
                </div>
            </PageContainer>

            {count > 1 && (
                <PageContainer className="absolute inset-x-0 bottom-5">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsStopped((s) => !s)}
                            aria-label={isStopped ? "Resume slideshow" : "Pause slideshow"}
                            className="grid size-6 place-items-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/70"
                        >
                            <svg aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                                {isStopped ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
                            </svg>
                        </button>
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Show ${getDisplayTitle(s)}`}
                                aria-current={i === activeIndex}
                                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/70 ${
                                    i === activeIndex ? "w-8 bg-indigo-300" : "w-3 bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </PageContainer>
            )}
        </section>
    );
}
