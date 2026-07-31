/**
 * Algebra 1 — Polynomials: Adding, Subtracting & Multiplying.
 *
 * The arithmetic of expressions (CCSS A-APR.A.1): name the parts, combine
 * like terms, distribute the minus, and multiply every-term-by-every-term.
 * Factoring, quadratics, and every area/volume model later in the course
 * assume this is automatic.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U7_POLYNOMIAL_OPERATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.polynomial-operations.v1',
  title: 'Adding, Subtracting & Multiplying Polynomials',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.polynomial-operations',
      standard: 'ALG1-7.1',
      description:
        'Name the parts of a polynomial and write it in standard form, then add, subtract, and multiply polynomials — monomial by polynomial and binomial by binomial — recognizing that the result is always another polynomial (CCSS A-APR.A.1).',
    },
  ],
  prerequisites: ['alg1.exponential-growth-decay'],
  followUps: ['alg1.special-products'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame polynomial arithmetic as the language the rest of the course is written in — and as the algebra behind any area or cost model.',
      script:
        'Fence off a rectangular garden that is 3 feet longer than it is wide and its area is x(x + 3) = x² + 3x — a polynomial. Stack two revenue models, subtract cost from income, double the size of a design: every one of those is adding, subtracting, or multiplying polynomials. Learn the four moves today and factoring, graphing, and quadratics all become bookkeeping instead of guesswork.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parts-and-operations',
      kind: 'concept',
      goal: 'The vocabulary (term, degree, standard form) plus the three operations — with the distribute-the-minus trap and the multiply-exponents rule called out.',
      keyIdeas: [
        'WHAT COUNTS — a POLYNOMIAL is a sum of terms, each a number times a variable raised to a WHOLE-NUMBER power: 3x² + 2x − 5. Not polynomials: 1/x, √x, x^(−2) — variables cannot sit in a denominator, under a root, or carry a negative or fractional exponent.',
        'NAMING THE PARTS — the DEGREE of a term is its exponent (3x² has degree 2; the constant 5 has degree 0); the DEGREE of the polynomial is the highest term degree; the LEADING COEFFICIENT is the number on that highest-degree term. By term count: 1 = monomial, 2 = binomial, 3 = trinomial.',
        'STANDARD FORM — write terms in order of DECREASING degree: 2x − 5 + 3x² becomes 3x² + 2x − 5. Always land your final answer here.',
        'ADD — combine LIKE terms only, meaning same variable AND same exponent. 3x² + 4x² = 7x². But 3x² + 4x cannot combine and just stays as 3x² + 4x.',
        'SUBTRACT — THE #1 TRAP: the minus sign belongs to EVERY term in the second polynomial, not just the first. (5x² − 3x + 8) − (2x² + 7x − 4) = 5x² − 3x + 8 − 2x² − 7x + 4. Safest habit: rewrite subtraction as "add the opposite" and flip all the signs before you combine anything.',
        'MULTIPLY — every term in the first polynomial hits every term in the second. Multiply the coefficients, ADD the exponents: 3x(2x² − 5x + 4) = 6x³ − 15x² + 12x.',
        'FOIL IS JUST DOUBLE DISTRIBUTION — (x + 2)(x + 5) = x(x + 5) + 2(x + 5) = x² + 5x + 2x + 10 = x² + 7x + 10. First, Outer, Inner, Last is a bookkeeping name for those four products; for anything bigger than 2 by 2, use a row-by-column grid so nothing is missed.',
        'CLOSURE — add, subtract, or multiply two polynomials and you always get another polynomial, exactly like integers under +, −, and ×. Division is the exception: x / (x + 1) is not a polynomial.',
      ],
      vocabulary: [
        { term: 'like terms', definition: 'terms with the same variable raised to the same exponent — only these can be combined.' },
        { term: 'standard form', definition: 'a polynomial written with its terms in decreasing order of degree.' },
        { term: 'closure', definition: 'a set is closed under an operation when the result always stays inside the set.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-foil',
      kind: 'worked_example',
      problem: 'Multiply: (2x + 5)(3x − 4)',
      steps: [
        'First: 2x × 3x = 6x² — multiply coefficients (2 × 3 = 6), add exponents (1 + 1 = 2).',
        'Outer: 2x × (−4) = −8x.',
        'Inner: 5 × 3x = 15x.',
        'Last: 5 × (−4) = −20.',
        'Collect the two like middle terms: −8x + 15x = 7x, so the product is 6x² + 7x − 20.',
        'Check with x = 1: (2 + 5)(3 − 4) = 7 × (−1) = −7, and 6 + 7 − 20 = −7. ✓',
      ],
      answer: '6x² + 7x − 20',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-subtract-minus-trap',
      kind: 'worked_example',
      problem: 'Simplify: (5x² − 3x + 8) − (2x² + 7x − 4)',
      steps: [
        'Rewrite as adding the opposite — the minus flips the sign of ALL THREE terms in the second group: 5x² − 3x + 8 − 2x² − 7x + 4.',
        'Notice the last term became +4, not −4. Flipping only the first term is the classic error here.',
        'Combine x² terms: 5x² − 2x² = 3x².',
        'Combine x terms: −3x − 7x = −10x.',
        'Combine constants: 8 + 4 = 12.',
        'Standard form: 3x² − 10x + 12. Check with x = 1: (5 − 3 + 8) − (2 + 7 − 4) = 10 − 5 = 5, and 3 − 10 + 12 = 5. ✓',
      ],
      answer: '3x² − 10x + 12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-subtract',
      kind: 'try_yourself',
      problem: 'Simplify: (7x² + 2x − 6) − (3x² − 5x + 1)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x² − 3x − 5' },
        { id: 'b', text: '10x² − 3x − 5' },
        { id: 'c', text: '4x² + 7x − 7', correct: true },
        { id: 'd', text: '4x² + 7x − 5' },
      ],
      expectedAnswer: '4x² + 7x − 7',
      hints: [
        'Distribute the minus to all three terms first: 7x² + 2x − 6 − 3x² + 5x − 1.',
        'Now combine: 7x² − 3x² = 4x², 2x + 5x = 7x, −6 − 1 = −7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-multiply',
      kind: 'try_yourself',
      problem: 'Multiply: (x − 6)(x + 2)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x² − 12' },
        { id: 'b', text: 'x² − 4x − 12', correct: true },
        { id: 'c', text: 'x² + 4x − 12' },
        { id: 'd', text: 'x² − 4x + 12' },
      ],
      expectedAnswer: 'x² − 4x − 12',
      hints: [
        'Four products, not two: Outer is x × 2 and Inner is −6 × x.',
        'Middle terms: 2x + (−6x) = −4x; last term: (−6)(2) = −12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Multiply (3x + 2)(x + 7), write the product in standard form, and type just the coefficient of the x term as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '23',
      hints: [
        'Outer is 3x × 7 and Inner is 2 × x — those are the two terms that carry a plain x.',
        '21x + 2x = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-combine-unlike',
      kind: 'misconception_check',
      question: 'A student simplifies 3x² + 4x as 7x³. What went wrong?',
      commonErrors: [
        {
          answer: '7x³',
          misconception: 'Treating 3x² and 4x as like terms — adding the coefficients AND adding the exponents, which mashes together the rules for addition and multiplication.',
          correctsTo:
            '3x² and 4x are not like terms (different exponents), so nothing combines: the answer is just 3x² + 4x. Exponents get ADDED only when you MULTIPLY: (3x²)(4x) = 12x³. Adding leaves exponents alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Degree = highest exponent; standard form = terms in decreasing degree.',
        'Add or subtract by combining LIKE terms only — same variable, same exponent.',
        'Subtraction distributes the minus to EVERY term: −(2x² + 7x − 4) = −2x² − 7x + 4.',
        'Multiply every term by every term; multiply coefficients, add exponents. FOIL is just double distribution.',
        'Polynomials are closed under +, −, and × — the answer is always another polynomial.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Adding, Subtracting & Multiplying Polynomials' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
