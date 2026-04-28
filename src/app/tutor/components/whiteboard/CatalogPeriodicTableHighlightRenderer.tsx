'use client';

import React from 'react';
import type { PeriodicTableHighlightFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

// Compact periodic-table layout — 18 columns × 7 rows. Lanthanides + actinides
// are kept in their main-row position with a subscript "*" indicator.
const TABLE: Array<Array<string | null>> = [
  ['H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'He'],
  ['Li', 'Be', null, null, null, null, null, null, null, null, null, null, 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', null, null, null, null, null, null, null, null, null, null, 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
  ['Cs', 'Ba', '*', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
  ['Fr', 'Ra', '**', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
];

export function CatalogPeriodicTableHighlightRenderer({ figure }: { figure: PeriodicTableHighlightFigure }) {
  const { highlights, title } = figure;
  const map = new Map<string, { color?: string; label?: string }>();
  for (const h of highlights) map.set(h.element, { color: h.color, label: h.label });
  const cell = 30;
  const W = 18 * cell;
  const H = 7 * cell + 14;
  return (
    <div className="periodic-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px]">
        {TABLE.map((row, r) =>
          row.map((sym, c) => {
            if (!sym) return null;
            const x = c * cell;
            const y = r * cell + 12;
            const hi = map.get(sym);
            const fill = hi?.color || '#f3f4f6';
            const stroke = hi ? (hi.color ? '#111' : '#3b82f6') : '#9ca3af';
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width={cell - 2} height={cell - 2} fill={fill} stroke={stroke} strokeWidth={hi ? 2 : 0.6} />
                <text x={x + cell / 2} y={y + cell / 2 + 4} fontSize={11} textAnchor="middle" fill={hi ? '#111' : '#374151'} fontWeight={hi ? 700 : 400}>
                  {sym}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
