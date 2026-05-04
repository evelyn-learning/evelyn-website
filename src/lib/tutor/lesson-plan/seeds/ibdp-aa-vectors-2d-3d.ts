/**
 * IB DP Math AA — Vectors in 2D and 3D.
 * Component form, magnitude, dot product, angle between vectors,
 * unit vectors.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_VECTORS_2D_3D: LessonPlan = {
  id: 'evelyn.ibdp.aa.vectors-2d-3d.v1',
  title: 'IB DP Math AA — Vectors in 2D & 3D',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.vectors-2d-3d',
      description: 'Use vector operations in 2D and 3D: addition, scalar multiplication, magnitude, dot product; find the angle between two vectors.',
      standard: 'IB-DP-MATH-AA-3.9/3.10',
    },
  ],
  prerequisites: ['ibdp.aa.trig-id-equations'],
  followUps: ['ibdp.aa.vector-lines-planes'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB AA extends GCSE 2D vectors to 3D, adds the dot product, and uses both for angles, lines, and planes.',
      script: 'GCSE vectors lived in 2D and stopped at parallel/collinear. IB AA adds a third coordinate AND a new operation: the dot product. Once you know that a · b = |a||b|cos θ, every "find the angle" question becomes one substitution.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-vectors',
      kind: 'concept',
      goal: 'Component arithmetic in 3D, magnitude, dot product, angle formula.',
      keyIdeas: [
        'COMPONENT FORM: a = (a₁, a₂, a₃) in 3D. Standard basis vectors i = (1,0,0), j = (0,1,0), k = (0,0,1).',
        'ADDITION/SCALAR MULT: componentwise. (a₁, a₂, a₃) + (b₁, b₂, b₃) = (a₁+b₁, a₂+b₂, a₃+b₃). λ·a = (λa₁, λa₂, λa₃).',
        'MAGNITUDE: |a| = √(a₁² + a₂² + a₃²) — Pythagoras in 3D.',
        'UNIT VECTOR: â = a/|a|. Has magnitude 1 in the same direction.',
        'DOT PRODUCT (scalar product): a · b = a₁b₁ + a₂b₂ + a₃b₃. RESULT IS A SCALAR, not a vector.',
        'GEOMETRIC FORM: a · b = |a||b|cos θ where θ is the angle between the vectors.',
        'ANGLE FROM DOT PRODUCT: cos θ = (a · b) / (|a||b|). Solve for θ.',
        'PERPENDICULAR TEST: a ⊥ b ⟺ a · b = 0 (assuming neither is zero).',
        'PARALLEL TEST: a ∥ b ⟺ a = λb for some scalar λ (componentwise proportional).',
      ],
      vocabulary: [
        { term: 'dot product', definition: 'a · b = a₁b₁ + a₂b₂ + a₃b₃; equals |a||b|cos θ. Outputs a scalar.' },
        { term: 'unit vector', definition: 'a vector of magnitude 1; â = a/|a|.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-angle',
      kind: 'worked_example',
      problem: 'a = (3, 4, 0) and b = (1, 2, 2). Find the angle between a and b in degrees, to 1 d.p.',
      steps: [
        'Compute dot product: a · b = 3·1 + 4·2 + 0·2 = 3 + 8 + 0 = 11.',
        'Compute magnitudes: |a| = √(9 + 16 + 0) = √25 = 5. |b| = √(1 + 4 + 4) = √9 = 3.',
        'cos θ = (a · b)/(|a||b|) = 11/(5·3) = 11/15 ≈ 0.7333.',
        'θ = arccos(11/15) ≈ 42.8°.',
      ],
      answer: 'θ ≈ 42.8°',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find a unit vector in the direction of v = (2, −1, 2).',
      expectedAnswer: '(2/3, −1/3, 2/3)',
      responseFormat: 'free',
      hints: [
        '|v| = √(4 + 1 + 4) = √9 = 3.',
        'Divide each component by |v|.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-dot-vector',
      kind: 'misconception_check',
      question: 'A student computes a · b for a = (1, 2) and b = (3, 4) and writes the answer as the vector (3, 8). What\'s wrong?',
      commonErrors: [
        {
          answer: '(3, 8) — multiplying components',
          misconception: 'Confusing the dot product (scalar) with element-wise multiplication.',
          correctsTo: 'The dot product is a SCALAR, not a vector. a · b = 1·3 + 2·4 = 3 + 8 = 11. The result is the SUM of the elementwise products. (Component-wise multiplication of vectors is a different operation, not used in IB AA.) Mnemonic: "a dot b makes a number, not a vector."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Magnitude in 3D: |a| = √(a₁² + a₂² + a₃²).',
        'Dot product is a scalar: a · b = Σ aᵢbᵢ = |a||b|cos θ.',
        'cos θ = (a · b) / (|a||b|) → solve for angle.',
        'Perpendicular ⟺ a · b = 0. Parallel ⟺ a = λb.',
        'Unit vector: divide vector by its magnitude.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the value of k for which (1, 2, k) and (3, k, −1) are perpendicular.',
      hint: 'Perpendicular ⟺ dot product = 0. (1)(3) + (2)(k) + (k)(−1) = 0 → 3 + 2k − k = 0 → k = −3.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
