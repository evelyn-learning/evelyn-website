/**
 * IB DP Math AA — Quadratic Functions (Deep).
 * Vertex form, factor form, discriminant, roots-and-coefficients, sketches.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_QUADRATICS_DEEP: LessonPlan = {
  id: 'evelyn.ibdp.aa.quadratics-deep.v1',
  title: 'IB DP Math AA — Quadratic Functions (Deep)',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.quadratics-deep',
      description: 'Convert between standard, vertex, and factor forms of quadratics; use the discriminant; relate sum and product of roots to coefficients.',
      standard: 'IB-DP-MATH-AA-2.6/2.7',
    },
  ],
  prerequisites: ['ibdp.aa.functions-inverses'],
  followUps: ['ibdp.aa.poly-rational'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB AA pushes quadratics far past GCSE — discriminant proofs, roots-and-coefficients, and form-conversions are routine.',
      script: 'On Paper 1 you may see "the equation x² + (k − 2)x + 9 = 0 has equal roots. Find k." That\'s a discriminant question. Or "α and β are the roots of x² − 5x + 7 = 0. Find α² + β²." That\'s roots-and-coefficients. Both topics live just outside GCSE territory and need fluency.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quadratics',
      kind: 'concept',
      goal: 'Three forms, discriminant analysis, roots-coefficients identities.',
      keyIdeas: [
        'STANDARD FORM: f(x) = ax² + bx + c. Coefficients a, b, c are easy to read.',
        'VERTEX FORM: f(x) = a(x − h)² + k. Vertex at (h, k); axis of symmetry x = h.',
        'FACTOR FORM: f(x) = a(x − p)(x − q). Roots at x = p and x = q.',
        'DISCRIMINANT Δ = b² − 4ac. Δ > 0: two distinct real roots. Δ = 0: one repeated real root (parabola tangent to x-axis). Δ < 0: no real roots (no x-intercepts).',
        'TANGENT TO X-AXIS: equivalent to Δ = 0. Used in IB problems like "find k such that the line is tangent to the curve" (after substitution gives a quadratic in x).',
        'SUM AND PRODUCT OF ROOTS: for ax² + bx + c = 0 with roots α, β: α + β = −b/a and αβ = c/a. Useful when only the relationships between roots matter.',
        'SUM OF SQUARES via identity: α² + β² = (α + β)² − 2αβ. Cube: α³ + β³ = (α + β)³ − 3αβ(α + β).',
        'CONVERTING STANDARD → VERTEX: complete the square. Helps for sketches and minimum/maximum problems.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'Δ = b² − 4ac for ax² + bx + c = 0; sign tells you the number of real roots.' },
        { term: 'axis of symmetry', definition: 'the vertical line x = −b/(2a) = h passing through the vertex of a parabola.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-roots-coefficients',
      kind: 'worked_example',
      problem: 'α and β are the roots of 2x² − 5x + 1 = 0. Find: (a) α + β, (b) αβ, (c) α² + β².',
      steps: [
        'Compare with ax² + bx + c = 0 → a = 2, b = −5, c = 1.',
        '(a) α + β = −b/a = −(−5)/2 = 5/2.',
        '(b) αβ = c/a = 1/2.',
        '(c) α² + β² = (α + β)² − 2αβ = (5/2)² − 2·(1/2) = 25/4 − 1 = 25/4 − 4/4 = 21/4.',
        'CHECK by computing roots: 2x² − 5x + 1 = 0 → x = (5 ± √(25 − 8))/4 = (5 ± √17)/4. α + β = (5 + √17)/4 + (5 − √17)/4 = 10/4 = 5/2 ✓. αβ = ((5)² − 17)/16 = 8/16 = 1/2 ✓.',
      ],
      answer: 'α + β = 5/2; αβ = 1/2; α² + β² = 21/4',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For what values of k does kx² + (k + 3)x + 1 = 0 have two distinct real roots?',
      expectedAnswer: 'k ≠ 0 and k² − 2k − 3 > 0 (i.e. k > 3 or k < −1, with k ≠ 0)',
      responseFormat: 'free',
      hints: [
        'Compute discriminant: Δ = (k + 3)² − 4·k·1 = k² + 6k + 9 − 4k = k² + 2k + 9. Wait, recheck: (k + 3)² = k² + 6k + 9. Minus 4k gives k² + 2k + 9.',
        'Distinct real roots ⟺ Δ > 0 AND a ≠ 0 (otherwise not quadratic).',
        'Solve k² + 2k + 9 > 0. Discriminant of THIS quadratic in k: 4 − 36 = −32 < 0, so k² + 2k + 9 > 0 for ALL real k. So distinct real roots whenever k ≠ 0.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-discriminant',
      kind: 'misconception_check',
      question: 'A student computes Δ = 0 for a quadratic and concludes "no real solutions". Correct?',
      commonErrors: [
        {
          answer: 'No real solutions when Δ = 0',
          misconception: 'Conflating Δ = 0 with Δ < 0.',
          correctsTo: 'Δ = 0 means ONE repeated real root (the parabola touches the x-axis exactly once). Δ < 0 means NO real roots. Mnemonic: positive Δ → "two", zero Δ → "one twice", negative Δ → "none". Geometrically: positive = curve crosses; zero = curve kisses (tangent); negative = curve misses.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three forms: standard, vertex a(x−h)²+k, factor a(x−p)(x−q).',
        'Δ > 0: 2 roots. Δ = 0: 1 repeated root. Δ < 0: no real roots.',
        'Roots of ax² + bx + c = 0: α + β = −b/a, αβ = c/a.',
        'α² + β² = (α + β)² − 2αβ.',
        'For "tangent" or "equal-roots" questions: set Δ = 0 and solve.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'The roots of x² − 4x + k = 0 are α and β. Form a quadratic with roots α + 2 and β + 2.',
      hint: 'Sum of new roots = (α + 2) + (β + 2) = α + β + 4 = 4 + 4 = 8. Product = (α + 2)(β + 2) = αβ + 2(α + β) + 4 = k + 8 + 4 = k + 12. New quadratic: x² − 8x + (k + 12) = 0.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
