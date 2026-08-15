/**
 * GRE Quant — Quadrilaterals & Polygons.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_QUADRILATERALS: LessonPlan = {
  id: 'evelyn.gre.q.quadrilaterals.v1',
  title: 'GRE Quant — Quadrilaterals & Polygons',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.quadrilaterals',
      description: 'Apply properties and area formulas for squares, rectangles, parallelograms, trapezoids, and regular polygons.',
      standard: 'GRE-Q-GEOM-QUAD',
    },
  ],
  prerequisites: ['gre.q.lines-angles-triangles'],
  followUps: ['gre.q.circles'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Quadrilateral questions on GRE drill area formulas + a few non-obvious facts about parallelograms and trapezoids.',
      script: 'Squares and rectangles are easy. Parallelograms add the "base × height" trap (height ≠ slanted side). Trapezoids need the average-of-bases formula. Add the regular-polygon angle formulas and you have everything GRE will throw.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quads',
      kind: 'concept',
      goal: 'Standard quadrilateral facts and area formulas + polygon angles.',
      keyIdeas: [
        'SQUARE: all sides equal, all angles 90°. Area = s². Diagonal = s√2.',
        'RECTANGLE: opposite sides equal, all angles 90°. Area = lw. Diagonal = √(l² + w²).',
        'PARALLELOGRAM: opposite sides equal AND parallel. Opposite angles equal. Area = base × HEIGHT (perpendicular distance, NOT slanted side).',
        'RHOMBUS: all sides equal (parallelogram). Area = (d₁ · d₂)/2 using diagonals. Diagonals bisect each other at 90°.',
        'TRAPEZOID: one pair of parallel sides. Area = (1/2)·(b₁ + b₂)·h. (Average of parallel sides times height.)',
        'POLYGON ANGLE SUM: (n − 2)·180° for n-sided polygon.',
        'REGULAR POLYGON: each interior angle = (n − 2)·180°/n. Each exterior angle = 360°/n.',
        'GRE TRAP: a "rectangle" is also a parallelogram. A "square" is a rectangle, a rhombus, AND a parallelogram. Inheritance matters when the question asks "must" vs "could".',
      ],
      vocabulary: [
        { term: 'parallelogram', definition: 'a quadrilateral with both pairs of opposite sides parallel.' },
        { term: 'trapezoid', definition: 'a quadrilateral with exactly one pair of parallel sides (US definition).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trapezoid',
      kind: 'worked_example',
      problem: 'A trapezoid has parallel sides of length 8 and 14, and height 5. Find its area.',
      steps: [
        'Area = (1/2)·(b₁ + b₂)·h = (1/2)·(8 + 14)·5 = (1/2)·22·5 = 55.',
      ],
      answer: '55',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A regular hexagon has each side 4. Find each interior angle and the perimeter.',
      expectedAnswer: 'Interior angle = 120°; perimeter = 24',
      responseFormat: 'free',
      hints: [
        'Sum of angles = (6 − 2)·180 = 720°. Each = 720/6 = 120°.',
        'Perimeter = 6 × 4 = 24.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-parallelogram-height',
      kind: 'misconception_check',
      question: 'A parallelogram has sides 6 and 8 and an interior angle 60°. A student writes area = 6·8 = 48. What\'s wrong?',
      commonErrors: [
        {
          answer: 'Area = 48',
          misconception: 'Multiplying the two side lengths instead of base × perpendicular height.',
          correctsTo: 'Area of parallelogram = base × HEIGHT, where height is perpendicular distance between the two base lines (NOT the slanted side). Using the angle: height = 8·sin 60° = 8·(√3/2) = 4√3. Area = 6·4√3 = 24√3 ≈ 41.57. Equivalently, area = (1/2)·d₁·d₂·sin 60° using diagonals, or area = ab·sin C using sides + included angle. Side × side only equals area when angle is 90° (rectangle case).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Square diagonal s√2. Rectangle diagonal √(l² + w²).',
        'Parallelogram area = base × HEIGHT (perpendicular).',
        'Trapezoid area = average of parallel sides × height.',
        'n-gon angle sum = (n − 2)·180°. Regular: each interior = (n−2)180/n.',
        'Inheritance: square ⊂ rectangle, rhombus ⊂ parallelogram.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A regular polygon has each exterior angle 30°. How many sides does it have?',
      hint: 'Sum of exterior angles = 360°. Each = 360/n. So n = 360/30 = 12 (a regular dodecagon).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
