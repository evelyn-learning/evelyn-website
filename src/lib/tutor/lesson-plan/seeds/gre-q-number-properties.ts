/**
 * GRE Quant — Number Properties: Primes, Factors, Divisibility.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_NUMBER_PROPERTIES: LessonPlan = {
  id: 'evelyn.gre.q.number-properties.v1',
  title: 'GRE Quant — Number Properties',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.number-properties',
      description: 'Apply divisibility rules, prime factorisation, and properties of even/odd, positive/negative under GRE constraints.',
      standard: 'GRE-Q-NUMBER-PROP',
    },
  ],
  prerequisites: ['gre.q.arithmetic'],
  followUps: ['gre.q.exponents-roots'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Number-property questions love testing divisibility, prime factors, and the algebra of even/odd.',
      script: '"Is the integer N divisible by 12?" "What is the smallest prime factor of 273?" "If x and y are both odd, what is x² + y² mod 4?" These questions yield instantly to a few core facts. Today we drill those facts so number-property questions become reflex.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-properties',
      kind: 'concept',
      goal: 'Divisibility shortcuts + prime factorisation + even/odd algebra.',
      keyIdeas: [
        'DIVISIBILITY RULES: by 2 → last digit even. By 3 → digit sum divisible by 3. By 4 → last two digits form a number divisible by 4. By 5 → last digit 0 or 5. By 6 → divisible by 2 AND 3. By 8 → last three digits divisible by 8. By 9 → digit sum divisible by 9. By 10 → ends in 0.',
        'BY 11: alternating-digit-sum (odd positions − even positions) divisible by 11.',
        'PRIME FACTORISATION: every integer > 1 has a unique product of primes (FTA). Useful for GCD and LCM.',
        'GCD = product of LOWEST shared prime powers. LCM = product of HIGHEST prime powers across both.',
        'NUMBER OF FACTORS: if n = p^a · q^b · …, count = (a+1)(b+1)·…',
        'EVEN/ODD ALGEBRA: even ± even = even. odd ± odd = even. even ± odd = odd. even × anything = even. odd × odd = odd.',
        'POSITIVE/NEGATIVE: pos × pos = pos. neg × neg = pos. pos × neg = neg. Three negatives = neg. Even number of negatives = pos.',
        'INTEGER vs ZERO: zero is even, neither positive nor negative.',
        'GRE TRAP: "How many primes are between 1 and 20?" Answer: 8 (2, 3, 5, 7, 11, 13, 17, 19). Don\'t forget 2 is prime. 1 is NOT prime.',
      ],
      vocabulary: [
        { term: 'prime', definition: 'integer > 1 with exactly two divisors: 1 and itself.' },
        { term: 'GCD', definition: 'greatest common divisor of two integers; largest n that divides both.' },
        { term: 'LCM', definition: 'least common multiple of two integers; smallest n divisible by both.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-factors',
      kind: 'worked_example',
      problem: 'How many positive divisors does 360 have?',
      steps: [
        'Prime-factorise: 360 = 2³ · 3² · 5¹.',
        'Apply formula: number of divisors = (3+1)(2+1)(1+1) = 4·3·2 = 24.',
        'CHECK by listing: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360. That\'s 24. ✓',
      ],
      answer: '24',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the GCD and LCM of 24 and 36.',
      expectedAnswer: 'GCD = 12; LCM = 72',
      responseFormat: 'free',
      hints: [
        '24 = 2³·3¹. 36 = 2²·3².',
        'GCD: lowest power of each shared prime. 2² · 3¹ = 12.',
        'LCM: highest power of each prime. 2³ · 3² = 72.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-one-prime',
      kind: 'misconception_check',
      question: 'Is 1 a prime number?',
      commonErrors: [
        {
          answer: 'Yes',
          misconception: 'Treating "only divisible by itself and 1" as the definition without checking the "exactly two divisors" requirement.',
          correctsTo: 'A prime has EXACTLY TWO distinct positive divisors. 1 has only one divisor (itself). So 1 is NOT prime. The smallest prime is 2 — also the only even prime. This convention preserves the uniqueness of prime factorisation: if 1 were prime, factorisations like 6 = 2·3 = 1·2·3 = 1·1·2·3 would be non-unique.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Divisibility: 3 → digit sum; 9 → digit sum; 4 → last two digits; 11 → alternating sum.',
        'Prime factorisation is unique. Number of divisors = product of (exponent + 1).',
        'GCD: lowest powers of shared primes. LCM: highest powers across both.',
        'Even/odd: even+odd=odd; odd·odd=odd; even·anything=even.',
        'Zero is even. 1 is NOT prime.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the smallest positive integer n such that 240n is a perfect cube.',
      hint: '240 = 2⁴·3¹·5¹. For a perfect cube, every prime exponent must be a multiple of 3. We need to multiply by 2² · 3² · 5² = 4·9·25 = 900 to reach exponents 6, 3, 3. So n = 900. Verify: 240·900 = 216000 = 60³. ✓',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
