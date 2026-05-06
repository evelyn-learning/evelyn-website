/**
 * Grades 3-5 Math — Word Problems: Read-Plan-Solve-Check Strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_MATH_WORD_PROBLEMS_STRATEGIES: LessonPlan = {
  id: 'evelyn.g35.math.word-problems-strategies.v1',
  title: 'Word Problems — Read, Plan, Solve, Check',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'math',
  topic: 'word-problems',
  locale: 'en',
  los: [{ id: 'g35.math.word-problems-strategy', description: 'Apply the four-step word-problem strategy: read carefully, plan an approach, solve, and check the answer.', standard: 'CCSS.MATH.CONTENT.4.OA.A.3' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Word problems aren\'t hard math — they\'re hard READING.', script: 'Most students don\'t struggle with the math in word problems. They struggle with figuring out WHICH math to do. Today: a four-step plan that works on every word problem.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Four-step strategy, key-word recognition, common pitfalls.', keyIdeas: [
      'STEP 1 — READ carefully. Read the WHOLE problem twice. Underline what you NEED to find. Circle the NUMBERS.',
      'STEP 2 — PLAN. Decide which OPERATION fits.',
      '  ADDITION key words: total, sum, in all, altogether, combined.',
      '  SUBTRACTION key words: difference, less, fewer, how many more, take away, left.',
      '  MULTIPLICATION: each, per, times as many, groups of, every.',
      '  DIVISION: shared equally, each, per, average, ratio.',
      'STEP 3 — SOLVE. Write the equation. Compute carefully. Show your work.',
      'STEP 4 — CHECK. Does the answer make sense?',
      '  Check size — is it reasonable?',
      '  Check units — did you answer "minutes" or "hours"?',
      '  Reverse: plug back into the original problem.',
      'TWO-STEP problems are common: requires two operations in sequence (e.g., total cost = price × number, then subtract discount).',
      'AVOID guessing operations from random keywords. SOMETIMES the keywords lie. Always think about what the problem MEANS.',
    ], vocabulary: [{ term: 'word problem', definition: 'a math problem stated in words rather than equations; requires translation.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Maria has 24 stickers. She gives 8 to her brother and divides the rest equally among 4 friends. How many stickers does each friend get?', steps: [
      'READ: Maria starts with 24, gives 8 to brother, divides REST among 4. We need stickers per friend.',
      'PLAN: Two steps. (a) Subtract 8 from 24 (after giving away). (b) Divide the rest by 4.',
      'SOLVE:',
      '  Step a: 24 − 8 = 16 (stickers left after brother).',
      '  Step b: 16 ÷ 4 = 4 (per friend).',
      'CHECK: 4 friends × 4 stickers = 16 stickers given to friends. 16 + 8 = 24 — matches Maria\'s starting count. ✓',
      'Answer: 4 stickers per friend.',
    ], answer: '4 stickers per friend', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A box of pencils costs $3. The school buys 12 boxes. They have a $5 coupon. How much do they pay?', expectedAnswer: 'PLAN: cost = (12 × $3) − $5. SOLVE: 12 × 3 = 36. 36 − 5 = 31. Answer: $31. CHECK: $36 minus $5 coupon = $31. ✓', responseFormat: 'numeric', hints: ['First find total cost (multiply).', 'Then apply the coupon (subtract).'], estimatedMinutes: 3 },
    { id: 'misconception-keywords', kind: 'misconception_check', question: 'A problem says "Sara had 10 apples and gave away SOME. She had 7 LEFT." A student sees "left" and "gave away" and assumes subtraction: 10 − 7 = 3. What did they get right?', commonErrors: [{ answer: 'Mechanical keyword matching', misconception: 'Confusing keyword recognition with thinking about the problem.', correctsTo: 'In this case keywords agreed and the answer (3) is correct. But keywords don\'t always work. Better practice: think about what\'s HAPPENING — Sara had a count, gave some away, has fewer now. The MOTION (giving away → fewer) tells you it\'s subtraction. Keywords are a help, not a rule. Always check: does the operation match the situation?' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Read carefully, twice.', 'Plan: which operation(s) match the action?', 'Solve, then CHECK.', 'Two-step problems are common — break into smaller pieces.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
