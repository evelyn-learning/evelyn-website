'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  slopeFieldFeatureNames,
  type SlopeFieldFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-calculus';
import { smoothPath } from './_smoothPath';

const COLOR_AXIS = '#1f2937';
const COLOR_VEC = '#475569';
const COLOR_SOL = '#dc2626';
const COLOR_HL = '#16a34a';

export function SlopeFieldRenderer({ figure }: { figure: SlopeFieldFigure }) {
  const { samples, xMin, xMax, yMin, yMax, solutionCurve, highlightPoint, exprLabel, title } = figure;
  const N = slopeFieldFeatureNames;

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
    ? smoothPath(solutionCurve, xAt, yAt)
    : '';

  return (
    <div
      className="slope-field-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'slope field'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      {/* equation as a caption above the plot — the slope field fills the plot,
          so an in-plot label always collided with segments + the border. */}
      {exprLabel && <div className="text-xs -mt-1 mb-2" style={{ color: COLOR_SOL }}>{exprLabel}</div>}
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

        {/* slope segments — wrapped so scribbling "slope segments" hits the field. */}
        <g
          data-feature={N.field}
          data-feature-label="slope segments"
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          {samples.map((s, i) => {
            if (!Number.isFinite(s.slope)) return null;
            const xScale = plotW / (xMax - xMin);
            const yScale = plotH / (yMax - yMin);
            const vxScreen = xScale;
            const vyScreen = -s.slope * yScale;
            const mag = Math.hypot(vxScreen, vyScreen) || 1;
            const ux = (vxScreen / mag) * segLenPx;
            const uy = (vyScreen / mag) * segLenPx;
            const cx = xAt(s.x);
            const cy = yAt(s.y);
            return (
              <line
                key={i}
                x1={cx - ux / 2} y1={cy - uy / 2}
                x2={cx + ux / 2} y2={cy + uy / 2}
                stroke={COLOR_VEC} strokeWidth={1.5} strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* solution curve */}
        {solPath && (
          <path
            d={solPath} fill="none" stroke={COLOR_SOL} strokeWidth={2.5}
            data-feature={N.solutionCurve}
            data-feature-label="solution curve"
            data-feature-cx={(PAD_L + plotW / 2) / W}
            data-feature-cy={(PAD_T + plotH / 2) / H}
            data-feature-w={40 / W}
            data-feature-h={24 / H}
          />
        )}

        {/* highlight */}
        {highlightPoint && (
          <circle
            cx={xAt(highlightPoint.x)} cy={yAt(highlightPoint.y)} r={4.5}
            fill={COLOR_HL} stroke="#fff" strokeWidth={2}
            data-feature={N.highlightPoint}
            data-feature-label={`(${highlightPoint.x}, ${highlightPoint.y})`}
            data-feature-cx={xAt(highlightPoint.x) / W}
            data-feature-cy={yAt(highlightPoint.y) / H}
            data-feature-w={32 / W}
            data-feature-h={32 / H}
          />
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

        {/* equation now renders as a caption above the plot (see above). */}
        <text x={PAD_L + plotW / 2} y={H - 8} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">x</text>
        <text x={16} y={PAD_T + plotH / 2} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151" transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}>y</text>
      </svg>
    </div>
  );
}
