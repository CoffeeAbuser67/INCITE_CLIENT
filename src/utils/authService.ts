import { axiosDefault } from "./axios";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

interface Credentials {
  email: string;
  password: string;
}

// {✪} useAuthService
const useAuthService = () => {

  const navigate = useNavigate()
  const setActiveUser = useUserStore((state) => state.setActiveUser);
  const logoutActiveUser = useUserStore((state) => state.logoutActiveUser);
  // const user = useUserStore((state) => state.user);


  // {●} login
  const login = async (values: Credentials) => {
    try {
      const response = await axiosDefault.post("/auth/login/", values);
      const active_user = response?.data?.user;
      setActiveUser(active_user);
      return active_user
    } catch (error) {
      return Promise.reject(error);
    }
     // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  }

  // {●} tryRefreshToken
  const tryRefreshToken = async () => {
    try {
      const response = await axiosDefault.post(
        "/auth/token/refresh/",
        {},
        {
          withCredentials: true,
        }
      );
      return response?.status === 200;

    } catch (error) {
      return Promise.reject(error);
    }
  
  }; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


  // {●} logout
  const logout = async () => {
    try {

      logoutActiveUser();
      await axiosDefault.post(
        "/auth/logout/",
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/auth/login");
    } catch (error) {
      return Promise.reject(error);
    }
  }; // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


  return { tryRefreshToken, logout, login };
};

export default useAuthService;

