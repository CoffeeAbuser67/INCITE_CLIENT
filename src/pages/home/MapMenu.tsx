// HERE MapMenu

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  useSpring,
  useTransition,
  animated,
  useSpringValue,
  useSpringRef,
} from "@react-spring/web";
import classNames from "classnames";
import { useWindowResize } from "../../hooks/useWindowResize";

import regionCityData from "../../assets/BahiaRegiaoMuni.json";
import regionData from "../../assets/BahiaRegiao.json";


interface City {
  id: string;
  d: string;
  name: string;
}

interface RegionCity {
  [key: string]: City[];
}

// [●] mapRegionCity
const mapRegionCity: RegionCity = regionCityData;

interface Region {
  id: string;
  d: string;
  name: string;
}

// [●] mapRegion
const mapRegion: Region[] = regionData;

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}


// ★ MapMenu  ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
const MapMenu = () => {
  const svgRef = useRef<SVGSVGElement | null>(null); // HERE svgRef
  const c1Ref = useRef<SVGCircleElement | null>(null); // HERE c1Ref
  const originalBBoxRef = useRef<BoundingBox | null>(null); // HERE originalBBoxRef

  type levels = 0 | 1 | 2;
  // ✳ [currentLevel, setCurrentLevel]
  const [currentLevel, setCurrentLevel] = useState<levels>(0);

  // ✳ [currentScale, setCurrentScale]
  const [currentScale, setCurrentScale] = useState<number>(1);

  // ✳ [activeRegion, setActiveRegion]
  const [activeRegion, setActiveRegion] =
    useState<keyof typeof mapRegionCity>("blank");

  // ✳ [activeCity, setActiveCity]
  const [activeCity, setActiveCity] = useState<string>("");

  // const [rect, setRect] = useState<DOMRect | null>(null);
  // const [bbox, setBbox] = useState<DOMRect | null>(null);

  // ✳ [crabPos, setCrabPos]
  const [crabPos, setCrabPos] = useState({ X: 300, Y: 300 }); // ── ⋙── ── ── ── ── ── ──➤

  useEffect(() => {
    //HERE useEffect
    if (svgRef.current && !originalBBoxRef.current) {
      // Assign the value from getBBox to the ref
      originalBBoxRef.current = svgRef.current.getBBox();
      console.log("Original BBox:", originalBBoxRef.current);
    }
  }, []); // . . . . . . .

  useEffect(() => {
    //HERE useEffect
    if (c1Ref.current) {
      const bbox = c1Ref.current.getBBox();
      const rect = c1Ref.current.getBoundingClientRect();

      console.log(" useEffect log");
      // // [LOG] c1Rect
      // console.log("rect ↯");
      // console.log("x:", rect.x);
      // console.log("y:", rect.y);
      // console.log("width:", rect.width);
      // console.log("height:", rect.height);
      // console.log(". . . . . . . . . . . . ");
      // // [LOG] c1Box
      // console.log("c1Box useEffect log ↯");
      // console.log("x:", bbox.x);
      // console.log("y:", bbox.y);
      // console.log("width:", bbox.width);
      // console.log("height:", bbox.height);
      // console.log(". . . . . . . . . . . . ");
      // console.log("currentScale:", currentScale);
      console.log("✦────────────────────────────➤");
    }
  }, [crabPos, currentScale]); // ── ⋙── ── ── ── ── ── ──➤

  // ● transition
  const transition = useTransition(mapRegionCity[activeRegion] || [], {
    trail: 600 / mapRegionCity[activeRegion].length || 1,
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0)" },
    config: { mass: 10, tension: 63, friction: 16, clamp: true },
    keys: (mapRegionCity[activeRegion] || []).map((el) => el.id),
  });

  // ● springStyles
  const [springStyles, api] = useSpring(() => ({
    transform: `scale(1) translate(0px, 0px)`,
    config: { tension: 62, friction: 35, mass: 7 },
  })); // ── ⋙── ── ── ── ── ── ──➤

  // {✪} resetMap
  const resetMap = () => {
    setCurrentLevel(0); // ↺ setCurrentLevel
    setCurrentScale(1); // ↺ setCurrentScale
    setActiveRegion("blank"); // ↺ setActiveRegion
    api.start({
      transform: "scale(1) translate(0px, 0px)",
    });
  }; // ── ⋙── ── ── ── ── ── ──➤

  // {✪} runToFit
  const runToFit = (bbox: BoundingBox, rect: BoundingBox) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    // const svgBox = svgRef.current?.getBBox()
    const svgBox = originalBBoxRef.current; // get the cached svg bbox value

    if (!svgRect || !svgBox) return;

    const CBX = bbox.x + bbox.width / 2;
    const CBY = bbox.y + bbox.height / 2;

    const SVGCX = svgBox.width / 2;
    const SVGCY = svgBox.height / 2;

    // + 5 is the offset from the edge of the canvas
    const translateX = SVGCX - CBX + 5; // ⊙ currentScale
    const translateY = SVGCY - CBY + 5;

    // HERE Scale
    const scaleX = svgRect.width / rect.width;
    const scaleY = svgRect.height / rect.height;
    const maxScale = Math.min(scaleX, scaleY);

    setCrabPos({ X: CBX, Y: CBY }); // ↺ setCrabPos

    setCurrentScale(maxScale - 0.35); // ↺ setCurrentScale
    // (maxScale - 0.3) -0.3 is an adjustment on the scale.

    // // [LOG] rect
    // console.log("target rect ↯");
    // console.log("x:", rect.x);
    // console.log("y:", rect.y);
    // console.log("width:", rect.width);
    // console.log("height:", rect.height);
    // console.log(". . . . . . . . . . . . ");
    // // [LOG] bbox
    // console.log("target bbox ↯");
    // console.log("x:", bbox.x);
    // console.log("y:", bbox.y);
    // console.log("width:", bbox.width);
    // console.log("height:", bbox.height);
    // console.log("✦────────────────────────────➤");

    api.start({
      transform: `scale(${maxScale - 0.35
        }) translate(${translateX}px, ${translateY}px)`,
    });
  }; // ── ⋙── ── ── ── ── ── ──➤

  // (✪) buttonClickLog
  const buttonClickLog = () => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    const svgBox = svgRef.current?.getBBox();

    const c1Box = c1Ref.current?.getBBox();
    const c1Rect = c1Ref.current?.getBoundingClientRect();

    // if (!svgRect || !svgBox || !c1Rect || !c1Box) return;
    if (!svgRect || !svgBox) return;

    console.log("Svg viebox");
    // [LOG] rect
    console.log("rect ↯");
    console.log("x:", svgRect.x);
    console.log("y:", svgRect.y);
    console.log("width:", svgRect.width);
    console.log("height:", svgRect.height);
    console.log(". . . . . . . . . . . . ");
    // [LOG] bbox
    console.log("bbox ↯");
    console.log("x:", svgBox.x);
    console.log("y:", svgBox.y);
    console.log("width:", svgBox.width);
    console.log("height:", svgBox.height);
    console.log(". . . . . . . . . . . . ");
    console.log("currentScale:", currentScale);
    console.log("✦────────────────────────────➤");

    // console.log("c1Rect ");
    // // [LOG] c1Rect
    // console.log("rect ↯");
    // console.log("x:", c1Rect.x);
    // console.log("y:", c1Rect.y);
    // console.log("width:", c1Rect.width);
    // console.log("height:", c1Rect.height);
    // console.log(". . . . . . . . . . . . ");
    // // [LOG] c1Box
    // console.log("c1Box ↯");
    // console.log("x:", c1Box.x);
    // console.log("y:", c1Box.y);
    // console.log("width:", c1Box.width);
    // console.log("height:", c1Box.height);
    // console.log(". . . . . . . . . . . . ");
    // console.log("currentScale:", currentScale);
    // console.log("✦────────────────────────────➤");
  }; // ── ⋙── ── ── ── ── ── ──➤

  // (✪) handleClick
  const handleClick = (event) => {
    const target = event.target;
    const target_id = target?.id;
    const target_type = target?.getAttribute("data-type");
    const target_name = target?.getAttribute("data-name");


    // [LOG] target
    // console.log("target:", target);
    console.log("target id:", target_id);
    console.log("target type:", target_type);
    console.log("target name:", target_name);
    console.log("level:", currentLevel);
    console.log("✦────────────────────────────➤");



    // . . .
    // ⊙ currentLevel 0
    if (currentLevel === 0) {
      if (target_type === "region") {
        setCurrentLevel(1); // ↺ setCurrentLevel
        setActiveRegion(target_id); // ↺ setActiveRegion
        runToFit(target.getBBox(), target.getBoundingClientRect()); // {○} runToFit
      }
    } // . . .


    // ⊙ currentLevel 1
    else if (currentLevel === 1) {
      if (target_type === "city") {
        setCurrentLevel(1); // ↺ setCurrentLevel
        setActiveCity(target_id); // ↺ setActiveCity
        runToFit(target.getBBox(), target.getBoundingClientRect()); // {○} runToFit
        console.log(target_id, "↯"); // [LOG] target_id  ↯
      } else {
        resetMap(); // {○} resetMap
      }
    }
  }


    ; // . . . . . . . . . . . . . .

  return (
    // ── ⋙── ── ── ── ── ── ──➤ DOM ↯
    <>
      <div
        className="flex gap-10 items-center"
      >

        <div
          // _PIN_ canvas-wrapper
          id="canvas-wrapper"
          className="relative bg-transparent rounded-3xl"
          style={{
            width: "715px",
            height: "760px",
            overflow: "hidden",
            // border: "1px solid black",
          }}
        >

          <animated.svg
            // ── ⋙── SVGCanvas ──➤
            id="SVGCanvas"
            ref={svgRef}
            viewBox="0 0 715 760"
            overflow={"visible"}
            style={{
              width: "100%",
              height: "100%",
              ...springStyles, // ○ springStyles
            }}
            // (○) handleClick
            onClick={handleClick}
          >
            <g>
              <defs>
                <style>
                  {
                    ".cls-region{stroke:#000;stroke-linejoin:round;stroke-width:.8px}"
                  }
                  {
                    ".cls-city{stroke:#000;stroke-linejoin:round;stroke-width:.5px}"
                  }
                </style>
              </defs>

              <g id="RegionsMap" className="cls-region">

                {mapRegion.map((el, i) => (
                  // . . . . . . .
                  // [○] mapRegion
                  <g key={i} className={`${el.id === 'velho_chico' ? 'fill-yellow-100' : 'fill-orange-900'}`}>
                    <animated.path
                      id={el.id}
                      d={el.d}
                      data-name={el.name}
                      data-type={"region"}
                      className="path-hover"
                    />
                  </g>

                ))}
              </g>

              {currentLevel === 1 && (
                // . . . . . . .
                // HERE Overlay
                <rect
                  opacity={0.5}
                  x={-2000}
                  y={-2000}
                  width="4000"
                  height="4000"
                  fill="gray"
                />
              )}


              {transition((style, item) => (
                // . . . . . . .
                // ○ transition
                // [○] mapRegionCity
                <animated.g {...style}>
                  <animated.path
                    id={item.id}
                    d={item.d}
                    data-name = {item.name}
                    data-type={"city"}
                    className={`path-hover cls-city ${activeCity === item.id
                      ? "fill-slate-100"
                      : "fill-slate-900"
                      }`}
                  />
                </animated.g>
              ))}
            </g>


            <circle
              // . . . . . . .
              // HERE c1Ref
              ref={c1Ref}
              cx={30}
              cy={30}
              r={12}
              className="fill-lime-950"
              transform={`translate(${crabPos.X}, ${crabPos.Y})`}
            />



          </animated.svg>


        </div>


        <div
          //── ⋙── ── ── ── ── ── ──➤
          className="flex flex-col  justify-center items-center gap-3"
        >

          <div>
            <button // (○) buttonClickLog
              onClick={buttonClickLog}
              className="rounded-full p-6 bg-blue-950"
            >
              <h1 className="text-2xl">LOG ⊡</h1>
            </button>
          </div>

          <div
          // HERE City Info
          >
            <p className="text-2xl">🦀{`${activeCity}`}</p>

          </div>
        </div>
      </div>
    </>
  );
};
export default MapMenu;
// ★ ⋙── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──➤
