'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import {
  histogramFeatureNames,
  type HistogramFigure,
} from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';

const COLOR_AXIS = '#1f2937';
const COLOR_BAR_FILL = '#93c5fd';
const COLOR_BAR_STROKE = '#1d4ed8';
const COLOR_MEAN = '#dc2626';
const COLOR_MEDIAN = '#16a34a';

export function HistogramRenderer({ figure }: { figure: HistogramFigure }) {
  const { bins, xMin, xMax, yMax, xLabel, yLabel, title, showCounts, mean, median, mode } = figure;
  const N = histogramFeatureNames;

  const W = 560;
  const H = 380;
  const PAD_L = 60;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 56;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xAt = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * plotW;
  const yAt = (y: number) => PAD_T + plotH - (y / yMax) * plotH;

  const yTicks: number[] = [];
  const yStep = niceStep(yMax / 5);
  for (let v = 0; v <= yMax + 1e-9; v += yStep) yTicks.push(v);

  return (
    <div
      className="histogram-renderer w-full flex flex-col items-center"
      data-feature={N.diagram}
      data-feature-label={title || 'histogram'}
    >
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* horizontal gridlines */}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* bars (touching) — wrapped so "bars" collective resolves. */}
        <g
          data-feature={N.bars}
          data-feature-label="bars"
          data-feature-cx={(PAD_L + plotW / 2) / W}
          data-feature-cy={(PAD_T + plotH / 2) / H}
          data-feature-w={plotW / W}
          data-feature-h={plotH / H}
        >
          {bins.map((b, i) => {
            const x1 = xAt(b.lower);
            const x2 = xAt(b.upper);
            const y1 = yAt(b.count);
            const yBottom = yAt(0);
            const bw = Math.max(1, x2 - x1);
            const bh = Math.max(0, yBottom - y1);
            return (
              <g
                key={i}
                data-feature={N.bin(i)}
                data-feature-label={`bin [${b.lower}, ${b.upper})`}
                data-feature-cx={(x1 + bw / 2) / W}
                data-feature-cy={(y1 + bh / 2) / H}
                data-feature-w={bw / W}
                data-feature-h={Math.max(bh, 20) / H}
              >
                <rect
                  x={x1} y={y1}
                  width={bw} height={bh}
                  fill={COLOR_BAR_FILL} fillOpacity={0.7} stroke={COLOR_BAR_STROKE} strokeWidth={1.2}
                />
                {showCounts && b.count > 0 && (
                  <text
                    x={(x1 + x2) / 2} y={y1 - 4}
                    fontSize={11} textAnchor="middle" fill={COLOR_BAR_STROKE} fontWeight={600}
                  >
                    {mode === 'relative' ? Number(b.count.toFixed(3)) : b.count}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* mean / median markers — when both present and close, push labels
            apart by anchoring in opposite directions so they don't overlap */}
        {(() => {
          const meanX = mean !== undefined && mean >= xMin && mean <= xMax ? xAt(mean) : null;
          const medianX = median !== undefined && median >= xMin && median <= xMax ? xAt(median) : null;
          const close = meanX !== null && medianX !== null && Math.abs(meanX - medianX) < 70;
          let meanAnchor: 'start' | 'middle' | 'end' = 'middle';
          let meanLabelX = meanX ?? 0;
          let medianAnchor: 'start' | 'middle' | 'end' = 'middle';
          let medianLabelX = medianX ?? 0;
          if (close && meanX !== null && medianX !== null) {
            if ((mean as number) <= (median as number)) {
              meanAnchor = 'end'; meanLabelX = meanX - 5;
              medianAnchor = 'start'; medianLabelX = medianX + 5;
            } else {
              meanAnchor = 'start'; meanLabelX = meanX + 5;
              medianAnchor = 'end'; medianLabelX = medianX - 5;
            }
          }
          return (
            <>
              {meanX !== null && (
                <g
                  data-feature={N.mean}
                  data-feature-label={`mean = ${mean}`}
                  data-feature-cx={meanX / W}
                  data-feature-cy={(PAD_T + plotH / 2) / H}
                  data-feature-w={28 / W}
                  data-feature-h={plotH / H}
                >
                  <line x1={meanX} y1={PAD_T} x2={meanX} y2={PAD_T + plotH} stroke={COLOR_MEAN} strokeWidth={2} strokeDasharray="6 4" />
                  <text x={meanLabelX} y={PAD_T + 12} fontSize={11} fill={COLOR_MEAN} fontWeight={600} textAnchor={meanAnchor}>
                    x̄ = {Number((mean as number).toFixed(2))}
                  </text>
                </g>
              )}
              {medianX !== null && (
                <g
                  data-feature={N.median}
                  data-feature-label={`median = ${median}`}
                  data-feature-cx={medianX / W}
                  data-feature-cy={(PAD_T + plotH / 2) / H}
                  data-feature-w={28 / W}
                  data-feature-h={plotH / H}
                >
                  <line x1={medianX} y1={PAD_T} x2={medianX} y2={PAD_T + plotH} stroke={COLOR_MEDIAN} strokeWidth={2} strokeDasharray="2 3" />
                  <text x={medianLabelX} y={PAD_T + (close ? 12 : 26)} fontSize={11} fill={COLOR_MEDIAN} fontWeight={600} textAnchor={medianAnchor}>
                    med = {Number((median as number).toFixed(2))}
                  </text>
                </g>
              )}
            </>
          );
        })()}

        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={COLOR_AXIS} strokeWidth={1.5} />

        {/* x-axis tick labels at bin edges (use distinct edges to avoid clutter) */}
        {Array.from(new Set(bins.flatMap((b) => [b.lower, b.upper]))).map((tx, i) => (
          <g key={`tx-${i}`}>
            <line x1={xAt(tx)} y1={PAD_T + plotH} x2={xAt(tx)} y2={PAD_T + plotH + 4} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={xAt(tx)} y={PAD_T + plotH + 16} fontSize={10} textAnchor="middle" fill="#374151">
              {Number(tx.toFixed(2))}
            </text>
          </g>
        ))}
        {/* y-axis tick labels */}
        {yTicks.map((ty, i) => (
          <g key={`ty-${i}`}>
            <line x1={PAD_L - 4} y1={yAt(ty)} x2={PAD_L} y2={yAt(ty)} stroke={COLOR_AXIS} strokeWidth={1} />
            <text x={PAD_L - 6} y={yAt(ty) + 4} fontSize={11} textAnchor="end" fill="#374151">
              {mode === 'relative' ? Number(ty.toFixed(2)) : ty}
            </text>
          </g>
        ))}

        {/* axis titles */}
        {xLabel && (
          <text x={PAD_L + plotW / 2} y={H - 14} fontSize={12} fontWeight={600} textAnchor="middle" fill="#374151">
            {xLabel}
          </text>
        )}
        <text
          x={16}
          y={PAD_T + plotH / 2}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
          fill="#374151"
          transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const norm = raw / base;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * base;
}
