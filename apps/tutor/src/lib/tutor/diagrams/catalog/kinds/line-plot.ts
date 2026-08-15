/** line_plot — solver. Dot plot showing frequency of each value above
 *  a number line. */

export interface LinePlotFigure {
  /** Sorted unique values that appear on the line. */
  axisValues: number[];
  /** Frequency for each axis value. Same length as axisValues. */
  frequencies: number[];
  title?: string;
  xLabel?: string;
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
  return {
    axisValues,
    frequencies,
    title: typeof params.title === 'string' ? params.title : undefined,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
  };
}
