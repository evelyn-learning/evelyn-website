/**
 * G11 — Pre-calculus: the unit circle.
 *
 * Generalize trig from "ratios in right triangles" to "coordinates of a
 * point moving around a unit circle." Domain expands from acute angles
 * to all angles, including negatives and beyond 360°. Uses the unit_circle
 * diagram kind for visualization.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_UNIT_CIRCLE: LessonPlan = {
  id: 'evelyn.g11.math.precalc.unit-circle.v1',
  title: 'The Unit Circle',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'precalculus',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf.tf.a.2',
      description: 'Explain how the unit circle in the coordinate plane enables the extension of trig functions to all real numbers.',
      standard: 'CCSS.MATH.CONTENT.HSF.TF.A.2',
    },
    {
      id: 'ccss.math.hsf.tf.a.3',
      description: 'Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4, π/6.',
      standard: 'CCSS.MATH.CONTENT.HSF.TF.A.3',
    },
  ],
  prerequisites: ['ccss.math.hsg.srt.c.6'],
  followUps: ['ccss.math.hsf.tf.b.5'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student wonder how sin and cos can be defined for angles greater than 90° — there\'s no "right triangle" with a 120° angle inside it.',
      script: 'Right-triangle trig only works for angles between 0° and 90°. But what\'s sin 200°? sin 1000°? sin(−45°)? We need a definition that works for ANY angle. Enter the unit circle.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-definition',
      kind: 'concept',
      goal: 'On a unit circle (radius 1, centered at origin), an angle θ measured counterclockwise from the positive x-axis lands a point at (cos θ, sin θ).',
      keyIdeas: [
        'A unit circle has radius 1 and is centered at the origin.',
        'Start on the positive x-axis. Rotate counterclockwise by θ. You end on a point P.',
        'The x-coordinate of P is cos θ.',
        'The y-coordinate of P is sin θ.',
        'tan θ = sin θ / cos θ = y / x.',
        'This works for ANY θ — positive, negative, more than 360°, anything.',
        'For θ between 0 and 90°, this matches right-triangle trig exactly (the triangle whose hypotenuse is the radius).',
      ],
      vocabulary: [
        { term: 'unit circle', definition: 'circle of radius 1 centered at the origin (0, 0).' },
        { term: 'standard position', definition: 'an angle measured counterclockwise from the positive x-axis.' },
        { term: 'reference angle', definition: 'the acute angle between the terminal side and the x-axis — used to look up sin/cos values from special triangles.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-special-angles',
      kind: 'worked_example',
      problem: 'Find sin and cos of 30°, 45°, 60° using the unit circle.',
      steps: [
        '30°: special triangle gives ratios 1 : √3 : 2. On the unit circle (hypotenuse = 1), opposite = 1/2, adjacent = √3/2. So sin 30° = 1/2, cos 30° = √3/2.',
        '45°: isoceles right triangle, ratios 1 : 1 : √2. Both legs scale to √2/2. So sin 45° = cos 45° = √2/2.',
        '60°: same triangle as 30°, but the OTHER acute angle. The "opposite" and "adjacent" swap. So sin 60° = √3/2, cos 60° = 1/2.',
        'Memorize the pattern: sin 30°, sin 45°, sin 60° = 1/2, √2/2, √3/2  (1, 2, 3 under the radicals, all over 2).',
      ],
      answer: '(1/2, √3/2), (√2/2, √2/2), (√3/2, 1/2)',
      estimatedMinutes: 5,
    },
    {
      id: 'worked-beyond-90',
      kind: 'worked_example',
      problem: 'Find sin 150° and cos 150°.',
      steps: [
        '150° is in the second quadrant (between 90° and 180°).',
        'The reference angle is 180° − 150° = 30°.',
        'In the second quadrant: x is NEGATIVE, y is POSITIVE.',
        'So cos 150° = − cos 30° = −√3/2.',
        'And sin 150° = + sin 30° = 1/2.',
      ],
      answer: 'sin 150° = 1/2,  cos 150° = −√3/2',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find sin 225°.',
      expectedAnswer: '-√2/2',
      responseFormat: 'frq',
      hints: [
        '225° is in which quadrant? What\'s the reference angle?',
        '225° = 180° + 45°. Quadrant III. Reference angle 45°. In Q III, both sin and cos are NEGATIVE.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-quadrant-signs',
      kind: 'misconception_check',
      question: 'A friend computes cos 200° as positive because "cos is just adjacent over hypotenuse, both lengths." Where did they go wrong?',
      commonErrors: [
        {
          answer: 'positive',
          misconception: 'Treating cos as a ratio of LENGTHS instead of the x-COORDINATE on the unit circle. Lengths are always positive; coordinates can be negative.',
          correctsTo: 'On the unit circle, cos θ is the x-COORDINATE of the point. 200° is in the third quadrant where x < 0. So cos 200° is NEGATIVE, even though the ratio interpretation makes it look positive. The unit-circle definition is the more general one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On the unit circle, (cos θ, sin θ) = the point you reach by rotating θ from the positive x-axis.',
        'cos = x-coordinate, sin = y-coordinate.',
        'Quadrant signs: I (+,+), II (−,+), III (−,−), IV (+,−).',
        'Reference angle = angle to the nearest x-axis. Look up that angle in the special triangles, then apply the quadrant sign.',
        'Definitions extend to all real angles, not just 0°–90°.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What\'s sin(−θ) in terms of sin θ? cos(−θ) in terms of cos θ?',
      hint: 'Reflecting across the x-axis flips the y-coordinate. The x-coordinate is unchanged.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
