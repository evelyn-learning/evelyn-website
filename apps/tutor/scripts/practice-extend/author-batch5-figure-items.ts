/**
 * Hand-authored practice items that are read off a FIGURE — batch 5.
 *
 * Items on the NEW figure kinds of batch 4 (conic_graph, venn_diagram,
 * probability_tree, mechanics_setup, wave_diagram, energy_levels,
 * heating_curve, electrochemical_cell, sequence_strip, and the grouped
 * `series` of bar_chart) for the objectives the survey lists under the kinds
 * that were BUILT (practice-figures-2026-10-14-batch4/survey.json, decision
 * "built"). One or two items an objective; an objective where a figure would
 * be decoration gets none and is listed in SKIPPED with the reason.
 *
 * Levels (what a strict reader would say): level 3 is the aim — two readings
 * combined, a reading interpreted through the objective's idea, a case the
 * figure decides, working backwards, find-the-false-statement, comparing two
 * cases. Level 2 only where the objective is itself a read-off objective.
 * Level 4 rarely, and only where honest.
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
 * here), the audited ids, the mapping of the surveyed objectives, a gallery
 * page, PNGs at the 340 px column (2×), contact sheets and a summary.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch5-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-15-batch5`;
/** The survey that motivated the batch-4 kinds: which objectives need which kind. */
const SURVEY = `${INTEGRATION}/practice-figures-2026-10-14-batch4/survey.json`;
/** The lesson packs (lesson text and every existing item): the top-up pack of a skill where there is one, else the expand pack. */
const PACKS_EXPAND = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PACKS_TOPUP = `${INTEGRATION}/practice-topup5-2026-10-14/packs`;
/** Figure rows already written by earlier runs — an id may not be reused. */
const EARLIER_ROWS = [
  `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4.json`,
];
const PNG_WIDTH = 680; // the 340 px column at 2×
const CAP_PER_OBJECTIVE = 2;
/** The figure kinds an item of this batch may use: the batch-4 kinds, and bar_chart with grouped `series`. */
const NEW_KINDS = ['conic_graph', 'venn_diagram', 'probability_tree', 'mechanics_setup', 'wave_diagram', 'energy_levels', 'heating_curve', 'electrochemical_cell', 'sequence_strip', 'bar_chart'];

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
  /** The level a strict reader would give. */
  d: 2 | 3 | 4;
  /** What the item asks: 'read' (a read-off, level 2 only), a reasoned choice, or a calculation on what is read. */
  need: 'read' | 'reason' | 'calc';
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
/** Surveyed objectives that get no item, and why (a figure would be decoration, or the figure cannot carry the objective honestly). */
const SKIPPED: Record<string, string> = {};
function SKIP(lo: string, why: string): void {
  SKIPPED[lo] = why;
}
/** Params an item would have needed and the kinds do not have (reported; nothing is added to the kinds here). */
const MISSING_PARAMS: string[] = [];
function MISSING(what: string): void {
  MISSING_PARAMS.push(what);
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const rad = (v: number): number => (v * Math.PI) / 180;
const arr = (v: unknown): P[] => v as P[];
const minus = (v: number | string): string => String(v).replace(/-/g, '−');
void [near, round, rad, arr, minus, S, MISSING, SKIP];

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// ALGEBRA 2 — conics, Venn diagrams, probability trees
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// ALGEBRA 2 — conics, Venn diagrams, probability trees
// ════════════════════════════════════════════════════════════════════════════

const conicG = (xRange: [number, number], yRange: [number, number], conic: P, extra: P = {}): Spec => S('conic_graph', { xRange, yRange, xStep: 1, yStep: 1, conics: [conic], ...extra });
/** The first conic of the spec, as written. */
const k0 = (c: Ctx): P => arr(c.p.conics)[0];
const pair = (v: unknown): [number, number] => v as [number, number];
/** "(x − 2)" / "(x + 1)" / "x", squared. */
const sqT = (v: string, by: number): string => (by === 0 ? `${v}²` : `(${v} ${by > 0 ? '−' : '+'} ${Math.abs(by)})²`);
const circleEq = (h: number, k: number, r2: number): string => `${sqT('x', h)} + ${sqT('y', k)} = ${r2}`;
const ptT = (x: number, y: number): string => `(${minus(x)}, ${minus(y)})`;
const venn = (sets: string[], regions: P[], extra: P = {}): Spec => S('venn_diagram', { sets, regions, ...extra });
/** A Venn region's own number, from the spec (also when the figure hides it). */
const reg = (c: Ctx, ...inside: string[]): number => { const g = arr(c.p.regions).find((x) => JSON.stringify([...(x.in as string[])].sort()) === JSON.stringify([...inside].sort())); if (!g) throw new Error(`no region ${inside.join('+')}`); return g.value as number; };
const vennTotal = (c: Ctx): number => arr(c.p.regions).reduce((t, g) => t + (g.value as number), 0);
const ptree = (branches: P[], extra: P = {}): Spec => S('probability_tree', { branches, ...extra });

// ── Circle Equations and Standard Form (expand pack 002) ────────────────────

G('0b026d57.lo-1', 'A circle as the points at one distance from its centre', [
  {
    t: 'r² of a concentric circle through a marked point', d: 3, need: 'calc',
    spec: conicG([-6, 6], [-3, 7], { type: 'circle', center: [-1, 2], radius: 3 }, { points: [{ x: 4, y: 4, label: 'P' }] }),
    alt: 'A circle drawn on a grid, lying mostly left of the y-axis and above the x-axis; its centre is not marked. A point P is marked outside the circle, to its right.',
    q: 'The figure shows a circle and a point P outside it. A second circle (not drawn) has the same centre as the circle shown and passes through P. When the equation of the second circle is written as (x − h)² + (y − k)² = r², what is the value of r²?',
    n: '29',
    calc: ['squared distance from the drawn circle\'s centre to the marked point P (spec)', (c) => { const [h, k] = pair(k0(c).center); const p = arr(c.p.points)[0]; return ((p.x as number) - h) ** 2 + ((p.y as number) - k) ** 2; }],
    h: ['The centre of the drawn circle is midway between its leftmost and rightmost points (and between its highest and lowest points).', 'Every point of a circle is r from the centre, so r² for the second circle is the squared distance from that centre to P: (difference in x)² + (difference in y)².'],
    s: 'Read from the figure: the circle runs from x = −4 to x = 2 and from y = −1 to y = 5, so its centre is (−1, 2); P is (4, 4). The second circle has the same centre and P is on it, so r² = (4 − (−1))² + (4 − 2)² = 25 + 4 = 29.',
  },
]);

G('0b026d57.lo-2', 'Writing the equation of a circle from its centre and radius', [
  {
    t: 'equation of the concentric circle that touches a drawn line', d: 3, need: 'calc',
    spec: conicG([-6, 4], [-2, 6], { type: 'circle', center: [-3, 2], radius: 2 }, { lines: [{ x: 3 }] }),
    alt: 'A small circle drawn on a grid in the upper-left part, its centre not marked, and a vertical straight line well to the right of the circle.',
    q: 'The figure shows a circle and a vertical line. A larger circle (not drawn) has the same centre as the circle shown and just touches the vertical line. Which is the equation of the larger circle?',
    o: [
      ['(x + 3)² + (y − 2)² = 36', 'correct'],
      ['(x − 3)² + (y + 2)² = 36', 'writes the centre\'s coordinates with the wrong signs'],
      ['(x + 3)² + (y − 2)² = 6', 'writes the radius on the right instead of its square'],
      ['(x + 3)² + (y − 2)² = 16', 'measures to the line from the edge of the drawn circle, not from its centre'],
    ],
    calc: ['centre of the drawn circle and (distance from it to the drawn line)², from the spec', (c) => { const [h, k] = pair(k0(c).center); const r = Math.abs((arr(c.p.lines)[0].x as number) - h); return circleEq(h, k, r * r); }],
    h: ['Find the centre of the drawn circle first: it is midway between the circle\'s leftmost and rightmost points.', 'A circle that just touches a vertical line has a radius equal to the horizontal distance from its centre to that line.'],
    s: 'Read from the figure: the drawn circle runs from x = −5 to x = −1 and from y = 0 to y = 4, so its centre is (−3, 2); the line is x = 3. The larger circle\'s radius is the distance from the centre to the line, 3 − (−3) = 6. So the equation is (x + 3)² + (y − 2)² = 6² = 36.',
  },
]);

G('0b026d57.lo-3', 'General form and standard form of a circle', [
  {
    t: 'constant term of the general form of a drawn circle', d: 3, need: 'calc',
    spec: conicG([-2, 8], [-7, 3], { type: 'circle', center: [3, -2], radius: 4 }),
    alt: 'A circle drawn on a grid, lying mostly right of the y-axis and below the x-axis. Its centre is not marked and no values are printed on it.',
    q: 'The circle shown has an equation of the form x² + y² + Dx + Ey + F = 0. What is the value of F?',
    n: '-3',
    calc: ['h² + k² − r² for the drawn circle (spec): the constant left when (x − h)² + (y − k)² = r² is expanded', (c) => { const [h, k] = pair(k0(c).center); const r = k0(c).radius as number; return h * h + k * k - r * r; }],
    h: ['Read the centre and the radius from the graph and write the equation in standard form first.', 'Expand both squared brackets and move everything to one side; F is the constant that is left.'],
    s: 'Read from the figure: the circle runs from x = −1 to x = 7 and from y = −6 to y = 2, so the centre is (3, −2) and the radius is 4. Standard form: (x − 3)² + (y + 2)² = 16. Expanding, x² − 6x + 9 + y² + 4y + 4 − 16 = 0, so x² + y² − 6x + 4y − 3 = 0 and F = −3.',
  },
]);

const OTHER_CIRCLE = { h: 4, k: 7, r: 3 };
G('0b026d57.lo-4', 'Centre and radius from the standard form', [
  {
    t: 'gap between a drawn circle and a circle given by its equation', d: 3, need: 'calc',
    spec: conicG([-5, 2], [-4, 2], { type: 'circle', center: [-2, -1], radius: 2 }),
    alt: 'A circle drawn on a grid, lying mostly left of the y-axis and crossing the x-axis. Its centre is not marked and no values are printed on it.',
    q: `The figure shows one circle. A second circle, which is not drawn, has equation ${circleEq(OTHER_CIRCLE.h, OTHER_CIRCLE.k, OTHER_CIRCLE.r ** 2)}. What is the shortest distance between a point on the circle shown and a point on the second circle?`,
    n: '5',
    calc: [`distance between the centres − the two radii: the drawn circle from the spec, the other circle centre (${OTHER_CIRCLE.h}, ${OTHER_CIRCLE.k}), radius ${OTHER_CIRCLE.r} as in the stem`, (c) => { const [h, k] = pair(k0(c).center); const d = Math.hypot(OTHER_CIRCLE.h - h, OTHER_CIRCLE.k - k); const gap = d - (k0(c).radius as number) - OTHER_CIRCLE.r; if (gap <= 0) throw new Error('the circles meet'); return gap; }],
    h: ['Take the centre and radius of the second circle from its equation — watch the signs inside the brackets, and remember the right-hand side is r².', 'Find the distance between the two centres, then take away both radii.'],
    s: 'Read from the figure: the drawn circle runs from x = −4 to x = 0 and from y = −3 to y = 1, so its centre is (−2, −1) and its radius is 2. From the equation, the second circle has centre (4, 7) and radius √9 = 3. The centres are √(6² + 8²) = 10 apart, so the shortest distance between the circles is 10 − 2 − 3 = 5.',
  },
]);

// ── Classifying Conic Sections from Equations (top-up pack 007) ─────────────

G('861f771f.lo-1', 'The general form of a drawn conic', [
  {
    t: 'constant term of the general form of a drawn ellipse', d: 3, need: 'calc',
    spec: conicG([-4, 4], [-3, 3], { type: 'ellipse', center: [0, 0], rx: 3, ry: 2 }),
    alt: 'A closed oval curve centred at the origin, wider than it is tall, crossing each axis at whole-number points. Nothing is printed on the curve.',
    q: 'The curve shown has an equation of the form Ax² + Cy² + F = 0. If A = 4, what is the value of F?',
    n: '-36',
    calc: ['from x²/rx² + y²/ry² = 1 (spec) scaled so that the x² coefficient is 4: F = −4·rx²', (c) => { const rx = k0(c).rx as number; const ry = k0(c).ry as number; const C = (4 * rx * rx) / (ry * ry); if (!Number.isInteger(C)) throw new Error('C is not whole'); return -4 * rx * rx; }],
    h: ['Read where the curve crosses the axes and write its equation in the form x²/a² + y²/b² = 1.', 'Multiply the equation through by a number that makes the coefficient of x² equal to 4, then move everything to the left-hand side.'],
    s: 'Read from the figure: the curve crosses the x-axis at ±3 and the y-axis at ±2, so x²/9 + y²/4 = 1. Multiplying by 36 gives 4x² + 9y² = 36, that is 4x² + 9y² − 36 = 0. With A = 4 this gives C = 9 and F = −36.',
  },
]);

G('861f771f.lo-2', 'When the general form is a circle', [
  {
    t: 'unknown constant when the drawn graph forces A = C', d: 3, need: 'calc',
    spec: conicG([-4, 4], [-4, 4], { type: 'circle', center: [0, 0], radius: 3 }),
    alt: 'A closed round curve centred at the origin, crossing each of the four half-axes at the same distance from the origin. Nothing is printed on the curve.',
    q: 'The graph of kx² + 2y² = m, where k and m are constants, is the curve shown. What is the value of m?',
    n: '18',
    calc: ['the graph is a circle, so k = 2; then 2x² + 2y² = m is x² + y² = m/2, and m = 2·r² (radius from the spec)', (c) => { if (c.txt('conic_type') !== 'circle') throw new Error('not a circle'); return 2 * c.num('conic_measure', { want: 'radius' }) ** 2; }],
    h: ['Decide what kind of curve is drawn. What must be true of the coefficients of x² and y² for that kind of curve?', 'Once you know k, divide the equation through so that it reads x² + y² = r², and read r from the graph.'],
    s: 'Read from the figure: the curve is a circle centred at the origin with radius 3. An equation kx² + 2y² = m gives a circle only when the two squared terms have equal coefficients, so k = 2. Then x² + y² = m/2 must be x² + y² = 9, so m = 18.',
  },
]);

/** (sq)² + a·(lin) + f = 0 with one squared variable: its vertex and the way it opens. */
interface OneSq { sq: 'x' | 'y'; a: number; f: number }
const oneSqText = (e: OneSq): string => `${e.sq}² ${e.a < 0 ? '−' : '+'} ${Math.abs(e.a)}${e.sq === 'x' ? 'y' : 'x'} ${e.f < 0 ? '−' : '+'} ${Math.abs(e.f)} = 0`;
/** sq² = −a(lin + f/a): vertex at lin = −f/a on the other axis, 4p = −a. */
const oneSqIs = (e: OneSq, c: Ctx): boolean => { const k = k0(c); const [h, v] = pair(k.vertex); const axis = k.axis as string; const want = axis === 'x' ? 'y' : 'x'; const along = axis === 'x' ? h : v; const across = axis === 'x' ? v : h; return e.sq === want && across === 0 && near(-e.f / e.a, along) && near(-e.a, 4 * (k.p as number)); };
const PAR_OPTS: OneSq[] = [{ sq: 'y', a: 4, f: -8 }, { sq: 'x', a: 4, f: -8 }, { sq: 'y', a: -4, f: -8 }, { sq: 'y', a: 4, f: 8 }];
G('861f771f.lo-3', 'When the general form is a parabola', [
  {
    t: 'general-form equation of a drawn sideways parabola', d: 3, need: 'reason',
    spec: conicG([-4, 4], [-5, 5], { type: 'parabola', vertex: [2, 0], p: -1, axis: 'x' }),
    alt: 'A parabola on a grid that opens to the left, with its turning point on the positive x-axis; it is symmetric about the x-axis and crosses the y-axis twice.',
    q: 'Which equation has the curve shown as its graph?',
    o: [
      [oneSqText(PAR_OPTS[0]), 'correct'],
      [oneSqText(PAR_OPTS[1]), 'squares the wrong variable: this parabola opens down'],
      [oneSqText(PAR_OPTS[2]), 'wrong sign on the x term: this parabola opens to the right'],
      [oneSqText(PAR_OPTS[3]), 'wrong sign on the constant: this parabola has its vertex at (−2, 0)'],
    ],
    holds: ['each option y² (or x²) + a·(other variable) + f = 0 is compared with the drawn parabola (spec): squared variable, vertex and 4p', PAR_OPTS.map((e) => (c: Ctx) => oneSqIs(e, c))],
    h: ['A parabola that opens left or right has y squared and x not squared; one that opens up or down has x squared.', 'Solve each remaining equation for the squared term and check two things against the graph: where the vertex is, and whether the curve opens toward positive or negative x.'],
    s: 'Read from the figure: the curve opens to the left, so y is the squared variable, and its vertex is (2, 0). y² + 4x − 8 = 0 gives y² = −4(x − 2): vertex (2, 0), opening left — it also passes through (1, 2) and (−2, 4) as the graph does. y² − 4x − 8 = 0 opens right, y² + 4x + 8 = 0 has vertex (−2, 0), and x² + 4y − 8 = 0 opens down.',
  },
]);

G('861f771f.lo-4', 'When the general form is an ellipse', [
  {
    t: 'order of the coefficients from the shape of a drawn ellipse', d: 3, need: 'reason',
    spec: conicG([-4, 4], [-4, 4], { type: 'ellipse', center: [0, 0], rx: 2, ry: 3 }),
    alt: 'A closed oval curve centred at the origin, taller than it is wide, crossing each axis at whole-number points. Nothing is printed on the curve.',
    q: 'The curve shown is the graph of Ax² + Cy² = 36. Which statement about the constants A and C is true?',
    o: [
      ['A > C > 0', 'correct'],
      ['C > A > 0', 'gives the larger coefficient to the direction in which the curve is longer'],
      ['A = C > 0', 'the condition for a circle'],
      ['A > 0 > C', 'the condition for a hyperbola'],
    ],
    holds: ['A = 36/rx² and C = 36/ry² from the drawn ellipse (spec); each statement tested', [
      (c) => { const A = 36 / (k0(c).rx as number) ** 2; const C = 36 / (k0(c).ry as number) ** 2; return A > C && C > 0; },
      (c) => { const A = 36 / (k0(c).rx as number) ** 2; const C = 36 / (k0(c).ry as number) ** 2; return C > A && A > 0; },
      (c) => { const A = 36 / (k0(c).rx as number) ** 2; const C = 36 / (k0(c).ry as number) ** 2; return A === C && C > 0; },
      (c) => { const A = 36 / (k0(c).rx as number) ** 2; const C = 36 / (k0(c).ry as number) ** 2; return A > 0 && 0 > C; },
    ]],
    h: ['Put y = 0 in the equation to see what A has to do with the x-intercepts, then x = 0 for C and the y-intercepts.', 'A larger coefficient gives a smaller intercept: the intercepts are at x² = 36/A and y² = 36/C.'],
    s: 'Read from the figure: the curve is a closed oval crossing the x-axis at ±2 and the y-axis at ±3, so both coefficients are positive. With y = 0, Ax² = 36 gives 4A = 36, A = 9; with x = 0, 9C = 36 gives C = 4. So A > C > 0: the curve is narrower in the x-direction, where the coefficient is larger.',
  },
]);

/** ±: p·y² + q·x² = 36 written as text, with what it draws. */
interface TwoSq { text: string; kind: 'hyperbola' | 'ellipse'; axis?: 'x' | 'y'; a?: number }
const HYP_OPTS: TwoSq[] = [
  { text: '4y² − 9x² = 36', kind: 'hyperbola', axis: 'y', a: 3 },
  { text: '4x² − 9y² = 36', kind: 'hyperbola', axis: 'x', a: 3 },
  { text: '9y² − 4x² = 36', kind: 'hyperbola', axis: 'y', a: 2 },
  { text: '4y² + 9x² = 36', kind: 'ellipse' },
];
G('861f771f.lo-5', 'When the general form is a hyperbola', [
  {
    t: 'equation of a drawn hyperbola from the way it opens and its vertices', d: 3, need: 'reason',
    spec: conicG([-6, 6], [-6, 6], { type: 'hyperbola', center: [0, 0], a: 3, b: 2, axis: 'y' }),
    alt: 'A curve in two separate branches centred at the origin: one branch opens upward from a lowest point on the positive y-axis, the other opens downward from a highest point on the negative y-axis. The curve does not cross the x-axis.',
    q: 'The curve shown has two separate branches. Which equation has this curve as its graph?',
    o: [
      [HYP_OPTS[0].text, 'correct'],
      [HYP_OPTS[1].text, 'makes the x² term the positive one: these branches open left and right'],
      [HYP_OPTS[2].text, 'opens up and down, but its vertices are at (0, ±2)'],
      [HYP_OPTS[3].text, 'both squared terms have the same sign: an ellipse'],
    ],
    holds: ['each option (its kind, the axis of its positive squared term and its vertex distance, worked out beside the option) is compared with the drawn curve: conic_type, the spec\'s axis and conic_measure a', HYP_OPTS.map((e) => (c: Ctx) => e.kind === c.txt('conic_type') && e.axis === k0(c).axis && e.a === c.num('conic_measure', { want: 'a' }))],
    h: ['Two branches mean the squared terms have opposite signs. The branches open along the axis of the variable whose squared term is positive (when the constant side is positive).', 'Put x = 0 in each remaining equation to find where its graph meets the y-axis, and compare with the graph.'],
    s: 'Read from the figure: the curve has two branches that open up and down, with vertices at (0, 3) and (0, −3). So the y² term is the positive one, and x = 0 must give y = ±3. In 4y² − 9x² = 36, x = 0 gives y² = 9, y = ±3. In 9y² − 4x² = 36, x = 0 gives y = ±2; 4x² − 9y² = 36 opens left and right; 4y² + 9x² = 36 is an ellipse.',
  },
]);

// ── Parabola Equations from Focus and Directrix (expand pack 031) ───────────

G('bb35e95e.lo-1', 'A parabola as the points equally far from the focus and the directrix', [
  {
    t: 'distance to an undrawn focus from the distance to the directrix', d: 3, need: 'reason',
    spec: conicG([-6, 5], [-4, 5], { type: 'parabola', vertex: [-1, -2], p: 1, axis: 'y', show: { directrix: 'mark' } }, { points: [{ x: 3, y: 2, label: 'P' }] }),
    alt: 'A parabola on a grid that opens upward, with a horizontal dashed line a little below its lowest point. A point P is marked on the right-hand arm of the parabola. The focus is not drawn.',
    q: 'The dashed line is the directrix of the parabola shown; the focus is not drawn. The point P lies on the parabola. What is the distance from P to the focus?',
    n: '5',
    calc: ['the distance from the marked point P to the directrix y = k − p (spec) — equal to its distance from the focus; checked against the distance to the focus itself', (c) => { const [h, k] = pair(k0(c).vertex); const p = k0(c).p as number; const P0 = arr(c.p.points)[0]; const [x, y] = [P0.x as number, P0.y as number]; if (!near((x - h) ** 2, 4 * p * (y - k))) throw new Error('P is not on the parabola'); const toLine = Math.abs(y - (k - p)); if (!near(toLine, Math.hypot(x - h, y - (k + p)))) throw new Error('distances differ'); return toLine; }],
    h: ['You do not need to find the focus. What does the definition of a parabola say about every point on it?', 'Measure the distance from P straight down to the dashed line.'],
    s: 'Every point of a parabola is the same distance from the focus as from the directrix. Read from the figure: P is (3, 2) and the dashed line is y = −3, so P is 2 − (−3) = 5 units from the directrix. Its distance from the focus is therefore also 5. (Check: the vertex is (−1, −2), so the focus is (−1, −1), and √(4² + 3²) = 5.)',
  },
]);

G('bb35e95e.lo-2', 'Focus, directrix and the 4p of the equation', [
  {
    t: 'signed 4p from a marked focus and directrix', d: 3, need: 'calc',
    spec: conicG([-5, 9], [-6, 4], { type: 'parabola', vertex: [2, 1], p: -2, axis: 'y', show: { focus: 'mark', directrix: 'mark' } }),
    alt: 'A parabola on a grid that opens downward. A point F is marked inside the curve, below its highest point, and a horizontal dashed line runs above the curve. No coordinates are printed.',
    q: 'The figure shows a parabola, its focus F and its directrix (the dashed line). The equation of the parabola has the form (x − h)² = 4p(y − k). What is the value of 4p? Include its sign.',
    n: '-8',
    calc: ['4 × the signed p of the drawn parabola (conic_measure p)', (c) => 4 * c.num('conic_measure', { want: 'p' })],
    h: ['The size of p is the distance from the vertex to the focus — half the distance from the focus to the directrix.', 'The sign of p tells which way the parabola opens: in (x − h)² = 4p(y − k), a parabola that opens downward has a negative p.'],
    s: 'Read from the figure: the focus F is (2, −1) and the directrix is y = 3, a distance 4 apart, so the vertex is midway at (2, 1) and |p| = 2. The parabola opens downward (the focus is below the vertex), so p = −2 and 4p = −8. The equation is (x − 2)² = −8(y − 1).',
  },
]);

G('bb35e95e.lo-3', 'The vertex is midway between the focus and the directrix', [
  {
    t: 'where the undrawn directrix meets the axis, from the vertex and the focus', d: 3, need: 'reason',
    spec: conicG([-3, 7], [-5, 7], { type: 'parabola', vertex: [1, 1], p: 2, axis: 'x', show: { focus: 'mark' } }),
    alt: 'A parabola on a grid that opens to the right, with a point F marked inside the curve to the right of its turning point. The directrix is not drawn and no coordinates are printed.',
    q: 'The figure shows a parabola and its focus F. The directrix is not drawn. At which point does the directrix cross the parabola\'s axis of symmetry?',
    o: [
      ['(−1, 1)', 'correct'],
      ['(5, 1)', 'puts the directrix on the same side of the vertex as the focus'],
      ['(−3, 1)', 'steps back from the vertex by the whole focus-to-directrix distance'],
      ['(1, −1)', 'moves along the wrong direction, perpendicular to the axis'],
    ],
    calc: ['the reflection of the focus in the vertex: where the directrix (conic_line directrix) meets the axis (conic_line axis)', (c) => { const d = c.txt('conic_line', { want: 'directrix' }); const ax = c.txt('conic_line', { want: 'axis' }); const x = Number(d.replace('x = ', '').replace('−', '-')); const y = Number(ax.replace('y = ', '').replace('−', '-')); const [h, k] = pair(k0(c).vertex); const p = k0(c).p as number; if (!near(x, h - p) || !near(y, k)) throw new Error('directrix / axis do not agree with the spec'); return ptT(x, y); }],
    h: ['Read the vertex (the turning point of the curve) and the focus F from the grid.', 'The vertex lies exactly midway between the focus and the directrix, measured along the axis of symmetry.'],
    s: 'Read from the figure: the vertex is (1, 1) and the focus F is (3, 1), so the axis of symmetry is y = 1 and the focus is 2 units to the right of the vertex. The vertex is midway between the focus and the directrix, so the directrix is 2 units to the left of the vertex: the line x = −1, which crosses the axis at (−1, 1).',
  },
]);

G('bb35e95e.lo-4', 'The equation of a parabola from its focus and directrix', [
  {
    t: 'standard-form equation from a marked focus and directrix (sideways)', d: 3, need: 'calc',
    spec: conicG([-8, 3], [-4, 8], { type: 'parabola', vertex: [-1, 2], p: -2, axis: 'x', show: { focus: 'mark', directrix: 'mark' } }),
    alt: 'A parabola on a grid that opens to the left. A point F is marked inside the curve, to the left of its turning point, and a vertical dashed line runs to the right of the curve. No coordinates are printed.',
    q: 'The figure shows a parabola, its focus F and its directrix (the dashed line). Which is the equation of the parabola?',
    o: [
      ['(y − 2)² = −8(x + 1)', 'correct'],
      ['(y − 2)² = 8(x + 1)', 'loses the sign of p: this parabola opens to the right'],
      ['(y − 2)² = −2(x + 1)', 'writes p where 4p belongs'],
      ['(y − 2)² = −8(x + 3)', 'uses the focus in place of the vertex'],
    ],
    calc: ['the standard-form equation of the drawn parabola (conic_equation)', (c) => c.txt('conic_equation')],
    h: ['The vertex is midway between the focus and the dashed line; p is the signed distance from the vertex to the focus.', 'For a parabola that opens left or right the form is (y − k)² = 4p(x − h), where (h, k) is the vertex.'],
    s: 'Read from the figure: the focus F is (−3, 2) and the directrix is x = 1. The vertex is midway between them, at (−1, 2), and the focus is 2 units to the LEFT of the vertex, so p = −2 and 4p = −8. With (h, k) = (−1, 2): (y − 2)² = −8(x + 1).',
  },
]);

// ── Ellipse and Hyperbola Features (expand pack 046) ────────────────────────

G('e2ba29fa.lo-1', 'Standard forms of ellipses and hyperbolas', [
  {
    t: 'standard form of a drawn hyperbola from its vertices and central rectangle', d: 3, need: 'calc',
    spec: conicG([-8, 8], [-8, 8], { type: 'hyperbola', center: [0, 0], a: 3, b: 4, axis: 'x', show: { asymptotes: 'mark', box: 'mark' } }),
    alt: 'A curve in two branches centred at the origin, one opening to the right and one to the left. A rectangle centred at the origin is drawn between the branches, and two dashed diagonal lines pass through its corners; each branch approaches the dashed lines.',
    q: 'The figure shows a curve with its two asymptotes (dashed) and the central rectangle whose corners lie on the asymptotes. Which is the equation of the curve?',
    o: [
      ['x²/9 − y²/16 = 1', 'correct'],
      ['x²/9 − y²/4 = 1', 'right vertices, but takes the rectangle\'s half-height to be 2'],
      ['y²/9 − x²/16 = 1', 'makes the y² term the positive one: branches opening up and down'],
      ['x²/9 + y²/16 = 1', 'a plus sign: an ellipse'],
    ],
    calc: ['the standard-form equation of the drawn hyperbola (conic_equation)', (c) => c.txt('conic_equation')],
    h: ['Two branches mean a minus sign between the squared terms; the positive term belongs to the axis the branches open along, and its denominator is the square of the distance from the centre to a vertex.', 'The other denominator comes from the rectangle: it is the square of the rectangle\'s half-length in the other direction.'],
    s: 'Read from the figure: the branches open left and right with vertices at (±3, 0), so the x² term is positive with a² = 9. The central rectangle reaches up to y = 4 and down to y = −4 (the asymptotes pass through (3, 4) and (3, −4)), so b² = 16. The equation is x²/9 − y²/16 = 1.',
  },
]);

/** (X − h)²/· ± (Y − k)²/· = 1 options: text and the centre each one has. */
const CEN_OPTS: Array<{ text: string; center: [number, number] }> = [
  { text: '(x − 2)²/4 − (y + 3)²/9 = 1', center: [2, -3] },
  { text: '(x + 2)²/4 − (y − 3)²/9 = 1', center: [-2, 3] },
  { text: '(x − 3)²/4 − (y + 2)²/9 = 1', center: [3, -2] },
  { text: '(x − 2)²/4 − (y − 3)²/9 = 1', center: [2, 3] },
];
G('e2ba29fa.lo-2', 'The centre of an ellipse or hyperbola', [
  {
    t: 'hyperbola equation with the same centre as a drawn ellipse', d: 2, need: 'reason',
    spec: conicG([-2, 6], [-7, 1], { type: 'ellipse', center: [2, -3], rx: 2, ry: 3 }),
    alt: 'A closed oval curve on a grid, taller than it is wide, lying right of the y-axis and below the x-axis; it just touches both axes. Its centre is not marked.',
    q: 'The figure shows an ellipse. Which of these hyperbolas has the same centre as the ellipse shown?',
    o: [
      [CEN_OPTS[0].text, 'correct'],
      [CEN_OPTS[1].text, 'reads the signs inside the brackets as the signs of the centre'],
      [CEN_OPTS[2].text, 'swaps the x- and y-coordinates of the centre'],
      [CEN_OPTS[3].text, 'right x-coordinate, wrong sign on the y-coordinate'],
    ],
    holds: ['the centre of each option (written beside it) is compared with the centre of the drawn ellipse (conic_center)', CEN_OPTS.map((e) => (c: Ctx) => ptT(e.center[0], e.center[1]) === c.txt('conic_center'))],
    h: ['The centre of the ellipse is midway between its leftmost and rightmost points, and midway between its highest and lowest points.', 'In (x − h)² and (y − k)² the centre is (h, k): a bracket (y + 3) means k = −3.'],
    s: 'Read from the figure: the ellipse runs from x = 0 to x = 4 and from y = −6 to y = 0, so its centre is (2, −3). A hyperbola with centre (2, −3) has (x − 2)² and (y + 3)² in its equation: (x − 2)²/4 − (y + 3)²/9 = 1.',
  },
]);

/** Hyperbola options: the axis of the positive term, a, and the centre. */
const VTX_OPTS: Array<{ text: string; axis: 'x' | 'y'; a: number; center: [number, number] }> = [
  { text: '(y + 1)²/16 − (x − 1)²/4 = 1', axis: 'y', a: 4, center: [1, -1] },
  { text: '(x − 1)²/16 − (y + 1)²/4 = 1', axis: 'x', a: 4, center: [1, -1] },
  { text: '(y + 1)²/4 − (x − 1)²/16 = 1', axis: 'y', a: 2, center: [1, -1] },
  { text: '(y − 1)²/16 − (x + 1)²/4 = 1', axis: 'y', a: 4, center: [-1, 1] },
];
const vtxOf = (e: { axis: 'x' | 'y'; a: number; center: [number, number] }): string => [-1, 1].map((s) => (e.axis === 'x' ? ptT(e.center[0] + s * e.a, e.center[1]) : ptT(e.center[0], e.center[1] + s * e.a))).join(' ');
G('e2ba29fa.lo-3', 'Vertices of ellipses and hyperbolas', [
  {
    t: 'hyperbola equation with the same vertices as a drawn ellipse', d: 3, need: 'reason',
    spec: conicG([-3, 5], [-6, 4], { type: 'ellipse', center: [1, -1], rx: 2, ry: 4 }),
    alt: 'A closed oval curve on a grid, clearly taller than it is wide, lying mostly right of the y-axis and crossing the x-axis. Its centre and vertices are not marked.',
    q: 'The figure shows an ellipse. Which of these hyperbolas has the same two vertices as the ellipse shown (the endpoints of its major axis)?',
    o: [
      [VTX_OPTS[0].text, 'correct'],
      [VTX_OPTS[1].text, 'puts the positive term on x: its vertices are 4 to the left and right of the centre'],
      [VTX_OPTS[2].text, 'puts a² = 4 under the positive term: its vertices are only 2 from the centre'],
      [VTX_OPTS[3].text, 'wrong signs for the centre'],
    ],
    holds: ['the vertices of each option (from its positive term\'s axis, a and centre, written beside it) are compared with the vertices of the drawn ellipse (conic_point vertex 0 and 1)', VTX_OPTS.map((e) => (c: Ctx) => vtxOf(e) === `${c.txt('conic_point', { feature: 'vertex', which: 0 })} ${c.txt('conic_point', { feature: 'vertex', which: 1 })}`)],
    h: ['The vertices of the ellipse are the two ends of its longer axis: read their coordinates from the grid.', 'A hyperbola\'s vertices lie a units from its centre along the axis of its POSITIVE squared term, where a² is the denominator of that term.'],
    s: 'Read from the figure: the ellipse is tallest in the y-direction, with vertices (1, 3) and (1, −5); its centre is (1, −1). A hyperbola with these vertices has centre (1, −1), opens up and down (positive y term) and has a = 4, so a² = 16 is under (y + 1)²: (y + 1)²/16 − (x − 1)²/4 = 1.',
  },
]);

G('e2ba29fa.lo-4', 'Foci of ellipses and hyperbolas', [
  {
    t: 'foci of a drawn ellipse that is not centred at the origin', d: 3, need: 'calc',
    spec: conicG([-3, 7], [-5, 7], { type: 'ellipse', center: [2, 1], rx: 3, ry: 5 }),
    alt: 'A closed oval curve on a grid, taller than it is wide, lying mostly right of the y-axis and crossing the x-axis. Its centre, vertices and foci are not marked.',
    q: 'The figure shows an ellipse. What are the coordinates of its foci?',
    o: [
      ['(2, −3) and (2, 5)', 'correct'],
      ['(−2, 1) and (6, 1)', 'puts the foci on the shorter axis'],
      ['(2, 1 − √34) and (2, 1 + √34)', 'uses c² = a² + b², the rule for a hyperbola'],
      ['(2, −4) and (2, 4)', 'measures c from the x-axis instead of from the centre'],
    ],
    calc: ['the two foci of the drawn ellipse (conic_point focus 0 and 1)', (c) => `${c.txt('conic_point', { feature: 'focus', which: 0 })} and ${c.txt('conic_point', { feature: 'focus', which: 1 })}`],
    h: ['Read the centre and the two semi-axes: a is half the longer axis and b is half the shorter one.', 'For an ellipse c² = a² − b², and the foci lie c units from the centre along the LONGER axis.'],
    s: 'Read from the figure: the ellipse runs from x = −1 to x = 5 and from y = −4 to y = 6, so its centre is (2, 1), a = 5 (vertical) and b = 3. Then c² = 25 − 9 = 16, c = 4. The foci are 4 units above and below the centre: (2, 5) and (2, −3).',
  },
]);

// ── Compound Event Probability Calculations (expand pack 025) ───────────────

const V1: Array<[string, (c: Ctx) => boolean]> = [
  ['n(P ∪ Q) = 35', (c) => c.num('venn_count', { want: 'union', sets: ['P', 'Q'] }) === 35],
  ['n(P′) = 20', (c) => c.num('venn_count', { want: 'complement', sets: ['P'] }) === 20],
  ['n(P ∩ Q′) = 14', (c) => c.num('venn_count', { want: 'only', sets: ['P'] }) === 14],
  ['n((P ∪ Q)′) = 11', (c) => c.num('venn_count', { want: 'neither' }) === 11],
];
G('9a3d4b75.lo-1', 'Union, intersection and complement on a Venn diagram', [
  {
    t: 'find the false statement about unions, intersections and complements', d: 3, need: 'reason',
    spec: venn(['P', 'Q'], [{ in: ['P'], value: 14 }, { in: ['P', 'Q'], value: 6 }, { in: ['Q'], value: 9 }, { in: [], value: 11 }]),
    alt: 'Two overlapping circles named P and Q inside a rectangle. A whole number is printed in each of the four regions: in P only, in the overlap, in Q only, and outside both circles.',
    q: 'The Venn diagram shows the number of students in each region for two events P and Q. Here n(X) means the number of students in X, and X′ means "not in X". Which statement is FALSE?',
    o: [
      [V1[0][0], 'correct'],
      [V1[1][0], 'forgets that the complement of P includes the students outside both circles'],
      [V1[2][0], 'takes "P and not Q" to include the overlap'],
      [V1[3][0], 'does not see that "not in P or Q" is the region outside both circles'],
    ],
    holds: ['each statement tested on the regions (venn_count); an option answers the question when its statement is false', V1.map(([, f]) => (c: Ctx) => !f(c))],
    h: ['Translate each statement into regions of the diagram: ∪ means "in at least one", ∩ means "in both", and ′ means "outside".', 'For the union, count each region once — the overlap belongs to both circles but is only one group of students.'],
    s: 'Read from the figure: 14 in P only, 6 in both, 9 in Q only and 11 in neither. P′ is everything outside P: 9 + 11 = 20 (true). P ∩ Q′ is P only: 14 (true). (P ∪ Q)′ is outside both: 11 (true). P ∪ Q is 14 + 6 + 9 = 29, not 35 — 35 comes from adding n(P) = 20 and n(Q) = 15, which counts the overlap twice. That statement is false.',
  },
]);

G('9a3d4b75.lo-2', 'The addition rule on a Venn diagram', [
  {
    t: 'P(S) from a stated union probability and two hidden regions', d: 3, need: 'calc',
    spec: venn(['M', 'S'], [{ in: ['M'], value: 12 }, { in: ['M', 'S'], value: 8 }, { in: ['S'], value: 20, show: 'blank' }, { in: [], value: 10, show: 'blank' }], { universeLabel: '50 students' }),
    alt: 'Two overlapping circles named M and S inside a rectangle labelled 50 students. A number is printed in the region for M only and in the overlap; the region for S only and the region outside both circles each show a question mark.',
    hide: [20, 10],
    q: 'The Venn diagram shows 50 students: M is the event "plays a musical instrument" and S is the event "plays a sport". Two of the regions are hidden. For a student chosen at random, P(M or S) = 0.8. What is P(S)? Give your answer as a decimal.',
    n: '0.56',
    calc: ['(overlap + S only) ÷ total from the spec\'s regions, after checking that the regions total 50 and that the union is 0.8 of them', (c) => { const total = vennTotal(c); if (total !== 50) throw new Error('total is not 50'); if (!near((reg(c, 'M') + reg(c, 'M', 'S') + reg(c, 'S')) / total, 0.8)) throw new Error('union is not 0.8'); return (reg(c, 'M', 'S') + reg(c, 'S')) / total; }],
    h: ['Turn P(M or S) into a number of students, then use the two printed regions to find how many are in S only.', 'P(S) counts everyone inside circle S — including the students in the overlap.'],
    s: 'P(M or S) = 0.8 means 0.8 × 50 = 40 students are in at least one circle. Read from the figure: 12 are in M only and 8 are in both, so S only holds 40 − 12 − 8 = 20. Then n(S) = 8 + 20 = 28 and P(S) = 28/50 = 0.56. (Check with the addition rule: P(M) + P(S) − P(M and S) = 0.40 + 0.56 − 0.16 = 0.80.)',
  },
]);

G('9a3d4b75.lo-4', 'Complements on a Venn diagram', [
  {
    t: 'probability of "not both" through the complement, three sets', d: 3, need: 'calc',
    spec: venn(['Band', 'Choir', 'Drama'], [{ in: ['Band'], value: 10 }, { in: ['Choir'], value: 9 }, { in: ['Drama'], value: 7 }, { in: ['Band', 'Choir'], value: 5 }, { in: ['Band', 'Drama'], value: 4 }, { in: ['Choir', 'Drama'], value: 6 }, { in: ['Band', 'Choir', 'Drama'], value: 3 }, { in: [], value: 6 }], { universeLabel: '50 students' }),
    alt: 'Three overlapping circles named Band, Choir and Drama inside a rectangle labelled 50 students. A whole number is printed in each of the eight regions, including the centre where all three overlap and the region outside all the circles.',
    q: 'The Venn diagram shows how many of 50 students are in the band, the choir and the drama club. One student is chosen at random. What is the probability that the student is NOT a member of both the band and the choir — that is, the student is missing from at least one of these two groups? Give your answer as a decimal.',
    n: '0.84',
    calc: ['1 − (the two regions inside both Band and Choir) ÷ total, from the spec\'s regions; the total checked to be 50', (c) => { const total = vennTotal(c); if (total !== 50) throw new Error('total is not 50'); return 1 - (reg(c, 'Band', 'Choir') + reg(c, 'Band', 'Choir', 'Drama')) / total; }],
    h: ['It is quicker to find the probability of the opposite event — the student IS in both the band and the choir — and subtract it from 1.', 'The overlap of the Band and Choir circles is made of two regions: one of them is also inside Drama.'],
    s: 'Use the complement. Read from the figure: the overlap of Band and Choir is made of two regions, 5 (band and choir only) and 3 (all three), so 8 students are in both. P(in both) = 8/50 = 0.16, so P(not in both) = 1 − 0.16 = 0.84.',
  },
]);

G('9a3d4b75.lo-3', 'The multiplication rule on a tree diagram', [
  {
    t: 'probability of exactly one success over two paths, one branch hidden', d: 3, need: 'calc',
    spec: ptree([
      { label: 'Pass', p: 0.6, children: [{ label: 'Pass', p: 0.7 }, { label: 'Fail', p: 0.3, show: 'blank' }] },
      { label: 'Fail', p: 0.4, children: [{ label: 'Pass', p: 0.5 }, { label: 'Fail', p: 0.5 }] },
    ], { stageTitles: ['Test 1', 'Test 2'] }),
    alt: 'A tree diagram with two stages headed Test 1 and Test 2. Each stage splits into Pass and Fail. A probability is printed on every branch except the Fail branch that follows a pass on Test 1, which shows a question mark.',
    hide: [0.3],
    q: 'The tree diagram shows the probabilities that a learner driver passes or fails two tests; one probability is hidden. What is the probability that the driver passes exactly one of the two tests? Give your answer as a decimal.',
    n: '0.38',
    calc: ['P(Pass, Fail) + P(Fail, Pass) from tree_path', (c) => c.num('tree_path', { path: ['Pass', 'Fail'] }) + c.num('tree_path', { path: ['Fail', 'Pass'] })],
    h: ['Two different paths through the tree give exactly one pass. Which are they?', 'The branches that leave one point add to 1 — use that for the hidden branch. Multiply along each path, then add the two results.'],
    s: 'Read from the figure: P(pass Test 1) = 0.6 and P(fail Test 1) = 0.4; after a pass, P(pass Test 2) = 0.7, so the hidden branch is 1 − 0.7 = 0.3; after a fail, P(pass Test 2) = 0.5. Exactly one pass: Pass then Fail = 0.6 × 0.3 = 0.18, or Fail then Pass = 0.4 × 0.5 = 0.20. Total: 0.18 + 0.20 = 0.38.',
  },
]);

// ── Conditional Probability Two-Way Tables (expand pack 024) ────────────────

G('9a2d1f9c.lo-2', 'Conditional probability from a tree diagram', [
  {
    t: 'reversed conditional probability from a two-stage tree', d: 3, need: 'calc',
    spec: ptree([
      { label: 'Faulty', p: 0.2, children: [{ label: 'Flagged', p: 0.9 }, { label: 'Cleared', p: 0.1 }] },
      { label: 'Sound', p: 0.8, children: [{ label: 'Flagged', p: 0.15 }, { label: 'Cleared', p: 0.85 }] },
    ], { stageTitles: ['Part', 'Scanner'] }),
    alt: 'A tree diagram with two stages headed Part and Scanner. The first stage splits into Faulty and Sound; each of these splits into Flagged and Cleared. A probability is printed on every branch.',
    q: 'A factory scanner checks every part. The tree diagram shows the probability that a part is faulty or sound, and then the probability that the scanner flags it or clears it. A part is chosen at random and it has been flagged. What is the probability that it is faulty? Give your answer as a decimal.',
    n: '0.6',
    calc: ['P(Faulty and Flagged) ÷ [P(Faulty and Flagged) + P(Sound and Flagged)] from tree_path; checked against tree_conditional', (c) => { const ff = c.num('tree_path', { path: ['Faulty', 'Flagged'] }); const sf = c.num('tree_path', { path: ['Sound', 'Flagged'] }); const v = ff / (ff + sf); const t = c.num('tree_conditional', { label: 'Faulty', stage: 1, givenLabel: 'Flagged' }); if (!near(v, t, 1e-9)) throw new Error(`tree_conditional gives ${t}`); return round(v, 10); }],
    h: ['The condition "it has been flagged" restricts the sample space to the two paths that end in Flagged. Find the probability of each path.', 'P(faulty | flagged) = P(faulty and flagged) ÷ P(flagged), where P(flagged) is the sum of both Flagged paths.'],
    s: 'Read from the figure: P(Faulty) = 0.2 with P(Flagged | Faulty) = 0.9, and P(Sound) = 0.8 with P(Flagged | Sound) = 0.15. P(faulty and flagged) = 0.2 × 0.9 = 0.18; P(sound and flagged) = 0.8 × 0.15 = 0.12; so P(flagged) = 0.30. Then P(faulty | flagged) = 0.18 / 0.30 = 0.6.',
  },
]);

G('9a2d1f9c.lo-3', 'Independence on a tree diagram', [
  {
    t: 'joint probability when independence fixes two hidden branches', d: 3, need: 'calc',
    spec: ptree([
      { label: 'Senior', p: 0.4, children: [{ label: 'Bus', p: 0.35, show: 'blank' }, { label: 'Car', p: 0.65, show: 'blank' }] },
      { label: 'Junior', p: 0.6, children: [{ label: 'Bus', p: 0.35 }, { label: 'Car', p: 0.65 }] },
    ], { stageTitles: ['Year group', 'Travel'] }),
    alt: 'A tree diagram with two stages headed Year group and Travel. The first stage splits into Senior and Junior; each of these splits into Bus and Car. Probabilities are printed on the first-stage branches and on the two branches after Junior; the two branches after Senior show question marks.',
    q: 'The tree diagram shows the year group of a randomly chosen student and how the student travels to school; two probabilities are hidden. The events "the student is a senior" and "the student travels by bus" are independent. What is the probability that the student is a senior who travels by bus? Give your answer as a decimal.',
    n: '0.14',
    calc: ['independence requires P(Bus | Senior) = P(Bus | Junior): checked on the spec\'s own branches; then P(Senior) × that value (the figure alone does not settle the hidden branches — the independence stated in the stem does)', (c) => { const [sen, jun] = arr(c.p.branches); const pb = (n: P): number => arr(n.children).find((x) => x.label === 'Bus')!.p as number; if (!near(pb(sen), pb(jun))) throw new Error('the tree is not independent'); return round((sen.p as number) * pb(sen), 10); }],
    h: ['If two events are independent, knowing that one happened does not change the probability of the other. What does that say about P(Bus | Senior) and P(Bus | Junior)?', 'Once you know the hidden Bus branch, multiply along the path Senior → Bus.'],
    s: 'Independence means the probability of travelling by bus is the same whatever the year group. Read from the figure: P(Bus | Junior) = 0.35, so the hidden branch P(Bus | Senior) is also 0.35; and P(Senior) = 0.4. Then P(senior and bus) = 0.4 × 0.35 = 0.14.',
  },
]);
}

// ════════════════════════════════════════════════════════════════════════════
// PRECALCULUS — conics and line–conic systems
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// PRECALCULUS — conics (part "pcm"): nonlinear systems, hyperbolas, ellipses,
// classifying from general form, circles and parabolas
// ════════════════════════════════════════════════════════════════════════════

type Z = [number, number];
/** A conic graph on a unit grid. */
const cg = (xRange: Z, yRange: Z, conics: P[], extra: P = {}): Spec => S('conic_graph', { xRange, yRange, xStep: 1, yStep: 1, conics, ...extra });
const K = (c: Ctx, i = 0): P => arr(c.p.conics)[i];
const LN = (c: Ctx, i = 0): P => arr(c.p.lines)[i];
/** "(−3, 4)" as a checker prints it → [−3, 4]. */
const parsePt = (t: string): Z => { const m = t.replace(/−/g, '-').match(/^\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/); if (!m) throw new Error(`not a point: ${t}`); return [Number(m[1]), Number(m[2])]; };
const ptText = ([x, y]: Z): string => `(${minus(x)}, ${minus(y)})`;
const samePts = (a: Z[], b: Z[]): boolean => a.length === b.length && a.every((p) => b.some((q) => near(p[0], q[0], 1e-6) && near(p[1], q[1], 1e-6)));
/** Points on a conic, from ITS OWN params in the spec. */
const ptsOn = (k: P): Z[] => {
  const ts = [-1.1, -0.6, -0.2, 0.3, 0.7, 1.2];
  if (k.type === 'circle' || k.type === 'ellipse') {
    const [h, kk] = k.center as Z;
    const [sx, sy] = k.type === 'circle' ? [k.radius as number, k.radius as number] : [k.rx as number, k.ry as number];
    return [0.2, 0.9, 1.7, 2.6, 3.4, 4.3, 5.1, 5.9].map((t) => [h + sx * Math.cos(t), kk + sy * Math.sin(t)] as Z);
  }
  if (k.type === 'hyperbola') {
    const [h, kk] = k.center as Z;
    const [a, b] = [k.a as number, k.b as number];
    return [-1, 1].flatMap((s) => ts.map((t) => (k.axis === 'x' ? [h + s * a * Math.cosh(t), kk + b * Math.sinh(t)] : [h + b * Math.sinh(t), kk + s * a * Math.cosh(t)]) as Z));
  }
  const [h, kk] = k.vertex as Z;
  const p = k.p as number;
  return ts.map((t) => (k.axis === 'y' ? [h + 3 * t, kk + (9 * t * t) / (4 * p)] : [h + (9 * t * t) / (4 * p), kk + 3 * t]) as Z);
};
/** A·x² + C·y² + D·x + E·y + F = 0. */
interface Gen { A: number; C: number; D?: number; E?: number; F: number }
const genF = (g: Gen) => (x: number, y: number): number => g.A * x * x + g.C * y * y + (g.D ?? 0) * x + (g.E ?? 0) * y + g.F;
/** Is the equation that of the drawn conic? Tested at points of the conic taken from the spec (and it must be a curve, not everything). */
const isGraphOf = (k: P, g: Gen): boolean => (g.A !== 0 || g.C !== 0) && ptsOn(k).every(([x, y]) => Math.abs(genF(g)(x, y)) < 1e-6 * (1 + Math.abs(g.F) + Math.abs(g.A) * x * x + Math.abs(g.C) * y * y));
const poly = (ts: Array<[number, string]>): string => { let s = ''; for (const [co, v] of ts) { if (!co) continue; const m = Math.abs(co); const body = `${m === 1 && v ? '' : m}${v}`; s += s ? ` ${co < 0 ? '−' : '+'} ${body}` : `${co < 0 ? '−' : ''}${body}`; } return s; };
/** The equation as text: "4x² + y² − 8x − 12 = 0", or with the constant on the right "x² + 4y² = 16". */
const genText = (g: Gen, right = false): string => (right ? `${poly([[g.A, 'x²'], [g.C, 'y²'], [g.D ?? 0, 'x'], [g.E ?? 0, 'y']])} = ${minus(-g.F)}` : `${poly([[g.A, 'x²'], [g.C, 'y²'], [g.D ?? 0, 'x'], [g.E ?? 0, 'y'], [g.F, '']])} = 0`);
const sh = (v: string, by: number): string => (by === 0 ? v : `(${v} ${by > 0 ? '−' : '+'} ${Math.abs(by)})`);
/** (x − h)² + (y − k)² = c. */
interface Circ { h: number; k: number; c: number }
const circText = (o: Circ): string => `${sh('x', o.h)}² + ${sh('y', o.k)}² = ${o.c}`;
/** (x − h)²/p + (y − k)²/q = 1. */
interface Ell { h: number; k: number; p: number; q: number }
const ellText = (o: Ell): string => `${sh('x', o.h)}²/${o.p} + ${sh('y', o.k)}²/${o.q} = 1`;
const ellVertices = (o: Ell): Z[] => (o.p > o.q ? [[o.h - Math.sqrt(o.p), o.k], [o.h + Math.sqrt(o.p), o.k]] : [[o.h, o.k - Math.sqrt(o.q)], [o.h, o.k + Math.sqrt(o.q)]]);
/** A ratio of small whole numbers as "p/q" in lowest terms (refused when it is not one). */
const asFraction = (v: number): string => { for (let q = 1; q <= 12; q++) if (near(v * q, Math.round(v * q), 1e-9)) return q === 1 ? String(Math.round(v)) : `${Math.round(v * q)}/${q}`; throw new Error(`${v} is not a ratio of small whole numbers`); };
/** base ± m√n as text and as a number. */
const surd = (base: number, m: number, n: number): { t: string; v: number } => ({ t: `${minus(base)} ${m < 0 ? '−' : '+'} ${Math.abs(m)}√${n}`, v: base + m * Math.sqrt(n) });

// ── Nonlinear systems of equations (pack topup5/071) ────────────────────────

{
  const sys: Array<[[Gen, Gen], string]> = [
    [[{ A: 1, C: 4, F: -16 }, { A: -1, C: 1, F: -1 }], 'correct'],
    [[{ A: 4, C: 1, F: -16 }, { A: -1, C: 1, F: -1 }], 'takes the larger coefficient to go with the longer axis, which makes the closed curve taller than it is wide'],
    [[{ A: 1, C: 4, F: -16 }, { A: 1, C: -1, F: -1 }], 'puts the positive sign on x², which makes the branches open left and right'],
    [[{ A: 1, C: -4, F: -16 }, { A: 1, C: 1, F: -1 }], 'exchanges the signs of the two equations: a hyperbola and a small circle'],
  ];
  const sysText = ([e, h]: [Gen, Gen]): string => `${genText(e, true)} and ${poly([[h.C, 'y²'], [h.A, 'x²']]).replace(/^−(\S+) \+ (\S+)$/, '$2 − $1')} = ${minus(-h.F)}`;
  G('20c673c2.lo-1', 'The equations of two drawn conics', [
    {
      t: 'pick the pair of equations of a drawn two-conic system', d: 3, need: 'reason',
      spec: cg([-6, 6], [-5, 5], [{ type: 'ellipse', center: [0, 0], rx: 4, ry: 2 }, { type: 'hyperbola', center: [0, 0], a: 1, b: 1, axis: 'y' }]),
      alt: 'A closed oval curve centred at the origin, wider than it is tall, and a second curve with two separate branches, one opening upward and one downward, each crossing the oval twice.',
      q: 'The figure shows the two curves of a nonlinear system, both centred at the origin. Which pair of equations is the system?',
      o: sys.map(([g, why]) => [sysText(g), why] as [string, string]),
      holds: ['each option\'s first equation tested on points of the drawn closed curve and its second on points of the drawn two-branch curve (points from the spec\'s params)', sys.map(([g]) => (c: Ctx) => isGraphOf(K(c, 0), g[0]) && isGraphOf(K(c, 1), g[1]))],
      h: ['Name each curve first: a closed oval has x² and y² with the same sign but different coefficients; a curve with two branches has them with opposite signs.', 'Test a point you can read on each curve — an end of the oval on the x-axis, and a turning point of a branch — in the equations.'],
      s: 'Read from the figure: the closed curve is an ellipse through (±4, 0) and (0, ±2), so x²/16 + y²/4 = 1, which is x² + 4y² = 16. The other curve is a hyperbola whose branches turn at (0, 1) and (0, −1), so the y² term is the positive one: y² − x² = 1. The system is x² + 4y² = 16 and y² − x² = 1.',
    },
  ]);
}

G('20c673c2.lo-2', 'Substituting a drawn line into a drawn circle', [
  {
    t: 'constant term of the quadratic that the substitution gives', d: 3, need: 'calc',
    spec: cg([-7, 7], [-6, 6], [{ type: 'circle', center: [0, 0], radius: 5 }], { lines: [{ slope: -0.5, intercept: 2.5 }] }),
    alt: 'A circle centred at the origin and a straight line that slopes gently down from left to right and cuts the circle at two points, one on the positive x-axis and one in the second quadrant.',
    q: 'The figure shows the circle and the line of a nonlinear system; the circle is centred at the origin. The line\'s equation is substituted into the circle\'s equation and the result is simplified to the form x² + bx + c = 0. What is the value of c? (Include the sign if it is negative.)',
    n: '-15',
    calc: ['the product of the x-coordinates of the two intersection points (conic_line_intersections): the roots of x² + bx + c = 0', (c) => { if (c.num('conic_line_intersections', { want: 'count' }) !== 2) throw new Error('not two points'); const [p0, p1] = [0, 1].map((w) => parsePt(c.txt('conic_line_intersections', { want: 'point', which: w }))); return p0[0] * p1[0]; }],
    h: ['Read the radius to write the circle\'s equation, and read two grid points on the line to write the line\'s equation.', 'The two x-values where the line meets the circle are the roots of the quadratic, so they can be used to check your b and c.'],
    s: 'Read from the figure: the circle has radius 5, so x² + y² = 25; the line passes through (5, 0) and (−3, 4), so its slope is −1/2 and x = 5 − 2y, or y = (5 − x)/2. Substituting: x² + (5 − x)²/4 = 25, so 4x² + 25 − 10x + x² = 100, 5x² − 10x − 75 = 0, and x² − 2x − 15 = 0. So c = −15 (the roots are x = 5 and x = −3, the two crossing points, and 5 × (−3) = −15).',
  },
]);

G('20c673c2.lo-3', 'Eliminating y between a drawn parabola and a drawn line', [
  {
    t: 'the constant left after eliminating y, from the vertex and the intercept', d: 3, need: 'calc',
    spec: cg([-5, 5], [-6, 6], [{ type: 'parabola', vertex: [0, 5], p: -0.25, axis: 'y' }], { lines: [{ slope: -1, intercept: -1 }] }),
    alt: 'A parabola that opens downward with its turning point on the positive y-axis, and a straight line falling from left to right that crosses the parabola at two points, one in the second quadrant and one in the fourth.',
    q: 'The figure shows a system: a parabola with equation x² + y = k and a line with equation x + y = m, where k and m are constants. Subtracting the second equation from the first eliminates y and leaves x² − x = n. What is the value of n?',
    n: '6',
    calc: ['k − m, where k is the height of the parabola\'s vertex and m the line\'s y-intercept (spec; the parabola must be y = k − x² and the line of slope −1) — checked at a crossing point (conic_line_intersections)', (c) => { const k = K(c); const l = LN(c); if (!near(k.p as number, -0.25) || (k.vertex as Z)[0] !== 0 || l.slope !== -1) throw new Error('not x² + y = k and x + y = m'); const nn = (k.vertex as Z)[1] - (l.intercept as number); const [x] = parsePt(c.txt('conic_line_intersections', { want: 'point', which: 1 })); if (!near(x * x - x, nn)) throw new Error('the crossing point disagrees'); return nn; }],
    h: ['Put x = 0 into each equation: k is where the parabola meets the y-axis and m is where the line meets it.', 'Subtracting x + y = m from x² + y = k gives x² − x on the left; work out what is left on the right.'],
    s: 'Read from the figure: the parabola meets the y-axis at its vertex (0, 5), so k = 5; the line meets the y-axis at (0, −1), so m = −1. Subtracting, (x² + y) − (x + y) = k − m, so x² − x = 5 − (−1) = 6. Check: the curves cross at x = 3 and x = −2, and 9 − 3 = 6, 4 + 2 = 6. So n = 6.',
  },
]);

G('20c673c2.lo-4', 'A drawn circle and a drawn parabola', [
  {
    t: 'the root of the eliminated quadratic that gives no real point', d: 3, need: 'calc',
    spec: cg([-7, 7], [-6, 6], [{ type: 'circle', center: [0, 0], radius: 5 }, { type: 'parabola', vertex: [-1, 0], p: 1, axis: 'x' }]),
    alt: 'A circle centred at the origin and a parabola that opens to the right with its turning point on the negative x-axis, just left of the origin. The parabola crosses the circle at two points, one above the x-axis and one below it, on the right-hand side.',
    q: 'The figure shows the circle and the parabola of a nonlinear system. The circle is centred at the origin and the parabola has its vertex at (−1, 0). Eliminating y² from the two equations gives a quadratic equation in x. One of its roots is the x-coordinate shared by the two intersection points. What is its other root, which gives no real point? (Include the sign if it is negative.)',
    n: '-7',
    calc: ['the roots of x² + 4p(x − h) − r² = 0 (r, p, h from the spec); the root at which y² = 4p(x − h) is negative. The two curves must cross at exactly two points (conic_conic_intersections)', (c) => { const r = K(c, 0).radius as number; const p = K(c, 1).p as number; const h = (K(c, 1).vertex as Z)[0]; if (c.num('conic_conic_intersections') !== 2) throw new Error('not two crossings'); const disc = Math.sqrt(16 * p * p + 4 * (4 * p * h + r * r)); const roots = [(-4 * p - disc) / 2, (-4 * p + disc) / 2]; const lost = roots.filter((x) => 4 * p * (x - h) < 0); if (lost.length !== 1) throw new Error('not exactly one lost root'); return round(lost[0], 9); }],
    h: ['Write both equations from the figure: the circle from its radius, the parabola as y² = a(x + 1), finding a from a grid point the parabola passes through.', 'Replace y² in the circle\'s equation by the parabola\'s expression for it, then solve the quadratic in x; one root matches the crossing points you can see.'],
    s: 'Read from the figure: the circle has radius 5, so x² + y² = 25. The parabola has vertex (−1, 0) and passes through (0, 2) and (3, 4), so y² = 4(x + 1). Substituting for y²: x² + 4x + 4 = 25, so x² + 4x − 21 = 0 and (x − 3)(x + 7) = 0. The root x = 3 gives the two crossing points (3, 4) and (3, −4). The other root, x = −7, would need y² = 4(−6) = −24, so it gives no real point. The answer is −7.',
  },
]);

G('20c673c2.lo-5', 'Solutions as the points where drawn curves meet', [
  {
    t: 'count the solutions of three line–ellipse systems', d: 2, need: 'read',
    spec: cg([-6, 6], [-5, 5], [{ type: 'ellipse', center: [0, 0], rx: 4, ry: 2 }], { lines: [{ slope: 0, intercept: 2 }, { slope: -0.5, intercept: -1 }, { slope: 1, intercept: 6 }] }),
    alt: 'A closed oval curve centred at the origin, wider than it is tall, with three straight lines: a horizontal line resting on the very top of the oval, a line sloping gently downward that passes through the oval, and a steep rising line in the upper left corner that stays clear of the oval.',
    q: 'The figure shows an ellipse and three lines. Each line, taken with the ellipse, is a system of two equations. How many real solutions (x, y) do the three systems have in total?',
    n: '3',
    calc: ['the sum over the three lines of the number of points each shares with the ellipse (conic_line_intersections, count)', (c) => [0, 1, 2].reduce((t, i) => t + c.num('conic_line_intersections', { line: i, want: 'count' }), 0)],
    h: ['A real solution of a system is a point that lies on both graphs.', 'Take the lines one at a time: a line can miss the ellipse, touch it at a single point, or cut through it.'],
    s: 'Read from the figure: the horizontal line y = 2 touches the ellipse only at its highest point (0, 2) — one solution. The line sloping downward cuts through the ellipse at two points — two solutions. The steep line in the upper left never reaches the ellipse — no solution. In total 1 + 2 + 0 = 3.',
  },
  {
    t: 'where a shifted line becomes tangent to the circle', d: 4, need: 'reason',
    spec: cg([-7, 7], [-7, 7], [{ type: 'circle', center: [0, 0], radius: 5 }], { lines: [{ slope: 4 / 3, intercept: -1 }] }),
    alt: 'A circle centred at the origin and a steep straight line rising from left to right that cuts through the circle at two points, passing a little below the origin.',
    q: 'The figure shows a circle centred at the origin and a line that meets it at two points. The line is moved straight up, keeping its slope, until the system formed by the line and the circle has exactly one solution. What is that solution?',
    o: [['(−4, 3)', 'correct'], ['(4, −3)', 'the point of tangency when the line is moved down instead of up'], ['(−3, 4)', 'exchanges the coordinates: the tangent there has slope 3/4, not 4/3'], ['(0, 5)', 'takes the top of the circle, where the tangent is horizontal']],
    holds: ['for each option: the point is on the circle, the tangent there (perpendicular to the radius) has the line\'s slope, and the parallel line through it lies above the drawn line (spec params)', [[-4, 3], [4, -3], [-3, 4], [0, 5]].map(([x, y]) => (c: Ctx) => { const r = K(c).radius as number; const m = LN(c).slope as number; return near(x * x + y * y, r * r) && y !== 0 && near(-x / y, m) && y - m * x > (LN(c).intercept as number); })],
    h: ['A system of a line and a circle has exactly one solution when the line is tangent to the circle, and a tangent is perpendicular to the radius at the point where it touches.', 'Read the slope of the line from two grid points; the radius to the point of tangency has the negative reciprocal slope, and the circle\'s radius tells you how far along it to go.'],
    s: 'Read from the figure: the circle has radius 5 and the line passes through (0, −1) and (3, 3), so its slope is 4/3. One solution means the line is tangent, and the radius to the point of tangency is perpendicular to it: slope −3/4. The points of the circle on the line y = −(3/4)x through the origin are (−4, 3) and (4, −3), since 16 + 9 = 25. Moving the line up brings it to the upper of the two, (−4, 3).',
  },
]);

// ── Hyperbola Analysis from Equations (pack expand/267) ─────────────────────

G('2753d0ea.lo-1', 'The standard form of a drawn hyperbola', [
  {
    t: 'pick the standard-form equation of a drawn vertical hyperbola', d: 3, need: 'reason',
    spec: cg([-7, 9], [-8, 6], [{ type: 'hyperbola', center: [1, -1], a: 2, b: 3, axis: 'y', show: { asymptotes: 'mark' } }]),
    alt: 'A hyperbola with one branch opening upward and one opening downward, centred to the right of and below the origin, with its two dashed asymptotes crossing between the branches. No equation is printed.',
    q: 'The figure shows a hyperbola and its asymptotes (dashed). Which equation is the standard form of this hyperbola?',
    o: [['(y + 1)²/4 − (x − 1)²/9 = 1', 'correct'], ['(x − 1)²/9 − (y + 1)²/4 = 1', 'puts the x-term first: the same asymptotes, but branches that open left and right'], ['(y + 1)²/9 − (x − 1)²/4 = 1', 'exchanges a² and b²: the branches would turn 3 units from the centre'], ['(y − 1)²/4 − (x + 1)²/9 = 1', 'takes the signs in the brackets from the centre\'s coordinates without changing them']],
    calc: ['the standard-form equation of the drawn hyperbola (conic_equation)', (c) => c.txt('conic_equation')],
    h: ['The branches open up and down, so the y-term is the positive one; the centre is where the asymptotes cross.', 'The distance from the centre to a turning point is a. The asymptotes of this form have slopes ±a/b — read the slope from grid points to get b.'],
    s: 'Read from the figure: the asymptotes cross at the centre (1, −1); the branches open up and down and turn at (1, 1) and (1, −3), so a = 2 and the y-term comes first. The asymptote through (1, −1) and (4, 1) has slope 2/3 = a/b, so b = 3. The equation is (y + 1)²/4 − (x − 1)²/9 = 1.',
  },
]);

G('2753d0ea.lo-2', 'The centre of a drawn hyperbola', [
  {
    t: 'centre from the asymptotes and the turning points', d: 2, need: 'read',
    spec: cg([-8, 4], [-3, 5], [{ type: 'hyperbola', center: [-2, 1], a: 2, b: 1, axis: 'x', show: { asymptotes: 'mark' } }]),
    alt: 'A hyperbola with one branch opening to the left and one to the right, lying mostly to the left of the y-axis and above the x-axis, with its two dashed asymptotes crossing between the branches. The centre is not marked.',
    q: 'The figure shows a hyperbola and its asymptotes (dashed). What is the centre of the hyperbola?',
    o: [['(−2, 1)', 'correct'], ['(2, −1)', 'reverses both signs, as if reading them from the brackets of the equation'], ['(1, −2)', 'exchanges the coordinates and their signs'], ['(0, 1)', 'takes the turning point of the right-hand branch']],
    ck: ['conic_center', {}],
    h: ['The centre of a hyperbola is the point where its two asymptotes cross.', 'It is also the midpoint of the two points where the branches turn — use one to check the other.'],
    s: 'Read from the figure: the two dashed asymptotes cross at (−2, 1). The branches turn at (−4, 1) and (0, 1), and the midpoint of these is also (−2, 1). The centre is (−2, 1).',
  },
]);

G('2753d0ea.lo-3', 'The vertices of a drawn hyperbola', [
  {
    t: 'vertices told apart from the ends and corners of the central rectangle', d: 2, need: 'read',
    spec: cg([-8, 6], [-3, 9], [{ type: 'hyperbola', center: [-1, 3], a: 3, b: 2, axis: 'x', show: { box: 'mark' } }]),
    alt: 'A hyperbola with one branch opening to the left and one to the right, centred to the left of the y-axis and above the x-axis. A dashed rectangle sits between the two branches, and each branch touches the middle of one of its vertical sides.',
    q: 'The figure shows a hyperbola and its central rectangle (dashed). What are the vertices of the hyperbola?',
    o: [['(−4, 3) and (2, 3)', 'correct'], ['(−1, 1) and (−1, 5)', 'the ends of the conjugate axis, on the rectangle but not on the curve'], ['(−4, 1) and (2, 5)', 'two corners of the rectangle'], ['(−3, 3) and (3, 3)', 'measures a from the origin instead of from the centre']],
    calc: ['the two vertices (conic_point, feature vertex, which 0 and 1)', (c) => `${c.txt('conic_point', { feature: 'vertex', which: 0 })} and ${c.txt('conic_point', { feature: 'vertex', which: 1 })}`],
    h: ['The vertices of a hyperbola are points of the curve itself: the points where the two branches turn.', 'They lie on the line through the centre along which the branches open, each a units from the centre.'],
    s: 'Read from the figure: the branches open left and right and turn where they touch the vertical sides of the rectangle, at (−4, 3) and (2, 3). These are the vertices (the centre is (−1, 3) and a = 3). The points (−1, 1) and (−1, 5) are on the rectangle but not on the curve.',
  },
]);

G('2753d0ea.lo-4', 'The foci of a drawn hyperbola', [
  {
    t: 'foci from a and b read off the central rectangle', d: 3, need: 'calc',
    spec: cg([-7, 9], [-9, 7], [{ type: 'hyperbola', center: [1, -1], a: 4, b: 3, axis: 'y', show: { box: 'mark' } }]),
    alt: 'A hyperbola with one branch opening upward and one opening downward, centred to the right of and below the origin. A dashed rectangle, taller than it is wide, sits between the branches; each branch touches the middle of one of its horizontal sides. The foci are not marked.',
    q: 'The figure shows a hyperbola and its central rectangle (dashed). What are the foci of the hyperbola?',
    o: [['(1, −6) and (1, 4)', 'correct'], ['(−4, −1) and (6, −1)', 'places the foci on the horizontal line through the centre'], ['(1, −1 − √7) and (1, −1 + √7)', 'uses c² = a² − b², the relationship for an ellipse'], ['(1, −5) and (1, 3)', 'gives the vertices: the distance a instead of c']],
    calc: ['the two foci (conic_point, feature focus, which 0 and 1)', (c) => `${c.txt('conic_point', { feature: 'focus', which: 0 })} and ${c.txt('conic_point', { feature: 'focus', which: 1 })}`],
    h: ['Read the centre, then a (centre to a turning point) and b (centre to the middle of a side of the rectangle that the curve does not touch).', 'For a hyperbola c² = a² + b², and the foci lie on the same line as the vertices, inside the branches.'],
    s: 'Read from the figure: the centre is (1, −1); the branches turn at (1, 3) and (1, −5), so a = 4; the rectangle reaches 3 units to each side of the centre, so b = 3. Then c² = a² + b² = 16 + 9 = 25 and c = 5. The branches open up and down, so the foci are 5 units above and below the centre: (1, 4) and (1, −6).',
  },
]);

G('2753d0ea.lo-5', 'The asymptotes of a drawn hyperbola', [
  {
    t: 'equation of the rising asymptote from the central rectangle', d: 3, need: 'calc',
    spec: cg([-4, 10], [-6, 8], [{ type: 'hyperbola', center: [3, 1], a: 2, b: 3, axis: 'x', show: { box: 'mark' } }]),
    alt: 'A hyperbola with one branch opening to the left and one to the right, centred to the right of and above the origin. A dashed rectangle, taller than it is wide, sits between the branches; each branch touches the middle of one of its vertical sides. The asymptotes are not drawn.',
    q: 'The figure shows a hyperbola and its central rectangle (dashed); the asymptotes are not drawn. What is the equation of the asymptote with positive slope?',
    o: [['y = (3/2)x − 7/2', 'correct'], ['y = (2/3)x − 1', 'uses a/b for the slope of a hyperbola that opens left and right'], ['y = (3/2)x', 'draws the asymptote through the origin instead of through the centre'], ['y = (3/2)x + 11/2', 'reverses the sign of the centre\'s x-coordinate']],
    calc: ['the equation of the asymptote of positive slope (conic_asymptote, want equation)', (c) => c.txt('conic_asymptote', { which: 'positive', want: 'equation' })],
    h: ['The asymptotes are the diagonals of the central rectangle, extended; both pass through the centre.', 'Find the slope from the rectangle (rise over run from the centre to a corner), then use the centre as a point on the line.'],
    s: 'Read from the figure: the centre is (3, 1); the rectangle reaches 2 units left and right of it (a = 2) and 3 units above and below (b = 3). The rising asymptote goes from the centre to the corner (5, 4), so its slope is 3/2. Through (3, 1): y − 1 = (3/2)(x − 3), so y = (3/2)x − 7/2.',
  },
]);

// ── Ellipse equation analysis (pack topup5/077) ─────────────────────────────

G('85ec2ae2.lo-1', 'The standard form of a drawn ellipse', [
  {
    t: 'pick the standard-form equation of a drawn vertical ellipse', d: 2, need: 'read',
    spec: cg([-6, 4], [-3, 7], [{ type: 'ellipse', center: [-1, 2], rx: 2, ry: 4 }]),
    alt: 'An ellipse that is taller than it is wide, lying mostly to the left of the y-axis and above the x-axis; it crosses the y-axis twice and dips just below the x-axis. No points are marked on it.',
    q: 'Which equation is the standard form of the ellipse shown?',
    o: [['(x + 1)²/4 + (y − 2)²/16 = 1', 'correct'], ['(x + 1)²/16 + (y − 2)²/4 = 1', 'puts the larger denominator under the x-term, which gives a horizontal ellipse'], ['(x − 1)²/4 + (y + 2)²/16 = 1', 'takes the signs in the brackets from the centre\'s coordinates without changing them'], ['(x + 1)²/2 + (y − 2)²/4 = 1', 'uses the semi-axis lengths without squaring them']],
    calc: ['the standard-form equation of the drawn ellipse (conic_equation)', (c) => c.txt('conic_equation')],
    h: ['Find the centre as the midpoint of the highest and lowest points (or of the leftmost and rightmost points).', 'The denominator under each squared term is the square of the distance from the centre to the curve in that direction.'],
    s: 'Read from the figure: the ellipse runs from x = −3 to x = 1 and from y = −2 to y = 6, so its centre is (−1, 2), the horizontal semi-axis is 2 and the vertical semi-axis is 4. The major axis is vertical, so the larger denominator, 16, goes under the y-term: (x + 1)²/4 + (y − 2)²/16 = 1.',
  },
]);

G('85ec2ae2.lo-2', 'The centre of a drawn ellipse and its general form', [
  {
    t: 'coefficient of x in the general form, from the centre', d: 3, need: 'calc',
    spec: cg([-7, 3], [-3, 5], [{ type: 'ellipse', center: [-2, 1], rx: 3, ry: 2 }]),
    alt: 'An ellipse that is wider than it is tall, lying mostly to the left of the y-axis and mostly above the x-axis; it crosses the y-axis and dips just below the x-axis. Its centre is not marked.',
    q: 'The ellipse shown has an equation of the form 4x² + 9y² + Dx + Ey + F = 0. What is the value of D?',
    n: '16',
    calc: ['−2·h·ry², from the spec: ry²(x − h)² + rx²(y − k)² = rx²·ry² expanded (ry² and rx² must be the stated 4 and 9) — checked against the centre (conic_center)', (c) => { const k = K(c); const [h] = k.center as Z; const [rx, ry] = [k.rx as number, k.ry as number]; if (ry * ry !== 4 || rx * rx !== 9) throw new Error('the leading coefficients are not 4 and 9'); if (parsePt(c.txt('conic_center'))[0] !== h) throw new Error('centre'); return -2 * h * ry * ry; }],
    h: ['Find the centre (h, k) of the ellipse from the figure: the midpoint of its leftmost and rightmost points gives h.', 'In 4(x − h)² + 9(y − k)² = constant, the only x-term comes from expanding 4(x − h)².'],
    s: 'Read from the figure: the ellipse runs from x = −5 to x = 1, so the centre has h = −2 (and from y = −1 to y = 3, so k = 1). The equation is 4(x + 2)² + 9(y − 1)² = 36. Expanding 4(x + 2)² gives 4x² + 16x + 16, and no other term contains x, so D = 16.',
  },
]);

G('85ec2ae2.lo-3', 'The major axis and the focal distances', [
  {
    t: 'sum of the focal distances of a point as the major-axis length', d: 3, need: 'reason',
    spec: cg([-5, 7], [-6, 4], [{ type: 'ellipse', center: [1, -1], rx: 5, ry: 4, show: { foci: 'mark' } }], { points: [{ x: 1, y: 3, label: 'P' }] }),
    alt: 'An ellipse that is wider than it is tall, centred a little right of and below the origin, with its two foci marked F₁ and F₂ on its long axis and a point P marked at the very top of the ellipse.',
    q: 'The figure shows an ellipse with its foci F₁ and F₂, and a point P on the ellipse. What is the value of PF₁ + PF₂, in units?',
    n: '10',
    calc: ['the length of the major axis (conic_measure major_axis), which is the sum of the focal distances of any point of the ellipse — checked by adding the two distances from the plotted P to the foci (spec)', (c) => { const k = K(c); const [h, kk] = k.center as Z; const cc = Math.sqrt((k.rx as number) ** 2 - (k.ry as number) ** 2); const q = arr(c.p.points)[0]; const d = Math.hypot((q.x as number) - (h - cc), (q.y as number) - kk) + Math.hypot((q.x as number) - (h + cc), (q.y as number) - kk); const major = c.num('conic_measure', { want: 'major_axis' }); if (!near(d, major)) throw new Error(`P is not on the ellipse: ${d}`); return major; }],
    h: ['For every point of an ellipse, the two distances to the foci add up to the same number.', 'That constant sum equals the length of the major axis — or find each distance from P with the Pythagorean theorem.'],
    s: 'Read from the figure: the ellipse runs from x = −4 to x = 6, so its major axis has length 10. For any point of an ellipse the sum of the distances to the two foci equals the length of the major axis, so PF₁ + PF₂ = 10. Check with the grid: P is 4 above the centre and each focus is 3 to the side, so each distance is √(3² + 4²) = 5.',
  },
]);

{
  const drawn: Ell = { h: 2, k: -1, p: 9, q: 25 };
  const opts: Array<[Ell, string]> = [
    [{ h: 2, k: -1, p: 4, q: 25 }, 'correct'],
    [{ h: 2, k: -1, p: 25, q: 4 }, 'puts 25 under the x-term: the vertices would be (−3, −1) and (7, −1)'],
    [{ h: -2, k: 1, p: 9, q: 25 }, 'reverses the signs of the centre: the vertices would be (−2, 6) and (−2, −4)'],
    [{ h: 2, k: -1, p: 9, q: 16 }, 'keeps the co-vertices instead: the vertices would be (2, 3) and (2, −5)'],
  ];
  G('85ec2ae2.lo-4', 'The vertices of a drawn ellipse', [
    {
      t: 'which other ellipse shares the vertices of the drawn one', d: 3, need: 'reason',
      spec: cg([-4, 8], [-7, 5], [{ type: 'ellipse', center: [drawn.h, drawn.k], rx: Math.sqrt(drawn.p), ry: Math.sqrt(drawn.q) }]),
      alt: 'An ellipse that is taller than it is wide, centred to the right of the y-axis and a little below the x-axis. No points are marked on it.',
      q: 'A vertex of an ellipse is an endpoint of its major axis. Which of these equations describes a different ellipse that has the same two vertices as the ellipse shown?',
      o: opts.map(([e, why]) => [ellText(e), why] as [string, string]),
      holds: ['each option\'s vertices (centre ± √ of the larger denominator, along that axis) compared with the drawn ellipse\'s vertices (conic_point); the option must not be the drawn ellipse itself', opts.map(([e]) => (c: Ctx) => { const v = [0, 1].map((w) => parsePt(c.txt('conic_point', { feature: 'vertex', which: w }))); return samePts(ellVertices(e), v) && canonText(ellText(e)) !== canonText(c.txt('conic_equation')); })],
      h: ['Read the two vertices of the drawn ellipse first: the ends of its longer axis.', 'For each equation, find the centre and the larger denominator; the vertices are √(larger denominator) from the centre, along the axis whose term has that denominator.'],
      s: 'Read from the figure: the ellipse is tallest along x = 2, from (2, −6) to (2, 4), so these are its vertices; its centre is (2, −1) and a = 5. An ellipse with the same vertices needs centre (2, −1) and 25 under the y-term. (x − 2)²/4 + (y + 1)²/25 = 1 has both (and is narrower than the drawn ellipse, whose x-denominator is 9), so it is the answer.',
    },
  ]);
}

{
  const opts: Array<[[{ t: string; v: number } | number, { t: string; v: number } | number], [{ t: string; v: number } | number, { t: string; v: number } | number], string]> = [
    [[surd(1, -2, 3), -2], [surd(1, 2, 3), -2], 'correct'],
    [[1, surd(-2, -2, 3)], [1, surd(-2, 2, 3)], 'places the foci on the vertical line through the centre'],
    [[surd(1, -2, 5), -2], [surd(1, 2, 5), -2], 'uses c² = a² + b², the relationship for a hyperbola'],
    [[-3, -2], [5, -2], 'gives the vertices: the distance a instead of c'],
  ];
  const tv = (x: { t: string; v: number } | number): { t: string; v: number } => (typeof x === 'number' ? { t: minus(x), v: x } : x);
  const one = (q: [{ t: string; v: number } | number, { t: string; v: number } | number]): string => `(${tv(q[0]).t}, ${tv(q[1]).t})`;
  G('85ec2ae2.lo-5', 'The foci of a drawn ellipse', [
    {
      t: 'exact foci of a drawn horizontal ellipse', d: 3, need: 'calc',
      spec: cg([-5, 7], [-6, 2], [{ type: 'ellipse', center: [1, -2], rx: 4, ry: 2 }]),
      alt: 'An ellipse that is wider than it is tall, centred a little right of the y-axis and below the x-axis; its highest point lies on the x-axis. The foci are not marked.',
      q: 'What are the foci of the ellipse shown?',
      o: opts.map(([a, b, why]) => [`${one(a)} and ${one(b)}`, why] as [string, string]),
      holds: ['each option\'s two points compared with centre ± √(a² − b²) along the longer axis, from the spec\'s rx, ry and centre; c checked against conic_measure c', opts.map(([a, b]) => (c: Ctx) => { const k = K(c); const [h, kk] = k.center as Z; const [rx, ry] = [k.rx as number, k.ry as number]; const cc = Math.sqrt(Math.abs(rx * rx - ry * ry)); if (!near(cc, c.num('conic_measure', { want: 'c' }), 1e-6)) throw new Error('c'); const foci: Z[] = rx > ry ? [[h - cc, kk], [h + cc, kk]] : [[h, kk - cc], [h, kk + cc]]; return samePts([[tv(a[0]).v, tv(a[1]).v], [tv(b[0]).v, tv(b[1]).v]], foci); })],
      h: ['Read the centre and the two semi-axes; the foci lie on the longer axis, inside the ellipse.', 'For an ellipse c² = a² − b², where a is the longer semi-axis; simplify the square root.'],
      s: 'Read from the figure: the ellipse runs from x = −3 to x = 5 and from y = −4 to y = 0, so its centre is (1, −2), a = 4 (horizontal) and b = 2. Then c² = a² − b² = 16 − 4 = 12, so c = 2√3. The major axis is horizontal, so the foci are (1 − 2√3, −2) and (1 + 2√3, −2).',
    },
  ]);
}

G('85ec2ae2.lo-6', 'A complete analysis of a drawn ellipse', [
  {
    t: 'find the false statement about a drawn ellipse', d: 3, need: 'reason',
    spec: cg([-6, 4], [-6, 6], [{ type: 'ellipse', center: [-1, 0], rx: 4, ry: 5 }]),
    alt: 'An ellipse that is a little taller than it is wide, centred on the x-axis just left of the origin. No points are marked on it.',
    q: 'Which statement about the ellipse shown is FALSE?',
    o: [
      ['Its minor axis is 10 units long', 'correct'],
      ['Its eccentricity is 0.6', 'does not compute c/a with c = 3 and a = 5'],
      ['Its foci are (−1, 3) and (−1, −3)', 'expects the foci on the horizontal axis, or uses c² = a² + b²'],
      ['Its equation is 25x² + 16y² + 50x − 375 = 0', 'does not expand 25(x + 1)² + 16y² = 400 to check'],
    ],
    holds: ['each statement tested on the drawn ellipse (conic_measure minor_axis and eccentricity, conic_point focus, and the general equation on points of the curve from the spec); the option answers the question when its statement is false', [
      (c) => !(c.num('conic_measure', { want: 'minor_axis' }) === 10),
      (c) => !near(c.num('conic_measure', { want: 'eccentricity' }), 0.6),
      (c) => !samePts([0, 1].map((w) => parsePt(c.txt('conic_point', { feature: 'focus', which: w }))), [[-1, 3], [-1, -3]]),
      (c) => !isGraphOf(K(c), { A: 25, C: 16, D: 50, F: -375 }),
    ]],
    h: ['Read the centre and both semi-axes from the figure; the longer one is a and the shorter one is b.', 'Check each statement in turn: the axis lengths are 2a and 2b, c² = a² − b², the eccentricity is c/a, and the general form comes from clearing the denominators and expanding.'],
    s: 'Read from the figure: the ellipse runs from x = −5 to x = 3 and from y = −5 to y = 5, so its centre is (−1, 0), a = 5 (vertical) and b = 4. Then c = √(25 − 16) = 3, so the foci are (−1, 3) and (−1, −3) and the eccentricity is 3/5 = 0.6 — both true. (x + 1)²/16 + y²/25 = 1 gives 25(x + 1)² + 16y² = 400, which expands to 25x² + 16y² + 50x − 375 = 0 — true. The minor axis is 2b = 8, not 10 (10 is the major axis), so that statement is false.',
  },
]);

// ── Classify conics from general form (pack topup5/084) ─────────────────────

{
  const opts: Array<[Gen, string]> = [
    [{ A: 4, C: 1, D: -8, F: -12 }, 'correct'],
    [{ A: 1, C: 4, D: -2, F: -15 }, 'an ellipse with the same centre, but the larger coefficient is on y², which makes it wider than it is tall'],
    [{ A: 4, C: -1, D: -8, F: -12 }, 'coefficients of x² and y² with opposite signs: a hyperbola'],
    [{ A: 4, C: 4, D: -8, F: -12 }, 'equal coefficients of x² and y²: a circle'],
  ];
  G('cd54fb5c.lo-1', 'The general equation of a drawn conic', [
    {
      t: 'pick the general-form equation from the coefficient pattern of the drawn curve', d: 3, need: 'reason',
      spec: cg([-4, 6], [-5, 5], [{ type: 'ellipse', center: [1, 0], rx: 2, ry: 4 }]),
      alt: 'A closed oval curve that is taller than it is wide, centred on the x-axis just right of the origin. No points are marked on it.',
      q: 'Which equation has the graph shown?',
      o: opts.map(([g, why]) => [genText(g), why] as [string, string]),
      holds: ['each equation tested on points of the drawn curve taken from the spec\'s params', opts.map(([g]) => (c: Ctx) => isGraphOf(K(c), g))],
      h: ['Decide the kind of conic first, then what that says about the coefficients of x² and y²: equal, same sign but unequal, or opposite in sign.', 'Two of the equations are ellipses. A point of the curve that is easy to read, such as its highest point, must satisfy the right one.'],
      s: 'Read from the figure: the curve is a closed oval that is taller than it is wide — an ellipse, so the coefficients of x² and y² have the same sign and are unequal. That rules out 4x² − y² … (hyperbola) and 4x² + 4y² … (circle). The ellipse is taller than wide, so the larger coefficient goes with x². Check with the highest point (1, 4): 4(1) + 16 − 8 − 12 = 0, so the equation is 4x² + y² − 8x − 12 = 0.',
    },
  ]);
}

G('cd54fb5c.lo-2', 'From a drawn parabola to its general form', [
  {
    t: 'constant term of the general form of a drawn sideways parabola', d: 3, need: 'calc',
    spec: cg([-4, 6], [-4, 6], [{ type: 'parabola', vertex: [3, 1], p: -1, axis: 'x', show: { focus: 'mark' } }]),
    alt: 'A parabola that opens to the left, with its turning point to the right of the y-axis and a little above the x-axis. Its focus F is marked inside the curve, one unit to the left of the turning point.',
    q: 'The parabola shown, with its focus F marked, has an equation of the form y² + ax + by + c = 0. What is the value of c? (Include the sign if it is negative.)',
    n: '-11',
    calc: ['k² + 4p·h, from expanding (y − k)² = 4p(x − h) with the spec\'s vertex (h, k) and p; the form is checked on points of the curve (spec) with a = −4p and b = −2k', (c) => { const k = K(c); const [h, kk] = k.vertex as Z; const p = k.p as number; const cc = kk * kk + 4 * p * h; if (k.axis !== 'x' || !isGraphOf(k, { A: 0, C: 1, D: -4 * p, E: -2 * kk, F: cc })) throw new Error('not y² + ax + by + c = 0'); return cc; }],
    h: ['Write the standard form (y − k)² = 4p(x − h) first: read the vertex, and take p from the vertex to the focus — negative, because the parabola opens to the left.', 'Expand the square, move every term to the left-hand side and collect the constants.'],
    s: 'Read from the figure: the vertex is (3, 1) and the focus is (2, 1), one unit to its left, so p = −1 and the equation is (y − 1)² = −4(x − 3). Expanding: y² − 2y + 1 = −4x + 12, so y² + 4x − 2y − 11 = 0. So c = −11.',
  },
]);

G('cd54fb5c.lo-3', 'Eccentricity of a drawn hyperbola', [
  {
    t: 'eccentricity from a and b read off the central rectangle', d: 3, need: 'calc',
    spec: cg([-9, 7], [-6, 8], [{ type: 'hyperbola', center: [-1, 1], a: 3, b: 4, axis: 'x', show: { box: 'mark' } }]),
    alt: 'A hyperbola with one branch opening to the left and one to the right, centred a little left of and above the origin. A dashed rectangle, taller than it is wide, sits between the branches; each branch touches the middle of one of its vertical sides. The foci are not marked.',
    q: 'The figure shows a hyperbola and its central rectangle (dashed). What is the eccentricity of the hyperbola?',
    o: [['5/3', 'correct'], ['5/4', 'divides c by b instead of by a'], ['4/3', 'gives b/a, the slope of an asymptote'], ['3/5', 'inverts the ratio: a/c, a value less than 1']],
    calc: ['the eccentricity c/a of the drawn hyperbola (conic_measure eccentricity), written as the fraction in lowest terms that equals it', (c) => asFraction(c.num('conic_measure', { want: 'eccentricity' }))],
    h: ['Read a (centre to a turning point) and b (centre to the middle of a side that the curve does not touch), then find c from c² = a² + b².', 'The eccentricity is c/a; for a hyperbola it is always greater than 1.'],
    s: 'Read from the figure: the centre is (−1, 1); the branches turn at (−4, 1) and (2, 1), so a = 3; the rectangle reaches 4 units above and below the centre, so b = 4. Then c² = 9 + 16 = 25, c = 5, and the eccentricity is c/a = 5/3.',
  },
]);

// ── Circle and parabola equations (pack expand/302) ─────────────────────────

{
  const opts: Array<[Circ, string]> = [
    [{ h: 3, k: -2, c: 36 }, 'correct'],
    [{ h: 3, k: -2, c: 18 }, 'doubles r² instead of doubling r'],
    [{ h: -3, k: 2, c: 36 }, 'takes the signs in the brackets from the centre\'s coordinates without changing them'],
    [{ h: 3, k: -2, c: 6 }, 'writes the new radius on the right-hand side without squaring it'],
  ];
  G('d47cd4cb.lo-1', 'Centre and radius of a drawn circle', [
    {
      t: 'equation of the circle with the same centre and twice the radius', d: 2, need: 'reason',
      spec: cg([-2, 8], [-7, 3], [{ type: 'circle', center: [3, -2], radius: 3 }]),
      alt: 'A circle lying to the right of the y-axis and mostly below the x-axis; it touches the y-axis at one point and rises just above the x-axis. Its centre is not marked.',
      q: 'Which equation describes the circle that has the same centre as the circle shown and twice its radius?',
      o: opts.map(([o, why]) => [circText(o), why] as [string, string]),
      holds: ['each option\'s centre compared with the drawn centre (conic_center) and √(right-hand side) with twice the drawn radius (conic_measure radius)', opts.map(([o]) => (c: Ctx) => samePts([[o.h, o.k]], [parsePt(c.txt('conic_center'))]) && near(Math.sqrt(o.c), 2 * c.num('conic_measure', { want: 'radius' })))],
      h: ['Read the centre and the radius of the drawn circle: the centre is midway between its leftmost and rightmost points.', 'In (x − h)² + (y − k)² = r², the right-hand side is the square of the radius — double the radius first, then square.'],
      s: 'Read from the figure: the circle runs from x = 0 to x = 6 and from y = −5 to y = 1, so its centre is (3, −2) and its radius is 3. Twice the radius is 6, and 6² = 36, so the equation is (x − 3)² + (y + 2)² = 36.',
    },
  ]);
}

{
  const opts: Array<[Circ, string]> = [
    [{ h: -1, k: 2, c: 25 }, 'correct'],
    [{ h: -1, k: 2, c: 9 }, 'uses the gap between the drawn circle and the line as the radius'],
    [{ h: -1, k: 2, c: 16 }, 'uses the line\'s x-value, 4, as the radius'],
    [{ h: -1, k: 2, c: 5 }, 'writes the radius on the right-hand side without squaring it'],
  ];
  G('d47cd4cb.lo-2', 'Writing the equation of a circle from a figure', [
    {
      t: 'equation of the concentric circle tangent to a drawn vertical line', d: 3, need: 'reason',
      spec: cg([-7, 5], [-4, 8], [{ type: 'circle', center: [-1, 2], radius: 2 }], { lines: [{ x: 4 }] }),
      alt: 'A small circle lying to the left of the y-axis and above the x-axis, touching the x-axis at one point, and a vertical straight line well to the right of it. The centre of the circle is not marked.',
      q: 'The figure shows a circle and a vertical line. A second circle has the same centre as the circle shown and is tangent to the line. Which is the equation of the second circle?',
      o: opts.map(([o, why]) => [circText(o), why] as [string, string]),
      holds: ['each option\'s centre compared with the drawn centre (conic_center) and √(right-hand side) with the distance from that centre to the drawn vertical line (spec)', opts.map(([o]) => (c: Ctx) => { const ctr = parsePt(c.txt('conic_center')); return samePts([[o.h, o.k]], [ctr]) && near(Math.sqrt(o.c), Math.abs((LN(c).x as number) - ctr[0])); })],
      h: ['Find the centre of the drawn circle; the second circle keeps it.', 'A circle is tangent to a line when its radius equals the distance from its centre to the line.'],
      s: 'Read from the figure: the drawn circle runs from x = −3 to x = 1 and from y = 0 to y = 4, so its centre is (−1, 2). The vertical line is x = 4, which is 4 − (−1) = 5 units from the centre, so the second circle has radius 5: (x + 1)² + (y − 2)² = 25.',
    },
  ]);
}

G('d47cd4cb.lo-3', 'The focus–directrix definition on a drawn parabola', [
  {
    t: 'y-coordinate of a point from its distance to the focus, by the definition', d: 3, need: 'reason',
    spec: cg([-7, 5], [-5, 6], [{ type: 'parabola', vertex: [-1, -2], p: 1, axis: 'y', show: { focus: 'mark', directrix: 'mark' } }]),
    alt: 'A parabola that opens upward with its turning point below the x-axis and just left of the y-axis. Its focus F is marked inside the curve, just above the turning point, and a dashed horizontal line runs below the curve without touching it.',
    q: 'The figure shows a parabola with its focus F and its directrix (the dashed line). A point Q on the parabola, beyond the part that is drawn, is 13 units from F. What is the y-coordinate of Q?',
    n: '10',
    calc: ['the directrix\'s height (vertex y − p, spec; checked against conic_line directrix) plus the 13 of the stem: a point of the parabola is as far from the directrix as from the focus, and the parabola opens upward', (c) => { const k = K(c); const dy = (k.vertex as Z)[1] - (k.p as number); if (k.axis !== 'y' || (k.p as number) <= 0) throw new Error('not opening upward'); if (canonText(c.txt('conic_line', { want: 'directrix' })) !== canonText(`y = ${minus(dy)}`)) throw new Error('directrix'); return dy + 13; }],
    h: ['Every point of a parabola is the same distance from the focus as from the directrix.', 'The distance from a point to a horizontal line is the difference of their y-values; read the y-value of the dashed line.'],
    s: 'Read from the figure: the dashed directrix is the horizontal line y = −3. Every point of a parabola is as far from the directrix as from the focus, so Q is 13 units above the directrix: its y-coordinate is −3 + 13 = 10.',
  },
]);

G('d47cd4cb.lo-4', 'The equation of a parabola from its focus and directrix', [
  {
    t: 'pick the equation from a marked focus and an unlabelled directrix', d: 3, need: 'calc',
    spec: cg([-6, 6], [-6, 8], [{ type: 'parabola', vertex: [2, 1], p: -2, axis: 'x', show: { focus: 'mark', directrix: 'mark' } }]),
    alt: 'A parabola that opens to the left with its turning point to the right of the y-axis and a little above the x-axis. Its focus F is marked on the y-axis, inside the curve, and a dashed vertical line stands to the right of the curve without touching it.',
    q: 'The figure shows a parabola with its focus F and its directrix (the dashed line). Which is the equation of the parabola?',
    o: [['(y − 1)² = −8(x − 2)', 'correct'], ['(y − 1)² = 8(x − 2)', 'leaves p positive, which gives a parabola opening to the right'], ['(y − 1)² = −4(x − 2)', 'uses the distance from the focus to the directrix, 4, as the coefficient instead of 4p'], ['(x − 2)² = −8(y − 1)', 'squares the x-bracket: a parabola that opens downward']],
    calc: ['the standard-form equation of the drawn parabola (conic_equation)', (c) => c.txt('conic_equation')],
    h: ['The vertex is halfway between the focus and the directrix, and p is the distance from the vertex to the focus, with a sign for the direction of opening.', 'A parabola that opens left or right has the form (y − k)² = 4p(x − h).'],
    s: 'Read from the figure: the focus is F (0, 1) and the dashed directrix is the vertical line x = 4. The vertex is halfway between them, at (2, 1), and the focus is 2 units to the left of the vertex, so p = −2. The parabola opens left: (y − 1)² = 4(−2)(x − 2), which is (y − 1)² = −8(x − 2).',
  },
]);
}

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY — sequence strips, grouped bars
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY — sequence strips (strands, chromatograms) and grouped bars
// ════════════════════════════════════════════════════════════════════════════

/** The standard genetic code, written out (mRNA codons); checked below against figure-core's own table. */
const CODE: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu', UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'Stop', UAG: 'Stop', UGU: 'Cys', UGC: 'Cys', UGA: 'Stop', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu', CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln', CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met', ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys', AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val', GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu', GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};
if (Object.keys(CODE).length !== 64) throw new Error('the codon table does not have 64 codons');
for (const [codon, aa] of Object.entries(CODE)) {
  const d = runChecker(S('sequence_strip', { rows: [{ seq: `${codon}AAA` }] }), { checker: 'seq_translate', args: { strand: 'mrna', start: 1, want: 'amino_acid', codon: 1 } });
  if (derivedText(d) !== aa) throw new Error(`codon ${codon}: this table says ${aa}, figure-core says ${derivedText(d)}`);
}
const aaOf = (codon: string): string => { const a = CODE[codon.toUpperCase().replace(/T/g, 'U')]; if (!a) throw new Error(`"${codon}" is not a codon`); return a; };
const PAIR: Record<string, string> = { A: 'T', T: 'A', U: 'A', G: 'C', C: 'G' };
/** The complement, base under base (same left-to-right order); `rna` writes U for the partner of A. */
const compl = (s: string, rna = false): string => [...s].map((ch) => (ch === 'A' && rna ? 'U' : PAIR[ch])).join('');
const rev = (s: string): string => [...s].reverse().join('');
const toRna = (s: string): string => s.replace(/T/g, 'U');
/** The amino acids of an mRNA (or coding strand) from `start` (0-based; default the first AUG) up to the first stop codon. */
const peptide = (m: string, start?: number): string[] => {
  const r = toRna(m);
  const out: string[] = [];
  for (let i = start ?? r.indexOf('AUG'); i >= 0 && i + 3 <= r.length; i += 3) { const a = aaOf(r.slice(i, i + 3)); if (a === 'Stop') break; out.push(a); }
  return out;
};
/** A codon key for a stem, from the table: "AUG = Met (start), UAA = stop". `dna` writes the codons as the coding strand does (T for U). */
const codonKey = (codons: string[], dna = false): string => codons.map((x) => `${dna ? x.replace(/U/g, 'T') : x} = ${aaOf(x) === 'Stop' ? 'stop' : aaOf(x)}${x === 'AUG' ? ' (start)' : ''}`).join(', ');
const strip = (params: P): Spec => S('sequence_strip', params);
interface Row { seq: string; name?: string; fivePrime?: string }
const rowsOf = (c: Ctx): Row[] => (c.p.rows as Row[]).map((r) => ({ ...r, seq: r.seq.replace(/\s+/g, '').toUpperCase() }));
/** Grouped bars. */
const bars = (categories: string[], series: Array<[string, Array<number | null>]>, extra: P): Spec => S('bar_chart', { categories, series: series.map(([label, values]) => ({ label, values })), yMin: 0, ...extra });
const bar = (c: Ctx, series: string, category: string): number => c.num('bar_value', { series, category });

// ── Transcription and RNA Processing ────────────────────────────────────────

const RNA_START = 'UCGAUGCC';
G('59da32de.lo-2', 'Template strand and direction of RNA polymerase', [
  {
    t: 'template strand and direction of travel from the start of the RNA', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'GATTCAGGCATCGA', name: 'upper' }, { seq: 'CTAAGTCCGTAGCT', name: 'lower' }], pairTicks: true }),
    alt: 'Two paired DNA strands of fourteen bases each, called upper and lower; the upper one has its 5′ end on the left and the lower one has its 5′ end on the right.',
    q: `RNA polymerase transcribes the stretch of double-stranded DNA shown, and the RNA it makes begins 5′-${RNA_START}-3′. Which strand does the enzyme use as its template, and in which direction does it travel along the DNA as drawn?`,
    o: [
      ['The upper strand, travelling from right to left', 'correct'],
      ['The upper strand, travelling from left to right', 'finds the template but reads it 5′ to 3′'],
      ['The lower strand, travelling from right to left', 'takes the strand that looks like the RNA to be the template'],
      ['The lower strand, travelling from left to right', 'takes the strand that looks like the RNA to be the template and reads it 3′ to 5′'],
    ],
    holds: ['for each option: the RNA made on that template (seq_transcribe) begins with the RNA of the stem, and the enzyme reads the template 3′ → 5′ (from the row\'s own end labels)', [0, 1, 2, 3].map((k) => (c: Ctx) => {
      const [row, dir] = [[0, 'rtl'], [0, 'ltr'], [1, 'rtl'], [1, 'ltr']][k] as [number, string];
      const made = c.txt('seq_transcribe', { row, strand: 'template' });
      const five = rowsOf(c)[row].fivePrime ?? (row === 1 ? 'right' : 'left');
      // The template is read from its 3′ end: from the right when its 5′ end is on the left.
      return made.startsWith(RNA_START) && dir === (five === 'left' ? 'rtl' : 'ltr');
    })],
    h: ['The RNA is complementary to the template strand, with U in place of T — so it has the same letters as the OTHER DNA strand. Find the strand that the RNA resembles when that strand is read from its 5′ end.', 'RNA polymerase builds RNA 5′ to 3′, so it moves along the template from the template\'s 3′ end towards its 5′ end.'],
    s: 'Read from the figure: the lower strand, read from its 5′ end (on the right), is TCGATGCC…, the same letters as the RNA 5′-UCGAUGCC with T for U. So the lower strand is the coding strand and the upper strand is the template. The RNA grows 5′ to 3′, so the enzyme reads the template 3′ to 5′; the upper strand has its 3′ end on the right, so the enzyme travels from right to left.',
  },
]);

G('59da32de.lo-6', 'Splicing a short pre-mRNA', [
  {
    t: 'length of the peptide after the boxed intron is removed', d: 3, need: 'calc',
    spec: strip({ rows: [{ seq: 'AUGGCUGGUAAGUUCAGAUUCCUAAGC', name: 'pre-mRNA' }], highlight: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((pos) => ({ row: 0, pos })), numberEvery: 5 }),
    alt: 'One RNA strand of twenty-seven bases, called pre-mRNA, written 5′ to 3′ with position numbers above it; ten bases in a row in the middle of the strand each have a box round them.',
    q: 'The figure shows a short pre-mRNA. The boxed bases are an intron; the bases before and after it are exons. After splicing, a ribosome translates the mature mRNA from its first AUG (stop codons: UAA, UAG, UGA). How many amino acids long is the peptide it makes? Count the amino acid of the start codon, not the stop codon.',
    n: '4',
    calc: ['the row without its boxed positions (spec), translated in code from the first AUG to the first stop codon: the number of amino acids', (c) => { const r = rowsOf(c)[0].seq; const boxed = new Set(arr(c.p.highlight).map((h) => (h.pos as number) - 1)); const mature = [...r].filter((_, i) => !boxed.has(i)).join(''); const whole = peptide(r).length; const spliced = peptide(mature).length; if (whole === spliced) throw new Error('the intron does not matter'); return spliced; }],
    h: ['Write out the mature mRNA first: leave out every boxed base and join the last base before the intron directly to the first base after it.', 'Group the mature mRNA into codons of three from AUG. A codon can be made of bases from both sides of the join.'],
    s: 'Read from the figure: the bases before the boxed intron are AUGGCUG and the bases after it are AUUCCUAAGC. Splicing joins them: AUGGCUGAUUCCUAAGC. In codons from AUG: AUG GCU GAU UCC UAA — the third codon is made of the last base of exon 1 and the first two of exon 2, and the fifth codon, UAA, is a stop. Four codons are translated, so the peptide is 4 amino acids long.',
  },
]);

// ── mRNA Translation and Protein Synthesis ──────────────────────────────────

const NEW_MRNA = 'AUGCCUUGGAAAGAAUAA';
G('fe780827.lo-1', 'Decoding with codons read from a translated mRNA', [
  {
    t: 'decode a second mRNA with the codon meanings shown on the figure', d: 2, need: 'read',
    spec: strip({ rows: [{ seq: 'AUGAAAGCUUGGGAACCUUAA', name: 'mRNA' }], codons: { row: 0, start: 1 }, aminoAcids: ['Met', 'Lys', 'Ala', 'Trp', 'Glu', 'Pro', 'Stop'] }),
    alt: 'One mRNA strand of twenty-one bases written 5′ to 3′, with a bracket under each group of three bases and the name of an amino acid (or Stop) under each bracket.',
    q: `The figure shows an mRNA with its codons bracketed and the meaning of each codon written under it. A different mRNA reads 5′-${NEW_MRNA}-3′. Using only the codon meanings shown in the figure, which peptide does this second mRNA code for?`,
    o: [
      ['Met-Pro-Trp-Lys-Glu', 'correct'],
      ['Met-Lys-Ala-Trp-Glu', 'copies the order of the amino acids under the figure'],
      ['Met-Ala-Trp-Lys-Glu', 'mixes up the codons CCU and GCU'],
      ['Met-Pro-Trp-Glu-Lys', 'mixes up the codons AAA and GAA'],
    ],
    calc: ['the codon → amino acid pairs printed on the figure (spec; each checked against the standard code), applied in code to the mRNA of the stem up to its stop codon', (c) => {
      const r = rowsOf(c)[0].seq;
      const names = c.p.aminoAcids as string[];
      const key = new Map<string, string>();
      names.forEach((nm, i) => { const codon = r.slice(3 * i, 3 * i + 3); if (aaOf(codon) !== nm) throw new Error(`${codon} is not ${nm}`); key.set(codon, nm); });
      const out: string[] = [];
      for (let i = 0; i + 3 <= NEW_MRNA.length; i += 3) { const nm = key.get(NEW_MRNA.slice(i, i + 3)); if (!nm) throw new Error('a codon of the stem is not on the figure'); if (nm === 'Stop') break; out.push(nm); }
      return out.join('-');
    }],
    h: ['Split the second mRNA into groups of three bases, starting from its first base.', 'For each group, find the same three bases above a bracket in the figure and take the name under that bracket. Stop at the stop codon.'],
    s: 'Read from the figure: AUG = Met, AAA = Lys, GCU = Ala, UGG = Trp, GAA = Glu, CCU = Pro and UAA = Stop. The second mRNA in codons is AUG CCU UGG AAA GAA UAA, which reads Met, Pro, Trp, Lys, Glu and then stop: Met-Pro-Trp-Lys-Glu.',
  },
]);

G('fe780827.lo-2', 'From a template strand to a peptide', [
  {
    t: 'peptide coded by a DNA template strand drawn 3′ to 5′', d: 3, need: 'calc',
    spec: strip({ rows: [{ seq: 'GCTACGGTACCATTGC', name: 'template DNA', fivePrime: 'right' }] }),
    alt: 'One DNA strand of sixteen bases, called template DNA, drawn with its 3′ end on the left and its 5′ end on the right.',
    q: `The figure shows the template strand of a short gene. It is transcribed into mRNA, and a ribosome translates the mRNA from the first AUG it meets (reading from the 5′ end) until a stop codon. Codons: ${codonKey(['AUG', 'CCA', 'UGG', 'GUA', 'ACG', 'CGA', 'UGC', 'CAU', 'GGU', 'AAC', 'UAC', 'ACC', 'UAA'])}. Which peptide is made?`,
    o: [
      ['Met-Pro-Trp', 'correct'],
      ['Met-Val-Thr', 'starts at the second AUG of the mRNA'],
      ['Arg-Cys-His-Gly-Asn', 'reads codons from the first base of the mRNA instead of from AUG'],
      ['Tyr-Gly-Thr', 'reads the template strand itself as if it were the mRNA'],
    ],
    ck: ['seq_translate', { row: 0, strand: 'template' }],
    h: ['First write the mRNA: it is complementary to the template (A pairs with U in RNA) and its 5′ end lies opposite the template\'s 3′ end.', 'Find the first AUG in the mRNA and group the bases in threes from there; a stop codon ends the peptide and codes for no amino acid.'],
    s: 'Read from the figure: the template is 3′-GCTACGGTACCATTGC-5′, so the mRNA is 5′-CGAUGCCAUGGUAACG-3′. The first AUG starts at the third base: AUG CCA UGG UAA. These read Met, Pro, Trp and then stop, so the peptide is Met-Pro-Trp.',
  },
]);

// ── Effects of Mutations on Proteins ────────────────────────────────────────

const KINDS: Array<[string, string, string]> = [
  ['substitution', 'in-frame deletion', 'frameshift'],
  ['substitution', 'frameshift', 'in-frame insertion'],
  ['frameshift', 'in-frame deletion', 'substitution'],
  ['substitution', 'frameshift', 'frameshift'],
];
G('a77216df.lo-1', 'Classifying three mutant alleles against the normal sequence', [
  {
    t: 'classify three mutants by comparing each with the normal strand', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'ATGGCTGAACGTTTCTAA', name: 'normal' }, { seq: 'ATGGCTGACCGTTTCTAA', name: 'mutant X' }, { seq: 'ATGGCTGGTTTCTAA', name: 'mutant Y' }, { seq: 'ATGGCTGAAACGTTTCTAA', name: 'mutant Z' }] }),
    alt: 'Four DNA strands written 5′ to 3′ one under another, called normal, mutant X, mutant Y and mutant Z. The rows are not all the same length: one mutant row is shorter than the normal strand and one is longer.',
    q: 'The figure shows the coding strand of a short gene (read in codons from the ATG at its left end) and the same strand from three mutant alleles. Each mutant differs from the normal strand by one mutation. Which line classifies all three mutations correctly?',
    o: KINDS.map((k, i) => [`X: ${k[0]}; Y: ${k[1]}; Z: ${k[2]}`, ['correct', 'counts bases wrongly: takes the three-base deletion to shift the frame and the one-base insertion not to', 'mixes up mutant X and mutant Z', 'calls every change of length a frameshift'][i]] as [string, string]),
    holds: ['each mutant compared with the normal row by seq_mutation (kind, effect): a substitution is "substitution"; an insertion or deletion is "frameshift" or "in-frame insertion / deletion"', KINDS.map((k) => (c: Ctx) => [1, 2, 3].every((to, i) => {
      const kind = c.txt('seq_mutation', { from: 0, to, strand: 'coding', want: 'kind' });
      const name = kind === 'substitution' ? 'substitution' : c.txt('seq_mutation', { from: 0, to, strand: 'coding', want: 'effect' });
      return name === k[i];
    }))],
    h: ['Compare each mutant with the normal strand base by base from the left, and note where they first differ and whether the mutant is the same length, shorter or longer.', 'A gain or loss of bases shifts the reading frame only when the number of bases is not a multiple of three.'],
    s: 'Read from the figure: mutant X is the same length as the normal strand and differs at one base (the ninth, A to C) — a substitution. Mutant Y is three bases shorter: three bases in a row are missing, a whole multiple of three, so the frame is kept — an in-frame deletion. Mutant Z is one base longer: one extra A, so every later codon is read in a shifted frame — a frameshift.',
  },
]);

const ORDERS: number[][] = [[1, 3, 2], [3, 1, 2], [1, 2, 3], [2, 3, 1]];
G('a77216df.lo-2', 'Silent, missense and nonsense changes in one mRNA', [
  {
    t: 'order three point mutants as silent, missense, nonsense', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'AUGUACGGAUGGCUU', name: 'normal' }, { seq: 'AUGUACGGCUGGCUU', name: 'mutant X' }, { seq: 'AUGUACGGAUGACUU', name: 'mutant Y' }, { seq: 'AUGCACGGAUGGCUU', name: 'mutant Z' }], codons: { row: 0, start: 1 }, highlight: [{ row: 1, pos: 9 }, { row: 2, pos: 12 }, { row: 3, pos: 4 }] }),
    alt: 'Four mRNA strands of fifteen bases written 5′ to 3′ one under another, called normal, mutant X, mutant Y and mutant Z, spaced in groups of three with a bracket under each group of the normal strand. In each mutant one base has a box round it, in a different group each time.',
    q: `The figure shows the first fifteen bases of a normal mRNA, with its codons bracketed, and of three mutant mRNAs; the boxed base in each mutant is the one base that differs from normal. Codons: ${codonKey(['UAC', 'CAC', 'GGA', 'GGC', 'UGG', 'UGA', 'CUU'])}. Which lists the mutants in the order silent, missense, nonsense?`,
    o: ORDERS.map((k, i) => [`Mutant ${'XYZ'[k[0] - 1]}, mutant ${'XYZ'[k[1] - 1]}, mutant ${'XYZ'[k[2] - 1]}`, ['correct', 'swaps the silent and the missense mutant', 'takes the mutants in the order drawn', 'takes the new stop codon for a silent change'][i]] as [string, string]),
    holds: ['the effect of each mutant against the normal row by seq_mutation (want: effect); the option lists them as silent, missense, nonsense', ORDERS.map((k) => (c: Ctx) => ['silent', 'missense', 'nonsense'].every((e, i) => c.txt('seq_mutation', { from: 0, to: k[i], want: 'effect' }) === e))],
    h: ['For each mutant, find the codon that holds the boxed base and write it out before and after the change.', 'Look both codons up in the list: the same amino acid is silent, a different amino acid is missense, a stop codon is nonsense.'],
    s: 'Read from the figure: in mutant X the third codon changes from GGA to GGC — both Gly, so it is silent. In mutant Y the fourth codon changes from UGG (Trp) to UGA, a stop codon — nonsense. In mutant Z the second codon changes from UAC (Tyr) to CAC (His) — missense. In the order silent, missense, nonsense: mutant X, mutant Z, mutant Y.',
  },
]);

G('a77216df.lo-3', 'Reading a shifted frame to its new stop codon', [
  {
    t: 'length of the polypeptide after a one-base insertion', d: 3, need: 'calc',
    spec: strip({ rows: [{ seq: 'ATGGCATCATTTAGCTAA', name: 'normal' }, { seq: 'ATGGCAGTCATTTAGCTAA', name: 'mutant' }] }),
    alt: 'Two DNA strands written 5′ to 3′ one under the other, called normal and mutant. The mutant strand is one base longer than the normal strand; the two begin with the same six bases.',
    q: 'The figure shows the coding strand of a short gene and of a mutant allele in which one base has been inserted. Both are read in codons of three from the ATG at the left end; the stop codons are TAA, TAG and TGA on this strand. The normal polypeptide has 5 amino acids. How many amino acids does the mutant polypeptide have?',
    n: '4',
    calc: ['the mutant row (spec) translated in code from its ATG to the first in-frame stop: the number of amino acids — after checking that the normal row gives 5 and that the rows differ by a one-base insertion (seq_mutation)', (c) => { const [normal, mutant] = rowsOf(c).map((r) => r.seq); if (peptide(normal).length !== 5) throw new Error('the normal polypeptide is not 5 long'); if (c.txt('seq_mutation', { strand: 'coding', want: 'kind' }) !== 'insertion' || c.txt('seq_mutation', { strand: 'coding', want: 'effect' }) !== 'frameshift') throw new Error('not a one-base insertion'); const n = peptide(mutant).length; if (mutant.length - (mutant.indexOf('ATG') + 3 * (n + 1)) <= 0) throw new Error('no stop codon in the mutant frame'); return n; }],
    h: ['Find where the two strands first differ; every codon from that point on is read one base later in the mutant.', 'Regroup the MUTANT strand in threes from ATG and look for the first TAA, TAG or TGA that falls exactly in a group.'],
    s: 'Read from the figure: the mutant strand is ATGGCAGTCATTTAGCTAA — an extra G after the sixth base. In codons from ATG: ATG GCA GTC ATT TAG. The fifth codon, TAG, is a stop codon that the shifted frame has created, so only four codons are translated: the mutant polypeptide has 4 amino acids (the last two differ from the normal ones).',
  },
]);

G('a77216df.lo-4', 'From a changed template base to the protein', [
  {
    t: 'outcome of a boxed base change on the template strand', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'TACTGGACCCTTGAAATT', name: 'normal', fivePrime: 'right' }, { seq: 'TACTGGACTCTTGAAATT', name: 'mutant', fivePrime: 'right' }], highlight: [{ row: 1, pos: 9 }] }),
    alt: 'Two DNA strands of eighteen bases one under the other, called normal and mutant, each drawn with its 3′ end on the left and its 5′ end on the right. One base of the mutant strand, in the first half of the row, has a box round it.',
    q: `The figure shows the template strand of a short gene and of a mutant allele; the boxed base is the only one that differs. The mRNA is translated from its AUG. Codons: ${codonKey(['AUG', 'ACC', 'UGG', 'UGA', 'UGU', 'GAA', 'CUU', 'UAA'])}. What does the mutation do to the polypeptide?`,
    o: [
      ['A stop codon replaces Trp; the polypeptide has 2 amino acids', 'correct'],
      ['A stop codon replaces Trp; the polypeptide has 3 amino acids', 'counts the stop codon as an amino acid'],
      ['Cys replaces Trp; the polypeptide keeps its length', 'writes the changed template base into the mRNA without pairing it (UGU)'],
      ['No amino acid changes; the mutation is silent', 'reads the template strand as if it were the mRNA (ACC and ACT)'],
    ],
    holds: ['both template rows transcribed and translated in code (spec), compared with seq_mutation (effect, old amino acid); each option\'s statement tested', [
      (c) => { const [a, b] = rowsOf(c).map((r) => peptide(compl(r.seq, true))); return c.txt('seq_mutation', { strand: 'template', want: 'effect' }) === 'nonsense' && c.txt('seq_mutation', { strand: 'template', want: 'old_amino_acid' }) === 'Trp' && a[b.length] === 'Trp' && b.length === 2; },
      (c) => peptide(compl(rowsOf(c)[1].seq, true)).length === 3,
      (c) => c.txt('seq_mutation', { strand: 'template', want: 'new_amino_acid' }) === 'Cys',
      (c) => c.txt('seq_mutation', { strand: 'template', want: 'effect' }) === 'silent',
    ]],
    h: ['Transcribe the codon that holds the boxed base for both strands: each template base pairs with its partner in the mRNA (C with G, T with A, A with U).', 'Look the old and the new mRNA codon up in the list, then count the codons that are translated before any stop codon.'],
    s: 'Read from the figure: the boxed base is the ninth of the template, C in the normal strand and T in the mutant. The normal mRNA is AUG ACC UGG GAA CUU UAA (Met-Thr-Trp-Glu-Leu). The third codon is copied from template ACC in the normal strand and ACT in the mutant, so it changes from UGG (Trp) to UGA, a stop codon. Translation ends after Met-Thr: a nonsense mutation, and the polypeptide has 2 amino acids.',
  },
]);

// ── DNA vs RNA Structure ────────────────────────────────────────────────────

G('7ca653b9.lo-3', 'Telling DNA from RNA by the bases present', [
  {
    t: 'the strand whose bases do not settle DNA or RNA', d: 2, need: 'reason',
    spec: strip({ rows: [{ seq: 'ATGCCGTAAGCT', name: 'W' }, { seq: 'AUGCCGUAAGCU', name: 'X' }, { seq: 'GACGGCAGCCAG', name: 'Y' }, { seq: 'CCUGAAUCGGAC', name: 'Z' }] }),
    alt: 'Four separate nucleic-acid strands of twelve bases each, written 5′ to 3′ one under another and called by the letters W, X, Y and Z.',
    q: 'The figure shows short stretches of four different nucleic-acid strands, W, X, Y and Z. For which strand is it impossible to tell, from the bases shown alone, whether it is DNA or RNA?',
    o: [['Strand Y', 'correct'], ['Strand W', 'does not use thymine as the mark of DNA'], ['Strand X', 'does not use uracil as the mark of RNA'], ['Strand Z', 'takes a strand with few uracils to be undecided']],
    holds: ['the bases of each row (spec): a row answers the question when it has neither T nor U', [2, 0, 1, 3].map((i) => (c: Ctx) => !/[TU]/.test(rowsOf(c)[i].seq))],
    h: ['Three of the bases are found in both DNA and RNA. Which base is found only in DNA, and which only in RNA?', 'Look along each strand for one of those two bases; a strand that has neither could be either kind of nucleic acid.'],
    s: 'Read from the figure: strand W contains T (thymine), so it is DNA; strands X and Z contain U (uracil), so they are RNA. Strand Y is made only of A, C and G, the three bases that DNA and RNA share, so its bases alone do not show which it is.',
  },
]);

const PROBE = 'AGTC';
const SITES: Array<[number, number]> = [[0, 6], [1, 6], [0, 12], [1, 12]];
G('7ca653b9.lo-4', 'Where a short probe can pair with a duplex', [
  {
    t: 'strand and positions a probe pairs with, antiparallel', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'CATTGGACTAATCAGCCA', name: 'upper' }, { seq: 'GTAACCTGATTAGTCGGT', name: 'lower' }], pairTicks: true, numberEvery: 5 }),
    alt: 'Two paired DNA strands of eighteen bases, called upper and lower, with position numbers above them at 1 and at every fifth base. The upper strand has its 5′ end on the left; the lower strand has its 5′ end on the right.',
    q: `The two strands of the DNA shown are separated, and a short single-stranded probe, 5′-${PROBE}-3′, is added. The probe binds by ordinary base pairing to one place only. Which strand does it pair with, and at which positions?`,
    o: SITES.map(([row, at], i) => [`The ${row === 0 ? 'upper' : 'lower'} strand, positions ${at} to ${at + 3}`, ['correct', 'picks the stretch that has the same sequence as the probe', 'pairs the probe in the same direction as the strand (parallel)', 'reads the lower strand left to right as if that were 5′ to 3′'][i]] as [string, string]),
    holds: ['for each option: the stretch of that row, read 5′ → 3′ by its end labels (spec), is the reverse complement of the probe — two strands pair only antiparallel', SITES.map(([row, at]) => (c: Ctx) => { const r = rowsOf(c)[row]; const part = r.seq.slice(at - 1, at + 3); const five = (r.fivePrime ?? (row === 1 ? 'right' : 'left')) === 'left' ? part : rev(part); return five === rev(compl(PROBE)); })],
    h: ['Two strands that pair always run in opposite directions: the probe\'s 5′ end lies opposite the 3′ end of the stretch it binds.', 'Write the sequence the probe needs as its partner, 5′ to 3′ (complement each base, then reverse the order), and look for it along each strand read from that strand\'s 5′ end.'],
    s: 'The partner of 5′-AGTC-3′ is 5′-GACT-3′ (complement TCAG, written in the opposite direction). Read from the figure: the upper strand, read 5′ to 3′ from the left, has GACT at positions 6 to 9, so the probe pairs there. The lower strand at positions 6 to 9 is the probe\'s own sequence (5′-AGTC-3′ read from the right), and the upper strand at 12 to 15 (TCAG) would need the probe to lie parallel to it, which does not happen.',
  },
]);

const BLOCKS: Array<[number, number]> = [[21, 25], [6, 10], [11, 15], [16, 20]];
G('7ca653b9.lo-5', 'A single RNA strand that pairs with itself', [
  {
    t: 'the stretch of a single RNA strand that pairs with its first five bases', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'GGACUCCUGAGGACUUCAGGAGUCC', name: 'RNA' }], numberEvery: 5, perLine: 15 }),
    alt: 'One RNA strand of twenty-five bases written 5′ to 3′ over two lines (fifteen bases, then ten), with position numbers above it at 1 and at every fifth base.',
    q: 'The figure shows a single-stranded RNA. Like a transfer RNA, it can fold back on itself so that two stretches of the same strand form a short double-helical stem by base pairing (A with U, G with C). With which bases can bases 1 to 5 form such a stem?',
    o: BLOCKS.map(([a, b], i) => [`Bases ${a} to ${b}`, ['correct', 'pairs the two stretches in the same direction (parallel)', 'picks the stretch with the same sequence as bases 1 to 5', 'picks the stretch that is bases 1 to 5 in reverse order'][i]] as [string, string]),
    holds: ['for each option: that stretch of the row (spec), read 5′ → 3′, is the reverse complement of bases 1–5 (the two arms of a stem are antiparallel)', BLOCKS.map(([a, b]) => (c: Ctx) => { const r = rowsOf(c)[0].seq; return r.slice(a - 1, b) === rev(compl(r.slice(0, 5), true)); })],
    h: ['When a strand folds back on itself, the two arms of the stem run in opposite directions: base 1 pairs with the LAST base of the partner stretch.', 'Write the partner of bases 1 to 5 base by base (G with C, A with U), then reverse it to get the stretch as it reads 5′ to 3′ along the strand.'],
    s: 'Read from the figure: bases 1 to 5 are GGACU. Their partners, base by base, are CCUGA; because the arms of a stem are antiparallel, the partner stretch reads AGUCC from 5′ to 3′. The figure has AGUCC at bases 21 to 25, so the strand folds into a stem (1–5 with 21–25) with a single-stranded loop between. Bases 6 to 10 (CCUGA) would only fit a parallel arrangement, which does not form.',
  },
]);

const FILLS: Array<[string, number]> = [['U, A, U, C', 2], ['U, A, U, C', 4], ['T, A, T, C', 2], ['A, U, A, G', 4]];
G('7ca653b9.lo-6', 'Filling blanks under a DNA template as RNA and as DNA', [
  {
    t: 'blank bases of a strand paired to DNA, as RNA and as DNA', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'GCACTGACGC', name: 'DNA template', fivePrime: 'right' }, { seq: 'CG?G?C?G?G', name: 'new strand', fivePrime: 'left' }], pairTicks: true }),
    alt: 'Two paired strands of ten positions. The upper strand, called DNA template, has its 3′ end on the left. In the lower strand, called new strand, four positions are empty boxes with a question mark; the bases printed in the lower strand are only C and G.',
    q: 'A new strand is being built on the DNA template shown; four of its bases are left blank. If the new strand is RNA, which bases fill the blanks, from left to right — and how many of these four would be a different base if the new strand were DNA instead?',
    o: FILLS.map(([f, n], i) => [`${f}; ${n} of them would differ`, ['correct', 'takes every base of RNA to differ from DNA', 'pairs A with T in the RNA strand', 'copies the template bases instead of pairing them'][i]] as [string, string]),
    holds: ['the template bases over the blank cells (spec), paired in code by the DNA–RNA rule (A·U, T·A, G·C, C·G) and by the DNA–DNA rule; the number of blanks where the two differ', FILLS.map(([f, n]) => (c: Ctx) => { const [t, m] = rowsOf(c).map((r) => r.seq); const at = [...m].map((ch, i) => (ch === '?' ? i : -1)).filter((i) => i >= 0); const asRna = at.map((i) => compl(t[i], true)); const asDna = at.map((i) => compl(t[i])); if ([...m].some((ch, i) => ch !== '?' && ch !== compl(t[i]))) throw new Error('a printed base of the new strand is mispaired'); return asRna.join(', ') === f && asRna.filter((x, k) => x !== asDna[k]).length === n; })],
    h: ['Read the template base above each blank. In RNA, the partner of the template\'s A is U; the partner of the template\'s T is A.', 'Only one pairing changes between a new RNA strand and a new DNA strand: what goes opposite the template\'s A.'],
    s: 'Read from the figure: the template bases above the four blanks are A, T, A and G. In RNA their partners are U, A, U and C. If the new strand were DNA, the partner of A would be T instead of U, while the partners of T (A) and G (C) stay the same — so the two blanks opposite A, 2 of the 4, would differ.',
  },
]);

// ── DNA Replication mechanisms ──────────────────────────────────────────────

G('ffe602ec.lo-1', 'The partner strand in a daughter molecule', [
  {
    t: 'sequence and origin of the partner strand after replication', d: 2, need: 'reason',
    spec: strip({ rows: [{ seq: 'GATTCAGGCA', name: 'strand 1' }] }),
    alt: 'One DNA strand of ten bases, called strand 1, written with its 5′ end on the left and its 3′ end on the right.',
    q: 'Strand 1, shown in the figure, is one of the two strands of a DNA molecule. The molecule is replicated once. In the daughter molecule that contains strand 1, what is the other strand — its sequence written 5′ to 3′, and where it came from?',
    o: [
      ['TGCCTGAATC, newly made', 'correct'],
      ['TGCCTGAATC, from the original molecule', 'takes replication to keep both original strands together'],
      ['CTAAGTCCGT, newly made', 'writes the complement in the same left-to-right order as if it were 5′ to 3′'],
      ['GATTCAGGCA, newly made', 'takes the new strand to be a copy of strand 1'],
    ],
    holds: ['the complementary strand written from its own 5′ end (seq_complement, written: 5to3); in semi-conservative replication each daughter molecule has one original strand and one newly made strand', [
      (c) => c.txt('seq_complement', { row: 0, written: '5to3' }) === 'TGCCTGAATC',
      () => false,
      (c) => c.txt('seq_complement', { row: 0, written: '5to3' }) === 'CTAAGTCCGT',
      (c) => c.txt('seq_complement', { row: 0, written: '5to3' }) === 'GATTCAGGCA',
    ]],
    h: ['Each strand of the original molecule serves as a template, and stays paired with the strand built on it.', 'Pair each base of strand 1 (A with T, G with C); the partner strand runs the opposite way, so its 5′ end lies opposite the 3′ end of strand 1.'],
    s: 'Replication is semi-conservative: strand 1 is used as a template and ends up paired with the strand newly built on it. Read from the figure: strand 1 is 5′-GATTCAGGCA-3′; its partners, base under base, are CTAAGTCCGT, and because the new strand is antiparallel it reads 5′-TGCCTGAATC-3′ from its own 5′ end. So the other strand is TGCCTGAATC, newly made.',
  },
]);

const ADDS: Array<[number[], boolean]> = [[[8, 7, 6], true], [[6, 7, 8], true], [[15, 16, 17], true], [[8, 7, 6], false]];
G('ffe602ec.lo-4', 'Which end of a primer DNA polymerase extends', [
  {
    t: 'the next three nucleotides added to a primer, in order', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'GATCCTGACGTAACGTCA', name: 'template', fivePrime: 'left' }, { seq: '--------GCATTG----', name: 'primer', fivePrime: 'none' }], pairTicks: true, numberEvery: 5 }),
    alt: 'Two rows of eighteen positions. The upper row is a DNA strand called template with its 5′ end on the left. The lower row, called primer, has six bases under the middle of the template and dashes at every other position; its ends are not labelled.',
    q: 'A six-base primer is paired with a DNA template as shown; a dash marks a position where the lower strand has no nucleotide yet. DNA polymerase now extends the primer. Which three nucleotides does it add first, in the order in which they are added?',
    o: ADDS.map(([at, pair], i) => [(pair ? at : at).map((p) => (pair ? compl('GATCCTGACGTAACGTCA'[p - 1]) : 'GATCCTGACGTAACGTCA'[p - 1])).join(', then '), ['correct', 'finds the right three bases but adds them towards the primer instead of away from it', 'extends the primer at its 5′ end', 'copies the template bases instead of pairing them'][i]] as [string, string]),
    holds: ['the primer\'s 3′ end lies opposite the template\'s 5′ side (spec: the template\'s end labels); the three template bases next to that end, taken outward and paired in code — and the option\'s text is rebuilt from the spec\'s own template row', ADDS.map(([at, pair], k) => (c: Ctx) => {
      const [t, p] = rowsOf(c);
      const first = p.seq.search(/[ACGT]/);
      const last = p.seq.length - 1 - rev(p.seq).search(/[ACGT]/);
      // The primer is antiparallel to the template: where the template's 5′ end is on the left, the primer's 3′ end is its left end.
      const grow = (t.fivePrime ?? 'left') === 'left' ? [first - 1, first - 2, first - 3] : [last + 1, last + 2, last + 3];
      const right = grow.map((i) => compl(t.seq[i])).join(', then ');
      const mine = at.map((q) => (pair ? compl(t.seq[q - 1]) : t.seq[q - 1])).join(', then ');
      return k === 0 ? mine === right && at.every((q, j) => q - 1 === grow[j]) : mine === right;
    })],
    h: ['DNA polymerase can only add a nucleotide to the 3′ end of a strand. The primer runs antiparallel to the template, so work out which end of the primer is its 3′ end from the template\'s labels.', 'From that end, move one position at a time away from the primer and pair each template base (A with T, G with C).'],
    s: 'Read from the figure: the template has its 5′ end on the left, so the primer paired with it has its 3′ end on the left (under position 9). Polymerase extends only the 3′ end, so it works leftward: under template positions 8, 7 and 6, whose bases are A, G and T. Their partners are T, C and A, added in that order: T, then C, then A.',
  },
]);

const LEAD: Array<[number, number[], boolean]> = [[0, [12, 11, 10, 9], true], [0, [9, 10, 11, 12], true], [0, [12, 11, 10, 9], false], [0, [1, 2, 3, 4], true]];
G('ffe602ec.lo-5', 'The leading strand at a fork entering from the right', [
  {
    t: 'first four nucleotides of the leading strand, in order of synthesis', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'ATGCCGTTAGCA', name: 'upper' }, { seq: 'TACGGCAATCGT', name: 'lower' }], pairTicks: true, numberEvery: 3 }),
    alt: 'Two paired DNA strands of twelve bases, called upper and lower, with position numbers above them. The upper strand has its 5′ end on the left and its 3′ end on the right; the lower strand has its 3′ end on the left and its 5′ end on the right.',
    q: 'A replication fork opens the DNA shown starting at its right-hand end and moves to the left. One of the two new strands is made continuously, growing in the direction in which the fork moves (the leading strand). What are the first four nucleotides of this strand, in the order in which they are joined?',
    o: LEAD.map(([, at, pair], i) => [at.map((p) => (pair ? compl('ATGCCGTTAGCA'[p - 1]) : 'ATGCCGTTAGCA'[p - 1])).join(', '), ['correct', 'pairs the right four bases but in the opposite order (growing against the fork)', 'builds on the lower strand, whose template runs the wrong way for continuous synthesis', 'starts at the left-hand end, where the fork arrives last'][i]] as [string, string]),
    holds: ['the leading-strand template is the strand whose 3′ end is where the fork enters (spec: end labels; the fork enters on the right); its bases from that end inward, paired in code — the option\'s text is rebuilt from the spec\'s rows', LEAD.map(([, at, pair]) => (c: Ctx) => {
      const rs = rowsOf(c);
      const tpl = rs.findIndex((r, i) => (r.fivePrime ?? (i === 1 ? 'right' : 'left')) === 'left'); // 3′ end on the right
      const t = rs[tpl].seq;
      const right = [1, 2, 3, 4].map((k) => compl(t[t.length - k])).join(', ');
      return at.map((p) => (pair ? compl(rs[0].seq[p - 1]) : rs[0].seq[p - 1])).join(', ') === right;
    })],
    h: ['A new strand always grows 5′ to 3′, so its template is read 3′ to 5′. Which of the two strands has its 3′ end at the right, where the fork starts?', 'Start at the right-hand end of that template and move left, pairing each base (A with T, G with C).'],
    s: 'Read from the figure: the upper strand has its 3′ end on the right, so a new strand can be built on it continuously from right to left, following the fork — it is the leading-strand template. Its bases from the right are A, C, G, A (positions 12, 11, 10, 9); their partners, in the order they are joined, are T, G, C, T. (On the lower strand, synthesis must run away from the fork, in fragments.)',
  },
]);

// ── Biotechnology Techniques and Applications ───────────────────────────────

G('252560d4.lo-5', 'From a sequencing read-out to the template strand', [
  {
    t: 'template strand of a read-out, written 5′ to 3′', d: 3, need: 'calc',
    spec: strip({ variant: 'chromatogram', seq: 'GATTCAGGCA', calls: 'none' }),
    alt: 'A sequencing read-out with ten peaks along a baseline, read from the 5′ end on the left to the 3′ end on the right. No base letters are printed over the peaks; a key under the plot shows the line pattern and marker of each of the four bases.',
    q: 'The read-out in the figure shows the DNA strand that was synthesised in a Sanger sequencing reaction, read 5′ to 3′ from left to right; use the key to name each peak. What is the sequence of the template strand it was copied from, written 5′ to 3′?',
    o: [['TGCCTGAATC', 'correct'], ['CTAAGTCCGT', 'complements each base but does not reverse the order'], ['GATTCAGGCA', 'gives the strand that was read, not its template'], ['ACGGACTTAG', 'reverses the read without complementing it']],
    ck: ['chromatogram_read', { written: 'complement_5to3' }],
    h: ['Name the ten peaks in order with the key (each base has its own marker on the peak top) to get the strand that was made.', 'The template is complementary to that strand and runs the opposite way: complement every base, then write the result in reverse order so that it reads 5′ to 3′.'],
    s: 'Read from the figure with the key: the peaks, left to right, are G, A, T, T, C, A, G, G, C, A — the synthesised strand is 5′-GATTCAGGCA-3′. Its complement, base under base, is CTAAGTCCGT, which runs 3′ to 5′; written from its own 5′ end the template is TGCCTGAATC.',
  },
]);

const NORMAL_READ = 'ATGGCATGGCTT';
G('252560d4.lo-6', 'Finding and interpreting a change in a patient\'s read-out', [
  {
    t: 'effect of the one difference between a read-out and the normal sequence', d: 3, need: 'reason',
    spec: strip({ variant: 'chromatogram', seq: 'ATGGCATGACTT', calls: 'none' }),
    alt: 'A sequencing read-out with twelve peaks along a baseline, read from the 5′ end on the left to the 3′ end on the right, numbered under the baseline. No base letters are printed over the peaks; a key under the plot shows the line pattern and marker of each of the four bases.',
    q: `The normal coding strand of a gene begins 5′-${NORMAL_READ}-3′ and is read in codons from the ATG. The read-out in the figure shows the same stretch of the coding strand from a patient. On the coding strand: ${codonKey(['GCA', 'UGG', 'UGA', 'UGU', 'CUU'], true)}. What kind of mutation does the patient carry?`,
    o: [
      ['Nonsense: the third codon has become a stop codon', 'correct'],
      ['Missense: the third codon now codes for Cys', 'misreads the changed peak'],
      ['Silent: the third codon still codes for Trp', 'does not find the changed peak, or takes the change not to matter'],
      ['Frameshift: a base is missing from the third codon', 'takes a changed peak for a lost one'],
    ],
    holds: ['the read-out by chromatogram_read, compared in code with the normal sequence of the stem: one substitution, and what the codon that holds it means before and after (standard code)', [
      (c) => { const r = c.txt('chromatogram_read'); const d = [...r].map((ch, i) => (ch === NORMAL_READ[i] ? -1 : i)).filter((i) => i >= 0); const k = Math.floor(d[0] / 3); return r.length === NORMAL_READ.length && d.length === 1 && k === 2 && aaOf(NORMAL_READ.slice(6, 9)) !== 'Stop' && aaOf(r.slice(6, 9)) === 'Stop'; },
      (c) => aaOf(c.txt('chromatogram_read').slice(6, 9)) === 'Cys',
      (c) => aaOf(c.txt('chromatogram_read').slice(6, 9)) === 'Trp',
      (c) => c.txt('chromatogram_read').length !== NORMAL_READ.length,
    ]],
    h: ['Name the twelve peaks in order with the key and write the patient\'s sequence under the normal one; look for the position where they differ.', 'Find the codon (counting in threes from ATG) that holds the changed base, and look up what it meant before and what it means now.'],
    s: 'Read from the figure with the key: the patient\'s strand is ATG GCA TGA CTT. It has the same twelve positions as the normal ATG GCA TGG CTT, so nothing is missing; the only difference is the ninth base, G in the normal strand and A in the patient. The third codon changes from TGG (Trp) to TGA, a stop codon — a nonsense mutation that ends the protein after two amino acids.',
  },
]);

const PCR_NORMAL = 150;
const PCR_OPTS: Array<[number, string]> = [[144, 'in-frame'], [144, 'frameshift'], [150, 'substitution'], [156, 'in-frame']];
G('252560d4.lo-7', 'What the gel and the sequence each show for a deletion allele', [
  {
    t: 'band length on a gel and effect on the protein from an aligned deletion', d: 3, need: 'reason',
    spec: strip({ rows: [{ seq: 'ATGGCTGAACGTTTC', name: 'normal' }, { seq: 'ATGGCT------TTC', name: 'patient' }], codons: { row: 0, start: 1 } }),
    alt: 'Two DNA strands aligned one under the other and spaced in groups of three, called normal and patient, with a bracket under each group of the normal strand. In the patient strand a run of positions in the middle holds dashes instead of bases.',
    q: `A region of a gene is amplified by PCR; the normal allele gives a product ${PCR_NORMAL} bp long. The figure aligns the sequence of the middle of that product from the normal allele (codons bracketed) with the same stretch from a patient\'s allele; a dash marks a base the patient\'s allele lacks. The rest of the two products is identical. What will the gel and the protein show for the patient\'s allele?`,
    o: PCR_OPTS.map(([len, kind], i) => [`A ${len} bp band; ${kind === 'in-frame' ? (len < PCR_NORMAL ? 'two amino acids are missing, the rest are unchanged' : 'two extra amino acids, the rest are unchanged') : kind === 'frameshift' ? 'every amino acid after the gap is changed' : 'two amino acids are replaced by others'}`, ['correct', 'takes any deletion to shift the reading frame', 'takes the dashes for changed bases, not missing ones', 'adds the gap to the length instead of taking it away'][i]] as [string, string]),
    holds: ['the dashes of the patient row counted in code (spec) and taken from the stated product length; the deletion is in frame when it is a multiple of three and starts on a codon boundary — cross-checked with seq_mutation (kind, effect)', PCR_OPTS.map(([len, kind]) => (c: Ctx) => {
      const p = rowsOf(c)[1].seq;
      const gaps = (p.match(/-/g) ?? []).length;
      const whole = gaps % 3 === 0 && p.indexOf('-') % 3 === 0;
      if (c.txt('seq_mutation', { strand: 'coding', want: 'kind' }) !== 'deletion' || (c.txt('seq_mutation', { strand: 'coding', want: 'effect' }) === 'in-frame deletion') !== whole) throw new Error('the rows are not what the options say');
      return len === PCR_NORMAL - gaps && kind === (whole ? 'in-frame' : 'frameshift') && gaps / 3 === 2;
    })],
    h: ['Count the dashes: each is one base pair that the patient\'s PCR product lacks, so its band is that much shorter than the normal one.', 'Compare the number of missing bases with the codon brackets: are whole codons missing, or does the gap leave the later bases grouped differently?'],
    s: 'Read from the figure: the patient\'s strand has 6 dashes, so its PCR product is 150 − 6 = 144 bp and runs slightly further on the gel. The six missing bases are exactly the third and fourth codons under the brackets (GAA and CGT), so the bases after the gap are still read in the same groups of three: two amino acids are missing and the rest of the protein is unchanged. The gel shows the shorter band; only the sequence shows that the frame is kept.',
  },
]);

// ── Hardy-Weinberg Equilibrium ──────────────────────────────────────────────

const GENO = ['AA', 'Aa', 'aa'];
/** The frequency of allele A in one series of a genotype-count chart. */
const freqA = (c: Ctx, series: string): number => { const [x, y, z] = GENO.map((g) => bar(c, series, g)); return (2 * x + y) / (2 * (x + y + z)); };
G('7bc3506d.lo-1', 'Allele frequencies from genotype counts of two populations', [
  {
    t: 'difference in the frequency of an allele between two samples', d: 3, need: 'calc',
    spec: bars(GENO, [['Population 1', [40, 40, 20]], ['Population 2', [20, 50, 30]]], { yMax: 60, yStep: 10, yLabel: 'Number of individuals', xLabel: 'Genotype' }),
    alt: 'A grouped bar chart of the number of individuals of each of three genotypes, AA, Aa and aa, with two bars for each genotype: one for population 1 and one for population 2.',
    q: 'The chart shows the numbers of individuals of each genotype in samples from two populations. By how much is the frequency of allele A in population 1 greater than in population 2? Give your answer as a decimal.',
    n: '0.15',
    calc: ['(2·AA + Aa) ÷ (2·total) for each series, from bar_value; the difference', (c) => round(freqA(c, 'Population 1') - freqA(c, 'Population 2'), 6)],
    h: ['Each individual carries two alleles of the gene: an AA individual carries two copies of A and an Aa individual carries one.', 'For each population, divide its number of A alleles by its total number of alleles (twice the number of individuals), then subtract.'],
    s: 'Read from the chart: population 1 has 40 AA, 40 Aa and 20 aa (100 individuals, 200 alleles), so A has frequency (2 × 40 + 40) / 200 = 0.60. Population 2 has 20 AA, 50 Aa and 30 aa (also 100 individuals), so A has frequency (2 × 20 + 50) / 200 = 0.45. The difference is 0.60 − 0.45 = 0.15.',
  },
]);

G('7bc3506d.lo-2', 'Recessive allele frequencies from phenotype percentages', [
  {
    t: 'ratio of the recessive allele frequencies of two populations in equilibrium', d: 3, need: 'calc',
    spec: bars(['Dominant', 'Recessive'], [['Island', [16, 9]], ['Mainland', [21, 4]]], { yMax: 25, yStep: 5, yLabel: 'Number of individuals', xLabel: 'Phenotype' }),
    alt: 'A grouped bar chart of the number of individuals with the dominant phenotype and with the recessive phenotype, with two bars for each phenotype: one for a sample from an island population and one for a sample from a mainland population.',
    q: 'A trait is controlled by one gene with a dominant and a recessive allele. The chart shows the number of individuals of each phenotype in a sample from an island population and in a sample from a mainland population; both populations are in Hardy-Weinberg equilibrium. How many times as frequent is the recessive allele on the island as on the mainland?',
    n: '1.5',
    calc: ['√(recessive ÷ sample total) for each series, from bar_value; the island value ÷ the mainland value', (c) => { const q = (s: string) => Math.sqrt(bar(c, s, 'Recessive') / (bar(c, s, 'Dominant') + bar(c, s, 'Recessive'))); return round(q('Island') / q('Mainland'), 6); }],
    h: ['Only one of the two phenotype groups consists of a single genotype. Which term of p² + 2pq + q² = 1 is its frequency?', 'Work out the share of that group in its own sample, take the square root for each population to get its recessive allele frequency, then divide one by the other.'],
    s: 'Read from the chart: the island sample has 16 dominant and 9 recessive individuals, and the mainland sample 21 dominant and 4 recessive — 25 in each. Recessive individuals are the homozygotes, with frequency q²: 9/25 = 0.36 on the island and 4/25 = 0.16 on the mainland, so q = √0.36 = 0.6 and q = √0.16 = 0.4. The recessive allele is 0.6 / 0.4 = 1.5 times as frequent on the island.',
  },
]);

const HET_SAMPLE = 200;
G('7bc3506d.lo-3', 'Expected heterozygotes from allele frequencies', [
  {
    t: 'difference in expected heterozygote numbers between two populations', d: 3, need: 'calc',
    spec: bars(['Population 1', 'Population 2'], [['Allele A', [0.9, 0.5]], ['Allele a', [0.1, 0.5]]], { yMax: 1, yStep: 0.1, yLabel: 'Allele frequency' }),
    alt: 'A grouped bar chart of allele frequency for two populations, with two bars for each population: one for allele A and one for allele a.',
    q: `The chart shows the frequencies of the two alleles of a gene in two populations, each in Hardy-Weinberg equilibrium. A sample of ${HET_SAMPLE} individuals is taken from each. How many more heterozygous individuals are expected in the sample from population 2 than in the sample from population 1?`,
    n: '64',
    calc: [`2pq × ${HET_SAMPLE} for each population, from bar_value; the difference`, (c) => { const het = (pop: string) => { const [p, q] = [bar(c, 'Allele A', pop), bar(c, 'Allele a', pop)]; if (!near(p + q, 1)) throw new Error('p + q is not 1'); return 2 * p * q * HET_SAMPLE; }; return round(het('Population 2') - het('Population 1'), 6); }],
    h: ['In Hardy-Weinberg equilibrium the frequency of heterozygotes is 2pq, where p and q are the two allele frequencies.', 'Work out 2pq for each population from its two bars, multiply each by the sample size, and subtract.'],
    s: 'Read from the chart: in population 1, p = 0.9 and q = 0.1, so heterozygotes have frequency 2 × 0.9 × 0.1 = 0.18, or 0.18 × 200 = 36 individuals. In population 2, p = q = 0.5, so the frequency is 2 × 0.5 × 0.5 = 0.50, or 100 individuals. The difference is 100 − 36 = 64.',
  },
]);

/** Is one series of a genotype-count chart at its Hardy-Weinberg proportions? */
const inHW = (c: Ctx, series: string): boolean => { const [x, y, z] = GENO.map((g) => bar(c, series, g)); const n = x + y + z; const p = (2 * x + y) / (2 * n); return near(x, p * p * n) && near(y, 2 * p * (1 - p) * n) && near(z, (1 - p) * (1 - p) * n); };
G('7bc3506d.lo-5', 'Two samples with the same allele frequencies', [
  {
    t: 'which of two samples is at Hardy-Weinberg proportions', d: 3, need: 'reason',
    spec: bars(GENO, [['Lake', [90, 120, 40]], ['River', [120, 60, 70]]], { yMax: 140, yStep: 20, yLabel: 'Number of individuals', xLabel: 'Genotype' }),
    alt: 'A grouped bar chart of the number of individuals of each of three genotypes, AA, Aa and aa, with two bars for each genotype: one for a lake population and one for a river population.',
    q: 'The chart shows the numbers of individuals of each genotype in samples from a lake population and a river population of one fish species. Use each sample\'s own allele frequencies to work out the genotype numbers expected under Hardy-Weinberg equilibrium. Which conclusion do the data support?',
    o: [
      ['Only the lake sample matches its expected numbers', 'correct'],
      ['Only the river sample matches its expected numbers', 'mixes up the two series'],
      ['Both samples match their expected numbers', 'takes equal allele frequencies to mean equal genotype frequencies'],
      ['Neither sample matches its expected numbers', 'expects the three genotypes in a fixed 1 : 2 : 1 ratio'],
    ],
    holds: ['for each series: p from its own counts (bar_value), expected p²N, 2pqN, q²N compared with the bars; also checked that the two series have the same p', [
      (c) => { if (!near(freqA(c, 'Lake'), freqA(c, 'River'))) throw new Error('the allele frequencies differ'); return inHW(c, 'Lake') && !inHW(c, 'River'); },
      (c) => !inHW(c, 'Lake') && inHW(c, 'River'),
      (c) => inHW(c, 'Lake') && inHW(c, 'River'),
      (c) => !inHW(c, 'Lake') && !inHW(c, 'River'),
    ]],
    h: ['For each sample, find the total and the frequency p of allele A from its three bars: (2 × AA + Aa) divided by twice the total.', 'The expected numbers are p², 2pq and q² times the total. Compare them with the bars of the same sample — especially the heterozygotes.'],
    s: 'Read from the chart: the lake sample has 90 AA, 120 Aa and 40 aa; the river sample has 120 AA, 60 Aa and 70 aa. Each sample has 250 individuals and p = 300 / 500 = 0.6 (q = 0.4). The expected numbers for both are 0.36 × 250 = 90, 0.48 × 250 = 120 and 0.16 × 250 = 40. The lake sample matches exactly; the river sample has half the expected heterozygotes and too many of both homozygotes, so only the lake sample is at Hardy-Weinberg proportions.',
  },
]);

// ── Mechanisms of Evolution ─────────────────────────────────────────────────

const GENS = ['Gen 0', 'Gen 10', 'Gen 20', 'Gen 30'];
const track = (c: Ctx, series: string): number[] => GENS.map((g) => bar(c, series, g));
const maxStep = (v: number[]): number => Math.max(...v.slice(1).map((x, i) => Math.abs(x - v[i])));
const oneWay = (v: number[]): boolean => v.slice(1).every((x, i) => x >= v[i]) || v.slice(1).every((x, i) => x <= v[i]);
G('994ea23e.lo-2', 'Telling drift in a small population from the record of an allele', [
  {
    t: 'which of two populations is the small one, from its allele-frequency record', d: 3, need: 'reason',
    spec: bars(GENS, [['Population X', [0.5, 0.5, 0.5, 0.5]], ['Population Y', [0.5, 0.7, 0.4, 0.8]]], { yMax: 1, yStep: 0.1, yLabel: 'Frequency of allele A', xLabel: 'Generation' }),
    alt: 'A grouped bar chart of the frequency of allele A at generations 0, 10, 20 and 30, with two bars at each generation: one for population X and one for population Y.',
    q: 'Two isolated populations of one species were followed for 30 generations: one has about 20 breeding individuals and the other about 20,000. Allele A is neutral (it does not affect survival or reproduction), and there is no migration or mutation. The chart shows the frequency of allele A in each. Which conclusion does the chart support?',
    o: [
      ['Y is the small population: its frequency shifts up and down by chance', 'correct'],
      ['X is the small population: with few matings its frequency cannot change', 'takes drift to be weaker in a small population'],
      ['Y is the large population: selection is steadily favouring allele A', 'reads the changes as a steady rise, and ignores that the allele is neutral'],
      ['X is the small population: drift has already fixed allele A there', 'takes a constant frequency for fixation'],
    ],
    holds: ['the two records from bar_value: the option names as small the population whose frequency changes more between readings, and its account of the record (up and down / unchanged / steady rise / fixed) is true of the bars', [
      (c) => maxStep(track(c, 'Population Y')) > maxStep(track(c, 'Population X')) && !oneWay(track(c, 'Population Y')),
      (c) => maxStep(track(c, 'Population X')) > maxStep(track(c, 'Population Y')),
      (c) => oneWay(track(c, 'Population Y')) && maxStep(track(c, 'Population Y')) > 0 && maxStep(track(c, 'Population X')) > maxStep(track(c, 'Population Y')),
      (c) => maxStep(track(c, 'Population X')) > maxStep(track(c, 'Population Y')) && track(c, 'Population X').slice(-1)[0] === 1,
    ]],
    h: ['Genetic drift is chance change in allele frequency from one generation to the next. In which size of population does chance have the larger effect?', 'Compare how each population\'s bars change from one reading to the next — both the size of the changes and whether they keep going in one direction.'],
    s: 'Read from the chart: in population X allele A stays at 0.5 at all four readings; in population Y it goes 0.5, 0.7, 0.4, 0.8 — large changes, first up, then down, then up. Chance changes of this size with no consistent direction are genetic drift, which is strong only in a small population, so Y is the population of about 20. In 20,000 individuals the sampling error is tiny and the frequency stays close to 0.5; and a steady one-way rise, not a zigzag, would be expected from selection.',
  },
]);

const ALLELES = ['G1', 'G2', 'G3', 'G4'];
G('994ea23e.lo-4', 'What a bottleneck did to four alleles', [
  {
    t: 'the statement a before-and-after allele chart does not support', d: 3, need: 'reason',
    spec: bars(ALLELES, [['Before the crash', [0.4, 0.3, 0.2, 0.1]], ['After recovery', [0.7, 0, 0.3, 0]]], { yMax: 0.8, yStep: 0.1, yLabel: 'Allele frequency', xLabel: 'Allele' }),
    alt: 'A grouped bar chart of the frequency of four alleles, G1 to G4, with two bars for each allele: one from before the population crash and one from after the population had recovered. For two of the alleles the second bar has no height.',
    q: 'Hunting reduced a seal population from many thousands to about 20 animals; under protection it has grown back to its original size. The chart shows the frequencies of the four alleles of one gene before the crash and after the recovery. Which statement is NOT supported by the chart?',
    o: [
      ['The regrowth of the population restored its original genetic variation', 'correct'],
      ['Two of the four alleles were lost from the population', 'miscounts the alleles with no bar after the recovery'],
      ['The frequency of allele G1 rose by 0.3', 'misreads the two G1 bars'],
      ['An allele was lost although it was more common than one that survived', 'does not compare G2 with G3 before the crash'],
    ],
    holds: ['each statement tested on the bars (bar_value); the option answers the question when its statement is false', [
      (c) => !ALLELES.every((a) => near(bar(c, 'After recovery', a), bar(c, 'Before the crash', a))) && !(ALLELES.filter((a) => bar(c, 'After recovery', a) > 0).length === 4),
      (c) => !(ALLELES.filter((a) => bar(c, 'Before the crash', a) > 0 && bar(c, 'After recovery', a) === 0).length === 2),
      (c) => !near(bar(c, 'After recovery', 'G1') - bar(c, 'Before the crash', 'G1'), 0.3),
      (c) => !ALLELES.some((a) => bar(c, 'After recovery', a) === 0 && ALLELES.some((b) => bar(c, 'After recovery', b) > 0 && bar(c, 'Before the crash', a) > bar(c, 'Before the crash', b))),
    ]],
    h: ['Compare the two bars of each allele: which alleles are still present after the recovery, and at what frequency?', 'Growth in the number of animals copies the alleles the survivors carried. Can it bring back an allele that none of the survivors had?'],
    s: 'Read from the chart: before the crash the frequencies were G1 0.4, G2 0.3, G3 0.2 and G4 0.1; after the recovery they are G1 0.7, G2 0, G3 0.3 and G4 0. So two alleles (G2 and G4) were lost, G1 rose by 0.3, and G2 was lost although it had been more common than G3, which survived — what chance survival of 20 animals can do. The population is as large as before but has two alleles instead of four: its variation was not restored, so that statement is the one the chart does not support.',
  },
]);

// ── Chi-Square Test for Genetics ────────────────────────────────────────────

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4'];
const RATIO = [9, 3, 3, 1];
G('21937bfb.lo-2', 'Observed and expected numbers when two crosses are pooled', [
  {
    t: 'observed minus expected for one class of pooled 9:3:3:1 data', d: 3, need: 'calc',
    spec: bars(CLASSES, [['Cross 1', [90, 30, 20, 20]], ['Cross 2', [80, 40, 30, 10]]], { yMax: 100, yStep: 10, yLabel: 'Number of offspring', xLabel: 'Phenotype class' }),
    alt: 'A grouped bar chart of the number of offspring in four phenotype classes, class 1 to class 4, with two bars for each class: one for cross 1 and one for cross 2.',
    q: 'The same dihybrid cross was carried out twice; the chart shows the offspring counted in the four phenotype classes each time. Classes 1, 2, 3 and 4 are expected in the ratio 9 : 3 : 3 : 1. When the two crosses are pooled, by how many offspring does the observed number in class 2 exceed the expected number?',
    n: '10',
    calc: ['pooled observed of class 2 minus 3/16 of the pooled total, all from bar_value', (c) => { const pooled = CLASSES.map((k) => bar(c, 'Cross 1', k) + bar(c, 'Cross 2', k)); const total = pooled.reduce((x, y) => x + y, 0); return round(pooled[1] - (RATIO[1] / 16) * total, 6); }],
    h: ['Add the two bars of every class to get the pooled observed numbers, then add all of them for the pooled total.', 'The expected number in a class is its share of the ratio (out of 9 + 3 + 3 + 1 parts) times the pooled total.'],
    s: 'Read from the chart: cross 1 gave 90, 30, 20 and 20 offspring and cross 2 gave 80, 40, 30 and 10. Pooled, the classes hold 170, 70, 50 and 30, a total of 320. Class 2 is expected to hold 3/16 of the total: 3/16 × 320 = 60. The observed number is 70, which exceeds the expected number by 10.',
  },
]);

G('21937bfb.lo-3', 'Chi-square from observed and expected bars', [
  {
    t: 'chi-square statistic from four observed and expected bar pairs', d: 3, need: 'calc',
    spec: bars(CLASSES, [['Observed', [100, 20, 30, 10]], ['Expected', [90, 30, 30, 10]]], { yMax: 120, yStep: 20, yLabel: 'Number of offspring', xLabel: 'Phenotype class' }),
    alt: 'A grouped bar chart of the number of offspring in four phenotype classes, class 1 to class 4, with two bars for each class: the observed number and the expected number.',
    q: 'The chart shows the observed and the expected numbers of offspring in the four phenotype classes of a dihybrid cross. What is the chi-square statistic for these data, to two decimal places?',
    n: '4.44',
    calc: ['Σ (observed − expected)² ÷ expected over the four classes, from bar_value', (c) => CLASSES.reduce((t, k) => { const [o, e] = [bar(c, 'Observed', k), bar(c, 'Expected', k)]; return t + ((o - e) * (o - e)) / e; }, 0)],
    h: ['For each class, subtract the expected number from the observed number, square the result and divide by the expected number.', 'Add the four results. A class whose two bars are the same height adds nothing.'],
    s: 'Read from the chart: observed 100, 20, 30, 10 and expected 90, 30, 30, 10. Class 1: (100 − 90)² / 90 = 1.11. Class 2: (20 − 30)² / 30 = 3.33. Classes 3 and 4: observed equals expected, so 0. Chi-square = 1.11 + 3.33 + 0 + 0 = 4.44.',
  },
]);
}

// ════════════════════════════════════════════════════════════════════════════
// AP CHEMISTRY — electrochemical cells, heating curves, orbital boxes
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// AP CHEMISTRY — electrochemical cells, heating curves, orbital boxes
// ════════════════════════════════════════════════════════════════════════════

/** Standard reduction potentials (V), as in the AP table; every one an item uses is also given in its stem. */
const E0: Record<string, number> = { Mg: -2.37, Al: -1.66, Zn: -0.76, Fe: -0.44, Ni: -0.25, Sn: -0.14, Pb: -0.13, Cu: 0.34, Ag: 0.8 };
const METAL: Record<string, { name: string; ion: string }> = { Zn: { name: 'Zinc', ion: 'Zn²⁺' }, Fe: { name: 'Iron', ion: 'Fe²⁺' }, Cu: { name: 'Copper', ion: 'Cu²⁺' }, Ag: { name: 'Silver', ion: 'Ag⁺' } };
const volts = (v: number): string => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(2)} V`;
const metalOption = (sym: string): string => `${METAL[sym].name}, E°(${METAL[sym].ion}/${sym}) = ${volts(E0[sym])}`;
type Side = 'left' | 'right';
const cell = (params: P): Spec => S('electrochemical_cell', params);
const electrode = (c: Ctx, s: Side): string => (c.p[s] as P).electrode as string;
const solution = (c: Ctx, s: Side): string => ((c.p[s] as P).solution as string) ?? '';
const otherSide = (s: Side): Side => (s === 'left' ? 'right' : 'left');
/** The reduction potentials of the two half-cells, from the electrode names printed on the figure. */
const eArgs = (c: Ctx): { leftE: number; rightE: number } => {
  const [l, r] = [E0[electrode(c, 'left')], E0[electrode(c, 'right')]];
  if (l === undefined || r === undefined) throw new Error('no potential for an electrode of the figure');
  return { leftE: l, rightE: r };
};
/** The molarity printed in a solution label ("0.010 M CuSO₄"). */
const molarity = (label: string): number => { const m = /^([\d.]+) M /.exec(label); if (!m) throw new Error(`no molarity in "${label}"`); return Number(m[1]); };
/** A number printed in the figure's title before a unit: "I = 3.00 A for 40.0 min" → titleNum(c, 'A') = 3. */
const titleNum = (c: Ctx, unit: string): number => { const m = new RegExp(`([\\d.]+) ${unit}(?![a-zA-Z])`).exec(String(c.p.title ?? '')); if (!m) throw new Error(`the title gives no value in ${unit}`); return Number(m[1]); };
/** The metal ion of an electrolyte printed on the figure: electrons per ion and molar mass (g/mol). */
const PLATED: Record<string, { n: number; molarMass: number }> = { 'NiSO₄(aq)': { n: 2, molarMass: 58.69 }, 'Cr₂(SO₄)₃(aq)': { n: 3, molarMass: 52.0 }, 'CuSO₄(aq)': { n: 2, molarMass: 63.55 }, 'AgNO₃(aq)': { n: 1, molarMass: 107.87 } };
const plated = (c: Ctx): { n: number; molarMass: number } => { const x = PLATED[solution(c, 'left')]; if (!x) throw new Error('no data for the electrolyte of the figure'); return x; };
const FARADAY = 96485;

// ── Galvanic Cell Potential Calculations (pack 165) ─────────────────────────

G('52c01b70.lo-1', 'Anode and cathode from the ion movement in the salt bridge', [
  {
    t: 'find the false statement, the anode fixed by the salt-bridge ion arrows', d: 3, need: 'reason',
    spec: cell({ left: { electrode: 'Ag', solution: '1.0 M AgNO₃' }, right: { electrode: 'Ni', solution: '1.0 M Ni(NO₃)₂' }, anode: 'right', bridgeIons: { anion: 'NO₃⁻', cation: 'K⁺' } }),
    alt: 'A silver electrode stands in the left beaker and a nickel electrode in the right beaker. The arrows under the salt bridge show nitrate ions moving toward the right beaker and potassium ions toward the left beaker; no electrode is named anode or cathode.',
    q: 'In the galvanic cell shown, the arrows under the salt bridge show the directions in which the ions of the bridge move while the cell runs. Which statement about the cell is FALSE?',
    o: [
      ['The mass of the Ag electrode decreases as the cell runs', 'correct'],
      ['Electrons leave the Ni electrode through the wire', 'takes the anions to move toward the cathode'],
      ['The Ni electrode is the negative electrode', 'gives a galvanic anode the sign of an electrolytic one'],
      ['Reduction takes place at the Ag electrode', 'takes the half-cell the cations enter to be the anode'],
    ],
    holds: ['each statement tested against the anode the ion arrows show (cell_electrode); an option answers the question when its statement is false', [
      (c) => !(c.txt('cell_electrode', { want: 'anode' }) === 'Ag'),
      (c) => !(c.txt('cell_electrode', { want: 'anode' }) === 'Ni'),
      (c) => !(c.txt('cell_electrode', { want: 'negative' }) === 'Ni'),
      (c) => !(c.txt('cell_electrode', { want: 'cathode' }) === 'Ag'),
    ]],
    h: ['Anions of the salt bridge move into the half-cell where positive ions are being produced — the half-cell of the anode.', 'Once you know the anode, recall what happens there: the metal is oxidised, goes into solution as ions, and its electrons leave through the wire.'],
    s: 'Read from the figure: NO₃⁻ moves toward the right (Ni) beaker and K⁺ toward the left (Ag) beaker. Anions move toward the anode, so Ni is the anode: Ni is oxidised, electrons leave it through the wire and it is the negative electrode. Ag is the cathode: Ag⁺ is reduced there and silver plates out, so the mass of the Ag electrode increases — the statement that it decreases is false.',
  },
]);

G('52c01b70.lo-2', 'Half-reactions from a table of reduction potentials', [
  {
    t: 'half-reaction at a named electrode, potentials chosen from a table of four', d: 3, need: 'reason',
    spec: cell({ left: { electrode: 'Cu', solution: '1.0 M Cu(NO₃)₂' }, right: { electrode: 'Pb', solution: '1.0 M Pb(NO₃)₂' }, anode: 'right' }),
    alt: 'A copper electrode stands in the left beaker and a lead electrode in the right beaker, each in a 1.0 M solution of its own nitrate. Nothing on the sketch shows which electrode is the anode.',
    q: 'Standard reduction potentials: Ag⁺/Ag +0.80 V; Cu²⁺/Cu +0.34 V; Pb²⁺/Pb −0.13 V; Fe²⁺/Fe −0.44 V. Which half-reaction takes place at the LEFT electrode of the galvanic cell shown?',
    o: [
      ['Cu²⁺(aq) + 2e⁻ → Cu(s)', 'correct'],
      ['Cu(s) → Cu²⁺(aq) + 2e⁻', 'takes the left electrode to be the anode by position'],
      ['Pb²⁺(aq) + 2e⁻ → Pb(s)', 'reduces the ion with the lower potential, and at the wrong electrode'],
      ['Pb(s) → Pb²⁺(aq) + 2e⁻', 'the right half-reaction of the cell, but it happens at the other electrode'],
    ],
    calc: ['the left electrode\'s name (spec) and whether it is the anode the two potentials give (cell_electrode with leftE, rightE)', (c) => { const m = electrode(c, 'left'); return c.txt('cell_electrode', { want: 'anode', ...eArgs(c) }) === m ? `${m}(s) → ${m}²⁺(aq) + 2e⁻` : `${m}²⁺(aq) + 2e⁻ → ${m}(s)`; }],
    h: ['Find the two metals of this cell on the sketch and pick out their two potentials from the list; the other two values are not needed.', 'The half-cell with the higher reduction potential is reduced (cathode); the other one runs in reverse as an oxidation (anode).'],
    s: 'Read from the figure: the left electrode is Cu in Cu²⁺ and the right electrode is Pb in Pb²⁺. Cu²⁺/Cu (+0.34 V) has the higher reduction potential, so Cu²⁺ is reduced at the copper electrode and Pb is oxidised at the lead electrode. At the left electrode: Cu²⁺(aq) + 2e⁻ → Cu(s).',
  },
]);

G('52c01b70.lo-3', 'Working back from a cell potential to an electrode', [
  {
    t: 'identify the unlabelled electrode from the meter reading and the electron arrow', d: 3, need: 'calc',
    spec: cell({ left: { electrode: 'Pb', solution: '1.0 M Pb(NO₃)₂' }, right: { electrode: '?', solution: '?' }, anode: 'left', electronFlow: 'value', meterLabel: '0.47 V' }),
    alt: 'A lead electrode stands in the left beaker; the electrode and the solution of the right beaker are blank boxes. An arrow labelled e⁻ on the wire points from the left electrode to the right electrode, and a reading is printed under the voltmeter.',
    q: 'The galvanic cell shown runs under standard conditions: the arrow shows the electron flow in the wire and the voltmeter shows E°cell. E°(Pb²⁺/Pb) = −0.13 V. Which metal is the unlabelled electrode?',
    o: [
      [metalOption('Cu'), 'correct'],
      [metalOption('Ag'), 'adds the reading to +0.34 V instead of to the lead potential'],
      [metalOption('Fe'), 'takes the unlabelled electrode to be the anode and picks a metal below lead'],
      [metalOption('Zn'), 'subtracts the reading from the lead potential and picks the nearest metal'],
    ],
    calc: ['E° of the unknown half-cell = E°(known) ± the printed reading, the sign from which side the spec makes the anode; then the metal of the table with that potential', (c) => {
      const known: Side = electrode(c, 'left') === '?' ? 'right' : 'left';
      const reading = Number(String(c.p.meterLabel).replace(' V', ''));
      const e = c.p.anode === known ? E0[electrode(c, known)] + reading : E0[electrode(c, known)] - reading;
      const hit = Object.keys(METAL).filter((m) => near(E0[m], e, 1e-6));
      if (hit.length !== 1) throw new Error(`no single metal at ${e} V`);
      return metalOption(hit[0]);
    }],
    h: ['The electron arrow tells you which electrode is the anode: electrons leave the anode and arrive at the cathode.', 'Write E°cell = E°(cathode) − E°(anode), put in the reading and the lead potential, and solve for the unknown one.'],
    s: 'Read from the figure: electrons flow from the Pb electrode to the unlabelled one, so Pb is the anode and the unlabelled electrode is the cathode; the voltmeter reads 0.47 V. E°cell = E°(cathode) − E°(anode), so E°(cathode) = 0.47 + (−0.13) = +0.34 V, the reduction potential of Cu²⁺/Cu. The electrode is copper.',
  },
]);

G('52c01b70.lo-4', 'Electron flow and ion movement predicted from potentials', [
  {
    t: 'electron flow in the wire and cation movement in the bridge, cathode drawn on the left', d: 3, need: 'reason',
    spec: cell({ left: { electrode: 'Ag', solution: '1.0 M AgNO₃' }, right: { electrode: 'Fe', solution: '1.0 M Fe(NO₃)₂' }, anode: 'right', electronFlow: 'blank', saltBridge: 'KNO₃ bridge' }),
    alt: 'A silver electrode stands in the left beaker and an iron electrode in the right beaker, joined by a salt bridge labelled KNO₃ bridge. Over the wire the label e⁻ stands beside a blank box: the direction of electron flow is not shown.',
    q: 'The galvanic cell shown operates under standard conditions, with E°(Ag⁺/Ag) = +0.80 V and E°(Fe²⁺/Fe) = −0.44 V. Which line gives the direction of electron flow in the wire and the direction in which K⁺ ions move in the salt bridge?',
    o: [
      ['Electrons: Fe to Ag; K⁺ ions: toward the Ag half-cell', 'correct'],
      ['Electrons: Fe to Ag; K⁺ ions: toward the Fe half-cell', 'sends the cations to the anode half-cell'],
      ['Electrons: Ag to Fe; K⁺ ions: toward the Ag half-cell', 'takes the left electrode, or the higher potential, to be the anode'],
      ['Electrons: Ag to Fe; K⁺ ions: toward the Fe half-cell', 'reverses the whole cell'],
    ],
    calc: ['cell_electron_flow and cell_ion_migration (cation), the anode fixed by the two potentials of the printed electrodes', (c) => `Electrons: ${c.txt('cell_electron_flow', eArgs(c))}; K⁺ ions: toward the ${c.txt('cell_ion_migration', { ion: 'cation', ...eArgs(c) })} half-cell`],
    h: ['The metal whose half-cell has the lower reduction potential is oxidised; electrons leave that electrode. Check which side of the sketch it is on.', 'In the cathode half-cell positive ions are being removed from the solution, so positive ions from the bridge move in to replace them.'],
    s: 'Read from the figure: Ag is the left electrode and Fe the right one. Fe²⁺/Fe (−0.44 V) is lower than Ag⁺/Ag (+0.80 V), so Fe is oxidised (anode) and Ag⁺ is reduced (cathode): electrons flow through the wire from Fe to Ag, right to left on the sketch. Ag⁺ is used up in the silver half-cell, so K⁺ ions move from the bridge toward the Ag half-cell.',
  },
]);

G('52c01b70.lo-5', 'Spontaneity of a cell as someone describes it', [
  {
    t: 'signed E° of the reaction for a claimed anode', d: 3, need: 'calc',
    spec: cell({ left: { electrode: 'Sn', solution: '1.0 M Sn(NO₃)₂' }, right: { electrode: 'Fe', solution: '1.0 M Fe(NO₃)₂' }, anode: 'right' }),
    alt: 'A tin electrode stands in the left beaker and an iron electrode in the right beaker, each in a 1.0 M solution of its own nitrate. Nothing on the sketch shows which electrode is the anode.',
    q: 'A student claims that, in the cell shown under standard conditions, the LEFT electrode is the anode. E°(Sn²⁺/Sn) = −0.14 V and E°(Fe²⁺/Fe) = −0.44 V. What is E° for the cell reaction the student describes, in volts? Include the sign (a negative value means the reaction is not spontaneous as described).',
    n: '-0.30',
    calc: ['E°(right) − E°(left) from the printed electrodes: the left electrode as the anode; checked to be the opposite of the true cell potential (cell_potential)', (c) => { const e = eArgs(c); const v = round(e.rightE - e.leftE, 6); if (!near(v, -c.num('cell_potential', e))) throw new Error('not the reverse of the galvanic cell'); return v; }],
    h: ['Read which metal is on the left. If it were the anode, it would be the one oxidised, and the other half-cell would be the cathode.', 'Use E°cell = E°(cathode) − E°(anode) with the roles the student gives, and keep the sign of the result.'],
    s: 'Read from the figure: the left electrode is Sn and the right electrode is Fe. If Sn were the anode, the reaction would be Sn(s) + Fe²⁺(aq) → Sn²⁺(aq) + Fe(s), with E° = E°(cathode) − E°(anode) = −0.44 − (−0.14) = −0.30 V. The negative value shows the reaction is not spontaneous as described: the cell really runs the other way, with Fe as the anode.',
  },
]);

// ── Cell potential and free energy (pack 189) ───────────────────────────────

G('e381048c.lo-1', 'Cell potential, free energy and the direction of the reaction', [
  {
    t: 'which reaction has negative ΔG°, from the electron arrow and the reading', d: 3, need: 'reason',
    spec: cell({ left: { electrode: 'Ag', solution: '1.0 M AgNO₃' }, right: { electrode: 'Cu', solution: '1.0 M Cu(NO₃)₂' }, anode: 'right', electronFlow: 'value', meterLabel: '0.46 V' }),
    alt: 'A silver electrode stands in the left beaker and a copper electrode in the right beaker. An arrow labelled e⁻ on the wire points from the right electrode to the left electrode, and a positive reading is printed under the voltmeter.',
    q: 'The galvanic cell shown runs under standard conditions; the arrow shows the electron flow in the wire and the voltmeter shows the cell potential. Which statement is correct?',
    o: [
      ['Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s) has ΔG° < 0 and K > 1', 'correct'],
      ['Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s) has ΔG° > 0 and K < 1', 'gives ΔG° the sign of the cell potential'],
      ['2Ag(s) + Cu²⁺(aq) → 2Ag⁺(aq) + Cu(s) has ΔG° < 0 and K > 1', 'reads the electron arrow backwards, or takes the left electrode to be the anode'],
      ['Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s) has ΔG° < 0 and K < 1', 'pairs a negative ΔG° with a small equilibrium constant'],
    ],
    holds: ['each statement tested: the metal it oxidises is the anode the arrow shows (cell_electrode) and the reading is positive ⇒ ΔG° < 0 and K > 1 for that reaction (the reverse reaction has ΔG° > 0 and K < 1)', (() => {
      const test = (oxidised: string, dG: -1 | 1, k: -1 | 1) => (c: Ctx): boolean => { const forward = c.txt('cell_electrode', { want: 'anode' }) === oxidised; const e = Number(String(c.p.meterLabel).replace(' V', '')) * (forward ? 1 : -1); return Math.sign(-e) === dG && Math.sign(e) === k; };
      return [test('Cu', -1, 1), test('Cu', 1, -1), test('Ag', -1, 1), test('Cu', -1, -1)];
    })()],
    h: ['Electrons leave the electrode where the metal is oxidised. Use the arrow to decide which metal is the reactant that loses electrons.', 'A cell that runs by itself has a positive potential; ΔG° = −nFE°, and a negative ΔG° goes with an equilibrium constant greater than 1.'],
    s: 'Read from the figure: electrons flow from the Cu electrode to the Ag electrode and the voltmeter reads a positive 0.46 V. So Cu is oxidised and Ag⁺ is reduced: Cu(s) + 2Ag⁺(aq) → Cu²⁺(aq) + 2Ag(s) is the spontaneous reaction. With E° > 0, ΔG° = −nFE° is negative and K is greater than 1.',
  },
]);

G('e381048c.lo-3', 'Concentration and the cell potential', [
  {
    t: 'reading compared with E° for unequal concentrations, cathode drawn on the left', d: 3, need: 'reason',
    spec: cell({ left: { electrode: 'Cu', solution: '0.010 M CuSO₄' }, right: { electrode: 'Zn', solution: '1.0 M ZnSO₄' }, anode: 'right', meterLabel: '?' }),
    alt: 'A copper electrode stands in the left beaker, whose solution is labelled 0.010 M copper sulfate, and a zinc electrode in the right beaker, whose solution is labelled 1.0 M zinc sulfate. The voltmeter reading is a blank box.',
    q: 'For the galvanic cell shown at 25 °C, E°(Cu²⁺/Cu) = +0.34 V and E°(Zn²⁺/Zn) = −0.76 V, so E°cell = 1.10 V. With the concentrations shown, in which range is the voltmeter reading?',
    o: [
      ['Between 0 V and 1.10 V', 'correct'],
      ['Greater than 1.10 V', 'writes Q upside down: the reactant ion over the product ion'],
      ['Exactly 1.10 V', 'takes E° for the cell potential at any concentration'],
      ['Exactly 0 V', 'takes unequal concentrations to mean the cell is at equilibrium'],
    ],
    holds: ['E = E°cell − (0.0592 V / 2) · log₁₀ Q at 25 °C, with E°cell by cell_potential and Q = [ion of the anode metal] / [ion of the cathode metal] from the printed concentrations (the anode from the two potentials, cell_electrode); each option\'s range tested against E', (() => {
      const e = (c: Ctx): number => { const an: Side = c.txt('cell_electrode', { want: 'anode', ...eArgs(c) }) === electrode(c, 'left') ? 'left' : 'right'; const q = molarity(solution(c, an)) / molarity(solution(c, otherSide(an))); return c.num('cell_potential', eArgs(c)) - (0.0592 / 2) * Math.log10(q); };
      return [(c: Ctx) => e(c) > 0 && e(c) < 1.1, (c: Ctx) => e(c) > 1.1, (c: Ctx) => near(e(c), 1.1), (c: Ctx) => near(e(c), 0)];
    })()],
    h: ['Decide first which metal is oxidised: its ion is the product of the cell reaction, and the other ion is the reactant.', 'Compare the reaction quotient Q = [product ion]/[reactant ion] with 1: the cell potential is below E° when Q > 1 and above it when Q < 1.'],
    s: 'Read from the figure: the copper half-cell is 0.010 M Cu²⁺ and the zinc half-cell is 1.0 M Zn²⁺. Zn has the lower reduction potential, so the reaction is Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) and Q = [Zn²⁺]/[Cu²⁺] = 1.0/0.010 = 100. Because Q > 1 (little reactant ion, much product ion), the cell potential is less than E°cell = 1.10 V. It is still well above zero — by the Nernst equation E = 1.10 − (0.0592/2)·log 100 = 1.04 V — because the cell is far from equilibrium. The reading is between 0 V and 1.10 V.',
  },
]);

// ── Electrolysis Calculations with Faraday's Law (top-up pack 052) ──────────

G('32385f30.lo-1', 'Oxidation and reduction at the electrodes of an electrolytic cell', [
  {
    t: 'change at a named electrode, its role read from the battery', d: 3, need: 'reason',
    spec: cell({ variant: 'electrolytic', left: { electrode: 'Pt', solution: 'AgNO₃(aq)' }, right: { electrode: 'Ag' }, anode: 'right' }),
    alt: 'One beaker of silver nitrate solution holds a platinum electrode on the left and a silver electrode on the right, wired to a battery. The battery\'s long thin plate is on the side of the silver electrode; no electrode is named anode or cathode and no signs are printed.',
    q: 'In the electrolytic cell shown, the long thin plate of the battery symbol is its positive terminal. Which line describes the change that takes place at the Pt electrode?',
    o: [
      ['Ag⁺ is reduced to Ag: oxidation state +1 to 0', 'correct'],
      ['Ag is oxidised to Ag⁺: oxidation state 0 to +1', 'the change at the silver electrode, the anode'],
      ['Water is oxidised to O₂: oxygen goes from −2 to 0', 'takes the platinum electrode to be the anode'],
      ['Ag⁺ is reduced to Ag: oxidation state 0 to +1', 'right process, but the oxidation states are in the wrong order'],
    ],
    holds: ['the Pt electrode is the cathode the battery shows (cell_electrode): a reduction of Ag⁺, +1 → 0, happens there; an oxidation would need it to be the anode', [
      (c) => c.txt('cell_electrode', { want: 'cathode' }) === 'Pt' && c.txt('cell_electrode', { want: 'negative' }) === 'Pt',
      (c) => c.txt('cell_electrode', { want: 'anode' }) === 'Pt' && electrode(c, 'left') === 'Ag',
      (c) => c.txt('cell_electrode', { want: 'anode' }) === 'Pt',
      () => false,
    ]],
    h: ['The electrode wired to the battery\'s positive terminal has electrons pulled out of it; the electrode wired to the negative terminal has electrons pushed into it.', 'Electrons arriving at an electrode are taken up by a species in the solution — decide which ion can gain them, and how its oxidation state changes.'],
    s: 'Read from the figure: the battery\'s long thin (positive) plate is on the side of the Ag electrode, so the Pt electrode is wired to the negative terminal. Electrons are pushed into the Pt electrode, which makes it the cathode: Ag⁺ ions from the solution gain an electron there, Ag⁺ + e⁻ → Ag, and silver goes from oxidation state +1 to 0. (At the Ag anode, Ag is oxidised to Ag⁺.)',
  },
]);

G('32385f30.lo-2', 'Charge, moles of electrons and where the electrons go', [
  {
    t: 'moles of electrons from the current and time on the figure, and the electrode that takes them up', d: 3, need: 'calc',
    spec: cell({ variant: 'electrolytic', left: { electrode: 'Cu', solution: 'CuSO₄(aq)' }, right: { electrode: 'Pt' }, anode: 'left', title: 'Current 2.00 A for 965 s' }),
    alt: 'One beaker of copper sulfate solution holds a copper electrode on the left and a platinum electrode on the right, wired to a battery whose long thin plate is on the side of the copper electrode. The current and the time are printed above the sketch.',
    q: 'The electrolytic cell shown runs with the current and for the time printed above it; the long thin plate of the battery symbol is its positive terminal. How many moles of electrons pass through the circuit, and at which electrode are they taken up in a reduction? Use F = 96,485 C/mol.',
    o: [
      ['0.0200 mol; at the Pt electrode', 'correct'],
      ['0.0200 mol; at the Cu electrode', 'takes the electrode on the positive terminal to be the cathode'],
      ['0.0100 mol; at the Pt electrode', 'divides by 2 for Cu²⁺: that is the moles of copper, not of electrons'],
      ['0.0100 mol; at the Cu electrode', 'both mistakes'],
    ],
    calc: ['current × time ÷ F from the values printed in the title, and the cathode the battery shows (cell_electrode)', (c) => `${(titleNum(c, 'A') * titleNum(c, 's') / FARADAY).toFixed(4)} mol; at the ${c.txt('cell_electrode', { want: 'cathode' })} electrode`],
    h: ['Charge is current × time, and each mole of electrons carries F coulombs. The charge on the metal ion does not enter this step.', 'Electrons are pushed into the electrode wired to the battery\'s negative terminal; a reduction takes them up there.'],
    s: 'Read from the figure: the current is 2.00 A, the time is 965 s, and the battery\'s positive plate is on the side of the Cu electrode. Q = It = 2.00 × 965 = 1930 C, so moles of electrons = 1930 / 96,485 = 0.0200 mol. The Pt electrode is wired to the negative terminal, so it is the cathode: the electrons are taken up there, by Cu²⁺ + 2e⁻ → Cu (which deposits 0.0100 mol of copper).',
  },
]);

SKIP('32385f30.lo-3', 'converting a stated charge to moles of electrons (n = Q / F) is one division on numbers given in the stem; a cell sketch could only repeat those numbers or sit beside them — decoration. The current/time-to-moles step on a figure is carried by the item of 32385f30.lo-2.');

G('32385f30.lo-4', 'Mass deposited, the metal read from the cell', [
  {
    t: 'mass gained by the cathode, the ion and its charge read from the electrolyte', d: 3, need: 'calc',
    spec: cell({ variant: 'electrolytic', left: { electrode: 'Ni', solution: 'NiSO₄(aq)' }, right: { electrode: 'Pt' }, anode: 'left', title: 'Current 3.00 A for 40.0 min' }),
    alt: 'One beaker of nickel sulfate solution holds a nickel electrode on the left and a platinum electrode on the right, wired to a battery whose long thin plate is on the side of the nickel electrode. The current and the time are printed above the sketch.',
    q: 'The electrolytic cell shown runs with the current and for the time printed above it, and every electron reaching the cathode reduces a metal ion of the solution. By how many grams does the mass of the cathode increase? Use F = 96,485 C/mol and molar masses Ni = 58.69, Cu = 63.55, Pt = 195.08 g/mol. Round to two decimal places.',
    n: '2.19',
    calc: ['cell_mass_deposited with the current and time printed in the title, and n and the molar mass of the metal ion of the printed electrolyte', (c) => c.num('cell_mass_deposited', { current: titleNum(c, 'A'), time: titleNum(c, 'min') * 60, ...plated(c) })],
    h: ['Read the electrolyte on the sketch: the sulfate ion is SO₄²⁻, which tells you the charge of the metal ion and so how many electrons each ion needs.', 'Convert the time to seconds, find the charge Q = It, then moles of electrons = Q / F, then moles of metal, then grams.'],
    s: 'Read from the figure: the solution is NiSO₄(aq), so the ion reduced is Ni²⁺ (Ni²⁺ + 2e⁻ → Ni); the current is 3.00 A and the time is 40.0 min = 2400 s. Q = 3.00 × 2400 = 7200 C; moles of electrons = 7200 / 96,485 = 0.07462 mol; moles of Ni = 0.07462 / 2 = 0.03731 mol; mass = 0.03731 × 58.69 = 2.19 g, deposited on the Pt cathode.',
  },
]);

G('32385f30.lo-5', 'Time needed, the electrons per ion read from the electrolyte', [
  {
    t: 'time for a target mass, the ion charge worked out from the formula of the electrolyte', d: 3, need: 'calc',
    spec: cell({ variant: 'electrolytic', left: { electrode: 'Fe', solution: 'Cr₂(SO₄)₃(aq)' }, right: { electrode: 'Pt' }, anode: 'right', title: 'Target: 2.60 g of Cr; current 4.00 A' }),
    alt: 'One beaker of chromium sulfate solution, formula Cr₂(SO₄)₃, holds an iron electrode on the left and a platinum electrode on the right, wired to a battery whose long thin plate is on the side of the platinum electrode. The target mass of chromium and the current are printed above the sketch.',
    q: 'The cell shown is used to plate chromium onto the iron electrode; the target mass and the current are printed above it. Assume every electron reaching the cathode reduces a chromium ion of the solution. For how many minutes must the current run? Use F = 96,485 C/mol and molar mass Cr = 52.00 g/mol. Round to one decimal place.',
    n: '60.3',
    calc: ['(mass ÷ molar mass) × n × F ÷ current ÷ 60, mass and current from the title, n and molar mass from the printed electrolyte; checked by cell_mass_deposited for that time', (c) => { const { n, molarMass } = plated(c); const s = (titleNum(c, 'g') / molarMass) * n * FARADAY / titleNum(c, 'A'); if (!near(c.num('cell_mass_deposited', { current: titleNum(c, 'A'), time: s, n, molarMass }), titleNum(c, 'g'), 1e-6)) throw new Error('time does not give the target mass'); return s / 60; }],
    h: ['Work out the charge of the chromium ion from the formula of the electrolyte: three sulfate ions, each 2−, are balanced by two chromium ions.', 'Go from grams of chromium to moles, then to moles of electrons, then to coulombs with F, and divide by the current; finish by changing seconds to minutes.'],
    s: 'Read from the figure: the electrolyte is Cr₂(SO₄)₃, so the ion is Cr³⁺ (Cr³⁺ + 3e⁻ → Cr); the target is 2.60 g of Cr and the current is 4.00 A. Moles of Cr = 2.60 / 52.00 = 0.0500 mol; moles of electrons = 3 × 0.0500 = 0.150 mol; Q = 0.150 × 96,485 = 14,473 C; t = 14,473 / 4.00 = 3618 s = 60.3 min.',
  },
]);

// ── Heat of Phase Changes Calculations (pack 159) ───────────────────────────

const heating = (params: P): Spec => S('heating_curve', params);
/** The corners of a curve drawn through given corners. */
const cornersOf = (c: Ctx): number[][] => c.p.corners as number[][];

G('3aa75ee5.lo-1', 'Enthalpies of fusion and vaporization compared on a heating curve', [
  {
    t: 'ratio of the enthalpy of vaporization to the enthalpy of fusion from the two plateaus', d: 3, need: 'calc',
    spec: heating({ corners: [[0, -30], [2, 10], [5, 10], [9, 90], [24, 90], [26, 130]], xStep: 2, yStep: 20 }),
    alt: 'The line rises, runs flat, rises again, runs flat for a much longer stretch at a higher temperature, then rises once more. Neither flat stretch is labelled with a phase change or a temperature.',
    q: 'The heating curve shown is for a sample of a pure substance X heated at constant pressure. How many times as large is the enthalpy of vaporization of X (in J/g) as its enthalpy of fusion (in J/g)?',
    n: '5',
    calc: ['heat added over the second flat segment ÷ heat added over the first (heating_heat on each; the same sample, so the masses cancel)', (c) => { if (c.txt('heating_segment', { segment: 1, want: 'process' }) !== 'melting' || c.txt('heating_segment', { segment: 3, want: 'process' }) !== 'boiling') throw new Error('plateaus are not melting then boiling'); return c.num('heating_heat', { segment: 3 }) / c.num('heating_heat', { segment: 1 }); }],
    h: ['During a change of state the temperature stays constant: each flat part of the curve is one change of state, and its length along the heat axis is the heat that change took.', 'Both flat parts are for the same sample, so the mass divides out when you compare the two heats.'],
    s: 'Read from the figure: the first flat part (melting) runs from 2 kJ to 5 kJ, so melting the sample takes 3 kJ; the second flat part (boiling) runs from 9 kJ to 24 kJ, so vaporizing it takes 15 kJ. Both are for the same mass, so ΔHvap / ΔHfus = 15 / 3 = 5: the enthalpy of vaporization is 5 times the enthalpy of fusion.',
  },
]);

G('3aa75ee5.lo-2', 'Heat released on freezing, from a cooling curve', [
  {
    t: 'heat released when a different mass freezes, the freezing plateau picked out on a cooling curve', d: 3, need: 'calc',
    spec: heating({ corners: [[0, 130], [1, 100], [13, 100], [16, 40], [19, 40], [20, 10]], xStep: 2, yStep: 20, title: 'Sample mass: 10.0 g' }),
    alt: 'The line falls, runs flat for a long stretch, falls again, runs flat for a shorter stretch at a lower temperature, then falls once more. The sample mass is printed above the graph; neither flat stretch is labelled.',
    q: 'The cooling curve shown is for a sample of a pure substance X that starts as a gas; the sample mass is printed above the graph. How much heat is released when 25.0 g of liquid X, already at its freezing point, freezes completely? Give the amount as a positive number, in kJ.',
    n: '7.5',
    calc: ['heat removed over the freezing segment (heating_heat) × 25.0 g ÷ the sample mass printed in the title', (c) => { if (c.txt('heating_segment', { segment: 3, want: 'process' }) !== 'freezing') throw new Error('segment 4 is not freezing'); return c.num('heating_heat', { segment: 3 }) * 25 / titleNum(c, 'g'); }],
    h: ['On a cooling curve that starts with a gas, the first flat part is condensation; freezing is the flat part at the lower temperature.', 'The length of that flat part is the heat released by the sample on the graph; the heat released is proportional to the mass that freezes.'],
    s: 'Read from the figure: the sample is 10.0 g, and the lower flat part (freezing, at 40 °C) runs from 16 kJ to 19 kJ of heat removed, so freezing 10.0 g releases 3 kJ. That is 0.300 kJ per gram, so 25.0 g releases 25.0 × 0.300 = 7.5 kJ.',
  },
]);

G('3aa75ee5.lo-3', 'Heat of vaporization from the time a heater takes', [
  {
    t: 'heat to vaporize a different mass, from the boiling time and the heater power', d: 3, need: 'calc',
    spec: heating({ substance: { mass: 50, meltingPoint: 20, boilingPoint: 80, cSolid: 1, cLiquid: 2, cGas: 1, heatFusion: 120, heatVaporization: 600 }, startTemp: -40, endTemp: 110, xQuantity: 'time', power: 50, timeUnit: 'min', xStep: 1, yStep: 20 }),
    alt: 'Temperature is plotted against time in minutes. The line rises, runs flat briefly, rises again, runs flat for a much longer time at a higher temperature, then rises a little more. Neither flat stretch is labelled.',
    q: 'A 50.0 g sample of a pure substance X is warmed by a heater that supplies 50.0 J of heat each second, all of it absorbed by X. The graph shows the temperature of X. How much heat is needed to vaporize 20.0 g of liquid X at its boiling point, in kJ?',
    n: '12',
    calc: ['heat added over the boiling segment (heating_heat: its time × the heater power of the spec) × 20.0 g ÷ the sample mass of the spec', (c) => { if (c.txt('heating_segment', { segment: 3, want: 'process' }) !== 'boiling') throw new Error('segment 4 is not boiling'); return c.num('heating_heat', { segment: 3 }) * 20 / ((c.p.substance as P).mass as number); }],
    h: ['Boiling is the flat part at the higher temperature. Read the times at which it starts and ends.', 'Heat supplied = power × time (with the time in seconds). That heat vaporizes the whole sample, so scale it to the mass asked for.'],
    s: 'Read from the figure: the higher flat part (boiling, at 80 °C) lasts from 5 min to 15 min, which is 10 min = 600 s. The heater supplies 50.0 × 600 = 30,000 J = 30 kJ in that time, and this vaporizes the whole 50.0 g. So X needs 30 kJ / 50.0 g = 0.60 kJ per gram, and 20.0 g needs 20.0 × 0.60 = 12 kJ.',
  },
]);

G('3aa75ee5.lo-4', 'A two-step heat calculation built from a heating curve', [
  {
    t: 'melt and then warm a different mass to a temperature part-way along the liquid segment', d: 3, need: 'calc',
    spec: heating({ corners: [[0, -20], [1, 20], [3, 20], [6, 80], [14, 80], [15, 120]], xStep: 1, yStep: 20, title: 'Sample mass: 20.0 g' }),
    alt: 'The line rises, runs flat, rises again more gently, runs flat for a long stretch at a higher temperature, then rises once more. The sample mass is printed above the graph; neither flat stretch is labelled.',
    q: 'The heating curve shown is for a sample of a pure substance X; the sample mass is printed above the graph. How much heat is needed to change 50.0 g of solid X at its melting point into liquid X at 60 °C, in kJ?',
    n: '10',
    calc: ['(heat of the melting segment + heat of the liquid segment × (60 − melting point) ÷ (boiling point − melting point)) × 50.0 g ÷ the sample mass in the title; heats by heating_heat, temperatures by heating_point', (c) => { const [mp, bp] = [c.num('heating_point', { want: 'melting_point' }), c.num('heating_point', { want: 'boiling_point' })]; if (!near(cornersOf(c)[2][1], mp)) throw new Error('corner 3 is not the end of melting'); return (c.num('heating_heat', { segment: 1 }) + c.num('heating_heat', { segment: 2 }) * (60 - mp) / (bp - mp)) * 50 / titleNum(c, 'g'); }],
    h: ['There are two steps: melting at constant temperature (the first flat part), then warming the liquid (the sloped part after it) — but only part of the way up that slope.', 'The liquid warms at a steady rate along its segment, so the heat for part of the temperature rise is the same fraction of the heat for the whole segment. Scale both steps from the sample mass to the mass asked for.'],
    s: 'Read from the figure: the sample is 20.0 g; melting (flat at 20 °C) runs from 1 kJ to 3 kJ, so it takes 2 kJ; the liquid warms from 20 °C to 80 °C between 3 kJ and 6 kJ, so 3 kJ for 60 °C, or 2 kJ for the 40 °C from 20 °C to 60 °C. For the 20.0 g sample the two steps take 2 + 2 = 4 kJ; for 50.0 g the heat is 4 × 50.0 / 20.0 = 10 kJ.',
  },
]);

// ── Electron Configuration Writing (pack 149) ───────────────────────────────

const boxes = (diagrams: P[], extra: P = {}): Spec => S('energy_levels', { variant: 'orbital_boxes', diagrams, ...extra });
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number): string => [...String(n)].map((ch) => SUP[Number(ch)]).join('');
/** The configuration a diagram shows, as [subshell, electrons] in the order drawn (orbital_configuration, plain style), and its core. */
const configOf = (c: Ctx, diagram: number | string = 0): { core: string; subs: Array<[string, number]> } => {
  const parts = c.txt('orbital_configuration', { diagram, style: 'plain' }).split(' ');
  const core = parts[0].startsWith('[') ? (parts.shift() as string) : '';
  return { core, subs: parts.map((x) => [x.slice(0, 2), Number(x.slice(2))] as [string, number]) };
};
/** Remove k electrons to make a cation: from the highest n first, and within a shell from the highest l (so 4p, then 4s, before 3d). */
const ionise = (subs: Array<[string, number]>, k: number): Array<[string, number]> => {
  const out = subs.map(([n, e]) => [n, e] as [string, number]);
  for (let left = k; left > 0; left--) {
    const top = out.filter(([, e]) => e > 0).sort((a, b) => Number(b[0][0]) - Number(a[0][0]) || 'spdf'.indexOf(b[0][1]) - 'spdf'.indexOf(a[0][1]))[0];
    if (!top) throw new Error('no electron left to remove');
    top[1] -= 1;
  }
  return out;
};
const configText = (core: string, subs: Array<[string, number]>): string => [core, ...subs.filter(([, e]) => e > 0).map(([n, e]) => `${n}${sup(e)}`)].filter(Boolean).join(' ');
/** Unpaired electrons of a subshell filled by Hund's rule. */
const unpaired = (name: string, e: number): number => { const cap = 2 * 'spdf'.indexOf(name[1]) + 1; return e <= cap ? e : 2 * cap - e; };
const sub = (name: string, b: string[]): P => ({ name, boxes: b });

G('04ab71bd.lo-1', 'The ground state among four orbital diagrams', [
  {
    t: 'pick the ground-state diagram among Hund, Aufbau and Pauli mistakes', d: 3, need: 'reason',
    spec: boxes([
      { label: 'I', subshells: [sub('1s', ['ud']), sub('2s', ['ud']), sub('2p', ['ud', 'ud', 'ud']), sub('3s', ['ud']), sub('3p', ['ud', 'ud', ''])] },
      { label: 'II', subshells: [sub('1s', ['ud']), sub('2s', ['ud']), sub('2p', ['ud', 'ud', 'ud']), sub('3s', ['u']), sub('3p', ['ud', 'ud', 'u'])] },
      { label: 'III', subshells: [sub('1s', ['ud']), sub('2s', ['ud']), sub('2p', ['ud', 'ud', 'ud']), sub('3s', ['ud']), sub('3p', ['ud', 'u', 'u'])] },
      { label: 'IV', subshells: [sub('1s', ['ud']), sub('2s', ['ud']), sub('2p', ['ud', 'ud', 'ud']), sub('3s', ['ud']), sub('3p', ['uu', 'u', 'u'])] },
    ]),
    alt: 'Four orbital diagrams numbered I to IV, each with the subshells 1s, 2s, 2p, 3s and 3p and sixteen arrows in all. They differ only in how the arrows are placed in the 3s and 3p boxes.',
    q: 'A neutral sulfur atom has 16 electrons. Which of the four orbital diagrams shown is the ground state of the sulfur atom?',
    o: [['Diagram III', 'correct'], ['Diagram I', 'pairs all the 3p electrons and leaves a 3p orbital empty (Hund\'s rule)'], ['Diagram II', 'accepts 3p electrons while 3s is half empty (Aufbau)'], ['Diagram IV', 'accepts two arrows of the same direction in one box (Pauli)']],
    calc: ['orbital_ground_state: the one diagram that keeps the Pauli principle, the Aufbau order and Hund\'s rule', (c) => `Diagram ${c.txt('orbital_ground_state')}`],
    h: ['All four diagrams hold 16 electrons, so counting will not separate them: check each against the three filling rules.', 'A lower subshell must be full before the next one is used; in a set of equal-energy orbitals electrons stay unpaired as long as they can; two electrons in one orbital must have opposite spins.'],
    s: 'Read from the figure: diagram I has two pairs and an empty box in 3p, which breaks Hund\'s rule; diagram II has only one electron in 3s while 3p holds five, which breaks the Aufbau order; diagram IV has two arrows pointing the same way in one 3p box, which breaks the Pauli exclusion principle. Diagram III has 3s full and 3p with one pair and two unpaired electrons of the same spin: 1s² 2s² 2p⁶ 3s² 3p⁴, the ground state.',
  },
]);

G('04ab71bd.lo-2', 'A noble-gas configuration for an ion, from the atom\'s orbital diagram', [
  {
    t: 'noble-gas configuration of the 3+ ion of the atom drawn', d: 3, need: 'reason',
    spec: boxes([{ core: 'Ar', config: '4s2 3d10 4p1' }]),
    hide: ['3d'],
    alt: 'One orbital diagram after an argon core, its groups of boxes labelled as s, d and p subshells: the s box and all five d boxes hold a pair of arrows each, and of the p boxes only the first holds a single arrow.',
    q: 'The orbital diagram shown is the ground state of a neutral atom X. What is the noble-gas electron configuration of the ion X³⁺?',
    o: [
      ['[Ar] 3d¹⁰', 'correct'],
      ['[Ar] 4s² 3d⁸', 'removes the 4p electron and then two 3d electrons, leaving 4s full'],
      ['[Ar] 4s² 3d¹⁰ 4p⁴', 'adds three electrons instead of removing them'],
      ['[Ar] 4s² 3d⁹', 'removes the last electrons in filling order instead of from the outermost shell'],
    ],
    calc: ['the configuration the diagram shows (orbital_configuration) with three electrons removed from the highest shell first: 4p, then 4s', (c) => { const { core, subs } = configOf(c); return configText(core, ionise(subs, 3)); }],
    h: ['Write down the configuration the diagram shows by counting the arrows in each subshell after the [Ar] core.', 'A positive ion has lost electrons, and they come out of the shell with the highest principal quantum number first — not out of the subshell that was filled last.'],
    s: 'Read from the figure: after the [Ar] core the atom has 4s² 3d¹⁰ 4p¹ (it is gallium). Forming X³⁺ removes three electrons from the outermost shell, n = 4: the one 4p electron and the two 4s electrons. The 3d subshell stays full, so X³⁺ is [Ar] 3d¹⁰.',
  },
]);

G('04ab71bd.lo-3', 'Transition-metal cations from an orbital diagram', [
  {
    t: 'unpaired electrons of the 3+ ion of the atom drawn', d: 3, need: 'calc',
    spec: boxes([{ core: 'Ar', config: '4s2 3d6' }]),
    alt: 'One orbital diagram after an argon core: the 4s box holds a pair of arrows, and of the five 3d boxes the first holds a pair and the other four hold a single arrow each.',
    q: 'The orbital diagram shown is the ground state of a neutral atom of a transition metal M. How many unpaired electrons does the ion M³⁺ have in its ground state?',
    n: '5',
    calc: ['the configuration the diagram shows (orbital_configuration) with three electrons removed, 4s before 3d; then the unpaired electrons of each subshell under Hund\'s rule', (c) => { const { subs } = configOf(c); if (c.num('orbital_count', { want: 'unpaired' }) === 5) throw new Error('the atom itself shows the key'); return ionise(subs, 3).reduce((t, [n, e]) => t + unpaired(n, e), 0); }],
    h: ['When a transition metal forms a cation, the 4s electrons are removed before any 3d electron.', 'Work out how many 3d electrons are left in the ion, then spread them over the five 3d orbitals by Hund\'s rule.'],
    s: 'Read from the figure: after the [Ar] core the atom has 4s² 3d⁶ (it is iron), with four unpaired 3d electrons. Forming M³⁺ removes the two 4s electrons first and then one 3d electron, leaving [Ar] 3d⁵. Five electrons in five 3d orbitals are all unpaired by Hund\'s rule, so the ion has 5 unpaired electrons.',
  },
  {
    t: 'pick the diagram of the 2+ ion among wrong removals and a Hund mistake', d: 3, need: 'reason',
    spec: boxes([
      { label: 'I', core: 'Ar', subshells: [sub('4s', ['ud']), sub('3d', ['ud', 'u', 'u', 'u', 'u'])] },
      { label: 'II', core: 'Ar', subshells: [sub('4s', ['']), sub('3d', ['ud', 'ud', 'ud', 'ud', ''])] },
      { label: 'III', core: 'Ar', subshells: [sub('4s', ['u']), sub('3d', ['ud', 'ud', 'u', 'u', 'u'])] },
      { label: 'IV', core: 'Ar', subshells: [sub('4s', ['']), sub('3d', ['ud', 'ud', 'ud', 'u', 'u'])] },
    ]),
    alt: 'Four orbital diagrams numbered I to IV, each after an argon core with one 4s box and five 3d boxes, and eight arrows in all. They differ in how many arrows are in the 4s box and in how the 3d arrows are paired.',
    q: 'Nickel has atomic number 28. Which of the four orbital diagrams shown is the ground state of the Ni²⁺ ion?',
    o: [['Diagram IV', 'correct'], ['Diagram I', 'removes two 3d electrons and keeps 4s full'], ['Diagram II', 'empties 4s but pairs all the 3d electrons, leaving a 3d orbital empty (Hund\'s rule)'], ['Diagram III', 'removes one 4s electron and one 3d electron']],
    holds: ['each diagram tested on the spec\'s boxes: 26 electrons, 4s empty, 3d⁸, and no pair beside an empty box / no two arrows alike in a box', (() => {
      const ok = (label: string) => (c: Ctx): boolean => {
        const d = arr(c.p.diagrams).find((x) => x.label === label) as P;
        const [s4, d3] = ['4s', '3d'].map((n) => (arr(d.subshells).find((x) => x.name === n) as P).boxes as string[]);
        const count = (b: string[]) => b.reduce((t, x) => t + x.length, 0);
        return c.num('orbital_count', { want: 'electrons', diagram: label }) === 28 - 2 && count(s4) === 0 && count(d3) === 8 && !(d3.includes('ud') && d3.includes('')) && !d3.some((x) => x === 'uu' || x === 'dd') && new Set(d3.filter((x) => x.length === 1)).size <= 1;
      };
      return [ok('IV'), ok('I'), ok('II'), ok('III')];
    })()],
    h: ['A nickel atom is [Ar] 4s² 3d⁸. Decide which two electrons leave when it forms a 2+ ion: for a transition metal the 4s electrons go first.', 'Then check how the remaining 3d electrons are arranged: electrons pair up only when every 3d orbital already holds one.'],
    s: 'Read from the figure: every diagram has an [Ar] core and 8 more electrons, 26 in all, as Ni²⁺ needs. Ni is [Ar] 4s² 3d⁸ and loses its two 4s electrons, so Ni²⁺ is [Ar] 3d⁸ with 4s empty — that rules out diagrams I (4s still full) and III (one 4s electron left). Diagram II has 3d⁸ but with four pairs and an empty orbital, which breaks Hund\'s rule. Diagram IV has three pairs and two unpaired electrons: the ground state.',
  },
]);
}

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — circular motion and orbits, projectiles, collisions, energy bars
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — circular motion and orbits, projectiles, collisions, energy bars
// ════════════════════════════════════════════════════════════════════════════

const mech = (variant: string, params: P): Spec => S('mechanics_setup', { variant, ...params });
const pn = (c: Ctx, k: string): number => c.p[k] as number;
/** Circular motion, top view: the object's position angle is measured counter-clockwise from the right of the page. */
const compass = (x: number, y: number): string => {
  const h = x > 0.3 ? 'right' : x < -0.3 ? 'left' : '';
  const v = y > 0.3 ? 'top' : y < -0.3 ? 'bottom' : '';
  return h && v ? `${v === 'top' ? 'upper' : 'lower'} ${h}` : h || v;
};
/** Where the object is after `turn` degrees more of its motion, and the directions of its velocity and of the pull toward the centre there. */
const circ = (c: Ctx, turn = 0): { toCentre: string; velocity: string; outward: string } => {
  const sense = (c.p.direction ?? 'counterclockwise') === 'clockwise' ? -1 : 1;
  const a = rad(((c.p.position as number | undefined) ?? 40) + sense * turn);
  return { toCentre: compass(-Math.cos(a), -Math.sin(a)), outward: compass(Math.cos(a), Math.sin(a)), velocity: compass(-sense * Math.sin(a), sense * Math.cos(a)) };
};
/** Grouped energy bars. */
const bars = (categories: string[], series: Array<[string, Array<number | null>]>, extra: P = {}): Spec => S('bar_chart', { categories, series: series.map(([label, values]) => ({ label, values })), yLabel: 'Energy (J)', ...extra });
const bar = (c: Ctx, category: string, series: string): number => c.num('bar_value', { category, series });
/** A bar of a series that has a bar left out (the checkers refuse to read such a series): the drawn value, from the spec. */
const barRaw = (c: Ctx, category: string, series: string): number => { const v = (arr(c.p.series).find((g) => g.label === series)!.values as Array<number | null>)[(c.p.categories as string[]).indexOf(category)]; if (v === null || v === undefined) throw new Error(`the ${series} bar of ${category} is left out`); return v; };

// ── Circular Orbit Problems (topup5 pack 062) ───────────────────────────────

G('1b6f7e6b.lo-1', 'Gravity as the centripetal force on a satellite', [
  {
    t: 'size and direction of the gravitational force from the orbit drawn', d: 3, need: 'calc',
    spec: mech('circular', { radius: 16000, speed: 5, mass: 400, lengthUnit: 'km', speedUnit: 'km/s', center: 'Earth', position: 210, arrows: ['velocity'] }),
    alt: 'The satellite is drawn at the lower left of its circular orbit, with its velocity arrow along the orbit; no force arrow is drawn.',
    q: 'The figure shows a satellite in a circular orbit round Earth, seen from above the orbit, with its engines off; r is measured from the centre of Earth. Which gives the size and the direction on the page of the gravitational force on the satellite at the instant shown?',
    o: [
      ['625 N, toward the upper right', 'correct'],
      ['625 N, toward the lower left', 'takes the force in circular motion to point outward, away from Earth'],
      ['625 N, along the velocity arrow', 'takes the force to point the way the satellite is moving'],
      ['0 N: no force acts on it', 'takes a steady speed to mean that no net force acts'],
    ],
    holds: ['gravity is the centripetal force m·v²/r (circular_value, with km and km/s converted to m and m/s) and points from the satellite toward the centre (from the position in the spec)', [
      (c) => near(pn(c, 'mass') * (pn(c, 'speed') * 1000) ** 2 / (pn(c, 'radius') * 1000), 625) && near(c.num('circular_value', { want: 'force', speed: pn(c, 'speed') * 1000, radius: pn(c, 'radius') * 1000 }), 625) && circ(c).toCentre === 'upper right',
      (c) => circ(c).toCentre === 'lower left',
      () => false, // the velocity is along the tangent, the force along the radius: never the same line
      (c) => near(pn(c, 'mass') * (pn(c, 'speed') * 1000) ** 2 / (pn(c, 'radius') * 1000), 0),
    ]],
    h: ['The only force on the satellite is Earth\'s gravity, so gravity IS the centripetal force: its size is m·v²/r. Change km to m and km/s to m/s first.', 'A centripetal force points from the object toward the centre of its circle — here, from the satellite toward Earth.'],
    s: 'Read from the figure: m = 400 kg, v = 5 km/s = 5000 m/s and r = 16 000 km = 1.6 × 10⁷ m. Gravity is the only force, so it is the centripetal force: F = m·v²/r = 400 × (5000)² / (1.6 × 10⁷) = 625 N. It points from the satellite toward Earth at the centre; the satellite is drawn at the lower left of the orbit, so the force points toward the upper right.',
  },
]);

G('1b6f7e6b.lo-2', 'Field strength at the orbit from the force balance', [
  {
    t: 'gravitational field strength at the orbit from v and r', d: 2, need: 'calc',
    spec: mech('circular', { radius: 12000, speed: 6, lengthUnit: 'km', speedUnit: 'km/s', center: 'Planet', position: 60, arrows: ['velocity'] }),
    alt: 'A satellite on a circular orbit round a planet, drawn at the upper right of the orbit with its velocity arrow; its mass is not given.',
    q: 'The figure shows a satellite in a circular orbit round a planet (r is measured from the planet\'s centre); the planet\'s gravity is the only force on the satellite. What is the planet\'s gravitational field strength at the satellite\'s orbit, in N/kg?',
    n: '3',
    calc: ['m·g = m·v²/r, so g = v²/r: circular_value (acceleration) with the printed km and km/s converted to m and m/s', (c) => c.num('circular_value', { want: 'acceleration', speed: pn(c, 'speed') * 1000, radius: pn(c, 'radius') * 1000 })],
    h: ['Set the gravitational force m·g (g is the field strength at the orbit) equal to the centripetal force m·v²/r; the satellite\'s mass cancels.', 'Convert the radius to metres and the speed to m/s before you work out v²/r.'],
    s: 'Read from the figure: v = 6 km/s = 6000 m/s and r = 12 000 km = 1.2 × 10⁷ m. Gravity provides the centripetal force: m·g = m·v²/r, so g = v²/r = (6000)² / (1.2 × 10⁷) = 3.6 × 10⁷ / 1.2 × 10⁷ = 3 N/kg.',
  },
]);

G('1b6f7e6b.lo-3', 'Orbital speed at a different radius', [
  {
    t: 'speed of a second satellite at four times the radius', d: 3, need: 'calc',
    spec: mech('circular', { radius: 10000, speed: 6, lengthUnit: 'km', speedUnit: 'km/s', center: 'Planet', position: 130, arrows: ['velocity'] }),
    alt: 'One satellite on a circular orbit round a planet, drawn at the upper left of the orbit with its velocity arrow. The second satellite of the question is not drawn.',
    q: 'The figure shows a satellite in a circular orbit round a planet; r is measured from the planet\'s centre. A second satellite moves round the same planet in a circular orbit of radius 40 000 km. What is the speed of the second satellite, in km/s?',
    n: '3',
    calc: ['v = √(GM/r), so v₂ = v₁·√(r₁/r₂), with r₁ and v₁ from the spec and r₂ = 40 000 km from the stem', (c) => round(pn(c, 'speed') * Math.sqrt(pn(c, 'radius') / 40000), 9)],
    h: ['From GMm/r² = mv²/r the orbital speed is v = √(GM/r): for one planet, v is proportional to 1/√r.', 'Compare the two radii: by what factor is the second orbit larger than the one drawn? The speed changes by the square root of that factor.'],
    s: 'Read from the figure: the first satellite has r = 10 000 km and v = 6 km/s. For orbits round one planet v = √(GM/r), so v is proportional to 1/√r. The second orbit is 40 000 / 10 000 = 4 times as large, so the speed is √4 = 2 times smaller: 6 / 2 = 3 km/s.',
  },
]);

G('1b6f7e6b.lo-4', 'Orbital period from the orbit drawn', [
  {
    t: 'complete orbits in a day from r and v', d: 3, need: 'calc',
    spec: mech('circular', { radius: 9000, speed: 3, lengthUnit: 'km', speedUnit: 'km/s', center: 'Planet', position: 300, direction: 'clockwise', arrows: ['velocity'] }),
    alt: 'A probe on a circular orbit round a planet, drawn at the lower right of the orbit with its velocity arrow pointing clockwise round the orbit.',
    q: 'The figure shows a probe in a circular orbit round a planet; r is measured from the planet\'s centre. How many COMPLETE orbits does the probe make in 24 hours (86 400 s)?',
    n: '4',
    calc: ['the whole number of periods T = 2πr/v (circular_value: km ÷ km/s = s) in 86 400 s', (c) => Math.floor(86400 / c.num('circular_value', { want: 'period' }))],
    h: ['The period is the time for one trip round the orbit: the circumference 2πr divided by the speed. With r in km and v in km/s the answer is in seconds.', 'Divide 86 400 s by the period and keep only the whole orbits.'],
    s: 'Read from the figure: r = 9000 km and v = 3 km/s. One orbit takes T = 2πr/v = 2π × 9000 / 3 ≈ 18 850 s (about 5.2 hours). In 86 400 s the probe makes 86 400 / 18 850 ≈ 4.6 orbits, so 4 complete orbits.',
  },
]);

G('1b6f7e6b.lo-5', 'Checking statements about one orbit', [
  {
    t: 'find the false statement about a satellite from m, v and r', d: 3, need: 'calc',
    spec: mech('circular', { radius: 8000, speed: 4, mass: 500, lengthUnit: 'km', speedUnit: 'km/s', center: 'Planet', position: 150, arrows: ['velocity'] }),
    alt: 'A satellite on a circular orbit round a planet, drawn at the upper left of the orbit with its velocity arrow; its mass is printed beside it.',
    q: 'The figure shows a satellite in a circular orbit round a planet (r is measured from the planet\'s centre); gravity is the only force on it. Which statement about the satellite is FALSE?',
    o: [
      ['Its centripetal acceleration is 0.5 m/s²', 'correct'],
      ['The gravitational force on it is 1000 N', 'does not work out m·v²/r in metres and m/s'],
      ['It takes about 3.5 hours to go round once', 'does not work out 2πr/v and change seconds to hours'],
      ['The field strength at its orbit is 2 N/kg', 'does not see that the field strength equals v²/r'],
    ],
    holds: ['each statement tested with circular_value on the printed values (km and km/s converted); the option answers the question when its statement is false', [
      (c) => !near(c.num('circular_value', { want: 'acceleration', speed: pn(c, 'speed') * 1000, radius: pn(c, 'radius') * 1000 }), 0.5),
      (c) => !near(c.num('circular_value', { want: 'force', speed: pn(c, 'speed') * 1000, radius: pn(c, 'radius') * 1000 }), 1000),
      (c) => !(Math.abs(c.num('circular_value', { want: 'period' }) / 3600 - 3.5) < 0.05),
      (c) => !near(c.num('circular_value', { want: 'acceleration', speed: pn(c, 'speed') * 1000, radius: pn(c, 'radius') * 1000 }), 2),
    ]],
    h: ['Work in metres and m/s: the acceleration is v²/r, and because gravity is the only force this is also the field strength at the orbit.', 'The force is m·v²/r and the time for one orbit is 2πr/v. Test each statement in turn.'],
    s: 'Read from the figure: m = 500 kg, v = 4 km/s = 4000 m/s and r = 8000 km = 8 × 10⁶ m. The centripetal acceleration is v²/r = (4000)² / (8 × 10⁶) = 2 m/s², which is also the field strength, 2 N/kg; the force is 500 × 2 = 1000 N; one orbit takes 2πr/v = 2π × 8000 / 4 ≈ 12 600 s ≈ 3.5 hours. So the statement that the acceleration is 0.5 m/s² (which is v/r with the units ignored) is the false one.',
  },
]);

// ── Centripetal Acceleration and Force (topup5 pack 065) ────────────────────

G('4b275527.lo-1', 'Directions of velocity and acceleration round the circle', [
  {
    t: 'velocity and acceleration a quarter of a revolution later', d: 3, need: 'reason',
    spec: mech('circular', { position: 0, direction: 'counterclockwise', arrows: ['velocity'] }),
    alt: 'A puck on a circle whose centre is marked with a dot. The puck is drawn at the right-hand side of the circle and its velocity arrow points along the circle toward the top of the page.',
    q: 'The figure is a top view of a puck moving at a steady speed in a circle; the arrow shows its velocity at one instant. A quarter of a revolution later, which are the directions on the page of its velocity and of its acceleration?',
    o: [
      ['Velocity to the left; acceleration to the bottom', 'correct'],
      ['Velocity to the left; acceleration to the top', 'takes the acceleration to point outward, away from the centre'],
      ['Velocity to the right; acceleration to the bottom', 'turns the velocity the wrong way round the circle'],
      ['Velocity to the top; acceleration to the left', 'keeps the directions of the instant shown'],
    ],
    holds: ['position, velocity (tangent, in the sense of motion) and acceleration (toward the centre) 90° further round, from the position and direction in the spec', [
      (c) => circ(c, 90).velocity === 'left' && circ(c, 90).toCentre === 'bottom',
      (c) => circ(c, 90).velocity === 'left' && circ(c, 90).toCentre === 'top',
      (c) => circ(c, 90).velocity === 'right' && circ(c, 90).toCentre === 'bottom',
      (c) => circ(c, 90).velocity === 'top' && circ(c, 90).toCentre === 'left',
    ]],
    h: ['Use the arrow to decide which way round the puck is going, then find where it is a quarter of a revolution later.', 'At every point the velocity is along the tangent, in the direction of travel, and the acceleration points from the puck toward the centre.'],
    s: 'Read from the figure: the puck is at the right-hand side of the circle and its velocity points toward the top of the page, so it is going round counter-clockwise. A quarter of a revolution later it is at the top of the circle. There its velocity is along the tangent in the direction of travel — to the left — and its acceleration points from the puck toward the centre — to the bottom of the page.',
  },
]);

G('4b275527.lo-2', 'Centripetal acceleration after a change of speed and radius', [
  {
    t: 'acceleration when the speed is doubled and the radius halved', d: 2, need: 'calc',
    spec: mech('circular', { radius: 2, speed: 3, position: 115, arrows: ['velocity'] }),
    alt: 'A puck on a circle whose centre is marked with a dot, with a line from the centre to the circle for the radius and a velocity arrow on the puck.',
    q: 'The figure is a top view of a puck on a string moving in a circle at a steady speed. The string is then shortened to half the radius shown, and the puck\'s speed becomes twice the speed shown. What is the puck\'s centripetal acceleration now, in m/s²?',
    n: '36',
    calc: ['(2v)² ÷ (r/2) with circular_value (acceleration), v and r from the figure', (c) => c.num('circular_value', { want: 'acceleration', speed: 2 * pn(c, 'speed'), radius: pn(c, 'radius') / 2 })],
    h: ['Centripetal acceleration is v²/r. Work out the new speed and the new radius before you use it.', 'Doubling the speed multiplies v² by 4; halving the radius doubles the acceleration again.'],
    s: 'Read from the figure: r = 2 m and v = 3 m/s. After the change the radius is 1 m and the speed 6 m/s, so the centripetal acceleration is v²/r = 6² / 1 = 36 m/s² (eight times the original 4.5 m/s²).',
  },
]);

G('4b275527.lo-3', 'Extra inward force for a higher speed', [
  {
    t: 'increase in the net inward force when the speed rises', d: 3, need: 'calc',
    spec: mech('circular', { radius: 0.5, speed: 3, mass: 0.4, position: 20, arrows: ['velocity'] }),
    alt: 'A puck on a circle whose centre is marked with a dot, with the radius line, a velocity arrow on the puck and the mass printed beside the puck.',
    q: 'The figure is a top view of a puck moving in a horizontal circle at a steady speed. By how many newtons must the net inward force on the puck increase for it to move round the same circle at a steady 5 m/s instead?',
    n: '12.8',
    calc: ['m·v²/r at 5 m/s minus m·v²/r at the printed speed (circular_value, force)', (c) => round(c.num('circular_value', { want: 'force', speed: 5 }) - c.num('circular_value', { want: 'force' }), 9)],
    h: ['The net inward force needed is m·v²/r. Work it out twice: at the speed shown and at 5 m/s.', 'The mass and the radius stay the same; only v² changes, from 9 to 25 (in m²/s²).'],
    s: 'Read from the figure: m = 0.4 kg, r = 0.5 m and v = 3 m/s. At 3 m/s the net inward force is m·v²/r = 0.4 × 9 / 0.5 = 7.2 N. At 5 m/s it is 0.4 × 25 / 0.5 = 20 N. The increase is 20 − 7.2 = 12.8 N.',
  },
]);

G('4b275527.lo-4', 'Friction needed on a flat bend', [
  {
    t: 'smallest coefficient of friction for a car on a flat circular track', d: 3, need: 'calc',
    spec: mech('circular', { radius: 50, speed: 14, mass: 1200, position: 250, direction: 'clockwise', arrows: ['velocity'] }),
    alt: 'A car, drawn as an object on a circular track whose centre is marked with a dot, with the radius line, a velocity arrow and the car\'s mass printed beside it.',
    q: 'The figure is a top view of a car driving at a steady speed round a flat, level circular track. Friction from the road is the only horizontal force on the car. Taking g = 9.8 m/s², what is the smallest coefficient of static friction between the tyres and the road that lets the car follow the track?',
    n: '0.4',
    calc: ['μ·m·g = m·v²/r, so μ = (v²/r) ÷ 9.8, with circular_value (acceleration)', (c) => round(c.num('circular_value', { want: 'acceleration' }) / 9.8, 9)],
    h: ['The friction must supply the whole centripetal force m·v²/r, and the most that static friction can supply is μ·m·g.', 'Set μ·m·g equal to m·v²/r. One of the quantities printed on the figure cancels out.'],
    s: 'Read from the figure: v = 14 m/s and r = 50 m (the mass, 1200 kg, cancels). Friction is the centripetal force, so at the limit μ·m·g = m·v²/r and μ = v²/(r·g) = 14² / (50 × 9.8) = 196 / 490 = 0.4.',
  },
]);

// ── Centripetal Force Sources (topup5 pack 068) ─────────────────────────────

G('c0ef80f3.lo-1', 'What the centripetal force does: the string snaps', [
  {
    t: 'path of a puck after the string snaps, from where it is on the circle', d: 3, need: 'reason',
    spec: mech('circular', { position: 180, direction: 'clockwise', arrows: ['force'], arrowLabels: { force: 'T' } }),
    alt: 'A puck on a circle whose centre is marked with a dot. The puck is drawn at the left-hand side of the circle, with an arrow from it toward the centre. No velocity arrow is drawn.',
    q: 'The figure is a top view of a puck moving CLOCKWISE at a steady speed on a frictionless table, held in a circle by a string; the arrow T is the pull of the string on the puck. The string snaps at the instant shown. In which direction on the page does the puck move just afterwards?',
    o: [
      ['Straight toward the top of the page', 'correct'],
      ['Straight toward the left of the page', 'takes the puck to be flung outward, directly away from the centre'],
      ['Straight toward the right of the page', 'takes the puck to follow the last pull of the string'],
      ['Straight toward the bottom of the page', 'takes the tangent in the counter-clockwise sense'],
    ],
    holds: ['with no force the puck keeps its velocity: the tangent at its position in the sense of motion (position and direction from the spec)', [
      (c) => circ(c).velocity === 'top',
      (c) => circ(c).velocity === 'left',
      (c) => circ(c).velocity === 'right',
      (c) => circ(c).velocity === 'bottom',
    ]],
    h: ['The pull of the string only changes the direction of the velocity. Once the string snaps there is no horizontal force on the puck at all.', 'With no force the puck keeps the velocity it had at that instant: along the tangent to the circle, in its clockwise direction of travel.'],
    s: 'Read from the figure: the puck is at the left-hand side of the circle and the string pulls it to the right, toward the centre. Its velocity is along the tangent there, which is the vertical direction on the page; going clockwise, a puck at the left-hand side is moving toward the top. When the string snaps no horizontal force acts, so the puck keeps that velocity and moves in a straight line toward the top of the page.',
  },
]);

SKIP('c0ef80f3.lo-2', 'naming which force (tension, friction, gravity, the normal force) is the centripetal force is decided by the described situation, not by anything read off a top-view circle — the figure would be decoration; the neighbouring objective (lo-3) carries a figure item on friction as the source');

G('c0ef80f3.lo-3', 'Static friction as the centripetal force', [
  {
    t: 'friction force on a coin that does not slip: size and direction', d: 3, need: 'calc',
    spec: mech('circular', { radius: 0.25, speed: 1, mass: 0.2, position: 320, arrows: ['velocity'] }),
    alt: 'A coin on a circle whose centre is marked with a dot, with the radius line, a velocity arrow on the coin and the mass printed beside the coin. No force arrow is drawn.',
    q: 'The figure is a top view of a coin riding on a horizontal turntable without slipping, at a steady speed. The coefficient of static friction between coin and turntable is 0.50 and g = 9.8 m/s². Which gives the friction force on the coin at the instant shown?',
    o: [
      ['0.80 N, toward the centre', 'correct'],
      ['0.98 N, toward the centre', 'uses the greatest possible static friction μ·m·g instead of the force that is needed'],
      ['0.80 N, opposite to the velocity', 'takes friction to oppose the motion round the circle'],
      ['0.98 N, opposite to the velocity', 'uses μ·m·g and takes friction to oppose the motion'],
    ],
    calc: ['friction is the only horizontal force, so it equals m·v²/r (circular_value, force) and points to the centre; checked to be under the limit μ·m·g = 0.98 N, so the coin does not slip', (c) => { const f = c.num('circular_value', { want: 'force' }); if (!(f < 0.5 * pn(c, 'mass') * 9.8)) throw new Error('the coin would slip'); if (!near(0.5 * pn(c, 'mass') * 9.8, 0.98)) throw new Error('the limit is not 0.98 N'); return `${f.toFixed(2)} N, toward the centre`; }],
    h: ['Friction is the only horizontal force on the coin, so it must be exactly the centripetal force the motion needs.', 'μ·m·g is only the LARGEST value static friction can take. Work out m·v²/r and compare it with that limit.'],
    s: 'Read from the figure: m = 0.2 kg, v = 1 m/s and r = 0.25 m. The coin moves in a circle at a steady speed, so the net force on it is m·v²/r = 0.2 × 1² / 0.25 = 0.80 N toward the centre, and friction is the only horizontal force that can supply it. The limit μ·m·g = 0.50 × 0.2 × 9.8 = 0.98 N is larger than this, so the coin does not slip and the friction is 0.80 N, toward the centre.',
  },
]);

G('c0ef80f3.lo-4', 'Speed from the tension after the string is shortened', [
  {
    t: 'speed at half the radius for the same tension', d: 3, need: 'calc',
    spec: mech('circular', { radius: 1, mass: 0.5, position: 75, arrows: ['force'], arrowLabels: { force: 'T' } }),
    alt: 'A puck on a circle whose centre is marked with a dot, with the radius line, an arrow from the puck toward the centre and the mass printed beside the puck. No speed is given.',
    q: 'The figure is a top view of a puck moving in a circle on a frictionless table, held by a string whose pull on the puck is T. The string is pulled in to HALF the radius shown, and the puck then circles steadily with T = 16 N. What is the puck\'s speed now, in m/s?',
    n: '4',
    calc: ['v = √(T·r/m) with T = 16 N from the stem, r = half the printed radius and the printed mass (circular_value, speed)', (c) => c.num('circular_value', { want: 'speed', force: 16, radius: pn(c, 'radius') / 2 })],
    h: ['The tension is the centripetal force: T = m·v²/r, so v² = T·r/m.', 'Use the NEW radius — half the one printed on the figure — not the one shown.'],
    s: 'Read from the figure: m = 0.5 kg and the radius shown is 1 m, so the new radius is 0.5 m. The tension is the centripetal force: T = m·v²/r, so v² = T·r/m = 16 × 0.5 / 0.5 = 16 and v = 4 m/s.',
  },
]);

G('c0ef80f3.lo-5', 'Radius of the tightest turn at a higher speed', [
  {
    t: 'tightest radius at twice the speed for a given greatest friction', d: 3, need: 'calc',
    spec: mech('circular', { speed: 15, mass: 1200, position: 200, arrows: ['velocity'] }),
    alt: 'A car, drawn as an object on a circular path whose centre is marked with a dot, with a velocity arrow and the mass printed beside it. No radius is given.',
    q: 'The figure is a top view of a car rounding a turn on a level road. The road can supply a friction force of at most 5400 N toward the centre of a turn. What is the radius, in metres, of the tightest circle the car could follow at TWICE the speed shown?',
    n: '200',
    calc: ['r = m·(2v)² ÷ F with F = 5400 N from the stem, m and v from the spec', (c) => pn(c, 'mass') * (2 * pn(c, 'speed')) ** 2 / 5400],
    h: ['The tightest circle is the one that needs the whole of the available friction: F = m·v²/r, so r = m·v²/F.', 'Double the speed printed on the figure before you square it.'],
    s: 'Read from the figure: m = 1200 kg and v = 15 m/s, so twice the speed is 30 m/s. The greatest friction is the centripetal force on the tightest circle: r = m·v²/F = 1200 × 30² / 5400 = 1 080 000 / 5400 = 200 m.',
  },
]);

// ── Horizontally Launched Projectiles (expand pack 207) ─────────────────────

G('16f36ea9.lo-1', 'Velocity components at two instants of the flight', [
  {
    t: 'horizontal and vertical velocity components at two timed points', d: 3, need: 'reason',
    spec: mech('projectile', { speed: 12, angle: 0, height: 45, g: 10, points: [{ at: 1, label: 'P' }, { at: 2, label: 'Q' }] }),
    alt: 'Two points are marked on the falling path: P, a little below the launch level, and Q, further out and lower down.',
    q: 'The figure shows a ball launched horizontally from the top of a cliff. It passes point P 1.0 s after launch and point Q 2.0 s after launch. Taking g = 10 m/s² and ignoring air resistance, which gives the horizontal and vertical components of its velocity at P and at Q?',
    o: [
      ['Horizontal 12 m/s at both; vertical 10 m/s at P, 20 m/s at Q', 'correct'],
      ['Horizontal 12 m/s at P, 24 m/s at Q; vertical 10 m/s at both', 'lets the horizontal component grow and keeps the vertical one steady'],
      ['Horizontal 22 m/s at P, 32 m/s at Q; vertical 10 m/s at P, 20 m/s at Q', 'adds the speed gained from gravity to the horizontal component as well'],
      ['Horizontal 12 m/s at both; vertical 12 m/s at P, 24 m/s at Q', 'takes the vertical component to grow by the launch speed each second'],
    ],
    calc: ['horizontal: the launch speed at both points (projectile_value vx); vertical: g·t at the times of P and Q in the spec', (c) => { const vx = c.num('projectile_value', { want: 'vx' }); const [p, q] = arr(c.p.points).map((k) => pn(c, 'g') * (k.at as number)); return `Horizontal ${vx} m/s at both; vertical ${p} m/s at P, ${q} m/s at Q`; }],
    h: ['Treat the two directions separately: no force acts horizontally, and gravity acts only vertically.', 'The ball starts with no vertical velocity and gains 10 m/s of downward velocity every second; its horizontal velocity is the launch velocity printed on the figure.'],
    s: 'Read from the figure: the ball is launched horizontally at 12 m/s. Nothing acts horizontally, so the horizontal component stays 12 m/s at both points. Vertically the ball starts from rest and gains g·t: 10 × 1.0 = 10 m/s at P and 10 × 2.0 = 20 m/s at Q.',
  },
]);

G('16f36ea9.lo-2', 'Fall times from the launch height', [
  {
    t: 'time spent below a given height before landing', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 15, angle: 0, height: 45, g: 10 }),
    alt: 'The ball leaves the cliff top horizontally and its path curves down to the ground; only the launch speed and the height of the cliff are given.',
    q: 'The figure shows a ball launched horizontally from the top of a cliff. Taking g = 10 m/s² and ignoring air resistance, for how many seconds is the ball less than 25 m above the ground before it lands?',
    n: '1',
    calc: ['time of flight √(2h/g) (projectile_value) minus the time √(2(h − 25)/g) to fall to 25 m above the ground, h and g from the spec', (c) => round(c.num('projectile_value', { want: 'time_of_flight' }) - Math.sqrt((2 * (pn(c, 'height') - 25)) / pn(c, 'g')), 9)],
    h: ['The vertical motion starts from rest, so the time to fall a distance d is √(2d/g). The launch speed does not matter.', 'Find the time to fall all the way to the ground and the time to fall only as far as the 25 m level; the answer is the difference.'],
    s: 'Read from the figure: the cliff is 45 m high (the launch speed, 15 m/s, is not needed). The whole fall takes t = √(2 × 45 / 10) = 3 s. The ball is 25 m above the ground after falling 45 − 25 = 20 m, which takes √(2 × 20 / 10) = 2 s. So it is below 25 m for 3 − 2 = 1 s.',
  },
]);

G('16f36ea9.lo-3', 'Range at a different launch speed', [
  {
    t: 'how much farther the ball lands at a higher launch speed', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 12, angle: 0, height: 20, g: 10 }),
    alt: 'The ball leaves the cliff top horizontally and lands on the level ground below; only the launch speed and the height of the cliff are given.',
    q: 'The figure shows a ball launched horizontally from the top of a cliff; it lands on the level ground below. If the ball were launched horizontally from the same point at 20 m/s instead, how many metres FARTHER from the foot of the cliff would it land? Take g = 10 m/s² and ignore air resistance.',
    n: '16',
    calc: ['range at 20 m/s minus range at the printed speed (projectile_value, range)', (c) => round(c.num('projectile_value', { want: 'range', speed: 20 }) - c.num('projectile_value', { want: 'range' }), 9)],
    h: ['The time of flight depends only on the height of the cliff, so it is the same for both launch speeds.', 'In that time the ball travels horizontally at its launch speed: range = launch speed × time of flight. Compare the two ranges.'],
    s: 'Read from the figure: the cliff is 20 m high and the launch speed is 12 m/s. The time of flight is t = √(2 × 20 / 10) = 2 s for any horizontal launch from this height. At 12 m/s the range is 12 × 2 = 24 m; at 20 m/s it is 20 × 2 = 40 m. The ball would land 40 − 24 = 16 m farther out.',
  },
]);

G('16f36ea9.lo-4', 'Impact speed from the height and the range', [
  {
    t: 'impact speed when the launch speed must first be found from the range', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 20, angle: 0, height: 45, g: 10, show: { speed: 'none', range: 'value' } }),
    alt: 'The ball leaves the cliff top horizontally and lands on the ground below; the height of the cliff and the distance from the foot of the cliff to the landing point are given. The launch speed is not given.',
    q: 'The figure shows a ball launched horizontally from the top of a cliff, with the height of the cliff and the distance at which the ball lands. Taking g = 10 m/s² and ignoring air resistance, with what speed does the ball hit the ground? Give your answer in m/s to one decimal place.',
    n: '36.1',
    calc: ['t = √(2h/g); launch speed = printed range ÷ t (checked against the spec); impact speed = √(vₓ² + (g·t)²) (projectile_value, impact_speed)', (c) => { const t = Math.sqrt((2 * pn(c, 'height')) / pn(c, 'g')); if (!near(pn(c, 'speed') * t, 60)) throw new Error('the printed range is not 60 m'); return c.num('projectile_value', { want: 'impact_speed', speed: 60 / t }); }],
    h: ['Find the time of flight from the height, then the horizontal velocity from the landing distance and that time.', 'At the ground the vertical component is g·t. Combine the two components with Pythagoras.'],
    s: 'Read from the figure: the cliff is 45 m high and the ball lands 60 m from its foot. Time of flight: t = √(2 × 45 / 10) = 3 s. Horizontal velocity: 60 / 3 = 20 m/s, unchanged during the flight. Vertical velocity at the ground: g·t = 10 × 3 = 30 m/s. Impact speed: √(20² + 30²) = √1300 ≈ 36.1 m/s.',
  },
]);

// ── Projectiles Launched at an Angle (expand pack 258) ──────────────────────

G('ef336649.lo-1', 'Components of the launch velocity from the speed at the top', [
  {
    t: 'vertical launch component from the speed at the highest point', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 30, angle: 60, g: 10, points: [{ at: 'apex', label: 'P' }], show: { speed: 'none' } }),
    alt: 'The point P is marked at the highest point of the path; the launch angle is given and the launch speed is not.',
    q: 'The figure shows a ball launched from level ground at the angle shown. At P, the highest point of its path, the ball\'s speed is 15 m/s. Ignoring air resistance, what was the VERTICAL component of the ball\'s launch velocity? Give your answer in m/s to one decimal place.',
    n: '26.0',
    calc: ['at the top the speed is the horizontal component v₀·cos θ = 15 m/s (checked against the spec), so v₀ = 15 ÷ cos θ and the vertical component is v₀·sin θ (projectile_value, vy_launch)', (c) => { if (!near(c.num('projectile_value', { want: 'vx', speed: pn(c, 'speed') }), 15, 1e-6)) throw new Error('the speed at the top is not 15 m/s'); return c.num('projectile_value', { want: 'vy_launch', speed: 15 / Math.cos(rad(pn(c, 'angle'))) }); }],
    h: ['At the highest point the ball is moving horizontally, so its speed there is the horizontal component of the launch velocity, which never changes.', 'Use v₀·cos θ = 15 m/s with the angle on the figure to find the launch speed, then take v₀·sin θ.'],
    s: 'Read from the figure: the launch angle is 60°. At the highest point the vertical velocity is zero, so the 15 m/s there is the horizontal component: v₀·cos 60° = 15, giving v₀ = 30 m/s. The vertical component at launch is v₀·sin 60° = 30 × 0.866 ≈ 26.0 m/s.',
  },
]);

G('ef336649.lo-2', 'Height at a given vertical velocity', [
  {
    t: 'height of the ball when it is falling at a given vertical speed', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 40, angle: 30, g: 10 }),
    alt: 'The ball is launched from level ground, rises to a highest point and falls back to the ground; only the launch speed and the launch angle are given.',
    q: 'The figure shows a ball launched from level ground. Taking g = 10 m/s² and ignoring air resistance, how high above the ground, in metres, is the ball at the instant when it is FALLING with a vertical velocity of 10 m/s downward?',
    n: '15',
    calc: ['vertical launch velocity v₀·sin θ (projectile_value, vy_launch); t = (vᵧ₀ + 10) ÷ g; height = vᵧ₀·t − ½g·t²', (c) => { const vy = c.num('projectile_value', { want: 'vy_launch' }); const g = pn(c, 'g'); const t = (vy + 10) / g; return round(vy * t - 0.5 * g * t * t, 6); }],
    h: ['Only the vertical motion matters. First find the vertical component of the launch velocity from the speed and the angle on the figure.', 'Use vᵧ = vᵧ₀ − g·t with vᵧ = −10 m/s to find the time, then y = vᵧ₀·t − ½g·t² (or use vᵧ² = vᵧ₀² − 2g·y directly).'],
    s: 'Read from the figure: v₀ = 40 m/s at 30°, so the vertical component at launch is 40 × sin 30° = 20 m/s. Falling at 10 m/s means vᵧ = −10 m/s: −10 = 20 − 10t, so t = 3 s. The height then is y = 20 × 3 − ½ × 10 × 3² = 60 − 45 = 15 m.',
  },
]);

G('ef336649.lo-3', 'Greatest height above the ground for a launch from a cliff', [
  {
    t: 'greatest height above the ground when the launch point is raised', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 30, angle: 30, height: 20, g: 10, show: { maxHeight: 'blank' } }),
    alt: 'The ball is launched upward at an angle from the top of a cliff, rises to a highest point and falls to the ground below the cliff; the height of the highest point above the ground is marked with a question mark.',
    q: 'The figure shows a ball launched at an angle from the top of a cliff. Taking g = 10 m/s² and ignoring air resistance, what is the greatest height of the ball above the GROUND, marked "?", in metres?',
    n: '31.25',
    ck: ['projectile_value', { want: 'max_height' }],
    h: ['Find the vertical component of the launch velocity, then the height the ball rises above its launch point: vᵧ₀² / (2g).', 'The height asked for is measured from the ground, not from the cliff top.'],
    s: 'Read from the figure: v₀ = 30 m/s at 30° and the cliff is 20 m high. The vertical component at launch is 30 × sin 30° = 15 m/s, so the ball rises 15² / (2 × 10) = 11.25 m above the launch point. Above the ground that is 20 + 11.25 = 31.25 m.',
  },
]);

G('ef336649.lo-4', 'Time of flight from the greatest height', [
  {
    t: 'total time in the air from the greatest height alone', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 60, angle: 30, g: 10, show: { speed: 'none', angle: 'none', maxHeight: 'value' } }),
    alt: 'The ball is launched from level ground, rises to a highest point and falls back to the ground; the height of the highest point is given. Neither the launch speed nor the launch angle is given.',
    q: 'The figure shows a ball launched from level ground; it lands at the height from which it was launched. Taking g = 10 m/s² and ignoring air resistance, for how many seconds is the ball in the air?',
    n: '6',
    calc: ['the fall from the greatest height H takes √(2H/g) and the rise takes as long: 2·√(2H/g), with H from the spec (projectile_value, max_height) — checked against the time of flight', (c) => { const a = { speed: pn(c, 'speed'), angle: pn(c, 'angle') }; const H = c.num('projectile_value', { want: 'max_height', ...a }); const t = 2 * Math.sqrt((2 * H) / pn(c, 'g')); if (!near(t, c.num('projectile_value', { want: 'time_of_flight', ...a }), 1e-6)) throw new Error('not the time of flight'); return round(t, 6); }],
    h: ['At the highest point the vertical velocity is zero, so the way down is a fall from rest through the height on the figure.', 'The way up takes exactly as long as the way down.'],
    s: 'Read from the figure: the highest point is 45 m above the ground. From there the ball falls from rest (vertically): 45 = ½ × 10 × t², so the fall takes t = 3 s. The rise takes the same time, so the ball is in the air for 2 × 3 = 6 s.',
  },
]);

G('ef336649.lo-5', 'Range from the launch angle and the greatest height', [
  {
    t: 'range from the angle and the greatest height, the speed unknown', d: 3, need: 'calc',
    spec: mech('projectile', { speed: 28.284271247461902, angle: 45, g: 10, show: { speed: 'none', maxHeight: 'value', range: 'blank' } }),
    alt: 'The ball is launched from level ground, rises to a highest point and falls back to the ground; the launch angle and the height of the highest point are given, and the distance along the ground to the landing point is marked with a question mark. The launch speed is not given.',
    q: 'The figure shows a ball launched from level ground at the angle shown; it reaches the greatest height shown and lands at the distance marked "?". Taking g = 10 m/s² and ignoring air resistance, what is that distance, in metres?',
    n: '80',
    calc: ['vᵧ₀ = √(2g·H) from the printed height (20 m, checked against the spec), vₓ = vᵧ₀ ÷ tan θ, time 2vᵧ₀/g, range vₓ·t — checked against projectile_value (range)', (c) => { const g = pn(c, 'g'); const a = { speed: pn(c, 'speed'), angle: pn(c, 'angle') }; if (!near(c.num('projectile_value', { want: 'max_height', ...a }), 20, 1e-6)) throw new Error('the printed height is not 20 m'); const vy = Math.sqrt(2 * g * 20); const R = (vy / Math.tan(rad(pn(c, 'angle')))) * ((2 * vy) / g); if (!near(R, c.num('projectile_value', { want: 'range', ...a }), 1e-6)) throw new Error('not the range'); return round(R, 6); }],
    h: ['The greatest height fixes the vertical component of the launch velocity: vᵧ₀² = 2g·H. The launch angle then gives the horizontal component.', 'The time in the air is 2vᵧ₀/g, and the range is the horizontal component times that time.'],
    s: 'Read from the figure: the launch angle is 45° and the greatest height is 20 m. Vertical component at launch: vᵧ₀ = √(2 × 10 × 20) = 20 m/s. At 45° the horizontal component is equal to it: vₓ = 20 m/s. Time in the air: 2 × 20 / 10 = 4 s. Range: 20 × 4 = 80 m.',
  },
]);

// ── Conservation of Momentum in Collisions (expand pack 205) ────────────────

G('11c1e6e1.lo-3', 'Momentum in a head-on collision', [
  {
    t: 'signed velocity after a head-on collision', d: 2, need: 'calc',
    spec: mech('collision', { masses: [2, 3], before: [4, -2], after: [-2, 2], labels: ['X', 'Y'], show: { v1: 'blank' } }),
    alt: 'Before the collision the two carts move toward each other; after it cart Y moves to the right and the velocity of cart X is a question mark with no arrow.',
    q: 'The figure shows two carts on a frictionless track before and after they collide. Taking velocities to the right as positive, what is the velocity of cart X after the collision, in m/s?',
    n: '-2',
    ck: ['collision_value', { want: 'final_velocity', cart: 0 }],
    h: ['Total momentum before equals total momentum after. A cart moving to the left has a negative velocity, so its momentum is negative.', 'Add up the two momenta before the collision, subtract the momentum of cart Y after it, and divide what is left by the mass of cart X.'],
    s: 'Read from the figure: X is 2 kg moving right at 4 m/s and Y is 3 kg moving left at 2 m/s before; afterwards Y moves right at 2 m/s. Momentum before: 2 × 4 + 3 × (−2) = 2 kg·m/s. After: 2v + 3 × 2 = 2, so 2v = −4 and v = −2 m/s: cart X moves to the left at 2 m/s.',
  },
]);

G('11c1e6e1.lo-4', 'An unknown velocity before the collision', [
  {
    t: 'velocity of a cart before the collision from the other three velocities', d: 3, need: 'calc',
    spec: mech('collision', { masses: [3, 2], before: [5, -3], after: [1, 3], labels: ['X', 'Y'], show: { u1: 'blank' } }),
    alt: 'Before the collision cart Y moves to the left and the velocity of cart X is a question mark with no arrow; after it both carts move to the right, with different speeds.',
    q: 'The figure shows two carts on a frictionless track before and after they collide. Taking velocities to the right as positive, what was the velocity of cart X BEFORE the collision, in m/s?',
    n: '5',
    calc: ['(m₁v₁ + m₂v₂ − m₂u₂) ÷ m₁ from the printed masses and velocities (signs from the arrows); checked against collision_value total_momentum after', (c) => { const [m1, m2] = c.p.masses as number[]; const [, u2] = c.p.before as number[]; const [v1, v2] = c.p.after as number[]; const u1 = (m1 * v1 + m2 * v2 - m2 * u2) / m1; if (!near(m1 * u1 + m2 * u2, c.num('collision_value', { want: 'total_momentum' }))) throw new Error('momentum'); return u1; }],
    h: ['Work out the total momentum after the collision, where both velocities are known; the total before must be the same.', 'Cart Y moves to the left before the collision, so its momentum then is negative. Subtracting a negative momentum adds.'],
    s: 'Read from the figure: after the collision X (3 kg) moves right at 1 m/s and Y (2 kg) moves right at 3 m/s, so the total momentum is 3 × 1 + 2 × 3 = 9 kg·m/s. Before, Y moves left at 3 m/s: 3u + 2 × (−3) = 9, so 3u = 15 and u = 5 m/s, to the right.',
  },
]);

// ── Elastic vs. Inelastic Collisions (expand pack 252) ──────────────────────

G('d0910434.lo-1', 'Elastic or inelastic, by the kinetic energy', [
  {
    t: 'which description of a drawn collision is right, with its energies', d: 3, need: 'calc',
    spec: mech('collision', { masses: [1, 2], before: [6, 0], after: [-2, 4], labels: ['X', 'Y'] }),
    alt: 'Before the collision cart X moves to the right toward cart Y, which is at rest; after it cart X moves to the left and cart Y moves to the right.',
    q: 'The figure shows two carts on a frictionless track before and after they collide. Which statement correctly describes the collision?',
    o: [
      ['Elastic: the total kinetic energy is 18 J before and 18 J after', 'correct'],
      ['Inelastic: the total kinetic energy falls from 18 J to 14 J', 'subtracts the kinetic energy of the cart that moves to the left'],
      ['Elastic: the total kinetic energy is 36 J before and 36 J after', 'leaves out the factor ½ in the kinetic energy'],
      ['Perfectly inelastic: the carts leave with the same velocity', 'takes any collision in which both carts move afterwards to be perfectly inelastic'],
    ],
    holds: ['total kinetic energy before and after and the kind of collision (collision_value: ke_before, ke_after, type) and the two final velocities in the spec', [
      (c) => c.txt('collision_value', { want: 'type' }) === 'elastic' && near(c.num('collision_value', { want: 'ke_before' }), 18) && near(c.num('collision_value', { want: 'ke_after' }), 18),
      (c) => c.txt('collision_value', { want: 'type' }) === 'inelastic' && near(c.num('collision_value', { want: 'ke_after' }), 14),
      (c) => c.txt('collision_value', { want: 'type' }) === 'elastic' && near(c.num('collision_value', { want: 'ke_before' }), 36),
      (c) => near((c.p.after as number[])[0], (c.p.after as number[])[1]),
    ]],
    h: ['A collision is elastic when the total kinetic energy is the same before and after, and inelastic when some of it is lost.', 'Work out ½mv² for each cart before and after. Kinetic energy is never negative, whichever way a cart moves.'],
    s: 'Read from the figure: X is 1 kg and Y is 2 kg; before, X moves at 6 m/s and Y is at rest; after, X moves left at 2 m/s and Y moves right at 4 m/s. Kinetic energy before: ½ × 1 × 6² = 18 J. After: ½ × 1 × 2² + ½ × 2 × 4² = 2 + 16 = 18 J. The total is unchanged, so the collision is elastic.',
  },
]);

G('d0910434.lo-2', 'Kinetic energy before and after a head-on collision', [
  {
    t: 'total kinetic energy lost, four terms', d: 3, need: 'calc',
    spec: mech('collision', { masses: [3, 2], before: [4, -1], after: [1, 3.5], labels: ['X', 'Y'] }),
    alt: 'Before the collision the two carts move toward each other; after it both carts move to the right, cart Y faster than cart X.',
    q: 'The figure shows two carts on a frictionless track before and after they collide. How much kinetic energy, in joules, do the two carts lose in total in the collision?',
    n: '11.25',
    ck: ['collision_value', { want: 'ke_lost' }],
    h: ['Work out ½mv² for each cart before the collision and add the two; do the same after the collision.', 'A cart moving to the left still has positive kinetic energy. The loss is the total before minus the total after.'],
    s: 'Read from the figure: before, X (3 kg) moves at 4 m/s and Y (2 kg) at 1 m/s; after, X moves at 1 m/s and Y at 3.5 m/s. Before: ½ × 3 × 4² + ½ × 2 × 1² = 24 + 1 = 25 J. After: ½ × 3 × 1² + ½ × 2 × 3.5² = 1.5 + 12.25 = 13.75 J. Lost: 25 − 13.75 = 11.25 J.',
  },
]);

G('d0910434.lo-3', 'Classifying a collision with one velocity missing', [
  {
    t: 'classify after finding the missing velocity from momentum', d: 3, need: 'calc',
    spec: mech('collision', { masses: [2, 2], before: [5, 1], after: [2, 4], labels: ['X', 'Y'], show: { v1: 'blank' } }),
    alt: 'Before the collision both carts move to the right, cart X faster than cart Y; after it cart Y moves to the right and the velocity of cart X is a question mark with no arrow.',
    q: 'The figure shows two carts on a frictionless track before and after they collide; one velocity is missing and can be found from the others. Which statement correctly describes the collision?',
    o: [
      ['Inelastic: kinetic energy falls from 26 J to 20 J', 'correct'],
      ['Elastic: kinetic energy is 26 J before and after', 'assumes that carts of equal mass always exchange velocities'],
      ['Perfectly inelastic: both carts leave at 4 m/s', 'gives cart X the velocity of cart Y without using momentum'],
      ['Inelastic: kinetic energy falls from 26 J to 16 J', 'leaves cart X out of the kinetic energy after the collision'],
    ],
    holds: ['the missing velocity from momentum (collision_value final_velocity), then the kinetic energies and the kind of collision with that velocity', [
      (c) => { const v1 = c.num('collision_value', { want: 'final_velocity', cart: 0 }); return c.txt('collision_value', { want: 'type', v1 }) === 'inelastic' && near(c.num('collision_value', { want: 'ke_before' }), 26) && near(c.num('collision_value', { want: 'ke_after', v1 }), 20); },
      (c) => c.txt('collision_value', { want: 'type', v1: c.num('collision_value', { want: 'final_velocity', cart: 0 }) }) === 'elastic',
      (c) => near(c.num('collision_value', { want: 'final_velocity', cart: 0 }), 4),
      (c) => near(c.num('collision_value', { want: 'ke_after', v1: c.num('collision_value', { want: 'final_velocity', cart: 0 }) }), 16),
    ]],
    h: ['First use conservation of momentum to find the velocity of cart X after the collision.', 'Then compare the total kinetic energy before with the total after: equal means elastic, less means inelastic.'],
    s: 'Read from the figure: both carts are 2 kg; before, X moves at 5 m/s and Y at 1 m/s, both to the right; after, Y moves at 4 m/s. Momentum: 2 × 5 + 2 × 1 = 12 = 2v + 2 × 4, so X leaves at v = 2 m/s. Kinetic energy before: 25 + 1 = 26 J; after: 4 + 16 = 20 J. Kinetic energy is lost and the carts separate, so the collision is inelastic (not perfectly inelastic).',
  },
]);

// ── Perfectly Inelastic Collision Problems (expand pack 256) ────────────────

G('e67a9c2b.lo-1', 'Recognising a perfectly inelastic collision from the velocities', [
  {
    t: 'missing velocity shows whether the carts move off together', d: 3, need: 'calc',
    spec: mech('collision', { masses: [4, 2], before: [3, 0], after: [2, 2], labels: ['X', 'Y'], show: { v2: 'blank' } }),
    alt: 'Before the collision cart X moves to the right toward cart Y, which is at rest; after it cart X moves to the right and the velocity of cart Y is a question mark with no arrow.',
    q: 'The figure shows two carts on a frictionless track before and after they collide (the carts are drawn apart in both panels so that each can be labelled). Which describes the velocity of cart Y after the collision, compared with the velocity of cart X after the collision, and the kind of collision this is?',
    o: [
      ['Equal to that of cart X; perfectly inelastic', 'correct'],
      ['Equal to that of cart X; elastic', 'does not see that carts leaving with one velocity have moved off together'],
      ['Three times that of cart X; elastic', 'gives cart Y all of the momentum, leaving out the momentum cart X keeps'],
      ['Half of that of cart X; inelastic only', 'divides the momentum that is left by the mass of cart X'],
    ],
    holds: ['cart Y\'s velocity from momentum (collision_value final_velocity); the carts leave with one common velocity — a perfectly inelastic collision — when it equals the printed velocity of cart X; kinetic energy compared for "elastic"', [
      (c) => { const v2 = c.num('collision_value', { want: 'final_velocity', cart: 1 }); return near(v2, (c.p.after as number[])[0]); },
      (c) => { const v2 = c.num('collision_value', { want: 'final_velocity', cart: 1 }); return near(v2, (c.p.after as number[])[0]) && c.txt('collision_value', { want: 'type', v2 }) === 'elastic'; },
      (c) => near(c.num('collision_value', { want: 'final_velocity', cart: 1 }), 3 * (c.p.after as number[])[0]),
      (c) => near(c.num('collision_value', { want: 'final_velocity', cart: 1 }), 0.5 * (c.p.after as number[])[0]),
    ]],
    h: ['Use conservation of momentum to find the velocity of cart Y after the collision.', 'Compare it with the velocity of cart X after the collision. What does it mean when two carts that have just collided leave with the same velocity?'],
    s: 'Read from the figure: X is 4 kg and Y is 2 kg; before, X moves right at 3 m/s and Y is at rest; after, X moves right at 2 m/s. Momentum: 4 × 3 = 4 × 2 + 2v, so v = 2 m/s to the right. Both carts leave at 2 m/s, so they move off together as one body: the collision is perfectly inelastic (kinetic energy falls from 18 J to 12 J).',
  },
]);

G('e67a9c2b.lo-2', 'Working back from the shared final velocity', [
  {
    t: 'velocity of one cart before, from the shared velocity after', d: 3, need: 'calc',
    spec: mech('collision', { masses: [2, 3], before: [6, -2], after: 1.2, show: { u2: 'blank' } }),
    alt: 'Before the collision cart A moves to the right and the velocity of cart B is a question mark with no arrow; after it the two carts are joined and move to the right together.',
    q: 'The figure shows two carts on a frictionless track; they collide and stick together. Taking velocities to the right as positive, what was the velocity of cart B BEFORE the collision, in m/s?',
    n: '-2',
    calc: ['((m₁ + m₂)·v − m₁u₁) ÷ m₂ from the printed masses, cart A\'s velocity and the shared velocity; checked against collision_value total_momentum after', (c) => { const [m1, m2] = c.p.masses as number[]; const [u1] = c.p.before as number[]; const v = c.p.after as number; const u2 = ((m1 + m2) * v - m1 * u1) / m2; if (!near((m1 + m2) * v, c.num('collision_value', { want: 'total_momentum', u2 }))) throw new Error('momentum'); return round(u2, 9); }],
    h: ['After the collision the joined carts are one body of mass m₁ + m₂: find its momentum from the shared velocity.', 'That total equals the momentum of cart A before plus the momentum of cart B before. A negative answer means cart B was moving to the left.'],
    s: 'Read from the figure: A is 2 kg moving right at 6 m/s; B is 3 kg; joined, they move right at 1.2 m/s. Momentum after: (2 + 3) × 1.2 = 6 kg·m/s. Before: 2 × 6 + 3u = 6, so 3u = −6 and u = −2 m/s: cart B was moving to the left at 2 m/s.',
  },
]);

G('e67a9c2b.lo-3', 'Energy lost when the carts stick', [
  {
    t: 'kinetic energy lost when the shared velocity must first be found', d: 3, need: 'calc',
    spec: mech('collision', { masses: [2, 4], before: [5, -1], after: 1, show: { v1: 'none' } }),
    alt: 'Before the collision the two carts move toward each other; after it the two carts are joined; their shared velocity is not shown.',
    q: 'The figure shows two carts on a frictionless track; they collide head-on and stick together. How much kinetic energy, in joules, is lost in the collision?',
    n: '24',
    calc: ['the shared velocity from momentum (collision_value final_velocity), then kinetic energy before minus after with that velocity (collision_value ke_lost)', (c) => c.num('collision_value', { want: 'ke_lost', v1: c.num('collision_value', { want: 'final_velocity' }) })],
    h: ['Find the shared final velocity first, from conservation of momentum. Cart B moves to the left before the collision, so its momentum is negative.', 'Then work out the total kinetic energy before (two carts) and after (one joined body) and subtract.'],
    s: 'Read from the figure: A is 2 kg moving right at 5 m/s and B is 4 kg moving left at 1 m/s. Momentum: 2 × 5 + 4 × (−1) = 6 = (2 + 4)v, so v = 1 m/s. Kinetic energy before: ½ × 2 × 5² + ½ × 4 × 1² = 25 + 2 = 27 J. After: ½ × 6 × 1² = 3 J. Lost: 27 − 3 = 24 J.',
  },
]);

// ── Work-Energy Theorem Fundamentals (topup5 pack 070) ──────────────────────

G('d33b439b.lo-3', 'Net work from the change in kinetic energy', [
  {
    t: 'signed net force from the kinetic energy bars and a distance', d: 3, need: 'calc',
    spec: bars(['Trolley 1', 'Trolley 2', 'Trolley 3'], [['At the start', [10, 30, 20]], ['At the end', [25, 10, 20]]], { yLabel: 'Kinetic energy (J)', yMin: 0, yMax: 35, yStep: 5 }),
    alt: 'For each of three trolleys there are two bars: its kinetic energy at the start and at the end of a run. Trolley 1 gains kinetic energy, trolley 2 loses kinetic energy and trolley 3 ends with what it started with.',
    q: 'Three trolleys each travel 4.0 m in a straight line along a level track while a constant net force acts on each. The chart shows each trolley\'s kinetic energy at the start and at the end of the 4.0 m. Taking the direction of motion as positive, what is the net force on trolley 2, in newtons?',
    n: '-5',
    calc: ['net work = kinetic energy at the end − at the start (bar_series_difference); net force = net work ÷ 4.0 m', (c) => c.num('bar_series_difference', { category: 'Trolley 2', a: 'At the end', b: 'At the start' }) / 4],
    h: ['The work-energy theorem: the net work done on a trolley equals its change in kinetic energy, final minus initial.', 'For a constant net force along the line of motion, net work = net force × distance. A loss of kinetic energy means the net force is against the motion.'],
    s: 'Read from the chart: trolley 2 has 30 J of kinetic energy at the start and 10 J at the end. Net work = ΔKE = 10 − 30 = −20 J. Net work = F × d, so F = −20 / 4.0 = −5 N: a net force of 5 N against the motion.',
  },
]);

G('d33b439b.lo-4', 'Final speed from the starting kinetic energy and the net work', [
  {
    t: 'final speed from two bars and the mass', d: 3, need: 'calc',
    spec: bars(['Run 1', 'Run 2', 'Run 3'], [['Kinetic energy at the start', [5, 10, 20]], ['Net work done on the cart', [20, 15, 10]]], { yMin: 0, yMax: 25, yStep: 5 }),
    alt: 'For each of three runs there are two bars: the cart\'s kinetic energy at the start of the run and the net work done on the cart during the run. From run 1 to run 3 the starting kinetic energy rises and the net work falls.',
    q: 'A 2.0 kg cart is pushed along a level track in three runs. For each run the chart shows the cart\'s kinetic energy at the start and the net work done on the cart during the run. What is the cart\'s speed at the END of run 2, in m/s?',
    n: '5',
    calc: ['final kinetic energy = starting kinetic energy + net work (two bar_value readings); v = √(2·KE ÷ 2.0 kg)', (c) => round(Math.sqrt((2 * (bar(c, 'Run 2', 'Kinetic energy at the start') + bar(c, 'Run 2', 'Net work done on the cart'))) / 2), 9)],
    h: ['Net work equals the change in kinetic energy, so the final kinetic energy is the starting kinetic energy plus the net work.', 'Then use KE = ½mv² with the mass given in the question to find the speed.'],
    s: 'Read from the chart: in run 2 the cart starts with 10 J of kinetic energy and the net work done on it is 15 J. Its final kinetic energy is 10 + 15 = 25 J. From ½ × 2.0 × v² = 25, v² = 25 and v = 5 m/s.',
  },
]);

// ── Kinetic and Gravitational Potential Energy (expand pack 255) ────────────

G('d72d98dd.lo-5', 'A missing kinetic energy bar for a falling ball', [
  {
    t: 'speed at a position whose kinetic energy bar is left out', d: 3, need: 'calc',
    spec: bars(['Position 1', 'Position 2', 'Position 3'], [['Kinetic energy', [10, null, 50]], ['Gravitational potential energy', [60, 30, 20]]], { yMin: 0, yMax: 70, yStep: 10 }),
    alt: 'For each of three positions of a falling ball there are two bars, its kinetic energy and its gravitational potential energy; the kinetic energy bar at position 2 is left out and a question mark stands in its place. The potential energy falls from position 1 to position 3.',
    q: 'A 0.80 kg ball falls with no air resistance. The chart shows its kinetic energy and its gravitational potential energy at three positions; the kinetic energy bar at position 2 has been left out. What is the ball\'s speed at position 2, in m/s?',
    n: '10',
    calc: ['total mechanical energy at position 1 (the drawn kinetic energy bar from the spec plus the potential energy bar, bar_value; position 3 checked to give the same total) minus the potential energy at position 2; v = √(2·KE ÷ 0.80 kg)', (c) => { const total = barRaw(c, 'Position 1', 'Kinetic energy') + bar(c, 'Position 1', 'Gravitational potential energy'); if (!near(total, barRaw(c, 'Position 3', 'Kinetic energy') + bar(c, 'Position 3', 'Gravitational potential energy'))) throw new Error('energy is not conserved on the chart'); return round(Math.sqrt((2 * (total - bar(c, 'Position 2', 'Gravitational potential energy'))) / 0.8), 9); }],
    h: ['With no air resistance the total of kinetic and potential energy is the same at every position. Find that total from a position where both bars are drawn.', 'Subtract the potential energy at position 2 to get the kinetic energy there, then use KE = ½mv².'],
    s: 'Read from the chart: at position 1 the kinetic energy is 10 J and the potential energy 60 J, a total of 70 J (position 3 agrees: 50 + 20). At position 2 the potential energy is 30 J, so the kinetic energy is 70 − 30 = 40 J. From ½ × 0.80 × v² = 40, v² = 100 and v = 10 m/s.',
  },
]);

// ── Energy Lost to Friction (expand pack 224) ───────────────────────────────

G('65dc5f92.lo-3', 'Friction force from the mechanical energy that is missing', [
  {
    t: 'average friction force from the energy bars at the top and the bottom of a ramp', d: 3, need: 'calc',
    spec: bars(['Top of ramp', 'Bottom of ramp'], [['Kinetic energy', [5, 30]], ['Gravitational potential energy', [40, 5]]], { yMin: 0, yMax: 45, yStep: 5 }),
    alt: 'There are two bars at the top of the ramp and two at the bottom: the block\'s kinetic energy and its gravitational potential energy. From top to bottom the kinetic energy rises and the potential energy falls.',
    q: 'A block slides 4.0 m down a rough ramp. The chart shows its kinetic energy and its gravitational potential energy at the top and at the bottom of the ramp. What is the size of the average friction force on the block, in newtons?',
    n: '2.5',
    calc: ['mechanical energy at the top minus at the bottom (four bar_value readings) ÷ 4.0 m', (c) => (bar(c, 'Top of ramp', 'Kinetic energy') + bar(c, 'Top of ramp', 'Gravitational potential energy') - bar(c, 'Bottom of ramp', 'Kinetic energy') - bar(c, 'Bottom of ramp', 'Gravitational potential energy')) / 4],
    h: ['Add the kinetic and potential energy at the top, and again at the bottom. The mechanical energy that has gone was turned into thermal energy by friction.', 'The energy removed by friction equals the friction force times the distance slid.'],
    s: 'Read from the chart: at the top the block has 5 J of kinetic and 40 J of potential energy, 45 J in all; at the bottom 30 J and 5 J, 35 J in all. Friction has removed 45 − 35 = 10 J of mechanical energy. Friction force × 4.0 m = 10 J, so the average friction force is 2.5 N.',
  },
]);
}

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — springs, pendulums, standing and transverse waves, pulleys, energy-level ladders
// ════════════════════════════════════════════════════════════════════════════
{
// ════════════════════════════════════════════════════════════════════════════
// PHYSICS — springs, pendulums, standing waves, pulleys, energy levels, travelling waves
// ════════════════════════════════════════════════════════════════════════════

const mech = (variant: string, params: P): Spec => S('mechanics_setup', { variant, ...params });
const wave = (variant: string, params: P): Spec => S('wave_diagram', { variant, ...params });
const ladder = (params: P): Spec => S('energy_levels', { variant: 'levels', ...params });
const pn = (c: Ctx, k: string): number => c.p[k] as number;
/** The energies of a ladder's levels, lowest first (the spec's own). */
const energiesOf = (c: Ctx): number[] => arr(c.p.levels).map((l) => l.energy as number).sort((a, b) => a - b);
/** Every gap between two levels of the ladder. */
const gapsOf = (c: Ctx, from?: number): number[] => { const e = energiesOf(c); const out: number[] = []; for (let i = 0; i < e.length; i++) for (let j = i + 1; j < e.length; j++) if (from === undefined || i === from - 1) out.push(round(e[j] - e[i], 6)); return out; };
const isWhole = (v: number): boolean => near(v, Math.round(v), 1e-9);

// ── Springs and Hooke's Law (pack 237) ──────────────────────────────────────

G('a52137eb.lo-1', 'Force proportional to displacement', [
  {
    t: 'scale a stated force to a new displacement, with k unknown', d: 2, need: 'calc',
    spec: mech('spring_mass', { x: 0.15, show: { k: 'blank' } }),
    alt: 'The spring is drawn stretched to the right of its equilibrium line, with the stretch marked on a dimension line; the spring constant is a question mark.',
    q: 'The spring shown obeys Hooke\'s law. When it is stretched by the amount marked in the figure, it pulls on the block with a force of 12 N. With what force, in newtons, does it pull on the block when it is stretched 0.25 m from equilibrium? Give the magnitude.',
    n: '20',
    calc: ['k = 12 N ÷ (the x printed on the figure), then spring_value force with that k at x = 0.25 m', (c) => c.num('spring_value', { want: 'force', k: 12 / pn(c, 'x'), x: 0.25 })],
    h: ['For a spring that obeys Hooke\'s law the force is proportional to the displacement from equilibrium: F = kx.', 'Use the 12 N and the stretch marked on the figure to find k (or simply the ratio of the two stretches), then apply it to 0.25 m.'],
    s: 'Read from the figure: the stretch is x = 0.15 m, and the spring constant is not given. From F = kx, k = 12 N ÷ 0.15 m = 80 N/m. At 0.25 m the force is 80 × 0.25 = 20 N. (Equivalently, the force grows in the ratio 0.25 / 0.15.)',
  },
]);

G('a52137eb.lo-2', 'Spring force on a block, and what it does', [
  {
    t: 'acceleration of a block released against a compressed spring', d: 2, need: 'calc',
    spec: mech('spring_mass', { k: 250, m: 0.5, x: -0.06 }),
    alt: 'The spring is drawn compressed, its end short of the equilibrium line; the spring constant is printed beside the spring, the mass inside the block and the compression on a dimension line.',
    q: 'The block shown rests on a frictionless surface and is held against the compressed spring, then released from rest. What is the magnitude of the block\'s acceleration, in m/s², at the instant it is released?',
    n: '30',
    calc: ['spring_value force (k·|x| printed) ÷ the mass printed in the block', (c) => c.num('spring_value', { want: 'force' }) / pn(c, 'm')],
    h: ['At the instant of release the only horizontal force on the block is the spring force, of magnitude k times the compression.', 'Once you have the spring force, Newton\'s second law gives the acceleration: divide by the mass of the block.'],
    s: 'Read from the figure: k = 250 N/m, the compression is 0.06 m and the block\'s mass is 0.5 kg. The spring force is F = kx = 250 × 0.06 = 15 N, pushing the block away from the wall. With no friction this is the net force, so a = F / m = 15 / 0.5 = 30 m/s².',
  },
]);

G('a52137eb.lo-3', 'Elastic potential energy between two stretches', [
  {
    t: 'extra work to stretch a spring further', d: 3, need: 'calc',
    spec: mech('spring_mass', { k: 400, x: 0.05 }),
    alt: 'The spring is drawn stretched past its equilibrium line; the spring constant is printed beside the spring and the stretch on a dimension line. The block is labelled but its mass is not given.',
    q: 'The spring shown is already stretched by the amount marked in the figure. How much additional work, in joules, must be done on the spring to stretch it further, to a total of 0.10 m from equilibrium?',
    n: '1.5',
    calc: ['spring_value elastic_pe at x = 0.10 m minus elastic_pe at the x printed', (c) => c.num('spring_value', { want: 'elastic_pe', x: 0.1 }) - c.num('spring_value', { want: 'elastic_pe' })],
    h: ['The work done on the spring equals the change in its elastic potential energy, and that energy is ½kx².', 'Work out the stored energy at the stretch shown and at 0.10 m, then subtract. The energy is not proportional to x.'],
    s: 'Read from the figure: k = 400 N/m and the present stretch is 0.05 m. Stored energy now: ½ × 400 × 0.05² = 0.5 J. At 0.10 m: ½ × 400 × 0.10² = 2.0 J. The additional work is 2.0 − 0.5 = 1.5 J — three times the energy already stored, because the energy depends on x².',
  },
]);

// ── Periods of Springs and Pendulums (top-up pack 060; the lesson takes g = 10 m/s²) ──

G('0da1d0f6.lo-2', 'Period of a mass on a spring', [
  {
    t: 'time from release to the first pass through equilibrium', d: 3, need: 'calc',
    spec: mech('spring_mass', { k: 50, m: 2, x: 0.1 }),
    alt: 'The spring is drawn stretched past its equilibrium line; the spring constant is printed beside the spring, the mass inside the block and the stretch on a dimension line.',
    q: 'The block shown is on a frictionless surface. It is released from rest at the position drawn. How long after release does the block first pass through the equilibrium position? Give your answer in seconds, to two decimal places.',
    n: '0.31',
    calc: ['a quarter of spring_value period (from the k and m printed)', (c) => c.num('spring_value', { want: 'period' }) / 4],
    h: ['Find the period from T = 2π√(m/k). The distance the block is pulled back does not appear in this formula.', 'From the release point (an extreme position) to the equilibrium position is one quarter of a full oscillation.'],
    s: 'Read from the figure: k = 50 N/m and m = 2 kg (the 0.1 m stretch is the amplitude and does not affect the period). T = 2π√(m/k) = 2π√(2/50) = 2π × 0.2 ≈ 1.257 s. From an extreme position to equilibrium is a quarter of a cycle: 1.257 / 4 ≈ 0.31 s.',
  },
]);

G('0da1d0f6.lo-4', 'Mass and the period of a spring', [
  {
    t: 'mass needed to double the period', d: 2, need: 'calc',
    spec: mech('spring_mass', { orientation: 'vertical', k: 120, m: 0.5 }),
    alt: 'A block hangs at rest from a vertical coil spring fixed to a ceiling; the spring constant is printed beside the spring and the mass inside the block.',
    q: 'The block shown oscillates up and down on the spring. It is to be replaced by a different block so that the period of oscillation on the same spring is exactly twice as long. What must the mass of the new block be, in kilograms?',
    n: '2',
    calc: ['the printed mass × 2² (T ∝ √m); checked: spring_value period with the new mass is twice the period drawn', (c) => { const m2 = 4 * pn(c, 'm'); if (!near(c.num('spring_value', { want: 'period', m: m2 }), 2 * c.num('spring_value', { want: 'period' }), 1e-6)) throw new Error('not double'); return m2; }],
    h: ['For a mass on a spring the period is proportional to the square root of the mass, not to the mass itself.', 'Ask what factor the mass must be multiplied by so that its square root doubles, then apply that factor to the mass read from the figure.'],
    s: 'Read from the figure: the block\'s mass is 0.5 kg (the spring constant, 120 N/m, stays the same). Since T is proportional to √m, doubling T needs √m to double, so m must be 4 times as large: 4 × 0.5 = 2 kg.',
  },
]);

G('0da1d0f6.lo-5', 'Spring constant and the period', [
  {
    t: 'which replacement spring triples the period', d: 2, need: 'reason',
    spec: mech('spring_mass', { k: 180, m: 0.3, state: 'equilibrium' }),
    alt: 'The block sits at the equilibrium position on a level surface, attached to a wall by a horizontal coil spring; the spring constant is printed beside the spring and the mass inside the block.',
    q: 'The block shown oscillates on a frictionless surface. The spring is to be replaced so that the same block oscillates with a period exactly three times as long. What spring constant must the new spring have?',
    o: [['20 N/m', 'correct'], ['60 N/m', 'divides k by 3: takes the period to be proportional to 1/k'], ['540 N/m', 'multiplies k by 3: has the dependence upside down and forgets the square root'], ['1620 N/m', 'multiplies k by 9: squares correctly but makes the spring stiffer instead of softer']],
    holds: ['for each option, spring_value period with that k compared with 3 × the period for the k printed', [20, 60, 540, 1620].map((k) => (c: Ctx) => near(c.num('spring_value', { want: 'period', k }), 3 * c.num('spring_value', { want: 'period' }), 1e-6))],
    h: ['In T = 2π√(m/k) the period is proportional to 1/√k: a softer spring gives a longer period.', 'For the period to be 3 times as long, √k must be 3 times smaller. What does that do to k itself?'],
    s: 'Read from the figure: the spring constant is 180 N/m (the mass, 0.3 kg, is unchanged). T is proportional to 1/√k, so tripling T needs √k to be one third as large, that is k one ninth as large: 180 / 9 = 20 N/m.',
  },
]);

G('0da1d0f6.lo-8', 'Working back from timed oscillations', [
  {
    t: 'spring constant from a timed number of oscillations', d: 3, need: 'calc',
    spec: mech('spring_mass', { orientation: 'vertical', m: 0.5, show: { k: 'blank' } }),
    alt: 'A block hangs from a vertical coil spring fixed to a ceiling; the mass is printed inside the block and the spring constant is a question mark.',
    q: 'The block shown is set oscillating up and down on the spring and completes 20 full oscillations in 8.0 s. Which value is closest to the spring constant k?',
    o: [['about 123 N/m', 'correct'], ['about 31 N/m', 'uses π² in place of 4π² (takes T = π√(m/k))'], ['about 7.9 N/m', 'does not square: uses k = 2πm / T'], ['about 0.31 N/m', 'uses 8.0 s as the period of one oscillation']],
    calc: ['k = 4π²·m / T² with T = 8.0 s ÷ 20 and the mass printed in the block; checked: spring_value period with that k is 0.4 s', (c) => { const T = 8 / 20; const k = (4 * Math.PI ** 2 * pn(c, 'm')) / T ** 2; if (!near(c.num('spring_value', { want: 'period', k }), T, 1e-6)) throw new Error('period'); return `about ${Math.round(k)} N/m`; }],
    h: ['First find the period: the time for ONE oscillation.', 'Square T = 2π√(m/k) to remove the root, then solve for k: k = 4π²m / T².'],
    s: 'Read from the figure: the mass of the block is 0.5 kg. The period is T = 8.0 s ÷ 20 = 0.40 s. From T = 2π√(m/k), k = 4π²m / T² = 4π² × 0.5 / 0.40² ≈ 19.74 / 0.16 ≈ 123 N/m.',
  },
]);

G('0da1d0f6.lo-3', 'Period of a simple pendulum', [
  {
    t: 'time from release to the far side of the swing', d: 3, need: 'calc',
    spec: mech('pendulum', { angle: 10, length: 0.9, g: 10 }),
    alt: 'The bob is drawn pulled a small angle to the right of the dashed vertical; the angle is marked at the top and the length of the string is printed beside the string.',
    q: 'The pendulum shown is released from rest at the position drawn. Using the small-angle period formula with g = 10 m/s², how long after release does the bob first come to rest at the highest point on the other side of its swing? Give your answer in seconds, to two decimal places.',
    n: '0.94',
    calc: ['half of pendulum_value period (the L printed, g = 10)', (c) => c.num('pendulum_value', { want: 'period' }) / 2],
    h: ['Find the period from T = 2π√(L/g), with the length read from the figure.', 'One period is a full swing across and back. What fraction of it is the swing from one side to the other?'],
    s: 'Read from the figure: the string is 0.9 m long (the 10° angle is small, so the formula applies). T = 2π√(L/g) = 2π√(0.9/10) = 2π × 0.3 ≈ 1.885 s. Swinging from one extreme to the other is half a period: 1.885 / 2 ≈ 0.94 s.',
  },
]);

G('0da1d0f6.lo-6', 'Length and the period of a pendulum', [
  {
    t: 'length needed for a period 1.5 times as long', d: 2, need: 'calc',
    spec: mech('pendulum', { angle: 8, length: 0.8, g: 10 }),
    alt: 'The bob is drawn pulled a small angle to the right of the dashed vertical; the angle is marked at the top and the length of the string is printed beside the string.',
    q: 'The string of the pendulum shown is to be replaced so that the period of small swings becomes exactly 1.5 times as long, in the same place. What must the length of the new string be, in metres?',
    n: '1.8',
    calc: ['the printed length × 1.5² (T ∝ √L); checked: pendulum_value period with the new length is 1.5 × the period drawn', (c) => { const L2 = 2.25 * pn(c, 'length'); if (!near(c.num('pendulum_value', { want: 'period', length: L2 }), 1.5 * c.num('pendulum_value', { want: 'period' }), 1e-6)) throw new Error('ratio'); return L2; }],
    h: ['In T = 2π√(L/g) the period is proportional to the square root of the length.', 'For the period to be 1.5 times as long, the length must be multiplied by 1.5 squared.'],
    s: 'Read from the figure: the string is 0.8 m long. T is proportional to √L, so making T 1.5 times as long needs L to be 1.5² = 2.25 times as long: 2.25 × 0.8 = 1.8 m.',
  },
]);

G('0da1d0f6.lo-7', 'The mass of the bob does not matter', [
  {
    t: 'length of a second pendulum with a heavier bob and twice the period', d: 3, need: 'calc',
    spec: mech('pendulum', { angle: 10, length: 1.6, mass: 0.2, g: 10 }),
    alt: 'The bob is drawn pulled a small angle to the right of the dashed vertical; the angle is marked at the top, the length of the string is printed beside the string and the mass beside the bob.',
    q: 'A second pendulum, swinging in the same place, has a bob of four times the mass of the bob shown and a period of small swings that is exactly twice as long as that of the pendulum shown. What is the length of the second pendulum\'s string, in metres?',
    n: '6.4',
    calc: ['the printed length × 2² — the mass does not enter T = 2π√(L/g); checked with pendulum_value period', (c) => { const L2 = 4 * pn(c, 'length'); if (!near(c.num('pendulum_value', { want: 'period', length: L2 }), 2 * c.num('pendulum_value', { want: 'period' }), 1e-6)) throw new Error('ratio'); return L2; }],
    h: ['Both the restoring force on the bob and its inertia are proportional to its mass, so the mass cancels: only L and g set the period.', 'Ignore the change of mass. The period is proportional to √L — what must happen to L for the period to double?'],
    s: 'Read from the figure: the string is 1.6 m long (the bob\'s mass, 0.2 kg, is also printed but is not needed). The period of a pendulum does not depend on the mass of the bob, so the heavier bob changes nothing. T is proportional to √L, so twice the period needs four times the length: 4 × 1.6 = 6.4 m.',
  },
]);

// ── Conservation of Mechanical Energy (pack 233; the lesson takes g = 10 m/s²) ──

G('8820dd65.lo-3', 'Speed of a pendulum bob from energy conservation', [
  {
    t: 'speed at the lowest point from the length and the release angle', d: 3, need: 'calc',
    spec: mech('pendulum', { angle: 60, length: 1.6, g: 10, show: { height: 'blank' } }),
    hide: [0.8],
    alt: 'The bob is drawn pulled well to the right of the dashed vertical; the angle is marked at the top and the length of the string is printed beside the string. A dashed circle shows the bob at its lowest position, and the height of the bob above that level is a question mark.',
    q: 'The bob of the pendulum shown is released from rest at the position drawn. Ignore air resistance and take g = 10 m/s². What is the speed of the bob, in m/s, as it passes through its lowest point?',
    n: '4',
    ck: ['pendulum_value', { want: 'bottom_speed' }],
    h: ['First find how far the bob is above its lowest point: the string hangs L below the pivot at the bottom, and L·cos θ below it at the position drawn.', 'All of the potential energy mgh lost on the way down becomes kinetic energy ½mv²; the mass cancels.'],
    s: 'Read from the figure: L = 1.6 m and the string makes 60° with the vertical. The bob starts h = L(1 − cos 60°) = 1.6 × 0.5 = 0.8 m above its lowest point. Energy conservation: mgh = ½mv², so v = √(2gh) = √(2 × 10 × 0.8) = √16 = 4 m/s.',
  },
]);

G('8820dd65.lo-4', 'How far a pendulum swings, from its speed at the bottom', [
  {
    t: 'greatest angle reached from the speed at the lowest point', d: 3, need: 'calc',
    spec: mech('pendulum', { angle: 60, length: 0.9, g: 10, show: { angle: 'blank' } }),
    alt: 'The bob is drawn at the highest point of its swing, to the right of the dashed vertical; the angle between the string and the vertical is a question mark and the length of the string is printed beside the string.',
    q: 'The bob of the pendulum shown passes through its lowest point at 3.0 m/s and swings up to the highest position, which is the one drawn. Ignore air resistance and take g = 10 m/s². What is the angle, in degrees, between the string and the vertical at that highest position?',
    n: '60',
    calc: ['h = v² / (2g) with v = 3.0 m/s; cos θ = 1 − h / L with the L printed; checked against the angle the figure is drawn at and pendulum_value bottom_speed', (c) => { const g = pn(c, 'g'); const h = 3 ** 2 / (2 * g); const th = (Math.acos(1 - h / pn(c, 'length')) * 180) / Math.PI; if (!near(th, pn(c, 'angle'), 1e-9)) throw new Error('angle'); if (!near(c.num('pendulum_value', { want: 'bottom_speed', angle: th }), 3, 1e-9)) throw new Error('speed'); return round(th, 6); }],
    h: ['Use energy conservation to find how high the bob rises above its lowest point: ½mv² = mgh.', 'Relate that height to the string: the bob at angle θ is L − L·cos θ above the lowest point. Solve for cos θ.'],
    s: 'Read from the figure: the string is 0.9 m long. Energy conservation gives the rise: h = v² / (2g) = 3.0² / (2 × 10) = 0.45 m. At the highest position h = L(1 − cos θ), so 1 − cos θ = 0.45 / 0.9 = 0.5, cos θ = 0.5 and θ = 60°.',
  },
]);

// ── Standing Waves and Harmonics (pack 249) ─────────────────────────────────

G('c40fd3f9.lo-1', 'Where the two travelling waves always cancel', [
  {
    t: 'position of permanent destructive interference on a string', d: 2, need: 'reason',
    spec: wave('standing', { harmonics: [3], length: 1.2, nodes: 'none' }),
    alt: 'One standing wave on a string clamped at both ends, drawn as a solid curve and its dashed mirror image; the length of the string is printed under it. No points are marked on the string.',
    q: 'The standing wave shown is produced by two identical waves travelling in opposite directions along the string. At which distance from the left end do the two waves always interfere destructively, so that the string there never moves?',
    o: [['0.4 m', 'correct'], ['0.2 m', 'picks the middle of the first loop, an antinode, where the interference is constructive'], ['0.6 m', 'picks the middle of the string, which is an antinode for this wave'], ['1.0 m', 'picks the middle of the last loop, an antinode']],
    holds: ['a distance answers the question when it is a node of the drawn harmonic: a whole multiple of L / n (spec length; n from standing_harmonic), strictly inside the string', [0.4, 0.2, 0.6, 1.0].map((x) => (c: Ctx) => { const seg = pn(c, 'length') / c.num('standing_harmonic'); return x > 0 && x < pn(c, 'length') && isWhole(round(x / seg, 9)); })],
    h: ['Points where the two waves always cancel are the nodes: the points where the solid and dashed curves cross the centre line.', 'Count the loops. They divide the string into equal parts, and the nodes lie where one loop ends and the next begins.'],
    s: 'Read from the figure: the string is 1.2 m long and the wave has 3 loops, so each loop is 1.2 / 3 = 0.4 m long. The nodes — where the two travelling waves always cancel — are at the ends of the loops: 0, 0.4 m, 0.8 m and 1.2 m. Of the choices only 0.4 m is a node; 0.2 m, 0.6 m and 1.0 m are the middles of the loops (antinodes), where the waves reinforce.',
  },
]);

G('c40fd3f9.lo-2', 'Which waves fit a string fixed at both ends', [
  {
    t: 'which other wavelength can stand on the same string', d: 3, need: 'reason',
    spec: wave('standing', { harmonics: [4], length: 2.4 }),
    alt: 'One standing wave on a string clamped at both ends, drawn as a solid curve and its dashed mirror image, with a dot on the centre line at each point where the curves cross it; the length of the string is printed under it.',
    q: 'The figure shows one standing wave on a string fixed at both ends. Which of these wavelengths can also form a standing wave on this same string?',
    o: [['1.6 m', 'correct'], ['1.0 m', 'does not test the fit: 2.4 m is not a whole number of 0.5 m half-wavelengths'], ['1.8 m', 'does not test the fit: 2.4 m is not a whole number of 0.9 m half-wavelengths'], ['3.2 m', 'takes any wavelength longer than the string to fit; 2.4 m is 1.5 half-wavelengths']],
    holds: ['a wavelength fits when 2L / λ is a whole number (L from the spec, printed on the figure)', [1.6, 1.0, 1.8, 3.2].map((lam) => (c: Ctx) => { const n = round((2 * pn(c, 'length')) / lam, 9); return isWhole(n) && n >= 1; })],
    h: ['A string fixed at both ends must have a node at each end, so its length must be a whole number of half-wavelengths.', 'For each wavelength work out how many half-wavelengths fit into the length printed on the figure.'],
    s: 'Read from the figure: the string is 2.4 m long. A standing wave needs L = n(λ/2) with n a whole number, so n = 2L/λ = 4.8/λ must be whole. For 1.6 m, n = 3 — it fits (the third harmonic). For 1.0 m, n = 4.8; for 1.8 m, n ≈ 2.67; for 3.2 m, n = 1.5 — none of these fits.',
  },
]);

G('c40fd3f9.lo-3', 'Wavelengths of two harmonics of one string', [
  {
    t: 'difference between the wavelengths of two drawn harmonics', d: 3, need: 'calc',
    spec: wave('standing', { harmonics: [2, 5], length: 1.5 }),
    alt: 'Two standing waves on the same string, one under the other, each drawn as a solid curve and its dashed mirror image with a dot at each point where the curves cross the centre line; the upper wave has fewer loops than the lower. The length of the string is printed under the lower wave.',
    q: 'The figure shows two standing waves on the same string, which is fixed at both ends. By how many metres is the wavelength of the upper wave longer than the wavelength of the lower wave?',
    n: '0.9',
    calc: ['standing_wavelength of row 0 minus standing_wavelength of row 1', (c) => round(c.num('standing_wavelength', { row: 0 }) - c.num('standing_wavelength', { row: 1 }), 9)],
    h: ['Count the loops of each wave: each loop is half a wavelength, so n loops in a length L means λ = 2L / n.', 'Find the two wavelengths separately from the length printed on the figure, then subtract.'],
    s: 'Read from the figure: the string is 1.5 m long; the upper wave has 2 loops and the lower wave has 5. Upper: λ = 2L/n = 2 × 1.5 / 2 = 1.5 m. Lower: λ = 2 × 1.5 / 5 = 0.6 m. The difference is 1.5 − 0.6 = 0.9 m.',
  },
]);

G('c40fd3f9.lo-4', 'Frequency of a drawn harmonic', [
  {
    t: 'frequency from the wave speed, the length and the number of loops', d: 3, need: 'calc',
    spec: wave('standing', { harmonics: [4], length: 1.5, nodes: 'none' }),
    alt: 'One standing wave on a string clamped at both ends, drawn as a solid curve and its dashed mirror image; the length of the string is printed under it. No points are marked and no harmonic number is printed.',
    q: 'Waves travel along the string shown at 120 m/s. The string, fixed at both ends, vibrates in the standing wave drawn. What is the frequency of this standing wave, in hertz?',
    n: '160',
    ck: ['standing_frequency', { speed: 120 }],
    h: ['Count the loops to find the harmonic number n; each loop is half a wavelength.', 'Find the wavelength from λ = 2L / n, then use f = v / λ.'],
    s: 'Read from the figure: the string is 1.5 m long and the wave has 4 loops, so n = 4. The wavelength is λ = 2L/n = 2 × 1.5 / 4 = 0.75 m, and f = v/λ = 120 / 0.75 = 160 Hz (the same as n·v / 2L).',
  },
]);

G('c40fd3f9.lo-5', 'Harmonic number, wavelength and string length', [
  {
    t: 'wavelength of one harmonic from that of another on an unmarked string', d: 3, need: 'calc',
    spec: wave('standing', { harmonics: [3, 4] }),
    alt: 'Two standing waves on the same string, one under the other, each drawn as a solid curve and its dashed mirror image with a dot at each point where the curves cross the centre line; the lower wave has one more loop than the upper. The length of the string is not marked.',
    q: 'The figure shows two standing waves on the same string, which is fixed at both ends. The upper wave has a wavelength of 0.8 m. What is the wavelength of the lower wave, in metres?',
    n: '0.6',
    calc: ['standing_length of row 0 from λ = 0.8 m, then standing_wavelength of row 1 with that length', (c) => c.num('standing_wavelength', { row: 1, length: c.num('standing_length', { row: 0, wavelength: 0.8 }) })],
    h: ['Count the loops of the upper wave and use L = n(λ/2) to find the length of the string.', 'The lower wave is on the same string: use its own number of loops with the same L to find its wavelength.'],
    s: 'Read from the figure: the upper wave has 3 loops and the lower wave has 4. From the upper wave, L = n(λ/2) = 3 × 0.4 = 1.2 m. For the lower wave on the same string, λ = 2L/n = 2 × 1.2 / 4 = 0.6 m.',
  },
]);

// ── Connected Objects and Pulley Systems (pack 225; g = 9.8 m/s²) ───────────

G('67385871.lo-1', 'Newton\'s second law for a connected system with friction', [
  {
    t: 'acceleration of a table-and-hanging-block system with kinetic friction', d: 3, need: 'calc',
    spec: mech('pulley', { arrangement: 'table', m1: 4, m2: 3, mu: 0.2 }),
    alt: 'One block rests on a level table and a second block hangs beside the table from a string that passes over a pulley at the table\'s edge; the mass of each block is printed beside it and the coefficient of kinetic friction is printed on the table surface.',
    q: 'The blocks shown are joined by a light string over an ideal pulley and are moving, the hanging block downward. The coefficient printed on the table is that of kinetic friction between the block and the table. Take g = 9.8 m/s². What is the magnitude of the acceleration of the blocks, in m/s², to two decimal places?',
    n: '3.08',
    ck: ['pulley_value', { want: 'acceleration' }],
    h: ['Treat the two blocks as one system: the weight of the hanging block drives it and the friction on the table block opposes it.', 'The friction force is μ times the normal force on the table block (its weight). Divide the net force by the TOTAL mass.'],
    s: 'Read from the figure: the block on the table is 4 kg, the hanging block is 3 kg and μ = 0.2. Driving force: 3 × 9.8 = 29.4 N. Friction on the 4 kg block: 0.2 × 4 × 9.8 = 7.84 N. Net force on the system: 29.4 − 7.84 = 21.56 N. a = 21.56 / (4 + 3) = 3.08 m/s².',
  },
]);

G('67385871.lo-2', 'Forces on two blocks hanging over a pulley', [
  {
    t: 'which statement about the tension and the two weights is true', d: 3, need: 'reason',
    spec: mech('pulley', { arrangement: 'atwood', m1: 2, m2: 5 }),
    alt: 'A pulley hangs from a ceiling with a string over it and a block hanging from each end of the string; the mass of each block is printed beside it. The blocks are drawn the same size, the right-hand one a little lower than the left-hand one.',
    q: 'The two blocks shown hang from a light string over an ideal pulley and are released from rest. Take g = 9.8 m/s². Which statement about the forces on the blocks while they are moving is correct?',
    o: [
      ['The tension is more than 19.6 N but less than 49 N.', 'correct'],
      ['The tension is 49 N, the weight of the heavier block.', 'takes the string to carry the full weight of the heavier block, as if that block were not accelerating'],
      ['The tension is 29.4 N, the difference of the two weights.', 'confuses the net force on the system with the tension'],
      ['The tension is 68.6 N, the sum of the two weights.', 'adds the weights, as for the force on the pulley\'s support with the blocks at rest'],
    ],
    holds: ['each statement tested against pulley_value tension and the weights m·g from the printed masses', [
      (c) => { const T = c.num('pulley_value', { want: 'tension' }); const [w1, w2] = [pn(c, 'm1') * 9.8, pn(c, 'm2') * 9.8]; return near(w1, 19.6) && near(w2, 49) && T > Math.min(w1, w2) && T < Math.max(w1, w2); },
      (c) => near(c.num('pulley_value', { want: 'tension' }), 49),
      (c) => near(c.num('pulley_value', { want: 'tension' }), 29.4),
      (c) => near(c.num('pulley_value', { want: 'tension' }), 68.6),
    ]],
    h: ['Draw a free-body diagram for each block: each has its weight down and the same tension up.', 'The lighter block accelerates upward, so the tension on it must exceed its weight; the heavier block accelerates downward, so its weight must exceed the tension.'],
    s: 'Read from the figure: the blocks are 2 kg and 5 kg, so their weights are 2 × 9.8 = 19.6 N and 5 × 9.8 = 49 N. Each block feels its weight down and the same tension T up. The 2 kg block accelerates upward, so T > 19.6 N; the 5 kg block accelerates downward, so T < 49 N. (In fact T = 2 × 2 × 5 × 9.8 / 7 = 28 N.)',
  },
]);

G('67385871.lo-3', 'Acceleration of a block on an incline joined to a hanging block', [
  {
    t: 'acceleration with a frictionless incline', d: 3, need: 'calc',
    spec: mech('pulley', { arrangement: 'incline', m1: 5, m2: 4, angle: 30, frictionless: true }),
    alt: 'One block rests on an inclined plane and a second block hangs beside the incline from a string that runs up the slope and over a pulley at the top; the mass of each block is printed beside it, the angle of the incline is marked at its foot and the slope is marked frictionless.',
    q: 'The blocks shown are joined by a light string over an ideal pulley and released from rest. Take g = 9.8 m/s². What is the magnitude of the acceleration of the blocks, in m/s², to two decimal places?',
    n: '1.63',
    ck: ['pulley_value', { want: 'acceleration' }],
    h: ['Only the component of the incline block\'s weight along the slope, m·g·sin θ, pulls against the hanging block\'s weight.', 'Find the net force along the string (the difference of those two forces) and divide by the total mass of both blocks.'],
    s: 'Read from the figure: the block on the incline is 5 kg, the hanging block is 4 kg, the incline is at 30° and it is frictionless. Weight of the hanging block: 4 × 9.8 = 39.2 N. Component of the other block\'s weight down the slope: 5 × 9.8 × sin 30° = 24.5 N. Net force: 39.2 − 24.5 = 14.7 N, so the hanging block moves down. a = 14.7 / (5 + 4) ≈ 1.63 m/s².',
  },
]);

G('67385871.lo-4', 'Tension in the string of a table-and-hanging-block system', [
  {
    t: 'tension with a frictionless table', d: 3, need: 'calc',
    spec: mech('pulley', { arrangement: 'table', m1: 6, m2: 2, frictionless: true }),
    alt: 'One block rests on a level table and a second block hangs beside the table from a string that passes over a pulley at the table\'s edge; the mass of each block is printed beside it and the table is marked frictionless.',
    q: 'The blocks shown are joined by a light string over an ideal pulley and released from rest. Take g = 9.8 m/s². What is the tension in the string, in newtons, while the blocks are moving? Give your answer to one decimal place.',
    n: '14.7',
    ck: ['pulley_value', { want: 'tension' }],
    h: ['First find the acceleration of the system: the weight of the hanging block is the only force driving both masses.', 'Then apply Newton\'s second law to the block on the table alone — the tension is the only horizontal force on it.'],
    s: 'Read from the figure: the block on the frictionless table is 6 kg and the hanging block is 2 kg. System: a = (2 × 9.8) / (6 + 2) = 2.45 m/s². For the table block alone the tension is the only horizontal force: T = 6 × 2.45 = 14.7 N (less than the hanging block\'s weight of 19.6 N, as it must be).',
  },
]);

G('67385871.lo-5', 'An Atwood machine set in motion', [
  {
    t: 'speed of the blocks a stated time after release', d: 3, need: 'calc',
    spec: mech('pulley', { arrangement: 'atwood', m1: 3, m2: 5 }),
    alt: 'A pulley hangs from a ceiling with a string over it and a block hanging from each end of the string; the mass of each block is printed beside it. The blocks are drawn the same size, the right-hand one a little lower than the left-hand one.',
    q: 'The two blocks shown hang from a light string over an ideal pulley and are released from rest. Take g = 9.8 m/s². What is the speed of each block, in m/s, 2.0 s after release (neither block has reached the floor or the pulley)?',
    n: '4.9',
    calc: ['pulley_value acceleration × 2.0 s', (c) => round(c.num('pulley_value', { want: 'acceleration' }) * 2, 9)],
    h: ['The net force on the system is the difference of the two weights, and it accelerates the total mass.', 'Once you have the acceleration, the blocks start from rest: v = a·t.'],
    s: 'Read from the figure: the blocks are 3 kg and 5 kg. a = (5 − 3) × 9.8 / (5 + 3) = 19.6 / 8 = 2.45 m/s². Starting from rest, after 2.0 s each block moves at v = at = 2.45 × 2.0 = 4.9 m/s (the 5 kg block downward, the 3 kg block upward).',
  },
]);

// ── Bohr Model and Atomic Spectra (pack 201) ────────────────────────────────

G('0938830f.lo-1', 'Only certain energies are allowed', [
  {
    t: 'which photon a ground-state atom can absorb', d: 3, need: 'reason',
    spec: ladder({ levels: [{ energy: -10, label: 'n = 1' }, { energy: -6, label: 'n = 2' }, { energy: -3, label: 'n = 3' }, { energy: -1, label: 'n = 4' }] }),
    alt: 'Four horizontal lines, one for each allowed energy of the electron, each labelled with its level number on the left and its energy in electron-volts on the right. No transition arrows are drawn.',
    q: 'The diagram shows the only energy levels of the electron in a hypothetical atom. The electron is in the lowest level. A photon of which energy can the atom absorb?',
    o: [['7 eV', 'correct'], ['8 eV', 'would leave the electron between two levels, at an energy that is not allowed'], ['3 eV', 'is the gap between the second and third levels, not a gap from the lowest level'], ['5 eV', 'is the gap between the second and fourth levels, not a gap from the lowest level']],
    holds: ['a photon energy can be absorbed when it equals the gap from the lowest level to a higher level (the spec\'s own energies)', [7, 8, 3, 5].map((e) => (c: Ctx) => gapsOf(c, 1).some((g) => near(g, e)))],
    h: ['The electron can only be in one of the levels drawn — it cannot end up between them.', 'Starting from the lowest level, work out the energy needed to reach each higher level; only a photon with exactly one of those energies can be absorbed.'],
    s: 'Read from the figure: the levels are at −10 eV, −6 eV, −3 eV and −1 eV. From the lowest level the electron can jump by 4 eV (to −6 eV), 7 eV (to −3 eV) or 9 eV (to −1 eV), and by nothing else. So a 7 eV photon can be absorbed. An 8 eV photon would leave the electron at −2 eV, where there is no level; 3 eV and 5 eV are gaps between higher levels, which do not help an electron that starts in the lowest level.',
  },
]);

G('0938830f.lo-2', 'Energy of a transition when one level must be calculated', [
  {
    t: 'photon energy for a transition from a level whose energy is blank', d: 3, need: 'calc',
    spec: ladder({ hydrogen: { nMax: 4, blank: [3] }, transitions: [{ from: 3, to: 2 }] }),
    alt: 'The energy levels of hydrogen from n = 1 to n = 4, each labelled with its n; the energies of three levels are printed and the energy of the n = 3 level is a question mark. One arrow points down from the n = 3 level to the n = 2 level.',
    q: 'The diagram shows energy levels of the hydrogen atom, for which E = −13.6 eV / n². The energy of one level is not given. What is the energy, in eV, of the photon emitted in the transition shown by the arrow? Give your answer to two decimal places.',
    n: '1.89',
    ck: ['level_transition_energy', { transition: 0 }],
    h: ['Use E = −13.6 eV / n² to work out the energy of the level that is marked with a question mark.', 'The photon carries away the difference between the energies of the level where the arrow starts and the level where it ends.'],
    s: 'Read from the figure: the arrow goes from n = 3 down to n = 2; the n = 2 level is at −3.4 eV and the n = 3 energy is not printed. From the formula, E₃ = −13.6 / 3² ≈ −1.51 eV. The photon energy is the difference: −1.51 − (−3.4) ≈ 1.89 eV.',
  },
]);

G('0938830f.lo-3', 'Photon energy, frequency and wavelength compared across transitions', [
  {
    t: 'which emission has the longest wavelength, with an absorption arrow as a trap', d: 3, need: 'reason',
    spec: ladder({ levels: [{ energy: -9, label: 'n = 1' }, { energy: -5, label: 'n = 2' }, { energy: -2.5, label: 'n = 3' }, { energy: -1, label: 'n = 4' }], transitions: [{ from: 4, to: 1, label: 'P' }, { from: 3, to: 2, label: 'Q' }, { from: 3, to: 4, label: 'R' }, { from: 2, to: 1, label: 'S' }] }),
    alt: 'Four energy levels of an atom, each labelled with its level number on the left and its energy in electron-volts on the right, with four vertical arrows between levels lettered P, Q, R and S; three arrows point down and one points up.',
    q: 'The diagram shows four transitions, P, Q, R and S, between the energy levels of a hypothetical atom. In which transition does the atom EMIT the photon with the longest wavelength?',
    o: [['Q', 'correct'], ['R', 'picks the smallest energy gap without noticing that this arrow points up: a photon is absorbed, not emitted'], ['P', 'picks the largest energy gap: that photon has the shortest wavelength'], ['S', 'picks the arrow that ends on the lowest level']],
    ck: ['level_extreme_transition', { want: 'longest_wavelength', among: 'emission' }],
    h: ['A photon is emitted only when the electron drops to a lower level — check which way each arrow points.', 'From E = hf and c = λf, E = hc/λ: the longest wavelength belongs to the photon with the smallest energy.'],
    s: 'Read from the figure: P drops from −1 eV to −9 eV (8 eV), Q drops from −2.5 eV to −5 eV (2.5 eV), S drops from −5 eV to −9 eV (4 eV), and R points UP from −2.5 eV to −1 eV (1.5 eV absorbed). Among the three emissions, Q has the smallest photon energy, and since λ = hc/E the smallest energy means the longest wavelength. R has a smaller gap but is an absorption.',
  },
]);

G('0938830f.lo-4', 'Wavelength of the photon of a drawn transition', [
  {
    t: 'wavelength from two level energies read off the ladder', d: 3, need: 'calc',
    spec: ladder({ levels: [{ energy: -8, label: 'n = 1' }, { energy: -5.5, label: 'n = 2' }, { energy: -3, label: 'n = 3' }, { energy: -1.2, label: 'n = 4' }], transitions: [{ from: 3, to: 2 }] }),
    alt: 'Four energy levels of an atom, each labelled with its level number on the left and its energy in electron-volts on the right. One arrow points down from the third level to the second level.',
    q: 'The diagram shows the energy levels of a hypothetical atom and one transition. Using hc = 1240 eV·nm, which value is closest to the wavelength of the photon emitted in this transition?',
    o: [['about 496 nm', 'correct'], ['about 413 nm', 'uses the energy of the upper level, 3 eV, instead of the difference between the two levels'], ['about 225 nm', 'uses the energy of the lower level, 5.5 eV, instead of the difference between the two levels'], ['about 3100 nm', 'multiplies hc by the energy difference instead of dividing']],
    calc: ['level_photon wavelength_nm of the drawn transition, to the nearest nanometre', (c) => `about ${Math.round(c.num('level_photon', { transition: 0, want: 'wavelength_nm' }))} nm`],
    h: ['The photon\'s energy is the difference between the energies of the two levels the arrow joins.', 'Then λ = hc / E: divide 1240 eV·nm by the photon energy in eV.'],
    s: 'Read from the figure: the arrow drops from the level at −3 eV to the level at −5.5 eV, so the photon energy is 5.5 − 3 = 2.5 eV. Its wavelength is λ = hc/E = 1240 / 2.5 = 496 nm.',
  },
]);

G('0938830f.lo-5', 'How many spectral lines a set of levels gives', [
  {
    t: 'number of different emission lines when two gaps coincide', d: 3, need: 'reason',
    spec: ladder({ levels: [{ energy: -9, label: 'n = 1' }, { energy: -6, label: 'n = 2' }, { energy: -3, label: 'n = 3' }, { energy: -1, label: 'n = 4' }] }),
    alt: 'Four horizontal lines, one for each allowed energy of the electron, each labelled with its level number on the left and its energy in electron-volts on the right. No transition arrows are drawn.',
    q: 'The diagram shows the only energy levels of the electron in a hypothetical atom. In a hot gas of these atoms, electrons are excited up to the highest level shown and then fall back by every possible downward transition. How many lines of DIFFERENT photon energy appear in the emission spectrum?',
    n: '5',
    calc: ['the number of distinct values among all the gaps between two levels (the spec\'s own energies)', (c) => new Set(gapsOf(c).map((g) => g.toFixed(6))).size],
    h: ['List every downward transition between two of the four levels — there are six pairs of levels.', 'Work out the photon energy of each one. Two transitions with the same photon energy give the same spectral line.'],
    s: 'Read from the figure: the levels are at −9, −6, −3 and −1 eV. The six downward transitions give photon energies of 8 eV (4→1), 5 eV (4→2), 2 eV (4→3), 6 eV (3→1), 3 eV (3→2) and 3 eV (2→1). Two of them have the same energy, 3 eV, and so fall on the same line: the spectrum has 5 different lines (2, 3, 5, 6 and 8 eV).',
  },
]);

// ── Wave Speed Equation Fundamentals (pack 238) ─────────────────────────────

G('ade9f012.lo-1', 'Wavelength, amplitude and cycles on a snapshot of a wave', [
  {
    t: 'find the false statement about a scaled snapshot', d: 3, need: 'reason',
    spec: wave('transverse', { amplitude: 0.3, wavelength: 4, cycles: 2.5, scale: true, xStep: 1, yStep: 0.1, yMax: 0.4, points: [{ x: 1, label: 'P' }, { x: 5, label: 'Q' }, { x: 7, label: 'R' }] }),
    alt: 'A snapshot of a wave on a grid with numbered axes: position in metres along the bottom and displacement in metres up the side. Three dots on the wave are lettered P, Q and R; P and Q are on crests and R is in a trough.',
    q: 'The graph is a snapshot of a wave on a rope, with three points P, Q and R marked. Which statement about the wave is FALSE?',
    o: [
      ['The amplitude of the wave is 0.6 m.', 'correct'],
      ['The wavelength of the wave is 4 m.', 'does not measure from one crest to the next along the position axis'],
      ['P and Q are one wavelength apart.', 'does not see that P and Q are neighbouring crests'],
      ['Q and R are half a wavelength apart.', 'does not see that a crest and the next trough are half a wavelength apart'],
    ],
    holds: ['each statement tested with wave_amplitude, wave_wavelength and the positions of the lettered points (spec); an option answers the question when its statement is false', [
      (c) => !near(c.num('wave_amplitude'), 0.6),
      (c) => !near(c.num('wave_wavelength'), 4),
      (c) => { const pts = arr(c.p.points); return !near(Math.abs((pts[1].x as number) - (pts[0].x as number)), c.num('wave_wavelength')); },
      (c) => { const pts = arr(c.p.points); return !near(Math.abs((pts[2].x as number) - (pts[1].x as number)), c.num('wave_wavelength') / 2); },
    ]],
    h: ['The amplitude is measured from the equilibrium line (zero displacement) to a crest — not from a trough to a crest.', 'The wavelength is the distance along the position axis from one crest to the next; a crest and the neighbouring trough are half of that apart.'],
    s: 'Read from the figure: the crests reach +0.3 m and the troughs −0.3 m, so the amplitude is 0.3 m; 0.6 m is the full height from trough to crest, so that statement is false. The crests P and Q are at x = 1 m and x = 5 m, so the wavelength is 4 m and P and Q are one wavelength apart. R is the trough at x = 7 m, 2 m (half a wavelength) from Q.',
  },
]);

G('ade9f012.lo-2', 'Wave speed from a snapshot and a count of vibrations', [
  {
    t: 'speed from a wavelength read off the graph and a frequency worked out from a count', d: 2, need: 'calc',
    spec: wave('transverse', { amplitude: 0.05, wavelength: 0.8, cycles: 2, scale: true, xStep: 0.2, yStep: 0.05, yMax: 0.1, start: 'cosine' }),
    alt: 'A snapshot of a wave on a grid with numbered axes: position in metres along the bottom and displacement in metres up the side. The wave starts on a crest and two full cycles are drawn.',
    q: 'The graph is a snapshot of a wave travelling along a spring. The source of the wave makes 15 complete vibrations in 6.0 s. What is the speed of the wave, in m/s?',
    n: '2',
    calc: ['wave_speed with frequency = 15 ÷ 6.0 s (the wavelength is read off the position axis)', (c) => c.num('wave_speed', { frequency: 15 / 6 })],
    h: ['The frequency is the number of vibrations per second: divide the count by the time.', 'Read the wavelength off the position axis (crest to crest), then use v = fλ.'],
    s: 'Read from the figure: neighbouring crests are at x = 0 and x = 0.8 m, so the wavelength is 0.8 m. The frequency is 15 vibrations / 6.0 s = 2.5 Hz. v = fλ = 2.5 × 0.8 = 2 m/s.',
  },
]);

G('ade9f012.lo-3', 'Period and frequency from a displacement–time record', [
  {
    t: 'cycles in one minute from the period read off a time record', d: 2, need: 'calc',
    spec: wave('transverse', { axis: 'time', amplitude: 2, period: 0.4, cycles: 2.5, scale: true, xStep: 0.1, yStep: 1, yMax: 3, yUnit: 'cm' }),
    alt: 'A record of the displacement of one point against time on a grid with numbered axes: time in seconds along the bottom and displacement in centimetres up the side. Two and a half cycles are drawn, starting from zero displacement and rising.',
    q: 'The graph shows how the displacement of one point of a rope changes with time as a steady wave passes. How many complete cycles does this point make in one minute?',
    n: '150',
    calc: ['60 s × wave_frequency (1 ÷ the period read off the time axis)', (c) => round(60 * c.num('wave_frequency'), 6)],
    h: ['Read the period off the time axis: the time from one crest to the next.', 'The frequency f = 1/T is the number of cycles each second; one minute is 60 seconds.'],
    s: 'Read from the figure: crests come at t = 0.1 s and t = 0.5 s, so the period is T = 0.4 s. The frequency is f = 1/T = 1/0.4 = 2.5 Hz, that is 2.5 cycles each second. In 60 s the point makes 2.5 × 60 = 150 cycles.',
  },
]);

G('ade9f012.lo-4', 'Choosing the right equation for the graph given', [
  {
    t: 'wavelength from a time record and a stated wave speed', d: 2, need: 'calc',
    spec: wave('transverse', { axis: 'time', amplitude: 0.1, period: 0.5, cycles: 2, scale: true, xStep: 0.25, yStep: 0.05, yMax: 0.15, start: 'cosine' }),
    alt: 'A record of the displacement of one point against time on a grid with numbered axes: time in seconds along the bottom and displacement in metres up the side. Two full cycles are drawn, starting on a crest.',
    q: 'The graph shows how the displacement of one point on a water surface changes with time as a wave passes. The wave travels at 6 m/s. What is the wavelength of the wave, in metres?',
    n: '3',
    calc: ['6 m/s × wave_period (read off the time axis); checked: wave_speed with that wavelength is 6 m/s', (c) => { const lam = 6 * c.num('wave_period'); if (!near(c.num('wave_speed', { wavelength: lam }), 6)) throw new Error('speed'); return lam; }],
    h: ['Look at what is on the horizontal axis: the repeat distance on this graph is a time, not a length.', 'Find the frequency from the period (f = 1/T), then rearrange v = fλ for the wavelength.'],
    s: 'Read from the figure: the horizontal axis is time, and crests come at t = 0 and t = 0.5 s, so the period is T = 0.5 s (this is not the wavelength). f = 1/T = 2 Hz. From v = fλ, λ = v/f = 6 / 2 = 3 m (equivalently λ = vT).',
  },
]);
}

// ITEMS-END

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

// ── objectives: the lesson packs and the survey ─────────────────────────────

interface Objective { loId: string; subject: string; skill: string; description: string; pack: string; existing: string[] }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  // The expand packs first; a top-up pack of the same skill (a skill that had a shortfall) replaces it.
  for (const [dir, tag] of [[PACKS_EXPAND, 'expand'], [PACKS_TOPUP, 'topup5']] as const) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
      const pack = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string; existingItems?: Array<{ question: string }> }> };
      for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description, pack: `${tag}/${f.replace('.json', '')}`, existing: (o.existingItems ?? []).map((x) => x.question) });
    }
  }
  return out;
}
const shortOf = (loId: string): string => loId.replace(/^gen-([0-9a-f]{8})-[0-9a-f-]+\.(lo-\d+)$/, '$1.$2');
/** The variant of a figure, where the kind has several (mechanics set-ups, waves, energy levels, sequence strips). */
const variantOf = (spec: Spec): string => {
  const p = spec.params as P;
  const v = [p.variant, p.setup, p.kind, p.mode, p.conic].find((x) => typeof x === 'string') as string | undefined;
  return v ? `${spec.type}:${v}` : spec.type;
};

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const outArg = argv.indexOf('--out');
  const outDir = outArg >= 0 ? argv[outArg + 1] : DEFAULT_OUT;
  const checkOnly = argv.includes('--check');
  const wip = argv.includes('--wip');
  const objectives = loadObjectives();
  const byShort = new Map([...objectives.values()].map((o) => [shortOf(o.loId), o]));
  const survey = (JSON.parse(fs.readFileSync(SURVEY, 'utf8')) as Array<{ kind: string; objectives: string[]; count: number; decision: string }>).filter((r) => r.decision === 'built');
  /** Surveyed objective → the survey's kind line. */
  const surveyKindOf = new Map<string, string>();
  for (const r of survey) for (const lo of r.objectives) if (!surveyKindOf.has(lo)) surveyKindOf.set(lo, r.kind);
  const taken = new Set<string>();
  for (const f of EARLIER_ROWS) if (fs.existsSync(f)) for (const r of JSON.parse(fs.readFileSync(f, 'utf8')) as Array<{ id: string }>) taken.add(r.id);

  if (argv.includes('--list-objectives')) {
    for (const r of survey) {
      console.log(`\n## ${r.kind} (${r.count})`);
      for (const lo of r.objectives) {
        const o = objectives.get(lo);
        const mine = ITEMS.filter((a) => a.lo === shortOf(lo));
        console.log(`${o?.pack ?? '???'} ${shortOf(lo)} ${mine.length}${SKIPPED[shortOf(lo)] ? ' SKIPPED' : ''} | ${o?.subject} | ${o?.skill} | ${o?.description}`);
        for (const a of mine) console.log(`      - [${variantOf(a.spec)}, ${a.need}, d${a.d}] ${a.t}`);
      }
    }
    console.log(`${ITEMS.length} items; ${surveyKindOf.size} surveyed objectives; ${Object.keys(SKIPPED).length} skipped`);
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
  const specsSeen = new Map<string, string>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];

  for (const [n, a] of ITEMS.entries()) {
    const obj = byShort.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    if (!obj) { problems.push(`${tag}: no objective ${a.lo} in the lesson packs`); continue; }
    if (!surveyKindOf.has(obj.loId)) problems.push(`${tag}: the objective is not listed by the survey under a built kind`);
    if (![2, 3, 4].includes(a.d)) problems.push(`${tag}: an item of this batch is level 2, 3 or 4`);
    if (a.need === 'read' && a.d !== 2) problems.push(`${tag}: a read-off item is level 2`);
    if (SKIPPED[a.lo]) problems.push(`${tag}: the objective has items and is also listed as skipped`);
    if (!NEW_KINDS.includes(a.spec.type)) problems.push(`${tag}: ${a.spec.type} is not one of the new kinds`);
    if (a.spec.type === 'bar_chart' && !(a.spec.params as P).series) problems.push(`${tag}: a bar chart of this batch is a grouped one (series)`);
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    const id = itemIdOf(obj.loId, a.q);
    const bad = (m: string) => problems.push(`${tag}: ${m}`);
    if (obj.existing.includes(a.q)) bad('the stem is that of an existing item of the objective');
    // Two items of one objective are drawn on different figures.
    const specKey = `${obj.loId}|${JSON.stringify(a.spec)}`;
    if (specsSeen.has(specKey)) bad(`the figure is the same as that of ${specsSeen.get(specKey)}`);
    specsSeen.set(specKey, tag);

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
      const places = (answer.split('.')[1] ?? '').length;
      if (a.ck) {
        derivation = { checker: a.ck[0], args: a.ck[1] };
        const d = runChecker(a.spec, derivation);
        proofKind = 'checker';
        proofHow = `figure-core checker ${a.ck[0]} ${JSON.stringify(a.ck[1])}`;
        proofResult = derivedText(d);
        // A rounded checker value needs a key with at least one decimal (the key must survive ordinary rounding).
        if (!a.o && d.kind === 'number' && (d as { approx?: boolean }).approx && places === 0) bad(`the checker value ${proofResult} is rounded — the key needs at least one decimal (or make the item mcq)`);
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
          const num = Number(v);
          const ok = Number.isFinite(num) && (near(num, stated) || (places > 0 && Math.abs(num - stated) <= 0.5 * 10 ** -places + 1e-9));
          if (!ok) bad(`stated key ${answer}, computed ${v}`);
          // A key that is not the exact value must carry a decimal and the stem must say how to round.
          if (Number.isFinite(num) && !near(num, stated) && !/decimal|nearest|significant|round/i.test(a.q)) bad(`the key ${answer} is a rounding of ${v} and the stem does not say how to round`);
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
      // For the author's eye (not a stop): a numeric key, or the text of the right option, that the figure or its alt prints as it stands.
      const printedText = `${[...figure.svg.matchAll(/<text[^>]*>([^<]*)</g)].map((m) => m[1]).join(' | ')} | ${alt}`;
      const keyRe = new RegExp(`(?<![\\d.])${keyText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/^-/, '[−-]')}(?![\\d.]*\\d)`);
      if (keyText.length >= (a.o ? 3 : 1) && keyRe.test(printedText)) notes.push(`${tag}: the key text "${keyText}" also appears in what the figure / alt prints — check that it is not the answer given away`);

      rows.push({
        id, topic: obj.skill, topicId: obj.skill, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-5 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, kind: a.spec.type, variant: variantOf(a.spec), format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(variantOf(a.spec))} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by an earlier figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) if (kinds.length > CAP_PER_OBJECTIVE) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${CAP_PER_OBJECTIVE}`);
  for (const short of Object.keys(SKIPPED)) if (!byShort.get(short) || !surveyKindOf.has(byShort.get(short)!.loId)) problems.push(`${short}: listed as skipped but is not a surveyed objective`);
  for (const lo of surveyKindOf.keys()) if (!perLo.has(lo) && !SKIPPED[shortOf(lo)] && !wip) problems.push(`${shortOf(lo)}: a surveyed objective with no item and no reason for skipping it`);

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  /** Every surveyed objective: what it gains, or why it gains nothing. */
  const mapping = [...surveyKindOf.entries()].map(([lo, surveyKind]) => {
    const o = objectives.get(lo);
    const mine = meta.filter((m) => m.lo.loId === lo);
    const base = { loId: lo, surveyKind, subject: o?.subject, skill: o?.skill, objective: o?.description, pack: o?.pack };
    if (mine.length) return { ...base, status: 'covered', newItems: mine.length, newLevels: mine.map((m) => m.item.d).sort().join(','), newKinds: [...new Set(mine.map((m) => variantOf(m.item.spec)))].join(', '), formats: mine.map((m) => m.format).join(','), tasks: mine.map((m) => m.item.t), ids: mine.map((m) => m.id) };
    if (SKIPPED[shortOf(lo)]) return { ...base, status: 'skipped', note: SKIPPED[shortOf(lo)] };
    return { ...base, status: 'not-covered', note: 'no item yet (work in progress)' };
  });
  const coverage = survey.map((r) => {
    const ms = mapping.filter((m) => m.surveyKind === r.kind);
    return { surveyKind: r.kind, surveyObjectives: r.count, covered: ms.filter((m) => m.status === 'covered').length, skipped: ms.filter((m) => m.status === 'skipped').length, notCovered: ms.filter((m) => m.status === 'not-covered').length, items: meta.filter((m) => surveyKindOf.get(m.lo.loId) === r.kind).length };
  });
  const summary = {
    generatedAt: now,
    items: rows.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byKindAndVariant: count(meta, (m) => variantOf(m.item.spec)),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    byDifficulty: count(meta, (m) => `level ${m.item.d}`),
    bySubjectAndDifficulty: count(meta, (m) => `${m.lo.subject} · level ${m.item.d}`),
    asks: count(meta, (m) => m.item.need),
    surveyedObjectives: {
      rule: 'the objectives the survey (practice-figures-2026-10-14-batch4/survey.json) lists under the kinds whose decision is "built"',
      total: surveyKindOf.size,
      covered: mapping.filter((m) => m.status === 'covered').length,
      skipped: Object.fromEntries(mapping.filter((m) => m.status === 'skipped').map((m) => [shortOf(m.loId), (m as { note: string }).note])),
      coverageBySurveyKind: coverage,
    },
    paramsNeededAndNotThere: MISSING_PARAMS,
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKindAndVariant: summary.byKindAndVariant, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, coverage }, null, 1));
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
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch5${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'covered-objectives.json'), JSON.stringify(mapping.filter((m) => m.status === 'covered'), null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch5-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch5-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-5 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-5 figure practice items — ${rows.length} items on the new figure kinds</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  // sharp is a dependency of the app (resolved from the working directory, apps/tutor).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = createRequire(path.join(process.cwd(), 'package.json'))('sharp') as any;
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
      index.push(`#${s + k + 1} [${variantOf((r.figure as { spec: Spec }).spec)}] ${r.id}`);
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
