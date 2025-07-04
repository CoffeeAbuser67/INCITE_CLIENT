import { axiosForInterceptor } from "./axios";
import { authService } from "../services/authService";


export const setupAxiosInterceptor = (logoutUser: () => void) => {
  axiosForInterceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const isRefreshed = await authService.tryRefreshToken();

        if (isRefreshed) {
          console.log("Token renovado, refazendo a requisição...");
          return axiosForInterceptor(originalRequest);
        } else {
          // Se o refresh falhar, desloga o usuário
          logoutUser();
        }
      }
      return Promise.reject(error);
    }
  );
};
