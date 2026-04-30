/**
 * G11 — Algebra 2: Logarithms (definition, log laws, solving exp eqns).
 *
 * Logarithm = inverse of exponential. log_b(x) asks "to what power
 * must I raise b to get x?". Three core laws (product, quotient,
 * power) that mirror exponent rules. Solving exponential equations
 * by taking the log of both sides — the practical payoff.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_LOGARITHMS: LessonPlan = {
  id: 'evelyn.g11.math.algebra2.logarithms.v1',
  title: 'Logarithms',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'logarithms',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf.le.a.4',
      description: 'Express the solution to an exponential equation as a logarithm.',
      standard: 'CCSS.MATH.CONTENT.HSF.LE.A.4',
    },
    {
      id: 'ccss.math.hsf.bf.b.5',
      description: 'Understand the inverse relationship between exponents and logarithms.',
      standard: 'CCSS.MATH.CONTENT.HSF.BF.B.5',
    },
  ],
  prerequisites: ['ccss.math.hsf.le.a.2'],
  followUps: ['ccss.math.hsa.sse.b.4'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame log as the "what exponent did I use?" question.',
      script: '2 to the WHAT equals 8? You\'d say 3, easily. 2 to the WHAT equals 32? Five. That backwards question — exponential thinking in reverse — has a name. It\'s a logarithm. Without it, exponential equations like 2ˣ = 17 are unsolvable. With it, they\'re a one-line answer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-definition',
      kind: 'concept',
      goal: 'log_b(x) = y ⟺ b^y = x; common log, natural log; log laws.',
      keyIdeas: [
        'DEFINITION: log_b(x) = y means b^y = x. Read "log base b of x equals y."',
        'The log "asks the exponent question": "to get x from b, what exponent do I need?"',
        '  log₂(8) = 3 because 2³ = 8.',
        '  log₁₀(1000) = 3 because 10³ = 1000.',
        '  log₅(1) = 0 because 5⁰ = 1. (Any log of 1 is 0.)',
        '  log_b(b) = 1 because b¹ = b.',
        'TWO common bases get shorthand:',
        '  log(x) without a base = log₁₀(x) (common log).',
        '  ln(x) = log_e(x) (natural log, e ≈ 2.718).',
        'LOG LAWS (mirror exponent rules):',
        '  PRODUCT: log_b(MN) = log_b(M) + log_b(N).',
        '  QUOTIENT: log_b(M/N) = log_b(M) - log_b(N).',
        '  POWER: log_b(M^p) = p · log_b(M). ← biggest workhorse.',
        'log of 0 or a negative number is UNDEFINED.',
        'CHANGE OF BASE: log_b(x) = log(x) / log(b). Lets you compute any log on a calculator.',
      ],
      vocabulary: [
        { term: 'logarithm', definition: 'the inverse of an exponential — gives the exponent needed.' },
        { term: 'natural log (ln)', definition: 'logarithm with base e (≈ 2.718).' },
        { term: 'common log', definition: 'logarithm with base 10. Written log without subscript.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-evaluate',
      kind: 'worked_example',
      problem: 'Evaluate log₃(81) and log(0.001).',
      steps: [
        'log₃(81): 3 to what power gives 81? 3⁴ = 81. So log₃(81) = 4.',
        'log(0.001) means log₁₀(0.001). 10 to what power = 0.001? 10⁻³ = 0.001. So log(0.001) = -3.',
      ],
      answer: 'log₃(81) = 4; log(0.001) = -3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-solve-exp',
      kind: 'worked_example',
      problem: 'Solve 2^x = 17.',
      steps: [
        'Take log of both sides (any base — use log₁₀ since calculator-friendly).',
        'log(2^x) = log(17).',
        'Use the POWER law on the left: x · log(2) = log(17).',
        'Solve for x: x = log(17) / log(2).',
        'Compute: x ≈ 1.230 / 0.301 ≈ 4.087.',
      ],
      answer: 'x = log(17)/log(2) ≈ 4.09',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate log₂(64).',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        '2 to what power = 64?',
        '2⁶ = 64.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-as-multiply',
      kind: 'misconception_check',
      question: 'Sage simplifies log(8) + log(2) as log(10) = 1. Right?',
      commonErrors: [
        {
          answer: 'no — should be log(8 + 2)',
          misconception: 'Treating log(M) + log(N) as log(M + N) instead of log(MN).',
          correctsTo: 'Sage is RIGHT but for the wrong stated rule. The product law says log(M) + log(N) = log(MN), not log(M+N). So log(8) + log(2) = log(16). And log(16) ≠ 1 in base 10. Numerically: log(8) ≈ 0.903, log(2) ≈ 0.301, sum ≈ 1.204 = log(16). NOT log(10) = 1.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'log_b(x) = y ⟺ b^y = x — log answers "what exponent?".',
        'Product → sum, quotient → difference, power → coefficient out front.',
        'log₁₀ written as just "log"; log_e written as "ln".',
        'log of 0 or negative is UNDEFINED.',
        'Solving 2ˣ = N: take log of both sides, use power law, divide.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Simplify log(50) - log(5).',
      hint: 'Quotient law: log(50) - log(5) = log(50/5) = log(10) = 1.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
