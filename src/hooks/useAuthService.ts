// src/hooks/useAuthService.ts
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { authService } from "../services/authService";

export const useAuthService = () => {
  const navigate = useNavigate();
  const { setActiveUser, removeUser } = useUserStore();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const loginResponse = await authService.login(credentials);
      const user = loginResponse.user;
      setActiveUser(user);
      localStorage.setItem(
        "user_info",
        JSON.stringify({ name: user.first_name })
      );
      return user;
    } catch (error) {
      localStorage.removeItem("user_info");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "Logout no servidor falhou, mas deslogando no frontend.",
        error
      );
    } finally {
      console.log('%c ⚠️ LOGOUT FOI CHAMADO! ', 'color: red; font-size: 16px; font-weight: bold;');
      removeUser();
      localStorage.removeItem("user_info");
      navigate("/"); // Redireciona para a homeF
    }
  };

  return {
    login,
    logout,
  };
};
