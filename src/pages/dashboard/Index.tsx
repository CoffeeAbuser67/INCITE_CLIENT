// HERE Home
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import classNames from "classnames";
import {
  Box,
  Card,
  Flex,
  Text,
  Separator,
  Strong,
} from "@radix-ui/themes";
import { axiosPlain } from "../../utils/axios";
import handleAxiosError from "../../utils/handleAxiosError";
import { useWindowResize } from "../../hooks/useWindowResize";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  LabelList,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  TooltipProps,
  Brush
} from 'recharts';

import MapMenu from "./MapMenu2";
import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";
import { VARIABLES, COLORSHEX } from "../../assets/auxData";
import { mapStore, variableStore, yearStore } from "../../store/mapsStore";

import CardV1 from "./CardV1";
import CardVX from './CardVX';
import { ChartColumnBig, ChartColumnDecreasing, LineChart as LineChartIcon } from "lucide-react";

// . . . . . . .

// 🧿 
//  WARN Xique-xique | santa teresinha | Muquém de São Francisco
// 







interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}


interface BarLabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  index?: number;
}


type A_Item = { id: string; name: string; v: number };
type A_Item2 = { id: string; name: string; qp: number, rm: number };
type AgriculturalData = {
  data: A_Item[];
  percent_data: A_Item[];
  QP_RM: A_Item2[];
  var: string;
};


type DataS = {
  [key: string]: number;
  year: number;
};

type DataSeries = {
  data: DataS[]
  keys: { [key: string]: string };
};


const Home = () => { // ★  ⋙── ── ── ── ── ── Home ── ── ── ── ── ── ── ── ──➤ 

  // ✳ [windowSize, setWindowSize]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useWindowResize((width, height) => {
    setWindowSize({ width, height });
  });

  // ✳ {region, city} 
  const { region, city } = mapStore();

  // ✳ {year}
  const { year } = yearStore();

  // ✳ {variable}
  const { variable } = variableStore();

  // ✳ [topVData, setTopVData]
  const [topVData, setTopVData] = useState<AgriculturalData | null>(null);

  // ✳ [seriesVData, setSeriesVData]
  const [seriesVData, setSeriesVData] = useState<DataSeries | null>(null);
  // ── ⋙── ── ── ── ── ── ── ──➤

  const seriesKeys = seriesVData?.keys ? Object.keys(seriesVData?.keys) : [] // HERE seriesKeys



  const getSeriesValues = useCallback(async () => { // {✪} getSeriesValues


    const axios = axiosPlain;
    try {
      const area = city.active === '' ? region.active : city.active // ⊙ city
      const TYPE = city.active === '' ? "regiao" : "municipio"
      const url = "/getTopSeries/";
      const params = {
        area: area,
        variable: variable, // ⊙ variable
        type: TYPE
      };

      const response = await axios.get(url, { params }); // _PIN_ getTopSeries  ✉ 
      setSeriesVData(response.data); // ↺ setSeriesVData

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }


  }, [city.active, region.active, variable]);   // ── ⋙── ── ── ── ── ── ── ──➤






  const getTopValues = useCallback(async () => { // (✪) getTopValues

    const axios = axiosPlain;
    try {

      const area = city.active === '' ? region.active : city.active //  ⊙ city
      const TYPE = city.active === '' ? "regiao" : "municipio"

      const url = "/getTopValues/";
      const params = {
        year: year, // ⊙  year
        area: area,
        variable: variable, // ⊙  variable
        type: TYPE
      };

      const response = await axios.get(url, { params }); // _PIN_ getTopValues  ✉ 
      setTopVData(response.data); // ↺ setTopVData

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }

  }, [city.active, region.active, year, variable]);  // ── ⋙── ── ── ── ── ── ── ──➤





  useEffect(() => {   // HERE useEffect
    getSeriesValues()
  }, [getSeriesValues])



  useEffect(() => {   // HERE useEffect
    getTopValues()
  }, [getTopValues])
  // ── ⋙── ── ── ── ── ── ── ──➤




  const PieTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // ── ⋙── ── ── CHART AUX ── ── ── ── ──➤  
    if (active && payload && payload.length) { // <●> PieTooltip
      const { id, name, v } = payload[0].payload; // Extract id from payload

      const SvgComponent = Icons[id as keyof typeof Icons];
      if (!SvgComponent) return null;

      return (
        <Card>
          <SvgComponent />
          <span>{`${name}: ${v.toFixed(2)}%`}</span>
        </Card>
      );
    }
    return null;
  }; // . . . . . . . . . . . .

  const BarTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // <●> BarTooltip
    if (active && payload && payload.length) {
      const { name, v } = payload[0].payload;
      let formattedValue = '';

      if (variable === 'valor_da_producao') { // ⊙ variable 
        const finalValue = v * 1000;
        formattedValue = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(finalValue);
      } else if (
        variable === 'area_plantada_ou_destinada_a_colheita' ||
        variable === 'area_colhida'
      ) {
        formattedValue = `${v.toLocaleString('pt-BR')} hectares`;
      } else {
        formattedValue = v.toLocaleString('pt-BR');
      }

      return (
        <Card>
          <Text as="div"> <Strong>{`${name}`}</Strong> </Text>
          <div>{formattedValue}</div>
        </Card>
      );
    }
    return null;
  }; // . . . . . . . . . . . .





  const SeriesTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {   // <●> SeriesTooltip

    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a, b) => (b.value as number) - (a.value as number));

      return (
        <Card size="2" className="bg-gray-100 opacity-90">
          <Text as="div" size="3" weight="bold">
            Ano: {payload[0].payload['year']}
          </Text>
          <Separator my="2" size="4" />


          <Flex direction="column" gap="2">
            {sortedPayload.map((item) => {

              if (item.value === undefined || item.value === null) return null;
              let formattedValue = '';
              const numericValue = Number(item.value);
              if (variable === 'valor_da_producao') {
                const finalValue = numericValue * 1000;
                formattedValue = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',

                }).format(finalValue);
              } else if (
                variable === 'area_plantada_ou_destinada_a_colheita' ||
                variable === 'area_colhida'
              ) {
                formattedValue = `${numericValue.toLocaleString('pt-BR')} hectares`;
              } else {
                formattedValue = numericValue.toLocaleString('pt-BR');
              }

              const dataKey = item.dataKey as string;
              const SvgComponent = Icons[dataKey as keyof typeof Icons];
              const itemName = seriesVData?.keys[dataKey] || dataKey;

              // A cor da linha está aqui!
              const itemColor = item.color;

              return (
                <Flex key={dataKey} gap="3" align="center">

                  <Box style={{ // bolinha que precede o icon
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: itemColor,
                    flexShrink: 0,
                  }} />

                  {SvgComponent && <SvgComponent />}

                  <Text as="div" size="2">
                    <Strong>{itemName}:</Strong> {formattedValue}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Card>
      );
    }
    return null;
  }; // . . . . . . . . . . . .

  const QMRMTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // <●> QMRMTooltip
    if (active && payload && payload.length) {
      const { name, qp, rm } = payload[0].payload;

      return (
        <Card>
          <Text as="div"> <Strong>{`${name}`}</Strong> </Text>
          <Text size='3' as="div">
            Quantidade Produzida: <Strong>{qp.toLocaleString('pt-BR')}</Strong> Toneladas </Text>
          <Text as="div">
            Rendimento Médio: <Strong>{rm.toLocaleString('pt-BR')}</Strong> Kg/Hectares
          </Text>
        </Card>
      );
    }
    return null;
  }; // . . . . . . . . . . . .

  const CustomXAxisTick = (props: CustomTickProps) => { // {●} CustomXAxisTick
    const { x, y, payload } = props;
    const dataKey = payload.value;
    const SvgComponent = Icons[dataKey as keyof typeof Icons];
    // Se não houver um ícone para essa chave, não renderiza nada.
    if (!SvgComponent) {
      return <g />;
    }
    return (
      <g transform={`translate(${x - 15}, ${y})`}>
        <SvgComponent width={30} height={30} />
      </g>
    );
  }; // . . . . . . . . . . . .

  const BarTopLabels = (props: BarLabelProps) => {  // {●} BarTopLabels
    const { x, y, width, index } = props;

    if (x === undefined || y === undefined || width === undefined || index === undefined) {
      return null;
    }

    const numX = typeof x === 'string' ? parseFloat(x) : x;
    const numY = typeof y === 'string' ? parseFloat(y) : y;
    const numWidth = typeof width === 'string' ? parseFloat(width) : width;

    const dataName = topVData?.data[index]?.id ?? "default";
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;

    const { w: svgWidth, h: svgHeight } = ICON_SIZES[dataName] || { w: 30, h: 30 };
    const centerX = numX + (numWidth / 2) - (svgWidth / 2);
    const centerY = numY - svgHeight;

    return <SvgComponent x={centerX} y={centerY} />;

  }; // . . . . . . . . . . . .

  const yAxisValueFormatter = (value: number) => { // (●) yAxisValueFormatter

    if (variable === 'valor_da_producao') {
      const finalValue = value * 1000;
      return new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        compactDisplay: 'short',
        style: 'currency',
        currency: 'BRL',
      }).format(finalValue);
    }


    if (
      variable === 'area_plantada_ou_destinada_a_colheita' ||
      variable === 'area_colhida'
    ) {
      const formattedNumber = new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
      // Adiciona o sufixo 'ha' para hectares
      return `${formattedNumber} ha`;
    }
    // Caso Padrão: Se for qualquer outra variável no futuro
    return new Intl.NumberFormat('pt-BR').format(value);

  };

  const yAxisTonsFormatter = (value: number) => {  // (●) yAxisTonsFormatter
    const formattedNumber = new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
    return `${formattedNumber} t`; // Adiciona o sufixo "t" de toneladas
  };

  const yAxisKgHaFormatter = (value: number) => {
    const formattedNumber = new Intl.NumberFormat('pt-BR', {  // (●) yAxisKgHaFormatter
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
    return `${formattedNumber} kg/ha`; // Adiciona o sufixo "kg/ha"
  };

  // . . . . . . . . . . . .

  // [●] glassmorphismClass
  const glassmorphismClass = 'bg-white/10 backdrop-blur-xl  shadow-lg';

  //  const glassmorphismClass = 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg';

  // const glassmorphismClass = 'bg-slate-800/40 backdrop-blur-lg border border-slate-500/30 shadow-lg';

  // const glassmorphismClass = 'bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg';

  // [●] isMobile
  const isMobile = windowSize.width > 0 && windowSize.width < 768;

  // [●] lineColors
  const lineColors = ["#D58A9E", "#8C8CC3", "#D29E64", "#81BFE8", "#8CE78A", "#B5B5B5", "#B7AFFF", "#B59FE0"];
  // . . . . . . . . . . . .

  return (// ── ◯⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘ DOM ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘➤
    <>
      {/* <p // windowSize ↯
        className="fixed right-10 top-30 text-xl text-slate-950 z-50"
      >
        🦀{` wdith: ${windowSize.width}`} <br />
        🦀{` height: ${windowSize.height}`}
      </p> */}


      <Box
        className="flex flex-col h-full w-full bg-white overflow-y-auto gap-4 md:gap-8 p-4 md:p-6 pt-4 md:pt-6 lg:pt-8"
      >
        <Box className="flex flex-col items-stretch xl:flex-row xl:items-stretch gap-4 md:gap-8 p-0 md:p-4">

          <div className="w-full xl:w-auto">
            <MapMenu />
          </div>

          <Box className="flex flex-col flex-1 gap-4 md:gap-8">

            <Box className="flex flex-col items-stretch xl:flex-row gap-4 md:gap-8 xl:gap-4">
              <CardV1 // . . . CardV1
              />
              <Box id='pie' className={classNames('w-full xl:flex-1 h-[400px] xl:h-auto rounded-xl', glassmorphismClass)}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>


                    <Pie
                      data={topVData?.percent_data} // ⊙ topVData
                      cx="50%"
                      cy="50%"
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      outerRadius="80%"
                      fill="#000"
                      dataKey="v"
                    >
                      {topVData?.percent_data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORSHEX[variable]?.[index % COLORSHEX[variable].length]} />
                      ))}
                    </Pie>
                    <Tooltip // <○> PieTooltip
                      content={<PieTooltip />} />


                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>


            <Box //. . . bar
              id='bar'
              className={classNames('flex flex-col items-center w-full z-0 rounded-xl xl:flex-1', glassmorphismClass)}
            >
              <Flex justify='center' gap="2" align="center" className="flex-shrink-0 mt-4">
                <ChartColumnDecreasing size={20} />
                <Text weight="bold" size="4"> <Strong>{VARIABLES[variable]}</Strong></Text>
              </Flex>

              <div className="w-full relative h-[350px] lg:h-[400px] xl:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topVData?.data}
                    margin={{ top: 46, right: isMobile ? 0 : 20, left: isMobile ? 0 : 30, bottom: 5, }}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" tickFormatter={() => ''} />


                    <YAxis stroke="#000" tickFormatter={yAxisValueFormatter} width={isMobile ? 0 : 80} />// (○) yAxisValueFormatter

                    <Tooltip // <○> Tooltip
                      content={<BarTooltip />}
                    />

                    <Bar name='🦀' dataKey="v" fill="#8884d8" minPointSize={5}>
                      {topVData?.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORSHEX[variable]?.[index % COLORSHEX[variable].length]} />
                      ))}

                      <LabelList // {○} BarTopLabels
                        dataKey="name"
                        content={BarTopLabels} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Box>
          </Box>
        </Box>


        <div className="w-full overflow-x-auto">

          <Box className="flex flex-col lg:flex-row items-stretch gap-4 md:gap-8 lg:gap-4">

            <CardVX // ── ⋙── ── ── ── ── ── ── ──➤ // ✪ CardVX 
            />

            <Box // ── ⋙──  ── QPRM_bars ── ──➤
              id='QPRM_bars'
              className={classNames('flex flex-col w-full rounded-xl mb-4 p-4', glassmorphismClass)}
            >

              <Flex justify='center' gap="2" align="center" className="flex-shrink-0">
                <ChartColumnBig size={20} />
                <Text weight="bold" size="4"> <Strong>Produção e Rendimento</Strong></Text>
              </Flex>


              <div className="w-full relative h-[350px] lg:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topVData?.QP_RM} // ⊙ topVData
                    margin={{
                      top: 15,
                      right: isMobile ? 0 : 25,
                      left: isMobile ? 0 : 20,
                      bottom: 22,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* <XAxis dataKey="name" />*/}

                    <XAxis
                      dataKey="id"
                      tick={CustomXAxisTick} // {○} CustomXAxisTick
                      axisLine={{ stroke: '#ccc' }}
                      tickLine={false}
                      height={60}
                      interval={0}
                    />

                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#AC4D39"
                      tickFormatter={yAxisTonsFormatter} // (○) yAxisTonsFormatter
                      width={isMobile ? 0 : 60}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#FFC53D"
                      tickFormatter={yAxisKgHaFormatter} // (○) yAxisKgHaFormatter
                      width={isMobile ? 0 : 60}
                    />

                    <Tooltip // <○> QMRMTootip
                      content={<QMRMTooltip />} />

                    <Legend />

                    <Bar name='Quantidade Produzida' yAxisId="left" dataKey="qp" fill="#AC4D39" activeBar={<Rectangle stroke="#000" />} />

                    <Bar name="Rendimento Médio" yAxisId="right" dataKey="rm" fill="#FFC53D" activeBar={<Rectangle stroke="#000" />} />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            </Box>
          </Box>

        </div>


        <div className="w-full overflow-x-auto">

          <Box // ── ⋙── ── TopSeriesBox ── ──➤
            id="topseries"
            className={classNames("flex flex-col rounded-xl w-full h-[450px] lg:h-[660px] p-4 lg:p-6", glassmorphismClass)}
          >

            <Flex justify='center' gap="2" align="center">
              <LineChartIcon size={20} />
              <Text weight="bold" size="4"> <Strong>Séries Históricas</Strong></Text>
            </Flex>


            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={seriesVData?.data}
                margin={{ top: 20, right: isMobile ? 5 : 20, left: isMobile ? 6 : 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#000" />

                <YAxis
                  stroke="#000"
                  scale="log"
                  domain={['auto', 'auto']}
                  tickFormatter={yAxisValueFormatter}// (○) yAxisValueFormatter
                  width={isMobile ? 0 : 80}
                />


                <Tooltip
                  content={<SeriesTooltip />}
                  cursor={{ stroke: 'red', strokeWidth: 2, strokeDasharray: '3 3' }}
                />

                <Legend />

                {seriesKeys.map((key, index) => {
                  const color = lineColors[index % lineColors.length];
                  const itemName = seriesVData?.keys[key] || key;

                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={itemName}
                      stroke={color}
                      strokeWidth={2}

                      dot={{ r: 5, fill: color }}
                      activeDot={{ r: 8, fill: color, stroke: color }}
                    />
                  );
                })}

                <Brush
                  dataKey="year"
                  height={30}
                  stroke="#8884d8"
                  travellerWidth={10}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </div>
      </Box >
    </>
  );

};  // ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
export default Home;
























