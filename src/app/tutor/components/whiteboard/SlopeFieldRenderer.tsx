'use client';

import React from 'react';
import type { SlopeFieldFigure } from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';

const COLOR_AXIS = '#1f2937';
const COLOR_VEC = '#475569';
const COLOR_SOL = '#dc2626';
const COLOR_HL = '#16a34a';

export function SlopeFieldRenderer({ figure }: { figure: SlopeFieldFigure }) {
  const { samples, xMin, xMax, yMin, yMax, solutionCurve, highlightPoint, exprLabel, title } = figure;

  const W = 520;
  const H = 440;
  const PAD_L = 56;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  // Determine grid step from samples for a sensible vector length.
  const xs = Array.from(new Set(samples.map((s) => Number(s.x.toFixed(4))))).sort((a, b) => a - b);
  const ys = Array.from(new Set(samples.map((s) => Number(s.y.toFixed(4))))).sort((a, b) => a - b);
  const dx = xs.length > 1 ? xs[1] - xs[0] : (xMax - xMin) / 12;
  const dy = ys.length > 1 ? ys[1] - ys[0] : (yMax - yMin) / 12;
  const gridSpacePx = Math.min(Math.abs(xAt(dx) - xAt(0)), Math.abs(yAt(0) - yAt(dy)));
  const segLenPx = Math.max(8, gridSpacePx * 0.45);

  const xTicks: number[] = [];
  const xStep = (xMax - xMin) / 4;
  for (let i = 0; i <= 4; i += 1) xTicks.push(xMin + xStep * i);
  const yTicks: number[] = [];
  const yStep = (yMax - yMin) / 4;
  for (let i = 0; i <= 4; i += 1) yTicks.push(yMin + yStep * i);

  const solPath = solutionCurve && solutionCurve.length > 1
    ? solutionCurve.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.x).toFixed(2)},${yAt(p.y).toFixed(2)}`).join(' ')
    : '';

  return (
    <div className="slope-field-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]">
        {/* gridlines */}
        {xTicks.map((tx, i) => (
          <line key={`gx-${i}`} x1={xAt(tx)} y1={PAD_T} x2={xAt(tx)} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}
        {/* axes */}
        {yMin <= 0 && yMax >= 0 && (
          <line x1={PAD_L} y1={yAt(0)} x2={PAD_L + plotW} y2={yAt(0)} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        {xMin <= 0 && xMax >= 0 && (
          <line x1={xAt(0)} y1={PAD_T} x2={xAt(0)} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.2} />
        )}
        <rect x={PAD_L} y={PAD_T} width={plotW} height={plotH} fill="none" stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* slope segments */}
        {samples.map((s, i) => {
          if (!Number.isFinite(s.slope)) return null;
          // Convert slope (data units) to screen vector. dx,dy in data units, then scale to segLenPx.
          const xScale = plotW / (xMax - xMin);
          const yScale = plotH / (yMax - yMin);
          // direction vector in screen space: (1, -slope) scaled by data->screen
          const vxScreen = xScale; // dx_data = 1 → vx_screen = xScale
          const vyScreen = -s.slope * yScale; // dy_data = slope → vy_screen = -slope*yScale
          const mag = Math.hypot(vxScreen, vyScreen) || 1;
          const ux = (vxScreen / mag) * segLenPx;
          const uy = (vyScreen / mag) * segLenPx;
          const cx = xAt(s.x);
          const cy = yAt(s.y);
          return (
            <line
              key={i}
              x1={cx - ux / 2}
              y1={cy - uy / 2}
              x2={cx + ux / 2}
              y2={cy + uy / 2}
              stroke={COLOR_VEC}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* solution curve */}
        {solPath && <path d={solPath} fill="none" stroke={COLOR_SOL} strokeWidth={2.5} />}

        {/* highlight */}
        {highlightPoint && (
          <circle cx={xAt(highlightPoint.x)} cy={yAt(highlightPoint.y)} r={4.5} fill={COLOR_HL} stroke="#fff" strokeWidth={2} />
        )}

        {/* tick labels */}
        {xTicks.map((tx, i) => (
          <text key={`tlx-${i}`} x={xAt(tx)} y={PAD_T + plotH + 16} fontSize={11} textAnchor="middle" fill="#374151">
            {Number(tx.toFixed(2))}
          </text>
        ))}
        {yTicks.map((ty, i) => (
          <text key={`tly-${i}`} x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
            {Number(ty.toFixed(2))}
          </text>
        ))}

        {/* labels */}
        {exprLabel && (
          <text x={PAD_L + 8} y={PAD_T + 14} fontSize={13} fontWeight={600} fill={COLOR_SOL}>
            {exprLabel}
          </text>
        )}
        <text x={PAD_L + plotW / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>
      </svg>
    </div>
  );
}
