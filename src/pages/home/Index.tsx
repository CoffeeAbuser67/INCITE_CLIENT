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
  Label
} from 'recharts';

import { TooltipProps, LegendProps } from "recharts";
import MapMenu from "./MapMenu";
import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";
// . . . . . . .
//  ● D
const D = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
//  {●} VARIABLES
const VARIABLES = {
  'area_plantada_ou_destinada_a_colheita': 'Área plantada ou destinada a colheita',
  'area_colhida': 'Área colhida',
  'valor_da_producao': 'Valor da produção',
}

//  {●} YEARS
const YEARS = Array.from({ length: 2024 - 2000 }, (_, i) => 2000 + i);

//  [●] COLORS 
const COLORS = { 
  area_plantada_ou_destinada_a_colheita: ["#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#eef2ff", "#f5f7ff"],
  area_colhida: ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffe5cc", "#ffedd5", "#fff7ed"],
  valor_da_producao: ["#171717", "#262626", "#404040", "#525252", "#737373", "#a3a3a3", "#d4d4d4", "#e5e5e5", "#f5f5f5", "#fafafa", "#fcfcfc"],
}

// indigo = ["#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#eef2ff", "#f5f7ff"]

// orange = ["#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffe5cc", "#ffedd5", "#fff7ed"]
// color_palettes = {
//   "blue": ["#002359", "#013875", "#024c7e", "#036290", "#0578b7", "#0891cf", "#36b5e0", "#65c7ec", "#96d2f1", "#c3e0f9", "#ebf5ff"],
//   "green": ["#053c2a", "#064e3b", "#065f46", "#047857", "#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5", "#f0fdf4"],
//   "yellow": ["#5d2e0f", "#713f12", "#854d0e", "#a16207", "#ca8a04", "#eab308", "#facc15", "#fde047", "#fef08a", "#fef9c3", "#fefce8"],
//   "purple": ["#4c1d95", "#5b21b6", "#6d28d9", "#7c3aed", "#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff", "#faf5ff"]
//    "neutral" : ["#171717", "#262626", "#404040", "#525252", "#737373", "#a3a3a3", "#d4d4d4", "#e5e5e5", "#f5f5f5", "#fafafa", "#fcfcfc"]

// }


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

  //  ✳ [variableS, setVariableS]
  const [variableS, setVariableS] = useState<keyof typeof VARIABLES>('valor_da_producao');


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


  type SeriesData = {
    [key: string]: number;
    year: number;
  };

  //  ✳ [seriesVData, setSeriesVData]
  const [seriesVData, setSeriesVData] = useState<SeriesData | null>(null);


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
      const { id, name, v } = payload[0].payload; // Extract id from payload

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
      const { id, name, qp, rm } = payload[0].payload; // Extract id from payload

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
    const { cx, cy, stroke, payload, value } = props;

    return (
      <svg
        width={20}
        height={20}
        viewBox="0 0 150 150"
        x={cx - 10}
        y={cy - 12}
      >
        <path
          d="M77.81 50.35S84.1 20.61 71.77 9"
          style={{
            stroke: "#000",
            strokeWidth: 4,
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />

        <circle
          cx={71.77}
          cy={94.09}
          r={50.79}
          style={{
            strokeMiterlimit: 10,
            fill: "#ffa300",
            stroke: "#000",
            strokeWidth: 4,
          }}
        />

        <path
          d="M50.76 84.82a12.69 12.69 0 1 1 12.69-12.69 12.7 12.7 0 0 1-12.69 12.69Z"
          style={{
            fill: "#fff",
          }}
        />

        <path
          d="M81.58 30c-2.23-18.52 26.61-32.34 46-20.54-17.22 14.86-20.27 33.96-46 20.54Z"
          style={{
            fill: "#49af20",
            strokeMiterlimit: 10,
            stroke: "#000",
            strokeWidth: 4,
          }}
        />
      </svg>
    );
  }; 

  return (// ── ⋙DOM── ── ── ── ── ── ── ──⫸
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
        variant="soft">
        <Text >🦀</Text>
      </Button>

      <Box
        id='MC' //_PIN_ MC⊛×⁕◉▣ 
        className='flex flex-col justify-start items-center gap-10'>

        <Box // ── ⋙── ── MapMenu ── ── ──➤
        // <○> MapMenu 
        >
          <MapMenu />
        </Box>

        <Box //── ⋙── ── ── TopValuesBox ── ── ── ──➤
          id='TopValuesBox'
          className='flex gap-8 rounded-xl h-[440px] w-full'
        >
          <Card
            // . . . . . . . . . . . .pie
            id='pie'
            variant="ghost"
            className='flex z10 bg-neutral-400 overflow-visible'
          >

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

          </Card>

          <Card
            // . . . . . . . . . . . .bar
            id='bar'
            variant="ghost"
            className='flex flex-col items-center gap-0 w-full h-[460px] z-0 bg-emerald-700 '
          >
            <Box
              //HERE DropDownComponent
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
              // . . . 
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

            <BarLegend /> {/* //(○) BarLegend */}
          </Card>

        </Box>

        <Box // ── ⋙── ── ── QPRM_bars ── ── ── ──➤
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

        <Box // ── ⋙── ── TopSeriesBox ── ── ──➤
          id='TopSeriesBox' //HERE TopSeriesBox
          className=' rounded-xl bg-purple-950 bg-opacity-20 h-[420px]'
        >

          🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀
          🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀

          <ResponsiveContainer
            width="100%"
            height="100%">
            <LineChart // ○ LineChart
              width={500}
              height={300}
              data={D} // ○ D
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Legend />

              <Line type="monotone"
                dataKey="pv"
                stroke="#000"
                dot={<CustomizedDot />}
              // ○ CustomizedDot
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

        </Box>

      </Box >

    </>
  );
};  // ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
export default Home;

