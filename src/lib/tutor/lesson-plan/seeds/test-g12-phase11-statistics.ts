/**
 * TEST PLAN — G12 AP Statistics — Phase 11 stress test.
 *
 * Exercises all 3 Phase 11 statistics kinds:
 *   1. histogram               (frequency distribution with mean/median lines)
 *   2. normal_curve            (standard normal with shaded P(-1 ≤ Z ≤ 1))
 *   3. scatterplot_regression  (LSRL + r + residuals)
 *
 * Uses abstract phrasing in try-yourself.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G12_PHASE11_STATISTICS: LessonPlan = {
  id: 'evelyn.test.g12.statistics.phase11.v1',
  title: '[TEST] G12 AP Statistics — Phase 11 stress test',
  curriculum: 'AP Statistics',
  grade: '9-12',
  subject: 'math',
  topic: 'statistics',
  locale: 'en',
  los: [
    {
      id: 'test.phase11.statistics-coverage',
      description: 'Exercise all 3 Phase 11 statistics kinds with scribble + handwrite markings.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind stats test session.',
      script: "We're touring three AP Stats visualization tools today. Ready?",
      estimatedMinutes: 1,
    },

    // ── 1. histogram ──────────────────────────────────────────────
    {
      id: 'concept-histogram',
      kind: 'concept',
      goal: 'Render histogram + scribble on mean + handwrite.',
      teacherNote:
        '1. show_diagram with type="histogram" and params:\n' +
        '   { bins: [[0,10,2],[10,20,5],[20,30,12],[30,40,18],[40,50,8],[50,60,3]],\n' +
        '     mean: 33,\n' +
        '     median: 30,\n' +
        '     xLabel: "Exam Score",\n' +
        '     title: "Histogram of Exam Scores (n=48)" }\n\n' +
        '2. tutor_scribble { target: "mean", color: "#dc2626", label: "x̄ = 33" }\n' +
        '3. tutor_handwrite { text: "Right-skewed distribution: mean > median (33 > 30) — tail pulls mean right." }\n' +
        '4. Briefly explain the mean-vs-median direction-of-skew rule, then advance.',
      keyIdeas: ['For right-skewed distributions, mean > median.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. normal_curve ───────────────────────────────────────────
    {
      id: 'concept-normal-curve',
      kind: 'concept',
      goal: 'Render normal_curve + scribble on shaded region + handwrite.',
      teacherNote:
        '1. show_diagram with type="normal_curve" and params:\n' +
        '   { mean: 0, sd: 1,\n' +
        '     shadeRegion: { from: -1, to: 1 },\n' +
        '     markValues: [[-1, "−1σ"], [1, "+1σ"]],\n' +
        '     showSDLines: true,\n' +
        '     shadeArea: 0.6827,\n' +
        '     xLabel: "Z",\n' +
        '     title: "Standard Normal — Empirical Rule (68%)" }\n\n' +
        '2. tutor_scribble { target: "shaded region", color: "#dc2626", label: "≈ 68%" }\n' +
        '3. tutor_handwrite { text: "Empirical rule: ~68% within ±1σ, ~95% within ±2σ, ~99.7% within ±3σ." }\n' +
        '4. Briefly explain the 68-95-99.7 rule, then advance.',
      keyIdeas: ['Empirical rule: 68-95-99.7 within ±1σ, ±2σ, ±3σ.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. scatterplot_regression ─────────────────────────────────
    {
      id: 'concept-scatter-regression',
      kind: 'concept',
      goal: 'Render scatterplot_regression + scribble on LSRL + handwrite.',
      teacherNote:
        '1. show_diagram with type="scatterplot_regression" and params:\n' +
        '   { points: [[1,2.1],[2,3.8],[3,5.2],[4,7.1],[5,8.5],[6,10.3],[7,11.8],[8,13.2],[9,14.7],[10,16.1]],\n' +
        '     regression: { slope: 1.55, intercept: 0.65 },\n' +
        '     equationLabel: "ŷ = 0.65 + 1.55x",\n' +
        '     rValue: 0.998,\n' +
        '     rSquared: 0.996,\n' +
        '     showResiduals: true,\n' +
        '     xLabel: "Study hours",\n' +
        '     yLabel: "Score",\n' +
        '     title: "Study Hours vs Exam Score" }\n\n' +
        '2. tutor_scribble { target: "LSRL", color: "#16a34a", label: "best fit line" }\n' +
        '3. tutor_handwrite { text: "r² = 0.996 means 99.6% of score variance is explained by study hours." }\n' +
        '4. Briefly explain r vs r² and interpretation, then advance.',
      keyIdeas: ['r² is the fraction of variance in y explained by the LSRL.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ──────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      problem: 'On a right-skewed distribution, which is larger: the mean or the median?',
      expectedAnswer: 'mean',
      hints: [
        'The "tail" pulls the mean toward the extreme values.',
        'A right-skewed distribution has its tail on the high end.',
      ],
      responseFormat: 'free',
      // Brain should render a fresh right-skewed histogram with both mean
      // and median lines whenever it explains this answer — pure verbal
      // correction lacks the visual cue the rule depends on.
      teacherNote:
        'When explaining the answer (correct or incorrect), emit ONE show_diagram with type="histogram" using a clear right-skewed distribution, e.g.:\n' +
        '   { bins: [[0,10,2],[10,20,4],[20,30,15],[30,40,10],[40,50,5],[50,60,2]],\n' +
        '     mean: 28, median: 25,\n' +
        '     xLabel: "Score",\n' +
        '     title: "Right-skewed example" }\n\n' +
        'Then scribble target="mean" and target="median" to highlight the position of each line. This grounds the verbal rule (mean > median for right-skewed) in the visual.',
      estimatedMinutes: 1,
    },

    // ── recap ─────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Right-skewed: mean > median. Left-skewed: mean < median.',
        'Empirical rule: 68%-95%-99.7% within ±1σ, ±2σ, ±3σ.',
        'r² = fraction of y-variance explained by the LSRL.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose: 'Test seed for Phase 11 (statistics). All 3 kinds × one scribble + one handwrite per concept.',
  },
};
