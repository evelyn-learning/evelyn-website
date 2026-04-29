/**
 * Grade 2 Math — Add and Subtract within 100.
 * CCSS 2.NBT.B.5: Fluently add/subtract within 100.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_ADD_SUBTRACT_WITHIN_100: LessonPlan = {
  id: 'evelyn.g2.math.add-subtract-within-100.v1',
  title: 'Add and Subtract within 100',
  curriculum: 'CCSS', grade: '2', subject: 'math', topic: 'operations', locale: 'en',
  los: [{ id: 'ccss.2.nbt.b.5', description: 'Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.', standard: 'CCSS.2.NBT.B.5' }],
  prerequisites: ['g1.math.add-within-20', 'g1.math.subtract-within-20'], followUps: [], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in bigger numbers.', script: 'You have 47 stickers. Your friend gives you 36 more. How many do you have? With bigger numbers, we need new strategies — let\'s learn them.', estimatedMinutes: 2 },
    { id: 'concept-place-value', kind: 'concept', goal: 'Add/subtract by tens and ones separately.', keyIdeas: [
      'BREAK numbers into TENS and ONES.',
      '  · 47 = 40 + 7. 36 = 30 + 6.',
      'ADD tens to tens, ones to ones.',
      '  · 40 + 30 = 70. 7 + 6 = 13.',
      '  · 70 + 13 = 83.',
      'REGROUPING: when ones add to more than 9, the extra goes into the tens.',
      '  · 7 + 6 = 13 → 1 ten + 3 ones. The 1 carries over.',
      'For SUBTRACTION: sometimes you need to "BORROW" from the tens.',
      '  · 52 - 28: ones are 2 - 8 → can\'t. Borrow 1 ten: now ones are 12 - 8 = 4. Tens are 4 - 2 = 2. Answer: 24.',
    ], vocabulary: [{ term: 'regroup', definition: 'trade 10 ones for 1 ten (or back).' }, { term: 'place value', definition: 'value of a digit based on its position.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 5 },
    { id: 'worked-add', kind: 'worked_example', problem: 'Solve 47 + 36 using place value.', steps: [
      '47 = 40 + 7. 36 = 30 + 6.',
      'Add tens: 40 + 30 = 70.',
      'Add ones: 7 + 6 = 13.',
      'Combine: 70 + 13 = 83.',
      'Or stack vertically:  47 + 36. Ones: 7+6=13, write 3, carry 1. Tens: 4+3+1=8. Answer: 83.',
    ], answer: '83. Break apart, add parts, recombine.', estimatedMinutes: 4 },
    { id: 'worked-sub', kind: 'worked_example', problem: 'Solve 52 - 28.', steps: [
      'Ones: 2 - 8. Can\'t (2 < 8). BORROW 1 ten from the tens column.',
      'Now we have 12 - 8 = 4 in ones. Tens column: was 5, now 4.',
      'Tens: 4 - 2 = 2.',
      'Answer: 24.',
    ], answer: '24. Borrow when ones aren\'t big enough.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Solve 35 + 49.', expectedAnswer: '84. Tens: 30 + 40 = 70. Ones: 5 + 9 = 14. Combine: 70 + 14 = 84.', responseFormat: 'numeric', hints: ['Add tens to tens.', 'Add ones to ones, then combine.'], estimatedMinutes: 3 },
    { id: 'misconception-no-regroup', kind: 'misconception_check', question: 'A friend writes "27 + 18 = 35" by just adding columns: 2+1=3 and 7+8=15, then writes 315. Wrong?', commonErrors: [{ answer: '315 is right.', misconception: 'Forgetting to regroup.', correctsTo: '7 + 8 = 15 means 1 TEN + 5 ONES. The 1 must CARRY over to the tens column. Tens: 2 + 1 + 1 = 4. Ones: 5. Answer: 45. (Not 315 — that\'s far too big!)' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Add tens-to-tens, ones-to-ones.', 'Regroup when ones overflow (carry).', 'Borrow when ones can\'t subtract (subtraction).', 'Place value is the key.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
