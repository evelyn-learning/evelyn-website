/**
 * AP Calculus BC — CED Unit 10.7+10.10: Alternating Series Test and Error
 * Bound.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U10_ALTERNATING_SERIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.alternating-series.v1', title: 'U10.7 Alternating Series and Error Bound',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.alternating-series', description: 'Apply the alternating series test (terms decrease in magnitude, terms → 0 ⇒ series converges). Bound the error of a partial sum approximation by the next term: |S − S_N| ≤ |a_{N+1}|.', standard: 'AP-CALCBC-10.7-10.10' }],
  prerequisites: ['apcalcbc.convergence-tests'], followUps: ['apcalcbc.ratio-test'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame alternating series.', script: "Alternating series have signs that flip: +, -, +, -, ... A weaker convergence rule applies — and the error of any partial sum is BOUNDED by the next term. AP loves error-bound questions.", estimatedMinutes: 2 },
    { id: 'concept-alternating', kind: 'concept', goal: 'Cover alternating series test + error bound.',
      keyIdeas: [
        'ALTERNATING SERIES: Σ (-1)^n · b_n or Σ (-1)^{n+1} · b_n where b_n > 0.',
        'ALTERNATING SERIES TEST (AST): Σ (-1)^n b_n converges if BOTH:',
        '  (1) b_n is DECREASING (b_{n+1} ≤ b_n) for all n past some N,',
        '  (2) lim b_n = 0.',
        'EXAMPLE — Alternating harmonic: Σ (-1)^{n+1}/n = 1 − 1/2 + 1/3 − 1/4 + ... b_n = 1/n is decreasing, lim = 0. Converges. (Sum = ln 2.)',
        'ALTERNATING SERIES ERROR BOUND: If Σ (-1)^n b_n satisfies AST and converges to S, then |S − S_N| ≤ b_{N+1}. The error of using partial sum S_N is at most the FIRST OMITTED TERM in absolute value.',
        'EXAMPLE — Approximate Σ (-1)^{n+1}/n² to within 0.01. Need b_{N+1} = 1/(N+1)² ≤ 0.01, i.e., (N+1)² ≥ 100, i.e., N + 1 ≥ 10, i.e., N ≥ 9. So S_9 = 1 − 1/4 + 1/9 − 1/16 + 1/25 − 1/36 + 1/49 − 1/64 + 1/81 ≈ 0.828 has error ≤ 1/100 = 0.01.',
        'CRITICAL: AST and the error bound require ALTERNATING signs AND decreasing |terms| AND limit 0. Don\'t apply to non-alternating series.',
      ],
      vocabulary: [
        { term: 'alternating series', definition: 'Σ (-1)^n b_n with b_n > 0.' },
      ],
      estimatedMinutes: 4 },
    { id: 'worked-ast', kind: 'worked_example', problem: 'Determine convergence of Σ (-1)^n/(2n + 1) and find an N such that S_N approximates the sum within 0.01.',
      steps: [
        'STEP 1 — AST. b_n = 1/(2n+1) > 0. Decreasing? 1/(2n+1) > 1/(2n+3) ✓. lim b_n = 0 ✓. Converges.',
        'STEP 2 — Error bound: |S − S_N| ≤ b_{N+1} = 1/(2(N+1)+1) = 1/(2N+3). Need ≤ 0.01. 2N+3 ≥ 100. N ≥ 48.5 → N = 49.',
        'STEP 3 — S_49 approximates the sum within 0.01.',
      ],
      answer: 'Converges by AST. N = 49 gives error ≤ 0.01.', estimatedMinutes: 4 },
    { id: 'try-error', kind: 'try_yourself', problem: 'For Σ_{n=1}^∞ (-1)^{n+1}/n!, find an upper bound on |S − S_4|.',
      expectedAnswer: 'b_n = 1/n!. AST applies (b_n decreases, b_n → 0, alternating). Error |S − S_N| ≤ b_{N+1}. So |S − S_4| ≤ b_5 = 1/5! = 1/120 ≈ 0.00833.',
      responseFormat: 'numeric', hints: ['First omitted term bounds the error.'], estimatedMinutes: 3 },
    { id: 'try-ast-test', kind: 'try_yourself', problem: 'Does Σ (-1)^n · n/(n+1) converge?',
      expectedAnswer: 'b_n = n/(n+1). lim b_n = 1 ≠ 0. AST condition (2) FAILS. Not only does AST fail to apply, but the nth-term divergence test shows the original series DIVERGES (since lim |a_n| = 1, lim a_n DNE → ≠ 0).',
      responseFormat: 'free', hints: ['Check lim b_n = 0 first; if not, series diverges.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself', problem: 'AP-style synthesis. The series Σ_{n=0}^∞ (-1)^n/(2n+1) converges to π/4. Approximate π/4 using S_3, and find the error bound.',
      expectedAnswer: 'S_3 = a_0 + a_1 + a_2 + a_3 = 1 − 1/3 + 1/5 − 1/7 = (105 − 35 + 21 − 15)/105 = 76/105 ≈ 0.7238. Error: |S − S_3| ≤ b_4 = 1/(2·4+1) = 1/9 ≈ 0.111. So π/4 ∈ [S_3 − 1/9, S_3 + 1/9] ≈ [0.6128, 0.8349]. (Actual π/4 ≈ 0.7854 ✓ within bound.)',
      responseFormat: 'frq', hints: ['Compute S_3, then bound error by next term.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'AST: alternating series Σ (-1)^n b_n converges if b_n decreases AND b_n → 0.',
      'Error bound: |S − S_N| ≤ b_{N+1} = first omitted term in absolute value.',
      'AST condition lim b_n = 0 must hold, else series diverges by nth-term test.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '10', cedTopic: '10.7-10.10', cedTitle: 'Alternating Series', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '9', note: 'Standard AST + error bound.' }] },
};
