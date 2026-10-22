import { useState } from "react";
import Breadcrumb from "../../components/cores/breadcrumb/Breadcrumb.tsx";
import PageContainer from "../../components/cores/container/PageContainer.tsx";
import AppAlert from "../../components/cores/feedback/AppAlert.tsx";
import AnimeAddForm, {
    type AnimeFormValues,
} from "../../components/features/anime-addition/AnimeAddForm.tsx";
import AnimeCreatedSummary from "../../components/features/anime-addition/AnimeCreatedSummary.tsx";
import type { Anime, Genre } from "../../types/anime.ts";
import { addAnime } from "../../api/add/anime.ts";
import { AnimeFormValueToAnime } from "../../api/mappers.ts";

//!todo replace this list with the API genres (getGenres)
const GENRES: Genre[] = [
    { slug: "beauty", name: "Beauty" },
    { slug: "fragrances", name: "Fragrances" },
    { slug: "furniture", name: "Furniture" },
    { slug: "groceries", name: "Groceries" },
];

async function createAnime(_values: AnimeFormValues): Promise<Anime> {
    const Anime = AnimeFormValueToAnime(_values);
    return await addAnime(Anime);
}
function AddAnime() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdAnime, setCreatedAnime] = useState<Anime | null>(null);

    const handleSubmit = async (values: AnimeFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const anime = await createAnime(values);
            setCreatedAnime(anime);
        } catch {
            setError("Failed to add the anime. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer className="flex flex-col gap-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Catalogue", to: "/catalogue" },
                    { label: "Add anime" },
                ]}
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Add anime
            </h1>

            {createdAnime ? (
                <AnimeCreatedSummary
                    anime={createdAnime}
                    onCreateAnother={() => setCreatedAnime(null)}
                />
            ) : (
                <>
                    {error && <AppAlert variant="error" title={error} />}
                    <AnimeAddForm
                        genres={GENRES}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </PageContainer>
    );
}

export default AddAnime;
