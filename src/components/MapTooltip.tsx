// MapTooltip.tsx

import { createPortal } from 'react-dom';
import { useSpring, animated } from 'react-spring';

export interface TooltipState {
    visible: boolean;
    content: string;
    x: number;
    y: number;
}

/**
 * Vivia dentro do render de MapMenu2 e de Home. Como o componente era
 * recriado a cada render, o useSpring nascia de novo toda vez e a
 * animação nunca chegava a rodar — o tooltip só piscava no lugar.
 */
export const MapTooltip = ({ visible, content, x, y }: TooltipState) => {
    const springProps = useSpring({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
        config: { tension: 300, friction: 20 },
    });

    return createPortal(
        <animated.div
            style={{
                position: 'absolute',
                top: y,
                left: x,
                pointerEvents: 'none',
                zIndex: 1000,
                ...springProps,
            }}
            className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg"
        >
            {content}
        </animated.div>,
        document.body
    );
};