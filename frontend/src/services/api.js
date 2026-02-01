// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://contas-mensais-backend.onrender.com",
// });

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 🔐 injeta token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // 🚫 NÃO envia token no login
  if (
    token &&
    !config.url?.includes("/api/auth/login") &&
    !config.url?.includes("/api/auth/refresh")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// 🚨 trata token inválido / expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // se já tentou e falhou → logout
    if (originalRequest._retry) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login?expired=1";
      return Promise.reject(error);
    }

    // apenas trata 401 fora das rotas de auth
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/api/auth/login") &&
      !originalRequest.url?.includes("/api/auth/refresh") &&
      !originalRequest.url?.includes("/api/auth/logout")
    ) {
      // se já existe refresh em andamento, entra na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login?expired=1";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const newToken = response.data.token;

        // 🔐 salva novo token
        localStorage.setItem("token", newToken);

        // 🔄 atualiza default header
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // libera fila
        processQueue(null, newToken);

        // refaz request original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login?expired=1";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
