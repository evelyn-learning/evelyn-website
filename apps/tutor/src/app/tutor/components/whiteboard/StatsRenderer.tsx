'use client';

import { mathifyDollarSpans } from '@/lib/utils/export/latex-readable';
/**
 * Stats Renderer
 *
 * Renders statistical charts using pure SVG — no external charting libraries.
 * Supports histogram, box plot, dot plot, bar chart, and pie chart.
 */

import { useMemo } from 'react';
import { feat, featSlug, type FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

// ─── Default color palette ────────────────────────────────────────────────────
const DEFAULT_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BoxPlotDataset {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
  color?: string;
}

interface PieSlice {
  label: string;
  value: number;
  color?: string;
}

interface StatsRendererProps {
  title?: string;
  type: 'histogram' | 'boxplot' | 'dotplot' | 'bar' | 'pie' | 'distribution' | 'scatter' | 'scatterplot' | 'scatterplot_regression';
  /** Raw numeric data for histogram / dot plot */
  data?: number[];
  /** Pre-binned histogram: each entry is [lowerEdge, upperEdge, count]. Use this
   *  when you have bin frequencies (a described histogram) rather than raw
   *  values — the brain usually does. Takes precedence over `data`. */
  bins?: Array<[number, number, number]>;
  /** Draw the count above each histogram bar. */
  showCounts?: boolean;
  /** Bin width for histogram (defaults to auto-computed) */
  binWidth?: number;
  xLabel?: string;
  yLabel?: string;
  /** Scatterplot configuration (type='scatter' / 'scatterplot' / 'scatterplot_regression') */
  points?: Array<{ x: number; y: number; label?: string }>;
  /** Pre-computed regression coefficients; if absent and showTrendLine is true, LSRL is computed from points. */
  regression?: { slope: number; intercept: number };
  /** Draw the LSRL through the points. Defaults to true for scatter*; can be disabled. */
  showTrendLine?: boolean;
  /** Optional Pearson r — displayed in the corner. */
  rValue?: number;
  /** Optional r² — displayed in the corner. */
  rSquared?: number;
  /** Optional equation label like "ŷ = 2.1 + 1.3x" */
  equationLabel?: string;
  /** Highlight a single point. */
  highlightPoint?: { x: number; y: number; label?: string };
  /** Show vertical residual segments from each point to the LSRL. */
  showResiduals?: boolean;
  /** Box plot configuration */
  boxplot?: {
    datasets: BoxPlotDataset[];
    showValues?: boolean;
  };
  /** Bar chart configuration */
  bar?: {
    categories: string[];
    values: number[];
    colors?: string[];
  };
  /** Pie chart configuration */
  pie?: {
    slices: PieSlice[];
    showPercentages?: boolean;
  };
  /** Continuous distribution curve with optional shaded region (AP Stats inference) */
  distribution?: {
    family: 'normal' | 't' | 'chi-square' | 'F';
    /** Parameters per family: normal { mean, sd }, t { df }, chi-square { df }, F { df1, df2 } */
    params?: { mean?: number; sd?: number; df?: number; df1?: number; df2?: number };
    /** Shaded region: 'less' (x < a), 'greater' (x > a), 'between' (a < x < b), 'outside' (x < a or x > b) */
    shade?: { type: 'less' | 'greater' | 'between' | 'outside'; a?: number; b?: number; color?: string };
    /** Explicit x-range override */
    xRange?: [number, number];
    /** Show a vertical line at the mean / center */
    showMean?: boolean;
    /** Optional probability / p-value text shown in the shaded region */
    probabilityLabel?: string;
  };
}

// ─── Layout constants ─────────────────────────────────────────────────────────
// SVG viewBox is 500 x 350; chart area sits inside margins.
const WIDTH = 500;
const HEIGHT = 350;
const MARGIN = { top: 40, right: 30, bottom: 50, left: 55 };
const CHART_W = WIDTH - MARGIN.left - MARGIN.right;
const CHART_H = HEIGHT - MARGIN.top - MARGIN.bottom;

// ─── Helper: pick a colour from the palette ───────────────────────────────────
function color(index: number, custom?: string): string {
  return custom ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

// ─── Helper: nice tick values for a numeric axis ──────────────────────────────
function niceRange(min: number, max: number, targetTicks = 6) {
  if (min === max) { max = min + 1; }
  const rawStep = (max - min) / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  const niceStep =
    residual <= 1.5 ? 1 * magnitude :
    residual <= 3   ? 2 * magnitude :
    residual <= 7   ? 5 * magnitude :
    10 * magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.01; v += niceStep) {
    ticks.push(parseFloat(v.toFixed(10)));
  }
  return { min: niceMin, max: niceMax, ticks, step: niceStep };
}

// ─── Helper: format a number for display (strip trailing zeros) ───────────────
function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

// ═══════════════════════════════════════════════════════════════════════════════
// Histogram
// ═══════════════════════════════════════════════════════════════════════════════
function Histogram({ data, bins: preBins, showCounts, binWidth: bw, xLabel, yLabel }: StatsRendererProps) {
  const bins = useMemo(() => {
    // Pre-binned input ([lo, hi, count]) — the common case for a described
    // histogram. Use it directly so the bars actually draw (raw `data` is
    // rarely available; without this the histogram rendered empty).
    if (preBins && preBins.length > 0) {
      return preBins
        .filter((b) => Array.isArray(b) && b.length >= 3 && Number.isFinite(b[0]) && Number.isFinite(b[1]) && Number.isFinite(b[2]))
        .map(([lo, hi, count]) => ({ lo, hi, count }));
    }
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    // Auto bin width: Sturges' rule if not provided
    const binWidth = bw ?? Math.max((max - min) / Math.ceil(Math.log2(data.length) + 1), 1);
    const start = Math.floor(min / binWidth) * binWidth;
    const end = Math.ceil(max / binWidth) * binWidth + binWidth;
    const result: { lo: number; hi: number; count: number }[] = [];
    for (let lo = start; lo < end; lo += binWidth) {
      const hi = lo + binWidth;
      const count = data.filter(v => v >= lo && v < hi).length;
      result.push({ lo, hi, count });
    }
    // Include the last edge-value
    if (result.length > 0 && data.some(v => v === result[result.length - 1].hi)) {
      result[result.length - 1].count += data.filter(v => v === result[result.length - 1].hi).length;
    }
    return result;
  }, [data, bw, preBins]);

  if (bins.length === 0) return null;

  const maxCount = Math.max(...bins.map(b => b.count));
  const xRange = niceRange(bins[0].lo, bins[bins.length - 1].hi);
  const yRange = niceRange(0, maxCount);

  const xScale = (v: number) => MARGIN.left + ((v - xRange.min) / (xRange.max - xRange.min)) * CHART_W;
  const yScale = (v: number) => MARGIN.top + CHART_H - ((v - yRange.min) / (yRange.max - yRange.min)) * CHART_H;

  return (
    <g>
      {/* Bars */}
      {bins.map((bin, i) => {
        const bx = xScale(bin.lo);
        const bw = Math.max(xScale(bin.hi) - xScale(bin.lo) - 1, 1);
        const bh = yScale(0) - yScale(bin.count);
        return (
          <g key={i}>
            <rect
              x={bx}
              y={yScale(bin.count)}
              width={bw}
              height={bh}
              fill={color(0)}
              opacity={0.8}
              stroke="#fff"
              strokeWidth={1}
              {...feat(`bar-${i + 1}`, { cx: bx + bw / 2, cy: yScale(bin.count) + bh / 2, w: bw, h: bh }, { width: WIDTH, height: HEIGHT })}
            />
            {showCounts && bin.count > 0 && (
              <text x={bx + bw / 2} y={yScale(bin.count) - 4} textAnchor="middle" fontSize={10} fill="#374151">{bin.count}</text>
            )}
          </g>
        );
      })}

      {/* X-axis */}
      <line x1={MARGIN.left} y1={yScale(0)} x2={MARGIN.left + CHART_W} y2={yScale(0)} stroke="#374151" strokeWidth={1.5} />
      {xRange.ticks.map(t => (
        <g key={`xt-${t}`}>
          <line x1={xScale(t)} y1={yScale(0)} x2={xScale(t)} y2={yScale(0) + 5} stroke="#374151" />
          <text x={xScale(t)} y={yScale(0) + 18} textAnchor="middle" fontSize={11} fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>{xLabel}</text>
      )}

      {/* Y-axis */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={yScale(0)} stroke="#374151" strokeWidth={1.5} />
      {yRange.ticks.map(t => (
        <g key={`yt-${t}`}>
          <line x1={MARGIN.left - 5} y1={yScale(t)} x2={MARGIN.left} y2={yScale(t)} stroke="#374151" />
          <text x={MARGIN.left - 8} y={yScale(t) + 4} textAnchor="end" fontSize={11} fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {yLabel && (
        <text x={14} y={MARGIN.top + CHART_H / 2} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500} transform={`rotate(-90, 14, ${MARGIN.top + CHART_H / 2})`}>{yLabel}</text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Box Plot
// ═══════════════════════════════════════════════════════════════════════════════
/** Anchor an axis/value label so it never crosses the viewBox edge —
 *  round 28 (live, session portal-d2062bd9): a min value pinned to the
 *  axis start sat at x=MARGIN.left with textAnchor="middle", hanging its
 *  left half into the gutter. Width estimate matches sketch-render-core's
 *  estLabelWidth glyph factor (0.55 × fontSize). */
function anchorAt(x: number, text: string, fontSize: number): 'start' | 'middle' | 'end' {
  const half = (text.length * fontSize * 0.55) / 2;
  if (x - half < 2) return 'start';
  if (x + half > WIDTH - 2) return 'end';
  return 'middle';
}

/** Greedy word-wrap by estimated glyph width (same 0.55 × fontSize factor as
 *  anchorAt) — 2026-08-07 clip audit: pie legend labels near the right edge
 *  ran a single line off the fixed 500u viewBox. */
function wrapByWidth(text: string, maxW: number, fontSize: number): string[] {
  const maxChars = Math.max(8, Math.floor(maxW / (fontSize * 0.55)));
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.length > 0 ? lines : [text];
}

/** Height of one boxplot band and where the stack of bands starts. Bands are only as tall as a
 *  box with its labels needs and stand on the axis, so one box does not float in an empty card
 *  (the main component crops the unused top). */
function boxplotBands(n: number): { bandH: number; top0: number } {
  const bandH = Math.min(CHART_H / Math.max(1, n), 104);
  return { bandH, top0: MARGIN.top + CHART_H - bandH * n };
}

/** Spread a row of centred labels so none overlaps its neighbour or leaves the chart: each keeps
 *  its own x when there is room, and is nudged sideways just enough when there is not. */
function spreadLabels(items: { x: number; text: string }[], fontSize: number, lo: number, hi: number): number[] {
  const order = items.map((it, i) => ({ i, x: it.x, w: it.text.length * fontSize * 0.58 + 4 })).sort((p, q) => p.x - q.x);
  const pos = order.map((o) => Math.min(Math.max(o.x, lo + o.w / 2), hi - o.w / 2));
  for (let pass = 0; pass < 4; pass += 1) {
    for (let k = 1; k < order.length; k += 1) {
      const need = (order[k - 1].w + order[k].w) / 2;
      if (pos[k] - pos[k - 1] < need) {
        const push = (need - (pos[k] - pos[k - 1])) / 2;
        pos[k - 1] -= push; pos[k] += push;
      }
    }
    for (let k = 0; k < order.length; k += 1) pos[k] = Math.min(Math.max(pos[k], lo + order[k].w / 2), hi - order[k].w / 2);
    for (let k = 1; k < order.length; k += 1) {
      const need = (order[k - 1].w + order[k].w) / 2;
      if (pos[k] - pos[k - 1] < need) pos[k] = pos[k - 1] + need;
    }
    for (let k = order.length - 2; k >= 0; k -= 1) {
      const need = (order[k + 1].w + order[k].w) / 2;
      if (pos[k + 1] > hi - order[k + 1].w / 2) pos[k + 1] = hi - order[k + 1].w / 2;
      if (pos[k + 1] - pos[k] < need) pos[k] = pos[k + 1] - need;
    }
  }
  const out: number[] = new Array(items.length).fill(0);
  order.forEach((o, k) => { out[o.i] = pos[k]; });
  return out;
}

/** A five-number-summary value: up to two decimals, never rounded to a different number. */
function fmtValue(n: number): string {
  return String(Number(n.toFixed(2)));
}

function BoxPlot({ boxplot, xLabel }: StatsRendererProps) {
  if (!boxplot || boxplot.datasets.length === 0) return null;

  const datasets = boxplot.datasets;
  const showValues = boxplot.showValues ?? false;

  // Compute horizontal (value) range across all datasets
  const allVals = datasets.flatMap(d => [d.min, d.max, ...(d.outliers ?? [])]);
  const xRange = niceRange(Math.min(...allVals), Math.max(...allVals));

  const xScale = (v: number) => MARGIN.left + ((v - xRange.min) / (xRange.max - xRange.min)) * CHART_W;

  // Each dataset gets a horizontal band: its name, a row of values (min, median, max), the box,
  // and a row of values (Q1, Q3). The box takes what is left of the band.
  const { bandH, top0 } = boxplotBands(datasets.length);
  const nameH = datasets.some((d) => d.label) ? 15 : 0;
  const rowH = showValues ? 13 : 0;
  const boxH = Math.max(10, Math.min(bandH - nameH - 2 * rowH - 10, 40));
  const VAL_FONT = 10.5;

  return (
    <g>
      {datasets.map((ds, i) => {
        const bandTop = top0 + bandH * i;
        const cy = bandTop + nameH + rowH + 4 + boxH / 2;
        const c = color(i, ds.color);
        const boxName = ds.label ? `box-${featSlug(ds.label)}` : `box-${i + 1}`;
        const lo = MARGIN.left - 20, hi = WIDTH - 4;
        const above = [
          { x: xScale(ds.min), text: fmtValue(ds.min) },
          { x: xScale(ds.median), text: fmtValue(ds.median) },
          { x: xScale(ds.max), text: fmtValue(ds.max) },
        ];
        const below = [
          { x: xScale(ds.q1), text: fmtValue(ds.q1) },
          { x: xScale(ds.q3), text: fmtValue(ds.q3) },
        ];
        const aboveX = spreadLabels(above, VAL_FONT, lo, hi);
        const belowX = spreadLabels(below, VAL_FONT, lo, hi);
        return (
          <g key={i} {...feat(boxName, { cx: (xScale(ds.min) + xScale(ds.max)) / 2, cy, w: xScale(ds.max) - xScale(ds.min) + 20, h: boxH + 20 }, { width: WIDTH, height: HEIGHT })}>
            {/* Whisker line: min to max */}
            <line x1={xScale(ds.min)} y1={cy} x2={xScale(ds.max)} y2={cy} stroke={c} strokeWidth={1.5} />
            {/* Median marker hook */}
            <g {...feat(`median-${i + 1}`, { cx: xScale(ds.median), cy, w: 10, h: boxH + 8 }, { width: WIDTH, height: HEIGHT })} />
            {/* Min / max caps */}
            <line x1={xScale(ds.min)} y1={cy - boxH / 4} x2={xScale(ds.min)} y2={cy + boxH / 4} stroke={c} strokeWidth={1.5} />
            <line x1={xScale(ds.max)} y1={cy - boxH / 4} x2={xScale(ds.max)} y2={cy + boxH / 4} stroke={c} strokeWidth={1.5} />
            {/* Box: Q1 to Q3 (white under the tint so the whisker does not show through) */}
            <rect x={xScale(ds.q1)} y={cy - boxH / 2} width={Math.max(1, xScale(ds.q3) - xScale(ds.q1))} height={boxH} fill="#fff" rx={2} />
            <rect
              x={xScale(ds.q1)}
              y={cy - boxH / 2}
              width={Math.max(1, xScale(ds.q3) - xScale(ds.q1))}
              height={boxH}
              fill={c}
              fillOpacity={0.22}
              stroke={c}
              strokeWidth={1.5}
              rx={2}
            />
            {/* Median line (thick) */}
            <line x1={xScale(ds.median)} y1={cy - boxH / 2} x2={xScale(ds.median)} y2={cy + boxH / 2} stroke={c} strokeWidth={3} />

            {/* Outliers */}
            {(ds.outliers ?? []).map((o, oi) => (
              <circle key={oi} cx={xScale(o)} cy={cy} r={3.5} fill="#fff" stroke={c} strokeWidth={1.5} />
            ))}

            {/* Dataset label — a caption on the first line of the band, inside the plot area
                (round 28, portal-d2062bd9: a gutter label ran off the left edge). */}
            {ds.label && (
              <text x={MARGIN.left - 20} y={bandTop + 11} textAnchor="start" fontSize={12} fontWeight={600} fill={c}>{ds.label}</text>
            )}

            {/* Five-number summary: min, median, max above the box; Q1, Q3 below it. Close values
                are spread apart (see spreadLabels) instead of printing over each other. */}
            {showValues && (
              <>
                <text x={aboveX[0]} y={cy - boxH / 2 - 4} textAnchor="middle" fontSize={VAL_FONT} fill="#4b5563">{above[0].text}</text>
                <text x={aboveX[1]} y={cy - boxH / 2 - 4} textAnchor="middle" fontSize={VAL_FONT} fill={c} fontWeight={700}>{above[1].text}</text>
                <text x={aboveX[2]} y={cy - boxH / 2 - 4} textAnchor="middle" fontSize={VAL_FONT} fill="#4b5563">{above[2].text}</text>
                <text x={belowX[0]} y={cy + boxH / 2 + 12} textAnchor="middle" fontSize={VAL_FONT} fill="#4b5563">{below[0].text}</text>
                <text x={belowX[1]} y={cy + boxH / 2 + 12} textAnchor="middle" fontSize={VAL_FONT} fill="#4b5563">{below[1].text}</text>
              </>
            )}
          </g>
        );
      })}

      {/* X-axis */}
      <line x1={MARGIN.left} y1={MARGIN.top + CHART_H} x2={MARGIN.left + CHART_W} y2={MARGIN.top + CHART_H} stroke="#374151" strokeWidth={1.5} />
      {xRange.ticks.map(t => (
        <g key={`xt-${t}`}>
          <line x1={xScale(t)} y1={MARGIN.top + CHART_H} x2={xScale(t)} y2={MARGIN.top + CHART_H + 5} stroke="#374151" />
          <text x={xScale(t)} y={MARGIN.top + CHART_H + 18} textAnchor={anchorAt(xScale(t), fmt(t), 11)} fontSize={11} fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>{xLabel}</text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Dot Plot
// ═══════════════════════════════════════════════════════════════════════════════
function DotPlot({ data, xLabel }: StatsRendererProps) {
  const stacks = useMemo(() => {
    if (!data || data.length === 0) return new Map<number, number>();
    const map = new Map<number, number>();
    for (const v of data) {
      map.set(v, (map.get(v) ?? 0) + 1);
    }
    return map;
  }, [data]);

  if (stacks.size === 0) return null;

  const values = [...stacks.keys()].sort((a, b) => a - b);
  const maxStack = Math.max(...stacks.values());
  const xRange = niceRange(values[0], values[values.length - 1]);

  // Whole-number data is marked at whole numbers: scores of 6 to 10 had marks at 6.5, 7.5… that no score can take.
  const xTicks = values.every((v) => Number.isInteger(v)) ? xRange.ticks.filter((t) => Number.isInteger(t)) : xRange.ticks;

  const xScale = (v: number) => MARGIN.left + ((v - xRange.min) / (xRange.max - xRange.min)) * CHART_W;
  const dotR = Math.min(10, CHART_H / (maxStack * 2.5));
  const baseline = MARGIN.top + CHART_H;

  return (
    <g>
      {values.map((val, vi) => {
        const count = stacks.get(val)!;
        return (
          <g key={`dp-${vi}`} {...feat(`point-${vi + 1}`, { cx: xScale(val), cy: baseline - (count * dotR * 2.2) / 2, w: dotR * 3, h: count * dotR * 2.4 + 10 }, { width: WIDTH, height: HEIGHT })}>
            {Array.from({ length: count }, (_, i) => (
              <circle
                key={`${val}-${i}`}
                cx={xScale(val)}
                cy={baseline - dotR - i * dotR * 2.2}
                r={dotR}
                fill={color(0)}
                opacity={0.85}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}

      {/* X-axis */}
      <line x1={MARGIN.left} y1={baseline} x2={MARGIN.left + CHART_W} y2={baseline} stroke="#374151" strokeWidth={1.5} />
      {xTicks.map(t => (
        <g key={`xt-${t}`}>
          <line x1={xScale(t)} y1={baseline} x2={xScale(t)} y2={baseline + 5} stroke="#374151" />
          <text x={xScale(t)} y={baseline + 18} textAnchor="middle" fontSize={11} fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>{xLabel}</text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Bar Chart
// ═══════════════════════════════════════════════════════════════════════════════
/** How the names under the bars are set, and how much deeper the chart must be for them.
 *  Names that do not fit under their bars ran into one another ("Position 1" to "Position 10", data structures,
 *  embed-1794458110435). The words they all begin with are said once by the axis title, so they are dropped; a
 *  longer name goes on two lines; when even that does not hold every name whole, all of them are written
 *  slanted, in full, and the chart is made deeper to hold them (twelve cities had been cut to "Toky…", "Shan…"). */
function barNameLayout(categories: string[]): { nameLines: string[][]; rotated: boolean; extra: number } {
  const barCount = categories.length;
  const gap = barCount > 8 ? 6 : 10;
  const barW = Math.min((CHART_W - gap * (barCount + 1)) / barCount, 60);
  const CHAR = 5.4;
  const slot = barW + gap - 2; const wide = (s: string) => s.length * CHAR;
  let names = categories.map((c) => String(c ?? ''));
  if (names.some((n) => wide(n) > slot) && names.length > 1) {
    const words = names.map((n) => n.split(/\s+/)); let shared = 0;
    while (words.every((w) => w.length > shared + 1 && w[shared] === words[0][shared])) shared += 1;
    if (shared > 0) names = words.map((w) => w.slice(shared).join(' '));
  }
  const nameLines = names.map((n): string[] => {
    if (wide(n) <= slot) return [n];
    // The break nearest the middle, at a space or after a hyphen or dash.
    const breaks: number[] = [];
    for (let k = 1; k < n.length - 1; k++) if (n[k] === ' ' || /[-–—/]/.test(n[k - 1])) breaks.push(k);
    if (breaks.length === 0) return [n];
    const at = breaks.reduce((best, k) => (Math.abs(k - n.length / 2) < Math.abs(best - n.length / 2) ? k : best), breaks[0]);
    return [n.slice(0, at).trim(), n.slice(at).trim()];
  });
  if (nameLines.every((ls) => ls.every((l) => wide(l) <= slot))) return { nameLines, rotated: false, extra: 0 };
  const full = names.map((n) => (n.length > 26 ? `${n.slice(0, 25)}…` : n));
  const longest = Math.max(...full.map((n) => n.length)) * 5.8;
  return { nameLines: full.map((n) => [n]), rotated: true, extra: Math.max(0, Math.ceil(longest * 0.64 + 12 - 24)) };
}

function BarChart({ bar, xLabel, yLabel }: StatsRendererProps) {
  if (!bar || bar.categories.length === 0) return null;

  const { categories, colors: customColors } = bar;
  const values = categories.map((_, i) => { const v = Number(bar.values?.[i]); return Number.isFinite(v) ? v : 0; });
  // The axis runs from zero, and below zero when a value is negative: a fall of 2.6% was drawn as no bar at all
  // on an axis that began at 0 (figure audit, 2026-11-13).
  const yRange = niceRange(Math.min(0, ...values), Math.max(0, ...values));
  const hasNegative = values.some((v) => v < 0);

  const barCount = categories.length;
  const gap = barCount > 8 ? 6 : 10;
  const barW = Math.min((CHART_W - gap * (barCount + 1)) / barCount, 60);
  const totalBarsW = barCount * barW + (barCount - 1) * gap;
  const startX = MARGIN.left + (CHART_W - totalBarsW) / 2;

  const yScale = (v: number) => MARGIN.top + CHART_H - ((v - yRange.min) / (yRange.max - yRange.min)) * CHART_H;
  const baseY = MARGIN.top + CHART_H;

  const { nameLines, rotated, extra } = barNameLayout(categories);

  return (
    <g>
      {/* Light gridlines, behind the bars */}
      {yRange.ticks.map(t => (
        <line key={`yg-${t}`} x1={MARGIN.left} y1={yScale(t)} x2={MARGIN.left + CHART_W} y2={yScale(t)} stroke="#e5e7eb" strokeWidth={0.5} />
      ))}

      {/* Bars: one series, one colour (a colour per bar meant nothing and repeated after eight); a caller's own
          colours are kept. */}
      {categories.map((cat, i) => {
        const x = startX + i * (barW + gap);
        const v = values[i];
        const top = Math.min(yScale(v), yScale(0));
        const h = Math.abs(yScale(0) - yScale(v));
        const c = color(0, customColors?.[i]);
        const barName = cat ? `bar-${featSlug(cat)}` : `bar-${i + 1}`;
        return (
          <g key={i} {...feat(barName, { cx: x + barW / 2, cy: top + h / 2, w: barW + 8, h: h + 8 }, { width: WIDTH, height: HEIGHT })}>
            <rect x={x} y={top} width={barW} height={Math.max(h, v === 0 ? 0 : 1)} fill={c} opacity={0.85} rx={2} />
            {/* Value beyond the end of the bar */}
            <text x={x + barW / 2} y={v < 0 ? top + h + 13 : top - 5} textAnchor="middle" fontSize={barCount > 10 ? 10 : 11} fill="#374151" fontWeight={500}>{fmtValue(v)}</text>
            {/* Category label under the plot */}
            {rotated ? (
              <text x={x + barW / 2 + 3} y={baseY + 12} textAnchor="end" fontSize={10.5} fill="#374151" transform={`rotate(-40, ${x + barW / 2 + 3}, ${baseY + 12})`}>{nameLines[i][0]}</text>
            ) : (
              <text textAnchor="middle" fontSize={10} fill="#374151">
                {nameLines[i].map((ln, k) => <tspan key={k} x={x + barW / 2} y={baseY + 15 + k * 11}>{ln}</tspan>)}
              </text>
            )}
          </g>
        );
      })}

      {/* X-axis: the zero line; with negative values the foot of the plot is ruled lightly as well */}
      <line x1={MARGIN.left} y1={yScale(0)} x2={MARGIN.left + CHART_W} y2={yScale(0)} stroke="#374151" strokeWidth={1.5} />
      {hasNegative && <line x1={MARGIN.left} y1={baseY} x2={MARGIN.left + CHART_W} y2={baseY} stroke="#d1d5db" strokeWidth={1} />}
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT + extra - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>{xLabel}</text>
      )}

      {/* Y-axis */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={baseY} stroke="#374151" strokeWidth={1.5} />
      {yRange.ticks.map(t => (
        <g key={`yt-${t}`}>
          <line x1={MARGIN.left - 5} y1={yScale(t)} x2={MARGIN.left} y2={yScale(t)} stroke="#374151" />
          <text x={MARGIN.left - 8} y={yScale(t) + 4} textAnchor="end" fontSize={11} fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {yLabel && (
        <text x={14} y={MARGIN.top + CHART_H / 2} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500} transform={`rotate(-90, 14, ${MARGIN.top + CHART_H / 2})`}>{yLabel}</text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Pie Chart
// ═══════════════════════════════════════════════════════════════════════════════
function PieChart({ pie }: StatsRendererProps) {
  if (!pie || pie.slices.length === 0) return null;

  const { slices, showPercentages } = pie;
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return null;

  // Centre and radius
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 + 5;
  const r = Math.min(CHART_W, CHART_H) / 2 - 30;

  // Build arcs
  let cumAngle = -Math.PI / 2; // start at 12 o'clock
  const arcs = slices.map((sl, i) => {
    const angle = (sl.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const midAngle = startAngle + angle / 2;
    return { ...sl, startAngle, endAngle, midAngle, index: i, fraction: sl.value / total };
  });

  // SVG arc path helper
  function arcPath(startAngle: number, endAngle: number, radius: number): string {
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  return (
    <g>
      {arcs.map((arc) => {
        const c = color(arc.index, arc.color);
        // Label position: outside the pie
        const labelR = r + 20;
        const lx = cx + labelR * Math.cos(arc.midAngle);
        const ly = cy + labelR * Math.sin(arc.midAngle);
        // Leader line anchor on pie edge
        const edgeX = cx + r * Math.cos(arc.midAngle);
        const edgeY = cy + r * Math.sin(arc.midAngle);
        const pct = (arc.fraction * 100).toFixed(1).replace(/\.0$/, '') + '%';

        // Legend label — wrapped + edge-clamped (2026-08-07 clip audit): a
        // long slice label on the right side (anchor=start at labelR) ran off
        // the viewBox. Wrap to the room left on the label's side of the pie;
        // clamp each line for unsplittable words.
        const isRight = Math.cos(arc.midAngle) > 0;
        const labelTx = lx + (isRight ? 4 : -4);
        const legendText = `${arc.label}${showPercentages ? ` (${pct})` : ''}`;
        const legendLines = wrapByWidth(legendText, isRight ? WIDTH - 2 - labelTx : labelTx - 2, 10);
        const legendLineX = (ln: string) => {
          const w = ln.length * 10 * 0.55;
          return isRight ? Math.min(labelTx, WIDTH - 2 - w) : Math.max(labelTx, 2 + w);
        };

        const sliceName = arc.label ? `slice-${featSlug(arc.label)}` : `slice-${arc.index + 1}`;
        return (
          <g key={arc.index} {...feat(sliceName, { cx: cx + (r / 2) * Math.cos(arc.midAngle), cy: cy + (r / 2) * Math.sin(arc.midAngle), w: r + 20, h: r + 20 }, { width: WIDTH, height: HEIGHT })}>
            {/* Sector */}
            <path d={arcPath(arc.startAngle, arc.endAngle, r)} fill={c} stroke="#fff" strokeWidth={2} />

            {/* Leader line */}
            <line x1={edgeX} y1={edgeY} x2={lx} y2={ly} stroke="#9ca3af" strokeWidth={0.8} />

            {/* Label */}
            <text
              textAnchor={isRight ? 'start' : 'end'}
              fontSize={10}
              fill="#374151"
            >
              {legendLines.map((ln, li) => (
                <tspan key={li} x={legendLineX(ln)} y={ly + 4 + (li - (legendLines.length - 1) / 2) * 11}>{ln}</tspan>
              ))}
            </text>

            {/* Percentage inside slice (only if slice is big enough) */}
            {showPercentages && arc.fraction > 0.06 && (
              <text
                x={cx + r * 0.6 * Math.cos(arc.midAngle)}
                y={cy + r * 0.6 * Math.sin(arc.midAngle) + 4}
                textAnchor="middle"
                fontSize={11}
                fill="#fff"
                fontWeight={600}
              >
                {pct}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Distribution (continuous PDF with optional shaded region)
// ═══════════════════════════════════════════════════════════════════════════════

/** Standard normal PDF */
function normalPdf(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

/** Log-gamma (Lanczos) — used for t, chi-square, F PDFs */
function lgamma(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  }
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function tPdf(x: number, df: number): number {
  const num = lgamma((df + 1) / 2) - lgamma(df / 2);
  const denom = 0.5 * Math.log(df * Math.PI) + ((df + 1) / 2) * Math.log(1 + (x * x) / df);
  return Math.exp(num - denom);
}

function chiSquarePdf(x: number, df: number): number {
  if (x <= 0) return 0;
  const logNum = (df / 2 - 1) * Math.log(x) - x / 2;
  const logDen = (df / 2) * Math.log(2) + lgamma(df / 2);
  return Math.exp(logNum - logDen);
}

function fPdf(x: number, df1: number, df2: number): number {
  if (x <= 0) return 0;
  const logNum =
    (df1 / 2) * Math.log(df1) +
    (df2 / 2) * Math.log(df2) +
    (df1 / 2 - 1) * Math.log(x) -
    ((df1 + df2) / 2) * Math.log(df1 * x + df2);
  const logDen = lgamma(df1 / 2) + lgamma(df2 / 2) - lgamma((df1 + df2) / 2);
  return Math.exp(logNum - logDen);
}

function DistributionChart({
  distribution,
  xLabel,
  yLabel,
}: StatsRendererProps) {
  if (!distribution) return null;
  const { family, params = {}, shade, xRange: xRangeOverride, showMean = true, probabilityLabel } = distribution;

  // Pick default x range by family
  let xMin = xRangeOverride?.[0];
  let xMax = xRangeOverride?.[1];
  if (xMin === undefined || xMax === undefined) {
    if (family === 'normal') {
      const mean = params.mean ?? 0;
      const sd = params.sd ?? 1;
      xMin = xMin ?? mean - 4 * sd;
      xMax = xMax ?? mean + 4 * sd;
    } else if (family === 't') {
      xMin = xMin ?? -5;
      xMax = xMax ?? 5;
    } else if (family === 'chi-square') {
      const df = params.df ?? 1;
      xMin = xMin ?? 0;
      xMax = xMax ?? Math.max(10, 3 * df);
    } else if (family === 'F') {
      xMin = xMin ?? 0;
      xMax = xMax ?? 6;
    }
  }

  const xLo = xMin!;
  const xHi = xMax!;

  // Sample the PDF
  const N = 200;
  const samples: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= N; i++) {
    const x = xLo + (i / N) * (xHi - xLo);
    let y = 0;
    if (family === 'normal') y = normalPdf(x, params.mean ?? 0, params.sd ?? 1);
    else if (family === 't') y = tPdf(x, params.df ?? 10);
    else if (family === 'chi-square') y = chiSquarePdf(x, params.df ?? 3);
    else if (family === 'F') y = fPdf(x, params.df1 ?? 5, params.df2 ?? 10);
    samples.push({ x, y });
  }

  const yMax = Math.max(...samples.map((s) => s.y)) * 1.1;
  const toX = (v: number) => MARGIN.left + ((v - xLo) / (xHi - xLo)) * CHART_W;
  const toY = (v: number) => MARGIN.top + CHART_H - (v / yMax) * CHART_H;

  // Build the curve path
  const curvePath =
    samples
      .map((s, i) => `${i === 0 ? 'M' : 'L'}${toX(s.x)},${toY(s.y)}`)
      .join(' ');

  // Build shaded region path (closes to the baseline)
  function buildShadePath(cond: (x: number) => boolean): string {
    const filtered = samples.filter((s) => cond(s.x));
    if (filtered.length < 2) return '';
    const baselineY = toY(0);
    let path = `M ${toX(filtered[0].x)},${baselineY}`;
    for (const s of filtered) path += ` L ${toX(s.x)},${toY(s.y)}`;
    path += ` L ${toX(filtered[filtered.length - 1].x)},${baselineY} Z`;
    return path;
  }

  const shadeColor = shade?.color ?? '#3b82f6';
  let shadePath = '';
  let shadeLabelX: number | null = null;
  if (shade) {
    if (shade.type === 'less' && shade.a !== undefined) {
      shadePath = buildShadePath((x) => x <= shade.a!);
      shadeLabelX = (xLo + shade.a) / 2;
    } else if (shade.type === 'greater' && shade.a !== undefined) {
      shadePath = buildShadePath((x) => x >= shade.a!);
      shadeLabelX = (shade.a + xHi) / 2;
    } else if (shade.type === 'between' && shade.a !== undefined && shade.b !== undefined) {
      shadePath = buildShadePath((x) => x >= shade.a! && x <= shade.b!);
      shadeLabelX = (shade.a + shade.b) / 2;
    } else if (shade.type === 'outside' && shade.a !== undefined && shade.b !== undefined) {
      shadePath = [
        buildShadePath((x) => x <= shade.a!),
        buildShadePath((x) => x >= shade.b!),
      ].join(' ');
      shadeLabelX = null;
    }
  }

  // x-axis ticks
  const xTicks = niceRange(xLo, xHi, 8).ticks.filter((t) => t >= xLo - 1e-9 && t <= xHi + 1e-9);
  // Boundary values are written at the top of their lines, to three decimals (a critical value
  // such as 2.776 must not be rounded to 2.8).
  const boundText = (v: number) => String(Number(v.toFixed(3))).replace(/^-/, '−');
  const bounds: { x: number; text: string }[] = [];
  if (shade?.a !== undefined && shade.a >= xLo && shade.a <= xHi) bounds.push({ x: toX(shade.a), text: boundText(shade.a) });
  if (shade?.b !== undefined && shade.b >= xLo && shade.b <= xHi) bounds.push({ x: toX(shade.b), text: boundText(shade.b) });
  const boundX = spreadLabels(bounds, 11, MARGIN.left - 20, WIDTH - 4);

  const mean = family === 'normal' ? params.mean ?? 0 : family === 't' ? 0 : null;

  return (
    <g>
      {/* Shaded region (under the curve) */}
      {shadePath && (
        <path d={shadePath} fill={shadeColor} fillOpacity={0.3} stroke="none" />
      )}

      {/* Axes */}
      <line
        x1={MARGIN.left}
        y1={MARGIN.top + CHART_H}
        x2={MARGIN.left + CHART_W}
        y2={MARGIN.top + CHART_H}
        stroke="#475569"
        strokeWidth={1.5}
      />

      {/* X-axis ticks */}
      {xTicks.map((t, i) => (
        <g key={`xt-${i}`}>
          <line
            x1={toX(t)}
            y1={MARGIN.top + CHART_H}
            x2={toX(t)}
            y2={MARGIN.top + CHART_H + 4}
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={toX(t)}
            y={MARGIN.top + CHART_H + 18}
            textAnchor="middle"
            fontSize={10}
            fill="#475569"
          >
            {fmt(t)}
          </text>
        </g>
      ))}

      {/* Vertical line at mean */}
      {showMean && mean !== null && (
        <line
          x1={toX(mean)}
          y1={MARGIN.top + CHART_H}
          x2={toX(mean)}
          y2={MARGIN.top}
          stroke="#94a3b8"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      )}

      {/* Vertical lines at shade boundaries */}
      {shade?.a !== undefined && (
        <line
          x1={toX(shade.a)}
          y1={toY(0)}
          x2={toX(shade.a)}
          y2={MARGIN.top}
          stroke={shadeColor}
          strokeWidth={1.2}
        />
      )}
      {shade?.b !== undefined && (
        <line
          x1={toX(shade.b)}
          y1={toY(0)}
          x2={toX(shade.b)}
          y2={MARGIN.top}
          stroke={shadeColor}
          strokeWidth={1.2}
        />
      )}

      {bounds.map((bd, i) => (
        <text key={`bd-${i}`} x={boundX[i]} y={MARGIN.top - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">{bd.text}</text>
      ))}

      {/* Curve */}
      <path
        d={curvePath}
        fill="none"
        stroke="#1e293b"
        strokeWidth={2}
        {...feat('curve', { cx: MARGIN.left + CHART_W / 2, cy: MARGIN.top + CHART_H / 2, w: CHART_W, h: CHART_H }, { width: WIDTH, height: HEIGHT })}
      />
      {/* Mean marker hook */}
      {showMean && mean !== null && (
        <g {...feat('mean', { cx: toX(mean), cy: MARGIN.top + CHART_H / 2, w: 12, h: CHART_H }, { width: WIDTH, height: HEIGHT })} />
      )}

      {/* Probability label in the shaded region — dark text with white halo
          so it stays legible against the light shade fill. Edge-anchored via
          anchorAt (2026-08-07 clip audit): a tail shade near the plot edge
          centered the label half off the viewBox. */}
      {probabilityLabel && shadeLabelX !== null && (
        <text
          x={toX(shadeLabelX)}
          y={MARGIN.top + CHART_H / 2}
          textAnchor={anchorAt(toX(shadeLabelX), probabilityLabel, 14)}
          fontSize={14}
          fontWeight={700}
          fill="#1e293b"
          stroke="#ffffff"
          strokeWidth={3.5}
          paintOrder="stroke"
        >
          {probabilityLabel}
        </text>
      )}

      {/* Axis labels */}
      {xLabel && (
        <text
          x={MARGIN.left + CHART_W / 2}
          y={HEIGHT - 10}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={15}
          y={MARGIN.top + CHART_H / 2}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
          transform={`rotate(-90, 15, ${MARGIN.top + CHART_H / 2})`}
        >
          {yLabel}
        </text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Manifest builder
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pure manifest builder — enumerates the named features this renderer emits
 * for a given set of props. MUST stay in sync with the feat() calls below.
 * Called by the command handler before the React render so the tutor receives
 * authoritative names in the tool-result JSON and doesn't have to guess.
 */
export function buildStatsManifest(props: StatsRendererProps): FeatureManifestEntry[] {
  const entries: FeatureManifestEntry[] = [];
  const { type } = props;

  if (type === 'histogram') {
    const data = props.data ?? [];
    if (data.length === 0) return entries;
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const binWidth = props.binWidth ?? Math.max((max - min) / Math.ceil(Math.log2(data.length) + 1), 1);
    const start = Math.floor(min / binWidth) * binWidth;
    const end = Math.ceil(max / binWidth) * binWidth + binWidth;
    const bins: { lo: number; hi: number }[] = [];
    for (let lo = start; lo < end; lo += binWidth) {
      bins.push({ lo, hi: lo + binWidth });
    }
    bins.forEach((bin, i) => {
      entries.push({
        name: `bar-${i + 1}`,
        kind: 'shape',
        description: `histogram bar ${i + 1} for bin [${fmt(bin.lo)}, ${fmt(bin.hi)})`,
        labels: [
          `bar-${i + 1}`,
          `bar ${i + 1}`,
          `bin ${i + 1}`,
          `bin-${i + 1}`,
          `histogram bar ${i + 1}`,
          `the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} bar`,
          `bin [${fmt(bin.lo)}, ${fmt(bin.hi)})`,
        ],
      });
    });
  } else if (type === 'boxplot') {
    const datasets = props.boxplot?.datasets ?? [];
    datasets.forEach((ds, i) => {
      const boxName = ds.label ? `box-${featSlug(ds.label)}` : `box-${i + 1}`;
      const boxLabels = new Set<string>([
        boxName,
        `box-${i + 1}`,
        `box ${i + 1}`,
        `boxplot ${i + 1}`,
        `box plot ${i + 1}`,
      ]);
      if (ds.label) {
        boxLabels.add(ds.label);
        boxLabels.add(`box ${ds.label}`);
        boxLabels.add(`${ds.label} box`);
        boxLabels.add(`${ds.label} boxplot`);
        boxLabels.add(`box plot for ${ds.label}`);
      }
      // Five-number summary in the description (value-blindness audit,
      // 2026-07-23): only the median value survived to the snapshot.
      const fiveNum = `min ${fmt(ds.min)}, Q1 ${fmt(ds.q1)}, median ${fmt(ds.median)}, Q3 ${fmt(ds.q3)}, max ${fmt(ds.max)}`;
      entries.push({
        name: boxName,
        kind: 'shape',
        description: `${ds.label ? `box plot for "${ds.label}"` : `box plot ${i + 1}`} (${fiveNum})`,
        labels: Array.from(boxLabels),
      });
      const medianLabels = new Set<string>([
        `median-${i + 1}`,
        `median ${i + 1}`,
        'median',
        'Q2',
        'second quartile',
        'middle',
      ]);
      if (ds.label) {
        medianLabels.add(`median of ${ds.label}`);
        medianLabels.add(`${ds.label} median`);
      }
      entries.push({
        name: `median-${i + 1}`,
        kind: 'annotation',
        description: ds.label
          ? `median marker for "${ds.label}" at ${fmt(ds.median)}`
          : `median marker ${i + 1} at ${fmt(ds.median)}`,
        labels: Array.from(medianLabels),
      });
    });
  } else if (type === 'dotplot') {
    const data = props.data ?? [];
    if (data.length === 0) return entries;
    const map = new Map<number, number>();
    for (const v of data) map.set(v, (map.get(v) ?? 0) + 1);
    const values = [...map.keys()].sort((a, b) => a - b);
    values.forEach((val, vi) => {
      const count = map.get(val)!;
      entries.push({
        name: `point-${vi + 1}`,
        kind: 'point',
        description: `dot plot stack at ${fmt(val)} (${count} dot${count === 1 ? '' : 's'})`,
        labels: [
          `point-${vi + 1}`,
          `point ${vi + 1}`,
          `stack-${vi + 1}`,
          `stack ${vi + 1}`,
          `dot stack at ${fmt(val)}`,
          `${fmt(val)}`,
          `the stack at ${fmt(val)}`,
        ],
      });
    });
  } else if (type === 'bar') {
    const bar = props.bar;
    if (bar) {
      bar.categories.forEach((cat, i) => {
        const barName = cat ? `bar-${featSlug(cat)}` : `bar-${i + 1}`;
        const labels = new Set<string>([
          barName,
          `bar-${i + 1}`,
          `bar ${i + 1}`,
          `category ${i + 1}`,
        ]);
        if (cat) {
          labels.add(cat);
          labels.add(`bar ${cat}`);
          labels.add(`${cat} bar`);
          labels.add(`the ${cat} bar`);
          labels.add(`${cat} column`);
        }
        entries.push({
          name: barName,
          kind: 'shape',
          description: cat
            ? `bar "${cat}" with value ${fmt(bar.values[i] ?? 0)}`
            : `bar ${i + 1} with value ${fmt(bar.values[i] ?? 0)}`,
          labels: Array.from(labels),
        });
      });
    }
  } else if (type === 'pie') {
    const pie = props.pie;
    if (pie) {
      pie.slices.forEach((sl, i) => {
        const name = sl.label ? `slice-${featSlug(sl.label)}` : `slice-${i + 1}`;
        const labels = new Set<string>([
          name,
          `slice-${i + 1}`,
          `slice ${i + 1}`,
          `sector ${i + 1}`,
          `wedge ${i + 1}`,
        ]);
        if (sl.label) {
          labels.add(sl.label);
          labels.add(`${sl.label} slice`);
          labels.add(`slice for ${sl.label}`);
          labels.add(`the ${sl.label} slice`);
          labels.add(`${sl.label} wedge`);
        }
        entries.push({
          name,
          kind: 'shape',
          description: sl.label
            ? `pie slice "${sl.label}" (value ${fmt(sl.value)})`
            : `pie slice ${i + 1} (value ${fmt(sl.value)})`,
          labels: Array.from(labels),
        });
      });
    }
  } else if (type === 'distribution') {
    const dist = props.distribution;
    if (dist) {
      entries.push({
        name: 'curve',
        kind: 'curve',
        description: `${dist.family} probability density curve`,
        labels: [
          'curve',
          'the curve',
          `${dist.family} curve`,
          `${dist.family} distribution`,
          'distribution',
          'density curve',
          'probability density',
          'pdf',
          'PDF',
        ],
      });
      const showMean = dist.showMean ?? true;
      const hasCenter = dist.family === 'normal' || dist.family === 't';
      if (showMean && hasCenter) {
        entries.push({
          name: 'mean',
          kind: 'annotation',
          description: 'vertical reference line at the distribution center (mean)',
          labels: [
            'mean',
            'average',
            'μ',
            'mu',
            'center',
            'center line',
            'the mean',
            'distribution center',
          ],
        });
      }
    }
  }

  return entries;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Scatter (with optional regression line + residuals)
// ═══════════════════════════════════════════════════════════════════════════════

function Scatter({
  points,
  regression,
  showTrendLine = true,
  rValue,
  rSquared,
  equationLabel,
  highlightPoint,
  showResiduals,
  xLabel,
  yLabel,
}: StatsRendererProps) {
  if (!points || points.length === 0) {
    return (
      <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle" fontSize={14} fill="#ef4444">
        Scatter requires `points: [{`{x, y}`}, ...]`
      </text>
    );
  }

  // Compute LSRL from points if not provided.
  let reg = regression;
  if (!reg && showTrendLine !== false && points.length >= 2) {
    const n = points.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (const p of points) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
    const denom = n * sxx - sx * sx;
    if (denom !== 0) {
      const slope = (n * sxy - sx * sy) / denom;
      const intercept = (sy - slope * sx) / n;
      reg = { slope, intercept };
    }
  }

  // Compute r if not provided (for display).
  let rDisplay = rValue;
  let r2Display = rSquared;
  if (rDisplay === undefined && reg && points.length >= 2) {
    const n = points.length;
    let sx = 0, sy = 0;
    for (const p of points) { sx += p.x; sy += p.y; }
    const mx = sx / n, my = sy / n;
    let num = 0, dxx = 0, dyy = 0;
    for (const p of points) {
      const ax = p.x - mx, ay = p.y - my;
      num += ax * ay; dxx += ax * ax; dyy += ay * ay;
    }
    const den = Math.sqrt(dxx * dyy);
    if (den > 0) rDisplay = num / den;
  }
  if (r2Display === undefined && rDisplay !== undefined) r2Display = rDisplay * rDisplay;

  // Viewport.
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const p of points) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }
  const padX = (xMax - xMin) * 0.08 || 1;
  const padY = (yMax - yMin) * 0.10 || 1;
  xMin -= padX; xMax += padX;
  yMin -= padY; yMax += padY;

  const toX = (v: number) => MARGIN.left + ((v - xMin) / (xMax - xMin)) * CHART_W;
  const toY = (v: number) => MARGIN.top + CHART_H - ((v - yMin) / (yMax - yMin)) * CHART_H;

  const xRange = niceRange(xMin, xMax, 6);
  const yRange = niceRange(yMin, yMax, 6);
  // niceRange extends to the next "nice" value, which can land past the
  // padded data range — those ticks/gridlines drew beyond the plot (and off
  // the viewBox on the right). Keep only in-range ticks (2026-08-07 audit).
  const xTicks = xRange.ticks.filter((t) => t >= xMin && t <= xMax);
  const yTicks = yRange.ticks.filter((t) => t >= yMin && t <= yMax);

  return (
    <g>
      {/* gridlines */}
      {xTicks.map((t) => (
        <line key={`gx-${t}`} x1={toX(t)} y1={MARGIN.top} x2={toX(t)} y2={MARGIN.top + CHART_H} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {yTicks.map((t) => (
        <line key={`gy-${t}`} x1={MARGIN.left} y1={toY(t)} x2={MARGIN.left + CHART_W} y2={toY(t)} stroke="#e5e7eb" strokeWidth={1} />
      ))}

      {/* clip path so line and residuals stay in the plot area */}
      <defs>
        <clipPath id={`scatter-clip-${featSlug('scatter')}`}>
          <rect x={MARGIN.left} y={MARGIN.top} width={CHART_W} height={CHART_H} />
        </clipPath>
      </defs>

      {/* residual segments (under points, above gridlines) */}
      {showResiduals && reg && (
        <g clipPath={`url(#scatter-clip-${featSlug('scatter')})`}>
          {points.map((p, i) => {
            const yHat = reg!.intercept + reg!.slope * p.x;
            return (
              <line
                key={`res-${i}`}
                x1={toX(p.x)}
                y1={toY(p.y)}
                x2={toX(p.x)}
                y2={toY(yHat)}
                stroke="#9ca3af"
                strokeWidth={1.2}
                strokeDasharray="2 2"
              />
            );
          })}
        </g>
      )}

      {/* regression line */}
      {reg && (
        <g clipPath={`url(#scatter-clip-${featSlug('scatter')})`}>
          <line
            x1={toX(xMin)}
            y1={toY(reg.intercept + reg.slope * xMin)}
            x2={toX(xMax)}
            y2={toY(reg.intercept + reg.slope * xMax)}
            stroke="#dc2626"
            strokeWidth={2.4}
          />
        </g>
      )}

      {/* points */}
      {points.map((p, i) => {
        const isH =
          highlightPoint &&
          Math.abs(p.x - highlightPoint.x) < 1e-9 &&
          Math.abs(p.y - highlightPoint.y) < 1e-9;
        return (
          <circle
            key={`pt-${i}`}
            cx={toX(p.x)}
            cy={toY(p.y)}
            r={isH ? 5.5 : 3.5}
            fill={isH ? '#16a34a' : '#2563eb'}
            stroke="#fff"
            strokeWidth={1.2}
          />
        );
      })}
      {highlightPoint && (() => {
        // Width-aware anchor flip (2026-08-07 clip audit): a highlight near
        // xMax hung its start-anchored label off the right viewBox edge.
        const hlText = highlightPoint.label ?? `(${fmt(highlightPoint.x)}, ${fmt(highlightPoint.y)})`;
        const hx = toX(highlightPoint.x);
        const hlFlip = hx + 8 + hlText.length * 11 * 0.55 > WIDTH - 2;
        return (
          <text
            x={hx + (hlFlip ? -8 : 8)}
            y={toY(highlightPoint.y) - 6}
            fontSize={11}
            fill="#16a34a"
            fontWeight={600}
            textAnchor={hlFlip ? 'end' : undefined}
          >
            {hlText}
          </text>
        );
      })()}

      {/* axes */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + CHART_H} stroke="#374151" strokeWidth={1.5} />
      <line x1={MARGIN.left} y1={MARGIN.top + CHART_H} x2={MARGIN.left + CHART_W} y2={MARGIN.top + CHART_H} stroke="#374151" strokeWidth={1.5} />

      {/* tick labels */}
      {xTicks.map((t) => (
        <g key={`xt-${t}`}>
          <line x1={toX(t)} y1={MARGIN.top + CHART_H} x2={toX(t)} y2={MARGIN.top + CHART_H + 4} stroke="#374151" strokeWidth={1} />
          <text x={toX(t)} y={MARGIN.top + CHART_H + 18} fontSize={11} textAnchor="middle" fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`yt-${t}`}>
          <line x1={MARGIN.left - 4} y1={toY(t)} x2={MARGIN.left} y2={toY(t)} stroke="#374151" strokeWidth={1} />
          <text x={MARGIN.left - 6} y={toY(t) + 4} fontSize={11} textAnchor="end" fill="#374151">{fmt(t)}</text>
        </g>
      ))}

      {/* equation + r corner labels */}
      {equationLabel && (
        <text x={MARGIN.left + 8} y={MARGIN.top + 14} fontSize={13} fontWeight={600} fill="#dc2626">
          {equationLabel}
        </text>
      )}
      {(rDisplay !== undefined || r2Display !== undefined) && (
        <text x={WIDTH - MARGIN.right - 4} y={MARGIN.top + 14} fontSize={11} textAnchor="end" fill="#374151">
          {rDisplay !== undefined && <tspan>r = {Number(rDisplay.toFixed(3))}</tspan>}
          {rDisplay !== undefined && r2Display !== undefined && <tspan>  </tspan>}
          {r2Display !== undefined && <tspan>r² = {Number(r2Display.toFixed(3))}</tspan>}
        </text>
      )}

      {/* axis titles */}
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={14} y={MARGIN.top + CHART_H / 2} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500} transform={`rotate(-90, 14, ${MARGIN.top + CHART_H / 2})`}>
          {yLabel}
        </text>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════════════

export function StatsRenderer(props: StatsRendererProps) {
  const { title, type } = props;

  // Select the right sub-renderer
  let chart: React.ReactNode;
  switch (type) {
    case 'histogram':
      chart = <Histogram {...props} />;
      break;
    case 'boxplot':
      chart = <BoxPlot {...props} />;
      break;
    case 'dotplot':
      chart = <DotPlot {...props} />;
      break;
    case 'bar':
      chart = <BarChart {...props} />;
      break;
    case 'pie':
      chart = <PieChart {...props} />;
      break;
    case 'distribution':
      chart = <DistributionChart {...props} />;
      break;
    case 'scatter':
    case 'scatterplot':
    case 'scatterplot_regression':
      chart = <Scatter {...props} />;
      break;
    default:
      chart = (
        <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle" fontSize={14} fill="#ef4444">
          Unknown chart type: {type}
        </text>
      );
  }

  // A dotplot's dots stand on the axis at the bottom of a chart area sized for tall bars: five scores left
  // two thirds of the card empty above them (embed-1794425631023). The empty top is cut off.
  let cropTop = 0;
  if (type === 'dotplot' && props.data && props.data.length) {
    const counts = new Map<number, number>();
    for (const v of props.data) counts.set(v, (counts.get(v) ?? 0) + 1);
    const maxStack = Math.max(...counts.values());
    const dotR = Math.min(10, CHART_H / (maxStack * 2.5));
    cropTop = Math.max(0, Math.floor(MARGIN.top + CHART_H - maxStack * dotR * 2.2 - 28));
  }

  // Slanted names under the bars of a bar chart need a deeper chart.
  const extraBottom = type === 'bar' && props.bar?.categories?.length ? barNameLayout(props.bar.categories).extra : 0;

  if (type === 'boxplot' && props.boxplot?.datasets?.length) {
    cropTop = Math.max(0, Math.floor(boxplotBands(props.boxplot.datasets.length).top0 - 8));
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      {/* Title — HTML above the SVG (R38 pattern, 2026-08-07 clip audit: a
          long in-SVG title centered over the fixed 500u viewBox clipped on
          both sides; HTML wraps instead) */}
      {title && (
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
          {mathifyDollarSpans(title)}
        </div>
      )}
      <svg
        viewBox={`0 ${cropTop} ${WIDTH} ${HEIGHT - cropTop + extraBottom}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label={title ?? `${type} chart`}
      >
        {chart}
      </svg>
    </div>
  );
}

export default StatsRenderer;
