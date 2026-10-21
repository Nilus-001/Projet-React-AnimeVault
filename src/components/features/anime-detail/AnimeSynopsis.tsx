import { useLayoutEffect, useRef, useState } from "react";
import type { Anime } from "../../../types/anime.ts";

type AnimeSynopsisProps = {
    anime: Pick<Anime, "synopsis" | "source">;
};

function AnimeSynopsis({ anime }: AnimeSynopsisProps) {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el || expanded) return;
        const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
        check();
        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => observer.disconnect();
    }, [expanded, anime.synopsis]);

    return (
        <section aria-labelledby="synopsis-title" className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="synopsis-title" className="text-2xl font-bold text-on-surface">
                    Synopsis
                </h2>
                {anime.source && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        Source : {anime.source}
                    </p>
                )}
            </div>

            {anime.synopsis ? (
                <>
                    <p
                        id="synopsis-text"
                        ref={textRef}
                        className={`text-base leading-relaxed text-on-surface-variant ${expanded ? "" : "line-clamp-4"}`}
                    >
                        {anime.synopsis}
                    </p>
                    {overflowing && (
                        <button
                            type="button"
                            onClick={() => setExpanded((value) => !value)}
                            aria-expanded={expanded}
                            aria-controls="synopsis-text"
                            className="self-start rounded text-sm font-semibold text-primary-soft transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-soft"
                        >
                            {expanded ? "Réduire" : "Lire la suite"}
                        </button>
                    )}
                </>
            ) : (
                <p className="text-base text-on-surface-variant">Aucun synopsis disponible.</p>
            )}
        </section>
    );
}

export default AnimeSynopsis;
