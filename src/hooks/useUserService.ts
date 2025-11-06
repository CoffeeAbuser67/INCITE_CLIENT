import { useUserStore , User, UserAddForm} from '../store/userStore';
import { axiosForInterceptor } from '../utils/axios';

// Busca todos os usuários (só para admins)

const fetchUsers = async (): Promise<User[]> => {
    const { data } = await axiosForInterceptor.get('/users/');
    useUserStore.getState().setUserList(data);
    return data;
};


const createUser = async (userData : UserAddForm ): Promise<User> => {
    // Admins usam o endpoint de registro para criar novos usuários
    const response: { data: User } = await axiosForInterceptor.post('/auth/registration/', userData);
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
