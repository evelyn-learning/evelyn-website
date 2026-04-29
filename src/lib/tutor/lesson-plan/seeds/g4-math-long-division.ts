/**
 * G4 — Long division (1-digit divisor, multi-digit dividend).
 *
 * The "divide-multiply-subtract-bring-down" loop, taught with a strict
 * place-value framing so students don't lose track of what each digit
 * means. Includes remainders and connects back to the multiplication
 * fact that drives each step.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_MATH_LONG_DIVISION: LessonPlan = {
  id: 'evelyn.g4.math.long-division.v1',
  title: 'Long Division',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'division',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.4.nbt.b.6',
      description: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors.',
      standard: 'CCSS.MATH.CONTENT.4.NBT.B.6',
    },
  ],
  prerequisites: ['ccss.math.3.oa.b.6', 'ccss.math.3.nbt.a.1'],
  followUps: ['ccss.math.5.nbt.b.6'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame long division as a structured loop, not a magic ritual.',
      script: 'You have 84 candies and 4 friends to share them with. How many does each friend get? You COULD deal them out one by one. Or you could use a four-step rhythm: divide, multiply, subtract, bring down. Same answer, way faster.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-loop',
      kind: 'concept',
      goal: 'The DMSB loop: Divide, Multiply, Subtract, Bring down. Repeat until done.',
      keyIdeas: [
        'Long division works ONE digit at a time, left to right, in the dividend.',
        'For each digit: DIVIDE (how many times does the divisor fit?), MULTIPLY (back-check), SUBTRACT (what\'s left?), BRING DOWN (next digit).',
        'Keep going until you\'ve used every digit of the dividend.',
        'If the divisor doesn\'t go into the current piece (it\'s smaller), the quotient digit is 0 — and you bring down anyway.',
        'Whatever\'s left at the end is the REMAINDER.',
        'You can always check: (quotient × divisor) + remainder = dividend.',
      ],
      vocabulary: [
        { term: 'dividend', definition: 'the number being divided (the total).' },
        { term: 'divisor', definition: 'the number you\'re dividing by.' },
        { term: 'quotient', definition: 'the answer to division.' },
        { term: 'remainder', definition: 'whatever\'s left over when the division doesn\'t come out evenly.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-84-div-4',
      kind: 'worked_example',
      problem: 'Compute 84 ÷ 4.',
      steps: [
        'Set up: 4 ⟌ 84. Look at the first digit: 8.',
        'DIVIDE: how many 4s in 8? Two. Write 2 above the 8.',
        'MULTIPLY: 2 × 4 = 8.',
        'SUBTRACT: 8 − 8 = 0.',
        'BRING DOWN the 4 → 04.',
        'DIVIDE: how many 4s in 4? One. Write 1 above the 4.',
        'MULTIPLY: 1 × 4 = 4. SUBTRACT: 4 − 4 = 0. Done — no remainder.',
        'Quotient = 21.',
      ],
      answer: '21',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-93-div-4',
      kind: 'worked_example',
      problem: 'Compute 93 ÷ 4 (with remainder).',
      steps: [
        'Set up: 4 ⟌ 93.',
        'How many 4s in 9? Two. (3 fours = 12, too many. So 2.) Write 2 above 9.',
        '2 × 4 = 8. 9 − 8 = 1.',
        'Bring down the 3 → 13.',
        'How many 4s in 13? Three. (3 × 4 = 12.) Write 3 above the 3.',
        '3 × 4 = 12. 13 − 12 = 1.',
        'No more digits to bring down. Remainder = 1.',
        'Answer: 23 remainder 1, or 23 R1.',
      ],
      answer: '23 R1',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute 156 ÷ 6.',
      expectedAnswer: '26',
      responseFormat: 'numeric',
      hints: [
        '6 doesn\'t go into 1, so look at 15. How many 6s in 15?',
        '6 goes into 15 twice (12). Subtract: 15 − 12 = 3. Bring down the 6 → 36.',
        '6 × 6 = 36, so the next digit is 6.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-zero-quotient',
      kind: 'misconception_check',
      question: 'When dividing 612 ÷ 6, after 6 ÷ 6 = 1, the next piece is 1 (the next digit, before bringing down the 2). 6 doesn\'t fit into 1. What do you write?',
      commonErrors: [
        {
          answer: 'skip that step',
          misconception: 'Skipping a digit when the divisor doesn\'t fit, which loses place value.',
          correctsTo: 'Write 0 in the quotient for that position, then bring down the 2 to get 12. Now 6 fits twice. Skipping makes the quotient 12 instead of 102 — wrong by a factor of 10.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Long division loop: Divide → Multiply → Subtract → Bring down.',
        'One digit of the quotient at a time, left to right.',
        'When the divisor doesn\'t fit, write 0 — never skip.',
        'Whatever\'s left at the end is the remainder.',
        'Check: (quotient × divisor) + remainder = dividend.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute 825 ÷ 5. Try the loop yourself, then check your answer with multiplication.',
      hint: 'Quotient should be 165. Verify: 165 × 5 = 825.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
