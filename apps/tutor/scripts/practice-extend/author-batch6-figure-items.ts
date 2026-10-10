/**
 * Hand-authored practice items that are read off a FIGURE — batch 6.
 *
 * Harder items (level 3, a few level 4) for the objectives whose figure items
 * now in production are ALL level 1–2 ("low-level only": every figure row of
 * the objective in release-2026-10-15/figure-rows-428.json and
 * figure-rows-253-second.json has difficulty ≤ 2). Two items an objective,
 * each on a NEW figure (not the spec of any released figure item of that
 * objective). The cap of about 70 items goes to AP Calculus AB and AP
 * Chemistry (all of their low-level-only objectives) and to the Physics
 * objectives where a graph can carry the reasoning; the rest of the set is
 * listed in mapping.json as not covered.
 *
 * What makes an item level 3 here — at least two of: two separate readings
 * combined; a reading that must be interpreted through the objective's idea
 * before it is used; a choice between cases that the figure decides; working
 * backwards from a stated result to a feature of the figure; finding which of
 * four statements about the figure is false; comparing two curves / set-ups.
 * Lessons of the two independent reads (batch 4 and batch 5) applied here:
 * no formula substitution on a labelled sketch (mechanics items carry their
 * data in a GRAPH that must be read and interpreted); nothing that is asked
 * for is drawn to scale; every value that must be read lies on a numbered
 * grid line; numeric keys are exact or tested in code against early rounding
 * (`robust`); hints name a method, never a part of the answer.
 *
 * Same pattern, rules and output layout as author-batch4-figure-items.ts.
 * Every item is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed), the option-letter guard
 *     (`figureLetterClash`) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core checker whose
 *     result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the spec's own params;
 *     an item whose key does not follow from its spec stops the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file);
 *   - writes the alt text from `describeForAlt` (what the picture prints,
 *     with any value to keep back hidden) plus the item's own specifics.
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the low-level-only set, its mapping, a gallery
 * page, PNGs at the 340 px column (2×), contact sheets and a summary.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch6-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
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
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-16-items`;
/** ALL the figure rows now in production: which objectives hold figure items, and at what level. */
const HELD_ROWS = [`${INTEGRATION}/release-2026-10-15/figure-rows-428.json`, `${INTEGRATION}/release-2026-10-15/figure-rows-253-second.json`];
/** Figure rows written by earlier runs (released or not) — an id may not be reused. */
const EARLIER_ROWS = [
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch6.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5.json`,
];
/** The CURRENT lesson packs (lesson text and every existing item). */
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×
/** Two items an objective. */
const CAP_PER_OBJECTIVE = 2;

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
  d: 3 | 4;
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
  /** numeric: the key again by the routes a student may take (early rounding of an intermediate, π = 3.14, …) — every one must round to the stated key. */
  alts?: [string, (c: Ctx) => number[]];
  /** mcq: whether each option, as written, is a right answer to the question (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
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
const rad = (v: number): number => (v * Math.PI) / 180;
const arr = (v: unknown): P[] => v as P[];
const minus = (v: number | string): string => String(v).replace(/-/g, '−');

// ── helpers for particular kinds ────────────────────────────────────────────

const BLUE = '#1d4ed8';
/** Function graphs. */
const fgraph = (params: P): Spec => S('function_graph', { xStep: 1, yStep: 1, ...params });
interface Piece { f: (x: number) => number; a: number; b: number; from: string; to: string }
/** The drawn pieces of a function graph, each compiled from ITS OWN expression in the spec. */
const pieces = (c: Ctx): Piece[] => arr(c.p.curves).map((k) => { const xr = c.p.xRange as number[]; const d = (k.domain as Array<number | null> | undefined) ?? xr; return { f: compileExpression(k.expr as string), a: d[0] ?? xr[0], b: d[1] ?? xr[1], from: (k.from as string) ?? 'none', to: (k.to as string) ?? 'none' }; });
const fOf = (c: Ctx, i = 0): ((x: number) => number) => pieces(c)[i].f;
/** The drawn function just left / just right of x (the piece whose domain reaches x from that side). */
const pieceLeft = (ps: Piece[], x: number): Piece => { const p = ps.find((k) => k.a < x - 1e-9 && x <= k.b + 1e-9); if (!p) throw new Error(`nothing drawn left of ${x}`); return p; };
const pieceRight = (ps: Piece[], x: number): Piece => { const p = ps.find((k) => k.a <= x + 1e-9 && x < k.b - 1e-9); if (!p) throw new Error(`nothing drawn right of ${x}`); return p; };
const leftLim = (ps: Piece[], x: number): number => round(pieceLeft(ps, x).f(x - 1e-9), 6);
const rightLim = (ps: Piece[], x: number): number => round(pieceRight(ps, x).f(x + 1e-9), 6);
/** The value AT x: a filled marked point there, else the piece that includes x with a closed (or interior) end. */
const valueAt = (c: Ctx, x: number): number => {
  const dot = arr(c.p.points ?? []).find((d) => near(d.x as number, x) && !d.open);
  if (dot) return dot.y as number;
  const p = pieces(c).find((k) => (k.a < x - 1e-9 && x < k.b - 1e-9) || (near(k.a, x) && k.from !== 'open') || (near(k.b, x) && k.to !== 'open'));
  if (!p) throw new Error(`no value at ${x}`);
  return round(p.f(x), 6);
};
/** Central-difference slope of a compiled expression. */
const dAt = (f: (x: number) => number, x: number, h = 1e-5): number => (f(x + h) - f(x - h)) / (2 * h);
/** Trapezium-rule integral, fine enough for the polynomials and lines used here. */
const integral = (f: (x: number) => number, a: number, b: number, n = 60000): number => { let t = 0; const h = (b - a) / n; for (let i = 0; i < n; i++) t += (f(a + i * h) + f(a + (i + 1) * h)) / 2 * h; return t; };
/** Every x on a grid of the given step in [a, b]. */
const grid = (a: number, b: number, step: number): number[] => { const out: number[] = []; for (let x = a; x <= b + 1e-9; x += step) out.push(round(x, 6)); return out; };

/** Sign charts. */
const schart = (critical: number[], rows: P[]): Spec => S('sign_chart', { critical, rows });
const sgn = (s: unknown): number => (s === '+' ? 1 : s === '-' ? -1 : 0);
const chartRow = (c: Ctx, i: number): { signs: number[]; at: string[] } => { const r = arr(c.p.rows)[i]; return { signs: (r.signs as string[]).map(sgn), at: ((r.at as string[] | undefined) ?? []) }; };
const crit = (c: Ctx): number[] => c.p.critical as number[];

/** Shaded regions between two curves. */
const between = (upper: string, lower: string, from: number, to: number, xRange: [number, number], yRange: [number, number], extra: P = {}): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'between_curves', upper: { expr: upper }, lower: { expr: lower }, from, to, ...extra } });
const regionOf = (c: Ctx): { up: (x: number) => number; lo: (x: number) => number; from: number; to: number } => { const r = c.p.region as P; return { up: compileExpression((r.upper as P).expr as string), lo: compileExpression((r.lower as P).expr as string), from: r.from as number, to: r.to as number }; };

/** An interval option "(a, b)" tested at many points: does the property hold all the way along it? */
const allAlong = (a: number, b: number, pred: (x: number) => boolean): boolean => grid(a + 0.01, b - 0.01, 0.01).every(pred);
/** Is the set where the predicate holds, inside the window, exactly the union of the open intervals? */
const sameSet = (window: [number, number], intervals: Array<[number, number]>, pred: (x: number) => boolean): boolean => grid(window[0] + 0.013, window[1] - 0.013, 0.0137).every((x) => pred(x) === intervals.some(([a, b]) => x > a && x < b));

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// AP CALCULUS AB
// ════════════════════════════════════════════════════════════════════════════

// ── First Derivative Test Applications (pack 117) ───────────────────────────

G('5fec1ce2.lo-3', 'Sign charts for a transformed function and for two derivatives', [
  {
    t: 'local maximum of a reflected function from the chart of f′', d: 3, need: 'reason',
    spec: schart([-2, 1, 6], [{ label: 'f′(x)', signs: ['-', '+', '-', '-'], at: ['0', '0', '0'] }]),
    alt: 'A sign chart with one row, for the derivative of f, and three critical numbers. The sign is given on each of the four intervals, and the derivative is zero at each critical number.',
    q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. Let g(x) = f(4 − x). At what value of x does g have a local maximum?',
    n: '3',
    calc: ['g′(x) = −f′(4 − x): for each critical number c of f, the sign of g′ just left and just right of x = 4 − c from the chart\'s own signs; the x where it goes from + to −', (c) => {
      const { signs } = chartRow(c, 0);
      const hits = crit(c).map((k, i) => ({ x: 4 - k, left: -signs[i + 1], right: -signs[i] })).filter((k) => k.left > 0 && k.right < 0);
      if (hits.length !== 1) throw new Error(`${hits.length} local maxima`);
      return hits[0].x;
    }],
    h: ['Use the chain rule to write g′(x) in terms of f′, and note the extra factor it brings.', 'As x increases, the input 4 − x decreases: decide what that does to the order in which g′ meets the signs in the chart.'],
    s: 'By the chain rule g′(x) = −f′(4 − x). Read from the chart: f′ changes from + to − at 1, so f has a local maximum at an input of 1 (and a local minimum at −2; at 6 the sign does not change). Reflecting the input (x → 4 − x) reverses left and right, and the factor −1 reverses the signs, so a local maximum of f stays a local maximum of g. It occurs where 4 − x = 1, that is at x = 3. Check: just left of x = 3 the input is just above 1, where f′ < 0, so g′ > 0; just right of it g′ < 0.',
  },
  {
    t: 'local minima when part of the f′ row is missing and f″ is given at the critical numbers', d: 3, need: 'reason',
    spec: schart([-3, 0, 2, 5], [{ label: 'f′(x)', signs: ['-', '+', '+', '', ''], at: ['0', '0', '0', '0'] }, { label: 'f″(x)', signs: ['', '', '', '', ''], at: ['+', '0', '-', '+'] }]),
    hide: [-3, 5],
    alt: 'A sign chart with two rows, one for the first derivative of f and one for the second, and four critical numbers (two of them are not listed here). The first-derivative row gives a sign on the three left-hand intervals only; the second-derivative row gives no interval signs, only an entry under each critical number.',
    q: 'The chart shown gives what is known about f′ and f″ for a function f that is twice differentiable for all x. f′ is zero only at the four numbers shown; an empty cell means that sign is not given. At which values of x does f have a local minimum?',
    o: [
      ['x = −3 and x = 5', 'correct'],
      ['x = −3 only', 'uses only the signs of f′ that are printed and ignores what f″ says at 2 and 5'],
      ['x = −3, x = 0 and x = 5', 'counts every critical number where f″ is not negative'],
      ['x = −3 and x = 2', 'reads a negative f″ as a local minimum'],
    ],
    holds: ['each critical number classified from the chart: by the signs of f′ on both sides where both are given, else by the sign of f″ there (second derivative test); the option holds when its list is exactly the local minima', (() => {
      const minima = (c: Ctx): number[] => { const f1 = chartRow(c, 0); const f2 = chartRow(c, 1); return crit(c).filter((_, i) => (f1.signs[i] !== 0 && f1.signs[i + 1] !== 0 ? f1.signs[i] < 0 && f1.signs[i + 1] > 0 : f2.at[i] === '+')); };
      const is = (list: number[]) => (c: Ctx) => JSON.stringify(minima(c)) === JSON.stringify(list);
      return [is([-3, 5]), is([-3]), is([-3, 0, 5]), is([-3, 2])];
    })()],
    h: ['Where the sign of f′ is given on both sides of a critical number, use the first derivative test there.', 'Where it is not, a non-zero value of f″ at a critical number still settles the question; a zero value of f″ settles nothing by itself.'],
    s: 'Read from the chart: at −3, f′ goes from − to +, a local minimum. At 0, f′ is + on both sides, so there is no extremum (f″(0) = 0 is consistent with that). At 2 and 5 the sign of f′ to the right is not given, but f′ = 0 with f″(2) < 0 makes 2 a local maximum, and f′ = 0 with f″(5) > 0 makes 5 a local minimum (second derivative test). The local minima are at x = −3 and x = 5.',
  },
]);

G('5fec1ce2.lo-4', 'First derivative test on a shifted derivative and on a difference', [
  {
    t: 'local minimum of f(x) − 5x from the graph of f′', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 6], yRange: [-5, 7], curves: [{ expr: 'x^2 - 2x - 3', label: 'f′' }] }),
    alt: 'A parabola opening upward on a grid, labelled as the derivative of f. It crosses the x-axis twice and its lowest point is below the x-axis; both arms leave the top of the grid.',
    q: 'The graph of f′, the derivative of a function f, is shown. Let g(x) = f(x) − 5x. At what value of x does g have a local minimum?',
    n: '4',
    calc: ['g′ = f′ − 5 from the spec\'s own expression: the whole-number x in the plot where g′ is zero and goes from − to +', (c) => {
      const f = fOf(c); const g1 = (x: number) => f(x) - 5;
      const hits = grid(-4, 6, 1).filter((x) => near(g1(x), 0) && g1(x - 0.01) < 0 && g1(x + 0.01) > 0);
      if (hits.length !== 1) throw new Error(`${hits.length} minima`);
      return hits[0];
    }],
    h: ['Differentiate g: its derivative is the graphed function moved by a constant.', 'g′ is zero where the graph is at a certain height, not where it crosses the x-axis; then check how the sign of g′ changes there.'],
    s: 'g′(x) = f′(x) − 5, so g′ is zero where the graph of f′ is at height 5. Read from the graph: f′ = 5 at x = −2 and at x = 4. Near x = 4 the graph rises through height 5, so g′ goes from − to +: a local minimum of g at x = 4. (At x = −2 the graph falls through height 5: a local maximum. The points where f′ crosses the x-axis are the extrema of f, not of g.)',
  },
  {
    t: 'local maximum of f − g from the graphs of f′ and g′', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 4], yRange: [-4, 6], curves: [{ expr: '4 - x^2', label: 'f′' }, { expr: 'x + 2', label: 'g′', dashed: true }] }),
    alt: 'Two graphs on one grid: a solid parabola opening downward, labelled as the derivative of f, and a dashed rising line, labelled as the derivative of g. They cross at two points.',
    q: 'The graph shows f′ (solid) and g′ (dashed), the derivatives of two functions f and g. Let h(x) = f(x) − g(x). At what value of x does h have a local maximum?',
    n: '1',
    calc: ['h′ = f′ − g′ from the two expressions in the spec: of the crossing points (curves_intersection), the one where h′ goes from + to −', (c) => {
      const [f, g] = [fOf(c, 0), fOf(c, 1)]; const h1 = (x: number) => f(x) - g(x);
      const xs = c.txt('curves_intersection', { a: 0, b: 1, want: 'all' }).split(',').map((v) => Number(v.trim().replace('−', '-')));
      const hits = xs.filter((x) => near(h1(x), 0) && h1(x - 0.01) > 0 && h1(x + 0.01) < 0);
      if (hits.length !== 1) throw new Error(`${hits.length} maxima among ${xs}`);
      return hits[0];
    }],
    h: ['h′(x) = f′(x) − g′(x): it is zero where the two graphs cross.', 'At each crossing, decide which graph is on top just before it and just after it; that gives the sign of h′ on each side.'],
    s: 'h′ = f′ − g′ is zero where the graphs cross. Read from the graph: they cross at x = −2 and at x = 1. Just left of x = 1 the solid graph (f′) is above the dashed one, so h′ > 0; just right of it f′ is below, so h′ < 0. h′ goes from + to −, so h has a local maximum at x = 1. (At x = −2 the order is the other way round: a local minimum.)',
  },
]);

// ── Graphical Differentiability Analysis (pack 122) ─────────────────────────

G('7120b2e6.lo-3', 'Which discontinuity can be repaired, and a one-sided difference quotient at a jump', [
  {
    t: 'the one change of a single value that makes f differentiable', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-5, 5], yRange: [-3, 5], curves: [{ expr: 'x + 3', domain: [-5, -2], to: 'open', color: BLUE }, { expr: '-2x - 1', domain: [-2, 0], from: 'closed', color: BLUE }, { expr: 'x - 1', domain: [0, 3], to: 'open', color: BLUE }, { expr: 'x - 1', domain: [3, 5], from: 'open', color: BLUE }], points: [{ x: 3, y: 4 }] }),
    alt: 'A graph made of straight pieces. The first piece rises and ends in an open circle; the second starts at a filled dot higher up and falls to a sharp turn on the y-axis; from there a single straight line rises to the right, broken only by one open circle on it with a separate filled dot directly above.',
    q: 'The graph of a function f is shown for −5 ≤ x ≤ 5. The value of f at ONE point is to be changed so that f becomes differentiable at an x-value where it is not differentiable now. Which change does this?',
    o: [
      ['Set f(3) = 2', 'correct'],
      ['Set f(−2) = 1', 'fills the open circle at the jump: f is still not continuous from the right there'],
      ['Set f(−2) = 2', 'puts the point half-way between the two sides of the jump'],
      ['Set f(0) = 0', 'thinks a corner can be removed by moving one point'],
    ],
    holds: ['for each option: f with that one value changed is differentiable at that x when the two one-sided limits (from the spec\'s pieces) both equal the new value and the two one-sided slopes agree', (() => {
      const fixes = (x0: number, v: number) => (c: Ctx) => { const ps = pieces(c); const L = leftLim(ps, x0); const R = rightLim(ps, x0); return near(L, R, 1e-6) && near(L, v, 1e-6) && near(dAt(pieceLeft(ps, x0).f, x0 - 1e-3), dAt(pieceRight(ps, x0).f, x0 + 1e-3), 1e-6) && !near(valueAt(c, x0), v, 1e-6); };
      return [fixes(3, 2), fixes(-2, 1), fixes(-2, 2), fixes(0, 0)];
    })()],
    h: ['List the x-values where f is not differentiable now, and name what goes wrong at each: a jump, a hole with a misplaced point, or a corner.', 'For each of them, ask what the value of f at that single point can change about the graph — and what it cannot.'],
    s: 'Read from the graph: f is not differentiable at x = −2 (a jump: the left-hand limit is 1, the right-hand limit is 3), at x = 0 (a corner: slope −2 on the left, 1 on the right) and at x = 3 (the graph approaches 2 from both sides, but f(3) = 4). No single value can remove a jump or a corner. At x = 3 the same straight line of slope 1 runs on both sides of the hole, so setting f(3) = 2 makes f continuous there and differentiable, with f′(3) = 1.',
  },
  {
    t: 'left-hand difference quotient at a jump where f(1) is on the other piece', d: 4, need: 'reason',
    spec: fgraph({ xRange: [-2, 6], yRange: [-4, 5], curves: [{ expr: '2x - 1', domain: [-1, 1], from: 'closed', to: 'open', color: BLUE }, { expr: '4 - x', domain: [1, 5], from: 'closed', to: 'closed', color: BLUE }] }),
    alt: 'Two straight pieces on a grid. The left piece rises steeply and ends in an open circle; the right piece starts at a filled dot directly above that open circle and falls gently to the right.',
    q: 'The graph of a function f is shown. Which statement describes the limit of [f(1 + h) − f(1)] / h as h approaches 0 through NEGATIVE values?',
    o: [
      ['It does not exist: the quotient increases without bound', 'correct'],
      ['It equals 2, the slope of the left-hand piece', 'uses the open circle as if it were f(1)'],
      ['It equals −1, the slope of the right-hand piece', 'uses the piece that carries f(1), which is on the other side'],
      ['It does not exist: the quotient decreases without bound', 'forgets that h is negative as well as the numerator'],
    ],
    holds: ['the quotient computed from the spec for h = −10⁻², −10⁻⁴, −10⁻⁶ (f(1) is the filled end): it grows through large positive values', (() => {
      const q = (c: Ctx, h: number) => (pieceLeft(pieces(c), 1).f(1 + h) - valueAt(c, 1)) / h;
      const vals = (c: Ctx) => [-1e-2, -1e-4, -1e-6].map((h) => q(c, h));
      const settles = (L: number) => (c: Ctx) => Math.abs(vals(c)[2] - L) < 1e-3;
      return [(c: Ctx) => { const v = vals(c); return v[0] > 100 && v[1] > 100 * v[0] / 2 && v[2] > 100 * v[1] / 2; }, settles(2), settles(-1), (c: Ctx) => vals(c)[2] < -1e4];
    })()],
    h: ['Decide first which piece carries the value f(1): look for the filled dot at x = 1.', 'For small negative h the point 1 + h is on the other piece. Find what the numerator approaches, then the sign of numerator ÷ h.'],
    s: 'Read from the graph: the filled dot at x = 1 is on the right-hand piece, so f(1) = 3, while just left of 1 the graph approaches the open circle at height 1. For small negative h the numerator f(1 + h) − f(1) is close to 1 − 3 = −2, and it is divided by a small negative h, so the quotient is large and positive and grows without bound as h → 0⁻. The limit does not exist; f is not continuous at 1, so it cannot be differentiable there even from one side of the jump.',
  },
]);

G('7120b2e6.lo-1', 'Corners made by an absolute value, and a corner cancelled', [
  {
    t: 'where |f| has a corner, from the graph of a smooth f', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 4], yRange: [-3, 4], curves: [{ expr: '(x + 2)*(x - 1)^2/2' }] }),
    alt: 'A smooth curve that comes up from the bottom of the grid, passes straight through the x-axis, rises to a rounded top, comes back down to touch the x-axis once without crossing it, and then rises out of the top of the grid.',
    q: 'The graph of a function f that is differentiable for all x is shown. Let g(x) = |f(x)|. At what value of x is g NOT differentiable?',
    n: '-2',
    calc: ['of the zeros of f on gridlines (curve_zeros), the one at which the slope of the spec\'s expression is not zero: |f| has a corner exactly there', (c) => {
      const f = fOf(c);
      const zeros = c.txt('curve_zeros', { curve: 0, want: 'all' }).split(',').map((v) => Number(v.trim().replace('−', '-')));
      const corners = zeros.filter((x) => Math.abs(dAt(f, x)) > 1e-6);
      if (zeros.length !== 2 || corners.length !== 1) throw new Error(`zeros ${zeros}, corners ${corners}`);
      return corners[0];
    }],
    h: ['Taking the absolute value folds the parts of the graph that lie below the x-axis up above it; a problem can only arise where f(x) = 0.', 'At each zero, compare how the graph meets the axis: passing through it at an angle is not the same as touching it with a horizontal tangent.'],
    s: 'g = |f| can fail to be differentiable only where f = 0. Read from the graph: f is zero at x = −2 and at x = 1. At x = −2 the graph crosses the axis with a non-zero slope, so folding the negative part upward makes a corner (slopes of opposite sign on the two sides). At x = 1 the graph only touches the axis, with a horizontal tangent, so g = f near there and g is differentiable at 1. The only value is x = −2.',
  },
  {
    t: 'the multiple of |x − 1| that cancels a corner', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-5, 4], yRange: [-4, 4], curves: [{ expr: 'x + 2', domain: [-4, 1], from: 'closed', color: BLUE }, { expr: '6 - 3x', domain: [1, 3], to: 'closed', color: BLUE }] }),
    alt: 'Two straight segments joined at a sharp peak in the first quadrant. The left segment rises gently to the peak; the right segment falls steeply from it to a point below the x-axis.',
    q: 'The graph of f, made of two line segments, is shown; it has a corner at x = 1. For what value of the constant c is g(x) = f(x) + c·|x − 1| differentiable at x = 1?',
    n: '2',
    calc: ['half of (slope of the left segment − slope of the right segment), each slope from curve_slope: the one-sided slopes of g are (left − c) and (right + c)', (c) => {
      const mL = c.num('curve_slope', { curve: 0, x1: -3, x2: 0 }); const mR = c.num('curve_slope', { curve: 1, x1: 1, x2: 3 });
      const k = (mL - mR) / 2;
      if (!near(mL - k, mR + k)) throw new Error('slopes do not meet');
      return k;
    }],
    h: ['Find the slope of f on each side of x = 1 from the grid.', 'The graph of c·|x − 1| has slope −c on the left of 1 and +c on the right; add these to the slopes of f and make the two sides agree.'],
    s: 'Read from the graph: the left segment has slope 1 (it rises 1 for each unit) and the right segment has slope −3. The term c·|x − 1| adds −c to the slope on the left of 1 and +c on the right, so g has one-sided slopes 1 − c and −3 + c. They are equal when 1 − c = −3 + c, that is c = 2 (both are then −1). g is continuous at 1 for every c, so with c = 2 it is differentiable there.',
  },
]);

G('7120b2e6.lo-2', 'Vertical tangent against cusp, and the vertical tangent of an inverse', [
  {
    t: 'behaviour of f′ at a vertical tangent and at a cusp', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-6, 6], yRange: [-5, 5], curves: [{ expr: '1 - 3*((-2 - x)/5)^(1/3) - 4*((3 - x)/5)^(2/3)', domain: [null, -2], color: BLUE }, { expr: '1 + 3*((x + 2)/5)^(1/3) - 4*((3 - x)/5)^(2/3)', domain: [-2, 3], color: BLUE }, { expr: '1 + 3*((x + 2)/5)^(1/3) - 4*((x - 3)/5)^(2/3)', domain: [3, null], color: BLUE }], points: [{ x: -2, y: -3, label: 'P' }, { x: 3, y: 4, label: 'Q' }] }),
    alt: 'One continuous curve with two marked points, P on the left and Q on the right. The curve rises all the way from the left edge up to Q, becoming upright for an instant as it passes through P; at Q it comes to a sharp upward-pointing tip and then falls away to the right.',
    q: 'The graph of a continuous function f is shown. f is differentiable at every x except at the two marked points P (where x = −2) and Q (where x = 3). Which statement about f′(x) is correct?',
    o: [
      ['Near P, f′(x) → +∞ on both sides; near Q, f′(x) → +∞ on the left and −∞ on the right', 'correct'],
      ['Near Q, f′(x) → +∞ on both sides; near P, f′(x) → +∞ on the left and −∞ on the right', 'swaps the vertical tangent and the cusp'],
      ['Near P and near Q, f′(x) → +∞ on both sides', 'treats the cusp as a vertical tangent: misses that the graph turns back at Q'],
      ['Near P and near Q, f′(x) approaches two different finite values on the two sides', 'treats both points as corners'],
    ],
    holds: ['one-sided slopes of the spec\'s pieces 10⁻³ and 10⁻⁶ away from x = −2 and from x = 3: growing without settling, with the signs each option claims', (() => {
      /** The one-sided slope 10⁻³ and 10⁻⁶ away: "→ ±∞" when it keeps that sign and grows at least fivefold. */
      const side = (c: Ctx, x0: number, dir: -1 | 1): [number, number] => { const ps = pieces(c); const p = dir < 0 ? pieceLeft(ps, x0) : pieceRight(ps, x0); return [dAt(p.f, x0 + dir * 1e-3, 1e-6), dAt(p.f, x0 + dir * 1e-6, 1e-9)]; };
      const big = (v: [number, number], sign: number) => sign * v[0] > 1 && sign * v[1] > 5 * sign * v[0];
      const at = (c: Ctx) => ({ pl: side(c, -2, -1), pr: side(c, -2, 1), ql: side(c, 3, -1), qr: side(c, 3, 1) });
      return [
        (c: Ctx) => { const v = at(c); return big(v.pl, 1) && big(v.pr, 1) && big(v.ql, 1) && big(v.qr, -1); },
        (c: Ctx) => { const v = at(c); return big(v.ql, 1) && big(v.qr, 1) && big(v.pl, 1) && big(v.pr, -1); },
        (c: Ctx) => { const v = at(c); return big(v.pl, 1) && big(v.pr, 1) && big(v.ql, 1) && big(v.qr, 1); },
        (c: Ctx) => { const v = at(c); return Object.values(v).every((k) => Math.abs(k[1]) < 2 * Math.abs(k[0]) + 1); },
      ];
    })()],
    h: ['At each marked point, ask whether the graph keeps going in the same direction (up, then still up) or turns back.', 'The sign of f′ on each side of a point is the direction of the graph there: rising or falling.'],
    s: 'Read from the graph: through P the curve is rising on both sides and is momentarily upright, so f′ is positive and grows without bound on both sides of x = −2 — a vertical tangent. At Q the curve rises ever more steeply into the tip and then falls ever less steeply away from it, so f′ → +∞ on the left of x = 3 and f′ → −∞ on the right — a cusp. In both cases the limit that defines f′ fails to exist, but in different ways.',
  },
  {
    t: 'where the inverse function has a vertical tangent', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-2, 5], yRange: [-2, 5], curves: [{ expr: '(x - 1)^3/4 + 2', label: 'f' }] }),
    alt: 'A smooth curve labelled f that rises from the lower left to the upper right. It flattens out to a level instant at one point in the first quadrant and then steepens again.',
    q: 'The graph of an increasing function f is shown. Let g be the inverse function of f. At what value of x does the graph of g have a vertical tangent line?',
    n: '2',
    calc: ['the whole-number x₀ in the plot where the slope of the spec\'s expression is 0; the key is f(x₀), because the graph of g is the graph of f with the coordinates exchanged', (c) => {
      const f = fOf(c); const flat = grid(-2, 5, 1).filter((x) => Math.abs(dAt(f, x)) < 1e-6);
      if (flat.length !== 1) throw new Error(`flat at ${flat}`);
      return f(flat[0]);
    }],
    h: ['The graph of g is the graph of f reflected in the line y = x: every point (a, b) on f becomes (b, a) on g.', 'A horizontal tangent on the graph of f becomes a vertical tangent on the graph of g. Find the point first, then decide which of its coordinates is the x-value on g.'],
    s: 'Read from the graph: f has its horizontal tangent at the point (1, 2). The graph of g = f⁻¹ is the reflection of the graph of f in the line y = x, so the point (1, 2) becomes (2, 1) and the horizontal tangent becomes a vertical one. (Equivalently g′(2) = 1 / f′(1), which is undefined because f′(1) = 0.) The vertical tangent of g is at x = 2.',
  },
]);

// ── Volumes with Cross Sections (pack 133) ──────────────────────────────────

G('ab0207fe.lo-1', 'A cross-section found from its area, and cross-sections taken the other way', [
  {
    t: 'where a semicircular cross-section has a stated area', d: 3, need: 'calc',
    spec: between('5 - x/2', 'x/2 - 1', 0, 6, [-1, 7], [-2, 6]),
    alt: 'A shaded triangle-shaped region between two straight lines. Its widest side is the vertical side on the y-axis; the two lines close in on each other and meet at a point on the right.',
    q: 'The shaded region shown is the base of a solid. Each cross-section of the solid perpendicular to the x-axis is a semicircle whose diameter lies across the base. At what value of x is the area of the cross-section equal to 2π?',
    n: '2',
    calc: ['the x (searched in steps of 0.5 across the region) where π·(width/2)²/2 = 2π, the width being upper − lower from the spec\'s own expressions', (c) => {
      const r = regionOf(c); const hits = grid(r.from, r.to, 0.5).filter((x) => near(Math.PI * ((r.up(x) - r.lo(x)) / 2) ** 2 / 2, 2 * Math.PI));
      if (hits.length !== 1) throw new Error(`hits ${hits}`);
      return hits[0];
    }],
    h: ['Work backwards: from the area of a semicircle to its radius, and from the radius to its diameter.', 'The diameter is the vertical distance across the shaded region at that x. Look for the x where the region is exactly that tall.'],
    s: 'A semicircle of radius r has area πr²/2. Setting πr²/2 = 2π gives r² = 4, so r = 2 and the diameter is 4. Read from the figure: the diameter at x is the height of the region there; at x = 2 the region runs from y = 0 up to y = 4, a height of 4 (at x = 0 it is 6, and it shrinks steadily to 0 at x = 6). The cross-section has area 2π at x = 2.',
  },
  {
    t: 'ratio of two square cross-sections perpendicular to the y-axis', d: 3, need: 'calc',
    spec: between('4', 'x^2', -2, 2, [-3, 3], [-1, 5]),
    alt: 'A shaded bowl-shaped region: its top edge is a horizontal line and its lower edge is a parabola that opens upward with its lowest point at the origin.',
    q: 'The shaded region shown, between a parabola and a horizontal line, is the base of a solid. Each cross-section of the solid perpendicular to the y-axis is a square with one side lying across the base. How many times as large as the area of the cross-section at y = 1 is the area of the cross-section at y = 4?',
    n: '4',
    calc: ['the width of the region at height y is the distance between the two solutions of lower(x) = y (bisection on the spec\'s expression); the key is (width at 4)² ÷ (width at 1)²', (c) => {
      const r = regionOf(c);
      const half = (y: number): number => { let a = 0; let b = r.to; for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (r.lo(m) < y) a = m; else b = m; } return (a + b) / 2; };
      return round((2 * half(4)) ** 2 / (2 * half(1)) ** 2, 6);
    }],
    h: ['A cross-section perpendicular to the y-axis is horizontal: its side is the WIDTH of the region at that height, measured left to right.', 'Read the two ends of the region at each height from the grid, find each side length, and compare the squares of the side lengths.'],
    s: 'A cross-section perpendicular to the y-axis lies along a horizontal line, so the side of each square is the width of the region at that height. Read from the figure: at y = 1 the region runs from x = −1 to x = 1, a width of 2, so the square has area 4; at y = 4 it runs from x = −2 to x = 2, a width of 4, so the square has area 16. The ratio is 16 / 4 = 4.',
  },
]);

// ── Concavity and Inflection Points (pack 140) ──────────────────────────────

G('d1d61003.lo-2', 'Concavity read from the graph of f′ and from a shifted f″', [
  {
    t: 'interval where f is increasing and concave down, from the graph of f′', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-2, 6], yRange: [-5, 5], curves: [{ expr: '4 - (x - 2)^2', label: 'f′' }] }),
    alt: 'A parabola opening downward on a grid, labelled as the derivative of f. It crosses the x-axis twice, and its highest point is above the x-axis between the two crossings.',
    q: 'The graph of f′, the derivative of a function f, is shown. On which interval is the graph of f both increasing and concave down?',
    o: [['(2, 4)', 'correct'], ['(0, 2)', 'takes the part where f′ is rising: f is increasing there but concave up'], ['(0, 4)', 'uses only the sign of f′: f is increasing there, but not concave down throughout'], ['(2, 6)', 'uses only where f′ is falling: f is concave down there, but not increasing throughout']],
    holds: ['for each interval: f′ > 0 and f″ < 0 (the slope of the spec\'s expression) at every point along it', (() => {
      const ok = (a: number, b: number) => (c: Ctx) => { const f1 = fOf(c); return allAlong(a, b, (x) => f1(x) > 0 && dAt(f1, x) < 0); };
      return [ok(2, 4), ok(0, 2), ok(0, 4), ok(2, 6)];
    })()],
    h: ['f is increasing where f′ is positive — where this graph is above the x-axis.', 'f is concave down where f″ is negative, and f″ is the slope of the graph you are given.'],
    s: 'Read from the graph: f′ is positive between its zeros, on (0, 4), so f is increasing there. f is concave down where f″ < 0, that is where the graph of f′ is falling: to the right of its highest point, for x > 2. Both conditions hold on (2, 4).',
  },
  {
    t: 'interval where f(x) − 3x² is concave up, from the graph of f″', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-3, 3], yRange: [-4, 9], curves: [{ expr: '8 - 2x^2', label: 'f″' }] }),
    alt: 'A parabola opening downward on a grid, labelled as the second derivative of f. Its highest point is on the y-axis, well above the x-axis, and it crosses the x-axis twice.',
    q: 'The graph of f″, the second derivative of a function f, is shown. Let g(x) = f(x) − 3x². On which interval(s) is the graph of g concave up?',
    o: [['(−1, 1)', 'correct'], ['(−2, 2)', 'uses the sign of f″ itself and ignores the term −3x²'], ['(−∞, −1) and (1, ∞)', 'has the inequality the wrong way round'], ['(−3, 0)', 'takes where the graph of f″ is rising']],
    holds: ['g″ = f″ − 6 from the spec\'s expression: the option holds when its intervals are exactly where g″ > 0 inside the plotted window', (() => {
      const is = (...iv: Array<[number, number]>) => (c: Ctx) => { const f2 = fOf(c); return sameSet([-3, 3], iv, (x) => f2(x) - 6 > 0); };
      return [is([-1, 1]), is([-2, 2]), is([-3, -1], [1, 3]), is([-3, 0])];
    })()],
    h: ['Differentiate g twice: the term −3x² contributes a constant to g″.', 'g is concave up where g″ > 0. Turn that into a condition on the HEIGHT of the graph you are given, and read where the graph meets that height.'],
    s: 'g″(x) = f″(x) − 6, so g is concave up where f″(x) > 6. Read from the graph: f″ is at height 6 at x = −1 and at x = 1, and above 6 between them. So the graph of g is concave up on (−1, 1). (The interval (−2, 2), where f″ > 0, is where f itself is concave up.)',
  },
]);

G('d1d61003.lo-4', 'Inflection points from the graph of f′ and from the factors of f″', [
  {
    t: 'slope of f at the inflection point where concavity goes from up to down', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-5, 3], yRange: [-3, 5], curves: [{ expr: '(2/9)*(x - 1)^2*(x + 3.5)', label: 'f′' }] }),
    alt: 'A smooth curve on a grid, labelled as the derivative of f. It rises from below the x-axis to a rounded top, falls back until it just touches the x-axis, and then rises again and leaves the top of the grid.',
    q: 'The graph of f′, the derivative of a function f, is shown. The graph of f has two inflection points. What is the slope of the graph of f at the inflection point where its concavity changes from concave up to concave down?',
    n: '3',
    calc: ['the whole-number x in the plot where the spec\'s expression has a local maximum (its slope goes from + to −); the key is the value of the expression there', (c) => {
      const f1 = fOf(c); const tops = grid(-5, 3, 1).filter((x) => Math.abs(dAt(f1, x)) < 1e-6 && dAt(f1, x - 0.01) > 0 && dAt(f1, x + 0.01) < 0);
      if (tops.length !== 1) throw new Error(`tops ${tops}`);
      return round(f1(tops[0]), 6);
    }],
    h: ['f is concave up where f′ is increasing and concave down where f′ is decreasing, so the inflection points of f are at the turning points of this graph.', 'Decide which turning point matches "up, then down" — and remember what the HEIGHT of this graph tells you about f.'],
    s: 'f changes concavity where f′ changes from increasing to decreasing or back, at the turning points of the graph shown. Read from the graph: f′ has a local maximum at x = −2 (f′ increasing, then decreasing: concave up, then concave down) and a local minimum at x = 1 (the other inflection point). The slope of f at x = −2 is the height of the graph there: f′(−2) = 3.',
  },
  {
    t: 'inflection points when f″ is a product of two charted factors', d: 3, need: 'reason',
    spec: schart([-2, 1, 4], [{ label: 'p(x)', signs: ['+', '-', '+', '+'], at: ['0', '0', '+'] }, { label: 'q(x)', signs: ['+', '+', '-', '+'], at: ['+', '0', '0'] }]),
    hide: [-2, 4],
    alt: 'A sign chart with two rows, for two functions p and q, and three critical numbers (only one is listed here). Each row gives a sign on every interval; each function is zero at two of the three critical numbers and positive at the other.',
    q: 'For a function f, the second derivative is f″(x) = p(x)·q(x). The sign chart shown gives the signs of the two factors p and q. At which values of x does the graph of f have an inflection point?',
    o: [['x = −2 and x = 4 only', 'correct'], ['x = −2, x = 1 and x = 4', 'takes every zero of f″ as an inflection point'], ['x = 1 only', 'picks the number where both factors change sign'], ['x = −2 and x = 1 only', 'follows the sign changes of p alone']],
    holds: ['the sign of f″ on each interval is the product of the two rows\' signs; the option holds when its list is exactly the critical numbers where that product changes sign', (() => {
      const infl = (c: Ctx): number[] => { const p = chartRow(c, 0).signs; const q = chartRow(c, 1).signs; const s2 = p.map((v, i) => v * q[i]); return crit(c).filter((_, i) => s2[i] * s2[i + 1] < 0); };
      const is = (list: number[]) => (c: Ctx) => JSON.stringify(infl(c)) === JSON.stringify(list);
      return [is([-2, 4]), is([-2, 1, 4]), is([1]), is([-2, 1])];
    })()],
    h: ['Build a third row for f″: on each interval its sign is the product of the two signs above.', 'An inflection point needs f″ to CHANGE sign, not just to be zero. Compare the sign of the product on the two sides of each critical number.'],
    s: 'Read from the chart and multiply the signs interval by interval: left of −2, (+)(+) = +; between −2 and 1, (−)(+) = −; between 1 and 4, (+)(−) = −; right of 4, (+)(+) = +. So f″ changes sign at −2 (+ to −) and at 4 (− to +), but not at 1, where both factors change sign together and the product stays negative. The inflection points are at x = −2 and x = 4 only.',
  },
]);

// ── Area Between Curves Integration (pack 141) ──────────────────────────────

G('d3878367.lo-3', 'Area when the curves cross, and when the equations must be found first', [
  {
    t: 'total area between two lines that cross inside the interval', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-1, 7], yRange: [-3, 5], curves: [{ expr: 'x/2 + 1', label: 'f' }, { expr: '4 - x', label: 'g', dashed: true }] }),
    alt: 'Two straight lines on a grid: a solid rising line called f and a dashed falling line called g. They cross once, in the first quadrant, between the left and right edges of the grid.',
    q: 'The graph shows two lines, f (solid) and g (dashed). What is the total area of the two regions that lie between the lines from x = 0 to x = 6, in square units?',
    n: '15',
    calc: ['the integral of |f − g| from 0 to 6 with the spec\'s two expressions (the split point is where they cross: curves_intersection)', (c) => {
      const [f, g] = [fOf(c, 0), fOf(c, 1)]; const x0 = c.num('curves_intersection', { a: 0, b: 1, want: 'only' });
      return round(Math.abs(integral((x) => f(x) - g(x), 0, x0)) + Math.abs(integral((x) => f(x) - g(x), x0, 6)), 6);
    }],
    alts: ['the two regions as triangles (½ · base · height) from the readings 3, 2, 6 and 4', () => [0.5 * 3 * 2 + 0.5 * 6 * 4]],
    h: ['Check which line is on top at x = 0 and at x = 6: it is not the same one.', 'Split the interval where the lines cross and find the area of each part separately, so that neither part is counted as negative.'],
    s: 'Read from the graph: the lines cross at x = 2. From 0 to 2, g is on top: the gap is 3 at x = 0 and 0 at x = 2, a triangle of area ½ · 2 · 3 = 3. From 2 to 6, f is on top: the gap grows from 0 to 4 − (−2) = 6 at x = 6, a triangle of area ½ · 4 · 6 = 12. The total area is 3 + 12 = 15. (Integrating f − g straight across from 0 to 6 would give 12 − 3 = 9, which is not an area.)',
  },
  {
    t: 'area between a parabola and a line whose equations are read from the grid', d: 3, need: 'calc',
    spec: between('4x - x^2', 'x', 0, 3, [-1, 5], [-1, 5]),
    alt: 'A shaded region between a parabola that opens downward and a straight line through the origin. The two meet at the origin and at one point further right; the parabola lies above the line between those points.',
    q: 'The shaded region shown lies between a parabola (above) and a line (below). The two meet at the origin and at one other point, and the highest point of the parabola is at a grid point. What is the area of the shaded region, in square units?',
    n: '4.5',
    calc: ['the integral of (upper − lower) between the bounds, with the spec\'s own expressions', (c) => { const r = regionOf(c); if (!near(r.up(r.from), r.lo(r.from)) || !near(r.up(r.to), r.lo(r.to))) throw new Error('the boundaries do not meet at the bounds'); return round(integral((x) => r.up(x) - r.lo(x), r.from, r.to), 4); }],
    h: ['Find the equation of each boundary from points on the grid: the line from its slope, the parabola from its zeros and its highest point.', 'Integrate (upper − lower) between the two x-values where the boundaries meet.'],
    s: 'Read from the figure: the line passes through (0, 0) and (3, 3), so it is y = x. The parabola has zeros at x = 0 and x = 4 and its highest point at (2, 4), so it is y = x(4 − x) = 4x − x². They meet at x = 0 and x = 3. Area = ∫₀³ [(4x − x²) − x] dx = ∫₀³ (3x − x²) dx = [3x²/2 − x³/3]₀³ = 13.5 − 9 = 4.5.',
  },
]);

// ── Limits involving infinity (pack 144) ────────────────────────────────────

G('e7957044.lo-3', 'Constants recovered from asymptotes, and the asymptotes of a reciprocal', [
  {
    t: 'the constant b of (ax + b)/(x + c) from both asymptotes and a zero', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-4, 8], yRange: [-3, 9], curves: [{ expr: '(3x - 3)/(x - 2)' }], asymptotes: [{ x: 2 }, { y: 3 }] }),
    alt: 'A curve in two branches with a vertical and a horizontal dashed asymptote. The left branch lies below the horizontal asymptote and crosses both axes; the right branch lies above it, in the first quadrant.',
    q: 'The graph of f(x) = (ax + b)/(x + c) is shown with its asymptotes (the dashed lines), where a, b and c are constants. What is the value of b?',
    n: '-3',
    calc: ['c from the vertical asymptote and a from the horizontal one (spec), then b = −a · (the zero of the curve, curve_zeros); checked: (ax + b)/(x + c) equals the spec\'s expression at ten points', (c) => {
      const as = arr(c.p.asymptotes); const cc = -(as.find((k) => k.x !== undefined)!.x as number); const a = as.find((k) => k.y !== undefined)!.y as number;
      const x0 = c.num('curve_zeros', { curve: 0, want: 'only' }); const b = -a * x0; const f = fOf(c);
      for (const x of [-3, -2, -1, 0, 1, 3, 4, 5, 6, 7]) if (!near((a * x + b) / (x + cc), f(x), 1e-9)) throw new Error('not the same function');
      return b;
    }],
    h: ['The vertical asymptote tells you where the denominator is zero; the horizontal asymptote is the limit of f(x) as x → ±∞, which depends only on the leading coefficients.', 'Once a is known, use the point where the graph crosses the x-axis: the numerator is zero there.'],
    s: 'Read from the graph: the vertical asymptote is x = 2, where the denominator x + c is zero, so c = −2. The horizontal asymptote is y = 3; as x → ±∞, (ax + b)/(x + c) → a, so a = 3. The graph crosses the x-axis at x = 1, where the numerator is zero: 3(1) + b = 0, so b = −3. (Check with another point: f(3) = (9 − 3)/(3 − 2) = 6, as on the graph.)',
  },
  {
    t: 'asymptotes of 1/f from the zeros and asymptotes of f', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 6], yRange: [-4, 6], curves: [{ expr: '2/(x - 1)^2 - 2', label: 'f' }], asymptotes: [{ x: 1 }, { y: -2 }] }),
    alt: 'A curve labelled f in two branches, one on each side of a vertical dashed asymptote; both branches shoot upward beside it. Away from it each branch comes down through the x-axis and levels off just above a horizontal dashed asymptote that lies below the x-axis.',
    q: 'The graph of a function f is shown with its asymptotes (the dashed lines). Let g(x) = 1/f(x). Which describes the asymptotes of the graph of g?',
    o: [
      ['Vertical: x = 0 and x = 2; horizontal: y = −1/2', 'correct'],
      ['Vertical: x = 1; horizontal: y = −1/2', 'keeps the vertical asymptote of f, where 1/f in fact approaches 0'],
      ['Vertical: x = 0 and x = 2; horizontal: y = −2', 'keeps the horizontal asymptote of f instead of taking its reciprocal'],
      ['Vertical: x = 1; horizontal: y = −2', 'gives the asymptotes of f itself'],
    ],
    holds: ['from the spec: 1/f is unbounded exactly at the zeros of f (curve_zeros) and stays bounded at the vertical asymptote of f; 1/f(x) at x = ±10⁶ gives the horizontal asymptote', (() => {
      const facts = (c: Ctx) => { const f = fOf(c); const zeros = c.txt('curve_zeros', { curve: 0, want: 'all' }).split(',').map((v) => Number(v.trim().replace('−', '-'))); const va = [-3, -2, -1, 0, 1, 2, 3, 4, 5].filter((x) => Math.abs(1 / f(x + 1e-7)) > 1e5); if (JSON.stringify(va) !== JSON.stringify(zeros)) throw new Error(`zeros ${zeros} against ${va}`); return { va, ha: round(1 / f(1e6), 4) }; };
      const is = (va: number[], ha: number) => (c: Ctx) => { const k = facts(c); return JSON.stringify(k.va) === JSON.stringify(va) && near(k.ha, ha, 1e-4); };
      return [is([0, 2], -0.5), is([1], -0.5), is([0, 2], -2), is([1], -2)];
    })()],
    h: ['1/f(x) becomes unbounded where f(x) approaches 0, not where f(x) itself becomes unbounded. What does 1/f approach near the vertical asymptote of f?', 'For the horizontal asymptote of g, take the limit of f(x) as x → ±∞ from the graph and then take its reciprocal.'],
    s: 'Read from the graph: f(x) = 0 at x = 0 and at x = 2, so 1/f(x) is unbounded there: g has vertical asymptotes x = 0 and x = 2. Near x = 1, f(x) → +∞, so g(x) → 0: no asymptote there. As x → ±∞, f(x) → −2 (the horizontal asymptote), so g(x) → 1/(−2) = −1/2: the horizontal asymptote of g is y = −1/2.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP CHEMISTRY
// ════════════════════════════════════════════════════════════════════════════

/** Molecules. */
const mols = (molecules: P[], extra: P = {}): Spec => S('molecular_structure', { molecules, ...extra });
const at = (id: string, el: string, extra: P = {}): P => ({ id, el, ...extra });
const bd = (a: string, b: string, order = 1): P => ({ a, b, order });
/** Hybridisation of an atom of a molecule, from the mol_vsepr checker. */
const hyb = (c: Ctx, atom: string, molecule = 0): string => c.txt('mol_vsepr', { want: 'hybridisation', atom, molecule });
const molAtoms = (c: Ctx, molecule = 0): P[] => arr(arr(c.p.molecules)[molecule].atoms);
const molBonds = (c: Ctx, molecule = 0): P[] => arr(arr(c.p.molecules)[molecule].bonds);
/** Galvanic cells. */
const cell = (left: P, right: P, anode: 'left' | 'right', extra: P = {}): Spec => S('electrochemical_cell', { left, right, anode, ...extra });
/** A Maxwell–Boltzmann-shaped curve with its peak at speed p and height a. */
const mb = (a: number, p: number): string => `${a}*(x/${p})^2*exp(1 - (x/${p})^2)`;
const peakOf = (f: (x: number) => number, xMax: number): number => { let best = 0; for (let x = 0; x <= xMax; x += xMax / 24000) if (f(x) > f(best)) best = x; return best; };

// ── Collision Theory and Activation Energy (pack 152) ───────────────────────

G('27b58964.lo-3', 'Speed distributions of two gases, and of samples that differ in amount', [
  {
    t: 'molar mass of a second gas from the two most probable speeds', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 3000], yRange: [0, 5], xStep: 500, yStep: 1, curves: [{ expr: mb(4, 500), label: 'P' }, { expr: mb(2, 1000), label: 'Q' }], xLabel: 'Molecular speed (m/s)', yLabel: 'Relative number of molecules' }),
    alt: 'Two humped curves that both start at the origin. Curve P is tall and narrow with its peak at a low speed; curve Q is lower and broader with its peak further to the right and a long tail.',
    q: 'Curves P and Q in the graph show the distribution of molecular speeds in samples of two different gases at the same temperature. The gas of curve Q is helium (molar mass 4.0 g/mol). What is the molar mass of the gas of curve P, in g/mol?',
    n: '16',
    calc: ['4.0 × (peak speed of Q ÷ peak speed of P)², the peak speeds found on the spec\'s two expressions', (c) => { const vP = peakOf(fOf(c, 0), 3000); const vQ = peakOf(fOf(c, 1), 3000); return round(4.0 * (vQ / vP) ** 2, 3); }],
    h: ['At the same temperature the molecules of two gases have the same average kinetic energy, ½mv².', 'Read the speed at the peak of each curve. With the kinetic energies equal, work out how the mass must differ when the typical speed differs by that factor.'],
    s: 'Read from the graph: the peak of curve P is at 500 m/s and the peak of curve Q at 1000 m/s, so the molecules of Q are typically twice as fast. At the same temperature the average kinetic energy ½mv² is the same for both gases, so mv² is the same: a speed that is 2 times smaller means a mass that is 2² = 4 times larger. The molar mass of P is 4 × 4.0 = 16 g/mol (methane, for example).',
  },
  {
    t: 'temperature and amount of three samples from peak position and area', d: 3, need: 'reason',
    spec: fgraph({ xRange: [0, 2400], yRange: [0, 5], xStep: 400, yStep: 1, curves: [{ expr: mb(4, 400), label: 'I' }, { expr: mb(2, 400), label: 'II' }, { expr: mb(2, 800), label: 'III' }], xLabel: 'Molecular speed (m/s)', yLabel: 'Number of molecules' }),
    alt: 'Three humped curves of different heights and widths, drawn in different line styles on one grid of number of molecules against molecular speed. All three start at the origin and die away at high speed.',
    q: 'Curves I, II and III in the graph show the distribution of molecular speeds in three samples of the same gas. Which statement about the samples is correct?',
    o: [
      ['I and II are at the same temperature and II has fewer molecules; III is hotter', 'correct'],
      ['II and III are at the same temperature and I is colder', 'takes equal peak heights to mean equal temperatures'],
      ['I is the hottest sample and II and III are equally cold', 'reads the height of the peak as the temperature'],
      ['All three are at the same temperature and differ only in the number of molecules', 'ignores the position of the peak'],
    ],
    holds: ['from the spec\'s three expressions: the temperature order is the order of the peak speeds, the number of molecules is the area under the curve', (() => {
      const k = (c: Ctx) => [0, 1, 2].map((i) => ({ v: round(peakOf(fOf(c, i), 2400), 0), n: integral(fOf(c, i), 0, 12000, 24000) }));
      return [
        (c: Ctx) => { const [a, b, d] = k(c); return a.v === b.v && b.n < a.n * 0.99 && d.v > a.v; },
        (c: Ctx) => { const [a, b, d] = k(c); return b.v === d.v && a.v < b.v; },
        (c: Ctx) => { const [a, b, d] = k(c); return a.v > b.v && a.v > d.v && b.v === d.v; },
        (c: Ctx) => { const [a, b, d] = k(c); return a.v === b.v && b.v === d.v; },
      ];
    })()],
    h: ['For one gas, the speed at which the curve peaks depends only on the temperature.', 'The total number of molecules in a sample is shown by the area under its curve, not by the height of its peak.'],
    s: 'Read from the graph: curves I and II peak at the same speed (400 m/s), so those samples are at the same temperature; II is half as tall at every speed, so it has half the area — fewer molecules. Curve III peaks at a higher speed (800 m/s), so that sample is hotter; its peak is lower only because the same kind of distribution is spread over a wider range of speeds.',
  },
]);

// ── Hybridization, sigma, and pi bonds (pack 154) ───────────────────────────

G('29bb74a4.lo-1', 'What the hybridisation of each carbon implies for the molecule', [
  {
    t: 'carbon atoms that must be collinear', d: 3, need: 'reason',
    spec: mols([{ atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('C2', 'C', { x: 1.3, y: 0, lonePairs: 0 }), at('C3', 'C', { x: 2.5, y: 0, lonePairs: 0 }), at('C4', 'C', { x: 3.7, y: 0, h: 1, lonePairs: 0 }), at('C5', 'C', { x: 4.9, y: 0, h: 2, lonePairs: 0 })], bonds: [bd('C1', 'C2'), bd('C2', 'C3', 3), bd('C3', 'C4'), bd('C4', 'C5', 2)] }]),
    alt: 'A chain of five carbon atoms drawn in a row, with hydrogens written beside three of them; the left-hand end is printed H₃C. Reading along the chain the bonds are a single bond, a triple bond, a single bond and a double bond.',
    q: 'The structure of a molecule is shown, with the hydrogen atoms written beside the carbon they are bonded to; it is drawn in a row without regard to the true shape. In the real molecule, how many of the five carbon atoms must lie on one straight line?',
    n: '4',
    calc: ['every carbon that is sp-hybridised (mol_vsepr) together with the atoms bonded to it; the carbons in that set, checked to form one unbroken run of the chain', (c) => {
      const cs = molAtoms(c).map((a) => a.id as string); const sp = cs.filter((id) => hyb(c, id) === 'sp');
      const line = new Set<string>(sp);
      for (const b of molBonds(c)) { if (sp.includes(b.a as string)) line.add(b.b as string); if (sp.includes(b.b as string)) line.add(b.a as string); }
      const idx = [...line].map((id) => cs.indexOf(id)).sort((x, y) => x - y);
      if (sp.length !== 2 || idx.some((v, i) => i > 0 && v !== idx[i - 1] + 1)) throw new Error('not one run');
      return line.size;
    }],
    h: ['Find the hybridisation of each carbon from the number of electron domains around it (count a double or triple bond as one domain).', 'A carbon with two electron domains and the two atoms bonded to it lie on one line. See whether two such lines join into a single one.'],
    s: 'Read from the structure: the second and third carbons are joined by a triple bond and each has just one other bond, so each has two electron domains: sp hybridised, with bond angles of 180°. The first carbon (CH₃) is sp³ and the last two (CH= and =CH₂) are sp². Carbon 2 is in line with carbons 1 and 3, and carbon 3 is in line with carbons 2 and 4, so carbons 1, 2, 3 and 4 share one straight line. The angle at carbon 4 (sp²) is about 120°, so carbon 5 is off the line. Four carbons are collinear.',
  },
  {
    t: 'σ bonds that involve an sp² carbon', d: 3, need: 'reason',
    spec: mols([{ atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('C2', 'C', { x: 1.3, y: 0, h: 1, lonePairs: 0 }), at('C3', 'C', { x: 2.6, y: 0, h: 1, lonePairs: 0 }), at('C4', 'C', { x: 3.9, y: 0, h: 1, lonePairs: 0 }), at('O', 'O', { x: 5.1, y: 0, lonePairs: 2 })], bonds: [bd('C1', 'C2'), bd('C2', 'C3', 2), bd('C3', 'C4'), bd('C4', 'O', 2)] }]),
    alt: 'A chain of four carbon atoms and one oxygen atom drawn in a row, with hydrogens written beside each carbon (the left-hand end is printed H₃C) and two lone pairs on the oxygen. Reading along the chain the bonds are single, double, single and double.',
    q: 'The structure of a molecule is shown, with the hydrogen atoms written beside the carbon they are bonded to. In this molecule, how many σ (sigma) bonds have an sp²-hybridised CARBON atom at one end or at both ends?',
    n: '7',
    calc: ['each drawn bond (one σ bond each, whatever its order) and each written hydrogen (one σ bond each) is counted when a carbon at one of its ends is sp² (mol_vsepr)', (c) => {
      const isSp2 = new Map(molAtoms(c).map((a) => [a.id as string, a.el === 'C' && hyb(c, a.id as string) === 'sp2']));
      const txt = molAtoms(c).filter((a) => a.el === 'C').map((a) => hyb(c, a.id as string));
      if (JSON.stringify(txt) !== JSON.stringify(['sp3', 'sp2', 'sp2', 'sp2'])) throw new Error(`hybridisations ${txt}`);
      return molBonds(c).filter((b) => isSp2.get(b.a as string) || isSp2.get(b.b as string)).length + molAtoms(c).filter((a) => isSp2.get(a.id as string)).reduce((t, a) => t + ((a.h as number) ?? 0), 0);
    }],
    h: ['Decide the hybridisation of each carbon first. Every bond between two atoms — single or double — contains exactly one σ bond.', 'Remember the bonds to the hydrogen atoms that are only written beside a carbon; leave out a bond if neither of its ends is an sp² carbon.'],
    s: 'Read from the structure: the first carbon (CH₃, four single bonds) is sp³; the other three carbons each have three electron domains, so they are sp². Count one σ bond for each connection that touches an sp² carbon: C1–C2, C2=C3, C3–C4 and C4=O (4 bonds), plus the C–H bond on each of C2, C3 and C4 (3 bonds). The three C–H bonds of the CH₃ group join an sp³ carbon to hydrogen and are not counted. Total: 7.',
  },
]);

// ── Heat of Phase Changes Calculations (pack 159) ───────────────────────────

G('3aa75ee5.lo-1', 'Enthalpies of fusion and vaporization run backwards, and per mole against per gram', [
  {
    t: 'heat released from gas at the boiling point to solid at the melting point, scaled to one mole', d: 3, need: 'calc',
    spec: S('heating_curve', { corners: [[0, -20], [2, 20], [6, 20], [10, 80], [22, 80], [24, 110]], xStep: 2, yStep: 20 }),
    alt: 'A heating curve of temperature against heat added, with five straight segments: a rise, a short flat part, a second rise, a long flat part and a final rise.',
    q: 'The heating curve shown is for 0.25 mol of a pure substance X heated at constant pressure. How much heat, in kJ, is released when 1.0 mol of gaseous X at its boiling point is converted completely to solid X at its melting point?',
    n: '80',
    calc: ['(heat at the end of the second flat run − heat at the start of the first flat run, from the spec\'s corners) × 1.0 mol ÷ 0.25 mol', (c) => {
      const k = c.p.corners as number[][]; const flats = k.slice(1).map((q, i) => ({ a: k[i], b: q })).filter((sgm) => sgm.a[1] === sgm.b[1]);
      if (flats.length !== 2) throw new Error('needs two plateaus');
      return (flats[1].b[0] - flats[0].a[0]) * (1.0 / 0.25);
    }],
    h: ['The change described runs part of this curve backwards. Decide which segments of the curve it covers: every one between the two states named.', 'The curve is for 0.25 mol. Scale the heat you read to the amount in the question.'],
    s: 'Going from gas at the boiling point to solid at the melting point reverses three segments of the curve: condensing (the long flat part), cooling the liquid, and freezing (the short flat part). Read from the graph: the short flat part begins at 2 kJ and the long flat part ends at 22 kJ, so these three segments together take 22 − 2 = 20 kJ for 0.25 mol (4 kJ to melt, 4 kJ to warm the liquid, 12 kJ to vaporise). The reverse change releases the same amount; for 1.0 mol it is 20 × 4 = 80 kJ.',
  },
  {
    t: 'molar enthalpies of vaporization of two liquids compared from boiling times', d: 3, need: 'reason',
    spec: fgraph({ xRange: [0, 10], yRange: [0, 100], xStep: 1, yStep: 10, xLabel: 'Time (min)', yLabel: 'Temperature (°C)', curves: [
      { expr: '20 + 20x', domain: [0, 2], label: 'X', color: BLUE }, { expr: '60', domain: [2, 8], color: BLUE }, { expr: '60 + 10*(x - 8)', domain: [8, 10], color: BLUE },
      { expr: '20 + 10x', domain: [0, 5], label: 'Y', color: '#b45309', dashed: true }, { expr: '70', domain: [5, 8], color: '#b45309', dashed: true }, { expr: '70 + 5*(x - 8)', domain: [8, 10], color: '#b45309', dashed: true }] }),
    alt: 'Two temperature–time graphs on one grid, a solid one for X and a dashed one for Y. Each rises, stays level for a while and then rises again; the two level parts are at different temperatures and have different lengths.',
    q: 'Equal masses of two liquids, X and Y, are warmed by identical heaters that supply heat at the same constant rate; the graph shows their temperatures. The molar mass of Y is three times the molar mass of X. Which liquid has the larger MOLAR enthalpy of vaporization, and by what factor?',
    o: [['Y, by a factor of 1.5', 'correct'], ['X, by a factor of 2', 'compares the heats per gram and stops there'], ['Y, by a factor of 3', 'uses the ratio of the molar masses alone'], ['X, by a factor of 6', 'divides by the molar mass where it should multiply']],
    calc: ['boiling time = length of each curve\'s level piece (spec); per mole = per gram × molar mass, with M(Y) = 3 M(X)', (c) => {
      const flat = (i: number): number => { const k = arr(c.p.curves)[i]; const d = k.domain as number[]; if (!/^\d+$/.test(k.expr as string)) throw new Error('not a level piece'); return d[1] - d[0]; };
      const ratio = (flat(4) * 3) / (flat(1) * 1); // Y per mole ÷ X per mole
      return ratio > 1 ? `Y, by a factor of ${round(ratio, 3)}` : `X, by a factor of ${round(1 / ratio, 3)}`;
    }],
    h: ['While a liquid boils its temperature stays constant. At a constant heating rate, the time that takes measures the heat needed to vaporise the whole sample.', 'The samples have equal masses, not equal numbers of moles. Convert each heat per gram to a heat per mole before comparing.'],
    s: 'Read from the graph: X boils (its level part) from 2 min to 8 min, 6 min; Y boils from 5 min to 8 min, 3 min. With equal heating rates and equal masses, X needs twice as much heat per gram as Y. Per mole, multiply by the molar mass: X needs 2 × M and Y needs 1 × 3M = 3M (in the same units). So Y has the larger molar enthalpy of vaporization, by a factor of 3M / 2M = 1.5.',
  },
]);

// ── VSEPR Theory and Molecular Geometry (pack 162) ──────────────────────────

/** Valence electrons of the candidate central atoms. */
const VALENCE: Record<string, number> = { Boron: 3, Nitrogen: 5, Phosphorus: 5, Chlorine: 7 };

G('4354050b.lo-4', 'From a molecular shape back to the lone pairs, and two bent molecules', [
  {
    t: 'the central atom of a T-shaped XF₃', d: 3, need: 'reason',
    spec: mols([{ atoms: [at('X', 'Cl', { x: 0, y: 0, lonePairs: 2, show: { label: 'blank', lonePairs: 'none' } }), at('F1', 'F', { from: 'X', angle: 180, lonePairs: 3 }), at('F2', 'F', { from: 'X', angle: 90, lonePairs: 3 }), at('F3', 'F', { from: 'X', angle: 0, lonePairs: 3 })], bonds: [bd('X', 'F1'), bd('X', 'F2'), bd('X', 'F3')], center: 'X' }]),
    hide: ['Cl'],
    alt: 'A central atom shown as a blank box with three fluorine atoms bonded to it: one to the left, one to the right and one straight up, so that the bonds make the letter T. Each fluorine has three lone pairs; nothing is drawn on the central atom.',
    q: 'The diagram shows the true arrangement of the atoms in a molecule XF₃: all four atoms lie in the plane of the page. The central atom X is shown as a blank box, and any lone pairs on it are not drawn. Which element could X be?',
    o: [['Chlorine', 'correct'], ['Boron', 'no lone pair on the central atom: BF₃ is trigonal planar, with 120° angles'], ['Nitrogen', 'one lone pair: NF₃ is trigonal pyramidal, not planar'], ['Phosphorus', 'one lone pair: PF₃ is trigonal pyramidal, not planar']],
    holds: ['the drawn F–X–F angles are 90°, 90° and 180° (spec): a T shape, which needs five electron domains with two lone pairs; for each candidate, lone pairs on X = (valence electrons − 3) ÷ 2', (() => {
      const tShaped = (c: Ctx) => JSON.stringify(molAtoms(c).filter((a) => a.el === 'F').map((a) => a.angle).sort()) === JSON.stringify([0, 180, 90]);
      const fits = (name: string) => (c: Ctx) => tShaped(c) && (VALENCE[name] - 3) / 2 === 2 && c.txt('mol_vsepr', { want: 'molecular_geometry', atom: 'X' }) === 'T-shaped';
      return [fits('Chlorine'), fits('Boron'), fits('Nitrogen'), fits('Phosphorus')];
    })()],
    h: ['Name the shape first, from the angles between the bonds. Then ask which arrangement of electron domains around X leaves three atoms in that shape.', 'Once you know how many lone pairs X must carry, count the valence electrons X needs: one for each bond to fluorine and two for each lone pair.'],
    s: 'Read from the diagram: the three X–F bonds make angles of 90°, 90° and 180° in one plane — a T shape. Three bonded atoms in a T shape come from five electron domains (trigonal bipyramidal) with two of them lone pairs. So X has 3 bonding pairs and 2 lone pairs: it supplies 3 + 4 = 7 valence electrons, as a halogen does. Chlorine fits (ClF₃). Boron has no lone pair (trigonal planar, 120°), and nitrogen and phosphorus have one (trigonal pyramidal).',
  },
  {
    t: 'electron-domain geometries behind two bent molecules', d: 3, need: 'reason',
    spec: mols([
      { atoms: [at('S', 'S', { lonePairs: 1 }), at('O1', 'O', { lonePairs: 2 }), at('O2', 'O', { lonePairs: 2 })], bonds: [bd('S', 'O1', 2), bd('S', 'O2', 2)], layout: { type: 'bent', center: 'S', around: ['O1', 'O2'], angle: 112 }, center: 'S', label: 'I' },
      { atoms: [at('O', 'O', { lonePairs: 2 }), at('F1', 'F', { lonePairs: 3 }), at('F2', 'F', { lonePairs: 3 })], bonds: [bd('O', 'F1'), bd('O', 'F2')], layout: { type: 'bent', center: 'O', around: ['F1', 'F2'], angle: 112 }, center: 'O', label: 'II' },
    ]),
    alt: 'Two bent three-atom molecules side by side, drawn with the same angle. In I a sulfur atom with one lone pair is double-bonded to two oxygen atoms; in II an oxygen atom with two lone pairs is single-bonded to two fluorine atoms.',
    q: 'The Lewis structures of two bent molecules, I and II, are shown; both are drawn with the same angle, not with their true angles. What is the electron-domain geometry around each central atom, and in which molecule is the true bond angle larger?',
    o: [
      ['I: trigonal planar; II: tetrahedral; the angle is larger in I', 'correct'],
      ['I: tetrahedral; II: tetrahedral; the angles are about equal', 'counts each double bond in I as two electron domains'],
      ['I: trigonal planar; II: trigonal planar; the angles are about equal', 'counts only one of the lone pairs on the central atom of II'],
      ['I: tetrahedral; II: trigonal planar; the angle is larger in II', 'exchanges the two molecules'],
    ],
    holds: ['electron-domain geometry of each central atom from mol_vsepr; the ideal angle is 120° for trigonal planar and 109.5° for tetrahedral', (() => {
      const g = (c: Ctx, m: number) => c.txt('mol_vsepr', { want: 'electron_geometry', molecule: m }).toLowerCase().replace(/[_-]/g, ' ');
      const ang = (name: string) => (name === 'trigonal planar' ? 120 : name === 'tetrahedral' ? 109.5 : NaN);
      const is = (g1: string, g2: string, larger: 'I' | 'II' | 'equal') => (c: Ctx) => { const [a, b] = [g(c, 0), g(c, 1)]; const real = ang(a) > ang(b) ? 'I' : ang(a) < ang(b) ? 'II' : 'equal'; return a === g1 && b === g2 && real === larger; };
      return [is('trigonal planar', 'tetrahedral', 'I'), is('tetrahedral', 'tetrahedral', 'equal'), is('trigonal planar', 'trigonal planar', 'equal'), is('tetrahedral', 'trigonal planar', 'II')];
    })()],
    h: ['Count the electron domains around each central atom: each lone pair is one domain, and each bond — single or double — is one domain.', 'The electron-domain geometry sets the ideal angle between domains; the molecular shape is what is left when the lone pairs are not counted as corners.'],
    s: 'Read from the structures: in I the sulfur has two double bonds and one lone pair — three electron domains, a trigonal planar arrangement with ideal angles of 120°. In II the oxygen has two single bonds and two lone pairs — four electron domains, a tetrahedral arrangement with ideal angles of 109.5°. Both molecules are bent because lone pairs occupy some of the positions, but the angle is larger in I (about 119° in SO₂) than in II (about 103° in OF₂).',
  },
]);

G('4354050b.lo-5', 'Bond angles that change in a reaction, and at four different atoms', [
  {
    t: 'how two bond angles change when NH₃ bonds to BF₃', d: 3, need: 'reason',
    spec: mols([
      { atoms: [at('N', 'N', { x: 0, y: 0, lonePairs: 1, h: 3 })], bonds: [], center: 'N', label: 'I' },
      { atoms: [at('B', 'B', { lonePairs: 0 }), at('F1', 'F', { show: { lonePairs: 'none' }, lonePairs: 3 }), at('F2', 'F', { show: { lonePairs: 'none' }, lonePairs: 3 }), at('F3', 'F', { show: { lonePairs: 'none' }, lonePairs: 3 })], bonds: [bd('B', 'F1'), bd('B', 'F2'), bd('B', 'F3')], layout: { type: 'trigonal_planar', center: 'B', around: ['F1', 'F2', 'F3'] }, center: 'B', label: 'II' },
      { atoms: [at('N', 'N', { x: 0, y: 0, lonePairs: 0, h: 3 }), at('B', 'B', { x: 1.3, y: 0, lonePairs: 0 }), at('F1', 'F', { from: 'B', angle: 60, show: { lonePairs: 'none' }, lonePairs: 3 }), at('F2', 'F', { from: 'B', angle: 0, show: { lonePairs: 'none' }, lonePairs: 3 }), at('F3', 'F', { from: 'B', angle: -60, show: { lonePairs: 'none' }, lonePairs: 3 })], bonds: [bd('N', 'B'), bd('B', 'F1'), bd('B', 'F2'), bd('B', 'F3')], center: 'B', label: 'III' },
    ]),
    alt: 'Three panels. I: a nitrogen atom with one lone pair and three hydrogens written beside it. II: a boron atom bonded to three fluorine atoms spread evenly around it. III: the nitrogen, still with its three hydrogens (printed H₃N), now bonded to the boron, which keeps its three fluorine atoms.',
    q: 'Ammonia (I) and boron trifluoride (II) react to form the compound III shown in the diagram, in which the nitrogen atom is bonded to the boron atom. III is drawn flat, without regard to its true shape, and the lone pairs on fluorine are not drawn. How do the F–B–F and H–N–H bond angles change when I and II form III?',
    o: [
      ['F–B–F decreases to about 109.5°; H–N–H increases slightly', 'correct'],
      ['F–B–F stays at 120°; H–N–H stays at about 107°', 'thinks one new bond leaves both geometries unchanged'],
      ['F–B–F decreases to about 109.5°; H–N–H decreases to about 104.5°', 'adds a domain on nitrogen as if it now had two lone pairs'],
      ['F–B–F stays at 120°; H–N–H increases slightly', 'sees the change at nitrogen but still counts three domains on boron'],
    ],
    holds: ['electron domains (mol_vsepr steric number) and lone pairs (spec) on B and on N before and after: B goes from 3 domains to 4; N keeps 4 domains and loses its lone pair to a bond', (() => {
      const facts = (c: Ctx) => ({ b0: c.num('mol_vsepr', { want: 'steric_number', atom: 'B', molecule: 1 }), b1: c.num('mol_vsepr', { want: 'steric_number', atom: 'B', molecule: 2 }), n0: 3 + (molAtoms(c, 0)[0].lonePairs as number), n1: c.num('mol_vsepr', { want: 'steric_number', atom: 'N', molecule: 2 }), lp0: molAtoms(c, 0)[0].lonePairs as number, lp1: molAtoms(c, 2)[0].lonePairs as number });
      const fbf = (k: ReturnType<typeof facts>) => (k.b0 === 3 && k.b1 === 4 ? 'down' : 'same');
      const hnh = (k: ReturnType<typeof facts>) => (k.n0 === 4 && k.n1 === 4 && k.lp0 === 1 && k.lp1 === 0 ? 'up' : k.lp1 > k.lp0 ? 'down' : 'same');
      const is = (a: string, b: string) => (c: Ctx) => { const k = facts(c); return fbf(k) === a && hnh(k) === b; };
      return [is('down', 'up'), is('same', 'same'), is('down', 'down'), is('same', 'up')];
    })()],
    h: ['Count the electron domains around boron before and after the reaction; the new N–B bond is a domain on boron too.', 'Nitrogen has four domains before and after, but one of them changes from a lone pair to a bonding pair. Lone pairs repel more strongly than bonding pairs.'],
    s: 'Read from the structures: in II boron has three bonding domains and no lone pair — trigonal planar, F–B–F = 120°. In III boron has four bonding domains (three B–F and the new B–N) — tetrahedral, so F–B–F closes to about 109.5°. Nitrogen has four domains throughout, but in I one is a lone pair, which squeezes H–N–H to about 107°; in III that pair has become the N–B bond, so the four domains are all bonding pairs and H–N–H opens slightly toward 109.5°.',
  },
  {
    t: 'the false statement about four bond angles in glycine', d: 3, need: 'reason',
    spec: mols([{ atoms: [at('N', 'N', { x: 0, y: 0, h: 2, lonePairs: 1 }), at('C1', 'C', { x: 1.4, y: 0, h: 2, lonePairs: 0 }), at('C2', 'C', { x: 2.7, y: 0, lonePairs: 0 }), at('O1', 'O', { from: 'C2', angle: 90, lonePairs: 2 }), at('O2', 'O', { x: 4.0, y: 0, h: 1, lonePairs: 2 })], bonds: [bd('N', 'C1'), bd('C1', 'C2'), bd('C2', 'O1', 2), bd('C2', 'O2')] }]),
    alt: 'A chain drawn in a row: a nitrogen with two hydrogens and one lone pair (printed H₂N), a carbon with two hydrogens, a second carbon with a double bond up to an oxygen atom, and an oxygen with one hydrogen. Each oxygen has two lone pairs.',
    q: 'The structure of glycine is shown, with hydrogen atoms written beside the atom they are bonded to; it is drawn without regard to the true shape of the molecule. According to VSEPR theory, which statement about the bond angles in glycine is FALSE?',
    o: [
      ['The C–O–H angle is about 180°', 'correct'],
      ['The O–C–O angle is about 120°', 'does not count three electron domains on the carbon of the C=O group'],
      ['The H–N–H angle is a little less than 109.5°', 'does not count the lone pair on nitrogen as a fourth domain'],
      ['The N–C–C angle is about 109.5°', 'does not count the two written hydrogens as bonds on that carbon'],
    ],
    holds: ['electron domains and lone pairs at each of the four central atoms (mol_vsepr steric number; lone pairs from the spec) give the VSEPR angle; the option answers the question when its statement is false', (() => {
      const angle = (c: Ctx, atom: string): string => { const sn = c.num('mol_vsepr', { want: 'steric_number', atom }); const lp = molAtoms(c).find((a) => a.id === atom)!.lonePairs as number; return sn === 2 ? '180' : sn === 3 ? '120' : lp === 0 ? '109.5' : 'under 109.5'; };
      return [(c: Ctx) => angle(c, 'O2') !== '180', (c: Ctx) => angle(c, 'C2') !== '120', (c: Ctx) => angle(c, 'N') !== 'under 109.5', (c: Ctx) => angle(c, 'C1') !== '109.5'];
    })()],
    h: ['For each angle, find the atom at its vertex and count the electron domains on that atom, lone pairs included.', 'Do not judge an angle from the number of bonds alone, and remember that the structure is not drawn in its true shape.'],
    s: 'Read from the structure, the atom at the vertex of each angle: the carbon of C=O has three domains (two single bonds and one double bond), so O–C–O is about 120° — true. Nitrogen has three bonds and a lone pair, four domains, so H–N–H is a little under 109.5° — true. The CH₂ carbon has four bonding domains, so N–C–C is about 109.5° — true. The oxygen of the O–H group has two bonds and two lone pairs, four domains, so C–O–H is bent, near 105°, not 180°. That statement is false.',
  },
]);

// ── Galvanic Cell Potential Calculations (pack 165) ─────────────────────────

/** Standard reduction potentials used in the stems (V). */
const E0: Record<string, number> = { Ag: 0.80, Cu: 0.34, Ni: -0.25, Fe: -0.44, Zn: -0.76 };

G('52c01b70.lo-2', 'Half-reactions found from a reading and from competing reductions', [
  {
    t: 'half-reaction at an unidentified electrode from the meter and the electron flow', d: 3, need: 'reason',
    spec: cell({ electrode: '?', solution: '?' }, { electrode: 'Cu', solution: '1.0 M Cu(NO₃)₂' }, 'left', { electronFlow: 'value', meterLabel: '0.59 V' }),
    alt: 'A galvanic cell with two beakers joined by a salt bridge and a voltmeter in the wire. The left electrode and its solution are blank boxes; the right electrode is copper in copper(II) nitrate. An arrow along the wire shows electrons moving from the left electrode toward the right one.',
    q: 'Standard reduction potentials: Ag⁺/Ag +0.80 V; Cu²⁺/Cu +0.34 V; Ni²⁺/Ni −0.25 V; Fe²⁺/Fe −0.44 V; Zn²⁺/Zn −0.76 V. In the galvanic cell shown, which is at standard conditions, the left electrode is one of these metals in a 1.0 M solution of its own ions, and the arrow shows the direction of electron flow in the wire. Which half-reaction takes place at the LEFT electrode?',
    o: [
      ['Ni(s) → Ni²⁺(aq) + 2e⁻', 'correct'],
      ['Ni²⁺(aq) + 2e⁻ → Ni(s)', 'finds the metal but has the electrons arriving at the electrode they leave'],
      ['Fe(s) → Fe²⁺(aq) + 2e⁻', 'takes the metal whose potential is closest in size to the reading'],
      ['Ag⁺(aq) + e⁻ → Ag(s)', 'takes the unknown electrode as the cathode'],
    ],
    holds: ['the electron arrow is drawn from the spec\'s anode, the left electrode, so the left half-reaction is an oxidation; E°(M) = E°(Cu) − the meter reading (spec) picks the metal', (() => {
      const facts = (c: Ctx) => { if (c.p.anode !== 'left' || c.p.electronFlow !== 'value' || (c.p.right as P).electrode !== 'Cu') throw new Error('the flow is not drawn from the left'); const e = round(E0.Cu - parseFloat(c.p.meterLabel as string), 2); const m = Object.keys(E0).filter((k) => near(E0[k], e)); if (m.length !== 1) throw new Error('no single metal'); return m[0]; };
      const is = (metal: string, oxidation: boolean) => (c: Ctx) => facts(c) === metal && oxidation;
      return [is('Ni', true), is('Ni', false), is('Fe', true), is('Ag', false)];
    })()],
    h: ['Electrons leave the electrode where oxidation happens. Use the arrow to decide whether the left electrode is the anode or the cathode.', 'E°cell = E°(cathode) − E°(anode). Put in the reading and the potential you know, and solve for the other one.'],
    s: 'Read from the figure: electrons flow away from the left electrode, so it is the anode (oxidation) and copper is the cathode; the meter reads 0.59 V. E°cell = E°(cathode) − E°(anode), so 0.59 = 0.34 − E°(anode) and E°(anode) = −0.25 V, the value for Ni²⁺/Ni. The left half-reaction is the oxidation Ni(s) → Ni²⁺(aq) + 2e⁻.',
  },
  {
    t: 'which of two iron couples reacts at an inert electrode', d: 3, need: 'reason',
    spec: cell({ electrode: 'Pt', solution: 'Fe²⁺(aq), Fe³⁺(aq)' }, { electrode: 'Zn', solution: 'Zn²⁺(aq)' }, 'right'),
    alt: 'A galvanic cell with two beakers joined by a salt bridge and a voltmeter in the wire. The left electrode is platinum in a solution that contains both iron(II) and iron(III) ions; the right electrode is zinc in a solution of zinc ions.',
    q: 'Standard reduction potentials: Fe³⁺(aq) + e⁻ → Fe²⁺(aq) +0.77 V; Fe²⁺(aq) + 2e⁻ → Fe(s) −0.44 V; Zn²⁺(aq) + 2e⁻ → Zn(s) −0.76 V. Every ion in the galvanic cell shown is at 1.0 M. Which half-reaction takes place at the LEFT electrode while the cell delivers current?',
    o: [
      ['Fe³⁺(aq) + e⁻ → Fe²⁺(aq)', 'correct'],
      ['Fe²⁺(aq) + 2e⁻ → Fe(s)', 'picks a reduction that is possible but has the lower potential of the two available'],
      ['Fe²⁺(aq) → Fe³⁺(aq) + e⁻', 'makes the left electrode the anode'],
      ['Pt(s) → Pt²⁺(aq) + 2e⁻', 'expects the electrode metal itself to react'],
    ],
    holds: ['with the species the spec puts in each half-cell: the left half-cell offers two reductions (Fe³⁺ → Fe²⁺ at +0.77 V, Fe²⁺ → Fe at −0.44 V), the right one the oxidation of Zn (−0.76 V); the cathode reaction is the available reduction of highest potential (cell_electrode names the left electrode as the cathode)', (() => {
      const answer = (c: Ctx): string => {
        const left = String((c.p.left as P).solution); const right = String((c.p.right as P).electrode);
        if (!left.includes('Fe³⁺') || !left.includes('Fe²⁺') || right !== 'Zn' || (c.p.left as P).electrode !== 'Pt') throw new Error('not the cell described');
        const reductions: Array<[string, number]> = [['Fe3+>Fe2+', 0.77], ['Fe2+>Fe', -0.44]];
        const best = reductions.sort((a, b) => b[1] - a[1])[0];
        if (!(best[1] > -0.76) || c.txt('cell_electrode', { want: 'cathode', leftE: best[1], rightE: -0.76 }) !== 'Pt' || c.p.anode !== 'right') throw new Error('the left electrode is not the cathode');
        return best[0];
      };
      return [(c: Ctx) => answer(c) === 'Fe3+>Fe2+', (c: Ctx) => answer(c) === 'Fe2+>Fe', () => false, () => false];
    })()],
    h: ['Compare the potential of the zinc couple with those of the iron couples to decide which electrode is the anode.', 'Two different reductions could happen in the left beaker: decide which of them is favoured. Think also about what the platinum is there to do.'],
    s: 'Read from the figure: the left half-cell is an inert platinum electrode in a solution of Fe²⁺ and Fe³⁺; the right one is zinc metal in Zn²⁺. Zinc has the lowest reduction potential (−0.76 V), so zinc is oxidised and the left electrode is the cathode. Two reductions are possible there: Fe³⁺ → Fe²⁺ (+0.77 V) and Fe²⁺ → Fe (−0.44 V). The one with the higher potential occurs: Fe³⁺(aq) + e⁻ → Fe²⁺(aq), giving E°cell = 0.77 − (−0.76) = 1.53 V. Platinum does not react.',
  },
]);

G('52c01b70.lo-5', 'Spontaneity judged from a sketch of ion movement and from a meter sign', [
  {
    t: 'E° and spontaneity of the reaction implied by the drawn ion movement', d: 3, need: 'reason',
    spec: cell({ electrode: 'Cu', solution: '1.0 M Cu(NO₃)₂' }, { electrode: 'Zn', solution: '1.0 M Zn(NO₃)₂' }, 'left', { bridgeIons: { anion: 'NO₃⁻', cation: 'K⁺' } }),
    alt: 'A galvanic cell with two beakers joined by a salt bridge and a voltmeter in the wire. The left electrode is copper in copper(II) nitrate and the right electrode is zinc in zinc nitrate. Under the salt bridge, arrows show nitrate ions moving toward the left beaker and potassium ions moving toward the right beaker.',
    q: 'E°(Cu²⁺/Cu) = +0.34 V and E°(Zn²⁺/Zn) = −0.76 V. A student\'s sketch of a galvanic cell at standard conditions is shown; the arrows under the salt bridge are the student\'s idea of how its ions move. For the cell reaction that this ion movement implies, what is E°, and does the cell really run that way?',
    o: [
      ['E° = −1.10 V; no, the ions move the opposite way', 'correct'],
      ['E° = +1.10 V; yes, the sketch is right', 'works out the working cell without checking what the arrows imply'],
      ['E° = −0.42 V; no, the ions move the opposite way', 'adds the two potentials'],
      ['E° = +0.42 V; yes, the sketch is right', 'adds the two potentials and ignores the sign'],
    ],
    holds: ['the anion arrow is drawn toward the spec\'s anode, the left electrode (copper); E° = E°(cathode) − E°(anode) for that assignment; the cell runs that way only if E° > 0; the real anode is the metal of lower potential', (() => {
      const e = (c: Ctx) => { if (c.p.anode !== 'left' || !c.p.bridgeIons) throw new Error('anions are not drawn toward the left'); const [an, cat] = [E0[(c.p.left as P).electrode as string], E0[(c.p.right as P).electrode as string]]; if (!(cat < an)) throw new Error('the sketch would be right'); return round(cat - an, 2); };
      const is = (v: number, runs: boolean) => (c: Ctx) => near(e(c), v, 1e-6) && (e(c) > 0) === runs;
      return [is(-1.10, false), is(1.10, true), is(-0.42, false), is(0.42, true)];
    })()],
    h: ['In a working cell the anions of the salt bridge move into the half-cell where positive ions are being produced. Decide which electrode the sketch therefore treats as the anode.', 'Work out E°(cathode) − E°(anode) for that assignment; its sign tells you whether the reaction runs by itself.'],
    s: 'Read from the sketch: nitrate ions are drawn moving into the copper half-cell. Anions move toward the anode, so the sketch treats copper as the anode and zinc as the cathode: Cu → Cu²⁺ + 2e⁻ and Zn²⁺ + 2e⁻ → Zn. For that reaction E° = E°(cathode) − E°(anode) = −0.76 − 0.34 = −1.10 V. A negative E° means it is not spontaneous: the real cell runs the other way (zinc is the anode, E° = +1.10 V), with nitrate moving toward the zinc half-cell and K⁺ toward the copper half-cell.',
  },
  {
    t: 'signed reading of a voltmeter with a stated positive direction', d: 3, need: 'calc',
    spec: cell({ electrode: 'Ag', solution: '1.0 M AgNO₃' }, { electrode: 'Fe', solution: '1.0 M Fe(NO₃)₂' }, 'right'),
    alt: 'A galvanic cell with two beakers joined by a salt bridge and a voltmeter in the wire. The left electrode is silver in silver nitrate solution and the right electrode is iron in iron(II) nitrate solution. Nothing on the figure says which electrode is the anode.',
    q: 'E°(Ag⁺/Ag) = +0.80 V and E°(Fe²⁺/Fe) = −0.44 V. The voltmeter in the galvanic cell shown is connected so that its reading is positive when electrons flow through the wire from the left electrode to the right electrode, and negative when they flow the other way. At standard conditions, what does the voltmeter read, in volts? Include the sign.',
    n: '-1.24',
    calc: ['size: cell_potential with the two potentials for the spontaneous assignment (anode = the electrode of lower potential, as cell_electrode says); sign: negative when that anode is the RIGHT electrode, because electrons then flow right to left', (c) => {
      const L = E0[(c.p.left as P).electrode as string]; const R = E0[(c.p.right as P).electrode as string];
      const anodeMetal = c.txt('cell_electrode', { want: 'anode', leftE: L, rightE: R });
      const anode = anodeMetal === (c.p.left as P).electrode ? 'left' : 'right';
      if (anode !== c.p.anode) throw new Error('the spec\'s anode is not the spontaneous one');
      const e = c.num('cell_potential', { leftE: L, rightE: R });
      if (!(e > 0)) throw new Error('not spontaneous');
      return round(anode === 'left' ? e : -e, 2);
    }],
    h: ['Decide which metal is oxidised by comparing the two reduction potentials; electrons leave that electrode through the wire.', 'Find the size of E° from the two potentials. Then compare the direction in which the electrons really flow with the direction the meter counts as positive.'],
    s: 'Read from the figure: silver is the left electrode and iron the right one. Iron has the lower reduction potential, so iron is oxidised (the anode) and silver ions are reduced: E°cell = 0.80 − (−0.44) = 1.24 V. Electrons leave the iron electrode, on the right, and flow through the wire to the silver electrode, on the left — the direction the meter counts as negative. The meter reads −1.24 V.',
  },
]);

// ── Intermolecular Forces and Properties (pack 171) ─────────────────────────

G('72c8a996.lo-3', 'Donors and acceptors: which pairs can hydrogen-bond, and what follows for boiling points', [
  {
    t: 'number of the six possible pairs of three substances that can hydrogen-bond', d: 3, need: 'reason',
    spec: mols([
      { atoms: [at('C', 'C', { x: 0, y: 0, h: 2, lonePairs: 0 }), at('O', 'O', { x: 1.4, y: 0, lonePairs: 2 })], bonds: [bd('C', 'O', 2)], label: 'I', origin: [0, 0] },
      { atoms: [at('C', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('N', 'N', { x: 1.5, y: 0, h: 2, lonePairs: 1 })], bonds: [bd('C', 'N')], label: 'II', origin: [0, -1.6] },
      { atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('C2', 'C', { x: 1.5, y: 0, h: 3, lonePairs: 0 })], bonds: [bd('C1', 'C2')], label: 'III', origin: [0, -3.2] },
    ], { arrangement: 'shared' }),
    alt: 'Three small molecules, one above the other, with hydrogens written beside the atoms. I: a carbon with two hydrogens double-bonded to an oxygen that has two lone pairs. II: a carbon with three hydrogens bonded to a nitrogen that has two hydrogens and one lone pair. III: two carbons, each with three hydrogens.',
    q: 'Three substances, I, II and III, are shown as condensed structures, with the hydrogen atoms written beside the atom they are bonded to. Consider the six possible pairs of molecules: I with I, II with II, III with III, I with II, I with III, and II with III. In how many of these six pairs can a hydrogen bond form between the two molecules?',
    n: '2',
    calc: ['donors and acceptors of each molecule from mol_hbond; a pair can hydrogen-bond when one molecule has a donor and the other an acceptor', (c) => {
      const k = [0, 1, 2].map((m) => ({ d: c.num('mol_hbond', { want: 'donors', molecule: m }) > 0, a: c.num('mol_hbond', { want: 'acceptors', molecule: m }) > 0 }));
      let n = 0;
      for (let i = 0; i < 3; i++) for (let j = i; j < 3; j++) if ((k[i].d && k[j].a) || (k[j].d && k[i].a)) n += 1;
      return n;
    }],
    h: ['A hydrogen bond needs a donor — an H atom bonded directly to N, O or F — on one molecule, and an acceptor — a lone pair on N, O or F — on the other.', 'Decide for each substance whether it can act as a donor, as an acceptor, as both or as neither. Then test each of the six pairs.'],
    s: 'Read from the structures: in I the hydrogens are on carbon, so I has no donor, but its oxygen has lone pairs — acceptor only. In II the nitrogen carries hydrogens and a lone pair — donor and acceptor. III has only C–H bonds and no lone pairs — neither. A pair needs a donor on one molecule and an acceptor on the other: II with II works, and I with II works (N–H of II to the O of I). I with I has no donor, and every pair that includes III fails. So 2 of the six pairs can hydrogen-bond.',
  },
  {
    t: 'boiling-point order of three isomeric amines', d: 3, need: 'reason',
    spec: mols([
      { atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('C2', 'C', { x: 1.5, y: 0, h: 2, lonePairs: 0 }), at('C3', 'C', { x: 3, y: 0, h: 2, lonePairs: 0 }), at('N', 'N', { x: 4.5, y: 0, h: 2, lonePairs: 1 })], bonds: [bd('C1', 'C2'), bd('C2', 'C3'), bd('C3', 'N')], label: 'I', origin: [0, 0] },
      { atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('C2', 'C', { x: 1.5, y: 0, h: 2, lonePairs: 0 }), at('N', 'N', { x: 3, y: 0, h: 1, lonePairs: 1 }), at('C3', 'C', { x: 4.5, y: 0, h: 3, lonePairs: 0 })], bonds: [bd('C1', 'C2'), bd('C2', 'N'), bd('N', 'C3')], label: 'II', origin: [0, -1.7] },
      { atoms: [at('C1', 'C', { x: 0, y: 0, h: 3, lonePairs: 0 }), at('N', 'N', { x: 1.5, y: 0, lonePairs: 1 }), at('C2', 'C', { x: 3, y: 0, h: 3, lonePairs: 0 }), at('C3', 'C', { from: 'N', angle: -90, h: 3, lonePairs: 0 })], bonds: [bd('C1', 'N'), bd('N', 'C2'), bd('N', 'C3')], label: 'III', origin: [0, -3.4] },
    ], { arrangement: 'shared' }),
    alt: 'Three molecules, one above the other, each with three carbons and one nitrogen and with hydrogens written beside the atoms. In I the nitrogen is at the end of the chain and has two hydrogens; in II it is inside the chain and has one hydrogen; in III it is bonded to three carbons and has no hydrogen. Each nitrogen has one lone pair.',
    q: 'The condensed structures of three compounds, I, II and III, are shown, with hydrogen atoms written beside the atom they are bonded to. All three have the molecular formula C₃H₉N. Which lists the compounds in order of INCREASING boiling point, lowest first?',
    o: [['III, then II, then I', 'correct'], ['I, then II, then III', 'has the order of hydrogen-bonding strength reversed'], ['II, then III, then I', 'does not count the hydrogens on nitrogen in each compound'], ['III, then I, then II', 'does not see that I has more N–H bonds than II']],
    holds: ['with equal molar masses the order follows the number of N–H donors per molecule (mol_hbond donors): the option holds when it lists the compounds by increasing donor count', (() => {
      const order = (c: Ctx): string => { const d = [0, 1, 2].map((m) => c.num('mol_hbond', { want: 'donors', molecule: m })); if (new Set(d).size !== 3) throw new Error(`donor counts ${d}`); return ['I', 'II', 'III'].map((name, i) => ({ name, d: d[i] })).sort((a, b) => a.d - b.d).map((k) => k.name).join(', then '); };
      const is = (s0: string) => (c: Ctx) => order(c) === s0;
      return [is('III, then II, then I'), is('I, then II, then III'), is('II, then III, then I'), is('III, then I, then II')];
    })()],
    h: ['The three compounds have the same formula and so about the same dispersion forces. Look for what differs: the number of hydrogen atoms bonded directly to nitrogen.', 'Ask, for each compound, whether two of its own molecules can hydrogen-bond to each other, and through how many N–H bonds.'],
    s: 'Read from the structures: I has an NH₂ group (two N–H bonds), II has an NH group (one N–H bond) and III has no hydrogen on nitrogen. With the same formula, the dispersion forces are similar, so the boiling points follow the hydrogen bonding between like molecules: III cannot hydrogen-bond with itself at all, II can through one N–H, and I most extensively through two. Increasing boiling point: III < II < I (about 3 °C, 37 °C and 48 °C for trimethylamine, N-methylethanamine and propan-1-amine).',
  },
]);

// ── Lewis Structures and Formal Charges (pack 173) ──────────────────────────

G('87ef2ba6.lo-2', 'Formal charges used to choose between structures and to compare two ions', [
  {
    t: 'the best of three structures of N₂O by formal charge', d: 3, need: 'reason',
    spec: mols([
      { atoms: [at('N1', 'N', { lonePairs: 2 }), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 })], bonds: [bd('N1', 'N2', 2), bd('N2', 'O', 2)], layout: { type: 'linear', center: 'N2', around: ['N1', 'O'] }, center: 'N2', label: 'I' },
      { atoms: [at('N1', 'N', { lonePairs: 1 }), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 3 })], bonds: [bd('N1', 'N2', 3), bd('N2', 'O', 1)], layout: { type: 'linear', center: 'N2', around: ['N1', 'O'] }, center: 'N2', label: 'II' },
      { atoms: [at('N1', 'N', { lonePairs: 3 }), at('N2', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 1 })], bonds: [bd('N1', 'N2', 1), bd('N2', 'O', 3)], layout: { type: 'linear', center: 'N2', around: ['N1', 'O'] }, center: 'N2', label: 'III' },
    ], { showFormalCharges: false, between: 'resonance' }),
    alt: 'Three Lewis structures of the same three atoms in a row, nitrogen–nitrogen–oxygen, joined by double-headed arrows. I has two double bonds; II has a triple bond between the nitrogens and a single bond to oxygen; III has a single bond between the nitrogens and a triple bond to oxygen. Lone pairs are drawn; formal charges are not.',
    q: 'Three Lewis structures for dinitrogen monoxide, N₂O, are shown without their formal charges. Judged by formal charges, which structure contributes most to the bonding in N₂O?',
    o: [['Structure II', 'correct'], ['Structure I', 'puts the negative formal charge on nitrogen although oxygen is more electronegative'], ['Structure III', 'does not work out the formal charges: this structure has the largest ones'], ['All three contribute equally', 'assumes resonance structures always contribute equally']],
    calc: ['mol_best_structure on the three drawn structures (smallest formal charges, the negative one on the more electronegative atom)', (c) => { const best = c.txt('mol_best_structure', {}); const m = /\b(III|II|I)\b/.exec(best); if (!m) throw new Error(`checker said ${best}`); return `Structure ${m[1]}`; }],
    h: ['Formal charge = valence electrons − non-bonding electrons − number of bonds. Work it out for all three atoms in each structure.', 'Prefer the structure whose formal charges are closest to zero; if two tie, prefer the one that puts the negative formal charge on the more electronegative atom.'],
    s: 'Read from each structure the lone pairs and bonds of every atom. I (N=N=O): end N 5 − 4 − 2 = −1, middle N 5 − 0 − 4 = +1, O 6 − 4 − 2 = 0. II (N≡N–O): end N 5 − 2 − 3 = 0, middle N +1, O 6 − 6 − 1 = −1. III (N–N≡O): end N 5 − 6 − 1 = −2, middle N +1, O 6 − 2 − 3 = +1. III has the largest charges and a positive oxygen. I and II both have one +1 and one −1, but II puts the −1 on oxygen, the more electronegative atom, so II contributes most.',
  },
  {
    t: 'number of charged atoms in two isomeric ions', d: 3, need: 'calc',
    spec: mols([
      { atoms: [at('N', 'N', { lonePairs: 2 }), at('C', 'C', { lonePairs: 0 }), at('O', 'O', { lonePairs: 2 })], bonds: [bd('N', 'C', 2), bd('C', 'O', 2)], layout: { type: 'linear', center: 'C', around: ['N', 'O'] }, center: 'C', label: 'I' },
      { atoms: [at('C', 'C', { lonePairs: 1 }), at('N', 'N', { lonePairs: 0 }), at('O', 'O', { lonePairs: 3 })], bonds: [bd('C', 'N', 3), bd('N', 'O', 1)], layout: { type: 'linear', center: 'N', around: ['C', 'O'] }, center: 'N', label: 'II' },
    ], { showFormalCharges: false }),
    alt: 'Two Lewis structures side by side, each a row of three atoms with lone pairs drawn and no charges. I: nitrogen, carbon, oxygen, joined by two double bonds. II: carbon, nitrogen, oxygen, with a triple bond between carbon and nitrogen and a single bond to oxygen.',
    q: 'Lewis structures of two different ions, I and II, are shown. Each ion is made of one carbon, one nitrogen and one oxygen atom and has an overall charge of −1; the formal charges are not drawn. Which statement about the formal charges is correct?',
    o: [
      ['One atom in I and three atoms in II have a non-zero formal charge', 'correct'],
      ['One atom in I and one atom in II have a non-zero formal charge', 'assumes an ion of charge −1 has a single charged atom'],
      ['Three atoms in I and one atom in II have a non-zero formal charge', 'exchanges the two ions'],
      ['No atom in I and one atom in II has a non-zero formal charge', 'loses the charge of ion I'],
    ],
    holds: ['the formal charge of every atom from mol_formal_charge; each ion\'s charges must add up to −1; the option holds when its two counts of non-zero charges are right', (() => {
      const count = (c: Ctx, m: number): number => { const fc = molAtoms(c, m).map((a) => c.num('mol_formal_charge', { atom: a.id as string, molecule: m })); if (fc.reduce((t, v) => t + v, 0) !== -1) throw new Error(`ion ${m} sums to ${fc}`); return fc.filter((v) => v !== 0).length; };
      const is = (a: number, b: number) => (c: Ctx) => count(c, 0) === a && count(c, 1) === b;
      return [is(1, 3), is(1, 1), is(3, 1), is(0, 1)];
    })()],
    h: ['Formal charge = valence electrons − non-bonding electrons − number of bonds; do this for all six atoms.', 'Check your work: the formal charges in each ion must add up to its overall charge. That can happen with one charged atom or with several.'],
    s: 'Read the lone pairs and bonds from each structure. I (N=C=O): N 5 − 4 − 2 = −1, C 4 − 0 − 4 = 0, O 6 − 4 − 2 = 0 — one charged atom, total −1. II (C≡N–O): C 4 − 2 − 3 = −1, N 5 − 0 − 4 = +1, O 6 − 6 − 1 = −1 — three charged atoms, total −1. So one atom in I and three atoms in II carry a non-zero formal charge (which is one reason ion II, fulminate, is far less stable than ion I, cyanate).',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS
// ════════════════════════════════════════════════════════════════════════════

/** A graph of one physical quantity against another (function_graph with named axes). */
const pgraph = (xLabel: string, yLabel: string, xRange: [number, number], xStep: number, yRange: [number, number], yStep: number, curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, xStep, yStep, xLabel, yLabel, curves, ...extra });
/** Position–time and velocity–time graphs drawn through given points. */
const mgraph = (quantity: 'position' | 'velocity', series: P[], extra: P = {}): Spec => S('motion_graph', { quantity, series, ...extra });
const ptsOf = (c: Ctx, i: number): number[][] => arr(c.p.series)[i].points as number[][];
/** Slope of the k-th straight piece of a series. */
const slopeOf = (pts: number[][], k: number): number => (pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]);
/** Period of an oscillation that starts at a maximum: the time of its next maximum (searched on the spec's expression). */
const periodOf = (f: (x: number) => number, tMax: number): number => { const dt = tMax / 240000; for (let t = dt * 100; t <= tMax; t += dt) if (f(t) >= f(t - dt) && f(t) > f(t + dt) && near(f(t), f(0), 1e-6)) return round(t, 4); throw new Error('no second maximum'); };
/** Energy-level ladders. */
const ladder = (levels: P[], extra: P = {}): Spec => S('energy_levels', { variant: 'levels', levels, ...extra });
const energiesOf = (c: Ctx): number[] => (c.p.hydrogen ? Array.from({ length: (c.p.hydrogen as P).nMax as number }, (_, i) => -13.6 / (i + 1) ** 2) : arr(c.p.levels).map((l) => l.energy as number).sort((a, b) => a - b));
const HC = 1240; // eV·nm

// ── Periods of Springs and Pendulums (pack 203) ─────────────────────────────

G('0da1d0f6.lo-4', 'Mass and the period of a spring, read from oscillation records', [
  {
    t: 'mass of a second block from two displacement–time records', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Displacement (cm)', [0, 1.2], 0.1, [-4, 4], 1, [{ expr: '3*cos(5*pi*x)', label: 'X' }, { expr: '2*cos(10*pi*x/3)', label: 'Y', dashed: true }]),
    alt: 'Two oscillation records on one grid of displacement against time, both starting at their highest point. The solid one, X, has the larger swing and repeats more often; the dashed one, Y, has a smaller swing and repeats less often.',
    q: 'The graph shows the displacement of two blocks, X (solid) and Y (dashed), each oscillating in turn on the same spring. The mass of block X is 0.20 kg. What is the mass of block Y, in kg?',
    n: '0.45',
    calc: ['0.20 kg × (period of Y ÷ period of X)², each period being the time from the first maximum to the next on the spec\'s expression', (c) => round(0.20 * (periodOf(fOf(c, 1), 1.2) / periodOf(fOf(c, 0), 1.2)) ** 2, 4)],
    alts: ['the ratio of the periods rounded to 1.5 before squaring', () => [0.20 * 1.5 ** 2]],
    h: ['Read the period of each record: the time from one highest point to the next. The size of the swing does not matter.', 'For a block on a given spring the period is proportional to the square root of the mass. Use the ratio of the two periods; you do not need the spring constant.'],
    s: 'Read from the graph: X has maxima at 0 and 0.4 s, so its period is 0.4 s; Y has maxima at 0 and 0.6 s, so its period is 0.6 s. For the same spring T = 2π√(m/k), so m is proportional to T². The period of Y is 1.5 times that of X, so its mass is 1.5² = 2.25 times as large: 2.25 × 0.20 = 0.45 kg. The different amplitudes play no part.',
  },
  {
    t: 'extra load needed to double the period, from a graph of T² against mass', d: 3, need: 'calc',
    spec: pgraph('Mass on the spring (kg)', 'Period squared, T² (s²)', [0, 1.25], 0.25, [0, 5], 1, [{ expr: '4x' }]),
    alt: 'A straight line through the origin on a grid: the square of the period plotted against the mass hung on a spring. The line rises steadily and leaves the grid at the upper right corner.',
    q: 'For a block oscillating on a certain spring, the graph shows the SQUARE of the period, T², against the mass of the block. A block has a period of 1.0 s on this spring. How much mass, in kg, must be added to it to make the period 2.0 s?',
    n: '0.75',
    calc: ['mass at T² = 4.0 minus mass at T² = 1.0, each found by inverting the spec\'s straight line', (c) => { const f = fOf(c); const k = f(1) - f(0); if (!near(f(0), 0)) throw new Error('not through the origin'); return round(4 / k - 1 / k, 4); }],
    h: ['The vertical axis is T², not T. Square each period before you look it up on the graph.', 'Read the mass that goes with each value of T²; the question asks for the difference between them.'],
    s: 'The graph plots T², so a period of 1.0 s is at T² = 1.0 s² and a period of 2.0 s is at T² = 4.0 s². Read from the graph: T² = 1.0 s² at a mass of 0.25 kg, and T² = 4.0 s² at a mass of 1.00 kg. Doubling the period needs four times the mass, so 1.00 − 0.25 = 0.75 kg must be added.',
  },
]);

G('0da1d0f6.lo-5', 'Spring constant and period, from force graphs and oscillation records', [
  {
    t: 'ratio of the periods of one block on two springs, from their force–extension lines', d: 3, need: 'calc',
    spec: pgraph('Extension (m)', 'Force (N)', [0, 0.5], 0.1, [0, 12], 2, [{ expr: '40x', label: 'P', domain: [0, 0.25] }, { expr: '10x', label: 'Q', dashed: true }]),
    alt: 'Two straight lines through the origin on a grid of force against extension. The solid line, P, is steep and stops half-way across the grid; the dashed line, Q, is much less steep and runs to the right-hand edge.',
    q: 'The graph shows the force needed to stretch each of two springs, P (solid) and Q (dashed). The same block is hung from each spring in turn and set oscillating up and down. What is the value of (period on spring Q) ÷ (period on spring P)?',
    n: '2',
    calc: ['√(k of P ÷ k of Q), the spring constants being the slopes of the two lines (curve_slope)', (c) => round(Math.sqrt(c.num('curve_slope', { curve: 0, x1: 0, x2: 0.2 }) / c.num('curve_slope', { curve: 1, x1: 0, x2: 0.4 })), 6)],
    h: ['The spring constant of each spring is the slope of its line: force divided by extension.', 'For the same mass, the period is proportional to 1/√k. Decide first which spring gives the longer period.'],
    s: 'Read from the graph: P needs 8 N for 0.20 m, so k = 8 / 0.20 = 40 N/m; Q needs 4 N for 0.40 m, so k = 4 / 0.40 = 10 N/m. With the same block, T = 2π√(m/k) is proportional to 1/√k. Q is the softer spring, so it gives the longer period: T(Q) / T(P) = √(40 / 10) = √4 = 2.',
  },
  {
    t: 'spring constant of a second spring from two displacement–time records', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Displacement (cm)', [0, 1.2], 0.1, [-4, 4], 1, [{ expr: '2*cos(10*pi*x/3)', label: 'spring 1' }, { expr: '3*cos(10*pi*x)', label: 'spring 2', dashed: true }]),
    alt: 'Two oscillation records on one grid of displacement against time, both starting at their highest point. The solid one, for spring 1, has the smaller swing and repeats slowly; the dashed one, for spring 2, has the larger swing and repeats more often.',
    q: 'The graph shows the displacement of one block oscillating first on spring 1 (solid) and then on spring 2 (dashed). The spring constant of spring 1 is 20 N/m. What is the spring constant of spring 2, in N/m?',
    n: '180',
    calc: ['20 N/m × (period on spring 1 ÷ period on spring 2)², the periods found on the spec\'s expressions', (c) => round(20 * (periodOf(fOf(c, 0), 1.2) / periodOf(fOf(c, 1), 1.2)) ** 2, 3)],
    h: ['Read the period of each record from one highest point to the next.', 'For the same mass, the period is proportional to 1/√k, so k is proportional to 1/T². A shorter period means a stiffer spring — by the square of the ratio.'],
    s: 'Read from the graph: on spring 1 the maxima are at 0 and 0.6 s, a period of 0.6 s; on spring 2 they are at 0 and 0.2 s, a period of 0.2 s. For the same block T = 2π√(m/k), so k is proportional to 1/T². The period on spring 2 is 3 times shorter, so its spring constant is 3² = 9 times larger: 9 × 20 = 180 N/m.',
  },
]);

G('0da1d0f6.lo-6', 'Length and the period of a pendulum', [
  {
    t: 'extra length needed to double the period, from a graph of T² against length', d: 3, need: 'calc',
    spec: pgraph('Length of pendulum (m)', 'Period squared, T² (s²)', [0, 5], 1, [0, 20], 4, [{ expr: '4x' }]),
    alt: 'A straight line through the origin on a grid: the square of the period of a pendulum plotted against its length. The line rises steadily to the upper right corner of the grid.',
    q: 'For a simple pendulum swinging through small angles, the graph shows the SQUARE of the period, T², against the length of the pendulum. By how many metres must a pendulum that has a period of 2.0 s be lengthened for its period to become 4.0 s?',
    n: '3',
    calc: ['length at T² = 16 minus length at T² = 4, each found by inverting the spec\'s straight line', (c) => { const f = fOf(c); const k = f(1) - f(0); if (!near(f(0), 0)) throw new Error('not through the origin'); return round(16 / k - 4 / k, 4); }],
    h: ['The vertical axis is T², not T. Square each period before you look it up on the graph.', 'Read the length for each value of T²; the question asks how much longer the second pendulum is, not how long it is.'],
    s: 'The graph plots T², so a period of 2.0 s is at T² = 4 s² and a period of 4.0 s is at T² = 16 s². Read from the graph: T² = 4 s² at a length of 1.0 m, and T² = 16 s² at a length of 4.0 m. Doubling the period needs four times the length, so the pendulum must be lengthened by 4.0 − 1.0 = 3 m.',
  },
  {
    t: 'original length from the periods before and after shortening, with g unknown', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Displacement (cm)', [0, 12], 1, [-4, 4], 1, [{ expr: '3*cos(pi*x/3)', label: 'before' }, { expr: '3*cos(pi*x/2)', label: 'after', dashed: true }]),
    alt: 'Two oscillation records with the same swing on one grid of displacement against time, both starting at their highest point. The solid record, labelled before, repeats more slowly than the dashed record, labelled after.',
    q: 'On the surface of a small moon, where the value of g is not known, the graph shows the displacement of a pendulum bob before (solid) and after (dashed) its string was shortened by 0.50 m. What was the length of the string before it was shortened, in metres? Give your answer to one decimal place.',
    n: '0.9',
    calc: ['0.50 m ÷ (1 − (period after ÷ period before)²), the periods found on the spec\'s expressions', (c) => { const T1 = periodOf(fOf(c, 0), 12); const T2 = periodOf(fOf(c, 1), 12); return round(0.5 / (1 - (T2 / T1) ** 2), 4); }],
    alts: ['the ratio of the periods rounded to 0.67 or 0.667, or the ratio of lengths rounded to 0.44, before use', () => [0.5 / (1 - 0.67 ** 2), 0.5 / (1 - 0.667 ** 2), 0.5 / (1 - 0.44)]],
    h: ['Read the two periods. For a pendulum, T is proportional to √L, so the ratio of the two lengths is the square of the ratio of the periods — whatever g is.', 'Write the new length as (original length − 0.50 m) and use that ratio to make an equation for the original length.'],
    s: 'Read from the graph: before, the maxima are at 0 and 6 s (period 6 s); after, at 0 and 4 s (period 4 s). Since T is proportional to √L at a given place, L(after) / L(before) = (4/6)² = 4/9. With L(after) = L − 0.50: (L − 0.50) / L = 4/9, so 9L − 4.5 = 4L and L = 0.9 m. The unknown g cancels because both records were made in the same place.',
  },
]);

G('0da1d0f6.lo-7', 'Why the mass of the bob does not set the period', [
  {
    t: 'the false statement about a bob of three times the mass', d: 3, need: 'reason',
    spec: pgraph('Time (s)', 'Displacement (cm)', [0, 6], 1, [-5, 5], 1, [{ expr: '4*cos(pi*x)' }]),
    alt: 'One oscillation record on a grid of displacement against time. It starts at its highest point at time zero and completes three full swings in the time shown.',
    q: 'The graph shows the displacement of the bob of a simple pendulum that is released from rest at t = 0. The bob is then replaced by one of three times the mass on the same string, and released from the same position. Which statement about the HEAVIER bob is FALSE?',
    o: [
      ['It completes fewer swings per minute than the lighter bob did', 'correct'],
      ['It first reaches its lowest point 0.5 s after release', 'does not read a quarter of the period from the graph'],
      ['Its greatest speed is the same as that of the lighter bob', 'expects a heavier bob to move more slowly through the lowest point'],
      ['Its greatest kinetic energy is three times that of the lighter bob', 'expects the energy, like the period, not to depend on the mass'],
    ],
    holds: ['with the period read from the spec\'s expression and the model of a simple pendulum (period and speed at the lowest point independent of the mass; kinetic energy proportional to it): the option answers the question when its statement is false', (() => {
      const T = (c: Ctx) => periodOf(fOf(c), 6); const massRatio = 3;
      const periodRatio = 1; const speedRatio = 1; const keRatio = massRatio * speedRatio ** 2;
      return [() => !(periodRatio > 1), (c: Ctx) => !near(T(c) / 4, 0.5), () => !(speedRatio === 1), () => !(keRatio === 3)];
    })()],
    h: ['Read the period from the graph. The lowest point of the swing is where the displacement is zero.', 'Go through the statements one at a time and ask, for each quantity, whether the mass of the bob stays in its formula or cancels out of it.'],
    s: 'Read from the graph: the period is 2 s, and the displacement first reaches zero (the lowest point) a quarter of a period after release, at 0.5 s. The period of a simple pendulum does not depend on the mass, so the heavier bob also takes 0.5 s — and makes the same number of swings per minute, so that statement is false. Its speed at the bottom, √(2gh), is unchanged because it falls through the same height; its kinetic energy ½mv² is three times as large because m is.',
  },
  {
    t: 'what two records with different masses have in common, and why', d: 3, need: 'reason',
    spec: pgraph('Time (s)', 'Displacement (cm)', [0, 6], 1, [-5, 5], 1, [{ expr: '4*cos(pi*x)', label: 'first bob' }, { expr: '2*cos(pi*x)', label: 'bob of 4 times the mass', dashed: true }]),
    alt: 'Two oscillation records on one grid of displacement against time, both starting at their highest point. The dashed record, for the bob of four times the mass, has half the swing of the solid one; the two cross the time axis at the same moments.',
    q: 'The graph shows the displacement of a simple pendulum (solid), and of the same pendulum after its bob was replaced by one of four times the mass and released from a smaller angle (dashed). Which statement explains what the two records have in common?',
    o: [
      ['The pull of gravity along the path and the inertia of the bob are both proportional to its mass, giving the same acceleration at each angle', 'correct'],
      ['The heavier bob was released from a smaller angle, which exactly makes up for the longer time a heavier bob would otherwise need', 'thinks the amplitude compensates for the mass'],
      ['The tension in the string, which pulls the bob back toward the centre, is the same for a light bob and a heavy one', 'takes the tension as a restoring force that does not depend on the mass'],
      ['A heavier bob has more inertia but also stores more energy, and the extra energy is used up in keeping the amplitude smaller', 'mixes up energy with what sets the period'],
    ],
    holds: ['the two records in the spec have equal periods and different amplitudes; for a pendulum the acceleration along the path is −g·sin θ (the mass cancels) and, at small angles, the period does not depend on the amplitude — the only statement consistent with both', (() => {
      const same = (c: Ctx) => near(periodOf(fOf(c, 0), 6), periodOf(fOf(c, 1), 6)) && !near(fOf(c, 0)(0), fOf(c, 1)(0));
      const massCancels = true; const amplitudeSetsPeriod = false; const tensionIndependentOfMass = false; const energySetsAmplitudeHere = false;
      return [(c: Ctx) => same(c) && massCancels, () => amplitudeSetsPeriod, () => tensionIndependentOfMass, () => energySetsAmplitudeHere];
    })()],
    h: ['Decide first what the two records share: compare the times at which they reach their highest points, not how high those points are.', 'Write Newton\'s second law for the bob along its path: the force that pulls it back and the mass that resists the pull. See what happens to the mass.'],
    s: 'Read from the graph: the records have different amplitudes but the same period, 2 s (both peak at 0, 2 and 4 s). The force that pulls the bob back along its path is the component of its weight, mg·sin θ, and Newton\'s second law gives m·a = −mg·sin θ: the mass cancels, so the acceleration at each angle — and with it the period — is the same for any bob. The smaller amplitude is not what does it: at small angles the period does not depend on the amplitude either, and the tension is larger for the heavier bob.',
  },
]);

// ── Conservation of Momentum in Collisions (pack 205) ───────────────────────

G('11c1e6e1.lo-3', 'Momentum conservation with the velocities read from motion graphs', [
  {
    t: 'mass of the struck cart from a position–time graph of a collision in which the carts join', d: 3, need: 'calc',
    spec: mgraph('position', [{ label: 'cart X', points: [[0, 0], [2, 4], [6, 6]] }, { label: 'cart Y', points: [[0, 5], [2, 5], [6, 7]], dashed: true }], { tRange: [0, 7], yRange: [0, 8], tStep: 1, yStep: 1 }),
    alt: 'A position–time graph with two lines. The solid line, cart X, rises steeply for the first part and then much less steeply. The dashed line, cart Y, is level at first and then rises parallel to the later part of the solid line, a constant distance above it.',
    q: 'The graph shows the positions of two carts on a level, frictionless track. Cart X, of mass 0.60 kg, runs into cart Y, and the two then move on together. What is the mass of cart Y, in kg?',
    n: '1.8',
    calc: ['velocities are the slopes of the straight pieces (spec points); momentum before = momentum after gives m(Y) = m(X)·(u − v) ÷ v', (c) => { const X = ptsOf(c, 0); const Y = ptsOf(c, 1); const u = slopeOf(X, 0); const v = slopeOf(X, 1); if (!near(slopeOf(Y, 0), 0) || !near(slopeOf(Y, 1), v)) throw new Error('Y is not at rest first / not at the common velocity after'); return round(0.60 * (u - v) / v, 4); }],
    h: ['On a position–time graph a velocity is a slope. Find the velocity of each cart before the collision and the velocity they share after it.', 'Set the total momentum before the collision equal to the total momentum after it; the only unknown is the mass asked for.'],
    s: 'Read from the graph: before the collision cart X moves 4 m in 2 s, so its velocity is 2 m/s, and cart Y is at rest (level line). Afterwards both lines rise 2 m in 4 s: a common velocity of 0.5 m/s. Momentum is conserved: 0.60 × 2 = (0.60 + m) × 0.5, so 0.60 + m = 2.4 and m = 1.8 kg.',
  },
  {
    t: 'mass of the second cart from the changes on a velocity–time graph', d: 3, need: 'calc',
    spec: mgraph('velocity', [{ label: 'cart X', points: [[0, 3], [2, 3], [2.5, 1], [5, 1]] }, { label: 'cart Y', points: [[0, -1], [2, -1], [2.5, 2], [5, 2]], dashed: true }], { tRange: [0, 5.5], yRange: [-2, 4], tStep: 0.5, yStep: 1 }),
    alt: 'A velocity–time graph with two lines, each level, then changing quickly during a short interval, then level again. The solid line, cart X, starts positive and drops to a smaller positive value. The dashed line, cart Y, starts negative and jumps to a positive value above the final value of X.',
    q: 'The graph shows the velocities of two carts, X and Y, that collide on a level, frictionless track. The mass of cart X is 0.60 kg. What is the mass of cart Y, in kg?',
    n: '0.4',
    calc: ['the momentum lost by X equals the momentum gained by Y: m(Y) = 0.60 × |Δv of X| ÷ |Δv of Y|, the changes read between the first and last points of each series (spec)', (c) => { const X = ptsOf(c, 0); const Y = ptsOf(c, 1); const dX = X[X.length - 1][1] - X[0][1]; const dY = Y[Y.length - 1][1] - Y[0][1]; if (!(dX * dY < 0)) throw new Error('the changes are not opposite'); return round(0.60 * Math.abs(dX) / Math.abs(dY), 4); }],
    alts: ['the same from total momentum before and after', () => [(0.60 * 3 - 0.60 * 1) / (2 - -1)]],
    h: ['Read the velocity of each cart before and after the collision, keeping the signs.', 'The total momentum does not change, so whatever momentum one cart loses the other gains. Compare the two changes in velocity.'],
    s: 'Read from the graph: the velocity of X changes from 3 m/s to 1 m/s, a change of −2 m/s; the velocity of Y changes from −1 m/s to 2 m/s, a change of +3 m/s. Momentum is conserved, so the changes in momentum are equal and opposite: 0.60 × 2 = m × 3, giving m = 0.40 kg. (Check: before, 0.60 × 3 + 0.40 × (−1) = 1.4 kg·m/s; after, 0.60 × 1 + 0.40 × 2 = 1.4 kg·m/s.)',
  },
]);

G('11c1e6e1.lo-4', 'An unknown velocity after a collision and after an explosion', [
  {
    t: 'velocity of the cart whose line stops at the collision', d: 3, need: 'calc',
    spec: mgraph('position', [{ label: 'cart X (2.0 kg)', points: [[0, 0], [2, 6], [5, 0]] }, { label: 'cart Y (4.0 kg)', points: [[0, 10], [2, 6]], dashed: true }], { tRange: [0, 6], yRange: [0, 12], tStep: 1, yStep: 2 }),
    alt: 'A position–time graph with two lines that meet at one point. The solid line, cart X, rises to the meeting point and then falls back to zero. The dashed line, cart Y, falls to the meeting point and stops there; nothing is drawn for cart Y after that.',
    q: 'The graph shows the positions of two carts on a level, frictionless track: cart X (2.0 kg) and cart Y (4.0 kg). They collide at t = 2 s; the line for cart Y is not drawn after the collision. Taking the direction of increasing position as positive, what is the velocity of cart Y after the collision, in m/s? Include the sign if it is negative.',
    n: '0.5',
    calc: ['velocities are slopes of the pieces (spec points); v(Y) = [m(X)·u(X) + m(Y)·u(Y) − m(X)·v(X)] ÷ m(Y); checked: the carts separate and kinetic energy does not increase', (c) => {
      const X = ptsOf(c, 0); const Y = ptsOf(c, 1); const [uX, vX, uY] = [slopeOf(X, 0), slopeOf(X, 1), slopeOf(Y, 0)];
      const vY = (2 * uX + 4 * uY - 2 * vX) / 4;
      if (!(vY > vX) || 0.5 * 2 * vX ** 2 + 0.5 * 4 * vY ** 2 > 0.5 * 2 * uX ** 2 + 0.5 * 4 * uY ** 2) throw new Error('not a possible collision');
      return round(vY, 4);
    }],
    h: ['Find three velocities from the slopes of the lines, with their signs: a line that falls has a negative velocity.', 'Add up the momentum of both carts before the collision. The same total must be shared between the two carts afterwards.'],
    s: 'Read from the graph: before the collision X moves from 0 to 6 m in 2 s (+3 m/s) and Y from 10 m to 6 m in 2 s (−2 m/s); afterwards X moves from 6 m to 0 in 3 s (−2 m/s). Total momentum before: 2.0 × 3 + 4.0 × (−2) = −2 kg·m/s. After: 2.0 × (−2) + 4.0 × v = −2, so 4.0v = 2 and v = +0.5 m/s. Cart Y moves slowly in the positive direction while X rebounds.',
  },
  {
    t: 'velocity of the second cart after a spring pushes two joined carts apart', d: 3, need: 'calc',
    spec: mgraph('position', [{ label: 'carts joined, then cart X', points: [[0, 2], [2, 4], [6, 0]] }], { tRange: [0, 7], yRange: [0, 6], tStep: 1, yStep: 1 }),
    alt: 'A position–time graph with one line in two straight pieces: it rises gently for the first part of the time and then falls steadily to zero.',
    q: 'Two carts, X (1.0 kg) and Y (2.0 kg), move together along a level, frictionless track with a compressed spring held between them. At t = 2 s the spring is released and pushes them apart. The graph shows the position of the joined carts up to t = 2 s and of cart X alone after that. Taking the direction of increasing position as positive, what is the velocity of cart Y after the release, in m/s?',
    n: '2',
    calc: ['velocities are slopes of the two pieces (spec points); v(Y) = [(1.0 + 2.0)·u − 1.0·v(X)] ÷ 2.0', (c) => { const k = ptsOf(c, 0); const u = slopeOf(k, 0); const vX = slopeOf(k, 1); return round((3.0 * u - 1.0 * vX) / 2.0, 4); }],
    h: ['Find from the slopes the velocity of the two carts while they are joined, and the velocity of cart X afterwards — with its sign.', 'The spring pushes the carts on each other, so the total momentum of the pair is the same after the release as before it.'],
    s: 'Read from the graph: up to t = 2 s the joined carts move from 2 m to 4 m in 2 s, a velocity of +1 m/s; after the release cart X moves from 4 m to 0 in 4 s, a velocity of −1 m/s. The spring forces are internal, so momentum is conserved: (1.0 + 2.0) × 1 = 1.0 × (−1) + 2.0 × v, so 2.0v = 4 and v = +2 m/s.',
  },
]);

// ── Elastic vs. Inelastic Collisions (pack 252) ─────────────────────────────

G('d0910434.lo-2', 'Kinetic energy before and after, with the velocities read from graphs', [
  {
    t: 'kinetic energy lost when one of the masses must be found first', d: 3, need: 'calc',
    spec: mgraph('velocity', [{ label: 'cart X', points: [[0, 4], [1, 4], [1.5, 1], [3, 1]] }, { label: 'cart Y', points: [[0, 0], [1, 0], [1.5, 2], [3, 2]], dashed: true }], { tRange: [0, 3.5], yRange: [0, 5], tStep: 0.5, yStep: 1 }),
    alt: 'A velocity–time graph with two lines, each level, then changing quickly during a short interval, then level again. The solid line, cart X, drops from a high value to a low one. The dashed line, cart Y, starts at zero and rises to a value between the two values of X.',
    q: 'The graph shows the velocities of two carts, X and Y, that collide on a level, frictionless track. Cart X has a mass of 2.0 kg; the mass of cart Y is not given. How much kinetic energy is lost in the collision, in joules?',
    n: '9',
    calc: ['m(Y) from the equal and opposite momentum changes, then ½mv² for both carts before minus after — all velocities from the first and last points of each series (spec)', (c) => { const X = ptsOf(c, 0); const Y = ptsOf(c, 1); const [uX, vX, uY, vY] = [X[0][1], X[X.length - 1][1], Y[0][1], Y[Y.length - 1][1]]; const mY = 2.0 * (uX - vX) / (vY - uY); return round(0.5 * 2.0 * uX ** 2 + 0.5 * mY * uY ** 2 - 0.5 * 2.0 * vX ** 2 - 0.5 * mY * vY ** 2, 4); }],
    h: ['You need the mass of cart Y before you can find its kinetic energy. Momentum is conserved in the collision: use the velocities on the graph to find that mass.', 'Then work out ½mv² for each cart before and after, and compare the two totals.'],
    s: 'Read from the graph: X slows from 4 m/s to 1 m/s and Y speeds up from rest to 2 m/s. Momentum: 2.0 × 4 = 2.0 × 1 + m × 2, so m = 3.0 kg. Kinetic energy before: ½ × 2.0 × 4² = 16 J (Y is at rest). After: ½ × 2.0 × 1² + ½ × 3.0 × 2² = 1 + 6 = 7 J. Kinetic energy lost: 16 − 7 = 9 J.',
  },
  {
    t: 'kinetic energy lost, from the slopes of a position–time graph', d: 3, need: 'calc',
    spec: mgraph('position', [{ label: 'cart X (1.0 kg)', points: [[0, 0], [2, 6], [4, 6]] }, { label: 'cart Y (2.0 kg)', points: [[0, 7], [2, 7], [4, 10]], dashed: true }], { tRange: [0, 5], yRange: [0, 11], tStep: 1, yStep: 1 }),
    alt: 'A position–time graph with two lines. The solid line, cart X, rises steeply and then becomes level. The dashed line, cart Y, is level at first, just above where the solid line ends its rise, and then rises less steeply than the solid line did.',
    q: 'The graph shows the positions of two carts on a level, frictionless track: cart X (1.0 kg) and cart Y (2.0 kg). They collide at t = 2 s. How much kinetic energy is lost in the collision, in joules?',
    n: '2.25',
    calc: ['velocities are the slopes of the pieces (spec points); ½mv² before minus after; checked: momentum is conserved by those slopes', (c) => { const X = ptsOf(c, 0); const Y = ptsOf(c, 1); const [uX, vX, uY, vY] = [slopeOf(X, 0), slopeOf(X, 1), slopeOf(Y, 0), slopeOf(Y, 1)]; if (!near(1.0 * uX + 2.0 * uY, 1.0 * vX + 2.0 * vY)) throw new Error('momentum is not conserved'); return round(0.5 * 1.0 * (uX ** 2 - vX ** 2) + 0.5 * 2.0 * (uY ** 2 - vY ** 2), 4); }],
    h: ['A velocity on this graph is a slope; a level line is a cart at rest. Find the velocity of each cart before and after the collision.', 'Kinetic energy is ½mv² for each cart. Add up the kinetic energies before and after and subtract.'],
    s: 'Read from the graph: before the collision X moves 6 m in 2 s (3 m/s) and Y is at rest; afterwards X is at rest and Y moves 3 m in 2 s (1.5 m/s). Kinetic energy before: ½ × 1.0 × 3² = 4.5 J. After: ½ × 2.0 × 1.5² = 2.25 J. Lost: 4.5 − 2.25 = 2.25 J. (Momentum is conserved: 1.0 × 3 = 2.0 × 1.5.)',
  },
]);

// ── Projectiles Launched at an Angle (pack 258) ─────────────────────────────

G('ef336649.lo-4', 'Time of flight from a partial record of the motion', [
  {
    t: 'time of flight on another planet from the first part of the vertical-velocity graph', d: 3, need: 'calc',
    spec: mgraph('velocity', [{ points: [[0, 12], [2, 4]] }], { tRange: [0, 4], yRange: [0, 14], tStep: 1, yStep: 2, yLabel: 'Vertical velocity (m/s)' }),
    alt: 'A velocity–time graph with one straight line that falls from a high value at time zero and stops part of the way across the grid, while the vertical velocity is still positive.',
    q: 'A ball is thrown at an angle from level ground on another planet. The graph shows the vertical component of its velocity (up is positive) for the first 2 s of the flight only; there is no air resistance. How long after the throw does the ball return to ground level, in seconds?',
    n: '6',
    calc: ['the line through the two points of the spec reaches zero at t = v₀ ÷ (rate of fall of the velocity); the flight lasts twice as long', (c) => { const k = ptsOf(c, 0); const g = -slopeOf(k, 0); return round(2 * k[0][1] / g, 4); }],
    h: ['The slope of this graph is the vertical acceleration on that planet, and it stays the same for the whole flight.', 'Find when the vertical velocity would reach zero — the top of the flight. The ball then takes just as long to come down as it took to go up.'],
    s: 'Read from the graph: the vertical velocity falls from 12 m/s to 4 m/s in 2 s, a steady 4 m/s every second. Continuing at that rate it reaches zero, the top of the flight, at 12 / 4 = 3 s. With no air resistance the way down takes as long as the way up, so the ball is back at ground level at 2 × 3 = 6 s.',
  },
  {
    t: 'time of flight from one point of the height–time graph', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Height (m)', [0, 5], 1, [0, 25], 5, [{ expr: '20x - 5x^2', domain: [0, 1], to: 'closed' }]),
    alt: 'A height–time graph with one short curve that rises from the origin, bending slightly, and stops at a marked end point one time step later, well below the top of the grid.',
    q: 'A ball is thrown at an angle from level ground. The graph shows its height above the ground for the first second of the flight only. Taking g = 10 m/s² and ignoring air resistance, how long after the throw does the ball return to ground level, in seconds?',
    n: '4',
    calc: ['v₀ (vertical) from the height at t = 1 s on the spec\'s expression: h = v₀t − ½gt² with g = 10; time of flight = 2v₀ ÷ g', (c) => { const h1 = fOf(c)(1); const v0 = h1 + 5; return round(2 * v0 / 10, 4); }],
    h: ['Use the one height you can read exactly, at t = 1 s, in h = v₀t − ½gt² to find the vertical launch velocity.', 'The ball is back at ground level when h = 0 again; solve for that time, or use the symmetry of the rise and the fall.'],
    s: 'Read from the graph: at t = 1 s the height is 15 m. With h = v₀t − ½gt²: 15 = v₀(1) − ½(10)(1)², so the vertical launch velocity is v₀ = 20 m/s. The ball returns to the ground when v₀t − 5t² = 0, that is t = v₀ / 5 = 4 s (2 s up and 2 s down).',
  },
]);

// ── Horizontally Launched Projectiles (pack 207) ────────────────────────────

G('16f36ea9.lo-1', 'Two independent motions: components that combine, and a fall that is shared', [
  {
    t: 'when the velocity is at 45° below the horizontal, from the two component graphs', d: 3, need: 'reason',
    spec: pgraph('Time (s)', 'Velocity component (m/s)', [0, 1], 0.1, [-10, 10], 2, [{ expr: '8', label: 'horizontal' }, { expr: '-10x', label: 'vertical', dashed: true }]),
    alt: 'Two straight lines on a grid of velocity component against time. The solid line, the horizontal component, is level and positive. The dashed line, the vertical component, starts at zero and falls steadily to the bottom right corner of the grid.',
    q: 'A ball is thrown horizontally from a cliff. The graph shows the horizontal (solid) and vertical (dashed) components of its velocity; up is positive. At what time after the throw is the ball moving in a direction 45° below the horizontal, in seconds?',
    n: '0.8',
    calc: ['the time (searched on the grid lines of the time axis) at which the size of the vertical component equals the horizontal component, from the spec\'s two expressions', (c) => { const [h, v] = [fOf(c, 0), fOf(c, 1)]; const hits = grid(0.1, 1, 0.1).filter((t) => near(Math.abs(v(t)), h(t), 1e-9)); if (hits.length !== 1) throw new Error(`hits ${hits}`); return hits[0]; }],
    h: ['The direction of motion is set by the two components together. What must be true of their sizes when the velocity points 45° below the horizontal?', 'The horizontal component never changes; follow the vertical one until its size reaches the value you need.'],
    s: 'The ball moves at 45° below the horizontal when the vertical component is as large as the horizontal one (and points down). Read from the graph: the horizontal component stays at 8 m/s the whole time, because nothing acts horizontally; the vertical component reaches −8 m/s at t = 0.8 s. So the ball is moving at 45° below the horizontal at 0.8 s.',
  },
  {
    t: 'impact speed of a thrown ball from the fall time of a dropped one', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Height above the ground (m)', [0, 3], 0.5, [0, 25], 5, [{ expr: '20 - 5x^2' }]),
    alt: 'A height–time graph with one curve that starts on the height axis, falls slowly at first and then faster, and ends on the time axis.',
    q: 'A ball is dropped from the edge of a flat roof; the graph shows its height above the ground. At the same instant a second ball is thrown horizontally from the same point at 15 m/s. Taking g = 10 m/s² and ignoring air resistance, with what speed does the second ball hit the ground, in m/s?',
    n: '25',
    calc: ['the fall time is where the spec\'s height expression reaches zero (the same for both balls); vertical speed = 10 m/s² × that time; impact speed = √(15² + vertical speed²); checked: the expression falls 5 m in its first second, as g = 10 m/s² requires', (c) => { const f = fOf(c); const t = grid(0.5, 3, 0.5).filter((x) => near(f(x), 0)); if (t.length !== 1 || !near(f(0) - f(1), 5)) throw new Error(`zeros ${t}`); return round(Math.hypot(15, 10 * t[0]), 4); }],
    h: ['The thrown ball falls exactly as the dropped ball does: its horizontal motion makes no difference to its vertical motion. Read from the graph how long the fall lasts.', 'At the ground the thrown ball has two velocity components: one that has not changed since the throw and one that it has gained by falling. Combine them.'],
    s: 'The horizontal and vertical motions are independent, so the thrown ball falls just like the dropped one. Read from the graph: the dropped ball reaches the ground (height 0) at t = 2.0 s. After falling for 2.0 s the vertical speed is gt = 10 × 2.0 = 20 m/s, for both balls. The second ball still has its horizontal velocity of 15 m/s, so it hits the ground at √(15² + 20²) = √625 = 25 m/s.',
  },
]);

// ── Springs and Hooke's Law (pack 237) ──────────────────────────────────────

G('a52137eb.lo-2', 'Spring force beyond the plotted range, from a length graph and a restoring-force graph', [
  {
    t: 'load for a stated length when the graph gives length, not extension', d: 3, need: 'calc',
    spec: pgraph('Load (N)', 'Length of spring (cm)', [0, 6], 1, [0, 28], 4, [{ expr: '12 + 2x' }]),
    alt: 'A straight rising line on a grid of spring length against load. It starts part of the way up the length axis, not at the origin, and reaches the right-hand edge of the grid below the top.',
    q: 'The graph shows the total length of a spring hanging vertically as the load on it is increased. The spring stays within its elastic limit. What load, in newtons, makes the spring 30 cm long?',
    n: '9',
    calc: ['extension = 30 cm − the length at zero load; load = extension ÷ (extension per newton), both from the spec\'s straight line', (c) => { const f = fOf(c); const perN = f(1) - f(0); return round((30 - f(0)) / perN, 4); }],
    h: ['The spring force is proportional to the EXTENSION — the length minus the unstretched length — not to the length. Read the unstretched length from the graph.', 'Find how much the spring stretches for each newton of load, and then how much stretch a length of 30 cm represents.'],
    s: 'Read from the graph: with no load the spring is 12 cm long, and each extra 2 N adds 4 cm (16 cm at 2 N, 20 cm at 4 N), so the spring constant is 2 N / 4 cm = 0.5 N/cm (50 N/m). A length of 30 cm is an extension of 30 − 12 = 18 cm, beyond the range of the graph but within the elastic limit: F = 0.5 × 18 = 9 N.',
  },
  {
    t: 'acceleration with its sign at a displacement beyond the plotted range', d: 3, need: 'calc',
    spec: pgraph('Displacement x (m)', 'Force of spring on block (N)', [-0.25, 0.25], 0.05, [-10, 10], 2, [{ expr: '-40x' }]),
    alt: 'A straight line through the origin on a grid of spring force against displacement. It falls from the upper left corner of the grid to the lower right corner.',
    q: 'The graph shows the force that a horizontal spring exerts on a 0.50 kg block attached to it, against the displacement x of the block from its equilibrium position; the surface is frictionless and the spring obeys Hooke\'s law throughout. What is the acceleration of the block at the instant when x = −0.35 m, in m/s²? Include the sign if it is negative.',
    n: '28',
    calc: ['F = (slope of the spec\'s line) × (−0.35 m); a = F ÷ 0.50 kg', (c) => { const f = fOf(c); const slope = (f(0.1) - f(0)) / 0.1; return round((slope * -0.35) / 0.50, 4); }],
    h: ['Find the spring constant from the slope of the line; the sign of the slope tells you which way the force points for a given displacement.', 'The displacement asked about is off the graph, so use F = −kx, and then Newton\'s second law.'],
    s: 'Read from the graph: the line passes through (0.10 m, −4 N) and (0.20 m, −8 N), so the force is −40 N for each metre of displacement: F = −kx with k = 40 N/m. At x = −0.35 m, F = −40 × (−0.35) = +14 N, directed back toward equilibrium. The acceleration is a = F / m = 14 / 0.50 = +28 m/s².',
  },
]);

// ── Bohr Model and Atomic Spectra (pack 201) ────────────────────────────────

G('0938830f.lo-1', 'Quantised levels: which photons are absorbed, and a level found from the absorbed ones', [
  {
    t: 'fate of three photon energies, one above the ionisation energy', d: 3, need: 'reason',
    spec: ladder([{ energy: -11 }, { energy: -6 }, { energy: -3 }, { energy: -1.5 }], { ionization: true }),
    alt: 'An energy-level ladder with four levels, each printed with its energy in electronvolts, and a dashed line above them at zero energy marking ionisation. The gaps between levels get smaller toward the top.',
    q: 'The diagram shows every energy level of the electron in a model atom below the ionisation level (E = 0). Atoms in the lowest level are illuminated, in turn, with photons of energy 8 eV, 9 eV and 12 eV. What happens to each kind of photon?',
    o: [
      ['8 eV: absorbed; 9 eV: not absorbed; 12 eV: absorbed, and the electron leaves the atom', 'correct'],
      ['8 eV: absorbed; 9 eV: absorbed, with 1 eV left over; 12 eV: not absorbed', 'lets an electron take part of a photon between levels, but not leave the atom'],
      ['8 eV: absorbed; 9 eV: not absorbed; 12 eV: not absorbed', 'applies the exact-gap rule above the ionisation energy as well'],
      ['8 eV: absorbed; 9 eV: absorbed, with 1 eV left over; 12 eV: absorbed, and the electron leaves the atom', 'lets an electron take part of a photon between levels'],
    ],
    holds: ['from the spec\'s energies: a photon is absorbed by an atom in the lowest level when its energy equals a gap to a higher level, or when it is at least the ionisation energy (the electron then leaves)', (() => {
      const fate = (c: Ctx, e: number): string => { const E = energiesOf(c); const ground = E[0]; return E.slice(1).some((v) => near(v - ground, e)) ? 'absorbed' : e >= -ground ? 'ionises' : 'not'; };
      const is = (a: string, b: string, d: string) => (c: Ctx) => fate(c, 8) === a && fate(c, 9) === b && fate(c, 12) === d;
      return [is('absorbed', 'not', 'ionises'), is('absorbed', 'absorbed', 'not'), is('absorbed', 'not', 'not'), is('absorbed', 'absorbed', 'ionises')];
    })()],
    h: ['Work out the energy needed to lift the electron from the lowest level to each of the other levels, and to remove it from the atom altogether.', 'Treat the photon that has more energy than is needed to remove the electron separately from the two that have less: the rule for an electron that stays in the atom is not the rule for one that leaves it.'],
    s: 'Read from the diagram: from the lowest level (−11 eV) the gaps to the other levels are 5 eV, 8 eV and 9.5 eV, and ionisation needs 11 eV. A photon of 8 eV matches the gap to the level at −3 eV: absorbed. A photon of 9 eV matches no gap and is below 11 eV: it is not absorbed at all — an electron cannot take part of a photon. A photon of 12 eV exceeds the ionisation energy: it is absorbed and the electron leaves the atom with 1 eV of kinetic energy.',
  },
  {
    t: 'energy of a blank level from the photon energies a cold gas absorbs', d: 3, need: 'calc',
    spec: ladder([{ energy: -12 }, { energy: -8, energy_shown: 'blank' }, { energy: -6 }, { energy: -3 }], { scale: 'even' }),
    hide: [-8, '−8', '-8', '−8 eV', '-8 eV'],
    alt: 'An energy-level ladder with four evenly spaced levels, marked as not drawn to scale. Three are printed with their energies in electronvolts; the second level from the bottom has a blank box in place of its energy.',
    q: 'The diagram shows the four lowest energy levels of an atom; the energy of one level is left blank. A cold gas of these atoms, all in the lowest level, absorbs photons of exactly 4 eV, 6 eV and 9 eV, and no others below 9 eV. What is the energy of the blank level, in eV? Include the sign.',
    n: '-8',
    calc: ['the three absorbed energies are the gaps from the lowest level; two of them are accounted for by the printed levels, the third gives the blank one (spec energies)', (c) => { const shown = arr(c.p.levels).filter((l) => l.energy_shown !== 'blank').map((l) => l.energy as number).sort((a, b) => a - b); const ground = shown[0]; const left = [4, 6, 9].filter((e) => !shown.slice(1).some((v) => near(v - ground, e))); if (left.length !== 1) throw new Error(`left ${left}`); const E = ground + left[0]; if (!near(E, arr(c.p.levels).find((l) => l.energy_shown === 'blank')!.energy as number)) throw new Error('not the blank level'); return E; }],
    h: ['Every atom starts in the lowest level, so each absorbed photon lifts the electron from that level to one of the levels above it.', 'Two of the three photon energies match gaps you can work out from the printed energies. The remaining one must lead to the blank level.'],
    s: 'All the atoms start in the lowest level, at −12 eV, so each absorbed energy is a gap from that level. Read from the diagram: the printed levels at −6 eV and −3 eV are 6 eV and 9 eV above the lowest level — two of the three absorbed energies. The third, 4 eV, must lift the electron to the blank level, which is therefore at −12 + 4 = −8 eV.',
  },
]);

G('0938830f.lo-2', 'The hydrogen formula used to identify and compare transitions', [
  {
    t: 'which transition emits a photon of a stated energy', d: 3, need: 'calc',
    spec: S('energy_levels', { variant: 'levels', hydrogen: { nMax: 5, hide: [2, 3, 4, 5] } }),
    hide: ['n = 2', 'n = 4'],
    alt: 'An energy-level ladder for hydrogen with five levels, numbered upward from n = 1 and marked as not drawn to scale. Only the lowest level is printed with its energy.',
    q: 'The diagram shows the five lowest energy levels of the hydrogen atom, with only the energy of n = 1 printed; the levels obey Eₙ = E₁ / n². A hydrogen atom emits a photon of energy 2.55 eV. Between which two levels does the electron move?',
    o: [['From n = 4 to n = 2', 'correct'], ['From n = 3 to n = 2', 'gives 1.89 eV: stops at the first transition that ends on n = 2'], ['From n = 5 to n = 2', 'gives 2.86 eV: uses the wrong upper level'], ['From n = 4 to n = 1', 'gives 12.75 eV: takes the transition to the lowest level']],
    holds: ['the photon energy of each option from Eₙ = −13.6 eV / n² (the spec\'s hydrogen ladder), to two decimal places', (() => {
      const e = (c: Ctx, hi: number, lo: number) => { const E = energiesOf(c); return round(E[hi - 1] - E[lo - 1], 2); };
      const is = (hi: number, lo: number) => (c: Ctx) => e(c, hi, lo) === 2.55;
      return [is(4, 2), is(3, 2), is(5, 2), is(4, 1)];
    })()],
    h: ['Use the printed energy of n = 1 and the formula to work out the energies of the other levels.', 'The photon carries away the difference between two level energies. Work out that difference for each candidate transition and compare it with 2.55 eV.'],
    s: 'Read from the diagram: E₁ = −13.6 eV, so E₂ = −13.6 / 4 = −3.40 eV, E₃ = −13.6 / 9 = −1.51 eV, E₄ = −13.6 / 16 = −0.85 eV and E₅ = −13.6 / 25 = −0.54 eV. The differences are: 4 → 2, 3.40 − 0.85 = 2.55 eV; 3 → 2, 1.89 eV; 5 → 2, 2.86 eV; 4 → 1, 12.75 eV. The photon of 2.55 eV comes from n = 4 to n = 2.',
  },
  {
    t: 'ratio of the photon energies of two drawn transitions', d: 3, need: 'calc',
    spec: S('energy_levels', { variant: 'levels', hydrogen: { nMax: 4, hide: [2, 3, 4] }, transitions: [{ from: 4, to: 2, label: 'X' }, { from: 2, to: 1, label: 'Y' }] }),
    hide: ['n = 4'],
    alt: 'An energy-level ladder for hydrogen with four levels, numbered upward from n = 1 and marked as not drawn to scale; only the lowest level is printed with its energy. Two downward arrows are drawn: X from the top level to the second, and Y from the second level to the lowest.',
    q: 'The diagram shows the four lowest energy levels of the hydrogen atom, which obey Eₙ = E₁ / n², and two transitions, X and Y. How many times as large as the energy of the photon emitted in transition X is the energy of the photon emitted in transition Y?',
    n: '4',
    calc: ['photon energy of Y ÷ photon energy of X, each from the level_transition_energy checker', (c) => round(c.num('level_transition_energy', { transition: 'Y' }) / c.num('level_transition_energy', { transition: 'X' }), 4)],
    alts: ['with the level energies rounded to two decimal places first', () => [(13.6 - 3.4) / (3.4 - 0.85)]],
    h: ['Read from the arrows which two levels each transition joins, and work out the energy of each of those levels from the formula.', 'Each photon energy is a difference of two level energies. The arrows are not drawn to scale, so compare the numbers, not the lengths.'],
    s: 'Read from the diagram: X goes from n = 4 to n = 2 and Y from n = 2 to n = 1, and E₁ = −13.6 eV. Then E₂ = −13.6 / 4 = −3.40 eV and E₄ = −13.6 / 16 = −0.85 eV. Photon X: 3.40 − 0.85 = 2.55 eV. Photon Y: 13.6 − 3.40 = 10.2 eV. The ratio is 10.2 / 2.55 = 4.',
  },
]);

G('0938830f.lo-4', 'Wavelengths compared through the energy gaps', [
  {
    t: 'wavelength of one transition from the stated wavelength of another', d: 3, need: 'calc',
    spec: ladder([{ energy: -10 }, { energy: -6 }, { energy: -5 }, { energy: -4 }], { transitions: [{ from: 4, to: 2, label: 'X' }, { from: 3, to: 1, label: 'Y' }] }),
    alt: 'An energy-level ladder with four levels, each printed with its energy in electronvolts; the upper three are close together and well above the lowest. Two downward arrows are drawn: X from the top level to the second level from the bottom, and Y from the third level from the bottom to the lowest.',
    q: 'The diagram shows four energy levels of an atom and two transitions, X and Y. The light emitted in transition X has a wavelength of 620 nm. What is the wavelength of the light emitted in transition Y, in nm?',
    n: '248',
    calc: ['620 nm × (energy of X ÷ energy of Y), the photon energies from the level_transition_energy checker — wavelength is inversely proportional to photon energy', (c) => round(620 * c.num('level_transition_energy', { transition: 'X' }) / c.num('level_transition_energy', { transition: 'Y' }), 4)],
    alts: ['through hc = 1240 eV·nm instead of the ratio', () => [HC / 5]],
    h: ['Find the photon energy of each transition from the level energies it joins.', 'Photon energy and wavelength are inversely proportional (E = hc/λ): the transition with more energy has the shorter wavelength, in the same ratio.'],
    s: 'Read from the diagram: X goes from −4 eV to −6 eV, a photon of 2 eV; Y goes from −5 eV to −10 eV, a photon of 5 eV. Since E = hc/λ, the wavelength is inversely proportional to the photon energy: λ(Y) = 620 nm × (2 / 5) = 248 nm, in the ultraviolet.',
  },
  {
    t: 'longest wavelength among the transitions that end on one level', d: 3, need: 'calc',
    spec: ladder([{ energy: -10 }, { energy: -5 }, { energy: -2.5 }, { energy: -1 }]),
    alt: 'An energy-level ladder with four levels, each printed with its energy in electronvolts. The gaps between neighbouring levels get smaller toward the top; no transitions are drawn.',
    q: 'The diagram shows four energy levels of an atom. Atoms in the upper levels emit light as they drop to the level at −5 eV. What is the LONGEST wavelength emitted in these transitions, in nm? Use hc = 1240 eV·nm.',
    n: '496',
    calc: ['hc ÷ (the smallest gap from a higher level down to the level at −5 eV), from the spec\'s energies', (c) => { const E = energiesOf(c); const gaps = E.filter((v) => v > -5).map((v) => v - -5); if (gaps.length !== 2) throw new Error('needs two higher levels'); return round(HC / Math.min(...gaps), 4); }],
    h: ['List the transitions that end on the level at −5 eV and find the photon energy of each.', 'Decide whether a longer wavelength goes with a larger or a smaller photon energy, using λ = hc / E, before you choose the transition.'],
    s: 'Read from the diagram: two levels lie above −5 eV, at −2.5 eV and −1 eV. Dropping to −5 eV from them releases photons of 2.5 eV and 4 eV. The longest wavelength goes with the smallest photon energy: λ = hc / E = 1240 / 2.5 = 496 nm (the other line is at 1240 / 4 = 310 nm).',
  },
]);

// ── Wave Speed Equation Fundamentals (pack 238) ─────────────────────────────

G('ade9f012.lo-2', 'v = fλ when the speed or the wavelength must be worked out from two curves', [
  {
    t: 'frequency from two snapshots of the same wave a known time apart', d: 3, need: 'calc',
    spec: pgraph('Position (m)', 'Displacement (cm)', [0, 8], 1, [-3, 3], 1, [{ expr: '2*sin(pi*x/2)', label: 'at first' }, { expr: '2*sin(pi*(x - 1)/2)', label: '0.20 s later', dashed: true }]),
    alt: 'Two snapshots of the same wave on one grid of displacement against position. The dashed curve, 0.20 s later, has the same shape as the solid one, moved a short distance to the right.',
    q: 'The graph shows a wave on a string at one instant (solid) and 0.20 s later (dashed). The wave travels to the right and moves less than one wavelength in that time. What is the frequency of the wave, in Hz?',
    n: '1.25',
    calc: ['speed = (shift of a crest between the two expressions of the spec) ÷ 0.20 s; wavelength = distance between crests of one curve; f = speed ÷ wavelength', (c) => { const [a, b] = [fOf(c, 0), fOf(c, 1)]; const crests = (f: (x: number) => number) => grid(0, 8, 0.5).filter((x) => near(f(x), 2, 1e-9)); const [ca, cb] = [crests(a), crests(b)]; const shift = cb[0] - ca[0]; const lambda = ca[1] - ca[0]; if (!(shift > 0 && shift < lambda)) throw new Error('shift'); return round(shift / 0.20 / lambda, 4); }],
    h: ['Follow one crest: how far has it moved between the two snapshots? That distance and the time give the speed of the wave.', 'Read the wavelength from either curve, crest to crest, and then use v = fλ.'],
    s: 'Read from the graph: a crest of the solid curve at x = 1 m is at x = 2 m on the dashed curve, so the wave has moved 1 m in 0.20 s: v = 1 / 0.20 = 5 m/s. The crests of one curve are 4 m apart (x = 1 m and x = 5 m), so λ = 4 m. Then f = v / λ = 5 / 4 = 1.25 Hz.',
  },
  {
    t: 'frequency of a second wave on the same string', d: 3, need: 'calc',
    spec: pgraph('Position (m)', 'Displacement (cm)', [0, 12], 1, [-3, 3], 1, [{ expr: '2*cos(pi*x/3)', label: 'wave 1' }, { expr: 'cos(pi*x/2)', label: 'wave 2', dashed: true }]),
    alt: 'Snapshots of two different waves on one grid of displacement against position, both with a crest at the left-hand edge. The solid curve, wave 1, is taller and its crests are further apart; the dashed curve, wave 2, is lower and its crests are closer together.',
    q: 'The graph shows snapshots of two waves that travel, at different times, along the same stretched string under the same tension. Wave 1 (solid) has a frequency of 2.0 Hz. What is the frequency of wave 2 (dashed), in Hz?',
    n: '3',
    calc: ['2.0 Hz × (wavelength of wave 1 ÷ wavelength of wave 2), each wavelength the distance between neighbouring crests of the spec\'s expression', (c) => { const lam = (f: (x: number) => number) => periodOf(f, 12); return round(2.0 * lam(fOf(c, 0)) / lam(fOf(c, 1)), 4); }],
    h: ['Read the wavelength of each wave, crest to crest. The heights of the waves are irrelevant.', 'The speed of a wave on a string is set by the string and its tension, not by the wave. Ask what that means for the product fλ.'],
    s: 'Read from the graph: wave 1 has crests at x = 0 and x = 6 m, so λ = 6 m; wave 2 has crests at x = 0 and x = 4 m, so λ = 4 m. The speed of a wave on a string depends only on the string and its tension, so it is the same for both: v = 2.0 × 6 = 12 m/s. For wave 2, f = v / λ = 12 / 4 = 3 Hz.',
  },
]);

G('ade9f012.lo-4', 'Wave speed and travel time from a snapshot and a statement about timing', [
  {
    t: 'wave speed when the time given is a quarter of a period', d: 3, need: 'calc',
    spec: S('wave_diagram', { variant: 'transverse', amplitude: 2, wavelength: 4, cycles: 2, start: 'cosine', scale: true, xStep: 1, yStep: 1, yMax: 3, yUnit: 'cm', points: [{ x: 4, label: 'P' }] }),
    alt: 'A snapshot of a wave drawn on a numbered grid of displacement against position, showing two full cycles that start on a crest. One point of the wave, P, is marked on the crest in the middle of the drawing.',
    q: 'The graph shows a snapshot of a wave travelling along a rope. The point P of the rope is at a crest at this instant, and it next passes through its equilibrium position 0.25 s later. What is the speed of the wave, in m/s?',
    n: '4',
    calc: ['wavelength from the wave_wavelength checker; period = 4 × 0.25 s (crest to equilibrium is a quarter of a cycle); speed = wavelength ÷ period', (c) => round(c.num('wave_wavelength', {}) / (4 * 0.25), 4)],
    h: ['A point of the rope moves up and down as the wave passes. What fraction of a full cycle takes it from a crest to the equilibrium position?', 'Use that to get the period, read the wavelength from the snapshot, and combine them: v = λ / T.'],
    s: 'A point of the rope goes from its highest position to equilibrium in a quarter of a cycle, so the period is T = 4 × 0.25 = 1.0 s. Read from the graph: neighbouring crests are 4 m apart, so λ = 4 m. The speed is v = λ / T = 4 / 1.0 = 4 m/s.',
  },
  {
    t: 'time for a crest to travel between two marked points', d: 3, need: 'calc',
    spec: S('wave_diagram', { variant: 'transverse', amplitude: 2, wavelength: 4, cycles: 2, start: 'sine', scale: true, xStep: 1, yStep: 1, yMax: 3, yUnit: 'cm', points: [{ x: 1, label: 'P' }, { x: 4, label: 'Q' }] }),
    alt: 'A snapshot of a wave drawn on a numbered grid of displacement against position, showing two full cycles that start at the equilibrium line going up. Two points of the wave are marked: P on the first crest, and Q further right where the wave crosses the equilibrium line.',
    q: 'The graph shows a snapshot of a wave of frequency 5.0 Hz travelling to the right along a rope; P and Q are two points of the rope. How long does the crest that is now at P take to reach Q, in seconds?',
    n: '0.15',
    calc: ['distance PQ (spec points) ÷ speed, the speed being 5.0 Hz × the wavelength from the wave_wavelength checker', (c) => { const pts = arr(c.p.points); const d = (pts[1].x as number) - (pts[0].x as number); return round(d / (5.0 * c.num('wave_wavelength', {})), 4); }],
    alts: ['as a fraction of the period: (distance ÷ wavelength) × (1 ÷ 5.0 Hz)', () => [(3 / 4) * 0.2]],
    h: ['Read the wavelength from the snapshot and use the frequency to find the speed of the wave.', 'Read how far apart P and Q are along the rope; the crest covers that distance at the wave speed.'],
    s: 'Read from the graph: the crests are 4 m apart, so λ = 4 m and v = fλ = 5.0 × 4 = 20 m/s. P is at x = 1 m and Q at x = 4 m, 3 m apart. The crest takes t = 3 / 20 = 0.15 s to reach Q (three quarters of a wavelength takes three quarters of the 0.20 s period).',
  },
]);

// ── Centripetal Force Sources (pack 246) ────────────────────────────────────

G('c0ef80f3.lo-5', 'Radius from the slope of a force graph and from an inverse proportion', [
  {
    t: 'radius from the slope of tension against speed squared', d: 3, need: 'calc',
    spec: pgraph('Speed squared, v² (m²/s²)', 'Tension in the string (N)', [0, 10], 2, [0, 5], 1, [{ expr: '0.5x' }]),
    alt: 'A straight line through the origin on a grid of string tension against the square of the speed. It rises steadily to the upper right corner of the grid.',
    q: 'A 0.20 kg puck on the end of a string moves in a horizontal circle on a frictionless table. The graph shows the tension in the string against the SQUARE of the speed of the puck, v². What is the radius of the circle, in metres?',
    n: '0.4',
    calc: ['T = (m/r)·v², so r = 0.20 kg ÷ (slope of the spec\'s line, from curve_slope)', (c) => round(0.20 / c.num('curve_slope', { curve: 0, x1: 0, x2: 8 }), 4)],
    h: ['The tension is the only horizontal force on the puck, so it is the centripetal force: T = mv²/r.', 'Compare that equation with the straight line: the slope of T against v² stands for a combination of the mass and the radius.'],
    s: 'The tension supplies the centripetal force: T = mv²/r = (m/r)·v², so a graph of T against v² is a straight line of slope m/r. Read from the graph: the line passes through (4 m²/s², 2 N) and (8 m²/s², 4 N), a slope of 0.5 N per m²/s², that is 0.5 kg/m. Then r = m / slope = 0.20 / 0.5 = 0.4 m.',
  },
  {
    t: 'tightest bend for a stated maximum friction force, beyond the plotted curve', d: 3, need: 'calc',
    spec: pgraph('Radius of bend (m)', 'Friction force needed (kN)', [0, 250], 50, [0, 10], 1, [{ expr: '450/x' }]),
    alt: 'A falling curve on a grid of friction force against the radius of the bend. It comes down steeply from the top of the grid at small radius and flattens out toward the right, never reaching the radius axis.',
    q: 'A car is driven round level bends of different radius, always at the same speed. The graph shows the sideways friction force the road must supply for each radius. The tyres can supply at most 15 kN before the car skids. What is the radius of the tightest bend the car can take at this speed, in metres?',
    n: '30',
    calc: ['force × radius is constant along the spec\'s curve (checked at four radii); the radius at 15 kN is that constant ÷ 15', (c) => { const f = fOf(c); const k = f(50) * 50; for (const r of [75, 90, 150, 225]) if (!near(f(r) * r, k)) throw new Error('not an inverse proportion'); return round(k / 15, 4); }],
    h: ['At a fixed speed the centripetal force mv²/r is inversely proportional to the radius, so force × radius has the same value at every point of the curve.', 'Read one point of the curve exactly to find that value. The force asked about is above the top of the graph, so calculate the radius rather than reading it.'],
    s: 'At a fixed speed F = mv²/r, so F × r is constant. Read from the graph: at r = 50 m the force is 9 kN (and at r = 150 m it is 3 kN), so F × r = 450 kN·m. The tightest bend is the one that needs the full 15 kN: r = 450 / 15 = 30 m. Any tighter bend would need more friction than the tyres can supply.',
  },
]);

// ITEMS-END

/** Low-level-only objectives that get no item here, and why (the rest of the uncovered ones: the cap of about 70 items). */
const NOT_REACHED: Record<string, string> = {
  'a52137eb.lo-1': 'defining Hooke\'s law and naming the force–displacement relationship: one honest level-3 item exists (two springs on a force-against-LENGTH graph), but every second item tried — proportional against merely linear, the elastic limit, the sign of the restoring force — reads as level 2 to a strict reader; the harder work on this skill is done under lo-2 instead',
};

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

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json')).sort()) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: f.replace('.json', '') });
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
  const held = HELD_ROWS.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[]);
  const heldByLo = new Map<string, Row[]>();
  for (const r of held) heldByLo.set(r.loId, [...(heldByLo.get(r.loId) ?? []), r]);
  /** Low-level only: the objective holds figure items, and every one of them is level 1–2. */
  const lowOnly = [...heldByLo.entries()].filter(([, rs]) => Math.max(...rs.map((r) => r.difficulty)) <= 2).map(([lo]) => lo).sort();
  const lowSet = new Set(lowOnly);

  if (argv.includes('--list-objectives')) {
    const per = new Map<string, Item[]>();
    for (const a of ITEMS) per.set(a.lo, [...(per.get(a.lo) ?? []), a]);
    for (const [lo, items] of per) {
      const o = byShort.get(lo);
      console.log(`${o?.pack ?? '???'} ${lo} ${items.length} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
      for (const a of items) console.log(`      - [${a.spec.type}, ${a.need}, d${a.d}] ${a.t}`);
    }
    console.log(`${ITEMS.length} items on ${per.size} objectives; ${lowOnly.length} low-level-only objectives`);
    return;
  }

  const problems: string[] = [];
  const notes: string[] = [];
  const now = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  const proofs: Array<Record<string, unknown>> = [];
  const cards: string[] = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const perLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];


  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (!lowSet.has(obj.loId)) problems.push(`${tag}: the objective is not low-level only (it holds no figure item, or one above level 2)`);
    if (a.d < 3) problems.push(`${tag}: an item of this batch is level 3 or 4`);
    if (NOT_REACHED[a.lo]) problems.push(`${tag}: the objective has items and is also listed as not reached`);
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
      // A harder item is drawn on a NEW figure: not the spec of any released item of the objective.
      for (const r of heldByLo.get(obj.loId) ?? []) if (JSON.stringify(r.figure.spec) === JSON.stringify(a.spec)) bad(`the figure is the same as that of the released item ${r.id}`);
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
        } else {
          const stated = Number(answer);
          const places = (answer.split('.')[1] ?? '').length;
          const num = Number(v);
          const ok = Number.isFinite(num) && (near(num, stated) || (places > 0 && Math.abs(num - stated) <= 0.5 * 10 ** -places + 1e-9));
          if (!ok) bad(`stated key ${answer}, computed ${v}`);
          if (a.alts) for (const alt of a.alts[1](c)) if (!(Number.isFinite(alt) && Math.abs(alt - stated) <= 0.5 * 10 ** -places + 1e-9)) bad(`the key moves with ordinary rounding — ${a.alts[0]}: ${alt} against the stated ${answer}`);
        }
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options that answer the question, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — the options as written: ${JSON.stringify(truth)}`);
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
      for (const d of exam.defects) bad(`rule check — ${d}`);
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
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-6 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, kind: a.spec.type, format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set([...held, ...EARLIER_ROWS.filter((f) => fs.existsSync(f)).flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row[])].map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) {
    const cap = CAP_PER_OBJECTIVE;
    if (kinds.length > cap) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${cap}`);
    if (kinds.length < cap && !wip) problems.push(`${shortOf(lo)}: ${kinds.length} item(s), expected ${cap}`);
  }
  for (const short of Object.keys(NOT_REACHED)) if (!byShort.get(short) || !lowSet.has(byShort.get(short)!.loId)) problems.push(`${short}: listed as not reached but is not a low-level-only objective`);

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  /** Every low-level-only objective: what it held, what it gains, or why it gains nothing. */
  const mapping = lowOnly.map((lo) => {
    const o = objectives.get(lo)!;
    const mine = meta.filter((m) => m.lo.loId === lo);
    const before = heldByLo.get(lo) ?? [];
    const base = { loId: lo, subject: o.subject, skill: o.skill, objective: o.description, heldFigureItems: before.length, heldLevels: before.map((r) => r.difficulty).sort().join(','), heldKinds: [...new Set(before.map((r) => r.figure.spec.type))].join(', ') };
    if (mine.length) return { ...base, status: 'upgraded', newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), newKinds: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), tasks: mine.map((m) => m.item.t) };
    if (NOT_REACHED[shortOf(lo)]) return { ...base, status: 'not-reached', note: NOT_REACHED[shortOf(lo)] };
    return { ...base, status: 'not-covered', note: 'outside this batch: the cap of about 70 items went to AP Calculus AB, AP Chemistry and the Physics objectives where a graph carries the reasoning' };
  });
  const upgraded = mapping.filter((m) => m.status === 'upgraded');
  const bySubjectOf = (xs: typeof mapping): Record<string, number> => count(xs, (m) => m.subject);
  const summary = {
    generatedAt: now,
    items: rows.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `level ${m.item.d}`),
    bySubjectAndDifficulty: count(meta, (m) => `${m.lo.subject} · level ${m.item.d}`),
    asks: count(meta, (m) => m.item.need),
    lowLevelOnlyObjectives: {
      rule: 'the objective holds at least one figure item in production (release-2026-10-15/figure-rows-428.json + figure-rows-253-second.json) and every one of them has difficulty ≤ 2',
      total: lowOnly.length,
      bySubject: bySubjectOf(mapping),
      upgraded: upgraded.length,
      upgradedBySubject: bySubjectOf(upgraded),
      notReached: Object.fromEntries(mapping.filter((m) => m.status === 'not-reached').map((m) => [shortOf(m.loId), (m as { note: string }).note])),
      notCoveredBySubject: bySubjectOf(mapping.filter((m) => m.status === 'not-covered')),
    },
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, lowLevelOnlyObjectives: summary.lowLevelOnlyObjectives }, null, 1));
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
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
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch6${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'upgraded-objectives.json'), JSON.stringify(upgraded, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'low-level-only.json'), JSON.stringify({
      rule: summary.lowLevelOnlyObjectives.rule,
      sources: HELD_ROWS,
      figureRowsRead: held.length,
      objectivesWithFigureItems: heldByLo.size,
      total: lowOnly.length,
      bySubject: bySubjectOf(mapping),
      coveredBySubject: bySubjectOf(upgraded),
      objectives: mapping.map((m) => ({ loId: m.loId, pack: objectives.get(m.loId)!.pack, subject: m.subject, skill: m.skill, objective: m.objective, heldFigureItems: m.heldFigureItems, heldLevels: m.heldLevels, heldKinds: m.heldKinds, status: m.status })),
    }, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch6-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch6-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-6 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-6 figure practice items — ${rows.length} harder items for the low-level-only objectives</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

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
