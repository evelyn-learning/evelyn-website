'use client';

import React from 'react';
import { punnettSquareFeatureNames, type PunnettSquareFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogPunnettSquareRenderer({ figure }: { figure: PunnettSquareFigure }) {
  const { parentA, parentB, alleles, cells, title } = figure;
  const N = punnettSquareFeatureNames;
  const cell = 76;
  const W = cell * 3 + 16;
  const H = cell * 3 + 50;
  return (
    <div className="punnett-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[420px]"
        data-feature={N.punnett}
        data-feature-label={title || `${parentA} × ${parentB}`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* Parent A label */}
        <g
          data-feature={N.parentA}
          data-feature-label={`Parent ${parentA}`}
          data-feature-cx={(cell + 16 + cell) / W}
          data-feature-cy={20 / H}
          data-feature-w={(cell * 2) / W}
          data-feature-h={24 / H}
        >
          <text x={cell + 16 + cell} y={20} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={700}>{parentA}</text>
        </g>
        <g
          data-feature={N.parentB}
          data-feature-label={`Parent ${parentB}`}
          data-feature-cx={(cell / 2 + 8) / W}
          data-feature-cy={(cell + 16 + cell / 2) / H}
          data-feature-w={24 / W}
          data-feature-h={(cell * 2) / H}
        >
          <text x={cell / 2 + 8} y={cell + 16 + cell / 2} fontSize={14} textAnchor="middle" fill="#374151" fontWeight={700} transform={`rotate(-90 ${cell / 2 + 8} ${cell + 16 + cell / 2})`}>{parentB}</text>
        </g>
        {/* Top row: A's gametes */}
        {alleles.aGametes.map((g, i) => (
          <g
            key={`ag-${i}`}
            data-feature={N.aGamete(i)}
            data-feature-label={`A gamete ${g}`}
            data-feature-cx={(cell + 16 + i * cell + cell / 2) / W}
            data-feature-cy={(cell - 6) / H}
            data-feature-w={cell / W}
            data-feature-h={20 / H}
          >
            <text x={cell + 16 + i * cell + cell / 2} y={cell + 6} fontSize={16} textAnchor="middle" fill="#1f2937" fontWeight={700}>{g}</text>
          </g>
        ))}
        {/* Left column: B's gametes */}
        {alleles.bGametes.map((g, i) => (
          <g
            key={`bg-${i}`}
            data-feature={N.bGamete(i)}
            data-feature-label={`B gamete ${g}`}
            data-feature-cx={(cell - 6) / W}
            data-feature-cy={(cell + 16 + i * cell + cell / 2) / H}
            data-feature-w={20 / W}
            data-feature-h={cell / H}
          >
            <text x={cell - 6} y={cell + 16 + i * cell + cell / 2 + 5} fontSize={16} textAnchor="end" fill="#1f2937" fontWeight={700}>{g}</text>
          </g>
        ))}
        {/* Cells */}
        {cells.map((row, r) => row.map((c, k) => (
          <g
            key={`c-${r}-${k}`}
            data-feature={N.cell(r, k)}
            data-feature-label={c}
            data-feature-cx={(cell + 16 + k * cell + cell / 2) / W}
            data-feature-cy={(cell + 16 + r * cell + cell / 2) / H}
            data-feature-w={cell / W}
            data-feature-h={cell / H}
          >
            <rect x={cell + 16 + k * cell} y={cell + 16 + r * cell} width={cell} height={cell} fill="#f9fafb" stroke="#1f2937" strokeWidth={1.5} />
            <text x={cell + 16 + k * cell + cell / 2} y={cell + 16 + r * cell + cell / 2 + 8} fontSize={20} textAnchor="middle" fill="#1f2937" fontWeight={700}>{c}</text>
          </g>
        )))}
      </svg>
    </div>
  );
}
