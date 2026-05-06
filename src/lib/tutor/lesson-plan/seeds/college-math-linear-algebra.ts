/**
 * College Intro — Linear Algebra.
 *
 * Anchor plan covering vectors, matrices, linear transformations,
 * and the geometric intuition that ties them together.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_LINEAR_ALGEBRA: LessonPlan = {
  id: 'evelyn.college.math.linear-algebra.v1',
  title: 'Linear Algebra — vectors, matrices, transformations',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'linear-algebra',
  locale: 'en',
  los: [
    {
      id: 'college.math.linear-algebra',
      description: 'Apply vectors, matrices, and linear transformations as geometric objects, not just procedures — and recognise the unifying picture.',
      standard: 'COLLEGE-LINALG',
    },
  ],
  prerequisites: ['g912.math.matrices'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Linear algebra is what makes machine learning, graphics, physics, and engineering computable — but it is taught upside down.',
      script: 'Most courses lead with row reduction and matrix arithmetic, then never tell you what any of it MEANS. The real picture: vectors are arrows, matrices ARE transformations of those arrows, and the entire course is teaching you to see geometry through algebra. Once that picture clicks, everything else is bookkeeping. Today we build that picture.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-linalg',
      kind: 'concept',
      goal: 'Vectors as objects, span, linear combination, matrices as transformations, determinant, eigenvectors.',
      keyIdeas: [
        'A VECTOR is an arrow from the origin in n-dimensional space. Adding vectors = tip-to-tail. Scaling = stretching.',
        'A LINEAR COMBINATION of vectors v₁, ..., vₖ is c₁v₁ + ... + cₖvₖ for scalars cᵢ. The set of all linear combinations is the SPAN.',
        'BASIS = a minimal spanning set. Any basis for ℝⁿ has exactly n vectors. The standard basis for ℝ² is e₁ = (1,0), e₂ = (0,1).',
        'A MATRIX A is a transformation: it sends each input vector v to Av. The columns of A are the images of the standard basis vectors under that transformation.',
        'KEY MENTAL MODEL: to see what a 2×2 matrix DOES, look at where it sends e₁ and e₂. The whole transformation is determined by those two outputs (because every other vector is a linear combination).',
        'MATRIX MULTIPLICATION = COMPOSITION of transformations. (AB)v = A(Bv) — first apply B, then A. That is why matrix multiplication is not commutative: doing rotate-then-scale ≠ scale-then-rotate in general.',
        'DETERMINANT measures how the transformation scales area (in 2D) or volume (in 3D). det = 0 ⟺ the transformation collapses dimension (squishes the plane to a line).',
        'EIGENVECTORS are the rare vectors that the transformation only stretches (does not rotate): Av = λv. The scalar λ is the eigenvalue. They are the "stable directions" of the transformation.',
        'INVERTIBLE ⟺ det ≠ 0 ⟺ no dimension collapse ⟺ the transformation is reversible.',
      ],
      vocabulary: [
        { term: 'span', definition: 'the set of all linear combinations of a given collection of vectors — geometrically, the line/plane/space they reach.' },
        { term: 'eigenvector', definition: 'a non-zero vector v such that Av = λv — a direction the matrix only stretches, never rotates.' },
        { term: 'determinant', definition: 'a scalar measuring how a linear transformation scales signed area/volume; zero iff the transformation is non-invertible.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-transformation',
      kind: 'worked_example',
      problem: 'A = [[2, 1], [0, 3]]. Describe what A does geometrically, find det(A), and decide if A is invertible.',
      steps: [
        'Read the columns: A sends e₁ = (1,0) to (2, 0) and e₂ = (0,1) to (1, 3).',
        'Geometric description: it stretches the x-axis by 2 (e₁ → (2,0)), and shears + stretches e₂ to (1,3).',
        'det(A) = 2·3 − 1·0 = 6. The transformation scales every area by a factor of 6.',
        'Since det(A) = 6 ≠ 0, A is invertible — the transformation is reversible (no dimension collapsed).',
        'Bigger picture: every linear transformation of ℝ² is some combination of stretch / shear / rotation / reflection. The determinant signs tell you reflection (det < 0 means orientation flipped).',
      ],
      answer: 'A stretches + shears, scales area ×6, is invertible.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'B = [[1, 2], [2, 4]]. What is det(B), and what does it tell you about the transformation B?',
      expectedAnswer: 'det(B) = 1·4 − 2·2 = 0. The transformation is non-invertible: B collapses ℝ² down to a line (specifically, the line spanned by (1, 2), since B sends both e₁ and e₂ to scalar multiples of that vector). Geometrically: a flat squish.',
      responseFormat: 'free',
      hints: [
        'det = ad − bc for [[a,b],[c,d]].',
        'det = 0 means the transformation collapses dimension — what does that mean for invertibility?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-mat-mult',
      kind: 'misconception_check',
      question: 'A student computes AB and BA and is surprised they are different — they had assumed multiplication is multiplication. Why is matrix multiplication non-commutative?',
      commonErrors: [
        {
          answer: 'AB should equal BA',
          misconception: 'Importing scalar-multiplication intuition into matrix multiplication.',
          correctsTo: 'Matrix multiplication is COMPOSITION of transformations: (AB)v means "apply B to v, then apply A to the result." Doing A first then B gives BA. In general, rotate-then-scale ≠ scale-then-rotate; reflect-then-shear ≠ shear-then-reflect. Order matters because the second transformation acts on the OUTPUT of the first, which depends on what the first did. Scalar multiplication commutes because there is no geometric "doing" — just multiplying numbers. Matrices encode actions, and actions stack non-commutatively.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Vectors are arrows; matrices are transformations of arrows.',
        'Matrix columns = images of standard basis vectors.',
        'Multiplication = composition: order matters.',
        'det = area-scale factor; det = 0 ⟺ non-invertible ⟺ dimension collapse.',
        'Eigenvectors = stable directions (only stretched, never rotated).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are eigenvectors central to nearly every applied use of linear algebra (PageRank, PCA, quantum mechanics)?',
      hint: 'Most useful systems can be modelled as repeated application of a linear transformation. Iterating a matrix many times sends generic vectors toward its dominant-eigenvalue eigenvector — the "stable direction" of the dynamics. PageRank: the dominant eigenvector of the web link matrix IS the ranking. PCA: eigenvectors of the covariance matrix are the directions of greatest variance. Quantum: eigenvectors of operators are the observable states. Eigenvectors are how repeated linear action produces structure.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
