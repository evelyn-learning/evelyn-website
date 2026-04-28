/** pie_chart — solver. Slices summing to a whole. Solver normalizes
 *  values to proportions; brain doesn't compute angles. */

export interface PieSlice { label: string; value: number; color?: string }
export interface PieChartFigure {
  slices: Array<PieSlice & { proportion: number }>;
  total: number;
  title?: string;
}

export function solvePieChart(params: Record<string, unknown>): PieChartFigure {
  if (!Array.isArray(params.slices) || params.slices.length === 0) {
    throw new Error('pie_chart: slices must be a non-empty array');
  }
  const raw = (params.slices as Array<Record<string, unknown>>).map((s, i) => {
    if (typeof s.label !== 'string' || !s.label.trim()) {
      throw new Error(`pie_chart: slices[${i}].label is required`);
    }
    if (typeof s.value !== 'number' || !Number.isFinite(s.value) || s.value < 0) {
      throw new Error(`pie_chart: slices[${i}].value must be a non-negative number`);
    }
    return {
      label: s.label,
      value: s.value,
      color: typeof s.color === 'string' ? s.color : undefined,
    };
  });
  const total = raw.reduce((s, x) => s + x.value, 0);
  if (total <= 0) {
    throw new Error('pie_chart: total of slice values must be positive');
  }
  return {
    slices: raw.map((s) => ({ ...s, proportion: s.value / total })),
    total,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
