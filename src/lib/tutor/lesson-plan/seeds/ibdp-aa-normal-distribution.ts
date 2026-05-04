/**
 * IB DP Math AA — Normal Distribution.
 * z-scores, standardisation, P(X < x) and P(a < X < b), inverse-normal.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_NORMAL_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.ibdp.aa.normal-distribution.v1',
  title: 'IB DP Math AA — Normal Distribution',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.normal-distribution',
      description: 'Use the normal distribution N(μ, σ²) to compute probabilities and percentiles; standardise via z = (x − μ)/σ; perform inverse-normal lookups.',
      standard: 'IB-DP-MATH-AA-4.10/4.11',
    },
  ],
  prerequisites: ['ibdp.aa.binomial-distribution'],
  followUps: ['ibdp.aa.limits-continuity'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The normal distribution underpins inferential statistics — heights, IQs, measurement errors, exam scores all follow it approximately.',
      script: 'Normal distribution questions in IB AA are calculator-heavy: standardise, look up, or use invNorm. The key skill is identifying which probability is being asked — "less than", "more than", "between", "find x such that…" — and pressing the right buttons.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-normal',
      kind: 'concept',
      goal: 'Symmetry, standardisation, table/calculator usage, inverse-normal.',
      keyIdeas: [
        'NOTATION: X ~ N(μ, σ²). μ is mean (centre); σ² is variance, σ is standard deviation. Curve is symmetric around μ.',
        'EMPIRICAL RULE: ≈68% within μ ± σ; ≈95% within μ ± 2σ; ≈99.7% within μ ± 3σ.',
        'STANDARDISATION: Z = (X − μ)/σ converts X ~ N(μ, σ²) to Z ~ N(0, 1) (standard normal).',
        'PROBABILITIES: P(X < x) on calculator: normalCDF(−∞, x, μ, σ) [or use a large negative like −10⁹]. Between: normalCDF(a, b, μ, σ).',
        'COMPLEMENT: P(X > x) = 1 − P(X < x). Continuous distribution → P(X = x) = 0.',
        'INVERSE NORMAL: given a probability, find the x. invNorm(p, μ, σ) returns x such that P(X < x) = p. Used for percentiles ("the top 10%" = 90th percentile).',
        'COMMON IB PHRASING: "the top 5%" = P(X > x) = 0.05 → P(X < x) = 0.95 → x = invNorm(0.95, μ, σ).',
        'SYMMETRY USE: P(X > μ) = 0.5 always. P(X < μ − a) = P(X > μ + a) by symmetry.',
      ],
      vocabulary: [
        { term: 'standardisation', definition: 'rescaling X ~ N(μ, σ²) to Z ~ N(0, 1) using z = (x − μ)/σ.' },
        { term: 'inverse normal', definition: 'finding x given a probability P(X < x) = p; the inverse of the CDF.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-normal',
      kind: 'worked_example',
      problem: 'X ~ N(50, 8²). Find: (a) P(X < 60), (b) P(40 < X < 55), (c) the value c such that P(X > c) = 0.10.',
      steps: [
        '(a) Standardise: z = (60 − 50)/8 = 1.25. P(X < 60) = P(Z < 1.25) ≈ 0.8944. (On GDC: normalCDF(−10⁹, 60, 50, 8) ≈ 0.8944.)',
        '(b) z₁ = (40 − 50)/8 = −1.25; z₂ = (55 − 50)/8 = 0.625. P(40 < X < 55) = P(−1.25 < Z < 0.625) ≈ Φ(0.625) − Φ(−1.25) ≈ 0.7340 − 0.1056 = 0.6284. (Or normalCDF(40, 55, 50, 8).)',
        '(c) "Top 10%": P(X > c) = 0.10 → P(X < c) = 0.90. invNorm(0.90, 50, 8) ≈ 50 + 8·1.282 = 50 + 10.26 = 60.3.',
      ],
      answer: '(a) ≈ 0.894; (b) ≈ 0.628; (c) ≈ 60.3',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Adult heights are normally distributed with mean 170 cm and SD 8 cm. What proportion are taller than 180 cm?',
      expectedAnswer: '≈ 0.106 (about 10.6%)',
      responseFormat: 'free',
      hints: [
        'Standardise: z = (180 − 170)/8 = 1.25.',
        'P(X > 180) = P(Z > 1.25) = 1 − P(Z < 1.25).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-z-table',
      kind: 'misconception_check',
      question: 'A student computes z = (180 − 170)/8 = 1.25 and reports P(X > 180) = 1.25. What\'s wrong?',
      commonErrors: [
        {
          answer: 'P(X > 180) = 1.25',
          misconception: 'Confusing the z-value (a position on the standard normal axis) with a probability.',
          correctsTo: 'z = 1.25 is just the standardised value of x = 180 — it tells you that 180 is 1.25 SDs above the mean. The PROBABILITY is found by looking up Φ(1.25) ≈ 0.8944 (probability of being LESS than) and subtracting from 1: P(Z > 1.25) = 1 − 0.8944 ≈ 0.106. Probabilities are between 0 and 1; z-values can exceed 1 or be negative.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'X ~ N(μ, σ²). Standardise: Z = (X − μ)/σ.',
        'normalCDF(a, b, μ, σ) for P(a < X < b). invNorm(p, μ, σ) for percentile.',
        'Symmetry: P(X > μ) = 0.5. P(X < μ − a) = P(X > μ + a).',
        'Empirical rule: 68/95/99.7 within ±1, ±2, ±3 σ.',
        'Inverse-normal for "top X%" or "lowest Y%" questions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'X ~ N(μ, 25). Given that P(X < 50) = 0.8413, find μ.',
      hint: 'P(Z < z) = 0.8413 → z = 1 (this is a standard fact: 1 SD above the mean covers 84.13%). z = (50 − μ)/5 = 1 → μ = 45.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
