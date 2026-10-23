/**
 * Static SVG thumbnails of the stats-family homework figures (box plot,
 * histogram, dot plot, bar, pie) and of scatter plots, for the homework
 * list (spec 2026-10-21 §4.6 option (b)). The board draws these with
 * StatsRenderer / ScatterPlotRenderer, which use hooks and cannot be rendered
 * here (GAC freeze: the live renderers are not refactored); this is one small
 * hand-written writer in the board's DIAGRAM_COLORS: one scaled axis, then
 * bars, boxes, dots or wedges. A thumbnail is a 112×80 px preview, not the
 * board's exact look. Draws only what the figure states (no computed
 * statistic, percentage or trend line). Never throws: anything it cannot draw
 * gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { clip, esc, fmt, isNum, niceStep, num, svgDoc, ticks } from './svg-util';
import type { FigureCommand, StatsFigure } from './types';

type Scatter = Extract<FigureCommand, { action: 'showScatterPlot' }>;

const W = 350, H = 250;

interface Frame { l: number; r: number; t: number; b: number }

function frame(title: unknown, yLabel: unknown, xLabel: unknown, l = 40): Frame {
  return { l: l + (yLabel ? 14 : 0), r: W - 14, t: title ? 30 : 14, b: H - (xLabel ? 40 : 26) };
}

function titleText(title: unknown): string {
  return title ? `<text x="${W / 2}" y="19" text-anchor="middle" font-size="14" font-weight="600" fill="${C.text}">${esc(clip(title, 44))}</text>` : '';
}

function axisLabels(f: Frame, xLabel: unknown, yLabel: unknown): string {
  let s = '';
  if (xLabel) s += `<text x="${fmt((f.l + f.r) / 2)}" y="${H - 8}" text-anchor="middle" font-size="12" fill="${C.muted}">${esc(clip(xLabel, 44))}</text>`;
  if (yLabel) s += `<text x="12" y="${fmt((f.t + f.b) / 2)}" text-anchor="middle" font-size="12" fill="${C.muted}" transform="rotate(-90 12 ${fmt((f.t + f.b) / 2)})">${esc(clip(yLabel, 30))}</text>`;
  return s;
}

/** A padded, tick-aligned range covering [lo, hi]. */
function range(lo: number, hi: number, count = 6, fromZero = false): { lo: number; hi: number; step: number } {
  if (fromZero) lo = Math.min(0, lo);
  if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
  const step = niceStep(hi - lo, count);
  return { lo: Math.floor(lo / step + 1e-9) * step, hi: Math.ceil(hi / step - 1e-9) * step, step };
}

/** Horizontal value axis along y = `y`, ticks labelled below. */
function xAxis(f: Frame, y: number, lo: number, hi: number, step: number, sx: (v: number) => number, at?: number[]): string {
  let s = `<line x1="${fmt(f.l)}" y1="${fmt(y)}" x2="${fmt(f.r)}" y2="${fmt(y)}" stroke="${C.axis}" stroke-width="1.5"></line>`;
  for (const v of at ?? ticks(lo, hi, step)) {
    const px = sx(v);
    s += `<line x1="${fmt(px)}" y1="${fmt(y)}" x2="${fmt(px)}" y2="${fmt(y + 5)}" stroke="${C.axis}" stroke-width="1"></line>`;
    s += `<text x="${fmt(px)}" y="${fmt(y + 17)}" text-anchor="middle" font-size="11" fill="${C.muted}">${esc(num(v))}</text>`;
  }
  return s;
}

/** Vertical value axis at x = f.l with light grid lines. */
function yAxis(f: Frame, lo: number, hi: number, step: number, sy: (v: number) => number): string {
  let s = '';
  for (const v of ticks(lo, hi, step)) {
    const py = sy(v);
    s += `<line x1="${fmt(f.l)}" y1="${fmt(py)}" x2="${fmt(f.r)}" y2="${fmt(py)}" stroke="${C.grid}" stroke-width="1"></line>`;
    s += `<text x="${fmt(f.l - 5)}" y="${fmt(py + 4)}" text-anchor="end" font-size="11" fill="${C.muted}">${esc(num(v))}</text>`;
  }
  return s + `<line x1="${fmt(f.l)}" y1="${fmt(f.t)}" x2="${fmt(f.l)}" y2="${fmt(f.b)}" stroke="${C.axis}" stroke-width="1.5"></line>`;
}

function boxplot(fig: StatsFigure): string | null {
  const sets = fig.boxplot?.datasets;
  if (!Array.isArray(sets) || !sets.length || sets.length > 8) return null;
  const five = ['min', 'q1', 'median', 'q3', 'max'] as const;
  for (const d of sets) {
    if (!d || !five.every((k) => isNum(d[k]))) return null;
    if (!(d.min <= d.q1 && d.q1 <= d.median && d.median <= d.q3 && d.q3 <= d.max)) return null;
    if (d.outliers !== undefined && (!Array.isArray(d.outliers) || !d.outliers.every(isNum))) return null;
  }
  const all = sets.flatMap((d) => [d.min, d.max, ...(d.outliers ?? [])]);
  const labelled = sets.some((d) => typeof d.label === 'string' && d.label.trim());
  const f = frame(fig.title, null, fig.xLabel, labelled ? 70 : 16);
  const rg = range(Math.min(...all), Math.max(...all), 7);
  const sx = (v: number) => f.l + ((v - rg.lo) / (rg.hi - rg.lo)) * (f.r - f.l);
  const axisY = f.b - 6;
  const rowH = (axisY - f.t) / sets.length;
  const boxH = Math.min(46, rowH * 0.55);
  const out: string[] = [titleText(fig.title)];
  sets.forEach((d, i) => {
    const color = C.cycle[i % C.cycle.length];
    const cy = f.t + rowH * (i + 0.5);
    const top = cy - boxH / 2, bot = cy + boxH / 2;
    out.push(`<g data-box="${i}">`);
    out.push(`<line x1="${fmt(sx(d.min))}" y1="${fmt(cy)}" x2="${fmt(sx(d.q1))}" y2="${fmt(cy)}" stroke="${C.text}" stroke-width="1.5"></line>`);
    out.push(`<line x1="${fmt(sx(d.q3))}" y1="${fmt(cy)}" x2="${fmt(sx(d.max))}" y2="${fmt(cy)}" stroke="${C.text}" stroke-width="1.5"></line>`);
    for (const v of [d.min, d.max]) out.push(`<line x1="${fmt(sx(v))}" y1="${fmt(cy - boxH / 4)}" x2="${fmt(sx(v))}" y2="${fmt(cy + boxH / 4)}" stroke="${C.text}" stroke-width="1.5"></line>`);
    out.push(`<rect x="${fmt(sx(d.q1))}" y="${fmt(top)}" width="${fmt(Math.max(1, sx(d.q3) - sx(d.q1)))}" height="${fmt(boxH)}" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"></rect>`);
    out.push(`<line x1="${fmt(sx(d.median))}" y1="${fmt(top)}" x2="${fmt(sx(d.median))}" y2="${fmt(bot)}" stroke="${color}" stroke-width="2.5"></line>`);
    for (const o of d.outliers ?? []) out.push(`<path d="M ${fmt(sx(o) - 4)} ${fmt(cy - 4)} L ${fmt(sx(o) + 4)} ${fmt(cy + 4)} M ${fmt(sx(o) - 4)} ${fmt(cy + 4)} L ${fmt(sx(o) + 4)} ${fmt(cy - 4)}" stroke="${color}" stroke-width="1.5"></path>`);
    if (labelled && d.label) out.push(`<text x="${fmt(f.l - 6)}" y="${fmt(cy + 4)}" text-anchor="end" font-size="11" fill="${C.text}">${esc(clip(d.label, 10))}</text>`);
    out.push('</g>');
  });
  out.push(xAxis(f, axisY, rg.lo, rg.hi, rg.step, sx), axisLabels(f, fig.xLabel, null));
  return svgDoc(W, H, out);
}

function histogram(fig: StatsFigure): string | null {
  const bins = fig.bins;
  if (!Array.isArray(bins) || !bins.length || bins.length > 60) return null;
  for (const b of bins) if (!Array.isArray(b) || b.length < 3 || !b.every(isNum) || !(b[0] < b[1]) || b[2] < 0) return null;
  const lo = Math.min(...bins.map((b) => b[0])), hi = Math.max(...bins.map((b) => b[1]));
  const f = frame(fig.title, fig.yLabel, fig.xLabel);
  const ry = range(0, Math.max(...bins.map((b) => b[2])), 5, true);
  const sx = (v: number) => f.l + 4 + ((v - lo) / (hi - lo)) * (f.r - f.l - 8);
  const sy = (v: number) => f.b - ((v - ry.lo) / (ry.hi - ry.lo)) * (f.b - f.t);
  const out: string[] = [titleText(fig.title), yAxis(f, ry.lo, ry.hi, ry.step, sy)];
  bins.forEach((b, i) => {
    out.push(`<rect data-bar="${i}" x="${fmt(sx(b[0]))}" y="${fmt(sy(b[2]))}" width="${fmt(sx(b[1]) - sx(b[0]))}" height="${fmt(sy(0) - sy(b[2]))}" fill="${C.primary}" fill-opacity="0.75" stroke="${C.white}" stroke-width="1"></rect>`);
    if (fig.showCounts) out.push(`<text x="${fmt((sx(b[0]) + sx(b[1])) / 2)}" y="${fmt(sy(b[2]) - 4)}" text-anchor="middle" font-size="11" fill="${C.text}">${esc(num(b[2]))}</text>`);
  });
  const edges = [...new Set(bins.flatMap((b) => [b[0], b[1]]))].sort((a, b) => a - b);
  const at = edges.length <= 12 ? edges : ticks(lo, hi, niceStep(hi - lo, 6));
  out.push(xAxis(f, f.b, lo, hi, 1, sx, at), axisLabels(f, fig.xLabel, fig.yLabel));
  return svgDoc(W, H, out);
}

function dotplot(fig: StatsFigure): string | null {
  const data = fig.data;
  if (!Array.isArray(data) || !data.length || data.length > 400 || !data.every(isNum)) return null;
  const counts = new Map<number, number>();
  for (const v of data) counts.set(v, (counts.get(v) ?? 0) + 1);
  const lo = Math.min(...data), hi = Math.max(...data);
  const ints = data.every(Number.isInteger) && hi - lo <= 24;
  const rg = ints ? { lo: lo - 1, hi: hi + 1, step: 1 } : range(lo, hi, 7);
  const f = frame(fig.title, null, fig.xLabel, 16);
  const sx = (v: number) => f.l + ((v - rg.lo) / (rg.hi - rg.lo)) * (f.r - f.l);
  const axisY = f.b - 4;
  const maxStack = Math.max(...counts.values());
  const gap = ints ? (f.r - f.l) / (rg.hi - rg.lo) : 16;
  const r = Math.max(1.5, Math.min(8, gap / 2.4, (axisY - f.t - 6) / (2 * maxStack + 1)));
  const out: string[] = [titleText(fig.title)];
  for (const [v, n] of [...counts.entries()].sort((a, b) => a[0] - b[0])) {
    for (let k = 0; k < n; k++) out.push(`<circle cx="${fmt(sx(v))}" cy="${fmt(axisY - r * (2 * k + 1.4))}" r="${fmt(r)}" fill="${C.primary}"></circle>`);
  }
  out.push(xAxis(f, axisY, rg.lo, rg.hi, rg.step, sx), axisLabels(f, fig.xLabel, null));
  return svgDoc(W, H, out);
}

function bar(fig: StatsFigure): string | null {
  const cats = fig.bar?.categories, vals = fig.bar?.values;
  if (!Array.isArray(cats) || !Array.isArray(vals) || !cats.length || cats.length !== vals.length || cats.length > 40 || !vals.every(isNum)) return null;
  const f = frame(fig.title, fig.yLabel, fig.xLabel);
  const ry = range(Math.min(0, ...vals), Math.max(0, ...vals), 5, true);
  const sy = (v: number) => f.b - ((v - ry.lo) / (ry.hi - ry.lo)) * (f.b - f.t);
  const slot = (f.r - f.l) / cats.length;
  const out: string[] = [titleText(fig.title), yAxis(f, ry.lo, ry.hi, ry.step, sy)];
  const maxChars = Math.max(3, Math.floor(slot / 6.5));
  cats.forEach((c, i) => {
    const x = f.l + slot * i + slot * 0.18, w = slot * 0.64;
    const y0 = sy(0), y1 = sy(vals[i]);
    out.push(`<rect data-bar="${i}" x="${fmt(x)}" y="${fmt(Math.min(y0, y1))}" width="${fmt(w)}" height="${fmt(Math.abs(y0 - y1))}" fill="${C.cycle[i % C.cycle.length]}" fill-opacity="0.8"></rect>`);
    out.push(`<text x="${fmt(x + w / 2)}" y="${fmt(f.b + 15)}" text-anchor="middle" font-size="11" fill="${C.text}">${esc(clip(c, maxChars))}</text>`);
  });
  out.push(`<line x1="${fmt(f.l)}" y1="${fmt(sy(0))}" x2="${fmt(f.r)}" y2="${fmt(sy(0))}" stroke="${C.axis}" stroke-width="1.5"></line>`);
  out.push(axisLabels(f, fig.xLabel, fig.yLabel));
  return svgDoc(W, H, out);
}

function pie(fig: StatsFigure): string | null {
  const slices = fig.pie?.slices;
  if (!Array.isArray(slices) || !slices.length || slices.length > 24) return null;
  if (!slices.every((s) => s && isNum(s.value) && s.value > 0)) return null;
  const total = slices.reduce((a, s) => a + s.value, 0);
  const top = fig.title ? 30 : 12;
  const cx = W / 2, cy = top + (H - top - 12) / 2, r = (H - top - 12) / 2 - 16;
  const out: string[] = [titleText(fig.title)];
  let a = -Math.PI / 2;
  slices.forEach((s, i) => {
    const color = C.cycle[i % C.cycle.length];
    const sweep = (s.value / total) * 2 * Math.PI;
    if (slices.length === 1) {
      out.push(`<circle data-wedge="0" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="${color}" fill-opacity="0.8" stroke="${C.white}" stroke-width="1.5"></circle>`);
    } else {
      const x0 = cx + r * Math.cos(a), y0 = cy + r * Math.sin(a);
      const x1 = cx + r * Math.cos(a + sweep), y1 = cy + r * Math.sin(a + sweep);
      out.push(`<path data-wedge="${i}" d="M ${fmt(cx)} ${fmt(cy)} L ${fmt(x0)} ${fmt(y0)} A ${fmt(r)} ${fmt(r)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${fmt(x1)} ${fmt(y1)} Z" fill="${color}" fill-opacity="0.8" stroke="${C.white}" stroke-width="1.5"></path>`);
    }
    const mid = a + sweep / 2;
    const lx = cx + (r + 8) * Math.cos(mid), ly = cy + (r + 8) * Math.sin(mid);
    if (s.label) out.push(`<text x="${fmt(lx)}" y="${fmt(ly + 4)}" text-anchor="${Math.cos(mid) > 0.2 ? 'start' : Math.cos(mid) < -0.2 ? 'end' : 'middle'}" font-size="11" fill="${C.text}">${esc(clip(s.label, 14))}</text>`);
    a += sweep;
  });
  return svgDoc(W, H, out);
}

function scatter(fig: Scatter): string | null {
  const pts = fig.points;
  if (!Array.isArray(pts) || !pts.length || pts.length > 500 || !pts.every((p) => p && isNum(p.x) && isNum(p.y))) return null;
  const given = (r: unknown): r is [number, number] => Array.isArray(r) && r.length === 2 && isNum(r[0]) && isNum(r[1]) && r[0] < r[1];
  // Without a stated range, the data extent padded by 8 % so no dot sits on an axis.
  const padded = (v: number[], count: number) => {
    const lo = Math.min(...v), hi = Math.max(...v), pad = (hi - lo || 1) * 0.08;
    return range(lo - pad, hi + pad, count);
  };
  const rx = given(fig.xRange) ? { lo: fig.xRange[0], hi: fig.xRange[1], step: niceStep(fig.xRange[1] - fig.xRange[0]) } : padded(pts.map((p) => p.x), 6);
  const ry = given(fig.yRange) ? { lo: fig.yRange[0], hi: fig.yRange[1], step: niceStep(fig.yRange[1] - fig.yRange[0], 5) } : padded(pts.map((p) => p.y), 5);
  const f = frame(fig.title, fig.yLabel, fig.xLabel);
  const sx = (v: number) => f.l + ((v - rx.lo) / (rx.hi - rx.lo)) * (f.r - f.l);
  const sy = (v: number) => f.b - ((v - ry.lo) / (ry.hi - ry.lo)) * (f.b - f.t);
  const series = [...new Set(pts.map((p) => p.series ?? ''))];
  const out: string[] = [titleText(fig.title), yAxis(f, ry.lo, ry.hi, ry.step, sy), xAxis(f, f.b, rx.lo, rx.hi, rx.step, sx)];
  for (const p of pts) {
    out.push(`<circle cx="${fmt(sx(p.x))}" cy="${fmt(sy(p.y))}" r="4" fill="${C.cycle[series.indexOf(p.series ?? '') % C.cycle.length]}"></circle>`);
    if (p.label) out.push(`<text x="${fmt(sx(p.x) + 6)}" y="${fmt(sy(p.y) - 6)}" font-size="10" fill="${C.text}">${esc(clip(p.label, 12))}</text>`);
  }
  out.push(axisLabels(f, fig.xLabel, fig.yLabel));
  return svgDoc(W, H, out);
}

export function statsToSvg(fig: StatsFigure | Scatter): string | null {
  try {
    if (!fig || typeof fig !== 'object') return null;
    if (fig.action === 'showScatterPlot') return scatter(fig);
    switch (fig.type) {
      case 'boxplot': return boxplot(fig);
      case 'histogram': return histogram(fig);
      case 'dotplot': return dotplot(fig);
      case 'bar': return bar(fig);
      case 'pie': return pie(fig);
      default: return null;
    }
  } catch {
    return null;
  }
}
