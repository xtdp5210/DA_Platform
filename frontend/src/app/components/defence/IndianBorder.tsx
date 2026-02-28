// Authentic geometric border matching the PDF design exactly
// Terracotta pattern on cream (#FAF3E8) background

export function IndianBorder({ flip = false, sticky = false }: { flip?: boolean; sticky?: boolean }) {
  const patternUnit = 64;
  const totalUnits = 25;
  const svgWidth = patternUnit * totalUnits;
  const h = 44;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: `${h}px`,
        transform: flip ? "scaleY(-1)" : "none",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 100 : undefined,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${svgWidth} ${h}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width={svgWidth} height={h} fill="#FAF3E8" />
        <rect x="0" y="0" width={svgWidth} height="2.5" fill="#1a1a1a" />
        <rect x="0" y={h - 2.5} width={svgWidth} height="2.5" fill="#1a1a1a" />

        {Array.from({ length: totalUnits }).map((_, i) => {
          const x = i * patternUnit;
          const cx = x + patternUnit / 2;
          const cy = h / 2;
          const c = "#C24F1D";

          return (
            <g key={i}>
              {/* Left double chevron >> */}
              <polyline points={`${x+2},${cy-9} ${x+9},${cy} ${x+2},${cy+9}`} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />
              <polyline points={`${x+8},${cy-9} ${x+15},${cy} ${x+8},${cy+9}`} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />

              {/* Center outer diamond */}
              <rect x={cx-8} y={cy-8} width="16" height="16" fill="none" stroke={c} strokeWidth="1.8" transform={`rotate(45 ${cx} ${cy})`} />
              {/* Center inner diamond filled */}
              <rect x={cx-4} y={cy-4} width="8" height="8" fill={c} transform={`rotate(45 ${cx} ${cy})`} />

              {/* Top triangle */}
              <polygon points={`${cx},${cy-16} ${cx-6},${cy-9} ${cx+6},${cy-9}`} fill={c} />
              {/* Bottom triangle */}
              <polygon points={`${cx},${cy+16} ${cx-6},${cy+9} ${cx+6},${cy+9}`} fill={c} />

              {/* Right double chevron << */}
              <polyline points={`${x+patternUnit-2},${cy-9} ${x+patternUnit-9},${cy} ${x+patternUnit-2},${cy+9}`} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />
              <polyline points={`${x+patternUnit-8},${cy-9} ${x+patternUnit-15},${cy} ${x+patternUnit-8},${cy+9}`} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />

              {/* X marks */}
              <line x1={cx-19} y1={cy-6} x2={cx-13} y2={cy+6} stroke={c} strokeWidth="1.6" />
              <line x1={cx-13} y1={cy-6} x2={cx-19} y2={cy+6} stroke={c} strokeWidth="1.6" />
              <line x1={cx+13} y1={cy-6} x2={cx+19} y2={cy+6} stroke={c} strokeWidth="1.6" />
              <line x1={cx+19} y1={cy-6} x2={cx+13} y2={cy+6} stroke={c} strokeWidth="1.6" />

              {/* Small center dot */}
              <circle cx={cx} cy={cy-19} r="2.2" fill={c} opacity="0.7" />
              <circle cx={cx} cy={cy+19} r="2.2" fill={c} opacity="0.7" />

              {/* Edge tiny triangles */}
              <polygon points={`${cx-10},3 ${cx},10 ${cx+10},3`} fill={c} opacity="0.5" />
              <polygon points={`${cx-10},${h-3} ${cx},${h-10} ${cx+10},${h-3}`} fill={c} opacity="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}