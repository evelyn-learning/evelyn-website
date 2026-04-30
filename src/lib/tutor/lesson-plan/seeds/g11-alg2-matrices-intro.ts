/**
 * G11 — Matrices intro.
 *
 * What a matrix is, addition/subtraction, scalar multiplication.
 * Matrix-vector intuition. Stops short of full matrix multiply
 * (separate lesson if needed).
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_MATRICES_INTRO: LessonPlan = {
  id: 'evelyn.g11.alg2.matrices-intro.v1',
  title: 'Matrices: rows, columns, addition, scalar multiply',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'algebra-2',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsn-vm.c.6',
      description: 'Use matrices to represent and manipulate data.',
      standard: 'CCSS.MATH.CONTENT.HSN.VM.C.6',
    },
    {
      id: 'ccss.math.hsn-vm.c.7',
      description: 'Multiply matrices by scalars to produce new matrices.',
      standard: 'CCSS.MATH.CONTENT.HSN.VM.C.7',
    },
  ],
  prerequisites: ['ccss.math.hsa-rei.c.6'],
  followUps: ['ccss.math.hsn-vm.c.9'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a matrix as a way to organize data — like a spreadsheet.',
      script: 'A store tracks sales of 3 products at 2 locations. That\'s 6 numbers in a 2-by-3 grid. We just made a matrix without trying.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-matrix-basics',
      kind: 'concept',
      goal: 'A matrix is a rectangular array; its dimensions and operations follow simple rules.',
      keyIdeas: [
        'A MATRIX is a rectangular array of numbers, arranged in rows and columns.',
        'DIMENSIONS: rows × columns. A 2×3 matrix has 2 rows and 3 columns.',
        'Each number is an ENTRY, located by its (row, column) position.',
        'ADDITION/SUBTRACTION: only works for SAME-SIZED matrices. Add corresponding entries.',
        'SCALAR MULTIPLY: multiply every entry by the same number. 3·[a b; c d] = [3a 3b; 3c 3d].',
        'You CANNOT add a 2×3 to a 3×2 — sizes must match.',
      ],
      vocabulary: [
        { term: 'matrix', definition: 'a rectangular array of numbers in rows and columns.' },
        { term: 'scalar', definition: 'a single number (not a matrix), used to scale all entries.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-add',
      kind: 'worked_example',
      problem: 'Add A + B where A = [[1, 2], [3, 4]] and B = [[5, 0], [-1, 6]].',
      steps: [
        'Both are 2×2 → can add.',
        'Add corresponding entries: top-left 1+5=6, top-right 2+0=2, bottom-left 3+(-1)=2, bottom-right 4+6=10.',
        'Result: [[6, 2], [2, 10]].',
      ],
      answer: '[[6, 2], [2, 10]]',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scalar',
      kind: 'worked_example',
      problem: 'Compute 3·A where A = [[2, -1], [4, 5]].',
      steps: [
        'Multiply EVERY entry by 3.',
        'Top-left 6, top-right -3, bottom-left 12, bottom-right 15.',
        'Result: [[6, -3], [12, 15]].',
      ],
      answer: '[[6, -3], [12, 15]]',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute A - B where A = [[4, 7], [2, 1]] and B = [[1, 3], [5, 0]].',
      expectedAnswer: '[[3, 4], [-3, 1]]',
      responseFormat: 'free',
      hints: [
        'Both 2×2 — subtract corresponding entries.',
        '4-1, 7-3, 2-5, 1-0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-different-sizes',
      kind: 'misconception_check',
      question: 'Can you add a 2×3 matrix to a 3×2 matrix?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating any two matrices as addable.',
          correctsTo: 'No — you can only ADD matrices of the SAME dimensions. 2×3 + 2×3 works. 2×3 + 3×2 does NOT.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A matrix is a rectangular array — m rows × n columns.',
        'Add/subtract matrices of the SAME size, entry by entry.',
        'Scalar multiply: multiply every entry by the scalar.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is matrix MULTIPLICATION more complicated than addition? What rule connects sizes?',
      hint: 'For A·B, A\'s number of columns must equal B\'s number of rows. The result is (rows of A)×(columns of B).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
