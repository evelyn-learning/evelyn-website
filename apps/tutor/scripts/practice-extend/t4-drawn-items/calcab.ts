/** T4 drawn items — group calcab (see kit.ts for the shape and the proof rules). */
import type { DrawnItem } from './kit';
import { deriv, tangentResidual } from './kit';

const TAN = 'gen-3c586ec0-3b8e-4ce2-99f0-8d22c6497083.lo-4';
const LIN = 'gen-01e222df-db1e-4e6b-ac3b-4ce3a0269f5e.lo-2';
const INC = 'gen-5fec1ce2-0c3e-40e0-b82d-26fa9f2c5db7.lo-2';
const CUP = 'gen-d1d61003-4372-4cee-b061-aac17d32d42f.lo-2';
const CDN = 'gen-d1d61003-4372-4cee-b061-aac17d32d42f.lo-3';

/** Numerical second derivative (nested central differences, step scaled to |x|) — proves f″ independently of the hand work. */
const second = (f: (x: number) => number, x: number): number => {
  const h = 1e-3 * Math.max(1, Math.abs(x));
  return deriv((t) => deriv(f, t, h), x, h);
};

export const ITEMS: DrawnItem[] = [
  // ── tangent line equations ────────────────────────────────────────────────
  {
    kind: 'line', lo: TAN, t: 'tangent-quadratic', d: 1, sub: 'Tangent line to a quadratic',
    q: 'Find the line tangent to the graph of f(x) = x² − 2x at x = 2. Graph the tangent line on the coordinate grid by placing two points on it.',
    a: 'y = 2x − 4',
    s: 'The point of tangency: f(2) = 4 − 4 = 0, so (2, 0). The slope: f′(x) = 2x − 2, so f′(2) = 2. Point-slope form: y − 0 = 2(x − 2), so y = 2x − 4. Place two points of this line, for example (2, 0) and (3, 2).',
    h: ['The tangent line touches the curve at (2, f(2)), so find f(2) first.', 'The slope of the tangent is the derivative evaluated at x = 2.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, 0], [3, 2]],
    on: ['tangent to x² − 2x at x = 2 (slope found numerically)', tangentResidual((x) => x ** 2 - 2 * x, 2)],
    misses: [
      ['used f(2) = 0 as the slope: a horizontal line y = 0', [[0, 0], [2, 0]]],
      ['dropped the point: y = 2x through the origin', [[0, 0], [1, 2]]],
    ],
  },
  {
    kind: 'line', lo: TAN, t: 'tangent-reciprocal', d: 2, sub: 'Tangent line to a reciprocal function',
    q: 'Find the line tangent to the graph of f(x) = 4/x at x = 2. Graph the tangent line on the coordinate grid by placing two points on it.',
    a: 'y = −x + 4',
    s: 'The point of tangency: f(2) = 4/2 = 2, so (2, 2). Write f(x) = 4x⁻¹, so f′(x) = −4x⁻² = −4/x², and f′(2) = −4/4 = −1. Point-slope form: y − 2 = −1(x − 2), so y = −x + 4. Place two points of this line, for example (2, 2) and (4, 0).',
    h: ['Rewrite 4/x as a power of x before using the power rule.', 'The derivative of a negative power is negative, so check the sign of your slope.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, 2], [4, 0]],
    on: ['tangent to 4/x at x = 2 (slope found numerically)', tangentResidual((x) => 4 / x, 2)],
    misses: [
      ['lost the minus sign of the derivative: slope +1, y = x', [[0, 0], [2, 2]]],
      ['used f′(x) = −4/x instead of −4/x²: slope −2, y = −2x + 6', [[2, 2], [3, 0]]],
    ],
  },
  {
    kind: 'line', lo: TAN, t: 'tangent-parallel-to-given-line', d: 3, sub: 'Tangent line with a given slope',
    q: 'The graph of f(x) = x² − 4x + 5 has exactly one tangent line that is parallel to the line y = −2x. Find that tangent line and graph it on the coordinate grid by placing two points on it.',
    a: 'y = −2x + 4',
    s: 'Parallel lines have equal slopes, so the tangent has slope −2. Solve f′(x) = 2x − 4 = −2: x = 1. The point of tangency is (1, f(1)) = (1, 1 − 4 + 5) = (1, 2). Point-slope form: y − 2 = −2(x − 1), so y = −2x + 4. Place two points of this line, for example (1, 2) and (2, 0).',
    h: ['A line parallel to y = −2x has the same slope as it.', 'Set the derivative equal to that slope to find where the tangent touches the curve.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[1, 2], [2, 0]],
    on: ['tangent to x² − 4x + 5 at x = 1, where f′(x) = −2 (slope found numerically)', tangentResidual((x) => x ** 2 - 4 * x + 5, 1)],
    misses: [
      ['solved 2x − 4 = 2 instead of −2: the tangent at x = 3, y = 2x − 4', [[3, 2], [2, 0]]],
      ['right point but wrote the slope +2: y = 2x', [[0, 0], [1, 2]]],
    ],
  },

  // ── local linearization ───────────────────────────────────────────────────
  {
    kind: 'line', lo: LIN, t: 'linearize-ln-at-1', d: 1, sub: 'Linearization of ln x at a = 1',
    q: 'Find the local linearization L(x) of f(x) = ln x at a = 1, the line you would use to estimate ln(1.1). Graph y = L(x) on the coordinate grid by placing two points on it.',
    a: 'L(x) = x − 1',
    s: 'f(1) = ln 1 = 0 and f′(x) = 1/x, so f′(1) = 1. L(x) = f(1) + f′(1)(x − 1) = 0 + 1·(x − 1) = x − 1. (It gives ln(1.1) ≈ L(1.1) = 0.1.) Place two points of the line y = x − 1, for example (1, 0) and (2, 1).',
    h: ['The linearization is the tangent line: L(x) = f(a) + f′(a)(x − a).', 'Recall the value of ln 1 and the derivative of ln x.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[1, 0], [2, 1]],
    on: ['tangent to ln x at x = 1 (slope found numerically)', tangentResidual((x) => Math.log(x), 1)],
    misses: [
      ['took ln 1 = 1: L(x) = 1 + (x − 1) = x', [[0, 0], [1, 1]]],
      ['wrote (a − x) instead of (x − a): L(x) = 1 − x', [[0, 1], [1, 0]]],
    ],
  },
  {
    kind: 'line', lo: LIN, t: 'linearize-root-at-4', d: 2, sub: 'Linearization of a square-root function',
    q: 'Find the local linearization L(x) of f(x) = 2√x at a = 4, the line you would use to estimate 2√4.2. Graph y = L(x) on the coordinate grid by placing two points on it.',
    a: 'L(x) = (1/2)x + 2',
    s: 'f(4) = 2·2 = 4. f(x) = 2x^(1/2), so f′(x) = x^(−1/2) = 1/√x and f′(4) = 1/2. L(x) = 4 + (1/2)(x − 4) = (1/2)x + 2. (It gives 2√4.2 ≈ L(4.2) = 4.1.) Place two points of this line, for example (4, 4) and (0, 2).',
    h: ['The linearization at a = 4 passes through (4, f(4)) with slope f′(4).', 'Write 2√x as a power of x; the constant 2 stays in front of the derivative.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[4, 4], [0, 2]],
    on: ['tangent to 2√x at x = 4 (slope found numerically)', tangentResidual((x) => 2 * Math.sqrt(x), 4)],
    misses: [
      ['dropped the factor 2 in the derivative: slope 1/4, L(x) = (1/4)x + 3', [[4, 4], [0, 3]]],
      ['wrote (a − x) instead of (x − a): L(x) = 4 − (1/2)(x − 4)', [[4, 4], [2, 5]]],
    ],
  },

  // ── increasing / decreasing ───────────────────────────────────────────────
  {
    kind: 'interval', lo: INC, t: 'increasing-cubic-between-critical-points', d: 2, sub: 'Where a cubic increases',
    q: 'Let f(x) = −x³ + 3x² + 9x. Show the interval on which f is increasing on the number line, using open circles at the ends.',
    a: '(−1, 3)',
    s: 'f′(x) = −3x² + 6x + 9 = −3(x² − 2x − 3) = −3(x − 3)(x + 1). The critical points are x = −1 and x = 3. Test points: f′(−2) = −15 < 0, f′(0) = 9 > 0, f′(4) = −15 < 0. So f′(x) > 0 only for −1 < x < 3, and f is increasing on (−1, 3). Mark the interval from −1 to 3 with open circles at both ends.',
    h: ['Factor f′(x) to find the critical points, then test the sign of f′ between them.', 'Watch the leading coefficient: it is negative, which affects the sign far to the left and right.'],
    line: { min: -4, max: 5, step: 1 }, key: { from: -1, to: 3, fromOpen: true, toOpen: true },
    holds: ['f′(x) > 0 for f(x) = −x³ + 3x² + 9x (derivative found numerically)', (x) => deriv((t) => -(t ** 3) + 3 * t ** 2 + 9 * t, x) > 0],
    misses: [
      ['factored as (x + 3)(x − 1): critical points −3 and 1', { from: -3, to: 1, fromOpen: true, toOpen: true }],
      ['closed circles at the critical points', { from: -1, to: 3, fromOpen: false, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: INC, t: 'decreasing-with-log-domain', d: 3, sub: 'Decreasing on a restricted domain',
    q: 'Let f(x) = x − 4 ln x. Show the interval on which f is decreasing on the number line, using open circles at the ends.',
    a: '(0, 4)',
    s: 'The domain of f is x > 0 because of ln x. f′(x) = 1 − 4/x = (x − 4)/x. On the domain the denominator x is positive, so f′(x) < 0 exactly when x − 4 < 0, that is 0 < x < 4 (test: f′(1) = −3 < 0, f′(5) = 1/5 > 0). f is decreasing on (0, 4). Mark the interval from 0 to 4 with open circles at both ends.',
    h: ['First decide which x-values are in the domain of f.', 'Write f′(x) as a single fraction and look at the signs of its numerator and denominator.'],
    line: { min: -2, max: 7, step: 1 }, key: { from: 0, to: 4, fromOpen: true, toOpen: true },
    holds: ['x in the domain (x > 0) and f′(x) < 0 for f(x) = x − 4 ln x (derivative found numerically)', (x) => x > 0 && deriv((t) => t - 4 * Math.log(t), x, Math.min(1e-5, x / 2)) < 0],
    misses: [
      ['ignored the domain: decreasing on (−∞, 4)', { from: null, to: 4, fromOpen: false, toOpen: true }],
      ['reversed the sign test: (4, ∞) is where f increases', { from: 4, to: null, fromOpen: true, toOpen: false }],
    ],
  },

  // ── concave up ────────────────────────────────────────────────────────────
  {
    kind: 'interval', lo: CUP, t: 'concave-up-cubic-ray', d: 1, sub: 'Concave up for a cubic',
    q: 'Let f(x) = x³ + 3x² − 2. Show where the graph of f is concave up on the number line, using an open circle at its end.',
    a: 'x > −1, that is (−1, ∞)',
    s: 'f′(x) = 3x² + 6x and f″(x) = 6x + 6. f″(x) > 0 when 6x + 6 > 0, that is x > −1. The graph is concave up on (−1, ∞). Mark an open circle at −1 and a ray to the right.',
    h: ['Differentiate twice to get f″(x).', 'Concave up means f″(x) > 0; solve that linear inequality.'],
    line: { min: -5, max: 4, step: 1 }, key: { from: -1, to: null, fromOpen: true, toOpen: false },
    holds: ['f″(x) > 0 for f(x) = x³ + 3x² − 2 (second derivative found numerically)', (x) => second((t) => t ** 3 + 3 * t ** 2 - 2, x) > 0],
    misses: [
      ['solved f″(x) > 0 with the wrong sign: x < −1', { from: null, to: -1, fromOpen: false, toOpen: true }],
      ['used f′(x) = 3x² + 6x and solved 3x + 6 > 0: x > −2', { from: -2, to: null, fromOpen: true, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: CUP, t: 'concave-up-quartic-between-roots', d: 3, sub: 'Concave up between the zeros of f″',
    q: 'Let f(x) = −x⁴ + 2x³ + 12x². Show where the graph of f is concave up on the number line, using open circles at the ends.',
    a: '(−1, 2)',
    s: 'f′(x) = −4x³ + 6x² + 24x and f″(x) = −12x² + 12x + 24 = −12(x² − x − 2) = −12(x − 2)(x + 1). f″ is zero at x = −1 and x = 2. Test points: f″(−2) = −48 < 0, f″(0) = 24 > 0, f″(3) = −48 < 0. So f″(x) > 0 only for −1 < x < 2: the graph is concave up on (−1, 2). Mark the interval from −1 to 2 with open circles at both ends.',
    h: ['Factor out the leading coefficient of f″(x), then factor the quadratic that is left.', 'The leading coefficient of f″ is negative, so f″ is positive only between its zeros.'],
    line: { min: -4, max: 5, step: 1 }, key: { from: -1, to: 2, fromOpen: true, toOpen: true },
    holds: ['f″(x) > 0 for f(x) = −x⁴ + 2x³ + 12x² (second derivative found numerically)', (x) => second((t) => -(t ** 4) + 2 * t ** 3 + 12 * t ** 2, x) > 0],
    misses: [
      ['factored as (x + 2)(x − 1): zeros −2 and 1', { from: -2, to: 1, fromOpen: true, toOpen: true }],
      ['took the outer part (f″ < 0) as concave up: x > 2', { from: 2, to: null, fromOpen: true, toOpen: false }],
    ],
  },

  // ── concave down ──────────────────────────────────────────────────────────
  {
    kind: 'interval', lo: CDN, t: 'concave-down-cubic-ray', d: 1, sub: 'Concave down for a cubic',
    q: 'Let f(x) = x³ − 6x² + 4. Show where the graph of f is concave down on the number line, using an open circle at its end.',
    a: 'x < 2, that is (−∞, 2)',
    s: 'f′(x) = 3x² − 12x and f″(x) = 6x − 12. f″(x) < 0 when 6x − 12 < 0, that is x < 2. The graph is concave down on (−∞, 2). Mark an open circle at 2 and a ray to the left.',
    h: ['Differentiate twice to get f″(x).', 'Concave down means f″(x) < 0; solve that linear inequality.'],
    line: { min: -3, max: 6, step: 1 }, key: { from: null, to: 2, fromOpen: false, toOpen: true },
    holds: ['f″(x) < 0 for f(x) = x³ − 6x² + 4 (second derivative found numerically)', (x) => second((t) => t ** 3 - 6 * t ** 2 + 4, x) < 0],
    misses: [
      ['marked the concave-up side: x > 2', { from: 2, to: null, fromOpen: true, toOpen: false }],
      ['solved f′(x) < 0 instead of f″(x) < 0: (0, 4)', { from: 0, to: 4, fromOpen: true, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: CDN, t: 'concave-down-quartic-between-roots', d: 2, sub: 'Concave down between the zeros of f″',
    q: 'Let f(x) = x⁴ + 2x³ − 12x². Show where the graph of f is concave down on the number line, using open circles at the ends.',
    a: '(−2, 1)',
    s: 'f′(x) = 4x³ + 6x² − 24x and f″(x) = 12x² + 12x − 24 = 12(x² + x − 2) = 12(x + 2)(x − 1). f″ is zero at x = −2 and x = 1. Test points: f″(−3) = 48 > 0, f″(0) = −24 < 0, f″(2) = 48 > 0. So f″(x) < 0 only for −2 < x < 1: the graph is concave down on (−2, 1). Mark the interval from −2 to 1 with open circles at both ends.',
    h: ['Find f″(x) and factor it completely.', 'An upward-opening quadratic is negative only between its zeros.'],
    line: { min: -4, max: 4, step: 1 }, key: { from: -2, to: 1, fromOpen: true, toOpen: true },
    holds: ['f″(x) < 0 for f(x) = x⁴ + 2x³ − 12x² (second derivative found numerically)', (x) => second((t) => t ** 4 + 2 * t ** 3 - 12 * t ** 2, x) < 0],
    misses: [
      ['sign slip in factoring: zeros −1 and 2', { from: -1, to: 2, fromOpen: true, toOpen: true }],
      ['closed circles at the zeros of f″', { from: -2, to: 1, fromOpen: false, toOpen: false }],
    ],
  },
];
