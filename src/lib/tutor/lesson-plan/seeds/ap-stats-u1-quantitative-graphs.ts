/**
 * AP Statistics — CED Unit 1.5: Representing a Quantitative Variable
 * with Graphs (dotplot, stemplot, histogram).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_QUANTITATIVE_GRAPHS: LessonPlan = {
  id: 'evelyn.ap.stats.quantitative-graphs.v1', title: 'U1.5 Quantitative Graphs (Dotplot, Stemplot, Histogram)',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.quantitative-graphs', description: 'Construct and interpret dotplots, stemplots, and histograms for a quantitative variable. Choose appropriate bin widths.', standard: 'AP-STATS-1.5' }],
  prerequisites: ['apstats.categorical-data'], followUps: ['apstats.distribution-shape'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame the choice of display.', script: "Three classic displays for a quantitative variable: dotplot, stemplot, histogram. Each shows the SHAPE of the distribution; they differ in how much detail they keep.", estimatedMinutes: 2 },
    { id: 'concept-displays', kind: 'concept', goal: 'Cover all three displays.',
      keyIdeas: [
        'DOTPLOT: each value is a dot above its number-line position. KEEPS every individual value. Best for small datasets (n < ~50).',
        'STEMPLOT (stem-and-leaf): split each value into a "stem" (leading digits) and "leaf" (trailing digit). Stem 4 with leaf 7 means 47. KEEPS every value. Sort leaves left-to-right. Always include a KEY (e.g., "4 | 7 means 47").',
        'BACK-TO-BACK STEMPLOT: compares two distributions sharing one set of stems; one group\'s leaves go right, the other\'s leaves go left.',
        'HISTOGRAM: bars over equal-width INTERVALS (bins). Bar HEIGHT = frequency or relative frequency. Bars TOUCH (no gaps) — distinguishes from bar charts.',
        'BIN WIDTH MATTERS: too wide loses detail; too narrow is noisy. Rule of thumb: 5–15 bins is typical.',
        'CRITICAL: histograms LOSE individual values; you can read approximate counts from bar heights but not exact data points.',
      ],
      vocabulary: [
        { term: 'histogram', definition: 'a graph of frequencies over equal-width intervals; bars touch.' },
        { term: 'bin', definition: 'an interval of values represented by one bar in a histogram.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-stemplot', kind: 'worked_example',
      problem: 'Construct a stemplot for these test scores: 62, 75, 80, 81, 84, 73, 66, 91, 88, 79, 70, 82, 95, 78.',
      steps: [
        'STEP 1 — Sort: 62, 66, 70, 73, 75, 78, 79, 80, 81, 82, 84, 88, 91, 95.',
        'STEP 2 — Stems are tens digit; leaves are ones digit.',
        'STEP 3 — Stemplot:\n  6 | 2 6\n  7 | 0 3 5 8 9\n  8 | 0 1 2 4 8\n  9 | 1 5\n  KEY: 6 | 2 means 62.',
      ],
      answer: 'Stemplot (see steps); shape: roughly mound-shaped, slight left skew.', estimatedMinutes: 4 },
    { id: 'try-histogram', kind: 'try_yourself',
      problem: 'Given heights (in cm): 165, 170, 168, 172, 175, 180, 178, 169, 173, 171, 177, 182, 179, 174, 176. Suggest an appropriate bin width and how many bins you\'d use. (You don\'t need to draw it — just describe the choice.)',
      expectedAnswer: 'Range: 182 − 165 = 17 cm. With bin width 5: bins [165,170), [170,175), [175,180), [180,185) — 4 bins. Bin width 5 cm is reasonable. Bin width 2 (≈9 bins) would also work. Bin width 1 (17 bins, mostly height 1) would be too narrow for n = 15.',
      responseFormat: 'free', hints: ['Range / desired bin count = bin width.'], estimatedMinutes: 3 },
    { id: 'try-display-choice', kind: 'try_yourself',
      problem: 'AP-style synthesis. You have 8 students\' GPAs (2.7, 3.0, 3.4, 2.9, 3.8, 3.2, 3.5, 3.1). Which display preserves all individual values: a dotplot, a histogram, both, or neither? Justify briefly.',
      expectedAnswer: 'A DOTPLOT preserves every individual value (one dot per data point). A HISTOGRAM groups values into bins, losing individual values. So: dotplot only. (For n = 8 a dotplot or even a stemplot would be best; a histogram would have too few values per bin.)',
      responseFormat: 'free', hints: ['Which display has 1 mark per data point?'], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Dotplot, stemplot: keep every value. Histogram: groups into bins, loses individual values.',
      'Histogram bars TOUCH; bar chart bars don\'t.',
      'Bin width controls detail; 5–15 bins typical.',
      'Stemplot needs a KEY.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.5', cedTitle: 'Quantitative Graphs', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard graphs.' }] },
};
