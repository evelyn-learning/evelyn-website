/**
 * Validators for the data homework figures: showStats (box plot, histogram,
 * dot plot, bar, pie), showTable, showNumberLine, showScatterPlot,
 * showVennDiagram, showTree and showFractionBar. Structural: the chart must render as the
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

/** The region keys the Venn renderer places, by set count (VennDiagramRenderer TWO_/THREE_SET_REGION_CENTERS); any other key is not drawn. */
const VENN_REGION_KEYS: Record<2 | 3, readonly string[]> = {
  2: ['onlyA', 'onlyB', 'intersection', 'neither'],
  3: ['onlyA', 'onlyB', 'onlyC', 'AB', 'AC', 'BC', 'ABC', 'neither'],
};

/** A printed value (a region count, a node value): a number the text states when it reads as one, else a phrase of the text. */
function valueReason(value: unknown, where: string, text: string): string | null {
  if (value === undefined || value === '') return null;
  if (typeof value !== 'string') return `${where} must be a string`;
  const n = parseNumberCell(value);
  if (n !== null) return numberIsFromText(n, text) ? null : `number ${value} in ${where} does not come from the problem text`;
  return textFieldIsFromText(value, text) ? null : `${where} "${value}" does not come from the problem text`;
}

/**
 * showVennDiagram: 2 or 3 labelled sets; every region key one the renderer
 * places for that set count; every region's value (a count, or a word) and
 * item, every set label, the title and the universal label from the text.
 * A region count the sheet does not state (a complement, a total) fails.
 */
export function validateVennFigure(fig: Extract<FigureCommand, { action: 'showVennDiagram' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = Object.keys(f)
    .filter((k) => k !== 'action' && f[k] !== undefined && !['title', 'sets', 'regions', 'universalLabel'].includes(k))
    .map((k) => `showVennDiagram field "${k}" is not used by a Venn diagram`);
  reasons.push(...textFieldReasons([{ value: f.title }, { value: f.universalLabel }], text));
  const sets = f.sets;
  if (!Array.isArray(sets) || (sets.length !== 2 && sets.length !== 3)) return [...reasons, 'a Venn diagram needs 2 or 3 sets'];
  sets.forEach((raw, i) => {
    const s = (raw ?? {}) as Record<string, unknown>;
    if (typeof s.label !== 'string' || !s.label.trim()) { reasons.push(`Venn set ${i} needs a label`); return; }
    if (s.color !== undefined && typeof s.color !== 'string') reasons.push(`Venn set ${i}: color must be a string`);
    reasons.push(...textFieldReasons([{ value: s.label }], text));
  });
  const n = sets.length as 2 | 3;
  const regions = f.regions;
  if (regions === undefined) return reasons;
  if (!regions || typeof regions !== 'object' || Array.isArray(regions)) return [...reasons, 'Venn regions must be an object keyed by region'];
  for (const [k, raw] of Object.entries(regions as Record<string, unknown>)) {
    if (!VENN_REGION_KEYS[n].includes(k)) { reasons.push(`Venn region "${k}" does not belong to ${n} sets`); continue; }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { reasons.push(`Venn region "${k}" must be an object`); continue; }
    const r = raw as Record<string, unknown>;
    for (const extra of Object.keys(r).filter((x) => r[x] !== undefined && !['value', 'items', 'highlight'].includes(x))) {
      reasons.push(`Venn region "${k}" field "${extra}" is not used`);
    }
    if (r.highlight !== undefined && typeof r.highlight !== 'boolean') reasons.push(`Venn region "${k}": highlight must be true or false`);
    const v = valueReason(r.value, `regions.${k}.value`, text);
    if (v) reasons.push(v);
    if (r.items !== undefined) {
      if (!Array.isArray(r.items) || !r.items.every((x) => typeof x === 'string')) reasons.push(`Venn region "${k}": items must be an array of strings`);
      else reasons.push(...(r.items as string[]).map((item) => {
        const n2 = parseNumberCell(item);
        if (n2 !== null && numberIsFromText(n2, text)) return null;
        return textFieldIsFromText(item, text) ? null : `label "${item}" does not come from the problem text`;
      }).filter((x): x is string => x !== null));
    }
  }
  return reasons;
}

const TREE_TYPES = ['probability', 'factor', 'decision', 'generic'];
/** TreeRenderer's documented reach: up to 4 levels below the root, up to 6 branches per node. */
export const TREE_MAX_DEPTH = 4;
export const TREE_MAX_BRANCHES = 6;

/**
 * showTree: a root with at least one branch, every branch an edge wrapper
 * { label, probability?, node } (the live gate's shape), at most 4 levels and
 * 6 branches per node. Every node label and value and every branch label from
 * the text; a branch probability a number the text states (fractions by
 * value) and within [0, 1], or a phrase of the text. The root label is
 * optional (a blank root box). showLeafProbabilities prints the product of
 * each path's probabilities: rejected unless the text states every one.
 */
export function validateTreeFigure(fig: Extract<FigureCommand, { action: 'showTree' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = Object.keys(f)
    .filter((k) => k !== 'action' && f[k] !== undefined && !['title', 'type', 'root', 'showLeafProbabilities'].includes(k))
    .map((k) => `showTree field "${k}" is not used by a tree diagram`);
  if (f.type !== undefined && !TREE_TYPES.includes(String(f.type))) reasons.push(`tree type must be one of ${TREE_TYPES.join(', ')}`);
  if (f.showLeafProbabilities !== undefined && typeof f.showLeafProbabilities !== 'boolean') reasons.push('showLeafProbabilities must be true or false');
  reasons.push(...textFieldReasons([{ value: f.title }], text));
  const root = f.root;
  if (!root || typeof root !== 'object' || Array.isArray(root)) return [...reasons, 'a tree needs a root node { label, children }'];
  const rootKids = (root as Record<string, unknown>).children;
  if (!Array.isArray(rootKids) || rootKids.length === 0) return [...reasons, 'a tree needs at least one branch from the root'];

  const leafProducts: number[] = [];
  const walk = (node: Record<string, unknown>, path: string, depth: number, product: number) => {
    for (const k of Object.keys(node).filter((x) => node[x] !== undefined && !['label', 'value', 'color', 'children'].includes(x))) {
      reasons.push(`${path} field "${k}" is not used`);
    }
    if (node.label !== undefined && typeof node.label !== 'string') reasons.push(`${path}.label must be a string`);
    else reasons.push(...textFieldReasons([{ value: node.label }], text));
    if (node.color !== undefined && typeof node.color !== 'string') reasons.push(`${path}.color must be a string`);
    const v = valueReason(node.value, `${path}.value`, text);
    if (v) reasons.push(v);
    const children = node.children;
    if (children === undefined || (Array.isArray(children) && children.length === 0)) { leafProducts.push(product); return; }
    if (!Array.isArray(children)) { reasons.push(`${path}.children must be an array`); return; }
    if (depth >= TREE_MAX_DEPTH) { reasons.push(`the tree is deeper than ${TREE_MAX_DEPTH} levels`); return; }
    if (children.length > TREE_MAX_BRANCHES) { reasons.push(`${path} has more than ${TREE_MAX_BRANCHES} branches`); return; }
    children.forEach((raw, i) => {
      const where = `${path}.children[${i}]`;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { reasons.push(`${where} must be a branch { label, probability?, node }`); return; }
      const b = raw as Record<string, unknown>;
      for (const k of Object.keys(b).filter((x) => b[x] !== undefined && !['label', 'probability', 'node'].includes(x))) {
        reasons.push(`${where} field "${k}" is not used`);
      }
      if (b.label !== undefined && typeof b.label !== 'string') reasons.push(`${where}.label must be a string`);
      else reasons.push(...textFieldReasons([{ value: b.label }], text));
      let p = product;
      if (b.probability !== undefined && b.probability !== '') {
        if (typeof b.probability !== 'string') reasons.push(`${where}.probability must be a string ("2/5")`);
        else {
          const pv = parseNumberCell(b.probability);
          if (pv === null) {
            if (!textFieldIsFromText(b.probability, text)) reasons.push(`probability "${b.probability}" in ${where} does not come from the problem text`);
            p = NaN;
          } else {
            if (!numberIsFromText(pv, text)) reasons.push(`probability "${b.probability}" in ${where} does not come from the problem text`);
            if (f.type === 'probability' && (pv < 0 || pv > 1)) reasons.push(`probability "${b.probability}" in ${where} is not between 0 and 1`);
            p = product * pv;
          }
        }
      }
      if (!b.node || typeof b.node !== 'object' || Array.isArray(b.node)) { reasons.push(`${where} has no node (a branch is { label, probability?, node })`); return; }
      walk(b.node as Record<string, unknown>, `${where}.node`, depth + 1, p);
    });
  };
  walk(root as Record<string, unknown>, 'root', 0, 1);

  if (f.showLeafProbabilities === true && !leafProducts.every((p) => numberIsFromText(p, text))) {
    reasons.push('leaf probabilities are computed products, not stated: set showLeafProbabilities only when the text states every leaf\'s probability');
  }
  return reasons;
}

const FRACTION_STYLES = ['bar', 'circle', 'grid'];
/** The most parts one fraction item may be cut into (a hundredths grid); beyond that the board draws a smear of slivers. */
export const FRACTION_MAX_DENOMINATOR = 100;
/** The most items one fraction figure holds. */
export const FRACTION_MAX_ITEMS = 8;
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);

/**
 * showFractionBar: one item per shaded whole, an integer denominator > 0 (at
 * most 100) and an integer numerator 0..denominator (the board shades at most
 * every part, so an improper fraction would not draw as stated). Provenance:
 * the numerator and denominator are each stated, or the fraction is stated as
 * a value (a "3/4" token states 0.75, not 3 and 4); item labels and the title
 * from the text. showComparison draws alignment lines that compare the bars:
 * a comparison is the student's work, never drawn.
 */
export function validateFractionBarFigure(fig: Extract<FigureCommand, { action: 'showFractionBar' }>, ctx: FigureContext): string[] {
  const text = ctx.problemText;
  const f = fig as unknown as Record<string, unknown>;
  const reasons = Object.keys(f)
    .filter((k) => k !== 'action' && f[k] !== undefined && !['title', 'items', 'layout', 'showComparison'].includes(k))
    .map((k) => `showFractionBar field "${k}" is not used by a fraction bar`);
  if (f.layout !== undefined && f.layout !== 'vertical' && f.layout !== 'horizontal') reasons.push('fraction bar layout must be "vertical" or "horizontal"');
  if (f.showComparison !== undefined && f.showComparison !== false) reasons.push('a comparison is computed, not stated: leave showComparison off');
  reasons.push(...textFieldReasons([{ value: f.title }], text));
  const items = f.items;
  if (!Array.isArray(items) || items.length === 0) return [...reasons, 'a fraction bar needs at least one fraction item'];
  if (items.length > FRACTION_MAX_ITEMS) return [...reasons, `a fraction bar holds at most ${FRACTION_MAX_ITEMS} items`];
  items.forEach((raw, i) => {
    const where = `items[${i}]`;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { reasons.push(`${where} must be { numerator, denominator, label? }`); return; }
    const it = raw as Record<string, unknown>;
    for (const k of Object.keys(it).filter((x) => it[x] !== undefined && !['numerator', 'denominator', 'label', 'style'].includes(x))) {
      reasons.push(`${where} field "${k}" is not used`);
    }
    if (it.style !== undefined && !FRACTION_STYLES.includes(String(it.style))) reasons.push(`${where}: style must be one of ${FRACTION_STYLES.join(', ')}`);
    if (it.label !== undefined && typeof it.label !== 'string') reasons.push(`${where}: label must be a string`);
    else reasons.push(...textFieldReasons([{ value: it.label }], text));
    const { numerator: n, denominator: d } = it;
    if (!isInt(d) || d <= 0) { reasons.push(`${where}: denominator must be an integer > 0`); return; }
    if (d > FRACTION_MAX_DENOMINATOR) { reasons.push(`${where}: denominator must be at most ${FRACTION_MAX_DENOMINATOR}`); return; }
    if (!isInt(n) || n < 0) { reasons.push(`${where}: numerator must be an integer ≥ 0`); return; }
    if (n > d) { reasons.push(`${where}: ${n}/${d} has more shaded parts than parts (the board cannot draw an improper fraction in one whole)`); return; }
    const stated = (numberIsFromText(n, text) && numberIsFromText(d, text)) || numberIsFromText(n / d, text);
    if (!stated) reasons.push(`fraction ${n}/${d} in ${where} does not come from the problem text`);
  });
  return reasons;
}
