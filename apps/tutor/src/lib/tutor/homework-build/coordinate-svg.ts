/**
 * Static SVG thumbnails of the coordinate-plane homework figures:
 * showCoordinatePlane, and the catalog kinds inequality_graph and
 * coordinate_grid (spec 2026-10-21 §4.6 option (b)). The board draws these
 * with CoordinatePlaneRenderer, CatalogInequalityGraphRenderer and
 * CatalogCoordinateGridRenderer, which are not rendered here (shared live
 * code, GAC freeze; the catalog ones are client components); these small
 * hand-written writers mirror their layout and what they print: the plane's
 * grid, axes, integer ticks, points, segments, vectors and their labels; the
 * inequality's number line, solution ray, open or closed endpoint and its
 * `variable operator value` label as the board prints it; the grid's points
 * (an unlabelled point shows its "(x, y)", as the board does) and the
 * connecting polyline. No shading. Bounded: a figure beyond the gate's
 * limits has no thumbnail. Never throws: anything it cannot draw gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { GRID_MAX_POINTS } from './figure-validate-diagram';
import { PLANE_DEFAULT_RANGE, PLANE_MAX_POINTS, PLANE_MAX_SEGMENTS, PLANE_MAX_VECTORS } from './figure-validate-data';
import { clip, esc, fmt, isNum, svgDoc } from './svg-util';
import type { DiagramFigure, FigureCommand } from './types';

type Plane = Extract<FigureCommand, { action: 'showCoordinatePlane' }>;
type Obj = Record<string, unknown>;
type XY = { x: number; y: number };

const obj = (v: unknown): Obj | null => (v && typeof v === 'object' && !Array.isArray(v) ? v as Obj : null);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const xy = (v: unknown): XY | null => { const o = obj(v); return o && isNum(o.x) && isNum(o.y) ? { x: o.x, y: o.y } : null; };
const color = (v: unknown, fallback: string) => (typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v) ? v : fallback);
/** At most this many ticks per axis (a degenerate range gives no thumbnail rather than a smear). */
const MAX_TICKS = 60;

/** A list field: [] when absent, null when it is not an array or is longer than `max`. */
function list(v: unknown, max: number): unknown[] | null {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) && v.length <= max ? v : null;
}

// CoordinatePlaneRenderer: DIAGRAM_VIEWBOX 520 × 360, its paddings and integer "nice" step.
const PW = 520, PH = 360;
function niceIntStep(span: number, target = 10): number {
  if (!(span > 0)) return 1;
  const raw = span / target;
  if (raw <= 1) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const r = raw / mag;
  return Math.max(1, Math.round((r <= 1.5 ? 1 : r <= 3 ? 2 : r <= 7 ? 5 : 10) * mag));
}
function intTicks(lo: number, hi: number, step: number): number[] | null {
  const out: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) {
    out.push(t);
    if (out.length > MAX_TICKS) return null;
  }
  return out;
}
const range = (v: unknown): [number, number] | null => {
  if (v === undefined || v === null) return PLANE_DEFAULT_RANGE;
  return Array.isArray(v) && v.length === 2 && isNum(v[0]) && isNum(v[1]) && v[0] < v[1] ? [v[0], v[1]] : null;
};
const arrowHead = (x1: number, y1: number, x2: number, y2: number, c: string) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 9, w = 0.45;
  return `<path d="M ${fmt(x2)} ${fmt(y2)} L ${fmt(x2 - L * Math.cos(a - w))} ${fmt(y2 - L * Math.sin(a - w))} L ${fmt(x2 - L * Math.cos(a + w))} ${fmt(y2 - L * Math.sin(a + w))} Z" fill="${c}"></path>`;
};

export function coordinatePlaneToSvg(fig: Plane): string | null {
  try {
    const f = fig as unknown as Obj;
    const xr = range(f.xRange), yr = range(f.yRange);
    if (!xr || !yr) return null;
    const points = list(f.points, PLANE_MAX_POINTS), segments = list(f.segments, PLANE_MAX_SEGMENTS), vectors = list(f.vectors, PLANE_MAX_VECTORS);
    if (!points || !segments || !vectors) return null;
    const pts = points.map((raw) => { const p = xy(raw); return p && { ...p, label: str(obj(raw)!.label), color: obj(raw)!.color }; });
    const segs = segments.map((raw) => { const s = obj(raw); const a = xy(s?.from), b = xy(s?.to); return s && a && b ? { a, b, label: str(s.label), color: s.color, dashed: s.dashed === true, arrow: s.arrow === true } : null; });
    const vecs = vectors.map((raw) => { const v = obj(raw); const b = xy(v?.to); const a = v?.from === undefined ? { x: 0, y: 0 } : xy(v.from); return v && a && b ? { a, b, label: str(v.label), color: v.color } : null; });
    if (pts.some((p) => !p) || segs.some((s) => !s) || vecs.some((v) => !v)) return null;

    const title = str(f.title);
    const pad = { top: title ? 36 : 20, bottom: 24, left: 32, right: 20 };
    const plotW = PW - pad.left - pad.right, plotH = PH - pad.top - pad.bottom;
    const [xMin, xMax] = xr, [yMin, yMax] = yr;
    const sx = (x: number) => pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
    const sy = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;
    const xTicks = intTicks(xMin, xMax, niceIntStep(xMax - xMin)), yTicks = intTicks(yMin, yMax, niceIntStep(yMax - yMin));
    if (!xTicks || !yTicks) return null;
    const out: string[] = [];
    if (title) out.push(`<text x="${PW / 2}" y="22" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(clip(title, 60))}</text>`);
    if (f.showGrid !== false) {
      for (const t of xTicks) out.push(`<line x1="${fmt(sx(t))}" y1="${pad.top}" x2="${fmt(sx(t))}" y2="${fmt(pad.top + plotH)}" stroke="${C.grid}" stroke-width="0.5"></line>`);
      for (const t of yTicks) out.push(`<line x1="${pad.left}" y1="${fmt(sy(t))}" x2="${fmt(pad.left + plotW)}" y2="${fmt(sy(t))}" stroke="${C.grid}" stroke-width="0.5"></line>`);
    }
    const axisY = yMin <= 0 && yMax >= 0 ? sy(0) : pad.top + plotH;
    const axisX = xMin <= 0 && xMax >= 0 ? sx(0) : pad.left;
    out.push(`<line x1="${pad.left}" y1="${fmt(axisY)}" x2="${fmt(pad.left + plotW)}" y2="${fmt(axisY)}" stroke="${C.axis}" stroke-width="1.25"></line>`);
    out.push(`<line x1="${fmt(axisX)}" y1="${pad.top}" x2="${fmt(axisX)}" y2="${fmt(pad.top + plotH)}" stroke="${C.axis}" stroke-width="1.25"></line>`);
    out.push(`<text x="${fmt(pad.left + plotW - 2)}" y="${fmt(axisY - 4)}" font-size="11" fill="${C.axis}" text-anchor="end">${esc(clip(str(f.xLabel) || 'x', 24))}</text>`);
    out.push(`<text x="${fmt(axisX + 4)}" y="${pad.top + 10}" font-size="11" fill="${C.axis}">${esc(clip(str(f.yLabel) || 'y', 24))}</text>`);
    for (const t of xTicks) if (t !== 0) out.push(`<text x="${fmt(sx(t))}" y="${fmt(axisY + 12)}" font-size="9" fill="${C.muted}" text-anchor="middle">${t}</text>`);
    for (const t of yTicks) if (t !== 0) out.push(`<text x="${fmt(axisX - 4)}" y="${fmt(sy(t) + 3)}" font-size="9" fill="${C.muted}" text-anchor="end">${t}</text>`);
    segs.forEach((s, i) => {
      const { a, b } = s!;
      const c = color(s!.color, C.cycle[i % C.cycle.length]);
      const x1 = sx(a.x), y1 = sy(a.y), x2 = sx(b.x), y2 = sy(b.y);
      out.push(`<g data-segment="${i}"><line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${c}" stroke-width="2"${s!.dashed ? ' stroke-dasharray="6 4"' : ''}></line>`
        + (s!.arrow ? arrowHead(x1, y1, x2, y2, c) : '')
        + (s!.label ? `<text x="${fmt((x1 + x2) / 2)}" y="${fmt((y1 + y2) / 2 - 6)}" font-size="11" fill="${c}" text-anchor="middle" font-weight="600">${esc(clip(s!.label, 24))}</text>` : '')
        + '</g>');
    });
    vecs.forEach((v, i) => {
      const { a, b } = v!;
      const c = color(v!.color, C.primary);
      const x1 = sx(a.x), y1 = sy(a.y), x2 = sx(b.x), y2 = sy(b.y);
      out.push(`<g data-vector="${i}"><line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${c}" stroke-width="2.5"></line>${arrowHead(x1, y1, x2, y2, c)}`
        + (v!.label ? `<text x="${fmt(x2 + 6)}" y="${fmt(y2 - 4)}" font-size="12" fill="${c}" font-weight="700">${esc(clip(v!.label, 24))}</text>` : '')
        + '</g>');
    });
    const corners = [{ dx: 6, dy: -6, anchor: 'start' }, { dx: -6, dy: -6, anchor: 'end' }, { dx: 6, dy: 12, anchor: 'start' }, { dx: -6, dy: 12, anchor: 'end' }];
    pts.forEach((p, i) => {
      const cx = sx(p!.x), cy = sy(p!.y), k = corners[i % corners.length];
      out.push(`<g data-point="${i}"><circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="4" fill="${color(p!.color, C.secondary)}" stroke="white" stroke-width="1.5"></circle>`
        + (p!.label ? `<text x="${fmt(cx + k.dx)}" y="${fmt(cy + k.dy)}" font-size="11" fill="${C.text}" font-weight="600" text-anchor="${k.anchor}">${esc(clip(p!.label, 24))}</text>` : '')
        + '</g>');
    });
    return svgDoc(PW, PH, out);
  } catch {
    return null;
  }
}

// CatalogInequalityGraphRenderer: 600 × 140, the span around the value, integer ticks.
const IW = 600, IH = 140, IPAD = 50, RED = '#dc2626', INK = '#1f2937';

export function inequalityToSvg(fig: DiagramFigure): string | null {
  try {
    const p = obj((fig as unknown as Obj).params);
    if (!p) return null;
    const op = p.operator, value = p.value;
    if ((op !== '<' && op !== '>' && op !== '<=' && op !== '>=') || !isNum(value) || Math.abs(value) > 1e6) return null;
    const variable = typeof p.variable === 'string' ? p.variable : 'x';
    const title = str(p.title);
    const top = title ? 28 : 0;
    const cy = top + IH / 2;
    const span = Math.max(Math.abs(value) * 2 + 6, 10);
    const lo = value - span / 2;
    const usableW = IW - IPAD * 2;
    const xOf = (v: number) => IPAD + ((v - lo) / span) * usableW;
    const step = Math.max(1, Math.ceil(span / 60));
    const ticks: number[] = [];
    for (let v = Math.ceil((lo) / step) * step; v <= Math.ceil(lo + span); v += step) ticks.push(v);
    const closed = op === '<=' || op === '>=';
    const right = op === '>' || op === '>=';
    const vx = xOf(value);
    const rayEnd = right ? IW - IPAD + 12 : IPAD - 12;
    const out: string[] = [];
    if (title) out.push(`<text x="${IW / 2}" y="20" text-anchor="middle" font-size="15" font-weight="600" fill="${INK}">${esc(clip(title, 60))}</text>`);
    out.push(`<line x1="${IPAD - 12}" y1="${fmt(cy)}" x2="${IW - IPAD + 12}" y2="${fmt(cy)}" stroke="${INK}" stroke-width="2"></line>`);
    out.push(`<path d="M ${IPAD - 12} ${fmt(cy)} L ${IPAD - 4} ${fmt(cy - 5)} L ${IPAD - 4} ${fmt(cy + 5)} Z" fill="${INK}"></path>`);
    out.push(`<path d="M ${IW - IPAD + 12} ${fmt(cy)} L ${IW - IPAD + 4} ${fmt(cy - 5)} L ${IW - IPAD + 4} ${fmt(cy + 5)} Z" fill="${INK}"></path>`);
    for (const t of ticks) {
      const x = xOf(t);
      if (x < IPAD - 12 || x > IW - IPAD + 12) continue;
      out.push(`<line x1="${fmt(x)}" y1="${fmt(cy - 6)}" x2="${fmt(x)}" y2="${fmt(cy + 6)}" stroke="${INK}" stroke-width="1.5"></line><text x="${fmt(x)}" y="${fmt(cy + 22)}" font-size="12" text-anchor="middle" fill="#374151">${t}</text>`);
    }
    out.push(`<line data-ray="${right ? 'right' : 'left'}" x1="${fmt(vx)}" y1="${fmt(cy)}" x2="${fmt(rayEnd)}" y2="${fmt(cy)}" stroke="${RED}" stroke-width="4"></line>`);
    out.push(`<circle data-endpoint="${closed ? 'closed' : 'open'}" cx="${fmt(vx)}" cy="${fmt(cy)}" r="7" fill="${closed ? RED : '#fff'}" stroke="${RED}" stroke-width="2.5"></circle>`);
    out.push(`<text x="${IW / 2}" y="${fmt(top + IH - 14)}" font-size="14" text-anchor="middle" fill="#374151" font-weight="600">${esc(clip(`${variable} ${op} ${value}`, 40))}</text>`);
    return svgDoc(IW, top + IH, out);
  } catch {
    return null;
  }
}

// CatalogCoordinateGridRenderer: a 460 × 460 plot, its margins and colours.
const GM = { left: 44, right: 24, top: 20, bottom: 40 }, GP = 460;
const FAINT = '#cbd5e1', SLATE = '#475569';
const POINT_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#7c3aed', '#d97706'];
const GRID_MAX_SPAN = 30;

/** The grid's bounds as the catalog solver fits them (quadrant detection, auto-fit, the 30-unit clamp). */
function gridBounds(p: Obj, points: XY[]): { xMin: number; xMax: number; yMin: number; yMax: number; quadrants: 1 | 4 } {
  const hasNeg = points.some((q) => q.x < 0 || q.y < 0);
  const quadrants: 1 | 4 = hasNeg ? 4 : p.quadrants === 4 || p.quadrants === '4' ? 4 : 1;
  const xs = points.map((q) => q.x), ys = points.map((q) => q.y);
  const dx = xs.length ? Math.max(...xs) : 5, dy = ys.length ? Math.max(...ys) : 5;
  const nx = xs.length ? Math.min(...xs) : 0, ny = ys.length ? Math.min(...ys) : 0;
  let xMax = isNum(p.xMax) ? Math.round(p.xMax) : Math.max(1, Math.ceil(dx + 1));
  let yMax = isNum(p.yMax) ? Math.round(p.yMax) : Math.max(1, Math.ceil(dy + 1));
  let xMin = 0, yMin = 0;
  if (quadrants === 4) {
    xMin = isNum(p.xMin) ? Math.round(p.xMin) : Math.min(-1, Math.floor(nx - 1));
    yMin = isNum(p.yMin) ? Math.round(p.yMin) : Math.min(-1, Math.floor(ny - 1));
    xMax = Math.max(xMax, 1); yMax = Math.max(yMax, 1);
  }
  if (xMax <= xMin) xMax = xMin + 1;
  if (yMax <= yMin) yMax = yMin + 1;
  if (xMax - xMin > GRID_MAX_SPAN) xMax = xMin + GRID_MAX_SPAN;
  if (yMax - yMin > GRID_MAX_SPAN) yMax = yMin + GRID_MAX_SPAN;
  return { xMin, xMax, yMin, yMax, quadrants };
}

export function coordinateGridToSvg(fig: DiagramFigure): string | null {
  try {
    const p = obj((fig as unknown as Obj).params) ?? {};
    const raw = list(p.points, GRID_MAX_POINTS);
    if (!raw) return null;
    const pts = raw.map((r) => { const q = xy(r); return q && { ...q, label: str(obj(r)!.label), color: obj(r)!.color }; });
    if (pts.some((q) => !q)) return null;
    const points = pts as Array<XY & { label: string; color: unknown }>;
    const { xMin, xMax, yMin, yMax, quadrants } = gridBounds(p, points);
    const title = str(p.title);
    const top = GM.top + (title ? 28 : 0);
    const W = GM.left + GP + GM.right, H = top + GP + GM.bottom;
    const px = (x: number) => GM.left + ((x - xMin) / (xMax - xMin)) * GP;
    const py = (y: number) => top + (1 - (y - yMin) / (yMax - yMin)) * GP;
    const axisY = py(Math.min(Math.max(0, yMin), yMax)), axisX = px(Math.min(Math.max(0, xMin), xMax));
    const step = Math.max(1, Math.ceil(Math.max(xMax - xMin, yMax - yMin) / 20));
    const xTicks = intTicks(xMin, xMax, step), yTicks = intTicks(yMin, yMax, step);
    if (!xTicks || !yTicks) return null;
    const out: string[] = [];
    if (title) out.push(`<text x="${fmt(W / 2)}" y="24" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(clip(title, 60))}</text>`);
    for (const x of xTicks) if (x !== 0) out.push(`<line x1="${fmt(px(x))}" y1="${top}" x2="${fmt(px(x))}" y2="${top + GP}" stroke="${FAINT}" stroke-width="1"></line>`);
    for (const y of yTicks) if (y !== 0) out.push(`<line x1="${GM.left}" y1="${fmt(py(y))}" x2="${GM.left + GP}" y2="${fmt(py(y))}" stroke="${FAINT}" stroke-width="1"></line>`);
    out.push(`<rect x="${GM.left}" y="${top}" width="${GP}" height="${GP}" fill="none" stroke="${FAINT}" stroke-width="1"></rect>`);
    out.push(`<line x1="${GM.left}" y1="${fmt(axisY)}" x2="${GM.left + GP}" y2="${fmt(axisY)}" stroke="${SLATE}" stroke-width="2.5"></line>`);
    out.push(`<line x1="${fmt(axisX)}" y1="${top + GP}" x2="${fmt(axisX)}" y2="${top}" stroke="${SLATE}" stroke-width="2.5"></line>`);
    out.push(`<text x="${GM.left + GP + 4}" y="${fmt(axisY - 9)}" text-anchor="middle" font-size="15" font-style="italic" fill="${SLATE}">x</text>`);
    out.push(`<text x="${fmt(axisX + 8)}" y="${top + 4}" font-size="15" font-style="italic" fill="${SLATE}">y</text>`);
    for (const x of xTicks) if (x !== 0) out.push(`<text x="${fmt(px(x))}" y="${fmt(axisY + 16)}" text-anchor="middle" font-size="12" fill="${SLATE}">${x}</text>`);
    for (const y of yTicks) if (y !== 0) out.push(`<text x="${fmt(axisX - 8)}" y="${fmt(py(y) + 4)}" text-anchor="end" font-size="12" fill="${SLATE}">${y}</text>`);
    if (xMin <= 0 && yMin <= 0) out.push(`<text x="${fmt(axisX - 6)}" y="${fmt(axisY + 16)}" text-anchor="end" font-size="12" fill="${SLATE}">${quadrants === 1 ? '0' : 'O'}</text>`);
    if (p.connect === true && points.length >= 2) {
      out.push(`<polyline points="${points.map((q) => `${fmt(px(q.x))},${fmt(py(q.y))}`).join(' ')}" fill="none" stroke="${SLATE}" stroke-width="2" stroke-dasharray="6 4"></polyline>`);
    }
    points.forEach((q, i) => {
      const cx = px(q.x), cy = py(q.y);
      const c = color(q.color, POINT_COLORS[i % POINT_COLORS.length]);
      const nm = clip(q.label || `(${q.x}, ${q.y})`, 24);
      const lw = nm.length * 14 * 0.55;
      const flipX = cx + 8 + lw > W - 3, flipY = cy < top + 24;
      const lx = flipX ? Math.min(W - 3, Math.max(cx - 8, 3 + lw)) : Math.max(3, Math.min(cx + 8, W - 3 - lw));
      out.push(`<g data-point="${i}"><circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="5.5" fill="${c}" stroke="#fff" stroke-width="1.5"></circle>`
        + `<text x="${fmt(lx)}" y="${fmt(flipY ? cy + 18 : cy - 10)}" text-anchor="${flipX ? 'end' : 'start'}" font-size="14" font-weight="700" fill="${c}">${esc(nm)}</text></g>`);
    });
    return svgDoc(W, H, out);
  } catch {
    return null;
  }
}
