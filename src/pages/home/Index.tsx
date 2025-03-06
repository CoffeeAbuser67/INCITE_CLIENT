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
import { axiosDefault } from "../../services/axios";
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
import MapMenu from "./MapMenu";
import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";

import { VARIABLES, YEARS, COLORS } from "../../assets/auxData";
// . . . . . . .


const Home = () => { // ★  ⋙── ── ── ── ── ── Home ── ── ── ── ── ── ── ── ──➤ 

  // ✳ [windowSize, setWindowSize]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useWindowResize((width, height) => {
    setWindowSize({ width, height });
  });

  //  ✳ [year, setYear]
  const [year, setYear] = useState<number>(2023);


  //  ✳ [variable, setVariable]
  const [variable, setVariable] = useState<keyof typeof VARIABLES>('valor_da_producao');


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
    keys: string[];
  };

  //  ✳ [seriesVData, setSeriesVData]
  const [seriesVData, setSeriesVData] = useState<DataSeries | null>(null);


  // variables = [
  //   'area plantada',
  //   'area plantada percentual total',

  //   'area colhida',
  //   'area colhida percentual total',

  //   'valor da producao',
  //   'valor da producao percentual total',

  //   'quantidade produzida',
  //   'rendimento medio',
  // ]
  // ── ⋙── ── ── ── ── ── ── ──➤

  useEffect(() => {   // HERE useEffect
    getTopValues()
  }, [year, variable])
  // ── ⋙── ── ── ── ── ── ── ──➤

  const getTopValues = async () => { // (✪) getTopValues
    const axios = axiosDefault;
    try {

      const url = "/getTopValues/";
      const params = {
        year: year,
        area: 'bahia',
        variable: variable,
        type: 'regiao'
      };

      const response = await axios.get(url, { params }); // _PIN_ getTopValues  ✉ 
      setTopVData(response.data); // ↺ setTopVData
      console.log(response.data); // [LOG] topVData

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }
  } // ── ⋙── ── ── ── ── ── ── ──➤

  const getSeriesValues = async () => { // {✪} getSeriesValues
    const axios = axiosDefault;
    try {

      const url = "/getTopSeries/";
      const params = {
        area: 'bahia',
        variable: variable,
        type: 'regiao'
      };

      const response = await axios.get(url, { params }); // _PIN_ getTopSeries  ✉ 
      setSeriesVData(response.data); // ↺ setSeriesVData
      console.log(response.data); // [LOG] seriesVData

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }
  } // ── ⋙── ── ── ── ── ── ── ──➤

  const PieTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {   // <●> PieTooltip
    if (active && payload && payload.length) {
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

  const BarTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // (●) BarTooltip
    if (active && payload && payload.length) {
      const { name, v } = payload[0].payload; // Extract id from payload
      return (
        <Card>
          <Text as="div"> <Strong>{`${name}`}</Strong> </Text>
          <div>{`${v.toLocaleString('de-DE')} R$`}</div>
        </Card>
      );
    }
    return null;
  };

  const BarTopLabels = (props) => {  // (●) BarTopLabels
    const { x, y, width, index } = props;
    const dataName = topVData?.data[index]?.id ?? "default"; // ⊙ topVData
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;
    const { w: svgWidth, h: svgHeight } = ICON_SIZES[dataName] || { w: 30, h: 30 };
    const centerX = x + (width / 2) - (svgWidth / 2); // Position at the middle of the bar
    const centerY = y - svgHeight; // Position at the **exact top** of the bar

    return <SvgComponent x={centerX} y={centerY} />;
  }; // . . .


  const BarLegend = () => { // (●) BarLegend
    return <Text as='div' size="4" highContrast> <Strong>{VARIABLES[variable]} </Strong></Text>;
  };// . . . . . . . . . . . .

  const QMRMTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // {●} QMRMTooltip
    if (active && payload && payload.length) {
      const { id, name, qp, rm } = payload[0].payload;

      return (
        <Card>
          <Text as="div"> <Strong>{`${name}`}</Strong> </Text>
          <Text size='3' as="div"> Quantidade Produzida: <Strong>{qp.toLocaleString('de-DE')}</Strong> Toneladas* </Text>
          <Text as="div"> Rendimento Médio: <Strong>{rm.toLocaleString('de-DE')}</Strong> Kg/Hectares </Text>
        </Card>
      );
    }
    return null;
  }; // . . . . . . . . . . . .


  const CustomizedDot = (props) => { // ● CustomizedDot
    const { cx, cy, datakey } = props;
    const SvgComponent = Icons[datakey as keyof typeof Icons];

    if (!SvgComponent) return null;

    return (
      <g transform={`translate(${cx - 15}, ${cy - 15})`}>
        <circle cx="15" cy="15" r="18" fill="gray" stroke="black" strokeWidth="2" />
        <defs>
          <clipPath id={`clip-${datakey}`}>
            <circle cx="15" cy="15" r="15" />
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-${datakey})`}>
          <SvgComponent />
        </g>
      </g>
    );
  };

  const SeriesTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // ● SeriesTooltip
    if (active && payload && payload.length) {
      console.log('payload : ', payload[0].payload) // [LOG] payload
      // return (
      //   <Card>
      //     <Text as="div"> <Strong>{`${name}`}</Strong> </Text>
      //     <div>{`${v.toLocaleString('de-DE')} R$`}</div>
      //   </Card>
      // );

      return (
        <Card>
          S
        </Card>
      );

    }
    return null;
  };


  return (// ── ⋙DOM── ── ── ── ── ── ── ── ── ── ──⫸
    <>
      <p
        // HERE windowSize ↯
        className="fixed right-10 top-30 text-xl text-slate-950"
      >
        🦀{` wdith: ${windowSize.width}`} <br />
        🦀{` height: ${windowSize.height}`}
      </p>

      <Button
        // . . .
        id="AuxButton"// HERE AuxButton
        onClick={getSeriesValues} // {○} getSeriesValues
        size="3"
        variant="soft"
        className="fixed"
      >
        <Text >🦀</Text>
      </Button>


      <div className="relative mb-20">
        {/* WARN fallback NONE */}
        {/* [MEDIA] output_half */}
        <video autoPlay loop muted playsInline className="w-full h-auto">
          <source src="/output_half.mp4" type="video/mp4" />
        </video>

        <Box className={classNames(
          'absolute flex flex-col items-center text-white',
          "left-1/2 -translate-x-1/2",
          'rounded-t-lg bottom-0 ',
          "bg-gradient-to-b from-white/0 to-white/100 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-100",
          'p-14'
        )}>

          <Heading weight="bold" size="9" highContrast>
            INCITE
          </Heading>

          <div className="mt-4" >
            <Heading size="8" highContrast>
              AGRICULTURA FAMILIAR
            </Heading>
          </div>

          <div className="mt-4">
            <Heading size="8" highContrast>
              DIVERSIFICADA E SUSTENTÁVEL
            </Heading>
          </div>

        </Box>
      </div>









      <Box
        // . . . . .
        id='MC' //_PIN_⋙── ── ──  MC⊛×⁕◉▣  ── ── ── ──➤
        className='flex flex-col justify-start items-center gap-10 px-10'>

        <Box // ── ⋙── ── MapMenu ── ── ──➤
          // <○> MapMenu 
          className="w-full"
        >
          <MapMenu />
        </Box>

        <Box //── ⋙── ── TopValuesBox ── ──➤
          id='TopValuesBox'
          className='flex gap-8 rounded-xl h-[440px] w-full'
        >
          <Card
            // . . . . . . . . . . . .pie
            id='pie'
            variant="ghost"
            className='flex z10 bg-neutral-400 overflow-visible w-2/5 h-[460px]'
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={420} height={420}>
                <Pie
                  data={topVData?.percent_data} // ⊙ topVData
                  cy={210}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#000"
                  dataKey="v"
                >
                  {topVData?.percent_data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[variable][index % COLORS[variable].length]} />
                  ))}
                </Pie>
                <Tooltip
                  // <○> PieTooltip
                  content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card
            id='bar'
            variant="ghost"
            className='flex flex-col items-center gap-0 w-full h-[460px] z-0 bg-emerald-700 '
          >
            <Box
              // . . . . . . . . . . . . DropDown
              id="DropDownComponent"
              className="flex justify-end gap-6 mt-2 w-full mr-[30px]"
            >
              <DropdownMenu.Root
              // ⊙  DropdownMenu Year
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

              <DropdownMenu.Root
              // ⊙  DropdownMenu Variable
              >
                <DropdownMenu.Trigger>
                  <Button color="gray" variant="solid" highContrast>
                    {variable ? VARIABLES[variable] : "Variável medida"}
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>


                <DropdownMenu.Content color="gray" variant="soft" highContrast>
                  <DropdownMenu.Item onSelect={() => setVariable("valor_da_producao")} shortcut="R$">
                    Valor da produção
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item onSelect={() => setVariable("area_plantada_ou_destinada_a_colheita")} shortcut="▣">
                    Área plantada ou destinada a colheita
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setVariable("area_colhida")} shortcut="▢">
                    Área colhida
                  </DropdownMenu.Item>
                </DropdownMenu.Content>

              </DropdownMenu.Root>
            </Box >

            <ResponsiveContainer
              // . . . . . . . . . . . .bar
              width="100%" height="100%">
              <BarChart
                width={700}
                height={440}
                data={topVData?.data} // ⊙ topVData
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip
                  // (○) BarTooltip
                  content={<BarTooltip />} />

                <Bar name='🦀' dataKey="v" fill="#8884d8" minPointSize={5}>
                  {topVData?.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[variable][index % COLORS[variable].length]} />
                  ))}

                  <LabelList
                    dataKey="name"
                    content={BarTopLabels}  // (○) BarTopLabels
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <BarLegend />   {/* //(○) BarLegend */}
          </Card>
        </Box>

        <Box // ── ⋙──  ── QPRM_bars ── ──➤
          id='QPRM_bars'
          className='flex gap-8 rounded-xl h-[440px] w-full'
        >
          <Card
            variant="ghost"
            className="w-full h-full bg-neutral-50/80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
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
                <YAxis yAxisId="left" orientation="left" stroke="#AC4D39" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFC53D" />
                <Tooltip
                  // {○} QMRMTooltip
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
          </Card>
        </Box>


        <Box
          // ── ⋙── ── TopSeriesBox ── ──➤
          id='TopSeriesBox'
          className='rounded-xl bg-neutral-50/80 bg-opacity-20 w-full h-[700px] p-10'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={700}
              height={500}
              data={seriesVData?.data} // ⊙ seriesVData
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke="#000" />
              <YAxis stroke="#000" scale="log"
                domain={['auto', 'auto']}
              />

              <Tooltip content={SeriesTooltip} />

              {seriesVData?.keys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke="#000"
                  // ○ CustomizedDot
                  dot={<CustomizedDot datakey={key} />} />
              ))}

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

