/**
 * A static SVG of a homework graph figure (showGraph) for the list's
 * thumbnails (GAC acceptance 2026-10-21: a graph problem showed "Figure
 * ready" where the others showed their figure). The board draws graphs with
 * Desmos, which only runs in a browser; this draws the same data — axes with
 * ticks (π ticks labelled π/4, π/2, …), the sampled curves and the points —
 * on the geometry renderer's 500×400 canvas. Never throws.
 */

import type { GraphData } from '@core/knowledge/types';
import { isPiStep, labelPiTick, parseAxisStep } from '../whiteboard/graph-axis';
import { parseFunctionString } from '../whiteboard/math-expr';
import { explicitFunctionSource, functionSourceOf } from './figure-validate';

const W = 500, H = 400;
const M = { l: 44, r: 16, t: 16, b: 34 };
const SAMPLES = 320;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n: number) => (Math.abs(n) < 1e-9 ? '0' : String(Number(n.toFixed(4))));

/** A tick step of 1, 2 or 5 × 10^k giving about eight ticks across the span. */
function niceStep(span: number): number {
  const raw = Math.abs(span) / 8 || 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const k = raw / p;
  return (k < 1.5 ? 1 : k < 3.5 ? 2 : k < 7.5 ? 5 : 10) * p;
}

function tickLabel(value: number, step: number, pi: boolean): string {
  if (pi) return labelPiTick(value, step);
  const v = Number(value.toFixed(6));
  return Number.isInteger(v) ? String(v) : String(v).replace(/^-/, '−');
}

export function graphToSvg(data: GraphData | null | undefined): string | null {
  try {
    if (!data || !Array.isArray(data.xRange) || !Array.isArray(data.yRange)) return null;
    const [x0, x1] = data.xRange.map(Number) as [number, number];
    const [y0, y1] = data.yRange.map(Number) as [number, number];
    if (![x0, x1, y0, y1].every(Number.isFinite) || x1 <= x0 || y1 <= y0) return null;
    const sx = (x: number) => M.l + ((x - x0) / (x1 - x0)) * (W - M.l - M.r);
    const sy = (y: number) => H - M.b - ((y - y0) / (y1 - y0)) * (H - M.t - M.b);
    const out: string[] = [];
    out.push(`<rect width="${W}" height="${H}" fill="#fafbfc" rx="4"></rect>`);

    const xStep = parseAxisStep(data.xAxisStep) ?? niceStep(x1 - x0);
    const yStep = parseAxisStep(data.yAxisStep) ?? niceStep(y1 - y0);
    const xPi = isPiStep(xStep), yPi = isPiStep(yStep);
    const axisY = y0 <= 0 && y1 >= 0 ? sy(0) : sy(y0);
    const axisX = x0 <= 0 && x1 >= 0 ? sx(0) : sx(x0);
    // Grid + ticks
    for (let x = Math.ceil(x0 / xStep - 1e-9) * xStep; x <= x1 + 1e-9; x += xStep) {
      const px = sx(x);
      out.push(`<line x1="${fmt(px)}" y1="${M.t}" x2="${fmt(px)}" y2="${H - M.b}" stroke="#e5e7eb" stroke-width="1"></line>`);
      if (Math.abs(x) > 1e-9 || !(x0 <= 0 && x1 >= 0)) out.push(`<text x="${fmt(px)}" y="${fmt(axisY + 14)}" text-anchor="middle" font-size="11" fill="#6b7280">${esc(tickLabel(x, xStep, xPi))}</text>`);
    }
    const yTicks: number[] = [];
    for (let y = Math.ceil(y0 / yStep - 1e-9) * yStep; y <= y1 + 1e-9; y += yStep) yTicks.push(y);
    // 2026-10-22 (hw-14 p8, F8): with xRange [0, 360] the y-axis sits on the
    // plot's left edge (M.l), and labels right-aligned at axisX − 6 fell
    // outside the clip rect and vanished. When the widest label (≈ 7 px per
    // character) does not fit left of the axis, the labels go right of it,
    // left-aligned. Chosen over widening M.l: the clip rect starts at M.l, so a
    // wider margin would still clip them, and every other graph keeps its
    // layout unchanged.
    const yLabelWidth = Math.max(0, ...yTicks.filter((y) => Math.abs(y) > 1e-9).map((y) => 7 * tickLabel(y, yStep, yPi).length));
    const yLabelsRight = axisX - 6 - yLabelWidth < M.l;
    for (const y of yTicks) {
      const py = sy(y);
      out.push(`<line x1="${M.l}" y1="${fmt(py)}" x2="${W - M.r}" y2="${fmt(py)}" stroke="#e5e7eb" stroke-width="1"></line>`);
      if (Math.abs(y) > 1e-9) out.push(`<text x="${fmt(yLabelsRight ? axisX + 6 : axisX - 6)}" y="${fmt(py + 4)}" text-anchor="${yLabelsRight ? 'start' : 'end'}" font-size="11" fill="#6b7280">${esc(tickLabel(y, yStep, yPi))}</text>`);
    }
    // Axes
    out.push(`<line x1="${M.l}" y1="${fmt(axisY)}" x2="${W - M.r}" y2="${fmt(axisY)}" stroke="#374151" stroke-width="1.5"></line>`);
    out.push(`<line x1="${fmt(axisX)}" y1="${M.t}" x2="${fmt(axisX)}" y2="${H - M.b}" stroke="#374151" stroke-width="1.5"></line>`);
    if (data.xLabel) out.push(`<text x="${W - M.r}" y="${fmt(axisY - 6)}" text-anchor="end" font-size="12" font-style="italic" fill="#374151">${esc(data.xLabel)}</text>`);
    if (data.yLabel) out.push(`<text x="${fmt(axisX + 8)}" y="${M.t + 10}" text-anchor="start" font-size="12" font-style="italic" fill="#374151">${esc(data.yLabel)}</text>`);
    // Curves
    const colors = ['#2563eb', '#dc2626', '#059669', '#7c3aed'];
    (data.functions ?? []).forEach((f, i) => {
      const src = functionSourceOf(f);
      if (!src) return;
      const fn = parseFunctionString(explicitFunctionSource(src));
      const [d0, d1] = f.domain ?? [x0, x1];
      const lo = Math.max(x0, d0), hi = Math.min(x1, d1);
      let d = '';
      let pen = false;
      const ySpan = y1 - y0;
      let prevY: number | null = null;
      for (let k = 0; k <= SAMPLES; k++) {
        const x = lo + ((hi - lo) * k) / SAMPLES;
        let y: number;
        try { y = fn(x); } catch { y = NaN; }
        const ok = Number.isFinite(y) && y >= y0 - ySpan && y <= y1 + ySpan && !(prevY !== null && Math.abs(y - prevY) > 2 * ySpan);
        if (!ok) { pen = false; prevY = null; continue; }
        d += `${pen ? 'L' : 'M'}${fmt(sx(x))} ${fmt(sy(Math.max(y0 - ySpan, Math.min(y1 + ySpan, y))))}`;
        pen = true;
        prevY = y;
      }
      if (d) out.push(`<path d="${d}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="2"${f.lineStyle === 'dashed' ? ' stroke-dasharray="6,4"' : ''}></path>`);
    });
    // Points
    for (const p of data.points ?? []) {
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
      out.push(`<circle cx="${fmt(sx(p.x))}" cy="${fmt(sy(p.y))}" r="4" fill="${p.color ?? '#1d4ed8'}"></circle>`);
      if (p.label) out.push(`<text x="${fmt(sx(p.x) + 6)}" y="${fmt(sy(p.y) - 6)}" font-size="12" font-weight="600" fill="#1d4ed8">${esc(p.label)}</text>`);
    }
    // Clip the plot area so an off-range curve never spills over the ticks.
    const body = out.slice(1).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${out[0]}<clipPath id="plot"><rect x="${M.l}" y="${M.t}" width="${W - M.l - M.r}" height="${H - M.t - M.b}"></rect></clipPath><g clip-path="url(#plot)">${body}</g></svg>`;
  } catch (e) {
    console.warn(`[homework-figure] graph svg failed: ${(e as Error)?.message ?? e}`);
    return null;
  }
}
