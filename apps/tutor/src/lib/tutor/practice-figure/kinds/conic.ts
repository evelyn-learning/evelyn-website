/**
 * conic_graph — one or two conic sections on numbered axes with EQUAL scales
 * (a circle is drawn as a circle), with the features a question asks about
 * marked, named, printed, or left as a "?".
 *
 * { xRange: [min, max]; yRange: [min, max];        // the plot's shape follows the ranges (equal scales)
 *   xStep?: number; yStep?: number; title?: string;
 *   conics: Array<                                   // 1–2
 *     | { type: 'circle'; center: [h, k]; radius: number }
 *     | { type: 'ellipse'; center: [h, k]; rx: number; ry: number }        // semi-axes along x and y (rx ≠ ry)
 *     | { type: 'hyperbola'; center: [h, k]; a: number; b: number;
 *         axis: 'x' | 'y' }                          // the transverse axis: 'x' opens left/right, 'y' up/down
 *     | { type: 'parabola'; vertex: [h, k]; p: number;                     // focus is p from the vertex
 *         axis: 'x' | 'y' }                          // axis of symmetry: 'y' opens up (p > 0) / down, 'x' right / left
 *     & { label?: string;                            // legend entry
 *         show?: { [feature]: 'value' | 'mark' | 'blank' | 'none' };       // every feature defaults to 'none'
 *         names?: { center?: string; vertex?: string; focus?: string;      // what a marked point is CALLED (≤ 4
 *                   vertices?: [string, string]; coVertices?: [string, string];   // characters) instead of C, V, F,
 *                   foci?: [string, string] } }>;    // V₁ V₂, B₁ B₂, F₁ F₂ — e.g. center: 'O' when "C" is an option letter
 *   lines?: Array<({ slope: number; intercept: number } | { x: number }) & { label?: string }>;   // ≤ 3, solid
 *   points?: Array<{ x: number; y: number; label?: string }>;              // ≤ 6 dots (intersections, a point P)
 *   letterLabels?: 'numerals' | 'roman' }            // every name that is ONE capital letter (C, V, F, a point's or a
 *                                                    // line's label, a legend entry) is printed as 1, 2, 3 … or I, II,
 *                                                    // III … in drawing order (the conics' marks, then lines, then
 *                                                    // points) — so none reads as an option letter of the question
 *
 * FEATURES per type, and what each `show` value draws:
 *   points — center (circle, ellipse, hyperbola) · vertices · coVertices (ellipse, hyperbola) · foci
 *            (ellipse, hyperbola) · vertex, focus (parabola):
 *            'mark' a dot and its name (C, V₁, V₂, B₁, B₂, F₁, F₂ / V, F) · 'value' the dot, the name and
 *            its coordinates · 'blank' the dot, the name and a "?" box · 'none' nothing.
 *   lines  — asymptotes (hyperbola) · directrix (parabola) · axis (the axis of symmetry: parabola; the
 *            major / transverse axis: ellipse, hyperbola):
 *            'mark' the dashed line · 'value' the line and its equation · 'blank' the line and a "?" · 'none'.
 *   radius (circle) — a segment from the centre to the circle: 'mark' with "r", 'value' with the length,
 *            'blank' with "?".
 *   box (hyperbola) — the central rectangle, 'mark' or 'none'.
 * A coordinate that is not rational is printed exactly when its square is a whole number ("(√7, 0)",
 * "(2 + √5, 1)"), else to two decimals. Nothing is printed that the spec does not ask for: no equation
 * of the conic, no a / b / c values.
 *
 * Refused (the message names the param): a closed curve that does not fit the ranges, a shown feature
 * outside the ranges, ranges whose shape is flatter than 1 : 0.4 or taller than 1 : 1.4.
 */
import { FIGURE_WIDTH, GUIDE_COLOR, GUIDE_DASH, GUIDE_MASK_WIDTH, GUIDE_WIDTH, SERIES_COLORS, TICK_FS, assignDashes, buildFrame, buildLegend, dashAttr, n2, type LegendEntry } from '../plot-frame';
import type { Drawn, FigureFacts, Params, Reader } from '../spec';
import { readLetterLabels, type LetterLabels } from './batch3';
import { INK, MUTED, Placer, around, blank, fractionText, numText, overlaps, segmentBoxes, text, type Box, type Candidate } from './draw';

export type ConicShow = 'value' | 'mark' | 'blank' | 'none';
export const CONIC_SHOWS: readonly ConicShow[] = ['value', 'mark', 'blank', 'none'];
export type ConicType = 'circle' | 'ellipse' | 'hyperbola' | 'parabola';
const FEATURES: Record<ConicType, readonly string[]> = {
  circle: ['center', 'radius'],
  ellipse: ['center', 'vertices', 'coVertices', 'foci', 'axis'],
  hyperbola: ['center', 'vertices', 'coVertices', 'foci', 'asymptotes', 'axis', 'box'],
  parabola: ['vertex', 'focus', 'directrix', 'axis'],
};

export interface ConicPoint {
  name: string;
  x: number;
  y: number;
  /** "(3, 0)", "(√7, 0)", "(2 + √5, 1)". */
  coords: string;
}
/** A straight line: `x = at` when vertical, else y = slope·x + intercept. */
export interface ConicLine {
  vertical: boolean;
  at: number;
  slope: number;
  intercept: number;
  /** "y = 2x − 1", "y = (3/4)x", "x = −2", "y = 3". */
  equation: string;
  label?: string;
}
export interface Conic {
  type: ConicType;
  /** Centre (the vertex of a parabola). */
  h: number;
  k: number;
  /** circle: radius. */
  r: number;
  /** ellipse: semi-major / semi-minor; hyperbola: transverse / conjugate semi-axis. */
  a: number;
  b: number;
  /** Centre-to-focus distance (ellipse, hyperbola); |p| for a parabola. */
  c: number;
  p: number;
  /** The major / transverse axis, or the parabola's axis of symmetry. */
  axis: 'x' | 'y';
  label?: string;
  show: Record<string, ConicShow>;
  center?: ConicPoint;
  vertices: ConicPoint[];
  coVertices: ConicPoint[];
  foci: ConicPoint[];
  asymptotes: ConicLine[];
  directrix?: ConicLine;
  symmetryAxis?: ConicLine;
  /** Standard form: "(x − 2)² + (y + 1)² = 25", "x²/9 − y²/16 = 1", "(x − 1)² = 8(y + 2)". */
  equation: string;
}
export interface ConicModel {
  xRange: [number, number];
  yRange: [number, number];
  xStep?: number;
  yStep?: number;
  title?: string;
  conics: Conic[];
  lines: ConicLine[];
  points: Array<{ x: number; y: number; label?: string }>;
  letterLabels?: LetterLabels;
}

const isInt = (v: number): boolean => Math.abs(v - Math.round(v)) < 1e-9;
/** base ± √(d2) as it is printed. */
function offsetText(base: number, sign: 1 | -1, d2: number): string {
  const d = Math.sqrt(d2);
  if (isInt(d * 1e4) && Math.abs(d * 100 - Math.round(d * 100)) < 1e-7) return numText(base + sign * d);
  if (isInt(d2)) {
    const root = `√${Math.round(d2)}`;
    return Math.abs(base) < 1e-12 ? `${sign < 0 ? '−' : ''}${root}` : `${numText(base)} ${sign < 0 ? '−' : '+'} ${root}`;
  }
  return numText(base + sign * d);
}
const pt = (name: string, x: number, y: number, coords?: string): ConicPoint => ({ name, x, y, coords: coords ?? `(${numText(x)}, ${numText(y)})` });
/** A point at distance √d2 from (h, k) along the axis. */
function axisPoint(name: string, h: number, k: number, axis: 'x' | 'y', sign: 1 | -1, d2: number): ConicPoint {
  const d = Math.sqrt(d2);
  return axis === 'x' ? pt(name, h + sign * d, k, `(${offsetText(h, sign, d2)}, ${numText(k)})`) : pt(name, h, k + sign * d, `(${numText(h)}, ${offsetText(k, sign, d2)})`);
}
/** A coefficient as written before a variable or bracket: "", "−", "2", "(3/4)", "−(3/4)", "1.5". */
function ratio(v: number): string {
  for (const den of [1, 2, 3, 4, 5, 6, 8, 10]) {
    if (isInt(v * den)) return fractionText(Math.round(v * den), den);
  }
  return numText(v, 3);
}
function coefficient(v: number): string {
  if (Math.abs(v - 1) < 1e-12) return '';
  if (Math.abs(v + 1) < 1e-12) return '−';
  const t = ratio(Math.abs(v));
  return `${v < 0 ? '−' : ''}${t.includes('/') ? `(${t})` : t}`;
}
export function lineOf(slope: number, intercept: number, label?: string): ConicLine {
  const mx = Math.abs(slope) < 1e-12 ? '' : `${coefficient(slope)}x`;
  const c = Math.abs(intercept) < 1e-12 ? '' : mx ? ` ${intercept < 0 ? '−' : '+'} ${ratio(Math.abs(intercept))}` : ratio(intercept);
  return { vertical: false, at: 0, slope, intercept, equation: `y = ${mx || c ? `${mx}${c}` : '0'}`, label };
}
export const verticalLine = (at: number, label?: string): ConicLine => ({ vertical: true, at, slope: Infinity, intercept: NaN, equation: `x = ${ratio(at)}`, label });
/** "(x − 2)" / "(x + 1)" / "x". */
const shifted = (v: string, by: number): string => (Math.abs(by) < 1e-12 ? v : `(${v} ${by > 0 ? '−' : '+'} ${numText(Math.abs(by), 3)})`);
const sq = (v: string, by: number): string => `${shifted(v, by)}²`;

function readPoint(r: Reader, v: unknown, name: string): [number, number] {
  if (!Array.isArray(v) || v.length !== 2) r.fail(`${name} must be [x, y]`);
  return [r.num((v as unknown[])[0], `${name}[0]`), r.num((v as unknown[])[1], `${name}[1]`)];
}

function readConic(r: Reader, raw: unknown, name: string): Conic {
  const o = r.obj(raw, name);
  const type = o.type as ConicType;
  if (!(type in FEATURES)) r.fail(`${name}.type must be one of circle, ellipse, hyperbola, parabola`);
  const show: Record<string, ConicShow> = {};
  for (const f of FEATURES[type]) show[f] = 'none';
  if (o.show !== undefined && o.show !== null) {
    for (const [key, v] of Object.entries(r.obj(o.show, `${name}.show`))) {
      if (!FEATURES[type].includes(key)) r.fail(`${name}.show.${key}: ${type === 'ellipse' ? 'an' : 'a'} ${type} has no such feature — one of ${FEATURES[type].join(', ')}`);
      if (!CONIC_SHOWS.includes(v as ConicShow)) r.fail(`${name}.show.${key} must be one of ${CONIC_SHOWS.join(', ')}`);
      if (key === 'box' && v !== 'mark' && v !== 'none') r.fail(`${name}.show.box must be mark or none`);
      show[key] = v as ConicShow;
    }
  }
  const NAME_KEYS: Record<ConicType, readonly string[]> = { circle: ['center'], ellipse: ['center', 'vertices', 'coVertices', 'foci'], hyperbola: ['center', 'vertices', 'coVertices', 'foci'], parabola: ['vertex', 'focus'] };
  const given: Record<string, string[]> = {};
  if (o.names !== undefined && o.names !== null) {
    for (const [key, v] of Object.entries(r.obj(o.names, `${name}.names`))) {
      if (!NAME_KEYS[type].includes(key)) r.fail(`${name}.names.${key}: ${type === 'ellipse' ? 'an' : 'a'} ${type} has no such named point — one of ${NAME_KEYS[type].join(', ')}`);
      if (key === 'center' || key === 'vertex' || key === 'focus') given[key] = [r.str(v, `${name}.names.${key}`, 4)];
      else {
        if (!Array.isArray(v) || v.length !== 2) r.fail(`${name}.names.${key} must be two names, e.g. ["P", "Q"]`);
        given[key] = (v as unknown[]).map((x, j) => r.str(x, `${name}.names.${key}[${j}]`, 4));
        if (given[key][0] === given[key][1]) r.fail(`${name}.names.${key}: the two names must differ`);
      }
    }
  }
  const nm = (key: string, j: number, dflt: string): string => given[key]?.[j] ?? dflt;
  const base = { type, r: 0, a: 0, b: 0, c: 0, p: 0, axis: 'x' as 'x' | 'y', label: r.optStr(o.label, `${name}.label`, 24), show, vertices: [] as ConicPoint[], coVertices: [] as ConicPoint[], foci: [] as ConicPoint[], asymptotes: [] as ConicLine[] };
  if (type === 'parabola') {
    const [h, k] = readPoint(r, o.vertex, `${name}.vertex`);
    const p = r.num(o.p, `${name}.p`);
    if (Math.abs(p) < 1e-9) r.fail(`${name}.p must not be 0 (it is the distance from the vertex to the focus)`);
    if (o.axis !== 'x' && o.axis !== 'y') r.fail(`${name}.axis must be 'x' (opens right or left) or 'y' (opens up or down)`);
    const axis = o.axis as 'x' | 'y';
    const focus = axis === 'y' ? pt(nm('focus', 0, 'F'), h, k + p) : pt(nm('focus', 0, 'F'), h + p, k);
    const directrix = axis === 'y' ? lineOf(0, k - p) : verticalLine(h - p);
    const symmetryAxis = axis === 'y' ? verticalLine(h) : lineOf(0, k);
    const four = coefficient(4 * p);
    const rhs = (v: string, by: number): string => (Math.abs(by) < 1e-12 ? `${four}${v}` : `${four}${shifted(v, by)}`);
    const equation = axis === 'y' ? `${sq('x', h)} = ${rhs('y', k)}` : `${sq('y', k)} = ${rhs('x', h)}`;
    return { ...base, h, k, p, c: Math.abs(p), axis, vertices: [pt(nm('vertex', 0, 'V'), h, k)], foci: [focus], directrix, symmetryAxis, equation };
  }
  const [h, k] = readPoint(r, o.center, `${name}.center`);
  const center = pt(nm('center', 0, 'C'), h, k);
  if (type === 'circle') {
    const rad = r.positive(o.radius, `${name}.radius`);
    return { ...base, h, k, r: rad, a: rad, b: rad, center, equation: `${sq('x', h)} + ${sq('y', k)} = ${numText(rad * rad, 4)}` };
  }
  if (type === 'ellipse') {
    const rx = r.positive(o.rx, `${name}.rx`);
    const ry = r.positive(o.ry, `${name}.ry`);
    if (Math.abs(rx - ry) < 1e-9) r.fail(`${name}: rx and ry are equal — that is a circle (type: 'circle', radius)`);
    const axis: 'x' | 'y' = rx > ry ? 'x' : 'y';
    const other = axis === 'x' ? 'y' : 'x';
    const a = Math.max(rx, ry);
    const b = Math.min(rx, ry);
    const c2 = a * a - b * b;
    return {
      ...base, h, k, a, b, c: Math.sqrt(c2), axis, center,
      vertices: [axisPoint(nm('vertices', 0, 'V₁'), h, k, axis, -1, a * a), axisPoint(nm('vertices', 1, 'V₂'), h, k, axis, 1, a * a)],
      coVertices: [axisPoint(nm('coVertices', 0, 'B₁'), h, k, other, -1, b * b), axisPoint(nm('coVertices', 1, 'B₂'), h, k, other, 1, b * b)],
      foci: [axisPoint(nm('foci', 0, 'F₁'), h, k, axis, -1, c2), axisPoint(nm('foci', 1, 'F₂'), h, k, axis, 1, c2)],
      symmetryAxis: axis === 'x' ? lineOf(0, k) : verticalLine(h),
      equation: `${sq('x', h)}/${numText(rx * rx, 4)} + ${sq('y', k)}/${numText(ry * ry, 4)} = 1`,
    };
  }
  const a = r.positive(o.a, `${name}.a`);
  const b = r.positive(o.b, `${name}.b`);
  if (o.axis !== 'x' && o.axis !== 'y') r.fail(`${name}.axis must be 'x' (opens left and right) or 'y' (opens up and down)`);
  const axis = o.axis as 'x' | 'y';
  const other = axis === 'x' ? 'y' : 'x';
  const c2 = a * a + b * b;
  const m = axis === 'x' ? b / a : a / b;
  return {
    ...base, h, k, a, b, c: Math.sqrt(c2), axis, center,
    vertices: [axisPoint(nm('vertices', 0, 'V₁'), h, k, axis, -1, a * a), axisPoint(nm('vertices', 1, 'V₂'), h, k, axis, 1, a * a)],
    coVertices: [axisPoint(nm('coVertices', 0, 'B₁'), h, k, other, -1, b * b), axisPoint(nm('coVertices', 1, 'B₂'), h, k, other, 1, b * b)],
    foci: [axisPoint(nm('foci', 0, 'F₁'), h, k, axis, -1, c2), axisPoint(nm('foci', 1, 'F₂'), h, k, axis, 1, c2)],
    asymptotes: [lineOf(m, k - m * h), lineOf(-m, k + m * h)],
    symmetryAxis: axis === 'x' ? lineOf(0, k) : verticalLine(h),
    equation: axis === 'x' ? `${sq('x', h)}/${numText(a * a, 4)} − ${sq('y', k)}/${numText(b * b, 4)} = 1` : `${sq('y', k)}/${numText(a * a, 4)} − ${sq('x', h)}/${numText(b * b, 4)} = 1`,
  };
}

export function conicModel(r: Reader): ConicModel {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const shape = (yRange[1] - yRange[0]) / (xRange[1] - xRange[0]);
  if (shape < 0.4 - 1e-9 || shape > 1.4 + 1e-9) r.fail(`xRange and yRange: the axes have equal scales, so the plot would be ${numText(shape)} times as tall as it is wide — keep that between 0.4 and 1.4`);
  const conics = r.list(p.conics, 'conics', 1, 2).map((c, i) => readConic(r, c, `conics[${i}]`));
  const inside = (x: number, y: number): boolean => x >= xRange[0] - 1e-9 && x <= xRange[1] + 1e-9 && y >= yRange[0] - 1e-9 && y <= yRange[1] + 1e-9;
  conics.forEach((c, i) => {
    const name = `conics[${i}]`;
    if (c.type === 'circle' || c.type === 'ellipse') {
      const ex = c.type === 'circle' ? c.r : c.axis === 'x' ? c.a : c.b;
      const ey = c.type === 'circle' ? c.r : c.axis === 'x' ? c.b : c.a;
      if (!inside(c.h - ex, c.k - ey) || !inside(c.h + ex, c.k + ey)) r.fail(`${name}: the ${c.type} runs from x = ${numText(c.h - ex)} to ${numText(c.h + ex)} and y = ${numText(c.k - ey)} to ${numText(c.k + ey)} — widen xRange / yRange so the whole curve is inside`);
    } else {
      for (const v of c.vertices) if (!inside(v.x, v.y)) r.fail(`${name}: the vertex ${v.coords} is outside xRange / yRange — widen the ranges`);
    }
    const shownPoints: Array<[string, ConicPoint[]]> = c.type === 'parabola'
      ? [['vertex', c.vertices], ['focus', c.foci]]
      : [['center', c.center ? [c.center] : []], ['vertices', c.vertices], ['coVertices', c.coVertices], ['foci', c.foci]];
    for (const [feature, pts] of shownPoints) {
      if ((c.show[feature] ?? 'none') === 'none') continue;
      for (const q of pts) if (!inside(q.x, q.y)) r.fail(`${name}.show.${feature}: ${q.name} ${q.coords} is outside xRange / yRange — widen the ranges or leave it out`);
    }
    if (c.directrix && c.show.directrix !== 'none') {
      const d = c.directrix;
      const ok = d.vertical ? d.at > xRange[0] && d.at < xRange[1] : d.intercept > yRange[0] && d.intercept < yRange[1];
      if (!ok) r.fail(`${name}.show.directrix: the directrix ${d.equation} is outside the ranges — widen them or leave it out`);
    }
  });
  const lines = (p.lines === undefined || p.lines === null ? [] : r.list(p.lines, 'lines', 0, 3)).map((raw, i) => {
    const o = r.obj(raw, `lines[${i}]`);
    const label = r.optStr(o.label, `lines[${i}].label`, 20);
    if (o.x !== undefined && o.x !== null) return verticalLine(r.num(o.x, `lines[${i}].x`), label);
    return lineOf(r.num(o.slope, `lines[${i}].slope`), r.num(o.intercept, `lines[${i}].intercept`), label);
  });
  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 6)).map((raw, i) => {
    const o = r.obj(raw, `points[${i}]`);
    const x = r.num(o.x, `points[${i}].x`);
    const y = r.num(o.y, `points[${i}].y`);
    if (!inside(x, y)) r.fail(`points[${i}] (${numText(x)}, ${numText(y)}) is outside xRange / yRange`);
    return { x, y, label: r.optStr(o.label, `points[${i}].label`, 16) };
  });
  // letterLabels: every one-capital-letter name becomes the next numeral, in drawing order.
  const letterLabels = readLetterLabels(r);
  if (letterLabels) {
    const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV'];
    let n = 0;
    const seen = new Map<string, string>();
    const as = <T extends string | undefined>(sv: T): T => {
      if (sv === undefined || !/^[A-Z]$/.test(sv)) return sv;
      if (!seen.has(sv)) { seen.set(sv, letterLabels === 'roman' ? ROMAN[n] : String(n + 1)); n++; }
      return seen.get(sv) as T;
    };
    for (const c of conics) {
      c.label = as(c.label);
      for (const q of [...(c.center ? [c.center] : []), ...c.vertices, ...c.coVertices, ...c.foci]) q.name = as(q.name);
    }
    for (const l of lines) l.label = as(l.label);
    for (const q of points) q.label = as(q.label);
  }
  // Two marks of one figure never share a name.
  const names = conics.flatMap((c, i) => [...(c.center && c.show.center !== 'none' ? [c.center] : []), ...(c.show[c.type === 'parabola' ? 'vertex' : 'vertices'] !== 'none' ? c.vertices : []), ...(c.show.coVertices !== undefined && c.show.coVertices !== 'none' ? c.coVertices : []), ...(c.show[c.type === 'parabola' ? 'focus' : 'foci'] !== 'none' ? c.foci : [])].map((q) => ({ i, name: q.name })));
  if ((p.conics as unknown[]).some((c) => (c as Params).names !== undefined && (c as Params).names !== null)) {
    for (let a = 0; a < names.length; a++) for (let b = a + 1; b < names.length; b++) if (names[a].name === names[b].name) r.fail(`conics[${names[b].i}].names: the name "${names[b].name}" is used for two marked points — give each its own`);
  }
  return { xRange, yRange, xStep: r.optStep(p.xStep, 'xStep'), yStep: r.optStep(p.yStep, 'yStep'), title: r.optStr(p.title, 'title'), conics, lines, points, letterLabels };
}

/** The points where a line meets a conic (0, 1 or 2), in order of x then y. */
export function lineConicIntersections(c: Conic, l: ConicLine): Array<[number, number]> {
  // Implicit form A x'² + B y'² + D x' + E y' + F = 0 about the centre / vertex.
  const q = c.type === 'circle' ? { A: 1, B: 1, D: 0, E: 0, F: -c.r * c.r }
    : c.type === 'ellipse' ? { A: 1 / (c.axis === 'x' ? c.a * c.a : c.b * c.b), B: 1 / (c.axis === 'x' ? c.b * c.b : c.a * c.a), D: 0, E: 0, F: -1 }
      : c.type === 'hyperbola' ? (c.axis === 'x' ? { A: 1 / (c.a * c.a), B: -1 / (c.b * c.b), D: 0, E: 0, F: -1 } : { A: -1 / (c.b * c.b), B: 1 / (c.a * c.a), D: 0, E: 0, F: -1 })
        : c.axis === 'y' ? { A: 1, B: 0, D: 0, E: -4 * c.p, F: 0 } : { A: 0, B: 1, D: -4 * c.p, E: 0, F: 0 };
  // The line as (x0 + t·dx, y0 + t·dy) in centred coordinates.
  const [x0, y0, dx, dy] = l.vertical ? [l.at - c.h, -c.k, 0, 1] : [-c.h, l.intercept - c.k, 1, l.slope];
  const qa = q.A * dx * dx + q.B * dy * dy;
  const qb = 2 * q.A * x0 * dx + 2 * q.B * y0 * dy + q.D * dx + q.E * dy;
  const qc = q.A * x0 * x0 + q.B * y0 * y0 + q.D * x0 + q.E * y0 + q.F;
  let ts: number[];
  if (Math.abs(qa) < 1e-12) ts = Math.abs(qb) < 1e-12 ? [] : [-qc / qb];
  else {
    const disc = qb * qb - 4 * qa * qc;
    const tol = 1e-9 * Math.max(1, qb * qb, Math.abs(4 * qa * qc));
    ts = disc < -tol ? [] : disc <= tol ? [-qb / (2 * qa)] : [(-qb - Math.sqrt(disc)) / (2 * qa), (-qb + Math.sqrt(disc)) / (2 * qa)];
  }
  return ts.map((t) => [x0 + t * dx + c.h, y0 + t * dy + c.k] as [number, number]).sort((u, v) => u[0] - v[0] || u[1] - v[1]);
}

const POINT_FS = TICK_FS;

export function renderConicGraph(r: Reader, uid = 'pf'): Drawn {
  const m = conicModel(r);
  const [x0, x1] = m.xRange;
  const [y0, y1] = m.yRange;
  const f = buildFrame({ xRange: m.xRange, yRange: m.yRange, xStep: m.xStep, yStep: m.yStep, commonStep: true, xLabel: 'x', yLabel: 'y', aspect: (y1 - y0) / (x1 - x0), title: m.title });
  const notes: NonNullable<FigureFacts['notes']> = [];
  const marks: FigureFacts['marks'] = [];
  const X = f.X;
  const Y = f.Y;
  const plotBox: Box = { x0: f.plot.x + 2, y0: f.plot.y + 2, x1: f.plot.x + f.plot.w - 2, y1: f.plot.y + f.plot.h - 2 };
  const placer = new Placer(plotBox);
  const clip = `${uid}-clip`;
  // Labels keep off the two axis lines as well.
  if (y0 <= 0 && y1 >= 0) placer.block(...segmentBoxes(f.plot.x, Y(0), f.plot.x + f.plot.w, Y(0), 1));
  if (x0 <= 0 && x1 >= 0) placer.block(...segmentBoxes(X(0), f.plot.y, X(0), f.plot.y + f.plot.h, 1));
  const parts: string[] = [f.svg, `<defs><clipPath id="${clip}"><rect x="${n2(f.plot.x)}" y="${n2(f.plot.y)}" width="${n2(f.plot.w)}" height="${n2(f.plot.h)}"/></clipPath></defs>`];
  const clipped: string[] = [];
  const top: string[] = [];
  const labels: Array<() => void> = [];

  /** The part of a line inside the plot, in canvas coordinates. */
  const visible = (l: ConicLine): [number, number, number, number] | null => {
    if (l.vertical) return l.at < x0 || l.at > x1 ? null : [X(l.at), Y(y0), X(l.at), Y(y1)];
    let ta = x0;
    let tb = x1;
    if (Math.abs(l.slope) > 1e-12) {
      const u = (y0 - l.intercept) / l.slope;
      const v = (y1 - l.intercept) / l.slope;
      ta = Math.max(ta, Math.min(u, v));
      tb = Math.min(tb, Math.max(u, v));
    } else if (l.intercept < y0 || l.intercept > y1) return null;
    return tb - ta > 1e-9 ? [X(ta), Y(l.slope * ta + l.intercept), X(tb), Y(l.slope * tb + l.intercept)] : null;
  };
  const guide = (l: ConicLine, dash: string, width = GUIDE_WIDTH, color: string = GUIDE_COLOR): [number, number, number, number] | null => {
    const v = visible(l);
    if (!v) return null;
    const d = `M${n2(v[0])},${n2(v[1])}L${n2(v[2])},${n2(v[3])}`;
    clipped.push(`<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${GUIDE_MASK_WIDTH}"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${n2(width)}" stroke-dasharray="${dash}"/>`);
    placer.block(...segmentBoxes(v[0], v[1], v[2], v[3], 2));
    return v;
  };
  /** A label beside a line, near `at` (0–1) along its visible part. */
  const lineLabel = (v: [number, number, number, number], s: string, at: number, what: string): void => {
    labels.push(() => {
      const cands: Candidate[] = [];
      const len = Math.hypot(v[2] - v[0], v[3] - v[1]) || 1;
      const nx = -(v[3] - v[1]) / len;
      const ny = (v[2] - v[0]) / len;
      const ts = Array.from({ length: 21 }, (_, j) => 0.1 + j * 0.04).sort((u, w) => Math.abs(u - at) - Math.abs(w - at));
      for (const t of ts) {
        const px = v[0] + (v[2] - v[0]) * t;
        const py = v[1] + (v[3] - v[1]) * t;
        cands.push(...around(px, py, POINT_FS, nx, ny, [8]).slice(0, 2), ...around(px, py, POINT_FS, -nx, -ny, [8]).slice(0, 2));
      }
      put(s === '?' ? '' : s, s === '?', cands, what);
    });
  };
  /** Place and draw `name` followed (when `q`) by a "?" box. */
  const labelBoxes: Box[] = [];
  const dotBoxes: Array<{ box: Box; at: [number, number] }> = [];
  /** The leader from a dot to its label's box, or null when the label is right beside the dot. */
  const leaderOf = (box: Box, from: [number, number]): [number, number, number, number] | null => {
    const nx = Math.max(box.x0, Math.min(box.x1, from[0]));
    const ny = Math.max(box.y0, Math.min(box.y1, from[1]));
    const d = Math.hypot(nx - from[0], ny - from[1]);
    if (d <= 15) return null;
    const [ux, uy] = [(nx - from[0]) / d, (ny - from[1]) / d];
    return [from[0] + ux * 5, from[1] + uy * 5, nx - ux * 2, ny - uy * 2];
  };
  const put = (name: string, q: boolean, cands: Candidate[], what: string, from?: [number, number]): void => {
    const layout = q ? `${name}${name ? ' ' : ''}???` : name;
    let c: ReturnType<Placer['place']> | null = null;
    if (from) {
      // The first clear place whose leader (if it needs one) crosses no other label and no other dot.
      for (const cand of cands) {
        const tried = placer.place(layout, POINT_FS, [cand]);
        const lead = tried.clean ? leaderOf(tried.box, from) : null;
        const crosses = lead ? segmentBoxes(lead[0], lead[1], lead[2], lead[3], 1.5).some((sb) => labelBoxes.some((lb) => overlaps(sb, lb, 1)) || dotBoxes.some((db) => (db.at[0] !== from[0] || db.at[1] !== from[1]) && overlaps(sb, db.box))) : false;
        if (tried.clean && !crosses) {
          c = tried;
          break;
        }
        placer.unplace();
      }
    }
    if (!c) c = placer.place(layout, POINT_FS, cands);
    labelBoxes.push(c.box);
    const lead = from ? leaderOf(c.box, from) : null;
    if (lead) {
      top.push(`<path d="M${n2(lead[0])},${n2(lead[1])}L${n2(lead[2])},${n2(lead[3])}" fill="none" stroke="${MUTED}" stroke-width="0.9"/>`);
      placer.block(...segmentBoxes(lead[0], lead[1], lead[2], lead[3], 1.5));
    }
    if (!c.clean) notes.push({ code: 'labels_overlap', message: `the label of ${what} has no clear place — it overlaps a line or another label; move the ranges or show fewer features` });
    if (name) top.push(text(c.box.x0, c.y, name, { fs: POINT_FS, anchor: 'start', halo: true, weight: 600 }));
    if (q) top.push(blank(c.box.x1 - 10, (c.box.y0 + c.box.y1) / 2, 19, POINT_FS + 5, POINT_FS));
  };
  const dot = (x: number, y: number, what: string, color: string = INK): void => {
    const cx = X(x);
    const cy = Y(y);
    top.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="5.4" fill="#ffffff"/><circle cx="${n2(cx)}" cy="${n2(cy)}" r="3.4" fill="${color}"/>`);
    placer.block({ x0: cx - 5, y0: cy - 5, x1: cx + 5, y1: cy + 5 });
    dotBoxes.push({ box: { x0: cx - 5, y0: cy - 5, x1: cx + 5, y1: cy + 5 }, at: [cx, cy] });
    marks.push({ what, cx, cy });
  };
  const dots: Array<{ cx: number; cy: number; what: string }> = [];
  const feature = (q: ConicPoint, show: ConicShow, what: string, dirX: number, dirY: number): void => {
    if (show === 'none') return;
    dot(q.x, q.y, what);
    dots.push({ cx: X(q.x), cy: Y(q.y), what });
    labels.push(() => {
      const cands = around(X(q.x), Y(q.y), POINT_FS, dirX, dirY, [8, 13, 24, 34, 46, 60]);
      put(show === 'value' ? `${q.name} ${q.coords}` : q.name, show === 'blank', cands, what, [X(q.x), Y(q.y)]);
    });
  };

  const dashes = assignDashes(m.conics.map(() => false));
  const legend: LegendEntry[] = [];
  const curves: FigureFacts['curves'] = [];
  m.conics.forEach((c, i) => {
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    const what = `conics[${i}]`;
    const branches: Array<Array<[number, number]>> = [];
    const reach = Math.hypot(x1 - x0, y1 - y0) + Math.abs(c.h) + Math.abs(c.k);
    if (c.type === 'circle' || c.type === 'ellipse') {
      const ex = c.type === 'circle' ? c.r : c.axis === 'x' ? c.a : c.b;
      const ey = c.type === 'circle' ? c.r : c.axis === 'x' ? c.b : c.a;
      const pts: Array<[number, number]> = [];
      for (let j = 0; j <= 144; j++) pts.push([c.h + ex * Math.cos((j * Math.PI) / 72), c.k + ey * Math.sin((j * Math.PI) / 72)]);
      branches.push(pts);
    } else if (c.type === 'hyperbola') {
      const T = Math.asinh((Math.max(x1 - x0, y1 - y0) * 1.5 + Math.abs(c.h) + Math.abs(c.k)) / c.b);
      for (const s of [-1, 1]) {
        const pts: Array<[number, number]> = [];
        for (let j = 0; j <= 96; j++) {
          const t = -T + (2 * T * j) / 96;
          pts.push(c.axis === 'x' ? [c.h + s * c.a * Math.cosh(t), c.k + c.b * Math.sinh(t)] : [c.h + c.b * Math.sinh(t), c.k + s * c.a * Math.cosh(t)]);
        }
        branches.push(pts);
      }
    } else {
      const S = c.axis === 'y' ? Math.max(Math.abs(x0 - c.h), Math.abs(x1 - c.h)) : Math.max(Math.abs(y0 - c.k), Math.abs(y1 - c.k));
      const pts: Array<[number, number]> = [];
      for (let j = 0; j <= 120; j++) {
        const s = -S + (2 * S * j) / 120;
        pts.push(c.axis === 'y' ? [c.h + s, c.k + (s * s) / (4 * c.p)] : [c.h + (s * s) / (4 * c.p), c.k + s]);
      }
      branches.push(pts);
    }
    let inside = 0;
    let total = 0;
    for (const pts of branches) {
      // Far points only steer the stroke out of the plot; keep them within reach of the canvas.
      const kept = pts.filter(([x, y]) => Math.abs(x) < reach * 4 && Math.abs(y) < reach * 4);
      const d = kept.map(([x, y], j) => `${j === 0 ? 'M' : 'L'}${n2(X(x))},${n2(Y(y))}`).join('');
      clipped.push(`<path d="${d}${c.type === 'circle' || c.type === 'ellipse' ? 'z' : ''}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"${dashAttr(dashes[i])}/>`);
      for (const [x, y] of kept) {
        total++;
        if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
          inside++;
          placer.block({ x0: X(x) - 3, y0: Y(y) - 3, x1: X(x) + 3, y1: Y(y) + 3 });
        }
      }
    }
    curves.push({ what, visibleFraction: c.type === 'circle' || c.type === 'ellipse' ? 1 : Math.min(1, (inside / Math.max(1, total)) * 4), stubs: 0 });
    if (c.label || m.conics.length > 1) legend.push({ label: c.label ?? `curve ${i + 1}`, color, dash: dashes[i] || undefined });

    // Guides under the marks.
    if (c.show.box === 'mark') {
      const [ax, by] = c.axis === 'x' ? [c.a, c.b] : [c.b, c.a];
      const d = `M${n2(X(c.h - ax))},${n2(Y(c.k - by))}H${n2(X(c.h + ax))}V${n2(Y(c.k + by))}H${n2(X(c.h - ax))}z`;
      clipped.push(`<path d="${d}" fill="none" stroke="${MUTED}" stroke-width="1" stroke-dasharray="2 3"/>`);
    }
    if (c.symmetryAxis && c.show.axis !== 'none') {
      const v = guide(c.symmetryAxis, '2 4', 1.2, MUTED);
      if (v && c.show.axis !== 'mark') lineLabel(v, c.show.axis === 'blank' ? '?' : c.symmetryAxis.equation, 0.9, `the axis of ${what}`);
    }
    if (c.show.asymptotes && c.show.asymptotes !== 'none') {
      c.asymptotes.forEach((l, j) => {
        const v = guide(l, GUIDE_DASH);
        if (v && c.show.asymptotes !== 'mark') lineLabel(v, c.show.asymptotes === 'blank' ? '?' : l.equation, l.slope > 0 ? 0.88 : 0.12, `asymptote ${j + 1} of ${what}`);
      });
    }
    if (c.directrix && c.show.directrix !== 'none') {
      const v = guide(c.directrix, '7 3 2 3');
      if (v && c.show.directrix !== 'mark') lineLabel(v, c.show.directrix === 'blank' ? '?' : c.directrix.equation, 0.85, `the directrix of ${what}`);
    }
    if (c.type === 'circle' && c.show.radius !== 'none') {
      const ang = (35 * Math.PI) / 180;
      const [ex, ey] = [c.h + c.r * Math.cos(ang), c.k + c.r * Math.sin(ang)];
      clipped.push(`<path d="M${n2(X(c.h))},${n2(Y(c.k))}L${n2(X(ex))},${n2(Y(ey))}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
      placer.block(...segmentBoxes(X(c.h), Y(c.k), X(ex), Y(ey), 2));
      if (c.show.center === 'none') top.push(`<circle cx="${n2(X(c.h))}" cy="${n2(Y(c.k))}" r="2.2" fill="${INK}"/>`);
      const s = c.show.radius;
      labels.push(() => {
        const mx = (X(c.h) + X(ex)) / 2;
        const my = (Y(c.k) + Y(ey)) / 2;
        put(s === 'value' ? numText(c.r) : s === 'mark' ? 'r' : '', s === 'blank', [...around(mx, my, POINT_FS, -0.57, -0.82, [8, 12]), ...around(mx, my, POINT_FS, 0.57, 0.82, [8, 12])], `the radius of ${what}`);
      });
    }
    // Marked points: away from the centre along the axis for vertices and foci.
    const ax: [number, number] = c.axis === 'x' ? [1, 0] : [0, 1];
    if (c.type === 'parabola') {
      const open = Math.sign(c.p);
      feature(c.vertices[0], c.show.vertex, `the vertex of ${what}`, c.axis === 'x' ? -open : 0.8, c.axis === 'x' ? -0.8 : open);
      feature(c.foci[0], c.show.focus, `the focus of ${what}`, c.axis === 'x' ? open : 0.8, c.axis === 'x' ? -0.8 : -open);
    } else {
      if (c.center) feature(c.center, c.show.center, `the centre of ${what}`, 0.7, -0.7);
      c.vertices.forEach((q, j) => feature(q, c.show.vertices ?? 'none', `vertex ${q.name} of ${what}`, (j ? 1 : -1) * ax[0] + ax[1] * 0.8, -((j ? 1 : -1) * ax[1]) - ax[0] * 0.8));
      c.coVertices.forEach((q, j) => feature(q, c.show.coVertices ?? 'none', `co-vertex ${q.name} of ${what}`, (j ? 1 : -1) * ax[1] + ax[0] * 0.8, -((j ? 1 : -1) * ax[0]) - ax[1] * 0.8));
      c.foci.forEach((q, j) => feature(q, c.show.foci ?? 'none', `focus ${q.name} of ${what}`, (j ? 1 : -1) * ax[0] * 0.4 + ax[1] * 0.8, ax[0] * 0.9 - (j ? 1 : -1) * ax[1] * 0.4));
    }
  });

  m.lines.forEach((l, i) => {
    const v = visible(l);
    if (!v) r.fail(`lines[${i}] (${l.equation}) does not cross the plot — change the line or the ranges`);
    const seg = v as [number, number, number, number];
    clipped.push(`<path d="M${n2(seg[0])},${n2(seg[1])}L${n2(seg[2])},${n2(seg[3])}" fill="none" stroke="${SERIES_COLORS[2]}" stroke-width="2"/>`);
    placer.block(...segmentBoxes(seg[0], seg[1], seg[2], seg[3], 2));
    if (l.label) lineLabel(seg, l.label, 0.9, `lines[${i}]`);
  });
  m.points.forEach((q, i) => {
    dot(q.x, q.y, `points[${i}]`);
    dots.push({ cx: X(q.x), cy: Y(q.y), what: `points[${i}]` });
    if (q.label) labels.push(() => put(q.label as string, false, around(X(q.x), Y(q.y), POINT_FS, 0.7, -0.7, [8, 13, 24, 34]), `points[${i}]`, [X(q.x), Y(q.y)]));
  });
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const d = Math.hypot(dots[i].cx - dots[j].cx, dots[i].cy - dots[j].cy);
      if (d > 0.5 && d < 9) notes.push({ code: 'crowded', message: `${dots[i].what} and ${dots[j].what} are drawn ${numText(d, 1)} units apart — their dots touch at phone width; show one of them or narrow the ranges` });
    }
  }
  for (const draw of labels) draw();

  parts.push(`<g clip-path="url(#${clip})">${clipped.join('')}</g>`, top.join(''));
  let H = f.bottom;
  if (legend.length > 0) {
    const lg = buildLegend(legend, H, FIGURE_WIDTH);
    parts.push(lg.svg);
    H += lg.height;
  }
  return { body: parts.join(''), H, facts: { plot: f.plot, curveCount: m.conics.length + m.lines.length, marks, curves, notes } };
}
