'use client';

import React from 'react';
import type { PolarGraphFigure } from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';

const COLOR_AXIS = '#1f2937';
const COLOR_GRID = '#e5e7eb';
const COLOR_CURVE = '#0d9488';
const COLOR_SHADE = '#5eead4';
const COLOR_HL = '#dc2626';

export function PolarGraphRenderer({ figure }: { figure: PolarGraphFigure }) {
  const { curve, shadeRegion, highlightPoint, rMax, showAxes, exprLabel, title } = figure;

  const W = 480;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const plotR = Math.min(W, H) / 2 - 30;

  const xAt = (x: number) => cx + (x / rMax) * plotR;
  const yAt = (y: number) => cy - (y / rMax) * plotR;

  const curvePath = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.x).toFixed(2)},${yAt(p.y).toFixed(2)}`)
    .join(' ');

  // Shade region: closed polygon from origin → curve points → origin.
  let shadePath = '';
  if (shadeRegion && shadeRegion.length > 1) {
    shadePath = `M${cx},${cy} ` + shadeRegion
      .map((p) => `L${xAt(p.x).toFixed(2)},${yAt(p.y).toFixed(2)}`)
      .join(' ') + ' Z';
  }

  // Concentric grid circles at r = rMax/4, rMax/2, 3*rMax/4, rMax.
  const gridRs = [0.25, 0.5, 0.75, 1.0].map((f) => f * rMax);

  // Radial lines every 30°.
  const radialAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className="polar-graph-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {/* concentric circles */}
        {showAxes && gridRs.map((r, i) => (
          <circle key={`c-${i}`} cx={cx} cy={cy} r={(r / rMax) * plotR} fill="none" stroke={COLOR_GRID} strokeWidth={1} />
        ))}
        {/* radial lines */}
        {showAxes && radialAngles.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = cx + Math.cos(rad) * plotR;
          const y2 = cy - Math.sin(rad) * plotR;
          return <line key={`r-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke={COLOR_GRID} strokeWidth={1} />;
        })}
        {/* x and y axes */}
        {showAxes && (
          <>
            <line x1={cx - plotR} y1={cy} x2={cx + plotR} y2={cy} stroke={COLOR_AXIS} strokeWidth={1.2} />
            <line x1={cx} y1={cy - plotR} x2={cx} y2={cy + plotR} stroke={COLOR_AXIS} strokeWidth={1.2} />
          </>
        )}

        {/* shaded region */}
        {shadePath && <path d={shadePath} fill={COLOR_SHADE} fillOpacity={0.55} stroke="none" />}

        {/* curve */}
        <path d={curvePath} fill="none" stroke={COLOR_CURVE} strokeWidth={2.5} />

        {/* highlight point */}
        {highlightPoint && (
          <>
            <circle cx={xAt(highlightPoint.x)} cy={yAt(highlightPoint.y)} r={5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
            <text x={xAt(highlightPoint.x) + 8} y={yAt(highlightPoint.y) - 8} fontSize={11} fill={COLOR_HL} fontWeight={600}>
              {highlightPoint.label ?? `(r=${Number(highlightPoint.r.toFixed(2))}, θ=${Number(highlightPoint.theta.toFixed(2))})`}
            </text>
          </>
        )}

        {/* polar tick labels along positive x-axis */}
        {showAxes && gridRs.map((r, i) => (
          <text key={`tlr-${i}`} x={cx + (r / rMax) * plotR} y={cy + 12} fontSize={10} textAnchor="middle" fill="#6b7280">
            {Number(r.toFixed(2))}
          </text>
        ))}

        {/* angle labels */}
        {showAxes && (
          <>
            <text x={cx + plotR + 14} y={cy + 4} fontSize={11} fill="#6b7280">0</text>
            <text x={cx + 4} y={cy - plotR - 6} fontSize={11} fill="#6b7280">π/2</text>
            <text x={cx - plotR - 14} y={cy + 4} fontSize={11} fill="#6b7280" textAnchor="end">π</text>
            <text x={cx + 4} y={cy + plotR + 14} fontSize={11} fill="#6b7280">3π/2</text>
          </>
        )}

        {/* expression label */}
        {exprLabel && (
          <text x={20} y={26} fontSize={13} fontWeight={600} fill={COLOR_CURVE}>
            {exprLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
