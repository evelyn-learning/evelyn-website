'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { LinePlotFigure } from '@/lib/tutor/diagrams/catalog/kinds/line-plot';

const W = 640;
const PAD_X = 56;
const MAX_STACK_H = 300;

function fmt(v: number): string {
  const s = Number.isInteger(v) ? String(v) : v.toFixed(4).replace(/\.?0+$/, '');
  return s.replace(/^-/, '−');
}

export function LinePlotRenderer({ figure }: { figure: LinePlotFigure }) {
  const { axisValues, frequencies, title, xLabel } = figure;
  // The axis is a true number line: a value's x is proportional to the value.
  // (Older figures carry no min/max/ticks — fall back to the data's range.)
  const dataLo = Math.min(...axisValues);
  const dataHi = Math.max(...axisValues);
  let min = figure.min ?? dataLo;
  let max = figure.max ?? dataHi;
  if (!(max > min)) { min -= 1; max += 1; }
  const ticks = figure.ticks && figure.ticks.length ? figure.ticks : axisValues;
  const usableW = W - PAD_X * 2;
  const xOf = (v: number) => PAD_X + ((v - min) / (max - min)) * usableW;

  // Dot size: never wider than the gap between neighbouring data values, and
  // the tallest stack never taller than the plot allows.
  const maxFreq = Math.max(...frequencies, 1);
  const present = axisValues.filter((_, i) => frequencies[i] > 0).sort((a, b) => a - b);
  let minGapPx = usableW;
  for (let i = 1; i < present.length; i++) minGapPx = Math.min(minGapPx, xOf(present[i]) - xOf(present[i - 1]));
  const dotD = Math.max(5, Math.min(14, minGapPx - 3, MAX_STACK_H / maxFreq - 2));
  const dotR = dotD / 2;
  const dotStack = dotD + Math.max(1.5, Math.min(4, dotD * 0.3));

  // Tick numerals: print every k-th so neighbours never touch.
  const widest = Math.max(...ticks.map((t) => fmt(t).length)) * 12 * 0.6;
  const tickGap = ticks.length > 1 ? Math.abs(xOf(ticks[1]) - xOf(ticks[0])) : usableW;
  let every = 1;
  for (const k of [1, 2, 4, 5, 10, 20, 50]) { every = k; if (k * tickGap >= widest + 8) break; }

  const baseY = 20 + maxFreq * dotStack + 6;
  const H = baseY + (xLabel ? 58 : 36);
  return (
    <div className="line-plot-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {/* Axis */}
        <line x1={PAD_X - 26} y1={baseY} x2={W - PAD_X + 26} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        <polygon points={`${PAD_X - 30},${baseY} ${PAD_X - 21},${baseY - 5} ${PAD_X - 21},${baseY + 5}`} fill="#1f2937" />
        <polygon points={`${W - PAD_X + 30},${baseY} ${W - PAD_X + 21},${baseY - 5} ${W - PAD_X + 21},${baseY + 5}`} fill="#1f2937" />
        {ticks.map((v, i) => {
          const x = xOf(v);
          const labelled = i % every === 0;
          return (
            <g key={`t-${i}`}>
              <line x1={x} y1={baseY - (labelled ? 6 : 4)} x2={x} y2={baseY + (labelled ? 6 : 4)} stroke="#1f2937" strokeWidth={labelled ? 1.5 : 1} />
              {labelled && (
                <text x={x} y={baseY + 22} fontSize={12} textAnchor="middle" fill="#374151">
                  {fmt(v)}
                </text>
              )}
            </g>
          );
        })}
        {axisValues.map((v, i) => {
          const x = xOf(v);
          const f = frequencies[i];
          return (
            <g key={`d-${i}`}>
              {Array.from({ length: f }).map((_, k) => (
                <circle
                  key={k}
                  cx={x}
                  cy={baseY - 8 - dotR - k * dotStack}
                  r={dotR}
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth={dotD < 8 ? 1 : 1.5}
                />
              ))}
            </g>
          );
        })}
        {xLabel && (
          <text x={W / 2} y={H - 10} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
            {xLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
