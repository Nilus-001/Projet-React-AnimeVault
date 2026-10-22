import type { ReactNode } from "react";
import CatalogueCard, { type CatalogueAnime } from "./CatalogueCard.tsx";

type CatalogueResultGridProps = {
    items: CatalogueAnime[];
    emptyState?: ReactNode;
};

function CatalogueResultGrid({ items, emptyState }: CatalogueResultGridProps) {
    if (items.length === 0) return <>{emptyState}</>;

    return (
        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((anime) => (
                <li key={anime.id}>
                    <CatalogueCard anime={anime} />
                </li>
            ))}
        </ul>
    );
}

export default CatalogueResultGrid;
