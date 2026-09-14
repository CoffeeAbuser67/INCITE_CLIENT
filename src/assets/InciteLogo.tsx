interface InciteLogoProps {
    height?: number;
    className?: string;
}

const InciteLogo = ({ height = 52, className }: InciteLogoProps) => (
    <svg
        viewBox="0 0 240 76"
        height={height}
        className={className}
        role="img"
        aria-label="Incite AF"
        style={{ overflow: "visible" }}
    >
        <text
            x="4"
            y="52"
            fontSize="56"
            fontWeight="500"
            fill="currentColor"
            fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
        >
            incite
        </text>

        {/* grupo próprio para o AF poder subir no hover do container */}
        <g className="transition-transform duration-300 group-hover:-translate-y-1">
            <text
                x="155"
                y="52"
                fontSize="56"
                fontWeight="500"
                letterSpacing="1.5"
                fill="#15803d"
                fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
            >
                AF
            </text>
        </g>

        <path
            d="M6 64 C 62 71, 168 71, 226 64"
            fill="none"
            stroke="#15803d"
            strokeWidth="3"
            strokeLinecap="round"
        />
    </svg>
);

export default InciteLogo;