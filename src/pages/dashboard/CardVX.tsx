
import classNames from 'classnames';
import { Box, Flex, Heading, Separator, Strong, Text } from "@radix-ui/themes";
import { BarChart, LineChart, ChartColumnBig, ChartColumnDecreasing } from 'lucide-react';
import { mapStore, yearStore, variableStore } from "../../store/mapsStore";
import { VARIABLES } from '../../assets/auxData';



const CardVX = () => {
    const glassmorphismClass = 'bg-black/10 backdrop-blur-xl shadow-lg';

    const { region, city } = mapStore();
    const { year } = yearStore();
    const { variable } = variableStore();

    const locationName = city.name || region.name || "Bahia";
    const prettyVariableName = VARIABLES[variable].toLowerCase() || "Dados";
    const seriesUnitText = variable === 'valor_da_producao' ? "em Reais (R$)" : "em Hectares (ha)";

    return (
        <Box id="px" className={classNames("rounded-xl p-4 w-full lg:w-1/3", glassmorphismClass)}>

            <Flex direction="column" gap="3">
                <Heading as="h3" mb='3' size="5">Análise da produção agrícola </Heading>


                <Flex direction="column" gap="2">

                    <Flex gap="2" align="center">
                        <ChartColumnDecreasing size={18} />
                        <Text weight="bold" size="3">Ordenação dos produtos mais relevantes</Text>
                    </Flex>


                    <Text size="2" color="gray">
                        Para <Strong>"{locationName}"</Strong>, explore, em ordem decrescente, os produtos agrícolas  com maior <Strong>{prettyVariableName}</Strong>, {seriesUnitText}, no ano de <Strong>{year}</Strong>.
                    </Text>

                </Flex>


                <Separator my="1" size="4" />


                <Flex direction="column" gap="2">

                    <Flex gap="2" align="center">
                        <ChartColumnBig size={18} />
                        <Text weight="bold" size="3">Análise de Produção e Rendimento</Text>
                    </Flex>


                    <Text size="2" color="gray">
                        Para <Strong>"{locationName}"</Strong>, explore a <Strong>quantidade produzida</Strong> (em toneladas) e o <Strong>rendimento médio</Strong> (em Kg/ha) dos principais produtos agrícolas no ano de <Strong>{year}</Strong>.
                    </Text>

                </Flex>


                <Separator my="1" size="4" />


                <Flex direction="column" gap="2">
                    <Flex gap="2" align="center">
                        <LineChart size={18} />
                        <Text weight="bold" size="3">Séries Históricas</Text>
                    </Flex>

                    <Text size="2" color="gray">
                        Acompanhe a evolução do indicador <Strong>"{prettyVariableName}"</Strong>, {seriesUnitText}, dos produtos agrícolas com maior média histórica desde o ano 2000.
                    </Text>
                </Flex>









            </Flex>
        </Box>
    );
};

export default CardVX;