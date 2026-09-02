/**
 * Grade 6 Math — Multi-Digit & Decimal Operations: GCF, LCM & the
 * Distributive Property.
 *
 * PROCEDURE-LED shape for the m6math fan-out (CCSS 6.NS.B.4). This row binds
 * three named skills to one thread: a common factor is what you can pull out
 * of two numbers. GCF and LCM are the same search run in opposite
 * directions — GCF hunts DOWN through shared factors for the biggest one,
 * LCM hunts UP through shared multiples for the smallest one — and the
 * distributive property is what a common factor lets you do to a sum: pull
 * it out front. The lesson teaches that one thread, not three separate
 * skills, and both worked examples run the same listing method (never prime
 * factorization) so the pattern stays visible. The trap this plan is built
 * to kill is confusing GCF with LCM — reaching for "the biggest shared
 * number" when the question actually wants the smallest shared multiple, or
 * the reverse.
 *
 * SCOPE GUARD: this row teaches GCF of two whole numbers up to 100, LCM of
 * two whole numbers up to 12, and the distributive property applied only to
 * rewrite a SUM of two whole numbers as (their common factor) times (a sum
 * of two smaller whole numbers) — every number in this plan is a
 * nonnegative whole number, found by listing factors and multiples, never
 * by prime factorization with exponents. The distributive property never
 * touches a variable or an algebraic expression here: factoring an
 * algebraic expression is Grade 7, and the algebraic form of the
 * distributive property belongs to this course's own row 7.4 (Equivalent
 * Expressions), not to this row.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U4_GCF_LCM_AND_THE_DISTRIBUTIVE_PROPERTY: LessonPlan = {
  id: 'evelyn.ms.m6math.gcf-lcm-and-the-distributive-property.v1',
  title: 'GCF, LCM & the Distributive Property',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.gcf-lcm-and-the-distributive-property',
      standard: 'M6MATH-4.4',
      description:
        'Find the GCF and LCM of two whole numbers ≤100/≤12; use the distributive property to express a sum of two whole numbers with a common factor (CCSS 6.NS.B.4).',
    },
  ],
  prerequisites: ['m6math.multiplying-and-dividing-decimals'],
  followUps: ['m6math.negative-numbers-in-context'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a real packing problem that needs a common factor before any vocabulary is introduced.',
      script:
        'You are packing goodie bags for your birthday party. You have 24 mini chocolate bars and 36 stickers, and every bag has to be identical, with nothing left over. What is the greatest number of bags you can make? You could guess and check, but there is a faster way to find that number every time, and it is the same idea that also tells you when two repeating things, like two different chore schedules, line up again. Today you learn both directions of that one idea, plus a way to rewrite a sum of two numbers using the number you pull out of them.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-common-factor-thread',
      kind: 'concept',
      goal: 'Install factors and multiples as opposite directions on the same number, then show GCF, LCM, and the distributive pull-out as the same thread.',
      keyIdeas: [
        'FACTORS GO DOWN, MULTIPLES GO UP — a factor of a number divides it evenly, with nothing left over. The factors of 12 are 1, 2, 3, 4, 6, and 12. A multiple of a number is what you get by multiplying it by a whole number. The multiples of 12 go up forever: 12, 24, 36, and so on. Factors are smaller than or equal to the number; multiples are the number or bigger.',
        'A COMMON FACTOR IS SHARED BY BOTH NUMBERS — list the factors of each number, then look for the ones that show up on both lists. The GREATEST COMMON FACTOR, or GCF, is the biggest number on that shared list. Finding a GCF means searching DOWN through factors for the biggest match.',
        'A COMMON MULTIPLE IS SHARED TOO — list the multiples of each number, then look for the ones that show up on both lists. The LEAST COMMON MULTIPLE, or LCM, is the smallest number on that shared list. Finding an LCM means searching UP through multiples for the smallest match.',
        'GCF AND LCM ARE ONE QUESTION, TWO DIRECTIONS — both start the same way, by listing and comparing. GCF looks down among shared factors for the biggest one. LCM looks up among shared multiples for the smallest one. Mixing up which direction the question wants is the single most common slip, so before answering, say out loud whether the problem needs the biggest shared factor or the smallest shared multiple.',
        'A COMMON FACTOR CAN BE PULLED OUT OF A SUM — if two whole numbers share a common factor, the distributive property lets you rewrite their sum as that factor times a sum of two smaller whole numbers. Divide each original number by the common factor to find what goes inside the parentheses. Using the GREATEST common factor gives the smallest possible numbers inside the parentheses.',
        'CHECK BY GOING BACKWARD — after pulling a factor out, multiply it back through the parentheses; you should land exactly back on the original sum. After finding an LCM, divide it by both original numbers; both divisions should come out even, with no remainder.',
      ],
      vocabulary: [
        { term: 'factor', definition: 'a whole number that divides another number evenly, with nothing left over.' },
        { term: 'multiple', definition: 'the result of multiplying a whole number by another whole number; the multiples of 12 are 12, 24, 36, and so on.' },
        { term: 'greatest common factor (GCF)', definition: 'the biggest whole number that is a factor of two given numbers.' },
        { term: 'least common multiple (LCM)', definition: 'the smallest whole number, other than zero, that is a multiple of two given numbers.' },
        { term: 'distributive property', definition: 'a rule that lets a common factor be pulled out of a sum, rewriting the sum as that factor times a sum of smaller whole numbers.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-goodie-bags-gcf',
      kind: 'worked_example',
      problem:
        'You have 24 mini chocolate bars and 36 stickers for goodie bags. Find the greatest number of identical bags you can make with nothing left over, and use the distributive property to show how many of each item goes in a bag.',
      steps: [
        'List the factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.',
        'List the factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.',
        'Find the numbers that appear on both lists: 1, 2, 3, 4, 6, and 12. The greatest one is 12, so GCF(24, 36) = 12. The greatest number of identical bags is 12.',
        'Divide each original number by the GCF to find what goes in each bag: 24 ÷ 12 = 2 chocolate bars, and 36 ÷ 12 = 3 stickers.',
        'Write the sum using the distributive property: 24 + 36 = 12 × 2 + 12 × 3 = 12 × (2 + 3).',
        'Check by multiplying back: 12 × (2 + 3) = 12 × 5 = 60, and 24 + 36 = 60. The two sides match.',
        'Read the answer back into the story: 12 bags, each holding 2 chocolate bars and 3 stickers, uses every item with nothing left over.',
      ],
      answer: '12 bags; 24 + 36 = 12 × (2 + 3)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-buses-lcm',
      kind: 'worked_example',
      problem:
        'Bus A stops at your corner every 8 minutes. Bus B stops at the same corner every 12 minutes. Both buses just stopped there together. In how many minutes will they stop there together again?',
      steps: [
        'This question asks when two repeating events line up again, so it needs a common MULTIPLE, not a common factor.',
        'List multiples of 8: 8, 16, 24, 32, 40, 48.',
        'List multiples of 12: 12, 24, 36, 48.',
        'Find the smallest number that appears on both lists: 24. So LCM(8, 12) = 24.',
        'WRONG: listing the shared FACTORS of 8 and 12 instead (1, 2, 4) and picking the greatest one, 4. That is the GCF, and it answers a different question: it does not tell you when the buses meet again. CORRECT: the buses meeting again is a shared multiple question, so the answer comes from the multiples lists, which give 24.',
        'Check by dividing the answer by both original numbers: 24 ÷ 8 = 3, and 24 ÷ 12 = 2. Both divisions come out even, with no remainder, so 24 is really a common multiple of both.',
      ],
      answer: '24 minutes',
      estimatedMinutes: 3,
    },
    {
      id: 'try-gcf-of-18-and-30',
      kind: 'try_yourself',
      problem: 'What is the GCF of 18 and 30?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6', correct: true },
        { id: 'b', text: '90' },
        { id: 'c', text: '3' },
        { id: 'd', text: '9' },
      ],
      expectedAnswer: '6',
      hints: [
        'List the factors of 18 and the factors of 30, then look for the numbers that show up on both lists.',
        'The greatest common factor is the BIGGEST number in that shared list, not just any shared factor you find first, and not a shared multiple.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lcm-of-6-and-8',
      kind: 'try_yourself',
      problem: 'What is the LCM of 6 and 8?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '48' },
        { id: 'c', text: '24', correct: true },
        { id: 'd', text: '14' },
      ],
      expectedAnswer: '24',
      hints: [
        'List multiples of 6 and multiples of 8, then look for the smallest number that shows up on both lists.',
        'The least common multiple is the SMALLEST shared multiple. It is not the greatest common factor, and multiplying the two numbers together only works when the numbers share no common factor bigger than 1, which 6 and 8 do not satisfy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-distributive-blank',
      kind: 'try_yourself',
      problem:
        'Malia is rewriting a sum using the distributive property: 28 + 42 = ___ × (2 + 3). What whole number goes in the blank? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '14',
      hints: [
        'The blank is the number you can pull out of both 28 and 42 using the distributive property. That number is their greatest common factor.',
        'List the factors of 28 and 42, find the biggest one they share, then check: that number times 2 should give 28, and that same number times 3 should give 42.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-swapping-gcf-and-lcm',
      kind: 'misconception_check',
      question:
        'One student is asked for the LCM of 4 and 6 and answers 2. Another student is asked for the GCF of the same two numbers, 4 and 6, and answers 12. What went wrong in each case?',
      commonErrors: [
        {
          answer: '2 (given as the LCM of 4 and 6)',
          misconception: 'Finding the GCF instead of the LCM — searching down through shared factors for the biggest one, when the question asked for the smallest shared multiple.',
          correctsTo:
            'The question asked for a common multiple, so the search should go through multiples, not factors. Multiples of 4: 4, 8, 12, 16. Multiples of 6: 6, 12, 18. The smallest number on both lists is 12, so LCM(4, 6) = 12, not 2. The number 2 is the GCF of 4 and 6, which answers a different question.',
        },
        {
          answer: '12 (given as the GCF of 4 and 6)',
          misconception: 'Finding the LCM instead of the GCF — searching up through shared multiples for the smallest one, when the question asked for the biggest shared factor.',
          correctsTo:
            'The question asked for a common factor, so the search should go through factors, not multiples. Factors of 4: 1, 2, 4. Factors of 6: 1, 2, 3, 6. The numbers on both lists are 1 and 2, and the greatest is 2, so GCF(4, 6) = 2, not 12. The number 12 is the LCM of 4 and 6, which answers a different question.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A factor divides a number evenly with nothing left over; a multiple is the number multiplied by a whole number.',
        'The greatest common factor (GCF) of two numbers is the biggest number that is a factor of both.',
        'The least common multiple (LCM) of two numbers is the smallest number that is a multiple of both.',
        'GCF and LCM are the same search run in opposite directions: GCF looks down through shared factors, LCM looks up through shared multiples. Say out loud which direction a problem needs before answering.',
        'The distributive property lets a common factor be pulled out of a sum: 24 + 36 = 12 × (2 + 3), because dividing each number by 12 gives the numbers inside the parentheses.',
        'Check a distributive rewrite by multiplying back out, and check an LCM by dividing it by both original numbers; every division should come out even.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'GCF, LCM & the Distributive Property' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
