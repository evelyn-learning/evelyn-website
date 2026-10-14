/**
 * The authoring kit of the GreenApple T4 DRAWN practice items (contract
 * v1.22.0 drawn answers; author-t4-drawn-items.ts builds the rows, the test
 * scripts/test-practice-drawn-t4-items.ts proves them).
 *
 * An item is answered by drawing on a BLANK figure:
 *   - `points`   — plot points on a blank coordinate grid      (DrawnSpec 'grid-points')
 *   - `line`     — place two points that define a line          (DrawnSpec 'grid-line')
 *   - `interval` — mark one interval or ray on a number line    (DrawnSpec 'number-line-interval')
 *
 * Every key is PROVEN in code from the problem itself, separately from the
 * literal key the writer typed:
 *   - points:   `calc` recomputes the points from the givens; the set must equal `key`;
 *   - line:     `on(x, y)` is the line's equation as a residual (0 on the line), written
 *               from the givens; both key points must satisfy it, and the line must pass
 *               through at least three grid points of the frame;
 *   - interval: `holds(x)` is the condition the stem states (the inequality, the domain
 *               rule, f′(x) > 0 …); the key interval must equal the truth set on a fine
 *               sample over and far beyond the frame, endpoints included / excluded exactly.
 * Each item also names at least two likely WRONG answers (`misses`), each of which must
 * grade wrong under the contract's `gradeDrawn` (more near misses are generated in code).
 *
 * `lo` is the FULL objective id: a seed LO (`geom.reflections`) for the older
 * subjects, or `gen-<uuid>.lo-N` for the newer ones.
 *
 * No database, no network, no model.
 */

export type Pt = [number, number];

export interface GridParams {
  xRange: [number, number];
  yRange: [number, number];
  /** Numbered gridline spacing (default: one round step for both). Lighter lines are drawn between. */
  xStep?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
}

export interface LineParams {
  min: number;
  max: number;
  /** Numbered tick spacing. */
  step?: number;
  /** Unnumbered ticks between the numbered ones. */
  minorStep?: number;
}

export interface Interval {
  /** null = the solution runs on to −∞ (a ray to the left). */
  from: number | null;
  /** null = the solution runs on to +∞ (a ray to the right). */
  to: number | null;
  /** true = the end is NOT included (open circle). Ignored (use false) for a null end. */
  fromOpen: boolean;
  toOpen: boolean;
}

interface Base {
  /** Full objective id. */
  lo: string;
  /** Task kind — unique within an objective (e.g. 'ray-after-dividing-by-negative'). */
  t: string;
  /** Difficulty 1 (direct) · 2 (standard) · 3 (multi-step / harder). */
  d: 1 | 2 | 3;
  /** Subtopic — a short phrase. */
  sub: string;
  /** The stem: says exactly what to plot / mark, on what, and how many points. Plain Unicode, no LaTeX. */
  q: string;
  /** The answer as a reader would write it ("x < −2", "A′(−3, 1), B′(…)", "y = 2x − 1"). */
  a: string;
  /** Worked solution (plain Unicode). */
  s: string;
  /** Exactly two hints; neither gives the answer away. */
  h: [string, string];
}

export interface PointsItem extends Base {
  kind: 'points';
  grid: GridParams;
  /** The points to plot (any order is accepted). */
  key: Pt[];
  /** [how, recompute the points from the givens]. */
  calc: [string, () => Pt[]];
  /** Snap step (default { x: 1, y: 1 }). Tolerance is a quarter of it. */
  snap?: { x: number; y: number };
  /** ≥ 2 likely wrong answers: [the mistake, the points it gives]. */
  misses: Array<[string, Pt[]]>;
}

export interface LineItem extends Base {
  kind: 'line';
  grid: GridParams;
  /** Two points of the line (the student may use ANY two points of it). */
  key: [Pt, Pt];
  /** [how, residual of the line's equation written from the givens: 0 exactly on the line]. */
  on: [string, (x: number, y: number) => number];
  snap?: { x: number; y: number };
  /** ≥ 2 likely wrong lines: [the mistake, two points of that wrong line]. */
  misses: Array<[string, [Pt, Pt]]>;
}

export interface IntervalItem extends Base {
  kind: 'interval';
  line: LineParams;
  key: Interval;
  /** [how, the condition the stem states: true exactly for the solutions]. */
  holds: [string, (x: number) => boolean];
  /** Snap step (default: the tick spacing). Tolerance is a quarter of it. */
  snap?: number;
  /** ≥ 2 likely wrong answers. */
  misses: Array<[string, Interval]>;
}

export type DrawnItem = PointsItem | LineItem | IntervalItem;

// ── helpers for proofs ──────────────────────────────────────────────────────

/** Numerical derivative (central difference) — for proving a tangent line independently of a hand-derived f′. */
export function deriv(f: (x: number) => number, a: number, h = 1e-5): number {
  return (f(a + h) - f(a - h)) / (2 * h);
}

/** Residual of the tangent line to f at x = a, found numerically: y − (f(a) + f′(a)(x − a)). */
export function tangentResidual(f: (x: number) => number, a: number): (x: number, y: number) => number {
  const m = deriv(f, a);
  const b = f(a);
  return (x, y) => y - (b + m * (x - a));
}

/** Residual of the line through two points (works for vertical lines too). */
export function throughResidual([x1, y1]: Pt, [x2, y2]: Pt): (x: number, y: number) => number {
  return (x, y) => (y2 - y1) * (x - x1) - (x2 - x1) * (y - y1);
}

/** Rigid motions / dilations about the origin or a centre, for `calc`. */
export const T = {
  translate: ([x, y]: Pt, dx: number, dy: number): Pt => [x + dx, y + dy],
  reflectX: ([x, y]: Pt): Pt => [x, -y],
  reflectY: ([x, y]: Pt): Pt => [-x, y],
  reflectYeqX: ([x, y]: Pt): Pt => [y, x],
  reflectYeqNegX: ([x, y]: Pt): Pt => [-y, -x],
  /** Reflect across the vertical line x = c. */
  reflectXeq: ([x, y]: Pt, c: number): Pt => [2 * c - x, y],
  /** Reflect across the horizontal line y = c. */
  reflectYeq: ([x, y]: Pt, c: number): Pt => [x, 2 * c - y],
  /** Rotate counterclockwise by `deg` (a multiple of 90) about `c` (default the origin). */
  rotate: ([x, y]: Pt, deg: number, c: Pt = [0, 0]): Pt => {
    const r = (deg * Math.PI) / 180;
    const dx = x - c[0];
    const dy = y - c[1];
    const round = (v: number) => Math.round(v * 1e9) / 1e9;
    return [round(c[0] + dx * Math.cos(r) - dy * Math.sin(r)), round(c[1] + dx * Math.sin(r) + dy * Math.cos(r))];
  },
  dilate: ([x, y]: Pt, k: number, c: Pt = [0, 0]): Pt => [c[0] + k * (x - c[0]), c[1] + k * (y - c[1])],
  midpoint: ([x1, y1]: Pt, [x2, y2]: Pt): Pt => [(x1 + x2) / 2, (y1 + y2) / 2],
};

/** Polar (r, θ in radians) → rectangular, rounded to 9 places. */
export function polar(r: number, theta: number): Pt {
  const round = (v: number) => Math.round(v * 1e9) / 1e9;
  return [round(r * Math.cos(theta)), round(r * Math.sin(theta))];
}

/** Solve the 2×2 system a1x + b1y = c1, a2x + b2y = c2 by Cramer's rule. */
export function solve2(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Pt {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-12) throw new Error('solve2: the system has no single solution');
  return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
}

/** Least-squares line through data: { a, b } with ŷ = a + b·x. */
export function lsrl(xs: number[], ys: number[]): { a: number; b: number } {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

/** Real roots of ax² + bx + c = 0, ascending. */
export function quadRoots(a: number, b: number, c: number): number[] {
  const disc = b * b - 4 * a * c;
  if (disc < 0) return [];
  const r = Math.sqrt(disc);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((u, v) => u - v);
}
