import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UsuariosAdmin from "./pages/UsuariosAdmin";
import jwtDecode from "jwt-decode";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rota inicial SEMPRE vai para login */}
        <Route
  path="/"
  element={
    localStorage.getItem("token")
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/login" replace />
  }
/>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

          {/* Admin - Usuários */}
<Route
  path="/admin/usuarios"
  element={
    <AdminRoute>
      <UsuariosAdmin />
    </AdminRoute>
  }
/>

        {/* Qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
