/** T4 drawn items — group geom (see kit.ts for the shape and the proof rules). */
import type { DrawnItem, Pt } from './kit';
import { T } from './kit';

const G6 = { xRange: [-6, 6] as [number, number], yRange: [-6, 6] as [number, number] };

export const ITEMS: DrawnItem[] = [
  // ── geom.segments-distance-midpoint ───────────────────────────────────────
  {
    kind: 'points', lo: 'geom.segments-distance-midpoint', t: 'plot-midpoint', d: 1, sub: 'Midpoint formula',
    q: 'Segment AB has endpoints A(−4, 3) and B(2, −5). Plot the midpoint of segment AB on the coordinate grid (one point).',
    a: 'M(−1, −1)',
    s: 'Average the x-coordinates: (−4 + 2)/2 = −2/2 = −1. Average the y-coordinates: (3 + (−5))/2 = −2/2 = −1. The midpoint is M(−1, −1). Plot that one point.',
    h: ['The midpoint formula adds the coordinates, it does not subtract them.', 'Average the two x-coordinates, then average the two y-coordinates.'],
    grid: G6, key: [[-1, -1]],
    calc: ['average of A and B', () => [T.midpoint([-4, 3], [2, -5])]],
    misses: [['subtracted instead of adding: ((2 − (−4))/2, (−5 − 3)/2)', [[3, -4]]], ['added but forgot to divide by 2', [[-2, -2]]]],
  },
  {
    kind: 'points', lo: 'geom.segments-distance-midpoint', t: 'plot-endpoint-from-midpoint', d: 3, sub: 'Finding an endpoint from the midpoint',
    q: 'M(1, 2) is the midpoint of segment AB, and endpoint A is at (−3, 4). Plot the other endpoint B on the coordinate grid (one point).',
    a: 'B(5, 0)',
    s: 'M is halfway from A to B, so B is as far past M as A is before it. From A to M: x changes by 1 − (−3) = 4 and y by 2 − 4 = −2. Repeat that step from M: B = (1 + 4, 2 − 2) = (5, 0). Equivalently x = 2·1 − (−3) = 5, y = 2·2 − 4 = 0. Check: ((−3 + 5)/2, (4 + 0)/2) = (1, 2). Plot B(5, 0).',
    h: ['The midpoint is halfway, so B is the same step beyond M as M is beyond A.', 'Find how x and y change from A to M, then apply the same change again starting at M.'],
    grid: G6, key: [[5, 0]],
    calc: ['B = 2M − A', () => [[2 * 1 - -3, 2 * 2 - 4] as Pt]],
    misses: [['averaged M and A (a quarter of the way)', [[-1, 3]]], ['plotted the change M − A as a point', [[4, -2]]]],
  },

  // ── geom.slopes-parallel-perpendicular ────────────────────────────────────
  {
    kind: 'line', lo: 'geom.slopes-parallel-perpendicular', t: 'graph-parallel-through-point', d: 1, sub: 'Parallel line through a point',
    q: 'Graph the line that passes through the point (1, 2) and is parallel to y = 3x − 4. Place two points of the line on the coordinate grid.',
    a: 'y = 3x − 1',
    s: 'Parallel lines have equal slopes, so the new slope is 3. Point-slope form: y − 2 = 3(x − 1), so y = 3x − 1. Two points on it are (0, −1) and (1, 2). Place those two points.',
    h: ['Parallel lines point in the same direction, so they share one number.', 'Use point-slope form with the given point, then find a second point by rise over run.'],
    grid: { xRange: [-5, 5], yRange: [-5, 5] }, key: [[0, -1], [1, 2]],
    on: ['y − 2 = 3(x − 1)', (x, y) => y - 2 - 3 * (x - 1)],
    misses: [['used the perpendicular slope −1/3', [[1, 2], [4, 1]]], ['drew the given line y = 3x − 4 itself', [[0, -4], [1, -1]]]],
  },
  {
    kind: 'line', lo: 'geom.slopes-parallel-perpendicular', t: 'graph-perpendicular-to-horizontal', d: 2, sub: 'Horizontal and vertical lines are perpendicular',
    q: 'Graph the line that passes through the point (−3, 2) and is perpendicular to the line y = −1. Place two points of the line on the coordinate grid.',
    a: 'x = −3',
    s: 'The line y = −1 is horizontal (slope 0). A line perpendicular to a horizontal line is vertical, and the slope-product test cannot be used. The vertical line through (−3, 2) is x = −3. Place two points with x = −3, for example (−3, 2) and (−3, −1).',
    h: ['What kind of line is y = −1, and what direction is at a right angle to it?', 'A vertical line keeps the same x-coordinate at every point.'],
    grid: G6, key: [[-3, 2], [-3, -1]],
    on: ['vertical line through (−3, 2): x + 3 = 0', (x) => x - -3],
    misses: [['drew the parallel horizontal line y = 2', [[0, 2], [-3, 2]]], ['used the y-coordinate: x = 2', [[2, 0], [2, 3]]]],
  },
  {
    kind: 'line', lo: 'geom.slopes-parallel-perpendicular', t: 'graph-perpendicular-from-standard-form', d: 3, sub: 'Perpendicular line from standard form',
    q: 'Graph the line that passes through the point (−2, 4) and is perpendicular to 2x − 3y = 6. Place two points of the line on the coordinate grid.',
    a: 'y = −(3/2)x + 1',
    s: 'Solve 2x − 3y = 6 for y: −3y = −2x + 6, so y = (2/3)x − 2, slope 2/3. The perpendicular slope is the negative reciprocal, −3/2. Point-slope: y − 4 = −(3/2)(x + 2), so y = −(3/2)x + 1. Two points: (−2, 4) and (0, 1) (also (2, −2)). Place two of them.',
    h: ['The slope is not the coefficient of x in standard form — solve for y first.', 'Flip the slope and change its sign, then go from the given point using rise over run.'],
    grid: G6, key: [[-2, 4], [0, 1]],
    on: ['y − 4 = −(3/2)(x + 2)', (x, y) => y - 4 + 1.5 * (x + 2)],
    misses: [['drew the parallel line, slope 2/3', [[-2, 4], [1, 6]]], ['read the slope as 2, used −1/2', [[-2, 4], [2, 2]]]],
  },

  // ── geom.translations ─────────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.translations', t: 'translate-triangle-by-words', d: 1, sub: 'Translating by a described move',
    q: 'Triangle ABC has vertices A(−4, 1), B(−1, 3) and C(−2, −2). Translate it 5 units right and 2 units down, and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(1, −1), B′(4, 1), C′(3, −4)',
    s: 'The rule is (x, y) → (x + 5, y − 2). A(−4, 1) → A′(1, −1), B(−1, 3) → B′(4, 1), C(−2, −2) → C′(3, −4). Plot these three points.',
    h: ['Right is the positive x-direction and down is the negative y-direction.', 'Add the same amount to every x and the same amount to every y.'],
    grid: G6, key: [[1, -1], [4, 1], [3, -4]],
    calc: ['(x, y) → (x + 5, y − 2)', () => ([[-4, 1], [-1, 3], [-2, -2]] as Pt[]).map((p) => T.translate(p, 5, -2))],
    misses: [['moved 2 up instead of 2 down', [[1, 3], [4, 5], [3, 0]]], ['only moved right, forgot the 2 down', [[1, 1], [4, 3], [3, -2]]]],
  },
  {
    kind: 'points', lo: 'geom.translations', t: 'apply-rule-found-from-a-pair', d: 3, sub: 'Finding and applying a translation rule',
    q: 'A translation maps P(3, −2) onto P′(−1, 1). Apply the same translation to triangle DEF with D(−1, 2), E(1, 0) and F(−1, −2), and plot the three vertices of the image on the coordinate grid.',
    a: 'D′(−5, 5), E′(−3, 3), F′(−5, 1)',
    s: 'Image minus preimage: a = −1 − 3 = −4 and b = 1 − (−2) = 3, so the rule is (x, y) → (x − 4, y + 3). D(−1, 2) → D′(−5, 5), E(1, 0) → E′(−3, 3), F(−1, −2) → F′(−5, 1). Plot these three points.',
    h: ['Find the rule by subtracting preimage coordinates from image coordinates.', 'Check your rule on P before using it on D, E and F.'],
    grid: G6, key: [[-5, 5], [-3, 3], [-5, 1]],
    calc: ['rule = P′ − P applied to D, E, F', () => {
      const [a, b] = [-1 - 3, 1 - -2];
      return ([[-1, 2], [1, 0], [-1, -2]] as Pt[]).map((p) => T.translate(p, a, b));
    }],
    misses: [['subtracted in the wrong order: (x + 4, y − 3)', [[3, -1], [5, -3], [3, -5]]], ['wrong sign on the vertical change: (x − 4, y − 3)', [[-5, -1], [-3, -3], [-5, -5]]]],
  },

  // ── geom.reflections ──────────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.reflections', t: 'reflect-triangle-x-axis', d: 1, sub: 'Reflection across the x-axis',
    q: 'Triangle ABC has vertices A(−3, 2), B(1, 4) and C(2, 1). Reflect it across the x-axis and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(−3, −2), B′(1, −4), C′(2, −1)',
    s: 'A reflection across the x-axis maps (x, y) to (x, −y), because y measures the distance from the x-axis. A(−3, 2) → A′(−3, −2), B(1, 4) → B′(1, −4), C(2, 1) → C′(2, −1). Plot these three points.',
    h: ['Ask which coordinate measures the distance from the x-axis.', 'Each image point stays in the same column and lands the same distance on the other side of the mirror.'],
    grid: G6, key: [[-3, -2], [1, -4], [2, -1]],
    calc: ['(x, y) → (x, −y)', () => ([[-3, 2], [1, 4], [2, 1]] as Pt[]).map((p) => T.reflectX(p))],
    misses: [['reflected across the y-axis', [[3, 2], [-1, 4], [-2, 1]]], ['negated both coordinates (a 180° rotation)', [[3, -2], [-1, -4], [-2, -1]]]],
  },
  {
    kind: 'points', lo: 'geom.reflections', t: 'reflect-triangle-y-eq-x', d: 2, sub: 'Reflection across y = x',
    q: 'Triangle ABC has vertices A(1, 3), B(4, 2) and C(2, −2). Reflect it across the line y = x and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(3, 1), B′(2, 4), C′(−2, 2)',
    s: 'A reflection across y = x swaps the coordinates: (x, y) → (y, x), with no sign change. A(1, 3) → A′(3, 1), B(4, 2) → B′(2, 4), C(2, −2) → C′(−2, 2). Plot these three points.',
    h: ['The line y = x is the mirror; a point on it does not move.', 'For this mirror the two coordinates trade places.'],
    grid: G6, key: [[3, 1], [2, 4], [-2, 2]],
    calc: ['(x, y) → (y, x)', () => ([[1, 3], [4, 2], [2, -2]] as Pt[]).map((p) => T.reflectYeqX(p))],
    misses: [['used the y = −x rule (−y, −x)', [[-3, -1], [-2, -4], [2, -2]]], ['swapped and negated the first coordinate (a 90° rotation)', [[-3, 1], [-2, 4], [2, 2]]]],
  },
  {
    kind: 'points', lo: 'geom.reflections', t: 'reflect-triangle-horizontal-line', d: 3, sub: 'Reflection across a horizontal line y = k',
    q: 'Triangle ABC has vertices A(−2, 4), B(3, 3) and C(1, −1). Reflect it across the horizontal line y = 1 and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(−2, −2), B′(3, −1), C′(1, 3)',
    s: 'Across y = 1 each point keeps its x-coordinate and lands the same distance on the other side of the line: (x, y) → (x, 2·1 − y). A is 3 above the line → A′(−2, −2). B is 2 above → B′(3, −1). C is 2 below → C′(1, 3). Plot these three points.',
    h: ['Count how far each vertex is above or below the line y = 1.', 'Go the same distance on the other side of the line; the x-coordinates do not change.'],
    grid: G6, key: [[-2, -2], [3, -1], [1, 3]],
    calc: ['(x, y) → (x, 2 − y)', () => ([[-2, 4], [3, 3], [1, -1]] as Pt[]).map((p) => T.reflectYeq(p, 1))],
    misses: [['used the x-axis rule (x, −y)', [[-2, -4], [3, -3], [1, 1]]], ['reflected across the vertical line x = 1', [[4, 4], [-1, 3], [1, -1]]]],
  },

  // ── geom.rotations ────────────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.rotations', t: 'rotate-triangle-180-origin', d: 1, sub: '180° rotation about the origin',
    q: 'Triangle ABC has vertices A(2, 1), B(5, 3) and C(1, 4). Rotate it 180° about the origin and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(−2, −1), B′(−5, −3), C′(−1, −4)',
    s: 'A 180° rotation about the origin maps (x, y) to (−x, −y). A(2, 1) → A′(−2, −1), B(5, 3) → B′(−5, −3), C(1, 4) → C′(−1, −4). Plot these three points.',
    h: ['A half-turn about the origin sends each point through the origin to the opposite side.', 'The origin is the midpoint of each point and its image.'],
    grid: G6, key: [[-2, -1], [-5, -3], [-1, -4]],
    calc: ['rotate 180° about (0, 0)', () => ([[2, 1], [5, 3], [1, 4]] as Pt[]).map((p) => T.rotate(p, 180))],
    misses: [['reflected across the x-axis instead', [[2, -1], [5, -3], [1, -4]]], ['used the 90° counterclockwise rule (−y, x)', [[-1, 2], [-3, 5], [-4, 1]]]],
  },
  {
    kind: 'points', lo: 'geom.rotations', t: 'rotate-triangle-90-clockwise-origin', d: 2, sub: '90° clockwise rotation about the origin',
    q: 'Triangle ABC has vertices A(1, 2), B(4, 1) and C(2, 5). Rotate it 90° clockwise about the origin and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(2, −1), B′(1, −4), C′(5, −2)',
    s: 'A 90° clockwise rotation (the same as 270° counterclockwise) about the origin maps (x, y) to (y, −x). A(1, 2) → A′(2, −1), B(4, 1) → B′(1, −4), C(2, 5) → C′(5, −2). Plot these three points.',
    h: ['Clockwise is the negative direction: 90° clockwise equals 270° counterclockwise.', 'A quarter-turn swaps the coordinates and negates exactly one of them — decide which.'],
    grid: G6, key: [[2, -1], [1, -4], [5, -2]],
    calc: ['rotate −90° about (0, 0)', () => ([[1, 2], [4, 1], [2, 5]] as Pt[]).map((p) => T.rotate(p, -90))],
    misses: [['used the counterclockwise rule (−y, x)', [[-2, 1], [-1, 4], [-5, 2]]], ['swapped and negated both (a reflection across y = −x)', [[-2, -1], [-1, -4], [-5, -2]]]],
  },
  {
    kind: 'points', lo: 'geom.rotations', t: 'rotate-triangle-90-about-point', d: 3, sub: 'Rotation about a center other than the origin',
    q: 'Triangle ABC has vertices A(3, −1), B(4, 2) and C(2, 2). Rotate it 90° counterclockwise about the point (1, −1) and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(1, 1), B′(−2, 2), C′(−2, 0)',
    s: 'Subtract the center (1, −1): A → (2, 0), B → (3, 3), C → (1, 3). Apply the 90° counterclockwise rule (x, y) → (−y, x): (0, 2), (−3, 3), (−3, 1). Add the center back: A′(1, 1), B′(−2, 2), C′(−2, 0). Plot these three points.',
    h: ['Move everything so the center sits at the origin, rotate, then move back.', 'The center itself must stay fixed — the origin rule alone would move it.'],
    grid: G6, key: [[1, 1], [-2, 2], [-2, 0]],
    calc: ['rotate 90° about (1, −1)', () => ([[3, -1], [4, 2], [2, 2]] as Pt[]).map((p) => T.rotate(p, 90, [1, -1]))],
    misses: [['used the origin as the center', [[1, 3], [-2, 4], [-2, 2]]], ['turned clockwise about (1, −1)', [[1, -3], [4, -4], [4, -2]]]],
  },

  // ── geom.dilations-scale-factor ───────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.dilations-scale-factor', t: 'dilate-triangle-origin-k2', d: 1, sub: 'Dilation about the origin',
    q: 'Triangle ABC has vertices A(−2, 1), B(1, 2) and C(2, −1). Dilate it about the origin with scale factor 2 and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(−4, 2), B′(2, 4), C′(4, −2)',
    s: 'A dilation about the origin with scale factor k maps (x, y) to (kx, ky). With k = 2: A(−2, 1) → A′(−4, 2), B(1, 2) → B′(2, 4), C(2, −1) → C′(4, −2). Plot these three points.',
    h: ['A dilation multiplies; it never adds.', 'Multiply both coordinates of each vertex by the scale factor.'],
    grid: G6, key: [[-4, 2], [2, 4], [4, -2]],
    calc: ['(x, y) → (2x, 2y)', () => ([[-2, 1], [1, 2], [2, -1]] as Pt[]).map((p) => T.dilate(p, 2))],
    misses: [['added 2 to each coordinate (a translation)', [[0, 3], [3, 4], [4, 1]]], ['scaled only the x-coordinates', [[-4, 1], [2, 2], [4, -1]]]],
  },
  {
    kind: 'points', lo: 'geom.dilations-scale-factor', t: 'dilate-triangle-half-about-point', d: 3, sub: 'Dilation about a center other than the origin',
    q: 'Triangle ABC has vertices A(2, −4), B(4, 2) and C(−2, 4). Dilate it about the center P(−2, −4) with scale factor 1/2 and plot the three vertices of the image on the coordinate grid.',
    a: 'A′(0, −4), B′(1, −1), C′(−2, 0)',
    s: 'Measure each trip from the center, halve it, and start again at the center: (x, y) → (−2 + ½(x + 2), −4 + ½(y + 4)). A: trip (4, 0) → (2, 0) → A′(0, −4). B: trip (6, 6) → (3, 3) → B′(1, −1). C: trip (0, 8) → (0, 4) → C′(−2, 0). Plot these three points.',
    h: ['The center is not the origin, so multiplying the coordinates directly is wrong.', 'Find how far each vertex is from P, scale that, then add it back to P.'],
    grid: G6, key: [[0, -4], [1, -1], [-2, 0]],
    calc: ['dilate by 1/2 about (−2, −4)', () => ([[2, -4], [4, 2], [-2, 4]] as Pt[]).map((p) => T.dilate(p, 0.5, [-2, -4]))],
    misses: [['ignored the center and used the origin rule', [[1, -2], [2, 1], [-1, 2]]], ['halved only the horizontal distance from P', [[0, -4], [1, 2], [-2, 4]]]],
  },

  // ── geom.compositions-symmetry ────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.compositions-symmetry', t: 'reflect-then-translate', d: 2, sub: 'Composition: reflection then translation',
    q: 'Triangle ABC has vertices A(1, 1), B(3, 2) and C(2, 4). Reflect it across the y-axis, then translate that image 2 units right. Plot the three vertices of the final image on the coordinate grid.',
    a: 'A″(1, 1), B″(−1, 2), C″(0, 4)',
    s: 'Reflect across the y-axis, (x, y) → (−x, y): (−1, 1), (−3, 2), (−2, 4). Then translate 2 right, (x, y) → (x + 2, y): (1, 1), (−1, 2), (0, 4). Plot these three points. (Doing the steps in the other order would give (−3, 1), (−5, 2), (−4, 4), so the order matters.)',
    h: ['Do the steps in the order they are stated, applying the second to the result of the first.', 'A reflection across the y-axis changes only the sign of x.'],
    grid: G6, key: [[1, 1], [-1, 2], [0, 4]],
    calc: ['reflect in the y-axis, then (x + 2, y)', () => ([[1, 1], [3, 2], [2, 4]] as Pt[]).map((p) => T.translate(T.reflectY(p), 2, 0))],
    misses: [['translated first, then reflected', [[-3, 1], [-5, 2], [-4, 4]]], ['reflected across the x-axis instead', [[3, -1], [5, -2], [4, -4]]]],
  },
  {
    kind: 'points', lo: 'geom.compositions-symmetry', t: 'two-reflections-parallel-lines', d: 3, sub: 'Two reflections across parallel lines',
    q: 'Triangle ABC has vertices A(−5, 1), B(−3, 4) and C(−4, −2). Reflect it across the line x = −1, then reflect that image across the line x = 2. Plot the three vertices of the final image on the coordinate grid.',
    a: 'A″(1, 1), B″(3, 4), C″(2, −2)',
    s: 'Across x = −1, (x, y) → (−2 − x, y): A′(3, 1), B′(1, 4), C′(2, −2). Across x = 2, (x, y) → (4 − x, y): A″(1, 1), B″(3, 4), C″(2, −2). The mirrors are 3 apart, so the composition is a translation of 2 · 3 = 6 units right. Plot these three points.',
    h: ['Two reflections across parallel mirrors make a single translation perpendicular to the mirrors.', 'The slide is twice the distance between the mirrors, in the direction from the first mirror to the second.'],
    grid: G6, key: [[1, 1], [3, 4], [2, -2]],
    calc: ['reflect in x = −1, then in x = 2', () => ([[-5, 1], [-3, 4], [-4, -2]] as Pt[]).map((p) => T.reflectXeq(T.reflectXeq(p, -1), 2))],
    misses: [['translated only 3 units (the gap between mirrors)', [[-2, 1], [0, 4], [-1, -2]]], ['stopped after the first reflection', [[3, 1], [1, 4], [2, -2]]]],
  },

  // ── geom.area-polygons ────────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.area-polygons', t: 'third-vertex-from-triangle-area', d: 2, sub: 'Triangle area from base and height',
    q: 'Triangle ABC has A(−2, −3) and B(2, −3). Vertex C lies on the y-axis above side AB, and the area of the triangle is 8 square units. Plot vertex C on the coordinate grid (one point).',
    a: 'C(0, 1)',
    s: 'Base AB is horizontal with length 2 − (−2) = 4. From A = ½·b·h: 8 = ½·4·h, so h = 4. The height is the vertical distance from line y = −3 up to C, so C is at y = −3 + 4 = 1 on the y-axis: C(0, 1). Plot that point.',
    h: ['Use AB as the base; its length comes from subtracting x-coordinates.', 'The height is measured from the line containing AB, not from the x-axis.'],
    grid: G6, key: [[0, 1]],
    calc: ['h = 2·8 / |AB|, C = (0, −3 + h)', () => {
      const h = (2 * 8) / Math.abs(2 - -2);
      return [[0, -3 + h] as Pt];
    }],
    misses: [['forgot the ½: h = 8 / 4 = 2', [[0, -1]]], ['measured the height 4 from the x-axis', [[0, 4]]]],
  },
  {
    kind: 'points', lo: 'geom.area-polygons', t: 'trapezoid-vertex-from-area', d: 3, sub: 'Trapezoid area',
    q: 'Trapezoid ABCD has A(−3, −2), B(5, −2) and D(−3, 2), with side DC parallel to AB and C to the right of D. The area of ABCD is 24 square units. Plot vertex C on the coordinate grid (one point).',
    a: 'C(1, 2)',
    s: 'AB = 5 − (−3) = 8 and the height between y = −2 and y = 2 is 4. A = ½(b₁ + b₂)h gives 24 = ½(8 + DC)·4 = 2(8 + DC), so 8 + DC = 12 and DC = 4. C is 4 units right of D(−3, 2): C(1, 2). Plot that point.',
    h: ['Find the bottom base and the perpendicular height from the coordinates.', 'Area of a trapezoid is the average of the parallel sides times the height; solve for the unknown side.'],
    grid: G6, key: [[1, 2]],
    calc: ['DC = 2·24/h − AB, C = D + (DC, 0)', () => {
      const ab = 5 - -3;
      const h = 2 - -2;
      const dc = (2 * 24) / h - ab;
      return [[-3 + dc, 2] as Pt];
    }],
    misses: [['took 24 ÷ 4 = 6 as the top base', [[3, 2]]], ['made a rectangle, DC = AB', [[5, 2]]]],
  },

  // ── geom.parallelograms ───────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.parallelograms', t: 'fourth-vertex-of-parallelogram', d: 2, sub: 'Opposite sides parallel and congruent',
    q: 'ABCD is a parallelogram with its vertices named in order. A(−3, −1), B(2, −1) and C(4, 3). Plot the fourth vertex D on the coordinate grid (one point).',
    a: 'D(−1, 3)',
    s: 'Opposite sides of a parallelogram are parallel and congruent, so going from A to D is the same move as going from B to C. B to C: 2 right, 4 up. Apply that to A(−3, −1): D(−1, 3). Check: AB and DC are both horizontal with length 5. Plot D(−1, 3).',
    h: ['In ABCD named in order, side AD is opposite side BC.', 'The move from B to C must equal the move from A to D.'],
    grid: G6, key: [[-1, 3]],
    calc: ['D = A + (C − B)', () => [[-3 + (4 - 2), -1 + (3 - -1)] as Pt]],
    misses: [['assumed a rectangle: D straight above A', [[-3, 3]]], ['used the wrong vertex order (A + B − C)', [[-5, -5]]]],
  },
  {
    kind: 'points', lo: 'geom.parallelograms', t: 'vertices-from-bisecting-diagonals', d: 3, sub: 'Diagonals bisect each other',
    q: 'In parallelogram PQRS (vertices in order) the diagonals PR and QS meet at M(1, 1). P is at (−2, 3) and Q is at (4, 4). Plot the two remaining vertices R and S on the coordinate grid (two points).',
    a: 'R(4, −1), S(−2, −2)',
    s: 'The diagonals of a parallelogram bisect each other, so M is the midpoint of PR and of QS. R = 2M − P = (2 − (−2), 2 − 3) = (4, −1). S = 2M − Q = (2 − 4, 2 − 4) = (−2, −2). Plot these two points.',
    h: ['M is the midpoint of each diagonal.', 'Each missing vertex is as far past M as the known opposite vertex is before it.'],
    grid: G6, key: [[4, -1], [-2, -2]],
    calc: ['R = 2M − P, S = 2M − Q', () => [[2 * 1 - -2, 2 * 1 - 3] as Pt, [2 * 1 - 4, 2 * 1 - 4] as Pt]],
    misses: [['added M to each vertex', [[-1, 4], [5, 5]]], ['plotted M − P and M − Q', [[3, -2], [-3, -3]]]],
  },

  // ── geom.circle-equations ─────────────────────────────────────────────────
  {
    kind: 'points', lo: 'geom.circle-equations', t: 'plot-center-and-compass-points', d: 2, sub: 'Reading center and radius from standard form',
    q: 'A circle has equation (x − 1)² + (y + 2)² = 9. Plot its center and the four points of the circle directly above, below, left and right of the center on the coordinate grid (five points in all).',
    a: 'Center (1, −2); points (4, −2), (−2, −2), (1, 1), (1, −5)',
    s: 'Standard form (x − h)² + (y − k)² = r² gives h = 1, k = −2 (the sign inside is opposite) and r = √9 = 3. Center (1, −2). Go 3 units each way: (4, −2), (−2, −2), (1, 1), (1, −5). Plot these five points.',
    h: ['The center coordinates have the opposite sign of the numbers inside the parentheses.', 'The right side is the radius squared — take its square root.'],
    grid: G6, key: [[1, -2], [4, -2], [-2, -2], [1, 1], [1, -5]],
    calc: ['center (1, −2), r = √9, four axis-direction points', () => {
      const c: Pt = [1, -2];
      const r = Math.sqrt(9);
      return [c, [c[0] + r, c[1]], [c[0] - r, c[1]], [c[0], c[1] + r], [c[0], c[1] - r]];
    }],
    misses: [['signs of the center not flipped: center (−1, 2)', [[-1, 2], [2, 2], [-4, 2], [-1, 5], [-1, -1]]], ['center coordinates swapped: (−2, 1)', [[-2, 1], [1, 1], [-5, 1], [-2, 4], [-2, -2]]]],
  },
  {
    kind: 'points', lo: 'geom.circle-equations', t: 'complete-square-then-plot', d: 3, sub: 'Completing the square from general form',
    q: 'A circle has equation x² + y² + 4x − 2y − 4 = 0. Plot its center and the four points of the circle directly above, below, left and right of the center on the coordinate grid (five points in all).',
    a: 'Center (−2, 1); points (1, 1), (−5, 1), (−2, 4), (−2, −2)',
    s: 'Group and move the constant: (x² + 4x) + (y² − 2y) = 4. Add (4/2)² = 4 and (−2/2)² = 1 to both sides: (x + 2)² + (y − 1)² = 9. Center (−2, 1), radius 3. Points 3 units each way: (1, 1), (−5, 1), (−2, 4), (−2, −2). Plot these five points.',
    h: ['Complete the square for the x-terms and for the y-terms separately.', 'Whatever you add on the left must also be added on the right.'],
    grid: G6, key: [[-2, 1], [1, 1], [-5, 1], [-2, 4], [-2, -2]],
    calc: ['from x² + y² + Dx + Ey + F = 0: center (−D/2, −E/2), r² = (D/2)² + (E/2)² − F', () => {
      const [D, E, F] = [4, -2, -4];
      const c: Pt = [-D / 2, -E / 2];
      const r = Math.sqrt((D / 2) ** 2 + (E / 2) ** 2 - F);
      return [c, [c[0] + r, c[1]], [c[0] - r, c[1]], [c[0], c[1] + r], [c[0], c[1] - r]];
    }],
    misses: [['did not add 4 and 1 to the right side: r = 2', [[-2, 1], [0, 1], [-4, 1], [-2, 3], [-2, -1]]], ['center sign error: (2, −1)', [[2, -1], [5, -1], [-1, -1], [2, 2], [2, -4]]]],
  },
];
