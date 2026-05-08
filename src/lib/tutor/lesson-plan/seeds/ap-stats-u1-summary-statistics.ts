/**
 * AP Statistics — CED Unit 1.7+1.8: Summary statistics and graphical
 * representations (boxplot, 5-number summary, 1.5×IQR rule).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_SUMMARY_STATISTICS: LessonPlan = {
  id: 'evelyn.ap.stats.summary-statistics.v1', title: 'U1.7 Summary Statistics and Boxplots',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.summary-statistics', description: 'Compute and interpret mean, median, standard deviation, IQR, range, and the 5-number summary. Identify outliers using the 1.5×IQR rule. Construct boxplots.', standard: 'AP-STATS-1.7-1.8' }],
  prerequisites: ['apstats.distribution-shape'], followUps: ['apstats.comparing-distributions'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame summary statistics as numerical SOCS.', script: "Last time we described distributions in WORDS. Today we put NUMBERS on each piece of SOCS — center (mean, median), spread (SD, IQR, range), and a formal outlier rule.", estimatedMinutes: 2 },
    { id: 'concept-stats', kind: 'concept', goal: 'Cover all summary statistics + boxplot.',
      keyIdeas: [
        'CENTER:',
        '  • MEAN x̄ = Σx_i / n. Sensitive to outliers.',
        '  • MEDIAN: middle value when data is sorted. RESISTANT to outliers.',
        'SPREAD:',
        '  • RANGE = max − min. Very sensitive to outliers (single value). Rarely used as primary spread measure.',
        '  • STANDARD DEVIATION (SD): s = √(Σ(x_i − x̄)² / (n − 1)). Average distance of each value from the mean. Sensitive to outliers.',
        '  • IQR = Q3 − Q1. Range of MIDDLE 50%. Resistant to outliers.',
        'QUARTILES: Q1 = median of lower half (excluding overall median if odd n), Q2 = overall median, Q3 = median of upper half. (Convention: TPS uses "exclusive median" — exclude the median when splitting odd-n data.)',
        '5-NUMBER SUMMARY: min, Q1, median, Q3, max. Powers the boxplot.',
        'OUTLIER RULE (1.5×IQR): a value is an OUTLIER if it is BELOW Q1 − 1.5·IQR or ABOVE Q3 + 1.5·IQR.',
        'BOXPLOT: box from Q1 to Q3 with a line at the median. Whiskers extend to the smallest and largest values that are NOT outliers. Outliers shown as separate dots.',
        'IF SKEWED → use MEDIAN + IQR. IF SYMMETRIC and no outliers → use MEAN + SD.',
      ],
      vocabulary: [
        { term: 'IQR', definition: 'Q3 − Q1, the range of the middle 50%.' },
        { term: 'standard deviation', definition: 's = √(Σ(x_i − x̄)² / (n−1)) — typical distance from the mean.' },
        { term: 'resistant', definition: 'a statistic is resistant if outliers do NOT change it much.' },
      ],
      estimatedMinutes: 6 },
    { id: 'worked-fivenum', kind: 'worked_example',
      problem: 'Find the 5-number summary, IQR, and any outliers for: 42, 47, 50, 52, 55, 58, 60, 65, 71, 88.',
      steps: [
        'STEP 1 — Sort (already sorted). n = 10.',
        'STEP 2 — Median = average of 5th and 6th values = (55 + 58)/2 = 56.5.',
        'STEP 3 — Lower half (first 5): 42, 47, 50, 52, 55. Q1 = 50.',
        'STEP 4 — Upper half (last 5): 58, 60, 65, 71, 88. Q3 = 65.',
        'STEP 5 — IQR = 65 − 50 = 15. Range = 88 − 42 = 46.',
        'STEP 6 — 5-number summary: min = 42, Q1 = 50, median = 56.5, Q3 = 65, max = 88.',
        'STEP 7 — Outlier check: lower fence = Q1 − 1.5(15) = 50 − 22.5 = 27.5. Upper fence = Q3 + 1.5(15) = 65 + 22.5 = 87.5. Any value outside [27.5, 87.5] is an outlier. 88 > 87.5 → 88 IS an outlier (just barely). All others fall within.',
      ],
      answer: '5-num summary (42, 50, 56.5, 65, 88). IQR = 15. Outlier: 88.', estimatedMinutes: 6 },
    { id: 'try-mean-sd', kind: 'try_yourself',
      problem: 'Compute the mean and standard deviation of: 4, 6, 8, 10, 12.',
      expectedAnswer: 'Mean = (4+6+8+10+12)/5 = 40/5 = 8. Deviations: -4, -2, 0, 2, 4. Squared deviations: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/(5−1) = 10. SD = √10 ≈ 3.162.',
      responseFormat: 'numeric', hints: ['SD uses (n−1) in the denominator (sample SD).'], estimatedMinutes: 4 },
    { id: 'try-resistant', kind: 'try_yourself',
      problem: 'A dataset is 10, 12, 14, 16, 18. Compute mean, median. Now replace 18 with 100 (outlier). Recompute mean and median. Which changed more?',
      expectedAnswer: 'Original: mean = 14, median = 14. After change: mean = (10+12+14+16+100)/5 = 152/5 = 30.4, median = 14 (still the middle value). MEAN changed by 16.4; MEDIAN unchanged. Median is RESISTANT to outliers; mean is not.',
      responseFormat: 'numeric', hints: ['Compute both before and after; compare change.'], estimatedMinutes: 3 },
    { id: 'try-synthesis', kind: 'try_yourself',
      problem: 'AP-style synthesis. The boxplot of one variable shows: min = 30, Q1 = 45, median = 60, Q3 = 75, max = 95, with a dot at 105. (a) Is 105 an outlier? (b) Compute IQR. (c) Where would whiskers end?',
      expectedAnswer: '(a) IQR = 75 − 45 = 30. Upper fence = 75 + 1.5(30) = 75 + 45 = 120. 105 < 120 → 105 is NOT an outlier; it shouldn\'t be plotted as a dot. The boxplot description is inconsistent. \n(Alternative interpretation: if 105 IS the max and shown as a dot, it would mean the 1.5×IQR rule applies and 105 IS an outlier. But the rule gives 120 as the cutoff, so 105 doesn\'t qualify.) \n(b) IQR = 30. (c) Whiskers extend to the smallest and largest non-outliers — to 30 (min) and 95 (max as stated).',
      responseFormat: 'frq', hints: ['Apply the 1.5×IQR rule to check outlier status.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Mean + SD: pair them. Median + IQR: pair them.',
      '5-num summary: min, Q1, median, Q3, max.',
      'Outlier rule: outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR].',
      'Median + IQR are RESISTANT; mean + SD are not.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1.7-1.8', cedTitle: 'Summary Statistics and Boxplots', sources: [{ type: 'concept', book: 'tps5e', chapter: '1', note: 'Standard 5-number / boxplot.' }] },
};
