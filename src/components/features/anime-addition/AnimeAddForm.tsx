import { type ChangeEvent, type FormEvent, useState } from "react";
import type { AnimeStatus, Genre } from "../../../types/anime.ts";
import AppButton from "../../cores/buttons/AppButton.tsx";
import AppSpinner from "../../cores/feedback/AppSpinner.tsx";
import FormField, { fieldClass } from "../../cores/form/FormField.tsx";
import { STATUS_META } from "../../../utils/anime.ts";

export type AnimeFormValues = {
    title: string;
    genre: string;
    status: AnimeStatus;
    episodes: string;
    score: number;
    image: string;
    synopsis: string;
};

type FormErrors = Partial<Record<keyof AnimeFormValues, string>>;

const INITIAL_VALUES: AnimeFormValues = {
    title: "",
    genre: "",
    status: "Finished Airing",
    episodes: "",
    score: 0.0,
    image: "",
    synopsis: "",
};

function validate(values: AnimeFormValues): FormErrors {
    const errors: FormErrors = {};

    if (values.title.trim() === "") {
        errors.title = "Title is required.";
    } else if (values.title.trim().length < 2) {
        errors.title = "Title must be at least 2 characters long.";
    }

    if (values.genre === "") {
        errors.genre = "Please choose a genre.";
    }

    const episodes = Number(values.episodes);
    if (!Number.isInteger(episodes) || episodes < 1) {
        errors.episodes = "Episodes must be a whole number greater than 0.";
    }

    const score = Number(values.score);
    if (Number.isNaN(score) || score < 0 || score > 10) {
        errors.score = "Score must be a number between 0 and 10.";
    }

    if (!/^https?:\/\/.+/.test(values.image.trim())) {
        errors.image = "Poster URL must start with http:// or https://.";
    }

    if (values.synopsis.trim().length < 20) {
        errors.synopsis = "Synopsis must be at least 20 characters long.";
    }

    return errors;
}

type AnimeAddFormProps = {
    genres: Genre[];
    isSubmitting: boolean;
    onSubmit: (values: AnimeFormValues) => void;
};

function AnimeAddForm({ genres, isSubmitting, onSubmit }: AnimeAddFormProps) {
    const [values, setValues] = useState<AnimeFormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: undefined });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validate(values);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        }
    };

    return (
        <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-surface p-6 sm:p-8"
        >
            <p className="text-sm text-on-surface-variant">
                Fields marked with <span className="text-rose-300">*</span> are
                required.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                    id="title"
                    label="Title"
                    required
                    error={errors.title}
                >
                    <input
                        id="title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Frieren"
                        className={fieldClass(errors.title)}
                    />
                </FormField>

                <FormField
                    id="genre"
                    label="Genre"
                    required
                    error={errors.genre}
                >
                    <select
                        id="genre"
                        name="genre"
                        value={values.genre}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={fieldClass(errors.genre)}
                    >
                        <option value="">Choose a genre…</option>
                        {genres.map((genre) => (
                            <option key={genre.slug} value={genre.slug}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField id="status" label="Status" required>
                    <select
                        id="status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={fieldClass()}
                    >
                        <option value="Finished Airing">
                            {STATUS_META["Finished Airing"].label}
                        </option>
                        <option value="Currently Airing">
                            {STATUS_META["Currently Airing"].label}
                        </option>
                        <option value="Not yet aired">
                            {STATUS_META["Not yet aired"].label}
                        </option>
                    </select>
                </FormField>

                <FormField
                    id="episodes"
                    label="Episodes"
                    required
                    error={errors.episodes}
                >
                    <input
                        id="episodes"
                        name="episodes"
                        type="number"
                        min={1}
                        value={values.episodes}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. 28"
                        className={fieldClass(errors.episodes)}
                    />
                </FormField>

                <FormField
                    id="score"
                    label="Score (0 to 10)"
                    error={errors.score}
                >
                    <input
                        id="score"
                        name="score"
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={values.score}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. 8.5"
                        className={fieldClass(errors.score)}
                    />
                </FormField>

                <FormField
                    id="image"
                    label="Poster URL"
                    required
                    error={errors.image}
                >
                    <input
                        id="image"
                        name="image"
                        type="url"
                        value={values.image}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="https://example.com/poster.jpg"
                        className={fieldClass(errors.image)}
                    />
                </FormField>
            </div>

            <FormField
                id="synopsis"
                label="Synopsis"
                required
                error={errors.synopsis}
            >
                <textarea
                    id="synopsis"
                    name="synopsis"
                    rows={5}
                    value={values.synopsis}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Describe the story in a few sentences…"
                    className={fieldClass(errors.synopsis)}
                />
            </FormField>

            <div className="flex justify-end">
                <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <AppSpinner />}
                    {isSubmitting ? "Adding…" : "Add anime"}
                </AppButton>
            </div>
        </form>
    );
}

export default AnimeAddForm;
