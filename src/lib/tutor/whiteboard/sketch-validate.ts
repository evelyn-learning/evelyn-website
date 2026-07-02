/**
 * Structural quality gate for doodler output (the in-loop half of the Q9
 * quality decision; the other half is the offline e2e judge).
 *
 * validateSketch takes the raw parsed tool output from the doodler and returns
 * a clean SketchPrimitive[] or null. Philosophy = "a wrong sketch is worse than
 * none": sanitize each primitive (clamp coords, default bad colors, cap text),
 * DROP individually-broken ones, but return null (→ render nothing) when the
 * result is incoherent — too few survivors, or so many dropped that the doodler
 * was clearly confused. No semantic/vision check here (kept off the hot path).
 *
 * Pure + dependency-free so it runs both server-side (the route) and in tests.
 */
import {
  SKETCH_BOUNDS,
  SKETCH_COLOR_NAMES,
  SKETCH_PRIMITIVE_TYPES,
  type Pt,
  type SketchColor,
  type SketchPrimitive,
} from './sketch-schema';

const {
  minCoord, maxCoord, maxStrokeWidth, maxLabels, maxLabelLen, maxPolyPoints, minPolyPoints,
  minConcentricCount, maxConcentricCount,
} = SKETCH_BOUNDS;

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}
function clampCoord(v: number): number {
  return Math.min(maxCoord, Math.max(minCoord, v));
}
function coord(v: unknown): number | null {
  const n = num(v);
  return n === null ? null : clampCoord(n);
}
function color(v: unknown, fallback?: SketchColor): SketchColor | undefined {
  return typeof v === 'string' && (SKETCH_COLOR_NAMES as string[]).includes(v)
    ? (v as SketchColor)
    : fallback;
}
function strokeWidth(v: unknown): number | undefined {
  const n = num(v);
  if (n === null) return undefined;
  return Math.min(maxStrokeWidth, Math.max(0.5, n));
}
function points(v: unknown): Pt[] | null {
  if (!Array.isArray(v)) return null;
  const out: Pt[] = [];
  for (const p of v) {
    const x = coord((p as Pt)?.x);
    const y = coord((p as Pt)?.y);
    if (x === null || y === null) continue;
    out.push({ x, y });
    if (out.length >= maxPolyPoints) break;
  }
  return out.length >= minPolyPoints ? out : null;
}

/** Sanitize one primitive → clean primitive, or null to drop it. */
function sanitize(raw: unknown): SketchPrimitive | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  const type = p.type;
  if (typeof type !== 'string' || !(SKETCH_PRIMITIVE_TYPES as string[]).includes(type)) return null;

  const stroke = color(p.stroke);
  const fill = color(p.fill);
  const sw = strokeWidth(p.strokeWidth);
  const styled = {
    ...(stroke ? { stroke } : {}),
    ...(fill ? { fill } : {}),
    ...(sw !== undefined ? { strokeWidth: sw } : {}),
  };

  switch (type) {
    case 'line':
    case 'arrow': {
      const x1 = coord(p.x1), y1 = coord(p.y1), x2 = coord(p.x2), y2 = coord(p.y2);
      if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
      if (x1 === x2 && y1 === y2) return null; // zero-length
      return { type, x1, y1, x2, y2, ...styled };
    }
    case 'curve': {
      const pts = points(p.points);
      if (!pts) return null;
      return { type, points: pts, ...(p.closed === true ? { closed: true } : {}), ...styled };
    }
    case 'polygon': {
      const pts = points(p.points);
      if (!pts || pts.length < 3) return null; // a polygon needs ≥3 vertices
      return { type, points: pts, ...styled };
    }
    case 'ellipse': {
      const cx = coord(p.cx), cy = coord(p.cy), rx = num(p.rx), ry = num(p.ry);
      if (cx === null || cy === null || rx === null || ry === null) return null;
      if (rx <= 0 || ry <= 0) return null;
      return { type, cx, cy, rx: Math.min(maxCoord, rx), ry: Math.min(maxCoord, ry), ...styled };
    }
    case 'concentric': {
      const cx = coord(p.cx), cy = coord(p.cy);
      const spacing = num(p.spacing);
      let count = num(p.count);
      if (cx === null || cy === null || spacing === null || count === null) return null;
      if (spacing <= 0) return null;
      count = Math.round(Math.min(maxConcentricCount, Math.max(minConcentricCount, count)));
      const sq = num(p.squeeze);
      const ang = num(p.angle);
      return {
        type,
        cx, cy, count,
        spacing: Math.min(maxCoord, spacing),
        ...(sq !== null ? { squeeze: Math.min(0.9, Math.max(0, sq)) } : {}),
        ...(ang !== null ? { angle: ang } : {}),
        ...styled,
      };
    }
    case 'rect': {
      const x = coord(p.x), y = coord(p.y), w = num(p.w), h = num(p.h);
      if (x === null || y === null || w === null || h === null) return null;
      if (w <= 0 || h <= 0) return null;
      return {
        type,
        x, y,
        w: Math.min(maxCoord, w),
        h: Math.min(maxCoord, h),
        ...(p.rounded === true ? { rounded: true } : {}),
        ...styled,
      };
    }
    case 'label': {
      const x = coord(p.x), y = coord(p.y);
      const text = typeof p.text === 'string' ? p.text.trim().slice(0, maxLabelLen) : '';
      if (x === null || y === null || !text) return null;
      const fontSize = num(p.fontSize);
      const anchor =
        p.anchor === 'start' || p.anchor === 'middle' || p.anchor === 'end' ? p.anchor : undefined;
      return {
        type,
        x, y, text,
        ...(fontSize !== null ? { fontSize: Math.min(12, Math.max(2.5, fontSize)) } : {}),
        ...(anchor ? { anchor } : {}),
        ...(stroke ? { stroke } : {}),
      };
    }
    default:
      return null;
  }
}

/**
 * Validate raw doodler output. Returns clean primitives, or null to render
 * nothing (fail-to-nothing).
 */
export function validateSketch(input: unknown): SketchPrimitive[] | null {
  const arr =
    Array.isArray(input)
      ? input
      : Array.isArray((input as { primitives?: unknown })?.primitives)
        ? (input as { primitives: unknown[] }).primitives
        : null;
  if (!arr || arr.length === 0) return null;

  const cleaned: SketchPrimitive[] = [];
  let labelCount = 0;
  let dropped = 0;
  for (const raw of arr) {
    const s = sanitize(raw);
    if (!s) { dropped++; continue; }
    if (s.type === 'label') {
      if (labelCount >= maxLabels) { dropped++; continue; }
      labelCount++;
    }
    cleaned.push(s);
    if (cleaned.length >= SKETCH_BOUNDS.maxPrimitives) break;
  }

  if (cleaned.length < SKETCH_BOUNDS.minPrimitives) return null;
  // Confusion guard: if the doodler emitted mostly garbage, drop the whole thing.
  if (dropped > cleaned.length) return null;
  // A doodle that is ONLY labels (no actual drawing) isn't a sketch — drop it.
  if (cleaned.every((c) => c.type === 'label')) return null;

  return cleaned;
}
