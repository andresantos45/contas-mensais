import axios from "axios";

const api = axios.create({
  baseURL: "https://contas-mensais-api.onrender.com/api",
});

// 🔐 injeta token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 trata token inválido / expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ⚠️ NÃO redirecionar automaticamente se já estiver na tela de login
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
