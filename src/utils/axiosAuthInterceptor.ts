// src/utils/axiosAuthInterceptor.ts
import { axiosForInterceptor } from "./axios";
import { authService } from "../services/authService";
import { useUserStore } from "../store/userStore";

interface FailedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: unknown;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      // _retry já foi marcado ao enfileirar: se esta retentativa voltar 401,
      // ela falha em vez de reentrar no fluxo de refresh.
      resolve(axiosForInterceptor(config as never));
    }
  });
  failedQueue = [];
};

// Logout sem depender do React. Antes a função vinha por injeção
// (setupAxiosInterceptor(logout)), o que obrigava a registrar o interceptor
// de dentro de um componente.
const forceLogout = () => {
  useUserStore.getState().removeUser();
};

// Registrado uma única vez, na importação do módulo.
axiosForInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Sem response (ex.: CORS, rede) — repasse o erro
    if (!error.response) {
      return Promise.reject(error);
    }

    const is401 = error.response?.status === 401;
    const isRefreshUrl = originalRequest?.url?.includes("/auth/token/refresh/");

    if (!is401 || isRefreshUrl) {
      return Promise.reject(error);
    }

    // Já tentamos esta request uma vez — evita loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já tem refresh em andamento, enfileira e aguarda
    if (isRefreshing) {
      originalRequest._retry = true;
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const ok = await authService.tryRefreshToken();

      if (ok) {
        processQueue(null);
        return axiosForInterceptor(originalRequest);
      }

      const refreshError = new Error(
        "Não foi possível renovar o token (refresh falhou).",
      );
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
