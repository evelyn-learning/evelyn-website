/**
 * K-2 Math — Place Value (Hundreds, Tens, Ones).
 */

import type { LessonPlan } from '../types';

export const SEED_K2_MATH_PLACE_VALUE_DEEP: LessonPlan = {
  id: 'evelyn.k2.math.place-value-deep.v1',
  title: 'K-2 Math — Place Value: Hundreds, Tens, Ones',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'math',
  topic: 'place-value',
  locale: 'en',
  los: [{ id: 'k2.math.place-value-deep', description: 'Identify the value of each digit in a 2- or 3-digit number based on its place.', standard: 'CCSS.MATH.CONTENT.2.NBT.A.1' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Why does 24 mean something different from 42?', script: 'Same digits — 2 and 4 — but their POSITION changes everything. The 4 in 24 is just four. The 4 in 42 is forty. Position controls value: that\'s place value.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Hundreds-tens-ones positions, expanded form, comparing.', keyIdeas: [
      'A digit\'s VALUE depends on its POSITION (place).',
      'ONES place: rightmost. Worth 1× the digit. (5 in 25 = 5 ones = 5.)',
      'TENS place: next to the left. Worth 10× the digit. (2 in 25 = 2 tens = 20.)',
      'HUNDREDS place: next. Worth 100×. (3 in 325 = 3 hundreds = 300.)',
      'EXPANDED FORM: 245 = 200 + 40 + 5.',
      'COMPARING numbers: line up by place. Compare hundreds first, then tens, then ones.',
      'Trading: 10 ones = 1 ten. 10 tens = 1 hundred. This idea lets us regroup in addition / subtraction.',
    ], vocabulary: [{ term: 'place value', definition: 'the value a digit has based on its position in a number.' }, { term: 'expanded form', definition: 'writing a number as the sum of each digit\'s value (e.g., 234 = 200 + 30 + 4).' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Write 357 in expanded form. What is the value of the 5?', steps: [
      'Look at each digit and its position. 3 is in hundreds (3 × 100 = 300). 5 is in tens (5 × 10 = 50). 7 is in ones (7 × 1 = 7).',
      'Expanded form: 357 = 300 + 50 + 7.',
      'The 5 is in the TENS place — its value is 50.',
    ], answer: '300 + 50 + 7. The 5 is worth 50.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Compare: 487 and 478. Which is larger?', expectedAnswer: 'Both have 4 in hundreds. Tens: 487 has 8, 478 has 7. 8 > 7, so 487 is larger. (Don\'t need to look at ones.)', responseFormat: 'free', hints: ['Compare digit-by-digit from the LEFT (hundreds first).', 'Stop at the first place where they differ.'], estimatedMinutes: 2 },
    { id: 'misconception-position', kind: 'misconception_check', question: 'A student says "67 and 76 are the same because they have the same digits."', commonErrors: [{ answer: 'Same digits = same number', misconception: 'Ignoring positional value.', correctsTo: 'POSITION decides value. In 67, the 6 is tens (60) and 7 is ones (7) → total 67. In 76, the 7 is tens (70) and 6 is ones (6) → total 76. Different positions give different values, so they\'re different numbers.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Position controls value: ones, tens, hundreds.', 'Expanded form: each digit times its place value, summed.', 'Compare numbers digit-by-digit from the left.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
