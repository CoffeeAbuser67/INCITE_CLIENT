// src/components/PinMarker.tsx
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@radix-ui/themes';
import { useSpring, animated } from 'react-spring';

interface PinMarkerProps {
    x: number;
    y: number;
    imageUrl?: string | null;
    tooltipContent: React.ReactNode;
    label: string;
    /** Largura atual do viewBox dividida pela inicial. Compensa o zoom
     *  do SVG para o pino manter tamanho visual constante. */
    viewScale: number;
    isActive: boolean;
    isAnyPinActive: boolean;
    onClick: (event: React.MouseEvent) => void;
}

interface PinShapeProps {
    fillColor: string;
    strokeColor?: string;
}

const PinShape = ({ fillColor, strokeColor }: PinShapeProps) => (
    <path
        d="M26.4 6c-1.1-1.8-2.5-3.2-4.4-4.4S18.2 0 16 0s-4.2.6-6 1.6C8.1 2.7 6.7 4.2 5.6 6 4.5 7.8 4 9.8 4 12c-.1 1 .2 2 .7 3.2s1.1 2.4 1.7 3.6c.6 1.2 1.4 2.5 2.4 3.8s1.8 2.5 2.5 3.5 1.5 2 2.4 3c.9 1 1.4 1.7 1.7 2 .3.3.5.6.7.8l.7-.7c.4-.5 1-1.2 1.7-2.1.7-.9 1.5-1.8 2.3-2.9.8-1.1 1.7-2.3 2.6-3.6.9-1.3 1.7-2.5 2.3-3.8.7-1.2 1.2-2.5 1.7-3.7.4-1.1.6-2.2.6-3.1 0-2.2-.5-4.2-1.6-6z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.2"
        overflow={"visible"}
    />
);

// Escala base no nível 0 — era 0.8, agora maior conforme pedido.
const PIN_BASE_SCALE = 1.15;
// Leve reforço quando há zoom, para o pino não sumir na tela cheia.
const ZOOMED_BOOST = 3.2;
// Destaque no hover/ativo — era 1.2, reduzido porque agora não
// acumula com o fator de zoom do viewBox.
const ACTIVE_BOOST = 1.5;

export const PinMarker: React.FC<PinMarkerProps> = ({
    x, y, imageUrl, tooltipContent, label, viewScale, isActive, isAnyPinActive, onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const [springProps, api] = useSpring(() => ({
        scale: PIN_BASE_SCALE,
        opacity: 1,
        config: { tension: 210, friction: 24 },
    }));

    useEffect(() => {
        const zoomed = viewScale < 0.9;
        let scale = PIN_BASE_SCALE * viewScale;
        if (zoomed) scale *= ZOOMED_BOOST;
        if (isHovered || isActive) scale *= ACTIVE_BOOST;

        api.start({
            scale,
            opacity: isAnyPinActive && !isActive ? 0 : 1,
        });
    }, [viewScale, isHovered, isActive, isAnyPinActive, api]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const logoDiameter = 18;

    return (
        <animated.g
            transform={springProps.scale.to(s => `translate(${x}, ${y}) scale(${s})`)}
            opacity={springProps.opacity}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={isAnyPinActive && !isActive ? -1 : 0}
            aria-hidden={isAnyPinActive && !isActive}
            aria-label={`Instituição ${label}`}
            aria-pressed={isActive}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(e as unknown as React.MouseEvent);
                }
            }}
            style={{
                cursor: 'pointer',
                willChange: 'transform',
                outline: 'none',
                pointerEvents: isAnyPinActive && !isActive ? 'none' : 'auto',
            }}
        >
            <g transform="translate(-16, -32)">
                <Tooltip content={tooltipContent}>
                    <g>
                        <PinShape fillColor={isActive ? "#facc15" : "#FFFFFF"} strokeColor="#333" />

                        {imageUrl ? (
                            <image
                                href={imageUrl}
                                x={16 - (logoDiameter / 2)}
                                y={12 - (logoDiameter / 2)}
                                height={logoDiameter}
                                width={logoDiameter}
                                clipPath="circle(50% at center)"
                            />
                        ) : (
                            <circle cx={16} cy={12} r={logoDiameter / 2} fill="#15803d" opacity={0.85} />
                        )}
                    </g>
                </Tooltip>
            </g>
        </animated.g>
    );
};