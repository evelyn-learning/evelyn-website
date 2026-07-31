/**
 * Algebra 1 — Polynomials: Factoring by GCF and by Grouping.
 *
 * The first two factoring tools (CCSS A-SSE.A.2, A-SSE.B.3a): un-distribute
 * the greatest common factor — including a negative one — and split a
 * four-term polynomial into two pairs that share a binomial. Every later
 * factoring move starts with "GCF first", so this is the gateway skill for
 * trinomials, quadratics, and rational expressions.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U7_FACTORING_GCF_GROUPING: LessonPlan = {
  id: 'evelyn.hs.alg1.factoring-gcf-grouping.v1',
  title: 'Factoring: GCF & Grouping',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.factoring-gcf-grouping',
      standard: 'ALG1-7.3',
      description:
        'Factor a polynomial by pulling out the greatest common factor — including a negative GCF — and factor four-term polynomials by grouping, checking every result by re-multiplying (CCSS A-SSE.A.2, A-SSE.B.3a).',
    },
  ],
  prerequisites: ['alg1.special-products'],
  followUps: ['alg1.factoring-trinomials'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame factoring as running the distributive property backwards — the move that turns a long expression into a short product you can actually solve with.',
      script:
        'You already know how to turn 3x(2x + 5) into 6x² + 15x. Factoring is that film run backwards: someone hands you 6x² + 15x and you have to recover the 3x that got multiplied in. It matters because a sum tells you almost nothing, but a product tells you everything — that is how you will solve quadratics, simplify fractions with variables, and shrink ugly expressions later this course. Two tools today: pull out the GCF, and group four terms into two pairs.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gcf-grouping',
      kind: 'concept',
      goal: 'Find and pull out the GCF (coefficient part and variable part), handle a negative GCF, and factor four terms by grouping — always checking by re-multiplying.',
      keyIdeas: [
        'FACTORING IS UN-DISTRIBUTING — you are writing a sum as a PRODUCT. Distributing goes 3x(2x + 5) → 6x² + 15x; factoring goes 6x² + 15x → 3x(2x + 5). Same equation, read right to left.',
        'FIND THE GCF IN TWO PARTS — the coefficient part is the largest integer that divides EVERY coefficient; the variable part is the LOWEST power of each variable that appears in EVERY term. For 12x³ + 18x² − 30x: coefficients 12, 18, 30 share 6, and the lowest power of x is x¹, so the GCF is 6x.',
        'DIVIDE EVERY TERM BY THE GCF — including the term that IS the GCF. 9x² − 12x + 3 has GCF 3, and 3 ÷ 3 = 1, so the answer is 3(3x² − 4x + 1). The 1 must be written; dropping it changes the expression.',
        'NEGATIVE GCF — when the leading term is negative, pull the minus out with it and EVERY sign inside flips: −6x² + 15x = −3x(2x − 5). This is optional for most problems but required whenever you want a positive leading coefficient inside.',
        'FOUR TERMS → GROUPING — split into two pairs, factor the GCF out of each pair, and the two leftover parentheses must MATCH exactly. Then the matching binomial itself is a common factor: x³ + 5x² − 3x − 15 = x²(x + 5) − 3(x + 5) = (x + 5)(x² − 3).',
        'THE MATCH IS A SIGN CHOICE — if the third term is negative, factor a NEGATIVE out of the second pair so the parentheses line up: 3x³ − 12x² − 2x + 8 = 3x²(x − 4) − 2(x − 4) = (x − 4)(3x² − 2). Factoring out +2 instead would leave (−x + 4) and nothing would match.',
        'ALWAYS CHECK BY RE-MULTIPLYING — distribute your answer back out. If you do not land on the original expression term for term, the factoring is wrong. This check is free and catches every sign slip.',
        'GCF FIRST, ALWAYS — take the GCF out before you try anything else. Every later method (trinomials, difference of squares, solving quadratics) is easier on the smaller expression left behind.',
      ],
      vocabulary: [
        { term: 'GCF', definition: 'greatest common factor — the largest coefficient and lowest variable power shared by every term.' },
        { term: 'factoring by grouping', definition: 'splitting four terms into two pairs, factoring each pair, and pulling out the binomial they share.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-gcf',
      kind: 'worked_example',
      problem: 'Factor completely: 12x³ + 18x² − 30x',
      steps: [
        'Coefficient part of the GCF: the largest integer dividing 12, 18, and 30 is 6.',
        'Variable part: every term has an x, and the lowest power present is x¹. So the GCF is 6x.',
        'Divide each term by 6x: 12x³ ÷ 6x = 2x², 18x² ÷ 6x = 3x, −30x ÷ 6x = −5.',
        'Write the product: 6x(2x² + 3x − 5).',
        'Check by re-multiplying: 6x·2x² = 12x³, 6x·3x = 18x², 6x·(−5) = −30x. ✓',
      ],
      answer: '6x(2x² + 3x − 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-grouping-negative',
      kind: 'worked_example',
      problem: 'Factor by grouping: 3x³ − 12x² − 2x + 8',
      steps: [
        'No GCF for all four terms (3, 12, 2, 8 share only 1, and the last term has no x), so go straight to grouping.',
        'Split into pairs: (3x³ − 12x²) + (−2x + 8).',
        'First pair: GCF 3x² → 3x²(x − 4).',
        'Second pair: the leading term is −2x, so pull out −2, flipping both signs inside: −2(x − 4). Pulling out +2 would give 2(−x + 4), which does NOT match the first parentheses.',
        'The parentheses match: 3x²(x − 4) − 2(x − 4). Factor out the shared (x − 4): (x − 4)(3x² − 2).',
        'Check: (x − 4)(3x² − 2) = 3x³ − 2x − 12x² + 8 = 3x³ − 12x² − 2x + 8. ✓',
      ],
      answer: '(x − 4)(3x² − 2)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-gcf-mcq',
      kind: 'try_yourself',
      problem: 'Factor completely: 8x⁴ − 20x³ + 4x²',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x²(2x² − 5x + 1)', correct: true },
        { id: 'b', text: '4x²(2x² − 5x)' },
        { id: 'c', text: '4x(2x³ − 5x² + x)' },
        { id: 'd', text: '2x²(4x² − 10x + 2)' },
      ],
      expectedAnswer: '4x²(2x² − 5x + 1)',
      hints: [
        'Largest integer dividing 8, 20, and 4? Lowest power of x in all three terms?',
        'The GCF is 4x². Watch the last term: 4x² ÷ 4x² = 1, not 0 — the 1 has to be written.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-grouping-mcq',
      kind: 'try_yourself',
      problem: 'Factor by grouping: x³ + 5x² − 3x − 15',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x + 5)(x² − 3)', correct: true },
        { id: 'b', text: '(x + 5)(x² + 3)' },
        { id: 'c', text: '(x − 5)(x² − 3)' },
        { id: 'd', text: '(x² + 5)(x − 3)' },
      ],
      expectedAnswer: '(x + 5)(x² − 3)',
      hints: [
        'Pair them up: (x³ + 5x²) + (−3x − 15). Factor x² out of the first pair.',
        'The second pair starts negative, so pull out −3: −3(x + 5). Both parentheses now read (x + 5).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'The complete GCF of 6x⁴ + 15x³ − 9x² can be written as Ax^B, where A is a whole number and B is the exponent on x. Type the value of A + B as a single number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Coefficient part: the largest integer dividing 6, 15, and 9.',
        'Variable part: the LOWEST power of x that appears in every term. The GCF is 3x², so A = 3 and B = 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dropped-one',
      kind: 'misconception_check',
      question: 'A student factors 9x² − 12x + 3 and writes 3(3x² − 4x). Another student factors −4x² + 8x and writes −4x(x + 2). What went wrong in each?',
      commonErrors: [
        {
          answer: '3(3x² − 4x)',
          misconception: 'Thinking that a term which equals the GCF disappears — treating 3 ÷ 3 as nothing instead of 1.',
          correctsTo: 'Dividing a term by the GCF always leaves something: 3 ÷ 3 = 1. The answer is 3(3x² − 4x + 1). Re-multiplying the student version gives 9x² − 12x, which is missing the +3.',
        },
        {
          answer: '−4x(x + 2)',
          misconception: 'Pulling out a negative GCF but only flipping the sign of the first term inside.',
          correctsTo: 'Every term gets divided by −4x: −4x² ÷ (−4x) = x and 8x ÷ (−4x) = −2, so the answer is −4x(x − 2). Check: −4x(x − 2) = −4x² + 8x. ✓',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Factoring is un-distributing — turn a sum into a product, then check by multiplying back.',
        'GCF = largest shared coefficient × lowest shared variable power; take it out FIRST, every time.',
        'A term equal to the GCF leaves a 1 behind — never drop it.',
        'Pulling out a negative GCF flips the sign of EVERY term inside.',
        'Four terms: pair, factor each pair, make the parentheses match (choose a negative if needed), then pull out the shared binomial.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Factoring: GCF & Grouping' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
