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
