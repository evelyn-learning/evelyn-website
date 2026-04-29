/**
 * G3 — Time and Money (telling time to the minute, counting coins).
 *
 * Two practical-world G3 strands bundled into one lesson because they
 * share a base skill: skip-counting. Time uses minute marks (skip-5
 * around the clock); money uses coin values (5s, 10s, 25s). Reads
 * analog clocks, makes change, and adds dollars + cents.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_TIME_MONEY: LessonPlan = {
  id: 'evelyn.g3.math.time-money.v1',
  title: 'Telling Time and Counting Money',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.md.a.1',
      description: 'Tell and write time to the nearest minute and measure time intervals.',
      standard: 'CCSS.MATH.CONTENT.3.MD.A.1',
    },
    {
      id: 'ccss.math.2.md.c.8',
      description: 'Solve word problems involving dollar bills and coins.',
      standard: 'CCSS.MATH.CONTENT.2.MD.C.8',
    },
  ],
  prerequisites: ['ccss.math.2.md.c.7'],
  followUps: ['ccss.math.4.md.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame both skills as everyday survival math.',
      script: 'When does recess start? How much candy can I buy with these coins? Two questions every kid wants to answer fast — and they share a secret skill: counting by 5s, 10s, and 25s. Today we\'ll use it twice.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-time',
      kind: 'concept',
      goal: 'Reading an analog clock to the minute. The hour hand vs. minute hand — and why minutes go up by 5 around the dial.',
      keyIdeas: [
        'The SHORT hand is the hour. The LONG hand is the minute.',
        'There are 12 numbers around the clock, but those numbers count HOURS for the short hand and FIVES for the long hand.',
        'When the long hand points at 3, that means 15 minutes (3 × 5). When it points at 6, that\'s 30 minutes.',
        'Each tiny mark between the numbers is one minute. So if the long hand is on the second tick past the 3, it\'s 17 minutes.',
        'You read it like "3:17" — hour first, then minutes.',
      ],
      vocabulary: [
        { term: 'hour hand', definition: 'the short hand on a clock — points to the hour.' },
        { term: 'minute hand', definition: 'the long hand on a clock — points to the minutes.' },
        { term: 'analog clock', definition: 'a clock with hands and a dial (not digital numbers).' },
      ],
      suggestedTools: ['show_clock', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-clock-417',
      kind: 'worked_example',
      problem: 'The hour hand is between 4 and 5. The minute hand is on the small mark just past the 3. What time is it?',
      steps: [
        'Use show_clock to display 4:16 (hour hand at ~4, minute hand at minute 16).',
        'Look at the hour hand first — it\'s past 4 but not yet 5. So the hour is 4.',
        'Now the minute hand. It\'s pointing one tick PAST the 3.',
        'The 3 means 15 minutes (3 × 5). One tick past is 16.',
        'Put it together: 4:16.',
      ],
      answer: '4:16',
      estimatedMinutes: 3,
    },
    {
      id: 'concept-money',
      kind: 'concept',
      goal: 'Coin values and how to count a mixed handful.',
      keyIdeas: [
        'Penny = 1¢. Nickel = 5¢. Dime = 10¢. Quarter = 25¢. Half-dollar = 50¢. Dollar = 100¢.',
        'When counting a pile of coins, START with the biggest values and work down.',
        '4 quarters = 100¢ = $1.00. That\'s the easiest fact to remember.',
        'Skip-counting helps: count quarters by 25 (25, 50, 75, 100), dimes by 10, nickels by 5, pennies by 1.',
        'Cents use the ¢ symbol; dollars use $. 145 cents is $1.45 — two digits after the decimal for cents.',
      ],
      vocabulary: [
        { term: 'penny', definition: '1 cent.' },
        { term: 'nickel', definition: '5 cents.' },
        { term: 'dime', definition: '10 cents.' },
        { term: 'quarter', definition: '25 cents.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-coin-count',
      kind: 'worked_example',
      problem: 'You have 3 quarters, 2 dimes, and 4 pennies. How much money in total?',
      steps: [
        'Start with the biggest: 3 quarters. Skip-count by 25: 25, 50, 75. So 75¢.',
        'Add the dimes: 75 + 10 = 85, then 85 + 10 = 95.',
        'Add the pennies: 95 + 1 + 1 + 1 + 1 = 99.',
        'Total: 99 cents, or $0.99.',
      ],
      answer: '99 cents',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Maya has 2 quarters, 3 dimes, and 1 nickel. How many cents does she have in total?',
      expectedAnswer: '85',
      responseFormat: 'numeric',
      hints: [
        'Start with the quarters: 25 + 25.',
        'Add the dimes one at a time.',
        'Don\'t forget the nickel — that\'s 5 more.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-coin-count',
      kind: 'misconception_check',
      question: 'Ana has 5 dimes and says she has 5 dollars. What went wrong?',
      commonErrors: [
        {
          answer: 'nothing — 5 coins are 5 dollars',
          misconception: 'Counting coins as if every coin is one dollar.',
          correctsTo: 'A dime is 10 cents, not 1 dollar. Five dimes = 5 × 10 = 50 cents, or half a dollar. Each coin\'s VALUE matters, not just the count.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hour hand = short. Minute hand = long. Read hour first, then minutes.',
        'Each clock number = 5 minutes for the long hand.',
        'Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢.',
        'When counting coins, biggest values first, then add the smaller ones.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'School ends at 3:15. It\'s now 2:48. How many minutes until school ends?',
      hint: 'Count up from 2:48: 12 more minutes gets you to 3:00, then 15 more to 3:15. Total = 27 minutes.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
