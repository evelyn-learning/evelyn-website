/**
 * Grades 11-12 Math — Trigonometric Equations.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_TRIG_EQUATIONS: LessonPlan = {
  id: 'evelyn.g1112.math.trig.equations.v1',
  title: 'Trigonometry — Solving Trigonometric Equations',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'trigonometry',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.trig.equations',
      description: 'Solve trigonometric equations on a stated interval (or for all solutions) using algebra, identities, and the unit circle.',
      standard: 'CCSS.MATH.CONTENT.HSF.TF.B.7',
    },
  ],
  prerequisites: ['g1112.math.trig.unit-circle'],
  followUps: ['g1112.math.trig.laws-sin-cos'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trig equations have INFINITE solutions — but on a bounded interval, you find them all by combining reference-angle and periodicity.',
      script: 'Solve sin x = 1/2. There\'s π/6 — but also 5π/6, 13π/6, −7π/6... infinitely many. The question is usually: find all solutions on [0, 2π) or in a given interval. Today we systematise the procedure.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trig-equations',
      kind: 'concept',
      goal: 'Reference angle, all solutions on an interval, equations involving identities, factoring.',
      keyIdeas: [
        'BASIC TYPE: sin x = k. If |k| > 1 there are no real solutions. Otherwise there are infinitely many.',
        'STEPS for sin x = k on [0, 2π):',
        '  1. Find the REFERENCE ANGLE α = sin⁻¹(|k|). (Always positive acute.)',
        '  2. Determine in which QUADRANTS sine has the right sign.',
        '  3. Get the angles in each of those quadrants using the reference angle.',
        '  Two solutions on [0, 2π) for sine and cosine equations (one in each "good" quadrant). Tangent equations have ONE solution per period of length π, so two on [0, 2π).',
        'GENERAL SOLUTIONS: add 2πk to each solution (k integer) for sine and cosine. Add πk for tangent.',
        'EQUATIONS WITH MULTIPLE TERMS — strategies:',
        '  GET ONE TRIG FUNCTION: rewrite using identities so only one trig function appears. Example: sin²x = 1 − cos²x lets you convert sin² to cos².',
        '  FACTOR: 2 sin x cos x − sin x = 0 ⟹ sin x (2 cos x − 1) = 0 ⟹ sin x = 0 OR cos x = 1/2.',
        '  QUADRATIC IN ONE FUNCTION: 2 cos²x − cos x − 1 = 0. Let u = cos x: 2u² − u − 1 = 0 ⟹ (2u + 1)(u − 1) = 0 ⟹ u = −1/2 or u = 1. Then solve cos x = −1/2 and cos x = 1.',
        'CHECK each solution on the interval — and check that any "extraneous" solutions (introduced by squaring, for example) actually satisfy the original equation.',
      ],
      vocabulary: [
        { term: 'general solution', definition: 'expression for all solutions of a trig equation, including the periodicity (e.g. x = π/6 + 2πk).' },
        { term: 'extraneous solution', definition: 'a value that satisfies a transformed equation but not the original — common when squaring both sides.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve 2 cos²x − cos x − 1 = 0 on [0, 2π).',
      steps: [
        'Substitute u = cos x: 2u² − u − 1 = 0.',
        'Factor: (2u + 1)(u − 1) = 0. So u = −1/2 or u = 1.',
        'Case 1: cos x = 1 ⟹ x = 0 (within [0, 2π)). Note: 2π would also satisfy but is OUTSIDE half-open interval.',
        'Case 2: cos x = −1/2. Reference angle: cos⁻¹(1/2) = π/3. Cosine is negative in Q2 and Q3. Q2 angle: π − π/3 = 2π/3. Q3 angle: π + π/3 = 4π/3.',
        'All solutions on [0, 2π): x = 0, 2π/3, 4π/3.',
        'Verify: cos(0) = 1, 2(1) − 1 − 1 = 0 ✓. cos(2π/3) = −1/2, 2(1/4) − (−1/2) − 1 = 1/2 + 1/2 − 1 = 0 ✓.',
      ],
      answer: 'x = 0, 2π/3, 4π/3',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find all solutions of sin x = √3/2 on [0, 2π).',
      expectedAnswer: 'Reference angle: sin⁻¹(√3/2) = π/3. Sine is positive in Q1 and Q2. Q1: π/3. Q2: π − π/3 = 2π/3. Solutions: x = π/3 and x = 2π/3.',
      responseFormat: 'free',
      hints: [
        'Reference angle from sin⁻¹(√3/2).',
        'Sine is positive in which quadrants?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-divide-cos',
      kind: 'misconception_check',
      question: 'A student solves sin x cos x = sin x by dividing both sides by sin x, getting cos x = 1. What solutions did they miss?',
      commonErrors: [
        {
          answer: 'Divides by sin x',
          misconception: 'Dividing by an expression that could equal zero, losing solutions.',
          correctsTo: 'Dividing both sides by sin x ASSUMES sin x ≠ 0. But sin x = 0 IS a solution path: x = 0, π. By dividing, the student lost those solutions. The correct approach: subtract to one side and FACTOR. sin x cos x − sin x = 0 ⟹ sin x (cos x − 1) = 0 ⟹ sin x = 0 OR cos x = 1. Both yield solutions: x = 0, π (from sine) and x = 0 (from cosine). All solutions on [0, 2π): x = 0, π. Always factor instead of dividing when the divisor could be zero.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Find reference angle, use ASTC for sign, get all solutions in interval.',
        'Quadratic-in-trig: substitute u, factor, then back-solve.',
        'NEVER divide by an expression that could be zero — factor instead.',
        'General solutions add 2πk (sin/cos) or πk (tan).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
