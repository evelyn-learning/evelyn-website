/**
 * SmoothDraw Phase 2 — pure hand-stroke geometry.
 *
 * Turns a spine polyline into a CLOSED variable-width outline path (fill
 * it, don't stroke it): tapered at both ends, slightly wobbled. Wobble is
 * seeded (FNV-1a → mulberry32) from mark content so re-renders, replay,
 * and the PDF mirrors produce the IDENTICAL mark — Math.random is banned
 * here (spec §4).
 *
 * Consumers: ScribbleOverlays (live) + whiteboard-capture.ts (both PDF
 * sites). Keep the three in lockstep.
 */

export type Pt = { x: number; y: number };

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resample a polyline to ~STEP-px spacing so the outline bends smoothly. */
const STEP = 6;
function resample(spine: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < spine.length; i++) {
    const a = spine[i];
    const b = spine[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.round(len / STEP));
    for (let k = 0; k < n; k++) {
      out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
    }
  }
  if (spine.length > 0) out.push(spine[spine.length - 1]);
  return out;
}

/** Width profile: taper over the first/last 15% of arc, floor 30%. */
function widthFactor(t: number): number {
  const ramp = Math.min(1, t / 0.15, (1 - t) / 0.15);
  return 0.3 + 0.7 * Math.max(0, ramp);
}

export function strokeOutline(spine: Pt[], baseWidth: number, seed: string): string {
  const pts = resample(spine);
  if (pts.length < 2) return '';
  let total = 0;
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  if (total === 0) return '';

  const rng = mulberry32(fnv1a(seed));
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(next.y - prev.y);
    let ny = next.x - prev.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl;
    ny /= nl;
    const t = cum[i] / total;
    // Wobble: noise ∈ [-0.12, 0.12] is added to the unitless widthFactor
    // (taper) BEFORE the /2 below, so its effective magnitude on the
    // half-width is ~half that: ~±6% of baseWidth, per point, seeded.
    const noise = (rng() - 0.5) * 0.24;
    const half = Math.max(0.4, (baseWidth * (widthFactor(t) + noise)) / 2);
    left.push({ x: pts[i].x + nx * half, y: pts[i].y + ny * half });
    right.push({ x: pts[i].x - nx * half, y: pts[i].y - ny * half });
  }
  const fmt = (p: Pt) => `${Math.round(p.x * 100) / 100} ${Math.round(p.y * 100) / 100}`;
  return `M ${fmt(left[0])} L ${left.slice(1).map(fmt).join(' L ')} L ${right.reverse().map(fmt).join(' L ')} Z`;
}

/** The ✓ spine through the existing corner anchor (tx, ty) — same
 *  three-point geometry as the a7c124a tick path so anchor/clamp math
 *  in callers is unchanged. */
export function tickSpine(tx: number, ty: number, size: number): Pt[] {
  const half = size / 2;
  return [
    { x: tx - half, y: ty },
    { x: tx - half * 0.25, y: ty + half * 0.7 },
    { x: tx + half, y: ty - half * 0.6 },
  ];
}

/** Marker-swipe band for a highlight rect: a near-horizontal spine across
 *  the rect's vertical middle with seeded end jitter. Returns null when
 *  the rect is too tall for a single swipe to read as "highlighted" —
 *  the caller keeps the translucent rect fill for those regions. */
export function highlightBand(
  rect: { x: number; y: number; w: number; h: number },
  seed: string,
): { spine: Pt[]; width: number } | null {
  const width = Math.min(rect.h, Math.max(14, rect.h * 0.7), 44);
  if (rect.h > width * 2) return null;
  const rng = mulberry32(fnv1a(seed));
  const midY = rect.y + rect.h / 2;
  const jitter = () => (rng() - 0.5) * rect.h * 0.12;
  return {
    spine: [
      { x: rect.x + rect.w * 0.02, y: midY + jitter() },
      { x: rect.x + rect.w * 0.5, y: midY + jitter() },
      { x: rect.x + rect.w * 0.98, y: midY + jitter() },
    ],
    width,
  };
}

export type Rect4 = { x: number; y: number; w: number; h: number };

/** Where the center-to-center line exits `rect`, pushed `pad` px outward.
 *  Returns null when the other center is inside this rect. */
function edgeExit(rect: Rect4, toward: Pt, pad: number): Pt | null {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const dx = toward.x - cx;
  const dy = toward.y - cy;
  if (dx === 0 && dy === 0) return null;
  // Slab test: smallest t where the ray leaves the rect.
  const tx = dx !== 0 ? (dx > 0 ? (rect.x + rect.w - cx) / dx : (rect.x - cx) / dx) : Infinity;
  const ty = dy !== 0 ? (dy > 0 ? (rect.y + rect.h - cy) / dy : (rect.y - cy) / dy) : Infinity;
  const t = Math.min(tx, ty);
  if (!isFinite(t) || t <= 0) return null;
  const len = Math.hypot(dx, dy);
  const tPad = t + pad / len;
  return { x: cx + dx * tPad, y: cy + dy * tPad };
}

/** SmoothDraw P4: curved hand-arrow spine between two feature rects.
 *  Anchors at each rect's nearest edge (4px outside), bows the chord by a
 *  seeded perpendicular offset (12% of distance, clamped 8..40px), and
 *  samples the quadratic into ~12+ points so strokeOutline can wobble it.
 *  Overlapping/contained rects → empty spine (no meaningful arrow). */
export function arrowSpine(from: Rect4, to: Rect4, seed: string): Pt[] {
  const toC = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const fromC = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
  // Reject if either center lies within the other rect (overlap/containment).
  if ((toC.x >= from.x && toC.x <= from.x + from.w && toC.y >= from.y && toC.y <= from.y + from.h) ||
      (fromC.x >= to.x && fromC.x <= to.x + to.w && fromC.y >= to.y && fromC.y <= to.y + to.h)) {
    return [];
  }
  const a = edgeExit(from, toC, 4);
  const b = edgeExit(to, fromC, 4);
  if (!a || !b) return [];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 24) return []; // rects touch/overlap — an arrow would be noise
  const rng = mulberry32(fnv1a(seed));
  const bow = Math.min(40, Math.max(8, dist * 0.12)) * (rng() > 0.5 ? 1 : -1) * (0.75 + rng() * 0.5);
  const nx = -dy / dist;
  const ny = dx / dist;
  const ctrl = { x: (a.x + b.x) / 2 + nx * bow, y: (a.y + b.y) / 2 + ny * bow };
  const n = Math.max(12, Math.round(dist / 14));
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y,
    });
  }
  return out;
}

/** Two barb spines for the arrowhead, anchored at the spine tip and swept
 *  back ±~150° from the end tangent. */
export function arrowHeads(spine: Pt[], size: number): [Pt[], Pt[]] {
  if (spine.length < 2) return [[], []];
  const tip = spine[spine.length - 1];
  const prev = spine[spine.length - 2];
  const ang = Math.atan2(tip.y - prev.y, tip.x - prev.x);
  const barb = (offset: number): Pt[] => [
    { x: tip.x, y: tip.y },
    { x: tip.x + Math.cos(ang + offset) * size, y: tip.y + Math.sin(ang + offset) * size },
  ];
  const SPREAD = Math.PI - Math.PI / 6; // 150°
  return [barb(SPREAD), barb(-SPREAD)];
}
