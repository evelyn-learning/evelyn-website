/**
 * Calculus diagram kinds (AP Calc BC focused):
 *   - riemann_sum: integral approximation with rectangles
 *   - slope_field: dy/dx vector field with optional solution curve
 *   - parametric_curve: x(t), y(t) curve with optional tangent
 *   - polar_graph: r(θ) curve with optional shaded region
 *   - taylor_polynomial_overlay: f(x) with one or more T_n(x) approximations
 *
 * Convention: brain pre-samples the curve points (and any rectangles or
 * slope vectors). Solver validates ranges and supplies defaults; renderer
 * just maps to SVG. This avoids needing an expression evaluator on the
 * server.
 */

interface XY { x: number; y: number }
interface XYT extends XY { t?: number }
interface PolarPoint { theta: number; r: number; x: number; y: number }
interface SlopeSample { x: number; y: number; slope: number }
interface RiemannRect { x: number; width: number; height: number }

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}
/** Accept either {x,y} or [x,y] / [x,y,t]. Tuples cut tool-call tokens
 *  roughly in half, which matters because the brain is on a tight
 *  output-token budget. */
function asXYArray(v: unknown, label: string): XY[] {
  if (!Array.isArray(v) || v.length === 0) {
    throw new Error(`${label} must be a non-empty array of {x, y} or [x, y]`);
  }
  return v.map((p, i): XY => {
    if (Array.isArray(p)) {
      if (!isFiniteNumber(p[0]) || !isFiniteNumber(p[1])) {
        throw new Error(`${label}[${i}] tuple needs finite [x, y]`);
      }
      return { x: p[0], y: p[1] };
    }
    if (!p || typeof p !== 'object') throw new Error(`${label}[${i}] must be {x,y} or [x,y]`);
    const pp = p as Record<string, unknown>;
    if (!isFiniteNumber(pp.x) || !isFiniteNumber(pp.y)) {
      throw new Error(`${label}[${i}] needs finite numeric x and y`);
    }
    return { x: pp.x, y: pp.y };
  });
}
function autoBounds(pts: { x: number; y: number }[]): { xMin: number; xMax: number; yMin: number; yMax: number } {
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  for (const p of pts) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }
  return { xMin, xMax, yMin, yMax };
}

// ── riemann_sum ─────────────────────────────────────────────────────────

export interface RiemannSumFigure {
  curve: XY[];
  rectangles: RiemannRect[];
  xMin: number; xMax: number; yMin: number; yMax: number;
  method: 'left' | 'right' | 'midpoint' | 'trapezoidal';
  n: number;
  exprLabel?: string;
  approxArea?: number;
  exactArea?: number;
  title?: string;
}

export function solveRiemannSum(params: Record<string, unknown>): RiemannSumFigure {
  const curve = asXYArray(params.curve, 'curve');
  if (!Array.isArray(params.rectangles)) throw new Error('rectangles must be an array');
  const rectangles: RiemannRect[] = (params.rectangles as unknown[]).map((r, i): RiemannRect => {
    // Tuple form: [x, width, height]
    if (Array.isArray(r)) {
      if (!isFiniteNumber(r[0]) || !isFiniteNumber(r[1]) || !isFiniteNumber(r[2])) {
        throw new Error(`rectangles[${i}] tuple needs finite [x, width, height]`);
      }
      if (r[1] <= 0) throw new Error(`rectangles[${i}][1] (width) must be > 0`);
      return { x: r[0], width: r[1], height: r[2] };
    }
    if (!r || typeof r !== 'object') throw new Error(`rectangles[${i}] must be {x,width,height} or [x,width,height]`);
    const rr = r as Record<string, unknown>;
    if (!isFiniteNumber(rr.x) || !isFiniteNumber(rr.width) || !isFiniteNumber(rr.height)) {
      throw new Error(`rectangles[${i}] needs finite x, width, height`);
    }
    if (rr.width <= 0) throw new Error(`rectangles[${i}].width must be > 0`);
    return { x: rr.x, width: rr.width, height: rr.height };
  });
  const method = (params.method === 'right' || params.method === 'midpoint' || params.method === 'trapezoidal')
    ? params.method
    : 'left';
  const n = isFiniteNumber(params.n) && params.n > 0 ? Math.round(params.n) : rectangles.length;

  const auto = autoBounds([
    ...curve,
    ...rectangles.flatMap((r) => [{ x: r.x, y: 0 }, { x: r.x + r.width, y: r.height }]),
  ]);
  const xMin = isFiniteNumber(params.xMin) ? params.xMin : auto.xMin;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : auto.xMax;
  const yMin = isFiniteNumber(params.yMin) ? params.yMin : Math.min(0, auto.yMin);
  const yMax = isFiniteNumber(params.yMax) ? params.yMax : Math.max(0, auto.yMax) * 1.1;
  if (xMax <= xMin) throw new Error('xMax must be > xMin');
  if (yMax <= yMin) throw new Error('yMax must be > yMin');

  return {
    curve, rectangles, xMin, xMax, yMin, yMax, method, n,
    exprLabel: typeof params.exprLabel === 'string' ? params.exprLabel : undefined,
    approxArea: isFiniteNumber(params.approxArea) ? params.approxArea : undefined,
    exactArea: isFiniteNumber(params.exactArea) ? params.exactArea : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── slope_field ─────────────────────────────────────────────────────────

export interface SlopeFieldFigure {
  samples: SlopeSample[];
  xMin: number; xMax: number; yMin: number; yMax: number;
  solutionCurve?: XY[];
  highlightPoint?: XY;
  exprLabel?: string;
  title?: string;
}

export function solveSlopeField(params: Record<string, unknown>): SlopeFieldFigure {
  if (!Array.isArray(params.samples)) throw new Error('samples must be an array of {x,y,slope} or [x,y,slope]');
  const samples: SlopeSample[] = (params.samples as unknown[]).map((s, i): SlopeSample => {
    // Tuple form: [x, y, slope]
    if (Array.isArray(s)) {
      if (!isFiniteNumber(s[0]) || !isFiniteNumber(s[1])) {
        throw new Error(`samples[${i}] tuple needs finite [x, y, slope]`);
      }
      return { x: s[0], y: s[1], slope: isFiniteNumber(s[2]) ? s[2] : NaN };
    }
    if (!s || typeof s !== 'object') throw new Error(`samples[${i}] must be {x,y,slope} or [x,y,slope]`);
    const ss = s as Record<string, unknown>;
    if (!isFiniteNumber(ss.x) || !isFiniteNumber(ss.y)) {
      throw new Error(`samples[${i}] needs finite x and y`);
    }
    const slope = isFiniteNumber(ss.slope) ? ss.slope : NaN;
    return { x: ss.x, y: ss.y, slope };
  });
  if (samples.length === 0) throw new Error('samples is empty');

  const auto = autoBounds(samples);
  const xMin = isFiniteNumber(params.xMin) ? params.xMin : auto.xMin - 0.5;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : auto.xMax + 0.5;
  const yMin = isFiniteNumber(params.yMin) ? params.yMin : auto.yMin - 0.5;
  const yMax = isFiniteNumber(params.yMax) ? params.yMax : auto.yMax + 0.5;
  if (xMax <= xMin || yMax <= yMin) throw new Error('viewport must have positive width and height');

  let solutionCurve: XY[] | undefined;
  if (Array.isArray(params.solutionCurve)) {
    solutionCurve = asXYArray(params.solutionCurve, 'solutionCurve');
  }
  let highlightPoint: XY | undefined;
  if (params.highlightPoint && typeof params.highlightPoint === 'object') {
    const h = params.highlightPoint as Record<string, unknown>;
    if (isFiniteNumber(h.x) && isFiniteNumber(h.y)) {
      highlightPoint = { x: h.x, y: h.y };
    }
  }
  return {
    samples, xMin, xMax, yMin, yMax, solutionCurve, highlightPoint,
    exprLabel: typeof params.exprLabel === 'string' ? params.exprLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── parametric_curve ────────────────────────────────────────────────────

export interface ParametricCurveFigure {
  curve: XYT[];
  xMin: number; xMax: number; yMin: number; yMax: number;
  highlightT?: { t?: number; x: number; y: number; label?: string };
  tangentAtT?: { x: number; y: number; dx: number; dy: number; length?: number };
  exprLabel?: string;
  title?: string;
}

export function solveParametricCurve(params: Record<string, unknown>): ParametricCurveFigure {
  if (!Array.isArray(params.curve)) throw new Error('curve must be an array of {x,y,t?} or [x,y,t?]');
  const curve: XYT[] = (params.curve as unknown[]).map((p, i): XYT => {
    // Tuple form: [x, y] or [x, y, t]
    if (Array.isArray(p)) {
      if (!isFiniteNumber(p[0]) || !isFiniteNumber(p[1])) {
        throw new Error(`curve[${i}] tuple needs finite [x, y, t?]`);
      }
      return { x: p[0], y: p[1], t: isFiniteNumber(p[2]) ? p[2] : undefined };
    }
    if (!p || typeof p !== 'object') throw new Error(`curve[${i}] must be {x,y,t?} or [x,y,t?]`);
    const pp = p as Record<string, unknown>;
    if (!isFiniteNumber(pp.x) || !isFiniteNumber(pp.y)) {
      throw new Error(`curve[${i}] needs finite x and y`);
    }
    return { x: pp.x, y: pp.y, t: isFiniteNumber(pp.t) ? pp.t : undefined };
  });
  if (curve.length < 2) throw new Error('curve needs at least 2 points');

  // Defang brain hallucinations that insert points out of t-order: when
  // every point carries a t value, sort by t. (If the brain wanted a
  // reversed trace it can use descending t values; the resulting visual
  // shape is the same.)
  if (curve.every((p) => isFiniteNumber(p.t))) {
    curve.sort((a, b) => (a.t as number) - (b.t as number));
  }

  const auto = autoBounds(curve);
  const padX = (auto.xMax - auto.xMin) * 0.1 || 1;
  const padY = (auto.yMax - auto.yMin) * 0.1 || 1;
  const xMin = isFiniteNumber(params.xMin) ? params.xMin : auto.xMin - padX;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : auto.xMax + padX;
  const yMin = isFiniteNumber(params.yMin) ? params.yMin : auto.yMin - padY;
  const yMax = isFiniteNumber(params.yMax) ? params.yMax : auto.yMax + padY;

  let highlightT: ParametricCurveFigure['highlightT'];
  if (params.highlightT && typeof params.highlightT === 'object') {
    const h = params.highlightT as Record<string, unknown>;
    if (isFiniteNumber(h.x) && isFiniteNumber(h.y)) {
      highlightT = {
        t: isFiniteNumber(h.t) ? h.t : undefined,
        x: h.x, y: h.y,
        label: typeof h.label === 'string' ? h.label : undefined,
      };
    }
  }
  let tangentAtT: ParametricCurveFigure['tangentAtT'];
  if (params.tangentAtT && typeof params.tangentAtT === 'object') {
    const tt = params.tangentAtT as Record<string, unknown>;
    if (isFiniteNumber(tt.x) && isFiniteNumber(tt.y) && isFiniteNumber(tt.dx) && isFiniteNumber(tt.dy)) {
      tangentAtT = {
        x: tt.x, y: tt.y, dx: tt.dx, dy: tt.dy,
        length: isFiniteNumber(tt.length) ? tt.length : undefined,
      };
    }
  }
  return {
    curve, xMin, xMax, yMin, yMax, highlightT, tangentAtT,
    exprLabel: typeof params.exprLabel === 'string' ? params.exprLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── polar_graph ─────────────────────────────────────────────────────────

export interface PolarGraphFigure {
  curve: PolarPoint[];
  shadeRegion?: PolarPoint[];
  highlightPoint?: { theta: number; r: number; x: number; y: number; label?: string };
  rMax: number;
  showAxes: boolean;
  exprLabel?: string;
  title?: string;
}

function asPolarArray(v: unknown, label: string): PolarPoint[] {
  if (!Array.isArray(v) || v.length === 0) {
    throw new Error(`${label} must be a non-empty array of {theta, r} or [theta, r]`);
  }
  return v.map((p, i): PolarPoint => {
    // Tuple form: [theta, r]
    if (Array.isArray(p)) {
      if (!isFiniteNumber(p[0]) || !isFiniteNumber(p[1])) {
        throw new Error(`${label}[${i}] tuple needs finite [theta, r]`);
      }
      return { theta: p[0], r: p[1], x: p[1] * Math.cos(p[0]), y: p[1] * Math.sin(p[0]) };
    }
    if (!p || typeof p !== 'object') throw new Error(`${label}[${i}] must be {theta,r} or [theta,r]`);
    const pp = p as Record<string, unknown>;
    if (!isFiniteNumber(pp.theta) || !isFiniteNumber(pp.r)) {
      throw new Error(`${label}[${i}] needs finite theta and r`);
    }
    const x = isFiniteNumber(pp.x) ? pp.x : pp.r * Math.cos(pp.theta);
    const y = isFiniteNumber(pp.y) ? pp.y : pp.r * Math.sin(pp.theta);
    return { theta: pp.theta, r: pp.r, x, y };
  });
}

export function solvePolarGraph(params: Record<string, unknown>): PolarGraphFigure {
  const curve = asPolarArray(params.curve, 'curve');
  let shadeRegion: PolarPoint[] | undefined;
  if (Array.isArray(params.shadeRegion)) {
    shadeRegion = asPolarArray(params.shadeRegion, 'shadeRegion');
  }
  let highlightPoint: PolarGraphFigure['highlightPoint'];
  if (params.highlightPoint && typeof params.highlightPoint === 'object') {
    const h = params.highlightPoint as Record<string, unknown>;
    if (isFiniteNumber(h.theta) && isFiniteNumber(h.r)) {
      const x = isFiniteNumber(h.x) ? h.x : h.r * Math.cos(h.theta);
      const y = isFiniteNumber(h.y) ? h.y : h.r * Math.sin(h.theta);
      highlightPoint = {
        theta: h.theta, r: h.r, x, y,
        label: typeof h.label === 'string' ? h.label : undefined,
      };
    }
  }
  let rMax = 0;
  for (const p of curve) {
    const m = Math.max(Math.abs(p.x), Math.abs(p.y));
    if (m > rMax) rMax = m;
  }
  rMax = isFiniteNumber(params.rMax) && (params.rMax as number) > 0 ? (params.rMax as number) : rMax * 1.15 || 1;
  const showAxes = params.showAxes !== false;
  return {
    curve, shadeRegion, highlightPoint, rMax, showAxes,
    exprLabel: typeof params.exprLabel === 'string' ? params.exprLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

// ── taylor_polynomial_overlay ───────────────────────────────────────────

export interface TaylorApproximation {
  degree: number;
  curve: XY[];
  color?: string;
}

export interface TaylorPolynomialOverlayFigure {
  baseCurve: XY[];
  approximations: TaylorApproximation[];
  xMin: number; xMax: number; yMin: number; yMax: number;
  center: number;
  exprLabel?: string;
  title?: string;
}

export function solveTaylorPolynomialOverlay(params: Record<string, unknown>): TaylorPolynomialOverlayFigure {
  const baseCurve = asXYArray(params.baseCurve, 'baseCurve');
  if (!Array.isArray(params.approximations)) throw new Error('approximations must be an array');
  const approximations: TaylorApproximation[] = (params.approximations as unknown[]).map((a, i) => {
    if (!a || typeof a !== 'object') throw new Error(`approximations[${i}] is not an object`);
    const aa = a as Record<string, unknown>;
    if (!isFiniteNumber(aa.degree) || aa.degree < 0) throw new Error(`approximations[${i}].degree must be non-negative`);
    const curve = asXYArray(aa.curve, `approximations[${i}].curve`);
    return {
      degree: Math.round(aa.degree),
      curve,
      color: typeof aa.color === 'string' ? aa.color : undefined,
    };
  });
  const all = [...baseCurve, ...approximations.flatMap((a) => a.curve)];
  const auto = autoBounds(all);
  const padX = (auto.xMax - auto.xMin) * 0.05 || 1;
  const padY = (auto.yMax - auto.yMin) * 0.1 || 1;
  const xMin = isFiniteNumber(params.xMin) ? params.xMin : auto.xMin - padX;
  const xMax = isFiniteNumber(params.xMax) ? params.xMax : auto.xMax + padX;
  const yMin = isFiniteNumber(params.yMin) ? params.yMin : auto.yMin - padY;
  const yMax = isFiniteNumber(params.yMax) ? params.yMax : auto.yMax + padY;
  const center = isFiniteNumber(params.center) ? params.center : 0;
  return {
    baseCurve, approximations, xMin, xMax, yMin, yMax, center,
    exprLabel: typeof params.exprLabel === 'string' ? params.exprLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}
