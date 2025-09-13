import { axiosPlain } from "../utils/axios";
import { User } from "../utils/types";

interface Credentials {
  email: string;
  password: string;
}

const login = async (values: Credentials): Promise<{ user: User }> => {
  const response = await axiosPlain.post("/auth/login/", values);
  return response.data;
};
const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const response = await axiosPlain.post("/auth/token/refresh/", {});
    return response.status === 200;
  } catch (err) {
    console.error("[authService.tryRefreshToken] Falha ao renovar token:", err);
    return false;
  }
};

const logout = async (): Promise<void> => {
  try {
    await axiosPlain.post("/auth/logout/", {});
  } catch (err) {
    console.warn("[authService.logout] Falha ao deslogar no servidor:", err);
  }
};

export const authService = {
  login,
  tryRefreshToken,
  logout,
};
