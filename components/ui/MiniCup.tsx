type MiniCupProps = {
  bg?: string;
  fg?: string;
  className?: string;
};

/** Stylised SVG cup used inside flavour cards. */
export default function MiniCup({
  bg = "#F2B8CC",
  fg = "#1A1614",
  className,
}: MiniCupProps) {
  return (
    <svg
      viewBox="0 0 120 150"
      width="100%"
      height="100%"
      aria-hidden="true"
      className={className}
    >
      <rect x="28" y="4" width="64" height="10" rx="3" fill="#EDEDED" />
      <rect x="66" y="-6" width="5" height="40" rx="2" fill="#3A5A40" />
      <path
        d="M22 16 L14 140 Q14 146 60 146 Q106 146 106 140 L98 16 Z"
        fill={bg}
        stroke={fg}
        strokeOpacity="0.08"
        strokeWidth="1"
      />
      <path
        d="M22 16 L18 90 Q18 100 26 104 L14 140 Q14 146 40 146 L40 16 Z"
        fill="white"
        opacity="0.18"
      />
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fill={fg}
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="-0.5"
      >
        chonk
      </text>
    </svg>
  );
}

/** Slight tint adjustment so the mini cup stands out on top of its flavour
 *  card background without clashing with the pink spec colour. */
export function miniCupShadeFor(bg: string): string {
  switch (bg) {
    case "#6B4423":
      return "#8a5a2f";
    case "#F4D35E":
      return "#E8C540";
    case "#C8E8C0":
      return "#B5DCAE";
    default:
      return "#F0C0E0";
  }
}
