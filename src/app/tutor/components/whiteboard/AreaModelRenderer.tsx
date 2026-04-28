'use client';

import React from 'react';
import type { AreaModelFigure } from '@/lib/tutor/diagrams/catalog/kinds/area-model';

const PALETTE = ['#dbeafe', '#dcfce7', '#fef3c7', '#fee2e2', '#ede9fe', '#fce7f3'];
const STROKE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AreaModelRenderer({ figure }: { figure: AreaModelFigure }) {
  const { rows, cols, cellLabels, showProducts, title } = figure;
  const totalH = rows.reduce((s, v) => s + v, 0);
  const totalW = cols.reduce((s, v) => s + v, 0);
  const W = 600;
  const H = 36 + (W * (totalH / totalW));
  const PAD = 60;
  const usableW = W - PAD - 16;
  const usableH = H - PAD;
  const px = (v: number) => (v / totalW) * usableW;
  const py = (v: number) => (v / totalH) * usableH;
  let yCursor = 32;
  return (
    <div className="area-model-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {/* Column labels along the top */}
        {(() => {
          let xCur = PAD;
          return cols.map((c, j) => {
            const w = px(c);
            const x = xCur + w / 2;
            xCur += w;
            return (
              <text key={`ch-${j}`} x={x} y={20} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={600}>
                {c}
              </text>
            );
          });
        })()}
        {/* Rows */}
        {rows.map((r, i) => {
          const h = py(r);
          let xCur = PAD;
          const yTop = yCursor;
          yCursor += h;
          return (
            <g key={i}>
              {/* Row label on left */}
              <text x={PAD - 10} y={yTop + h / 2 + 5} fontSize={14} textAnchor="end" fill="#374151" fontWeight={600}>
                {r}
              </text>
              {cols.map((c, j) => {
                const w = px(c);
                const x = xCur;
                xCur += w;
                const fill = PALETTE[(i * cols.length + j) % PALETTE.length];
                const stroke = STROKE[(i * cols.length + j) % STROKE.length];
                const labelOverride = cellLabels?.[i]?.[j];
                const product = showProducts ? (r * c) : undefined;
                return (
                  <g key={`cell-${i}-${j}`}>
                    <rect x={x} y={yTop} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} />
                    <text x={x + w / 2} y={yTop + h / 2 + 5} fontSize={14} textAnchor="middle" fill="#1f2937" fontWeight={600}>
                      {labelOverride ?? (product !== undefined ? product.toString() : `${r}×${c}`)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
