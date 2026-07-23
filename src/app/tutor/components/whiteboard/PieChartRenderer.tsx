'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { PieChartFigure } from '@/lib/tutor/diagrams/catalog/kinds/pie-chart';

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function PieChartRenderer({ figure }: { figure: PieChartFigure }) {
  const { slices, title } = figure;
  const W = 480;
  const H = 360;
  const cx = 180;
  const cy = 170;
  const r = 130;
  let acc = 0;
  return (
    <div className="pie-chart-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {slices.map((s, i) => {
          const a0 = -Math.PI / 2 + acc * 2 * Math.PI;
          acc += s.proportion;
          const a1 = -Math.PI / 2 + acc * 2 * Math.PI;
          const large = (a1 - a0) > Math.PI ? 1 : 0;
          const x0 = cx + r * Math.cos(a0);
          const y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1);
          const y1 = cy + r * Math.sin(a1);
          const color = s.color || PALETTE[i % PALETTE.length];
          const aMid = (a0 + a1) / 2;
          const lblX = cx + (r * 0.62) * Math.cos(aMid);
          const lblY = cy + (r * 0.62) * Math.sin(aMid);
          const d = s.proportion >= 1
            ? `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} Z`
            : `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
          return (
            <g key={i}>
              <path d={d} fill={color} stroke="#fff" strokeWidth={2} />
              {s.proportion >= 0.06 && (
                <text x={lblX} y={lblY} fontSize={12} textAnchor="middle" fill="#fff" fontWeight={700}>
                  {Math.round(s.proportion * 100)}%
                </text>
              )}
            </g>
          );
        })}
        {/* Legend on the right */}
        {slices.map((s, i) => {
          const color = s.color || PALETTE[i % PALETTE.length];
          const ly = 40 + i * 22;
          return (
            <g key={`lg-${i}`}>
              <rect x={340} y={ly - 10} width={14} height={14} fill={color} />
              <text x={362} y={ly + 1} fontSize={13} fill="#374151">
                {s.label} ({s.value})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
