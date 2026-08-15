/**
 * GCSE Math Higher — Vectors.
 * Column-vector arithmetic, magnitude, parallel/collinear proofs,
 * vector geometry in triangles and parallelograms.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_VECTORS: LessonPlan = {
  id: 'evelyn.gcse.math.vectors.v1',
  title: 'GCSE Higher — Vectors & Vector Geometry',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.vectors',
      description: 'Manipulate column vectors; apply vector reasoning to prove parallel, collinear, and ratio results in geometric figures.',
      standard: 'GCSE-MATH-G24/G25',
    },
  ],
  prerequisites: ['gcse.math.circle-theorems'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Vector geometry is one of the highest-weighted Higher topics — but the actual algebra is just column arithmetic.',
      script: 'Vector questions look intimidating because they hide as proofs. "Show that PQ is parallel to RS." "Show that A, B, C are collinear." Once you know the two key tests — scalar multiple for parallel, common starting point for collinear — these questions become recipes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-vectors',
      kind: 'concept',
      goal: 'Column-vector arithmetic, magnitude, and the parallel/collinear tests.',
      keyIdeas: [
        'COLUMN VECTOR: a = (x, y) where x is horizontal, y is vertical. Direction matters: AB and BA are negatives of each other.',
        'ADDITION/SUBTRACTION: (x₁, y₁) ± (x₂, y₂) = (x₁ ± x₂, y₁ ± y₂). Geometrically: tip-to-tail.',
        'SCALAR MULTIPLICATION: k(x, y) = (kx, ky). Same direction if k > 0, reversed if k < 0, longer if |k| > 1.',
        'MAGNITUDE: |a| = √(x² + y²). Pythagoras applied to the components.',
        'PARALLEL TEST: vectors a and b are parallel ⟺ a = kb for some scalar k. (Equivalently, components are proportional.)',
        'COLLINEAR TEST: points A, B, C are collinear ⟺ AB and AC are parallel AND share point A. So show AC = k·AB for some scalar k.',
        'GEOMETRIC SHORTCUT (triangles): position vectors a = OA, b = OB. Then AB = b − a. Midpoint of AB has position vector (a + b)/2.',
        'PARALLELOGRAM RULE: in parallelogram OABC, OB = OA + AB = OA + OC. Diagonals: OB = a + c, AC = c − a.',
      ],
      vocabulary: [
        { term: 'magnitude', definition: 'the length of a vector: |a| = √(x² + y²).' },
        { term: 'collinear', definition: 'three or more points lying on the same straight line.' },
        { term: 'position vector', definition: 'the vector from the origin (or fixed reference point) to a given point.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-collinear',
      kind: 'worked_example',
      problem: 'Position vectors: A = (1, 2), B = (4, 5), C = (10, 11). Show A, B, C are collinear.',
      steps: [
        'Compute AB = B − A = (4−1, 5−2) = (3, 3).',
        'Compute AC = C − A = (10−1, 11−2) = (9, 9).',
        'Check if AC is a scalar multiple of AB: AC = (9, 9) = 3·(3, 3) = 3·AB. ✓',
        'Since AC = 3·AB, vectors AC and AB are parallel — and they share point A. So A, B, C lie on the same straight line.',
        'OBSERVATION: B is one-third of the way from A to C (since AB = (1/3)AC).',
      ],
      answer: 'AC = 3·AB, so A, B, C are collinear.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'a = (3, −4). Find |a|.',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: [
        '|a| = √(x² + y²).',
        '√(9 + 16) = √25.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-direction',
      kind: 'misconception_check',
      question: 'A student writes AB = OA + OB. What\'s wrong?',
      commonErrors: [
        {
          answer: 'AB = OA + OB',
          misconception: 'Treating the AB notation like an addition rather than a "from-to" displacement.',
          correctsTo: 'The vector from A to B is the displacement B − A, written AB = OB − OA (NOT OA + OB). Mnemonic: to get from A to B, you first go BACK from A to the origin (−OA = AO), then forward from origin to B (OB). So AB = AO + OB = OB − OA. The "to" point comes FIRST in the subtraction.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AB = B − A (to-point minus from-point).',
        '|a| = √(x² + y²) — Pythagoras on components.',
        'Parallel test: a = kb for scalar k. Collinear test: parallel + shared point.',
        'Midpoint of AB has position (a + b)/2.',
        'In any vector proof, label EVERY step with its reasoning (otherwise lose marks).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In triangle OAB, M is the midpoint of OA and N is the midpoint of OB. Show that MN is parallel to AB and half its length.',
      hint: 'Position vectors: M = a/2, N = b/2. Vector MN = N − M = b/2 − a/2 = (1/2)(b − a) = (1/2)AB. So MN = (1/2)AB → parallel (scalar multiple) AND half the length. This is the midpoint theorem proven by vectors.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
