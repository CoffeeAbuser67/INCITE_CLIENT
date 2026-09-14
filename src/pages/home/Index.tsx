import classNames from "classnames";
import BG from "../../assets/bg_Incite.png";

import {
    Box,
    Button,
    Card,
    Heading,
    Text,
    Flex,
    Separator
} from "@radix-ui/themes";
import { animated, useSpring, useTransition } from "react-spring";
import { useRef, useState, useEffect, useMemo } from "react";
import regionData from "../../assets/BahiaRegiao3.json";
import cityData from "../../assets/BahiaCidades5.json";

import { axiosPlain } from "../../utils/axios";
import { Link } from 'react-router-dom';
import { PinMarker } from './PinMarker';
import { MapTooltip, TooltipState } from '../../components/MapTooltip';
import { ArrowRightIcon, Mail, MapPin, Phone, UserIcon, ArrowLeft } from "lucide-react";

// . . . . . . .

interface InstituicaoMarker {
    id: number;
    nome: string;
    cidade_id_mapa: string;
    cidade_nome: string;
    coordenador_responsavel: string;
    email: string;
    telefone: string;
    informacoes_adicionais?: string;
    offset_x: number;
    offset_y: number;
    marcador_logo: string | null;
}

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Region {
    id: string;
    d: string;
    name: string;
    bbox: BoundingBox;
}

interface City {
    id: string;
    d: string;
    name: string;
    x: number;
    y: number;
    bbox: BoundingBox;
}

interface CityData {
    [regionId: string]: City[];
}

// [●] mapCity
const mapCity: CityData = cityData;

// [●] mapRegion
const mapRegion: Region[] = regionData;





// [●] IlustracaoPlaceholder
const IlustracaoPlaceholder = () => (
    <svg
        viewBox="0 0 480 360"
        role="img"
        aria-label="Espaço reservado para a ilustração de apoio"
        className="w-full max-w-[480px] h-auto"
    >
        <rect
            x="1" y="1" width="478" height="358" rx="12"
            fill="#f8faf8" stroke="#cbd5cd" strokeWidth="2" strokeDasharray="10 8"
        />
        <path d="M150 230 C 200 214, 280 214, 330 230" fill="none" stroke="#cbd5cd" strokeWidth="3" strokeLinecap="round" />
        <circle cx="240" cy="150" r="34" fill="none" stroke="#cbd5cd" strokeWidth="3" />
        <path d="M240 184 L240 214" stroke="#cbd5cd" strokeWidth="3" strokeLinecap="round" />
        <text x="240" y="272" textAnchor="middle" fill="#94a3a0" fontSize="15" fontFamily="ui-sans-serif, system-ui, sans-serif">
            ilustração de apoio
        </text>
        <text x="240" y="294" textAnchor="middle" fill="#b0bcb8" fontSize="13" fontFamily="ui-sans-serif, system-ui, sans-serif">
            480 × 360
        </text>
    </svg>
);





const Home = () => { // ★ Home ⋙─────────────────────────────────────────➤ 

    // Referência do painel, para rolar até ele quando a seleção vem do mapa
    const painelRef = useRef<HTMLDivElement | null>(null);

    type levels = 0 | 1;
    const [currentLevel, setCurrentLevel] = useState<levels>(0);

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

    // ✳  [erroInst, setErroInst]
    const [erroInst, setErroInst] = useState(false);

    // ✳  [sobreExpandido, setSobreExpandido]
    const [sobreExpandido, setSobreExpandido] = useState(false);

    // ✳  [viewBoxWidth, setViewBoxWidth]
    const [viewBoxWidth, setViewBoxWidth] = useState(601);


    // ✳  [mostrarTodas, setMostrarTodas]
    const [mostrarTodas, setMostrarTodas] = useState(false);

    const LIMITE_INICIAL = 6;


    // ── ⋙── ── ── ── ── ── ──➤

    useEffect(() => { //HERE uE
        const fetchInstituicoes = async () => {
            try {
                const response = await axiosPlain.get('/map-markers/');
                setInstituicoes(response.data);
                setErroInst(false);
            } catch (error) {
                console.error("Falha ao buscar instituições:", error);
                setErroInst(true);
            }
        };

        fetchInstituicoes();
    }, []);


    const initialViewBox = [0, 0, 601, 640];

    // HERE [{ viewBox }, api] 
    const [{ viewBox }, api] = useSpring(() => ({
        viewBox: initialViewBox,
        config: { tension: 62, friction: 35, mass: 7 },
    }));


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


    // (●) mapaDeCidades — substitui o antigo mapaDeCoordenadas,
    // que era redundante (City já carrega x, y e bbox)
    const mapaDeCidades = useMemo(() => {
        const mapa = new Map<string, City>();
        for (const citiesInRegion of Object.values(mapCity)) {
            for (const city of citiesInRegion) {
                mapa.set(city.id, city);
            }
        }
        return mapa;
    }, []);


    // <✪> runToFit 
    const runToFit = (bbox: BoundingBox, paddingRatio = 0.15, minSize = 0) => {
        const ratio = 601 / 640;

        let w = Math.max(bbox.width, minSize);
        let h = Math.max(bbox.height, minSize / ratio);

        const pad = Math.max(w, h) * paddingRatio;
        w += pad * 2;
        h += pad * 2;

        if (w / h > ratio) h = w / ratio;
        else w = h * ratio;

        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const newViewBox = [cx - w / 2, cy - h / 2, w, h];
        setViewBoxWidth(w);
        api.start({ viewBox: newViewBox });
    };


    // (✪) handleMarkerClick
    // fromMap: quando o clique vem de um pino, o painel pode estar fora
    // da tela (ele fica ACIMA do mapa), então rolamos até ele.
    const handleMarkerClick = (instituicao: InstituicaoMarker, fromMap = false) => {
        setSelectedInstituicao(instituicao);
        setSobreExpandido(false);

        const regionId = cityToRegionMap[instituicao.cidade_id_mapa];
        const cidade = mapaDeCidades.get(instituicao.cidade_id_mapa);

        if (!regionId || !cidade) {
            console.error("Cidade não encontrada no mapa:", instituicao.cidade_id_mapa);
            return;
        }

        const regionObject = mapRegion.find(r => r.id === regionId);
        if (!regionObject) return;

        setCurrentLevel(1);
        handleSetRegion(regionId, regionObject.name);
        runToFit(cidade.bbox, 0.9, 45);

        if (fromMap) {
            painelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };


    // (●) cidadesOrdenadas 
    const cidadesOrdenadas = useMemo(() => {
        const lista = mapCity[region.active] || [];
        if (!selectedInstituicao) return lista;
        const ativa = selectedInstituicao.cidade_id_mapa;
        return [...lista.filter(c => c.id !== ativa), ...lista.filter(c => c.id === ativa)];
    }, [region.active, selectedInstituicao]);


    // ✪ bahiaStrokeStyle
    const bahiaStrokeStyle = useSpring({
        opacity: currentLevel === 1 ? 0 : 1,
        config: { duration: 300 }
    });

    // [✪] transition mapCity
    const transition = useTransition(cidadesOrdenadas, {
        trail: 600 / mapCity[region.active].length || 1,
        from: { opacity: 0, transform: "scale(0)" },
        enter: { opacity: 1, transform: "scale(1)" },
        leave: { opacity: 0, transform: "scale(0)" },
        config: { mass: 10, tension: 63, friction: 16, clamp: true },
        keys: cidadesOrdenadas.map((el) => el.id),
    });


    // <✪> handleClick
    const handleClick = (event: React.MouseEvent<SVGElement>) => {
        const target = event.target as SVGPathElement;
        const target_id = target?.id;
        const target_type = target?.getAttribute("data-type");
        const target_name = target?.getAttribute("data-name");

        if (currentLevel === 0) {
            if (target_type === "region" && target_id !== "bahia_stroke") {
                setCurrentLevel(1);
                handleSetRegion(target_id, target_name || "");
                const regionInfo = mapRegion.find(r => r.id === target_id);
                if (regionInfo?.bbox) runToFit(regionInfo.bbox);
            }
        }

        if (currentLevel === 1) {
            if (target_type !== "city") {
                resetMap();
            }
        }
    }


    // {✪} resetMap
    const resetMap = () => {
        setCurrentLevel(0);
        handleSetRegion("bahia", "Bahia");
        setViewBoxWidth(601);
        api.start({ viewBox: initialViewBox });
        setSelectedInstituicao(null);
        setSobreExpandido(false);
    };


    const marcadoresOrdenados = useMemo(() => {
        if (!selectedInstituicao) {
            return instituicoes;
        }
        const outrosMarcadores = instituicoes.filter(inst => inst.id !== selectedInstituicao.id);
        return [...outrosMarcadores, selectedInstituicao];
    }, [instituicoes, selectedInstituicao]);


    const handleMouseEnterPath = (event: React.MouseEvent<SVGPathElement>) => {
        const content = event.currentTarget.getAttribute("data-name");
        if (content) {
            setTooltip(prev => ({ ...prev, visible: true, content }));
        }
    };

    const handleMouseMoveSVG = (event: React.MouseEvent<SVGSVGElement>) => {
        setTooltip(prev => ({ ...prev, x: event.pageX + 12, y: event.pageY + 12 }));
    };

    const handleMouseLeaveSVG = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };


    const sobreTexto = selectedInstituicao?.informacoes_adicionais ?? 'Nenhuma informação adicional cadastrada.';


    return (// ── ⋙⇌⇌⇌⇌⇌⇌⇌ DOM ⇌⇌⇌⇌⇌⇌⇌⇌⇌⇌⫸
        <Box
            id="CANVAS"
            className="flex flex-col items-center w-full px-4 pb-16 pt-28 md:px-6 md:pt-32 lg:px-12"
        >

            {/* ── ⋙── ── ── HERO ── ── ── ──➤ */}
            <Box id="HERO" className="flex flex-col items-center w-full max-w-4xl gap-4 mb-10">

                <Heading
                    size={{ initial: '7', md: '9' }}
                    align="center"
                    className="text-balance break-words hyphens-none"
                >
                    Incite - <span className="text-green-700">Agricultura Familiar</span> Diversificada e Sustentável
                </Heading>

                <Heading as="h2" color="gray" size="4" weight="regular" align="center" className="text-balance">
                    Instituto de Ciência, Inovação e Tecnologia do Estado da Bahia
                </Heading>

                <IlustracaoPlaceholder />

                <Text align="center" color="gray" className="max-w-2xl">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
            </Box>


            {/* ── ⋙── ── ── PAINEL ── ── ── ──➤
                min-h reserva a altura do detalhe: sem isso o mapa
                pula para baixo toda vez que uma instituição é selecionada. */}
            <Box
                ref={painelRef}
                id="PAINEL"
                className="w-full max-w-5xl min-h-[300px] md:min-h-[260px]"
            >
                {selectedInstituicao ? (
                    <Flex direction="column" className="h-full">

                        <Button
                            variant="ghost"
                            size="2"
                            onClick={resetMap}
                            className="mb-4 self-start cursor-pointer text-gray-500 hover:text-gray-900"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Voltar para a lista
                        </Button>

                        {/* duas colunas internas: metade da altura do layout antigo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">

                            <Flex gap="4" align="start">
                                {selectedInstituicao.marcador_logo ? (
                                    <img
                                        src={selectedInstituicao.marcador_logo}
                                        alt={`${selectedInstituicao.nome} logo`}
                                        className="w-16 h-16 object-contain rounded-md bg-white border border-gray-100 flex-shrink-0"
                                    />
                                ) : (
                                    <Box className="w-16 h-16 bg-green-50 border border-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                                        <MapPin size={28} className="text-green-700" />
                                    </Box>
                                )}

                                <Box className="min-w-0">
                                    <Heading as="h2" size="5" mb="2">{selectedInstituicao.nome}</Heading>

                                    <Flex align="center" gap="2" mb="1"><MapPin size={15} className="text-green-700 flex-shrink-0" /><Text size="2">{selectedInstituicao.cidade_nome.toLocaleUpperCase()}</Text></Flex>
                                    <Flex align="center" gap="2" mb="1"><UserIcon size={15} className="text-green-700 flex-shrink-0" /><Text size="2">{selectedInstituicao.coordenador_responsavel}</Text></Flex>
                                    <Flex align="center" gap="2" mb="1"><Mail size={15} className="text-green-700 flex-shrink-0" /><Text size="2" className="break-all">{selectedInstituicao.email}</Text></Flex>
                                    <Flex align="center" gap="2"><Phone size={15} className="text-green-700 flex-shrink-0" /><Text size="2">{selectedInstituicao.telefone}</Text></Flex>
                                </Box>
                            </Flex>

                            <Flex direction="column">
                                {/* informacoes_adicionais é texto livre: sem clamp,
                                    a altura reservada não serviria para nada */}
                                <Text
                                    as="p"
                                    size="2"
                                    color="gray"
                                    className={sobreExpandido ? "" : "line-clamp-4"}
                                >
                                    {sobreTexto}
                                </Text>

                                {sobreTexto.length > 220 && (
                                    <Text
                                        as="span"
                                        size="1"
                                        color="green"
                                        className="cursor-pointer font-medium hover:underline my-1 self-start"
                                        onClick={() => setSobreExpandido(v => !v)}
                                    >
                                        {sobreExpandido ? "Ler menos" : "Ler mais"}
                                    </Text>
                                )}

                                <Button variant="soft" color="green" asChild size="2" className="mt-auto pt-0 self-start">
                                    <Link to={`/instituicao/${selectedInstituicao.id}`}>
                                        <ArrowRightIcon size={18} className="mr-2" /> Acessar perfil completo
                                    </Link>
                                </Button>
                            </Flex>
                        </div>
                    </Flex>
                ) : (
                    <Flex direction="column" className="h-full">
                        <Flex align="baseline" justify="between" gap="3" wrap="wrap" mb="3">
                            <Heading size="5">Instituições parceiras</Heading>
                            <Text size="2" color="gray">
                                selecione uma abaixo ou clique num marcador do mapa
                            </Text>
                        </Flex>

                        <Separator mb="4" size="4" />

                        {erroInst ? (
                            <Text size="2" color="gray">Não foi possível carregar as instituições.</Text>
                        ) : instituicoes.length === 0 ? (
                            <Text size="2" color="gray">Nenhuma instituição cadastrada ainda.</Text>
                        ) : (
                            <>


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {(mostrarTodas ? instituicoes : instituicoes.slice(0, LIMITE_INICIAL)).map(inst => (
                                        <Card
                                            key={inst.id}
                                            asChild
                                            variant="surface"
                                            className="cursor-pointer transition-all hover:bg-gray-50 hover:shadow-sm"
                                        >
                                            <button
                                                className="w-full text-left p-3 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-[inherit]"
                                                onClick={() => handleMarkerClick(inst)}
                                            >
                                                <Flex gap="3" align="start">
                                                    {inst.marcador_logo ? (
                                                        <img
                                                            src={inst.marcador_logo}
                                                            alt=""
                                                            loading="lazy"
                                                            className="w-10 h-10 object-contain rounded-md bg-white border border-gray-100 flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <Box className="w-10 h-10 bg-green-50 border border-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                                                            <MapPin size={20} className="text-green-700" />
                                                        </Box>
                                                    )}
                                                    <Box className="min-w-0">
                                                        <Text as="div" size="2" weight="bold" className="line-clamp-2 leading-snug">{inst.nome}</Text>
                                                        <Text as="div" size="1" color="gray" className="mt-1">{inst.cidade_nome.toUpperCase()}</Text>
                                                    </Box>
                                                </Flex>
                                            </button>
                                        </Card>
                                    ))}
                                </div>

                                {instituicoes.length > LIMITE_INICIAL && (
                                    <Flex justify="center" mt="4">
                                        <Button
                                            variant="ghost"
                                            color="green"
                                            size="2"
                                            className="cursor-pointer"
                                            onClick={() => setMostrarTodas(v => !v)}
                                        >
                                            {mostrarTodas
                                                ? "Ver menos"
                                                : `Ver todas as ${instituicoes.length} instituições`}
                                        </Button>
                                    </Flex>
                                )}
                            </>
                        )}

                    </Flex>
                )}
            </Box>


            {/* ── ⋙── ── ── MAPA ── ── ── ──➤
                max-w porque o viewBox é 601x640 (mais alto que largo):
                em largura total o mapa ficaria desproporcional. */}
            <Box id="MAPA" className="w-full max-w-[640px] mt-8">

                <Flex align="center" justify="between" gap="3" className="px-1 pb-2">
                    <Text size="2" color="gray" className="truncate">
                        Bahia
                        {currentLevel === 1 && <> · {region.name}</>}
                        {selectedInstituicao && (
                            <> · <span className="text-gray-900">{selectedInstituicao.cidade_nome}</span></>
                        )}
                    </Text>


                </Flex>

                <div
                    id="canvas-wrapper"
                    className="relative bg-transparent w-full aspect-[601/640] overflow-hidden"
                >
                    <MapTooltip {...tooltip} />

                    <animated.svg //HERE  SVGCanvas
                        id="SVGCanvas"
                        role="img"
                        aria-label="Mapa das regiões de identidade da Bahia"
                        viewBox={viewBox.to((...v) => v.join(" "))}
                        overflow={"visible"}
                        style={{
                            width: "100%",
                            height: "100%",
                            cursor: 'pointer',
                        }}
                        onClick={handleClick}
                        onMouseMove={handleMouseMoveSVG}
                        onMouseLeave={handleMouseLeaveSVG}
                    >
                        <g>
                            <defs>
                                <style>
                                    {".cls-1{fill:#f4f4f4;stroke:#a5a5a5}"}
                                    {".cls-1, .cls-2{stroke-linecap:round;stroke-linejoin:round}"}
                                    {".cls-2{fill:none;stroke:#000;stroke-width:2px}"}
                                </style>
                            </defs>

                            {mapRegion.map((el, i) => {
                                const class_style = el.id === "bahia_stroke" ? "cls-2" : "cls-1 path-hover2";
                                const strokeSpecificStyle = el.id === "bahia_stroke" ? bahiaStrokeStyle : {};

                                return (
                                    <g key={i}>
                                        <animated.path
                                            id={el.id}
                                            d={el.d}
                                            data-name={el.name}
                                            data-type="region"
                                            className={class_style}
                                            style={strokeSpecificStyle}
                                            onMouseEnter={handleMouseEnterPath}
                                        />
                                    </g>
                                )
                            })}

                            {currentLevel === 1 && (
                                <rect
                                    opacity={0.95}
                                    x={-2000}
                                    y={-2000}
                                    width="4000"
                                    height="4000"
                                    fill="white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetMap();
                                    }}
                                />
                            )}

                            {transition((style, cityItem) => {
                                const isCidadeAtiva =
                                    selectedInstituicao?.cidade_id_mapa === cityItem.id;
                                const esmaecido = !!selectedInstituicao && !isCidadeAtiva;

                                return (
                                    <animated.g {...style}>
                                        <animated.path
                                            id={cityItem.id}
                                            d={cityItem.d}
                                            data-name={cityItem.name}
                                            data-type="city"
                                            className={classNames(
                                                "path-hover2",
                                                !esmaecido && !isCidadeAtiva && "cls-1",
                                            )}
                                            fill={
                                                esmaecido ? "#f0f0f0"
                                                    : isCidadeAtiva ? "#dcfce7"
                                                        : undefined
                                            }
                                            stroke={
                                                esmaecido ? "#e8e8e8"
                                                    : isCidadeAtiva ? "#15803d"
                                                        : undefined
                                            }
                                            strokeWidth={isCidadeAtiva ? 1.4 : undefined}
                                            style={{
                                                transition: 'fill 300ms ease, stroke 300ms ease',
                                            }}
                                            onMouseEnter={handleMouseEnterPath}
                                        />
                                    </animated.g>
                                );
                            })}

                            {marcadoresOrdenados.map(instituicao => {
                                const cidade = mapaDeCidades.get(instituicao.cidade_id_mapa);
                                if (!cidade) return null;

                                return (
                                    <PinMarker
                                        key={`inst-${instituicao.id}`}
                                        x={cidade.x + (instituicao.offset_x || 0)}
                                        y={cidade.y + (instituicao.offset_y || 0)}
                                        imageUrl={instituicao.marcador_logo}
                                        tooltipContent={<Text size="2" weight="bold">{instituicao.nome}</Text>}
                                        label={instituicao.nome}
                                        viewScale={viewBoxWidth / 601}
                                        isActive={selectedInstituicao?.id === instituicao.id}
                                        isAnyPinActive={selectedInstituicao !== null}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkerClick(instituicao, true);
                                        }}
                                    />
                                );
                            })}
                        </g>
                    </animated.svg>
                </div>
            </Box>

        </Box>
    );

};  // ★ Home ⋙─────────────────────────────────────────➤ 
export default Home;