
import { useEffect } from "react";
import { axiosPrivate } from "../utils/axios";
import useAuthService from "../utils/authService";

// {✪} useAxiosErrorInterceptor
const useAxiosErrorInterceptor = () => {

  const { tryRefreshToken, logout } = useAuthService();

  useEffect(() => {
    // Set up interceptors
    const errorResponseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        if (status === 401) {
          try {
            // {○} tryRefreshToken
            const isTokenRefreshed = await tryRefreshToken();

            if (isTokenRefreshed) {
              console.log('Authentication Refreshed'); // [LOG] Authentication Refreshed
              return axiosPrivate(originalRequest);
            }

          } catch (err) {
            await logout();
            return Promise.reject(err);
  
          }
        }
        // For all other errors, reject them
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(errorResponseInterceptor);
    };
  }, [tryRefreshToken, logout]);

  return axiosPrivate;
};

export default useAxiosErrorInterceptor;
