/**
 * AP Statistics — CED Unit 4.8: Combining Random Variables.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U4_COMBINING_RV: LessonPlan = {
  id: 'evelyn.ap.stats.combining-rv.v1', title: 'U4.8 Combining Random Variables',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.combining-rv', description: 'Apply rules for transforming and combining random variables. For Y = a + bX: μ_Y = a + b·μ_X, σ_Y = |b|·σ_X. For X ± Y (independent): means add or subtract; variances ALWAYS add (never subtract).', standard: 'AP-STATS-4.8' }],
  prerequisites: ['apstats.random-variables'], followUps: ['apstats.binomial-distribution'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame transforming and combining RVs.', script: "If we add 5 to every value of X, the mean shifts by 5 but the SPREAD doesn\'t change. If we ADD two RVs, the means add — but the SDs don\'t (variances do, when independent). These rules show up everywhere.", estimatedMinutes: 2 },
    { id: 'concept-combine', kind: 'concept', goal: 'Cover the rules.',
      keyIdeas: [
        'LINEAR TRANSFORMATION: Y = a + bX (shift by a, scale by b).',
        '  • μ_Y = a + b·μ_X (mean shifts and scales).',
        '  • σ_Y = |b| · σ_X (SD scales by |b|, not affected by shift).',
        '  • σ²_Y = b² · σ²_X.',
        'SUM/DIFFERENCE of two RVs X and Y:',
        '  • μ_{X+Y} = μ_X + μ_Y. ALWAYS — independence not required.',
        '  • μ_{X−Y} = μ_X − μ_Y. ALWAYS.',
        '  • IF X AND Y ARE INDEPENDENT: σ²_{X+Y} = σ²_X + σ²_Y. AND σ²_{X−Y} = σ²_X + σ²_Y (variance still ADDS — not subtracts).',
        '  • SD: σ_{X+Y} = √(σ²_X + σ²_Y) when independent. NOT σ_X + σ_Y.',
        'CRITICAL: variances ADD even for differences (provided independence). Intuitively: subtracting a noisy variable adds its noise.',
        'COMMON MISTAKE: σ_{X+Y} = σ_X + σ_Y ❌. The right formula is σ_{X+Y} = √(σ²_X + σ²_Y).',
        'EXAMPLES of when combining is needed:',
        '  • Total weight of N independent items: μ_total = N·μ, σ²_total = N·σ².',
        '  • Difference between two test scores: μ_diff = μ_A − μ_B, σ²_diff = σ²_A + σ²_B (if independent).',
      ],
      vocabulary: [
        { term: 'linear transformation', definition: 'Y = a + bX; mean shifts by a and scales by b; SD scales by |b|.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-transform', kind: 'worked_example',
      problem: 'X = number of cars sold per day, with μ_X = 2.0, σ_X = 1.1. The salesperson earns Y = $50 + $200X per day. Find μ_Y and σ_Y.',
      steps: [
        'STEP 1 — Linear transformation Y = 50 + 200X. a = 50, b = 200.',
        'STEP 2 — μ_Y = a + b·μ_X = 50 + 200(2.0) = 50 + 400 = $450.',
        'STEP 3 — σ_Y = |b| · σ_X = 200 · 1.1 = $220.',
      ],
      answer: 'μ_Y = $450; σ_Y = $220.', estimatedMinutes: 3 },
    { id: 'try-sum', kind: 'try_yourself',
      problem: 'A box has X = number of pens drawn (μ_X = 3, σ_X = 1). An unrelated box has Y = number of pencils drawn (μ_Y = 5, σ_Y = 2). Assume X and Y are independent. (a) Find the mean and SD of TOTAL drawn (X + Y). (b) Find the mean and SD of pen excess Y − X.',
      expectedAnswer: '(a) μ_{X+Y} = 3 + 5 = 8. σ²_{X+Y} = 1² + 2² = 5. σ_{X+Y} = √5 ≈ 2.236. \n(b) μ_{Y−X} = 5 − 3 = 2. σ²_{Y−X} = 1² + 2² = 5 (variance ADDS). σ_{Y−X} = √5 ≈ 2.236.',
      responseFormat: 'free', hints: ['Means add/subtract; variances ALWAYS add (when independent).'], estimatedMinutes: 4 },
    { id: 'try-error', kind: 'try_yourself',
      problem: 'A student computes σ_{X+Y} = σ_X + σ_Y = 1 + 2 = 3 for independent X and Y with σ_X = 1 and σ_Y = 2. Why is this wrong, and what\'s the correct answer?',
      expectedAnswer: 'Wrong because SDs DO NOT ADD. VARIANCES add. σ²_{X+Y} = 1² + 2² = 5. σ_{X+Y} = √5 ≈ 2.236. The student\'s answer (3) is too large — it would correspond to the SDs being collinear (positively correlated, which violates independence).',
      responseFormat: 'free', hints: ['Recall: variances add, then take square root.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. A factory produces widgets with weight X (μ_X = 50g, σ_X = 2g) and packaging with weight Y (μ_Y = 10g, σ_Y = 0.5g). One widget plus its packaging is shipped. (a) Mean and SD of total shipped weight (assume X and Y independent). (b) The shipping fee is $0.05 per gram. What\'s the mean and SD of the fee?',
      expectedAnswer: '(a) μ_{total} = 50 + 10 = 60g. σ²_{total} = 4 + 0.25 = 4.25. σ_{total} = √4.25 ≈ 2.062g. (3)\n(b) Let Z = 0.05·Total (linear transformation, b = 0.05). μ_Z = 0.05(60) = $3.00. σ_Z = 0.05(2.062) ≈ $0.103. (3)\nTotal: 6 points.',
      responseFormat: 'frq', hints: ['Combine independent RVs first, then linear transformation.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Y = a + bX: μ_Y = a + b·μ_X; σ_Y = |b|·σ_X.',
      'Means ADD/SUBTRACT. Variances ALWAYS ADD (when independent), even for X − Y.',
      'σ_{X±Y} = √(σ²_X + σ²_Y) when independent.',
      'Adding a constant doesn\'t change SD; multiplying does.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4.8', cedTitle: 'Combining Random Variables', sources: [{ type: 'concept', book: 'tps5e', chapter: '6', note: 'Standard combining RVs.' }] },
};
