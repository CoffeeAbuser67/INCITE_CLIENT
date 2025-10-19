import { create } from "zustand";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface mapStoreI {
  region: {
    active: string;
    name: string;
  };
  city: {
    active: string;
    name: string;
  };

  currentLevel: number;

  setRegion: (active: string, name: string) => void;
  setCity: (active: string, name: string) => void;
  setCurrentLevel: (level: number) => void;
}

// [✪] mapStore
export const mapStore = create<mapStoreI>((set) => ({
  region: { active: "bahia", name: "Bahia" },
  city: { active: "", name: "" },
  currentLevel: 0,
  setRegion: (active, name) => set({ region: { active, name } }),
  setCity: (active, name) => set({ city: { active, name } }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
}));

// ── ⋙── ── ── ── ── ── ── ──➤

// [✪] variableStore
import { VARIABLES } from "../assets/auxData";

type VariableKey = keyof typeof VARIABLES;
interface variableStoreI {
  variable: VariableKey;
  setVariable: (variable: VariableKey) => void;
}
export const variableStore = create<variableStoreI>((set) => ({
  variable: "valor_da_producao",
  setVariable: (variable) => set({ variable }),
})); // ── ⋙── ── ── ── ── ── ── ──➤



// [✪] regionDataStore
interface RegionDataState {
    regionValues: { [key: string]: number };
}
interface RegionDataActions {
    setRegionValues: (data: { [key: string]: number }) => void;
}

type RegionDataStoreType = RegionDataState & RegionDataActions;
export const regionDataStore = create<RegionDataStoreType>((set) => ({
  regionValues: {},
  setRegionValues: (data) => set({ regionValues: data }),
}));  // ── ⋙── ── ── ── ── ── ── ──➤



// [✪] yearStore

interface yearStoreI {
  year: number;
  setYear: (year: number) => void;
}

export const yearStore = create<yearStoreI>((set) => ({
  year: 2023,
  setYear: (year) => set({ year }),
}));


// ── ⋙── ── ── ── ── ── ── ──➤
