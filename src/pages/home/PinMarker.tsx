// src/components/PinMarker.tsx
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@radix-ui/themes';
import { useSpring, animated } from 'react-spring';

// Definindo a interface de props que o marcador receberá
interface PinMarkerProps {
    x: number;
    y: number;
    imageUrl?: string | null;
    tooltipContent: React.ReactNode;
    level: 0 | 1;
    isActive: boolean; // Nova prop para saber se este é o marcador ativo
    isAnyPinActive: boolean;
    onClick: (event: React.MouseEvent) => void;
}



interface PinShapeProps {
    fillColor: string;
    strokeColor?: string;
};


const PinShape = ({ fillColor, strokeColor }: PinShapeProps) => (
    <path
        d="M26.4 6c-1.1-1.8-2.5-3.2-4.4-4.4S18.2 0 16 0s-4.2.6-6 1.6C8.1 2.7 6.7 4.2 5.6 6 4.5 7.8 4 9.8 4 12c-.1 1 .2 2 .7 3.2s1.1 2.4 1.7 3.6c.6 1.2 1.4 2.5 2.4 3.8s1.8 2.5 2.5 3.5 1.5 2 2.4 3c.9 1 1.4 1.7 1.7 2 .3.3.5.6.7.8l.7-.7c.4-.5 1-1.2 1.7-2.1.7-.9 1.5-1.8 2.3-2.9.8-1.1 1.7-2.3 2.6-3.6.9-1.3 1.7-2.5 2.3-3.8.7-1.2 1.2-2.5 1.7-3.7.4-1.1.6-2.2.6-3.1 0-2.2-.5-4.2-1.6-6z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
        overflow={"visible"}
    />
);

export const PinMarker: React.FC<PinMarkerProps> = ({
    x, y, imageUrl, tooltipContent, level, isActive, isAnyPinActive, onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Definimos a escala base para cada nível. No pino, a escala funciona melhor que o raio.
    const scaleLevel0 = 0.8;
    const scaleLevel1 = 1.2;

    const [springProps, api] = useSpring(() => ({
        scale: scaleLevel0,
        yOffset: 0,
        opacity: 1, // Começa com opacidade total
        config: { tension: 300, friction: 15 },
    }));


    useEffect(() => {
        const baseScale = level === 0 ? scaleLevel0 : scaleLevel1;
        const targetScale = isHovered || isActive ? baseScale * 1.2 : baseScale;
        const yOffset = isHovered || isActive ? -5 : 0;


        const targetOpacity = isAnyPinActive && !isActive ? 0.5 : 1;

        api.start({
            scale: targetScale,
            yOffset: yOffset,
            opacity: targetOpacity,

        });
    }, [level, isHovered, isActive, isAnyPinActive, api]);





    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Dimensões para o logo caber dentro do círculo do pino
    const logoDiameter = 18;

    return (
        <animated.g
            transform={springProps.scale.to(s => `translate(${x}, ${y}) scale(${s})`)}
            opacity={springProps.opacity}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer', willChange: 'transform' }}
        >
            <g transform="translate(-16, -32)"> {/* Centraliza o pino pela ponta inferior */}
                <Tooltip content={tooltipContent}>
                    <g>


                        <PinShape fillColor={isActive ? "#facc15" : "#FFFFFF"} strokeColor="#333" />

                        {imageUrl && (
                            <image
                                href={imageUrl}
                                x={16 - (logoDiameter / 2)} // Centraliza o logo no meio do pino
                                y={12 - (logoDiameter / 2)}
                                height={logoDiameter}
                                width={logoDiameter}
                                clipPath="circle(50% at center)"
                            />
                        )}
                    </g>
                </Tooltip>
            </g>
        </animated.g>
    );
};