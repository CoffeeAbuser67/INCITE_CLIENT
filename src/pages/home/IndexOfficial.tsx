// HERE INCITE
import classNames from "classnames";
import BG from "../../assets/bg_main2.png";

import {
    Box,
    Button,
    Card,
    Heading,
    Text,
} from "@radix-ui/themes";
import { animated, useSpring, useTransition } from "react-spring";
import { useRef, useState, useEffect, useMemo } from "react"; // <--- adicione useEffect
import regionData from "../../assets/BahiaRegiao2.json";
import cityData from "../../assets/BahiaCidades4.json";
import { mapStore } from "../../store/mapsStore";
import { axiosPlain } from "../../utils/axios";
import { AnimatedLogoMarker } from './AnimatedLogoMarker';

import { Link } from 'react-router-dom';


// . . . . . . .
// 🧿

const SCALE_ADJUSTMENT = 0.35


interface Instituicao {
    id: number;
    nome: string;
    cidade_id_mapa: string;
    offset_x: number; // <-- Adicionado
    offset_y: number; // <-- Adicionado
    marcador_logo: string | null
}


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


// interface Marker {
//     id: string;
//     name: string;
//     x: number;
//     y: number;
// }


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


    // const [markers, setMarkers] = useState<Marker[]>([]);

    // ✳  [selectedInstituicao, setSelectedInstituicao]
    const [selectedInstituicao, setSelectedInstituicao] = useState<Instituicao | null>(null);

    // ✳  [instituicoes, setInstituicoes]
    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);

    // ── ⋙── ── ── ── ── ── ──➤


    useEffect(() => { //HERE uE
        // Cache da BBox 
        if (svgRef.current && !originalBBoxRef.current) {
            originalBBoxRef.current = svgRef.current.getBBox();
        }

        const fetchInstituicoes = async () => {
            try {
                const response = await axiosPlain.get('/map-markers/');
                setInstituicoes(response.data);
                console.log("Instituições carregadas na API:", response.data);
            } catch (error) {
                console.error("Falha ao buscar instituições:", error);
            }
        };

        fetchInstituicoes();
    }, []);


    // (●) cityToRegionMap
    const cityToRegionMap = useMemo(() => {
        const map: { [cityId: string]: string } = {};
        for (const [regionId, citiesInRegion] of Object.entries(mapCity)) {
            for (const city of citiesInRegion) {
                map[city.id] = regionId;
            }
        }
        return map;
    }, []);



    // (✪) handleMarkerClick
    const handleMarkerClick = (instituicao: Instituicao) => {
        console.log("Marcador clicado:", instituicao.nome);

        // 1. Mostra as informações da instituição no painel lateral
        setSelectedInstituicao(instituicao);

        // 2. Encontra o ID da região a que esta cidade/instituição pertence
        const regionId = cityToRegionMap[instituicao.cidade_id_mapa];
        if (!regionId) {
            console.error("Não foi possível encontrar a região para o marcador:", instituicao.cidade_id_mapa);
            return;
        }

        // 3. Encontra os dados da região (como o nome)
        const regionObject = mapRegion.find(r => r.id === regionId);
        if (!regionObject) {
            console.error("Dados da região não encontrados:", regionId);
            return;
        }

        // 4. Encontra o elemento SVG da região no DOM usando seu ID
        const regionElement = svgRef.current?.querySelector(`#${regionId}`) as SVGPathElement;
        if (!regionElement) {
            console.error("Elemento SVG da região não encontrado no DOM:", regionId);
            return;
        }

        // 5. Executa a mágica!
        setCurrentLevel(1);
        setRegion(regionId, regionObject.name);
        runToFit(regionElement.getBBox(), regionElement.getBoundingClientRect());
    }; // ── ⋙── ── ── ── ── ── ── ──➤

    // (●) mapaDeCoordenadas
    const mapaDeCoordenadas = useMemo(() => {
        const mapa = new Map<string, { x: number, y: number }>();
        for (const citiesInRegion of Object.values(mapCity)) {
            for (const city of citiesInRegion) {
                mapa.set(city.id, { x: city.x, y: city.y });
            }
        }
        return mapa;
    }, []); // ── ⋙── ── ── ── ── ── ── ──➤


    // ✪ bahiaStrokeStyle
    const bahiaStrokeStyle = useSpring({
        opacity: currentLevel === 1 ? 0 : 1,
        config: { duration: 300 } // Ajuste a duração conforme necessário
    });

    // [✪] transition mapCity
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

    // {✪} resetMap
    const resetMap = () => {
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
                    className="flex w-full mb-6">

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
                        "flex items-center w-full gap-6 justify-around mb-24",
                    )}
                >

                    <Box // map-panel
                        id="map-panel"
                        className="flex flex-col">

                        <div // ⋙── ── canvas-wrapper ── ──➤
                            id="canvas-wrapper"
                            className="relative bg-transparent  rounded-3xl"
                            style={{
                                width: "602px",
                                height: "640px",
                                overflow: "hidden",
                                // border: "1px solid black",
                            }}>


                            <animated.svg //HERE  SVGCanvas // . . . props
                                id="SVGCanvas"
                                ref={svgRef}
                                viewBox="0 0 602 640"
                                overflow={"visible"}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    ...springStyles, // ○ springStyles
                                }}
                                onClick={handleClick} // (○) handleClick // . . . children
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
                                    } // . . .


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


                                    {transition((style, cityItem) => { // [○] transition mapCity

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
                                    })} //. . .

                                    {instituicoes.map(instituicao => { // ⊙  instituicoes
                                        const coords = mapaDeCoordenadas.get(instituicao.cidade_id_mapa);

                                        if (coords) {

                                            return (
                                                <AnimatedLogoMarker
                                                    key={`inst-${instituicao.id}`}
                                                    // Aplicamos o offset salvo no banco de dados
                                                    x={coords.x + (instituicao.offset_x || 0)}
                                                    y={coords.y + (instituicao.offset_y || 0)}
                                                    imageUrl={instituicao.marcador_logo ?? undefined} // Supondo que a API retorne a URL do logo
                                                    tooltipContent={<Text size="2" weight="bold">{instituicao.nome}</Text>}
                                                    level={currentLevel} // ⊙ currentScale 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkerClick(instituicao);
                                                    }}
                                                />
                                            );
                                        }
                                        return null;
                                    })} // . . .


                                </g>

                            </animated.svg>

                        </div>
                    </Box>



                    <div
                        className="
                            w-[3px]
                            bg-gradient-to-b from-green-700 via-green-600 to-green-700
                            h-[700px]
                            mx-4
                            rounded-full
                            shadow-inner"
                    />



                    <Card // HERE info-panel
                        id="info-panel"
                        variant="ghost"
                        className="w-[500px] h-full p-4 overflow-y-auto"
                        style={{
                            minHeight: "400px",
                            maxHeight: "600px",
                        }}
                    >
                        {selectedInstituicao ? (
                            <>

                                <Heading size="5" mb="2">{selectedInstituicao.nome}</Heading>
                                <Text size="2" color="gray">
                                    {/* Aqui você pode colocar outros dados do marcador/instituição */}
                                    Cidade ID: {selectedInstituicao.cidade_id_mapa}
                                </Text>
                                {selectedInstituicao.marcador_logo && (
                                    <img
                                        src={selectedInstituicao.marcador_logo}
                                        alt={`${selectedInstituicao.nome} logo`}
                                        className="mt-4 w-[220px] h-auto rounded"
                                    />
                                )}


                                <Text as="p" className="my-4">
                                    Aqui vai uma breve descrição da instituição, ou os dados do campo `informacoes_adicionais` se você os buscar na API.
                                </Text>

                                {/* ▼▼▼ AQUI ESTÁ O BOTÃO QUE VOCÊ PEDIU ▼▼▼ */}
                                <Button asChild mt="4">
                                    <Link to={`/instituicao/${selectedInstituicao.id}`}>
                                        Ver Perfil Completo
                                    </Link>
                                </Button>

                            </>
                        ) : (
                            <>
                                <Heading size="5" mb="2">Bem-vindo ao Incite</Heading>
                                <Text size="2">
                                    Explore as regiões e descubra as instituições que promovem a Agricultura Familiar Sustentável na Bahia.
                                    Clique em um marcador ou região para saber mais.
                                </Text>
                            </>
                        )}
                    </Card>



                </Box>

            </Box>

        </>
    );

};  // ★ Incite ⋙─────────────────────────────────────────➤ 
export default Incite;


