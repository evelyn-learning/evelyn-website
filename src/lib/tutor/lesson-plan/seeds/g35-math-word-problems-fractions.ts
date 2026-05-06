/**
 * Grades 3-5 Math — Word Problems with Fractions and Decimals.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_MATH_WORD_PROBLEMS_FRACTIONS: LessonPlan = {
  id: 'evelyn.g35.math.word-problems-fractions.v1',
  title: 'Word Problems — Fractions, Decimals, Money, Time',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'word-problems',
  locale: 'en',
  los: [{ id: 'g35.math.word-problems-fractions', description: 'Solve multi-step word problems involving fractions, decimals, money, and elapsed time.', standard: 'CCSS.MATH.CONTENT.5.NF' }],
  prerequisites: ['g35.math.fractions-decimals'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Real life is full of fractions, decimals, and money — word problems are how schools test that math.', script: 'Pizza slices, sale prices, time on a clock. Real-world math is rarely whole numbers. Word problems with fractions and decimals teach you to apply what you know in messy, practical situations.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Strategies for fraction word problems, decimal money problems, time problems.', keyIdeas: [
      'FRACTION word problem strategies:',
      '  "1/2 of" → MULTIPLY by 1/2 (or divide by 2).',
      '  "x cups of flour, then 1/4 cup more" → ADD fractions (find common denominator).',
      '  "Recipe makes 12 cookies; you want 1/3 of the recipe" → multiply each ingredient by 1/3.',
      '  Compare fractions: convert to common denominator OR convert to decimals.',
      'DECIMAL / MONEY problems:',
      '  Treat money like decimals: $1.25 + $0.75 = $2.00.',
      '  Line up the decimal points when adding/subtracting.',
      '  Multiply money by whole numbers like normal multiplication, then count decimal places.',
      'TIME problems:',
      '  Elapsed time: count forward by hours, then minutes.',
      '  Convert: 1 hr = 60 min. 1 day = 24 hrs.',
      '  AM/PM: be careful — 11:30 AM to 1:00 PM is 1 hr 30 min, NOT 11.5 hrs.',
      'GENERAL STEPS for messy problems:',
      '  1. Convert everything to the same UNIT (all minutes, all decimals, etc.).',
      '  2. Decide the operation.',
      '  3. Solve.',
      '  4. Convert back to the question\'s units.',
    ], vocabulary: [{ term: 'elapsed time', definition: 'how much time has passed between two clock times.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'A recipe calls for 3/4 cup of milk. You want to make 1/2 of the recipe. How much milk do you need?', steps: [
      'You want 1/2 of 3/4. "Of" means MULTIPLY.',
      '1/2 × 3/4 = (1 × 3)/(2 × 4) = 3/8.',
      'Answer: 3/8 cup of milk.',
      'CHECK: 3/8 is less than 3/4 (since 1/2 of something is less than the whole). Reasonable. ✓',
    ], answer: '3/8 cup', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A movie starts at 2:45 PM and ends at 4:30 PM. How long is the movie?', expectedAnswer: 'From 2:45 PM to 3:00 PM is 15 min. From 3:00 PM to 4:30 PM is 1 hr 30 min. Total: 1 hr 45 min. (Check: 2:45 + 1:45 = 4:30 ✓.)', responseFormat: 'free', hints: ['Count to the next whole hour first.', 'Then add the rest in hours and minutes.'], estimatedMinutes: 3 },
    { id: 'misconception-decimal-line', kind: 'misconception_check', question: 'A student adds $3.50 + $4.25 by writing them side by side and getting "$3.504.25." What went wrong?', commonErrors: [{ answer: 'Concatenates instead of adding', misconception: 'Treating decimals as text strings instead of numbers.', correctsTo: 'Always LINE UP THE DECIMAL POINTS, then add column by column. $3.50 + $4.25:\n  3.50\n+ 4.25\n  ----\n  7.75\nAnswer: $7.75. Don\'t concatenate; align the decimal point.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['"Of" means multiply.', 'Line up decimals when adding/subtracting.', 'Convert to same units before computing.', 'Time: count to next whole hour, then add the rest.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
