import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {WatchListProvider} from "./contexts/watchListProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <WatchListProvider>
              <App />
          </WatchListProvider>
      </BrowserRouter>
  </StrictMode>,
)
