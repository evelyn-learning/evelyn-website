/**
 * GRE Quant — Lines, Angles, Triangles.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_LINES_ANGLES_TRIANGLES: LessonPlan = {
  id: 'evelyn.gre.q.lines-angles-triangles.v1',
  title: 'GRE Quant — Lines, Angles, Triangles',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.lines-angles-triangles',
      description: 'Apply angle relationships, triangle properties, and special right-triangle ratios to GRE geometry questions.',
      standard: 'GRE-Q-GEOM-LAT',
    },
  ],
  prerequisites: ['gre.q.coordinate-geometry'],
  followUps: ['gre.q.quadrilaterals'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Triangles are by far the most-tested figure on GRE — knowing the special-triangle ratios is worth multiple points.',
      script: 'Almost every GRE figure is a triangle, or contains one. The 30-60-90 and 45-45-90 special ratios skip you past calculator work. The triangle inequality, the angle-sum property, and similarity criteria handle the rest.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-triangles',
      kind: 'concept',
      goal: 'Angle facts + triangle properties + special triangles + similarity.',
      keyIdeas: [
        'ANGLE SUM in triangle = 180°. In quadrilateral = 360°.',
        'EXTERIOR ANGLE of triangle = sum of two non-adjacent interior angles.',
        'PARALLEL LINES + transversal: corresponding equal, alternate interior equal, co-interior sum 180°.',
        'TRIANGLE INEQUALITY: sum of any two sides > third side.',
        'PYTHAGOREAN: a² + b² = c² for right triangle. Common Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25.',
        'SPECIAL RIGHT TRIANGLES: 30-60-90 sides in ratio 1 : √3 : 2. 45-45-90 sides in ratio 1 : 1 : √2.',
        'ISOSCELES: two equal sides → two equal base angles. EQUILATERAL: all 60°.',
        'SIMILARITY: AA criterion — two equal angles → similar. Sides in proportion. Areas in proportion of squared linear ratio.',
        'AREA: (1/2)·base·height. For SAS: (1/2)ab·sin C. Heron\'s formula rarely needed on GRE.',
      ],
      vocabulary: [
        { term: 'similar triangles', definition: 'triangles with equal corresponding angles and proportional corresponding sides.' },
        { term: 'transversal', definition: 'a line that crosses two or more other lines.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-special-triangle',
      kind: 'worked_example',
      problem: 'In a 30-60-90 triangle, the side opposite the 60° angle is 6√3. Find the other two sides.',
      steps: [
        'Ratio is 1 (opp 30°) : √3 (opp 60°) : 2 (hypotenuse, opp 90°).',
        'Side opposite 60° = √3·k = 6√3 → k = 6.',
        'Side opposite 30° = k = 6.',
        'Hypotenuse = 2k = 12.',
        'CHECK: 6² + (6√3)² = 36 + 108 = 144 = 12². ✓',
      ],
      answer: 'Side opp 30° = 6; hypotenuse = 12',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A triangle has sides 5, 6, x. List the integer values x can take.',
      expectedAnswer: '2, 3, 4, 5, 6, 7, 8, 9, 10',
      responseFormat: 'free',
      hints: [
        'Triangle inequality: |5 − 6| < x < 5 + 6 → 1 < x < 11.',
        'Integer values: 2, 3, 4, 5, 6, 7, 8, 9, 10.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-similar-areas',
      kind: 'misconception_check',
      question: 'Two similar triangles have sides in ratio 2:3. A student says their areas are also in ratio 2:3. Correct?',
      commonErrors: [
        {
          answer: 'Areas in ratio 2:3',
          misconception: 'Forgetting that area scales with the SQUARE of linear scale factor.',
          correctsTo: 'Linear ratio 2:3 means area ratio 2²:3² = 4:9 (squared) and volume ratio 2³:3³ = 8:27 (cubed). The general rule: ratios of similar figures: linear = k, area = k², volume = k³.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Triangle angles sum to 180°.',
        'Triangle inequality: third side strictly between |a − b| and a + b.',
        '30-60-90: 1 : √3 : 2. 45-45-90: 1 : 1 : √2.',
        'Pythagorean triples: 3-4-5, 5-12-13, 8-15-17.',
        'Similar triangles: linear k, area k², volume k³.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A square has diagonal 10. Find the area.',
      hint: 'Diagonal = side·√2 → side = 10/√2 = 5√2. Area = side² = 50.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
