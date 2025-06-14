// AnimatedLogoMarker.tsx (VERSÃO FINAL COM CONTROLE POR NÍVEL)

import React, { useState, useEffect } from 'react';
import { Tooltip, Text } from '@radix-ui/themes';
import { useSpring, animated, to } from 'react-spring';


interface AnimatedLogoMarkerProps {
    x: number;
    y: number;
    imageUrl?: string;
    tooltipContent: React.ReactNode;
    level: 0 | 1; // Recebe o nível do mapa em vez da escala
    onClick: (event: React.MouseEvent) => void;
}

// Interface de Props
interface AnimatedLogoMarkerProps {
    x: number;
    y: number;
    imageUrl?: string;
    tooltipContent: React.ReactNode;
    level: 0 | 1;
    onClick: (event: React.MouseEvent) => void;
}

export const AnimatedLogoMarker: React.FC<AnimatedLogoMarkerProps> = ({
    x, y, imageUrl, tooltipContent, level, onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizeLevel0 = 12;
    const sizeLevel1 = 8;

    const [springProps, api] = useSpring(() => ({
        r: sizeLevel0,
        yOffset: 0,
        strokeWidth: 1,
        config: { tension: 400, friction: 20 },
    }));

    useEffect(() => {
        const baseRadius = level === 0 ? sizeLevel0 : sizeLevel1;
        const targetRadius = isHovered ? baseRadius * 1.3 : baseRadius;
        const yOffset = isHovered ? -baseRadius * 0.4 : 0;

        api.start({
            r: targetRadius,
            yOffset: yOffset,

        });
    }, [level, isHovered, api]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <g
            transform={`translate(${x}, ${y})`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
        >
            <Tooltip content={tooltipContent}>
                <g>
                    {/* Círculo de fundo/borda animado */}
                    <animated.circle
                        r={springProps.r}
                        cy={springProps.yOffset}
                        fill="#FFFFFF"
                        stroke="#000000"
                        strokeWidth={springProps.strokeWidth}
                    />

                    {/* Logo (se existir) animado */}
                    {imageUrl && (
                        <animated.image
                            href={imageUrl}
                            x={springProps.r.to(r => -r)}
                            y={to([springProps.r, springProps.yOffset], (r, yOff) => -r + yOff)}
                            height={springProps.r.to(r => r * 2)}
                            width={springProps.r.to(r => r * 2)}
                            stroke="#000000"
                            clipPath="circle(50%)"
                        />
                    )}


                    {/* Círculo de cor (se não houver logo) animado */}
                    {!imageUrl && (
                        <animated.circle
                            cy={springProps.yOffset}
                            r={springProps.r}
                            fill="#006400"
                        />
                    )}
                </g>
            </Tooltip>
        </g>
    );
};
