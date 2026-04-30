/**
 * AP Calculus BC — Series convergence tests.
 *
 * Geometric, p-series, ratio test, alternating series, integral
 * test. When does an infinite sum equal a finite number?
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_BC_SERIES_CONVERGENCE: LessonPlan = {
  id: 'evelyn.ap.calcbc.series-convergence.v1',
  title: 'Series convergence tests',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.series-convergence',
      description: 'Apply convergence tests to determine whether an infinite series converges.',
      standard: 'AP-CALCBC-LIM-7',
    },
  ],
  prerequisites: ['apcalc.lhopitals'],
  followUps: ['apcalcbc.taylor-series'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The surprise of an infinite sum being finite.',
      script: '1/2 + 1/4 + 1/8 + 1/16 + … forever. Total? Exactly 1. An INFINITE sum can equal a FINITE number — that\'s convergence. We want to know when this happens.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tests',
      kind: 'concept',
      goal: 'Six common tests + when each applies.',
      keyIdeas: [
        'GEOMETRIC SERIES Σ a·rⁿ: converges to a/(1-r) IF |r| < 1, otherwise diverges.',
        'P-SERIES Σ 1/n^p: converges if p > 1, diverges if p ≤ 1. (Harmonic series Σ 1/n diverges; p=1.)',
        'NTH-TERM (DIVERGENCE) TEST: if lim aₙ ≠ 0, series DIVERGES. If lim = 0, test is INCONCLUSIVE.',
        'RATIO TEST: lim |aₙ₊₁/aₙ| = L. If L < 1, converges. L > 1, diverges. L = 1, inconclusive. Best for series with factorials or exponentials.',
        'ALTERNATING SERIES TEST: for Σ (-1)ⁿ bₙ with positive bₙ. Converges if bₙ is DECREASING and lim bₙ = 0.',
        'INTEGRAL TEST: if f(x) is positive, decreasing, continuous, then Σ f(n) and ∫₁^∞ f(x)dx have the same convergence behavior.',
        'COMPARISON TESTS: compare with a known convergent/divergent series term-by-term.',
        'STRATEGY: nth-term test first (cheap). Then identify shape — geometric, p-series, alternating, factorial — and apply matching test.',
      ],
      vocabulary: [
        { term: 'series', definition: 'an infinite sum of terms.' },
        { term: 'converge', definition: 'the partial sums approach a finite limit.' },
        { term: 'diverge', definition: 'the partial sums do not approach a finite limit.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-geometric',
      kind: 'worked_example',
      problem: 'Does Σ (from n=0) (1/3)ⁿ converge? If so, to what?',
      steps: [
        'This is GEOMETRIC with a = 1, r = 1/3.',
        '|r| = 1/3 < 1 → CONVERGES.',
        'Sum = a/(1-r) = 1 / (1 - 1/3) = 1 / (2/3) = 3/2.',
      ],
      answer: 'converges to 3/2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ratio',
      kind: 'worked_example',
      problem: 'Test Σ n!/2ⁿ for convergence using the ratio test.',
      steps: [
        'aₙ = n!/2ⁿ. aₙ₊₁ = (n+1)!/2ⁿ⁺¹.',
        'Ratio: aₙ₊₁/aₙ = [(n+1)!/2ⁿ⁺¹] · [2ⁿ/n!] = (n+1)/2.',
        'lim (n+1)/2 = ∞ → diverges.',
      ],
      answer: 'diverges',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Does Σ 1/n² converge?',
      expectedAnswer: 'yes — p-series with p = 2 > 1',
      responseFormat: 'free',
      hints: [
        'Identify shape: 1/n^p with p = 2.',
        'p-series rule: converges when p > 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-zero-implies-converge',
      kind: 'misconception_check',
      question: 'If lim aₙ = 0, does the series Σ aₙ converge?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating nth-term going to zero as sufficient.',
          correctsTo: 'No — necessary but NOT sufficient. The harmonic series Σ 1/n has terms going to 0 but DIVERGES. lim → 0 only RULES OUT obvious divergence; it doesn\'t prove convergence. You need a stronger test.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Geometric: |r| < 1 converges to a/(1-r).',
        'P-series: converges iff p > 1.',
        'Ratio test: L < 1 converges; great for factorials/exponentials.',
        'Alternating series: decreasing magnitudes + lim → 0 → converges.',
        'lim aₙ = 0 is necessary but NOT sufficient.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does Σ 1/n diverge but Σ 1/n² converge? They both go to zero.',
      hint: 'The terms of 1/n shrink TOO SLOWLY. The integral test applied to ∫1/x dx grows like ln(x) → ∞. For 1/n², ∫1/x² dx = -1/x → finite. The shape of the decay matters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
