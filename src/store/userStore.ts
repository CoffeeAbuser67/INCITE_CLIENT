// src/store/userStore.ts
import { create } from "zustand";

export interface User {
  pkid: number; // Geralmente pkid é number
  email: string;
  first_name: string;
  last_name: string;
  user_group: number; // number para o choice do Django
}

interface UserStore {
  user: User | null;
  sessionChecked: boolean;
  setActiveUser: (userData: User | null) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  sessionChecked: false, 
  setActiveUser: (userData) => {
    set({ user: userData, sessionChecked: true });
  },
  removeUser: () => {
    // Ao remover, setamos o user para null mas mantemos sessionChecked como true
    // para dizer ao RouteProtector: "a sessão foi checada e o resultado é: sem usuário".
    set({ user: null, sessionChecked: true }); 
  },
}));