/**
 * Grade 6 Math — Dividing Fractions: Dividing Fractions by Fractions.
 *
 * PROCEDURE-LED exemplar for the m6math fan-out. Lesson 3.1 built the meaning
 * with pictures; this one turns that meaning into an algorithm the student can
 * run without drawing anything (CCSS 6.NS.A.1). The shape is deliberately
 * different from the concept-led exemplar: the concept segment is a short
 * ordered recipe rather than a mental model, both worked examples run the same
 * three moves so the pattern is unmistakable, and every answer ends with a
 * multiply-back check plus a size test. Two traps this plan is built to kill:
 * flipping the FIRST fraction instead of the second, and multiplying the two
 * fractions as they stand without flipping anything.
 *
 * SCOPE GUARD: Grade 6 row 3.2 is fraction divided by fraction. Every DIVIDEND
 * and DIVISOR in this plan is a proper fraction. Improper-fraction and mixed-
 * number RESULTS are fine and do appear (6/4, 3/2, "1 and 1/2"): naming those
 * is Grade 4/5 material, not row 3.3, whose skill is DIVIDING mixed numbers.
 * Dividing mixed numbers is row 3.3 and word problems are row 3.4, so neither
 * appears in the try_yourself items here.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.1 -> 3.2 -> 3.3.
 * Rows 3.1 and 3.3 are now registered alongside this one, so the chain is
 * wired: prerequisites points at row 3.1 (`meaning-of-fraction-division`) and
 * followUps points at row 3.3 (`dividing-mixed-numbers`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U3_DIVIDING_FRACTIONS_BY_FRACTIONS: LessonPlan = {
  id: 'evelyn.ms.m6math.dividing-fractions-by-fractions.v1',
  title: 'Dividing Fractions by Fractions',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.dividing-fractions-by-fractions',
      standard: 'M6MATH-3.2',
      description:
        'Fluently divide a fraction by a fraction using the invert-and-multiply algorithm, then simplify the result and check it by multiplying back (CCSS 6.NS.A.1).',
    },
  ],
  prerequisites: ['m6math.meaning-of-fraction-division'],
  followUps: ['m6math.dividing-mixed-numbers'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the picture method runs out of steam, so the student wants a rule.',
      script:
        'You have 3/4 of a cup of trail mix left over from a hike. Each snack bag holds 1/2 a cup. How many bags can you fill? You could draw the three-fourths, slice it into half-cups, and count what you see. Drawing works, and it is how you first met this idea. It also gets slow the moment the numbers stop being friendly, and 7/12 divided by 5/8 is not something anybody wants to draw. Today you get a rule that handles any two fractions in three moves, and a way to check every single answer yourself.',
      suggestedTools: ['show_fraction_bar'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-keep-change-flip',
      kind: 'concept',
      goal: 'Install the three-move algorithm, the reason it works, and the two checks that catch a slip.',
      keyIdeas: [
        'DIVISION ASKS HOW MANY FIT — 3/4 divided by 1/2 asks how many halves fit inside three-fourths. Holding on to that question is what makes an answer believable, especially when the answer comes out bigger than the number you started with.',
        'EVERY FRACTION HAS A RECIPROCAL — the reciprocal of a fraction is that fraction flipped over. The reciprocal of 2/5 is 5/2, and the reciprocal of 3/4 is 4/3. A fraction times its own reciprocal is always 1, because 3/4 × 4/3 = 12/12 = 1. Here is why that makes the rule below work: multiply BOTH numbers in the division by the reciprocal of the second one, and the second one turns into 1. Dividing by 1 leaves a number alone, so what is left is the first fraction times that reciprocal, which is exactly the rule.',
        'KEEP, CHANGE, FLIP — keep the first fraction exactly as it is, change the division sign into a multiplication sign, and flip the second fraction into its reciprocal. Then multiply straight across: top times top, bottom times bottom.',
        'ONLY THE SECOND FRACTION FLIPS — the fraction that gets turned upside down is the one you are dividing BY, the one written after the division sign. Flipping the first one instead produces a completely different number. Say it out loud before you write anything: the second one flips.',
        'SIMPLIFY, THEN CHECK BY MULTIPLYING BACK — after multiplying, reduce the fraction by any factor the top and the bottom share. Then check: your answer times the second fraction should give the first fraction back. If it does not, one of the three moves went wrong.',
        'DIVIDING BY A NUMBER LESS THAN 1 MAKES THE ANSWER BIGGER — this feels wrong at first, because dividing whole numbers always makes things smaller. But three-fourths of a cup fills more than one half-cup bag, so the answer has to be more than 1. Run that size test before you trust your arithmetic.',
      ],
      vocabulary: [
        { term: 'reciprocal', definition: 'a fraction flipped over, so the reciprocal of 3/4 is 4/3; a fraction times its reciprocal equals 1.' },
        { term: 'divisor', definition: 'the number you are dividing by, written after the division sign. In a fraction division, this is the fraction that flips.' },
        { term: 'simplify', definition: 'to rewrite a fraction with the smallest whole numbers possible by dividing the top and the bottom by a common factor.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-fourths-by-one-half',
      kind: 'worked_example',
      problem: 'You have 3/4 of a cup of trail mix and each snack bag holds 1/2 a cup. Work out 3/4 ÷ 1/2.',
      steps: [
        'Read the question in words first: how many half-cups fit inside three-fourths of a cup? Three-fourths is more than one half, so the answer will be more than 1. Now you know roughly where to land.',
        'KEEP the first fraction exactly as it is: 3/4.',
        'CHANGE the division sign into a multiplication sign.',
        'FLIP the second fraction into its reciprocal: 1/2 becomes 2/1. The problem is now 3/4 × 2/1.',
        'Multiply straight across. Top: 3 × 2 = 6. Bottom: 4 × 1 = 4. That gives 6/4.',
        'Simplify. Both 6 and 4 divide by 2, so 6/4 becomes 3/2, which is the same as 1 and 1/2.',
        'Check by multiplying back: 3/2 × 1/2 = 3/4, which is exactly the amount you started with, so the answer holds. It is also bigger than 1, just as the size test predicted.',
        'Read it back into the story: one full bag and half of a second bag, which is what three-fourths of a cup poured into half-cup bags actually looks like.',
      ],
      answer: '3/2, which is 1 and 1/2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-three-eighths-by-three-fourths',
      kind: 'worked_example',
      problem: 'Work out 3/8 ÷ 3/4.',
      steps: [
        'Size test first. You are dividing by 3/4, which is less than 1, so the answer will be bigger than 3/8. It will still be a small number, because 3/4 is nearly a whole.',
        'KEEP the first fraction: 3/8.',
        'CHANGE the sign to multiplication, and FLIP the second fraction: 3/4 becomes 4/3. The problem is now 3/8 × 4/3.',
        'Multiply straight across. Top: 3 × 4 = 12. Bottom: 8 × 3 = 24. That gives 12/24.',
        'Simplify. Both 12 and 24 divide by 12, so 12/24 becomes 1/2.',
        'WRONG: flipping the FIRST fraction instead, which turns the problem into 8/3 × 3/4 = 24/12 = 2. CORRECT: only the second fraction flips, so the answer is 1/2. Notice how far apart 2 and 1/2 are. Flipping the wrong fraction is not a small slip; it lands nowhere near the right answer.',
        'Check by multiplying back: 1/2 × 3/4 = 3/8, the number you started with. And 1/2 is bigger than 3/8, which is exactly what the size test predicted.',
      ],
      answer: '1/2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-thirds-by-one-sixth',
      kind: 'try_yourself',
      problem: 'What is 2/3 ÷ 1/6?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/9' },
        { id: 'b', text: '4', correct: true },
        { id: 'c', text: '1/4' },
        { id: 'd', text: '9' },
      ],
      expectedAnswer: '4',
      hints: [
        'Keep 2/3, change the sign to multiplication, and flip only the second fraction: 2/3 × 6/1.',
        'Multiply straight across to get 12/3, then simplify. You are asking how many sixths fit inside two-thirds, so the answer has to be bigger than 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-setup',
      kind: 'try_yourself',
      problem: 'Which expression is equal to 5/8 ÷ 3/4?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5/8 × 3/4' },
        { id: 'b', text: '8/5 × 3/4' },
        { id: 'c', text: '5/8 × 4/3', correct: true },
        { id: 'd', text: '8/5 × 4/3' },
      ],
      expectedAnswer: '5/8 × 4/3',
      hints: [
        'Keep the first fraction, change the sign, flip the second. Exactly one of the two fractions turns over.',
        'The fraction that flips is the divisor, the one written after the division sign. Here that is 3/4, and its reciprocal is 4/3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-five-sixths-by-five-twelfths',
      kind: 'try_yourself',
      problem: 'Work out 5/6 ÷ 5/12. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Keep 5/6, change the sign to multiplication, and flip the second fraction: 5/6 × 12/5.',
        'Multiply straight across to get 60/30, then simplify. Check the result by multiplying it back by 5/12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forgot-to-flip-and-flipped-the-wrong-one',
      kind: 'misconception_check',
      question: 'One student works out 4/5 ÷ 2/3 and writes 8/15. Another student writes 5/6. What went wrong in each case?',
      commonErrors: [
        {
          answer: '8/15',
          misconception: 'Multiplying the two fractions exactly as they stand, treating the division sign as if it were a multiplication sign.',
          correctsTo:
            'Nothing was flipped, so 4/5 × 2/3 = 8/15 answers a different question. Run the three moves: keep 4/5, change the sign, flip 2/3 into 3/2. Then 4/5 × 3/2 = 12/10, which simplifies to 6/5. The size test catches this one on its own: 2/3 is less than 1, so the answer must be BIGGER than 4/5, and 8/15 is smaller than 4/5. Check the real answer by multiplying back: 6/5 × 2/3 = 12/15 = 4/5.',
        },
        {
          answer: '5/6',
          misconception: 'Flipping the first fraction instead of the second, so 5/4 × 2/3 = 10/12 = 5/6.',
          correctsTo:
            'The fraction that flips is always the divisor, the one written after the division sign. Here that is 2/3, whose reciprocal is 3/2, so 4/5 ÷ 2/3 = 4/5 × 3/2 = 12/10 = 6/5. Multiplying back exposes the mistake: 5/6 × 2/3 = 10/18 = 5/9, and 5/9 is not 4/5, so 5/6 cannot be the answer.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dividing by a fraction asks how many of the second fraction fit inside the first.',
        'The reciprocal of a fraction is that fraction flipped: the reciprocal of 3/4 is 4/3, and 3/4 × 4/3 = 1.',
        'Keep, change, flip: keep the first fraction, change the division sign to multiplication, flip the SECOND fraction, then multiply straight across.',
        'Only the second fraction flips. Flipping the first one gives a completely different number, not a near miss.',
        'Simplify the result, then check by multiplying back: the answer times the second fraction must return the first fraction.',
        'Dividing by a number less than 1 makes the answer bigger, so size-test every answer before you trust it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Dividing Fractions by Fractions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
