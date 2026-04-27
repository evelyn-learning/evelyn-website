/**
 * K — Counting to 10.
 *
 * Foundational number sense for K-2. Builds 1-to-1 correspondence,
 * the cardinality principle, and verbal counting. Heavy on visuals
 * (ten-frames, arrays); language is short and concrete; pacing is
 * generous. Uses the show_early_math (ten_frame, array) renderer
 * extensively so the student SEES counts rather than hearing them
 * read aloud as numbers.
 */

import type { LessonPlan } from '../types';

export const SEED_K_COUNTING_TO_10: LessonPlan = {
  id: 'evelyn.k.math.counting.to-10.v1',
  title: 'Counting to 10',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'math',
  topic: 'counting',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.k.cc.b.4',
      description: 'Understand the relationship between numbers and quantities — connect counting to cardinality.',
      standard: 'CCSS.MATH.CONTENT.K.CC.B.4',
    },
    {
      id: 'ncert.math.k.counting.1-10',
      description: 'Count and recognise numbers 1 to 10.',
      standard: 'NCERT-EVS-LKG-counting',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.math.k.cc.b.5', 'ccss.math.k.oa.a.1'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student excited to count something — fingers, blocks, anything they can see.',
      script: 'Hi! Hold up your hands. How many fingers do you see? Let\'s count them together!',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cardinality',
      kind: 'concept',
      goal: 'When you count, the LAST number you say tells you how many there are.',
      keyIdeas: [
        'Numbers are like names for "how many".',
        'When we count, we touch each one and say a number — one, two, three.',
        'The last number we say is HOW MANY there are altogether.',
      ],
      vocabulary: [
        { term: 'count', definition: 'to say the numbers in order — one, two, three…' },
      ],
      suggestedTools: ['show_early_math'],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-ten-frame-7',
      kind: 'worked_example',
      problem: 'Show 7 dots in a ten-frame and count them out loud.',
      steps: [
        'Use show_early_math kind=ten_frame with count=7 to display the dots.',
        'Point to each dot and count: "one, two, three, four, five, six, seven".',
        'Say "There are seven dots." Pause to let the student see the picture.',
      ],
      answer: '7',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Now you try! How many dots are in this ten-frame? (Show ten_frame with count=4.)',
      expectedAnswer: '4',
      responseFormat: 'numeric',
      hints: [
        'Touch each dot one at a time and say the number.',
        'Start at one and go in order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipping',
      kind: 'misconception_check',
      question: 'A friend counts these dots and says "one, three, five — five dots!" Did they count right?',
      commonErrors: [
        {
          answer: '5',
          misconception: 'Skipping numbers (counting by twos) when counting one-by-one.',
          correctsTo: 'Each dot needs ONE number, in order: one, two, three, four, five.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Touch each thing once when you count.',
        'Say the numbers in order.',
        'The last number is HOW MANY.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Can you count to 10 backwards? 10, 9, 8 …',
      hint: 'Imagine a rocket launching!',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
