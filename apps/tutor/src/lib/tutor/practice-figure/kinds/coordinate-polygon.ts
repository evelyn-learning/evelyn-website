/**
 * coordinate_polygon — up to three polygons (a pre-image and its images) with
 * labelled vertices on a numbered coordinate grid with square cells: the
 * figure of a transformations item (translate, reflect, rotate, dilate,
 * compose; congruence; symmetry).
 *
 * { xRange: [min, max]; yRange: [min, max];
 *   xStep?: number; yStep?: number;   // ONE step for both (square cells); default 1 up to a span of 24
 *   xLabel?: string ('x'); yLabel?: string ('y'); title?: string;
 *   polygons: 1–3 of {
 *     vertices: [[x, y], …] 2–8          // 2 = a segment; a simple polygon, not all on one line
 *     labels?: string[]                  // one per vertex, ≤ 3 characters ("P", "P′", "P″"; ' and '' become ′ and ″)
 *     name?: string                      // a caption ≤ 20 characters ("Figure 1", "image") — shown in a legend
 *     style?: 'solid' | 'dashed'         // the outline; several polygons always get distinct patterns
 *     shade?: boolean                    // a pale fill drawn UNDER the grid (the squares stay countable)
 *   };
 *   lines?: 0–2 of { kind: 'vertical', x } | { kind: 'horizontal', y }
 *                | { kind: 'through', points: [[x1, y1], [x2, y2]] }, each with label? ≤ 12 ("y = x", "ℓ");
 *   points?: 0–3 of { x, y, label }      // a centre of rotation or dilation (label ≤ 3)
 *   arrows?: 0–2 of { from: [x, y], to: [x, y], label?: string ≤ 6 }   // a translation vector
 *   showVertexCoordinates?: boolean (false) // print "(x, y)" beside every vertex label }
 *
 * Every label (vertex or point) is used once. Polygon i is drawn in series
 * colour i AND its own stroke pattern; captions sit in a legend that repeats
 * the pattern, so colour is never the only cue. Vertex labels are haloed,
 * set outside the polygon where possible and kept clear of every edge, line,
 * dot and other label (a label that cannot be set clear is a
 * `labels_overlap` note). A vertex that is on no numbered gridline is an
 * `off_grid` note unless its coordinates are printed.
 *
 * The model (`polygonModel`) is shared with the checkers
 * (scripts/practice-extend/figure-core-batch6-polygon.ts) through `modelOf`,
 * and the transformation helpers below (`parseTransform`, `applyTransform`,
 * `applySequence`, `identifyTransforms`, `transformName`) are what an
 * authoring script uses to build an image and word its key.
 */
import { GUIDE_COLOR, GUIDE_DASH, GUIDE_MASK_WIDTH, GUIDE_WIDTH, INK, SERIES_COLORS, assignDashes, buildFrame, buildLegend, dashAttr, esc, estWidth, gridPlace, n2, niceStep } from '../plot-frame';
import { HALO, type Drawn, type FigureFacts, type Params, type Reader } from '../spec';

export type Pt = [number, number];

// ── transformations ────────────────────────────────────────────────────────

/** A transformation of the plane, normalised. Rotations are counterclockwise. */
export type Transform =
  | { kind: 'translate'; dx: number; dy: number }
  /** v: x = c; h: y = c; up: y = x + c; down: y = −x + c. */
  | { kind: 'reflect'; line: 'v' | 'h' | 'up' | 'down'; c: number }
  | { kind: 'rotate'; deg: 90 | 180 | 270; cx: number; cy: number }
  | { kind: 'dilate'; k: number; cx: number; cy: number };

const clean = (v: number): number => { const r = Number(v.toPrecision(12)); return Object.is(r, -0) ? 0 : r; };
const isFin = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const NUM = '(-?\\d+(?:\\.\\d+)?)';

function ptOf(v: unknown, name: string): Pt {
  if (!Array.isArray(v) || v.length !== 2 || !isFin(v[0]) || !isFin(v[1])) throw new Error(`${name} must be [x, y] (two finite numbers)`);
  return [v[0], v[1]];
}

/**
 * A transformation as an item or a derivation states it:
 *   { translate: [a, b] }
 *   { reflect: 'x-axis' | 'y-axis' | 'y = x' | 'y = −x' | 'x = a' | 'y = b' | 'y = x + c' | 'y = −x + c' }
 *   { rotate: 90 | 180 | 270 | −90 …, direction?: 'ccw' | 'cw' (default ccw — positive is counterclockwise), about?: [x, y] (default the origin) }
 *   { dilate: k (not 0), about?: [x, y] (default the origin) }
 * Throws an Error naming `name` when it is none of these.
 */
export function parseTransform(v: unknown, name: string): Transform {
  const shapes = '{ translate: [a, b] } | { reflect: "x-axis" | "y-axis" | "y = x" | "y = −x" | "x = a" | "y = b" | "y = x + c" | "y = −x + c" } | { rotate: 90 | 180 | 270 | −90, direction?: "ccw" | "cw", about?: [x, y] } | { dilate: k, about?: [x, y] }';
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(`${name} must be one of ${shapes}`);
  const o = v as Params;
  const about = (): Pt => (o.about === undefined ? [0, 0] : ptOf(o.about, `${name}.about`));
  if (o.translate !== undefined) {
    const [dx, dy] = ptOf(o.translate, `${name}.translate`);
    return { kind: 'translate', dx, dy };
  }
  if (o.reflect !== undefined) {
    const s = typeof o.reflect === 'string' ? o.reflect.replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase() : '';
    if (s === 'x-axis' || s === 'xaxis') return { kind: 'reflect', line: 'h', c: 0 };
    if (s === 'y-axis' || s === 'yaxis') return { kind: 'reflect', line: 'v', c: 0 };
    let m = new RegExp(`^x=${NUM}$`).exec(s);
    if (m) return { kind: 'reflect', line: 'v', c: Number(m[1]) };
    m = new RegExp(`^y=${NUM}$`).exec(s);
    if (m) return { kind: 'reflect', line: 'h', c: Number(m[1]) };
    m = /^y=(-?)x(?:([+-])(\d+(?:\.\d+)?))?$/.exec(s);
    if (m) return { kind: 'reflect', line: m[1] ? 'down' : 'up', c: m[3] ? (m[2] === '-' ? -1 : 1) * Number(m[3]) : 0 };
    throw new Error(`${name}.reflect must name a line: "x-axis", "y-axis", "y = x", "y = −x", "x = a", "y = b", "y = x + c" or "y = −x + c"`);
  }
  if (o.rotate !== undefined) {
    if (!isFin(o.rotate) || o.rotate % 90 !== 0) throw new Error(`${name}.rotate must be a multiple of 90 (90, 180, 270 or −90) degrees`);
    if (o.direction !== undefined && o.direction !== 'ccw' && o.direction !== 'cw') throw new Error(`${name}.direction must be "ccw" or "cw"`);
    const signed = o.direction === 'cw' ? -o.rotate : o.rotate;
    const deg = ((signed % 360) + 360) % 360;
    if (deg === 0) throw new Error(`${name}.rotate is a whole number of turns — it moves nothing`);
    const [cx, cy] = about();
    return { kind: 'rotate', deg: deg as 90 | 180 | 270, cx, cy };
  }
  if (o.dilate !== undefined) {
    if (!isFin(o.dilate) || o.dilate === 0) throw new Error(`${name}.dilate must be a scale factor (a number, not 0)`);
    const [cx, cy] = about();
    return { kind: 'dilate', k: o.dilate, cx, cy };
  }
  throw new Error(`${name} must be one of ${shapes}`);
}

export function applyTransform(t: Transform, [x, y]: Pt): Pt {
  let out: Pt;
  switch (t.kind) {
    case 'translate': out = [x + t.dx, y + t.dy]; break;
    case 'reflect':
      out = t.line === 'v' ? [2 * t.c - x, y] : t.line === 'h' ? [x, 2 * t.c - y] : t.line === 'up' ? [y - t.c, x + t.c] : [t.c - y, t.c - x];
      break;
    case 'rotate': {
      const u = x - t.cx;
      const w = y - t.cy;
      const [a, b] = t.deg === 90 ? [-w, u] : t.deg === 180 ? [-u, -w] : [w, -u];
      out = [t.cx + a, t.cy + b];
      break;
    }
    case 'dilate': out = [t.cx + t.k * (x - t.cx), t.cy + t.k * (y - t.cy)]; break;
  }
  return [clean(out[0]), clean(out[1])];
}

export const applySequence = (ts: readonly Transform[], p: Pt): Pt => ts.reduce<Pt>((q, t) => applyTransform(t, q), p);

const close = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const samePt = (a: Pt, b: Pt): boolean => close(a[0], b[0]) && close(a[1], b[1]);
const PROBES: Pt[] = [[0, 0], [1, 0], [0, 1]];
/** Do two transformations (or sequences) move the plane the same way? */
export const sameMap = (a: readonly Transform[], b: readonly Transform[]): boolean => PROBES.every((p) => samePt(applySequence(a, p), applySequence(b, p)));

/** Does the sequence carry each vertex of `from` onto the vertex of `to` at the same place in the list? */
export const mapsOnto = (ts: readonly Transform[], from: readonly Pt[], to: readonly Pt[]): boolean =>
  from.length === to.length && from.every((p, i) => samePt(applySequence(ts, p), to[i]));

/**
 * Every single transformation of the four families that carries `from` onto
 * `to` vertex by vertex (in list order): a translation; a reflection across a
 * vertical or horizontal line or a line of slope ±1; a rotation of 90°, 180°
 * or 270° about any point; a dilation with k > 0, k ≠ 1 about any point. One
 * entry per distinct map. [] when none fits (or the lists differ in length).
 */
export function identifyTransforms(from: readonly Pt[], to: readonly Pt[]): Transform[] {
  if (from.length !== to.length || from.length === 0) return [];
  const [p, q] = [from[0], to[0]];
  const cands: Transform[] = [
    { kind: 'translate', dx: clean(q[0] - p[0]), dy: clean(q[1] - p[1]) },
    { kind: 'reflect', line: 'v', c: clean((p[0] + q[0]) / 2) },
    { kind: 'reflect', line: 'h', c: clean((p[1] + q[1]) / 2) },
    { kind: 'reflect', line: 'up', c: clean(p[1] - q[0]) },
    { kind: 'reflect', line: 'down', c: clean(q[0] + p[1]) },
  ];
  for (const deg of [90, 180, 270] as const) {
    // q = c + R(p − c)  ⇔  (I − R) c = q − R p.
    const R = deg === 90 ? [0, -1, 1, 0] : deg === 180 ? [-1, 0, 0, -1] : [0, 1, -1, 0];
    const rhs = [q[0] - (R[0] * p[0] + R[1] * p[1]), q[1] - (R[2] * p[0] + R[3] * p[1])];
    const [a, b, c, d] = [1 - R[0], -R[1], -R[2], 1 - R[3]];
    const det = a * d - b * c;
    cands.push({ kind: 'rotate', deg, cx: clean((d * rhs[0] - b * rhs[1]) / det), cy: clean((a * rhs[1] - c * rhs[0]) / det) });
  }
  if (from.length >= 2) {
    const [p1, q1] = [from[1], to[1]];
    const d0 = Math.hypot(p1[0] - p[0], p1[1] - p[1]);
    const k = Math.hypot(q1[0] - q[0], q1[1] - q[1]) / d0;
    if (d0 > 0 && k > 0 && !close(k, 1)) cands.push({ kind: 'dilate', k: clean(k), cx: clean((q[0] - k * p[0]) / (1 - k)), cy: clean((q[1] - k * p[1]) / (1 - k)) });
  }
  const out: Transform[] = [];
  for (const t of cands) if (mapsOnto([t], from, to) && !out.some((o) => sameMap([o], [t]))) out.push(t);
  return out;
}

/** A number as a key writes it: at most 10 significant digits, a real minus sign. */
export const numText = (v: number): string => String(clean(Number(v.toPrecision(10)))).replace(/^-/, '−');
/** A scale factor: a fraction when it is one with a denominator up to 12 ("1/2", "3/2"), else a decimal. */
export function factorText(k: number): string {
  for (let den = 1; den <= 12; den++) {
    const n = k * den;
    if (Math.abs(n - Math.round(n)) < 1e-9) return den === 1 ? numText(Math.round(n)) : `${Math.round(n) < 0 ? '−' : ''}${Math.abs(Math.round(n))}/${den}`;
  }
  return numText(k);
}
export const ptText = ([x, y]: Pt): string => `(${numText(x)}, ${numText(y)})`;

/** a·x + b·y + e as a rule writes one coordinate: "x + 3", "2 − y", "−y", "(1/2)x". */
function linText(a: number, b: number, e: number): string {
  const terms: Array<{ k: number; v: string }> = [];
  if (!close(a, 0)) terms.push({ k: a, v: 'x' });
  if (!close(b, 0)) terms.push({ k: b, v: 'y' });
  const mag = (k: number, v: string): string => { const m = Math.abs(k); return close(m, 1) ? v : Number.isInteger(clean(m)) ? `${numText(m)}${v}` : `(${factorText(m)})${v}`; };
  if (terms.length === 0) return numText(e);
  const [first, ...rest] = terms;
  const tail = rest.map((t) => ` ${t.k < 0 ? '−' : '+'} ${mag(t.k, t.v)}`).join('');
  if (first.k < 0 && !close(e, 0) && rest.length === 0) return `${numText(e)} − ${mag(first.k, first.v)}`;
  const head = `${first.k < 0 ? '−' : ''}${mag(first.k, first.v)}${tail}`;
  return close(e, 0) ? head : `${head} ${e < 0 ? '−' : '+'} ${numText(Math.abs(e))}`;
}

function lineText(t: Extract<Transform, { kind: 'reflect' }>): string {
  if (t.c === 0 && t.line === 'v') return 'the y-axis';
  if (t.c === 0 && t.line === 'h') return 'the x-axis';
  if (t.line === 'v') return `the line x = ${numText(t.c)}`;
  if (t.line === 'h') return `the line y = ${numText(t.c)}`;
  const c = t.c === 0 ? '' : ` ${t.c < 0 ? '−' : '+'} ${numText(Math.abs(t.c))}`;
  return `the line y = ${t.line === 'down' ? '−' : ''}x${c}`;
}

/**
 * A transformation in words, as a key states it:
 *   name: "translation by (6, −4)", "reflection across the line y = x", "reflection across the x-axis",
 *         "rotation 90° counterclockwise about (0, 0)", "rotation 180° about (1, 2)", "rotation 90° clockwise about (0, 0)",
 *         "dilation by scale factor 1/2 about (0, 0)";
 *   rule: "(x, y) → (x + 6, y − 4)", "(x, y) → (−y, x)", "(x, y) → (x, 2 − y)";
 *   type: "translation" | "reflection" | "rotation" | "dilation".
 */
export function transformName(t: Transform, form: 'name' | 'rule' | 'type' = 'name'): string {
  if (form === 'type') return { translate: 'translation', reflect: 'reflection', rotate: 'rotation', dilate: 'dilation' }[t.kind];
  if (form === 'rule') {
    const [e, f] = applyTransform(t, [0, 0]);
    const [ax, cx] = applyTransform(t, [1, 0]);
    const [bx, dx] = applyTransform(t, [0, 1]);
    return `(x, y) → (${linText(ax - e, bx - e, e)}, ${linText(cx - f, dx - f, f)})`;
  }
  switch (t.kind) {
    case 'translate': return `translation by ${ptText([t.dx, t.dy])}`;
    case 'reflect': return `reflection across ${lineText(t)}`;
    case 'rotate': return `rotation ${t.deg === 180 ? '180°' : `90° ${t.deg === 90 ? 'counterclockwise' : 'clockwise'}`} about ${ptText([t.cx, t.cy])}`;
    case 'dilate': return `dilation by scale factor ${factorText(t.k)} about ${ptText([t.cx, t.cy])}`;
  }
}
/** A sequence in words: "reflection across the x-axis, then translation by (2, 0)". */
export const sequenceName = (ts: readonly Transform[], form: 'name' | 'rule' = 'name'): string => ts.map((t) => transformName(t, form)).join(', then ');

// ── the model ──────────────────────────────────────────────────────────────

export interface PolygonM {
  vertices: Pt[];
  labels: string[] | null;
  name?: string;
  style: 'solid' | 'dashed';
  shade: boolean;
}
export interface LineM {
  kind: 'vertical' | 'horizontal' | 'through';
  /** Two points the line passes through. */
  p1: Pt;
  p2: Pt;
  /** The part of it inside the grid. */
  ends: [Pt, Pt];
  label?: string;
}
export interface PolygonModel {
  xRange: [number, number];
  yRange: [number, number];
  /** The numbered gridline spacing of both axes. */
  step: number;
  xLabel: string;
  yLabel: string;
  title?: string;
  polygons: PolygonM[];
  lines: LineM[];
  points: Array<{ x: number; y: number; label: string }>;
  arrows: Array<{ from: Pt; to: Pt; label?: string }>;
  showVertexCoordinates: boolean;
}

const normLabel = (s: string): string => s.replace(/''/g, '″').replace(/'/g, '′');

/** Does segment ab meet segment cd (touching counts)? */
function segmentsMeet(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const o = (p: Pt, q: Pt, r: Pt): number => { const v = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return Math.abs(v) < 1e-12 ? 0 : Math.sign(v); };
  const on = (p: Pt, q: Pt, r: Pt): boolean => Math.min(p[0], q[0]) - 1e-12 <= r[0] && r[0] <= Math.max(p[0], q[0]) + 1e-12 && Math.min(p[1], q[1]) - 1e-12 <= r[1] && r[1] <= Math.max(p[1], q[1]) + 1e-12;
  const [o1, o2, o3, o4] = [o(a, b, c), o(a, b, d), o(c, d, a), o(c, d, b)];
  if (o1 !== o2 && o3 !== o4) return true;
  return (o1 === 0 && on(a, b, c)) || (o2 === 0 && on(a, b, d)) || (o3 === 0 && on(c, d, a)) || (o4 === 0 && on(c, d, b));
}

/** The part of the line through p1, p2 inside the box (Liang–Barsky), or null. */
function clipLine(p1: Pt, p2: Pt, xr: [number, number], yr: [number, number]): [Pt, Pt] | null {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  let t0 = -Infinity;
  let t1 = Infinity;
  for (const [p, q] of [[-dx, p1[0] - xr[0]], [dx, xr[1] - p1[0]], [-dy, p1[1] - yr[0]], [dy, yr[1] - p1[1]]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return null; continue; }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
  }
  if (!(t1 - t0 > 1e-9)) return null;
  return [[p1[0] + t0 * dx, p1[1] + t0 * dy], [p1[0] + t1 * dx, p1[1] + t1 * dy]];
}

export function polygonModel(r: Reader): PolygonModel {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const xSpan = xRange[1] - xRange[0];
  const ySpan = yRange[1] - yRange[0];
  const ratio = ySpan / xSpan;
  if (ratio < 0.5) r.fail(`yRange is too flat against xRange for square cells (height ÷ width ${ratio.toFixed(2)}; at least 0.5) — widen yRange`);
  if (ratio > 1.3) r.fail(`xRange is too narrow against yRange for square cells (height ÷ width ${ratio.toFixed(2)}; at most 1.3) — widen xRange`);
  const xs = r.optStep(p.xStep, 'xStep');
  const ys = r.optStep(p.yStep, 'yStep');
  if (xs !== undefined && ys !== undefined && xs !== ys) r.fail('xStep and yStep must be equal (the cells are squares)');
  const span = Math.max(xSpan, ySpan);
  const step = xs ?? ys ?? (span <= 24 ? 1 : niceStep(span, 10));
  const fmtPt = (q: Pt): string => `(${q[0]}, ${q[1]})`;
  const inside = (q: Pt, name: string): void => {
    if (q[0] < xRange[0] || q[0] > xRange[1] || q[1] < yRange[0] || q[1] > yRange[1]) r.fail(`${name} ${fmtPt(q)} is outside the grid (x ${xRange[0]} to ${xRange[1]}, y ${yRange[0]} to ${yRange[1]})`);
  };
  const point = (v: unknown, name: string): Pt => {
    try { return ptOf(v, name); } catch (e) { return r.fail((e as Error).message); }
  };
  const used = new Set<string>();
  const useLabel = (l: string): void => {
    if (used.has(l)) r.fail(`the label "${l}" is used twice — every vertex and point label names one place`);
    used.add(l);
  };
  const label = (v: unknown, name: string, max = 3): string => {
    if (typeof v === 'string') v = normLabel(v.trim());
    return r.str(v, name, max);
  };

  const names = new Set<string>();
  const polygons: PolygonM[] = r.list(p.polygons, 'polygons', 1, 3).map((raw, j) => {
    const at = `polygons[${j}]`;
    const o = r.obj(raw, at);
    const vertices = r.list(o.vertices, `${at}.vertices`, 2, 8).map((v, i) => point(v, `${at}.vertices[${i}]`));
    vertices.forEach((q, i) => {
      inside(q, `${at}.vertices[${i}]`);
      const k = vertices.findIndex((w) => samePt(w, q));
      if (k < i) r.fail(`${at}.vertices[${i}] repeats vertices[${k}] ${fmtPt(q)}`);
    });
    if (vertices.length >= 3) {
      const [a, b] = vertices;
      if (vertices.every((c) => Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) < 1e-12)) r.fail(`${at}: the vertices are all on one line`);
      const n = vertices.length;
      for (let i = 0; i < n; i++) {
        for (let k = i + 1; k < n; k++) {
          if (k === i + 1 || (i === 0 && k === n - 1)) continue;
          if (segmentsMeet(vertices[i], vertices[(i + 1) % n], vertices[k], vertices[(k + 1) % n])) r.fail(`${at} crosses itself (side ${i} meets side ${k}) — list the vertices in order around the polygon`);
        }
      }
    }
    let labels: string[] | null = null;
    if (o.labels !== undefined && o.labels !== null) {
      if (!Array.isArray(o.labels) || o.labels.length !== vertices.length) r.fail(`${at}.labels must have one label per vertex (${vertices.length})`);
      labels = (o.labels as unknown[]).map((l, i) => label(l, `${at}.labels[${i}]`));
      labels.forEach(useLabel);
    }
    const name = r.optStr(o.name, `${at}.name`, 20);
    if (name) {
      if (names.has(name)) r.fail(`${at}.name "${name}" is used twice`);
      names.add(name);
    }
    const style = o.style === undefined || o.style === null ? 'solid' : o.style;
    if (style !== 'solid' && style !== 'dashed') r.fail(`${at}.style must be solid or dashed`);
    return { vertices, labels, ...(name ? { name } : {}), style: style as 'solid' | 'dashed', shade: r.bool(o.shade, `${at}.shade`, false) };
  });

  const lines: LineM[] = (p.lines === undefined || p.lines === null ? [] : r.list(p.lines, 'lines', 0, 2)).map((raw, k) => {
    const at = `lines[${k}]`;
    const o = r.obj(raw, at);
    let p1: Pt;
    let p2: Pt;
    if (o.kind === 'vertical') { const x = r.num(o.x, `${at}.x`); p1 = [x, 0]; p2 = [x, 1]; }
    else if (o.kind === 'horizontal') { const y = r.num(o.y, `${at}.y`); p1 = [0, y]; p2 = [1, y]; }
    else if (o.kind === 'through') {
      const pts = r.list(o.points, `${at}.points`, 2, 2);
      p1 = point(pts[0], `${at}.points[0]`);
      p2 = point(pts[1], `${at}.points[1]`);
      if (samePt(p1, p2)) r.fail(`${at}.points are the same point`);
    } else return r.fail(`${at}.kind must be vertical, horizontal or through`);
    const ends = clipLine(p1, p2, xRange, yRange);
    if (!ends) return r.fail(`${at} does not cross the grid`);
    const l = o.label === undefined || o.label === null || o.label === '' ? undefined : label(o.label, `${at}.label`, 12);
    return { kind: o.kind as LineM['kind'], p1, p2, ends, ...(l ? { label: l } : {}) };
  });

  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 3)).map((raw, k) => {
    const at = `points[${k}]`;
    const o = r.obj(raw, at);
    const q: Pt = [r.num(o.x, `${at}.x`), r.num(o.y, `${at}.y`)];
    inside(q, at);
    const l = label(o.label, `${at}.label`);
    useLabel(l);
    return { x: q[0], y: q[1], label: l };
  });

  const arrows = (p.arrows === undefined || p.arrows === null ? [] : r.list(p.arrows, 'arrows', 0, 2)).map((raw, k) => {
    const at = `arrows[${k}]`;
    const o = r.obj(raw, at);
    const from = point(o.from, `${at}.from`);
    const to = point(o.to, `${at}.to`);
    inside(from, `${at}.from`);
    inside(to, `${at}.to`);
    if (samePt(from, to)) r.fail(`${at}: from and to are the same point`);
    const l = o.label === undefined || o.label === null || o.label === '' ? undefined : label(o.label, `${at}.label`, 6);
    return { from, to, ...(l ? { label: l } : {}) };
  });

  return {
    xRange, yRange, step,
    xLabel: r.optStr(p.xLabel, 'xLabel', 12) ?? 'x',
    yLabel: r.optStr(p.yLabel, 'yLabel', 12) ?? 'y',
    ...(r.optStr(p.title, 'title', 160) ? { title: r.optStr(p.title, 'title', 160) } : {}),
    polygons, lines, points, arrows,
    showVertexCoordinates: r.bool(p.showVertexCoordinates, 'showVertexCoordinates', false),
  };
}

/** Is a value on a numbered gridline of the model's step (readable exactly)? */
export const onGrid = (m: PolygonModel, v: number): boolean => gridPlace(v, m.step) === 'major';

// ── drawing ────────────────────────────────────────────────────────────────

/** Pale fills, one per series colour (no opacity in the client vocabulary). */
const TINTS = ['#dde6fb', '#f9e3d6', '#d5ece9'];
const LABEL_FS = 12;
const COORD_FS = 11;

interface Box { x0: number; y0: number; x1: number; y1: number }
type Seg = [number, number, number, number];

const boxesMeet = (a: Box, b: Box, pad = 0): boolean => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
/** Does the segment cross the box (Liang–Barsky on the box)? */
function segHitsBox([x1, y1, x2, y2]: Seg, b: Box): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let t0 = 0;
  let t1 = 1;
  for (const [p, q] of [[-dx, x1 - b.x0], [dx, b.x1 - x1], [-dy, y1 - b.y0], [dy, b.y1 - y1]]) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 > t1) return false;
  }
  return true;
}
function insidePoly(q: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function renderCoordinatePolygon(r: Reader, _uid: string): Drawn {
  const m = polygonModel(r);
  const ratio = (m.yRange[1] - m.yRange[0]) / (m.xRange[1] - m.xRange[0]);
  const f = buildFrame({
    xRange: m.xRange, yRange: m.yRange, xStep: m.step, yStep: m.step,
    xLabel: m.xLabel, yLabel: m.yLabel, title: m.title,
    aspect: ratio, commonStep: true, minorGrid: false,
  });
  const C = (q: Pt): Pt => [f.X(q[0]), f.Y(q[1])];
  const notes: NonNullable<FigureFacts['notes']> = [];
  const marks: FigureFacts['marks'] = [];
  const dashes = assignDashes(m.polygons.map((g) => g.style === 'dashed'));
  const colorOf = (j: number): string => SERIES_COLORS[j % SERIES_COLORS.length];

  // Obstacles for the label placer, in canvas units.
  const segs: Seg[] = [];
  const dots: Box[] = [];
  const placed: Box[] = [];
  const fills: string[] = [];
  const strokes: string[] = [];
  const marksSvg: string[] = [];
  const labelSvg: string[] = [];

  m.polygons.forEach((g, j) => {
    const pts = g.vertices.map(C);
    const d = `M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}${pts.length >= 3 ? 'z' : ''}`;
    if (g.shade && pts.length >= 3) fills.push(`<path d="${d}" fill="${TINTS[j % TINTS.length]}" stroke="none"/>`);
    strokes.push(`<path d="${d}" fill="none" stroke="${colorOf(j)}" stroke-width="2.2"${dashAttr(dashes[j])} stroke-linejoin="round" stroke-linecap="round"/>`);
    for (let i = 0; i < pts.length - (pts.length >= 3 ? 0 : 1); i++) {
      const [a, b] = [pts[i], pts[(i + 1) % pts.length]];
      segs.push([a[0], a[1], b[0], b[1]]);
    }
    g.vertices.forEach((v, i) => {
      const [cx, cy] = pts[i];
      marks.push({ what: `polygons[${j}].vertices[${i}]${g.labels ? ` "${g.labels[i]}"` : ''}`, cx, cy });
      dots.push({ x0: cx - 3.4, y0: cy - 3.4, x1: cx + 3.4, y1: cy + 3.4 });
      marksSvg.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="3" fill="${colorOf(j)}" stroke="#ffffff" stroke-width="1"/>`);
      if (!m.showVertexCoordinates && (!onGrid(m, v[0]) || !onGrid(m, v[1]))) {
        notes.push({ code: 'off_grid', message: `polygons[${j}].vertices[${i}] (${v[0]}, ${v[1]}) is not on a numbered gridline — it can only be estimated; move it onto the grid or set showVertexCoordinates` });
      }
    });
  });

  const guides: string[] = [];
  m.lines.forEach((l) => {
    const [a, b] = l.ends.map(C);
    const dd = `M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}`;
    guides.push(`<path d="${dd}" fill="none" stroke="#ffffff" stroke-width="${GUIDE_MASK_WIDTH}"/><path d="${dd}" fill="none" stroke="${GUIDE_COLOR}" stroke-width="${GUIDE_WIDTH}" stroke-dasharray="${GUIDE_DASH}"/>`);
    segs.push([a[0], a[1], b[0], b[1]]);
  });
  m.arrows.forEach((ar) => {
    const [a, b] = [C(ar.from), C(ar.to)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [ux, uy] = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const head = 8;
    const [bx, by] = [b[0] - ux * head, b[1] - uy * head];
    guides.push(`<line x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(bx)}" y2="${n2(by)}" stroke="${INK}" stroke-width="1.6"/>`);
    guides.push(`<path d="M${n2(b[0])},${n2(b[1])}L${n2(bx - uy * 3.6)},${n2(by + ux * 3.6)}L${n2(bx + uy * 3.6)},${n2(by - ux * 3.6)}z" fill="${INK}"/>`);
    segs.push([a[0], a[1], b[0], b[1]]);
  });
  m.points.forEach((q, k) => {
    const [cx, cy] = C([q.x, q.y]);
    marks.push({ what: `points[${k}] "${q.label}"`, cx, cy });
    dots.push({ x0: cx - 3.6, y0: cy - 3.6, x1: cx + 3.6, y1: cy + 3.6 });
    marksSvg.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="3.2" fill="${INK}" stroke="#ffffff" stroke-width="1"/>`);
    if (!m.showVertexCoordinates && (!onGrid(m, q.x) || !onGrid(m, q.y))) notes.push({ code: 'off_grid', message: `points[${k}] (${q.x}, ${q.y}) is not on a numbered gridline — it can only be estimated` });
  });

  const plot = f.plot;
  /**
   * Set a label of width w (height h) near the anchor, trying directions round
   * from the preferred one (canvas units, y down), nearest first. Returns the
   * box's left edge and vertical centre.
   */
  const place = (w: number, h: number, ax: number, ay: number, ux: number, uy: number, what: string, ownDot: Box | null): Box => {
    const base = Math.atan2(uy, ux);
    const tries: Box[] = [];
    for (const extra of [0, 6, 13]) {
      for (const k of [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8]) {
        const th = base + (k * Math.PI) / 8;
        const [cx0, cy0] = [Math.cos(th), Math.sin(th)];
        const dist = 4.5 + Math.abs(cx0) * (w / 2) + Math.abs(cy0) * (h / 2) + extra;
        const cx = ax + cx0 * dist;
        const cy = ay + cy0 * dist;
        tries.push({ x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 });
      }
    }
    const hits = (b: Box): number => {
      if (b.x0 < plot.x + 1 || b.x1 > plot.x + plot.w - 1 || b.y0 < plot.y + 1 || b.y1 > plot.y + plot.h - 1) return 100;
      const inner = { x0: b.x0 + 0.5, y0: b.y0 + 0.5, x1: b.x1 - 0.5, y1: b.y1 - 0.5 };
      return placed.filter((o) => boxesMeet(o, b, 1)).length * 10
        + dots.filter((o) => o !== ownDot && boxesMeet(o, b)).length * 5
        + segs.filter((s) => segHitsBox(s, inner)).length;
    };
    let best = tries[0];
    let bestHits = Infinity;
    for (const b of tries) {
      const n = hits(b);
      if (n === 0) { best = b; bestHits = 0; break; }
      if (n < bestHits) { best = b; bestHits = n; }
    }
    if (bestHits >= 10) notes.push({ code: 'labels_overlap', message: `the label ${what} could not be set clear of the other labels or the plot border — spread the figure out or widen the ranges` });
    else if (bestHits > 0) notes.push({ code: 'crowded', message: `the label ${what} touches a side, a line or a dot — move the figure or widen the ranges` });
    placed.push(best);
    return best;
  };
  const textAt = (x: number, cy: number, anchor: string, fs: number, weight: string, color: string, t: string): string =>
    `<text x="${n2(x)}" y="${n2(cy + fs * 0.36)}" font-size="${fs}"${weight ? ` font-weight="${weight}"` : ''} text-anchor="${anchor}" fill="${color}" ${HALO}>${esc(t)}</text>`;

  // Vertex labels (and coordinates) first: they are what the questions name.
  m.polygons.forEach((g, j) => {
    const pts = g.vertices.map(C);
    const n = pts.length;
    pts.forEach((v, i) => {
      const lab = g.labels ? g.labels[i] : '';
      const coord = m.showVertexCoordinates ? ptText(g.vertices[i]) : '';
      if (!lab && !coord) return;
      let ux: number;
      let uy: number;
      if (n === 2) {
        const o = pts[1 - i];
        [ux, uy] = [v[0] - o[0], v[1] - o[1]];
      } else {
        const [pv, nx] = [pts[(i + n - 1) % n], pts[(i + 1) % n]];
        const e1 = [v[0] - pv[0], v[1] - pv[1]].map((c, _, a) => c / Math.hypot(a[0], a[1]));
        const e2 = [v[0] - nx[0], v[1] - nx[1]].map((c, _, a) => c / Math.hypot(a[0], a[1]));
        [ux, uy] = [e1[0] + e2[0], e1[1] + e2[1]];
        if (Math.hypot(ux, uy) < 1e-6) [ux, uy] = [-(nx[1] - pv[1]), nx[0] - pv[0]];
        const L = Math.hypot(ux, uy);
        [ux, uy] = [ux / L, uy / L];
        if (insidePoly([v[0] + ux * 2, v[1] + uy * 2], pts)) [ux, uy] = [-ux, -uy];
      }
      const wL = lab ? estWidth(lab, LABEL_FS) + 1 : 0;
      const wC = coord ? estWidth(coord, COORD_FS) * 0.92 : 0;
      const gap = lab && coord ? 2 : 0;
      const b = place(wL + gap + wC, 13, v[0], v[1], ux, uy, lab ? `"${lab}"` : `"${coord}"`, dots[marks.findIndex((mk) => mk.what.startsWith(`polygons[${j}].vertices[${i}]`))]);
      const cy = (b.y0 + b.y1) / 2;
      if (lab) labelSvg.push(textAt(b.x0 + wL, cy, 'end', LABEL_FS, '700', colorOf(j), lab));
      if (coord) labelSvg.push(textAt(b.x0 + wL + gap, cy, 'start', COORD_FS, '', INK, coord));
    });
  });
  m.points.forEach((q, k) => {
    const [cx, cy] = C([q.x, q.y]);
    const w = estWidth(q.label, LABEL_FS) + 1;
    const b = place(w, 13, cx, cy, 0.7, -0.7, `"${q.label}"`, dots[marks.findIndex((mk) => mk.what.startsWith(`points[${k}]`))]);
    labelSvg.push(textAt((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 'middle', LABEL_FS, '700', INK, q.label));
  });
  /** A label along a line or arrow: tried at several places along it, on both sides. */
  const alongLabel = (a: Pt, b: Pt, ts: number[], text: string): void => {
    const w = estWidth(text, LABEL_FS) + 1;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [nx, ny] = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const before = notes.length;
    let chosen: Box | null = null;
    for (const t of ts) {
      for (const s of [1, -1]) {
        const ax = a[0] + (b[0] - a[0]) * t;
        const ay = a[1] + (b[1] - a[1]) * t;
        const bx = place(w, 13, ax, ay, nx * s, ny * s, `"${text}"`, null);
        if (notes.length === before) { chosen = bx; break; }
        placed.pop();
        notes.length = before;
      }
      if (chosen) break;
    }
    if (!chosen) chosen = place(w, 13, a[0] + (b[0] - a[0]) * ts[0], a[1] + (b[1] - a[1]) * ts[0], nx, ny, `"${text}"`, null);
    labelSvg.push(textAt((chosen.x0 + chosen.x1) / 2, (chosen.y0 + chosen.y1) / 2, 'middle', LABEL_FS, '700', INK, text));
  };
  m.lines.forEach((l) => {
    if (!l.label) return;
    const [a, b] = l.ends.map(C);
    // Read from the upper end down (the top right is where a line label is looked for).
    const [p, q] = a[1] < b[1] || (a[1] === b[1] && a[0] > b[0]) ? [a, b] : [b, a];
    alongLabel(p, q, [0.06, 0.15, 0.25, 0.4, 0.55, 0.7, 0.85, 0.94], l.label);
  });
  m.arrows.forEach((ar) => { if (ar.label) alongLabel(C(ar.from), C(ar.to), [0.5, 0.35, 0.65, 0.2, 0.8], ar.label); });

  let H = f.bottom;
  let legend = '';
  if (m.polygons.some((g) => g.name)) {
    const lg = buildLegend(m.polygons.map((g, j) => ({ label: g.name ?? `polygon ${j + 1}`, color: colorOf(j), dash: dashes[j] || undefined })), f.bottom - 2);
    legend = lg.svg;
    H = f.bottom - 2 + lg.height;
  }
  // Fills under the grid; then the frame; guides; outlines; dots; labels; legend.
  const body = fills.join('') + f.svg + guides.join('') + strokes.join('') + marksSvg.join('') + labelSvg.join('') + legend;
  return {
    body,
    H: H + 4,
    facts: { plot: { ...f.plot }, curveCount: m.polygons.length, marks, curves: [], ...(notes.length ? { notes } : {}) },
  };
}
