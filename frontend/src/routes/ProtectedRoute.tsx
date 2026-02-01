import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";
import { JwtPayload } from "../types/JwtPayload";

interface RotaProtegidaProps {
  children: ReactNode;
}

export default function RotaProtegida({ children }: RotaProtegidaProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
  localStorage.removeItem("token");
  return <Navigate to="/login?expired=1" replace />;
}

    return <>{children}</>;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}