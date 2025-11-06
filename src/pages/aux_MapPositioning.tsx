// HERE MapMenuBBoxCalculator.tsx 
import {
    useState,
    useRef,
    useEffect,
} from "react";

import {
    Box,
    Button, 
    Card,
    Heading,
    Text, 
} from "@radix-ui/themes";

import regionCityData from "../assets/BahiaCidades4.json"; // Caminho para seus dados
// . . . . . . .

interface CityDef { 
    id: string;
    d: string;
    name: string;
}

interface RegionCityData {
    [key: string]: CityDef[];
}

interface CalculatedCenterInfo {
    name: string;
    x: number;
    y: number;
}

interface AllCalculatedCenters {
    [cityId: string]: CalculatedCenterInfo;
}

// [●] mapRegionCity
const mapRegionCity: RegionCityData = regionCityData;


// NOTE
// MapMenuBBoxCalculator 
// Estratégia para o Componente Utilitário de Pré-cálculo:

// 1 Carregar Todas as Cidades: Obter uma lista plana de todos os objetos de cidade de mapRegionCity.

// 2 Estado para Controle:
//   allCities: Array com todas as cidades.
//   currentCityIndex: Índice da cidade atual na lista allCities que está sendo processada.
//   cityToMeasure: O objeto da cidade que está sendo renderizado atualmente para medição do BBox.
//   cityPathRef: Uma useRef para o elemento <path> do cityToMeasure.
//   calculatedCenters: Um objeto para acumular os IDs das cidades e seus centros calculados.
//   startCalculation: Um booleano para iniciar o processo.
//   isProcessing: Um booleano para indicar que uma medição está em andamento e evitar cliques múltiplos.

// 3 Renderização Seletiva: No JSX, em vez de renderizar todas as regiões ou as cidades de uma região ativa, vamos renderizar apenas o path do cityToMeasure.

// 4 Processo Iterativo com useEffect:
//   Um useEffect observará startCalculation e currentCityIndex para definir qual é a próxima cityToMeasure.
//   Outro useEffect observará cityToMeasure e cityPathRef.current. Quando ambos estiverem prontos (ou seja, a cidade está definida e seu path foi renderizado e o ref atribuído), ele calculará o getBBox(), armazenará o centro e avançará o currentCityIndex.

// 5 Coleta e Saída dos Dados: Quando todas as cidades forem processadas, o objeto calculatedCenters será logado no console como uma string JSON, pronta para ser copiada.



const MapMenuBBoxCalculator = () => {//  ★ ◯⫘⫘⫘⫘⫘⫘⫘⫘ MapMenuBBoxCalculator ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸
    const svgRef = useRef<SVGSVGElement | null>(null);
    const cityPathRef = useRef<SVGPathElement | null>(null); // Ref para o path da cidade atual

    const [allCitiesList, setAllCitiesList] = useState<CityDef[]>([]);
    const [currentCityIndex, setCurrentCityIndex] = useState<number>(0);
    const [cityToMeasure, setCityToMeasure] = useState<CityDef | null>(null);
    const [calculatedCenters, setCalculatedCenters] = useState<AllCalculatedCenters>({});
    const [startCalculation, setStartCalculation] = useState<boolean>(false);
    const [isProcessingItem, setIsProcessingItem] = useState<boolean>(false); // Para feedback e controle

    // 1. Preparar a lista plana de todas as cidades
    useEffect(() => {
        const flatList: CityDef[] = [];
        for (const regionKey in mapRegionCity) {
            mapRegionCity[regionKey].forEach(city => {
                // Garante que o ID seja uma string, importante para chaves de objeto
                flatList.push({ ...city, id: String(city.id) });
            });
        }

        setAllCitiesList(flatList);

        if (flatList.length > 0) {
            console.log(`Pré-calculadora: ${flatList.length} cidades encontradas para processar.`);
        } else {
            console.warn("Pré-calculadora: Nenhuma cidade encontrada nos dados. Verifique BahiaRegiaoMuni.json.");
        }
    }, []);


    // 2. Controlar o fluxo de cálculo: definir a próxima cidade ou finalizar
    useEffect(() => {
        if (!startCalculation || allCitiesList.length === 0) {
            setIsProcessingItem(false);
            return;
        }

        if (currentCityIndex < allCitiesList.length) {
            setCityToMeasure(allCitiesList[currentCityIndex]);
            setIsProcessingItem(true); // Indica que uma cidade está pronta para ser medida
        } else {
            // Todas as cidades foram processadas
            if (Object.keys(calculatedCenters).length > 0) {
                console.log("----------------------------------------------------");
                console.log("CENTROS DE TODAS AS CIDADES CALCULADOS (COPIE O JSON ABAIXO):");
                console.log("----------------------------------------------------");
                console.log(JSON.stringify(calculatedCenters, null, 2));
                console.log("----------------------------------------------------");
                alert(`Processamento concluído! Verifique o console para a saída JSON de ${Object.keys(calculatedCenters).length} cidades.`);
            } else if (allCitiesList.length > 0) {
                alert("Processamento concluído, mas nenhum centro foi calculado. Verifique os logs.");
            } else {
                alert("Nenhuma cidade para processar.");
            }
            setStartCalculation(false);
            setIsProcessingItem(false);
            setCityToMeasure(null);
        }
    }, [startCalculation, allCitiesList, currentCityIndex, calculatedCenters]);



    
    // 3. Efetuar a medição do BBox quando cityToMeasure e seu ref estiverem prontos
    useEffect(() => {
        // Só executa se estivermos processando, tiver uma cidade para medir e o SVG e o path ref estiverem prontos
        if (isProcessingItem && cityToMeasure && cityPathRef.current && svgRef.current) {
            const measureAndProceed = () => {
                if (!cityPathRef.current) { // Dupla verificação do ref
                    console.warn("cityPathRef não estava pronto para medição de:", cityToMeasure.name);
                    setIsProcessingItem(false); // Reseta para este item
                    setCurrentCityIndex(prev => prev + 1); // Tenta o próximo
                    return;
                }
                try {
                    const bbox = cityPathRef.current.getBBox();
                    const centerX = parseFloat((bbox.x + bbox.width / 2).toFixed(3)); // 3 casas decimais de precisão
                    const centerY = parseFloat((bbox.y + bbox.height / 2).toFixed(3));

                    // console.log(`Processado: ${cityToMeasure.name} (ID: ${cityToMeasure.id}) - Centro: { x: ${centerX}, y: ${centerY} }`);

                    setCalculatedCenters(prev => ({
                        ...prev,
                        [cityToMeasure.id]: { name: cityToMeasure.name, x: centerX, y: centerY },
                    }));
                } catch (e) {
                    console.error(`Erro ao obter BBox para ${cityToMeasure.name} (ID: ${cityToMeasure.id}):`, e);
                } finally {
                    setIsProcessingItem(false); // Medição deste item concluída
                    setCurrentCityIndex(prevIndex => prevIndex + 1); // Avança para a próxima cidade
                }
            };

            // Usar requestAnimationFrame garante que o DOM teve a chance de ser atualizado
            // com o novo path antes de tentarmos medir. Essencial para refs dinâmicos.
            requestAnimationFrame(measureAndProceed);
        }
        // As dependências corretas aqui são cruciais. cityPathRef.current não é uma dependência reativa.
        // A mudança em cityToMeasure (que causa re-render) e isProcessingItem controlam este efeito.
    }, [isProcessingItem, cityToMeasure, svgRef]);


    const handleStartCalculation = () => {
        if (allCitiesList.length === 0) {
            alert("Nenhuma cidade carregada para processar. Verifique os dados de entrada.");
            return;
        }
        console.log("Iniciando cálculo de BBox para todas as cidades...");
        setCalculatedCenters({}); // Reseta resultados anteriores
        setCurrentCityIndex(0);   // Começa do início
        setStartCalculation(true); // Dispara o processo
    };

    return ( // ── ── ⋙─◡◠◡◠◡◠ DOM ◡◠◡◠◡◠◡◠───➤
        <Box 
            className = "mt-20"
            style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", }}>
            
            
            <Heading mb="4">Utilitário de Pré-cálculo de Centros de Cidades</Heading>
            <Card>
                <Button
                    onClick={handleStartCalculation}
                    disabled={isProcessingItem || (startCalculation && currentCityIndex < allCitiesList.length)}
                    size="3"
                    variant="solid"
                >
                    {startCalculation && currentCityIndex < allCitiesList.length && !isProcessingItem
                        ? `Pronto para ${allCitiesList[currentCityIndex]?.name || 'próxima cidade'} (${currentCityIndex + 1}/${allCitiesList.length})`
                        : isProcessingItem && cityToMeasure
                            ? `Processando: ${cityToMeasure.name}...`
                            : "Iniciar Pré-cálculo dos Centros"}
                </Button>
                {startCalculation && !isProcessingItem && currentCityIndex >= allCitiesList.length && allCitiesList.length > 0 && (
                    <Text as="p" color="green" m="2">
                        Cálculo Concluído! O JSON com os centros foi impresso no console.
                    </Text>
                )}
            </Card>

            {isProcessingItem && cityToMeasure && (
                <Card mt="4" variant="surface">
                    <Text as="div" size="2" weight="bold">Medindo Atualmente:</Text>
                    <Text as="div" size="2">ID: {cityToMeasure.id}</Text>
                    <Text as="div" size="2">Nome: {cityToMeasure.name}</Text>
                </Card>
            )}

            <Box
                id="canvas-wrapper-calculator"
                mt="4"
                style={{
                    width: "602px", // Mantenha as dimensões do seu SVG original
                    height: "640px",
                    overflow: "hidden", // Esconde partes do path que saem do viewBox, se houver
                    border: "1px dashed c#cc",
                    position: "relative", // Importante se for querer esconder o SVG visualmente
                    // Para esconder visualmente mas manter no DOM para getBBox:
                    // opacity: 0, pointerEvents: 'none', position: 'absolute', top: '-9999px', left: '-9999px'
                }}
            >
                <svg // ou apenas <svg> se não usar animações aqui
                    id="SVGCanvasCalculator"
                    ref={svgRef}
                    viewBox="0 0 602 640" // WARN Crucial que seja o mesmo do seu mapa original
                    style={{ width: "100%", height: "100%" }}
                >
                    <g>
                        {/* Renderiza apenas o path da cidade atual para medição */}
                        {isProcessingItem && cityToMeasure && (
                            <path
                                key={cityToMeasure.id} // Força o React a recriar o elemento path
                                ref={cityPathRef}
                                d={cityToMeasure.d}
                                stroke="magenta" // Cor visível para depuração
                                strokeWidth="0.5px"
                                fill="rgba(255,0,255,0.1)" // Preenchimento leve para depuração
                            />
                        )}
                    </g>
                </svg>
            </Box>
            <Box mt="4" p="3" style={{ background: "#f9f9f9", borderRadius: "8px" }}>
                <Heading size="3" mb="2">Instruções de Uso:</Heading>
                <Text as="p" size="2">1. Abra o console do desenvolvedor do seu navegador.</Text>
                <Text as="p" size="2">2. Clique no botão "Iniciar Pré-cálculo dos Centros".</Text>
                <Text as="p" size="2">3. O utilitário irá iterar por cada cidade, renderizando seu caminho SVG e calculando o centro geométrico (BBox).</Text>
                <Text as="p" size="2">4. O progresso e quaisquer erros serão logados no console.</Text>
                <Text as="p" size="2">5. Ao final, um objeto JSON contendo os IDs, nomes e centros (x, y) de todas as cidades processadas será impresso no console.</Text>
                <Text as="p" size="2">6. Copie este objeto JSON.</Text>
                <Text as="p" size="2">7. Salve-o como um novo arquivo (ex: `city_centers.json`) na sua pasta de assets, ou use-o para atualizar seu `BahiaRegiaoMuni.json` adicionando a propriedade `center` a cada cidade.</Text>
            </Box>
        </Box>
    );
}; //  ★ ◯⫘⫘⫘⫘⫘⫘⫘⫘ MapMenuBBoxCalculator ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

export default MapMenuBBoxCalculator;