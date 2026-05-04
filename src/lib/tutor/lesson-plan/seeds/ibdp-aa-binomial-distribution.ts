/**
 * IB DP Math AA — Binomial Distribution.
 * P(X = k) = nCk p^k (1-p)^(n-k); E(X) = np; Var(X) = np(1-p);
 * cumulative probability questions.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_BINOMIAL_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.ibdp.aa.binomial-distribution.v1',
  title: 'IB DP Math AA — Binomial Distribution',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.binomial-distribution',
      description: 'Identify when a random variable is binomially distributed; compute P(X = k), P(X ≤ k), and use E(X) = np, Var(X) = np(1−p).',
      standard: 'IB-DP-MATH-AA-4.8',
    },
  ],
  prerequisites: ['ibdp.aa.probability'],
  followUps: ['ibdp.aa.normal-distribution'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The binomial distribution models any "n independent yes/no trials" scenario — fundamentally common.',
      script: 'Survey results, quality control, sports outcomes, repeated coin flips. Whenever you have N trials and each has the SAME success probability p, the count of successes follows a binomial distribution. The IB AA formula sheet gives you the basics; the skill is identifying when binomial applies and using cumulative probability.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-binomial',
      kind: 'concept',
      goal: 'Conditions, formula, mean, variance, and use of CDF.',
      keyIdeas: [
        'BINOMIAL CONDITIONS (BINS): Bernoulli (each trial yes/no) · Independent trials · Number n FIXED · Same probability p of success on each trial.',
        'NOTATION: X ~ B(n, p). Read as "X is binomially distributed with n trials and success probability p".',
        'PMF: P(X = k) = C(n, k)·p^k·(1 − p)^(n − k) for k ∈ {0, 1, …, n}.',
        'EXPECTED VALUE: E(X) = np. Variance: Var(X) = np(1 − p). Standard deviation: σ = √[np(1 − p)].',
        'CUMULATIVE: P(X ≤ k) = Σ from i=0 to k of P(X = i). On GDC: binomCDF(n, p, k).',
        '"AT LEAST" / "AT MOST" / "EXACTLY": "at least k" = P(X ≥ k) = 1 − P(X ≤ k − 1). "Exactly k" = P(X = k). "More than k" = P(X > k) = 1 − P(X ≤ k).',
        'COMMON IB QUESTION: "Find n such that P(X ≥ 1) > 0.95". Use complement: 1 − P(X = 0) > 0.95 → P(X = 0) < 0.05 → (1 − p)^n < 0.05 → take logs.',
        'CALCULATOR FLUENCY: IB AA expects competence with the GDC binomCDF / binomPDF — they speed up cumulative questions enormously.',
      ],
      vocabulary: [
        { term: 'PMF', definition: 'probability mass function: P(X = k) for a discrete random variable.' },
        { term: 'CDF', definition: 'cumulative distribution function: P(X ≤ k).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-binomial',
      kind: 'worked_example',
      problem: 'A fair coin is tossed 8 times. Let X be the number of heads. Find: (a) P(X = 5), (b) E(X), (c) P(X ≥ 6).',
      steps: [
        'X ~ B(8, 0.5).',
        '(a) P(X = 5) = C(8, 5)·(0.5)⁵·(0.5)³ = 56·(0.5)⁸ = 56/256 = 7/32 ≈ 0.219.',
        '(b) E(X) = np = 8·0.5 = 4.',
        '(c) P(X ≥ 6) = P(X = 6) + P(X = 7) + P(X = 8). C(8,6)=28, C(8,7)=8, C(8,8)=1. Each multiplied by (0.5)⁸ = 1/256. Sum = (28 + 8 + 1)/256 = 37/256 ≈ 0.145.',
        'ALTERNATIVE for (c): use complement: P(X ≥ 6) = 1 − P(X ≤ 5). On GDC: 1 − binomCDF(8, 0.5, 5).',
      ],
      answer: '(a) ≈ 0.219; (b) 4; (c) ≈ 0.145',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A factory produces components. 5% are defective. In a batch of 20 components, find the probability that exactly 2 are defective.',
      expectedAnswer: 'P(X = 2) ≈ 0.189',
      responseFormat: 'numeric',
      hints: [
        'X ~ B(20, 0.05).',
        'P(X = 2) = C(20, 2)·(0.05)²·(0.95)¹⁸.',
        'C(20, 2) = 190.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-not-binomial',
      kind: 'misconception_check',
      question: 'Drawing 5 cards without replacement from a standard deck, X = number of hearts. Is X binomial?',
      commonErrors: [
        {
          answer: 'Yes, X ~ B(5, 13/52) since each card is hearts with probability 1/4',
          misconception: 'Applying the binomial model whenever there are repeated yes/no trials, ignoring whether trials are INDEPENDENT.',
          correctsTo: 'WITHOUT REPLACEMENT, the trials are NOT independent — drawing one heart changes the probability of the next card being a heart. Binomial requires constant p across trials. The correct model here is the HYPERGEOMETRIC distribution. In an IB AA question, watch for the word "without replacement" or "from a finite list" — these signal NON-binomial. With replacement (or large population so removal is negligible), binomial applies.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'X ~ B(n, p) requires: fixed n, independent trials, constant p.',
        'P(X = k) = C(n,k)p^k(1−p)^(n−k).',
        'E(X) = np. Var(X) = np(1−p).',
        '"At least" = 1 − "at most one less". Master the complement trick.',
        'Without replacement → NOT binomial.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A multiple-choice quiz has 10 questions, each with 4 options. Find the smallest mark m such that the probability of randomly scoring at least m by guessing is less than 5%.',
      hint: 'X ~ B(10, 0.25). Want smallest m with P(X ≥ m) < 0.05. P(X ≥ 5) = 1 − binomCDF(10, 0.25, 4) ≈ 1 − 0.9219 = 0.0781. P(X ≥ 6) = 1 − binomCDF(10, 0.25, 5) ≈ 1 − 0.9803 = 0.0197 < 0.05. So m = 6.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
