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
  ResponsiveContainer
} from 'recharts';
import { TooltipProps } from "recharts";

import MapMenu from "./MapMenu";
import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";
// ── ⋙── ── ── ── ── ── ── ──➤


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

// . . . . . . .


//  ● TESTDATA
const TESTDATA = [
  { name: "Uva", id: "uva", v: Math.floor(Math.random() * 5000) },
  { name: "Tangerina", id: "tangerina", v: Math.floor(Math.random() * 5000) },
  { name: "Pêssego", id: "pessego", v: Math.floor(Math.random() * 5000) },
  { name: "Pera", id: "pera", v: Math.floor(Math.random() * 5000) },
  { name: "Noz", id: "noz_fruto_seco", v: Math.floor(Math.random() * 5000) },
  { name: "Melão", id: "melao", v: Math.floor(Math.random() * 5000) },
  { name: "Melancia", id: "melancia", v: Math.floor(Math.random() * 5000) },
  { name: "Marmelo", id: "marmelo", v: Math.floor(Math.random() * 5000) },
  { name: "Maracujá", id: "maracuja", v: Math.floor(Math.random() * 5000) },
  { name: "Manga", id: "manga", v: Math.floor(Math.random() * 5000) },
  { name: "Mamão", id: "mamao", v: Math.floor(Math.random() * 5000) },
  { name: "Maçã", id: "maca", v: Math.floor(Math.random() * 5000) },
  { name: "Limão", id: "limao", v: Math.floor(Math.random() * 5000) },
  { name: "Laranja", id: "laranja", v: Math.floor(Math.random() * 5000) },
  { name: "Goiaba", id: "goiaba", v: Math.floor(Math.random() * 5000) },
  { name: "Figo", id: "figo", v: Math.floor(Math.random() * 5000) },
  { name: "Caqui", id: "caqui", v: Math.floor(Math.random() * 5000) },
  { name: "Caju", id: "caju", v: Math.floor(Math.random() * 5000) },
  { name: "Banana (cacho)", id: "banana_cacho", v: Math.floor(Math.random() * 5000) },
  { name: "Açaí", id: "acai", v: Math.floor(Math.random() * 5000) },
  { name: "Abacaxi", id: "abacaxi", v: Math.floor(Math.random() * 5000) },
  { name: "Abacate", id: "abacate", v: Math.floor(Math.random() * 5000) },
];


//  ● TESTDATA2
const TESTDATA2 = [
  { name: "Algodão Arbóreo em Caroço", id: "algodao_arboreo_em_caroco", v: Math.floor(Math.random() * 5000) },
  { name: "Algodão Herbáceo em Caroço", id: "algodao_herbaceo_em_caroco", v: Math.floor(Math.random() * 5000) },
  { name: "Amendoim em Casca", id: "amendoim_em_casca", v: Math.floor(Math.random() * 5000) },
  { name: "Arroz em Casca", id: "arroz_em_casca", v: Math.floor(Math.random() * 5000) },
  { name: "Aveia em Grão", id: "aveia_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Centeio em Grão", id: "centeio_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Cevada em Grão", id: "cevada_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Ervilha em Grão", id: "ervilha_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Fava em Grão", id: "fava_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Feijão em Grão", id: "feijao_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Girassol em Grão", id: "girassol_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Linhaça (Semente de Linho)", id: "linho_semente", v: Math.floor(Math.random() * 5000) },
  { name: "Milho em Grão", id: "milho_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Soja em Grão", id: "soja_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Sorgo em Grão", id: "sorgo_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Trigo em Grão", id: "trigo_em_grao", v: Math.floor(Math.random() * 5000) },
  { name: "Triticale em Grão", id: "triticale_em_grao", v: Math.floor(Math.random() * 5000) },
];


const pieData = [ // ● pieData
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;


const Home = () => { // ★  ⋙── ── ── ── ── ── Home ── ── ── ── ── ── ── ── ──➤

  // ✳ [windowSize, setWindowSize]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useWindowResize((width, height) => {
    setWindowSize({ width, height });
  });

  //  ✳ [year, setYear]
  const [year, setYear] = useState<number | null>(null);

  //  ✳ [variable, setVariable]
  const [variable, setVariable] = useState<keyof typeof VARIABLES | undefined>(undefined);


  type DataItem = { id: string; name: string; v: number };

  type AgriculturalData = {
    data: DataItem[];
    percent_data: DataItem[];
    quantidade_produzida: DataItem[];
    rendimento_medio_da_producao: DataItem[];
    var: string;
  };

  //  ✳ [topVData, setTopVData]
  const [topVData, setTopVData] = useState<AgriculturalData | null>(null);

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

  useEffect(() => {
    getTopValues()
  }, [year, variable])

  const getTopValues = async () => { // (✪) getTopValues
    const axios = axiosDefault;
    try {

      const url = "/getTopValues/";
      const params = {
        year: 2023,
        area: 'bahia',
        variable: 'area_colhida',
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






  // (●) CustomTooltip
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { id, name, v } = payload[0].payload; // Extract id from payload

      const SvgComponent = Icons[id as keyof typeof Icons];
      if (!SvgComponent) return null;

      return (
        <Card>
          <SvgComponent />
          <span>{`${name}: ${v.toFixed(2)}`}</span>
        </Card>
      );
    }
    return null;
  }; // . . .


  const topValuesLabels = (props) => {  // {●} topValuesLabels
    const { x, y, width, index } = props;
    const dataName = topVData?.data[index]?.id ?? "default"; // ⊙ topVData
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;
    const svgWidth = ICON_SIZES[dataName] || 30;
    const centerX = x + (width / 2) - (svgWidth / 2);
    return <SvgComponent x={centerX} y={y - 10} />;
  };// . . . 


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
  }; // . . . 

  // const pieLabel = ({ 
  //   cx,
  //   cy,
  //   midAngle,
  //   innerRadius,
  //   outerRadius,
  //   percent,
  //   index
  // }: any) => {

  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);


  //   return (
  //     <text
  //       x={x}
  //       y={y}
  //       fill="white"
  //       textAnchor={x > cx ? "start" : "end"}
  //       dominantBaseline="central"
  //     >
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // }; 


  const renderCustomizedLabel = (props) => {  // ● renderCustomizedLabel
    const { x, y, width, index } = props;
    const dataName = TESTDATA[index]?.id ?? "default";// ○ TESTDATA
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;
    const svgWidth = ICON_SIZES[dataName] || 30;
    const centerX = x + (width / 2) - (svgWidth / 2);
    return <SvgComponent x={centerX} y={y - 10} />;
  };// . . . 

  const renderCustomizedLabel2 = (props) => {  // ● renderCustomizedLabel2
    const { x, y, width, index } = props;
    const dataName = TESTDATA2[index]?.id ?? "default"; // ○ TESTDATA2
    const SvgComponent = Icons[dataName as keyof typeof Icons];
    if (!SvgComponent) return null;
    const svgWidth = ICON_SIZES[dataName] || 30;
    const centerX = x + (width / 2) - (svgWidth / 2);
    return <SvgComponent x={centerX} y={y - 10} />;
  };


  return (   // ── ⋙DOM ── ── ── ── ── ── ── ──⫸
    <>
      <p
        // _PIN_ windowSize ↯
        className="fixed right-10 top-30 text-xl text-slate-950"
      >
        🦀{` wdith: ${windowSize.width}`} <br />
        🦀{` height: ${windowSize.height}`}
      </p>


      {/* <Button onClick={getTopValues} size="3" variant="soft">
        <Text >🦀</Text>
      </Button> */}


      <Box id='MC' className='flex flex-col justify-start items-center gap-8  bg-slate-500 '>

        <Box
        // ── ⋙── ── ── ── ── ──➤
        // <○> MapMenu 
        >
          <MapMenu />
        </Box>

        <Box
          // ── ⋙── ── ── ── ── ──➤
          id="DropDownComponent" //HERE DropDownComponent
          className="flex gap-6"
        >
          <DropdownMenu.Root
          // ⊙  DropdownMenu Year
          >
            <DropdownMenu.Trigger>
              <Button color="gray" variant="soft" highContrast>
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
              <Button color="gray" variant="soft" highContrast>
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

        <Box
          // ── ⋙── ── ── ── ── ──➤
          id='TopValuesBox' //HERE TopValuesBox
          className=' flex gap-6 rounded-xl bg-white bg-opacity-20 h-[420px] w-full'
        // . . . . . . Pie . . . . . .
        >

          <PieChart width={600} height={600}>
            <Pie
              data={topVData?.percent_data} // ⊙ topVData
              cy={160}

              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={200}
              fill="#000"
              dataKey="v"
            >
              {topVData?.percent_data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              // (○) CustomTooltip
              content={<CustomTooltip />} />
          </PieChart>


          <ResponsiveContainer
            // . . . . . . Bar . . . . . .
            width="100%" height="100%">
            <BarChart
              width={700}
              height={300}
              data={topVData?.data} // ⊙ topVData
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
              <Bar name='🦀' dataKey="v" fill="#8884d8" minPointSize={5}>
                <LabelList
                  dataKey="name"
                  content={topValuesLabels}  // {○} topValuesLabels
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box
          // ── ⋙── ── ── ── ── ──➤
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

        <Box
          // ── ⋙── ── ── ── ── ──➤
          id='TesteBox' //HERE TesteBox
          className=' rounded-xl bg-purple-900 bg-opacity-20 h-[420px] w-[620px]'
        >

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              width={700}
              height={300}
              data={TESTDATA} // ○ TESTDATA
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

              <Bar dataKey="v" fill="#8884d8" minPointSize={5}>
                <LabelList
                  dataKey="name"
                  content={renderCustomizedLabel}  // ○ renderCustomizedLabel
                />
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </Box>

        <Box
          // ── ⋙── ── ── ── ── ──➤
          id='TesteBox2' //HERE TesteBox2
          className=' rounded-xl bg-purple-900 bg-opacity-20 h-[420px] w-[620px]'
        >

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              width={600}
              height={300}
              data={TESTDATA2} // ○ TESTDATA2
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

              <Bar dataKey="v" fill="#8884d8" minPointSize={5}>
                <LabelList
                  dataKey="name"
                  content={renderCustomizedLabel2}  // ○ renderCustomizedLabel2
                />
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </Box>

      </Box >

    </>
  );
};  // ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
export default Home;

