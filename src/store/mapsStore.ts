import { create } from "zustand";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ATUALIZE ESTA INTERFACE
interface mapStoreI {
  // --- Estados ---
  region: {
    active: string;
    name: string;
  };
  city: {
    active: string;
    name: string;
  };

  mapTransform: string;
  currentLevel: number;
  originalBBox: BoundingBox | null;

  // --- Actions (Funções) ---
  setRegion: (active: string, name: string) => void;
  setCity: (active: string, name: string) => void;
  setMapTransform: (transform: string) => void;
  setCurrentLevel: (level: number) => void;
  setOriginalBBox: (bbox: BoundingBox) => void;
}

// [✪] mapStore
// Agora o 'create<mapStoreI>' não vai mais gerar erros,
// pois a implementação bate com a interface.
export const mapStore = create<mapStoreI>((set) => ({
  // Estados Iniciais
  region: { active: "bahia", name: "Bahia" },
  city: { active: "", name: "" },
  mapTransform: "scale(1) translate(0px, 0px)",
  currentLevel: 0,
  originalBBox: null,

  // Actions
  setRegion: (active, name) => set({ region: { active, name } }),
  setCity: (active, name) => set({ city: { active, name } }),
  setMapTransform: (transform) => set({ mapTransform: transform }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setOriginalBBox: (bbox) => set({ originalBBox: bbox }),
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


// ── ⋙── ── ── ── ── ── ── ──➤
