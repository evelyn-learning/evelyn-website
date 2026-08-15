/**
 * Grades 9-10 Math — Exponent Rules.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_EXPONENT_RULES: LessonPlan = {
  id: 'evelyn.g910.math.algebra.exponent-rules.v1',
  title: 'Algebra 1 — Exponent Rules',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'g910.math.algebra.exponent-rules',
      description: 'Apply the laws of exponents (product, quotient, power, zero, negative, fractional) to simplify expressions.',
      standard: 'CCSS.MATH.CONTENT.HSA.SSE.B.3c / 8.EE.A.1',
    },
  ],
  prerequisites: [],
  followUps: ['g910.math.polynomials.intro'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Exponent rules turn complicated expressions into simple ones — but only if you don\'t mix up product and power rules.',
      script: 'Quick: x³ · x⁵ = ? And (x³)⁵ = ? They look similar but the answers are completely different (x⁸ vs x¹⁵). Today we drill the six exponent rules and the misconceptions that cost the most marks.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-exponent-rules',
      kind: 'concept',
      goal: 'The six rules + zero/negative/fractional exponents.',
      keyIdeas: [
        'PRODUCT rule: xᵃ · xᵇ = xᵃ⁺ᵇ. (When MULTIPLYING same base, ADD exponents.)',
        'QUOTIENT rule: xᵃ / xᵇ = xᵃ⁻ᵇ. (When DIVIDING same base, SUBTRACT exponents.)',
        'POWER rule: (xᵃ)ᵇ = xᵃᵇ. (When RAISING a power to a power, MULTIPLY exponents.)',
        'PRODUCT-of-powers: (xy)ᵃ = xᵃ · yᵃ. (Distribute the exponent across factors.)',
        'QUOTIENT-of-powers: (x/y)ᵃ = xᵃ / yᵃ.',
        'ZERO exponent: x⁰ = 1 for any x ≠ 0. (0⁰ is undefined or context-dependent.)',
        'NEGATIVE exponent: x⁻ᵃ = 1/xᵃ. Negative just means reciprocal — does not change sign of the value.',
        'FRACTIONAL exponent: x^(p/q) = (q-th root of x)ᵖ = ᵠ√(xᵖ). Common case: x^(1/2) = √x; x^(1/3) = ∛x.',
        'KEY DISTINCTION: x³ · x⁵ uses PRODUCT (add exponents) → x⁸. (x³)⁵ uses POWER (multiply exponents) → x¹⁵.',
        'COMMON ERROR: thinking 2x³ means (2x)³. It does NOT — 2x³ means 2 · x · x · x. Whereas (2x)³ = 8x³.',
      ],
      vocabulary: [
        { term: 'base', definition: 'in xᵃ, the x is the base — what gets multiplied by itself.' },
        { term: 'exponent', definition: 'in xᵃ, the a is the exponent — how many times the base appears as a factor.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Simplify (3x⁴y⁻²)³ · (2x²y⁵) / (6x⁵y).',
      steps: [
        'Apply power rule to (3x⁴y⁻²)³: 3³ · x¹² · y⁻⁶ = 27x¹²y⁻⁶.',
        'Multiply by (2x²y⁵): 27 · 2 · x¹²⁺² · y⁻⁶⁺⁵ = 54x¹⁴y⁻¹.',
        'Divide by (6x⁵y): (54/6) · x¹⁴⁻⁵ · y⁻¹⁻¹ = 9x⁹y⁻².',
        'Convert negative exponent to positive: 9x⁹ / y².',
        'Final: 9x⁹/y².',
      ],
      answer: '9x⁹/y²',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify (a²b⁻³)² · (a⁻¹b)⁴ and express with positive exponents only.',
      expectedAnswer: '(a²b⁻³)² = a⁴b⁻⁶. (a⁻¹b)⁴ = a⁻⁴b⁴. Multiply: a⁴⁻⁴ · b⁻⁶⁺⁴ = a⁰ · b⁻² = 1 · 1/b² = 1/b².',
      responseFormat: 'free',
      hints: [
        'Apply the power rule to each factor first.',
        'Then product rule (add exponents) for like bases.',
        'Convert any negative exponents to positive at the end.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-negative-base',
      kind: 'misconception_check',
      question: 'A student writes 2⁻³ = −8 (treating negative exponent as a sign on the value). What does 2⁻³ actually equal?',
      commonErrors: [
        {
          answer: '−8',
          misconception: 'Confusing negative exponent with negative value.',
          correctsTo: '2⁻³ = 1/2³ = 1/8 (a small POSITIVE number). A negative exponent means RECIPROCAL, not "negative." It never makes the value negative — only flips it. The value 2⁻³ is between 0 and 1, while 2³ = 8 is large. Memory: positive exponents grow, negative exponents shrink (by reciprocating). Sign of the value depends on sign of the BASE, not the exponent.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multiply same base → ADD exponents. Divide → SUBTRACT.',
        'Power to a power → MULTIPLY exponents.',
        'Distribute exponent over a product/quotient.',
        'x⁰ = 1 (x ≠ 0); x⁻ᵃ = 1/xᵃ; x^(1/n) = ⁿ√x.',
        'Negative exponent ≠ negative value.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
