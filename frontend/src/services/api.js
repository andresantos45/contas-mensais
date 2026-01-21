import axios from "axios";

const api = axios.create({
  baseURL: "https://contas-mensais-backend.onrender.com/api",
});

// 🔐 injeta token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 trata token inválido / expirado
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;