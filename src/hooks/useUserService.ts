import { User, useUserStore } from '../store/userStore';
import { axiosForInterceptor } from '../utils/axios';

// Busca todos os usuários (só para admins)

const fetchUsers = async (): Promise<User[]> => {
    const { data } = await axiosForInterceptor.get('/users/');
    useUserStore.getState().setUserList(data);
    return data;
};


// Cria um novo usuário (usando o endpoint de registro do dj-rest-auth)
const createUser = async (userData) => {
    // Admins usam o endpoint de registro para criar novos usuários
    const response = await axiosForInterceptor.post('/auth/registration/', userData);
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
