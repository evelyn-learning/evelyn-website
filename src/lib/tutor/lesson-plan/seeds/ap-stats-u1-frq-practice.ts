/**
 * AP Statistics — Unit 1 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_STATS_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.stats.u1-frq-practice.v1', title: 'U1 FRQ Practice',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-statistics', locale: 'en',
  los: [{ id: 'apstats.u1-frq-practice', description: 'Apply Unit 1 descriptive-statistics techniques in AP-style FRQs.', standard: 'AP-STATS-1-FRQ' }],
  prerequisites: ['apstats.normal-distribution'], followUps: [], estimatedMinutes: 28,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Three Unit 1 FRQs: comparison, normal calculation, summary-statistics interpretation. AP graders look for context, comparative language, and proper conclusions.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'SOCS in context. Use comparative words.',
      'z = (x − μ)/σ. P(X ≤ x) via z-table or normalcdf.',
      'Median + IQR for skewed; mean + SD for symmetric.',
      'Outlier rule: 1.5×IQR beyond Q1/Q3.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-compare', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Comparison. Two parallel boxplots show daily caffeine intake (mg) for adults aged 20-30 (Group A) and adults aged 50-60 (Group B). Group A: min=10, Q1=80, median=120, Q3=180, max=300, no outliers. Group B: min=0, Q1=60, median=100, Q3=140, max=400, outliers at 350 and 400. (a) Compare the two distributions in a SOCS sentence. (b) Which group\'s description should rely on median + IQR rather than mean + SD? Justify.',
      expectedAnswer: '(a) "Daily caffeine intake tends to be HIGHER among adults aged 20-30 (median 120 mg vs 100 mg) and MORE consistent (IQR 100 vs 80 mg). Group B has two HIGH outliers (350, 400 mg) while Group A has none. Both distributions are roughly symmetric in the box-and-whisker shape, but Group B\'s long upper tail (max 400) suggests right skew." (3.5 pts)\n(b) GROUP B should use median + IQR because of the high outliers. Mean and SD would be PULLED UP by the outliers and misrepresent typical intake. Group A\'s data has no outliers and could safely use either mean+SD or median+IQR. (2 pts)\nTotal: 5.5 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3.5, scoringCriteria: 'Comparative SOCS sentence in context: correctly compares shape, outlier status, center (median), and spread (IQR) between the two groups using explicit comparative language (higher/lower, more/less).', modelResponse: 'Daily caffeine intake tends to be HIGHER among adults aged 20-30 (median 120 mg vs 100 mg) and MORE consistent (IQR 100 vs 80 mg). Group B has two HIGH outliers (350, 400 mg) while Group A has none. Both distributions are roughly symmetric in the box-and-whisker shape, but Group B\'s long upper tail (max 400) suggests right skew.' },
          { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Identifies Group B as needing median + IQR due to its outliers, with justification that mean/SD would be distorted (pulled up) by the outliers; may note Group A could safely use either measure.', modelResponse: 'GROUP B should use median + IQR because of the high outliers. Mean and SD would be PULLED UP by the outliers and misrepresent typical intake. Group A\'s data has no outliers and could safely use either mean+SD or median+IQR.' },
        ],
      },
      responseFormat: 'frq', hints: ['Use comparative language; SOCS framework.'], estimatedMinutes: 6 },
    { id: 'try-frq-normal', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Normal Distribution. Cholesterol levels in a population are approximately N(200, 25) mg/dL. (a) What proportion of the population has cholesterol above 250? (b) What range of cholesterol values defines the middle 95% of the population? (c) A doctor flags any patient whose cholesterol is in the top 5%. What cutoff cholesterol value should the doctor use?',
      expectedAnswer: '(a) z = (250 − 200)/25 = 2. P(Z > 2) = 1 − 0.9772 ≈ 0.0228, or 2.28%. (1.5 pts)\n(b) By empirical rule, middle 95% = within 2 SDs of mean = 200 ± 2(25) = [150, 250]. (1.5 pts)\n(c) Want P(X > x) = 0.05, so P(X ≤ x) = 0.95. Find z such that P(Z ≤ z) = 0.95: z ≈ 1.645 (from invNorm). x = 200 + 1.645(25) = 200 + 41.125 ≈ 241.1 mg/dL. Doctor flags cholesterol above 241 mg/dL. (3 pts)\nTotal: 6 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 1.5, scoringCriteria: 'Correct z-score (z = 2) and correct upper-tail probability (≈0.0228 or 2.28%).', modelResponse: 'z = (250 − 200)/25 = 2. P(Z > 2) = 1 − 0.9772 ≈ 0.0228, or 2.28%.' },
          { criterionId: 'b', maxPoints: 1.5, scoringCriteria: 'Correctly applies the empirical rule (mean ± 2 SD) to give the middle-95% interval [150, 250].', modelResponse: 'By empirical rule, middle 95% = within 2 SDs of mean = 200 ± 2(25) = [150, 250].' },
          { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Correctly sets up P(X ≤ x) = 0.95, finds z ≈ 1.645 via invNorm, and solves for the cutoff x ≈ 241.1 mg/dL.', modelResponse: 'Want P(X > x) = 0.05, so P(X ≤ x) = 0.95. Find z such that P(Z ≤ z) = 0.95: z ≈ 1.645 (from invNorm). x = 200 + 1.645(25) = 200 + 41.125 ≈ 241.1 mg/dL. Doctor flags cholesterol above 241 mg/dL.' },
        ],
      },
      responseFormat: 'frq', hints: ['(a) z-score then upper tail. (b) Empirical rule. (c) invNorm.'], estimatedMinutes: 6 },
    { id: 'try-frq-summary', kind: 'try_yourself',
      problem: 'FRQ Practice 3 — Summary Statistics. A teacher records 10 students\' study hours: 1, 2, 2, 3, 3, 4, 5, 5, 8, 17. (a) Compute the median and IQR. (b) Apply the 1.5×IQR rule: are there any outliers? (c) The teacher computes mean = 5.0. Is the mean a good measure of center here? Justify.',
      expectedAnswer: '(a) Sorted: 1, 2, 2, 3, 3, 4, 5, 5, 8, 17. n = 10. Median = (4+3)/2 = wait — order indices 1-10: 1,2,2,3,3,4,5,5,8,17. Position 5 = 3, position 6 = 4. Median = (3+4)/2 = 3.5. Lower half (5 values): 1, 2, 2, 3, 3. Q1 = 2. Upper half: 4, 5, 5, 8, 17. Q3 = 5. IQR = 5 − 2 = 3. (3 pts)\n(b) Lower fence = 2 − 1.5(3) = -2.5. Upper fence = 5 + 1.5(3) = 9.5. 17 > 9.5 → 17 IS an outlier. No others. (2 pts)\n(c) NO — the mean (5.0) is NOT a good measure of center. The dataset has an outlier (17) that pulls the mean up. The MEDIAN (3.5) is more representative of typical study hours. The mean overestimates a typical student\'s study time. (2 pts)\nTotal: 7 points.',
      rubric: {
        parts: [
          { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Correctly sorts the data and finds median = 3.5, Q1 = 2, Q3 = 5, and IQR = 3.', modelResponse: 'Sorted: 1, 2, 2, 3, 3, 4, 5, 5, 8, 17. n = 10. Position 5 = 3, position 6 = 4, so median = (3+4)/2 = 3.5. Lower half (5 values): 1, 2, 2, 3, 3 → Q1 = 2. Upper half: 4, 5, 5, 8, 17 → Q3 = 5. IQR = Q3 − Q1 = 5 − 2 = 3.' },
          { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Computes correct fences (lower = -2.5, upper = 9.5) using the 1.5×IQR rule and correctly identifies 17 as the only outlier.', modelResponse: 'Lower fence = 2 − 1.5(3) = -2.5. Upper fence = 5 + 1.5(3) = 9.5. 17 > 9.5 → 17 IS an outlier. No others.' },
          { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Concludes the mean is NOT a good measure of center, with justification that the outlier (17) inflates it and that the median (3.5) better represents typical study hours.', modelResponse: 'NO — the mean (5.0) is NOT a good measure of center. The dataset has an outlier (17) that pulls the mean up. The MEDIAN (3.5) is more representative of typical study hours. The mean overestimates a typical student\'s study time.' },
        ],
      },
      responseFormat: 'frq', hints: ['Sort first; apply 1.5×IQR rule; reason about outlier impact on mean.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Comparison FRQs: use comparative language; full SOCS in context.',
      'Normal probability: z-score → table/normalcdf.',
      'Outlier rule + when mean is misleading.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '1', cedTopic: '1-FRQ', cedTitle: 'Unit 1 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Stats Unit-1 FRQs.' }] },
};
