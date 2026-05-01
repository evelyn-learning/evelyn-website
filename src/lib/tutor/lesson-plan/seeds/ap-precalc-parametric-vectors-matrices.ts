/**
 * AP Pre-Calculus — Unit 4: Functions Involving Parameters, Vectors, and Matrices.
 *
 * NOT assessed on the AP Exam — this unit is included by College Board for
 * state / local curriculum alignment but exam content is drawn only from
 * Units 1-3. Still useful for students continuing to AP Calc BC or
 * Linear Algebra. Aligned with the 2025-26 College Board CED.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PRECALC_PARAMETRIC_VECTORS_MATRICES: LessonPlan = {
  id: 'evelyn.ap.precalc.parametric-vectors-matrices.v1',
  title: 'Parametric, Vectors, and Matrices',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'math',
  topic: 'ap-precalculus',
  locale: 'en',
  los: [
    {
      id: 'apprecalc.parametric-vectors-matrices',
      description: 'Work with parametric equations, perform vector operations (addition, scalar multiplication, dot product), and manipulate 2x2 matrices including multiplication and applying them as linear transformations.',
      standard: 'AP-PRECALC-4',
    },
  ],
  prerequisites: ['apprecalc.trigonometric-polar'],
  followUps: ['math.linear-algebra'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Three different ways to describe motion or transformation.',
      script: 'Unit 4 isn\'t on the AP exam, but it\'s the bridge to college calculus and linear algebra. Three new tools: parametric equations describe motion as a function of TIME (where x and y both depend on t); vectors describe displacement and force with both magnitude and direction; matrices apply transformations to whole shapes at once. If you go on to AP Calc BC, physics, or computer graphics, you\'ll meet all three again — the language starts here.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Parametric, vectors, matrices, basic transformations.',
      keyIdeas: [
        'PARAMETRIC EQUATIONS: x = f(t), y = g(t). t is a parameter (often time). The point (x(t), y(t)) traces a curve as t increases.',
        'EXAMPLE: x = cos t, y = sin t traces the unit circle (1 full loop per t-interval of 2π). x = t, y = t² traces a parabola.',
        'ELIMINATING THE PARAMETER: solve one equation for t, substitute into the other, get y as a function of x. Useful but loses the time-information about HOW fast the curve is traced.',
        'VECTORS: a vector ⟨a, b⟩ has both magnitude (length) and direction. ADD by components: ⟨a, b⟩ + ⟨c, d⟩ = ⟨a+c, b+d⟩. SCALAR MULTIPLY: k·⟨a, b⟩ = ⟨ka, kb⟩.',
        'MAGNITUDE: |⟨a, b⟩| = √(a² + b²). DIRECTION (angle): tan θ = b/a (with quadrant care).',
        'DOT PRODUCT: ⟨a, b⟩ · ⟨c, d⟩ = ac + bd. Useful: u · v = |u||v|cos θ. Two vectors are PERPENDICULAR iff their dot product is zero.',
        'MATRICES: rectangular grid of numbers. AP Pre-Calc focuses on 2×2. ADD: entry-wise. MULTIPLY by scalar: every entry × scalar.',
        'MATRIX MULTIPLICATION (2×2 × 2×1): the matrix [[a,b],[c,d]] times the vector [x; y] gives [ax+by; cx+dy]. The matrix transforms the vector.',
        'COMMON 2×2 TRANSFORMS: rotation by θ has matrix [[cos θ, −sin θ],[sin θ, cos θ]]. Scaling by k: [[k, 0],[0, k]]. Reflection across x-axis: [[1, 0],[0, −1]]. Identity: [[1, 0],[0, 1]] (does nothing).',
        'DETERMINANT (2×2): det([[a,b],[c,d]]) = ad − bc. Tells you the signed area scaling factor of the transformation. det = 0 means the matrix collapses 2D to 1D (not invertible).',
      ],
      vocabulary: [
        { term: 'parametric equation', definition: 'a curve described by x = f(t), y = g(t) where t is a parameter.' },
        { term: 'vector', definition: 'a quantity with both magnitude and direction; in 2D, written ⟨a, b⟩.' },
        { term: 'dot product', definition: 'u · v = u₁v₁ + u₂v₂; equals |u||v|cos θ; zero iff vectors are perpendicular.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-eliminate',
      kind: 'worked_example',
      problem: 'Given x = 2 + cos t, y = 3 + sin t, eliminate the parameter and identify the curve.',
      steps: [
        'Isolate cos t and sin t: cos t = x − 2, sin t = y − 3.',
        'Use Pythagorean identity: cos²t + sin²t = 1.',
        '(x − 2)² + (y − 3)² = 1.',
        'This is a CIRCLE of radius 1 centered at (2, 3).',
        'PARAMETRIC INTERPRETATION: as t goes from 0 to 2π, the point traces this circle once counterclockwise.',
      ],
      answer: 'Circle of radius 1 centered at (2, 3). Equation: (x − 2)² + (y − 3)² = 1.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute the dot product of u = ⟨3, −2⟩ and v = ⟨4, 6⟩. Are these vectors perpendicular?',
      expectedAnswer: 'u·v = 0; yes, perpendicular',
      responseFormat: 'free',
      hints: [
        'Dot product: u₁v₁ + u₂v₂ = 3·4 + (−2)·6.',
        '12 − 12 = 0. Zero dot product → perpendicular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-matrix-mult',
      kind: 'misconception_check',
      question: 'For matrices A and B, is A·B always equal to B·A?',
      commonErrors: [
        {
          answer: 'yes — multiplication is commutative',
          misconception: 'Importing the commutativity of regular number multiplication.',
          correctsTo: 'No — matrix multiplication is generally NOT commutative. A·B ≠ B·A in most cases. The order matters because you\'re composing transformations: rotating then scaling gives a different result from scaling then rotating, in general. This is one of the biggest jumps from algebra of numbers to algebra of matrices. The College Board Unit 4 puts this directly in worked examples.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parametric: (x(t), y(t)) traces a curve as t varies.',
        'Vectors: add componentwise, scale by multiplying components, dot = sum of products.',
        '2×2 matrix × 2-vector: [[a,b],[c,d]]·[x;y] = [ax+by; cx+dy]. Rotation matrix uses cos/sin.',
        'Matrix multiplication is NOT commutative. det(2×2) = ad − bc.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 90° counterclockwise rotation has the matrix R = [[0, −1],[1, 0]]. Apply R to the vector ⟨3, 4⟩. Verify the result has the same length but rotated.',
      hint: 'R · ⟨3, 4⟩ = [0·3 + (−1)·4; 1·3 + 0·4] = ⟨−4, 3⟩. Length: √(9+16) = 5 (original) and √(16+9) = 5 (rotated). ✓ Rotation preserves length, just changes direction.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
