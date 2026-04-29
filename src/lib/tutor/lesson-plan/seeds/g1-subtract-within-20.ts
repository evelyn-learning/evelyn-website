/**
 * Grade 1 Math — Subtraction within 20.
 * CCSS 1.OA.C.6: Subtract within 20.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_SUBTRACT_WITHIN_20: LessonPlan = {
  id: 'evelyn.g1.math.subtract-within-20.v1',
  title: 'Subtraction within 20',
  curriculum: 'CCSS', grade: '1', subject: 'math', topic: 'operations', locale: 'en',
  los: [{ id: 'ccss.1.oa.c.6', description: 'Add and subtract within 20.', standard: 'CCSS.1.OA.C.6' }],
  prerequisites: ['g1.math.add-within-20'], followUps: [], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in real-life subtraction.', script: 'You have 13 apples. You eat 5. How many left? That\'s SUBTRACTION — taking away.', estimatedMinutes: 2 },
    { id: 'concept-strategies', kind: 'concept', goal: 'Strategies for subtraction: count back, count up, fact families.', keyIdeas: [
      'COUNT BACK: start with the bigger number, count down by the smaller.',
      '  · 12 - 3: start at 12, count "11, 10, 9."',
      'COUNT UP: think "what plus the smaller = the bigger?"',
      '  · 12 - 9: count up from 9 to 12 → 3 jumps. So answer is 3.',
      'FACT FAMILIES: every addition fact has a subtraction partner.',
      '  · 7 + 5 = 12 → 12 - 5 = 7 and 12 - 7 = 5.',
      'NOT COMMUTATIVE: 8 - 3 ≠ 3 - 8. Order matters.',
      'TENS first: 17 - 7 = 10. Then keep going if needed.',
    ], vocabulary: [{ term: 'difference', definition: 'answer to a subtraction problem.' }], estimatedMinutes: 5 },
    { id: 'concept-relate', kind: 'concept', goal: 'Subtraction "undoes" addition.', keyIdeas: [
      'Addition and subtraction are OPPOSITES.',
      'If you add 5 then subtract 5, you\'re back where you started.',
      'Use addition to check subtraction: 12 - 5 = 7. Check: 7 + 5 = 12. ✓',
    ], estimatedMinutes: 3 },
    { id: 'worked-count-up', kind: 'worked_example', problem: 'Solve 14 - 8 using count-up.', steps: [
      'Start at 8. Count up to 14.',
      '8 → 9 (1), 9 → 10 (2), 10 → 11 (3), 11 → 12 (4), 12 → 13 (5), 13 → 14 (6).',
      'It took 6 jumps. So 14 - 8 = 6.',
      'Check by adding: 8 + 6 = 14. ✓',
    ], answer: '6. Count-up works well when the numbers are close.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'What is 16 - 7?', expectedAnswer: '9. Count back from 16 by 7: 15, 14, 13, 12, 11, 10, 9 — landed on 9. Or count up from 7: 7+9=16. Or fact family: if 9+7=16, then 16-7=9.', responseFormat: 'numeric', hints: ['Try counting up from 7.', 'Or use the fact 9 + 7 = 16.'], estimatedMinutes: 3 },
    { id: 'misconception-order-matters', kind: 'misconception_check', question: 'A friend says "5 - 8 is the same as 8 - 5." Right?', commonErrors: [{ answer: 'Yes — same answer.', misconception: 'Treating subtraction like addition.', correctsTo: 'NO! Subtraction order MATTERS. 8 - 5 = 3. But 5 - 8 = -3 (a negative — you take more than you have). Different answers. Subtraction is NOT commutative.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Strategies: count back, count up, fact families.', 'Subtraction undoes addition.', 'Order matters: 8 - 5 ≠ 5 - 8.', 'Check by adding back.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
