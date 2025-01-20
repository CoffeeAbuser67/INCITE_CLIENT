
import { useUserStore } from "../store/userStore";
import handleAxiosError from "../utils/handleAxiosError";
import useAxiosErrorInterceptor from "../hooks/useAxiosErrorInterceptor";

// {✪} useUserService
const useUserService = () => {
  
  const axios = useAxiosErrorInterceptor()
  const setUserList = useUserStore((state) => state.setUserList);


  // {●} loadUsers()
  const loadUsers = async () => {
    
    try {
      const url = "/auth/listUsers/";
      const response = await axios.get(url);
      console.log("loaded users:", response?.data); // [LOG] loaded patients 
      setUserList(response?.data);

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }

     // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  }

  return {loadUsers}

}

export default useUserService