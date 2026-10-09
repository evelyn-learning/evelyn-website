/**
 * solid_3d — line drawings of solids in an oblique projection (depth runs up
 * to the right at 30°, drawn at half length), hidden edges dashed; and the
 * solid-of-revolution variant on axes.
 *
 * Common: { solid; unit?: string; labels?: { [dimension]: LABEL };
 *           hiddenEdges?: 'all' | 'few';   // 'few' leaves out the dashed edges that only show
 *                                          //   the far side of a box or pyramid. Default 'all',
 *                                          //   except a pyramid on a prism, and a pyramid whose
 *                                          //   slant height is drawn: 'few' (with every hidden
 *                                          //   edge those drawings are a tangle at 340 px)
 *           notToScale?: boolean (false); title?: string }
 * LABEL = 'auto' (the value with the unit) | any text ("x", "2r") | "?" (a
 * blank box) | null (nothing). Default 'auto' for every dimension given,
 * except `slant`, which is printed only when asked for.
 *
 * solid 'prism'            { length; width; height }     // a rectangular box: left–right, depth, up
 * solid 'triangular_prism' { base; height; length }      // an isosceles triangle (base × height) pushed back `length`
 * solid 'cylinder'         { radius; height }
 * solid 'cone'             { radius; height }            // labels may include slant
 * solid 'sphere' | 'hemisphere'  { radius }
 * solid 'pyramid'          { base; height }              // square base; labels may include slant
 * solid 'composite'        { bottom: 'cylinder' | 'prism'; top: 'cone' | 'hemisphere' | 'pyramid';
 *                            radius | base;              // cylinder: radius. prism: a square base of side `base`
 *                            height;                     // of the bottom solid
 *                            topHeight? }                // of a cone or pyramid on top (labels: topHeight)
 *   A cone or a hemisphere goes on a cylinder, a pyramid on a prism; the two share their footprint.
 *
 * solid 'revolution' — the region under a curve (or between two) on
 *   [from, to], drawn hatched on axes, with the outline of the solid it sweeps
 *   out about the axis (the mirror image, dashed, and the end circles in
 *   perspective) and one representative strip:
 *   { axis: 'x' | 'y';
 *     outer: Curve; inner?: Curve;        // inner: the region lies between the two (a washer)
 *     from: number; to: number;           // the interval of x (for axis 'y': 0 ≤ from)
 *     strip?: boolean (true);             // perpendicular to the axis about x (disk / washer),
 *                                         //   parallel to it about y (shell)
 *     showSolid?: boolean (true);
 *     xStep?: number; yStep?: number }
 *   Curve = { poly: number[];             // y = c0 + c1·x + c2·x² + … (up to degree 4)
 *             sqrt?: boolean (false);     // y = √(that polynomial)
 *             label?: string }            // printed beside the curve ("y = √x")
 */
import { FIGURE_WIDTH, SERIES_COLORS, buildFrame, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, hatched, text, titleBlock } from './draw';
import { ellipseD, facts, halfEllipseD, lab, numStr, polyPath, stroke, type Notes, type Pt } from './draw2';

export const SOLIDS = ['prism', 'triangular_prism', 'cylinder', 'cone', 'sphere', 'hemisphere', 'pyramid', 'composite', 'revolution'] as const;
export type SolidName = (typeof SOLIDS)[number];

export interface RevCurve { poly: number[]; sqrt: boolean; label?: string; f: (x: number) => number }
export interface SolidModel {
  solid: SolidName;
  /** The dimensions given (true values). */
  dims: Record<string, number>;
  /** Printed label per dimension (resolved); absent = nothing printed. */
  labels: Record<string, string>;
  unit: string;
  notToScale: boolean;
  bottom?: 'cylinder' | 'prism';
  top?: 'cone' | 'hemisphere' | 'pyramid';
  /** 'few': the far-side edges of a box / pyramid are not drawn. */
  hiddenEdges?: 'all' | 'few';
  revolution?: { axis: 'x' | 'y'; outer: RevCurve; inner?: RevCurve; from: number; to: number; strip: boolean; showSolid: boolean; xStep?: number; yStep?: number };
  title?: string;
}

const DIMS: Record<Exclude<SolidName, 'composite' | 'revolution'>, string[]> = {
  prism: ['length', 'width', 'height'], triangular_prism: ['base', 'height', 'length'], cylinder: ['radius', 'height'],
  cone: ['radius', 'height'], sphere: ['radius'], hemisphere: ['radius'], pyramid: ['base', 'height'],
};

export function solidModel(r: Reader): SolidModel {
  const p = r.p;
  if (!SOLIDS.includes(p.solid as SolidName)) r.fail(`solid must be one of ${SOLIDS.join(', ')}`);
  const solid = p.solid as SolidName;
  const unit = r.optStr(p.unit, 'unit', 6) ?? '';
  const base = { solid, unit, notToScale: r.bool(p.notToScale, 'notToScale', false), title: r.optStr(p.title, 'title', 160) };
  if (solid === 'revolution') {
    const curve = (v: unknown, name: string): RevCurve => {
      const o = r.obj(v, name);
      const poly = r.list(o.poly, `${name}.poly`, 1, 5).map((c, i) => r.num(c, `${name}.poly[${i}]`));
      const sqrt = r.bool(o.sqrt, `${name}.sqrt`, false);
      const g = (x: number) => poly.reduce((a, c, i) => a + c * x ** i, 0);
      return { poly, sqrt, label: r.optStr(o.label, `${name}.label`, 20), f: sqrt ? (x) => Math.sqrt(g(x)) : g };
    };
    if (p.axis !== 'x' && p.axis !== 'y') r.fail("axis must be 'x' or 'y'");
    const outer = curve(p.outer, 'outer');
    const inner = p.inner === undefined || p.inner === null ? undefined : curve(p.inner, 'inner');
    const from = r.num(p.from, 'from');
    const to = r.num(p.to, 'to');
    if (!(to > from)) r.fail('to must be greater than from');
    if (p.axis === 'y' && from < 0) r.fail("from must not be negative for a rotation about the y-axis (the region must lie on one side of the axis)");
    for (let i = 0; i <= 40; i++) {
      const x = from + ((to - from) * i) / 40;
      const o = outer.f(x);
      const n = inner ? inner.f(x) : 0;
      if (!Number.isFinite(o) || !Number.isFinite(n)) r.fail(`the curve is not defined at x = ${numStr(x, 3)}`);
      if (n < -1e-9 || o < n - 1e-9) r.fail(`at x = ${numStr(x, 3)} the region is not between the axis and the outer curve (outer ≥ inner ≥ 0 is needed on the whole interval)`);
    }
    return { ...base, dims: {}, labels: {}, revolution: { axis: p.axis, outer, inner, from, to, strip: r.bool(p.strip, 'strip', true), showSolid: r.bool(p.showSolid, 'showSolid', true), xStep: r.optStep(p.xStep, 'xStep'), yStep: r.optStep(p.yStep, 'yStep') } };
  }
  let names: string[];
  let bottom: SolidModel['bottom'];
  let top: SolidModel['top'];
  if (solid === 'composite') {
    if (p.bottom !== 'cylinder' && p.bottom !== 'prism') r.fail("bottom must be 'cylinder' or 'prism'");
    bottom = p.bottom as 'cylinder' | 'prism';
    const tops = bottom === 'cylinder' ? ['cone', 'hemisphere'] : ['pyramid'];
    if (!tops.includes(p.top as string)) r.fail(`top must be ${tops.map((s) => `'${s}'`).join(' or ')} on a ${bottom}`);
    top = p.top as SolidModel['top'];
    names = [bottom === 'cylinder' ? 'radius' : 'base', 'height', ...(top === 'hemisphere' ? [] : ['topHeight'])];
  } else names = DIMS[solid];
  const dims: Record<string, number> = {};
  for (const k of names) dims[k] = r.positive(p[k], k);
  const lo = p.labels === undefined || p.labels === null ? {} : r.obj(p.labels, 'labels');
  const slantOk = solid === 'cone' || solid === 'pyramid' || top === 'cone' || top === 'pyramid';
  for (const k of Object.keys(lo)) if (!names.includes(k) && !(k === 'slant' && slantOk)) r.fail(`labels.${k}: this solid has no such dimension (${[...names, ...(slantOk ? ['slant'] : [])].join(', ')})`);
  if (slantOk) {
    const h = dims.topHeight ?? dims.height;
    const half = dims.radius ?? dims.base / 2;
    dims.slant = Math.hypot(h, half);
  }
  const labels: Record<string, string> = {};
  for (const k of [...names, ...(slantOk ? ['slant'] : [])]) {
    const v = lo[k];
    const auto = `${numStr(dims[k], 2)}${unit ? ` ${unit}` : ''}`;
    if (v === null || (v === undefined && k === 'slant')) continue;
    labels[k] = v === undefined || v === 'auto' ? auto : r.str(v, `labels.${k}`, 14);
  }
  if (p.hiddenEdges !== undefined && p.hiddenEdges !== null && p.hiddenEdges !== 'all' && p.hiddenEdges !== 'few') r.fail("hiddenEdges must be 'all' or 'few'");
  // A pyramid with its slant height drawn already has three dashed lines fanning out of the apex
  // (height, slant, far edge): the far edge is the one that says least.
  const pyramidSlant = (solid === 'pyramid' || top === 'pyramid') && labels.slant !== undefined;
  const hiddenEdges = (p.hiddenEdges as 'all' | 'few' | undefined | null) ?? ((solid === 'composite' && bottom === 'prism') || pyramidSlant ? 'few' : 'all');
  return { ...base, dims, labels, bottom, top, hiddenEdges };
}

// ---------------------------------------------------------------------------
// Exact volume of a solid of revolution (rational coefficient of π)
// ---------------------------------------------------------------------------

type Poly = number[];
const pMul = (a: Poly, b: Poly): Poly => {
  const out = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; }));
  return out;
};
const pSub = (a: Poly, b: Poly): Poly => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] ?? 0) - (b[i] ?? 0));
const gcdInt = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcdInt(b, a % b));

/**
 * The volume as num/den × π, in lowest terms. Disk / washer about the x-axis
 * (π∫(R² − r²)dx), shells about the y-axis (2π∫x(R − r)dx). Coefficients and
 * limits are taken as decimals of at most three places. Null when the
 * integrand is not a polynomial (a square root about the y-axis).
 */
export function revolutionVolume(rev: NonNullable<SolidModel['revolution']>): { num: number; den: number } | null {
  const S = 1000;
  let integrand: Poly;
  if (rev.axis === 'x') {
    const sq = (c: RevCurve): Poly => (c.sqrt ? c.poly : pMul(c.poly, c.poly));
    integrand = rev.inner ? pSub(sq(rev.outer), sq(rev.inner)) : sq(rev.outer);
  } else {
    if (rev.outer.sqrt || rev.inner?.sqrt) return null;
    integrand = pMul([0, 2], rev.inner ? pSub(rev.outer.poly, rev.inner.poly) : rev.outer.poly);
  }
  // Σ c_k (b^(k+1) − a^(k+1)) / (k+1), all as integers over one denominator.
  const a = Math.round(rev.from * S);
  const b = Math.round(rev.to * S);
  let num = 0;
  let den = 1;
  integrand.forEach((c, k) => {
    const cn = Math.round(c * S * S);
    const tn = cn * (b ** (k + 1) - a ** (k + 1));
    const td = S * S * S ** (k + 1) * (k + 1);
    num = num * td + tn * den;
    den *= td;
    const g = gcdInt(num, den) || 1;
    num /= g;
    den /= g;
  });
  if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) return null;
  return { num, den };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const DX = 0.5 * Math.cos(Math.PI / 6);
const DY = 0.5 * Math.sin(Math.PI / 6);
const SQUASH = 0.3;

interface Ink { solid: string[]; hidden: string[]; marks: string[]; labels: string[] }

function renderRevolution(m: SolidModel, uid: string): Drawn {
  const rev = m.revolution as NonNullable<SolidModel['revolution']>;
  const notes: Notes = [];
  const N = 60;
  const xs = Array.from({ length: N + 1 }, (_, i) => rev.from + ((rev.to - rev.from) * i) / N);
  const top = Math.max(...xs.map((x) => rev.outer.f(x)));
  const xr: [number, number] = rev.axis === 'x' ? [Math.min(0, rev.from) - (rev.to - rev.from) * 0.12, rev.to + (rev.to - rev.from) * 0.18] : [-rev.to * 1.15, rev.to * 1.15];
  const yr: [number, number] = rev.axis === 'x' ? [-top * 1.15, top * 1.15] : [Math.min(0, -top * 0.12), top * 1.18];
  const f = buildFrame({ xRange: xr, yRange: yr, xStep: rev.xStep, yStep: rev.yStep, xLabel: 'x', yLabel: 'y', title: m.title, aspect: 0.82 });
  const C = (x: number, y: number): Pt => [f.X(x), f.Y(y)];
  const outer = xs.map((x) => C(x, rev.outer.f(x)));
  const inner = xs.map((x) => C(x, rev.inner ? rev.inner.f(x) : 0));
  const region = [...outer, ...inner.slice().reverse()];
  const bx = region.map((q) => q[0]);
  const by = region.map((q) => q[1]);
  const h = hatched(`${uid}-reg`, `<path d="${polyPath(region, true)}"`, { x0: Math.min(...bx), y0: Math.min(...by), x1: Math.max(...bx), y1: Math.max(...by) }, '/', SERIES_COLORS[0], { gap: 5 });
  const parts: string[] = [f.svg, h.svg];
  if (rev.showSolid) {
    // The mirror image of the region's outline, and the circles its ends sweep out (seen edge-on, so drawn as thin ellipses).
    const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => (rev.axis === 'x' ? [x, 2 * f.Y(0) - y] : [2 * f.X(0) - x, y]));
    parts.push(`<path d="${polyPath(mirror(outer))}" ${stroke(MUTED, 1.3, '5 3')}/>`);
    if (rev.inner) parts.push(`<path d="${polyPath(mirror(inner))}" ${stroke(MUTED, 1.3, '5 3')}/>`);
    const ends = rev.axis === 'x' ? [rev.from, rev.to] : [rev.to];
    for (const x of ends) {
      for (const c of [rev.outer, ...(rev.inner ? [rev.inner] : [])]) {
        const v = c.f(x);
        if (rev.axis === 'x') {
          const ry = Math.abs(f.Y(0) - f.Y(v));
          if (ry > 4) parts.push(`<path d="${ellipseD(f.X(x), f.Y(0), Math.min(12, ry * 0.24), ry)}" ${stroke(MUTED, 1.1)}/>`);
        } else {
          const rx = Math.abs(f.X(x) - f.X(0));
          if (rx > 4) parts.push(`<path d="${ellipseD(f.X(0), f.Y(v), rx, Math.min(11, rx * 0.2))}" ${stroke(MUTED, 1.1)}/>`);
        }
      }
    }
  }
  parts.push(`<path d="${polyPath(region, true)}" ${stroke(INK, 1)} stroke-linejoin="round"/>`);
  parts.push(`<path d="${polyPath(outer)}" ${stroke(SERIES_COLORS[0], 2.2)}/>`);
  if (rev.inner) parts.push(`<path d="${polyPath(inner)}" ${stroke(SERIES_COLORS[1], 2.2, '6 4')}/>`);
  if (rev.strip) {
    const x = rev.from + (rev.to - rev.from) * 0.62;
    const w = Math.max(5, Math.min(9, (f.X(rev.to) - f.X(rev.from)) / 14));
    const y1 = f.Y(rev.outer.f(x));
    const y0 = f.Y(rev.inner ? rev.inner.f(x) : 0);
    parts.push(`<rect x="${n2(f.X(x) - w / 2)}" y="${n2(y1)}" width="${n2(w)}" height="${n2(y0 - y1)}" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`);
  }
  for (const [c, pts, color] of [[rev.outer, outer, SERIES_COLORS[0]], [rev.inner, inner, SERIES_COLORS[1]]] as Array<[RevCurve | undefined, Pt[], string]>) {
    if (!c?.label) continue;
    const q = pts[Math.round(N * 0.3)];
    const above = c === rev.outer;
    if (above) parts.push(text(Math.max(f.plot.x + 4, q[0] - 6), q[1] - 8, c.label, { fs: 12, anchor: 'end', weight: 600, fill: color, halo: true }));
    else { const w = pts[Math.round(N * 0.72)]; parts.push(text(w[0] + 8, w[1] + 15, c.label, { fs: 12, anchor: 'start', weight: 600, fill: color, halo: true })); }
  }
  if (!rev.showSolid && !rev.strip) notes.push({ code: 'ambiguous_blank', message: 'showSolid and strip are both false — nothing on the figure says the region is revolved, or about which axis' });
  // The axis of rotation: a curved arrow round it, at its positive end.
  const ax = rev.axis === 'x' ? C(xr[1] - (xr[1] - xr[0]) * 0.06, 0) : C(0, yr[1] - (yr[1] - yr[0]) * 0.07);
  const [rx, ry] = rev.axis === 'x' ? [4.5, 10] : [10, 4.5];
  parts.push(`<path d="${ellipseD(ax[0], ax[1], rx, ry)}" fill="#ffffff" stroke="${INK}" stroke-width="1.4"/>`);
  parts.push(rev.axis === 'x' ? `<polygon points="${n2(ax[0] + rx)},${n2(ax[1] + 1)} ${n2(ax[0] + rx - 4)},${n2(ax[1] - 6)} ${n2(ax[0] + rx + 4)},${n2(ax[1] - 6)}" fill="${INK}"/>` : `<polygon points="${n2(ax[0] + 1)},${n2(ax[1] + ry)} ${n2(ax[0] - 6)},${n2(ax[1] + ry - 4)} ${n2(ax[0] - 6)},${n2(ax[1] + ry + 4)}" fill="${INK}"/>`);
  return { body: `<defs>${h.def}</defs>` + parts.join(''), H: f.bottom, facts: { ...facts(notes), plot: f.plot } };
}

export function renderSolid(r: Reader, uid: string): Drawn {
  const m = solidModel(r);
  if (m.solid === 'revolution') return renderRevolution(m, uid);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const d = m.dims;
  const L = m.labels;
  // Extent in true units (width × height of the projected drawing), to choose one scale.
  const kind = m.solid === 'composite' ? (m.bottom as string) : m.solid;
  const round = ['cylinder', 'cone', 'sphere', 'hemisphere'].includes(kind);
  const footW = round ? 2 * d.radius : kind === 'prism' && m.solid === 'prism' ? d.length : d.base ?? d.length;
  const depth = round ? 0 : m.solid === 'prism' ? d.width : m.solid === 'triangular_prism' ? d.length : d.base;
  const tall = m.solid === 'sphere' ? 2 * d.radius : m.solid === 'hemisphere' ? d.radius : m.solid === 'composite' ? d.height + (m.top === 'hemisphere' ? d.radius : d.topHeight) : d.height;
  const extW = footW + depth * DX;
  const extH = tall + depth * DY + (round ? d.radius * SQUASH : 0);
  const k = Math.min(210 / extW, 200 / extH);
  if (Math.min(extW, extH) * k < 46) notes.push({ code: 'crowded', message: 'one dimension is so much smaller than the others that the solid is drawn under 46 units across — its labels crowd' });
  const top = t.top + 22;
  const x0 = (W - extW * k) / 2 + (round ? 0 : 0);
  const yBase = top + extH * k - (round ? d.radius * SQUASH * k : 0);
  /** True (x right, y up, z back) → canvas. */
  const P = (x: number, y: number, z = 0): Pt => [x0 + (x + z * DX) * k, yBase - (y + z * DY) * k];
  const ink: Ink = { solid: [], hidden: [], marks: [], labels: [] };
  const few = m.hiddenEdges === 'few';
  const lineS = (...pts: Pt[]) => ink.solid.push(polyPath(pts));
  const lineH = (...pts: Pt[]) => ink.hidden.push(polyPath(pts));
  const put = (q: Pt, s: string | undefined, anchor: 'start' | 'middle' | 'end', dx = 0, dy = 0) => {
    if (s !== undefined) ink.labels.push(lab(q[0] + dx, q[1] + dy, s, anchor, { fs: 12, halo: true }));
  };
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  /** A label set ON its own (dashed) line, on a white plate that interrupts the line — and whatever else runs behind it. */
  const plate = (q: Pt, s: string | undefined) => {
    if (s === undefined) return;
    const w = (s === '?' ? 22 : estWidth(s, 12) * 0.9) + 6;
    ink.labels.push(`<rect x="${n2(q[0] - w / 2)}" y="${n2(q[1] - 8)}" width="${n2(w)}" height="16" fill="#ffffff"/>` + lab(q[0], q[1] + 4.3, s, 'middle', { fs: 12 }));
  };
  const square = (v: Pt, a: Pt, b: Pt) => {
    const u = (q: Pt): Pt => { const l = Math.hypot(q[0] - v[0], q[1] - v[1]) || 1; return [((q[0] - v[0]) / l) * 8, ((q[1] - v[1]) / l) * 8]; };
    const [ua, ub] = [u(a), u(b)];
    ink.marks.push(`<path d="${polyPath([[v[0] + ua[0], v[1] + ua[1]], [v[0] + ua[0] + ub[0], v[1] + ua[1] + ub[1]], [v[0] + ub[0], v[1] + ub[1]]])}" ${stroke(INK, 1.1)}/>`);
  };
  /** A box from (0, y0) of size l × h × w: returns its top-face corners. */
  const box = (l: number, w: number, h: number) => {
    const [fl, fr, bl, br] = [P(0, 0), P(l, 0), P(0, 0, w), P(l, 0, w)];
    const [tfl, tfr, tbl, tbr] = [P(0, h), P(l, h), P(0, h, w), P(l, h, w)];
    lineS(fl, fr, tfr, tfl, fl);
    lineS(tfl, tbl, tbr, tfr);
    lineS(fr, br, tbr);
    if (!few) {
      lineH(fl, bl, br);
      lineH(bl, tbl);
    }
    return { fl, fr, br, tfl, tfr, tbl, tbr };
  };
  /** A pyramid on a square of side s whose front-left corner is at height y0. */
  const pyramid = (s: number, y0: number, h: number, onBox: boolean, heightKey: string) => {
    const [fl, fr, bl, br] = [P(0, y0), P(s, y0), P(0, y0, s), P(s, y0, s)];
    const apex = P(s / 2, y0 + h, s / 2);
    const centre = P(s / 2, y0, s / 2);
    lineS(fl, apex, fr);
    lineS(apex, br);
    if (!few) lineH(apex, bl);
    if (!onBox) {
      lineS(fl, fr, br);
      lineH(fl, bl, br);
    }
    if (L[heightKey] !== undefined) {
      lineH(apex, centre);
      square(centre, apex, P(s, y0, s / 2));
      lineH(centre, P(s, y0, s / 2));
      // The height is written outside, against a dimension line level with the apex and the base.
      const dx = Math.max(br[0], fr[0]) + 13;
      ink.marks.push(`<path d="M${n2(dx)},${n2(apex[1])}V${n2(centre[1])}M${n2(dx - 4)},${n2(apex[1])}h8M${n2(dx - 4)},${n2(centre[1])}h8" ${stroke(MUTED, 1)}/>`);
      put([dx, (apex[1] + centre[1]) / 2], L[heightKey], 'start', 7, 4);
    }
    if (L.slant !== undefined) {
      const fm = P(s / 2, y0);
      ink.hidden.push(polyPath([apex, fm]));
      // Low on the slant line, where it has drawn clear of the height line and the edges that meet at the apex.
      plate([fm[0] + (apex[0] - fm[0]) * 0.3, fm[1] + (apex[1] - fm[1]) * 0.3], L.slant);
    }
    return { fl, fr, br };
  };
  /** An upright circular footprint: centre x in true units, at height y; returns canvas centre and radii. */
  const disc = (y: number): { c: Pt; rx: number; ry: number } => ({ c: P(d.radius, y), rx: d.radius * k, ry: d.radius * k * SQUASH });
  const rim = (y: number, back: 'solid' | 'hidden') => {
    const e = disc(y);
    ink.solid.push(halfEllipseD(e.c[0], e.c[1], e.rx, e.ry, false));
    (back === 'solid' ? ink.solid : ink.hidden).push(halfEllipseD(e.c[0], e.c[1], e.rx, e.ry, true));
    return e;
  };
  const radiusMark = (e: { c: Pt; rx: number }, dy: number) => {
    if (L.radius === undefined) return;
    ink.marks.push(`<path d="M${n2(e.c[0])},${n2(e.c[1])}H${n2(e.c[0] + e.rx)}" ${stroke(INK, 1.3, dy > 0 ? '5 3' : undefined)}/><circle cx="${n2(e.c[0])}" cy="${n2(e.c[1])}" r="2.4" fill="${INK}"/>`);
    if (dy > 0) put([e.c[0] + e.rx, e.c[1]], L.radius, 'start', 7, 13);
    else put([e.c[0] + e.rx / 2, e.c[1]], L.radius, 'middle', 0, L.radius === '?' ? -9 : -5);   // a "?" box clears the line
  };
  const cone = (y0: number, h: number, heightKey: string, baseBack: 'hidden' | 'none') => {
    const e = disc(y0);
    const apex = P(d.radius, y0 + h);
    lineS([e.c[0] - e.rx, e.c[1]], apex, [e.c[0] + e.rx, e.c[1]]);
    if (baseBack === 'hidden') rim(y0, 'hidden');
    if (L[heightKey] !== undefined) {
      lineH(apex, e.c);
      square(e.c, apex, [e.c[0] + e.rx, e.c[1]]);
      put([e.c[0], e.c[1] + (apex[1] - e.c[1]) * 0.3], L[heightKey], 'start', 6, 4);
    }
    if (L.slant !== undefined) put(mid(apex, [e.c[0] + e.rx, e.c[1]]), L.slant, 'start', 7, 0);
    return e;
  };
  const dome = (y0: number) => {
    const e = disc(y0);
    ink.solid.push(`M${n2(e.c[0] - e.rx)},${n2(e.c[1])}A${n2(e.rx)},${n2(e.rx)} 0 0 1 ${n2(e.c[0] + e.rx)},${n2(e.c[1])}`);
    return e;
  };

  switch (m.solid) {
    case 'prism': {
      const b = box(d.length, d.width, d.height);
      put(mid(b.fl, b.fr), L.length, 'middle', 0, 16);
      put(mid(b.fl, b.tfl), L.height, 'end', -6, 4);
      put(mid(b.fr, b.br), L.width, 'start', 7, 9);
      break;
    }
    case 'triangular_prism': {
      const [fl, fr, fa] = [P(0, 0), P(d.base, 0), P(d.base / 2, d.height)];
      const [bl, br, ba] = [P(0, 0, d.length), P(d.base, 0, d.length), P(d.base / 2, d.height, d.length)];
      lineS(fl, fr, fa, fl);
      lineS(fa, ba, br, fr);
      lineH(fl, bl, br);
      lineH(bl, ba);
      put(mid(fl, fr), L.base, 'middle', 0, 16);
      if (L.height !== undefined) {
        const foot = P(d.base / 2, 0);
        lineH(fa, foot);
        square(foot, fa, fr);
        plate([foot[0], foot[1] + (fa[1] - foot[1]) * 0.62], L.height);
      }
      put(mid(fr, br), L.length, 'start', 7, 9);
      break;
    }
    case 'cylinder': {
      const e = rim(0, 'hidden');
      const tp = rim(d.height, 'solid');
      lineS([e.c[0] - e.rx, e.c[1]], [tp.c[0] - tp.rx, tp.c[1]]);
      lineS([e.c[0] + e.rx, e.c[1]], [tp.c[0] + tp.rx, tp.c[1]]);
      radiusMark(tp, -1);
      put([e.c[0] + e.rx, (e.c[1] + tp.c[1]) / 2], L.height, 'start', 7, 4);
      break;
    }
    case 'cone': {
      const e = cone(0, d.height, 'height', 'hidden');
      radiusMark(e, 1);
      break;
    }
    case 'sphere': case 'hemisphere': {
      const y = m.solid === 'sphere' ? d.radius : 0;
      const e = rim(y, 'hidden');
      if (m.solid === 'sphere') ink.solid.push(ellipseD(e.c[0], e.c[1], e.rx, e.rx));
      else dome(0);
      radiusMark(e, m.solid === 'sphere' ? -1 : -1);
      break;
    }
    case 'pyramid': {
      const b = pyramid(d.base, 0, d.height, false, 'height');
      put(mid(b.fl, b.fr), L.base, 'middle', 0, 16);
      break;
    }
    default: {
      if (m.bottom === 'cylinder') {
        const e = rim(0, 'hidden');
        const tp = rim(d.height, 'hidden');
        lineS([e.c[0] - e.rx, e.c[1]], [tp.c[0] - tp.rx, tp.c[1]]);
        lineS([e.c[0] + e.rx, e.c[1]], [tp.c[0] + tp.rx, tp.c[1]]);
        if (m.top === 'cone') cone(d.height, d.topHeight, 'topHeight', 'none');
        else dome(d.height);
        radiusMark(e, 1);
        put([e.c[0] + e.rx, (e.c[1] + tp.c[1]) / 2], L.height, 'start', 7, 4);
      } else {
        const b = box(d.base, d.base, d.height);
        // The box's top face is the pyramid's base: its two back edges are hidden behind the pyramid.
        ink.solid.pop();
        ink.solid.pop();
        ink.solid.push(polyPath([b.fr, b.br, b.tbr]), polyPath([b.tfr, b.tbr]));
        lineH(b.tfl, b.tbl, b.tbr);
        pyramid(d.base, d.height, d.topHeight, true, 'topHeight');
        put(mid(b.fl, b.fr), L.base, 'middle', 0, 16);
        put(mid(b.fl, b.tfl), L.height, 'end', -6, 4);
      }
    }
  }
  let H = yBase + (round ? d.radius * SQUASH * k : 0) + (L.length !== undefined || L.base !== undefined || (round && L.radius !== undefined && (m.solid === 'cone' || m.solid === 'composite')) ? 24 : 12);
  const parts = [t.svg, `<path d="${ink.hidden.join('')}" ${stroke(INK, 1.2, '5 3')}/>`, `<path d="${ink.solid.join('')}" ${stroke(INK, 1.9)} stroke-linejoin="round"/>`, ...ink.marks, ...ink.labels];
  if (m.notToScale) {
    parts.push(text(W - 8, H + 4, 'not to scale', { anchor: 'end', fill: MUTED, italic: true }));
    H += 14;
  }
  // A pyramid on a prism with BOTH its height and its slant height drawn: two dashed lines and two
  // labels inside one small triangle, over the dashed back edges of the prism's top.
  if (m.solid === 'composite' && m.top === 'pyramid' && L.slant !== undefined && L.topHeight !== undefined) notes.push({ code: 'crowded', message: 'labels: the pyramid on the prism carries both its height and its slant height — the two dashed lines and their labels crowd at 340 px; label one of them (labels.slant or labels.topHeight: null)' });
  if (Object.values(L).every((s) => s === '?' || !/\d/.test(s))) notes.push({ code: 'ambiguous_blank', message: 'labels: no dimension carries a number — nothing fixes the size of the solid' });
  return { body: parts.join(''), H, facts: facts(notes) };
}
