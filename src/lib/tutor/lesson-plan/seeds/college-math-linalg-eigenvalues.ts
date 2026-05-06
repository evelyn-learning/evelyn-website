/**
 * College Linear Algebra — Eigenvalues and Eigenvectors.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_LINALG_EIGENVALUES: LessonPlan = {
  id: 'evelyn.college.math.linalg.eigenvalues.v1',
  title: 'Linear Algebra — Eigenvalues and Eigenvectors',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'linear-algebra',
  locale: 'en',
  los: [
    {
      id: 'college.math.linalg.eigenvalues',
      description: 'Compute eigenvalues from the characteristic polynomial and find eigenvectors by solving (A − λI)v = 0.',
      standard: 'COLLEGE-LINALG',
    },
  ],
  prerequisites: ['college.math.linalg.row-reduction'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Eigenvectors are the directions a matrix only stretches — they reveal the underlying structure of the transformation.',
      script: 'For most input vectors, multiplying by a matrix A moves AND rotates them. But for SOME special vectors, A only stretches them — no rotation. Those are eigenvectors. The stretch factor is the eigenvalue. Once you find them, you understand what the matrix really does.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-eigen',
      kind: 'concept',
      goal: 'Definition, characteristic polynomial, finding eigenvectors, multiplicities, geometric meaning.',
      keyIdeas: [
        'DEFINITION: a nonzero vector v is an EIGENVECTOR of A with EIGENVALUE λ if Av = λv.',
        '  Geometrically: A stretches v by factor λ, doesn\'t rotate it.',
        'CHARACTERISTIC POLYNOMIAL: det(A − λI) = 0. Solving gives the eigenvalues.',
        '  For 2×2 matrix [[a, b], [c, d]]: det = (a − λ)(d − λ) − bc = 0. Quadratic in λ.',
        '  For larger matrices: degree-n polynomial; solve by factoring or numerical methods.',
        'FOR EACH EIGENVALUE λ, find eigenvector(s) by solving (A − λI)v = 0. This is row reduction; the solution set (excluding 0) is the EIGENSPACE.',
        'COMPLEX EIGENVALUES are common for non-symmetric real matrices. They come in conjugate pairs and correspond to rotation+scaling.',
        'MULTIPLICITY:',
        '  ALGEBRAIC multiplicity = how many times λ appears as a root of the characteristic polynomial.',
        '  GEOMETRIC multiplicity = dimension of the eigenspace (number of independent eigenvectors).',
        '  Geometric ≤ algebraic, always.',
        'PROPERTIES:',
        '  Sum of eigenvalues = trace(A) (sum of diagonal entries).',
        '  Product of eigenvalues = det(A).',
        '  λ = 0 is an eigenvalue ⟺ det(A) = 0 ⟺ A is non-invertible.',
        'WHY THEY MATTER: PCA, PageRank, dynamical systems, quantum mechanics — many applied problems reduce to "find the eigenvalues / eigenvectors of this matrix."',
      ],
      vocabulary: [
        { term: 'characteristic polynomial', definition: 'det(A − λI), a polynomial in λ whose roots are A\'s eigenvalues.' },
        { term: 'eigenspace', definition: 'the set of all eigenvectors for a given eigenvalue (plus the zero vector); a subspace.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Find the eigenvalues and eigenvectors of A = [[3, 1], [0, 2]].',
      steps: [
        'Characteristic polynomial: det(A − λI) = det([[3 − λ, 1], [0, 2 − λ]]) = (3 − λ)(2 − λ) − 0 = (3 − λ)(2 − λ).',
        'Set to zero: (3 − λ)(2 − λ) = 0 ⟹ λ = 3 or λ = 2.',
        'For λ = 3: solve (A − 3I)v = 0. A − 3I = [[0, 1], [0, −1]]. Equation: y = 0. So v = (x, 0). Eigenvector: (1, 0).',
        'For λ = 2: solve (A − 2I)v = 0. A − 2I = [[1, 1], [0, 0]]. Equation: x + y = 0 ⟹ y = −x. So v = (1, −1).',
        'Verify: A(1, 0)ᵀ = (3, 0)ᵀ = 3(1, 0)ᵀ ✓. A(1, −1)ᵀ = (3·1 + 1·(−1), 0·1 + 2·(−1)) = (2, −2) = 2(1, −1)ᵀ ✓.',
        'Sanity: trace(A) = 3 + 2 = 5 = sum of eigenvalues ✓. det(A) = 3·2 − 0 = 6 = product ✓.',
      ],
      answer: 'λ = 3 with v = (1, 0); λ = 2 with v = (1, −1)',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For the matrix A = [[5, 4], [1, 2]], find the eigenvalues only (no eigenvectors needed).',
      expectedAnswer: 'det(A − λI) = (5 − λ)(2 − λ) − 4 = 10 − 5λ − 2λ + λ² − 4 = λ² − 7λ + 6 = (λ − 6)(λ − 1) = 0. Eigenvalues: λ = 6 and λ = 1. (Sanity: trace = 5+2 = 7 = sum ✓; det = 10 − 4 = 6 = product ✓.)',
      responseFormat: 'free',
      hints: [
        'Compute det(A − λI), set equal to zero, solve for λ.',
        'Check sum/product against trace/det.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-zero-eigvec',
      kind: 'misconception_check',
      question: 'A student claims the zero vector v = 0 is an eigenvector because A·0 = 0 = λ·0 for any λ. Why does this NOT count?',
      commonErrors: [
        {
          answer: 'Zero vector counts as an eigenvector',
          misconception: 'Reading the equation Av = λv literally without the nonzero requirement.',
          correctsTo: 'Eigenvectors are NONZERO by definition. The trivial equation A·0 = λ·0 holds for ANY scalar λ — so if 0 counted as an eigenvector, every scalar would be an eigenvalue, which is meaningless. The DEFINITION requires v ≠ 0. This is why solving (A − λI)v = 0 looks for the NONTRIVIAL null space — we need the matrix (A − λI) to be SINGULAR (det = 0) so it has nonzero null vectors. That singularity is exactly the characteristic-polynomial condition.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Eigenvalues from det(A − λI) = 0; eigenvectors from (A − λI)v = 0.',
        'Eigenvectors are NONZERO by definition.',
        'Sum of eigenvalues = trace; product = det.',
        'λ = 0 ⟺ A is non-invertible.',
        'Eigenvectors reveal the matrix\'s structure — directions only stretched, never rotated.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
