/**
 * G5 — Divisibility rules.
 *
 * Quick checks: 2, 3, 5, 6, 9, 10. Very useful for fraction
 * simplification and factoring.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_DIVISIBILITY_RULES: LessonPlan = {
  id: 'evelyn.g5.math.numbers.divisibility-rules.v1',
  title: 'Divisibility rules',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'numbers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.nbt.b.6',
      description: 'Find whole-number quotients of whole numbers using strategies based on place value, properties of operations, and the relationship between multiplication and division.',
      standard: 'CCSS.MATH.CONTENT.5.NBT.B.6',
    },
  ],
  prerequisites: ['ccss.math.4.oa.b.4'],
  followUps: ['ccss.math.6.ns.b.4'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show divisibility rules as math shortcuts.',
      script: 'Is 1,234,567,890 divisible by 5? You don\'t need to divide — just look at the LAST DIGIT. It\'s 0, so yes! Divisibility rules give you instant answers to "does this divide evenly?"',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Six common divisibility rules.',
      keyIdeas: [
        'DIVISIBLE BY 2: the LAST digit is 0, 2, 4, 6, or 8 (i.e., the number is EVEN). 354 ✓, 357 ✗.',
        'DIVISIBLE BY 5: the LAST digit is 0 or 5. 280 ✓, 283 ✗.',
        'DIVISIBLE BY 10: the LAST digit is 0. 270 ✓, 275 ✗.',
        'DIVISIBLE BY 3: the SUM OF DIGITS is divisible by 3. 153 → 1+5+3 = 9, divisible by 3 ✓. 154 → 10, not ✗.',
        'DIVISIBLE BY 9: the SUM OF DIGITS is divisible by 9. 459 → 4+5+9 = 18, divisible by 9 ✓.',
        'DIVISIBLE BY 6: divisible by BOTH 2 AND 3. (Because 6 = 2×3.) 354 → even ✓, sum = 12, div by 3 ✓ → div by 6 ✓.',
      ],
      vocabulary: [
        { term: 'divisible', definition: 'one number divides another evenly with no remainder.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-test',
      kind: 'worked_example',
      problem: 'Is 432 divisible by 6?',
      steps: [
        'Rule: divisible by 6 means divisible by BOTH 2 AND 3.',
        'Check 2: last digit is 2 → even → ✓.',
        'Check 3: digits sum 4+3+2 = 9. Is 9 divisible by 3? Yes (9 = 3×3) → ✓.',
        'Both pass → 432 IS divisible by 6.',
        'Verify: 432 ÷ 6 = 72. ✓',
      ],
      answer: 'yes — divisible by both 2 and 3, hence by 6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is 783 divisible by 3?',
      expectedAnswer: 'yes',
      responseFormat: 'free',
      hints: [
        'Sum the digits: 7 + 8 + 3 = ?',
        'Is that sum divisible by 3?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-9-implies-3',
      kind: 'misconception_check',
      question: 'If a number IS divisible by 9, is it also divisible by 3?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Treating divisibility by 9 and 3 as independent.',
          correctsTo: 'YES — every multiple of 9 is also a multiple of 3 (since 9 = 3 × 3). The reverse is NOT true: 12 is divisible by 3 but not 9. So div by 9 → div by 3 (one direction only).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Div by 2: last digit even.',
        'Div by 5: last digit 0 or 5.',
        'Div by 10: last digit 0.',
        'Div by 3: digit sum divisible by 3.',
        'Div by 9: digit sum divisible by 9.',
        'Div by 6: div by BOTH 2 and 3.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Make up a 6-digit number divisible by 9 that uses each digit 0-9 at most once.',
      hint: 'Pick 6 digits whose sum is a multiple of 9. Example: 9+8+7+5+4+3 = 36. Arrange them: 987543, or 543789, etc.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
