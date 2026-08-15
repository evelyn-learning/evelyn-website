/**
 * G2 — Place value (tens and ones).
 *
 * Building from counting to two-digit numbers. Uses base-10 blocks
 * (place_value renderer) so the student sees that 23 is "two tens
 * and three ones" — the foundation for every later arithmetic skill.
 * Direct modeling appropriate for 7-year-olds; 1.5× pacing applied
 * automatically by grade-3-5 profile (or 2× if profile reads as K-2).
 */

import type { LessonPlan } from '../types';

export const SEED_G2_PLACE_VALUE: LessonPlan = {
  id: 'evelyn.g2.math.place-value.tens-and-ones.v1',
  title: 'Place Value — Tens and Ones',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'math',
  topic: 'place-value',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.1.nbt.b.2',
      description: 'Understand that the two digits of a two-digit number represent amounts of tens and ones.',
      standard: 'CCSS.MATH.CONTENT.1.NBT.B.2',
    },
    {
      id: 'ncert.math.g2.numbers.tens-ones',
      description: 'Understand two-digit numbers as tens and ones.',
      standard: 'NCERT-Math-Class-2',
    },
  ],
  prerequisites: ['ccss.math.k.cc.b.4'],
  followUps: ['ccss.math.2.nbt.a.1', 'ccss.math.2.nbt.b.5'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student curious about why numbers like 23 use two digits.',
      script: 'When you write the number twenty-three, you write a 2 and a 3. But 2 + 3 isn\'t 23 — so what do those numbers really mean?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tens',
      kind: 'concept',
      goal: 'A "ten" is ten ones bundled together. Numbers above 9 use tens to count more efficiently.',
      keyIdeas: [
        'Counting one-by-one to 23 takes a long time.',
        'We can group ten ones together to make one "ten".',
        'A two-digit number tells us how many tens AND how many ones.',
      ],
      vocabulary: [
        { term: 'ones', definition: 'the small blocks — single units.' },
        { term: 'tens', definition: 'a tower of ten ones bundled together.' },
        { term: 'place value', definition: 'where a digit sits tells you what it means.' },
      ],
      suggestedTools: ['show_early_math'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-23',
      kind: 'worked_example',
      problem: 'Show the number 23 with base-10 blocks.',
      steps: [
        'Use show_early_math kind=place_value with tens=2, ones=3.',
        'Point: "Here are two TENS — two towers of ten."',
        'Point: "Here are three ONES — three little blocks."',
        'Say: "Two tens and three ones make twenty-three."',
        'Pause to let the picture register.',
      ],
      answer: '23',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Your turn! How many tens and how many ones are in the number 47?',
      expectedAnswer: '4 tens and 7 ones',
      responseFormat: 'frq',
      hints: [
        'The first digit (the 4) tells you how many TENS.',
        'The second digit (the 7) tells you how many ONES.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-positional',
      kind: 'misconception_check',
      question: 'A friend says "32 and 23 are the same number because they both use a 2 and a 3." Are they right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating digits as a set rather than positional values.',
          correctsTo: '32 = 3 tens + 2 ones = 32. 23 = 2 tens + 3 ones = 23. Where the digit SITS changes what it means.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A two-digit number has a tens digit and a ones digit.',
        'The LEFT digit is tens; the RIGHT digit is ones.',
        'Where a digit sits tells you what it\'s worth.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What about a three-digit number like 246? What\'s in each place?',
      hint: 'Hundreds, tens, ones — the LEFTMOST digit is the biggest.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
