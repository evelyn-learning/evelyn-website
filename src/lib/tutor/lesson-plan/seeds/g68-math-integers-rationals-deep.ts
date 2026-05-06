/**
 * Grades 6-8 Math — Operations with Integers and Rational Numbers.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_MATH_INTEGERS_RATIONALS_DEEP: LessonPlan = {
  id: 'evelyn.g68.math.integers-rationals-deep.v1',
  title: 'Integers & Rationals — Operations with Mixed Signs',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'integers-rational',
  locale: 'en',
  los: [{ id: 'g68.math.integers-rationals-deep', description: 'Add, subtract, multiply, and divide integers and rational numbers (positive and negative fractions/decimals) with confidence.', standard: 'CCSS.MATH.CONTENT.7.NS.A' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Negative numbers feel weird at first — but the rules are tight and predictable.', script: 'Why is −5 + 3 = −2 but −5 × 3 = −15? Two different rules. Today we lock down all four operations on positive AND negative numbers.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Sign rules for +/-/×/÷, fractions and decimals, real-world contexts.', keyIdeas: [
      'ADDITION rules:',
      '  Same signs: add the absolute values, keep the sign. (−3) + (−4) = −7.',
      '  Different signs: subtract smaller from larger absolute value, take the sign of the larger. (−5) + 3 = −2 (the 5 wins).',
      'SUBTRACTION: a − b = a + (−b). "Add the opposite." 5 − (−3) = 5 + 3 = 8.',
      'MULTIPLICATION rules (memorise!):',
      '  Same signs: positive. (−3) × (−4) = +12.',
      '  Different signs: negative. (−3) × 4 = −12.',
      '  Mnemonic: "Two negatives make a positive."',
      'DIVISION: same sign rules as multiplication.',
      '  −12 ÷ −4 = +3. −12 ÷ 4 = −3.',
      'RATIONAL NUMBERS: same rules apply to fractions + decimals.',
      '  (−1/2) + (1/3) = (−3/6) + (2/6) = −1/6.',
      '  (−0.5) × 4 = −2.0.',
      'NUMBER LINE intuition: positive moves RIGHT, negative moves LEFT. Adding a positive moves right; adding a negative moves left.',
      'REAL-WORLD: temperatures (−5°C), money (debt as negative balance), elevation (below sea level).',
    ], vocabulary: [{ term: 'absolute value', definition: 'a number\'s distance from zero, ignoring sign. |−5| = 5. |3| = 3.' }, { term: 'rational number', definition: 'a number expressible as a fraction p/q (q ≠ 0); includes positive/negative integers, fractions, decimals.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Evaluate: (−7) + 3 − (−5) × 2', steps: [
      'Order of operations: do M before A/S.',
      'M: (−5) × 2 = −10. Expression: (−7) + 3 − (−10).',
      'Subtraction: a − b = a + (−b). So −(−10) = +10. Expression: (−7) + 3 + 10.',
      'Add left-to-right: (−7) + 3. Different signs, subtract: 7 − 3 = 4, larger abs value (7) is negative → result −4.',
      '−4 + 10 = +6.',
      'Answer: 6.',
    ], answer: '6', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Evaluate: (−1/2) × (−4) + (3/4)', expectedAnswer: 'M first: (−1/2) × (−4). Same signs → positive. (1/2)(4) = 2. → 2 + 3/4 = 8/4 + 3/4 = 11/4 = 2.75 (or 2¾).', responseFormat: 'free', hints: ['M before A. Two negatives make a positive.', 'Convert to common denominator if needed.'], estimatedMinutes: 3 },
    { id: 'misconception-double-negative', kind: 'misconception_check', question: 'A student says (−3) × (−4) = −12 because "two negatives don\'t change anything." What\'s wrong?', commonErrors: [{ answer: '(−3) × (−4) = −12', misconception: 'Confusing the rules for addition with the rules for multiplication.', correctsTo: 'For MULTIPLICATION (and division), TWO NEGATIVES MAKE A POSITIVE. (−3) × (−4) = +12. The rule is: if the count of negative signs is EVEN, the result is positive; if ODD, negative. For ADDITION, the rule is different (compare absolute values, take the sign of the larger). Don\'t mix the rules.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Add same signs: keep sign, add abs values.', 'Add different signs: subtract abs values, take larger\'s sign.', 'Multiply/divide: same sign → +, different sign → −.', 'Subtract = add the opposite.', 'These rules apply to fractions and decimals too.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
