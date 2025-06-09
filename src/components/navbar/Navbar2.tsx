import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Box, Text } from "@radix-ui/themes"; // Certifique-se de que está usando ou substitua por 'div'
import { Link } from "react-router-dom";




// [MEDIA] ILOGO_SVG
const ILOGO_SVG = (props: { x: number, y: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={props.x}
        height={props.y}
        viewBox="0 0 512.001 512.001"
    >
        <path
            d="M220.051 350.316c0-116.359-48.82-143.719-152.702-143.719 0 112.325 68.644 143.719 152.702 143.719M318.858 377.263c0-97.801 44.014-116.772 125.754-116.772 1.536 94.81-41.095 116.772-125.754 116.772M345.805 0c22.878 70.593-33.603 111.409-77.474 116.772C235.689 68.285 258.226 11.929 345.805 0M229.033 197.614c-75.228 0-89.825-35.93-89.825-98.807 72.929-1.186 89.825 33.684 89.825 98.807M300.893 233.544c81.902 0 116.772-9.324 116.772-116.772-81.902 0-116.772 9.324-116.772 116.772"
            style={{
                fill: "#81c784",
            }}
        />
        <path
            d="M380.989 319.785c-1.985-4.554-7.285-6.638-11.821-4.653-27.675 12.045-44.598 35.292-57.488 56.652-12.09 12.917-25.295 27.693-37.735 45.586V296.422c0-12.189 13.483-35.014 33.549-56.787 1.015-1.105 2.425-2.677 4.177-4.626 9.854-11.021 30.361-33.927 48.658-48.29 3.907-3.063 4.581-8.713 1.527-12.611-3.072-3.907-8.713-4.581-12.611-1.527-19.546 15.342-40.762 39.047-50.966 50.445l-3.988 4.428c-4.114 4.464-12.477 13.977-20.345 25.402V152.775c.243-32.463 5.857-52.341 21.423-75.974a8.979 8.979 0 0 0-2.551-12.441 8.974 8.974 0 0 0-12.45 2.56c-17.498 26.561-24.109 49.79-24.387 85.711 0 .018.009.027.009.036 0 .009-.009.027-.009.036v63.236c-9.054-12.917-18.513-22.582-20.345-24.414l-35.93-38.93c-3.359-3.638-9.036-3.871-12.692-.503-3.647 3.359-3.871 9.045-.512 12.692l36.181 39.181c9.261 9.261 33.298 37.475 33.298 56.527v114.113c-8.147-10.213-15.854-17.498-22.16-23.408-2.569-2.407-4.833-4.545-6.782-6.593-24.432-38.014-49.008-62.356-75.102-74.312-4.5-2.057-9.845-.099-11.911 4.419-2.066 4.509-.09 9.845 4.428 11.911 23.067 10.572 45.316 32.993 68.024 68.536.234.35.53.629.799.943.09.117.117.252.225.359 2.255 2.416 4.976 4.967 8.03 7.842 9.414 8.821 22.178 20.884 34.448 42.361v96.355c0 4.958 4.024 8.982 8.982 8.982s8.982-4.024 8.982-8.982v-51.541c15.558-28.663 34.681-50.167 51.469-68.069.099-.108.126-.243.216-.359.323-.368.665-.728.925-1.159 11.498-19.16 26.39-40.107 49.781-50.284 4.546-1.985 6.63-7.276 4.654-11.821"
            style={{
                fill: "#4caf50",
            }}
        />
        <path
            d="M417.665 512H112.261c-4.958 0-8.982-4.024-8.982-8.982s4.024-8.982 8.982-8.982h305.404c4.958 0 8.982 4.024 8.982 8.982S422.623 512 417.665 512"
            style={{
                fill: "#9e5a23",
            }}
        />
    </svg>
)



const SimplifiedNavbar = () => { // ★ SimplifiedNavbar ⋙────────────────➤
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Verifica se o scroll passou de 50 pixels para um efeito mais notável
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (// ── ◯⫘⫘⫘⫘⫘⫘⫘ DOM ⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

        <Box // Se não estiver usando Radix, substitua <Box> por <div className="...">
            id="SimplifiedNavBar"
            className={classNames(
                "fixed top-0 left-0 w-full flex items-center justify-center z-50",
                "transition-all duration-300 ease-in-out",
                scrolled
                    ? "h-16 bg-white/60 backdrop-blur-md shadow-xl shadow-black/5" // Estilo scrollado
                    : "h-28 bg-black/0 shadow-xl shadow-white/20" // Estilo inicial 

            )}
        >
            <div
                id="contentWrapper"
                className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full" // Aumentei max-w-6xl
            >
                {/* Logo */}

                <div

                    id="logoContainer"
                    className={classNames(
                        "flex justify-center items-center gap-2",
                        "transition-all duration-300 ease-in-out",
                        // scrolled ? "w-20 h-20" : "w-28 h-28"
                    )}
                >

                    <Text
                        className="text-black"
                        size="6"
                        highContrast
                        weight={"bold"}
                        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                    >
                        Incite
                    </Text>

                    <Link to="/">
                        <ILOGO_SVG x={scrolled ? 22 : 32} y={scrolled ? 22 : 32} />
                    </Link>

                    <Text className="text-green-900 " size="6" highContrast weight={"bold"} style={{ textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                        AF
                    </Text>

                </div>


                {/* Links de Navegação Simples */}
                <nav className="flex space-x-6"> {/* Aumentei o space-x-6 */}
                    {["Home", "Sobre", "Serviços", "Contato"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={classNames(
                                "font-medium transition-colors duration-300",
                                // Ajuste de cor de texto para melhor legibilidade
                                scrolled
                                    ? "text-white hover:text-gray-200"
                                    : "text-white hover:text-gray-300 tet-shaxdow-sm" // Adiciona uma leve sombra ao texto no estado transparente
                            )}
                            // Adicionando um estilo inline para text-shadow para melhor compatibilidade se Tailwind não for suficiente
                            style={!scrolled ? { textShadow: '0 1px 3px rgba(0,0,0,0.4)' } : {}}
                        >
                            {item}
                        </a>
                    ))}
                </nav>
            </div>
        </Box>
    );
};  // ★ SimplifiedNavbar ⋙────────────────➤

export default SimplifiedNavbar;