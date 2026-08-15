/**
 * JEE Math — Matrices and Determinants.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MATH_MATRICES_DETERMINANTS: LessonPlan = {
  id: 'evelyn.jee.math.matrices-determinants.v1',
  title: 'JEE Math — Matrices and Determinants',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-math',
  locale: 'en',
  los: [{ id: 'jee.math.matrices-determinants', description: 'Apply matrix operations, find inverse, compute determinants, solve systems via Cramer\'s rule, apply key matrix theorems.', standard: 'JEE-MATH-MATRICES' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Matrices on JEE are formula-heavy but fast — learn the rules and compute on autopilot.', script: 'Matrix arithmetic, determinants, inverse, Cramer\'s rule — JEE expects you to manipulate 2×2 and 3×3 matrices fluently. Today the rules + the key theorems.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Operations, determinant, inverse, key theorems.', keyIdeas: [
      'MATRIX OPERATIONS:',
      '  Add/subtract: same dimensions; element-wise.',
      '  Scalar multiplication: multiply every element.',
      '  MATRIX MULTIPLY (m×n)(n×p) = (m×p): inner dimensions must match. Element (i,j) = sum of row i × column j.',
      'DETERMINANT (square matrices only):',
      '  2×2: det[[a,b],[c,d]] = ad − bc.',
      '  3×3: cofactor expansion along any row/column.',
      '  Properties: |AB| = |A||B|; |Aᵀ| = |A|; |kA| = kⁿ|A| for n×n; row swap flips sign.',
      'INVERSE: A⁻¹ = (1/|A|) · adj(A), where adj is the transpose of cofactor matrix.',
      '  A is invertible ⟺ |A| ≠ 0.',
      '  AA⁻¹ = A⁻¹A = I.',
      'SYSTEMS via Cramer\'s rule (n equations in n unknowns):',
      '  xᵢ = |Dᵢ|/|D|, where Dᵢ is D with column i replaced by RHS.',
      '  Works only if |D| ≠ 0.',
      '  If |D| = 0: either no solution (inconsistent) or infinitely many.',
      'KEY THEOREMS:',
      '  CAYLEY-HAMILTON: every matrix satisfies its characteristic equation.',
      '  RANK = number of linearly independent rows/columns.',
      '  ORTHOGONAL matrix: AAᵀ = I; rows form orthonormal basis.',
      '  SYMMETRIC: A = Aᵀ. SKEW-SYMMETRIC: A = −Aᵀ (diagonal must be 0).',
      'COMMON JEE patterns: prove a matrix relation, find values for which a system has unique solution, expansion of large determinants using row/column operations.',
    ], vocabulary: [{ term: 'determinant', definition: 'a scalar associated with a square matrix; non-zero ⟺ invertible.' }, { term: 'Cramer\'s rule', definition: 'solves Ax = b via determinants: xᵢ = det(Aᵢ)/det(A).' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'Find the inverse of A = [[2, 1], [1, 3]].', steps: [
      'det(A) = (2)(3) − (1)(1) = 6 − 1 = 5.',
      'For 2×2 [[a,b],[c,d]], inverse is (1/det)·[[d,−b],[−c,a]].',
      'A⁻¹ = (1/5)·[[3, −1], [−1, 2]] = [[3/5, −1/5], [−1/5, 2/5]].',
      'Verify: A·A⁻¹ = [[2,1],[1,3]] × [[3/5,−1/5],[−1/5,2/5]] = [[1,0],[0,1]] = I. ✓',
    ], answer: 'A⁻¹ = (1/5)[[3,−1],[−1,2]]', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Use Cramer\'s rule to solve: 2x + y = 5, x + 3y = 10.', expectedAnswer: 'D = |[[2,1],[1,3]]| = 5. D₁ (replace x-column): |[[5,1],[10,3]]| = 15 − 10 = 5. D₂: |[[2,5],[1,10]]| = 20 − 5 = 15. x = D₁/D = 1, y = D₂/D = 3. Check: 2(1) + 3 = 5 ✓; 1 + 3(3) = 10 ✓.', responseFormat: 'free', hints: ['Compute D first.', 'Replace each column in turn for D₁, D₂.'], estimatedMinutes: 4 },
    { id: 'misconception-mat-mult-comm', kind: 'misconception_check', question: 'A student claims AB = BA for matrices. What\'s wrong?', commonErrors: [{ answer: 'AB = BA', misconception: 'Importing scalar multiplication\'s commutativity into matrix multiplication.', correctsTo: 'Matrix multiplication is NOT commutative in general. AB ≠ BA in most cases. Even when both products exist, they\'re usually different. Special cases that DO commute: identity (AI = IA), inverse (AA⁻¹ = A⁻¹A), or when one is a scalar multiple of identity. Always: don\'t assume commutativity for matrices.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['det 2×2 = ad−bc.', 'A⁻¹ exists ⟺ |A| ≠ 0.', 'Cramer: xᵢ = |Dᵢ|/|D|.', 'AB ≠ BA in general.', '|AB| = |A||B|.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
