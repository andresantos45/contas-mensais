import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

import Entradas from "./pages/Entradas";

export default function App() {
  return (
    <Routes>
      {/* ✅ ROTA RAIZ – SEMPRE EXISTE */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      

      <Route
        path="/entradas"
        element={
          <ProtectedRoute>
            <Entradas />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
