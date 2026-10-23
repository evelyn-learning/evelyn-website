/**
 * Validators for the data-chart homework figures (showStats: box plot,
 * histogram, dot plot, bar, pie). Structural: the chart must render as the
 * sheet shows it. Provenance: every drawn number is one the problem text
 * states (numberIsFromText) and every free-text field comes from the text
 * (textFieldReasons). A number the renderer would compute (pie percentages,
 * bins from raw data) is drawn only when the text states it. Pure.
 */

import { numberIsFromText, textFieldReasons } from './figure-text';
import type { FigureContext } from './figure-validate';
import type { StatsFigure } from './types';

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
