import { create } from "zustand";

interface mapStoreI {
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
// [✪] mapStore
export const mapStore = create<mapStoreI>((set) => ({
  region: { active: "bahia", name: "" },
  city: { active: "", name: "" },
  setRegion: (active, name) => set({ region: { active, name } }),
  setCity: (active, name) => set({ city: { active, name } }),
}));


// ── ⋙── ── ── ── ── ── ── ──➤
import { VARIABLES } from "../assets/auxData";

type VariableKey = keyof typeof VARIABLES;

interface variableStoreI {
  variable: VariableKey;
  setVariable: (variable: VariableKey) => void;
}

// [✪] variableStore
export const variableStore = create<variableStoreI>((set) => ({
  variable: "valor_da_producao",
  setVariable: (variable) => set({ variable }),
}));



// ── ⋙── ── ── ── ── ── ── ──➤
// [✪] yearStore

interface yearStoreI {
  year: number;
  setYear: (year: number) => void;
}

export const yearStore = create<yearStoreI>((set) => ({
  year: 2023,
  setYear: (year) => set({ year }),
}));