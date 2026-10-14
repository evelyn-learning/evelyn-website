/** T4 drawn items — group precalc (see kit.ts for the shape and the proof rules). */
import type { DrawnItem, Pt } from './kit';
import { polar, quadRoots } from './kit';

const INEQ = 'gen-4ecdb7b8-a064-4200-992c-ed7522798e81.lo-3';
const DOMAIN = 'gen-61afb8a2-e9b4-419e-881e-64aaac359d87.lo-3';
const COMPOSITE = 'gen-a3a0849a-4fde-4fb4-aeed-8d3cca7873c8.lo-6';
const COMPLEX = 'gen-2515225c-cc4c-4136-a844-d07fbebae2a4.lo-1';
const POLAR = 'gen-ea46bc2b-6a29-40ed-9938-19abb8ba2a0e.lo-3';
const HYPERBOLA = 'gen-2753d0ea-f0fb-41e7-b6eb-2333667f9831.lo-3';
const ELLIPSE = 'gen-85ec2ae2-32e8-4279-9381-99017036f227.lo-2';
const SYSTEMS = 'gen-20c673c2-3b4a-41c3-bfab-a2c77b2b5064.lo-5';

const deg = (d: number) => (d * Math.PI) / 180;
/** Complex multiply (a + bi)(c + di) as [re, im]. */
const cmul = ([a, b]: Pt, [c, d]: Pt): Pt => [a * c - b * d, a * d + b * c];

export const ITEMS: DrawnItem[] = [
  // ── Polynomial and rational inequalities ──────────────────────────────────
  {
    kind: 'interval', lo: INEQ, t: 'quadratic-le-zero-closed-interval', d: 1, sub: 'Quadratic inequality by sign chart',
    q: 'Solve x² − 2x − 8 ≤ 0 and show the solution set on the number line.',
    a: '[−2, 4]',
    s: 'Factor: x² − 2x − 8 = (x − 4)(x + 2). The zeros are x = −2 and x = 4. Test one number in each region: x = −3 gives (−7)(−1) = 7 > 0; x = 0 gives (−4)(2) = −8 < 0; x = 5 gives (1)(7) = 7 > 0. The expression is negative between the zeros, and ≤ allows it to equal 0, so both zeros are included: −2 ≤ x ≤ 4. Draw closed circles at −2 and 4 and shade between them.',
    h: ['Factor the quadratic and find where it equals zero.', 'Use a sign chart: which region makes the product negative, and does ≤ include the zeros?'],
    line: { min: -5, max: 6, step: 1 }, key: { from: -2, to: 4, fromOpen: false, toOpen: false },
    holds: ['x² − 2x − 8 ≤ 0, evaluated directly', (x) => x ** 2 - 2 * x - 8 <= 0],
    misses: [
      ['zeros excluded although the inequality is ≤', { from: -2, to: 4, fromOpen: true, toOpen: true }],
      ['zeros taken with the wrong signs: (x + 4)(x − 2)', { from: -4, to: 2, fromOpen: false, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: INEQ, t: 'rational-le-zero-exclude-pole', d: 2, sub: 'Rational inequality: include zeros, exclude undefined points',
    q: 'Solve (x + 3)/(x − 2) ≤ 0 and show the solution set on the number line.',
    a: '[−3, 2)',
    s: 'The critical values are x = −3 (numerator zero) and x = 2 (denominator zero). Test each region: x = −4 gives (−1)/(−6) > 0; x = 0 gives 3/(−2) < 0; x = 3 gives 6/1 > 0. The quotient is negative between −3 and 2. At x = −3 the quotient is 0, which satisfies ≤, so −3 is included; at x = 2 the expression is undefined, so 2 is excluded. Solution: −3 ≤ x < 2. Draw a closed circle at −3, an open circle at 2, and shade between.',
    h: ['Find the numbers that make the numerator zero and the denominator zero.', 'A zero of the numerator may be included, but a number that makes the denominator zero never is.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: -3, to: 2, fromOpen: false, toOpen: true },
    holds: ['(x + 3)/(x − 2) ≤ 0, evaluated directly (undefined at 2)', (x) => (x + 3) / (x - 2) <= 0],
    misses: [
      ['included x = 2, where the expression is undefined', { from: -3, to: 2, fromOpen: false, toOpen: false }],
      ['excluded the zero x = −3 although ≤ allows 0', { from: -3, to: 2, fromOpen: true, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: INEQ, t: 'cubic-double-root-strict', d: 3, sub: 'Polynomial inequality with a double root',
    q: 'Solve x³ − 6x² + 9x < 0 and show the solution set on the number line.',
    a: 'x < 0',
    s: 'Factor: x³ − 6x² + 9x = x(x² − 6x + 9) = x(x − 3)². The zeros are 0 and 3, and 3 is a double root, so the sign does not change there: (x − 3)² is positive for every x ≠ 3. The product is therefore negative exactly when x < 0 (at x = 3 it equals 0, which does not satisfy the strict <). Test: x = −1 gives −16 < 0; x = 1 gives 4 > 0; x = 4 gives 4 > 0. Draw an open circle at 0 and a ray to the left.',
    h: ['Factor out x first, then look at what is left.', 'At a squared factor the sign of the expression does not change; check a test value on each side.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: null, to: 0, fromOpen: false, toOpen: true },
    holds: ['x³ − 6x² + 9x < 0, evaluated directly', (x) => x ** 3 - 6 * x ** 2 + 9 * x < 0],
    misses: [
      ['closed circle at 0 although the inequality is strict', { from: null, to: 0, fromOpen: false, toOpen: false }],
      ['assumed the sign alternates and took the region between the roots', { from: 0, to: 3, fromOpen: true, toOpen: true }],
      ['chose where the expression is positive', { from: 0, to: null, fromOpen: true, toOpen: false }],
    ],
  },

  // ── Domain from an equation ───────────────────────────────────────────────
  {
    kind: 'interval', lo: DOMAIN, t: 'sqrt-radicand-ray-left', d: 1, sub: 'Domain of a square root function',
    q: 'Find the domain of f(x) = √(5 − x) and show it on the number line.',
    a: 'x ≤ 5, that is (−∞, 5]',
    s: 'The radicand of a square root must be non-negative: 5 − x ≥ 0, so 5 ≥ x, that is x ≤ 5. At x = 5, f(5) = √0 = 0 is defined, so 5 is included. Draw a closed circle at 5 and a ray to the left.',
    h: ['What must be true of the expression under a square root?', 'Solve that inequality for x; watch which way it points when the x-term is negative.'],
    line: { min: -3, max: 8, step: 1 }, key: { from: null, to: 5, fromOpen: false, toOpen: false },
    holds: ['f(x) = √(5 − x) is a real number', (x) => Number.isFinite(Math.sqrt(5 - x))],
    misses: [
      ['inequality direction reversed: x ≥ 5', { from: 5, to: null, fromOpen: false, toOpen: false }],
      ['excluded 5 although √0 is defined', { from: null, to: 5, fromOpen: false, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: DOMAIN, t: 'sqrt-in-denominator-open-ray', d: 2, sub: 'Square root in a denominator',
    q: 'Find the domain of f(x) = (x − 1)/√(2x + 6) and show it on the number line.',
    a: 'x > −3, that is (−3, ∞)',
    s: 'Two restrictions: the radicand must be non-negative, 2x + 6 ≥ 0, and the denominator √(2x + 6) must not be 0, so 2x + 6 ≠ 0. Together: 2x + 6 > 0, so x > −3. The numerator x − 1 adds no restriction. Draw an open circle at −3 and a ray to the right.',
    h: ['List every restriction: what is under the root, and what is in the denominator.', 'Combine "≥ 0" for the radicand with "≠ 0" for the denominator.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: -3, to: null, fromOpen: true, toOpen: false },
    holds: ['f(x) = (x − 1)/√(2x + 6) is a real number', (x) => Number.isFinite((x - 1) / Math.sqrt(2 * x + 6))],
    misses: [
      ['included −3, where the denominator is 0', { from: -3, to: null, fromOpen: false, toOpen: false }],
      ['sign error solving 2x + 6 > 0: x > 3', { from: 3, to: null, fromOpen: true, toOpen: false }],
    ],
  },

  // ── Domain of a composite ────────────────────────────────────────────────
  {
    kind: 'interval', lo: COMPOSITE, t: 'outer-root-of-linear-inner', d: 2, sub: 'Outer restriction on the inner output',
    q: 'Let f(x) = √(x − 1) and g(x) = 5 − 2x. Find the complete domain of f(g(x)) and show it on the number line.',
    a: 'x ≤ 2, that is (−∞, 2]',
    s: 'g is a polynomial, so every x is in the domain of g. Next, g(x) must be in the domain of f: g(x) − 1 ≥ 0, so 5 − 2x − 1 ≥ 0, 4 − 2x ≥ 0, −2x ≥ −4, and dividing by −2 reverses the sign: x ≤ 2. At x = 2, f(g(2)) = √0 = 0, so 2 is included. Draw a closed circle at 2 and a ray to the left.',
    h: ['First check which x the inner function g accepts.', 'Then require the output g(x) to be an allowed input of f, and solve for x.'],
    line: { min: -4, max: 6, step: 1 }, key: { from: null, to: 2, fromOpen: false, toOpen: false },
    holds: ['f(g(x)) = √((5 − 2x) − 1) is a real number', (x) => {
      const g = (u: number) => 5 - 2 * u;
      const f = (u: number) => Math.sqrt(u - 1);
      return Number.isFinite(f(g(x)));
    }],
    misses: [
      ['did not reverse the sign when dividing by −2', { from: 2, to: null, fromOpen: false, toOpen: false }],
      ['used only the domain of f: x ≥ 1', { from: 1, to: null, fromOpen: false, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: COMPOSITE, t: 'outer-root-of-reciprocal-inner', d: 3, sub: 'Inner and outer restrictions combined',
    q: 'Let f(x) = √x and g(x) = 1/(x − 1). Find the complete domain of f(g(x)) and show it on the number line.',
    a: 'x > 1, that is (1, ∞)',
    s: 'Inner test: g(x) = 1/(x − 1) needs x ≠ 1. Outer test: f needs a non-negative input, so 1/(x − 1) ≥ 0. A fraction with numerator 1 is never 0, so this means 1/(x − 1) > 0, which happens exactly when x − 1 > 0, i.e. x > 1. Combining with x ≠ 1: x > 1. Draw an open circle at 1 and a ray to the right.',
    h: ['x must first be an allowed input of g; which value is excluded?', 'For the outer square root, decide when 1/(x − 1) is non-negative; can it ever equal 0?'],
    line: { min: -4, max: 6, step: 1 }, key: { from: 1, to: null, fromOpen: true, toOpen: false },
    holds: ['f(g(x)) = √(1/(x − 1)) is a real number', (x) => {
      const g = (u: number) => 1 / (u - 1);
      const f = (u: number) => Math.sqrt(u);
      return Number.isFinite(f(g(x)));
    }],
    misses: [
      ['included x = 1, where g is undefined', { from: 1, to: null, fromOpen: false, toOpen: false }],
      ['used only the domain of f: x ≥ 0', { from: 0, to: null, fromOpen: false, toOpen: false }],
    ],
  },

  // ── Complex numbers as points ────────────────────────────────────────────
  {
    kind: 'points', lo: COMPLEX, t: 'plot-three-complex-numbers', d: 1, sub: 'Plotting complex numbers',
    q: 'On the coordinate grid of the complex plane (real axis across, imaginary axis up), plot the three points that represent 4 + i, −2 + 3i and −3i.',
    a: '(4, 1), (−2, 3), (0, −3)',
    s: 'The complex number a + bi is the point (a, b): real part across, imaginary part up. 4 + i → (4, 1); −2 + 3i → (−2, 3); −3i = 0 − 3i → (0, −3). Plot these three points.',
    h: ['The real part gives the horizontal position and the imaginary part gives the vertical position.', 'A number with no real part lies on the imaginary axis.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6], xLabel: 'Re', yLabel: 'Im' }, key: [[4, 1], [-2, 3], [0, -3]],
    calc: ['a + bi → (a, b) for each number', () => ([[4, 1], [-2, 3], [0, -3]] as Pt[]).map(([a, b]) => [a, b] as Pt)],
    misses: [
      ['real and imaginary parts swapped', [[1, 4], [3, -2], [-3, 0]]],
      ['−3i put on the real axis', [[4, 1], [-2, 3], [-3, 0]]],
    ],
  },
  {
    kind: 'points', lo: COMPLEX, t: 'conjugate-negative-times-i', d: 3, sub: 'Conjugate, opposite and multiplying by i',
    q: 'Let z = 3 + 2i. On the coordinate grid of the complex plane (real axis across, imaginary axis up), plot the three points that represent the conjugate z̄, the opposite −z, and the product i·z.',
    a: 'z̄ = 3 − 2i at (3, −2); −z = −3 − 2i at (−3, −2); i·z = −2 + 3i at (−2, 3)',
    s: 'The conjugate changes the sign of the imaginary part: z̄ = 3 − 2i → (3, −2). The opposite changes both signs: −z = −3 − 2i → (−3, −2). Multiply: i·z = i(3 + 2i) = 3i + 2i² = 3i − 2 = −2 + 3i → (−2, 3). Plot these three points.',
    h: ['The conjugate reflects a point across the real axis; the opposite reflects it through the origin.', 'When you multiply by i, remember that i² = −1.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6], xLabel: 'Re', yLabel: 'Im' }, key: [[3, -2], [-3, -2], [-2, 3]],
    calc: ['conjugate (a, −b), opposite (−a, −b), i·z by complex multiplication', () => {
      const z: Pt = [3, 2];
      return [[z[0], -z[1]], [-z[0], -z[1]], cmul([0, 1], z)];
    }],
    misses: [
      ['i² taken as +1, so i·z = 2 + 3i', [[3, -2], [-3, -2], [2, 3]]],
      ['conjugate taken as −3 + 2i', [[-3, 2], [-3, -2], [-2, 3]]],
    ],
  },

  // ── Polar → rectangular ──────────────────────────────────────────────────
  {
    kind: 'points', lo: POLAR, t: 'convert-three-polar-points-degrees', d: 2, sub: 'x = r cos θ, y = r sin θ',
    q: 'Convert the polar points (4, 180°), (3, 90°) and (2√2, 45°) to rectangular coordinates and plot the three points on the coordinate grid.',
    a: '(−4, 0), (0, 3), (2, 2)',
    s: 'Use x = r cos θ and y = r sin θ. (4, 180°): x = 4·(−1) = −4, y = 4·0 = 0 → (−4, 0). (3, 90°): x = 3·0 = 0, y = 3·1 = 3 → (0, 3). (2√2, 45°): x = 2√2·(√2/2) = 2, y = 2√2·(√2/2) = 2 → (2, 2). Plot these three points.',
    h: ['Multiply r by cos θ for x and by sin θ for y.', 'Recall cos 45° = sin 45° = √2/2, and √2·√2 = 2.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-4, 0], [0, 3], [2, 2]],
    calc: ['polar(r, θ) for each point', () => [polar(4, deg(180)), polar(3, deg(90)), polar(2 * Math.SQRT2, deg(45))]],
    misses: [
      ['cos and sin swapped', [[0, -4], [3, 0], [2, 2]]],
      ['cos 180° taken as +1 instead of −1', [[4, 0], [0, 3], [2, 2]]],
    ],
  },
  {
    kind: 'points', lo: POLAR, t: 'convert-negative-r-radians', d: 3, sub: 'Negative r and radian angles',
    q: 'Convert the polar points (−3, π/2), (−5, π) and (−3√2, 7π/4) to rectangular coordinates and plot the three points on the coordinate grid.',
    a: '(0, −3), (5, 0), (−3, 3)',
    s: 'Use x = r cos θ and y = r sin θ; the formulas handle a negative r automatically. (−3, π/2): x = −3·0 = 0, y = −3·1 = −3 → (0, −3). (−5, π): x = −5·(−1) = 5, y = −5·0 = 0 → (5, 0). (−3√2, 7π/4): cos 7π/4 = √2/2 and sin 7π/4 = −√2/2, so x = −3√2·(√2/2) = −3 and y = −3√2·(−√2/2) = 3 → (−3, 3). Plot these three points.',
    h: ['Apply x = r cos θ and y = r sin θ with r negative; no quadrant adjustment is needed.', 'A negative r puts the point on the opposite side of the origin from the direction θ.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, -3], [5, 0], [-3, 3]],
    calc: ['polar(r, θ) for each point, r negative', () => [polar(-3, Math.PI / 2), polar(-5, Math.PI), polar(-3 * Math.SQRT2, (7 * Math.PI) / 4)]],
    misses: [
      ['ignored the sign of r', [[0, 3], [-5, 0], [3, -3]]],
      ['cos and sin swapped', [[-3, 0], [0, 5], [3, -3]]],
    ],
  },

  // ── Hyperbola vertices ───────────────────────────────────────────────────
  {
    kind: 'points', lo: HYPERBOLA, t: 'horizontal-standard-form', d: 1, sub: 'Vertices of a horizontal hyperbola',
    q: 'Plot the two vertices of the hyperbola (x + 2)²/9 − (y − 1)²/16 = 1 on the coordinate grid.',
    a: '(−5, 1) and (1, 1)',
    s: 'The center is (h, k) = (−2, 1), since x + 2 = x − (−2). The x-term is positive, so the transverse axis is horizontal. a² = 9, so a = 3. The vertices are (h ± a, k) = (−2 ± 3, 1): (−5, 1) and (1, 1). Plot these two points.',
    h: ['Read the center from the shifts, minding the signs.', 'The positive squared term tells you the direction the hyperbola opens; a comes from the denominator under it.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-5, 1], [1, 1]],
    calc: ['center (−2, 1), a = √9, horizontal: (h ± a, k)', () => {
      const [h, k, a] = [-2, 1, Math.sqrt(9)];
      return [[h - a, k], [h + a, k]];
    }],
    misses: [
      ['used b = 4 instead of a = 3', [[-6, 1], [2, 1]]],
      ['center signs flipped: (2, −1)', [[-1, -1], [5, -1]]],
      ['vertices placed vertically', [[-2, -2], [-2, 4]]],
    ],
  },
  {
    kind: 'points', lo: HYPERBOLA, t: 'vertical-general-form', d: 3, sub: 'Vertices from the general form',
    q: 'Plot the two vertices of the hyperbola 4y² − x² − 6x − 16y − 9 = 0 on the coordinate grid.',
    a: '(−3, 0) and (−3, 4)',
    s: 'Complete the squares: 4(y² − 4y) − (x² + 6x) = 9, so 4(y − 2)² − 16 − [(x + 3)² − 9] = 9, which gives 4(y − 2)² − (x + 3)² = 16. Divide by 16: (y − 2)²/4 − (x + 3)²/16 = 1. Center (−3, 2); the y-term is positive, so the transverse axis is vertical, with a² = 4 and a = 2. Vertices (h, k ± a) = (−3, 0) and (−3, 4). Plot these two points.',
    h: ['Group the x-terms and the y-terms and complete the square in each (factor out the 4 first).', 'After dividing to get 1 on the right, the positive term decides whether the vertices are above and below or left and right of the center.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-3, 0], [-3, 4]],
    calc: ['complete the square from Ax² + Cy² + Dx + Ey + F = 0', () => {
      const [A, C, D, E, F] = [-1, 4, -6, -16, -9];
      const h = -D / (2 * A);
      const k = -E / (2 * C);
      const rhs = -F + A * h * h + C * k * k;
      const a = Math.sqrt(rhs / C);
      return [[h, k - a], [h, k + a]];
    }],
    misses: [
      ['used b = 4 instead of a = 2', [[-3, -2], [-3, 6]]],
      ['center signs flipped: (3, −2)', [[3, -4], [3, 0]]],
      ['a² taken as 16 before dividing (a = 4 sideways)', [[1, 2], [-7, 2]]],
    ],
  },

  // ── Ellipse centre ───────────────────────────────────────────────────────
  {
    kind: 'points', lo: ELLIPSE, t: 'center-from-standard-form', d: 1, sub: 'Center from standard form',
    q: 'Plot the center of the ellipse (x + 4)²/9 + (y − 3)²/25 = 1 on the coordinate grid.',
    a: '(−4, 3)',
    s: 'In standard form (x − h)²/a² + (y − k)²/b² = 1 the center is (h, k). x + 4 = x − (−4), so h = −4; y − 3 gives k = 3. The center is (−4, 3). Plot this point.',
    h: ['Write each squared term in the form (x − h) and (y − k).', 'The numbers in the parentheses appear with the opposite sign in the center.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-4, 3]],
    calc: ['(x − h): h = −4; (y − k): k = 3', () => {
      const xShift = 4; // (x + 4)
      const yShift = -3; // (y − 3)
      return [[-xShift, -yShift]];
    }],
    misses: [
      ['signs taken as written: (4, −3)', [[4, -3]]],
      ['used the semi-axes √9 and √25 as the center', [[3, 5]]],
    ],
  },
  {
    kind: 'points', lo: ELLIPSE, t: 'center-from-general-form', d: 3, sub: 'Center by completing the square',
    q: 'Plot the center of the ellipse 9x² + 4y² − 18x + 16y − 11 = 0 on the coordinate grid.',
    a: '(1, −2)',
    s: 'Group and factor: 9(x² − 2x) + 4(y² + 4y) = 11. Complete the squares: 9(x − 1)² − 9 + 4(y + 2)² − 16 = 11, so 9(x − 1)² + 4(y + 2)² = 36, i.e. (x − 1)²/4 + (y + 2)²/9 = 1. The center is (1, −2). Plot this point.',
    h: ['Group the x-terms and the y-terms, and factor out each leading coefficient before completing the square.', 'Read h and k from (x − h) and (y − k), minding the signs.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[1, -2]],
    calc: ['h = −D/(2A), k = −E/(2C) from Ax² + Cy² + Dx + Ey + F = 0', () => {
      const [A, C, D, E] = [9, 4, -18, 16];
      return [[-D / (2 * A), -E / (2 * C)]];
    }],
    misses: [
      ['signs flipped: (−1, 2)', [[-1, 2]]],
      ['forgot to halve: h = 18/9 = 2 and k = −16/4 = −4', [[2, -4]]],
    ],
  },

  // ── Nonlinear systems: intersection points ───────────────────────────────
  {
    kind: 'points', lo: SYSTEMS, t: 'parabola-and-line', d: 2, sub: 'A line crossing a parabola',
    q: 'The parabola y = x² − 4 and the line y = x + 2 intersect. Find every intersection point and plot them all on the coordinate grid.',
    a: '(−2, 0) and (3, 5)',
    s: 'Set the expressions equal: x² − 4 = x + 2, so x² − x − 6 = 0, which factors as (x − 3)(x + 2) = 0. So x = 3 or x = −2. Use the line to get y: x = 3 gives y = 5; x = −2 gives y = 0. The curves meet at (−2, 0) and (3, 5). Plot these two points.',
    h: ['Substitute so that you get one equation in x alone.', 'Each x-solution gives one intersection point; find its y from either equation.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, 0], [3, 5]],
    calc: ['roots of x² − 4 = x + 2, y from the line', () => quadRoots(1, -1, -6).map((x) => [x, x + 2] as Pt)],
    misses: [
      ['roots with the wrong signs: x = 2, x = −3', [[2, 4], [-3, -1]]],
      ['plotted only the x-intercepts of the roots', [[-2, 0], [3, 0]]],
    ],
  },
  {
    kind: 'points', lo: SYSTEMS, t: 'circle-and-hyperbola-four-points', d: 3, sub: 'Circle and hyperbola: four intersection points',
    q: 'Find every real solution of the system x² + y² = 10 and xy = 3, and plot each solution as a point on the coordinate grid.',
    a: '(1, 3), (3, 1), (−1, −3), (−3, −1)',
    s: 'From xy = 3, y = 3/x (x ≠ 0). Substitute: x² + 9/x² = 10. Multiply by x²: x⁴ − 10x² + 9 = 0, so (x² − 1)(x² − 9) = 0 and x = ±1 or x = ±3. Then y = 3/x: x = 1 → y = 3; x = −1 → y = −3; x = 3 → y = 1; x = −3 → y = −1. The circle and the hyperbola meet at four points: (1, 3), (3, 1), (−1, −3), (−3, −1). Plot all four.',
    h: ['Solve the simpler equation for y and substitute into the other one.', 'The result is a quadratic in x²; each value of x² gives two values of x.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[1, 3], [3, 1], [-1, -3], [-3, -1]],
    calc: ['u = x² from u² − 10u + 9 = 0, x = ±√u, y = 3/x', () => {
      const out: Pt[] = [];
      for (const u of quadRoots(1, -10, 9)) for (const x of [Math.sqrt(u), -Math.sqrt(u)]) out.push([x, 3 / x]);
      return out;
    }],
    misses: [
      ['kept only the positive square roots', [[1, 3], [3, 1]]],
      ['paired the negative x with a positive y', [[1, 3], [3, 1], [-1, 3], [-3, 1]]],
    ],
  },
];
