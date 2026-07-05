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
  /** Visible text of the rect when it's a first-class labelled target
   *  (e.g. an AnnotationStrip teacher-note line) — carried straight
   *  through to ResolvedMark.targetLabel so formatting can quote it
   *  verbatim instead of doing a catalog lookup. */
  label?: string;
}

export interface PointMarkEvent {
  type: 'point';
  pageIndex: number;
  pageTitle?: string;
  point: { x: number; y: number };
  rects: CapturedRect[];
}

export interface StrokeMarkEvent {
  type: 'stroke';
  pageIndex: number;
  pageTitle?: string;
  /** Normalized page coords, ≥2 points, capture order. */
  polyline: { x: number; y: number }[];
  rects: CapturedRect[];
}

export interface GestureMarkEvent {
  type: 'gesture';
  pageIndex: number;
  pageTitle?: string;
  strokes: { x: number; y: number }[][];
  rects: CapturedRect[];
}

export type StudentMarkEvent = PointMarkEvent | StrokeMarkEvent | GestureMarkEvent;

export interface BBoxLike {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ResolvedMark {
  kind: 'point' | 'circle' | 'underline' | 'cross-out' | 'arrow' | 'ink' | 'tick' | 'writing';
  pageIndex: number;
  pageTitle?: string;
  itemIndex?: number;
  itemId?: string;
  feature?: string;
  point: { x: number; y: number };
  fromItemIndex?: number;
  fromItemId?: string;
  fromFeature?: string;
  text?: string;
  strokesBBox?: BBoxLike;
  /** Set when the resolved target carried its own visible label (e.g. a
   *  teacher-note strip entry) — formatStudentMarks quotes this directly
   *  rather than looking it up in the catalog. */
  targetLabel?: string;
  /** Coarse thirds-grid position (e.g. "lower left") of the mark's point
   *  within its resolved target's rect — set only for WHOLE-ITEM and
   *  page-only resolutions, where no feature rect narrows the target
   *  further. A sketch/graph exposes no addressable features, so this is
   *  the only spatial signal the brain gets for those marks. */
  positionHint?: string;
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

/** Coarse thirds-grid position of a point within a rect: "upper left",
 *  "center", "lower right", etc. For whole-item and page-only marks —
 *  a sketch/graph exposes no features, so this is the only spatial
 *  signal the brain gets. */
export function positionHintFor(p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }): string {
  const fx = r.w > 0 ? (p.x - r.x) / r.w : 0.5;
  const fy = r.h > 0 ? (p.y - r.y) / r.h : 0.5;
  const col = fx < 1 / 3 ? 'left' : fx > 2 / 3 ? 'right' : '';
  const row = fy < 1 / 3 ? 'upper' : fy > 2 / 3 ? 'lower' : '';
  if (!row && !col) return 'center';
  if (!row) return `center ${col}`;
  if (!col) return `${row} middle`;
  return `${row} ${col}`;
}

// ── Phase 2: stroke classification ──────────────────────────────────
// Heuristic order: circle (closed loop) → cross-out (zigzag over a
// feature) → underline (flat stroke at a feature's baseline) → arrow
// (directional line with distinct ends) → ink (anything else). All
// thresholds are in normalized page units and deliberately forgiving —
// a misclassified shape still names the right TARGET, which is what the
// brain mostly needs.

interface BBox { x: number; y: number; w: number; h: number; }

function polyBBox(pts: { x: number; y: number }[]): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Direction reversals along the dominant axis — a zigzag scribble has many. */
function reversals(pts: { x: number; y: number }[], bb: BBox): number {
  const horizontal = bb.w >= bb.h;
  let count = 0;
  let lastSign = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = horizontal ? pts[i].x - pts[i - 1].x : pts[i].y - pts[i - 1].y;
    const sign = d > 0.004 ? 1 : d < -0.004 ? -1 : 0;
    if (sign !== 0 && lastSign !== 0 && sign !== lastSign) count++;
    if (sign !== 0) lastSign = sign;
  }
  return count;
}

function rectCenterIn(r: CapturedRect, bb: BBox): boolean {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return cx >= bb.x && cx <= bb.x + bb.w && cy >= bb.y && cy <= bb.y + bb.h;
}

/** Smallest feature whose center falls inside the bbox; else smallest
 *  containing item; else nothing. */
function targetForRegion(bb: BBox, rects: CapturedRect[]): CapturedRect | null {
  const feats = rects.filter((r) => r.feature && rectCenterIn(r, bb));
  if (feats.length > 0) return feats.reduce((a, b) => (area(b) < area(a) ? b : a));
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const items = rects.filter((r) => !r.feature && contains(r, center));
  if (items.length > 0) return items.reduce((a, b) => (area(b) < area(a) ? b : a));
  return null;
}

function targetAtPoint(p: { x: number; y: number }, rects: CapturedRect[]): CapturedRect | null {
  const feats = rects.filter((r) => r.feature && contains(r, p));
  if (feats.length > 0) return feats.reduce((a, b) => (area(b) < area(a) ? b : a));
  const items = rects.filter((r) => !r.feature && contains(r, p));
  if (items.length > 0) return items.reduce((a, b) => (area(b) < area(a) ? b : a));
  return null;
}

/** The page unit square, for hinting page-only marks (no rect at all). */
const PAGE_UNIT: BBoxLike = { x: 0, y: 0, w: 1, h: 1 };

/** positionHint for a mark that resolved to a whole item (t truthy, no
 *  feature) or page-only (t null). Returns undefined when t has a feature
 *  — a feature match is already specific enough, no hint needed. */
function wholeItemOrPageHint(point: { x: number; y: number }, t: CapturedRect | null): string | undefined {
  if (t) return t.feature ? undefined : positionHintFor(point, t);
  return positionHintFor(point, PAGE_UNIT);
}

export function classifyStroke(ev: StrokeMarkEvent): ResolvedMark {
  const pts = ev.polyline;
  const bb = polyBBox(pts);
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const base: ResolvedMark = {
    kind: 'ink',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: center,
  };
  if (pts.length < 2) return base;
  const diag = Math.hypot(bb.w, bb.h);
  const withTarget = (kind: ResolvedMark['kind'], t: CapturedRect | null): ResolvedMark => {
    const positionHint = wholeItemOrPageHint(base.point, t);
    return t
      ? { ...base, kind, itemIndex: t.itemIndex, itemId: t.itemId, feature: t.feature, targetLabel: t.label, ...(positionHint ? { positionHint } : {}) }
      : { ...base, kind, ...(positionHint ? { positionHint } : {}) };
  };

  // 1. Circle: endpoints close relative to size, with real extent.
  const closed = diag > 0.03 && dist(pts[0], pts[pts.length - 1]) <= Math.max(0.03, diag * 0.25);
  if (closed) return withTarget('circle', targetForRegion(bb, ev.rects));

  // 2. Cross-out: many reversals scribbled over a feature.
  const rev = reversals(pts, bb);
  if (rev >= 3) {
    const t = targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects);
    if (t && t.feature) return withTarget('cross-out', t);
  }

  // 3. Underline: flat, wide stroke sitting at a feature's baseline —
  //    horizontally overlapping it and vertically at/just below its bottom.
  if (bb.h <= 0.03 && bb.w >= bb.h * 3) {
    let best: CapturedRect | null = null;
    let bestArea = Infinity;
    for (const r of ev.rects) {
      if (!r.feature) continue;
      const overlapX = Math.min(bb.x + bb.w, r.x + r.w) - Math.max(bb.x, r.x);
      if (overlapX < bb.w * 0.5) continue;
      const dy = center.y - (r.y + r.h);
      const inBottomBand = center.y >= r.y + r.h * 0.6 && center.y <= r.y + r.h;
      if ((dy >= -0.005 && dy <= 0.04) || inBottomBand) {
        if (area(r) < bestArea) { best = r; bestArea = area(r); }
      }
    }
    if (best) return withTarget('underline', best);
  }

  // 4. Arrow: direct stroke whose two ends land on different targets.
  if (rev <= 1 && diag >= 0.06) {
    const from = targetAtPoint(pts[0], ev.rects);
    const to = targetAtPoint(pts[pts.length - 1], ev.rects);
    if (from && to && (from.itemIndex !== to.itemIndex || from.feature !== to.feature)) {
      return {
        ...base,
        kind: 'arrow',
        itemIndex: to.itemIndex,
        itemId: to.itemId,
        feature: to.feature,
        targetLabel: to.label,
        fromItemIndex: from.itemIndex,
        fromItemId: from.itemId,
        fromFeature: from.feature,
      };
    }
  }

  // 5. Ink: keep the best available target for wording.
  return withTarget('ink', targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects));
}

/** Angle at the junction of two strokes sharing an endpoint region —
 *  a tick is a short down-stroke meeting a longer up-stroke in a V. */
function isTick(a: { x: number; y: number }[], b: { x: number; y: number }[]): boolean {
  const join = dist(a[a.length - 1], b[0]) <= 0.03 || dist(a[a.length - 1], b[b.length - 1]) <= 0.03;
  if (!join) return false;
  const dirA = { x: a[a.length - 1].x - a[0].x, y: a[a.length - 1].y - a[0].y };
  const dirB = { x: b[b.length - 1].x - b[0].x, y: b[b.length - 1].y - b[0].y };
  // A tick's first leg heads DOWN (+y), second leg heads UP (−y).
  return dirA.y > 0.01 && dirB.y < -0.01;
}

function segIntersect(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }, p4: { x: number; y: number }): boolean {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function strokesCross(a: { x: number; y: number }[], b: { x: number; y: number }[]): boolean {
  return segIntersect(a[0], a[a.length - 1], b[0], b[b.length - 1]);
}

function combinedBBox(strokes: { x: number; y: number }[][]): BBox {
  return polyBBox(strokes.flat());
}

export function classifyGesture(ev: GestureMarkEvent): ResolvedMark {
  const { strokes } = ev;
  if (strokes.length === 1) {
    return classifyStroke({ type: 'stroke', pageIndex: ev.pageIndex, pageTitle: ev.pageTitle, polyline: strokes[0], rects: ev.rects });
  }
  const bb = combinedBBox(strokes);
  const center = { x: bb.x + bb.w / 2, y: bb.y + bb.h / 2 };
  const target = targetForRegion(bb, ev.rects) ?? targetAtPoint(center, ev.rects);
  const positionHint = wholeItemOrPageHint(center, target);
  const base: ResolvedMark = {
    kind: 'writing',
    pageIndex: ev.pageIndex,
    pageTitle: ev.pageTitle,
    point: center,
    strokesBBox: bb,
    ...(target ? { itemIndex: target.itemIndex, itemId: target.itemId, feature: target.feature, targetLabel: target.label } : {}),
    ...(positionHint ? { positionHint } : {}),
  };
  if (strokes.length === 2) {
    const [a, b] = strokes;
    if (target?.feature && (isTick(a, b) || isTick(b, a))) return { ...base, kind: 'tick' };
    if (target?.feature && strokesCross(a, b)) return { ...base, kind: 'cross-out' };
  }
  return base; // ≥3 strokes, or unresolvable 2-stroke → writing (OCR upstream)
}

export function resolveStudentMark(ev: StudentMarkEvent): ResolvedMark {
  if (ev.type === 'point') return resolvePointMark(ev);
  if (ev.type === 'stroke') return classifyStroke(ev);
  return classifyGesture(ev);
}

export function resolvePointMark(ev: PointMarkEvent): ResolvedMark {
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
    return { ...base, itemIndex: best.itemIndex, itemId: best.itemId, feature: best.feature, targetLabel: best.label };
  }
  // 2. Nearest feature within the snap threshold.
  let nearest: CapturedRect | null = null;
  let nearestDist = Infinity;
  for (const r of features) {
    const d = edgeDistance(r, ev.point);
    if (d < nearestDist) { nearest = r; nearestDist = d; }
  }
  if (nearest && nearestDist <= NEAR_THRESHOLD) {
    return { ...base, itemIndex: nearest.itemIndex, itemId: nearest.itemId, feature: nearest.feature, targetLabel: nearest.label };
  }
  // 3. Containing item wrapper (whole-item).
  const item = items.filter((r) => contains(r, ev.point))
    .reduce<CapturedRect | null>((a, b) => (a === null || area(b) < area(a) ? b : a), null);
  if (item) {
    return { ...base, itemIndex: item.itemIndex, itemId: item.itemId, targetLabel: item.label, positionHint: wholeItemOrPageHint(ev.point, item) };
  }
  // 4. Page-only.
  return { ...base, positionHint: wholeItemOrPageHint(ev.point, null) };
}

export interface MarkLabels {
  featureLabel?: string;
  itemLabel?: string;
}

function sameTarget(a: ResolvedMark, b: ResolvedMark): boolean {
  if (a.kind === 'writing' || b.kind === 'writing') return false;
  return a.kind === b.kind && a.itemIndex === b.itemIndex && a.feature === b.feature && a.pageIndex === b.pageIndex;
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
  const VERBS: Record<ResolvedMark['kind'], string> = {
    point: 'pointed at',
    circle: 'circled',
    underline: 'underlined',
    'cross-out': 'crossed out',
    arrow: 'drew an arrow to',
    ink: 'drew near',
    tick: 'put a tick on',
    writing: 'wrote on',
  };

  // Shared with the arrow branch below: resolve the human-readable text for
  // an arrow's FROM endpoint via a point-shaped lookup on the from-fields.
  const arrowFromText = (mark: ResolvedMark): string => {
    const fromLabels = lookup({ ...mark, kind: 'point', itemIndex: mark.fromItemIndex, itemId: mark.fromItemId, feature: mark.fromFeature });
    return fromLabels
      ? (mark.fromFeature && fromLabels.featureLabel
          ? `${fromLabels.featureLabel}${fromLabels.itemLabel ? ` of ${fromLabels.itemLabel}` : ''}`
          : (fromLabels.itemLabel ?? 'something'))
      : 'something';
  };

  const lines: string[] = [];
  let prev: ResolvedMark | null = null;
  for (const mark of marks) {
    if (prev && sameTarget(prev, mark)) continue;
    prev = mark;
    const page = `page ${mark.pageIndex + 1}${mark.pageTitle ? `, "${mark.pageTitle}"` : ''}`;
    const verb = VERBS[mark.kind];
    if (mark.kind === 'writing') {
      const labels = mark.itemIndex !== undefined ? lookup(mark) : null;
      // A note target has no itemId for the catalog to key off, so its own
      // visible text (targetLabel) takes priority over the lookup.
      const near = mark.targetLabel
        ? `the note "${mark.targetLabel}"`
        : labels?.featureLabel
          ? `${labels.featureLabel}${labels.itemLabel ? ` of ${labels.itemLabel}` : ''}`
          : labels?.itemLabel;
      lines.push(
        mark.text
          ? `The student wrote on the board${near ? ` near ${near}` : ''} (${page}): "${mark.text}"`
          : `The student wrote something on the board (${page}), but it could not be read.`,
      );
      continue;
    }
    // First-class labelled target (e.g. an AnnotationStrip teacher-note
    // line) — quote its own visible text directly rather than falling
    // through to the catalog lookup below, which knows nothing about it.
    if (mark.targetLabel) {
      // An arrow landing on a note still needs its FROM endpoint named —
      // handle it here rather than falling into the generic wording below,
      // which would silently drop fromFeature/fromItemId.
      if (mark.kind === 'arrow' && (mark.fromItemIndex !== undefined || mark.fromFeature)) {
        lines.push(`The student drew an arrow from ${arrowFromText(mark)} to the note "${mark.targetLabel}" (${page}).`);
        continue;
      }
      lines.push(`The student ${verb} the note "${mark.targetLabel}" (${page}).`);
      continue;
    }
    if (mark.itemIndex === undefined) {
      if (mark.kind !== 'point' && mark.positionHint) {
        lines.push(`The student drew something in the ${mark.positionHint} area of ${page}.`);
        continue;
      }
      lines.push(
        mark.kind === 'point'
          ? `The student pointed at empty space on ${page}.`
          : mark.kind === 'circle'
            ? `The student drew a circle on empty space on ${page}.`
            : `The student drew something on ${page}.`,
      );
      continue;
    }
    const labels = lookup(mark);
    if (!labels || (!labels.featureLabel && !labels.itemLabel)) {
      lines.push(`The student ${mark.kind === 'point' ? 'pointed at' : 'marked'} something on ${page}.`);
      continue;
    }
    const targetText = mark.feature && labels.featureLabel
      ? `${labels.featureLabel}${labels.itemLabel ? ` of ${labels.itemLabel}` : ''}`
      : (labels.itemLabel ?? 'something');
    if (mark.kind === 'arrow' && (mark.fromItemIndex !== undefined || mark.fromFeature)) {
      lines.push(`The student drew an arrow from ${arrowFromText(mark)} to ${targetText} (${page}).`);
      continue;
    }
    const hintSuffix = !mark.feature && labels.itemLabel && mark.positionHint
      ? `, toward the ${mark.positionHint} of it`
      : '';
    lines.push(`The student ${verb} ${targetText}${hintSuffix} (${page}).`);
  }
  return lines.join('\n');
}
