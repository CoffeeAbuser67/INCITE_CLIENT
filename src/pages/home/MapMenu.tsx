// HERE MapMenu
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
  useSpringValue,
  useSpringRef,
} from "@react-spring/web";

import {
  Blockquote,
  Box,
  Button,
  Card,
  DropdownMenu,
  Heading,
  Separator,
  Text
} from "@radix-ui/themes";

import classNames from "classnames";
import { useWindowResize } from "../../hooks/useWindowResize";

import { axiosDefault } from "../../services/axios";
import handleAxiosError from "../../utils/handleAxiosError";

import { mapStore, variableStore, yearStore } from "../../store/mapsStore";

import regionCityData from "../../assets/BahiaRegiaoMuni.json";
import regionData from "../../assets/BahiaRegiao.json";

import { COLORSTW, VARIABLES, YEARS } from "../../assets/auxData";

// . . . . . . .
interface City {
  id: string;
  d: string;
  name: string;
}

interface RegionCity {
  [key: string]: City[];
}

// [●] mapRegionCity
const mapRegionCity: RegionCity = regionCityData;
interface Region {
  id: string;
  d: string;
  name: string;
}
// [●] mapRegion
const mapRegion: Region[] = regionData;

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MapMenu = () => { // ★ MapMenu  ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
  const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef
  const c1Ref = useRef<SVGCircleElement | null>(null); // HERE c1Ref
  const originalBBoxRef = useRef<BoundingBox | null>(null); // HERE originalBBoxRef
  // ── ⋙── ── ── ── ── ── ── ──➤

  // ✳ [tooltip, setTooltip]
  const [tooltip, setTooltip] = useState<{ name: string | null }>({
    name: null,
  });
  const handleMouseEnter = (name: string) => {
    setTooltip({ name });
  };
  const handleMouseLeave = () => {
    setTooltip({ name: null });
  };// ── ⋙── ── ── ── ── ── ── ──➤

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

  useEffect(() => {
    //HERE useEffect
    if (svgRef.current && !originalBBoxRef.current) {
      // Assign the value from getBBox to the ref
      originalBBoxRef.current = svgRef.current.getBBox();
      console.log("Original BBox:", originalBBoxRef.current);
    }
  }, []); // . . . . . . .

  useEffect(() => {
    //HERE useEffect
    if (c1Ref.current) {
      const bbox = c1Ref.current.getBBox();
      const rect = c1Ref.current.getBoundingClientRect();
      console.log(" useEffect log");
      // // [LOG] c1Rect
      // console.log("rect ↯");
      // console.log("x:", rect.x);
      // console.log("y:", rect.y);
      // console.log("width:", rect.width);
      // console.log("height:", rect.height);
      // console.log(". . . . . . . . . . . . ");
      // // [LOG] c1Box
      // console.log("c1Box useEffect log ↯");
      // console.log("x:", bbox.x);
      // console.log("y:", bbox.y);
      // console.log("width:", bbox.width);
      // console.log("height:", bbox.height);
      // console.log(". . . . . . . . . . . . ");
      // console.log("currentScale:", currentScale);
      console.log("── ⋙── ── ── ── ── ── ── ──➤");
    }

  }, [crabPos, currentScale]); // . . . . . 

  useEffect(() => {
    //HERE useEffect
    getRegionValues(); // (○) getRegionValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, year, variable,]); // . . . . . 

  useEffect(() => {
    //HERE useEffect
    getBahiaValues(); // (○) getBahiaValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, variable]); // ── ⋙── ── ── ── ── ── ──➤

  const getBahiaValues = async () => { // (✪) getBahiaValues 
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

  } // ── ⋙── ── ── ── ── ── ── ──➤

  const getRegionValues = async () => { // (✪) getRegionValues 
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

  } // ── ⋙── ── ── ── ── ── ── ──➤

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
  })); // ── ⋙── ── ── ── ── ── ──➤

  // {✪} getThermometerColor
  function getThermometerColor(name_id: string, data: regionValuesI[], colors: string[]): string | undefined {
    const totals = data.map(d => d.total);
    const min = Math.min(...totals);
    const max = Math.max(...totals);

    const logMin = Math.log10(min + 1);
    const logMax = Math.log10(max + 1);

    const item = data.find(d => d.name_id === name_id);

    // console.log('item:', item); // [LOG] item

    if (!item) return undefined;

    const logValue = Math.log10(item.total + 1);
    const index = Math.floor(((logValue - logMin) / (logMax - logMin)) * (colors.length - 1));

    return colors[Math.min(index, colors.length - 1)];
  } // ── ⋙── ── ── ── ── ── ──➤

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
    setCurrentScale(maxScale - 0.35); // ↺ setCurrentScale
    // (maxScale - 0.3) -0.3 is an adjustment on the scale.

    // // [LOG] rect
    // console.log("target rect ↯");
    // console.log("x:", rect.x);
    // console.log("y:", rect.y);
    // console.log("width:", rect.width);
    // console.log("height:", rect.height);
    // console.log(". . . . . . . . . . . . ");

    // // [LOG] bbox
    // console.log("target bbox ↯");
    // console.log("x:", bbox.x);
    // console.log("y:", bbox.y);
    // console.log("width:", bbox.width);
    // console.log("height:", bbox.height);
    // console.log("✦────────────────────────────➤");

    api.start({
      transform: `scale(${maxScale - 0.35
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
  const memoizedRegions = useMemo(() => (
    mapRegion.map((el, i) => (
      <g key={i} className={`cls-region ${getThermometerColor(el.id, bahiaValues, COLORSTW[variable])}`}>
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
    ))
  ), [mapRegion, bahiaValues, variable, year]);

  return (
    // ── ⋙── DOM ── ── ── ── ── ── ── ── ──⫸ 🌠
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

          <div
            //_PIN_ ⋙── ── canvas-wrapper ── ──➤
            id="canvas-wrapper"
            className="relative bg-transparent rounded-3xl"
            style={{
              width: "715px",
              height: "760px",
              overflow: "hidden",
              // border: "1px solid black",
            }}
          >

            <div
              id="TOOLTIP" // HERE TOOLTIP
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

            <div
              id='thermometerLegend' // HERE TOOLthermometerLegend
              className="absolute w-10 h-48 bg-gradient-to-b from-neutral-50 to-neutral-950 rounded-lg shadow-md"
              style={{
                bottom: "0.5rem",  // Um pequeno espaçamento da borda superior
                right: "0.5rem", // Um pequeno espaçamento da borda direita
                pointerEvents: "none",
                zIndex: 10,
              }}
            ></div>

            <animated.svg
              // . . . ⋙── SVGCanvas ──➤
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

                {/* // [○] memoizedRegions */}
                {memoizedRegions}

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

                {transition((style, item) => (
                  // . . . . . . .
                  // ○ transition
                  // [○] mapRegionCity ⊛
                  <animated.g {...style}>
                    <title >{item.name}</title>
                    <animated.path
                      id={item.id}
                      d={item.d}
                      data-name={item.name}
                      data-type="city"
                      className={classNames(
                        "path-hover cls-city",
                        city.active === item.id ? "fill-emerald-600" : getThermometerColor(item.id, regionValues, COLORSTW[variable])
                      )}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    />
                  </animated.g>
                ))}
              </g>

              <circle // . . . . . . .
                // HERE c1Ref 🦀
                id = "🦀" 
                ref={c1Ref}
                cx={30}
                cy={30}
                r={12}
                className="fill-lime-950"
                transform={`translate(${crabPos.X}, ${crabPos.Y})`}
              />
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
