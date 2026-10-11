/**
 * Hand-authored practice items that are read off a FIGURE — batch 9.
 *
 * Items for the 14 objectives that hold too little practice: the one with no
 * item and the 13 with one or two (release-note-stats-2026-10-17/stats.md,
 * "Objectives with no item" / "Objectives with one or two items"; all 14 are
 * flagged as needing a figure). Each is brought to at least five items in
 * all: three to five new ones an objective (OBJECTIVES holds what each has
 * now), one of them level 2 and the rest level 3.
 *
 * What makes an item level 3 here — at least two of: two separate readings
 * combined; a reading that must be interpreted through the objective's idea
 * before it is used; a choice between cases that the figure decides; working
 * backwards from a stated result to a feature of the figure; finding which of
 * four statements about the figure is false; comparing two curves / set-ups.
 *
 * Volumes with cross sections: no existing kind draws the solid. The figure
 * draws its BASE (a shaded region, or the graph that bounds it) and the stem
 * says what the cross sections are; a volume is asked for as a decimal to a
 * stated place (the answer box is numeric), never "in terms of π".
 *
 * Rules carried over from the independent reads of the earlier batches: the
 * answer must need the figure; nothing that is asked for is printed on it, and
 * every value to be read lies on a numbered gridline or is printed; stem and
 * figure agree literally; the item is answerable with what the objective's own
 * lesson text teaches plus what the stem defines; numeric keys are exact or
 * tested in code against early rounding (`alts`); hints name a method, never a
 * part of the answer; the alt text names what the figure shows without giving
 * the answer; no item repeats a figure or a task the objective already holds.
 *
 * Same pattern and output layout as author-batch8-figure-items.ts. Every item
 * is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed), the option-letter guard
 *     (`figureLetterClash`) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core checker whose
 *     result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the spec's own params
 *     and expressions; an item whose key does not follow from its spec stops
 *     the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file);
 *   - writes the alt text from `describeForAlt` (what the picture prints,
 *     with any value to keep back hidden) plus the item's own specifics.
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the key proofs, the mapping (every one of the 14
 * objectives: covered, or not covered and why), a gallery page, PNGs at the
 * 340 px column (2×), contact sheets and a summary.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   MONGODB_URI="" env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch9-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { compileExpression } from '../../src/lib/tutor/practice-figure/expr';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-19-items`;
/** The figure rows the objectives hold now: no figure spec and no stem of theirs may be reused, and no id. */
const HELD_ROWS = [
  `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`,
  `${INTEGRATION}/release-2026-10-15/figure-rows-253-second.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6-61.json`,
  `${INTEGRATION}/practice-figures-2026-10-17-items/final/figure-rows-batch7-88.json`,
  `${INTEGRATION}/practice-figures-2026-10-18-items/final/figure-rows-batch8-101.json`,
];
/** Every other figure rows file written before this batch (released or not) — an id may not be reused. Those that exist are read. */
const EARLIER_ROWS = [
  ...HELD_ROWS,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4-101.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5-152.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6.json`,
  `${INTEGRATION}/practice-figures-2026-10-17-items/final/figure-rows-batch7.json`,
  `${INTEGRATION}/practice-figures-2026-10-18-items/final/figure-rows-batch8.json`,
];
/** The CURRENT lesson packs (lesson text and every existing item). */
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×
/** Each objective is brought to at least this many items in total (what it holds + what is written here) … */
const TARGET_PER_OBJECTIVE = 5;
/** … with at most this many new ones. */
const CAP_PER_OBJECTIVE = 5;

type P = Record<string, unknown>;
type Spec = PracticeFigureSpec;

// ── proof context ───────────────────────────────────────────────────────────

class Ctx {
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

interface A {
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
interface Item extends A { lo: string; sub: string }

const ITEMS: Item[] = [];
/** `lo` is "<first block of the plan id>.lo-N"; resolved against the lesson packs. */
function G(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub });
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const arr = (v: unknown): P[] => v as P[];
const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);
/** One test per option: the option holds when the value computed from the spec is the value the option stands for. */
const pick = <T,>(how: string, f: (c: Ctx) => T, stated: T[]): [string, Array<(c: Ctx) => boolean>] => [how, stated.map((v) => (c: Ctx) => JSON.stringify(f(c)) === JSON.stringify(v))];
/** "Which statement is FALSE?": one test per option that says whether its statement is TRUE of the figure; the option answers the question when its statement is false. */
const falseOne = (how: string, truths: Array<(c: Ctx) => boolean>): [string, Array<(c: Ctx) => boolean>] => [`${how}; an option answers the question when its statement is false`, truths.map((f) => (c: Ctx) => !f(c))];

// ── helpers for particular kinds ────────────────────────────────────────────

/** Function graphs; `pgraph` names the two axes (a graph of one physical quantity against another); `tgraph` has a π axis. */
const fgraph = (params: P): Spec => S('function_graph', { xStep: 1, yStep: 1, ...params });
const pgraph = (xLabel: string, yLabel: string, xRange: [number, number], xStep: number, yRange: [number, number], yStep: number, curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, xStep, yStep, xLabel, yLabel, curves, ...extra });
const tgraph = (xRange: [number, number], divisor: number, yRange: [number, number], curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, yStep: 1, xTickUnit: 'pi', xTickDivisor: divisor, curves, ...extra });
const PI = Math.PI;
/** The x at which an increasing or decreasing function reaches a value, by bisection on [a, b]. */
const solve = (f: (x: number) => number, value: number, a: number, b: number): number => { let lo = a; let hi = b; const up = f(b) > f(a); if ((f(a) - value) * (f(b) - value) > 0) throw new Error(`no crossing of ${value} on [${a}, ${b}]`); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((f(m) < value) === up) lo = m; else hi = m; } return round((lo + hi) / 2, 6); };
/** The i-th curve of a function graph, compiled from ITS OWN expression in the spec. */
const fOf = (c: Ctx, i = 0): ((x: number) => number) => compileExpression(arr(c.p.curves)[i].expr as string);
/** Straight pieces through the given corner points, as the curves of a function graph (the pieces of ONE function). */
const plin = (pts: number[][]): P[] => pts.slice(1).map((q, i) => { const [x0, y0] = pts[i]; const m = (q[1] - y0) / (q[0] - x0); return { expr: `(${m})*x + (${y0 - m * x0})`, domain: [x0, q[0]] }; });
/** The function drawn by the pieces of a function graph (all of them, or those listed), from the spec's own expressions and domains. */
const pwOf = (c: Ctx, idx?: number[]): ((x: number) => number) => (x) => {
  for (const [i, k] of arr(c.p.curves).entries()) {
    if (idx && !idx.includes(i)) continue;
    const d = (k.domain ?? c.p.xRange) as number[];
    if (x >= d[0] - 1e-9 && x <= d[1] + 1e-9) return compileExpression(k.expr as string)(x);
  }
  throw new Error(`no piece is drawn at x = ${x}`);
};
/** Where the pieces of a function graph join (the ends of their domains). */
const knotsOf = (c: Ctx): number[] => [...new Set(arr(c.p.curves).flatMap((k) => (k.domain ?? c.p.xRange) as number[]))].sort((a, b) => a - b);
/** ∫ₐᵇ f by Simpson's rule on each stretch between the given break points (exact for the straight pieces used here). */
const integ = (f: (x: number) => number, a: number, b: number, breaks: number[] = []): number => {
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
const under = (expr: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'under_curve', expr, from, to } });
const between = (upper: string, lower: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'between_curves', upper: { expr: upper }, lower: { expr: lower }, from, to } });
/** The width of a shaded region across the x-direction (the base of a cross section), with the ends of the region — from the spec's own expressions. */
const widthOf = (c: Ctx): { d: (x: number) => number; a: number; b: number } => {
  const r = c.p.region as P;
  if (r.type === 'under_curve') return { d: compileExpression(r.expr as string), a: r.from as number, b: r.to as number };
  const u = compileExpression((r.upper as P).expr as string); const l = compileExpression((r.lower as P).expr as string);
  return { d: (x) => u(x) - l(x), a: r.from as number, b: r.to as number };
};
/** The turning points of a function inside (a, b): [x, y, 'max' | 'min'], by a fine scan refined by golden-section search. */
const turnsOf = (f: (x: number) => number, a: number, b: number): Array<{ x: number; y: number; kind: 'max' | 'min' }> => {
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
const symOf = (f: (x: number) => number, w: number): { even: boolean; odd: boolean } => {
  let even = true; let odd = true;
  for (let i = 1; i <= 400; i++) { const x = (w * i) / 400; if (!near(f(-x), f(x), 1e-7)) even = false; if (!near(f(-x), -f(x), 1e-7)) odd = false; }
  return { even, odd: odd && near(f(0), 0, 1e-9) };
};
/** Whether a polynomial changes sign at a zero (crosses) or not (touches). */
const crossesAt = (f: (x: number) => number, x0: number): boolean => { if (!near(f(x0), 0, 1e-9)) throw new Error(`${x0} is not a zero`); return f(x0 - 0.05) * f(x0 + 0.05) < 0; };
const rc = (params: P): Spec => S('reaction_coordinate', { reactantLabel: 'Reactants', productLabel: 'Products', units: 'kJ/mol', showAxisValues: true, ...params });
const titr = (analyte: P, titrantConcentration: number, maxVolume: number): Spec => S('titration_curve', { analyte, titrantConcentration, maxVolume });
const scatter = (points: number[][], params: P): Spec => S('scatter_plot', { points: points.map(([x, y]) => ({ x, y })), ...params });
const dotsOf = (c: Ctx): number[][] => arr(c.p.points).map((k) => [k.x as number, k.y as number]);
/** Whether the points (x, g(y)) lie on one straight line. */
const straight = (pts: number[][], g: (y: number) => number = (y) => y): boolean => { const [a, b] = pts; const m = (g(b[1]) - g(a[1])) / (b[0] - a[0]); return pts.every(([x, y]) => near(g(y), g(a[1]) + m * (x - a[0]), 1e-6)); };
const pes = (peaks: Array<[number, number]>, extra: P = {}): Spec => S('spectrum', { variant: 'pes', peaks: peaks.map(([energy, electrons]) => ({ energy, electrons })), ...extra });
const energiesOf = (c: Ctx): number[] => arr(c.p.peaks).map((k) => k.energy as number);
/** Force–time graphs: straight lines through the given (time, force) corners. */
const force = (series: P[], tRange: [number, number], yRange: [number, number], extra: P = {}): Spec => S('motion_graph', { series, tRange, yRange, tStep: 1, yStep: 10, tLabel: 'Time (s)', yLabel: 'Force (N)', ...extra });

/** The objectives of this batch and the number of practice items each holds now (release-note-stats-2026-10-17/stats.md). Keys are "<first block of the plan id>.lo-N". */
const OBJECTIVES: Record<string, number> = {
  'ab0207fe.lo-5': 0, // AP Calculus AB — volumes with semicircular cross sections
  '048bb219.lo-6': 1, // Algebra II — midline from graphs of sine and cosine
  '3a76002e.lo-3': 2, // AP Calculus AB — definite integrals by geometric area
  'ab0207fe.lo-4': 2, // AP Calculus AB — volumes with triangular cross sections
  '27b58964.lo-2': 2, // AP Chemistry — activation energy on energy profiles
  '27b58964.lo-6': 2, // AP Chemistry — exothermic and endothermic profiles compared
  '500ae70f.lo-4': 2, // AP Chemistry — features and shapes of titration curves
  'cc23c103.lo-2': 2, // AP Chemistry — reaction order from linear plots
  'f5cf533c.lo-2': 2, // AP Chemistry — PES peak position and binding energy
  '02fe8c70.lo-3': 2, // Physics — impulse as the area under a force–time graph
  '181b8129.lo-5': 2, // Precalculus — polynomial graphs from end behaviour, zeros and multiplicity
  '385b98f9.lo-2': 2, // Precalculus — local maximum and minimum points
  '385b98f9.lo-3': 1, // Precalculus — even and odd symmetry from a graph
  '5d6790af.lo-3': 2, // Precalculus — tangent, secant and cosecant graphs
};

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// AP CALCULUS AB
// ════════════════════════════════════════════════════════════════════════════

// ── Volumes with Cross Sections (pack 133) ──────────────────────────────────
// The solid itself cannot be drawn with an existing kind. Each figure draws the BASE of the solid
// (a region on a grid, or the graph that bounds it); the stem says what the cross sections are.

G('ab0207fe.lo-5', 'Semicircular cross sections on a base read from a graph', [
  {
    t: 'area of one semicircular cross section', d: 2, need: 'calc',
    spec: under('sqrt(x + 1)', 0, 8, [0, 9], [0, 4]),
    alt: 'The shaded region lies between a slowly rising curve and the x-axis, from the y-axis across to a vertical boundary near the right-hand side of the grid.',
    q: 'The shaded region shown is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a semicircle whose diameter runs across the base, from the x-axis up to the curve. What is the area of the cross section at x = 3, to two decimal places?',
    n: '1.57',
    calc: ['(π/8)·d² with d the height of the spec\'s curve at x = 3', (c) => (PI / 8) * widthOf(c).d(3) ** 2],
    alts: ['π taken as 3.14 or as 22/7', (c) => [(3.14 / 8) * widthOf(c).d(3) ** 2, (22 / 7 / 8) * widthOf(c).d(3) ** 2]],
    h: ['The diameter of the semicircle at x = 3 is the height of the curve there. Read it from the graph and halve it to get the radius.', 'A semicircle has half the area of the full circle with the same radius.'],
    s: 'Read from the figure: at x = 3 the curve is at height 2, so the diameter of the semicircle is 2 and its radius is 1. Area = (π/2)r² = (π/2)(1)² = π/2 ≈ 1.57.',
  },
  {
    t: 'volume on a triangular base under a line', d: 3, need: 'calc',
    spec: under('6 - x', 0, 6, [0, 7], [0, 7]),
    alt: 'The shaded region is a triangle between a falling straight line, the x-axis and the y-axis.',
    q: 'The shaded region shown is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a semicircle whose diameter runs across the base, from the x-axis up to the line. What is the volume of the solid, to one decimal place?',
    n: '28.3',
    calc: ['(π/8)∫ d(x)² dx over the spec\'s region, d the height of its line', (c) => { const w = widthOf(c); return (PI / 8) * integ((x) => w.d(x) ** 2, w.a, w.b); }],
    alts: ['π taken as 3.14 or as 22/7 in 9π', () => [9 * 3.14, (9 * 22) / 7]],
    h: ['Read two points of the line to write its equation; that gives the diameter of the semicircle at each x, and half of it is the radius.', 'Write the area of a semicircle with that radius, then integrate the area from the left end of the base to the right end.'],
    s: 'Read from the figure: the line falls from (0, 6) to (6, 0), so y = 6 − x, and the base runs from x = 0 to x = 6. The diameter at x is 6 − x, so r = (6 − x)/2 and A(x) = (π/2)r² = (π/8)(6 − x)². V = ∫₀⁶ (π/8)(6 − x)² dx = (π/8)(216/3) = 9π ≈ 28.3.',
  },
  {
    t: 'the end of the base found from a stated volume', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 5], yRange: [0, 10], yStep: 2, curves: [{ expr: '2x' }] }),
    alt: 'A straight line rising from the origin across a grid; nothing else is drawn or marked.',
    q: 'The line shown, the x-axis and the vertical line x = k (with k > 0) enclose a region that is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a semicircle whose diameter runs across the base, from the x-axis up to the line. The volume of the solid is 4.5π cubic units. What is the value of k?',
    n: '3',
    calc: ['the k at which (π/8)∫₀ᵏ f(x)² dx reaches 4.5π, f the spec\'s line (bisection)', (c) => { const f = fOf(c); return solve((k) => (PI / 8) * integ((x) => f(x) ** 2, 0, k), 4.5 * PI, 0.01, 5); }],
    h: ['Read the slope of the line to write its equation. The diameter of each semicircle is the height of the line, so the radius is half of that height.', 'Integrate the area of the semicircle from x = 0 to x = k to get the volume in terms of k, then set it equal to the stated volume.'],
    s: 'Read from the figure: the line passes through (0, 0) and (1, 2), so y = 2x. The diameter at x is 2x, so r = x and A(x) = (π/2)x². V = ∫₀ᵏ (π/2)x² dx = πk³/6. Setting πk³/6 = 4.5π gives k³ = 27, so k = 3.',
  },
  {
    t: 'volume on a base bounded by a graph in two straight pieces', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 6], yRange: [0, 5], curves: plin([[0, 0], [3, 3], [5, 3]]) }),
    alt: 'A graph in two straight pieces: it rises from the origin, then runs level to an end point marked with a dot.',
    q: 'The graph of a function f is shown for 0 ≤ x ≤ 5. The region between the graph and the x-axis is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a semicircle whose diameter runs across the base, from the x-axis up to the graph. What is the volume of the solid, to one decimal place?',
    n: '10.6',
    calc: ['(π/8)∫ f(x)² dx over the drawn pieces of the spec, split where they join', (c) => { const f = pwOf(c); const k = knotsOf(c); return (PI / 8) * integ((x) => f(x) ** 2, k[0], k[k.length - 1], k); }],
    alts: ['π taken as 3.14 or 22/7 in 27π/8, or the two parts rounded to two places before adding', () => [(27 * 3.14) / 8, (27 * 22) / 7 / 8, 3.53 + 7.07]],
    h: ['The graph has two straight pieces, so write the diameter of the semicircle separately for each piece and split the integral where the pieces join.', 'On each piece the radius is half the height of the graph and the area of the cross section is (π/2)r². Add the two integrals.'],
    s: 'Read from the figure: f(x) = x from x = 0 to x = 3, and f(x) = 3 from x = 3 to x = 5. With r = f(x)/2, A(x) = (π/8)[f(x)]². V = ∫₀³ (π/8)x² dx + ∫₃⁵ (π/8)(9) dx = 9π/8 + 18π/8 = 27π/8 ≈ 10.6.',
  },
  {
    t: 'volumes of two solids on bases of equal area compared', d: 3, need: 'reason',
    spec: fgraph({ xRange: [0, 5], yRange: [0, 5], curves: [{ expr: '2', domain: [0, 4], label: 'P' }, { expr: 'x', domain: [0, 4], label: 'Q' }] }),
    alt: 'Two straight lines on a square grid, each drawn from the y-axis to the same x-value: P is level and Q rises from the origin, crossing P halfway along.',
    q: 'Two solids stand on bases drawn on the grid shown. The base of solid 1 lies between line P and the x-axis, and the base of solid 2 lies between line Q and the x-axis, each from x = 0 to x = 4. In both solids every cross section perpendicular to the x-axis is a semicircle whose diameter runs across the base, from the x-axis up to the line. How does the volume of solid 2 compare with the volume of solid 1?',
    o: [
      ['It is 4/3 of the volume of solid 1', 'correct'],
      ['The two volumes are equal', 'compares the areas of the two bases, which are both 8, and not the integrals of the cross-section areas'],
      ['It is 4 times the volume of solid 1', 'compares only the largest cross sections of the two solids'],
      ['It is 3/4 of the volume of solid 1', 'forms the ratio the wrong way round'],
    ],
    holds: ['V₂ ÷ V₁ with each V = (π/8)∫₀⁴ (height of the spec\'s line)² dx: the option holds when that ratio is the one it states', (() => {
      const ratio = (c: Ctx) => { const p = fOf(c, 0); const q = fOf(c, 1); const d = arr(c.p.curves)[0].domain as number[]; return integ((x) => q(x) ** 2, d[0], d[1]) / integ((x) => p(x) ** 2, d[0], d[1]); };
      return [4 / 3, 1, 4, 3 / 4].map((v) => (c: Ctx) => near(ratio(c), v, 1e-6));
    })()],
    h: ['For each solid, the area of a cross section is (π/8) × (diameter)², where the diameter is the height of that solid\'s line.', 'Integrate that area from x = 0 to x = 4 for each solid, then divide one result by the other.'],
    s: 'Read from the figure: line P is y = 2 and line Q is y = x, each for 0 ≤ x ≤ 4. A(x) = (π/8)d². Solid 1: V = ∫₀⁴ (π/8)(4) dx = 2π. Solid 2: V = ∫₀⁴ (π/8)x² dx = (π/8)(64/3) = 8π/3. The ratio is (8π/3) ÷ 2π = 4/3. The two bases have the same area, 8, but the volumes differ: the area of a cross section goes with the square of its diameter.',
  },
]);

G('ab0207fe.lo-4', 'Triangular cross sections on a base read from a graph', [
  {
    t: 'area of one triangular cross section of fixed height', d: 2, need: 'calc',
    spec: under('4 - 0.25*x^2', 0, 4, [0, 5], [0, 5]),
    alt: 'The shaded region lies between a falling curve, the x-axis and the y-axis; the curve starts on the y-axis and comes down to the x-axis.',
    q: 'The shaded region shown is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a triangle whose base runs across the shaded region, from the x-axis up to the curve, and whose height is 6. What is the area of the cross section at x = 2?',
    n: '9',
    calc: ['½ × (height of the spec\'s curve at x = 2) × 6', (c) => 0.5 * widthOf(c).d(2) * 6],
    h: ['The base of the triangle at x = 2 is the height of the curve there. Read it from the graph.', 'Area of a triangle = ½ × base × height, and the height of the triangle is given in the question.'],
    s: 'Read from the figure: at x = 2 the curve is at height 3, so the base of the triangle is 3. The height of the triangle is 6, so its area is ½ × 3 × 6 = 9.',
  },
  {
    t: 'volume with isosceles right triangles on a base under a line', d: 3, need: 'calc',
    spec: under('6 - 2x', 0, 3, [0, 4], [0, 7]),
    alt: 'The shaded region is a triangle between a steeply falling straight line, the x-axis and the y-axis.',
    q: 'The shaded region shown is the base of a solid. Every cross section of the solid perpendicular to the x-axis is an isosceles right triangle: one of its two equal legs runs across the base, from the x-axis up to the line, and the other leg stands at right angles to the base. What is the volume of the solid?',
    n: '18',
    calc: ['∫ ½·d(x)² dx over the spec\'s region, d the height of its line (both legs equal d)', (c) => { const w = widthOf(c); return round(integ((x) => 0.5 * w.d(x) ** 2, w.a, w.b), 6); }],
    h: ['In an isosceles right triangle the two legs are equal, so the area of a cross section is ½ × (leg)². The leg is the height of the line at x.', 'Read two points of the line to write its equation, then integrate the area across the base.'],
    s: 'Read from the figure: the line falls from (0, 6) to (3, 0), so y = 6 − 2x, and the base runs from x = 0 to x = 3. Each leg is 6 − 2x, so A(x) = ½(6 − 2x)². V = ∫₀³ ½(6 − 2x)² dx = ½ × [−(6 − 2x)³/6]₀³ = ½ × 36 = 18.',
  },
  {
    t: 'volume with triangles whose base is the gap between two lines', d: 3, need: 'calc',
    spec: between('x/2 + 2', '-x/2 + 2', 0, 6, [0, 7], [-2, 6]),
    alt: 'The shaded region is a triangle that opens to the right: it lies between a rising line and a falling line that start from the same point on the y-axis, and it ends at a vertical boundary.',
    q: 'The shaded region between the two lines shown is the base of a solid. Every cross section of the solid perpendicular to the x-axis is a triangle whose base runs across the shaded region, from the lower line up to the upper line, and whose height is equal to its base. What is the volume of the solid?',
    n: '36',
    calc: ['∫ ½·b(x)² dx over the spec\'s region, b the gap between its two lines', (c) => { const w = widthOf(c); return round(integ((x) => 0.5 * w.d(x) ** 2, w.a, w.b), 6); }],
    h: ['At each x the base of the triangle is the vertical gap between the two lines: the upper height minus the lower height. Read the two lines from the grid.', 'With the height equal to the base, the area of a cross section is ½ × (base)². Integrate it from the left end of the region to the right end.'],
    s: 'Read from the figure: the upper line rises from (0, 2) to (6, 5), so y = x/2 + 2; the lower line falls from (0, 2) to (6, −1), so y = −x/2 + 2. The base at x is (x/2 + 2) − (−x/2 + 2) = x, for 0 ≤ x ≤ 6. A(x) = ½ × x × x = x²/2. V = ∫₀⁶ x²/2 dx = 216/6 = 36.',
  },
]);

// ── Definite Integrals as Accumulation (pack 107) ───────────────────────────

G('3a76002e.lo-3', 'Signed areas of triangles, rectangles and trapezoids', [
  {
    t: 'an integral over a stretch that lies wholly below the axis', d: 2, need: 'calc',
    spec: fgraph({ xRange: [0, 6], yRange: [-3, 3], curves: plin([[0, 2], [2, -2], [4, -2], [6, 2]]) }),
    alt: 'A graph in three straight pieces: it falls from above the x-axis to below it, runs level below the axis, and rises back above the axis.',
    q: 'The graph of a function f is shown for 0 ≤ x ≤ 6. Using the areas of geometric shapes, what is the value of the definite integral of f from x = 1 to x = 5?',
    n: '-6',
    calc: ['∫₁⁵ of the drawn pieces of the spec, split where they join', (c) => round(integ(pwOf(c), 1, 5, knotsOf(c)), 6)],
    h: ['Between x = 1 and x = 5 the region between the graph and the x-axis splits into two triangles and a rectangle.', 'A region that lies below the x-axis counts as negative in a definite integral.'],
    s: 'Read from the graph: from x = 1 to x = 5 the graph lies on or below the x-axis. The region is a triangle (base 1, height 2, area 1), a rectangle (width 2, height 2, area 4) and another triangle (area 1): total area 6. All of it is below the axis, so the integral is −6.',
  },
  {
    t: 'the upper limit at which the integral returns to zero', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 8], yRange: [-3, 3], curves: plin([[0, 2], [2, 2], [4, -2], [8, -2]]) }),
    alt: 'A graph in three straight pieces: level above the x-axis, then falling through the axis, then level below the axis out to the right-hand edge.',
    q: 'The graph of a function f is shown for 0 ≤ x ≤ 8. For which value of k, with 0 < k ≤ 8, is the definite integral of f from x = 0 to x = k equal to 0?',
    n: '6',
    calc: ['the only k in (0, 8] at which ∫₀ᵏ of the drawn pieces is 0 (scan in steps of 0.001)', (c) => {
      const f = pwOf(c); const kn = knotsOf(c); const hits: number[] = [];
      for (let i = 1; i <= 8000; i++) { const k = i / 1000; if (Math.abs(integ(f, 0, k, kn)) < 1e-6) hits.push(k); }
      if (hits.length !== 1) throw new Error(`${hits.length} values of k`);
      return hits[0];
    }],
    h: ['Work out the area above the x-axis first: a rectangle and a triangle.', 'The integral is zero when the area below the x-axis, counted from the point where the graph passes through the axis, has grown to match the area above it.'],
    s: 'Read from the graph: f = 2 from x = 0 to x = 2, then falls in a straight line to −2 at x = 4, passing through the axis at x = 3, and stays at −2. Area above the axis: rectangle 2 × 2 = 4 plus triangle ½ × 1 × 2 = 1, total 5. Below the axis: the triangle from x = 3 to x = 4 has area 1, and after x = 4 each unit of x adds 2. The integral is zero when 1 + 2(k − 4) = 5, so k = 6.',
  },
  {
    t: 'the false statement about integrals over four intervals', d: 3, need: 'reason',
    spec: fgraph({ xRange: [0, 8], yRange: [-3, 5], curves: plin([[0, 0], [2, 4], [4, 0], [6, -2], [8, 0]]) }),
    alt: 'A zigzag graph in four straight pieces: up from the origin to a peak, down through the x-axis to a low point, and back up to the x-axis at the right-hand edge.',
    q: 'The graph of a function f is shown for 0 ≤ x ≤ 8. Which statement about definite integrals of f is FALSE?',
    o: [
      ['The integral of f from x = 0 to x = 8 equals 12', 'correct'],
      ['The integral of f from x = 0 to x = 4 equals 8', 'slips in the area of the triangle above the axis'],
      ['The integral of f from x = 4 to x = 8 equals −4', 'does not count the area below the axis as negative'],
      ['The integral of f from x = 2 to x = 6 equals 2', 'does not combine a positive and a negative part'],
    ],
    holds: falseOne('each integral computed from the drawn pieces of the spec', (() => {
      const I = (a: number, b: number) => (c: Ctx) => integ(pwOf(c), a, b, knotsOf(c));
      return [(c) => near(I(0, 8)(c), 12, 1e-6), (c) => near(I(0, 4)(c), 8, 1e-6), (c) => near(I(4, 8)(c), -4, 1e-6), (c) => near(I(2, 6)(c), 2, 1e-6)];
    })()),
    h: ['Find the area of the triangle above the x-axis and the area of the triangle below it; halves of each are needed for some of the intervals.', 'In a definite integral an area below the x-axis is subtracted, not added.'],
    s: 'Read from the graph: above the axis, from x = 0 to x = 4, a triangle with base 4 and height 4, area 8; below the axis, from x = 4 to x = 8, a triangle with base 4 and height 2, area 4, which counts as −4. So the integral from 0 to 4 is 8 and from 4 to 8 is −4. From 2 to 6: half of the upper triangle, 4, minus half of the lower one, 2, gives 2. From 0 to 8 the integral is 8 − 4 = 4, not 12: adding the two areas without regard to sign gives 12. That statement is the false one.',
  },
  {
    t: 'the greatest value of the integral as its upper limit moves', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 8], yRange: [-3, 4], curves: plin([[0, 1], [2, 3], [7, -2], [8, -2]]) }),
    alt: 'A graph in three straight pieces: it rises from a point on the y-axis, then falls in one long straight piece through the x-axis, then runs level below the axis.',
    q: 'The graph of a function f is shown for 0 ≤ x ≤ 8. As c goes from 0 to 8, what is the greatest value taken by the definite integral of f from x = 0 to x = c?',
    n: '8.5',
    calc: ['the greatest of ∫₀ᶜ of the drawn pieces over c = 0, 0.001, …, 8', (c) => { const f = pwOf(c); const kn = knotsOf(c); let best = 0; for (let i = 1; i <= 8000; i++) best = Math.max(best, integ(f, 0, i / 1000, kn)); return round(best, 4); }],
    h: ['The integral from 0 to c keeps growing for as long as the graph is above the x-axis, and shrinks once the graph is below it.', 'Find where the graph passes through the x-axis, and add up the areas of the shapes between the graph and the axis as far as that point.'],
    s: 'Read from the graph: f rises from 1 at x = 0 to 3 at x = 2, then falls in a straight line, passing through the x-axis at x = 5. The integral from 0 to c is greatest at c = 5, where f changes from positive to negative. Area from 0 to 2: a trapezoid, ½(1 + 3)(2) = 4. Area from 2 to 5: a triangle, ½(3)(3) = 4.5. Greatest value = 4 + 4.5 = 8.5.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// ALGEBRA II
// ════════════════════════════════════════════════════════════════════════════

// ── Amplitude, Period, Midline in Trig (pack 000) ───────────────────────────

G('048bb219.lo-6', 'The midline found, used and worked back to', [
  {
    t: 'how often a wave passes through its midline', d: 2, need: 'calc',
    spec: fgraph({ xRange: [0, 360], yRange: [-6, 2], xStep: 90, curves: [{ expr: '3*cos(2*x*pi/180) - 2' }] }),
    alt: 'A wave drawn across the whole width of the grid, starting and ending at a highest point, with the horizontal axis numbered in degrees. Most of the wave lies below the x-axis.',
    q: 'The curve shown is a cosine wave, drawn for 0° ≤ x ≤ 360°. At how many points in this window does the curve pass through its midline?',
    n: '4',
    calc: ['midline = (max + min) ÷ 2 from curve_extremum, then the sign changes of f − midline across the window', (c) => {
      const mid = (c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) + c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' })) / 2;
      const f = fOf(c); const [a, b] = c.p.xRange as number[]; let n = 0;
      for (let i = 0; i < 7200; i++) { const x0 = a + ((b - a) * i) / 7200; const x1 = a + ((b - a) * (i + 1)) / 7200; if ((f(x0) - mid) * (f(x1) - mid) < 0) n++; }
      return n;
    }],
    h: ['Read the greatest and the least value of the curve; the midline is the horizontal line halfway between them.', 'Follow the curve across the window and count each time it passes through that height, on the way down and on the way up.'],
    s: 'Read from the graph: the curve has maximum 1 and minimum −5, so its midline is y = (1 + (−5)) ÷ 2 = −2. In the window the curve completes two full cycles, and in each cycle it passes through y = −2 once on the way down and once on the way up: 4 points in all.',
  },
  {
    t: 'midline of a wave of which only a part with a maximum is drawn', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 180], yRange: [-4, 6], xStep: 30, curves: [{ expr: '4*sin(x*pi/180) + 1', domain: [30, 150] }] }),
    alt: 'An arch-shaped piece of a wave, with a dot at each end, lying wholly above the x-axis; the horizontal axis is numbered in degrees.',
    q: 'Only part of a sine wave is drawn on the grid shown: the part includes one maximum of the wave but no minimum. The amplitude of the wave is 4. The midline of the wave is the line y = k. What is the value of k?',
    n: '1',
    calc: ['(the maximum of the drawn curve, curve_extremum) − 4', (c) => c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) - 4],
    h: ['Read the greatest value the curve reaches on the grid.', 'The midline of a wave lies below its maximum by exactly the amplitude.'],
    s: 'Read from the graph: the highest point of the curve is at y = 5. Midline = maximum − amplitude = 5 − 4 = 1, so k = 1. The lowest value drawn, 3, is not a minimum of the wave (the curve simply stops there), so (max + min) ÷ 2 cannot be used on the part shown.',
  },
  {
    t: 'the false statement about the midlines of two waves', d: 3, need: 'reason',
    spec: fgraph({ xRange: [0, 360], yRange: [-3, 5], xStep: 90, curves: [{ expr: '3*sin(x*pi/180) + 1', label: 'S' }, { expr: 'cos(x*pi/180) + 1', label: 'T' }] }),
    alt: 'Two waves, S and T, over one full cycle each, with the horizontal axis numbered in degrees. S swings much further up and down than T.',
    q: 'Two waves, S and T, are shown. Which statement is FALSE?',
    o: [
      ['The midline of S is higher than the midline of T', 'correct'],
      ['The midline of S is the line y = 1', 'does not take the midline halfway between the maximum and the minimum of S'],
      ['The maximum of T is 1 unit above the midline of T', 'misreads the maximum or the minimum of T'],
      ['The minimum of S is 3 units below the midline of S', 'misreads the minimum of S'],
    ],
    holds: falseOne('midline = (max + min) ÷ 2 for each curve, from curve_extremum', (() => {
      const ex = (c: Ctx, curve: number, which: 'max' | 'min') => c.num('curve_extremum', { curve, which, want: 'value' });
      const mid = (c: Ctx, curve: number) => (ex(c, curve, 'max') + ex(c, curve, 'min')) / 2;
      return [(c) => mid(c, 0) > mid(c, 1) + 1e-9, (c) => near(mid(c, 0), 1), (c) => near(ex(c, 1, 'max') - mid(c, 1), 1), (c) => near(mid(c, 0) - ex(c, 0, 'min'), 3)];
    })()),
    h: ['For each wave, read its maximum and its minimum and take the value halfway between them.', 'A wave that reaches higher does not have to have a higher midline: it may also reach lower.'],
    s: 'Read from the graph: S has maximum 4 and minimum −2, so its midline is y = (4 + (−2)) ÷ 2 = 1, and its minimum is 3 below that. T has maximum 2 and minimum 0, so its midline is y = (2 + 0) ÷ 2 = 1, and its maximum is 1 above that. The two midlines are the same line, y = 1, so the statement that the midline of S is higher is false.',
  },
  {
    t: 'midline after the maximum and the minimum are changed by different amounts', d: 3, need: 'calc',
    spec: pgraph('Time (h)', 'Temperature (°C)', [0, 24], 4, [10, 26], 2, [{ expr: '18 - 6*cos(pi*(x - 4)/12)' }]),
    alt: 'One full cycle of a wave of temperature against time over a day: lowest early in the day and highest in the afternoon.',
    q: 'The graph shows the air temperature in a town over one day, modelled by a cosine wave. In a second town, the highest temperature of the day is 2 °C higher than in the first town and the lowest temperature is 6 °C lower. What is the midline of the temperature wave for the second town, in °C?',
    n: '16',
    calc: ['((max + 2) + (min − 6)) ÷ 2 with max and min from curve_extremum', (c) => (c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }) + 2 + c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' }) - 6) / 2],
    h: ['Read the highest and the lowest temperature from the graph, then work out the highest and the lowest temperature in the second town.', 'The midline is halfway between the maximum and the minimum: add the two and halve the sum.'],
    s: 'Read from the graph: the temperature in the first town has maximum 24 °C and minimum 12 °C. In the second town the maximum is 24 + 2 = 26 °C and the minimum is 12 − 6 = 6 °C. Midline = (26 + 6) ÷ 2 = 16 °C.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP CHEMISTRY
// ════════════════════════════════════════════════════════════════════════════

// ── Collision Theory and Activation Energy (pack 152) ───────────────────────

G('27b58964.lo-2', 'The barrier measured from the reactants, not from zero', [
  {
    t: 'activation energy when the reactants are not at zero', d: 2, need: 'calc',
    spec: rc({ reactantsEnergy: 40, productsEnergy: 20, activationEnergies: [50] }),
    alt: 'One energy curve that rises from the reactant level over a single peak and comes down to a product level a little below the reactants; both levels are above zero.',
    q: 'The energy profile of a reaction is shown. How much energy, in kJ/mol, must the reactants gain to reach the top of the energy barrier?',
    n: '50',
    ck: ['rc_activation_energy', { curve: 0, direction: 'forward' }],
    h: ['Read two energies from the axis: the level of the reactants and the top of the peak.', 'The energy the reactants must gain is the difference between those two readings, not the height of the peak above zero.'],
    s: 'Read from the diagram: the reactants are at 40 kJ/mol and the top of the peak is at 90 kJ/mol. The energy the reactants must gain, the activation energy, is 90 − 40 = 50 kJ/mol.',
  },
  {
    t: 'peak of a catalysed pathway with half the activation energy', d: 3, need: 'calc',
    spec: rc({ reactantsEnergy: 20, productsEnergy: -20, activationEnergies: [80] }),
    alt: 'One energy curve that rises from a reactant level above zero over a single high peak and comes down to a product level below zero.',
    q: 'The energy profile of an uncatalysed reaction is shown. A catalyst provides a pathway between the same reactants and products whose activation energy is half that of the pathway shown. What is the energy at the top of the peak of the catalysed pathway, in kJ/mol?',
    n: '60',
    calc: ['reactant level + ½ × rc_activation_energy, the reactant level being rc_peak_energy − rc_activation_energy', (c) => { const ea = c.num('rc_activation_energy', { curve: 0, direction: 'forward' }); const r = c.num('rc_peak_energy', { curve: 0 }) - ea; return r + ea / 2; }],
    h: ['Find the activation energy of the pathway shown: the top of the peak minus the level of the reactants.', 'Halve that activation energy, then measure the new barrier upward from the level of the reactants, which a catalyst does not change.'],
    s: 'Read from the diagram: the reactants are at 20 kJ/mol and the peak is at 100 kJ/mol, so the activation energy is 100 − 20 = 80 kJ/mol. The catalysed pathway has activation energy 80 ÷ 2 = 40 kJ/mol, measured from the same reactant level, so its peak is at 20 + 40 = 60 kJ/mol. Halving the peak energy itself, to 50 kJ/mol, would be wrong: activation energy is measured from the reactants, not from zero.',
  },
  {
    t: 'which of two pathways a collision of stated energy can follow', d: 3, need: 'reason',
    spec: rc({ reactantsEnergy: 40, productsEnergy: 0, activationEnergies: [80, 40], curveLabels: ['Path X', 'Path Y'] }),
    alt: 'Two energy curves, Path X and Path Y, between the same reactant level and the same lower product level; the peak of Path X is the higher of the two.',
    q: 'The diagram shows two pathways, X and Y, for the same reaction. A collision between reactant molecules supplies 60 kJ/mol of energy. Along which pathway can this collision lead to products?',
    o: [
      ['Path Y only', 'correct'],
      ['Neither path', 'reads the peak energies, 120 and 80 kJ/mol, as the activation energies'],
      ['Both paths', 'compares the collision energy with the overall energy change of the reaction, not with the barrier'],
      ['Path X only', 'takes the higher peak to be the pathway that is easier to follow'],
    ],
    holds: ['a pathway can be followed when its rc_activation_energy is at most 60 kJ/mol: the set of such pathways is the one the option names', (() => {
      const can = (c: Ctx) => [0, 1].map((i) => c.num('rc_activation_energy', { curve: i, direction: 'forward' }) <= 60);
      return [[false, true], [false, false], [true, true], [true, false]].map((v) => (c: Ctx) => JSON.stringify(can(c)) === JSON.stringify(v));
    })()],
    h: ['For each pathway, find the activation energy: the top of its peak minus the level of the reactants.', 'A collision can lead to products only if it supplies at least the activation energy of the pathway.'],
    s: 'Read from the diagram: the reactants are at 40 kJ/mol; the peak of Path X is at 120 kJ/mol and the peak of Path Y is at 80 kJ/mol. The activation energies are 120 − 40 = 80 kJ/mol for X and 80 − 40 = 40 kJ/mol for Y. A collision that supplies 60 kJ/mol clears the 40 kJ/mol barrier but not the 80 kJ/mol one: Path Y only.',
  },
]);

G('27b58964.lo-6', 'The sign and size of ΔH, forwards, backwards and for a second reaction', [
  {
    t: 'classification and ΔH when the reactants are not at zero', d: 2, need: 'reason',
    spec: rc({ reactantsEnergy: 60, productsEnergy: 20, activationEnergies: [60] }),
    alt: 'One energy curve that rises from the reactant level over a single peak and comes down to a product level; both levels are above zero and they are at different heights.',
    q: 'The energy profile of a reaction is shown. Which description of the reaction is correct?',
    o: [
      ['Exothermic, with ΔH = −40 kJ/mol', 'correct'],
      ['Endothermic, with ΔH = +40 kJ/mol', 'subtracts the products from the reactants, or reads the two levels the wrong way round'],
      ['Endothermic, with ΔH = +60 kJ/mol', 'takes the climb from the reactants to the peak as the enthalpy change'],
      ['Exothermic, with ΔH = −100 kJ/mol', 'measures the drop from the peak to the products'],
    ],
    holds: ['rc_direction and rc_delta_h on the spec: the option holds when both are as it states', (() => {
      const is = (dir: string, dh: number) => (c: Ctx) => c.txt('rc_direction') === dir && near(c.num('rc_delta_h'), dh);
      return [is('exothermic', -40), is('endothermic', 40), is('endothermic', 60), is('exothermic', -100)];
    })()],
    h: ['Read the energy of the reactants and the energy of the products from the axis. The peak is not needed for ΔH.', 'ΔH = energy of products − energy of reactants; its sign tells you whether the reaction is exothermic or endothermic.'],
    s: 'Read from the diagram: the reactants are at 60 kJ/mol and the products at 20 kJ/mol. ΔH = 20 − 60 = −40 kJ/mol. The products are lower than the reactants and ΔH is negative, so the reaction is exothermic.',
  },
  {
    t: 'the false statement about a reaction and its reverse', d: 3, need: 'reason',
    spec: rc({ reactantsEnergy: 80, productsEnergy: 20, activationEnergies: [40] }),
    alt: 'One energy curve that goes from the reactant level over a single peak to a product level; both levels are above zero and they are at different heights, and the peak is higher than both.',
    q: 'The energy profile of a reaction is shown. Which statement is FALSE?',
    o: [
      ['The reaction shown absorbs 40 kJ/mol of energy overall', 'correct'],
      ['The activation energy of the reaction shown is 40 kJ/mol', 'measures the barrier from zero, or from the products'],
      ['ΔH for the reverse reaction is +60 kJ/mol', 'does not change the sign of ΔH for the reverse reaction'],
      ['The reverse reaction is endothermic', 'takes the reverse of a reaction to have the same classification'],
    ],
    holds: falseOne('rc_delta_h and rc_activation_energy on the spec (ΔH of the reverse reaction is the negative of rc_delta_h)', [
      (c) => near(c.num('rc_delta_h'), 40),
      (c) => near(c.num('rc_activation_energy', { curve: 0, direction: 'forward' }), 40),
      (c) => near(-c.num('rc_delta_h'), 60),
      (c) => -c.num('rc_delta_h') > 0,
    ]),
    h: ['Find ΔH for the reaction shown from two readings: the energy of the products minus the energy of the reactants. The climb from the reactants to the peak is a different quantity.', 'For the reverse reaction the reactants and products change places, so ΔH keeps its size and changes its sign.'],
    s: 'Read from the diagram: the reactants are at 80 kJ/mol, the peak at 120 kJ/mol and the products at 20 kJ/mol. ΔH = 20 − 80 = −60 kJ/mol: the reaction releases 60 kJ/mol overall and is exothermic. The climb from the reactants to the peak, 120 − 80 = 40 kJ/mol, is the activation energy. The reverse reaction goes from 20 up to 80 kJ/mol, so its ΔH is +60 kJ/mol and it is endothermic. The statement that the reaction absorbs 40 kJ/mol overall takes the activation energy for the overall change, and it is the false one.',
  },
  {
    t: 'product level of an endothermic reaction with ΔH of the same size', d: 3, need: 'calc',
    spec: rc({ reactantsEnergy: 20, productsEnergy: -40, activationEnergies: [80] }),
    alt: 'One energy curve that rises from the reactant level over a single peak and comes down to a product level on the other side of zero from the reactants.',
    q: 'The energy profile of a reaction is shown. A second reaction starts from reactants at the same energy as the reactants shown. It is endothermic, and its enthalpy change has the same size as that of the reaction shown. At what energy, in kJ/mol, are the products of the second reaction?',
    n: '80',
    calc: ['reactant level + |rc_delta_h|, the reactant level being rc_peak_energy − rc_activation_energy', (c) => c.num('rc_peak_energy', { curve: 0 }) - c.num('rc_activation_energy', { curve: 0, direction: 'forward' }) + Math.abs(c.num('rc_delta_h'))],
    h: ['Find ΔH for the reaction shown: the energy of the products minus the energy of the reactants.', 'An endothermic reaction has its products ABOVE its reactants. Measure the same size of change upward from the reactant level.'],
    s: 'Read from the diagram: the reactants are at 20 kJ/mol and the products at −40 kJ/mol, so ΔH = −40 − 20 = −60 kJ/mol (exothermic). The second reaction is endothermic with ΔH = +60 kJ/mol, so its products lie 60 kJ/mol above its reactants: 20 + 60 = 80 kJ/mol.',
  },
]);

// ── Acid-Base Titration Curves (pack 164) ───────────────────────────────────

G('500ae70f.lo-4', 'What the start, the buffer region and the steep section say', [
  {
    t: 'what the flask held, from the shape of a falling curve', d: 2, need: 'reason',
    spec: titr({ type: 'weak_base', concentration: 0.12, volume: 25, pKb: 4.2 }, 0.1, 50),
    alt: 'A titration curve of pH against the volume of titrant added, drawn as one smooth line across the whole grid with a single steep section.',
    q: 'The curve shown was recorded as a titrant was added from a burette to a solution in a flask. What did the flask contain at the start?',
    o: [
      ['A weak base', 'correct'],
      ['A strong base', 'does not use the sloping buffer region before the steep section'],
      ['A weak acid', 'does not read the starting pH, which is above 7'],
      ['A strong acid', 'reads neither the starting pH nor the buffer region'],
    ],
    holds: ['titration_analyte on the spec: the option holds when it names that analyte', ['weak base', 'strong base', 'weak acid', 'strong acid'].map((v) => (c: Ctx) => c.txt('titration_analyte') === v)],
    h: ['Look at where the curve starts: a starting pH above 7 means that a base is in the flask, and one below 7 that an acid is.', 'Then look at the stretch before the steep section. A strong acid or base gives an almost level start and a tall steep section; a weak one gives a sloping buffer region and a shorter steep section.'],
    s: 'Read from the curve: the pH starts between 11 and 12, so the flask holds a base, and the pH falls as the titrant, an acid, is added. Before the steep section the curve slopes down through a buffer region, and the steep section is shorter than a strong base would give and lies mostly below pH 7. Those are the marks of a weak base titrated with a strong acid.',
  },
  {
    t: 'how the curve changes when the acid shown is replaced by HCl', d: 3, need: 'reason',
    spec: titr({ type: 'weak_acid', concentration: 0.1, volume: 25, pKa: 4.8 }, 0.1, 50),
    alt: 'A titration curve of pH against the volume of titrant added, drawn as one smooth rising line across the whole grid with a single steep section.',
    q: 'The curve shown is for the titration of 25.0 mL of a 0.10 M acid with 0.10 M NaOH. The titration is then repeated with 25.0 mL of 0.10 M HCl in the flask. How does the second curve differ from the one shown?',
    o: [
      ['It starts at a lower pH and its steep section is taller, at the same volume', 'correct'],
      ['It starts at a lower pH and its steep section comes at a smaller volume', 'thinks a stronger acid of the same concentration needs less base'],
      ['It starts at a higher pH and its steep section is shorter, at the same volume', 'takes the acid shown to be the stronger of the two'],
      ['It does not differ: the two curves are the same', 'takes the acid shown to be a strong acid'],
    ],
    holds: ['on the spec: the analyte (titration_analyte), its starting pH from Ka and concentration against pH 1 for 0.10 M HCl, and the equivalence volumes c·V ÷ c(titrant) of both', (() => {
      const facts = (c: Ctx) => {
        const a = c.p.analyte as P; const conc = a.concentration as number; const weak = c.txt('titration_analyte') === 'weak acid';
        const ph0 = weak ? -Math.log10(Math.sqrt(10 ** -(a.pKa as number) * conc)) : -Math.log10(conc);
        const vEq = c.num('titration_equivalence_volume'); const vHcl = (0.1 * 25) / (c.p.titrantConcentration as number);
        return { weak, lower: 1 < ph0 - 0.5, higher: 1 > ph0 + 0.5, sameV: near(vEq, vHcl), smallerV: vHcl < vEq - 1e-9 };
      };
      return [
        (c) => { const f = facts(c); return f.weak && f.lower && f.sameV; },
        (c) => { const f = facts(c); return f.lower && f.smallerV; },
        (c) => { const f = facts(c); return f.higher && f.sameV; },
        (c) => { const f = facts(c); return !f.weak && !f.lower && !f.higher && f.sameV; },
      ];
    })()],
    h: ['Decide from the curve shown whether its acid is strong or weak: read the starting pH and look for a buffer region before the steep section. A 0.10 M strong acid starts at pH 1.', 'Both flasks hold the same number of moles of acid. Think about what that fixes on the curve, and about what the strength of the acid changes.'],
    s: 'Read from the curve: it starts near pH 3, not pH 1, and it has a gently rising buffer region before the steep section, so the acid shown is weak. 0.10 M HCl is fully ionised and starts at pH 1, which is lower. Both flasks hold 25.0 mL × 0.10 M = 2.5 mmol of acid, so both need 25 mL of the NaOH: the steep section stays at the same volume. With no buffer region, the pH of the HCl curve is still low just before equivalence, so its steep section is taller.',
  },
  {
    t: 'equivalence volume after the titrant is made twice as concentrated', d: 3, need: 'calc',
    spec: titr({ type: 'strong_base', concentration: 0.15, volume: 20 }, 0.1, 50),
    alt: 'A titration curve of pH against the volume of titrant added, drawn as one smooth falling line across the whole grid with a single tall steep section.',
    q: 'The curve shown was recorded when a sample of a base in a flask was titrated with an acid. The titration is repeated with an identical sample of the base, but with the acid at twice the concentration. How many milliliters of acid are now needed to reach the equivalence point?',
    n: '15',
    calc: ['titration_equivalence_volume ÷ 2', (c) => c.num('titration_equivalence_volume') / 2],
    h: ['Read the volume at the steep section of the curve: that is the volume of the original acid needed.', 'The number of moles of acid needed is fixed by the sample. Work out what volume of the more concentrated acid holds that many moles.'],
    s: 'Read from the curve: the steep section is at 30 mL, so the sample is neutralised by 30 mL of the original acid. The identical sample needs the same number of moles of acid. At twice the concentration those moles are held in half the volume: 30 ÷ 2 = 15 mL.',
  },
]);

// ── Integrated Rate Laws and Half-Life (pack 182) ───────────────────────────

G('cc23c103.lo-2', 'Which plot is straight, and what its slope gives', [
  {
    t: 'order from a plot of the concentration itself', d: 2, need: 'reason',
    spec: scatter([[10, 0.8], [20, 0.6], [30, 0.4], [40, 0.2]], { xRange: [0, 50], yRange: [0, 1], xStep: 10, yStep: 0.2, xLabel: 'Time (s)', yLabel: '[A] (M)', trendLine: true }),
    alt: 'Four data points with a trend line drawn through them, falling from left to right. The vertical axis is the concentration of A and the horizontal axis is time.',
    q: 'For the reaction A → products, the concentration of A was measured at intervals and plotted against time, with the trend line shown. What is the order of the reaction with respect to A?',
    o: [
      ['Zero order', 'correct'],
      ['First order', 'takes every falling concentration to be an exponential decay'],
      ['Second order', 'matches the straight line with the plot of 1/[A] against time'],
      ['Third order', 'guesses beyond the three orders that the linear plots distinguish'],
    ],
    holds: ['the spec\'s points tested for a straight line as [A], ln[A] and 1/[A] against time; the plotted quantity is [A] (the spec\'s yLabel)', (() => {
      const order = (c: Ctx) => { if (c.p.yLabel !== '[A] (M)') throw new Error('the plot is not of [A]'); const d = dotsOf(c); return straight(d) ? 'zero' : straight(d, Math.log) ? 'first' : straight(d, (y) => 1 / y) ? 'second' : 'other'; };
      return ['zero', 'first', 'second', 'third'].map((v) => (c: Ctx) => order(c) === v);
    })()],
    h: ['Check which quantity is on the vertical axis: [A] itself, ln[A] or 1/[A].', 'Each order gives a straight line for just one of those three plots. Decide whether the plotted points lie on a straight line.'],
    s: 'Read from the graph: the vertical axis is [A] itself, and the points (10, 0.8), (20, 0.6), (30, 0.4) and (40, 0.2) lie on a straight line: [A] falls by 0.2 M every 10 s. A straight line for [A] against time means that the rate does not depend on [A]: the reaction is zero order in A.',
  },
  {
    t: 'order by elimination from a curved concentration plot and a statement about ln[A]', d: 3, need: 'reason',
    spec: pgraph('Time (s)', '[A] (M)', [0, 10], 2, [0, 1], 0.2, [{ expr: '1/(1 + 0.5*x)' }]),
    alt: 'One smooth line showing the concentration of A against time, starting at the top of the vertical axis and falling all the way across the grid.',
    q: 'The order of the reaction A → products with respect to A is known to be 0, 1 or 2. The graph shows [A] plotted against time for one run. For the same run, a plot of ln[A] against time is not a straight line. What is the order of the reaction with respect to A?',
    o: [
      ['Second order', 'correct'],
      ['Zero order', 'does not use the shape of the [A] plot'],
      ['First order', 'takes a falling curve of [A] to mean first order, against the statement about the ln[A] plot'],
      ['It cannot be decided without a plot of 1/[A]', 'does not use the fact that the order is one of only three'],
    ],
    holds: ['the spec\'s curve sampled at t = 0, 2, 4, 6, 8, 10 and tested for a straight line as [A], ln[A] and 1/[A]: not zero order when [A] is curved, not first order when ln[A] is curved (as the stem says), so second — confirmed by 1/[A] being straight', (() => {
      const order = (c: Ctx) => { const f = fOf(c); const d = [0, 2, 4, 6, 8, 10].map((t) => [t, f(t)]); if (straight(d, Math.log)) throw new Error('ln[A] is straight: the stem is wrong'); return straight(d) ? 'zero' : straight(d, (y) => 1 / y) ? 'second' : 'undecided'; };
      return ['second', 'zero', 'first', 'undecided'].map((v) => (c: Ctx) => order(c) === v);
    })()],
    h: ['An order of 0 gives a straight line for [A] against time, an order of 1 for ln[A] against time, and an order of 2 for 1/[A] against time.', 'Use the graph to rule one order in or out, and the statement about the ln[A] plot to rule another in or out.'],
    s: 'Read from the graph: [A] against time is a curve, not a straight line ([A] falls from 1.0 M to 0.5 M in the first 2 s, but only to 0.2 M by 8 s), so the reaction is not zero order. The ln[A] plot is not a straight line either, so it is not first order. The only order left is second. Check with the graph: 1/[A] is 1, 2 and 5 M⁻¹ at 0, 2 and 8 s, rising by 0.5 M⁻¹ every second, which is a straight line.',
  },
  {
    t: 'order and rate constant from a ln[A] plot', d: 3, need: 'reason',
    spec: scatter([[10, -0.5], [20, -1], [30, -1.5], [40, -2]], { xRange: [0, 50], yRange: [-2.5, 0], xStep: 10, yStep: 0.5, xLabel: 'Time (s)', yLabel: 'ln[A]', trendLine: true }),
    alt: 'Four data points with a trend line drawn through them, falling from left to right from the top left corner of the grid. The vertical axis is ln[A] and the horizontal axis is time.',
    q: 'For the reaction A → products, ln[A] is plotted against time and the points lie on the trend line shown. Which answer gives the order of the reaction with respect to A and its rate constant k?',
    o: [
      ['First order, k = 0.05 s⁻¹', 'correct'],
      ['First order, k = 0.5 s⁻¹', 'reads the fall of ln[A] over one 10 s grid interval as the fall in one second'],
      ['Second order, k = 0.05 M⁻¹·s⁻¹', 'matches a straight ln[A] plot with the wrong order'],
      ['Zero order, k = 0.05 M·s⁻¹', 'takes any straight falling line to mean zero order'],
    ],
    holds: ['the plotted quantity (the spec\'s yLabel) with its points on a straight line gives the order; k = −trend_slope', (() => {
      const got = (c: Ctx) => { if (!straight(dotsOf(c))) throw new Error('the points are not on a line'); return { order: c.p.yLabel === 'ln[A]' ? 'first' : c.p.yLabel === '[A] (M)' ? 'zero' : 'second', k: -c.num('trend_slope') }; };
      const is = (order: string, k: number) => (c: Ctx) => got(c).order === order && near(got(c).k, k, 1e-6);
      return [is('first', 0.05), is('first', 0.5), is('second', 0.05), is('zero', 0.05)];
    })()],
    h: ['The quantity on the vertical axis that gives a straight line tells you the order.', 'For that order the slope of the line is −k. Find the slope from two points of the line that sit on grid crossings, and mind the scale of the time axis.'],
    s: 'Read from the graph: the vertical axis is ln[A] and the points lie on a straight line, which is the mark of a first-order reaction, ln[A] = ln[A]₀ − kt. The line passes through the plotted points (10, −0.5) and (40, −2.0), so its slope is (−2.0 − (−0.5)) ÷ (40 − 10) = −1.5 ÷ 30 = −0.05 s⁻¹. The slope is −k, so k = 0.05 s⁻¹.',
  },
]);

// ── Photoelectron Spectroscopy Data Interpretation (pack 195) ───────────────

G('f5cf533c.lo-2', 'Binding energies compared along an axis that increases to the left', [
  {
    t: 'difference between the greatest and the least binding energy', d: 2, need: 'calc',
    spec: pes([[39.6, 2], [2.45, 2], [1.4, 3]]),
    alt: 'A photoelectron spectrum with three peaks, one far to the left and two closer together on the right; the binding-energy axis increases to the left.',
    q: 'The photoelectron spectrum of an element is shown. How much greater, in MJ/mol, is the binding energy of the electrons that are held most tightly than the binding energy of the electrons that are held least tightly?',
    n: '38.2',
    calc: ['the greatest minus the least of the spec\'s peak energies', (c) => round(Math.max(...energiesOf(c)) - Math.min(...energiesOf(c)), 6)],
    h: ['The position of a peak along the axis is the binding energy of its electrons. Note which way the axis increases.', 'Pick out the peak with the greatest binding energy and the peak with the least, and subtract.'],
    s: 'Read from the spectrum: the peak furthest to the left, at 39.6 MJ/mol, has the greatest binding energy (the axis increases to the left), so its electrons are held most tightly. The peak furthest to the right, at 1.4 MJ/mol, has the least. Difference = 39.6 − 1.4 = 38.2 MJ/mol.',
  },
  {
    t: 'the false statement about four peaks, three of them comparisons to work out', d: 3, need: 'reason',
    spec: pes([[126, 2], [9.07, 2], [5.31, 6], [0.74, 2]]),
    alt: 'A photoelectron spectrum with four peaks: one far to the left, two close together in the middle, the right-hand one of them the tallest, and one far to the right; the binding-energy axis increases to the left.',
    q: 'The photoelectron spectrum of an element is shown. Which statement is FALSE?',
    o: [
      ['The peak furthest to the right comes from the electrons that are held most tightly', 'correct'],
      ['An electron of the peak furthest to the left needs more than ten times the energy to remove that an electron of any other peak needs', 'does not divide the two largest binding energies'],
      ['The two middle peaks differ less in binding energy than the two peaks furthest to the right', 'does not subtract the printed binding energies'],
      ['Less energy is needed to remove an electron of the peak at 5.31 MJ/mol than one of the peak at 9.07 MJ/mol', 'takes a taller peak to mean a greater binding energy'],
    ],
    holds: falseOne('each statement tested on the spec\'s peak energies, in order from the left (greatest binding energy first)', [
      (c) => { const e = energiesOf(c); return e[e.length - 1] === Math.max(...e); },
      (c) => { const e = energiesOf(c); return e[0] > 10 * Math.max(...e.slice(1)); },
      (c) => { const e = energiesOf(c); return e[1] - e[2] < e[2] - e[3]; },
      (c) => { const e = energiesOf(c); return e.includes(5.31) && e.includes(9.07) && 5.31 < 9.07; },
    ]),
    h: ['The binding energy of a peak is the energy needed to remove one of its electrons; read it from the position of the peak, noting which way the axis increases.', 'Test each statement with the printed binding energies: subtract or divide where a statement compares two peaks.'],
    s: 'Read from the spectrum: the binding energies are 126, 9.07, 5.31 and 0.74 MJ/mol, from left to right; the axis increases to the LEFT. 126 ÷ 9.07 ≈ 13.9, more than ten, so the statement about the peak furthest to the left is true. 9.07 − 5.31 = 3.76 and 5.31 − 0.74 = 4.57, so the two middle peaks do differ less. 5.31 is less than 9.07, so that statement is true as well. The peak furthest to the right has the LOWEST binding energy: its electrons are the easiest to remove, not the most tightly held. That statement is the false one.',
  },
  {
    t: 'where a peak that was left out must lie', d: 3, need: 'reason',
    spec: pes([[104, 2], [3.67, 6], [0.5, 1]]),
    alt: 'A photoelectron spectrum with three peaks, well apart from one another: one on the left, a tall one in the middle and a short one on the right; the binding-energy axis increases to the left.',
    q: 'The photoelectron spectrum shown is that of one element, but one of its peaks has been left out. The electrons of the missing peak are harder to remove than the electrons of exactly two of the peaks shown. Which could be the binding energy of the missing peak?',
    o: [
      ['6.84 MJ/mol', 'correct'],
      ['1.90 MJ/mol', 'reads the axis as increasing to the right, or counts the two peaks from the wrong end'],
      ['0.42 MJ/mol', 'places the missing peak to the right of every peak shown: its electrons would be the easiest of all to remove'],
      ['140 MJ/mol', 'takes "harder to remove" to mean the greatest binding energy of all'],
    ],
    holds: ['the option holds when exactly two of the spec\'s peak energies are below the value it states', [6.84, 1.9, 0.42, 140].map((v) => (c: Ctx) => energiesOf(c).filter((e) => e < v).length === 2)],
    h: ['The position of a peak gives its binding energy: the greater the binding energy, the harder the electrons are to remove.', 'List the binding energies of the peaks shown in order of size, and find the gap in which the missing value must lie.'],
    s: 'Read from the spectrum: the peaks shown are at 104, 3.67 and 0.5 MJ/mol. Electrons that are harder to remove have a greater binding energy. The missing peak is above exactly two of these values, so its binding energy lies between the two largest, 3.67 and 104 MJ/mol. Of the choices only 6.84 MJ/mol does.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS
// ════════════════════════════════════════════════════════════════════════════

// ── Force-Time Graphs and Impulse (pack 200) ────────────────────────────────

G('02fe8c70.lo-3', 'Areas under a force–time graph: added, signed, run backwards, compared', [
  {
    t: 'impulse under a graph that never comes down to zero', d: 2, need: 'calc',
    spec: force([{ points: [[0, 20], [4, 60], [6, 20]] }], [0, 7], [0, 70]),
    alt: 'A force–time graph in two straight pieces, rising to a peak and falling again; it starts and ends above the time axis.',
    q: 'The graph shows the force exerted on a trolley during a push that lasts 6 s. What is the impulse given to the trolley by the push, in N·s?',
    n: '240',
    ck: ['series_area', { series: 0, t1: 0, t2: 6 }],
    h: ['Impulse is the area between the force–time graph and the time axis. Split that area into shapes whose areas you know.', 'Under each sloping piece there is a rectangle with a triangle on top of it.'],
    s: 'Read from the graph: the force rises from 20 N at t = 0 to 60 N at t = 4 s, then falls to 20 N at t = 6 s. Area from 0 to 4 s: rectangle 20 × 4 = 80 plus triangle ½ × 4 × 40 = 80, so 160 N·s. Area from 4 s to 6 s: rectangle 20 × 2 = 40 plus triangle ½ × 2 × 40 = 40, so 80 N·s. Impulse = 160 + 80 = 240 N·s.',
  },
  {
    t: 'net impulse when the force reverses', d: 3, need: 'calc',
    spec: force([{ points: [[0, 40], [2, 40], [4, 0], [6, -20], [8, -20]] }], [0, 9], [-30, 50]),
    alt: 'A force–time graph in four straight pieces: level above the time axis, falling through the axis, and then level below it.',
    q: 'The graph shows the net force on a cart that moves along a straight track; a negative value means that the force points backwards. What is the net impulse on the cart from t = 0 to t = 8 s, in N·s?',
    n: '60',
    ck: ['series_area', { series: 0, t1: 0, t2: 8 }],
    h: ['Find the area above the time axis and the area below it separately, as rectangles and triangles.', 'A force in the negative direction gives a negative impulse: subtract the area below the axis from the area above it.'],
    s: 'Read from the graph: above the axis there is a rectangle, 40 N × 2 s = 80 N·s, and a triangle, ½ × 2 s × 40 N = 40 N·s, total +120 N·s. Below the axis, from t = 4 s, there is a triangle, ½ × 2 s × 20 N = 20 N·s, and a rectangle, 20 N × 2 s = 40 N·s, total −60 N·s. Net impulse = 120 − 60 = 60 N·s.',
  },
  {
    t: 'the time at which a stated impulse has been delivered', d: 3, need: 'calc',
    spec: force([{ points: [[0, 0], [4, 40], [10, 40]] }], [0, 11], [0, 50]),
    alt: 'A force–time graph in two straight pieces: it rises from the origin and then runs level to an end point near the right-hand edge.',
    q: 'The graph shows the force that a motor exerts on a boat during the first 10 s after it is switched on at t = 0. At what time, in seconds, has the motor delivered a total impulse of 200 N·s?',
    n: '7',
    calc: ['the only whole-second time T at which series_area from 0 to T is 200', (c) => { const hits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((T) => near(c.num('series_area', { series: 0, t1: 0, t2: T }), 200)); if (hits.length !== 1) throw new Error(`${hits.length} times`); return hits[0]; }],
    h: ['The impulse delivered up to a time is the area under the graph up to that time. Start with the triangle under the rising part.', 'Once the force is steady, each further second adds a rectangle of the same area. Work out how many of them are still needed.'],
    s: 'Read from the graph: the force rises steadily from 0 to 40 N over the first 4 s and then stays at 40 N. The triangle gives ½ × 4 × 40 = 80 N·s. The remaining 200 − 80 = 120 N·s comes at 40 N·s per second, which takes 120 ÷ 40 = 3 s more. The total reaches 200 N·s at t = 4 + 3 = 7 s.',
  },
  {
    t: 'a short strong push compared with a long weak one', d: 3, need: 'reason',
    spec: force([{ points: [[0, 0], [2, 60], [4, 0]], label: 'P' }, { points: [[0, 20], [8, 20]], label: 'Q' }], [0, 9], [0, 70]),
    alt: 'Two force–time graphs: P rises to a high peak and falls back to zero in the first half of the time shown; Q is a low level line that runs for twice as long.',
    q: 'The graph shows the force exerted on each of two carts, P and Q, while it is pushed. Which cart receives the greater impulse, and by how much?',
    o: [
      ['Cart Q, by 40 N·s', 'correct'],
      ['Cart P, by 40 N·s', 'compares the greatest forces, 60 N and 20 N'],
      ['Cart P, by 80 N·s', 'leaves the ½ out of the area of the triangle'],
      ['Neither: the two impulses are equal', 'slips in one of the two areas'],
    ],
    holds: ['series_area of each line over its whole length: the option holds when the difference is as it states', (() => {
      const diff = (c: Ctx) => c.num('series_area', { series: 1, t1: 0, t2: 8 }) - c.num('series_area', { series: 0, t1: 0, t2: 4 });
      return [40, -40, -80, 0].map((v) => (c: Ctx) => near(diff(c), v));
    })()],
    h: ['The impulse on each cart is the area under its own line: a triangle for one cart, a rectangle for the other.', 'Compare the two areas, not the greatest forces.'],
    s: 'Read from the graph: the force on P rises to 60 N at t = 2 s and is back to zero at t = 4 s, a triangle of area ½ × 4 s × 60 N = 120 N·s. The force on Q is 20 N for 8 s, a rectangle of area 20 N × 8 s = 160 N·s. Cart Q receives the greater impulse, by 160 − 120 = 40 N·s, even though the force on it is never as large.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PRECALCULUS
// ════════════════════════════════════════════════════════════════════════════

// ── Polynomial end behavior and zeros (pack 262) ────────────────────────────

G('181b8129.lo-5', 'End behaviour, zeros and multiplicity read together', [
  {
    t: 'the description that fits a drawn quartic', d: 2, need: 'reason',
    spec: fgraph({ xRange: [-4, 3], yRange: [-5, 4], curves: [{ expr: '(x + 3)*x^2*(x - 2)/4' }] }),
    offGridOk: 'the answer rests on the directions of the two ends and on what the graph does at its three zeros, which are at grid points; the heights of the two valleys are not read',
    alt: 'A smooth curve with three points on the x-axis and two valleys below it; both ends leave the grid.',
    q: 'The graph of a polynomial function f is shown. Which description fits the graph?',
    o: [
      ['Both ends rise; it crosses the x-axis at x = −3 and x = 2 and touches it at x = 0', 'correct'],
      ['Both ends rise; it touches the x-axis at x = −3 and x = 2 and crosses it at x = 0', 'exchanges touching and crossing'],
      ['Both ends fall; it crosses the x-axis at x = −3 and x = 2 and touches it at x = 0', 'reads the two valleys as the end behaviour'],
      ['Both ends fall; it touches the x-axis at x = −3 and x = 2 and crosses it at x = 0', 'reads the valleys as the end behaviour and exchanges touching and crossing'],
    ],
    holds: ['the spec\'s polynomial: the sign of f far to the left and far to the right, and whether it changes sign at each zero', (() => {
      const is = (left: boolean, right: boolean, cross: number[], touch: number[]) => (c: Ctx) => { const f = fOf(c); return f(-50) > 0 === left && f(50) > 0 === right && cross.every((z) => crossesAt(f, z)) && touch.every((z) => !crossesAt(f, z)); };
      return [is(true, true, [-3, 2], [0]), is(true, true, [0], [-3, 2]), is(false, false, [-3, 2], [0]), is(false, false, [0], [-3, 2])];
    })()],
    h: ['Look at the two ends of the graph: does each one rise or fall as it leaves the grid?', 'At each zero, see whether the graph passes through the x-axis to the other side or turns back on the same side.'],
    s: 'Read from the graph: both ends leave the grid upward. At x = −3 and at x = 2 the graph passes through the x-axis from one side to the other (zeros of odd multiplicity). At x = 0 it comes up to the axis and turns back down without passing through (a zero of even multiplicity). So both ends rise, the graph crosses at x = −3 and x = 2, and it touches at x = 0.',
  },
  {
    t: 'least possible degree from touches and crossings', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-4, 5], yRange: [-5, 4], curves: [{ expr: '(x + 2)^2*(x - 1)*(x - 3)^2/12' }] }),
    offGridOk: 'the answer rests on the three zeros, which are at grid points, on what the graph does at each of them, and on the directions of the two ends; the heights of the turning points between the zeros are not read',
    alt: 'A smooth curve with three points on the x-axis, a valley below the axis and a low hump above it; the two ends leave the grid in opposite directions.',
    q: 'The graph of a polynomial function f is shown; f has no zeros other than those in view. What is the least possible degree of f?',
    n: '5',
    calc: ['the zeros of the spec\'s curve (curve_zeros), each counted once where the polynomial changes sign and twice where it does not; the parity of the total is checked against the two ends', (c) => {
      const f = fOf(c); const d = c.run('curve_zeros', { curve: 0, want: 'all' }); const zs = d.kind === 'numbers' ? d.values : [];
      if (zs.length !== 3) throw new Error(`${zs.length} zeros`);
      const deg = sum(zs.map((z) => (crossesAt(f, z) ? 1 : 2)));
      if ((f(-50) > 0 === f(50) > 0) !== (deg % 2 === 0)) throw new Error('the degree does not agree with the ends');
      return deg;
    }],
    h: ['A zero where the graph only touches the x-axis has even multiplicity, so at least two; a zero where the graph passes through the axis has odd multiplicity, so at least one.', 'Add the smallest possible multiplicities of all the zeros, then check that the total agrees with the end behaviour of the graph.'],
    s: 'Read from the graph: the zeros are x = −2, x = 1 and x = 3. The graph touches the x-axis at x = −2 and at x = 3 (even multiplicity, at least 2 each) and passes through it at x = 1 (odd multiplicity, at least 1). The least possible degree is 2 + 1 + 2 = 5. Check: the left end falls and the right end rises, as for an odd degree with a positive leading coefficient.',
  },
  {
    t: 'the feature of a sketch that disagrees with the formula', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 5], yRange: [-5, 4], curves: [{ expr: '-1*(x + 2)^2*(x - 1)*(x - 3)/6' }] }),
    offGridOk: 'the answer rests on the three zeros, which are at grid points, on what the graph does at each of them, and on the directions of the two ends; the heights of the turning points are not read',
    alt: 'A smooth curve with three points on the x-axis, a shallow valley below the axis and a hump above it; both ends leave the grid.',
    q: 'A student sketched the graph of f(x) = (x + 2)²(x − 1)(x − 3), and the sketch is shown. One feature of the sketch does not agree with the formula. Which feature is it?',
    o: [
      ['The directions of the two ends', 'correct'],
      ['The positions of the zeros', 'does not read the zeros from the factors'],
      ['The behaviour at the zero x = −2', 'takes a squared factor to give a crossing'],
      ['The behaviour at the zeros x = 1 and x = 3', 'takes a single factor to give a touch'],
    ],
    holds: ['the drawn polynomial of the spec compared with (x + 2)²(x − 1)(x − 3): the signs far out on both sides, the zeros (curve_zeros), and the change of sign at each zero; the option holds when ITS feature differs', (() => {
      const g = (x: number) => (x + 2) ** 2 * (x - 1) * (x - 3);
      const zerosOf = (c: Ctx) => { const d = c.run('curve_zeros', { curve: 0, want: 'all' }); return d.kind === 'numbers' ? d.values : []; };
      return [
        (c) => { const f = fOf(c); return f(-50) > 0 !== g(-50) > 0 || f(50) > 0 !== g(50) > 0; },
        (c) => JSON.stringify(zerosOf(c)) !== JSON.stringify([-2, 1, 3]),
        (c) => crossesAt(fOf(c), -2) !== crossesAt(g, -2),
        (c) => crossesAt(fOf(c), 1) !== crossesAt(g, 1) || crossesAt(fOf(c), 3) !== crossesAt(g, 3),
      ];
    })()],
    h: ['From the formula, work out three things: the zeros, whether the graph touches or crosses the x-axis at each of them, and the end behaviour from the degree and the sign of the leading coefficient.', 'Then compare each of the three with the sketch.'],
    s: 'From the formula: zeros at x = −2 (multiplicity 2, so the graph touches the axis), x = 1 and x = 3 (multiplicity 1, so it crosses); the degree is 4 and the leading coefficient is positive, so both ends rise. Read from the sketch: the zeros are at −2, 1 and 3, the curve touches the axis at −2 and crosses it at 1 and 3, all as they should be. But both ends of the sketch fall. The end behaviour is the feature that is wrong.',
  },
]);

// ── Function Behavior Analysis (pack 270) ───────────────────────────────────

G('385b98f9.lo-2', 'Peaks and valleys located, reflected and used', [
  {
    t: 'coordinates of the local minimum of a cubic', d: 2, need: 'reason',
    spec: fgraph({ xRange: [-2, 4], yRange: [-4, 4], curves: [{ expr: 'x^3 - 3*x^2 + 2' }] }),
    alt: 'A smooth curve with one peak and one valley; it enters the grid from the bottom on the left and leaves through the top on the right.',
    q: 'The graph of a function f is shown. At which point does f have a local minimum?',
    o: [
      ['(2, −2)', 'correct'],
      ['(0, 2)', 'picks the peak, where f changes from increasing to decreasing'],
      ['(−2, 2)', 'writes the coordinates of the valley in the wrong order'],
      ['(1, 0)', 'picks a point where the falling graph passes through the x-axis'],
    ],
    holds: pick('the one local minimum of the spec\'s curve inside the plot (fine scan)', (c) => { const [a, b] = c.p.xRange as number[]; const m = turnsOf(fOf(c), a, b).filter((t) => t.kind === 'min'); if (m.length !== 1) throw new Error(`${m.length} minima`); return [m[0].x, m[0].y]; }, [[2, -2], [0, 2], [-2, 2], [1, 0]]),
    h: ['A local minimum is the bottom of a valley: the function changes from decreasing to increasing there.', 'Read the coordinates of that point, x first.'],
    s: 'Read from the graph: f increases up to the point (0, 2), decreases from there to the point (2, −2), and then increases again. The function changes from decreasing to increasing at (2, −2), so that is the local minimum. At (0, 2) it changes from increasing to decreasing, which makes that point a local maximum.',
  },
  {
    t: 'local minimum of the reflection of a drawn graph', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-3, 3], yRange: [-4, 4], curves: [{ expr: 'x^3 - 3*x + 1' }] }),
    alt: 'A smooth curve with one peak to the left of the y-axis and one valley to the right of it; it enters the grid from the bottom on the left and leaves through the top on the right.',
    q: 'The graph of a function f is shown. The graph of g is the graph of f reflected in the x-axis, so that g(x) = −f(x). At which point does g have a local minimum?',
    o: [
      ['(−1, −3)', 'correct'],
      ['(1, 1)', 'reflects the valley of f, which becomes a peak of g'],
      ['(−1, 3)', 'gives the peak of f without reflecting it'],
      ['(1, −1)', 'gives the local minimum of f itself'],
    ],
    holds: pick('the one local minimum of −f, f the spec\'s curve (fine scan inside the plot)', (c) => { const f = fOf(c); const [a, b] = c.p.xRange as number[]; const m = turnsOf((x) => -f(x), a, b).filter((t) => t.kind === 'min'); if (m.length !== 1) throw new Error(`${m.length} minima`); return [m[0].x, m[0].y]; }, [[-1, -3], [1, 1], [-1, 3], [1, -1]]),
    h: ['Find the turning points of f on the graph and classify each as a local maximum or a local minimum.', 'Reflecting in the x-axis turns every peak into a valley and every valley into a peak, and changes the sign of each y-coordinate.'],
    s: 'Read from the graph: f has a local maximum at (−1, 3) and a local minimum at (1, −1). Reflecting in the x-axis sends (x, y) to (x, −y) and turns increasing into decreasing. The peak of f at (−1, 3) becomes a valley of g at (−1, −3), where g changes from decreasing to increasing: that is the local minimum of g. The valley of f becomes a peak of g, at (1, 1).',
  },
  {
    t: 'the horizontal line that meets a W-shaped graph three times', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-4, 4], yRange: [-3, 5], curves: [{ expr: 'x^4/4 - 2*x^2 + 2' }] }),
    alt: 'A smooth W-shaped curve with two valleys and a peak between them; both ends leave the grid through the top.',
    q: 'The graph of a function f is shown; beyond the grid both ends of the graph keep rising. A horizontal line y = k meets the graph at exactly three points. What is the value of k?',
    n: '2',
    calc: ['the spec\'s curve has one local maximum between two local minima of equal value, and rises without bound outside them, so a horizontal line meets it three times only at the height of the local maximum', (c) => {
      const f = fOf(c); const t = turnsOf(f, -10, 10); const mx = t.filter((k) => k.kind === 'max'); const mn = t.filter((k) => k.kind === 'min');
      if (mx.length !== 1 || mn.length !== 2 || !near(mn[0].y, mn[1].y, 1e-6) || !(mn[0].y < mx[0].y) || !(f(10) > mx[0].y && f(-10) > mx[0].y)) throw new Error('not a W with level valleys');
      return mx[0].y;
    }],
    h: ['Slide a horizontal line up the graph from below and count the meeting points at each height. The count changes as the line passes a turning point.', 'The count is odd only when the line passes exactly through one particular turning point. Read the height of that point.'],
    s: 'Read from the graph: f has local minimum points at (−2, −2) and (2, −2) and a local maximum point at (0, 2). A horizontal line below y = −2 misses the graph; at y = −2 it meets it at 2 points; between y = −2 and y = 2 it meets it at 4 points; above y = 2 it meets it at 2 points. Only the line through the local maximum, y = 2, meets the graph at exactly three points: it touches the peak and cuts the two outer arms. So k = 2.',
  },
]);

G('385b98f9.lo-3', 'Mirror symmetry, half-turn symmetry, and neither', [
  {
    t: 'a mirror-symmetric graph that is neither even nor odd', d: 2, need: 'reason',
    spec: fgraph({ xRange: [-3, 5], yRange: [-4, 5], curves: [{ expr: '(x - 1)^2 - 3' }] }),
    alt: 'A U-shaped curve opening upward, with its lowest point below the x-axis; both arms leave the grid through the top.',
    q: 'The graph of a function f is shown. Which statement about the symmetry of f is correct?',
    o: [
      ['f is neither even nor odd', 'correct'],
      ['f is even', 'takes any mirror symmetry for symmetry about the y-axis'],
      ['f is odd', 'confuses the two kinds of symmetry'],
      ['f is both even and odd', 'does not test either rule on a point of the graph'],
    ],
    holds: ['f(−x) compared with f(x) and with −f(x) at 400 points of the spec\'s curve', (() => {
      const sym = (c: Ctx) => symOf(fOf(c), 3);
      return [(c) => !sym(c).even && !sym(c).odd, (c) => sym(c).even && !sym(c).odd, (c) => sym(c).odd && !sym(c).even, (c) => sym(c).even && sym(c).odd];
    })()],
    h: ['The graph of an even function is its own mirror image in the y-axis; the graph of an odd function looks the same after a half-turn about the origin.', 'Pick a point of the graph, such as its lowest point, and check whether its mirror image in the y-axis, or its image under the half-turn, is also on the graph.'],
    s: 'Read from the graph: the curve passes through (1, −3) and through (−1, 1). For an even function f(−1) would have to equal f(1) = −3, and for an odd function it would have to equal 3; it is 1, so f is neither. The graph does have a mirror line, but that line is x = 1, not the y-axis.',
  },
  {
    t: 'a point forced by oddness when only half the graph is drawn', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 4], yRange: [-4, 4], curves: [{ expr: 'x^2 - 2*x', domain: [0, 4] }] }),
    alt: 'A curve drawn only to the right of the y-axis: it starts at a dot at the origin, dips below the x-axis, comes back up through it and leaves the grid through the top. The left half of the grid is empty.',
    q: 'The graph shows a function f for x ≥ 0 only. Given that f is an odd function, which of these points must also lie on the graph of f?',
    o: [
      ['(−3, −3)', 'correct'],
      ['(−3, 3)', 'uses the rule for an even function'],
      ['(3, −3)', 'reflects in the x-axis and leaves x unchanged'],
      ['(−1, −1)', 'changes the sign of x but not of y for the point (1, −1)'],
    ],
    holds: ['the odd extension of the spec\'s curve, g(x) = f(x) for x ≥ 0 and −f(−x) for x < 0: the option holds when its point lies on it', (() => {
      const on = (a: number, b: number) => (c: Ctx) => { const f = fOf(c); return near(a >= 0 ? f(a) : -f(-a), b, 1e-9); };
      return [on(-3, -3), on(-3, 3), on(3, -3), on(-1, -1)];
    })()],
    h: ['For an odd function, f(−x) = −f(x): each point (x, y) of the graph has a partner (−x, −y).', 'Read a point of the part shown, then change the sign of BOTH coordinates.'],
    s: 'Read from the graph: the part shown passes through (3, 3) and (1, −1). For an odd function f(−x) = −f(x), so (3, 3) gives the point (−3, −3) and (1, −1) gives the point (−1, 1). Of the points offered, only (−3, −3) must lie on the graph. The point (−3, 3) would be right for an even function.',
  },
  {
    t: 'half-turn symmetry about the origin told from half-turn symmetry about another point', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 4], yRange: [-4, 4], curves: [{ expr: 'x^3/4', label: 'S' }, { expr: 'x^3/8 + 1', label: 'T' }] }),
    alt: 'Two smooth rising curves, S and T, each flattening as it passes the y-axis; they cross each other once, to the right of the y-axis.',
    q: 'Two curves, S and T, are shown. Which of them is the graph of an odd function?',
    o: [
      ['S only', 'correct'],
      ['T only', 'tests the wrong curve at the y-axis'],
      ['Both S and T', 'takes half-turn symmetry about any point to be enough'],
      ['Neither S nor T', 'looks for mirror symmetry in the y-axis'],
    ],
    holds: ['f(−x) compared with −f(x) at 400 points of each of the spec\'s two curves', (() => {
      const odd = (c: Ctx) => [0, 1].map((i) => symOf(fOf(c, i), 4).odd);
      return [[true, false], [false, true], [true, true], [false, false]].map((v) => (c: Ctx) => JSON.stringify(odd(c)) === JSON.stringify(v));
    })()],
    h: ['The graph of an odd function looks the same after a half-turn about the ORIGIN: every point (x, y) has a partner (−x, −y).', 'Test each curve with one of its grid points, and check where each curve meets the y-axis.'],
    s: 'Read from the graph: S passes through the origin, through (2, 2) and through (−2, −2), so each point has its partner (−x, −y): S is the graph of an odd function. T passes through (2, 2), but at x = −2 it is at height 0, not −2, and it meets the y-axis at 1, not at the origin. T has half-turn symmetry about the point (0, 1), not about the origin, so it is not odd. The answer is S only.',
  },
  {
    t: 'what the value at x = 0 rules out for the undrawn half', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-5, 5], yRange: [-2, 4], curves: [{ expr: 'x^2 - 4*x + 3', domain: [0, 4] }] }),
    alt: 'A U-shaped curve drawn only to the right of the y-axis, between a dot on the y-axis and a dot at the same height further right. The left half of the grid is empty.',
    q: 'The graph shows a function f for 0 ≤ x ≤ 4 only; f is also defined for −4 ≤ x < 0, but that part is not drawn. Which statement about f is correct?',
    o: [
      ['f could be even, but it cannot be odd', 'correct'],
      ['f could be odd, but it cannot be even', 'exchanges the two rules at x = 0'],
      ['f could be even, and it could be odd', 'takes the undrawn half to be free in both cases'],
      ['f cannot be even, and it cannot be odd', 'takes the lack of symmetry of the drawn half to settle it'],
    ],
    holds: ['an even extension always exists (the mirror image of the drawn half); an odd one exists only when the spec\'s curve has f(0) = 0', (() => {
      const can = (c: Ctx) => ({ even: true, odd: near(fOf(c)(0), 0, 1e-9) });
      return [(c) => can(c).even && !can(c).odd, (c) => can(c).odd && !can(c).even, (c) => can(c).even && can(c).odd, (c) => !can(c).even && !can(c).odd];
    })()],
    h: ['Think about what each kind of symmetry demands at x = 0, where a point is its own partner.', 'For an odd function f(−x) = −f(x); put x = 0 into that rule. Then read f(0) from the graph.'],
    s: 'Read from the graph: f(0) = 3. For an odd function f(−0) = −f(0), which forces f(0) = 0; since f(0) = 3, f cannot be odd whatever the undrawn part looks like. Nothing stops f from being even: the undrawn part would then be the mirror image of the drawn part in the y-axis. So f could be even, but it cannot be odd.',
  },
]);

// ── Tangent, secant, cosecant graphs (pack 280) ─────────────────────────────

G('5d6790af.lo-3', 'Branches, turning points and asymptotes read from the graph', [
  {
    t: 'a value in the gap between the two sets of branches', d: 2, need: 'reason',
    spec: tgraph([-1.5 * PI, 1.5 * PI], 2, [-6, 6], [{ expr: '3/cos(x)' }], { asymptotes: [{ x: -PI / 2 }, { x: PI / 2 }] }),
    alt: 'Three separate branches on a grid whose horizontal axis is numbered in multiples of π: a U-shaped branch in the middle, between two dashed vertical lines, and an upside-down U-shaped branch on each side.',
    q: 'The graph of a trigonometric function is shown; its branches continue beyond the top and the bottom of the grid. Which of these y-values does the function never take?',
    o: [
      ['2', 'correct'],
      ['3', 'leaves out the turning point of an upward branch'],
      ['−3', 'leaves out the turning point of a downward branch'],
      ['−5', 'takes the downward branches to stop at the edge of the grid'],
    ],
    holds: ['the least |y| of the spec\'s curve over the plot is its turning height; a value is never taken when its size is below that', (() => {
      const gap = (c: Ctx) => { const f = fOf(c); const [a, b] = c.p.xRange as number[]; let m = Infinity; for (let i = 0; i <= 6000; i++) { const y = Math.abs(f(a + ((b - a) * i) / 6000)); if (Number.isFinite(y)) m = Math.min(m, y); } return round(m, 4); };
      return [2, 3, -3, -5].map((v) => (c: Ctx) => Math.abs(v) < gap(c) - 1e-6);
    })()],
    h: ['Each branch has a turning point: the lowest point of an upward branch, or the highest point of a downward branch. Read the heights of those points.', 'The function takes every value from a turning point outward, away from the x-axis, and no value in the gap between the upward and the downward branches.'],
    s: 'Read from the graph: the upward branch has its lowest point at y = 3 and the downward branches have their highest points at y = −3. The function takes every value y ≥ 3 and every value y ≤ −3, but nothing strictly between −3 and 3. Of the values offered, 3, −3 and −5 are all taken; 2 lies in the gap, so the function never takes it.',
  },
  {
    t: 'vertical shift of a cosecant graph from its two turning heights', d: 3, need: 'calc',
    spec: tgraph([-2 * PI, 2 * PI], 2, [-5, 7], [{ expr: '2/sin(x) + 1' }], { asymptotes: [{ x: -PI }, { x: 0 }, { x: PI }] }),
    alt: 'Four separate branches on a grid whose horizontal axis is numbered in multiples of π, separated by dashed vertical lines: U-shaped branches and upside-down U-shaped branches in turn. The gap between the two kinds of branch is not centred on the x-axis.',
    q: 'The graph shown has an equation of the form y = a csc x + d, where a and d are constants and a > 0. What is the value of d?',
    n: '1',
    calc: ['halfway between the turning heights of the spec\'s curve: its values at x = π/2 (an upward branch) and x = −π/2 (a downward branch), each checked to be a turning point', (c) => {
      const f = fOf(c); const up = f(PI / 2); const down = f(-PI / 2);
      if (!(f(PI / 2 - 0.1) > up && f(PI / 2 + 0.1) > up && f(-PI / 2 - 0.1) < down && f(-PI / 2 + 0.1) < down)) throw new Error('not turning points');
      return round((up + down) / 2, 6);
    }],
    h: ['For y = csc x the upward and the downward branches turn at the same distance above and below the x-axis. Multiplying by a and adding d moves those two turning heights to d + a and d − a.', 'Read the two turning heights from the graph; d is halfway between them.'],
    s: 'Read from the graph: the upward branches have their lowest points at y = 3 and the downward branches have their highest points at y = −1. For y = csc x those heights are 1 and −1, so here d + a = 3 and d − a = −1. Adding the two equations gives 2d = 2, so d = 1 (and a = 2).',
  },
  {
    t: 'the false statement about a shifted tangent graph', d: 3, need: 'reason',
    spec: tgraph([-PI, PI], 4, [-4, 4], [{ expr: 'tan(x - pi/4)' }], { asymptotes: [{ x: -PI / 4 }, { x: (3 * PI) / 4 }] }),
    alt: 'Branches of a tangent-type curve on a grid whose horizontal axis is numbered in multiples of π, with two dashed vertical lines; one complete branch lies between the dashed lines.',
    q: 'The graph of a tangent function is shown, with two of its vertical asymptotes drawn as dashed lines. Which statement is FALSE?',
    o: [
      ['Between two neighbouring asymptotes, y decreases as x increases', 'correct'],
      ['The graph has a vertical asymptote at x = 3π/4', 'misreads the position of the right-hand dashed line'],
      ['The period of the function is π', 'does not measure the distance between neighbouring asymptotes'],
      ['The graph passes through the x-axis at x = π/4', 'does not find where the complete branch meets the x-axis'],
    ],
    holds: falseOne('each statement tested on the spec\'s expression and its drawn asymptotes', [
      (c) => { const f = fOf(c); return f(0.2) > f(0.6) && f(0.6) > f(1.0); },
      (c) => arr(c.p.asymptotes).some((k) => near(k.x as number, (3 * PI) / 4)) && Math.abs(fOf(c)((3 * PI) / 4 - 1e-4)) > 1000,
      (c) => { const f = fOf(c); const xs = arr(c.p.asymptotes).map((k) => k.x as number).sort((p, q) => p - q); return near(xs[1] - xs[0], PI) && [0.1, 0.5, 1.3].every((x) => near(f(x + PI), f(x), 1e-6)); },
      (c) => near(fOf(c)(PI / 4), 0, 1e-9),
    ]),
    h: ['Read the positions of the asymptotes and of the x-intercepts from the labelled gridlines; the period is the distance between two neighbouring asymptotes.', 'Follow one branch from left to right between its asymptotes and note whether y goes up or down.'],
    s: 'Read from the graph: the dashed asymptotes are at x = −π/4 and x = 3π/4, a distance π apart, so the period is π; the branch between them passes through the x-axis at x = π/4. Along that branch y rises from far below the grid to far above it as x increases: a tangent function increases between neighbouring asymptotes. So the statement that y decreases is the false one.',
  },
]);

// ITEMS-END

/** Objectives of the batch that get no item, and why (written into mapping.json). Keys are "<first block of the plan id>.lo-N". */
const NOT_COVERED: Record<string, string> = {};

// ── seeded shuffle ──────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], seedText: string): T[] {
  const rnd = mulberry32(parseInt(simpleHash(seedText), 36));
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── objectives: the lesson packs and the released figure rows ───────────────

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string; have: number; existing: string }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json')).sort()) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string; have?: number; existingItems?: unknown }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: f.replace('.json', ''), have: o.have ?? 0, existing: typeof o.existingItems === 'string' ? o.existingItems : JSON.stringify(o.existingItems ?? '') });
  }
  return out;
}
const shortOf = (loId: string): string => loId.replace(/^gen-([0-9a-f]{8})-[0-9a-f-]+\.(lo-\d+)$/, '$1.$2');

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const outArg = argv.indexOf('--out');
  const outDir = outArg >= 0 ? argv[outArg + 1] : DEFAULT_OUT;
  const checkOnly = argv.includes('--check');
  const wip = argv.includes('--wip');
  const objectives = loadObjectives();
  const byShort = new Map([...objectives.values()].map((o) => [shortOf(o.loId), o]));
  type Row = { id: string; loId: string; difficulty: number; problemText: string; figure: { spec: Spec } };
  const earlierFound = EARLIER_ROWS.filter((f) => fs.existsSync(f));
  const earlier = earlierFound.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[]);
  const held = HELD_ROWS.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[]);
  const heldByLo = new Map<string, Row[]>();
  for (const r of held) heldByLo.set(r.loId, [...(heldByLo.get(r.loId) ?? []), r]);
  /** The objectives of this batch (OBJECTIVES), resolved against the lesson packs. */
  const lowOnly = Object.entries(OBJECTIVES).map(([short, had]) => {
    const o = byShort.get(short);
    if (!o) throw new Error(`no objective ${short} in the lesson packs`);
    return { loId: o.loId, subject: o.subject, skill: o.skill, objective: o.description, had };
  });
  const lowSet = new Set(lowOnly.map((o) => o.loId));

  if (argv.includes('--list-objectives')) {
    const per = new Map<string, Item[]>();
    for (const a of ITEMS) per.set(a.lo, [...(per.get(a.lo) ?? []), a]);
    for (const [lo, items] of per) {
      const o = byShort.get(lo);
      console.log(`${o?.pack ?? '???'} ${lo} ${items.length} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
      for (const a of items) console.log(`      - [${a.spec.type}, ${a.need}, d${a.d}] ${a.t}`);
    }
    console.log(`${ITEMS.length} items on ${per.size} objectives; ${lowOnly.length} objectives in the batch`);
    return;
  }

  const problems: string[] = [];
  const notes: string[] = [];
  const offGrid: string[] = [];
  const now = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  const proofs: Array<Record<string, unknown>> = [];
  const cards: string[] = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const perLo = new Map<string, string[]>();
  const specsPerLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];
  const plain = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (!lowSet.has(obj.loId)) problems.push(`${tag}: the objective is not one of the objectives of this batch`);
    if (![2, 3].includes(a.d)) problems.push(`${tag}: an item of this batch is level 2 or 3`);
    if (NOT_COVERED[a.lo]) problems.push(`${tag}: the objective has items and is also listed as not covered`);
    // A new item is drawn on a NEW figure and asks a NEW question: not the spec, and not the stem, of any figure item the objective holds.
    for (const r of heldByLo.get(obj.loId) ?? []) {
      if (JSON.stringify(r.figure.spec) === JSON.stringify(a.spec)) problems.push(`${tag}: the figure is the same as that of the held item ${r.id}`);
      if (plain(r.problemText) === plain(a.q)) problems.push(`${tag}: the stem is the same as that of the held item ${r.id}`);
    }
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    // No twins: two items of one objective never share a figure, and no stem repeats an item the pack already holds.
    const specs = specsPerLo.get(obj.loId) ?? [];
    if (specs.includes(JSON.stringify(a.spec))) problems.push(`${tag}: the same figure is used twice within the objective`);
    specs.push(JSON.stringify(a.spec));
    specsPerLo.set(obj.loId, specs);
    if (plain(obj.existing).includes(plain(a.q).slice(0, 90))) problems.push(`${tag}: the stem repeats an item the pack already holds`);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
      let answer = '';
      let choices: string[] = [];
      let rationales: string[] = [];
      let keyText = '';
      if (a.o) {
        if (a.o.length !== 4 || a.o[0][1] !== 'correct') bad('needs four options, the correct one first');
        const order = shuffled(a.o, a.q);
        choices = order.map((x) => x[0]);
        rationales = order.map((x) => x[1]);
        answer = 'ABCD'[order.indexOf(a.o[0])];
        keyText = a.o[0][0];
        if (new Set(choices.map((x) => canonText(x))).size !== 4) bad('options are not four distinct texts');
        // The product compares option texts case-insensitively.
        if (new Set(choices.map((x) => canonText(x).toLowerCase())).size !== 4) bad('two options differ only by letter case');
        const lens = choices.map((x) => x.length);
        if (Math.max(...lens) > Math.min(...lens) * 2 + 6) notes.push(`${tag}: option lengths ${lens.join('/')}`);
        if (lens.indexOf(Math.max(...lens)) === 'ABCD'.indexOf(answer) && Math.max(...lens) > [...lens].sort((x, y) => y - x)[1] * 1.35 + 3) bad(`the correct option is the longest by far (${lens.join('/')})`);
        const clash = figureLetterClash(a.spec, choices);
        if (clash) bad(`option letters — ${clash.message}`);
      } else if (a.n !== undefined) {
        answer = a.n;
        keyText = a.n;
        const key = parseNumericKey(answer);
        if (!key) bad(`the numeric key "${answer}" is not a plain number under the product's rule`);
      }

      // ── the proof ────────────────────────────────────────────────────────
      let proofKind: 'checker' | 'checker+code' | 'code' = 'code';
      let proofHow = '';
      let proofResult = '';
      let derivation = { checker: 'none', args: {} as P };
      const stated = Number(answer);
      const places = (answer.split('.')[1] ?? '').length;
      const fits = (v: number): boolean => Number.isFinite(v) && (near(v, stated) || (places > 0 && Math.abs(v - stated) <= 0.5 * 10 ** -places + 1e-9));
      if (a.ck) {
        derivation = { checker: a.ck[0], args: a.ck[1] };
        const d = runChecker(a.spec, derivation);
        proofKind = 'checker';
        proofHow = `figure-core checker ${a.ck[0]} ${JSON.stringify(a.ck[1])}`;
        proofResult = derivedText(d);
        // examineFigureItem (below) compares the result with the stored key.
      } else if (a.calc) {
        const v = a.calc[1](c);
        proofHow = a.calc[0];
        proofResult = String(v);
        if (a.o) {
          const hit = a.o.map((x) => canonText(x[0]) === canonText(String(v)));
          if (!(hit[0] && hit.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — computed "${v}", options ${JSON.stringify(a.o.map((x) => x[0]))}`);
        } else if (!fits(Number(v))) bad(`stated key ${answer}, computed ${v}`);
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options that answer the question, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — the options as written: ${JSON.stringify(truth)}`);
      }
      // A numeric key must survive the other routes a student may take (early rounding, another value of a constant).
      if (a.alts) {
        if (a.o) bad('alts are for a numeric key');
        for (const alt of a.alts[1](c)) if (!(Number.isFinite(alt) && Math.abs(alt - stated) <= 0.5 * 10 ** -places + 1e-9)) bad(`the key moves with ordinary rounding — ${a.alts[0]}: ${alt} against the stated ${answer}`);
      }
      if (!a.ck && c.used.length) proofKind = 'checker+code';

      // ── the alt text: what the picture prints, then the item's specifics ──
      const base = describeForAlt(a.spec, { hide: a.hide ?? [] });
      const alt = `${base} ${a.alt}`.trim();
      if (a.alt.length < 40) bad('the alt specifics are too short (name the components / lanes / labels shown)');

      // ── the job's rule checks ────────────────────────────────────────────
      const figureItem = {
        objectiveLoId: obj.loId, responseFormat, problemText: a.q, answer, choices, hints: a.h, solutionText: a.s, difficulty: a.d,
        covers: obj.description, taskType: a.t, distractorRationales: rationales, figureSpec: a.spec, alt, derivation,
      } as unknown as FigureItem;
      const exam = examineFigureItem(figureItem);
      for (const d of exam.defects) {
        if (a.offGridOk && d.startsWith('it would need a reading finer than the grid')) { offGrid.push(`${tag}: ${a.offGridOk}`); continue; }
        bad(`rule check — ${d}`);
      }
      if (a.ck && exam.derivation.status !== 'derived') bad(`checker status ${exam.derivation.status}: ${exam.derivation.detail}`);
      for (const d of contentDefects(figureItem, { hasFigure: true } as never)) bad(`content check — ${d}`);
      // A hint must not give the key: the key's text, or (numeric) the key as a number of its own.
      const keyCanon = canonText(keyText).toLowerCase();
      for (const h of a.h) {
        if (keyText.length > 2 && canonText(h).toLowerCase().includes(keyCanon)) bad('a hint contains the answer');
        if (!a.o && new RegExp(`(?<![\\d.,/−-])${answer.replace('-', '[−-]').replace('.', '\\.')}(?![\\d/]|[.,]\\d)`).test(h.replace(/\b(?:x|y|t)\s*=\s*[−-]?[\d.]+/g, ''))) bad(`a hint prints the key ${answer}`);
      }
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');
      if (!/\bread/i.test(a.s)) bad('the solution does not say what is read from the figure');

      const figure = buildPracticeFigure(a.spec, alt);
      const safety = validateFigureSvg(figure.svg);
      if (!safety.ok) bad(`svg safety — ${JSON.stringify(safety.issues)}`);
      if (figure.svg.length > MAX_FIGURE_SVG_CHARS) bad(`svg is ${figure.svg.length} chars`);
      const warnings = checkFigureLegibility(a.spec);
      if (warnings.length) bad(`legibility — ${warnings.map((w) => `${w.code}: ${w.message}`).join('; ')}`);
      const figureText = describeFigure(a.spec).text;

      rows.push({
        id, topic: obj.skill, topicId: obj.skill, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-9 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ ...(a.offGridOk ? { offGridOk: a.offGridOk } : {}), id, loId: obj.loId, kind: a.spec.type, format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, kinds, mapping ─────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set(earlier.map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) if (kinds.length > CAP_PER_OBJECTIVE) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${CAP_PER_OBJECTIVE}`);
  // The correct option must not sit on one letter throughout.
  const letters = rows.filter((r) => r.responseFormat === 'mcq').map((r) => r.answer as string);
  for (const l of 'ABCD') if (letters.length >= 12 && letters.filter((x) => x === l).length > letters.length * 0.45) problems.push(`the key is option ${l} in ${letters.filter((x) => x === l).length} of ${letters.length} multiple-choice items`);
  // Every objective of the batch is either covered or listed, with its reason, as not covered; a covered one reaches the target, with one level-2 item and the rest level 3.
  for (const o of lowOnly) {
    const has = perLo.has(o.loId);
    const levels = meta.filter((m) => m.lo.loId === o.loId).map((m) => m.item.d);
    if (has && o.had + levels.length < TARGET_PER_OBJECTIVE) problems.push(`${shortOf(o.loId)}: ${o.had} held + ${levels.length} new is under the target of ${TARGET_PER_OBJECTIVE}`);
    if (has && levels.filter((d) => d === 2).length !== 1) problems.push(`${shortOf(o.loId)}: levels [${levels.join(', ')}] — one level-2 item an objective, the rest level 3`);
    if (!has && !NOT_COVERED[shortOf(o.loId)]) problems.push(`${shortOf(o.loId)}: no item, and no reason given in NOT_COVERED`);
  }
  for (const k of Object.keys(NOT_COVERED)) if (!lowOnly.some((o) => shortOf(o.loId) === k)) problems.push(`${k}: listed as not covered, but it is not an objective of this batch`);

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const coveredLos = [...new Set(meta.map((m) => m.lo.loId))];
  const mapping = {
    kinds: [...new Set(meta.map((m) => m.item.spec.type))].sort().map((kind) => {
      const mine = meta.filter((m) => m.item.spec.type === kind);
      return { kind, items: mine.length, levels: mine.map((m) => m.item.d).sort().join(','), subjects: count(mine, (m) => m.lo.subject), objectives: [...new Set(mine.map((m) => shortOf(m.lo.loId)))] };
    }),
    objectives: coveredLos.map((lo) => {
      const o = objectives.get(lo)!;
      const mine = meta.filter((m) => m.lo.loId === lo);
      return { loId: lo, pack: o.pack, subject: o.subject, skill: o.skill, objective: o.description, status: 'covered', itemsHeld: OBJECTIVES[shortOf(lo)], totalAfter: OBJECTIVES[shortOf(lo)] + meta.filter((m) => m.lo.loId === lo).length, heldFigureItems: (heldByLo.get(lo) ?? []).length, heldLevels: (heldByLo.get(lo) ?? []).map((r) => r.difficulty).sort().join(','), heldKinds: [...new Set((heldByLo.get(lo) ?? []).map((r) => r.figure.spec.type))].join(', '), newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), kinds: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), tasks: mine.map((m) => m.item.t), ids: mine.map((m) => m.id) };
    }),
    notCovered: lowOnly.filter((o) => !perLo.has(o.loId)).map((o) => ({ loId: o.loId, pack: objectives.get(o.loId)?.pack, subject: o.subject, skill: o.skill, objective: o.objective, status: 'not-covered', heldFigureItems: (heldByLo.get(o.loId) ?? []).length, heldLevels: (heldByLo.get(o.loId) ?? []).map((r) => r.difficulty).sort().join(','), heldKinds: [...new Set((heldByLo.get(o.loId) ?? []).map((r) => r.figure.spec.type))].join(', '), note: NOT_COVERED[shortOf(o.loId)] ?? '' })),
  };
  const summary = {
    generatedAt: now,
    items: rows.length,
    objectives: coveredLos.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `level ${m.item.d}`),
    bySubjectAndDifficulty: count(meta, (m) => `${m.lo.subject} · level ${m.item.d}`),
    byKindAndDifficulty: count(meta, (m) => `${m.item.spec.type} · level ${m.item.d}`),
    asks: count(meta, (m) => m.item.need),
    keyLetters: count(letters, (l) => l),
    objectivesInBatch: lowOnly.length,
    objectivesCovered: coveredLos.length,
    objectivesWithOneItem: [...perLo.entries()].filter(([, k]) => k.length === 1).map(([lo]) => shortOf(lo)),
    objectivesNotCovered: lowOnly.filter((o) => !perLo.has(o.loId)).map((o) => shortOf(o.loId)),
    earlierRowFilesRead: earlierFound,
    earlierRowFilesMissing: EARLIER_ROWS.filter((f) => !earlierFound.includes(f)),
    earlierIds: taken.size,
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built, on ${coveredLos.length} of ${lowOnly.length} objectives (${Object.keys(NOT_COVERED).length} listed as not covered)`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, bySubjectAndDifficulty: summary.bySubjectAndDifficulty, keyLetters: summary.keyLetters, earlierRowFilesMissing: summary.earlierRowFilesMissing }, null, 1));
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  if (offGrid.length) console.log(`off-grid features the answer does not rest on (declared per item):\n  ${offGrid.join('\n  ')}`);
  if (problems.length && !wip) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (problems.length) console.error(`\n${problems.length} PROBLEM(S) (work in progress — files written all the same):\n  ${problems.join('\n  ')}`);
  if (checkOnly) return;

  fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'final'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'sheets'), { recursive: true });
  for (const d of ['png', 'sheets']) for (const f of fs.readdirSync(path.join(outDir, d))) if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, d, f));
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch9${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch9-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch9-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-9 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-9 figure practice items — ${rows.length} items for the objectives that held fewer than three practice items</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = (mod.default ?? mod) as any;
  for (const { id, svg } of pngs) await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));

  // Contact sheets: six figures a sheet (three across), each under its item number; the stems and options beside them in index.txt.
  const W = 520;
  const COLS = 3;
  const PER = 6;
  const index: string[] = [];
  for (let s = 0; s < rows.length; s += PER) {
    const group = rows.slice(s, s + PER);
    const imgs: Array<{ buf: Buffer; h: number; n: number }> = [];
    for (const [k, r] of group.entries()) {
      const buf = (await sharp(path.join(outDir, 'png', `${r.id}.png`)).resize({ width: W }).png().toBuffer()) as Buffer;
      const m = (await sharp(buf).metadata()) as { height: number };
      imgs.push({ buf, h: m.height, n: s + k + 1 });
    }
    const rowsH: number[] = [];
    for (let i = 0; i < imgs.length; i += COLS) rowsH.push(Math.max(...imgs.slice(i, i + COLS).map((x) => x.h)) + 26);
    const comp: Array<{ input: Buffer; left: number; top: number }> = [];
    let y = 0;
    for (let i = 0; i < imgs.length; i += COLS) {
      imgs.slice(i, i + COLS).forEach((im, j) => {
        comp.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="24"><rect width="${W}" height="24" fill="#222"/><text x="6" y="17" font-size="15" fill="#fff" font-family="Helvetica">#${im.n}</text></svg>`), left: j * W, top: y });
        comp.push({ input: im.buf, left: j * W, top: y + 24 });
      });
      y += rowsH[i / COLS];
    }
    const file = `sheet-${String(s + 1).padStart(3, '0')}.png`;
    await sharp({ create: { width: W * COLS, height: rowsH.reduce((x, z) => x + z, 0), channels: 3, background: '#888' } }).composite(comp).png().toFile(path.join(outDir, 'sheets', file));
    index.push(`== ${file}`);
    for (const [k, r] of group.entries()) {
      index.push(`#${s + k + 1} [${(r.figure as { spec: Spec }).spec.type}] ${r.id}`);
      index.push(`   ${r.problemText}`);
      index.push((r.choices as string[]).length ? `   ${(r.choices as string[]).map((x, i) => `${'ABCD'[i]}${'ABCD'[i] === r.answer ? '*' : ''}) ${x}`).join('  |  ')}` : `   key: ${r.answer}`);
    }
  }
  fs.writeFileSync(path.join(outDir, 'sheets', 'index.txt'), index.join('\n') + '\n');
  console.log(`\nwrote ${rows.length} rows, ${pngs.length} PNGs, ${Math.ceil(rows.length / PER)} sheets, gallery.html${wip ? '' : ', mapping.json, summary.json'} to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
