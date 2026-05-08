/**
 * AP Statistics — Unit 4 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u4-frq-practice.v1', title: 'U4 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u4-frq-practice', description: 'Apply Unit 4 probability and distribution techniques.', standard: 'AP-STATS-4-FRQ' }],
  prerequisites: ['apstats.geometric-distribution'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 4 FRQs combining conditional probability, RV combinations, and distribution identification.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Two-way tables → conditional probability.',
      'Independence: P(A and B) = P(A)·P(B).',
      'BINS for binomial, BITS for geometric.',
      'Variances ALWAYS add (independent), even for differences.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-conditional', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Conditional. A health study finds: 30% of adults exercise daily; 25% are obese; 5% both exercise daily AND are obese. (a) Find P(obese GIVEN exercise daily). (b) Find P(exercise daily GIVEN obese). (c) Are exercise and obesity independent? Justify.',
      expectedAnswer: '(a) P(obese | exercise) = P(both)/P(exercise) = 0.05/0.30 = 1/6 ≈ 0.167. (1.5)\n(b) P(exercise | obese) = P(both)/P(obese) = 0.05/0.25 = 0.20. (1.5)\n(c) Test independence: P(exercise) · P(obese) = 0.30 · 0.25 = 0.075. P(both) = 0.05 ≠ 0.075. NOT independent. (Equivalently, P(obese | exercise) = 0.167 ≠ P(obese) = 0.25 — these aren\'t equal.) Specifically: obesity is LESS LIKELY among those who exercise (0.167 < 0.25), suggesting a NEGATIVE association. (3)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Apply formulas; check independence two ways.'], estimatedMinutes: 6 },
    { id: 'try-frq-binomial', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Binomial. A multiple-choice quiz has 12 questions, each with 5 choices. A student guesses on all questions. Let X = number correct. (a) Verify X is binomial. (b) Find μ_X and σ_X. (c) Find P(X ≥ 5). (d) The teacher passes anyone scoring at least 8 correct. Comment on the chance of passing by guessing alone.',
      expectedAnswer: '(a) BINS: Binary (right/wrong); Independent (different questions, no carryover); n = 12 fixed; Same p = 0.20 (1 of 5 correct by guess). X ~ Binomial(12, 0.20). (1.5)\n(b) μ = np = 12(0.20) = 2.4. σ = √(np(1−p)) = √(12·0.20·0.80) = √1.92 ≈ 1.386. (1.5)\n(c) P(X ≥ 5) = 1 − P(X ≤ 4) = 1 − binomcdf(12, 0.20, 4). binomcdf(12, 0.20, 4) ≈ 0.9274. P(X ≥ 5) ≈ 0.0726. (2)\n(d) P(X ≥ 8) = 1 − binomcdf(12, 0.20, 7) ≈ 1 − 0.9994 ≈ 0.0006. The chance of passing by guessing alone is about 0.06% — vanishingly small. (2)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Verify BINS; apply formulas; use binomcdf.'], estimatedMinutes: 7 },
    { id: 'try-frq-combine', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Combining RVs. A coffee shop sells small (X = $3.50) and medium (Y = $4.50) drinks. Daily mean small sales μ_X = 80 with σ_X = 12; daily mean medium sales μ_Y = 60 with σ_Y = 10. Assume sales of the two sizes are independent. Let R = total daily revenue from these two sizes. (a) Express R as a linear combination of X and Y. (b) Find μ_R. (c) Find σ_R.',
      expectedAnswer: '(a) R = 3.50·X + 4.50·Y (each small sale brings in $3.50; each medium $4.50). (1.5)\n(b) μ_R = 3.50·μ_X + 4.50·μ_Y = 3.50(80) + 4.50(60) = 280 + 270 = $550. (2)\n(c) σ²_R = (3.50)²·σ²_X + (4.50)²·σ²_Y (independence; variances add after scaling by coefficient²). \n  = (12.25)(144) + (20.25)(100) = 1764 + 2025 = 3789. σ_R = √3789 ≈ $61.56. (3.5)\nTotal: 7 points.',
      responseFormat: 'frq', hints: ['Linear transformation: σ²_{aX+bY} = a²σ²_X + b²σ²_Y when independent.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Conditional: P(A|B) = P(both)/P(B). Independence: P(both) = P(A)·P(B).',
      'Binomial: BINS, μ = np, σ = √(np(1−p)).',
      'Combining: variances add, with coefficient² for scaled RVs.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4-FRQ', cedTitle: 'Unit 4 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-4 FRQs.' }] },
};
