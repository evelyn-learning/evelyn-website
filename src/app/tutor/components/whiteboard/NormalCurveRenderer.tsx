'use client';

import React from 'react';
import {
  normalCurveFeatureNames,
  type NormalCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';

const COLOR_AXIS = '#1f2937';
const COLOR_CURVE = '#1f2937';
const COLOR_SHADE = '#60a5fa';
const COLOR_MEAN = '#dc2626';
const COLOR_SD = '#9ca3af';
const COLOR_MARK = '#16a34a';

export function NormalCurveRenderer({ figure }: { figure: NormalCurveFigure }) {
  const { mean, sd, xMin, xMax, shadeRegion, markValues, showSDLines, shadeArea, title, xLabel } = figure;
  const FN = normalCurveFeatureNames;

  const W = 560;
  const H = 360;
  const PAD_L = 50;
  const PAD_R = 24;
  const PAD_T = 36;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // Sample density.
  const N = 240;
  const dx = (xMax - xMin) / N;
  const pdf = (x: number) => Math.exp(-0.5 * Math.pow((x - mean) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI));
  const peak = pdf(mean);
  const yMax = peak * 1.10;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - (y / yMax) * plotH;

  // Curve points.
  const curve: Array<[number, number]> = [];
  for (let i = 0; i <= N; i += 1) {
    const x = xMin + i * dx;
    curve.push([x, pdf(x)]);
  }
  const curvePath = curve
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${xAt(x).toFixed(2)},${yAt(y).toFixed(2)}`)
    .join(' ');

  // Shade region polygon.
  let shadePath = '';
  if (shadeRegion) {
    const from = shadeRegion.from ?? xMin;
    const to = shadeRegion.to ?? xMax;
    const lo = Math.max(xMin, Math.min(from, to));
    const hi = Math.min(xMax, Math.max(from, to));
    if (hi > lo) {
      const seg: Array<[number, number]> = [];
      const M = 100;
      const ddx = (hi - lo) / M;
      for (let i = 0; i <= M; i += 1) {
        const x = lo + i * ddx;
        seg.push([x, pdf(x)]);
      }
      shadePath =
        `M${xAt(lo)},${yAt(0)} ` +
        seg.map(([x, y]) => `L${xAt(x).toFixed(2)},${yAt(y).toFixed(2)}`).join(' ') +
        ` L${xAt(hi)},${yAt(0)} Z`;
    }
  }

  const sdLines: number[] = [];
  if (showSDLines) {
    for (let k = -3; k <= 3; k += 1) {
      const x = mean + k * sd;
      if (x >= xMin && x <= xMax && k !== 0) sdLines.push(x);
    }
  }

  // X-axis ticks at major SD positions or evenly spaced.
  const xTicks: Array<{ value: number; label: string }> = [];
  if (showSDLines) {
    for (let k = -3; k <= 3; k += 1) {
      const x = mean + k * sd;
      if (x >= xMin && x <= xMax) xTicks.push({ value: x, label: String(Number(x.toFixed(2))) });
    }
  } else {
    const step = (xMax - xMin) / 6;
    for (let i = 0; i <= 6; i += 1) {
      const x = xMin + i * step;
      xTicks.push({ value: x, label: String(Number(x.toFixed(2))) });
    }
  }

  return (
    <div
      className="normal-curve-renderer w-full flex flex-col items-center"
      data-feature={FN.diagram}
      data-feature-label={title || `N(${mean}, ${sd})`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* shade */}
        {shadePath && (
          <path
            d={shadePath} fill={COLOR_SHADE} fillOpacity={0.5} stroke="none"
            data-feature={FN.shadeRegion}
            data-feature-label="shaded region"
            data-feature-cx={xAt(mean) / W}
            data-feature-cy={(PAD_T + plotH * 0.7) / H}
            data-feature-w={80 / W}
            data-feature-h={60 / H}
          />
        )}

        {/* curve */}
        <path
          d={curvePath} fill="none" stroke={COLOR_CURVE} strokeWidth={2.5}
          data-feature={FN.curve}
          data-feature-label="bell curve"
          data-feature-cx={xAt(mean) / W}
          data-feature-cy={yAt(peak * 0.5) / H}
          data-feature-w={40 / W}
          data-feature-h={24 / H}
        />

        {/* mean line */}
        {mean >= xMin && mean <= xMax && (
          <>
            <line x1={xAt(mean)} y1={yAt(0)} x2={xAt(mean)} y2={yAt(peak)} stroke={COLOR_MEAN} strokeWidth={1.8} strokeDasharray="6 4" />
            <text x={xAt(mean)} y={yAt(peak) - 6} fontSize={11} textAnchor="middle" fill={COLOR_MEAN} fontWeight={600}>
              μ = {Number(mean.toFixed(2))}
            </text>
          </>
        )}

        {/* SD lines — wrapped collectively */}
        {showSDLines && sdLines.length > 0 && (
          <g
            data-feature={FN.sdLines}
            data-feature-label="SD lines"
            data-feature-cx={xAt(mean) / W}
            data-feature-cy={(PAD_T + plotH * 0.7) / H}
            data-feature-w={plotW / W}
            data-feature-h={plotH * 0.4 / H}
          >
            {sdLines.map((x, i) => (
              <line
                key={`sd-${i}`}
                x1={xAt(x)} y1={yAt(0)} x2={xAt(x)} y2={yAt(pdf(x))}
                stroke={COLOR_SD} strokeWidth={1} strokeDasharray="2 3"
              />
            ))}
          </g>
        )}

        {/* mark values */}
        {markValues.map((m, i) => (
          <g
            key={`mk-${i}`}
            data-feature={FN.mark(i)}
            data-feature-label={m.label || `x = ${m.x}`}
            data-feature-cx={xAt(m.x) / W}
            data-feature-cy={(yAt(0) + yAt(pdf(m.x))) / 2 / H}
            data-feature-w={32 / W}
            data-feature-h={Math.abs(yAt(0) - yAt(pdf(m.x))) / H}
          >
            <line x1={xAt(m.x)} y1={yAt(0)} x2={xAt(m.x)} y2={yAt(pdf(m.x))} stroke={COLOR_MARK} strokeWidth={1.5} strokeDasharray="3 3" />
            {m.label && (
              <text x={xAt(m.x)} y={yAt(pdf(m.x)) - 4} fontSize={11} textAnchor="middle" fill={COLOR_MARK} fontWeight={600}>
                {m.label}
              </text>
            )}
          </g>
        ))}

        {/* shade area label */}
        {shadeArea !== undefined && (
          <text
            x={W - PAD_R - 4} y={PAD_T + 14}
            fontSize={12} textAnchor="end" fill={COLOR_SHADE} fontWeight={600}
            data-feature={FN.shadeArea}
            data-feature-label={`P = ${shadeArea}`}
            data-feature-cx={(W - PAD_R - 40) / W}
            data-feature-cy={(PAD_T + 14) / H}
            data-feature-w={80 / W}
            data-feature-h={18 / H}
          >
            P = {Number(shadeArea.toFixed(4))}
          </text>
        )}

        {/* axes */}
        <line x1={PAD_L} y1={yAt(0)} x2={PAD_L + plotW} y2={yAt(0)} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* tick labels */}
        {xTicks.map((t, i) => (
          <g key={`tx-${i}`}>
            <line x1={xAt(t.value)} y1={yAt(0)} x2={xAt(t.value)} y2={yAt(0) + 4} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={xAt(t.value)} y={yAt(0) + 16} fontSize={10} textAnchor="middle" fill="#374151">
              {t.label}
            </text>
          </g>
        ))}

        {/* axis title */}
        {xLabel && (
          <text x={PAD_L + plotW / 2} y={H - 14} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
            {xLabel}
          </text>
        )}
        <text
          x={W - PAD_R - 4}
          y={H - 38}
          fontSize={11}
          textAnchor="end"
          fill="#6b7280"
          fontStyle="italic"
        >
          σ = {Number(sd.toFixed(2))}
        </text>
      </svg>
    </div>
  );
}
