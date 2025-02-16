import { create } from "zustand";

interface Store {
  region: {
    active: string; // ID of the active region
    name: string;
  };
  city: {
    active: string; // ID of the active city
    name: string;
  };
  setRegion: (active: string, name: string) => void;
  setCity: (active: string, name: string) => void;
}

const useStore = create<Store>((set) => ({
  region: { active: "", name: "" },
  city: { active: "", name: "" },
  setRegion: (active, name) => set({ region: { active, name } }),
  setCity: (active, name) => set({ city: { active, name } }),
}));

export default useStore;
