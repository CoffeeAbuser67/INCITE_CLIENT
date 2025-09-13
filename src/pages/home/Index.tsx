// HERE INCITE
import classNames from "classnames";
import BG from "../../assets/bg_main2.png";

import {
    Box,
    Button,
    Card,
    Heading,
    Text,
    Select,
    Flex,
    Avatar,
    Separator
} from "@radix-ui/themes";
import { animated, useSpring, useTransition } from "react-spring";
import { useRef, useState, useEffect, useMemo } from "react";
import regionData from "../../assets/BahiaRegiao2.json";
import cityData from "../../assets/BahiaCidades4.json";

import { axiosPlain } from "../../utils/axios";
import { Link } from 'react-router-dom';
import { PinMarker } from './PinMarker';
import { ArrowRightIcon, Mail, MapPin, Phone, UserIcon } from "lucide-react";
import { createPortal } from "react-dom";


// . . . . . . .

const SCALE_ADJUSTMENT = 0.35

interface InstituicaoMarker {
    id: number;
    nome: string;
    cidade_id_mapa: string;
    cidade_nome: string;
    coordenador_responsavel: string;
    email: string;
    telefone: string;
    informacoes_adicionais?: string;
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


interface TooltipState {
    visible: boolean;
    content: string;
    x: number;
    y: number;
}


// Tipagem para cidades
interface City {
    id: string;
    d: string;
    name: string;
    x: number;
    y: number;
}

interface CityData {
    [regionId: string]: City[];
}

// [●] mapCity
const mapCity: CityData = cityData;

// [●] mapRegion
const mapRegion: Region[] = regionData;


const Home = () => { // ★ Home ⋙─────────────────────────────────────────➤ 
    const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef
    const originalBBoxRef = useRef<BoundingBox | null>(null); // HERE originalBBoxRef
    // ── ⋙── ── ── ── ── ── ──➤

    type levels = 0 | 1;
    // ✳ [currentLevel, setCurrentLevel]
    const [currentLevel, setCurrentLevel] = useState<levels>(0);

    // WARN  To pegando a escala mas n to usando 
    // ✳ [currentScale, setCurrentScale]
    const [currentScale, setCurrentScale] = useState<number>(1);


    interface RegionState {
        active: string;
        name: string;
    }

    // ✳  [region, setRegion] 🗺️
    const [region, setRegion] = useState<RegionState>({
        active: 'bahia',
        name: 'Bahia',
    });

    const handleSetRegion = (active: string, name: string) => {
        setRegion({ active, name });
    };


    //     interface CityState {
    //     active: string;
    //     name: string;
    // }

    // const [city, setCity] = useState<CityState>({
    //     active: '',
    //     name: '',
    // });


    // const handleSetCity = (active: string, name: string) => {
    //     setCity({ active, name });
    // };


    // ✳ [tooltip, setTooltip] 
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        content: "",
        x: 0,
        y: 0,
    });


    // ✳  [selectedInstituicao, setSelectedInstituicao]
    const [selectedInstituicao, setSelectedInstituicao] = useState<InstituicaoMarker | null>(null);

    // ✳  [instituicoes, setInstituicoes]
    const [instituicoes, setInstituicoes] = useState<InstituicaoMarker[]>([]);
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
    const handleMarkerClick = (instituicao: InstituicaoMarker) => {
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
        handleSetRegion(regionId, regionObject.name);
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
                handleSetRegion(target_id, target_name || "");
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
                // Aqui posso adicionar lógica futura para o clique na cidade,
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
        handleSetRegion("bahia", "Bahia"); // ↺ setRegion
        api.start({
            transform: "scale(1) translate(0px, 0px)",
        });
    }; // ── ⋙── ── ── ── ── ── ── ──➤

    const marcadoresOrdenados = useMemo(() => { // {✪} marcadoresOrdenados
        // Se nenhuma instituição estiver selecionada, retorna a lista original
        if (!selectedInstituicao) {
            return instituicoes; // ⊙  instituicoes
        }
        const outrosMarcadores = instituicoes.filter(inst => inst.id !== selectedInstituicao.id);
        //  Retorna um novo array com os outros marcadores primeiro, e o selecionado por último.
        return [...outrosMarcadores, selectedInstituicao];
    }, [instituicoes, selectedInstituicao]); // ── ⋙── ── ── ── ── ── ── ──➤
    // Recalcula apenas quando a lista ou a seleção mudar

    const handleSelectChange = (instituicaoId: string) => { // (✪) handleSelectChange
        if (!instituicaoId) {
            resetMap(); // Se o usuário limpar o select, reseta o mapa
            return;
        }
        // Encontra o objeto completo da instituição baseado no ID recebido do select
        const instituicaoSelecionada = instituicoes.find(inst => inst.id === Number(instituicaoId));
        if (instituicaoSelecionada) {
            // REUTILIZAMOS NOSSA FUNÇÃO EXISTENTE!
            // Ela já sabe como selecionar a instituição e dar zoom na região.
            handleMarkerClick(instituicaoSelecionada);
        }
    };





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



    return (// ── ⋙⇌⇌⇌⇌⇌⇌⇌ DOM ⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸
        <>
            <Box // CANVAS ── ── ── ──➤
                id="CANVAS"
                className="flex flex-col gap-6 px-4 pb-4 mx-8 pt-36 md:px-8 md:pb-8 md:pt-28 lg:px-14 lg:pb-14 lg:pt-32"
            >
                <Box // ──  PANEL1
                    id="PANEL1"
                    className="flex flex-col-reverse lg:flex-row w-full mb-12 gap-8">

                    <Box
                        id="TEXT_HEADER"
                        className="flex flex-col gap-8 justify-between items-center w-full lg:w-1/2 text-left"
                    >

                        <Heading color="gray" size="6" className="text-balance text-center break-words hyphens-none">
                            Instituto de Ciência, Inovação e Tecnologia do Estado da Bahia
                        </Heading>

                        <Heading
                            size={{ initial: '7', md: '9' }} // Exemplo para o título maior
                            className="text-balance text-center break-words hyphens-none"
                        >
                            Incite - <span className="text-green-700">Agricultura Familiar</span> Diversificada e Sustentável
                        </Heading>

                        <Text className="pt-10">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </Text>

                        <Card
                            variant="ghost"
                            id="Intituicao-Text-Selector">
                            <Heading as="h3" size="4" mb="2">Navegar por Instituição</Heading>
                            <Select.Root
                                // ⊙  selectedInstituicao
                                value={selectedInstituicao ? selectedInstituicao.id.toString() : ""}
                                // (○) handleSelectChange
                                onValueChange={handleSelectChange}
                            >
                                <Select.Trigger placeholder="Escolha uma instituição na lista..." className="w-full" />
                                <Select.Content position="popper">
                                    <Select.Group>
                                        <Select.Label>Instituições</Select.Label>
                                        {instituicoes.map(inst => (
                                            <Select.Item key={inst.id} value={inst.id.toString()}>
                                                {inst.nome}
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Card>

                    </Box>

                    <Box
                        id="LOGO_HEADER"
                        className="flex h-[300px] md:h-[450px] lg:h-[600px] w-full lg:w-1/2 justify-center "
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
                        "flex flex-col items-center w-full gap-10 mb-24,",
                        "lg:flex-row lg:items-start lg:justify-around lg:gap-6",
                    )}
                >

                    <Box // map-panel
                        id="map-panel"
                        className="flex flex-col w-full max-w-full lg:w-auto">


                        <div className="w-full overflow-x-auto rounded-3xl">
                            <div // ⋙── ── canvas-wrapper ── ──➤
                                id="canvas-wrapper"
                                className="relative bg-transparent flex-shrink-0"
                                style={{
                                    width: "602px",
                                    height: "640px",
                                    overflow: "hidden",
                                    // border: "1px solid black",
                                }}>

                                <AnimatedTooltip {...tooltip} />

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
                                    onMouseMove={handleMouseMoveSVG}
                                    onMouseLeave={handleMouseLeaveSVG}
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
                                                        <animated.path
                                                            id={el.id}
                                                            d={el.d}
                                                            data-name={el.name}
                                                            data-type="region"
                                                            className={class_style}
                                                            style={strokeSpecificStyle} // ○ bahiaStrokeStyle
                                                            onMouseEnter={handleMouseEnterPath}
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
                                                    <animated.path
                                                        id={cityItem.id}
                                                        d={cityItem.d}
                                                        data-name={cityItem.name}
                                                        data-type="city"
                                                        className={classNames(
                                                            "path-hover2",
                                                            "cls-1",
                                                        )}
                                                        onMouseEnter={handleMouseEnterPath}
                                                    />
                                                </animated.g>
                                            );
                                        })} //. . .


                                        {marcadoresOrdenados.map(instituicao => {
                                            const coords = mapaDeCoordenadas.get(instituicao.cidade_id_mapa);
                                            if (coords) {
                                                return (
                                                    <PinMarker
                                                        key={`inst-${instituicao.id}`}
                                                        x={coords.x + (instituicao.offset_x || 0)}
                                                        y={coords.y + (instituicao.offset_y || 0)}
                                                        imageUrl={instituicao.marcador_logo}
                                                        tooltipContent={<Text size="2" weight="bold">{instituicao.nome}</Text>}
                                                        level={currentLevel}
                                                        // O marcador é 'ativo' se seu ID for o mesmo da instituição selecionada
                                                        isActive={selectedInstituicao?.id === instituicao.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkerClick(instituicao);
                                                        }}
                                                    />
                                                );
                                            }
                                            return null;
                                        })} //. . .

                                    </g>
                                </animated.svg>
                            </div>

                        </div>


                    </Box>


                    <div
                        className="
                            hidden lg:block
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
                        className="w-full lg:w-[500px] p-4 overflow-y-auto"
                        style={{
                            minHeight: "400px",
                            maxHeight: "600px",
                        }}
                    >
                        {selectedInstituicao ? (
                            <>
                                <Flex gap="5" align="center">
                                    {selectedInstituicao.marcador_logo && (
                                        <img
                                            src={selectedInstituicao.marcador_logo}
                                            alt={`${selectedInstituicao.nome} logo`}
                                            className=" w-[100px] h-auto rounded"

                                        />
                                    )}

                                    <Box>
                                        <Heading as="h2" size="6" mb="4">{selectedInstituicao.nome}</Heading>

                                        <Flex align="center" gap="2"><MapPin size={16} className="mb-2" /><Text size="2">{selectedInstituicao.cidade_nome.toLocaleUpperCase()}</Text></Flex>
                                        <Flex align="center" gap="2"><UserIcon size={16} className="mb-2" /><Text size="2">{selectedInstituicao.coordenador_responsavel}</Text></Flex>
                                        <Flex align="center" gap="2"><Mail size={16} className="mb-2" /><Text size="2">{selectedInstituicao.email}</Text></Flex>
                                        <Flex align="center" gap="2"><Phone size={16} className="mb-2" /><Text size="2">{selectedInstituicao.telefone}</Text></Flex>
                                    </Box>

                                </Flex>

                                <Separator my="2" size="4" />

                                {/* Informações Adicionais */}
                                <Box className="flex-grow">

                                    <Heading as="h3" size="3" mb="2" color="gray">Sobre</Heading>
                                    <Text as="p" size="2" mb="2">
                                        {selectedInstituicao.informacoes_adicionais ?? ''}
                                    </Text>

                                    {/* TODO: Adicionar os contatos (coordenador, email, telefone) aqui se desejar */}
                                </Box>

                                {/* Botão de Ação */}

                                <Button variant="soft" asChild size="1" mt="auto">
                                    <Link to={`/instituicao/${selectedInstituicao.id}`}>
                                        <ArrowRightIcon size="18" className="mr-1" /> Perfil
                                    </Link>
                                </Button>

                            </>
                        ) : (
                            <>
                                <Heading size="5" mb="2">Bem-vindo ao Incite</Heading>
                                <Text size="2">
                                    Explore as instituições que promovem a Agricultura Familiar Sustentável na Bahia.
                                    Clique em um marcador para saber mais.
                                </Text>
                            </>
                        )}
                    </Card>



                </Box>

            </Box>

        </>
    );

};  // ★ Home ⋙─────────────────────────────────────────➤ 
export default Home;


