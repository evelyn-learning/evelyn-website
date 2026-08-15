/**
 * Algebra 1 — Exponential Functions & Their Graphs.
 *
 * The first family where the variable lives in the EXPONENT (CCSS
 * F-IF.C.7e, F-LE.A.1): read a and b out of y = a·bˣ, tell growth from
 * decay, and spot the constant-ratio fingerprint that separates
 * exponential data from linear data.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U6_EXPONENTIAL_FUNCTIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.exponential-functions.v1',
  title: 'Exponential Functions & Their Graphs',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.exponential-functions',
      standard: 'ALG1-6.3',
      description:
        'Identify and evaluate exponential functions of the form y = a·bˣ, read the y-intercept a and the factor b, classify growth versus decay, and distinguish exponential from linear behavior by constant ratio versus constant difference (CCSS F-IF.C.7e, F-LE.A.1).',
    },
  ],
  prerequisites: ['alg1.negative-exponents-scientific-notation'],
  followUps: ['alg1.exponential-growth-decay'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the gap between adding-per-step and multiplying-per-step feel physically shocking, so the new function family earns its own name.',
      script:
        'Fold a sheet of paper in half 42 times and it would reach the moon. That sounds like a lie — a sheet of paper is thin, and 42 is a small number. But every fold DOUBLES the thickness instead of adding to it, and doubling is a completely different engine from adding. Every function you have graphed so far added the same amount per step. Today we meet the family that multiplies instead.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-form-and-shape',
      kind: 'concept',
      goal: 'Read a and b out of y = a·bˣ, connect them to the graph, and separate exponential from linear using ratios vs differences.',
      keyIdeas: [
        'THE FORM — an exponential function is y = a·bˣ, where the variable sits in the EXPONENT. Compare x² (variable in the base, a parabola) with 2ˣ (variable in the exponent, a whole different shape).',
        'a IS THE y-INTERCEPT — at x = 0 the power collapses, because b⁰ = 1, so y = a·1 = a. The graph always passes through (0, a). For y = 4·3ˣ the y-intercept is 4, never 3.',
        'b IS THE CONSTANT RATIO — every time x goes up by 1, y gets MULTIPLIED by b. That is the fingerprint: not "add b", multiply by b.',
        'GROWTH vs DECAY — b > 1 gives growth (the graph rises to the right); 0 < b < 1 gives decay (it falls to the right); b = 1 is the flat line y = a. Standard exponentials use b > 0.',
        'GRAPH SHAPE — with a > 0 the curve stays above the x-axis forever, flattening toward the horizontal asymptote y = 0 on one side and shooting up on the other. It never crosses zero, so an exponential has no x-intercept.',
        'LINEAR vs EXPONENTIAL FROM A TABLE — with x values equally spaced, subtract consecutive y values: a constant DIFFERENCE means linear. Divide consecutive y values instead: a constant RATIO means exponential.',
        'EVALUATING — exponent FIRST, then multiply by a. For y = 5·2ˣ at x = 4: 2⁴ = 16, then 5·16 = 80. Never fold the 5 into the base to get 10⁴.',
        'GOING LEFT — negative inputs divide instead of multiply, since b⁻¹ = 1/b. For y = 5·3ˣ at x = −1, y = 5·(1/3) = 5/3.',
      ],
      vocabulary: [
        { term: 'exponential function', definition: 'a function of the form y = a·bˣ — the variable is the exponent.' },
        { term: 'constant ratio', definition: 'the fixed number b that each y value is multiplied by per unit step in x.' },
        { term: 'growth / decay factor', definition: 'b > 1 makes y larger each step (growth); 0 < b < 1 makes y smaller each step (decay).' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-read-and-evaluate',
      kind: 'worked_example',
      problem: 'For y = 4·3ˣ, state the y-intercept, say whether it is growth or decay, and find y when x = 3.',
      steps: [
        'Match to y = a·bˣ: a = 4 and b = 3.',
        'y-intercept: at x = 0, 3⁰ = 1, so y = 4·1 = 4. The graph passes through (0, 4).',
        'b = 3 is greater than 1, so this is growth — y triples every time x goes up by 1.',
        'Evaluate at x = 3: exponent first, 3³ = 27, then 4·27 = 108.',
        'Sense-check with the table: 4, 12, 36, 108 for x = 0, 1, 2, 3 — each entry is 3 times the one before. ✓',
      ],
      answer: 'y-intercept 4; growth (b = 3); y = 108 at x = 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-decay-order-trap',
      kind: 'worked_example',
      problem: 'Evaluate y = 96·(1/2)ˣ at x = 4, and classify the function.',
      steps: [
        'Here a = 96 and b = 1/2. Since 1/2 is between 0 and 1, this is DECAY — y halves each step.',
        'THE TRAP: do not multiply 96·(1/2) = 48 first and then raise it to the 4th power. That gives 48⁴ = 5,308,416, which is absurd for a shrinking function.',
        'Exponent first: (1/2)⁴ = 1/16.',
        'Now multiply by a: 96·(1/16) = 6.',
        'Sense-check by halving four times from the y-intercept: 96 → 48 → 24 → 12 → 6. ✓',
      ],
      answer: 'y = 6; decay, with y-intercept 96',
      estimatedMinutes: 3,
    },
    {
      id: 'try-table-ratio',
      kind: 'try_yourself',
      problem: 'A table pairs x = 0, 1, 2, 3 with y = 5, 15, 45, 135. Which statement describes this data?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Linear, with a constant difference of 10' },
        { id: 'b', text: 'Exponential, with a constant ratio of 3', correct: true },
        { id: 'c', text: 'Exponential, with a constant ratio of 10' },
        { id: 'd', text: 'Linear, with a constant difference of 3' },
      ],
      expectedAnswer: 'Exponential, with a constant ratio of 3',
      hints: [
        'Subtract consecutive y values first: 10, 30, 90. Those are not equal, so it is not linear.',
        'Now divide consecutive y values: 15/5 and 45/15.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-intercept',
      kind: 'try_yourself',
      problem: 'Which statement is true about y = 7·(0.4)ˣ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is decay, and its y-intercept is 7', correct: true },
        { id: 'b', text: 'It is growth, and its y-intercept is 7' },
        { id: 'c', text: 'It is decay, and its y-intercept is 0.4' },
        { id: 'd', text: 'It is decay, and its y-intercept is 0' },
      ],
      expectedAnswer: 'It is decay, and its y-intercept is 7',
      hints: [
        'The y-intercept is the value at x = 0, and any nonzero base raised to the 0 power is 1.',
        '0.4 is between 0 and 1, so each step multiplies y by less than 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Evaluate y = 5·2ˣ when x = 4. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '80',
      hints: ['Handle the exponent before the multiplication: what is 2⁴?', '2⁴ = 16, so multiply 5 by 16.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-coefficient-into-base',
      kind: 'misconception_check',
      question: 'A student claims y = 2·5ˣ and y = 10ˣ are the same function, because 2·5 = 10. Check both at x = 2 — are they?',
      commonErrors: [
        {
          answer: 'Yes, they are the same function',
          misconception: 'Folding the coefficient a into the base b — but the exponent applies only to b, never to a.',
          correctsTo: 'No. At x = 2, 2·5² = 2·25 = 50, while 10² = 100. Order of operations raises b to the power FIRST, then multiplies by a. Their y-intercepts differ too: 2·5⁰ = 2 versus 10⁰ = 1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = a·bˣ — the variable is the exponent, not the base.',
        'a is the y-intercept, because b⁰ = 1; the graph always passes through (0, a).',
        'b > 1 is growth, 0 < b < 1 is decay, and b is the constant ratio applied per step.',
        'Linear tables have a constant difference; exponential tables have a constant ratio.',
        'Evaluate the power first, then multiply by a: 5·2⁴ = 80, not 10⁴.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Exponential Functions & Their Graphs' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
