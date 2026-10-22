import type { Anime } from "../../../types/anime.ts";
import { getDisplayTitle } from "../../../utils/anime.ts";
import Breadcrumb from "../../cores/breadcrumb/Breadcrumb.tsx";
import PageContainer from "../../cores/container/PageContainer.tsx";
import AnimeHeaderInfo from "./AnimeHeaderInfo.tsx";
import AnimePoster from "./AnimePoster.tsx";

type AnimeHeroProps = {
    anime: Anime;
};

function AnimeHero({ anime }: AnimeHeroProps) {
    return (
        <section
            className="relative isolate overflow-hidden"
            aria-label="Présentation"
        >
            <div aria-hidden className="absolute inset-0 -z-10">
                <img
                    src={anime.image}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral via-neutral/70 to-neutral/20" />
                <div className="absolute inset-0 bg-linear-to-r from-neutral via-neutral/60 to-transparent" />
            </div>

            <PageContainer className="flex flex-col gap-8 pb-10 pt-6 lg:min-h-130 lg:pt-8">
                <Breadcrumb
                    items={[
                        { label: "Catalogue", to: "/catalogue" },
                        { label: getDisplayTitle(anime) },
                    ]}
                />

                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-12">
                    <AnimePoster anime={anime} />
                    <AnimeHeaderInfo anime={anime} />
                </div>
            </PageContainer>
        </section>
    );
}

export default AnimeHero;
