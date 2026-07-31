/**
 * Algebra 1 — One-Variable Statistics: Center & Spread.
 *
 * The data half of Algebra 1 (CCSS S-ID.A.2, S-ID.A.3): mean, median and
 * mode; range and IQR; reading dot plots and box plots; and the judgement
 * call that matters most — when an outlier or a skewed shape makes the
 * median the honest measure of "typical" and the mean a misleading one.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U10_ONE_VARIABLE_STATISTICS: LessonPlan = {
  id: 'evelyn.hs.alg1.one-variable-statistics.v1',
  title: 'One-Variable Statistics: Center & Spread',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.one-variable-statistics',
      standard: 'ALG1-10.1',
      description:
        'Compute and compare measures of center (mean, median, mode) and spread (range, IQR) for one-variable data, read dot plots and box plots, and choose the measure that best describes a data set affected by outliers or skew (CCSS S-ID.A.2, S-ID.A.3).',
    },
  ],
  prerequisites: ['alg1.rational-expressions'],
  followUps: ['alg1.scatterplots-trend-lines'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame center and spread as the tools for spotting when an "average" is telling the truth about a data set and when it is hiding something.',
      script:
        'Someone tells you the average pay at a shop is 63 thousand dollars a year. Sounds great — until you learn five of the six people there make about 35 and the owner makes 205. The average was true and still useless. Today you learn the small set of numbers — mean, median, mode, range, IQR — that let you say what typical really means, and read them straight off a dot plot or a box plot.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-center-spread',
      kind: 'concept',
      goal: 'The three centers, the two spreads, how to find quartiles, how outliers and skew move mean vs median, and how to read dot plots and box plots.',
      keyIdeas: [
        'THE THREE CENTERS — mean = sum ÷ count. Median = the middle value of the SORTED list (average the two middle values when the count is even). Mode = the value that appears most often; a data set can have one mode, several, or none.',
        'SORT FIRST — median, quartiles, and range are all read off the sorted list. Reporting the middle of an unsorted list is the single most common mistake in this unit.',
        'THE TWO SPREADS — range = max − min, one number that only sees the two extremes. IQR = Q3 − Q1, the width of the middle 50% of the data, which ignores the extremes entirely.',
        'FINDING QUARTILES — the median splits the sorted list into a lower half and an upper half. Q1 = the median of the lower half; Q3 = the median of the upper half. With an odd count, leave the middle value out of BOTH halves.',
        'OUTLIERS PULL THE MEAN, NOT THE MEDIAN — one extreme value can drag the mean a long way, because it enters the sum at full size. The median only shifts by a position or two, because it only cares about order. That is why median + IQR describe skewed or outlier-heavy data honestly, while mean + range describe roughly symmetric data fine.',
        'SKEW SHAPE — a long tail stretching right pulls the mean above the median (mean > median). A long tail stretching left pulls it below (mean < median). Roughly symmetric data has mean ≈ median. You can predict this from the shape before computing anything.',
        'READING A DOT PLOT — every dot is one data value, and stacked dots are repeats. Count all the dots for n, read the tallest stack for the mode, and count in from the left to land on the median.',
        'READING A BOX PLOT — it draws the five-number summary (min, Q1, median, Q3, max) as a box from Q1 to Q3 with a line at the median and whiskers out to min and max. Each of the four sections holds exactly 25% of the values, so a long section means those values are SPREAD OUT — not that more of them are there.',
      ],
      vocabulary: [
        { term: 'interquartile range (IQR)', definition: 'Q3 minus Q1 — the range spanned by the middle 50% of the data.' },
        { term: 'five-number summary', definition: 'min, Q1, median, Q3, max — the five values a box plot displays.' },
        { term: 'outlier', definition: 'a value far away from the rest of the data; it pulls the mean but barely moves the median.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-dot-plot-summary',
      kind: 'worked_example',
      problem:
        'A dot plot shows the number of pets owned by 10 students: 0, 0, 1, 1, 1, 2, 2, 3, 4, 6. Find the mean, median, mode, range, and IQR.',
      steps: [
        'The list is already sorted, and n = 10. Sum = 0 + 0 + 1 + 1 + 1 + 2 + 2 + 3 + 4 + 6 = 20, so mean = 20/10 = 2.',
        'n is even, so the median is the average of the 5th and 6th values: (1 + 2)/2 = 1.5.',
        'The tallest stack on the dot plot is over 1 (three dots), so the mode is 1.',
        'Range = max − min = 6 − 0 = 6.',
        'Quartiles: lower half is 0, 0, 1, 1, 1 → Q1 = 1. Upper half is 2, 2, 3, 4, 6 → Q3 = 3. So IQR = 3 − 1 = 2.',
        'Notice mean (2) > median (1.5) — the single student with 6 pets stretches a tail to the right and pulls the mean up.',
      ],
      answer: 'mean = 2, median = 1.5, mode = 1, range = 6, IQR = 2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-outlier-shift',
      kind: 'worked_example',
      problem:
        'Seven students score 15, 16, 17, 18, 19, 20, 21 on a quiz. An eighth student who missed the review scores 2. How much does each measure of center move?',
      steps: [
        'Before: sum = 15 + 16 + 17 + 18 + 19 + 20 + 21 = 126, so mean = 126/7 = 18. With n = 7 the median is the 4th value: 18.',
        'After: re-sort the list including the new score — 2, 15, 16, 17, 18, 19, 20, 21.',
        'New sum = 126 + 2 = 128 and n = 8, so the new mean = 128/8 = 16.',
        'n is now EVEN, so the new median is the average of the 4th and 5th values: (17 + 18)/2 = 17.5. Forgetting that the count changed parity is exactly where students misreport this.',
        'The mean fell a full 2 points (18 → 16); the median fell only 0.5 (18 → 17.5). One low outlier, two very different reactions.',
      ],
      answer: 'Mean drops from 18 to 16 (−2); median drops from 18 to 17.5 (−0.5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-center',
      kind: 'try_yourself',
      problem:
        'Yearly pay at a small bakery, in thousands of dollars: 32, 34, 35, 36, 38, 205. Which statement best describes this data set?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mean, about 63.3 thousand, is the better measure of typical pay because it uses every value.' },
        { id: 'b', text: 'The median, 35.5 thousand, is the better measure of typical pay because the 205 thousand outlier does not pull it.', correct: true },
        { id: 'c', text: 'The mean and median are about equal here, so either one describes typical pay.' },
        { id: 'd', text: 'The range, 173 thousand, is the best measure of typical pay.' },
      ],
      expectedAnswer: 'The median, 35.5 thousand, is the better measure of typical pay because the 205 thousand outlier does not pull it.',
      hints: [
        'Compute both: mean = sum ÷ 6, and median = the average of the 3rd and 4th sorted values.',
        'Mean = 380/6 ≈ 63.3 (thousand); median = (35 + 36)/2 = 35.5 (thousand). Five of the six people earn near 35 — which number matches that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-box-plot-compare',
      kind: 'try_yourself',
      problem:
        'Box plots of two classes’ quiz scores have the SAME median. Class A’s box runs from 72 to 78; Class B’s box runs from 60 to 90. What does this tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Class A's middle 50% of scores is less spread out than Class B's.", correct: true },
        { id: 'b', text: 'Class A has a higher typical score than Class B.' },
        { id: 'c', text: 'Class A has fewer students than Class B.' },
        { id: 'd', text: "Class A's scores have a larger range than Class B's." },
      ],
      expectedAnswer: "Class A's middle 50% of scores is less spread out than Class B's.",
      hints: [
        'The box runs from Q1 to Q3, so its width is the IQR. Class A: 78 − 72 = 6. Class B: 90 − 60 = 30.',
        'Box width measures spread of the middle 50% — not the number of students, not the center (the medians are equal), and not the range (that needs the whiskers, which are not given).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-iqr',
      kind: 'try_yourself',
      problem:
        'Minutes nine students spent on homework, sorted: 4, 7, 8, 10, 12, 14, 15, 18, 20. Find the interquartile range and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'n = 9, so the median is the 5th value, 12 — leave it out of both halves.',
        'Lower half 4, 7, 8, 10 → Q1 = (7 + 8)/2 = 7.5. Upper half 14, 15, 18, 20 → Q3 = (15 + 18)/2 = 16.5. Now subtract.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-unsorted-median',
      kind: 'misconception_check',
      question: 'A student is asked for the median of 9, 3, 15, 6, 8 and answers 15. What went wrong, and what is the correct median?',
      commonErrors: [
        {
          answer: '15',
          misconception: 'Taking the physically middle number of the list as it was written, without sorting it first.',
          correctsTo:
            'Sort the data first: 3, 6, 8, 9, 15. With n = 5 the median is the 3rd value, so the median is 8. The word "middle" means middle in ORDER, not middle on the page.',
        },
        {
          answer: '8.2',
          misconception: 'Computing the mean and reporting it as the median — treating the two words as interchangeable names for "average".',
          correctsTo:
            'Mean = (9 + 3 + 15 + 6 + 8)/5 = 41/5 = 8.2, which is the mean, not the median. The median here is 8. They happen to be close because 15 is only a mild outlier; with a stronger outlier they would separate sharply.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean = sum ÷ count; median = middle of the SORTED list (average the two middles if the count is even); mode = most frequent value.',
        'Range = max − min. IQR = Q3 − Q1 = the width of the middle 50%, found by taking the median of the lower half and of the upper half.',
        'An outlier drags the mean and barely moves the median — so report median + IQR for skewed or outlier-heavy data, mean + range for roughly symmetric data.',
        'Right tail → mean > median; left tail → mean < median; symmetric → mean ≈ median.',
        'A box plot shows min, Q1, median, Q3, max, and each of its four sections holds 25% of the values — a long section means spread out, not more data.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'One-Variable Statistics: Center & Spread' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
