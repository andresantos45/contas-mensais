import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsuariosAdmin from "./pages/UsuariosAdmin";
import { jwtDecode } from "jwt-decode";
import Entradas from "./pages/Entradas";

function RotaProtegidaAdmin({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role; // 👈 CORRETO

    if (role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
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
      {/* ✅ ROTA RAIZ – SEMPRE EXISTE */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <RotaProtegidaAdmin>
            <UsuariosAdmin />
          </RotaProtegidaAdmin>
        }
      />

      <Route
        path="/entradas"
        element={
          <RotaProtegida>
            <Entradas />
          </RotaProtegida>
        }
      />
    </Routes>
  );
}
