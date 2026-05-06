/**
 * College Linear Algebra — Row Reduction & Solving Systems.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_LINALG_ROW_REDUCTION: LessonPlan = {
  id: 'evelyn.college.math.linalg.row-reduction.v1',
  title: 'Linear Algebra — Row Reduction (Gauss-Jordan)',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'linear-algebra',
  locale: 'en',
  los: [
    {
      id: 'college.math.linalg.row-reduction',
      description: 'Use Gaussian / Gauss-Jordan elimination to solve linear systems and recognise consistent / inconsistent / parametric outcomes.',
      standard: 'COLLEGE-LINALG',
    },
  ],
  prerequisites: ['college.math.linear-algebra'],
  followUps: ['college.math.linalg.eigenvalues'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Row reduction is the workhorse algorithm of linear algebra — it solves systems, finds inverses, computes ranks.',
      script: 'Substitution and elimination scale poorly. For a 5×5 system you need a ROUTINE. Gauss-Jordan elimination (row reduction) gives you that routine. Same three operations, applied mechanically until the matrix is in reduced row-echelon form. Once you have RREF, the solution is read off directly.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-row-reduction',
      kind: 'concept',
      goal: 'Augmented matrix, three row operations, RREF, interpreting outcomes.',
      keyIdeas: [
        'AUGMENTED MATRIX: write Ax = b as the matrix [A | b]. The vertical bar separates coefficients from constants.',
        'THREE ELEMENTARY ROW OPERATIONS (each preserves the solution set):',
        '  1. SWAP two rows.',
        '  2. SCALE a row by a nonzero constant.',
        '  3. ADD a multiple of one row to another.',
        'GOAL: reduce to ROW-ECHELON FORM (REF), and ideally REDUCED ROW-ECHELON FORM (RREF).',
        'REF properties: leading entries (pivots) move strictly down-and-right; rows of all zeros at the bottom.',
        'RREF additionally: each pivot is 1, and every column with a pivot has zeros above and below the pivot.',
        'OUTCOMES of RREF on [A | b]:',
        '  Row 0 ... 0 | c (with c ≠ 0): INCONSISTENT (no solution). The system is contradictory.',
        '  Pivot in every column of A: UNIQUE solution. Read x_i directly from the augmented column.',
        '  Some columns of A have no pivot: INFINITELY MANY solutions. Free variables are set as parameters; basic variables solve in terms of them.',
        'STRATEGY: work column by column from left, top to bottom. Get a pivot, clear above and below it.',
      ],
      vocabulary: [
        { term: 'pivot', definition: 'the first nonzero entry of a row in row-echelon form; pivots determine basic vs free variables.' },
        { term: 'free variable', definition: 'a variable corresponding to a pivot-less column; can take any value, parameterising the solution set.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve the system using row reduction: x + 2y + z = 4, 2x + y − z = 1, 3x + y + 2z = 7.',
      steps: [
        'Augmented matrix: [[1, 2, 1, 4], [2, 1, −1, 1], [3, 1, 2, 7]].',
        'R2 → R2 − 2R1: [1, 2, 1, 4], [0, −3, −3, −7], [3, 1, 2, 7].',
        'R3 → R3 − 3R1: [1, 2, 1, 4], [0, −3, −3, −7], [0, −5, −1, −5].',
        'R2 → R2 / (−3): [1, 2, 1, 4], [0, 1, 1, 7/3], [0, −5, −1, −5].',
        'R3 → R3 + 5R2: [1, 2, 1, 4], [0, 1, 1, 7/3], [0, 0, 4, 35/3 − 5] = [0, 0, 4, 20/3].',
        'R3 → R3 / 4: [1, 2, 1, 4], [0, 1, 1, 7/3], [0, 0, 1, 5/3].',
        'Back-substitute (or continue to RREF). z = 5/3. y + z = 7/3 ⟹ y = 7/3 − 5/3 = 2/3. x + 2y + z = 4 ⟹ x = 4 − 4/3 − 5/3 = 4 − 9/3 = 1.',
        'Solution: (x, y, z) = (1, 2/3, 5/3).',
      ],
      answer: '(1, 2/3, 5/3)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Without solving fully, identify the type of solution set: the RREF of an augmented matrix is [[1, 0, 2, 3], [0, 1, −1, 4], [0, 0, 0, 0]].',
      expectedAnswer: 'Last row is all zeros — no contradiction. The third column (z) has no pivot, so z is FREE. Two pivots, three variables, no inconsistency ⟹ INFINITELY MANY SOLUTIONS, parameterised by z. Basic variables: x = 3 − 2z, y = 4 + z. Solution set: (x, y, z) = (3 − 2t, 4 + t, t) for any t ∈ ℝ.',
      responseFormat: 'free',
      hints: [
        'Check the last row for inconsistency (e.g. 0 = nonzero).',
        'Count pivots vs variables: equal → unique; fewer → free variables → infinite.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-pivot-no-zero',
      kind: 'misconception_check',
      question: 'A student forgets to clear ABOVE the pivot when reducing to RREF. Why does that matter?',
      commonErrors: [
        {
          answer: 'Skips clearing above pivot',
          misconception: 'Confusing REF (only zeros below pivots) with RREF (zeros above and below).',
          correctsTo: 'In REF, you only need zeros BELOW each pivot. In RREF, you need zeros BOTH above AND below. RREF is what lets you read solutions directly off the augmented column without back-substitution. If the matrix is only in REF, you still have to back-substitute. Both approaches work — but mixing them up causes errors. Decide upfront which form you\'re targeting and execute consistently.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three row ops: swap, scale, add-multiple — preserve solution set.',
        'Reduce to RREF: pivots are 1, zeros above and below each pivot.',
        'Outcomes: inconsistent (0 = nonzero), unique (pivot in every variable column), infinite (free variables).',
        'Free variables parameterise the solution set.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
