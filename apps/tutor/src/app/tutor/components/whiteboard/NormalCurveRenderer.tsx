'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  normalCurveFeatureNames,
  type NormalCurveFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';
import { niceTicks, formatTick } from './_niceTicks';

const COLOR_AXIS = '#1f2937';
const COLOR_CURVE = '#1f2937';
const COLOR_SHADE = '#60a5fa';
const COLOR_MEAN = '#dc2626';
const COLOR_SD = '#9ca3af';
const COLOR_MARK = '#15803d';
const COLOR_AREA = '#1d4ed8';

export function NormalCurveRenderer({ figure }: { figure: NormalCurveFigure }) {
  const { mean, sd, xMin, xMax, shadeRegion, markValues, showSDLines, shadeArea, title, xLabel } = figure;
  const FN = normalCurveFeatureNames;

  const W = 560;
  const H = 380;
  const PAD_L = 50;
  const PAD_R = 24;
  const PAD_T = 58;
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

  // Clamp middle-anchored value labels into the viewBox so marks near the
  // plot edges never clip (ProjectileMotionRenderer estW/clampX pattern,
  // audit 2026-08-07).
  const estW = (s: string, fontSize: number) => s.length * fontSize * 0.58;

  // Numbers are written to the precision the spread calls for: two significant figures of σ
  // (σ = 15 → whole numbers, σ = 0.0004 → five decimals). A fixed two decimals printed every
  // tick of a small-σ curve as "0".
  const decimals = Math.min(8, Math.max(0, 1 - Math.floor(Math.log10(sd))));
  const fmt = (v: number) => {
    const out = Number(v.toFixed(decimals));
    return String(out === 0 ? 0 : out).replace(/^-/, '−');
  };
  const clampX = (x: number, w: number) => {
    const left = x - w / 2;
    const shift = Math.max(3 - left, 0) - Math.max(left + w - (W - 3), 0);
    return x + shift;
  };

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
      if (x >= xMin && x <= xMax) xTicks.push({ value: x, label: fmt(x) });
    }
  } else {
    const { ticks, step } = niceTicks(xMin, xMax, 7);
    for (const x of ticks) xTicks.push({ value: x, label: formatTick(x, step) });
  }

  // Labels over the curve: μ above the peak, each marked value on the outer side of its dashed
  // line (the side where the curve falls away). A label that would land on one already placed
  // moves up a line, so close marks stack instead of printing over each other.
  const placedBoxes: { l: number; r: number; t: number; b: number }[] = [];
  const place = (anchorX: number, baseY: number, text: string, side: 'left' | 'right' | 'middle') => {
    const w = estW(text, 11);
    let l = side === 'middle' ? anchorX - w / 2 : side === 'right' ? anchorX + 5 : anchorX - 5 - w;
    l = Math.min(Math.max(l, 3), W - 3 - w);
    let y = baseY;
    const hit = (yy: number) => placedBoxes.some((p) => l < p.r + 4 && l + w > p.l - 4 && yy - 11 < p.b && yy + 3 > p.t);
    while (hit(y) && y > 14) y -= 14;
    placedBoxes.push({ l, r: l + w, t: y - 11, b: y + 3 });
    return { x: l, y, w, moved: y < baseY - 1 };
  };
  const meanText = `μ = ${fmt(mean)}`;
  const meanInView = mean >= xMin && mean <= xMax;
  const meanSpot = meanInView ? place(xAt(mean), yAt(peak) - 8, meanText, 'middle') : null;
  const markSpots = markValues.map((m) => {
    if (!m.label) return null;
    // a mark on the mean itself is the μ line, already labelled
    if (meanInView && Math.abs(m.x - mean) < sd * 1e-6) return null;
    const side = Math.abs(m.x - mean) < sd * 0.15 ? 'middle' : m.x > mean ? 'right' : 'left';
    return place(xAt(m.x), yAt(pdf(m.x)) - 7, m.label, side);
  });

  return (
    <div
      className="normal-curve-renderer w-full flex flex-col items-center"
      data-feature={FN.diagram}
      data-feature-label={title || `N(${mean}, ${sd})`}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
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
            {/* a label moved up out of a neighbour's way keeps a thin leader to its own line */}
            {m.label && markSpots[i]?.moved && (
              <line
                x1={xAt(m.x)} y1={yAt(pdf(m.x))}
                x2={Math.min(Math.max(xAt(m.x), markSpots[i]!.x + 4), markSpots[i]!.x + markSpots[i]!.w - 4)} y2={markSpots[i]!.y + 3}
                stroke={COLOR_MARK} strokeWidth={1} opacity={0.7}
              />
            )}
            {m.label && markSpots[i] && (
              <text x={markSpots[i]!.x} y={markSpots[i]!.y} fontSize={11} fill={COLOR_MARK} fontWeight={600} stroke="#fff" strokeWidth={3} paintOrder="stroke">
                {m.label}
              </text>
            )}
          </g>
        ))}

        {/* μ label last, with a halo, so a neighbour's leader never strikes it through */}
        {meanSpot && (
          <text x={meanSpot.x} y={meanSpot.y} fontSize={11} fill={COLOR_MEAN} fontWeight={600} stroke="#fff" strokeWidth={3.5} paintOrder="stroke">{meanText}</text>
        )}

        {/* shade area label */}
        {shadeArea !== undefined && (
          <text
            x={W - PAD_R - 4} y={16}
            fontSize={12} textAnchor="end" fill={COLOR_AREA} fontWeight={600}
            data-feature={FN.shadeArea}
            data-feature-label={`P = ${shadeArea}`}
            data-feature-cx={(W - PAD_R - 40) / W}
            data-feature-cy={16 / H}
            data-feature-w={80 / W}
            data-feature-h={18 / H}
          >
            shaded area = {Number(shadeArea.toFixed(4))}
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
        <text x={PAD_L} y={16} fontSize={12} fill="#4b5563" fontWeight={600}>
          σ = {fmt(sd)}
        </text>
      </svg>
    </div>
  );
}
