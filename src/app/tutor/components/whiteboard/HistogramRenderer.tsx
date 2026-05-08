'use client';

import React from 'react';
import type { HistogramFigure } from '@/lib/tutor/diagrams/catalog/kinds/math-statistics';

const COLOR_AXIS = '#1f2937';
const COLOR_BAR_FILL = '#93c5fd';
const COLOR_BAR_STROKE = '#1d4ed8';
const COLOR_MEAN = '#dc2626';
const COLOR_MEDIAN = '#16a34a';

export function HistogramRenderer({ figure }: { figure: HistogramFigure }) {
  const { bins, xMin, xMax, yMax, xLabel, yLabel, title, showCounts, mean, median, mode } = figure;

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
    <div className="histogram-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* horizontal gridlines */}
        {yTicks.map((ty, i) => (
          <line key={`gy-${i}`} x1={PAD_L} y1={yAt(ty)} x2={PAD_L + plotW} y2={yAt(ty)} stroke="#e5e7eb" strokeWidth={1} />
        ))}

        {/* bars (touching) */}
        {bins.map((b, i) => {
          const x1 = xAt(b.lower);
          const x2 = xAt(b.upper);
          const y1 = yAt(b.count);
          const yBottom = yAt(0);
          return (
            <g key={i}>
              <rect
                x={x1}
                y={y1}
                width={Math.max(1, x2 - x1)}
                height={Math.max(0, yBottom - y1)}
                fill={COLOR_BAR_FILL}
                fillOpacity={0.7}
                stroke={COLOR_BAR_STROKE}
                strokeWidth={1.2}
              />
              {showCounts && b.count > 0 && (
                <text
                  x={(x1 + x2) / 2}
                  y={y1 - 4}
                  fontSize={11}
                  textAnchor="middle"
                  fill={COLOR_BAR_STROKE}
                  fontWeight={600}
                >
                  {mode === 'relative' ? Number(b.count.toFixed(3)) : b.count}
                </text>
              )}
            </g>
          );
        })}

        {/* mean / median markers */}
        {mean !== undefined && mean >= xMin && mean <= xMax && (
          <>
            <line x1={xAt(mean)} y1={PAD_T} x2={xAt(mean)} y2={PAD_T + plotH} stroke={COLOR_MEAN} strokeWidth={2} strokeDasharray="6 4" />
            <text x={xAt(mean)} y={PAD_T + 12} fontSize={11} fill={COLOR_MEAN} fontWeight={600} textAnchor="middle">
              x̄ = {Number(mean.toFixed(2))}
            </text>
          </>
        )}
        {median !== undefined && median >= xMin && median <= xMax && (
          <>
            <line x1={xAt(median)} y1={PAD_T} x2={xAt(median)} y2={PAD_T + plotH} stroke={COLOR_MEDIAN} strokeWidth={2} strokeDasharray="2 3" />
            <text x={xAt(median)} y={PAD_T + 26} fontSize={11} fill={COLOR_MEDIAN} fontWeight={600} textAnchor="middle">
              med = {Number(median.toFixed(2))}
            </text>
          </>
        )}

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
