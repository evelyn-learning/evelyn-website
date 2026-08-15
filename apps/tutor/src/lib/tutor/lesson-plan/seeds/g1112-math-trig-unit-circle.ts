/**
 * Grades 11-12 Math — Trigonometry: The Unit Circle.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_TRIG_UNIT_CIRCLE: LessonPlan = {
  id: 'evelyn.g1112.math.trig.unit-circle.v1',
  title: 'Trigonometry — The Unit Circle',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'trigonometry',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.trig.unit-circle',
      description: 'Use the unit circle to evaluate sine, cosine, and tangent at any angle (positive, negative, or beyond 360°), in degrees or radians.',
      standard: 'CCSS.MATH.CONTENT.HSF.TF.A.2',
    },
  ],
  prerequisites: ['g11.math.precalc.unit-circle'],
  followUps: ['g1112.math.trig.equations'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The unit circle extends trig from acute angles to ALL angles — including negative and beyond 360°.',
      script: 'Right-triangle trig only handles angles 0° to 90°. But what is sin(150°)? sin(−30°)? sin(720°)? The unit circle answers all of these by giving sine and cosine a coordinate-geometry meaning. Master the unit circle and trig stops being a calculator-button operation and becomes geometry.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-unit-circle',
      kind: 'concept',
      goal: 'Unit circle definitions, key angles, signs by quadrant, radian/degree, periodicity.',
      keyIdeas: [
        'THE UNIT CIRCLE: a circle of radius 1 centred at the origin. For any angle θ measured counterclockwise from the positive x-axis, the point on the circle is (cos θ, sin θ).',
        'So: cos θ = x-coordinate. sin θ = y-coordinate. tan θ = y/x = sin θ / cos θ (undefined where x = 0).',
        'KEY ANGLES on the unit circle (memorise!):',
        '  0°: (1, 0)  →  cos 0 = 1, sin 0 = 0.',
        '  30°: (√3/2, 1/2).',
        '  45°: (√2/2, √2/2).',
        '  60°: (1/2, √3/2).',
        '  90°: (0, 1)  →  cos 90 = 0, sin 90 = 1.',
        '  Then symmetry to fill 180°, 270°, 360°.',
        'RADIANS: 360° = 2π rad. 180° = π. 90° = π/2. 60° = π/3. 45° = π/4. 30° = π/6. Calculus uses radians by default.',
        'SIGNS BY QUADRANT (memorise "All Students Take Calculus"):',
        '  Q1 (0-90°): All positive (sin, cos, tan all +).',
        '  Q2 (90-180°): Sine positive (only sin +).',
        '  Q3 (180-270°): Tangent positive.',
        '  Q4 (270-360°): Cosine positive.',
        'NEGATIVE ANGLES go clockwise: −30° is the same point as 330°. cos(−θ) = cos θ (cosine is EVEN). sin(−θ) = −sin θ (sine is ODD).',
        'PERIODICITY: sin and cos repeat every 360° (2π). tan repeats every 180° (π). So sin(720°) = sin(360°) = sin(0°) = 0.',
        'REFERENCE ANGLE: the acute angle between θ and the x-axis. Sin/cos/tan of θ have the same magnitude as the reference angle, with sign determined by the quadrant.',
      ],
      vocabulary: [
        { term: 'unit circle', definition: 'a circle of radius 1 centred at the origin; angle θ in standard position has point (cos θ, sin θ) on the circle.' },
        { term: 'reference angle', definition: 'the acute angle from the terminal side of θ to the nearest x-axis; used to evaluate trig functions of any angle.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Evaluate sin(150°), cos(225°), and tan(−60°) using the unit circle.',
      steps: [
        'sin(150°): 150° is in Q2. Reference angle = 180° − 150° = 30°. In Q2, sine is positive. sin(30°) = 1/2. So sin(150°) = +1/2.',
        'cos(225°): 225° is in Q3. Reference angle = 225° − 180° = 45°. In Q3, cosine is negative. cos(45°) = √2/2. So cos(225°) = −√2/2.',
        'tan(−60°): negative angle, so go clockwise 60°. Same as 300°. 300° is in Q4. Reference angle = 360° − 300° = 60°. In Q4, tangent is negative. tan(60°) = √3. So tan(−60°) = −√3.',
        'Alternatively: tan is odd, so tan(−60°) = −tan(60°) = −√3.',
      ],
      answer: 'sin(150°) = 1/2; cos(225°) = −√2/2; tan(−60°) = −√3.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the exact value of cos(7π/6) without a calculator.',
      expectedAnswer: '7π/6 in degrees: (7/6) × 180° = 210°. 210° is in Q3. Reference angle: 210° − 180° = 30° (or π/6). In Q3, cosine is negative. cos(30°) = √3/2. So cos(7π/6) = −√3/2.',
      responseFormat: 'free',
      hints: [
        'Convert to degrees if helpful: 7π/6 = 210°.',
        'Find the quadrant, find the reference angle, apply the sign.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-period-vs-symmetry',
      kind: 'misconception_check',
      question: 'A student says sin(−30°) = sin(30°) = 1/2 because sine is "the same on either side." Why is this wrong?',
      commonErrors: [
        {
          answer: 'sin is even like cos',
          misconception: 'Confusing the even-ness of cosine with the odd-ness of sine.',
          correctsTo: 'COSINE is EVEN: cos(−θ) = cos(θ). SINE is ODD: sin(−θ) = −sin(θ). At θ = 30°, sin(30°) = 1/2 (in Q1, positive y). At −30°, the point is in Q4, with y-coordinate −1/2. So sin(−30°) = −1/2. Memory: cosine reflects across the x-axis (matches its own reflection), sine flips sign across the x-axis. Always check the y-coordinate when you suspect a sine sign error.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On the unit circle, (cos θ, sin θ) is the point at angle θ.',
        'Memorise key angles (0, 30, 45, 60, 90) and their values.',
        'ASTC: All-Students-Take-Calculus tells you sign by quadrant.',
        'cos is even (symmetric); sin is odd (flips with negation).',
        'sin/cos period 360° (2π); tan period 180° (π).',
        'Use reference angle + quadrant sign for any angle.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
