import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsuariosAdmin from "./pages/UsuariosAdmin";

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RotaAdmin({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <Routes>
  <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <RotaProtegida>
        <Dashboard />
      </RotaProtegida>
    }
  />

  {/* 🔓 TEMPORÁRIO – apenas exige login */}
  <Route
  path="/admin/usuarios"
  element={
    <RotaAdmin>
      <UsuariosAdmin />
    </RotaAdmin>
  }
/>

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  );
}
