/**
 * AP Statistics — CED Unit 4.9+4.10: Binomial Distribution.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_BINOMIAL_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.ap.stats.binomial-distribution.v1', title: 'U4.9 Binomial Distribution',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.binomial-distribution', description: 'Identify binomial settings (BINS conditions). Compute binomial probabilities P(X = k) = C(n,k) p^k (1−p)^(n−k). Find mean μ = np and SD σ = √(np(1−p)). Use binomcdf and binompdf on the calculator.', standard: 'AP-STATS-4.9-4.10' }],
  prerequisites: ['apstats.combining-rv'], followUps: ['apstats.geometric-distribution'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the binomial setting.', script: "Binomial: count successes in a fixed number of independent trials, each with the same success probability. Comes up everywhere — coin flips, free throws, defective items, surveys. Memorize the BINS conditions.", estimatedMinutes: 2 },
    { id: 'concept-binomial', kind: 'concept', goal: 'Cover binomial conditions, formula, mean, SD.',
      keyIdeas: [
        'BINS — the four conditions for a BINOMIAL setting:',
        '  • B — BINARY: each trial has two outcomes (success / failure).',
        '  • I — INDEPENDENT trials.',
        '  • N — fixed NUMBER of trials n.',
        '  • S — same probability of SUCCESS p on each trial.',
        'BINOMIAL RV X = number of successes in n trials. X ~ Binomial(n, p).',
        'PMF (probability mass function): P(X = k) = C(n, k) · p^k · (1−p)^(n−k), where C(n, k) = n!/[k!(n−k)!] is the number of ways to choose k from n.',
        'AP CALCULATOR: binompdf(n, p, k) for P(X = k); binomcdf(n, p, k) for P(X ≤ k).',
        'MEAN: μ_X = np.',
        'SD: σ_X = √(np(1−p)).',
        '10% CONDITION (sampling without replacement approximation): if you\'re sampling without replacement, the trials are not strictly independent, but if n ≤ 10% of the population, binomial is a reasonable approximation.',
        'SHAPE: skewed when p is far from 0.5; symmetric when p = 0.5; approximately normal when np ≥ 10 AND n(1−p) ≥ 10 (Large Counts condition — used in inference for proportions).',
      ],
      vocabulary: [
        { term: 'binomial random variable', definition: 'count of successes in n independent trials with constant p.' },
        { term: 'BINS', definition: 'Binary, Independent, fixed N, Same p — checks for binomial setting.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-pmf', kind: 'worked_example',
      problem: 'A free-throw shooter has p = 0.7. He shoots 10 free throws. Find P(X = 7), where X = number made.',
      steps: [
        'STEP 1 — Check BINS: Binary (make/miss) ✓. Independent (assume) ✓. n = 10 fixed ✓. Same p = 0.7 ✓. X ~ Binomial(10, 0.7).',
        'STEP 2 — P(X = 7) = C(10, 7) · 0.7⁷ · 0.3³ = 120 · 0.0823543 · 0.027 = 120 · 0.002223 ≈ 0.2668.',
        'STEP 3 — Or: binompdf(10, 0.7, 7) ≈ 0.2668.',
      ],
      answer: 'P(X = 7) ≈ 0.2668.', estimatedMinutes: 4 },
    { id: 'try-mean-sd', kind: 'try_yourself',
      problem: 'A standardized test has 20 multiple-choice questions, each with 4 options. A student guesses on every question. Let X = number correct. (a) Why is X binomial? (b) Find μ_X and σ_X.',
      expectedAnswer: '(a) BINS: Binary (right/wrong); Independent (different questions); N = 20; Same p = 0.25 (random guess on 4 options). X ~ Binomial(20, 0.25). \n(b) μ = np = 20(0.25) = 5. σ = √(np(1−p)) = √(20·0.25·0.75) = √3.75 ≈ 1.936.',
      responseFormat: 'free', hints: ['Verify BINS; apply formulas.'], estimatedMinutes: 3 },
    { id: 'try-cdf', kind: 'try_yourself',
      problem: 'X ~ Binomial(15, 0.3). Find P(X ≤ 4).',
      expectedAnswer: 'P(X ≤ 4) = binomcdf(15, 0.3, 4). By calculator ≈ 0.5155. (Or sum P(X=0) + P(X=1) + P(X=2) + P(X=3) + P(X=4) by formula.)',
      responseFormat: 'free', hints: ['Use binomcdf for P(X ≤ k).'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A factory produces widgets with 8% defective rate. Random sample of 50 widgets. Let X = number of defective widgets. (a) Verify X is approximately binomial. (b) Find P(at least 5 defective). (c) Find μ_X and σ_X. (d) Is X exactly binomial? Justify.',
      expectedAnswer: '(a) Binary (defective/not), Independent (large factory output, sample is small fraction), N = 50, Same p = 0.08. (1.5)\n(b) P(X ≥ 5) = 1 − P(X ≤ 4) = 1 − binomcdf(50, 0.08, 4). binomcdf(50, 0.08, 4) ≈ 0.6290. P(X ≥ 5) ≈ 0.3710. (2)\n(c) μ = 50(0.08) = 4. σ = √(50·0.08·0.92) = √3.68 ≈ 1.918. (1.5)\n(d) Not exactly — sampling is WITHOUT replacement (each widget can only be selected once), so trials are NOT strictly independent. However, since the sample of 50 is likely a small fraction of total production (10% condition), binomial is a good approximation. (1.5)\nTotal: 6.5 points.',
      responseFormat: 'frq', hints: ['Verify BINS; use binomcdf for P(X ≥ k); apply 10% condition.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'BINS: Binary, Independent, fixed N, Same p.',
      'P(X = k) = C(n,k) p^k (1−p)^(n−k). μ = np. σ = √(np(1−p)).',
      'Calculator: binompdf for P(X = k), binomcdf for P(X ≤ k).',
      '10% condition for sampling without replacement.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.9-4.10', cedTitle: 'Binomial Distribution', sources: [{ type: 'concept', book: 'tps5e', chapter: '6', note: 'Standard binomial.' }] },
};
