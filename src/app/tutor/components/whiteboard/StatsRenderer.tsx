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

function BoxPlot({ boxplot, xLabel }: StatsRendererProps) {
  if (!boxplot || boxplot.datasets.length === 0) return null;

  const datasets = boxplot.datasets;
  const showValues = boxplot.showValues ?? false;

  // Compute horizontal (value) range across all datasets
  const allVals = datasets.flatMap(d => [d.min, d.max, ...(d.outliers ?? [])]);
  const xRange = niceRange(Math.min(...allVals), Math.max(...allVals));

  const xScale = (v: number) => MARGIN.left + ((v - xRange.min) / (xRange.max - xRange.min)) * CHART_W;

  // Each dataset gets a horizontal band
  const bandH = CHART_H / datasets.length;
  const boxH = Math.min(bandH * 0.5, 40);

  return (
    <g>
      {datasets.map((ds, i) => {
        const cy = MARGIN.top + bandH * i + bandH / 2;
        const c = color(i, ds.color);
        const boxName = ds.label ? `box-${featSlug(ds.label)}` : `box-${i + 1}`;
        return (
          <g key={i} {...feat(boxName, { cx: (xScale(ds.min) + xScale(ds.max)) / 2, cy, w: xScale(ds.max) - xScale(ds.min) + 20, h: boxH + 20 }, { width: WIDTH, height: HEIGHT })}>
            {/* Whisker line: min to max */}
            <line x1={xScale(ds.min)} y1={cy} x2={xScale(ds.max)} y2={cy} stroke={c} strokeWidth={1.5} />
            {/* Median marker hook */}
            <g {...feat(`median-${i + 1}`, { cx: xScale(ds.median), cy, w: 10, h: boxH + 8 }, { width: WIDTH, height: HEIGHT })} />
            {/* Min / max caps */}
            <line x1={xScale(ds.min)} y1={cy - boxH / 4} x2={xScale(ds.min)} y2={cy + boxH / 4} stroke={c} strokeWidth={1.5} />
            <line x1={xScale(ds.max)} y1={cy - boxH / 4} x2={xScale(ds.max)} y2={cy + boxH / 4} stroke={c} strokeWidth={1.5} />
            {/* Box: Q1 to Q3 */}
            <rect
              x={xScale(ds.q1)}
              y={cy - boxH / 2}
              width={xScale(ds.q3) - xScale(ds.q1)}
              height={boxH}
              fill={c}
              opacity={0.25}
              stroke={c}
              strokeWidth={1.5}
              rx={2}
            />
            {/* Median line (thick) */}
            <line x1={xScale(ds.median)} y1={cy - boxH / 2} x2={xScale(ds.median)} y2={cy + boxH / 2} stroke={c} strokeWidth={3} />

            {/* Outliers */}
            {(ds.outliers ?? []).map((o, oi) => (
              <circle key={oi} cx={xScale(o)} cy={cy} r={3.5} fill="none" stroke={c} strokeWidth={1.5} />
            ))}

            {/* Dataset label — caption above the band, inside the plot
                area. Round 28 (live, portal-d2062bd9): the old right-
                anchored gutter placement (x=MARGIN.left-8, 47px of room,
                no truncation) ran any label past ~7 chars off x=0 and the
                viewBox clipped it ("1, 5, 5, 6, 20" lost its head). */}
            {ds.label && (
              <text x={MARGIN.left} y={cy - boxH / 2 - (showValues ? 18 : 6)} textAnchor="start" fontSize={11} fill="#374151">{ds.label}</text>
            )}

            {/* Five-number summary labels (edge-clamped, see anchorAt) */}
            {showValues && (
              <>
                <text x={xScale(ds.min)} y={cy - boxH / 2 - 4} textAnchor={anchorAt(xScale(ds.min), fmt(ds.min), 9)} fontSize={9} fill="#6b7280">{fmt(ds.min)}</text>
                <text x={xScale(ds.q1)} y={cy + boxH / 2 + 12} textAnchor={anchorAt(xScale(ds.q1), fmt(ds.q1), 9)} fontSize={9} fill="#6b7280">{fmt(ds.q1)}</text>
                <text x={xScale(ds.median)} y={cy - boxH / 2 - 4} textAnchor={anchorAt(xScale(ds.median), fmt(ds.median), 9)} fontSize={9} fill={c} fontWeight={600}>{fmt(ds.median)}</text>
                <text x={xScale(ds.q3)} y={cy + boxH / 2 + 12} textAnchor={anchorAt(xScale(ds.q3), fmt(ds.q3), 9)} fontSize={9} fill="#6b7280">{fmt(ds.q3)}</text>
                <text x={xScale(ds.max)} y={cy - boxH / 2 - 4} textAnchor={anchorAt(xScale(ds.max), fmt(ds.max), 9)} fontSize={9} fill="#6b7280">{fmt(ds.max)}</text>
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
      {xRange.ticks.map(t => (
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
function BarChart({ bar, xLabel, yLabel }: StatsRendererProps) {
  if (!bar || bar.categories.length === 0) return null;

  const { categories, values, colors: customColors } = bar;
  const maxVal = Math.max(...values);
  const yRange = niceRange(0, maxVal);

  const barCount = categories.length;
  const gap = 8;
  const barW = Math.min((CHART_W - gap * (barCount + 1)) / barCount, 60);
  const totalBarsW = barCount * barW + (barCount - 1) * gap;
  const startX = MARGIN.left + (CHART_W - totalBarsW) / 2;

  const yScale = (v: number) => MARGIN.top + CHART_H - ((v - yRange.min) / (yRange.max - yRange.min)) * CHART_H;

  return (
    <g>
      {/* Bars */}
      {categories.map((cat, i) => {
        const x = startX + i * (barW + gap);
        const h = yScale(0) - yScale(values[i]);
        const c = color(i, customColors?.[i]);
        const barName = cat ? `bar-${featSlug(cat)}` : `bar-${i + 1}`;
        return (
          <g key={i} {...feat(barName, { cx: x + barW / 2, cy: yScale(values[i]) + h / 2, w: barW + 8, h: h + 8 }, { width: WIDTH, height: HEIGHT })}>
            <rect x={x} y={yScale(values[i])} width={barW} height={h} fill={c} opacity={0.85} rx={2} />
            {/* Value above bar */}
            <text x={x + barW / 2} y={yScale(values[i]) - 5} textAnchor="middle" fontSize={11} fill="#374151" fontWeight={500}>{fmt(values[i])}</text>
            {/* Category label below axis */}
            <text x={x + barW / 2} y={yScale(0) + 16} textAnchor="middle" fontSize={10} fill="#374151">{cat}</text>
          </g>
        );
      })}

      {/* X-axis */}
      <line x1={MARGIN.left} y1={yScale(0)} x2={MARGIN.left + CHART_W} y2={yScale(0)} stroke="#374151" strokeWidth={1.5} />
      {xLabel && (
        <text x={MARGIN.left + CHART_W / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>{xLabel}</text>
      )}

      {/* Y-axis */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={yScale(0)} stroke="#374151" strokeWidth={1.5} />
      {yRange.ticks.map(t => (
        <g key={`yt-${t}`}>
          <line x1={MARGIN.left - 5} y1={yScale(t)} x2={MARGIN.left} y2={yScale(t)} stroke="#374151" />
          {/* Light gridline */}
          <line x1={MARGIN.left} y1={yScale(t)} x2={MARGIN.left + CHART_W} y2={yScale(t)} stroke="#e5e7eb" strokeWidth={0.5} />
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

        const sliceName = arc.label ? `slice-${featSlug(arc.label)}` : `slice-${arc.index + 1}`;
        return (
          <g key={arc.index} {...feat(sliceName, { cx: cx + (r / 2) * Math.cos(arc.midAngle), cy: cy + (r / 2) * Math.sin(arc.midAngle), w: r + 20, h: r + 20 }, { width: WIDTH, height: HEIGHT })}>
            {/* Sector */}
            <path d={arcPath(arc.startAngle, arc.endAngle, r)} fill={c} stroke="#fff" strokeWidth={2} />

            {/* Leader line */}
            <line x1={edgeX} y1={edgeY} x2={lx} y2={ly} stroke="#9ca3af" strokeWidth={0.8} />

            {/* Label */}
            <text
              x={lx + (Math.cos(arc.midAngle) > 0 ? 4 : -4)}
              y={ly + 4}
              textAnchor={Math.cos(arc.midAngle) > 0 ? 'start' : 'end'}
              fontSize={10}
              fill="#374151"
            >
              {arc.label}{showPercentages ? ` (${pct})` : ''}
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
  const xTicks = niceRange(xLo, xHi, 8).ticks;

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
          so it stays legible against the light shade fill */}
      {probabilityLabel && shadeLabelX !== null && (
        <text
          x={toX(shadeLabelX)}
          y={MARGIN.top + CHART_H / 2}
          textAnchor="middle"
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

  return (
    <g>
      {/* gridlines */}
      {xRange.ticks.map((t) => (
        <line key={`gx-${t}`} x1={toX(t)} y1={MARGIN.top} x2={toX(t)} y2={MARGIN.top + CHART_H} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {yRange.ticks.map((t) => (
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
      {highlightPoint && (
        <text
          x={toX(highlightPoint.x) + 8}
          y={toY(highlightPoint.y) - 6}
          fontSize={11}
          fill="#16a34a"
          fontWeight={600}
        >
          {highlightPoint.label ?? `(${fmt(highlightPoint.x)}, ${fmt(highlightPoint.y)})`}
        </text>
      )}

      {/* axes */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + CHART_H} stroke="#374151" strokeWidth={1.5} />
      <line x1={MARGIN.left} y1={MARGIN.top + CHART_H} x2={MARGIN.left + CHART_W} y2={MARGIN.top + CHART_H} stroke="#374151" strokeWidth={1.5} />

      {/* tick labels */}
      {xRange.ticks.map((t) => (
        <g key={`xt-${t}`}>
          <line x1={toX(t)} y1={MARGIN.top + CHART_H} x2={toX(t)} y2={MARGIN.top + CHART_H + 4} stroke="#374151" strokeWidth={1} />
          <text x={toX(t)} y={MARGIN.top + CHART_H + 18} fontSize={11} textAnchor="middle" fill="#374151">{fmt(t)}</text>
        </g>
      ))}
      {yRange.ticks.map((t) => (
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

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 600, height: 'auto' }}
      role="img"
      aria-label={title ?? `${type} chart`}
    >
      {/* Title */}
      {title && (
        <text x={WIDTH / 2} y={22} textAnchor="middle" fontSize={15} fill="#111827" fontWeight={600}>
          {mathifyDollarSpans(title)}
        </text>
      )}

      {chart}
    </svg>
  );
}

export default StatsRenderer;
