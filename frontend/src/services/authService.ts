import api from "./api";

export async function login(email: string, senha: string) {
  const response = await api.post("/api/auth/login", {
    email,
    senha,
  });

  return response.data; // { token, refreshToken, usuario }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
