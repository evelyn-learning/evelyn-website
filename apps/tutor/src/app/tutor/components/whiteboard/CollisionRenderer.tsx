'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
import { InlineMathText } from './InlineMathText';
/**
 * Collision Diagram Renderer
 *
 * Teaches conservation of momentum by showing a labeled "before" and "after"
 * snapshot of a collision. Each object is a filled circle sized roughly by
 * mass (visual hint, not to scale), with a velocity arrow whose length scales
 * with speed so students can *see* the momentum exchange.
 *
 * Supports three collision types with different after-state conventions:
 *   • elastic             — separate objects, each with its own velocity
 *   • inelastic           — separate objects with reduced KE but some separation
 *   • perfectly-inelastic — objects stuck together with a single combined
 *                            velocity (rendered as a single larger blob)
 *
 * Dimension is 1D by default — velocities interpreted as horizontal. Pass
 * dimension="2D" to render 2D collisions with vx/vy on each object.
 */

import React from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { DiagramNotes } from '@/lib/tutor/diagrams/DiagramNotes';
import { wrapLabel } from './fraction-bar-layout';

export interface CollisionBody {
  label?: string;
  mass?: number;
  /** 1D: velocity along x (positive = right). 2D: use vx instead. */
  velocity?: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CollisionProps {
  title?: string;
  dimension?: '1D' | '2D';
  type?: 'elastic' | 'inelastic' | 'perfectly-inelastic';
  before: CollisionBody[];
  after: CollisionBody[];
  notes?: string;
  /** Optional momentum annotation above or below the panels (e.g. "p = Σmv = 10 kg·m/s"). */
  momentumAnnotation?: string;
}

// 560 wide: the label-collision fixtures assume this viewBox.
const VIEWBOX_W = 560;
const PANEL_W = 256;
const PANEL_Y = 54;
const LEFT_PANEL_X = 10;
const RIGHT_PANEL_X = VIEWBOX_W - PANEL_W - 10;

const COLORS = {
  text: '#0f172a',
  muted: '#64748b',
  axis: '#475569',
  panel: '#f8fafc',
  panelBorder: '#cbd5e1',
  arrow: '#dc2626',
  arrowMuted: '#94a3b8',
  defaultBody: ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#0891b2'],
};

const MIN_RADIUS = 14;
const MAX_RADIUS = 30;
// Shortest arrow still shows a shaft behind its head.
const MIN_ARROW = 21;
const MAX_ARROW = 72;

function pickColor(body: CollisionBody, idx: number): string {
  return body.color || COLORS.defaultBody[idx % COLORS.defaultBody.length];
}

function darken(hex: string): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 50);
  const g = Math.max(0, ((n >> 8) & 0xff) - 50);
  const b = Math.max(0, (n & 0xff) - 50);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function Panel({
  x,
  y,
  width,
  height,
  title,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill={COLORS.panel}
        stroke={COLORS.panelBorder}
        strokeWidth={1.5}
      />
      <text
        x={x + width / 2}
        y={y - 8}
        fontSize={13}
        fill={COLORS.text}
        fontWeight={600}
        textAnchor="middle"
      >
        {mathifyDollarSpans(title)}
      </text>
    </g>
  );
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Mirrors the "perfectly-inelastic 1D after" collapsing rule — in that case
 * the after panel emits a single combined object (object-1-after).
 */
export function buildCollisionManifest(props: CollisionProps): FeatureManifestEntry[] {
  // Velocity in the description (value-blindness audit, 2026-07-23): the
  // momentum quantity — the number the tutor teaches WITH — was dropped;
  // only mass survived to the board snapshot.
  const vOf = (b: CollisionBody): string => {
    if (b.velocity != null) return `, v = ${b.velocity}`;
    if (b.vx != null || b.vy != null) return `, v = (${b.vx ?? 0}, ${b.vy ?? 0})`;
    return '';
  };
  const entries: FeatureManifestEntry[] = [];
  const dimension = props.dimension ?? '1D';
  const type = props.type ?? 'elastic';
  const before = Array.isArray(props.before) ? props.before : [];
  const after = Array.isArray(props.after) ? props.after : [];

  before.forEach((b, i) => {
    const idx = i + 1;
    const label = b.label || String.fromCharCode(65 + i);
    const letter = String.fromCharCode(65 + i);
    entries.push({
      name: `object-${idx}-before`,
      kind: 'object',
      description: `body "${label}" in the "before" panel${b.mass != null ? `, m = ${b.mass}` : ''}${vOf(b)}`,
      labels: [
        `object-${idx}-before`,
        `object ${idx} before`,
        `m${idx} before`,
        `mass ${idx} before`,
        `body ${idx} before`,
        `${letter} before`,
        `${label} before`,
        `before ${letter}`,
        `before ${label}`,
        `${label} (before)`,
        idx === 1 ? 'first object before' : idx === 2 ? 'second object before' : `${ordinal(idx)} object before`,
      ].filter(Boolean),
    });
  });

  const combine = type === 'perfectly-inelastic' && dimension === '1D' && after.length >= 1;
  if (combine) {
    const mergedLabel = after.map((b) => b.label ?? '').filter(Boolean).join('+') || 'A+B';
    entries.push({
      name: 'object-1-after',
      kind: 'object',
      description: `merged object "${mergedLabel}" in the "after" panel (perfectly inelastic)${after[0] ? vOf(after[0]) : ''}`,
      labels: [
        'object-1-after',
        'object 1 after',
        'merged object',
        'combined object',
        'stuck together',
        'the merged object',
        mergedLabel,
        `${mergedLabel} after`,
        'after',
        'combined mass',
      ],
    });
  } else {
    after.forEach((b, i) => {
      const idx = i + 1;
      const label = b.label || String.fromCharCode(65 + i);
      const letter = String.fromCharCode(65 + i);
      entries.push({
        name: `object-${idx}-after`,
        kind: 'object',
        description: `body "${label}" in the "after" panel${b.mass != null ? `, m = ${b.mass}` : ''}${vOf(b)}`,
        labels: [
          `object-${idx}-after`,
          `object ${idx} after`,
          `m${idx} after`,
          `mass ${idx} after`,
          `body ${idx} after`,
          `${letter} after`,
          `${label} after`,
          `after ${letter}`,
          `after ${label}`,
          `${label} (after)`,
          `${label}'`,
          idx === 1 ? 'first object after' : idx === 2 ? 'second object after' : `${ordinal(idx)} object after`,
        ].filter(Boolean),
      });
    });
  }

  if (props.momentumAnnotation) {
    entries.push({
      name: 'momentum',
      kind: 'annotation',
      description: `momentum annotation: ${props.momentumAnnotation}`,
      labels: ['momentum', 'p', 'momentum annotation', 'total momentum', 'Σmv', 'conservation of momentum', 'p total'],
    });
  }

  return entries;
}

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

/** Estimated width of a label (sans, about 0.56 em a glyph; bold a little wider). */
function estWidth(text: string, fontSize: number, bold = false): number {
  return text.length * fontSize * (bold ? 0.6 : 0.56);
}

/** Break a long body name into lines no wider than `maxW`. */
function wrapName(name: string, maxW: number, fontSize: number, balance = true): string[] {
  const words = name.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && estWidth(next, fontSize, true) > maxW) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length === 0) return [name];
  // Even out the lines so the last one is not a stranded fragment.
  if (lines.length > 1 && balance) {
    const target = estWidth(name, fontSize, true) / lines.length + fontSize;
    const even = wrapName(name, Math.min(maxW, target), fontSize, false);
    if (even.length === lines.length) return even;
  }
  return lines;
}

/** "p_before" → p with a subscript; plain runs stay as they are. */
function subscripted(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /([A-Za-zͰ-Ͽ′’'])_\{?([A-Za-z0-9]+)\}?/g;
  let last = 0;
  let lowered = false;
  let m: RegExpExecArray | null;
  let key = 0;
  const push = (t: string, sub: boolean) => {
    if (!t) return;
    // dy is relative to the previous run: drop for a subscript, rise back after it.
    const dy = sub ? (lowered ? 0 : 3.5) : lowered ? -3.5 : 0;
    lowered = sub;
    parts.push(<tspan key={key++} dy={dy} fontSize={sub ? '0.76em' : undefined}>{t}</tspan>);
  };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index) + m[1], false);
    push(m[2], true);
    last = m.index + m[0].length;
  }
  push(text.slice(last), false);
  return parts;
}

interface BodyText {
  x: number;
  y: number;
  text: string;
  anchor: 'start' | 'middle' | 'end';
  kind: 'name' | 'v' | 'rest' | 'mass';
  /** Rides just above a level arrow: keeps its clearance when the row is scaled down. */
  level?: boolean;
}

/** One body with its arrow and labels, in coordinates relative to its centre. */
interface BodyBox {
  key: string;
  featName: string;
  r: number;
  color: string;
  inside: string | null;
  arrow: { x1: number; y1: number; x2: number; y2: number } | null;
  texts: BodyText[];
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const FONT = { name: 12, v: 12, mass: 11, rest: 11 } as const;
const LINE_H = 14;
const ARROW_HEAD = 10;

export default function CollisionRenderer({
  title,
  dimension = '1D',
  type = 'elastic',
  before,
  after,
  notes,
  momentumAnnotation,
}: CollisionProps) {
  // Defensive: the enricher / tool-call payload occasionally omits or
  // mistypes `before`/`after`. Coerce to arrays so the renderer never
  // crashes on `[...before]` when the field is undefined or an object.
  const beforeBodies: CollisionBody[] = Array.isArray(before) ? before : [];
  const rawAfter: CollisionBody[] = Array.isArray(after) ? after : [];
  const speedOf = (b: CollisionBody): number => {
    if (dimension === '2D') return Math.hypot(b.vx ?? 0, b.vy ?? 0);
    return Math.abs(b.velocity ?? b.vx ?? 0);
  };

  // Conservation-law sanity check. Catches the common failure mode where the
  // model computes after-velocities incorrectly (e.g. wrong elastic-collision
  // formula) — its output would then violate momentum conservation, which is
  // a bright-red physics error. We surface a warning in the UI rather than
  // silently rendering the bad diagram.
  const momentumOf = (bodies: CollisionBody[]): { px: number; py: number } => {
    let px = 0;
    let py = 0;
    for (const b of bodies) {
      const m = b.mass ?? 1;
      if (dimension === '2D') {
        px += m * (b.vx ?? 0);
        py += m * (b.vy ?? 0);
      } else {
        px += m * (b.velocity ?? b.vx ?? 0);
      }
    }
    return { px, py };
  };
  const kineticEnergyOf = (bodies: CollisionBody[]): number => {
    let ke = 0;
    for (const b of bodies) {
      const m = Math.abs(b.mass ?? 1);
      const v2 = dimension === '2D'
        ? (b.vx ?? 0) ** 2 + (b.vy ?? 0) ** 2
        : (b.velocity ?? b.vx ?? 0) ** 2;
      ke += 0.5 * m * v2;
    }
    return ke;
  };
  const pBefore = momentumOf(beforeBodies);
  const pAfter = momentumOf(rawAfter);
  const keBefore = kineticEnergyOf(beforeBodies);
  const keAfter = kineticEnergyOf(rawAfter);
  // Relative error threshold: 1% of the larger total (with a small absolute
  // floor so comparisons near zero don't explode).
  const nearlyEqual = (a: number, b: number): boolean => {
    const scale = Math.max(Math.abs(a), Math.abs(b), 0.5);
    return Math.abs(a - b) / scale <= 0.01;
  };
  const momentumConserved = dimension === '2D'
    ? nearlyEqual(pBefore.px, pAfter.px) && nearlyEqual(pBefore.py, pAfter.py)
    : nearlyEqual(pBefore.px, pAfter.px);
  const keConserved = nearlyEqual(keBefore, keAfter);

  const warnings: string[] = [];
  if (!momentumConserved) {
    const pBStr = dimension === '2D'
      ? `(${formatNum(pBefore.px)}, ${formatNum(pBefore.py)})`
      : formatNum(pBefore.px);
    const pAStr = dimension === '2D'
      ? `(${formatNum(pAfter.px)}, ${formatNum(pAfter.py)})`
      : formatNum(pAfter.px);
    warnings.push(`⚠ Momentum not conserved: before ${pBStr} → after ${pAStr} kg·m/s`);
  }
  if (type === 'elastic' && !keConserved) {
    warnings.push(
      `⚠ Elastic collision: KE not conserved (before ${formatNum(keBefore)} J → after ${formatNum(keAfter)} J)`,
    );
  }

  // Perfectly inelastic, 1D: the "after" panel shows one merged body.
  const combine = type === 'perfectly-inelastic' && dimension === '1D' && rawAfter.length >= 1;
  const afterBodies: CollisionBody[] = combine
    ? [{
        ...rawAfter[0],
        label: rawAfter.map((b) => b.label ?? '').filter(Boolean).join('+') || 'A+B',
        mass: rawAfter.reduce((sum, b) => sum + (b.mass ?? 0), 0) || undefined,
      }]
    : rawAfter;

  // One scale for mass → radius and speed → arrow length across both panels,
  // clamped so a 15 kg bicycle beside a 12 500 kg lorry is still a readable disc
  // and a slow body still shows a shaft.
  const allBodies = [...beforeBodies, ...afterBodies];
  const maxMass = Math.max(...allBodies.map((b) => Math.abs(b.mass ?? 1)), 1e-9);
  const maxSpeed = Math.max(...allBodies.map(speedOf), 1e-9);
  const radiusFor = (m: number): number =>
    MIN_RADIUS + Math.sqrt(Math.abs(m) / maxMass) * (MAX_RADIUS - MIN_RADIUS);

  function buildBody(b: CollisionBody, i: number, isAfter: boolean, maxArrow: number, nameMaxW: number): BodyBox {
    const r = radiusFor(b.mass ?? 1);
    const speed = speedOf(b);
    const name = b.label || String.fromCharCode(65 + i);
    const nameInside = estWidth(name, FONT.name, true) <= 2 * r - 8;
    const texts: BodyText[] = [];

    // Direction of travel (screen y points down, vy is positive up).
    let ux = 0;
    let uy = 0;
    if (speed > 0) {
      if (dimension === '2D') {
        ux = (b.vx ?? 0) / speed;
        uy = -(b.vy ?? 0) / speed;
      } else {
        ux = (b.velocity ?? b.vx ?? 0) >= 0 ? 1 : -1;
      }
    }
    const len = speed > 0 ? MIN_ARROW + (speed / maxSpeed) * (maxArrow - MIN_ARROW) : 0;
    const arrow = speed > 0
      ? { x1: ux * (r + 3), y1: uy * (r + 3), x2: ux * (r + 3 + len), y2: uy * (r + 3 + len) }
      : null;

    const vText = `${isAfter ? 'v′' : 'v'} = ${vString(b, dimension)}`;
    if (arrow) {
      if (Math.abs(uy) < 0.35) {
        // Level arrow: the label rides above the shaft, starting at the body's edge,
        // so two bodies closing on each other keep their labels on their own sides.
        texts.push({ x: ux > 0 ? r + 5 : -(r + 5), y: Math.min(arrow.y1, arrow.y2) - 8, text: vText, anchor: ux > 0 ? 'start' : 'end', kind: 'v', level: true });
      } else {
        // Steep arrow: the label sits just past the tip.
        texts.push({
          x: arrow.x2 + ux * 6,
          y: arrow.y2 + (uy < 0 ? -7 : 16),
          text: vText,
          anchor: ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle',
          kind: 'v',
        });
      }
    }

    // Stacks of centred lines above and below the body, kept off the arrow's side.
    const arrowUp = !!arrow && uy < -0.6;
    const arrowDown = !!arrow && uy > 0.6;
    const above: Array<{ text: string; kind: BodyText['kind'] }> = [];
    const below: Array<{ text: string; kind: BodyText['kind'] }> = [];
    if (!nameInside) {
      const lines = wrapName(name, nameMaxW, FONT.name).map((text) => ({ text, kind: 'name' as const }));
      if (arrowUp) below.push(...lines);
      else above.push(...lines);
    }
    const underBody = arrowDown ? above : below;
    if (speed === 0) underBody.push({ text: 'at rest', kind: 'rest' });
    if (b.mass != null) underBody.push({ text: `m = ${formatNum(b.mass)}`, kind: 'mass' });
    above.forEach((line, k) => {
      texts.push({ x: 0, y: -r - 8 - (above.length - 1 - k) * LINE_H, text: line.text, anchor: 'middle', kind: line.kind });
    });
    below.forEach((line, k) => {
      texts.push({ x: 0, y: r + 16 + k * LINE_H, text: line.text, anchor: 'middle', kind: line.kind });
    });

    let left = -r;
    let right = r;
    let top = -r;
    let bottom = r;
    if (arrow) {
      left = Math.min(left, arrow.x2 - 6);
      right = Math.max(right, arrow.x2 + 6);
      top = Math.min(top, arrow.y2 - 6);
      bottom = Math.max(bottom, arrow.y2 + 6);
    }
    for (const t of texts) {
      const fs = FONT[t.kind];
      const w = estWidth(t.text, fs, t.kind === 'name' || t.kind === 'v');
      const x0 = t.anchor === 'start' ? t.x : t.anchor === 'end' ? t.x - w : t.x - w / 2;
      left = Math.min(left, x0);
      right = Math.max(right, x0 + w);
      top = Math.min(top, t.y - fs);
      bottom = Math.max(bottom, t.y + 4);
    }
    return {
      key: `${isAfter ? 'after' : 'before'}-${i}`,
      featName: `object-${i + 1}-${isAfter ? 'after' : 'before'}`,
      r,
      color: pickColor(b, i),
      inside: nameInside ? name : null,
      arrow,
      texts,
      left,
      right,
      top,
      bottom,
    };
  }

  const BODY_GAP = 14;
  const USABLE_W = PANEL_W - 2 * 10;
  const rowWidth = (boxes: BodyBox[]): number =>
    boxes.reduce((sum, bx) => sum + (bx.right - bx.left), 0) + BODY_GAP * Math.max(0, boxes.length - 1);

  // Longest arrows that let both panels fit; the same scale in both so speeds compare.
  let beforeBoxes: BodyBox[] = [];
  let afterBoxes: BodyBox[] = [];
  const buildAll = (maxArrow: number): boolean => {
    const build = (bodies: CollisionBody[], isAfter: boolean) =>
      bodies.map((b, i) => buildBody(b, i, isAfter, maxArrow, bodies.length <= 2 ? 96 : 64));
    beforeBoxes = build(beforeBodies, false);
    afterBoxes = build(afterBodies, true);
    return rowWidth(beforeBoxes) <= USABLE_W && rowWidth(afterBoxes) <= USABLE_W;
  };
  // If even short arrows do not fit, the labels are what take the room: keep readable
  // arrows and let the whole row scale down instead.
  if (![MAX_ARROW, 60, 50, 40, 32, 26].some(buildAll)) buildAll(50);
  // One scale for both panels, so a body is the same size before and after.
  const rowScale = Math.min(1, USABLE_W / Math.max(rowWidth(beforeBoxes), rowWidth(afterBoxes), 1));

  const allBoxes = [...beforeBoxes, ...afterBoxes];
  const topExtent = Math.max(40, ...allBoxes.map((bx) => -bx.top));
  const bottomExtent = Math.max(40, ...allBoxes.map((bx) => bx.bottom));
  const PANEL_H = Math.max(170, topExtent + bottomExtent + 40);
  const rowY = PANEL_Y + (PANEL_H - topExtent - bottomExtent) / 2 + topExtent;
  const bodyH = PANEL_Y + PANEL_H;

  // Momentum annotation, wrapped to the viewBox width (2026-08-07 clip
  // audit: a long brain-authored annotation used to render as one unwrapped
  // centered line and clip on BOTH sides).
  const momentumLines = momentumAnnotation ? wrapLabel(momentumAnnotation, VIEWBOX_W - 40) : [];
  const MOMENTUM_LINE_H = 17;
  const momentumY = bodyH + 28;
  const momentumH = momentumLines.length > 0 ? 28 + (momentumLines.length - 1) * MOMENTUM_LINE_H + 8 : 12;
  const warningsY = bodyH + momentumH + 14;
  const viewH = bodyH + momentumH + (warnings.length > 0 ? warnings.length * 18 + 8 : 0);

  /** Centres of a panel's bodies: packed by their boxes, spare room shared out (but not flung apart). */
  function placeRow(boxes: BodyBox[], panelX: number): { centres: number[]; scale: number } {
    const total = rowWidth(boxes);
    const scale = rowScale;
    const spare = Math.max(0, USABLE_W / scale - total);
    const between = boxes.length > 1 ? Math.min(34, spare / (boxes.length + 1)) : 0;
    const used = total + between * Math.max(0, boxes.length - 1);
    let cursor = -used / 2;
    const centres = boxes.map((bx) => {
      const cx = cursor - bx.left;
      cursor = cx + bx.right + BODY_GAP + between;
      return cx;
    });
    // Relative to the panel's centre, scaled about it when the row is too wide.
    return { centres: centres.map((c) => panelX + PANEL_W / 2 + c * scale), scale };
  }

  function renderPanel(boxes: BodyBox[], panelX: number): React.ReactElement {
    const { centres, scale } = placeRow(boxes, panelX);
    return (
      <g>
        {boxes.map((bx, i) => {
          const cx = centres[i];
          const featBox = { cx, cy: rowY, w: (bx.r * 2 + 40) * scale, h: (bx.r * 2 + 40) * scale };
          // Absolute coordinates on every element (no group transform), so label audits read true positions.
          const X = (v: number) => cx + v * scale;
          const Y = (v: number) => rowY + v * scale;
          const a = bx.arrow;
          let arrowEl: React.ReactElement | null = null;
          if (a) {
            const alen = Math.hypot(a.x2 - a.x1, a.y2 - a.y1) || 1;
            const ux = (a.x2 - a.x1) / alen;
            const uy = (a.y2 - a.y1) / alen;
            // Shaft stops inside the head so the tip stays sharp.
            const tipX = X(a.x2);
            const tipY = Y(a.y2);
            const hx = tipX - ux * ARROW_HEAD;
            const hy = tipY - uy * ARROW_HEAD;
            arrowEl = (
              <g>
                <line x1={X(a.x1)} y1={Y(a.y1)} x2={hx + ux} y2={hy + uy} stroke={COLORS.arrow} strokeWidth={3} strokeLinecap="round" />
                <polygon
                  points={`${tipX},${tipY} ${hx - uy * 5.5},${hy + ux * 5.5} ${hx + uy * 5.5},${hy - ux * 5.5}`}
                  fill={COLORS.arrow}
                />
              </g>
            );
          }
          // A row squeezed to fit keeps its text legible down to 85 %.
          const fontScale = Math.max(scale, 0.85);
          return (
            <g key={bx.key} {...feat(bx.featName, featBox, { width: VIEWBOX_W, height: viewH })}>
              <circle cx={cx} cy={rowY} r={bx.r * scale} fill={bx.color} stroke={darken(bx.color)} strokeWidth={2} />
              {bx.inside && (
                <text x={cx} y={rowY + 4.5} fontSize={FONT.name * fontScale} fill="white" fontWeight={700} textAnchor="middle">
                  {bx.inside}
                </text>
              )}
              {arrowEl}
              {bx.texts.map((t, k) => (
                <text
                  key={k}
                  x={X(t.x)}
                  y={t.level ? rowY + t.y : Y(t.y)}
                  fontSize={FONT[t.kind] * fontScale}
                  textAnchor={t.anchor}
                  fill={t.kind === 'v' ? COLORS.arrow : t.kind === 'name' ? COLORS.text : COLORS.muted}
                  fontWeight={t.kind === 'v' || t.kind === 'name' ? 600 : 400}
                  fontStyle={t.kind === 'rest' ? 'italic' : undefined}
                >
                  {t.text}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    );
  }

  const midX = VIEWBOX_W / 2;
  const midY = PANEL_Y + PANEL_H / 2;

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 8,
            color: COLORS.text,
          }}
        >
          <InlineMathText text={title} />
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto', maxWidth: 800, margin: '0 auto' }}
      >
        {/* Collision-type badge */}
        <text x={midX} y={20} fontSize={13} fill={COLORS.muted} textAnchor="middle" fontStyle="italic">
          {labelForType(type)} · {dimension}
        </text>

        <Panel x={LEFT_PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} title="Before" />
        <Panel x={RIGHT_PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} title="After" />

        {/* "Becomes" arrow between the panels: neutral, so it is not read as a velocity. */}
        <g stroke={COLORS.arrowMuted} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={midX - 9} y1={midY} x2={midX + 8} y2={midY} />
          <polyline points={`${midX + 3},${midY - 6} ${midX + 9},${midY} ${midX + 3},${midY + 6}`} />
        </g>

        {renderPanel(beforeBoxes, LEFT_PANEL_X)}
        {renderPanel(afterBoxes, RIGHT_PANEL_X)}

        {momentumAnnotation && momentumLines.length > 0 && (
          <text
            x={midX}
            y={momentumY}
            fontSize={13}
            fill={COLORS.text}
            textAnchor="middle"
            fontWeight={600}
            {...feat('momentum', { cx: midX, cy: momentumY + ((momentumLines.length - 1) * MOMENTUM_LINE_H) / 2, w: Math.min(VIEWBOX_W, Math.max(240, momentumAnnotation.length * 8 + 20)), h: 8 + momentumLines.length * MOMENTUM_LINE_H }, { width: VIEWBOX_W, height: viewH })}
          >
            {momentumLines.map((line, i) => (
              <tspan key={i} x={midX} y={momentumY + i * MOMENTUM_LINE_H}>{subscripted(line)}</tspan>
            ))}
          </text>
        )}

        {/* Conservation-law warnings, stacked below all other content */}
        {warnings.map((w, i) => (
          <text
            key={`warn-${i}`}
            x={midX}
            y={warningsY + i * 18}
            fontSize={12}
            fill="#b91c1c"
            fontWeight={600}
            textAnchor="middle"
          >
            {w}
          </text>
        ))}
      </svg>
      {/* Notes as wrapping HTML below the SVG (shared DiagramNotes idiom —
          the in-SVG single-line version clipped long captions; 2026-08-07
          clip audit). */}
      <DiagramNotes notes={notes} />
    </div>
  );
}

function labelForType(t: 'elastic' | 'inelastic' | 'perfectly-inelastic'): string {
  switch (t) {
    case 'elastic':
      return 'Elastic collision';
    case 'inelastic':
      return 'Inelastic collision';
    case 'perfectly-inelastic':
      return 'Perfectly inelastic (objects stick)';
  }
}

/** Up to four significant figures, no trailing zeros, a true minus, thousands grouped from 10 000. */
function formatNum(v: number): string {
  if (!Number.isFinite(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  let text: string;
  if (abs >= 1e9 || abs < 1e-3) {
    const [mant, exp] = abs.toExponential(2).split('e');
    text = `${Number(mant)} × 10^${Number(exp)}`;
  } else if (abs >= 1000) {
    const rounded = String(Number(abs.toFixed(1)));
    const [int, frac] = rounded.split('.');
    // Narrow no-break space between groups of three.
    const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
    text = frac ? `${grouped}.${frac}` : grouped;
  } else {
    text = String(Number(abs.toPrecision(4)));
  }
  return (v < 0 ? '−' : '') + text;
}

function vString(b: CollisionBody, dimension: '1D' | '2D'): string {
  if (dimension === '2D') {
    return `(${formatNum(b.vx ?? 0)}, ${formatNum(b.vy ?? 0)})`;
  }
  return formatNum(b.velocity ?? b.vx ?? 0);
}
