/**
 * AP Statistics — CED Unit 1.6: Describing the Distribution of a
 * Quantitative Variable (SOCS framework).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_DISTRIBUTION_SHAPE: LessonPlan = {
  id: 'evelyn.ap.stats.distribution-shape.v1', title: 'U1.6 Describing a Distribution (SOCS)',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.distribution-shape', description: 'Describe the distribution of a quantitative variable using shape, outliers, center, and spread (SOCS).', standard: 'AP-STATS-1.6' }],
  prerequisites: ['apstats.quantitative-graphs'], followUps: ['apstats.summary-statistics'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame SOCS as the standard description.', script: "When AP graders ask you to DESCRIBE a distribution, they're looking for four things every time — shape, outliers, center, spread. Mnemonic: SOCS. Always in CONTEXT of the data.", estimatedMinutes: 2 },
    { id: 'concept-socs', kind: 'concept', goal: 'Cover SOCS framework.',
      keyIdeas: [
        'SOCS = SHAPE, OUTLIERS, CENTER, SPREAD. ALWAYS describe in CONTEXT (refer to the variable and units).',
        'SHAPE descriptors:',
        '  • SYMMETRIC: left and right halves are mirror images.',
        '  • SKEWED RIGHT (positive skew): long tail to the RIGHT; mean > median.',
        '  • SKEWED LEFT (negative skew): long tail to the LEFT; mean < median.',
        '  • UNIFORM: roughly equal frequency across.',
        '  • UNIMODAL (one peak), BIMODAL (two peaks), MULTIMODAL.',
        'OUTLIERS: values that fall FAR from the rest of the data. We\'ll formalize the 1.5×IQR rule next lesson; informally, "obviously separated" values count.',
        'CENTER: a typical value. Use MEDIAN if skewed/outliers; use MEAN if symmetric and no outliers.',
        'SPREAD: how far values vary. Use IQR if skewed; use STANDARD DEVIATION if symmetric.',
        'KEY: skew DRAGS the mean. Mean > Median ⇒ right skew. Mean < Median ⇒ left skew. Mean ≈ Median ⇒ symmetric.',
        'AP RUBRIC TIP: if you say "skewed left/right" without justification, lose a point. If you forget context (units, variable), lose a point.',
      ],
      vocabulary: [
        { term: 'skewed right', definition: 'long tail extends to the right; few large values pull the mean up.' },
        { term: 'outlier', definition: 'a value far from the rest of the data; formal rule: more than 1.5×IQR beyond Q1 or Q3.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-describe', kind: 'worked_example',
      problem: 'A histogram of household income (in $1000s) for a city has bars rising sharply through $20-50k, peaking at $40-50k, then a long tail extending out past $200k. Describe the distribution.',
      steps: [
        'STEP 1 — SHAPE: skewed RIGHT (long right tail of high incomes).',
        'STEP 2 — OUTLIERS: the values past $200k look like potential outliers (formally check with 1.5×IQR rule).',
        'STEP 3 — CENTER: because the distribution is skewed, use MEDIAN. Looks roughly $40-50k from the histogram peak.',
        'STEP 4 — SPREAD: because skewed, use IQR. Visually estimate: Q1 around $25k, Q3 around $80k → IQR ≈ $55k.',
        'STEP 5 — Sentence: "Household income in this city is right-skewed (long upper tail of high incomes), with a median near $45k and an IQR of about $55k. There appear to be a few outliers at the high end past $200k."',
      ],
      answer: 'Right-skewed distribution; median ~$45k; IQR ~$55k; potential high outliers past $200k.', estimatedMinutes: 4 },
    { id: 'try-skew', kind: 'try_yourself',
      problem: 'A dataset has mean 72 and median 68. Without seeing the data, what shape do you expect?',
      expectedAnswer: 'Mean (72) > Median (68) — right-skewed. The right tail pulls the mean above the median.',
      responseFormat: 'free', hints: ['Mean vs. median tells you direction of skew.'], estimatedMinutes: 2 },
    { id: 'try-describe', kind: 'try_yourself',
      problem: 'AP-style synthesis. A dotplot shows 24 students\' bedtimes (clock times of going to sleep). Most fall between 10:30 PM and midnight, peaking at 11:00 PM. Three values are at 1:30 AM. Describe the distribution in a SOCS sentence.',
      expectedAnswer: '"The distribution of bedtimes is roughly unimodal with center near 11:00 PM and right skew (later times). Most students go to sleep between 10:30 PM and midnight (range about 90 minutes) but three appear to be late outliers near 1:30 AM."',
      responseFormat: 'free', hints: ['Hit S, O, C, S in your sentence. Stay in context (bedtime/time).'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'SOCS: Shape, Outliers, Center, Spread — always in CONTEXT.',
      'Skew DRAGS the mean: mean > median = right skew, mean < median = left skew.',
      'Use MEDIAN + IQR if skewed; use MEAN + SD if roughly symmetric.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.6', cedTitle: 'Distribution Shape (SOCS)', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard SOCS framework.' }] },
};
