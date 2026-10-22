import { type FocusEvent, useEffect, useState } from "react";
import type { Anime } from "../../../types/anime.ts";
import {
    formatSeason,
    getDisplayTitle,
    joinNames,
} from "../../../utils/anime.ts";
import AppBadge from "../badges/AppBadge.tsx";
import ScoreBadge from "../badges/ScoreBadge.tsx";
import AppChipList from "../chips/AppChipList.tsx";
import AppIcon from "../icons/AppIcon.tsx";
import AppIconButton from "../buttons/AppIconButton.tsx";
import { focusRing } from "../../../styles/ui.ts";
import PageContainer from "../container/PageContainer.tsx";

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

export default function AppBanner({
    slides,
    interval = BASE_INTERVAL,
}: AppBannerProps) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isStopped, setIsStopped] = useState(false);

    const count = slides.length;
    const isPaused = isHovered || isFocused || isStopped;

    useEffect(() => {
        if (count <= 1 || isPaused) return;
        const id = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
        return () => clearTimeout(id);
    }, [index, count, interval, isPaused]);

    if (count === 0) return null;

    const activeIndex = index % count;
    const current = slides[activeIndex];
    const season = formatSeason(current);
    const subtitle = [current.title, current.titleJapanese]
        .filter((t) => t && t !== getDisplayTitle(current))
        .join(" • ");

    const handleBlur = (e: FocusEvent<HTMLElement>) => {
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
                        {season && <AppBadge variant="soft">{season}</AppBadge>}
                        <ScoreBadge score={current.score} variant="score" />
                        {current.studios.length > 0 && (
                            <span className="text-on-surface/85">
                                Studio {joinNames(current.studios)}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                            {getDisplayTitle(current)}
                        </h2>
                        {subtitle && (
                            <p className="text-sm font-semibold text-primary-soft">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {current.synopsis && (
                        <p className="line-clamp-3 text-base leading-relaxed text-on-surface/85">
                            {current.synopsis}
                        </p>
                    )}

                    <AppChipList
                        items={current.genres.map((genre) => ({
                            key: genre.id,
                            label: genre.name,
                        }))}
                    />

                    {current.status === "Currently Airing" &&
                        current.broadcast.string && (
                            <p className="flex items-center gap-2 text-sm text-on-surface/85">
                                <AppIcon
                                    name="clock"
                                    className="size-4 text-tertiary-soft"
                                />
                                Next episode:
                                <span className="font-semibold text-primary-muted">
                                    {current.broadcast.string}
                                </span>
                            </p>
                        )}
                </div>
            </PageContainer>

            {count > 1 && (
                <PageContainer className="absolute inset-x-0 bottom-5">
                    <div className="flex items-center gap-2">
                        <AppIconButton
                            icon={isStopped ? "play" : "pause"}
                            label={
                                isStopped
                                    ? "Resume slideshow"
                                    : "Pause slideshow"
                            }
                            onClick={() => setIsStopped((s) => !s)}
                            size="sm"
                        />
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Show ${getDisplayTitle(s)}`}
                                aria-current={i === activeIndex}
                                className={`h-1.5 rounded-full transition-all ${focusRing} ${
                                    i === activeIndex
                                        ? "w-8 bg-primary-soft"
                                        : "w-3 bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                </PageContainer>
            )}
        </section>
    );
}
