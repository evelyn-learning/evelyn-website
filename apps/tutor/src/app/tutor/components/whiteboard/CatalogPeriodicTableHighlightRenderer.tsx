'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import { periodicTableHighlightFeatureNames, type PeriodicTableHighlightFigure } from '@/lib/tutor/diagrams/catalog/kinds/chem-bio';

// 18 columns × 7 periods, with the lanthanides and actinides in the usual two
// rows below the main block.
const TABLE: Array<Array<string | null>> = [
  ['H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'He'],
  ['Li', 'Be', null, null, null, null, null, null, null, null, null, null, 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', null, null, null, null, null, null, null, null, null, null, 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
  ['Cs', 'Ba', '*', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
  ['Fr', 'Ra', '**', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
];
const LANTHANIDES = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu'];
const ACTINIDES = ['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'];

/** Atomic number of every symbol, derived from reading order. */
const Z_OF: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let z = 0;
  TABLE.forEach((row) => row.forEach((sym) => {
    if (!sym) return;
    if (sym === '*') { LANTHANIDES.forEach((l) => { out[l] = ++z; }); return; }
    if (sym === '**') { ACTINIDES.forEach((l) => { out[l] = ++z; }); return; }
    out[sym] = ++z;
  }));
  return out;
})();

// Highlight colours used when the caller gives none: one per distinct label.
const GROUP_COLOURS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

function tint(hex: string): string {
  // A pale wash of the group colour for the cell fill (text stays dark on it).
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.78);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
}
function canonical(sym: string): string {
  const t = sym.trim();
  return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : t;
}

export function CatalogPeriodicTableHighlightRenderer({ figure }: { figure: PeriodicTableHighlightFigure }) {
  const { highlights, title } = figure;
  const N = periodicTableHighlightFeatureNames;

  // One legend group per distinct label (unlabelled highlights share one group).
  const groups: Array<{ label: string; colour: string; elements: string[] }> = [];
  const map = new Map<string, { colour: string; label?: string; raw: string }>();
  for (const h of highlights) {
    const sym = canonical(h.element);
    const key = h.label?.trim() || '';
    let g = groups.find((x) => x.label === key);
    if (!g) {
      g = { label: key, colour: h.color || GROUP_COLOURS[groups.length % GROUP_COLOURS.length], elements: [] };
      groups.push(g);
    }
    if (!g.elements.includes(sym)) g.elements.push(sym);
    map.set(sym, { colour: h.color || g.colour, label: h.label, raw: h.element });
  }
  const fBlockUsed = [...map.keys()].some((sym) => LANTHANIDES.includes(sym) || ACTINIDES.includes(sym));

  const cell = 34;
  const padX = 4;
  const top = 6;
  const W = 18 * cell + padX * 2;
  const mainH = 7 * cell;
  const fTop = top + mainH + 12;
  const H = fBlockUsed ? fTop + 2 * cell + 4 : top + mainH + 4;

  const drawCell = (sym: string, x: number, y: number, key: string) => {
    const hi = map.get(sym);
    const isMarker = sym === '*' || sym === '**';
    const z = Z_OF[sym];
    const fill = hi ? tint(hi.colour) : isMarker ? '#ffffff' : '#f8fafc';
    const stroke = hi ? hi.colour : '#cbd5e1';
    // Only HIGHLIGHTED cells become scribbleable features — emitting
    // data-feature on every element bloats the DOM.
    const niceLabel = hi?.label ? `${sym} (${hi.label})` : sym;
    const featureProps = hi ? {
      // the manifest names the feature by the symbol as the caller wrote it
      'data-feature': hi.raw === sym ? N.element(sym) : N.element(hi.raw),
      'data-feature-label': niceLabel,
      'data-feature-cx': (x + (cell - 2) / 2) / W,
      'data-feature-cy': (y + (cell - 2) / 2) / H,
      'data-feature-w': (cell - 2) / W,
      'data-feature-h': (cell - 2) / H,
    } : {};
    return (
      <g key={key} {...featureProps}>
        <rect x={x} y={y} width={cell - 2} height={cell - 2} rx={2.5} fill={fill} stroke={stroke} strokeWidth={hi ? 2.2 : 0.8} strokeDasharray={isMarker ? '2 2' : undefined} />
        {z !== undefined && (
          <text x={x + 3.5} y={y + 9.5} fontSize={7} fill={hi ? '#334155' : '#94a3b8'}>{z}</text>
        )}
        <text x={x + (cell - 2) / 2} y={y + (z !== undefined ? 24 : 21)} fontSize={hi ? 13 : 12} textAnchor="middle" fill={hi ? '#0f172a' : isMarker ? '#94a3b8' : '#475569'} fontWeight={hi ? 700 : 500}>
          {sym}
        </text>
      </g>
    );
  };

  return (
    <div className="periodic-renderer w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2 text-center"><InlineMathText text={title} /></div>}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[680px]"
        data-feature={N.table}
        data-feature-label={title || 'periodic table'}
        data-feature-cx={0.5}
        data-feature-cy={0.5}
        data-feature-w={1}
        data-feature-h={1}
      >
        {TABLE.map((row, r) => row.map((sym, c) => (sym ? drawCell(sym, padX + c * cell, top + r * cell, `${r}-${c}`) : null)))}
        {fBlockUsed && (
          <>
            <text x={padX + 3 * cell - 8} y={fTop + cell / 2 + 3} fontSize={11} textAnchor="end" fill="#94a3b8">*</text>
            <text x={padX + 3 * cell - 8} y={fTop + cell + cell / 2 + 3} fontSize={11} textAnchor="end" fill="#94a3b8">**</text>
            {LANTHANIDES.map((sym, i) => drawCell(sym, padX + (3 + i) * cell, fTop, `la-${i}`))}
            {ACTINIDES.map((sym, i) => drawCell(sym, padX + (3 + i) * cell, fTop + cell, `ac-${i}`))}
          </>
        )}
      </svg>
      {/* Legend: what each highlight colour means. */}
      {groups.some((g) => g.label) && (
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1.5 max-w-[680px] text-sm text-gray-700">
          {groups.map((g, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-3.5 rounded-sm" style={{ background: tint(g.colour), border: `2px solid ${g.colour}` }} />
              <span className="font-semibold text-gray-900">{g.elements.join(', ')}</span>
              {g.label && <span>— {g.label}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
