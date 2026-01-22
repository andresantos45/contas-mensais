import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsuariosAdmin from "./pages/UsuariosAdmin";

function RotaProtegidaAdmin({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

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
    <RotaProtegidaAdmin>
      <UsuariosAdmin />
    </RotaProtegidaAdmin>
  }
/>

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  );
}
