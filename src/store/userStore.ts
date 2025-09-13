// src/store/userStore.ts
import { create } from "zustand";
import { User } from '../utils/types';
import { axiosForInterceptor } from '../utils/axios';


interface UserStore {
    user: User | null;
    sessionChecked: boolean;
    setActiveUser: (user: User | null) => void;
    checkSession: () => Promise<void>; 
}


export const useUserStore = create<UserStore>((set) => ({
    user: null,
    sessionChecked: false,

    setActiveUser: (user) => set({ user }),

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

