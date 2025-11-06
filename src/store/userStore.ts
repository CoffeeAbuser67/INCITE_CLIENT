// src/store/userStore.ts
import { create } from "zustand";
import { axiosForInterceptor } from '../utils/axios';


export interface User {
    pkid: number;
    first_name: string;
    last_name: string;
    email: string;
    user_group: number;
    instituicoes_count: number;
}

export type UserAddForm = Omit<User, 'pkid' | 'instituicoes_count'> & {
    password1: string;
    password2: string;
};


interface UserStore {
    user: User | null;
    sessionChecked: boolean;
    userList: User[]; 
    setActiveUser: (user: User | null) => void;
    checkSession: () => Promise<void>; 
    setUserList: (users: User[]) => void;
    removeUser: () => void;

}


export const useUserStore = create<UserStore>((set) => ({
    user: null,
    sessionChecked: false,
    userList: [],

    setActiveUser: (user) => set({ user }),

    setUserList: (users) => set({ userList: users }),

    removeUser: () => {
        set({ user: null, sessionChecked: true }); 
    },

    checkSession: async () => {
        try {
            const response = await axiosForInterceptor.get('/auth/user/');
            if (response.data) {
                set({ user: response.data, sessionChecked: true });
            } else {
                throw new Error("No user data");
            }
        } catch (error) {
            console.log("Nenhuma sessão ativa encontrada.");
            set({ user: null, sessionChecked: true });
        }
    },
}));

