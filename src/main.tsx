import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { WatchListProvider } from "./contexts/watchListProvider.tsx";
import { CatalogueFiltersProvider } from "./contexts/catalogueFiltersProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <WatchListProvider>
                <CatalogueFiltersProvider>
                    <App />
                </CatalogueFiltersProvider>
            </WatchListProvider>
        </BrowserRouter>
    </StrictMode>,
);
