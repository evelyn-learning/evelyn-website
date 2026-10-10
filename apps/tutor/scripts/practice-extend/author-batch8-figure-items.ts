/**
 * Hand-authored practice items that are read off a FIGURE — batch 8.
 *
 * Harder items (level 3, one or two level 4) for the 60 objectives whose
 * figure items are all level 1–2 after batches 6 and 7 ("low-level only now":
 * practice-figures-2026-10-17-items/low-level-only-now.json). Two items an
 * objective where two different honest tasks exist, one where only one does,
 * and none where a figure cannot carry level-3 reasoning under that
 * objective's own lesson text — those are listed, with the reason, in
 * NOT_COVERED and written into mapping.json.
 *
 * What makes an item level 3 here — at least two of: two separate readings
 * combined; a reading that must be interpreted through the objective's idea
 * before it is used; a choice between cases that the figure decides; working
 * backwards from a stated result to a feature of the figure; finding which of
 * four statements about the figure is false; comparing two curves / set-ups.
 *
 * Lessons of the independent reads of the earlier batches applied here: the
 * answer must need the figure (no formula substitution on a labelled sketch:
 * mechanics and electricity items carry their data in a graph, a table or a
 * diagram that has to be read and interpreted); the item is answerable with
 * what the objective's own lesson text teaches plus what the stem defines;
 * stem and figure agree literally; nothing that is asked for is printed, and
 * every value to be read lies on a numbered gridline or is printed; numeric
 * keys are exact or tested in code against early rounding (`alts`); hints name
 * a method, never a part of the answer; the alt text names what the figure
 * shows without giving the answer.
 *
 * Same pattern, rules and output layout as author-batch6-figure-items.ts and
 * author-batch7-figure-items.ts. Every item is data in this file. For every
 * item the script
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
 * here), the audited ids, the key proofs, the mapping (every one of the 60
 * objectives: covered, or not covered and why), a gallery page, PNGs at the
 * 340 px column (2×), contact sheets and a summary.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   MONGODB_URI="" env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch8-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
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
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-18-items`;
/** The objectives of this batch: every figure item they hold is level 1–2. */
const LOW_LEVEL_ONLY = `${INTEGRATION}/practice-figures-2026-10-17-items/low-level-only-now.json`;
/** The figure rows the objectives hold now: no figure spec and no stem of theirs may be reused, and no id. */
const HELD_ROWS = [
  `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`,
  `${INTEGRATION}/release-2026-10-15/figure-rows-253-second.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6-61.json`,
  `${INTEGRATION}/practice-figures-2026-10-17-items/final/figure-rows-batch7-88.json`,
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
  /** numeric: the key again by the routes a student may take (early rounding of an intermediate, another value of a constant, …) — every one must round to the stated key. */
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
const sum = (xs: number[]): number => xs.reduce((t, v) => t + v, 0);
const N = (v: unknown): number => { const n = typeof v === 'number' ? v : Number(String(v).replace('−', '-')); if (!Number.isFinite(n)) throw new Error(`"${String(v)}" is not a number`); return n; };
/** One test per option: the option holds when the value computed from the spec is the value the option stands for. */
const pick = <T,>(how: string, f: (c: Ctx) => T, stated: T[]): [string, Array<(c: Ctx) => boolean>] => [how, stated.map((v) => (c: Ctx) => JSON.stringify(f(c)) === JSON.stringify(v))];
/** "Which statement is FALSE?": one test per option that says whether its statement is TRUE of the figure; the option answers the question when its statement is false. */
const falseOne = (how: string, truths: Array<(c: Ctx) => boolean>): [string, Array<(c: Ctx) => boolean>] => [`${how}; an option answers the question when its statement is false`, truths.map((f) => (c: Ctx) => !f(c))];

// ── helpers for particular kinds ────────────────────────────────────────────

/** Function graphs; `pgraph` names the two axes (a graph of one physical quantity against another). */
const fgraph = (params: P): Spec => S('function_graph', { xStep: 1, yStep: 1, ...params });
const pgraph = (xLabel: string, yLabel: string, xRange: [number, number], xStep: number, yRange: [number, number], yStep: number, curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, xStep, yStep, xLabel, yLabel, curves, ...extra });
/** The i-th curve of a function graph, compiled from ITS OWN expression in the spec. */
const fOf = (c: Ctx, i = 0): ((x: number) => number) => compileExpression(arr(c.p.curves)[i].expr as string);
/** A function made of the drawn pieces i… of a function graph: zero outside their domains (a pulse on a string). */
const pulse = (c: Ctx, idx: number[]): ((x: number) => number) => (x) => { for (const i of idx) { const k = arr(c.p.curves)[i]; const d = k.domain as number[]; if (x >= d[0] - 1e-9 && x <= d[1] + 1e-9) return compileExpression(k.expr as string)(x); } return 0; };
const ptOf = (c: Ctx, label: string): { x: number; y: number } => { const p = arr(c.p.points).find((k) => k.label === label); if (!p) throw new Error(`no point ${label}`); return { x: p.x as number, y: p.y as number }; };
/** The x at which an increasing or decreasing function reaches a value, by bisection on [a, b]. */
const solve = (f: (x: number) => number, value: number, a: number, b: number): number => { let lo = a; let hi = b; const up = f(b) > f(a); if ((f(a) - value) * (f(b) - value) > 0) throw new Error(`no crossing of ${value} on [${a}, ${b}]`); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((f(m) < value) === up) lo = m; else hi = m; } return round((lo + hi) / 2, 6); };
/** Period of an oscillation that starts at a maximum: the time of its next maximum (searched on the spec's expression). */
const periodOf = (f: (x: number) => number, tMax: number): number => { const dt = tMax / 240000; for (let t = dt * 100; t <= tMax; t += dt) if (f(t) >= f(t - dt) && f(t) > f(t + dt) && near(f(t), f(0), 1e-6)) return round(t, 3); throw new Error('no second maximum'); };
/** Position–time, velocity–time and other piecewise-linear records drawn through given points. */
const mgraph = (quantity: 'position' | 'velocity', series: P[], extra: P = {}): Spec => S('motion_graph', { quantity, series, ...extra });
const ptsOf = (c: Ctx, i = 0): number[][] => arr(c.p.series)[i].points as number[][];
/** Conics on a square grid. */
const cg = (xRange: [number, number], yRange: [number, number], conics: P[], extra: P = {}): Spec => S('conic_graph', { xRange, yRange, xStep: 1, yStep: 1, conics, ...extra });
const conic = (c: Ctx, i = 0): P => arr(c.p.conics)[i];
const ctr = (k: P): number[] => (k.center ?? k.vertex) as number[];
const sq = (h: number, v: string): string => (h === 0 ? `${v}²` : `(${v} ${h > 0 ? '−' : '+'} ${Math.abs(h)})²`);
/** The text of a circle / ellipse equation in standard form, from its numbers (so an option and its test share them). */
const circleEq = (h: number, k: number, r2: number): string => `${sq(h, 'x')} + ${sq(k, 'y')} = ${r2}`;
const ellipseEq = (h: number, k: number, p: number, q: number): string => `${sq(h, 'x')}/${p} + ${sq(k, 'y')}/${q} = 1`;
const ucircle = (angles: P[], extra: P = {}): Spec => S('unit_circle', { angles, ...extra });
const tri = (params: P): Spec => S('geometric_figure', { shape: 'triangle', ...params });
const circle = (params: P): Spec => S('geometric_figure', { shape: 'circle', ...params });
const vecs = (xRange: [number, number], yRange: [number, number], vectors: P[], extra: P = {}): Spec => S('vector_diagram', { xRange, yRange, xStep: 1, yStep: 1, vectors, ...extra });
const cplane = (points: P[], extra: P = {}): Spec => S('polar_complex', { plane: 'complex', range: 6, step: 1, points, ...extra });
const zOf = (c: Ctx, label: string): { re: number; im: number } => { const p = arr(c.p.points).find((k) => k.label === label); if (!p) throw new Error(`no point ${label}`); return { re: p.re as number, im: p.im as number }; };
const table = (columns: unknown[], rows: unknown[][], extra: P = {}): Spec => S('data_table', { columns, rows, ...extra });
/** A column of a drawn table as numbers, top to bottom (0-based column). */
const tcol = (c: Ctx, j: number): number[] => (c.p.rows as unknown[][]).map((r) => N(r[j]));
const wheel = (phases: Array<[string, number, string?]>, extra: P = {}): Spec => S('cell_cycle_wheel', { phases: phases.map(([name, duration, label]) => ({ name, duration, ...(label ? { label } : {}) })), ...extra });
const strip = (rows: Array<[string, string]>, extra: P = {}): Spec => S('sequence_strip', { rows: rows.map(([name, seq]) => ({ name, seq })), ...extra });
const seqOf = (c: Ctx, i = 0): string => arr(c.p.rows)[i].seq as string;
const HB: Record<string, number> = { A: 2, T: 2, U: 2, G: 3, C: 3 };
const ladder = (params: P): Spec => S('energy_levels', { variant: 'levels', ...params });
const HC = 1240; // eV·nm
const fbd = (forces: P[], extra: P = {}): Spec => S('free_body_diagram_v2', { forces, ...extra });
const magnet = (magnets: P[], extra: P = {}): Spec => S('field_diagram', { variant: 'bar_magnet', magnets, ...extra });

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// ALGEBRA II
// ════════════════════════════════════════════════════════════════════════════

// ── Classifying Conic Sections from Equations (pack 021) ────────────────────

G('861f771f.lo-5', 'Signs of the squared terms, found from the curve', [
  {
    t: 'a coefficient of the general equation from a vertex and a marked point', d: 3, need: 'calc',
    spec: cg([-6, 6], [-6, 6], [{ type: 'hyperbola', center: [0, 0], a: 2, b: Math.sqrt(3), axis: 'y' }], { points: [{ x: 3, y: 4, label: 'P' }] }),
    alt: 'A curve in two separate branches, one opening upward and one opening downward, on a square grid, with a marked point P on the upper branch away from the axes.',
    q: 'The curve shown is the graph of Ax² + Cy² = 12, where A and C are constants. It passes through the marked point P. What is the value of A?',
    n: '-4',
    calc: ['C from the vertex (0, a) of the spec\'s hyperbola, then A from the marked point P, which is checked to lie on the hyperbola', (c) => {
      const k = conic(c); const P = ptOf(c, 'P'); const a = k.a as number; const b = k.b as number;
      if (k.axis !== 'y' || !near(P.y ** 2 / a ** 2 - P.x ** 2 / b ** 2, 1, 1e-9)) throw new Error('P is not on the hyperbola');
      const C = 12 / a ** 2;
      return round((12 - C * P.y ** 2) / P.x ** 2, 6);
    }],
    h: ['Find C first: read where the curve crosses the y-axis and put that point into the equation.', 'Then put the coordinates of P into the equation, with the value of C you found, and solve for the other constant.'],
    s: 'Read from the graph: the curve crosses the y-axis at (0, 2) and (0, −2), and P is the point (3, 4). At (0, 2): C·4 = 12, so C = 3. At P: A·9 + 3·16 = 12, so 9A = −36 and A = −4. The two squared terms have coefficients of opposite sign, as they must for a hyperbola, and the positive one belongs to y², the axis along which the branches open.',
  },
  {
    t: 'signs of both coefficients when the right-hand side is negative', d: 3, need: 'reason',
    spec: cg([-7, 7], [-6, 6], [{ type: 'hyperbola', center: [0, 0], a: 3, b: 2, axis: 'x' }]),
    alt: 'A curve in two separate branches on a square grid, with its centre at the origin; no points or lines are marked on it.',
    q: 'The curve shown is the graph of px² + qy² = r, where p, q and r are non-zero constants and r is NEGATIVE. Which statement about p and q is correct?',
    o: [
      ['p < 0 and q > 0', 'correct'],
      ['p > 0 and q < 0', 'uses the rule for an equation set equal to a positive number'],
      ['p < 0 and q < 0', 'makes both coefficients negative to match the right-hand side, which gives an ellipse'],
      ['p > 0 and q > 0', 'ignores the signs altogether: with r negative this equation has no graph'],
    ],
    holds: ['dividing by r < 0: the graph is the spec\'s hyperbola (branches along its transverse axis) exactly when the coefficient of that axis\'s squared term, divided by r, is positive and the other negative', (() => {
      const is = (sp: number, sq2: number) => (c: Ctx) => { const r = -1; const cx = sp / r; const cy = sq2 / r; return conic(c).axis === 'x' ? cx > 0 && cy < 0 : cy > 0 && cx < 0; };
      return [is(-1, 1), is(1, -1), is(-1, -1), is(1, 1)];
    })()],
    h: ['Divide the equation by r to put it in the form with 1 on the right. Dividing by a negative number changes the sign of each coefficient.', 'In that form the branches open along the axis of the squared term whose coefficient is positive. Read from the figure which axis that is.'],
    s: 'Read from the figure: the two branches open to the left and to the right, so in the form with 1 on the right-hand side the x² term is the positive one and the y² term the negative one. Dividing px² + qy² = r by r gives (p/r)x² + (q/r)y² = 1, so p/r > 0 and q/r < 0. Since r is negative, p must be negative and q positive.',
  },
]);

// ── Compound Event Probability Calculations (pack 025) ──────────────────────

G('9a3d4b75.lo-4', 'Complements used twice, and a complement run backwards', [
  {
    t: 'P(at least one) from a tree with two hidden branch probabilities', d: 3, need: 'calc',
    spec: S('probability_tree', { branches: [{ label: 'Flag', p: 0.3, children: [{ label: 'Flag', p: 0.5 }, { label: 'Clear', p: 0.5 }] }, { label: 'Clear', p: 0.7, show: 'blank', children: [{ label: 'Flag', p: 0.1 }, { label: 'Clear', p: 0.9, show: 'blank' }] }], stageTitles: ['1st check', '2nd check'] }),
    alt: 'Two stages, each splitting into the branches Flag and Clear. The probability is hidden on the first-stage Clear branch and on the Clear branch that follows it.',
    q: 'Every part made in a factory goes through two checks in turn. The tree diagram shows the probability that each check flags the part or clears it; two of the probabilities are hidden. What is the probability that a part is flagged by AT LEAST ONE of the two checks?',
    n: '0.37',
    calc: ['1 − P(Clear, then Clear), each hidden probability being 1 minus its printed neighbour on the spec\'s tree', (c) => {
      const b = arr(c.p.branches); const flag1 = b.find((k) => k.label === 'Flag')!; const clear1 = b.find((k) => k.label === 'Clear')!;
      const flag2 = arr(clear1.children).find((k) => k.label === 'Flag')!; const clear2 = arr(clear1.children).find((k) => k.label === 'Clear')!;
      const p1 = 1 - (flag1.p as number); const p2 = 1 - (flag2.p as number);
      if (!near(p1, clear1.p as number) || !near(p2, clear2.p as number) || clear1.show !== 'blank' || clear2.show !== 'blank') throw new Error('the hidden branches are not the complements');
      return round(1 - p1 * p2, 6);
    }],
    alts: ['the direct route: flagged first, or cleared first and then flagged', () => [0.3 + 0.7 * 0.1]],
    h: ['The probabilities on the branches that leave one point add up to 1; use that to fill in each hidden value.', 'The complement of "at least one flag" is a single path through the tree. Find the probability of that path and subtract it from 1.'],
    s: 'Read from the tree: the first check flags a part with probability 0.3, so it clears it with probability 1 − 0.3 = 0.7. After a clear, the second check flags with probability 0.1, so it clears with probability 0.9. The complement of "flagged at least once" is "cleared twice": 0.7 × 0.9 = 0.63. So P(at least one flag) = 1 − 0.63 = 0.37.',
  },
  {
    t: 'a hidden region found from the probability of a complement', d: 3, need: 'calc',
    spec: S('venn_diagram', { sets: ['Band', 'Choir'], regions: [{ in: ['Band'], value: 12, show: 'blank' }, { in: ['Band', 'Choir'], value: 6 }, { in: ['Choir'], value: 9 }, { in: [], value: 13 }] }),
    alt: 'Two overlapping circles, Band and Choir, inside a box. The part of the Band circle outside the overlap holds the ? box; the overlap, the rest of the Choir circle and the space outside both circles each hold a number.',
    q: 'The Venn diagram shows how the students of one class are divided between the band and the choir; one number is hidden. The probability that a student chosen at random from the class is NOT in the band is 0.55. What number belongs in the ? region?',
    n: '12',
    calc: ['class size = (students outside Band, from the printed regions) ÷ 0.55; the hidden region = class size minus the printed regions; it must be the value the spec hides', (c) => {
      const rs = arr(c.p.regions); const shown = rs.filter((r) => r.show !== 'blank'); const hidden = rs.filter((r) => r.show === 'blank');
      const notBand = sum(shown.filter((r) => !(r.in as string[]).includes('Band')).map((r) => r.value as number));
      const total = notBand / 0.55; const v = total - sum(shown.map((r) => r.value as number));
      if (hidden.length !== 1 || !near(v, hidden[0].value as number, 1e-9) || !(hidden[0].in as string[]).includes('Band')) throw new Error('the hidden region does not follow');
      return round(v, 6);
    }],
    h: ['The students who are NOT in the band are in two regions of the diagram. Add those two numbers.', 'That total is 0.55 of the whole class, so you can find the class size, and then the hidden number from it.'],
    s: 'Read from the diagram: the students not in the band are the 9 in the choir only and the 13 in neither group, 22 students. They are 0.55 of the class, so the class has 22 ÷ 0.55 = 40 students. The band then has 40 − 22 = 18 members (the complement rule: P(band) = 1 − 0.55 = 0.45, and 0.45 × 40 = 18). Of these, 6 are also in the choir, so the hidden number is 18 − 6 = 12.',
  },
]);

// ── Ellipse and Hyperbola Features (pack 046) ───────────────────────────────

G('e2ba29fa.lo-2', 'The centre read from a curve and matched with an equation', [
  {
    t: 'constants of a non-standard bracket from the centre of a drawn hyperbola', d: 3, need: 'calc',
    spec: cg([-8, 4], [-3, 9], [{ type: 'hyperbola', center: [-2, 3], a: 2, b: 3, axis: 'y', show: { asymptotes: 'mark' } }]),
    alt: 'A hyperbola with one branch opening upward and one opening downward, drawn with its two dashed asymptotes, which cross at a point that is not labelled.',
    q: 'The figure shows a hyperbola and its asymptotes (dashed). Its equation can be written as (y − n)²/4 − (2x + m)²/36 = 1. What is the value of m + n?',
    n: '7',
    calc: ['each bracket is zero at the centre (h, k) of the spec\'s hyperbola: n = k and m = −2h; the denominators 4 and 36 are checked against a² and (2b)²', (c) => {
      const k = conic(c); const [h, kk] = ctr(k);
      if (k.axis !== 'y' || (k.a as number) ** 2 !== 4 || (2 * (k.b as number)) ** 2 !== 36) throw new Error('the equation in the stem is not this hyperbola');
      return -2 * h + kk;
    }],
    h: ['The centre of a hyperbola is where its asymptotes cross. Read that point from the figure.', 'Each squared bracket is zero at the centre. Set each bracket equal to zero there, and note that the x-bracket has a 2 in front of x.'],
    s: 'Read from the figure: the asymptotes cross at (−2, 3), so that is the centre. Each squared bracket is zero at the centre: y − n = 0 at y = 3 gives n = 3, and 2x + m = 0 at x = −2 gives m = 4 (not 2, since x is multiplied by 2). So m + n = 7. Check: (2x + 4)²/36 = (x + 2)²/9, which matches the slopes ±2/3 of the asymptotes.',
  },
  {
    t: 'an unknown in a hyperbola\'s equation from the distance between two centres', d: 3, need: 'calc',
    spec: cg([-1, 9], [-6, 4], [{ type: 'ellipse', center: [4, -1], rx: 3, ry: 2 }]),
    alt: 'An ellipse on a square grid, wider than it is tall, lying to the right of the y-axis and mostly below the x-axis. Its centre is not marked.',
    q: 'The figure shows an ellipse. The hyperbola (x − 7)²/9 − (y − k)²/16 = 1 has its centre 5 units from the centre of the ellipse, and its centre lies above the x-axis. What is the value of k?',
    n: '3',
    calc: ['centre of the hyperbola (7, k) at distance 5 from the centre of the spec\'s ellipse: the one solution with k > 0', (c) => {
      const [h, k0] = ctr(conic(c)); const dy = Math.sqrt(25 - (7 - h) ** 2);
      const ks = [k0 + dy, k0 - dy].filter((k) => k > 0);
      if (ks.length !== 1) throw new Error(`${ks.length} centres above the x-axis`);
      return round(ks[0], 6);
    }],
    h: ['The centre of the ellipse is midway between its leftmost and rightmost points, and midway between its highest and lowest points.', 'Read the centre of the hyperbola from its equation, as a point with one unknown coordinate, then use the distance formula between the two centres.'],
    s: 'Read from the figure: the ellipse runs from x = 1 to x = 7 and from y = −3 to y = 1, so its centre is (4, −1). From the equation, the centre of the hyperbola is (7, k). The distance between the centres is 5: (7 − 4)² + (k + 1)² = 25, so (k + 1)² = 16 and k = 3 or k = −5. The centre is above the x-axis, so k = 3.',
  },
]);

G('e2ba29fa.lo-1', 'One sign apart: ellipse and hyperbola forms on the same numbers', [
  {
    t: 'the false statement about hyperbolas built from an ellipse\'s equation', d: 3, need: 'reason',
    spec: cg([-7, 7], [-7, 7], [{ type: 'ellipse', center: [0, 0], rx: 2, ry: 5 }]),
    alt: 'A closed oval curve on a square grid with its centre at the origin, taller than it is wide; no points are marked on it.',
    q: 'The figure shows the graph of an equation in standard form. Which statement is FALSE?',
    o: [
      ['The hyperbola y²/4 − x²/25 = 1 passes through the highest point of the curve shown', 'correct'],
      ['The curve shown is the graph of x²/4 + y²/25 = 1', 'does not match each denominator with the half-length along its own axis'],
      ['The hyperbola x²/4 − y²/25 = 1 passes through both points where the curve shown crosses the x-axis', 'thinks changing the sign moves the curve off the x-axis'],
      ['The hyperbola y²/25 − x²/4 = 1 passes through the highest and lowest points of the curve shown', 'does not see that the positive term fixes where a hyperbola meets its axis'],
    ],
    holds: falseOne('each statement tested on the spec\'s ellipse (half-lengths rx along x, ry along y): a point lies on a curve when it satisfies the equation', [
      (c) => near((conic(c).ry as number) ** 2 / 4 - 0 / 25, 1),
      (c) => (conic(c).rx as number) ** 2 === 4 && (conic(c).ry as number) ** 2 === 25,
      (c) => near((conic(c).rx as number) ** 2 / 4 - 0 / 25, 1),
      (c) => near((conic(c).ry as number) ** 2 / 25 - 0 / 4, 1),
    ]),
    h: ['Read from the figure where the curve crosses each axis; in standard form those distances, squared, are the denominators.', 'A point lies on a curve when its coordinates satisfy the equation. Test each statement by putting the point it names into the equation it names.'],
    s: 'Read from the figure: the curve crosses the x-axis at (±2, 0) and the y-axis at (0, ±5), so it is the ellipse x²/4 + y²/25 = 1. Changing the plus to a minus gives x²/4 − y²/25 = 1, which is still satisfied by (±2, 0). The hyperbola y²/25 − x²/4 = 1 is satisfied by (0, ±5), the highest and lowest points. But y²/4 − x²/25 = 1 at the highest point (0, 5) gives 25/4, not 1: that hyperbola meets the y-axis at (0, ±2). So that statement is the false one.',
  },
  {
    t: 'a hyperbola written with a negative denominator', d: 3, need: 'reason',
    spec: cg([-8, 8], [-8, 8], [{ type: 'hyperbola', center: [0, 0], a: 3, b: 4, axis: 'y', show: { box: 'mark' } }]),
    alt: 'A curve in two branches, one opening upward and one downward, with a dashed rectangle between them that the branches touch at the middle of its top and bottom sides.',
    q: 'The curve shown, drawn with its central rectangle (dashed), is the graph of x²/p + y²/q = 1 for two constants p and q. What are the values of p and q?',
    o: [
      ['p = −16 and q = 9', 'correct'],
      ['p = 16 and q = −9', 'puts the minus sign on the y² term, which would make the branches open left and right'],
      ['p = −9 and q = 16', 'gives the negative denominator to the right term but exchanges the two half-lengths'],
      ['p = 9 and q = −16', 'exchanges the half-lengths and also puts the minus sign on the wrong term'],
    ],
    holds: pick('from the spec\'s hyperbola: the positive denominator is a² under the squared term of the transverse axis, the other is −b²', (c) => { const k = conic(c); const a2 = (k.a as number) ** 2; const b2 = (k.b as number) ** 2; return k.axis === 'y' ? [-b2, a2] : [a2, -b2]; }, [[-16, 9], [16, -9], [-9, 16], [9, -16]]),
    h: ['A minus sign between the squared terms can be written as a negative denominator. Decide from the way the branches open which term is the positive one.', 'The positive denominator is the square of the distance from the centre to a vertex; the size of the other is the square of the other half-side of the rectangle.'],
    s: 'Read from the figure: the branches open up and down, with vertices at (0, 3) and (0, −3), and the rectangle reaches x = ±4. So the equation is y²/9 − x²/16 = 1. Written in the form x²/p + y²/q = 1 this is x²/(−16) + y²/9 = 1, so p = −16 and q = 9. A negative denominator under one squared term is what makes the curve a hyperbola and not an ellipse.',
  },
]);

// ── Inverse and Joint Variation Problems (pack 043) ─────────────────────────

G('dd3fd7db.lo-4', 'The constant of variation from a transformed graph and from competing models', [
  {
    t: 'two constants of inverse variation from lines plotted against 1/x', d: 3, need: 'calc',
    spec: pgraph('1/x', 'y', [0, 1], 0.25, [0, 12], 2, [{ expr: '12x', label: 'P' }, { expr: '20x', label: 'Q', dashed: true }]),
    alt: 'Two straight lines through the origin on a grid whose horizontal axis is the reciprocal of x: a solid line P and a steeper dashed line Q.',
    q: 'In each of two relationships, P and Q, y varies inversely with x. The graph shows y plotted against 1/x (not against x) for both. By how much is the constant of variation of Q greater than that of P?',
    n: '8',
    calc: ['slope of line Q minus slope of line P (curve_slope between grid points): against 1/x the slope is the constant k', (c) => round(c.num('curve_slope', { curve: 1, x1: 0, x2: 0.5 }) - c.num('curve_slope', { curve: 0, x1: 0, x2: 0.5 }), 6)],
    h: ['If y = k/x, then y = k × (1/x): against 1/x the graph is a straight line through the origin.', 'The constant of variation is the slope of each line. Read one grid point on each line and divide y by 1/x.'],
    s: 'Since y = k/x = k·(1/x), each line has slope k. Read from the graph: line P passes through (0.5, 6), so k = 6 ÷ 0.5 = 12; line Q passes through (0.5, 10), so k = 10 ÷ 0.5 = 20. The constant of Q is greater by 20 − 12 = 8.',
  },
  {
    t: 'the one variation equation whose constant is the same in every row', d: 3, need: 'reason',
    spec: table(['x', 'z', 'y'], [[2, 1, 12], [4, 2, 12], [3, 3, 6], [6, 2, 18]]),
    alt: 'A table of four rows giving values of x, z and y, with no cell left out.',
    q: 'In the table, y is related to x and z by one of the four equations below, with the same constant of variation in every row. Which equation fits every row of the table?',
    o: [
      ['y = 6x/z', 'correct'],
      ['y = 6xz', 'takes the variation to be joint in x and z: it fits only the first row'],
      ['y = 3x²/z', 'fits the first row by squaring x, without testing the others'],
      ['y = 6x/z²', 'fits the first row, where z = 1 hides the power of z'],
    ],
    holds: ['each equation evaluated on every row of the spec\'s table: it answers the question when it gives the printed y in all of them', (() => {
      const fits = (f: (x: number, z: number) => number) => (c: Ctx) => (c.p.rows as number[][]).every(([x, z, y]) => near(f(x, z), y));
      return [fits((x, z) => 6 * x / z), fits((x, z) => 6 * x * z), fits((x, z) => 3 * x * x / z), fits((x, z) => 6 * x / (z * z))];
    })()],
    h: ['For each equation, work out the constant from the first row, then see whether the same constant gives the y of the other rows.', 'A row in which z = 1 cannot tell you how y depends on z; use the rows where z is not 1 to decide that.'],
    s: 'Read from the table: (x, z, y) = (2, 1, 12), (4, 2, 12), (3, 3, 6) and (6, 2, 18). Every equation fits the first row, so test the others. For y = kx/z: k = yz/x = 12·1/2 = 6, 12·2/4 = 6, 6·3/3 = 6 and 18·2/6 = 6, the same constant every time. The other forms fail on the second row: 6xz gives 48, 3x²/z gives 24 and 6x/z² gives 6, not 12. So y = 6x/z.',
  },
]);

// ── Parabola Equations from Focus and Directrix (pack 031) ──────────────────

G('bb35e95e.lo-3', 'The vertex as a midpoint, used backwards and repeatedly', [
  {
    t: 'vertex of a second parabola that shares a directrix found from the first', d: 3, need: 'calc',
    spec: S('scatter_plot', { points: [{ x: 2, y: 5, label: 'F' }, { x: 2, y: 3, label: 'V' }, { x: 6, y: 7, label: 'G' }], xRange: [0, 8], yRange: [0, 8], xStep: 1, yStep: 1, xLabel: 'x', yLabel: 'y' }),
    alt: 'Three labelled points on a square grid: V directly below F, and G higher than both and further across.',
    q: 'On the grid shown, F is the focus and V is the vertex of one parabola. A second parabola has the same directrix as the first, and its focus is the point G. What is the y-coordinate of the vertex of the second parabola?',
    n: '4',
    calc: ['directrix y = 2·V.y − F.y (V is midway between F and the directrix; F and V share an x); the second vertex is midway between G and that line', (c) => {
      const F = ptOf(c, 'F'); const V = ptOf(c, 'V'); const Gp = ptOf(c, 'G');
      if (F.x !== V.x) throw new Error('F and V are not on one vertical line');
      const d = 2 * V.y - F.y;
      return (Gp.y + d) / 2;
    }],
    h: ['The vertex is midway between the focus and the directrix. Use F and V to find the directrix of the first parabola.', 'The second parabola has the same directrix. Its vertex is midway between that line and G.'],
    s: 'Read from the grid: F is (2, 5) and V is (2, 3), so the focus is 2 units above the vertex and the directrix is 2 units below it: the line y = 1. The second parabola has focus G(6, 7) and the same directrix, y = 1. Its vertex is midway between them, at y = (7 + 1)/2 = 4 (the vertex is the point (6, 4)).',
  },
  {
    t: 'vertex after the focus is twice replaced by the previous vertex', d: 3, need: 'calc',
    spec: cg([-6, 10], [-4, 8], [{ type: 'parabola', vertex: [2, 2], p: 4, axis: 'y', show: { focus: 'mark', directrix: 'mark' } }]),
    alt: 'A parabola opening upward with its focus F marked on its axis of symmetry and a dashed horizontal directrix below it.',
    q: 'The figure shows parabola 1 with its focus F and its directrix (the dashed line). Parabola 2 has the same directrix, and its focus is the vertex of parabola 1. Parabola 3 has the same directrix, and its focus is the vertex of parabola 2. What is the y-coordinate of the vertex of parabola 3?',
    n: '-1',
    calc: ['from the spec\'s parabola: directrix y = k − p; each new vertex is midway between the previous vertex and the directrix, twice', (c) => {
      const k = conic(c); const d = (k.vertex as number[])[1] - (k.p as number);
      const v1 = (k.vertex as number[])[1]; const v2 = (v1 + d) / 2; return (v2 + d) / 2;
    }],
    h: ['The vertex of a parabola is midway between its focus and its directrix. Find the vertex of parabola 1 that way, or read it from the figure.', 'Repeat the midpoint step twice more, each time between the new focus and the same dashed line.'],
    s: 'Read from the figure: F is (2, 6) and the directrix is y = −2, so the vertex of parabola 1 is midway between them, at y = 2 (as drawn). Parabola 2 has its focus at y = 2 and the same directrix, so its vertex is at y = (2 + (−2))/2 = 0. Parabola 3 has its focus at y = 0, so its vertex is at y = (0 + (−2))/2 = −1.',
  },
]);

G('bb35e95e.lo-1', 'The equal-distance test, on several points and backwards', [
  {
    t: 'how many of four marked points satisfy the equal-distance property', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-5, 7], yRange: [-3, 5], curves: [{ expr: '-1', dashed: true, label: 'directrix' }], points: [{ x: 1, y: 3, label: 'F' }, { x: 5, y: 3, label: 'W' }, { x: 1, y: 1, label: 'X' }, { x: 4, y: 2, label: 'Y' }, { x: -2, y: 3, label: 'Z' }] }),
    alt: 'A dashed horizontal line below the x-axis and five labelled points above it: F, and four others at different distances from F and from the line.',
    q: 'The grid shows the focus F and the directrix (the dashed line) of a parabola, together with four other points, W, X, Y and Z. The parabola itself is not drawn. How many of the four points lie on the parabola?',
    n: '2',
    calc: ['count of the lettered points of the spec whose distance to F equals their distance to the drawn line', (c) => {
      const F = ptOf(c, 'F'); const d = fOf(c)(0);
      return ['W', 'X', 'Y', 'Z'].map((l) => ptOf(c, l)).filter((p) => near(Math.hypot(p.x - F.x, p.y - F.y), Math.abs(p.y - d))).length;
    }],
    h: ['A point is on the parabola exactly when its distance from the focus equals its distance from the directrix.', 'For each lettered point, find the distance to F (use the Pythagorean theorem when the point is neither level with F nor directly below it) and the vertical distance to the dashed line.'],
    s: 'Read from the grid: F is (1, 3) and the directrix is y = −1. W(5, 3): 4 from F and 4 from the line, so it is on the parabola. X(1, 1): 2 from F and 2 from the line, on the parabola (it is the vertex). Y(4, 2): √(3² + 1²) = √10 ≈ 3.16 from F but 3 from the line, not on it. Z(−2, 3): 3 from F but 4 from the line, not on it. Two of the points lie on the parabola.',
  },
  {
    t: 'the directrix recovered from the focus and one point of the parabola', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-2, 8], yRange: [-3, 6], curves: [], points: [{ x: 2, y: 1, label: 'F' }, { x: 6, y: 4, label: 'P' }] }),
    alt: 'Two labelled points on a square grid: F, and P above it and further across. Nothing else is drawn.',
    q: 'The point P shown lies on a parabola whose focus is the point F. Neither the parabola nor its directrix is drawn; the directrix runs parallel to the x-axis and lies below P, so it has an equation of the form y = k. What is the value of k?',
    n: '-1',
    calc: ['k = P.y − |PF|: P is as far from the directrix (below it) as it is from F', (c) => { const F = ptOf(c, 'F'); const P = ptOf(c, 'P'); return round(P.y - Math.hypot(P.x - F.x, P.y - F.y), 6); }],
    h: ['Every point of a parabola is as far from the directrix as it is from the focus. Find the distance from P to F with the Pythagorean theorem.', 'The directrix runs parallel to the x-axis and below P, so it lies that same distance straight down from P.'],
    s: 'Read from the grid: F is (2, 1) and P is (6, 4). The distance PF is √((6 − 2)² + (4 − 1)²) = √25 = 5. P is on the parabola, so it is also 5 units from the directrix. The directrix is horizontal and below P, so it is the line y = 4 − 5 = −1, and k = −1.',
  },
]);

// ── Pythagorean Identity Applications (pack 049) ────────────────────────────

G('f2322089.lo-3', 'Signs in a quadrant that has to be worked out first', [
  {
    t: 'the false sign statement about three angles built from θ', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 130, label: 'none', labelText: 'θ', arc: true }]),
    alt: 'One angle θ in standard position, marked by an arc from the positive x-axis; its terminal side lies in the upper left quarter of the circle. No coordinates are printed.',
    q: 'The angle θ is drawn in standard position on the unit circle shown. Which statement is FALSE?',
    o: [
      ['cos(θ + 180°) is negative', 'correct'],
      ['sin(θ + 180°) is negative', 'turns the angle through 180° but keeps the signs of the original quadrant'],
      ['cos(−θ) is negative', 'takes −θ to lie in the fourth quadrant, where cosine is positive'],
      ['sin(180° − θ) is positive', 'takes 180° − θ to lie in a quadrant where sine is negative'],
    ],
    holds: falseOne('each statement evaluated at the spec\'s angle and at every whole-degree angle of the same quadrant (the figure fixes the quadrant only)', (() => {
      const all = (f: (t: number) => boolean) => (c: Ctx) => { const t0 = arr(c.p.angles)[0].degrees as number; const q = Math.floor(t0 / 90); const ts = [t0]; for (let t = q * 90 + 1; t < q * 90 + 90; t++) ts.push(t); const v = ts.map(f); if (new Set(v).size !== 1) throw new Error('the statement is not settled by the quadrant'); return v[0]; };
      return [all((t) => Math.cos(rad(t + 180)) < 0), all((t) => Math.sin(rad(t + 180)) < 0), all((t) => Math.cos(rad(-t)) < 0), all((t) => Math.sin(rad(180 - t)) > 0)];
    })()),
    h: ['Find the quadrant of θ from the figure. Then find the quadrant of each new angle: adding 180° turns the terminal side half-way round; −θ is the mirror image of θ in the x-axis.', 'In each quadrant, cosine has the sign of x and sine has the sign of y. Check the four statements one at a time.'],
    s: 'Read from the figure: θ is in Quadrant II. θ + 180° is then in Quadrant IV, where cosine is positive and sine is negative: so "sin(θ + 180°) is negative" is true and "cos(θ + 180°) is negative" is false. −θ is in Quadrant III, where cosine is negative (true). 180° − θ is in Quadrant I, where sine is positive (true). The false statement is the one about cos(θ + 180°).',
  },
  {
    t: 'sine of an undrawn angle fixed by the cosine and the tangent sign of the drawn one', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 323.13, label: 'none', labelText: 'θ', arc: true }]),
    alt: 'One angle θ in standard position, marked by an arc that sweeps most of the way round the circle to a terminal side in the lower right quarter. No coordinates are printed.',
    q: 'For the angle θ drawn on the unit circle shown, sin²θ = 0.36. A second angle φ, which is not drawn, has the same cosine as θ, but tan φ and tan θ have opposite signs. What is the value of sin φ?',
    n: '0.6',
    calc: ['signs of cos θ and tan θ from the spec\'s angle; φ has cos of the same sign and tan of the opposite sign, so sin φ = sign(cos φ)·sign(tan φ)·√0.36', (c) => {
      const t = rad(arr(c.p.angles)[0].degrees as number);
      if (!near(Math.sin(t) ** 2, 0.36, 1e-4)) throw new Error('sin² of the drawn angle is not 0.36');
      const cosSign = Math.sign(Math.cos(t)); const tanPhi = -Math.sign(Math.tan(t));
      return round(cosSign * tanPhi * Math.sqrt(0.36), 6);
    }],
    h: ['Read the quadrant of θ from the figure and write down the signs of sin θ, cos θ and tan θ there.', 'φ has a cosine of the same sign and a tangent of the opposite sign: decide which quadrant that is, and so the sign of sin φ. Its size follows from sin²φ + cos²φ = 1.'],
    s: 'Read from the figure: θ is in Quadrant IV, where cos θ > 0, sin θ < 0 and so tan θ < 0. φ has the same (positive) cosine and a tangent of the opposite sign (positive), so φ is in Quadrant I and sin φ > 0. Since cos φ = cos θ, cos²φ = 1 − 0.36 = 0.64, so sin²φ = 0.36 and sin φ = +0.6.',
  },
]);

// ── Right-Triangle Trigonometric Ratios (pack 022) ──────────────────────────

G('869a59a5.lo-4', 'A missing side when the right triangle has to be made first', [
  {
    t: 'base of an isosceles triangle from its equal sides and apex angle', d: 3, need: 'calc',
    spec: tri({ sides: [12, 12, 24 * Math.sin(rad(20))], sideLabels: ['auto', null, 'x'], angleLabels: [null, null, 'auto'], ticks: [1, 1, 0], unit: 'cm' }),
    alt: 'An isosceles triangle standing on its base, with tick marks on the two slanting sides, one of which carries a length, the angle between them given at the top, and the base labelled x.',
    q: 'The triangle shown is isosceles: the two sides marked with ticks are equal. What is the length x of its base, to the nearest tenth of a centimetre?',
    n: '8.2',
    calc: ['geo_side for the base of the spec\'s triangle', (c) => c.num('geo_side', { side: 2 })],
    alts: ['sin 20° rounded to 0.342 or 0.34, or the half-base rounded to 4.1 before doubling', () => [24 * 0.342, 24 * 0.34, 2 * 4.1]],
    h: ['The triangle has no right angle, so make one: the line from the top vertex to the middle of the base splits it into two equal right triangles.', 'In one of those right triangles you know the hypotenuse and the angle at the top, which is half of the angle shown. Find half of the base, then double it.'],
    s: 'Read from the figure: the equal sides are 12 cm and the angle between them is 40°. The altitude from the top vertex bisects that angle and the base, giving two right triangles with hypotenuse 12 cm and an angle of 20° at the top. The side opposite the 20° angle is half the base: 12 × sin 20° ≈ 12 × 0.342 = 4.10 cm. So x ≈ 2 × 4.10 = 8.2 cm.',
  },
  {
    t: 'a side found through an altitude shared by two right triangles', d: 3, need: 'calc',
    spec: tri({ asa: [30, 20 * Math.cos(rad(30)) + (10 / Math.sin(rad(40))) * Math.cos(rad(40)), 40], sideLabels: ['x', 'auto', null], angleLabels: ['auto', 'auto', null], altitude: { from: 2 }, unit: 'cm' }),
    alt: 'A triangle on a horizontal base with a dashed altitude from the top vertex. The left-hand side carries a length, both base angles are given, and the right-hand side is labelled x.',
    q: 'In the triangle shown, the dashed line is perpendicular to the base. What is the length x, to the nearest tenth of a centimetre?',
    n: '15.6',
    calc: ['geo_side for the right-hand side of the spec\'s triangle', (c) => c.num('geo_side', { side: 0 })],
    alts: ['sin 40° rounded to 0.6428, 0.643 or 0.64', () => [10 / 0.6428, 10 / 0.643, 10 / 0.64]],
    h: ['The dashed line makes two right triangles that share it. Find its length from the left-hand triangle, where you know the hypotenuse and an angle.', 'In the right-hand triangle the dashed line is opposite the given angle and x is the hypotenuse. Write the ratio that joins them and solve for x.'],
    s: 'Read from the figure: the left side is 20 cm, and the base angles are 30° and 40°. In the left-hand right triangle the dashed line is opposite the 30° angle: its length is 20 × sin 30° = 10 cm. In the right-hand right triangle the same line is opposite the 40° angle and x is the hypotenuse: sin 40° = 10/x, so x = 10 ÷ sin 40° ≈ 10 ÷ 0.643 = 15.6 cm.',
  },
]);

G('869a59a5.lo-3', 'An angle that needs two right triangles', [
  {
    t: 'apex angle of an isosceles triangle from its three sides', d: 3, need: 'calc',
    spec: tri({ sides: [7, 7, 10], sideLabels: ['auto', null, 'auto'], angleLabels: [null, null, 'θ'], ticks: [1, 1, 0], unit: 'cm' }),
    alt: 'An isosceles triangle standing on its base, with tick marks on the two equal slanting sides; one slanting side and the base carry lengths, and the angle at the top is labelled θ.',
    q: 'The triangle shown is isosceles. What is the measure of the angle θ at its top vertex, to the nearest tenth of a degree?',
    n: '91.2',
    calc: ['geo_angle at the top vertex of the spec\'s triangle', (c) => c.num('geo_angle', { vertex: 2 })],
    alts: ['the half-angle rounded to 45.6° or 45.58° before doubling, or by way of a base angle of 44.4° or 44.42°', () => [2 * 45.6, 2 * 45.58, 180 - 2 * 44.4, 180 - 2 * 44.42]],
    h: ['Draw the line from the top vertex to the middle of the base. It makes two equal right triangles and cuts θ in half.', 'In one right triangle you know the hypotenuse and the side opposite the half-angle. Use the inverse of the ratio that joins those two sides, then double.'],
    s: 'Read from the figure: the equal sides are 7 cm and the base is 10 cm. The altitude from the top vertex cuts the base into two 5 cm parts and θ into two equal angles. In one right triangle the half-angle has opposite side 5 and hypotenuse 7, so it is sin⁻¹(5/7) ≈ 45.58°. Then θ ≈ 2 × 45.58° = 91.2°.',
  },
  {
    t: 'angle between two arrows from the grid triangles under them', d: 3, need: 'calc',
    spec: vecs([-1, 9], [-1, 7], [{ tail: [0, 0], head: [8, 2], label: 'P' }, { tail: [0, 0], head: [4, 6], label: 'Q' }]),
    alt: 'Two arrows from the origin into the first quadrant of a numbered grid: a shallow one labelled P and a steeper one labelled Q, each ending on a grid crossing.',
    q: 'Two arrows, P and Q, are drawn from the origin on the grid shown. What is the angle between the two arrows, to the nearest tenth of a degree?',
    n: '42.3',
    calc: ['vec_direction of the steeper arrow minus vec_direction of the shallower one', (c) => round(c.num('vec_direction', { vector: 1 }) - c.num('vec_direction', { vector: 0 }), 4)],
    alts: ['each angle rounded to one or two decimal places before subtracting', () => [56.3 - 14.0, 56.31 - 14.04]],
    h: ['For each arrow, build a right triangle on the grid with its legs along the gridlines, and find the angle the arrow makes with the x-axis using an inverse trigonometric ratio.', 'The angle between the arrows is the difference of those two angles.'],
    s: 'Read from the grid: arrow P ends 8 across and 2 up, so it makes an angle tan⁻¹(2/8) ≈ 14.04° with the x-axis; arrow Q ends 4 across and 6 up, so it makes tan⁻¹(6/4) ≈ 56.31°. The angle between the arrows is 56.31° − 14.04° ≈ 42.3°.',
  },
]);

// ── Trigonometric Functions Unit Circle (pack 011) ──────────────────────────

G('4ddfd4c0.lo-3', 'Tangents compared, and the tangent at the opposite point', [
  {
    t: 'the greatest tangent among four points with printed coordinates', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 30, label: 'none', name: 'W', coords: 'show' }, { degrees: 120, label: 'none', name: 'X', coords: 'show' }, { degrees: 225, label: 'none', name: 'Y', coords: 'show' }, { degrees: 300, label: 'none', name: 'Z', coords: 'show' }]),
    alt: 'Four radius lines to four points of the circle, one in each quadrant, each point printed with its name and its exact coordinates.',
    q: 'The unit circle shown gives the coordinates of four points, W, X, Y and Z, each the point where the terminal side of an angle in standard position meets the circle. For which point does the angle have the greatest tangent?',
    o: [
      ['Y', 'correct'],
      ['W', 'takes the first-quadrant angle to have the greatest value of every ratio, or divides x by y'],
      ['X', 'picks the point with the greatest y-coordinate, which is the greatest sine'],
      ['Z', 'compares the sizes of the quotients and ignores their signs'],
    ],
    holds: pick('y ÷ x at each of the spec\'s four angles: the name of the point with the greatest value', (c) => { const a = arr(c.p.angles).map((k) => ({ name: k.name as string, tan: Math.tan(rad(k.degrees as number)) })); const top = a.reduce((m, k) => (k.tan > m.tan ? k : m)); if (a.filter((k) => near(k.tan, top.tan, 1e-9)).length !== 1) throw new Error('a tie'); return top.name; }, ['Y', 'W', 'X', 'Z']),
    h: ['The tangent of each angle is the y-coordinate of its point divided by the x-coordinate.', 'Work out all four values with their signs before you compare them: a quotient of two negative numbers is positive.'],
    s: 'tan θ = sin θ / cos θ = y/x. Read from the figure: W(√3/2, 1/2) gives tan = (1/2)/(√3/2) = √3/3 ≈ 0.58; X(−1/2, √3/2) gives −√3 ≈ −1.73; Y(−√2/2, −√2/2) gives 1; Z(1/2, −√3/2) gives −√3 ≈ −1.73. The greatest of these is 1, at Y: in the third quadrant both coordinates are negative, so the tangent is positive.',
  },
  {
    t: 'tangent of the angle whose terminal side continues a given one through the origin', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 150, label: 'none', labelText: 'α', coords: 'show', arc: true }, { degrees: 330, label: 'none', labelText: 'β', arc: true }]),
    alt: 'Two angles marked by arcs from the positive x-axis: α, with its terminal side in the upper left quarter and the coordinates of its point printed, and β, whose terminal side continues that line through the origin into the lower right quarter, with no coordinates.',
    q: 'On the unit circle shown, the terminal sides of the angles α and β lie along one line through the origin. The coordinates of the point for α are given. What is the exact value of tan β?',
    o: [
      ['−√3/3', 'correct'],
      ['√3/3', 'thinks the opposite point has a tangent of the opposite sign'],
      ['−√3', 'divides x by y'],
      ['√3', 'divides x by y and also changes the sign'],
    ],
    holds: ['uc_trig_value (tan) at the second angle of the spec, which must be the first angle plus 180°: the option holds when it is that exact value', (() => {
      const is = (v: string) => (c: Ctx) => { const a = arr(c.p.angles); if (!near(((a[1].degrees as number) - (a[0].degrees as number) + 360) % 360, 180)) throw new Error('the terminal sides are not one line'); return canonText(c.txt('uc_trig_value', { angle: 1, fn: 'tan' })) === canonText(v); };
      return [is('−√3/3'), is('√3/3'), is('−√3'), is('√3')];
    })()],
    h: ['The point for β is directly opposite the point for α: both of its coordinates have the opposite sign.', 'tan β is the y-coordinate of that point divided by its x-coordinate. See what happens to the quotient when both signs change.'],
    s: 'Read from the figure: the point for α is (−√3/2, 1/2). The terminal side of β is the same line continued through the origin, so its point is (√3/2, −1/2). Then tan β = sin β / cos β = (−1/2) ÷ (√3/2) = −1/√3 = −√3/3. Changing the sign of both coordinates leaves the quotient unchanged, so tan β = tan α.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PRECALCULUS
// ════════════════════════════════════════════════════════════════════════════

// ── Arithmetic and Geometric Sequence Formulas (pack 274) ───────────────────

G('457d35da.lo-5', 'The ratio test applied to every pair, and to terms that must first be recovered', [
  {
    t: 'which of three tabulated sequences are geometric', d: 3, need: 'reason',
    spec: table(['n', 'aₙ', 'bₙ', 'cₙ'], [[1, 2, 3, 80], [2, 6, 6, -40], [3, 18, 12, 20], [4, 54, 21, -10]]),
    alt: 'A table of four rows: the term number n and the matching terms of three sequences named a, b and c.',
    q: 'The table gives the first four terms of three sequences, a, b and c. Which of the sequences are geometric?',
    o: [
      ['a and c only', 'correct'],
      ['a only', 'rejects a sequence whose terms alternate in sign'],
      ['a and b only', 'tests only the first two ratios of b, and rejects c for its changing signs'],
      ['a, b and c', 'tests only the first ratio or two of each sequence'],
    ],
    holds: pick('for each sequence column of the spec\'s table: geometric when every term divided by the one before gives the same quotient', (c) => ['a', 'b', 'c'].filter((_, j) => { const v = tcol(c, j + 1); return v.slice(1).every((x, i) => near(x / v[i], v[1] / v[0])); }), [['a', 'c'], ['a'], ['a', 'b'], ['a', 'b', 'c']]),
    h: ['A sequence is geometric when dividing each term by the one before it always gives the same number. Check every pair of neighbours, not just the first.', 'The common ratio may be negative or a fraction; neither stops a sequence from being geometric.'],
    s: 'Read from the table and divide each term by the one before it. Sequence a: 6/2 = 3, 18/6 = 3, 54/18 = 3, a constant ratio, so it is geometric. Sequence b: 6/3 = 2, 12/6 = 2, but 21/12 = 1.75, so it is not. Sequence c: −40/80 = −1/2, 20/(−40) = −1/2, −10/20 = −1/2, a constant ratio, so it is geometric with r = −1/2. The geometric sequences are a and c only.',
  },
  {
    t: 'whether a sequence is geometric, from a table of its partial sums', d: 3, need: 'reason',
    spec: table(['n', 'Sₙ'], [[1, 3], [2, 9], [3, 21], [4, 45]]),
    alt: 'A table of four rows giving n and the running total Sₙ of the first n terms of a sequence.',
    q: 'For a certain sequence, the table gives Sₙ, the SUM of its first n terms. Is the sequence itself geometric, and if so what is its common ratio?',
    o: [
      ['Yes; the common ratio is 2', 'correct'],
      ['Yes; the common ratio is 3', 'divides the second sum by the first'],
      ['No; its ratios are 3, 2.33 and 2.14', 'tests the sums themselves instead of the terms'],
      ['No; its terms go up by 6, 12 and 24', 'takes the differences of the sums to be the differences between terms'],
    ],
    holds: ['terms recovered from the spec\'s sums (first sum, then differences) and tested for a constant quotient', (() => {
      const terms = (c: Ctx) => { const s = tcol(c, 1); return s.map((v, i) => (i ? v - s[i - 1] : v)); };
      const ratio = (c: Ctx): number | null => { const t = terms(c); return t.slice(1).every((x, i) => near(x / t[i], t[1] / t[0])) ? t[1] / t[0] : null; };
      return [(c: Ctx) => ratio(c) === 2, (c: Ctx) => ratio(c) === 3, (c: Ctx) => ratio(c) === null, (c: Ctx) => ratio(c) === null];
    })()],
    h: ['Recover the terms first: each term is the difference between one sum and the sum before it, and the first term is S₁.', 'Then divide each term by the term before it and see whether the quotient is always the same.'],
    s: 'Read from the table: S₁ = 3, S₂ = 9, S₃ = 21, S₄ = 45. The terms are a₁ = 3, a₂ = 9 − 3 = 6, a₃ = 21 − 9 = 12 and a₄ = 45 − 21 = 24. Their ratios are 6/3 = 2, 12/6 = 2 and 24/12 = 2, so the sequence is geometric with common ratio 2. (The sums themselves do not have a constant ratio, but that is not what was asked.)',
  },
]);

// ── Circle and parabola equations (pack 302) ────────────────────────────────

G('d47cd4cb.lo-1', 'Centre and radius moved between a drawing and an equation', [
  {
    t: 'equation of the concentric circle through a marked point', d: 3, need: 'calc',
    spec: cg([-4, 8], [-5, 7], [{ type: 'circle', center: [2, 1], radius: 3 }], { points: [{ x: 5, y: 5, label: 'P' }] }),
    alt: 'A circle on a square grid with a marked point P outside it, above it and further across. The centre of the circle is not marked.',
    q: 'A second circle has the same centre as the circle shown and passes through the marked point P. Which equation describes the second circle?',
    o: [
      [circleEq(2, 1, 25), 'correct'],
      [circleEq(2, 1, 5), 'writes the radius on the right-hand side without squaring it'],
      [circleEq(-2, -1, 25), 'takes the signs in the brackets to be those of the centre'],
      [circleEq(2, 1, 9), 'gives the equation of the circle that is drawn'],
    ],
    holds: pick('centre of the spec\'s circle and the square of its distance to P, against the centre and right-hand side each option is built from', (c) => { const [h, k] = ctr(conic(c)); const P = ptOf(c, 'P'); return [h, k, (P.x - h) ** 2 + (P.y - k) ** 2]; }, [[2, 1, 25], [2, 1, 5], [-2, -1, 25], [2, 1, 9]]),
    h: ['The centre of the circle is midway between its leftmost and rightmost points and midway between its highest and lowest points.', 'The radius of the second circle is the distance from that centre to P; the right-hand side of the equation is the SQUARE of the radius.'],
    s: 'Read from the figure: the circle runs from x = −1 to x = 5 and from y = −2 to y = 4, so its centre is (2, 1). P is the point (5, 5). The radius of the second circle is the distance from (2, 1) to (5, 5): √(3² + 4²) = 5, so r² = 25. With centre (h, k) = (2, 1) the equation is (x − 2)² + (y − 1)² = 25.',
  },
  {
    t: 'the false statement comparing a drawn circle with one given by its equation', d: 3, need: 'reason',
    spec: cg([-6, 6], [-4, 7], [{ type: 'circle', center: [-1, 2], radius: 3 }]),
    alt: 'A circle on a square grid, lying mostly above the x-axis and to the left of the y-axis. Its centre is not marked, and no second circle is drawn.',
    q: 'A second circle, not drawn, has equation (x − 3)² + (y + 1)² = 1. Which statement about it and the circle shown is FALSE?',
    o: [
      ['The centre of the second circle lies inside the circle shown', 'correct'],
      ['The second circle has the smaller radius', 'compares the right-hand side of the equation with the diameter of the circle shown'],
      ['The centres of the two circles are 5 units apart', 'misreads a sign in a bracket and gets a different centre'],
      ['The two circles have no point in common', 'does not compare the distance between the centres with the two radii'],
    ],
    holds: falseOne('centre (3, −1) and radius 1 of the stem\'s circle against the centre and radius of the spec\'s circle', (() => {
      const g = (c: Ctx) => { const k = conic(c); const [h, kk] = ctr(k); return { R: k.radius as number, d: Math.hypot(3 - h, -1 - kk), r: 1 }; };
      return [(c: Ctx) => g(c).d < g(c).R, (c: Ctx) => g(c).r < g(c).R, (c: Ctx) => near(g(c).d, 5), (c: Ctx) => g(c).d > g(c).R + g(c).r];
    })()),
    h: ['Read the centre and the radius of the second circle from its equation; mind the signs in the brackets and take the square root of the right-hand side.', 'Find the centre and radius of the circle shown from the figure, then the distance between the two centres, and compare it with the radii.'],
    s: 'Read from the figure: the circle shown has centre (−1, 2) and radius 3. From its equation the second circle has centre (3, −1) and radius 1. The centres are √(4² + 3²) = 5 units apart. That is more than the radius 3, so the second centre is OUTSIDE the circle shown: the statement that it lies inside is false. It is also more than 3 + 1 = 4, so the circles have no point in common, and 1 < 3, so the second circle is the smaller.',
  },
]);

G('d47cd4cb.lo-3', 'The focus–directrix property read on a drawn parabola and used to locate points', [
  {
    t: 'the false statement about distances to the focus and the directrix', d: 3, need: 'reason',
    spec: cg([-10, 10], [-4, 8], [{ type: 'parabola', vertex: [0, -1], p: 2, axis: 'y', show: { focus: 'mark', directrix: 'mark' } }], { points: [{ x: 8, y: 7, label: 'P' }] }),
    alt: 'A parabola opening upward, with its focus F marked inside it, a dashed horizontal directrix below it, and a point P marked high on its right-hand arm.',
    q: 'The figure shows a parabola with its focus F, its directrix (the dashed line) and a point P on the parabola. Which statement is FALSE?',
    o: [
      ['The point of the parabola nearest to the directrix is 4 units from it', 'correct'],
      ['P is 10 units from the directrix', 'does not measure the distance straight down to the dashed line'],
      ['P is 10 units from F', 'does not use the Pythagorean theorem for the slanting distance'],
      ['No point of the parabola is less than 2 units from F', 'takes some point of the curve to be nearer to F than the vertex is'],
    ],
    holds: falseOne('from the spec\'s parabola (vertex, p) and the marked point P, which is checked to lie on it', (() => {
      const g = (c: Ctx) => { const k = conic(c); const [h, kk] = k.vertex as number[]; const p = k.p as number; const P = ptOf(c, 'P'); if (!near((P.x - h) ** 2, 4 * p * (P.y - kk))) throw new Error('P is not on the parabola'); return { p, toDir: P.y - (kk - p), toF: Math.hypot(P.x - h, P.y - (kk + p)) }; };
      return [(c: Ctx) => near(g(c).p, 4), (c: Ctx) => near(g(c).toDir, 10), (c: Ctx) => near(g(c).toF, 10), (c: Ctx) => g(c).p >= 2];
    })()),
    h: ['For every point of a parabola, the distance to the focus equals the distance to the directrix. Read both distances for P to see this at work.', 'The vertex is the point of the parabola nearest to the directrix, and it is midway between the focus and the directrix.'],
    s: 'Read from the figure: F is (0, 1), the directrix is y = −3 and P is (8, 7). P is 7 − (−3) = 10 units from the directrix and √(8² + 6²) = 10 units from F, as the definition requires. The vertex (0, −1) is midway between F and the directrix, 2 units from each; it is the nearest point of the parabola to both, so no point is less than 2 units from F. The statement that the nearest point is 4 units from the directrix is false: 4 is the distance from F to the directrix.',
  },
  {
    t: 'the two points of an undrawn parabola level with its focus', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-4, 8], yRange: [-5, 6], curves: [{ expr: '-3', dashed: true, label: 'directrix' }], points: [{ x: 2, y: 1, label: 'F' }] }),
    alt: 'A dashed line parallel to the x-axis and below it, and one labelled point F above the x-axis. No curve is drawn.',
    q: 'The grid shows the focus F and the directrix (the dashed line) of a parabola that is not drawn. Exactly two points of the parabola are at the same height as F. How far apart are these two points?',
    n: '8',
    calc: ['a point level with F is (F.y − directrix) from the directrix, so it must be that far from F along the level: twice that distance separates the two', (c) => { const F = ptOf(c, 'F'); return round(2 * (F.y - fOf(c)(0)), 6); }],
    h: ['A point at the same height as F is the same distance from the directrix as F is; that distance can be read straight off the grid.', 'On the parabola, that distance must equal the distance from the point to F, which here is measured along the level through F. There is one such point on each side of F.'],
    s: 'Read from the grid: F is (2, 1) and the directrix is y = −3. Any point at the height of F is 1 − (−3) = 4 units from the directrix. To be on the parabola it must also be 4 units from F, measured along the level through F: the points are (−2, 1) and (6, 1). They are 8 units apart.',
  },
]);

// ── Complex Numbers in Polar Form (pack 266) ────────────────────────────────

G('2515225c.lo-1', 'Points of the complex plane combined', [
  {
    t: 'modulus of the sum of two plotted numbers, which falls outside the plot', d: 3, need: 'calc',
    spec: cplane([{ re: -1, im: 6, label: 'z' }, { re: -4, im: 6, label: 'w' }], { range: 7 }),
    alt: 'Two labelled points, z and w, in the upper left quarter of a complex plane with a numbered square grid; both are at the same height.',
    q: 'The complex numbers z and w are plotted in the complex plane shown. What is |z + w|, the distance of the number z + w from the origin?',
    n: '13',
    ck: ['pc_sum', { points: [0, 1], want: 'modulus' }],
    h: ['Read each complex number from the grid: its real part across and its imaginary part up.', 'Add the real parts and add the imaginary parts to get z + w; its distance from the origin comes from the Pythagorean theorem.'],
    s: 'Read from the plane: z = −1 + 6i and w = −4 + 6i. Adding real parts and imaginary parts, z + w = −5 + 12i. Its distance from the origin is √((−5)² + 12²) = √169 = 13. The sum lies outside the part of the plane that is drawn, so it has to be found from the two numbers, not read off.',
  },
  {
    t: 'the false statement about differences and moduli of three plotted numbers', d: 3, need: 'reason',
    spec: cplane([{ re: 3, im: -2, label: 'z' }, { re: -5, im: -2, label: 'w' }, { re: 3, im: 4, label: 'u' }]),
    alt: 'Three labelled points in a complex plane with a numbered square grid: u in the upper right quarter, z in the lower right quarter directly below it, and w in the lower left quarter level with z.',
    q: 'Three complex numbers, z, w and u, are plotted in the complex plane shown. Which statement is FALSE?',
    o: [
      ['|w| is less than |u|', 'correct'],
      ['w − z is a real number', 'does not see that two points at the same height differ by a real number'],
      ['u − z is a purely imaginary number', 'does not see that two points on one vertical line differ by an imaginary number'],
      ['|u| = 5', 'misreads the coordinates of u or does not use the Pythagorean theorem'],
    ],
    holds: falseOne('real and imaginary parts of the spec\'s three points', [
      (c) => Math.hypot(zOf(c, 'w').re, zOf(c, 'w').im) < Math.hypot(zOf(c, 'u').re, zOf(c, 'u').im),
      (c) => zOf(c, 'w').im === zOf(c, 'z').im,
      (c) => zOf(c, 'u').re === zOf(c, 'z').re && zOf(c, 'u').im !== zOf(c, 'z').im,
      (c) => near(Math.hypot(zOf(c, 'u').re, zOf(c, 'u').im), 5),
    ]),
    h: ['Read the real and imaginary parts of each number. Subtracting two complex numbers subtracts their real parts and their imaginary parts.', 'The modulus is the distance from the origin: compare √(a² + b²) for the numbers named.'],
    s: 'Read from the plane: z = 3 − 2i, w = −5 − 2i and u = 3 + 4i. w − z = −8, a real number (the points are level). u − z = 6i, purely imaginary (one is directly above the other). |u| = √(3² + 4²) = 5. But |w| = √(5² + 2²) = √29 ≈ 5.39, which is greater than 5, so the statement that |w| is less than |u| is false.',
  },
]);

// ── Degrees, radians, arc length, sector area (pack 313) ────────────────────

G('ecdeb75a.lo-4', 'Arc length carried to another circle, and round the other sector', [
  {
    t: 'central angle of an equal arc on a circle of another radius', d: 3, need: 'calc',
    spec: circle({ radius: 10, points: [{ name: 'P', at: 0 }, { name: 'Q', at: 126 }], radii: [{ to: 'P', label: 'auto' }, { to: 'Q' }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: 'auto' }], unit: 'cm' }),
    alt: 'A circle with centre O and two radii, to P and to Q; one radius carries its length and the angle between the radii at the centre is given.',
    q: 'An arc of a second circle, of radius 15 cm, has the same length as the shorter arc PQ of the circle shown. What is the central angle of that second arc, in degrees?',
    n: '84',
    calc: ['arc PQ = radius × angle in radians (spec); the same length on radius 15 gives the angle, turned back into degrees', (c) => { const r = c.p.radius as number; const ps = arr(c.p.points); const deg = (ps[1].at as number) - (ps[0].at as number); if (deg > 180) throw new Error('not the shorter arc'); return round(((r * rad(deg)) / 15) * (180 / Math.PI), 6); }],
    alts: ['with π = 3.14 throughout, and with the arc length rounded to 21.99 cm or 22.0 cm', () => [((10 * 126 * 3.14) / 180 / 15) * (180 / 3.14), (21.99 / 15) * (180 / Math.PI), (22.0 / 15) * (180 / Math.PI)]],
    h: ['Arc length is radius × angle only when the angle is in radians: convert the angle shown before you use it.', 'Set that arc length equal to 15 × (the unknown angle in radians), solve, and convert the result back to degrees.'],
    s: 'Read from the figure: the radius is 10 cm and the central angle is 126°, which is 126 × π/180 = 7π/10 radians. The arc PQ has length s = rθ = 10 × 7π/10 = 7π cm. On the second circle, 7π = 15 × θ, so θ = 7π/15 radians = (7/15) × 180° = 84°. (Equal arcs: the angle is smaller in the same ratio as the radius is larger, 126° × 10/15.)',
  },
  {
    t: 'perimeter of the sector that is not hatched', d: 3, need: 'calc',
    spec: circle({ radius: 4, points: [{ name: 'P', at: 0 }, { name: 'Q', at: 135 }], radii: [{ to: 'P', label: 'auto' }, { to: 'Q' }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: 'auto' }], sector: { from: 'P', to: 'Q' }, unit: 'cm' }),
    alt: 'A circle with centre O and radii to P and Q; the smaller of the two sectors between the radii is hatched, its angle at the centre is given and one radius carries its length.',
    q: 'What is the perimeter of the sector of the circle shown that is NOT hatched, to the nearest tenth of a centimetre?',
    n: '23.7',
    calc: ['two radii plus radius × (2π − the hatched angle in radians), from the spec', (c) => { const r = c.p.radius as number; const ps = arr(c.p.points); const deg = 360 - ((ps[1].at as number) - (ps[0].at as number)); return round(2 * r + r * rad(deg), 4); }],
    alts: ['with π = 3.14, and with the angle rounded to 3.93 or 3.927 radians', () => [8 + 5 * 3.14, 8 + 4 * 3.93, 8 + 4 * 3.927]],
    h: ['Find the central angle of the sector asked about from the one that is given: the two sectors make up the whole circle.', 'The boundary of a sector is one arc and two straight sides. For the arc use s = rθ with the angle in radians.'],
    s: 'Read from the figure: the radius is 4 cm and the hatched sector has a central angle of 135°, so the sector that is not hatched has a central angle of 360° − 135° = 225°, which is 225 × π/180 = 5π/4 radians. Its arc has length s = rθ = 4 × 5π/4 = 5π ≈ 15.71 cm. The perimeter is the arc plus the two radii: 15.71 + 4 + 4 ≈ 23.7 cm.',
  },
]);

// ── Ellipse equation analysis (pack 287) ────────────────────────────────────

G('85ec2ae2.lo-3', 'Axis lengths matched with denominators in both directions', [
  {
    t: 'difference of the two denominators of a drawn vertical ellipse', d: 3, need: 'calc',
    spec: cg([-7, 3], [-6, 8], [{ type: 'ellipse', center: [-2, 1], rx: 3, ry: 5 }]),
    alt: 'An ellipse on a square grid, taller than it is wide, lying mostly to the left of the y-axis. Its centre and axes are not marked.',
    q: 'The equation of the ellipse shown can be written as (x + 2)²/m + (y − 1)²/n = 1. What is the value of m − n?',
    n: '-16',
    calc: ['m = (half-length along x)² and n = (half-length along y)² of the spec\'s ellipse, whose centre is checked against the brackets', (c) => { const k = conic(c); const [h, kk] = ctr(k); if (h !== -2 || kk !== 1) throw new Error('the brackets in the stem do not match the centre'); return (k.rx as number) ** 2 - (k.ry as number) ** 2; }],
    h: ['Read the full width and the full height of the ellipse from the grid, and halve each to get the distance from the centre to the curve in each direction.', 'The denominator under the x-bracket is the square of the horizontal half-length; the one under the y-bracket is the square of the vertical half-length. The larger one does not have to come first.'],
    s: 'Read from the figure: the ellipse runs from x = −5 to x = 1, a width of 6 (the minor axis, 2b = 6, so b = 3), and from y = −4 to y = 6, a height of 10 (the major axis, 2a = 10, so a = 5). The horizontal half-length belongs under the x-term: m = 3² = 9. The vertical one belongs under the y-term: n = 5² = 25. So m − n = 9 − 25 = −16.',
  },
  {
    t: 'the false statement comparing axis lengths with three other ellipses', d: 3, need: 'reason',
    spec: cg([-7, 7], [-7, 7], [{ type: 'ellipse', center: [0, 0], rx: 4, ry: 6 }]),
    alt: 'An ellipse on a square grid, taller than it is wide, with its centre at the origin; its axes are not marked.',
    q: 'The figure shows an ellipse whose centre is the origin. Which statement is FALSE?',
    o: [
      ['The ellipse x²/16 + y²/9 = 1 has a minor axis of the same length as the ellipse shown', 'correct'],
      ['The ellipse x²/36 + y²/16 = 1 has a major axis of the same length as the ellipse shown', 'thinks an ellipse turned the other way must have axes of other lengths'],
      ['The ellipse x²/64 + y²/16 = 1 has a minor axis of the same length as the ellipse shown', 'takes the minor axis from the first denominator whatever its size'],
      ['The major axis of the ellipse shown is 12 units long', 'gives the half-length, or reads the shorter axis'],
    ],
    holds: falseOne('major axis = 2√(larger denominator), minor axis = 2√(smaller denominator), against twice the half-lengths of the spec\'s ellipse', (() => {
      const shown = (c: Ctx) => { const k = conic(c); const a = [k.rx as number, k.ry as number]; return { major: 2 * Math.max(...a), minor: 2 * Math.min(...a) }; };
      const of = (p: number, q: number) => ({ major: 2 * Math.sqrt(Math.max(p, q)), minor: 2 * Math.sqrt(Math.min(p, q)) });
      return [(c: Ctx) => near(of(16, 9).minor, shown(c).minor), (c: Ctx) => near(of(36, 16).major, shown(c).major), (c: Ctx) => near(of(64, 16).minor, shown(c).minor), (c: Ctx) => near(shown(c).major, 12)];
    })()),
    h: ['For any ellipse in standard form, the larger denominator is a² and the smaller is b², wherever they stand; the major axis is 2a long and the minor axis 2b.', 'Read the two axis lengths of the ellipse shown from the grid, then work out the axis named in each statement.'],
    s: 'Read from the figure: the ellipse shown is 8 units wide and 12 units tall, so its minor axis is 8 and its major axis is 12. x²/36 + y²/16 = 1 has a² = 36: major axis 12, the same. x²/64 + y²/16 = 1 has b² = 16: minor axis 8, the same. But x²/16 + y²/9 = 1 has b² = 9, so its minor axis is 2 × 3 = 6, not 8: that statement is false (16 is its a², not its b²).',
  },
]);

G('85ec2ae2.lo-1', 'Standard form after a turn, and standard forms compared for size', [
  {
    t: 'standard form of the drawn ellipse after a quarter turn about its centre', d: 3, need: 'reason',
    spec: cg([-3, 9], [-7, 5], [{ type: 'ellipse', center: [3, -1], rx: 5, ry: 2 }]),
    alt: 'An ellipse on a square grid, wider than it is tall, lying mostly to the right of the y-axis. Its centre and axes are not marked.',
    q: 'The ellipse shown is turned through 90° about its own centre. Which equation is the standard form of the ellipse in its new position?',
    o: [
      [ellipseEq(3, -1, 4, 25), 'correct'],
      [ellipseEq(3, -1, 25, 4), 'writes the equation of the ellipse as drawn, before the turn'],
      [ellipseEq(-1, 3, 4, 25), 'exchanges the coordinates of the centre as well as the denominators'],
      [ellipseEq(3, -1, 2, 5), 'exchanges the half-lengths but does not square them'],
    ],
    holds: pick('after a quarter turn about its centre the spec\'s ellipse keeps its centre and exchanges its half-lengths: centre and the two denominators, against those each option is built from', (c) => { const k = conic(c); const [h, kk] = ctr(k); return [h, kk, (k.ry as number) ** 2, (k.rx as number) ** 2]; }, [[3, -1, 4, 25], [3, -1, 25, 4], [-1, 3, 4, 25], [3, -1, 2, 5]]),
    h: ['Turning the ellipse about its centre does not move the centre, but it exchanges the horizontal and vertical half-lengths.', 'In standard form the denominator under the x-bracket is the square of the horizontal half-length, and the larger denominator marks the direction of the major axis.'],
    s: 'Read from the figure: the ellipse runs from x = −2 to x = 8 and from y = −3 to y = 1, so its centre is (3, −1), its horizontal half-length is 5 and its vertical half-length is 2. After a quarter turn about the centre, the centre is still (3, −1) but the half-lengths are exchanged: 2 horizontally and 5 vertically. The equation is (x − 3)²/4 + (y + 1)²/25 = 1, a vertical ellipse, with the larger denominator under the y-term.',
  },
  {
    t: 'which of four equations is an ellipse lying wholly inside the drawn one', d: 3, need: 'reason',
    spec: cg([-6, 6], [-7, 7], [{ type: 'ellipse', center: [0, 0], rx: 3, ry: 5 }]),
    alt: 'An ellipse on a square grid with its centre at the origin, taller than it is wide; its axes are not marked.',
    q: 'Each equation below is an ellipse with the same centre as the ellipse shown. Which of them lies entirely inside the ellipse shown, without touching it?',
    o: [
      [ellipseEq(0, 0, 4, 16), 'correct'],
      [ellipseEq(0, 0, 16, 4), 'has the right two half-lengths but lying the wrong way round: it sticks out to the left and right'],
      [ellipseEq(0, 0, 4, 36), 'is narrow enough but too tall: it sticks out at the top and bottom'],
      [ellipseEq(0, 0, 9, 16), 'is as wide as the ellipse shown, so the two touch on the x-axis'],
    ],
    holds: ['720 points round each candidate ellipse x²/p + y²/q = 1, all tested to lie strictly inside the spec\'s ellipse', (() => {
      const inside = (p: number, q: number) => (c: Ctx) => { const k = conic(c); const rx = k.rx as number; const ry = k.ry as number; for (let i = 0; i < 720; i++) { const t = rad(i / 2); const x = Math.sqrt(p) * Math.cos(t); const y = Math.sqrt(q) * Math.sin(t); if (!(x * x / (rx * rx) + y * y / (ry * ry) < 1 - 1e-9)) return false; } return true; };
      return [inside(4, 16), inside(16, 4), inside(4, 36), inside(9, 16)];
    })()],
    h: ['From each equation read the horizontal half-length (the square root of the denominator under x²) and the vertical half-length (under y²).', 'Read the same two half-lengths of the ellipse shown from the grid. The inner ellipse must be smaller in BOTH directions.'],
    s: 'Read from the figure: the ellipse shown reaches x = ±3 and y = ±5. x²/4 + y²/16 = 1 reaches x = ±2 and y = ±4: smaller both ways, so it lies inside. x²/16 + y²/4 = 1 reaches x = ±4, outside. x²/4 + y²/36 = 1 reaches y = ±6, outside. x²/9 + y²/16 = 1 reaches x = ±3, touching the ellipse shown. Only x²/4 + y²/16 = 1 is entirely inside.',
  },
]);

// ── Half-Life and Doubling-Time Problems (pack 279) ─────────────────────────

G('58bad0ec.lo-3', 'Doubling times read from curves and carried beyond them', [
  {
    t: 'when two cultures with different doubling times hold equal numbers', d: 3, need: 'calc',
    spec: pgraph('Time (h)', 'Number of cells', [0, 6], 1, [0, 800], 100, [{ expr: '50*2^(x/2)', label: 'P' }, { expr: '200*2^(x/3)', label: 'Q', dashed: true }]),
    alt: 'Two rising curves on a grid of number of cells against time: a dashed curve Q that starts higher, and a solid curve P that starts lower and rises faster but is still below Q at the right-hand edge.',
    q: 'The graph shows two cultures of cells, P and Q, each growing with its own constant doubling time. If both go on growing in the same way, at what time, in hours, will the two cultures hold the same number of cells?',
    n: '12',
    calc: ['the time beyond the plot at which the spec\'s two expressions are equal (bisection on their quotient); the doubling times are checked on gridlines', (c) => {
      const P = fOf(c, 0); const Q = fOf(c, 1);
      if (!near(P(2), 2 * P(0)) || !near(Q(3), 2 * Q(0))) throw new Error('the doubling times are not 2 h and 3 h');
      return round(solve((t) => P(t) / Q(t), 1, 6, 60), 4);
    }],
    h: ['Find the doubling time of each culture: read two points on its curve between which the number of cells has doubled.', 'Write each number of cells as (starting number) × 2^(t ÷ doubling time), or continue each culture in a table of values beyond the graph, until the two agree.'],
    s: 'Read from the graph: P goes 50, 100, 200, 400 at t = 0, 2, 4, 6 h, a doubling time of 2 h; Q goes 200, 400, 800 at t = 0, 3, 6 h, a doubling time of 3 h. So P = 50 · 2^(t/2) and Q = 200 · 2^(t/3). They are equal when 2^(t/2 − t/3) = 4 = 2², that is t/6 = 2, t = 12 h. Check: P = 50 · 2⁶ = 3200 and Q = 200 · 2⁴ = 3200.',
  },
  {
    t: 'the false statement about a culture with a constant doubling time', d: 3, need: 'reason',
    spec: pgraph('Time (h)', 'Number of cells', [0, 15], 2.5, [0, 360], 40, [{ expr: '40*2^(x/5)' }]),
    alt: 'One curve on a grid of number of cells against time; it rises more and more steeply from left to right and ends near the top of the grid at the right-hand edge.',
    q: 'The graph shows the number of cells in a culture that grows with a constant doubling time. Which statement is FALSE?',
    o: [
      ['The culture gains as many cells between 10 h and 15 h as it does between 5 h and 10 h', 'correct'],
      ['The doubling time of the culture is 5 h', 'reads a doubling between two points that are not a doubling apart'],
      ['Between 5 h and 15 h the number of cells is multiplied by 4', 'adds the two doublings instead of multiplying them'],
      ['If the growth continues, the culture holds 1280 cells at 25 h', 'continues the curve as a straight line beyond the graph'],
    ],
    holds: falseOne('values of the spec\'s expression (curve_value on the gridlines used)', [
      (c) => near(c.num('curve_value', { curve: 0, x: 15 }) - c.num('curve_value', { curve: 0, x: 10 }), c.num('curve_value', { curve: 0, x: 10 }) - c.num('curve_value', { curve: 0, x: 5 })),
      (c) => near(c.num('curve_value', { curve: 0, x: 5 }), 2 * c.num('curve_value', { curve: 0, x: 0 })),
      (c) => near(c.num('curve_value', { curve: 0, x: 15 }), 4 * c.num('curve_value', { curve: 0, x: 5 })),
      (c) => near(fOf(c)(25), 1280, 1e-9),
    ]),
    h: ['Read the number of cells at several times and look for the time it takes the number to double.', 'With a constant doubling time, equal time intervals multiply the number of cells by the same factor; they do not add the same number of cells.'],
    s: 'Read from the graph: there are 40 cells at 0 h, 80 at 5 h, 160 at 10 h and 320 at 15 h, so the doubling time is 5 h. From 5 h to 15 h is two doublings, a factor of 4 (80 to 320). At 25 h, five doublings give 40 × 2⁵ = 1280 cells. But the gains are not equal: 80 cells are added between 5 h and 10 h, and 160 between 10 h and 15 h. That statement is false; equal intervals give equal factors, not equal gains.',
  },
]);

// ── Hyperbola Analysis from Equations (pack 267) ────────────────────────────

G('2753d0ea.lo-3', 'Vertices from an equation set against vertices read from a curve', [
  {
    t: 'distance between a vertex of the drawn hyperbola and a vertex of one given by its equation', d: 3, need: 'calc',
    spec: cg([-5, 9], [-7, 5], [{ type: 'hyperbola', center: [2, -1], a: 3, b: 2, axis: 'y' }]),
    alt: 'A hyperbola on a square grid with one branch opening upward and one opening downward; no points or lines are marked on it.',
    q: 'The figure shows one hyperbola. A second hyperbola, which is not drawn, has equation (x − 2)²/16 − (y + 1)²/9 = 1. How far is the upper vertex of the hyperbola shown from the right-hand vertex of the second hyperbola?',
    n: '5',
    calc: ['upper vertex (h, k + a) of the spec\'s hyperbola to the right-hand vertex (2 + 4, −1) of the stem\'s hyperbola', (c) => { const k = conic(c); const [h, kk] = ctr(k); if (k.axis !== 'y') throw new Error('no upper vertex'); return round(Math.hypot(2 + 4 - h, -1 - (kk + (k.a as number))), 6); }],
    h: ['Read the upper vertex of the hyperbola shown from the grid: it is the lowest point of the upper branch.', 'For the second hyperbola, read the centre from the brackets; the positive term is the x-term, so its vertices are a units to the left and right of the centre, where a² is the denominator of that term.'],
    s: 'Read from the figure: the upper branch of the hyperbola shown turns at (2, 2), its upper vertex. The second hyperbola has centre (2, −1); its positive term is the x-term with a² = 16, so a = 4 and its vertices are (2 ± 4, −1): the right-hand one is (6, −1). The distance from (2, 2) to (6, −1) is √(4² + 3²) = 5.',
  },
  {
    t: 'centre of a hyperbola after sliding one of its vertices onto a vertex of the drawn one', d: 3, need: 'reason',
    spec: cg([-7, 7], [-5, 5], [{ type: 'hyperbola', center: [-1, 0], a: 2, b: 2, axis: 'x' }]),
    alt: 'A hyperbola on a square grid with one branch opening to the left and one to the right; no points or lines are marked on it.',
    q: 'The hyperbola (x + 3)²/4 − (y − 2)²/5 = 1 is slid, without turning, until its LEFT vertex lies on the right-hand vertex of the hyperbola shown. Where is its centre then?',
    o: [
      ['(3, 0)', 'correct'],
      ['(−1, 0)', 'goes a units the wrong way from the vertex'],
      ['(5, 0)', 'uses a² = 4 as the distance from the vertex to the centre'],
      ['(3, 2)', 'keeps the old y-coordinate of the centre'],
    ],
    holds: pick('right-hand vertex (h + a, k) of the spec\'s hyperbola, plus the a = √4 of the stem\'s hyperbola along x', (c) => { const k = conic(c); const [h, kk] = ctr(k); if (k.axis !== 'x') throw new Error('no right-hand vertex'); return [h + (k.a as number) + Math.sqrt(4), kk]; }, [[3, 0], [-1, 0], [5, 0], [3, 2]]),
    h: ['Read the right-hand vertex of the hyperbola shown from the grid.', 'For the hyperbola that is moved, find a from the denominator of its positive term. Its left vertex is always a units to the left of its centre, at the same height.'],
    s: 'Read from the figure: the right-hand vertex of the hyperbola shown is (1, 0). The hyperbola being moved has a² = 4, so a = 2, and its transverse axis is horizontal: its left vertex is 2 units to the left of its centre. For the left vertex to be at (1, 0), the centre must be at (1 + 2, 0) = (3, 0). (Its original centre, (−3, 2), no longer matters.)',
  },
]);

G('2753d0ea.lo-2', 'The centre carried into a general equation and onto an asymptote', [
  {
    t: 'linear coefficients of the general equation from the centre of a drawn hyperbola', d: 3, need: 'calc',
    spec: cg([-3, 9], [-7, 3], [{ type: 'hyperbola', center: [3, -2], a: 2, b: 1, axis: 'x', show: { asymptotes: 'mark' } }]),
    alt: 'A hyperbola with one branch opening to the left and one to the right, drawn with its two dashed asymptotes, which cross at a point that is not labelled.',
    q: 'The figure shows a hyperbola and its asymptotes (dashed). Its equation can be written in the form x² − 4y² + Dx + Ey + F = 0. What is the value of D + E?',
    n: '-22',
    calc: ['(x − h)² − (a²/b²)(y − k)² = a² expanded for the spec\'s hyperbola: D = −2h and E = 2k·a²/b², with a²/b² checked to be 4', (c) => { const k = conic(c); const [h, kk] = ctr(k); const m = (k.a as number) ** 2 / (k.b as number) ** 2; if (k.axis !== 'x' || m !== 4) throw new Error('the form in the stem is not this hyperbola'); return -2 * h + 2 * kk * m; }],
    h: ['Read the centre (h, k) where the asymptotes cross, and a from the distance between the centre and a vertex. Write the standard form, with the coefficient of y² chosen to match the form given.', 'Multiply out the squared brackets and collect the terms in x and in y; D and E are their coefficients.'],
    s: 'Read from the figure: the asymptotes cross at the centre (3, −2), and the vertices (1, −2) and (5, −2) are 2 units from it, so a² = 4. To match x² − 4y², the equation is (x − 3)²/4 − (y + 2)²/1 = 1, that is (x − 3)² − 4(y + 2)² = 4. Expanding: x² − 6x + 9 − 4y² − 16y − 16 − 4 = 0, so D = −6 and E = −16, and D + E = −22.',
  },
  {
    t: 'an unknown centre coordinate placed on an asymptote of the drawn hyperbola', d: 3, need: 'calc',
    spec: cg([-8, 6], [-8, 6], [{ type: 'hyperbola', center: [-1, -1], a: 3, b: 3, axis: 'x', show: { asymptotes: 'mark' } }]),
    alt: 'A hyperbola with branches opening to the left and to the right, drawn with its two dashed asymptotes; one asymptote rises from left to right and the other falls.',
    q: 'The figure shows a hyperbola and its asymptotes (dashed). A second hyperbola, (x − 4)²/9 − (y − k)²/4 = 1, has its centre on the asymptote that rises from left to right. What is the value of k?',
    n: '4',
    calc: ['the rising asymptote of the spec\'s hyperbola (slope b/a through its centre) at x = 4, the x-coordinate of the stem\'s centre', (c) => { const k = conic(c); const [h, kk] = ctr(k); return round(kk + ((k.b as number) / (k.a as number)) * (4 - h), 6); }],
    h: ['Read the centre of the second hyperbola from its equation as a point with one unknown coordinate.', 'That point lies on the rising dashed line. Follow that line on the grid to the x-coordinate of the centre and read its height there.'],
    s: 'From its equation, the centre of the second hyperbola is (4, k). Read from the figure: the rising asymptote passes through the grid points (−1, −1), (0, 0) and (2, 2): it is the line y = x. At x = 4 this line is at height 4, so the centre is (4, 4) and k = 4.',
  },
]);

// ── Nonlinear systems of equations (pack 265) ───────────────────────────────

G('20c673c2.lo-1', 'A conic identified from its equation and set against a drawn one', [
  {
    t: 'the value of a coefficient that turns a general equation into the drawn conic', d: 3, need: 'reason',
    spec: cg([-8, 8], [-6, 6], [{ type: 'ellipse', center: [0, 0], rx: 6, ry: 3 }]),
    alt: 'A closed oval curve on a square grid with its centre at the origin, wider than it is tall.',
    q: 'The equation x² + ky² = 36 has a different graph for different values of the constant k. The figure shows its graph for one value of k. What is that value?',
    o: [
      ['k = 4', 'correct'],
      ['k = 1/4', 'divides the wrong way round when putting the equation in standard form'],
      ['k = −4', 'gives the right size but the sign that would make the graph a hyperbola'],
      ['k = 2', 'uses the ratio of the half-lengths without squaring it'],
    ],
    holds: ['x² + ky² = 36 is the spec\'s ellipse exactly when k > 0, √36 is its half-length along x and √(36/k) its half-length along y', (() => {
      const is = (k: number) => (c: Ctx) => { const e = conic(c); return k > 0 && near(Math.sqrt(36), e.rx as number) && near(Math.sqrt(36 / k), e.ry as number); };
      return [is(4), is(1 / 4), is(-4), is(2)];
    })()],
    h: ['Decide what kind of conic the figure shows; that fixes the sign of k.', 'Divide the equation by 36 to put it in standard form, and match the denominator of the y² term with the square of the half-height read from the figure.'],
    s: 'Read from the figure: the graph is an ellipse reaching x = ±6 and y = ±3. Both squared terms must then have positive coefficients, so k > 0. Dividing by 36: x²/36 + y²/(36/k) = 1. The half-height is 3, so 36/k = 3² = 9 and k = 4. (k = −4 would give a hyperbola, and k = 1 a circle of radius 6.)',
  },
  {
    t: 'number of solutions when the second conic must be identified and placed from its equation', d: 3, need: 'reason',
    spec: cg([-6, 6], [-5, 5], [{ type: 'hyperbola', center: [0, 0], a: 1, b: 1, axis: 'x' }]),
    alt: 'A hyperbola on a square grid with its centre at the origin, one branch opening to the left and one to the right.',
    q: 'The figure shows the graph of one equation of a nonlinear system. The other equation of the system is 4x² + 9y² = 36, whose graph is not drawn. How many solutions does the system have?',
    o: [
      ['4', 'correct'],
      ['2', 'takes the second graph to meet each branch only once'],
      ['0', 'takes the second graph to lie between the two branches'],
      ['8', 'counts each crossing twice, once for each equation'],
    ],
    holds: pick('conic_conic_intersections on the spec with the ellipse x²/9 + y²/4 = 1 (the stem\'s equation in standard form) added', (c) => c.num('conic_conic_intersections', {}, { spec: S('conic_graph', { ...c.p, conics: [...arr(c.p.conics), { type: 'ellipse', center: [0, 0], rx: 3, ry: 2 }] }), what: 'the ellipse x²/9 + y²/4 = 1 added' }), [4, 2, 0, 8]),
    h: ['Identify the conic that the second equation describes by the signs of its squared terms, and put it in standard form to find where it crosses the axes.', 'Picture that curve on the figure: compare where it crosses the x-axis with where the branches of the drawn curve begin.'],
    s: 'The second equation has two positive squared terms with different coefficients: an ellipse. In standard form it is x²/9 + y²/4 = 1, crossing the x-axis at (±3, 0) and the y-axis at (0, ±2). Read from the figure: the branches of the hyperbola start at (±1, 0), inside the ellipse, and open outward, so each branch leaves the ellipse through its upper half and through its lower half. Two crossings on each branch give 4 solutions.',
  },
]);

// ── Sinusoidal Models from Real Data (pack 263) ─────────────────────────────

G('1c19dde2.lo-1', 'Two cycles at once, and the features of one cycle in a table', [
  {
    t: 'when two quantities with different periods next peak together', d: 3, need: 'calc',
    spec: pgraph('Time (h)', 'Reading', [0, 12], 1, [0, 6], 1, [{ expr: '3 + 2*cos(pi*x/3)', label: 'P' }, { expr: '3 + cos(pi*x/4)', label: 'Q', dashed: true }]),
    alt: 'Two wave-like curves on a grid of reading against time, both starting at a high point: a solid curve P with the larger swing, which repeats more often, and a dashed curve Q with a smaller swing.',
    q: 'The graph shows two quantities, P and Q, each of which repeats in a regular cycle. Both are at a maximum at t = 0. If both patterns continue, at what time, in hours, are both next at a maximum together?',
    n: '24',
    calc: ['least common multiple of the two periods, each the time from the first maximum to the next on the spec\'s expression', (c) => { const a = periodOf(fOf(c, 0), 12); const b = periodOf(fOf(c, 1), 12); if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error('periods are not whole hours'); let t = a; while (t % b) t += a; return t; }],
    h: ['Find the period of each quantity: the time from one of its maxima to the next.', 'P is at a maximum at every multiple of its period, and Q at every multiple of its own. Look for the first time after zero that is a multiple of both.'],
    s: 'Read from the graph: P has maxima at 0, 6 and 12 h, so its period is 6 h; Q has maxima at 0 and 8 h, so its period is 8 h. P is at a maximum at 6, 12, 18, 24, … h and Q at 8, 16, 24, … h. The first time on both lists is 24 h, the least common multiple of 6 and 8.',
  },
  {
    t: 'the false statement about period, amplitude and repeats in a table of readings', d: 3, need: 'reason',
    spec: table([{ header: 'Time', unit: 'h' }, { header: 'Level', unit: 'm' }], [[0, '3.0'], [2, '5.0'], [4, '7.0'], [6, '5.0'], [8, '3.0'], [10, '5.0'], [12, '7.0'], [14, '5.0']]),
    alt: 'A table of eight rows giving the time, every two hours, and the water level in metres.',
    q: 'The table gives the water level in a tank, recorded every 2 hours; the pattern continues in the same way. Which statement is FALSE?',
    o: [
      ['In each complete cycle the level is 5.0 m at exactly one of the recorded times', 'correct'],
      ['The period of the pattern is 8 h', 'takes the time between a highest and a lowest reading as the period'],
      ['The level varies by 2.0 m above and below its middle value', 'gives the whole range, 4.0 m, as the amplitude'],
      ['The pattern gives a level of 7.0 m at 28 h', 'does not reduce 28 h by whole periods before looking it up'],
    ],
    holds: falseOne('period = the shortest shift after which the spec\'s readings repeat; the other features from one period of them', (() => {
      const g = (c: Ctx) => { const t = tcol(c, 0); const v = tcol(c, 1); let k = 1; while (!v.every((x, i) => i + k >= v.length || near(x, v[i + k]))) k++; const one = v.slice(0, k); const mid = (Math.max(...one) + Math.min(...one)) / 2; return { period: t[k] - t[0], one, mid, amp: Math.max(...one) - mid, at: (time: number) => one[Math.round((time % (t[k] - t[0])) / (t[1] - t[0]))] }; };
      return [(c: Ctx) => g(c).one.filter((x) => near(x, 5)).length === 1, (c: Ctx) => g(c).period === 8, (c: Ctx) => near(g(c).amp, 2) && near(g(c).mid, 5), (c: Ctx) => near(g(c).at(28), 7)];
    })()),
    h: ['Find one complete cycle: the stretch of readings after which the whole list starts to repeat.', 'Within one cycle, note the highest, lowest and middle values and how many times each occurs; for a later time, subtract whole periods first.'],
    s: 'Read from the table: the levels run 3.0, 5.0, 7.0, 5.0 and then repeat, so one cycle takes 8 h. The level moves between 3.0 m and 7.0 m, 2.0 m either side of the middle value 5.0 m. At 28 h, three whole periods (24 h) have passed, so the level is the same as at 4 h: 7.0 m. Within one cycle the middle value 5.0 m is recorded twice, once on the way up and once on the way down, so the statement that it occurs once is false.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY
// ════════════════════════════════════════════════════════════════════════════

/** The phase a cell is in `t` hours after the START of the phase `from`, going clockwise round the wheel (spec durations). */
const phaseAfter = (c: Ctx, from: string, t: number): string => {
  const ph = arr(c.p.phases).map((k) => ({ name: k.name as string, d: k.duration as number }));
  let i = ph.findIndex((k) => k.name === from); if (i < 0) throw new Error(`no phase ${from}`);
  let left = t;
  for (let n = 0; n < 4 * ph.length; n++) { if (left < ph[i].d - 1e-9) return ph[i].name; if (near(left, ph[i].d)) throw new Error('the time falls exactly on a boundary'); left -= ph[i].d; i = (i + 1) % ph.length; }
  throw new Error('time out of range');
};
const dur = (c: Ctx, name: string): number => { const k = arr(c.p.phases).find((x) => x.name === name); if (!k) throw new Error(`no phase ${name}`); return k.duration as number; };

// ── Cell Cycle Checkpoints and Cancer (pack 095) ────────────────────────────

G('f963fcbd.lo-1', 'Events of the phases placed by the clock, and what replication does not change', [
  {
    t: 'chromatid count at a stated time after cytokinesis', d: 3, need: 'reason',
    spec: wheel([['G1', 10], ['S', 6], ['G2', 4], ['M', 2]]),
    alt: 'A ring of four sectors read clockwise, G1, S, G2 and M, each printed with its length in hours.',
    q: 'The figure gives the length of each phase of the cell cycle for one type of cell, which has 6 chromosomes. A cell of this type has just been formed by cytokinesis. How many chromatids does this cell contain 18 hours later?',
    n: '12',
    calc: ['the phase 18 h after the start of G1 on the spec\'s wheel; in G2 every one of the 6 chromosomes is two sister chromatids', (c) => { const ph = phaseAfter(c, 'G1', 18); if (ph !== 'G2') throw new Error(`the cell is in ${ph}, where the count is not settled this way`); return 6 * 2; }],
    h: ['Add the lengths of the phases, in order from the start of G1, to find which phase the cell is in after the time given.', 'Then recall what has happened to each chromosome by that phase, and count chromatids, not chromosomes.'],
    s: 'Read from the figure: G1 lasts 10 h, S 6 h and G2 4 h. A cell just formed by cytokinesis is at the start of G1, so it is in G1 until 10 h, in S until 16 h and in G2 until 20 h. At 18 h it is in G2: DNA replication is complete, so each of its 6 chromosomes consists of two sister chromatids. It contains 6 × 2 = 12 chromatids (and still 6 chromosomes).',
  },
  {
    t: 'the false statement about two lettered phases', d: 3, need: 'reason',
    spec: wheel([['G1', 8, 'W'], ['S', 6], ['G2', 4, 'Y'], ['M', 2]]),
    alt: 'A ring of four sectors read clockwise, each printed with its length in hours; two sectors are named S and M, and the other two carry the letters W and Y.',
    q: 'The figure shows the cell cycle of one type of cell, read clockwise; two of the phases are marked only with letters. Which statement is FALSE?',
    o: [
      ['A cell in phase Y has twice as many chromosomes as a cell in phase W', 'correct'],
      ['A cell in phase W has not yet begun to copy its DNA', 'takes W, which comes before S, for a phase after replication'],
      ['In phase Y every chromosome consists of two sister chromatids', 'takes Y for a phase in which replication is not yet finished'],
      ['A cell spends more than half of the cycle before its DNA replication is complete', 'compares the length of S alone with half of the cycle'],
    ],
    holds: falseOne('cycle_phase for the two lettered sectors and the spec\'s durations; replication doubles the DNA and the chromatids of a cell, not its number of chromosomes', (() => {
      const chromosomesRatioG2toG1 = 1;
      return [
        (c: Ctx) => c.txt('cycle_phase', { label: 'Y' }) === 'G2' && c.txt('cycle_phase', { label: 'W' }) === 'G1' && chromosomesRatioG2toG1 === 2,
        (c: Ctx) => c.txt('cycle_phase', { label: 'W' }) === 'G1',
        (c: Ctx) => c.txt('cycle_phase', { label: 'Y' }) === 'G2',
        (c: Ctx) => (dur(c, 'G1') + dur(c, 'S')) / sum(arr(c.p.phases).map((k) => k.duration as number)) > 0.5,
      ];
    })()),
    h: ['Name the lettered phases from their places in the clockwise order: the phase just before S and the phase just after it.', 'Keep chromosomes, chromatids and DNA content apart: copying the DNA changes two of these three, but not the third.'],
    s: 'Read from the figure: going clockwise, W comes just before S, so W is G1, and Y comes between S and M, so Y is G2. A G1 cell has not begun DNA replication (true). By G2 every chromosome has been copied and consists of two sister chromatids (true). G1 and S together last 8 + 6 = 14 h of the 20 h cycle, more than half (true). But replication does not change the NUMBER of chromosomes: a G2 cell has twice the DNA and twice the chromatids of a G1 cell, and the same number of chromosomes. That statement is false.',
  },
]);

// ── Cell Cycle Phases and DNA Content (pack 073) ────────────────────────────

G('72b3b3de.lo-1', 'The phases of interphase used as a timetable', [
  {
    t: 'longest time a cell keeps cycling after DNA synthesis is blocked', d: 3, need: 'reason',
    spec: wheel([['G1', 11], ['S', 8], ['G2', 4], ['M', 1]]),
    alt: 'A ring of four sectors read clockwise, G1, S, G2 and M, each printed with its length in hours.',
    q: 'The figure gives the length of each phase of the cell cycle for one type of cell. A drug that instantly stops all DNA synthesis is added to a culture in which the cells are at every stage of the cycle. Cells that are copying their DNA stop at once; every other cell carries on through the cycle until it is due to begin copying its DNA, and stops there. Counting a cell and the daughter cells it divides into as one line of cells, what is the longest time, in hours, that any line of cells continues through the cycle after the drug is added?',
    n: '16',
    calc: ['the phases between the end of S and the next start of S on the spec\'s wheel: G2 + M + G1', (c) => dur(c, 'G2') + dur(c, 'M') + dur(c, 'G1')],
    h: ['Name the one phase in which a cell is copying its DNA. Cells in that phase stop at once; all the others keep going until they reach the start of it.', 'The cell with furthest to go is the one that had only just left that phase when the drug was added. Add up the phases it still has to pass through.'],
    s: 'DNA is copied in S phase. Read from the figure: G1 lasts 11 h, S 8 h, G2 4 h and M 1 h. Cells in S stop at once. Every other cell continues until it reaches the start of S. The cell with furthest to go had just finished S when the drug was added: it must pass through all of G2 (4 h), M (1 h) and then, as daughter cells, all of G1 (11 h) before stopping. That is 4 + 1 + 11 = 16 h.',
  },
  {
    t: 'where a cell is a stated time after it begins to copy its DNA', d: 3, need: 'reason',
    spec: wheel([['G1', 7], ['S', 6], ['G2', 3], ['M', 2]]),
    alt: 'A ring of four sectors read clockwise, G1, S, G2 and M, each with its length in hours printed beside it.',
    q: 'The figure gives the length of each phase of the cell cycle for one type of cell. A cell of this type has just begun to copy its DNA. Which describes this cell, or the cells it has given rise to, 12 hours later?',
    o: [
      ['It has divided, and each daughter cell is in G1', 'correct'],
      ['It is still copying its DNA', 'counts the 12 hours from the start of G1 instead of from the start of S'],
      ['It has finished copying its DNA and is in G2', 'adds only the length of S and overlooks how short G2 is'],
      ['It is in mitosis', 'stops adding one phase too early'],
    ],
    holds: pick('the phase 12 h after the start of S on the spec\'s wheel', (c) => phaseAfter(c, 'S', 12), ['G1', 'S', 'G2', 'M']),
    h: ['The cell starts at the beginning of the phase in which DNA is copied, not at the beginning of G1.', 'From that starting point, add the lengths of the phases in clockwise order until you pass 12 hours.'],
    s: 'DNA is copied in S phase, so the cell is at the start of S. Read from the figure: S lasts 6 h, G2 3 h and M 2 h. The cell is in S until 6 h, in G2 until 9 h and in M until 11 h, when it divides. From 11 h its daughter cells are in G1, which lasts 7 h, so at 12 h each daughter cell is in G1, with chromosomes that have not yet been copied again.',
  },
]);

// ── DNA Replication mechanisms (pack 099) ───────────────────────────────────

G('ffe602ec.lo-2', 'The hydrogen bonds helicase has to break, counted on real sequences', [
  {
    t: 'difference in hydrogen bonds between two stretches of equal length', d: 3, need: 'calc',
    spec: strip([['X', 'GCGGCATCGCCG'], ['Y', 'ATTAGCTTAAAT']]),
    alt: 'Two rows of twelve bases each, named X and Y, each labelled 5′ at the left end and 3′ at the right.',
    q: 'The figure shows one strand from each of two stretches of double-stranded DNA, X and Y. Each strand is fully paired with its complementary strand, which is not drawn. How many MORE hydrogen bonds must helicase break to unwind stretch X than to unwind stretch Y?',
    n: '8',
    calc: ['seq_base_count (hydrogen_bonds) for row X minus the same for row Y', (c) => c.num('seq_base_count', { row: 0, want: 'hydrogen_bonds' }) - c.num('seq_base_count', { row: 1, want: 'hydrogen_bonds' })],
    h: ['Helicase breaks the hydrogen bonds between paired bases: two for every A–T pair and three for every G–C pair.', 'Count the two kinds of bases in each strand shown; each base stands for one pair.'],
    s: 'Each base shown is paired with its partner on the missing strand: A–T pairs are held by 2 hydrogen bonds and G–C pairs by 3. Read from the figure: X has 10 G or C bases and 2 A or T bases, so 10 × 3 + 2 × 2 = 34 bonds. Y has 2 G or C bases and 10 A or T bases, so 2 × 3 + 10 × 2 = 26 bonds. Helicase must break 34 − 26 = 8 more hydrogen bonds for X.',
  },
  {
    t: 'base pairs separated when a stated number of hydrogen bonds has been broken', d: 3, need: 'calc',
    spec: strip([['strand 1', 'GATCCTAGCA'], ['strand 2', 'CTAGGATCGT']], { pairTicks: true }),
    alt: 'Two rows of ten bases joined by a tick at each base pair; the upper strand runs 5′ to 3′ from left to right and the lower strand the opposite way.',
    q: 'The figure shows a stretch of double-stranded DNA. Helicase starts at the left-hand end of the stretch and moves to the right, separating one base pair after another. How many base pairs has it separated when it has broken exactly 15 hydrogen bonds?',
    n: '6',
    calc: ['running total of 2 (A·T) or 3 (G·C) bonds per pair along the spec\'s upper strand from the left, until it is exactly 15; the lower row is checked to be the complement', (c) => {
      const top = seqOf(c, 0); const comp: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
      if (seqOf(c, 1) !== [...top].map((b) => comp[b]).join('')) throw new Error('the rows are not paired');
      let t = 0; for (let i = 0; i < top.length; i++) { t += HB[top[i]]; if (t === 15) return i + 1; if (t > 15) break; }
      throw new Error('15 bonds is not reached exactly');
    }],
    h: ['An A–T pair is held by two hydrogen bonds and a G–C pair by three.', 'Work along the stretch from the left, keeping a running total of the bonds broken, until the total reaches the number given.'],
    s: 'Read from the figure, pair by pair from the left: G–C (3 bonds, total 3), A–T (2, total 5), T–A (2, total 7), C–G (3, total 10), C–G (3, total 13), T–A (2, total 15). The total reaches 15 after the sixth pair, so helicase has separated 6 base pairs.',
  },
]);

G('ffe602ec.lo-1', 'Semi-conservative replication followed over several rounds', [
  {
    t: 'number of rounds of replication from the make-up of the DNA afterwards', d: 3, need: 'reason',
    spec: S('bar_chart', { categories: ['Both strands heavy', 'One heavy, one light', 'Both strands light'], values: [0, 25, 75], yLabel: 'DNA molecules (%)', yMin: 0, yMax: 100, yStep: 25 }),
    alt: 'Three bars for three kinds of DNA molecule, sorted by the nitrogen in their two strands; one kind has no bar at all, and the other two bars differ in height.',
    q: 'Bacteria whose DNA contained only heavy nitrogen in both strands were moved to a medium containing only light nitrogen and allowed to replicate their DNA several times. The chart shows the make-up of the DNA molecules afterwards. How many rounds of replication had taken place?',
    n: '3',
    calc: ['after n rounds the two original strands sit in 2 of the 2ⁿ molecules: n from the bar for one heavy and one light strand (bar_value), with the other two bars checked', (c) => {
      const hybrid = c.num('bar_value', { category: 1 }) / 100; const n = Math.log2(2 / hybrid);
      if (!Number.isInteger(n) || c.num('bar_value', { category: 0 }) !== 0 || !near(c.num('bar_value', { category: 2 }) / 100, 1 - hybrid)) throw new Error('the chart is not a semi-conservative outcome');
      return n;
    }],
    h: ['In semi-conservative replication each original strand stays intact and ends up paired with a new strand. Count how many molecules can ever contain an original strand.', 'Each round doubles the total number of molecules. Find the number of rounds after which the molecules with one heavy strand make up the share shown.'],
    s: 'Each original molecule has two heavy strands, and in semi-conservative replication these two strands are never broken up: after any number of rounds exactly 2 molecules contain one heavy strand, and every other molecule is entirely light. After n rounds one original molecule has become 2ⁿ molecules, so the share with one heavy strand is 2/2ⁿ. Read from the chart: that share is 25%, with 75% all light and none all heavy. 2/2ⁿ = 1/4 gives 2ⁿ = 8, so n = 3 rounds.',
  },
  {
    t: 'how many strands read like the original after two rounds, for a sequence that is its own reverse complement', d: 4, need: 'reason',
    spec: strip([['strand 1', 'ACGATCGT']]),
    alt: 'One row of eight bases named strand 1, labelled 5′ at its left end and 3′ at its right end.',
    q: 'Strand 1, shown in the figure, is one of the two strands of a short DNA molecule. The molecule is replicated twice, giving four molecules, 8 strands in all. How many of the 8 strands have exactly the same sequence as strand 1 when each is read from its own 5′ end to its 3′ end?',
    o: [
      ['8', 'correct'],
      ['4', 'takes the complementary strand to read differently, as it does for most sequences'],
      ['2', 'counts the original strand and one copy, as if each round made one strand like it'],
      ['1', 'counts only the original strand itself'],
    ],
    holds: pick('every strand is strand 1 or its complement, 4 of each; seq_complement (written 5′ to 3′) of the spec\'s row says whether the complement reads the same', (c) => (c.txt('seq_complement', { row: 0, written: '5to3' }).replace(/[^ACGT]/g, '') === seqOf(c, 0) ? 8 : 4), [8, 4, 2, 1]),
    h: ['Every strand made in either round is complementary to its template, so each of the 8 strands has either the sequence of strand 1 or the sequence of its complement.', 'Write out the complement of strand 1 and then read it from its own 5′ end, which is at the opposite end from the 5′ end of strand 1. Compare what you get with strand 1.'],
    s: 'Semi-conservative replication copies each strand into its complement, so all 8 strands carry either the sequence of strand 1 or that of its complement: 4 of each. Read from the figure: strand 1 is 5′-ACGATCGT-3′. Its complement, base for base, is 3′-TGCTAGCA-5′, which read from its own 5′ end is 5′-ACGATCGT-3′, the same as strand 1. For this sequence the two strands read alike, so all 8 strands have the sequence of strand 1.',
  },
]);

// ── DNA vs RNA Structure (pack 076) ─────────────────────────────────────────

G('7ca653b9.lo-3', 'The one base that differs, counted and used to rule strands out', [
  {
    t: 'positions at which an RNA copy differs from the DNA strand it matches', d: 3, need: 'reason',
    spec: strip([['DNA strand 1', 'ATGCTTAGCCTA'], ['DNA strand 2', 'TACGAATCGGAT']], { pairTicks: true }),
    alt: 'Two rows of twelve bases joined by a tick at each base pair; the upper strand runs 5′ to 3′ from left to right and the lower strand the opposite way.',
    q: 'The figure shows both strands of a stretch of DNA. An RNA copy is made using the lower strand as the template, so the RNA pairs with the lower strand base for base. At how many positions does the base in the RNA differ from the base at the same position in the UPPER DNA strand?',
    n: '4',
    calc: ['the RNA is the complement of the lower strand with U for T, compared position by position with the upper strand of the spec', (c) => {
      const comp: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };
      const rna = [...seqOf(c, 1)].map((b) => comp[b]).join(''); const top = seqOf(c, 0);
      const diff = [...top].filter((b, i) => b !== rna[i]).length;
      if (diff !== c.num('seq_base_count', { row: 0, want: 'T' })) throw new Error('the differences are not the thymines');
      return diff;
    }],
    h: ['An RNA strand that pairs with the lower strand carries the same information as the upper strand; work out what it looks like next to the upper strand.', 'RNA and DNA share three of their four bases. Find the one base of the upper strand that cannot appear in RNA, and count it.'],
    s: 'The RNA is complementary to the lower strand, just as the upper DNA strand is, so it matches the upper strand at every position, except that RNA contains uracil wherever DNA contains thymine. Read from the figure: the upper strand is ATGCTTAGCCTA, which has thymine at 4 positions. The RNA has U at those 4 positions and the same base as the upper strand everywhere else, so the two differ at 4 positions.',
  },
  {
    t: 'which of three strands is an RNA that pairs with a given DNA strand', d: 3, need: 'reason',
    spec: strip([['W', 'ATGCAGTC'], ['X', 'GACUGCAU'], ['Y', 'GACTGCAT'], ['Z', 'UACGUCAG']]),
    alt: 'Four rows of eight bases each, named W, X, Y and Z, every one labelled 5′ at its left end and 3′ at its right end.',
    q: 'The figure shows four nucleic-acid strands, each written from its 5′ end to its 3′ end. Which strand could be an RNA molecule made by pairing bases, one by one, with the whole of strand W?',
    o: [
      ['Strand X', 'correct'],
      ['Strand Y', 'has the right order of bases but contains a base that RNA does not have'],
      ['Strand Z', 'pairs with W only if the two strands run in the same direction, which paired strands never do'],
      ['Strand W rewritten with U for every T', 'gives a copy of W, not a strand that pairs with it'],
    ],
    holds: ['seq_complement of row W as RNA, written 5′ to 3′, against each candidate sequence of the spec', (() => {
      const target = (c: Ctx) => c.txt('seq_complement', { row: 0, as: 'RNA', written: '5to3' }).replace(/[^ACGU]/g, '');
      return [(c: Ctx) => seqOf(c, 1) === target(c), (c: Ctx) => seqOf(c, 2) === target(c), (c: Ctx) => seqOf(c, 3) === target(c), (c: Ctx) => seqOf(c, 0).replace(/T/g, 'U') === target(c)];
    })()],
    h: ['Decide first which of the strands can be RNA at all: look for the base found only in RNA and the base found only in DNA.', 'Two paired strands run in opposite directions. Write the bases that pair with W in order, then turn the result round so that it too is written from its 5′ end.'],
    s: 'Read from the figure: strand W is 5′-ATGCAGTC-3′. The RNA bases that pair with it, in the same left-to-right order, are UACGUCAG, but that strand runs 3′ to 5′, since paired strands are antiparallel. Written from its own 5′ end it is 5′-GACUGCAU-3′, which is strand X. Strand Y has the same order but contains T, so it is DNA, not RNA. Strand Z has the pairing bases written in the wrong direction, and a copy of W with U for T would not pair with W at all.',
  },
]);

// ── Mendelian Genetics Prediction (pack 093) ────────────────────────────────

/** Every genotype (AA, Aa, aa) each individual of a pedigree can have, for an autosomal recessive trait with full penetrance, by trying all assignments. */
const possibleGenotypes = (c: Ctx): Map<string, Set<string>> => {
  const inds = arr(c.p.individuals).map((k) => ({ id: k.id as string, affected: k.affected as boolean, father: k.father as string | undefined, mother: k.mother as string | undefined }));
  const G3 = ['AA', 'Aa', 'aa']; const out = new Map(inds.map((k) => [k.id, new Set<string>()]));
  const gives = (g: string): string[] => (g === 'AA' ? ['A'] : g === 'aa' ? ['a'] : ['A', 'a']);
  const total = 3 ** inds.length;
  for (let n = 0; n < total; n++) {
    const g = new Map<string, string>(); let m = n;
    for (const k of inds) { g.set(k.id, G3[m % 3]); m = Math.floor(m / 3); }
    const ok = inds.every((k) => {
      if ((g.get(k.id) === 'aa') !== k.affected) return false;
      if (!k.father || !k.mother) return true;
      const child = g.get(k.id)!;
      return gives(g.get(k.father)!).some((x) => gives(g.get(k.mother)!).some((y) => [x, y].sort().join('') === [...child].sort().join('')));
    });
    if (ok) for (const k of inds) out.get(k.id)!.add(g.get(k.id)!);
  }
  return out;
};

G('e7dee353.lo-2', 'When the phenotype does and does not fix the genotype', [
  {
    t: 'unaffected individuals of a pedigree whose genotype is certain', d: 4, need: 'reason',
    spec: S('pedigree', { individuals: [{ id: 'I-1', sex: 'M', affected: false }, { id: 'I-2', sex: 'F', affected: false }, { id: 'II-1', sex: 'F', affected: true, father: 'I-1', mother: 'I-2' }, { id: 'II-2', sex: 'M', affected: false, father: 'I-1', mother: 'I-2' }, { id: 'II-3', sex: 'F', affected: false, father: 'I-1', mother: 'I-2' }, { id: 'II-4', sex: 'M', affected: true }, { id: 'III-1', sex: 'M', affected: false, father: 'II-4', mother: 'II-3' }, { id: 'III-2', sex: 'F', affected: true, father: 'II-4', mother: 'II-3' }] }),
    alt: 'Three generations: an unshaded couple with three children, of whom one daughter is shaded; another, unshaded, daughter and her shaded partner have an unshaded son and a shaded daughter.',
    q: 'In the pedigree shown, the shaded individuals show a trait caused by a recessive allele (a) of a gene that is not on a sex chromosome; the allele A is completely dominant. For how many of the UNSHADED individuals can the genotype be known for certain from the pedigree?',
    n: '4',
    calc: ['every assignment of AA / Aa / aa to the spec\'s individuals that fits the phenotypes and Mendelian inheritance: the unaffected individuals with only one possible genotype', (c) => { const g = possibleGenotypes(c); return arr(c.p.individuals).filter((k) => !k.affected && g.get(k.id as string)!.size === 1).length; }],
    h: ['A shaded individual must have two copies of the recessive allele, and passes one of them to every child.', 'For each unshaded individual, look at the parents and the children: a shaded parent or a shaded child fixes the genotype. An unshaded individual with neither may be AA or Aa.'],
    s: 'Unshaded individuals have at least one A; shaded ones are aa. Read from the pedigree: the couple in generation I are unshaded but have a shaded daughter (aa), so each must be Aa. Their unshaded daughter who has children has a shaded child, so she must carry a: Aa. Her unshaded son received a from his shaded father (aa), so he is Aa. The unshaded son in generation II has two Aa parents and no children: he may be AA or Aa. So the genotype is certain for 4 of the 5 unshaded individuals.',
  },
  {
    t: 'different genotypes behind one phenotype class of a two-gene square', d: 3, need: 'reason',
    spec: S('punnett_square', { top: ['RY', 'Ry', 'rY', 'ry'], side: ['RY', 'Ry', 'rY', 'ry'] }),
    alt: 'A four-by-four Punnett square with the gametes RY, Ry, rY and ry along the top and down the side, and a two-gene genotype in each of the sixteen squares.',
    q: 'The Punnett square shown is for a cross between two pea plants that are heterozygous for two genes: R (round seeds) is completely dominant to r (wrinkled), and Y (yellow seeds) is completely dominant to y (green). How many different genotypes are found among the squares whose offspring have round, yellow seeds?',
    n: '4',
    calc: ['each square of the spec built from its two gametes; the distinct genotypes among those with at least one R and at least one Y', (c) => {
      const top = c.p.top as string[]; const side = c.p.side as string[]; const seen = new Set<string>();
      for (const s of side) for (const t of top) { const g = [[s[0], t[0]].sort().join(''), [s[1], t[1]].sort().join('')].join(''); if (g.includes('R') && g.includes('Y')) seen.add(g); }
      return seen.size;
    }],
    h: ['A square shows the dominant phenotype for a gene whenever it holds at least one capital letter of that gene.', 'Mark the squares with at least one R and at least one Y, then list the different genotypes among them; several squares hold the same genotype.'],
    s: 'Round, yellow seeds need at least one R and at least one Y. Read from the square: 9 of the 16 squares qualify, and among them the genotypes are RRYY (1 square), RRYy (2), RrYY (2) and RrYy (4). That is 4 different genotypes giving one and the same phenotype, which is why the phenotype alone does not tell the genotype.',
  },
]);

// ── Positive vs Negative Feedback Loops (pack 077) ──────────────────────────

G('8c600e3b.lo-3', 'Glucose records read as a feedback loop at work', [
  {
    t: 'the false statement about hormone secretion at times read from a glucose curve', d: 3, need: 'reason',
    spec: mgraph('position', [{ points: [[0, 90], [1, 150], [2, 110], [3, 80], [4, 90], [5, 90]], vertexDots: 'none' }], { tRange: [0, 6], yRange: [60, 160], tStep: 1, yStep: 10, tLabel: 'Time after the meal (h)', yLabel: 'Blood glucose (mg/dL)' }),
    alt: 'A line graph of blood glucose against time after a meal: the line climbs to a peak, comes down past its starting level to a low point, and returns to the starting level.',
    q: 'The graph shows the blood glucose level of a healthy person after a meal eaten at time zero; before the meal the level had been steady at the value shown at time zero. Which statement is FALSE?',
    o: [
      ['Insulin secretion is at its highest at 3 h', 'correct'],
      ['Insulin secretion is greater at 1 h than it was before the meal', 'thinks insulin is released when glucose is low, to bring it up'],
      ['Between 1 h and 3 h glucose is leaving the blood faster than it is entering', 'reads the falling line as glucose still building up'],
      ['Glucagon secretion is greater at 3 h than it was before the meal', 'does not see that the level at 3 h is below the starting level'],
    ],
    holds: falseOne('glucose levels on the spec\'s line (series_value / series_extremum / series_slope): insulin secretion follows the glucose level, glucagon secretion rises when glucose is below its starting level', [
      (c) => c.num('series_extremum', { series: 0, which: 'max', want: 't' }) === 3,
      (c) => c.num('series_value', { series: 0, t: 1 }) > c.num('series_value', { series: 0, t: 0 }),
      (c) => c.num('series_slope', { series: 0, t1: 1, t2: 2 }) < 0 && c.num('series_slope', { series: 0, t1: 2, t2: 3 }) < 0,
      (c) => c.num('series_value', { series: 0, t: 3 }) < c.num('series_value', { series: 0, t: 0 }),
    ]),
    h: ['The pancreas releases more insulin when blood glucose is above its normal level and more glucagon when it is below it.', 'Read the glucose level at each time named and compare it with the level before the meal; for the statement about entering and leaving, look at which way the line is going.'],
    s: 'Read from the graph: glucose starts at 90 mg/dL, peaks at 150 mg/dL at 1 h, falls to 80 mg/dL at 3 h and returns to 90 mg/dL at 4 h. High glucose is the stimulus for insulin, so insulin secretion is greatest near the peak at 1 h and is higher there than before the meal (true). While the line falls, more glucose leaves the blood than enters it (true). At 3 h glucose is below its starting level, so glucagon secretion is raised (true) and insulin secretion is at its lowest, not its highest. That statement is false: this is negative feedback, each response reversing the change that caused it.',
  },
  {
    t: 'two unnamed hormones identified from how they follow glucose in a table', d: 3, need: 'reason',
    spec: table([{ header: 'Time', unit: 'min' }, { header: 'Glucose', unit: 'mg/dL' }, 'Hormone X', 'Hormone Y'], [[0, 90, 5, 60], [30, 140, 30, 40], [60, 160, 45, 30], [90, 120, 25, 45], [120, 95, 8, 60], [180, 85, 4, 75]]),
    alt: 'A table of six rows: the time in minutes, the blood glucose level, and the levels of two hormones named X and Y.',
    q: 'The table gives the blood glucose level of a healthy person at times after a glucose drink, with the blood levels of two pancreatic hormones, X and Y, in arbitrary units. Which identifies the two hormones?',
    o: [
      ['X is insulin and Y is glucagon', 'correct'],
      ['X is glucagon and Y is insulin', 'matches each hormone with the change it is released to oppose the wrong way round'],
      ['X and Y are two measures of insulin', 'does not see that the two columns move in opposite directions'],
      ['X and Y do not respond to glucose', 'looks only at the first and last rows, where glucose has hardly changed'],
    ],
    holds: ['for each hormone column of the spec\'s table: does it rise whenever glucose rises between rows (insulin-like), or fall whenever glucose rises (glucagon-like)?', (() => {
      const dir = (c: Ctx, j: number): number => { const g = tcol(c, 1); const h = tcol(c, j); const s = g.slice(1).map((v, i) => Math.sign(v - g[i]) * Math.sign(h[i + 1] - h[i])); return s.every((x) => x > 0) ? 1 : s.every((x) => x < 0) ? -1 : 0; };
      return [(c: Ctx) => dir(c, 2) === 1 && dir(c, 3) === -1, (c: Ctx) => dir(c, 2) === -1 && dir(c, 3) === 1, (c: Ctx) => dir(c, 2) === 1 && dir(c, 3) === 1, (c: Ctx) => dir(c, 2) === 0 && dir(c, 3) === 0];
    })()],
    h: ['Insulin is released when blood glucose is high and lowers it; glucagon is released when blood glucose is low and raises it.', 'For each hormone, compare its level in the rows where glucose is highest with its level where glucose is lowest.'],
    s: 'Read from the table: glucose rises from 90 to 160 mg/dL at 60 min and falls back to 85 mg/dL by 180 min. Hormone X rises and falls with it (5, 30, 45, 25, 8, 4): it is released when glucose is high, as insulin is. Hormone Y does the opposite (60, 40, 30, 45, 60, 75): it is lowest when glucose is highest and highest when glucose is lowest, as glucagon is. So X is insulin and Y is glucagon; together they return glucose to its set level by negative feedback.',
  },
]);

// ── mRNA Translation and Protein Synthesis (pack 098) ───────────────────────

G('fe780827.lo-1', 'A reading frame that has to be found, and the code read backwards', [
  {
    t: 'length of the peptide when the frame is not marked and a stop triplet lies out of frame', d: 3, need: 'reason',
    spec: strip([['mRNA', 'GCAUGCCUAAAUGGUAGCA']]),
    alt: 'One row of nineteen bases named mRNA, labelled 5′ at its left end and 3′ at its right end; no reading frame is marked.',
    q: 'The figure shows an mRNA. Translation begins at the first AUG from the 5′ end and continues, three bases at a time, until the first stop codon in that reading frame; the stop codons are UAA, UAG and UGA. How many amino acids does the peptide contain?',
    n: '4',
    ck: ['seq_translate', { row: 0, strand: 'mrna', want: 'length' }],
    h: ['Find the first AUG reading from the 5′ end; it sets the reading frame and codes for the first amino acid.', 'From there, mark off the bases in threes. A stop triplet only counts if it falls exactly in one of those groups of three.'],
    s: 'Read from the figure, starting at the 5′ end: the first AUG begins at the third base. In that frame the codons are AUG, CCU, AAA, UGG and then UAG, a stop codon. The UAA that can be seen earlier (in CCU AAA) straddles two codons, so it is not read as a stop. Four codons come before the stop, so the peptide has 4 amino acids.',
  },
  {
    t: 'number of coding sequences for a peptide, using only the codons shown', d: 3, need: 'reason',
    spec: S('sequence_strip', { rows: [{ seq: 'AUGGGUGGCUUACUGUAA', name: 'mRNA' }], codons: { row: 0, start: 1 }, aminoAcids: ['Met', 'Gly', 'Gly', 'Leu', 'Leu', 'Stop'] }),
    alt: 'One row of eighteen bases bracketed into six codons from the 5′ end, with the name of an amino acid, or Stop, under each bracket.',
    q: 'The figure shows an mRNA with its codons bracketed and the meaning of each codon written under it. Using only the codons shown in the figure (and the stop codon at the end), how many different mRNA sequences would code for the peptide Met-Gly-Leu-Gly?',
    n: '8',
    calc: ['for each amino acid of Met-Gly-Leu-Gly, the number of different codons the spec prints for it, multiplied together; the printed meanings are checked against seq_translate', (c) => {
      const seq = seqOf(c, 0); const names = c.p.aminoAcids as string[];
      if (c.txt('seq_translate', { row: 0, strand: 'mrna', want: 'chain' }) !== names.filter((x) => x !== 'Stop').join('-')) throw new Error('the printed meanings are not the standard code');
      const codons = new Map<string, Set<string>>();
      names.forEach((nm, i) => codons.set(nm, (codons.get(nm) ?? new Set()).add(seq.slice(3 * i, 3 * i + 3))));
      return ['Met', 'Gly', 'Leu', 'Gly'].reduce((t, nm) => t * codons.get(nm)!.size, 1);
    }],
    h: ['The genetic code is degenerate: look for amino acids that appear under more than one codon in the figure.', 'For each position of the peptide, count the codons in the figure that could be used there, then multiply the counts together.'],
    s: 'Read from the figure: Met is coded by AUG only; Gly by two codons, GGU and GGC; Leu by two codons, UUA and CUG. The peptide Met-Gly-Leu-Gly therefore has 1 × 2 × 2 × 2 = 8 possible coding sequences (each followed by the stop codon). Several codons for one amino acid is what is meant by calling the code degenerate.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP CHEMISTRY
// ════════════════════════════════════════════════════════════════════════════

// ── Reaction Rate Calculations from Data (pack 160) ─────────────────────────

G('3ba7563b.lo-2', 'An average rate found backwards, and across a gap in the record', [
  {
    t: 'the interval over which the average rate has a stated value', d: 3, need: 'calc',
    spec: pgraph('Time (s)', '[A] (M)', [0, 60], 10, [0, 0.8], 0.1, [{ expr: '0.8*2^(-x/20)' }]),
    alt: 'One falling curve on a grid of the concentration of A against time; it falls steeply at first and then more and more gently.',
    q: 'The graph shows the concentration of a reactant A during a reaction. Over which of these intervals is the average rate of consumption of A equal to 0.0050 M/s?',
    o: [
      ['From 40 s to 60 s', 'correct'],
      ['From 0 s to 40 s', 'divides the concentration left at 40 s, 0.20 M, by 40 s'],
      ['From 20 s to 60 s', 'divides the change over this interval, 0.30 M, by 60 s, the time at its end'],
      ['From 0 s to 20 s', 'divides the concentration left at 60 s by the 20 s of this interval'],
    ],
    holds: ['(fall in the curve between the two times, by curve_value) ÷ (length of the interval), against 0.0050 M/s', (() => {
      const is = (t1: number, t2: number) => (c: Ctx) => near((c.num('curve_value', { curve: 0, x: t1 }) - c.num('curve_value', { curve: 0, x: t2 })) / (t2 - t1), 0.005, 1e-9);
      return [is(40, 60), is(0, 40), is(20, 60), is(0, 20)];
    })()],
    h: ['The average rate over an interval is the change in concentration divided by the length of the interval, not by the time at its end.', 'Read the concentration at the start and end of each interval offered and work out the rate for each.'],
    s: 'Read from the graph: [A] is 0.80 M at 0 s, 0.40 M at 20 s, 0.20 M at 40 s and 0.10 M at 60 s. From 40 s to 60 s the concentration falls by 0.10 M in 20 s: 0.10 ÷ 20 = 0.0050 M/s. The other intervals give 0.60 ÷ 40 = 0.015 M/s (0 to 40 s), 0.30 ÷ 40 = 0.0075 M/s (20 to 60 s) and 0.40 ÷ 20 = 0.020 M/s (0 to 20 s).',
  },
  {
    t: 'average rate over an interval whose first part is missing from the record', d: 3, need: 'calc',
    spec: mgraph('position', [{ points: [[10, 0.5], [20, 0.3], [30, 0.2], [40, 0.15], [50, 0.1]], vertexDots: 'none' }], { tRange: [0, 60], yRange: [0, 0.6], tStep: 10, yStep: 0.05, tLabel: 'Time (s)', yLabel: '[A] (M)' }),
    alt: 'One falling line, made of straight pieces that join the readings, on a grid of the concentration of A against time; it begins part of the way along the time axis, not at time zero.',
    q: 'The graph shows the concentration of a reactant A, read every 10 s from t = 10 s onward, with the readings joined by straight lines. The average rate of consumption of A over the first 10 s of the reaction, before the record begins, was 0.030 M/s. What was the average rate of consumption of A over the first 30 s of the reaction, in M/s?',
    n: '0.02',
    calc: ['[A] at t = 0 is the reading at 10 s (series_value) plus 0.030 × 10; the fall from there to the reading at 30 s, divided by 30 s', (c) => round((c.num('series_value', { series: 0, t: 10 }) + 0.03 * 10 - c.num('series_value', { series: 0, t: 30 })) / 30, 6)],
    h: ['Work backwards first: a rate multiplied by a time is a change in concentration. Use it to find the concentration at time zero.', 'Then find the total fall in concentration from time zero to 30 s, and divide by the whole 30 s.'],
    s: 'Read from the graph: [A] is 0.50 M at 10 s and 0.20 M at 30 s. Over the first 10 s the concentration fell by 0.030 M/s × 10 s = 0.30 M, so it started at 0.50 + 0.30 = 0.80 M. Over the first 30 s it fell from 0.80 M to 0.20 M, a change of 0.60 M, so the average rate was 0.60 ÷ 30 = 0.020 M/s.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS
// ════════════════════════════════════════════════════════════════════════════

/** Energies of a ladder, lowest first: hydrogen by the formula, else the spec's own levels. */
const levelsOf = (c: Ctx): number[] => (c.p.hydrogen ? Array.from({ length: (c.p.hydrogen as P).nMax as number }, (_, i) => -13.6 / (i + 1) ** 2) : arr(c.p.levels).map((l) => l.energy as number).sort((a, b) => a - b));
/** The energy given out in each drawn transition, by its label. */
const gaps = (c: Ctx): Array<{ label: string; from: number; to: number; dE: number }> => { const E = levelsOf(c); return arr(c.p.transitions).map((t) => ({ label: t.label as string, from: t.from as number, to: t.to as number, dE: E[(t.from as number) - 1] - E[(t.to as number) - 1] })); };

// ── Bohr Model and Atomic Spectra (pack 201) ────────────────────────────────

G('0938830f.lo-2', 'The level formula used for several levels at once', [
  {
    t: 'the transition closest to a stated photon energy when three level energies must be computed', d: 3, need: 'calc',
    spec: ladder({ hydrogen: { nMax: 5, hide: [3, 4, 5] }, transitions: [{ from: 5, to: 3, label: 'W' }, { from: 4, to: 3, label: 'X' }, { from: 3, to: 2, label: 'Y' }, { from: 5, to: 4, label: 'Z' }] }),
    alt: 'An energy-level ladder for hydrogen with five levels labelled by n; energies are printed for the two lowest only. Four downward arrows, lettered W, X, Y and Z, join pairs of the upper levels.',
    q: 'The diagram shows five energy levels of the hydrogen atom, for which E = −13.6 eV / n²; the energies of the three upper levels are not printed. Which of the lettered transitions releases a photon whose energy is closest to 1.0 eV?',
    o: [
      ['W', 'correct'],
      ['X', 'works out the gaps but picks the next one down, 0.66 eV'],
      ['Y', 'takes the gap between neighbouring levels to have shrunk to about 1 eV by n = 3'],
      ['Z', 'judges by the spacing drawn in the figure instead of by the formula'],
    ],
    holds: pick('E = −13.6/n² for the two levels of each drawn arrow (spec): the label of the arrow whose gap is nearest 1.0 eV', (c) => { const g = gaps(c).map((k) => ({ ...k, off: Math.abs(k.dE - 1) })).sort((a, b) => a.off - b.off); if (g[1].off - g[0].off < 0.05) throw new Error('too close to call'); return g[0].label; }, ['W', 'X', 'Y', 'Z']),
    h: ['Use the formula to find the energy of each level whose value is not printed.', 'The photon energy of a transition is the difference between the energies of the two levels it joins. Work out all four before choosing.'],
    s: 'From E = −13.6 eV / n²: E₂ = −3.40 eV, E₃ = −1.51 eV, E₄ = −0.85 eV and E₅ = −0.54 eV. Read from the diagram which levels each arrow joins: W is 5 to 3, releasing 1.51 − 0.54 = 0.97 eV; X is 4 to 3, 0.66 eV; Y is 3 to 2, 1.89 eV; Z is 5 to 4, 0.31 eV. The one closest to 1.0 eV is W.',
  },
  {
    t: 'total energy released in two transitions drawn end to end', d: 3, need: 'calc',
    spec: ladder({ hydrogen: { nMax: 4, hide: [2, 3, 4] }, transitions: [{ from: 4, to: 2, label: 'X' }, { from: 2, to: 1, label: 'Y' }] }),
    alt: 'An energy-level ladder for hydrogen with four levels labelled by n; an energy is printed for the lowest only. Two downward arrows, X and Y, are drawn one after the other, the second starting on the level where the first ends.',
    q: 'The diagram shows four energy levels of the hydrogen atom, for which E = −13.6 eV / n²; only the lowest energy is printed. An atom makes transition X and then transition Y. What is the total energy released in the two transitions, in eV, to two decimal places?',
    n: '12.75',
    calc: ['sum of the two gaps of the spec\'s arrows by E = −13.6/n²; the second arrow is checked to start where the first ends', (c) => { const g = gaps(c); if (g[0].to !== g[1].from) throw new Error('the arrows are not end to end'); return round(g[0].dE + g[1].dE, 4); }],
    alts: ['each gap rounded to two decimals first, and the single step from the first level to the last', () => [2.55 + 10.2, 13.6 - 0.85]],
    h: ['Read from the diagram which levels each arrow joins, and use the formula for any energy that is not printed.', 'The energy released in a downward transition is the difference between the two level energies. Notice where the atom starts and where it finishes.'],
    s: 'Read from the diagram: X takes the atom from n = 4 to n = 2 and Y from n = 2 to n = 1. From the formula, E₄ = −13.6/16 = −0.85 eV, E₂ = −3.40 eV and E₁ = −13.6 eV. X releases 3.40 − 0.85 = 2.55 eV and Y releases 13.6 − 3.40 = 10.20 eV, a total of 12.75 eV, the same as E₄ − E₁ = 13.6 − 0.85, since the atom ends in the lowest level.',
  },
]);

G('0938830f.lo-4', 'Wavelengths sorted by range, and energies that add where wavelengths do not', [
  {
    t: 'the one transition whose wavelength falls in the visible range', d: 3, need: 'calc',
    spec: ladder({ levels: [{ energy: -9 }, { energy: -5 }, { energy: -3 }, { energy: -2 }], transitions: [{ from: 2, to: 1, label: 'W' }, { from: 3, to: 2, label: 'X' }, { from: 4, to: 3, label: 'Y' }, { from: 4, to: 1, label: 'Z' }] }),
    alt: 'An energy-level ladder with four levels, each printed with its energy in eV, and four downward arrows lettered W, X, Y and Z between different pairs of levels.',
    q: 'The diagram shows four energy levels of an atom and four lettered transitions. Which transition emits visible light, with a wavelength between 400 nm and 700 nm? Use hc = 1240 eV·nm.',
    o: [
      ['X', 'correct'],
      ['W', 'takes a photon energy of 4 eV to lie in the visible range'],
      ['Y', 'picks the smallest energy gap, which gives the longest wavelength, 1240 nm'],
      ['Z', 'picks the largest energy gap, taking more energy to mean a longer wavelength'],
    ],
    holds: pick('λ = 1240 ÷ (gap in eV) for each arrow of the spec: the label of the only one between 400 nm and 700 nm', (c) => { const v = gaps(c).filter((k) => HC / k.dE >= 400 && HC / k.dE <= 700); if (v.length !== 1) throw new Error(`${v.length} visible transitions`); return v[0].label; }, ['X', 'W', 'Y', 'Z']),
    h: ['The energy of each photon is the difference between the energies of the two levels its arrow joins.', 'Convert each photon energy to a wavelength with λ = hc/E, and compare with the range given.'],
    s: 'Read from the diagram: W joins −5 eV to −9 eV, a gap of 4 eV; X joins −3 eV to −5 eV, 2 eV; Y joins −2 eV to −3 eV, 1 eV; Z joins −2 eV to −9 eV, 7 eV. With λ = hc/E: W gives 1240/4 = 310 nm (ultraviolet), X gives 1240/2 = 620 nm (visible), Y gives 1240 nm (infrared) and Z gives 1240/7 ≈ 177 nm (ultraviolet). Only X is between 400 nm and 700 nm.',
  },
  {
    t: 'wavelength of the direct transition from the wavelengths of the two steps', d: 3, need: 'calc',
    spec: ladder({ levels: [{ energy: -7 }, { energy: -3 }, { energy: -2 }, { energy: -1 }], energies: 'none', scale: 'even', transitions: [{ from: 4, to: 2, label: 'X' }, { from: 2, to: 1, label: 'Y' }, { from: 4, to: 1, label: 'Z' }] }),
    alt: 'An energy-level ladder with four levels and no energies printed, and three downward arrows: X and Y drawn end to end, the second starting on the level where the first ends, and Z spanning both in one step.',
    q: 'The diagram shows energy levels of an atom, drawn without their energies and not to scale, and three transitions. The light emitted in transition X has a wavelength of 620 nm and the light emitted in transition Y has a wavelength of 310 nm. What is the wavelength of the light emitted in transition Z, to the nearest nanometre?',
    n: '207',
    calc: ['the spec\'s arrows: Z starts where X starts and ends where Y ends, and X ends where Y starts, so E(Z) = hc/620 + hc/310; λ(Z) = hc ÷ that. The hidden level energies are checked to give the two stated wavelengths', (c) => {
      const g = gaps(c); const [X, Y, Z] = ['X', 'Y', 'Z'].map((l) => g.find((k) => k.label === l)!);
      if (X.to !== Y.from || Z.from !== X.from || Z.to !== Y.to || !near(HC / X.dE, 620) || !near(HC / Y.dE, 310)) throw new Error('the arrows or energies do not match the stem');
      return Math.round(HC / (HC / 620 + HC / 310));
    }],
    alts: ['by reciprocals of the wavelengths, in eV with hc = 1240 eV·nm, and in joules with h = 6.63 × 10⁻³⁴ J·s', () => [1 / (1 / 620 + 1 / 310), 1240 / 6, ((6.63e-34 * 3.0e8) / (6 * 1.6e-19)) * 1e9]],
    h: ['The photon energies, not the wavelengths, add up: compare where Z starts and ends with where X starts and Y ends.', 'Since E = hc/λ, adding energies means adding the reciprocals of the wavelengths.'],
    s: 'Read from the diagram: X ends on the level where Y begins, and Z goes in one step from the level where X begins to the level where Y ends. So the energy of Z is the sum of the other two: hc/λ(Z) = hc/620 + hc/310. Then 1/λ(Z) = 1/620 + 1/310 = 3/620 per nm, so λ(Z) = 620/3 ≈ 207 nm. (In energies: 2 eV + 4 eV = 6 eV.) The wavelengths themselves do not add.',
  },
]);

// ── Centripetal Acceleration and Force (pack 219) ───────────────────────────

G('4b275527.lo-4', 'Friction as the centripetal force, read from graphs', [
  {
    t: 'difference in greatest safe speed on two bends from force-against-speed-squared lines and a friction limit', d: 3, need: 'calc',
    spec: pgraph('Speed squared, v² (m²/s²)', 'Friction force needed (kN)', [0, 2000], 400, [0, 8], 1, [{ expr: '0.015x', label: 'bend P' }, { expr: '0.00375x', label: 'bend Q', dashed: true }], { asymptotes: [{ y: 6, label: 'friction limit' }] }),
    alt: 'Two straight lines through the origin on a grid of friction force needed against speed squared: a steep solid line for bend P and a less steep dashed line for bend Q. A level guide line marks the friction limit, and each line crosses it on a gridline.',
    q: 'The graph shows the sideways friction force that a car needs in order to follow each of two flat, level bends, P and Q, plotted against the SQUARE of its speed. The road can supply at most the force marked by the guide line labelled friction limit. How much faster, in m/s, can the car go round bend Q than round bend P without sliding?',
    n: '20',
    calc: ['v² where each of the spec\'s lines reaches the limit (bisection), square-rooted, then subtracted', (c) => { const lim = (arr(c.p.asymptotes)[0].y as number); return round(Math.sqrt(solve(fOf(c, 1), lim, 0, 2000)) - Math.sqrt(solve(fOf(c, 0), lim, 0, 2000)), 4); }],
    h: ['The car is at its greatest safe speed on a bend when the force it needs equals the limit. Read where each line reaches the limit.', 'The horizontal axis is the square of the speed: take the square root of each reading before you compare the two speeds.'],
    s: 'Read from the graph: the limit is 6 kN. The line for bend P reaches 6 kN at v² = 400 m²/s², so the greatest speed there is √400 = 20 m/s. The line for bend Q reaches 6 kN at v² = 1600 m²/s², so the greatest speed there is √1600 = 40 m/s. The car can go 40 − 20 = 20 m/s faster round bend Q, the wider bend, where the same friction force keeps it on a circle at a higher speed.',
  },
  {
    t: 'tightest bend at twice the speed, from a force-against-radius curve for the original speed', d: 3, need: 'calc',
    spec: pgraph('Radius of bend (m)', 'Friction force needed (N)', [0, 60], 5, [0, 700], 100, [{ expr: '6000/x', domain: [10, 60], from: 'none', to: 'none' }]),
    alt: 'One falling curve on a grid of friction force needed against radius of bend: the force is large for tight bends and falls away as the radius grows.',
    q: 'A cyclist rides at one constant speed round flat bends of different radius; the graph shows the sideways friction force she needs against the radius of the bend. Her tyres can supply at most 400 N. She now rides at TWICE that speed. What is the radius, in metres, of the tightest bend she can then take without sliding?',
    n: '60',
    calc: ['at twice the speed the force at every radius is 4 times the spec\'s curve: the radius at which the curve is 400 ÷ 4 N (bisection)', (c) => round(solve(fOf(c), 400 / 4, 10, 60), 4)],
    h: ['At a given radius, the inward force needed is proportional to the square of the speed. Decide by what factor the force at every radius changes when the speed doubles.', 'The new force must not exceed 400 N. Work out what the OLD force at that radius must have been, and read its radius from the graph.'],
    s: 'The friction force is the centripetal force, mv²/r. Doubling the speed makes the force needed at every radius 4 times as large. For the new force to be no more than 400 N, the force shown on the graph (for the old speed) must be no more than 400 ÷ 4 = 100 N. Read from the graph: the curve is at 100 N at a radius of 60 m. So the tightest bend she can take at twice the speed has a radius of 60 m (at the old speed it was 15 m).',
  },
]);

G('4b275527.lo-2', 'Centripetal acceleration from the slope and beyond the graph', [
  {
    t: 'ratio of two angular velocities from lines of acceleration against distance from the centre', d: 3, need: 'calc',
    spec: pgraph('Distance from the centre (m)', 'Centripetal acceleration (m/s²)', [0, 1], 0.25, [0, 10], 2, [{ expr: '4x', label: 'P' }, { expr: '16x', label: 'Q', dashed: true }]),
    alt: 'Two straight lines through the origin on a grid of centripetal acceleration against distance from the centre: a solid line P and a much steeper dashed line Q.',
    q: 'Two platforms, P and Q, each turn at a steady rate. The graph shows the centripetal acceleration of points on each platform against their distance from its centre. How many times as large as the angular velocity of platform P is the angular velocity of platform Q?',
    n: '2',
    calc: ['√(slope of Q ÷ slope of P), the slopes by curve_slope between grid points: each slope is ω²', (c) => round(Math.sqrt(c.num('curve_slope', { curve: 1, x1: 0, x2: 0.5 }) / c.num('curve_slope', { curve: 0, x1: 0, x2: 1 })), 6)],
    h: ['For a point on a turning platform, the centripetal acceleration is the square of the angular velocity times the distance from the centre: the slope of each line is the square of that platform\'s angular velocity.', 'Find the slope of each line from a grid point, take the ratio of the slopes, and remember that a slope here is the square of an angular velocity.'],
    s: 'For points on one platform a = ω²r, so each line has slope ω². Read from the graph: P passes through (1.0, 4), slope 4 s⁻², so ω = 2 rad/s; Q passes through (0.5, 8), slope 16 s⁻², so ω = 4 rad/s. The angular velocity of Q is 4 ÷ 2 = 2 times that of P (its slope is 4 times as large, and √4 = 2).',
  },
  {
    t: 'acceleration at a speed beyond the graph, the radius being found from one reading', d: 3, need: 'calc',
    spec: pgraph('Speed (m/s)', 'Centripetal acceleration (m/s²)', [0, 6], 1, [0, 20], 2, [{ expr: 'x^2/2' }]),
    alt: 'One curve on a grid of centripetal acceleration against speed; it starts at the origin and rises more and more steeply, ending inside the grid at the right-hand edge.',
    q: 'An object is moved round the same circle at different steady speeds; the graph shows its centripetal acceleration against its speed. What is its centripetal acceleration, in m/s², at a speed of 10 m/s?',
    n: '50',
    calc: ['radius = v²/a at a grid point of the spec\'s curve (curve_value at 4 m/s, checked at 2 m/s), then 10²/radius', (c) => { const r = 16 / c.num('curve_value', { curve: 0, x: 4 }); if (!near(4 / c.num('curve_value', { curve: 0, x: 2 }), r)) throw new Error('the curve is not v²/r'); return round(100 / r, 6); }],
    h: ['The speed asked about is beyond the graph, so use the formula for centripetal acceleration in terms of speed and radius. Read one point on the curve to find the radius of the circle.', 'With the radius known, work out the acceleration at the new speed; or use the fact that, on one circle, the acceleration is proportional to the square of the speed.'],
    s: 'Read from the graph: at 4 m/s the acceleration is 8 m/s². From a = v²/r the radius is r = 4²/8 = 2 m. At 10 m/s the acceleration is 10²/2 = 50 m/s². (Equivalently, the speed is 2.5 times as large, so the acceleration is 2.5² = 6.25 times as large: 6.25 × 8 = 50.)',
  },
]);

G('4b275527.lo-3', 'The inward force worked backwards, and a faulty reading found', [
  {
    t: 'the time at which the inward force reaches a stated value, from a speed–time graph', d: 3, need: 'calc',
    spec: mgraph('velocity', [{ points: [[0, 2], [2, 2], [8, 8]], vertexDots: 'none' }], { tRange: [0, 9], yRange: [0, 10], tStep: 1, yStep: 1, yLabel: 'Speed (m/s)' }),
    alt: 'A speed–time graph with one line: level for the first part of the time, then rising steadily.',
    q: 'A cart of mass 0.40 kg moves round a circular track of radius 0.80 m; the graph shows its speed. At what time, in seconds, does the net inward force needed to keep it on the track reach 18 N?',
    n: '6',
    calc: ['the speed at which m·v²/r = 18 N, then the one time at which the spec\'s line is at that speed (series_crossing)', (c) => c.num('series_crossing', { series: 0, value: Math.sqrt((18 * 0.80) / 0.40), want: 'only' })],
    h: ['Use the formula for the net inward force in terms of mass, speed and radius to find the speed at which the force has the value given.', 'Then read from the graph the time at which the cart has that speed.'],
    s: 'From F = mv²/r, the speed at which the inward force is 18 N satisfies v² = Fr/m = 18 × 0.80 ÷ 0.40 = 36, so v = 6 m/s. Read from the graph: the speed is 2 m/s until t = 2 s and then rises by 1 m/s each second, reaching 6 m/s at t = 6 s. So the inward force reaches 18 N at t = 6 s.',
  },
  {
    t: 'the tension one trial should have shown, found from the mass the other trials agree on', d: 3, need: 'calc',
    spec: table(['Trial', { header: 'Radius', unit: 'm' }, { header: 'Speed', unit: 'm/s' }, { header: 'Tension', unit: 'N' }], [[1, '0.50', '2.0', '4.0'], [2, '0.50', '4.0', '16.0'], [3, '1.00', '4.0', '8.0'], [4, '0.25', '3.0', '12.0']]),
    alt: 'A table of four numbered trials giving the radius of the circle, the speed of the puck and the tension in the string.',
    q: 'A puck on a frictionless table is whirled on a string in level circles, so that the tension in the string is the net inward force on it. The table lists four trials with the same puck; in one of them the tension was recorded wrongly. What should that tension reading have been, in newtons?',
    n: '18',
    calc: ['mass = T·r/v² for each row of the spec\'s table; three rows agree, and the fourth row\'s tension is recomputed with their mass', (c) => {
      const r = tcol(c, 1); const v = tcol(c, 2); const T = tcol(c, 3); const m = T.map((t, i) => (t * r[i]) / v[i] ** 2);
      const odd = m.map((x, i) => i).filter((i) => m.filter((y) => near(y, m[i], 1e-9)).length === 1);
      const good = m.find((x) => m.filter((y) => near(y, x, 1e-9)).length === 3);
      if (odd.length !== 1 || good === undefined) throw new Error('not exactly one row out of line');
      return round((good * v[odd[0]] ** 2) / r[odd[0]], 6);
    }],
    h: ['The net inward force is mv²/r. The puck is the same in every trial, so every correct row must give the same mass.', 'Work out Tr/v² for each row; three rows agree. Use their value to find what the tension in the remaining row should be.'],
    s: 'For circular motion T = mv²/r, so m = Tr/v². Read from the table: trial 1 gives 4.0 × 0.50 ÷ 2.0² = 0.50 kg; trial 2 gives 16.0 × 0.50 ÷ 4.0² = 0.50 kg; trial 3 gives 8.0 × 1.00 ÷ 4.0² = 0.50 kg; trial 4 gives 12.0 × 0.25 ÷ 3.0² = 0.33 kg. Trial 4 is the wrong one. With m = 0.50 kg its tension should be 0.50 × 3.0² ÷ 0.25 = 18 N.',
  },
]);

// ── Centripetal Force Sources (pack 246) ────────────────────────────────────

G('c0ef80f3.lo-4', 'Speeds from forces that have to be read first', [
  {
    t: 'gain in speed between two times, from a tension–time graph', d: 3, need: 'calc',
    spec: pgraph('Time (s)', 'Tension in the string (N)', [0, 5], 1, [0, 25], 5, [{ expr: '5x' }]),
    alt: 'A straight line through the origin on a grid of tension in the string against time, rising steadily to the upper right corner.',
    q: 'A puck of mass 0.25 kg circles on a frictionless table at the end of a string of length 0.80 m, and is made to go steadily faster; the graph shows the tension in the string, which is the only force on the puck along the table. How much faster, in m/s, is the puck moving at t = 4 s than at t = 1 s?',
    n: '4',
    calc: ['v = √(T·r/m) with the tension read from the spec\'s line (curve_value) at each of the two times, then subtracted', (c) => round(Math.sqrt((c.num('curve_value', { curve: 0, x: 4 }) * 0.80) / 0.25) - Math.sqrt((c.num('curve_value', { curve: 0, x: 1 }) * 0.80) / 0.25), 6)],
    h: ['The tension is the centripetal force. Write the formula that joins it to the mass, the speed and the radius, and rearrange it for the speed.', 'Read the tension at each of the two times, find the speed at each, and subtract. The speed is not proportional to the tension.'],
    s: 'From T = mv²/r, v = √(Tr/m). Read from the graph: the tension is 5 N at t = 1 s and 20 N at t = 4 s. At 1 s: v = √(5 × 0.80 ÷ 0.25) = √16 = 4 m/s. At 4 s: v = √(20 × 0.80 ÷ 0.25) = √64 = 8 m/s. The puck is 8 − 4 = 4 m/s faster. Four times the tension gives only twice the speed.',
  },
  {
    t: 'difference between the fastest and the slowest of four tabulated circular motions', d: 3, need: 'calc',
    spec: table(['Trial', { header: 'Mass', unit: 'kg' }, { header: 'Radius', unit: 'm' }, { header: 'Inward force', unit: 'N' }], [[1, '0.20', '0.50', '10'], [2, '0.50', '1.00', '18'], [3, '0.40', '0.80', '8'], [4, '1.00', '0.25', '100']]),
    alt: 'A table of four numbered trials giving the mass of the object, the radius of its circle and the net inward force on it.',
    q: 'The table lists four trials in which an object moved in a level circle at a steady speed under the net inward force shown. By how many m/s was the fastest of the four objects moving faster than the slowest?',
    n: '2',
    calc: ['v = √(F·r/m) for each row of the spec\'s table; greatest minus least', (c) => { const m = tcol(c, 1); const r = tcol(c, 2); const F = tcol(c, 3); const v = F.map((f, i) => Math.sqrt((f * r[i]) / m[i])); return round(Math.max(...v) - Math.min(...v), 6); }],
    h: ['Rearrange the formula for centripetal force to give the speed, and work it out for every trial; none of the three columns alone tells you which object is fastest.', 'Then subtract the smallest speed from the largest.'],
    s: 'From F = mv²/r, v = √(Fr/m). Read from the table: trial 1 gives √(10 × 0.50 ÷ 0.20) = √25 = 5 m/s; trial 2 gives √(18 × 1.00 ÷ 0.50) = √36 = 6 m/s; trial 3 gives √(8 × 0.80 ÷ 0.40) = √16 = 4 m/s; trial 4 gives √(100 × 0.25 ÷ 1.00) = √25 = 5 m/s. The fastest (trial 2) is 6 − 4 = 2 m/s faster than the slowest (trial 3), although trial 4 has by far the largest force.',
  },
]);

G('c0ef80f3.lo-1', 'Velocity and net force a quarter of a revolution apart', [
  {
    t: 'the false statement about the velocity and the net force now and a quarter turn later', d: 3, need: 'reason',
    spec: S('mechanics_setup', { variant: 'circular', position: 90, direction: 'counterclockwise', arrows: ['velocity'] }),
    alt: 'A top view of a circle with an object at its highest point on the page and a velocity arrow drawn along the tangent there.',
    q: 'The figure is a top view of an object moving round a circle at a steady speed; the arrow shows its velocity at the instant shown. Which statement is FALSE?',
    o: [
      ['A quarter of a revolution later, its velocity points toward the top of the page', 'correct'],
      ['At the instant shown, the net force on it points toward the bottom of the page', 'takes the net force to point along the velocity or away from the centre'],
      ['A quarter of a revolution later, the net force on it points toward the right of the page', 'moves the object a quarter turn the wrong way round the circle'],
      ['The net force does not change its speed, only its direction', 'thinks any net force must change the speed'],
    ],
    holds: falseOne('from the spec\'s position and sense of rotation: velocity along the tangent, net force toward the centre, now and 90° further round', (() => {
      const g = (c: Ctx, quarter: number) => { const s = c.p.direction === 'clockwise' ? -1 : 1; const a = rad((c.p.position as number) + s * 90 * quarter); return { v: [Math.round(-s * Math.sin(a)), Math.round(s * Math.cos(a))], f: [Math.round(-Math.cos(a)), Math.round(-Math.sin(a))] }; };
      const same = (u: number[], w: number[]) => u[0] === w[0] && u[1] === w[1];
      return [(c: Ctx) => same(g(c, 1).v, [0, 1]), (c: Ctx) => same(g(c, 0).f, [0, -1]), (c: Ctx) => same(g(c, 1).f, [1, 0]), (c: Ctx) => g(c, 0).v[0] * g(c, 0).f[0] + g(c, 0).v[1] * g(c, 0).f[1] === 0];
    })()),
    h: ['From the velocity arrow, decide which way round the circle the object is going, and so where it will be a quarter of a revolution later.', 'At every point the velocity is along the tangent, and the net force on an object in uniform circular motion points to the centre of the circle.'],
    s: 'Read from the figure: the object is at the top of the circle and moving to the left, so it is going round counterclockwise. The net (centripetal) force points to the centre, which is toward the bottom of the page at this instant (true). A quarter of a revolution later the object is at the left of the circle: the centre is then to its right (true), and its velocity, along the tangent, points toward the BOTTOM of the page, not the top. That statement is false. The force is always perpendicular to the velocity, so it changes the direction of motion and not the speed (true).',
  },
]);

// ── Circular Orbit Problems (pack 209) ──────────────────────────────────────

G('1b6f7e6b.lo-2', 'The orbit condition applied to tabulated orbits and to a force curve', [
  {
    t: 'speed of a satellite from two other orbits round the same planet', d: 3, need: 'calc',
    spec: table(['Satellite', { header: 'Orbit radius', unit: '10⁶ m' }, { header: 'Speed', unit: 'km/s' }], [['P', 4, 10], ['Q', 16, '?'], ['R', 100, 2]]),
    alt: 'A table of three rows, for satellites P, Q and R, giving the radius of each orbit and its speed; the speed of Q is a boxed question mark.',
    q: 'Three satellites, P, Q and R, move in circular orbits round the same planet, each held in orbit by the planet\'s gravity alone. The table gives the radius of each orbit, measured from the centre of the planet, and the speeds of two of the satellites. What is the speed of satellite Q, in km/s?',
    n: '5',
    calc: ['GMm/r² = mv²/r gives v²r = GM for every satellite: the constant from the two complete rows of the spec\'s table (checked equal), then v for the row with the "?"', (c) => {
      const rows = c.p.rows as unknown[][]; const full = rows.filter((r) => r[2] !== '?'); const gm = full.map((r) => N(r[2]) ** 2 * N(r[1]));
      const q = rows.filter((r) => r[2] === '?');
      if (q.length !== 1 || !gm.every((x) => near(x, gm[0]))) throw new Error('the rows do not share one v²r');
      return round(Math.sqrt(gm[0] / N(q[0][1])), 6);
    }],
    h: ['For a circular orbit the gravitational force is the centripetal force. Write that equation, simplify it, and see which combination of speed and radius is the same for every satellite of one planet.', 'Use satellite P to find the value of that combination, check it against R, and apply it to Q.'],
    s: 'Setting GMm/r² = mv²/r, the mass of the satellite cancels and v²r = GM, the same for every satellite of this planet. Read from the table: for P, v²r = 10² × 4 = 400; for R, 2² × 100 = 400, the same (in the units of the table). For Q: v² × 16 = 400, so v² = 25 and v = 5 km/s. Four times the orbit radius gives half the speed.',
  },
  {
    t: 'ratio of orbital speeds at two distances, from a graph of the gravitational force', d: 3, need: 'calc',
    spec: pgraph('Distance from the planet\'s centre (10⁶ m)', 'Gravitational force on the satellite (N)', [0, 20], 4, [0, 2500], 500, [{ expr: '128000/x^2', domain: [8, 20], from: 'none', to: 'none' }]),
    alt: 'One falling curve on a grid of gravitational force against distance from the centre of the planet; it falls steeply and then more gently.',
    q: 'The graph shows the gravitational force of a planet on one satellite against the satellite\'s distance from the centre of the planet. The satellite is put into a circular orbit, held by gravity alone, first at a distance of 8 × 10⁶ m and later at 16 × 10⁶ m. What is (speed in the larger orbit) ÷ (speed in the smaller orbit), to two decimal places?',
    n: '0.71',
    calc: ['F = mv²/r gives v² = F·r/m: √((F·r at 16) ÷ (F·r at 8)) with the forces read from the spec\'s curve (curve_value)', (c) => round(Math.sqrt((c.num('curve_value', { curve: 0, x: 16 }) * 16) / (c.num('curve_value', { curve: 0, x: 8 }) * 8)), 4)],
    alts: ['the two speeds worked out separately for an assumed satellite mass and rounded to three figures', () => [Math.SQRT1_2, 5.66 / 8.0, 566 / 800]],
    h: ['In a circular orbit the gravitational force read from the graph is the centripetal force. So the square of the speed is proportional to (force × radius) for this one satellite.', 'Read the force at each of the two distances, form force × radius for each, and take the square root of their ratio.'],
    s: 'For a circular orbit F = mv²/r, so v² = Fr/m. Read from the graph: the force is 2000 N at 8 × 10⁶ m and 500 N at 16 × 10⁶ m. The products Fr are 2000 × 8 = 16 000 and 500 × 16 = 8000 (in the units of the graph), so v² in the larger orbit is half of v² in the smaller one. The ratio of the speeds is √(1/2) ≈ 0.71.',
  },
]);

// ── Doppler Shifts and Frequency Changes (pack 236) ─────────────────────────

G('9b765c71.lo-2', 'Higher or lower, decided from records of the motion', [
  {
    t: 'the false statement about a record of the frequency heard as a horn passes', d: 3, need: 'reason',
    spec: mgraph('position', [{ points: [[0, 550], [3, 550], [5, 450], [8, 450]], vertexDots: 'none' }], { tRange: [0, 9], yRange: [400, 600], tStep: 1, yStep: 50, yLabel: 'Frequency heard (Hz)' }),
    alt: 'A line graph of the frequency heard against time: level at a higher value, then dropping over a short interval, then level at a lower value.',
    q: 'A car sounding a steady horn drives along a straight road past a person standing beside the road. The graph shows the frequency the person hears. Which statement is FALSE?',
    o: [
      ['While the car was coming nearer, the frequency heard kept rising', 'correct'],
      ['The car was moving toward the person during the first 3 s', 'takes a frequency that is not changing to mean a car that is not approaching'],
      ['The horn itself emits a frequency between 450 Hz and 550 Hz', 'takes the frequency heard on the approach as the frequency emitted'],
      ['During the last 3 s the car was moving away from the person', 'takes the low, steady frequency to mean the car had stopped'],
    ],
    holds: falseOne('from the spec\'s line (series_value / series_slope): heard above the emitted frequency means approaching, below it receding, and the emitted frequency lies between the two level values', [
      (c) => c.num('series_slope', { series: 0, t1: 0, t2: 3 }) > 0,
      (c) => c.num('series_value', { series: 0, t: 1 }) > c.num('series_value', { series: 0, t: 7 }) && c.num('series_slope', { series: 0, t1: 0, t2: 3 }) === 0,
      (c) => c.num('series_value', { series: 0, t: 7 }) === 450 && c.num('series_value', { series: 0, t: 1 }) === 550,
      (c) => c.num('series_value', { series: 0, t: 7 }) < c.num('series_value', { series: 0, t: 1 }) && c.num('series_slope', { series: 0, t1: 5, t2: 8 }) === 0,
    ]),
    h: ['A source that approaches is heard at a frequency above the one it emits; a source that moves away is heard at a frequency below it.', 'How far away the source is affects how loud it sounds, not the frequency heard. Check each statement against the level parts of the graph.'],
    s: 'Read from the graph: the frequency heard is steady at 550 Hz for the first 3 s, drops between 3 s and 5 s, and is steady at 450 Hz for the last 3 s. A frequency above the emitted one means the car was approaching (first 3 s); one below it means the car was moving away (last 3 s); the emitted frequency lies between the two. During the approach the frequency did NOT keep rising: it stayed level at 550 Hz, since the shift depends on the motion of the source, not on its distance. That statement is false.',
  },
  {
    t: 'total time a raised frequency is heard, from a position–time graph with a turn-round', d: 3, need: 'reason',
    spec: mgraph('position', [{ points: [[0, 0], [6, 120], [10, 40]], vertexDots: 'none' }], { tRange: [0, 11], yRange: [0, 140], tStep: 1, yStep: 20, yLabel: 'Position of the car (m)' }),
    alt: 'A position–time graph with one line in two straight pieces: it rises steadily to a highest point and then falls steadily, more steeply.',
    q: 'A car sounding a steady horn moves along a straight road; the graph shows its position. A person stands beside the road at the 60 m mark. For how many seconds, in total, during the 10 s shown does the person hear a frequency HIGHER than the one the horn emits?',
    n: '6',
    calc: ['the spec\'s line cut at the times it is at 60 m (series_crossing) and at its corners; on each piece the car approaches when (60 − position) and the velocity have the same sign; the approaching pieces added up', (c) => {
      const pts = ptsOf(c); const cross = c.txt('series_crossing', { series: 0, value: 60, want: 'all' }).split(',').map((v) => N(v.trim()));
      const cuts = [...new Set([...pts.map((p) => p[0]), ...cross])].sort((a, b) => a - b);
      const at = (t: number) => { const i = pts.findIndex((p, k) => k < pts.length - 1 && t >= p[0] && t <= pts[k + 1][0]); const [a, b] = [pts[i], pts[i + 1]]; return { x: a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0]), v: (b[1] - a[1]) / (b[0] - a[0]) }; };
      let total = 0;
      for (let i = 0; i < cuts.length - 1; i++) { const m = at((cuts[i] + cuts[i + 1]) / 2); if ((60 - m.x) * m.v > 0) total += cuts[i + 1] - cuts[i]; }
      return round(total, 6);
    }],
    h: ['The frequency heard is higher than the emitted one whenever the car is moving TOWARD the person, whichever way along the road that is.', 'Find the times at which the car is at the person\'s position, and the time at which it turns round; then decide, for each stretch of the motion, whether the car is approaching or moving away.'],
    s: 'Read from the graph: the car moves forward from 0 m, passes the 60 m mark at t = 3 s, reaches 120 m at t = 6 s, turns back, passes the 60 m mark again at t = 9 s and is at 40 m at t = 10 s. It is approaching the person from 0 to 3 s and again, after turning round, from 6 to 9 s; it is moving away from 3 to 6 s and from 9 to 10 s. The frequency heard is higher than the emitted one while it approaches: 3 + 3 = 6 s.',
  },
]);

// ── Faraday's and Lenz's Laws (pack 240) ────────────────────────────────────

G('ae321f2b.lo-1', 'Flux from a changing field and from a changing angle', [
  {
    t: 'the false statement about flux, change of flux and rate of change, from a field–time graph', d: 3, need: 'reason',
    spec: mgraph('position', [{ points: [[0, 0], [2, 0.4], [5, 0.4], [6, 0]], vertexDots: 'none' }], { tRange: [0, 7], yRange: [0, 0.5], tStep: 1, yStep: 0.1, yLabel: 'Magnetic field (T)' }),
    alt: 'A line graph of magnetic field against time: the line rises from zero, runs level for a while, and then returns to zero.',
    q: 'A flat loop of area 0.50 m² lies with its plane perpendicular to a uniform magnetic field; the graph shows how the strength of the field changes. Which statement is FALSE?',
    o: [
      ['The flux through the loop changes at the same rate between 0 and 2 s as between 5 s and 6 s', 'correct'],
      ['The flux through the loop is 0.20 Wb at t = 3 s', 'does not multiply the field by the area of the loop'],
      ['The flux through the loop is not changing between 2 s and 5 s', 'takes a field that is present to mean a flux that is changing'],
      ['The flux through the loop changes by the same amount between 0 and 2 s as between 5 s and 6 s', 'compares the slopes of the two parts instead of the changes'],
    ],
    holds: falseOne('flux = field × 0.50 m² with the field from the spec\'s line (series_value / series_slope)', (() => {
      const A = 0.5; const B = (c: Ctx, t: number) => c.num('series_value', { series: 0, t });
      return [
        (c: Ctx) => near(Math.abs(c.num('series_slope', { series: 0, t1: 0, t2: 2 })), Math.abs(c.num('series_slope', { series: 0, t1: 5, t2: 6 }))),
        (c: Ctx) => near(B(c, 3) * A, 0.20),
        (c: Ctx) => c.num('series_slope', { series: 0, t1: 2, t2: 5 }) === 0,
        (c: Ctx) => near(Math.abs(B(c, 2) - B(c, 0)) * A, Math.abs(B(c, 6) - B(c, 5)) * A),
      ];
    })()),
    h: ['With the field perpendicular to the plane of the loop, the flux is the field multiplied by the area.', 'A change in flux is one thing and the rate of change is another: for the rate, divide the change by the time it takes.'],
    s: 'With the field perpendicular to the loop, Φ = BA. Read from the graph: B rises from 0 to 0.40 T in the first 2 s, stays at 0.40 T until 5 s and falls to 0 by 6 s. At 3 s, Φ = 0.40 × 0.50 = 0.20 Wb, and it does not change between 2 s and 5 s. The flux changes by 0.20 Wb in both the rise and the fall, but the rise takes 2 s (0.10 Wb/s) and the fall takes 1 s (0.20 Wb/s). The statement that the rates are the same is false.',
  },
  {
    t: 'change of flux between two positions of the PLANE, from a graph against the angle of the normal', d: 3, need: 'reason',
    spec: pgraph('Angle between field and normal to loop (°)', 'Flux through the loop (Wb)', [0, 180], 30, [-0.6, 0.6], 0.1, [{ expr: '0.6*cos(pi*x/180)' }]),
    alt: 'One smooth curve on a grid of flux against angle: it starts at its highest value at zero angle, falls through zero in the middle of the range and ends at its lowest value.',
    q: 'A flat loop is turned in a uniform magnetic field. The graph shows the flux through the loop against the angle between the field and the NORMAL to the loop. By how many webers does the flux through the loop decrease when the loop is turned from having its plane perpendicular to the field to having its plane at 30° to the field?',
    n: '0.3',
    calc: ['plane perpendicular to the field is normal at 0°; plane at 30° to the field is normal at 60°: the fall of the spec\'s curve between them (curve_value)', (c) => round(c.num('curve_value', { curve: 0, x: 0 }) - c.num('curve_value', { curve: 0, x: 90 - 30 }), 6)],
    h: ['The angle on the graph is measured to the normal of the loop, which is perpendicular to its plane. Convert each position of the PLANE into an angle of the normal.', 'Read the flux at the two angles you find and subtract.'],
    s: 'The normal is perpendicular to the plane of the loop. When the plane is perpendicular to the field, the normal is along the field: angle 0°. When the plane is at 30° to the field, the normal is at 90° − 30° = 60° to it. Read from the graph: the flux is 0.60 Wb at 0° and 0.30 Wb at 60°. The flux decreases by 0.60 − 0.30 = 0.30 Wb.',
  },
]);

// ── Free-Body Diagrams and Net Force (pack 257) ─────────────────────────────

G('ef1b68d3.lo-2', 'Directions as angles, for forces that are not drawn', [
  {
    t: 'direction of the third force that balances two drawn forces', d: 3, need: 'reason',
    spec: fbd([{ label: 'A', direction: 30, magnitude: 40, showAngle: true }, { label: 'B', direction: 150, magnitude: 40, showAngle: true }], { object: { shape: 'dot' }, axes: 'standard' }),
    alt: 'Two force arrows of equal size from a dot, one up and to the right and one up and to the left, each at the same marked angle above the horizontal, with a small x–y axis indicator.',
    q: 'The diagram shows two forces acting on a particle; each marked angle is measured from the horizontal. A third force, not drawn, keeps the particle in equilibrium. What is the direction of the third force, as an angle measured counter-clockwise from the positive x-axis, in degrees?',
    n: '270',
    calc: ['the direction opposite to the sum of the two drawn forces (fbd2_net_force along x and y), as an angle from 0° to 360°', (c) => { const x = c.num('fbd2_net_force', { axis: 'x' }); const y = c.num('fbd2_net_force', { axis: 'y' }); return round(((Math.atan2(-y, -x) * 180) / Math.PI + 360) % 360, 4); }],
    h: ['Find the combined effect of the two forces drawn: compare their horizontal parts and their vertical parts.', 'The third force must cancel that combined force exactly, so it points the opposite way. Express that direction as an angle from the positive x-axis, going counter-clockwise.'],
    s: 'Read from the diagram: both forces are 40 N; A is 30° above the horizontal on the right and B is 30° above the horizontal on the left. Their horizontal parts are equal and opposite and cancel; their vertical parts both point up. The two forces together are therefore a single force straight up (90°). The third force must be equal and opposite to it: straight down, which is 270° counter-clockwise from the positive x-axis.',
  },
  {
    t: 'direction, as an angle, of the kinetic friction that is missing from an incline diagram', d: 3, need: 'reason',
    spec: fbd([{ label: 'N', direction: 'normal' }, { label: 'W', direction: 'down' }], { incline: { angle: 25 }, lengths: 'equal', axes: 'standard' }),
    alt: 'A block on an incline that rises to the right, with its angle marked at the foot, a force arrow N perpendicular to the surface, a force arrow W straight down, and a small x–y axis indicator.',
    q: 'The diagram shows two of the forces on a block that is sliding UP a rough incline; the kinetic friction force on the block is not drawn. What is the direction of the friction force, as an angle measured counter-clockwise from the positive x-axis, in degrees?',
    n: '205',
    calc: ['the incline of the spec rises to the right at its angle: up-slope is that angle from +x, and friction on a block sliding up points down-slope, 180° further round', (c) => ((c.p.incline as P).angle as number) + 180],
    h: ['Kinetic friction acts along the surface, opposite to the direction in which the block is sliding.', 'Find the angle that the up-slope direction makes with the positive x-axis from the angle of the incline; the opposite direction is half a turn further round.'],
    s: 'Read from the diagram: the incline rises to the right at 25° to the horizontal, so the up-slope direction is at 25° counter-clockwise from the positive x-axis. The block is sliding up the slope, so kinetic friction acts down the slope, the opposite direction: 25° + 180° = 205°.',
  },
]);

// ── Inclined-Plane Forces and Motion (pack 204) ─────────────────────────────

G('111ba11a.lo-1', 'A free-body diagram carried from one stage of the motion to the next', [
  {
    t: 'the change that makes a pulled-up diagram right for the slide back down', d: 3, need: 'reason',
    spec: fbd([{ label: 'P', direction: 'normal' }, { label: 'Q', direction: 'up-slope' }, { label: 'R', direction: 'down-slope' }, { label: 'S', direction: 'down' }], { incline: { angle: 30 }, lengths: 'equal' }),
    alt: 'A block on an incline with four lettered force arrows of equal length: one perpendicular to the surface, one up the slope, one down the slope and one straight down.',
    q: 'The free-body diagram shows the four forces on a block that is being pulled up a rough incline at a steady speed by a rope parallel to the slope. The rope then breaks; the block slows, stops for an instant, and slides back down. Which change turns the diagram into a correct free-body diagram for the block while it is sliding DOWN?',
    o: [
      ['Remove Q and reverse R', 'correct'],
      ['Remove Q and keep R', 'keeps friction pointing down the slope after the motion has reversed'],
      ['Remove R and keep Q', 'takes R for the pull of the rope and Q for the friction'],
      ['Reverse R and keep Q', 'forgets that the rope no longer pulls on the block'],
    ],
    holds: pick('from the spec\'s arrows: the rope pulls up the slope and kinetic friction opposed the upward sliding (down-slope); sliding down, the rope force is gone and friction points up the slope', (c) => { const f = arr(c.p.forces); const up = f.find((k) => k.direction === 'up-slope')!.label; const down = f.find((k) => k.direction === 'down-slope')!.label; return { remove: [up], reverse: [down] }; }, [{ remove: ['Q'], reverse: ['R'] }, { remove: ['Q'], reverse: [] }, { remove: ['R'], reverse: [] }, { remove: [], reverse: ['R'] }]),
    h: ['Work out which arrow is which while the block is being pulled up at a steady speed: the rope pulls up the slope, and kinetic friction opposes the motion.', 'Then ask of each force whether it still acts after the rope breaks, and whether its direction depends on the direction of sliding.'],
    s: 'Read from the diagram: P is perpendicular to the surface (the normal force), S points straight down (the weight), Q points up the slope and R down the slope. While the block is pulled up, the rope pulls up the slope, so Q is the tension; friction opposes the upward sliding, so R is the kinetic friction. After the rope breaks there is no tension: Q is removed. When the block slides down, friction opposes that motion and points up the slope: R is reversed. The weight and the normal force keep their directions.',
  },
]);

G('111ba11a.lo-2', 'One component of the weight used to reach the other', [
  {
    t: 'the other component at a stated angle, from a graph of one unnamed component against the angle', d: 3, need: 'reason',
    spec: pgraph('Angle of the incline (°)', 'Component of the weight (N)', [0, 90], 15, [0, 70], 10, [{ expr: '60*cos(pi*x/180)' }]),
    alt: 'One falling curve on a grid of a weight component against the angle of the incline: greatest at zero angle and falling to zero when the incline is vertical.',
    q: 'A block rests on an incline whose angle can be changed. The graph shows how ONE of the two components of the block\'s weight, parallel or perpendicular to the incline, depends on the angle of the incline. What is the size of the OTHER component when the incline is at 30°, in newtons?',
    n: '30',
    calc: ['the spec\'s curve is the whole weight at 0° and zero at 90°, so it is the perpendicular component W·cos θ; the other is W·sin 30° with W = curve_value at 0°', (c) => { const W = c.num('curve_value', { curve: 0, x: 0 }); if (!near(c.num('curve_value', { curve: 0, x: 90 }), 0, 1e-9) || !near(fOf(c)(60), W / 2, 1e-9)) throw new Error('the curve is not W·cos θ'); return round(W * Math.sin(rad(30)), 6); }],
    h: ['Decide which component the graph shows by looking at a level surface (angle zero): there one component is the whole weight and the other is nothing.', 'That reading also gives the weight. The component along the slope is the weight times the sine of the angle; the component into the slope is the weight times the cosine.'],
    s: 'Read from the graph: at 0° the component is 60 N, and it falls to zero at 90°. On a level surface the whole weight is perpendicular to the surface, so the graph shows the perpendicular component, W cos θ, and the weight is 60 N. The other component is the parallel one, W sin θ. At 30° it is 60 × sin 30° = 30 N.',
  },
  {
    t: 'normal force from the friction that holds a block at rest, the weight not being given', d: 3, need: 'calc',
    spec: fbd([{ label: 'N', direction: 'normal' }, { label: 'f', direction: 'up-slope', magnitude: 24 }, { label: 'W', direction: 'down' }], { incline: { angle: 37 }, lengths: 'equal' }),
    alt: 'A block on an incline with three force arrows of equal length: N perpendicular to the surface, f up the slope with its size printed, and W straight down with no size.',
    q: 'The free-body diagram shows a block at rest on a rough incline; f is the friction force. What is the size of the normal force N, in newtons? Use sin 37° = 0.60 and cos 37° = 0.80.',
    n: '32',
    calc: ['at rest f = W·sin θ and N = W·cos θ, with the spec\'s f and the stem\'s sin 37° = 0.60, cos 37° = 0.80', (c) => { const f = arr(c.p.forces).find((k) => k.label === 'f')!.magnitude as number; if (((c.p.incline as P).angle as number) !== 37) throw new Error('not a 37° incline'); return round((f / 0.60) * 0.80, 6); }],
    alts: ['with calculator values of sin 37° and cos 37°', (c) => { const f = arr(c.p.forces).find((k) => k.label === 'f')!.magnitude as number; return [(f / Math.sin(rad(37))) * Math.cos(rad(37))]; }],
    h: ['The block is at rest, so along the slope the friction force balances the component of the weight parallel to the incline. Use that to find the weight.', 'Perpendicular to the slope, the normal force balances the other component of the weight.'],
    s: 'Read from the diagram: the incline is at 37° and f = 24 N acts up the slope. The block is at rest, so f equals the parallel component of the weight: W sin 37° = 24, giving W = 24 ÷ 0.60 = 40 N. The normal force balances the perpendicular component: N = W cos 37° = 40 × 0.80 = 32 N.',
  },
]);

// ── Magnetic Fields and Right-Hand Rule (pack 228) ──────────────────────────

const DIR_WORD: Record<string, string> = { right: 'To the right', left: 'To the left', up: 'Upward', down: 'Downward' };

G('73571e58.lo-1', 'Poles and field directions inferred in two steps', [
  {
    t: 'compass direction beside a magnet whose poles follow from the field in the gap', d: 3, need: 'reason',
    spec: magnet([{ north: 'right', poles: 'value' }, { north: 'left', poles: 'none' }], { arrows: false, compasses: [{ x: 2.1, y: 1.3, label: 'X', needle: false }] }),
    alt: 'Two bar magnets end to end with a gap between them, each with its field lines drawn without arrowheads; the first magnet has its poles lettered and the second is unlettered. An empty compass X stands above the middle of the unlettered magnet.',
    q: 'The diagram shows the magnetic field lines round two bar magnets; the poles of the right-hand magnet are not marked, and the lines carry no arrowheads. An empty compass X stands above the middle of the right-hand magnet. In which direction does the north-seeking end of its needle point?',
    o: [
      ['To the right', 'correct'],
      ['To the left', 'takes the two magnets to attract, so that an S pole faces the gap'],
      ['Upward', 'points the needle along a line drawn from the magnet out to the compass'],
      ['Downward', 'takes the needle to point at the nearest part of the magnet'],
    ],
    holds: ['magnet_compass_direction for compass X on the spec, with magnet_interaction recorded: the option holds when it names that direction', (() => {
      const is = (word: string) => (c: Ctx) => { c.txt('magnet_interaction'); return DIR_WORD[c.txt('magnet_compass_direction', { compass: 'X' })] === word; };
      return [is('To the right'), is('To the left'), is('Upward'), is('Downward')];
    })()],
    h: ['Look at the lines in the gap: decide whether they join the two magnets or are pushed apart, and so whether the facing poles are alike or unlike.', 'That fixes the poles of the right-hand magnet. Outside a magnet the field points from its north pole round to its south pole, and a compass needle lines up with the field.'],
    s: 'Read from the diagram: the left-hand magnet has its N pole facing the gap, and the lines in the gap do not run from one magnet to the other but bend away, as they do between like poles. So the pole of the right-hand magnet that faces the gap is also N, and its far end is S. Outside the magnet the field runs from N to S, so above the middle of the right-hand magnet it points from its left end toward its right end: the north-seeking end of the compass points to the right.',
  },
  {
    t: 'the north pole of an unlettered magnet and the reading of a second compass, from one needle', d: 3, need: 'reason',
    spec: magnet([{ north: 'left', poles: 'none' }], { arrows: false, compasses: [{ x: 2.5, y: 0, label: 'X' }, { x: 0, y: -1.45, label: 'Y', needle: false }] }),
    alt: 'A bar magnet with unlettered halves and its field lines, without arrowheads. Compass X, beyond one end of the magnet on its axis, shows its needle with the dark half toward the magnet; compass Y, beside the middle of the magnet, is empty.',
    q: 'The diagram shows a bar magnet whose poles are not marked, with two compasses; the dark half of a compass needle is its north-seeking end. The needle of compass X is shown. Which end of the magnet is its north pole, and which way does the north-seeking end of the needle of compass Y point?',
    o: [
      ['The left end; Y points to the right', 'correct'],
      ['The left end; Y points to the left', 'takes the field beside the magnet to run the same way as the field inside it'],
      ['The right end; Y points to the right', 'names the pole wrongly and then, by a second slip, reverses the field at Y'],
      ['The right end; Y points to the left', 'takes the north-seeking end of a needle to point toward a north pole'],
    ],
    holds: pick('magnet_north_end (fixed by the drawn needle of X) and magnet_compass_direction for Y on the spec', (c) => [c.txt('magnet_north_end', {}), c.txt('magnet_compass_direction', { compass: 'Y' })], [['left', 'right'], ['left', 'left'], ['right', 'right'], ['right', 'left']]),
    h: ['The north-seeking end of a needle points along the field. Outside a magnet the field points away from a north pole and toward a south pole.', 'Once the poles are known, follow the field from the north pole round the outside of the magnet to the south pole, and see which way it runs where Y stands.'],
    s: 'Read from the diagram: compass X is beyond the right-hand end of the magnet and its north-seeking (dark) end points toward the magnet. The field there points into that end, so the right-hand end is the south pole and the left-hand end is the north pole. Outside the magnet the field runs from N round to S, so beside the middle of the magnet, where Y stands, it points from the left end toward the right end: the needle of Y points to the right.',
  },
]);

// ── Series Circuits Fundamentals (pack 206) ─────────────────────────────────

G('1503a287.lo-2', 'Series resistance from lines that have to be turned into resistances', [
  {
    t: 'equivalent series resistance of two resistors from their current–voltage lines', d: 3, need: 'calc',
    spec: pgraph('Voltage across the resistor (V)', 'Current (A)', [0, 12], 2, [0, 0.6], 0.1, [{ expr: 'x/20', label: 'X' }, { expr: 'x/30', label: 'Y', dashed: true }]),
    alt: 'Two straight lines through the origin on a grid of current against voltage: a solid line X and a less steep dashed line Y.',
    q: 'The graph shows the current through each of two resistors, X and Y, against the voltage across it. What is the equivalent resistance of X and Y connected in series, in ohms?',
    n: '50',
    calc: ['1 ÷ (slope of each line, by curve_slope between grid points) is each resistance; in series they add', (c) => round(1 / c.num('curve_slope', { curve: 0, x1: 0, x2: 6 }) + 1 / c.num('curve_slope', { curve: 1, x1: 0, x2: 6 }), 6)],
    h: ['The resistance of each resistor is the voltage across it divided by the current through it; read one grid point on each line.', 'On this graph the steeper line is not the larger resistance. Once you have both resistances, combine them as resistors in series.'],
    s: 'Read from the graph: for X a voltage of 6 V drives 0.30 A, so R = 6 ÷ 0.30 = 20 Ω; for Y a voltage of 6 V drives 0.20 A, so R = 6 ÷ 0.20 = 30 Ω. In series the resistances add: 20 + 30 = 50 Ω.',
  },
  {
    t: 'one resistance separated out of a series pair, from two voltage–current lines', d: 3, need: 'calc',
    spec: pgraph('Current (A)', 'Voltage (V)', [0, 0.5], 0.1, [0, 12], 2, [{ expr: '10x', label: 'X alone' }, { expr: '25x', label: 'X and Y in series', dashed: true }]),
    alt: 'Two straight lines through the origin on a grid of voltage against current: a solid line for X alone and a steeper dashed line for X and Y in series.',
    q: 'The graph shows the voltage across resistor X against the current through it, and the same for X and a second resistor Y connected in series. What is the resistance of Y, in ohms?',
    n: '15',
    calc: ['slope of the series line minus slope of the line for X alone (curve_slope between grid points)', (c) => round(c.num('curve_slope', { curve: 1, x1: 0, x2: 0.4 }) - c.num('curve_slope', { curve: 0, x1: 0, x2: 0.4 }), 6)],
    h: ['On a graph of voltage against current, the slope of a line is a resistance. Find the slope of each line from a grid point.', 'The dashed line gives the equivalent resistance of the pair. Use the rule for resistors in series to separate out Y.'],
    s: 'Read from the graph: for X alone, 0.40 A needs 4 V, so R(X) = 4 ÷ 0.40 = 10 Ω; for the series pair, 0.40 A needs 10 V, so the equivalent resistance is 10 ÷ 0.40 = 25 Ω. In series the resistances add, so R(Y) = 25 − 10 = 15 Ω.',
  },
]);

G('1503a287.lo-1', 'One current through every component, read off a potential graph', [
  {
    t: 'a resistance from the potential drops round a series circuit and one known resistance', d: 3, need: 'calc',
    spec: mgraph('position', [{ points: [[0, 12], [1, 12], [2, 10], [3, 10], [4, 4], [5, 4], [6, 0], [7, 0]], vertexDots: 'none' }], { tRange: [0, 8], yRange: [0, 14], tStep: 1, yStep: 2, tLabel: 'Position along the circuit', yLabel: 'Potential (V)' }),
    alt: 'A line graph of potential against position along the circuit: three downward slopes separated by level stretches, taking the potential from its highest value down to zero.',
    q: 'The graph shows the electric potential at points along a series circuit, going from the positive terminal of the battery, through resistors R₁, R₂ and R₃ in that order, to the negative terminal; the connecting wires have no resistance. R₁ is 4 Ω. What is the resistance of R₃, in ohms?',
    n: '8',
    calc: ['the three falls of the spec\'s line, in order, are the voltages across R₁, R₂, R₃; the current is (first fall) ÷ 4 Ω and is the same in R₃', (c) => { const p = ptsOf(c); const drops: number[] = []; for (let i = 0; i < p.length - 1; i++) if (p[i + 1][1] < p[i][1]) drops.push(p[i][1] - p[i + 1][1]); if (drops.length !== 3) throw new Error(`${drops.length} drops`); return round(drops[2] / (drops[0] / 4), 6); }],
    h: ['Each downward slope is the voltage across one resistor; read the three drops in order.', 'In a series circuit the same current passes through every resistor. Find it from the resistor whose resistance you know.'],
    s: 'Read from the graph: the potential falls from 12 V to 10 V across R₁ (2 V), from 10 V to 4 V across R₂ (6 V) and from 4 V to 0 across R₃ (4 V). The current in R₁ is 2 V ÷ 4 Ω = 0.5 A, and in a series circuit the same current passes through every resistor. So R₃ = 4 V ÷ 0.5 A = 8 Ω. (Equal currents make the voltage drops proportional to the resistances.)',
  },
]);

// ── Springs and Hooke's Law (pack 237) ──────────────────────────────────────

G('a52137eb.lo-1', 'Force proportional to extension, not to length', [
  {
    t: 'difference between the forces in two springs at one extension, from force-against-LENGTH lines', d: 3, need: 'calc',
    spec: pgraph('Length of the spring (m)', 'Force (N)', [0, 0.5], 0.1, [0, 20], 5, [{ expr: '50*(x - 0.1)', domain: [0.1, 0.5], label: 'P', from: 'none', to: 'none' }, { expr: '25*(x - 0.2)', domain: [0.2, 0.5], label: 'Q', dashed: true, from: 'none', to: 'none' }]),
    alt: 'Two straight lines on a grid of force against length of spring, each starting on the length axis at a different point: a solid line P and a less steep dashed line Q that starts further along.',
    q: 'The graph shows the force needed to hold each of two springs, P and Q, stretched to a given LENGTH. Each spring is now stretched until it is 0.50 m longer than its natural length. How much greater, in newtons, is the force in spring P than the force in spring Q?',
    n: '12.5',
    calc: ['k of each spring is the slope of its line (curve_slope between grid points); F = k × 0.50 m for each, then the difference', (c) => round(0.50 * (c.num('curve_slope', { curve: 0, x1: 0.1, x2: 0.5 }) - c.num('curve_slope', { curve: 1, x1: 0.2, x2: 0.4 })), 6)],
    h: ['Hooke\'s law is about the extension, not the length: each line meets the length axis at the natural length of its spring.', 'The spring constant is the slope of each line. Find both, then use F = kx with the same extension for each spring.'],
    s: 'Read from the graph: P needs no force at a length of 0.10 m and 20 N at 0.50 m, so its natural length is 0.10 m and k = 20 ÷ 0.40 = 50 N/m. Q needs no force at 0.20 m and 5 N at 0.40 m, so its natural length is 0.20 m and k = 5 ÷ 0.20 = 25 N/m. For an extension of 0.50 m, F = kx gives 50 × 0.50 = 25 N for P and 25 × 0.50 = 12.5 N for Q. The force in P is greater by 12.5 N.',
  },
]);

// ── Standing Waves and Harmonics (pack 249) ─────────────────────────────────

G('c40fd3f9.lo-1', 'Displacements added after the waves have moved', [
  {
    t: 'displacement at a point when two pulses, each moved on from the snapshot, overlap there', d: 3, need: 'calc',
    spec: pgraph('Position (m)', 'Displacement (cm)', [0, 12], 1, [-3, 3], 1, [{ expr: 'x', domain: [0, 2], label: 'P', from: 'none', to: 'none' }, { expr: '4 - x', domain: [2, 4], from: 'none', to: 'none' }, { expr: '7 - x', domain: [7, 9], label: 'Q', dashed: true, from: 'none', to: 'none' }, { expr: 'x - 11', domain: [9, 11], dashed: true, from: 'none', to: 'none' }]),
    alt: 'Two separate triangular pulses on a grid of displacement against position: P, an upward pulse near the left-hand end, and Q, a downward pulse further along; the string is flat between and beyond them.',
    q: 'The graph shows two pulses on a long string at t = 0. Pulse P is moving to the right and pulse Q is moving to the left, each at 1 m/s without changing shape. What is the displacement of the string at the position x = 6 m at t = 3 s, in centimetres?',
    n: '-1',
    calc: ['each pulse of the spec moved 3 m its own way: P read 3 m to the left of x = 6 m and Q read 3 m to the right of it, then added', (c) => round(pulse(c, [0, 1])(6 - 3) + pulse(c, [2, 3])(6 + 3), 6)],
    h: ['Move each pulse through the distance it travels in 3 s, in its own direction; the part of a pulse that is now at x = 6 m started 3 m away from there.', 'Read the displacement that each pulse alone would give at x = 6 m, with its sign, and add the two.'],
    s: 'In 3 s each pulse moves 3 m. The part of P now at x = 6 m started at x = 3 m; read from the graph: P has a displacement of +1 cm there. The part of Q now at x = 6 m started at x = 9 m; read from the graph: Q has a displacement of −2 cm there. By superposition the displacement of the string is the sum: 1 + (−2) = −1 cm.',
  },
  {
    t: 'gain in combined amplitude when one of two opposed waves is shifted half a wavelength', d: 3, need: 'reason',
    spec: pgraph('Position (m)', 'Displacement (cm)', [0, 8], 1, [-4, 4], 1, [{ expr: '3*sin(pi*x/2)', label: 'wave 1' }, { expr: '-2*sin(pi*x/2)', label: 'wave 2', dashed: true }]),
    alt: 'Two sine-shaped waves of the same wavelength on a grid of displacement against position: a solid wave with the larger swing and a dashed wave with a smaller swing, each drawn over two full wavelengths.',
    q: 'The graph shows, at one instant, two waves of the same wavelength that travel together in the same direction along a string, each drawn as it would be if the other were absent. Wave 2 is then delayed by half a wavelength, with nothing else changed. By how many centimetres does the amplitude of the combined wave on the string increase?',
    n: '4',
    calc: ['the spec\'s two waves are in antiphase now (their sum has amplitude |A₁ − A₂|); wave 2 shifted by half its wavelength gives A₁ + A₂: the increase, each amplitude being the greatest value of the sum over one wavelength', (c) => {
      const f1 = fOf(c, 0); const f2 = fOf(c, 1); const lam = 4; const xs = Array.from({ length: 4001 }, (_, i) => (i * lam) / 4000);
      const before = Math.max(...xs.map((x) => Math.abs(f1(x) + f2(x)))); const after = Math.max(...xs.map((x) => Math.abs(f1(x) + f2(x - lam / 2))));
      if (!near(f1(1 + lam), f1(1), 1e-9) || !near(f2(1 + lam), f2(1), 1e-9)) throw new Error('the wavelength is not 4 m');
      return round(after - before, 6);
    }],
    h: ['Read the amplitude of each wave, and see whether crests of one lie on crests or on troughs of the other.', 'Where the waves oppose, the combined amplitude is the difference of the two amplitudes; a shift of half a wavelength turns every crest of the shifted wave into a trough, and the reverse.'],
    s: 'Read from the graph: wave 1 has amplitude 3 cm and wave 2 has amplitude 2 cm, and each crest of one lies on a trough of the other. The waves interfere destructively, so the combined amplitude is 3 − 2 = 1 cm. Delaying wave 2 by half a wavelength puts its crests on the crests of wave 1: the interference becomes constructive and the combined amplitude is 3 + 2 = 5 cm. The amplitude increases by 5 − 1 = 4 cm.',
  },
]);

// ── Thin Lens and Mirror Equations (pack 208) ───────────────────────────────

G('183b6442.lo-3', 'The mirror equation behind two unfamiliar graphs', [
  {
    t: 'image distance from a graph whose axes are both reciprocals', d: 3, need: 'calc',
    spec: pgraph('1/(object distance) (1/cm)', '1/(image distance) (1/cm)', [0, 0.05], 0.01, [0, 0.05], 0.01, [{ expr: '0.05 - x' }]),
    alt: 'A straight line on a grid whose axes are the reciprocals of the object distance and of the image distance; it falls from the vertical axis to the horizontal axis.',
    q: 'For a concave mirror, the graph shows 1/(image distance) plotted against 1/(object distance), with both distances in centimetres. How far from the mirror is the image when the object is 25 cm from the mirror, in centimetres?',
    n: '100',
    calc: ['1 ÷ (the spec\'s line at 1/25, by curve_value)', (c) => round(1 / c.num('curve_value', { curve: 0, x: 1 / 25 }), 4)],
    h: ['Both axes are reciprocals. Turn the object distance into its reciprocal before you look it up on the graph.', 'What you read off the graph is the reciprocal of the image distance; turn it back into a distance.'],
    s: 'An object distance of 25 cm is 1/25 = 0.04 per cm on the horizontal axis. Read from the graph: at 0.04 the line is at 0.01 per cm, so 1/d_i = 0.01 and d_i = 100 cm. This agrees with the mirror equation: the line meets each axis at 0.05 per cm, so 1/f = 0.05 and f = 20 cm, and 1/20 − 1/25 = 1/100.',
  },
  {
    t: 'a virtual image distance for an object position off the graph, the focal length being found from the curve', d: 3, need: 'calc',
    spec: pgraph('Object distance (cm)', 'Image distance (cm)', [0, 60], 10, [0, 70], 10, [{ expr: '15*x/(x - 15)', domain: [20, 60], from: 'none', to: 'none' }]),
    alt: 'One falling curve on a grid of image distance against object distance: very high for the smallest object distances drawn, and flattening toward a lower value as the object distance grows.',
    q: 'For a concave mirror, the graph shows the image distance against the object distance for real images. An object is then placed 10 cm from the same mirror. What is the image distance, in centimetres? Give a negative value if the image is behind the mirror.',
    n: '-30',
    calc: ['focal length from two grid points of the spec\'s curve (curve_value at 30 cm and at 20 cm, which must agree), then 1/d_i = 1/f − 1/10', (c) => { const f1 = 1 / (1 / 30 + 1 / c.num('curve_value', { curve: 0, x: 30 })); const f2 = 1 / (1 / 20 + 1 / c.num('curve_value', { curve: 0, x: 20 })); if (!near(f1, f2, 1e-9)) throw new Error('the curve is not one mirror'); return round(1 / (1 / f1 - 1 / 10), 4); }],
    h: ['The object distance asked about is not on the graph, so first find the focal length: put any one point read from the curve into the mirror equation.', 'Then use the mirror equation again with the new object distance, and keep the sign of the result.'],
    s: 'Read from the graph: an object distance of 30 cm gives an image distance of 30 cm (and 20 cm gives 60 cm). From 1/f = 1/d_o + 1/d_i = 1/30 + 1/30, f = 15 cm. For d_o = 10 cm: 1/d_i = 1/15 − 1/10 = −1/30, so d_i = −30 cm. The object is inside the focal length, so the image is virtual, 30 cm behind the mirror.',
  },
]);

// ── Transformer Turns-Ratio Problems (pack 212) ─────────────────────────────

G('233ad806.lo-2', 'The turns ratio changed, and applied twice over', [
  {
    t: 'secondary voltage after the primary turns are halved, from a graph for the original primary', d: 3, need: 'calc',
    spec: pgraph('Number of turns on the secondary coil', 'Secondary voltage (V)', [0, 500], 100, [0, 100], 20, [{ expr: '0.2x' }]),
    alt: 'A straight line through the origin on a grid of secondary voltage against number of secondary turns, rising steadily to the upper right corner.',
    q: 'An ideal transformer has a secondary coil whose number of turns can be changed. With the primary coil connected to a fixed AC supply, the graph shows the secondary voltage against the number of secondary turns. The primary coil is then replaced by one with half as many turns, connected to the same supply. What is the secondary voltage with 300 secondary turns now, in volts?',
    n: '120',
    calc: ['V₂ = V₁·N₂/N₁: with N₁ halved, twice the spec\'s line at 300 turns (curve_value)', (c) => 2 * c.num('curve_value', { curve: 0, x: 300 })],
    h: ['Read the secondary voltage for 300 turns from the graph; that is for the original primary coil.', 'The secondary voltage is the primary voltage multiplied by (secondary turns ÷ primary turns). Decide what halving the primary turns does to that ratio.'],
    s: 'Read from the graph: with the original primary coil, 300 secondary turns give 60 V. For an ideal transformer V₂ = V₁ × N₂/N₁. The supply voltage V₁ and the secondary turns N₂ are unchanged, and N₁ is halved, so the turns ratio N₂/N₁ doubles and the secondary voltage doubles: 2 × 60 = 120 V.',
  },
  {
    t: 'output voltage of two transformers in cascade, from a table of their turns', d: 3, need: 'calc',
    spec: table(['Transformer', 'Primary turns', 'Secondary turns'], [['1', 800, 200], ['2', 150, 450]]),
    alt: 'A table of two rows, one for each of two transformers, giving the number of turns on its primary coil and on its secondary coil.',
    q: 'The table gives the numbers of turns of two ideal transformers. A 240 V AC supply is connected to the primary coil of transformer 1, and the secondary coil of transformer 1 is connected to the primary coil of transformer 2. What is the voltage across the secondary coil of transformer 2, in volts?',
    n: '180',
    calc: ['240 V × (secondary ÷ primary turns) of each row of the spec\'s table in turn', (c) => { const np = tcol(c, 1); const ns = tcol(c, 2); return round(240 * (ns[0] / np[0]) * (ns[1] / np[1]), 6); }],
    h: ['Take the transformers one at a time: the secondary voltage of the first is the primary voltage of the second.', 'For each one, the voltage ratio equals the turns ratio, secondary to primary. One of them steps the voltage down and the other steps it up.'],
    s: 'Read from the table: transformer 1 has 800 primary and 200 secondary turns, so it steps 240 V down to 240 × 200/800 = 60 V. That 60 V is the primary voltage of transformer 2, which has 150 primary and 450 secondary turns, so it steps it up to 60 × 450/150 = 180 V.',
  },
]);

G('233ad806.lo-3', 'The inverse ratio read from a graph and compared across transformers', [
  {
    t: 'primary turns from the slope of a secondary-current against primary-current line', d: 3, need: 'calc',
    spec: pgraph('Primary current (A)', 'Secondary current (A)', [0, 1], 0.25, [0, 4], 1, [{ expr: '4x' }]),
    alt: 'A straight line through the origin on a grid of secondary current against primary current, rising steadily to the upper right corner.',
    q: 'For an ideal transformer, the graph shows the current in the secondary coil against the current in the primary coil. The secondary coil has 150 turns. How many turns does the primary coil have?',
    n: '600',
    calc: ['I₂/I₁ = N₁/N₂: the slope of the spec\'s line (curve_slope) times 150 turns', (c) => round(c.num('curve_slope', { curve: 0, x1: 0, x2: 0.5 }) * 150, 6)],
    h: ['Find the ratio of secondary current to primary current from the slope of the line.', 'In an ideal transformer the currents are in the INVERSE ratio of the turns: the coil with the larger current has fewer turns.'],
    s: 'Read from the graph: a primary current of 0.5 A goes with a secondary current of 2 A, so I₂/I₁ = 4. For an ideal transformer I₁/I₂ = N₂/N₁, so N₁/N₂ = I₂/I₁ = 4: the primary coil has 4 times as many turns as the secondary, 4 × 150 = 600 turns. The secondary carries the larger current, so it is the coil with fewer turns.',
  },
  {
    t: 'the transformer with the largest secondary current among four in a table', d: 3, need: 'calc',
    spec: table(['Transformer', 'Primary turns', 'Secondary turns', { header: 'Primary current', unit: 'A' }], [['P', 400, 100, '0.50'], ['Q', 100, 400, '6.0'], ['R', 300, 100, '0.80'], ['S', 600, 50, '0.15']]),
    alt: 'A table of four rows, one for each of four transformers named by a letter, giving the primary turns, the secondary turns and the primary current of each.',
    q: 'The table gives the numbers of turns and the primary current of four ideal transformers. In which transformer is the secondary current the largest?',
    o: [
      ['Transformer R', 'correct'],
      ['Transformer Q', 'picks the largest primary current, or multiplies by secondary turns over primary turns'],
      ['Transformer S', 'picks the largest ratio of primary turns to secondary turns without using the current'],
      ['Transformer P', 'slips in comparing 2.0 A with the other values'],
    ],
    holds: pick('I₂ = I₁ × N₁/N₂ for each row of the spec\'s table: the name of the row with the largest', (c) => { const rows = c.p.rows as unknown[][]; const is = rows.map((r) => ({ name: r[0] as string, i2: (N(r[3]) * N(r[1])) / N(r[2]) })).sort((a, b) => b.i2 - a.i2); if (near(is[0].i2, is[1].i2)) throw new Error('a tie'); return is[0].name; }, ['R', 'Q', 'S', 'P']),
    h: ['For an ideal transformer the secondary current is the primary current multiplied by (primary turns ÷ secondary turns), the inverse of the turns ratio used for voltage.', 'Work out the secondary current for all four before comparing; neither the largest primary current nor the largest turns ratio decides it alone.'],
    s: 'For an ideal transformer I₂ = I₁ × N₁/N₂. Read from the table: P gives 0.50 × 400/100 = 2.0 A; Q gives 6.0 × 100/400 = 1.5 A; R gives 0.80 × 300/100 = 2.4 A; S gives 0.15 × 600/50 = 1.8 A. The largest secondary current is in transformer R.',
  },
]);

// ITEMS-END

/** Objectives of the batch that get no item, and why (written into mapping.json). Keys are "<first block of the plan id>.lo-N". */
const NOT_COVERED: Record<string, string> = {
  // Recognition objectives: the figure can only be read, and the reading is the whole task.
  '869a59a5.lo-1': 'naming the opposite, adjacent and hypotenuse sides is recognition: on any triangle the figure kind can draw, the answer is one look at the right-angle mark and the angle label; every harder variant tried (two acute angles, a statement to falsify) either stays at level 2 or needs the trigonometric ratios of the other objectives of the skill',
  'ae0f8dbd.lo-1': 'telling series from parallel connections is recognition on the drawn circuit, and the four held items already read the topology in every way the ladder layout allows (pairs in parallel, paths, a switch, a broken filament); a harder item would rest on the current and voltage rules taught under the other objectives of the skill',
  'ade9f012.lo-1': 'defining wave speed, frequency, wavelength and period with their units: a figure can show one of these being read (the held false-statement item does all four), but combining them is v = fλ, which is another objective of the skill and already has level-3 figure items',
  '376f309f.lo-1': 'components as projections onto the axes are read by counting squares, which is level 1–2; anything harder on a vector diagram (a resultant, a magnitude and angle) belongs to vector addition or to the trigonometric objectives of the skill, not to this one',
  // One-relation objectives: every honest figure task is one or two readings put into one formula.
  'ade9f012.lo-3': 'T = 1/f is a single reciprocal: every task a displacement–time record can carry (a frequency, a count of cycles, two records compared) is one or two readings put into that one formula, which a strict reader places at level 2',
  '7aae9be7.lo-3': 'E = hf is a single multiplication: the held graph item already asks for the ratio of two photon energies, and the other things a photoelectric figure can ask (threshold, work function, stopping voltage) belong to the neighbouring objectives, which have level-3 items',
  // The figure kind adds nothing beyond what the held items already use.
  'ffe602ec.lo-3': 'the replication-fork figure shows where the primers lie and how many pieces were started, and both readings are already used at level 2; a harder question about primers (their removal, the order of events on the lagging strand) rests on the lagging-strand and ligase objectives of the skill, not on what this lesson text teaches about primase',
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
  /** The objectives of this batch, as listed after batch 7; each is checked against the held rows (figure items, none above level 2). */
  const lowOnly = JSON.parse(fs.readFileSync(LOW_LEVEL_ONLY, 'utf8')) as Array<{ loId: string; subject: string; skill: string; objective: string; figureItemLevels: number[] }>;
  const lowSet = new Set(lowOnly.map((o) => o.loId));

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
  const specsPerLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];
  const plain = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (!lowSet.has(obj.loId)) problems.push(`${tag}: the objective is not one of the low-level-only objectives of this batch`);
    if (![3, 4].includes(a.d)) problems.push(`${tag}: an item of this batch is level 3 or 4`);
    if (NOT_COVERED[a.lo]) problems.push(`${tag}: the objective has items and is also listed as not covered`);
    // A harder item is drawn on a NEW figure and asks a NEW question: not the spec, and not the stem, of any figure item the objective holds.
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
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-8 figures)' }, license: 'internal-original', verifiedAt: now,
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
  // Every objective of the batch is either covered or listed, with its reason, as not covered; and each one really is low-level only.
  for (const o of lowOnly) {
    const rs = heldByLo.get(o.loId) ?? [];
    if (!rs.length || Math.max(...rs.map((r) => r.difficulty)) > 2) problems.push(`${shortOf(o.loId)}: listed as low-level only, but its held figure rows are [${rs.map((r) => r.difficulty).join(', ')}]`);
    const has = perLo.has(o.loId);
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
      return { loId: lo, pack: o.pack, subject: o.subject, skill: o.skill, objective: o.description, status: 'covered', itemsInPack: o.have, heldFigureItems: (heldByLo.get(lo) ?? []).length, heldLevels: (heldByLo.get(lo) ?? []).map((r) => r.difficulty).sort().join(','), heldKinds: [...new Set((heldByLo.get(lo) ?? []).map((r) => r.figure.spec.type))].join(', '), newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), kinds: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), tasks: mine.map((m) => m.item.t), ids: mine.map((m) => m.id) };
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
    lowLevelOnlyObjectives: lowOnly.length,
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
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch8${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch8-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch8-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-8 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-8 figure practice items — ${rows.length} harder items for the objectives whose figure items were all level 1–2</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

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
