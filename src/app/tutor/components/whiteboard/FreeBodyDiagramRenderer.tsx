'use client';

/**
 * Free Body Diagram Renderer
 *
 * Structured parametric tool for physics mechanics. The model supplies the
 * object shape, the surface type (horizontal / inclined / vertical / none),
 * optional friction, and a list of forces — each with a name, optional
 * magnitude string, and a direction (cardinal/ordinal, slope-relative, or
 * raw angle in degrees). The renderer handles geometry, colors, arrowheads,
 * and label placement so the LLM never has to emit SVG coordinates.
 *
 * Force colors are auto-assigned by name convention (W/Mg → green gravity,
 * N → amber normal, f/friction → purple, T → blue tension, default red
 * for applied forces), but can be overridden per-force.
 */

import React from 'react';
import { feat, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { deoverlapLabels, type DeoverlapLabel, type DeoverlapObstacle } from '@/lib/tutor/whiteboard/label-deoverlap';

export type FbdDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'
  | 'normal'       // perpendicular to surface, outward
  | 'up-slope'     // along incline, uphill
  | 'down-slope'   // along incline, downhill
  | 'into-surface';

export type FbdSurfaceType = 'horizontal' | 'inclined' | 'vertical' | 'none';
export type FbdObjectShape = 'box' | 'circle' | 'person';

export interface FbdForce {
  name: string;
  magnitude?: string;
  /** Either a named direction or an angle in degrees (math convention: CCW from +x, 90 = up). */
  direction: FbdDirection | number;
  color?: string;
  /** Scales the drawn arrow length relative to the default. 1.0 = default. */
  scale?: number;
}

export interface FbdSurface {
  type: FbdSurfaceType;
  /** Degrees above horizontal for inclined surface. Ignored otherwise. */
  angle?: number;
  friction?: boolean;
}

export interface FreeBodyDiagramProps {
  title?: string;
  object: {
    shape?: FbdObjectShape;
    label?: string;
    mass?: string;
  };
  surface?: FbdSurface;
  forces: FbdForce[];
  notes?: string;
}

const VIEWBOX_W = 520;
const VIEWBOX_H = 380;
const FBD_VIEWBOX = { width: VIEWBOX_W, height: VIEWBOX_H };
const DEFAULT_ARROW_LEN = 90;

// Auto-assign colors based on force name conventions.
function colorForForce(name: string, explicit?: string): string {
  if (explicit) return explicit;
  const n = (name || '').toLowerCase().trim();
  if (/^(w|mg|f[_ ]?g|gravity|weight)/.test(n)) return '#16a34a'; // green - gravity
  if (/^n\b|normal/.test(n)) return '#d97706';                    // amber - normal
  if (/^f[_ ]?[skf]\b|friction/.test(n)) return '#9333ea';        // purple - friction
  if (/^t\b|tension/.test(n)) return '#2563eb';                   // blue - tension
  return '#dc2626';                                               // red - applied (default)
}

// Convert named direction to degrees (math convention: CCW from +x, 90 = up).
// Accepts a named direction, a raw number, a numeric string (e.g. "45"), or
// a natural-language phrase like "30 below horizontal" / "45 above horizontal
// toward left". The phrase form exists because the model frequently fumbles
// the sign when translating "below horizontal" into math convention; letting
// it write the side word directly removes the foot-gun.
function dirToAngle(dir: FbdDirection | number | string, surfaceAngle: number): number {
  if (typeof dir === 'number') return dir;
  if (typeof dir === 'string') {
    const trimmed = dir.trim();
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return parseFloat(trimmed);
    const lower = trimmed.toLowerCase();
    // "30 below horizontal", "30° above", "45 below horizontal toward left", etc.
    const nl = lower.match(
      /^(-?\d+(?:\.\d+)?)\s*°?\s*(above|below)\s*(?:the\s+)?(?:horizontal)?\s*(?:(?:toward(?:s)?|to\s+the)\s+(left|right))?\s*$/,
    );
    if (nl) {
      const magnitude = Math.abs(parseFloat(nl[1]));
      const side = nl[2];                      // 'above' | 'below'
      const horizontal = nl[3] || 'right';     // default: pointing right
      // Map quadrant from (side, horizontal):
      //   above + right  →  +mag        (Q1)
      //   above + left   →  180 - mag   (Q2)
      //   below + left   →  mag - 180   (Q3)
      //   below + right  →  -mag        (Q4)
      if (horizontal === 'right') return side === 'below' ? -magnitude : magnitude;
      return side === 'below' ? magnitude - 180 : 180 - magnitude;
    }
    switch (lower as FbdDirection) {
      case 'right': return 0;
      case 'up-right': return 45;
      case 'up': return 90;
      case 'up-left': return 135;
      case 'left': return 180;
      case 'down-left': return -135;
      case 'down': return -90;
      case 'down-right': return -45;
      case 'normal': return 90 + surfaceAngle;        // perpendicular to slope, outward
      case 'up-slope': return surfaceAngle;
      case 'down-slope': return 180 + surfaceAngle;
      case 'into-surface': return -(90 + surfaceAngle);
    }
  }
  return 0;
}

// Row of hatched lines below a surface (ground/incline).
function HatchPattern({
  x1, x2, y, length = 10, spacing = 12, angleDeg = 45,
}: { x1: number; x2: number; y: number; length?: number; spacing?: number; angleDeg?: number }) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = -Math.cos(rad) * length;
  const dy = Math.sin(rad) * length;
  const lines: React.ReactElement[] = [];
  for (let x = x1; x <= x2; x += spacing) {
    lines.push(
      <line key={x} x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="#94a3b8" strokeWidth={1} />,
    );
  }
  return <g>{lines}</g>;
}

// Hatched lines perpendicular to a slope (from top-left to bottom-right).
function SlopeHatching({
  x1, y1, x2, y2, length = 10, spacing = 14,
}: { x1: number; y1: number; x2: number; y2: number; length?: number; spacing?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular INTO the slope (below the hypotenuse, away from the object)
  const perpX = uy;
  const perpY = -ux;
  const lines: React.ReactElement[] = [];
  for (let d = 0; d <= len; d += spacing) {
    const sx = x1 + ux * d;
    const sy = y1 + uy * d;
    lines.push(
      <line
        key={d}
        x1={sx}
        y1={sy}
        x2={sx - perpX * length}
        y2={sy - perpY * length}
        stroke="#94a3b8"
        strokeWidth={1}
      />,
    );
  }
  return <g>{lines}</g>;
}

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Force slugs are derived from each force's name via the same kebab-case
 * transform used inside the renderer.
 */
export function buildFreeBodyDiagramManifest(props: FreeBodyDiagramProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const surface = props.surface ?? { type: 'none' as FbdSurfaceType };

  if (surface.type !== 'none') {
    const surfaceLabels: string[] = ['surface', 'the surface'];
    if (surface.type === 'horizontal') {
      surfaceLabels.push('ground', 'floor', 'bottom', 'baseline', 'horizontal surface');
    } else if (surface.type === 'vertical') {
      surfaceLabels.push('wall', 'the wall', 'vertical surface', 'vertical wall');
    } else if (surface.type === 'inclined') {
      surfaceLabels.push('incline', 'ramp', 'slope', 'inclined plane', 'hypotenuse', 'inclined surface');
    }
    entries.push({
      name: 'surface',
      kind: 'object',
      description:
        surface.type === 'horizontal'
          ? 'horizontal hatched ground surface'
          : surface.type === 'vertical'
            ? 'vertical hatched wall surface'
            : `inclined surface (θ = ${surface.angle ?? 0}°)`,
      labels: surfaceLabels,
    });
    if (surface.type === 'inclined') {
      entries.push({
        name: 'angle',
        kind: 'annotation',
        description: `incline angle arc θ = ${surface.angle ?? 0}° at base-left vertex`,
        labels: ['angle', 'θ', 'theta', 'incline angle', 'ramp angle', 'angle theta', 'the angle'],
      });
    }
  }

  const shape = props.object.shape ?? 'box';
  const objectLabels = ['object', 'the object', 'body', 'the body', shape, `the ${shape}`];
  if (shape === 'box') objectLabels.push('block', 'crate', 'mass');
  else if (shape === 'circle') objectLabels.push('ball', 'sphere', 'disk');
  else if (shape === 'person') objectLabels.push('person', 'figure');
  if (props.object.label) objectLabels.push(props.object.label);
  if (props.object.mass) objectLabels.push('mass', 'm');
  entries.push({
    name: 'object',
    kind: 'object',
    // Mass VALUE included (live round 5, 2026-07-23): the snapshot was the
    // brain's only possible source for "m = 10 kg" and it wasn't there —
    // the brain accepted the student's "20 kg" and wrote a = 45/20.
    description: `${shape} representing the body${props.object.label ? ` (${props.object.label})` : ''}${props.object.mass ? `, mass ${props.object.mass}` : ''}`,
    labels: objectLabels,
  });

  // Given values ride the snapshot verbatim (live round 5): the incline
  // FBD's numbers (60 N, f_k = 10 N, m = 10 kg) lived ONLY in `notes` +
  // symbolic magnitudes, so later turns had no source for them anywhere —
  // the brain hallucinated f_k = 15 N against its own board.
  if (props.notes && String(props.notes).trim()) {
    entries.push({
      name: 'givens',
      kind: 'annotation',
      description: `given values: ${String(props.notes).trim()}`,
      labels: ['givens', 'given values', 'the givens', 'notes', 'the given information'],
    });
  }

  (props.forces ?? []).forEach((f, i) => {
    const slug = (f.name || `force-${i + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `force-${i + 1}`;
    const n = (f.name || '').toLowerCase().trim();
    const forceLabels: string[] = [`force-${slug}`, `force ${slug}`, f.name];
    // Domain synonyms by force type. Each branch ALSO includes the
    // canonical "force-<category>" name the system prompt teaches the
    // tutor (e.g. "force-weight", "force-normal", "force-friction"),
    // even when the actual force was named with a single letter ("W",
    // "N", "f_k"). Without these the tutor's prompt-derived target
    // strings don't resolve and the scribble silently misses (2026-04-24
    // inclined-plane session: "force-normal" rejected because the FBD
    // had only "force-n" registered).
    if (/^(w|mg|f[_ ]?g|gravity|weight)/.test(n)) {
      forceLabels.push(
        'weight', 'gravity', 'Fg', 'W', 'mg',
        'weight force', 'gravity force', 'force of gravity', 'gravitational force',
        'force-weight', 'force-gravity', 'force-mg', 'force-fg', 'force-w',
      );
    } else if (/^n\b|normal/.test(n)) {
      forceLabels.push(
        'normal', 'normal force', 'N', 'Fn', 'the normal', 'reaction force',
        'force-normal', 'force-n', 'force-fn', 'normal-force',
      );
    } else if (/^f[_ ]?[skf]\b|friction/.test(n)) {
      forceLabels.push(
        'friction', 'friction force', 'f', 'Ff', 'fs', 'fk', 'the friction', 'frictional force',
        'kinetic friction', 'static friction',
        'force-friction', 'force-f', 'force-fk', 'force-fs', 'force-ff',
        'friction-force',
      );
    } else if (/^t\b|tension/.test(n)) {
      forceLabels.push(
        'tension', 'tension force', 'T', 'Ft', 'the tension', 'rope tension', 'string tension',
        'force-tension', 'force-t', 'force-ft', 'tension-force',
      );
    } else if (/applied|push|pull|f_?app/.test(n)) {
      forceLabels.push(
        'applied force', 'Fapp', 'applied', 'push', 'pull', 'F',
        'force-applied', 'force-app', 'force-fapp', 'applied-force',
      );
    } else {
      forceLabels.push(n, `${n} force`, `${f.name} force`);
    }
    entries.push({
      name: `force-${slug}`,
      kind: 'other',
      description: `force vector "${f.name}"${f.magnitude ? ` (${f.magnitude})` : ''}`,
      labels: forceLabels.filter(Boolean),
    });
  });

  return entries;
}

export default function FreeBodyDiagramRenderer({
  title,
  object,
  surface = { type: 'none' },
  forces,
  notes,
}: FreeBodyDiagramProps) {
  // Defensive guard for inclined-plane FBDs: when the brain emits BOTH the full
  // weight W (direction "down") AND its decomposed components (W_parallel /
  // W_perp via "down-slope" / "into-surface"), drop the redundant full-weight
  // arrow. Otherwise we draw 5 force vectors, double-count gravity, and the
  // labels collide near the slope's bottom-left vertex (observed 2026-05-07
  // session). Components win — they're the more pedagogically useful form
  // when both are present.
  if (surface?.type === 'inclined' && Array.isArray(forces)) {
    const isWeightComponent = (f: FbdForce): boolean => {
      const n = (f.name || '').toLowerCase();
      const dir = typeof f.direction === 'string' ? f.direction.toLowerCase() : '';
      return (
        (dir === 'down-slope' || dir === 'into-surface') &&
        /^(w|mg|f[_ ]?g|gravity|weight)/.test(n)
      );
    };
    const hasComponents = forces.some(isWeightComponent);
    if (hasComponents) {
      forces = forces.filter((f) => {
        const n = (f.name || '').toLowerCase().trim();
        const dir = typeof f.direction === 'string' ? f.direction.toLowerCase() : '';
        const isFullWeight =
          dir === 'down' && /^(w|mg|f[_ ]?g|gravity|weight)$/.test(n);
        return !isFullWeight;
      });
    }
  }

  const surfaceAngle = surface.angle ?? 0;
  const shape: FbdObjectShape = object.shape ?? 'box';
  const BLOCK_HALF = 28;         // box renders as 56×56, half-side used for lift math
  const BODY_CLEARANCE = BLOCK_HALF + 4; // lift enough that the block SITS on the slope, not in it

  // Object center depends on surface layout.
  let objX = 260;
  let objY = 190;
  let slopeBottomLeft: { x: number; y: number } | null = null;
  let slopeTopRight: { x: number; y: number } | null = null;

  if (surface.type === 'inclined') {
    // Slope rises left→right (conventional physics orientation). The angle θ
    // is at the bottom-left vertex where the hypotenuse meets the base.
    const baseY = 300;
    const baseXStart = 70;
    const baseXEnd = 430;
    const run = baseXEnd - baseXStart;
    const rise = Math.min(run * Math.tan((surfaceAngle * Math.PI) / 180), 200);
    slopeBottomLeft = { x: baseXStart, y: baseY };
    slopeTopRight = { x: baseXEnd, y: baseY - rise };
    // Position object at ~50% along the hypotenuse from bottom-left to top-right.
    const t = 0.5;
    objX = baseXStart + (baseXEnd - baseXStart) * t;
    objY = baseY + ((baseY - rise) - baseY) * t;
    // Lift the object along the outward normal so its bottom edge sits ON
    // the hypotenuse rather than embedded in the slope. Outward normal for a
    // rising-right slope points up-and-left: (−sin θ, −cos θ) in SVG coords.
    const rad = (surfaceAngle * Math.PI) / 180;
    objX += -Math.sin(rad) * BODY_CLEARANCE;
    objY += -Math.cos(rad) * BODY_CLEARANCE;
  } else if (surface.type === 'vertical') {
    objX = 330;
    objY = 180;
  } else if (surface.type === 'horizontal') {
    objX = 260;
    objY = 170;
  }

  const renderObject = (): React.ReactElement => {
    const attrs = feat('object', { cx: objX, cy: objY, w: 72, h: 72 }, FBD_VIEWBOX);
    if (shape === 'circle') {
      return (
        <circle cx={objX} cy={objY} r={28} fill="#93c5fd" stroke="#1e40af" strokeWidth={2} {...attrs} />
      );
    }
    if (shape === 'person') {
      return (
        <g stroke="#1e40af" strokeWidth={2} fill="#93c5fd" strokeLinecap="round" {...attrs}>
          <circle cx={objX} cy={objY - 22} r={10} />
          <line x1={objX} y1={objY - 12} x2={objX} y2={objY + 18} />
          <line x1={objX} y1={objY - 4} x2={objX - 14} y2={objY + 10} />
          <line x1={objX} y1={objY - 4} x2={objX + 14} y2={objY + 10} />
          <line x1={objX} y1={objY + 18} x2={objX - 10} y2={objY + 36} />
          <line x1={objX} y1={objY + 18} x2={objX + 10} y2={objY + 36} />
        </g>
      );
    }
    // Default: box (rotated to match slope if inclined)
    const rotation =
      surface.type === 'inclined' ? `rotate(${-surfaceAngle} ${objX} ${objY})` : '';
    return (
      <rect
        x={objX - 28}
        y={objY - 28}
        width={56}
        height={56}
        fill="#93c5fd"
        stroke="#1e40af"
        strokeWidth={2}
        rx={4}
        transform={rotation || undefined}
        {...attrs}
      />
    );
  };

  const renderSurface = (): React.ReactElement | null => {
    if (surface.type === 'none') return null;
    if (surface.type === 'horizontal') {
      const groundY = objY + 32;
      return (
        <g {...feat('surface', { cx: 260, cy: groundY, w: 420, h: 14 }, FBD_VIEWBOX)}>
          <line x1={50} y1={groundY} x2={470} y2={groundY} stroke="#64748b" strokeWidth={2.5} />
          <HatchPattern x1={50} x2={470} y={groundY} angleDeg={45} />
        </g>
      );
    }
    if (surface.type === 'vertical') {
      const wallX = objX + 44;
      return (
        <g {...feat('surface', { cx: wallX + 6, cy: 190, w: 20, h: 300 }, FBD_VIEWBOX)}>
          <line x1={wallX} y1={40} x2={wallX} y2={340} stroke="#64748b" strokeWidth={2.5} />
          {/* Hatches to the right of the wall, slanting up-right */}
          {Array.from({ length: 24 }).map((_, i) => {
            const y = 40 + i * 12;
            return (
              <line
                key={i}
                x1={wallX}
                y1={y}
                x2={wallX + 10}
                y2={y - 10}
                stroke="#94a3b8"
                strokeWidth={1}
              />
            );
          })}
        </g>
      );
    }
    if (surface.type === 'inclined' && slopeBottomLeft && slopeTopRight) {
      // Slope rises left→right. Triangle vertices:
      //   A = bottom-left (pivot, where angle θ sits)
      //   B = bottom-right
      //   C = top-right
      const { x: ax, y: ay } = slopeBottomLeft;
      const { x: cx, y: cy } = slopeTopRight;
      const bx = cx;
      const by = ay;
      // Angle arc at bottom-left vertex, sweeping from the +x axis up to the
      // hypotenuse direction.
      const arcRadius = 28;
      const arcRad = (surfaceAngle * Math.PI) / 180;
      const arcStartX = ax + arcRadius;
      const arcStartY = ay;
      const arcEndX = ax + arcRadius * Math.cos(arcRad);
      const arcEndY = ay - arcRadius * Math.sin(arcRad);
      return (
        <g {...feat('surface', { cx: (ax + cx) / 2, cy: (ay + cy) / 2, w: cx - ax, h: ay - cy }, FBD_VIEWBOX)}>
          <polygon
            points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <SlopeHatching x1={ax} y1={ay} x2={cx} y2={cy} />
          <path
            d={`M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`}
            fill="none"
            stroke="#475569"
            strokeWidth={1.5}
            {...feat('angle', { cx: ax + arcRadius / 2, cy: ay - arcRadius / 3, w: arcRadius + 28, h: arcRadius + 12 }, FBD_VIEWBOX)}
          />
          <text
            x={ax + arcRadius + 6}
            y={ay - 6}
            fontSize={13}
            fill="#475569"
            fontStyle="italic"
          >
            θ = {surfaceAngle}°
          </text>
          {surface.friction && (
            <text x={bx - 100} y={by + 30} fontSize={12} fill="#9333ea">
              μ (friction)
            </text>
          )}
        </g>
      );
    }
    return null;
  };

  // Assign a unique arrowhead marker per color used (so the stroke doesn't
  // leak through the fill).
  const usedColors = Array.from(new Set(forces.map((f) => colorForForce(f.name, f.color))));

  // Distance from object center to where an arrow should start (the "edge"
  // of the body) so the vector line doesn't visually cut through the object.
  // Box: half-side. Circle: radius. Person: approximated torso radius.
  const bodyRadius =
    shape === 'circle' ? 28
    : shape === 'person' ? 18
    : BLOCK_HALF;

  // Detect forces that share an angle (within 5°) so we can offset their
  // labels perpendicular to the arrow, preventing overlap.
  const angles = forces.map((f) => dirToAngle(f.direction, surfaceAngle));
  const angleClusters = angles.map((a, i) => {
    let cluster = 0;
    for (let j = 0; j < i; j++) {
      if (Math.abs(((angles[j] - a + 540) % 360) - 180) < 5) cluster++;
    }
    return cluster;
  });

  const objectCaption = object.mass || object.label;
  // Estimated half-width of a 13px label (same char heuristic as
  // label-deoverlap). Used for arrow clearance + viewbox clamping.
  const estHalfW = (s: string): number => (s.length * 13 * 0.55) / 2;

  // ── Per-force geometry + label layout (2026-07-17 live session) ──────
  // Labels used to sit inline just past the arrow tip. For horizontal-ish
  // arrows that put a center-anchored label ON the arrow axis — it ran
  // back across its own shaft, crowded the object caption, and an 8-char
  // name cap mangled real names ("Wall pushes back" → "Wall pu…"). Now:
  // horizontal-ish labels sit ABOVE their shaft midpoint, arrows start
  // clear of the caption, names keep up to 20 chars, and one
  // deoverlapLabels pass (object + shafts + θ/μ as obstacles) resolves
  // whatever residual crowding the initial spots still have.
  const forceGeoms = forces.map((f, i) => {
    const angle = angles[i];
    const rad = (angle * Math.PI) / 180;
    // "into-surface" on a slope draws the arrow toward the hypotenuse. With
    // the default 90px length the tip overshoots the slope graphic and the
    // label crashes into the θ angle annotation at the base-left vertex
    // (observed 2026-05-07 inclined-plane FBDs). Shorten so the arrow
    // stays in the air-gap between the box and the slope surface.
    const dirToken = typeof f.direction === 'string' ? f.direction.toLowerCase() : '';
    const isIntoIncline = surface.type === 'inclined' && dirToken === 'into-surface';
    const baseLen = isIntoIncline ? 50 : DEFAULT_ARROW_LEN;
    const len = baseLen * (f.scale ?? 1);
    const dirX = Math.cos(rad);
    const dirY = -Math.sin(rad); // SVG y is flipped
    const horizontalish = Math.abs(dirY) < 0.35;
    // Start the arrow at the body edge, not the center — and for
    // horizontal-ish arrows, past the object caption too (a wide caption
    // like "m = 5 kg" sticks out beyond the body glyph).
    const startRadius = horizontalish && objectCaption
      ? Math.max(bodyRadius, estHalfW(objectCaption) + 8)
      : bodyRadius;
    const startX = objX + dirX * startRadius;
    const startY = objY + dirY * startRadius;
    // When two forces share a direction, separate their arrows so both are
    // visible rather than one on top of the other.
    const cluster = angleClusters[i];
    const clusterLen = len - cluster * 18;
    const tipX = startX + dirX * Math.max(clusterLen, 30);
    const tipY = startY + dirY * Math.max(clusterLen, 30);
    const color = colorForForce(f.name, f.color);
    // Defensive label hygiene. The model sometimes sends (a) LaTeX commands
    // in magnitude, which don't render in plain SVG text, (b) long descriptive
    // phrases in name, which overflow and collide with other labels, and (c)
    // redundant "X = X" where magnitude echoes the name. Sanitize all three.
    const stripLatex = (s: string): string => s
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2') // \frac{a}{b} → a/b
      .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')             // \sqrt{x} → √(x)
      .replace(/\\text\{([^{}]+)\}/g, '$1')                // \text{x} → x
      .replace(/\\(theta|pi|alpha|beta|mu|Delta|omega|phi|rho|sigma|gamma)\b/g, (_, n) => {
        const map: Record<string, string> = {
          theta: 'θ', pi: 'π', alpha: 'α', beta: 'β', mu: 'μ',
          Delta: 'Δ', omega: 'ω', phi: 'φ', rho: 'ρ', sigma: 'σ', gamma: 'γ',
        };
        return map[n] || n;
      })
      .replace(/\\[a-zA-Z]+/g, '')   // strip any remaining LaTeX commands
      .replace(/[{}]/g, '')
      .trim();
    const truncate = (s: string, max: number): string =>
      s.length > max ? `${s.slice(0, max - 1)}…` : s;
    // 20 chars fits every real force phrase seen live ("Wall pushes back");
    // the cap only guards against essay-length names now.
    const nameN = truncate(stripLatex((f.name || '').trim()), 20);
    const magN = truncate(stripLatex((f.magnitude || '').trim()), 14);
    const label = magN && magN !== nameN ? `${nameN} = ${magN}` : nameN;
    // Initial label spot: above the shaft midpoint for horizontal-ish
    // arrows (never on the axis), just past the tip otherwise.
    const perpStep = 14 * cluster; // extra separation for same-direction forces
    let labelX: number;
    let labelY: number;
    if (horizontalish) {
      labelX = (startX + tipX) / 2;
      labelY = (startY + tipY) / 2 - 16 - perpStep;
    } else {
      const labelOffset = 16;
      labelX = tipX + dirX * labelOffset + -dirY * perpStep;
      labelY = tipY + dirY * labelOffset + dirX * perpStep;
    }
    // Keep the whole estimated label inside the viewbox.
    labelX = Math.min(Math.max(labelX, estHalfW(label) + 4), VIEWBOX_W - estHalfW(label) - 4);
    // Expose the force as a targetable feature. Slug uses the original
    // force name (not the truncated/sanitized display) so the tutor can
    // predict it: "force-weight", "force-normal", "force-friction", etc.
    const slug = (f.name || `force-${i + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `force-${i + 1}`;
    return { f, i, startX, startY, tipX, tipY, color, label, labelX, labelY, dirY, slug };
  });

  // Fixed geometry the labels must stay clear of.
  const labelObstacles: DeoverlapObstacle[] = [
    // Object glyph + caption block.
    { left: objX - 38, right: objX + 38, top: objY - 38, bottom: objY + 40 },
    // Every arrow shaft (padded).
    ...forceGeoms.map((g): DeoverlapObstacle => ({
      left: Math.min(g.startX, g.tipX) - 5,
      right: Math.max(g.startX, g.tipX) + 5,
      top: Math.min(g.startY, g.tipY) - 5,
      bottom: Math.max(g.startY, g.tipY) + 5,
    })),
  ];
  if (surface.type === 'inclined' && slopeBottomLeft) {
    // θ annotation zone at the base-left vertex.
    labelObstacles.push({
      left: slopeBottomLeft.x, right: slopeBottomLeft.x + 90,
      top: slopeBottomLeft.y - 30, bottom: slopeBottomLeft.y + 4,
    });
  }
  const resolvedForceLabels = deoverlapLabels(
    forceGeoms.map((g): DeoverlapLabel & { slug: string } => ({
      x: g.labelX, y: g.labelY, text: g.label, fontSize: 13,
      preferDir: g.dirY > 0.35 ? 'down' : 'up', slug: g.slug,
    })),
    FBD_VIEWBOX,
    { obstacles: labelObstacles, baseline: 'middle' },
  );

  const renderForces = (): React.ReactElement[] =>
    forceGeoms.map((g, idx) => {
      const { f, i, startX, startY, tipX, tipY, color, label, slug } = g;
      const placed = resolvedForceLabels[idx];
      const forceBBox = {
        cx: (startX + tipX) / 2,
        cy: (startY + tipY) / 2,
        w: Math.max(24, Math.abs(tipX - startX) + 40),
        h: Math.max(24, Math.abs(tipY - startY) + 40),
      };
      return (
        <g key={`${f.name}-${i}`} {...feat(`force-${slug}`, forceBBox, FBD_VIEWBOX)}>
          <line
            x1={startX}
            y1={startY}
            x2={tipX}
            y2={tipY}
            stroke={color}
            strokeWidth={3}
            markerEnd={`url(#fbd-arrow-${color.replace('#', '')})`}
          />
          <text
            x={placed.x}
            y={placed.y}
            fontSize={13}
            fill={color}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </g>
      );
    });

  return (
    <div style={{ padding: 12, background: 'white', borderRadius: 6 }}>
      {title && (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 8,
            color: '#0f172a',
          }}
        >
          {title}
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: 400 }}
      >
        <defs>
          {usedColors.map((c) => (
            <marker
              key={c}
              id={`fbd-arrow-${c.replace('#', '')}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {renderSurface()}
        {renderObject()}
        {/* Object label inside the object */}
        {objectCaption && (
          <text
            x={objX}
            y={objY + 4}
            fontSize={13}
            fill="#0f172a"
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {objectCaption}
          </text>
        )}
        {renderForces()}
        {notes && wrapText(notes, 80).map((line, i, lines) => (
          <text
            key={`note-${i}`}
            x={VIEWBOX_W / 2}
            y={VIEWBOX_H - 12 - (lines.length - 1 - i) * 14}
            fontSize={12}
            fill="#64748b"
            textAnchor="middle"
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Best-effort word-wrap for SVG text (no native wrapping in SVG <text>).
// Caps lines at ~charsPerLine characters, preserving whole words when possible.
function wrapText(text: string, charsPerLine: number): string[] {
  if (!text) return [];
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > charsPerLine && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  // Hard-cap to 3 lines to avoid eating into the diagram.
  if (lines.length > 3) {
    const kept = lines.slice(0, 3);
    kept[2] = kept[2].replace(/.{0,3}$/, '…');
    return kept;
  }
  return lines;
}
