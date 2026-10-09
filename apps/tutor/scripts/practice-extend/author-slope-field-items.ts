/**
 * Hand-authored practice items that are read off a SLOPE FIELD figure.
 *
 * The figure track of the offline job does not generate slope fields
 * (`RENDERER_NEEDS_WORK`), so these twelve items — four per objective of the
 * AP Calculus AB skill "Slope Fields and Differential Equations" — were
 * written by hand. This script holds them as data, RECOMPUTES every key from
 * the figure spec (an item whose key does not follow from its spec stops the
 * run), shuffles and letters the options with a seeded shuffle, runs the
 * job's own rule checks, the legibility report and the SVG safety validator,
 * and writes ProblemBank-shaped rows, PNGs, a review page and a read pack.
 *
 * No database, no network, no model. Run:
 *   env -u MONGODB_URI npx tsx scripts/practice-extend/author-slope-field-items.ts [--out <dir>]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { compileExpression } from '../../src/lib/tutor/practice-figure/expr';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { ticksBetween } from '../../src/lib/tutor/practice-figure/plot-frame';
import { buildPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { RENDERER_NEEDS_WORK, describeFigure, examineFigureItem, runChecker, type FigureItem } from './figure-core';

const DEFAULT_OUT = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration/practice-figures-2026-10-10-slope';
const SUBJECT = 'AP_CALCULUS_AB';
const SKILL = 'Slope Fields and Differential Equations';
const LO = (n: number) => `gen-c898192b-1054-41d1-ba6d-68912b31e5b4.lo-${n}`;
const OBJECTIVES: Record<string, { description: string; subtopic: string }> = {
  [LO(1)]: { description: 'Understand slope fields as visual representations of differential equations.', subtopic: 'Reading slope fields' },
  [LO(2)]: { description: 'Match a given slope field to its corresponding differential equation.', subtopic: 'Matching slope fields to equations' },
  [LO(3)]: { description: 'Interpret solution curves and describe solution behavior from slope fields.', subtopic: 'Solution behaviour from slope fields' },
};
const PNG_WIDTH = 680; // the 340 px column at 2×

// ── the lattice a reader sees ───────────────────────────────────────────────

interface Lattice {
  f: (x: number, y: number) => number;
  xs: number[];
  ys: number[];
  pts: Array<{ x: number; y: number; m: number }>;
}

function latticeOf(spec: PracticeFigureSpec): Lattice {
  const p = spec.params as { expr: string; xRange: [number, number]; yRange: [number, number]; gridStep: number };
  const f = compileExpression(p.expr, ['x', 'y']);
  const xs = ticksBetween(p.xRange[0], p.xRange[1], p.gridStep);
  const ys = ticksBetween(p.yRange[0], p.yRange[1], p.gridStep);
  const pts = ys.flatMap((y) => xs.map((x) => ({ x, y, m: f(x, y) })));
  return { f, xs, ys, pts };
}

const eq = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const keyOf = (q: { x: number; y: number }) => `${q.x},${q.y}`;
/** The lattice points where `cond` holds are exactly those where `pred` holds. */
const sameSet = (L: Lattice, cond: (m: number) => boolean, pred: (x: number, y: number) => boolean): boolean =>
  L.pts.every((q) => cond(q.m) === pred(q.x, q.y)) && L.pts.some((q) => pred(q.x, q.y));

/** RK4 from (x0, y0) to x1; the heights at every step (stops when |y| passes 1e6). */
function solve(f: (x: number, y: number) => number, x0: number, y0: number, x1: number, n = 4000): Array<[number, number]> {
  const h = (x1 - x0) / n;
  const out: Array<[number, number]> = [[x0, y0]];
  let x = x0;
  let y = y0;
  for (let i = 0; i < n; i++) {
    const k1 = f(x, y);
    const k2 = f(x + h / 2, y + (h / 2) * k1);
    const k3 = f(x + h / 2, y + (h / 2) * k2);
    const k4 = f(x + h, y + h * k3);
    y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    x += h;
    out.push([x, y]);
    if (!Number.isFinite(y) || Math.abs(y) > 1e6) break;
  }
  return out;
}
const rising = (c: Array<[number, number]>) => c.every((q, i) => i === 0 || q[1] > c[i - 1][1]);
const falling = (c: Array<[number, number]>) => c.every((q, i) => i === 0 || q[1] < c[i - 1][1]);
const last = (c: Array<[number, number]>) => c[c.length - 1][1];

/** Does the option's equation draw this field? Also how visibly it differs. */
function equationFit(L: Lattice, expr: string): { same: boolean; signDiffers: number; differs: number } {
  const g = compileExpression(expr, ['x', 'y']);
  let differs = 0;
  let signDiffers = 0;
  for (const q of L.pts) {
    const v = g(q.x, q.y);
    if (!eq(v, q.m)) differs++;
    if (Math.sign(v) !== Math.sign(q.m)) signDiffers++;
  }
  return { same: differs === 0, signDiffers, differs };
}

/** Stability of the constant solution y = c as the reader sees it: the rows one step above and below. */
function stability(L: Lattice, c: number): 'toward' | 'away' | 'mixed' {
  const step = L.ys[1] - L.ys[0];
  const above = L.xs.map((x) => L.f(x, c + step));
  const below = L.xs.map((x) => L.f(x, c - step));
  if (!L.xs.every((x) => eq(L.f(x, c), 0))) throw new Error(`y = ${c} is not a row of horizontal segments`);
  if (above.every((m) => m < 0) && below.every((m) => m > 0)) return 'toward';
  if (above.every((m) => m > 0) && below.every((m) => m < 0)) return 'away';
  return 'mixed';
}

// ── the items ───────────────────────────────────────────────────────────────

interface Option {
  text: string;
  /** The specific misreading behind a wrong option ("correct" for the key). */
  why: string;
  /** Is this option true of the drawn field? Computed from the spec. */
  holds: (L: Lattice) => boolean;
}

interface Authored {
  lo: string;
  taskKind: string;
  difficulty: number;
  spec: PracticeFigureSpec;
  alt: string;
  stem: string;
  /** mcq: options, the CORRECT one first (shuffled and lettered below). */
  options?: Option[];
  /** numeric: the stated key and how it is recomputed from the spec. */
  number?: { stated: number; recompute: (L: Lattice, spec: PracticeFigureSpec) => number };
  hints: string[];
  solution: string;
  /** How the key was recomputed, for the review page. */
  derivation: string;
}

const field = (expr: string, xRange: [number, number] = [-3, 3], yRange: [number, number] = [-3, 3]): PracticeFigureSpec => ({
  type: 'slope_field',
  params: { expr, xRange, yRange, gridStep: 1, xStep: 1, yStep: 1 },
});
const ALT_SQUARE = 'A slope field: a short line segment is drawn at every point with whole-number coordinates on a grid, with the x-axis running from −3 to 3 and the y-axis running from −3 to 3. Both axes are numbered in steps of one.';
const ALT_WIDE = 'A slope field: a short line segment is drawn at every point with whole-number coordinates on a grid, with the x-axis running from 0 to 6 and the y-axis running from −1 to 5. Both axes are numbered in steps of one.';

const matchOption = (label: string, expr: string, why: string): Option => ({ text: `dy/dx = ${label}`, why, holds: (L) => equationFit(L, expr).same });

const ITEMS: Authored[] = [
  // ── lo-1: slope fields as pictures of a differential equation ─────────────
  {
    lo: LO(1), taskKind: 'read the slope of the segment at a named lattice point', difficulty: 1,
    spec: field('x*y/2'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. What is the slope of the segment drawn at the point (2, 1)?',
    number: { stated: 1, recompute: (_L, spec) => { const d = runChecker(spec, { checker: 'slope_at', args: { x: 2, y: 1 } }); if (d.kind !== 'number') throw new Error('slope_at gave no number'); return d.value; } },
    hints: ['Find x = 2 on the horizontal axis and y = 1 on the vertical axis, then look at the short segment centred on that grid point.', 'Slope is rise over run: compare how far the segment goes up with how far it goes to the right.'],
    solution: 'The segment centred at (2, 1) goes up exactly as far as it goes to the right — it is parallel to the diagonal of a grid square — so rise ÷ run = 1. The slope there is 1.',
    derivation: 'figure-core checker slope_at {x: 2, y: 1} on the spec (dy/dx evaluated at the lattice point)',
  },
  {
    lo: LO(1), taskKind: 'identify where the segments are horizontal', difficulty: 2,
    spec: field('x + y'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. At which points of the grid do the segments have slope 0?',
    options: [
      { text: 'At the points on the line y = −x', why: 'correct', holds: (L) => sameSet(L, (m) => eq(m, 0), (x, y) => eq(y, -x)) },
      { text: 'At the points on the line y = x', why: 'reads the diagonal of flat segments as rising instead of falling', holds: (L) => sameSet(L, (m) => eq(m, 0), (x, y) => eq(y, x)) },
      { text: 'At the points on the x-axis', why: 'assumes slope is zero wherever y = 0', holds: (L) => sameSet(L, (m) => eq(m, 0), (_x, y) => eq(y, 0)) },
      { text: 'At the points on the y-axis', why: 'assumes slope is zero wherever x = 0', holds: (L) => sameSet(L, (m) => eq(m, 0), (x) => eq(x, 0)) },
    ],
    hints: ['A segment with slope 0 is horizontal. Find several horizontal segments and note their coordinates.', 'Check whether the coordinates of those points have the same sign or opposite signs.'],
    solution: 'The horizontal segments sit at (−3, 3), (−2, 2), (−1, 1), (0, 0), (1, −1), (2, −2) and (3, −3). At each of these points y is the opposite of x, so they lie on the line y = −x. On the axes (away from the origin) the segments are tilted.',
    derivation: 'dy/dx evaluated at all 49 lattice points: the set of points with slope 0 equals the set named by the key, and differs from the set named by each other option',
  },
  {
    lo: LO(1), taskKind: 'compare the steepness of the segments at named points', difficulty: 2,
    spec: field('y - x'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. At which of these four points is the segment of the slope field the steepest?',
    options: [
      { text: '(0, 2)', why: 'correct', holds: (L) => [[3, 3], [2, 3], [3, 2]].every(([x, y]) => Math.abs(L.f(0, 2)) > Math.abs(L.f(x, y)) + 0.5) },
      { text: '(3, 3)', why: 'picks the point farthest from the origin, where the segment is in fact flat', holds: (L) => [[0, 2], [2, 3], [3, 2]].every(([x, y]) => Math.abs(L.f(3, 3)) > Math.abs(L.f(x, y))) },
      { text: '(2, 3)', why: 'picks a rising segment high on the grid without comparing its tilt', holds: (L) => [[0, 2], [3, 3], [3, 2]].every(([x, y]) => Math.abs(L.f(2, 3)) > Math.abs(L.f(x, y))) },
      { text: '(3, 2)', why: 'swaps the coordinates, or takes a falling segment as steeper than a rising one', holds: (L) => [[0, 2], [3, 3], [2, 3]].every(([x, y]) => Math.abs(L.f(3, 2)) > Math.abs(L.f(x, y))) },
    ],
    hints: ['Locate each point on the grid and look at the segment centred there.', 'Steepness is about how far the segment is tilted from horizontal, whether it rises or falls.'],
    solution: 'At (0, 2) the segment rises 2 for every 1 across (slope 2). At (2, 3) it rises 1 for 1 (slope 1), at (3, 2) it falls 1 for 1 (slope −1), and at (3, 3) it is horizontal (slope 0). The steepest segment is the one at (0, 2).',
    derivation: 'dy/dx evaluated at the four named points gives 2, 0, 1, −1; |slope| is largest only at the key',
  },
  {
    lo: LO(1), taskKind: 'identify where the slopes are negative', difficulty: 2,
    spec: field('y - 1'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. At which points of the grid do the segments have negative slope?',
    options: [
      { text: 'At every point below the line y = 1', why: 'correct', holds: (L) => sameSet(L, (m) => m < 0, (_x, y) => y < 1) },
      { text: 'At every point below the x-axis', why: 'assumes the sign of the slope changes at y = 0 and misses the falling segments on the x-axis', holds: (L) => sameSet(L, (m) => m < 0, (_x, y) => y < 0) },
      { text: 'At every point left of the line x = 1', why: 'reads the pattern across columns instead of across rows', holds: (L) => sameSet(L, (m) => m < 0, (x) => x < 1) },
      { text: 'At every point above the line y = 1', why: 'reverses rising and falling', holds: (L) => sameSet(L, (m) => m < 0, (_x, y) => y > 1) },
    ],
    hints: ['A segment with negative slope goes down as you move to the right.', 'Find the row where the segments are horizontal; then compare the rows above it with the rows below it.'],
    solution: 'The segments in the row y = 1 are horizontal. In every row below it (y = 0, −1, −2, −3) the segments go down to the right, so their slopes are negative; in the rows above it they go up. Negative slopes occur exactly below the line y = 1.',
    derivation: 'dy/dx evaluated at all 49 lattice points: the set of points with negative slope equals the set named by the key, and differs from the set named by each other option',
  },

  // ── lo-2: match a field to its equation ───────────────────────────────────
  {
    lo: LO(2), taskKind: 'which differential equation matches the field (slopes change with one variable only)', difficulty: 2,
    spec: field('-y/2'), alt: ALT_SQUARE,
    stem: 'The slope field shown belongs to one of these differential equations. Which one?',
    options: [
      matchOption('−y/2', '-y/2', 'correct'),
      matchOption('y/2', 'y/2', 'has the right variable but the wrong sign: slopes would be positive above the x-axis'),
      matchOption('−x/2', '-x/2', 'confuses rows with columns: slopes would be the same down each column'),
      matchOption('x/2', 'x/2', 'confuses rows with columns and reverses the sign'),
    ],
    hints: ['Look along one row, then along one column. In which direction do the segments stay parallel?', 'Then check the sign: are the segments above the x-axis rising or falling?'],
    solution: 'Along every row the segments are parallel, so the slope does not depend on x — only on y. Above the x-axis the segments fall and below it they rise, so the slope has the opposite sign to y; at (0, 2) the slope is −1. This matches dy/dx = −y/2.',
    derivation: 'each option evaluated at all 49 lattice points: only the key reproduces every drawn slope; each other option has the wrong sign at 21 or more points',
  },
  {
    lo: LO(2), taskKind: 'which differential equation matches the field (slopes change with both variables)', difficulty: 3,
    spec: field('x - y'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. Which of these equations has this slope field?',
    options: [
      matchOption('x − y', 'x - y', 'correct'),
      matchOption('x + y', 'x + y', 'puts the flat segments on the wrong diagonal (y = −x)'),
      matchOption('y − x', 'y - x', 'has the flat segments on the right diagonal but every other slope reversed'),
      matchOption('x·y', 'x*y', 'would have flat segments along both axes instead of along a diagonal'),
    ],
    hints: ['Find where the segments are horizontal: for the right equation, dy/dx must be 0 at those points.', 'Then test one point off that line, such as (2, 0): is the segment there rising or falling?'],
    solution: 'The horizontal segments lie along the diagonal y = x, so dy/dx = 0 when x = y; that rules out x + y and x·y. At (2, 0) the segment rises steeply (slope 2), which fits x − y = 2 and not y − x = −2. The equation is dy/dx = x − y.',
    derivation: 'each option evaluated at all 49 lattice points: only the key reproduces every drawn slope; each other option has the wrong sign at 20 or more points',
  },
  {
    lo: LO(2), taskKind: 'decide which variables the slope depends on', difficulty: 1,
    spec: field('1 - x'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. Judging from the figure, on which of the variables x and y does the slope of a segment depend?',
    options: [
      { text: 'On x only', why: 'correct', holds: (L) => dependsOn(L).x && !dependsOn(L).y },
      { text: 'On y only', why: 'confuses rows with columns: that field would have parallel segments along each row', holds: (L) => !dependsOn(L).x && dependsOn(L).y },
      { text: 'On both x and y', why: 'sees that the slopes change and assumes both variables matter', holds: (L) => dependsOn(L).x && dependsOn(L).y },
      { text: 'On neither x nor y', why: 'takes the parallel segments within a column to mean the slope never changes', holds: (L) => !dependsOn(L).x && !dependsOn(L).y },
    ],
    hints: ['Move straight up a column (x fixed, y changing). Do the segments change direction?', 'Now move along a row (y fixed, x changing) and ask the same question.'],
    solution: 'Going up any column the segments stay parallel, so changing y does not change the slope. Going along any row the segments turn from rising, through horizontal at x = 1, to falling, so the slope changes with x. The slope depends on x only.',
    derivation: 'dy/dx evaluated at all 49 lattice points: slopes differ along every row and are equal down every column',
  },
  {
    lo: LO(2), taskKind: 'find the constant in an equation of a given form from the field', difficulty: 3,
    spec: field('x - 2*y'), alt: ALT_SQUARE,
    stem: 'The slope field shown belongs to a differential equation of the form dy/dx = x − k·y for some number k. What is the value of k?',
    number: {
      stated: 2,
      recompute: (L, spec) => {
        // k from the clearest reading: the horizontal segment at (2, 1), where x − k·y = 0.
        const flat = runChecker(spec, { checker: 'slope_at', args: { x: 2, y: 1 } });
        if (flat.kind !== 'number' || !eq(flat.value, 0)) throw new Error('the segment at (2, 1) is not horizontal');
        const k = 2 / 1;
        // …and the same k from a second segment: at (0, −1) the slope is −k·(−1) = k.
        const d = runChecker(spec, { checker: 'slope_at', args: { x: 0, y: -1 } });
        if (d.kind !== 'number' || !eq(d.value, k)) throw new Error('the segment at (0, −1) does not give the same k');
        if (!L.pts.every((q) => eq(q.m, q.x - k * q.y))) throw new Error('x − k·y does not reproduce the field');
        for (const other of [-2, -1, 0.5, 1, 3]) if (L.pts.every((q) => eq(q.m, q.x - other * q.y))) throw new Error(`k = ${other} also reproduces the field`);
        if (!eq(L.f(2, 1), 0) || !eq(L.f(-2, -1), 0)) throw new Error('the flat segments used in the solution are not flat');
        return k;
      },
    },
    hints: ['Where a segment is horizontal, dy/dx = 0, so x − k·y = 0 at that point.', 'Find a horizontal segment away from the origin, read its coordinates and substitute them.'],
    solution: 'The segment at (2, 1) is horizontal, so dy/dx = 0 there: 2 − k·1 = 0, which gives k = 2. Check with another point: at (0, −1) the equation gives 0 − 2·(−1) = 2, and the segment there rises 2 for every 1 across.',
    derivation: 'figure-core checker slope_at gives slope 0 at (2, 1), so k = 2; slope_at (0, −1) gives the same k; x − k·y then checked against all 49 lattice slopes, and k = −2, −1, 0.5, 1, 3 shown not to fit',
  },

  // ── lo-3: solution behaviour ──────────────────────────────────────────────
  {
    lo: LO(3), taskKind: 'describe the long-run behaviour of the solution through a given point', difficulty: 2,
    spec: field('(2 - y)/2', [0, 6], [-1, 5]), alt: ALT_WIDE,
    stem: 'The slope field of a differential equation is shown. A solution curve passes through the point (0, 0). According to the slope field, what does this solution do as x increases?',
    options: [
      { text: 'It rises and approaches y = 2', why: 'correct', holds: (L) => { const c = solve(L.f, 0, 0, 60); return rising(c) && Math.abs(last(c) - 2) < 1e-6 && last(c) < 2; } },
      { text: 'It rises without any upper limit', why: 'follows the rising segments at the start and ignores that they flatten', holds: (L) => { const c = solve(L.f, 0, 0, 60); return rising(c) && last(c) > 100; } },
      { text: 'It rises to y = 2 and then falls', why: 'carries the solution across the row of flat segments into the falling ones above it', holds: (L) => { const c = solve(L.f, 0, 0, 60); return !rising(c) && Math.max(...c.map((q) => q[1])) >= 2; } },
      { text: 'It falls and approaches y = −1', why: 'reads the segments at the starting point as falling', holds: (L) => { const c = solve(L.f, 0, 0, 60); return falling(c) && Math.abs(last(c) + 1) < 1e-3; } },
    ],
    hints: ['Start at (0, 0) and move to the right, always travelling in the direction of the nearby segments.', 'Watch how the tilt of the segments changes in the rows the curve climbs through.'],
    solution: 'At (0, 0) the segments rise, so the solution goes up. In each higher row the segments are less steep, and along y = 2 they are horizontal, so the curve flattens as it nears y = 2 and cannot cross it. The solution rises and approaches y = 2.',
    derivation: 'dy/dx integrated numerically (RK4) from (0, 0) to x = 60: the solution rises throughout and ends just below 2; the three other descriptions are false for it',
  },
  {
    lo: LO(3), taskKind: 'identify the constant (equilibrium) solution', difficulty: 1,
    spec: field('(y + 1)/2'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. Exactly one constant function y = c is a solution of the equation. What is the value of c?',
    number: {
      stated: -1,
      recompute: (L) => {
        const rows = L.ys.filter((y) => L.xs.every((x) => eq(L.f(x, y), 0)));
        if (rows.length !== 1) throw new Error(`${rows.length} rows of horizontal segments`);
        return rows[0];
      },
    },
    hints: ['A constant solution is a horizontal line, so its slope is 0 at every point.', 'Look for a whole row in which every segment is horizontal.'],
    solution: 'A constant solution y = c has slope 0 everywhere along it. The only row in which every segment is horizontal is the row y = −1, so the constant solution is y = −1 and c = −1.',
    derivation: 'dy/dx evaluated at all 49 lattice points: exactly one row (y = −1) has slope 0 at every point',
  },
  {
    lo: LO(3), taskKind: 'decide whether nearby solutions move toward or away from each equilibrium', difficulty: 3,
    spec: field('y*(3 - y)/2', [0, 6], [-1, 5]), alt: ALT_WIDE,
    stem: 'The slope field of a differential equation is shown; y = 0 and y = 3 are its two constant solutions. According to the slope field, how do solutions that start close to these lines behave as x increases?',
    options: [
      { text: 'They move away from y = 0 and toward y = 3', why: 'correct', holds: (L) => stability(L, 0) === 'away' && stability(L, 3) === 'toward' },
      { text: 'They move toward y = 0 and away from y = 3', why: 'reverses the two lines, or reads the segments from right to left', holds: (L) => stability(L, 0) === 'toward' && stability(L, 3) === 'away' },
      { text: 'They move toward both y = 0 and y = 3', why: 'assumes every constant solution attracts nearby solutions', holds: (L) => stability(L, 0) === 'toward' && stability(L, 3) === 'toward' },
      { text: 'They move away from both y = 0 and y = 3', why: 'looks only at the falling segments above y = 3 and below y = 0', holds: (L) => stability(L, 0) === 'away' && stability(L, 3) === 'away' },
    ],
    hints: ['Look at the rows just above and just below each line: do the segments there rise or fall?', 'A rising segment carries a solution upward as x increases; a falling one carries it downward.'],
    solution: 'Just above y = 0 the segments rise and just below it they fall, so nearby solutions move away from y = 0. Just below y = 3 the segments rise and just above it they fall, so nearby solutions are carried toward y = 3. Solutions move away from y = 0 and toward y = 3.',
    derivation: 'dy/dx evaluated on the rows one step above and below each row of horizontal segments: positive above / negative below y = 0, negative above / positive below y = 3',
  },
  {
    lo: LO(3), taskKind: 'say where the solution through a given point increases and decreases', difficulty: 2,
    spec: field('-x/2'), alt: ALT_SQUARE,
    stem: 'The slope field of a differential equation is shown. A solution curve passes through the point (−2, 0). According to the slope field, how does this solution behave as x increases from −2 to 2?',
    options: [
      { text: 'It rises until x = 0 and falls after that', why: 'correct', holds: (L) => rising(solve(L.f, -2, 0, 0)) && falling(solve(L.f, 0, last(solve(L.f, -2, 0, 0)), 2)) },
      { text: 'It falls until x = 0 and rises after that', why: 'reverses rising and falling segments', holds: (L) => falling(solve(L.f, -2, 0, 0)) && rising(solve(L.f, 0, last(solve(L.f, -2, 0, 0)), 2)) },
      { text: 'It rises all the way from x = −2 to x = 2', why: 'follows the segments at the starting point and ignores how they change across the columns', holds: (L) => rising(solve(L.f, -2, 0, 2)) },
      { text: 'It falls all the way from x = −2 to x = 2', why: 'reads the segments right of the y-axis and applies them everywhere', holds: (L) => falling(solve(L.f, -2, 0, 2)) },
    ],
    hints: ['Start at (−2, 0) and follow the direction of the segments as you move right.', 'Notice the column in which the segments are horizontal: what are the segments like on each side of it?'],
    solution: 'Left of the y-axis every segment rises, so the solution through (−2, 0) climbs. On the y-axis the segments are horizontal, and to the right of it every segment falls, so the solution comes back down. It rises until x = 0 (a maximum) and falls after that.',
    derivation: 'dy/dx integrated numerically (RK4) from (−2, 0): the solution rises on [−2, 0] and falls on [0, 2]',
  },
];

function dependsOn(L: Lattice): { x: boolean; y: boolean } {
  return {
    x: L.ys.some((y) => L.xs.some((x) => !eq(L.f(x, y), L.f(L.xs[0], y)))),
    y: L.xs.some((x) => L.ys.some((y) => !eq(L.f(x, y), L.f(x, L.ys[0])))),
  };
}

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
const fmtNum = (v: number) => String(v);

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const outArg = process.argv.indexOf('--out');
  const outDir = outArg > 0 ? process.argv[outArg + 1] : DEFAULT_OUT;
  const problems: string[] = [];
  const notes: string[] = [];
  const now = new Date().toISOString();
  // The job does not GENERATE slope fields; these were authored by hand and
  // are looked at one by one, so the kind-level stop is lifted for this run only.
  const kindStop = RENDERER_NEEDS_WORK.slope_field;
  delete RENDERER_NEEDS_WORK.slope_field;

  const rows: Array<Record<string, unknown>> = [];
  const read: Array<Record<string, unknown>> = [];
  const review: string[] = [];
  const legibility: Array<{ id: string; warnings: unknown[] }> = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const perLo = new Map<string, Set<string>>();

  for (const [n, a] of ITEMS.entries()) {
    const tag = `item ${n + 1} (${a.taskKind})`;
    const L = latticeOf(a.spec);
    const id = itemIdOf(a.lo, a.stem);
    const kinds = perLo.get(a.lo) ?? new Set<string>();
    if (kinds.has(a.taskKind)) problems.push(`${tag}: task kind repeated within the objective`);
    kinds.add(a.taskKind);
    perLo.set(a.lo, kinds);
    if (a.spec.params.showExpression) problems.push(`${tag}: the equation is printed on the figure`);
    // An equation in the stem is allowed only with an unknown constant in it (the task is then to find the constant).
    if (/dy\/dx\s*=/.test(a.stem) && !/dy\/dx = x − k·y for some number k/.test(a.stem)) problems.push(`${tag}: the stem states the equation`);

    let responseFormat: 'mcq' | 'numeric';
    let answer: string;
    let choices: string[] = [];
    let rationales: string[] = [];
    let keyText: string;
    let computed: string;
    if (a.options) {
      responseFormat = 'mcq';
      const truth = a.options.map((o) => o.holds(L));
      computed = `options true of the field: [${truth.map((t, i) => (t ? a.options![i].text : '')).filter(Boolean).join(' | ')}]`;
      if (!(truth[0] && truth.slice(1).every((t) => !t))) problems.push(`${tag}: the key does not follow from the spec — truth of the options as written: ${JSON.stringify(truth)}`);
      const order = shuffled(a.options, a.stem);
      choices = order.map((o) => o.text);
      rationales = order.map((o) => o.why);
      const idx = order.indexOf(a.options[0]);
      answer = 'ABCD'[idx];
      keyText = a.options[0].text;
      if (choices['ABCD'.indexOf(answer)] !== keyText) problems.push(`${tag}: the letter does not point at the correct text`);
      if (new Set(choices).size !== 4) problems.push(`${tag}: options are not four distinct texts`);
      const lens = choices.map((c) => c.length);
      if (Math.max(...lens) > Math.min(...lens) * 1.6 + 4) notes.push(`${tag}: option lengths ${lens.join('/')}`);
      // Equation matching: every wrong option must be visibly different.
      if (a.options.every((o) => o.text.startsWith('dy/dx = '))) {
        const exprs: Record<string, string> = { '−y/2': '-y/2', 'y/2': 'y/2', '−x/2': '-x/2', 'x/2': 'x/2', 'x − y': 'x - y', 'x + y': 'x + y', 'y − x': 'y - x', 'x·y': 'x*y' };
        for (const o of a.options.slice(1)) {
          const fit = equationFit(L, exprs[o.text.slice('dy/dx = '.length)]);
          computed += `; ${o.text}: differs at ${fit.differs}/49 points, sign differs at ${fit.signDiffers}`;
          if (fit.signDiffers < 12) problems.push(`${tag}: option "${o.text}" differs in sign from the drawn field at only ${fit.signDiffers} points`);
        }
      }
    } else if (a.number) {
      responseFormat = 'numeric';
      const v = a.number.recompute(L, a.spec);
      computed = `recomputed value ${fmtNum(v)}`;
      if (!eq(v, a.number.stated)) problems.push(`${tag}: stated key ${a.number.stated}, recomputed ${v}`);
      answer = fmtNum(a.number.stated);
      keyText = answer;
    } else {
      throw new Error(`${tag}: neither options nor a number`);
    }

    // The job's own rule checks (no model): stem, alt, printed text, drawing.
    const figureItem: FigureItem = {
      objectiveLoId: a.lo, responseFormat, problemText: a.stem, answer, choices, hints: a.hints, solutionText: a.solution, difficulty: a.difficulty,
      covers: OBJECTIVES[a.lo].description, taskType: a.taskKind, distractorRationales: rationales,
      figureSpec: a.spec, alt: a.alt, derivation: { checker: 'none', args: {} },
    } as unknown as FigureItem;
    const exam = examineFigureItem(figureItem);
    for (const d of exam.defects) problems.push(`${tag}: rule check — ${d}`);
    for (const d of contentDefects(figureItem, { hasFigure: true } as never)) problems.push(`${tag}: content check — ${d}`);
    for (const h of a.hints) if (h.includes(keyText) && keyText.length > 2) problems.push(`${tag}: a hint contains the answer`);
    if (/\\[a-zA-Z]|\$/.test([a.stem, a.solution, ...a.hints, ...choices].join(' '))) problems.push(`${tag}: LaTeX in the text`);

    const figure = buildPracticeFigure(a.spec, a.alt);
    const safety = validateFigureSvg(figure.svg);
    if (!safety.ok) problems.push(`${tag}: svg safety — ${JSON.stringify(safety.issues)}`);
    if (figure.svg.length > MAX_FIGURE_SVG_CHARS) problems.push(`${tag}: svg is ${figure.svg.length} chars`);
    if (figure.alt.length < 1 || figure.alt.length > 600) problems.push(`${tag}: alt length ${figure.alt.length}`);
    if (/slope of|dy\/dx|horizontal|rising|falling/i.test(figure.alt)) problems.push(`${tag}: alt text describes the slopes`);
    const warnings = checkFigureLegibility(a.spec);
    legibility.push({ id, warnings });
    const figureText = describeFigure(a.spec).text;

    rows.push({
      id, topic: SKILL, topicId: SKILL, loId: a.lo, subtopic: OBJECTIVES[a.lo].subtopic, difficulty: a.difficulty,
      problemText: a.stem, answer, solutionText: a.solution, hints: a.hints, responseFormat, choices,
      figure,
      source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored slope fields)' }, license: 'internal-original', verifiedAt: now,
      verifierModel: 'none — key computed from the figure spec; awaiting visual read',
    });
    const png = path.resolve(outDir, 'png', `${id}.png`);
    read.push({
      id, subject: SUBJECT, skill: SKILL, objective: OBJECTIVES[a.lo].description, format: responseFormat, question: a.stem, choices, key: answer,
      hints: a.hints, solution: a.solution, figureKind: a.spec.type, figureText, png,
    });
    pngs.push({ id, svg: figure.svg });
    review.push(`<section><div class="fig">${figure.svg}</div><div class="q"><p class="meta">${esc(id)}<br>${esc(OBJECTIVES[a.lo].description)}<br>task: ${esc(a.taskKind)} · difficulty ${a.difficulty} · ${responseFormat}</p><p class="stem">${esc(a.stem)}</p>${
      choices.length ? `<ol type="A">${choices.map((c, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(c)}${'ABCD'[i] === answer ? '' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
    }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.hints.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.solution)}</p><p class="der"><b>Key recomputed from the spec:</b> ${esc(a.derivation)}. ${esc(computed)}</p><p class="der"><b>Spec:</b> <code>${esc(JSON.stringify(a.spec.params))}</code></p><p class="der"><b>Alt:</b> ${esc(a.alt)}</p><p class="der"><b>Legibility:</b> ${warnings.length ? esc(JSON.stringify(warnings)) : 'no warnings'}</p></div></section>`);
    console.log(`${id}  ${responseFormat}  key ${answer}  ${computed.slice(0, 150)}  legibility ${warnings.length}`);
  }
  RENDERER_NEEDS_WORK.slope_field = kindStop;

  // ── validation of the export ──────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push('ids are not unique');
  for (const r of rows) {
    if (!/^practice-gen\.gen-[0-9a-f-]+\.lo-\d+\.[0-9a-z]+$/.test(r.id as string) || !(r.id as string).startsWith(`practice-gen.${r.loId}.`)) problems.push(`${r.id}: id is not in the scheme / does not match its loId`);
    if (r.responseFormat === 'mcq' && ((r.choices as string[]).length !== 4 || !/^[ABCD]$/.test(r.answer as string))) problems.push(`${r.id}: mcq without four options and a letter`);
  }
  for (const [lo, kinds] of perLo) if (kinds.size !== 4) problems.push(`${lo}: ${kinds.size} task kinds, expected 4`);

  if (problems.length) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }

  fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'read'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'problem-bank-rows.json'), JSON.stringify(rows, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'read', 'read-01.json'), JSON.stringify(read, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'legibility-warnings.json'), JSON.stringify(legibility, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'review.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Slope-field practice items — review</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}code{font-size:12px}
</style></head><body><h1>Slope-field practice items — ${rows.length} items, ${SUBJECT} · ${esc(SKILL)}</h1><p>Figures at 340 px. Keys recomputed from each figure spec in code; no model was used. Generated ${esc(now)}.</p>${review.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  const sharp = (mod.default ?? mod) as (input: Buffer, opts?: { density?: number }) => { resize(o: { width: number }): { png(): { toFile(p: string): Promise<unknown> } } };
  for (const { id, svg } of pngs) await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));

  console.log(`\nwrote ${rows.length} rows, ${pngs.length} PNGs, review.html, read/read-01.json to ${outDir}`);
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  const warned = legibility.filter((l) => l.warnings.length);
  console.log(warned.length ? `legibility warnings:\n${JSON.stringify(warned, null, 2)}` : 'legibility: no warnings on any figure');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
