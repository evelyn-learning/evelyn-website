/**
 * SAT Math — Additional Topics.
 *
 * Geometry, right triangle trig, complex numbers, circles.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_ADDITIONAL_TOPICS: LessonPlan = {
  id: 'evelyn.sat.math.additional-topics.v1',
  title: 'SAT Math — Additional Topics',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [
    {
      id: 'sat.additional-topics',
      description: 'Apply geometry, right triangle trigonometry, and basic complex-number operations to SAT Additional Topics questions.',
      standard: 'SAT-MATH-AT',
    },
  ],
  prerequisites: ['sat.heart-of-algebra'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Additional Topics is small (~6 questions) but high leverage.',
      script: 'About 6 questions on each SAT come from "Additional Topics" — geometry, trig, and complex numbers. They\'re a small slice but easy points if you know a handful of formulas: Pythagorean, area of common shapes, sine/cosine of right triangles, the unit circle basics, i² = −1. Master these and you don\'t leave 6 free points.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Geometry formulas, right-triangle trig, complex number rules.',
      keyIdeas: [
        'PYTHAGOREAN: a² + b² = c² (right triangle, c is hypotenuse). Memorize triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25.',
        'SPECIAL TRIANGLES: 30-60-90 has sides 1, √3, 2 (opposite 30, 60, 90). 45-45-90 has sides 1, 1, √2.',
        'RIGHT TRIANGLE TRIG: SOH-CAH-TOA. sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj.',
        'CIRCLES: area = πr². Circumference = 2πr. Equation (x − h)² + (y − k)² = r² (center (h, k), radius r).',
        'ARC LENGTH = (θ/360°) · 2πr (θ in degrees), or arc length = rθ (θ in radians).',
        'AREA OF COMMON SHAPES: triangle = (1/2)·b·h. Trapezoid = (1/2)(b₁ + b₂)·h. Parallelogram = b·h.',
        'COMPLEX NUMBERS: i² = −1. (a + bi)(c + di) = ac + adi + bci + bdi² = (ac − bd) + (ad + bc)i. To divide, multiply by conjugate: (a + bi)/(c + di) · (c − di)/(c − di).',
        'COFUNCTION IDENTITY: sin θ = cos(90° − θ). Useful when SAT gives sin and asks for cos of complement.',
        'GIVEN ON SAT formula sheet: areas of rectangle, triangle, circle, sphere, cylinder, cube, cone. Memorize what\'s NOT on the sheet — sine, cosine, special triangle ratios.',
      ],
      vocabulary: [
        { term: 'hypotenuse', definition: 'the longest side of a right triangle, opposite the right angle.' },
        { term: 'conjugate (complex)', definition: 'for a + bi, the conjugate is a − bi; multiplying gives a real result a² + b².' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trig',
      kind: 'worked_example',
      problem: 'In a right triangle, sin θ = 3/5. Find cos θ and tan θ. Assume θ is acute.',
      steps: [
        'sin θ = opposite / hypotenuse = 3/5. So opposite = 3, hypotenuse = 5.',
        'Find adjacent via Pythagorean: adj² + 3² = 5² → adj² = 16 → adj = 4. (3-4-5 triangle.)',
        'cos θ = adj / hyp = 4/5.',
        'tan θ = opp / adj = 3/4.',
        'Quick recognition: anytime you see 3/5 in trig, suspect a 3-4-5 triangle. Same for 5/13, 12/13 (5-12-13 triangle).',
      ],
      answer: 'cos θ = 4/5, tan θ = 3/4',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify (3 + 2i)(1 − i).',
      expectedAnswer: '5 − i',
      responseFormat: 'free',
      hints: [
        'FOIL: (3)(1) + (3)(−i) + (2i)(1) + (2i)(−i).',
        'Combine: 3 − 3i + 2i − 2i². Use i² = −1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-formula-sheet',
      kind: 'misconception_check',
      question: 'Are sine, cosine, and tangent values given on the SAT formula sheet?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Assuming everything is on the formula sheet.',
          correctsTo: 'No. The SAT formula sheet has area / volume formulas (rectangle, triangle, circle, sphere, cylinder, cube, cone) and the relationship 30-60-90 and 45-45-90 special triangle ratios. SOH-CAH-TOA, the unit circle, and most trig values are NOT on the sheet — memorize them. The sheet only saves you on geometry formulas, not trig identities.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pythagorean triples: 3-4-5, 5-12-13. Special triangles: 30-60-90 and 45-45-90.',
        'SOH-CAH-TOA + cofunction sin θ = cos(90° − θ).',
        'Circle equation: (x − h)² + (y − k)² = r².',
        'i² = −1. Multiply by conjugate to divide complex numbers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'The equation x² + y² − 6x + 4y − 12 = 0 represents a circle. Find its center and radius.',
      hint: 'Complete the square in x: x² − 6x = (x − 3)² − 9. In y: y² + 4y = (y + 2)² − 4. Combined: (x − 3)² − 9 + (y + 2)² − 4 − 12 = 0 → (x − 3)² + (y + 2)² = 25. Center (3, −2), radius 5.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
