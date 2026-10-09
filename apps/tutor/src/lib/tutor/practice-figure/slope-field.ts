/**
 * Slope-field samples from a dy/dx expression.
 *
 * The board's slope-field kind (diagrams/catalog/kinds/math-calculus.ts
 * `solveSlopeField`) takes PRECOMPUTED `{x, y, slope}` samples — in a live
 * session the tutor model works them out. A practice figure is authored
 * offline from a spec, so the samples are computed here, in the same shape,
 * from the expression itself (expr.ts — an expression that is not fully
 * understood is refused, never drawn wrong).
 *
 * `slope` is the value as computed: a finite number, ±Infinity where the
 * field is vertical (dy/dx = x/y on y = 0 with x ≠ 0), or NaN where it is
 * undefined (0/0, sqrt of a negative). The practice renderer draws a
 * vertical tick for ±Infinity and nothing for NaN.
 *
 * Pure.
 */
import { compileExpression, ExpressionError } from './expr';
import { niceStep, ticksBetween } from './plot-frame';

export interface SlopeSample {
  x: number;
  y: number;
  slope: number;
}

export interface SlopeFieldSamplingInput {
  /** dy/dx as an expression in `x` and `y`, e.g. "x - y", "x/y", "y*(1 - y)". */
  expr: string;
  xRange: [number, number];
  yRange: [number, number];
  /** Grid spacing. Default: a round step giving at most 12 columns / rows. */
  xStep?: number;
  yStep?: number;
}

const MAX_SAMPLES = 900;

/** The lattice of sample points and the slope at each. Throws
 *  `ExpressionError` for an expression that cannot be read, and for one that
 *  is undefined at every lattice point (nothing to draw). */
export function slopeFieldSamples(input: SlopeFieldSamplingInput): SlopeSample[] {
  const f = compileExpression(input.expr, ['x', 'y']);
  const [x0, x1] = input.xRange;
  const [y0, y1] = input.yRange;
  const xStep = input.xStep && input.xStep > 0 ? input.xStep : niceStep(x1 - x0, 12);
  const yStep = input.yStep && input.yStep > 0 ? input.yStep : niceStep(y1 - y0, 12);
  const xs = ticksBetween(x0, x1, xStep);
  const ys = ticksBetween(y0, y1, yStep);
  if (xs.length === 0 || ys.length === 0 || xs.length * ys.length > MAX_SAMPLES) {
    throw new ExpressionError(input.expr, `the grid has ${xs.length} × ${ys.length} points — choose a step that gives between 1 and ${MAX_SAMPLES}`);
  }
  const samples: SlopeSample[] = [];
  for (const y of ys) for (const x of xs) samples.push({ x, y, slope: f(x, y) });
  if (samples.every((s) => Number.isNaN(s.slope))) throw new ExpressionError(input.expr, 'undefined at every grid point');
  return samples;
}

/**
 * The solution curve through `(px, py)`, by RK4 in both directions, until it
 * leaves `xRange`, runs one y-span past `yRange`, the slope stops being
 * finite, or the curve turns vertical (one step moves y by more than 2 % of
 * the y-span — past that point y is no longer a function of x and the
 * integration is noise; dy/dx = −x/y stops just short of y = 0). Points in
 * increasing x.
 */
export function slopeFieldSolution(
  expr: string,
  through: [number, number],
  xRange: [number, number],
  yRange: [number, number],
): Array<[number, number]> {
  const f = compileExpression(expr, ['x', 'y']);
  const [x0, x1] = xRange;
  const span = yRange[1] - yRange[0];
  const lo = yRange[0] - span;
  const hi = yRange[1] + span;
  const h = (x1 - x0) / 600;
  const march = (dir: 1 | -1): Array<[number, number]> => {
    const out: Array<[number, number]> = [];
    let x = through[0];
    let y = through[1];
    for (let i = 0; i < 1200; i++) {
      const s = dir * h;
      const k1 = f(x, y);
      const k2 = f(x + s / 2, y + (s / 2) * k1);
      const k3 = f(x + s / 2, y + (s / 2) * k2);
      const k4 = f(x + s, y + s * k3);
      const ny = y + (s / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      const nx = x + s;
      if (!Number.isFinite(ny) || nx < x0 - 1e-9 || nx > x1 + 1e-9 || ny < lo || ny > hi) break;
      if (Math.abs(ny - y) > span * 0.02) break;
      x = nx;
      y = ny;
      out.push([x, y]);
    }
    return out;
  };
  return [...march(-1).reverse(), [through[0], through[1]], ...march(1)];
}
