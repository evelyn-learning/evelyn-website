/** line_plot — solver. Dot plot showing frequency of each value above
 *  a number line. */

export interface LinePlotFigure {
  /** Sorted unique values that appear on the line. */
  axisValues: number[];
  /** Frequency for each axis value. Same length as axisValues. */
  frequencies: number[];
  /** True numeric axis: its two ends and the tick values on it. Dots are
   *  placed by value on this scale (axisValues may be unevenly spaced). */
  min?: number;
  max?: number;
  ticks?: number[];
  title?: string;
  xLabel?: string;
}

/** The grid the data sits on: the largest step every value is a multiple
 *  of (0.25 for quarter-inch data), or undefined when there is none. */
function dataGrid(unique: number[]): number | undefined {
  if (unique.length < 2) return undefined;
  let g = 0;
  const gcd = (a: number, b: number): number => {
    while (b > 1e-9) { const t = a % b; a = b; b = t; }
    return a;
  };
  for (let i = 1; i < unique.length; i++) {
    const d = unique[i] - unique[i - 1];
    g = g === 0 ? d : gcd(Math.max(g, d), Math.min(g, d));
    if (g < 1e-6) return undefined;
  }
  // also anchor the grid to the values themselves (0.3, 0.8 → grid 0.5 from 0.3)
  return g;
}

function niceTickStep(span: number, target: number): number {
  const raw = span / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * mag >= raw) return m * mag;
  }
  return 10 * mag;
}

export function solveLinePlot(params: Record<string, unknown>): LinePlotFigure {
  if (!Array.isArray(params.values) || params.values.length === 0) {
    throw new Error('line_plot: values must be a non-empty array');
  }
  const values = params.values.map((v, i) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw new Error(`line_plot: values[${i}] must be a finite number`);
    }
    return v;
  });
  const sorted = [...values].sort((a, b) => a - b);
  // Build the axis: integer-aligned range covering min..max with step 1
  // when all values are integers; otherwise use unique sorted values.
  const allInt = sorted.every((v) => Number.isInteger(v));
  let axisValues: number[];
  if (allInt) {
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    axisValues = [];
    for (let v = min; v <= max; v++) axisValues.push(v);
  } else {
    axisValues = Array.from(new Set(sorted)).sort((a, b) => a - b);
  }
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const frequencies = axisValues.map((v) => counts.get(v) ?? 0);
  // Numeric axis. Tick on the data's own grid when that gives a readable
  // number of ticks; otherwise on a nice step that covers the range.
  const unique = Array.from(new Set(sorted)).sort((a, b) => a - b);
  const lo = unique[0];
  const hi = unique[unique.length - 1];
  let min = lo;
  let max = hi;
  let ticks: number[];
  const grid = allInt ? 1 : dataGrid(unique);
  if (hi === lo) {
    const pad = allInt ? 1 : Math.abs(lo) * 0.1 || 1;
    min = lo - pad; max = hi + pad;
    ticks = [min, lo, max];
  } else if (grid && (hi - lo) / grid <= 24) {
    ticks = [];
    const n = Math.round((hi - lo) / grid);
    for (let k = 0; k <= n; k++) ticks.push(Number((lo + k * grid).toFixed(8)));
  } else {
    const step = niceTickStep(hi - lo, 10);
    min = Math.floor(lo / step + 1e-9) * step;
    max = Math.ceil(hi / step - 1e-9) * step;
    ticks = [];
    const n = Math.round((max - min) / step);
    for (let k = 0; k <= n; k++) ticks.push(Number((min + k * step).toFixed(8)));
  }
  return {
    axisValues,
    frequencies,
    min,
    max,
    ticks,
    title: typeof params.title === 'string' ? params.title : undefined,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
  };
}
