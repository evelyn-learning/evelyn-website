/**
 * AP Statistics — CED Unit 4.11: Geometric Distribution.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_GEOMETRIC_DISTRIBUTION: LessonPlan = {
  id: 'evelyn.ap.stats.geometric-distribution.v1', title: 'U4.11 Geometric Distribution',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.geometric-distribution', description: 'Identify geometric settings (BITS conditions). Compute P(X = k) = (1−p)^(k−1) · p. Find mean μ = 1/p and SD σ = √((1−p)/p²). Use geompdf and geomcdf on the calculator.', standard: 'AP-STATS-4.11' }],
  prerequisites: ['apstats.binomial-distribution'], followUps: [], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame geometric setting.', script: "Binomial counts SUCCESSES in a fixed n. Geometric counts the TRIAL on which the FIRST SUCCESS occurs — n is NOT fixed; you keep going until success. Different setting, different formulas.", estimatedMinutes: 2 },
    { id: 'concept-geometric', kind: 'concept', goal: 'Cover geometric conditions, PMF, mean, SD.',
      keyIdeas: [
        'BITS — the conditions for a GEOMETRIC setting:',
        '  • B — BINARY: success / failure.',
        '  • I — INDEPENDENT trials.',
        '  • T — keep going until FIRST SUCCESS (not fixed n; T = trial number of first success).',
        '  • S — same probability p of success on each trial.',
        'GEOMETRIC RV X = trial number of the FIRST SUCCESS. X ~ Geometric(p).',
        'PMF: P(X = k) = (1−p)^(k−1) · p, for k = 1, 2, 3, ...',
        '  • Interpretation: (k−1) failures THEN a success on trial k.',
        'AP CALCULATOR: geompdf(p, k) for P(X = k); geomcdf(p, k) for P(X ≤ k).',
        'MEAN: μ_X = 1/p. (Average wait of 1/p trials for the first success.)',
        'SD: σ_X = √((1−p)/p²) = √(1−p) / p.',
        'SHAPE: ALWAYS skewed RIGHT (long tail of large k values). Most weight near k = 1.',
        'EXAMPLE comparison: rolling a fair die until first 6. p = 1/6. μ = 1/(1/6) = 6 trials on average.',
      ],
      vocabulary: [
        { term: 'geometric random variable', definition: 'trial number of the first success in independent Bernoulli trials.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-pmf', kind: 'worked_example',
      problem: 'A basketball player has p = 0.4 free-throw success. Find the probability she misses the first 3 shots and makes the 4th.',
      steps: [
        'STEP 1 — Geometric: X = trial of first made shot. p = 0.4.',
        'STEP 2 — P(X = 4) = (1 − 0.4)³ · 0.4 = 0.6³ · 0.4 = 0.216 · 0.4 = 0.0864.',
        'STEP 3 — Or: geompdf(0.4, 4) ≈ 0.0864.',
      ],
      answer: 'P(X = 4) = 0.0864.', estimatedMinutes: 3 },
    { id: 'try-mean', kind: 'try_yourself',
      problem: 'You roll a fair 6-sided die until you get a 6. Let X = trial number of the first 6. (a) Find μ_X and σ_X. (b) Find P(X = 1). (c) Find P(X ≤ 3).',
      expectedAnswer: '(a) p = 1/6. μ = 1/(1/6) = 6. σ = √(1−1/6)/((1/6)) = √(5/6)/(1/6) = (√(5/6))·6 = 6·√(5/6) ≈ 5.477. \n(b) P(X = 1) = (5/6)⁰ · (1/6) = 1/6 ≈ 0.167. \n(c) P(X ≤ 3) = P(X=1) + P(X=2) + P(X=3) = 1/6 + (5/6)(1/6) + (5/6)²(1/6). \n  = 0.1667 + 0.1389 + 0.1157 ≈ 0.4213. \n  Or: geomcdf(1/6, 3) ≈ 0.4213.',
      responseFormat: 'free', hints: ['μ = 1/p; geomcdf for cumulative.'], estimatedMinutes: 4 },
    { id: 'try-binomial-vs-geometric', kind: 'try_yourself',
      problem: 'Distinguish: (a) Number of heads in 10 flips of a fair coin. (b) Number of flips until the first head.',
      expectedAnswer: '(a) BINOMIAL (fixed n = 10, count successes). X ~ Binomial(10, 0.5). (b) GEOMETRIC (count trials until first success, n not fixed). X ~ Geometric(0.5). \nBinomial: BINS. Geometric: BITS.',
      responseFormat: 'free', hints: ['Fixed n? Binomial. Wait until first success? Geometric.'], estimatedMinutes: 2 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A spam filter catches phishing emails 90% of the time. Phishing emails arrive randomly. Let X = number of phishing emails until the first one is missed (slips through). (a) Why is X geometric? (b) Find μ_X. (c) Find P(at least 5 emails caught before the first miss).',
      expectedAnswer: '(a) Binary (caught / missed). Independent emails. Trial-until-first-success structure (where "success" here = filter MISSES the phishing email). p = probability of MISS = 0.10. X ~ Geometric(0.10). (1.5)\n(b) μ = 1/p = 1/0.10 = 10 emails. The filter catches 9 emails on average before the first miss. (1.5)\n(c) "At least 5 caught before the first miss" = the first miss is on trial 6 or later, i.e., X ≥ 6. P(X ≥ 6) = 1 − P(X ≤ 5) = 1 − geomcdf(0.10, 5) = 1 − 0.40951 ≈ 0.5905. (Or: P(first 5 all caught) = 0.9⁵ ≈ 0.5905, same answer.) (3)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Define p carefully — it\'s the success per BITS, which here = the miss event.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Geometric: trial of first success. BITS conditions.',
      'P(X = k) = (1−p)^(k−1) · p. μ = 1/p. σ = √(1−p)/p.',
      'Always right-skewed.',
      'Binomial: fixed n. Geometric: wait until first success.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.11', cedTitle: 'Geometric Distribution', sources: [{ type: 'concept', book: 'tps5e', chapter: '6', note: 'Standard geometric.' }] },
};
