'use client';

/**
 * Unit Circle Renderer
 *
 * Renders a beautiful, precise unit circle diagram using pure SVG.
 * Features angle markers, reference triangles, trig function projections,
 * and exact coordinate labels (using symbolic values like √3/2, not decimals).
 */

import { useMemo } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HighlightAngle {
  /** Angle in degrees */
  angle: number;
  /** Color for the radius line and decorations */
  color?: string;
  /** Draw the dashed reference triangle to the x-axis */
  showTriangle?: boolean;
  /** Label the point with exact (cos, sin) coordinates */
  showCoords?: boolean;
  /** Optional text label for the angle arc */
  label?: string;
}

interface ArcRange {
  /** Start angle in degrees */
  from: number;
  /** End angle in degrees */
  to: number;
  /** Arc color */
  color?: string;
  /** Optional label placed at the arc midpoint */
  label?: string;
}

interface UnitCircleRendererProps {
  title?: string;
  highlightAngles?: HighlightAngle[];
  /** Show all 16 standard angles with coordinate labels */
  showAllStandard?: boolean;
  showRadians?: boolean;
  showDegrees?: boolean;
  showArc?: ArcRange;
}

// ---------------------------------------------------------------------------
// Lookup table: degree → [exact cos string, exact sin string, radian string]
// Uses symbolic representations so labels stay clean.
// ---------------------------------------------------------------------------

type AngleEntry = [cosStr: string, sinStr: string, radStr: string, cosVal: number, sinVal: number];

const STANDARD_ANGLES: Record<number, AngleEntry> = {
  0:   ['1',      '0',       '0',         1,                   0                  ],
  30:  ['√3/2',   '1/2',     'π/6',       Math.sqrt(3) / 2,    0.5                ],
  45:  ['√2/2',   '√2/2',    'π/4',       Math.SQRT2 / 2,      Math.SQRT2 / 2     ],
  60:  ['1/2',    '√3/2',    'π/3',       0.5,                  Math.sqrt(3) / 2   ],
  90:  ['0',      '1',       'π/2',       0,                    1                  ],
  120: ['-1/2',   '√3/2',    '2π/3',     -0.5,                  Math.sqrt(3) / 2   ],
  135: ['-√2/2',  '√2/2',    '3π/4',     -Math.SQRT2 / 2,      Math.SQRT2 / 2     ],
  150: ['-√3/2',  '1/2',     '5π/6',     -Math.sqrt(3) / 2,    0.5                ],
  180: ['-1',     '0',       'π',        -1,                    0                  ],
  210: ['-√3/2',  '-1/2',    '7π/6',     -Math.sqrt(3) / 2,   -0.5                ],
  225: ['-√2/2',  '-√2/2',   '5π/4',     -Math.SQRT2 / 2,     -Math.SQRT2 / 2    ],
  240: ['-1/2',   '-√3/2',   '4π/3',     -0.5,                -Math.sqrt(3) / 2   ],
  270: ['0',      '-1',      '3π/2',      0,                   -1                  ],
  300: ['1/2',    '-√3/2',   '5π/3',      0.5,                -Math.sqrt(3) / 2   ],
  315: ['√2/2',   '-√2/2',   '7π/4',      Math.SQRT2 / 2,     -Math.SQRT2 / 2    ],
  330: ['√3/2',   '-1/2',    '11π/6',     Math.sqrt(3) / 2,   -0.5                ],
  360: ['1',      '0',       '2π',        1,                    0                  ],
};

// ---------------------------------------------------------------------------
// SVG layout constants
// ---------------------------------------------------------------------------

const CX = 250;          // centre x
const CY = 250;          // centre y
const R = 150;           // circle radius
const VB = 500;          // viewBox size
const TICK = 5;          // tick mark half-length
const DOT_R = 3;         // standard-angle dot radius
const ARROW = 8;         // arrowhead size

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert degrees → radians */
const deg2rad = (d: number) => (d * Math.PI) / 180;

/** Point on the circle at a given angle (degrees) */
const circlePoint = (deg: number): [number, number] => {
  const rad = deg2rad(deg);
  return [CX + R * Math.cos(rad), CY - R * Math.sin(rad)]; // SVG y is flipped
};

/** Point at a given angle and a custom radius from centre */
const pointAtRadius = (deg: number, r: number): [number, number] => {
  const rad = deg2rad(deg);
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)];
};

/** Build an SVG arc path from angle `from` to `to` (degrees) at radius `r` */
const arcPath = (from: number, to: number, r: number): string => {
  // Normalise so we always sweep counter-clockwise (positive direction)
  let start = from;
  let end = to;
  if (end <= start) end += 360;
  const sweep = end - start;
  const largeArc = sweep > 180 ? 1 : 0;

  const [x1, y1] = pointAtRadius(start, r);
  const [x2, y2] = pointAtRadius(end, r);

  // SVG arc: sweep-flag 0 = counter-clockwise in normal math, but SVG y is inverted
  // so we use sweep-flag 0 to go in the "positive angle" direction.
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`;
};

/**
 * Determine the best anchor & offset for a label at a given angle
 * so it sits outside the circle and doesn't overlap.
 */
const labelOffset = (deg: number, distance: number = 18): { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' } => {
  const rad = deg2rad(deg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  let anchor: 'start' | 'middle' | 'end' = 'middle';
  if (cos > 0.3) anchor = 'start';
  else if (cos < -0.3) anchor = 'end';

  return {
    dx: cos * distance,
    dy: -sin * distance, // SVG y flipped
    anchor,
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnitCircleRenderer({
  title,
  highlightAngles = [],
  showAllStandard = false,
  showRadians = true,
  showDegrees = true,
  showArc,
}: UnitCircleRendererProps) {

  // Memoize the standard angle entries for rendering
  const standardEntries = useMemo(
    () => Object.entries(STANDARD_ANGLES).filter(([d]) => Number(d) < 360),
    [],
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Optional title */}
      {title && (
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 text-center">
          {title}
        </h3>
      )}

      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full max-w-[480px] select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title || 'Unit circle diagram'}
      >
        {/* ---- Definitions (arrowheads, gradients) ---- */}
        <defs>
          {/* Arrowhead for axes */}
          <marker id="uc-arrow" markerWidth={ARROW} markerHeight={ARROW} refX={ARROW - 1} refY={ARROW / 2} orient="auto">
            <path d={`M0,0 L${ARROW},${ARROW / 2} L0,${ARROW} Z`} fill="#64748b" />
          </marker>
          {/* Soft shadow for labels */}
          <filter id="uc-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* ---- Background grid (subtle) ---- */}
        <rect x="0" y="0" width={VB} height={VB} fill="transparent" />

        {/* ---- Axes ---- */}
        {/* x-axis */}
        <line
          x1={CX - R - 40} y1={CY} x2={CX + R + 40} y2={CY}
          stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#uc-arrow)"
        />
        {/* y-axis */}
        <line
          x1={CX} y1={CY + R + 40} x2={CX} y2={CY - R - 40}
          stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#uc-arrow)"
        />

        {/* Axis labels */}
        <text x={CX + R + 48} y={CY + 4} fontSize={13} fill="#64748b" textAnchor="start" fontFamily="serif" fontStyle="italic">
          x
        </text>
        <text x={CX + R + 48} y={CY + 16} fontSize={9} fill="#94a3b8" textAnchor="start">
          (cos)
        </text>
        <text x={CX + 4} y={CY - R - 44} fontSize={13} fill="#64748b" textAnchor="start" fontFamily="serif" fontStyle="italic">
          y
        </text>
        <text x={CX + 14} y={CY - R - 34} fontSize={9} fill="#94a3b8" textAnchor="start">
          (sin)
        </text>

        {/* Axis tick marks at -1, 1 */}
        {/* x-axis ticks */}
        <line x1={CX + R} y1={CY - TICK} x2={CX + R} y2={CY + TICK} stroke="#94a3b8" strokeWidth={1} />
        <text x={CX + R} y={CY + 18} fontSize={11} fill="#64748b" textAnchor="middle">1</text>
        <line x1={CX - R} y1={CY - TICK} x2={CX - R} y2={CY + TICK} stroke="#94a3b8" strokeWidth={1} />
        <text x={CX - R} y={CY + 18} fontSize={11} fill="#64748b" textAnchor="middle">-1</text>
        {/* y-axis ticks */}
        <line x1={CX - TICK} y1={CY - R} x2={CX + TICK} y2={CY - R} stroke="#94a3b8" strokeWidth={1} />
        <text x={CX - 14} y={CY - R + 4} fontSize={11} fill="#64748b" textAnchor="end">1</text>
        <line x1={CX - TICK} y1={CY + R} x2={CX + TICK} y2={CY + R} stroke="#94a3b8" strokeWidth={1} />
        <text x={CX - 14} y={CY + R + 4} fontSize={11} fill="#64748b" textAnchor="end">-1</text>

        {/* ---- Unit circle ---- */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none" stroke="#2563eb" strokeWidth={2}
          opacity={0.85}
        />

        {/* ---- Show all standard angles ---- */}
        {showAllStandard && standardEntries.map(([degStr, entry]) => {
          const deg = Number(degStr);
          const [cosStr, sinStr, radStr, cosVal, sinVal] = entry;
          const [px, py] = [CX + R * cosVal, CY - R * sinVal];

          // Position the coordinate label outside the circle
          const offset = labelOffset(deg, 22);

          return (
            <g key={`std-${deg}`}>
              {/* Dot on the circle */}
              <circle cx={px} cy={py} r={DOT_R} fill="#2563eb" />

              {/* Coordinate label */}
              <text
                x={px + offset.dx}
                y={py + offset.dy}
                fontSize={8.5}
                fill="#334155"
                textAnchor={offset.anchor}
                dominantBaseline="central"
                filter="url(#uc-shadow)"
              >
                ({cosStr}, {sinStr})
              </text>

              {/* Degree / radian label — placed slightly further out */}
              {(showDegrees || showRadians) && (
                <text
                  x={px + offset.dx * 1.6}
                  y={py + offset.dy * 1.6 + (offset.dy >= 0 ? 10 : -10)}
                  fontSize={8}
                  fill="#94a3b8"
                  textAnchor={offset.anchor}
                  dominantBaseline="central"
                >
                  {showDegrees && `${deg}°`}
                  {showDegrees && showRadians && ' '}
                  {showRadians && radStr}
                </text>
              )}
            </g>
          );
        })}

        {/* ---- Highlighted angles ---- */}
        {highlightAngles.map((ha, idx) => {
          const deg = ((ha.angle % 360) + 360) % 360;
          const color = ha.color || '#ef4444';

          // Try lookup table first; fall back to computed values
          const entry = STANDARD_ANGLES[deg];
          const cosVal = entry ? entry[3] : Math.cos(deg2rad(deg));
          const sinVal = entry ? entry[4] : Math.sin(deg2rad(deg));
          const cosStr = entry ? entry[0] : cosVal.toFixed(3);
          const sinStr = entry ? entry[1] : sinVal.toFixed(3);
          const radStr = entry ? entry[2] : `${deg}°`;

          const [px, py] = [CX + R * cosVal, CY - R * sinVal];
          const offset = labelOffset(deg, 24);

          // Arc radius for the angle indicator
          const arcR = 30 + idx * 8; // stagger arcs if multiple

          return (
            <g key={`hl-${idx}-${deg}`}>
              {/* --- Reference triangle (dashed) --- */}
              {ha.showTriangle && (
                <g>
                  {/* Vertical dashed line from point to x-axis */}
                  <line
                    x1={px} y1={py} x2={px} y2={CY}
                    stroke={color} strokeWidth={1.2}
                    strokeDasharray="5,3" opacity={0.6}
                  />
                  {/* Horizontal dashed line from origin to foot */}
                  <line
                    x1={CX} y1={CY} x2={px} y2={CY}
                    stroke={color} strokeWidth={1.2}
                    strokeDasharray="5,3" opacity={0.6}
                  />
                  {/* cos label on x-axis */}
                  <text
                    x={(CX + px) / 2}
                    y={CY + 14}
                    fontSize={9}
                    fill={color}
                    textAnchor="middle"
                    fontStyle="italic"
                  >
                    cos {ha.label || `${deg}°`}
                  </text>
                  {/* sin label on vertical line */}
                  <text
                    x={px + (cosVal >= 0 ? 8 : -8)}
                    y={(CY + py) / 2}
                    fontSize={9}
                    fill={color}
                    textAnchor={cosVal >= 0 ? 'start' : 'end'}
                    fontStyle="italic"
                  >
                    sin {ha.label || `${deg}°`}
                  </text>
                </g>
              )}

              {/* --- Radius line from origin to point --- */}
              <line
                x1={CX} y1={CY} x2={px} y2={py}
                stroke={color} strokeWidth={2} strokeLinecap="round"
              />

              {/* --- Point dot --- */}
              <circle cx={px} cy={py} r={4.5} fill={color} stroke="#fff" strokeWidth={1.5} />

              {/* --- Angle arc from positive x-axis --- */}
              <path
                d={arcPath(0, deg, arcR)}
                fill="none" stroke={color} strokeWidth={1.5} opacity={0.7}
              />
              {/* Angle label at arc midpoint */}
              {(ha.label || showDegrees || showRadians) && (() => {
                const midAngle = deg / 2;
                const [lx, ly] = pointAtRadius(midAngle, arcR + 12);
                const displayLabel = ha.label
                  || (showDegrees ? `${deg}°` : '')
                  + (showDegrees && showRadians ? ' = ' : '')
                  + (showRadians ? radStr : '');
                return (
                  <text
                    x={lx} y={ly}
                    fontSize={10}
                    fill={color}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight={600}
                  >
                    {displayLabel}
                  </text>
                );
              })()}

              {/* --- Coordinate label --- */}
              {ha.showCoords && (
                <text
                  x={px + offset.dx * 1.3}
                  y={py + offset.dy * 1.3}
                  fontSize={10}
                  fill={color}
                  textAnchor={offset.anchor}
                  dominantBaseline="central"
                  fontWeight={600}
                  filter="url(#uc-shadow)"
                >
                  ({cosStr}, {sinStr})
                </text>
              )}
            </g>
          );
        })}

        {/* ---- Show arc between two angles ---- */}
        {showArc && (() => {
          const color = showArc.color || '#8b5cf6';
          const midAngle = (showArc.from + showArc.to) / 2;
          const [lx, ly] = pointAtRadius(midAngle, R + 24);
          return (
            <g>
              <path
                d={arcPath(showArc.from, showArc.to, R)}
                fill="none" stroke={color} strokeWidth={3.5}
                strokeLinecap="round" opacity={0.8}
              />
              {showArc.label && (
                <text
                  x={lx} y={ly}
                  fontSize={11}
                  fill={color}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontWeight={600}
                >
                  {showArc.label}
                </text>
              )}
            </g>
          );
        })()}

        {/* ---- Origin label ---- */}
        <text x={CX - 12} y={CY + 16} fontSize={11} fill="#64748b" textAnchor="end">
          O
        </text>
      </svg>
    </div>
  );
}

export default UnitCircleRenderer;
