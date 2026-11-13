'use client';

import { InlineMathText } from './InlineMathText';
/**
 * Spring-Mass Renderer
 *
 * Shows a horizontal (default) or vertical spring connected to a mass, with
 * the spring drawn at natural length, then at a displaced position. Labels
 * the spring constant k, displacement x, mass m, and derived angular frequency
 * ω = √(k/m) + period T = 2π/ω.
 */

import React from 'react';
import { DIAGRAM_COLORS } from '@/lib/tutor/diagrams/theme';
import { DIAGRAM_VIEWBOX, formatValue, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { ArrowMarkers } from '@/lib/tutor/diagrams/arrows';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';

/** Feature bbox as fractions of the viewBox actually used (it is cropped to the figure). */
function feat(name: string, bbox: { cx: number; cy: number; w: number; h: number }, vb: { top: number; height: number } = { top: 0, height: DIAGRAM_VIEWBOX.height }) {
  return {
    'data-feature': name,
    'data-feature-cx': (bbox.cx / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-cy': ((bbox.cy - vb.top) / vb.height).toFixed(3),
    'data-feature-w': (bbox.w / DIAGRAM_VIEWBOX.width).toFixed(3),
    'data-feature-h': (bbox.h / vb.height).toFixed(3),
  };
}

/**
 * A single element in a multi-element spring-mass chain.
 * Chains let the tool draw series / coupled setups that single-mass mode
 * can't express (e.g. "wall - spring(k1) - mass(m1) - spring(k2) - mass(m2)").
 */
export interface SpringMassElement {
  type: 'wall' | 'spring' | 'mass';
  /** Optional label override (defaults: "k = … N/m", "m = … kg"). */
  label?: string;
  /** Spring constant in N/m — required for type: 'spring'. */
  k?: number;
  /** Natural length in meters for type: 'spring'. Default 1. */
  naturalLength?: number;
  /** Mass in kg — required for type: 'mass'. */
  mass?: number;
  /** Displacement of this mass from equilibrium in meters. Default 0. */
  displacement?: number;
}

export interface SpringMassProps {
  title?: string;

  /**
   * NEW (2026-04-23): left-to-right chain of elements. When provided,
   * renders a multi-element setup. Typical shapes:
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}]                       ← single mass (equiv. legacy mode)
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}, {spring,k:200}, {mass,mass:0.5}]  ← two masses in series
   *   [{wall}, {spring,k:200}, {mass,mass:0.5}, {spring,k:200}, {wall}]            ← mass between two walls
   *   [{mass,mass:0.5}, {spring,k:200}, {mass,mass:0.5}]                           ← free coupled oscillator
   * Legacy k/mass/displacement fields below are ignored when this is set.
   */
  elements?: SpringMassElement[];

  // ── Legacy single-mass fields (kept for backward compatibility) ──
  /** Spring constant in N/m. */
  k?: number;
  /** Mass in kg. */
  mass?: number;
  /** Displacement from equilibrium in meters (negative = compressed). */
  displacement?: number;
  /** Natural length of the spring in meters (for scaling only). Default 1. */
  naturalLength?: number;

  orientation?: 'horizontal' | 'vertical';
  notes?: string;
}

const W = DIAGRAM_VIEWBOX.width;

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildSpringMassManifest(props: SpringMassProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];

  // Chain mode takes precedence when elements[] is supplied.
  if (props.elements && props.elements.length > 0) {
    entries.push({
      name: 'ground',
      kind: 'line',
      description: 'horizontal ground line under the chain',
      labels: ['ground', 'floor', 'bottom', 'surface', 'baseline', 'ground line'],
    });
    const totalWalls = props.elements.filter((e) => e.type === 'wall').length;
    const totalSprings = props.elements.filter((e) => e.type === 'spring').length;
    const totalMasses = props.elements.filter((e) => e.type === 'mass').length;
    let wallN = 0, springN = 0, massN = 0;
    for (const el of props.elements) {
      if (el.type === 'wall') {
        wallN += 1;
        const wallLabels = [
          `wall-${wallN}`,
          `wall ${wallN}`,
          `support ${wallN}`,
          `attachment ${wallN}`,
          `anchor ${wallN}`,
        ];
        if (totalWalls === 1) {
          wallLabels.push('wall', 'support', 'attachment', 'anchor', 'ceiling', 'the wall');
        } else {
          wallLabels.push(
            wallN === 1 ? 'first wall' : wallN === totalWalls ? 'last wall' : `${ordinal(wallN)} wall`,
            wallN === 1 ? 'left wall' : wallN === totalWalls ? 'right wall' : '',
          );
        }
        if (el.label) wallLabels.push(el.label);
        entries.push({
          name: `wall-${wallN}`,
          kind: 'object',
          description: el.label ?? `fixed wall ${wallN} (left-to-right)`,
          labels: wallLabels.filter(Boolean),
        });
      } else if (el.type === 'spring') {
        springN += 1;
        const springLabels = [
          `spring-${springN}`,
          `spring ${springN}`,
          `${ordinal(springN)} spring`,
        ];
        if (totalSprings === 1) springLabels.push('spring', 'the spring');
        if (el.label) springLabels.push(el.label);
        if (el.k != null) springLabels.push(`k${springN}`, `k-${springN}`);
        entries.push({
          name: `spring-${springN}`,
          kind: 'object',
          description: el.label ?? `spring ${springN}, k = ${formatValue(el.k ?? 0)} N/m`,
          labels: springLabels,
        });
      } else if (el.type === 'mass') {
        massN += 1;
        const massLabels = [
          `mass-${massN}`,
          `mass ${massN}`,
          `m${massN}`,
          `m-${massN}`,
          `${ordinal(massN)} mass`,
          `block ${massN}`,
        ];
        if (totalMasses === 1) massLabels.push('mass', 'the mass', 'block', 'weight');
        if (el.label) massLabels.push(el.label);
        entries.push({
          name: `mass-${massN}`,
          kind: 'object',
          description: el.label ?? `mass ${massN}, m = ${formatValue(el.mass ?? 0)} kg`,
          labels: massLabels,
        });
      }
    }
    return entries;
  }

  // Legacy single-mass modes.
  const orientation = props.orientation ?? 'horizontal';
  if (orientation === 'horizontal') {
    entries.push({
      name: 'wall',
      kind: 'object',
      description: 'fixed wall (left edge, hatched)',
      labels: ['wall', 'support', 'attachment', 'anchor', 'ceiling', 'the wall', 'fixed wall', 'left wall'],
    });
    entries.push({
      name: 'ground',
      kind: 'line',
      description: 'horizontal ground line',
      labels: ['ground', 'floor', 'bottom', 'surface', 'baseline'],
    });
    entries.push({
      name: 'equilibrium',
      kind: 'annotation',
      description: 'faint reference spring + dashed mass at natural length',
      labels: ['equilibrium', 'natural length', 'rest position', 'equilibrium position', 'reference position'],
    });
    entries.push({
      name: 'spring',
      kind: 'object',
      description: `spring (k = ${formatValue(props.k ?? 0)} N/m)`,
      labels: ['spring', 'the spring', 'coil', 'k'],
    });
    entries.push({
      name: 'mass',
      kind: 'object',
      description: `mass block (m = ${formatValue(props.mass ?? 0)} kg)`,
      labels: ['mass', 'the mass', 'block', 'weight', 'm'],
    });
    entries.push({
      name: 'displacement',
      kind: 'annotation',
      description: `displacement arrow x = ${formatValue(props.displacement ?? 0)} m`,
      labels: ['displacement', 'x', 'the displacement', 'stretch', 'compression', 'offset'],
    });
  } else if (orientation === 'vertical') {
    entries.push({
      name: 'ceiling',
      kind: 'object',
      description: 'fixed ceiling (top, horizontal line)',
      labels: ['ceiling', 'wall', 'support', 'attachment', 'top', 'anchor', 'the ceiling', 'pivot'],
    });
    entries.push({
      name: 'equilibrium',
      kind: 'annotation',
      description: 'faint reference spring + dashed mass at natural length',
      labels: ['equilibrium', 'natural length', 'rest position', 'equilibrium position', 'reference position'],
    });
    entries.push({
      name: 'spring',
      kind: 'object',
      description: `vertical spring (k = ${formatValue(props.k ?? 0)} N/m)`,
      labels: ['spring', 'the spring', 'coil', 'k', 'vertical spring'],
    });
    entries.push({
      name: 'mass',
      kind: 'object',
      description: `mass block hanging from spring (m = ${formatValue(props.mass ?? 0)} kg)`,
      labels: ['mass', 'the mass', 'block', 'weight', 'm', 'bob'],
    });
    entries.push({
      name: 'displacement',
      kind: 'annotation',
      description: `displacement arrow x = ${formatValue(props.displacement ?? 0)} m`,
      labels: ['displacement', 'x', 'the displacement', 'stretch', 'offset'],
    });
  }
  return entries;
}

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

/** Given values keep their precision (up to 6 s.f.); derived ones show 3 s.f. */
function num(v: number, sig = 6): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const a = Math.abs(v);
  const s = a >= Math.pow(10, sig) ? String(Math.round(a)) : String(parseFloat(a.toPrecision(sig)));
  return (v < 0 ? '\u2212' : '') + s;
}
const calc = (v: number) => (Math.abs(v) >= 1000 ? num(Math.round(v), 9) : num(v, 3));

/** Zig-zag spring with a short straight lead at each end. */
function springPath(x1: number, y1: number, x2: number, y2: number, coils = 7, amplitude = 10): string {
  const dx = x2 - x1; const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length; const uy = dy / length;
  const nx = -uy; const ny = ux;
  const lead = Math.min(8, length * 0.12);
  const body = length - 2 * lead;
  const segments = coils * 2;
  const step = body / segments;
  let path = `M ${x1} ${y1} L ${x1 + ux * lead} ${y1 + uy * lead}`;
  for (let i = 0; i < segments; i++) {
    const along = lead + step * (i + 0.5);
    const side = i % 2 === 0 ? 1 : -1;
    path += ` L ${(x1 + ux * along + nx * amplitude * side).toFixed(2)} ${(y1 + uy * along + ny * amplitude * side).toFixed(2)}`;
  }
  path += ` L ${x2 - ux * lead} ${y2 - uy * lead} L ${x2} ${y2}`;
  return path;
}

/** "k_1" / "k_{eff}" → text with real subscripts. */
function splitSubs(text: string): Array<{ t: string; sub: boolean }> {
  const out: Array<{ t: string; sub: boolean }> = [];
  const re = /_(\{[^}]*\}|[A-Za-z0-9]+)/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ t: text.slice(last, m.index), sub: false });
    out.push({ t: m[1].replace(/[{}]/g, ''), sub: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: text.slice(last), sub: false });
  return out;
}
const textWidth = (text: string, fs: number, bold = false) =>
  splitSubs(text).reduce((a, p) => a + p.t.length * (p.sub ? 0.7 : 1), 0) * fs * (bold ? 0.6 : 0.56);

function Label({ text, x, y, fs, fill, bold, anchor = 'middle', halo = true }: {
  text: string; x: number; y: number; fs: number; fill: string; bold?: boolean;
  anchor?: 'start' | 'middle' | 'end'; halo?: boolean;
}) {
  const parts = splitSubs(text);
  let shifted = false;
  return (
    <text x={x} y={y} fontSize={fs} fill={fill} textAnchor={anchor} fontWeight={bold ? 700 : 500}
      {...(halo ? { stroke: 'white', strokeWidth: 3, paintOrder: 'stroke', strokeLinejoin: 'round' as const } : {})}>
      {parts.map((p, i) => {
        const dy = p.sub && !shifted ? fs * 0.28 : !p.sub && shifted ? -fs * 0.28 : 0;
        shifted = p.sub;
        return <tspan key={i} dy={dy} fontSize={p.sub ? fs * 0.72 : fs}>{p.t}</tspan>;
      })}
    </text>
  );
}

function MathCaption({ latex }: { latex: string }) {
  return (
    <div style={{ textAlign: 'center', fontSize: 15, color: DIAGRAM_COLORS.text, marginTop: 2, lineHeight: 1.9 }}>
      <InlineMathText text={`$${latex}$`} forceMath literalLineBreaks={false} />
    </div>
  );
}

const SVG_STYLE = { width: '100%', height: 'auto', maxWidth: 720, display: 'block', margin: '0 auto' } as const;
const INK = { block: DIAGRAM_COLORS.secondary, blockEdge: '#7f1d1d', dim: '#b45309' };

/** Rows for labels that share a band: one row if they fit, else alternate, else first free row. */
function assignRows(items: Array<{ cx: number; w: number }>, gap = 8): number[] {
  const clash = (rows: number[]) => items.some((a, i) => items.some((b, j) =>
    j > i && rows[i] === rows[j] && Math.abs(a.cx - b.cx) < (a.w + b.w) / 2 + gap));
  const flat = items.map(() => 0);
  if (!clash(flat)) return flat;
  const alt = items.map((_, i) => i % 2);
  if (!clash(alt)) return alt;
  const rows: number[] = [];
  items.forEach((a, i) => {
    let r = 0;
    while (items.some((b, j) => j < i && rows[j] === r && Math.abs(a.cx - b.cx) < (a.w + b.w) / 2 + gap)) r++;
    rows.push(r);
  });
  return rows;
}

/**
 * Left-to-right chain of walls, springs and masses on a floor. Blocks are
 * sized to hold their own label; a label that cannot fit goes under the
 * floor, never on it. Springs share the remaining width by their current
 * length (natural length plus any stretch), so a displaced spring looks it.
 */
function ChainRenderer({
  title, elements, notes,
}: { title?: string; elements: SpringMassElement[]; notes?: string }) {
  const FS = 11.5;
  const floorY = 150; const blockH = 56; const axisY = floorY - blockH / 2;
  const WALL_W = 12; const padX = 26;
  const avail = W - 2 * padX;
  const n = elements.length;

  const massText = elements.map((el) => (el.type === 'mass'
    ? (el.label ?? ((el.mass ?? 0) > 0 ? `m = ${num(el.mass ?? 0)} kg` : 'm')) : ''));
  const springText = elements.map((el) => (el.type === 'spring'
    ? (el.label ?? ((el.k ?? 0) > 0 ? `k = ${num(el.k ?? 0)} N/m` : 'k')) : ''));

  // Current length of each spring, in natural-length units.
  const weight = elements.map((el, i) => {
    if (el.type !== 'spring') return 0;
    const nat = Math.max(0.3, el.naturalLength ?? 1);
    const left = elements[i - 1]; const right = elements[i + 1];
    const shift = (el.displacement ?? 0)
      + (right?.type === 'mass' ? right.displacement ?? 0 : 0)
      - (left?.type === 'mass' ? left.displacement ?? 0 : 0);
    let ext = shift / nat;
    if (ext !== 0) ext = Math.sign(ext) * Math.min(ext > 0 ? 0.8 : 0.5, Math.max(0.22, Math.abs(ext)));
    return nat * (1 + ext);
  });
  const nSprings = elements.filter((e) => e.type === 'spring').length;
  const nMasses = elements.filter((e) => e.type === 'mass').length;
  const wallsW = elements.filter((e) => e.type === 'wall').length * WALL_W;
  const MIN_SPRING = 30;

  let massW = elements.map((el, i) => (el.type === 'mass'
    ? Math.min(96, Math.max(50, textWidth(massText[i], FS, true) + 16)) : 0));
  const room = avail - wallsW - nSprings * MIN_SPRING;
  if (nMasses > 0 && massW.reduce((a, b) => a + b, 0) > room) {
    const cap = Math.max(30, room / nMasses);
    massW = massW.map((w) => Math.min(w, cap));
  }
  const massTotal = massW.reduce((a, b) => a + b, 0);
  const springTotal = Math.max(nSprings * 18, avail - wallsW - massTotal);
  const floorEach = Math.min(24, (springTotal / Math.max(1, nSprings)) * 0.4);
  const sumWeight = weight.reduce((a, b) => a + b, 0) || 1;
  const pxPerWeight = Math.min((springTotal - nSprings * floorEach) / sumWeight, 110);
  const widths = elements.map((el, i) => (el.type === 'wall' ? WALL_W : el.type === 'mass' ? massW[i] : floorEach + weight[i] * pxPerWeight));
  const total = widths.reduce((a, b) => a + b, 0);
  const fit = total > avail ? avail / total : 1;
  let cursor = (W - total * fit) / 2;
  const placed = elements.map((el, i) => {
    const w = widths[i] * fit; const x = cursor; cursor += w;
    return { el, x, w, cx: x + w / 2, i };
  });
  const chainL = placed[0]?.x ?? padX; const chainR = cursor;

  // Labels above the chain (springs, walls) and under the floor (what does not fit in a block).
  const clampCx = (cx: number, w: number) => Math.min(W - 4 - w / 2, Math.max(4 + w / 2, cx));
  const massInside = placed.map(({ el, w, i }) => el.type === 'mass' && textWidth(massText[i], FS, true) + 8 <= w);
  const springInline = placed.every(({ el, w, i }) => el.type !== 'spring' || textWidth(springText[i], FS, true) + 6 <= w);
  type Item = { i: number; text: string; cx: number; w: number; color: string; anchorX: number };
  const above: Item[] = []; const belowNames: Item[] = []; const belowNotes: Item[] = [];
  for (const { el, cx, i } of placed) {
    if (el.type === 'spring' && !springInline) {
      const w = textWidth(springText[i], FS, true);
      above.push({ i, text: springText[i], cx: clampCx(cx, w), w, color: DIAGRAM_COLORS.primary, anchorX: cx });
    } else if (el.type === 'wall' && el.label) {
      const w = textWidth(el.label, FS);
      above.push({ i, text: el.label, cx: clampCx(cx, w), w, color: DIAGRAM_COLORS.muted, anchorX: cx });
    }
    if (el.type === 'mass' && !massInside[i]) {
      const w = textWidth(massText[i], FS, true);
      belowNames.push({ i, text: massText[i], cx: clampCx(cx, w), w, color: INK.blockEdge, anchorX: cx });
    }
    const disp = el.displacement ?? 0;
    if (disp !== 0 && el.type === 'spring') {
      const text = `${disp > 0 ? 'stretched' : 'compressed'} ${num(Math.abs(disp))} m`;
      const w = textWidth(text, FS);
      belowNotes.push({ i, text, cx: clampCx(cx, w), w, color: INK.dim, anchorX: cx });
    } else if (disp !== 0 && el.type === 'mass') {
      const text = `x = ${num(disp)} m`;
      const w = textWidth(text, FS);
      belowNotes.push({ i, text, cx: clampCx(cx, w), w, color: INK.dim, anchorX: cx });
    }
  }
  // Names first, then the displacement notes in their own band under them.
  const nameRows = assignRows(belowNames);
  const noteBase = belowNames.length ? Math.max(...nameRows) + 1 : 0;
  const below = [...belowNames, ...belowNotes];
  const belowRows = [...nameRows, ...assignRows(belowNotes).map((r) => r + noteBase)];
  const aboveRows = assignRows(above);
  const aboveY = (r: number) => floorY - blockH - 22 - r * 17;
  const belowY = (r: number) => floorY + 19 + r * 17;
  const vbTop = (above.length ? aboveY(Math.max(...aboveRows)) - FS : floorY - blockH - 22) - 10;
  const vbBottom = (below.length ? belowY(Math.max(...belowRows)) : floorY) + 12;
  const vb = { top: vbTop, height: vbBottom - vbTop };

  // A readout only where one is true: a single mass held by springs that are
  // anchored to a wall. Coupled masses have no single k or period.
  const masses = placed.filter((p) => p.el.type === 'mass');
  let caption: string | null = null;
  if (masses.length === 1 && (masses[0].el.mass ?? 0) > 0) {
    const at = masses[0].i;
    const sideK = (items: SpringMassElement[]): number | null => {
      // items run outward from the mass; they count only if they end at a wall.
      const wallAt = items.findIndex((e) => e.type === 'wall');
      if (wallAt <= 0) return null;
      const ks = items.slice(0, wallAt).map((e) => (e.type === 'spring' ? e.k ?? 0 : -1));
      if (ks.some((v) => v <= 0)) return null;
      return 1 / ks.reduce((a, v) => a + 1 / v, 0);
    };
    const sides = [sideK(elements.slice(0, at).reverse()), sideK(elements.slice(at + 1))];
    const anchored = sides.filter((v): v is number => v != null);
    const loose = [elements.slice(0, at), elements.slice(at + 1)].filter((side, j) => side.length > 0 && sides[j] == null).length;
    if (anchored.length > 0 && loose === 0) {
      const keff = anchored.reduce((a, b) => a + b, 0);
      const omega = Math.sqrt(keff / (masses[0].el.mass ?? 1));
      const combined = nSprings > 1;
      const kSym = combined ? 'k_{\\text{eff}}' : 'k';
      const how = anchored.length === 2 ? `${calc(anchored[0])} + ${calc(anchored[1])} = ` : '';
      caption = `${combined ? `k_{\\text{eff}} = ${how}${calc(keff)}\\ \\text{N/m} \\qquad ` : ''}`
        + `\\omega = \\sqrt{\\dfrac{${kSym}}{m}} = ${calc(omega)}\\ \\text{rad/s} \\qquad `
        + `T = \\dfrac{2\\pi}{\\omega} = ${calc((2 * Math.PI) / omega)}\\ \\text{s}`;
    }
  }

  let wallN = 0; let springN = 0; let massN = 0;
  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 ${vb.top} ${W} ${vb.height}`} xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <g {...feat('ground', { cx: (chainL + chainR) / 2, cy: floorY, w: chainR - chainL + 24, h: 8 }, vb)}>
          <line x1={chainL - 12} y1={floorY} x2={chainR + 12} y2={floorY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
        </g>

        {placed.map(({ el, x, w, cx, i }) => {
          if (el.type === 'wall') {
            wallN += 1;
            // The face the spring attaches to: right face of a left wall, left face of a right wall.
            const faceRight = i < n - 1 && (i === 0 || elements[i + 1]?.type === 'spring');
            const faceX = faceRight ? x + w : x;
            const top = floorY - blockH - 14;
            return (
              <g key={`wall-${i}`} {...feat(`wall-${wallN}`, { cx, cy: (top + floorY) / 2, w: w + 4, h: floorY - top }, vb)}>
                <rect x={x} y={top} width={w} height={floorY - top} fill="#e2e8f0" />
                {Array.from({ length: 6 }).map((_, hi) => (
                  <line key={hi} x1={x} y1={top + 12 + hi * 11.5} x2={x + w} y2={top + 2 + hi * 11.5} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
                ))}
                <line x1={faceX} y1={top} x2={faceX} y2={floorY} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
              </g>
            );
          }
          if (el.type === 'spring') {
            springN += 1;
            return (
              <g key={`spring-${i}`} {...feat(`spring-${springN}`, { cx, cy: axisY, w, h: 40 }, vb)}>
                <path d={springPath(x, axisY, x + w, axisY, 7, 10)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" strokeLinejoin="round" />
                {springInline && (
                  <Label text={springText[i]} x={cx} y={axisY - 18} fs={FS} fill={DIAGRAM_COLORS.primary} bold halo={false} />
                )}
              </g>
            );
          }
          massN += 1;
          return (
            <g key={`mass-${i}`} {...feat(`mass-${massN}`, { cx, cy: axisY, w: w + 4, h: blockH + 8 }, vb)}>
              <rect x={x} y={floorY - blockH} width={w} height={blockH - 1} rx={2} fill={INK.block} stroke={INK.blockEdge} strokeWidth={1.5} />
              {massInside[i] && (
                <Label text={massText[i]} x={cx} y={axisY + FS * 0.35} fs={FS} fill="white" bold halo={false} />
              )}
            </g>
          );
        })}

        {above.map((it, j) => (
          <g key={`above-${it.i}`}>
            <line x1={it.anchorX} y1={aboveY(aboveRows[j]) + 5} x2={it.anchorX} y2={axisY - 13} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />
            <Label text={it.text} x={it.cx} y={aboveY(aboveRows[j])} fs={FS} fill={it.color} bold />
          </g>
        ))}
        {below.map((it, j) => (
          <g key={`below-${it.i}-${j}`}>
            <line x1={it.anchorX} y1={floorY + 2} x2={it.anchorX} y2={belowY(belowRows[j]) - FS + 1} stroke={DIAGRAM_COLORS.border} strokeWidth={1} />
            <Label text={it.text} x={it.cx} y={belowY(belowRows[j])} fs={FS} fill={it.color} bold />
          </g>
        ))}
      </svg>
      {caption && <MathCaption latex={caption} />}
      <DiagramNotes notes={notes} />
    </div>
  );
}

export default function SpringMassRenderer({
  title,
  k = 0, mass = 0, displacement = 0,
  elements,
  naturalLength = 1,
  orientation = 'horizontal', notes,
}: SpringMassProps) {
  // Chain mode always renders horizontally: vertical chains are uncommon.
  if (elements && elements.length > 0) {
    return <ChainRenderer title={title} elements={elements} notes={notes} />;
  }

  const FS = 12;
  const omega = mass > 0 && k > 0 ? Math.sqrt(k / mass) : 0;
  const caption = omega > 0
    ? `\\omega = \\sqrt{\\dfrac{k}{m}} = ${calc(omega)}\\ \\text{rad/s} \\qquad T = \\dfrac{2\\pi}{\\omega} = ${calc((2 * Math.PI) / omega)}\\ \\text{s}`
    : `\\omega = \\sqrt{\\dfrac{k}{m}} \\qquad T = \\dfrac{2\\pi}{\\omega}`;
  const kText = k > 0 ? `k = ${num(k)} N/m` : 'k';
  const mText = mass > 0 ? `m = ${num(mass)} kg` : 'm';
  const xText = `x = ${num(displacement)} m`;
  const kW = textWidth(kText, FS, true); const xW = textWidth(xText, FS, true);
  // The block is wide enough to carry its own label.
  const blockW = Math.min(118, Math.max(64, textWidth(mText, FS, true) + 18));
  const pxPerM = (len: number) => len / Math.max(naturalLength, 0.1);
  // To scale where that is readable; a tiny offset is kept visible and a huge one kept on the board.
  const shownOffset = (len: number, maxStretch: number) => (displacement === 0 ? 0
    : Math.sign(displacement) * Math.min(displacement > 0 ? maxStretch : len * 0.55, Math.max(24, Math.abs(displacement) * pxPerM(len))));
  const vertical = orientation === 'vertical';

  let figure: React.ReactNode; let vb: { top: number; height: number };
  if (!vertical) {
    const wallX = 62; const floorY = 150; const blockH = 64; const axisY = floorY - blockH / 2;
    const Ln = 170; const d = shownOffset(Ln, 150);
    const eqX = wallX + Ln; const faceX = eqX + d;
    const top = floorY - blockH - 46;
    vb = { top: top - 8, height: floorY + 50 - (top - 8) };
    // k sits over the part of the spring that is always there, clear of the block and the dashed line.
    const kCx = Math.max(wallX + 8 + kW / 2, wallX + Math.min(Ln, Ln + d) / 2);
    const kHigh = kCx + kW / 2 > faceX - 6;
    const dimY = floorY + 22;
    const xCx = Math.min(W - 6 - xW / 2, Math.max(wallX + xW / 2, (eqX + faceX) / 2));
    figure = (
      <g>
        <g {...feat('wall', { cx: wallX - 7, cy: floorY - 50, w: 22, h: 100 }, vb)}>
          <rect x={wallX - 14} y={floorY - 100} width={14} height={100} fill="#e2e8f0" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={wallX - 14} y1={floorY - 88 + i * 12} x2={wallX} y2={floorY - 98 + i * 12} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
          ))}
          <line x1={wallX} y1={floorY - 100} x2={wallX} y2={floorY} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        </g>
        <g {...feat('ground', { cx: (wallX + W - 20) / 2, cy: floorY, w: W - 20 - wallX, h: 6 }, vb)}>
          <line x1={wallX - 14} y1={floorY} x2={W - 20} y2={floorY} stroke={DIAGRAM_COLORS.slate} strokeWidth={1.5} />
        </g>

        {/* Equilibrium: where the block's near face rests */}
        <g {...feat('equilibrium', { cx: eqX, cy: (top + floorY) / 2, w: 70, h: floorY - top + 30 }, vb)}>
          <line x1={eqX} y1={top + 8} x2={eqX} y2={floorY + 30} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} strokeDasharray="5 4" />
          <text x={eqX} y={top + 2} fontSize={FS - 1} fill={DIAGRAM_COLORS.muted} textAnchor="middle" fontStyle="italic">equilibrium</text>
        </g>

        <g {...feat('spring', { cx: (wallX + faceX) / 2, cy: axisY, w: faceX - wallX, h: 40 }, vb)}>
          <path d={springPath(wallX, axisY, faceX, axisY, 8, 12)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" strokeLinejoin="round" />
          <Label text={kText} x={kCx} y={kHigh ? floorY - blockH - 8 : axisY - 21} fs={FS} fill={DIAGRAM_COLORS.primary} bold />
        </g>

        <g {...feat('mass', { cx: faceX + blockW / 2, cy: axisY, w: blockW + 6, h: blockH + 8 }, vb)}>
          <rect x={faceX} y={floorY - blockH} width={blockW} height={blockH - 1} rx={2} fill={INK.block} stroke={INK.blockEdge} strokeWidth={1.5} />
          <Label text={mText} x={faceX + blockW / 2} y={axisY + FS * 0.35} fs={FS} fill="white" bold halo={false} />
        </g>

        <g {...feat('displacement', { cx: (eqX + faceX) / 2, cy: dimY + 8, w: Math.abs(d) + 12, h: 34 }, vb)}>
          {d !== 0 && (
            <>
              <line x1={faceX} y1={floorY + 3} x2={faceX} y2={floorY + 30} stroke={INK.dim} strokeWidth={1} />
              <line x1={Math.min(eqX, faceX) + 1} y1={dimY} x2={Math.max(eqX, faceX) - 1} y2={dimY} stroke={INK.dim} strokeWidth={1.5}
                markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
            </>
          )}
          <Label text={xText} x={xCx} y={dimY + 20} fs={FS} fill={INK.dim} bold />
        </g>
      </g>
    );
  } else {
    const cx = 232; const ceilY = 30; const blockH = 60;
    const Ln = 112; const d = shownOffset(Ln, 96);
    const eqY = ceilY + Ln; const faceY = eqY + d;
    vb = { top: 4, height: Math.max(eqY, faceY) + blockH + 14 - 4 };
    const lineL = cx - blockW / 2 - 16; const lineR = cx + blockW / 2 + 128;
    const dimX = cx + blockW / 2 + 30;
    figure = (
      <g>
        <g {...feat('ceiling', { cx, cy: ceilY - 6, w: 180, h: 16 }, vb)}>
          <rect x={cx - 90} y={ceilY - 14} width={180} height={14} fill="#e2e8f0" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={cx - 88 + i * 13} y1={ceilY} x2={cx - 78 + i * 13} y2={ceilY - 14} stroke={DIAGRAM_COLORS.slate} strokeWidth={1} />
          ))}
          <line x1={cx - 90} y1={ceilY} x2={cx + 90} y2={ceilY} stroke={DIAGRAM_COLORS.slate} strokeWidth={3} />
        </g>

        <g {...feat('equilibrium', { cx: (lineL + lineR) / 2, cy: eqY, w: lineR - lineL, h: 30 }, vb)}>
          <line x1={lineL} y1={eqY} x2={lineR} y2={eqY} stroke={DIAGRAM_COLORS.muted} strokeWidth={1.25} strokeDasharray="5 4" />
          <text x={lineR} y={d >= 0 ? eqY - 7 : eqY + 16} fontSize={FS - 1} fill={DIAGRAM_COLORS.muted} textAnchor="end" fontStyle="italic">equilibrium</text>
        </g>

        <g {...feat('spring', { cx, cy: (ceilY + faceY) / 2, w: 40, h: faceY - ceilY }, vb)}>
          <path d={springPath(cx, ceilY, cx, faceY, 8, 12)} stroke={DIAGRAM_COLORS.primary} strokeWidth={2} fill="none" strokeLinejoin="round" />
          <Label text={kText} x={cx - 22} y={ceilY + Math.min(Ln, Ln + d) / 2 + 4} fs={FS} fill={DIAGRAM_COLORS.primary} bold anchor="end" />
        </g>

        <g {...feat('mass', { cx, cy: faceY + blockH / 2, w: blockW + 6, h: blockH + 8 }, vb)}>
          <rect x={cx - blockW / 2} y={faceY} width={blockW} height={blockH} rx={2} fill={INK.block} stroke={INK.blockEdge} strokeWidth={1.5} />
          <Label text={mText} x={cx} y={faceY + blockH / 2 + FS * 0.35} fs={FS} fill="white" bold halo={false} />
        </g>

        <g {...feat('displacement', { cx: dimX + 30, cy: (eqY + faceY) / 2, w: 90, h: Math.abs(d) + 12 }, vb)}>
          {d !== 0 && (
            <>
              <line x1={cx + blockW / 2 + 3} y1={faceY} x2={dimX + 7} y2={faceY} stroke={INK.dim} strokeWidth={1} />
              <line x1={dimX} y1={Math.min(eqY, faceY) + 1} x2={dimX} y2={Math.max(eqY, faceY) - 1} stroke={INK.dim} strokeWidth={1.5}
                markerStart="url(#spr-arrow-warning)" markerEnd="url(#spr-arrow-warning)" />
            </>
          )}
          <Label text={xText} x={dimX + 10} y={(eqY + faceY) / 2 + (d === 0 ? (16) : 4)} fs={FS} fill={INK.dim} bold anchor="start" />
        </g>
      </g>
    );
  }

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, marginBottom: 4, color: DIAGRAM_COLORS.text }}><InlineMathText text={title} /></div>
      )}
      <svg viewBox={`0 ${vb.top} ${W} ${vb.height}`} xmlns="http://www.w3.org/2000/svg"
        style={vertical ? { ...SVG_STYLE, maxWidth: 560 } : SVG_STYLE}>
        <ArrowMarkers idPrefix="spr-arrow" />
        {figure}
      </svg>
      <MathCaption latex={caption} />
      <DiagramNotes notes={notes} />
    </div>
  );
}
