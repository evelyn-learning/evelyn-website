/**
 * AP Statistics — CED Unit 2.5: Correlation.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_CORRELATION: LessonPlan = {
  id: 'evelyn.ap.stats.correlation.v1', title: 'U2.5 Correlation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.correlation', description: 'Compute and interpret the correlation coefficient r. Recognize properties: bounds, unit-free, sensitive to outliers, measures only LINEAR association.', standard: 'AP-STATS-2.5' }],
  prerequisites: ['apstats.scatterplots'], followUps: ['apstats.linear-regression'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame correlation as a number for strength.', script: "DUFS gives us \"strong / moderate / weak\" in words. Correlation r turns that into a NUMBER between -1 and +1. But r has limits — and AP loves to test what r CAN'T detect.", estimatedMinutes: 2 },
    { id: 'concept-correlation', kind: 'concept', goal: 'Cover r and its properties.',
      keyIdeas: [
        'CORRELATION COEFFICIENT r measures the STRENGTH and DIRECTION of LINEAR association between two quantitative variables.',
        'FORMULA: r = (1/(n-1)) Σ ((x_i − x̄)/s_x) ((y_i − ȳ)/s_y) — average product of standardized values.',
        'BOUNDS: -1 ≤ r ≤ +1.',
        '  • r = +1: perfect positive linear (all points on an increasing line).',
        '  • r = -1: perfect negative linear.',
        '  • r = 0: no linear association (could still have NONLINEAR association!).',
        'INTERPRETING:',
        '  • |r| > 0.8: strong linear.',
        '  • 0.5 < |r| ≤ 0.8: moderate.',
        '  • |r| ≤ 0.5: weak.',
        'PROPERTIES:',
        '  • UNIT-FREE: r is the same whether x is in inches or cm.',
        '  • SYMMETRIC: r(x, y) = r(y, x).',
        '  • SENSITIVE TO OUTLIERS — a single outlier can dramatically change r.',
        '  • ONLY LINEAR — r ≈ 0 for a perfect parabola or other strong nonlinear pattern.',
        '  • CORRELATION ≠ CAUSATION — high r is consistent with either causation or lurking variables.',
        'AP CALCULATOR: LinReg(a+bx) on the calculator gives r along with regression equation.',
      ],
      vocabulary: [
        { term: 'correlation coefficient', definition: 'r — measure of linear association strength and direction; -1 ≤ r ≤ +1.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-interpret', kind: 'worked_example',
      problem: 'A scatterplot of study hours vs exam score shows r = 0.85. Interpret r in context.',
      steps: [
        'STEP 1 — Sign: positive (more study, higher score).',
        'STEP 2 — Magnitude: 0.85 > 0.8 → STRONG.',
        'STEP 3 — Form claim: only valid for LINEAR association. r = 0.85 indicates strong linear association.',
        'STEP 4 — Sentence: "There is a strong positive linear association between hours studied and exam score (r = 0.85). Students who study more hours tend to score higher."',
      ],
      answer: 'Strong positive linear association.', estimatedMinutes: 3 },
    { id: 'try-r-meaning', kind: 'try_yourself',
      problem: 'For each scenario, give the most likely value of r. Choose from: -0.95, -0.5, 0, 0.5, 0.95. \n(a) Perfect negative linear pattern. \n(b) A scatterplot showing a clear U-shape (parabola). \n(c) A weak positive trend with lots of scatter. \n(d) Random cloud, no pattern.',
      expectedAnswer: '(a) -0.95 (closest to -1; truly perfect would be -1). (b) ≈0 — even though the variables are strongly related, the relationship is not LINEAR. r misses it. (c) 0.5 — weak positive. (d) ≈0.',
      responseFormat: 'free', hints: ['r captures linear only; magnitude reflects scatter.'], estimatedMinutes: 3 },
    { id: 'try-properties', kind: 'try_yourself',
      problem: 'AP-style synthesis. A scatterplot of arm span vs height has r = 0.92. (a) State an interpretation in context. (b) Suppose we convert all heights from inches to cm (multiply by 2.54). What happens to r? (c) Suppose we add a point at arm span 50 cm, height 200 cm (clear outlier). What happens to r?',
      expectedAnswer: '(a) "Strong positive linear association between arm span and height; people with longer arm spans tend to be taller (r = 0.92)." (1.5)\n(b) r is UNIT-FREE — converting inches to cm DOES NOT CHANGE r. Still 0.92. (1.5)\n(c) r is SENSITIVE to outliers. The new outlier (low arm span, very high height) goes against the positive trend, so r will DECREASE (could drop substantially, depending on n). (2)\nTotal: 5 points.',
      responseFormat: 'frq', hints: ['Recall: unit-free, sensitive to outliers.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'r measures LINEAR association only. -1 ≤ r ≤ 1.',
      'r is unit-free, symmetric, but SENSITIVE to outliers.',
      'r ≈ 0 doesn\'t mean no relationship — could be nonlinear.',
      'Correlation ≠ causation.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2.5', cedTitle: 'Correlation', sources: [{ type: 'concept', book: 'tps5e', chapter: '3', note: 'Standard r and properties.' }] },
};
