/**
 * Statistics diagram kinds (AP Statistics focused):
 *   - histogram: frequency distribution with explicit bin intervals
 *     (distinct from bar_chart: bars TOUCH, bins are intervals)
 *   - normal_curve: bell curve N(μ, σ) with optional shaded probability
 *     region and labeled SD markers (empirical rule, z-scores, p-values)
 *   - scatterplot_regression: bivariate data with LSRL overlay
 *
 * Convention: brain pre-supplies data and any pre-computed statistics
 * (mean, median, regression coefficients, r). Solver validates ranges
 * and supplies defaults. Renderer just draws.
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';

interface HistogramBin { lower: number; upper: number; count: number }

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

// ── histogram ───────────────────────────────────────────────────────────

export interface HistogramFigure {
  bins: HistogramBin[];
  xMin: number; xMax: number; yMax: number;
  xLabel?: string;
  yLabel: string;
  title?: string;
  showCounts: boolean;
  mean?: number;
  median?: number;
  mode: 'count' | 'relative';
}

export function solveHistogram(params: Record<string, unknown>): HistogramFigure {
  if (!Array.isArray(params.bins) || params.bins.length === 0) {
    throw new Error('bins must be a non-empty array of {lower,upper,count} or [lower,upper,count]');
  }
  const bins: HistogramBin[] = (params.bins as unknown[]).map((b, i): HistogramBin => {
    if (Array.isArray(b)) {
      if (!isFiniteNumber(b[0]) || !isFiniteNumber(b[1]) || !isFiniteNumber(b[2])) {
        throw new Error(`bins[${i}] tuple needs finite [lower, upper, count]`);
      }
      if (b[1] <= b[0]) throw new Error(`bins[${i}] requires upper > lower`);
      if (b[2] < 0) throw new Error(`bins[${i}] count must be ≥ 0`);
      return { lower: b[0], upper: b[1], count: b[2] };
    }
    if (!b || typeof b !== 'object') throw new Error(`bins[${i}] must be {lower,upper,count} or [lower,upper,count]`);
    const bb = b as Record<string, unknown>;
    if (!isFiniteNumber(bb.lower) || !isFiniteNumber(bb.upper) || !isFiniteNumber(bb.count)) {
      throw new Error(`bins[${i}] needs finite lower, upper, count`);
    }
    if (bb.upper <= bb.lower) throw new Error(`bins[${i}] requires upper > lower`);
    if (bb.count < 0) throw new Error(`bins[${i}] count must be ≥ 0`);
    return { lower: bb.lower, upper: bb.upper, count: bb.count };
  });
  // Sort by lower edge for safety.
  bins.sort((a, b) => a.lower - b.lower);

  const xMin = isFiniteNumber(params.xMin) ? params.xMin : bins[0].lower;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : bins[bins.length - 1].upper;
  if (xMax <= xMin) throw new Error('xMax must be > xMin');

  const maxCount = bins.reduce((m, b) => Math.max(m, b.count), 0);
  const yMax = isFiniteNumber(params.yMax) ? params.yMax : Math.max(maxCount * 1.15, 1);

  const mode: 'count' | 'relative' = params.mode === 'relative' ? 'relative' : 'count';

  return {
    bins, xMin, xMax, yMax,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
    yLabel: typeof params.yLabel === 'string' ? params.yLabel : (mode === 'relative' ? 'Relative frequency' : 'Frequency'),
    title: typeof params.title === 'string' ? params.title : undefined,
    showCounts: params.showCounts !== false,
    mean: isFiniteNumber(params.mean) ? params.mean : undefined,
    median: isFiniteNumber(params.median) ? params.median : undefined,
    mode,
  };
}

// ── normal_curve ────────────────────────────────────────────────────────

export interface NormalCurveFigure {
  mean: number;
  sd: number;
  xMin: number; xMax: number;
  shadeRegion?: { from?: number; to?: number };
  markValues: Array<{ x: number; label?: string }>;
  showSDLines: boolean;
  shadeArea?: number;
  title?: string;
  xLabel?: string;
}

export function solveNormalCurve(params: Record<string, unknown>): NormalCurveFigure {
  if (!isFiniteNumber(params.mean)) throw new Error('mean must be a finite number');
  if (!isFiniteNumber(params.sd) || params.sd <= 0) throw new Error('sd must be a positive finite number');
  const mean = params.mean;
  const sd = params.sd;

  const xMin = isFiniteNumber(params.xMin) ? params.xMin : mean - 4 * sd;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : mean + 4 * sd;
  if (xMax <= xMin) throw new Error('xMax must be > xMin');

  let shadeRegion: NormalCurveFigure['shadeRegion'];
  if (params.shadeRegion && typeof params.shadeRegion === 'object') {
    const sr = params.shadeRegion as Record<string, unknown>;
    const from = isFiniteNumber(sr.from) ? sr.from : undefined;
    const to = isFiniteNumber(sr.to) ? sr.to : undefined;
    if (from !== undefined || to !== undefined) {
      shadeRegion = { from, to };
    }
  }

  let markValues: NormalCurveFigure['markValues'] = [];
  if (Array.isArray(params.markValues)) {
    markValues = (params.markValues as unknown[])
      .map((m): { x: number; label?: string } | null => {
        if (Array.isArray(m)) {
          if (!isFiniteNumber(m[0])) return null;
          return { x: m[0], label: typeof m[1] === 'string' ? m[1] : undefined };
        }
        if (!m || typeof m !== 'object') return null;
        const mm = m as Record<string, unknown>;
        if (!isFiniteNumber(mm.x)) return null;
        return { x: mm.x, label: typeof mm.label === 'string' ? mm.label : undefined };
      })
      .filter((v): v is { x: number; label?: string } => v !== null);
  }

  return {
    mean, sd, xMin, xMax,
    shadeRegion, markValues,
    showSDLines: params.showSDLines === true,
    shadeArea: isFiniteNumber(params.shadeArea) ? params.shadeArea : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
  };
}

// ── scatterplot_regression ──────────────────────────────────────────────

interface XY { x: number; y: number; label?: string }

export interface ScatterRegressionFigure {
  points: XY[];
  regression?: { slope: number; intercept: number };
  xMin: number; xMax: number; yMin: number; yMax: number;
  equationLabel?: string;
  rValue?: number;
  rSquared?: number;
  highlightPoint?: XY;
  showResiduals: boolean;
  xLabel?: string;
  yLabel?: string;
  title?: string;
}

function asPointArray(v: unknown, label: string): XY[] {
  if (!Array.isArray(v) || v.length === 0) {
    throw new Error(`${label} must be a non-empty array of {x,y} or [x,y]`);
  }
  return v.map((p, i): XY => {
    if (Array.isArray(p)) {
      if (!isFiniteNumber(p[0]) || !isFiniteNumber(p[1])) {
        throw new Error(`${label}[${i}] tuple needs finite [x, y]`);
      }
      return { x: p[0], y: p[1], label: typeof p[2] === 'string' ? p[2] : undefined };
    }
    if (!p || typeof p !== 'object') throw new Error(`${label}[${i}] must be {x,y} or [x,y]`);
    const pp = p as Record<string, unknown>;
    if (!isFiniteNumber(pp.x) || !isFiniteNumber(pp.y)) {
      throw new Error(`${label}[${i}] needs finite x and y`);
    }
    return { x: pp.x, y: pp.y, label: typeof pp.label === 'string' ? pp.label : undefined };
  });
}

export function solveScatterRegression(params: Record<string, unknown>): ScatterRegressionFigure {
  const points = asPointArray(params.points, 'points');

  let regression: ScatterRegressionFigure['regression'];
  if (params.regression && typeof params.regression === 'object') {
    const r = params.regression as Record<string, unknown>;
    if (isFiniteNumber(r.slope) && isFiniteNumber(r.intercept)) {
      regression = { slope: r.slope, intercept: r.intercept };
    }
  }

  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const p of points) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }
  const padX = (xMax - xMin) * 0.08 || 1;
  const padY = (yMax - yMin) * 0.10 || 1;
  if (isFiniteNumber(params.xMin)) xMin = params.xMin; else xMin -= padX;
  if (isFiniteNumber(params.xMax)) xMax = params.xMax; else xMax += padX;
  if (isFiniteNumber(params.yMin)) yMin = params.yMin; else yMin -= padY;
  if (isFiniteNumber(params.yMax)) yMax = params.yMax; else yMax += padY;
  if (xMax <= xMin || yMax <= yMin) throw new Error('viewport must have positive width and height');

  let highlightPoint: XY | undefined;
  if (params.highlightPoint && typeof params.highlightPoint === 'object') {
    const h = params.highlightPoint as Record<string, unknown>;
    if (isFiniteNumber(h.x) && isFiniteNumber(h.y)) {
      highlightPoint = { x: h.x, y: h.y, label: typeof h.label === 'string' ? h.label : undefined };
    }
  }

  return {
    points, regression, xMin, xMax, yMin, yMax,
    equationLabel: typeof params.equationLabel === 'string' ? params.equationLabel : undefined,
    rValue: isFiniteNumber(params.rValue) ? params.rValue : undefined,
    rSquared: isFiniteNumber(params.rSquared) ? params.rSquared : undefined,
    highlightPoint,
    showResiduals: params.showResiduals === true,
    xLabel: typeof params.xLabel === 'string' ? params.xLabel : undefined,
    yLabel: typeof params.yLabel === 'string' ? params.yLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Phase 11 manifests (whiteboard markup initiative).
// ═══════════════════════════════════════════════════════════════════

// ── histogram ────────────────────────────────────────────────────
export const histogramFeatureNames = {
  diagram: 'histogram',
  bars: 'bars',
  bin: (i: number): string => `bin-${i}`,
  mean: 'mean-line',
  median: 'median-line',
};

export function buildHistogramManifest(figure: HistogramFigure): FeatureManifestEntry[] {
  const N = histogramFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'histogram diagram',
      labels: ['histogram', 'the histogram', 'the diagram', 'the graph', 'the distribution'],
      displayName: figure.title || 'histogram',
      scribbleable: true,
    },
    {
      name: N.bars,
      kind: 'region',
      description: `${figure.bins.length} histogram bars`,
      labels: ['bars', 'the bars', 'histogram bars', 'the histogram bars', 'bins', 'the bins', 'all bins', 'all bars'],
      displayName: 'bars',
      scribbleable: true,
    },
  ];
  figure.bins.forEach((b, i) => {
    const desc = `bin ${i + 1}: [${b.lower}, ${b.upper}) count=${b.count}`;
    features.push({
      name: N.bin(i),
      kind: 'label',
      description: desc,
      labels: [
        `bin ${i + 1}`, `the ${i + 1}th bin`, `bar ${i + 1}`, `the ${i + 1}th bar`,
        `[${b.lower}, ${b.upper})`, `the [${b.lower}, ${b.upper}) bin`,
        `bin from ${b.lower} to ${b.upper}`, `the bar from ${b.lower} to ${b.upper}`,
        desc,
      ],
      displayName: `bin [${b.lower}, ${b.upper})`,
      scribbleable: true,
    });
  });
  if (figure.mean !== undefined) {
    features.push({
      name: N.mean,
      kind: 'label',
      description: `mean line at x = ${figure.mean}`,
      labels: [
        'mean', 'the mean', 'mean line', 'the mean line', 'average', 'the average',
        `mean = ${figure.mean}`, `x̄ = ${figure.mean}`,
        // Verbose description-format (brain copies from description).
        `mean line at x = ${figure.mean}`,
        `the mean line at x = ${figure.mean}`,
      ],
      displayName: `mean = ${figure.mean}`,
      scribbleable: true,
    });
  }
  if (figure.median !== undefined) {
    features.push({
      name: N.median,
      kind: 'label',
      description: `median line at x = ${figure.median}`,
      labels: [
        'median', 'the median', 'median line', 'the median line',
        `median = ${figure.median}`,
        `median line at x = ${figure.median}`,
        `the median line at x = ${figure.median}`,
      ],
      displayName: `median = ${figure.median}`,
      scribbleable: true,
    });
  }
  return features;
}

// ── normal_curve ─────────────────────────────────────────────────
export const normalCurveFeatureNames = {
  diagram: 'normal-curve',
  curve: 'bell-curve',
  shadeRegion: 'shaded-region',
  mark: (idx: number): string => `mark-${idx}`,
  sdLines: 'sd-lines',
  shadeArea: 'shade-area',
};

export function buildNormalCurveManifest(figure: NormalCurveFigure): FeatureManifestEntry[] {
  const N = normalCurveFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: `normal distribution N(μ=${figure.mean}, σ=${figure.sd})`,
      labels: ['normal curve', 'the normal curve', 'the bell curve', 'the diagram', 'the graph', 'the distribution', `N(${figure.mean}, ${figure.sd})`],
      displayName: figure.title || `N(${figure.mean}, ${figure.sd})`,
      scribbleable: true,
    },
    {
      name: N.curve,
      kind: 'label',
      description: 'bell curve',
      labels: ['curve', 'the curve', 'bell curve', 'the bell curve', 'pdf', 'density', 'the density'],
      displayName: 'bell curve',
      scribbleable: true,
    },
  ];
  if (figure.shadeRegion) {
    const { from, to } = figure.shadeRegion;
    let desc = 'shaded probability region';
    if (from !== undefined && to !== undefined) desc = `shaded region P(${from} ≤ X ≤ ${to})`;
    else if (to !== undefined) desc = `shaded region P(X ≤ ${to})`;
    else if (from !== undefined) desc = `shaded region P(X ≥ ${from})`;
    features.push({
      name: N.shadeRegion,
      kind: 'area',
      description: desc,
      labels: [
        'shaded region', 'the shaded region', 'shaded area', 'the shaded area',
        'the area', 'the probability', 'probability region', 'the probability region',
        'shading', 'the shading',
        desc,
      ],
      displayName: 'shaded region',
      scribbleable: true,
    });
  }
  figure.markValues.forEach((mv, i) => {
    const desc = mv.label ? `mark at x = ${mv.x} (${mv.label})` : `mark at x = ${mv.x}`;
    const labels = [
      `x = ${mv.x}`, `at x = ${mv.x}`,
      `mark ${i + 1}`, `the ${i + 1}th mark`,
      // Verbose description-format (brain copies from description).
      desc,
      `mark at x = ${mv.x}`,
    ];
    if (mv.label) labels.push(mv.label, `the ${mv.label}`, `"${mv.label}"`);
    features.push({
      name: N.mark(i),
      kind: 'label',
      description: desc,
      labels,
      displayName: mv.label || `x = ${mv.x}`,
      scribbleable: true,
    });
  });
  if (figure.showSDLines) {
    features.push({
      name: N.sdLines,
      kind: 'region',
      description: '±1σ, ±2σ, ±3σ standard-deviation lines',
      labels: ['SD lines', 'the SD lines', 'standard deviation lines', 'sigma lines', 'σ lines', 'empirical rule lines', 'the empirical rule lines'],
      displayName: 'SD lines',
      scribbleable: true,
    });
  }
  if (figure.shadeArea !== undefined) {
    features.push({
      name: N.shadeArea,
      kind: 'label',
      description: `probability value: ${figure.shadeArea}`,
      labels: ['probability', 'the probability', 'P', 'the P value', 'shade area', `P = ${figure.shadeArea}`],
      displayName: `P = ${figure.shadeArea}`,
      scribbleable: true,
    });
  }
  return features;
}

// ── scatterplot_regression ───────────────────────────────────────
export const scatterRegressionFeatureNames = {
  diagram: 'scatterplot-regression',
  points: 'data-points',
  regression: 'regression-line',
  equation: 'equation-label',
  rValue: 'r-value',
  rSquared: 'r-squared',
  highlightPoint: 'highlight-point',
  residuals: 'residuals',
};

export function buildScatterRegressionManifest(figure: ScatterRegressionFigure): FeatureManifestEntry[] {
  const N = scatterRegressionFeatureNames;
  const features: FeatureManifestEntry[] = [
    {
      name: N.diagram,
      kind: 'region',
      description: 'scatterplot with regression',
      labels: ['scatterplot', 'the scatterplot', 'scatter plot', 'the diagram', 'the graph'],
      displayName: figure.title || 'scatterplot',
      scribbleable: true,
    },
    {
      name: N.points,
      kind: 'region',
      description: `${figure.points.length} data points`,
      labels: ['points', 'the points', 'data points', 'the data points', 'the data', 'data', 'all points', 'the dots'],
      displayName: 'data points',
      scribbleable: true,
    },
  ];
  if (figure.regression) {
    features.push({
      name: N.regression,
      kind: 'label',
      description: `LSRL: ŷ = ${figure.regression.intercept.toFixed(3)} + ${figure.regression.slope.toFixed(3)}x`,
      labels: [
        'LSRL', 'the LSRL', 'regression line', 'the regression line',
        'line of best fit', 'the line of best fit', 'best fit line', 'the best fit line',
        'least squares line', 'the least squares line',
        'trend line', 'the trend line',
      ],
      displayName: 'LSRL',
      scribbleable: true,
    });
  }
  if (figure.equationLabel) {
    features.push({
      name: N.equation,
      kind: 'label',
      description: `equation: ${figure.equationLabel}`,
      labels: [figure.equationLabel, `"${figure.equationLabel}"`, 'equation', 'the equation', 'equation label', 'the equation label', 'the formula'],
      displayName: figure.equationLabel,
      scribbleable: true,
    });
  }
  if (figure.rValue !== undefined) {
    features.push({
      name: N.rValue,
      kind: 'label',
      description: `correlation coefficient r = ${figure.rValue}`,
      labels: ['r', 'the r value', 'r value', 'correlation', 'correlation coefficient', 'the correlation', `r = ${figure.rValue}`],
      displayName: `r = ${figure.rValue}`,
      scribbleable: true,
    });
  }
  if (figure.rSquared !== undefined) {
    features.push({
      name: N.rSquared,
      kind: 'label',
      description: `r² = ${figure.rSquared}`,
      labels: ['r²', 'r squared', 'r-squared', 'the r squared', 'coefficient of determination', `r² = ${figure.rSquared}`, `r^2 = ${figure.rSquared}`],
      displayName: `r² = ${figure.rSquared}`,
      scribbleable: true,
    });
  }
  if (figure.highlightPoint) {
    const desc = figure.highlightPoint.label
      ? `highlight point (${figure.highlightPoint.x}, ${figure.highlightPoint.y}) "${figure.highlightPoint.label}"`
      : `highlight point (${figure.highlightPoint.x}, ${figure.highlightPoint.y})`;
    features.push({
      name: N.highlightPoint,
      kind: 'label',
      description: desc,
      labels: [
        'highlight point', 'the highlight point', 'highlighted point', 'the highlighted point', 'the point',
        `(${figure.highlightPoint.x}, ${figure.highlightPoint.y})`,
        ...(figure.highlightPoint.label ? [figure.highlightPoint.label, `"${figure.highlightPoint.label}"`] : []),
        // Verbose description-format (brain copies from description).
        desc,
      ],
      displayName: figure.highlightPoint.label || `(${figure.highlightPoint.x}, ${figure.highlightPoint.y})`,
      scribbleable: true,
    });
  }
  if (figure.showResiduals) {
    features.push({
      name: N.residuals,
      kind: 'region',
      description: 'residual segments (vertical distances from points to LSRL)',
      labels: ['residuals', 'the residuals', 'residual segments', 'residual lines', 'error lines', 'the error lines', 'vertical distances'],
      displayName: 'residuals',
      scribbleable: true,
    });
  }
  return features;
}
