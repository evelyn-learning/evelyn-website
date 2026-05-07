/**
 * TEST PLAN — K-2 Math — Comparing Numbers (>, <, =).
 *
 * QA harness, not production content. Designed to exercise the K-2 grade
 * profile: short sentences (Fry-100 vocab), 2.0× pacing multiplier, and
 * the band-cap behaviors the in-session humor menu depends on (the ⋯
 * menu must hide "Pretty funny" / "Very funny" for K-2).
 *
 * Surfaces invited:
 *   - show_early_math (place_value side-by-side, ten_frame, base-10
 *     blocks) — the rare K-2 visual primitive set.
 *   - show_number_line — ordering on a horizontal axis.
 *   - show_table — column comparison of pairs.
 *   - highlight — boxed reminders of the < > = symbols.
 *   - tutor_scribble — circle the larger number on a place-value pair.
 *   - K-2 humor cap — verifies the in-session ⋯ menu only shows
 *     Default / Serious / A little funny.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_K2_MATH_COMPARING_NUMBERS: LessonPlan = {
  id: 'evelyn.test.k2.math.comparing-numbers.v1',
  title: '[TEST] K-2 Math — Comparing Numbers (>, <, =)',
  curriculum: 'CCSS',
  // 'k' (not 'k-2') so gradeBandFor maps it to the K-2 band. The
  // 'K-N' range form was a bug surfaced by this very seed: it falls
  // through gradeBandFor's regex and lands on the 6-8 safe-default,
  // applying middle-school sentence/humor caps to a kindergartener.
  grade: 'k',
  subject: 'math',
  topic: 'place-value',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.1.nbt.b.3',
      description: 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.',
      standard: 'CCSS.MATH.CONTENT.1.NBT.B.3',
    },
  ],
  prerequisites: ['ccss.math.k.cc.c.6'],
  followUps: ['ccss.math.2.nbt.a.4'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with a quick "which is more?" question using two stacks of blocks.',
      script: 'I have two piles of blocks. One pile has 8 blocks. One pile has 12 blocks. Which pile is *bigger*?',
      suggestedTools: ['show_early_math'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-symbols',
      kind: 'concept',
      goal: 'Three symbols help us write number comparisons: > (greater than), < (less than), = (equal).',
      keyIdeas: [
        'GREATER means MORE. The big open mouth eats the bigger number.',
        'LESS means FEWER. The small point points to the smaller number.',
        'EQUAL means SAME. Both sides have the same count.',
        'Tip: the OPEN mouth always eats the BIGGER number.',
      ],
      vocabulary: [
        { term: 'greater than', definition: 'more than. The symbol > points to the smaller number.' },
        { term: 'less than', definition: 'fewer than. The symbol < points to the smaller number.' },
        { term: 'equal to', definition: 'the same as. The symbol = means both sides match.' },
      ],
      suggestedTools: ['show_early_math', 'highlight'],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-blocks-pair',
      kind: 'worked_example',
      problem: 'Compare 24 and 31 using place-value blocks.',
      steps: [
        'Show 24 with 2 tens-rods and 4 ones-blocks.',
        'Show 31 with 3 tens-rods and 1 ones-block.',
        'Compare the TENS first. 3 tens is more than 2 tens.',
        'So 31 is *bigger*. Write 24 < 31.',
      ],
      answer: '24 < 31',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which symbol goes between 17 and 17? Pick one: >, <, or =.',
      expectedAnswer: '=',
      responseFormat: 'mcq',
      choices: [
        { id: 'gt', text: '>', correct: false },
        { id: 'lt', text: '<', correct: false },
        { id: 'eq', text: '=', correct: true },
      ],
      hints: [
        'Look at the two numbers. Are they the same?',
        'Same number on both sides means *equal*.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-2',
      kind: 'try_yourself',
      problem: 'Which is bigger: 46 or 64?',
      expectedAnswer: '64',
      responseFormat: 'numeric',
      hints: [
        'Compare the TENS first. Is 4 tens or 6 tens more?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-digit-count',
      kind: 'misconception_check',
      question: 'A friend says "9 is bigger than 12 because 9 looks bigger when you say it". Are they right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing single-digit "loud" numbers with their actual value.',
          correctsTo: '12 is bigger than 9. We can SEE this with blocks: 12 needs 1 ten and 2 ones. 9 is fewer than one full ten. So 9 < 12.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '> means greater than. The open mouth eats the bigger number.',
        '< means less than. The point points to the smaller number.',
        '= means equal. Both sides have the same count.',
        'For two-digit numbers, compare the TENS first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
