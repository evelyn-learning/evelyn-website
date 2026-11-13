'use client';

import { InlineMathText } from './InlineMathText';
import React from 'react';
import type { SimpleCircuitFigure, CircuitComponent } from '@/lib/tutor/diagrams/catalog/kinds/physics';

const W = 640;
const H = 380;
const LOOP = { l: 140, r: 500, t: 84, b: 296 };
const INK = '#1f2937';
const FS = 12;
const LINE_H = 15;

type Side = 'left' | 'top' | 'right' | 'bottom';
const SIDE_ANGLE: Record<Side, number> = { top: 0, right: 90, bottom: 180, left: 270 };

// ── text helpers ──────────────────────────────────────────────────────────
// "R_1" is drawn as a real subscript; widths must not count the markup.
const SUB_RE = /_(\{[^}]*\}|[A-Za-z0-9]+)/g;
const plain = (s: string): string => s.replace(SUB_RE, (_, g: string) => g.replace(/[{}]/g, ''));
const estW = (s: string): number => plain(s).length * FS * 0.6;

function subParts(s: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of s.matchAll(SUB_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(s.slice(last, at));
    out.push(<tspan key={i++} baselineShift="sub" fontSize="72%">{m[1].replace(/[{}]/g, '')}</tspan>);
    last = at + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && plain(`${cur} ${w}`).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ── component geometry (local frame: wire along x, outside of the loop = −y) ─
/** Half the gap the symbol takes out of the wire. */
function halfLength(c: CircuitComponent): number {
  switch (c.type) {
    case 'battery': return 5;
    case 'resistor': return 26;
    case 'bulb': return 14;
    case 'switch': return 16;
    case 'ammeter':
    case 'voltmeter': return 15;
    default: return 0;
  }
}
/** How far the symbol sticks out of the loop (labels start beyond it). */
function outReach(c: CircuitComponent): number {
  switch (c.type) {
    case 'battery': return 14;
    case 'resistor': return 9;
    case 'bulb': return 14;
    case 'switch': return c.closed === true ? 4 : 18;
    case 'ammeter':
    case 'voltmeter': return 15;
    default: return 0;
  }
}

/** Label lines for a component: "R₁ = 220 Ω" on one line when it fits the
 *  budget, otherwise name over value; long names wrap. */
function labelLines(c: CircuitComponent, maxW: number, allowJoin = true): string[] {
  const maxChars = Math.max(6, Math.floor(maxW / (FS * 0.6)));
  let name = (c.label ?? '').trim();
  const value = (c.value ?? '').trim();
  if (!name && c.type === 'resistor') name = 'R';
  if (!name && c.type === 'switch') name = 'S';
  // The meter's letter is already inside its circle.
  if ((c.type === 'ammeter' && /^a$/i.test(name)) || (c.type === 'voltmeter' && /^v$/i.test(name))) name = '';
  if (name && value) {
    const joined = `${name} = ${value}`;
    if (allowJoin && plain(name).length <= 4 && estW(joined) <= maxW) return [joined];
    return [...wrap(name, maxChars), ...wrap(value, maxChars)];
  }
  return wrap(name || value, maxChars);
}

interface Placed { c: CircuitComponent; side: Side; x: number; y: number; slot: number }

/** Battery on the left run, the rest clockwise over top, right and bottom,
 *  evenly spaced along each straight run (never on a corner). */
function layout(components: CircuitComponent[]): Placed[] {
  const parts = components.filter((c) => c.type !== 'wire');
  if (parts.length === 0) return [];
  const first = Math.max(0, parts.findIndex((c) => c.type === 'battery'));
  const ordered = [...parts.slice(first), ...parts.slice(0, first)];
  const rest = ordered.slice(1);
  const k = rest.length;
  const nRight = k >= 8 ? 2 : k >= 1 ? 1 : 0;
  const nTop = Math.ceil((k - nRight) / 2);
  const nBottom = k - nRight - nTop;
  const { l, r, t, b } = LOOP;
  const out: Placed[] = [{ c: ordered[0], side: 'left', x: l, y: (t + b) / 2, slot: b - t }];
  let i = 0;
  for (let j = 0; j < nTop; j++, i++) {
    out.push({ c: rest[i], side: 'top', x: l + ((j + 0.5) / nTop) * (r - l), y: t, slot: (r - l) / nTop });
  }
  for (let j = 0; j < nRight; j++, i++) {
    out.push({ c: rest[i], side: 'right', x: r, y: t + ((j + 0.5) / nRight) * (b - t), slot: (b - t) / nRight });
  }
  for (let j = 0; j < nBottom; j++, i++) {
    out.push({ c: rest[i], side: 'bottom', x: r - ((j + 0.5) / nBottom) * (r - l), y: b, slot: (r - l) / nBottom });
  }
  return out;
}

/** Wire of one straight run, broken where the symbols sit. */
function runPath(placed: Placed[], side: Side): string {
  const { l, r, t, b } = LOOP;
  const horizontal = side === 'top' || side === 'bottom';
  const from = horizontal ? l : t;
  const to = horizontal ? r : b;
  const fixed = side === 'top' ? t : side === 'bottom' ? b : side === 'left' ? l : r;
  const gaps = placed
    .filter((p) => p.side === side)
    .map((p) => ({ at: horizontal ? p.x : p.y, half: halfLength(p.c) }))
    .sort((p, q) => p.at - q.at);
  const pt = (v: number): string => (horizontal ? `${v} ${fixed}` : `${fixed} ${v}`);
  let d = '';
  let cur = from;
  for (const g of gaps) {
    d += `M ${pt(cur)} L ${pt(g.at - g.half)} `;
    cur = g.at + g.half;
  }
  return `${d}M ${pt(cur)} L ${pt(to)}`;
}

export function CatalogSimpleCircuitRenderer({ figure }: { figure: SimpleCircuitFigure }) {
  const { components, title } = figure;
  const placed = layout(components);
  const sides: Side[] = ['left', 'top', 'right', 'bottom'];
  const budget = (p: Placed): number => (p.side === 'top' || p.side === 'bottom' ? p.slot - 14 : 118);
  // One style per run: if any "name = value" on a run has to be split over
  // two lines, all of that run's labels are split.
  const joinOk = (side: Side): boolean =>
    placed
      .filter((p) => p.side === side && p.c.label && p.c.value && plain(p.c.label.trim()).length <= 4)
      .every((p) => labelLines(p.c, budget(p)).length === 1);
  return (
    <div className="w-full flex flex-col items-center">
      {title && <div className="text-base font-semibold text-gray-800 mb-2"><InlineMathText text={title} /></div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[680px]">
        {sides.map((s) => (
          <path key={s} d={runPath(placed, s)} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        ))}
        {placed.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${SIDE_ANGLE[p.side]})`}>
            <ComponentSymbol c={p.c} />
          </g>
        ))}
        {/* Upright text in absolute coordinates, always outside the loop. */}
        {placed.map((p, i) => {
          const letter = p.c.type === 'ammeter' ? 'A' : p.c.type === 'voltmeter' ? 'V' : null;
          const lines = labelLines(p.c, budget(p), joinOk(p.side));
          const gap = outReach(p.c) + 8;
          const blockH = lines.length * LINE_H;
          const x = p.side === 'left' ? p.x - gap - 2 : p.side === 'right' ? p.x + gap + 2 : p.x;
          const top = p.side === 'top' ? p.y - gap - blockH : p.side === 'bottom' ? p.y + gap : p.y - blockH / 2;
          const anchor = p.side === 'left' ? 'end' : p.side === 'right' ? 'start' : 'middle';
          // "+" by the long plate, on the inside of the loop so it never
          // meets the label.
          const rad = (SIDE_ANGLE[p.side] * Math.PI) / 180;
          const plus = { x: p.x + 17 * Math.cos(rad) - 12 * Math.sin(rad), y: p.y + 17 * Math.sin(rad) + 12 * Math.cos(rad) };
          return (
            <g key={`lbl-${i}`}>
              {letter && <text x={p.x} y={p.y + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700}>{letter}</text>}
              {p.c.type === 'battery' && <text x={plus.x} y={plus.y + 5} fontSize={14} textAnchor="middle" fill={INK} fontWeight={700}>+</text>}
              {lines.map((line, j) => (
                <text key={j} x={x} y={top + j * LINE_H + 11} fontSize={FS} textAnchor={anchor} fill={INK} fontWeight={600}>
                  {subParts(line)}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ComponentSymbol({ c }: { c: CircuitComponent }) {
  if (c.type === 'battery') {
    // Long thin plate = positive terminal, short thick plate = negative.
    return (
      <g>
        <line x1={5} y1={-14} x2={5} y2={14} stroke={INK} strokeWidth={2} />
        <line x1={-5} y1={-7} x2={-5} y2={7} stroke={INK} strokeWidth={5} />
      </g>
    );
  }
  if (c.type === 'resistor') {
    return (
      <path
        d="M -26 0 L -22 -8 L -14 8 L -6 -8 L 2 8 L 10 -8 L 18 8 L 22 0 L 26 0"
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  }
  if (c.type === 'bulb') {
    return (
      <g>
        <circle cx={0} cy={0} r={14} fill="#fef3c7" stroke={INK} strokeWidth={2} />
        <line x1={-9.9} y1={-9.9} x2={9.9} y2={9.9} stroke={INK} strokeWidth={1.8} />
        <line x1={9.9} y1={-9.9} x2={-9.9} y2={9.9} stroke={INK} strokeWidth={1.8} />
      </g>
    );
  }
  if (c.type === 'switch') {
    const closed = c.closed === true;
    return (
      <g>
        <line x1={-16} y1={0} x2={closed ? 16 : 11.7} y2={closed ? 0 : -16} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={-16} cy={0} r={3.2} fill="#fff" stroke={INK} strokeWidth={2} />
        <circle cx={16} cy={0} r={3.2} fill="#fff" stroke={INK} strokeWidth={2} />
      </g>
    );
  }
  if (c.type === 'ammeter' || c.type === 'voltmeter') {
    return <circle cx={0} cy={0} r={15} fill="#fff" stroke={INK} strokeWidth={2} />;
  }
  return null;
}
