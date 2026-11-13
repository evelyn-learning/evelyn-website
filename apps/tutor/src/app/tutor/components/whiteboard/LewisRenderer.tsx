'use client';

import { InlineMathText } from './InlineMathText';
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
const MAX_SVG_HEIGHT = 350;
const MIN_SVG_HEIGHT = 130;
const ATOM_RADIUS = 14; // Clear disc behind the atom symbol; bonds stop at its edge
const BOND_OFFSET = 3; // Separation between parallel lines for double/triple bonds
// Room inside the frame for lone-pair dots and the formal-charge badge around
// the outermost atoms, so nothing clips whatever coordinates the atoms carry.
const CONTENT_PADDING = 40;
/** A bond is never drawn longer than this: a three-atom molecule must not be
 *  stretched to fill the whole frame. */
const TARGET_BOND_PX = 78;

interface Fit {
  toSvg: (x: number, y: number) => [number, number];
  height: number;
}

/**
 * Fit the atoms into the frame: aspect ratio kept (hexagons stay hexagonal),
 * bond length capped at TARGET_BOND_PX, content centred, and the frame height
 * shrunk to the content so a small molecule is not lost in an empty panel.
 */
function buildAtomMapper(atoms: LewisAtom[], bonds: LewisBond[]): Fit {
  if (atoms.length === 0) {
    return {
      toSvg: (x, y) => [
        CONTENT_PADDING + (x / 100) * (SVG_WIDTH - 2 * CONTENT_PADDING),
        CONTENT_PADDING + (y / 100) * (MAX_SVG_HEIGHT - 2 * CONTENT_PADDING),
      ],
      height: MAX_SVG_HEIGHT,
    };
  }
  const xs = atoms.map((a) => a.x);
  const ys = atoms.map((a) => a.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  const innerW = SVG_WIDTH - 2 * CONTENT_PADDING;
  const innerH = MAX_SVG_HEIGHT - 2 * CONTENT_PADDING;
  // Typical bond length in content units (median), to cap the scale.
  const byId = new Map(atoms.map((a) => [a.id, a]));
  const lens = bonds
    .map((b) => {
      const f = byId.get(b.from), t = byId.get(b.to);
      return f && t ? Math.hypot(t.x - f.x, t.y - f.y) : 0;
    })
    .filter((l) => l > 1e-6)
    .sort((p, q) => p - q);
  const typical = lens.length ? lens[Math.floor(lens.length / 2)] : 0;
  let scale = Math.min(
    rangeX > 1e-6 ? innerW / rangeX : Infinity,
    rangeY > 1e-6 ? innerH / rangeY : Infinity,
    typical > 0 ? TARGET_BOND_PX / typical : Infinity,
  );
  if (!Number.isFinite(scale)) scale = 1; // a single atom
  const height = Math.max(MIN_SVG_HEIGHT, Math.min(MAX_SVG_HEIGHT, rangeY * scale + 2 * CONTENT_PADDING + 8));
  const offsetX = (SVG_WIDTH - scale * rangeX) / 2;
  const offsetY = (height - scale * rangeY) / 2;
  return { toSvg: (x, y) => [offsetX + (x - minX) * scale, offsetY + (y - minY) * scale], height };
}

/**
 * Where the lone pairs of one atom go (angles in degrees, 0 = right,
 * anticlockwise). Each pair is handed to the widest remaining gap between the
 * atom's bonds, and the pairs in a gap are spread evenly across it — so water
 * gets its two pairs side by side on top, a halogen gets one on each free
 * side, and no pair ever sits on a bond.
 */
function lonePairAngles(count: number, bondAngles: number[]): number[] {
  if (count <= 0) return [];
  if (bondAngles.length === 0) {
    return Array.from({ length: count }, (_, i) => (90 + (i * 360) / count) % 360);
  }
  const sorted = [...bondAngles].map((a) => ((a % 360) + 360) % 360).sort((a, b) => a - b);
  const gaps = sorted.map((start, i) => {
    const end = i + 1 < sorted.length ? sorted[i + 1] : sorted[0] + 360;
    return { start, size: end - start, n: 0 };
  });
  for (let k = 0; k < count; k++) {
    let best = gaps[0];
    for (const g of gaps) if (g.size / (g.n + 1) > best.size / (best.n + 1) + 1e-6) best = g;
    best.n += 1;
  }
  const out: number[] = [];
  for (const g of gaps) {
    for (let j = 0; j < g.n; j++) out.push((g.start + (g.size * (j + 1)) / (g.n + 1)) % 360);
  }
  return out;
}

/** Draw the dots for N lone pairs around an atom, avoiding bond directions. */
function renderLonePairs(
  cx: number,
  cy: number,
  count: number,
  bondAngles: number[],
  lpOffset: number = 0,
  svgHeight: number = MAX_SVG_HEIGHT,
): React.ReactElement[] {
  if (count <= 0) return [];
  const dots: React.ReactElement[] = [];
  const dotGap = 4.2;
  const lpDist = ATOM_RADIUS + 5;

  lonePairAngles(count, bondAngles).forEach((angle, i) => {
    const rad = (angle * Math.PI) / 180;
    const cxLp = cx + Math.cos(rad) * lpDist;
    const cyLp = cy - Math.sin(rad) * lpDist; // SVG y inverted
    // Dots spaced perpendicular to the radial direction
    const perpX = -Math.sin(rad) * dotGap;
    const perpY = -Math.cos(rad) * dotGap;
    dots.push(
      <g key={`lp-${i}`}
        {...feat(`lonepair-${lpOffset + i + 1}`, { cx: cxLp, cy: cyLp, w: 16, h: 16 }, { width: SVG_WIDTH, height: svgHeight })}>
        <circle key={`lp-${i}-a`} cx={cxLp - perpX} cy={cyLp - perpY} r={2.3} fill="#1f2937" />
        <circle key={`lp-${i}-b`} cx={cxLp + perpX} cy={cyLp + perpY} r={2.3} fill="#1f2937" />
      </g>
    );
  });

  return dots;
}

/** "H2O" → H₂O, "NH4+" → NH₄⁺ (digits after a symbol drop, a trailing charge rises). */
function formulaNodes(formula: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let body = formula.trim();
  let charge = '';
  // A trailing sign is the ion's charge. The digit before it is the charge
  // size only for a single-element ion ("Mg2+") or when it follows another
  // digit ("SO42-" = SO₄²⁻); otherwise it is a subscript ("NH4+" = NH₄⁺).
  const cm = /^(.*?)(?:\^|\s)?(\d*)([+\-−])$/.exec(body);
  if (cm && cm[1]) {
    let head = cm[1];
    let mag = cm[2];
    const explicit = /[\^\s]\d*[+\-−]$/.test(body);
    if (!explicit && mag) {
      if (/^[A-Z][a-z]?$/.test(head) && mag.length === 1) { /* monatomic: digit is the charge */ }
      else if (mag.length >= 2) { head += mag.slice(0, -1); mag = mag.slice(-1); }
      else { head += mag; mag = ''; }
    }
    charge = `${mag}${cm[3] === '+' ? '+' : '−'}`;
    body = head;
  }
  const re = /([A-Za-z\)\]])(\d+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(body)) !== null) {
    out.push(body.slice(last, m.index) + m[1]);
    out.push(<sub key={`s${k++}`}>{m[2]}</sub>);
    last = m.index + m[0].length;
  }
  out.push(body.slice(last));
  if (charge) out.push(<sup key="chg">{charge}</sup>);
  return out;
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
  const { toSvg, height: SVG_HEIGHT } = buildAtomMapper(atoms, bonds);

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
    <div className="lewis-renderer w-full flex flex-col items-center">
      {title && (
        <div className="text-center text-sm font-semibold text-gray-700 mb-1">
          <InlineMathText text={title} />
        </div>
      )}
      {formula && (
        <div className="text-center text-base text-gray-700 mb-1 font-semibold">
          {formulaNodes(formula)}
        </div>
      )}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        style={{ maxWidth: 560 }}
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
                {renderLonePairs(ax, ay, a.lonePairs ?? 0, bondAngles, lpStart, SVG_HEIGHT)}
              <circle cx={ax} cy={ay} r={ATOM_RADIUS} fill="#fafbfc" />
              <text
                x={ax}
                y={ay + 6}
                textAnchor="middle"
                fontSize={17}
                fontWeight={700}
                fill="#1f2937"
              >
                {a.element}
              </text>
              {a.formalCharge !== undefined && a.formalCharge !== 0 && (() => {
                // Formal charge as a circled sign (⊕ / ⊖, "2+" …), in the
                // diagonal corner furthest from this atom's bonds and lone pairs.
                const taken = [...bondAngles, ...lonePairAngles(a.lonePairs ?? 0, bondAngles)];
                // Candidate directions every 15°; the clearest wins, ties going
                // to the one nearest the usual upper-right corner.
                const corner = Array.from({ length: 24 }, (_, k) => k * 15)
                  .map((ang) => ({
                    ang,
                    clear: taken.length ? Math.min(...taken.map((t) => Math.abs(((ang - t + 540) % 360) - 180))) : 180,
                    off: Math.abs(((ang - 45 + 540) % 360) - 180),
                  }))
                  .sort((p, q) => (Math.min(q.clear, 60) - Math.min(p.clear, 60)) || (p.off - q.off))[0].ang;
                const rad = (corner * Math.PI) / 180;
                const bx = ax + Math.cos(rad) * (ATOM_RADIUS + 12);
                const by = ay - Math.sin(rad) * (ATOM_RADIUS + 12);
                const mag = Math.abs(a.formalCharge);
                const label = `${mag > 1 ? mag : ''}${a.formalCharge > 0 ? '+' : '−'}`;
                return (
                  <g>
                    <circle cx={bx} cy={by} r={mag > 1 ? 9 : 7.5} fill="#fafbfc" stroke="#dc2626" strokeWidth={1.3} />
                    <text x={bx} y={by + 4} textAnchor="middle" fontSize={mag > 1 ? 10.5 : 12.5} fontWeight={700} fill="#dc2626">{label}</text>
                  </g>
                );
              })()}
              </g>
            );
          });
        })()}
      </svg>
      {geometry && (
        <div className="text-center text-sm text-gray-600 mt-1">
          Shape: <span className="font-semibold text-gray-800">{geometry}</span>
        </div>
      )}
    </div>
  );
}
