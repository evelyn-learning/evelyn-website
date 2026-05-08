/**
 * AP Statistics — CED Unit 1.9: Comparing Distributions of a
 * Quantitative Variable.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_COMPARING_DISTRIBUTIONS: LessonPlan = {
  id: 'evelyn.ap.stats.comparing-distributions.v1', title: 'U1.9 Comparing Distributions',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.comparing-distributions', description: 'Compare two or more distributions on shape, outliers, center, and spread, using context and parallel boxplots or back-to-back stemplots.', standard: 'AP-STATS-1.9' }],
  prerequisites: ['apstats.summary-statistics'], followUps: ['apstats.normal-distribution'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame comparison FRQs.', script: "AP exam loves COMPARE-TWO-DISTRIBUTIONS questions. The grader is looking for explicit comparisons — not two separate descriptions. \"Group A is HIGHER than B\" beats \"Group A is high; Group B is low.\"", estimatedMinutes: 2 },
    { id: 'concept-compare', kind: 'concept', goal: 'Cover comparison framework.',
      keyIdeas: [
        'COMPARE — don\'t just describe. Use words like HIGHER, LOWER, MORE, LESS, GREATER SPREAD.',
        'TOOLS for comparison:',
        '  • PARALLEL BOXPLOTS: side-by-side boxplots on the same scale. Shows median + IQR + outliers visually.',
        '  • BACK-TO-BACK STEMPLOT: one set of stems, leaves go right for one group, left for another.',
        '  • DUAL HISTOGRAMS: same scale, stacked vertically.',
        'COMPARE on all four pieces of SOCS:',
        '  • SHAPE: e.g., "A is roughly symmetric; B is skewed right."',
        '  • OUTLIERS: presence or absence in either group.',
        '  • CENTER: which has higher median (or mean if symmetric)?',
        '  • SPREAD: which has greater IQR (or SD)?',
        'AP RUBRIC: missing context = lose a point. Missing comparison word = lose a point. Two separate descriptions are NOT a comparison.',
      ],
      vocabulary: [
        { term: 'parallel boxplots', definition: 'two or more boxplots on a shared scale for direct comparison.' },
      ],
      estimatedMinutes: 4 },
    { id: 'worked-compare', kind: 'worked_example',
      problem: 'Two parallel boxplots show test scores for Class A and Class B. \nClass A: min=50, Q1=68, median=78, Q3=85, max=98. No outliers. \nClass B: min=40, Q1=55, median=65, Q3=80, max=92. Outlier at 40. \nCompare the distributions in a SOCS sentence.',
      steps: [
        'STEP 1 — SHAPE: Class A appears roughly symmetric (Q3−median = 7, median−Q1 = 10 — close-ish). Class B is right-skewed (Q3−median = 15, median−Q1 = 10) — actually that\'s skew of the upper half. Tail considerations: B has the wider lower tail too. From these summary stats alone, B looks SLIGHTLY left-skewed or symmetric with low outlier. Use \"approximately symmetric\" or \"slightly skewed\" with appropriate hedging.',
        'STEP 2 — OUTLIERS: Class A has none; Class B has a low outlier at 40.',
        'STEP 3 — CENTER: Class A median (78) is HIGHER than Class B median (65). Difference: 13 points.',
        'STEP 4 — SPREAD: Class A IQR = 85−68 = 17. Class B IQR = 80−55 = 25. Class B has GREATER spread.',
        'STEP 5 — Comparison sentence: "Class A scored higher on average (median 78 vs 65 for Class B) and was more consistent (IQR 17 vs 25). Class B had a low outlier at 40; Class A had no outliers. Both distributions look roughly symmetric."',
      ],
      answer: 'Class A: higher median (78 vs 65), smaller IQR (17 vs 25), no outliers. Class B: lower, more spread, low outlier at 40.', estimatedMinutes: 5 },
    { id: 'try-compare', kind: 'try_yourself',
      problem: 'AP-style synthesis. Boxplots of commute times (minutes) for two cities: \nCity X: median 25, IQR 15, range 5-65. \nCity Y: median 35, IQR 30, range 10-90. \nWrite a 2-sentence comparison.',
      expectedAnswer: '"Commutes in City Y tend to be longer than in City X (median 35 vs 25 minutes) and more variable (IQR 30 vs 15 minutes). City Y also has a wider range (10-90 vs 5-65), suggesting more extreme commute times in either direction."',
      responseFormat: 'free', hints: ['Use comparative words. Stay in CONTEXT (commute time).'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'COMPARE — use higher/lower/greater/smaller. Two parallel descriptions are NOT a comparison.',
      'Compare on all four pieces of SOCS.',
      'Always include context (units, what\'s measured).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.9', cedTitle: 'Comparing Distributions', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard comparison framework.' }] },
};
