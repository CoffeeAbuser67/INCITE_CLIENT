import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  useSpring,
  useTransition,
  animated,
} from "@react-spring/web";

import {
  Blockquote,
  Box,
  Button,
  Card,
  DropdownMenu,
  Heading,
  Separator,
} from "@radix-ui/themes";

import classNames from "classnames";

import { axiosDefault } from "../../services/axios";
import handleAxiosError from "../../utils/handleAxiosError";

import { mapStore, variableStore, yearStore } from "../../store/mapsStore";

import regionCityData from "../../assets/BahiaRegiaoMuni.json";
import regionData from "../../assets/BahiaRegiao.json";

import { COLORSTW, VARIABLES, YEARS } from "../../assets/auxData";


const SVG_TEST = () => ( // [MEDIA] SVG_TEST
  <svg
    fill="none"
    viewBox="0 0 24 24"
    x={562.684}
    y={481.65}
    width={12}
    height={12}
  >
    <g fill="#292D32">
      <path d="M16.65 20.2v.29a9.513 9.513 0 0 1-10.38-.06v-.23c0-2.33 2.33-4.23 5.19-4.23 2.87 0 5.19 1.9 5.19 4.23Z" />
      <path
        d="M21 12.5c0 3.35-1.73 6.29-4.35 7.99v-.29c0-2.33-2.32-4.23-5.19-4.23-2.86 0-5.19 1.9-5.19 4.23v.23A9.487 9.487 0 0 1 2 12.5C2 7.25 6.25 3 11.5 3c1.31 0 2.56.26 3.7.74-.13.4-.2.82-.2 1.26 0 .75.21 1.46.58 2.06.2.34.46.65.76.91C17.04 8.61 17.97 9 19 9c.44 0 .86-.07 1.25-.21.48 1.14.75 2.4.75 3.71Z"
      />
      <path d="M21.97 2.33A3.944 3.944 0 0 0 19 1a3.995 3.995 0 0 0-4 4c0 .75.21 1.46.58 2.06.2.34.46.65.76.91C17.04 8.61 17.97 9 19 9c.44 0 .86-.07 1.25-.21.92-.29 1.69-.92 2.17-1.73.21-.34.37-.73.46-1.13.08-.3.12-.61.12-.93 0-1.02-.39-1.96-1.03-2.67Zm-1.48 3.4h-.74v.78c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.78h-.74c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h.74v-.71c0-.41.34-.75.75-.75s.75.34.75.75v.71h.74a.749.749 0 1 1 0 1.5ZM11.46 14.73a2.81 2.81 0 1 0 0-5.62 2.81 2.81 0 0 0 0 5.62Z" />
    </g>
  </svg>
)// . . . . . . .

const SVG_TEST2 = () => ( // [MEDIA] SVG_TEST
  <svg

    width={22}
    height={22}
    x={562.684}
    y={481.65}
  >
    <g >
      <circle cx="11" cy="11" r="11" fill="green" />
      <text x="11" y="12.5" font-size="20" text-anchor="middle" fill="white" font-family="Arial" dominant-baseline="middle">
        2
      </text>
    </g>
  </svg>
)// . . . . . . .

interface lixo { w: number; h: number; x: number; y: number; qtd: number;  correction: number }

// NOTE
//  As dimensoes dos a
const SVG_MARKER = ({ w, h, x, y, qtd, correction }: lixo) => ( // [MEDIA] SVG_MARKER
  <svg
    data-name="Marker"
    viewBox="0 0 587 622"
    width={w}
    height={h}
    x={x - w / 2} // menos metade da largura
    y={y - h / 2} // menos metade da altura
    className=" overflow-visible pointer-events-none"
  >

    <defs>
      <filter id="shadow" x="-100%" y="-100%" width="200%" height="200%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="black" flood-opacity="0.4" />
      </filter>
    </defs>

    <g id="Marker">
      <rect
        width={585}
        height={620}
        x={1}
        y={1}
        rx={75}
        ry={75}
        style={{
          fill: "#0952aa",
          strokeWidth: 0,
        }}
        filter="url(#shadow)" // Aqui está o segredo!
      />

      <g id="i">
        <path
          d="M138 580.2h311L363 423V189.3h26.1v-52.2H197.9v52.2H224V423l-86 157.2z"
          style={{
            fill: "#9ee3e5",
            strokeWidth: 0,
          }}
        />
        <path
          d="M250.1 451.7 198 554.2h191.2l-37.4-69.5c-40.8-.9-75.6-14.8-101.7-33Z"
          style={{
            fill: "#34b515",
            strokeWidth: 0,
          }}
        />
        <path
          d="m250.1 451.7 45.2 102.5h93.8l-37.4-69.5c-40.8-.9-75.6-14.8-101.7-33Z"
          style={{
            fill: "#239b02",
            strokeWidth: 0,
          }}
        />
        <path
          d="M224 189.3h139v43.4"
          style={{
            fill: "#69bcba",
            strokeWidth: 0,
          }}
        />
        <path
          d="M267.4 319.6v-26.1c0-5.2-3.5-8.7-8.7-8.7s-8.7 4.3-8.7 8.7v26.1h17.4ZM250.1 337v74.7c0 5.2 3.5 8.7 8.7 8.7s8.7-4.3 8.7-8.7V337h-17.4Z"
          style={{
            fill: "#e1f9f8",
            strokeWidth: 0,
          }}
        />
        <path
          d="M284.8 137.1v300.6c0 5.2 3.5 9.6 8.7 9.6s8.7-4.3 8.7-9.6V137.1h-17.4Z"
          style={{
            fill: "#42a8a3",
            strokeWidth: 0,
          }}
        />
        <path
          d="M292.6 78c-19.1-22.6-52.1-40-73-35.6-7.8 20 5.2 54.7 24.3 77.3 19.1 22.6 40 26.1 60.8 21.7 7.8-20 7-40.8-12.2-63.4Z"
          style={{
            fill: "#239b02",
            strokeWidth: 0,
          }}
        />
        <path
          d="M304.8 141.5c7.8-20 7-40.8-12.2-63.4-19.1-22.6-52.1-40-73-35.6"
          style={{
            fill: "#34b515",
            strokeWidth: 0,
          }}
        />
        <path
          d="M294.4 78c19.1-22.6 52.1-40 73-35.6 7.8 20-5.2 54.7-24.3 77.3-19.1 22.6-40 26.1-60.8 21.7-7.8-20-7-40.8 12.2-63.4Z"
          style={{
            fill: "#239b02",
            strokeWidth: 0,
          }}
        />
        <path
          d="M282.2 141.5c-7.8-20-7-40.8 12.2-63.4 19.1-22.6 52.1-40 73-35.6"
          style={{
            fill: "#34b515",
            strokeWidth: 0,
          }}
        />
      </g>


      <g id='indicator'>
        <circle cx="570" cy="1" r="150" fill="pink" />
        <text x="570" y="12.5" font-size="200" text-anchor="middle" fill="black" font-family="Arial" dominant-baseline="middle">
          {qtd}
        </text>
      </g>


    </g>
  </svg>
); // . . . . . . .






const SCALE_ADJUSTMENT = 0.35

interface Region {
  id: string;
  d: string;
  name: string;
}

interface RegionCity {
  [key: string]: Region[];
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// [●] mapRegionCity
const mapRegionCity: RegionCity = regionCityData;

// [●] mapRegion
const mapRegion: Region[] = regionData;

// 🧿


const MapMenu = () => { // ★ MapMenu  ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
  let CORRECTION = 1
  const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef
  const c1Ref = useRef<SVGCircleElement | null>(null); // HERE c1Ref
  const originalBBoxRef = useRef<BoundingBox | null>(null); // HERE originalBBoxRef

  const handleMouseEnter = useCallback((name: string) => {
    setTooltip({ name });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ name: null });
  }, []);
  // ── ⋙── ── ── ── ── ── ── ──➤


  // ✳ [tooltip, setTooltip]
  const [tooltip, setTooltip] = useState<{ name: string | null }>({
    name: null,
  });

  type levels = 0 | 1;
  // ✳ [currentLevel, setCurrentLevel]
  const [currentLevel, setCurrentLevel] = useState<levels>(0);

  // WARN  EU estou usando esse estado pra nada ??? wut 
  // ✳ [currentScale, setCurrentScale]
  const [currentScale, setCurrentScale] = useState<number>(1);

  // ✳ { region, city, setRegion, setCity } 
  const { region, city, setRegion, setCity } = mapStore();

  // ✳ { variable, setVariable } 
  const { variable, setVariable } = variableStore();

  // ✳ { year, setYear } 
  const { year, setYear } = yearStore();

  type regionValuesI = { total: number; name_id: string };

  // ✳ [bahiaValues, setBahiaValues]
  const [bahiaValues, setBahiaValues] = useState<regionValuesI[]>([]);
  const [regionValues, setRegionValues] = useState<regionValuesI[]>([]);

  // const [rect, setRect] = useState<DOMRect | null>(null);
  // const [bbox, setBbox] = useState<DOMRect | null>(null);

  // ✳ [crabPos, setCrabPos]
  const [crabPos, setCrabPos] = useState({ X: 300, Y: 300 }); // ── ⋙── ── ── ── ── ── ──➤

  useEffect(() => { //HERE uE
    if (svgRef.current && !originalBBoxRef.current) {
      // Assign the value from getBBox to the ref
      originalBBoxRef.current = svgRef.current.getBBox();
      console.log("Original BBox:", originalBBoxRef.current);
    }
  }, []); // . . . . . . .

  const getRegionValues = useCallback(async () => { // (✪) getRegionValues 
    const axios = axiosDefault;
    try {

      const url = "/getRegionValues/";
      // ⊙ region.active ⊙ year ⊙ variable
      const params = {
        region: region.active,
        year: year,
        variable: variable,
      };

      const response = await axios.get(url, { params }); // _PIN_ getRegionValues  ✉ 
      const data = response?.data
      setRegionValues(data) // ↺ setRegionValues
      console.log(data); // [LOG] 

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }

  }, [region.active, year, variable]

  ) // . . . 

  useEffect(() => { // (●) uE
    getRegionValues(); // (○) getRegionValues
  }, [getRegionValues]); // ── ⋙── ── ── ── ── ── ── ──➤

  const getBahiaValues = useCallback(async () => { // (✪) getBahiaValues 
    const axios = axiosDefault;
    try {
      const url = "/getRegionValues/";
      // ⊙ year ⊙ variable
      const params = {
        region: 'bahia',
        year: year,
        variable: variable,
      };

      const response = await axios.get(url, { params }); // _PIN_ getRegionValues  ✉ 
      const data = response?.data
      setBahiaValues(data) // ↺ setBahiaValues
      console.log(data); // [LOG] 

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }

  }, [year, variable])
  //  . . .
  useEffect(() => { // (●) uE
    getBahiaValues(); // (○) getBahiaValues
  }, [getBahiaValues]); // ── ⋙── ── ── ── ── ── ──➤

  // ✪ transition
  const transition = useTransition(mapRegionCity[region.active] || [], {
    trail: 600 / mapRegionCity[region.active].length || 1,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    config: { mass: 10, tension: 63, friction: 16, clamp: true },
    keys: (mapRegionCity[region.active] || []).map((el) => el.id),
  });
  // ✪ springStyles
  const [springStyles, api] = useSpring(() => ({
    transform: `scale(1) translate(0px, 0px)`,
    config: { tension: 62, friction: 35, mass: 7 },
  }));

  // {✪} calculateItemColorClass
  function calculateItemColorClass(
    itemTotal: number,
    logMin: number,
    logMax: number,
    colors: string[], // Assumindo que é sempre um array válido de classes Tailwind
  ): string { // Retorna sempre uma string de classe de cor

    // Se, por algum motivo, logMin e logMax forem iguais (ex: todos os valores são 0),
    // o que levaria a uma divisão por zero.
    if (logMin === logMax) {
      return colors[Math.floor(colors.length / 2)] || colors[0] || "";
    }

    const logValue = Math.log10(itemTotal + 1);

    let index = Math.floor(((logValue - logMin) / (logMax - logMin)) * (colors.length - 1));
    index = Math.max(0, Math.min(index, colors.length - 1)); // Garante que o índice esteja nos limites

    if (isNaN(index)) { // Segurança extra
      return colors[0] || "";
    }
    return colors[index];
  }// ── ⋙── ── ── ── ── ── ──➤

  // {✪} resetMap
  const resetMap = () => {
    setCurrentLevel(0); // ↺ setCurrentLevel
    setCurrentScale(1); // ↺ setCurrentScale
    setRegion("bahia", "Bahia"); // ↺ setRegion
    setCity("", ""); // ↺ setCity

    api.start({
      transform: "scale(1) translate(0px, 0px)",
    });
  }; // ── ⋙── ── ── ── ── ── ──➤

  // <✪> runToFit
  const runToFit = (bbox: BoundingBox, rect: BoundingBox) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    // const svgBox = svgRef.current?.getBBox()
    const svgBox = originalBBoxRef.current; // get the cached svg bbox value

    if (!svgRect || !svgBox) return;

    const CBX = bbox.x + bbox.width / 2;
    const CBY = bbox.y + bbox.height / 2;

    const SVGCX = svgBox.width / 2;
    const SVGCY = svgBox.height / 2;

    // {●} translate
    // + 5 is the offset from the edge of the canvas
    const translateX = SVGCX - CBX + 5;
    const translateY = SVGCY - CBY + 5;

    // {●} Scale
    const scaleX = svgRect.width / rect.width;
    const scaleY = svgRect.height / rect.height;
    const maxScale = Math.min(scaleX, scaleY);

    setCrabPos({ X: CBX, Y: CBY }); // ↺ setCrabPos
    setCurrentScale(maxScale - SCALE_ADJUSTMENT); // ↺ setCurrentScale

    api.start({
      transform: `scale(${maxScale - SCALE_ADJUSTMENT
        }) translate(${translateX}px, ${translateY}px)`,
    });
  }; // ── ⋙── ── ── ── ── ── ──➤

  // <✪> handleClick
  const handleClick = (event) => {
    const target = event.target;
    const target_id = target?.id;
    const target_type = target?.getAttribute("data-type");
    const target_name = target?.getAttribute("data-name");

    // [LOG] target
    // console.log("target:", target);
    console.log("target id:", target_id);
    console.log("target type:", target_type);
    console.log("target name:", target_name);
    console.log("level:", currentLevel);
    console.log("✦────────────────────────────➤");

    // . . .
    // ⊙ currentLevel 0
    if (currentLevel === 0) {
      if (target_type === "region") {
        setCurrentLevel(1); // ↺ setCurrentLevel
        setRegion(target_id, target_name);  // ↺ setRegion
        runToFit(target.getBBox(), target.getBoundingClientRect()); // {○} runToFit
      }
    } // . . .

    // ⊙ currentLevel 1
    else if (currentLevel === 1) {
      if (target_type === "city") {
        setCurrentLevel(1); // ↺ setCurrentLevel
        setCity(target_id, target_name) // ↺ setCity
        // runToFit(target.getBBox(), target.getBoundingClientRect()); // {○} runToFit
        console.log(target_id, "↯"); // [LOG] target_id  ↯
      } else {
        resetMap(); // {○} resetMap
      }
    }
  }  // ── ⋙── ── ── ── ── ── ── ──➤

  // [✪] memoizedRegions 
  const memoizedRegions = useMemo(() => {
    const currentColors = COLORSTW[variable] || []; // Garante que currentColors seja um array

    // Se não houver dados ou cores, renderiza as regiões com estilo padrão
    if (!bahiaValues || bahiaValues.length === 0 || currentColors.length === 0) {
      return mapRegion.map((el, i) => (
        <g key={i} className="cls-region">
          <title>{el.name}</title>
          <animated.path
            id={el.id}
            d={el.d}
            data-name={el.name}
            data-type="region"
            className="path-hover"
            onMouseMove={() => handleMouseEnter(el.name)}
            onMouseLeave={handleMouseLeave}
          />
        </g>
      ));
    }

    const totals = bahiaValues.map(d => d.total);
    const min = Math.min(...totals);
    const max = Math.max(...totals);

    const dataIsUniform = min === max;
    let logMin = 0;
    let logMax = 0;

    // Só calcula logs se os dados não forem uniformes (min !== max)
    if (!dataIsUniform) {
      logMin = Math.log10(min + 1);
      logMax = Math.log10(max + 1);
    }

    // Opcional: Criar um mapa para acesso rápido aos totais, se `bahiaValues` for grande
    // e `mapRegion` não corresponder diretamente em ordem ou tiver itens faltantes.
    // Se `mapRegion` e `bahiaValues` são correspondentes e `el.id` é usado para encontrar em `bahiaValues`
    // que já tem o `total`, a busca pode ser feita diretamente.
    // Para simplificar, assumindo que cada `el` de `mapRegion` precisa ter seu `total` encontrado em `bahiaValues`.
    const bahiaValuesMap = new Map(bahiaValues.map(item => [item.name_id, item.total]));

    return mapRegion.map((el, i) => {
      const itemTotal = bahiaValuesMap.get(el.id);
      let colorClass = ""; // Cor padrão ou nenhuma cor específica

      if (itemTotal !== undefined) { // Se a região tem um valor correspondente
        colorClass = calculateItemColorClass(
          itemTotal,
          logMin,
          logMax,
          currentColors,
        );
      }

      return (
        <g key={i} className={classNames("cls-region", colorClass)}>
          <title>{el.name}</title>
          <animated.path
            id={el.id}
            d={el.d}
            data-name={el.name}
            data-type="region"
            className="path-hover"
            onMouseMove={() => handleMouseEnter(el.name)}
            onMouseLeave={handleMouseLeave}
          />
        </g>
      );
    });
  }, [bahiaValues, variable, handleMouseEnter, handleMouseLeave]);

  // [✪] cityColoringParams
  const cityColoringParams = useMemo(() => {
    const currentColors = COLORSTW[variable] || [];

    if (!regionValues || regionValues.length === 0 || currentColors.length === 0) {
      return null; // Indica que não há parâmetros para colorir
    }

    const totals = regionValues.map(d => d.total);
    const min = Math.min(...totals);
    const max = Math.max(...totals);

    const dataIsUniform = min === max;
    let logMin = 0;
    let logMax = 0;

    if (!dataIsUniform) {
      logMin = Math.log10(min + 1);
      logMax = Math.log10(max + 1);
    }

    // Os itens da transição (`item` em `transition((style, item) => ...)`)
    // já contêm `item.id` e `item.total` (se `mapRegionCity` tiver `total`).
    // Se `mapRegionCity` não tiver `total`, precisamos de um mapa como no passo anterior.
    // `RegionCity` tem `City[]`, e `City` não tem `total`.
    // `regionValues` (que é `regionValuesI[] = { total: number; name_id: string }[]`)
    // é quem tem os totais para os municípios.
    // Então, precisamos de um mapa para os totais dos municípios.

    const cityTotalsMap = new Map(regionValues.map(rv => [rv.name_id, rv.total]));

    return {
      logMin,
      logMax,
      currentColors,
      dataIsUniform,
      cityTotalsMap // Mapa para buscar o total do município pelo ID
    };
  }, [regionValues, variable]); // Depende de regionValues e da variável selecionada

  return ( // ── ◯─◡◠◡◠◡◠◡◠ DOM ◡◠◡◠◡◠─⫸ 🌑
    <>
      <div
        className="flex gap-10 w-full"
      >
        <div className=" flex flex-col">
          <Box
            // . . . . . . . . . DropDown . . . 
            id="DropDownComponent"
            className="flex justify-start gap-6 w-full"
          >
            <DropdownMenu.Root
            // ⊙  Variable
            // ↺ setVariable
            >
              <DropdownMenu.Trigger>
                <Button color="gray" variant="solid" highContrast>
                  {variable ? VARIABLES[variable] : "Variável medida"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content color="gray" variant="soft" highContrast>
                <DropdownMenu.Item onSelect={() => setVariable("valor_da_producao")} shortcut="💵">
                  Valor da produção
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => setVariable("area_plantada_ou_destinada_a_colheita")} shortcut="🌱">
                  Área plantada ou destinada a colheita
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setVariable("area_colhida")} shortcut="🥗">
                  Área colhida
                </DropdownMenu.Item>
              </DropdownMenu.Content>

            </DropdownMenu.Root>

            <DropdownMenu.Root
            // ⊙ Year 
            // ↺ setYear
            >
              <DropdownMenu.Trigger>
                <Button color="gray" variant="solid" highContrast>
                  {year ?? "Ano"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content color="gray" variant="soft" highContrast>
                {YEARS.map((y, i) => (
                  <DropdownMenu.Item key={i} onSelect={() => setYear(y)} shortcut="●">{y}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>


          </Box >
          <div //── ⋙── ── canvas-wrapper ── ──➤
            id="canvas-wrapper"
            className="relative bg-transparent rounded-3xl"
            style={{
              width: "715px",
              height: "760px",
              overflow: "hidden",
              // border: "1px solid black",
            }}
          >

            <div // HERE TOOLTIP
              id="TOOLTIP"
              className="absolute bg-gray-900 text-white text-sm p-2 rounded shadow-lg"
              style={{
                top: "0.5rem",  // Um pequeno espaçamento da borda superior
                left: "0.5rem", // Um pequeno espaçamento da borda direita
                pointerEvents: "none",
                zIndex: 10, // Garante que o tooltip fica acima do SVG
              }}
            >
              {tooltip.name}
            </div>

            <div // HERE TOOLthermometerLegend
              id='thermometerLegend'
              className="absolute w-10 h-48 bg-gradient-to-b from-neutral-50 to-neutral-950 rounded-lg shadow-md"
              style={{
                bottom: "0.5rem",  // Um pequeno espaçamento da borda superior
                right: "0.5rem", // Um pequeno espaçamento da borda direita
                pointerEvents: "none",
                zIndex: 10,
              }}
            ></div>

            <animated.svg // . . . SVGCanvas
              id="SVGCanvas"
              ref={svgRef}
              viewBox="0 0 715 760"
              overflow={"visible"}
              style={{
                width: "100%",
                height: "100%",
                ...springStyles, // ○ springStyles
              }}
              // (○) handleClick
              onClick={handleClick}
            >
              <g>
                <defs>
                  <style>
                    {
                      ".cls-region{stroke:#000;stroke-linejoin:round;stroke-width:.8px}"
                    }
                    {
                      ".cls-city{stroke:#000;stroke-linejoin:round;stroke-width:.5px}"
                    }
                  </style>
                </defs>


                { // [○] memoizedRegions
                  memoizedRegions
                }

                {currentLevel === 1 && (
                  // . . . . . . .
                  // HERE Overlay
                  <rect
                    opacity={0.95}
                    x={-2000}
                    y={-2000}
                    width="4000"
                    height="4000"
                    fill="white"
                  />
                )}

                {transition((style, cityItem) => { // ○ transition
                  // . . . . . . .
                  // [○] mapRegionCity 
                  let citySpecificColorClass = "";

                  if (city.active === cityItem.id) {
                    citySpecificColorClass = "fill-emerald-600";
                  } else if (cityColoringParams && cityColoringParams.cityTotalsMap.has(cityItem.id)) {
                    const itemTotal = cityColoringParams.cityTotalsMap.get(cityItem.id)!;
                    citySpecificColorClass = calculateItemColorClass(
                      itemTotal,
                      cityColoringParams.logMin,
                      cityColoringParams.logMax,
                      cityColoringParams.currentColors,
                    );
                  }

                  return (
                    <animated.g {...style}>
                      <title>{cityItem.name}</title>
                      <animated.path
                        id={cityItem.id}
                        d={cityItem.d}
                        data-name={cityItem.name}
                        data-type="city"
                        className={classNames(
                          "path-hover",
                          "cls-city",
                          citySpecificColorClass
                        )}
                        onMouseEnter={() => handleMouseEnter(cityItem.name)}
                        onMouseLeave={handleMouseLeave}
                      />
                    </animated.g>
                  );
                })}

              </g>


              <circle // . . . . . . .
                // HERE c1Ref 🦀
                id="🦀"
                ref={c1Ref}
                cx={562.684}
                cy={481.65}
                r={12 / currentScale} // Mantenho o tamanho original do elemento sem variar junto com zoom do canvas
                className="fill-lime-950 pointer-events-none"
              // transform={`translate(${crabPos.X}, ${crabPos.Y})`}
              />

              <SVG_MARKER w={32 / currentScale} h={32 / currentScale} x={562.684} y={481.65} qtd = {3} correction={currentScale} />

            </animated.svg>
          </div>

        </div>


        <Card
          //── ⋙── ── REGION_info ── ──➤
          id='REGION_info'// HERE REGION_info
          variant="ghost"
          className={classNames(
            "flex flex-col flex-1 justify-start items-start gap-3 w-full h-full bg-white opacity-95"
          )}
        >

          <Heading weight="bold" size="8" highContrast>
            Escolha uma região ou município para começar!
          </Heading>

          <Separator my='4' color="bronze" size="4" />

          <Blockquote size="8" highContrast>
            {region.name}
          </Blockquote>

          <Blockquote size="8" highContrast>
            {city.name}
          </Blockquote>

        </Card>

      </div>
    </>
  );
};
export default MapMenu;
// ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
