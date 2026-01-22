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
      <RotaProtegida>
        <UsuariosAdmin />
      </RotaProtegida>
    }
  />

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  );
}
