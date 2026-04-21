'use client';

/**
 * Lewis Structure Renderer
 *
 * 2D Lewis dot structures for chemistry. Atoms placed at x,y coordinates
 * in a normalized 0–100 system; bonds drawn between atoms (single / double /
 * triple); lone pair electrons drawn as dot pairs around each atom; formal
 * charges shown as a small superscript.
 *
 * Different from the 3D `showMolecule` renderer (which uses Ketcher / SMILES
 * for actual molecular structures). This renderer is for teaching bonding
 * rules, resonance structures, formal charge, and electron accounting.
 */

import React from 'react';

export interface LewisAtom {
  id: string;
  element: string; // "C", "O", "N", "H", "Na+", "Cl-", etc.
  x: number; // 0–100
  y: number; // 0–100
  lonePairs?: number; // Number of lone pairs to draw around this atom.
  formalCharge?: number; // Shown as superscript: +1, -1, +2, -2.
}

export interface LewisBond {
  from: string;
  to: string;
  order: 1 | 2 | 3;
  style?: 'solid' | 'dashed' | 'wedge' | 'dash-wedge';
}

export interface LewisRendererProps {
  title?: string;
  atoms: LewisAtom[];
  bonds?: LewisBond[];
  /** Name or formula shown above the structure. */
  formula?: string;
  /** Optional molecular geometry label e.g. "bent", "trigonal planar". */
  geometry?: string;
}

const SVG_WIDTH = 500;
const SVG_HEIGHT = 350;
const ATOM_RADIUS = 18; // White circle behind atom label
const BOND_OFFSET = 3; // Separation between parallel lines for double/triple bonds

function toSvg(x: number, y: number): [number, number] {
  const inset = 40;
  return [
    inset + (x / 100) * (SVG_WIDTH - 2 * inset),
    inset + (y / 100) * (SVG_HEIGHT - 2 * inset),
  ];
}

/** Draw the dots for N lone pairs around an atom, avoiding bond directions. */
function renderLonePairs(
  cx: number,
  cy: number,
  count: number,
  bondAngles: number[]
): React.ReactElement[] {
  if (count <= 0) return [];
  const dots: React.ReactElement[] = [];
  // Candidate angle positions at 45° spacing, prefer ones far from bond angles.
  const candidates: number[] = [];
  for (let a = 0; a < 360; a += 45) candidates.push(a);
  const scored = candidates
    .map((angle) => {
      const minDistToBond = Math.min(
        ...bondAngles.map((b) => {
          const d = Math.abs(((angle - b + 540) % 360) - 180);
          return d;
        })
      );
      return { angle, score: minDistToBond };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, Math.min(count, scored.length));
  const dotGap = 5;
  const lpDist = ATOM_RADIUS + 6;

  selected.forEach((lp, i) => {
    const rad = (lp.angle * Math.PI) / 180;
    const cxLp = cx + Math.cos(rad) * lpDist;
    const cyLp = cy - Math.sin(rad) * lpDist; // SVG y inverted
    // Dots spaced perpendicular to the radial direction
    const perpX = -Math.sin(rad) * dotGap;
    const perpY = -Math.cos(rad) * dotGap;
    dots.push(
      <circle key={`lp-${i}-a`} cx={cxLp - perpX} cy={cyLp - perpY} r={1.8} fill="#1f2937" />
    );
    dots.push(
      <circle key={`lp-${i}-b`} cx={cxLp + perpX} cy={cyLp + perpY} r={1.8} fill="#1f2937" />
    );
  });

  return dots;
}

export default function LewisRenderer({
  title,
  atoms,
  bonds = [],
  formula,
  geometry,
}: LewisRendererProps) {
  const atomMap = new Map(atoms.map((a) => [a.id, a]));

  // Pre-compute each atom's bond angles for lone pair placement
  const bondAnglesByAtom = new Map<string, number[]>();
  for (const a of atoms) bondAnglesByAtom.set(a.id, []);
  for (const b of bonds) {
    const from = atomMap.get(b.from);
    const to = atomMap.get(b.to);
    if (!from || !to) continue;
    const angleFromTo =
      (Math.atan2(-(to.y - from.y), to.x - from.x) * 180) / Math.PI;
    const angleToFrom = (angleFromTo + 180) % 360;
    bondAnglesByAtom.get(b.from)!.push((angleFromTo + 360) % 360);
    bondAnglesByAtom.get(b.to)!.push((angleToFrom + 360) % 360);
  }

  return (
    <div className="lewis-renderer">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">
          {title}
        </div>
      )}
      {formula && (
        <div className="text-center text-xs text-gray-500 mb-1 font-mono">
          {formula}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: SVG_WIDTH, maxHeight: SVG_HEIGHT }}
      >
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#fafbfc" rx={4} />

        {/* Bonds (rendered behind atoms so they terminate cleanly) */}
        {bonds.map((b, i) => {
          const from = atomMap.get(b.from);
          const to = atomMap.get(b.to);
          if (!from || !to) return null;
          const [fx, fy] = toSvg(from.x, from.y);
          const [tx, ty] = toSvg(to.x, to.y);
          // Shrink bond ends so they don't cut into atom circles
          const dx = tx - fx;
          const dy = ty - fy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const shrink = ATOM_RADIUS;
          const x1 = fx + ux * shrink;
          const y1 = fy + uy * shrink;
          const x2 = tx - ux * shrink;
          const y2 = ty - uy * shrink;
          const nx = -uy;
          const ny = ux;

          const dash = b.style === 'dashed' ? '5,4' : undefined;

          if (b.order === 1) {
            return (
              <line
                key={`b-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1f2937"
                strokeWidth={2}
                strokeDasharray={dash}
              />
            );
          }
          if (b.order === 2) {
            return (
              <g key={`b-${i}`}>
                <line x1={x1 + nx * BOND_OFFSET} y1={y1 + ny * BOND_OFFSET} x2={x2 + nx * BOND_OFFSET} y2={y2 + ny * BOND_OFFSET} stroke="#1f2937" strokeWidth={2} />
                <line x1={x1 - nx * BOND_OFFSET} y1={y1 - ny * BOND_OFFSET} x2={x2 - nx * BOND_OFFSET} y2={y2 - ny * BOND_OFFSET} stroke="#1f2937" strokeWidth={2} />
              </g>
            );
          }
          // Triple bond
          return (
            <g key={`b-${i}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
              <line x1={x1 + nx * (BOND_OFFSET + 1)} y1={y1 + ny * (BOND_OFFSET + 1)} x2={x2 + nx * (BOND_OFFSET + 1)} y2={y2 + ny * (BOND_OFFSET + 1)} stroke="#1f2937" strokeWidth={2} />
              <line x1={x1 - nx * (BOND_OFFSET + 1)} y1={y1 - ny * (BOND_OFFSET + 1)} x2={x2 - nx * (BOND_OFFSET + 1)} y2={y2 - ny * (BOND_OFFSET + 1)} stroke="#1f2937" strokeWidth={2} />
            </g>
          );
        })}

        {/* Atoms */}
        {atoms.map((a) => {
          const [ax, ay] = toSvg(a.x, a.y);
          const bondAngles = bondAnglesByAtom.get(a.id) || [];
          return (
            <g key={`a-${a.id}`}>
              {renderLonePairs(ax, ay, a.lonePairs ?? 0, bondAngles)}
              <circle cx={ax} cy={ay} r={ATOM_RADIUS} fill="#fafbfc" />
              <text
                x={ax}
                y={ay + 5}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill="#1f2937"
              >
                {a.element}
              </text>
              {a.formalCharge !== undefined && a.formalCharge !== 0 && (
                <text
                  x={ax + ATOM_RADIUS * 0.9}
                  y={ay - ATOM_RADIUS * 0.6}
                  textAnchor="start"
                  fontSize={11}
                  fontWeight={700}
                  fill="#dc2626"
                >
                  {a.formalCharge > 0 ? `+${a.formalCharge}` : a.formalCharge}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {geometry && (
        <div className="text-center text-xs text-gray-500 mt-1 italic">
          Geometry: {geometry}
        </div>
      )}
    </div>
  );
}
