import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "./pages/LandingPage"
const AdminPage = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin page (auth) */}
        <Route path="/admin" element={
          <Suspense fallback={null}>
            <AdminPage />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;