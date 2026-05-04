/**
 * GRE Quant — Coordinate Geometry.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_COORDINATE_GEOMETRY: LessonPlan = {
  id: 'evelyn.gre.q.coordinate-geometry.v1',
  title: 'GRE Quant — Coordinate Geometry',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.coordinate-geometry',
      description: 'Compute slope, distance, and midpoint; find equations of lines; identify parallel and perpendicular lines.',
      standard: 'GRE-Q-COORD',
    },
  ],
  prerequisites: ['gre.q.word-problems'],
  followUps: ['gre.q.lines-angles-triangles'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE coordinate geometry questions are short — they reward fluency with slope, distance, and the equation of a line.',
      script: 'Three formulas — slope, distance, midpoint — answer most coordinate-geometry questions. Throw in the parallel/perpendicular slope rules and you handle the rest. Today\'s drill: zero-thought recall of these formulas.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-coords',
      kind: 'concept',
      goal: 'Slope, distance, midpoint, line equations, parallel/perpendicular.',
      keyIdeas: [
        'SLOPE between (x₁, y₁) and (x₂, y₂): m = (y₂ − y₁)/(x₂ − x₁).',
        'DISTANCE: d = √[(x₂ − x₁)² + (y₂ − y₁)²]. Pythagoras.',
        'MIDPOINT: ((x₁ + x₂)/2, (y₁ + y₂)/2).',
        'LINE EQUATION (slope-intercept): y = mx + b. m is slope, b is y-intercept.',
        'POINT-SLOPE FORM: y − y₁ = m(x − x₁). Useful when you have a point and slope.',
        'STANDARD FORM: ax + by = c. x-intercept at y = 0, y-intercept at x = 0.',
        'PARALLEL LINES: equal slopes. Perpendicular lines: slopes are negative reciprocals (m₁·m₂ = −1).',
        'HORIZONTAL: slope 0, equation y = constant. VERTICAL: undefined slope, equation x = constant.',
        'CIRCLE: (x − h)² + (y − k)² = r². Centre (h, k), radius r.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'rise over run; rate of change of y with respect to x.' },
        { term: 'midpoint', definition: 'the point exactly halfway between two given points.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-perpendicular',
      kind: 'worked_example',
      problem: 'Find the equation of the line passing through (4, 1) and perpendicular to y = (1/3)x + 2.',
      steps: [
        'Given line slope: 1/3. Perpendicular slope: negative reciprocal = −3.',
        'Use point-slope: y − 1 = −3(x − 4).',
        'Expand: y − 1 = −3x + 12 → y = −3x + 13.',
        'CHECK: slope is −3 ✓, passes through (4, 1): −3·4 + 13 = 1 ✓.',
      ],
      answer: 'y = −3x + 13',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the distance between (1, 2) and (4, 6).',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: [
        'Δx = 3, Δy = 4.',
        'd = √(9 + 16) = √25.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-perpendicular',
      kind: 'misconception_check',
      question: 'Two lines are perpendicular. The first has slope 2/5. A student says the second has slope −2/5. Correct?',
      commonErrors: [
        {
          answer: 'Perpendicular slope = −2/5',
          misconception: 'Negating the slope without taking the reciprocal.',
          correctsTo: 'Perpendicular slope is the NEGATIVE RECIPROCAL: flip the fraction AND change the sign. 2/5 → reciprocal is 5/2 → negate → −5/2. Verify: 2/5 · (−5/2) = −1 ✓. Just flipping signs (−2/5) gives parallel lines on a reflection but not perpendicular. Always do BOTH operations.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slope m = Δy/Δx. Distance = √(Δx² + Δy²). Midpoint = average of coordinates.',
        'Slope-intercept y = mx + b. Point-slope y − y₁ = m(x − x₁).',
        'Parallel: same slope. Perpendicular: slopes multiply to −1.',
        'Horizontal slope 0; vertical slope undefined.',
        'Circle: (x − h)² + (y − k)² = r².',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the area of the triangle with vertices (0, 0), (4, 0), (0, 3).',
      hint: 'Right triangle with legs along the axes: legs 4 and 3. Area = (1/2)·4·3 = 6.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
