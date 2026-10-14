/** T4 drawn items — group calcbc-stats (see kit.ts for the shape and the proof rules). */
import type { DrawnItem, Pt } from './kit';
import { deriv, lsrl, polar, tangentResidual, throughResidual } from './kit';

// ── local proof helpers (numerical, independent of the hand-derived work) ──

/** Numerical second derivative (central second difference, step scaled to x). */
function deriv2(f: (x: number) => number, x: number): number {
  const h = 1e-3 * Math.max(1, Math.abs(x));
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

/** Tangent line to the parametric curve (x(t), y(t)) at t = a, slope found numerically: residual y − (y(a) + m(x − x(a))). */
function paramTangent(xf: (t: number) => number, yf: (t: number) => number, a: number): (x: number, y: number) => number {
  const m = deriv(yf, a) / deriv(xf, a);
  const x0 = xf(a);
  const y0 = yf(a);
  return (x, y) => y - (y0 + m * (x - x0));
}

/**
 * Points (x(t), y(t)) for t in [a, b] where the curve has a horizontal tangent
 * (dy/dt changes sign while dx/dt ≠ 0) or a vertical one (dx/dt changes sign while
 * dy/dt ≠ 0). Derivatives numerical; roots by bisection; coordinates rounded to 9 places.
 */
function tangentPoints(xf: (t: number) => number, yf: (t: number) => number, a: number, b: number, which: 'horizontal' | 'vertical'): Pt[] {
  const g = which === 'horizontal' ? (t: number) => deriv(yf, t) : (t: number) => deriv(xf, t);
  const other = which === 'horizontal' ? (t: number) => deriv(xf, t) : (t: number) => deriv(yf, t);
  const out: Pt[] = [];
  const step = 0.001234;
  for (let t = a; t < b; t += step) {
    let lo = t;
    let hi = t + step;
    if (Math.sign(g(lo)) === Math.sign(g(hi))) continue;
    for (let k = 0; k < 80; k++) {
      const mid = (lo + hi) / 2;
      if (Math.sign(g(mid)) === Math.sign(g(lo))) lo = mid;
      else hi = mid;
    }
    const r = (lo + hi) / 2;
    if (Math.abs(other(r)) < 1e-6) continue;
    const round = (v: number) => Math.round(v * 1e9) / 1e9 + 0;
    out.push([round(xf(r)), round(yf(r))]);
  }
  return out;
}

const residualPoints = (xs: number[], ys: number[], predict: (x: number) => number): Pt[] => xs.map((x, i) => [x, Math.round((ys[i] - predict(x)) * 1e9) / 1e9 + 0]);

export const ITEMS: DrawnItem[] = [
  // ── apcalcbc.power-series ────────────────────────────────────────────────
  {
    kind: 'interval', lo: 'apcalcbc.power-series', t: 'ioc-n-times-power-of-two', d: 2, sub: 'Interval of convergence with endpoint tests',
    q: 'Find the interval of convergence of the power series Σ (x − 3)ⁿ / (n · 2ⁿ), summed from n = 1 to ∞, and show it on the number line.',
    a: '[1, 5)',
    s: 'Ratio test: |a(n+1)/a(n)| = |x − 3| · n / (2(n + 1)) → |x − 3|/2. The series converges when |x − 3|/2 < 1, that is |x − 3| < 2, so R = 2 and the open interval is 1 < x < 5. Endpoints: at x = 5 the series is Σ 2ⁿ/(n · 2ⁿ) = Σ 1/n, the harmonic series, which diverges. At x = 1 it is Σ (−2)ⁿ/(n · 2ⁿ) = Σ (−1)ⁿ/n, the alternating harmonic series, which converges by the alternating series test. The interval of convergence is [1, 5): a closed circle at 1, an open circle at 5, and the segment between them.',
    h: ['Apply the ratio test and simplify the limit to a multiple of |x − 3|; that gives the radius.', 'Substitute each endpoint back into the series: one gives a p-series with p = 1, the other an alternating series.'],
    line: { min: -1, max: 7, step: 1 }, key: { from: 1, to: 5, fromOpen: false, toOpen: true },
    holds: ['ratio test |x − 3|/2 < 1 (R = 2), plus the endpoint results: x = 1 gives Σ(−1)ⁿ/n (converges), x = 5 gives Σ 1/n (diverges)', (x) => Math.abs(x - 3) / 2 < 1 || Math.abs(x - 1) < 1e-12],
    misses: [
      ['endpoints never tested: open interval (1, 5)', { from: 1, to: 5, fromOpen: true, toOpen: true }],
      ['endpoint results swapped: (1, 5]', { from: 1, to: 5, fromOpen: true, toOpen: false }],
      ['radius taken as 1 instead of 2: [2, 4)', { from: 2, to: 4, fromOpen: false, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: 'apcalcbc.power-series', t: 'ioc-alternating-sign-center-shift', d: 3, sub: 'Endpoint analysis with an alternating factor',
    q: 'Find the interval of convergence of the power series Σ (−1)ⁿ (x + 1)ⁿ / (n · 3ⁿ), summed from n = 1 to ∞, and show it on the number line.',
    a: '(−4, 2]',
    s: 'Ratio test: |a(n+1)/a(n)| = |x + 1| · n / (3(n + 1)) → |x + 1|/3. The series converges when |x + 1| < 3, so R = 3 and the open interval is −4 < x < 2. Endpoints: at x = 2, (x + 1)ⁿ = 3ⁿ and the series is Σ (−1)ⁿ/n, the alternating harmonic series, which converges by the alternating series test. At x = −4, (x + 1)ⁿ = (−3)ⁿ, so the terms are (−1)ⁿ(−1)ⁿ3ⁿ/(n · 3ⁿ) = 1/n and the series is the harmonic series, which diverges. The interval of convergence is (−4, 2]: an open circle at −4, a closed circle at 2, and the segment between them.',
    h: ['The center is where x + 1 = 0, and the ratio test gives the radius.', 'At each endpoint combine the (−1)ⁿ in front with the sign of (x + 1)ⁿ before deciding which test applies.'],
    line: { min: -6, max: 4, step: 1 }, key: { from: -4, to: 2, fromOpen: true, toOpen: false },
    holds: ['ratio test |x + 1|/3 < 1 (R = 3), plus the endpoint results: x = 2 gives Σ(−1)ⁿ/n (converges), x = −4 gives Σ 1/n (diverges)', (x) => Math.abs(x + 1) / 3 < 1 || Math.abs(x - 2) < 1e-12],
    misses: [
      ['the (−1)ⁿ factor ignored at the endpoints: [−4, 2)', { from: -4, to: 2, fromOpen: false, toOpen: true }],
      ['center taken as x = 1 instead of x = −1: (−2, 4]', { from: -2, to: 4, fromOpen: true, toOpen: false }],
      ['both endpoints included without testing: [−4, 2]', { from: -4, to: 2, fromOpen: false, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: 'apcalcbc.power-series', t: 'ioc-nth-term-divergence-both-ends', d: 1, sub: 'Both endpoints fail the nth-term test',
    q: 'Find the interval of convergence of the power series Σ n (x + 2)ⁿ / 3ⁿ, summed from n = 1 to ∞, and show it on the number line.',
    a: '(−5, 1)',
    s: 'Ratio test: |a(n+1)/a(n)| = |x + 2| · (n + 1) / (3n) → |x + 2|/3. The series converges when |x + 2| < 3, so R = 3 and the open interval is −5 < x < 1. Endpoints: at x = 1 the series is Σ n, whose terms grow without bound, so it diverges by the nth-term test. At x = −5 it is Σ n(−1)ⁿ, whose terms do not approach 0, so it also diverges. The interval of convergence is (−5, 1): open circles at −5 and 1 and the segment between them.',
    h: ['The factor (n + 1)/n tends to 1, so the ratio-test limit depends only on |x + 2|.', 'At an endpoint, check whether the terms even approach 0.'],
    line: { min: -7, max: 3, step: 1 }, key: { from: -5, to: 1, fromOpen: true, toOpen: true },
    holds: ['ratio test |x + 2|/3 < 1 (R = 3); both endpoints give Σ n or Σ n(−1)ⁿ, which diverge by the nth-term test', (x) => Math.abs(x + 2) / 3 < 1],
    misses: [
      ['both endpoints included: [−5, 1]', { from: -5, to: 1, fromOpen: false, toOpen: false }],
      ['center sign wrong (x = 2): (−1, 5)', { from: -1, to: 5, fromOpen: true, toOpen: true }],
    ],
  },

  // ── apcalcbc.linearization ───────────────────────────────────────────────
  {
    kind: 'line', lo: 'apcalcbc.linearization', t: 'graph-linearization-root-chain-rule', d: 2, sub: 'Linearization as the tangent line',
    q: 'Let f(x) = √(2x + 5). Graph the linearization L(x) of f at a = 2 on the coordinate grid by placing two points on it.',
    a: 'L(x) = 3 + (1/3)(x − 2)',
    s: 'f(2) = √9 = 3. By the chain rule f′(x) = 2/(2√(2x + 5)) = 1/√(2x + 5), so f′(2) = 1/3. L(x) = f(2) + f′(2)(x − 2) = 3 + (1/3)(x − 2). It passes through (2, 3); going right 3 and up 1 gives (5, 4), and going left 3 and down 1 gives (−1, 2). Place two of these points, for example (−1, 2) and (2, 3).',
    h: ['The line passes through the point (a, f(a)).', 'Its slope is f′(a); remember the chain-rule factor from the 2x inside the root.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, 2], [2, 3]],
    on: ['tangent line to √(2x + 5) at x = 2, slope found numerically', tangentResidual((x) => Math.sqrt(2 * x + 5), 2)],
    misses: [
      ['chain-rule factor of 2 forgotten: slope 1/6', [[2, 3], [-4, 2]]],
      ['slope inverted: slope 3', [[2, 3], [1, 0]]],
    ],
  },
  {
    kind: 'line', lo: 'apcalcbc.linearization', t: 'graph-linearization-exponential-at-zero', d: 1, sub: 'First-order approximation of an exponential',
    q: 'Graph the tangent-line approximation L(x) of f(x) = e^(2x) at a = 0 on the coordinate grid by placing two points on it.',
    a: 'L(x) = 1 + 2x',
    s: 'f(0) = e⁰ = 1. f′(x) = 2e^(2x), so f′(0) = 2. L(x) = f(0) + f′(0)(x − 0) = 1 + 2x. It passes through (0, 1) and, one unit to the right, (1, 3). Place two points of the line, for example (0, 1) and (1, 3). (Near 0, e^(2x) ≈ 1 + 2x; for example e^0.2 ≈ 1.4.)',
    h: ['Find the point of tangency first: what is f(0)?', 'Differentiate e^(2x) with the chain rule to get the slope at 0.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[0, 1], [1, 3]],
    on: ['tangent line to e^(2x) at x = 0, slope found numerically', tangentResidual((x) => Math.exp(2 * x), 0)],
    misses: [
      ['chain rule forgotten: slope 1', [[0, 1], [1, 2]]],
      ['the f(a) term dropped: y = 2x', [[0, 0], [1, 2]]],
    ],
  },

  // ── apcalcbc.derivative-definition ───────────────────────────────────────
  {
    kind: 'line', lo: 'apcalcbc.derivative-definition', t: 'graph-secant-from-difference-quotient', d: 1, sub: 'Difference quotient as a secant slope',
    q: 'Let f(x) = x² − 2x − 3. For a = −1 and h = 3, the difference quotient [f(a + h) − f(a)]/h is the slope of a secant line of the graph of f. Graph that secant line on the coordinate grid by placing two points on it.',
    a: 'y = −x − 1',
    s: 'The secant joins (a, f(a)) and (a + h, f(a + h)). f(−1) = 1 + 2 − 3 = 0 and f(2) = 4 − 4 − 3 = −3, so the points are (−1, 0) and (2, −3). Slope = (−3 − 0)/3 = −1, and the line is y − 0 = −1(x + 1), that is y = −x − 1. Place the two points (−1, 0) and (2, −3).',
    h: ['A secant line passes through two points of the graph: x = a and x = a + h.', 'Evaluate f at both x-values; the difference quotient is rise over run between them.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[-1, 0], [2, -3]],
    on: ['the line through (a, f(a)) and (a + h, f(a + h)), with f evaluated in code', throughResidual([-1, (-1) ** 2 - 2 * -1 - 3], [2, 2 ** 2 - 2 * 2 - 3])],
    misses: [
      ['the tangent at x = −1 (slope f′(−1) = −4) instead of the secant', [[-1, 0], [0, -4]]],
      ['f(a + h) replaced by f(h) = f(3) = 0: horizontal line', [[-1, 0], [2, 0]]],
    ],
  },
  {
    kind: 'line', lo: 'apcalcbc.derivative-definition', t: 'recognize-x-form-limit-and-graph-tangent', d: 3, sub: 'Recognizing a limit as a derivative',
    q: 'Let f(x) = x³. The limit lim (x → 1) of (x³ − 1)/(x − 1) equals f′(1). Evaluate the limit, then graph the line tangent to y = f(x) at x = 1 on the coordinate grid by placing two points on it.',
    a: 'y = 3x − 2',
    s: 'The limit has the form lim (x → a) [f(x) − f(a)]/(x − a) with f(x) = x³ and a = 1, since f(1) = 1. Factor: (x³ − 1)/(x − 1) = x² + x + 1 for x ≠ 1, which tends to 3, so f′(1) = 3. The tangent line passes through (1, f(1)) = (1, 1) with slope 3: y = 1 + 3(x − 1) = 3x − 2. Place two points of it, for example (0, −2) and (1, 1).',
    h: ['Compare the limit with lim (x → a) [f(x) − f(a)]/(x − a): which f and which a make the numerator match?', 'Factor the difference of cubes to cancel x − 1, then use the point (a, f(a)).'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, -2], [1, 1]],
    on: ['tangent line to x³ at x = 1, slope found numerically', tangentResidual((x) => x ** 3, 1)],
    misses: [
      ['the tangent through (1, 0) instead of (1, f(1)): y = 3x − 3', [[1, 0], [2, 3]]],
      ['the value f(1) = 1 used as the slope: y = x', [[0, 0], [1, 1]]],
    ],
  },

  // ── apcalcbc.first-derivative-analysis ───────────────────────────────────
  {
    kind: 'interval', lo: 'apcalcbc.first-derivative-analysis', t: 'increasing-ray-quartic', d: 2, sub: 'Where f′ > 0: one critical point',
    q: 'Let f(x) = x⁴ − 32x. Show the interval on which f is increasing on the number line, using an open circle at the end.',
    a: '(2, ∞)',
    s: 'f′(x) = 4x³ − 32 = 4(x³ − 8). The only critical point is where x³ = 8, x = 2. For x < 2, x³ < 8 so f′(x) < 0; for x > 2, f′(x) > 0. So f is increasing on (2, ∞) (and decreasing on (−∞, 2)). Draw an open circle at 2 and a ray to the right.',
    h: ['Find f′ and set it equal to 0 to locate the critical point.', 'Test the sign of f′ on each side of that point.'],
    line: { min: -3, max: 6, step: 1 }, key: { from: 2, to: null, fromOpen: true, toOpen: false },
    holds: ['f′(x) > 0, with f′ found numerically from f(x) = x⁴ − 32x', (x) => deriv((u) => u ** 4 - 32 * u, x) > 1e-7],
    misses: [
      ['decreasing interval marked instead: (−∞, 2)', { from: null, to: 2, fromOpen: false, toOpen: true }],
      ['x³ = 8 solved as x = ±2 and the ray started at −2', { from: -2, to: null, fromOpen: true, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: 'apcalcbc.first-derivative-analysis', t: 'increasing-interval-quotient-rule', d: 3, sub: 'Sign of f′ from the quotient rule',
    q: 'Let f(x) = 8x / (x² + 4). Show the interval on which f is increasing on the number line, using open circles at the ends.',
    a: '(−2, 2)',
    s: 'Quotient rule: f′(x) = [8(x² + 4) − 8x · 2x] / (x² + 4)² = (32 − 8x²)/(x² + 4)² = 8(4 − x²)/(x² + 4)². The denominator is always positive, so f′ has the sign of 4 − x², which is positive exactly when −2 < x < 2. f is increasing on (−2, 2) and decreasing on (−∞, −2) and on (2, ∞). Draw open circles at −2 and 2 and the segment between them.',
    h: ['Use the quotient rule and simplify the numerator completely.', 'The denominator is a square of a positive quantity, so only the numerator decides the sign.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: -2, to: 2, fromOpen: true, toOpen: true },
    holds: ['f′(x) > 0, with f′ found numerically from f(x) = 8x/(x² + 4)', (x) => deriv((u) => (8 * u) / (u * u + 4), x) > 1e-7],
    misses: [
      ['only the sign of the original numerator 8x used: (0, ∞)', { from: 0, to: null, fromOpen: true, toOpen: false }],
      ['quotient-rule numerator subtracted the wrong way round: increasing on (2, ∞) only', { from: 2, to: null, fromOpen: true, toOpen: false }],
    ],
  },

  // ── apcalcbc.concavity-second-derivative ─────────────────────────────────
  {
    kind: 'interval', lo: 'apcalcbc.concavity-second-derivative', t: 'concave-up-ray-cubic', d: 1, sub: 'Concave up where f″ > 0',
    q: 'Let f(x) = x³ + 3x² − x. Show the interval on which the graph of f is concave up on the number line, using an open circle at the end.',
    a: '(−1, ∞)',
    s: 'f′(x) = 3x² + 6x − 1 and f″(x) = 6x + 6. f″(x) > 0 when 6x > −6, that is x > −1. So f is concave up on (−1, ∞) (and concave down on (−∞, −1), with an inflection point at x = −1). Draw an open circle at −1 and a ray to the right.',
    h: ['Differentiate twice.', 'Concave up means the second derivative is positive; solve that inequality.'],
    line: { min: -4, max: 4, step: 1 }, key: { from: -1, to: null, fromOpen: true, toOpen: false },
    holds: ['f″(x) > 0, with f″ found numerically from f(x) = x³ + 3x² − x', (x) => deriv2((u) => u ** 3 + 3 * u ** 2 - u, x) > 1e-6],
    misses: [
      ['concave down interval marked instead: (−∞, −1)', { from: null, to: -1, fromOpen: false, toOpen: true }],
      ['sign slip solving 6x + 6 > 0: (1, ∞)', { from: 1, to: null, fromOpen: true, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: 'apcalcbc.concavity-second-derivative', t: 'concave-down-between-inflections-quartic', d: 3, sub: 'Concavity of a quartic between two inflection points',
    q: 'Let f(x) = x⁴ − 6x³ + 12x² + 1. Show the interval on which the graph of f is concave down on the number line, using open circles at the ends.',
    a: '(1, 2)',
    s: 'f′(x) = 4x³ − 18x² + 24x and f″(x) = 12x² − 36x + 24 = 12(x² − 3x + 2) = 12(x − 1)(x − 2). The product (x − 1)(x − 2) is negative exactly when 1 < x < 2, so f″ < 0 there and f is concave down on (1, 2). (It is concave up on (−∞, 1) and on (2, ∞); x = 1 and x = 2 are inflection points.) Draw open circles at 1 and 2 and the segment between them.',
    h: ['Find f″ and factor out the common factor 12.', 'A product of two linear factors is negative between its zeros.'],
    line: { min: -2, max: 5, step: 1 }, key: { from: 1, to: 2, fromOpen: true, toOpen: true },
    holds: ['f″(x) < 0, with f″ found numerically from f(x) = x⁴ − 6x³ + 12x² + 1', (x) => deriv2((u) => u ** 4 - 6 * u ** 3 + 12 * u ** 2 + 1, x) < -1e-6],
    misses: [
      ['concave up mistaken for concave down: the right-hand piece (2, ∞)', { from: 2, to: null, fromOpen: true, toOpen: false }],
      ['f″ factored as 12(x + 1)(x + 2): (−2, −1)', { from: -2, to: -1, fromOpen: true, toOpen: true }],
    ],
  },

  // ── apcalcbc.polar-coordinates ───────────────────────────────────────────
  {
    kind: 'points', lo: 'apcalcbc.polar-coordinates', t: 'plot-three-polar-points-negative-r', d: 2, sub: 'Polar to rectangular, including negative r',
    q: 'Convert the polar points (2√2, 3π/4), (−3, π/2) and (3√2, −π/4) to rectangular coordinates and plot the three points on the coordinate grid.',
    a: '(−2, 2), (0, −3), (3, −3)',
    s: 'Use x = r cos θ and y = r sin θ. (2√2, 3π/4): x = 2√2 · (−√2/2) = −2, y = 2√2 · (√2/2) = 2, giving (−2, 2). (−3, π/2): x = −3 · 0 = 0, y = −3 · 1 = −3, giving (0, −3); a negative r points the opposite way from the angle. (3√2, −π/4): x = 3√2 · (√2/2) = 3, y = 3√2 · (−√2/2) = −3, giving (3, −3). Plot the three points.',
    h: ['x = r cos θ and y = r sin θ, with r used together with its sign.', 'A negative r means you go the distance |r| in the direction opposite to the angle θ.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[-2, 2], [0, -3], [3, -3]],
    calc: ['x = r cos θ, y = r sin θ applied to each polar point', () => [polar(2 * Math.SQRT2, (3 * Math.PI) / 4), polar(-3, Math.PI / 2), polar(3 * Math.SQRT2, -Math.PI / 4)].map(([x, y]) => [x + 0, y + 0] as Pt)],
    misses: [
      ['the sign of r = −3 ignored', [[-2, 2], [0, 3], [3, -3]]],
      ['cos and sin swapped', [[2, -2], [-3, 0], [-3, 3]]],
    ],
  },
  {
    kind: 'points', lo: 'apcalcbc.polar-coordinates', t: 'plot-horizontal-tangent-points-polar-circle', d: 3, sub: 'Horizontal tangents of a polar curve',
    q: 'The polar curve r = 4 cos θ, for 0 ≤ θ < π, has exactly two points where the tangent line is horizontal. Find them and plot both points, in rectangular coordinates, on the coordinate grid.',
    a: '(2, 2) and (2, −2)',
    s: 'With r = 4 cos θ and r′ = −4 sin θ: dy/dθ = r′ sin θ + r cos θ = −4 sin²θ + 4 cos²θ = 4 cos 2θ, and dx/dθ = r′ cos θ − r sin θ = −8 sin θ cos θ = −4 sin 2θ. Horizontal tangent: dy/dθ = 0 with dx/dθ ≠ 0. cos 2θ = 0 gives θ = π/4 and θ = 3π/4, where dx/dθ = ∓4 ≠ 0. At θ = π/4, r = 2√2, so (x, y) = (2√2 cos π/4, 2√2 sin π/4) = (2, 2). At θ = 3π/4, r = −2√2, so (x, y) = (−2√2 · (−√2/2), −2√2 · (√2/2)) = (2, −2). Plot (2, 2) and (2, −2).',
    h: ['Write x = r cos θ and y = r sin θ, then find dy/dθ and dx/dθ.', 'A horizontal tangent needs dy/dθ = 0 while dx/dθ is not 0; keep the sign of r when you convert.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[2, 2], [2, -2]],
    calc: ['dy/dθ = 0 with dx/dθ ≠ 0, found numerically on x = 4cos²θ, y = 4cos θ sin θ for θ in [0, π)', () => tangentPoints((t) => 4 * Math.cos(t) * Math.cos(t), (t) => 4 * Math.cos(t) * Math.sin(t), 0, Math.PI - 0.002, 'horizontal')],
    misses: [
      ['vertical-tangent points found instead', [[0, 0], [4, 0]]],
      ['r = −2√2 treated as +2√2 at θ = 3π/4', [[2, 2], [-2, 2]]],
    ],
  },

  // ── apcalcbc.parametric ──────────────────────────────────────────────────
  {
    kind: 'points', lo: 'apcalcbc.parametric', t: 'plot-horizontal-tangent-points-parametric', d: 2, sub: 'Horizontal tangents of a parametric curve',
    q: 'A curve is given by x = t² − 4t and y = t³ − 3t. Find every point where the curve has a horizontal tangent line and plot those points on the coordinate grid.',
    a: '(−3, −2) and (5, 2)',
    s: 'dx/dt = 2t − 4 and dy/dt = 3t² − 3. A horizontal tangent needs dy/dt = 0 with dx/dt ≠ 0: 3t² − 3 = 0 gives t = 1 or t = −1, where dx/dt = −2 and −6, both nonzero. At t = 1: x = 1 − 4 = −3, y = 1 − 3 = −2. At t = −1: x = 1 + 4 = 5, y = −1 + 3 = 2. Plot (−3, −2) and (5, 2).',
    h: ['dy/dx = (dy/dt)/(dx/dt), so a horizontal tangent comes from the numerator being 0.', 'Check that dx/dt is not also 0 there, then convert each t into a point (x, y).'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-3, -2], [5, 2]],
    calc: ['dy/dt = 0 with dx/dt ≠ 0, found numerically for t in [−10, 10]', () => tangentPoints((t) => t * t - 4 * t, (t) => t ** 3 - 3 * t, -10, 10, 'horizontal')],
    misses: [
      ['vertical tangent found instead (dx/dt = 0 at t = 2)', [[-4, 2]]],
      ['the t-values plotted as x: (t, y)', [[1, -2], [-1, 2]]],
    ],
  },
  {
    kind: 'line', lo: 'apcalcbc.parametric', t: 'graph-tangent-line-parametric', d: 1, sub: 'Tangent line from dy/dx = (dy/dt)/(dx/dt)',
    q: 'A curve is given by x = t² − 3 and y = t³ − 4t. Graph the line tangent to the curve at t = 2 on the coordinate grid by placing two points on it.',
    a: 'y = 2x − 2',
    s: 'At t = 2: x = 4 − 3 = 1 and y = 8 − 8 = 0, so the point is (1, 0). dx/dt = 2t = 4 and dy/dt = 3t² − 4 = 8, so dy/dx = 8/4 = 2. The tangent line is y − 0 = 2(x − 1), that is y = 2x − 2. Place two of its points, for example (1, 0) and (2, 2).',
    h: ['Find the point (x, y) at t = 2 first.', 'The slope is dy/dt divided by dx/dt, both evaluated at t = 2.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[1, 0], [2, 2]],
    on: ['tangent line at t = 2, slope (dy/dt)/(dx/dt) found numerically', paramTangent((t) => t * t - 3, (t) => t ** 3 - 4 * t, 2)],
    misses: [
      ['slope inverted: (dx/dt)/(dy/dt) = 1/2', [[1, 0], [3, 1]]],
      ['the point (t, y) = (2, 0) used instead of (x, y)', [[2, 0], [3, 2]]],
    ],
  },

  // ── apstats.scatterplots ─────────────────────────────────────────────────
  {
    kind: 'points', lo: 'apstats.scatterplots', t: 'construct-scatterplot-six-students', d: 1, sub: 'Constructing a scatterplot',
    q: 'Six students reported hours studied and quiz score (out of 10): (1 hour, 3), (2 hours, 4), (3 hours, 4), (4 hours, 6), (5 hours, 7), (6 hours, 9). Make a scatterplot with hours studied as the explanatory variable: plot the six points on the grid.',
    a: '(1, 3), (2, 4), (3, 4), (4, 6), (5, 7), (6, 9)',
    s: 'Hours studied is the explanatory variable, so it goes on the horizontal axis; quiz score is the response, on the vertical axis. Each student is one point (hours, score): (1, 3), (2, 4), (3, 4), (4, 6), (5, 7), (6, 9). Plot these six points. The scatterplot shows a strong, positive, linear association with no clear outliers.',
    h: ['The explanatory variable goes on the horizontal axis.', 'Each student becomes one point; read each pair as (hours, score).'],
    grid: { xRange: [0, 10], yRange: [0, 10], xLabel: 'hours studied', yLabel: 'quiz score' }, key: [[1, 3], [2, 4], [3, 4], [4, 6], [5, 7], [6, 9]],
    calc: ['each (hours, score) pair as a point', () => ([[1, 3], [2, 4], [3, 4], [4, 6], [5, 7], [6, 9]] as Pt[]).map(([h, s]) => [h, s] as Pt)],
    misses: [
      ['axes swapped: score plotted horizontally', [[3, 1], [4, 2], [4, 3], [6, 4], [7, 5], [9, 6]]],
      ['duplicate score 4 plotted once only', [[1, 3], [2, 4], [4, 6], [5, 7], [6, 9]]],
    ],
  },
  {
    kind: 'points', lo: 'apstats.scatterplots', t: 'scatterplot-pairs-given-response-first', d: 2, sub: 'Choosing the axes for explanatory and response',
    q: 'For five used cars of the same model, the resale value (thousands of dollars) and the age (years) were: value 18 at age 2, value 10 at age 7, value 14 at age 3, value 6 at age 9, value 12 at age 5. Make a scatterplot with the explanatory variable on the horizontal axis: plot the five points on the grid.',
    a: '(2, 18), (3, 14), (5, 12), (7, 10), (9, 6)',
    s: 'Age is the explanatory variable (it helps predict value), so age goes on the horizontal axis and resale value on the vertical axis. The data are listed value first, so each pair must be turned round into (age, value): (2, 18), (7, 10), (3, 14), (9, 6), (5, 12). Plot these five points. The scatterplot shows a strong, negative, roughly linear association: older cars tend to be worth less.',
    h: ['Decide which variable explains or predicts the other.', 'The data are listed response first; write each pair as (explanatory, response) before plotting.'],
    grid: { xRange: [0, 10], yRange: [0, 20], yStep: 4, xLabel: 'age (years)', yLabel: 'value (thousand dollars)' }, snap: { x: 1, y: 2 }, key: [[2, 18], [3, 14], [5, 12], [7, 10], [9, 6]],
    calc: ['each (value, age) pair turned round into (age, value)', () => ([[18, 2], [10, 7], [14, 3], [6, 9], [12, 5]] as Pt[]).map(([v, a]) => [a, v] as Pt)],
    misses: [
      ['ages paired with values in sorted order instead of as listed', [[2, 6], [3, 10], [5, 12], [7, 14], [9, 18]]],
      ['one pair misread: value 10 plotted at age 9 and value 6 at age 7', [[2, 18], [3, 14], [5, 12], [9, 10], [7, 6]]],
    ],
  },

  // ── apstats.residuals ────────────────────────────────────────────────────
  {
    kind: 'points', lo: 'apstats.residuals', t: 'residual-plot-from-given-line', d: 2, sub: 'Constructing a residual plot',
    q: 'A regression of plant growth y (cm) on hours of daily sunlight x gives ŷ = 10 + 2x. The data are (1, 13), (2, 12), (3, 18), (4, 17), (5, 20). Make the residual plot: plot the five points (x, residual) on the grid.',
    a: '(1, 1), (2, −2), (3, 2), (4, −1), (5, 0)',
    s: 'Residual = y − ŷ. Predicted values: ŷ = 12, 14, 16, 18, 20 for x = 1, 2, 3, 4, 5. Residuals: 13 − 12 = 1, 12 − 14 = −2, 18 − 16 = 2, 17 − 18 = −1, 20 − 20 = 0. Plot (1, 1), (2, −2), (3, 2), (4, −1), (5, 0). The residuals sum to 0 and show no pattern, so a linear model looks appropriate.',
    h: ['A residual is the actual value minus the predicted value.', 'In a residual plot the horizontal axis is still x; the vertical axis is the residual.'],
    grid: { xRange: [0, 6], yRange: [-4, 4], xStep: 2, yStep: 2, xLabel: 'hours of sunlight', yLabel: 'residual' }, key: [[1, 1], [2, -2], [3, 2], [4, -1], [5, 0]],
    calc: ['y − (10 + 2x) for each data point', () => residualPoints([1, 2, 3, 4, 5], [13, 12, 18, 17, 20], (x) => 10 + 2 * x)],
    misses: [
      ['residual taken as ŷ − y (signs flipped)', [[1, -1], [2, 2], [3, -2], [4, 1], [5, 0]]],
      ['arithmetic slip: 17 − 18 taken as +1', [[1, 1], [2, -2], [3, 2], [4, 1], [5, 0]]],
    ],
  },
  {
    kind: 'points', lo: 'apstats.residuals', t: 'residual-plot-after-finding-lsrl', d: 3, sub: 'Residual plot showing curvature',
    q: 'Five points are (1, 5), (2, 4), (3, 5), (4, 8), (5, 13). The least-squares regression line has slope b = 2 and passes through (x̄, ȳ). Find the line, then plot the five residual-plot points (x, residual) on the grid.',
    a: '(1, 2), (2, −1), (3, −2), (4, −1), (5, 2)',
    s: 'x̄ = (1 + 2 + 3 + 4 + 5)/5 = 3 and ȳ = (5 + 4 + 5 + 8 + 13)/5 = 7. The intercept is a = ȳ − b·x̄ = 7 − 2·3 = 1, so ŷ = 1 + 2x. Predicted values: 3, 5, 7, 9, 11. Residuals y − ŷ: 5 − 3 = 2, 4 − 5 = −1, 5 − 7 = −2, 8 − 9 = −1, 13 − 11 = 2. Plot (1, 2), (2, −1), (3, −2), (4, −1), (5, 2). The residuals form a U-shape, so a linear model is not appropriate: the data are curved.',
    h: ['The LSRL always passes through (x̄, ȳ); use that with the slope to find the intercept.', 'Compute each residual as actual minus predicted, then plot it above its x-value.'],
    grid: { xRange: [0, 6], yRange: [-4, 4], xStep: 2, yStep: 2, xLabel: 'x', yLabel: 'residual' }, key: [[1, 2], [2, -1], [3, -2], [4, -1], [5, 2]],
    calc: ['least-squares line computed from the data (lsrl), then y − ŷ for each point', () => {
      const xs = [1, 2, 3, 4, 5];
      const ys = [5, 4, 5, 8, 13];
      const { a, b } = lsrl(xs, ys);
      return residualPoints(xs, ys, (x) => a + b * x);
    }],
    misses: [
      ['intercept taken as ȳ = 7 (ŷ = 7 + 2x)', [[1, -4], [2, -1], [3, -2], [4, -1], [5, 2]]],
      ['residual taken as ŷ − y (signs flipped)', [[1, -2], [2, 1], [3, 2], [4, 1], [5, -2]]],
    ],
  },

  // ── apstats.linear-regression ────────────────────────────────────────────
  {
    kind: 'line', lo: 'apstats.linear-regression', t: 'graph-lsrl-from-summary-statistics', d: 3, sub: 'LSRL from r, s_x, s_y and the means',
    q: 'For a class, x = days absent and y = quiz score (out of 10) have x̄ = 4, ȳ = 5, s_x = 3, s_y = 2 and r = −0.75. Find the least-squares regression line and graph it on the grid by placing two points on it.',
    a: 'ŷ = 7 − 0.5x',
    s: 'Slope b = r · s_y/s_x = −0.75 · 2/3 = −0.5. The line passes through (x̄, ȳ) = (4, 5), so a = ȳ − b·x̄ = 5 − (−0.5)(4) = 7. The LSRL is ŷ = 7 − 0.5x: each extra day absent lowers the predicted quiz score by 0.5 point. Place two points of it, for example (2, 6) and (6, 4).',
    h: ['The slope is r times s_y divided by s_x.', 'The least-squares line always passes through the point of means (x̄, ȳ).'],
    grid: { xRange: [0, 10], yRange: [0, 10], xLabel: 'days absent', yLabel: 'quiz score' }, key: [[2, 6], [6, 4]],
    on: ['ŷ − ȳ = r(s_y/s_x)(x − x̄) with the given statistics', (x, y) => y - (5 + (-0.75 * 2) / 3 * (x - 4))],
    misses: [
      ['r used as the slope without scaling by s_y/s_x', [[4, 5], [8, 2]]],
      ['the negative sign of r dropped: slope +0.5', [[4, 5], [6, 6]]],
    ],
  },
  {
    kind: 'line', lo: 'apstats.linear-regression', t: 'graph-lsrl-intercept-from-means', d: 2, sub: 'Intercept from a = ȳ − b·x̄',
    q: 'A regression of resale value y (thousands of dollars) on car age x (years) has slope b = −2. The mean age is x̄ = 4 years and the mean value is ȳ = 12. Find the regression equation and graph the line on the grid by placing two points on it.',
    a: 'ŷ = 20 − 2x',
    s: 'The least-squares line passes through (x̄, ȳ) = (4, 12). a = ȳ − b·x̄ = 12 − (−2)(4) = 20, so ŷ = 20 − 2x: each additional year of age lowers the predicted value by 2 thousand dollars. Place two points of the line, for example (4, 12) and (8, 4).',
    h: ['The line must pass through the point of means.', 'Use a = ȳ − b·x̄, watching the sign of b.'],
    grid: { xRange: [0, 10], yRange: [0, 24], yStep: 4, xLabel: 'age (years)', yLabel: 'value (thousand dollars)' }, snap: { x: 1, y: 2 }, key: [[4, 12], [8, 4]],
    on: ['through (x̄, ȳ) = (4, 12) with slope −2', (x, y) => y - (12 + -2 * (x - 4))],
    misses: [
      ['a computed as ȳ + b·x̄ = 4: ŷ = 4 − 2x', [[0, 4], [2, 0]]],
      ['the sign of the slope dropped: ŷ = 4 + 2x', [[0, 4], [4, 12]]],
    ],
  },
];
