/**
 * geometric_figure — coordinate-free plane figures (no axes), exact in
 * proportion unless `notToScale` is set (then "not to scale" is printed).
 *
 * Common: { shape; unit?: string;          // appended to 'auto' lengths ("cm")
 *           notToScale?: boolean (false); title?: string }
 * A LABEL is 'auto' (the true value: a length to 2 decimals, an angle to
 * 1 decimal with "°"), any text ("x", "2x + 10°", "5√2"), "?" (a blank box),
 * or null (nothing). Nothing is printed that the spec does not ask for.
 *
 * shape 'triangle' — vertices A (left of the base), B (right), C (apex);
 *   sides a = BC, b = CA, c = AB:
 *   { sides: [a, b, c] | sas: [b, A°, c] | asa: [A°, c, B°] | points: [[x, y] × 3];
 *     vertices?: [string, string, string] (['A', 'B', 'C']) | null (no names);
 *     sideLabels?: [a, b, c];  angleLabels?: [A, B, C];
 *     ticks?: [a, b, c];                   // 0–3 tick marks on a side (equal sides)
 *     rightAngleMarks?: boolean (true);    // a square in every right angle
 *     altitude?: { from: 0 | 1 | 2; label?: LABEL };   // dashed, with its right-angle mark
 *     drawn?: { sides: [a, b, c] } }       // with notToScale: the shape actually drawn
 * shape 'polygon' — side i runs from vertex i to vertex i + 1:
 *   { points: [[x, y] × 3–8] | regular: { n: 3–8; side: number };
 *     vertices?: string[] | null; sideLabels?: LABEL[]; angleLabels?: LABEL[];
 *     ticks?: number[]; rightAngleMarks?: boolean (true) }
 * shape 'circle' — points are placed by angle (degrees, counter-clockwise from 3 o'clock):
 *   { radius: number; center?: string ('O') | null;
 *     points?: Array<{ name: string; at: number }>;
 *     radii?: Array<{ to: name; label?: LABEL }>;
 *     chords?: Array<{ from: name; to: name; label?: LABEL }>;      // a diameter is a chord
 *     tangent?: { at: name; length?: number; end?: string; label?: LABEL };
 *                                          // `length`/`end`: drawn to an external point with that name
 *     angles?: Array<{ vertex: name | 'center'; from: name; to: name; label: LABEL }>;
 *     sector?: { from: name; to: name };   // hatched, counter-clockwise from → to
 *     arc?: { from: name; to: name; label: LABEL } }                // a heavier arc with a label
 * shape 'parallel_lines' — two parallel lines cut by a transversal that
 *   rises to the right at `angle`° to them:
 *   { angle: number (20–160);
 *     labels: { [position]: LABEL };       // positions 1–4 round the upper crossing (1 upper left,
 *                                          // 2 upper right, 3 lower left, 4 lower right), 5–8 the lower
 *     lineNames?: [string, string, string] | null }   // the two parallels and the transversal
 * shape 'similar_triangles' — a triangle and its image under `scale`:
 *   { sides: [a, b, c]; scale: number;
 *     vertices?: [[3 names], [3 names]]; sideLabels?: [[a, b, c], [a, b, c]];
 *     angleLabels?: [[A, B, C], [A, B, C]]; rotate?: number (0) }   // degrees, second triangle
 */
import { FIGURE_WIDTH, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, Placer, arcPath, around, hatched, layoutText, segmentBoxes, text, titleBlock, type Box } from './draw';
import { deg, facts, lab, numStr, polyPath, stroke, type Notes, type Pt } from './draw2';

export type GeoLabel = string | null;

export interface PolyModel {
  /** True coordinates, y up. */
  pts: Pt[];
  /** What is drawn (differs from `pts` only under notToScale + drawn). */
  drawPts: Pt[];
  names: string[] | null;
  /** Per side i (vertex i → i + 1): the printed label, resolved. */
  sideLabels: GeoLabel[];
  angleLabels: GeoLabel[];
  ticks: number[];
  rightAngleMarks: boolean;
  /** True side lengths (side i) and interior angles (vertex i, degrees). */
  sides: number[];
  angles: number[];
  altitude?: { from: number; label: GeoLabel; length: number };
}
export interface CirclePoint { name: string; at: number }
export interface CircleModel {
  radius: number;
  center: string | null;
  points: CirclePoint[];
  radii: Array<{ to: CirclePoint; label: GeoLabel }>;
  chords: Array<{ from: CirclePoint; to: CirclePoint; label: GeoLabel; length: number }>;
  tangent?: { at: CirclePoint; length?: number; end?: string; label: GeoLabel };
  angles: Array<{ vertex: CirclePoint | 'center'; from: CirclePoint; to: CirclePoint; label: GeoLabel; degrees: number }>;
  sector?: { from: CirclePoint; to: CirclePoint; degrees: number };
  arc?: { from: CirclePoint; to: CirclePoint; label: GeoLabel; degrees: number };
}
export interface GeoModel {
  shape: 'triangle' | 'polygon' | 'circle' | 'parallel_lines' | 'similar_triangles';
  unit: string;
  notToScale: boolean;
  title?: string;
  poly?: PolyModel;
  circle?: CircleModel;
  parallel?: { angle: number; labels: Record<number, string>; values: Record<number, number>; lineNames: [string, string, string] | null };
  similar?: { first: PolyModel; second: PolyModel; scale: number; rotate: number };
}

const SHAPES = ['triangle', 'polygon', 'circle', 'parallel_lines', 'similar_triangles'] as const;
const dist = (p: Pt, q: Pt): number => Math.hypot(p[0] - q[0], p[1] - q[1]);
/** Counter-clockwise sweep from angle a to angle b, in degrees (0, 360]. */
export const ccw = (a: number, b: number): number => ((((b - a) % 360) + 360) % 360) || 360;

function interiorAngles(pts: Pt[]): number[] {
  const n = pts.length;
  let area = 0;
  pts.forEach((p, i) => { const q = pts[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; });
  return pts.map((p, i) => {
    const a = pts[(i + n - 1) % n];
    const b = pts[(i + 1) % n];
    const toNext = Math.atan2(b[1] - p[1], b[0] - p[0]);
    const toPrev = Math.atan2(a[1] - p[1], a[0] - p[0]);
    let sweep = ((area > 0 ? toPrev - toNext : toNext - toPrev) * 180) / Math.PI;
    sweep = ((sweep % 360) + 360) % 360;
    return sweep;
  });
}

function trianglePoints(r: Reader, a: number, b: number, c: number, name: string): Pt[] {
  if (!(a + b > c + 1e-9 && a + c > b + 1e-9 && b + c > a + 1e-9)) r.fail(`${name}: no triangle has sides ${a}, ${b}, ${c} (each side must be shorter than the other two together)`);
  const cosA = (b * b + c * c - a * a) / (2 * b * c);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  return [[0, 0], [c, 0], [b * Math.cos(A), b * Math.sin(A)]];
}

export function geometryModel(r: Reader): GeoModel {
  const p = r.p;
  if (!SHAPES.includes(p.shape as GeoModel['shape'])) r.fail(`shape must be one of ${SHAPES.join(', ')}`);
  const shape = p.shape as GeoModel['shape'];
  const unit = r.optStr(p.unit, 'unit', 6) ?? '';
  const base = { shape, unit, notToScale: r.bool(p.notToScale, 'notToScale', false), title: r.optStr(p.title, 'title', 160) };
  const len = (v: number): string => `${numStr(v, 2)}${unit ? ` ${unit}` : ''}`;
  const ang = (v: number): string => `${numStr(v, 1)}°`;
  const one = (v: unknown, name: string, auto: string): GeoLabel => (v === undefined || v === null ? null : v === 'auto' ? auto : r.str(v, name, 18));
  const labels = (v: unknown, name: string, autos: string[]): GeoLabel[] => {
    if (v === undefined || v === null) return autos.map(() => null);
    const list = r.list(v, name, autos.length, autos.length);
    return list.map((x, i) => one(x, `${name}[${i}]`, autos[i]));
  };
  const three = (v: unknown, name: string): [number, number, number] => r.list(v, name, 3, 3).map((x, i) => r.positive(x, `${name}[${i}]`)) as [number, number, number];
  const namesOf = (v: unknown, name: string, n: number, dflt: string[]): string[] | null => {
    if (v === null) return null;
    if (v === undefined) return dflt;
    return r.list(v, name, n, n).map((x, i) => r.str(x, `${name}[${i}]`, 3));
  };
  const points = (v: unknown, name: string, min: number, max: number): Pt[] => r.list(v, name, min, max).map((raw, i) => {
    if (!Array.isArray(raw) || raw.length !== 2) r.fail(`${name}[${i}] must be [x, y]`);
    return [r.num((raw as unknown[])[0], `${name}[${i}][0]`), r.num((raw as unknown[])[1], `${name}[${i}][1]`)];
  });
  /** A polygon model from its true points; `tri` maps the a/b/c order of a triangle's lists onto side indices. */
  const poly = (o: Record<string, unknown>, at: string, pts: Pt[], dflt: string[], tri: boolean, drawPts?: Pt[]): PolyModel => {
    const n = pts.length;
    const sides = pts.map((q, i) => dist(q, pts[(i + 1) % n]));
    if (sides.some((s) => s < 1e-9)) r.fail(`${at}: two neighbouring vertices coincide`);
    const angles = interiorAngles(pts);
    if (angles.some((a) => a < 1 || Math.abs(a - 180) < 0.5)) r.fail(`${at}: three vertices in a row lie on one line`);
    // Triangle lists are given as [a, b, c] = [BC, CA, AB] = sides [1, 2, 0].
    const order = tri ? [2, 0, 1] : pts.map((_, i) => i);
    const reorder = <T>(list: T[]): T[] => order.map((k) => list[k]);
    const sl = labels(o.sideLabels, `${at}sideLabels`, tri ? [sides[1], sides[2], sides[0]].map(len) : sides.map(len));
    const tk = o.ticks === undefined || o.ticks === null ? pts.map(() => 0) : r.list(o.ticks, `${at}ticks`, n, n).map((x, i) => {
      const k = r.num(x, `${at}ticks[${i}]`);
      if (!Number.isInteger(k) || k < 0 || k > 3) r.fail(`${at}ticks[${i}] must be 0, 1, 2 or 3`);
      return k;
    });
    return {
      pts, drawPts: drawPts ?? pts,
      names: namesOf(o.vertices, `${at}vertices`, n, dflt),
      sideLabels: tri ? reorder(sl) : sl,
      angleLabels: labels(o.angleLabels, `${at}angleLabels`, angles.map(ang)),
      ticks: tri ? reorder(tk) : tk,
      rightAngleMarks: r.bool(o.rightAngleMarks, `${at}rightAngleMarks`, true),
      sides, angles,
    };
  };
  const triFrom = (o: Record<string, unknown>, at: string): Pt[] => {
    const given = ['sides', 'sas', 'asa', 'points'].filter((k) => o[k] !== undefined && o[k] !== null);
    if (given.length !== 1) r.fail(`${at || 'triangle'}: give exactly one of sides, sas, asa, points`);
    if (given[0] === 'points') return points(o.points, `${at}points`, 3, 3);
    if (given[0] === 'sides') { const [a, b, c] = three(o.sides, `${at}sides`); return trianglePoints(r, a, b, c, `${at}sides`); }
    if (given[0] === 'sas') {
      const [b, A, c] = three(o.sas, `${at}sas`);
      if (!(A < 180)) r.fail(`${at}sas[1] (the angle) must be less than 180°`);
      return [[0, 0], [c, 0], [b * Math.cos(deg(A)), b * Math.sin(deg(A))]];
    }
    const [A, c, B] = three(o.asa, `${at}asa`);
    if (!(A + B < 180)) r.fail(`${at}asa: the two angles must add to less than 180°`);
    const b = (c * Math.sin(deg(B))) / Math.sin(deg(180 - A - B));
    return [[0, 0], [c, 0], [b * Math.cos(deg(A)), b * Math.sin(deg(A))]];
  };

  if (shape === 'triangle') {
    const pts = triFrom(p, '');
    let drawPts: Pt[] | undefined;
    if (p.drawn !== undefined && p.drawn !== null) {
      if (!base.notToScale) r.fail('drawn: only with notToScale (a figure drawn in other proportions must say so)');
      const [a, b, c] = three(r.obj(p.drawn, 'drawn').sides, 'drawn.sides');
      drawPts = trianglePoints(r, a, b, c, 'drawn.sides');
    }
    const m = poly(p, '', pts, ['A', 'B', 'C'], true, drawPts);
    if (p.altitude !== undefined && p.altitude !== null) {
      const o = r.obj(p.altitude, 'altitude');
      const from = r.num(o.from, 'altitude.from');
      if (![0, 1, 2].includes(from)) r.fail('altitude.from must be 0, 1 or 2 (the vertex it drops from)');
      const q = pts[(from + 1) % 3];
      const s = pts[(from + 2) % 3];
      const area2 = Math.abs((q[0] - pts[from][0]) * (s[1] - pts[from][1]) - (s[0] - pts[from][0]) * (q[1] - pts[from][1]));
      const length = area2 / dist(q, s);
      if (m.angles[(from + 1) % 3] > 90 + 1e-6 || m.angles[(from + 2) % 3] > 90 + 1e-6) r.fail('altitude: it would fall outside the triangle (an obtuse angle at the base)');
      m.altitude = { from, label: one(o.label, 'altitude.label', len(length)), length };
    }
    return { ...base, poly: m };
  }
  if (shape === 'polygon') {
    let pts: Pt[];
    if (p.regular !== undefined && p.regular !== null) {
      const o = r.obj(p.regular, 'regular');
      const n = r.num(o.n, 'regular.n');
      if (!Number.isInteger(n) || n < 3 || n > 8) r.fail('regular.n must be a whole number from 3 to 8');
      const R = r.positive(o.side, 'regular.side') / (2 * Math.sin(Math.PI / n));
      // Counter-clockwise from the lower-left vertex, so side 0 is the base.
      pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; return [R * Math.cos(a), R * Math.sin(a)] as Pt; });
    } else pts = points(p.points, 'points', 3, 8);
    return { ...base, poly: poly(p, '', pts, 'ABCDEFGH'.slice(0, pts.length).split(''), false) };
  }
  if (shape === 'similar_triangles') {
    const [a, b, c] = three(p.sides, 'sides');
    const k = r.positive(p.scale, 'scale');
    const sub = (i: number, key: string): unknown => (p[key] === undefined || p[key] === null ? undefined : r.list(p[key], key, 2, 2)[i]);
    const mk = (i: number, f: number, dflt: string[]): PolyModel => poly({ vertices: sub(i, 'vertices'), sideLabels: sub(i, 'sideLabels'), angleLabels: sub(i, 'angleLabels') }, `[${i}].`, trianglePoints(r, a * f, b * f, c * f, 'sides'), dflt, true);
    return { ...base, similar: { first: mk(0, 1, ['A', 'B', 'C']), second: mk(1, k, ['D', 'E', 'F']), scale: k, rotate: r.optNum(p.rotate, 'rotate') ?? 0 } };
  }
  if (shape === 'parallel_lines') {
    const angle = r.num(p.angle, 'angle');
    if (angle < 20 || angle > 160) r.fail('angle must be between 20 and 160 (degrees between the transversal and the parallel lines)');
    const values: Record<number, number> = {};
    for (let k = 1; k <= 8; k++) values[k] = [2, 3].includes(((k - 1) % 4) + 1) ? angle : 180 - angle;
    const raw = r.obj(p.labels, 'labels');
    const out: Record<number, string> = {};
    for (const [key, v] of Object.entries(raw)) {
      const k = Number(key);
      if (!Number.isInteger(k) || k < 1 || k > 8) r.fail(`labels: "${key}" is not a position from 1 to 8`);
      const s = one(v, `labels.${key}`, ang(values[k]));
      if (s !== null) out[k] = s;
    }
    if (Object.keys(out).length === 0) r.fail('labels: label at least one angle');
    return { ...base, parallel: { angle, labels: out, values, lineNames: p.lineNames === null ? null : (namesOf(p.lineNames, 'lineNames', 3, ['ℓ', 'm', 't']) as [string, string, string]) } };
  }
  // circle
  const radius = r.positive(p.radius, 'radius');
  const pts: CirclePoint[] = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 8)).map((raw, i) => {
    const o = r.obj(raw, `points[${i}]`);
    return { name: r.str(o.name, `points[${i}].name`, 3), at: r.num(o.at, `points[${i}].at`) };
  });
  pts.forEach((q, i) => { if (pts.findIndex((x) => x.name === q.name) !== i) r.fail(`points: the name "${q.name}" is used twice`); });
  const pt = (v: unknown, name: string): CirclePoint => {
    const q = pts.find((x) => x.name === v);
    if (!q) r.fail(`${name}: "${String(v)}" is not one of the points`);
    return q as CirclePoint;
  };
  const xy = (q: CirclePoint): Pt => [radius * Math.cos(deg(q.at)), radius * Math.sin(deg(q.at))];
  const list = (v: unknown, name: string): Array<Record<string, unknown>> => (v === undefined || v === null ? [] : r.list(v, name, 0, 6)).map((raw, i) => r.obj(raw, `${name}[${i}]`));
  const span = (v: unknown, name: string): { from: CirclePoint; to: CirclePoint; degrees: number } | undefined => {
    if (v === undefined || v === null) return undefined;
    const o = r.obj(v, name);
    const from = pt(o.from, `${name}.from`);
    const to = pt(o.to, `${name}.to`);
    return { from, to, degrees: ccw(from.at, to.at) };
  };
  const m: CircleModel = {
    radius,
    center: p.center === null ? null : r.optStr(p.center, 'center', 3) ?? 'O',
    points: pts,
    radii: list(p.radii, 'radii').map((o, i) => ({ to: pt(o.to, `radii[${i}].to`), label: one(o.label, `radii[${i}].label`, len(radius)) })),
    chords: list(p.chords, 'chords').map((o, i) => {
      const from = pt(o.from, `chords[${i}].from`);
      const to = pt(o.to, `chords[${i}].to`);
      const length = dist(xy(from), xy(to));
      if (length < 1e-9) r.fail(`chords[${i}]: both ends are the same point`);
      return { from, to, length, label: one(o.label, `chords[${i}].label`, len(length)) };
    }),
    angles: list(p.angles, 'angles').map((o, i) => {
      const vertex = o.vertex === 'center' ? 'center' as const : pt(o.vertex, `angles[${i}].vertex`);
      const from = pt(o.from, `angles[${i}].from`);
      const to = pt(o.to, `angles[${i}].to`);
      const v: Pt = vertex === 'center' ? [0, 0] : xy(vertex);
      const a = xy(from);
      const b = xy(to);
      const cos = ((a[0] - v[0]) * (b[0] - v[0]) + (a[1] - v[1]) * (b[1] - v[1])) / (dist(a, v) * dist(b, v));
      if (!Number.isFinite(cos)) r.fail(`angles[${i}]: the vertex coincides with an end`);
      const degrees = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
      return { vertex, from, to, degrees, label: one(o.label, `angles[${i}].label`, ang(degrees)) };
    }),
  };
  const sector = span(p.sector, 'sector');
  if (sector) m.sector = sector;
  const arc = span(p.arc, 'arc');
  if (arc) m.arc = { ...arc, label: one(r.obj(p.arc, 'arc').label, 'arc.label', len((arc.degrees / 360) * 2 * Math.PI * radius)) };
  if (p.tangent !== undefined && p.tangent !== null) {
    const o = r.obj(p.tangent, 'tangent');
    const length = r.optNum(o.length, 'tangent.length');
    if (length !== undefined && !(length > 0)) r.fail('tangent.length must be greater than 0');
    m.tangent = { at: pt(o.at, 'tangent.at'), length, end: r.optStr(o.end, 'tangent.end', 3), label: one(o.label, 'tangent.label', length === undefined ? '' : len(length)) || null };
  }
  return { ...base, circle: m };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

/** Maps true coordinates (y up) into a canvas box, one scale for both axes. */
function fit(all: Pt[], box: Box, maxScale = Infinity): { T: (q: Pt) => Pt; k: number; h: number } {
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);
  const w = Math.max(...xs) - Math.min(...xs) || 1;
  const h = Math.max(...ys) - Math.min(...ys) || 1;
  const k = Math.min((box.x1 - box.x0) / w, (box.y1 - box.y0) / h, maxScale);
  const ox = (box.x0 + box.x1) / 2 - ((Math.min(...xs) + Math.max(...xs)) / 2) * k;
  const top = box.y0;
  return { T: (q) => [ox + q[0] * k, top + (Math.max(...ys) - q[1]) * k], k, h: h * k };
}

interface Ctx { parts: string[]; placer: Placer; notes: Notes }

function put(c: Ctx, px: number, py: number, s: string, dirX: number, dirY: number, gaps: number[], o: { fs?: number; weight?: number; italic?: boolean } = {}): void {
  const fs = o.fs ?? 12;
  const at = c.placer.place(layoutText(s), fs, around(px, py, fs, dirX, dirY, gaps));
  if (!at.clean) c.notes.push({ code: 'labels_overlap', message: `the label "${s}" could not be set clear of the figure` });
  c.parts.push(lab(at.x, at.y, s, at.anchor, { fs, weight: o.weight, italic: o.italic, halo: true }));
}

/** The interior angle at canvas vertex v between canvas points a (previous) and b (next): its arc (or square) and label. */
function angleMark(c: Ctx, v: Pt, a: Pt, b: Pt, label: GeoLabel, square: boolean, rArc = 17): void {
  const ua: Pt = [(a[0] - v[0]) / dist(a, v), (a[1] - v[1]) / dist(a, v)];
  const ub: Pt = [(b[0] - v[0]) / dist(b, v), (b[1] - v[1]) / dist(b, v)];
  const cos = ua[0] * ub[0] + ua[1] * ub[1];
  const theta = Math.acos(Math.max(-1, Math.min(1, cos)));
  let bis: Pt = [ua[0] + ub[0], ua[1] + ub[1]];
  const bl = Math.hypot(bis[0], bis[1]);
  bis = bl < 1e-6 ? [-ua[1], ua[0]] : [bis[0] / bl, bis[1] / bl];
  if (square) {
    const s = 9;
    c.parts.push(`<path d="${polyPath([[v[0] + ua[0] * s, v[1] + ua[1] * s], [v[0] + (ua[0] + ub[0]) * s, v[1] + (ua[1] + ub[1]) * s], [v[0] + ub[0] * s, v[1] + ub[1] * s]])}" ${stroke(INK, 1.3)}/>`);
    if (label !== null) put(c, v[0] + bis[0] * 22, v[1] + bis[1] * 22, label, bis[0], bis[1], [0, 5, 10]);
    return;
  }
  if (label === null) return;
  // A narrow angle gets a wider arc, so the arc is still an arc.
  const rr = theta < 0.6 ? rArc + 9 : rArc;
  const a0 = Math.atan2(-ua[1], ua[0]);
  let sweep = Math.atan2(-ub[1], ub[0]) - a0;
  while (sweep > Math.PI) sweep -= 2 * Math.PI;
  while (sweep < -Math.PI) sweep += 2 * Math.PI;
  c.parts.push(`<path d="${arcPath(v[0], v[1], rr, a0, a0 + sweep)}" ${stroke(INK, 1.3)}/>`);
  const out = rr + (theta < 0.6 ? 16 : 11) + (label.length > 4 ? 5 : 0);
  put(c, v[0] + bis[0] * out, v[1] + bis[1] * out, label, bis[0], bis[1], [0, 5, 10, 16]);
}

function drawPoly(c: Ctx, m: PolyModel, P: Pt[]): void {
  const n = P.length;
  const cx = P.reduce((a, q) => a + q[0], 0) / n;
  const cy = P.reduce((a, q) => a + q[1], 0) / n;
  c.parts.push(`<path d="${polyPath(P, true)}" ${stroke(INK, 1.9)} stroke-linejoin="round"/>`);
  P.forEach((q, i) => c.placer.block(...segmentBoxes(q[0], q[1], P[(i + 1) % n][0], P[(i + 1) % n][1], 2)));
  if (m.altitude) {
    const v = P[m.altitude.from];
    const a = P[(m.altitude.from + 1) % n];
    const b = P[(m.altitude.from + 2) % n];
    const t = ((v[0] - a[0]) * (b[0] - a[0]) + (v[1] - a[1]) * (b[1] - a[1])) / dist(a, b) ** 2;
    const f: Pt = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    c.parts.push(`<path d="${polyPath([v, f])}" ${stroke(INK, 1.3, '5 3')}/>`);
    c.placer.block(...segmentBoxes(v[0], v[1], f[0], f[1], 2));
    angleMark(c, f, v, t > 0.5 ? a : b, null, true);
    if (m.altitude.label !== null) put(c, (v[0] + f[0]) / 2, (v[1] + f[1]) / 2, m.altitude.label, t > 0.5 ? -1 : 1, 0, [9, 14, 20]);
  }
  // Angle marks first (they are nearest the vertex), then side labels, then names.
  P.forEach((q, i) => {
    const right = m.rightAngleMarks && Math.abs(m.angles[i] - 90) < 1e-6;
    angleMark(c, q, P[(i + n - 1) % n], P[(i + 1) % n], m.angleLabels[i] !== null && right && /^90(\.0)?°$/.test(m.angleLabels[i] as string) ? null : m.angleLabels[i], right);
  });
  P.forEach((q, i) => {
    const s = P[(i + 1) % n];
    const mx = (q[0] + s[0]) / 2;
    const my = (q[1] + s[1]) / 2;
    const L = dist(q, s);
    let nx = -(s[1] - q[1]) / L;
    let ny = (s[0] - q[0]) / L;
    if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
    const ux = (s[0] - q[0]) / L;
    const uy = (s[1] - q[1]) / L;
    const k = m.ticks[i];
    if (k > 0) {
      const d: string[] = [];
      for (let j = 0; j < k; j++) {
        const off = (j - (k - 1) / 2) * 4.5;
        d.push(`M${n2(mx + ux * off - nx * 5)},${n2(my + uy * off - ny * 5)}L${n2(mx + ux * off + nx * 5)},${n2(my + uy * off + ny * 5)}`);
      }
      c.parts.push(`<path d="${d.join('')}" ${stroke(INK, 1.5)}/>`);
      c.placer.block({ x0: mx - 7, y0: my - 7, x1: mx + 7, y1: my + 7 });
    }
    const label = m.sideLabels[i];
    if (label !== null) put(c, mx + nx * (k > 0 ? 4 : 0), my + ny * (k > 0 ? 4 : 0), label, nx, ny, [9, 13, 18, 24]);
  });
  if (m.names) P.forEach((q, i) => {
    const l = Math.hypot(q[0] - cx, q[1] - cy) || 1;
    put(c, q[0], q[1], (m.names as string[])[i], (q[0] - cx) / l, (q[1] - cy) / l, [8, 12, 17], { weight: 600, italic: true });
  });
}

const rot = (pts: Pt[], d: number): Pt[] => pts.map(([x, y]) => [x * Math.cos(deg(d)) - y * Math.sin(deg(d)), x * Math.sin(deg(d)) + y * Math.cos(deg(d))]);

export function renderGeometry(r: Reader, uid: string): Drawn {
  const m = geometryModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const parts: string[] = [];
  const defs: string[] = [];
  const top = t.top + 26;
  const c: Ctx = { parts, placer: new Placer({ x0: 3, y0: t.top, x1: W - 3, y1: 1000 }), notes };
  let bottom = top;

  if (m.poly) {
    const f = fit(m.poly.drawPts, { x0: 50, y0: top, x1: W - 50, y1: top + 210 });
    if (f.k * Math.min(...m.poly.drawPts.map((q, i) => dist(q, m.poly!.drawPts[(i + 1) % m.poly!.drawPts.length]))) < 26) notes.push({ code: 'crowded', message: 'the shortest side is drawn under 26 units long — its label and marks crowd the vertices' });
    drawPoly(c, m.poly, m.poly.drawPts.map(f.T));
    bottom = top + f.h;
  } else if (m.similar) {
    const a = m.similar.first.pts;
    const b = rot(m.similar.second.pts, m.similar.rotate);
    const wOf = (q: Pt[]) => Math.max(...q.map((x) => x[0])) - Math.min(...q.map((x) => x[0]));
    const hOf = (q: Pt[]) => Math.max(...q.map((x) => x[1])) - Math.min(...q.map((x) => x[1]));
    const gap = 62;
    const k = Math.min((W - 60 - gap) / (wOf(a) + wOf(b)), 190 / Math.max(hOf(a), hOf(b)));
    if (k * Math.min(wOf(a), hOf(a), wOf(b), hOf(b)) < 30) notes.push({ code: 'crowded', message: 'one of the two triangles is drawn under 30 units across — choose a scale nearer 1' });
    const x0 = (W - (wOf(a) + wOf(b)) * k - gap) / 2;
    const H = Math.max(hOf(a), hOf(b)) * k;
    const place = (q: Pt[], left: number): Pt[] => {
      const minX = Math.min(...q.map((x) => x[0]));
      const minY = Math.min(...q.map((x) => x[1]));
      return q.map(([x, y]) => [left + (x - minX) * k, top + H - (y - minY) * k]);
    };
    drawPoly(c, m.similar.first, place(a, x0));
    drawPoly(c, m.similar.second, place(b, x0 + wOf(a) * k + gap));
    bottom = top + H;
  } else if (m.parallel) {
    const pl = m.parallel;
    const y1 = top + 34;
    const y2 = y1 + 92;
    const th = deg(pl.angle);
    const xm = W / 2;
    const dxHalf = (y2 - y1) / 2 / Math.tan(th);
    const X1 = xm + dxHalf;
    const X2 = xm - dxHalf;
    const ext = 46 / Math.sin(th);
    const tx0: Pt = [X2 - Math.cos(th) * ext, y2 + Math.sin(th) * ext];
    const tx1: Pt = [X1 + Math.cos(th) * ext, y1 - Math.sin(th) * ext];
    const lineL = Math.max(14, Math.min(X1, X2, tx0[0], tx1[0]) - 30);
    const lineR = Math.min(W - 26, Math.max(X1, X2, tx0[0], tx1[0]) + 30);
    for (const [y, name] of [[y1, pl.lineNames?.[0]], [y2, pl.lineNames?.[1]]] as Array<[number, string | undefined]>) {
      parts.push(`<path d="M${n2(lineL)},${n2(y)}H${n2(lineR)}" ${stroke(INK, 1.8)}/>`);
      // The parallel mark: one chevron on each line.
      const ax = lineR - 22;
      parts.push(`<path d="M${n2(ax - 6)},${n2(y - 5)}L${n2(ax)},${n2(y)}L${n2(ax - 6)},${n2(y + 5)}" ${stroke(INK, 1.5)}/>`);
      c.placer.block(...segmentBoxes(lineL, y, lineR, y, 2));
      if (name) parts.push(text(lineR + 5, y + 4, name, { fs: 12, italic: true, weight: 600 }));
    }
    parts.push(`<path d="${polyPath([tx0, tx1])}" ${stroke(INK, 1.8)}/>`);
    c.placer.block(...segmentBoxes(tx0[0], tx0[1], tx1[0], tx1[1], 2));
    if (pl.lineNames) put(c, tx1[0], tx1[1], pl.lineNames[2], Math.cos(th), -Math.sin(th), [7, 11], { weight: 600, italic: true });
    for (const [key, s] of Object.entries(pl.labels)) {
      const k = Number(key);
      const [vx, vy] = k <= 4 ? [X1, y1] : [X2, y2];
      const pos = ((k - 1) % 4) + 1;
      // The two rays bounding the sector, as canvas points.
      const up: Pt = [vx + Math.cos(th) * 30, vy - Math.sin(th) * 30];
      const dn: Pt = [vx - Math.cos(th) * 30, vy + Math.sin(th) * 30];
      const lf: Pt = [vx - 30, vy];
      const rt: Pt = [vx + 30, vy];
      const [a, b] = pos === 1 ? [lf, up] : pos === 2 ? [up, rt] : pos === 3 ? [dn, lf] : [rt, dn];
      angleMark(c, [vx, vy], a, b, s, false, 14);
    }
    bottom = tx0[1];
    if (Object.values(pl.labels).every((s) => s === '?' || !/\d/.test(s))) notes.push({ code: 'ambiguous_blank', message: 'labels: no angle carries a number — nothing fixes the unknown angle' });
  } else if (m.circle) {
    const cm = m.circle;
    const xy = (q: CirclePoint): Pt => [cm.radius * Math.cos(deg(q.at)), cm.radius * Math.sin(deg(q.at))];
    const ext: Pt[] = [[-cm.radius, -cm.radius], [cm.radius, cm.radius]];
    let tanEnds: [Pt, Pt] | undefined;
    if (cm.tangent) {
      const p0 = xy(cm.tangent.at);
      const d: Pt = [-Math.sin(deg(cm.tangent.at.at)), Math.cos(deg(cm.tangent.at.at))];
      const L = cm.tangent.length ?? cm.radius * 0.95;
      // To an external point: one way only (clockwise side), and the line from the centre to that point is drawn.
      tanEnds = cm.tangent.length !== undefined ? [p0, [p0[0] - d[0] * L, p0[1] - d[1] * L]] : [[p0[0] + d[0] * L, p0[1] + d[1] * L], [p0[0] - d[0] * L, p0[1] - d[1] * L]];
      ext.push(...tanEnds);
    }
    const f = fit(ext, { x0: 40, y0: top, x1: W - 40, y1: top + 230 }, 96 / cm.radius);
    const O = f.T([0, 0]);
    const R = cm.radius * f.k;
    const C = (q: CirclePoint): Pt => f.T(xy(q));
    if (cm.sector) {
      const a = C(cm.sector.from);
      const b = C(cm.sector.to);
      const shape = `<path d="M${n2(O[0])},${n2(O[1])}L${n2(a[0])},${n2(a[1])}A${n2(R)},${n2(R)} 0 ${cm.sector.degrees > 180 ? 1 : 0} 0 ${n2(b[0])},${n2(b[1])}z"`;
      const h = hatched(`${uid}-sec`, shape, { x0: O[0] - R, y0: O[1] - R, x1: O[0] + R, y1: O[1] + R }, '/', '#64748b', { gap: 6 });
      defs.push(h.def);
      parts.push(h.svg, `<path d="${polyPath([a, O, b])}" ${stroke(INK, 1.6)}/>`);
      c.placer.block(...segmentBoxes(O[0], O[1], a[0], a[1], 2), ...segmentBoxes(O[0], O[1], b[0], b[1], 2));
    }
    parts.push(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${n2(R)}" ${stroke(INK, 1.9)}/>`);
    for (let a = 0; a < 360; a += 6) c.placer.block({ x0: O[0] + R * Math.cos(deg(a)) - 2, y0: O[1] - R * Math.sin(deg(a)) - 2, x1: O[0] + R * Math.cos(deg(a)) + 2, y1: O[1] - R * Math.sin(deg(a)) + 2 });
    const line = (a: Pt, b: Pt, dash?: string) => {
      parts.push(`<path d="${polyPath([a, b])}" ${stroke(INK, 1.6, dash)}/>`);
      c.placer.block(...segmentBoxes(a[0], a[1], b[0], b[1], 2));
    };
    const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const sideLabel = (a: Pt, b: Pt, s: GeoLabel, away: Pt) => {
      if (s === null) return;
      const q = mid(a, b);
      const L = dist(a, b);
      let nx = -(b[1] - a[1]) / L;
      let ny = (b[0] - a[0]) / L;
      if ((q[0] - away[0]) * nx + (q[1] - away[1]) * ny < 0) { nx = -nx; ny = -ny; }
      put(c, q[0], q[1], s, nx, ny, [9, 13, 18]);
    };
    cm.radii.forEach((x) => line(O, C(x.to)));
    cm.chords.forEach((x) => line(C(x.from), C(x.to)));
    if (cm.arc) {
      const a = C(cm.arc.from);
      const b = C(cm.arc.to);
      parts.push(`<path d="M${n2(a[0])},${n2(a[1])}A${n2(R)},${n2(R)} 0 ${cm.arc.degrees > 180 ? 1 : 0} 0 ${n2(b[0])},${n2(b[1])}" ${stroke(INK, 4)}/>`);
    }
    if (cm.tangent && tanEnds) {
      const [e0, e1] = [f.T(tanEnds[0]), f.T(tanEnds[1])];
      line(e0, e1);
      const T = C(cm.tangent.at);
      if (cm.radii.some((x) => x.to === cm.tangent!.at)) angleMark(c, T, O, e1, null, true);
      if (cm.tangent.length !== undefined) {
        line(O, e1, '5 3');
        parts.push(`<circle cx="${n2(e1[0])}" cy="${n2(e1[1])}" r="2.8" fill="${INK}"/>`);
        if (cm.tangent.end) put(c, e1[0], e1[1], cm.tangent.end, e1[0] - O[0], e1[1] - O[1], [8, 12], { weight: 600, italic: true });
      }
      sideLabel(T, e1, cm.tangent.label, O);
    }
    cm.angles.forEach((x) => {
      const v = x.vertex === 'center' ? O : C(x.vertex);
      angleMark(c, v, C(x.from), C(x.to), x.label, false, x.vertex === 'center' ? 15 : 19);
    });
    // Labels of radii lie beside the radius, of chords on the side away from the centre.
    cm.radii.forEach((x) => { const e = C(x.to); sideLabel(O, e, x.label, [O[0] + (e[1] - O[1]), O[1] - (e[0] - O[0])]); });
    cm.chords.forEach((x) => { const a = C(x.from); const b = C(x.to); const q = mid(a, b); sideLabel(a, b, x.label, dist(q, O) < 2 ? [O[0], O[1] + 10] : O); });
    parts.push(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="2.6" fill="${INK}"/>`);
    for (const q of cm.points) {
      const e = C(q);
      parts.push(`<circle cx="${n2(e[0])}" cy="${n2(e[1])}" r="2.8" fill="${INK}"/>`);
      put(c, e[0], e[1], q.name, Math.cos(deg(q.at)), -Math.sin(deg(q.at)), [8, 12, 17], { weight: 600, italic: true });
    }
    if (cm.arc && cm.arc.label !== null) {
      const midA = deg(cm.arc.from.at + cm.arc.degrees / 2);
      put(c, O[0] + (R + 4) * Math.cos(midA), O[1] - (R + 4) * Math.sin(midA), cm.arc.label, Math.cos(midA), -Math.sin(midA), [8, 12, 18]);
    }
    if (cm.center) put(c, O[0], O[1], cm.center, -0.6, 0.8, [8, 12, 17], { weight: 600, italic: true });
    bottom = Math.max(O[1] + R, ...(tanEnds ? tanEnds.map((q) => f.T(q)[1]) : []));
  }
  let H = bottom + 26;
  if (m.notToScale) {
    parts.push(text(W - 8, H + 4, 'not to scale', { anchor: 'end', fill: MUTED, italic: true }));
    H += 14;
  }
  return { body: (defs.length ? `<defs>${defs.join('')}</defs>` : '') + t.svg + parts.join(''), H, facts: facts(notes) };
}
