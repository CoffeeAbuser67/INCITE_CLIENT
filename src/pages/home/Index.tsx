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
} from "@radix-ui/themes";

import {axiosDefault} from "../../services/axios";
import handleAxiosError from "../../utils/handleAxiosError";
import { useWindowResize } from "../../hooks/useWindowResize";

import MapMenu from "./MapMenu";

// ★ Home  ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
const Home = () => {

  // ✳ [windowSize, setWindowSize]
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useWindowResize((width, height) => {
    setWindowSize({ width, height });
  });

  //  ✳ [data, setData]
  const [data, setData] = useState(null);

  // ── ⋙── ── ── ── ── ── ── ──➤

  // (✪) getToP10──➤
  const  getToP10 = async () => {

    const axios = axiosDefault;
    try {
      const url = "/getTop10/";
      const params = {
        area: 'bahia',      // 
        year: 2023,           
        variable: 'area colhida percentual total',
      };
      // _PIN_ getTop10  ✉ 

      const response = await axios.get(url, { params });

      setData(response.data); // ↺ setData
      console.log(response.data); // [LOG] data

    } catch (err: unknown) {
      if (err) {
        handleAxiosError(err);
      }
    }
  }   
  
  return (
    // ── ⋙── ── DOM ↯ ── ── ── ──➤ 
    <>
      <p
        // _PIN_ windowSize ↯
        className="fixed right-10 top-30 text-xl text-slate-950"
      >
        🦀{` wdith: ${windowSize.width}`} <br />
        🦀{` height: ${windowSize.height}`}
      </p>

      <Button onClick = {getToP10} size="3" variant="soft">
        <Text >🦀</Text>
      </Button>

      <MapMenu/>

    </>
  );
};
export default Home;
// ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
