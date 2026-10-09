/**
 * distribution_curve — a normal curve with σ ticks and shaded intervals;
 * histogram — equal-width bins; box_plot — one or several on a shared axis.
 *
 * distribution_curve
 * { mean?: number (0); sd?: number (1);
 *   axis?: 'z' | 'x' | 'sigma' | 'none';   // what is printed under the σ ticks:
 *                                          //   'z' −3 … 3 · 'x' the values mean + kσ ·
 *                                          //   'sigma' "μ−2σ" … "μ+2σ" · 'none' nothing
 *                                          //   (default 'x'; with mean 0 and sd 1 that is z)
 *   shade?: Array<{ from: number | null; to: number | null;   // in the units of mean / sd;
 *                   label?: string }>;     //   null = that tail. `label` is printed under a
 *                                          //   bound that is not on a σ tick instead of its value
 *   showArea?: boolean (false);            // print each shaded area (4 decimals) — the answer to
 *                                          //   most questions, hence off by default
 *   xLabel?: string; title?: string }
 *
 * histogram
 * { binStart: number; binWidth: number; counts: number[] (1–20 whole numbers);
 *   xLabel?: string; yLabel?: string ('Frequency'); yMax?: number; yStep?: number;
 *   showCounts?: boolean (false);
 *   blankBins?: number[] }                // these bins are drawn as a dashed "?" box instead of a bar
 *                                         //   ("20 students in all — how many scored 10–15?")
 *
 * box_plot
 * { plots: Array<{ label?: string; min; q1; median; q3; max: number; outliers?: number[] }>;   // 1–4
 *   range?: [min, max]; step?: number; xLabel?: string; showValues?: boolean (false) }
 *
 * Shading is by drawn hatch lines under a clip path; two shaded intervals
 * get opposite hatches.
 */
import { SERIES_COLORS, TICK_FS, buildFrame, estWidth, n2, niceBounds, niceStep, tickText } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, blank, hatched, label, numText, text, type Box } from './draw';

/** Φ(z): the standard normal CDF, by the convergent series
 *  Φ(z) = ½ + φ(z)·Σ z^(2k+1) / (1·3·5···(2k+1)) — exact to double precision
 *  for |z| < 7, and 0 / 1 beyond 8.3. */
export function normalCdf(z: number): number {
  if (z < -8.3) return 0;
  if (z > 8.3) return 1;
  let term = z;
  let sum = z;
  for (let k = 1; k < 400; k++) {
    term = (term * z * z) / (2 * k + 1);
    sum += term;
    if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
  }
  return 0.5 + (sum * Math.exp((-z * z) / 2)) / Math.sqrt(2 * Math.PI);
}

export interface ShadeInterval {
  from: number | null;
  to: number | null;
  label?: string;
}
export interface DistributionModel {
  mean: number;
  sd: number;
  axis: 'z' | 'x' | 'sigma' | 'none';
  shade: ShadeInterval[];
  showArea: boolean;
  xLabel?: string;
  title?: string;
  /** The seven texts under μ − 3σ … μ + 3σ ('' when the axis prints none). */
  tickTexts: string[];
}

/** The proportion of a normal population between two bounds (null = that tail). */
export function normalArea(mean: number, sd: number, from: number | null, to: number | null): number {
  const hi = to === null ? 1 : normalCdf((to - mean) / sd);
  const lo = from === null ? 0 : normalCdf((from - mean) / sd);
  return hi - lo;
}

export function distributionModel(r: Reader): DistributionModel {
  const p = r.p;
  const mean = r.optNum(p.mean, 'mean') ?? 0;
  const sd = p.sd === undefined || p.sd === null ? 1 : r.positive(p.sd, 'sd');
  const axis = (p.axis ?? 'x') as DistributionModel['axis'];
  if (!['z', 'x', 'sigma', 'none'].includes(axis)) r.fail("axis must be 'z', 'x', 'sigma' or 'none'");
  const shade = (p.shade === undefined || p.shade === null ? [] : r.list(p.shade, 'shade', 0, 3)).map((raw, i): ShadeInterval => {
    const o = r.obj(raw, `shade[${i}]`);
    const from = o.from === null || o.from === undefined ? null : r.num(o.from, `shade[${i}].from`);
    const to = o.to === null || o.to === undefined ? null : r.num(o.to, `shade[${i}].to`);
    if (from === null && to === null) r.fail(`shade[${i}] needs from or to (null is a tail, not both)`);
    if (from !== null && to !== null && !(to > from)) r.fail(`shade[${i}].to must be greater than from`);
    for (const b of [from, to]) if (b !== null && Math.abs(b - mean) > 3.5 * sd) r.fail(`shade[${i}]: a bound more than 3.5 standard deviations from the mean is off the drawn curve`);
    return { from, to, label: r.optStr(o.label, `shade[${i}].label`, 8) };
  });
  const ks = [-3, -2, -1, 0, 1, 2, 3];
  const tickTexts = ks.map((k) => (axis === 'none' ? '' : axis === 'z' ? numText(k) : axis === 'x' ? numText(mean + k * sd, 4) : k === 0 ? 'μ' : `μ${k > 0 ? '+' : '−'}${Math.abs(k) === 1 ? '' : Math.abs(k)}σ`));
  return { mean, sd, axis, shade, showArea: r.bool(p.showArea, 'showArea', false), xLabel: r.optStr(p.xLabel, 'xLabel'), title: r.optStr(p.title, 'title', 160), tickTexts };
}

const BLUE = SERIES_COLORS[0];

export function renderDistributionCurve(r: Reader, uid: string): Drawn {
  const m = distributionModel(r);
  const { mean, sd } = m;
  const pdf = (x: number) => Math.exp(-(((x - mean) / sd) ** 2) / 2);
  const lo = mean - 3.6 * sd;
  const hi = mean + 3.6 * sd;
  // A second row under the tick numbers for bounds that fall between ticks.
  const offTick = (b: number | null) => b !== null && Math.abs((b - mean) / sd - Math.round((b - mean) / sd)) > 1e-9;
  const needsSecondRow = m.shade.some((s) => (offTick(s.from) || offTick(s.to)) && (m.axis === 'z' || m.axis === 'x' || s.label));
  const anyNumbers = m.axis !== 'none';
  const hasBlank = m.shade.some((s) => s.label === '?');
  const bottomExtra = (anyNumbers ? TICK_FS + 8 : 8) + (needsSecondRow || m.shade.some((s) => s.label) ? TICK_FS + 4 : 0) + (hasBlank ? 8 : 0);
  const f = buildFrame({ xRange: [lo, hi], yRange: [0, 1.14], xNumbers: false, yNumbers: false, aspect: 0.46, bottomExtra, xLabel: m.xLabel, title: m.title });
  const base = f.plot.y + f.plot.h;
  const parts: string[] = [];
  const defs: string[] = [];
  const over: string[] = [];
  m.shade.forEach((s, i) => {
    const a = s.from === null ? lo : s.from;
    const b = s.to === null ? hi : s.to;
    const pts: string[] = [`${n2(f.X(a))},${n2(base)}`];
    const N = 80;
    for (let k = 0; k <= N; k++) {
      const x = a + ((b - a) * k) / N;
      pts.push(`${n2(f.X(x))},${n2(f.Y(pdf(x)))}`);
    }
    pts.push(`${n2(f.X(b))},${n2(base)}`);
    const bbox: Box = { x0: f.X(a), y0: f.plot.y, x1: f.X(b), y1: base };
    const h = hatched(`${uid}-shade${i}`, `<polygon points="${pts.join(' ')}"`, bbox, i % 2 === 0 ? '/' : '\\', BLUE, { gap: 6, width: 1 });
    defs.push(h.def);
    parts.push(h.svg);
    for (const [bound, isTail] of [[s.from, s.from === null], [s.to, s.to === null]] as Array<[number | null, boolean]>) {
      if (isTail || bound === null) continue;
      parts.push(`<line x1="${n2(f.X(bound))}" y1="${n2(base)}" x2="${n2(f.X(bound))}" y2="${n2(f.Y(pdf(bound)))}" stroke="${BLUE}" stroke-width="1.5"/>`);
      if (offTick(bound)) {
        const shown = s.label ?? (m.axis === 'z' ? numText((bound - mean) / sd, 3) : m.axis === 'x' ? numText(bound, 4) : '');
        over.push(`<line x1="${n2(f.X(bound))}" y1="${n2(base)}" x2="${n2(f.X(bound))}" y2="${n2(base + (anyNumbers ? TICK_FS + 8 : 5))}" stroke="${BLUE}" stroke-width="1.2"/>`);
        if (shown) over.push(label({ x: f.X(bound), y: base + (anyNumbers ? TICK_FS + 8 : 5) + TICK_FS + (shown === '?' ? 4 : 0), anchor: 'middle' }, shown, { weight: 700, fill: BLUE }));
      } else if (s.label) {
        over.push(label({ x: f.X(bound), y: base + (anyNumbers ? TICK_FS + 8 : 5) + TICK_FS + (s.label === '?' ? 4 : 0), anchor: 'middle' }, s.label, { weight: 700, fill: BLUE }));
      }
    }
    if (m.showArea) {
      const area = normalArea(mean, sd, s.from, s.to).toFixed(4);
      const mid = s.from === null ? b - 0.9 * sd : s.to === null ? a + 0.9 * sd : (a + b) / 2;
      const room = base - f.Y(pdf(mid));
      if ((s.from === null || s.to === null) && room < 34) {
        // A thin tail: the number goes above it, clear of the curve, on the outer side.
        const z = Math.max(2.25, Math.abs(((s.from === null ? b : a) - mean) / sd) + 0.25);
        const x = s.from === null ? f.X(mean - z * sd) : f.X(mean + z * sd);
        over.push(text(x, base - 19, area, { anchor: s.from === null ? 'end' : 'start', weight: 700, halo: true }));
      } else if (room < 34 || f.X(b) - f.X(a) < 44) {
        // A narrow or low strip: above the curve over its middle.
        over.push(text(f.X(mid), Math.max(f.plot.y + TICK_FS + 2, f.Y(pdf(mid)) - 9), area, { anchor: 'middle', weight: 700, halo: true }));
      } else {
        const plateW = area.length * TICK_FS * 0.6 + 8;
        const ty = base - Math.min(room * 0.45, 40);
        over.push(`<rect x="${n2(f.X(mid) - plateW / 2)}" y="${n2(ty - TICK_FS)}" width="${n2(plateW)}" height="${n2(TICK_FS + 5)}" rx="2" fill="#ffffff"/>`);
        over.push(text(f.X(mid), ty, area, { anchor: 'middle', weight: 700 }));
      }
    }
  });
  const curve: string[] = [];
  for (let k = 0; k <= 200; k++) {
    const x = lo + ((hi - lo) * k) / 200;
    curve.push(`${k === 0 ? 'M' : 'L'}${n2(f.X(x))},${n2(f.Y(pdf(x)))}`);
  }
  parts.push(`<path d="${curve.join('')}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`);
  // σ ticks on the baseline, and what the axis prints under them.
  m.tickTexts.forEach((s, i) => {
    const x = f.X(mean + (i - 3) * sd);
    parts.push(`<line x1="${n2(x)}" y1="${n2(base)}" x2="${n2(x)}" y2="${n2(base + 5)}" stroke="${INK}" stroke-width="1.3"/>`);
    if (s) parts.push(text(x, base + TICK_FS + 6, s, { anchor: 'middle', fill: MUTED }));
  });
  const facts: FigureFacts = { plot: undefined, curveCount: 1, marks: [], curves: [], notes: [] };
  if (m.shade.length > 2) facts.notes?.push({ code: 'too_many_elements', message: '3 shaded intervals — only two hatch directions tell regions apart' });
  return { body: `<defs>${defs.join('')}</defs>${f.svg}${parts.join('')}${over.join('')}`, H: f.bottom, facts };
}

// ---------------------------------------------------------------------------
// histogram
// ---------------------------------------------------------------------------

export interface HistogramModel {
  binStart: number;
  binWidth: number;
  counts: number[];
  edges: number[];
  xLabel?: string;
  yLabel: string;
  yMax: number;
  yStep: number;
  showCounts: boolean;
  /** Every `labelEvery`-th class boundary is numbered (1 = all of them). */
  labelEvery: number;
  /** Per bin: drawn as a "?" instead of its bar. */
  blank: boolean[];
  title?: string;
}

export function histogramModel(r: Reader): HistogramModel {
  const p = r.p;
  const binStart = r.num(p.binStart, 'binStart');
  const binWidth = r.positive(p.binWidth, 'binWidth');
  const counts = r.list(p.counts, 'counts', 1, 20).map((v, i) => {
    const c = r.num(v, `counts[${i}]`);
    if (!Number.isInteger(c) || c < 0) r.fail('counts must be whole numbers ≥ 0');
    return c;
  });
  const blankBins = counts.map(() => false);
  if (p.blankBins !== undefined && p.blankBins !== null) {
    r.list(p.blankBins, 'blankBins', 0, counts.length).forEach((raw, i) => {
      const k = r.num(raw, `blankBins[${i}]`);
      if (!Number.isInteger(k) || k < 0 || k >= counts.length) r.fail(`blankBins[${i}] must be the index of a bin (0 to ${counts.length - 1})`);
      blankBins[k] = true;
    });
  }
  // The axis is sized from the bars that ARE drawn, so its top does not hint at a blank one.
  const top = Math.max(1, ...counts.filter((_, i) => !blankBins[i]));
  const b = niceBounds(0, top, 6);
  const yStep = r.optStep(p.yStep, 'yStep') ?? Math.max(1, b.step);
  const showCounts = r.bool(p.showCounts, 'showCounts', false);
  let autoMax = Math.max(Math.ceil(top / yStep - 1e-9) * yStep, yStep);
  // Room above the tallest bar for its printed count.
  if (showCounts && autoMax - top < yStep * 0.6) autoMax += yStep;
  const yMax = r.optNum(p.yMax, 'yMax') ?? autoMax;
  if (yMax < top) r.fail('yMax is below the tallest bin');
  const edges = counts.map((_, i) => Number((binStart + i * binWidth).toPrecision(12)));
  edges.push(Number((binStart + counts.length * binWidth).toPrecision(12)));
  // Decided here (on the nominal plot width), not while drawing, so the transcription can say it.
  const labelEvery = Math.max(1, Math.ceil((Math.max(...edges.map((e) => estWidth(tickText(e, binWidth), TICK_FS))) + 5) / (290 / counts.length)));
  return { binStart, binWidth, counts, edges, labelEvery, xLabel: r.optStr(p.xLabel, 'xLabel'), yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'Frequency', yMax, yStep, showCounts, blank: blankBins, title: r.optStr(p.title, 'title', 160) };
}

export function renderHistogram(r: Reader): Drawn {
  const m = histogramModel(r);
  const n = m.counts.length;
  const f = buildFrame({ xRange: [m.edges[0], m.edges[n]], yRange: [0, m.yMax], yStep: m.yStep, yLabel: m.yLabel, xLabel: m.xLabel, title: m.title, aspect: 0.66, xNumbers: false, bottomExtra: TICK_FS + 8 });
  const base = f.plot.y + f.plot.h;
  const parts: string[] = [f.svg];
  m.counts.forEach((c, i) => {
    const xa = f.X(m.edges[i]);
    const xb = f.X(m.edges[i + 1]);
    if (m.blank[i]) {
      parts.push(blank((xa + xb) / 2, base - 16, Math.min(26, xb - xa - 4), 22, 13));
      return;
    }
    if (c > 0) parts.push(`<rect x="${n2(xa)}" y="${n2(f.Y(c))}" width="${n2(xb - xa)}" height="${n2(base - f.Y(c))}" fill="${BLUE}" stroke="#ffffff" stroke-width="1.2"/>`);
    if (m.showCounts) parts.push(text((xa + xb) / 2, f.Y(c) - 4, String(c), { anchor: 'middle', weight: 600, halo: true }));
  });
  parts.push(`<line x1="${n2(f.plot.x)}" y1="${n2(base)}" x2="${n2(f.plot.x + f.plot.w)}" y2="${n2(base)}" stroke="${INK}" stroke-width="1.4"/>`);
  // Bin edges: a tick at every one, numbers thinned so neighbours never touch.
  const texts = m.edges.map((e) => tickText(e, m.binWidth));
  const every = m.labelEvery;
  m.edges.forEach((e, i) => {
    parts.push(`<line x1="${n2(f.X(e))}" y1="${n2(base)}" x2="${n2(f.X(e))}" y2="${n2(base + 4)}" stroke="${INK}" stroke-width="1.2"/>`);
    if (i % every === 0) parts.push(text(f.X(e), base + TICK_FS + 5, texts[i], { anchor: 'middle', fill: MUTED }));
  });
  const notes: NonNullable<FigureFacts['notes']> = [];
  if (m.blank.every(Boolean)) notes.push({ code: 'ambiguous_blank', message: 'every bin is blank — nothing is left to read' });
  if (n > 14) notes.push({ code: 'too_many_elements', message: `${n} bins — more than 14 leave bars under 22 units wide at 340 px` });
  if (every > 2) notes.push({ code: 'crowded', message: `only every ${every}${every === 3 ? 'rd' : 'th'} bin edge is numbered — the others must be counted` });
  return { body: parts.join(''), H: f.bottom, facts: { plot: f.plot, curveCount: 0, marks: [], curves: [], notes } };
}

// ---------------------------------------------------------------------------
// box_plot
// ---------------------------------------------------------------------------

export interface BoxPlot {
  label?: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}
export interface BoxPlotModel {
  plots: BoxPlot[];
  range: [number, number];
  step?: number;
  xLabel?: string;
  showValues: boolean;
  title?: string;
}

export function boxPlotModel(r: Reader): BoxPlotModel {
  const p = r.p;
  const plots = r.list(p.plots, 'plots', 1, 4).map((raw, i): BoxPlot => {
    const o = r.obj(raw, `plots[${i}]`);
    const at = `plots[${i}]`;
    const [min, q1, median, q3, max] = (['min', 'q1', 'median', 'q3', 'max'] as const).map((k) => r.num(o[k], `${at}.${k}`));
    if (!(min <= q1 && q1 <= median && median <= q3 && q3 <= max) || !(max > min)) r.fail(`${at} must have min ≤ q1 ≤ median ≤ q3 ≤ max (and max greater than min)`);
    const outliers = (o.outliers === undefined || o.outliers === null ? [] : r.list(o.outliers, `${at}.outliers`, 0, 8)).map((v, k) => {
      const x = r.num(v, `${at}.outliers[${k}]`);
      if (x >= min && x <= max) r.fail(`${at}.outliers[${k}]: an outlier must lie outside min..max (the whisker ends)`);
      return x;
    });
    return { label: r.optStr(o.label, `${at}.label`, 16), min, q1, median, q3, max, outliers };
  });
  const all = plots.flatMap((b) => [b.min, b.max, ...b.outliers]);
  let range = r.optRange(p.range, 'range');
  const step = r.optStep(p.step, 'step');
  if (!range) {
    const b = niceBounds(Math.min(...all), Math.max(...all), 8);
    range = [b.min, b.max];
  }
  if (Math.min(...all) < range[0] || Math.max(...all) > range[1]) r.fail('range does not contain every plot (whiskers and outliers)');
  return { plots, range, step, xLabel: r.optStr(p.xLabel, 'xLabel'), showValues: r.bool(p.showValues, 'showValues', false), title: r.optStr(p.title, 'title', 160) };
}

export function renderBoxPlot(r: Reader): Drawn {
  const m = boxPlotModel(r);
  const n = m.plots.length;
  const labelW = Math.max(0, ...m.plots.map((b) => (b.label ? estWidth(b.label, TICK_FS) : 0)));
  const rowH = m.showValues ? 56 : 46;
  const base = { xRange: m.range, yRange: [0, n] as [number, number], xStep: m.step ?? niceStep(m.range[1] - m.range[0], 8), yNumbers: false, xLabel: m.xLabel, title: m.title, zeroAxes: false, minLeft: labelW > 0 ? Math.max(34, Math.ceil(labelW) + 12) : 14 };
  let f = buildFrame({ ...base, aspect: 0.3 });
  f = buildFrame({ ...base, aspect: (n * rowH + 10) / f.plot.w });
  const parts: string[] = [f.svg];
  const notes: NonNullable<FigureFacts['notes']> = [];
  const minor = f.plot.w / ((m.range[1] - m.range[0]) / ((m.step ?? niceStep(m.range[1] - m.range[0], 8)) / 2));
  if (minor < 6) notes.push({ code: 'crowded', message: 'the gridlines are under 6 units apart — values cannot be read off the axis' });
  m.plots.forEach((b, i) => {
    const cy = f.plot.y + 5 + rowH * i + rowH / 2 + (m.showValues ? 5 : 0);
    const hb = 13;
    const X = f.X;
    parts.push(`<path d="M${n2(X(b.min))},${n2(cy)}H${n2(X(b.q1))}M${n2(X(b.q3))},${n2(cy)}H${n2(X(b.max))}M${n2(X(b.min))},${n2(cy - 7)}v14M${n2(X(b.max))},${n2(cy - 7)}v14" fill="none" stroke="${INK}" stroke-width="1.8"/>`);
    parts.push(`<rect x="${n2(X(b.q1))}" y="${n2(cy - hb)}" width="${n2(Math.max(0.8, X(b.q3) - X(b.q1)))}" height="${2 * hb}" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>`);
    parts.push(`<line x1="${n2(X(b.median))}" y1="${n2(cy - hb)}" x2="${n2(X(b.median))}" y2="${n2(cy + hb)}" stroke="${BLUE}" stroke-width="3"/>`);
    for (const o of b.outliers) parts.push(`<circle cx="${n2(X(o))}" cy="${n2(cy)}" r="3.4" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`);
    if (b.label === '?') parts.push(blank(f.plot.x - 18, cy, 20, 18, 12));
    else if (b.label) parts.push(text(f.plot.x - 7, cy + TICK_FS * 0.36, b.label, { anchor: 'end', weight: 600 }));
    if (m.showValues) {
      for (const v of [...new Set([b.min, b.q1, b.median, b.q3, b.max])]) parts.push(text(X(v), cy - hb - 4, numText(v, 4), { anchor: 'middle', weight: 600, halo: true }));
    }
  });
  return { body: parts.join(''), H: f.bottom, facts: { plot: undefined, curveCount: 0, marks: [], curves: [], notes } };
}
