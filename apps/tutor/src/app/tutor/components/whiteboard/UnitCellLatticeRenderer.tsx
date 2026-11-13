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

const VB_W = 300;
const VB_H = 196;
const NODE_R = 17;     // ion sphere radius
const STROKE = 1.6;
const CATION = '#dc2626';
const ANION = '#2563eb';

function chargeText(charge: number): string {
  const mag = Math.abs(charge);
  return `${mag === 1 ? '' : mag}${charge > 0 ? '+' : '−'}`;
}

/** One ion: coloured disc, symbol centred, charge as a true superscript. The
 *  type steps down for two-letter symbols with a 2+/3+ charge so the label
 *  always stays inside the disc. */
function Ion({ x, y, symbol, charge, r = NODE_R, opacity = 1 }: { x: number; y: number; symbol: string; charge: number; r?: number; opacity?: number }) {
  const chg = chargeText(charge);
  const chars = symbol.length + chg.length * 0.7;
  const fs = Math.min(13, (r * 2 - 6) / (chars * 0.62));
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r} fill={charge > 0 ? CATION : ANION} stroke="#fff" strokeWidth={STROKE} />
      <text x={x} y={y + fs * 0.36} textAnchor="middle" fontSize={fs} fill="#fff" fontWeight={700}>
        {symbol}<tspan fontSize={fs * 0.72} baselineShift="super">{chg}</tspan>
      </text>
    </g>
  );
}

export default function UnitCellLatticeRenderer({ ions, className = '' }: UnitCellLatticeRendererProps) {
  // Pick first cation + first anion for a binary compound. More than two
  // distinct elements (e.g. Na2SO4): no picture.
  const distinctSymbols = Array.from(new Set(ions.map((i) => i.symbol)));
  if (distinctSymbols.length !== 2) return null;
  const cation = ions.find((i) => i.charge > 0);
  const anion = ions.find((i) => i.charge < 0);
  if (!cation || !anion) return null;
  // Ions per formula unit. Bracketed SMILES lists each ion once per
  // occurrence, so add those up; a formula carries the count directly.
  const nCat = ions.filter((i) => i.symbol === cation.symbol).reduce((s, i) => s + (i.count || 1), 0);
  const nAn = ions.filter((i) => i.symbol === anion.symbol).reduce((s, i) => s + (i.count || 1), 0);
  const catSup = chargeText(cation.charge);
  const anSup = chargeText(anion.charge);

  if (nCat !== nAn) {
    // Not 1:1 (MgCl₂, K₂O…): an alternating grid would show the wrong ratio.
    // Show one formula unit instead — the ions that balance each other.
    const unit = [
      ...Array.from({ length: nCat }, () => cation),
      ...Array.from({ length: nAn }, () => anion),
    ];
    // anions on either side of the cations reads best for AB₂ / A₂B
    const ordered = nCat < nAn
      ? [...unit.slice(nCat, nCat + Math.floor(nAn / 2)), ...unit.slice(0, nCat), ...unit.slice(nCat + Math.floor(nAn / 2))]
      : [...unit.slice(0, Math.floor(nCat / 2)), ...unit.slice(nCat), ...unit.slice(Math.floor(nCat / 2), nCat)];
    const R = 20;
    const gap = 54;
    const W = Math.max(220, ordered.length * gap + 40);
    const x0 = W / 2 - ((ordered.length - 1) * gap) / 2;
    return (
      <div className={`unit-cell-lattice ${className}`}>
        <p className="text-center text-sm font-medium text-gray-700 mb-1">One formula unit</p>
        <svg viewBox={`0 0 ${W} 60`} className="w-full mx-auto block" style={{ maxWidth: W * 1.25 }} preserveAspectRatio="xMidYMid meet">
          {ordered.map((ion, i) => (
            <Ion key={i} x={x0 + i * gap} y={30} symbol={ion.symbol} charge={ion.charge} r={R} />
          ))}
        </svg>
        <p className="text-center text-xs text-gray-600 mt-1">
          {nCat} {cation.symbol}<sup>{catSup}</sup> for every {nAn} {anion.symbol}<sup>{anSup}</sup>: the charges add up to zero.
        </p>
      </div>
    );
  }

  // 1:1 salts: a small slice of the alternating (rock-salt style) lattice,
  // with a fainter layer behind to hint at depth.
  const cols = 4;
  const rows = 3;
  const cellW = 58;
  const cellH = 50;
  const backOffX = 20;
  const backOffY = -18;
  const padX = (VB_W - (cols - 1) * cellW - backOffX) / 2;
  const padY = 44;
  const at = (col: number, row: number, back: boolean) => ({
    x: padX + col * cellW + (back ? backOffX : 0),
    y: padY + row * cellH + (back ? backOffY : 0),
    ion: (col + row + (back ? 1 : 0)) % 2 === 0 ? cation : anion,
  });
  const cells = Array.from({ length: rows }).flatMap((_, r) => Array.from({ length: cols }).map((__, c) => ({ r, c })));

  return (
    <div className={`unit-cell-lattice ${className}`}>
      <p className="text-center text-sm font-medium text-gray-700 mb-1">Part of the crystal lattice</p>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full max-w-md mx-auto block" preserveAspectRatio="xMidYMid meet">
        {/* depth links, then the back layer */}
        {cells.map(({ r, c }) => {
          const f = at(c, r, false), b = at(c, r, true);
          return <line key={`d-${r}-${c}`} x1={f.x} y1={f.y} x2={b.x} y2={b.y} stroke="#cbd5e1" strokeWidth={1} />;
        })}
        {cells.map(({ r, c }) => {
          const d = at(c, r, true);
          return <circle key={`b-${r}-${c}`} cx={d.x} cy={d.y} r={NODE_R - 5} fill={d.ion.charge > 0 ? '#fca5a5' : '#93c5fd'} stroke="#fff" strokeWidth={1.2} />;
        })}
        {/* front-layer links */}
        {cells.map(({ r, c }) => {
          const p = at(c, r, false);
          return (
            <g key={`e-${r}-${c}`} stroke="#94a3b8" strokeWidth={1.2}>
              {c < cols - 1 && <line x1={p.x} y1={p.y} x2={p.x + cellW} y2={p.y} />}
              {r < rows - 1 && <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + cellH} />}
            </g>
          );
        })}
        {/* front-layer ions with labels */}
        {cells.map(({ r, c }) => {
          const d = at(c, r, false);
          return <Ion key={`f-${r}-${c}`} x={d.x} y={d.y} symbol={d.ion.symbol} charge={d.ion.charge} />;
        })}
      </svg>
      <p className="text-center text-xs text-gray-600 mt-1">
        Every {cation.symbol}<sup>{catSup}</sup> is surrounded by {anion.symbol}<sup>{anSup}</sup> ions, and every {anion.symbol}<sup>{anSup}</sup> by {cation.symbol}<sup>{catSup}</sup> — no separate molecules.
      </p>
    </div>
  );
}
