/**
 * K — Counting and matching objects to numbers.
 *
 * One-to-one correspondence: count each object once, the LAST
 * number you say is HOW MANY. Foundation for all later arithmetic.
 */

import type { LessonPlan } from '../types';

export const SEED_K_MATH_COUNTING_OBJECTS: LessonPlan = {
  id: 'evelyn.k.math.counting.match-objects.v1',
  title: 'Counting objects: one-to-one correspondence',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'math',
  topic: 'counting',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.k.cc.b.4.a',
      description: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name.',
      standard: 'CCSS.MATH.CONTENT.K.CC.B.4.A',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.k.cc.b.4.b'],
  estimatedMinutes: 9,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student counting things they can see.',
      script: 'Look at your hand. How many fingers? Touch each one and count: one, two, three, four, five! That\'s counting — one number for each thing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Three rules of counting: in order, one number per object, last number = total.',
      keyIdeas: [
        'RULE 1: Say numbers IN ORDER: one, two, three, four, five…',
        'RULE 2: Touch each object EXACTLY ONCE while counting.',
        'RULE 3: The LAST number you say tells you HOW MANY there are.',
        'If you skip an object → you count too few.',
        'If you count an object twice → you count too many.',
        'STAY ORGANIZED: count from left to right, or top to bottom — pick a path.',
      ],
      vocabulary: [
        { term: 'count', definition: 'to say number names in order while pointing to things.' },
        { term: 'how many', definition: 'the total number — the last number you say when counting.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-blocks',
      kind: 'worked_example',
      problem: 'Count these blocks: 🟦🟦🟦🟦. How many?',
      steps: [
        'Touch the first: "one".',
        'Touch the second: "two".',
        'Touch the third: "three".',
        'Touch the fourth: "four".',
        'Last number = 4. So there are FOUR blocks.',
      ],
      answer: '4',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How many fingers on TWO hands?',
      expectedAnswer: '10',
      responseFormat: 'numeric',
      hints: [
        'One hand has five fingers.',
        'Count: 1, 2, 3, 4, 5 on first hand. Then keep going: 6, 7, 8, 9, 10 on the second.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skip-or-double',
      kind: 'misconception_check',
      question: 'If you accidentally count one block TWICE, will you get the right answer?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Not noticing the importance of one-to-one matching.',
          correctsTo: 'No — counting one block twice means your last number will be one TOO MANY. The rule is ONE number per object, no skips, no doubles.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Numbers in order: 1, 2, 3, 4, 5…',
        'Touch each object EXACTLY once.',
        'Last number = HOW MANY.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can you count past 10? What number comes right after 10?',
      hint: '11 (eleven). Then 12, 13, 14, …',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
