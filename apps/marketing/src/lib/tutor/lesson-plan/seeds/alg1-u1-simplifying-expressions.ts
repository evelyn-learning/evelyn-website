/**
 * Algebra 1 — Foundations: Simplifying Expressions with the Distributive
 * Property and Like Terms.
 *
 * The clean-up skill every later unit assumes (CCSS A-SSE.A.1, A-SSE.A.2):
 * open the parentheses, collect what matches, and stop. Equations,
 * inequalities, and polynomials all start with this move, so the sign
 * discipline learned here pays out for the rest of the course.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U1_SIMPLIFYING_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.simplifying-expressions.v1',
  title: 'Simplifying Expressions: Distributive Property & Like Terms',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.simplifying-expressions',
      standard: 'ALG1-1.3',
      description:
        'Simplify multi-term algebraic expressions by applying the distributive property, including negative multipliers, and combining like terms (CCSS A-SSE.A.1, A-SSE.A.2).',
    },
  ],
  prerequisites: ['alg1.order-of-operations'],
  followUps: ['alg1.translating-words-to-algebra'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame simplifying as the clean-up move that makes every later Algebra 1 skill readable.',
      script:
        'Think about a phone plan: 35 dollars a month plus 4 dollars a gigabyte, for three lines. You could write 3(35 + 4g), or you could write 105 + 12g. Same cost, but only one of those two forms tells you the monthly base at a glance. Simplifying is how you turn a messy expression into the version that actually shows you something — and it is the first move in almost every equation you will solve this year.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribute-collect',
      kind: 'concept',
      goal: 'Terms and like terms, the distributive property with signed multipliers, and the distribute-then-collect routine.',
      keyIdeas: [
        'TERM ANATOMY — an expression is a sum of terms separated by + and −. In 7x² − 4x + 9, the terms are 7x², −4x, and 9. The sign in front BELONGS to the term.',
        'LIKE TERMS — terms with the exact same variable part, same exponent: 5x and −2x are like; 5x and 5x² are NOT; 5x and 5y are NOT. Constants like 9 and −3 are like each other.',
        'COMBINING — add the coefficients, keep the variable part unchanged: 5x + (−2x) = 3x. The exponent never changes and never adds, so 5x + 2x = 7x, never 7x².',
        'DISTRIBUTIVE PROPERTY — a(b + c) = ab + ac. The outside factor multiplies EVERY term inside, not just the first: 3(2x + 5) = 6x + 15.',
        'NEGATIVE MULTIPLIERS — carry the sign through both products: −2(x − 6) = −2x + 12. Multiplying two negatives gives a positive, which is where most simplification errors are born.',
        'A BARE MINUS IS −1 — the expression 8 − (2x − 4) means 8 + (−1)(2x − 4) = 8 − 2x + 4 = 12 − 2x. Every sign inside the parentheses flips.',
        'THE ROUTINE — 1) distribute to clear every set of parentheses, 2) group like terms, 3) add coefficients, 4) write the result with the variable term first, highest power first.',
        'STOP WHEN NOTHING MATCHES — 9x + 4 is finished. Forcing it into 13x is the single most common Algebra 1 error, because a variable term and a constant are not like terms.',
      ],
      vocabulary: [
        { term: 'coefficient', definition: 'the number multiplying the variable part of a term — the 7 in 7x².' },
        { term: 'like terms', definition: 'terms with identical variable parts and exponents — the only terms that can be combined.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-distribute-collect',
      kind: 'worked_example',
      problem: 'Simplify: 3(2x + 5) + 4x − 7',
      steps: [
        'Distribute the 3 to BOTH inside terms: 3 · 2x = 6x and 3 · 5 = 15, so the expression becomes 6x + 15 + 4x − 7.',
        'Group like terms: the x-terms are 6x and 4x; the constants are 15 and −7.',
        'Combine the x-terms: 6x + 4x = 10x.',
        'Combine the constants: 15 − 7 = 8. Final form: 10x + 8. Check with x = 1: original 3(7) + 4 − 7 = 18, simplified 10 + 8 = 18. ✓',
      ],
      answer: '10x + 8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-multiplier',
      kind: 'worked_example',
      problem: 'Simplify: 8 − 3(2x − 4) + 5x',
      steps: [
        'The 3 is glued to the parentheses by multiplication and it is being SUBTRACTED, so the multiplier is −3. Do not compute 8 − 3 first.',
        'Distribute −3 to both terms: −3 · 2x = −6x and −3 · (−4) = +12. The expression becomes 8 − 6x + 12 + 5x.',
        'Group like terms: x-terms −6x and 5x; constants 8 and 12.',
        'Combine: −6x + 5x = −x, and 8 + 12 = 20. Final form: −x + 20. Check with x = 2: original 8 − 3(0) + 10 = 18, simplified −2 + 20 = 18. ✓',
      ],
      answer: '−x + 20',
      estimatedMinutes: 3,
    },
    {
      id: 'try-distribute-mcq',
      kind: 'try_yourself',
      problem: 'Simplify: 4(3x − 2) − 5x',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7x − 8', correct: true },
        { id: 'b', text: '7x − 2' },
        { id: 'c', text: '17x − 8' },
        { id: 'd', text: '−x' },
      ],
      expectedAnswer: '7x − 8',
      hints: [
        'The 4 multiplies both terms inside — including the −2.',
        'After distributing you have 12x − 8 − 5x. Only the x-terms combine.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-negative-mcq',
      kind: 'try_yourself',
      problem: 'Simplify: −2(x − 6) + 3x',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x + 12', correct: true },
        { id: 'b', text: 'x − 12' },
        { id: 'c', text: 'x + 6' },
        { id: 'd', text: '−5x + 12' },
      ],
      expectedAnswer: 'x + 12',
      hints: [
        'Distribute −2 to BOTH terms, and remember that −2 times −6 is positive.',
        'You should have −2x + 12 + 3x. Now add the coefficients −2 and 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Simplify 4(x + 3) − 2(x − 5) completely, then evaluate your simplified expression at x = 3. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '28',
      hints: [
        'Distribute both multipliers first: the second one is −2, and −2 times −5 is +10.',
        'The simplified form is 2x + 22 — now substitute x = 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-unlike-terms',
      kind: 'misconception_check',
      question: 'A student simplifies 5x + 3 to 8x, and on the next line writes 2x + 3x² = 5x³. What went wrong in each case?',
      commonErrors: [
        {
          answer: '5x + 3 = 8x',
          misconception: 'Treating a variable term and a constant as combinable, as if the x could be ignored while adding.',
          correctsTo: '5x and 3 are unlike terms — 5x means 5 of something and 3 means 3 of nothing-in-particular. 5x + 3 is already fully simplified; leave it alone.',
        },
        {
          answer: '2x + 3x² = 5x³',
          misconception: 'Adding coefficients AND exponents, confusing addition of terms with multiplication of powers.',
          correctsTo: 'x and x² are different variable parts, so these are unlike terms — 2x + 3x² cannot be combined at all. Even when terms DO match, only coefficients add: the exponent stays put, so 2x + 3x = 5x.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The routine: distribute every set of parentheses, then group and add coefficients of like terms.',
        'The outside factor hits EVERY term inside — and it carries its sign: −3(2x − 4) = −6x + 12.',
        'A bare minus in front of parentheses is −1: 8 − (2x − 4) = 12 − 2x.',
        'Like terms need the same variable AND the same exponent; combining only adds coefficients, never exponents.',
        '9x + 4 is a finished answer. Not everything combines.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Simplifying Expressions: Distributive Property & Like Terms' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
