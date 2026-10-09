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
import { PRACTICE_FIGURE_KINDS, renderPracticeFigure, titrationPH, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { slopeFieldSolution } from '../../src/lib/tutor/practice-figure/slope-field';
import { validateItem, type GeneratedItem } from './core';

export { PRACTICE_FIGURE_KINDS };
export type FigureKind = (typeof PRACTICE_FIGURE_KINDS)[number];

/** A spec, a derivation or an item that breaks a rule of this track. The
 *  message is written for the writer model (it is sent back on the retry). */
export class FigureRuleError extends Error {}

type P = Record<string, unknown>;
const isObj = (v: unknown): v is P => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
function fail(m: string): never {
  throw new FigureRuleError(m);
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
    default:
      return fail(`unknown figure kind "${spec.type}" — one of ${PRACTICE_FIGURE_KINDS.join(', ')}`);
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
    default:
      fail(`unknown figure kind "${spec.type}"`);
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
  | { kind: 'number'; value: number }
  | { kind: 'numbers'; values: number[] }
  | { kind: 'label'; value: string };

export const derivedText = (d: Derived): string => (d.kind === 'number' ? fmt(d.value) : d.kind === 'numbers' ? `{${d.values.map(fmt).join(', ')}}` : d.value);

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
  if (!def) return fail(`unknown derivation checker "${d.checker}" — use one of the listed checkers, or "none"`);
  if (!def.kinds.includes(spec.type as FigureKind)) return fail(`the checker "${d.checker}" is for ${def.kinds.join(' / ')}, not for ${spec.type}`);
  return def.run(spec, d.args ?? {}, axesOf(spec));
}

/** The checker list as the writer is shown it, grouped by figure kind. */
export function checkerCatalogue(): string {
  return PRACTICE_FIGURE_KINDS.map((k) => {
    const mine = Object.entries(CHECKERS).filter(([, d]) => d.kinds.includes(k));
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

/** Does a written answer state the derived value? null = the text cannot be compared. */
function states(text: string, d: Derived): boolean | null {
  if (d.kind === 'label') return phrase(text).includes(phrase(d.value));
  const nums = numbersIn(text);
  if (nums.length === 0) return null;
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
