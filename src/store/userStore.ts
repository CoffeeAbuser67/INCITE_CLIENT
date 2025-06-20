// src/store/userStore.ts
import { create } from "zustand";

export interface User {
  pkid: number; // Geralmente pkid é number
  email: string;
  first_name: string;
  last_name: string;
  instituicoes_count: number;
  user_group: number; // number para o choice do Django
}

interface UserStore {
  user: User | null;
  sessionChecked: boolean;
  userList: User[]; 

  setActiveUser: (userData: User | null) => void;
  setUserList: (users: User[]) => void; // <-- NOVO: Ação para popular a lista
  removeUser: () => void;
}


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  userList: [],
  sessionChecked: false, 
  setActiveUser: (userData) => {
    set({ user: userData, sessionChecked: true });
  },
  
  setUserList: (users) => set({ userList: users }),
  removeUser: () => {
    set({ user: null, sessionChecked: true }); 
  },
}));