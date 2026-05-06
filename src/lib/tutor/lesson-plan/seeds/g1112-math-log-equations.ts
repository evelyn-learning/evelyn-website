/**
 * Grades 11-12 Math — Logarithmic Equations.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_LOG_EQUATIONS: LessonPlan = {
  id: 'evelyn.g1112.math.log.equations.v1',
  title: 'Logarithms — Solving Logarithmic Equations',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'logarithms-exponentials',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.log.equations',
      description: 'Solve logarithmic and exponential equations using log/exp duality and properties of logs; check for extraneous solutions.',
      standard: 'CCSS.MATH.CONTENT.HSF.LE.A.4',
    },
  ],
  prerequisites: ['g11.math.algebra2.logarithms'],
  followUps: ['g1112.math.log.properties'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Logarithm and exponential functions undo each other — that\'s how every log equation gets solved.',
      script: 'Equation log₂(x) = 5. To "undo" the log, raise the base 2 to both sides: x = 2⁵ = 32. The whole logic of log equations is exploiting log/exp duality, plus the properties of logs to combine multiple log terms into one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-log-equations',
      kind: 'concept',
      goal: 'Log/exp duality, properties used to combine, exponential equations via log, extraneous solutions.',
      keyIdeas: [
        'LOG/EXP DUALITY: log_b(y) = x  ⟺  bˣ = y. Reading: "log base b of y is x" is the same as "b raised to x equals y."',
        'TYPE 1 — log on one side: log_b(expr) = c. Solve by exponentiating: expr = bᶜ.',
        'TYPE 2 — log = log: log_b(A) = log_b(B). Solve A = B (assuming A, B > 0).',
        'TYPE 3 — multiple log terms: combine using PROPERTIES first, then apply Type 1 or 2.',
        '  log A + log B = log(AB).',
        '  log A − log B = log(A/B).',
        '  k log A = log(Aᵏ).',
        'TYPE 4 — exponential equation aˣ = b: take log of both sides. log(aˣ) = log(b) ⟹ x log a = log b ⟹ x = log(b)/log(a). The CHANGE OF BASE.',
        'EXTRANEOUS SOLUTIONS: log_b(x) is only defined for x > 0. After solving, plug each candidate back into the ORIGINAL equation. Reject any that make any log argument zero or negative.',
        'COMMON BASES: log (no subscript) usually means log₁₀. ln means log_e (natural log). Both have calculator buttons; log_b for other bases uses change of base: log_b(x) = ln(x)/ln(b).',
      ],
      vocabulary: [
        { term: 'change of base', definition: 'log_b(x) = log(x)/log(b) = ln(x)/ln(b); converts to a base your calculator can compute.' },
        { term: 'extraneous solution', definition: 'a candidate solution that satisfies a manipulated equation but not the original; must be rejected.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Solve log₂(x) + log₂(x − 2) = 3.',
      steps: [
        'Combine left side using log A + log B = log(AB): log₂(x(x − 2)) = 3.',
        'Exponentiate (Type 1): x(x − 2) = 2³ = 8.',
        'Expand: x² − 2x − 8 = 0.',
        'Factor: (x − 4)(x + 2) = 0 ⟹ x = 4 or x = −2.',
        'CHECK in original equation. log₂ requires positive argument.',
        'x = 4: log₂(4) + log₂(2) = 2 + 1 = 3 ✓.',
        'x = −2: log₂(−2) is UNDEFINED. REJECT.',
        'Answer: x = 4 (only).',
      ],
      answer: 'x = 4 (the candidate x = −2 is extraneous)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve 5ˣ = 80. Express the answer in terms of natural log, then approximate.',
      expectedAnswer: 'Take ln of both sides: ln(5ˣ) = ln(80) ⟹ x ln 5 = ln 80 ⟹ x = ln 80 / ln 5. Approximate: ln 80 ≈ 4.382, ln 5 ≈ 1.609, x ≈ 2.722.',
      responseFormat: 'free',
      hints: [
        'For exponential equations, take a log of both sides.',
        'Either base works, but ln is convenient.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skip-check',
      kind: 'misconception_check',
      question: 'A student solves log(x − 3) + log(x) = 1 and gets x = 5 or x = −2. They report both. Why is x = −2 wrong?',
      commonErrors: [
        {
          answer: 'Reports both candidates',
          misconception: 'Forgetting to verify candidates against domain restrictions.',
          correctsTo: 'log(x − 3) requires x − 3 > 0 ⟺ x > 3. log(x) requires x > 0. So the equation is only defined for x > 3. The candidate x = −2 violates BOTH domain conditions and is extraneous. Always check candidates against the original equation\'s domain — not just the simplified equation. Quadratics from log equations VERY often produce extraneous negative roots.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'log_b(y) = x ⟺ bˣ = y. Always.',
        'Combine log terms with properties before exponentiating.',
        'For aˣ = b: take log, divide by log(a).',
        'CHECK every candidate in the ORIGINAL equation; reject extraneous.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
