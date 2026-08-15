/**
 * Algebra 1 — Foundations: Real Numbers & Operations.
 *
 * The number system Algebra 1 actually runs on (CCSS N-RN.B.3): which
 * numbers are rational vs irrational, how signs behave under +, −, ×, ÷,
 * absolute value as distance, and the three properties (commutative,
 * associative, distributive) that license every later algebraic move.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U1_REAL_NUMBERS_OPERATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.real-numbers-operations.v1',
  title: 'Real Numbers & Operations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.real-numbers-operations',
      standard: 'ALG1-1.1',
      description:
        'Classify real numbers as rational or irrational, compute fluently with signed numbers and absolute value as distance, and use the commutative, associative, and distributive properties to justify each step (CCSS N-RN.B.3, 7.NS.A.1).',
    },
  ],
  prerequisites: [],
  followUps: ['alg1.order-of-operations'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame signed numbers and the number sets as the everyday toolkit every later Algebra 1 skill quietly assumes.',
      script:
        'A bank balance of negative 40 dollars, a temperature of −12 degrees, an elevation 8 feet below sea level — negatives describe the real world, not just worksheets. Algebra 1 will hand you thousands of these numbers and never slow down to explain the signs again. So today we lock in three things: which numbers live where, how signs behave, and what absolute value really measures.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-real-numbers',
      kind: 'concept',
      goal: 'Build the real-number map, the signed-arithmetic rules, absolute value as distance, and the three properties.',
      keyIdeas: [
        'THE SETS NEST — counting numbers sit inside whole numbers, which sit inside integers (… −2, −1, 0, 1, 2 …), which sit inside the RATIONALS. A rational number is any number you can write as a fraction a/b of two integers with b ≠ 0, which is exactly the terminating decimals (0.75) and the repeating ones (0.333…).',
        'IRRATIONALS FILL THE GAPS — numbers like √2, √10, and π have decimals that never end and never repeat, so no fraction of integers equals them. Rationals plus irrationals together make the REAL numbers. Roots are the usual trap: √9 = 3 is rational because 9 is a perfect square, while √10 is irrational — the root symbol alone does not mean irrational.',
        'CLOSURE (the N-RN.B.3 rules) — rational + rational and rational × rational are always rational. Rational + irrational is ALWAYS irrational. Nonzero rational × irrational is always irrational — the word nonzero matters, since 0 · √2 = 0 is rational.',
        'SIGNED ADDING — same signs: add the absolute values and keep that sign, so −6 + (−5) = −11. Different signs: subtract the smaller absolute value from the larger and keep the sign of the larger, so −6 + 5 = −1.',
        'SUBTRACTING IS ADDING THE OPPOSITE — rewrite every subtraction before you compute: 5 − (−3) becomes 5 + 3 = 8. Two negatives in a row is the single most-missed step.',
        'SIGNED MULTIPLYING AND DIVIDING — same signs give a positive, different signs give a negative: (−4)(−3) = 12 but (−4)(3) = −12. Watch the exponent gotcha: (−3)² = 9 while −3² = −9, because with no parentheses the square applies to the 3 and the minus stays outside.',
        'ABSOLUTE VALUE IS DISTANCE FROM ZERO — |−7| = 7 and |7| = 7, so it is never negative. The distance between two numbers a and b is |a − b|. A minus sign OUTSIDE the bars survives: −|7| = −7.',
        'THE THREE PROPERTIES — commutative (a + b = b + a, ab = ba) and associative (regrouping) hold for addition and multiplication ONLY; 5 − 3 ≠ 3 − 5. Distributive is the bridge between them: a(b + c) = ab + ac, the move behind every expansion you will do this year.',
      ],
      vocabulary: [
        { term: 'rational number', definition: 'a number expressible as a/b with integers a and b, b ≠ 0 — its decimal terminates or repeats.' },
        { term: 'irrational number', definition: 'a real number whose decimal never terminates and never repeats, such as √2 or π.' },
        { term: 'absolute value', definition: 'the distance of a number from 0 on the number line, written |x| and never negative.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-signed-arithmetic',
      kind: 'worked_example',
      problem: 'Evaluate: −8 + 3 − (−5) + |−4|',
      steps: [
        'Rewrite the subtraction as adding the opposite: − (−5) becomes + 5, giving −8 + 3 + 5 + |−4|.',
        'Absolute value first: |−4| is the distance from 0, which is 4. Now the expression is −8 + 3 + 5 + 4.',
        'Add the positives: 3 + 5 + 4 = 12.',
        'Combine with the negative: −8 + 12 = 4, since the signs differ we subtract 8 from 12 and keep the positive sign.',
      ],
      answer: '4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classify-edge-case',
      kind: 'worked_example',
      problem: 'Classify each result as rational or irrational: (a) 0.75 + √16, (b) 3 + √5, (c) √2 · √2',
      steps: [
        '(a) √16 = 4 because 16 is a perfect square, so this is 0.75 + 4 = 4.75 — a terminating decimal, therefore RATIONAL. The root symbol did not make it irrational.',
        '(b) 5 is not a perfect square, so √5 is irrational. Rational + irrational is always irrational, so 3 + √5 is IRRATIONAL. There is no way the endless non-repeating decimal cancels out.',
        '(c) The edge case: √2 · √2 = 2, which is RATIONAL. Two irrationals multiplied can land back on a rational — the closure rules only promise things about rational + irrational and nonzero rational × irrational.',
        'Takeaway: check whether the radicand is a perfect square first, then apply the closure rule that matches the operation.',
      ],
      answer: '(a) rational, (b) irrational, (c) rational',
      estimatedMinutes: 3,
    },
    {
      id: 'try-signed',
      kind: 'try_yourself',
      problem: 'Evaluate: −6 − (−9) + (−4)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−1', correct: true },
        { id: 'b', text: '−19' },
        { id: 'c', text: '7' },
        { id: 'd', text: '−11' },
      ],
      expectedAnswer: '−1',
      hints: [
        'Rewrite each subtraction as adding the opposite before you combine anything.',
        '−6 + 9 = 3, and adding (−4) to 3 moves you back down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem: 'Which statement is ALWAYS true for real numbers?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sum of two irrational numbers is irrational.' },
        { id: 'b', text: 'The product of a nonzero rational number and an irrational number is irrational.', correct: true },
        { id: 'c', text: 'The square root of any whole number is irrational.' },
        { id: 'd', text: 'Every rational number is an integer.' },
      ],
      expectedAnswer: 'The product of a nonzero rational number and an irrational number is irrational.',
      hints: [
        'Try to break each statement with one counterexample — √2 + (−√2), √9, and 1/2 are useful test cases.',
        'Three of these fail on a single example; only one is a closure rule that never breaks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'What is the distance between −7 and 4 on the number line? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '11',
      hints: [
        'Distance between a and b is |a − b| — subtract, then take the absolute value.',
        '|−7 − 4| = |−11|, and absolute value reports distance, never a negative.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-absolute-value-sign',
      kind: 'misconception_check',
      question: 'A student says −|−6| = 6, reasoning that "absolute value makes everything positive." What went wrong?',
      commonErrors: [
        {
          answer: '6',
          misconception: 'Treating absolute value as a rule that erases every minus sign in sight, including the one sitting outside the bars.',
          correctsTo: 'Absolute value only acts on what is INSIDE the bars: |−6| = 6. The minus outside then applies to that result, so −|−6| = −6. Compare |−6| = 6 with −|−6| = −6 — the bars close before the outside sign gets its turn.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rationals are the fractions of integers — terminating or repeating decimals; irrationals like √2 and π are neither. Together they are the reals.',
        'Rational + irrational is always irrational, and nonzero rational × irrational is always irrational — but irrational × irrational can be rational (√2 · √2 = 2).',
        'Rewrite every subtraction as adding the opposite; same signs multiply to a positive, different signs to a negative, and (−3)² = 9 while −3² = −9.',
        '|x| is distance from 0, so it is never negative, the gap between a and b is |a − b|, and a minus outside the bars survives: −|7| = −7.',
        'Commutative and associative apply to + and × only; distributive, a(b + c) = ab + ac, is the property you will lean on all year.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Real Numbers & Operations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
