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
  Text
} from "@radix-ui/themes";

import classNames from "classnames";
import { axiosPlain } from "../../utils/axios";
import handleAxiosError from "../../utils/handleAxiosError";
import regionData from "../../assets/BahiaRegiao2.json";
import cityData from "../../assets/BahiaCidades4.json";
import { COLORSTW, COLORSTW_HEX, VARIABLES, YEARS } from "../../assets/auxData";

import { createPortal } from "react-dom";

import { mapStore, BoundingBox, variableStore, yearStore, regionDataStore } from "../../store/mapsStore";

const SCALE_ADJUSTMENT = 0.35

// Tipagem para regiões
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

// Adicione este tipo para o nosso estado de tooltip
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


const MapMenu = () => { // ★ MapMenu  ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
  const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef

  // type levels = 0 | 1;
  // const [currentLevel, setCurrentLevel] = useState<levels>(0);

  // ✳ { variable, setVariable } 
  const { variable, setVariable } = variableStore();

  // ✳ { year, setYear } 
  const { year, setYear } = yearStore();

  // ✳ { region, city, setRegion, setCity, mapTransform, setMapTransform, currentLevel, setCurrentLevel} 
  const { region, setRegion,
    city, setCity,
    mapTransform, setMapTransform,
    currentLevel, setCurrentLevel,
    originalBBox, setOriginalBBox
  } = mapStore();


  // WARN To salvando o estado da minha escala mas n to usando.
  // ✳ [currentScale, setCurrentScale]
  const [currentScale, setCurrentScale] = useState<number>(1);

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

  // const [regionValues, setRegionValues] = useState<{ [key: string]: number }>({});


  useEffect(() => { //HERE uE
    if (svgRef.current && !originalBBox) {
      setOriginalBBox(svgRef.current.getBBox()); // ↺ setOriginalBBox
    }
  }, [originalBBox, setOriginalBBox]);


  // ── ⋙── ── ── ── ── ── ──➤
  // (✪) getRegionValues 
  const getRegionValues = useCallback(async () => {
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
  }, [getRegionValues]);

  //  ── ⋙── ── ── ── ── ── ──➤
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
  }, [regionValues, variable]); // Dependências não mudam

  // ── ⋙── ── ── ── ── ── ── ──➤
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
  });

  // ✪ springStyles
  const [springStyles, api] = useSpring(() => ({
    transform: `scale(1) translate(0px, 0px)`,
    config: { tension: 62, friction: 35, mass: 7 },
  }));


  useEffect(() => { //HERE uE

    api.start({ transform: mapTransform });
  }, [mapTransform, api]);


  // ── ⋙── ── ── ── ── ── ──➤
  const resetMap = () => { // {✪} resetMap
    setCurrentLevel(0); // ↺ setCurrentLevel
    setCurrentScale(1); // ↺ setCurrentScale
    setRegion("bahia", "Bahia"); // ↺ setRegion
    setCity("", ""); // ↺ setCity
    const newTransform = "scale(1) translate(0px, 0px)";
    api.start({
      transform: newTransform,
    });
    setMapTransform(newTransform);
  };


  // ── ⋙── ── ── ── ── ── ── ──➤
  // (✪) runToFit
  const runToFit = (bbox: BoundingBox, rect: BoundingBox) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    // const svgBox = svgRef.current?.getBBox()
    const svgBox = originalBBox;

    if (!svgRect || !svgBox) return;

    const CBX = bbox.x + bbox.width / 2;
    const CBY = bbox.y + bbox.height / 2;

    const SVGCX = svgBox.width / 2;
    const SVGCY = svgBox.height / 2;

    // + 5 is the offset from the edge of the canvas
    const translateX = SVGCX - CBX //+ 5;
    const translateY = SVGCY - CBY //+ 5;

    const scaleX = svgRect.width / rect.width;
    const scaleY = svgRect.height / rect.height;
    const maxScale = Math.min(scaleX, scaleY);

    const finalScale = maxScale - SCALE_ADJUSTMENT;
    setCurrentScale(finalScale);  // ↺ setCurrentScale
    const newTransform = `scale(${finalScale}) translate(${translateX}px, ${translateY}px)`;

    api.start({ transform: newTransform });
    setMapTransform(newTransform); // Salve no store
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
        runToFit(target.getBBox(), target.getBoundingClientRect());
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



  return ( // ── ◯─◡◠◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠◡◠─⫸ 🌑
    <>
      <Flex direction="column">
        <Box  // ── ⋙── ── ── DropDownSelector ── ── ──➤
          id="DropDownComponent"
          className="flex justify-start gap-6 w-full z-50"

        >
          <DropdownMenu.Root
          // ⊙  Variable ↺ setVariable
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
          // ⊙ Year  ↺ setYear
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


        <div // ── ⋙── ── ── canvas-wrapper ── ── ── ──➤
          id="canvas-wrapper"
          className="relative rounded-3xl"
          style={{
            width: "602px",
            height: "640px",
            // border: "1px solid black",
            overflow: "hidden"
          }}>
          {colorScale.legendData && // <○> GradientLegend
            <GradientLegend {...colorScale.legendData} />
          }

          <AnimatedTooltip {...tooltip} />
          <animated.svg //HERE  SVGCanvas // . . . props
            id="SVGCanvas"
            ref={svgRef}
            viewBox="0 0 602 640"
            overflow={"hidden"}
            style={{
              width: "100%",
              height: "100%",
              ...springStyles, // ○ springStyles
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
