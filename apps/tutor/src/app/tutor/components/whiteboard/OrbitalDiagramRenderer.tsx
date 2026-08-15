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
const H = DIAGRAM_VIEWBOX.height;

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
  I: 53, Xe: 54,
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
  return out;
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
  } else if (props.element && ELEMENT_Z[props.element]) {
    config = configFromZ(ELEMENT_Z[props.element]);
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
  } else if (element && ELEMENT_Z[element]) {
    config = configFromZ(ELEMENT_Z[element]);
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

  // Layout: each subshell a row: label + boxes.
  const rowHeight = 34;
  const boxSize = 22;
  const boxGap = 2;
  const labelW = 80;
  const top = title ? 46 : 18;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxHeight: 400 }}>
        {prefix && (
          <text x={labelW + 20} y={top - 20} fontSize={12} fill={DIAGRAM_COLORS.muted} fontWeight={700}>{prefix}</text>
        )}
        {config.map((sh, rowIdx) => {
          const y = top + rowIdx * rowHeight;
          const boxes = boxesFor(sh.subshell);
          const fill = hundFill(sh.electrons, boxes);
          const rowCx = labelW + (boxes * (boxSize + boxGap)) / 2;
          return (
            <g key={sh.subshell} {...feat(`orbital-${sh.subshell}`, { cx: rowCx, cy: y + boxSize / 2, w: boxes * (boxSize + boxGap) + 20, h: boxSize + 10 })}>
              {/* Subshell label (e.g. "2p") */}
              <text x={labelW - 12} y={y + boxSize / 2 + 4} fontSize={12} fill={DIAGRAM_COLORS.text} textAnchor="end" fontWeight={700}>
                {sh.subshell}
              </text>
              {/* Boxes */}
              {fill.map((slot, i) => {
                const bx = labelW + i * (boxSize + boxGap);
                return (
                  <g key={i}>
                    <rect x={bx} y={y} width={boxSize} height={boxSize} fill="white" stroke={DIAGRAM_COLORS.slate} strokeWidth={1.25} />
                    {slot === 'up' && (
                      <path d={`M ${bx + boxSize * 0.3} ${y + boxSize - 4} L ${bx + boxSize * 0.3} ${y + 4} L ${bx + boxSize * 0.15} ${y + 8} M ${bx + boxSize * 0.3} ${y + 4} L ${bx + boxSize * 0.45} ${y + 8}`}
                        stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                    )}
                    {slot === 'paired' && (
                      <g>
                        <path d={`M ${bx + boxSize * 0.3} ${y + boxSize - 4} L ${bx + boxSize * 0.3} ${y + 4} L ${bx + boxSize * 0.15} ${y + 8} M ${bx + boxSize * 0.3} ${y + 4} L ${bx + boxSize * 0.45} ${y + 8}`}
                          stroke={DIAGRAM_COLORS.primary} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                        <path d={`M ${bx + boxSize * 0.7} ${y + 4} L ${bx + boxSize * 0.7} ${y + boxSize - 4} L ${bx + boxSize * 0.55} ${y + boxSize - 8} M ${bx + boxSize * 0.7} ${y + boxSize - 4} L ${bx + boxSize * 0.85} ${y + boxSize - 8}`}
                          stroke={DIAGRAM_COLORS.secondary} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                      </g>
                    )}
                  </g>
                );
              })}
              {/* Electron count */}
              <text x={labelW + boxes * (boxSize + boxGap) + 14} y={y + boxSize / 2 + 4} fontSize={11} fill={DIAGRAM_COLORS.muted}>
                {sh.subshell}<tspan baselineShift="super" fontSize={8}>{sh.electrons}</tspan>
              </text>
            </g>
          );
        })}
        {/* Condensed notation summary */}
        <text x={W / 2} y={top + config.length * rowHeight + 20} fontSize={12} fill={DIAGRAM_COLORS.text} textAnchor="middle" fontWeight={600}>
          {prefix ? `${prefix} ` : ''}{config.map((c) => `${c.subshell}${c.electrons}`).join(' ')}
        </text>
      </svg>
    <DiagramNotes notes={notes} />
    </div>
  );
}
