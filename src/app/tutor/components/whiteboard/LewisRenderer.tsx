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
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

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
// Reserve enough pixel margin inside the SVG for lone pair dots (~ATOM_RADIUS+12)
// and the formal-charge superscript. Prevents content from clipping against the
// viewBox border regardless of what coords the model picks for atoms.
const CONTENT_PADDING = 36;

/**
 * Build a content-to-SVG coordinate mapper that auto-fits all atoms inside
 * the viewBox with safety padding. Preserves aspect ratio (so hexagons stay
 * hexagonal). Handles degenerate cases: no atoms, one atom, or all atoms
 * collinear in a single axis.
 */
function buildAtomMapper(atoms: LewisAtom[]): (x: number, y: number) => [number, number] {
  if (atoms.length === 0) {
    return (x, y) => [
      CONTENT_PADDING + (x / 100) * (SVG_WIDTH - 2 * CONTENT_PADDING),
      CONTENT_PADDING + (y / 100) * (SVG_HEIGHT - 2 * CONTENT_PADDING),
    ];
  }
  const xs = atoms.map((a) => a.x);
  const ys = atoms.map((a) => a.y);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  // Degenerate: single atom or collinear → give it a unit box so we center it.
  if (maxX - minX < 1) { minX -= 10; maxX += 10; }
  if (maxY - minY < 1) { minY -= 10; maxY += 10; }
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const innerW = SVG_WIDTH - 2 * CONTENT_PADDING;
  const innerH = SVG_HEIGHT - 2 * CONTENT_PADDING;
  const scale = Math.min(innerW / rangeX, innerH / rangeY);
  const offsetX = (SVG_WIDTH - scale * rangeX) / 2;
  const offsetY = (SVG_HEIGHT - scale * rangeY) / 2;
  return (x, y) => [offsetX + (x - minX) * scale, offsetY + (y - minY) * scale];
}

/** Draw the dots for N lone pairs around an atom, avoiding bond directions. */
function renderLonePairs(
  cx: number,
  cy: number,
  count: number,
  bondAngles: number[],
  lpOffset: number = 0,
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
      <g key={`lp-${i}`}
        {...feat(`lonepair-${lpOffset + i + 1}`, { cx: cxLp, cy: cyLp, w: 16, h: 16 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
        <circle key={`lp-${i}-a`} cx={cxLp - perpX} cy={cyLp - perpY} r={1.8} fill="#1f2937" />
        <circle key={`lp-${i}-b`} cx={cxLp + perpX} cy={cyLp + perpY} r={1.8} fill="#1f2937" />
      </g>
    );
  });

  return dots;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 */
export function buildLewisManifest(props: LewisRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const atoms = props.atoms ?? [];
  const bonds = props.bonds ?? [];
  const ELEMENT_NAMES: Record<string, string> = {
    H: 'hydrogen', C: 'carbon', N: 'nitrogen', O: 'oxygen', F: 'fluorine',
    P: 'phosphorus', S: 'sulfur', Cl: 'chlorine', Br: 'bromine', I: 'iodine',
    Na: 'sodium', K: 'potassium', Mg: 'magnesium', Ca: 'calcium', Fe: 'iron',
    B: 'boron', Si: 'silicon', Li: 'lithium', Be: 'beryllium', Al: 'aluminum',
  };
  const atomById = new Map(atoms.map((a) => [a.id, a]));
  // Find a "central atom" — the one with the most bonds — so we can tag it.
  const bondCount = new Map<string, number>();
  for (const b of bonds) {
    bondCount.set(b.from, (bondCount.get(b.from) ?? 0) + 1);
    bondCount.set(b.to, (bondCount.get(b.to) ?? 0) + 1);
  }
  let centralId: string | null = null;
  let maxBonds = -1;
  for (const [id, c] of bondCount) {
    if (c > maxBonds) { maxBonds = c; centralId = id; }
  }
  bonds.forEach((b, i) => {
    const orderLabel = b.order === 2 ? 'double bond' : b.order === 3 ? 'triple bond' : 'single bond';
    const fromAtom = atomById.get(b.from);
    const toAtom = atomById.get(b.to);
    const fromEl = fromAtom?.element ?? b.from;
    const toEl = toAtom?.element ?? b.to;
    const bareFrom = fromEl.replace(/[+\-0-9]/g, '');
    const bareTo = toEl.replace(/[+\-0-9]/g, '');
    const labels = new Set<string>([
      `bond-${i + 1}`,
      `bond ${i + 1}`,
      orderLabel,
      `${bareFrom}-${bareTo} bond`,
      `${bareFrom}-${bareTo}`,
      `${bareTo}-${bareFrom} bond`,
      `${bareTo}-${bareFrom}`,
      `${bareFrom}${bareTo} bond`,
      `${orderLabel} ${i + 1}`,
    ]);
    if (b.order === 2) labels.add('double');
    if (b.order === 3) labels.add('triple');
    if (b.order === 1) labels.add('single');
    entries.push({
      name: `bond-${i + 1}`,
      kind: 'edge',
      description: `${orderLabel} between ${b.from} and ${b.to}`,
      labels: Array.from(labels),
    });
  });
  let lpCounter = 0;
  atoms.forEach((a, aIdx) => {
    const bareEl = a.element.replace(/[+\-0-9]/g, '');
    const fullName = ELEMENT_NAMES[bareEl];
    const labels = new Set<string>([
      `atom-${aIdx + 1}`,
      `atom ${aIdx + 1}`,
      a.id,
      a.element,
      bareEl,
      `atom ${a.element}`,
      `${a.element} atom`,
      `the ${a.element}`,
    ]);
    if (fullName) {
      labels.add(fullName);
      labels.add(`the ${fullName}`);
      labels.add(`${fullName} atom`);
    }
    if (a.id === centralId) {
      labels.add('central atom');
      labels.add('the central atom');
      if (fullName) labels.add(`central ${fullName}`);
    }
    entries.push({
      name: `atom-${aIdx + 1}`,
      kind: 'node',
      description: `atom ${a.element}${a.formalCharge ? ` (formal charge ${a.formalCharge > 0 ? '+' : ''}${a.formalCharge})` : ''}`,
      labels: Array.from(labels),
    });
    const lp = a.lonePairs ?? 0;
    for (let i = 0; i < lp; i++) {
      lpCounter += 1;
      const lpLabels = new Set<string>([
        `lonepair-${lpCounter}`,
        `lone pair ${lpCounter}`,
        `lone-pair ${lpCounter}`,
        `lone pair on ${a.element}`,
        `lone pair on ${bareEl}`,
      ]);
      if (fullName) lpLabels.add(`lone pair on ${fullName}`);
      if (i === 0 && lp >= 1) {
        // First lone pair on this atom — allow unindexed "lone pair on X".
        lpLabels.add(`lone pair`);
      }
      entries.push({
        name: `lonepair-${lpCounter}`,
        kind: 'annotation',
        description: `lone pair ${lpCounter} on atom ${a.element} (#${aIdx + 1})`,
        labels: Array.from(lpLabels),
      });
    }
  });
  return entries;
}

export default function LewisRenderer({
  title,
  atoms,
  bonds = [],
  formula,
  geometry,
}: LewisRendererProps) {
  const atomMap = new Map(atoms.map((a) => [a.id, a]));
  const toSvg = buildAtomMapper(atoms);

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
          const [fxFeat, fyFeat] = toSvg(from.x, from.y);
          const [txFeat, tyFeat] = toSvg(to.x, to.y);
          const bondFeatProps = feat(`bond-${i + 1}`,
            { cx: (fxFeat + txFeat) / 2, cy: (fyFeat + tyFeat) / 2,
              w: Math.max(30, Math.abs(txFeat - fxFeat) + 20),
              h: Math.max(30, Math.abs(tyFeat - fyFeat) + 20) },
            { width: SVG_WIDTH, height: SVG_HEIGHT });
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
                {...bondFeatProps}
              />
            );
          }
          if (b.order === 2) {
            return (
              <g key={`b-${i}`} {...bondFeatProps}>
                <line x1={x1 + nx * BOND_OFFSET} y1={y1 + ny * BOND_OFFSET} x2={x2 + nx * BOND_OFFSET} y2={y2 + ny * BOND_OFFSET} stroke="#1f2937" strokeWidth={2} />
                <line x1={x1 - nx * BOND_OFFSET} y1={y1 - ny * BOND_OFFSET} x2={x2 - nx * BOND_OFFSET} y2={y2 - ny * BOND_OFFSET} stroke="#1f2937" strokeWidth={2} />
              </g>
            );
          }
          // Triple bond
          return (
            <g key={`b-${i}`} {...bondFeatProps}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth={2} />
              <line x1={x1 + nx * (BOND_OFFSET + 1)} y1={y1 + ny * (BOND_OFFSET + 1)} x2={x2 + nx * (BOND_OFFSET + 1)} y2={y2 + ny * (BOND_OFFSET + 1)} stroke="#1f2937" strokeWidth={2} />
              <line x1={x1 - nx * (BOND_OFFSET + 1)} y1={y1 - ny * (BOND_OFFSET + 1)} x2={x2 - nx * (BOND_OFFSET + 1)} y2={y2 - ny * (BOND_OFFSET + 1)} stroke="#1f2937" strokeWidth={2} />
            </g>
          );
        })}

        {/* Atoms */}
        {(() => {
          let lpCounter = 0;
          return atoms.map((a, aIdx) => {
            const [ax, ay] = toSvg(a.x, a.y);
            const bondAngles = bondAnglesByAtom.get(a.id) || [];
            const lpStart = lpCounter;
            lpCounter += a.lonePairs ?? 0;
            return (
              <g key={`a-${a.id}`}
                {...feat(`atom-${aIdx + 1}`, { cx: ax, cy: ay, w: ATOM_RADIUS * 2 + 8, h: ATOM_RADIUS * 2 + 8 }, { width: SVG_WIDTH, height: SVG_HEIGHT })}>
                {renderLonePairs(ax, ay, a.lonePairs ?? 0, bondAngles, lpStart)}
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
          });
        })()}
      </svg>
      {geometry && (
        <div className="text-center text-xs text-gray-500 mt-1 italic">
          Geometry: {geometry}
        </div>
      )}
    </div>
  );
}
