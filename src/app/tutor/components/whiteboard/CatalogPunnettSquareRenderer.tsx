'use client';

import React from 'react';
import type { PunnettSquareFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogPunnettSquareRenderer({ figure }: { figure: PunnettSquareFigure }) {
  const { parentA, parentB, alleles, cells, title } = figure;
  const cell = 76;
  const W = cell * 3 + 16;
  const H = cell * 3 + 50;
  return (
    <div className="punnett-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px]">
        {/* Parent A label (top-left, above column gametes) */}
        <text x={cell + 16 + cell} y={20} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={700}>{parentA}</text>
        <text x={cell / 2 + 8} y={cell + 16 + cell / 2} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={700} transform={`rotate(-90 ${cell / 2 + 8} ${cell + 16 + cell / 2})`}>{parentB}</text>
        {/* Top row: A's gametes */}
        {alleles.aGametes.map((g, i) => (
          <text key={`ag-${i}`} x={cell + 16 + i * cell + cell / 2} y={cell + 6} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={700}>{g}</text>
        ))}
        {/* Left column: B's gametes */}
        {alleles.bGametes.map((g, i) => (
          <text key={`bg-${i}`} x={cell - 6} y={cell + 16 + i * cell + cell / 2 + 5} fontSize={16} textAnchor="end" fill="#1f2937" fontWeight={700}>{g}</text>
        ))}
        {/* Cells */}
        {cells.map((row, r) => row.map((c, k) => (
          <g key={`c-${r}-${k}`}>
            <rect x={cell + 16 + k * cell} y={cell + 16 + r * cell} width={cell} height={cell} fill="#f9fafb" stroke="#1f2937" strokeWidth={1.5} />
            <text x={cell + 16 + k * cell + cell / 2} y={cell + 16 + r * cell + cell / 2 + 8} fontSize={20} textAnchor="middle" fill="#1f2937" fontWeight={700}>{c}</text>
          </g>
        )))}
      </svg>
    </div>
  );
}
