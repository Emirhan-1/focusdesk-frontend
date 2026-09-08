import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import StudiesessiesPage from "./pages/StudiesessiesPage";
import StudiedoelenPage from "./pages/StudiedoelenPage";
import TagsPage from "./pages/TagsPage";
import LoginPage from "./pages/LoginPage";
import CoachDashboardPage from "./pages/CoachDashboardPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [rol, setRol] = useState(localStorage.getItem("rol"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol(null);
  }

  if (!token) {
    return <LoginPage setToken={setToken} setRol={setRol} />;
  }

  if (rol === "Coach") {
    return (
      <Routes>
        <Route path="/" element={<CoachDashboardPage token={token} setToken={logout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage token={token} setToken={logout} />} />
      <Route path="/studiesessies" element={<StudiesessiesPage token={token} setToken={logout} />} />
      <Route path="/studiedoelen" element={<StudiedoelenPage token={token} setToken={logout} />} />
      <Route path="/tags" element={<TagsPage token={token} setToken={logout} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;