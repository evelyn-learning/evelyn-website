/**
 * G3 — Word problems strategy.
 *
 * CUBES method (or similar) for unpacking word problems. Identify
 * what's known, what's asked, the operation, the answer.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_WORD_PROBLEMS_STRATEGY: LessonPlan = {
  id: 'evelyn.g3.math.word-problems.strategy.v1',
  title: 'Word problems: a strategy that works',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'word-problems',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.oa.d.8',
      description: 'Solve two-step word problems using the four operations.',
      standard: 'CCSS.MATH.CONTENT.3.OA.D.8',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1'],
  followUps: ['ccss.math.4.oa.a.3'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make word problems feel solvable.',
      script: 'A lot of kids panic at word problems. They look hard! But there\'s a STRATEGY: read carefully, find what\'s known and what\'s asked, pick the operation, solve, check. Same plan every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Five-step strategy + key signal words.',
      keyIdeas: [
        'STEP 1: READ the problem. Then read it AGAIN. Don\'t solve before you understand.',
        'STEP 2: FIND what\'s GIVEN (the numbers and what they mean). Underline.',
        'STEP 3: FIND what\'s ASKED. Circle the question.',
        'STEP 4: PICK the operation. Look for SIGNAL WORDS:',
        '   ADDITION: total, in all, altogether, combined, sum.',
        '   SUBTRACTION: how many more, fewer, less, difference, left, remaining.',
        '   MULTIPLICATION: each, per, groups of, times, every.',
        '   DIVISION: split equally, share, each gets, how many groups, per.',
        'STEP 5: COMPUTE. Then CHECK — does the answer make sense?',
        'WATCH OUT: signal words can mislead. Read the WHOLE problem, don\'t just hunt for words.',
      ],
      vocabulary: [
        { term: 'operation', definition: 'one of +, −, ×, ÷.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cookies',
      kind: 'worked_example',
      problem: 'Maya has 8 boxes of cookies. EACH box has 6 cookies. How many cookies in all?',
      steps: [
        'Read carefully. We have 8 boxes. EACH has 6 cookies. We want the TOTAL.',
        'Given: 8 boxes, 6 per box.',
        'Asked: how many cookies in all.',
        'Signal words: "EACH" → multiplication. "in all" → total = multiplication answer.',
        'Compute: 8 × 6 = 48.',
        'Check: makes sense — 6+6+6+6+6+6+6+6 = 48.',
      ],
      answer: '48 cookies',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-share',
      kind: 'worked_example',
      problem: '24 candies are SHARED EQUALLY among 4 friends. How many does each get?',
      steps: [
        'Given: 24 candies, 4 friends.',
        'Asked: how many EACH gets.',
        'Signal: "shared equally" → DIVISION. "each gets" → also division.',
        'Compute: 24 ÷ 4 = 6.',
        'Check: 6 × 4 = 24 ✓.',
      ],
      answer: '6 candies each',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'There are 15 birds in a tree. 7 fly away. How many birds are LEFT in the tree?',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: [
        'Signal word: "left" → SUBTRACTION.',
        '15 − 7 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grab-numbers',
      kind: 'misconception_check',
      question: 'Should you just grab the numbers and add them all together?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Defaulting to addition.',
          correctsTo: 'No — the operation depends on WHAT THE PROBLEM ASKS. You need to figure out what relationship the numbers have. Some problems even include EXTRA numbers that aren\'t needed. Reading carefully comes first.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read TWICE before solving.',
        'Find given + asked + signal words.',
        'Pick the operation, then compute.',
        'Check: does the answer make sense?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A two-step problem: Sam has 12 cookies. He eats 3, then divides the rest among 3 friends. How many cookies per friend?',
      hint: 'Step 1: 12 − 3 = 9 (remaining). Step 2: 9 ÷ 3 = 3 (per friend).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
