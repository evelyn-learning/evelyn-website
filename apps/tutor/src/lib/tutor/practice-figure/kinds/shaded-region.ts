/**
 * shaded_region — a hatched region on a function-graph frame.
 *
 * { xRange: [min, max]; yRange: [min, max]; xStep?: number; yStep?: number;
 *   xLabel?: string ('x'); yLabel?: string ('y'); title?: string;
 *   region:
 *     { type: 'under_curve'; expr: string; label?: string; from: number; to: number;
 *       showBounds?: boolean (true) }       // between the curve and the x-axis
 *   | { type: 'between_curves'; upper: { expr; label? }; lower: { expr; label? };
 *       from?: number; to?: number;         // default: the whole xRange
 *       showBounds?: boolean (true); markIntersections?: boolean (false) }
 *   | { type: 'inequalities';               // the solution region of a·x + b·y  op  c
 *       inequalities: Array<{ a: number; b: number; op: '<' | '<=' | '>' | '>='; c: number;
 *                             label?: string }>;      // 1–5
 *       markVertices?: boolean (false) } }
 *
 * The region is shaded by DRAWN hatch lines under a clip path (no translucent
 * fill, no pattern). A strict inequality's boundary is dashed, a non-strict
 * one solid. Nothing states an equation or an inequality unless a `label` is
 * given (it goes in the legend); corner and intersection points are marked
 * only when asked.
 */
import { compileExpression } from '../expr';
import { SERIES_COLORS, assignDashes, buildFrame, buildLegend, dashAttr, n2, type LegendEntry } from '../plot-frame';
import { sampleCurve } from '../sample';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { hatched, type Box } from './draw';

type Pt = [number, number];
export type IneqOp = '<' | '<=' | '>' | '>=';

export interface Inequality {
  a: number;
  b: number;
  op: IneqOp;
  c: number;
  label?: string;
}

export interface RegionCurve {
  expr: string;
  fn: (x: number) => number;
  label?: string;
}

export type Region =
  | { type: 'under_curve'; curve: RegionCurve; from: number; to: number; showBounds: boolean }
  | { type: 'between_curves'; upper: RegionCurve; lower: RegionCurve; from: number; to: number; showBounds: boolean; markIntersections: boolean; intersections: Pt[] }
  | { type: 'inequalities'; inequalities: Inequality[]; markVertices: boolean; polygon: Pt[]; vertices: Pt[] };

export interface ShadedRegionModel {
  xRange: [number, number];
  yRange: [number, number];
  xStep?: number;
  yStep?: number;
  xLabel: string;
  yLabel: string;
  title?: string;
  region: Region;
}

export const satisfies = (q: Inequality, x: number, y: number, tol = 1e-9): boolean => {
  const v = q.a * x + q.b * y;
  return q.op === '<' ? v < q.c - tol : q.op === '<=' ? v <= q.c + tol : q.op === '>' ? v > q.c + tol : v >= q.c - tol;
};

/** Clip a convex polygon to a·x + b·y ≤ c (or ≥ c): Sutherland–Hodgman. */
function clipHalfPlane(poly: Pt[], q: Inequality): Pt[] {
  const sign = q.op === '<' || q.op === '<=' ? 1 : -1;
  const g = (p: Pt) => sign * (q.a * p[0] + q.b * p[1] - q.c);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const nxt = poly[(i + 1) % poly.length];
    const gc = g(cur);
    const gn = g(nxt);
    if (gc <= 0) out.push(cur);
    if ((gc < 0 && gn > 0) || (gc > 0 && gn < 0)) {
      const t = gc / (gc - gn);
      out.push([cur[0] + (nxt[0] - cur[0]) * t, cur[1] + (nxt[1] - cur[1]) * t]);
    }
  }
  return out;
}

const area = (poly: Pt[]): number => Math.abs(poly.reduce((t, p, i) => t + p[0] * poly[(i + 1) % poly.length][1] - poly[(i + 1) % poly.length][0] * p[1], 0)) / 2;
const snap = (v: number): number => Number(v.toFixed(9));

export function shadedRegionModel(r: Reader): ShadedRegionModel {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const g = r.obj(p.region, 'region');
  const curve = (raw: unknown, name: string): RegionCurve => {
    const o = r.obj(raw, name);
    try {
      return { expr: r.str(o.expr, `${name}.expr`, 200), fn: compileExpression(o.expr, ['x']), label: r.optStr(o.label, `${name}.label`, 40) };
    } catch (err) {
      return r.fail(`${name}.expr: ${(err as Error).message}`);
    }
  };
  const bounds = (): [number, number] => {
    const from = r.optNum(g.from, 'region.from') ?? xRange[0];
    const to = r.optNum(g.to, 'region.to') ?? xRange[1];
    if (!(to > from)) r.fail('region.to must be greater than from');
    if (from < xRange[0] - 1e-9 || to > xRange[1] + 1e-9) r.fail('region.from / region.to lie outside xRange');
    return [from, to];
  };
  const defined = (c: RegionCurve, from: number, to: number, name: string): void => {
    let prev = NaN;
    // Defined and continuous first (a pole also leaves yRange — the clearer message wins).
    for (let k = 0; k <= 400; k++) {
      const x = from + ((to - from) * k) / 400;
      const y = c.fn(x);
      // A pole between two samples shows as a jump of more than the whole plot.
      if (!Number.isFinite(y) || (Number.isFinite(prev) && Math.abs(y - prev) > (yRange[1] - yRange[0]) * 2)) r.fail(`${name} is not defined (or not continuous) at every x from ${from} to ${to} — near x = ${Number(x.toFixed(3))}`);
      prev = y;
    }
    for (let k = 0; k <= 400; k++) {
      const x = from + ((to - from) * k) / 400;
      const y = c.fn(x);
      if (y < yRange[0] - 1e-9 || y > yRange[1] + 1e-9) r.fail(`${name} leaves yRange between x = ${from} and x = ${to} (at x = ${Number(x.toFixed(3))}) — the region would be cut off`);
    }
  };
  let region: Region;
  if (g.type === 'under_curve') {
    const c = curve(g, 'region');
    const [from, to] = bounds();
    if (g.from === undefined || g.to === undefined) r.fail('region.from and region.to must both be given for under_curve');
    defined(c, from, to, 'region.expr');
    if (yRange[0] > 0 || yRange[1] < 0) r.fail('yRange must include 0 — the region runs down (or up) to the x-axis');
    region = { type: 'under_curve', curve: c, from, to, showBounds: r.bool(g.showBounds, 'region.showBounds', true) };
  } else if (g.type === 'between_curves') {
    const upper = curve(g.upper, 'region.upper');
    const lower = curve(g.lower, 'region.lower');
    const [from, to] = bounds();
    defined(upper, from, to, 'region.upper.expr');
    defined(lower, from, to, 'region.lower.expr');
    const diff = (x: number) => upper.fn(x) - lower.fn(x);
    const tol = (yRange[1] - yRange[0]) * 1e-9;
    for (let k = 0; k <= 400; k++) {
      const x = from + ((to - from) * k) / 400;
      if (diff(x) < -tol) r.fail(`region: upper is below the lower curve at x = ${Number(x.toFixed(3))} — swap them, or narrow from / to`);
    }
    // Where the two curves meet inside xRange (sign changes, and touching at the bounds).
    const xs: number[] = [];
    const N = 2000;
    for (let k = 0; k < N; k++) {
      const x0 = xRange[0] + ((xRange[1] - xRange[0]) * k) / N;
      const x1 = xRange[0] + ((xRange[1] - xRange[0]) * (k + 1)) / N;
      const d0 = diff(x0);
      const d1 = diff(x1);
      if (!Number.isFinite(d0) || !Number.isFinite(d1)) continue;
      if (Math.abs(d0) <= tol) xs.push(x0);
      else if (d0 * d1 < 0 && Math.abs(d1) > tol) {
        let lo = x0;
        let hi = x1;
        for (let it = 0; it < 60; it++) {
          const mid = (lo + hi) / 2;
          if (diff(lo) * diff(mid) <= 0) hi = mid;
          else lo = mid;
        }
        xs.push((lo + hi) / 2);
      }
    }
    if (Math.abs(diff(xRange[1])) <= tol) xs.push(xRange[1]);
    const intersections = [...new Set(xs.map(snap))].map((x): Pt => [x, snap(upper.fn(x))]).filter((q) => q[1] >= yRange[0] && q[1] <= yRange[1]);
    region = { type: 'between_curves', upper, lower, from, to, showBounds: r.bool(g.showBounds, 'region.showBounds', true), markIntersections: r.bool(g.markIntersections, 'region.markIntersections', false), intersections };
  } else if (g.type === 'inequalities') {
    const inequalities = r.list(g.inequalities, 'region.inequalities', 1, 5).map((raw, i): Inequality => {
      const o = r.obj(raw, `region.inequalities[${i}]`);
      const at = `region.inequalities[${i}]`;
      const a = r.num(o.a, `${at}.a`);
      const b = r.num(o.b, `${at}.b`);
      if (a === 0 && b === 0) r.fail(`${at}: a and b cannot both be 0`);
      if (!['<', '<=', '>', '>='].includes(o.op as string)) r.fail(`${at}.op must be '<', '<=', '>' or '>='`);
      return { a, b, op: o.op as IneqOp, c: r.num(o.c, `${at}.c`), label: r.optStr(o.label, `${at}.label`, 40) };
    });
    let polygon: Pt[] = [[xRange[0], yRange[0]], [xRange[1], yRange[0]], [xRange[1], yRange[1]], [xRange[0], yRange[1]]];
    for (const q of inequalities) polygon = clipHalfPlane(polygon, q);
    if (polygon.length < 3 || area(polygon) < (xRange[1] - xRange[0]) * (yRange[1] - yRange[0]) * 1e-6) r.fail('region: no point of the plot satisfies every inequality — there is nothing to shade');
    // Corners of the region where two boundary lines cross (not where it meets the plot edge).
    const vertices: Pt[] = [];
    for (let i = 0; i < inequalities.length; i++) {
      for (let j = i + 1; j < inequalities.length; j++) {
        const p1 = inequalities[i];
        const p2 = inequalities[j];
        const det = p1.a * p2.b - p2.a * p1.b;
        if (Math.abs(det) < 1e-12) continue;
        const x = snap((p1.c * p2.b - p2.c * p1.b) / det);
        const y = snap((p1.a * p2.c - p2.a * p1.c) / det);
        if (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1]) continue;
        const loose = (q: Inequality) => satisfies({ ...q, op: q.op === '<' ? '<=' : q.op === '>' ? '>=' : q.op }, x, y, 1e-7);
        if (inequalities.every(loose) && !vertices.some((v) => Math.abs(v[0] - x) < 1e-7 && Math.abs(v[1] - y) < 1e-7)) vertices.push([x, y]);
      }
    }
    vertices.sort((u, v) => u[0] - v[0] || u[1] - v[1]);
    region = { type: 'inequalities', inequalities, markVertices: r.bool(g.markVertices, 'region.markVertices', false), polygon, vertices };
  } else {
    return r.fail("region.type must be 'under_curve', 'between_curves' or 'inequalities'");
  }
  return {
    xRange, yRange,
    xStep: r.optStep(p.xStep, 'xStep'), yStep: r.optStep(p.yStep, 'yStep'),
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'x', yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'y',
    title: r.optStr(p.title, 'title', 160),
    region,
  };
}

const HATCH = '#1d4ed8';

export function renderShadedRegion(r: Reader, uid: string): Drawn {
  const m = shadedRegionModel(r);
  const [x0, x1] = m.xRange;
  const [y0, y1] = m.yRange;
  // Corner points and areas are read by counting squares: every unit is numbered while that still fits.
  const unit = !m.xStep && !m.yStep && Math.max(x1 - x0, y1 - y0) <= 12 ? 1 : undefined;
  const f = buildFrame({ xRange: m.xRange, yRange: m.yRange, xStep: m.xStep ?? unit, yStep: m.yStep ?? unit, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: Math.max(0.6, Math.min(1.25, (y1 - y0) / (x1 - x0))), commonStep: true });
  const facts: FigureFacts = { plot: f.plot, curveCount: 0, marks: [], curves: [], notes: [] };
  const X = f.X;
  const Y = f.Y;
  const legend: LegendEntry[] = [];
  const lines: string[] = [];
  const edges: string[] = [];
  const marks: string[] = [];
  let poly: Pt[] = [];
  const g = m.region;
  const mark = (q: Pt, open = false) => {
    marks.push(`<circle cx="${n2(X(q[0]))}" cy="${n2(Y(q[1]))}" r="5.9" fill="#ffffff"/><circle cx="${n2(X(q[0]))}" cy="${n2(Y(q[1]))}" r="3.8" fill="${open ? '#ffffff' : '#111827'}" stroke="#111827" stroke-width="1.8"/>`);
  };
  const curvePath = (c: RegionCurve, color: string, dash: string): string => {
    const pieces = sampleCurve(c.fn, x0, x1, y0, y1);
    const d = pieces.map((branch) => branch.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n2(X(x))},${n2(Y(y))}`).join('')).join('');
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${dashAttr(dash)}/>`;
  };
  const edge = (x: number, ya: number, yb: number) => {
    if (Math.abs(ya - yb) > 1e-9) edges.push(`<line x1="${n2(X(x))}" y1="${n2(Y(ya))}" x2="${n2(X(x))}" y2="${n2(Y(yb))}" stroke="${HATCH}" stroke-width="1.4"/>`);
  };
  if (g.type === 'under_curve') {
    const N = 160;
    for (let k = 0; k <= N; k++) {
      const x = g.from + ((g.to - g.from) * k) / N;
      poly.push([x, g.curve.fn(x)]);
    }
    poly.push([g.to, 0], [g.from, 0]);
    lines.push(curvePath(g.curve, SERIES_COLORS[0], ''));
    if (g.curve.label) legend.push({ label: g.curve.label, color: SERIES_COLORS[0] });
    if (g.showBounds) {
      edge(g.from, 0, g.curve.fn(g.from));
      edge(g.to, 0, g.curve.fn(g.to));
    }
    facts.curveCount = 1;
  } else if (g.type === 'between_curves') {
    const N = 160;
    for (let k = 0; k <= N; k++) {
      const x = g.from + ((g.to - g.from) * k) / N;
      poly.push([x, g.upper.fn(x)]);
    }
    for (let k = N; k >= 0; k--) {
      const x = g.from + ((g.to - g.from) * k) / N;
      poly.push([x, g.lower.fn(x)]);
    }
    const dashes = assignDashes([false, false]);
    lines.push(curvePath(g.upper, SERIES_COLORS[0], dashes[0]), curvePath(g.lower, SERIES_COLORS[1], dashes[1]));
    if (g.upper.label) legend.push({ label: g.upper.label, color: SERIES_COLORS[0], dash: dashes[0] });
    if (g.lower.label) legend.push({ label: g.lower.label, color: SERIES_COLORS[1], dash: dashes[1] });
    if (g.showBounds) {
      edge(g.from, g.lower.fn(g.from), g.upper.fn(g.from));
      edge(g.to, g.lower.fn(g.to), g.upper.fn(g.to));
    }
    if (g.markIntersections) g.intersections.forEach((q) => mark(q));
    facts.curveCount = 2;
  } else {
    poly = g.polygon;
    g.inequalities.forEach((q, i) => {
      const color = SERIES_COLORS[(i + 1) % SERIES_COLORS.length];
      const strict = q.op === '<' || q.op === '>';
      // The boundary line, end to end across the plot (the clip path trims it).
      let a: Pt;
      let b: Pt;
      if (Math.abs(q.b) > 1e-12) {
        a = [x0 - 1, (q.c - q.a * (x0 - 1)) / q.b];
        b = [x1 + 1, (q.c - q.a * (x1 + 1)) / q.b];
      } else {
        a = [q.c / q.a, y0 - 1];
        b = [q.c / q.a, y1 + 1];
      }
      lines.push(`<path d="M${n2(X(a[0]))},${n2(Y(a[1]))}L${n2(X(b[0]))},${n2(Y(b[1]))}" fill="none" stroke="${color}" stroke-width="2.2"${strict ? ' stroke-dasharray="7 4"' : ''}/>`);
      if (q.label) legend.push({ label: q.label, color, dashed: strict });
    });
    // A corner on a strict (dashed) boundary is not part of the solution set: an open circle.
    if (g.markVertices) g.vertices.forEach((v) => mark(v, g.inequalities.some((q) => (q.op === '<' || q.op === '>') && Math.abs(q.a * v[0] + q.b * v[1] - q.c) < 1e-7)));
    if (g.inequalities.length > 4) facts.notes?.push({ code: 'too_many_elements', message: `${g.inequalities.length} boundary lines — more than 4 crowd the plot at 340 px` });
  }
  const clampY = (y: number) => Math.max(y0, Math.min(y1, y));
  const pts = poly.map((q) => `${n2(X(q[0]))},${n2(Y(clampY(q[1])))}`).join(' ');
  const bbox: Box = { x0: f.plot.x, y0: f.plot.y, x1: f.plot.x + f.plot.w, y1: f.plot.y + f.plot.h };
  const h = hatched(`${uid}-region`, `<polygon points="${pts}"`, bbox, '/', HATCH, { gap: 6.5, width: 1 });
  const lg = buildLegend(legend, f.bottom);
  const defs = `<defs><clipPath id="${uid}-clip"><rect x="${n2(f.plot.x)}" y="${n2(f.plot.y)}" width="${n2(f.plot.w)}" height="${n2(f.plot.h)}"/></clipPath>${h.def}</defs>`;
  return {
    body: `${defs}${f.svg}${h.svg}${edges.join('')}<g clip-path="url(#${uid}-clip)">${lines.join('')}</g>${marks.join('')}${lg.svg}`,
    H: f.bottom + lg.height,
    facts,
  };
}
