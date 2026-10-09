/**
 * Pure logic of the FIGURE track of the practice-extension job
 * (scripts/practice-extend/figure-track.ts): practice items that are shown
 * together with one figure drawn by the authoring renderer
 * (src/lib/tutor/practice-figure/render.ts).
 *
 * No I/O, no network, no model, no database. Three things live here:
 *   1. the axes a spec puts on the picture, and what "on the grid" means;
 *   2. `describeFigure` — a faithful TEXT transcription of what the picture
 *      shows (printed text first, then what can be read off), made from the
 *      spec by code. It is what the blind solvers and the quality reviewers
 *      are given instead of the picture: never the writer's prose, never an
 *      equation the picture does not display, never a value finer than the grid;
 *   3. the deterministic checkers — the key of an item recomputed from the
 *      spec (`runChecker`, `compareDerived`) — and the rule checks
 *      (`examineFigureItem`).
 *
 * The no-db import comes first: render.ts pulls in app modules, and nothing
 * this job loads may be able to reach a real database.
 */
import '../lib/no-db-env';
import { compileExpression } from '../../src/lib/tutor/practice-figure/expr';
import { SERIES_COLORS, niceBounds, niceStep, ticksBetween } from '../../src/lib/tutor/practice-figure/plot-frame';
import { ALL_PRACTICE_FIGURE_KINDS, BATCH1_FIGURE_KINDS, PRACTICE_FIGURE_KINDS, renderPracticeFigure, titrationPH, type AnyPracticeFigureKind, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { PracticeFigureSpecError, Reader } from '../../src/lib/tutor/practice-figure/spec';
import { exactTrig, fractionText, piText } from '../../src/lib/tutor/practice-figure/kinds/draw';
import { unitCircleModel } from '../../src/lib/tutor/practice-figure/kinds/unit-circle';
import { vectorDiagramModel, type DiagramVector } from '../../src/lib/tutor/practice-figure/kinds/vector-diagram';
import { freeBodyModel, type FbdForce, type FreeBodyModel } from '../../src/lib/tutor/practice-figure/kinds/free-body';
import { satisfies, shadedRegionModel, type ShadedRegionModel } from '../../src/lib/tutor/practice-figure/kinds/shaded-region';
import { numberLineModel, signChartModel, type NumberLineModel } from '../../src/lib/tutor/practice-figure/kinds/number-line';
import { boxPlotModel, distributionModel, histogramModel, normalArea, type BoxPlot } from '../../src/lib/tutor/practice-figure/kinds/distribution';
import { polarComplexModel, type PlanePoint } from '../../src/lib/tutor/practice-figure/kinds/polar-complex';
import { punnettModel } from '../../src/lib/tutor/practice-figure/kinds/punnett';
import { pedigreeModel, type PedigreeIndividual, type PedigreeModel } from '../../src/lib/tutor/practice-figure/kinds/pedigree';
import { slopeFieldSolution } from '../../src/lib/tutor/practice-figure/slope-field';
import { validateItem, type GeneratedItem } from './core';
import { BATCH2_CHECKERS, BATCH2_FIGURE_KINDS, Batch2RuleError, describeBatch2, isBatch2Kind, type Batch2FigureKind } from './figure-core-batch2';

/** `PRACTICE_FIGURE_KINDS` is the list the job offers its writer (figure-prompts.ts).
 *  The batch-1 kinds (unit circle, vectors, …) are transcribed and checked here
 *  as well, but are not in that list until the job has prompts for them. */
export { ALL_PRACTICE_FIGURE_KINDS, BATCH1_FIGURE_KINDS, PRACTICE_FIGURE_KINDS };
/** Batch 2 (circuits, cladograms, geometry, rays, fields, flows, solids, spectra): transcribed and
 *  checked by figure-core-batch2.ts and reached through the same four functions of this file —
 *  `axesOf`, `describeFigure`, `runChecker`, `checkerCatalogue`. */
export { BATCH2_CHECKERS, BATCH2_FIGURE_KINDS };
export type FigureKind = AnyPracticeFigureKind;

/** A spec, a derivation or an item that breaks a rule of this track. The
 *  message is written for the writer model (it is sent back on the retry). */
export class FigureRuleError extends Error {}

type P = Record<string, unknown>;
const isObj = (v: unknown): v is P => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
function fail(m: string): never {
  throw new FigureRuleError(m);
}
/** Run a piece of figure-core-batch2.ts; its refusals become this file's `FigureRuleError`. */
function viaBatch2<T>(fn: () => T): T {
  try {
    return fn();
  } catch (e) {
    if (e instanceof Batch2RuleError) return fail(e.message);
    throw e;
  }
}

/** A number as text: no float dust, ASCII minus. */
export function fmt(v: number): string {
  const r = Number(v.toPrecision(10));
  return String(Object.is(r, -0) ? 0 : r);
}

// ── 1. axes ─────────────────────────────────────────────────────────────────

export interface Axis {
  min: number;
  max: number;
  /** Spacing of the numbered gridlines. */
  step: number;
  /** Spacing of the finest gridlines drawn (plot-frame.ts: 1→2, 2→2, 5→5 per step). */
  minor: number;
  label: string;
  /** False when the axis carries no numbers (nothing can be read off it). */
  numbered: boolean;
}

function minorOf(step: number): number {
  const mant = step / Math.pow(10, Math.floor(Math.log10(step) + 1e-9));
  return step / (Math.abs(mant - 5) < 1e-6 ? 5 : 2);
}

const isMultiple = (v: number, unit: number): boolean => Math.abs(v / unit - Math.round(v / unit)) < 1e-6;

/** A value that sits exactly on a drawn gridline of the axis. */
export function onGrid(v: number, a: Axis): boolean {
  return a.numbered && v >= a.min - 1e-9 && v <= a.max + 1e-9 && isMultiple(v, a.minor);
}

function explicitAxis(p: P, what: string, rangeKey: string, stepKey: string, label: string, maxIntervals: number): Axis {
  const r = p[rangeKey];
  if (!Array.isArray(r) || r.length !== 2 || !isNum(r[0]) || !isNum(r[1]) || !(r[1] > r[0])) fail(`${rangeKey} must be given as [min, max] (the ${what} axis is never left to a default in this job)`);
  const [min, max] = r as [number, number];
  const step = p[stepKey];
  if (!isNum(step) || !(step > 0)) return fail(`${stepKey} must be given (the spacing of the numbered gridlines on the ${what} axis)`);
  return checkedAxis({ min, max, step, minor: minorOf(step), label, numbered: true }, `${rangeKey} / ${stepKey}`, maxIntervals);
}

function checkedAxis(a: Axis, name: string, maxIntervals: number): Axis {
  if (!isMultiple(a.min, a.step) || !isMultiple(a.max, a.step)) fail(`${name}: both ends of the range must be multiples of the step, so the axis starts and ends on a numbered gridline`);
  const n = (a.max - a.min) / a.step;
  if (n < 2 - 1e-9 || n > maxIntervals + 1e-9) fail(`${name}: the range must span between 2 and ${maxIntervals} steps (it spans ${fmt(n)}) — more cannot be numbered legibly at phone width`);
  return a;
}

const str = (v: unknown, dflt = ''): string => (typeof v === 'string' && v.trim() ? v.trim().replace(/\s+/g, ' ') : dflt);

/** The reaction-coordinate energy axis, exactly as render.ts lays it out. */
function reactionAxis(p: P): Axis {
  const R = isNum(p.reactantsEnergy) ? p.reactantsEnergy : 0;
  const P_ = p.productsEnergy;
  const eas = p.activationEnergies;
  if (!isNum(P_)) return fail('productsEnergy must be a number');
  if (!Array.isArray(eas) || eas.length < 1 || !eas.every((e) => isNum(e) && e > 0)) return fail('activationEnergies must be a list of positive numbers');
  const lo = Math.min(R, P_);
  const hi = R + Math.max(...(eas as number[]));
  const span = hi - lo;
  const b = niceBounds(lo - 0.22 * span, hi + 0.08 * span, 10);
  return { min: b.min, max: b.max, step: b.step, minor: minorOf(b.step), label: `Energy (${str(p.units, 'kJ/mol')})`, numbered: p.showAxisValues !== false };
}

export interface FigureAxes {
  x?: Axis;
  y?: Axis;
}

/**
 * The axes the spec puts on the picture. Every numbered axis must be given
 * explicitly (range and step) so that what is on a gridline is decided by
 * the spec, not by a layout default. Throws `FigureRuleError` otherwise.
 */
export function axesOf(spec: PracticeFigureSpec): FigureAxes {
  const p = spec.params;
  switch (spec.type as FigureKind) {
    case 'function_graph':
      return { x: explicitAxis(p, 'x', 'xRange', 'xStep', str(p.xLabel, 'x'), 12), y: explicitAxis(p, 'y', 'yRange', 'yStep', str(p.yLabel, 'y'), 14) };
    case 'slope_field':
      return { x: explicitAxis(p, 'x', 'xRange', 'xStep', str(p.xLabel, 'x'), 12), y: explicitAxis(p, 'y', 'yRange', 'yStep', str(p.yLabel, 'y'), 14) };
    case 'scatter_plot':
      return { x: explicitAxis(p, 'x', 'xRange', 'xStep', str(p.xLabel, '(no label)'), 12), y: explicitAxis(p, 'y', 'yRange', 'yStep', str(p.yLabel, '(no label)'), 14) };
    case 'motion_graph': {
      const q = str(p.quantity, 'position');
      const dflt = q === 'velocity' ? 'Velocity (m/s)' : q === 'acceleration' ? 'Acceleration (m/s²)' : 'Position (m)';
      return { x: explicitAxis(p, 'horizontal', 'tRange', 'tStep', str(p.tLabel, 'Time (s)'), 12), y: explicitAxis(p, 'vertical', 'yRange', 'yStep', str(p.yLabel, dflt), 14) };
    }
    case 'bar_chart': {
      if (!isNum(p.yMin) || !isNum(p.yMax) || !isNum(p.yStep) || !(p.yStep > 0) || !(p.yMax > p.yMin)) return fail('yMin, yMax and yStep must all be given for a bar chart (the value axis is never left to a default in this job)');
      return { y: checkedAxis({ min: p.yMin, max: p.yMax, step: p.yStep, minor: minorOf(p.yStep), label: str(p.yLabel, '(no label)'), numbered: true }, 'yMin / yMax / yStep', 14) };
    }
    case 'line_plot': {
      const values = p.values;
      if (!Array.isArray(values) || values.length === 0 || !values.every(isNum)) return fail('values must be a non-empty list of numbers');
      if (!isNum(p.step) || !(p.step > 0)) return fail('step must be given for a dot plot (the tick spacing of the number line)');
      const step = p.step;
      if (!(values as number[]).every((v) => isMultiple(v, step))) fail('every value of a dot plot must be a multiple of step, so each stack sits on a tick');
      const lo = Math.min(...(values as number[]));
      const hi = Math.max(...(values as number[]));
      let min = Math.floor(lo / step + 1e-9) * step;
      let max = Math.ceil(hi / step - 1e-9) * step;
      if (!(max > min)) {
        min -= step;
        max += step;
      }
      if ((max - min) / step > 20 + 1e-9) fail('the number line of a dot plot may have at most 20 intervals');
      // No grid between the ticks: the finest readable unit is the tick itself.
      return { x: { min, max, step, minor: step, label: str(p.xLabel, '(no label)'), numbered: true } };
    }
    case 'reaction_coordinate':
      return { y: reactionAxis(p) };
    case 'titration_curve': {
      if (!isNum(p.maxVolume) || !(p.maxVolume > 0)) return fail('maxVolume must be given for a titration curve (the right-hand end of the volume axis)');
      // render.ts leaves the volume step to the frame: the round step that gives at most 8 intervals.
      const step = niceStep(p.maxVolume, 8);
      if (!isMultiple(p.maxVolume, step)) fail(`maxVolume must be a multiple of ${fmt(step)} so the volume axis ends on a numbered gridline`);
      return {
        x: { min: 0, max: p.maxVolume, step, minor: minorOf(step), label: str(p.xLabel, 'Volume of titrant added (mL)'), numbered: true },
        y: { min: 0, max: 14, step: 2, minor: 1, label: 'pH', numbered: true },
      };
    }
    case 'free_body_diagram':
      return {};
    // Batch 1: each lays out its own grid or scale from its params (see `batch1Grid`);
    // none has an axis that could be left to a layout default.
    case 'unit_circle': case 'vector_diagram': case 'free_body_diagram_v2': case 'shaded_region':
    case 'number_line': case 'sign_chart': case 'distribution_curve': case 'histogram':
    case 'box_plot': case 'polar_complex': case 'punnett_square': case 'pedigree':
      return {};
    default:
      if (isBatch2Kind(spec.type)) return {};
      return fail(`unknown figure kind "${spec.type}" — one of ${ALL_PRACTICE_FIGURE_KINDS.join(', ')}`);
  }
}

/** A value as the eye reads it off an axis: exact on a gridline, otherwise
 *  only which two gridlines it lies between and roughly where. */
export function readOff(v: number, a: Axis | undefined, tol = 0): string {
  if (!Number.isFinite(v)) return 'no value';
  // A computed curve (a pH) that passes within a hair of a gridline is ON it to the eye.
  if (a && tol > 0 && Math.abs(v - Math.round(v / a.minor) * a.minor) <= tol) v = Math.round(v / a.minor) * a.minor;
  if (!a || !a.numbered) return 'cannot be read (the axis has no numbers)';
  if (v > a.max + 1e-9) return 'above the top of the plotted range';
  if (v < a.min - 1e-9) return 'below the bottom of the plotted range';
  if (isMultiple(v, a.minor)) return fmt(Math.round(v / a.minor) * a.minor);
  const lo = Math.floor(v / a.minor) * a.minor;
  const f = (v - lo) / a.minor;
  return `between ${fmt(lo)} and ${fmt(lo + a.minor)} (${f < 1 / 3 ? `nearer ${fmt(lo)}` : f > 2 / 3 ? `nearer ${fmt(lo + a.minor)}` : 'about midway'}; not on a gridline)`;
}

/** A drawn pH this close to a gridline cannot be told from it (well under a pixel at phone width). */
const PH_TOL = 0.03;

const axisLine = (name: string, a: Axis): string =>
  a.numbered
    ? `${name} axis: label "${a.label}"; runs from ${fmt(a.min)} to ${fmt(a.max)}; numbered gridlines every ${fmt(a.step)}${a.minor !== a.step ? `, lighter gridlines every ${fmt(a.minor)}` : ''}.`
    : `${name} axis: label "${a.label}"; NO numbers on it.`;

// ── per-kind readers shared by the transcription and the checkers ───────────

interface Curve {
  fn: (x: number) => number;
  from: number;
  to: number;
  label: string;
  dashed: boolean;
  fromMark?: string;
  toMark?: string;
}

function curvesOf(spec: PracticeFigureSpec, x: Axis): Curve[] {
  const raw = Array.isArray(spec.params.curves) ? spec.params.curves : [];
  return raw.map((c, i) => {
    if (!isObj(c)) return fail(`curves[${i}] must be an object`);
    let fn: (x: number) => number;
    try {
      fn = compileExpression(c.expr, ['x']);
    } catch (e) {
      return fail(`curves[${i}].expr: ${(e as Error).message}`);
    }
    const d = Array.isArray(c.domain) ? c.domain : [];
    return {
      fn,
      from: isNum(d[0]) ? Math.max(x.min, d[0]) : x.min,
      to: isNum(d[1]) ? Math.min(x.max, d[1]) : x.max,
      label: str(c.label),
      dashed: c.dashed === true,
      fromMark: isNum(d[0]) && (c.from === 'open' || c.from === 'closed') ? c.from : undefined,
      toMark: isNum(d[1]) && (c.to === 'open' || c.to === 'closed') ? c.to : undefined,
    };
  });
}

/** The value the PICTURE shows at x: the function value, or — where the
 *  expression is undefined at one point but the drawn line runs through —
 *  the common limit. NaN where the curve really breaks. */
function shownValue(c: Curve, x: number, span: number): number {
  const y = c.fn(x);
  if (Number.isFinite(y)) return y;
  const d = span * 1e-7;
  const l = c.fn(x - d);
  const r = c.fn(x + d);
  if (Number.isFinite(l) && Number.isFinite(r) && Math.abs(l - r) < 1e-4 * Math.max(1, Math.abs(l))) return (l + r) / 2;
  if (x - d < c.from && Number.isFinite(r)) return r;
  if (x + d > c.to && Number.isFinite(l)) return l;
  return NaN;
}

/** The drawn part of the curve is one straight line (which the eye sees at once). */
function isStraight(c: Curve, y: Axis): boolean {
  const a = c.fn(c.from + (c.to - c.from) * 1e-9);
  const b = c.fn(c.to - (c.to - c.from) * 1e-9);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  for (let k = 1; k < 200; k++) {
    const v = c.fn(c.from + ((c.to - c.from) * k) / 200);
    if (!Number.isFinite(v) || Math.abs(v - (a + ((b - a) * k) / 200)) > (y.max - y.min) * 1e-6) return false;
  }
  return true;
}

/** Interior peaks and troughs of the drawn part of a curve that lie inside the plot (at most 16). */
function turningPoints(c: Curve, y: Axis): Array<{ kind: 'peak' | 'trough'; x: number; y: number }> {
  const n = 2400;
  const h = (c.to - c.from) / n;
  const tiny = (y.max - y.min) * 1e-7;
  const out: Array<{ kind: 'peak' | 'trough'; x: number; y: number }> = [];
  let prev = 0; // direction of the last real change: 1 rising, -1 falling
  let flatFrom = NaN;
  for (let i = 1; i <= n; i++) {
    const x0 = c.from + (i - 1) * h;
    const a = c.fn(x0);
    const b = c.fn(x0 + h);
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(b - a) > (y.max - y.min) * 0.2) {
      prev = 0;
      flatFrom = NaN;
      continue;
    }
    const dir = b - a > tiny ? 1 : b - a < -tiny ? -1 : 0;
    if (dir === 0) {
      if (Number.isNaN(flatFrom)) flatFrom = x0;
      continue;
    }
    if (prev !== 0 && dir !== prev) {
      // Narrow down the turn between the last change of direction and here.
      let l = (Number.isNaN(flatFrom) ? x0 : flatFrom) - h;
      let r = x0 + h;
      for (let k = 0; k < 60; k++) {
        const m1 = l + (r - l) / 3;
        const m2 = r - (r - l) / 3;
        if (prev * c.fn(m1) < prev * c.fn(m2)) l = m1;
        else r = m2;
      }
      const tx = (l + r) / 2;
      const ty = c.fn(tx);
      if (Number.isFinite(ty) && ty >= y.min - 1e-9 && ty <= y.max + 1e-9 && out.length < 16) out.push({ kind: prev > 0 ? 'peak' : 'trough', x: tx, y: ty });
    }
    prev = dir;
    flatFrom = NaN;
  }
  return out;
}

interface Series {
  pts: Array<[number, number]>;
  label: string;
  dashed: boolean;
}

function seriesOf(spec: PracticeFigureSpec): Series[] {
  const p = spec.params;
  const raw = Array.isArray(p.series) ? p.series : [{ points: p.points }];
  return raw.map((s, i) => {
    if (!isObj(s) || !Array.isArray(s.points) || s.points.length < 2) return fail(`series[${i}].points must list at least two points`);
    const pts = s.points.map((q, j): [number, number] => {
      const t = Array.isArray(q) ? q[0] : isObj(q) ? q.t : undefined;
      const v = Array.isArray(q) ? q[1] : isObj(q) ? q.value : undefined;
      if (!isNum(t) || !isNum(v)) return fail(`series[${i}].points[${j}] must be [t, value]`);
      return [t, v];
    });
    pts.sort((a, b) => a[0] - b[0]);
    return { pts, label: str(s.label), dashed: s.dashed === true };
  });
}

/** Piecewise-linear value of a series at t (NaN outside its extent). */
export function seriesAt(pts: Array<[number, number]>, t: number): number {
  if (t < pts[0][0] - 1e-9 || t > pts[pts.length - 1][0] + 1e-9) return NaN;
  for (let i = 1; i < pts.length; i++) {
    const [t0, v0] = pts[i - 1];
    const [t1, v1] = pts[i];
    if (t <= t1 + 1e-9) return t1 === t0 ? v1 : v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return pts[pts.length - 1][1];
}

interface Dot {
  x: number;
  y: number;
  label: string;
  series: string;
  open: boolean;
}

function pointsOf(spec: PracticeFigureSpec): Dot[] {
  const raw = Array.isArray(spec.params.points) ? spec.params.points : [];
  return raw.map((q, i) => {
    const x = Array.isArray(q) ? q[0] : isObj(q) ? q.x : undefined;
    const y = Array.isArray(q) ? q[1] : isObj(q) ? q.y : undefined;
    if (!isNum(x) || !isNum(y)) return fail(`points[${i}] must have numeric x and y`);
    const o = isObj(q) ? q : {};
    return { x, y, label: str(o.label), series: str(o.series), open: o.open === true };
  });
}

function trendOf(spec: PracticeFigureSpec, pts: Dot[]): { slope: number; intercept: number } | null {
  const t = spec.params.trendLine;
  if (t === undefined || t === null || t === false) return null;
  if (isObj(t)) {
    if (!isNum(t.slope) || !isNum(t.intercept)) return fail('trendLine needs numeric slope and intercept');
    return { slope: t.slope, intercept: t.intercept };
  }
  const mx = pts.reduce((s, q) => s + q.x, 0) / pts.length;
  const my = pts.reduce((s, q) => s + q.y, 0) / pts.length;
  const sxx = pts.reduce((s, q) => s + (q.x - mx) ** 2, 0);
  if (!(sxx > 0)) return fail('trendLine: every point has the same x');
  const slope = pts.reduce((s, q) => s + (q.x - mx) * (q.y - my), 0) / sxx;
  return { slope, intercept: my - slope * mx };
}

interface Reaction {
  R: number;
  P: number;
  eas: number[];
  labels: string[];
  units: string;
}

function reactionOf(spec: PracticeFigureSpec): Reaction {
  const p = spec.params;
  return {
    R: isNum(p.reactantsEnergy) ? p.reactantsEnergy : 0,
    P: p.productsEnergy as number,
    eas: p.activationEnergies as number[],
    labels: Array.isArray(p.curveLabels) ? p.curveLabels.map((l) => str(l)) : [],
    units: str(p.units, 'kJ/mol'),
  };
}

type AnalyteType = 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base';
interface Titration {
  type: AnalyteType;
  vEq: number;
  ph: (v: number) => number;
  /** pH at half-equivalence for a weak analyte (pKa, or 14 − pKb). */
  halfPh?: number;
}

function titrationOf(spec: PracticeFigureSpec): Titration {
  const p = spec.params;
  const a = isObj(p.analyte) ? p.analyte : fail('analyte must be an object');
  const type = a.type as AnalyteType;
  if (!['strong_acid', 'weak_acid', 'strong_base', 'weak_base'].includes(type)) fail('analyte.type must be strong_acid, weak_acid, strong_base or weak_base');
  if (!isNum(a.concentration) || !isNum(a.volume) || !isNum(p.titrantConcentration)) return fail('analyte.concentration, analyte.volume and titrantConcentration must be numbers');
  let k = 0;
  let halfPh: number | undefined;
  if (type === 'weak_acid') {
    if (!isNum(a.pKa)) return fail('analyte.pKa is needed for a weak acid');
    k = 10 ** -a.pKa;
    halfPh = a.pKa;
  } else if (type === 'weak_base') {
    if (!isNum(a.pKb)) return fail('analyte.pKb is needed for a weak base');
    k = 1e-14 / 10 ** -a.pKb;
    halfPh = 14 - a.pKb;
  }
  const cA = a.concentration;
  const vA = a.volume;
  const cT = p.titrantConcentration;
  return { type, vEq: (cA * vA) / cT, ph: (v) => titrationPH(type, k, cA, vA, cT, v), halfPh };
}

interface Force {
  name: string;
  /** As printed ("20 N"), or '' when the arrow carries a name only. */
  magnitude: string;
  value?: number;
  unit?: string;
  direction: string | number;
}

const CARDINAL: Record<string, [number, number]> = { up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0] };

function forcesOf(spec: PracticeFigureSpec): { forces: Force[]; surface: string; angle: number } {
  const p = spec.params;
  const s = isObj(p.surface) ? p.surface : {};
  const surface = str(s.type, 'none');
  const raw = Array.isArray(p.forces) ? p.forces : fail('forces must be a list');
  const forces = raw.map((f, i): Force => {
    if (!isObj(f)) return fail(`forces[${i}] must be an object`);
    const magnitude = str(f.magnitude);
    const m = /^(-?\d+(?:\.\d+)?)\s*([^\d\s].*)?$/.exec(magnitude.replace(/−/g, '-'));
    return { name: str(f.name), magnitude, ...(m ? { value: Number(m[1]), unit: (m[2] ?? '').trim() } : {}), direction: typeof f.direction === 'number' ? f.direction : str(f.direction) };
  });
  return { forces, surface, angle: isNum(s.angle) ? s.angle : 0 };
}

/** Unit vector of a force when it lies along the horizontal or the vertical; null otherwise. */
function cardinalOf(f: Force, surface: string): [number, number] | null {
  if (typeof f.direction === 'number') {
    const a = ((f.direction % 360) + 360) % 360;
    return a === 0 ? CARDINAL.right : a === 90 ? CARDINAL.up : a === 180 ? CARDINAL.left : a === 270 ? CARDINAL.down : null;
  }
  const d = f.direction.toLowerCase();
  if (d in CARDINAL) return CARDINAL[d];
  if (surface !== 'inclined' && surface !== 'vertical') {
    if (d === 'normal') return CARDINAL.up;
    if (d === 'into-surface') return CARDINAL.down;
    if (d === 'up-slope') return CARDINAL.right;
    if (d === 'down-slope') return CARDINAL.left;
  }
  return null;
}

function directionWords(f: Force, surface: string): string {
  if (typeof f.direction === 'number') {
    const c = cardinalOf(f, surface);
    if (c) return `pointing straight ${Object.keys(CARDINAL).find((k) => CARDINAL[k] === c)}`;
    const a = ((f.direction % 360) + 360) % 360;
    const v = a < 180 ? 'up' : 'down';
    const h = a < 90 || a > 270 ? 'right' : 'left';
    return `pointing ${v} and to the ${h}, at an angle (the angle is NOT printed on the figure)`;
  }
  const d = f.direction.toLowerCase();
  if (d in CARDINAL) return `pointing straight ${d}`;
  if (surface === 'inclined') {
    if (d === 'normal') return 'pointing away from the incline, perpendicular to its surface';
    if (d === 'into-surface') return 'pointing into the incline, perpendicular to its surface';
    if (d === 'up-slope') return 'pointing up along the incline, parallel to its surface';
    if (d === 'down-slope') return 'pointing down along the incline, parallel to its surface';
  }
  const c = cardinalOf(f, surface);
  if (c) return `pointing straight ${Object.keys(CARDINAL).find((k) => CARDINAL[k] === c)}`;
  return `pointing ${d.replace('-', ' and to the ')} (diagonal; no angle is printed)`;
}

// ── 2. transcription ────────────────────────────────────────────────────────

const gridValues = (a: Axis, from = a.min, to = a.max): number[] => ticksBetween(Math.max(a.min, from), Math.min(a.max, to), a.minor);

/** Slope of a slope-field segment as the eye can tell it. */
function slopeWords(s: number): string {
  if (Number.isNaN(s)) return 'no segment';
  if (!Number.isFinite(s)) return 'vertical';
  if (Math.abs(s) > 4) return `very steep (${s > 0 ? 'rising' : 'falling'})`;
  return fmt(Math.round(s * 4) / 4);
}

/**
 * What the figure shows, as text: `printed` — every piece of text on the
 * picture; `readable` — what can be read off it, to the grid and no finer.
 * Built from the spec alone. An equation appears only when the spec asks the
 * renderer to print it.
 */
export function describeFigure(spec: PracticeFigureSpec): { printed: string[]; readable: string[]; text: string } {
  const p = spec.params;
  const ax = axesOf(spec);
  const printed: string[] = [];
  const out: string[] = [];
  const title = str(p.title);
  if (title) printed.push(`title: "${title}"`);
  const axes = () => {
    if (ax.x) out.push(axisLine(spec.type === 'motion_graph' || spec.type === 'titration_curve' || spec.type === 'line_plot' ? 'Horizontal' : 'x', ax.x));
    if (ax.y) out.push(axisLine(spec.type === 'function_graph' || spec.type === 'slope_field' || spec.type === 'scatter_plot' ? 'y' : 'Vertical', ax.y));
    for (const a of [ax.x, ax.y]) if (a && a.label !== '(no label)') printed.push(`axis label: "${a.label}"`);
  };
  let kind = '';
  switch (spec.type as FigureKind) {
    case 'function_graph': {
      const x = ax.x!;
      const y = ax.y!;
      kind = 'a graph of curves on a coordinate grid';
      axes();
      const span = x.max - x.min;
      curvesOf(spec, x).forEach((c, i) => {
        if (c.label) printed.push(`legend entry: "${c.label}" (curve ${i + 1})`);
        out.push(`Curve ${i + 1}${c.label ? ` (legend "${c.label}")` : ''}, drawn as a ${c.dashed ? 'dashed' : 'solid'} line from x = ${readOff(c.from, x)} to x = ${readOff(c.to, x)}${isStraight(c, y) ? '. It is a STRAIGHT line' : ''}. Its height at each vertical gridline:`);
        for (const gx of gridValues(x, c.from, c.to)) {
          const v = shownValue(c, gx, span);
          out.push(`  x = ${fmt(gx)}: ${Number.isFinite(v) ? `y = ${readOff(v, y)}` : 'the curve breaks here (it leaves the plot on at least one side)'}`);
        }
        // Peaks and troughs are plain to the eye wherever they fall: their height
        // is read against the horizontal gridlines, their position only as well as the grid allows.
        const turns = turningPoints(c, y);
        if (turns.length) out.push('  Turning points of the curve, left to right:');
        for (const tp of turns) out.push(`  ${tp.kind} at x = ${readOff(tp.x, x, span * 1e-4)}, y = ${readOff(tp.y, y, (y.max - y.min) * 1e-4)}`);
        for (const [at, mark] of [[c.from, c.fromMark], [c.to, c.toMark]] as Array<[number, string | undefined]>) {
          if (mark) out.push(`  At its end x = ${readOff(at, x)} the curve carries ${mark === 'open' ? 'an OPEN circle (the point is not included)' : 'a FILLED dot (the point is included)'} at y = ${readOff(shownValue(c, at, span), y)}.`);
        }
      });
      pointsOf(spec).forEach((d) => {
        if (d.label) printed.push(`point label: "${d.label}"`);
        out.push(`Marked point${d.label ? ` labelled "${d.label}"` : ''}: ${d.open ? 'an open circle' : 'a filled dot'} at (${readOff(d.x, x)}, ${readOff(d.y, y)}).`);
      });
      for (const a of Array.isArray(p.asymptotes) ? p.asymptotes : []) {
        if (!isObj(a)) continue;
        const label = str(a.label);
        if (label) printed.push(`guide-line label: "${label}"`);
        if (isNum(a.x)) out.push(`Dashed vertical guide line at x = ${readOff(a.x, x)}${label ? ` labelled "${label}"` : ''}.`);
        else if (isNum(a.y)) out.push(`Dashed horizontal guide line at y = ${readOff(a.y, y)}${label ? ` labelled "${label}"` : ''}.`);
      }
      break;
    }
    case 'motion_graph': {
      const x = ax.x!;
      const y = ax.y!;
      const smooth = p.interpolation === 'smooth';
      kind = `a ${smooth ? 'smooth-curve' : 'straight-segment'} graph of one quantity against another`;
      axes();
      seriesOf(spec).forEach((s, i) => {
        if (s.label) printed.push(`legend entry: "${s.label}" (line ${i + 1})`);
        const head = `Line ${i + 1}${s.label ? ` (legend "${s.label}")` : ''}, ${s.dashed ? 'dashed' : 'solid'}`;
        if (smooth) {
          out.push(`${head}: a smooth curve that passes through these points, in order:`);
          for (const [t, v] of s.pts) out.push(`  (${readOff(t, x)}, ${readOff(v, y)})`);
        } else {
          out.push(`${head}: straight segments joined at these corner points, in order${p.showPoints === true ? ' (each marked with a dot)' : ''}:`);
          for (const [t, v] of s.pts) out.push(`  (${readOff(t, x)}, ${readOff(v, y)})`);
          out.push('  Its height at each vertical gridline:');
          for (const g of gridValues(x, s.pts[0][0], s.pts[s.pts.length - 1][0])) out.push(`  at ${fmt(g)}: ${readOff(seriesAt(s.pts, g), y)}`);
        }
      });
      break;
    }
    case 'bar_chart': {
      const y = ax.y!;
      kind = 'a bar chart';
      const xLabel = str(p.xLabel);
      if (xLabel) printed.push(`axis label: "${xLabel}"`);
      axes();
      const cats = (Array.isArray(p.categories) ? p.categories : []).map((c) => str(c));
      const values = (Array.isArray(p.values) ? p.values : []) as number[];
      if (cats.length === 0 || cats.length !== values.length || !values.every(isNum)) fail('categories and values must be lists of the same length');
      printed.push(`bar names under the bars: ${cats.map((c) => `"${c}"`).join(', ')}`);
      if (p.showValues === true) printed.push(`the value of each bar is printed above it: ${cats.map((c, i) => `${c} ${fmt(values[i])}`).join(', ')}`);
      out.push('Bars, left to right, with the height of each read against the vertical axis:');
      cats.forEach((c, i) => out.push(`  ${c}: ${readOff(values[i], y)}`));
      break;
    }
    case 'line_plot': {
      const x = ax.x!;
      kind = 'a dot plot (dots stacked above a number line)';
      axes();
      const values = p.values as number[];
      out.push(`Number of dots stacked above each tick (${values.length} dots in all):`);
      for (const t of ticksBetween(x.min, x.max, x.step)) out.push(`  ${fmt(t)}: ${values.filter((v) => Math.abs(v - t) < x.step * 1e-6).length}`);
      break;
    }
    case 'scatter_plot': {
      const x = ax.x!;
      const y = ax.y!;
      kind = 'a scatter plot';
      axes();
      const pts = pointsOf(spec);
      if (pts.length === 0) fail('points must list at least one point');
      const names = [...new Set(pts.map((q) => q.series).filter(Boolean))];
      names.forEach((n) => printed.push(`legend entry: "${n}" (a group of dots of one colour)`));
      out.push(`${pts.length} dots:`);
      pts.forEach((q) => {
        if (q.label) printed.push(`point label: "${q.label}"`);
        out.push(`  (${readOff(q.x, x)}, ${readOff(q.y, y)})${q.label ? ` labelled "${q.label}"` : ''}${q.series ? ` — group "${q.series}"` : ''}`);
      });
      const t = trendOf(spec, pts);
      if (t) {
        out.push('A straight line is drawn across the whole plot. Its height at each numbered vertical gridline:');
        for (const g of ticksBetween(x.min, x.max, x.step)) out.push(`  x = ${fmt(g)}: y = ${readOff(t.slope * g + t.intercept, y)}`);
        if (p.showEquation === true) {
          const sig = (v: number) => Number(v.toPrecision(3));
          const b = sig(t.intercept);
          printed.push(`legend entry with the line's equation: "y = ${sig(t.slope)}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}"`);
        }
      }
      break;
    }
    case 'reaction_coordinate': {
      const y = ax.y!;
      const r = reactionOf(spec);
      kind = 'an energy profile of a reaction (energy against reaction progress)';
      out.push('Horizontal axis: label "Reaction progress →"; NO numbers on it.');
      out.push(axisLine('Vertical', { ...y, label: y.numbered ? y.label : 'Energy' }));
      printed.push('axis label: "Reaction progress →"', `axis label: "${y.numbered ? y.label : 'Energy'}"`);
      const reactantLabel = str(p.reactantLabel, 'Reactants');
      const productLabel = str(p.productLabel, 'Products');
      printed.push(`level name: "${reactantLabel}" (under the left-hand flat level)`, `level name: "${productLabel}" (at the right-hand flat level)`);
      const annotate = Array.isArray(p.annotate) ? p.annotate : [];
      r.eas.forEach((ea, i) => {
        if (r.labels[i]) printed.push(`legend entry: "${r.labels[i]}" (curve ${i + 1})`);
        out.push(
          y.numbered
            ? `Curve ${i + 1}${r.labels[i] ? ` (legend "${r.labels[i]}")` : ''}: starts on a flat level at energy ${readOff(r.R, y)} (named "${reactantLabel}"), rises to one peak at energy ${readOff(r.R + ea, y)}, then falls to a flat level at energy ${readOff(r.P, y)} (named "${productLabel}").`
            : `Curve ${i + 1}${r.labels[i] ? ` (legend "${r.labels[i]}")` : ''}: starts on a flat level (named "${reactantLabel}"), rises to one peak, then falls to a flat level (named "${productLabel}") that is ${r.P < r.R ? 'LOWER than' : r.P > r.R ? 'HIGHER than' : 'level with'} the starting level.`,
        );
      });
      if (r.eas.length > 1) out.push(`Peak heights, highest first: ${r.eas.map((ea, i) => ({ ea, i })).sort((a, b) => b.ea - a.ea).map((e) => `curve ${e.i + 1}`).join(', ')}.`);
      if (annotate.includes('Ea')) {
        printed.push(`arrow label "Ea"${r.eas.length > 1 ? ' on each curve, numbered (1), (2) …' : ''}`);
        out.push('A double-headed arrow labelled Ea runs from the starting level up to the peak (one per curve).');
      }
      if (annotate.includes('deltaH') && r.P !== r.R) {
        printed.push('arrow label "ΔH"');
        out.push('An arrow labelled ΔH runs from the starting level to the final level, at the right-hand side.');
      }
      if (p.annotateValues === true) {
        if (annotate.includes('Ea')) r.eas.forEach((ea, i) => printed.push(`caption under the plot: "Ea${r.eas.length > 1 ? ` (${i + 1})` : ''} = ${fmt(ea)} ${r.units}"`));
        if (annotate.includes('deltaH') && r.P !== r.R) printed.push(`caption under the plot: "ΔH = ${r.P > r.R ? '+' : '-'}${fmt(Math.abs(r.P - r.R))} ${r.units}"`);
      }
      break;
    }
    case 'titration_curve': {
      const x = ax.x!;
      const y = ax.y!;
      const t = titrationOf(spec);
      kind = 'a titration curve (pH against volume of titrant added)';
      axes();
      // Readings at every gridline while they are few; otherwise at the numbered ones (and at half the jump volume when it is on the grid).
      const fine = gridValues(x);
      const at = fine.length <= 21 ? fine : [...new Set([...ticksBetween(x.min, x.max, x.step), ...(t.vEq < x.max && onGrid(t.vEq / 2, x) ? [t.vEq / 2] : [])])].sort((p1, p2) => p1 - p2);
      out.push(`One smooth curve. Its height at ${fine.length <= 21 ? 'each vertical gridline' : 'the numbered vertical gridlines'}:`);
      for (const g of at) out.push(`  volume ${fmt(g)}: pH ${readOff(t.ph(g), y, PH_TOL)}`);
      if (t.vEq < x.max) out.push(`The curve has ONE near-vertical section, at volume ${readOff(t.vEq, x)}; the middle of that section is at pH ${readOff(t.ph(t.vEq), y, PH_TOL)}. Before it the curve ${t.type.endsWith('acid') ? 'rises' : 'falls'} gently, after it the curve levels off.`);
      else out.push('The curve has no near-vertical section inside the plotted range.');
      const marks = Array.isArray(p.mark) ? p.mark : [];
      if (marks.includes('half_equivalence')) {
        printed.push('legend entry: "half-equivalence point" (a coloured dot)');
        out.push(`A dot (legend "half-equivalence point") at volume ${readOff(t.vEq / 2, x)}, pH ${readOff(t.ph(t.vEq / 2), y, PH_TOL)}, with dashed guide lines to both axes.`);
      }
      if (marks.includes('equivalence')) {
        printed.push('legend entry: "equivalence point" (a coloured dot)');
        out.push(`A dot (legend "equivalence point") at volume ${readOff(t.vEq, x)}, pH ${readOff(t.ph(t.vEq), y, PH_TOL)}, with dashed guide lines to both axes.`);
      }
      break;
    }
    case 'slope_field': {
      const x = ax.x!;
      const y = ax.y!;
      kind = 'a slope field (short line segments on a coordinate grid)';
      axes();
      const lat = latticeOf(spec, x, y);
      if (p.showExpression === true) printed.push(`legend entry with the equation: "dy/dx = ${str(p.expr)}"`);
      out.push(`A short line segment is drawn at every point with x a multiple of ${fmt(lat.gx)} and y a multiple of ${fmt(lat.gy)}. Slope of each segment (as it looks; rows from the top of the plot down):`);
      for (const gy of [...lat.ys].reverse()) out.push(`  y = ${fmt(gy)}: ${lat.xs.map((gx) => `x=${fmt(gx)}: ${slopeWords(lat.slope(gx, gy))}`).join('; ')}`);
      const through = p.solutionThrough;
      if (Array.isArray(through) && isNum(through[0]) && isNum(through[1]) && str(p.expr)) {
        const curve = slopeFieldSolution(str(p.expr), [through[0], through[1]], [x.min, x.max], [y.min, y.max]);
        out.push(`One solution curve is drawn through a marked dot at (${readOff(through[0], x)}, ${readOff(through[1], y)}). Its height at each vertical gridline it reaches:`);
        for (const g of gridValues(x, curve[0][0], curve[curve.length - 1][0])) out.push(`  x = ${fmt(g)}: y = ${readOff(seriesAt(curve, g), y)}`);
      }
      break;
    }
    case 'free_body_diagram': {
      const { forces, surface, angle } = forcesOf(spec);
      const o = isObj(p.object) ? p.object : {};
      kind = 'a free-body diagram (one object with force arrows)';
      const caption = str(o.mass) || str(o.label);
      if (caption) printed.push(`caption on the object: "${caption}"`);
      out.push(`The object is drawn as a ${str(o.shape, 'box')}${caption ? ` with the caption "${caption}"` : ''}.`);
      if (surface === 'inclined') {
        printed.push(`angle label at the foot of the incline: "θ = ${fmt(angle)}°"`);
        out.push(`It sits on an incline that rises to the right; the incline's angle to the horizontal is marked θ = ${fmt(angle)}°.`);
      } else if (surface === 'horizontal') out.push('It sits on a horizontal surface.');
      else if (surface === 'vertical') out.push('It is against a vertical surface.');
      else out.push('No surface is drawn.');
      if (isObj(p.surface) && p.surface.friction === true) printed.push('surface label: "μ (friction)"');
      out.push('Force arrows on the object (arrow LENGTHS are not to scale; only the printed labels give sizes):');
      for (const f of forces) {
        const label = f.magnitude && f.magnitude !== f.name ? `${f.name} = ${f.magnitude}` : f.name;
        printed.push(`arrow label: "${label}"`);
        out.push(`  arrow labelled "${label}", ${directionWords(f, surface)}`);
      }
      break;
    }
    default: {
      const k = describeBatch1(spec, printed, out) || viaBatch2(() => describeBatch2(spec, printed, out));
      if (!k) fail(`unknown figure kind "${spec.type}"`);
      kind = k;
    }
  }
  const text = [`The figure is ${kind}.`, '', 'TEXT PRINTED ON THE FIGURE:', ...(printed.length ? printed.map((l) => `- ${l}`) : ['- (none besides the numbers along the axes)']), '', 'WHAT CAN BE READ OFF THE FIGURE:', ...out].join('\n');
  return { printed, readable: out, text };
}

interface Lattice {
  gx: number;
  gy: number;
  xs: number[];
  ys: number[];
  slope: (x: number, y: number) => number;
}

function latticeOf(spec: PracticeFigureSpec, x: Axis, y: Axis): Lattice {
  const p = spec.params;
  const g = p.gridStep;
  const gx = Array.isArray(g) ? g[0] : g;
  const gy = Array.isArray(g) ? g[1] : g;
  if (!isNum(gx) || !isNum(gy) || !(gx > 0) || !(gy > 0)) return fail('gridStep must be given for a slope field (the spacing of the segments)');
  if (!str(p.expr)) return fail('a slope field in this job is given by expr (dy/dx in x and y), not by samples');
  let f: (x: number, y: number) => number;
  try {
    f = compileExpression(p.expr, ['x', 'y']);
  } catch (e) {
    return fail(`expr: ${(e as Error).message}`);
  }
  const xs = ticksBetween(x.min, x.max, gx);
  const ys = ticksBetween(y.min, y.max, gy);
  if (xs.length * ys.length > 225) fail(`the slope field has ${xs.length} × ${ys.length} segments — at most 225 are legible at phone width; use a larger gridStep`);
  return { gx, gy, xs, ys, slope: f };
}

// ── 2b. figure hygiene: what the job puts right itself, and what it can tell is unreadable ──

/** Kinds (or cases) whose drawing was judged not good enough yet; nothing is generated for them. */
export const RENDERER_NEEDS_WORK: Record<string, string> = {
  slope_field: 'segments on the plot border are cut off and those on the axes are hidden under the axis lines',
};
export const FBD_MAX_FORCES = 3;

function mentionsLabel(text: string, label: string): boolean {
  const escaped = label.replace(/[-.*+?^$()|[\]{}\\]/g, (ch) => '\\' + ch);
  return new RegExp('(?<![A-Za-z0-9])' + escaped + '(?![A-Za-z0-9])').test(text);
}

/**
 * The spec as it is stored and drawn — put right where that needs no judgement:
 *  - pieces of ONE function (curves sharing a label) get one colour and one legend entry;
 *  - a legend for a single curve / line / pathway is dropped unless the question
 *    (text or options) refers to it by that label;
 *  - a marked point, a corner, a turning point or a dot that would sit on the
 *    top or bottom edge of the plot (or, for dots, on a side edge other than
 *    zero) gets one more step of range on that side.
 * Anything else is left for the rule checks to refuse. Never throws.
 */
export function normaliseSpec(spec: PracticeFigureSpec, questionText: string): PracticeFigureSpec {
  let p: P;
  try {
    p = JSON.parse(JSON.stringify(spec.params)) as P;
  } catch {
    return spec;
  }
  const out: PracticeFigureSpec = { type: spec.type, params: p };
  const curves = Array.isArray(p.curves) ? p.curves.filter(isObj) : [];
  const series = Array.isArray(p.series) ? p.series.filter(isObj) : [];
  if (spec.type === 'function_graph') {
    const groups = new Map<string, P[]>();
    for (const c of curves) if (str(c.label)) groups.set(str(c.label), [...(groups.get(str(c.label)) ?? []), c]);
    let g = 0;
    for (const list of groups.values()) {
      if (list.length > 1) list.forEach((c, i) => {
        c.color = SERIES_COLORS[g % SERIES_COLORS.length];
        if (i > 0) delete c.label;
      });
      g++;
    }
    const labelled = curves.filter((c) => str(c.label));
    if (groups.size === 1 && labelled.length === 1 && curves.every((c) => c === labelled[0] || c.color === labelled[0].color) && !mentionsLabel(questionText, str(labelled[0].label))) delete labelled[0].label;
  }
  if (spec.type === 'motion_graph' && series.length === 1 && str(series[0].label) && !mentionsLabel(questionText, str(series[0].label))) delete series[0].label;
  if (spec.type === 'reaction_coordinate' && Array.isArray(p.curveLabels) && p.curveLabels.length === 1 && !mentionsLabel(questionText, str(p.curveLabels[0]))) delete p.curveLabels;

  // One more step of range where a feature would sit on the edge of the plot.
  const widen = (rangeKey: string, stepKey: string, values: number[], skipZero: boolean): void => {
    const r = p[rangeKey];
    const step = p[stepKey];
    if (!Array.isArray(r) || !isNum(r[0]) || !isNum(r[1]) || !isNum(step)) return;
    const at = (edge: number) => values.some((v) => Math.abs(v - edge) < 1e-9) && !(skipZero && Math.abs(edge) < 1e-9);
    const lo = at(r[0]) ? r[0] - step : r[0];
    const hi = at(r[1]) ? r[1] + step : r[1];
    p[rangeKey] = [Number(lo.toPrecision(12)), Number(hi.toPrecision(12))];
  };
  try {
    if (spec.type === 'function_graph') {
      const ax = axesOf(out);
      const pts = pointsOf(out);
      const ys = [...pts.map((d) => d.y)];
      for (const c of curvesOf(out, ax.x!)) {
        ys.push(...turningPoints(c, ax.y!).map((t) => t.y));
        if (c.from > ax.x!.min) ys.push(shownValue(c, c.from, ax.x!.max - ax.x!.min));
        if (c.to < ax.x!.max) ys.push(shownValue(c, c.to, ax.x!.max - ax.x!.min));
      }
      widen('yRange', 'yStep', ys.filter(Number.isFinite), false);
      widen('xRange', 'xStep', pts.map((d) => d.x), true);
    } else if (spec.type === 'motion_graph') {
      widen('yRange', 'yStep', seriesOf(out).flatMap((s) => s.pts.map((q) => q[1])), true);
    } else if (spec.type === 'scatter_plot') {
      const pts = pointsOf(out);
      widen('yRange', 'yStep', pts.map((d) => d.y), true);
      widen('xRange', 'xStep', pts.map((d) => d.x), true);
    }
  } catch {
    /* a spec the rule checks will refuse — leave it as written */
  }
  return out;
}

/** Legend entries that would appear twice, and drawings the job does not make for now. */
export function hygieneDefects(spec: PracticeFigureSpec): string[] {
  const p = spec.params;
  const d: string[] = [];
  if (RENDERER_NEEDS_WORK[spec.type]) d.push(`figures of kind ${spec.type} are not generated for now (${RENDERER_NEEDS_WORK[spec.type]})`);
  if (spec.type === 'free_body_diagram' && Array.isArray(p.forces) && p.forces.length > FBD_MAX_FORCES) d.push(`a free-body diagram may carry at most ${FBD_MAX_FORCES} forces — with more, the labels drift away from their arrows`);
  const labels = [
    ...(Array.isArray(p.curves) ? p.curves : []), ...(Array.isArray(p.series) ? p.series : []),
  ].map((c) => (isObj(c) ? str(c.label) : '')).concat((Array.isArray(p.curveLabels) ? p.curveLabels : []).map((l) => str(l))).filter(Boolean);
  const twice = labels.filter((l, i) => labels.indexOf(l) !== i);
  if (twice.length) d.push(`the legend would show "${twice[0]}" twice — every curve needs its own name`);
  return d;
}

/**
 * The features a reader would have to read that do NOT sit on the grid: marked
 * points, dots, corners of straight-segment lines, bar heights, energy levels,
 * the jump of a titration curve, the ends and the turning-point heights of a
 * curve. For an item whose key no checker recomputes, any of these means the
 * answer may need an estimate between gridlines.
 */
export function unreadableFeatures(spec: PracticeFigureSpec): string[] {
  const ax = axesOf(spec);
  const out: string[] = [];
  const need = (v: number, a: Axis | undefined, what: string) => {
    if (a && a.numbered && Number.isFinite(v) && v >= a.min - 1e-9 && v <= a.max + 1e-9 && !onGrid(Number(v.toPrecision(9)), a)) out.push(`${what} (${fmt(Number(v.toPrecision(6)))})`);
  };
  switch (spec.type as FigureKind) {
    case 'function_graph': {
      pointsOf(spec).forEach((d, i) => {
        need(d.x, ax.x, `x of marked point ${d.label || i + 1}`);
        need(d.y, ax.y, `y of marked point ${d.label || i + 1}`);
      });
      curvesOf(spec, ax.x!).forEach((c, i) => {
        for (const t of turningPoints(c, ax.y!)) need(Math.abs(t.y - Math.round(t.y / ax.y!.minor) * ax.y!.minor) < (ax.y!.max - ax.y!.min) * 1e-5 ? Math.round(t.y / ax.y!.minor) * ax.y!.minor : t.y, ax.y, `height of a turning point of curve ${i + 1}`);
        const span = ax.x!.max - ax.x!.min;
        if (c.from > ax.x!.min) { need(c.from, ax.x, `left end of curve ${i + 1}`); need(shownValue(c, c.from, span), ax.y, `height at the left end of curve ${i + 1}`); }
        if (c.to < ax.x!.max) { need(c.to, ax.x, `right end of curve ${i + 1}`); need(shownValue(c, c.to, span), ax.y, `height at the right end of curve ${i + 1}`); }
      });
      break;
    }
    case 'motion_graph':
      seriesOf(spec).forEach((s, i) => s.pts.forEach(([t, v]) => { need(t, ax.x, `a corner of line ${i + 1}`); need(v, ax.y, `a corner of line ${i + 1}`); }));
      break;
    case 'scatter_plot':
      pointsOf(spec).forEach((d, i) => { need(d.x, ax.x, `x of dot ${d.label || i + 1}`); need(d.y, ax.y, `y of dot ${d.label || i + 1}`); });
      break;
    case 'bar_chart':
      ((Array.isArray(spec.params.values) ? spec.params.values : []) as number[]).forEach((v, i) => need(v, ax.y, `height of bar ${i + 1}`));
      break;
    case 'reaction_coordinate': {
      const r = reactionOf(spec);
      need(r.R, ax.y, 'the reactant level'); need(r.P, ax.y, 'the product level');
      r.eas.forEach((ea, i) => need(r.R + ea, ax.y, `the peak of curve ${i + 1}`));
      break;
    }
    case 'titration_curve': need(titrationOf(spec).vEq, ax.x, 'the volume of the near-vertical section'); break;
    default: break;
  }
  return out;
}

/** A stem that describes the picture — its shape, or the feature the answer rests on — instead of only asking. */
const RESTATES_FIGURE_RE = new RegExp([
  String.raw`\b(?:forming|forms|shaped\s+like|in\s+the\s+shape\s+of|appearing\s+to|appears\s+to|looks\s+like)\b`,
  String.raw`\b(?:becomes?|becoming|gets?|getting)\s+(?:steeper|flatter|vertical|horizontal|negative|positive|larger|smaller)\b`,
  String.raw`\b(?:is|are|as)\s+(?:a\s+)?(?:straight\s+line|linear|flat|horizontal|vertical|constant|symmetric|steepest)\b`,
  String.raw`\b(?:rising|falling|increasing|decreasing|flat),?\s+(?:and\s+)?then\b|\bthen\s+(?:flat|falling|rising|levels?)\b`,
  String.raw`\bsharp\s+(?:point|corner|turn|peak)\b|\bsteeper\s+and\s+steeper\b|\blevels?\s+off\b|\bnearly\s+vertical\b`,
  String.raw`\boscillat\w+\s+(?:evenly|about|around|above|between)\b|\bcent(?:er|re)d\s+on\b|\b(?:stays?|staying|remains?|remaining)\s+(?:above|below|constant|flat)\b`,
  String.raw`\bmade\s+of\s+\w+\s+straight\b|\bjoined\s+at\b|\bmeet(?:s|ing)?\s+at\s+a\b|\bwhere\s+the\s+curve\s+(?:rises|falls|is)\b`,
].join('|'), 'i');

export const restatesFigure = (stem: string): boolean => RESTATES_FIGURE_RE.test(stem ?? '');

// ── 3. deterministic checkers ───────────────────────────────────────────────

export type Derived =
  /** `approx`: an irrational or rounded value — a key matches when it is this value rounded to the key's own decimals (at least one). */
  | { kind: 'number'; value: number; approx?: boolean }
  | { kind: 'numbers'; values: number[] }
  | { kind: 'label'; value: string }
  /** An exact written form — "(−√3/2, 1/2)", "(−3, 4]", "1 + 5i", "1:2:1", "Aa": compared as text, signs and brackets included. */
  | { kind: 'text'; value: string };

export const derivedText = (d: Derived): string => (d.kind === 'number' ? `${fmt(d.approx ? Number(d.value.toPrecision(6)) : d.value)}${d.approx ? ' (rounded)' : ''}` : d.kind === 'numbers' ? `{${d.values.map(fmt).join(', ')}}` : d.value);

interface CheckerDef {
  kinds: FigureKind[];
  /** Argument list, as shown to the writer. */
  args: string;
  /** What it returns, as shown to the writer. */
  returns: string;
  run: (spec: PracticeFigureSpec, args: P, ax: FigureAxes) => Derived;
}

const num = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)) });

function argNum(a: P, k: string): number {
  const v = a[k];
  if (!isNum(v)) return fail(`derivation argument "${k}" must be a number`);
  return v;
}
function argIndex(a: P, k: string, n: number, what: string): number {
  const v = a[k] === undefined ? 0 : a[k];
  if (!isNum(v) || !Number.isInteger(v) || v < 0 || v >= n) return fail(`derivation argument "${k}" must be the 0-based index of a ${what} (0 to ${n - 1})`);
  return v;
}
function mustBeOnGrid(v: number, a: Axis | undefined, what: string): number {
  if (!a || !onGrid(v, a)) fail(`${what} = ${Number.isFinite(v) ? fmt(v) : 'undefined'} does not lie on a gridline of the figure, so it cannot be read off exactly`);
  return v;
}
const pick = <T extends string>(a: P, k: string, allowed: readonly T[]): T => {
  const v = a[k];
  if (typeof v !== 'string' || !allowed.includes(v as T)) return fail(`derivation argument "${k}" must be one of ${allowed.join(' | ')}`);
  return v as T;
};

/** From a list of x-values: the only one, the least, the greatest, how many, or all. */
function select(xs: number[], want: string, what: string): Derived {
  const s = [...xs].sort((a, b) => a - b);
  if (want === 'count') return num(s.length);
  if (s.length === 0) return fail(`the figure shows no ${what}`);
  if (want === 'all') return s.length === 1 ? num(s[0]) : { kind: 'numbers', values: s };
  if (want === 'least') return num(s[0]);
  if (want === 'greatest') return num(s[s.length - 1]);
  if (s.length !== 1) return fail(`the figure shows ${s.length} ${what}, not exactly one`);
  return num(s[0]);
}
const WANT = ['only', 'least', 'greatest', 'count', 'all'] as const;

/** Zeros of g on [from, to] that the grid shows: every sign change must
 *  happen AT a vertical gridline, otherwise the zero cannot be read. */
function gridZeros(g: (x: number) => number, x: Axis, from: number, to: number, what: string): number[] {
  const xs = gridValues(x, from, to);
  const scale = 1e-9;
  const zeros = xs.filter((v) => Math.abs(g(v)) < scale);
  // Between neighbouring gridlines (and the stubs to the ends of the domain)
  // the curve must not cross: a crossing there cannot be read off.
  const offGrid = (a: number, b: number): never => fail(`${what} between x = ${fmt(a)} and x = ${fmt(b)} does not fall on a gridline, so it cannot be read off exactly`);
  const edges = [from, ...xs, to];
  for (let i = 1; i < edges.length; i++) {
    const a = edges[i - 1];
    const b = edges[i];
    if (!(b > a)) continue;
    let prevX = NaN;
    let prevV = 0;
    for (let k = 1; k < 40; k++) {
      const x = a + ((b - a) * k) / 40;
      const v = g(x);
      if (!Number.isFinite(v)) {
        prevV = 0;
        continue;
      }
      if (Math.abs(v) < scale) offGrid(a, b);
      if (prevV !== 0 && Math.sign(v) !== Math.sign(prevV)) {
        // A sign change is a zero only when the values shrink towards it (not across a pole).
        let l = prevX;
        let r = x;
        for (let n = 0; n < 60; n++) {
          const m = (l + r) / 2;
          const vm = g(m);
          if (!Number.isFinite(vm)) break;
          if (Math.sign(vm) === Math.sign(prevV)) l = m;
          else r = m;
        }
        if (Math.abs(g(l)) < 1e-6 || Math.abs(g(r)) < 1e-6) offGrid(a, b);
      }
      prevX = x;
      prevV = v;
    }
  }
  return zeros;
}

function curveArg(spec: PracticeFigureSpec, a: P, ax: FigureAxes, k = 'curve'): Curve {
  const cs = curvesOf(spec, ax.x!);
  if (cs.length === 0) fail('the figure has no curve');
  return cs[argIndex(a, k, cs.length, 'curve')];
}
function seriesArg(spec: PracticeFigureSpec, a: P): Series {
  if (spec.params.interpolation === 'smooth') fail('this checker reads straight segments; the figure uses smooth interpolation');
  const ss = seriesOf(spec);
  return ss[argIndex(a, 'series', ss.length, 'line')];
}
function seriesValueOnGrid(s: Series, t: number, ax: FigureAxes): number {
  mustBeOnGrid(t, ax.x, 'the horizontal position');
  const v = seriesAt(s.pts, t);
  if (!Number.isFinite(v)) fail(`the line does not reach ${fmt(t)} on the horizontal axis`);
  return mustBeOnGrid(v, ax.y, `the height of the line at ${fmt(t)}`);
}
function curveValueOnGrid(c: Curve, x: number, ax: FigureAxes): number {
  mustBeOnGrid(x, ax.x, 'x');
  if (x < c.from - 1e-9 || x > c.to + 1e-9) fail(`x = ${fmt(x)} is outside the part of the curve that is drawn`);
  return mustBeOnGrid(shownValue(c, x, ax.x!.max - ax.x!.min), ax.y, `the height of the curve at x = ${fmt(x)}`);
}
function dotArg(spec: PracticeFigureSpec, a: P, k: string): Dot {
  const pts = pointsOf(spec);
  const v = a[k];
  if (typeof v === 'string') {
    const hit = pts.filter((q) => q.label === v.trim());
    if (hit.length !== 1) return fail(`derivation argument "${k}": no single marked point is labelled "${v}"`);
    return hit[0];
  }
  if (pts.length === 0) fail('the figure has no marked point');
  return pts[argIndex(a, k, pts.length, 'marked point')];
}
function dotOnGrid(d: Dot, ax: FigureAxes): Dot {
  mustBeOnGrid(d.x, ax.x, 'the x-coordinate of the point');
  mustBeOnGrid(d.y, ax.y, 'the y-coordinate of the point');
  return d;
}
function barsOf(spec: PracticeFigureSpec, ax: FigureAxes): Array<{ name: string; value: number }> {
  const cats = (Array.isArray(spec.params.categories) ? spec.params.categories : []).map((c) => str(c));
  const values = (Array.isArray(spec.params.values) ? spec.params.values : []) as number[];
  if (cats.length === 0 || cats.length !== values.length) fail('categories and values must be lists of the same length');
  return cats.map((name, i) => ({ name, value: mustBeOnGrid(values[i], ax.y, `the height of the bar "${name}"`) }));
}
function barArg(bars: Array<{ name: string; value: number }>, a: P, k: string): { name: string; value: number } {
  const v = a[k];
  const hit = typeof v === 'string' ? bars.filter((b) => b.name === v.trim()) : isNum(v) && bars[v] ? [bars[v]] : [];
  if (hit.length !== 1) return fail(`derivation argument "${k}" must be the name (or 0-based index) of exactly one bar`);
  return hit[0];
}
function reactionOnGrid(spec: PracticeFigureSpec, ax: FigureAxes): Reaction {
  const r = reactionOf(spec);
  if (!ax.y!.numbered) fail('the energy axis has no numbers (showAxisValues is false), so no energy can be read off');
  mustBeOnGrid(r.R, ax.y, 'the reactant level');
  mustBeOnGrid(r.P, ax.y, 'the product level');
  r.eas.forEach((ea, i) => mustBeOnGrid(r.R + ea, ax.y, `the peak of curve ${i + 1}`));
  return r;
}
function knownForces(spec: PracticeFigureSpec): Array<Force & { v: [number, number] }> {
  const { forces, surface } = forcesOf(spec);
  return forces.map((f) => {
    const v = cardinalOf(f, surface);
    if (!v) return fail(`the force "${f.name}" is not along the horizontal or the vertical — this checker handles only such forces`);
    return { ...f, v };
  });
}

// ── 3a. batch 1 kinds: models, transcription, checkers ──────────────────────
//
// unit_circle, vector_diagram, free_body_diagram_v2, shaded_region,
// number_line, sign_chart, distribution_curve, histogram, box_plot,
// polar_complex, punnett_square, pedigree. Each is read through the SAME
// model the renderer draws from (src/lib/tutor/practice-figure/kinds/*.ts),
// so the transcription and the checkers cannot disagree with the picture.
// A blank ("?") is transcribed as a blank; the value under it is used only
// by the checker that recomputes the key.

/** The kind's model, with a renderer refusal turned into a rule error. */
function modelOf<T>(spec: PracticeFigureSpec, build: (r: Reader) => T): T {
  try {
    return build(new Reader(spec.type, spec.params));
  } catch (e) {
    if (e instanceof PracticeFigureSpecError) return fail(e.message.replace(/^\[practice-figure:[^\]]+\]\s*/, ''));
    throw e;
  }
}

/** A number as it is printed on these figures: a real minus sign. */
const mn = (v: number): string => fmt(v).replace(/^-/, '−');
/** A number as a fraction in lowest terms when it is one with a small denominator. */
function asFraction(v: number): string {
  for (const d of [1, 2, 3, 4, 5, 6, 8, 10, 12]) {
    const n = v * d;
    if (Math.abs(n - Math.round(n)) < 1e-9) return fractionText(Math.round(n), d);
  }
  return mn(v);
}
const BLANK = '(blank — a "?" box)';
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
const text = (value: string): Derived => ({ kind: 'text', value });
const approx = (v: number): Derived => ({ kind: 'number', value: Number(v.toPrecision(12)), approx: true });
const yesNo = (b: boolean): Derived => ({ kind: 'label', value: b ? 'yes' : 'no' });

function needGrid(v: number, unit: number, what: string): number {
  if (!Number.isFinite(v) || !isMultiple(v, unit)) fail(`${what} = ${Number.isFinite(v) ? fmt(Number(v.toPrecision(8))) : 'undefined'} is not on a gridline of the figure, so it cannot be read off exactly`);
  return v;
}
/** The finest gridline spacing of a plot-frame figure whose step the renderer
 *  fixes: the given step, or one unit when the range is at most 12 units. */
function planeUnit(m: { xRange: [number, number]; yRange: [number, number]; xStep?: number; yStep?: number }): number {
  const span = Math.max(m.xRange[1] - m.xRange[0], m.yRange[1] - m.yRange[0]);
  const step = m.xStep ?? m.yStep ?? (span <= 12 ? 1 : 0);
  if (!(step > 0)) return fail('give xStep / yStep (or a range of at most 12 units), so that what lies on a gridline is decided by the spec');
  if (m.xStep && m.yStep && m.xStep !== m.yStep) return Math.min(minorOf(m.xStep), minorOf(m.yStep));
  return minorOf(step);
}

// unit circle ---------------------------------------------------------------

const REF_VALUES: Record<string, Record<number, string>> = {
  sin: { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1' },
  cos: { 0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0' },
  tan: { 0: '0', 30: '√3/3', 45: '1', 60: '√3', 90: 'undefined' },
  cot: { 0: 'undefined', 30: '√3', 45: '1', 60: '√3/3', 90: '0' },
  sec: { 0: '1', 30: '2√3/3', 45: '√2', 60: '2', 90: 'undefined' },
  csc: { 0: 'undefined', 30: '2', 45: '√2', 60: '2√3/3', 90: '1' },
};
const TRIG_FNS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc'] as const;
const norm360 = (d: number): number => ((d % 360) + 360) % 360;
/** The reference angle (0–90°) of an angle in degrees. */
export function referenceAngle(degrees: number): number {
  const d = norm360(degrees) % 180;
  return Number(Math.min(d, 180 - d).toFixed(9));
}
function quadrantOf(degrees: number): 0 | 1 | 2 | 3 | 4 {
  const d = norm360(degrees);
  if (isMultiple(d, 90)) return 0;
  return (Math.floor(d / 90) + 1) as 1 | 2 | 3 | 4;
}
/** An exact trig value at a multiple of 30° or 45°, as text ("−√3/2", "undefined"). */
export function exactTrigValue(fn: (typeof TRIG_FNS)[number], degrees: number): string {
  const ref = referenceAngle(degrees);
  const mag = REF_VALUES[fn][ref];
  if (mag === undefined) return fail(`the angle ${fmt(degrees)}° is not a multiple of 30° or 45° — its exact ${fn} cannot be read off a unit circle`);
  if (mag === 'undefined' || mag === '0') return mag;
  const rad = (degrees * Math.PI) / 180;
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const v = fn === 'sin' || fn === 'csc' ? s : fn === 'cos' || fn === 'sec' ? c : s * c;
  return v < 0 ? `−${mag}` : mag;
}
function ucAngle(spec: PracticeFigureSpec, a: P) {
  const m = modelOf(spec, unitCircleModel);
  return m.angles[argIndex(a, 'angle', m.angles.length, 'marked angle')];
}

// vectors ---------------------------------------------------------------------

function vecArg(spec: PracticeFigureSpec, a: P, k = 'vector'): DiagramVector {
  const m = modelOf(spec, vectorDiagramModel);
  const unit = planeUnit(m);
  let v: DiagramVector;
  if (a[k] === 'resultant') {
    if (!m.resultant) return fail('the figure draws no resultant');
    v = m.resultant;
  } else v = m.vectors[argIndex(a, k, m.vectors.length, 'vector')];
  for (const [q, name] of [[v.tail, 'tail'], [v.head, 'head']] as Array<[[number, number], string]>) {
    needGrid(q[0], unit, `the x-coordinate of the arrow's ${name}`);
    needGrid(q[1], unit, `the y-coordinate of the arrow's ${name}`);
  }
  return v;
}
const comps = (v: DiagramVector): [number, number] => [Number((v.head[0] - v.tail[0]).toPrecision(12)), Number((v.head[1] - v.tail[1]).toPrecision(12))];
const dirDegrees = (x: number, y: number): number => Number(norm360((Math.atan2(y, x) * 180) / Math.PI).toFixed(6));
function vectorResult(x: number, y: number, want: string): Derived {
  if (want === 'x') return num(x);
  if (want === 'y') return num(y);
  if (want === 'pair') return text(`(${mn(x)}, ${mn(y)})`);
  if (want === 'magnitude') return Number.isInteger(Math.hypot(x, y)) ? num(Math.hypot(x, y)) : approx(Math.hypot(x, y));
  if (Math.hypot(x, y) < 1e-12) return fail('the zero vector has no direction');
  const d = dirDegrees(x, y);
  return isMultiple(d, 15) ? num(Math.round(d)) : approx(d);
}

// free-body diagram v2 -------------------------------------------------------

/** A force whose direction the student can tell from the figure: along an
 *  axis, marked with a numeric angle arc, or along / across a marked incline. */
function fbdReadable(m: FreeBodyModel, f: FbdForce): boolean {
  if (isMultiple(f.degrees, 90)) return true;
  if (f.showAngle && /^[\d.]+°$/.test(f.shownAngle)) return true;
  return !!f.named && !!m.incline && m.incline.showAngle && /^[\d.]+°$/.test(m.incline.shownAngle);
}
function fbdDirectionWords(m: FreeBodyModel, f: FbdForce): string {
  const d = f.degrees;
  const slope: Record<string, string> = { 'up-slope': 'along the incline, up the slope', 'down-slope': 'along the incline, down the slope', normal: 'perpendicular to the incline, away from it', 'into-surface': 'perpendicular to the incline, into it' };
  if (f.named && slope[f.named]) return `pointing ${slope[f.named]}`;
  if (isMultiple(d, 90)) return `pointing ${['to the right', 'straight up', 'to the left', 'straight down'][Math.round(d / 90) % 4]}`;
  const where = `${d < 180 ? 'up' : 'down'} and to the ${d > 90 && d < 270 ? 'left' : 'right'}`;
  if (!f.showAngle) return `pointing ${where}, at an angle that is not marked`;
  const side = f.angleFrom === 'horizontal' ? `${d < 180 ? 'above' : 'below'} the horizontal` : 'from the vertical';
  return `pointing ${where}, ${/°$/.test(f.shownAngle) ? `${f.shownAngle} ${side}` : `at the angle marked "${f.shownAngle}" ${side}`}`;
}
function fbdAxis(m: FreeBodyModel, axis: string): [number, number] {
  if (axis === 'x') return [1, 0];
  if (axis === 'y') return [0, 1];
  if (!m.incline) return fail(`axis "${axis}" needs an incline`);
  const t = (m.incline.angle * Math.PI) / 180;
  return axis === 'along' ? [Math.cos(t), Math.sin(t)] : [-Math.sin(t), Math.cos(t)];
}
const unitOf = (f: FbdForce): [number, number] => [Math.cos((f.degrees * Math.PI) / 180), Math.sin((f.degrees * Math.PI) / 180)];
/** Sum of the printed forces along a unit direction; forces across it are left out. */
function fbdSum(m: FreeBodyModel, dir: [number, number], skip?: FbdForce): number {
  let total = 0;
  for (const f of m.forces) {
    if (f === skip) continue;
    const u = unitOf(f);
    const along = u[0] * dir[0] + u[1] * dir[1];
    if (Math.abs(along) < 1e-9) continue;
    if (!fbdReadable(m, f)) fail(`the direction of "${f.label}" is not printed on the figure (no angle arc), so its component cannot be worked out`);
    if (f.magnitude === undefined || !f.showMagnitude) fail(skip ? `"${f.label}" acts along the same line and has no printed size either` : `the force "${f.label}" has no printed size`);
    total += (f.magnitude as number) * along;
  }
  return total;
}
const roundish = (v: number): Derived => (Math.abs(v - Math.round(v * 1000) / 1000) < 1e-9 ? num(Math.round(v * 1000) / 1000 + 0) : approx(v));

// shaded region --------------------------------------------------------------

type Pt = [number, number];
const polyArea = (poly: Pt[]): number => Math.abs(poly.reduce((t, q, i) => t + q[0] * poly[(i + 1) % poly.length][1] - poly[(i + 1) % poly.length][0] * q[1], 0)) / 2;
const isLine = (f: (x: number) => number, a: number, b: number): boolean => [0.25, 0.5, 0.75].every((t) => Math.abs(f(a + (b - a) * t) - (f(a) + (f(b) - f(a)) * t)) < 1e-9 * Math.max(1, Math.abs(f(a)), Math.abs(f(b))));
/** The region's corner points when it is a polygon with straight sides, else a refusal. */
function regionPolygon(m: ShadedRegionModel): Pt[] {
  const g = m.region;
  const unit = planeUnit(m);
  let poly: Pt[];
  if (g.type === 'under_curve') {
    if (!isLine(g.curve.fn, g.from, g.to)) fail('the boundary of the shaded region is not a straight line — its area cannot be found by counting or by a formula for a polygon');
    const fa = g.curve.fn(g.from);
    const fb = g.curve.fn(g.to);
    poly = [[g.from, 0], [g.from, fa], [g.to, fb], [g.to, 0]];
    if (fa * fb < 0) {
      // The line crosses the axis inside the region: two triangles, corner at the crossing.
      const xc = g.from + ((g.to - g.from) * fa) / (fa - fb);
      needGrid(xc, unit, 'the point where the line crosses the x-axis');
      poly = [[g.from, 0], [g.from, fa], [xc, 0], [g.to, fb], [g.to, 0], [xc, 0]];
    }
  } else if (g.type === 'between_curves') {
    if (!isLine(g.upper.fn, g.from, g.to) || !isLine(g.lower.fn, g.from, g.to)) fail('a boundary of the shaded region is not a straight line — its area cannot be found by counting or by a formula for a polygon');
    poly = [[g.from, g.lower.fn(g.from)], [g.from, g.upper.fn(g.from)], [g.to, g.upper.fn(g.to)], [g.to, g.lower.fn(g.to)]];
  } else {
    const onEdge = (q: Pt) => [m.xRange[0], m.xRange[1]].some((e) => Math.abs(q[0] - e) < 1e-9) || [m.yRange[0], m.yRange[1]].some((e) => Math.abs(q[1] - e) < 1e-9);
    const onLine = (q: Pt) => g.inequalities.filter((k) => Math.abs(k.a * q[0] + k.b * q[1] - k.c) < 1e-7).length;
    if (g.polygon.some((q) => onEdge(q) && onLine(q) < 2)) fail('the shaded region runs to the edge of the plot — it is not closed by the boundary lines, so its extent cannot be read');
    poly = g.polygon.map((q): Pt => [Number(q[0].toFixed(9)), Number(q[1].toFixed(9))]);
  }
  poly.forEach((q) => {
    needGrid(q[0], unit, 'the x-coordinate of a corner of the shaded region');
    needGrid(q[1], unit, 'the y-coordinate of a corner of the shaded region');
  });
  return poly;
}
function regionArea(m: ShadedRegionModel): number {
  const poly = regionPolygon(m);
  // The two-triangle case is stored as a bow-tie: add the halves.
  if (m.region.type === 'under_curve' && poly.length === 6) return polyArea(poly.slice(0, 3)) + polyArea(poly.slice(3));
  return polyArea(poly);
}
function regionContains(m: ShadedRegionModel, x: number, y: number): boolean {
  const g = m.region;
  if (g.type === 'inequalities') return g.inequalities.every((q) => satisfies(q, x, y));
  if (x < g.from - 1e-9 || x > g.to + 1e-9) return false;
  const [lo, hi] = g.type === 'under_curve' ? [Math.min(0, g.curve.fn(x)), Math.max(0, g.curve.fn(x))] : [g.lower.fn(x), g.upper.fn(x)];
  return y >= lo - 1e-9 && y <= hi + 1e-9;
}

// number line and sign chart -------------------------------------------------

interface Piece { from: number; to: number; fromOpen: boolean; toOpen: boolean }
/** The set a number line shows, as disjoint pieces in order (a point is a piece of zero length). */
function lineSet(m: NumberLineModel): Piece[] {
  const pieces: Piece[] = [
    ...m.intervals.map((iv) => ({ from: iv.from ?? -Infinity, to: iv.to ?? Infinity, fromOpen: iv.from === null ? true : iv.fromOpen, toOpen: iv.to === null ? true : iv.toOpen })),
    ...m.points.filter((q) => !q.open).map((q) => ({ from: q.x, to: q.x, fromOpen: false, toOpen: false })),
  ].sort((a, b) => a.from - b.from || Number(a.fromOpen) - Number(b.fromOpen));
  const out: Piece[] = [];
  for (const pc of pieces) {
    const last = out[out.length - 1];
    // Joined when they overlap, or touch at a point at least one of them includes.
    if (last && (pc.from < last.to || (pc.from === last.to && !(pc.fromOpen && last.toOpen)))) {
      if (pc.to > last.to || (pc.to === last.to && !pc.toOpen)) {
        last.toOpen = pc.to > last.to ? pc.toOpen : last.toOpen && pc.toOpen;
        last.to = Math.max(last.to, pc.to);
      }
    } else out.push({ ...pc });
  }
  return out;
}
function intervalNotation(pieces: Piece[], show: (v: number) => string): string {
  const end = (v: number) => (v === Infinity ? '∞' : v === -Infinity ? '−∞' : show(v));
  return pieces.map((pc) => (pc.from === pc.to ? `{${show(pc.from)}}` : `${pc.fromOpen ? '(' : '['}${end(pc.from)}, ${end(pc.to)}${pc.toOpen ? ')' : ']'}`)).join(' ∪ ');
}
function signRow(spec: PracticeFigureSpec, a: P) {
  const m = modelOf(spec, signChartModel);
  return { m, row: m.rows[argIndex(a, 'row', m.rows.length, 'row of the chart')] };
}
/** Critical numbers where the row's sign differs on the two sides. */
function signChanges(row: { signs: string[] }, m: { critical: Array<{ value: number }> }, from?: string, to?: string): number[] {
  const out: number[] = [];
  m.critical.forEach((c, k) => {
    const l = row.signs[k];
    const r = row.signs[k + 1];
    if (!l || !r) return fail(`the sign on one side of ${fmt(c.value)} is not given in the spec`);
    if (l !== r && (!from || (l === from && r === to))) out.push(c.value);
  });
  return out;
}

// distributions --------------------------------------------------------------

const EMPIRICAL_CDF: Record<number, number> = { [-3]: 0.0015, [-2]: 0.025, [-1]: 0.16, 0: 0.5, 1: 0.84, 2: 0.975, 3: 0.9985 };
function boxUnit(spec: PracticeFigureSpec): number {
  const m = modelOf(spec, boxPlotModel);
  return minorOf(m.step ?? niceStep(m.range[1] - m.range[0], 8));
}
function boxStat(b: BoxPlot, stat: string, unit: number): number {
  const g = (v: number, what: string) => needGrid(v, unit, what);
  switch (stat) {
    case 'min': return g(b.min, 'the end of the left whisker');
    case 'max': return g(b.max, 'the end of the right whisker');
    case 'q1': return g(b.q1, 'the left edge of the box');
    case 'q3': return g(b.q3, 'the right edge of the box');
    case 'median': return g(b.median, 'the line inside the box');
    case 'iqr': return g(b.q3, 'the right edge of the box') - g(b.q1, 'the left edge of the box');
    default: return g(Math.max(b.max, ...b.outliers), 'the greatest value shown') - g(Math.min(b.min, ...b.outliers), 'the least value shown');
  }
}
const BOX_STATS = ['min', 'q1', 'median', 'q3', 'max', 'iqr', 'range'] as const;

// complex plane / polar grid -------------------------------------------------

function planePoints(spec: PracticeFigureSpec): PlanePoint[] {
  const m = modelOf(spec, polarComplexModel);
  if (m.plane === 'complex') {
    const unit = minorOf(m.step ?? (m.range <= 6 ? 1 : fail('give step (or a range of at most 6), so that what lies on a gridline is decided by the spec')));
    m.points.forEach((q, i) => {
      needGrid(q.re, unit, `the real part of point ${i}`);
      needGrid(q.im, unit, `the imaginary part of point ${i}`);
    });
  } else {
    m.points.forEach((q, i) => {
      needGrid(q.r, m.rStep, `the distance of point ${i} from the pole`);
      needGrid(q.givenTheta, m.angleStep, `the angle of point ${i}`);
    });
  }
  return m.points;
}
function complexText(re: number, im: number): string {
  const r = Number(re.toFixed(9));
  const i = Number(im.toFixed(9));
  if (i === 0) return mn(r);
  const imag = `${Math.abs(i) === 1 ? '' : mn(Math.abs(i))}i`;
  if (r === 0) return `${i < 0 ? '−' : ''}${imag}`;
  return `${mn(r)} ${i < 0 ? '−' : '+'} ${imag}`;
}
function twoPoints(spec: PracticeFigureSpec, a: P): [PlanePoint, PlanePoint] {
  const pts = planePoints(spec);
  const idx = a.points;
  if (!Array.isArray(idx) || idx.length !== 2 || idx[0] === idx[1] || !idx.every((k) => isNum(k) && Number.isInteger(k) && k >= 0 && k < pts.length)) return fail('derivation argument "points" must be the 0-based indices of two different points');
  return [pts[idx[0] as number], pts[idx[1] as number]];
}
function complexResult(re: number, im: number, want: string): Derived {
  if (want === 're') return num(re);
  if (want === 'im') return num(im);
  if (want === 'modulus') return Number.isInteger(Math.hypot(re, im)) ? num(Math.hypot(re, im)) : approx(Math.hypot(re, im));
  return text(complexText(re, im));
}

// pedigree -------------------------------------------------------------------

export const INHERITANCE_MODES = ['autosomal_dominant', 'autosomal_recessive', 'x_linked_dominant', 'x_linked_recessive'] as const;
export type InheritanceMode = (typeof INHERITANCE_MODES)[number];

/**
 * Can the chart be explained by one gene inherited in this mode? True when
 * every individual can be given a genotype such that each child received one
 * allele from each parent (a son's X from his mother only) and every drawn
 * status fits: a filled symbol is affected, an open one is not, a half-filled
 * one is an unaffected heterozygote (which exists only under a recessive
 * mode), a "?" is unconstrained. Founders may carry any genotype. Assumes
 * full penetrance and no new mutation — the textbook reading of a pedigree.
 * A symbol of unknown sex is tried as male and as female under X-linkage.
 */
export function pedigreeConsistent(m: PedigreeModel, mode: InheritanceMode): boolean {
  const xLinked = mode.startsWith('x_linked');
  const dominant = mode.endsWith('dominant');
  const order = [...m.individuals].sort((a, b) => a.generation - b.generation);
  /** State: the number of disease alleles carried, and the sex used. */
  const state = new Map<string, { d: number; sex: 'M' | 'F' }>();
  const fits = (ind: PedigreeIndividual, d: number, sex: 'M' | 'F'): boolean => {
    const copies = xLinked && sex === 'M' ? 1 : 2;
    if (d > copies) return false;
    const affected = xLinked && sex === 'M' ? d === 1 : dominant ? d >= 1 : d === 2;
    if (ind.unknown) return true;
    if (ind.carrier) return !dominant && !(xLinked && sex === 'M') && d === 1;
    return affected === ind.affected;
  };
  /** The numbers of disease alleles a parent in this state can pass on. */
  const passes = (d: number, copies: number): number[] => (d === 0 ? [0] : d === copies ? [1] : [0, 1]);
  const search = (k: number): boolean => {
    if (k === order.length) return true;
    const ind = order[k];
    const sexes: Array<'M' | 'F'> = ind.sex === 'U' ? (xLinked ? ['M', 'F'] : ['F']) : [ind.sex];
    for (const sex of sexes) {
      let options: number[];
      if (!ind.father) options = [0, 1, 2];
      else {
        const f = state.get(ind.father) as { d: number; sex: 'M' | 'F' };
        const mo = state.get(ind.mother as string) as { d: number; sex: 'M' | 'F' };
        const fromMother = passes(mo.d, 2);
        // X-linked: a son gets no X from his father; a daughter gets the father's only X.
        const fromFather = xLinked ? (sex === 'M' ? [0] : [f.d]) : passes(f.d, 2);
        options = [...new Set(fromFather.flatMap((x) => fromMother.map((y) => x + y)))];
      }
      for (const d of options) {
        if (!fits(ind, d, sex)) continue;
        state.set(ind.id, { d, sex });
        if (search(k + 1)) return true;
      }
      state.delete(ind.id);
    }
    return false;
  };
  return search(0);
}
const MODE_WORDS: Record<InheritanceMode, string> = { autosomal_dominant: 'autosomal dominant', autosomal_recessive: 'autosomal recessive', x_linked_dominant: 'X-linked dominant', x_linked_recessive: 'X-linked recessive' };

// transcription ---------------------------------------------------------------

/** Batch-1 kinds: fills `printed` and `out`, returns what kind of figure it is ('' = not one of them). */
function describeBatch1(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  switch (spec.type) {
    case 'unit_circle': {
      const m = modelOf(spec, unitCircleModel);
      out.push(`A circle of radius 1 centred on the origin, on x and y axes${m.axisTicks ? ' with the points 1 and −1 marked on each axis' : ''}. There is no grid.`);
      if (m.quadrantLabels) {
        printed.push('quadrant labels: "I", "II", "III", "IV"');
        out.push('The four quadrants are labelled I (upper right), II (upper left), III (lower left), IV (lower right).');
      }
      m.angles.forEach((a, i) => {
        const q = quadrantOf(a.degrees);
        const d = norm360(a.degrees);
        const where = q === 0 ? `on the ${['positive x-axis', 'positive y-axis', 'negative x-axis', 'negative y-axis'][Math.round(d / 90) % 4]}` : `in the ${ORDINALS[q - 1]} quadrant`;
        const parts = [`Marked angle ${i + 1}: its terminal side meets the circle ${where}`];
        if (a.radius) parts.push('a radius is drawn to that point');
        if (a.arc) parts.push(`an arc from the positive x-axis shows the rotation, ${a.degrees < 0 ? 'clockwise' : 'counter-clockwise'}`);
        if (a.triangle) parts.push('a dashed vertical from the point to the x-axis and a right-angle mark form the reference triangle');
        if (a.shownLabel) {
          printed.push(`angle label: "${a.shownLabel}"`);
          parts.push(a.shownLabel === '?' && !a.labelText ? `its size is ${BLANK}` : `angle label "${a.shownLabel}"`);
        } else parts.push('no angle label');
        if (a.shownCoords) {
          printed.push(`point label: "${a.shownCoords}"`);
          parts.push(`the point is labelled "${a.shownCoords}"${a.coords !== 'show' && a.coords !== 'hide' ? ' (a "?" stands for a coordinate left out)' : ''}`);
        } else if (a.point) parts.push('the point is a dot with no label');
        out.push(`${parts.join('; ')}.`);
      });
      return 'a unit circle with marked angles';
    }
    case 'vector_diagram': {
      const m = modelOf(spec, vectorDiagramModel);
      const unit = planeUnit(m);
      printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
      out.push(`A grid: x from ${fmt(m.xRange[0])} to ${fmt(m.xRange[1])}, y from ${fmt(m.yRange[0])} to ${fmt(m.yRange[1])}, gridlines every ${fmt(unit)}.`);
      const at = (q: [number, number]) => (isMultiple(q[0], unit) && isMultiple(q[1], unit) ? `(${fmt(q[0])}, ${fmt(q[1])})` : `a point that is not on a grid crossing (near (${fmt(Number(q[0].toFixed(1)))}, ${fmt(Number(q[1].toFixed(1)))}))`);
      const line = (v: DiagramVector, what: string) => {
        if (v.label) printed.push(`arrow label: "${v.label}"`);
        out.push(`${what}${v.label ? ` labelled "${v.label}"` : ' with no label'}: from ${at(v.tail)} to ${at(v.head)} (the arrowhead is at the second point)${v.showComponents ? '; thin dashes run across from its tail and then up or down to its head' : ''}.`);
      };
      m.vectors.forEach((v, i) => line(v, `Arrow ${i + 1}, an arrow`));
      if (m.tipToTail) out.push('The arrows are joined tip to tail, in that order.');
      if (m.resultant) line(m.resultant, 'One heavier arrow');
      return 'a diagram of vectors drawn as arrows on a numbered grid';
    }
    case 'free_body_diagram_v2': {
      const m = modelOf(spec, freeBodyModel);
      if (m.objectLabel) printed.push(`caption on the object: "${m.objectLabel}"`);
      out.push(`The object is drawn as a ${m.shape === 'dot' ? 'dot' : m.shape === 'block' ? 'wide block' : 'box'}${m.objectLabel ? ` with the caption "${m.objectLabel}"` : ''}.`);
      if (m.incline) {
        if (m.incline.showAngle) printed.push(`angle label at the foot of the incline: "${m.incline.shownAngle}"`);
        out.push(`It sits on an incline that rises to the right; the incline's angle to the horizontal is ${m.incline.showAngle ? `marked "${m.incline.shownAngle}"` : 'not marked'}.`);
      } else out.push(m.surface ? 'It sits on a horizontal surface.' : 'No surface is drawn.');
      if (m.axes) out.push(`A small pair of x / y axes is drawn in the corner${m.axes === 'incline' ? ', tilted so that x points up the incline' : ''}.`);
      out.push(m.lengths === 'equal' ? 'All arrows are drawn the same length (the lengths say nothing about the sizes of the forces).' : 'Arrow lengths are drawn to scale with the printed sizes.');
      out.push('Force arrows on the object:');
      for (const f of m.forces) {
        printed.push(`arrow label: "${f.shownLabel}"`);
        if (f.showAngle) printed.push(`angle label: "${f.shownAngle}"`);
        out.push(`  arrow labelled "${f.shownLabel}", ${fbdDirectionWords(m, f)}`);
      }
      return 'a free-body diagram (one object with force arrows)';
    }
    case 'shaded_region': {
      const m = modelOf(spec, shadedRegionModel);
      const unit = planeUnit(m);
      printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
      out.push(`A grid: x from ${fmt(m.xRange[0])} to ${fmt(m.xRange[1])}, y from ${fmt(m.yRange[0])} to ${fmt(m.yRange[1])}, gridlines every ${fmt(unit)}.`);
      const read = (v: number) => (isMultiple(v, unit) ? fmt(Number(v.toFixed(9))) : `between ${fmt(Math.floor(v / unit) * unit)} and ${fmt(Math.floor(v / unit) * unit + unit)} (not on a gridline)`);
      const g = m.region;
      const table = (c: { fn: (x: number) => number; label?: string }, name: string, dashed: boolean) => {
        if (c.label) printed.push(`legend entry: "${c.label}"`);
        const straight = isLine(c.fn, m.xRange[0], m.xRange[1]);
        out.push(`${name}${c.label ? ` (legend "${c.label}")` : ''}: a ${dashed ? 'dashed' : 'solid'} ${straight ? 'STRAIGHT line' : 'curve'}. Its height at whole-number x:`);
        for (let x = Math.ceil(m.xRange[0]); x <= m.xRange[1]; x++) {
          const y = c.fn(x);
          if (Number.isFinite(y) && y >= m.yRange[0] && y <= m.yRange[1]) out.push(`  x = ${fmt(x)}: y = ${read(y)}`);
        }
        return straight ? 'line' : 'curve';
      };
      if (g.type === 'under_curve') {
        const what = table(g.curve, 'One curve', false);
        out.push(`Hatched region: between the ${what} and the x-axis, from x = ${read(g.from)} to x = ${read(g.to)}${g.showBounds ? ' (a thin vertical edge at each end)' : ''}.`);
      } else if (g.type === 'between_curves') {
        table(g.upper, 'Upper curve', false);
        table(g.lower, 'Lower curve', true);
        out.push(`Hatched region: between the two, from x = ${read(g.from)} to x = ${read(g.to)}.`);
        if (g.markIntersections) for (const q of g.intersections) out.push(`Marked point where the two meet: a filled dot at (${read(q[0])}, ${read(q[1])}).`);
      } else {
        g.inequalities.forEach((q, i) => {
          if (q.label) printed.push(`legend entry: "${q.label}"`);
          const strict = q.op === '<' || q.op === '>';
          // Two grid points of the line inside the plot, so the line can be told without its equation.
          const on: Pt[] = [];
          for (let x = Math.ceil(m.xRange[0]); x <= m.xRange[1]; x++) {
            if (Math.abs(q.b) < 1e-12) continue;
            const y = (q.c - q.a * x) / q.b;
            if (isMultiple(y, unit) && y >= m.yRange[0] && y <= m.yRange[1]) on.push([x, Number(y.toFixed(9))]);
          }
          const through = Math.abs(q.b) < 1e-12 ? `vertical line at x = ${read(q.c / q.a)}` : on.length >= 2 ? `straight line through (${fmt(on[0][0])}, ${fmt(on[0][1])}) and (${fmt(on[on.length - 1][0])}, ${fmt(on[on.length - 1][1])})` : 'straight line that passes through fewer than two grid crossings';
          out.push(`Boundary line ${i + 1}${q.label ? ` (legend "${q.label}")` : ''}: a ${strict ? 'DASHED' : 'SOLID'} ${through}.`);
        });
        const corners = g.polygon.map((q) => `(${read(q[0])}, ${read(q[1])})`).join(', ');
        out.push(`Hatched region: the polygon with corners ${corners}${g.polygon.some((q) => [m.xRange[0], m.xRange[1]].includes(q[0]) || [m.yRange[0], m.yRange[1]].includes(q[1])) ? ' (it runs to the edge of the plot)' : ''}.`);
        if (g.markVertices) {
          for (const v of g.vertices) {
            const open = g.inequalities.some((q) => (q.op === '<' || q.op === '>') && Math.abs(q.a * v[0] + q.b * v[1] - q.c) < 1e-7);
            out.push(`Marked corner of the hatched region at (${read(v[0])}, ${read(v[1])}): ${open ? 'an open circle' : 'a filled dot'}.`);
          }
        }
      }
      return 'a coordinate grid with one region shaded by hatching';
    }
    case 'number_line': {
      const m = modelOf(spec, numberLineModel);
      const show = spec.params.denominator ? asFraction : mn;
      const labelled = m.ticks.filter((k) => k.text);
      out.push(`A number line with ${m.ticks.length} evenly spaced ticks from ${show(m.min)} to ${show(m.max)} (one every ${show(m.tickSpacing)}); it runs on with an arrow at both ends.`);
      out.push(labelled.length === m.ticks.length ? 'Every tick is numbered.' : labelled.length === 0 ? 'No tick is numbered.' : `Only these ticks are numbered: ${labelled.map((k) => k.text).join(', ')}.`);
      /** A tick as the eye finds it: by its number, or by counting from the nearest numbered tick. */
      const known = (v: number): string => {
        const here = labelled.find((k) => Math.abs(k.x - v) < 1e-9);
        if (here) return here.text;
        if (labelled.length === 0) return `tick number ${Math.round((v - m.min) / m.tickSpacing) + 1} counted from the left end`;
        const left = [...labelled].reverse().find((k) => k.x < v);
        const ref = left ?? labelled[0];
        const n = Math.round(Math.abs(v - ref.x) / m.tickSpacing);
        return `the unnumbered tick ${n} tick${n === 1 ? '' : 's'} to the ${left ? 'right' : 'left'} of ${ref.text}`;
      };
      const place = (v: number): string => (isMultiple(v - m.min, m.tickSpacing) ? known(v) : `a point between two ticks (not on a tick)`);
      for (const iv of m.intervals) {
        const a = iv.from === null ? '' : `${iv.fromOpen ? 'an open' : 'a filled'} circle at ${place(iv.from)}`;
        const b = iv.to === null ? '' : `${iv.toOpen ? 'an open' : 'a filled'} circle at ${place(iv.to)}`;
        if (iv.from === null && iv.to === null) out.push('Thick segment over the whole line, running on with an arrow both ways.');
        else if (iv.from === null) out.push(`Thick segment that runs on to the left (arrow) and ends at ${b}.`);
        else if (iv.to === null) out.push(`Thick segment that starts at ${a} and runs on to the right (arrow).`);
        else out.push(`Thick segment from ${a} to ${b}.`);
      }
      for (const q of m.points) {
        if (q.label) printed.push(`point label: "${q.label}"`);
        out.push(`Separate ${q.open ? 'open circle' : 'filled dot'} at ${place(q.x)}${q.label ? (q.label === '?' ? `, labelled with ${BLANK}` : ` labelled "${q.label}"`) : ''}.`);
      }
      return 'a number line';
    }
    case 'sign_chart': {
      const m = modelOf(spec, signChartModel);
      const c = m.critical;
      printed.push(...c.map((k) => `critical number: "${k.label}"`), ...m.rows.map((r) => `row label: "${r.label}"`));
      out.push(`A sign chart over a ${m.variable} line with these numbers marked, left to right (evenly spaced, not to scale): ${c.map((k) => k.label).join(', ')}.`);
      const sign = (s: string) => (s === '+' ? '+' : s === '-' ? '−' : s || '(empty)');
      for (const row of m.rows) {
        const cells: string[] = [];
        row.signs.forEach((s, k) => {
          const where = k === 0 ? `left of ${c[0].label}` : k === c.length ? `right of ${c[c.length - 1].label}` : `between ${c[k - 1].label} and ${c[k].label}`;
          cells.push(`${where}: ${row.blankSigns[k] ? BLANK : sign(s)}`);
          if (k < c.length) cells.push(`at ${c[k].label}: ${row.blankAt[k] ? BLANK : sign(row.at[k])}`);
        });
        out.push(`Row "${row.label}": ${cells.join('; ')}.`);
      }
      return 'a sign chart';
    }
    case 'distribution_curve': {
      const m = modelOf(spec, distributionModel);
      if (m.xLabel) printed.push(`axis label: "${m.xLabel}"`);
      const ticks = m.tickTexts.filter(Boolean);
      out.push(`A bell-shaped (normal) curve, symmetric about its centre, over a horizontal axis with seven evenly spaced ticks: the centre and three on each side (one per standard deviation). ${ticks.length ? `The ticks are labelled, left to right: ${ticks.join(', ')}.` : 'The ticks carry no numbers.'}`);
      const value = (v: number) => (m.axis === 'z' ? (v - m.mean) / m.sd : v);
      const tickAt = (k: number) => m.tickTexts[k + 3] || `the ${k === 0 ? 'centre' : `${ORDINALS[Math.abs(k) - 1]} tick ${k < 0 ? 'left' : 'right'} of the centre`}`;
      const bound = (v: number, label?: string): string => {
        const z = (v - m.mean) / m.sd;
        if (isMultiple(z, 1)) return m.axis === 'x' || m.axis === 'z' ? mn(value(v)) : tickAt(Math.round(z));
        // Drawn to scale: a bound a hair from a tick reads as "at about" that tick.
        const between = Math.abs(z - Math.round(z)) < 0.15 ? `very close to ${tickAt(Math.round(z))}` : `between ${tickAt(Math.floor(z))} and ${tickAt(Math.floor(z) + 1)}`;
        if (label) return `a bound marked "${label}" (${between})`;
        return m.axis === 'x' || m.axis === 'z' ? mn(Number(value(v).toPrecision(8))) : `an unlabelled bound ${between}`;
      };
      for (const s of m.shade) {
        if (s.label) printed.push(`bound label: "${s.label}"`);
        if (s.from === null) out.push(`Hatched left tail: everything up to ${bound(s.to as number, s.label)}.`);
        else if (s.to === null) out.push(`Hatched right tail: everything from ${bound(s.from, s.label)} on.`);
        else out.push(`Region under the curve hatched from ${bound(s.from, s.label)} to ${bound(s.to, s.label)}.`);
        if (m.showArea) {
          const area = normalArea(m.mean, m.sd, s.from, s.to).toFixed(4);
          printed.push(`area printed at the hatched region: "${area}"`);
        }
      }
      if (m.shade.length === 0) out.push('Nothing is shaded.');
      return 'a normal distribution curve';
    }
    case 'histogram': {
      const m = modelOf(spec, histogramModel);
      if (m.xLabel) printed.push(`axis label: "${m.xLabel}"`);
      printed.push(`axis label: "${m.yLabel}"`);
      const unit = minorOf(m.yStep);
      out.push(`A histogram: ${m.counts.length} classes of equal width, with a tick at each boundary on the horizontal axis: ${m.edges.map(fmt).join(', ')}${m.labelEvery > 1 ? ` (only every ${ORDINALS[m.labelEvery - 1]} boundary carries its number, starting with the first)` : ''}. Vertical axis "${m.yLabel}" from 0 to ${fmt(m.yMax)}, numbered every ${fmt(m.yStep)}${unit !== m.yStep ? `, lighter gridlines every ${fmt(unit)}` : ''}.`);
      out.push(`Bar heights${m.showCounts ? ' (each printed above its bar)' : ''}:`);
      m.counts.forEach((c, i) => {
        const h = m.blank[i] ? `${BLANK.slice(0, -1)}, no bar)` : m.showCounts || isMultiple(c, unit) ? fmt(c) : `between ${fmt(Math.floor(c / unit) * unit)} and ${fmt(Math.floor(c / unit) * unit + unit)} (not on a gridline)`;
        out.push(`  ${fmt(m.edges[i])} to ${fmt(m.edges[i + 1])}: ${h}`);
      });
      return 'a histogram';
    }
    case 'box_plot': {
      const m = modelOf(spec, boxPlotModel);
      const unit = boxUnit(spec);
      if (m.xLabel) printed.push(`axis label: "${m.xLabel}"`);
      out.push(`${m.plots.length === 1 ? 'One box plot' : `${m.plots.length} box plots, one above the other,`} over a horizontal axis from ${fmt(m.range[0])} to ${fmt(m.range[1])} with gridlines every ${fmt(unit)}.`);
      const read = (v: number) => (m.showValues || isMultiple(v, unit) ? fmt(v) : `between ${fmt(Math.floor(v / unit) * unit)} and ${fmt(Math.floor(v / unit) * unit + unit)} (not on a gridline)`);
      m.plots.forEach((b, i) => {
        if (b.label) printed.push(`plot label: "${b.label}"`);
        const name = b.label === '?' ? `Box plot ${i + 1}, labelled with ${BLANK}` : b.label ? `Box plot "${b.label}"` : `Box plot ${i + 1}`;
        const dots = b.outliers.length ? `; separate dots at ${[...b.outliers].sort((x, y) => x - y).map(read).join(' and ')}` : '';
        out.push(`${name}: whisker from ${read(b.min)}, box from ${read(b.q1)} to ${read(b.q3)}, line inside the box at ${read(b.median)}, whisker to ${read(b.max)}${dots}.`);
      });
      if (m.showValues) printed.push('the five values of each plot, above it');
      return m.plots.length === 1 ? 'a box plot (box-and-whisker plot)' : 'a set of box plots (box-and-whisker plots) on one axis';
    }
    case 'polar_complex': {
      const m = modelOf(spec, polarComplexModel);
      const name = (q: PlanePoint, i: number) => (q.label === '?' ? `Point ${i + 1}, labelled with ${BLANK},` : q.label ? `Point "${q.label}"` : `Point ${i + 1} (no label)`);
      m.points.forEach((q) => {
        if (q.label) printed.push(`point label: "${q.label}"`);
        if (q.argumentLabel) printed.push(`angle label: "${q.argumentLabel}"`);
      });
      if (m.plane === 'complex') {
        const unit = minorOf(m.step ?? (m.range <= 6 ? 1 : niceStep(2 * m.range, 8)));
        printed.push('axis label: "Re"', 'axis label: "Im"');
        out.push(`The complex plane: a horizontal axis "Re" and a vertical axis "Im", both from ${fmt(-m.range)} to ${fmt(m.range)}, gridlines every ${fmt(unit)}.`);
        const read = (v: number) => (isMultiple(v, unit) ? fmt(v) : `between ${fmt(Math.floor(v / unit) * unit)} and ${fmt(Math.floor(v / unit) * unit + unit)}`);
        m.points.forEach((q, i) => {
          const extra = [q.showModulus || q.showArgument ? 'a segment from the origin to it is drawn' : '', q.showArgument ? `an arc from the positive Re axis to that segment is drawn${q.argumentLabel ? `, labelled "${q.argumentLabel}"` : ''}` : '', q.projections ? 'dashes run from it to both axes' : ''].filter(Boolean);
          out.push(`${name(q, i)} at (${read(q.re)}, ${read(q.im)}) — across, then up${extra.length ? `; ${extra.join('; ')}` : ''}.`);
        });
        return 'a complex plane with plotted numbers';
      }
      const circles = Math.round(m.rMax / m.rStep);
      out.push(`A polar grid: ${circles} circles about the pole at r = ${Array.from({ length: circles }, (_, k) => fmt((k + 1) * m.rStep)).join(', ')}, and a ray every ${m.angleStep}°${m.angleLabels === 'none' ? ' (the rays carry no labels)' : `, labelled in ${m.angleLabels} round the outside${m.rayLabelStep !== m.angleStep ? ` at every ${m.rayLabelStep}°` : ''}`}. The ray to the right is 0${m.circleLabelEvery > 1 ? `; along it only every ${ORDINALS[m.circleLabelEvery - 1]} circle carries its number` : '; the circles are numbered along it'}.`);
      if (m.angleLabels !== 'none') printed.push(`ray labels in ${m.angleLabels}`);
      const circle = (r: number) => (r < 1e-9 ? 'at the pole' : isMultiple(r, m.rStep) ? `on the ${ORDINALS[Math.round(r / m.rStep) - 1] ?? `${Math.round(r / m.rStep)}th`} circle (r = ${fmt(Number(r.toFixed(9)))})` : `between the circles r = ${fmt(Math.floor(r / m.rStep) * m.rStep)} and r = ${fmt(Math.floor(r / m.rStep) * m.rStep + m.rStep)}`);
      const rayName = (deg: number) => (m.angleLabels === 'radians' ? piText(deg, 180) : `${fmt(deg)}°`);
      m.points.forEach((q, i) => {
        const deg = norm360(q.r < 1e-9 ? 0 : q.givenTheta);
        const ray = isMultiple(deg, m.angleStep) ? `on the ${rayName(deg)} ray` : `between the ${rayName(Math.floor(deg / m.angleStep) * m.angleStep)} and ${rayName((Math.floor(deg / m.angleStep) * m.angleStep + m.angleStep) % 360)} rays`;
        out.push(`${name(q, i)}: ${circle(q.r)}${q.r < 1e-9 ? '' : ` ${ray}`}${q.showModulus || q.showArgument ? '; a segment from the pole to it is drawn' : ''}${q.showArgument ? '; an arc from the 0 ray to that segment is drawn' : ''}.`);
      });
      if (m.curve) {
        if (m.curve.label) printed.push(`legend entry: "${m.curve.label}"`);
        const cv = m.curve;
        out.push(`One curve is drawn${cv.label ? ` (legend "${cv.label}")` : ''}. Where it crosses each ray (distance from the pole):`);
        const inRange = (deg: number) => {
          for (let t = deg; t <= cv.to + 1e-9; t += 360) if (t >= cv.from - 1e-9) return t;
          for (let t = deg - 360; t >= cv.from - 1e-9; t -= 360) if (t <= cv.to + 1e-9) return t;
          return null;
        };
        for (let deg = 0; deg < 360; deg += m.angleStep) {
          const dist = new Set<string>();
          const direct = inRange(deg);
          if (direct !== null) {
            const v = cv.fn((direct * Math.PI) / 180);
            if (v > -1e-9) dist.add(circle(Math.abs(v)));
          }
          const opposite = inRange((deg + 180) % 360);
          if (opposite !== null) {
            const v = cv.fn((opposite * Math.PI) / 180);
            if (v < 1e-9) dist.add(circle(Math.abs(v)));
          }
          out.push(`  ${rayName(deg)} ray: ${dist.size ? [...dist].join('; and ') : 'the curve does not reach this ray'}`);
        }
      }
      return 'a polar grid with plotted points';
    }
    case 'punnett_square': {
      const m = modelOf(spec, punnettModel);
      if (m.topLabel) printed.push(`label above the grid: "${m.topLabel}"`);
      if (m.sideLabel) printed.push(`label beside the grid: "${m.sideLabel}"`);
      const head = (g: string, b: boolean) => (b ? BLANK : g);
      out.push(`A grid of ${m.side.length} rows and ${m.top.length} columns.`);
      out.push(`Gametes along the top edge${m.topLabel ? ` (parent "${m.topLabel}")` : ''}, left to right: ${m.top.map((g, j) => head(g, m.blankTop[j])).join(', ')}.`);
      out.push(`Gametes down the side${m.sideLabel ? ` (parent "${m.sideLabel}")` : ''}, top to bottom: ${m.side.map((g, i) => head(g, m.blankSide[i])).join(', ')}.`);
      out.push('Cells, left to right:');
      m.cells.forEach((row, i) => out.push(`  row ${i + 1} (side gamete ${m.blankSide[i] ? 'blank' : `"${m.side[i]}"`}): ${row.map((c) => (c.blank ? BLANK : c.genotype)).join(' | ')}`));
      const HATCH = ['hatched /', 'hatched \\', 'hatched —', 'hatched |'];
      m.phenotypes.forEach((ph, k) => {
        printed.push(`legend entry: "${ph.label}" (${HATCH[k]})`);
        const cells = m.cells.flatMap((row, i) => row.map((c, j) => (c.phenotype === k && !c.blank ? `row ${i + 1} column ${j + 1}` : '')).filter(Boolean));
        out.push(`Cells marked "${ph.label}" (${HATCH[k]}): ${cells.length ? cells.join(', ') : 'none'}.`);
      });
      if (m.phenotypes.length && m.cells.flat().some((c) => c.blank)) out.push('A blank cell carries no hatch (every phenotype class has one).');
      return 'a Punnett square';
    }
    case 'pedigree': {
      const m = modelOf(spec, pedigreeModel);
      const byId = new Map(m.individuals.map((i) => [i.id, i]));
      out.push(`A pedigree chart of ${m.generations.length} generations, numbered ${m.generations.map((_, g) => ['I', 'II', 'III', 'IV', 'V', 'VI'][g]).join(', ')} from the top; within a generation the individuals are numbered from the left. Squares are males, circles females${m.individuals.some((i) => i.sex === 'U') ? ', diamonds of unknown sex' : ''}; a horizontal line joins partners; children hang from a line below their parents.`);
      if (m.legend) printed.push('key: "male", "female", "affected"', ...(m.individuals.some((i) => i.carrier) ? ['key: "carrier"'] : []), ...(m.individuals.some((i) => i.unknown) ? ['key: "not known"'] : []));
      for (const row of m.generations) {
        for (const ind of row) {
          const status = ind.unknown ? 'status not shown ("?")' : ind.affected ? 'affected (filled)' : ind.carrier ? 'carrier (half-filled)' : 'unaffected (open)';
          const parts = [`${ind.number}${ind.label ? ` (labelled "${ind.label}")` : ''}: ${ind.sex === 'M' ? 'male' : ind.sex === 'F' ? 'female' : 'sex unknown'}, ${status}`];
          if (ind.father) parts.push(`child of ${(byId.get(ind.father) as PedigreeIndividual).number} and ${(byId.get(ind.mother as string) as PedigreeIndividual).number}`);
          const mates = m.matings.filter((c) => c.includes(ind.id)).map((c) => (byId.get(c[0] === ind.id ? c[1] : c[0]) as PedigreeIndividual).number);
          if (mates.length) parts.push(`partner of ${mates.join(' and ')}`);
          out.push(`${parts.join('; ')}.`);
        }
      }
      return 'a pedigree chart';
    }
    default:
      return '';
  }
}

// checkers --------------------------------------------------------------------

const BATCH1_CHECKERS: Record<string, CheckerDef> = {
  // unit_circle
  uc_coordinates: {
    kinds: ['unit_circle'], args: '{ angle: index, want?: pair | x | y }', returns: 'the exact coordinates of the point of a marked angle (a multiple of 30° or 45°), as "(x, y)", or one of them',
    run: (s, a) => {
      const ang = ucAngle(s, a);
      const want = a.want === undefined ? 'pair' : pick(a, 'want', ['pair', 'x', 'y'] as const);
      if (exactTrig('cos', ang.degrees) === null) return fail(`the angle ${fmt(ang.degrees)}° is not a multiple of 30° or 45° — its exact coordinates cannot be read off a unit circle`);
      return text(want === 'x' ? ang.cosText : want === 'y' ? ang.sinText : `(${ang.cosText}, ${ang.sinText})`);
    },
  },
  uc_reference_angle: {
    kinds: ['unit_circle'], args: '{ angle: index, unit?: degrees | radians }', returns: 'the reference angle of a marked angle (its size must be printed)',
    run: (s, a) => {
      const ang = ucAngle(s, a);
      if (ang.label === 'none' || ang.label === 'blank' || ang.labelText) fail('the size of that angle is not printed on the figure');
      const ref = referenceAngle(ang.degrees);
      if ((a.unit === undefined ? 'degrees' : pick(a, 'unit', ['degrees', 'radians'] as const)) === 'degrees') return num(ref);
      if (!isMultiple(ref, 15)) return fail('the reference angle is not a multiple of 15° — it has no short form in radians');
      return text(piText(Math.round(ref / 15), 12));
    },
  },
  uc_quadrant: {
    kinds: ['unit_circle'], args: '{ angle: index }', returns: 'the quadrant of the terminal side: the label "I", "II", "III" or "IV"',
    run: (s, a) => {
      const q = quadrantOf(ucAngle(s, a).degrees);
      if (q === 0) return fail('the terminal side lies on an axis, not in a quadrant');
      return { kind: 'label', value: ['I', 'II', 'III', 'IV'][q - 1] };
    },
  },
  uc_trig_value: {
    kinds: ['unit_circle'], args: `{ angle: index, fn: ${TRIG_FNS.join(' | ')} }`, returns: 'the exact value of a trigonometric function at a marked angle (a multiple of 30° or 45°), e.g. "−√3/2" or "undefined"',
    run: (s, a) => text(exactTrigValue(pick(a, 'fn', TRIG_FNS), ucAngle(s, a).degrees)),
  },
  // vector_diagram
  vec_components: {
    kinds: ['vector_diagram'], args: '{ vector: index | "resultant", want: x | y | pair }', returns: 'a component of an arrow (head minus tail), or both as "(x, y)"',
    run: (s, a) => { const [x, y] = comps(vecArg(s, a)); return vectorResult(x, y, pick(a, 'want', ['x', 'y', 'pair'] as const)); },
  },
  vec_magnitude: {
    kinds: ['vector_diagram'], args: '{ vector: index | "resultant" }', returns: 'the length of an arrow',
    run: (s, a) => { const [x, y] = comps(vecArg(s, a)); return vectorResult(x, y, 'magnitude'); },
  },
  vec_direction: {
    kinds: ['vector_diagram'], args: '{ vector: index | "resultant" }', returns: 'the direction of an arrow in degrees, counter-clockwise from the positive x-axis (0 to 360)',
    run: (s, a) => { const [x, y] = comps(vecArg(s, a)); return vectorResult(x, y, 'direction'); },
  },
  vec_resultant: {
    kinds: ['vector_diagram'], args: '{ want: x | y | pair | magnitude | direction, of?: [indices] — all the vectors when left out }', returns: 'the sum of the listed vectors: a component, both as "(x, y)", its length or its direction in degrees',
    run: (s, a) => {
      const m = modelOf(s, vectorDiagramModel);
      const of = a.of === undefined ? m.vectors.map((_, i) => i) : Array.isArray(a.of) ? (a.of as unknown[]) : fail('derivation argument "of" must be a list of vector indices');
      if (of.length < 2 || new Set(of).size !== of.length) fail('derivation argument "of" must list at least two different vectors');
      let x = 0;
      let y = 0;
      for (const k of of) {
        const [dx, dy] = comps(vecArg(s, { vector: k }));
        x += dx;
        y += dy;
      }
      return vectorResult(Number(x.toPrecision(12)), Number(y.toPrecision(12)), pick(a, 'want', ['x', 'y', 'pair', 'magnitude', 'direction'] as const));
    },
  },
  // free_body_diagram_v2
  fbd2_net_force: {
    kinds: ['free_body_diagram_v2'], args: '{ axis: x | y | magnitude | along | normal }', returns: 'the sum of the printed forces along the horizontal (right positive), the vertical (up positive), the incline (up-slope positive) or its normal (away from the surface positive), or the size of the total',
    run: (s, a) => {
      const m = modelOf(s, freeBodyModel);
      const axis = pick(a, 'axis', ['x', 'y', 'magnitude', 'along', 'normal'] as const);
      if (axis === 'magnitude') return roundish(Math.hypot(fbdSum(m, [1, 0]), fbdSum(m, [0, 1])));
      return roundish(fbdSum(m, fbdAxis(m, axis)));
    },
  },
  fbd2_missing_force: {
    kinds: ['free_body_diagram_v2'], args: '{ force: label or index, net?: number — the net force along the line of that force, positive in its direction; 0 when left out }', returns: 'the size of the one force whose size is not printed, from the balance along its own line',
    run: (s, a) => {
      const m = modelOf(s, freeBodyModel);
      const hit = typeof a.force === 'string' ? m.forces.filter((f) => f.label === (a.force as string).trim()) : isNum(a.force) && m.forces[a.force] ? [m.forces[a.force]] : [];
      if (hit.length !== 1) return fail('derivation argument "force" must be the label (or 0-based index) of exactly one force');
      const f = hit[0];
      if (f.showMagnitude) return fail(`the size of "${f.label}" is printed on the figure`);
      if (!fbdReadable(m, f)) fail(`the direction of "${f.label}" is not printed on the figure (no angle arc)`);
      const net = a.net === undefined ? 0 : argNum(a, 'net');
      const size = net - fbdSum(m, unitOf(f), f);
      if (!(size > 1e-9)) return fail(`the balance gives ${fmt(Number(size.toFixed(6)))} for "${f.label}" — the arrow would point the other way`);
      return roundish(size);
    },
  },
  // shaded_region
  region_area: {
    kinds: ['shaded_region'], args: '{}', returns: 'the area of the shaded region when every side is straight and every corner is on a gridline',
    run: (s) => num(regionArea(modelOf(s, shadedRegionModel))),
  },
  region_vertex_count: {
    kinds: ['shaded_region'], args: '{}', returns: 'the number of corners of the shaded region (straight sides, corners on gridlines)',
    run: (s) => { const m = modelOf(s, shadedRegionModel); const poly = regionPolygon(m); return num(m.region.type === 'under_curve' && poly.length === 6 ? 6 : poly.length); },
  },
  region_contains: {
    kinds: ['shaded_region'], args: '{ x: number, y: number }', returns: 'the label "yes" or "no" — whether the point belongs to the shaded solution set (a point on a dashed boundary does not)',
    run: (s, a) => {
      const m = modelOf(s, shadedRegionModel);
      const unit = planeUnit(m);
      const x = needGrid(argNum(a, 'x'), unit, 'the x-coordinate of the point');
      const y = needGrid(argNum(a, 'y'), unit, 'the y-coordinate of the point');
      if (x < m.xRange[0] || x > m.xRange[1] || y < m.yRange[0] || y > m.yRange[1]) fail('the point is outside the plot');
      return yesNo(regionContains(m, x, y));
    },
  },
  // number_line
  nl_interval_notation: {
    kinds: ['number_line'], args: '{}', returns: 'the set shown, in interval notation — e.g. "(−3, 4]", "(−∞, −1/2] ∪ (5/4, ∞)", "{2}" for a single point',
    run: (s) => {
      const m = modelOf(s, numberLineModel);
      const pieces = lineSet(m);
      if (pieces.length === 0) return fail('the number line shows no set (no thick segment and no filled dot)');
      for (const pc of pieces) for (const v of [pc.from, pc.to]) if (Number.isFinite(v)) needGrid(v - m.min, m.tickSpacing, 'an end of the set shown');
      return text(intervalNotation(pieces, s.params.denominator ? asFraction : mn));
    },
  },
  nl_contains: {
    kinds: ['number_line'], args: '{ x: number }', returns: 'the label "yes" or "no" — whether the number belongs to the set shown',
    run: (s, a) => {
      const x = argNum(a, 'x');
      return yesNo(lineSet(modelOf(s, numberLineModel)).some((pc) => (x > pc.from || (x === pc.from && !pc.fromOpen)) && (x < pc.to || (x === pc.to && !pc.toOpen))));
    },
  },
  nl_point_value: {
    kinds: ['number_line'], args: '{ point: index }', returns: 'the number at a marked point (it must sit on a tick)',
    run: (s, a) => {
      const m = modelOf(s, numberLineModel);
      if (m.points.length === 0) return fail('the number line marks no separate point');
      const q = m.points[argIndex(a, 'point', m.points.length, 'marked point')];
      needGrid(q.x - m.min, m.tickSpacing, 'the marked point');
      return num(q.x);
    },
  },
  // sign_chart
  sc_sign: {
    kinds: ['sign_chart'], args: '{ row: index, interval: index — 0 is left of the first critical number }', returns: 'the label "positive" or "negative": the sign of that row on that interval',
    run: (s, a) => {
      const { row } = signRow(s, a);
      const sgn = row.signs[argIndex(a, 'interval', row.signs.length, 'interval')];
      if (!sgn) return fail('the sign on that interval is not given in the spec');
      return { kind: 'label', value: sgn === '+' ? 'positive' : 'negative' };
    },
  },
  sc_sign_change: {
    kinds: ['sign_chart'], args: `{ row: index, want: ${WANT.join(' | ')} }`, returns: 'the critical number(s) at which that row changes sign',
    run: (s, a) => { const { m, row } = signRow(s, a); return select(signChanges(row, m), pick(a, 'want', WANT), 'sign changes'); },
  },
  sc_local_extrema: {
    kinds: ['sign_chart'], args: `{ row: index of the f′ row, which: max | min, want: ${WANT.join(' | ')} }`, returns: 'where f has a local maximum (f′ goes from + to −) or minimum (− to +), read from the f′ row',
    run: (s, a) => {
      const { m, row } = signRow(s, a);
      const which = pick(a, 'which', ['max', 'min'] as const);
      const xs = which === 'max' ? signChanges(row, m, '+', '-') : signChanges(row, m, '-', '+');
      for (const x of xs) {
        const k = m.critical.findIndex((c) => c.value === x);
        if (row.at[k] === 'und') fail(`the row is undefined at ${fmt(x)} — whether f has an extremum there depends on f being defined there, which the chart does not show`);
      }
      return select(xs, pick(a, 'want', WANT), `local ${which === 'max' ? 'maxima' : 'minima'}`);
    },
  },
  sc_intervals: {
    kinds: ['sign_chart'], args: '{ row: index, sign: positive | negative }', returns: 'the open intervals on which that row has the sign, in interval notation',
    run: (s, a) => {
      const { m, row } = signRow(s, a);
      const want = pick(a, 'sign', ['positive', 'negative'] as const) === 'positive' ? '+' : '-';
      if (row.signs.some((x) => !x)) fail('a sign of that row is not given in the spec');
      const pieces: Piece[] = [];
      row.signs.forEach((sg, k) => {
        if (sg === want) pieces.push({ from: k === 0 ? -Infinity : m.critical[k - 1].value, to: k === m.critical.length ? Infinity : m.critical[k].value, fromOpen: true, toOpen: true });
      });
      if (pieces.length === 0) return fail('the row never has that sign');
      return text(intervalNotation(pieces, asFraction));
    },
  },
  // distribution_curve
  normal_shaded_area: {
    kinds: ['distribution_curve'], args: '{ method: empirical | exact, as?: proportion | percent }', returns: 'the total shaded share of the distribution — by the 68–95–99.7 rule (every bound a whole number of standard deviations from the mean) or from the normal distribution itself',
    run: (s, a) => {
      const m = modelOf(s, distributionModel);
      if (m.shade.length === 0) return fail('nothing is shaded on the curve');
      const method = pick(a, 'method', ['empirical', 'exact'] as const);
      const scale = (a.as === undefined ? 'proportion' : pick(a, 'as', ['proportion', 'percent'] as const)) === 'percent' ? 100 : 1;
      let total = 0;
      for (const sh of m.shade) {
        if (method === 'exact') {
          total += normalArea(m.mean, m.sd, sh.from, sh.to);
          continue;
        }
        const cdf = (b: number | null, tail: number): number => {
          if (b === null) return tail;
          const z = (b - m.mean) / m.sd;
          if (!isMultiple(z, 1) || Math.abs(z) > 3 + 1e-9) return fail('a bound is not a whole number of standard deviations from the mean (up to 3) — the 68–95–99.7 rule does not give that area');
          return EMPIRICAL_CDF[Math.round(z)];
        };
        total += cdf(sh.to, 1) - cdf(sh.from, 0);
      }
      return method === 'exact' ? approx(total * scale) : num(Number((total * scale).toFixed(6)));
    },
  },
  normal_bound: {
    kinds: ['distribution_curve'], args: '{ shade: index, end: from | to, as?: x | z }', returns: 'the value at one end of a shaded interval, on the axis or as a z-score',
    run: (s, a) => {
      const m = modelOf(s, distributionModel);
      if (m.shade.length === 0) return fail('nothing is shaded on the curve');
      const sh = m.shade[argIndex(a, 'shade', m.shade.length, 'shaded interval')];
      const b = sh[pick(a, 'end', ['from', 'to'] as const)];
      if (b === null) return fail('that end is a tail — it has no bound');
      return num((a.as === undefined ? 'x' : pick(a, 'as', ['x', 'z'] as const)) === 'z' ? (b - m.mean) / m.sd : b);
    },
  },
  // histogram
  hist_count: {
    kinds: ['histogram'], args: '{ bin: index }', returns: 'the frequency of one class (for a blank class: the value under the "?")',
    run: (s, a) => {
      const m = modelOf(s, histogramModel);
      const k = argIndex(a, 'bin', m.counts.length, 'class');
      if (!m.showCounts && !m.blank[k]) needGrid(m.counts[k], minorOf(m.yStep), 'the height of that bar');
      return num(m.counts[k]);
    },
  },
  hist_total: {
    kinds: ['histogram'], args: '{}', returns: 'the total frequency over all classes (blank classes included with their true value)',
    run: (s) => {
      const m = modelOf(s, histogramModel);
      m.counts.forEach((c, i) => { if (!m.showCounts && !m.blank[i]) needGrid(c, minorOf(m.yStep), `the height of bar ${i}`); });
      return num(m.counts.reduce((t, c) => t + c, 0));
    },
  },
  hist_count_between: {
    kinds: ['histogram'], args: '{ from: number, to: number — both class boundaries }', returns: 'the total frequency of the classes from one boundary to another',
    run: (s, a) => {
      const m = modelOf(s, histogramModel);
      const idx = (v: number) => { const k = m.edges.findIndex((e) => Math.abs(e - v) < 1e-9); return k < 0 ? fail(`${fmt(v)} is not a class boundary of the histogram`) : k; };
      const i = idx(argNum(a, 'from'));
      const j = idx(argNum(a, 'to'));
      if (j <= i) fail('"to" must be a boundary to the right of "from"');
      let total = 0;
      for (let k = i; k < j; k++) {
        if (!m.showCounts && !m.blank[k]) needGrid(m.counts[k], minorOf(m.yStep), `the height of bar ${k}`);
        total += m.counts[k];
      }
      return num(total);
    },
  },
  hist_modal_class: {
    kinds: ['histogram'], args: '{}', returns: 'the two boundaries of the tallest class',
    run: (s) => {
      const m = modelOf(s, histogramModel);
      if (m.blank.some(Boolean)) fail('a class is blank — the tallest class cannot be told from the figure');
      const top = Math.max(...m.counts);
      const hits = m.counts.map((c, i) => (c === top ? i : -1)).filter((i) => i >= 0);
      if (hits.length !== 1) return fail(`two classes share the greatest frequency (${hits.length} of them) — there is no single modal class`);
      return { kind: 'numbers', values: [m.edges[hits[0]], m.edges[hits[0] + 1]] };
    },
  },
  // box_plot
  box_stat: {
    kinds: ['box_plot'], args: `{ plot: index, stat: ${BOX_STATS.join(' | ')} }`, returns: 'a value read from one box plot (range = greatest − least value shown, outliers included; iqr = q3 − q1)',
    run: (s, a) => {
      const m = modelOf(s, boxPlotModel);
      return num(boxStat(m.plots[argIndex(a, 'plot', m.plots.length, 'box plot')], pick(a, 'stat', BOX_STATS), boxUnit(s)));
    },
  },
  box_compare: {
    kinds: ['box_plot'], args: `{ stat: ${BOX_STATS.join(' | ')}, which: greatest | least }`, returns: 'the label of the box plot with the greatest (or least) value of that statistic',
    run: (s, a) => {
      const m = modelOf(s, boxPlotModel);
      if (m.plots.length < 2 || m.plots.some((b) => !b.label || b.label === '?')) return fail('this needs at least two box plots, each with its own printed label');
      const stat = pick(a, 'stat', BOX_STATS);
      const sign = pick(a, 'which', ['greatest', 'least'] as const) === 'greatest' ? 1 : -1;
      const vals = m.plots.map((b) => sign * boxStat(b, stat, boxUnit(s)));
      const best = Math.max(...vals);
      const hits = vals.map((v, i) => (Math.abs(v - best) < 1e-9 ? i : -1)).filter((i) => i >= 0);
      if (hits.length !== 1) return fail(`${hits.length} box plots share that value — there is no single answer`);
      return { kind: 'label', value: m.plots[hits[0]].label as string };
    },
  },
  // polar_complex
  pc_modulus: {
    kinds: ['polar_complex'], args: '{ point: index }', returns: 'the distance of a plotted point from the origin (the modulus of the complex number)',
    run: (s, a) => { const pts = planePoints(s); const q = pts[argIndex(a, 'point', pts.length, 'plotted point')]; return complexResult(q.re, q.im, 'modulus'); },
  },
  pc_argument: {
    kinds: ['polar_complex'], args: '{ point: index, unit?: degrees | radians, range?: positive (0 to 360) | principal (−180 to 180) }', returns: 'the angle of a plotted point from the positive real axis / polar axis',
    run: (s, a) => {
      const pts = planePoints(s);
      const q = pts[argIndex(a, 'point', pts.length, 'plotted point')];
      if (q.r < 1e-9) return fail('the origin has no argument');
      const principal = (a.range === undefined ? 'positive' : pick(a, 'range', ['positive', 'principal'] as const)) === 'principal';
      const deg = principal ? q.theta : norm360(q.theta);
      if ((a.unit === undefined ? 'degrees' : pick(a, 'unit', ['degrees', 'radians'] as const)) === 'degrees') return isMultiple(deg, 15) ? num(Math.round(deg)) : approx(deg);
      if (!isMultiple(deg, 15)) return fail('the argument is not a multiple of 15° — it has no short form in radians');
      return text(piText(Math.round(deg / 15), 12));
    },
  },
  pc_sum: {
    kinds: ['polar_complex'], args: '{ points: [index, index], want?: number | re | im | modulus }', returns: 'the sum of two plotted complex numbers, as "a + bi", or its real part, imaginary part or modulus',
    run: (s, a) => { const [u, v] = twoPoints(s, a); return complexResult(u.re + v.re, u.im + v.im, a.want === undefined ? 'number' : pick(a, 'want', ['number', 're', 'im', 'modulus'] as const)); },
  },
  pc_product: {
    kinds: ['polar_complex'], args: '{ points: [index, index], want?: number | re | im | modulus }', returns: 'the product of two plotted complex numbers, as "a + bi", or its real part, imaginary part or modulus',
    run: (s, a) => { const [u, v] = twoPoints(s, a); return complexResult(u.re * v.re - u.im * v.im, u.re * v.im + u.im * v.re, a.want === undefined ? 'number' : pick(a, 'want', ['number', 're', 'im', 'modulus'] as const)); },
  },
  // punnett_square
  punnett_genotype_ratio: {
    kinds: ['punnett_square'], args: '{ genotypes: [the genotypes, in the order of the ratio] }', returns: 'the ratio of the listed genotypes among the cells, in lowest terms, e.g. "1:2:1"',
    run: (s, a) => {
      const m = modelOf(s, punnettModel);
      const list = Array.isArray(a.genotypes) && a.genotypes.length >= 2 && a.genotypes.every((g) => typeof g === 'string') ? (a.genotypes as string[]) : fail('derivation argument "genotypes" must list at least two genotypes');
      const all = m.cells.flat().map((c) => c.genotype);
      const counts = list.map((g) => all.filter((x) => x === g).length);
      counts.forEach((c, i) => { if (c === 0) fail(`the genotype "${list[i]}" does not occur in the square`); });
      if (counts.reduce((t, c) => t + c, 0) !== all.length) fail('the listed genotypes do not cover every cell of the square');
      return text(ratioText(counts));
    },
  },
  punnett_phenotype_ratio: {
    kinds: ['punnett_square'], args: '{}', returns: 'the ratio of the phenotype classes among the cells, in the order of the legend, in lowest terms, e.g. "3:1"',
    run: (s) => {
      const m = modelOf(s, punnettModel);
      if (m.phenotypes.length < 2) return fail('the spec gives no phenotypes (at least two classes are needed for a ratio)');
      const counts = m.phenotypes.map((_, k) => m.cells.flat().filter((c) => c.phenotype === k).length);
      counts.forEach((c, k) => { if (c === 0) fail(`the phenotype "${m.phenotypes[k].label}" does not occur in the square`); });
      return text(ratioText(counts));
    },
  },
  punnett_probability: {
    kinds: ['punnett_square'], args: '{ genotype: string } or { phenotype: label }, as?: fraction | percent', returns: 'the share of the cells with that genotype or phenotype (each cell equally likely)',
    run: (s, a) => {
      const m = modelOf(s, punnettModel);
      const cells = m.cells.flat();
      let hits: number;
      if (typeof a.genotype === 'string') hits = cells.filter((c) => c.genotype === a.genotype).length;
      else if (typeof a.phenotype === 'string') {
        const k = m.phenotypes.findIndex((ph) => ph.label === a.phenotype);
        if (k < 0) return fail(`the spec has no phenotype "${a.phenotype}"`);
        hits = cells.filter((c) => c.phenotype === k).length;
      } else return fail('give "genotype" or "phenotype"');
      if (hits === 0) return fail('that class does not occur in the square');
      const share = hits / cells.length;
      return num((a.as === undefined ? 'fraction' : pick(a, 'as', ['fraction', 'percent'] as const)) === 'percent' ? share * 100 : share);
    },
  },
  punnett_cell: {
    kinds: ['punnett_square'], args: '{ row: index, col: index }', returns: 'the genotype of one cell (for a blank cell: what belongs under the "?")',
    run: (s, a) => { const m = modelOf(s, punnettModel); return text(m.cells[argIndex(a, 'row', m.side.length, 'row')][argIndex(a, 'col', m.top.length, 'column')].genotype); },
  },
  punnett_gamete: {
    kinds: ['punnett_square'], args: '{ edge: top | side, index: number }', returns: 'one gamete on an edge of the square (for a blank header: what belongs under the "?")',
    run: (s, a) => { const m = modelOf(s, punnettModel); const list = pick(a, 'edge', ['top', 'side'] as const) === 'top' ? m.top : m.side; return text(list[argIndex(a, 'index', list.length, 'gamete')]); },
  },
  // pedigree
  pedigree_count: {
    kinds: ['pedigree'], args: '{ sex?: M | F, status?: affected | unaffected | carrier, generation?: number (1 = the top row) }', returns: 'how many individuals of the chart fit (an unaffected count includes carriers and leaves out a "?")',
    run: (s, a) => {
      const m = modelOf(s, pedigreeModel);
      const sex = a.sex === undefined ? null : pick(a, 'sex', ['M', 'F'] as const);
      const status = a.status === undefined ? null : pick(a, 'status', ['affected', 'unaffected', 'carrier'] as const);
      const g = a.generation === undefined ? null : argNum(a, 'generation');
      if (g !== null && (!Number.isInteger(g) || g < 1 || g > m.generations.length)) fail(`derivation argument "generation" must be from 1 to ${m.generations.length}`);
      return num(m.individuals.filter((i) => (sex === null || i.sex === sex) && (g === null || i.generation === g - 1)
        && (status === null || (status === 'affected' ? i.affected : status === 'carrier' ? i.carrier : !i.affected && !i.unknown))).length);
    },
  },
  pedigree_mode_consistent: {
    kinds: ['pedigree'], args: `{ mode: ${INHERITANCE_MODES.join(' | ')} }`, returns: 'the label "yes" or "no" — whether the chart can be explained by that mode of inheritance (full penetrance, no new mutation)',
    run: (s, a) => yesNo(pedigreeConsistent(modelOf(s, pedigreeModel), pick(a, 'mode', INHERITANCE_MODES))),
  },
  pedigree_only_mode: {
    kinds: ['pedigree'], args: '{}', returns: 'the one mode of inheritance, of autosomal dominant / autosomal recessive / X-linked dominant / X-linked recessive, that the chart fits — refused unless exactly one does',
    run: (s) => {
      const m = modelOf(s, pedigreeModel);
      const ok = INHERITANCE_MODES.filter((mode) => pedigreeConsistent(m, mode));
      if (ok.length !== 1) return fail(`${ok.length} of the four modes fit the chart${ok.length ? ` (${ok.map((k) => MODE_WORDS[k]).join(', ')})` : ''} — it does not single one out`);
      return { kind: 'label', value: MODE_WORDS[ok[0]] };
    },
  },
};

function ratioText(counts: number[]): string {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  const g = counts.reduce((x, y) => gcd(x, y));
  return counts.map((c) => c / g).join(':');
}

export const CHECKERS: Record<string, CheckerDef> = {
  // function_graph
  curve_value: { kinds: ['function_graph'], args: '{ curve: index, x: number }', returns: 'the height of the curve at a gridline x', run: (s, a, ax) => num(curveValueOnGrid(curveArg(s, a, ax), argNum(a, 'x'), ax)) },
  curve_slope: {
    kinds: ['function_graph'], args: '{ curve: index, x1: number, x2: number }', returns: 'the slope between two grid points of the curve (rise over run)',
    run: (s, a, ax) => {
      const c = curveArg(s, a, ax);
      const x1 = argNum(a, 'x1');
      const x2 = argNum(a, 'x2');
      if (x1 === x2) fail('x1 and x2 must differ');
      return num((curveValueOnGrid(c, x2, ax) - curveValueOnGrid(c, x1, ax)) / (x2 - x1));
    },
  },
  curve_zeros: {
    kinds: ['function_graph'], args: `{ curve: index, want: ${WANT.join(' | ')} }`, returns: 'the x-intercept(s) of the curve that fall on gridlines',
    run: (s, a, ax) => {
      const c = curveArg(s, a, ax);
      return select(gridZeros(c.fn, ax.x!, c.from, c.to, 'an x-intercept'), pick(a, 'want', WANT), 'x-intercepts');
    },
  },
  curve_y_intercept: { kinds: ['function_graph'], args: '{ curve: index }', returns: 'the height of the curve at x = 0', run: (s, a, ax) => num(curveValueOnGrid(curveArg(s, a, ax), 0, ax)) },
  curve_extremum: {
    kinds: ['function_graph'], args: '{ curve: index, which: max | min, want: value | x }', returns: 'the highest or lowest point of the drawn curve (its height, or where it is)',
    run: (s, a, ax) => {
      const c = curveArg(s, a, ax);
      const which = pick(a, 'which', ['max', 'min'] as const);
      const want = pick(a, 'want', ['value', 'x'] as const);
      const sign = which === 'max' ? 1 : -1;
      let best = -Infinity;
      let at = NaN;
      for (let k = 0; k <= 4000; k++) {
        const x = c.from + ((c.to - c.from) * k) / 4000;
        const v = sign * c.fn(x);
        if (Number.isFinite(v) && v > best) {
          best = v;
          at = x;
        }
      }
      const name = which === 'max' ? 'highest' : 'lowest';
      if (!Number.isFinite(best)) return fail('the curve has no value on the part that is drawn');
      const value = sign * best;
      if (value > ax.y!.max + 1e-9 || value < ax.y!.min - 1e-9) fail('the curve leaves the plot, so its extreme height is not shown');
      // The HEIGHT of a peak is read against the horizontal gridlines wherever
      // the peak is; WHERE it is can be read only at a vertical gridline.
      const tol = 1e-5 * (ax.y!.max - ax.y!.min);
      const level = Math.round(value / ax.y!.minor) * ax.y!.minor;
      if (Math.abs(level - value) > tol) return fail(`the ${name} height of the curve (${fmt(Number(value.toPrecision(6)))}) does not lie on a gridline, so it cannot be read off exactly`);
      if (want === 'value') return num(level);
      const gx = Math.round(at / ax.x!.minor) * ax.x!.minor;
      if (Math.abs(sign * c.fn(gx) - best) > tol) return fail(`the ${name} point of the curve is not at a vertical gridline`);
      const ties = gridValues(ax.x!, c.from, c.to).filter((x) => Math.abs(sign * c.fn(x) - best) <= tol);
      if (ties.length !== 1) fail(`the curve reaches its ${name} height at more than one gridline`);
      return num(gx);
    },
  },
  curves_intersection: {
    kinds: ['function_graph'], args: `{ a: index, b: index, want: ${WANT.join(' | ')} | y }`, returns: 'the x-value(s) where two curves cross on gridlines (or, with want y, the height of the single crossing)',
    run: (s, a, ax) => {
      const c1 = curveArg(s, a, ax, 'a');
      const c2 = curveArg(s, a, ax, 'b');
      if (c1 === c2) fail('a and b must be different curves');
      const from = Math.max(c1.from, c2.from);
      const to = Math.min(c1.to, c2.to);
      const want = pick(a, 'want', [...WANT, 'y'] as const);
      const xs = gridZeros((x) => c1.fn(x) - c2.fn(x), ax.x!, from, to, 'a crossing of the two curves');
      xs.forEach((x) => curveValueOnGrid(c1, x, ax));
      if (want === 'y') return num(c1.fn((select(xs, 'only', 'crossings') as { value: number }).value));
      return select(xs, want, 'crossings');
    },
  },
  point_coordinate: { kinds: ['function_graph', 'scatter_plot'], args: '{ point: label or index, want: x | y }', returns: 'a coordinate of a marked point that sits on gridlines', run: (s, a, ax) => num(dotOnGrid(dotArg(s, a, 'point'), ax)[pick(a, 'want', ['x', 'y'] as const)]) },
  points_slope: {
    kinds: ['function_graph', 'scatter_plot'], args: '{ p1: label or index, p2: label or index }', returns: 'the slope of the line through two marked points that sit on gridlines',
    run: (s, a, ax) => {
      const p1 = dotOnGrid(dotArg(s, a, 'p1'), ax);
      const p2 = dotOnGrid(dotArg(s, a, 'p2'), ax);
      if (p1.x === p2.x) fail('the two points have the same x');
      return num((p2.y - p1.y) / (p2.x - p1.x));
    },
  },
  // motion_graph (any straight-segment graph)
  series_value: { kinds: ['motion_graph'], args: '{ series: index, t: number }', returns: 'the height of the line at a gridline position', run: (s, a, ax) => num(seriesValueOnGrid(seriesArg(s, a), argNum(a, 't'), ax)) },
  series_slope: {
    kinds: ['motion_graph'], args: '{ series: index, t1: number, t2: number }', returns: 'the slope between two grid points of the line (the average rate of change from t1 to t2)',
    run: (s, a, ax) => {
      const se = seriesArg(s, a);
      const t1 = argNum(a, 't1');
      const t2 = argNum(a, 't2');
      if (t1 === t2) fail('t1 and t2 must differ');
      return num((seriesValueOnGrid(se, t2, ax) - seriesValueOnGrid(se, t1, ax)) / (t2 - t1));
    },
  },
  series_extremum: {
    kinds: ['motion_graph'], args: '{ series: index, which: max | min, want: value | t }', returns: 'the highest or lowest height of the line (or the position where it is reached)',
    run: (s, a, ax) => {
      const se = seriesArg(s, a);
      const sign = pick(a, 'which', ['max', 'min'] as const) === 'max' ? 1 : -1;
      const want = pick(a, 'want', ['value', 't'] as const);
      const best = Math.max(...se.pts.map((q) => sign * q[1]));
      const at = se.pts.filter((q) => Math.abs(sign * q[1] - best) < 1e-9);
      if (want === 't' && at.length !== 1) fail('the line stays at its extreme height over more than one corner point');
      mustBeOnGrid(at[0][1], ax.y, 'the extreme height of the line');
      return num(want === 't' ? mustBeOnGrid(at[0][0], ax.x, 'the position of the extreme') : at[0][1]);
    },
  },
  series_area: {
    kinds: ['motion_graph'], args: '{ series: index, t1: number, t2: number }', returns: 'the signed area between the line and the horizontal axis from t1 to t2 (areas below the axis count negative)',
    run: (s, a, ax) => {
      const se = seriesArg(s, a);
      const t1 = argNum(a, 't1');
      const t2 = argNum(a, 't2');
      if (!(t2 > t1)) fail('t2 must be greater than t1');
      seriesValueOnGrid(se, t1, ax);
      seriesValueOnGrid(se, t2, ax);
      // Every corner inside the interval must be readable, or the shape cannot be measured.
      const inner = se.pts.filter((q) => q[0] > t1 + 1e-9 && q[0] < t2 - 1e-9);
      inner.forEach((q) => {
        mustBeOnGrid(q[0], ax.x, 'a corner of the line');
        mustBeOnGrid(q[1], ax.y, 'a corner of the line');
      });
      const ts = [t1, ...inner.map((q) => q[0]), t2];
      let area = 0;
      for (let i = 1; i < ts.length; i++) area += ((seriesAt(se.pts, ts[i - 1]) + seriesAt(se.pts, ts[i])) / 2) * (ts[i] - ts[i - 1]);
      return num(area);
    },
  },
  series_crossing: {
    kinds: ['motion_graph'], args: `{ series: index, value: number, want: ${WANT.join(' | ')} }`, returns: 'the position(s) where the line is at the given height',
    run: (s, a, ax) => {
      const se = seriesArg(s, a);
      const value = mustBeOnGrid(argNum(a, 'value'), ax.y, 'the height asked about');
      const hits: number[] = [];
      for (let i = 1; i < se.pts.length; i++) {
        const [t0, v0] = se.pts[i - 1];
        const [t1, v1] = se.pts[i];
        if (Math.abs(v0 - value) < 1e-9 && Math.abs(v1 - value) < 1e-9) fail('the line stays at that height over a whole stretch, not at single positions');
        if ((v0 - value) * (v1 - value) < 0) hits.push(t0 + ((value - v0) * (t1 - t0)) / (v1 - v0));
      }
      for (const [t, v] of se.pts) if (Math.abs(v - value) < 1e-9) hits.push(t);
      const uniq = [...new Set(hits.map((h) => Number(h.toPrecision(10))))];
      uniq.forEach((h) => mustBeOnGrid(h, ax.x, 'a position where the line is at that height'));
      return select(uniq, pick(a, 'want', WANT), 'such positions');
    },
  },
  // bar_chart
  bar_value: { kinds: ['bar_chart'], args: '{ category: name or index }', returns: 'the height of one bar', run: (s, a, ax) => num(barArg(barsOf(s, ax), a, 'category').value) },
  bar_extreme: {
    kinds: ['bar_chart'], args: '{ which: largest | smallest }', returns: 'the NAME of the tallest or shortest bar',
    run: (s, a, ax) => {
      const bars = barsOf(s, ax);
      const sign = pick(a, 'which', ['largest', 'smallest'] as const) === 'largest' ? 1 : -1;
      const best = Math.max(...bars.map((b) => sign * b.value));
      const hit = bars.filter((b) => sign * b.value === best);
      if (hit.length !== 1) return fail('two bars tie for that extreme');
      return { kind: 'label', value: hit[0].name };
    },
  },
  bar_difference: { kinds: ['bar_chart'], args: '{ a: name or index, b: name or index }', returns: 'height of bar a minus height of bar b', run: (s, a, ax) => num(barArg(barsOf(s, ax), a, 'a').value - barArg(barsOf(s, ax), a, 'b').value) },
  bar_sum: {
    kinds: ['bar_chart'], args: '{ categories?: list of names or indices (all bars when left out) }', returns: 'the sum of the heights of the listed bars',
    run: (s, a, ax) => {
      const bars = barsOf(s, ax);
      const list = Array.isArray(a.categories) ? a.categories.map((c) => barArg(bars, { c }, 'c')) : bars;
      if (new Set(list).size !== list.length) fail('a bar is listed twice');
      return num(list.reduce((t, b) => t + b.value, 0));
    },
  },
  bar_ratio: { kinds: ['bar_chart'], args: '{ a: name or index, b: name or index }', returns: 'height of bar a divided by height of bar b', run: (s, a, ax) => {
    const b = barArg(barsOf(s, ax), a, 'b').value;
    if (b === 0) fail('bar b has height 0');
    return num(barArg(barsOf(s, ax), a, 'a').value / b);
  } },
  // line_plot (dot plot)
  dot_count: {
    kinds: ['line_plot'], args: '{ value: number } or { min?: number, max?: number } (inclusive; no argument = all dots)', returns: 'how many dots sit at a value, or in a range of values',
    run: (s, a) => {
      const values = s.params.values as number[];
      if (isNum(a.value)) return num(values.filter((v) => Math.abs(v - (a.value as number)) < 1e-9).length);
      const lo = isNum(a.min) ? a.min : -Infinity;
      const hi = isNum(a.max) ? a.max : Infinity;
      return num(values.filter((v) => v >= lo - 1e-9 && v <= hi + 1e-9).length);
    },
  },
  dot_mode: {
    kinds: ['line_plot'], args: '{}', returns: 'the value with the tallest stack (the mode)',
    run: (s) => {
      const count = new Map<number, number>();
      for (const v of s.params.values as number[]) count.set(v, (count.get(v) ?? 0) + 1);
      const best = Math.max(...count.values());
      const modes = [...count.entries()].filter(([, n]) => n === best).map(([v]) => v);
      if (modes.length !== 1) return fail('two stacks tie for the tallest, so there is no single mode');
      return num(modes[0]);
    },
  },
  dot_median: {
    kinds: ['line_plot'], args: '{}', returns: 'the median of the plotted values',
    run: (s) => {
      const v = [...(s.params.values as number[])].sort((x, y) => x - y);
      return num(v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2);
    },
  },
  dot_range: { kinds: ['line_plot'], args: '{}', returns: 'greatest plotted value minus least plotted value', run: (s) => num(Math.max(...(s.params.values as number[])) - Math.min(...(s.params.values as number[]))) },
  dot_extreme: { kinds: ['line_plot'], args: '{ which: max | min }', returns: 'the greatest or the least plotted value', run: (s, a) => num(pick(a, 'which', ['max', 'min'] as const) === 'max' ? Math.max(...(s.params.values as number[])) : Math.min(...(s.params.values as number[]))) },
  dot_mean: { kinds: ['line_plot'], args: '{}', returns: 'the mean of the plotted values', run: (s) => num((s.params.values as number[]).reduce((t, v) => t + v, 0) / (s.params.values as number[]).length) },
  // scatter_plot
  scatter_count: {
    kinds: ['scatter_plot'], args: '{ xMin?, xMax?, yMin?, yMax?: numbers on gridlines }', returns: 'how many dots lie strictly inside the stated bounds (a dot exactly on a bound is refused as ambiguous)',
    run: (s, a, ax) => {
      const b = { xMin: -Infinity, xMax: Infinity, yMin: -Infinity, yMax: Infinity };
      for (const k of Object.keys(b) as Array<keyof typeof b>) {
        if (a[k] === undefined) continue;
        b[k] = mustBeOnGrid(argNum(a, k), k.startsWith('x') ? ax.x : ax.y, `the bound ${k}`);
      }
      const pts = pointsOf(s);
      if (pts.some((q) => [b.xMin, b.xMax].some((v) => Math.abs(q.x - v) < 1e-9) || [b.yMin, b.yMax].some((v) => Math.abs(q.y - v) < 1e-9))) fail('a dot lies exactly on one of the bounds');
      return num(pts.filter((q) => q.x > b.xMin && q.x < b.xMax && q.y > b.yMin && q.y < b.yMax).length);
    },
  },
  trend_value: {
    kinds: ['scatter_plot'], args: '{ x: number }', returns: 'the height of the drawn straight line at a gridline x',
    run: (s, a, ax) => {
      const t = trendOf(s, pointsOf(s)) ?? fail('the figure has no drawn line (trendLine)');
      const x = mustBeOnGrid(argNum(a, 'x'), ax.x, 'x');
      return num(mustBeOnGrid(t.slope * x + t.intercept, ax.y, `the height of the line at x = ${fmt(x)}`));
    },
  },
  trend_slope: {
    kinds: ['scatter_plot'], args: '{}', returns: 'the slope of the drawn straight line (it must pass through two grid crossings)',
    run: (s, _a, ax) => {
      const t = trendOf(s, pointsOf(s)) ?? fail('the figure has no drawn line (trendLine)');
      const crossings = gridValues(ax.x!).filter((x) => onGrid(t.slope * x + t.intercept, ax.y!));
      if (crossings.length < 2) fail('the drawn line does not pass through two grid crossings, so its slope cannot be read off exactly');
      return num(t.slope);
    },
  },
  // slope_field
  slope_at: {
    kinds: ['slope_field'], args: '{ x: number, y: number }', returns: 'the slope of the segment drawn at a lattice point',
    run: (s, a, ax) => {
      const lat = latticeOf(s, ax.x!, ax.y!);
      const x = argNum(a, 'x');
      const y = argNum(a, 'y');
      if (!lat.xs.some((v) => Math.abs(v - x) < 1e-9) || !lat.ys.some((v) => Math.abs(v - y) < 1e-9)) fail(`no segment is drawn at (${fmt(x)}, ${fmt(y)})`);
      const m = lat.slope(x, y);
      if (!Number.isFinite(m) || Math.abs(m) > 3 || !isMultiple(m, 0.5)) fail(`the segment at (${fmt(x)}, ${fmt(y)}) has slope ${Number.isFinite(m) ? fmt(m) : 'undefined'} — only slopes that are multiples of 0.5 between −3 and 3 can be told apart by eye`);
      return num(m);
    },
  },
  // reaction_coordinate
  rc_delta_h: { kinds: ['reaction_coordinate'], args: '{}', returns: 'product level minus reactant level (negative when energy is released)', run: (s, _a, ax) => { const r = reactionOnGrid(s, ax); return num(r.P - r.R); } },
  rc_activation_energy: {
    kinds: ['reaction_coordinate'], args: '{ curve: index, direction: forward | reverse }', returns: 'peak minus reactant level (forward) or peak minus product level (reverse)',
    run: (s, a, ax) => {
      const r = reactionOnGrid(s, ax);
      const ea = r.eas[argIndex(a, 'curve', r.eas.length, 'curve')];
      return num(pick(a, 'direction', ['forward', 'reverse'] as const) === 'forward' ? ea : r.R + ea - r.P);
    },
  },
  rc_peak_energy: { kinds: ['reaction_coordinate'], args: '{ curve: index }', returns: 'the energy at the top of the peak', run: (s, a, ax) => { const r = reactionOnGrid(s, ax); return num(r.R + r.eas[argIndex(a, 'curve', r.eas.length, 'curve')]); } },
  rc_peak_difference: {
    kinds: ['reaction_coordinate'], args: '{ a: index, b: index }', returns: 'peak of curve a minus peak of curve b',
    run: (s, a, ax) => { const r = reactionOnGrid(s, ax); return num(r.eas[argIndex(a, 'a', r.eas.length, 'curve')] - r.eas[argIndex(a, 'b', r.eas.length, 'curve')]); },
  },
  rc_direction: {
    kinds: ['reaction_coordinate'], args: '{}', returns: 'the label "exothermic" (products lower) or "endothermic" (products higher)',
    run: (s) => { const r = reactionOf(s); if (r.P === r.R) return fail('products and reactants are level'); return { kind: 'label', value: r.P < r.R ? 'exothermic' : 'endothermic' }; },
  },
  // titration_curve
  titration_equivalence_volume: {
    kinds: ['titration_curve'], args: '{}', returns: 'the volume at the near-vertical section of the curve',
    run: (s, _a, ax) => { const t = titrationOf(s); if (!(t.vEq < ax.x!.max)) fail('the equivalence point is outside the plotted range'); return num(mustBeOnGrid(t.vEq, ax.x, 'the equivalence volume')); },
  },
  titration_half_equivalence_volume: {
    kinds: ['titration_curve'], args: '{}', returns: 'half of the volume at the near-vertical section',
    run: (s, _a, ax) => { const t = titrationOf(s); if (!(t.vEq < ax.x!.max)) fail('the equivalence point is outside the plotted range'); mustBeOnGrid(t.vEq, ax.x, 'the equivalence volume'); return num(t.vEq / 2); },
  },
  titration_half_equivalence_ph: {
    kinds: ['titration_curve'], args: '{}', returns: 'the pH read at half the equivalence volume (weak analyte only; both readings must fall on gridlines)',
    run: (s, _a, ax) => {
      const t = titrationOf(s);
      if (t.halfPh === undefined) return fail('this reading applies to a weak analyte only');
      mustBeOnGrid(t.vEq / 2, ax.x, 'the half-equivalence volume');
      const shown = t.ph(t.vEq / 2);
      if (Math.abs(shown - t.halfPh) > 0.05) fail('the drawn curve is not at the nominal value at half-equivalence (the solution is too dilute for that reading)');
      return num(mustBeOnGrid(t.halfPh, ax.y, 'the pH at half-equivalence'));
    },
  },
  titration_analyte: {
    kinds: ['titration_curve'], args: '{}', returns: 'the label "strong acid", "weak acid", "strong base" or "weak base" — what is in the flask, judged from the shape of the curve',
    run: (s) => ({ kind: 'label', value: titrationOf(s).type.replace('_', ' ') }),
  },
  // free_body_diagram
  fbd_net_force: {
    kinds: ['free_body_diagram'], args: '{ axis: x | y | magnitude }', returns: 'the sum of the printed forces along the horizontal (right positive) or the vertical (up positive), or the size of the total',
    run: (s, a) => {
      const fs = knownForces(s);
      const missing = fs.find((f) => f.value === undefined);
      if (missing) return fail(`the force "${missing.name}" has no printed size`);
      if (new Set(fs.map((f) => f.unit)).size > 1) fail('the printed sizes do not share one unit');
      const x = fs.reduce((t, f) => t + f.v[0] * f.value!, 0);
      const y = fs.reduce((t, f) => t + f.v[1] * f.value!, 0);
      const axis = pick(a, 'axis', ['x', 'y', 'magnitude'] as const);
      return num(axis === 'x' ? x : axis === 'y' ? y : Math.hypot(x, y));
    },
  },
  fbd_missing_force: {
    kinds: ['free_body_diagram'], args: '{ force: name or index, net?: number — the net force along the line of that force, right / up positive; 0 when left out }', returns: 'the size of the one force whose size is not printed, from the balance along its own line',
    run: (s, a) => {
      const fs = knownForces(s);
      const hit = typeof a.force === 'string' ? fs.filter((f) => f.name === (a.force as string).trim()) : isNum(a.force) && fs[a.force] ? [fs[a.force]] : [];
      if (hit.length !== 1) return fail('derivation argument "force" must be the name (or 0-based index) of exactly one force');
      const f = hit[0];
      if (f.value !== undefined) return fail(`the size of "${f.name}" is printed on the figure`);
      const axis = f.v[0] !== 0 ? 0 : 1;
      const others = fs.filter((o) => o !== f && o.v[axis] !== 0);
      const unknown = others.find((o) => o.value === undefined);
      if (unknown) return fail(`"${unknown.name}" acts along the same line and has no printed size either`);
      const net = a.net === undefined ? 0 : argNum(a, 'net');
      const size = (net - others.reduce((t, o) => t + o.v[axis] * o.value!, 0)) / f.v[axis];
      if (!(size > 0)) return fail(`the balance gives ${fmt(size)} for "${f.name}" — the arrow would point the other way`);
      return num(size);
    },
  },
  ...BATCH1_CHECKERS,
};

/** Printing options of a kind that would put the result of a checker ON the figure. */
const PRINTS_RESULT: Array<{ option: string; kind: FigureKind; checkers: RegExp }> = [
  { option: 'showValues', kind: 'bar_chart', checkers: /^bar_/ },
  { option: 'annotateValues', kind: 'reaction_coordinate', checkers: /^rc_/ },
  { option: 'showEquation', kind: 'scatter_plot', checkers: /^trend_/ },
  { option: 'showExpression', kind: 'slope_field', checkers: /^slope_at$/ },
];

export interface Derivation {
  checker: string;
  args: P;
}

/** Recompute the key from the spec. Throws `FigureRuleError` when the
 *  checker does not exist, does not fit the kind, or the thing asked for
 *  cannot be read off the figure. */
export function runChecker(spec: PracticeFigureSpec, d: Derivation): Derived {
  const def = CHECKERS[d.checker];
  const batch2 = def ? undefined : BATCH2_CHECKERS[d.checker];
  if (batch2) {
    if (!(batch2.kinds as readonly string[]).includes(spec.type)) return fail(`the checker "${d.checker}" is for ${batch2.kinds.join(' / ')}, not for ${spec.type}`);
    return viaBatch2(() => batch2.run(spec, d.args ?? {}));
  }
  if (!def) return fail(`unknown derivation checker "${d.checker}" — use one of the listed checkers, or "none"`);
  if (!def.kinds.includes(spec.type as FigureKind)) return fail(`the checker "${d.checker}" is for ${def.kinds.join(' / ')}, not for ${spec.type}`);
  return def.run(spec, d.args ?? {}, axesOf(spec));
}

/** The checker list as the writer is shown it, grouped by figure kind. */
export function checkerCatalogue(kinds: ReadonlyArray<FigureKind | Batch2FigureKind> = PRACTICE_FIGURE_KINDS): string {
  return kinds.map((k) => {
    const mine = [...Object.entries(CHECKERS), ...Object.entries(BATCH2_CHECKERS)].filter(([, d]) => (d.kinds as readonly string[]).includes(k));
    return `${k}:\n${mine.map(([name, d]) => `  - ${name} ${d.args} → ${d.returns}`).join('\n')}`;
  }).join('\n');
}

// ── comparing a derived value with the stored key ───────────────────────────

/** Every number written in a text, in order ("−3 m/s" → [−3]; "1/2" → [0.5];
 *  "x = 2 and x = 5" → [2, 5]). Superscript and subscript digits are not numbers. */
export function numbersIn(text: string): number[] {
  const t = (text ?? '').replace(/[−–]/g, '-');
  const out: number[] = [];
  const re = /(?<![\w.])(-?\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?/g;
  for (let m = re.exec(t); m; m = re.exec(t)) out.push(m[2] !== undefined ? Number(m[1]) / Number(m[2]) : Number(m[1]));
  return out;
}

const near = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
const sameSet = (a: number[], b: number[]): boolean => a.length === b.length && [...a].sort((x, y) => x - y).every((v, i) => near(v, [...b].sort((x, y) => x - y)[i]));
const phrase = (s: string): string => ` ${(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

/** A written exact form, made comparable: one minus sign, no spaces, one
 *  spelling of ∞ and ∪, angle brackets as parentheses. Case is KEPT ("Aa" is
 *  not "aa"); signs and the kind of bracket are kept ("(−3, 4]" is not "[−3, 4)"). */
export function canonText(s: string): string {
  const t = (s ?? '').replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/[⟨<]/g, '(').replace(/[⟩>]/g, ')')
    .replace(/infinity|inf|oo/gi, '∞').replace(/(?<=[\])}])[Uu](?=[(\[{])/g, '∪').replace(/\.$/, '');
  return /^undefined$/i.test(t) ? 'undefined' : t;
}

/** Does a written answer state the derived value? null = the text cannot be compared. */
function states(text: string, d: Derived): boolean | null {
  if (d.kind === 'label') return phrase(text).includes(phrase(d.value));
  if (d.kind === 'text') return canonText(text) === canonText(d.value);
  const nums = numbersIn(text);
  if (nums.length === 0) return null;
  if (d.kind === 'number' && d.approx) {
    // One decimal number: right when it is the value rounded to its own decimals (at least one).
    const m = /^[^\d-]*(-?\d+(?:\.(\d+))?)[^\d]*$/.exec((text ?? '').replace(/[−–]/g, '-'));
    if (!m) return null;
    const decimals = m[2] ? m[2].length : 0;
    return decimals === 0 ? near(Number(m[1]), d.value) : Math.abs(Number(m[1]) - d.value) <= 0.5 * 10 ** -decimals + 1e-9;
  }
  if (d.kind === 'number') return nums.length === 1 ? near(nums[0], d.value) : null;
  return sameSet(nums, d.values);
}

export interface KeyComparison {
  match: boolean;
  detail: string;
}

/**
 * The stored key against the value recomputed from the spec. Multiple
 * choice: the keyed option must state the value and no other option may.
 * A key in a form that cannot be compared counts as NOT matching — the
 * writer must pick a format the checker's result fits.
 */
export function compareDerived(item: Pick<GeneratedItem, 'responseFormat' | 'answer' | 'choices'>, d: Derived): KeyComparison {
  const want = derivedText(d);
  if (item.responseFormat === 'mcq') {
    const idx = 'ABCD'.indexOf(item.answer);
    if (idx < 0 || !item.choices[idx]) return { match: false, detail: 'the answer is not the letter of an option' };
    const hits = item.choices.map((c) => states(c, d));
    if (hits[idx] === null) return { match: false, detail: `the keyed option "${item.choices[idx]}" cannot be compared with the value read from the figure (${want}) — give each option as one plain value` };
    if (!hits[idx]) return { match: false, detail: `the figure gives ${want}, but the keyed option ${item.answer} is "${item.choices[idx]}"` };
    const also = hits.map((h, i) => (h && i !== idx ? 'ABCD'[i] : '')).filter(Boolean);
    if (also.length) return { match: false, detail: `the figure gives ${want}, which option ${also.join(' and ')} states as well as the keyed option ${item.answer}` };
    return { match: true, detail: `the figure gives ${want} — the keyed option ${item.answer}` };
  }
  const s = states(item.answer, d);
  if (s === null) return { match: false, detail: `the stored answer "${item.answer}" cannot be compared with the value read from the figure (${want})` };
  return s ? { match: true, detail: `the figure gives ${want} — the stored answer` } : { match: false, detail: `the figure gives ${want}, but the stored answer is "${item.answer}"` };
}

// ── 4. the item: schema, validation, rule checks ────────────────────────────

export interface FigureItem extends GeneratedItem {
  figureSpec: PracticeFigureSpec;
  alt: string;
  derivation: Derivation;
}

/** JSON schema of the writer's reply. The figure params and the derivation
 *  arguments are JSON TEXT inside a string: their shape depends on the kind,
 *  which a fixed schema cannot express. */
export const FIGURE_GENERATION_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['items', 'cannotWrite'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['objectiveLoId', 'figureType', 'figureParamsJson', 'alt', 'responseFormat', 'problemText', 'choices', 'answer', 'distractorRationales', 'derivationChecker', 'derivationArgsJson', 'hints', 'solutionText', 'difficulty', 'covers', 'taskType'],
        properties: {
          objectiveLoId: { type: 'string' },
          figureType: { type: 'string', enum: [...PRACTICE_FIGURE_KINDS] },
          figureParamsJson: { type: 'string' },
          alt: { type: 'string' },
          responseFormat: { type: 'string', enum: ['mcq', 'numeric', 'free'] },
          problemText: { type: 'string' },
          choices: { type: 'array', items: { type: 'string' } },
          answer: { type: 'string' },
          distractorRationales: { type: 'array', items: { type: 'string' } },
          derivationChecker: { type: 'string' },
          derivationArgsJson: { type: 'string' },
          hints: { type: 'array', items: { type: 'string' } },
          solutionText: { type: 'string' },
          difficulty: { type: 'integer' },
          covers: { type: 'string' },
          taskType: { type: 'string' },
        },
      },
    },
    cannotWrite: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['objectiveLoId', 'reason'], properties: { objectiveLoId: { type: 'string' }, reason: { type: 'string' } } },
    },
  },
};

function parseJsonObject(text: unknown, name: string): P {
  if (isObj(text)) return text;
  if (typeof text !== 'string') return fail(`${name} must be JSON text`);
  const t = text.trim();
  if (t === '' || t === 'null') return {};
  try {
    const v: unknown = JSON.parse(t);
    if (!isObj(v)) return fail(`${name} must be a JSON object`);
    return v;
  } catch (e) {
    return fail(`${name} is not valid JSON (${(e as Error).message.slice(0, 80)})`);
  }
}

/** A stem that tells the student to produce a figure. */
const DRAW_RE = /(?:^|[.?!:;,]\s+|\b(?:then|and|to|also|please|must|should|now)\s+)(?:draw|sketch|shade|plot|construct|graph|mark|label)\b(?!\s+(?:shows?|showing|of|is|was|below|above|at\b))/i;
/** A stem that points the student at the figure. */
const POINTS_AT_FIGURE_RE = /\b(?:figure|graph|diagram|chart|plot|curve|profile|field|shown|line|bar|dot|arrow|axis|segment)s?\b/i;

/** An option that argues for itself. */
const OPTION_REASON_RE = /\b(?:because|since|so\s+that|therefore|thus|hence|due\s+to|as\s+a\s+result|which\s+means|owing\s+to)\b/i;

export const ALT_LIMITS = { min: 1, max: 600 };
export const SVG_MAX_CHARS = 200_000;

const numberTokens = (text: string): number[] => numbersIn(text);

/** Text the spec PRINTS that is neither an axis number nor a level/bar name
 *  the reader needs: titles, legend entries, point and guide-line labels. */
function freeTextOf(spec: PracticeFigureSpec): Array<{ where: string; text: string }> {
  const p = spec.params;
  const out: Array<{ where: string; text: string }> = [];
  const add = (where: string, v: unknown) => {
    const t = str(v);
    if (t) out.push({ where, text: t });
  };
  add('title', p.title);
  for (const k of ['xLabel', 'yLabel', 'tLabel', 'reactantLabel', 'productLabel']) add(k, p[k]);
  for (const [k, field] of [['curves', 'label'], ['series', 'label'], ['points', 'label'], ['points', 'series'], ['asymptotes', 'label']] as const) {
    (Array.isArray(p[k]) ? (p[k] as unknown[]) : []).forEach((e, i) => isObj(e) && add(`${k}[${i}].${field}`, e[field]));
  }
  (Array.isArray(p.curveLabels) ? p.curveLabels : []).forEach((l, i) => add(`curveLabels[${i}]`, l));
  return out;
}

export interface FigureExamination {
  /** Empty when the item may go on to the reviewers and the solvers. */
  defects: string[];
  svg?: string;
  figureText?: string;
  derivation: { checker: string; status: 'derived' | 'not_derived' | 'mismatch' | 'error'; value?: string; detail: string };
}

/**
 * Everything that can be decided about a figure item without a model:
 * the spec draws (and passes the safety check), the axes are explicit, the
 * stem and the alt text keep the rules, nothing printed states the answer,
 * and — when the writer named a checker — the key recomputed from the spec
 * is the stored key.
 */
export function examineFigureItem(it: FigureItem): FigureExamination {
  const defects: string[] = [];
  let svg: string | undefined;
  let figureText: string | undefined;
  const none = it.derivation.checker === 'none' || it.derivation.checker === '';
  const derivation: FigureExamination['derivation'] = { checker: none ? 'none' : it.derivation.checker, status: 'not_derived', detail: 'no checker fits — the answer rests on the solver check alone' };
  const hygiene = hygieneDefects(it.figureSpec);
  if (hygiene.length) return { defects: hygiene, derivation: { ...derivation, status: 'error', detail: 'no figure is drawn for this specification' } };
  try {
    axesOf(it.figureSpec);
    svg = renderPracticeFigure(it.figureSpec).svg;
    if (svg.length > SVG_MAX_CHARS) defects.push(`the drawn figure is ${svg.length} characters, over the limit of ${SVG_MAX_CHARS}`);
    figureText = describeFigure(it.figureSpec).text;
  } catch (e) {
    defects.push(`the figure spec was refused: ${(e as Error).message}`);
    return { defects, derivation: { ...derivation, status: 'error', detail: 'the figure could not be drawn' } };
  }

  // The stem.
  if (DRAW_RE.test(it.problemText)) defects.push('the question asks the student to draw, sketch, shade, plot or label something — the student can only read the figure');
  if (!POINTS_AT_FIGURE_RE.test(it.problemText)) defects.push('the question never refers to the figure');
  if (restatesFigure(it.problemText)) defects.push('the question text describes what the figure shows (its shape, or the feature the answer rests on) — it may only say what the figure is about, and ask');
  if (it.responseFormat === 'mcq' && it.choices.some((c) => OPTION_REASON_RE.test(c))) defects.push('an option carries a reason — an option states the result only (a second option with the same result and another true reason would also be correct)');
  if (it.responseFormat === 'free' && it.answer.trim().split(/\s+/).length > 3) defects.push('a typed answer must be a single term (at most three words) — use multiple choice or a number instead');

  // The alt text.
  const alt = it.alt.trim();
  if (alt.length < ALT_LIMITS.min || alt.length > ALT_LIMITS.max) defects.push(`alt text must be between ${ALT_LIMITS.min} and ${ALT_LIMITS.max} characters (it has ${alt.length})`);
  const keyText = it.responseFormat === 'mcq' ? (it.choices['ABCD'.indexOf(it.answer)] ?? '') : it.answer;
  const keyNumbers = numberTokens(keyText);
  const worded = /[a-z]{4,}/i.test(keyText.replace(/\b(?:and|the|per|from|with)\b/gi, ''));
  const ax = axesOf(it.figureSpec);
  const axisNumbers = [ax.x, ax.y].flatMap((a) => (a ? [a.min, a.max, a.step] : []));
  const statesKey = (text: string, allowAxisNumbers: boolean): boolean => {
    if (worded && keyNumbers.length === 0) return phrase(text).includes(phrase(keyText));
    if (keyNumbers.length === 0) return false;
    const nums = numberTokens(text);
    return keyNumbers.every((k) => nums.some((n) => near(n, k)) && !(allowAxisNumbers && axisNumbers.some((n) => near(n, k))));
  };
  if (statesKey(alt, true)) defects.push('the alt text states the answer — describe what kind of figure it is and its axes, not the values to be read');

  // What the figure prints.
  for (const t of freeTextOf(it.figureSpec)) {
    if (/=/.test(t.text) && !/Label$/.test(t.where)) defects.push(`${t.where} "${t.text}" displays an equation or a value — name it with a letter or a short word`);
    else if (!/Label$/.test(t.where) && statesKey(t.text, false)) defects.push(`${t.where} "${t.text}" prints the answer on the figure`);
  }
  for (const pr of PRINTS_RESULT) {
    if (it.figureSpec.type === pr.kind && it.figureSpec.params[pr.option] === true && (none || pr.checkers.test(it.derivation.checker))) {
      defects.push(`${pr.option} is on, which prints on the figure what the question asks the student to read — switch it off`);
    }
  }

  // The key, recomputed.
  if (!none) {
    try {
      const derived = runChecker(it.figureSpec, it.derivation);
      const cmp = compareDerived(it, derived);
      derivation.value = derivedText(derived);
      derivation.status = cmp.match ? 'derived' : 'mismatch';
      derivation.detail = cmp.detail;
      if (!cmp.match) defects.push(`the answer does not agree with the figure: ${cmp.detail}`);
    } catch (e) {
      derivation.status = 'error';
      derivation.detail = (e as Error).message;
      defects.push(`the derivation "${it.derivation.checker}" could not be carried out on the figure: ${(e as Error).message}`);
    }
  }
  // No checker: the answer must not rest on a feature that sits between gridlines.
  if (none) {
    const off = unreadableFeatures(it.figureSpec);
    if (off.length) defects.push(`it would need a reading finer than the grid: ${off.slice(0, 3).join('; ')}${off.length > 3 ? ` (and ${off.length - 3} more)` : ''} — put every feature the student reads on a gridline`);
  }
  return { defects, svg, figureText, derivation };
}

/**
 * One raw item of the writer's reply → a `FigureItem`, or the reasons it is
 * not one. Reuses the text track's item validation (with the "refers to a
 * figure" rule lifted) and then examines the figure.
 */
export function validateFigureItem(raw: unknown, skillObjectiveIds: string[], allowedKind?: string): { item?: FigureItem; exam?: FigureExamination; errors: string[] } {
  const o = (raw ?? {}) as P;
  const base = validateItem(o, skillObjectiveIds, { hasFigure: true });
  if (!base.item) return { errors: base.errors };
  const errors: string[] = [...base.defects];
  let params: P = {};
  let args: P = {};
  try {
    params = parseJsonObject(o.figureParamsJson, 'figureParamsJson');
    args = parseJsonObject(o.derivationArgsJson, 'derivationArgsJson');
  } catch (e) {
    return { errors: [...errors, (e as Error).message] };
  }
  const type = str(o.figureType);
  if (allowedKind && type !== allowedKind) errors.push(`figureType is "${type}" but this objective was assigned the kind "${allowedKind}"`);
  const item: FigureItem = { ...base.item, figureSpec: normaliseSpec({ type, params }, `${base.item.problemText}\n${base.item.choices.join('\n')}`), alt: str(o.alt), derivation: { checker: str(o.derivationChecker, 'none'), args } };
  const exam = examineFigureItem(item);
  return { item, exam, errors: [...errors, ...exam.defects] };
}

/** What the blind solver is given in place of the picture. */
export function solverQuestion(figureText: string, stem: string): string {
  return `This question is shown to the student together with ONE figure. You cannot see the picture; below is an exact transcription of everything it shows, made by a program from the figure's data. Treat the transcription as the figure itself: the figure IS included. Values are given as they can be read off the picture — a value said to lie between two gridlines cannot be read more exactly than that.\n\n--- FIGURE (transcription) ---\n${figureText.trim()}\n--- END OF FIGURE ---\n\n${stem.trim()}`;
}

// ── kind selection + sample (pure parts) ────────────────────────────────────

export interface KindChoice {
  objectiveLoId: string;
  subject: string;
  /** One of the supported kinds, or 'unsupported'. */
  kind: string;
  /** For 'unsupported': the type of figure the objective would need. */
  neededFigure: string;
  studentMustDraw: boolean;
  reason: string;
}

/** One reply entry of the kind-selection call → a `KindChoice` (an unknown
 *  or missing kind is 'unsupported', never guessed). */
export function kindChoiceOf(objectiveLoId: string, subject: string, e: P | undefined): KindChoice {
  const kind = str(e?.kind).toLowerCase().replace(/[\s-]+/g, '_');
  const supported = (PRACTICE_FIGURE_KINDS as readonly string[]).includes(kind);
  const mustDraw = e?.student_must_draw === true;
  return {
    objectiveLoId,
    subject,
    kind: supported && !mustDraw ? kind : 'unsupported',
    neededFigure: supported && !mustDraw ? '' : str(e?.needed_figure, e ? (supported ? kind.replace(/_/g, ' ') : 'not stated') : 'not classified'),
    studentMustDraw: mustDraw,
    reason: str(e?.reason),
  };
}

/** Broad groups for counting the figures that are not supported yet. Ordered:
 *  the first pattern that matches the classifier's short label wins. */
const NEEDED_GROUPS: Array<[string, RegExp]> = [
  ['free-body / force diagram', /free.?body|force diagram/i],
  ['spectrum (photoelectron, mass)', /spectrum|spectra|\bpes\b/i],
  ['gel / laboratory image or trace', /\bgel\b|electrophoresis|blot|micrograph|photo|trace/i],
  ['labelled biological diagram (cell, membrane, organ, pathway)', /cell|membrane|organelle|pathway|anatom|chromosom|\bdna\b|protein|enzyme|mitosis|meiosis|neuron/i],
  ['unit circle / angle in standard position', /unit circle|standard position|reference angle/i],
  ['vector diagram', /vector/i],
  ['complex-plane or polar plot', /complex plane|polar|argand/i],
  ['labelled geometric figure (triangle, similar figures)', /triangle|geometr|angle|construction|conic|ellipse|hyperbola/i],
  ['3-D solid (revolution, cross sections)', /3.?d\b|three.?dimension|solid|revolution|washer|disc\b|disk\b/i],
  ['shaded region on a coordinate plane', /shad|feasible|region|area between|riemann/i],
  ['distribution curve / histogram / box plot', /histogram|box.?plot|distribution(?!\s+map)|bell/i],
  ['map', /\bmap\b/i],
  ['molecular structure (Lewis, resonance, geometry, particulate)', /lewis|resonance|vsepr|molecul|structur|orbital|particul|electron|bond/i],
  ['phylogenetic tree / cladogram', /phylogen|cladogram|\btree\b/i],
  ['pedigree', /pedigree/i],
  ['Punnett square / grid', /punnett|grid/i],
  ['flow / food-web / energy-pyramid diagram', /flow|web|chain|pyramid|cycle/i],
  ['circuit diagram', /circuit|wiring/i],
  ['field / charge-arrangement diagram', /field|magnet|charge/i],
  ['ray diagram', /\bray\b|lens|mirror/i],
  ['sign chart / number line', /sign chart|number line/i],
  ['a graph the student must sketch, or one the renderer cannot draw', /graph|plot|curve|chart|axes|sketch/i],
];

export function neededGroup(c: KindChoice): string {
  if (c.kind !== 'unsupported') return c.kind;
  for (const [name, re] of NEEDED_GROUPS) if (re.test(c.neededFigure)) return c.studentMustDraw ? `${name} — student must draw` : name;
  return c.studentMustDraw ? 'other — student must draw' : `other (${c.neededFigure || 'not stated'})`;
}

/**
 * A sample of `n` supported objectives: first one objective per supported
 * kind (taking, for each kind, the subject used least so far), then the rest
 * spread over the subjects, each time the kind used least. Ties by objective
 * id, so the sample is arbitrary but reproducible. At most one objective per
 * skill while other skills are available.
 */
export function pickFigureSample(choices: KindChoice[], n: number): KindChoice[] {
  const pool = choices.filter((c) => c.kind !== 'unsupported').sort((a, b) => a.objectiveLoId.localeCompare(b.objectiveLoId));
  const picked: KindChoice[] = [];
  const used = (key: (c: KindChoice) => string, v: string) => picked.filter((c) => key(c) === v).length;
  const skillOf = (c: KindChoice) => c.objectiveLoId.replace(/\.lo-\d+$/, '');
  const take = (cands: KindChoice[], rank: (c: KindChoice) => number[]) => {
    const free = cands.filter((c) => !picked.includes(c));
    if (free.length === 0) return false;
    const fresh = free.filter((c) => !picked.some((q) => skillOf(q) === skillOf(c)));
    const from = fresh.length ? fresh : free;
    from.sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
      return a.objectiveLoId.localeCompare(b.objectiveLoId);
    });
    picked.push(from[0]);
    return true;
  };
  for (const kind of PRACTICE_FIGURE_KINDS) {
    if (picked.length >= n) break;
    take(pool.filter((c) => c.kind === kind), (c) => [used((q) => q.subject, c.subject)]);
  }
  while (picked.length < n && take(pool, (c) => [used((q) => q.subject, c.subject), used((q) => q.kind, c.kind)])) {
    /* keep taking */
  }
  return picked;
}
