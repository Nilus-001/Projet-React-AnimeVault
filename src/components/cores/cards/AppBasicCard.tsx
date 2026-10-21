import type { ReactNode } from "react";
import { Link } from "react-router";

type AppBasicCardProps = {
    img: string;
    link: string;
    title: string;
    subtitle?: string;
    topLeft?: ReactNode;
    topRight?: ReactNode;
    bottomLeft?: ReactNode;
    height?: number;
    eyebrow?: ReactNode;
    children?: ReactNode;
};

function AppBasicCard({
    img,
    link,
    title,
    subtitle,
    topLeft,
    topRight,
    bottomLeft,
    eyebrow,
    children,
    height,
}: AppBasicCardProps) {
    return (
        <article className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-surface text-on-surface">
            <Link
                to={link}
                className="flex flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/70"
            >
                <div
                    className={`relative overflow-hidden ${height === undefined ? "aspect-2/3" : ""}`}
                    style={height === undefined ? undefined : { height }}
                >
                    <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent"
                    />
                    {topLeft && (
                        <div className="absolute left-2.5 top-2.5 flex items-center gap-2">{topLeft}</div>
                    )}
                    {bottomLeft && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">{bottomLeft}</div>
                    )}
                </div>

                <div className="flex flex-col gap-1 p-4">
                    {eyebrow && (
                        <div className="mb-1 flex items-center justify-between gap-3 text-xs text-on-surface-variant">
                            {eyebrow}
                        </div>
                    )}
                    <h3 className="truncate text-lg font-bold text-white">{title}</h3>
                    {subtitle && <p className="truncate text-sm font-semibold text-on-surface-variant">{subtitle}</p>}
                    {children && <div className="mt-1 flex flex-col gap-2">{children}</div>}
                </div>
            </Link>
            {topRight && (
                <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-2">{topRight}</div>
            )}
        </article>
    );
}

export default AppBasicCard;
