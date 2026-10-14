/** T4 drawn items — group alg1 (see kit.ts for the shape and the proof rules). */
import type { DrawnItem, Pt } from './kit';
import { solve2 } from './kit';

export const ITEMS: DrawnItem[] = [
  // ── alg1.one-variable-inequalities ─────────────────────────────────────────
  {
    kind: 'interval', lo: 'alg1.one-variable-inequalities', t: 'ray-two-step-inclusive', d: 1, sub: 'Two-step inequality with ≥',
    q: 'Solve 2x + 5 ≥ 11 and show the solution set on the number line.',
    a: 'x ≥ 3',
    s: 'Subtract 5 from both sides: 2x ≥ 6. Divide both sides by 2 (a positive number, so the sign stays): x ≥ 3. The symbol ≥ includes 3 itself, so draw a closed circle at 3 and a ray to the right.',
    h: ['Undo the addition first, then the multiplication, just as with an equation.', 'Decide whether the boundary number is itself a solution: ≥ includes it.'],
    line: { min: -2, max: 8, step: 1 }, key: { from: 3, to: null, fromOpen: false, toOpen: false },
    holds: ['2x + 5 ≥ 11, evaluated directly', (x) => 2 * x + 5 >= 11],
    misses: [['open circle at 3', { from: 3, to: null, fromOpen: true, toOpen: false }], ['shaded the wrong way', { from: null, to: 3, fromOpen: false, toOpen: false }]],
  },
  {
    kind: 'interval', lo: 'alg1.one-variable-inequalities', t: 'ray-negative-coefficient-strict', d: 2, sub: 'Sign flip with a negative x-coefficient',
    q: 'Solve 9 − 4x < 21 and show the solution set on the number line.',
    a: 'x > −3',
    s: 'Subtract 9 from both sides: −4x < 12. Divide both sides by −4 and reverse the inequality sign: x > −3. The symbol > does not include −3, so draw an open circle at −3 and a ray to the right.',
    h: ['Move the constant 9 to the other side first.', 'Dividing by a negative number changes the direction of the inequality.'],
    line: { min: -6, max: 4, step: 1 }, key: { from: -3, to: null, fromOpen: true, toOpen: false },
    holds: ['9 − 4x < 21, evaluated directly', (x) => 9 - 4 * x < 21],
    misses: [['sign not reversed: x < −3', { from: null, to: -3, fromOpen: false, toOpen: true }], ['closed circle at −3', { from: -3, to: null, fromOpen: false, toOpen: false }]],
  },
  {
    kind: 'interval', lo: 'alg1.one-variable-inequalities', t: 'ray-distribute-variables-both-sides', d: 3, sub: 'Distributing, variables on both sides, and the flip',
    q: 'Solve 5(x − 2) ≥ 7x + 4 and show the solution set on the number line.',
    a: 'x ≤ −7',
    s: 'Distribute: 5x − 10 ≥ 7x + 4. Subtract 7x from both sides: −2x − 10 ≥ 4. Add 10: −2x ≥ 14. Divide by −2 and reverse the sign: x ≤ −7. The symbol ≤ includes −7, so draw a closed circle at −7 and a ray to the left.',
    h: ['Distribute the 5 to both terms inside the parentheses.', 'Collect the x-terms on one side; if you end up dividing by a negative, reverse the sign.'],
    line: { min: -10, max: 2, step: 1 }, key: { from: null, to: -7, fromOpen: false, toOpen: false },
    holds: ['5(x − 2) ≥ 7x + 4, evaluated directly', (x) => 5 * (x - 2) >= 7 * x + 4],
    misses: [['sign not reversed: x ≥ −7', { from: -7, to: null, fromOpen: false, toOpen: false }], ['5 not distributed to the 2: 5x − 2 ≥ 7x + 4 gives x ≤ −3', { from: null, to: -3, fromOpen: false, toOpen: false }]],
  },

  // ── alg1.compound-inequalities ─────────────────────────────────────────────
  {
    kind: 'interval', lo: 'alg1.compound-inequalities', t: 'and-two-pieces-intersection', d: 1, sub: 'AND as an intersection',
    q: 'Solve x + 1 > −3 AND 2x ≤ 4, and show the solution set on the number line.',
    a: '−4 < x ≤ 2',
    s: 'Solve each piece: x + 1 > −3 gives x > −4, and 2x ≤ 4 gives x ≤ 2. AND keeps only the values that satisfy both, so the solution is −4 < x ≤ 2. Draw an open circle at −4, a closed circle at 2, and shade the segment between them.',
    h: ['Solve each inequality on its own first.', 'AND keeps only the overlap of the two pieces; check which ends are included.'],
    line: { min: -6, max: 4, step: 1 }, key: { from: -4, to: 2, fromOpen: true, toOpen: false },
    holds: ['x + 1 > −3 and 2x ≤ 4, both evaluated', (x) => x + 1 > -3 && 2 * x <= 4],
    misses: [['circles swapped: −4 ≤ x < 2', { from: -4, to: 2, fromOpen: false, toOpen: true }], ['forgot to divide by 2: −4 < x ≤ 4', { from: -4, to: 4, fromOpen: true, toOpen: false }]],
  },
  {
    kind: 'interval', lo: 'alg1.compound-inequalities', t: 'or-union-collapses-to-ray', d: 2, sub: 'OR as a union of overlapping rays',
    q: 'Solve 3x − 2 ≤ 7 OR x − 6 < −1, and show the solution set on the number line.',
    a: 'x < 5',
    s: 'Solve each piece: 3x − 2 ≤ 7 gives 3x ≤ 9, so x ≤ 3; x − 6 < −1 gives x < 5. OR keeps every value that satisfies either piece. Every number with x ≤ 3 already has x < 5, so the union is simply x < 5. Draw an open circle at 5 and a ray to the left.',
    h: ['Solve each piece separately, then think about what OR keeps.', 'Sketch both rays: does one of them already contain the other?'],
    line: { min: -3, max: 8, step: 1 }, key: { from: null, to: 5, fromOpen: false, toOpen: true },
    holds: ['3x − 2 ≤ 7 or x − 6 < −1, evaluated directly', (x) => 3 * x - 2 <= 7 || x - 6 < -1],
    misses: [['treated OR as AND: x ≤ 3', { from: null, to: 3, fromOpen: false, toOpen: false }], ['closed circle at 5', { from: null, to: 5, fromOpen: false, toOpen: false }]],
  },
  {
    kind: 'interval', lo: 'alg1.compound-inequalities', t: 'three-part-divide-by-negative', d: 3, sub: 'Three-part inequality with a negative divisor',
    q: 'Solve 3 ≤ 5 − 2x < 11 and show the solution set on the number line.',
    a: '−3 < x ≤ 1',
    s: 'Subtract 5 from all three parts: −2 ≤ −2x < 6. Divide all three parts by −2 and reverse both signs: 1 ≥ x > −3. Rewritten smallest to largest: −3 < x ≤ 1. Draw an open circle at −3, a closed circle at 1, and shade between them.',
    h: ['Whatever you do to the middle, do to the left and right parts too.', 'Dividing by a negative reverses both signs; then rewrite the statement from smallest to largest.'],
    line: { min: -6, max: 4, step: 1 }, key: { from: -3, to: 1, fromOpen: true, toOpen: false },
    holds: ['3 ≤ 5 − 2x < 11, both parts evaluated', (x) => 3 <= 5 - 2 * x && 5 - 2 * x < 11],
    misses: [['circles not carried through the flip: −3 ≤ x < 1', { from: -3, to: 1, fromOpen: false, toOpen: true }], ['divided by 2 instead of −2: −1 ≤ x < 3', { from: -1, to: 3, fromOpen: false, toOpen: true }]],
  },

  // ── alg1.absolute-value ────────────────────────────────────────────────────
  {
    kind: 'interval', lo: 'alg1.absolute-value', t: 'less-than-band-with-coefficient', d: 2, sub: 'Absolute value less than: a band',
    q: 'Solve |2x − 3| < 7 and show the solution set on the number line.',
    a: '−2 < x < 5',
    s: 'Less than means "within 7 units of 0", so write the AND form: −7 < 2x − 3 < 7. Add 3 to all three parts: −4 < 2x < 10. Divide by 2: −2 < x < 5. Both symbols are strict, so draw open circles at −2 and 5 and shade between them.',
    h: ['An absolute value less than a number becomes a three-part (AND) inequality.', 'Solve all three parts at once; strict symbols give open circles.'],
    line: { min: -5, max: 7, step: 1 }, key: { from: -2, to: 5, fromOpen: true, toOpen: true },
    holds: ['|2x − 3| < 7, evaluated directly', (x) => Math.abs(2 * x - 3) < 7],
    misses: [['closed circles: −2 ≤ x ≤ 5', { from: -2, to: 5, fromOpen: false, toOpen: false }], ['dropped the negative case: x < 5', { from: null, to: 5, fromOpen: false, toOpen: true }]],
  },
  {
    kind: 'interval', lo: 'alg1.absolute-value', t: 'isolate-then-band-inclusive', d: 3, sub: 'Isolate the absolute value, then split',
    q: 'Solve 2|x − 1| + 3 ≤ 11 and show the solution set on the number line.',
    a: '−3 ≤ x ≤ 5',
    s: 'Isolate the absolute value first: subtract 3 to get 2|x − 1| ≤ 8, then divide by 2 to get |x − 1| ≤ 4. Now write the AND form: −4 ≤ x − 1 ≤ 4. Add 1 to all three parts: −3 ≤ x ≤ 5. Both symbols are ≤, so draw closed circles at −3 and 5 and shade between them.',
    h: ['Get the absolute value alone on one side before you split into cases.', 'Read |x − 1| ≤ 4 as "x is within 4 units of 1".'],
    line: { min: -7, max: 7, step: 1 }, key: { from: -3, to: 5, fromOpen: false, toOpen: false },
    holds: ['2|x − 1| + 3 ≤ 11, evaluated directly', (x) => 2 * Math.abs(x - 1) + 3 <= 11],
    misses: [['split before isolating: −11 ≤ 2(x − 1) + 3 ≤ 11 gives −6 ≤ x ≤ 5', { from: -6, to: 5, fromOpen: false, toOpen: false }], ['open circles: −3 < x < 5', { from: -3, to: 5, fromOpen: true, toOpen: true }]],
  },

  // ── alg1.slope-intercept-form ──────────────────────────────────────────────
  {
    kind: 'line', lo: 'alg1.slope-intercept-form', t: 'graph-negative-integer-slope', d: 1, sub: 'Graphing y = mx + b with a negative slope',
    q: 'Graph the line y = −3x + 1 on the coordinate grid by placing two points on it.',
    a: 'y = −3x + 1',
    s: 'The y-intercept is 1, so (0, 1) is on the line. The slope is −3 = −3/1: from (0, 1) go right 1 and down 3 to (1, −2). Place two points of the line, for example (0, 1) and (1, −2).',
    h: ['Start where the line crosses the y-axis: the added constant.', 'Write the slope over 1 and step right 1, then down by the rise.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, 1], [1, -2]],
    on: ['y − (−3x + 1)', (x, y) => y - (-3 * x + 1)],
    misses: [['slope and intercept swapped: y = x − 3', [[0, -3], [1, -2]]], ['slope sign lost: y = 3x + 1', [[0, 1], [1, 4]]]],
  },
  {
    kind: 'line', lo: 'alg1.slope-intercept-form', t: 'graph-negative-fraction-slope', d: 2, sub: 'Graphing with a fractional slope',
    q: 'Graph the line y = −(3/2)x + 1 on the coordinate grid by placing two points on it.',
    a: 'y = −(3/2)x + 1',
    s: 'The y-intercept is 1, so start at (0, 1). The slope −3/2 means down 3 for every 2 to the right: from (0, 1) go right 2 and down 3 to (2, −2). Place two points of the line, for example (0, 1) and (2, −2).',
    h: ['The constant term tells you where the line crosses the y-axis.', 'Read the slope as rise over run: the top number is the vertical change.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, 1], [2, -2]],
    on: ['y − (−(3/2)x + 1)', (x, y) => y - (-(3 / 2) * x + 1)],
    misses: [['rise and run inverted: y = −(2/3)x + 1', [[0, 1], [3, -1]]], ['slope sign lost: y = (3/2)x + 1', [[0, 1], [2, 4]]]],
  },
  {
    kind: 'line', lo: 'alg1.slope-intercept-form', t: 'graph-from-slope-and-point', d: 3, sub: 'Finding b from a slope and a point',
    q: 'A line has slope 2/3 and passes through the point (3, 1). Find its equation in slope-intercept form, then graph the line on the coordinate grid by placing two points on it.',
    a: 'y = (2/3)x − 1',
    s: 'Substitute the point into y = mx + b: 1 = (2/3)(3) + b, so 1 = 2 + b and b = −1. The equation is y = (2/3)x − 1. Start at (0, −1) and go right 3, up 2 to (3, 1). Place two points of the line, for example (0, −1) and (3, 1).',
    h: ['Put the slope and the point’s coordinates into y = mx + b and solve for b.', 'Check that the given point lies on the line you draw.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, -1], [3, 1]],
    on: ['point-slope: y − 1 − (2/3)(x − 3)', (x, y) => y - 1 - (2 / 3) * (x - 3)],
    misses: [['rise and run inverted: slope 3/2 through (3, 1)', [[3, 1], [1, -2]]], ['used the point’s y as b: y = (2/3)x + 1', [[0, 1], [3, 3]]]],
  },

  // ── alg1.point-slope-standard-form ─────────────────────────────────────────
  {
    kind: 'line', lo: 'alg1.point-slope-standard-form', t: 'graph-from-point-slope-form', d: 1, sub: 'Reading a point and slope from point-slope form',
    q: 'Graph the line y − 2 = −3(x + 1) on the coordinate grid by placing two points on it.',
    a: 'y − 2 = −3(x + 1), that is y = −3x − 1',
    s: 'Point-slope form y − y₁ = m(x − x₁) gives the point (−1, 2), since x + 1 = x − (−1), and the slope −3. From (−1, 2) go right 1 and down 3 to (0, −1). Place two points of the line, for example (−1, 2) and (0, −1).',
    h: ['The point is the pair of numbers that makes both parentheses zero.', 'From that point, use the slope as rise over run.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, 2], [0, -1]],
    on: ['y − 2 − (−3)(x + 1)', (x, y) => y - 2 - -3 * (x + 1)],
    misses: [['sign trap: point read as (1, 2)', [[1, 2], [2, -1]]], ['slope sign lost: slope 3 through (−1, 2)', [[-1, 2], [0, 5]]]],
  },
  {
    kind: 'line', lo: 'alg1.point-slope-standard-form', t: 'graph-standard-form-by-intercepts', d: 2, sub: 'Intercepts from standard form',
    q: 'Graph the line 3x − 4y = 12 on the coordinate grid by placing its two intercepts.',
    a: 'x-intercept (4, 0), y-intercept (0, −3)',
    s: 'Set y = 0: 3x = 12, so x = 4 and the x-intercept is (4, 0). Set x = 0: −4y = 12, so y = −3 and the y-intercept is (0, −3). Place these two points; the line through them is 3x − 4y = 12.',
    h: ['For the x-intercept, set y equal to zero and solve.', 'For the y-intercept, set x equal to zero; keep the sign of the y-coefficient.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[4, 0], [0, -3]],
    on: ['3x − 4y − 12', (x, y) => 3 * x - 4 * y - 12],
    misses: [['intercepts swapped: (−3, 0) and (0, 4)', [[-3, 0], [0, 4]]], ['y-intercept sign lost: (4, 0) and (0, 3)', [[4, 0], [0, 3]]]],
  },
  {
    kind: 'line', lo: 'alg1.point-slope-standard-form', t: 'standard-to-slope-intercept-graph', d: 3, sub: 'Converting standard form to slope-intercept form',
    q: 'Rewrite 3x + 2y = −2 in slope-intercept form, then graph the line on the coordinate grid by placing two points on it.',
    a: 'y = −(3/2)x − 1',
    s: 'Subtract 3x from both sides: 2y = −3x − 2. Divide every term by 2: y = −(3/2)x − 1. Start at the y-intercept (0, −1) and go right 2, down 3 to (2, −4). Place two points of the line, for example (0, −1) and (2, −4).',
    h: ['Move the x-term to the right side first.', 'Divide EVERY term by the coefficient of y, not just one of them.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[0, -1], [2, -4]],
    on: ['3x + 2y + 2', (x, y) => 3 * x + 2 * y + 2],
    misses: [['divided only the constant by 2: y = −3x − 1', [[0, -1], [1, -4]]], ['slope sign lost: y = (3/2)x − 1', [[0, -1], [2, 2]]]],
  },

  // ── alg1.parallel-perpendicular ────────────────────────────────────────────
  {
    kind: 'line', lo: 'alg1.parallel-perpendicular', t: 'graph-parallel-through-point', d: 2, sub: 'Parallel line through a point',
    q: 'Graph the line that passes through (1, 3) and is parallel to y = −2x + 7. Place two points of the new line on the coordinate grid.',
    a: 'y = −2x + 5',
    s: 'Parallel lines have the same slope, so the new slope is −2. Point-slope: y − 3 = −2(x − 1), so y = −2x + 2 + 3 = −2x + 5. Place two points of the line, for example (1, 3) and (2, 1).',
    h: ['Parallel lines share their slope.', 'Use the given point with that slope in point-slope form.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[1, 3], [2, 1]],
    on: ['y − 3 − (−2)(x − 1)', (x, y) => y - 3 - -2 * (x - 1)],
    misses: [['used the perpendicular slope 1/2 instead', [[1, 3], [3, 4]]], ['kept the old intercept: drew y = −2x + 7', [[1, 5], [2, 3]]]],
  },
  {
    kind: 'line', lo: 'alg1.parallel-perpendicular', t: 'graph-perpendicular-to-standard-form', d: 3, sub: 'Perpendicular to a line in standard form',
    q: 'Graph the line that passes through (2, −1) and is perpendicular to 2x − 3y = 6. Place two points of the new line on the coordinate grid.',
    a: 'y = −(3/2)x + 2',
    s: 'Solve the given line for y: −3y = −2x + 6, so y = (2/3)x − 2 and its slope is 2/3. The perpendicular slope is the opposite reciprocal, −3/2. Point-slope: y + 1 = −(3/2)(x − 2), so y = −(3/2)x + 3 − 1 = −(3/2)x + 2. Place two points, for example (2, −1) and (0, 2).',
    h: ['Solve the standard-form equation for y before reading its slope.', 'A perpendicular slope needs both a flip of the fraction and a change of sign.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, -1], [0, 2]],
    on: ['y + 1 − (−3/2)(x − 2)', (x, y) => y + 1 - (-3 / 2) * (x - 2)],
    misses: [['reciprocal only, sign not changed: slope 3/2', [[2, -1], [0, -4]]], ['read the slope as 2 from the x-coefficient: perpendicular slope −1/2', [[2, -1], [0, 0]]]],
  },

  // ── alg1.relations-functions ───────────────────────────────────────────────
  {
    kind: 'points', lo: 'alg1.relations-functions', t: 'plot-linear-function-on-domain', d: 1, sub: 'Evaluating f(x) over a finite domain',
    q: 'The function f(x) = 2x − 3 has domain {−1, 0, 1, 2, 3}. Evaluate f at each input and plot the five points (x, f(x)) on the coordinate grid.',
    a: '(−1, −5), (0, −3), (1, −1), (2, 1), (3, 3)',
    s: 'Substitute each input: f(−1) = 2(−1) − 3 = −5, f(0) = −3, f(1) = −1, f(2) = 1, f(3) = 3. Plot the points (−1, −5), (0, −3), (1, −1), (2, 1) and (3, 3).',
    h: ['Replace x with each input, in parentheses, and simplify.', 'Each point is (input, output): the input goes across, the output goes up.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-1, -5], [0, -3], [1, -1], [2, 1], [3, 3]],
    calc: ['(x, 2x − 3) for each x in the domain', () => [-1, 0, 1, 2, 3].map((x): Pt => [x, 2 * x - 3])],
    misses: [['plotted (f(x), x) instead of (x, f(x))', [[-5, -1], [-3, 0], [-1, 1], [1, 2], [3, 3]]], ['read 2x − 3 as 2(x − 3)', [[-1, -8], [0, -6], [1, -4], [2, -2], [3, 0]]]],
  },
  {
    kind: 'points', lo: 'alg1.relations-functions', t: 'plot-quadratic-function-negative-inputs', d: 3, sub: 'Evaluating with negative inputs',
    q: 'The function g(x) = x² − 2x − 3 has domain {−2, 0, 1, 3}. Evaluate g at each input and plot the four points (x, g(x)) on the coordinate grid.',
    a: '(−2, 5), (0, −3), (1, −4), (3, 0)',
    s: 'g(−2) = (−2)² − 2(−2) − 3 = 4 + 4 − 3 = 5; g(0) = −3; g(1) = 1 − 2 − 3 = −4; g(3) = 9 − 6 − 3 = 0. Plot (−2, 5), (0, −3), (1, −4) and (3, 0).',
    h: ['Put each input in parentheses before squaring, so a negative input squares to a positive number.', 'Two negatives multiplied give a positive: watch the −2x term.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, 5], [0, -3], [1, -4], [3, 0]],
    calc: ['(x, x² − 2x − 3) for each x in the domain', () => [-2, 0, 1, 3].map((x): Pt => [x, x ** 2 - 2 * x - 3])],
    misses: [['wrote −2² = −4 without parentheses: g(−2) = −4 + 4 − 3 = −3', [[-2, -3], [0, -3], [1, -4], [3, 0]]], ['−2x at x = −2 taken as −4: g(−2) = 4 − 4 − 3 = −3, and g(1) = 1 + 2 − 3 = 0', [[-2, -3], [0, -3], [1, 0], [3, 0]]], ['plotted (g(x), x) instead of (x, g(x))', [[5, -2], [-3, 0], [-4, 1], [0, 3]]]],
  },

  // ── alg1.systems-by-graphing ───────────────────────────────────────────────
  {
    kind: 'points', lo: 'alg1.systems-by-graphing', t: 'plot-intersection-slope-intercept', d: 2, sub: 'The solution is the intersection point',
    q: 'Solve the system y = −2x + 3 and y = x − 3 by graphing, and plot its solution as one point on the coordinate grid.',
    a: '(2, −1)',
    s: 'The first line starts at (0, 3) and falls 2 per step right; the second starts at (0, −3) and rises 1 per step right. They cross where −2x + 3 = x − 3, so 3x = 6, x = 2, and y = 2 − 3 = −1. Check: −2(2) + 3 = −1 and 2 − 3 = −1. Plot the point (2, −1).',
    h: ['Graph each line from its y-intercept and slope on the same axes.', 'The solution is the one point that lies on both lines; check it in both equations.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, -1]],
    calc: ['solve 2x + y = 3, −x + y = −3', () => [solve2(2, 1, 3, -1, 1, -3)]],
    misses: [['coordinates in the wrong order: (−1, 2)', [[-1, 2]]], ['plotted the y-intercept of the first line', [[0, 3]]]],
  },
  {
    kind: 'points', lo: 'alg1.systems-by-graphing', t: 'plot-intersection-standard-form', d: 3, sub: 'Systems given in standard form',
    q: 'Solve the system 2x + y = −1 and x − 2y = −8 by graphing, and plot its solution as one point on the coordinate grid.',
    a: '(−2, 3)',
    s: 'Solve each for y: y = −2x − 1 and y = (1/2)x + 4. Graph both: the first passes through (0, −1) and (−2, 3); the second through (0, 4) and (−2, 3). They cross at (−2, 3). Check: 2(−2) + 3 = −1 and −2 − 2(3) = −8. Plot the point (−2, 3).',
    h: ['Rewrite each equation as y = mx + b before graphing.', 'Read the crossing point, then substitute it into both original equations.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, 3]],
    calc: ['solve 2x + y = −1, x − 2y = −8', () => [solve2(2, 1, -1, 1, -2, -8)]],
    misses: [['coordinates in the wrong order: (3, −2)', [[3, -2]]], ['plotted the y-intercept of the second line', [[0, 4]]]],
  },

  // ── alg1.quadratic-graphs-vertex ───────────────────────────────────────────
  {
    kind: 'points', lo: 'alg1.quadratic-graphs-vertex', t: 'plot-vertex-form-vertex-and-pair', d: 2, sub: 'Vertex form and symmetric points',
    q: 'For y = (x + 2)² − 3, plot three points of the parabola on the coordinate grid: the vertex and the two points with x = −4 and x = 0.',
    a: '(−2, −3), (−4, 1), (0, 1)',
    s: 'In y = a(x − h)² + k, x + 2 = x − (−2), so h = −2 and k = −3: the vertex is (−2, −3). At x = −4: (−2)² − 3 = 1. At x = 0: 2² − 3 = 1. The points (−4, 1) and (0, 1) are mirror images across the axis x = −2. Plot (−2, −3), (−4, 1) and (0, 1).',
    h: ['h is the x-value that makes the inside of the parentheses zero.', 'Points the same distance either side of the axis of symmetry have the same y-value.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[-2, -3], [-4, 1], [0, 1]],
    calc: ['vertex (h, k) with h = −2, k = −3; y at x = −4 and 0', () => [[-2, -3] as Pt, ...[-4, 0].map((x): Pt => [x, (x + 2) ** 2 - 3])]],
    misses: [['sign-of-h trap: vertex at (2, −3)', [[2, -3], [-4, 1], [0, 1]]], ['k sign flipped: vertex at (−2, 3)', [[-2, 3], [-4, 1], [0, 1]]]],
  },
  {
    kind: 'points', lo: 'alg1.quadratic-graphs-vertex', t: 'plot-standard-form-vertex-intercept-mirror', d: 3, sub: 'Vertex from −b/(2a) and the mirror point',
    q: 'For y = −x² + 4x + 1, plot three points on the coordinate grid: the vertex, the y-intercept, and the mirror image of the y-intercept across the axis of symmetry.',
    a: 'Vertex (2, 5), y-intercept (0, 1), mirror point (4, 1)',
    s: 'Here a = −1 and b = 4, so the axis of symmetry is x = −b/(2a) = −4/(−2) = 2. Then y = −(2)² + 4(2) + 1 = 5, so the vertex is (2, 5), a maximum since a < 0. The y-intercept is (0, 1). It sits 2 units left of the axis, so its mirror image is 2 units right: (4, 1). Plot (2, 5), (0, 1) and (4, 1).',
    h: ['Find the axis of symmetry with x = −b/(2a), then substitute that x back in.', 'The y-intercept is where x = 0; reflect it across the axis to keep the same height.'],
    grid: { xRange: [-6, 6], yRange: [-6, 6] }, key: [[2, 5], [0, 1], [4, 1]],
    calc: ['h = −b/(2a); vertex (h, f(h)); (0, f(0)); (2h, f(0))', () => {
      const f = (x: number) => -(x ** 2) + 4 * x + 1;
      const h = -4 / (2 * -1);
      return [[h, f(h)], [0, f(0)], [2 * h, f(0)]];
    }],
    misses: [['used c as the vertex’s y-coordinate', [[2, 1], [0, 1], [4, 1]]], ['mirrored the y-intercept across the y-axis', [[2, 5], [0, 1], [-4, 1]]]],
  },

  // ── alg1.exponential-functions ─────────────────────────────────────────────
  {
    kind: 'points', lo: 'alg1.exponential-functions', t: 'plot-growth-including-negative-inputs', d: 1, sub: 'Evaluating exponential growth',
    q: 'For y = 4·2ˣ, find y at x = −2, −1, 0 and 1, and plot the four points on the coordinate grid.',
    a: '(−2, 1), (−1, 2), (0, 4), (1, 8)',
    s: 'Exponent first, then multiply by 4: x = −2 gives 4·(1/4) = 1; x = −1 gives 4·(1/2) = 2; x = 0 gives 4·1 = 4; x = 1 gives 4·2 = 8. Plot (−2, 1), (−1, 2), (0, 4) and (1, 8).',
    h: ['Any nonzero number to the power 0 is 1, so the graph passes through (0, a).', 'A negative exponent divides: 2 to the power −1 is 1/2.'],
    grid: { xRange: [-6, 6], yRange: [-2, 10] }, key: [[-2, 1], [-1, 2], [0, 4], [1, 8]],
    calc: ['(x, 4·2ˣ) for x = −2, −1, 0, 1', () => [-2, -1, 0, 1].map((x): Pt => [x, 4 * 2 ** x])],
    misses: [['added 2 per step (linear) instead of multiplying', [[-2, 0], [-1, 2], [0, 4], [1, 6]]], ['took 2⁰ as 0, so y = 0 at x = 0', [[-2, 1], [-1, 2], [0, 0], [1, 8]]]],
  },
  {
    kind: 'points', lo: 'alg1.exponential-functions', t: 'plot-decay-constant-ratio', d: 2, sub: 'Exponential decay by a constant ratio',
    q: 'For y = 9·(1/3)ˣ, find y at x = 0, 1 and 2, and plot the three points on the coordinate grid.',
    a: '(0, 9), (1, 3), (2, 1)',
    s: 'At x = 0 the power is 1, so y = 9 (the y-intercept). Each step right multiplies y by 1/3: x = 1 gives 9·(1/3) = 3, and x = 2 gives 9·(1/9) = 1. Plot (0, 9), (1, 3) and (2, 1).',
    h: ['Start at the y-intercept a, where x = 0.', 'Each time x goes up by 1, multiply the previous y-value by the base.'],
    grid: { xRange: [-4, 8], yRange: [-2, 10] }, key: [[0, 9], [1, 3], [2, 1]],
    calc: ['(x, 9·(1/3)ˣ) for x = 0, 1, 2', () => [0, 1, 2].map((x): Pt => [x, Math.round(9 * (1 / 3) ** x * 1e9) / 1e9])],
    misses: [['subtracted 3 per step (linear) instead of multiplying by 1/3', [[0, 9], [1, 6], [2, 3]]], ['started the powers at x = 1', [[1, 9], [2, 3], [3, 1]]]],
  },
];
