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


import { BarChart, Bar, Cell, LabelList, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import MapMenu from "./MapMenu";

import Icons from "../../assets/Icons";
import ICON_SIZES from "../../assets/IconsSizes";
// ── ⋙── ── ── ── ── ── ── ──➤




//  {●} D
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
//  ● TESTDICT
const TESTDICT = {
  "goiaba": "Laranaja",
}

//  {●} TESTDATA2
const TESTDATA2 = [
  { name: "Uva", id: "uva", v: Math.floor(Math.random() * 5000) },
  { name: "Tangerina", id: "tangerina", v: Math.floor(Math.random() * 5000) },
  { name: "Pêssego", id: "pessego", v: Math.floor(Math.random() * 5000) },
  { name: "Pera", id: "pera", v: Math.floor(Math.random() * 5000) },
  { name: "Noz", id: "noz_fruto_seco", v: Math.floor(Math.random() * 5000) },
  { name: "Melão", id: "melao", v: Math.floor(Math.random() * 5000) },
  { name: "Melancia", id: "melancia", v: Math.floor(Math.random() * 5000) },
  { name: "Marmelo", id: "marmelo", v: Math.floor(Math.random() * 5000) },
  // { name: "Maracujá", id: "maracuja", v: Math.floor(Math.random() * 5000) },
  // { name: "Manga", id: "manga", v: Math.floor(Math.random() * 5000) },
  // { name: "Mamão", id: "mamao", v: Math.floor(Math.random() * 5000) },
  // { name: "Maçã", id: "maca", v: Math.floor(Math.random() * 5000) },
  // { name: "Limão", id: "limao", v: Math.floor(Math.random() * 5000) },
  // { name: "Laranja", id: "laranja", v: Math.floor(Math.random() * 5000) },
  // { name: "Goiaba", id: "goiaba", v: Math.floor(Math.random() * 5000) },
  // { name: "Figo", id: "figo", v: Math.floor(Math.random() * 5000) },
  // { name: "Caqui", id: "caqui", v: Math.floor(Math.random() * 5000) },
  // { name: "Caju", id: "caju", v: Math.floor(Math.random() * 5000) },
  // { name: "Banana (cacho)", id: "banana_cacho", v: Math.floor(Math.random() * 5000) },
  // { name: "Açaí", id: "acai", v: Math.floor(Math.random() * 5000) },
  // { name: "Abacaxi", id: "abacaxi", v: Math.floor(Math.random() * 5000) },
];


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

  //  ✳ [data, setData]
  const [data, setData] = useState(null);


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

      const response = await axios.get(url, { params }); // _PIN_ getTop10  ✉ 

      setData(response.data); // ↺ setData
      console.log(response.data); // [LOG] data 

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }
  } // ── ⋙── ── ── ── ── ── ── ──➤

  const CustomizedDot = (props) => { // {●} CustomizedDot
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

  
  const renderCustomizedLabel = (props) => {  // {●} renderCustomizedLabel
    const { x, y, width, index } = props;
    const dataName = TESTDATA2[index]?.id ?? "default";
    const SvgComponent = Icons[dataName as keyof typeof Icons];
  
    if (!SvgComponent) return null;
  
    const svgWidth = ICON_SIZES[dataName] || 30;
    const centerX = x + (width / 2) - (svgWidth / 2);

    console.log(dataName, svgWidth)

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

      <Button onClick={getTopValues} size="3" variant="soft">
        <Text >🦀</Text>
      </Button>

      <Box id='MC' className='flex flex-col justify-start items-center gap-8  bg-slate-700 '>

        <Box
        // . . . . . . . . .
        // <○> MapMenu 
        >
          <MapMenu />
        </Box>


        {/* {dates.map((date) => (
          <SelectItem key={date} value={date} className="p-2 hover:bg-gray-200 cursor-pointer">
            {date}
          </SelectItem>
        ))} */}


        <Box
          // . . . . . . . . .
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
              <DropdownMenu.Item onSelect={() => setVariable("area_plantada_ou_destinada_a_colheita")} shortcut="▣">
                Área plantada ou destinada a colheita
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => setVariable("area_colhida")} shortcut="▢">
                Área colhida
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => setVariable("valor_da_producao")} shortcut="R$">
                Valor da produção
              </DropdownMenu.Item>
            </DropdownMenu.Content>

          </DropdownMenu.Root>
        </Box >

        <Box
          // . . . . . . . . .
          id='ChartBox' //HERE TopSeriesBox
          className=' rounded-xl bg-blue-900 bg-opacity-20 h-[420px]'
        >

          🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀
          🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀🦀

          <ResponsiveContainer
            width="100%"
            height="100%">
            <LineChart // ○ LineChart
              width={500}
              height={300}
              data={D} // {○} D
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                dot={<CustomizedDot />}
              // {○} CustomizedDot
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

        </Box>


        <Box
          // . . . . . . . . .
          id='ChartBox' //HERE TesteBox
          className=' rounded-xl bg-purple-900 bg-opacity-20 h-[420px] w-[620px]'
        >

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              width={700}
              height={300}
              data={TESTDATA2} // {○} TESTDATA2
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="v" fill="#8884d8" minPointSize={5}>
                <LabelList
                  dataKey="name"
                  content={renderCustomizedLabel}  // {○} renderCustomizedLabel
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
