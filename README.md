# AnimeVault

AnimeVault is an anime catalogue and tracking website built with React.
Browse the catalogue, follow what is airing today and keep track of the episodes you have watched.

> **Status:** UI skeleton. All data currently comes from local mocks (`src/mocks/`).
> The data layer will be plugged into the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API) later.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) (strict mode)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) — design tokens live in the `@theme` block of `src/styles/main.css`
- [React Router v8](https://reactrouter.com/) (`BrowserRouter`)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

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

## Project structure

```
src/
├── App.tsx                     # Routes
├── main.tsx                    # Entry point (BrowserRouter + global CSS)
├── assets/                     # Static assets imported from code (logo…)
├── styles/
│   └── main.css                # Tailwind import + @theme design tokens
├── types/
│   └── anime.ts                # Shared Anime type (shaped after Jikan)
├── mocks/
│   └── anime.ts                # Mock anime + watch progress
├── utils/
│   └── anime.ts                # Formatting helpers (title, season, score, status…)
├── pages/                      # One folder per route
│   ├── Home/Home.tsx
│   └── Catalogue/Catalogue.tsx
└── components/
    ├── layouts/                # App shell: AppLayout, AppHeader, AppFooter
    ├── cores/                  # Generic, reusable UI building blocks
    │   ├── banner/AppBanner.tsx
    │   ├── breadcrumb/Breadcrumb.tsx
    │   ├── cards/AppBasicCard.tsx
    │   ├── container/PageContainer.tsx
    │   ├── container/LinearPresentationCardContainer.tsx
    │   ├── nav/AppNavBar.tsx
    │   └── searchBar/AppSearchBar.tsx
    └── features/               # Components tied to a specific feature
        └── catalogue/
            ├── CatalogueCard.tsx
            └── CatalogueResultGrid.tsx
```

### Conventions

- **Data**: every component consumes the single `Anime` type (`src/types/anime.ts`), or a `Pick<>` of it.
  When the API arrives, only one Jikan → `Anime` mapping function is needed.
- **Layout width**: every section uses `PageContainer` so content is aligned across the site.
- **Colors**: only use the tokens from `@theme` (`bg-surface`, `text-on-surface-variant`, …), no hard-coded hex values.
- **Language**: the UI is in English.
- **Formatting**: see `.editorconfig` (UTF-8, LF, 4 spaces).

## Routes

| Path         | Page                                                    |
| ------------ | ------------------------------------------------------- |
| `/`          | Home — featured banner, continue watching, airing today |
| `/catalogue` | Catalogue — search by title (`?q=`)                     |

`/seasonal`, `/vault`, `/anime/:id`, `/changelog` and `/privacy` are linked in the UI but not implemented yet.
