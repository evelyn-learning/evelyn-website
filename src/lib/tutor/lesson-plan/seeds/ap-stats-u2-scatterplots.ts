/**
 * AP Statistics — CED Unit 2.4: Representing the Relationship Between Two
 * Quantitative Variables (scatterplots).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U2_SCATTERPLOTS: LessonPlan = {
  id: 'evelyn.ap.stats.scatterplots.v1', title: 'U2.4 Scatterplots — DUFS Description',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.scatterplots', description: 'Construct and describe scatterplots of two quantitative variables using DUFS: direction, unusual features, form, and strength. Identify explanatory vs. response variables.', standard: 'AP-STATS-2.4' }],
  prerequisites: ['apstats.two-categorical-relationships'], followUps: ['apstats.correlation'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame scatterplots.', script: "Two quantitative variables on the same individuals → SCATTERPLOT. Each individual is one DOT. Then we describe what we see: DUFS — direction, unusual features, form, strength.", estimatedMinutes: 2 },
    { id: 'concept-scatter', kind: 'concept', goal: 'Cover scatterplot conventions and DUFS.',
      keyIdeas: [
        'EXPLANATORY (predictor, x) vs RESPONSE (y) variable: x is what we use to predict y. By convention x goes on horizontal axis.',
        'Each point is one INDIVIDUAL plotted at (x, y).',
        'DUFS — the four things to describe in a scatterplot, ALWAYS in context:',
        '  • DIRECTION: positive (y rises with x), negative (y falls), or no clear direction.',
        '  • UNUSUAL FEATURES: outliers, gaps, clusters, influential points.',
        '  • FORM: linear, curved, or no clear form.',
        '  • STRENGTH: strong (points cluster tightly along the form), moderate, or weak (lots of scatter).',
        'AP RUBRIC: forgetting a piece of DUFS or missing context = lose a point.',
        'COMMON PITFALL: confusing DIRECTION (slope-like) with FORM (shape). A curve can be increasing AND nonlinear.',
      ],
      vocabulary: [
        { term: 'explanatory variable', definition: 'the predictor variable, plotted on the x-axis.' },
        { term: 'response variable', definition: 'the variable being predicted, plotted on the y-axis.' },
      ],
      estimatedMinutes: 4 },
    { id: 'worked-describe', kind: 'worked_example',
      problem: 'A scatterplot shows hours studied (x) vs exam score (y) for 30 students. Points form a roughly linear cloud sloping upward, fairly tightly packed except for one student who studied 8 hours but scored only 50. Most students studied 0-6 hours and scored 50-95. Describe the scatterplot.',
      steps: [
        'STEP 1 — DIRECTION: positive (more study → higher score).',
        'STEP 2 — UNUSUAL FEATURES: one outlier (8 hours, score 50) — unexpectedly low score.',
        'STEP 3 — FORM: linear (roughly straight-line trend).',
        'STEP 4 — STRENGTH: moderately strong (tightly packed apart from the outlier).',
        'STEP 5 — Sentence: "There is a moderately strong, positive, linear relationship between hours studied and exam score. Students who study more tend to score higher. One outlier (8 hours, score 50) does not fit the pattern."',
      ],
      answer: 'Moderately strong, positive, linear; one outlier at (8, 50).', estimatedMinutes: 4 },
    { id: 'try-explan-response', kind: 'try_yourself',
      problem: 'For each pair, identify explanatory and response: (a) hours of sleep vs reaction time, (b) car age vs resale value, (c) parent height vs child height.',
      expectedAnswer: '(a) Hours of sleep is explanatory (predictor); reaction time is response. (b) Car age explanatory; resale value response. (c) Parent height explanatory; child height response (typical setup — though either direction makes sense).',
      responseFormat: 'free', hints: ['Which variable is being used to predict the other?'], estimatedMinutes: 2 },
    { id: 'try-describe', kind: 'try_yourself',
      problem: 'AP-style synthesis. A scatterplot of arm span (x, cm) vs height (y, cm) for 50 people shows points clustered tightly around a straight upward line; no clear outliers; range x: 130-200, y: 130-200. Describe the scatterplot.',
      expectedAnswer: '"There is a strong, positive, linear relationship between arm span and height. People with longer arm spans tend to be taller. There are no apparent outliers, and the points cluster very tightly along the line."',
      responseFormat: 'free', hints: ['Hit all four DUFS pieces in context.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'DUFS: Direction, Unusual features, Form, Strength — in CONTEXT.',
      'Direction: positive/negative/none. Form: linear/curved/none.',
      'Explanatory (x) predicts response (y).',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Scatterplots', sources: [{ type: 'concept', book: 'tps5e', chapter: '3', note: 'Standard DUFS framework.' }] },
};
