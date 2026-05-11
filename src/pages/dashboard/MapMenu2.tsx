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
  Box,
  Button,
  DropdownMenu,
  Flex,
  Separator,
  Text
} from "@radix-ui/themes";

import classNames from "classnames";
import { axiosPlain } from "../../utils/axios";
import handleAxiosError from "../../utils/handleAxiosError";
import regionData from "../../assets/BahiaRegiao2.json";
import cityData from "../../assets/BahiaCidades4.json";
import { COLORSTW, COLORSTW_HEX, VARIABLES } from "../../assets/auxData";
import { createPortal } from "react-dom";
import { mapStore, BoundingBox, variableStore, yearStore, regionDataStore } from "../../store/mapsStore";


interface Region {
  id: string;
  d: string;
  name: string;
}
// Tipagem para cidades
interface City {
  id: string;
  d: string;
  name: string;
  x: number;
  y: number;
}

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

interface GradientLegendProps {
  min: number;
  max: number;
  variable: string;
}

interface CityData {
  [regionId: string]: City[];
}

// [●] mapCity
const mapCity: CityData = cityData;

// [●] mapRegion
const mapRegion: Region[] = regionData;

const MapMenu = () => { // ★ MapMenu ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
  const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef
  const originalBBox = useRef<BoundingBox | null>(null); // HERE originalBBoxRef

  // type levels = 0 | 1;
  // const [currentLevel, setCurrentLevel] = useState<levels>(0);
  // ✳ { variable, setVariable } 
  const { variable, setVariable } = variableStore();

  // ✳ { year, setYear } 
  const { availableYears, year, setYear } = yearStore();

  // ✳ { region, city, setRegion, setCity, currentLevel, setCurrentLevel} 
  const {
    region, setRegion,
    city, setCity,
    currentLevel, setCurrentLevel,
  } = mapStore();

  // ✳ [tooltip, setTooltip] 
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // ✳ {regionValues, setRegionVales}
  const { regionValues, setRegionValues } = regionDataStore();
  // . . .

  const initialViewBox = useMemo(() => {
    const bbox = originalBBox.current;
    if (bbox) {
      return [bbox.x, bbox.y, bbox.width, bbox.height];
    }
    return [0, 0, 602, 640];
  }, []);


  const [{ viewBox }, api] = useSpring(() => ({
    viewBox: initialViewBox,
    config: { tension: 62, friction: 35, mass: 7 },
  }));

  useEffect(() => {
    api.set({ viewBox: initialViewBox });
  }, [initialViewBox, api]);


  // ── ⋙── ── ── ── ── ── ──➤
  // (✪) getRegionValues
  const getRegionValues = useCallback(async () => {

    // Guard clause: Prevent API call if the year hasn't been fetched from backend yet
    if (!year) return;

    const axios = axiosPlain;
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

      console.log("── ⋙⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸");
      console.log("params:", params); // [LOG] 
      console.log("── ⋙⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸");
      console.log('%c ── ◯─◠◡◠◡◠◡◠◡◠◡◠◡◠◡─➤ 🌑', 'color: purple; font-size: 16px; font-weight: bold;');
      console.log("/getRegionValues:", data); // [LOG] 
      console.log('%c ── ◯─◡◠◡◠◡◠◡◠◡◠◡◠◡◠─➤ 🌑', 'color: purple; font-size: 16px; font-weight: bold;');

      setRegionValues(data) // ↺ setRegionValues

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }

  }, [region.active, year, variable]) // . . .


  useEffect(() => { // (●) uE
    getRegionValues(); // (○) getRegionValues
  }, [getRegionValues]);   // ── ⋙── ── ── ── ── ── ──➤


  // (✪) colorScale 
  const colorScale = useMemo(() => {
    const activeRegionKey = region.active;

    const values = Object.entries(regionValues)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, _]) => key !== activeRegionKey) // 1. Filtra os pares, mantendo apenas aqueles cuja chave NÃO é a ativa.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, value]) => value);                     // 2. Do resultado filtrado, extrai apenas o valor de cada par.

    console.log('%c values 🩸', 'color: red; font-size: 16px; font-weight: bold;');
    console.log(values)

    // CASO 1: Não há dados ou os dados ainda não carregaram.
    if (values.length === 0) {
      return {
        // Retorna uma função padrão
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getColor: (_id: string) => "fill-gray-200",
        // E dados nulos para a legenda, para que ela não seja renderizada
        legendData: null
      };
    }

    // A lógica para encontrar min, max e a paleta continua a mesma
    const colorPalette = COLORSTW[variable as keyof typeof COLORSTW] || COLORSTW.valor_da_producao;
    const numColors = colorPalette.length;
    const minVal = Math.max(Math.min(...values), 1);
    const maxVal = Math.max(...values);

    // CASO 2: Todos os valores são iguais.
    if (minVal === maxVal) {
      return {

        // A função getColor retorna a cor do meio da paleta
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getColor: (_id: string) => colorPalette[Math.floor(numColors / 2)],
        // E os dados da legenda são populados normalmente
        legendData: {
          min: minVal,
          max: maxVal,
          variable: variable
        }
      };
    }

    // CASO 3: O caso principal, com uma escala de valores.
    const logMin = Math.log(minVal);
    const logMax = Math.log(maxVal);
    const scale = (logMax - logMin) / (numColors - 1);

    return {
      // 1. A função que a cor de um item
      getColor: (itemId: string): string => {
        const value = regionValues[itemId];
        if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
          return "fill-gray-200";
        }
        if (value === maxVal) {
          return colorPalette[numColors - 1];
        }
        const logValue = Math.log(value);
        const index = Math.floor((logValue - logMin) / scale);
        return colorPalette[index];
      },
      // 2. Os dados para a legenda
      legendData: {
        min: minVal,
        max: maxVal,
        variable: variable
      }
    };
  }, [regionValues, variable]); // ── ⋙── ── ── ── ── ── ── ──➤


  const transition = useTransition(mapCity[region.active] || [], {   // [✪] transition mapCity
    trail: 600 / mapCity[region.active].length || 1,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    config: { mass: 10, tension: 63, friction: 16, clamp: true },
    keys: (mapCity[region.active] || []).map((el) => el.id),
  });


  // ✪ bahiaStrokeStyle
  const bahiaStrokeStyle = useSpring({
    opacity: currentLevel === 1 ? 0 : 1,
    config: { duration: 300 } // Ajuste a duração conforme necessário
  });// ── ⋙── ── ── ── ── ── ──➤



  const resetMap = () => { // {✪} resetMap
    setCurrentLevel(0); // ↺ setCurrentLevel
    setRegion("bahia", "Bahia"); // ↺ setRegion
    setCity("", ""); // ↺ setCity
    api.start({ viewBox: initialViewBox });
  };

  // ── ⋙── ── ── ── ── ── ── ──➤

  // (✪) runToFit
  const runToFit = (bbox: BoundingBox) => {
    const padding = 30; // Ajuste para mais ou menos "respiro"
    const newWidth = bbox.width + padding * 2;
    const newHeight = bbox.height + padding * 2;
    const newMinX = bbox.x - padding;
    const newMinY = bbox.y - padding;
    originalBBox.current = { x: newMinX, y: newMinY, width: newWidth, height: newHeight };
    api.start({ viewBox: [newMinX, newMinY, newWidth, newHeight] });
  };


  // ── ⋙── ── ── ── ── ── ──➤
  const handleClick = (event: React.MouseEvent<SVGElement>) => { // (✪) handleClick
    const target = event.target as SVGPathElement;
    const target_id = target?.id;
    const target_type = target?.getAttribute("data-type");
    const target_name = target?.getAttribute("data-name");

    // ⊙ currentLevel 0
    if (currentLevel === 0) {
      // Verifica se o clique foi em uma região e não no contorno geral
      if (target_type === "region" && target_id !== "bahia_stroke") {
        setCurrentLevel(1);
        setRegion(target_id, target_name || "");
        runToFit(target.getBBox());
      }
    }

    // [LOG] target
    // console.log("target:", target);
    console.log("target id:", target_id);
    console.log("target type:", target_type);
    console.log("level:", currentLevel);
    console.log("✦────────────────────────────➤");

    // . . .
    // ⊙ currentLevel 1
    if (currentLevel === 1) {
      if (target_type === "city") {
        console.log("Cidade clicada:", target_id,); // [LOG] 
        setCity(target_id, target_name || "") // ↺ setCity
      } else {
        // Se clicar em qualquer outra coisa que não seja uma cidade no nível 1
        // (como o fundo ou a própria região), o mapa reseta.
        resetMap(); // {○} resetMap
      }
    }
  }

  // ── ⋙── ── ── ── ToolTip  ── ── ── ──➤
  // <✪> AnimatedTooltip
  const AnimatedTooltip = ({ visible, content, x, y }: TooltipState) => {
    const springProps = useSpring({
      opacity: visible ? 1 : 0,
      transform: visible ? `translate3d(0,0,0)` : `translate3d(0,10px,0)`,
      config: { tension: 300, friction: 20 },
    });

    return createPortal(

      <animated.div
        style={{
          position: 'absolute',
          top: y,
          left: x,
          pointerEvents: 'none',
          zIndex: 1000,
          ...springProps,
        }}
        className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg"
      >
        {content}
      </animated.div>,

      document.body // O destino do portal
    )
  };

  const handleMouseEnterPath = (event: React.MouseEvent<SVGPathElement>) => {   // <●> handleMouseEnterPath
    const content = event.currentTarget.getAttribute("data-name");
    if (content) {
      setTooltip(prev => ({ ...prev, visible: true, content }));
    }
  };


  const handleMouseMoveSVG = (event: React.MouseEvent<SVGSVGElement>) => { // <●> handleMouseMoveSVG
    const x = event.pageX + 12; // Usamos pageX
    const y = event.pageY + 12; // Usamos pageY
    setTooltip(prev => ({ ...prev, x, y }));
  };

  const handleMouseLeaveSVG = () => {   // <●> handleMouseLeaveSVG
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // ── ⋙── ── ── ── ── ── ── ──➤
  const GradientLegend = ({ min, max, variable }: GradientLegendProps) => { // <✪> GradientLegend
    // Pega as cores 'from' e 'to' do nosso novo objeto de cores HEX
    const colors = COLORSTW_HEX[variable as keyof typeof COLORSTW_HEX];

    // Cria o estilo do gradiente dinamicamente
    const gradientStyle = {
      backgroundImage: `linear-gradient(to top, ${colors.from}, ${colors.to})`,
    };

    // const formatNumber = (num: number) => {
    //   return new Intl.NumberFormat('pt-BR', {
    //     notation: 'compact',
    //     maximumFractionDigits: 1
    //   }).format(num);
    // };

    const formatNumber = (value: number) => {
      if (variable === 'valor_da_producao') {
        const finalValue = value * 1000;
        return new Intl.NumberFormat('pt-BR', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(finalValue);
      }

      if (
        variable === 'area_plantada_ou_destinada_a_colheita' ||
        variable === 'area_colhida'
      ) {
        return new Intl.NumberFormat('pt-BR', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(value);
      }

      return new Intl.NumberFormat('pt-BR').format(value);
    };

    return (
      <div
        className="absolute w-12 h-48 flex flex-col justify-between p-2 text-white text-xs"
        style={{
          bottom: "1rem",
          right: "1rem",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <Text as="div" weight="bold">{formatNumber(max)}</Text>
        {/* Div interna para o gradiente */}
        <div className="absolute top-0 left-0 w-full h-full rounded-lg -z-10" style={gradientStyle}></div>
        <Text as="div" weight="bold">{formatNumber(min)}</Text>
      </div>
    );
  };

  return ( // ── ◯─◡◠◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠◡◠◡◠─⫸ 🌑
    <>
      <Flex className = "items-center" direction="column">

        <Box id="ParameterCard"
          className={classNames(
            "w-full flex-1 lg:flex-1 rounded-xl m-2 mb-8 p-4 max-h-[200px] lg:h-auto",
            'bg-black/10 backdrop-blur-xl  shadow-lg' // glassmorphismClass
          )}
        >

          <Flex direction="column" justify="center" height="100%">

            {/* Dashboard Title and Description */}
            <Text as="div" size="5" weight="bold" mb="1">
              Panorama Agrícola Baiano
            </Text>
            <Text as="p" size="2" color="gray">
              Painel analítico de culturas temporárias e permanentes baseado nos dados oficiais do IBGE. Explore métricas de produção, área colhida e rendimento médio, navegando pelas Regiões de Identidade ou municípios do estado da Bahia.
            </Text>

            <Separator my="2" size="4" />

            <Box  // ── ⋙── ── ── DropDownSelector ── ── ──➤
              id="DropDownComponent"
              className="flex justify-start gap-6 w-full z-50"
            >

              <DropdownMenu.Root
              // ⊙  Variable ↺ setVariable
              >
                <DropdownMenu.Trigger>
                  <Button size="1" variant="soft" highContrast>
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
              // ⊙ Year  ↺ setYear
              >
                <DropdownMenu.Trigger>
                  <Button size="1" color="gray" variant="soft" highContrast>
                    {year ?? "Ano"}
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content color="gray" variant="soft" highContrast>
                  {availableYears.map((y, i) => (
                    <DropdownMenu.Item key={i} onSelect={() => setYear(y)}>{y}</DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>

            </Box >


          </Flex>

        </Box>




        <div // ── ⋙── ── ── canvas-wrapper ── ── ── ──➤
          id="canvas-wrapper"
          className="
            relative rounded-3xl overflow-hidden
            w-full aspect-square
            md:w-[602px] md:h-[640px] md:aspect-auto
          "
        >

          {colorScale.legendData && // <○> GradientLegend
            <GradientLegend {...colorScale.legendData} />
          }
          <AnimatedTooltip {...tooltip} />
          <animated.svg //HERE  SVGCanvas // . . . props
            id="SVGCanvas"
            ref={svgRef}
            viewBox={viewBox.to((...v) => v.join(" "))}
            overflow={"hidden"}
            style={{
              width: "100%",
              height: "100%",
              cursor: 'pointer',
            }}
            onClick={handleClick} // (○) handleClick // . . . children
            onMouseMove={handleMouseMoveSVG}
            onMouseLeave={handleMouseLeaveSVG}
          >

            <g >
              <defs>
                <style>
                  {
                    ".cls-22{fill:none;stroke:#000;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}"
                  }
                </style>
              </defs>

              {  // [○] mapRegion
                mapRegion.map((el, i) => {
                  // Ignoramos o contorno do estado, ele não deve ser colorido

                  if (el.id === "bahia_stroke") {
                    return (
                      <g key={i}>
                        <animated.path
                          id={el.id}
                          d={el.d}
                          data-name={el.name}
                          data-type="region"
                          className="cls-22" // Classe apenas para o contorno
                          style={bahiaStrokeStyle}
                          onMouseEnter={handleMouseEnterPath}
                        />
                      </g>
                    );
                  }

                  // Obtém a classe de cor dinâmica para a região atual
                  const fillColorClass = colorScale.getColor(el.id);

                  return (
                    <g key={i}>
                      <animated.path
                        id={el.id}
                        d={el.d}
                        data-name={el.name}
                        data-type="region"
                        onMouseEnter={handleMouseEnterPath}
                        // Combina as classes: a de cor dinâmica e as de estilo/hover
                        className={classNames(
                          fillColorClass, // cor dinâmica! ex: "fill-neutral-500"
                          "stroke-black", // Usando stroke direto se 'cls-11' for removida
                          "path-hover2"
                        )}
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                      />
                    </g>
                  );
                })
              } //. . .
              {currentLevel === 1 && ( // ⊙ currentLevel
                <rect
                  opacity={0.98}
                  x={-2000}
                  y={-2000}
                  width="4000"
                  height="4000"
                  fill={"white"}
                  onClick={(e) => { // Permitir clique no overlay para resetar o mapa
                    e.stopPropagation(); // Evitar que o clique propague para o SVGCanvas
                    resetMap();
                  }}
                />
              )}

              {transition((style, cityItem) => { // [○] transition mapCity

                const isActive = city.active === cityItem.id;

                const finalFillColor = isActive
                  ? 'fill-yellow-400'
                  : colorScale.getColor(cityItem.id);

                return (
                  <animated.g {...style}>
                    <animated.path
                      id={cityItem.id}
                      d={cityItem.d}
                      data-name={cityItem.name}
                      data-type="city"
                      className={classNames(
                        finalFillColor,
                        "path-hover2",
                        "stroke-black",
                      )}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                      onMouseEnter={handleMouseEnterPath}

                    />
                  </animated.g>
                );
              })} //. . .

            </g>
          </animated.svg>
        </div>

      </Flex>

    </>
  );

};
export default MapMenu;
// ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
