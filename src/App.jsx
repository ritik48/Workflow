import "reactflow/dist/style.css";
import { Dashboard } from "./pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Workflow } from "./pages/workflow";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workflow/:id" element={<Workflow />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
