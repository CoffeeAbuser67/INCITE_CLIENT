// src/interceptors/axiosAuthInterceptor.ts
import { axiosForInterceptor } from "./axios";

export const setupAxiosInterceptor = (
  tryRefreshToken: () => Promise<boolean>,
  logout: () => Promise<void>
) => {
  axiosForInterceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Marca a requisição original para evitar looping
        try {
          const isTokenRefreshed = await tryRefreshToken();

          if (isTokenRefreshed) {
            console.log('Authentication Refreshed ↺'); // [LOG] Authentication Refreshed ↺ 
            return axiosForInterceptor(originalRequest);
          }
        } catch (err) {
          await logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};



