/**
 * SAT Math — Passport to Advanced Math.
 *
 * Quadratics, polynomials, exponentials, rational expressions.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_PASSPORT_ADVANCED: LessonPlan = {
  id: 'evelyn.sat.math.passport-advanced.v1',
  title: 'SAT Math — Passport to Advanced Math',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'sat.passport-advanced',
      description: 'Solve quadratic, polynomial, exponential, and rational equations and interpret their structure as required by the SAT Passport to Advanced Math domain.',
      standard: 'SAT-MATH-PAM',
    },
  ],
  prerequisites: ['sat.heart-of-algebra'],
  followUps: ['sat.additional-topics'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Passport to Advanced Math = the SAT\'s "deeper algebra" section.',
      script: 'After Heart of Algebra (linear stuff), the SAT tests whether you can handle nonlinear relationships. Quadratics, polynomials, exponentials, and rationals show up in ~16 questions across both math sections. The exam isn\'t looking for trick math — it\'s looking for whether you can FACTOR, MANIPULATE, and INTERPRET these forms quickly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'The four sub-areas and their key moves.',
      keyIdeas: [
        'QUADRATICS: standard form ax² + bx + c. Vertex form a(x − h)² + k (vertex (h, k)). Factored form a(x − r₁)(x − r₂) (roots r₁, r₂). Each form reveals different info: vertex form → max/min; factored → roots.',
        'SOLVING QUADRATICS: factor first; if it doesn\'t factor cleanly, use the quadratic formula x = (−b ± √(b² − 4ac)) / 2a. Discriminant b² − 4ac tells you # of real roots.',
        'POLYNOMIALS: degree = highest power. Roots/factors theorem: if (x − r) is a factor, then r is a root. SAT often gives you a polynomial and a known root and asks you to find another factor.',
        'EXPONENTIALS: y = a · b^x. Growth if b > 1; decay if 0 < b < 1. SAT loves "y = 100 · 1.05^t" interpretation: a is starting value, b − 1 is the growth rate. Compound interest formula A = P(1 + r/n)^(nt).',
        'RATIONAL EXPRESSIONS: ratios of polynomials. Simplify by FACTORING and CANCELING. Watch for excluded values (denominator = 0).',
        'EQUATION → INTERPRETATION questions: SAT often asks "what does the constant 4 represent in this model?" Connect the algebra to the real-world variable.',
        'COMMON TRAP: extraneous solutions when squaring both sides or multiplying by an expression. Always check answers against the original equation.',
      ],
      vocabulary: [
        { term: 'discriminant', definition: 'b² − 4ac — tells you the number of real roots of a quadratic.' },
        { term: 'extraneous solution', definition: 'a solution introduced by an algebraic manipulation that doesn\'t satisfy the original equation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-quadratic-form',
      kind: 'worked_example',
      problem: 'A function is given as f(x) = (x − 3)² + 4. Find the vertex and explain whether the function has any real roots.',
      steps: [
        'Vertex form: a(x − h)² + k → vertex at (h, k) = (3, 4).',
        'a = 1 (positive, parabola opens up).',
        'Minimum value of f is 4 (the y-coordinate of the vertex). f never goes below 4.',
        'Real roots exist where f(x) = 0. But minimum is 4, so f(x) > 0 everywhere — NO real roots.',
        'Algebraically: (x − 3)² + 4 = 0 → (x − 3)² = −4 → no real solution.',
        'INTERPRETATION: vertex form makes max/min and shifts visible at a glance.',
      ],
      answer: 'Vertex (3, 4); no real roots (minimum is +4, parabola opens up).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bacterial population is modeled by P = 200 · 2^t where t is hours. After how many hours does the population reach 1600?',
      expectedAnswer: '3',
      responseFormat: 'free',
      hints: [
        'Set 200 · 2^t = 1600.',
        'Divide by 200: 2^t = 8. What power of 2 is 8?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-form-equivalence',
      kind: 'misconception_check',
      question: 'A SAT question gives a quadratic in standard form (ax² + bx + c) and asks for the vertex. Should you complete the square, or use the formula x = −b / (2a)?',
      commonErrors: [
        {
          answer: 'always complete the square',
          misconception: 'Treating completing the square as the only way.',
          correctsTo: 'For SAT speed, USE x = −b / (2a) to find the vertex\'s x-coordinate, then plug back to find y. Completing the square is fine but slower under exam pressure. The SAT rewards efficiency. Both methods give the same answer; only one is fast.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three quadratic forms: standard, vertex (max/min visible), factored (roots visible).',
        'Discriminant b² − 4ac: # of real roots (>0 two, =0 one, <0 none).',
        'Exponential a · b^x: a = start, (b − 1) = growth rate (or b−1 negative for decay).',
        'Rational expressions: factor, cancel, watch for excluded values.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A polynomial p(x) has roots at x = −2, x = 1, x = 4 and a leading coefficient of 2. Write p(x) in factored form.',
      hint: 'If r is a root, (x − r) is a factor. p(x) = 2(x + 2)(x − 1)(x − 4). Multiply out only if asked.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
