// src/utils/axiosAuthInterceptor.ts
import { axiosForInterceptor } from "./axios";
import { authService } from "../services/authService";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * Configura o interceptor global para o axiosForInterceptor.
 * - Se 401 e não for /auth/token/refresh/, tenta renovar token uma única vez (fila).
 * - Se a renovação falhar, chama logoutUser() e rejeita a promise.
 */
export const setupAxiosInterceptor = (logoutUser: () => void) => {
  axiosForInterceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Sem response (ex.: CORS, rede) — repasse o erro
      if (!error.response) {
        return Promise.reject(error);
      }

      // Só tenta refresh em 401 e se não for a rota de refresh
      const is401 = error.response?.status === 401;
      const isRefreshUrl = originalRequest?.url?.includes("/auth/token/refresh/");

      if (is401 && !isRefreshUrl) {
        // Se já tem refresh em andamento, enfileira e aguarda
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosForInterceptor(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        // Marca para evitar loop do mesmo request
        if ((originalRequest as any)._retry) {
          // Já tentamos — evita loop
          return Promise.reject(error);
        }
        (originalRequest as any)._retry = true;

        isRefreshing = true;

        try {
          const ok = await authService.tryRefreshToken();

          if (ok) {
            // Processa a fila com sucesso e refaz a request original
            processQueue(null);
            console.log('Token de acesso renovado 🎟️')
            console.log('Refazendo request original')
            return axiosForInterceptor(originalRequest);
          } else {
            // Falhou renovar — todo mundo falha e fazemos logout
            const refreshError = new Error("Não foi possível renovar o token (refresh falhou).");
            processQueue(refreshError);
            logoutUser();
            return Promise.reject(refreshError);
          }
        } catch (refreshError) {
          // Proteção extra (em teoria não cai aqui pois tryRefreshToken não lança)
          processQueue(refreshError as Error);
          logoutUser();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
