/**
 * Grade 7 Math — Expressions: Combining Like Terms.
 *
 * The first real procedure of the algebra strand (CCSS 7.EE.A.1). Sorting is
 * the whole idea: terms only combine when the variable part matches exactly.
 * The three traps this plan is built to kill are combining across different
 * powers (3x with 3x-squared), losing the minus sign that belongs to a term
 * (in 5x − 8x the term is −8x), and sweeping a bare number into a variable
 * pile (5x + 2 is already simplest).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U5_COMBINING_LIKE_TERMS: LessonPlan = {
  id: 'evelyn.ms.m7math.combining-like-terms.v1',
  title: 'Combining Like Terms',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.combining-like-terms',
      standard: 'M7MATH-5.3',
      description:
        'Identify like terms in a linear expression and combine them to write an equivalent, simpler expression (CCSS 7.EE.A.1).',
    },
  ],
  prerequisites: ['m7math.evaluating-expressions'],
  followUps: ['m7math.distributive-property-and-factoring'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame combining like terms as ordinary sorting, using piles the student can picture.',
      script:
        'Dump your backpack out on the floor. Three pencils, two granola bars, four more pencils, one more granola bar. Before you can say what you have, you sort — pencils in one pile, granola bars in the other. Seven pencils and three granola bars. What you would never do is add three apples to five dollars and announce that you have eight of something, because apples and dollars are not the same kind of thing. Algebra sorts the exact same way. Today we split an expression into piles that match, add up each pile, and write the whole thing shorter.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-like-terms',
      kind: 'concept',
      goal: 'Define terms, like terms, and coefficients, and name the three traps before the student walks into them.',
      keyIdeas: [
        'A TERM IS ONE PIECE — an expression splits into terms at every + and − sign. In 6x + 4 − 11x − 9 the terms are 6x, +4, −11x, and −9. The sign on the left BELONGS to the term it sits in front of. In 5x − 8x the second term is −8x, not 8x. Losing that minus sign is the most common mistake in this whole lesson.',
        'LIKE TERMS MATCH EXACTLY — two terms are like terms only when the variable part is identical, the letter AND the exponent. So 5x and −8x are like terms. But 3x and 3x² are NOT like terms, even though both show a 3 and an x: 3x counts copies of x, and 3x² counts copies of x times x. Those are different things, so they do not add up. For the same reason 4x and 4y are not like terms.',
        'A PLAIN NUMBER IS NOT LIKE A VARIABLE TERM — in 5x + 2 there is nothing left to combine, because 2 is always 2 while 5x changes with x. Writing 5x + 2 = 7x is wrong. Plain numbers are called constants, and constants are like terms only with each other: −3 and +8 combine to 5.',
        'COMBINE BY ADDING THE COEFFICIENTS — 5x − 8x means (5 − 8)x, which is −3x. Add or subtract the numbers in front, then copy the variable part down unchanged. The exponent never changes and never adds, so 5x + 2x = 7x and never 7x².',
        'A LONE VARIABLE CARRIES A SILENT 1 — a means 1a, and −a means −1a. So 4a − a = 3a, not 4a and not 4. That invisible 1 is easy to skip right over, so write it in whenever it helps.',
        'CHECK BY SUBSTITUTING — pick any number for the variable, put it into the original expression and into your simplified one, and compare the results. If 7y − 3 − 9y + 8 really equals −2y + 5, then y = 2 has to give the same value both times. It does: both give 1.',
      ],
      vocabulary: [
        { term: 'term', definition: 'one piece of an expression, separated from the next by a + or − sign, with that sign included.' },
        { term: 'coefficient', definition: 'the number multiplying the variable part of a term — the −8 in −8x.' },
        { term: 'like terms', definition: 'terms whose variable parts are exactly the same, letter and exponent: 5x and −8x.' },
        { term: 'constant', definition: 'a term that is just a number, with no variable attached, such as −3 or 8.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-combine-with-negatives',
      kind: 'worked_example',
      problem: 'Simplify: 7y − 3 − 9y + 8',
      steps: [
        'Split it into terms and carry each sign along with its term: 7y, then −3, then −9y, then +8. The third term is −9y, minus included.',
        'Sort into two piles. The y pile holds 7y and −9y. The number pile holds −3 and +8.',
        'Combine the y pile: 7 − 9 = −2, so 7y − 9y = −2y. Starting at 7 and going down 9 lands two below zero.',
        'Combine the number pile: −3 + 8 = 5.',
        'Write the two results side by side: −2y + 5. The piles cannot mix, so that is simplest form.',
        'Check with y = 2. Original: 7(2) − 3 − 9(2) + 8 = 14 − 3 − 18 + 8 = 1. Simplified: −2(2) + 5 = −4 + 5 = 1. Both give 1, so the work holds up.',
      ],
      answer: '−2y + 5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-variable-families',
      kind: 'worked_example',
      problem: 'Simplify: 4a + 2b − a + 5b',
      steps: [
        'Two different letters means two different piles. List the terms with their signs: 4a, +2b, −a, +5b.',
        'Watch the third term. It is −a, and −a means −1a. Write that 1 in so the subtraction is easy to see.',
        'Combine the a pile: 4a − 1a = 3a, because 4 − 1 = 3.',
        'Combine the b pile: 2b + 5b = 7b, because 2 + 5 = 7.',
        'a and b are different letters, so the piles never merge. The answer is 3a + 7b and it stays as two terms. WRONG answer to avoid: 10ab, which comes from adding every number in sight and gluing the letters together. RIGHT answer: 3a + 7b.',
        'Check with a = 2 and b = 3. Original: 4(2) + 2(3) − 2 + 5(3) = 8 + 6 − 2 + 15 = 27. Simplified: 3(2) + 7(3) = 6 + 21 = 27. Both give 27.',
      ],
      answer: '3a + 7b',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-like-terms',
      kind: 'try_yourself',
      problem: 'Which pair below are like terms?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3x and 3x²' },
        { id: 'b', text: '5x and −8x', correct: true },
        { id: 'c', text: '4x and 4y' },
        { id: 'd', text: '6x and 6' },
      ],
      expectedAnswer: '5x and −8x',
      hints: [
        'Ignore the numbers in front for a second. Look only at the variable part of each term.',
        'Like terms need the same letter AND the same exponent. A matching number in front does not count for anything.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-simplify-with-sign',
      kind: 'try_yourself',
      problem: 'Simplify: 5x − 8x + 2',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '13x + 2' },
        { id: 'b', text: '−3x + 2', correct: true },
        { id: 'c', text: '3x + 2' },
        { id: 'd', text: '−1x' },
      ],
      expectedAnswer: '−3x + 2',
      hints: [
        'List the terms with their signs first: 5x, −8x, and +2. Which two belong in the same pile?',
        'The x pile is 5x − 8x, which is (5 − 8)x. The 2 has no x, so it cannot join that pile.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-coefficient',
      kind: 'try_yourself',
      problem: 'In simplest form, what is the coefficient of x in 6x + 4 − 11x − 9? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-5',
      hints: [
        'Sort first. Which terms carry an x, and what sign does each one bring with it?',
        'The x pile is 6x − 11x, which is (6 − 11)x. The coefficient is the number left in front of x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-different-powers',
      kind: 'misconception_check',
      question: 'A student simplifies 4x + 4x² and writes 8x². What went wrong?',
      commonErrors: [
        {
          answer: '8x²',
          misconception: 'Seeing two 4s and an x in both terms and deciding that is close enough to combine. The exponents are different, so the terms are not like terms at all.',
          correctsTo: '4x means four copies of x. 4x² means four copies of x times x. Those count different things, the way pencils and backpacks count different things, so they cannot be added into one pile. 4x + 4x² is ALREADY in simplest form — there is nothing to combine. Terms are like terms only when the letter and the exponent both match.',
        },
        {
          answer: '8x³',
          misconception: 'Adding the coefficients and adding the exponents at the same time, as if combining terms were the same operation as multiplying them.',
          correctsTo: 'Exponents add when terms are MULTIPLIED, never when they are added. Combining like terms changes only the number in front and copies the variable part down exactly as it was. Since 4x and 4x² are not like terms here, nothing changes: the answer stays 4x + 4x².',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The sign in front of a term belongs to that term. In 5x − 8x the second term is −8x.',
        'Terms are like terms only when the letter AND the exponent match, so 3x and 3x² never combine.',
        'Combine like terms by adding the coefficients and copying the variable part: 5x − 8x = −3x.',
        'A plain number never joins a variable pile, and a lone variable carries a silent 1: 5x + 2 is already simplest, and 4a − a = 3a.',
        'To check yourself, substitute a number into both the original and the simplified expression and make sure they match.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Combining Like Terms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
