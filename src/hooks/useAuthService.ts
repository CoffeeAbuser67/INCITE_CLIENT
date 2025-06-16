// src/hooks/useAuthService.ts
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { authService } from "../services/authService";

export const useAuthService = () => {
  const navigate = useNavigate();
  const { setActiveUser, removeUser } = useUserStore();

  const login = async (credentials: { email: string; password: string }) => {
    const loginResponse = await authService.login(credentials);
    setActiveUser(loginResponse.user);
    return loginResponse.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout no servidor falhou, mas deslogando no frontend.", error);
    } finally {
      // Sempre remove o usuário do estado, mesmo que a chamada de API falhe
      removeUser();
      navigate("/"); // Redireciona para a home após o logout
    }
  };

  return {
    login,
    logout,
  };
};