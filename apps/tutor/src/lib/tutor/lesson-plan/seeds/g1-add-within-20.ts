/**
 * Grade 1 Math — Addition within 20.
 * CCSS 1.OA.C.6: Add and subtract within 20.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_ADD_WITHIN_20: LessonPlan = {
  id: 'evelyn.g1.math.add-within-20.v1',
  title: 'Addition within 20',
  curriculum: 'CCSS', grade: '1', subject: 'math', topic: 'operations', locale: 'en',
  los: [{ id: 'ccss.1.oa.c.6', description: 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10.', standard: 'CCSS.1.OA.C.6' }],
  prerequisites: ['k.math.counting-to-100'], followUps: ['g1.math.subtract-within-20'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in real-world adding.', script: 'You have 7 stickers. A friend gives you 6 more. How many do you have? That\'s ADDITION — putting two amounts together.', estimatedMinutes: 2 },
    { id: 'concept-strategies', kind: 'concept', goal: 'Use strategies to add: count on, doubles, make-10.', keyIdeas: [
      'COUNT ON: start with the bigger number, count up the smaller one.',
      '  · 7 + 3: start at 7, count "8, 9, 10."',
      'DOUBLES: facts you\'ve memorized: 1+1=2, 2+2=4, ... 9+9=18.',
      'NEAR DOUBLES: if 7+7=14, then 7+8 = 15 (one more).',
      'MAKE 10: split a number to get to 10 first.',
      '  · 8 + 5: 8 + 2 = 10, then 10 + 3 = 13.',
      'TENS + ONES: 10 + 7 = 17. Just put the ones digit after the 1.',
    ], vocabulary: [{ term: 'sum', definition: 'answer to an addition problem.' }, { term: 'addend', definition: 'a number being added.' }], estimatedMinutes: 5 },
    { id: 'concept-commutative', kind: 'concept', goal: 'Order doesn\'t matter in addition.', keyIdeas: [
      'COMMUTATIVE PROPERTY: 3 + 5 = 5 + 3. Both equal 8.',
      'You can ALWAYS start with the bigger number.',
      'Knowing this cuts memorization in half.',
    ], estimatedMinutes: 2 },
    { id: 'worked-make10', kind: 'worked_example', problem: 'Solve 9 + 7 using the make-10 strategy.', steps: [
      'Start with 9. How much to make 10? 1 more.',
      'Take 1 from the 7. Now we have 9 + 1 = 10. And 7 - 1 = 6 left.',
      'So 9 + 7 = 10 + 6 = 16.',
    ], answer: '16. Make-10 makes hard problems easier.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'What is 8 + 6? Use any strategy.', expectedAnswer: '14. Make-10: 8 + 2 = 10, then 10 + 4 = 14. Or doubles: 7 + 7 = 14, and 8 + 6 is the same total. Or count on: 8, then "9, 10, 11, 12, 13, 14."', responseFormat: 'numeric', hints: ['Try make-10 (8 + 2 = 10).', 'Or use doubles (7 + 7 = 14).'], estimatedMinutes: 3 },
    { id: 'misconception-bigger-second', kind: 'misconception_check', question: 'A friend says "in 3 + 8, you have to start with 3." Right?', commonErrors: [{ answer: 'Yes — left to right.', misconception: 'Insisting on left-to-right order.', correctsTo: 'You can start with EITHER number — addition is commutative. Most kids find it easier to start with the BIGGER number (8) and count on the smaller (3). Same answer either way: 11.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Strategies: count on, doubles, make-10.', 'Order doesn\'t matter: 3+5 = 5+3.', 'Start with the bigger number to count on.', 'Practice doubles to memorize them.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
