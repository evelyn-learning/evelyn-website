/**
 * G8 — Exponent rules and scientific notation.
 *
 * Two related G8 strands. Exponent rules: product, quotient, power
 * of a power, zero exponent, negative exponent. Scientific notation:
 * a × 10^n form for very big or very small numbers, with the
 * 1 ≤ |a| < 10 normalization rule.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_EXPONENTS_SCIENTIFIC_NOTATION: LessonPlan = {
  id: 'evelyn.g8.math.exponents-scientific-notation.v1',
  title: 'Exponent Rules and Scientific Notation',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'exponents',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.ee.a.1',
      description: 'Apply properties of integer exponents.',
      standard: 'CCSS.MATH.CONTENT.8.EE.A.1',
    },
    {
      id: 'ccss.math.8.ee.a.3',
      description: 'Use scientific notation to estimate very large or very small quantities.',
      standard: 'CCSS.MATH.CONTENT.8.EE.A.3',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.1'],
  followUps: ['ccss.math.hsa.sse.a.1'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use the size of the universe vs an atom to motivate scientific notation.',
      script: 'A grain of sand is about 0.00005 meters wide. The distance to the Sun is about 150,000,000,000 meters. Both numbers are nasty to write or read. Scientists invented a shortcut: 5 × 10⁻⁵ and 1.5 × 10¹¹. Same numbers, much cleaner — and the rules behind them all come from one place: how exponents work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-exponent-rules',
      kind: 'concept',
      goal: 'Three core exponent rules + zero/negative exponent definitions.',
      keyIdeas: [
        'EXPONENT shorthand: 2³ = 2 × 2 × 2 = 8. The 3 is the exponent or power.',
        'PRODUCT RULE: aᵐ × aⁿ = aᵐ⁺ⁿ. Same base, multiply → ADD exponents. (2³ × 2² = 2⁵ = 32, because 8 × 4 = 32.)',
        'QUOTIENT RULE: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. Same base, divide → SUBTRACT exponents.',
        'POWER OF A POWER: (aᵐ)ⁿ = aᵐⁿ. Multiply the exponents.',
        'ZERO EXPONENT: a⁰ = 1 (for any non-zero a). Reason: aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰ — must equal 1.',
        'NEGATIVE EXPONENT: a⁻ⁿ = 1/aⁿ. Negative exponent means flip into the denominator. 2⁻³ = 1/2³ = 1/8.',
      ],
      vocabulary: [
        { term: 'base', definition: 'the number being raised to a power (the 2 in 2³).' },
        { term: 'exponent', definition: 'how many times to multiply the base by itself (the 3 in 2³).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-scientific',
      kind: 'concept',
      goal: 'Scientific notation: a × 10ⁿ where 1 ≤ |a| < 10. Big positive n for huge, big negative n for tiny.',
      keyIdeas: [
        'SCIENTIFIC NOTATION: every number written as a × 10ⁿ.',
        'Rule: a (the coefficient) must be at least 1 and less than 10. So 1 ≤ |a| < 10.',
        'Big numbers → POSITIVE exponent. 3,200,000 = 3.2 × 10⁶ (decimal moved 6 places left).',
        'Tiny numbers → NEGATIVE exponent. 0.000045 = 4.5 × 10⁻⁵ (decimal moved 5 places right).',
        'To convert TO scientific: move the decimal so a is between 1 and 10. Count the moves — that\'s the exponent\'s magnitude. Direction tells you the sign (left = positive, right = negative).',
        'To convert FROM scientific: shift the decimal back the indicated number of places.',
      ],
      vocabulary: [],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-product',
      kind: 'worked_example',
      problem: 'Simplify  x⁴ × x⁻²  using exponent rules.',
      steps: [
        'Same base (x). Multiplying → add exponents: 4 + (-2) = 2.',
        'Result: x².',
        'Sense-check with numbers: take x = 3. 3⁴ × 3⁻² = 81 × 1/9 = 9 = 3². ✓',
      ],
      answer: 'x²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-scientific',
      kind: 'worked_example',
      problem: 'Write 0.000063 in scientific notation.',
      steps: [
        'Need a between 1 and 10. Move the decimal point right until a = 6.3.',
        '0.000063 → 6.3, decimal moved 5 places to the right.',
        'Tiny number → negative exponent.',
        'Result: 6.3 × 10⁻⁵.',
      ],
      answer: '6.3 × 10⁻⁵',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify  (a³)⁴.',
      expectedAnswer: 'a^12',
      responseFormat: 'free',
      hints: [
        'Power of a power → multiply the exponents.',
        '3 × 4 = 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-bases',
      kind: 'misconception_check',
      question: 'Reza writes 2³ × 5³ = 7³ — he added the bases. Right?',
      commonErrors: [
        {
          answer: 'yes — like the product rule',
          misconception: 'Confusing the same-base product rule with adding-bases.',
          correctsTo: 'Wrong. The product rule (add exponents) only works with the SAME base. Different bases: just multiply the values. 2³ × 5³ = 8 × 125 = 1000. Not 7³ = 343. (For different bases with same exponent, the rule is (ab)ⁿ — we\'d get (2 × 5)³ = 10³ = 1000, which works.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Same base, multiply → ADD exponents. Same base, divide → SUBTRACT.',
        'Power of a power → MULTIPLY exponents.',
        'a⁰ = 1. a⁻ⁿ = 1/aⁿ.',
        'Scientific notation: a × 10ⁿ with 1 ≤ |a| < 10.',
        'Big = positive exponent, tiny = negative exponent.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute (2 × 10⁵) × (3 × 10²) and write the answer in scientific notation.',
      hint: 'Multiply coefficients: 2 × 3 = 6. Multiply powers (add exponents): 10⁵ × 10² = 10⁷. Answer: 6 × 10⁷.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
