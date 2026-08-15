/** bar_chart — solver. Categorical values with a numeric Y-axis. */

export interface BarChartFigure {
  categories: string[];
  values: number[];
  yLabel?: string;
  yMin: number;
  yMax: number;
  yStep: number;
  colors?: string[];
  title?: string;
}

function niceStep(span: number): number {
  const niceSteps = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000];
  for (const s of niceSteps) {
    const ticks = span / s;
    if (ticks >= 4 && ticks <= 10) return s;
  }
  return span / 6;
}

export function solveBarChart(params: Record<string, unknown>): BarChartFigure {
  const cats = params.categories;
  const vals = params.values;
  if (!Array.isArray(cats) || cats.length === 0 || !cats.every((c) => typeof c === 'string')) {
    throw new Error('bar_chart: categories must be a non-empty array of strings');
  }
  if (!Array.isArray(vals) || vals.length !== cats.length || !vals.every((v) => typeof v === 'number' && Number.isFinite(v))) {
    throw new Error(`bar_chart: values must be ${cats.length} numbers (one per category)`);
  }
  const min = Math.min(0, ...(vals as number[]));
  const max = Math.max(...(vals as number[]));
  const span = max - min || 1;
  const yStep = niceStep(span);
  const yMin = Math.floor(min / yStep) * yStep;
  const yMax = Math.ceil(max / yStep) * yStep;
  let colors: string[] | undefined;
  if (Array.isArray(params.colors)) {
    colors = (params.colors as unknown[]).map((c) => (typeof c === 'string' ? c : '#3b82f6'));
  }
  return {
    categories: cats as string[],
    values: vals as number[],
    yLabel: typeof params.yLabel === 'string' ? params.yLabel : undefined,
    yMin,
    yMax,
    yStep,
    colors,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
