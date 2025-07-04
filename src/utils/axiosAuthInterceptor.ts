import { axiosForInterceptor } from "./axios";
import { authService } from "../services/authService";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAxiosInterceptor = (logoutUser: () => void) => {
  axiosForInterceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Verifica se o erro é 401 e se não é uma tentativa de refresh que falhou
      if (
        error.response?.status === 401 &&
        originalRequest.url !== "/auth/token/refresh/"
      ) {
        // Se já existe um refresh em andamento, coloca a requisição na fila
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              console.log("Fila: Token renovado, refazendo a requisição...");
              return axiosForInterceptor(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Se for a primeira requisição a falhar, inicia o processo de refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const isRefreshed = await authService.tryRefreshToken();

          if (isRefreshed) {
            console.log("Token renovado, refazendo a requisição original...");
            processQueue(null); // Processa a fila com sucesso
            return axiosForInterceptor(originalRequest);
          } else {
            // Se o refresh falhar, o tryRefreshToken já deve ter lidado com o logout,
            // mas podemos garantir aqui.
            const refreshError = new Error("Incapaz de renovar o token");
            processQueue(refreshError); // Processa a fila com erro
            logoutUser();
            return Promise.reject(refreshError);
          }
        } catch (refreshError) {
          processQueue(refreshError as Error); // Processa a fila com erro
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
