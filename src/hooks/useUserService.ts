import { useUserStore, User, UserAddForm } from "../store/userStore";
import { axiosForInterceptor } from "../utils/axios";

// Busca todos os usuários (só para admins)

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axiosForInterceptor.get("/users/");
  useUserStore.getState().setUserList(data);
  return data;
};

const createUser = async (userData: UserAddForm): Promise<User> => {
  // Antes usava /auth/registration/, que emite JWT e sobrescrevia os
  // cookies do admin — deslogando-o silenciosamente.
  const response: { data: User } = await axiosForInterceptor.post(
    "/users/",
    userData,
  );
  return response.data;
};

// Deleta um usuário específico
const deleteUser = async (userId: number) => {
  await axiosForInterceptor.delete(`/users/${userId}/`);
};

export const userService = {
  fetchUsers,
  createUser,
  deleteUser,
};
