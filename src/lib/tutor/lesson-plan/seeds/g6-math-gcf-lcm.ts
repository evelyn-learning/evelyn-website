/**
 * G6 — GCF and LCM.
 *
 * Greatest Common Factor (largest number that divides both) and
 * Least Common Multiple (smallest number both divide into).
 * Foundation for fraction operations and algebra simplification.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_GCF_LCM: LessonPlan = {
  id: 'evelyn.g6.math.numbers.gcf-lcm.v1',
  title: 'Greatest Common Factor and Least Common Multiple',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'numbers',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.ns.b.4',
      description: 'Find the greatest common factor of two whole numbers ≤ 100 and the least common multiple of two whole numbers ≤ 12.',
      standard: 'CCSS.MATH.CONTENT.6.NS.B.4',
    },
  ],
  prerequisites: ['ccss.math.4.oa.b.4'],
  followUps: ['ccss.math.6.ns.a.1'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up GCF as a real splitting/sharing problem.',
      script: 'You have 12 cookies and 18 brownies. You want to make identical bags — same number of each in every bag — with no leftovers. What\'s the BIGGEST number of bags you can make? That\'s GCF.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gcf-lcm',
      kind: 'concept',
      goal: 'GCF and LCM both come from prime factorization; they answer different questions.',
      keyIdeas: [
        'FACTORS of a number are what divides it evenly. Factors of 12: 1, 2, 3, 4, 6, 12.',
        'GCF (Greatest Common Factor) of two numbers = the LARGEST factor they share.',
        'MULTIPLES of a number: 4, 8, 12, 16, 20, 24… (multiply by 1, 2, 3, …).',
        'LCM (Least Common Multiple) of two numbers = the SMALLEST multiple they share.',
        'PRIME FACTORIZATION method: break each number into prime factors. GCF = product of primes both share. LCM = product of primes either uses, taking the highest count of each.',
        'Use GCF when you\'re SPLITTING things into equal groups. Use LCM when you\'re looking for when two cycles will MEET (e.g., events on different schedules).',
      ],
      vocabulary: [
        { term: 'factor', definition: 'a whole number that divides another evenly.' },
        { term: 'multiple', definition: 'a number you get by multiplying another by a whole number.' },
        { term: 'GCF', definition: 'greatest common factor — biggest number that divides both.' },
        { term: 'LCM', definition: 'least common multiple — smallest number both divide into.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-gcf-12-18',
      kind: 'worked_example',
      problem: 'Find the GCF of 12 and 18.',
      steps: [
        'List factors of 12: 1, 2, 3, 4, 6, 12.',
        'List factors of 18: 1, 2, 3, 6, 9, 18.',
        'Common factors: 1, 2, 3, 6.',
        'Greatest: 6.',
        'GCF(12, 18) = 6.',
      ],
      answer: '6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-lcm-4-6',
      kind: 'worked_example',
      problem: 'Find the LCM of 4 and 6.',
      steps: [
        'Multiples of 4: 4, 8, 12, 16, 20, 24…',
        'Multiples of 6: 6, 12, 18, 24…',
        'First common multiple: 12.',
        'LCM(4, 6) = 12.',
      ],
      answer: '12',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the GCF of 16 and 24.',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: [
        'List factors of each, then find the biggest one they share.',
        'Or: 16 = 2·2·2·2, 24 = 2·2·2·3. Three 2s in common = 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gcf-vs-lcm',
      kind: 'misconception_check',
      question: 'For sharing 24 candies and 18 chocolates equally into bags, do you use GCF or LCM?',
      commonErrors: [
        {
          answer: 'LCM',
          misconception: 'Confusing the two — using LCM when the problem asks for biggest equal split.',
          correctsTo: 'GCF — you want the BIGGEST number that divides BOTH evenly. LCM is for finding when cycles meet, not for splitting.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GCF = biggest number that divides BOTH (used for splitting equally).',
        'LCM = smallest number that BOTH divide into (used for cycles meeting).',
        'Prime factorization is the fastest method for big numbers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'GCF(a, b) × LCM(a, b) = ? Try with a=12, b=18 and check.',
      hint: 'You should find that GCF × LCM = a × b. Always.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
