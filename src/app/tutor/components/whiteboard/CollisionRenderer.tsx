'use client';

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
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

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

const VIEWBOX_W = 560;
const VIEWBOX_H = 360;
const PANEL_W = VIEWBOX_W / 2 - 20;
const PANEL_H = 230;
const PANEL_Y = 70;
const LEFT_PANEL_X = 10;
const RIGHT_PANEL_X = VIEWBOX_W / 2 + 10;

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
const MAX_RADIUS = 36;
const MIN_ARROW = 18;
const MAX_ARROW = 100;

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
        {title}
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
  const afterBodies: CollisionBody[] = Array.isArray(after) ? after : [];
  // Compute universal scales for mass→radius and speed→arrow-length so the
  // "before" and "after" panels render at compatible scales.
  const allBodies = [...beforeBodies, ...afterBodies];
  const maxMass = Math.max(...allBodies.map((b) => Math.abs(b.mass ?? 1)), 1);
  const speedOf = (b: CollisionBody): number => {
    if (dimension === '2D') return Math.hypot(b.vx ?? 0, b.vy ?? 0);
    return Math.abs(b.velocity ?? b.vx ?? 0);
  };
  const maxSpeed = Math.max(...allBodies.map(speedOf), 0.001);

  const radiusFor = (m: number): number => {
    const t = Math.sqrt(Math.abs(m) / maxMass);
    return MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS);
  };
  const arrowLenFor = (speed: number): number => {
    if (speed === 0) return 0;
    return MIN_ARROW + (speed / maxSpeed) * (MAX_ARROW - MIN_ARROW);
  };

  const arrowMarkerId = 'collision-arrowhead';

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
  const pAfter = momentumOf(afterBodies);
  const keBefore = kineticEnergyOf(beforeBodies);
  const keAfter = kineticEnergyOf(afterBodies);
  const pMag = (p: { px: number; py: number }) => Math.hypot(p.px, p.py);
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
      ? `(${pBefore.px.toFixed(2)}, ${pBefore.py.toFixed(2)})`
      : pBefore.px.toFixed(2);
    const pAStr = dimension === '2D'
      ? `(${pAfter.px.toFixed(2)}, ${pAfter.py.toFixed(2)})`
      : pAfter.px.toFixed(2);
    warnings.push(`⚠ Momentum not conserved: before ${pBStr} → after ${pAStr} kg·m/s`);
  }
  if (type === 'elastic' && !keConserved) {
    warnings.push(
      `⚠ Elastic collision: KE not conserved (before ${keBefore.toFixed(2)} J → after ${keAfter.toFixed(2)} J)`,
    );
  }

  // ── Panel/body geometry + shared label layout (2026-07-19 renderer
  // label-collision audit) ── velocity / mass / "at rest" labels were placed
  // per body with no knowledge of neighbors: head-on 1D collisions cap both
  // arrows into the same inter-body gap so both speed labels composite there,
  // and a vertical 2D arrow gets its wide label centered across its own
  // shaft. Geometry (unchanged) is computed first, then one deoverlapLabels
  // pass over every data-positioned label with the bodies, arrow shafts,
  // panel titles and fixed captions as obstacles.
  interface BodyGeom {
    key: string;
    featName: string;
    featBox: { cx: number; cy: number; w: number; h: number };
    cx: number;
    cy: number;
    r: number;
    color: string;
    glyph: string;
    arrow: { x1: number; y1: number; x2: number; y2: number } | null;
    vLabel: { x: number; y: number; text: string; preferDir: 'up' | 'down' } | null;
    atRestY: number | null;
    massY: number;
    massText: string;
  }

  // For 1D, bodies are laid out horizontally along the panel midline, spaced
  // evenly. For 2D, arrows point at vx/vy-derived angles from each body.
  function layoutPanel(bodies: CollisionBody[], panelX: number, isAfter: boolean): BodyGeom[] {
    const panelCenterY = PANEL_Y + PANEL_H / 2;
    // Perfectly inelastic "after" panel = single merged blob
    const combine =
      isAfter && type === 'perfectly-inelastic' && dimension === '1D' && bodies.length >= 1;
    if (combine) {
      // Combine all bodies into one
      const totalMass = bodies.reduce((sum, b) => sum + (b.mass ?? 0), 0);
      const combined = bodies[0];
      const r = radiusFor(totalMass || 1);
      const speed = speedOf(combined);
      const dir = (combined.velocity ?? combined.vx ?? 0) >= 0 ? 1 : -1;
      const arrowLen = arrowLenFor(speed) * dir;
      const centerX = panelX + PANEL_W / 2;
      const mergedLabel = bodies.map((b) => b.label ?? '').filter(Boolean).join('+') || 'A+B';
      return [{
        key: 'after-0',
        featName: 'object-1-after',
        featBox: { cx: centerX, cy: panelCenterY, w: r * 2 + 40, h: r * 2 + 40 },
        cx: centerX,
        cy: panelCenterY,
        r,
        color: pickColor(combined, 0),
        glyph: mergedLabel,
        arrow: arrowLen !== 0
          ? { x1: centerX + r * dir, y1: panelCenterY, x2: centerX + r * dir + arrowLen, y2: panelCenterY }
          : null,
        vLabel: speed > 0
          ? {
              x: centerX + r * dir + arrowLen / 2,
              y: panelCenterY - 10,
              text: `v′ = ${formatNum(combined.velocity ?? combined.vx ?? 0)}`,
              preferDir: 'up',
            }
          : null,
        atRestY: null,
        massY: panelCenterY + r + 16,
        massText: `m = ${formatNum(totalMass)}`,
      }];
    }

    // Standard layout: spread bodies horizontally in 1D, or place at vx/vy-derived positions in 2D.
    const n = bodies.length;
    // Panel-edge padding. Bodies are laid out evenly inside this usable band,
    // leaving room for velocity arrows and their labels on both ends.
    const EDGE_PAD = 22;
    const LABEL_GAP = 10;        // text clearance past the arrow tip
    const BETWEEN_BODIES_GAP = 12; // min gap between a body's edge and a neighbor's arrow tip

    // Pre-compute body radii and centers so we can clamp arrow lengths by
    // the space actually available to each arrow.
    const radii = bodies.map((b) => radiusFor(b.mass ?? 1));
    const usable = PANEL_W - 2 * EDGE_PAD;
    const slotW = usable / Math.max(n, 1);
    const centers = bodies.map((_, i) => panelX + EDGE_PAD + slotW * (i + 0.5));

    // Compute the max arrow length available to each body given neighbors
    // and panel edges. Returns a non-negative length the arrow may consume
    // beyond the body's edge, in the direction of travel.
    function maxArrowLen1D(idx: number, dir: 1 | -1): number {
      const cx = centers[idx];
      const r = radii[idx];
      if (dir > 0) {
        // Rightward: bounded by the next body's left edge or the panel's right edge.
        const bound = idx < n - 1
          ? centers[idx + 1] - radii[idx + 1] - BETWEEN_BODIES_GAP
          : panelX + PANEL_W - EDGE_PAD;
        return Math.max(0, bound - (cx + r) - LABEL_GAP);
      }
      // Leftward: bounded by previous body's right edge or panel's left edge.
      const bound = idx > 0
        ? centers[idx - 1] + radii[idx - 1] + BETWEEN_BODIES_GAP
        : panelX + EDGE_PAD;
      return Math.max(0, (cx - r) - bound - LABEL_GAP);
    }

    function maxArrowLen2D(idx: number): number {
      const cx = centers[idx];
      const cy = panelCenterY;
      const r = radii[idx];
      // 2D: bound by the tightest of the four panel sides.
      const boundX = Math.min(panelX + PANEL_W - EDGE_PAD - cx, cx - (panelX + EDGE_PAD));
      const boundY = Math.min(panelCenterY + PANEL_H / 2 - EDGE_PAD - cy, cy - (PANEL_Y + EDGE_PAD));
      return Math.max(0, Math.min(boundX, boundY) - r - LABEL_GAP);
    }

    return bodies.map((b, i): BodyGeom => {
      const featName = isAfter ? `object-${i + 1}-after` : `object-${i + 1}-before`;
      const r = radii[i];
      const cx = centers[i];
      const cy = panelCenterY;
      const color = pickColor(b, i);
      const speed = speedOf(b);

      let arrowStartX = cx;
      let arrowStartY = cy;
      let arrowEndX = cx;
      let arrowEndY = cy;
      let arrowDrawn = false;
      let labelX = cx;
      let labelY = cy - r - 10;
      let labelPreferDir: 'up' | 'down' = 'up';

      if (speed > 0) {
        if (dimension === '2D') {
          const vx = b.vx ?? 0;
          const vy = b.vy ?? 0;
          const theta = Math.atan2(vy, vx);
          const requested = arrowLenFor(Math.hypot(vx, vy));
          const cap = maxArrowLen2D(i);
          const len = Math.min(requested, cap);
          if (len > 4) {
            arrowStartX = cx + Math.cos(theta) * r;
            arrowStartY = cy - Math.sin(theta) * r;
            arrowEndX = arrowStartX + Math.cos(theta) * len;
            arrowEndY = arrowStartY - Math.sin(theta) * len;
            // Label perpendicular to the arrow (offset "above" travel direction)
            const nx = -Math.sin(theta);
            const ny = -Math.cos(theta);
            const midX = (arrowStartX + arrowEndX) / 2;
            const midY = (arrowStartY + arrowEndY) / 2;
            labelX = midX + nx * 14;
            labelY = midY + ny * 14;
            labelPreferDir = ny > 0 ? 'down' : 'up';
            arrowDrawn = true;
          }
        } else {
          const v = b.velocity ?? b.vx ?? 0;
          const dir: 1 | -1 = v >= 0 ? 1 : -1;
          const requested = arrowLenFor(Math.abs(v));
          const cap = maxArrowLen1D(i, dir);
          const len = Math.min(requested, cap);
          if (len > 4) {
            arrowStartX = cx + r * dir;
            arrowEndX = arrowStartX + len * dir;
            arrowStartY = cy;
            arrowEndY = cy;
            // Label above arrow midpoint.
            labelX = (arrowStartX + arrowEndX) / 2;
            labelY = cy - 10;
            arrowDrawn = true;
          }
        }
      }

      const labelText = isAfter ? `v′ = ${vString(b, dimension)}` : `v = ${vString(b, dimension)}`;

      return {
        key: isAfter ? `after-${i}` : `before-${i}`,
        featName,
        featBox: { cx, cy, w: r * 2 + 40, h: r * 2 + 40 },
        cx,
        cy,
        r,
        color,
        glyph: b.label || String.fromCharCode(65 + i),
        arrow: arrowDrawn ? { x1: arrowStartX, y1: arrowStartY, x2: arrowEndX, y2: arrowEndY } : null,
        vLabel: speed > 0
          ? (arrowDrawn
            // Not enough room to draw an arrow — the velocity is still
            // reported as text above the body so the student sees the value.
            ? { x: labelX, y: labelY, text: labelText, preferDir: labelPreferDir }
            : { x: cx, y: cy - r - 8, text: labelText, preferDir: 'up' })
          : null,
        atRestY: speed === 0 ? cy + r + 14 : null,
        massY: cy + r + (speed === 0 ? 28 : 20),
        massText: b.mass != null ? `m = ${formatNum(b.mass)}` : '',
      };
    });
  }

  const beforeGeoms = layoutPanel(beforeBodies, LEFT_PANEL_X, false);
  const afterGeoms = layoutPanel(afterBodies, RIGHT_PANEL_X, true);
  const allGeoms = [...beforeGeoms, ...afterGeoms];

  const estTextBox = (x: number, y: number, text: string, fontSize: number): DeoverlapObstacle => {
    const w = text.length * fontSize * 0.55;
    const h = fontSize * 1.2;
    return { left: x - w / 2, right: x + w / 2, top: y - h * 0.8, bottom: y + h * 0.2 };
  };

  const bodyLabels: (DeoverlapLabel & { key: string })[] = [];
  for (const g of allGeoms) {
    if (g.vLabel) {
      bodyLabels.push({ key: `${g.key}-v`, x: g.vLabel.x, y: g.vLabel.y, text: g.vLabel.text, fontSize: 11, preferDir: g.vLabel.preferDir });
    }
    if (g.atRestY != null) {
      bodyLabels.push({ key: `${g.key}-rest`, x: g.cx, y: g.atRestY, text: 'at rest', fontSize: 10, preferDir: 'down' });
    }
    if (g.massText) {
      bodyLabels.push({ key: `${g.key}-m`, x: g.cx, y: g.massY, text: g.massText, fontSize: 11, preferDir: 'down' });
    }
  }
  const labelObstacles: DeoverlapObstacle[] = [
    ...allGeoms.map((g): DeoverlapObstacle => ({ left: g.cx - g.r, right: g.cx + g.r, top: g.cy - g.r, bottom: g.cy + g.r })),
    ...allGeoms.flatMap((g): DeoverlapObstacle[] => g.arrow
      ? [{
          left: Math.min(g.arrow.x1, g.arrow.x2) - 4,
          right: Math.max(g.arrow.x1, g.arrow.x2) + 4,
          top: Math.min(g.arrow.y1, g.arrow.y2) - 4,
          bottom: Math.max(g.arrow.y1, g.arrow.y2) + 4,
        }]
      : []),
    // Divider arrow between the panels.
    { left: VIEWBOX_W / 2 - 10, right: VIEWBOX_W / 2 + 10, top: PANEL_Y + PANEL_H / 2 - 4, bottom: PANEL_Y + PANEL_H / 2 + 4 },
    // Panel titles + collision-type badge.
    estTextBox(LEFT_PANEL_X + PANEL_W / 2, PANEL_Y - 8, 'Before', 13),
    estTextBox(RIGHT_PANEL_X + PANEL_W / 2, PANEL_Y - 8, 'After', 13),
    estTextBox(VIEWBOX_W / 2, 30, `${labelForType(type)} · ${dimension}`, 13),
  ];
  if (momentumAnnotation) {
    labelObstacles.push(estTextBox(VIEWBOX_W / 2, PANEL_Y + PANEL_H + 30, momentumAnnotation, 13));
  }
  if (notes) {
    labelObstacles.push(estTextBox(VIEWBOX_W / 2, VIEWBOX_H - 10, notes, 12));
  }
  const resolvedBodyLabels = new Map(
    deoverlapLabels(bodyLabels, { width: VIEWBOX_W, height: VIEWBOX_H }, { obstacles: labelObstacles, baseline: 'alphabetic' })
      .map((l) => [l.key, { x: l.x, y: l.y }]),
  );
  const labelPos = (key: string, fallbackX: number, fallbackY: number) =>
    resolvedBodyLabels.get(key) ?? { x: fallbackX, y: fallbackY };

  function renderPanel(geoms: BodyGeom[]): React.ReactElement {
    return (
      <g>
        {geoms.map((g) => (
          <g key={g.key} {...feat(g.featName, g.featBox, { width: VIEWBOX_W, height: VIEWBOX_H })}>
            <circle cx={g.cx} cy={g.cy} r={g.r} fill={g.color} stroke={darken(g.color)} strokeWidth={2} />
            <text
              x={g.cx}
              y={g.cy + 4}
              fontSize={12}
              fill="white"
              fontWeight={700}
              textAnchor="middle"
            >
              {g.glyph}
            </text>
            {g.arrow && (
              <line
                x1={g.arrow.x1}
                y1={g.arrow.y1}
                x2={g.arrow.x2}
                y2={g.arrow.y2}
                stroke={COLORS.arrow}
                strokeWidth={3}
                markerEnd={`url(#${arrowMarkerId})`}
              />
            )}
            {g.vLabel && (
              <text
                x={labelPos(`${g.key}-v`, g.vLabel.x, g.vLabel.y).x}
                y={labelPos(`${g.key}-v`, g.vLabel.x, g.vLabel.y).y}
                fontSize={11}
                fill={COLORS.arrow}
                textAnchor="middle"
                fontWeight={600}
              >
                {g.vLabel.text}
              </text>
            )}
            {g.atRestY != null && (
              <text
                x={labelPos(`${g.key}-rest`, g.cx, g.atRestY).x}
                y={labelPos(`${g.key}-rest`, g.cx, g.atRestY).y}
                fontSize={10}
                fill={COLORS.muted}
                textAnchor="middle"
                fontStyle="italic"
              >
                at rest
              </text>
            )}
            {/* Mass label below each body */}
            <text
              x={labelPos(`${g.key}-m`, g.cx, g.massY).x}
              y={labelPos(`${g.key}-m`, g.cx, g.massY).y}
              fontSize={11}
              fill={COLORS.muted}
              textAnchor="middle"
            >
              {g.massText}
            </text>
          </g>
        ))}
      </g>
    );
  }

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
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H + warnings.length * 18}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: 400 + warnings.length * 18 }}
      >
        <defs>
          <marker
            id={arrowMarkerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.arrow} />
          </marker>
        </defs>

        {/* Collision-type badge */}
        <text
          x={VIEWBOX_W / 2}
          y={30}
          fontSize={13}
          fill={COLORS.muted}
          textAnchor="middle"
          fontStyle="italic"
        >
          {labelForType(type)} · {dimension}
        </text>

        <Panel x={LEFT_PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} title="Before" />
        <Panel x={RIGHT_PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} title="After" />

        {/* Divider arrow between panels */}
        <g>
          <line
            x1={VIEWBOX_W / 2 - 6}
            y1={PANEL_Y + PANEL_H / 2}
            x2={VIEWBOX_W / 2 + 6}
            y2={PANEL_Y + PANEL_H / 2}
            stroke={COLORS.muted}
            strokeWidth={2}
            markerEnd={`url(#${arrowMarkerId})`}
          />
        </g>

        {renderPanel(beforeGeoms)}
        {renderPanel(afterGeoms)}

        {momentumAnnotation && (
          <text
            x={VIEWBOX_W / 2}
            y={PANEL_Y + PANEL_H + 30}
            fontSize={13}
            fill={COLORS.text}
            textAnchor="middle"
            fontWeight={600}
            {...feat('momentum', { cx: VIEWBOX_W / 2, cy: PANEL_Y + PANEL_H + 30, w: Math.max(240, momentumAnnotation.length * 8 + 20), h: 24 }, { width: VIEWBOX_W, height: VIEWBOX_H })}
          >
            {momentumAnnotation}
          </text>
        )}

        {notes && (
          <text
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H - 10}
            fontSize={12}
            fill={COLORS.muted}
            textAnchor="middle"
          >
            {notes}
          </text>
        )}

        {/* Conservation-law warnings, stacked below all other content */}
        {warnings.map((w, i) => (
          <text
            key={`warn-${i}`}
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H + 8 + i * 18}
            fontSize={12}
            fill="#b91c1c"
            fontWeight={600}
            textAnchor="middle"
          >
            {w}
          </text>
        ))}
      </svg>
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

function formatNum(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 100) return v.toFixed(0);
  if (abs >= 10) return v.toFixed(1);
  return v.toFixed(2).replace(/\.?0+$/, '');
}

function vString(b: CollisionBody, dimension: '1D' | '2D'): string {
  if (dimension === '2D') {
    return `(${formatNum(b.vx ?? 0)}, ${formatNum(b.vy ?? 0)})`;
  }
  return formatNum(b.velocity ?? b.vx ?? 0);
}
