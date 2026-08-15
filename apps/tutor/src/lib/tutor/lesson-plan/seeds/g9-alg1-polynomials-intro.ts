/**
 * G9 — Algebra 1: Polynomials intro (terms, degree, +, -, ×).
 *
 * The vocabulary and arithmetic of expressions like 3x² + 2x - 5.
 * Term, degree, leading coefficient, monomial / binomial / trinomial.
 * Adding / subtracting polynomials by combining like terms.
 * Multiplying via distribution (FOIL for binomials) — a direct
 * extension of G7 distributive.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_POLYNOMIALS_INTRO: LessonPlan = {
  id: 'evelyn.g9.math.algebra.polynomials-intro.v1',
  title: 'Polynomials: Vocabulary and Operations',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'polynomials',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.apr.a.1',
      description: 'Add, subtract, and multiply polynomials.',
      standard: 'CCSS.MATH.CONTENT.HSA.APR.A.1',
    },
  ],
  prerequisites: ['ccss.math.7.ee.a.1'],
  followUps: ['ccss.math.hsa.sse.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame polynomials as the natural extension of expressions you already manipulate.',
      script: 'You\'ve already worked with expressions like 2x + 5 and 3x² . Stack a few of these together — say 3x² + 2x - 5 — and you have a POLYNOMIAL. They\'re the building blocks of almost everything you\'ll see in algebra: solving, graphing, modeling. Today we name the parts and run the basic operations.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vocab',
      kind: 'concept',
      goal: 'Term, degree, leading coefficient; mono/bi/trinomial naming; standard form.',
      keyIdeas: [
        'A POLYNOMIAL is a sum (or difference) of terms, each a number times a variable raised to a whole-number power.',
        'TERM: a single piece, like 3x², -7x, or 5. Separated by + or -.',
        'COEFFICIENT: the number in front of the variable. In -7x, coefficient is -7.',
        'DEGREE OF A TERM: the exponent on the variable. 3x² has degree 2. 5 alone (a constant) has degree 0.',
        'DEGREE OF A POLYNOMIAL: the highest term-degree in it. 3x² + 2x - 5 has degree 2 (a quadratic).',
        'LEADING COEFFICIENT: the coefficient of the highest-degree term.',
        'STANDARD FORM: write terms in ORDER of decreasing degree. 2x - 5 + 3x² → 3x² + 2x - 5.',
        'Special names: MONOMIAL = 1 term. BINOMIAL = 2 terms. TRINOMIAL = 3 terms.',
        'NOT polynomials: anything with a variable in a denominator (1/x), under a root (√x), or with a negative or fractional exponent.',
      ],
      vocabulary: [
        { term: 'polynomial', definition: 'a sum of terms with whole-number exponents on variables.' },
        { term: 'degree', definition: 'highest exponent on the variable in any term.' },
        { term: 'leading coefficient', definition: 'coefficient of the highest-degree term.' },
        { term: 'standard form', definition: 'terms ordered by decreasing degree.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-add-mult',
      kind: 'concept',
      goal: 'Adding/subtracting = combine like terms. Multiplying = distribute every-against-every (FOIL for binomials).',
      keyIdeas: [
        'ADDING / SUBTRACTING: just combine LIKE terms (same variable, same exponent). 3x² + 4x² = 7x². 3x² and 4x can\'t combine.',
        'Watch the sign on subtraction: distribute the minus to every term in the second polynomial. (3x² + 2) - (x² + 5) = 3x² + 2 - x² - 5 = 2x² - 3.',
        'MULTIPLYING: every term in the first polynomial multiplies EVERY term in the second.',
        'For two binomials, this is FOIL: First, Outer, Inner, Last. (x + 2)(x + 5) = x² + 5x + 2x + 10 = x² + 7x + 10.',
        'For larger products, organize like a distributive grid — each row × each column.',
      ],
      vocabulary: [
        { term: 'FOIL', definition: 'a memory aid for multiplying two binomials: First, Outer, Inner, Last.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-add',
      kind: 'worked_example',
      problem: 'Simplify (3x² + 4x - 1) + (x² - 2x + 5).',
      steps: [
        'Drop the parentheses (no signs to distribute, both groups added).',
        '3x² + 4x - 1 + x² - 2x + 5.',
        'Combine x² terms: 3x² + x² = 4x².',
        'Combine x terms: 4x + (-2x) = 2x.',
        'Combine constants: -1 + 5 = 4.',
        'Standard form: 4x² + 2x + 4.',
      ],
      answer: '4x² + 2x + 4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-foil',
      kind: 'worked_example',
      problem: 'Multiply (x + 3)(x - 5) using FOIL.',
      steps: [
        'First: x × x = x².',
        'Outer: x × -5 = -5x.',
        'Inner: 3 × x = 3x.',
        'Last: 3 × -5 = -15.',
        'Combine: x² - 5x + 3x - 15 = x² - 2x - 15.',
      ],
      answer: 'x² - 2x - 15',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Multiply (x + 4)(x + 6).',
      expectedAnswer: 'x² + 10x + 24',
      responseFormat: 'free',
      hints: [
        'FOIL: x·x + x·6 + 4·x + 4·6.',
        'Combine middle terms: 6x + 4x = 10x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-square-binomial',
      kind: 'misconception_check',
      question: 'Marcos writes (x + 3)² = x² + 9. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Distributing the square to each term separately, like (ab)² → a²b² — that\'s for products, not sums.',
          correctsTo: 'Wrong. (x + 3)² means (x + 3)(x + 3). FOIL: x² + 3x + 3x + 9 = x² + 6x + 9. The middle term (6x) gets dropped if you square term-by-term — but you can\'t do that with a SUM.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Polynomial = sum of terms with whole-number exponents.',
        'Degree = highest exponent. Leading coefficient = coefficient of that term.',
        'Add/subtract: combine like terms. Subtract distributes the minus.',
        'Multiply: every term times every term. Binomials: FOIL.',
        '(x + a)² ≠ x² + a². It\'s x² + 2ax + a².',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Multiply (2x + 1)(x² - 3x + 4).',
      hint: 'Distribute each term of the binomial over the trinomial. 2x(x² - 3x + 4) + 1(x² - 3x + 4) = 2x³ - 6x² + 8x + x² - 3x + 4 = 2x³ - 5x² + 5x + 4.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
