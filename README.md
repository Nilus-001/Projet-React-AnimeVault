# AnimeVault

AnimeVault is an anime catalogue and tracking website built with React.
Browse the catalogue, follow what is airing today, keep track of the episodes you have watched and add new anime.

> **Status:** the app is plugged into the [DummyJSON Products API](https://dummyjson.com/docs/products).
> DummyJSON products are used as stand-in anime and converted to the app's `Anime` type in `src/api/mappers.ts`.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) (strict mode)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) — design tokens live in the `@theme` block of `src/styles/main.css`
- [React Router v8](https://reactrouter.com/) (`BrowserRouter`)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting, [Prettier](https://prettier.io/) for formatting

## Getting started

Create a `.env` file at the project root (it is git-ignored):

```env
VITE_API_URL=https://dummyjson.com
```

Then install and run:

```bash
npm install
npm run dev
```

The app runs on <http://localhost:5173>.

## Scripts

| Script            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR             |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | Lint the project with Oxlint                   |

## Routes

| Path         | Page                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Home — featured banner, continue watching, airing today                 |
| `/catalogue` | Catalogue — search, genre filter, sort and pagination                   |
| `/anime/:id` | Anime detail — hero, synopsis, info, watchlist and episode actions      |
| `/anime/new` | Add anime — creation form, then a summary of the created anime          |

`/changelog` and `/privacy` are linked in the footer but not implemented yet.

## API

All calls go through `src/api/`. `VITE_API_URL` is read in `src/api/config.ts`.

| Function                         | Endpoint                                                  |
| -------------------------------- | --------------------------------------------------------- |
| `getAllAnime()`                  | `GET /products?limit=0` (Home, cached in memory)          |
| `getGenres()`                    | `GET /products/categories` (cached in memory)             |
| `getCatalogue({ query, genre, sort, page, perPage })` | `GET /products`, `/products/search?q=` or `/products/category/{slug}` with `limit`, `skip`, `sortBy`, `order` |
| `getAnimeById(id)`               | `GET /products/{id}`                                      |
| `addAnime(anime)`                | `POST /products/add`                                      |

- GET requests are retried up to 3 times on network or 5xx errors, and throw an `ApiError` carrying the HTTP status.
- Catalogue filtering, sorting and pagination are done server-side. DummyJSON cannot combine a search with a category, so in the catalogue the search and the genre filter are mutually exclusive.
- Sorting: *Top rated* → `rating desc`, *Most popular* → `stock desc`, *Title A–Z* → `title asc`.
- `POST /products/add` is simulated by DummyJSON: the created anime is returned but not persisted.

### Product → Anime mapping

| Anime field          | Product source                                                        |
| -------------------- | --------------------------------------------------------------------- |
| `title` / `synopsis` | `title` / `description`                                               |
| `image`              | `images[0]` or `thumbnail`                                            |
| `genres`             | `category`                                                            |
| `themes`             | `tags` (deduplicated against the category)                            |
| `studios`            | `brand`                                                               |
| `score`              | `rating × 2` (out of 10)                                              |
| `episodes`           | `stock`                                                               |
| `status`             | `availabilityStatus`: In Stock → Finished, Low Stock → Airing, Out of Stock → Not yet aired |
| `season`, `broadcast`| derived from the product `id`                                         |
| `reviews`            | `reviews` (rating × 2)                                                |

`AnimeToProduct` and `AnimeFormValueToAnime` do the reverse conversion for the add form.

## State

- **`WatchListProvider`** (`src/contexts/watchListProvider.tsx`) — watchlist and per-anime episode progress, persisted in `localStorage` (`anivault-watchlist`, `anivault-progress`). Use it with `useWatchListContext()`.
- **`CatalogueFiltersProvider`** (`src/contexts/catalogueFiltersProvider.tsx`) — catalogue search, genre, sort and page, kept when navigating away and back. Use it with `useCatalogueFilters()`.
- **`useAsync`** (`src/hooks/useAsync.ts`) — loading / success / error state for a promise, with a `reload()` function.
- **`useLocalStorage`** (`src/hooks/useLocalStorage.ts`) — `useState` synced to `localStorage`, with an optional validator.

## Project structure

```
src/
├── App.tsx                     # Routes
├── main.tsx                    # Entry point (BrowserRouter, providers, global CSS)
├── api/
│   ├── config.ts               # API_URL from VITE_API_URL
│   ├── mappers.ts              # Product ⇄ Anime conversions
│   ├── search/anime.ts         # GET requests, ApiError, retry, caches
│   └── add/anime.ts            # POST /products/add
├── contexts/                   # WatchListProvider, CatalogueFiltersProvider
├── hooks/                      # useAsync, useLocalStorage
├── assets/                     # Static assets imported from code (logo…)
├── styles/
│   ├── main.css                # Tailwind import + @theme design tokens
│   └── ui.ts                   # Shared class strings (focus ring)
├── types/
│   ├── anime.ts                # App types: Anime, AnimeDetail, Paginated, CatalogueQuery…
│   └── api.ts                  # DummyJSON response types
├── utils/
│   ├── anime.ts                # Formatting helpers (title, season, score, status…)
│   └── catalogueFilters.ts     # Filter defaults, sort options, helpers
├── pages/                      # One folder per route
│   ├── Home/Home.tsx
│   ├── Catalogue/Catalogue.tsx
│   ├── AnimeDetail/AnimeDetail.tsx
│   └── AddNewAnime/AddAnime.tsx
└── components/
    ├── layouts/                # App shell: AppLayout, AppHeader, AppFooter
    ├── cores/                  # Generic, reusable UI building blocks
    │   ├── badges/             # AppBadge, ScoreBadge, StatusBadge
    │   ├── banner/             # AppBanner
    │   ├── breadcrumb/         # Breadcrumb
    │   ├── buttons/            # AppButton, AppIconButton, AppToggleButton
    │   ├── cards/              # AppBasicCard
    │   ├── chips/              # AppChip, AppChipList, AppFilterChip
    │   ├── container/          # PageContainer, CardContentContainer, LinearPresentationCardContainer
    │   ├── feedback/           # AppAlert, AppSpinner, AsyncFeedback, EmptyState
    │   ├── form/               # FormField
    │   ├── icons/              # AppIcon
    │   ├── nav/                # AppNavBar
    │   ├── pagination/         # AppPagination
    │   └── searchBar/          # AppSearchBar
    └── features/               # Components tied to a specific feature
        ├── catalogue/          # CatalogueCard, CatalogueFilters, CatalogueResultGrid
        ├── anime-detail/       # AnimeHero, AnimePoster, AnimeHeaderInfo, AnimeSynopsis, AnimeActionsBar
        └── anime-addition/     # AnimeAddForm, AnimeCreatedSummary
```

## Conventions

- **Data**: every component consumes the app's `Anime` / `AnimeDetail` types (`src/types/anime.ts`), or a `Pick<>` of them. API types (`src/types/api.ts`) never leave `src/api/`.
- **Fetching**: pages load data with `useAsync` and display loading / error states with `AsyncFeedback`.
- **Layout width**: every section uses `PageContainer` so content is aligned across the site.
- **Colors**: only use the tokens from `@theme` (`bg-surface`, `text-on-surface-variant`, …), no hard-coded hex values.
- **Comments**: no comments in the code.
- **Language**: the UI is in English.
- **Formatting**: see `.editorconfig` (UTF-8, LF, 4 spaces).
