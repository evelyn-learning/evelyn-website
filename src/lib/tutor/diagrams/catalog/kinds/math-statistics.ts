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
