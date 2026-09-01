import { create } from "zustand";
import { axiosPlain } from "../utils/axios";


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
export interface RegionValues {
    self: { id: string; total: number | null };
    children: { [key: string]: number };
}

interface RegionDataState {
    regionValues: RegionValues;
}
interface RegionDataActions {
    setRegionValues: (data: RegionValues) => void;
}

type RegionDataStoreType = RegionDataState & RegionDataActions;
export const regionDataStore = create<RegionDataStoreType>((set) => ({
  regionValues: { self: { id: "bahia", total: null }, children: {} },
  setRegionValues: (data) => set({ regionValues: data }),
}));  // ── ⋙── ── ── ── ── ── ── ──➤


// [✪] yearStore

interface yearStoreI {
  year: number | null; // Initialized as null to know it's not loaded yet
  availableYears: number[];
  setYear: (year: number) => void;
  // Action to fetch initial data from the backend
  bootstrapYears: () => Promise<void>;
}



export const yearStore = create<yearStoreI>((set) => ({
  year: null,
  availableYears: [],
  setYear: (year) => set({ year }),
  
  bootstrapYears: async () => {
    try {
      // Assuming you'll create this endpoint in Django
      const response = await axiosPlain.get("/getAvailableYears/");
      const { latest, all } = response.data;
      
      set({ 
        year: latest, 
        availableYears: all 
      });
    } catch (error) {
      console.error("Failed to bootstrap years:", error);
      // Fallback to a safe default if API fails
      set({ year: 2023 });
    }
  },
}));

// ── ⋙── ── ── ── ── ── ── ──➤
