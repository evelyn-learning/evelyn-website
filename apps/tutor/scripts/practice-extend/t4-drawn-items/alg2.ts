/** T4 drawn items — group alg2 (see kit.ts for the shape and the proof rules). */
import type { DrawnItem, Pt } from './kit';
import { T, quadRoots, solve2 } from './kit';

const LO_COMPOUND = 'gen-aaee386b-351d-405b-a040-769c7eeec0ac.lo-3';
const LO_ABS_INEQ = 'gen-aaee386b-351d-405b-a040-769c7eeec0ac.lo-4';
const LO_VERTEX_AXIS = 'gen-cf736403-4ea0-4840-b62a-ae1c3e510c78.lo-6';
const LO_INTERCEPTS = 'gen-cf736403-4ea0-4840-b62a-ae1c3e510c78.lo-7';
const LO_SQRT_DOMAIN = 'gen-ceed2913-7343-4e20-a623-a508a9965d5b.lo-2';
const LO_SQRT_SHIFT = 'gen-ceed2913-7343-4e20-a623-a508a9965d5b.lo-4';
const LO_FOCUS_DIRECTRIX = 'gen-bb35e95e-18e8-4ab2-9730-381a1befe991.lo-3';
const LO_FEASIBLE = 'gen-739c0ae5-de9d-428b-8319-f488ff6c76e5.lo-2';
const LO_SYSTEMS = 'gen-e1dd6556-d228-4d1f-b3b4-ec1038fc7ee0.lo-3';

/**
 * Corner points of the region { ax + by ≤ c for every [a, b, c] }: every pair of
 * boundary lines is intersected and only the intersections that satisfy all the
 * constraints are kept.
 */
function corners(cs: Array<[number, number, number]>): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      const [a1, b1, c1] = cs[i];
      const [a2, b2, c2] = cs[j];
      if (Math.abs(a1 * b2 - a2 * b1) < 1e-12) continue;
      const p = solve2(a1, b1, c1, a2, b2, c2).map((v) => Math.round(v * 1e9) / 1e9 + 0) as Pt;
      if (!cs.every(([a, b, c]) => a * p[0] + b * p[1] <= c + 1e-9)) continue;
      if (!out.some((q) => Math.abs(q[0] - p[0]) < 1e-9 && Math.abs(q[1] - p[1]) < 1e-9)) out.push(p);
    }
  }
  return out;
}

export const ITEMS: DrawnItem[] = [
  // ── compound inequalities and interval notation ───────────────────────────
  {
    kind: 'interval', lo: LO_COMPOUND, t: 'abs-le-to-compound-and-graph', d: 1, sub: 'Absolute value inequality as a compound inequality',
    q: 'Write |x + 2| ≤ 3 as a compound inequality, then show its solution set on the number line.',
    a: '−5 ≤ x ≤ 1; [−5, 1]',
    s: '|x + 2| ≤ 3 means x + 2 is within 3 units of zero: −3 ≤ x + 2 ≤ 3. Subtract 2 from all three parts: −5 ≤ x ≤ 1. In interval notation this is [−5, 1]. Both ends are included, so draw closed circles at −5 and 1 and shade the segment between them.',
    h: ['|u| ≤ 3 means u lies between −3 and 3, ends included.', 'Do the same operation to all three parts of the compound inequality.'],
    line: { min: -7, max: 3, step: 1 }, key: { from: -5, to: 1, fromOpen: false, toOpen: false },
    holds: ['|x + 2| ≤ 3, evaluated directly', (x) => Math.abs(x + 2) <= 3],
    misses: [
      ['shifted the wrong way: −1 ≤ x ≤ 5', { from: -1, to: 5, fromOpen: false, toOpen: false }],
      ['open circles although ≤ includes the ends', { from: -5, to: 1, fromOpen: true, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: LO_COMPOUND, t: 'solve-three-part-compound', d: 2, sub: 'Solving a three-part compound inequality',
    q: 'Solve the compound inequality −7 < 2x − 1 ≤ 5. Show the solution set on the number line.',
    a: '−3 < x ≤ 3; (−3, 3]',
    s: 'Add 1 to all three parts: −6 < 2x ≤ 6. Divide all three parts by 2: −3 < x ≤ 3. In interval notation this is (−3, 3]. The left end is strict (<), so draw an open circle at −3; the right end allows equality (≤), so draw a closed circle at 3, and shade between them.',
    h: ['Undo the subtraction first, applying it to all three parts.', 'Each end keeps its own inequality sign: one strict, one not.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: -3, to: 3, fromOpen: true, toOpen: false },
    holds: ['−7 < 2x − 1 ≤ 5, evaluated directly', (x) => -7 < 2 * x - 1 && 2 * x - 1 <= 5],
    misses: [
      ['ends swapped open/closed: [−3, 3)', { from: -3, to: 3, fromOpen: false, toOpen: true }],
      ['subtracted 1 instead of adding: −4 < x ≤ 2', { from: -4, to: 2, fromOpen: true, toOpen: false }],
    ],
  },

  // ── absolute value inequalities (single-interval kind) ────────────────────
  {
    kind: 'interval', lo: LO_ABS_INEQ, t: 'abs-less-than-shifted', d: 1, sub: 'Solving |x − h| < r',
    q: 'Solve |x − 4| < 3 and show the solution set on the number line.',
    a: '1 < x < 7',
    s: 'Rewrite as a compound inequality: −3 < x − 4 < 3. Add 4 to all three parts: 1 < x < 7. The inequality is strict, so 1 and 7 are not solutions: draw open circles at 1 and 7 and shade the segment between them.',
    h: ['|x − 4| is the distance from x to 4.', 'A "less than" absolute value inequality becomes one compound inequality with the expression in the middle.'],
    line: { min: -1, max: 9, step: 1 }, key: { from: 1, to: 7, fromOpen: true, toOpen: true },
    holds: ['|x − 4| < 3, evaluated directly', (x) => Math.abs(x - 4) < 3],
    misses: [
      ['centred at −4 instead of 4: −7 < x < −1', { from: -7, to: -1, fromOpen: true, toOpen: true }],
      ['closed circles although the inequality is strict', { from: 1, to: 7, fromOpen: false, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: LO_ABS_INEQ, t: 'abs-linear-coefficient', d: 2, sub: 'Absolute value of a linear expression',
    q: 'Solve |3x − 6| < 9 and show the solution set on the number line.',
    a: '−1 < x < 5',
    s: 'Rewrite as −9 < 3x − 6 < 9. Add 6 to all three parts: −3 < 3x < 15. Divide all three parts by 3: −1 < x < 5. The inequality is strict, so draw open circles at −1 and 5 and shade the segment between them.',
    h: ['Write the absolute value inequality as one compound inequality first.', 'Isolate x in the middle by doing the same step to all three parts.'],
    line: { min: -6, max: 8, step: 1 }, key: { from: -1, to: 5, fromOpen: true, toOpen: true },
    holds: ['|3x − 6| < 9, evaluated directly', (x) => Math.abs(3 * x - 6) < 9],
    misses: [
      ['subtracted 6 instead of adding it: −5 < x < 1', { from: -5, to: 1, fromOpen: true, toOpen: true }],
      ['solved only the positive case: x < 5 as a ray', { from: null, to: 5, fromOpen: false, toOpen: true }],
    ],
  },
  {
    kind: 'interval', lo: LO_ABS_INEQ, t: 'isolate-abs-negative-coefficient', d: 3, sub: 'Isolating the absolute value first (sign flip)',
    q: 'Solve −2|x + 1| + 5 ≥ −3 and show the solution set on the number line.',
    a: '−5 ≤ x ≤ 3',
    s: 'Isolate the absolute value. Subtract 5: −2|x + 1| ≥ −8. Divide by −2 and reverse the sign: |x + 1| ≤ 4. Rewrite as −4 ≤ x + 1 ≤ 4 and subtract 1 from all three parts: −5 ≤ x ≤ 3. Both ends are included, so draw closed circles at −5 and 3 and shade the segment between them.',
    h: ['Get the absolute value by itself before splitting into cases.', 'Dividing both sides by a negative number reverses the inequality.'],
    line: { min: -7, max: 5, step: 1 }, key: { from: -5, to: 3, fromOpen: false, toOpen: false },
    holds: ['−2|x + 1| + 5 ≥ −3, evaluated directly', (x) => -2 * Math.abs(x + 1) + 5 >= -3],
    misses: [
      ['kept only the case x + 1 ≤ 4: x ≤ 3 as a ray', { from: null, to: 3, fromOpen: false, toOpen: false }],
      ['shifted the wrong way: −3 ≤ x ≤ 5', { from: -3, to: 5, fromOpen: false, toOpen: false }],
      ['open circles although ≥ / ≤ include the ends', { from: -5, to: 3, fromOpen: true, toOpen: true }],
    ],
  },

  // ── vertex and axis of symmetry ───────────────────────────────────────────
  {
    kind: 'line', lo: LO_VERTEX_AXIS, t: 'graph-axis-from-standard-form', d: 2, sub: 'Axis of symmetry from standard form',
    q: 'Find the axis of symmetry of the parabola y = 3x² + 12x + 5. Graph the axis on the coordinate grid by placing two points on it.',
    a: 'x = −2',
    s: 'In standard form a = 3 and b = 12. The axis of symmetry is x = −b/(2a) = −12/6 = −2. It is the vertical line x = −2: place any two points with x-coordinate −2, for example (−2, 0) and (−2, 3).',
    h: ['For y = ax² + bx + c, the axis of symmetry is x = −b/(2a).', 'The axis of symmetry of an up/down parabola is a vertical line.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, 0], [-2, 3]],
    on: ['x − (−b/(2a)) with a = 3, b = 12', (x) => x - -12 / (2 * 3)],
    misses: [
      ['dropped the minus sign: x = 2', [[2, 0], [2, 3]]],
      ['drew a horizontal line y = −2', [[0, -2], [3, -2]]],
    ],
  },
  {
    kind: 'points', lo: LO_VERTEX_AXIS, t: 'vertex-and-mirror-of-y-intercept', d: 3, sub: 'Vertex and symmetry from standard form',
    q: 'For the parabola y = −2x² + 8x − 3, plot two points on the coordinate grid: the vertex, and the point of the parabola that is the mirror image of its y-intercept across the axis of symmetry.',
    a: 'Vertex (2, 5); mirror point (4, −3)',
    s: 'Here a = −2 and b = 8, so the axis is x = −b/(2a) = −8/(−4) = 2. The vertex y-value is y = −2(2)² + 8(2) − 3 = −8 + 16 − 3 = 5, so the vertex is (2, 5). The y-intercept is (0, −3), which is 2 units left of the axis; its mirror image is 2 units right of the axis at the same height: (4, −3). Plot (2, 5) and (4, −3).',
    h: ['Find the axis x = −b/(2a) first, then substitute to get the vertex.', 'The y-intercept is c; its mirror point is just as far from the axis on the other side.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, 5], [4, -3]],
    calc: ['axis h = −b/(2a); vertex (h, f(h)); mirror of (0, f(0)) across x = h', () => {
      const f = (x: number) => -2 * x ** 2 + 8 * x - 3;
      const h = -8 / (2 * -2);
      return [[h, f(h)], T.reflectXeq([0, f(0)], h)];
    }],
    misses: [
      ['plotted the y-intercept itself instead of its mirror image', [[2, 5], [0, -3]]],
      ['took c as the vertex height: (2, −3)', [[2, -3], [4, -3]]],
    ],
  },

  // ── intercepts from any form ──────────────────────────────────────────────
  {
    kind: 'points', lo: LO_INTERCEPTS, t: 'intercepts-from-factored-form', d: 1, sub: 'Intercepts from factored form',
    q: 'Plot all three intercepts of the parabola y = (x − 1)(x + 5) on the coordinate grid: its two x-intercepts and its y-intercept.',
    a: '(1, 0), (−5, 0) and (0, −5)',
    s: 'x-intercepts: set y = 0, so x − 1 = 0 or x + 5 = 0, giving x = 1 and x = −5: the points (1, 0) and (−5, 0). y-intercept: set x = 0: y = (0 − 1)(0 + 5) = −5, the point (0, −5). Plot these three points.',
    h: ['A product is zero when one of its factors is zero.', 'For the y-intercept, substitute x = 0.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[1, 0], [-5, 0], [0, -5]],
    calc: ['roots of x² + 4x − 5 with f evaluated there, and (0, f(0))', () => {
      const f = (x: number) => (x - 1) * (x + 5);
      return [...quadRoots(1, 4, -5).map((r): Pt => [r, f(r) + 0]), [0, f(0)]];
    }],
    misses: [
      ['root signs flipped: (−1, 0), (5, 0)', [[-1, 0], [5, 0], [0, -5]]],
      ['y-intercept sign wrong: (0, 5)', [[1, 0], [-5, 0], [0, 5]]],
    ],
  },
  {
    kind: 'points', lo: LO_INTERCEPTS, t: 'intercepts-from-vertex-form', d: 2, sub: 'Intercepts from vertex form',
    q: 'Plot all three intercepts of the parabola y = −(x − 2)² + 9 on the coordinate grid: its two x-intercepts and its y-intercept.',
    a: '(−1, 0), (5, 0) and (0, 5)',
    s: 'x-intercepts: set y = 0: (x − 2)² = 9, so x − 2 = ±3, giving x = 5 or x = −1: the points (5, 0) and (−1, 0). y-intercept: set x = 0: y = −(0 − 2)² + 9 = −4 + 9 = 5, the point (0, 5). Plot these three points.',
    h: ['Set y = 0, isolate the squared term, then take square roots (both signs).', 'For the y-intercept, substitute x = 0 and keep the minus sign in front of the square.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, 0], [5, 0], [0, 5]],
    calc: ['roots of −x² + 4x + 5 (the expanded form) with f evaluated there, and (0, f(0))', () => {
      const f = (x: number) => -((x - 2) ** 2) + 9;
      return [...quadRoots(-1, 4, 5).map((r): Pt => [r, f(r) + 0]), [0, f(0)]];
    }],
    misses: [
      ['used x + 2 instead of x − 2: roots −5 and 1', [[-5, 0], [1, 0], [0, 5]]],
      ['took ±3 as the x-intercepts, forgetting to add 2', [[-3, 0], [3, 0], [0, 5]]],
    ],
  },

  // ── domain of square root functions ───────────────────────────────────────
  {
    kind: 'interval', lo: LO_SQRT_DOMAIN, t: 'domain-shifted-radical', d: 1, sub: 'Domain from the radicand',
    q: 'Find the domain of f(x) = √(x + 2) − 4 and show it on the number line.',
    a: 'x ≥ −2; [−2, ∞)',
    s: 'The radicand must be nonnegative: x + 2 ≥ 0, so x ≥ −2. The − 4 outside the root does not affect the domain. x = −2 gives √0 = 0, which is allowed, so draw a closed circle at −2 and a ray to the right.',
    h: ['Only the expression under the root sign restricts the domain.', 'The square root of 0 is defined.'],
    line: { min: -5, max: 5, step: 1 }, key: { from: -2, to: null, fromOpen: false, toOpen: false },
    holds: ['f(x) is a real number: √(x + 2) is finite', (x) => Number.isFinite(Math.sqrt(x + 2) - 4)],
    misses: [
      ['radicand sign misread: x ≥ 2', { from: 2, to: null, fromOpen: false, toOpen: false }],
      ['excluded −2 (open circle)', { from: -2, to: null, fromOpen: true, toOpen: false }],
    ],
  },
  {
    kind: 'interval', lo: LO_SQRT_DOMAIN, t: 'domain-negative-x-coefficient', d: 2, sub: 'Domain when x has a negative coefficient',
    q: 'Find the domain of g(x) = √(6 − 2x) and show it on the number line.',
    a: 'x ≤ 3; (−∞, 3]',
    s: 'The radicand must be nonnegative: 6 − 2x ≥ 0. Subtract 6: −2x ≥ −6. Divide by −2 and reverse the sign: x ≤ 3. At x = 3 the radicand is 0, which is allowed, so draw a closed circle at 3 and a ray to the left.',
    h: ['Set the radicand greater than or equal to zero.', 'Watch the direction of the inequality when you divide by a negative number.'],
    line: { min: -4, max: 6, step: 1 }, key: { from: null, to: 3, fromOpen: false, toOpen: false },
    holds: ['g(x) is a real number: √(6 − 2x) is finite', (x) => Number.isFinite(Math.sqrt(6 - 2 * x))],
    misses: [
      ['sign not reversed: x ≥ 3', { from: 3, to: null, fromOpen: false, toOpen: false }],
      ['solved 6 − 2x ≥ 0 as x ≤ −3', { from: null, to: -3, fromOpen: false, toOpen: false }],
    ],
  },

  // ── translations of square root functions ─────────────────────────────────
  {
    kind: 'points', lo: LO_SQRT_SHIFT, t: 'translate-three-key-points', d: 1, sub: 'Translating key points of y = √x',
    q: 'The graph of y = √x passes through (0, 0), (1, 1) and (4, 2). It is shifted 3 units left and 2 units down to give the graph of g. Plot the images of these three points on the coordinate grid.',
    a: '(−3, −2), (−2, −1), (1, 0)',
    s: 'A shift 3 units left and 2 units down maps (x, y) to (x − 3, y − 2): (0, 0) → (−3, −2), (1, 1) → (−2, −1), (4, 2) → (1, 0). These lie on g(x) = √(x + 3) − 2. Plot the three points.',
    h: ['Left and right change only the x-coordinate; up and down change only the y-coordinate.', 'Left means subtract from x; down means subtract from y.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-3, -2], [-2, -1], [1, 0]],
    calc: ['(x, y) → (x − 3, y − 2) applied to (0, 0), (1, 1), (4, 2)', () => ([[0, 0], [1, 1], [4, 2]] as Pt[]).map((p) => T.translate(p, -3, -2))],
    misses: [
      ['shifted right instead of left', [[3, -2], [4, -1], [7, 0]]],
      ['shifted up instead of down', [[-3, 2], [-2, 3], [1, 4]]],
    ],
  },
  {
    kind: 'points', lo: LO_SQRT_SHIFT, t: 'plot-endpoint-and-points-of-g', d: 2, sub: 'Reading the shift from the equation',
    q: 'Let g(x) = √(x + 4) − 3. Plot three points of its graph on the coordinate grid: the endpoint of the graph, and the points with x = −3 and x = 5.',
    a: '(−4, −3), (−3, −2), (5, 0)',
    s: 'g is y = √x shifted 4 units left and 3 units down, so the endpoint (0, 0) moves to (−4, −3). Check the other two: g(−3) = √1 − 3 = −2 and g(5) = √9 − 3 = 0. Plot (−4, −3), (−3, −2) and (5, 0).',
    h: ['The + 4 inside the root moves the graph horizontally; the − 3 outside moves it vertically.', 'Substitute each x-value into g, taking the square root before subtracting.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-4, -3], [-3, -2], [5, 0]],
    calc: ['endpoint where x + 4 = 0, then (x, g(x)) at x = −3 and 5', () => {
      const g = (x: number) => Math.sqrt(x + 4) - 3;
      return [-4, -3, 5].map((x): Pt => [x, g(x)]);
    }],
    misses: [
      ['moved right 4 instead of left: endpoint (4, −3)', [[4, -3], [-3, -2], [5, 0]]],
      ['used x − 4 instead of x + 4 for g(5): (5, −2)', [[-4, -3], [-3, -2], [5, -2]]],
    ],
  },

  // ── vertex from focus and directrix ───────────────────────────────────────
  {
    kind: 'points', lo: LO_FOCUS_DIRECTRIX, t: 'vertex-horizontal-directrix', d: 1, sub: 'Vertical parabola: average the y-values',
    q: 'A parabola has focus (−1, 5) and directrix y = 1. Plot its vertex on the coordinate grid (one point).',
    a: '(−1, 3)',
    s: 'The directrix is horizontal, so the parabola opens vertically and the vertex has the same x-coordinate as the focus, −1. The vertex is midway between the focus and the directrix: y = (5 + 1)/2 = 3. Plot (−1, 3).',
    h: ['The vertex lies on the line through the focus perpendicular to the directrix.', 'The vertex is the same distance from the focus as from the directrix.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, 3]],
    calc: ['(focus x, average of focus y and directrix y)', () => [[-1, (5 + 1) / 2]]],
    misses: [
      ['plotted the focus', [[-1, 5]]],
      ['plotted the point of the directrix below the focus', [[-1, 1]]],
    ],
  },
  {
    kind: 'points', lo: LO_FOCUS_DIRECTRIX, t: 'vertex-vertical-directrix', d: 2, sub: 'Horizontal parabola: average the x-values',
    q: 'A parabola has focus (3, −2) and directrix x = −5. Plot its vertex on the coordinate grid (one point).',
    a: '(−1, −2)',
    s: 'The directrix is vertical, so the parabola opens sideways and the vertex has the same y-coordinate as the focus, −2. The vertex is midway between the focus and the directrix: x = (3 + (−5))/2 = −1. Plot (−1, −2).',
    h: ['A vertical directrix means the parabola opens left or right.', 'Average the focus x-coordinate with the directrix value.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, -2]],
    calc: ['(average of focus x and directrix x, focus y)', () => [[(3 + -5) / 2, -2]]],
    misses: [
      ['plotted the focus', [[3, -2]]],
      ['subtracted instead of adding: x = (3 − (−5))/2 = 4', [[4, -2]]],
    ],
  },

  // ── corner points of a feasible region ────────────────────────────────────
  {
    kind: 'points', lo: LO_FEASIBLE, t: 'four-corners-with-upper-bound', d: 2, sub: 'Corners with a horizontal bound',
    q: 'A feasible region is defined by x + y ≤ 5, y ≤ 3, x ≥ 0 and y ≥ 0. It has four corner points. Plot all four corner points on the coordinate grid.',
    a: '(0, 0), (5, 0), (2, 3), (0, 3)',
    s: 'Intersect the boundary lines in pairs. x = 0 and y = 0: (0, 0). x + y = 5 and y = 0: (5, 0). x + y = 5 and y = 3: x = 2, so (2, 3). y = 3 and x = 0: (0, 3). The intersection of x + y = 5 with x = 0 is (0, 5), but y = 5 breaks y ≤ 3, so it is not a corner. Plot the four corners.',
    h: ['Each corner is where two boundary lines meet.', 'Check every intersection against all four inequalities before keeping it.'],
    grid: { xRange: [-2, 8], yRange: [-2, 8] }, key: [[0, 0], [5, 0], [2, 3], [0, 3]],
    calc: ['pairwise intersections of the boundary lines that satisfy every constraint', () => corners([[1, 1, 5], [0, 1, 3], [-1, 0, 0], [0, -1, 0]])],
    misses: [
      ['kept (0, 5), which breaks y ≤ 3, instead of (0, 3)', [[0, 0], [5, 0], [2, 3], [0, 5]]],
      ['solved x + y = 5 with y = 3 as x = 8', [[0, 0], [5, 0], [8, 3], [0, 3]]],
    ],
  },
  {
    kind: 'points', lo: LO_FEASIBLE, t: 'four-corners-two-slanted-lines', d: 3, sub: 'Corner from two slanted boundaries',
    q: 'A feasible region is defined by x + 2y ≤ 10, 3x + y ≤ 15, x ≥ 0 and y ≥ 0. It has four corner points. Plot all four corner points on the coordinate grid.',
    a: '(0, 0), (5, 0), (4, 3), (0, 5)',
    s: 'Axis corners: (0, 0). On y = 0, 3x ≤ 15 gives x ≤ 5 and x ≤ 10 from the other line, so (5, 0). On x = 0, 2y ≤ 10 gives y ≤ 5 and y ≤ 15, so (0, 5). The slanted lines meet where x + 2y = 10 and 3x + y = 15: from the second, y = 15 − 3x; then x + 30 − 6x = 10, so x = 4 and y = 3: (4, 3). (10, 0) and (0, 15) break the other constraint, so they are not corners. Plot the four corners.',
    h: ['On each axis, the tighter of the two slanted constraints decides the corner.', 'Solve the two slanted boundary equations together to find the corner they share.'],
    grid: { xRange: [-2, 8], yRange: [-2, 8] }, key: [[0, 0], [5, 0], [4, 3], [0, 5]],
    calc: ['pairwise intersections of the boundary lines that satisfy every constraint', () => corners([[1, 2, 10], [3, 1, 15], [-1, 0, 0], [0, -1, 0]])],
    misses: [
      ['slanted-line intersection solved as (3, 4)', [[0, 0], [5, 0], [3, 4], [0, 5]]],
      ['forgot the corner where the two slanted lines meet', [[0, 0], [5, 0], [0, 5]]],
    ],
  },

  // ── solving linear systems ────────────────────────────────────────────────
  {
    kind: 'points', lo: LO_SYSTEMS, t: 'substitution-plot-solution', d: 1, sub: 'Substitution',
    q: 'Solve the system y = 2x + 1 and x + y = −5. Plot the solution on the coordinate grid (one point).',
    a: '(−2, −3)',
    s: 'Substitute y = 2x + 1 into x + y = −5: x + 2x + 1 = −5, so 3x = −6 and x = −2. Then y = 2(−2) + 1 = −3. Check: −2 + (−3) = −5. Plot (−2, −3).',
    h: ['The first equation already gives y in terms of x.', 'After finding x, substitute it back to get y, and check both equations.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, -3]],
    calc: ['solve −2x + y = 1, x + y = −5 by Cramer\'s rule', () => [solve2(-2, 1, 1, 1, 1, -5)]],
    misses: [
      ['stopped after x and plotted (−2, 0)', [[-2, 0]]],
      ['sign slip in y = 2x + 1: y = −5', [[-2, -5]]],
    ],
  },
  {
    kind: 'points', lo: LO_SYSTEMS, t: 'elimination-plot-solution', d: 3, sub: 'Elimination with two multipliers',
    q: 'Solve the system 2x + 3y = 1 and 3x − 2y = 8 by elimination. Plot the solution on the coordinate grid (one point).',
    a: '(2, −1)',
    s: 'Eliminate y: multiply the first equation by 2 and the second by 3: 4x + 6y = 2 and 9x − 6y = 24. Add them: 13x = 26, so x = 2. Substitute into 2x + 3y = 1: 4 + 3y = 1, so y = −1. Check: 3(2) − 2(−1) = 8. Plot (2, −1).',
    h: ['Choose multipliers so the y-terms become opposites.', 'After finding one variable, substitute it into either original equation.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, -1]],
    calc: ['solve 2x + 3y = 1, 3x − 2y = 8 by Cramer\'s rule', () => [solve2(2, 3, 1, 3, -2, 8)]],
    misses: [
      ['x and y swapped', [[-1, 2]]],
      ['sign error for y: 4 + 3y = 1 solved as y = 1', [[2, 1]]],
    ],
  },
];
