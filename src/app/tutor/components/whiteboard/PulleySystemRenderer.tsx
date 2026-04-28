'use client';

import React from 'react';
import type { PulleyFigure } from '@/lib/tutor/diagrams/catalog/kinds/physics';

export function PulleySystemRenderer({ figure }: { figure: PulleyFigure }) {
  const { fixedCount, movableCount, weightLabel, mechanicalAdvantage, effort, weight, title } = figure;
  const W = 480;
  const H = 380;
  const ceilingY = 40;
  const fixedSpacing = 50;
  const fixedStartX = (W - fixedCount * fixedSpacing) / 2 + fixedSpacing / 2;
  const movableY = ceilingY + 180;
  const movableStartX = (W - Math.max(movableCount, 1) * fixedSpacing) / 2 + fixedSpacing / 2;
  return (
    <div className="pulley-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px]">
        {/* Ceiling */}
        <line x1={20} y1={ceilingY} x2={W - 20} y2={ceilingY} stroke="#6b7280" strokeWidth={3} />
        <pattern id="hatch" width={10} height={10} patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="#9ca3af" strokeWidth="1" />
        </pattern>
        <rect x={20} y={ceilingY - 14} width={W - 40} height={14} fill="url(#hatch)" />
        {/* Fixed pulleys */}
        {Array.from({ length: fixedCount }).map((_, i) => {
          const cx = fixedStartX + i * fixedSpacing;
          return <circle key={`f-${i}`} cx={cx} cy={ceilingY + 14} r={12} fill="#e5e7eb" stroke="#374151" strokeWidth={2} />;
        })}
        {/* Movable pulleys */}
        {Array.from({ length: movableCount }).map((_, i) => {
          const cx = movableStartX + i * fixedSpacing;
          return <circle key={`m-${i}`} cx={cx} cy={movableY} r={12} fill="#fde68a" stroke="#92400e" strokeWidth={2} />;
        })}
        {/* Rope (schematic vertical lines) */}
        {Array.from({ length: mechanicalAdvantage }).map((_, k) => {
          const x = (W / (mechanicalAdvantage + 1)) * (k + 1);
          return <line key={`r-${k}`} x1={x} y1={ceilingY + 14} x2={x} y2={movableY} stroke="#1f2937" strokeWidth={1.5} />;
        })}
        {/* Weight */}
        <rect x={W / 2 - 32} y={movableY + 20} width={64} height={50} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2} rx={4} />
        <text x={W / 2} y={movableY + 50} fontSize={14} textAnchor="middle" fill="#1e3a8a" fontWeight={700}>
          {weightLabel}
          {weight !== undefined ? ` = ${weight}` : ''}
        </text>
        {/* Effort label */}
        <text x={W - 40} y={ceilingY + 60} fontSize={13} textAnchor="end" fill="#92400e" fontWeight={600}>
          Effort{effort !== undefined ? ` = ${effort.toFixed(2)}` : ''}
        </text>
        <text x={W / 2} y={H - 12} fontSize={13} textAnchor="middle" fill="#374151" fontWeight={600}>
          Mechanical advantage = {mechanicalAdvantage}
        </text>
      </svg>
    </div>
  );
}
