/**
 * Grade 6 Math — Dividing Fractions: Dividing Mixed Numbers.
 *
 * PROCEDURE-LED lesson for the m6math fan-out. Lesson 3.2 installed the
 * keep-change-flip algorithm for two proper fractions; this lesson adds the
 * one new move a mixed number requires: convert it to an improper fraction
 * before doing anything else. Once both numbers are improper fractions, the
 * division runs exactly the way 3.2 already taught it. Both worked examples
 * end with a multiply-back check and a size test, matching house style.
 *
 * SCOPE GUARD: Grade 6 row 3.2 already installed keep-change-flip for two
 * proper fractions; this row, 3.3, owns MIXED-NUMBER OPERANDS specifically —
 * every problem in this plan has at least one mixed number as a dividend or
 * divisor, and the new skill taught here is converting that mixed number to
 * an improper fraction before running the same invert-and-multiply steps 3.2
 * already taught. This row does not re-derive why keep-change-flip works
 * (that reasoning belongs to 3.2), and it does not solve real-world word
 * problems (that is row 3.4). No negative numbers, decimals, or Grade 7
 * content (signed-number arithmetic, complex fractions, percent
 * applications) appear anywhere in this plan.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U3_DIVIDING_MIXED_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m6math.dividing-mixed-numbers.v1',
  title: 'Dividing Mixed Numbers',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.dividing-mixed-numbers',
      standard: 'M6MATH-3.3',
      description: 'Convert mixed numbers to improper fractions, then divide fluently.',
    },
  ],
  prerequisites: ['m6math.dividing-fractions-by-fractions'],
  followUps: ['m6math.word-problems-with-fraction-division'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the invert-and-multiply rule stalls the moment a mixed number shows up, so the student wants the missing step.',
      script:
        'You have 2 and 1/4 yards of ribbon left over from wrapping presents. Each gift bow uses 3/8 of a yard. How many bows can you make? You already know how to divide a fraction by a fraction: keep, change, flip. Try it right now on 2 and 1/4 divided by 3/8 and you will get stuck immediately, because 2 and 1/4 is not written as a single fraction. It has a whole number stuck to the front of it. Today you learn the one extra move that unlocks every mixed-number division problem, and then you use the same rule you already know.',
      suggestedTools: ['show_fraction_bar'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-convert-then-divide',
      kind: 'concept',
      goal: 'Install the conversion step and confirm that everything after it is the algorithm already learned in 3.2.',
      keyIdeas: [
        'CONVERT ANY MIXED NUMBER BEFORE DIVIDING — a mixed number cannot go straight into keep-change-flip. Turn every mixed number in the problem into an improper fraction first, whether it is the dividend, the divisor, or both.',
        'HOW TO CONVERT — multiply the whole number by the denominator, add the numerator, and keep the same denominator. For 2 and 1/4: 2 × 4 = 8, plus 1 is 9, over the same denominator, so 2 and 1/4 = 9/4.',
        'THEN DIVIDE EXACTLY AS BEFORE — once both numbers are improper fractions, use the same three moves from the last lesson: keep the first fraction, change the division sign to multiplication, and flip the second fraction into its reciprocal. Multiply straight across.',
        'ONLY FLIP THE CONVERTED FORM — the fraction that gets flipped is the improper-fraction version of the divisor, never the mixed number itself. Flipping "1 and 1/2" into something like "1 and 2/1" is not a real reciprocal and cannot be multiplied correctly.',
        'SIMPLIFY, CONVERT BACK, AND CHECK — simplify the result, rewrite it as a mixed number if that is the clearest form, and check by multiplying the answer by the divisor to get the dividend back. The size test still applies: dividing by a number less than 1 makes the answer bigger than the dividend, and dividing by a number greater than 1 makes the answer smaller.',
      ],
      vocabulary: [
        { term: 'mixed number', definition: 'a whole number and a fraction written together, like 2 and 1/4.' },
        { term: 'improper fraction', definition: 'a fraction where the top number is greater than or equal to the bottom number, like 9/4.' },
        { term: 'reciprocal', definition: 'a fraction flipped over; a fraction times its reciprocal always equals 1.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ribbon-bows',
      kind: 'worked_example',
      problem: 'You have 2 and 1/4 yards of ribbon and each gift bow uses 3/8 of a yard. Work out 2 and 1/4 ÷ 3/8.',
      steps: [
        'Convert the mixed number first: 2 and 1/4 = (2 × 4 + 1)/4 = 9/4.',
        'Size test: 3/8 is less than 1, so the answer will be bigger than 2 and 1/4.',
        'KEEP 9/4, CHANGE the sign to multiplication, and FLIP 3/8 into its reciprocal, 8/3. The problem is now 9/4 × 8/3.',
        'Multiply straight across. Top: 9 × 8 = 72. Bottom: 4 × 3 = 12. That gives 72/12.',
        'Simplify. 72/12 = 6.',
        'Check by multiplying back: 6 × 3/8 = 18/8, which simplifies to 9/4, the same as 2 and 1/4. The answer holds.',
        'Read it back into the story: 6 full bows, with no ribbon left over.',
      ],
      answer: '6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-both-mixed',
      kind: 'worked_example',
      problem: 'Work out 3 and 3/4 ÷ 1 and 1/2.',
      steps: [
        'Size test first: 1 and 1/2 is greater than 1, so the answer will be smaller than 3 and 3/4.',
        'Convert BOTH mixed numbers to improper fractions before doing anything else: 3 and 3/4 = (3 × 4 + 3)/4 = 15/4. 1 and 1/2 = (1 × 2 + 1)/2 = 3/2.',
        'WRONG: flipping the mixed number before converting it, turning 1 and 1/2 into something like 1 and 2/1. That is not a real reciprocal and cannot be multiplied correctly. CORRECT: convert first, then flip. The reciprocal of 3/2 is 2/3.',
        'KEEP 15/4, CHANGE the sign to multiplication, and FLIP 3/2 into 2/3. The problem is now 15/4 × 2/3.',
        'Multiply straight across. Top: 15 × 2 = 30. Bottom: 4 × 3 = 12. That gives 30/12.',
        'Simplify. 30/12 = 5/2, which is the same as 2 and 1/2.',
        'Check by multiplying back: 5/2 × 3/2 = 15/4, the same as 3 and 3/4. The answer holds.',
        'Size check: 2 and 1/2 is smaller than 3 and 3/4, exactly as the size test predicted in step 1.',
      ],
      answer: '5/2, which is 2 and 1/2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-and-a-half-by-five-sixths',
      kind: 'try_yourself',
      problem: 'What is 2 and 1/2 ÷ 5/6?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3/5' },
        { id: 'b', text: '1/3' },
        { id: 'c', text: '3', correct: true },
        { id: 'd', text: '2 and 1/12' },
      ],
      expectedAnswer: '3',
      hints: [
        'Convert 2 and 1/2 to an improper fraction first: 2 and 1/2 = 5/2. Do not divide using just the fraction part.',
        'Keep 5/2, change the sign to multiplication, and flip 5/6 into 6/5. Multiply straight across, then simplify.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-setup',
      kind: 'try_yourself',
      problem: 'Which expression correctly sets up 1 and 3/4 ÷ 2/3?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7/4 × 3/2', correct: true },
        { id: 'b', text: '7/4 × 2/3' },
        { id: 'c', text: '4/7 × 2/3' },
        { id: 'd', text: '1 and 3/4 × 3/2' },
      ],
      expectedAnswer: '7/4 × 3/2',
      hints: [
        'Convert 1 and 3/4 to an improper fraction before doing anything else: 1 and 3/4 = 7/4.',
        'Keep 7/4, change the sign to multiplication, and flip only the divisor, 2/3, into its reciprocal, 3/2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-four-and-a-half-by-three-fourths',
      kind: 'try_yourself',
      problem: 'Work out 4 and 1/2 ÷ 3/4. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Convert 4 and 1/2 to an improper fraction: 4 and 1/2 = 9/2.',
        'Keep 9/2, change the sign to multiplication, flip 3/4 into 4/3, multiply straight across, then simplify.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipped-or-partial-conversion',
      kind: 'misconception_check',
      question: 'One student works out 2 and 1/3 ÷ 1 and 1/2 and writes 2 and 2/3. Another student writes 4 and 2/3. What went wrong in each case?',
      commonErrors: [
        {
          answer: '2 and 2/3',
          misconception: 'Dividing the whole-number parts and the fraction parts separately instead of converting first: 2 ÷ 1 = 2, then 1/3 ÷ 1/2 = 1/3 × 2/1 = 2/3, then combining those into 2 and 2/3.',
          correctsTo:
            'A mixed-number division problem cannot be split into a whole-number division and a fraction division done side by side. Convert both mixed numbers to improper fractions first: 2 and 1/3 = 7/3 and 1 and 1/2 = 3/2. Then keep 7/3, change the sign to multiplication, and flip 3/2 into 2/3: 7/3 × 2/3 = 14/9, which is 1 and 5/9. Check by multiplying back: 1 and 5/9 × 1 and 1/2 = 14/9 × 3/2 = 42/18, which simplifies to 7/3, the same as 2 and 1/3.',
        },
        {
          answer: '4 and 2/3',
          misconception: 'Converting the dividend correctly but forgetting to convert the divisor before flipping it, then flipping only the fraction part and dropping the whole number: 1 and 1/2 treated as if it were just 1/2, flipped to 2/1.',
          correctsTo:
            'Every mixed number in the problem must be converted before anything gets flipped, including the divisor. 1 and 1/2 = 3/2, not just 1/2, so its reciprocal is 2/3, not 2/1. The correct setup is 7/3 × 2/3 = 14/9, which is 1 and 5/9. Multiplying 4 and 2/3 back by 1 and 1/2 gives 7, which is not 2 and 1/3, so 4 and 2/3 cannot be the answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mixed number cannot be used directly in keep-change-flip. Convert it to an improper fraction first: multiply the whole number by the denominator, add the numerator, and keep the same denominator.',
        'Convert every mixed number in the problem, both dividend and divisor, before doing anything else.',
        'Once both numbers are improper fractions, divide exactly as before: keep the first, change ÷ to ×, flip the second into its reciprocal, and multiply straight across.',
        'Only flip the improper-fraction form of the divisor. Flipping a mixed number itself, without converting it first, is not a real reciprocal.',
        'Simplify the result, convert it back to a mixed number if that is the clearer form, and check by multiplying the answer by the divisor to get the dividend back.',
        'Size test: dividing by a number less than 1 makes the answer bigger than the dividend, and dividing by a number greater than 1 makes the answer smaller.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Dividing Mixed Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
