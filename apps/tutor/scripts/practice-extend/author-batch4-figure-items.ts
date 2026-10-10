/**
 * Hand-authored practice items that are read off a FIGURE — batch 4.
 *
 * Harder items (level 3, a few level 4) for the objectives whose released
 * figure items are ALL level 1–2 ("low-level only": every figure row of the
 * objective in release-2026-10-15/figure-rows-428.json has difficulty ≤ 2).
 * Two items an objective, each on a NEW figure (not the spec of any released
 * figure item of that objective); three for the slope-field objective.
 *
 * What makes an item level 3 here — at least two of: two separate readings
 * combined; a reading that must be interpreted through the objective's idea
 * before it is used; a choice between cases that the figure decides; working
 * backwards from a stated result to a feature of the figure; finding which of
 * four statements about the figure is false; comparing two curves / lanes /
 * structures. Level 4: an unfamiliar context, a limiting case, a composite
 * step or a conditional that is not routine for the course.
 *
 * Same pattern, rules and output layout as author-batch3-figure-items.ts.
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
 * here), the audited ids, the mapping of the low-level-only objectives, a
 * gallery page, PNGs at the 340 px column (2×), contact sheets and a summary.
 *
 * Slope fields: figure-core may still refuse the kind (`RENDERER_NEEDS_WORK`);
 * as in author-slope-field-items.ts the kind-level stop is lifted for this
 * run only, and every slope-field key is computed from the field's own
 * equation in the spec.
 *
 * No database, no network, no model. Run:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch4-figure-items.ts [--out <dir>] [--check] [--wip] [--list-objectives]
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
import { RENDERER_NEEDS_WORK, canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type Derived, type FigureItem } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-14-items`;
/** The released figure rows: which objectives hold figure items, and at what level. */
const ROWS_428 = `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`;
/** The CURRENT lesson packs (lesson text and every existing item). */
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×
/** The slope-field objective: three items (the brief), every other objective two. */
const SLOPE_LO = 'c898192b.lo-1';

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
const pieces = (c: Ctx): Piece[] => arr(c.p.curves).map((k) => { const d = (k.domain as number[] | undefined) ?? (c.p.xRange as number[]); return { f: compileExpression(k.expr as string), a: d[0], b: d[1], from: (k.from as string) ?? 'none', to: (k.to as string) ?? 'none' }; });
const fOf = (c: Ctx, i = 0): ((x: number) => number) => pieces(c)[i].f;
/** The drawn function just left / just right of x (the piece whose domain reaches x from that side). */
const leftLim = (ps: Piece[], x: number): number => { const p = ps.find((k) => k.a < x - 1e-9 && x <= k.b + 1e-9); if (!p) throw new Error(`nothing drawn left of ${x}`); return round(p.f(x - 1e-9), 6); };
const rightLim = (ps: Piece[], x: number): number => { const p = ps.find((k) => k.a <= x + 1e-9 && x < k.b - 1e-9); if (!p) throw new Error(`nothing drawn right of ${x}`); return round(p.f(x + 1e-9), 6); };
/** The value AT x: a filled marked point there, else the piece that includes x with a closed (or interior) end. */
const valueAt = (c: Ctx, x: number, curves?: number[]): number => {
  const dot = arr(c.p.points ?? []).find((d) => near(d.x as number, x) && !d.open);
  if (dot) return dot.y as number;
  const ps = pieces(c).filter((_, i) => !curves || curves.includes(i));
  const p = ps.find((k) => (k.a < x - 1e-9 && x < k.b - 1e-9) || (near(k.a, x) && k.from !== 'open') || (near(k.b, x) && k.to !== 'open'));
  if (!p) throw new Error(`no value at ${x}`);
  return round(p.f(x), 6);
};
const extremum = (c: Ctx, curve: number, which: 'max' | 'min', want: 'value' | 'x' = 'value'): number => c.num('curve_extremum', { curve, which, want });

/** Unit circle. */
const ucircle = (angles: P[], extra: P = {}): Spec => S('unit_circle', { angles, ...extra });
const degOf = (c: Ctx, i: number): number => arr(c.p.angles)[i].degrees as number;
const sinD = (d: number): number => Math.sin(rad(d));
const cosD = (d: number): number => Math.cos(rad(d));

/** Complex plane and polar grid. */
const cplane = (points: P[], extra: P = {}): Spec => S('polar_complex', { plane: 'complex', range: 6, step: 1, points, ...extra });
const polar = (points: P[], extra: P = {}): Spec => S('polar_complex', { plane: 'polar', rMax: 6, rStep: 1, angleStep: 30, points, ...extra });
type Z = [number, number];
/** A plotted point as [re, im] (a polar point converted), by its label. */
const zOf = (c: Ctx, label: string): Z => { const q = arr(c.p.points).find((x) => x.label === label); if (!q) throw new Error(`no point ${label}`); return q.re !== undefined ? [q.re as number, q.im as number] : [round((q.r as number) * cosD(q.theta as number), 9), round((q.r as number) * sinD(q.theta as number), 9)]; };
const zText = ([re, im]: Z): string => (im === 0 ? minus(re) : re === 0 ? `${minus(im === 1 ? '' : im === -1 ? '-' : im)}i` : `${minus(re)} ${im < 0 ? '−' : '+'} ${Math.abs(im) === 1 ? '' : Math.abs(im)}i`);

/** Triangles and circles. */
const tri = (params: P): Spec => S('geometric_figure', { shape: 'triangle', ...params });
const circle = (params: P): Spec => S('geometric_figure', { shape: 'circle', ...params });

/** Number lines. */
const nline = (min: number, max: number, extra: P): Spec => S('number_line', { min, max, step: 1, ...extra });
/** Does x belong to the set drawn? From the spec's own intervals. */
const inLine = (c: Ctx, x: number): boolean => arr(c.p.intervals).some((k) => (k.from === null || k.from === undefined || x > (k.from as number) || (x === k.from && !k.fromOpen)) && (k.to === null || k.to === undefined || x < (k.to as number) || (x === k.to && !k.toOpen)));
/** Is the set of the predicate the set drawn? Compared at every quarter unit of the line and well beyond both ends. */
const sameLineSet = (c: Ctx, pred: (x: number) => boolean): boolean => { for (let x = -60; x <= 60; x += 0.25) if (inLine(c, x) !== pred(x)) return false; return true; };

/** Normal curves. */
const normal = (mean: number, sd: number, shade: P[], extra: P = {}): Spec => S('distribution_curve', { mean, sd, axis: 'x', shade, ...extra });

/** Linear inequalities: a·x + b·y op c. */
interface Ineq { a: number; b: number; op: '<' | '<=' | '>' | '>='; c: number }
const regionI = (inequalities: Ineq[]): Spec => S('shaded_region', { xRange: [-5, 5], yRange: [-5, 5], xStep: 1, yStep: 1, region: { type: 'inequalities', inequalities } });
const sat = (k: Ineq, x: number, y: number): boolean => { const v = k.a * x + k.b * y; return k.op === '<' ? v < k.c - 1e-9 : k.op === '<=' ? v <= k.c + 1e-9 : k.op === '>' ? v > k.c + 1e-9 : v >= k.c - 1e-9; };
const ineqOf = (c: Ctx): Ineq => ((c.p.region as P).inequalities as Ineq[])[0];
/** Does the inequality shade exactly what the figure shades? Compared at every half-unit point of the plot. */
const sameHalfPlane = (c: Ctx, k: Ineq): boolean => { const mine = ineqOf(c); for (let x = -5; x <= 5; x += 0.5) for (let y = -5; y <= 5; y += 0.5) if (sat(mine, x, y) !== sat(k, x, y)) return false; return true; };
const inRegion = (c: Ctx, x: number, y: number): boolean => c.txt('region_contains', { x, y }) === 'yes';

/** Vectors: components (head minus tail) by label. */
const vecs = (xRange: [number, number], yRange: [number, number], vectors: P[], extra: P = {}): Spec => S('vector_diagram', { xRange, yRange, xStep: 1, yStep: 1, vectors, ...extra });
const V = (label: string, tail: Z, head: Z): P => ({ label, tail, head });
const vec = (c: Ctx, label: string): Z => { const i = arr(c.p.vectors).findIndex((x) => x.label === label); if (i < 0) throw new Error(`no vector ${label}`); return [c.num('vec_components', { vector: i, want: 'x' }), c.num('vec_components', { vector: i, want: 'y' })]; };
const parallel = (u: Z, v: Z): boolean => near(u[0] * v[1], u[1] * v[0]);
const vText = ([x, y]: Z): string => `⟨${minus(x)}, ${minus(y)}⟩`;
const pText = ([x, y]: Z): string => `(${minus(x)}, ${minus(y)})`;

/** Biology. */
const bio = (variant: string, params: P): Spec => S('bio_schematic', { variant, ...params });
const flow = (variant: string, params: P): Spec => S('flow_diagram', { variant, ...params });
const tree = (t: unknown, extra: P = {}): Spec => S('phylogenetic_tree', { tree: t, ...extra });
const pun = (top: string[], side: string[], extra: P = {}): Spec => S('punnett_square', { top, side, ...extra });
/** The genotypes of the cells of a Punnett square, from its gametes: per gene the upper-case allele first. */
const cellsOf = (c: Ctx): string[] => (c.p.side as string[]).flatMap((s) => (c.p.top as string[]).map((t) => [...t].map((ch, i) => [ch, [...s][i]].sort((x, y) => (x === y ? 0 : x < y ? -1 : 1)).join('')).join('')));
/** Pedigree: [id, sex, affected?, father?, mother?]. Numbered by the renderer: generation in Roman, left to right. */
type Ind = [string, 'M' | 'F', 0 | 1, string?, string?];
const ped = (inds: Ind[], extra: P = {}): Spec => S('pedigree', { individuals: inds.map(([id, sex, aff, father, mother]) => ({ id, sex, affected: aff === 1, ...(father ? { father, mother } : {}) })), ...extra });
interface Person { id: string; sex: string; affected: boolean; father?: string; mother?: string }
const people = (c: Ctx): Person[] => arr(c.p.individuals) as unknown as Person[];
const person = (c: Ctx, id: string): Person => { const q = people(c).find((x) => x.id === id); if (!q) throw new Error(`no individual ${id}`); return q; };
const childrenOf = (c: Ctx, id: string): Person[] => people(c).filter((k) => k.father === id || k.mother === id);
const parentsOf = (c: Ctx, id: string): Person[] => people(c).filter((k) => k.id === person(c, id).father || k.id === person(c, id).mother);
/** Full brothers / sisters: both have parents shown, and the same ones. */
const sibs = (c: Ctx, a: string, b: string): boolean => a !== b && !!person(c, a).father && person(c, a).father === person(c, b).father && person(c, a).mother === person(c, b).mother;

/** Slope fields: the field's own equation, compiled from the spec. */
const sfield = (expr: string, extra: P = {}): Spec => S('slope_field', { expr, xRange: [-3, 3], yRange: [-3, 3], xStep: 1, yStep: 1, gridStep: 1, ...extra });
type F2 = (x: number, y: number) => number;
const slopeFn = (expr: string): F2 => { const f = compileExpression(expr, ['x', 'y']); return (x, y) => f(x, y); };
/** Does the equation give the same slope as the field at every lattice point drawn? */
const sameField = (c: Ctx, g: F2): boolean => { const f = slopeFn(c.p.expr as string); const [x0, x1] = c.p.xRange as number[]; const [y0, y1] = c.p.yRange as number[]; const st = (c.p.gridStep as number) ?? 1; for (let x = x0; x <= x1 + 1e-9; x += st) for (let y = y0; y <= y1 + 1e-9; y += st) if (!near(f(x, y), g(x, y), 1e-6)) return false; return true; };

// ITEMS-BEGIN

// ════════════════════════════════════════════════════════════════════════════
// ALGEBRA 2
// ════════════════════════════════════════════════════════════════════════════

// ── Amplitude, Period, Midline in Trig (pack 000) ───────────────────────────

G('048bb219.lo-2', 'Amplitude when the midline is not the x-axis', [
  {
    t: 'signed coefficient from the highest and lowest points', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-1, 9], yRange: [-2, 5], curves: [{ expr: '1.5 - 2.5*cos(pi*x/2)' }] }),
    alt: 'A smooth wave on a grid that repeats along the x-axis. Its lowest points lie below the x-axis and its highest points well above it, so the wave is not centred on the x-axis.',
    q: 'The graph shown has an equation of the form y = a·cos(πx/2) + d. What is the value of a?',
    n: '-2.5',
    calc: ['half of (height at x = 0 minus height at x = 2), from the spec\'s own expression: cos is 1 at x = 0 and −1 at x = 2; checked against the curve\'s extremes (curve_extremum)', (c) => { const f = fOf(c); const a = (f(0) - f(2)) / 2; if (!near(Math.abs(a), (extremum(c, 0, 'max') - extremum(c, 0, 'min')) / 2)) throw new Error('|a| is not the amplitude'); return a; }],
    h: ['The size of a is the amplitude: half the vertical distance between the highest and the lowest points of the wave.', 'To find the sign of a, look at the wave at x = 0, where cos(πx/2) equals 1: is the wave at a top or at a bottom there?'],
    s: 'Read from the figure: the highest points are at y = 4 and the lowest at y = −1, so the amplitude is (4 − (−1)) / 2 = 2.5. At x = 0, where the cosine is 1, the wave is at a lowest point, so a is negative: a = −2.5 (and d = 1.5).',
  },
  {
    t: 'ratio of the amplitudes of two waves with different midlines', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-1, 7], yRange: [-5, 4], curves: [{ expr: '2*sin(pi*x/2) + 1', label: 'f' }, { expr: '3*sin(pi*x/2) - 1', label: 'g', dashed: true }] }),
    alt: 'Two waves on one grid with the same period, a solid one called f and a dashed one called g. The dashed wave is taller from bottom to top and sits lower on the grid than the solid wave.',
    q: 'The graph shows two functions, f (solid) and g (dashed), with g(x) = k·f(x) + c for constants k > 0 and c. What is the value of k?',
    n: '1.5',
    calc: ['(max − min of g) ÷ (max − min of f), from curve_extremum', (c) => (extremum(c, 1, 'max') - extremum(c, 1, 'min')) / (extremum(c, 0, 'max') - extremum(c, 0, 'min'))],
    h: ['Adding the constant c moves a wave up or down but does not change its amplitude.', 'Find the amplitude of each wave from its own highest and lowest points; multiplying f by k multiplies its amplitude by k.'],
    s: 'Read from the figure: f runs between y = −1 and y = 3, so its amplitude is (3 − (−1)) / 2 = 2; g runs between y = −4 and y = 2, so its amplitude is (2 − (−4)) / 2 = 3. Multiplying by k scales the amplitude and adding c does not change it, so k = 3 / 2 = 1.5.',
  },
]);

G('048bb219.lo-4', 'Period from part of a cycle, and from two waves', [
  {
    t: 'coefficient B from half a cycle', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 6], yRange: [-3, 3], curves: [{ expr: '2*cos(pi*(x - 1)/3)' }] }),
    alt: 'Part of a wave on a grid covering x from 0 to 6: it climbs to one highest point, falls to one lowest point and starts to climb again. Less than two full cycles are visible.',
    q: 'The graph shown has an equation of the form y = 2·cos(B(x − 1)) with B > 0. What is the value of B, to two decimal places?',
    n: '1.05',
    calc: ['π ÷ (x of the lowest point − x of the highest point): the two are half a period apart (curve_extremum)', (c) => Math.PI / Math.abs(extremum(c, 0, 'min', 'x') - extremum(c, 0, 'max', 'x'))],
    h: ['From a highest point to the next lowest point is half a period, not a whole one.', 'Once you have the period P, use B = 2π / P.'],
    s: 'Read from the figure: the highest point is at x = 1 and the next lowest point at x = 4, half a period apart, so the period is 2 × 3 = 6. Then B = 2π / 6 = π / 3 ≈ 1.05.',
  },
  {
    t: 'when two waves of different period peak together again', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-1, 10], yRange: [-3, 3], curves: [{ expr: '2*cos(pi*x/3)', label: 'f' }, { expr: 'cos(pi*x/2)', label: 'g', dashed: true }] }),
    alt: 'Two waves on one grid, a taller solid one called f and a shorter dashed one called g, with different periods. Both have a highest point on the y-axis; the grid ends at x = 10.',
    q: 'The graph shows two periodic functions, f (solid) and g (dashed). Both have a maximum at x = 0. What is the smallest positive value of x at which both have a maximum again?',
    n: '12',
    calc: ['the first x > 0 (searched in steps of 0.5, to x = 60) where both of the spec\'s expressions equal their maximum values', (c) => { const [f, g] = [fOf(c, 0), fOf(c, 1)]; for (let x = 0.5; x <= 60; x += 0.5) if (near(f(x), f(0), 1e-9) && near(g(x), g(0), 1e-9)) return x; throw new Error('never'); }],
    h: ['Read the period of each wave separately: the distance from one maximum to the next.', 'Both waves are at a maximum together only at an x that is a whole number of periods of each — it may lie beyond the part of the graph that is drawn.'],
    s: 'Read from the figure: f has maxima at x = 0 and x = 6, so its period is 6; g has maxima at x = 0, 4 and 8, so its period is 4. Both are at a maximum when x is a multiple of 6 and of 4; the least common multiple is 12, just past the right-hand edge of the graph. The answer is x = 12.',
  },
]);

// ── Complex Number Operations (pack 007) ────────────────────────────────────

G('3e0e7ddf.lo-1', 'Properties of complex numbers read from the plane', [
  {
    t: 'find the false statement about plotted numbers', d: 3, need: 'reason',
    spec: cplane([{ re: 3, im: 2, label: 'u' }, { re: 3, im: -2, label: 'v' }, { re: 0, im: 4, label: 'w' }]),
    alt: 'Three points in the complex plane: u in the first quadrant, v directly below it in the fourth quadrant at the same distance from the real axis, and w on the positive imaginary axis.',
    q: 'Three complex numbers u, v and w are plotted in the complex plane shown. Which statement about them is FALSE?',
    o: [
      ['u − v is a real number', 'correct'],
      ['u + v is a real number', 'does not add the imaginary parts, which cancel'],
      ['u and v are complex conjugates', 'does not compare the two points across the real axis'],
      ['w is a pure imaginary number', 'takes a point on the vertical axis to have a real part'],
    ],
    holds: ['each statement tested on the plotted points (spec); the option answers the question when its statement is false', [
      (c) => { const [u, v] = [zOf(c, 'u'), zOf(c, 'v')]; return !(u[1] - v[1] === 0); },
      (c) => { const [u, v] = [zOf(c, 'u'), zOf(c, 'v')]; return !(u[1] + v[1] === 0); },
      (c) => { const [u, v] = [zOf(c, 'u'), zOf(c, 'v')]; return !(u[0] === v[0] && u[1] === -v[1]); },
      (c) => { const w = zOf(c, 'w'); return !(w[0] === 0 && w[1] !== 0); },
    ]],
    h: ['Write each plotted number in the form a + bi by reading its real part and its imaginary part.', 'A number is real when its imaginary part is 0; work out the imaginary part of the sum and of the difference.'],
    s: 'Read from the figure: u = 3 + 2i, v = 3 − 2i and w = 4i. u and v have the same real part and opposite imaginary parts, so they are conjugates; w has real part 0, so it is pure imaginary; u + v = 6 is real. But u − v = (3 − 3) + (2 − (−2))i = 4i, which is not real — that statement is false.',
  },
  {
    t: 'which power of i carries one plotted number to another', d: 3, need: 'reason',
    spec: cplane([{ re: 3, im: 2, label: 'z' }, { re: 2, im: -3, label: 'w' }], { range: 5 }),
    alt: 'Two points in the complex plane at the same distance from the origin: z in the first quadrant and w in the fourth quadrant.',
    q: 'The complex numbers z and w are plotted in the complex plane shown, and w = iⁿ·z for a positive whole number n. What is the smallest possible value of n?',
    n: '3',
    calc: ['multiply the plotted z by i repeatedly (spec) until the plotted w is reached', (c) => { let [a, b] = zOf(c, 'z'); const w = zOf(c, 'w'); for (let k = 1; k <= 4; k++) { [a, b] = [-b, a]; if (a === w[0] && b === w[1]) return k; } throw new Error('w is not a power of i times z'); }],
    h: ['Read z and w as a + bi, then multiply z by i once and simplify using i² = −1.', 'Keep multiplying by i until the result matches w; each multiplication is a quarter turn about the origin.'],
    s: 'Read from the figure: z = 3 + 2i and w = 2 − 3i. Multiply by i step by step: i·z = 3i + 2i² = −2 + 3i; i²·z = −z = −3 − 2i; i³·z = −i·z = 2 − 3i, which is w. So the smallest n is 3 (three quarter turns counter-clockwise).',
  },
]);

G('3e0e7ddf.lo-2', 'Adding and subtracting complex numbers read from the plane', [
  {
    t: 'solve for an unplotted number from three plotted ones', d: 3, need: 'calc',
    spec: cplane([{ re: 4, im: 1, label: 'z' }, { re: -2, im: 3, label: 'w' }, { re: 1, im: -4, label: 'p' }]),
    alt: 'Three points in the complex plane: z in the first quadrant close to the real axis, w in the second quadrant and p in the fourth quadrant.',
    q: 'The complex numbers z, w and p are plotted in the complex plane shown. A fourth number u, which is not plotted, satisfies z − w + u = p. What is u?',
    o: [['−5 − 2i', 'correct'], ['5 + 2i', 'solves for u with the wrong sign: z − w − p'], ['−1 − 8i', 'subtracts w instead of adding it back: p − z − w'], ['7 − 6i', 'adds z instead of subtracting it: p + z − w']],
    calc: ['p − z + w on the plotted points (spec)', (c) => { const [z, w, p] = [zOf(c, 'z'), zOf(c, 'w'), zOf(c, 'p')]; return zText([p[0] - z[0] + w[0], p[1] - z[1] + w[1]]); }],
    h: ['Rearrange the equation for u before you put any numbers in.', 'Read each plotted number as a + bi, then combine the real parts and the imaginary parts separately.'],
    s: 'Rearranging, u = p − z + w. Read from the figure: z = 4 + i, w = −2 + 3i and p = 1 − 4i. Real parts: 1 − 4 + (−2) = −5. Imaginary parts: −4 − 1 + 3 = −2. So u = −5 − 2i.',
  },
  {
    t: 'recover a number from a plotted sum and difference', d: 3, need: 'calc',
    spec: cplane([{ re: 5, im: 1, label: 's' }, { re: -1, im: 3, label: 'd' }]),
    alt: 'Two points in the complex plane: s in the first quadrant close to the real axis, and d in the second quadrant close to the imaginary axis.',
    q: 'For two complex numbers z and w, the sum s = z + w and the difference d = z − w are plotted in the complex plane shown; z and w themselves are not plotted. What is w?',
    o: [['3 − i', 'correct'], ['2 + 2i', 'finds z, half of s + d, instead of w'], ['6 − 2i', 'subtracts d from s but does not halve'], ['−3 + i', 'subtracts in the wrong order: half of d − s']],
    calc: ['(s − d) ÷ 2 on the plotted points (spec)', (c) => { const [s, d] = [zOf(c, 's'), zOf(c, 'd')]; return zText([(s[0] - d[0]) / 2, (s[1] - d[1]) / 2]); }],
    h: ['Subtract the equation d = z − w from the equation s = z + w: which of z and w is left?', 'Read s and d as a + bi and subtract real parts and imaginary parts separately; then remember the factor of 2.'],
    s: 'Subtracting, s − d = (z + w) − (z − w) = 2w, so w = (s − d) / 2. Read from the figure: s = 5 + i and d = −1 + 3i. Then s − d = 6 − 2i and w = 3 − i. (Check: z = (s + d) / 2 = 2 + 2i, and z + w = 5 + i.)',
  },
]);

// ── Trigonometric Functions Unit Circle (pack 011) ──────────────────────────

G('4ddfd4c0.lo-1', 'Coordinates of two special-angle points combined', [
  {
    t: 'product of coordinates of two marked points', d: 3, need: 'calc',
    spec: ucircle([{ degrees: 120, name: 'P' }, { degrees: 330, name: 'Q' }]),
    alt: 'A unit circle with two radii drawn to points on the circle, each labelled with its angle in standard position: P in the second quadrant and Q in the fourth quadrant. No coordinates are printed.',
    q: 'The unit circle shown marks two angles in standard position and the points P and Q where their terminal sides meet the circle. What is the x-coordinate of P multiplied by the y-coordinate of Q? Give your answer as a decimal.',
    n: '0.25',
    calc: ['cos of the first marked angle × sin of the second (spec), checked against uc_coordinates', (c) => { const x = c.txt('uc_coordinates', { angle: 0, want: 'x' }); const y = c.txt('uc_coordinates', { angle: 1, want: 'y' }); if (x !== '−1/2' || y !== '−1/2') throw new Error(`coordinates ${x}, ${y}`); return round(cosD(degOf(c, 0)) * sinD(degOf(c, 1)), 9); }],
    h: ['Each angle has a 30° or a 60° reference angle; use it to get the exact coordinates, then fix the signs from the quadrant.', 'The x-coordinate is negative in quadrant II and the y-coordinate is negative in quadrant IV.'],
    s: 'Read from the figure: P is at 120° (reference angle 60°, quadrant II), so P = (−1/2, √3/2); Q is at 330° (reference angle 30°, quadrant IV), so Q = (√3/2, −1/2). The x-coordinate of P is −1/2 and the y-coordinate of Q is −1/2; their product is (−1/2)(−1/2) = 1/4 = 0.25.',
  },
  {
    t: 'find the false statement about three marked points', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 60, name: 'P' }, { degrees: 135, name: 'Q' }, { degrees: 300, name: 'R' }]),
    alt: 'A unit circle with three radii drawn to points on the circle, each labelled with its angle in standard position: P in the first quadrant, Q in the second quadrant and R in the fourth quadrant. No coordinates are printed.',
    q: 'The unit circle shown marks three angles in standard position and the points P, Q and R where their terminal sides meet the circle. Which statement is FALSE?',
    o: [
      ['P and Q have the same y-coordinate', 'correct'],
      ['P and R have the same x-coordinate', 'takes the cosine to change sign below the x-axis'],
      ['The two coordinates of Q add up to 0', 'does not use the 45° reference angle of Q'],
      ['R is the reflection of P in the x-axis', 'does not compare 300° with −60°'],
    ],
    holds: ['each statement tested with uc_coordinates; the option answers the question when its statement is false', [
      (c) => !(c.txt('uc_coordinates', { angle: 0, want: 'y' }) === c.txt('uc_coordinates', { angle: 1, want: 'y' })),
      (c) => !(c.txt('uc_coordinates', { angle: 0, want: 'x' }) === c.txt('uc_coordinates', { angle: 2, want: 'x' })),
      (c) => !near(cosD(degOf(c, 1)) + sinD(degOf(c, 1)), 0),
      (c) => !(near(cosD(degOf(c, 0)), cosD(degOf(c, 2))) && near(sinD(degOf(c, 0)), -sinD(degOf(c, 2)))),
    ]],
    h: ['Write down the exact coordinates of all three points before judging any statement.', 'Two points are reflections of each other in the x-axis when their x-coordinates agree and their y-coordinates are opposite.'],
    s: 'Read from the figure: P is at 60°, so P = (1/2, √3/2); Q is at 135°, so Q = (−√2/2, √2/2); R is at 300°, so R = (1/2, −√3/2). P and R share the x-coordinate 1/2 and have opposite y-coordinates, so R is the reflection of P in the x-axis; the coordinates of Q add up to 0. But the y-coordinate of P is √3/2 and that of Q is √2/2 — they are different, so that statement is false.',
  },
]);

G('4ddfd4c0.lo-2', 'Sine and cosine from one coordinate and the quadrant', [
  {
    t: 'cosine from a given y-coordinate and the quadrant drawn', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 210, label: 'none', labelText: 'θ', arc: true, coords: 'blank_x' }]),
    alt: 'A unit circle with one angle θ in standard position, marked by an arc; its terminal side ends at a point in the third quadrant. The point\'s coordinates are printed with a question mark in place of the x-coordinate.',
    q: 'The unit circle shown gives one coordinate of the point where the terminal side of the angle θ meets the circle. What is the exact value of cos θ?',
    o: [['−√3/2', 'correct'], ['√3/2', 'finds the size of the missing coordinate but not its sign in quadrant III'], ['−1/2', 'gives the coordinate that is printed, which is sin θ'], ['1/2', 'takes the printed coordinate without its sign']],
    ck: ['uc_trig_value', { angle: 0, fn: 'cos' }],
    h: ['On the unit circle the y-coordinate of the point is sin θ and the x-coordinate is cos θ, and x² + y² = 1.', 'The size of the missing coordinate comes from x² + y² = 1; its sign comes from the quadrant the point is drawn in.'],
    s: 'Read from the figure: the point is (?, −1/2), so sin θ = −1/2, and it lies in quadrant III. From x² + (−1/2)² = 1, x² = 3/4, so x = ±√3/2. In quadrant III the x-coordinate is negative, so cos θ = −√3/2.',
  },
  {
    t: 'find the false statement about two angles with one coordinate each', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 120, label: 'none', labelText: 'α', coords: 'blank_x' }, { degrees: 330, label: 'none', labelText: 'β', coords: 'blank_y' }]),
    alt: 'A unit circle with two angles in standard position, α ending in the second quadrant and β ending in the fourth quadrant. For α the point\'s coordinates are printed with a question mark in place of x; for β with a question mark in place of y.',
    q: 'The unit circle shown gives one coordinate of the point for each of two angles, α and β. Which statement is FALSE?',
    o: [
      ['cos α + cos β is negative', 'correct'],
      ['sin α + sin β is positive', 'gives sin β the size of its printed coordinate'],
      ['sin α = cos β', 'does not read which printed coordinate is a sine and which a cosine'],
      ['cos α = sin β', 'gives one of the missing coordinates the wrong sign for its quadrant'],
    ],
    holds: ['each statement tested numerically on the two marked angles (spec), with uc_trig_value for the record; the option answers the question when its statement is false', [
      (c) => { c.txt('uc_trig_value', { angle: 0, fn: 'cos' }); c.txt('uc_trig_value', { angle: 1, fn: 'cos' }); return !(cosD(degOf(c, 0)) + cosD(degOf(c, 1)) < 0); },
      (c) => !(sinD(degOf(c, 0)) + sinD(degOf(c, 1)) > 0),
      (c) => !near(sinD(degOf(c, 0)), cosD(degOf(c, 1))),
      (c) => !near(cosD(degOf(c, 0)), sinD(degOf(c, 1))),
    ]],
    h: ['Fill in each missing coordinate first: its size from x² + y² = 1, its sign from the quadrant.', 'Then replace every sine by a y-coordinate and every cosine by an x-coordinate and test the statements one at a time.'],
    s: 'Read from the figure: for α the point is (?, √3/2) in quadrant II, so the missing x is −1/2: cos α = −1/2, sin α = √3/2. For β the point is (√3/2, ?) in quadrant IV, so the missing y is −1/2: cos β = √3/2, sin β = −1/2. Then sin α = cos β and cos α = sin β are true, and sin α + sin β = √3/2 − 1/2 is positive. But cos α + cos β = −1/2 + √3/2 ≈ 0.37 is positive, so "cos α + cos β is negative" is false.',
  },
]);

G('4ddfd4c0.lo-3', 'Tangent from coordinates on the unit circle', [
  {
    t: 'tangent from a given x-coordinate and the quadrant drawn', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 120, label: 'none', labelText: 'θ', arc: true, coords: 'blank_y' }]),
    alt: 'A unit circle with one angle θ in standard position, marked by an arc; its terminal side ends at a point in the second quadrant. The point\'s coordinates are printed with a question mark in place of the y-coordinate.',
    q: 'The unit circle shown gives one coordinate of the point where the terminal side of the angle θ meets the circle. What is the exact value of tan θ?',
    o: [['−√3', 'correct'], ['√3', 'finds the sizes of sine and cosine but loses the sign of the cosine'], ['−√3/3', 'divides the cosine by the sine'], ['−1/2', 'gives the printed coordinate, which is cos θ']],
    ck: ['uc_trig_value', { angle: 0, fn: 'tan' }],
    h: ['First find the missing y-coordinate from x² + y² = 1, choosing its sign from the quadrant the point is drawn in.', 'tan θ = sin θ / cos θ = y / x.'],
    s: 'Read from the figure: the point is (−1/2, ?) in quadrant II, so cos θ = −1/2. From (−1/2)² + y² = 1, y = ±√3/2, and in quadrant II the y-coordinate is positive: sin θ = √3/2. Then tan θ = (√3/2) / (−1/2) = −√3.',
  },
  {
    t: 'product of the tangents of two marked angles', d: 3, need: 'calc',
    spec: ucircle([{ degrees: 150, label: 'none', labelText: 'α', coords: 'show' }, { degrees: 240, label: 'none', labelText: 'β', coords: 'show' }]),
    alt: 'A unit circle with two angles in standard position, α ending in the second quadrant and β ending in the third quadrant. The exact coordinates of both points on the circle are printed beside them.',
    q: 'The unit circle shown gives the coordinates of the points where the terminal sides of two angles, α and β, meet the circle. What is the value of tan α × tan β?',
    n: '-1',
    calc: ['tan of the first marked angle × tan of the second (spec), with uc_trig_value for the record', (c) => { c.txt('uc_trig_value', { angle: 0, fn: 'tan' }); c.txt('uc_trig_value', { angle: 1, fn: 'tan' }); return round(Math.tan(rad(degOf(c, 0))) * Math.tan(rad(degOf(c, 1))), 9); }],
    h: ['For each point, the tangent is the y-coordinate divided by the x-coordinate; keep the signs.', 'Simplify each tangent to an exact value before multiplying — the square roots cancel.'],
    s: 'Read from the figure: the point for α is (−√3/2, 1/2), so tan α = (1/2) / (−√3/2) = −1/√3; the point for β is (−1/2, −√3/2), so tan β = (−√3/2) / (−1/2) = √3. The product is (−1/√3)(√3) = −1. (The two terminal sides are perpendicular, and tangent is the slope of the terminal side.)',
  },
]);

G('4ddfd4c0.lo-4', 'Reference angles for angles that are not special', [
  {
    t: 'cosine of a non-special angle from its reference angle', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 160, arc: true }]),
    alt: 'A unit circle with one angle in standard position, marked by an arc and labelled with its size in degrees; its terminal side ends in the second quadrant, close to the negative x-axis.',
    q: 'Use sin 20° ≈ 0.34 and cos 20° ≈ 0.94. What is the cosine of the angle marked on the unit circle shown, to two decimal places?',
    n: '-0.94',
    calc: ['cos of the marked angle (spec); its reference angle (uc_reference_angle) must be 20° and its quadrant (uc_quadrant) II', (c) => { if (c.num('uc_reference_angle', { angle: 0 }) !== 20 || c.txt('uc_quadrant', { angle: 0 }) !== 'II') throw new Error('not a 20° reference angle in quadrant II'); return round(cosD(degOf(c, 0)), 2); }],
    h: ['Find the reference angle: the acute angle between the terminal side and the x-axis.', 'The cosine of the marked angle has the same size as the cosine of its reference angle; decide the sign from the quadrant.'],
    s: 'Read from the figure: the angle is 160°, in quadrant II. Its reference angle is 180° − 160° = 20°, so the size of its cosine is cos 20° ≈ 0.94. In quadrant II the x-coordinate is negative, so cos 160° ≈ −0.94.',
  },
  {
    t: 'compare the sines and cosines of two angles with the same reference angle', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 200, name: 'P' }, { degrees: 340, name: 'Q' }]),
    alt: 'A unit circle with two radii drawn to points on the circle, each labelled with its angle in standard position: P in the third quadrant and Q in the fourth quadrant, both a little below the x-axis.',
    q: 'The unit circle shown marks two angles in standard position, ending at the points P and Q. How do the sines and the cosines of these two angles compare?',
    o: [
      ['Equal sines, opposite cosines', 'correct'],
      ['Opposite sines, equal cosines', 'reflects in the x-axis instead of the y-axis'],
      ['Equal sines, equal cosines', 'stops at the equal reference angles and ignores the quadrants'],
      ['Opposite sines, opposite cosines', 'takes the two points to be opposite ends of a diameter'],
    ],
    calc: ['signs of sin and cos of the two marked angles compared (spec); both reference angles (uc_reference_angle) must agree', (c) => { if (c.num('uc_reference_angle', { angle: 0 }) !== c.num('uc_reference_angle', { angle: 1 })) throw new Error('reference angles differ'); const [a, b] = [degOf(c, 0), degOf(c, 1)]; const rel = (u: number, v: number): string => (near(u, v) ? 'Equal' : near(u, -v) ? 'Opposite' : '?'); return `${rel(sinD(a), sinD(b))} sines, ${rel(cosD(a), cosD(b)).toLowerCase()} cosines`; }],
    h: ['Find the reference angle of each marked angle; compare the two.', 'With equal reference angles the sizes of the sines agree and the sizes of the cosines agree — so compare the signs, quadrant by quadrant.'],
    s: 'Read from the figure: the angles are 200° (quadrant III) and 340° (quadrant IV). Their reference angles are 200° − 180° = 20° and 360° − 340° = 20°, so their sines have the same size and so do their cosines. Sine is negative in both quadrants III and IV, so the sines are equal; cosine is negative in III and positive in IV, so the cosines are opposite.',
  },
]);

// ── Right-Triangle Trigonometric Ratios (pack 022) ──────────────────────────

G('869a59a5.lo-3', 'Inverse trigonometric functions: more than one angle', [
  {
    t: 'difference of the two acute angles from the two legs', d: 3, need: 'calc',
    spec: tri({ sides: [5, 12, 13], sideLabels: ['auto', 'auto', null], unit: 'cm' }),
    alt: 'A right triangle with its right angle marked and the lengths of the two shorter sides (the legs) printed, in centimetres; the longest side is not labelled and no acute angle is given.',
    q: 'In the right triangle shown, by how many degrees is the larger acute angle greater than the smaller acute angle? Give your answer to the nearest tenth of a degree.',
    n: '44.8',
    calc: ['|geo_angle(first vertex) − geo_angle(second vertex)|, the two acute angles', (c) => { const [a, b, r] = [c.num('geo_angle', { vertex: 0 }), c.num('geo_angle', { vertex: 1 }), c.num('geo_angle', { vertex: 2 })]; if (!near(r, 90, 1e-6)) throw new Error('the third vertex is not the right angle'); return round(Math.abs(a - b), 1); }],
    h: ['Only the two legs are given, so the inverse tangent is the function to use: tan of an acute angle is the opposite leg over the adjacent leg.', 'Once you have one acute angle, the other is its complement — you do not need a second inverse function.'],
    s: 'Read from the figure: the legs are 5 cm and 12 cm. The larger acute angle is opposite the longer leg: tan⁻¹(12/5) ≈ 67.4°. The two acute angles add up to 90°, so the smaller is about 22.6°. The difference is 67.4° − 22.6° ≈ 44.8°.',
  },
  {
    t: 'angle of an isosceles triangle by splitting it into right triangles', d: 3, need: 'calc',
    spec: tri({ sides: [12, 10, 10], sideLabels: ['auto', 'auto', 'auto'], unit: 'cm' }),
    alt: 'A triangle with two equal sides and a longer third side; the lengths of all three sides are printed, in centimetres. No angle is given and no right angle is marked.',
    q: 'The triangle shown has two equal sides. What is the measure of the angle between the two equal sides, to the nearest tenth of a degree?',
    n: '73.7',
    calc: ['geo_angle at the vertex opposite the unequal side', (c) => round(c.num('geo_angle', { vertex: 0 }), 1)],
    h: ['The line from the vertex between the equal sides to the midpoint of the third side cuts the triangle into two congruent right triangles.', 'In one of those right triangles you know the hypotenuse and the side opposite half of the angle you want.'],
    s: 'Read from the figure: the equal sides are 10 cm and the third side is 12 cm. The altitude to the 12 cm side splits the triangle into two right triangles, each with hypotenuse 10 cm and a 6 cm leg opposite half of the wanted angle. Half the angle is sin⁻¹(6/10) ≈ 36.87°, so the angle is about 2 × 36.87° ≈ 73.7°.',
  },
]);

G('869a59a5.lo-4', 'Trigonometric ratios: more than one side', [
  {
    t: 'perimeter from the hypotenuse and one acute angle', d: 3, need: 'calc',
    spec: tri({ asa: [40, 20 * Math.cos(rad(40)), 90], sideLabels: [null, 'auto', null], angleLabels: ['auto', null, null], unit: 'cm' }),
    alt: 'A right triangle with its right angle marked. One acute angle is labelled with its size in degrees and the longest side, the hypotenuse, with its length in centimetres; the two shorter sides are not labelled.',
    q: 'What is the perimeter of the right triangle shown, to the nearest tenth of a centimetre?',
    n: '48.2',
    calc: ['geo_perimeter', (c) => round(c.num('geo_perimeter'), 1)],
    h: ['Both legs are unknown: one needs the sine of the marked angle and the other its cosine.', 'Each leg is the hypotenuse multiplied by a ratio; add the two legs to the hypotenuse.'],
    s: 'Read from the figure: the hypotenuse is 20 cm and one acute angle is 40°. The leg opposite the 40° angle is 20 sin 40° ≈ 12.86 cm and the leg adjacent to it is 20 cos 40° ≈ 15.32 cm. The perimeter is 20 + 12.86 + 15.32 ≈ 48.2 cm.',
  },
  {
    t: 'base of an isosceles triangle from its equal sides and the angle between them', d: 3, need: 'calc',
    spec: tri({ asa: [70, 30 * Math.sin(rad(20)), 70], sideLabels: ['auto', 'auto', 'x'], angleLabels: [null, null, 'auto'], unit: 'm' }),
    alt: 'A triangle with two equal sides whose lengths are printed, in metres; the angle between them is labelled with its size in degrees, and the third side, opposite that angle, is labelled x. No right angle is marked.',
    q: 'The triangle shown has two equal sides. What is the length x, to the nearest tenth of a metre?',
    n: '10.3',
    calc: ['geo_side of the side labelled x', (c) => round(c.num('geo_side', { side: 2 }), 1)],
    h: ['The altitude from the labelled angle to the side x cuts the triangle into two congruent right triangles and cuts the angle in half.', 'In one right triangle, half of x is opposite half of the labelled angle, and the hypotenuse is one of the equal sides.'],
    s: 'Read from the figure: the equal sides are 15 m and the angle between them is 40°. The altitude to the side x bisects that angle and bisects x, giving a right triangle with hypotenuse 15 m and an angle of 20° opposite x/2. So x/2 = 15 sin 20° ≈ 5.13 m and x ≈ 10.3 m.',
  },
]);

// ── Absolute Value Equations and Inequalities (pack 027) ────────────────────

G('aaee386b.lo-3', 'From a solution set back to an absolute value inequality', [
  {
    t: 'match a bounded interval to its absolute value inequality', d: 3, need: 'reason',
    spec: nline(-6, 10, { intervals: [{ from: -3, to: 7, fromOpen: true, toOpen: true }] }),
    alt: 'A number line with one stretch drawn heavily between two open circles, one to the left of zero and one to the right of zero; the stretch is not centred on zero.',
    q: 'Which inequality has the solution set drawn on the number line shown?',
    o: [['|x − 2| < 5', 'correct'], ['|x + 2| < 5', 'gives the centre of the interval the wrong sign'], ['|x − 2| ≤ 5', 'includes the two end points, which are open circles'], ['|x − 5| < 2', 'exchanges the centre and the half-width']],
    holds: ['the solution set of each option compared with the set drawn (spec intervals) at every quarter unit; nl_interval_notation for the record', [
      (c) => { c.txt('nl_interval_notation'); return sameLineSet(c, (x) => Math.abs(x - 2) < 5); },
      (c) => sameLineSet(c, (x) => Math.abs(x + 2) < 5),
      (c) => sameLineSet(c, (x) => Math.abs(x - 2) <= 5),
      (c) => sameLineSet(c, (x) => Math.abs(x - 5) < 2),
    ]],
    h: ['|x − c| < r describes the numbers whose distance from c is less than r: an interval centred at c that reaches r to each side.', 'Find the midpoint of the interval drawn and the distance from the midpoint to either end; check whether the ends are included.'],
    s: 'Read from the figure: the set runs from −3 to 7 with open circles at both ends, so it is −3 < x < 7. Its midpoint is (−3 + 7) / 2 = 2 and each end is 5 away from the midpoint, so the set is the numbers less than 5 from 2: |x − 2| < 5. The open circles rule out ≤.',
  },
  {
    t: 'find the description that does not give the set drawn', d: 3, need: 'reason',
    spec: nline(-8, 6, { intervals: [{ from: null, to: -4, toOpen: false }, { from: 1, to: null, fromOpen: false }] }),
    alt: 'A number line with two heavy rays: one running left from a filled circle to the left of zero, and one running right from a filled circle to the right of zero. The gap between the two filled circles is not drawn heavily.',
    q: 'Three of these describe exactly the set drawn on the number line shown. Which one does NOT?',
    o: [['|x + 3/2| > 5/2', 'correct'], ['|2x + 3| ≥ 5', 'does not solve the inequality: 2x + 3 ≥ 5 or 2x + 3 ≤ −5'], ['x ≤ −4 or x ≥ 1', 'reads the filled circles as open'], ['(−∞, −4] ∪ [1, ∞)', 'takes a square bracket to leave the end point out']],
    holds: ['the set of each option compared with the set drawn (spec intervals) at every quarter unit; the option answers the question when the sets differ; nl_interval_notation for the record', [
      (c) => { c.txt('nl_interval_notation'); return !sameLineSet(c, (x) => Math.abs(x + 1.5) > 2.5); },
      (c) => !sameLineSet(c, (x) => Math.abs(2 * x + 3) >= 5),
      (c) => !sameLineSet(c, (x) => x <= -4 || x >= 1),
      (c) => !sameLineSet(c, (x) => x <= -4 || x >= 1),
    ]],
    h: ['Write the set drawn as a compound inequality first, paying attention to whether each circle is filled or open.', 'Solve each absolute value inequality and compare it, end points included, with what is drawn.'],
    s: 'Read from the figure: the set is everything up to and including −4, together with everything from 1 on: x ≤ −4 or x ≥ 1, which is (−∞, −4] ∪ [1, ∞). |2x + 3| ≥ 5 gives 2x + 3 ≤ −5 or 2x + 3 ≥ 5, that is x ≤ −4 or x ≥ 1 — the same set. |x + 3/2| > 5/2 gives x < −4 or x > 1: the same two rays but without their end points, so it is not the set drawn.',
  },
]);

// ── Normal Distribution and Z-Scores (pack 037) ─────────────────────────────

G('c4bf15cd.lo-1', 'The empirical rule on regions that are not symmetric', [
  {
    t: 'count of values in an asymmetric region', d: 3, need: 'calc',
    spec: normal(500, 100, [{ from: 300, to: 600 }]),
    alt: 'A bell-shaped normal curve over a number axis whose tick marks are one standard deviation apart. One region under the curve is shaded: it starts two tick marks to the left of the centre and ends one tick mark to the right of it.',
    q: 'The normal curve shown models the scores of 2000 students on a test; the tick marks are one standard deviation apart. According to the empirical rule (68–95–99.7), about how many of the students have a score in the shaded region?',
    n: '1630',
    calc: ['2000 × normal_shaded_area (empirical rule, as a proportion)', (c) => round(2000 * c.num('normal_shaded_area', { method: 'empirical', as: 'proportion' }), 6)],
    h: ['Find how many standard deviations each edge of the shaded region lies from the mean; the two edges are not the same distance away.', 'Split the region at the mean: half of 95% lies within two standard deviations on one side, and half of 68% within one on the other.'],
    s: 'Read from the figure: the mean is 500 and the standard deviation is 100, and the shaded region runs from 300 (two standard deviations below the mean) to 600 (one above). From 300 to 500 is half of 95%, or 47.5%; from 500 to 600 is half of 68%, or 34%. Together 81.5% of 2000 students, which is 0.815 × 2000 = 1630.',
  },
  {
    t: 'percent in two tails of unequal size', d: 3, need: 'calc',
    spec: normal(70, 5, [{ from: null, to: 60 }, { from: 75, to: null }]),
    alt: 'A bell-shaped normal curve over a number axis whose tick marks are one standard deviation apart. Two regions under the curve are shaded: the far left tail, and everything to the right of a point one tick mark above the centre.',
    q: 'The normal curve shown models a set of measurements; the tick marks are one standard deviation apart. According to the empirical rule (68–95–99.7), about what percent of the measurements lie in the two shaded regions together? Give a number without the percent sign.',
    n: '18.5',
    ck: ['normal_shaded_area', { method: 'empirical', as: 'percent' }],
    h: ['Work out each shaded tail separately: how many standard deviations from the mean does it start?', 'The part of the data outside a symmetric band is split equally between the two tails: (100% − 95%) / 2 beyond two standard deviations, (100% − 68%) / 2 beyond one.'],
    s: 'Read from the figure: the mean is 70 and the standard deviation is 5. The left region is everything below 60, two standard deviations below the mean: (100% − 95%) / 2 = 2.5%. The right region is everything above 75, one standard deviation above the mean: (100% − 68%) / 2 = 16%. Together 2.5% + 16% = 18.5%.',
  },
]);

G('c4bf15cd.lo-2', 'z-scores used in both directions', [
  {
    t: 'value from a negative z-score, with mean and standard deviation read from the axis', d: 3, need: 'calc',
    spec: normal(64, 6, [{ from: null, to: 52 }]),
    alt: 'A bell-shaped normal curve over a number axis whose tick marks are one standard deviation apart. The left tail of the curve is shaded, up to a tick mark two to the left of the centre.',
    q: 'The normal curve shown models a set of measurements; the tick marks are one standard deviation apart. One measurement in the shaded region has a z-score of −2.5. What is the value of that measurement?',
    n: '49',
    calc: ['mean + (−2.5) × standard deviation, both from the spec; the value must lie in the shaded region (normal_bound)', (c) => { const v = (c.p.mean as number) - 2.5 * (c.p.sd as number); if (!(v < c.num('normal_bound', { shade: 0, end: 'to', as: 'x' }))) throw new Error('not in the shaded region'); return v; }],
    h: ['Read the mean from the centre of the curve and the standard deviation from the spacing of the tick marks.', 'A z-score counts standard deviations from the mean, and a negative one lies below the mean: value = mean + z × standard deviation.'],
    s: 'Read from the figure: the curve is centred on 64, so the mean is 64, and the tick marks are 6 apart, so the standard deviation is 6. A z-score of −2.5 is 2.5 standard deviations below the mean: 64 − 2.5 × 6 = 64 − 15 = 49 (inside the shaded tail, which ends at 52).',
  },
  {
    t: 'carry an interval to another normal distribution by its z-scores', d: 3, need: 'calc',
    spec: normal(64, 6, [{ from: 58, to: 76 }]),
    alt: 'A bell-shaped normal curve over a number axis whose tick marks are one standard deviation apart. One region under the curve is shaded: it starts one tick mark to the left of the centre and ends two tick marks to the right of it.',
    q: 'The normal curve shown models one set of data; the tick marks are one standard deviation apart. A second set of data is normally distributed with mean 100 and standard deviation 15. Which interval of the second set has the same z-scores at its two ends as the shaded region?',
    o: [['85 to 130', 'correct'], ['94 to 112', 'keeps the distances from the mean in the units of the first set'], ['85 to 115', 'takes the shaded region to be symmetric about the mean'], ['70 to 130', 'uses a z-score of −2 at the left-hand end']],
    calc: ['100 + 15 × the z-score of each end of the shaded region (normal_bound as z)', (c) => `${100 + 15 * c.num('normal_bound', { shade: 0, end: 'from', as: 'z' })} to ${100 + 15 * c.num('normal_bound', { shade: 0, end: 'to', as: 'z' })}`],
    h: ['Convert each end of the shaded region to a z-score: (value − mean) / standard deviation, with the mean and standard deviation of the curve shown.', 'Then turn each z-score back into a value in the second set: mean + z × standard deviation.'],
    s: 'Read from the figure: the mean is 64 and the standard deviation is 6; the shaded region runs from 58 to 76. The z-scores of its ends are (58 − 64) / 6 = −1 and (76 − 64) / 6 = 2. In the second set these are 100 − 1 × 15 = 85 and 100 + 2 × 15 = 130. The interval is 85 to 130.',
  },
]);

// ── Systems of Linear Inequalities Solutions (pack 041) ─────────────────────

G('d6b8d6e7.lo-2', 'One linear inequality in standard form', [
  {
    t: 'match the graph to an inequality with a negative y-coefficient', d: 3, need: 'reason',
    spec: regionI([{ a: 2, b: -3, op: '>', c: 6 }]),
    alt: 'A coordinate grid with a dashed straight boundary line that rises from left to right and crosses the positive x-axis and the negative y-axis; the half-plane below and to the right of the line is shaded.',
    q: 'Which inequality has the solution set that is shaded in the graph shown?',
    o: [['2x − 3y > 6', 'correct'], ['2x − 3y < 6', 'keeps the inequality sign when dividing by the negative coefficient of y'], ['2x − 3y ≥ 6', 'reads the dashed boundary as part of the solution set'], ['3x − 2y > 6', 'exchanges the two intercepts of the boundary line']],
    holds: ['each option compared with the shaded half-plane (spec) at every half-unit point of the plot; region_contains at a test point and a boundary point for the record', [
      (c) => { inRegion(c, 3, -3); inRegion(c, 3, 0); return sameHalfPlane(c, { a: 2, b: -3, op: '>', c: 6 }); },
      (c) => sameHalfPlane(c, { a: 2, b: -3, op: '<', c: 6 }),
      (c) => sameHalfPlane(c, { a: 2, b: -3, op: '>=', c: 6 }),
      (c) => sameHalfPlane(c, { a: 3, b: -2, op: '>', c: 6 }),
    ]],
    h: ['Find the equation of the boundary from its two intercepts, then test one point that is clearly inside the shaded side.', 'A dashed boundary means the points on the line are not solutions.'],
    s: 'Read from the figure: the boundary crosses the axes at (3, 0) and (0, −2); both satisfy 2x − 3y = 6. The line is dashed, so the inequality is strict. Test a shaded point such as (3, −3): 2(3) − 3(−3) = 15, which is greater than 6. So the inequality is 2x − 3y > 6 (the same as y < (2/3)x − 2: dividing by −3 reverses the sign).',
  },
  {
    t: 'find the false statement about a shaded half-plane', d: 3, need: 'reason',
    spec: regionI([{ a: 3, b: -2, op: '<=', c: 6 }]),
    alt: 'A coordinate grid with a solid straight boundary line that rises steeply from left to right and crosses the positive x-axis and the negative y-axis; the half-plane above and to the left of the line is shaded.',
    q: 'The solution set of a linear inequality is shaded in the graph shown. Which statement is FALSE?',
    o: [
      ['The point (4, 1) is a solution', 'correct'],
      ['The point (2, 0) is a solution', 'takes a point on a solid boundary not to be a solution'],
      ['The boundary line has slope 3/2', 'computes run over rise'],
      ['The boundary line crosses the y-axis at −3', 'reads the x-intercept in place of the y-intercept'],
    ],
    holds: ['each statement tested on the spec\'s inequality (region_contains for the two points); the option answers the question when its statement is false', [
      (c) => !inRegion(c, 4, 1),
      (c) => !inRegion(c, 2, 0),
      (c) => { const k = ineqOf(c); return !near(-k.a / k.b, 3 / 2); },
      (c) => { const k = ineqOf(c); return !near(k.c / k.b, -3); },
    ]],
    h: ['Read two grid points on the boundary line to get its slope and its y-intercept.', 'To test a point, see which side of the boundary it lies on; a point on a solid boundary is itself a solution.'],
    s: 'Read from the figure: the boundary passes through (0, −3) and (2, 0), so it crosses the y-axis at −3 and its slope is (0 − (−3)) / (2 − 0) = 3/2. It is solid, so (2, 0), which lies on it, is a solution. The point (4, 1) lies below and to the right of the line (the line is at height 3 when x = 4), on the unshaded side, so it is not a solution — that statement is false.',
  },
]);

// ── Pythagorean Identity Applications (pack 049) ────────────────────────────

G('f2322089.lo-3', 'The quadrant decides the sign', [
  {
    t: 'cosine from sin² and the quadrant drawn', d: 3, need: 'reason',
    spec: ucircle([{ degrees: round(180 - (Math.asin(5 / 13) * 180) / Math.PI, 3), label: 'none', labelText: 'θ', arc: true }]),
    alt: 'A unit circle with one angle θ in standard position, marked by an arc; its terminal side ends in the second quadrant. Neither the size of the angle nor the coordinates of the point are printed.',
    q: 'For the angle θ drawn on the unit circle shown, sin²θ = 25/169. What is the exact value of cos θ?',
    o: [['−12/13', 'correct'], ['12/13', 'takes the positive square root without looking at the quadrant'], ['−5/13', 'gives sin θ with the sign that belongs to the cosine'], ['−13/12', 'gives the reciprocal, sec θ']],
    calc: ['± 12/13 from sin²θ + cos²θ = 1, the sign of the cosine taken from the angle drawn (spec; uc_quadrant must be II)', (c) => { if (c.txt('uc_quadrant', { angle: 0 }) !== 'II') throw new Error('not quadrant II'); const v = cosD(degOf(c, 0)); if (!near(Math.abs(v), 12 / 13, 1e-5)) throw new Error('the angle drawn does not have sin² = 25/169'); return `${v < 0 ? '−' : ''}12/13`; }],
    h: ['Use sin²θ + cos²θ = 1 to find cos²θ.', 'Taking a square root gives two candidates; the quadrant in which the terminal side is drawn tells you which one is right.'],
    s: 'From sin²θ + cos²θ = 1, cos²θ = 1 − 25/169 = 144/169, so cos θ = ±12/13. Read from the figure: the terminal side of θ lies in quadrant II, where the x-coordinate, and so the cosine, is negative. So cos θ = −12/13.',
  },
  {
    t: 'tangent from cos² and the quadrant drawn', d: 3, need: 'reason',
    spec: ucircle([{ degrees: round(180 + (Math.acos(8 / 17) * 180) / Math.PI, 3), label: 'none', labelText: 'θ', arc: true }]),
    alt: 'A unit circle with one angle θ in standard position, marked by an arc; its terminal side ends in the third quadrant. Neither the size of the angle nor the coordinates of the point are printed.',
    q: 'For the angle θ drawn on the unit circle shown, cos²θ = 64/289. What is the exact value of tan θ?',
    o: [['15/8', 'correct'], ['−15/8', 'gives only one of sine and cosine a negative sign'], ['8/15', 'divides the cosine by the sine'], ['−8/15', 'divides the cosine by the sine and gives only one of them a negative sign']],
    calc: ['sin θ / cos θ with both signs taken from the angle drawn (spec; uc_quadrant must be III)', (c) => { if (c.txt('uc_quadrant', { angle: 0 }) !== 'III') throw new Error('not quadrant III'); const d = degOf(c, 0); if (!near(Math.abs(cosD(d)), 8 / 17, 1e-5)) throw new Error('the angle drawn does not have cos² = 64/289'); return `${Math.tan(rad(d)) < 0 ? '−' : ''}15/8`; }],
    h: ['Use sin²θ + cos²θ = 1 to find the size of sin θ, then take the signs of both sin θ and cos θ from the quadrant drawn.', 'tan θ = sin θ / cos θ; think about what happens to the sign when both are negative.'],
    s: 'From sin²θ + cos²θ = 1, sin²θ = 1 − 64/289 = 225/289, so the sizes are |sin θ| = 15/17 and |cos θ| = 8/17. Read from the figure: the terminal side lies in quadrant III, where both coordinates are negative: sin θ = −15/17 and cos θ = −8/17. Then tan θ = (−15/17) / (−8/17) = 15/8, positive.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP BIOLOGY
// ════════════════════════════════════════════════════════════════════════════

/** Trees: the tips under the most recent common ancestor of the named tips, and how deep that ancestor is (root = 0). */
type T = string | { children: T[]; node?: string };
const tipsOf = (t: T): string[] => (typeof t === 'string' ? [t] : t.children.flatMap(tipsOf));
function mrca(t: T, names: string[], depth = 0): { tips: string[]; depth: number } {
  if (typeof t !== 'string') for (const k of t.children) if (names.every((n) => tipsOf(k).includes(n))) return mrca(k, names, depth + 1);
  if (!names.every((n) => tipsOf(t).includes(n))) throw new Error(`no such tips: ${names.join(', ')}`);
  return { tips: tipsOf(t).sort(), depth };
}
const anc = (c: Ctx, ...names: string[]): { tips: string[]; depth: number } => mrca(c.p.tree as T, names);
const sameAnc = (c: Ctx, a: string[], b: string[]): boolean => anc(c, ...a).tips.join('|') === anc(c, ...b).tips.join('|');
/** Is x more closely related to a than to b (a more recent common ancestor)? */
const closer = (c: Ctx, x: string, a: string, b: string): boolean => anc(c, x, a).depth > anc(c, x, b).depth;

/** Membranes: a solute's direction against its own gradient, from the spec. */
interface Sol { outside: number; inside: number; through?: number | 'bilayer'; arrow?: 'in' | 'out' | null; name?: string }
const sol = (c: Ctx, i: number): Sol => arr(c.p.solutes)[i] as unknown as Sol;
const proteinOf = (c: Ctx, i: number): string => { const s = sol(c, i); return s.through === 'bilayer' || s.through === undefined ? 'bilayer' : (arr(c.p.proteins)[s.through].type as string); };
/** 'down' when the arrow points to the side with fewer particles, 'against' when to the side with more. */
const gradientOf = (c: Ctx, i: number): 'down' | 'against' | 'none' => { const s = sol(c, i); if (!s.arrow || s.outside === s.inside) return 'none'; return (s.arrow === 'in') === (s.outside > s.inside) ? 'down' : 'against'; };
/** A movement that needs ATP: against the gradient (through the pump). One that needs a protein: anything not straight through the lipids. */
const needsATP = (c: Ctx, i: number): boolean => gradientOf(c, i) === 'against';
const needsProtein = (c: Ctx, i: number): boolean => proteinOf(c, i) !== 'bilayer';
const whichOf = (c: Ctx, test: (i: number) => boolean): string => { const [x, y] = [test(0), test(1)]; const [nx, ny] = [sol(c, 0).name!.replace('solute ', ''), sol(c, 1).name!.replace('solute ', '')]; return x && y ? `${nx} and ${ny}` : x ? `${nx} only` : y ? `${ny} only` : `Neither ${nx} nor ${ny}`; };

// ── Oxidative Phosphorylation and Chemiosmosis (pack 052) ───────────────────

G('03158f07.lo-3', 'The proton gradient and what happens when it is lost', [
  {
    t: 'predict the effect of a proton leak across the inner membrane', d: 3, need: 'reason',
    spec: bio('compartments', { organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: 'X', ions: 20 }, { id: 'matrix', label: 'Y', ions: 5 }], synthase: true }),
    alt: 'A mitochondrion drawn as two nested boxes with ATP synthase in the inner membrane. The outer space is labelled X and the inner space Y; one of the two spaces holds many more dots than the other.',
    q: 'The diagram shows a mitochondrion with its two spaces labelled X and Y; each dot is an H⁺ ion. A chemical is added that lets H⁺ ions leak freely across the inner membrane without passing through ATP synthase. What happens to the H⁺ ions in each space, and to the making of ATP by ATP synthase?',
    o: [
      ['X loses H⁺ and Y gains H⁺; ATP synthesis slows', 'correct'],
      ['X gains H⁺ and Y loses H⁺; ATP synthesis slows', 'has the ions leak up their concentration gradient'],
      ['X loses H⁺ and Y gains H⁺; ATP synthesis speeds up', 'takes any flow of H⁺ across the membrane to drive ATP synthase'],
      ['X gains H⁺ and Y loses H⁺; ATP synthesis speeds up', 'takes the leak to add to the gradient'],
    ],
    calc: ['the space with more H⁺ (compartment_gradient) loses ions down the gradient; with the gradient gone, less H⁺ passes through ATP synthase', (c) => { const hi = c.txt('compartment_gradient', { want: 'higher' }); const lo = c.txt('compartment_gradient', { want: 'lower' }); return `${hi} loses H⁺ and ${lo} gains H⁺; ATP synthesis slows`; }],
    h: ['Ions that can cross freely move from where they are more concentrated to where they are less concentrated; count the dots.', 'ATP synthase makes ATP only as H⁺ ions pass through it, driven by the difference between the two spaces.'],
    s: 'Read from the figure: space X holds 20 H⁺ ions and space Y only 5, so the gradient runs from X to Y. Through the leak the ions move down this gradient: X loses H⁺ and Y gains H⁺ until the two are alike. H⁺ that leaks does not pass through ATP synthase, and as the gradient collapses nothing drives ions through the enzyme, so ATP synthesis slows and stops.',
  },
  {
    t: 'how a change of pH in one space changes the gradient', d: 3, need: 'calc',
    spec: bio('compartments', { organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: null, pH: 7 }, { id: 'matrix', label: null, pH: 8 }], synthase: true }),
    alt: 'A mitochondrion drawn as two nested boxes with ATP synthase in the inner membrane. A pH value is printed in the outer space, the intermembrane space, and another in the inner space, the matrix; the spaces are not named on the figure.',
    q: 'The diagram shows the pH of the two spaces of a working mitochondrion: the outer one is the intermembrane space and the inner one is the matrix. Suppose the pH of the intermembrane space falls by one unit while the pH of the matrix stays as shown. How does the H⁺ gradient across the inner membrane change, and what happens to the rate of ATP synthesis?',
    o: [
      ['The gradient becomes 10 times steeper; ATP synthesis speeds up', 'correct'],
      ['The gradient becomes 2 times steeper; ATP synthesis speeds up', 'treats the pH scale as linear'],
      ['The gradient becomes 10 times shallower; ATP synthesis slows', 'takes a fall in pH to be a fall in H⁺ concentration'],
      ['The gradient disappears; ATP synthesis stops', 'has the two spaces come to the same pH'],
    ],
    calc: ['the ratio of H⁺ concentrations, 10 to the power of the pH difference (spec), before and after the intermembrane space drops one unit; the space with more H⁺ from compartment_gradient', (c) => { const sp = arr(c.p.spaces); const [ims, mat] = [sp[0].pH as number, sp[1].pH as number]; if (c.txt('compartment_gradient', { want: 'higher', as: 'name' }) !== 'intermembrane space') throw new Error('the intermembrane space is not the acidic side'); const [before, after] = [10 ** (mat - ims), 10 ** (mat - (ims - 1))]; return after > before ? `The gradient becomes ${after / before} times steeper; ATP synthesis speeds up` : `The gradient becomes ${before / after} times shallower; ATP synthesis slows`; }],
    h: ['A fall of one pH unit means a tenfold rise in H⁺ concentration.', 'Decide which space already has more H⁺, then ask whether the change makes the two spaces more different or more alike.'],
    s: 'Read from the figure: the intermembrane space is at pH 7 and the matrix at pH 8, so the intermembrane space already has 10 times more H⁺. If its pH falls to 6, its H⁺ concentration rises tenfold, to 100 times that of the matrix: the gradient becomes 10 times steeper. A steeper gradient drives H⁺ through ATP synthase faster, so ATP synthesis speeds up.',
  },
]);

// ── Phylogenetic Trees and Cladograms (pack 061) ────────────────────────────

G('42e27041.lo-4', 'Common ancestors of several pairs', [
  {
    t: 'find the pair that shares the same most recent common ancestor', d: 3, need: 'reason',
    spec: tree({ children: ['Shark', { children: ['Trout', { children: ['Frog', { children: [{ children: ['Lizard', 'Hawk'] }, { children: ['Mouse', 'Human'] }] }] }] }] }),
    alt: 'A branching tree with seven named tips, from top to bottom: Shark, Trout, Frog, Lizard, Hawk, Mouse, Human. Shark, Trout and Frog branch off one after another; the last four tips form two pairs that join each other.',
    q: 'On the phylogenetic tree shown, the most recent common ancestor of the hawk and the mouse is also the most recent common ancestor of which other pair?',
    o: [['The lizard and the human', 'correct'], ['The frog and the hawk', 'goes back one branch point too far'], ['The lizard and the hawk', 'takes the nearest branch point of one of the two animals'], ['The trout and the mouse', 'goes back two branch points too far']],
    holds: ['the tips under the most recent common ancestor of each pair compared with those under the ancestor of Hawk and Mouse (spec tree)', [
      (c) => sameAnc(c, ['Hawk', 'Mouse'], ['Lizard', 'Human']),
      (c) => sameAnc(c, ['Hawk', 'Mouse'], ['Frog', 'Hawk']),
      (c) => sameAnc(c, ['Hawk', 'Mouse'], ['Lizard', 'Hawk']),
      (c) => sameAnc(c, ['Hawk', 'Mouse'], ['Trout', 'Mouse']),
    ]],
    h: ['Trace back from the hawk and from the mouse until the two paths first meet; that branch point is their most recent common ancestor.', 'Do the same for each pair in the options and see which pair meets at the very same branch point.'],
    s: 'Read from the figure: tracing back from the hawk and from the mouse, the paths first meet at the branch point where the lizard–hawk pair joins the mouse–human pair. The lizard and the human also first meet at that branch point. The lizard and the hawk meet later (nearer the tips); the frog and the hawk, and the trout and the mouse, meet at earlier branch points.',
  },
  {
    t: 'find the false statement about relatedness when tip order misleads', d: 3, need: 'reason',
    spec: tree({ children: ['Salmon', { children: [{ children: [{ children: ['Lizard', 'Bird'] }, { children: ['Mouse', 'Human'] }] }, 'Frog'] }] }),
    alt: 'A branching tree with six named tips, from top to bottom: Salmon, Lizard, Bird, Mouse, Human, Frog. Salmon branches off first; Frog, drawn at the bottom, joins the branch that leads to the other four tips, which form two pairs.',
    q: 'Which statement about the phylogenetic tree shown is FALSE?',
    o: [
      ['The frog is more closely related to the human than to the bird', 'correct'],
      ['The bird is more closely related to the lizard than to the mouse', 'does not trace the bird back to its nearest branch point'],
      ['The mouse shares a more recent ancestor with the lizard than with the frog', 'judges by the distance between tips down the page'],
      ['The salmon is equally related to the frog and to the human', 'takes tips drawn far apart to be less related'],
    ],
    holds: ['depth of the most recent common ancestors compared (spec tree); the option answers the question when its statement is false', [
      (c) => !closer(c, 'Frog', 'Human', 'Bird'),
      (c) => !closer(c, 'Bird', 'Lizard', 'Mouse'),
      (c) => !closer(c, 'Mouse', 'Lizard', 'Frog'),
      (c) => !(anc(c, 'Salmon', 'Frog').depth === anc(c, 'Salmon', 'Human').depth),
    ]],
    h: ['Relatedness is read from how recently two tips share a branch point, not from how close together they are drawn.', 'For each statement, find the most recent common ancestor of each pair it mentions and compare which is more recent.'],
    s: 'Read from the figure: the frog joins the tree at the branch point from which the lizard, bird, mouse and human all descend, so its most recent common ancestor with the human is the same branch point as with the bird — it is equally related to both, although it is drawn next to the human. That statement is false. The bird and the lizard are a pair; the mouse and the lizard meet before either meets the frog; the salmon meets all the others at the root.',
  },
]);

// ── Energy Flow Through Ecosystems (pack 064) ───────────────────────────────

G('4c5ca766.lo-4', 'Productivity and transfer between levels', [
  {
    t: 'compare the net primary productivity of two ecosystems', d: 3, need: 'calc',
    spec: S('bar_chart', { categories: ['Forest GPP', 'Forest R', 'Marsh GPP', 'Marsh R'], values: [3000, 2200, 2400, 1200], yLabel: 'Energy (kJ/m² per year)', yMin: 0, yMax: 3500, yStep: 500 }),
    alt: 'A bar chart with four bars: gross primary productivity (GPP) and energy used in respiration by the producers (R), for a forest and for a marsh. In each ecosystem the GPP bar is taller than the R bar.',
    q: 'The bar chart shows, for a forest and for a marsh, the gross primary productivity (GPP) and the energy the producers use in respiration (R). By how many kJ/m² per year does the net primary productivity of the marsh exceed that of the forest?',
    n: '400',
    calc: ['(Marsh GPP − Marsh R) − (Forest GPP − Forest R), from bar_difference', (c) => c.num('bar_difference', { a: 'Marsh GPP', b: 'Marsh R' }) - c.num('bar_difference', { a: 'Forest GPP', b: 'Forest R' })],
    h: ['Net primary productivity is what is left of the gross primary productivity after the producers\' own respiration.', 'Work it out for each ecosystem separately before comparing — the ecosystem with the larger GPP need not have the larger NPP.'],
    s: 'Read from the figure: the forest has GPP 3000 and R 2200, so its NPP is 3000 − 2200 = 800 kJ/m² per year; the marsh has GPP 2400 and R 1200, so its NPP is 2400 − 1200 = 1200 kJ/m² per year. The marsh exceeds the forest by 1200 − 800 = 400 kJ/m² per year, even though its GPP is lower.',
  },
  {
    t: 'carry a transfer efficiency two levels up a pyramid', d: 3, need: 'calc',
    spec: flow('pyramid', { levels: [{ label: 'Producers', value: 25000 }, { label: 'Primary consumers', value: 5000 }, { label: 'Secondary consumers' }, { label: 'Tertiary consumers', value: 200, show: 'blank' }], unit: 'kJ' }),
    alt: 'An energy pyramid of four stacked bars, widest at the bottom: producers, primary consumers, secondary consumers and tertiary consumers. Energy values in kilojoules are printed on the two lowest bars; the top bar carries a question mark.',
    q: 'The pyramid shown gives the energy stored each year in two trophic levels of an ecosystem. If the same fraction of the energy passes from each level to the next all the way up, how much energy, in kJ, is stored in the tertiary consumers (the level marked with a question mark)?',
    n: '200',
    calc: ['the fraction passed on between the two printed levels (spec), applied twice more: flow_energy_at_level with that percent', (c) => { const lv = arr(c.p.levels); const pct = ((lv[1].value as number) / (lv[0].value as number)) * 100; return c.num('flow_energy_at_level', { level: 3, percent: pct }); }],
    h: ['First find what fraction of the producers\' energy reaches the primary consumers; it is not the usual 10% here.', 'The tertiary consumers are two transfers above the primary consumers, so apply the fraction twice.'],
    s: 'Read from the figure: the producers store 25000 kJ and the primary consumers 5000 kJ, so the fraction passed on is 5000 / 25000 = 0.2 (20%). The secondary consumers then store 0.2 × 5000 = 1000 kJ and the tertiary consumers 0.2 × 1000 = 200 kJ.',
  },
]);

// ── Light-Dependent Reactions Overview (pack 068) ───────────────────────────

G('6422897a.lo-6', 'Chemiosmosis across the thylakoid membrane', [
  {
    t: 'direction of proton flow and the side on which ATP forms', d: 3, need: 'reason',
    spec: bio('compartments', { organelle: 'chloroplast', spaces: [{ id: 'stroma', label: 'P', ions: 4 }, { id: 'thylakoid_lumen', label: 'Q', ions: 16 }], synthase: true }),
    alt: 'A chloroplast drawn as nested boxes with ATP synthase in the inner (thylakoid) membrane. The outer space is labelled P and the inner space Q; one of the two spaces holds many more dots than the other.',
    q: 'The diagram shows a chloroplast in the light with two of its spaces labelled P and Q; each dot is an H⁺ ion. In which direction do H⁺ ions flow through ATP synthase, and in which space is the new ATP released?',
    o: [
      ['From Q to P; ATP is released in P', 'correct'],
      ['From Q to P; ATP is released in Q', 'puts the ATP in the space the ions leave'],
      ['From P to Q; ATP is released in Q', 'has the ions flow up their concentration gradient'],
      ['From P to Q; ATP is released in P', 'has the ions flow up their gradient and the ATP form behind them'],
    ],
    calc: ['compartment_gradient: H⁺ flows from the space with more ions to the space with fewer; ATP forms on the side the ions flow to (the stroma)', (c) => { const from = c.txt('compartment_gradient', { want: 'flow_from' }); const to = c.txt('compartment_gradient', { want: 'flow_to' }); if (c.txt('compartment_gradient', { want: 'flow_to', as: 'name' }) !== 'stroma') throw new Error('the flow does not end in the stroma'); return `From ${from} to ${to}; ATP is released in ${to}`; }],
    h: ['H⁺ ions flow through ATP synthase down their concentration gradient; count the dots in each space.', 'The part of ATP synthase that makes ATP faces the space the ions flow into — the space where the Calvin cycle will use the ATP.'],
    s: 'Read from the figure: space Q, the inner space (the thylakoid lumen), holds 16 H⁺ ions and space P (the stroma) only 4. H⁺ flows down this gradient through ATP synthase, from Q to P. The catalytic head of ATP synthase is on the stroma side, so the ATP is released in P, where the Calvin cycle uses it.',
  },
  {
    t: 'correct a claim about pH and the direction of flow', d: 3, need: 'reason',
    spec: bio('compartments', { organelle: 'chloroplast', spaces: [{ id: 'stroma', pH: 8 }, { id: 'thylakoid_lumen', pH: 4 }], synthase: true }),
    alt: 'A chloroplast drawn as nested boxes with ATP synthase in the inner (thylakoid) membrane. The outer space is named stroma and the inner space thylakoid lumen; a pH value is printed in each space.',
    q: 'The diagram shows the pH of two spaces of a chloroplast in bright light. A student writes: "The stroma has the higher pH, so it holds more H⁺, and H⁺ flows from the stroma into the lumen through ATP synthase." Which statement corrects the student?',
    o: [
      ['The lumen has 10,000 times more H⁺; H⁺ flows from lumen to stroma', 'correct'],
      ['The lumen has 4 times more H⁺; H⁺ flows from lumen to stroma', 'treats the pH scale as linear'],
      ['The stroma has 10,000 times more H⁺; H⁺ flows from stroma to lumen', 'keeps the student\'s mistake that a higher pH means more H⁺'],
      ['The lumen has 10,000 times more H⁺; H⁺ flows from stroma to lumen', 'corrects the concentrations but leaves the flow running up the gradient'],
    ],
    calc: ['10 to the power of the pH difference (spec); direction from compartment_gradient', (c) => { const sp = arr(c.p.spaces); const ratio = 10 ** Math.abs((sp[0].pH as number) - (sp[1].pH as number)); const from = c.txt('compartment_gradient', { want: 'flow_from', as: 'name' }).replace('thylakoid ', ''); const to = c.txt('compartment_gradient', { want: 'flow_to', as: 'name' }).replace('thylakoid ', ''); return `The ${from} has ${ratio.toLocaleString('en-US')} times more H⁺; H⁺ flows from ${from} to ${to}`; }],
    h: ['A lower pH means a higher concentration of H⁺, and each pH unit is a factor of 10.', 'Ions flow through ATP synthase from the space where they are more concentrated to the space where they are less concentrated.'],
    s: 'Read from the figure: the stroma is at pH 8 and the thylakoid lumen at pH 4. The lower pH is the higher H⁺ concentration, and the difference of 4 pH units is a factor of 10⁴ = 10,000, so the lumen has 10,000 times more H⁺ than the stroma. H⁺ flows down this gradient through ATP synthase, from the lumen to the stroma.',
  },
]);

// ── Cell Cycle Phases and DNA Content (pack 073) ────────────────────────────

G('72b3b3de.lo-3', 'Stages of mitosis: order and events', [
  {
    t: 'between which two cells the sister chromatids separate', d: 3, need: 'reason',
    spec: bio('division', { n: 2, cells: [{ stage: 'telophase', label: 'W' }, { stage: 'metaphase', label: 'X' }, { stage: 'anaphase', label: 'Y' }, { stage: 'prophase', label: 'Z' }] }),
    alt: 'Four cells in different stages of mitosis, drawn in no particular order and labelled W, X, Y and Z, with their chromosomes drawn as sticks.',
    q: 'The four cells shown are in different stages of mitosis and are drawn in no particular order. The sister chromatids separate during the change from one of these cells to another. Which change is it?',
    o: [['From cell X to cell Y', 'correct'], ['From cell Z to cell X', 'places the separation where the chromosomes line up'], ['From cell Y to cell W', 'places the separation where the nuclei re-form'], ['From cell W to cell Z', 'runs the sequence from its last stage back to its first']],
    calc: ['the labels of the metaphase and the anaphase cells (bio_label_of); every drawn stage checked with division_stage', (c) => { for (const k of arr(c.p.cells)) if (c.txt('division_stage', { cell: k.label as string }) !== k.stage) throw new Error('stage mismatch'); return `From cell ${c.txt('bio_label_of', { part: 'metaphase' })} to cell ${c.txt('bio_label_of', { part: 'anaphase' })}`; }],
    h: ['Name the stage of each cell first: look at whether the chromosomes are scattered, lined up at the middle, moving apart, or gathered at the two ends.', 'The sister chromatids are still joined while the chromosomes are lined up at the middle of the cell.'],
    s: 'Read from the figure: in cell Z the replicated chromosomes are scattered (prophase); in cell X they are lined up at the middle (metaphase); in cell Y single chromatids are moving to opposite ends (anaphase); in cell W they are gathered at the two ends (telophase). The sister chromatids separate at the start of anaphase, that is, in the change from cell X to cell Y.',
  },
  {
    t: 'compare the chromosome counts of two stages', d: 3, need: 'calc',
    spec: bio('division', { n: 3, cells: [{ stage: 'anaphase', label: 'P' }, { stage: 'metaphase', label: 'Q' }] }),
    alt: 'Two cells of the same organism in different stages of mitosis, labelled P and Q, with their chromosomes drawn as sticks: X-shaped replicated chromosomes in one cell and single sticks moving apart in the other.',
    q: 'The diagram shows two cells of the same organism in different stages of mitosis. Counting one chromosome for each centromere, how many more chromosomes does cell P contain than cell Q?',
    n: '6',
    calc: ['division_count(chromosomes) of cell P minus that of cell Q', (c) => c.num('division_count', { cell: 'P', want: 'chromosomes' }) - c.num('division_count', { cell: 'Q', want: 'chromosomes' })],
    h: ['An X-shaped chromosome is two sister chromatids joined at one centromere, so it counts as one chromosome.', 'Once sister chromatids have separated, each one has its own centromere and counts as a chromosome.'],
    s: 'Read from the figure: cell Q (metaphase) has 6 X-shaped replicated chromosomes lined up at the middle — 6 centromeres, so 6 chromosomes. In cell P (anaphase) the sister chromatids have separated, and each of the 12 single chromatids now has its own centromere — 12 chromosomes. Cell P has 12 − 6 = 6 more.',
  },
]);

// ── Positive vs Negative Feedback Loops (pack 077) ──────────────────────────

G('8c600e3b.lo-3', 'Blood glucose as a signed feedback loop', [
  {
    t: 'the hidden sign of a loop and the kind of feedback', d: 3, need: 'reason',
    spec: flow('cycle', { nodes: [{ id: 'g', label: 'Blood glucose level' }, { id: 'i', label: 'Insulin secretion' }, { id: 'u', label: 'Glucose uptake by cells' }], steps: [{ sign: '+' }, { sign: '+' }, { sign: '−', blank: true }] }),
    alt: 'A loop of three boxes joined by arrows: blood glucose level, insulin secretion, glucose uptake by cells, and back to blood glucose level. Two arrows carry a plus sign in a small circle; the third carries a question mark.',
    q: 'In the loop shown, a + on an arrow means that an increase in the first quantity causes an increase in the second, and a − means that it causes a decrease. One sign is hidden. Which sign belongs there, and what kind of feedback does the completed loop show?',
    o: [['−; negative feedback', 'correct'], ['+; negative feedback', 'names the feedback from memory without working out the sign'], ['−; positive feedback', 'takes a loop with mostly + arrows to be positive feedback'], ['+; positive feedback', 'has glucose uptake by cells raise the blood glucose level']],
    calc: ['flow_blank (arrow) and flow_loop_sign', (c) => `${c.txt('flow_blank', { what: 'arrow' })}; ${c.txt('flow_loop_sign')} feedback`],
    h: ['Think about what happens to the amount of glucose left in the blood when cells take up more of it.', 'Follow a rise in blood glucose once round the loop: does it come back as a further rise or as a fall?'],
    s: 'Read from the figure: a rise in blood glucose increases insulin secretion (+), which increases glucose uptake by cells (+). When cells take up more glucose, less is left in the blood, so the hidden sign is −. Going once round the loop, a rise in blood glucose comes back as a fall: one − among the arrows makes the loop negative feedback.',
  },
  {
    t: 'locate the failing step of the loop in an unfamiliar disorder', d: 3, need: 'reason',
    spec: flow('cycle', { nodes: [{ id: 'g', label: 'Blood glucose rises' }, { id: 'b', label: 'Beta cells of pancreas' }, { id: 'i', label: 'Insulin in blood' }, { id: 'u', label: 'Body cells take up glucose' }], steps: ['P', 'Q', 'R', 'S'] }),
    alt: 'A loop of four boxes joined by arrows lettered P, Q, R and S in order: blood glucose rises; beta cells of pancreas; insulin in blood; body cells take up glucose; and back to the first box.',
    q: 'The loop shown summarises how the body lowers blood glucose after a meal; its arrows are lettered. In one disorder the pancreas works normally, but the body\'s cells no longer respond to insulin. Which arrow fails, and how do blood glucose and blood insulin compare with normal after a meal?',
    o: [
      ['Arrow R; glucose high, insulin high', 'correct'],
      ['Arrow R; glucose high, insulin low', 'does not follow the loop on: the working pancreas keeps answering the high glucose'],
      ['Arrow Q; glucose high, insulin low', 'describes a pancreas that cannot secrete insulin'],
      ['Arrow P; glucose low, insulin high', 'places the fault in the detection of glucose'],
    ],
    calc: ['the letter on the arrow from "Insulin in blood" to "Body cells take up glucose" (spec); with that arrow lost, glucose is not lowered and arrows P and Q keep running', (c) => { const nodes = arr(c.p.nodes); const i = nodes.findIndex((n) => n.id === 'i'); if (nodes[(i + 1) % nodes.length].id !== 'u') throw new Error('insulin does not lead to uptake'); return `Arrow ${(c.p.steps as string[])[i]}; glucose high, insulin high`; }],
    h: ['Find the arrow that stands for insulin acting on the body\'s cells.', 'Then follow the loop on from the break: what do the still-working beta cells do while blood glucose stays high?'],
    s: 'Read from the figure: arrow R runs from "Insulin in blood" to "Body cells take up glucose" — it is the response of the cells to insulin, the step that fails. The cells then do not take up glucose, so arrow S does not bring blood glucose down and it stays high. The pancreas still works, so arrows P and Q keep running: the beta cells keep detecting high glucose and keep secreting insulin. Both glucose and insulin are high.',
  },
]);

// ── Membrane Structure and Permeability (pack 087) ──────────────────────────

G('c1c96ad6.lo-1', 'Components of the membrane and what each does', [
  {
    t: 'find the false statement about labelled parts', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'channel', carbohydrate: true }, { type: 'peripheral' }], cholesterol: true, labels: [{ target: 'carbohydrate', label: 'I' }, { target: 'head', label: 'II' }, { target: 'tails', label: 'III' }, { target: 'channel', label: 'IV' }, { target: 'peripheral', label: 'V' }] }),
    alt: 'A cross-section of a cell membrane: two layers of phospholipids with short dark bars among the tails, a protein that passes through both layers and carries a branched chain on its outer end, and a protein that sits on one surface. Five parts are labelled I to V with leader lines.',
    q: 'The diagram shows part of a cell membrane with five of its parts labelled. Which statement is FALSE?',
    o: [
      ['Part V passes through both layers of the membrane', 'correct'],
      ['Part IV passes through both layers of the membrane', 'confuses the two kinds of protein drawn'],
      ['Part III is the hydrophobic region of the membrane', 'exchanges the heads and the tails of the phospholipids'],
      ['Part I is found on the outer face of the membrane only', 'takes carbohydrate chains to be on both faces'],
    ],
    holds: ['what each label marks (bio_identify) tested against the statement; the option answers the question when its statement is false', [
      (c) => !/channel|carrier|pump/.test(c.txt('bio_identify', { label: 'V' })),
      (c) => !/channel|carrier|pump/.test(c.txt('bio_identify', { label: 'IV' })),
      (c) => !/tails/.test(c.txt('bio_identify', { label: 'III' })),
      (c) => !/carbohydrate/.test(c.txt('bio_identify', { label: 'I' })),
    ]],
    h: ['Identify each labelled part first: a head, the tails, a carbohydrate chain, a protein that crosses the membrane, or a protein that sits on its surface.', 'A peripheral protein is attached to one surface; an integral (transmembrane) protein runs from one side to the other.'],
    s: 'Read from the figure: I is a carbohydrate chain (on the outer face only), II a phospholipid head, III the fatty acid tails (the hydrophobic interior), IV a protein that crosses both layers (a channel) and V a protein sitting on one surface (a peripheral protein). A peripheral protein does not pass through the membrane, so "Part V passes through both layers" is false.',
  },
  {
    t: 'identify the component removed from its effect on fluidity', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'carrier' }, { type: 'peripheral' }], cholesterol: true, labels: [{ target: 'tails', label: 'I' }, { target: 'cholesterol', label: 'II' }, { target: 'carrier', label: 'III' }, { target: 'head', label: 'IV' }] }),
    alt: 'A cross-section of a cell membrane: two layers of phospholipids with short dark bars among the tails, a protein that passes through both layers and a protein that sits on one surface. Four parts are labelled I to IV with leader lines.',
    q: 'A drug removes one labelled component from the membrane shown. Afterwards the membrane is more fluid than normal at high temperature and stiffer than normal at low temperature; transport through its proteins is unchanged. Which part did the drug remove?',
    o: [['Part II', 'correct'], ['Part I', 'takes the tails themselves to be removable without destroying the bilayer'], ['Part III', 'overlooks that transport through the proteins is unchanged'], ['Part IV', 'takes the heads to set the fluidity of the membrane']],
    calc: ['"Part " + the label of the cholesterol (bio_label_of)', (c) => `Part ${c.txt('bio_label_of', { part: 'cholesterol' })}`],
    h: ['One component of animal cell membranes acts as a buffer for fluidity: it restrains the phospholipids when it is warm and keeps them from packing tightly when it is cold.', 'Find that component in the figure: it sits among the fatty acid tails.'],
    s: 'Cholesterol buffers membrane fluidity: at high temperature it restrains the movement of the phospholipids, and at low temperature it keeps them from packing together. Losing it makes the membrane too fluid when warm and too stiff when cold, as described. Read from the figure: the short dark bars among the tails, labelled II, are the cholesterol. The answer is Part II.',
  },
]);

// ── Passive vs Active Transport Mechanisms (pack 091) ───────────────────────

G('d36f1900.lo-3', 'Facilitated diffusion: where it stops and what it needs', [
  {
    t: 'net number of particles that cross before equilibrium', d: 3, need: 'calc',
    spec: bio('membrane', { proteins: [{ type: 'channel' }], solutes: [{ outside: 12, inside: 4, through: 0, name: 'solute S' }] }),
    alt: 'A cross-section of a cell membrane with one channel protein. Particles of one solute are drawn on both sides of the membrane, more of them on one side than on the other; no arrow is drawn.',
    q: 'The diagram shows a solute, S, on the two sides of a cell membrane that contains an open channel protein for it; the number of particles drawn on each side shows the concentration there, and the two sides have equal volumes. By the time net movement stops, how many of the particles drawn must have crossed, in net terms, from one side to the other?',
    n: '4',
    calc: ['half the difference of the two counts (spec); the direction of net diffusion from membrane_net_movement', (c) => { const s = sol(c, 0); if (c.txt('membrane_net_movement') !== 'into the cell') throw new Error('not into the cell'); return (s.outside - s.inside) / 2; }],
    h: ['Through an open channel a solute diffuses until its concentration is the same on both sides — not until one side is empty.', 'Each particle that crosses lowers one count by one and raises the other by one.'],
    s: 'Read from the figure: there are 12 particles of S outside the cell and 4 inside, 16 in all. Facilitated diffusion through the channel continues until the concentrations are equal; with equal volumes that is 8 on each side. So 12 − 8 = 4 particles must cross, in net terms, into the cell (not 8, the difference between the sides).',
  },
  {
    t: 'which movements go on without ATP', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'channel' }, { type: 'channel' }], solutes: [{ outside: 10, inside: 3, through: 0, arrow: 'in', name: 'solute X' }, { outside: 3, inside: 11, through: 1, arrow: 'out', name: 'solute Y' }] }),
    alt: 'A cross-section of a cell membrane with two channel proteins. Two solutes, X and Y, are drawn as differently shaped particles on both sides of the membrane; an arrow through one channel points into the cell for X and an arrow through the other points out of the cell for Y.',
    q: 'The diagram shows two solutes, X and Y, crossing a cell membrane in the directions of the arrows; the number of particles drawn on each side shows the concentration there. A poison stops the cell from making ATP. Which of the two movements shown continues?',
    o: [['X and Y', 'correct'], ['X only', 'takes movement out of a cell to need energy'], ['Y only', 'reads the gradient of X the wrong way round'], ['Neither X nor Y', 'takes every movement through a protein to need ATP']],
    calc: ['the movements that run down their own gradient (spec counts and arrows), which need no ATP; membrane_transport for the record', (c) => { c.txt('membrane_transport', { solute: 0 }); c.txt('membrane_transport', { solute: 1 }); return whichOf(c, (i) => !needsATP(c, i)); }],
    h: ['For each solute separately, compare the side the arrow points to with the side where that solute is more concentrated.', 'Movement down a concentration gradient through a channel is facilitated diffusion; it uses no ATP, whichever way it runs.'],
    s: 'Read from the figure: X has 10 particles outside and 3 inside and moves in — toward the lower concentration. Y has 3 outside and 11 inside and moves out — also toward its lower concentration. Both move down their own gradients through channel proteins, which is facilitated diffusion and needs no ATP. Both movements continue.',
  },
]);

G('d36f1900.lo-7', 'With or against the gradient: what follows', [
  {
    t: 'for which solute the difference between the sides grows', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'channel' }, { type: 'pump' }], solutes: [{ outside: 4, inside: 12, through: 0, arrow: 'out', name: 'solute X' }, { outside: 5, inside: 11, through: 1, arrow: 'in', name: 'solute Y' }] }),
    alt: 'A cross-section of a cell membrane with a channel protein and a pump marked ATP. Two solutes, X and Y, are drawn as differently shaped particles on both sides; an arrow through the channel points out of the cell for X and an arrow through the pump points into the cell for Y.',
    q: 'The diagram shows two solutes, X and Y, crossing a cell membrane in the directions of the arrows; the number of particles drawn on each side shows the concentration there. As the movements continue, for which solute does the difference in concentration between the two sides increase?',
    o: [['Y only', 'correct'], ['X only', 'takes the arrow leaving the cell to be the one that runs against the gradient'], ['X and Y', 'takes any one-way movement to build up a difference'], ['Neither X nor Y', 'takes all transport to even out concentrations']],
    calc: ['the solutes whose arrow points to the side where they are already more concentrated (spec counts and arrows)', (c) => whichOf(c, (i) => gradientOf(c, i) === 'against')],
    h: ['For each solute, find the side with more particles and see whether the arrow points toward it or away from it.', 'Movement with the gradient evens the two sides out; movement against the gradient makes them more different.'],
    s: 'Read from the figure: X has 4 particles outside and 12 inside and moves out, toward the side with fewer — with its gradient, so its two sides become more alike. Y has 5 outside and 11 inside and moves in, toward the side that already has more — against its gradient, through the pump, so the difference grows. Only Y.',
  },
  {
    t: 'find the false statement about two movements', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'pump' }, { type: 'carrier' }], solutes: [{ outside: 12, inside: 3, through: 0, arrow: 'out', name: 'sodium ions' }, { outside: 10, inside: 2, through: 1, arrow: 'in', name: 'glucose' }] }),
    alt: 'A cross-section of a cell membrane with a pump marked ATP and a carrier protein. Sodium ions and glucose are drawn as differently shaped particles on both sides; an arrow through the pump points out of the cell for the sodium ions and an arrow through the carrier points into the cell for glucose.',
    q: 'The diagram shows sodium ions and glucose crossing a cell membrane in the directions of the arrows; the number of particles drawn on each side shows the concentration there. Which statement is FALSE?',
    o: [
      ['Left to run, the sodium movement makes the two sides more alike', 'correct'],
      ['Left to run, the glucose movement stops when the two sides are alike', 'takes carrier proteins to move solutes against a gradient'],
      ['Glucose moves toward the side where it is less concentrated', 'reads the glucose gradient the wrong way round'],
      ['Without ATP the sodium movement stops but the glucose movement goes on', 'takes both movements to depend on ATP'],
    ],
    holds: ['each statement tested on the spec (counts, arrows, proteins); the option answers the question when its statement is false', [
      (c) => !(gradientOf(c, 0) === 'down'),
      (c) => !(gradientOf(c, 1) === 'down'),
      (c) => !(gradientOf(c, 1) === 'down'),
      (c) => !(needsATP(c, 0) && !needsATP(c, 1) && proteinOf(c, 0) === 'pump'),
    ]],
    h: ['Decide for each solute whether its arrow points toward the side with more particles or the side with fewer.', 'Movement against a gradient needs ATP and increases the difference; movement with a gradient needs none and reduces it.'],
    s: 'Read from the figure: sodium has 12 ions outside and 3 inside and is moved out through the pump — toward the side that already has more, against its gradient, using ATP. That makes the two sides more different, not more alike, so that statement is false. Glucose has 10 particles outside and 2 inside and moves in through the carrier, toward the lower concentration: it needs no ATP and stops when the sides are alike.',
  },
]);

G('d36f1900.lo-8', 'What each kind of transport depends on', [
  {
    t: 'which movement survives the loss of the membrane proteins', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'pump' }], solutes: [{ outside: 11, inside: 3, through: 'bilayer', arrow: 'in', name: 'solute X' }, { outside: 9, inside: 3, through: 0, arrow: 'out', name: 'solute Y' }] }),
    alt: 'A cross-section of a cell membrane with one pump marked ATP. Two solutes, X and Y, are drawn as differently shaped particles on both sides; an arrow straight through the lipid layers points into the cell for X, and an arrow through the pump points out of the cell for Y.',
    q: 'The diagram shows two solutes, X and Y, crossing a cell membrane in the directions of the arrows; the number of particles drawn on each side shows the concentration there. A treatment inactivates every protein in the membrane but leaves the lipid bilayer and the supply of ATP unchanged. Which of the two movements shown continues?',
    o: [['X only', 'correct'], ['Y only', 'takes the supply of ATP to be enough without the pump'], ['X and Y', 'overlooks that Y crosses through a protein'], ['Neither X nor Y', 'takes every crossing of a membrane to need a protein']],
    calc: ['the solutes that cross straight through the lipids (spec), which need no protein; membrane_transport for the record', (c) => { if (c.txt('membrane_transport', { solute: 0 }) !== 'simple diffusion' || c.txt('membrane_transport', { solute: 1 }) !== 'active transport') throw new Error('not simple diffusion + active transport'); return whichOf(c, (i) => !needsProtein(c, i)); }],
    h: ['Look at the path of each arrow: through a protein, or straight through the lipid layers?', 'A solute that dissolves in the lipids and moves down its gradient needs neither a protein nor ATP.'],
    s: 'Read from the figure: X crosses straight through the lipid bilayer, from 11 particles outside to 3 inside — simple diffusion, which needs no protein and no ATP. Y is moved out through the pump, from 3 inside toward 9 outside — active transport, which needs the pump protein as well as ATP. With every protein inactivated, only the movement of X continues.',
  },
  {
    t: 'correct a diagram that shows transport against a gradient through a channel', d: 3, need: 'reason',
    spec: bio('membrane', { proteins: [{ type: 'channel' }], solutes: [{ outside: 3, inside: 11, through: 0, arrow: 'in', name: 'solute Z' }] }),
    alt: 'A cross-section of a cell membrane with one channel protein and no ATP marker. Particles of one solute are drawn on both sides, more of them on one side than on the other; an arrow through the channel points into the cell.',
    q: 'A student drew the diagram shown for the uptake of a solute, Z, by a cell; the number of particles drawn on each side shows the concentration there. The direction of the arrow is correct for this cell. What must be changed to make the diagram correct?',
    o: [
      ['The protein must be a pump supplied with ATP', 'correct'],
      ['The protein must be a carrier with no energy supply', 'takes a carrier to move a solute against its gradient unaided'],
      ['The protein must be removed and Z cross the lipids', 'takes simple diffusion to run against a gradient'],
      ['Nothing: a channel can carry Z in this direction', 'does not compare the arrow with the concentrations'],
    ],
    calc: ['the arrow against the counts (spec): movement toward the side with more particles is against the gradient, which only a pump with ATP can do', (c) => (gradientOf(c, 0) === 'against' && proteinOf(c, 0) === 'channel' ? 'The protein must be a pump supplied with ATP' : 'Nothing: a channel can carry Z in this direction')],
    h: ['Compare the direction of the arrow with the side on which Z is more concentrated.', 'Channels and carriers without an energy supply only let a solute move down its gradient.'],
    s: 'Read from the figure: there are 3 particles of Z outside the cell and 11 inside, and the arrow points into the cell — toward the higher concentration, against the gradient. A channel (or a carrier without energy, or the lipid bilayer) only allows movement down a gradient. Movement against a gradient is active transport, so the protein must be a pump supplied with ATP.',
  },
]);

// ── Mendelian Genetics Prediction (pack 093) ────────────────────────────────

G('e7dee353.lo-2', 'Genotype and phenotype: reasoning from the square', [
  {
    t: 'genotype and phenotype of the parent whose gametes are hidden', d: 3, need: 'reason',
    spec: pun(['T', 't'], ['t', 't'], { blankSide: [0, 1] }),
    alt: 'A Punnett square with two columns and two rows. The gametes of one parent are printed above the columns; the gametes of the other parent, beside the rows, are replaced by question marks. All four offspring genotypes are printed in the cells.',
    q: 'The Punnett square shown is for a cross between two pea plants; the allele T (tall) is completely dominant to t (short). The gametes of one parent are hidden. What are the genotype and the phenotype of that parent?',
    o: [['Homozygous recessive; short', 'correct'], ['Heterozygous; tall', 'gives the parent whose gametes are printed'], ['Homozygous dominant; tall', 'does not use the short offspring in the square'], ['Heterozygous; short', 'pairs a genotype with a phenotype it cannot have']],
    calc: ['the two hidden gametes joined (spec, checked with punnett_gamete); short only when no T is present', (c) => { const g = [c.txt('punnett_gamete', { edge: 'side', index: 0 }), c.txt('punnett_gamete', { edge: 'side', index: 1 })].sort().join(''); return `${g === 'tt' ? 'Homozygous recessive' : g === 'TT' ? 'Homozygous dominant' : 'Heterozygous'}; ${g.includes('T') ? 'tall' : 'short'}`; }],
    h: ['Each cell is the gamete above its column joined with the gamete beside its row; take the printed gamete away from a cell to see the hidden one.', 'Once you have both hidden gametes you have the parent\'s genotype; then ask whether it carries a dominant allele.'],
    s: 'Read from the figure: the printed gametes are T and t, and the cells are Tt and tt in each row. A cell Tt under the gamete T needs a t from the hidden parent, and a cell tt under t needs a t as well; this holds in both rows. So both hidden gametes are t: the parent is tt, homozygous recessive, and with no dominant allele its phenotype is short.',
  },
  {
    t: 'whether a phenotype fixes the genotype, with a probability', d: 3, need: 'reason',
    spec: pun(['T', 'T'], ['T', 't']),
    alt: 'A Punnett square with two columns and two rows. The gametes of both parents are printed along the top and down the side, and all four offspring genotypes are printed in the cells.',
    q: 'The Punnett square shown is for a cross between two tall pea plants; the allele T (tall) is completely dominant to t (short). One offspring is chosen at random. Can its genotype be told from its phenotype alone, and what is the probability that it is heterozygous?',
    o: [['No; 1/2', 'correct'], ['No; 2/3', 'uses the ratio among the tall offspring of a cross between two heterozygotes'], ['Yes; 0', 'takes every tall offspring of two tall parents to be TT'], ['Yes; 1/2', 'counts the cells but overlooks that two genotypes share one phenotype']],
    calc: ['the genotypes in the cells (spec gametes): every offspring is tall; the share that is Tt', (c) => { const cells = cellsOf(c); const tall = cells.filter((g) => g.includes('T')); const het = cells.filter((g) => g === 'Tt').length; const kinds = new Set(tall).size; if (tall.length !== 4) throw new Error('not all tall'); return `${kinds > 1 ? 'No' : 'Yes'}; ${het === 2 ? '1/2' : `${het}/4`}`; }],
    h: ['List the genotypes in the four cells and the phenotype each one gives.', 'If two different genotypes give the same phenotype, the phenotype alone cannot tell them apart.'],
    s: 'Read from the figure: the cells are TT, TT, Tt and Tt. All four offspring are tall, but two different genotypes, TT and Tt, give that one phenotype, so the genotype cannot be told from the phenotype alone. Two of the four equally likely cells are Tt, so the probability of a heterozygous offspring is 2/4 = 1/2 (not 2/3, which belongs to a cross between two heterozygotes).',
  },
]);

G('e7dee353.lo-6', 'Dihybrid squares: conditional and combined probabilities', [
  {
    t: 'share of the double-dominant offspring that are double heterozygotes', d: 3, need: 'calc',
    spec: pun(['RY', 'Ry', 'rY', 'ry'], ['RY', 'Ry', 'rY', 'ry']),
    alt: 'A Punnett square with four columns and four rows for two genes with alleles R, r and Y, y. The four gametes of each parent are printed along the top and down the side, and all sixteen offspring genotypes are printed in the cells.',
    q: 'The Punnett square shown is for a cross involving two genes that assort independently; R is completely dominant to r, and Y is completely dominant to y. Of the offspring that show both dominant traits, what fraction are heterozygous for both genes? Give your answer as a decimal to two decimal places.',
    n: '0.44',
    calc: ['cells RrYy ÷ cells with at least one R and one Y (spec gametes)', (c) => { const cells = cellsOf(c); const both = cells.filter((g) => g.includes('R') && g.includes('Y')); return both.filter((g) => g === 'RrYy').length / both.length; }],
    h: ['First count only the cells that show both dominant traits: they need at least one R and at least one Y.', 'Among those cells, count the ones whose genotype is RrYy; the fraction is taken out of the first count, not out of 16.'],
    s: 'Read from the figure: 9 of the 16 cells have at least one R and at least one Y, so they show both dominant traits. Of those 9, the cells RrYy lie on one diagonal of the square: 4 cells. The fraction is 4/9 ≈ 0.44.',
  },
  {
    t: 'probability of a mixed phenotype in a square that is not 4 by 4', d: 3, need: 'calc',
    spec: pun(['AB', 'Ab', 'aB', 'ab'], ['Ab', 'ab']),
    alt: 'A Punnett square with four columns and two rows for two genes with alleles A, a and B, b. Four gametes of one parent are printed along the top and two gametes of the other parent down the side; all eight offspring genotypes are printed in the cells.',
    q: 'The Punnett square shown is for a cross involving two genes that assort independently; A is completely dominant to a, and B is completely dominant to b. What is the probability that an offspring shows the dominant trait for gene A and the recessive trait for gene B? Give your answer as a decimal.',
    n: '0.375',
    calc: ['cells with at least one A and no B ÷ all cells (spec gametes)', (c) => { const cells = cellsOf(c); return cells.filter((g) => g.includes('A') && !g.includes('B')).length / cells.length; }],
    h: ['The wanted offspring have at least one A and are bb; count the cells that fit, out of all the cells in this square.', 'You can check with the product rule: the probability of the A phenotype times the probability of bb.'],
    s: 'Read from the figure: the square has 8 cells. The offspring wanted need at least one A and the genotype bb: the cells AAbb, Aabb (in the first row) and Aabb (in the second row) — 3 cells. The probability is 3/8 = 0.375. (Check: P(A_) = 3/4 and P(bb) = 1/2, and 3/4 × 1/2 = 3/8.)',
  },
]);

// ── Pedigree Analysis and Inheritance Patterns (pack 097) ───────────────────

const FAMILY: Ind[] = [
  ['f1', 'M', 1], ['m1', 'F', 0],
  ['w1', 'F', 0], ['s1', 'M', 0, 'f1', 'm1'], ['d2', 'F', 0, 'f1', 'm1'], ['d1', 'F', 1, 'f1', 'm1'], ['h1', 'M', 0],
  ['g1', 'F', 0, 's1', 'w1'], ['g2', 'M', 0, 's1', 'w1'], ['g3', 'M', 1, 'h1', 'd1'], ['g4', 'F', 1, 'h1', 'd1'], ['g5', 'M', 0, 'h1', 'd1'],
];

G('fc12780a.lo-1', 'Relationships traced through a pedigree', [
  {
    t: 'find the false statement about family relationships', d: 3, need: 'reason',
    spec: ped(FAMILY),
    alt: 'A pedigree of three generations: an affected man and an unaffected woman in generation I; their three children and two partners who married into the family in generation II; and five grandchildren in generation III, two from one couple and three from the other. Squares are males, circles females, filled symbols affected.',
    q: 'Which statement about the pedigree shown is FALSE?',
    o: [
      ['II-1 and II-4 are sisters', 'correct'],
      ['III-2 and III-5 are first cousins', 'does not trace both back to parents who are brother and sister'],
      ['I-2 is a grandmother of III-4', 'stops at the parents of III-4'],
      ['II-3 is an aunt of III-3', 'takes II-3 to have married into the family'],
    ],
    holds: ['each relationship tested on the parent links of the spec (II-1 = w1, II-2 = s1, II-3 = d2, II-4 = d1; III-2 = g2, III-3 = g3, III-4 = g4, III-5 = g5, as numbered on the figure); the option answers the question when its statement is false', [
      (c) => !sibs(c, 'w1', 'd1'),
      (c) => !(parentsOf(c, 'g2').some((x) => parentsOf(c, 'g5').some((y) => sibs(c, x.id, y.id)))),
      (c) => !(person(c, 'm1').sex === 'F' && parentsOf(c, 'g4').some((x) => x.mother === 'm1')),
      (c) => !(person(c, 'd2').sex === 'F' && parentsOf(c, 'g3').some((x) => sibs(c, x.id, 'd2'))),
    ]],
    h: ['Horizontal lines join partners; a vertical line down from a couple leads to their children; brothers and sisters hang from one horizontal line.', 'Find out which individuals in generation II are children of the first couple and which married into the family.'],
    s: 'Read from the figure: the children of I-1 and I-2 hang from one line: II-2, II-3 and II-4. II-1 is joined to II-2 only by a horizontal partner line, so she married into the family: she is the sister-in-law of II-4, not her sister — that statement is false. III-2 is a child of II-2 and III-5 a child of II-4, a brother and a sister, so they are first cousins; I-2 is the mother of II-4, who is the mother of III-4; II-3 is a sister of II-4, the mother of III-3.',
  },
  {
    t: 'count unaffected individuals who have an affected parent', d: 3, need: 'reason',
    spec: ped([...FAMILY.slice(0, 7), ['g1', 'F', 0, 's1', 'w1'], ['g3', 'M', 1, 'h1', 'd1'], ['g4', 'F', 0, 'h1', 'd1'], ['g5', 'M', 0, 'h1', 'd1']]),
    alt: 'A pedigree of three generations: an affected man and an unaffected woman in generation I; their three children and two partners who married into the family in generation II; and four grandchildren in generation III, one from one couple and three from the other. Squares are males, circles females, filled symbols affected.',
    q: 'In the pedigree shown, how many individuals are unaffected although at least one of their parents is affected?',
    n: '4',
    calc: ['unaffected individuals with an affected father or mother (spec)', (c) => people(c).filter((k) => !k.affected && parentsOf(c, k.id).some((q) => q.affected)).length],
    h: ['Leave out everyone whose parents are not shown: nothing is known about their parents.', 'Go through the children of each couple in turn, and check first whether either parent is a filled symbol.'],
    s: 'Read from the figure: I-1 is affected, and two of his three children, II-2 and II-3, are unaffected — that is two. II-4 is affected, and of her three children III-3 and III-4 are unaffected — two more. III-1 is unaffected but neither of her parents (II-1 and II-2) is affected, and I-2, II-1 and II-5 have no parents shown. The count is 2 + 2 = 4.',
  },
]);

G('fc12780a.lo-4', 'Genotypes that the pedigree forces', [
  {
    t: 'count the unaffected individuals who must be carriers', d: 3, need: 'reason',
    spec: ped([['a', 'M', 0], ['b', 'F', 0], ['s', 'M', 0, 'a', 'b'], ['d', 'F', 1, 'a', 'b'], ['h', 'M', 0], ['c1', 'F', 0, 'h', 'd'], ['c2', 'M', 1, 'h', 'd'], ['c3', 'M', 0, 'h', 'd']]),
    alt: 'A pedigree of three generations: two unaffected parents in generation I; their unaffected son and affected daughter, and the daughter\'s unaffected husband, in generation II; and the three children of that couple in generation III, one of them affected. Squares are males, circles females, filled symbols affected.',
    q: 'The pedigree shown follows an autosomal recessive trait. How many of the unaffected individuals in the pedigree must be heterozygous (carriers)?',
    n: '5',
    calc: ['unaffected individuals with an affected child or an affected parent (spec): each must carry one recessive allele; the chart must fit autosomal recessive inheritance (pedigree_mode_consistent)', (c) => { if (c.txt('pedigree_mode_consistent', { mode: 'autosomal_recessive' }) !== 'yes') throw new Error('not autosomal recessive'); return people(c).filter((k) => !k.affected && (parentsOf(c, k.id).some((q) => q.affected) || childrenOf(c, k.id).some((q) => q.affected))).length; }],
    h: ['An affected individual has two recessive alleles: one came from each parent, and one goes to every child.', 'An unaffected individual with an affected child or an affected parent must be heterozygous; for the others the pedigree does not decide.'],
    s: 'Read from the figure: the affected daughter in generation II (aa) received one a from each parent, so both unaffected parents in generation I are Aa. She passes an a to every child, so her two unaffected children in generation III are Aa. Her affected son received an a from his father too, so her unaffected husband is Aa. That is 2 + 2 + 1 = 5 certain carriers. Her unaffected brother may be AA or Aa, so he is not counted.',
  },
  {
    t: 'probability that a child is affected when one parent may be a carrier', d: 4, need: 'calc',
    spec: S('pedigree', { individuals: [
      { id: 'a', sex: 'M', affected: false }, { id: 'b', sex: 'F', affected: false },
      { id: 's', sex: 'M', affected: true, father: 'a', mother: 'b' }, { id: 'd', sex: 'F', affected: false, father: 'a', mother: 'b' }, { id: 'h', sex: 'M', affected: true },
      { id: 'k', sex: 'F', unknown: true, father: 'h', mother: 'd' },
    ] }),
    alt: 'A pedigree of three generations: two unaffected parents in generation I; their affected son and unaffected daughter, and the daughter\'s affected husband, in generation II; and one child of that couple in generation III, drawn with a question mark. Squares are males, circles females, filled symbols affected.',
    q: 'The pedigree shown follows an autosomal recessive trait. The phenotype of the individual in generation III, marked with a question mark, is not yet known. What is the probability that she is affected? Give your answer as a decimal to two decimal places.',
    n: '0.33',
    calc: ['P(mother is Aa, given she is unaffected and both her parents are Aa) × P(she passes a) = 2/3 × 1/2; the structure is checked on the spec', (c) => { const k = people(c).find((q) => (q as unknown as { unknown?: boolean }).unknown)!; const [fa, mo] = [person(c, k.father!), person(c, k.mother!)]; const gp = parentsOf(c, mo.id); if (!(fa.affected && !mo.affected && gp.length === 2 && gp.every((q) => !q.affected) && childrenOf(c, gp[0].id).some((q) => q.affected))) throw new Error('not the structure the key assumes'); return (2 / 3) * (1 / 2); }],
    h: ['The affected father can only pass on the recessive allele, so everything depends on what the mother passes on.', 'The mother is unaffected, and her parents are both carriers (they have an affected child): among their unaffected children, what fraction are carriers?'],
    s: 'Read from the figure: the father (generation II) is affected, aa, and always passes on a. The mother is unaffected; her brother is affected, so both of her parents are Aa. An unaffected child of Aa × Aa is AA, Aa or Aa with equal chances, so the mother is a carrier with probability 2/3. If she is a carrier she passes on a with probability 1/2. The child is affected with probability 2/3 × 1/2 = 1/3 ≈ 0.33.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PRECALCULUS
// ════════════════════════════════════════════════════════════════════════════

/** An exact value built from whole numbers, halves, √2 and √3, as the options print it ("−3", "5/2", "4√3", "3√3/2"). */
function ex(v: number): string {
  const sign = v < 0 ? '−' : '';
  const a = Math.abs(v);
  for (const [root, sym] of [[1, ''], [Math.sqrt(3), '√3'], [Math.sqrt(2), '√2']] as Array<[number, string]>) {
    for (const den of [1, 2]) {
      const k = (a / root) * den;
      if (near(k, Math.round(k), 1e-7) && Math.round(k) > 0) { const n = Math.round(k); return `${sign}${sym && n === 1 ? '' : n}${sym}${den === 2 ? '/2' : ''}`; }
    }
  }
  if (near(a, 0)) return '0';
  throw new Error(`no exact form for ${v}`);
}
/** a + bi with exact parts. */
const zExact = ([re, im]: Z): string => `${ex(re)} ${im < 0 ? '−' : '+'} ${ex(Math.abs(im)).replace(/^1$/, '')}i`;
/** A multiple of π as the options print it, from an angle in degrees ("5π/4"). */
const piOf = (degrees: number): string => { for (const den of [1, 2, 3, 4, 6, 9]) { const k = (degrees / 180) * den; if (near(k, Math.round(k), 1e-7)) return `${Math.round(k) === 1 ? '' : Math.round(k)}π${den === 1 ? '' : `/${den}`}`; } throw new Error(`no multiple of π for ${degrees}°`); };
/** The first x > 0 (in steps of 0.5) at which the expression repeats its value and its slope at 0: the period. */
const periodOf = (f: (x: number) => number): number => { for (let T = 0.5; T <= 60; T += 0.5) if ([0, 0.3, 1.1, 2.7].every((x) => near(f(x + T), f(x), 1e-7))) return T; throw new Error('no period found'); };
/** The value of a piecewise graph AT x, respecting open and closed ends. */
const evalF = (c: Ctx, x: number): number => { const p = pieces(c).find((k) => (k.a < x && x < k.b) || (near(k.a, x) && k.from !== 'open') || (near(k.b, x) && k.to !== 'open')); if (!p) throw new Error(`f is not defined at ${x}`); return p.f(x); };
/** The range of a graph drawn in pieces, as an interval: an end is closed when some piece attains it. */
function rangeOf(c: Ctx): { lo: number; hi: number; loIn: boolean; hiIn: boolean } {
  let [lo, hi] = [Infinity, -Infinity];
  const got: number[] = [];
  for (const p of pieces(c)) {
    const n = Math.round((p.b - p.a) * 1000);
    for (let i = 0; i <= n; i++) {
      const x = p.a + ((p.b - p.a) * i) / n;
      const y = round(p.f(x), 9);
      [lo, hi] = [Math.min(lo, y), Math.max(hi, y)];
      if ((i > 0 && i < n) || (i === 0 && p.from !== 'open') || (i === n && p.to !== 'open')) got.push(y);
    }
  }
  return { lo, hi, loIn: got.some((y) => near(y, lo)), hiIn: got.some((y) => near(y, hi)) };
}
const rangeText = (r: { lo: number; hi: number; loIn: boolean; hiIn: boolean }): string => `${r.loIn ? '[' : '('}${minus(r.lo)}, ${minus(r.hi)}${r.hiIn ? ']' : ')'}`;

// ── Finding and Verifying Inverse Functions (pack 259) ──────────────────────

G('04343a8c.lo-2', 'Restricting a domain so that the horizontal line test is passed', [
  {
    t: 'domain of the inverse after restricting about x = 0', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-6, 6], yRange: [-4, 4], curves: [{ expr: '3*sin(pi*x/4)' }] }),
    alt: 'A smooth wave on a grid that passes through the origin, with one highest point to the right of the y-axis and one lowest point to the left of it inside the window, and further turning points at the two edges.',
    q: 'The function f graphed here fails the horizontal line test. It is restricted to the widest interval of x-values containing x = 0 on which it passes the test. What is the domain of the inverse of the restricted function?',
    o: [['[−3, 3]', 'correct'], ['[−2, 2]', 'gives the restricted domain of f, not the domain of its inverse'], ['[−6, 6]', 'gives the whole window of x-values shown'], ['[0, 3]', 'takes only the part of the graph to the right of the y-axis']],
    calc: ['walk out from x = 0 while the spec\'s expression keeps rising; the values at the two ends of that interval', (c) => { const f = fOf(c); let [a, b] = [0, 0]; while (f(b + 0.5) > f(b) + 1e-9) b += 0.5; while (f(a - 0.5) < f(a) - 1e-9) a -= 0.5; if (a !== -2 || b !== 2) throw new Error(`interval [${a}, ${b}]`); return `[${minus(round(f(a), 6))}, ${minus(round(f(b), 6))}]`; }],
    h: ['Starting from x = 0, the graph can be followed to the left and to the right only as far as its nearest turning points before some horizontal line meets it twice.', 'The domain of an inverse function is the range of the original (restricted) function.'],
    s: 'Read from the figure: around x = 0 the graph rises steadily from its lowest point at (−2, −3) to its highest point at (2, 3); beyond either point it turns back, so the widest interval containing 0 on which f is one-to-one is [−2, 2]. On that interval f takes every value from −3 to 3. The domain of the inverse is this range: [−3, 3].',
  },
  {
    t: 'least restriction x ≥ c and the domain of the resulting inverse', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-3, 3], yRange: [-4, 4], curves: [{ expr: 'x^3/2 - 3*x/2' }] }),
    alt: 'A smooth S-shaped curve on a grid that passes through the origin: it rises to a turning point to the left of the y-axis, falls through the origin to a turning point to the right of the y-axis, and then rises steeply out of the window.',
    q: 'The function f graphed here is restricted to x ≥ c, where c is the least number for which the restricted function passes the horizontal line test. The inverse of the restricted function then has the domain y ≥ m. What is the value of m?',
    n: '-1',
    calc: ['the lowest point of the spec\'s expression for x > 0 (found in steps of 0.5): c is its x, m its height', (c) => { const f = fOf(c); let best = 0.5; for (let x = 0.5; x <= 3; x += 0.5) if (f(x) < f(best)) best = x; if (best !== 1 || !(f(-1) > f(1))) throw new Error(`turning point at ${best}`); return round(f(best), 6); }],
    h: ['To the right of which point does the graph only rise? Starting the domain any further left lets a horizontal line meet the graph twice.', 'The domain of the inverse is the range of the restricted function: the heights the graph takes from that point on.'],
    s: 'Read from the figure: the graph has a turning point (a local minimum) at (1, −1), and to the right of it the graph only rises. So c = 1: any smaller c leaves part of the falling stretch in, and a horizontal line would meet the graph twice. For x ≥ 1 the function takes the values y ≥ −1, which is the domain of the inverse: m = −1.',
  },
]);

// ── Sinusoidal Models from Real Data (pack 263) ─────────────────────────────

G('1c19dde2.lo-2', 'From data to the parameters of a sinusoidal model', [
  {
    t: 'phase shift of a sine model from the maximum and the minimum of the data', d: 3, need: 'calc',
    spec: S('scatter_plot', { points: [[1, 10], [2, 11], [3, 15], [4, 20], [5, 25], [6, 29], [7, 30], [8, 29], [9, 25], [10, 20], [11, 15], [12, 11]].map(([x, y]) => ({ x, y })), xRange: [0, 14], yRange: [5, 35], xStep: 2, yStep: 5, xLabel: 'month', yLabel: 'temperature (°C)' }),
    alt: 'A scatter plot of twelve dots, one for each month, showing temperature against month number. The dots start low, climb to a single highest dot in the second half of the year and come back down.',
    q: 'The scatter plot shows the average temperature of a town for each month of one year (month 1 is January). The data are modelled by T = A·sin(B(m − C)) + D with A > 0, B > 0 and C the smallest possible positive number. What is the value of C?',
    n: '4',
    calc: ['the month at which the dots pass upward through the midline, half-way between the highest and the lowest dot (spec points)', (c) => { const pts = arr(c.p.points).map((q) => [q.x as number, q.y as number]); const ys = pts.map((q) => q[1]); const mid = (Math.max(...ys) + Math.min(...ys)) / 2; const up = pts.filter((q, i) => q[1] === mid && i + 1 < pts.length && pts[i + 1][1] > mid); if (up.length !== 1) throw new Error('no single upward crossing'); return up[0][0]; }],
    h: ['The midline D lies half-way between the highest and the lowest temperature.', 'A sine curve with A > 0 starts its cycle on the midline, going up; C is the month at which the data do that.'],
    s: 'Read from the figure: the highest temperature is 30 °C (month 7) and the lowest is 10 °C (month 1), so the midline is D = (30 + 10) / 2 = 20 °C. A sine model with A > 0 crosses its midline going up at m = C. The data are at 20 °C and rising at month 4 (at month 10 they are at 20 °C and falling), so C = 4.',
  },
  {
    t: 'predict the next minimum beyond the data from the period', d: 3, need: 'calc',
    spec: S('scatter_plot', { points: [[1, 4], [2, 4.5], [3, 5], [4, 4.5], [5, 4], [6, 3], [7, 2], [8, 1.5], [9, 1], [10, 1.5], [11, 2], [12, 3], [13, 4]].map(([x, y]) => ({ x, y })), xRange: [0, 14], yRange: [0, 6], xStep: 2, yStep: 1, xLabel: 'time (h)', yLabel: 'depth (m)' }),
    alt: 'A scatter plot of thirteen dots, one for each hour, showing water depth against time. The dots rise to a single highest dot early on, fall to a single lowest dot later and are rising again at the end of the record.',
    q: 'The scatter plot shows the depth of water in a harbour, measured every hour from t = 1 h to t = 13 h. Assuming the depth keeps varying sinusoidally in the same way, at what time, in hours, is the depth next at its minimum after the measurements end?',
    n: '21',
    calc: ['time of the lowest dot + twice the time between the highest and the lowest dot (spec points)', (c) => { const pts = arr(c.p.points).map((q) => [q.x as number, q.y as number]); const hi = pts.reduce((a, b) => (b[1] > a[1] ? b : a)); const lo = pts.reduce((a, b) => (b[1] < a[1] ? b : a)); return lo[0] + 2 * Math.abs(lo[0] - hi[0]); }],
    h: ['The time from a maximum to the next minimum is half a period.', 'Minima are one whole period apart: add the period to the time of the minimum you can see.'],
    s: 'Read from the figure: the depth is greatest at t = 3 h and least at t = 9 h. From a maximum to the next minimum is half a period, so the period is 2 × (9 − 3) = 12 h. The minimum seen at t = 9 h repeats one period later, at t = 9 + 12 = 21 h.',
  },
]);

// ── Amplitude, Period, Phase Shift (pack 264) ───────────────────────────────

G('1e99b499.lo-1', 'Amplitude under transformations', [
  {
    t: 'amplitude of a transformed function that is not graphed', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-2, 10], yRange: [-2, 3], curves: [{ expr: '1.5*sin(pi*x/3) + 0.5' }] }),
    alt: 'A smooth wave on a grid that repeats along the x-axis. Its highest points lie further above the x-axis than its lowest points lie below it, so the wave is not centred on the x-axis.',
    q: 'The graph shows a sinusoidal function f. A second function is defined by g(x) = 4·f(x) + 1 and is not graphed. What is the amplitude of g?',
    n: '6',
    calc: ['4 × half of (max − min) of the curve (curve_extremum)', (c) => 4 * (extremum(c, 0, 'max') - extremum(c, 0, 'min')) / 2],
    h: ['The amplitude of f is half the distance between its highest and lowest values — it is not the highest value.', 'Multiplying a function by 4 stretches its graph vertically; adding 1 only moves it.'],
    s: 'Read from the figure: f has its highest points at y = 2 and its lowest at y = −1, so its amplitude is (2 − (−1)) / 2 = 1.5. Multiplying by 4 multiplies the amplitude by 4, and adding 1 shifts the graph without changing its amplitude. The amplitude of g is 4 × 1.5 = 6.',
  },
  {
    t: 'find the false statement about two waves with different midlines', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-1, 7], yRange: [-5, 5], curves: [{ expr: '2*sin(pi*x/2) + 2', label: 'P' }, { expr: '3*cos(pi*x/2) - 1', label: 'Q', dashed: true }] }),
    alt: 'Two waves on one grid with the same period: a solid one called P that stays on or above the x-axis, and a dashed one called Q that is taller from bottom to top and sits lower on the grid.',
    q: 'The graph shows two sinusoidal curves, P (solid) and Q (dashed). Which statement is FALSE?',
    o: [
      ['The amplitude of P equals its maximum value', 'correct'],
      ['Q has the greater amplitude', 'takes the curve that reaches higher to have the greater amplitude'],
      ['P has the greater maximum value', 'takes the curve with the greater amplitude to reach higher'],
      ['The two amplitudes differ by 1', 'compares the maximum values instead of the amplitudes'],
    ],
    holds: ['amplitudes and maxima from curve_extremum; the option answers the question when its statement is false', [
      (c) => !near((extremum(c, 0, 'max') - extremum(c, 0, 'min')) / 2, extremum(c, 0, 'max')),
      (c) => !((extremum(c, 1, 'max') - extremum(c, 1, 'min')) / 2 > (extremum(c, 0, 'max') - extremum(c, 0, 'min')) / 2),
      (c) => !(extremum(c, 0, 'max') > extremum(c, 1, 'max')),
      (c) => !near(Math.abs((extremum(c, 1, 'max') - extremum(c, 1, 'min')) / 2 - (extremum(c, 0, 'max') - extremum(c, 0, 'min')) / 2), 1),
    ]],
    h: ['For each curve read both its highest and its lowest value; the amplitude is half the distance between them.', 'A curve that is not centred on the x-axis has an amplitude different from its maximum value.'],
    s: 'Read from the figure: P runs between y = 0 and y = 4, so its amplitude is 2 and its maximum is 4; Q runs between y = −4 and y = 2, so its amplitude is 3 and its maximum is 2. Q has the greater amplitude, P the greater maximum, and the amplitudes differ by 3 − 2 = 1. The amplitude of P (2) does not equal its maximum (4) — that statement is false.',
  },
]);

G('1e99b499.lo-2', 'Period used, not just read', [
  {
    t: 'number of oscillations in a minute from the period', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 10], yRange: [-4, 4], curves: [{ expr: '3*cos(pi*x/2)' }], xLabel: 'time (s)', yLabel: 'displacement (cm)' }),
    alt: 'A smooth wave on a grid of displacement in centimetres against time in seconds, starting at a highest point on the vertical axis and repeating several times across the window.',
    q: 'The graph shows the displacement of a weight on a spring against time. If the motion continues in the same way, how many complete oscillations does the weight make in one minute?',
    n: '15',
    calc: ['60 ÷ the period of the spec\'s expression', (c) => 60 / periodOf(fOf(c))],
    h: ['One complete oscillation takes one period: the time from one highest point to the next.', 'Divide the length of the time interval, in seconds, by the period.'],
    s: 'Read from the figure: the weight is at its highest point at t = 0 s and next at t = 4 s, so the period is 4 s. In one minute, 60 s, it makes 60 / 4 = 15 complete oscillations.',
  },
  {
    t: 'horizontal scale factor relating two waves', d: 3, need: 'calc',
    spec: fgraph({ xRange: [0, 6], yRange: [-3, 3], curves: [{ expr: '2*sin(pi*x/3)', label: 'f' }, { expr: '2*sin(pi*x)', label: 'g', dashed: true }] }),
    alt: 'Two waves of the same height on one grid, both starting at the origin: a solid one called f that completes one cycle across the window, and a dashed one called g that completes several.',
    q: 'The graph shows two functions, f (solid) and g (dashed), with g(x) = f(kx) for a constant k > 0. What is the value of k?',
    n: '3',
    calc: ['period of f ÷ period of g, from the spec\'s expressions', (c) => periodOf(fOf(c, 0)) / periodOf(fOf(c, 1))],
    h: ['Read the period of each curve: the length of one complete cycle along the x-axis.', 'Replacing x by kx squeezes the graph horizontally: the period is divided by k, not multiplied.'],
    s: 'Read from the figure: f completes one cycle from x = 0 to x = 6, so its period is 6; g completes one cycle from x = 0 to x = 2, so its period is 2. Replacing x by kx divides the period by k, so 6 / k = 2 and k = 3.',
  },
]);

G('1e99b499.lo-3', 'Phase shift from the period and a horizontal shift', [
  {
    t: 'phase constant C in sin(Bx − C)', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-2, 8], yRange: [-3, 3], curves: [{ expr: '2*sin(pi*(x - 1)/3)' }] }),
    alt: 'A smooth wave on a grid, centred on the x-axis. It crosses the x-axis going upward a little to the right of the origin and repeats along the x-axis.',
    q: 'The graph shown has an equation of the form y = 2·sin(Bx − C) with B > 0 and 0 ≤ C < 2π. What is the value of C?',
    o: [['π/3', 'correct'], ['1', 'gives the horizontal shift itself, without multiplying by B'], ['π/6', 'uses the distance between neighbouring x-intercepts as the period'], ['3', 'divides the horizontal shift by B instead of multiplying']],
    calc: ['2π × (first upward zero at x ≥ 0) ÷ period, from the spec\'s expression', (c) => { const f = fOf(c); const T = periodOf(f); let x0 = -1; for (let x = 0; x < T; x += 0.5) if (near(f(x), 0, 1e-9) && f(x + 0.1) > 0) { x0 = x; break; } if (x0 < 0) throw new Error('no upward zero'); return piOf((360 * x0) / T); }],
    h: ['Write the equation as y = 2·sin(B(x − h)): h is where the wave crosses its midline going up, and B comes from the period.', 'Then Bx − C = B(x − h) gives C = B·h.'],
    s: 'Read from the figure: the wave crosses the x-axis going up at x = 1 and next at x = 7, so the period is 6 and B = 2π / 6 = π/3. The horizontal shift is h = 1, so y = 2 sin((π/3)(x − 1)) = 2 sin((π/3)x − π/3). Therefore C = π/3.',
  },
  {
    t: 'phase difference in degrees between two waves', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-2, 10], yRange: [-4, 4], curves: [{ expr: '3*cos(pi*x/4)', label: 'f' }, { expr: '3*cos(pi*(x - 3)/4)', label: 'g', dashed: true }] }),
    alt: 'Two waves of the same height and the same period on one grid: a solid one called f with a highest point on the y-axis, and a dashed one called g that has the same shape moved to the right.',
    q: 'The graph shows two waves, f (solid) and g (dashed); g is f moved to the right by less than one period. Taking one full period as 360°, by how many degrees does g lag behind f?',
    n: '135',
    calc: ['360 × (first maximum of g at x ≥ 0 − first maximum of f) ÷ period, from the spec\'s expressions', (c) => { const [f, g] = [fOf(c, 0), fOf(c, 1)]; const T = periodOf(f); const first = (h: (x: number) => number): number => { for (let x = 0; x < T; x += 0.5) if (near(h(x), 3, 1e-9)) return x; throw new Error('no maximum'); }; return (360 * (first(g) - first(f))) / T; }],
    h: ['Measure how far g is moved to the right of f — for example between neighbouring highest points — and read the period.', 'The lag as a fraction of a full cycle is the shift divided by the period; a full cycle is 360°.'],
    s: 'Read from the figure: f has highest points at x = 0 and x = 8, so the period is 8. The nearest highest point of g to the right of x = 0 is at x = 3, so g is f moved 3 units to the right. The lag is 3/8 of a cycle: (3/8) × 360° = 135°.',
  },
]);

// ── Complex Numbers in Polar Form (pack 266) ────────────────────────────────

G('2515225c.lo-1', 'Distances in the complex plane', [
  {
    t: 'distance between two plotted numbers as a modulus', d: 3, need: 'calc',
    spec: cplane([{ re: -2, im: 3, label: 'z' }, { re: 4, im: -5, label: 'w' }]),
    alt: 'Two points in the complex plane: z in the second quadrant and w in the fourth quadrant.',
    q: 'The complex numbers z and w are plotted in the complex plane shown. What is |z − w|, the distance between the two points?',
    n: '10',
    calc: ['the modulus of the difference of the plotted points (spec)', (c) => { const [z, w] = [zOf(c, 'z'), zOf(c, 'w')]; return Math.hypot(z[0] - w[0], z[1] - w[1]); }],
    h: ['Read both numbers as a + bi and subtract them: real parts and imaginary parts separately.', 'The modulus of a + bi is √(a² + b²).'],
    s: 'Read from the figure: z = −2 + 3i and w = 4 − 5i. Then z − w = (−2 − 4) + (3 − (−5))i = −6 + 8i, and |z − w| = √(36 + 64) = √100 = 10.',
  },
  {
    t: 'which of four plotted numbers is not on a given circle', d: 3, need: 'calc',
    spec: cplane([{ re: 3, im: 4, label: 'P' }, { re: -4, im: 3, label: 'Q' }, { re: 0, im: -5, label: 'R' }, { re: 4, im: -4, label: 'S' }]),
    alt: 'Four points in the complex plane: P in the first quadrant, Q in the second quadrant, R on the negative imaginary axis and S in the fourth quadrant.',
    q: 'Four complex numbers are plotted in the complex plane shown. Three of them have modulus 5. Which one does not?',
    o: [['S', 'correct'], ['P', 'does not compute √(3² + 4²)'], ['Q', 'takes a negative real part to change the modulus'], ['R', 'takes a number on an axis to have modulus 0']],
    calc: ['the label of the one plotted point whose pc_modulus is not 5', (c) => { const off = arr(c.p.points).filter((_, i) => !near(c.num('pc_modulus', { point: i }), 5, 1e-6)); if (off.length !== 1) throw new Error('not exactly one'); return off[0].label as string; }],
    h: ['The modulus of a + bi is its distance from the origin, √(a² + b²).', 'Compute it for each point; signs of a and b do not matter once they are squared.'],
    s: 'Read from the figure: P = 3 + 4i, Q = −4 + 3i, R = −5i and S = 4 − 4i. The moduli are √(9 + 16) = 5, √(16 + 9) = 5, √(0 + 25) = 5 and √(16 + 16) = √32 ≈ 5.66. S is the one whose modulus is not 5.',
  },
]);

G('2515225c.lo-2', 'Arguments compared, and a conjugate converted', [
  {
    t: 'angle of rotation from one plotted number to another', d: 3, need: 'calc',
    spec: cplane([{ re: 2, im: -2, label: 'z' }, { re: 0, im: 4, label: 'w' }], { range: 5 }),
    alt: 'Two points in the complex plane: z in the fourth quadrant, the same distance from both axes, and w on the positive imaginary axis.',
    q: 'The complex numbers z and w are plotted in the complex plane shown. Through how many degrees, counter-clockwise, must the ray from the origin through z be turned to lie along the ray from the origin through w? Give an angle between 0° and 360°.',
    n: '135',
    calc: ['(pc_argument of w − pc_argument of z) taken between 0° and 360°', (c) => ((c.num('pc_argument', { point: 1, unit: 'degrees', range: 'positive' }) - c.num('pc_argument', { point: 0, unit: 'degrees', range: 'positive' })) % 360 + 360) % 360],
    h: ['Find the argument of each number, measured counter-clockwise from the positive real axis, between 0° and 360°.', 'Turning counter-clockwise from z to w may take you past the positive real axis; if the difference comes out negative, add 360°.'],
    s: 'Read from the figure: z = 2 − 2i lies in quadrant IV on the line at 45° to the axes, so its argument is 315°; w = 4i lies on the positive imaginary axis, so its argument is 90°. Turning counter-clockwise from 315° reaches 360° after 45° and then 90° after another 90°: 45° + 90° = 135° (that is, 90° − 315° + 360°).',
  },
  {
    t: 'rectangular form of the conjugate of a number given on a polar grid', d: 3, need: 'calc',
    spec: polar([{ r: 4, theta: 240, label: 'z' }]),
    alt: 'A polar grid of concentric circles and rays with one point, z, plotted on a ray in the third quadrant, part of the way out from the pole.',
    q: 'The complex number z is plotted on the polar grid shown. Which is the complex conjugate of z, written in the form a + bi?',
    o: [['−2 + 2√3i', 'correct'], ['−2 − 2√3i', 'converts z itself and does not take the conjugate'], ['2 + 2√3i', 'changes the sign of the real part as well'], ['−2√3 + 2i', 'exchanges the cosine and the sine']],
    calc: ['r cos θ − (r sin θ)i for the plotted point (spec), with pc_modulus and pc_argument for the record', (c) => { c.num('pc_modulus', { point: 0 }); c.num('pc_argument', { point: 0, unit: 'degrees', range: 'positive' }); const z = zOf(c, 'z'); return zExact([z[0], -z[1]]); }],
    h: ['Read the modulus r and the argument θ of z, then use a = r cos θ and b = r sin θ.', 'The conjugate has the same real part and the opposite imaginary part.'],
    s: 'Read from the figure: z has modulus 4 and argument 240°. So z = 4 cos 240° + (4 sin 240°)i = 4(−1/2) + 4(−√3/2)i = −2 − 2√3i. The conjugate keeps the real part and reverses the sign of the imaginary part: −2 + 2√3i.',
  },
]);

G('2515225c.lo-3', 'Trigonometric form: equivalent forms and a sum', [
  {
    t: 'find the expression that is not equal to the plotted number', d: 3, need: 'reason',
    spec: polar([{ r: 3, theta: 300, label: 'z' }], { rMax: 4 }),
    alt: 'A polar grid of concentric circles and rays with one point, z, plotted on a ray in the fourth quadrant.',
    q: 'The complex number z is plotted on the polar grid shown. Three of these expressions are equal to z. Which one is NOT?',
    o: [
      ['3(cos 120° − i sin 120°)', 'correct'],
      ['3(cos 60° − i sin 60°)', 'does not use cos(−θ) = cos θ and sin(−θ) = −sin θ'],
      ['3(cos(−60°) + i sin(−60°))', 'takes a negative angle not to be allowed'],
      ['−3(cos 120° + i sin 120°)', 'takes a factor of −1 to change only the real part'],
    ],
    holds: ['the value of each expression compared with the plotted point (spec); the option answers the question when the two differ', [
      (c) => { const z = zOf(c, 'z'); return !(near(3 * cosD(120), z[0], 1e-9) && near(-3 * sinD(120), z[1], 1e-9)); },
      (c) => { const z = zOf(c, 'z'); return !(near(3 * cosD(60), z[0], 1e-9) && near(-3 * sinD(60), z[1], 1e-9)); },
      (c) => { const z = zOf(c, 'z'); return !(near(3 * cosD(-60), z[0], 1e-9) && near(3 * sinD(-60), z[1], 1e-9)); },
      (c) => { const z = zOf(c, 'z'); return !(near(-3 * cosD(120), z[0], 1e-9) && near(-3 * sinD(120), z[1], 1e-9)); },
    ]],
    h: ['Read the modulus and the argument of z and work out its real and imaginary parts.', 'Evaluate each expression to a real part and an imaginary part and compare — pay attention to the signs in front of i and in front of the bracket.'],
    s: 'Read from the figure: z has modulus 3 and argument 300°, so z = 3 cos 300° + (3 sin 300°)i = 3/2 − (3√3/2)i. Check each expression: 3(cos 60° − i sin 60°) = 3/2 − (3√3/2)i; 3(cos(−60°) + i sin(−60°)) is the same; −3(cos 120° + i sin 120°) = −3(−1/2 + (√3/2)i) = 3/2 − (3√3/2)i. But 3(cos 120° − i sin 120°) = −3/2 − (3√3/2)i, which has the wrong real part — it is not z.',
  },
  {
    t: 'trigonometric form of the sum of two plotted numbers', d: 3, need: 'calc',
    spec: cplane([{ re: -4, im: 1, label: 'u' }, { re: 1, im: -4, label: 'v' }]),
    alt: 'Two points in the complex plane: u in the second quadrant close to the real axis, and v in the fourth quadrant close to the imaginary axis.',
    q: 'The complex numbers u and v are plotted in the complex plane shown. Which is u + v in trigonometric form?',
    o: [['3√2(cos 225° + i sin 225°)', 'correct'], ['3√2(cos 45° + i sin 45°)', 'takes tan⁻¹ of the ratio without looking at the quadrant'], ['3(cos 225° + i sin 225°)', 'uses one part of the sum as its modulus'], ['3√2(cos 135° + i sin 135°)', 'places the sum in the wrong quadrant']],
    calc: ['pc_sum of the two points: its modulus as a multiple of √2 and its argument between 0° and 360°', (c) => { const re = c.num('pc_sum', { points: [0, 1], want: 're' }); const im = c.num('pc_sum', { points: [0, 1], want: 'im' }); const th = round(((Math.atan2(im, re) * 180) / Math.PI + 360) % 360, 6); return `${ex(Math.hypot(re, im))}(cos ${th}° + i sin ${th}°)`; }],
    h: ['Add the two numbers first, then find the modulus of the sum.', 'For the argument, find the reference angle from the two parts and then place it in the quadrant where the sum lies.'],
    s: 'Read from the figure: u = −4 + i and v = 1 − 4i, so u + v = −3 − 3i. Its modulus is √(9 + 9) = 3√2. Both parts are negative and equal in size, so the sum lies in quadrant III on the line at 45° to the axes: its argument is 180° + 45° = 225°. So u + v = 3√2(cos 225° + i sin 225°).',
  },
]);

// ── Trigonometric functions unit circle (pack 268) ──────────────────────────

G('2fd4669e.lo-1', 'Lengths on the unit circle', [
  {
    t: 'arc length to a point known by one coordinate', d: 3, need: 'reason',
    spec: ucircle([{ degrees: 225, label: 'none', name: 'P', arc: true, coords: 'blank_y' }]),
    alt: 'A unit circle with one angle in standard position, marked by an arc from the positive x-axis counter-clockwise to a radius that ends at the point P in the third quadrant. The coordinates of P are printed with a question mark in place of the y-coordinate; the size of the angle is not printed.',
    q: 'The unit circle shown gives one coordinate of the point P. What is the length of the arc of the circle from the point (1, 0) counter-clockwise to P?',
    o: [['5π/4', 'correct'], ['3π/4', 'places the point in quadrant II'], ['π/4', 'gives the reference angle'], ['225', 'gives the angle in degrees, which is not a length']],
    calc: ['the marked angle (spec) in radians: on a circle of radius 1 the arc length equals the angle', (c) => { c.txt('uc_quadrant', { angle: 0 }); return piOf(degOf(c, 0)); }],
    h: ['Use the printed coordinate and the quadrant to find the angle in standard position that ends at P.', 'On a circle of radius 1, the length of an arc equals the angle it subtends, measured in radians.'],
    s: 'Read from the figure: P has x-coordinate −√2/2 and lies in quadrant III. A coordinate of size √2/2 means a reference angle of 45°, so the angle is 180° + 45° = 225°, which is 5π/4 radians. On the unit circle the arc length equals the angle in radians: 5π/4.',
  },
  {
    t: 'length of the chord joining two marked points', d: 3, need: 'calc',
    spec: ucircle([{ degrees: 60, name: 'P' }, { degrees: 300, name: 'Q' }]),
    alt: 'A unit circle with two radii drawn to points on the circle, each labelled with its angle in standard position: P in the first quadrant and Q directly below it in the fourth quadrant. No coordinates are printed.',
    q: 'The unit circle shown marks two angles in standard position and the points P and Q where their terminal sides meet the circle. What is the length of the straight segment PQ?',
    o: [['√3', 'correct'], ['1', 'takes the triangle formed with the centre to be equilateral'], ['√3/2', 'gives the distance from one point to the x-axis only'], ['2', 'takes PQ to be a diameter']],
    calc: ['the distance between the two marked points (spec angles), with uc_coordinates for the record', (c) => { c.txt('uc_coordinates', { angle: 0 }); c.txt('uc_coordinates', { angle: 1 }); const [a, b] = [degOf(c, 0), degOf(c, 1)]; return ex(Math.hypot(cosD(a) - cosD(b), sinD(a) - sinD(b))); }],
    h: ['Write down the exact coordinates of P and of Q.', 'Compare the two x-coordinates: what does that tell you about the direction of the segment PQ?'],
    s: 'Read from the figure: P is at 60°, so P = (1/2, √3/2); Q is at 300°, so Q = (1/2, −√3/2). The two points have the same x-coordinate, so PQ is vertical and its length is the difference of the y-coordinates: √3/2 − (−√3/2) = √3.',
  },
]);

// ── Polynomial and Rational Inequalities (pack 276) ─────────────────────────

G('4ecdb7b8.lo-4', 'From a solution set back to the inequality', [
  {
    t: 'match a solution set to a polynomial inequality', d: 3, need: 'reason',
    spec: nline(-5, 6, { intervals: [{ from: null, to: -2, toOpen: true }, { from: 1, to: 3, fromOpen: true, toOpen: true }] }),
    alt: 'A number line with two parts drawn heavily: a ray running left from an open circle to the left of zero, and a separate stretch between two open circles to the right of zero.',
    q: 'Which inequality has the solution set drawn on the number line shown?',
    o: [['(x + 2)(x − 1)(x − 3) < 0', 'correct'], ['(x + 2)(x − 1)(x − 3) > 0', 'gives the intervals on which the product is positive'], ['(x + 2)(x − 1)(x − 3) ≤ 0', 'includes the end points, which are open circles'], ['(x − 2)(x + 1)(x + 3) < 0', 'gives every zero the wrong sign']],
    holds: ['the solution set of each option compared with the set drawn (spec intervals) at every quarter unit; nl_interval_notation for the record', [
      (c) => { c.txt('nl_interval_notation'); return sameLineSet(c, (x) => (x + 2) * (x - 1) * (x - 3) < 0); },
      (c) => sameLineSet(c, (x) => (x + 2) * (x - 1) * (x - 3) > 0),
      (c) => sameLineSet(c, (x) => (x + 2) * (x - 1) * (x - 3) <= 0),
      (c) => sameLineSet(c, (x) => (x - 2) * (x + 1) * (x + 3) < 0),
    ]],
    h: ['The circles mark the zeros of the polynomial; a zero at x = a comes from a factor (x − a).', 'Pick a test value inside one of the heavy parts and see what sign the product has there.'],
    s: 'Read from the figure: the set is (−∞, −2) ∪ (1, 3), with open circles at −2, 1 and 3. Those are the zeros, so the factors are (x + 2), (x − 1) and (x − 3). Test x = 2, which is in the set: (4)(1)(−1) = −4, negative. The circles are open, so the inequality is strict: (x + 2)(x − 1)(x − 3) < 0.',
  },
  {
    t: 'locate the zero of the denominator of a rational inequality', d: 3, need: 'reason',
    spec: nline(-6, 8, { intervals: [{ from: -3, to: 2, fromOpen: false, toOpen: true }, { from: 4, to: null, fromOpen: false }] }),
    alt: 'A number line with two parts drawn heavily: a stretch that starts at a filled circle to the left of zero and ends at an open circle to the right of zero, and a ray running right from a filled circle further to the right.',
    q: 'The number line shown is the solution set of (x + 3)(x − 4) / (x − k) ≥ 0 for a constant k. What is the value of k?',
    n: '2',
    calc: ['the one whole number k from −6 to 8 for which the inequality has exactly the set drawn (spec intervals, compared at every quarter unit)', (c) => { const ks: number[] = []; for (let k = -6; k <= 8; k++) if (sameLineSet(c, (x) => x !== k && ((x + 3) * (x - 4)) / (x - k) >= 0)) ks.push(k); if (ks.length !== 1) throw new Error(`k = ${ks.join(', ')}`); return ks[0]; }],
    h: ['With ≥, a value where the numerator is zero is a solution, so it gets a filled circle.', 'A value where the denominator is zero can never be a solution, whatever the inequality sign.'],
    s: 'Read from the figure: the set is [−3, 2) ∪ [4, ∞). The filled circles at −3 and 4 are the zeros of the numerator, which satisfy ≥ 0. The remaining boundary point, 2, has an open circle although the inequality allows equality: the expression is undefined there, so the denominator is zero at x = 2. Therefore k = 2.',
  },
]);

// ── Domain and Range of Functions (pack 281) ────────────────────────────────

G('61afb8a2.lo-5', 'Range when end points are open or closed', [
  {
    t: 'range of a graph in two pieces that share an end height', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-6, 6], yRange: [-2, 4], curves: [{ expr: 'x + 4', domain: [-5, -1], from: 'closed', to: 'open', color: BLUE }, { expr: '4 - x', domain: [1, 5], from: 'closed', to: 'closed', color: BLUE }] }),
    alt: 'A graph in two separate straight pieces on a grid. The left piece rises from a filled dot to an open circle; the right piece falls from a filled dot to a filled dot. The open circle of the left piece and the first filled dot of the right piece are at the same height.',
    q: 'The graph shows the whole of a function f. Which is the range of f?',
    o: [['[−1, 3]', 'correct'], ['[−1, 3)', 'leaves out the top value because one piece has an open circle there'], ['[−5, −1) ∪ [1, 5]', 'gives the domain'], ['[−5, 5]', 'gives the span of the x-values']],
    calc: ['the least and greatest heights of the spec\'s pieces, each end closed when some piece attains it', (c) => rangeText(rangeOf(c))],
    h: ['The range is the set of heights (y-values) the graph reaches; project both pieces onto the y-axis.', 'A height belongs to the range if any point of the graph has it — an open circle on one piece does not remove a height that another piece reaches.'],
    s: 'Read from the figure: the left piece rises from (−5, −1), a filled dot, toward (−1, 3), an open circle, so it gives the heights −1 ≤ y < 3. The right piece falls from (1, 3), a filled dot, to (5, −1), a filled dot, so it gives −1 ≤ y ≤ 3. The height 3 is reached by the right piece, so the range is [−1, 3].',
  },
  {
    t: 'count the integers in a range with one end missing', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-5, 5], yRange: [-3, 3], curves: [{ expr: 'abs(x + 1) - 2', domain: [-4, 3], from: 'closed', to: 'open' }] }),
    alt: 'A V-shaped graph on a grid. Its left arm starts at a filled dot above the x-axis, its lowest point is below the x-axis, and its right arm ends, higher than the left arm starts, at an open circle.',
    q: 'The graph shows the whole of a function f. How many integers are in the range of f?',
    n: '4',
    calc: ['whole numbers from the least to the greatest height of the spec\'s curve, an end counted only when the curve attains it', (c) => { const r = rangeOf(c); let n = 0; for (let k = Math.ceil(r.lo); k <= Math.floor(r.hi); k++) if ((k > r.lo || r.loIn) && (k < r.hi || r.hiIn)) n++; return n; }],
    h: ['Find the lowest height the graph reaches and the highest height it approaches; check for each whether the graph has a point there.', 'The two arms end at different heights: the range is decided by the higher end, and by whether that end is a filled dot or an open circle.'],
    s: 'Read from the figure: the lowest point of the V is (−1, −2), so the least value is −2. The left arm ends at the filled dot (−4, 1); the right arm climbs to the open circle at (3, 2), so f gets as close to 2 as you like but never equals 2. The range is [−2, 2), which contains the integers −2, −1, 0 and 1: four integers.',
  },
]);

// ── Estimating Limits from Tables and Graphs (pack 292) ─────────────────────

G('9f2a3bed.lo-3', 'Two-sided limits: where they exist, and limits of sums', [
  {
    t: 'count the values at which the two-sided limit exists', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 5], yRange: [-1, 5], curves: [{ expr: 'x + 5', domain: [-4, -2], to: 'closed', color: BLUE }, { expr: 'x + 2', domain: [-2, 1], from: 'open', to: 'open', color: BLUE }, { expr: '4 - x', domain: [1, 3], from: 'open', color: BLUE }, { expr: 'x - 2', domain: [3, 5], color: BLUE }], points: [{ x: 1, y: 1 }] }),
    alt: 'A graph of one function drawn in straight pieces on a grid. At one x-value the graph breaks and restarts at a different height; at another there is an open circle where two pieces meet, with a single filled dot directly below it; at a third the graph turns sharply without a break.',
    q: 'The graph of a function f is shown. At how many of the values x = −2, x = 1 and x = 3 does the limit of f(x) as x approaches that value exist?',
    n: '2',
    calc: ['the values among −2, 1, 3 at which the spec\'s pieces approach the same height from the left and from the right', (c) => [-2, 1, 3].filter((x) => near(leftLim(pieces(c), x), rightLim(pieces(c), x), 1e-6)).length],
    h: ['A two-sided limit exists when the graph approaches one and the same height from the left and from the right.', 'What the function equals exactly at the x-value — or whether it is smooth there — does not matter for the limit.'],
    s: 'Read from the figure: at x = −2 the graph approaches height 3 from the left and height 0 from the right — the limit does not exist. At x = 1 it approaches height 3 from both sides (the filled dot at height 1 is only the value f(1)), so the limit exists. At x = 3 both sides approach height 1 at a corner, so the limit exists. The limit exists at 2 of the three values.',
  },
  {
    t: 'limit of the sum of two graphed functions at a hole', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-1, 5], yRange: [-2, 7], curves: [{ expr: 'x + 1', domain: [-1, 2], to: 'open', color: BLUE, label: 'f' }, { expr: 'x + 1', domain: [2, 5], from: 'open', color: BLUE }, { expr: '4 - x', label: 'g', dashed: true }], points: [{ x: 2, y: 1 }] }),
    alt: 'Two graphs on one grid: a solid rising straight line called f with one open circle on it and a single filled dot directly below the open circle, and a dashed falling straight line called g that crosses it.',
    q: 'The graph shows two functions, f (solid) and g (dashed); the filled dot gives the value of f at that x. What is the limit of f(x) + g(x) as x approaches 2?',
    n: '5',
    calc: ['the height f approaches at x = 2 from both sides (spec pieces) plus the height of g there', (c) => { const ps = pieces(c).slice(0, 2); const [l, r] = [leftLim(ps, 2), rightLim(ps, 2)]; if (!near(l, r, 1e-6)) throw new Error('f has no limit at 2'); return round(l + fOf(c, 2)(2), 6); }],
    h: ['The limit of a sum is the sum of the limits, so find the limit of each function at x = 2 separately.', 'For f, follow the line toward x = 2 from both sides; the filled dot is the value f(2), not the limit.'],
    s: 'Read from the figure: as x approaches 2, the solid line f approaches the open circle at height 3 from both sides, so the limit of f is 3 (the filled dot at height 1 is f(2) and plays no part). The dashed line g passes through (2, 2), so its limit is 2. The limit of the sum is 3 + 2 = 5.',
  },
]);

G('9f2a3bed.lo-4', 'Left-hand limits compared with values, and composed', [
  {
    t: 'left-hand limit of a composition', d: 4, need: 'reason',
    spec: fgraph({ xRange: [-2, 5], yRange: [-2, 6], curves: [{ expr: '3 - x', domain: [-2, 1], to: 'open', color: BLUE }, { expr: 'x - 2', domain: [1, 3], from: 'closed', to: 'open', color: BLUE }, { expr: '4', domain: [3, 5], from: 'closed', color: BLUE }] }),
    alt: 'A graph of one function drawn in three straight pieces on a grid: a falling piece that ends at an open circle, a rising piece that starts lower at a filled dot and ends at an open circle, and a level piece that starts higher at a filled dot.',
    q: 'The graph of a function f is shown. What is the limit of f(f(x)) as x approaches 3 from the left?',
    n: '2',
    calc: ['f(f(3 − h)) for h shrinking to 0, each f evaluated on the spec\'s pieces with their open and closed ends', (c) => { const vals = [1e-3, 1e-5, 1e-7].map((h) => evalF(c, evalF(c, 3 - h))); if (!near(vals[1], vals[2], 1e-4)) throw new Error('no limit'); return round(vals[2], 4); }],
    h: ['First see what f(x) does as x approaches 3 from the left: which height does it approach, and does it approach it from below or from above?', 'Then let the input of the outer f approach that height from the same side, and read the graph there.'],
    s: 'Read from the figure: as x approaches 3 from the left, the middle piece rises toward the open circle at height 1, so f(x) approaches 1 from below. Now feed these values into f: as its input approaches 1 from the left, the left-hand piece falls toward the open circle at height 2. So f(f(x)) approaches 2. (f(f(3)) = f(4) = 4 and f(1) = −1 are different numbers.)',
  },
  {
    t: 'find the false statement about left-hand limits', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-2, 6], yRange: [-3, 4], curves: [{ expr: 'x + 2', domain: [-2, 1], to: 'closed', color: BLUE }, { expr: '2 - x', domain: [1, 4], from: 'open', to: 'open', color: BLUE }, { expr: 'x - 3', domain: [4, 6], from: 'closed', color: BLUE }] }),
    alt: 'A graph of one function drawn in three straight pieces on a grid: a rising piece that ends at a filled dot, a falling piece that starts lower at an open circle and ends at an open circle, and a rising piece that starts higher at a filled dot.',
    q: 'The graph of a function f is shown. Which statement is FALSE?',
    o: [
      ['As x approaches 4 from the left, f(x) approaches f(4)', 'correct'],
      ['As x approaches 1 from the left, f(x) approaches f(1)', 'takes the open circle at that x to give the left-hand limit'],
      ['The left-hand limit at x = 4 is less than the left-hand limit at x = 1', 'compares the heights of the filled dots'],
      ['The left-hand limit at x = 1 is greater than the right-hand limit at x = 1', 'exchanges the two sides at x = 1'],
    ],
    holds: ['one-sided limits and values from the spec\'s pieces; the option answers the question when its statement is false', [
      (c) => !near(leftLim(pieces(c), 4), evalF(c, 4), 1e-6),
      (c) => !near(leftLim(pieces(c), 1), evalF(c, 1), 1e-6),
      (c) => !(leftLim(pieces(c), 4) < leftLim(pieces(c), 1)),
      (c) => !(leftLim(pieces(c), 1) > rightLim(pieces(c), 1)),
    ]],
    h: ['For a left-hand limit, follow the piece of the graph that lies to the left of the x-value, up to its end.', 'The value of f at an x-value is the height of the filled dot there.'],
    s: 'Read from the figure: to the left of x = 1 the graph rises to the filled dot (1, 3), so the left-hand limit at 1 is 3, equal to f(1) = 3; to the right of 1 the graph starts from the open circle at height 1. To the left of x = 4 the graph falls to the open circle at height −2, so the left-hand limit at 4 is −2, but f(4) is the filled dot at height 1. So "f(x) approaches f(4) from the left" is false; −2 < 3 and 3 > 1 make the other two comparisons true.',
  },
]);

G('9f2a3bed.lo-5', 'Right-hand limits compared with values, and repaired', [
  {
    t: 'count the breaks at which the right-hand limit equals the value', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-3, 6], yRange: [-2, 4], curves: [{ expr: 'x + 3', domain: [-3, -1], to: 'closed', color: BLUE }, { expr: 'x', domain: [-1, 2], from: 'open', to: 'open', color: BLUE }, { expr: '5 - x', domain: [2, 4], from: 'closed', to: 'closed', color: BLUE }, { expr: 'x - 5', domain: [4, 6], from: 'open', color: BLUE }] }),
    alt: 'A graph of one function drawn in four straight pieces on a grid, with a break between each piece and the next. At each break one piece ends in a filled dot and the other in an open circle at a different height.',
    q: 'The graph of a function f is shown; it breaks at x = −1, x = 2 and x = 4. At how many of these three values is the limit of f(x) from the right equal to the value of f there?',
    n: '1',
    calc: ['the values among −1, 2, 4 at which the height approached from the right (spec pieces) equals the value at the filled dot', (c) => [-1, 2, 4].filter((x) => near(rightLim(pieces(c), x), evalF(c, x), 1e-6)).length],
    h: ['At each break, the right-hand limit is the height at which the piece to the right of the break starts — whether that end is filled or open.', 'The value of f at the break is the height of the filled dot; compare the two at each of the three breaks.'],
    s: 'Read from the figure: at x = −1 the piece on the right starts at an open circle at height −1, while f(−1) is the filled dot at height 2 — not equal. At x = 2 the piece on the right starts at a filled dot at height 3, so the right-hand limit is 3 and f(2) = 3 — equal. At x = 4 the piece on the right starts at an open circle at height −1, while f(4) is the filled dot at height 1 — not equal. Only one of the three.',
  },
  {
    t: 'shift one side so that the two one-sided limits agree', d: 3, need: 'calc',
    spec: fgraph({ xRange: [-2, 6], yRange: [-2, 4], curves: [{ expr: 'x + 1', domain: [-2, 2], to: 'closed', color: BLUE }, { expr: 'x/2', domain: [2, 6], from: 'open', color: BLUE }] }),
    alt: 'A graph of one function drawn in two straight pieces on a grid: a rising piece that ends at a filled dot, and a second, gentler rising piece that starts lower at an open circle directly below that dot.',
    q: 'The graph of a function f is shown. A new function g is defined by g(x) = f(x) for x ≤ 2 and g(x) = f(x) + k for x > 2. For what value of k does the limit of g(x) as x approaches 2 exist?',
    n: '2',
    calc: ['left-hand limit minus right-hand limit of the spec\'s pieces at x = 2', (c) => round(leftLim(pieces(c), 2) - rightLim(pieces(c), 2), 6)],
    h: ['Find the height the graph of f approaches from the left of the break, and the height it approaches from the right of it.', 'Adding k lifts only the part of the graph to the right of the break; choose k so that the two heights meet.'],
    s: 'Read from the figure: as x approaches 2 from the left, f(x) approaches the filled dot at height 3. As x approaches 2 from the right, f(x) approaches the open circle at height 1. For g the right-hand limit becomes 1 + k, and the left-hand limit stays 3. The limit exists when 1 + k = 3, so k = 2.',
  },
]);

// ── Law of Sines: Solving Triangles (pack 305) ──────────────────────────────

G('dcbdc785.lo-2', 'Law of Sines when the needed angle is not given', [
  {
    t: 'perimeter from two angles and the side between them', d: 3, need: 'calc',
    spec: tri({ asa: [50, 12, 70], sideLabels: [null, null, 'auto'], angleLabels: ['auto', 'auto', null], unit: 'cm' }),
    alt: 'A triangle with no right angle. Two of its angles are labelled with their sizes in degrees, and the side between those two angles is labelled with its length in centimetres; the other two sides and the third angle are not labelled.',
    q: 'What is the perimeter of the triangle shown, to the nearest tenth of a centimetre?',
    n: '35.6',
    calc: ['geo_perimeter', (c) => round(c.num('geo_perimeter'), 1)],
    h: ['The given side is opposite the angle that is not labelled; find that angle from the angle sum of a triangle.', 'Use the Law of Sines twice, once for each unknown side, then add all three sides.'],
    s: 'Read from the figure: the angles 50° and 70° are given, with the 12 cm side between them. The third angle is 180° − 50° − 70° = 60°, and it is opposite the 12 cm side. By the Law of Sines the side opposite 50° is 12 sin 50° / sin 60° ≈ 10.61 cm and the side opposite 70° is 12 sin 70° / sin 60° ≈ 13.02 cm. The perimeter is 12 + 10.61 + 13.02 ≈ 35.6 cm.',
  },
  {
    t: 'the longest side, opposite the angle that is not labelled', d: 3, need: 'calc',
    spec: tri({ asa: [35, (12 * Math.sin(rad(95))) / Math.sin(rad(35)), 50], sideLabels: ['auto', null, null], angleLabels: ['auto', 'auto', null], unit: 'm' }),
    alt: 'A triangle with no right angle marked. Two of its angles are labelled with their sizes in degrees, and the side opposite the smaller of them is labelled with its length in metres; the other two sides and the third angle are not labelled.',
    q: 'What is the length of the longest side of the triangle shown, to the nearest tenth of a metre?',
    n: '20.8',
    calc: ['the greatest of the three geo_side values', (c) => round(Math.max(c.num('geo_side', { side: 0 }), c.num('geo_side', { side: 1 }), c.num('geo_side', { side: 2 })), 1)],
    h: ['The longest side of a triangle lies opposite its largest angle — find the third angle before deciding which side that is.', 'Then set up the Law of Sines with the given side and the angle opposite it.'],
    s: 'Read from the figure: the angles 35° and 50° are given, and the 12 m side is opposite the 35° angle. The third angle is 180° − 35° − 50° = 95°, the largest, so the longest side is the one opposite it. By the Law of Sines that side is 12 sin 95° / sin 35° ≈ 20.8 m.',
  },
]);

// ── Vector Operations and Applications (pack 309) ───────────────────────────

G('e8769763.lo-1', 'Components, magnitude and direction of drawn vectors', [
  {
    t: 'find the false statement about three vectors', d: 3, need: 'reason',
    spec: vecs([-6, 5], [-4, 5], [V('u', [-5, 1], [-1, 3]), V('v', [3, 4], [1, 3]), V('w', [1, 1], [3, -3])]),
    alt: 'Three arrows on a coordinate grid, each starting and ending on grid points: u in the upper left pointing up and to the right, v in the upper right pointing down and to the left, and w pointing steeply down and to the right.',
    q: 'Three vectors, u, v and w, are drawn on the grid shown. Which statement is FALSE?',
    o: [
      ['v and w point in opposite directions', 'correct'],
      ['u and w have the same magnitude', 'takes vectors with different components to have different lengths'],
      ['u and v are parallel', 'takes vectors that point opposite ways not to be parallel'],
      ['u = −2v', 'reads the components of v as tail minus head'],
    ],
    holds: ['each statement tested on the components (vec_components); the option answers the question when its statement is false', [
      (c) => { const [v, w] = [vec(c, 'v'), vec(c, 'w')]; return !(parallel(v, w) && v[0] * w[0] + v[1] * w[1] < 0); },
      (c) => { const [u, w] = [vec(c, 'u'), vec(c, 'w')]; return !near(Math.hypot(...u), Math.hypot(...w)); },
      (c) => !parallel(vec(c, 'u'), vec(c, 'v')),
      (c) => { const [u, v] = [vec(c, 'u'), vec(c, 'v')]; return !(u[0] === -2 * v[0] && u[1] === -2 * v[1]); },
    ]],
    h: ['Read the components of each vector as head minus tail.', 'Two vectors are parallel when one is a number times the other; they point in opposite directions when that number is negative.'],
    s: 'Read from the figure: u = ⟨4, 2⟩, v = ⟨−2, −1⟩ and w = ⟨2, −4⟩. Since ⟨4, 2⟩ = −2⟨−2, −1⟩, u = −2v, so u and v are parallel. |u| = √(16 + 4) = √20 and |w| = √(4 + 16) = √20, the same magnitude. But w is not a multiple of v (2/(−2) = −1 while −4/(−1) = 4), so v and w are not even parallel — they do not point in opposite directions.',
  },
  {
    t: 'tail of a vector moved so that its head is at a given point', d: 3, need: 'calc',
    spec: vecs([-5, 5], [-4, 5], [V('v', [-4, 3], [1, 0])]),
    alt: 'One arrow, v, on a coordinate grid, starting at a grid point in the upper left and ending at a grid point on the positive x-axis.',
    q: 'The vector v is drawn on the grid shown. It is moved, without changing its length or direction, so that its head (terminal point) is at (3, −2). Where is its tail (initial point) then?',
    o: [['(−2, 1)', 'correct'], ['(8, −5)', 'adds the components to the head instead of subtracting them'], ['(−2, −5)', 'subtracts the x-component but adds the y-component'], ['(−4, 3)', 'gives the tail of the vector as it is drawn']],
    calc: ['(3, −2) minus the components of v (vec_components)', (c) => { const v = vec(c, 'v'); return pText([3 - v[0], -2 - v[1]]); }],
    h: ['Moving a vector does not change its components; read them as head minus tail.', 'Head = tail + components, so the tail is the head minus the components.'],
    s: 'Read from the figure: v runs from (−4, 3) to (1, 0), so its components are ⟨1 − (−4), 0 − 3⟩ = ⟨5, −3⟩. With the head at (3, −2), the tail is (3 − 5, −2 − (−3)) = (−2, 1).',
  },
]);

G('e8769763.lo-4', 'Scalar multiples recognised and constructed', [
  {
    t: 'which drawn vectors are scalar multiples of a given one', d: 3, need: 'reason',
    spec: vecs([-6, 5], [-5, 5], [V('v', [-5, -3], [-1, -1]), V('p', [4, 4], [-2, 1]), V('q', [1, -4], [3, 0]), V('r', [-4, 2], [-2, 3])]),
    alt: 'Four arrows on a coordinate grid, each starting and ending on grid points: v in the lower left, p a longer arrow in the upper part pointing down and to the left, q in the lower right pointing steeply up, and r a short arrow in the upper left.',
    q: 'Four vectors are drawn on the grid shown. Which of the vectors p, q and r are scalar multiples of v?',
    o: [['p and r only', 'correct'], ['r only', 'takes a scalar multiple to need the same direction'], ['p, q and r', 'accepts a vector whose components are those of v exchanged'], ['q and r only', 'judges by which arrows point upward']],
    calc: ['the vectors whose components are proportional to those of v (vec_components)', (c) => { const v = vec(c, 'v'); const hit = ['p', 'q', 'r'].filter((n) => parallel(v, vec(c, n))); return hit.length === 3 ? 'p, q and r' : `${hit.join(' and ')} only`; }],
    h: ['Read the components of every vector as head minus tail.', 'A vector is a scalar multiple of v when both of its components are the same number times the components of v — that number may be negative or a fraction.'],
    s: 'Read from the figure: v = ⟨4, 2⟩, p = ⟨−6, −3⟩, q = ⟨2, 4⟩ and r = ⟨2, 1⟩. p = −(3/2)v and r = (1/2)v, so both are scalar multiples of v. For q the ratios are 2/4 = 1/2 and 4/2 = 2, which differ, so q is not. The answer is p and r only.',
  },
  {
    t: 'vector of given magnitude opposite to a drawn vector', d: 3, need: 'calc',
    spec: vecs([-3, 4], [-3, 4], [V('v', [2, -2], [-1, 2])]),
    alt: 'One arrow, v, on a coordinate grid, starting at a grid point in the fourth quadrant and ending at a grid point in the second quadrant.',
    q: 'The vector v is drawn on the grid shown. A vector w has the direction opposite to that of v and a magnitude of 10. What is w in component form?',
    o: [['⟨6, −8⟩', 'correct'], ['⟨−6, 8⟩', 'scales v but keeps its direction'], ['⟨3, −4⟩', 'reverses v but does not change its magnitude'], ['⟨30, −40⟩', 'multiplies by 10 instead of by 10 ÷ |v|']],
    calc: ['−(10 ÷ vec_magnitude) × the components of v (vec_components)', (c) => { const v = vec(c, 'v'); const k = -10 / c.num('vec_magnitude', { vector: 0 }); return vText([round(k * v[0], 6), round(k * v[1], 6)]); }],
    h: ['Read the components of v and work out its magnitude.', 'w = k·v, with k negative for the opposite direction and |k| equal to the wanted magnitude divided by the magnitude of v.'],
    s: 'Read from the figure: v runs from (2, −2) to (−1, 2), so v = ⟨−3, 4⟩ and |v| = √(9 + 16) = 5. To get magnitude 10 in the opposite direction, multiply by k = −10/5 = −2: w = −2⟨−3, 4⟩ = ⟨6, −8⟩.',
  },
]);

// ── Polar and Rectangular Coordinate Conversion (pack 311) ──────────────────

G('ea46bc2b.lo-3', 'Two polar points converted and combined', [
  {
    t: 'distance between two points given on a polar grid', d: 3, need: 'calc',
    spec: polar([{ r: 4, theta: 30, label: 'P' }, { r: 4, theta: 150, label: 'Q' }], { rMax: 5 }),
    alt: 'A polar grid of concentric circles and rays with two points on the same circle: P on a ray in the first quadrant and Q on a ray in the second quadrant, at the same height.',
    q: 'The points P and Q are plotted on the polar grid shown. What is the distance between P and Q?',
    o: [['4√3', 'correct'], ['4', 'takes the triangle formed with the pole to be equilateral'], ['8', 'takes the two points to be at opposite ends of a diameter'], ['2√3', 'gives the distance from one point to the vertical axis only']],
    calc: ['the distance between the rectangular positions r cos θ, r sin θ of the two points (spec)', (c) => { const [p, q] = [zOf(c, 'P'), zOf(c, 'Q')]; return ex(Math.hypot(p[0] - q[0], p[1] - q[1])); }],
    h: ['Convert each point to rectangular coordinates with x = r cos θ and y = r sin θ.', 'Compare the two y-coordinates before you reach for the distance formula.'],
    s: 'Read from the figure: P is (4, 30°) and Q is (4, 150°). In rectangular coordinates P = (4 cos 30°, 4 sin 30°) = (2√3, 2) and Q = (4 cos 150°, 4 sin 150°) = (−2√3, 2). They have the same y-coordinate, so the distance is the difference of the x-coordinates: 2√3 − (−2√3) = 4√3.',
  },
  {
    t: 'combine a coordinate of each of two polar points', d: 3, need: 'calc',
    spec: polar([{ r: 4, theta: 240, label: 'P' }, { r: 2, theta: 150, label: 'Q' }], { rMax: 5 }),
    alt: 'A polar grid of concentric circles and rays with two points: P on a ray in the third quadrant, and Q closer to the pole on a ray in the second quadrant.',
    q: 'The points P and Q are plotted on the polar grid shown. In rectangular coordinates, what is the x-coordinate of P plus the y-coordinate of Q?',
    n: '-1',
    calc: ['r cos θ of P plus r sin θ of Q (spec)', (c) => round(zOf(c, 'P')[0] + zOf(c, 'Q')[1], 9)],
    h: ['Use x = r cos θ for P and y = r sin θ for Q.', 'P lies in quadrant III, where the cosine is negative; Q lies in quadrant II, where the sine is positive.'],
    s: 'Read from the figure: P is (4, 240°) and Q is (2, 150°). The x-coordinate of P is 4 cos 240° = 4 × (−1/2) = −2. The y-coordinate of Q is 2 sin 150° = 2 × (1/2) = 1. The sum is −2 + 1 = −1.',
  },
]);

// ── Degrees, radians, arc length, sector area (pack 313) ────────────────────

G('ecdeb75a.lo-4', 'Arc length: the other arc, and the radius', [
  {
    t: 'length of the major arc from the angle of the minor arc', d: 3, need: 'calc',
    spec: circle({ radius: 9, points: [{ name: 'P', at: 0 }, { name: 'Q', at: 80 }], radii: [{ to: 'P', label: 'auto' }, { to: 'Q' }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: 'auto' }], unit: 'cm' }),
    alt: 'A circle with two radii drawn to the points P and Q on it. One radius is labelled with its length in centimetres, and the smaller angle between the two radii at the centre is labelled with its size in degrees.',
    q: 'In the circle shown, what is the length of the major arc PQ — the longer of the two arcs from P to Q — in centimetres?',
    o: [['14π', 'correct'], ['4π', 'gives the minor arc'], ['2520', 'multiplies the radius by an angle in degrees'], ['7π', 'uses half of the remaining angle']],
    calc: ['radius × (360° − the labelled central angle) in radians (spec; geo_angle for the record)', (c) => { const a = c.num('geo_angle', { angle: 0 }); const k = ((360 - a) / 180) * (c.p.radius as number); if (!near(k, Math.round(k), 1e-9)) throw new Error('not a whole multiple of π'); return `${Math.round(k)}π`; }],
    h: ['The major arc belongs to the rest of the full turn: subtract the labelled angle from 360°.', 'Arc length = radius × angle, with the angle in radians.'],
    s: 'Read from the figure: the radius is 9 cm and the central angle of the minor arc is 80°. The major arc subtends 360° − 80° = 280°, which is 280π/180 = 14π/9 radians. Its length is 9 × 14π/9 = 14π cm.',
  },
  {
    t: 'radius from an arc length and an angle in degrees', d: 3, need: 'calc',
    spec: circle({ radius: 8, points: [{ name: 'P', at: 0 }, { name: 'Q', at: 135 }], radii: [{ to: 'P' }, { to: 'Q' }], angles: [{ vertex: 'center', from: 'P', to: 'Q', label: 'auto' }], arc: { from: 'P', to: 'Q', label: '6π cm' } }),
    alt: 'A circle with two radii drawn to the points P and Q on it. The angle between the radii at the centre is labelled with its size in degrees, and the heavier arc from P to Q is labelled with its length as a multiple of π, in centimetres. The radius is not labelled.',
    q: 'In the circle shown, the heavier arc PQ has the length marked on it. What is the radius of the circle, in centimetres?',
    n: '8',
    calc: ['the radius of the spec; checked: radius × the labelled angle in radians (geo_angle) is the 6π printed on the arc', (c) => { const a = c.num('geo_angle', { angle: 0 }); const r = c.p.radius as number; if (!near((a / 180) * r, 6, 1e-9) || ((c.p.arc as P).label as string) !== '6π cm') throw new Error('the arc label does not match'); return r; }],
    h: ['The formula s = rθ needs the angle in radians, so convert the labelled angle first.', 'Then solve s = rθ for r.'],
    s: 'Read from the figure: the arc length is 6π cm and the central angle is 135°, which is 135π/180 = 3π/4 radians. From s = rθ, r = s / θ = 6π ÷ (3π/4) = 6π × 4/(3π) = 8 cm.',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// AP CALCULUS AB — slope fields (the objective three items)
// ════════════════════════════════════════════════════════════════════════════

/** The solution of the field's equation through (x0, y0), followed to x1 with small Runge–Kutta steps. */
function follow(f: F2, x0: number, y0: number, x1: number): number {
  const n = 20000;
  const h = (x1 - x0) / n;
  let [x, y] = [x0, y0];
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y); const k2 = f(x + h / 2, y + (h * k1) / 2); const k3 = f(x + h / 2, y + (h * k2) / 2); const k4 = f(x + h, y + h * k3);
    y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6; x += h;
  }
  return y;
}
const ALT_FIELD = 'A slope field on a coordinate grid: one short line segment at every point with whole-number coordinates from −3 to 3 in both directions.';

G('c898192b.lo-1', 'Reading a slope field as an equation', [
  {
    t: 'match the field to its equation from where the segments are level', d: 3, need: 'reason',
    spec: sfield('x*(y - 1)/2'),
    alt: `${ALT_FIELD} The segments are level along one vertical line and along one horizontal line, and tilt more the further they are from both.`,
    q: 'The slope field shown belongs to one of these differential equations. Which one?',
    o: [['dy/dx = x(y − 1)/2', 'correct'], ['dy/dx = x(y + 1)/2', 'places the row of level segments below the x-axis'], ['dy/dx = y(x − 1)/2', 'exchanges the roles of x and y'], ['dy/dx = (x + y − 1)/2', 'makes the level segments lie on one slanted line']],
    holds: ['each equation compared with the spec\'s own equation at every lattice point drawn', [
      (c) => sameField(c, (x, y) => (x * (y - 1)) / 2),
      (c) => sameField(c, (x, y) => (x * (y + 1)) / 2),
      (c) => sameField(c, (x, y) => (y * (x - 1)) / 2),
      (c) => sameField(c, (x, y) => (x + y - 1) / 2),
    ]],
    h: ['Find every place where the segments are level: there dy/dx = 0, so the right-hand side of the equation must be zero there.', 'Then check the sign of the slope at one point away from those places, for example at (2, 2).'],
    s: 'Read from the figure: the segments are level all along the y-axis (x = 0) and all along the horizontal line y = 1, and nowhere else. So dy/dx is zero exactly when x = 0 or y = 1, which fits x(y − 1)/2. At (2, 2) the segment rises with slope 1, and 2(2 − 1)/2 = 1. The other equations are zero on y = −1, on x = 1 and y = 0, or on the slanted line x + y = 1.',
  },
  {
    t: 'find the constant from one segment and use it outside the field', d: 3, need: 'calc',
    spec: sfield('-x*y/2'),
    alt: `${ALT_FIELD} The segments are level along both axes; they fall in the first and third quadrants and rise in the second and fourth.`,
    q: 'The slope field shown belongs to a differential equation of the form dy/dx = k·x·y for a constant k. According to this equation, what is the slope of the solution curve that passes through the point (4, 3), which lies outside the part of the field that is drawn?',
    n: '-6',
    calc: ['k from the slope of the spec\'s equation at (2, 1); the form k·x·y checked at every lattice point drawn; then k × 4 × 3', (c) => { const f = slopeFn(c.p.expr as string); const k = f(2, 1) / 2; if (!sameField(c, (x, y) => k * x * y)) throw new Error('the field is not k·x·y'); return k * 4 * 3; }],
    h: ['Pick a lattice point where the slope of the segment is easy to read — a segment at 45° has slope 1 or −1 — and put its coordinates into dy/dx = k·x·y.', 'Once you know k, the equation gives the slope at any point, drawn or not.'],
    s: 'Read from the figure: at the point (2, 1) the segment falls at 45°, so the slope there is −1. Then −1 = k × 2 × 1 gives k = −1/2. At (4, 3) the equation gives dy/dx = (−1/2)(4)(3) = −6.',
  },
  {
    t: 'long-run behaviour of the solution through a given point', d: 3, need: 'reason',
    spec: sfield('(1 - y)*(y + 2)/2'),
    alt: `${ALT_FIELD} Within each horizontal row all the segments have the same tilt; the segments are level along two of the rows, rise in the rows between them and fall in the rows above and below.`,
    q: 'The slope field of a differential equation is shown. A solution curve passes through the origin. According to the slope field, what value does y approach on this solution as x increases without bound?',
    n: '1',
    calc: ['the spec\'s equation followed numerically from (0, 0) to x = 40 (Runge–Kutta); the slope there must have died away', (c) => { const f = slopeFn(c.p.expr as string); const y = follow(f, 0, 0, 40); if (Math.abs(f(40, y)) > 1e-6) throw new Error('the solution has not settled'); return round(y, 4); }],
    h: ['Find the rows in which every segment is level: those horizontal lines are themselves solutions, and other solutions cannot cross them.', 'Look at the sign of the slope at the origin to see which way the solution moves from there.'],
    s: 'Read from the figure: the segments are level along y = 1 and along y = −2, so these constant functions are solutions. At the origin, between them, the segments rise (slope 1), and they rise at every point between the two lines, getting flatter toward y = 1. So the solution through the origin climbs and levels off below y = 1: y approaches 1 (not −2, which it moves away from).',
  },
]);

// ════════════════════════════════════════════════════════════════════════════
// PHYSICS, AP CHEMISTRY, AP CALCULUS AB — four more objectives within the cap
// ════════════════════════════════════════════════════════════════════════════

const motion = (quantity: 'position' | 'velocity', points: Array<[number, number]>, params: P): Spec => S('motion_graph', { quantity, series: [{ points }], interpolation: 'linear', showPoints: false, tStep: 2, tLabel: 'time (s)', ...params });
const area = (c: Ctx, t1: number, t2: number): number => c.num('series_area', { series: 0, t1, t2 });
const corners = (c: Ctx): Array<[number, number]> => (arr(c.p.series)[0].points as Array<[number, number]>);

// ── Position-Time and Velocity-Time Graphs (pack 215) ───────────────────────

G('2b38f7f9.lo-1', 'Position–time graphs: average speed, average velocity, a second object', [
  {
    t: 'ratio of average speed to the size of the average velocity', d: 3, need: 'calc',
    spec: motion('position', [[2, 10], [6, 50], [10, 50], [12, -10]], { tRange: [0, 14], yRange: [-20, 60], yStep: 10, yLabel: 'position (m)' }),
    alt: 'A position–time graph made of three straight stages: the position rises, stays the same for a while, then drops quickly to below the starting position and below zero.',
    q: 'The position–time graph of a cart on a straight track is shown. Over the whole time covered by the graph, how many times greater is the cart\'s average speed than the size of its average velocity?',
    n: '5',
    calc: ['(sum of the sizes of the position changes between corners) ÷ |last position − first position| (spec corners; series_value at the two ends for the record)', (c) => { const k = corners(c); const first = c.num('series_value', { series: 0, t: k[0][0] }); const last = c.num('series_value', { series: 0, t: k[k.length - 1][0] }); let dist = 0; for (let i = 1; i < k.length; i++) dist += Math.abs(k[i][1] - k[i - 1][1]); return dist / Math.abs(last - first); }],
    h: ['Average speed uses the total distance travelled; average velocity uses the displacement, the change in position from start to finish.', 'Both are divided by the same total time, so the ratio you want is distance ÷ size of displacement.'],
    s: 'Read from the figure: the cart moves from 10 m to 50 m (40 m), rests, and then moves from 50 m to −10 m (60 m). The distance travelled is 40 + 60 = 100 m. The displacement is −10 − 10 = −20 m, of size 20 m. Both are divided by the same 10 s, so the average speed (10 m/s) is 100 / 20 = 5 times the size of the average velocity (2 m/s).',
  },
  {
    t: 'constant velocity a second object needs to meet the first at a turning point', d: 3, need: 'calc',
    spec: motion('position', [[2, 20], [6, 40], [10, 40], [14, 0]], { tRange: [0, 16], yRange: [0, 50], yStep: 10, yLabel: 'position (m)' }),
    alt: 'A position–time graph made of three straight stages: the position rises, stays the same for a while, then falls steadily back to zero.',
    q: 'The position–time graph of a robot on a straight track is shown. A second robot leaves position 0 m at t = 2 s and moves at a constant velocity. It reaches the first robot at the instant the first robot starts to move back toward position 0 m. What is the velocity of the second robot, in m/s?',
    n: '5',
    calc: ['the corner after which the position falls (spec corners): its position ÷ (its time − 2 s); series_value there for the record', (c) => { const k = corners(c); const i = k.findIndex((q, j) => j + 1 < k.length && k[j + 1][1] < q[1]); return c.num('series_value', { series: 0, t: k[i][0] }) / (k[i][0] - 2); }],
    h: ['Find the instant at which the graph starts to go down, and read the time and the position there.', 'The second robot covers that position, from 0 m, in the time from t = 2 s to that instant; its graph would be one straight line.'],
    s: 'Read from the figure: the first robot starts to move back at t = 10 s, where its position is 40 m. The second robot goes from 0 m at t = 2 s to 40 m at t = 10 s: a change of 40 m in 8 s. Its velocity is 40 / 8 = 5 m/s.',
  },
]);

G('2b38f7f9.lo-3', 'Velocity–time graphs: signed areas used', [
  {
    t: 'time at which the object is back where it started', d: 3, need: 'calc',
    spec: motion('velocity', [[2, 6], [5, 6], [8, -6], [12, -6]], { tRange: [0, 14], yRange: [-8, 8], yStep: 2, yLabel: 'velocity (m/s)' }),
    alt: 'A velocity–time graph made of three straight stages: the velocity is steady and positive, then falls steadily through zero to a negative value, then stays steady at that negative value.',
    q: 'The velocity–time graph of a cart on a straight track is shown, starting at t = 2 s. At what time, in seconds, is the cart back at the position it had at t = 2 s?',
    n: '11',
    calc: ['the first time after t = 2 s (in steps of 1 s, the gridlines) at which the signed area under the line from t = 2 s is zero (series_area)', (c) => { for (let t = 3; t <= 12; t += 1) if (near(area(c, 2, t), 0, 1e-9)) return t; throw new Error('never back'); }],
    h: ['The displacement is the signed area between the line and the time axis: area above the axis counts as positive, area below as negative.', 'Find the displacement up to the moment the velocity becomes steady and negative, then work out how long that steady velocity takes to cancel it.'],
    s: 'Read from the figure: from t = 2 s to 5 s the velocity is 6 m/s, a displacement of 18 m. From 5 s to 8 s the velocity falls from 6 to −6 m/s; the areas above and below the axis are equal, so this stage adds 0 m. At t = 8 s the cart is still 18 m ahead. It then moves at −6 m/s and needs 18 / 6 = 3 s to return: t = 8 + 3 = 11 s.',
  },
  {
    t: 'average velocity over an interval in which the velocity changes sign', d: 3, need: 'calc',
    spec: motion('velocity', [[2, 8], [6, 8], [10, -8], [12, -8]], { tRange: [0, 14], yRange: [-10, 10], yStep: 2, yLabel: 'velocity (m/s)' }),
    alt: 'A velocity–time graph made of three straight stages: the velocity is steady and positive, then falls steadily through zero to a negative value, then stays steady at that negative value for a short time.',
    q: 'The velocity–time graph of a cart on a straight track is shown. What is the average velocity of the cart from t = 2 s to t = 12 s, in m/s?',
    n: '1.6',
    calc: ['signed area under the line from t = 2 s to t = 12 s (series_area) ÷ 10 s', (c) => area(c, 2, 12) / 10],
    h: ['Average velocity is the displacement divided by the time taken — it is not the average of the velocities you can read off.', 'Get the displacement as a signed area, stage by stage; the part below the time axis counts as negative.'],
    s: 'Read from the figure: from 2 s to 6 s the velocity is 8 m/s: +32 m. From 6 s to 10 s it falls from 8 to −8 m/s, with equal areas above and below the axis: 0 m. From 10 s to 12 s it is −8 m/s: −16 m. The displacement is 32 + 0 − 16 = 16 m in 10 s, so the average velocity is 16 / 10 = 1.6 m/s.',
  },
]);

// ── Endothermic and Exothermic Processes (pack 196) ─────────────────────────

const rc = (params: P): Spec => S('reaction_coordinate', { reactantLabel: 'reactants', productLabel: 'products', units: 'kJ/mol', showAxisValues: true, ...params });

G('f79ce0db.lo-2', 'Enthalpy change read from a diagram and used', [
  {
    t: 'energy absorbed or released by a stated amount of reactant', d: 3, need: 'calc',
    spec: rc({ reactantsEnergy: 20, productsEnergy: 80, activationEnergies: [100] }),
    alt: 'An energy diagram: a curve starts at a level marked reactants, rises over a single peak and comes down to a level marked products that is higher than the reactant level. The vertical axis is numbered in kilojoules per mole.',
    q: 'The energy diagram shown is for a reaction as written, per mole of reaction. How much energy is absorbed or released when 0.25 mol of the reaction takes place?',
    o: [['15 kJ absorbed', 'correct'], ['15 kJ released', 'reverses the sign of the enthalpy change'], ['25 kJ absorbed', 'uses the activation energy instead of the enthalpy change'], ['20 kJ absorbed', 'uses the product level itself instead of the difference of the levels']],
    calc: ['0.25 × rc_delta_h, "absorbed" when it is positive', (c) => { const dh = c.num('rc_delta_h'); return `${Math.abs(dh) * 0.25} kJ ${dh > 0 ? 'absorbed' : 'released'}`; }],
    h: ['The enthalpy change is the product level minus the reactant level; the height of the peak plays no part in it.', 'A positive enthalpy change means energy is taken in. Scale it by the amount that reacts.'],
    s: 'Read from the figure: the reactants are at 20 kJ/mol and the products at 80 kJ/mol, so ΔH = 80 − 20 = +60 kJ/mol; the products are higher, so the reaction is endothermic. For 0.25 mol the energy absorbed is 0.25 × 60 = 15 kJ. (The peak, 100 kJ/mol above the reactants, is the activation energy, not ΔH.)',
  },
  {
    t: 'find the false statement about two pathways of one reaction', d: 3, need: 'reason',
    spec: rc({ reactantsEnergy: 40, productsEnergy: -20, activationEnergies: [80, 40], curveLabels: ['I', 'II'] }),
    alt: 'An energy diagram with two curves, I and II, that both start at the level marked reactants and both end at the lower level marked products; curve I passes over a higher peak than curve II. The vertical axis is numbered in kilojoules per mole.',
    q: 'The energy diagram shows the same reaction following two pathways, I and II. Which statement is FALSE?',
    o: [
      ['Pathway II releases less energy than pathway I', 'correct'],
      ['The reaction releases 60 kJ/mol by either pathway', 'reads a peak height as the enthalpy change'],
      ['The reverse reaction is endothermic', 'takes the reverse of a reaction to have the same sign of enthalpy change'],
      ['On pathway I the reverse reaction has the larger activation energy', 'measures the reverse activation energy from the reactant level'],
    ],
    holds: ['rc_delta_h, rc_activation_energy and rc_direction; the option answers the question when its statement is false (both pathways share the two end levels, so one ΔH)', [
      (c) => { c.num('rc_delta_h'); return !false; },
      (c) => !(c.num('rc_delta_h') === -60),
      (c) => !(c.txt('rc_direction') === 'exothermic'),
      (c) => !(c.num('rc_activation_energy', { curve: 0, direction: 'reverse' }) > c.num('rc_activation_energy', { curve: 0, direction: 'forward' })),
    ]],
    h: ['The enthalpy change depends only on the two end levels, reactants and products.', 'An activation energy is measured from the starting level of the direction in question up to the peak.'],
    s: 'Read from the figure: both pathways start at 40 kJ/mol and end at −20 kJ/mol, so ΔH = −20 − 40 = −60 kJ/mol for both: 60 kJ/mol is released whichever pathway is followed, and the reverse reaction absorbs 60 kJ/mol (endothermic). On pathway I the peak is at 120 kJ/mol: forward activation energy 120 − 40 = 80 kJ/mol, reverse 120 − (−20) = 140 kJ/mol. So "Pathway II releases less energy" is false — a lower peak changes the activation energy, not the energy released.',
  },
]);

// ── Estimating Limits from Graphs and Tables (pack 135) ─────────────────────

G('ba15a88f.lo-1', 'Two-sided limits of compositions and squares', [
  {
    t: 'two-sided limit of a composition approached from one side only', d: 4, need: 'reason',
    spec: fgraph({ xRange: [-2, 5], yRange: [0, 5], curves: [{ expr: '4', domain: [-2, 1], to: 'closed', color: BLUE }, { expr: 'abs(x - 2) + 1', domain: [1, 5], from: 'open', color: BLUE }] }),
    alt: 'A graph of one function in two pieces on a grid: a level piece that ends at a filled dot, and a V-shaped piece that starts lower, at an open circle directly below that dot, and has its lowest point further to the right.',
    q: 'The graph of a function f is shown. What is the limit of f(f(x)) as x approaches 2?',
    n: '2',
    calc: ['f(f(2 ± h)) for h shrinking to 0, each f evaluated on the spec\'s pieces with their open and closed ends; both sides must agree', (c) => { const at = (h: number): number => evalF(c, evalF(c, 2 + h)); const [l, r] = [at(-1e-7), at(1e-7)]; if (!near(l, r, 1e-4) || !near(at(1e-5), r, 1e-3)) throw new Error('no two-sided limit'); return round(r, 4); }],
    h: ['First find the height f(x) approaches near the lowest point of the V, and notice from which side — from above or from below — it gets there.', 'Then let the input of the outer f approach that height from that side only, and follow the graph; do not use the value of f at that input.'],
    s: 'Read from the figure: near x = 2 the graph is a V with its lowest point at (2, 1), so f(x) approaches 1, and from above on both sides. Now the outer f receives inputs a little greater than 1. Just to the right of x = 1 the graph starts from the open circle at height 2, so f(f(x)) approaches 2. (f(f(2)) = f(1) = 4, the filled dot, is the value, not the limit.)',
  },
  {
    t: 'limit of the square where the limit of the function does not exist', d: 3, need: 'reason',
    spec: fgraph({ xRange: [-4, 3], yRange: [-6, 7], curves: [{ expr: 'x - 1', domain: [-4, -1], to: 'open', color: BLUE }, { expr: 'x + 3', domain: [-1, 3], from: 'closed', color: BLUE }] }),
    alt: 'A graph of one function in two straight rising pieces on a grid: the left piece lies below the x-axis and ends at an open circle; the right piece starts higher, above the x-axis, at a filled dot directly above that open circle.',
    q: 'The graph of a function f is shown; the limit of f(x) as x approaches −1 does not exist. What is the limit of [f(x)]² as x approaches −1?',
    n: '4',
    calc: ['the squares of the left-hand and right-hand limits of the spec\'s pieces at x = −1, which must agree', (c) => { const [l, r] = [leftLim(pieces(c), -1), rightLim(pieces(c), -1)]; if (near(l, r, 1e-6) || !near(l * l, r * r, 1e-6)) throw new Error('not the intended case'); return round(l * l, 6); }],
    h: ['Read the two one-sided limits of f at x = −1 separately.', 'Square each one-sided limit: the limit of [f(x)]² exists if the two squares agree, even when the two one-sided limits themselves do not.'],
    s: 'Read from the figure: as x approaches −1 from the left, f(x) approaches the open circle at height −2; from the right it approaches the filled dot at height 2. The one-sided limits differ, so the limit of f does not exist. But [f(x)]² approaches (−2)² = 4 from the left and 2² = 4 from the right, so the limit of [f(x)]² is 4.',
  },
]);

// ITEMS-END

/** Low-level-only objectives that get no item here, and why (the rest of the uncovered ones: the cap of about 110 items). */
const NOT_REACHED: Record<string, string> = {
  '869a59a5.lo-1': 'naming the opposite side, the adjacent side and the hypotenuse of a drawn right triangle is a recall-and-read skill; anything harder on the figure becomes a trigonometric-ratio item, which belongs to the neighbouring objectives — no honest level-3 item',
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
  const held = JSON.parse(fs.readFileSync(ROWS_428, 'utf8')) as Row[];
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

  // The job does not GENERATE slope fields; these are authored by hand and looked at
  // one by one, so the kind-level stop (if figure-core still has it) is lifted for this run only.
  const kindStop = RENDERER_NEEDS_WORK.slope_field;
  delete RENDERER_NEEDS_WORK.slope_field;

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
      if (a.spec.type === 'slope_field' && a.ck) bad('a slope-field key is computed in code from the field\'s own equation, not by a checker');
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
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-4 figures)' }, license: 'internal-original', verifiedAt: now,
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
  if (kindStop !== undefined) RENDERER_NEEDS_WORK.slope_field = kindStop;

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set(held.map((r) => r.id));
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (taken.has(r.id as string)) problems.push(`${r.id}: id already used by a released figure row`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) {
    const cap = shortOf(lo) === SLOPE_LO ? 3 : 2;
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
    return { ...base, status: 'not-covered', note: 'outside this batch: the cap of about 110 items went to Algebra 2, Precalculus and AP Biology first' };
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
    slopeFieldItems: meta.filter((m) => m.item.spec.type === 'slope_field').map((m) => ({ id: m.id, task: m.item.t, format: m.format, level: m.item.d })),
    lowLevelOnlyObjectives: {
      rule: 'every released figure item of the objective (release-2026-10-15/figure-rows-428.json) has difficulty ≤ 2',
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
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-batch4${wip ? '-wip' : ''}.json`), JSON.stringify(rows, null, 2) + '\n');
  if (!wip) {
    fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'final', 'upgraded-objectives.json'), JSON.stringify(upgraded, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    if (fs.existsSync(path.join(outDir, 'final', 'figure-rows-batch4-wip.json'))) fs.unlinkSync(path.join(outDir, 'final', 'figure-rows-batch4-wip.json'));
  }
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-4 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-4 figure practice items — ${rows.length} harder items for the low-level-only objectives</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

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
