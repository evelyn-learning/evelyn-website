/**
 * Student whiteboard marks — Phase 1 (tap-to-point) pure logic.
 *
 * The WhiteboardCanvas tap layer captures a normalized point plus the
 * bounding rects of every [data-feature] element and item wrapper on the
 * page; this module resolves the point to the most specific target
 * (smallest containing feature → nearest feature within a threshold →
 * containing item → page-only) and formats resolved marks into the
 * <student_marks> block the brain receives. Pure — rects in, words out —
 * so it unit-tests without DOM.
 *
 * Wording stays GENERIC (no topic interpolation beyond catalog labels):
 * feedback_generic_prompts.
 *
 * Design: docs/superpowers/specs/2026-07-05-student-whiteboard-marks-design.md
 */

export interface CapturedRect {
  x: number;
  y: number;
  w: number;
  h: number;
  itemIndex: number;
  itemId?: string;
  /** data-feature name; undefined = the item wrapper itself. */
  feature?: string;
}

export interface StudentMarkEvent {
  type: 'point';
  pageIndex: number;
  pageTitle?: string;
  point: { x: number; y: number };
  rects: CapturedRect[];
}

export interface ResolvedMark {
  kind: 'point';
  pageIndex: number;
  pageTitle?: string;
  itemIndex?: number;
  itemId?: string;
  feature?: string;
  point: { x: number; y: number };
}

/** Pending-buffer cap; oldest marks drop beyond this (with a debug event). */
export const MAX_PENDING_MARKS = 12;

/** Snap distance (normalized page units) for near-miss taps. */
const NEAR_THRESHOLD = 0.03;

function contains(r: CapturedRect, p: { x: number; y: number }): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

function edgeDistance(r: CapturedRect, p: { x: number; y: number }): number {
  const dx = Math.max(r.x - p.x, 0, p.x - (r.x + r.w));
  const dy = Math.max(r.y - p.y, 0, p.y - (r.y + r.h));
  return Math.hypot(dx, dy);
}

function area(r: CapturedRect): number {
  return r.w * r.h;
}

export function resolvePointMark(ev: StudentMarkEvent): ResolvedMark {
  const base: ResolvedMark = {
    kind: 'point',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: ev.point,
  };
  const features = ev.rects.filter((r) => r.feature);
  const items = ev.rects.filter((r) => !r.feature);

  // 1. Smallest feature rect containing the point.
  const containing = features.filter((r) => contains(r, ev.point));
  if (containing.length > 0) {
    const best = containing.reduce((a, b) => (area(b) < area(a) ? b : a));
    return { ...base, itemIndex: best.itemIndex, itemId: best.itemId, feature: best.feature };
  }
  // 2. Nearest feature within the snap threshold.
  let nearest: CapturedRect | null = null;
  let nearestDist = Infinity;
  for (const r of features) {
    const d = edgeDistance(r, ev.point);
    if (d < nearestDist) { nearest = r; nearestDist = d; }
  }
  if (nearest && nearestDist <= NEAR_THRESHOLD) {
    return { ...base, itemIndex: nearest.itemIndex, itemId: nearest.itemId, feature: nearest.feature };
  }
  // 3. Containing item wrapper (whole-item).
  const item = items.filter((r) => contains(r, ev.point))
    .reduce<CapturedRect | null>((a, b) => (a === null || area(b) < area(a) ? b : a), null);
  if (item) {
    return { ...base, itemIndex: item.itemIndex, itemId: item.itemId };
  }
  // 4. Page-only.
  return base;
}

export interface MarkLabels {
  featureLabel?: string;
  itemLabel?: string;
}

function sameTarget(a: ResolvedMark, b: ResolvedMark): boolean {
  return a.itemIndex === b.itemIndex && a.feature === b.feature && a.pageIndex === b.pageIndex;
}

/**
 * Render resolved marks as the <student_marks> body. `lookup` supplies
 * catalog-backed human labels; returning null (stale/unknown item)
 * degrades gracefully. Consecutive identical targets collapse (double-tap).
 */
export function formatStudentMarks(
  marks: ResolvedMark[],
  lookup: (mark: ResolvedMark) => MarkLabels | null,
): string {
  const lines: string[] = [];
  let prev: ResolvedMark | null = null;
  for (const mark of marks) {
    if (prev && sameTarget(prev, mark)) continue;
    prev = mark;
    const page = `page ${mark.pageIndex + 1}${mark.pageTitle ? `, "${mark.pageTitle}"` : ''}`;
    if (mark.itemIndex === undefined) {
      lines.push(`The student pointed at empty space on ${page}.`);
      continue;
    }
    const labels = lookup(mark);
    if (!labels || (!labels.featureLabel && !labels.itemLabel)) {
      lines.push(`The student pointed at something on ${page}.`);
      continue;
    }
    if (mark.feature && labels.featureLabel) {
      const of = labels.itemLabel ? ` of ${labels.itemLabel}` : '';
      lines.push(`The student pointed at ${labels.featureLabel}${of} (${page}).`);
    } else {
      lines.push(`The student pointed at ${labels.itemLabel ?? 'something'} (${page}).`);
    }
  }
  return lines.join('\n');
}
