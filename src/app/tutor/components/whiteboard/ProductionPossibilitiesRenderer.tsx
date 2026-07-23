'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  productionPossibilitiesFeatureNames,
  type PPCFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/economics';

const COLOR_ON = '#16a34a';      // green
const COLOR_INSIDE = '#dc2626';  // red
const COLOR_OUTSIDE = '#ea580c'; // orange
const COLOR_CURVE = '#1f2937';
const COLOR_SHIFT = '#3b82f6';
const COLOR_AXIS = '#1f2937';

function colorFor(position: 'inside' | 'on' | 'outside' | undefined): string {
  switch (position) {
    case 'inside': return COLOR_INSIDE;
    case 'outside': return COLOR_OUTSIDE;
    case 'on':
    default: return COLOR_ON;
  }
}

export function ProductionPossibilitiesRenderer({ figure }: { figure: PPCFigure }) {
  const { xAxis, yAxis, curve, points, shift, title } = figure;
  const N = productionPossibilitiesFeatureNames;
  const W = 560;
  // PAD_B extended from 64 → 100 to leave room for the legend strip
  // BELOW the x-axis label. Total H bumped from 420 → 460.
  const H = 460;
  const PAD_L = 70;
  const PAD_R = 28;
  const PAD_T = 36;
  const PAD_B = 100;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Account for shifted curve in axis range so it stays in view.
  const xMaxView = shift && shift.direction === 'out' ? xAxis.max * shift.factor : xAxis.max;
  const yMaxView = shift && shift.direction === 'out' ? yAxis.max * shift.factor : yAxis.max;

  const xToPx = (v: number) => PAD_L + (v / xMaxView) * plotW;
  const yToPx = (v: number) => PAD_T + plotH - (v / yMaxView) * plotH;

  /** Build the SVG path for the PPC. */
  function pathFor(xMax: number, yMax: number): string {
    if (curve === 'linear') {
      return `M ${xToPx(0)} ${yToPx(yMax)} L ${xToPx(xMax)} ${yToPx(0)}`;
    }
    const segments = 32;
    const pts: string[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = xMax * t;
      const y = yMax * Math.sqrt(Math.max(0, 1 - t * t));
      pts.push(`${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(2)} ${yToPx(y).toFixed(2)}`);
    }
    return pts.join(' ');
  }

  const mainPath = pathFor(xAxis.max, yAxis.max);
  const shiftPath = shift
    ? pathFor(
        shift.direction === 'out' ? xAxis.max * shift.factor : xAxis.max / shift.factor,
        shift.direction === 'out' ? yAxis.max * shift.factor : yAxis.max / shift.factor,
      )
    : null;

  // Y-axis tick step.
  function niceStep(span: number): number {
    const niceSteps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
    for (const s of niceSteps) {
      const ticks = span / s;
      if (ticks >= 4 && ticks <= 8) return s;
    }
    return span / 5;
  }
  const xStep = niceStep(xMaxView);
  const yStep = niceStep(yMaxView);
  const xTicks: number[] = [];
  for (let v = 0; v <= xMaxView + 1e-9; v += xStep) xTicks.push(Number(v.toFixed(6)));
  const yTicks: number[] = [];
  for (let v = 0; v <= yMaxView + 1e-9; v += yStep) yTicks.push(Number(v.toFixed(6)));

  return (
    <div
      className="ppc-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'PPC'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Grid lines */}
        {xTicks.map((t) => (
          <line
            key={`xg-${t}`}
            x1={xToPx(t)}
            y1={PAD_T}
            x2={xToPx(t)}
            y2={PAD_T + plotH}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        ))}
        {yTicks.map((t) => (
          <line
            key={`yg-${t}`}
            x1={PAD_L}
            y1={yToPx(t)}
            x2={PAD_L + plotW}
            y2={yToPx(t)}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* Y-axis ticks + labels */}
        {yTicks.map((t) => (
          <g key={`yt-${t}`}>
            <line x1={PAD_L - 4} y1={yToPx(t)} x2={PAD_L} y2={yToPx(t)} stroke={COLOR_AXIS} />
            <text x={PAD_L - 8} y={yToPx(t) + 4} fontSize={11} textAnchor="end" fill="#6b7280">
              {t}
            </text>
          </g>
        ))}
        {/* X-axis ticks + labels */}
        {xTicks.map((t) => (
          <g key={`xt-${t}`}>
            <line x1={xToPx(t)} y1={PAD_T + plotH} x2={xToPx(t)} y2={PAD_T + plotH + 4} stroke={COLOR_AXIS} />
            <text x={xToPx(t)} y={PAD_T + plotH + 18} fontSize={11} textAnchor="middle" fill="#6b7280">
              {t}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={PAD_L + plotW / 2}
          y={PAD_T + plotH + 38}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
        >
          {xAxis.label}
        </text>
        <text
          x={20}
          y={PAD_T + plotH / 2}
          fontSize={13}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 20 ${PAD_T + plotH / 2})`}
        >
          {yAxis.label}
        </text>

        {/* Shifted PPC (drawn first, behind main) */}
        {shiftPath && (
          <g
            data-feature={N.shiftedCurve}
            data-feature-label={shift?.direction === 'out' ? 'PPC growth' : 'PPC contraction'}
            data-feature-cx={xToPx((shift!.direction === 'out' ? xAxis.max * shift!.factor : xAxis.max / shift!.factor) * 0.7) / W}
            data-feature-cy={yToPx((shift!.direction === 'out' ? yAxis.max * shift!.factor : yAxis.max / shift!.factor) * 0.7) / H}
            data-feature-w={80 / W}
            data-feature-h={28 / H}
          >
            <path d={shiftPath} stroke={COLOR_SHIFT} strokeWidth={2} fill="none" strokeDasharray="6 4" />
            {shift?.label && (
              <text
                x={xToPx((shift.direction === 'out' ? xAxis.max * shift.factor : xAxis.max / shift.factor) * 0.7)}
                y={yToPx((shift.direction === 'out' ? yAxis.max * shift.factor : yAxis.max / shift.factor) * 0.7) - 6}
                fontSize={11}
                fill={COLOR_SHIFT}
                fontWeight={600}
                textAnchor="middle"
              >
                {shift.label}
              </text>
            )}
          </g>
        )}

        {/* Main PPC */}
        <g
          data-feature={N.curve}
          data-feature-label="PPC"
          data-feature-cx={xToPx(xAxis.max * 0.55) / W}
          data-feature-cy={yToPx(yAxis.max * 0.55) / H}
          data-feature-w={120 / W}
          data-feature-h={80 / H}
        >
          <path d={mainPath} stroke={COLOR_CURVE} strokeWidth={2.5} fill="none" />
          <text
            x={xToPx(xAxis.max * 0.7)}
            y={yToPx(yAxis.max * 0.7) - 8}
            fontSize={12}
            fill={COLOR_CURVE}
            fontWeight={600}
            textAnchor="middle"
          >
            PPC
          </text>
        </g>

        {/* Points */}
        {points.map((p, i) => {
          const cx = xToPx(p.x);
          const cy = yToPx(p.y);
          // Color by zone so dots always match the legend (on=green /
          // inside=red / outside=orange). Ignore an arbitrary brain-supplied
          // p.color (e.g. "blue" for a "before growth" point) that would
          // otherwise put an unlabeled color on the board.
          const fill = colorFor(p.position);
          return (
            <g
              key={`pt-${i}`}
              data-feature={N.point(p.label, i)}
              data-feature-label={p.label ? `point ${p.label}` : `point ${i + 1}`}
              data-feature-cx={cx / W}
              data-feature-cy={cy / H}
              data-feature-w={40 / W}
              data-feature-h={32 / H}
            >
              <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
              {p.label && (
                <text
                  x={cx + 10}
                  y={cy - 8}
                  fontSize={13}
                  fontWeight={700}
                  fill={fill}
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend — placed BELOW the plot AND the x-axis title so it
            never overlaps a high-y point (e.g. an "outside" point near
            the top-right of the curve). Previously top-right inside
            the plot, which obscured points like (80, 80). */}
        <g transform={`translate(${PAD_L + 20}, ${PAD_T + plotH + 60})`}>
          <circle cx={6} cy={10} r={5} fill={COLOR_ON} />
          <text x={16} y={14} fontSize={11} fill="#374151">on curve (efficient)</text>
          <circle cx={146} cy={10} r={5} fill={COLOR_INSIDE} />
          <text x={156} y={14} fontSize={11} fill="#374151">inside (inefficient)</text>
          <circle cx={282} cy={10} r={5} fill={COLOR_OUTSIDE} />
          <text x={292} y={14} fontSize={11} fill="#374151">outside (unattainable)</text>
        </g>
      </svg>
    </div>
  );
}
