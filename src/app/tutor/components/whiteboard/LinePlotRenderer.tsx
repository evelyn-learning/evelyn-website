'use client';

import React from 'react';
import type { LinePlotFigure } from '@/lib/tutor/diagrams/catalog/kinds/line-plot';

const DOT_R = 6;

export function LinePlotRenderer({ figure }: { figure: LinePlotFigure }) {
  const { axisValues, frequencies, title, xLabel } = figure;
  const W = 640;
  const PAD_X = 50;
  const usableW = W - PAD_X * 2;
  const stepX = usableW / Math.max(axisValues.length - 1, 1);
  const maxFreq = Math.max(...frequencies, 1);
  const dotStack = (DOT_R * 2 + 4);
  const baseY = 40 + maxFreq * dotStack;
  const H = baseY + 50;
  return (
    <div className="line-plot-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {/* Axis */}
        <line x1={PAD_X - 12} y1={baseY} x2={W - PAD_X + 12} y2={baseY} stroke="#1f2937" strokeWidth={2} />
        <polygon points={`${PAD_X - 12},${baseY} ${PAD_X - 4},${baseY - 5} ${PAD_X - 4},${baseY + 5}`} fill="#1f2937" />
        <polygon points={`${W - PAD_X + 12},${baseY} ${W - PAD_X + 4},${baseY - 5} ${W - PAD_X + 4},${baseY + 5}`} fill="#1f2937" />
        {axisValues.map((v, i) => {
          const x = PAD_X + i * stepX;
          const f = frequencies[i];
          return (
            <g key={i}>
              <line x1={x} y1={baseY - 6} x2={x} y2={baseY + 6} stroke="#1f2937" strokeWidth={1.5} />
              <text x={x} y={baseY + 22} fontSize={12} textAnchor="middle" fill="#374151">
                {Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, '')}
              </text>
              {Array.from({ length: f }).map((_, k) => (
                <circle
                  key={k}
                  cx={x}
                  cy={baseY - 12 - k * dotStack}
                  r={DOT_R}
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth={1.5}
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
