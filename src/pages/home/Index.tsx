// HERE Home
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";

import classNames from "classnames";
import {
  Box,
  Card,
  Flex,
  Avatar,
  Text,
  IconButton,
  Table,
  Badge,
  Heading,
  AlertDialog,
  Button,
  Tabs,
  ScrollArea,
  TextField,
  TextArea,
  Dialog,
  Separator,
  Strong,
  DropdownMenu,
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
  ReferenceArea,
  Label,
  Brush
} from 'recharts';

import { TooltipProps } from "recharts";
import MapMenu from "./MapMenu2";
import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";
import { VARIABLES, COLORSHEX, SCOLORS } from "../../assets/auxData";
import { mapStore, variableStore, yearStore, regionDataStore } from "../../store/mapsStore";

import CardV1 from "./CardV1";
// . . . . . . .

// 🧿 
//  WARN Xique-xique | santa teresinha | Muquém de São Francisco
// 



const Home = () => { // ★  ⋙── ── ── ── ── ── Home ── ── ── ── ── ── ── ── ──➤ 

  // ✳ [windowSize, setWindowSize]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useWindowResize((width, height) => {
    setWindowSize({ width, height });
  });

  // ✳ {region, city} 
  const { region, city } = mapStore();

  //  ✳ {year}
  const { year } = yearStore();

  //  ✳ {variable}
  const { variable } = variableStore();

  //  ✳ {regionValues}
  const { regionValues } = regionDataStore();


  type A_Item = { id: string; name: string; v: number };
  type A_Item2 = { id: string; name: string; qp: number, rm: number };
  type AgriculturalData = {
    data: A_Item[];
    percent_data: A_Item[];
    QP_RM: A_Item2[];
    var: string;
  };

  //  ✳ [topVData, setTopVData]
  const [topVData, setTopVData] = useState<AgriculturalData | null>(null);

  type DataS = {
    [key: string]: number;
    year: number;
  };

  type DataSeries = {
    data: DataS[]
    keys: { [key: string]: string };
  };

  //  ✳ [seriesVData, setSeriesVData]
  const [seriesVData, setSeriesVData] = useState<DataSeries | null>(null);
  // ── ⋙── ── ── ── ── ── ── ──➤

  const seriesKeys = seriesVData?.keys ? Object.keys(seriesVData?.keys) : [] // HERE seriesKeys

  useEffect(() => {   // HERE useEffect
    getSeriesValues()
  }, [region, city, variable])

  useEffect(() => {   // HERE useEffect
    getTopValues()
  }, [region, city, year, variable])
  // ── ⋙── ── ── ── ── ── ── ──➤

  const getSeriesValues = async () => { // {✪} getSeriesValues
    const axios = axiosPlain;
    try {
      const area = city.active === '' ? region.active : city.active //  ⊙ city
      const TYPE = city.active === '' ? "regiao" : "municipio"
      const url = "/getTopSeries/";
      const params = {
        area: area,
        variable: variable, // ⊙  variable
        type: TYPE
      };

      const response = await axios.get(url, { params }); // _PIN_ getTopSeries  ✉ 
      setSeriesVData(response.data); // ↺ setSeriesVData

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }
  } // ── ⋙── ── ── ── ── ── ── ──➤

  const getTopValues = async () => { // (✪) getTopValues
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
  }

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


  const SeriesTooltip = ({ active, payload }) => { // <●> SeriesTooltip
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);


      return (
        <Card size="2" className="bg-gray-100 opacity-90">
          <Text as="div" size="3" weight="bold">
            Ano: {payload[0].payload['year']}
          </Text>
          <Separator my="2" size="4" />


          <Flex direction="column" gap="2">
            {sortedPayload.map((item) => {

              let formattedValue = '';

              // Lógica para formatar o valor baseado na variável
              if (variable === 'valor_da_producao') {
                const finalValue = item.value * 1000;
                formattedValue = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',

                }).format(finalValue);
              } else if (
                variable === 'area_plantada_ou_destinada_a_colheita' ||
                variable === 'area_colhida'
              ) {
                formattedValue = `${item.value.toLocaleString('pt-BR')} hectares`;
              } else {
                formattedValue = item.value.toLocaleString('pt-BR');
              }

              const dataKey = item.dataKey;
              const SvgComponent = Icons[dataKey];
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


  const BarTopLabels = (props) => {  // (●) BarTopLabels
    const { x, y, width, index } = props;
    const dataName = topVData?.data[index]?.id ?? "default"; // ⊙ topVData
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;
    const { w: svgWidth, h: svgHeight } = ICON_SIZES[dataName] || { w: 30, h: 30 };
    const centerX = x + (width / 2) - (svgWidth / 2); // Position at the middle of the bar
    const centerY = y - svgHeight; // Position at the **exact top** of the bar

    return <SvgComponent x={centerX} y={centerY} />;
  }; // . . . . . . . . . . . .



  const yAxisValueFormatter = (value) => { // (●) yAxisValueFormatter

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

  const yAxisTonsFormatter = (value) => {  // (●) yAxisTonsFormatter
    const formattedNumber = new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
    return `${formattedNumber} t`; // Adiciona o sufixo "t" de toneladas
  };

  const yAxisKgHaFormatter = (value) => {
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
        className={classNames(
          "flex flex-col",
          "p-10 gap-4",
          "h-full w-full",
          "bg-white",
          "overflow-y-auto"
        )}
      >

        <Box className={classNames(
          "flex items-start",
          "gap-4",
        )}>
          <MapMenu />

          <Box className="flex flex-col flex-1 gap-4 h-full">
            <Box className="flex gap-4 h-2/5">
              <CardV1 // ✪ CardV1
              />
              <Box  // ── ⋙── ── pie ── ──➤
                id='pie'
                className={classNames('flex-1 rounded-xl overflow-hidden', glassmorphismClass)}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      // ⊙ topVData
                      data={topVData?.percent_data}
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
                      content={<PieTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
            <Box // ── ⋙── ── bar ── ──➤
              id='bar'
              className={classNames('flex flex-col items-center w-full z-0 flex-1 rounded-xl overflow-hidden p-3', glassmorphismClass)}
            >
              <Text as='div' size="4" highContrast>
                <Strong>{VARIABLES[variable]} </Strong>
              </Text>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topVData?.data} // ⊙ topVData
                  margin={{ top: 20, right: 20, left: 10, bottom: 5, }}
                >

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#000" />

                  <YAxis stroke="#000" tickFormatter={yAxisValueFormatter} /> // (○) yAxisValueFormatter


                  <Tooltip // <○> Tooltip
                    content={<BarTooltip />}
                  />

                  <Bar name='🦀' dataKey="v" fill="#8884d8" minPointSize={5}>
                    {topVData?.data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORSHEX[variable]?.[index % COLORSHEX[variable].length]} />
                    ))}

                    <LabelList // (○) BarTopLabels
                      dataKey="name"
                      content={BarTopLabels} />

                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

        </Box>


        <Box
          className={classNames(
            "flex items-start", // Organiza px e QPRM_bars lado a lado
            "gap-4",
          )}
        >

          <Box id="px" className={classNames("rounded-xl p-4 w-1/3 h-[440px]", glassmorphismClass)}>
            <Heading as="h3" size="4">Card PX</Heading>
            <Text as="p">Este é um card de exemplo para ocupar o espaço à esquerda.</Text>
          </Box>


          <Box // ── ⋙──  ── QPRM_bars ── ──➤
            id='QPRM_bars'
            className={classNames('flex-1 rounded-xl h-[440px] p-4', glassmorphismClass)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topVData?.QP_RM} // ⊙ topVData
                margin={{
                  top: 46,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />

                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#AC4D39"
                  tickFormatter={yAxisTonsFormatter} // (○) yAxisTonsFormatter
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#FFC53D"
                  tickFormatter={yAxisKgHaFormatter} // (○) yAxisKgHaFormatter
                />
                <Tooltip // {○} QMRMTootip
                  content={<QMRMTooltip />} />

                <Legend />
                <Bar name='Quantidade Produzida' yAxisId="left" dataKey="qp" fill="#AC4D39" activeBar={<Rectangle stroke="#000" />}  >
                  <LabelList
                    dataKey="name"
                    content={BarTopLabels}  // (○) BarTopLabels

                  />
                </Bar>
                <Bar name="Rendimento Médio" yAxisId="right" dataKey="rm" fill="#FFC53D" activeBar={<Rectangle stroke="#000" />} />
              </BarChart>
            </ResponsiveContainer>
          </Box>

        </Box>


        <Box // ── ⋙── ── TopSeriesBox ── ──➤
          id="topseries"
          className={classNames("flex rounded-xl w-full h-[660px] p-10", glassmorphismClass)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={seriesVData?.data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#000" />
              <YAxis
                stroke="#000"
                scale="log"
                domain={['auto', 'auto']}
                tickFormatter={yAxisValueFormatter} // (○) yAxisValueFormatter


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

                    // AQUI ESTÁ A MUDANÇA: Ponto sólido, sem borda
                    dot={{ r: 5, fill: color }}

                    // AQUI ESTÁ A MUDANÇA: Ponto ativo sólido e maior
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


      </Box >
    </>
  );

};  // ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
export default Home;

