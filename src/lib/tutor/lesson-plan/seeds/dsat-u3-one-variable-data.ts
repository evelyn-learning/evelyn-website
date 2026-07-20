/**
 * Digital SAT — Math / Problem-Solving and Data Analysis: One-Variable
 * Data — Center, Spread & Boxplots.
 *
 * Recurring PSDA skill: five-number summaries, IQR, mean-vs-median
 * behavior with outliers/skew, and reading boxplots. The digital test's
 * signature trap is treating a boxplot's whisker length or box width as
 * a proxy for how MUCH data is there — every section of a boxplot holds
 * exactly 25% of the data by construction, regardless of how wide it's
 * drawn. Desmos is allowed on every math question, though most of this
 * skill is definitional reasoning rather than heavy computation.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_ONE_VARIABLE_DATA: LessonPlan = {
  id: 'evelyn.testprep.dsat.one-variable-data.v1',
  title: 'One-Variable Data: Center, Spread & Boxplots',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.one-variable-data',
      standard: 'DSAT-3.3',
      description:
        'Compute and interpret measures of center (mean, median) and spread (range, IQR, standard deviation) for one-variable data sets, including constructing and reading boxplots from a five-number summary.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame one-variable data as a recurring, high-leverage Problem-Solving and Data Analysis pattern — mostly definitional, not computational.',
      script:
        'Problem-Solving and Data Analysis is about 15 percent of SAT Math, and one-variable data questions — center, spread, boxplots — show up on nearly every test. The good news: almost none of it is heavy arithmetic. It is knowing exactly what a boxplot represents and when mean beats median (or the reverse). Get the definitions locked in and these become free points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-center-spread',
      kind: 'concept',
      goal: 'Five-number summaries, IQR, the boxplot-density trap, mean-vs-median behavior, skew, and comparing two distributions.',
      keyIdeas: [
        'FIVE-NUMBER SUMMARY — min, Q1 (first quartile), median, Q3 (third quartile), max. A boxplot IS this summary drawn as a picture: a box from Q1 to Q3 with a line at the median, and whiskers extending out to min and max.',
        'FINDING QUARTILES — sort the data. The median splits it in half. Q1 = the median of the LOWER half; Q3 = the median of the UPPER half. With an odd count, exclude the middle value from both halves before splitting.',
        'IQR (interquartile range) = Q3 − Q1 = the spread of the MIDDLE 50% of the data. A larger IQR means the middle of the distribution is more spread out.',
        'TRAP — BOXPLOT SECTIONS ARE EQUAL-COUNT, NOT EQUAL-DENSITY. Each of the four sections (below Q1, Q1-to-median, median-to-Q3, above Q3) holds exactly 25% of the data, no matter how wide or narrow it looks. A long whisker means that quarter is SPREAD OUT, not that it contains more points — a short section means that quarter is tightly CLUSTERED.',
        'MEAN VS MEDIAN — mean = sum ÷ count, and it gets pulled toward outliers and skew. Median = the middle value, and it is resistant to outliers. On a skewed or outlier-heavy data set, median (with IQR) describes it better than mean (with standard deviation).',
        'SKEW — right-skewed (long right tail): mean > median. Left-skewed (long left tail): mean < median. Roughly symmetric: mean ≈ median.',
        'STANDARD DEVIATION — a measure of typical distance from the mean. The SAT almost always tests it qualitatively ("which data set has the greater standard deviation?") rather than by formula: more spread out = larger SD, more tightly clustered = smaller SD.',
        'COMPARING TWO DISTRIBUTIONS — when two boxplots (or dot plots) are shown side by side, compare CENTER (medians or means) and SPREAD (IQR or range) SEPARATELY. A higher median does not imply a smaller spread, and vice versa.',
      ],
      vocabulary: [
        { term: 'interquartile range (IQR)', definition: 'Q3 minus Q1 — the range spanned by the middle 50% of the data.' },
        { term: 'five-number summary', definition: 'min, Q1, median, Q3, max — the five values a boxplot displays.' },
        { term: 'outlier', definition: 'a value far from the rest of the data; pulls the mean but not the median.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-five-number-summary',
      kind: 'worked_example',
      problem:
        'A set of 11 daily high temperatures (°F), sorted: 10, 14, 18, 20, 24, 27, 30, 33, 36, 40, 45. Find the five-number summary and the IQR.',
      steps: [
        'n = 11, so the median is the 6th value: 27.',
        'Lower half (values before the median): 10, 14, 18, 20, 24 — its median is the 3rd value, Q1 = 18.',
        'Upper half (values after the median): 30, 33, 36, 40, 45 — its median is the 3rd value, Q3 = 36.',
        'Five-number summary: min = 10, Q1 = 18, median = 27, Q3 = 36, max = 45.',
        'IQR = Q3 − Q1 = 36 − 18 = 18.',
      ],
      answer: 'Five-number summary: 10, 18, 27, 36, 45; IQR = 18',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-boxplot-density-trap',
      kind: 'worked_example',
      problem:
        'A boxplot has five-number summary: min = 12, Q1 = 20, median = 25, Q3 = 32, max = 48. Approximately what percentage of the data values lie between 20 and 32?',
      steps: [
        'The interval from 20 to 32 is exactly Q1 to Q3 — the box itself.',
        'By definition, each of a boxplot’s four sections (below Q1, Q1-to-median, median-to-Q3, above Q3) contains exactly 25% of the data, regardless of how wide or narrow it is drawn.',
        'The box combines two of those sections (Q1-to-median and median-to-Q3): 25% + 25% = 50%.',
        'So exactly 50% of the values lie between 20 and 32 — even though the whisker from 32 to 48 looks "wider," it holds the SAME 25% as the narrow section from 25 to 32. Width shows spread, not headcount.',
      ],
      answer: '50%',
      estimatedMinutes: 3,
    },
    {
      id: 'try-iqr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): the number of books read by 9 students over summer break, sorted: 3, 6, 9, 9, 12, 15, 18, 21, 24. What is the interquartile range (IQR) of this data set?',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'n = 9, so the median (5th value, 12) is excluded from both halves before finding Q1 and Q3.',
        'Lower half: 3, 6, 9, 9 → Q1 = average of the two middle values = 7.5. Upper half: 15, 18, 21, 24 → Q3 = 19.5. IQR = Q3 − Q1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mean-median-outlier',
      kind: 'try_yourself',
      problem:
        'Six home sale prices in a neighborhood (in thousands of dollars): 210, 225, 230, 240, 245, 950. Which statement about this data set is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mean ($350K) better represents a typical price because it uses every value in the data set.' },
        { id: 'b', text: "The median ($235K) better represents a typical price because it isn't pulled up by the $950K outlier.", correct: true },
        { id: 'c', text: 'The mean and median are equal, so either one works equally well.' },
        { id: 'd', text: 'The mode is the best measure of center for this data set.' },
      ],
      expectedAnswer: "The median ($235K) better represents a typical price because it isn't pulled up by the $950K outlier.",
      hints: [
        'Compute both: mean = sum ÷ 6; median = average of the 3rd and 4th sorted values.',
        'Mean = 2100 ÷ 6 = $350K. Median = (230 + 240) ÷ 2 = $235K. One of these is dragged far above where 5 of the 6 prices actually cluster.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-boxplot-compare',
      kind: 'try_yourself',
      problem:
        'Boxplots for Class A and Class B test scores show the same median, but Class A’s box (Q1 to Q3) is much narrower than Class B’s. What does this tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Class A has less variability in the middle 50% of its scores than Class B.", correct: true },
        { id: 'b', text: 'Class A has a lower average score than Class B.' },
        { id: 'c', text: 'Class A has more students than Class B.' },
        { id: 'd', text: "Class A's data has a larger range than Class B's." },
      ],
      expectedAnswer: 'Class A has less variability in the middle 50% of its scores than Class B.',
      hints: [
        'A narrower box means a smaller IQR — not more or fewer data points, and not a different median.',
        'Box width measures spread of the middle 50%, not headcount and not the range (which depends on the whiskers, not given here).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-whisker-density',
      kind: 'misconception_check',
      question:
        'A boxplot shows a very long right whisker but a narrow box. A student says this means most of the data values are spread out near the top of the range. What’s wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Most of the data is concentrated near the top because the whisker there is long.',
          misconception: 'Treating whisker/section length as proportional to the number of data points it contains.',
          correctsTo:
            'A boxplot splits the data into four EQUAL-COUNT sections (25% each), regardless of how far apart the values in each section are. A long whisker means that quarter of the data is spread over a WIDE range of values — not that it contains MORE points. A narrow box means the middle 50% of values are clustered close together. Length shows spread (sparse vs. dense), never headcount.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five-number summary: min, Q1, median, Q3, max — a boxplot is just this drawn as a box (Q1 to Q3) with whiskers to min and max.',
        'IQR = Q3 − Q1 = spread of the middle 50%. Every boxplot section holds 25% of the data no matter how wide or narrow it’s drawn — length shows spread, not headcount.',
        'Median is resistant to outliers; mean is not. Use median + IQR for skewed/outlier-heavy data, mean + SD for roughly symmetric data.',
        'Comparing two boxplots: compare medians for center and box width (IQR) or whisker spread for variability — separately, never one for the other.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'One-Variable Data: Center, Spread & Boxplots' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
