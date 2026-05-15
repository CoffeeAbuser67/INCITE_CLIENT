import classNames from 'classnames';
import { Box, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { mapStore, yearStore, variableStore } from "../../store/mapsStore";
import { regionDataStore } from '../../store/mapsStore';


// 🧿
const CardV1 = () => {
    const glassmorphismClass = 'bg-black/10 backdrop-blur-xl  shadow-lg';

    const { region, city } = mapStore();
    const { year } = yearStore();
    const { variable } = variableStore();
    const { regionValues } = regionDataStore();

    const locationName = city.name || region.name || "Bahia";
    const locationTarget = city.active || region.active || 'bahia';

    const totalValue = regionValues[locationTarget] || 0;

    // ================== LÓGICA DE FORMATAÇÃO ==================
    let formattedTotal = '';
    if (variable === 'valor_da_producao') {
        const finalValue = totalValue * 1000;
        formattedTotal = new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', notation: "compact", maximumFractionDigits: 1, compactDisplay: "long"
        }).format(finalValue);
    } else if (
        variable === 'area_plantada_ou_destinada_a_colheita' ||
        variable === 'area_colhida'
    ) {
        formattedTotal = `${new Intl.NumberFormat('pt-BR', {
            notation: 'compact', compactDisplay: 'long'
        }).format(totalValue)} de hectares`;
    } else {
        formattedTotal = totalValue.toLocaleString('pt-BR');
    }


    return ( // ── ◯─◡◠◡◠◡◠◡ DOM ◠◡◠◡◠◡◠─➤
        <Box id="p1"
            className={classNames(
                "w-full max-w-2xl flex-1 lg:flex-1 rounded-xl p-4 h-[350px] lg:h-auto",
                glassmorphismClass
            )}
        >
            <Flex direction="column" justify="center" align="center" height="100%">

                <Text size="5" weight="light">Total para</Text>
                <Heading as="h2" size="8" highContrast>
                    {locationName}
                </Heading>
                <Separator my="3" size="4" />

                <Text size="7" weight="bold" color="indigo">
                    {formattedTotal}
                </Text>
                <Text size="4" weight="light">
                    em {year}
                </Text>
            </Flex>
            
        </Box>
    );
};

export default CardV1;