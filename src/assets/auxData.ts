//  [●] VARIABLES
export const VARIABLES = {
  area_plantada_ou_destinada_a_colheita:
    "Área plantada ou destinada a colheita",
  area_colhida: "Área colhida",
  valor_da_producao: "Valor da produção",
};

//  [●] YEARS
export const YEARS = Array.from({ length: 2024 - 2000 }, (_, i) => 2000 + i);

export const SCOLORS = {
  valor_da_producao: "gray",
  area_colhida: "crimson",
  area_plantada_ou_destinada_a_colheita: "blue",
};

//  [●] COLORSTW
export const COLORSTW = {
  valor_da_producao: [
    "fill-neutral-50",
    "fill-neutral-100",
    "fill-neutral-200",
    "fill-neutral-300",
    "fill-neutral-400",
    "fill-neutral-500",
    "fill-neutral-600",
    "fill-neutral-700",
    "fill-neutral-800",
    "fill-neutral-900",
    "fill-neutral-950",
  ],

  area_colhida: [
    "fill-red-50",
    "fill-red-100",
    "fill-red-200",
    "fill-red-300",
    "fill-red-400",
    "fill-red-500",
    "fill-red-600",
    "fill-red-700",
    "fill-red-800",
    "fill-red-900",
    "fill-red-950",
  ],

  area_plantada_ou_destinada_a_colheita: [
    "fill-sky-50",
    "fill-sky-100",
    "fill-sky-200",
    "fill-sky-300",
    "fill-sky-400",
    "fill-sky-500",
    "fill-sky-600",
    "fill-sky-700",
    "fill-sky-800",
    "fill-sky-900",
    "fill-sky-950",
  ],
  
};

//  [●] COLORSTW_HEX
export const COLORSTW_HEX = {
  valor_da_producao: { from: "#fcfcfc", to: "#171717" },
  area_colhida: { from: "#7c2d12", to: "#fff7ed" },
  area_plantada_ou_destinada_a_colheita: { from: "#312e81", to: "#f5f7ff" },
};

//  [●] COLORSHEX
export const COLORSHEX = {
  area_plantada_ou_destinada_a_colheita: [
    "#312e81",
    "#3730a3",
    "#4338ca",
    "#4f46e5",
    "#6366f1",
    "#818cf8",
    "#a5b4fc",
    "#c7d2fe",
    "#e0e7ff",
    "#eef2ff",
    "#f5f7ff",
  ],
  area_colhida: [
    "#7c2d12",
    "#9a3412",
    "#c2410c",
    "#ea580c",
    "#f97316",
    "#fb923c",
    "#fdba74",
    "#fed7aa",
    "#ffe5cc",
    "#ffedd5",
    "#fff7ed",
  ],
  valor_da_producao: [
    "#171717",
    "#262626",
    "#404040",
    "#525252",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
    "#e5e5e5",
    "#f5f5f5",
    "#fafafa",
    "#fcfcfc",
  ],
};
