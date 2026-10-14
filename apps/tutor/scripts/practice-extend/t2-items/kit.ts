/**
 * The authoring kit of the GreenApple T2 figure items (author-t2-figure-items.ts):
 * the item shape, the proof context and the spec helpers — the same ones the
 * batch-9 script keeps to itself (author-batch9-figure-items.ts), exported so
 * the items can live in one file per group under ./t2-items/.
 *
 * An item file exports ITEMS built with `G(loId, subtopic, [...])`. `loId` is
 * the FULL objective id: a seed LO for the older subjects (`geom.reflections`),
 * or `gen-<uuid>.lo-N` for the six newer ones.
 *
 * No database, no network, no model.
 */
import '../../lib/no-db-env';
import type { PracticeFigureSpec } from '../../../src/lib/tutor/practice-figure/render';
import { compileExpression } from '../../../src/lib/tutor/practice-figure/expr';
import { derivedText, runChecker, type Derived } from '../figure-core';

export type P = Record<string, unknown>;
export type Spec = PracticeFigureSpec;

// ── proof context ───────────────────────────────────────────────────────────
// ── proof context ───────────────────────────────────────────────────────────

export class Ctx {
  used: Array<{ checker: string; args: P; result: string }> = [];
  constructor(public spec: Spec) {}
  get p(): P { return this.spec.params; }
  /** A checker on this item's spec, or (with `on`) on a variant of it — the variant is recorded with the result. */
  run(checker: string, args: P = {}, on?: { spec: Spec; what: string }): Derived {
    const d = runChecker(on?.spec ?? this.spec, { checker, args });
    this.used.push({ checker, args: on ? { ...args, _onVariant: on.what } : args, result: derivedText(d) });
    return d;
  }
  num(checker: string, args: P = {}, on?: { spec: Spec; what: string }): number {
    const d = this.run(checker, args, on);
    if (d.kind !== 'number') throw new Error(`${checker} gave no number`);
    return d.value;
  }
  txt(checker: string, args: P = {}, on?: { spec: Spec; what: string }): string {
    const d = this.run(checker, args, on);
    if (d.kind === 'number') return String(d.value);
    if (d.kind === 'numbers') return d.values.join(',');
    return d.value;
  }
}

export interface A {
  /** Task kind — unique within an objective. */
  t: string;
  d: 2 | 3;
  /** What the item asks beyond locating a value on the figure. */
  need: 'reason' | 'calc';
  spec: Spec;
  /** The item's own specifics, added to `describeForAlt(spec, { hide })`. */
  alt: string;
  /** Printed values `describeForAlt` must keep back (they would give the answer). */
  hide?: Array<string | number>;
  q: string;
  /** mcq: [text, the mistake behind it]; the CORRECT option first (its second entry is 'correct'). */
  o?: Array<[string, string]>;
  /** numeric: the stated key. */
  n?: string;
  /** The key is the result of this figure-core checker on the spec. */
  ck?: [string, P];
  /** The key is this value, computed in code from the spec (description, function). */
  calc?: [string, (c: Ctx) => string | number];
  /** numeric: the key again by the routes a student may take (early rounding of an intermediate, another value of a constant, …) — every one must round to the stated key. */
  alts?: [string, (c: Ctx) => number[]];
  /** mcq: whether each option, as written, is a right answer to the question (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
  /** The answer does not rest on the off-grid features the rule check names (turning-point heights of a polynomial graph): why. */
  offGridOk?: string;
}
export interface Item extends A { lo: string; sub: string }

/** The items of one objective; `lo` is the full objective id. */
export function G(lo: string, sub: string, items: A[]): Item[] {
  return items.map((a) => ({ ...a, lo, sub }));
}

export const S = (type: string, params: P): Spec => ({ type, params });
export const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
export const round = (v: number, dp: number): number => Number(v.toFixed(dp));
export const arr = (v: unknown): P[] => v as P[];
export const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);
/** One test per option: the option holds when the value computed from the spec is the value the option stands for. */
export const pick = <T,>(how: string, f: (c: Ctx) => T, stated: T[]): [string, Array<(c: Ctx) => boolean>] => [how, stated.map((v) => (c: Ctx) => JSON.stringify(f(c)) === JSON.stringify(v))];
/** "Which statement is FALSE?": one test per option that says whether its statement is TRUE of the figure; the option answers the question when its statement is false. */
export const falseOne = (how: string, truths: Array<(c: Ctx) => boolean>): [string, Array<(c: Ctx) => boolean>] => [`${how}; an option answers the question when its statement is false`, truths.map((f) => (c: Ctx) => !f(c))];

// ── helpers for particular kinds ────────────────────────────────────────────

/** Function graphs; `pgraph` names the two axes (a graph of one physical quantity against another); `tgraph` has a π axis. */
export const fgraph = (params: P): Spec => S('function_graph', { xStep: 1, yStep: 1, ...params });
export const pgraph = (xLabel: string, yLabel: string, xRange: [number, number], xStep: number, yRange: [number, number], yStep: number, curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, xStep, yStep, xLabel, yLabel, curves, ...extra });
export const tgraph = (xRange: [number, number], divisor: number, yRange: [number, number], curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, yStep: 1, xTickUnit: 'pi', xTickDivisor: divisor, curves, ...extra });
export const PI = Math.PI;
/** The x at which an increasing or decreasing function reaches a value, by bisection on [a, b]. */
export const solve = (f: (x: number) => number, value: number, a: number, b: number): number => { let lo = a; let hi = b; const up = f(b) > f(a); if ((f(a) - value) * (f(b) - value) > 0) throw new Error(`no crossing of ${value} on [${a}, ${b}]`); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((f(m) < value) === up) lo = m; else hi = m; } return round((lo + hi) / 2, 6); };
/** The i-th curve of a function graph, compiled from ITS OWN expression in the spec. */
export const fOf = (c: Ctx, i = 0): ((x: number) => number) => compileExpression(arr(c.p.curves)[i].expr as string);
/** Straight pieces through the given corner points, as the curves of a function graph (the pieces of ONE function). */
export const plin = (pts: number[][]): P[] => pts.slice(1).map((q, i) => { const [x0, y0] = pts[i]; const m = (q[1] - y0) / (q[0] - x0); return { expr: `(${m})*x + (${y0 - m * x0})`, domain: [x0, q[0]] }; });
/** The function drawn by the pieces of a function graph (all of them, or those listed), from the spec's own expressions and domains. */
export const pwOf = (c: Ctx, idx?: number[]): ((x: number) => number) => (x) => {
  for (const [i, k] of arr(c.p.curves).entries()) {
    if (idx && !idx.includes(i)) continue;
    const d = (k.domain ?? c.p.xRange) as number[];
    if (x >= d[0] - 1e-9 && x <= d[1] + 1e-9) return compileExpression(k.expr as string)(x);
  }
  throw new Error(`no piece is drawn at x = ${x}`);
};
/** Where the pieces of a function graph join (the ends of their domains). */
export const knotsOf = (c: Ctx): number[] => [...new Set(arr(c.p.curves).flatMap((k) => (k.domain ?? c.p.xRange) as number[]))].sort((a, b) => a - b);
/** ∫ₐᵇ f by Simpson's rule on each stretch between the given break points (exact for the straight pieces used here). */
export const integ = (f: (x: number) => number, a: number, b: number, breaks: number[] = []): number => {
  const xs = [a, ...breaks.filter((k) => k > a + 1e-9 && k < b - 1e-9), b];
  let total = 0;
  for (let j = 1; j < xs.length; j++) {
    const n = 400; const h = (xs[j] - xs[j - 1]) / n; const e = h * 1e-6;
    // The ends are taken just inside the stretch, so a piecewise function is read on the right piece.
    let s = f(xs[j - 1] + e) + f(xs[j] - e);
    for (let i = 1; i < n; i++) s += f(xs[j - 1] + i * h) * (i % 2 ? 4 : 2);
    total += (s * h) / 3;
  }
  return total;
};
/** Shaded regions: under a curve down to the x-axis, or between two curves. */
export const under = (expr: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'under_curve', expr, from, to } });
export const between = (upper: string, lower: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'between_curves', upper: { expr: upper }, lower: { expr: lower }, from, to } });
/** The width of a shaded region across the x-direction (the base of a cross section), with the ends of the region — from the spec's own expressions. */
export const widthOf = (c: Ctx): { d: (x: number) => number; a: number; b: number } => {
  const r = c.p.region as P;
  if (r.type === 'under_curve') return { d: compileExpression(r.expr as string), a: r.from as number, b: r.to as number };
  const u = compileExpression((r.upper as P).expr as string); const l = compileExpression((r.lower as P).expr as string);
  return { d: (x) => u(x) - l(x), a: r.from as number, b: r.to as number };
};
/** The turning points of a function inside (a, b): [x, y, 'max' | 'min'], by a fine scan refined by golden-section search. */
export const turnsOf = (f: (x: number) => number, a: number, b: number): Array<{ x: number; y: number; kind: 'max' | 'min' }> => {
  const out: Array<{ x: number; y: number; kind: 'max' | 'min' }> = [];
  const n = 4000; const h = (b - a) / n;
  for (let i = 1; i < n; i++) {
    const x = a + i * h; const y0 = f(x - h); const y1 = f(x); const y2 = f(x + h);
    if (![y0, y1, y2].every(Number.isFinite)) continue;
    const kind = y1 > y0 && y1 >= y2 ? 'max' : y1 < y0 && y1 <= y2 ? 'min' : null;
    if (!kind) continue;
    let lo = x - h; let hi = x + h; const g = (t: number) => (kind === 'max' ? -f(t) : f(t));
    for (let k = 0; k < 80; k++) { const m1 = lo + (hi - lo) * 0.382; const m2 = lo + (hi - lo) * 0.618; if (g(m1) < g(m2)) hi = m2; else lo = m1; }
    const xm = round((lo + hi) / 2, 4);
    out.push({ x: xm, y: round(f(xm), 4), kind });
  }
  return out;
};
/** Whether a function is even / odd on the window [−w, w] (tested at 400 points). */
export const symOf = (f: (x: number) => number, w: number): { even: boolean; odd: boolean } => {
  let even = true; let odd = true;
  for (let i = 1; i <= 400; i++) { const x = (w * i) / 400; if (!near(f(-x), f(x), 1e-7)) even = false; if (!near(f(-x), -f(x), 1e-7)) odd = false; }
  return { even, odd: odd && near(f(0), 0, 1e-9) };
};
/** Whether a polynomial changes sign at a zero (crosses) or not (touches). */
export const crossesAt = (f: (x: number) => number, x0: number): boolean => { if (!near(f(x0), 0, 1e-9)) throw new Error(`${x0} is not a zero`); return f(x0 - 0.05) * f(x0 + 0.05) < 0; };
export const rc = (params: P): Spec => S('reaction_coordinate', { reactantLabel: 'Reactants', productLabel: 'Products', units: 'kJ/mol', showAxisValues: true, ...params });
export const titr = (analyte: P, titrantConcentration: number, maxVolume: number): Spec => S('titration_curve', { analyte, titrantConcentration, maxVolume });
export const scatter = (points: number[][], params: P): Spec => S('scatter_plot', { points: points.map(([x, y]) => ({ x, y })), ...params });
export const dotsOf = (c: Ctx): number[][] => arr(c.p.points).map((k) => [k.x as number, k.y as number]);
/** Whether the points (x, g(y)) lie on one straight line. */
export const straight = (pts: number[][], g: (y: number) => number = (y) => y): boolean => { const [a, b] = pts; const m = (g(b[1]) - g(a[1])) / (b[0] - a[0]); return pts.every(([x, y]) => near(g(y), g(a[1]) + m * (x - a[0]), 1e-6)); };
export const pes = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'pes', peaks: peaks.map(([energy, electrons]) => ({ energy, electrons })), ...extra });
export const energiesOf = (c: Ctx): number[] => arr(c.p.peaks).map((k) => k.energy as number);
/** Force–time graphs: straight lines through the given (time, force) corners. */
export const force = (series: P[], tRange: [number, number], yRange: [number, number], extra: P = {}): Spec => S('motion_graph', { series, tRange, yRange, tStep: 1, yStep: 10, tLabel: 'Time (s)', yLabel: 'Force (N)', ...extra });
