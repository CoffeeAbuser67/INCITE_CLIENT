// HERE INCITE
import classNames from "classnames";
import BG from "../../assets/bg_main2.png";

import {
    Box,
    Card,
    Flex,
    Heading,
    Text

} from "@radix-ui/themes";
import { animated, useSpring, useTransition } from "react-spring";
import { useRef, useState, useEffect, useMemo } from "react"; // <--- adicione useEffect
import regionData from "../../assets/BahiaRegiao2.json";
import cityData from "../../assets/BahiaCidades4.json";
import { mapStore } from "../../store/mapsStore";


// . . . . . . .

const SCALE_ADJUSTMENT = 0.35

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

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

// Estrutura de dados que mapeia regiões para um array de cidades
interface CityData {
    [regionId: string]: City[];
}


interface Marker {
    id: string;
    name: string;
    x: number;
    y: number;
}


// [●] mapCity
const mapCity: CityData = cityData;

// [●] mapRegion
const mapRegion: Region[] = regionData;


const Incite = () => { // ★ Incite ⋙─────────────────────────────────────────➤ 

    const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef

    const originalBBoxRef = useRef<BoundingBox | null>(null); // HERE originalBBoxRef


    // ── ⋙── ── ── ── ── ── ──➤
    type levels = 0 | 1;
    // ✳ [currentLevel, setCurrentLevel]
    const [currentLevel, setCurrentLevel] = useState<levels>(0);

    // WARN  EU estou usando esse estado pra nada ??? wut 
    // ✳ [currentScale, setCurrentScale]
    const [currentScale, setCurrentScale] = useState<number>(1);

    // ✳ { region, city, setRegion, setCity } 
    const { region, setRegion } = mapStore();

    // ✳ [markers, setMarkers]
    const [markers, setMarkers] = useState<Marker[]>([]);

    // ✳ [selectedMarker, setSelectedMarker]
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

    // ── ⋙── ── ── ── ── ── ──➤


    useEffect(() => { //HERE uE
        if (svgRef.current && !originalBBoxRef.current) {
            // Assign the value from getBBox to the ref
            originalBBoxRef.current = svgRef.current.getBBox();
            console.log("Original BBox:", originalBBoxRef.current);
        }
    }, []); // . . . . . . .


    // (●) allCities
    const allCities = useMemo(() => {
        return Object.values(mapCity).flat();
    }, []);  // ── ⋙── ── ── ── ── ── ── ──➤


    // (✪) handleAddMarker
    const handleAddMarker = (cityId: string) => {
        if (!cityId) return; // Não fazer nada se a opção default for selecionada

        // Verificar se um marcador para esta cidade já existe
        const markerExists = markers.some(marker => marker.id === cityId);
        if (markerExists) {
            alert("Já existe um marcador para este município!");
            return;
        }


        // Encontrar os dados completos da cidade selecionada
        const cityToAdd = allCities.find(city => city.id === cityId);


        if (cityToAdd) {
            const newMarker: Marker = {
                id: cityToAdd.id,
                name: cityToAdd.name,
                x: cityToAdd.x,
                y: cityToAdd.y
            };

            // Adicionar o novo marcador ao estado
            setMarkers(prevMarkers => [...prevMarkers, newMarker]); // ↺ setMarkers
            console.log("Marcador adicionado:", newMarker);

        }
    }; // ── ⋙── ── ── ── ── ── ── ──➤


    // ✪ bahiaStrokeStyle
    const bahiaStrokeStyle = useSpring({
        opacity: currentLevel === 1 ? 0 : 1,
        config: { duration: 300 } // Ajuste a duração conforme necessário
    });


    // ✪ transition
    const transition = useTransition(mapCity[region.active] || [], {
        trail: 600 / mapCity[region.active].length || 1,
        from: { opacity: 0, transform: "scale(0)" },
        enter: { opacity: 1, transform: "scale(1)" },
        leave: { opacity: 0, transform: "scale(0)" },
        config: { mass: 10, tension: 63, friction: 16, clamp: true },
        keys: (mapCity[region.active] || []).map((el) => el.id),
    });


    // ✪ springStyles
    const [springStyles, api] = useSpring(() => ({
        transform: `scale(1) translate(0px, 0px)`,
        config: { tension: 62, friction: 35, mass: 7 },
    })); // ── ⋙── ── ── ── ── ── ──➤



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

        // + 5 is the offset from the edge of the canvas
        const translateX = SVGCX - CBX //+ 5;
        const translateY = SVGCY - CBY //+ 5;

        const scaleX = svgRect.width / rect.width;
        const scaleY = svgRect.height / rect.height;
        const maxScale = Math.min(scaleX, scaleY);

        setCurrentScale(maxScale - SCALE_ADJUSTMENT); // ↺ setCurrentScale

        api.start({
            transform: `scale(${maxScale - SCALE_ADJUSTMENT
                }) translate(${translateX}px, ${translateY}px)`,
        });
    }; // ── ⋙── ── ── ── ── ── ──➤

    // <✪> handleClick
    const handleClick = (event: React.MouseEvent<SVGElement>) => {
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
                console.log("Cidade clicada:", target_id, "↯");
                // Aqui você pode adicionar lógica futura para o clique na cidade,
                // como exibir dados específicos dela.
            } else {
                // Se clicar em qualquer outra coisa que não seja uma cidade no nível 1
                // (como o fundo ou a própria região), o mapa reseta.
                resetMap();
            }
        }
    }  // ── ⋙── ── ── ── ── ── ── ──➤


    // (●) cityToRegionMap
    const cityToRegionMap = useMemo(() => {
        const map: { [cityId: string]: string } = {};
        // Itera sobre cada entrada de região em cityData (ex: ['bacia_do_jacuipe', [cidades...]])
        for (const [regionId, citiesInRegion] of Object.entries(mapCity)) {
            // Itera sobre cada cidade dentro da região
            for (const city of citiesInRegion) {
                // Cria a entrada no mapa: { id_da_cidade: id_da_regiao }
                map[city.id] = regionId;
            }
        }
        return map;
    }, []); // . . . . . . .



    // <✪> handleMarkerClick
    const handleMarkerClick = (marker: Marker) => {
        console.log("Marcador clicado:", marker.name);

        const regionId = cityToRegionMap[marker.id]; // (○) cityToRegionMap
        if (!regionId) {
            console.error("Não foi possível encontrar a região para o marcador:", marker.id);
            return;
        }

        const regionObject = mapRegion.find(r => r.id === regionId);
        if (!regionObject) {
            console.error("Dados da região não encontrados:", regionId);
            return;
        }

        const regionElement = svgRef.current?.querySelector(`#${regionId}`) as SVGPathElement;
        if (!regionElement) {
            console.error("Elemento SVG da região não encontrado no DOM:", regionId);
            return;
        }

        setSelectedMarker(marker); // ↺ setSelectedMarker
        setCurrentLevel(1); // ↺ setCurrentLevel
        setRegion(regionId, regionObject.name); // ↺ setRegion
        runToFit(regionElement.getBBox(), regionElement.getBoundingClientRect()); // <○> runToFit
    };// ── ⋙── ── ── ── ── ── ── ──➤



    // {✪} resetMap
    const resetMap = () => {
        setSelectedMarker(null); // ↺ setSelectedMarker
        setCurrentLevel(0); // ↺ setCurrentLevel
        setCurrentScale(1); // ↺ setCurrentScale
        setRegion("bahia", "Bahia"); // ↺ setRegion
        api.start({
            transform: "scale(1) translate(0px, 0px)",
        });
    };


    return (// ── ⋙⇌⇌⇌⇌⇌⇌⇌ DOM ⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸
        <>
            <Box // CANVAS ── ── ── ──➤
                id="CANVAS"
                className={classNames(
                    "flex h-[600px] flex-col gap-6 ",
                    "mt-40 mx-14 p-4",

                )}
            >

                <Box // ──  PANEL1
                    id="PANEL1"
                    className="flex w-full">

                    <Box // HERE TEXT_HEADER
                        id="TEXT_HEADER"
                        className="flex flex-col gap-8 pt-10 h-[600px] w-full text-left text ">

                        <Heading color="gray" size="6">
                            Instituto de Ciência, Inovação e Tecnologia do Estado da Bahia
                        </Heading>

                        <Heading size="9">
                            Incite - <span className="text-green-900">Agricultura Familiar</span> Diversificada e Sustentável
                        </Heading>

                        <Text className="pt-10">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </Text>

                    </Box>

                    <Box // HERE LOGO_HEADER
                        id="LOGO_HEADER"
                        className="flex h-[600px] w-full justify-center  "
                        style={{
                            backgroundImage: `url(${BG})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <svg>
                            <circle r={100} cx="50%" cy="50%" fill="#FFEB3B" />
                        </svg>

                    </Box>
                </Box>

                <Box //── PANEL2
                    id="PANEL2"
                    className={classNames(
                        "flex w-full gap-6 justify-around",
                    )}
                >

                    <div className="flex flex-col">

                        <Box // HERE MARKER MANAGER BOX

                            className="flex items-center gap-4 mb-4 p-4 bg-gray-100 rounded-lg">

                            <Text weight="bold">Adicionar Marcador:</Text>
                            <select
                                onChange={(e) => handleAddMarker(e.target.value)}
                                className="p-2 border rounded-md"
                                defaultValue=""
                            >
                                <option value="" disabled>Selecione um município...</option>
                                {allCities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>

                            <Text size="1" color="gray">
                                {markers.length} marcador(es) adicionado(s)
                            </Text>

                        </Box>

                        <div // ⋙── ── canvas-wrapper ── ──➤
                            id="canvas-wrapper"
                            className="relative bg-transparent  rounded-3xl"
                            style={{
                                width: "602px",
                                height: "640px",
                                overflow: "hidden",
                                // border: "1px solid black",
                            }}>


                            <animated.svg //HERE  SVGCanvas
                                id="SVGCanvas"
                                ref={svgRef}
                                viewBox="0 0 602 640"
                                overflow={"visible"}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    ...springStyles, // ○ springStyles
                                }}
                                onClick={handleClick} // (○) handleClick
                            >

                                <g>
                                    <defs>
                                        <style>
                                            {
                                                ".cls-1{fill:#f4f4f4;stroke:#a5a5a5}"
                                            }
                                            {
                                                ".cls-1, .cls-2{stroke-linecap:round;stroke-linejoin:round}"
                                            }
                                            {
                                                ".cls-2{fill:none;stroke:#000;stroke-width:2px}"
                                            }
                                        </style>
                                    </defs>


                                    { // [○] mapRegion
                                        mapRegion.map((el, i) => {
                                            const class_style = el.id === "bahia_stroke" ? "cls-2" : "cls-1 path-hover2"

                                            const strokeSpecificStyle = el.id === "bahia_stroke" ? bahiaStrokeStyle : {};

                                            return (
                                                <g key={i}>
                                                    <title>{el.name}</title>
                                                    <animated.path
                                                        id={el.id}
                                                        d={el.d}
                                                        data-name={el.name}
                                                        data-type="region"
                                                        className={class_style}
                                                        style={strokeSpecificStyle} // ○ bahiaStrokeStyle

                                                    />
                                                </g>
                                            )
                                        })
                                    }


                                    {currentLevel === 1 && ( // ⊙ currentLevel
                                        <rect
                                            opacity={0.95}
                                            x={-2000}
                                            y={-2000}
                                            width="4000"
                                            height="4000"
                                            fill="white"
                                            onClick={(e) => { // Permitir clique no overlay para resetar o mapa
                                                e.stopPropagation(); // Evitar que o clique propague para o SVGCanvas
                                                resetMap();
                                            }}
                                        />
                                    )}


                                    {transition((style, cityItem) => { // ○ transition

                                        return (
                                            <animated.g {...style}>
                                                <title>{cityItem.name}</title>
                                                <animated.path
                                                    id={cityItem.id}
                                                    d={cityItem.d}
                                                    data-name={cityItem.name}
                                                    data-type="city"
                                                    className={classNames(
                                                        "path-hover2",
                                                        "cls-1",
                                                    )}

                                                />
                                            </animated.g>
                                        );
                                    })}


                                    {markers.map(marker => ( // ⊙ markers
                                        <g
                                            key={`marker-${marker.id}`}
                                            transform={`translate(${marker.x}, ${marker.y})`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Impede que o clique "vaze" para o SVG e chame o handleClick geral
                                                handleMarkerClick(marker);
                                            }}
                                            style={{ cursor: 'pointer' }} // Muda o cursor para indicar que é clicável
                                        >
                                            <title>Ver região de: {marker.name}</title>
                                            <circle
                                                r={3 / currentScale}
                                                fill="rgba(255, 0, 0, 0.7)"
                                                stroke="white"
                                                strokeWidth={0.5 / currentScale}
                                            />
                                        </g>
                                    ))}

                                </g>

                            </animated.svg>

                        </div>



                    </div>


                    <Card
                        // HERE info-panel
                        id="info-panel"
                        variant="ghost"
                        className="w-5/12 p-10 rounded-lg bg-gray-50">

                        {selectedMarker && ( // ⊙ selectedMarker
                            <>
                                <Heading size="5">{selectedMarker.name}</Heading>
                                <Text as="p" className="my-4">
                                    Aqui vai o parágrafo com as informações detalhadas sobre a agricultura familiar em {selectedMarker.name}.
                                </Text>
                                <a href={`/dados/${selectedMarker.id}`} target="_blank" rel="noopener noreferrer">
                                    <button className="p-2 bg-green-600 text-white rounded">
                                        Ver Dados Completos
                                    </button>
                                </a>
                            </>
                        )}

                    </Card>

                </Box>

            </Box>

        </>
    );
};  // ★ Incite ⋙─────────────────────────────────────────➤ 
export default Incite;


