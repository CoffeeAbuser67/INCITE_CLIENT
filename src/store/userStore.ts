import { create } from "zustand";

// Function to get the initial value for isLoggedIn from localStorage

interface User {
  email: string;
  first_name: string;
  last_name: string;
  pkid: number;
  user_group: number;
}

const getInitialLoggedInValue = (): boolean => {
  const loggedIn = localStorage.getItem("isLoggedIn");
  return loggedIn === "true"; // Return true if the value is "true"
};

const getActiveStoredUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user) as User) : null;
};

interface UserStore {
  user: null | User;
  user_role: number | undefined;
  isLoggedIn: boolean;
  userList: User[];
  setUserList: (userList: User[]) => void;
  setActiveUser: (userData: User) => void;
  setUserRole: (role: number) => void;
  logoutActiveUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: getActiveStoredUser(),
  isLoggedIn: getInitialLoggedInValue(), // Dynamically set initial value
  user_role: undefined,

  userList: [],
  setUserList: (userList) => set({ userList: userList }),

  setActiveUser: (userData) => {
    set({ user: userData, isLoggedIn: true });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  },

  setUserRole: (role) => {
    set({ user_role: role });
  },

  logoutActiveUser: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  },
}));
