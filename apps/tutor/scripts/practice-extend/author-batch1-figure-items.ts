/**
 * Hand-authored practice items that are read off a FIGURE of one of the
 * twelve batch-1 kinds (unit circle, vectors, free-body diagram v2, shaded
 * region, number line, sign chart, normal curve, histogram, box plot,
 * complex / polar plane, Punnett square, pedigree) — and, where an objective
 * of the 105-objective figure list can be carried by an older kind
 * (function graph, bar chart, titration curve), of that kind.
 *
 * Every item is data in this file. For every item the script
 *   - draws the figure (`buildPracticeFigure`) and runs the SVG safety check,
 *     the legibility report (no warning allowed) and the job's rule checks;
 *   - PROVES the key from the figure spec: by a figure-core checker whose
 *     result is the key (`ck`), by code that combines checker results
 *     (`calc` / `holds` using `c.run`), or by code on the kind's own model;
 *     an item whose key does not follow from its spec stops the run;
 *   - shuffles and letters the options with a seeded shuffle (the correct
 *     option is written FIRST in this file).
 * It then writes ProblemBank-shaped rows (insert-only import — NOT imported
 * here), the audited ids, the mapping of the 105 objectives, a gallery page,
 * PNGs at the 340 px column (2×) and a summary.
 *
 * No database, no network, no model. Run:
 *   env -u MONGODB_URI -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
 *     npx tsx scripts/practice-extend/author-batch1-figure-items.ts [--out <dir>] [--check]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { compileExpression } from '../../src/lib/tutor/practice-figure/expr';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure, titrationPH, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { Reader } from '../../src/lib/tutor/practice-figure/spec';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { freeBodyModel, type FreeBodyModel } from '../../src/lib/tutor/practice-figure/kinds/free-body';
import { signChartModel } from '../../src/lib/tutor/practice-figure/kinds/number-line';
import { pedigreeModel, type PedigreeModel } from '../../src/lib/tutor/practice-figure/kinds/pedigree';
import { polarComplexModel } from '../../src/lib/tutor/practice-figure/kinds/polar-complex';
import { punnettModel } from '../../src/lib/tutor/practice-figure/kinds/punnett';
import { satisfies, shadedRegionModel, type Inequality, type ShadedRegionModel } from '../../src/lib/tutor/practice-figure/kinds/shaded-region';
import { distributionModel } from '../../src/lib/tutor/practice-figure/kinds/distribution';
import { unitCircleModel } from '../../src/lib/tutor/practice-figure/kinds/unit-circle';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { INHERITANCE_MODES, canonText, derivedText, describeFigure, examineFigureItem, pedigreeConsistent, runChecker, type Derived, type FigureItem, type InheritanceMode } from './figure-core';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-11-batch1`;
const OBJECTIVES_105 = `${INTEGRATION}/practice-extension-2026-10-09/coverage-run/figure-objectives.json`;
const ROWS_60 = `${INTEGRATION}/practice-figures-2026-10-10-slope/final/figure-rows-60.json`;
const PACKS = `${INTEGRATION}/practice-depth-2026-10-10/packs`;
const PNG_WIDTH = 680; // the 340 px column at 2×

type P = Record<string, unknown>;
type Spec = PracticeFigureSpec;

// ── proof context ───────────────────────────────────────────────────────────

class Ctx {
  used: Array<{ checker: string; args: P; result: string }> = [];
  constructor(public spec: Spec) {}
  get p(): P { return this.spec.params; }
  run(checker: string, args: P = {}): Derived {
    const d = runChecker(this.spec, { checker, args });
    this.used.push({ checker, args, result: derivedText(d) });
    return d;
  }
  num(checker: string, args: P = {}): number {
    const d = this.run(checker, args);
    if (d.kind !== 'number') throw new Error(`${checker} gave no number`);
    return d.value;
  }
  txt(checker: string, args: P = {}): string {
    const d = this.run(checker, args);
    if (d.kind === 'number') return String(d.value);
    if (d.kind === 'numbers') return d.values.join(',');
    return d.value;
  }
  model<T>(build: (r: Reader) => T): T { return build(new Reader(this.spec.type, this.spec.params)); }
  fn(expr: string): (x: number) => number { return compileExpression(expr, ['x']); }
}

interface A {
  /** Task kind — unique within an objective. */
  t: string;
  d: 1 | 2 | 3;
  spec: Spec;
  alt: string;
  q: string;
  /** mcq: [text, the mistake behind it]; the CORRECT option first (its second entry is 'correct'). */
  o?: Array<[string, string]>;
  /** numeric: the stated key. */
  n?: string;
  /** The key is the result of this figure-core checker on the spec. */
  ck?: [string, P];
  /** The key is this value, computed in code from the spec (description, function). */
  calc?: [string, (c: Ctx) => string | number];
  /** mcq: the truth of each option as written (correct first), computed from the spec. */
  holds?: [string, Array<(c: Ctx) => boolean>];
  h: [string, string];
  s: string;
  /** The answer does not rest on these off-grid features (old kinds, no checker): why. */
  offGridOk?: string;
}
interface Item extends A { lo: string; sub: string; list: boolean }

const ITEMS: Item[] = [];
/** `lo` is "<first block of the plan id>.lo-N"; resolved against the lesson packs. */
function G(lo: string, sub: string, items: A[]): void {
  for (const a of items) ITEMS.push({ ...a, lo, sub, list: false });
}

const S = (type: string, params: P): Spec => ({ type, params });
const near = (a: number, b: number, tol = 1e-9): boolean => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
/** Simpson's rule — exact for the polynomials used here up to degree 3; n is even. */
function integrate(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
const round = (v: number, dp: number): number => Number(v.toFixed(dp));
const minus = (v: number | string): string => String(v).replace(/-/g, '−');

// ── helpers for particular kinds ────────────────────────────────────────────

/** Punnett. */
const pun = (top: string[], side: string[], extra: P = {}): Spec => S('punnett_square', { top, side, ...extra });
const cellsOf = (c: Ctx): string[] => c.model(punnettModel).cells.flat().map((x) => x.genotype);

/** Pedigree: [id, sex, affected?, father?, mother?]. */
type Ind = [string, 'M' | 'F', 0 | 1, string?, string?];
const ped = (inds: Ind[], extra: P = {}): Spec => S('pedigree', {
  individuals: inds.map(([id, sex, aff, father, mother]) => ({ id, sex, affected: aff === 1, ...(father ? { father, mother } : {}) })),
  ...extra,
});
const pedM = (c: Ctx): PedigreeModel => c.model(pedigreeModel);
const numberOf = (c: Ctx, id: string): string => {
  const i = pedM(c).individuals.find((x) => x.id === id);
  if (!i) throw new Error(`no individual ${id}`);
  return i.number;
};
const byNumber = (c: Ctx, number: string) => {
  const i = pedM(c).individuals.find((x) => x.number === number);
  if (!i) throw new Error(`no individual numbered ${number}`);
  return i;
};
const MODE: Record<string, InheritanceMode> = { AD: 'autosomal_dominant', AR: 'autosomal_recessive', XD: 'x_linked_dominant', XR: 'x_linked_recessive' };
const fits = (c: Ctx, mode: keyof typeof MODE): boolean => c.txt('pedigree_mode_consistent', { mode: MODE[mode] }) === 'yes';
/** The modes the chart fits when one individual's status is hidden (a "?"). */
const fitsWithout = (c: Ctx, number: string, mode: keyof typeof MODE): boolean => {
  const m = pedM(c);
  const hidden: PedigreeModel = { ...m, individuals: m.individuals.map((i) => (i.number === number ? { ...i, unknown: true, affected: false } : i)) };
  return pedigreeConsistent(hidden, MODE[mode]);
};
void INHERITANCE_MODES;
/** Autosomal recessive: the genotypes an individual can have, from the phenotype, the children and the parents shown ("AA|Aa", "Aa", "aa"). */
function arGenotypes(c: Ctx, number: string): string {
  const m = pedM(c);
  const me = byNumber(c, number);
  if (me.affected) return 'aa';
  const kids = m.individuals.filter((k) => k.father === me.id || k.mother === me.id);
  const parents = m.individuals.filter((k) => k.id === me.father || k.id === me.mother);
  // An affected child, or an affected parent, forces a copy of a.
  return kids.some((k) => k.affected) || parents.some((k) => k.affected) ? 'Aa' : 'AA|Aa';
}

/** Sign chart. */
const sc = (critical: number[], rows: Array<{ label: string; signs: string[]; at?: string[]; blankSigns?: number[] }>, extra: P = {}): Spec => S('sign_chart', { critical, rows, ...extra });

/** Shaded region. */
const ineq = (a: number, b: number, op: Inequality['op'], c: number): Inequality => ({ a, b, op, c });
const regionI = (xRange: [number, number], yRange: [number, number], inequalities: Inequality[], extra: P = {}): Spec =>
  S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'inequalities', inequalities, ...extra } });
const regM = (c: Ctx): ShadedRegionModel => c.model(shadedRegionModel);
/** Does this system shade exactly what the figure shades? Compared at every half-unit point of the plot. */
function sameSystem(c: Ctx, system: Inequality[]): boolean {
  const m = regM(c);
  if (m.region.type !== 'inequalities') throw new Error('not an inequalities region');
  const mine = m.region.inequalities;
  for (let x = m.xRange[0]; x <= m.xRange[1]; x += 0.5) {
    for (let y = m.yRange[0]; y <= m.yRange[1]; y += 0.5) {
      if (mine.every((k) => satisfies(k, x, y)) !== system.every((k) => satisfies(k, x, y))) return false;
    }
  }
  return true;
}
const inRegion = (c: Ctx, x: number, y: number): boolean => c.txt('region_contains', { x, y }) === 'yes';
const verticesOf = (c: Ctx): Array<[number, number]> => {
  const m = regM(c);
  if (m.region.type !== 'inequalities') throw new Error('not an inequalities region');
  c.run('region_area'); // refuses unless every corner is on a gridline and the region is closed
  return m.region.vertices.map((v) => [round(v[0], 6), round(v[1], 6)]);
};
const isVertex = (c: Ctx, x: number, y: number): boolean => verticesOf(c).some((v) => near(v[0], x) && near(v[1], y));
/** The curves that bound an under-curve / between-curves region: [upper, lower, from, to]. */
function bounds(c: Ctx): { up: (x: number) => number; lo: (x: number) => number; a: number; b: number } {
  const g = regM(c).region;
  if (g.type === 'under_curve') return { up: g.curve.fn, lo: () => 0, a: g.from, b: g.to };
  if (g.type === 'between_curves') return { up: g.upper.fn, lo: g.lower.fn, a: g.from, b: g.to };
  throw new Error('not a region between curves');
}
/** An option that is an integral: k · ∫ₐᵇ f(x) dx, f written as an expression in x. */
const integral = (k: number, expr: string, a: number, b: number): number => k * integrate(compileExpression(expr, ['x']), a, b);

/** Free-body diagram v2. */
const fbd = (forces: P[], extra: P = {}): Spec => S('free_body_diagram_v2', { forces, ...extra });
const F = (label: string, direction: string | number, magnitude?: number, extra: P = {}): P => ({ label, direction, ...(magnitude !== undefined ? { magnitude } : {}), ...extra });
const fbdM = (c: Ctx): FreeBodyModel => c.model(freeBodyModel);
const forceDeg = (c: Ctx, label: string): number => {
  const f = fbdM(c).forces.filter((x) => x.label === label);
  if (f.length !== 1) throw new Error(`force ${label} not found once`);
  return f[0].degrees;
};

/** Vectors. */
const vecs = (xRange: [number, number], yRange: [number, number], vectors: P[], extra: P = {}): Spec => S('vector_diagram', { xRange, yRange, xStep: 1, yStep: 1, vectors, ...extra });
const comp = (c: Ctx, k: number): [number, number] => [c.num('vec_components', { vector: k, want: 'x' }), c.num('vec_components', { vector: k, want: 'y' })];
const angle = (x: number, y: number): string => `⟨${minus(x)}, ${minus(y)}⟩`;
const sameVec = (u: [number, number], v: [number, number]): boolean => near(u[0], v[0]) && near(u[1], v[1]);

/** Complex / polar plane. */
const cplane = (points: P[], extra: P = {}): Spec => S('polar_complex', { plane: 'complex', range: 6, step: 1, points, ...extra });
const polar = (extra: P): Spec => S('polar_complex', { plane: 'polar', ...extra });
const pcM = (c: Ctx) => c.model(polarComplexModel);
function complexText(re: number, im: number): string {
  if (im === 0) return minus(re);
  const imag = `${Math.abs(im) === 1 ? '' : Math.abs(im)}i`;
  if (re === 0) return `${im < 0 ? '−' : ''}${imag}`;
  return `${minus(re)} ${im < 0 ? '−' : '+'} ${imag}`;
}
/** The curve of a polar figure, sampled every tenth of a degree, as points of the plane. */
function polarSamples(c: Ctx): Array<{ deg: number; r: number; x: number; y: number }> {
  const cv = pcM(c).curve;
  if (!cv) throw new Error('the figure has no curve');
  const out: Array<{ deg: number; r: number; x: number; y: number }> = [];
  for (let k = 0; k <= Math.round((cv.to - cv.from) * 10); k++) {
    const deg = cv.from + k / 10;
    const t = (deg * Math.PI) / 180;
    const r = cv.fn(t);
    out.push({ deg, r, x: r * Math.cos(t), y: r * Math.sin(t) });
  }
  return out;
}
/** Is the drawn curve unchanged by this reflection? (every sample lands on the curve) */
function symmetric(c: Ctx, map: (x: number, y: number) => [number, number]): boolean {
  const pts = polarSamples(c);
  return pts.filter((_, i) => i % 25 === 0).every((q) => {
    const [x, y] = map(q.x, q.y);
    return pts.some((w) => Math.hypot(w.x - x, w.y - y) < 0.02);
  });
}

/** Unit circle. */
const ucircle = (angles: P[], extra: P = {}): Spec => S('unit_circle', { angles, ...extra });
const ucDeg = (c: Ctx, k = 0): number => c.model(unitCircleModel).angles[k].degrees;

/** Function graph (older kind): one-sided behaviour of a function given in pieces. */
interface Piece { f: (x: number) => number; a: number; b: number }
function piecesOf(c: Ctx): Piece[] {
  const curves = (c.p.curves as P[]) ?? [];
  const xr = c.p.xRange as [number, number];
  return curves.map((cv) => {
    const dom = (cv.domain as [number | null, number | null] | undefined) ?? [null, null];
    return { f: compileExpression(cv.expr as string, ['x']), a: dom[0] ?? xr[0], b: dom[1] ?? xr[1] };
  });
}
/** Limit from one side at x0 (NaN when no piece reaches x0 from that side). */
function sideLimit(c: Ctx, x0: number, side: -1 | 1): number {
  const pc = piecesOf(c).find((q) => (side < 0 ? q.a < x0 - 1e-9 && q.b >= x0 - 1e-9 : q.b > x0 + 1e-9 && q.a <= x0 + 1e-9));
  if (!pc) return NaN;
  const v = pc.f(x0 + side * 1e-10);
  return Math.abs(v) > 1e5 ? Math.sign(v) * Infinity : round(v, 4);
}
/** Slope from one side at x0. */
function sideSlope(c: Ctx, x0: number, side: -1 | 1): number {
  const pc = piecesOf(c).find((q) => (side < 0 ? q.a < x0 - 1e-9 && q.b >= x0 - 1e-9 : q.b > x0 + 1e-9 && q.a <= x0 + 1e-9));
  if (!pc) return NaN;
  const h = 1e-6;
  const m = (pc.f(x0 + side * 2 * h) - pc.f(x0 + side * h)) / (side * h);
  return Math.abs(m) > 200 ? Math.sign(m) * Infinity : round(m, 3);
}
type Smooth = 'smooth' | 'jump' | 'corner' | 'vertical tangent' | 'cusp' | 'gap';
/** What the graph does at x0, from its pieces. */
function behaviourAt(c: Ctx, x0: number): Smooth {
  const l = sideLimit(c, x0, -1);
  const r = sideLimit(c, x0, 1);
  if (Number.isNaN(l) || Number.isNaN(r) || !Number.isFinite(l) || !Number.isFinite(r)) return 'gap';
  if (!near(l, r, 1e-4)) return 'jump';
  const ml = sideSlope(c, x0, -1);
  const mr = sideSlope(c, x0, 1);
  if (!Number.isFinite(ml) && !Number.isFinite(mr)) return ml === mr ? 'vertical tangent' : 'cusp';
  return near(ml, mr, 1e-2) ? 'smooth' : 'corner';
}
/** Whole-number x inside the plot (ends excluded) where the function is not differentiable. */
const roughPoints = (c: Ctx): number[] => {
  const xr = c.p.xRange as [number, number];
  const out: number[] = [];
  for (let x = Math.ceil(xr[0]) + 1; x < xr[1]; x++) if (behaviourAt(c, x) !== 'smooth') out.push(x);
  return out;
};
/** Do two functions agree on the plot (sampled)? */
function sameCurve(c: Ctx, k: number, g: (x: number) => number): boolean {
  const pc = piecesOf(c)[k];
  for (let i = 0; i <= 400; i++) {
    const x = pc.a + ((pc.b - pc.a) * i) / 400;
    const u = pc.f(x);
    const v = g(x);
    if (!Number.isFinite(u) || Math.abs(u) > 50) continue;
    if (!Number.isFinite(v) || Math.abs(u - v) > 1e-6) return false;
  }
  return true;
}
/** Do two functions have the same sign everywhere on the plot (same zeros, same sides)? */
function sameSigns(c: Ctx, k: number, g: (x: number) => number): boolean {
  const pc = piecesOf(c)[k];
  for (let i = 0; i <= 2000; i++) {
    const x = pc.a + ((pc.b - pc.a) * i) / 2000;
    const u = pc.f(x);
    const v = g(x);
    if (Math.sign(Math.abs(u) < 1e-9 ? 0 : u) !== Math.sign(Math.abs(v) < 1e-9 ? 0 : v)) return false;
  }
  return true;
}
/** pH at the equivalence volume / at the start of a titration figure, from the chemistry of its spec. */
function titrationAt(c: Ctx, at: 'eq' | 'start'): number {
  const an = c.p.analyte as { type: 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base'; concentration: number; volume: number; pKa?: number; pKb?: number };
  const cT = c.p.titrantConcentration as number;
  const k = an.type === 'weak_acid' ? 10 ** -(an.pKa as number) : an.type === 'weak_base' ? 1e-14 / 10 ** -(an.pKb as number) : 0;
  return titrationPH(an.type, k, an.concentration, an.volume, cT, at === 'eq' ? (an.concentration * an.volume) / cT : 0);
}
const eqPH = (c: Ctx): number => titrationAt(c, 'eq');
const startPH = (c: Ctx): number => titrationAt(c, 'start');
const fgraph = (xRange: [number, number], yRange: [number, number], curves: P[], extra: P = {}): Spec => S('function_graph', { xRange, yRange, xStep: 1, yStep: 1, curves, ...extra });

// ═══════════════════════════════════════════════════════════════════════════
// THE ITEMS
// ═══════════════════════════════════════════════════════════════════════════

// ══ ITEMS-BEGIN

// ── AP Biology · Mendelian Genetics Prediction ──────────────────────────────
const ALT_PUN_2 = 'A Punnett square with two rows and two columns. The gametes of one parent are written along the top edge and the gametes of the other parent down the left side; each cell holds an offspring genotype.';
G('e7dee353.lo-3', 'Monohybrid Punnett squares', [
  {
    t: 'complete the blank cell of a monohybrid square', d: 1,
    spec: pun(['T', 't'], ['T', 't'], { topLabel: 'Parent 1', sideLabel: 'Parent 2', blankCells: [[1, 1]] }),
    alt: `${ALT_PUN_2} One cell is a dashed box with a question mark.`,
    q: 'The Punnett square shown is for a cross between two pea plants. One cell has been replaced by a question mark. Which genotype belongs in that cell?',
    o: [['Homozygous recessive (tt)', 'correct'], ['Heterozygous (Tt)', 'copies the cell beside it instead of combining the gametes of this row and column'], ['Homozygous dominant (TT)', 'combines the gametes of the first row and first column'], ['A single allele (t)', 'writes one gamete instead of an offspring genotype']],
    holds: ['figure-core checker punnett_cell {row: 1, col: 1} compared with the genotype each option names', ['tt', 'Tt', 'TT', 't'].map((g) => (c: Ctx) => c.txt('punnett_cell', { row: 1, col: 1 }) === g)],
    h: ['Each cell combines the gamete at the top of its column with the gamete at the left of its row.', 'Find the column heading and the row heading of the box with the question mark.'],
    s: 'The box with the question mark is in the second column, headed t, and the second row, headed t. Combining the two gametes gives the genotype tt.',
  },
  {
    t: 'expected percent of one genotype from a completed square', d: 2,
    spec: pun(['B', 'b'], ['B', 'b'], { topLabel: 'Parent 1', sideLabel: 'Parent 2' }),
    alt: ALT_PUN_2,
    q: 'The Punnett square shown gives the possible offspring of a cross between two guinea pigs. According to the square, what percent of the offspring are expected to be homozygous dominant? Give a number without the % sign.',
    n: '25',
    ck: ['punnett_probability', { genotype: 'BB', as: 'percent' }],
    h: ['A homozygous dominant genotype has two copies of the capital-letter allele.', 'Count the cells with that genotype and compare with the total number of cells; each cell is equally likely.'],
    s: 'The four cells of the square read BB, Bb, Bb and bb. Only one of the four cells is BB, so 1 out of 4, or 25 percent, of the offspring are expected to be homozygous dominant.',
  },
  {
    t: 'deduce a parent genotype from the offspring cells', d: 3,
    spec: pun(['R', 'r'], ['r', 'r'], { blankSide: [0, 1] }),
    alt: `${ALT_PUN_2} Both gametes down the left side are replaced by question marks.`,
    q: 'In the Punnett square shown, the gametes of one parent are written along the top. The two gametes of the other parent, down the left side, have been replaced by question marks. What is the genotype of the parent whose gametes are hidden?',
    o: [['Homozygous recessive (rr)', 'correct'], ['Heterozygous (Rr)', 'assumes the hidden parent has the same genotype as the parent along the top'], ['Homozygous dominant (RR)', 'reads the capital letter in the first column as coming from the hidden parent'], ['Either Rr or rr', 'does not use both rows of the square']],
    holds: ['figure-core checker punnett_gamete for both side headers, joined into the parent genotype and compared with each option', ['rr', 'Rr', 'RR', 'Rr|rr'].map((g) => (c: Ctx) => [c.txt('punnett_gamete', { edge: 'side', index: 0 }), c.txt('punnett_gamete', { edge: 'side', index: 1 })].sort().join('') === g)],
    h: ['Each cell contains one allele from the top of its column and one from the left of its row.', 'In each row, remove the allele that came from the column heading and see what is left.'],
    s: 'In the first row the cells are Rr and rr. The column headings supply R and r, so the allele added by the row is r in both cells. The second row is the same. Both hidden gametes are r, so that parent is homozygous recessive, rr.',
  },
]);

const ALT_PUN_4 = 'A Punnett square for two genes. Four two-letter gametes are written along the top edge and gametes of the other parent down the left side; each cell holds a four-letter offspring genotype.';
G('e7dee353.lo-5', 'Dihybrid Punnett squares', [
  {
    t: 'complete the blank cell of a dihybrid square', d: 2,
    spec: pun(['RY', 'Ry', 'rY', 'ry'], ['RY', 'Ry', 'rY', 'ry'], { blankCells: [[1, 2]] }),
    alt: `${ALT_PUN_4} The square has four rows and four columns, and one cell is a dashed box with a question mark.`,
    q: 'The Punnett square shown is for a cross between two pea plants that differ in seed shape (R, r) and seed colour (Y, y). One cell has been replaced by a question mark. Which describes the genotype that belongs in that cell?',
    o: [['Heterozygous for both genes', 'correct'], ['Homozygous dominant for shape, heterozygous for colour', 'takes R from both gametes instead of R from one and r from the other'], ['Heterozygous for shape, homozygous recessive for colour', 'takes the colour allele of the row heading twice'], ['Heterozygous for shape, homozygous dominant for colour', 'takes the colour allele of the column heading twice']],
    holds: ['figure-core checker punnett_cell {row: 1, col: 2} compared with the genotype each option describes', ['RrYy', 'RRYy', 'Rryy', 'RrYY'].map((g) => (c: Ctx) => c.txt('punnett_cell', { row: 1, col: 2 }) === g)],
    h: ['Find the gamete at the top of the column and the gamete at the left of the row of the box.', 'Put the two alleles for seed shape together, then the two alleles for seed colour.'],
    s: 'The box is in the row headed Ry and the column headed rY. For seed shape the offspring gets R and r, giving Rr; for seed colour it gets y and Y, giving Yy. The genotype is RrYy.',
  },
  {
    t: 'phenotype ratio of a dihybrid cross from the square', d: 2,
    spec: pun(['RY', 'Ry', 'rY', 'ry'], ['Ry', 'ry'], {
      phenotypes: [
        { label: 'round, yellow', genotypes: ['RRYy', 'RrYy'] }, { label: 'round, green', genotypes: ['RRyy', 'Rryy'] },
        { label: 'wrinkled, yellow', genotypes: ['rrYy'] }, { label: 'wrinkled, green', genotypes: ['rryy'] },
      ],
    }),
    alt: `${ALT_PUN_4} The square has two rows and four columns. Each cell is hatched in one of four patterns, and a legend names the four seed phenotypes.`,
    q: 'The Punnett square shown is for a cross between two pea plants; the legend gives the seed phenotype of each cell. What is the expected ratio of round yellow : round green : wrinkled yellow : wrinkled green offspring?',
    o: [['3:3:1:1', 'correct'], ['9:3:3:1', 'recalls the ratio for a cross between two double heterozygotes without counting the cells'], ['1:1:1:1', 'recalls the ratio for a test cross without counting the cells'], ['3:1:3:1', 'counts the classes in the wrong order']],
    ck: ['punnett_phenotype_ratio', {}],
    h: ['Use the legend to decide which phenotype each of the eight cells shows.', 'Count the cells of each phenotype in the order asked for, then write the counts as a ratio.'],
    s: 'Using the legend, three of the eight cells are round yellow, three are round green, one is wrinkled yellow and one is wrinkled green. The ratio is 3:3:1:1.',
  },
  {
    t: 'probability of a two-trait phenotype from the square', d: 3,
    spec: pun(['RY', 'Ry', 'rY', 'ry'], ['rY', 'ry']),
    alt: `${ALT_PUN_4} The square has two rows and four columns.`,
    q: 'The Punnett square shown is for a cross between two pea plants. Round seeds (R) are dominant to wrinkled seeds (r), and yellow seeds (Y) are dominant to green seeds (y). According to the square, what is the probability that an offspring has wrinkled, yellow seeds? Give your answer as a decimal.',
    n: '0.375',
    calc: ['cells of the square (from the kind\'s model) with genotype rr and at least one Y, divided by the number of cells', (c) => { const cells = cellsOf(c); return cells.filter((g) => g.startsWith('rr') && g.includes('Y')).length / cells.length; }],
    h: ['Wrinkled seeds need two copies of r; yellow seeds need at least one copy of Y.', 'Count the cells that meet both conditions and divide by the total number of cells.'],
    s: 'Wrinkled, yellow offspring have rr together with YY or Yy. In the square these are the cells rrYY, rrYy and rrYy: 3 of the 8 cells. The probability is 3 ÷ 8 = 0.375.',
  },
]);

// ── AP Biology · Pedigree Analysis and Inheritance Patterns ─────────────────
const ALT_PED = 'A pedigree chart. Squares are males and circles are females; a filled symbol is an affected individual. Generations are numbered with Roman numerals down the left and individuals with numbers from the left in each generation.';
const PED_3GEN: Ind[] = [
  ['gf', 'M', 0], ['gm', 'F', 1],
  ['a', 'M', 1, 'gf', 'gm'], ['b', 'F', 0, 'gf', 'gm'], ['c', 'F', 1, 'gf', 'gm'], ['h', 'M', 0],
  ['x', 'F', 0, 'h', 'c'], ['y', 'M', 1, 'h', 'c'], ['z', 'M', 0, 'h', 'c'],
];
G('fc12780a.lo-1', 'Reading pedigree symbols', [
  {
    t: 'count individuals of a given sex and phenotype', d: 1,
    spec: ped(PED_3GEN), alt: `${ALT_PED} The chart has three generations.`,
    q: 'How many affected males are shown in the pedigree?',
    n: '2',
    ck: ['pedigree_count', { sex: 'M', status: 'affected' }],
    h: ['In a pedigree a square stands for a male and a circle for a female.', 'A filled symbol stands for an individual who shows the trait.'],
    s: 'Affected males are the filled squares. The chart has two of them: II-1 and III-2. The other squares are open (unaffected males), so the answer is 2.',
  },
  {
    t: 'identify the parents of a named individual', d: 2,
    spec: ped(PED_3GEN), alt: `${ALT_PED} The chart has three generations.`,
    q: 'In the pedigree shown, who are the parents of individual III-2?',
    o: [['II-3 and II-4', 'correct'], ['I-1 and I-2', 'names the grandparents at the top of the chart'], ['II-1 and II-2', 'takes the first couple-like pair in generation II, who are brother and sister'], ['II-2 and II-3', 'takes two sisters joined by the sibship bar as a couple']],
    holds: ['parents of III-2 read from the kind\'s model (father / mother ids → their printed numbers)', ['II-3 and II-4', 'I-1 and I-2', 'II-1 and II-2', 'II-2 and II-3'].map((txt) => (c: Ctx) => {
      const kid = byNumber(c, 'III-2');
      const parents = [numberOf(c, kid.father as string), numberOf(c, kid.mother as string)].sort().join(' and ');
      return txt.split(' and ').sort().join(' and ') === parents;
    })],
    h: ['A horizontal line joining a square and a circle directly is a mating line.', 'Follow the vertical line up from III-2 to the couple it hangs from.'],
    s: 'The vertical line above III-2 leads up to the sibship bar, which hangs from the mating line between II-3 (a circle) and II-4 (a square). The parents of III-2 are II-3 and II-4.',
  },
  {
    t: 'describe a named individual from the symbol', d: 1,
    spec: ped(PED_3GEN), alt: `${ALT_PED} The chart has three generations.`,
    q: 'What does the pedigree shown tell you about individual II-3?',
    o: [['An affected female', 'correct'], ['An affected male', 'confuses the circle with the square'], ['An unaffected female', 'takes a filled symbol to mean unaffected'], ['An unaffected male', 'confuses both the shape and the shading']],
    holds: ['sex and status of II-3 read from the kind\'s model', ([['F', true], ['M', true], ['F', false], ['M', false]] as Array<[string, boolean]>).map(([sex, aff]) => (c: Ctx) => byNumber(c, 'II-3').sex === sex && byNumber(c, 'II-3').affected === aff)],
    h: ['Locate generation II and count along to the third symbol from the left.', 'The shape gives the sex and the shading gives the phenotype.'],
    s: 'The third symbol in generation II is a filled circle. A circle is a female and a filled symbol is affected, so II-3 is an affected female.',
  },
]);

const MODE_OPTS = (first: 'AD' | 'AR' | 'XD' | 'XR', why: Record<string, string>): Array<[string, string]> => {
  const words: Record<string, string> = { AD: 'Autosomal dominant', AR: 'Autosomal recessive', XD: 'X-linked dominant', XR: 'X-linked recessive' };
  return [first, ...['AD', 'AR', 'XD', 'XR'].filter((k) => k !== first)].map((k) => [words[k], k === first ? 'correct' : why[k]]);
};
const modeOrder = (first: string): Array<'AD' | 'AR' | 'XD' | 'XR'> => [first, ...['AD', 'AR', 'XD', 'XR'].filter((k) => k !== first)] as Array<'AD' | 'AR' | 'XD' | 'XR'>;
G('fc12780a.lo-2', 'Telling modes of inheritance apart', [
  {
    t: 'rule out one mode of inheritance', d: 2,
    spec: ped([['f', 'M', 1], ['m', 'F', 0], ['d1', 'F', 0, 'f', 'm'], ['d2', 'F', 1, 'f', 'm'], ['s1', 'M', 0, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their three children.`,
    q: 'The trait in the pedigree shown is caused by a single gene. Which mode of inheritance can be ruled out by this pedigree?',
    o: MODE_OPTS('XD', { AD: 'does not test the mode against each child: an affected heterozygous father fits', AR: 'assumes a recessive trait cannot appear in a parent and a child', XR: 'forgets that the mother can be a carrier' }),
    holds: ['figure-core checker pedigree_mode_consistent for each of the four modes: the option holds when the chart does NOT fit the mode', modeOrder('XD').map((k) => (c: Ctx) => !fits(c, k))],
    h: ['Test each mode in turn against every parent-child pair.', 'Think about which X chromosome a father passes to each of his daughters.'],
    s: 'I-1 is an affected father. If the trait were X-linked dominant, he would pass his only X chromosome, carrying the allele, to every daughter, so all daughters would be affected. II-1 is an unaffected daughter, so X-linked dominant is ruled out. The other three modes can each explain the chart.',
  },
  {
    t: 'find the individual that rules out a mode', d: 3,
    spec: ped([['f', 'M', 0], ['m', 'F', 1], ['s1', 'M', 1, 'f', 'm'], ['d1', 'F', 1, 'f', 'm'], ['s2', 'M', 1, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their three children.`,
    q: 'The trait in the pedigree shown is caused by a single gene. The phenotype of which individual shows that the trait cannot be X-linked recessive?',
    o: [['II-2', 'correct'], ['II-1', 'picks an affected son, who is expected when the mother is affected'], ['II-3', 'picks the other affected son, who is also expected'], ['I-2', 'picks the affected mother, who fits any mode as a founder']],
    holds: ['for each option: with that individual\'s status hidden, pedigreeConsistent(chart, X-linked recessive) becomes true (and the chart as drawn does not fit)', ['II-2', 'II-1', 'II-3', 'I-2'].map((nr) => (c: Ctx) => !fits(c, 'XR') && fitsWithout(c, nr, 'XR'))],
    h: ['For an X-linked recessive trait, an affected female must have two copies of the allele.', 'One of her two X chromosomes comes from her father: check his phenotype.'],
    s: 'II-2 is an affected daughter. For an X-linked recessive trait she would need the allele on both X chromosomes, one of them from her father I-1, who would then be affected. I-1 is an open square (unaffected), so II-2 shows that the trait cannot be X-linked recessive. The affected sons II-1 and II-3 fit that mode, since their mother is affected.',
  },
  {
    t: 'decide whether the allele is dominant or recessive', d: 2,
    spec: ped([['f', 'M', 1], ['m', 'F', 1], ['s1', 'M', 0, 'f', 'm'], ['d1', 'F', 1, 'f', 'm'], ['s2', 'M', 1, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their three children.`,
    q: 'The trait in the pedigree shown is caused by a single gene. What does the pedigree establish about the allele that causes the trait?',
    o: [['It must be dominant', 'correct'], ['It must be recessive', 'takes the many affected individuals as a sign of a recessive trait'], ['It must be X-linked', 'reads the affected father and daughter as proof of X-linkage'], ['It must be autosomal', 'does not test the X-linked dominant case']],
    holds: ['the set of modes the chart fits (figure-core checker pedigree_mode_consistent ×4); an option holds when every fitting mode has that property', [
      (c) => { const ok = (['AD', 'AR', 'XD', 'XR'] as const).filter((k) => fits(c, k)); return ok.length > 0 && ok.every((k) => k.endsWith('D')); },
      (c) => (['AD', 'AR', 'XD', 'XR'] as const).filter((k) => fits(c, k)).every((k) => k.endsWith('R')),
      (c) => (['AD', 'AR', 'XD', 'XR'] as const).filter((k) => fits(c, k)).every((k) => k.startsWith('X')),
      (c) => (['AD', 'AR', 'XD', 'XR'] as const).filter((k) => fits(c, k)).every((k) => k.startsWith('A')),
    ]],
    h: ['Look for a child whose phenotype differs from that of both parents.', 'Two parents who both show a recessive trait have only that allele to pass on.'],
    s: 'I-1 and I-2 are both affected, but their son II-1 is unaffected. If the trait were recessive, two affected parents could only have affected children. So the allele must be dominant, with both parents heterozygous. The chart does not decide between an autosomal and an X-linked gene.',
  },
]);

G('fc12780a.lo-3', 'Mode of inheritance from a pedigree', [
  {
    t: 'identify the one mode a two-generation chart fits', d: 2,
    spec: ped([['f', 'M', 0], ['m', 'F', 0], ['d1', 'F', 1, 'f', 'm'], ['s1', 'M', 0, 'f', 'm'], ['d2', 'F', 0, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their three children.`,
    q: 'The trait in the pedigree shown is caused by a single gene. Which mode of inheritance fits the pedigree?',
    o: MODE_OPTS('AR', { AD: 'overlooks that neither parent of the affected child is affected', XD: 'overlooks that neither parent of the affected child is affected', XR: 'overlooks that an affected daughter would need an affected father' }).map(([t, w], i) => [t, i === 2 ? 'overlooks that a dominant allele would show in a parent' : w] as [string, string]),
    ck: ['pedigree_only_mode', {}],
    h: ['Compare the affected child with both parents: can a dominant allele hide in a parent?', 'Then ask which X chromosomes an affected daughter would need, and where they come from.'],
    s: 'II-1 is affected but both parents, I-1 and I-2, are unaffected, so the allele is recessive. II-1 is a daughter: if the gene were X-linked she would need the allele from her father, who would then be affected, and he is not. The trait is autosomal recessive.',
  },
  {
    t: 'identify the one mode a three-generation chart fits', d: 3,
    spec: ped([['gf', 'M', 1], ['gm', 'F', 0], ['a', 'F', 1, 'gf', 'gm'], ['b', 'M', 0, 'gf', 'gm'], ['h', 'M', 1], ['x', 'F', 0, 'h', 'a'], ['y', 'M', 1, 'h', 'a']]),
    alt: `${ALT_PED} The chart has three generations.`,
    q: 'The trait in the three-generation pedigree shown is caused by a single gene. Which mode of inheritance fits the pedigree?',
    o: MODE_OPTS('AD', { AR: 'overlooks that two affected parents have an unaffected child', XD: 'overlooks the unaffected daughter of an affected father', XR: 'overlooks that two affected parents have an unaffected child' }).map(([t, w], i) => [t, i === 3 ? 'takes the affected males as a sign of X-linkage and overlooks the unaffected child of two affected parents' : w] as [string, string]),
    ck: ['pedigree_only_mode', {}],
    h: ['Find the couple in which both partners are affected and look at their children.', 'Then check what an X-linked dominant allele in a father would mean for his daughters.'],
    s: 'In generation II both partners of the couple are affected, yet their daughter III-1 is unaffected, so the allele cannot be recessive. If it were X-linked dominant, the affected father would pass it to every daughter, and III-1 would be affected. Only autosomal dominant inheritance fits.',
  },
]);

G('fc12780a.lo-4', 'Genotypes from a pedigree', [
  {
    t: 'deduce the genotype of an unaffected parent', d: 2,
    spec: ped([['f', 'M', 0], ['m', 'F', 0], ['s1', 'M', 0, 'f', 'm'], ['d1', 'F', 1, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their two children.`,
    q: 'The pedigree shown follows an autosomal recessive trait; A is the dominant allele and a the recessive allele. What is the genotype of individual I-1?',
    o: [['Heterozygous (Aa)', 'correct'], ['Homozygous dominant (AA)', 'assumes an unaffected individual carries no copy of the recessive allele'], ['Homozygous recessive (aa)', 'gives the genotype of an affected individual'], ['Either AA or Aa', 'does not use the affected child to settle the genotype']],
    holds: ['the chart fits autosomal recessive (checker pedigree_mode_consistent); the genotypes I-1 can have follow from his phenotype and his children (kind\'s model): an affected child needs an a from each parent', ['Aa', 'AA', 'aa', 'AA|Aa'].map((g) => (c: Ctx) => fits(c, 'AR') && arGenotypes(c, 'I-1') === g)],
    h: ['An affected individual with a recessive trait has two copies of the recessive allele, one from each parent.', 'Combine that with the phenotype of I-1 himself.'],
    s: 'II-2 is affected, so her genotype is aa and she received one a from each parent. I-1 therefore carries a. He is unaffected, so he also has A. The genotype of I-1 is Aa.',
  },
]);

G('fc12780a.lo-5', 'Probability from a pedigree', [
  {
    t: 'probability that an unaffected sibling is a carrier', d: 3,
    spec: ped([['f', 'M', 0], ['m', 'F', 0], ['d1', 'F', 1, 'f', 'm'], ['s1', 'M', 0, 'f', 'm']]),
    alt: `${ALT_PED} The chart has two generations: a couple and their two children.`,
    q: 'The pedigree shown follows an autosomal recessive trait. What is the probability that individual II-2 is a carrier of the recessive allele? Give your answer as a decimal rounded to two decimal places.',
    n: '0.67',
    calc: ['the chart fits autosomal recessive (checker); both parents of II-2 are unaffected with an affected child, so each is Aa (kind\'s model); the cross Aa × Aa is enumerated and conditioned on II-2 being unaffected', (c) => {
      const m = pedM(c);
      const kid = byNumber(c, 'II-2');
      if (!fits(c, 'AR') || kid.affected) throw new Error('not the case this item describes');
      const parents = [kid.father, kid.mother].map((id) => m.individuals.find((i) => i.id === id)!);
      if (!parents.every((p) => !p.affected && m.individuals.some((k) => (k.father === p.id || k.mother === p.id) && k.affected))) throw new Error('the parents are not both obligate carriers');
      const kids = ['A', 'a'].flatMap((x) => ['A', 'a'].map((y) => [x, y].sort().join('')));
      const unaffected = kids.filter((g) => g !== 'aa');
      return unaffected.filter((g) => g === 'Aa').length / unaffected.length;
    }],
    h: ['First work out the genotypes of the two parents from their affected child.', 'II-2 is known to be unaffected, so one of the four outcomes of the cross is already excluded.'],
    s: 'II-1 is affected (aa), so both unaffected parents are Aa. A cross Aa × Aa gives AA, Aa, Aa and aa. II-2 is an open square, so he is not aa; of the three remaining equally likely outcomes, two are Aa. The probability is 2 ÷ 3 ≈ 0.67.',
  },
]);

// ── AP Calculus AB · Interpreting f, f′, f″ from graphs (sketching f) ───────
const ALT_SC = 'A sign chart: a number line with the critical numbers marked on it, and under it a row of plus and minus signs, one for each interval between the critical numbers.';
G('308a36ab.lo-5', 'Shape of f from the signs of f′ and f″', [
  {
    t: 'locate the local maximum of f from the sign chart of f′', d: 2,
    spec: sc([-2, 1, 4], [{ label: 'f′(x)', signs: ['+', '-', '-', '+'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f′(x) and there are three critical numbers.`,
    q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. At what value of x does the graph of f have a local maximum?',
    n: '-2',
    ck: ['sc_local_extrema', { row: 0, which: 'max', want: 'only' }],
    h: ['A local maximum of f occurs where f changes from increasing to decreasing.', 'Look for the critical number where the sign of f′ changes from plus to minus.'],
    s: 'To the left of x = −2 the chart shows f′ positive and to the right it shows f′ negative, so f rises and then falls there: a local maximum at x = −2. At x = 1 the sign does not change, and at x = 4 it changes from minus to plus (a local minimum).',
  },
  {
    t: 'intervals on which f increases from the sign chart of f′', d: 2,
    spec: sc([-4, -1, 3], [{ label: 'f′(x)', signs: ['+', '-', '+', '-'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f′(x) and there are three critical numbers.`,
    q: 'The sign chart shown gives the sign of f′(x) for a differentiable function f. On which open intervals is f increasing?',
    o: [['(−∞, −4) ∪ (−1, 3)', 'correct'], ['(−4, −1) ∪ (3, ∞)', 'takes the intervals where f′ is negative'], ['(−∞, −4) ∪ (3, ∞)', 'takes the two outer intervals'], ['(−4, 3)', 'takes everything between the first and last critical numbers']],
    ck: ['sc_intervals', { row: 0, sign: 'positive' }],
    h: ['A function is increasing where its derivative is positive.', 'Read off the intervals marked with a plus sign and write each with its two endpoints.'],
    s: 'f is increasing where f′(x) > 0. The chart shows a plus sign to the left of −4 and between −1 and 3, so f is increasing on (−∞, −4) ∪ (−1, 3).',
  },
  {
    t: 'describe the graph of f on an interval from the signs of f′ and f″', d: 3,
    spec: sc([0, 2, 4], [{ label: 'f′(x)', signs: ['-', '+', '+', '-'], at: ['0', '', '0'] }, { label: 'f″(x)', signs: ['+', '+', '-', '-'], at: ['', '0', ''] }]),
    alt: `${ALT_SC} There are two rows, labelled f′(x) and f″(x), and three critical numbers.`,
    q: 'The sign chart shown gives the signs of f′(x) and f″(x) for a function f. Which describes the graph of f on the interval (2, 4)?',
    o: [['Increasing and concave down', 'correct'], ['Increasing and concave up', 'reads the f″ row from the interval to the left'], ['Decreasing and concave down', 'reads the sign of f″ as the direction of f'], ['Decreasing and concave up', 'reverses both signs']],
    holds: ['figure-core checker sc_sign on the f′ row and the f″ row for the interval (2, 4)', ([['positive', 'negative'], ['positive', 'positive'], ['negative', 'negative'], ['negative', 'positive']] as Array<[string, string]>).map(([d1, d2]) => (c: Ctx) => c.txt('sc_sign', { row: 0, interval: 2 }) === d1 && c.txt('sc_sign', { row: 1, interval: 2 }) === d2)],
    h: ['The sign of f′ tells you whether f rises or falls; the sign of f″ tells you which way the graph bends.', 'Find the column of the chart between 2 and 4 and read both rows.'],
    s: 'Between 2 and 4 the chart shows f′ positive, so f is increasing, and f″ negative, so the graph is concave down. On (2, 4) the graph of f is increasing and concave down.',
  },
]);

// ── Precalculus · Polynomial and Rational Inequalities ──────────────────────
G('4ecdb7b8.lo-2', 'Sign charts', [
  {
    t: 'complete the sign of a product from the signs of its factors', d: 1,
    spec: sc([-2, 3], [{ label: 'x + 2', signs: ['-', '+', '+'], at: ['0', ''] }, { label: 'x − 3', signs: ['-', '-', '+'], at: ['', '0'] }, { label: 'product', signs: ['+', '-', '+'], at: ['0', '0'], blankSigns: [1] }]),
    alt: `${ALT_SC} There are three rows: two factors and their product. One entry of the product row is a dashed box with a question mark.`,
    q: 'In the sign chart shown, the first two rows give the signs of two factors and the last row gives the sign of their product. What belongs in the box with the question mark?',
    o: [['Negative', 'correct'], ['Positive', 'multiplies the signs of the wrong column'], ['Zero', 'takes the value at a critical number for the sign on the interval'], ['Undefined', 'treats the product like a quotient with a zero denominator']],
    ck: ['sc_sign', { row: 2, interval: 1 }],
    h: ['The box sits over one interval: read the sign of each factor in the same column.', 'A product of two numbers with opposite signs has which sign?'],
    s: 'The box is in the middle column, between −2 and 3. In that column the first factor is positive and the second factor is negative. A positive number times a negative number is negative.',
  },
  {
    t: 'read the solution set of a strict inequality from a sign chart', d: 2,
    spec: sc([-1, 2, 5], [{ label: 'f(x)', signs: ['-', '+', '-', '+'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f(x) and there are three critical numbers.`,
    q: 'The sign chart shown is for a polynomial function f. What is the solution set of the inequality f(x) > 0?',
    o: [['(−1, 2) ∪ (5, ∞)', 'correct'], ['(−∞, −1) ∪ (2, 5)', 'takes the intervals where f is negative'], ['[−1, 2] ∪ [5, ∞)', 'includes the zeros although the inequality is strict'], ['(−1, 5)', 'takes everything between the first and last zeros']],
    ck: ['sc_intervals', { row: 0, sign: 'positive' }],
    h: ['f(x) > 0 on the intervals marked with a plus sign.', 'The inequality is strict, so decide whether the zeros themselves belong to the solution.'],
    s: 'The chart shows a plus sign between −1 and 2 and to the right of 5. At the critical numbers f(x) = 0, which does not satisfy f(x) > 0, so the endpoints are left out: (−1, 2) ∪ (5, ∞).',
  },
  {
    t: 'read the solution set of a non-strict inequality with an undefined point', d: 3,
    spec: sc([-3, 1], [{ label: 'f(x)', signs: ['+', '-', '+'], at: ['0', 'und'] }]),
    alt: `${ALT_SC} The row is labelled f(x) and there are two critical numbers; under one the chart shows a zero and under the other it shows that the function is undefined.`,
    q: 'The sign chart shown is for a rational function f; "und" marks a number at which f is undefined. What is the solution set of the inequality f(x) ≤ 0?',
    o: [['[−3, 1)', 'correct'], ['[−3, 1]', 'includes the number at which f is undefined'], ['(−3, 1)', 'leaves out the zero although the inequality allows equality'], ['(−∞, −3] ∪ (1, ∞)', 'takes the intervals where f is positive']],
    calc: ['from the kind\'s model: the intervals with a minus sign, each end closed exactly when the chart shows 0 at that critical number', (c) => {
      const m = c.model(signChartModel);
      const row = m.rows[0];
      const parts: string[] = [];
      row.signs.forEach((sg, k) => {
        if (sg !== '-') return;
        const left = k === 0 ? '(−∞' : `${row.at[k - 1] === '0' ? '[' : '('}${minus(m.critical[k - 1].value)}`;
        const right = k === m.critical.length ? '∞)' : `${minus(m.critical[k].value)}${row.at[k] === '0' ? ']' : ')'}`;
        parts.push(`${left}, ${right}`);
      });
      return parts.join(' ∪ ');
    }],
    h: ['Start with the interval on which the chart shows a minus sign.', 'Then decide for each endpoint separately whether f equals 0 there or has no value there.'],
    s: 'The chart shows a minus sign between −3 and 1. At x = −3 the chart shows 0, and 0 ≤ 0 is true, so −3 is included. At x = 1 the function is undefined, so 1 cannot be a solution. The solution set is [−3, 1).',
  },
]);
// ── Algebra 2 · Linear Programming / Systems of Linear Inequalities ─────────
const ALT_REG = 'A coordinate grid with the x-axis and the y-axis numbered in steps of one. Part of the grid is shaded with hatch lines; the shaded region is bounded by straight lines, drawn solid or dashed.';
const pt = (x: number, y: number): string => `(${minus(x)}, ${minus(y)})`;
G('739c0ae5.lo-1', 'Feasible regions', [
  {
    t: 'count the corner points of a feasible region', d: 1,
    spec: regionI([-1, 7], [-1, 7], [ineq(1, 0, '>=', 0), ineq(0, 1, '>=', 0), ineq(1, 1, '<=', 6), ineq(1, 0, '<=', 4)]),
    alt: ALT_REG,
    q: 'The shaded region in the graph is the feasible region of a linear programming problem. How many corner points (vertices) does the feasible region have?',
    n: '4',
    ck: ['region_vertex_count', {}],
    h: ['A corner point is a point where two boundary lines of the shaded region meet.', 'Walk once around the edge of the shaded region and count each change of direction.'],
    s: 'Going around the shaded region, its boundary changes direction at (0, 0), (4, 0), (4, 2) and (0, 6). These are the corner points, so the feasible region has 4 vertices.',
  },
  {
    t: 'identify a corner point of a feasible region', d: 2,
    spec: regionI([-1, 7], [-1, 7], [ineq(1, 0, '>=', 0), ineq(0, 1, '>=', 0), ineq(1, 1, '<=', 6), ineq(1, 0, '<=', 4)]),
    alt: ALT_REG,
    q: 'The shaded region in the graph is the feasible region of a linear programming problem. Which of these points is a corner point of the feasible region?',
    o: [[pt(4, 2), 'correct'], [pt(6, 0), 'takes the x-intercept of the slanted line, which lies outside the shaded region'], [pt(4, 6), 'pairs the largest x-value with the largest y-value of the region'], [pt(2, 4), 'takes a point on the slanted edge that is not a corner']],
    holds: ['corners of the region from the kind\'s model (after figure-core checker region_area confirms every corner is on a gridline)', ([[4, 2], [6, 0], [4, 6], [2, 4]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => isVertex(c, x, y))],
    h: ['A corner point must lie on the edge of the shaded region, where two of its boundary lines cross.', 'Check each point: is it on the shaded region at all, and do two edges meet there?'],
    s: 'The vertical edge of the region and its slanted edge meet at (4, 2), so (4, 2) is a corner point. (6, 0) and (4, 6) lie outside the shaded region, and (2, 4) is on the slanted edge but no second edge passes through it.',
  },
  {
    t: 'maximise an objective function over a feasible region', d: 3,
    spec: regionI([-1, 9], [-1, 6], [ineq(1, 0, '>=', 0), ineq(0, 1, '>=', 0), ineq(1, 2, '<=', 8), ineq(1, 0, '<=', 6)]),
    alt: ALT_REG,
    q: 'The shaded region in the graph is the feasible region of a linear programming problem. What is the maximum value of P = 2x + 3y on this region?',
    n: '15',
    calc: ['P evaluated at every corner of the region (corners from the kind\'s model; figure-core checker region_area confirms each is on a gridline); the largest value', (c) => Math.max(...verticesOf(c).map(([x, y]) => 2 * x + 3 * y))],
    h: ['The maximum of a linear objective function over a feasible region occurs at a corner point.', 'Read the coordinates of each corner from the graph and evaluate P at each one.'],
    s: 'The corners of the shaded region are (0, 0), (6, 0), (6, 1) and (0, 4). P = 2x + 3y takes the values 0, 12, 15 and 12 there. The maximum is 15, at (6, 1).',
  },
]);

G('d6b8d6e7.lo-2', 'Graph of one linear inequality', [
  {
    t: 'identify the inequality from its graph', d: 2,
    spec: regionI([-5, 5], [-5, 5], [ineq(-2, 1, '<', 1)]),
    alt: ALT_REG,
    q: 'Which inequality has the solution set that is shaded in the graph?',
    o: [['y < 2x + 1', 'correct'], ['y ≤ 2x + 1', 'ignores that the boundary line is dashed'], ['y > 2x + 1', 'shades the wrong side of the line'], ['y < x/2 + 1', 'reads the slope as run over rise']],
    holds: ['each option\'s inequality compared with the figure\'s at every half-unit point of the plot (same points satisfied, boundary points included)', [ineq(-2, 1, '<', 1), ineq(-2, 1, '<=', 1), ineq(-2, 1, '>', 1), ineq(-0.5, 1, '<', 1)].map((k) => (c: Ctx) => sameSystem(c, [k]))],
    h: ['Find the y-intercept and the slope of the boundary line, then note whether the line is solid or dashed.', 'Pick a point clearly inside the shaded side, such as (2, 0), and test it.'],
    s: 'The boundary line crosses the y-axis at 1 and rises 2 for every 1 across, so it is y = 2x + 1. It is dashed, so the inequality is strict. The shading is below the line; for example (2, 0) is shaded and 0 < 5. The inequality is y < 2x + 1.',
  },
  {
    t: 'decide which point satisfies a graphed inequality', d: 2,
    spec: regionI([-5, 5], [-5, 5], [ineq(1, 2, '>=', 4)]),
    alt: ALT_REG,
    q: 'The solution set of a linear inequality is shaded in the graph. Which of these points is a solution of the inequality?',
    o: [[pt(2, 1), 'correct'], [pt(0, 0), 'takes the origin as a solution without checking which side is shaded'], [pt(1, 1), 'takes a point just below the boundary line'], [pt(4, -1), 'reads the point as lying on the boundary line']],
    holds: ['figure-core checker region_contains for each point', ([[2, 1], [0, 0], [1, 1], [4, -1]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => inRegion(c, x, y))],
    h: ['Locate each point on the grid and see whether it falls in the shaded part.', 'A point exactly on the boundary counts only when the boundary line is solid.'],
    s: 'The point (2, 1) lies on the boundary line, and the line is solid, so its points belong to the solution set. The points (0, 0), (1, 1) and (4, −1) all lie below the line, in the unshaded part.',
  },
  {
    t: 'describe the boundary line of a graphed inequality', d: 2,
    spec: regionI([-5, 5], [-5, 5], [ineq(1, 1, '>', 2)]),
    alt: ALT_REG,
    q: 'The solution set of a linear inequality is shaded in the graph. Which statement about its boundary line is correct?',
    o: [['It is y = −x + 2, and its points are not solutions', 'correct'], ['It is y = −x + 2, and its points are solutions', 'treats a dashed line as part of the solution set'], ['It is y = x + 2, and its points are not solutions', 'reads the slope with the wrong sign'], ['It is y = x + 2, and its points are solutions', 'reads the slope with the wrong sign and treats the dashed line as included']],
    holds: ['the boundary line and its strictness from the kind\'s model: slope and intercept compared with each option, strict ⇔ "not solutions"', ([[-1, false], [-1, true], [1, false], [1, true]] as Array<[number, boolean]>).map(([slope, included]) => (c: Ctx) => {
      const g = regM(c).region;
      if (g.type !== 'inequalities' || g.inequalities.length !== 1) throw new Error('one inequality expected');
      const k = g.inequalities[0];
      return near(-k.a / k.b, slope) && near(k.c / k.b, 2) && (k.op === '<=' || k.op === '>=') === included;
    })],
    h: ['Use two grid points on the boundary line to find its slope and y-intercept.', 'Then look at how the line is drawn: solid and dashed lines mean different things.'],
    s: 'The boundary passes through (0, 2) and (2, 0): it falls 1 for every 1 across, so it is y = −x + 2. The line is dashed, which means the inequality is strict and points on the line are not solutions.',
  },
]);

G('d6b8d6e7.lo-3', 'Feasible region of a system', [
  {
    t: 'match the shaded region to its system of inequalities', d: 3,
    spec: regionI([-5, 5], [-3, 7], [ineq(-1, 1, '<=', 2), ineq(0, 1, '>=', -1), ineq(1, 0, '<=', 3)]),
    alt: ALT_REG,
    q: 'Which system of inequalities has the solution region that is shaded in the graph?',
    o: [['y ≤ x + 2, y ≥ −1, x ≤ 3', 'correct'], ['y ≥ x + 2, y ≥ −1, x ≤ 3', 'shades above the slanted line instead of below it'], ['y ≤ x + 2, y ≤ −1, x ≤ 3', 'shades below the horizontal line instead of above it'], ['y ≤ x + 2, y ≥ −1, x ≥ 3', 'shades to the right of the vertical line instead of to the left']],
    holds: ['each option\'s system compared with the figure\'s at every half-unit point of the plot', [
      [ineq(-1, 1, '<=', 2), ineq(0, 1, '>=', -1), ineq(1, 0, '<=', 3)], [ineq(-1, 1, '>=', 2), ineq(0, 1, '>=', -1), ineq(1, 0, '<=', 3)],
      [ineq(-1, 1, '<=', 2), ineq(0, 1, '<=', -1), ineq(1, 0, '<=', 3)], [ineq(-1, 1, '<=', 2), ineq(0, 1, '>=', -1), ineq(1, 0, '>=', 3)],
    ].map((sys) => (c: Ctx) => sameSystem(c, sys))],
    h: ['Write the equation of each of the three boundary lines first.', 'Then test one point inside the shaded triangle, such as (1, 0), in each inequality.'],
    s: 'The boundaries are y = x + 2, y = −1 and x = 3. The point (1, 0) is inside the shaded region: 0 ≤ 1 + 2, 0 ≥ −1 and 1 ≤ 3 are all true. So the system is y ≤ x + 2, y ≥ −1, x ≤ 3.',
  },
  {
    t: 'locate the corner where two slanted boundaries meet', d: 2,
    spec: regionI([-4, 8], [-2, 6], [ineq(-1, 1, '<=', 2), ineq(1, 1, '<=', 6), ineq(0, 1, '>=', 0)]),
    alt: ALT_REG,
    q: 'The solution region of a system of three inequalities is shaded in the graph. At which point do the two slanted boundary lines of the region meet?',
    o: [[pt(2, 4), 'correct'], [pt(4, 2), 'swaps the coordinates'], [pt(0, 2), 'takes the y-intercept of one of the slanted lines'], [pt(6, 0), 'takes a corner on the horizontal boundary']],
    holds: ['corners of the region from the kind\'s model (checker region_area confirms they are on gridlines); the corner that is not on the horizontal boundary y = 0', ([[2, 4], [4, 2], [0, 2], [6, 0]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => { const top = verticesOf(c).filter((v) => !near(v[1], 0)); return top.length === 1 && near(top[0][0], x) && near(top[0][1], y); })],
    h: ['The two slanted lines form the top of the shaded region.', 'Read the x-coordinate first (across), then the y-coordinate (up).'],
    s: 'The two slanted edges rise from the x-axis and meet at the top corner of the shaded triangle. That corner is 2 units to the right of the origin and 4 units up: (2, 4).',
  },
]);

const SYS5 = [ineq(1, -1, '<', 1), ineq(0, 1, '<=', 3), ineq(1, 0, '>=', -2)];
G('d6b8d6e7.lo-5', 'Points in the feasible region', [
  {
    t: 'pick the point inside the feasible region', d: 1,
    spec: regionI([-5, 6], [-5, 5], SYS5), alt: ALT_REG,
    q: 'The solution region of a system of inequalities is shaded in the graph. Which of these points is a solution of the system?',
    o: [[pt(0, 2), 'correct'], [pt(3, 0), 'takes a point below the slanted boundary'], [pt(3, 4), 'takes a point above the horizontal boundary'], [pt(-3, 0), 'takes a point to the left of the vertical boundary']],
    holds: ['figure-core checker region_contains for each point', ([[0, 2], [3, 0], [3, 4], [-3, 0]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => inRegion(c, x, y))],
    h: ['A solution of the system must lie in the shaded region.', 'Locate each point on the grid: x across first, then y up or down.'],
    s: 'The point (0, 2) lies inside the shaded triangle, so it satisfies every inequality. (3, 0) is below the slanted line, (3, 4) is above the horizontal line and (−3, 0) is left of the vertical line; all three are outside the shading.',
  },
  {
    t: 'count how many listed points are solutions', d: 3,
    spec: regionI([-5, 6], [-5, 5], SYS5), alt: ALT_REG,
    q: 'The solution region of a system of inequalities is shaded in the graph. How many of the points (0, 0), (4, 3), (−2, 3) and (1, 0) are solutions of the system?',
    n: '2',
    calc: ['figure-core checker region_contains for each of the four points; the number of "yes"', (c) => ([[0, 0], [4, 3], [-2, 3], [1, 0]] as Array<[number, number]>).filter(([x, y]) => inRegion(c, x, y)).length],
    h: ['Locate each point: is it inside the shading, outside it, or exactly on a boundary line?', 'A point on a solid boundary is a solution; a point on a dashed boundary is not.'],
    s: '(0, 0) is inside the shading: a solution. (−2, 3) is the corner where two solid lines meet: a solution. (4, 3) and (1, 0) lie on the dashed slanted line, so they are not solutions. Two of the four points are solutions.',
  },
  {
    t: 'decide which boundary point belongs to the solution set', d: 2,
    spec: regionI([-5, 6], [-5, 5], SYS5), alt: ALT_REG,
    q: 'Each of these points lies on a boundary line of the shaded region in the graph. Which one is a solution of the system?',
    o: [[pt(1, 3), 'correct'], [pt(2, 1), 'treats a point on the dashed line as a solution'], [pt(4, 3), 'takes the corner where the dashed line meets a solid line'], [pt(0, -1), 'treats the y-intercept of the dashed line as a solution']],
    holds: ['figure-core checker region_contains for each point', ([[1, 3], [2, 1], [4, 3], [0, -1]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => inRegion(c, x, y))],
    h: ['Find which boundary line each point is on.', 'Compare how that line is drawn with the others: solid or dashed?'],
    s: 'The point (1, 3) is on the horizontal boundary, which is solid, and it satisfies the other inequalities, so it is a solution. The points (2, 1), (4, 3) and (0, −1) are on the dashed line, whose points are excluded.',
  },
]);

// ── AP Calculus AB · Disc and Washer Methods / Volumes with Cross Sections ──
const ALT_UNDER = 'A coordinate grid with both axes numbered in steps of one. A straight line is drawn across the grid, and the region between the line and the x-axis is shaded with hatch lines between a left bound and a right bound.';
const ALT_BETWEEN = 'A coordinate grid with both axes numbered in steps of one. Two straight lines are drawn across the grid, and the region between them is shaded with hatch lines between a left bound and a right bound.';
const under = (expr: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'under_curve', expr, from, to } });
const between = (upper: string, lower: string, from: number, to: number, xRange: [number, number], yRange: [number, number]): Spec => S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'between_curves', upper: { expr: upper }, lower: { expr: lower }, from, to } });
const discVolume = (c: Ctx): number => { const b = bounds(c); return Math.PI * integrate((x) => b.up(x) ** 2 - b.lo(x) ** 2, b.a, b.b); };
type IntOpt = [string, string, number, string, number, number];
const intOptions = (opts: IntOpt[]): Array<[string, string]> => opts.map(([text, why]) => [text, why]);
const intHolds = (opts: IntOpt[], truth: (c: Ctx) => number): Array<(c: Ctx) => boolean> => opts.map(([, , k, expr, a, b]) => (c: Ctx) => near(integral(k, expr, a, b), truth(c), 1e-6));

const DISC_SETUP: IntOpt[] = [
  ['π ∫₀⁴ (x/2 + 1)² dx', 'correct', Math.PI, '(x/2+1)^2', 0, 4],
  ['π ∫₀⁴ (x/2 + 1) dx', 'forgets to square the radius', Math.PI, 'x/2+1', 0, 4],
  ['π ∫₁³ (x/2 + 1)² dx', 'uses the heights of the line at the two bounds as the limits', Math.PI, '(x/2+1)^2', 1, 3],
  ['∫₀⁴ (x/2 + 1)² dx', 'leaves out the factor π of the area of a circle', 1, '(x/2+1)^2', 0, 4],
];
G('6f289059.lo-1', 'Disc method', [
  {
    t: 'read the radius of a disc from the region', d: 1,
    spec: under('3 - x/2', 0, 4, [-1, 6], [-1, 5]), alt: ALT_UNDER,
    q: 'The shaded region shown is revolved about the x-axis to form a solid. What is the radius of the circular cross-section of the solid at x = 2?',
    n: '2',
    calc: ['height of the region\'s upper boundary above the axis of revolution at x = 2, from the kind\'s model', (c) => bounds(c).up(2) - bounds(c).lo(2)],
    h: ['When the region is revolved about the x-axis, each vertical strip sweeps out a disc.', 'The radius of the disc at a given x is the distance from the x-axis up to the line at that x.'],
    s: 'At x = 2 the line is at height y = 2, so the vertical strip of the region there reaches from the x-axis up to 2. Revolving it about the x-axis gives a disc of radius 2.',
  },
  {
    t: 'set up the disc-method integral for the region', d: 3,
    spec: under('x/2 + 1', 0, 4, [-1, 6], [-1, 5]), alt: ALT_UNDER,
    q: 'Which integral gives the volume of the solid formed when the shaded region shown is revolved about the x-axis?',
    o: intOptions(DISC_SETUP),
    holds: ['each option evaluated numerically (Simpson) and compared with π∫(R² − r²) dx over the region of the kind\'s model', intHolds(DISC_SETUP, discVolume)],
    h: ['Find the equation of the line from its y-intercept and slope, and read the two bounds on the x-axis.', 'A disc of radius R has area πR²; the volume adds up these areas along the x-axis.'],
    s: 'The line crosses the y-axis at 1 and rises 1 for every 2 across, so it is y = x/2 + 1; the region runs from x = 0 to x = 4. Each disc has radius x/2 + 1 and area π(x/2 + 1)², so V = π ∫₀⁴ (x/2 + 1)² dx.',
  },
  {
    t: 'evaluate a disc-method volume from the region', d: 3,
    spec: under('x', 0, 3, [-1, 5], [-1, 5]), alt: ALT_UNDER,
    q: 'The shaded region shown is revolved about the x-axis to form a solid. The volume of the solid is kπ cubic units. What is the value of k?',
    n: '9',
    calc: ['π∫R² dx over the region of the kind\'s model (Simpson), divided by π', (c) => round(discVolume(c) / Math.PI, 6)],
    h: ['Read the equation of the line and the two bounds of the region from the graph.', 'Integrate π times the square of the radius between the bounds.'],
    s: 'The line passes through (0, 0) and (3, 3), so it is y = x, and the region runs from x = 0 to x = 3. V = π ∫₀³ x² dx = π · 27/3 = 9π, so k = 9.',
  },
]);

const WASHER_SETUP: IntOpt[] = [
  ['π ∫₀⁴ [3² − (x/2 + 1)²] dx', 'correct', Math.PI, '9-(x/2+1)^2', 0, 4],
  ['π ∫₀⁴ [3 − (x/2 + 1)]² dx', 'squares the difference of the radii instead of subtracting the squares', Math.PI, '(3-(x/2+1))^2', 0, 4],
  ['π ∫₀⁴ [3 − (x/2 + 1)] dx', 'integrates the height of the region instead of the area of a washer', Math.PI, '3-(x/2+1)', 0, 4],
  ['π ∫₀⁴ [(x/2 + 1)² − 3²] dx', 'takes the lower line as the outer radius', Math.PI, '(x/2+1)^2-9', 0, 4],
];
G('6f289059.lo-3', 'Washer method', [
  {
    t: 'read the outer and inner radius of a washer from the region', d: 2,
    spec: between('x/2 + 2', '1', 0, 4, [-1, 6], [-1, 6]), alt: ALT_BETWEEN,
    q: 'The shaded region shown is revolved about the x-axis, so each cross-section perpendicular to the x-axis is a washer. What are the outer radius R and the inner radius r of the washer at x = 2?',
    o: [['R = 3 and r = 1', 'correct'], ['R = 1 and r = 3', 'swaps the outer and inner radius'], ['R = 2 and r = 1', 'takes the height of the shaded strip as the outer radius'], ['R = 4 and r = 1', 'reads the outer radius at the right-hand bound']],
    holds: ['heights of the upper and lower boundary at x = 2 from the kind\'s model, compared with each option', ([[3, 1], [1, 3], [2, 1], [4, 1]] as Array<[number, number]>).map(([R, r]) => (c: Ctx) => near(bounds(c).up(2), R) && near(bounds(c).lo(2), r))],
    h: ['Both radii are measured from the axis of revolution, the x-axis.', 'At x = 2, read the height of the upper line and the height of the lower line.'],
    s: 'At x = 2 the upper line is at height 3 and the lower line is at height 1. Distances are measured from the x-axis, so the outer radius is R = 3 and the inner radius is r = 1.',
  },
  {
    t: 'set up the washer-method integral for the region', d: 3,
    spec: between('3', 'x/2 + 1', 0, 4, [-1, 6], [-1, 5]), alt: ALT_BETWEEN,
    q: 'Which integral gives the volume of the solid formed when the shaded region shown is revolved about the x-axis?',
    o: intOptions(WASHER_SETUP),
    holds: ['each option evaluated numerically (Simpson) and compared with π∫(R² − r²) dx over the region of the kind\'s model', intHolds(WASHER_SETUP, discVolume)],
    h: ['Identify which line is farther from the x-axis: it gives the outer radius.', 'The area of a washer is the area of the outer circle minus the area of the hole.'],
    s: 'The upper boundary is the horizontal line y = 3 (outer radius 3) and the lower boundary is y = x/2 + 1 (inner radius), from x = 0 to x = 4. Each washer has area π[3² − (x/2 + 1)²], so V = π ∫₀⁴ [3² − (x/2 + 1)²] dx.',
  },
  {
    t: 'evaluate a washer-method volume from the region', d: 3,
    spec: between('4', 'x', 0, 3, [-1, 5], [-1, 6]), alt: ALT_BETWEEN,
    q: 'The shaded region shown is revolved about the x-axis to form a solid with a hole. The volume of the solid is kπ cubic units. What is the value of k?',
    n: '39',
    calc: ['π∫(R² − r²) dx over the region of the kind\'s model (Simpson), divided by π', (c) => round(discVolume(c) / Math.PI, 6)],
    h: ['Read the two boundary lines and the two bounds of the region from the graph.', 'Integrate π(R² − r²), where R and r are the distances of the two lines from the x-axis.'],
    s: 'The upper boundary is y = 4 and the lower boundary is y = x, from x = 0 to x = 3. V = π ∫₀³ (4² − x²) dx = π(48 − 9) = 39π, so k = 39.',
  },
]);

G('ab0207fe.lo-1', 'Cross sections on a base region', [
  {
    t: 'area of a square cross-section at a given x', d: 2,
    spec: between('3', 'x/2', 0, 4, [-1, 6], [-1, 5]), alt: ALT_BETWEEN,
    q: 'The shaded region shown is the base of a solid. Each cross-section of the solid perpendicular to the x-axis is a square with one side lying across the base. What is the area of the cross-section at x = 2?',
    n: '4',
    calc: ['width of the region at x = 2 (upper minus lower boundary, kind\'s model), squared', (c) => (bounds(c).up(2) - bounds(c).lo(2)) ** 2],
    h: ['The side of the square at a given x is the width of the base there, measured parallel to the y-axis.', 'At x = 2, subtract the height of the lower line from the height of the upper line.'],
    s: 'At x = 2 the upper line is at height 3 and the lower line is at height 1, so the base is 2 units wide there. The square cross-section has side 2 and area 2² = 4.',
  },
  {
    t: 'locate the largest cross-section', d: 2,
    spec: between('5 - x', '1', 0, 4, [-1, 6], [-1, 6]), alt: ALT_BETWEEN,
    q: 'The shaded region shown is the base of a solid. Each cross-section perpendicular to the x-axis is a semicircle whose diameter lies across the base. At which of these values of x does the cross-section have the greatest area?',
    o: [['x = 0', 'correct'], ['x = 4', 'takes the bound where the region comes to a point'], ['x = 2', 'takes the middle of the interval'], ['x = 1', 'reads the height of the lower line as the position']],
    holds: ['width of the region (upper minus lower boundary, kind\'s model) at each option; the option holds when no point of the interval has a greater width', [0, 4, 2, 1].map((x0) => (c: Ctx) => { const b = bounds(c); const w = (x: number) => b.up(x) - b.lo(x); return Array.from({ length: 401 }, (_, i) => b.a + ((b.b - b.a) * i) / 400).every((x) => w(x) <= w(x0) + 1e-9); })],
    h: ['The diameter of each semicircle is the width of the base at that x.', 'Compare the distance between the two lines at the different values of x.'],
    s: 'The diameter of the semicircle is the vertical distance between the two lines. That distance is 4 at x = 0 and shrinks steadily to 0 at x = 4, so the largest cross-section is at x = 0.',
  },
]);

const RECT_SETUP: IntOpt[] = [
  ['∫₀⁴ 5(4 − x) dx', 'correct', 1, '5*(4-x)', 0, 4],
  ['∫₀⁴ 5(4 − x)² dx', 'squares the width as for square cross-sections', 1, '5*(4-x)^2', 0, 4],
  ['∫₀⁴ (4 − x) dx', 'finds the area of the base and leaves out the height', 1, '4-x', 0, 4],
  ['∫₀⁴ 5(4 + x) dx', 'adds the two boundaries instead of subtracting them', 1, '5*(4+x)', 0, 4],
];
G('ab0207fe.lo-3', 'Rectangular cross sections', [
  {
    t: 'volume with rectangles of constant height', d: 2,
    spec: under('4 - x', 0, 4, [-1, 6], [-1, 6]), alt: ALT_UNDER,
    q: 'The shaded region shown is the base of a solid. Each cross-section perpendicular to the x-axis is a rectangle of height 3 standing on the base. What is the volume of the solid, in cubic units?',
    n: '24',
    calc: ['figure-core checker region_area (the base), times the height 3', (c) => 3 * c.num('region_area')],
    h: ['Each rectangle has area 3 times the width of the base at that x.', 'Adding up 3 · (width) along the x-axis gives 3 times the area of the base.'],
    s: 'The base is a right triangle with corners (0, 0), (4, 0) and (0, 4), so its area is ½ · 4 · 4 = 8. Every cross-section is 3 units high, so V = ∫ 3 · (width) dx = 3 · 8 = 24 cubic units.',
  },
  {
    t: 'volume with rectangles whose height is twice the width', d: 3,
    spec: under('x/2', 0, 6, [-1, 8], [-1, 5]), alt: ALT_UNDER,
    q: 'The shaded region shown is the base of a solid. Each cross-section perpendicular to the x-axis is a rectangle whose height is twice its width across the base. What is the volume of the solid, in cubic units?',
    n: '36',
    calc: ['∫ 2·w(x)² dx over the region of the kind\'s model (Simpson), w = upper minus lower boundary', (c) => { const b = bounds(c); return round(integrate((x) => 2 * (b.up(x) - b.lo(x)) ** 2, b.a, b.b), 6); }],
    h: ['Read the equation of the line: the width of the base at x is the height of the line there.', 'The area of each rectangle is width times height, and the height is twice the width.'],
    s: 'The line passes through (0, 0) and (6, 3), so the width of the base at x is x/2. Each rectangle has height 2 · (x/2) = x and area (x/2) · x = x²/2. V = ∫₀⁶ x²/2 dx = 216/6 = 36 cubic units.',
  },
  {
    t: 'set up the integral for rectangular cross-sections', d: 3,
    spec: between('4', 'x', 0, 4, [-1, 6], [-1, 6]), alt: ALT_BETWEEN,
    q: 'The shaded region shown is the base of a solid. Each cross-section perpendicular to the x-axis is a rectangle of height 5 standing on the base. Which integral gives the volume of the solid?',
    o: intOptions(RECT_SETUP),
    holds: ['each option evaluated numerically (Simpson) and compared with ∫ 5·w(x) dx over the region of the kind\'s model', intHolds(RECT_SETUP, (c) => { const b = bounds(c); return integrate((x) => 5 * (b.up(x) - b.lo(x)), b.a, b.b); })],
    h: ['The width of the base at x is the upper boundary minus the lower boundary.', 'The area of each rectangle is its width times its height; integrate that area over the base.'],
    s: 'The upper boundary is y = 4 and the lower boundary is y = x, from x = 0 to x = 4, so the width at x is 4 − x. Each rectangle has area 5(4 − x), and V = ∫₀⁴ 5(4 − x) dx.',
  },
]);

// ── Physics · free-body diagrams ────────────────────────────────────────────
const ALT_FBD = 'A free-body diagram: an object with force arrows pointing away from it, each arrow labelled at its tip.';
const dirOf = (deg: number): string => (near(deg, 90) ? 'up' : near(deg, 270) ? 'down' : near(deg, 0) || near(deg, 360) ? 'right' : near(deg, 180) ? 'left' : 'other');
G('67385871.lo-2', 'Forces on connected masses', [
  {
    t: 'net force on a hanging block', d: 1,
    spec: fbd([F('T', 'up', 30), F('W', 'down', 50)], { object: { shape: 'box', label: 'm' } }),
    alt: `${ALT_FBD} A box has one arrow pointing straight up and one pointing straight down, each with its size printed in newtons.`,
    q: 'The free-body diagram shows the forces on a block that hangs from a string passing over a pulley. What is the magnitude of the net force on the block, in newtons?',
    n: '20',
    ck: ['fbd2_net_force', { axis: 'magnitude' }],
    h: ['The two forces act along the same vertical line but in opposite directions.', 'Subtract the smaller force from the larger one.'],
    s: 'The diagram shows a tension of 30 N upward and a weight of 50 N downward. The forces are opposite, so the net force is 50 N − 30 N = 20 N (directed downward).',
  },
  {
    t: 'acceleration of a block pulled along a table', d: 2,
    spec: fbd([F('N', 'up', 40), F('W', 'down', 40), F('T', 'right', 12), F('f', 'left', 4)], { surface: true, lengths: 'equal' }),
    alt: `${ALT_FBD} A box on a level surface has four arrows: up, down, left and right, each with its size printed in newtons.`,
    q: 'The free-body diagram shows the forces on a 4.0 kg block on a level table. The block is pulled by a string that runs over a pulley to a hanging mass. What is the magnitude of the acceleration of the block, in m/s²?',
    n: '2',
    calc: ['figure-core checker fbd2_net_force along x (and along y, which must be 0), divided by the mass 4.0 kg', (c) => { if (!near(c.num('fbd2_net_force', { axis: 'y' }), 0)) throw new Error('vertical forces do not balance'); return c.num('fbd2_net_force', { axis: 'x' }) / 4; }],
    h: ['The vertical forces balance, so only the horizontal forces contribute to the net force.', 'Find the net horizontal force, then use Newton\'s second law, a = F_net ÷ m.'],
    s: 'Vertically, N = 40 N up and W = 40 N down cancel. Horizontally, T = 12 N to the right and f = 4 N to the left give a net force of 8 N to the right. Then a = 8 N ÷ 4.0 kg = 2 m/s².',
  },
  {
    t: 'tension from the net force on a hanging block', d: 2,
    spec: fbd([F('T', 'up'), F('W', 'down', 35)], { object: { shape: 'box', label: 'm' }, lengths: 'equal' }),
    alt: `${ALT_FBD} A box has an arrow labelled T pointing straight up and an arrow labelled W, with its size printed in newtons, pointing straight down.`,
    q: 'The free-body diagram shows the forces on a block that hangs from a string passing over a pulley. The net force on the block is 10 N downward. What is the tension T, in newtons?',
    n: '25',
    ck: ['fbd2_missing_force', { force: 'T', net: -10 }],
    h: ['The net force is the weight minus the tension when the block accelerates downward.', 'Read the size of the weight from the diagram and solve W − T = 10 N for T.'],
    s: 'The diagram gives the weight as W = 35 N downward. A net force of 10 N downward means W − T = 10 N, so T = 35 N − 10 N = 25 N.',
  },
]);

G('ef1b68d3.lo-2', 'Directions of forces', [
  {
    t: 'identify the friction arrow by its direction', d: 1,
    spec: fbd([F('P', 'up'), F('Q', 'down'), F('R', 'right'), F('S', 'left')], { surface: true, lengths: 'equal' }),
    alt: `${ALT_FBD} A box on a level surface has four arrows of equal length, labelled with letters, pointing up, down, left and right.`,
    q: 'The free-body diagram shows a crate that is being pushed to the right and is sliding to the right across a rough level floor. Which arrow represents the friction force on the crate?',
    o: [['S', 'correct'], ['R', 'takes friction to act in the direction of motion'], ['P', 'confuses friction with the normal force'], ['Q', 'confuses friction with the weight']],
    holds: ['direction of each lettered arrow from the kind\'s model; kinetic friction on a crate sliding right points left (180°)', ['S', 'R', 'P', 'Q'].map((l) => (c: Ctx) => near(forceDeg(c, l), 180))],
    h: ['Kinetic friction acts along the surface, not perpendicular to it.', 'It points opposite to the direction in which the crate slides.'],
    s: 'The crate slides to the right, so kinetic friction acts along the floor to the left. The arrow pointing left is S. R (to the right) is the push, P (up) is the normal force and Q (down) is the weight.',
  },
  {
    t: 'state the direction of a force as a standard angle', d: 2,
    spec: fbd([F('F', 145, undefined, { showAngle: true })], { object: { shape: 'dot' }, axes: 'standard', lengths: 'equal' }),
    alt: `${ALT_FBD} A single arrow labelled F points up and to the left from a dot, with the angle between the arrow and the horizontal marked in degrees. A small x-y indicator shows the axis directions.`,
    q: 'The diagram shows a single force F acting on a particle; the marked angle is measured from the horizontal. What is the direction of F as an angle measured counter-clockwise from the positive x-axis, in degrees?',
    n: '145',
    calc: ['direction of the force in degrees counter-clockwise from +x, from the kind\'s model', (c) => forceDeg(c, 'F')],
    h: ['The arrow points up and to the left, so the angle from the positive x-axis is between 90° and 180°.', 'The marked angle is measured from the negative x-axis; subtract it from 180°.'],
    s: 'The diagram marks 35° between F and the horizontal on the left side, that is, from the negative x-axis. Measured counter-clockwise from the positive x-axis, the direction is 180° − 35° = 145°.',
  },
  {
    t: 'signed component of a force along an axis', d: 1,
    spec: fbd([F('A', 'up', 30), F('B', 'down', 30), F('C', 'right', 50), F('D', 'left', 20)], { surface: true }),
    alt: `${ALT_FBD} A box on a level surface has four arrows labelled with letters, pointing up, down, right and left, each with its size printed in newtons.`,
    q: 'The free-body diagram shows four forces on a box. Taking right as the positive x-direction, what is the x-component of force D, in newtons?',
    n: '-20',
    calc: ['size of D times the cosine of its direction, from the kind\'s model', (c) => { const f = fbdM(c).forces.find((x) => x.label === 'D')!; return round((f.magnitude as number) * Math.cos((f.degrees * Math.PI) / 180), 6); }],
    h: ['Find the arrow labelled D and note which way it points.', 'A force that points in the negative x-direction has a negative x-component.'],
    s: 'Force D has size 20 N and points to the left, which is the negative x-direction. Its x-component is therefore −20 N.',
  },
]);

G('ef1b68d3.lo-3', 'Building accurate free-body diagrams', [
  {
    t: 'name the force missing from a diagram', d: 1,
    spec: fbd([F('W', 'down')], { surface: true, object: { shape: 'box', label: 'book' }, lengths: 'equal' }),
    alt: `${ALT_FBD} A box labelled book sits on a level surface with a single arrow, labelled W, pointing straight down.`,
    q: 'The diagram is an incomplete free-body diagram of a book at rest on a level table; one force is missing. Which force must be added?',
    o: [['A normal force pointing up', 'correct'], ['A normal force pointing down', 'draws the force of the book on the table instead of the table on the book'], ['A friction force pointing left', 'adds a horizontal force although nothing pushes the book sideways'], ['A friction force pointing right', 'adds a force in a direction of motion that does not exist']],
    holds: ['the drawn forces from the kind\'s model: for the book to stay at rest the missing force is minus their sum; its direction is compared with each option', ['up', 'down', 'left', 'right'].map((d) => (c: Ctx) => { const fs = fbdM(c).forces; const sx = -fs.reduce((t, f) => t + Math.cos((f.degrees * Math.PI) / 180), 0); const sy = -fs.reduce((t, f) => t + Math.sin((f.degrees * Math.PI) / 180), 0); return dirOf(((Math.atan2(sy, sx) * 180) / Math.PI + 360) % 360) === d; })],
    h: ['The book is at rest, so the forces on it must add to zero.', 'Which object touches the book, and in which direction does it push?'],
    s: 'The diagram shows only the weight W, pointing down. The book is at rest, so an equal force must point up: the table pushes up on the book with a normal force. No horizontal force is needed, since nothing pushes the book sideways.',
  },
  {
    t: 'size a force so the diagram fits constant velocity', d: 2,
    spec: fbd([F('N', 'up', 80), F('W', 'down', 80), F('P', 'right', 25), F('f', 'left')], { surface: true, lengths: 'equal' }),
    alt: `${ALT_FBD} A box on a level surface has four arrows: up, down and right with sizes printed in newtons, and one to the left labelled f with no size.`,
    q: 'The free-body diagram shows a box that is being pulled across a level floor at constant velocity. What must the size of the friction force f be, in newtons?',
    n: '25',
    ck: ['fbd2_missing_force', { force: 'f' }],
    h: ['Constant velocity means zero acceleration, so the net force is zero.', 'The friction force must balance the only other horizontal force on the diagram.'],
    s: 'At constant velocity the net force is zero. Horizontally the diagram shows the pull P = 25 N to the right and friction f to the left, so f = 25 N.',
  },
  {
    t: 'remove forces that do not act on the object', d: 3,
    spec: fbd([F('P', 'up'), F('Q', 'down'), F('R', 'right')], { object: { shape: 'dot' }, lengths: 'equal' }),
    alt: `${ALT_FBD} A dot has three arrows of equal length, labelled with letters, pointing up, down and to the right.`,
    q: 'A ball has been thrown and is moving up and to the right through the air; air resistance is negligible. A student drew the free-body diagram shown for the ball. Which arrows should be removed to make the diagram correct?',
    o: [['P and R', 'correct'], ['P only', 'keeps a horizontal "force of motion"'], ['R only', 'keeps an upward "force of the throw"'], ['Q only', 'removes the weight, the one force that does act']],
    holds: ['directions of the drawn arrows from the kind\'s model: in flight only gravity (straight down) acts, so every arrow not pointing down is removed', [['P', 'R'], ['P'], ['R'], ['Q']].map((set) => (c: Ctx) => fbdM(c).forces.filter((f) => !near(f.degrees, 270)).map((f) => f.label).sort().join() === set.sort().join())],
    h: ['List the objects that touch the ball while it is in the air.', 'A force needs an agent: motion in a direction does not require a force in that direction.'],
    s: 'Once the ball has left the hand and air resistance is negligible, the only force on it is its weight, straight down: arrow Q. Arrows P (up) and R (to the right) show no real force — the ball keeps moving that way without one — so P and R should be removed.',
  },
]);

G('111ba11a.lo-1', 'Forces on an incline', [
  {
    t: 'name the forces on a block at rest on an incline', d: 1,
    spec: fbd([F('P', 'normal'), F('Q', 'up-slope'), F('R', 'down')], { incline: { angle: 30 }, lengths: 'equal' }),
    alt: `${ALT_FBD} A block on an incline has three arrows of equal length labelled with letters: one perpendicular to the slope, one along the slope and one straight down. The angle of the incline is marked.`,
    q: 'The free-body diagram shows a block at rest on a rough incline. Which list names the forces P, Q and R, in that order?',
    o: [['Normal force, friction, weight', 'correct'], ['Weight, friction, normal force', 'takes the force perpendicular to the slope for the weight'], ['Normal force, weight, friction', 'takes the force along the slope for the weight'], ['Friction, normal force, weight', 'swaps the directions of friction and the normal force']],
    holds: ['direction of each lettered arrow from the kind\'s model: perpendicular to the slope → normal force, along the slope → friction, straight down → weight', ['normal force, friction, weight', 'weight, friction, normal force', 'normal force, weight, friction', 'friction, normal force, weight'].map((txt) => (c: Ctx) => {
      const name: Record<string, string> = { normal: 'normal force', 'up-slope': 'friction', 'down-slope': 'friction', down: 'weight' };
      const m = fbdM(c);
      return ['P', 'Q', 'R'].map((l) => name[m.forces.find((f) => f.label === l)!.named as string]).join(', ') === txt;
    })],
    h: ['The weight always points straight down, whatever the surface.', 'The normal force is perpendicular to the surface; friction acts along it.'],
    s: 'P is perpendicular to the incline, pointing away from it: the normal force. Q points along the incline, up the slope: static friction, which keeps the block from sliding down. R points straight down: the weight.',
  },
  {
    t: 'infer the direction of sliding from the friction arrow', d: 2,
    spec: fbd([F('N', 'normal'), F('f', 'down-slope'), F('W', 'down')], { incline: { angle: 25 }, lengths: 'equal' }),
    alt: `${ALT_FBD} A block on an incline has three arrows of equal length: N perpendicular to the slope, f along the slope and W straight down. The angle of the incline is marked.`,
    q: 'A block was given a push and is now sliding along a rough incline. The free-body diagram shows the forces on it while it slides; f is the kinetic friction force. In which direction is the block moving?',
    o: [['Up the incline', 'correct'], ['Down the incline', 'takes friction to point in the direction of motion'], ['Straight down', 'follows the weight arrow'], ['Horizontally to the right', 'ignores that the block stays on the incline']],
    holds: ['direction of the friction arrow from the kind\'s model; kinetic friction is opposite to the motion along the slope', ['up-slope', 'down-slope', 'down', 'right'].map((d) => (c: Ctx) => { const f = fbdM(c).forces.find((x) => x.label === 'f')!; const motion = f.named === 'down-slope' ? 'up-slope' : f.named === 'up-slope' ? 'down-slope' : 'none'; return motion === d; })],
    h: ['Kinetic friction always opposes the direction in which the surfaces slide past each other.', 'Look at which way the arrow f points along the slope.'],
    s: 'The friction arrow f points along the incline, down the slope. Kinetic friction is opposite to the motion, so the block is moving up the incline (and slowing down).',
  },
  {
    t: 'direction of the force missing from an incline diagram', d: 2,
    spec: fbd([F('N', 'normal'), F('W', 'down')], { incline: { angle: 30 }, lengths: 'equal' }),
    alt: `${ALT_FBD} A block on an incline has two arrows of equal length: N perpendicular to the slope and W straight down. The angle of the incline is marked.`,
    q: 'The diagram shown is an incomplete free-body diagram of a block at rest on a rough incline; one force is missing. In which direction does the missing force point?',
    o: [['Up the slope', 'correct'], ['Down the slope', 'takes friction to point the way the block would slide'], ['Into the slope', 'adds a second force along the line of the normal force'], ['Straight up', 'balances the weight directly, as on level ground']],
    holds: ['from the kind\'s model: the only drawn force with a component along the slope is the weight (component down the slope); the missing friction force acts along the surface and must cancel it', ['up', 'down', 'into', 'vertical'].map((d) => (c: Ctx) => {
      const m = fbdM(c);
      const t = ((m.incline as { angle: number }).angle * Math.PI) / 180;
      const along = m.forces.reduce((s, f) => s + Math.cos((f.degrees * Math.PI) / 180) * Math.cos(t) + Math.sin((f.degrees * Math.PI) / 180) * Math.sin(t), 0);
      return (along < -1e-9 ? 'up' : along > 1e-9 ? 'down' : 'none') === d;
    })],
    h: ['Split the weight into a part perpendicular to the slope and a part along the slope.', 'The normal force can only balance the perpendicular part; something else must hold the block in place.'],
    s: 'The weight W has a component along the incline, pointing down the slope, and the normal force N has none. For the block to stay at rest, static friction must act along the surface, up the slope, to balance that component.',
  },
]);

// ── Physics / Precalculus · vectors ─────────────────────────────────────────
const ALT_VEC = 'A coordinate grid with both axes numbered in steps of one. An arrow is drawn on the grid from one grid point to another and is labelled with a letter.';
const ALT_VECS = 'A coordinate grid with both axes numbered in steps of one. Several arrows, each labelled with a letter, are drawn on the grid between grid points.';
G('376f309f.lo-1', 'Components as projections', [
  {
    t: 'read the x-component of a vector on a grid', d: 1,
    spec: vecs([-1, 7], [-1, 6], [{ tail: [1, 1], head: [5, 4], label: 'A', showComponents: true }]),
    alt: `${ALT_VEC} Thin dashed lines run from its tail horizontally and then vertically to its head.`,
    q: 'Vector A is drawn on the grid shown, on which each square is 1 m wide. What is the x-component of A, in metres?',
    n: '4',
    ck: ['vec_components', { vector: 0, want: 'x' }],
    h: ['The x-component is the horizontal projection of the arrow: how far it runs along the x-direction.', 'Subtract the x-coordinate of the tail from the x-coordinate of the head.'],
    s: 'The tail of A is at x = 1 and its head is at x = 5. The horizontal dashed line covers 5 − 1 = 4 squares, so the x-component is 4 m.',
  },
  {
    t: 'read a negative y-component of a vector on a grid', d: 2,
    spec: vecs([-3, 5], [-3, 5], [{ tail: [-2, 3], head: [3, -1], label: 'B' }]),
    alt: ALT_VEC,
    q: 'Vector B is drawn on the grid shown, on which each square is 1 m wide. What is the y-component of B, in metres?',
    n: '-4',
    ck: ['vec_components', { vector: 0, want: 'y' }],
    h: ['The y-component is the vertical projection of the arrow, from tail to head.', 'An arrow whose head is lower than its tail has a negative y-component.'],
    s: 'The tail of B is at y = 3 and its head is at y = −1. The y-component is the head value minus the tail value: −1 − 3 = −4 m. It is negative, since the arrow points downward.',
  },
  {
    t: 'read both components of a vector as a pair', d: 2,
    spec: vecs([-5, 4], [-3, 4], [{ tail: [2, -1], head: [-3, 2], label: 'A' }]),
    alt: ALT_VEC,
    q: 'Vector A is drawn on the grid shown. Which pair gives its components (Aₓ, Aᵧ)?',
    o: [[pt(-5, 3), 'correct'], [pt(5, 3), 'drops the sign of the leftward x-component'], [pt(-3, 2), 'reads the coordinates of the head of the arrow'], [pt(3, -5), 'swaps the components and their signs']],
    ck: ['vec_components', { vector: 0, want: 'pair' }],
    h: ['Components measure the change from the tail of the arrow to its head.', 'Count squares across (left is negative) and squares up (down is negative).'],
    s: 'From the tail at (2, −1) to the head at (−3, 2) the arrow goes 5 squares to the left and 3 squares up. Its components are (−5, 3).',
  },
]);

G('e8769763.lo-1', 'Vector notation and components', [
  {
    t: 'write a drawn vector in component form', d: 1,
    spec: vecs([-5, 4], [-3, 5], [{ tail: [-3, -1], head: [2, 3], label: 'v' }]),
    alt: ALT_VEC,
    q: 'Vector v is drawn on the grid shown. What is v in component form?',
    o: [[angle(5, 4), 'correct'], [angle(2, 3), 'writes the coordinates of the terminal point'], [angle(-5, -4), 'subtracts in the wrong order (initial point minus terminal point)'], [angle(4, 5), 'swaps the horizontal and vertical components']],
    ck: ['vec_components', { vector: 0, want: 'pair' }],
    h: ['Component form is terminal point minus initial point.', 'Read the coordinates of the tail and of the head from the grid, then subtract.'],
    s: 'The initial point is (−3, −1) and the terminal point is (2, 3). So v = ⟨2 − (−3), 3 − (−1)⟩ = ⟨5, 4⟩.',
  },
  {
    t: 'find the magnitude of a drawn vector', d: 2,
    spec: vecs([-1, 6], [-4, 4], [{ tail: [1, -2], head: [4, 2], label: 'v' }]),
    alt: ALT_VEC,
    q: 'Vector v is drawn on the grid shown. What is the magnitude of v?',
    n: '5',
    ck: ['vec_magnitude', { vector: 0 }],
    h: ['First find the horizontal and vertical components by counting squares from tail to head.', 'The magnitude is the hypotenuse of the right triangle formed by the two components.'],
    s: 'From the tail (1, −2) to the head (4, 2) the vector goes 3 across and 4 up, so v = ⟨3, 4⟩. Its magnitude is √(3² + 4²) = √25 = 5.',
  },
  {
    t: 'recognise equal vectors drawn in different places', d: 2,
    spec: vecs([-5, 5], [-4, 5], [{ tail: [-4, 1], head: [-1, 3], label: 'p' }, { tail: [1, -3], head: [4, -1], label: 'q' }, { tail: [3, 4], head: [0, 2], label: 'r' }]),
    alt: ALT_VECS,
    q: 'Three vectors are drawn on the grid shown. Which of them are equal vectors?',
    o: [['p and q', 'correct'], ['p and r', 'treats two vectors that point in opposite directions as equal'], ['All three', 'counts every vector of the same length on parallel lines as equal'], ['No two of them', 'requires equal vectors to start at the same point']],
    holds: ['figure-core checker vec_components for each arrow; two arrows are equal when both components are equal', [
      (c) => sameVec(comp(c, 0), comp(c, 1)) && !sameVec(comp(c, 0), comp(c, 2)),
      (c) => sameVec(comp(c, 0), comp(c, 2)) && !sameVec(comp(c, 0), comp(c, 1)),
      (c) => sameVec(comp(c, 0), comp(c, 1)) && sameVec(comp(c, 0), comp(c, 2)),
      (c) => !sameVec(comp(c, 0), comp(c, 1)) && !sameVec(comp(c, 0), comp(c, 2)) && !sameVec(comp(c, 1), comp(c, 2)),
    ]],
    h: ['Equal vectors have the same magnitude and the same direction; where they start does not matter.', 'Write each vector in component form, tail to head, and compare.'],
    s: 'Counting squares from tail to head: p = ⟨3, 2⟩, q = ⟨3, 2⟩ and r = ⟨−3, −2⟩. p and q have the same components, so they are equal vectors. r has the same length but points the opposite way, so it is not equal to them.',
  },
]);

G('e8769763.lo-2', 'Adding vectors', [
  {
    t: 'add two vectors drawn tip to tail', d: 2,
    spec: vecs([-1, 6], [-1, 6], [{ components: [4, 1], label: 'u' }, { components: [-1, 3], label: 'v' }], { tipToTail: true }),
    alt: `${ALT_VECS} The second arrow starts where the first one ends.`,
    q: 'Vectors u and v are drawn tip to tail on the grid shown. What is u + v in component form?',
    o: [[angle(3, 4), 'correct'], [angle(5, -2), 'subtracts v from u instead of adding'], [angle(5, 4), 'ignores that v points to the left'], [angle(-4, 3), 'multiplies the components instead of adding them']],
    ck: ['vec_resultant', { want: 'pair' }],
    h: ['With the vectors drawn tip to tail, the sum runs from the tail of the first arrow to the head of the last.', 'Or add the horizontal components and the vertical components separately.'],
    s: 'From the grid, u = ⟨4, 1⟩ and v = ⟨−1, 3⟩. Adding components: u + v = ⟨4 + (−1), 1 + 3⟩ = ⟨3, 4⟩, the vector from the origin to the head of v.',
  },
  {
    t: 'magnitude of the sum of two vectors drawn from one point', d: 3,
    spec: vecs([-1, 7], [-1, 7], [{ head: [1, 6], label: 'u' }, { head: [5, 2], label: 'v' }]),
    alt: `${ALT_VECS} Both arrows start at the origin.`,
    q: 'Vectors u and v are drawn from the origin on the grid shown. What is the magnitude of u + v?',
    n: '10',
    ck: ['vec_resultant', { want: 'magnitude' }],
    h: ['Read the components of each vector from the coordinates of its head.', 'Add the components first; then find the length of the sum with the Pythagorean theorem.'],
    s: 'From the grid, u = ⟨1, 6⟩ and v = ⟨5, 2⟩, so u + v = ⟨6, 8⟩. Its magnitude is √(6² + 8²) = √100 = 10.',
  },
  {
    t: 'read a vector equation from a triangle of vectors', d: 2,
    spec: vecs([-1, 6], [-1, 6], [{ tail: [0, 0], head: [4, 1], label: 'p' }, { tail: [4, 1], head: [2, 4], label: 'q' }, { tail: [0, 0], head: [2, 4], label: 'r' }]),
    alt: `${ALT_VECS} The three arrows form a triangle.`,
    q: 'Three vectors form a triangle on the grid shown. Which equation relates them?',
    o: [['p + q = r', 'correct'], ['p + r = q', 'reads r as following p tip to tail'], ['q + r = p', 'ignores the directions of the arrows'], ['p + q + r = 0', 'assumes the arrows of any closed triangle add to zero']],
    holds: ['figure-core checker vec_components for each arrow; each equation tested on the components', [
      (c) => sameVec([comp(c, 0)[0] + comp(c, 1)[0], comp(c, 0)[1] + comp(c, 1)[1]], comp(c, 2)),
      (c) => sameVec([comp(c, 0)[0] + comp(c, 2)[0], comp(c, 0)[1] + comp(c, 2)[1]], comp(c, 1)),
      (c) => sameVec([comp(c, 1)[0] + comp(c, 2)[0], comp(c, 1)[1] + comp(c, 2)[1]], comp(c, 0)),
      (c) => sameVec([comp(c, 0)[0] + comp(c, 1)[0] + comp(c, 2)[0], comp(c, 0)[1] + comp(c, 1)[1] + comp(c, 2)[1]], [0, 0]),
    ]],
    h: ['Find two arrows that are joined tip to tail.', 'Their sum is the arrow from the tail of the first to the head of the second.'],
    s: 'Arrow q starts where arrow p ends, so p and q are joined tip to tail. Arrow r runs from the tail of p to the head of q, so it is their sum: p + q = r. In components, ⟨4, 1⟩ + ⟨−2, 3⟩ = ⟨2, 4⟩.',
  },
]);

G('e8769763.lo-3', 'Subtracting vectors', [
  {
    t: 'subtract two drawn vectors in component form', d: 2,
    spec: vecs([-1, 7], [-1, 6], [{ head: [5, 2], label: 'u' }, { head: [2, 4], label: 'v' }]),
    alt: `${ALT_VECS} Both arrows start at the origin.`,
    q: 'Vectors u and v are drawn from the origin on the grid shown. What is u − v in component form?',
    o: [[angle(3, -2), 'correct'], [angle(7, 6), 'adds the vectors instead of subtracting'], [angle(-3, 2), 'subtracts in the wrong order (v − u)'], [angle(3, 2), 'drops the sign of the vertical component']],
    calc: ['figure-core checker vec_components for u and v; the difference of the components', (c) => { const u = comp(c, 0); const v = comp(c, 1); return angle(u[0] - v[0], u[1] - v[1]); }],
    h: ['Read the components of u and of v from the coordinates of their heads.', 'Subtract the components of v from the components of u, in that order.'],
    s: 'From the grid, u = ⟨5, 2⟩ and v = ⟨2, 4⟩. Then u − v = ⟨5 − 2, 2 − 4⟩ = ⟨3, −2⟩.',
  },
  {
    t: 'identify a difference vector geometrically', d: 3,
    spec: vecs([-1, 7], [-1, 6], [{ head: [5, 1], label: 'u' }, { head: [2, 4], label: 'v' }, { tail: [2, 4], head: [5, 1], label: 'w' }]),
    alt: `${ALT_VECS} Two arrows start at the origin and the third joins their heads.`,
    q: 'Vectors u and v are drawn from the origin on the grid shown, and vector w joins their heads. Which expression is equal to w?',
    o: [['u − v', 'correct'], ['v − u', 'reverses the direction of the arrow'], ['u + v', 'takes the third side of the triangle for the sum'], ['−u − v', 'reverses both vectors']],
    holds: ['figure-core checker vec_components for u, v and w; each expression tested on the components', ([[1, -1], [-1, 1], [1, 1], [-1, -1]] as Array<[number, number]>).map(([a, b]) => (c: Ctx) => sameVec([a * comp(c, 0)[0] + b * comp(c, 1)[0], a * comp(c, 0)[1] + b * comp(c, 1)[1]], comp(c, 2)))],
    h: ['Follow the arrows: going along v and then along w brings you to the head of which vector?', 'Write that as an equation and solve it for w.'],
    s: 'Arrow w starts at the head of v and ends at the head of u, so v + w = u. Solving for w gives w = u − v. In components, ⟨5, 1⟩ − ⟨2, 4⟩ = ⟨3, −3⟩, which matches the arrow w.',
  },
  {
    t: 'magnitude of a difference of two drawn vectors', d: 3,
    spec: vecs([-1, 6], [-1, 7], [{ head: [1, 5], label: 'u' }, { head: [4, 1], label: 'v' }]),
    alt: `${ALT_VECS} Both arrows start at the origin.`,
    q: 'Vectors u and v are drawn from the origin on the grid shown. What is the magnitude of u − v?',
    n: '5',
    calc: ['figure-core checker vec_components for u and v; the length of the difference', (c) => { const u = comp(c, 0); const v = comp(c, 1); return Math.hypot(u[0] - v[0], u[1] - v[1]); }],
    h: ['Read the components of u and v, then subtract them component by component.', 'The magnitude of the difference is the distance between the heads of the two arrows.'],
    s: 'From the grid, u = ⟨1, 5⟩ and v = ⟨4, 1⟩, so u − v = ⟨−3, 4⟩. Its magnitude is √((−3)² + 4²) = √25 = 5.',
  },
]);

G('e8769763.lo-4', 'Scalar multiples of vectors', [
  {
    t: 'find the scalar relating two parallel vectors', d: 2,
    spec: vecs([-6, 5], [-4, 4], [{ tail: [1, 1], head: [3, 2], label: 'v' }, { tail: [-1, -1], head: [-5, -3], label: 'w' }]),
    alt: ALT_VECS,
    q: 'Vectors v and w are drawn on the grid shown, and w = k·v for some number k. What is the value of k?',
    n: '-2',
    calc: ['figure-core checker vec_components for v and w; the ratio of the x-components, checked against the y-components', (c) => { const v = comp(c, 0); const w = comp(c, 1); const k = w[0] / v[0]; if (!near(w[1], k * v[1])) throw new Error('w is not a multiple of v'); return k; }],
    h: ['Write both vectors in component form by counting squares from tail to head.', 'Compare lengths to find the size of k, and directions to find its sign.'],
    s: 'From the grid, v = ⟨2, 1⟩ and w = ⟨−4, −2⟩. Each component of w is −2 times the matching component of v, so k = −2: w is twice as long as v and points the opposite way.',
  },
  {
    t: 'component form of a negative scalar multiple', d: 2,
    spec: vecs([-2, 4], [-3, 3], [{ tail: [-1, 0], head: [2, -1], label: 'v' }]),
    alt: ALT_VEC,
    q: 'Vector v is drawn on the grid shown. What is −2v in component form?',
    o: [[angle(-6, 2), 'correct'], [angle(6, -2), 'multiplies by 2 and forgets the negative sign'], [angle(1, -3), 'adds −2 to each component instead of multiplying'], [angle(-6, -2), 'changes the sign of one component only']],
    calc: ['figure-core checker vec_components for v; each component times −2', (c) => { const v = comp(c, 0); return angle(-2 * v[0], -2 * v[1]); }],
    h: ['First write v in component form from the grid.', 'Multiplying a vector by a number multiplies every component by that number.'],
    s: 'From the tail (−1, 0) to the head (2, −1), v = ⟨3, −1⟩. Then −2v = ⟨−2 · 3, −2 · (−1)⟩ = ⟨−6, 2⟩.',
  },
  {
    t: 'magnitude of a scalar multiple', d: 2,
    spec: vecs([-3, 4], [-2, 4], [{ tail: [-2, -1], head: [2, 2], label: 'v' }]),
    alt: ALT_VEC,
    q: 'Vector v is drawn on the grid shown. What is the magnitude of the vector −3v?',
    n: '15',
    calc: ['figure-core checker vec_magnitude for v, times |−3|', (c) => 3 * c.num('vec_magnitude', { vector: 0 })],
    h: ['Find the magnitude of v from its horizontal and vertical components.', 'Multiplying by −3 reverses the direction and scales the length by 3; a magnitude is never negative.'],
    s: 'From the tail (−2, −1) to the head (2, 2), v = ⟨4, 3⟩, so |v| = √(16 + 9) = 5. Multiplying by −3 makes the vector 3 times as long: |−3v| = 3 · 5 = 15.',
  },
]);

// ── Precalculus · complex plane, polar curves, unit circle ──────────────────
const ALT_CP = 'The complex plane: a square grid with a horizontal real axis and a vertical imaginary axis, both numbered in steps of one.';
G('2515225c.lo-1', 'Complex numbers as points', [
  {
    t: 'read the complex number of a plotted point', d: 1,
    spec: cplane([{ re: -3, im: 2, label: 'P' }]),
    alt: `${ALT_CP} One point, labelled P, is plotted.`,
    q: 'Which complex number is represented by the point P in the complex plane shown?',
    o: [[complexText(-3, 2), 'correct'], [complexText(2, -3), 'swaps the real and imaginary parts'], [complexText(3, 2), 'drops the sign of the real part'], [complexText(-3, -2), 'gives the conjugate']],
    calc: ['real and imaginary part of the point from the kind\'s model (figure-core checker pc_modulus confirms it is on gridlines), written as a + bi', (c) => { c.run('pc_modulus', { point: 0 }); const q = pcM(c).points[0]; return complexText(q.re, q.im); }],
    h: ['The horizontal axis gives the real part and the vertical axis gives the imaginary part.', 'Read how far P is left or right of the origin, then how far up or down.'],
    s: 'P is 3 units to the left of the origin, so the real part is −3, and 2 units up, so the imaginary part is 2. The point represents −3 + 2i.',
  },
  {
    t: 'modulus of a plotted complex number', d: 2,
    spec: cplane([{ re: 3, im: -4, label: 'z', showModulus: true }]),
    alt: `${ALT_CP} One point, labelled z, is plotted and joined to the origin by a line segment.`,
    q: 'The point z is plotted in the complex plane shown. What is the modulus |z|?',
    n: '5',
    ck: ['pc_modulus', { point: 0 }],
    h: ['The modulus is the distance from the origin to the point.', 'Read the real and imaginary parts from the grid and use the Pythagorean theorem.'],
    s: 'The point is 3 units right of the origin and 4 units down, so z = 3 − 4i. Its modulus is the length of the segment from the origin: |z| = √(3² + (−4)²) = √25 = 5.',
  },
  {
    t: 'pick the point that represents a given complex number', d: 1,
    spec: cplane([{ re: 2, im: -3, label: 'P' }, { re: -3, im: 2, label: 'Q' }, { re: 2, im: 3, label: 'R' }, { re: -2, im: -3, label: 'S' }]),
    alt: `${ALT_CP} Four points, labelled with letters, are plotted in different quadrants.`,
    q: 'Four points are plotted in the complex plane shown. Which point represents the complex number 2 − 3i?',
    o: [['P', 'correct'], ['Q', 'swaps the real and imaginary parts'], ['R', 'ignores the sign of the imaginary part'], ['S', 'puts the negative sign on the real part as well']],
    holds: ['coordinates of each labelled point from the kind\'s model compared with (2, −3)', ['P', 'Q', 'R', 'S'].map((l) => (c: Ctx) => { const q = pcM(c).points.find((x) => x.label === l)!; return near(q.re, 2) && near(q.im, -3); })],
    h: ['The real part tells you how far to move along the horizontal axis.', 'The imaginary part tells you how far to move along the vertical axis; negative means down.'],
    s: 'For 2 − 3i the real part is 2 (two units to the right) and the imaginary part is −3 (three units down). The point at that position is P.',
  },
]);

const ALT_POLAR = 'A polar grid: concentric circles numbered by their radius and rays drawn at regular angles from the pole. A closed curve is drawn on the grid.';
G('f9413463.lo-6', 'Key features of polar curves', [
  {
    t: 'find n for a rose curve from its petals', d: 3,
    spec: polar({ rMax: 4, rStep: 1, angleStep: 30, curve: { expr: '3*sin(2*theta)' } }),
    alt: ALT_POLAR,
    q: 'The polar curve shown has an equation of the form r = a·sin(nθ), where a > 0 and n is a positive whole number. What is the value of n?',
    n: '2',
    calc: ['the drawn curve (kind\'s model) compared, at every tenth of a degree, with a·sin(nθ) for n = 1 … 8, a = the largest r; the single n that matches', (c) => { const a = Math.max(...polarSamples(c).map((q) => q.r)); const ns = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => polarSamples(c).every((q) => Math.abs(q.r - a * Math.sin((n * q.deg * Math.PI) / 180)) < 1e-6)); if (ns.length !== 1) throw new Error(`${ns.length} values of n fit`); return ns[0]; }],
    h: ['Count the petals of the rose.', 'A rose r = a·sin(nθ) has n petals when n is odd and 2n petals when n is even.'],
    s: 'The curve is a rose with 4 petals. An odd n would give n petals, and 4 is not odd, so n must be even with 2n = 4. Therefore n = 2.',
  },
  {
    t: 'greatest distance of a polar curve from the pole', d: 1,
    spec: polar({ rMax: 5, rStep: 1, angleStep: 30, curve: { expr: '2 - 2*cos(theta)' } }),
    alt: ALT_POLAR,
    q: 'What is the greatest distance from the pole reached by the polar curve shown?',
    n: '4',
    calc: ['largest |r| over the drawn curve, sampled every tenth of a degree (kind\'s model)', (c) => round(Math.max(...polarSamples(c).map((q) => Math.abs(q.r))), 6)],
    h: ['Distance from the pole is read from the numbered circles.', 'Find the point of the curve that lies on the largest circle it touches.'],
    s: 'The curve reaches farthest from the pole along the ray θ = 180°, where it touches the fourth circle; the circles are numbered along the polar axis, and that circle is numbered 4. Its greatest distance from the pole is 4.',
  },
  {
    t: 'identify the symmetry of a polar curve', d: 2,
    spec: polar({ rMax: 5, rStep: 1, angleStep: 30, angleLabels: 'radians', curve: { expr: '2 + 2*sin(theta)' } }),
    alt: ALT_POLAR,
    q: 'Which symmetry does the polar curve shown have?',
    o: [['About the line θ = π/2 only', 'correct'], ['About the polar axis only', 'confuses the vertical line θ = π/2 with the polar axis'], ['About both the polar axis and the line θ = π/2', 'assumes a closed curve around the pole has both symmetries'], ['About neither the polar axis nor the line θ = π/2', 'overlooks that the left and right halves match']],
    holds: ['the drawn curve (kind\'s model, sampled) reflected in the polar axis and in the line θ = π/2: is every reflected point on the curve?', ([[false, true], [true, false], [true, true], [false, false]] as Array<[boolean, boolean]>).map(([ax, ln]) => (c: Ctx) => symmetric(c, (x, y) => [x, -y]) === ax && symmetric(c, (x, y) => [-x, y]) === ln)],
    h: ['Imagine folding the grid along the horizontal polar axis: do the two halves of the curve match?', 'Now fold along the vertical line θ = π/2 and compare again.'],
    s: 'The left half of the curve is the mirror image of the right half, so the curve is symmetric about the vertical line θ = π/2. The part above the polar axis is much larger than the part below it, so the curve is not symmetric about the polar axis.',
  },
]);

const ALT_UC = 'A unit circle centred at the origin of an x-y coordinate system. A radius is drawn from the origin to a point on the circle, and an arc marks the angle from the positive x-axis to that radius.';
G('2fd4669e.lo-1', 'Structure of the unit circle', [
  {
    t: 'coordinates of the point for a marked angle', d: 2,
    spec: ucircle([{ degrees: 150, arc: true, name: 'P', coords: 'blank' }]),
    alt: `${ALT_UC} The size of the angle is printed in degrees; the coordinates of the point P are replaced by question marks.`,
    q: 'The unit circle shown marks an angle in standard position and the point P where its terminal side meets the circle. What are the coordinates of P?',
    o: [['(−√3/2, 1/2)', 'correct'], ['(−1/2, √3/2)', 'swaps the cosine and sine values'], ['(√3/2, 1/2)', 'uses the reference angle without the sign for Quadrant II'], ['(−√3/2, −1/2)', 'makes both coordinates negative']],
    ck: ['uc_coordinates', { angle: 0, want: 'pair' }],
    h: ['Find the reference angle: the acute angle between the terminal side and the x-axis.', 'Then decide the sign of x and of y from the quadrant in which P lies.'],
    s: 'The marked angle is 150°, in Quadrant II, with reference angle 30°. On the unit circle a 30° reference angle gives the values √3/2 and 1/2. In Quadrant II, x is negative and y is positive, so P = (−√3/2, 1/2).',
  },
  {
    t: 'angle of a point whose coordinates are given', d: 2,
    spec: ucircle([{ degrees: 225, label: 'blank', arc: true, coords: 'show' }]),
    alt: `${ALT_UC} The coordinates of the point are printed beside it; the size of the angle is replaced by a question mark.`,
    q: 'The unit circle shown gives the coordinates of a point on the circle. What is the measure, in degrees, of the angle marked with a question mark? Give the angle between 0° and 360°.',
    n: '225',
    calc: ['the angle of the marked point in degrees, from the kind\'s model', (c) => ((ucDeg(c) % 360) + 360) % 360],
    h: ['Coordinates of equal size on the unit circle belong to a 45° reference angle.', 'Use the signs of the coordinates to find the quadrant, then measure from the positive x-axis.'],
    s: 'The point is (−√2/2, −√2/2). Coordinates of equal size mean a 45° reference angle, and both being negative puts the point in Quadrant III. The angle is 180° + 45° = 225°.',
  },
  {
    t: 'missing y-coordinate for an angle in radians', d: 2,
    spec: ucircle([{ pi: [5, 3], arc: true, coords: 'blank_y' }]),
    alt: `${ALT_UC} The size of the angle is printed in radians. The x-coordinate of the point is printed and its y-coordinate is replaced by a question mark.`,
    q: 'The unit circle shown marks an angle in radians and the point where its terminal side meets the circle. What is the missing y-coordinate of the point?',
    o: [['−√3/2', 'correct'], ['√3/2', 'forgets that y is negative below the x-axis'], ['−1/2', 'repeats the size of the x-coordinate'], ['−√2/2', 'uses the value for a reference angle of π/4']],
    ck: ['uc_coordinates', { angle: 0, want: 'y' }],
    h: ['Find the reference angle of the marked angle and the quadrant of the point.', 'On the unit circle x² + y² = 1; the printed x-coordinate tells you the size of y.'],
    s: 'The marked angle is 5π/3, in Quadrant IV, with reference angle π/3. The x-coordinate is 1/2, so the y-coordinate has size √3/2, and in Quadrant IV it is negative: y = −√3/2.',
  },
]);
// ═══ Objectives of the 105 list carried by an OLDER kind ═════════════════════
const ALT_FG = 'A coordinate grid with both axes numbered in steps of one, with the graph of a function drawn on it.';
const deriv = (f: (x: number) => number, x: number): number => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;
const TWO_PI = 2 * Math.PI;

// ── AP Calculus AB · Average and Instantaneous Rates of Change ──────────────
G('9e26ac42.lo-2', 'Instantaneous rate from a graph', [
  {
    t: 'instantaneous rate from a drawn tangent line', d: 2,
    spec: fgraph([-2, 6], [-3, 7], [{ expr: 'x^2/2', label: 'f' }, { expr: '2x - 2', label: 'L' }], { points: [{ x: 2, y: 2, label: 'P' }] }),
    alt: 'A coordinate grid with both axes numbered in steps of one. A curve labelled f and a straight line labelled L are drawn; the line touches the curve at a marked point P.',
    q: 'The graph shows a function f and the line L that is tangent to the graph of f at the point P. What is the instantaneous rate of change of f at P?',
    n: '2',
    ck: ['curve_slope', { curve: 1, x1: 2, x2: 4 }],
    h: ['The instantaneous rate of change of f at P equals the slope of the tangent line at P.', 'Pick two grid points on the line L and compute rise over run.'],
    s: 'The instantaneous rate of change at P is the slope of the tangent line L. L passes through (2, 2) and (4, 6), so its slope is (6 − 2) ÷ (4 − 2) = 2. The rate of change of f at P is 2.',
  },
  {
    t: 'compare instantaneous rates at marked points', d: 2,
    spec: fgraph([-5, 5], [-2, 7], [{ expr: 'x^2/4' }], { points: [{ x: -4, y: 4, label: 'P' }, { x: -2, y: 1, label: 'Q' }, { x: 0, y: 0, label: 'R' }, { x: 2, y: 1, label: 'S' }] }),
    alt: `${ALT_FG} Four points on the curve are marked and labelled with letters.`,
    q: 'Four points are marked on the graph of f shown. At which of these points is the instantaneous rate of change of f greatest?',
    o: [['S', 'correct'], ['P', 'picks the point where the curve is steepest, although it is falling there'], ['R', 'picks the lowest point of the curve, where the rate of change is zero'], ['Q', 'picks a point where the curve is falling']],
    holds: ['numerical derivative of the drawn function at the x of each marked point; the option holds when its point has the largest derivative', ['S', 'P', 'R', 'Q'].map((l) => (c: Ctx) => { const f = piecesOf(c)[0].f; const pts = c.p.points as Array<{ x: number; label: string }>; const mine = deriv(f, pts.find((q) => q.label === l)!.x); return pts.every((q) => q.label === l || deriv(f, q.x) < mine - 1e-6); })],
    h: ['The instantaneous rate of change at a point is the slope of the tangent to the curve there.', 'A falling curve has a negative rate of change, however steep it is.'],
    s: 'At P and Q the curve is falling, so the rate of change is negative there. At R the tangent is horizontal, so the rate is 0. At S the curve is rising, so the rate is positive. The greatest rate of change is at S.',
  },
]);

// ── AP Calculus AB · Estimating Limits from Graphs and Tables ───────────────
const ALT_PIECES = 'A coordinate grid with both axes numbered in steps of one, with the graph of a function drawn in separate pieces; filled and open circles mark the ends of the pieces.';
G('ba15a88f.lo-3', 'Existence of a limit', [
  {
    t: 'decide whether a two-sided limit exists at a break', d: 2,
    spec: fgraph([-4, 6], [-2, 6], [{ expr: 'x + 1', domain: [-4, 1], to: 'open' }, { expr: '4 - x', domain: [1, 6], from: 'closed' }]),
    alt: ALT_PIECES,
    q: 'The graph of a function f is shown. Which statement about the limit of f(x) as x approaches 1 is correct?',
    o: [['It does not exist', 'correct'], ['It exists and equals 2', 'uses only the left-hand limit'], ['It exists and equals 3', 'uses only the right-hand limit, which is also the value f(1)'], ['It exists and equals 1', 'gives the x-value being approached']],
    holds: ['left-hand and right-hand limits at x = 1 computed from the pieces of the spec', [
      (c) => !near(sideLimit(c, 1, -1), sideLimit(c, 1, 1)),
      (c) => near(sideLimit(c, 1, -1), sideLimit(c, 1, 1)) && near(sideLimit(c, 1, 1), 2),
      (c) => near(sideLimit(c, 1, -1), sideLimit(c, 1, 1)) && near(sideLimit(c, 1, 1), 3),
      (c) => near(sideLimit(c, 1, -1), sideLimit(c, 1, 1)) && near(sideLimit(c, 1, 1), 1),
    ]],
    h: ['Follow the graph toward x = 1 from the left and note the height it approaches; then do the same from the right.', 'A two-sided limit exists only when the two one-sided limits are equal.'],
    s: 'Coming from the left, the graph approaches the open circle at height 2. Coming from the right, it approaches the filled circle at height 3. The one-sided limits, 2 and 3, are different, so the limit as x approaches 1 does not exist.',
  },
  {
    t: 'find where a limit fails to exist', d: 3,
    spec: fgraph([-5, 6], [-3, 5], [{ expr: 'x/2 + 2', domain: [-5, -2], to: 'open' }, { expr: 'x/2 + 2', domain: [-2, 2], from: 'open', to: 'closed' }, { expr: 'x - 3', domain: [2, 6], from: 'open' }], { points: [{ x: -2, y: 3 }] }),
    alt: `${ALT_PIECES} One filled point lies apart from the pieces.`,
    q: 'The graph of a function f is shown. For which value of a does the limit of f(x) as x approaches a fail to exist?',
    n: '2',
    calc: ['left-hand and right-hand limits at every whole-number x inside the plot, from the pieces of the spec; the one x where they differ', (c) => { const xr = c.p.xRange as [number, number]; const bad: number[] = []; for (let x = xr[0] + 1; x < xr[1]; x++) if (!near(sideLimit(c, x, -1), sideLimit(c, x, 1))) bad.push(x); if (bad.length !== 1) throw new Error(`limits differ at ${bad.join(', ')}`); return bad[0]; }],
    h: ['A hole in the graph does not prevent a limit: check whether both sides head for the same height.', 'Look for a place where the graph approaches two different heights from the two sides.'],
    s: 'At x = −2 there is a hole, but the graph approaches height 1 from both sides, so the limit exists there. At x = 2 the graph approaches 3 from the left and −1 from the right. The one-sided limits differ, so the limit fails to exist at a = 2.',
  },
]);

// ── AP Calculus AB · Graphical Differentiability Analysis ───────────────────
G('7120b2e6.lo-1', 'Corners and cusps', [
  {
    t: 'locate the corner of a graph', d: 1,
    spec: fgraph([-4, 6], [-3, 5], [{ expr: 'abs(x - 1) - 2' }]),
    alt: ALT_FG,
    q: 'The graph of a function f is shown. At what value of x is f not differentiable?',
    n: '1',
    calc: ['one-sided slopes at every whole-number x inside the plot, from the spec; the one x where they differ', (c) => { const r = roughPoints(c); if (r.length !== 1 || behaviourAt(c, r[0]) !== 'corner') throw new Error(`not a single corner: ${r.join(', ')}`); return r[0]; }],
    h: ['A function is not differentiable where its graph has a sharp corner.', 'At a corner the slope just to the left differs from the slope just to the right.'],
    s: 'The graph is made of two straight parts that meet in a corner at (1, −2). To the left the slope is −1 and to the right it is 1, so there is no single tangent slope there. f is not differentiable at x = 1.',
  },
  {
    t: 'count the corners of a graph', d: 2,
    spec: fgraph([-5, 5], [-1, 5], [{ expr: 'abs(abs(x) - 2)' }]),
    alt: ALT_FG,
    q: 'The graph of a function f is shown for −5 ≤ x ≤ 5. At how many values of x in the open interval (−5, 5) is f not differentiable?',
    n: '3',
    calc: ['one-sided slopes at every whole-number x inside the plot, from the spec; the number of x where they differ', (c) => { const r = roughPoints(c); if (!r.every((x) => behaviourAt(c, x) === 'corner')) throw new Error('not all corners'); return r.length; }],
    h: ['Look for every point where the graph changes direction abruptly.', 'A corner that points upward counts just as much as one that points downward.'],
    s: 'The graph has corners at x = −2, x = 0 and x = 2: at each of them the slope jumps between −1 and 1. Everywhere else the graph is a straight line with a single slope. f fails to be differentiable at 3 values of x.',
  },
]);

G('7120b2e6.lo-2', 'Vertical tangents', [
  {
    t: 'name the feature that prevents differentiability', d: 2,
    spec: fgraph([-4, 6], [-2, 4], [{ expr: '1 - sqrt(1 - x)', domain: [-4, 1] }, { expr: '1 + sqrt(x - 1)', domain: [1, 6] }]),
    alt: ALT_FG,
    q: 'The graph of a continuous function f is shown. Which feature of the graph makes f not differentiable at x = 1?',
    o: [['A vertical tangent line', 'correct'], ['A corner', 'takes a change of bending for an abrupt change of direction'], ['A jump discontinuity', 'overlooks that the two parts of the graph join at the same point'], ['A hole in the graph', 'overlooks that the function has a value at x = 1']],
    holds: ['one-sided limits and one-sided slopes at x = 1 computed from the spec: equal limits with slopes that grow without bound in the same direction on both sides is a vertical tangent', (['vertical tangent', 'corner', 'jump', 'gap'] as Smooth[]).map((b) => (c: Ctx) => behaviourAt(c, 1) === b)],
    h: ['Check first whether the graph is broken at x = 1 or passes through a single point there.', 'Then look at how steep the graph becomes as it nears that point from each side.'],
    s: 'The graph passes through (1, 1) without a break, so there is no jump or hole. It rises through that point more and more steeply from both sides, until the tangent line there is vertical. A vertical line has no defined slope, so f is not differentiable at x = 1.',
  },
  {
    t: 'locate a vertical tangent', d: 2,
    spec: fgraph([-6, 4], [-1, 5], [{ expr: '2 + sqrt(-2 - x)', domain: [-6, -2] }, { expr: '2 - sqrt(x + 2)', domain: [-2, 4] }]),
    alt: ALT_FG,
    q: 'The graph of a continuous function f is shown. At what value of x does the graph have a vertical tangent line?',
    n: '-2',
    calc: ['one-sided slopes at every whole-number x inside the plot, from the spec; the one x where both grow without bound', (c) => { const r = roughPoints(c); if (r.length !== 1 || behaviourAt(c, r[0]) !== 'vertical tangent') throw new Error(`not a single vertical tangent: ${r.join(', ')}`); return r[0]; }],
    h: ['A vertical tangent occurs where the graph, without breaking, becomes momentarily straight up and down.', 'Find the point where the curve changes the way it bends while running vertically.'],
    s: 'The graph falls from left to right and is steepest at the point (−2, 2), where it runs straight down for an instant: the tangent line there is the vertical line x = −2. So the vertical tangent is at x = −2.',
  },
]);

const DIFF_PIECES = [{ expr: 'x + 4', domain: [-5, -2], to: 'open' }, { expr: '-x - 1', domain: [-2, 1], from: 'closed' }, { expr: 'x - 3', domain: [1, 5] }];
G('7120b2e6.lo-4', 'Differentiability from a graph', [
  {
    t: 'count the points of non-differentiability', d: 2,
    spec: fgraph([-5, 5], [-3, 3], DIFF_PIECES), alt: ALT_PIECES,
    q: 'The graph of a function f is shown for −5 ≤ x ≤ 5. At how many values of x in the open interval (−5, 5) is f not differentiable?',
    n: '2',
    calc: ['one-sided limits and slopes at every whole-number x inside the plot, from the spec; the number of x that are not smooth', (c) => roughPoints(c).length],
    h: ['A function is not differentiable where it is discontinuous.', 'It is also not differentiable where the graph is continuous but has a sharp corner.'],
    s: 'At x = −2 the graph jumps from the open circle at height 2 to the filled circle at height 1: f is discontinuous there, so not differentiable. At x = 1 the graph is continuous but has a corner, where the slope changes from −1 to 1. Those are the only two such values.',
  },
  {
    t: 'find where f is continuous but not differentiable', d: 2,
    spec: fgraph([-5, 5], [-3, 3], DIFF_PIECES), alt: ALT_PIECES,
    q: 'The graph of a function f is shown. At which value of x is f continuous but not differentiable?',
    o: [['x = 1', 'correct'], ['x = −2', 'picks the jump, where f is not continuous'], ['x = 0', 'picks the y-intercept, where the graph is a straight line'], ['x = 3', 'picks an x-intercept, where the graph is a straight line']],
    holds: ['behaviour at each option\'s x computed from the spec (one-sided limits and slopes): the option holds at a corner', [1, -2, 0, 3].map((x) => (c: Ctx) => behaviourAt(c, x) === 'corner')],
    h: ['Continuous means the graph can be traced through the point without lifting the pencil.', 'Not differentiable at a continuous point means the direction of the graph changes abruptly there.'],
    s: 'At x = 1 the two straight parts meet at the point (1, −2) with no break, so f is continuous there, but the slope changes from −1 to 1, so f is not differentiable. At x = −2 the graph has a jump, so f is not even continuous there.',
  },
]);

// ── AP Calculus AB · Limits involving infinity ──────────────────────────────
const ALT_ASY = 'A coordinate grid with both axes numbered in steps of one. The graph of a function is drawn in two branches, with a dashed vertical guide line and a dashed horizontal guide line.';
G('e7957044.lo-3', 'Limits and asymptotes', [
  {
    t: 'limit at infinity from the horizontal asymptote', d: 1,
    spec: fgraph([-4, 8], [-5, 7], [{ expr: '1/(x - 2) + 1' }], { asymptotes: [{ x: 2 }, { y: 1 }] }),
    alt: ALT_ASY,
    q: 'The graph of a function f is shown together with its asymptotes (the dashed lines). What is the limit of f(x) as x increases without bound?',
    n: '1',
    calc: ['the drawn function evaluated at x = 10⁹, rounded (the height of the horizontal asymptote in the spec is checked to be the same)', (c) => { const v = round(piecesOf(c)[0].f(1e9), 6); const ha = (c.p.asymptotes as Array<{ y?: number }>).find((a) => a.y !== undefined)!.y; if (!near(v, ha as number)) throw new Error('the drawn asymptote is not the limit'); return v; }],
    h: ['Follow the right-hand branch of the graph as x gets larger and larger.', 'The graph levels out toward one of the dashed lines: read its height on the y-axis.'],
    s: 'As x increases, the right-hand branch of the graph gets closer and closer to the horizontal dashed line, which is at height y = 1. So the limit of f(x) as x increases without bound is 1.',
  },
  {
    t: 'one-sided behaviour at a vertical asymptote', d: 2,
    spec: fgraph([-7, 5], [-8, 4], [{ expr: '2/(x + 1) - 2' }], { asymptotes: [{ x: -1 }, { y: -2 }] }),
    alt: ALT_ASY,
    q: 'The graph of a function f is shown together with its asymptotes (the dashed lines). Which statement describes f(x) as x approaches −1 from the left?',
    o: [['f(x) decreases without bound', 'correct'], ['f(x) increases without bound', 'follows the branch on the right of the vertical asymptote'], ['f(x) approaches −2', 'gives the height of the horizontal asymptote'], ['f(x) approaches −1', 'gives the position of the vertical asymptote']],
    holds: ['left-hand limit at x = −1 computed from the drawn function', [
      (c) => sideLimit(c, -1, -1) === -Infinity, (c) => sideLimit(c, -1, -1) === Infinity, (c) => near(sideLimit(c, -1, -1), -2), (c) => near(sideLimit(c, -1, -1), -1),
    ]],
    h: ['Find the vertical dashed line and look only at the branch of the graph on its left.', 'Follow that branch toward the dashed line: does it go up or down?'],
    s: 'The vertical asymptote is the dashed line x = −1. The branch to its left plunges downward as it nears the line, so f(x) decreases without bound (the limit from the left is −∞).',
  },
]);

// ── AP Chemistry · Acid-Base Titration Curves ───────────────────────────────
const ALT_TIT = 'A titration curve: pH on the vertical axis against the volume of titrant added, in millilitres, on the horizontal axis. The curve has one nearly vertical section.';
G('500ae70f.lo-1', 'Equivalence point', [
  {
    t: 'read the equivalence volume from a weak-acid curve', d: 1,
    spec: S('titration_curve', { analyte: { type: 'weak_acid', concentration: 0.16, volume: 25, pKa: 4.8 }, titrantConcentration: 0.1, maxVolume: 60 }),
    alt: ALT_TIT,
    q: 'The titration curve shown is for a sample of a weak acid titrated with a strong base. What volume of base, in mL, has been added at the equivalence point?',
    n: '40',
    ck: ['titration_equivalence_volume', {}],
    h: ['The equivalence point lies in the middle of the nearly vertical section of the curve.', 'Read the volume on the horizontal axis directly below that section.'],
    s: 'The pH rises almost vertically at one volume: this steep section marks the equivalence point. Reading down to the horizontal axis, it is at 40 mL of base.',
  },
  {
    t: 'judge the pH at the equivalence point', d: 2,
    spec: S('titration_curve', { analyte: { type: 'weak_base', concentration: 0.1, volume: 20, pKb: 4.7 }, titrantConcentration: 0.1, maxVolume: 40 }),
    alt: ALT_TIT,
    q: 'The titration curve shown is for a sample of a base titrated with a strong acid. Which describes the pH at the equivalence point?',
    o: [['Below 7', 'correct'], ['Exactly 7', 'assumes every equivalence point is neutral'], ['Between 7 and 10', 'reads the pH just before the steep section'], ['Above 10', 'reads the pH at the start of the titration']],
    holds: ['pH at the equivalence volume computed from the chemistry of the spec (the renderer\'s titrationPH)', [
      (c) => eqPH(c) < 6.5 && startPH(c) > 10, (c) => Math.abs(eqPH(c) - 7) < 0.05, (c) => eqPH(c) > 7.05 && eqPH(c) <= 10, (c) => eqPH(c) > 10,
    ]],
    h: ['Locate the middle of the nearly vertical section of the curve.', 'Read its height on the pH axis and compare it with 7.'],
    s: 'The steep section of the curve runs from about pH 8 down to about pH 3, and its midpoint, the equivalence point, is near pH 5. That is below 7, as expected when a weak base is titrated with a strong acid.',
  },
  {
    t: 'concentration of the analyte from the equivalence volume', d: 3,
    spec: S('titration_curve', { analyte: { type: 'strong_acid', concentration: 0.12, volume: 25 }, titrantConcentration: 0.1, maxVolume: 50 }),
    alt: ALT_TIT,
    q: 'A 25.0 mL sample of hydrochloric acid is titrated with 0.100 M NaOH, giving the titration curve shown. What is the concentration of the hydrochloric acid, in mol/L?',
    n: '0.12',
    calc: ['figure-core checker titration_equivalence_volume, times 0.100 M, divided by 25.0 mL', (c) => round((c.num('titration_equivalence_volume') * 0.1) / 25, 6)],
    h: ['Read the volume of NaOH at the equivalence point from the steep section of the curve.', 'At equivalence, moles of NaOH added equal moles of HCl in the sample.'],
    s: 'The steep section of the curve is at 30 mL, so 30.0 mL of 0.100 M NaOH was needed: 0.00300 mol. HCl and NaOH react 1 : 1, so the sample held 0.00300 mol of HCl in 25.0 mL: 0.00300 ÷ 0.0250 = 0.12 mol/L.',
  },
]);

// ── AP Chemistry · Average Atomic Mass from Isotopes (mass spectrum as bars) ─
const ALT_MS = 'A mass spectrum drawn as a bar chart: one bar for each isotope, with mass number along the horizontal axis and relative abundance in percent on the vertical axis.';
const BORON = S('bar_chart', { categories: ['10', '11'], values: [20, 80], xLabel: 'Mass number', yLabel: 'Relative abundance (%)', yMin: 0, yMax: 100, yStep: 20 });
G('ada76c1a.lo-2', 'Reading a mass spectrum', [
  {
    t: 'read the abundance of one isotope', d: 1,
    spec: BORON, alt: ALT_MS,
    q: 'The mass spectrum of an element is shown as a bar chart. What is the percent abundance of the heavier isotope?',
    n: '80',
    ck: ['bar_value', { category: '11' }],
    h: ['Each bar stands for one isotope; its position gives the mass number.', 'Find the bar with the larger mass number and read its height on the vertical axis.'],
    s: 'The two bars are at mass numbers 10 and 11. The heavier isotope is the one at 11, and its bar reaches 80 on the abundance axis, so its abundance is 80 percent.',
  },
  {
    t: 'average atomic mass from the spectrum', d: 3,
    spec: BORON, alt: ALT_MS,
    q: 'The mass spectrum of an element is shown as a bar chart. Taking each isotope\'s mass to be its mass number, what is the average atomic mass of the element, in amu? Give your answer to one decimal place.',
    n: '10.8',
    calc: ['figure-core checker bar_value for both bars; mass numbers weighted by abundance', (c) => round((10 * c.num('bar_value', { category: '10' }) + 11 * c.num('bar_value', { category: '11' })) / 100, 6)],
    h: ['Read the mass number and the percent abundance of each isotope from the chart.', 'Multiply each mass by its abundance as a decimal, then add the results.'],
    s: 'The chart shows 20 percent at mass number 10 and 80 percent at mass number 11. Average atomic mass = 0.20 · 10 + 0.80 · 11 = 2.0 + 8.8 = 10.8 amu.',
  },
  {
    t: 'identify the most abundant isotope', d: 1,
    spec: S('bar_chart', { categories: ['24', '25', '26'], values: [80, 10, 10], xLabel: 'Mass number', yLabel: 'Relative abundance (%)', yMin: 0, yMax: 100, yStep: 20 }),
    alt: ALT_MS,
    q: 'The mass spectrum of an element is shown as a bar chart. What is the mass number of its most abundant isotope?',
    n: '24',
    ck: ['bar_extreme', { which: 'largest' }],
    h: ['The height of a bar shows how abundant that isotope is.', 'Find the tallest bar and read the mass number under it.'],
    s: 'The tallest bar by far is the first one, and the number under it on the horizontal axis is 24. The most abundant isotope has mass number 24.',
  },
]);

// ── AP Chemistry · Collision Theory (Maxwell–Boltzmann distributions) ───────
const MB = fgraph([0, 9], [0, 4], [{ expr: '3*(x/2)^2*exp(1 - (x/2)^2)', label: 'A' }, { expr: '2*(x/3)^2*exp(1 - (x/3)^2)', label: 'B' }], { xLabel: 'Molecular speed (km/s)', yLabel: 'Relative number of molecules' });
const ALT_MB = 'Two distribution curves, labelled A and B, on one grid: relative number of molecules on the vertical axis against molecular speed in kilometres per second on the horizontal axis. Each curve rises from zero to a single peak and falls away again.';
const peakX = (c: Ctx, k: number): number => { const f = piecesOf(c)[k].f; let best = 0; for (let i = 0; i <= 9000; i++) if (f(i / 1000) > f(best)) best = i / 1000; return best; };
G('27b58964.lo-3', 'Maxwell–Boltzmann distributions', [
  {
    t: 'tell which distribution is at the higher temperature', d: 2,
    spec: MB, alt: ALT_MB,
    q: 'Curves A and B in the graph show the distribution of molecular speeds in the same sample of gas at two different temperatures. Which curve corresponds to the higher temperature?',
    o: [['Curve B, by a wide margin', 'correct'], ['Curve A, by a wide margin', 'takes the taller peak as the sign of a higher temperature'], ['Neither: the temperatures are equal', 'reasons that the same sample must give the same distribution'], ['The graph cannot show temperature', 'overlooks that the position of the peak depends on temperature']],
    holds: ['position of the peak of each drawn curve (sampled from the spec): the hotter gas has its peak at the higher speed', [(c) => peakX(c, 1) > peakX(c, 0) + 0.1, (c) => peakX(c, 0) > peakX(c, 1) + 0.1, (c) => Math.abs(peakX(c, 0) - peakX(c, 1)) <= 0.1, () => false]],
    h: ['At a higher temperature the molecules move faster on average.', 'Compare where the peaks of the two curves lie along the speed axis, and how far each curve spreads to the right.'],
    s: 'The peak of curve B lies at a higher speed than the peak of curve A, and curve B is lower and spread farther to the right. A distribution shifted toward higher speeds belongs to the higher temperature, so curve B is the hotter sample.',
  },
  {
    t: 'read the most probable speed at the lower temperature', d: 2,
    spec: MB, alt: ALT_MB,
    q: 'Curves A and B in the graph show the distribution of molecular speeds in the same sample of gas at two different temperatures. What is the most probable speed of the molecules at the lower temperature, in km/s?',
    n: '2',
    ck: ['curve_extremum', { curve: 0, which: 'max', want: 'x' }],
    h: ['First decide which curve belongs to the lower temperature: its peak lies at the lower speed.', 'The most probable speed is the speed at which that curve has its peak.'],
    s: 'The lower temperature has the distribution shifted toward lower speeds: curve A. The most probable speed is where the curve peaks; the peak of curve A is directly above 2 on the speed axis, so the most probable speed is 2 km/s.',
  },
]);

// ── AP Biology · Energy Flow Through Ecosystems (bar charts of energy) ──────
G('4c5ca766.lo-4', 'Productivity and energy flow data', [
  {
    t: 'net primary productivity from GPP and respiration', d: 2,
    spec: S('bar_chart', { categories: ['GPP', 'Respiration'], values: [2500, 1500], yLabel: 'Energy (kJ/m² per year)', yMin: 0, yMax: 3000, yStep: 500 }),
    alt: 'A bar chart with two bars, labelled GPP and Respiration, and energy in kilojoules per square metre per year on the vertical axis.',
    q: 'The bar chart shows the gross primary productivity (GPP) of a grassland and the energy its producers use in respiration. What is the net primary productivity of the grassland, in kJ/m² per year?',
    n: '1000',
    ck: ['bar_difference', { a: 'GPP', b: 'Respiration' }],
    h: ['Net primary productivity is the energy producers capture minus the energy they use themselves.', 'Read the height of each bar and subtract.'],
    s: 'The chart shows GPP = 2500 and respiration = 1500 kJ/m² per year. Net primary productivity = GPP − respiration = 2500 − 1500 = 1000 kJ/m² per year.',
  },
  {
    t: 'efficiency of energy transfer between trophic levels', d: 2,
    spec: S('bar_chart', { categories: ['Primary consumers', 'Secondary consumers'], values: [1600, 200], yLabel: 'Energy stored (kJ/m² per year)', yMin: 0, yMax: 2000, yStep: 400 }),
    alt: 'A bar chart with two bars, one for primary consumers and one for secondary consumers, and energy stored in kilojoules per square metre per year on the vertical axis.',
    q: 'The bar chart shows the energy stored each year in two trophic levels of a lake ecosystem. What percent of the energy stored in the primary consumers is transferred to the secondary consumers? Give a number without the % sign.',
    n: '12.5',
    calc: ['figure-core checker bar_ratio (secondary ÷ primary), times 100', (c) => round(100 * c.num('bar_ratio', { a: 'Secondary consumers', b: 'Primary consumers' }), 6)],
    h: ['Read the energy stored in each trophic level from the heights of the bars.', 'Divide the energy of the higher level by the energy of the level below it, and write the result as a percent.'],
    s: 'The chart shows 1600 kJ/m² per year in the primary consumers and 200 in the secondary consumers. Transfer efficiency = 200 ÷ 1600 = 0.125, which is 12.5 percent.',
  },
]);

// ── Algebra 2 / Precalculus · polynomial graphs from zeros and end behaviour ─
type FnOpt = [string, string, string];
const fnHolds = (opts: FnOpt[]): Array<(c: Ctx) => boolean> => opts.map(([, , expr]) => (c: Ctx) => sameCurve(c, 0, compileExpression(expr, ['x'])));
const POLY_A: FnOpt[] = [
  ['y = ½(x + 2)(x − 1)²', 'correct', '(x + 2)*(x - 1)^2/2'],
  ['y = ½(x + 2)²(x − 1)', 'puts the double zero where the graph crosses the axis', '(x + 2)^2*(x - 1)/2'],
  ['y = −½(x + 2)(x − 1)²', 'has the right zeros but the opposite end behaviour', '-1*(x + 2)*(x - 1)^2/2'],
  ['y = ½(x − 2)(x + 1)²', 'reverses the signs of the zeros', '(x - 2)*(x + 1)^2/2'],
];
const ALT_POLY = 'A coordinate grid with both axes numbered in steps of one, with the smooth graph of a polynomial function that meets the x-axis at grid points.';
G('3d8a1482.lo-5', 'Polynomial graphs from zeros and end behaviour', [
  {
    t: 'match a polynomial graph to its factored equation', d: 3,
    spec: fgraph([-4, 4], [-4, 6], [{ expr: '(x + 2)*(x - 1)^2/2' }]), alt: ALT_POLY,
    q: 'The graph of a polynomial function is shown. Which equation could be the equation of this function?',
    o: POLY_A.map(([t, w]) => [t, w]),
    holds: ['each option\'s function compared with the drawn function at 401 points of the plot', fnHolds(POLY_A)],
    h: ['Where the graph crosses the x-axis the zero has odd multiplicity; where it touches and turns back, even multiplicity.', 'Then use the end behaviour to decide the sign of the leading coefficient.'],
    s: 'The graph crosses the x-axis at x = −2, so (x + 2) appears to the first power, and touches it at x = 1, so (x − 1) is squared. The graph falls to the left and rises to the right, as for a cubic with a positive leading coefficient. This matches y = ½(x + 2)(x − 1)²; its y-intercept, ½ · 2 · 1 = 1, also agrees with the graph.',
    offGridOk: 'the answer rests on the zeros, the y-intercept and the end behaviour, all at grid points',
  },
  {
    t: 'read degree parity and leading-coefficient sign from end behaviour', d: 2,
    spec: fgraph([-4, 4], [-6, 6], [{ expr: '-x^3/2 + 2x' }]), alt: ALT_POLY,
    q: 'The graph of a polynomial function is shown. Which describes the degree and the leading coefficient of the polynomial?',
    o: [['Odd degree, negative leading coefficient', 'correct'], ['Odd degree, positive leading coefficient', 'reads the ends of the graph in the wrong order'], ['Even degree, negative leading coefficient', 'looks only at the right-hand end, which falls'], ['Even degree, positive leading coefficient', 'looks only at the left-hand end, which rises']],
    holds: ['signs of the drawn function at the left and right edges of the plot (beyond every zero): opposite ends → odd degree; a falling right-hand end → negative leading coefficient', ([[true, true], [true, false], [false, true], [false, false]] as Array<[boolean, boolean]>).map(([odd, neg]) => (c: Ctx) => { const f = piecesOf(c)[0].f; const xr = c.p.xRange as [number, number]; const l = Math.sign(f(xr[0])); const r = Math.sign(f(xr[1])); return (l !== r) === odd && (r < 0) === neg; })],
    h: ['Compare the two ends of the graph: do they point the same way or opposite ways?', 'The right-hand end shows the sign of the leading coefficient.'],
    s: 'The left end of the graph rises and the right end falls. Ends that point in opposite directions mean an odd degree, and a right-hand end that falls means a negative leading coefficient.',
    offGridOk: 'the answer rests on the directions of the two ends of the graph, not on the heights of its turning points',
  },
]);

const POLY_B: FnOpt[] = [
  ['f(x) = −½(x + 1)²(x − 2)', 'correct', '-1*(x + 1)^2*(x - 2)/2'],
  ['f(x) = ½(x + 1)²(x − 2)', 'has the right zeros but the opposite end behaviour', '(x + 1)^2*(x - 2)/2'],
  ['f(x) = −½(x + 1)(x − 2)²', 'puts the double zero where the graph crosses the axis', '-1*(x + 1)*(x - 2)^2/2'],
  ['f(x) = −½(x − 1)²(x + 2)', 'reverses the signs of the zeros', '-1*(x - 1)^2*(x + 2)/2'],
];
G('181b8129.lo-5', 'Polynomial graphs: end behaviour, zeros, multiplicity', [
  {
    t: 'find the zero of even multiplicity from the graph', d: 2,
    spec: fgraph([-5, 4], [-3, 6], [{ expr: '(x + 3)*(x - 2)^2/4' }]), alt: ALT_POLY,
    q: 'The graph of a polynomial function is shown. One of its zeros has even multiplicity. What is that zero?',
    n: '2',
    calc: ['whole-number zeros of the drawn function at which its sign is the same on both sides', (c) => { const f = piecesOf(c)[0].f; const xr = c.p.xRange as [number, number]; const hits: number[] = []; for (let x = xr[0] + 1; x < xr[1]; x++) if (Math.abs(f(x)) < 1e-9 && Math.sign(f(x - 0.01)) === Math.sign(f(x + 0.01))) hits.push(x); if (hits.length !== 1) throw new Error(`${hits.length} such zeros`); return hits[0]; }],
    h: ['At a zero of odd multiplicity the graph crosses the x-axis.', 'At a zero of even multiplicity the graph touches the x-axis and turns back.'],
    s: 'The graph meets the x-axis at x = −3 and at x = 2. At x = −3 it passes through the axis, so that zero has odd multiplicity. At x = 2 it touches the axis and turns back up, so the zero of even multiplicity is 2.',
    offGridOk: 'the answer rests on the two zeros, which are at grid points',
  },
  {
    t: 'match a polynomial graph to its factored form', d: 3,
    spec: fgraph([-4, 4], [-6, 4], [{ expr: '-1*(x + 1)^2*(x - 2)/2' }]), alt: ALT_POLY,
    q: 'The graph of a polynomial function f is shown. Which could be the formula for f(x)?',
    o: POLY_B.map(([t, w]) => [t, w]),
    holds: ['each option\'s function compared with the drawn function at 401 points of the plot', fnHolds(POLY_B)],
    h: ['Decide at which zero the graph crosses the x-axis and at which it only touches it.', 'Then check the end behaviour, or the y-intercept, to settle the sign of the leading coefficient.'],
    s: 'The graph touches the x-axis at x = −1 (a squared factor) and crosses it at x = 2 (a single factor). It rises to the left and falls to the right, so the leading coefficient is negative. This matches f(x) = −½(x + 1)²(x − 2), whose y-intercept is −½ · 1 · (−2) = 1, as on the graph.',
    offGridOk: 'the answer rests on the zeros, the y-intercept and the end behaviour, all at grid points',
  },
]);

// ── Precalculus · Tangent, secant, cosecant graphs / Phase shift ────────────
const ALT_TRIG = 'A coordinate grid whose x-axis is marked in multiples of π, with the graph of a trigonometric function drawn on it.';
const periodHolds = (cands: number[]): Array<(c: Ctx) => boolean> => cands.map((T) => (c: Ctx) => {
  const f = piecesOf(c)[0].f;
  const isPeriod = (t: number) => Array.from({ length: 200 }, (_, i) => -3 + i * 0.031).every((x) => { const u = f(x); const v = f(x + t); return Math.abs(u) > 20 || Math.abs(v) > 20 || Math.abs(u - v) < 1e-6; });
  return isPeriod(T) && !cands.some((t) => t < T - 1e-9 && isPeriod(t));
});
const SEC_OPTS: FnOpt[] = [
  ['y = 2 sec x', 'correct', '2/cos(x)'],
  ['y = 2 csc x', 'confuses secant with cosecant: its asymptotes would be at multiples of π', '2/sin(x)'],
  ['y = sec 2x', 'reads the 2 as a change of period instead of a vertical stretch', '1/cos(2x)'],
  ['y = 2 cos x', 'takes the reciprocal function for the function itself', '2*cos(x)'],
];
G('5d6790af.lo-3', 'Graphs of tangent, secant and cosecant', [
  {
    t: 'read the period of a tangent graph', d: 2,
    spec: fgraph([-TWO_PI, TWO_PI], [-4, 4], [{ expr: 'tan(x/2)' }], { xStep: undefined, xTickUnit: 'pi', xTickDivisor: 1, asymptotes: [{ x: -Math.PI }, { x: Math.PI }] }),
    alt: `${ALT_TRIG} The graph is in separate branches, with dashed vertical guide lines between them.`,
    q: 'The graph of a tangent function is shown, with its vertical asymptotes drawn as dashed lines. What is the period of the function?',
    o: [['2π', 'correct'], ['π', 'gives the period of y = tan x without reading the graph'], ['4π', 'takes the width of the whole plot'], ['π/2', 'halves the period of tan x instead of doubling it']],
    holds: ['the drawn function tested for each candidate period T (f(x + T) = f(x) at 200 points); the option holds when it is the smallest candidate that works', periodHolds([2 * Math.PI, Math.PI, 4 * Math.PI, Math.PI / 2])],
    h: ['For a tangent graph, the period is the distance between two neighbouring vertical asymptotes.', 'Read the positions of the dashed lines on the x-axis and subtract.'],
    s: 'The vertical asymptotes shown are at x = −π and x = π. One complete branch of the tangent curve lies between them, so the period is π − (−π) = 2π.',
  },
  {
    t: 'match a reciprocal trig graph to its equation', d: 3,
    spec: fgraph([-TWO_PI, TWO_PI], [-6, 6], [{ expr: '2/cos(x)' }], { xStep: undefined, xTickUnit: 'pi', xTickDivisor: 2 }),
    alt: `${ALT_TRIG} The graph is made of separate U-shaped branches that open alternately upward and downward.`,
    q: 'The graph of a trigonometric function is shown. Which equation matches the graph?',
    o: SEC_OPTS.map(([t, w]) => [t, w]),
    holds: ['each option\'s function compared with the drawn function at 401 points of the plot (points within reach of a pole left out)', fnHolds(SEC_OPTS)],
    h: ['Find where the branches turn: the lowest points of the upward branches and the highest points of the downward ones.', 'A secant graph has a branch that turns on the y-axis; a cosecant graph has an asymptote there.'],
    s: 'A branch of the graph turns on the y-axis at the point (0, 2), and the branches are separated by gaps at x = ±π/2 and ±3π/2, where cos x = 0. That is the pattern of a secant graph, stretched vertically by 2: y = 2 sec x.',
    offGridOk: 'the turning points of the branches are at heights 2 and −2, on gridlines',
  },
]);

G('1e99b499.lo-3', 'Phase shift from a graph', [
  {
    t: 'find the phase shift of a sine graph', d: 2,
    spec: fgraph([-2, 10], [-4, 4], [{ expr: '3*sin(pi*(x - 1)/4)' }]),
    alt: 'A coordinate grid with both axes numbered in steps of one, with a sine-shaped wave drawn on it.',
    q: 'The graph shown has an equation of the form y = 3 sin(π(x − h)/4), where 0 ≤ h < 8. What is the value of h?',
    n: '1',
    calc: ['the drawn function compared with 3 sin(π(x − h)/4) for h = 0 … 7; the single h that matches', (c) => { const hs = [0, 1, 2, 3, 4, 5, 6, 7].filter((h) => sameCurve(c, 0, (x) => 3 * Math.sin((Math.PI * (x - h)) / 4))); if (hs.length !== 1) throw new Error(`${hs.length} values fit`); return hs[0]; }],
    h: ['The basic sine curve starts a cycle at the origin: on the midline, going up.', 'Find the first point at or to the right of the y-axis where this graph crosses its midline going up.'],
    s: 'An unshifted sine curve crosses its midline going up at x = 0. On this graph the matching point is at x = 1 (the curve then reaches its maximum 3 at x = 3). The curve is shifted 1 unit to the right, so h = 1.',
  },
  {
    t: 'find the phase shift of a cosine graph in radians', d: 2,
    spec: fgraph([-TWO_PI, TWO_PI], [-3, 3], [{ expr: '2*cos(x - pi/2)' }], { xStep: undefined, xTickUnit: 'pi', xTickDivisor: 2 }),
    alt: `${ALT_TRIG} The graph is a smooth wave.`,
    q: 'The graph shown has an equation of the form y = 2 cos(x − c). Which value of c gives this graph?',
    o: [['π/2', 'correct'], ['−π/2', 'shifts the cosine curve in the wrong direction'], ['π', 'uses half a period instead of a quarter'], ['0', 'does not notice that the maximum is no longer on the y-axis']],
    holds: ['the drawn function compared with 2 cos(x − c) for each option\'s c at 401 points', [Math.PI / 2, -Math.PI / 2, Math.PI, 0].map((k) => (c: Ctx) => sameCurve(c, 0, (x) => 2 * Math.cos(x - k)))],
    h: ['The basic cosine curve has a maximum on the y-axis.', 'Find the maximum of this graph nearest the y-axis and see how far, and which way, it has moved.'],
    s: 'y = 2 cos x has a maximum at x = 0. On this graph the nearest maximum is at x = π/2, so the cosine curve has been shifted π/2 to the right: c = π/2.',
  },
]);
// ═══ Ordinary objectives (not on the 105 list) that these kinds carry naturally ═

// ── Algebra 2 · Absolute Value Equations and Inequalities (number line) ─────
const ALT_NL = 'A number line with numbered tick marks at the whole numbers.';
const nline = (min: number, max: number, extra: P): Spec => S('number_line', { min, max, step: 1, ...extra });
const onLine = (c: Ctx, x: number): boolean => c.txt('nl_contains', { x }) === 'yes';
/** Does the set drawn on the number line equal { x : pred(x) }? Compared at every quarter unit of the line. */
const sameSetOnLine = (c: Ctx, pred: (x: number) => boolean): boolean => {
  const { min, max } = c.p as { min: number; max: number };
  for (let x = min; x <= max; x += 0.25) if (onLine(c, x) !== pred(x)) return false;
  return true;
};
G('aaee386b.lo-3', 'Compound inequalities and interval notation', [
  {
    t: 'write a graphed set in interval notation', d: 1,
    spec: nline(-6, 8, { intervals: [{ from: -3, to: 5, fromOpen: false, toOpen: true }] }),
    alt: `${ALT_NL} A thick segment is drawn between two of the ticks, with a filled circle at one end and an open circle at the other.`,
    q: 'The solution set of an absolute value equation or inequality is drawn on the number line shown. Which interval is it?',
    o: [['[−3, 5)', 'correct'], ['(−3, 5]', 'swaps the meanings of the filled and the open circle'], ['[−3, 5]', 'treats the open circle as included'], ['(−3, 5)', 'treats the filled circle as excluded']],
    ck: ['nl_interval_notation', {}],
    h: ['A filled circle means the endpoint belongs to the set; an open circle means it does not.', 'A square bracket goes with an included endpoint and a parenthesis with an excluded one.'],
    s: 'The segment runs from −3 to 5. The circle at −3 is filled, so −3 is included: a square bracket. The circle at 5 is open, so 5 is excluded: a parenthesis. The interval is [−3, 5).',
  },
  {
    t: 'write a graphed set as a compound inequality', d: 2,
    spec: nline(-6, 8, { intervals: [{ from: -2, to: 4, fromOpen: true, toOpen: false }] }),
    alt: `${ALT_NL} A thick segment is drawn between two of the ticks, with an open circle at one end and a filled circle at the other.`,
    q: 'Which compound inequality describes the set drawn on the number line shown?',
    o: [['−2 < x ≤ 4', 'correct'], ['−2 ≤ x < 4', 'swaps the meanings of the open and the filled circle'], ['−2 ≤ x ≤ 4', 'treats the open circle as included'], ['x < −2 or x ≥ 4', 'describes the part of the line that is not drawn thick']],
    holds: ['figure-core checker nl_contains at every quarter unit of the line, compared with each option\'s inequality', [
      (c) => sameSetOnLine(c, (x) => x > -2 && x <= 4), (c) => sameSetOnLine(c, (x) => x >= -2 && x < 4), (c) => sameSetOnLine(c, (x) => x >= -2 && x <= 4), (c) => sameSetOnLine(c, (x) => x < -2 || x >= 4),
    ]],
    h: ['Read the two endpoints of the thick segment from the ticks.', 'An open circle goes with < and a filled circle with ≤.'],
    s: 'The thick segment runs from −2 to 4. The open circle at −2 means −2 is not included (−2 < x), and the filled circle at 4 means 4 is included (x ≤ 4). Together: −2 < x ≤ 4.',
  },
]);
G('aaee386b.lo-4', 'Absolute value inequalities', [
  {
    t: 'match two rays to an absolute value inequality', d: 3,
    spec: nline(-6, 10, { intervals: [{ from: null, to: -2, toOpen: false }, { from: 6, to: null, fromOpen: false }] }),
    alt: `${ALT_NL} Two thick rays are drawn, one running to the left from a filled circle and one running to the right from another filled circle.`,
    q: 'The number line shown displays the solution set of which inequality?',
    o: [['|x − 2| ≥ 4', 'correct'], ['|x − 2| ≤ 4', 'gives the segment between the two endpoints instead of the two rays'], ['|x + 2| ≥ 4', 'uses the wrong sign for the centre'], ['|x − 4| ≥ 2', 'swaps the centre and the distance']],
    holds: ['figure-core checker nl_contains at every quarter unit of the line, compared with each option\'s inequality', [
      (c) => sameSetOnLine(c, (x) => Math.abs(x - 2) >= 4), (c) => sameSetOnLine(c, (x) => Math.abs(x - 2) <= 4), (c) => sameSetOnLine(c, (x) => Math.abs(x + 2) >= 4), (c) => sameSetOnLine(c, (x) => Math.abs(x - 4) >= 2),
    ]],
    h: ['Find the point halfway between the two filled circles: the solutions are measured from it.', 'The solutions lie at least a certain distance from that point: how far is each circle from it?'],
    s: 'The filled circles are at −2 and 6. Halfway between them is 2, and each circle is 4 units from 2. The shaded numbers are those at least 4 units away from 2, endpoints included: |x − 2| ≥ 4.',
  },
  {
    t: 'match a segment to an absolute value inequality', d: 2,
    spec: nline(-4, 10, { intervals: [{ from: -1, to: 7, fromOpen: true, toOpen: true }] }),
    alt: `${ALT_NL} A thick segment is drawn between two of the ticks, with an open circle at each end.`,
    q: 'Which inequality has the solution set that is drawn on the number line shown?',
    o: [['|x − 3| < 4', 'correct'], ['|x − 3| ≤ 4', 'ignores that both circles are open'], ['|x + 3| < 4', 'uses the wrong sign for the centre'], ['|x − 4| < 3', 'swaps the centre and the distance']],
    holds: ['figure-core checker nl_contains at every quarter unit of the line, compared with each option\'s inequality', [
      (c) => sameSetOnLine(c, (x) => Math.abs(x - 3) < 4), (c) => sameSetOnLine(c, (x) => Math.abs(x - 3) <= 4), (c) => sameSetOnLine(c, (x) => Math.abs(x + 3) < 4), (c) => sameSetOnLine(c, (x) => Math.abs(x - 4) < 3),
    ]],
    h: ['Find the midpoint of the thick segment and the distance from it to either end.', 'Open circles mean the ends are not included, so the inequality is strict.'],
    s: 'The segment runs from −1 to 7. Its midpoint is 3 and each end is 4 units from 3. The numbers shown are those less than 4 units from 3, with the ends excluded: |x − 3| < 4.',
  },
]);

// ── Precalculus · Polynomial and Rational Inequalities (solution sets) ──────
/** The solution set of `row op 0` from a sign chart: the intervals with the wanted sign, an end closed when equality is allowed and the chart shows 0 there. */
function signSolution(c: Ctx, k: number, want: '+' | '-', orEqual: boolean): string {
  const m = c.model(signChartModel);
  const row = m.rows[k];
  const parts: Array<[string, string]> = [];
  row.signs.forEach((sg, i) => {
    if (sg !== want) return;
    const left = i === 0 ? '(−∞' : `${orEqual && row.at[i - 1] === '0' ? '[' : '('}${minus(m.critical[i - 1].value)}`;
    const right = i === m.critical.length ? '∞)' : `${minus(m.critical[i].value)}${orEqual && row.at[i] === '0' ? ']' : ')'}`;
    parts.push([left, right]);
  });
  return parts.map(([l, r]) => `${l}, ${r}`).join(' ∪ ');
}
G('4ecdb7b8.lo-3', 'Solution regions', [
  {
    t: 'solution set with a zero and an undefined point', d: 3,
    spec: sc([-2, 0, 3], [{ label: 'f(x)', signs: ['+', '-', '+', '-'], at: ['0', 'und', '0'] }]),
    alt: `${ALT_SC} The row is labelled f(x) and there are three critical numbers; under each the chart shows either a zero or that the function is undefined.`,
    q: 'The sign chart shown is for a rational function f; "und" marks a number at which f is undefined. What is the solution set of the inequality f(x) ≥ 0?',
    o: [['(−∞, −2] ∪ (0, 3]', 'correct'], ['(−∞, −2] ∪ [0, 3]', 'includes the number at which f is undefined'], ['(−∞, −2) ∪ (0, 3)', 'leaves out the zeros although equality is allowed'], ['[−2, 0) ∪ [3, ∞)', 'takes the intervals where f is negative']],
    calc: ['from the kind\'s model: the intervals with a plus sign, each end closed exactly when the chart shows 0 at that critical number', (c) => signSolution(c, 0, '+', true)],
    h: ['Start with the intervals on which the chart shows a plus sign.', 'Then check each endpoint: a zero satisfies f(x) ≥ 0, but a number where f is undefined cannot be a solution.'],
    s: 'The chart shows a plus sign to the left of −2 and between 0 and 3. At −2 and at 3 the function is 0, which satisfies f(x) ≥ 0, so those ends are included. At 0 the function is undefined, so 0 is excluded. The solution set is (−∞, −2] ∪ (0, 3].',
  },
]);
G('4ecdb7b8.lo-4', 'Interval notation for solutions', [
  {
    t: 'write a graphed union of rays in interval notation', d: 2,
    spec: nline(-6, 7, { intervals: [{ from: null, to: -1, toOpen: true }, { from: 2, to: null, fromOpen: false }] }),
    alt: `${ALT_NL} Two thick rays are drawn: one runs to the left from an open circle and the other runs to the right from a filled circle.`,
    q: 'The solution set of a rational inequality is drawn on the number line shown. Which is this set in interval notation?',
    o: [['(−∞, −1) ∪ [2, ∞)', 'correct'], ['(−∞, −1] ∪ (2, ∞)', 'swaps the meanings of the open and the filled circle'], ['(−∞, −1) ∪ (2, ∞)', 'treats the filled circle as excluded'], ['(−1, 2]', 'describes the gap between the two rays']],
    ck: ['nl_interval_notation', {}],
    h: ['Each thick ray is one interval; a ray with an arrow runs on to infinity.', 'Use a parenthesis at an open circle and at infinity, and a square bracket at a filled circle.'],
    s: 'The left ray comes from −∞ and stops at an open circle at −1: (−∞, −1). The right ray starts at a filled circle at 2 and runs to ∞: [2, ∞). The set is (−∞, −1) ∪ [2, ∞).',
  },
]);

// ── Algebra 2 · Normal Distribution and Z-Scores ────────────────────────────
const ALT_ND = 'A bell-shaped normal curve over a horizontal axis with seven evenly spaced, labelled tick marks: the mean in the centre and one, two and three standard deviations on each side. Part of the area under the curve is shaded with hatch lines.';
const normal = (mean: number, sd: number, axis: string, shade: P[], extra: P = {}): Spec => S('distribution_curve', { mean, sd, axis, shade, ...extra });
G('c4bf15cd.lo-1', 'Normal curves and the empirical rule', [
  {
    t: 'percent of data within one standard deviation', d: 1,
    spec: normal(0, 1, 'sigma', [{ from: -1, to: 1 }]), alt: ALT_ND,
    q: 'A set of data is normally distributed, as in the curve shown. According to the empirical rule, about what percent of the data lies in the shaded region? Give a number without the % sign.',
    n: '68',
    ck: ['normal_shaded_area', { method: 'empirical', as: 'percent' }],
    h: ['Read where the shaded region begins and ends, in standard deviations from the mean.', 'The empirical rule gives the percent of data within 1, 2 and 3 standard deviations of the mean.'],
    s: 'The shaded region runs from one standard deviation below the mean (μ − σ) to one standard deviation above it (μ + σ). By the empirical rule, about 68 percent of normally distributed data lies within one standard deviation of the mean.',
  },
]);
G('c4bf15cd.lo-2', 'z-scores', [
  {
    t: 'z-score of the boundary of a shaded tail', d: 2,
    spec: normal(50, 4, 'x', [{ from: null, to: 42 }]), alt: ALT_ND,
    q: 'The normal curve shown models a set of measurements; the tick marks are one standard deviation apart. What is the z-score of the value at the right-hand edge of the shaded region?',
    n: '-2',
    ck: ['normal_bound', { shade: 0, end: 'to', as: 'z' }],
    h: ['Read the mean (under the peak), the standard deviation (the spacing of the ticks) and the value at the edge of the shading.', 'A z-score is (value − mean) ÷ standard deviation; it is negative for values below the mean.'],
    s: 'The mean is 50 and neighbouring ticks are 4 apart, so the standard deviation is 4. The shading ends at 42. z = (42 − 50) ÷ 4 = −2: the value is two standard deviations below the mean.',
  },
]);
G('c4bf15cd.lo-3', 'Applying the empirical rule', [
  {
    t: 'percent of data in an upper tail', d: 2,
    spec: normal(100, 15, 'x', [{ from: 115, to: null }]), alt: ALT_ND,
    q: 'Scores on a test are normally distributed, as in the curve shown; the tick marks are one standard deviation apart. According to the empirical rule, about what percent of the scores lie in the shaded region? Give a number without the % sign.',
    n: '16',
    ck: ['normal_shaded_area', { method: 'empirical', as: 'percent' }],
    h: ['Work out how many standard deviations above the mean the shading begins.', 'About 68 percent of the data lies within one standard deviation of the mean; the rest is split equally between the two tails.'],
    s: 'The mean is 100 and the ticks are 15 apart, so the shading starts at 115, one standard deviation above the mean. About 68 percent of scores lie within one standard deviation, leaving 32 percent for the two tails, or 16 percent in the upper tail.',
  },
  {
    t: 'percent of data between unequal bounds', d: 3,
    spec: normal(100, 15, 'x', [{ from: 70, to: 115 }]), alt: ALT_ND,
    q: 'Scores on a test are normally distributed, as in the curve shown; the tick marks are one standard deviation apart. According to the empirical rule (68–95–99.7), about what percent of the scores lie in the shaded region? Give a number without the % sign.',
    n: '81.5',
    ck: ['normal_shaded_area', { method: 'empirical', as: 'percent' }],
    h: ['The shading starts two standard deviations below the mean and ends one standard deviation above it.', 'Split the region at the mean: half of 95 percent lies between the mean and two standard deviations on one side, half of 68 percent between the mean and one standard deviation.'],
    s: 'The shading runs from 70 (two standard deviations below the mean of 100) to 115 (one above). From 70 to 100 is half of 95 percent, 47.5 percent; from 100 to 115 is half of 68 percent, 34 percent. Together: 47.5 + 34 = 81.5 percent.',
  },
]);
G('c4bf15cd.lo-4', 'Normal distribution in context', [
  {
    t: 'expected count in a shaded tail', d: 3,
    spec: normal(170, 10, 'x', [{ from: 190, to: null }], { xLabel: 'Height (cm)' }), alt: ALT_ND,
    q: 'The heights of the 2000 students at a school are normally distributed, as in the curve shown; the tick marks are one standard deviation apart. Using the empirical rule (68–95–99.7), about how many students have a height in the shaded region?',
    n: '50',
    calc: ['figure-core checker normal_shaded_area (empirical rule), times 2000 students', (c) => round(c.num('normal_shaded_area', { method: 'empirical' }) * 2000, 6)],
    h: ['Find how many standard deviations above the mean the shading begins.', 'About 95 percent of the data lies within two standard deviations of the mean; the remaining part is split equally between the two tails.'],
    s: 'The mean is 170 cm and the ticks are 10 cm apart, so the shading starts at 190 cm, two standard deviations above the mean. About 95 percent of heights lie within two standard deviations, leaving 5 percent in the two tails, 2.5 percent in the upper one. 2.5 percent of 2000 is 50 students.',
  },
]);

// ── Algebra 2 / Precalculus · unit circle values ────────────────────────────
const ALT_UC_T = 'A unit circle centred at the origin of an x-y coordinate system. A radius is drawn from the origin to a point on the circle, and an arc marks the angle, labelled θ, from the positive x-axis to that radius. The coordinates of the point are printed beside it.';
G('4ddfd4c0.lo-1', 'Coordinates on the unit circle', [
  {
    t: 'coordinates for a third-quadrant special angle', d: 2,
    spec: ucircle([{ degrees: 240, arc: true, name: 'P', coords: 'blank' }]),
    alt: `${ALT_UC} The size of the angle is printed in degrees; the coordinates of the point P are replaced by question marks.`,
    q: 'The unit circle shown marks an angle in standard position and the point P where its terminal side meets the circle. What are the coordinates of P?',
    o: [['(−1/2, −√3/2)', 'correct'], ['(−√3/2, −1/2)', 'swaps the cosine and sine values'], ['(1/2, −√3/2)', 'gives the x-coordinate the sign it has in Quadrant IV'], ['(−1/2, √3/2)', 'gives the y-coordinate the sign it has in Quadrant II']],
    ck: ['uc_coordinates', { angle: 0, want: 'pair' }],
    h: ['Find the reference angle: how far is the terminal side past the negative x-axis?', 'Then decide the sign of each coordinate from the quadrant.'],
    s: 'The marked angle is 240°, in Quadrant III, and 240° − 180° = 60° is its reference angle. A 60° reference angle gives the values 1/2 (for x) and √3/2 (for y), and in Quadrant III both coordinates are negative: P = (−1/2, −√3/2).',
  },
]);
G('4ddfd4c0.lo-2', 'Sine and cosine from the unit circle', [
  {
    t: 'read sine from the coordinates of a point', d: 1,
    spec: ucircle([{ degrees: 135, labelText: 'θ', arc: true, coords: 'show' }]), alt: ALT_UC_T,
    q: 'The unit circle shown gives the coordinates of the point where the terminal side of the angle θ meets the circle. What is sin θ?',
    o: [['√2/2', 'correct'], ['−√2/2', 'reads the x-coordinate, which is cos θ'], ['−1', 'divides the y-coordinate by the x-coordinate, which gives tan θ'], ['1/2', 'recalls the sine of a 30° reference angle']],
    ck: ['uc_trig_value', { angle: 0, fn: 'sin' }],
    h: ['On the unit circle, a point has coordinates (cos θ, sin θ).', 'Decide which of the two printed coordinates is the sine.'],
    s: 'On the unit circle the point on the terminal side of θ is (cos θ, sin θ). The printed point is (−√2/2, √2/2), so sin θ is the y-coordinate: √2/2.',
  },
  {
    t: 'cosine of a marked special angle', d: 2,
    spec: ucircle([{ degrees: 300, arc: true, coords: 'blank' }]),
    alt: `${ALT_UC} The size of the angle is printed in degrees; the coordinates of the point are replaced by question marks.`,
    q: 'What is the exact value of the cosine of the angle marked on the unit circle shown?',
    o: [['1/2', 'correct'], ['−1/2', 'gives the cosine a negative sign in Quadrant IV'], ['√3/2', 'uses the value for a 30° reference angle'], ['−√3/2', 'gives the sine of the angle']],
    ck: ['uc_trig_value', { angle: 0, fn: 'cos' }],
    h: ['Find the reference angle between the terminal side and the x-axis.', 'Cosine is the x-coordinate: is the point to the right or to the left of the y-axis?'],
    s: 'The marked angle is 300°, in Quadrant IV, with reference angle 360° − 300° = 60°. cos 60° = 1/2, and in Quadrant IV the x-coordinate is positive, so the cosine of the angle is 1/2.',
  },
]);
G('4ddfd4c0.lo-3', 'Tangent from sine and cosine', [
  {
    t: 'tangent from the coordinates of a point', d: 2,
    spec: ucircle([{ degrees: 120, labelText: 'θ', arc: true, coords: 'show' }]), alt: ALT_UC_T,
    q: 'The unit circle shown gives the coordinates of the point where the terminal side of the angle θ meets the circle. What is tan θ?',
    o: [['−√3', 'correct'], ['−√3/3', 'divides the x-coordinate by the y-coordinate'], ['√3', 'drops the negative sign'], ['−√3/4', 'multiplies the coordinates instead of dividing']],
    ck: ['uc_trig_value', { angle: 0, fn: 'tan' }],
    h: ['The printed coordinates are (cos θ, sin θ).', 'tan θ = sin θ ÷ cos θ: divide the y-coordinate by the x-coordinate.'],
    s: 'The printed point is (−1/2, √3/2), so cos θ = −1/2 and sin θ = √3/2. tan θ = (√3/2) ÷ (−1/2) = −√3.',
  },
]);
G('4ddfd4c0.lo-4', 'Reference angles', [
  {
    t: 'reference angle of a marked angle in degrees', d: 1,
    spec: ucircle([{ degrees: 210, arc: true }]),
    alt: `${ALT_UC} The size of the angle is printed in degrees.`,
    q: 'What is the reference angle, in degrees, of the angle marked on the unit circle shown?',
    n: '30',
    ck: ['uc_reference_angle', { angle: 0 }],
    h: ['The reference angle is the acute angle between the terminal side and the x-axis.', 'The terminal side is in Quadrant III: subtract 180° from the marked angle.'],
    s: 'The marked angle is 210°, and its terminal side lies in Quadrant III, just past the negative x-axis. The acute angle between the terminal side and the x-axis is 210° − 180° = 30°.',
  },
]);
G('f2322089.lo-3', 'Signs of trig values by quadrant', [
  {
    t: 'signs of sine and cosine from the quadrant of the terminal side', d: 1,
    spec: ucircle([{ degrees: 200, labelText: 'θ', arc: true }]),
    alt: `${ALT_UC} The angle is labelled θ.`,
    q: 'The angle θ is drawn in standard position on the unit circle shown. Which statement about sin θ and cos θ is correct?',
    o: [['sin θ < 0 and cos θ < 0', 'correct'], ['sin θ > 0 and cos θ < 0', 'places the terminal side in Quadrant II'], ['sin θ < 0 and cos θ > 0', 'places the terminal side in Quadrant IV'], ['sin θ > 0 and cos θ > 0', 'ignores the quadrant']],
    holds: ['figure-core checker uc_quadrant for the marked angle; the signs of sine (y) and cosine (x) in that quadrant', (['III', 'II', 'IV', 'I'] as const).map((qd) => (c: Ctx) => c.txt('uc_quadrant', { angle: 0 }) === qd)],
    h: ['Find the quadrant in which the terminal side of θ lies.', 'cos θ is the x-coordinate and sin θ is the y-coordinate of the point on the circle.'],
    s: 'The terminal side of θ lies in Quadrant III, to the left of the y-axis and below the x-axis. There both coordinates are negative, so cos θ < 0 and sin θ < 0.',
  },
]);
G('2fd4669e.lo-3', 'Trig values by reference angle', [
  {
    t: 'tangent of a marked angle in radians', d: 2,
    spec: ucircle([{ pi: [3, 4], arc: true }]),
    alt: `${ALT_UC} The size of the angle is printed in radians.`,
    q: 'What is the exact value of the tangent of the angle marked on the unit circle shown?',
    o: [['−1', 'correct'], ['1', 'uses the reference angle without the sign for Quadrant II'], ['−√2/2', 'gives the cosine of the angle'], ['√2/2', 'gives the sine of the angle']],
    ck: ['uc_trig_value', { angle: 0, fn: 'tan' }],
    h: ['Find the reference angle and the quadrant of the terminal side.', 'Tangent is sine divided by cosine: what are their signs in that quadrant?'],
    s: 'The marked angle is 3π/4, in Quadrant II, with reference angle π/4, and tan(π/4) = 1. In Quadrant II sine is positive and cosine is negative, so the tangent is negative: −1.',
  },
  {
    t: 'cosecant of a marked angle in radians', d: 3,
    spec: ucircle([{ pi: [7, 6], arc: true }]),
    alt: `${ALT_UC} The size of the angle is printed in radians.`,
    q: 'What is the exact value of the cosecant of the angle marked on the unit circle shown?',
    o: [['−2', 'correct'], ['2', 'uses the reference angle without the sign for Quadrant III'], ['−2√3/3', 'takes the reciprocal of the cosine, which gives the secant'], ['−1/2', 'gives the sine without taking the reciprocal']],
    ck: ['uc_trig_value', { angle: 0, fn: 'csc' }],
    h: ['Cosecant is the reciprocal of sine.', 'Find the sine from the reference angle and the quadrant first.'],
    s: 'The marked angle is 7π/6, in Quadrant III, with reference angle π/6. sin(π/6) = 1/2, and sine is negative in Quadrant III, so the sine is −1/2. The cosecant is its reciprocal: −2.',
  },
]);

// ── AP Calculus AB · First Derivative Test / Concavity (sign charts) ────────
G('5fec1ce2.lo-3', 'Sign charts for f′', [
  {
    t: 'classify a critical number where f′ does not change sign', d: 2,
    spec: sc([-1, 2, 5], [{ label: 'f′(x)', signs: ['+', '-', '-', '+'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f′(x) and there are three critical numbers.`,
    q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. What does f have at x = 2?',
    o: [['No local extremum', 'correct'], ['A local maximum', 'treats every zero of f′ where f stops increasing as a maximum'], ['A local minimum', 'treats every zero of f′ as a turning point'], ['A corner', 'takes f′ = 0 to mean that f′ does not exist']],
    holds: ['figure-core checker sc_sign on the intervals on both sides of x = 2 (and the value shown at 2, from the kind\'s model)', [
      (c) => c.txt('sc_sign', { row: 0, interval: 1 }) === c.txt('sc_sign', { row: 0, interval: 2 }),
      (c) => c.txt('sc_sign', { row: 0, interval: 1 }) === 'positive' && c.txt('sc_sign', { row: 0, interval: 2 }) === 'negative',
      (c) => c.txt('sc_sign', { row: 0, interval: 1 }) === 'negative' && c.txt('sc_sign', { row: 0, interval: 2 }) === 'positive',
      (c) => c.model(signChartModel).rows[0].at[1] === 'und',
    ]],
    h: ['Compare the sign of f′ just to the left of x = 2 with its sign just to the right.', 'The first derivative test needs a change of sign for a local maximum or minimum.'],
    s: 'The chart shows f′ negative on both sides of x = 2: f is decreasing before and after. Since f′ does not change sign there, the first derivative test gives no local extremum at x = 2.',
  },
]);
G('5fec1ce2.lo-4', 'First derivative test', [
  {
    t: 'locate the local minimum from the sign chart of f′', d: 2,
    spec: sc([-3, 1, 4], [{ label: 'f′(x)', signs: ['+', '-', '+', '+'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f′(x) and there are three critical numbers.`,
    q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. At what value of x does f have a local minimum?',
    n: '1',
    ck: ['sc_local_extrema', { row: 0, which: 'min', want: 'only' }],
    h: ['A local minimum occurs where f changes from decreasing to increasing.', 'Look for the critical number where the sign of f′ changes from minus to plus.'],
    s: 'At x = 1 the chart shows f′ changing from negative to positive, so f falls and then rises: a local minimum at x = 1. At x = −3 the change is from plus to minus (a local maximum), and at x = 4 the sign does not change.',
  },
  {
    t: 'count the local extrema from the sign chart of f′', d: 2,
    spec: sc([-2, 0, 3, 6], [{ label: 'f′(x)', signs: ['-', '+', '+', '-', '+'], at: ['0', '0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f′(x) and there are four critical numbers.`,
    q: 'The sign chart shown gives the sign of f′(x) for a function f that is differentiable for all x. How many local extrema (maxima and minima together) does f have?',
    n: '3',
    ck: ['sc_sign_change', { row: 0, want: 'count' }],
    h: ['A local extremum occurs only at a critical number where f′ changes sign.', 'Go through the critical numbers one by one and compare the signs on the two sides.'],
    s: 'f′ changes from − to + at x = −2 (a local minimum), keeps the sign + at x = 0 (no extremum), changes from + to − at x = 3 (a local maximum) and from − to + at x = 6 (a local minimum). That makes 3 local extrema.',
  },
]);
G('d1d61003.lo-2', 'Concave up from the sign of f″', [
  {
    t: 'interval of upward concavity from the sign chart of f″', d: 1,
    spec: sc([-1, 4], [{ label: 'f″(x)', signs: ['-', '+', '-'], at: ['0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f″(x) and there are two critical numbers.`,
    q: 'The sign chart shown gives the sign of f″(x) for a function f. On which interval is the graph of f concave up?',
    o: [['(−1, 4)', 'correct'], ['(−∞, −1) ∪ (4, ∞)', 'takes the intervals where f″ is negative'], ['(−∞, −1)', 'reads the first interval of the chart'], ['(4, ∞)', 'reads the last interval of the chart']],
    ck: ['sc_intervals', { row: 0, sign: 'positive' }],
    h: ['The graph of f is concave up where f″(x) > 0.', 'Find the interval of the chart marked with a plus sign.'],
    s: 'The graph of f is concave up where f″ is positive. The chart shows a plus sign only between −1 and 4, so f is concave up on (−1, 4).',
  },
]);
G('d1d61003.lo-4', 'Inflection points', [
  {
    t: 'inflection points from the sign chart of f″', d: 2,
    spec: sc([-2, 0, 3], [{ label: 'f″(x)', signs: ['+', '-', '-', '+'], at: ['0', '0', '0'] }]),
    alt: `${ALT_SC} The row is labelled f″(x) and there are three critical numbers.`,
    q: 'The sign chart shown gives the sign of f″(x) for a function f that is twice differentiable for all x. At which values of x does the graph of f have an inflection point?',
    o: [['x = −2 and x = 3', 'correct'], ['x = −2, x = 0 and x = 3', 'takes every zero of f″ as an inflection point'], ['x = 0 only', 'picks the zero of f″ where the sign does not change'], ['x = −2 only', 'stops at the first change of sign']],
    ck: ['sc_sign_change', { row: 0, want: 'all' }],
    h: ['An inflection point is where the concavity changes, that is, where f″ changes sign.', 'A zero of f″ with the same sign on both sides is not an inflection point.'],
    s: 'f″ changes from + to − at x = −2 and from − to + at x = 3, so the concavity changes at both: inflection points at x = −2 and x = 3. At x = 0, f″ is zero but negative on both sides, so the concavity does not change there.',
  },
]);

// ── Algebra 2 / Precalculus · complex numbers and polar coordinates ─────────
G('3e0e7ddf.lo-2', 'Adding complex numbers', [
  {
    t: 'add two plotted complex numbers', d: 2,
    spec: cplane([{ re: 2, im: 3, label: 'z' }, { re: -5, im: 1, label: 'w' }]),
    alt: `${ALT_CP} Two points, labelled z and w, are plotted.`,
    q: 'The complex numbers z and w are plotted in the complex plane shown. What is z + w?',
    o: [[complexText(-3, 4), 'correct'], [complexText(7, 2), 'subtracts w from z'], [complexText(-3, 2), 'subtracts the imaginary parts'], [complexText(3, 4), 'ignores the sign of the real part of w']],
    ck: ['pc_sum', { points: [0, 1] }],
    h: ['Read each number from the grid: real part across, imaginary part up.', 'Add the real parts together and the imaginary parts together.'],
    s: 'From the grid, z = 2 + 3i and w = −5 + i. Adding real parts gives 2 + (−5) = −3 and adding imaginary parts gives 3 + 1 = 4, so z + w = −3 + 4i.',
  },
]);
G('3e0e7ddf.lo-3', 'Multiplying complex numbers', [
  {
    t: 'multiply two plotted complex numbers', d: 3,
    spec: cplane([{ re: 2, im: 1, label: 'z' }, { re: 1, im: 3, label: 'w' }]),
    alt: `${ALT_CP} Two points, labelled z and w, are plotted.`,
    q: 'The complex numbers z and w are plotted in the complex plane shown. What is the product z·w?',
    o: [[complexText(-1, 7), 'correct'], [complexText(2, 3), 'multiplies the real parts and the imaginary parts separately'], [complexText(5, 7), 'takes i² as 1 instead of −1'], [complexText(3, 4), 'adds the numbers instead of multiplying']],
    ck: ['pc_product', { points: [0, 1] }],
    h: ['Read z and w from the grid, then multiply them like two binomials.', 'Replace i² by −1 before collecting terms.'],
    s: 'From the grid, z = 2 + i and w = 1 + 3i. (2 + i)(1 + 3i) = 2 + 6i + i + 3i² = 2 + 7i − 3 = −1 + 7i.',
  },
]);
G('3e0e7ddf.lo-1', 'Structure of complex numbers', [
  {
    t: 'identify the complex conjugate among plotted points', d: 2,
    spec: cplane([{ re: 3, im: 2, label: 'z' }, { re: 3, im: -2, label: 'P' }, { re: -3, im: 2, label: 'Q' }, { re: -3, im: -2, label: 'R' }, { re: 2, im: 3, label: 'S' }]),
    alt: `${ALT_CP} Five points are plotted: one labelled z and four labelled with other letters.`,
    q: 'The complex number z and four other points are plotted in the complex plane shown. Which point represents the complex conjugate of z?',
    o: [['P', 'correct'], ['Q', 'changes the sign of the real part instead of the imaginary part'], ['R', 'changes the signs of both parts, which gives −z'], ['S', 'swaps the real and imaginary parts']],
    holds: ['coordinates of z and of each labelled point from the kind\'s model: the conjugate has the same real part and the opposite imaginary part', ['P', 'Q', 'R', 'S'].map((l) => (c: Ctx) => { const pts = pcM(c).points; const z = pts.find((x) => x.label === 'z')!; const q = pts.find((x) => x.label === l)!; return near(q.re, z.re) && near(q.im, -z.im); })],
    h: ['The conjugate of a + bi is a − bi.', 'On the complex plane, changing the sign of the imaginary part reflects the point across the real axis.'],
    s: 'From the grid, z = 3 + 2i. Its conjugate is 3 − 2i: the same real part and the opposite imaginary part, which is the mirror image of z in the real axis. That point is P.',
  },
]);
G('2515225c.lo-2', 'Rectangular and polar form', [
  {
    t: 'argument of a plotted complex number', d: 2,
    spec: cplane([{ re: -2, im: 2, label: 'z', showModulus: true, showArgument: true, argumentLabel: 'θ' }], { range: 4 }),
    alt: `${ALT_CP} One point, labelled z, is plotted and joined to the origin by a line segment; an arc labelled θ marks the angle from the positive real axis to the segment.`,
    q: 'The complex number z is plotted in the complex plane shown. What is its argument θ, in degrees, with 0° ≤ θ < 360°?',
    n: '135',
    ck: ['pc_argument', { point: 0 }],
    h: ['Read the real and imaginary parts of z from the grid: they form a right triangle with the segment from the origin.', 'Find the reference angle from the two legs, then adjust for the quadrant.'],
    s: 'From the grid, z = −2 + 2i. The legs of the triangle are both 2, so the reference angle is 45°. The point is in Quadrant II, so θ = 180° − 45° = 135°.',
  },
]);
const ALT_PG = 'A polar grid: concentric circles numbered by their radius and rays labelled with their angles in degrees. One point, labelled with a letter, is plotted where a circle meets a ray.';
G('2515225c.lo-3', 'Trigonometric form', [
  {
    t: 'trigonometric form of a number plotted on a polar grid', d: 2,
    spec: polar({ rMax: 5, rStep: 1, angleStep: 30, points: [{ r: 4, theta: 150, label: 'z' }] }),
    alt: ALT_PG,
    q: 'The complex number z is plotted on the polar grid shown. Which is z in trigonometric form?',
    o: [['4(cos 150° + i sin 150°)', 'correct'], ['4(cos 30° + i sin 30°)', 'uses the reference angle instead of the argument'], ['4(cos 210° + i sin 210°)', 'measures the angle in the wrong direction'], ['5(cos 150° + i sin 150°)', 'reads the outermost circle as the modulus']],
    holds: ['modulus and argument of the point from the kind\'s model (figure-core checkers pc_modulus and pc_argument), compared with each option', ([[4, 150], [4, 30], [4, 210], [5, 150]] as Array<[number, number]>).map(([r, t]) => (c: Ctx) => near(c.num('pc_modulus', { point: 0 }), r) && near(c.num('pc_argument', { point: 0 }), t))],
    h: ['The modulus r is the number of the circle on which the point lies.', 'The argument is the angle of the ray through the point, measured from the polar axis.'],
    s: 'The point lies on the circle numbered 4, so r = 4, and on the ray labelled 150°, so θ = 150°. In trigonometric form, z = 4(cos 150° + i sin 150°).',
  },
]);
G('ea46bc2b.lo-3', 'Polar to rectangular coordinates', [
  {
    t: 'rectangular coordinates of a point on a polar grid', d: 2,
    spec: polar({ rMax: 5, rStep: 1, angleStep: 30, points: [{ r: 4, theta: 60, label: 'P' }] }),
    alt: ALT_PG,
    q: 'The point P is plotted on the polar grid shown. What are the rectangular coordinates (x, y) of P?',
    o: [['(2, 2√3)', 'correct'], ['(2√3, 2)', 'swaps cosine and sine'], ['(4, 60)', 'writes the polar coordinates unchanged'], ['(−2, 2√3)', 'gives the x-coordinate a negative sign']],
    holds: ['r and θ of the point (figure-core checkers pc_modulus and pc_argument); x = r cos θ and y = r sin θ compared with each option', ([[2, 2 * Math.sqrt(3)], [2 * Math.sqrt(3), 2], [4, 60], [-2, 2 * Math.sqrt(3)]] as Array<[number, number]>).map(([x, y]) => (c: Ctx) => { const r = c.num('pc_modulus', { point: 0 }); const t = (c.num('pc_argument', { point: 0 }) * Math.PI) / 180; return near(r * Math.cos(t), x, 1e-9) && near(r * Math.sin(t), y, 1e-9); })],
    h: ['Read r from the numbered circle and θ from the labelled ray through P.', 'Then use x = r cos θ and y = r sin θ.'],
    s: 'P lies on the circle numbered 4 and on the 60° ray, so r = 4 and θ = 60°. x = 4 cos 60° = 4 · 1/2 = 2 and y = 4 sin 60° = 4 · √3/2 = 2√3. The point is (2, 2√3).',
  },
]);

// ── AP Calculus AB · Area Between Curves ────────────────────────────────────
const AREA_SETUP: IntOpt[] = [
  ['∫₋₁² (x + 2 − x²) dx', 'correct', 1, 'x + 2 - x^2', -1, 2],
  ['∫₋₁² (x² − x − 2) dx', 'subtracts the upper curve from the lower one', 1, 'x^2 - x - 2', -1, 2],
  ['∫₋₁² (x + 2 + x²) dx', 'adds the two functions instead of subtracting', 1, 'x + 2 + x^2', -1, 2],
  ['∫₁⁴ (x + 2 − x²) dx', 'uses the y-coordinates of the intersection points as the limits', 1, 'x + 2 - x^2', 1, 4],
];
G('d3878367.lo-3', 'Area between curves (dx)', [
  {
    t: 'area between two lines from the graph', d: 2,
    spec: between('x/2 + 3', 'x - 1', 0, 4, [-1, 6], [-2, 6]), alt: ALT_BETWEEN,
    q: 'What is the area of the shaded region between the two lines in the graph shown, in square units?',
    n: '12',
    ck: ['region_area', {}],
    h: ['Read the height of the region (upper line minus lower line) at its left bound and at its right bound.', 'The region is a trapezoid: or integrate the difference of the two lines between the bounds.'],
    s: 'At x = 0 the lines are at 3 and −1, so the region is 4 units tall; at x = 4 they are at 5 and 3, so it is 2 units tall. The region is a trapezoid of width 4: area = ½(4 + 2) · 4 = 12 square units.',
  },
  {
    t: 'set up the integral for the area between a line and a parabola', d: 3,
    spec: S('shaded_region', { xRange: [-3, 4], yRange: [-1, 6], xStep: 1, yStep: 1, region: { type: 'between_curves', upper: { expr: 'x + 2', label: 'y = x + 2' }, lower: { expr: 'x^2', label: 'y = x²' }, from: -1, to: 2 } }),
    alt: 'A coordinate grid with both axes numbered in steps of one. A straight line and a parabola are drawn and named in a legend by their equations; the region enclosed between them is shaded with hatch lines.',
    q: 'The shaded region in the graph shown is enclosed by the line y = x + 2 and the parabola y = x². Which integral gives the area of the region?',
    o: intOptions(AREA_SETUP),
    holds: ['each option evaluated numerically (Simpson) and compared with ∫(upper − lower) dx over the region of the kind\'s model', intHolds(AREA_SETUP, (c) => { const b = bounds(c); return integrate((x) => b.up(x) - b.lo(x), b.a, b.b); })],
    h: ['Read the x-coordinates of the two points where the curves cross: they are the limits of integration.', 'Between those points, decide which curve is on top; the integrand is top minus bottom.'],
    s: 'The curves cross at x = −1 and x = 2, which are the limits. Between them the line y = x + 2 lies above the parabola y = x², so the area is ∫₋₁² (x + 2 − x²) dx.',
  },
]);

// ── Physics · adding vectors, relative velocity ─────────────────────────────
G('3ef97c55.lo-2', 'Summing components', [
  {
    t: 'x-component of the sum of three vectors', d: 2,
    spec: vecs([-1, 6], [-1, 6], [{ components: [3, 2], label: 'A' }, { components: [-1, 3], label: 'B' }, { components: [3, -3], label: 'C' }], { tipToTail: true }),
    alt: `${ALT_VECS} Three arrows are drawn tip to tail, starting at the origin.`,
    q: 'Displacement vectors A, B and C are drawn tip to tail on the grid shown, on which each square is 1 m wide. What is the x-component of the resultant A + B + C, in metres?',
    n: '5',
    ck: ['vec_resultant', { want: 'x' }],
    h: ['Read the x-component of each vector separately: squares to the right are positive, to the left negative.', 'Add the three x-components.'],
    s: 'From the grid, the x-components are Aₓ = 3, Bₓ = −1 and Cₓ = 3. Their sum is 3 − 1 + 3 = 5 m: the chain of arrows ends 5 squares to the right of where it started.',
  },
]);
G('3ef97c55.lo-3', 'Magnitude of a resultant', [
  {
    t: 'magnitude of the resultant of two vectors on a grid', d: 2,
    spec: vecs([-1, 13], [-1, 6], [{ components: [8, 1], label: 'A' }, { components: [4, 4], label: 'B' }], { tipToTail: true }),
    alt: `${ALT_VECS} Two arrows are drawn tip to tail, starting at the origin.`,
    q: 'Displacement vectors A and B are drawn tip to tail on the grid shown, on which each square is 1 km wide. What is the magnitude of the resultant A + B, in kilometres?',
    n: '13',
    ck: ['vec_resultant', { want: 'magnitude' }],
    h: ['Add the x-components and the y-components of A and B to get the components of the resultant.', 'Then apply the Pythagorean theorem to the two sums.'],
    s: 'From the grid, A = (8, 1) and B = (4, 4), so the resultant has components (12, 5). Its magnitude is √(12² + 5²) = √169 = 13 km.',
  },
]);
G('3ef97c55.lo-4', 'Direction of a resultant', [
  {
    t: 'direction angle of the resultant of two vectors on a grid', d: 3,
    spec: vecs([-5, 3], [-1, 5], [{ components: [1, 3], label: 'A' }, { components: [-4, 0], label: 'B' }], { tipToTail: true }),
    alt: `${ALT_VECS} Two arrows are drawn tip to tail, starting at the origin.`,
    q: 'Vectors A and B are drawn tip to tail on the grid shown. What is the direction of the resultant A + B, as an angle in degrees measured counter-clockwise from the positive x-axis?',
    n: '135',
    ck: ['vec_resultant', { want: 'direction' }],
    h: ['Add the components of A and B to get the components of the resultant.', 'Use the inverse tangent of (y-component ÷ x-component), then check the quadrant from the signs.'],
    s: 'From the grid, A = (1, 3) and B = (−4, 0), so the resultant is (−3, 3). tan⁻¹(3 ÷ 3) = 45° is the reference angle; the resultant points left and up (Quadrant II), so its direction is 180° − 45° = 135°.',
  },
]);
G('8237632d.lo-2', 'Adding velocity vectors', [
  {
    t: 'speed relative to the bank from two velocity vectors', d: 2,
    spec: vecs([-1, 5], [-1, 6], [{ components: [0, 4], label: 'boat' }, { components: [3, 0], label: 'current' }], { tipToTail: true, xLabel: 'east (m/s)', yLabel: 'north (m/s)' }),
    alt: 'A coordinate grid with an east axis and a north axis, both in metres per second and numbered in steps of one. Two arrows, labelled boat and current, are drawn tip to tail from the origin.',
    q: 'The arrows on the grid shown are the velocity of a boat relative to the water and the velocity of the river current, drawn tip to tail. What is the speed of the boat relative to the riverbank, in m/s?',
    n: '5',
    ck: ['vec_resultant', { want: 'magnitude' }],
    h: ['The velocity relative to the bank is the vector sum of the two velocities shown.', 'The two arrows are perpendicular: read their lengths and use the Pythagorean theorem.'],
    s: 'The boat\'s velocity relative to the water is 4 m/s north and the current is 3 m/s east. The velocity relative to the bank is their sum, the arrow from the start of the first to the end of the second: √(3² + 4²) = 5 m/s.',
  },
]);

// ── Physics · net force (free-body diagrams) ────────────────────────────────
G('ef1b68d3.lo-4', 'Net force from a free-body diagram', [
  {
    t: 'net force from four forces along two axes', d: 2,
    spec: fbd([F('N', 'up', 60), F('W', 'down', 60), F('P', 'right', 45), F('f', 'left', 15)], { surface: true, lengths: 'equal' }),
    alt: `${ALT_FBD} A box on a level surface has four arrows: up, down, left and right, each with its size printed in newtons.`,
    q: 'The free-body diagram shows the four forces on a crate. What is the magnitude of the net force on the crate, in newtons?',
    n: '30',
    ck: ['fbd2_net_force', { axis: 'magnitude' }],
    h: ['Combine the vertical forces and the horizontal forces separately.', 'Forces in opposite directions subtract.'],
    s: 'Vertically, 60 N up and 60 N down cancel. Horizontally, 45 N to the right and 15 N to the left leave 45 − 15 = 30 N to the right. The net force has magnitude 30 N.',
  },
  {
    t: 'net force from two perpendicular forces', d: 3,
    spec: fbd([F('F₁', 'right', 40), F('F₂', 'up', 30)], { object: { shape: 'dot' } }),
    alt: `${ALT_FBD} A dot has two arrows at right angles, one to the right and one upward, each with its size printed in newtons.`,
    q: 'The diagram shows the only two horizontal forces on a puck sliding on frictionless ice, seen from above. What is the magnitude of the net force on the puck, in newtons?',
    n: '50',
    ck: ['fbd2_net_force', { axis: 'magnitude' }],
    h: ['The two forces are perpendicular, so they cannot simply be added or subtracted.', 'They form the legs of a right triangle whose hypotenuse is the net force.'],
    s: 'The diagram shows 40 N along one axis and 30 N along the perpendicular axis. The net force is the hypotenuse of the right triangle they form: √(40² + 30²) = √2500 = 50 N.',
  },
]);
G('111ba11a.lo-2', 'Components of the weight on an incline', [
  {
    t: 'component of the weight parallel to the incline', d: 2,
    spec: fbd([F('N', 'normal'), F('W', 'down', 40)], { incline: { angle: 30 }, lengths: 'equal' }),
    alt: `${ALT_FBD} A block on an incline has an arrow N perpendicular to the slope and an arrow W, with its size printed in newtons, pointing straight down. The angle of the incline is marked in degrees.`,
    q: 'The free-body diagram shows a block on a frictionless incline. What is the size of the component of the weight parallel to the incline, in newtons?',
    n: '20',
    calc: ['figure-core checker fbd2_net_force along the incline (only the weight has a component along it); its size', (c) => Math.abs(c.num('fbd2_net_force', { axis: 'along' }))],
    h: ['Read the weight and the angle of the incline from the diagram.', 'The component of the weight parallel to the incline is W sin θ.'],
    s: 'The diagram gives W = 40 N and an incline angle of 30°. The component of the weight parallel to the incline is W sin θ = 40 · sin 30° = 40 · 0.5 = 20 N.',
  },
]);
G('111ba11a.lo-3', 'Net force on an incline', [
  {
    t: 'net force along the incline with friction', d: 3,
    spec: fbd([F('N', 'normal'), F('f', 'up-slope', 10), F('W', 'down', 50)], { incline: { angle: 30 }, lengths: 'equal' }),
    alt: `${ALT_FBD} A block on an incline has three arrows: N perpendicular to the slope, f along the slope and W straight down; f and W have their sizes printed in newtons. The angle of the incline is marked in degrees.`,
    q: 'The free-body diagram shows a block sliding down a rough incline. Taking up the slope as the positive direction, what is the net force on the block along the incline, in newtons?',
    n: '-15',
    ck: ['fbd2_net_force', { axis: 'along' }],
    h: ['Find the component of the weight along the incline, W sin θ; it points down the slope.', 'Friction points up the slope: add the two with their signs.'],
    s: 'Along the incline, the weight contributes W sin θ = 50 · sin 30° = 25 N down the slope (−25 N), and friction contributes 10 N up the slope (+10 N). The net force along the incline is 10 − 25 = −15 N, that is, 15 N down the slope.',
  },
]);
G('7c124ba6.lo-4', 'Net force in vertical motion', [
  {
    t: 'net force on a person in an elevator', d: 1,
    spec: fbd([F('N', 'up', 700), F('W', 'down', 600)], { object: { shape: 'box', label: 'person' } }),
    alt: `${ALT_FBD} A box labelled person has one arrow pointing straight up and one pointing straight down, each with its size printed in newtons.`,
    q: 'The free-body diagram shows the forces on a person standing on a scale in an elevator. Taking up as the positive direction, what is the net force on the person, in newtons?',
    n: '100',
    ck: ['fbd2_net_force', { axis: 'y' }],
    h: ['Only two forces act, along the same vertical line.', 'Subtract the downward force from the upward force.'],
    s: 'The diagram shows a normal force of 700 N upward and a weight of 600 N downward. The net force is 700 − 600 = 100 N, upward, so the person is accelerating upward.',
  },
]);

// ── AP Biology · Mendelian Genetics Prediction (further objectives) ─────────
G('e7dee353.lo-2', 'Genotype and phenotype', [
  {
    t: 'count the genotypes and phenotypes in a square', d: 2,
    spec: pun(['T', 't'], ['T', 't']),
    alt: ALT_PUN_2,
    q: 'The Punnett square shown is for a cross between two pea plants. The allele T (tall) is completely dominant to t (short). How many different genotypes and how many different phenotypes appear among the offspring in the square?',
    o: [['3 genotypes and 2 phenotypes', 'correct'], ['2 genotypes and 3 phenotypes', 'swaps genotype and phenotype'], ['4 genotypes and 2 phenotypes', 'counts the two heterozygous cells as different genotypes'], ['3 genotypes and 3 phenotypes', 'gives the heterozygote its own phenotype']],
    holds: ['cells of the square from the kind\'s model: distinct genotypes, and distinct phenotypes under complete dominance (a cell with a capital letter shows the dominant trait)', ([[3, 2], [2, 3], [4, 2], [3, 3]] as Array<[number, number]>).map(([g, ph]) => (c: Ctx) => new Set(cellsOf(c)).size === g && new Set(cellsOf(c).map((x) => /[A-Z]/.test(x))).size === ph)],
    h: ['A genotype is the pair of alleles; list the different pairs that occur in the four cells.', 'A phenotype is the trait that shows: with complete dominance, one copy of T is enough for the dominant trait.'],
    s: 'The four cells read TT, Tt, Tt and tt: three different genotypes. TT and Tt plants are both tall, and tt plants are short, so there are two phenotypes. The answer is 3 genotypes and 2 phenotypes.',
  },
]);
G('e7dee353.lo-6', 'Independent assortment in dihybrid crosses', [
  {
    t: 'count the cells dominant for both traits', d: 2,
    spec: pun(['AB', 'Ab', 'aB', 'ab'], ['AB', 'Ab', 'aB', 'ab']),
    alt: `${ALT_PUN_4} The square has four rows and four columns.`,
    q: 'The Punnett square shown is for a cross involving two genes that assort independently; A is completely dominant to a, and B is completely dominant to b. How many of the 16 cells show the dominant phenotype for both traits?',
    n: '9',
    calc: ['cells of the square (kind\'s model) that contain at least one A and at least one B', (c) => cellsOf(c).filter((g) => g.includes('A') && g.includes('B')).length],
    h: ['A cell shows a dominant trait when its genotype has at least one capital-letter allele for that gene.', 'Count the cells that have at least one A and also at least one B.'],
    s: 'A cell shows both dominant traits when its genotype contains at least one A and at least one B. Counting row by row gives 4, 2, 2 and 1 such cells: 9 of the 16 cells, the 9 of the 9:3:3:1 ratio.',
  },
]);
// ══ ITEMS-END

// ── objectives the twelve kinds (and the older ones) cannot carry ───────────
// loId (short form) → the kind of figure that is missing.
const NEEDS: Record<string, { kind: string; note: string }> = {
  '252560d4.lo-2': { kind: 'gel / amplification plot', note: 'PCR results are read from gel lanes (band present / absent) or a qPCR amplification plot' },
  '252560d4.lo-4': { kind: 'gel / amplification plot', note: 'bands in lanes against a size ladder' },
  '252560d4.lo-7': { kind: 'gel / amplification plot', note: 'a gel (and a sequence read-out) to combine' },
  'f9ff0f1c.lo-5': { kind: 'map', note: 'species ranges on a map of islands / continents' },
  'c1c96ad6.lo-1': { kind: 'labelled biological diagram', note: 'a membrane cross-section with lettered parts' },
  '4dbe1414.lo-1': { kind: 'labelled biological diagram', note: 'a cell with lettered organelles' },
  '42e27041.lo-1': { kind: 'phylogenetic tree', note: 'a tree / cladogram with labelled tips and nodes' },
  '42e27041.lo-3': { kind: 'phylogenetic tree', note: 'a tree / cladogram with labelled tips and nodes' },
  '42e27041.lo-4': { kind: 'phylogenetic tree', note: 'a tree / cladogram with labelled tips and nodes' },
  '846750a0.lo-3': { kind: 'geometric figure', note: 'a ladder against a wall / a cone with labelled lengths' },
  '846750a0.lo-4': { kind: 'geometric figure', note: 'a lamp post, a person and a shadow (similar triangles)' },
  '869a59a5.lo-1': { kind: 'geometric figure', note: 'a right triangle with a marked angle and lettered sides' },
  '87ef2ba6.lo-1': { kind: 'molecular structure', note: 'Lewis structures with bonds and lone pairs' },
  '87ef2ba6.lo-3': { kind: 'molecular structure', note: 'candidate Lewis structures to compare by formal charge' },
  '87ef2ba6.lo-4': { kind: 'molecular structure', note: 'resonance structures' },
  '4354050b.lo-1': { kind: 'molecular structure', note: 'Lewis structures with bonds and lone pairs' },
  'f5cf533c.lo-2': { kind: 'spectrum', note: 'a photoelectron spectrum: peaks on a binding-energy axis that runs from high to low' },
  'f5cf533c.lo-3': { kind: 'spectrum', note: 'a photoelectron spectrum with peak heights in the ratio of the electron counts' },
  'f5cf533c.lo-5': { kind: 'spectrum', note: 'a complete photoelectron spectrum' },
  '8f54b2e2.lo-2': { kind: 'circuit', note: 'a combination circuit with labelled resistors' },
  'ae0f8dbd.lo-1': { kind: 'circuit', note: 'series and parallel circuits to tell apart' },
  '1503a287.lo-1': { kind: 'circuit', note: 'a series circuit with labelled components' },
  '8d83c172.lo-3': { kind: 'field lines / charge diagram', note: 'point charges with a marked test point and field arrows' },
  '8d83c172.lo-5': { kind: 'field lines / charge diagram', note: 'point charges on a grid with a marked test point' },
  '73571e58.lo-1': { kind: 'field lines / charge diagram', note: 'field lines around a bar magnet' },
  '73571e58.lo-2': { kind: 'field lines / charge diagram', note: 'field lines around a bar magnet, with compass positions' },
  'bc757519.lo-3': { kind: 'field lines / charge diagram', note: 'a charge moving through a field drawn with into-page / out-of-page symbols' },
  '183b6442.lo-1': { kind: 'ray diagram', note: 'principal rays through a lens / off a mirror' },
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

// ── objectives: the lesson packs and the 105 list ───────────────────────────

interface Objective { loId: string; subject: string; skill: string; description: string }
function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith('.json'))) {
    const pack = JSON.parse(fs.readFileSync(path.join(PACKS, f), 'utf8')) as { subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string }> };
    for (const o of pack.objectives) out.set(o.objectiveLoId, { loId: o.objectiveLoId, subject: pack.subject, skill: pack.skill, description: o.description });
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
  const list105 = JSON.parse(fs.readFileSync(OBJECTIVES_105, 'utf8')) as Array<{ subject: string; title: string; objectiveLoId: string; description: string; why: string }>;
  const listIds = new Set(list105.map((o) => o.objectiveLoId));
  const rows60 = JSON.parse(fs.readFileSync(ROWS_60, 'utf8')) as Array<{ id: string; loId: string }>;
  const covered = new Set(rows60.map((r) => r.loId));

  const problems: string[] = [];
  const notes: string[] = [];
  const piTwins: string[] = [];
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
    a.list = listIds.has(obj.loId);
    if (covered.has(obj.loId)) problems.push(`${tag}: the objective is already covered by the 60 rows`);
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
        const lens = choices.map((x) => x.length);
        if (Math.max(...lens) > Math.min(...lens) * 2 + 6) notes.push(`${tag}: option lengths ${lens.join('/')}`);
        if (lens.indexOf(Math.max(...lens)) === 'ABCD'.indexOf(answer) && Math.max(...lens) > [...lens].sort((x, y) => y - x)[1] * 1.35 + 3) bad(`the correct option is the longest by far (${lens.join('/')})`);
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
        proofResult = `options true of the figure, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — truth of the options as written: ${JSON.stringify(truth)}`);
      }
      if (!a.ck && c.used.length) proofKind = 'checker+code';

      // ── the job's rule checks ────────────────────────────────────────────
      const figureItem = {
        objectiveLoId: obj.loId, responseFormat, problemText: a.q, answer, choices, hints: a.h, solutionText: a.s, difficulty: a.d,
        covers: obj.description, taskType: a.t, distractorRationales: rationales, figureSpec: a.spec, alt: a.alt, derivation,
      } as unknown as FigureItem;
      // The job's rule checks read the axes from xStep and do not know `xTickUnit: 'pi'`; for
      // such a figure they run on a twin spec that gives the same ticks as a numeric step.
      if (a.spec.params.xTickUnit === 'pi') {
        const { xTickUnit: _u, xTickDivisor: div, ...rest } = a.spec.params;
        (figureItem as { figureSpec: Spec }).figureSpec = { type: a.spec.type, params: { ...rest, xStep: Math.PI / ((div as number) ?? 1) } };
        piTwins.push(tag);
      }
      const exam = examineFigureItem(figureItem);
      for (const d of exam.defects) {
        if (a.offGridOk && d.startsWith('it would need a reading finer than the grid')) continue;
        bad(`rule check — ${d}`);
      }
      if (a.ck && exam.derivation.status !== 'derived') bad(`checker status ${exam.derivation.status}: ${exam.derivation.detail}`);
      for (const d of contentDefects(figureItem, { hasFigure: true } as never)) bad(`content check — ${d}`);
      const keyCanon = canonText(keyText);
      for (const h of a.h) if (keyText.length > 2 && canonText(h).includes(keyCanon)) bad('a hint contains the answer');
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');

      const figure = buildPracticeFigure(a.spec, a.alt);
      const safety = validateFigureSvg(figure.svg);
      if (!safety.ok) bad(`svg safety — ${JSON.stringify(safety.issues)}`);
      if (figure.svg.length > MAX_FIGURE_SVG_CHARS) bad(`svg is ${figure.svg.length} chars`);
      const warnings = checkFigureLegibility(a.spec);
      if (warnings.length) bad(`legibility — ${warnings.map((w) => `${w.code}: ${w.message}`).join('; ')}`);
      const figureText = describeFigure((figureItem as { figureSpec: Spec }).figureSpec).text;

      rows.push({
        id, topic: obj.skill, topicId: obj.skill, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored batch-1 figures)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + visual read',
      });
      proofs.push({ id, loId: obj.loId, kind: a.spec.type, format: responseFormat, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}${a.list ? ' · <b>105-list objective</b>' : ''}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · difficulty ${a.d} · ${responseFormat} · ${esc(a.spec.type)}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(a.alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── caps, ids, mapping ────────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) {
    const cap = listIds.has(lo) ? 3 : 2;
    if (kinds.length > cap) problems.push(`${shortOf(lo)}: ${kinds.length} items, cap ${cap}`);
  }
  const mapping = list105.map((o) => {
    const short = shortOf(o.objectiveLoId);
    const mine = meta.filter((m) => m.lo.loId === o.objectiveLoId);
    const base = { loId: o.objectiveLoId, subject: o.subject, skill: o.title, objective: o.description };
    if (covered.has(o.objectiveLoId)) return { ...base, status: 'covered-already' };
    if (mine.length) {
      if (NEEDS[short]) problems.push(`${short}: has items and is also listed as needing a kind`);
      return { ...base, status: 'now-authorable', kind: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), items: mine.length };
    }
    if (!NEEDS[short]) { if (!wip) problems.push(`${short} (${o.title}: ${o.description}): neither items nor a missing kind`); return { ...base, status: 'unmapped' }; }
    return { ...base, status: 'needs-kind', kind: NEEDS[short].kind, note: NEEDS[short].note };
  });
  for (const k of Object.keys(NEEDS)) if (!list105.some((o) => shortOf(o.objectiveLoId) === k)) problems.push(`NEEDS lists ${k}, which is not one of the 105`);

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const needs = mapping.filter((m) => m.status === 'needs-kind') as Array<{ kind: string; subject: string; skill: string; objective: string; loId: string }>;
  const summary = {
    generatedAt: now,
    items: rows.length,
    bySubject: count(meta, (m) => m.lo.subject),
    byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format),
    byProof: count(meta, (m) => m.proof),
    onListObjectives: meta.filter((m) => m.item.list).length,
    onOtherObjectives: meta.filter((m) => !m.item.list).length,
    objectivesWithItems: perLo.size,
    list105: {
      total: list105.length,
      coveredBefore: mapping.filter((m) => m.status === 'covered-already').length,
      nowAuthorable: mapping.filter((m) => m.status === 'now-authorable').length,
      coveredAfter: mapping.filter((m) => m.status !== 'needs-kind' && m.status !== 'unmapped').length,
      stillNeedingAKind: needs.length,
      nowAuthorableByKind: count(mapping.filter((m) => m.status === 'now-authorable') as Array<{ kind: string }>, (m) => m.kind),
    },
    needsKind: Object.fromEntries(Object.entries(count(needs, (m) => m.kind)).sort((x, y) => y[1] - x[1]).map(([kind, nn]) => [kind, { objectives: nn, list: needs.filter((m) => m.kind === kind).map((m) => `${m.subject} · ${m.skill} · ${m.objective}`) }])),
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, list105: summary.list105 }, null, 1));
  if (piTwins.length) console.log(`rule checks run on a numeric-step twin (π ticks): ${piTwins.length} item(s)`);
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  if (problems.length) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (checkOnly) return;

  fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'final'), { recursive: true });
  for (const f of fs.readdirSync(path.join(outDir, 'png'))) if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, 'png', f));
  fs.writeFileSync(path.join(outDir, 'final', 'figure-rows-batch1.json'), JSON.stringify(rows, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
  fs.writeFileSync(path.join(outDir, 'final', 'key-proofs.json'), JSON.stringify(proofs, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'gallery.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Batch-1 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>Batch-1 figure practice items — ${rows.length} items</h1><p>Each figure is shown at 340 px, as on the student's card. The key (✓) is proven from the figure spec in code; the proof line says how. No model was used. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  const sharp = (mod.default ?? mod) as (input: Buffer, opts?: { density?: number }) => { resize(o: { width: number }): { png(): { toFile(p: string): Promise<unknown> } } };
  for (const { id, svg } of pngs) await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));
  console.log(`\nwrote ${rows.length} rows, ${pngs.length} PNGs, gallery.html, mapping.json, summary.json to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
