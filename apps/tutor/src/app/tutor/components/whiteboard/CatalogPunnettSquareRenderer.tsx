'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { punnettSquareFeatureNames, type PunnettSquareFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

export function CatalogPunnettSquareRenderer({ figure }: { figure: PunnettSquareFigure }) {
  const { parentA, parentB, alleles, cells, title } = figure;
  const N = punnettSquareFeatureNames;
  const cell = 76;
  // Layout: a left gutter for parent B (rotated) + its gametes, a top band for
  // parent A + its gametes, then the 2×2 grid with a margin all round so no
  // border sits on the viewBox edge.
  const gridX = 84;
  const gridY = 74;
  const gridW = cell * alleles.aGametes.length;
  const gridH = cell * alleles.bGametes.length;
  const W = gridX + gridW + 20;
  // Genotype ratio of the offspring, in the order the genotypes first appear.
  const counts = new Map<string, number>();
  cells.forEach((row) => row.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
  const ratio = Array.from(counts.entries());
  const ratioText = ratio.map(([g, n]) => `${n} ${g}`).join(' : ');
  const H = gridY + gridH + 54;
  return (
    <div className="punnett-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[400px]"
        data-feature={N.punnett}
        data-feature-label={title || `${parentA} × ${parentB}`}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {/* Parent A label (across the top) */}
        <g
          data-feature={N.parentA}
          data-feature-label={`Parent ${parentA}`}
          data-feature-cx={(gridX + gridW / 2) / W}
          data-feature-cy={20 / H}
          data-feature-w={gridW / W}
          data-feature-h={24 / H}
        >
          <text x={gridX + gridW / 2} y={24} fontSize={13} textAnchor="middle" fill="#64748b" fontWeight={600}>
            Parent 1: <tspan fill="#1f2937" fontWeight={700} fontSize={15}>{parentA}</tspan>
          </text>
        </g>
        {/* Parent B label (down the left side) */}
        <g
          data-feature={N.parentB}
          data-feature-label={`Parent ${parentB}`}
          data-feature-cx={20 / W}
          data-feature-cy={(gridY + gridH / 2) / H}
          data-feature-w={24 / W}
          data-feature-h={gridH / H}
        >
          <text x={22} y={gridY + gridH / 2} fontSize={13} textAnchor="middle" fill="#64748b" fontWeight={600} transform={`rotate(-90 22 ${gridY + gridH / 2})`}>
            Parent 2: <tspan fill="#1f2937" fontWeight={700} fontSize={15}>{parentB}</tspan>
          </text>
        </g>
        {/* Top row: A's gametes */}
        {alleles.aGametes.map((g, i) => (
          <g
            key={`ag-${i}`}
            data-feature={N.aGamete(i)}
            data-feature-label={`A gamete ${g}`}
            data-feature-cx={(gridX + i * cell + cell / 2) / W}
            data-feature-cy={(gridY - 20) / H}
            data-feature-w={cell / W}
            data-feature-h={30 / H}
          >
            <circle cx={gridX + i * cell + cell / 2} cy={gridY - 20} r={14} fill="#eff6ff" stroke="#93c5fd" strokeWidth={1.25} />
            <text x={gridX + i * cell + cell / 2} y={gridY - 14.5} fontSize={16} textAnchor="middle" fill="#1d4ed8" fontWeight={700}>{g}</text>
          </g>
        ))}
        {/* Left column: B's gametes */}
        {alleles.bGametes.map((g, i) => (
          <g
            key={`bg-${i}`}
            data-feature={N.bGamete(i)}
            data-feature-label={`B gamete ${g}`}
            data-feature-cx={(gridX - 22) / W}
            data-feature-cy={(gridY + i * cell + cell / 2) / H}
            data-feature-w={30 / W}
            data-feature-h={cell / H}
          >
            <circle cx={gridX - 22} cy={gridY + i * cell + cell / 2} r={14} fill="#fdf2f8" stroke="#f9a8d4" strokeWidth={1.25} />
            <text x={gridX - 22} y={gridY + i * cell + cell / 2 + 5.5} fontSize={16} textAnchor="middle" fill="#be185d" fontWeight={700}>{g}</text>
          </g>
        ))}
        {/* Cells */}
        {cells.map((row, r) => row.map((c, k) => (
          <g
            key={`c-${r}-${k}`}
            data-feature={N.cell(r, k)}
            data-feature-label={c}
            data-feature-cx={(gridX + k * cell + cell / 2) / W}
            data-feature-cy={(gridY + r * cell + cell / 2) / H}
            data-feature-w={cell / W}
            data-feature-h={cell / H}
          >
            <rect x={gridX + k * cell} y={gridY + r * cell} width={cell} height={cell} fill="#f9fafb" stroke="#1f2937" strokeWidth={1.5} />
            <text x={gridX + k * cell + cell / 2} y={gridY + r * cell + cell / 2 + 7} fontSize={20} textAnchor="middle" fill="#1f2937" fontWeight={700}>{c}</text>
          </g>
        )))}
        {/* two centred lines: one line ran past the right edge of this narrow figure */}
        <text x={W / 2} y={gridY + gridH + 24} fontSize={12} textAnchor="middle" fill="#475569">Offspring genotypes</text>
        <text x={W / 2} y={gridY + gridH + 42} fontSize={14} textAnchor="middle" fill="#1f2937" fontWeight={700}>{ratioText}</text>
      </svg>
    </div>
  );
}
