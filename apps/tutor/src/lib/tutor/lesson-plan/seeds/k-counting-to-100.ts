/**
 * Kindergarten Math — Counting to 100.
 * CCSS K.CC.A.1: count to 100 by ones and by tens.
 */

import type { LessonPlan } from '../types';

export const SEED_K_COUNTING_TO_100: LessonPlan = {
  id: 'evelyn.k.math.counting-to-100.v1',
  title: 'Counting to 100',
  curriculum: 'CCSS', grade: 'K', subject: 'math', topic: 'counting', locale: 'en',
  los: [{ id: 'ccss.k.cc.a.1', description: 'Count to 100 by ones and by tens.', standard: 'CCSS.K.CC.A.1' }],
  prerequisites: ['k.math.counting-to-10'], followUps: ['g1.math.add-within-20'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in 100.', script: 'A hundred crayons. A hundred jumping jacks. A hundred days of school. ONE HUNDRED is a big, important number — and counting to it is a math superpower.', estimatedMinutes: 2 },
    { id: 'concept-by-ones', kind: 'concept', goal: 'Count from 1 to 100 by ones; recognize the patterns.', keyIdeas: [
      'Counting by ones: 1, 2, 3, 4 ... 99, 100.',
      'Numbers come in TENS — every group of ten has the same pattern.',
      'After 9, the tens digit goes up: 9 → 10. Then 19 → 20. Then 29 → 30.',
      'PATTERN in each ten: 1, 2, 3, 4, 5, 6, 7, 8, 9, then NEXT TEN.',
      'TRICK: when stuck, look at the LAST number you said. What\'s next?',
    ], vocabulary: [{ term: 'count', definition: 'say the numbers in order.' }], estimatedMinutes: 4 },
    { id: 'concept-by-tens', kind: 'concept', goal: 'Count by tens: 10, 20, 30 ... 100.', keyIdeas: [
      'Counting by TENS: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.',
      'Each step skips by 10. Faster way to count!',
      'Useful for counting big things in groups (10 fingers, 10 toes).',
      'Notice: tens digit goes UP by 1 each step (1, 2, 3...) but ones digit stays at 0.',
    ], estimatedMinutes: 3 },
    { id: 'worked-pattern', kind: 'worked_example', problem: 'What number comes right after 39?', steps: [
      'Look at 39. Last digit is 9.',
      'When the last digit is 9, the next number ends in 0 and the tens digit goes up by 1.',
      '3 → 4. So 39 + 1 = 40.',
    ], answer: '40. After every 9 comes a new ten.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Count by tens from 10 to 100. List the numbers.', expectedAnswer: '10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Each step adds 10.', responseFormat: 'free', hints: ['Skip by ten.', 'You should say 10 numbers total.'], estimatedMinutes: 3 },
    { id: 'misconception-after-29', kind: 'misconception_check', question: 'Some kids think the number after 29 is "twenty-ten." Right?', commonErrors: [{ answer: 'Twenty-ten.', misconception: 'Continuing the pattern incorrectly.', correctsTo: 'After 29 comes THIRTY (30) — a NEW group of tens. We don\'t say "twenty-ten." Each new ten gets its own name: thirty, forty, fifty, etc.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Count by ones: 1, 2, 3 ... 100.', 'Count by tens: 10, 20, 30 ... 100.', 'After 9, the tens digit goes up.', '100 is ten groups of ten.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
