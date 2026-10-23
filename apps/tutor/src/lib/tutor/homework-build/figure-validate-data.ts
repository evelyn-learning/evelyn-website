/**
 * Validators for the data homework figures: showStats (box plot, histogram,
 * dot plot, bar, pie), showTable, showNumberLine and showScatterPlot. Structural: the chart must render as the
 * sheet shows it. Provenance: every drawn number is one the problem text
 * states (numberIsFromText) and every free-text field comes from the text
 * (textFieldReasons). A number the renderer would compute (pie percentages,
 * bins from raw data) is drawn only when the text states it. Pure.
 */

import { numberIsFromText, parseNumberCell, textFieldIsFromText, textFieldReasons } from './figure-text';
import type { FigureContext } from './figure-validate';
import type { FigureCommand, StatsFigure } from './types';

/** The top-level fields each chart type reads; anything else would be ignored by the renderer or draw something the sheet does not. */
const STATS_FIELDS: Record<string, readonly string[]> = {
  boxplot: ['title', 'xLabel', 'boxplot'],
  histogram: ['title', 'xLabel', 'yLabel', 'bins', 'showCounts'],
  dotplot: ['title', 'xLabel', 'data'],
  bar: ['title', 'xLabel', 'yLabel', 'bar'],
  pie: ['title', 'pie'],
};

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function validateStatsFigure(fig: StatsFigure, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const type = String(fig.type);
  const reasons: string[] = [];
  const num = (v: number, where: string) => {
    if (!numberIsFromText(v, text)) reasons.push(`number ${v} in ${where} does not come from the problem text`);
  };

  const used = STATS_FIELDS[type] ?? [];
  for (const k of Object.keys(f)) {
    if (k === 'action' || k === 'type' || f[k] === undefined || used.includes(k)) continue;
    if (type === 'histogram' && k === 'data') continue;   // named below, with its own reason
    reasons.push(`showStats field "${k}" is not used by a ${type}`);
  }
  reasons.push(...textFieldReasons([
    { value: f.title },
    { value: f.xLabel, axis: true },
    { value: f.yLabel, axis: true },
  ], text));

  if (type === 'boxplot') {
    const datasets = (f.boxplot as { datasets?: unknown } | undefined)?.datasets;
    if (!Array.isArray(datasets) || datasets.length === 0) return [...reasons, 'a box plot needs at least one dataset in boxplot.datasets'];
    datasets.forEach((raw, i) => {
      const d = (raw ?? {}) as Record<string, unknown>;
      const five = ['min', 'q1', 'median', 'q3', 'max'] as const;
      const bad = five.filter((k) => !isNum(d[k]));
      if (bad.length) { reasons.push(`box plot ${i}: ${bad.join(', ')} must be numbers`); return; }
      const [min, q1, median, q3, max] = five.map((k) => d[k] as number);
      if (!(min <= q1 && q1 <= median && median <= q3 && q3 <= max)) reasons.push(`box plot ${i}: min ≤ q1 ≤ median ≤ q3 ≤ max fails`);
      for (const k of five) num(d[k] as number, `boxplot.datasets[${i}].${k}`);
      const outliers = d.outliers === undefined ? [] : d.outliers;
      if (!Array.isArray(outliers)) reasons.push(`box plot ${i}: outliers must be an array of numbers`);
      else outliers.forEach((o, j) => {
        if (!isNum(o)) { reasons.push(`box plot ${i}: outlier ${String(o)} is not a number`); return; }
        if (o >= min && o <= max) reasons.push(`box plot ${i}: outlier ${o} is inside the whiskers`);
        num(o, `boxplot.datasets[${i}].outliers[${j}]`);
      });
      reasons.push(...textFieldReasons([{ value: d.label }], text));
    });
  } else if (type === 'histogram') {
    if (f.data !== undefined) reasons.push('a histogram takes bins only (raw data would be binned by the renderer)');
    const bins = f.bins;
    if (!Array.isArray(bins) || bins.length === 0) return [...reasons, 'a histogram needs non-empty bins [[lo, hi, count], …]'];
    let prevHi: number | null = null;
    bins.forEach((b, i) => {
      if (!Array.isArray(b) || b.length !== 3 || !b.every(isNum)) { reasons.push(`histogram bin ${i} must be [lo, hi, count] numbers`); prevHi = null; return; }
      const [lo, hi, count] = b as number[];
      if (!(lo < hi)) reasons.push(`histogram bin ${i}: lo < hi fails`);
      if (!Number.isInteger(count) || count < 0) reasons.push(`histogram bin ${i}: count ${count} must be a non-negative integer`);
      if (prevHi !== null && prevHi !== lo) reasons.push(`histogram bins are not contiguous at ${prevHi} / ${lo}`);
      prevHi = hi;
      num(lo, `bins[${i}][0]`); num(hi, `bins[${i}][1]`); num(count, `bins[${i}][2]`);
    });
  } else if (type === 'dotplot') {
    const data = f.data;
    if (!Array.isArray(data) || data.length === 0) return [...reasons, 'a dot plot needs non-empty data (one value per dot)'];
    if (!data.every(isNum)) return [...reasons, 'dot plot data must be finite numbers'];
    const counts = new Map<number, number>();
    for (const v of data as number[]) counts.set(v, (counts.get(v) ?? 0) + 1);
    for (const [v, c] of [...counts].sort((a, b) => a[0] - b[0])) {
      num(v, 'data');
      if (c !== 1 && !numberIsFromText(c, text)) reasons.push(`dot plot: ${c} dots at ${v} is not stated in the problem text`);
    }
  } else if (type === 'bar') {
    const bar = (f.bar ?? {}) as { categories?: unknown; values?: unknown };
    const { categories, values } = bar;
    if (!Array.isArray(categories) || !Array.isArray(values) || categories.length === 0 || categories.length !== values.length) {
      return [...reasons, 'a bar chart needs categories and values of the same non-zero length'];
    }
    reasons.push(...textFieldReasons(categories.map((c) => ({ value: c })), text));
    values.forEach((v, i) => {
      if (!isNum(v)) reasons.push(`bar value ${i} must be a number`);
      else num(v, `bar.values[${i}]`);
    });
  } else if (type === 'pie') {
    const pie = (f.pie ?? {}) as { slices?: unknown; showPercentages?: unknown };
    const slices = pie.slices;
    if (!Array.isArray(slices) || slices.length < 2) return [...reasons, 'a pie chart needs at least two slices'];
    let allPositive = true;
    slices.forEach((raw, i) => {
      const s = (raw ?? {}) as { label?: unknown; value?: unknown };
      if (!isNum(s.value) || s.value <= 0) { reasons.push(`pie slice "${String(s.label)}" value must be positive`); allPositive = false; return; }
      num(s.value, `pie.slices[${i}].value`);
      reasons.push(...textFieldReasons([{ value: s.label }], text));
    });
    if (pie.showPercentages === true && allPositive) {
      const vals = (slices as Array<{ value: number }>).map((s) => s.value);
      const sum = vals.reduce((a, b) => a + b, 0);
      // As the renderer prints them: one decimal place.
      const pcts = vals.map((v) => Number(((v / sum) * 100).toFixed(1)));
      if (!pcts.every((p) => numberIsFromText(p, text))) reasons.push('pie percentages are computed, not stated: set showPercentages only when the text states every slice\'s percentage');
    }
  }
  return reasons;
}

/** Fields a command's renderer reads; any other field is named (the renderer would ignore it, or it would draw what the sheet does not). */
function unusedFieldReasons(f: Record<string, unknown>, used: readonly string[]): string[] {
  const action = String(f.action);
  return Object.keys(f)
    .filter((k) => k !== 'action' && f[k] !== undefined && !used.includes(k))
    .map((k) => `${action} field "${k}" is not used by a ${action === 'showTable' ? 'table' : action === 'showNumberLine' ? 'number line' : 'scatter plot'}`);
}

/** A header or cell is blank, a phrase of the text, or a number the text states. */
function cellIsFromText(cell: string, text: string): boolean {
  if (cell.trim() === '') return true;
  if (textFieldIsFromText(cell, text)) return true;
  const n = parseNumberCell(cell);
  return n !== null && numberIsFromText(n, text);
}

/**
 * showTable: at least one header and one row, every row as long as the
 * headers (rows numbered from 1 in the reason), every header and cell from the
 * text (a cell the sheet leaves blank is ""). A stem-and-leaf display is a
 * two-column table under the same rules. Size is not limited here (a long
 * table is valid data; the thumbnail shows its first rows).
 */
export function validateTableFigure(fig: Extract<FigureCommand, { action: 'showTable' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = unusedFieldReasons(f, ['headers', 'rows']);
  const { headers, rows } = f;
  if (!Array.isArray(headers) || headers.length === 0) reasons.push('a table needs at least one header');
  if (!Array.isArray(rows) || rows.length === 0) reasons.push('a table needs at least one row');
  if (reasons.length) return reasons;
  const h = (headers as unknown[]).length;
  const check = (cell: unknown) => {
    if (typeof cell !== 'string') { reasons.push(`table cell ${JSON.stringify(cell)} must be a string`); return; }
    if (!cellIsFromText(cell, text)) reasons.push(`table cell "${cell}" does not come from the problem text`);
  };
  (headers as unknown[]).forEach(check);
  (rows as unknown[]).forEach((row, i) => {
    if (!Array.isArray(row)) { reasons.push(`table row ${i + 1} must be an array of cells`); return; }
    if (row.length !== h) reasons.push(`table row ${i + 1} has ${row.length} cells, headers have ${h}`);
    row.forEach(check);
  });
  return reasons;
}

/**
 * showNumberLine: min < max and step > 0 are scaffolding (not checked against
 * the text, like graph ranges). Every point, interval end and segment end lies
 * in [min, max] and is a number the text states — except an interval end at
 * min or max (a ray running off the line). The fraction-tick denominator is
 * stated too; the title and every label come from the text.
 */
export function validateNumberLineFigure(fig: Extract<FigureCommand, { action: 'showNumberLine' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = unusedFieldReasons(f, ['title', 'min', 'max', 'step', 'points', 'intervals', 'segments', 'fractionTicks']);
  const { min, max, step } = f;
  if (!isNum(min) || !isNum(max)) return [...reasons, 'a number line needs numeric min and max'];
  if (!(min < max)) return [...reasons, `number line min < max fails (${min}, ${max})`];
  if (step !== undefined && (!isNum(step) || step <= 0)) reasons.push('number line step must be > 0');
  reasons.push(...textFieldReasons([{ value: f.title }], text));

  const list = (key: string): Array<Record<string, unknown>> => {
    const v = f[key];
    if (v === undefined) return [];
    if (!Array.isArray(v)) { reasons.push(`number line ${key} must be an array`); return []; }
    return v.map((x) => (x ?? {}) as Record<string, unknown>);
  };
  const place = (v: unknown, where: string, rayEndOk: boolean) => {
    if (!isNum(v)) { reasons.push(`number line ${where} must be a number`); return; }
    if (v < min || v > max) { reasons.push(`number line point ${v} is outside [${min}, ${max}]`); return; }
    if (rayEndOk && (v === min || v === max)) return;
    if (!numberIsFromText(v, text)) reasons.push(`number ${v} in ${where} does not come from the problem text`);
  };
  list('points').forEach((p, i) => {
    place(p.value, `points[${i}].value`, false);
    if (p.style !== undefined && p.style !== 'filled' && p.style !== 'open') reasons.push(`number line point ${i}: style must be "filled" or "open"`);
    reasons.push(...textFieldReasons([{ value: p.label }], text));
  });
  list('intervals').forEach((iv, i) => {
    place(iv.from, `intervals[${i}].from`, true);
    place(iv.to, `intervals[${i}].to`, true);
    if (isNum(iv.from) && isNum(iv.to) && !(iv.from < iv.to)) reasons.push(`number line interval ${i}: from < to fails`);
    reasons.push(...textFieldReasons([{ value: iv.label }], text));
  });
  list('segments').forEach((sg, i) => {
    place(sg.from, `segments[${i}].from`, false);
    place(sg.to, `segments[${i}].to`, false);
    reasons.push(...textFieldReasons([{ value: sg.label }], text));
  });
  if (f.fractionTicks !== undefined) {
    const d = (f.fractionTicks ?? {}) as Record<string, unknown>;
    if (!isNum(d.denominator) || !Number.isInteger(d.denominator) || d.denominator < 1) reasons.push('number line fractionTicks.denominator must be a positive integer');
    else if (!numberIsFromText(d.denominator, text)) reasons.push(`number ${d.denominator} in fractionTicks.denominator does not come from the problem text`);
  }
  return reasons;
}

const TREND_LINE_REASON = 'a trend line is drawn by least squares with a computed R²; it is never part of a homework figure';

/**
 * showScatterPlot: at least one point; every x and y finite and stated by the
 * text; point labels, series, title, axis labels and notes from the text.
 * xRange / yRange are scaffolding (two numbers, lo < hi, every point inside).
 * A trend line is always rejected: the renderer fits it itself and always
 * prints R² (a computed value), so even a stated equation would draw one.
 */
export function validateScatterFigure(fig: Extract<FigureCommand, { action: 'showScatterPlot' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = unusedFieldReasons(f, ['title', 'xLabel', 'yLabel', 'points', 'xRange', 'yRange', 'notes', 'showTrendLine', 'trendLineEquation']);
  if (f.showTrendLine === true || f.trendLineEquation !== undefined) reasons.push(TREND_LINE_REASON);
  reasons.push(...textFieldReasons([
    { value: f.title },
    { value: f.xLabel, axis: true },
    { value: f.yLabel, axis: true },
    { value: f.notes },
  ], text));
  const range = (key: 'xRange' | 'yRange'): [number, number] | null => {
    const r = f[key];
    if (r === undefined) return null;
    if (!Array.isArray(r) || r.length !== 2 || !r.every(isNum) || !(r[0] < r[1])) { reasons.push(`scatter ${key} must be [lo, hi] with lo < hi`); return null; }
    return r as [number, number];
  };
  const xr = range('xRange');
  const yr = range('yRange');
  const points = f.points;
  if (!Array.isArray(points) || points.length === 0) return [...reasons, 'a scatter plot needs at least one point'];
  points.forEach((raw, i) => {
    const p = (raw ?? {}) as Record<string, unknown>;
    if (!isNum(p.x) || !isNum(p.y)) { reasons.push(`scatter point ${i}: x and y must be finite numbers`); return; }
    if (!numberIsFromText(p.x, text)) reasons.push(`number ${p.x} in points[${i}].x does not come from the problem text`);
    if (!numberIsFromText(p.y, text)) reasons.push(`number ${p.y} in points[${i}].y does not come from the problem text`);
    if ((xr && (p.x < xr[0] || p.x > xr[1])) || (yr && (p.y < yr[0] || p.y > yr[1]))) reasons.push(`scatter point (${p.x}, ${p.y}) is outside xRange/yRange`);
    reasons.push(...textFieldReasons([{ value: p.label }, { value: p.series }], text));
  });
  return reasons;
}
