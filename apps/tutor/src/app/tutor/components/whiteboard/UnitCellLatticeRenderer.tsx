'use client';

/**
 * UnitCellLatticeRenderer — small inline SVG diagram of a binary
 * ionic compound's crystal structure. Hand-rolled (not using a 3D
 * library) so the bundle stays light. Default layout: rock-salt-style
 * face-centered cubic alternating cation/anion, drawn as 2D projection
 * with diagonal depth lines for a "this is a crystal lattice" cue.
 *
 * Why this exists: chemistry lessons that introduce ionic bonding
 * routinely show a small lattice diagram alongside the structural
 * formula so the student grasps "this isn't a discrete molecule, it's
 * a repeating 3D pattern." Embedding via Ketcher would require a
 * crystallography plugin; we'd rather emit deterministic SVG that
 * matches our other diagrams' style.
 *
 * Limitations: only shows a small 2×2×1 slice — enough to convey the
 * pattern without becoming a busy isometric drawing. Larger / more
 * exotic crystal structures (CsCl-style body-centered, ZnS zincblende,
 * fluorite) would need additional layout variants — defer until the
 * brain actually asks for them.
 */

import React from 'react';

interface UnitCellLatticeRendererProps {
  /** The ions parsed by classifyCompound. We pick the first cation
   *  + first anion as the binary representation. Compounds with
   *  more than two ion types fall back to no lattice. */
  ions: Array<{ symbol: string; charge: number; count: number }>;
  className?: string;
}

const VB_W = 280;
const VB_H = 200;
const NODE_R = 14;     // ion sphere radius
const STROKE = 1.4;
const FONT = 11;

export default function UnitCellLatticeRenderer({ ions, className = '' }: UnitCellLatticeRendererProps) {
  // Pick first cation + first anion for a binary lattice. Ions with
  // >2 distinct elements (e.g., Na2SO4) — skip the lattice; the bond
  // structure is too complex for a quick 2D projection.
  const distinctSymbols = Array.from(new Set(ions.map((i) => i.symbol)));
  if (distinctSymbols.length !== 2) return null;
  const cation = ions.find((i) => i.charge > 0);
  const anion = ions.find((i) => i.charge < 0);
  if (!cation || !anion) return null;

  // Layout: 3×3 alternating grid of ions + a "back layer" offset by
  // (12, -12) to cue depth. Front-layer first so back doesn't occlude.
  const cols = 3;
  const rows = 3;
  const cellW = 60;
  const cellH = 50;
  const padX = 30;
  const padY = 30;
  const backOffX = 14;
  const backOffY = -14;

  const dotAt = (col: number, row: number, layer: 'front' | 'back') => {
    const isCation = (col + row + (layer === 'back' ? 1 : 0)) % 2 === 0;
    const ion = isCation ? cation : anion;
    const baseX = padX + col * cellW;
    const baseY = padY + row * cellH;
    const x = baseX + (layer === 'back' ? backOffX : 0);
    const y = baseY + (layer === 'back' ? backOffY : 0);
    const fill = isCation ? '#ef4444' : '#3b82f6';   // cation red, anion blue
    const opacity = layer === 'back' ? 0.5 : 1;
    return { x, y, fill, ion, opacity, isCation };
  };

  // Edges between adjacent front-layer ions (just to suggest the lattice).
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1) edges.push({
        x1: padX + c * cellW, y1: padY + r * cellH,
        x2: padX + (c + 1) * cellW, y2: padY + r * cellH,
      });
      if (r < rows - 1) edges.push({
        x1: padX + c * cellW, y1: padY + r * cellH,
        x2: padX + c * cellW, y2: padY + (r + 1) * cellH,
      });
    }
  }

  return (
    <div className={`unit-cell-lattice ${className}`}>
      <p className="text-center text-xs text-gray-500 mb-1">Crystal lattice (2×3 slice)</p>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full max-w-md mx-auto block" preserveAspectRatio="xMidYMid meet">
        {/* Back layer first (occluded) */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const d = dotAt(c, r, 'back');
            return (
              <g key={`b-${r}-${c}`} opacity={d.opacity}>
                <circle cx={d.x} cy={d.y} r={NODE_R} fill={d.fill} stroke="#fff" strokeWidth={STROKE} />
              </g>
            );
          })
        )}
        {/* Front-layer edges */}
        {edges.map((e, i) => (
          <line key={`e-${i}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
        ))}
        {/* Front-layer ions with labels */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const d = dotAt(c, r, 'front');
            const sign = d.ion.charge > 0 ? '+' : '−';
            const mag = Math.abs(d.ion.charge);
            const chargeLabel = mag === 1 ? sign : `${mag}${sign}`;
            return (
              <g key={`f-${r}-${c}`}>
                <circle cx={d.x} cy={d.y} r={NODE_R} fill={d.fill} stroke="#fff" strokeWidth={STROKE} />
                <text x={d.x} y={d.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={FONT} fill="#fff" fontWeight={700}>
                  {d.ion.symbol}
                  <tspan fontSize={FONT - 3} dy={-4}>{chargeLabel}</tspan>
                </text>
              </g>
            );
          })
        )}
      </svg>
      <p className="text-center text-[10px] text-gray-400 mt-1">
        Each {cation.symbol}<sup>{cation.charge === 1 ? '+' : `${cation.charge}+`}</sup> is surrounded by {anion.symbol}<sup>{anion.charge === -1 ? '−' : `${Math.abs(anion.charge)}−`}</sup> ions and vice versa.
      </p>
    </div>
  );
}
