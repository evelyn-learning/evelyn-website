/**
 * G3 — Division Intro (sharing equally; partitioning).
 *
 * Division as the inverse of multiplication, framed as fair sharing
 * and equal-group partitioning. Two contexts: "how many in each
 * group?" (partitive) and "how many groups?" (quotative). Both arrive
 * at the same answer for the same numbers.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_DIVISION_INTRO: LessonPlan = {
  id: 'evelyn.g3.math.division.intro.v1',
  title: 'Division: Sharing Equally',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'division',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.oa.a.2',
      description: 'Interpret whole-number quotients — e.g. 56 ÷ 8 as 8 equal groups partitioned from 56.',
      standard: 'CCSS.MATH.CONTENT.3.OA.A.2',
    },
    {
      id: 'ccss.math.3.oa.b.6',
      description: 'Understand division as an unknown-factor problem.',
      standard: 'CCSS.MATH.CONTENT.3.OA.B.6',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1'],
  followUps: ['ccss.math.3.oa.c.7'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up a sharing problem the student can feel — too many cookies, not enough plates.',
      script: 'You and 3 friends find 12 cookies and want to share them fairly. How many cookies does each person get? That question — splitting a total into equal groups — is exactly what division is for.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-meanings',
      kind: 'concept',
      goal: 'Division has two flavors but one answer. Both partition a total into equal pieces.',
      keyIdeas: [
        'Division splits a total into EQUAL groups.',
        'Sharing meaning: 12 ÷ 4 can mean "12 cookies shared among 4 people — how many each?"',
        'Grouping meaning: 12 ÷ 4 can also mean "12 cookies, 4 per bag — how many bags?"',
        'Both ways give the same answer — 3.',
        'The ÷ symbol is read "divided by". The answer is called the QUOTIENT.',
        'Division UNDOES multiplication: if 4 × 3 = 12, then 12 ÷ 4 = 3 and 12 ÷ 3 = 4.',
      ],
      vocabulary: [
        { term: 'division', definition: 'splitting a total into equal groups.' },
        { term: 'quotient', definition: 'the answer to a division problem.' },
        { term: 'dividend', definition: 'the total being split.' },
        { term: 'divisor', definition: 'the number you\'re splitting by.' },
      ],
      suggestedTools: ['show_early_math', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-15-share-3',
      kind: 'worked_example',
      problem: 'Share 15 strawberries equally among 3 friends. How many does each friend get?',
      steps: [
        'Use show_early_math to draw 15 dots in a pile.',
        'Set up 3 empty groups (one per friend).',
        'Deal one dot to each group at a time, going around.',
        'After dealing all 15, count one group: 5 dots.',
        'Write: 15 ÷ 3 = 5. "Fifteen split into three equal groups gives five each."',
        'Connect to multiplication: 3 × 5 = 15 — the inverse fact.',
      ],
      answer: '5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'There are 24 pencils to put into boxes of 6. How many boxes will you need?',
      expectedAnswer: '4',
      responseFormat: 'numeric',
      hints: [
        'This is the "how many groups" version of division.',
        'You\'re asking: how many 6s fit into 24?',
        'Try the related multiplication: 6 × ? = 24.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-order',
      kind: 'misconception_check',
      question: 'Lin says "Division is just like multiplication — 12 ÷ 4 is the same as 4 ÷ 12." Is Lin right?',
      commonErrors: [
        {
          answer: 'yes, division is commutative',
          misconception: 'Carrying over the commutative property from multiplication. Division does NOT work that way.',
          correctsTo: '12 ÷ 4 = 3, but 4 ÷ 12 is less than 1. Division is NOT commutative — the order matters. The total has to be the bigger number for whole-number division to work cleanly.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Division splits a total into equal groups.',
        '"Sharing" and "grouping" are two stories for the same operation.',
        'The total is the dividend; the size or count is the divisor; the answer is the quotient.',
        'Division undoes multiplication. Use multiplication facts to solve division.',
        'Division is NOT commutative — order matters.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What is 27 ÷ 3, and what multiplication fact tells you the answer?',
      hint: 'Ask: 3 × ? = 27. The answer to that question is the quotient.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
