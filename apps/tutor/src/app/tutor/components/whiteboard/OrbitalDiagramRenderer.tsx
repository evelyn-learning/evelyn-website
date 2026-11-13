'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Orbital Diagram Renderer
 *
 * Electron configuration box-and-arrow notation. Shows each subshell (1s,
 * 2s, 2p, 3s, 3p, 4s, 3d…) as a row of boxes with up/down arrows indicating
 * electron spin and pairing, following Aufbau, Pauli, and Hund's rules.
 *
 * Accepts either:
 *   - `element`: an element symbol ("N", "Fe") — derive configuration
 *     automatically from atomic number.
 *   - `configuration`: explicit list of {subshell, electrons} entries.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

export interface OrbitalDiagramProps {
  title?: string;
  /** Element symbol (we look up atomic number and derive config). */
  element?: string;
  /** Explicit configuration override, e.g. [{subshell:'1s',electrons:2}, …]. */
  configuration?: Array<{ subshell: string; electrons: number }>;
  /** Show a noble-gas core prefix (e.g. [Ne]). Default false. */
  condensed?: boolean;
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;

// Aufbau filling order
const SUBSHELL_ORDER: Array<{ name: string; capacity: number; z: number }> = [
  { name: '1s', capacity: 2, z: 0 },
  { name: '2s', capacity: 2, z: 0 },
  { name: '2p', capacity: 6, z: 0 },
  { name: '3s', capacity: 2, z: 0 },
  { name: '3p', capacity: 6, z: 0 },
  { name: '4s', capacity: 2, z: 0 },
  { name: '3d', capacity: 10, z: 0 },
  { name: '4p', capacity: 6, z: 0 },
  { name: '5s', capacity: 2, z: 0 },
  { name: '4d', capacity: 10, z: 0 },
  { name: '5p', capacity: 6, z: 0 },
  { name: '6s', capacity: 2, z: 0 },
  { name: '4f', capacity: 14, z: 0 },
  { name: '5d', capacity: 10, z: 0 },
  { name: '6p', capacity: 6, z: 0 },
  { name: '7s', capacity: 2, z: 0 },
];

const ELEMENT_Z: Record<string, number> = {
  H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
  Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18,
  K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30,
  Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36,
  Rb: 37, Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48,
  In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, Xe: 54,
};

/** Ground states that break the simple filling order (a half-full or full d
 *  subshell wins): Z → [s subshell, its electrons, d subshell, its electrons]. */
const AUFBAU_EXCEPTIONS: Record<number, [string, number, string, number]> = {
  24: ['4s', 1, '3d', 5], 29: ['4s', 1, '3d', 10],
  41: ['5s', 1, '4d', 4], 42: ['5s', 1, '4d', 5], 44: ['5s', 1, '4d', 7],
  45: ['5s', 1, '4d', 8], 46: ['5s', 0, '4d', 10], 47: ['5s', 1, '4d', 10],
};

function configFromZ(z: number): Array<{ subshell: string; electrons: number }> {
  const out: Array<{ subshell: string; electrons: number }> = [];
  let remaining = z;
  for (const sh of SUBSHELL_ORDER) {
    if (remaining <= 0) break;
    const fill = Math.min(remaining, sh.capacity);
    out.push({ subshell: sh.name, electrons: fill });
    remaining -= fill;
  }
  const ex = AUFBAU_EXCEPTIONS[z];
  if (ex) {
    for (const c of out) {
      if (c.subshell === ex[0]) c.electrons = ex[1];
      if (c.subshell === ex[2]) c.electrons = ex[3];
    }
  }
  return out.filter((c) => c.electrons > 0);
}

/** "fe" / "FE" → "Fe". */
function canonicalSymbol(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const t = raw.trim();
  return t ? t[0].toUpperCase() + t.slice(1).toLowerCase() : undefined;
}

function boxesFor(subshell: string): number {
  const type = subshell.slice(-1);
  if (type === 's') return 1;
  if (type === 'p') return 3;
  if (type === 'd') return 5;
  if (type === 'f') return 7;
  return 1;
}

function hundFill(electrons: number, boxes: number): Array<'empty' | 'up' | 'paired'> {
  const slots: Array<'empty' | 'up' | 'paired'> = new Array(boxes).fill('empty');
  let left = electrons;
  // First pass: put one up arrow per box (Hund).
  for (let i = 0; i < boxes && left > 0; i++) {
    slots[i] = 'up'; left--;
  }
  // Second pass: pair up (fill with a down arrow).
  for (let i = 0; i < boxes && left > 0; i++) {
    slots[i] = 'paired'; left--;
  }
  return slots;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Mirrors the renderer's config-derivation + condensed-prefix logic so names
 * match exactly.
 */
export function buildOrbitalDiagramManifest(props: OrbitalDiagramProps): FeatureManifestEntry[] {
  let config: Array<{ subshell: string; electrons: number }> = [];
  if (props.configuration && props.configuration.length > 0) {
    config = props.configuration;
  } else if (ELEMENT_Z[canonicalSymbol(props.element) ?? '']) {
    config = configFromZ(ELEMENT_Z[canonicalSymbol(props.element) as string]);
  }
  if (config.length === 0) return [];

  const NOBLE: Array<{ symbol: string; after: string }> = [
    { symbol: '[Rn]', after: '6p' }, { symbol: '[Xe]', after: '5p' },
    { symbol: '[Kr]', after: '4p' }, { symbol: '[Ar]', after: '3p' },
    { symbol: '[Ne]', after: '2p' }, { symbol: '[He]', after: '1s' },
  ];
  if (props.condensed) {
    for (const n of NOBLE) {
      const idx = config.findIndex((c) => c.subshell === n.after);
      if (idx >= 0) {
        const upTo = config.slice(0, idx + 1);
        const complete = upTo.every((c) => {
          const cap = SUBSHELL_ORDER.find((s) => s.name === c.subshell)?.capacity ?? 0;
          return c.electrons === cap;
        });
        if (complete) {
          config = config.slice(idx + 1);
          break;
        }
      }
    }
  }

  return config.map((sh) => {
    const labels = new Set<string>([
      `orbital-${sh.subshell}`,
      sh.subshell,
      `${sh.subshell} orbital`,
      `${sh.subshell} subshell`,
      `the ${sh.subshell}`,
      `the ${sh.subshell} orbital`,
    ]);
    return {
      name: `orbital-${sh.subshell}`,
      kind: 'object' as const,
      description: `${sh.subshell} subshell with ${sh.electrons} electron${sh.electrons === 1 ? '' : 's'}`,
      labels: Array.from(labels),
    };
  });
}

export default function OrbitalDiagramRenderer({
  title, element, configuration, condensed, notes,
}: OrbitalDiagramProps) {
  let config: Array<{ subshell: string; electrons: number }> = [];
  if (configuration && configuration.length > 0) {
    config = configuration;
  } else if (ELEMENT_Z[canonicalSymbol(element) ?? '']) {
    config = configFromZ(ELEMENT_Z[canonicalSymbol(element) as string]);
  }

  if (config.length === 0) {
    return <div style={{ padding: 24, color: DIAGRAM_COLORS.muted, fontStyle: 'italic' }}>Unknown element or empty configuration.</div>;
  }

  // Condensed: replace leading full shells with noble-gas symbol.
  const NOBLE: Array<{ symbol: string; after: string }> = [
    { symbol: '[Rn]', after: '6p' }, { symbol: '[Xe]', after: '5p' },
    { symbol: '[Kr]', after: '4p' }, { symbol: '[Ar]', after: '3p' },
    { symbol: '[Ne]', after: '2p' }, { symbol: '[He]', after: '1s' },
  ];
  let prefix: string | null = null;
  if (condensed) {
    for (const n of NOBLE) {
      const idx = config.findIndex((c) => c.subshell === n.after);
      if (idx >= 0) {
        const upTo = config.slice(0, idx + 1);
        const complete = upTo.every((c) => {
          const cap = SUBSHELL_ORDER.find((s) => s.name === c.subshell)?.capacity ?? 0;
          return c.electrons === cap;
        });
        if (complete) {
          prefix = n.symbol;
          config = config.slice(idx + 1);
          break;
        }
      }
    }
  }

  // Layout: each subshell a row: label + boxes + count. The block is centred
  // in the frame and the frame is only as tall as the rows need.
  const many = config.length > 8;
  const rowHeight = many ? 30 : 38;
  const boxSize = many ? 24 : 28;
  const boxGap = 3;
  const maxBoxes = Math.max(...config.map((c) => boxesFor(c.subshell)));
  const blockW = 34 + maxBoxes * (boxSize + boxGap) + 44;
  const labelW = (W - blockW) / 2 + 34;
  const top = prefix ? 40 : 12;
  const svgH = top + config.length * rowHeight + 40;
  const dims = { width: W, height: svgH };
  const upArrow = (bx: number, y: number, fx: number) => {
    const x = bx + boxSize * fx;
    return `M ${x} ${y + boxSize - 5} L ${x} ${y + 5} M ${x - 3.5} ${y + 10} L ${x} ${y + 5} L ${x + 3.5} ${y + 10}`;
  };
  const downArrow = (bx: number, y: number, fx: number) => {
    const x = bx + boxSize * fx;
    return `M ${x} ${y + 5} L ${x} ${y + boxSize - 5} M ${x - 3.5} ${y + boxSize - 10} L ${x} ${y + boxSize - 5} L ${x + 3.5} ${y + boxSize - 10}`;
  };

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${svgH}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxWidth: 620, display: 'block', margin: '0 auto' }}>
        {prefix && (
          <text x={labelW} y={top - 16} fontSize={14} fill={DIAGRAM_COLORS.text} fontWeight={700}>
            {prefix}<tspan fontWeight={400} fill={DIAGRAM_COLORS.muted}>{' core, then:'}</tspan>
          </text>
        )}
        {config.map((sh, rowIdx) => {
          const y = top + rowIdx * rowHeight;
          const boxes = boxesFor(sh.subshell);
          const fill = hundFill(sh.electrons, boxes);
          const rowCx = labelW + (boxes * (boxSize + boxGap)) / 2;
          return (
            <g key={sh.subshell} {...feat(`orbital-${sh.subshell}`, { cx: rowCx, cy: y + boxSize / 2, w: boxes * (boxSize + boxGap) + 20, h: boxSize + 10 }, dims)}>
              {/* Subshell label (e.g. "2p") */}
              <text x={labelW - 12} y={y + boxSize / 2 + 5} fontSize={14} fill={DIAGRAM_COLORS.text} textAnchor="end" fontWeight={700}>
                {sh.subshell}
              </text>
              {/* Boxes: an up arrow (first electron) and a down arrow (its partner) */}
              {fill.map((slot, i) => {
                const bx = labelW + i * (boxSize + boxGap);
                return (
                  <g key={i}>
                    <rect x={bx} y={y} width={boxSize} height={boxSize} rx={1.5} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
                    {(slot === 'up' || slot === 'paired') && (
                      <path d={upArrow(bx, y, slot === 'paired' ? 0.33 : 0.5)} stroke={DIAGRAM_COLORS.primary} strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {slot === 'paired' && (
                      <path d={downArrow(bx, y, 0.67)} stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </g>
                );
              })}
              {/* Electron count */}
              <text x={labelW + boxes * (boxSize + boxGap) + 12} y={y + boxSize / 2 + 5} fontSize={13} fill={DIAGRAM_COLORS.muted}>
                {sh.subshell}<tspan baselineShift="super" fontSize={9.5}>{sh.electrons}</tspan>
              </text>
            </g>
          );
        })}
        {/* Notation summary, with the electron counts as superscripts */}
        <text x={W / 2} y={top + config.length * rowHeight + 22} fontSize={15} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
          {prefix ? `${prefix} ` : ''}
          {config.map((c, i) => (
            <tspan key={i}>{i > 0 ? ' ' : ''}{c.subshell}<tspan baselineShift="super" fontSize={10.5}>{c.electrons}</tspan></tspan>
          ))}
        </text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
