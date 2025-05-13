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

import { VARIABLES, COLORS, SCOLORS } from "../../assets/auxData";
import { mapStore, variableStore, yearStore } from "../../store/mapsStore";
// . . . . . . .

//  WARN Xique-xique | santa teresinha | Muquém de São Francisco

// 🧿

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
    const axios = axiosDefault;
    try {
      const area = city.active === '' ? region.active : city.active
      const TYPE = city.active === '' ? "regiao" : "municipio"
      const url = "/getTopSeries/";
      const params = {
        area: area,
        variable: variable,
        type: TYPE
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

  const getTopValues = async () => { // (✪) getTopValues
    const axios = axiosDefault;
    try {

      const area = city.active === '' ? region.active : city.active
      const TYPE = city.active === '' ? "regiao" : "municipio"

      const url = "/getTopValues/";
      const params = {
        year: year,
        area: area,
        variable: variable,
        type: TYPE
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
  }; // . . .

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

  const QMRMTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {  // {●} QMRMTooltip
    if (active && payload && payload.length) {
      const { name, qp, rm } = payload[0].payload;

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

    if (cx == null || cy == null) return null;
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

      // ⁂
      const Items = payload
        .sort((a, b) => b.value - a.value)
        .map(({ name, value }) => ({ [seriesVData?.keys[name]]: value }));

      console.log('payload:', payload)

      return (
        <Card>
          <Text as="div"> <Strong>Ano: </Strong> {payload[0].payload['year']} </Text>
          <Separator my="1" color="gray" size="4" />
          {
            Items.map((item) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return (
                <Text as="div"> <Strong>{`${key} :`}</Strong> {value.toLocaleString('de-DE')} </Text>
              )
            })
          }
        </Card >
      );

    }

    return null;
  };

  return (// ── ⋙── ── ── ── DOM ── ── ── ── ── ──⫸
    <>
      <p // HERE windowSize ↯
        className="fixed right-10 top-30 text-xl text-slate-950"
      >
        🦀{` wdith: ${windowSize.width}`} <br />
        🦀{` height: ${windowSize.height}`}
      </p>

      <div //_PIN_⋙── ── ── BANNER ── ── ── ──➤
        // [MEDIA] output_half
        //  WARN fallback NONE
        id="BANNER"
        className="relative">
        <video autoPlay loop muted playsInline className="w-full h-auto">
          <source src="/output_half.mp4" type="video/mp4" />
        </video>

        <Box className={classNames(
          'absolute flex flex-col items-center text-black',
          "left-1/2 -translate-x-1/2",
          'bottom-0 ',
          "bg-gradient-to-b from-white/0 to-white/100 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-100",
          'p-14 rounded-t-lg '
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

      <Box // _PIN_ ⋙── ── ── MapMenu ── ── ──➤
        id="MapMenu" // <○> MapMenu 
        className={classNames(
          "w-full  px-10 pt-24",
          "bg-white",
        )}
      >
        <MapMenu />
      </Box>

      <Box //_PIN_⋙── ── ──MC⊛×⁕ ── ── ──➤
        id='MC'
        className={classNames(
          'flex flex-col justify-start items-center',
          // 'bg-gradient-to-b from-white via-emerald-900 to-green-900',
          'gap-10 px-10 pt-24')}>

        <Box //── ⋙── ── TopValuesBox ── ──➤
          id='TopValuesBox'
          className='flex gap-8 rounded-xl h-[440px] w-full '
        >

          <Box
            // . . . . . . . . . . . .pie
            id='pie'
            className={classNames(
              'flex z10 rounded-xl',
              'bg-neutral-400 overflow-visible w-2/5 h-[460px]')}
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

          </Box>

          <Box
            // . . . . . . . . . . . .bar
            id='bar'
            className={classNames(
              'flex flex-col items-center w-full h-[460px] z-0',
              'rounded-xl bg-emerald-700 p-5')}
          >

            <Text as='div' size="4" highContrast> <Strong>{VARIABLES[variable]} </Strong></Text>

            <ResponsiveContainer
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

          </Box>
        </Box>

        <Box // ── ⋙──  ── QPRM_bars ── ──➤
          id='QPRM_bars'
          className={classNames(
            'rounded-xl h-[440px] w-full',
            'bg-gradient-to-r from-emerald-50 to-green-50',
          )}

        >


          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={topVData?.QP_RM} // ⊙ topVData
              margin={{
                top: 46,
                right: 20,
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

        </Box>


        <Box // ── ⋙── ── TopSeriesBox ── ──➤
          id='TopSeriesBox'
          className={classNames(
            'rounded-xl w-full h-[700px] p-10',
            'bg-gradient-to-r from-violet-100 to-fuchsia-100',
          )}
        >
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

              {seriesKeys.map((key) => (
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

