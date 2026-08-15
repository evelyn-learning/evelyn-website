/**
 * Grades 6-8 Math — Coordinate Plane: Graphing Points and Distance.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_MATH_COORDINATE_GRAPHING: LessonPlan = {
  id: 'evelyn.g68.math.coordinate-graphing.v1',
  title: 'Coordinate Plane — Graphing and Distance',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'coordinate-plane',
  locale: 'en',
  los: [{ id: 'g68.math.coordinate-graphing', description: 'Plot points in all four quadrants and find horizontal/vertical distance between two points.', standard: 'CCSS.MATH.CONTENT.6.NS.C.6 / 6.G.A.3' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'The coordinate plane is how we put GEOMETRY and ALGEBRA together.', script: 'A point on a flat plane needs TWO numbers to locate it: how far right or left, and how far up or down. With those two numbers, you can describe shapes, measure distances, and even graph equations. Today: the basics.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Axes, quadrants, plotting points, distance between points.', keyIdeas: [
      'X-AXIS: horizontal line. Right is positive, left is negative.',
      'Y-AXIS: vertical line. Up is positive, down is negative.',
      'ORIGIN: where x and y axes cross. Coordinates (0, 0).',
      'A POINT is named by an ORDERED PAIR (x, y). Always x first, then y.',
      'FOUR QUADRANTS:',
      '  Q1 (top right): both x, y positive. (3, 4).',
      '  Q2 (top left): x negative, y positive. (−3, 4).',
      '  Q3 (bottom left): both negative. (−3, −4).',
      '  Q4 (bottom right): x positive, y negative. (3, −4).',
      'PLOTTING a point (a, b):',
      '  Start at origin. Move RIGHT a units (or left if a is negative).',
      '  Then move UP b units (or down if b is negative).',
      '  Mark the point.',
      'DISTANCE between two points:',
      '  HORIZONTAL distance (same y): |x₂ − x₁|.',
      '  VERTICAL distance (same x): |y₂ − y₁|.',
      '  DIAGONAL distance: use Pythagorean theorem: d = √[(x₂−x₁)² + (y₂−y₁)²]. (Will be covered more in HS geometry.)',
    ], vocabulary: [{ term: 'ordered pair', definition: 'two numbers (x, y) that locate a point on the coordinate plane; x first, y second.' }, { term: 'quadrant', definition: 'one of the four regions of the coordinate plane separated by the x and y axes.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Plot points A(2, 3), B(2, −5), C(−4, 3). Find the distance from A to B and from A to C.', steps: [
      'A(2, 3): right 2, up 3. Q1.',
      'B(2, −5): right 2, down 5. Q4.',
      'C(−4, 3): left 4, up 3. Q2.',
      'A and B share x-coordinate (both at x = 2). Distance is VERTICAL: |3 − (−5)| = |8| = 8 units.',
      'A and C share y-coordinate (both at y = 3). Distance is HORIZONTAL: |2 − (−4)| = |6| = 6 units.',
    ], answer: 'A to B = 8 units. A to C = 6 units.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A rectangle has corners at (1, 2), (5, 2), (5, 8), (1, 8). Find its width, height, and area.', expectedAnswer: 'Width: from (1,2) to (5,2) — same y. |5−1| = 4 units. Height: from (1,2) to (1,8) — same x. |8−2| = 6 units. Area = width × height = 4 × 6 = 24 square units.', responseFormat: 'free', hints: ['Same y-coords give horizontal distance.', 'Same x-coords give vertical distance.'], estimatedMinutes: 3 },
    { id: 'misconception-order', kind: 'misconception_check', question: 'A student plots (3, 5) by moving up 3 then right 5. What did they do wrong?', commonErrors: [{ answer: 'Moves up first', misconception: 'Reversing x and y in an ordered pair.', correctsTo: 'In (3, 5), the first number is x (horizontal) and the second is y (vertical). Move RIGHT 3 first, THEN UP 5. Reversing gives a different point — (5, 3) instead of (3, 5). Always: x is left/right (first), y is up/down (second).' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['(x, y) — x first (right/left), y second (up/down).', 'Four quadrants by signs of x and y.', 'Same-line distances: just subtract abs values.', 'Diagonal distance: Pythagorean theorem (HS).'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
