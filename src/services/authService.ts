// src/services/authService.ts
import { axiosPlain } from "../utils/axios";
import { User } from "../store/userStore";

interface Credentials {
  email: string;
  password: string;
}

const login = async (values: Credentials): Promise<{user: User}> => {
  // O dj-rest-auth/login retorna um objeto com uma chave 'user'
  const response = await axiosPlain.post("/auth/login/", values);
  return response.data;
};

const tryRefreshToken = async (): Promise<boolean> => {
  const response = await axiosPlain.post("/auth/token/refresh/", {});
  return response.status === 200;
};

const logout = async (): Promise<void> => {
  await axiosPlain.post("/auth/logout/", {});
};

export const authService = {
  login,
  tryRefreshToken,
  logout,
};