import "reactflow/dist/style.css";
import { Dashboard } from "./pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Workflow } from "./pages/workflow";
import { WorkflowProvider } from "./WorkflowContext";

export default function App() {
    return (
        <WorkflowProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/workflow/:id" element={<Workflow />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </WorkflowProvider>
    );
}
