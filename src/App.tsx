import { Route, Routes} from "react-router";
import Home from "./pages/Home/Home.tsx";
import AppLayout from "./components/layouts/AppLayout.tsx";
import Catalogue from "./pages/Catalogue/Catalogue.tsx";

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
            </Routes>
        </AppLayout>
    )
}

export default App
