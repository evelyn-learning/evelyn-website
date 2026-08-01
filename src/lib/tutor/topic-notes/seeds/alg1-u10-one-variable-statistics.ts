/**
 * Algebra 1 — Unit 10 CED 10.1: One-Variable Statistics: Center & Spread.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.one-variable-statistics.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U10_ONE_VARIABLE_STATISTICS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.one-variable-statistics.v1',
  course: 'Algebra 1',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'One-Variable Statistics: Center & Spread',
  planId: 'evelyn.hs.alg1.one-variable-statistics.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.one-variable-statistics.v1' }],
  theory: [
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'The three centers', content: `THE THREE CENTERS — mean = sum ÷ count. Median = the middle value of the SORTED list (average the two middle values when the count is even). Mode = the value that appears most often; a data set can have one mode, several, or none.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Sort first', content: `SORT FIRST — median, quartiles, and range are all read off the sorted list. Reporting the middle of an unsorted list is the single most common mistake in this unit.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'The two spreads', content: `THE TWO SPREADS — range = max − min, one number that only sees the two extremes. IQR = Q3 − Q1, the width of the middle 50% of the data, which ignores the extremes entirely.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Finding quartiles', content: `FINDING QUARTILES — the median splits the sorted list into a lower half and an upper half. Q1 = the median of the lower half; Q3 = the median of the upper half. With an odd count, leave the middle value out of BOTH halves.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Outliers pull the mean, not the median', content: `OUTLIERS PULL THE MEAN, NOT THE MEDIAN — one extreme value can drag the mean a long way, because it enters the sum at full size. The median only shifts by a position or two, because it only cares about order. That is why median + IQR describe skewed or outlier-heavy data honestly, while mean + range describe roughly symmetric data fine.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Skew shape', content: `SKEW SHAPE — a long tail stretching right pulls the mean above the median (mean > median). A long tail stretching left pulls it below (mean < median). Roughly symmetric data has mean ≈ median. You can predict this from the shape before computing anything.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Reading a dot plot', content: `READING A DOT PLOT — every dot is one data value, and stacked dots are repeats. Count all the dots for n, read the tallest stack for the mode, and count in from the left to land on the median.` },
    { loId: 'alg1.one-variable-statistics', kind: 'framework', title: 'Reading a box plot', content: `READING A BOX PLOT — it draws the five-number summary (min, Q1, median, Q3, max) as a box from Q1 to Q3 with a line at the median and whiskers out to min and max. Each of the four sections holds exactly 25% of the values, so a long section means those values are SPREAD OUT — not that more of them are there.` },
    { loId: 'alg1.one-variable-statistics', kind: 'definition', title: 'interquartile range (IQR)', content: 'Q3 minus Q1 — the range spanned by the middle 50% of the data.' },
    { loId: 'alg1.one-variable-statistics', kind: 'definition', title: 'five-number summary', content: 'min, Q1, median, Q3, max — the five values a box plot displays.' },
    { loId: 'alg1.one-variable-statistics', kind: 'definition', title: 'outlier', content: `a value far away from the rest of the data; it pulls the mean but barely moves the median.` },
  ],
  methods: [
    {
      title: 'Worked dot plot summary',
      steps: [
        `The list is already sorted, and n = 10. Sum = 0 + 0 + 1 + 1 + 1 + 2 + 2 + 3 + 4 + 6 = 20, so mean = 20/10 = 2.`,
        `n is even, so the median is the average of the 5th and 6th values: (1 + 2)/2 = 1.5.`,
        'The tallest stack on the dot plot is over 1 (three dots), so the mode is 1.',
        'Range = max − min = 6 − 0 = 6.',
        `Quartiles: lower half is 0, 0, 1, 1, 1 → Q1 = 1. Upper half is 2, 2, 3, 4, 6 → Q3 = 3. So IQR = 3 − 1 = 2.`,
        `Notice mean (2) > median (1.5) — the single student with 6 pets stretches a tail to the right and pulls the mean up.`,
      ],
      example: { problem: `A dot plot shows the number of pets owned by 10 students: 0, 0, 1, 1, 1, 2, 2, 3, 4, 6. Find the mean, median, mode, range, and IQR.`, solution: 'mean = 2, median = 1.5, mode = 1, range = 6, IQR = 2' },
      relatedLoIds: ['alg1.one-variable-statistics'],
    },
    {
      title: 'Worked outlier shift',
      steps: [
        `Before: sum = 15 + 16 + 17 + 18 + 19 + 20 + 21 = 126, so mean = 126/7 = 18. With n = 7 the median is the 4th value: 18.`,
        'After: re-sort the list including the new score — 2, 15, 16, 17, 18, 19, 20, 21.',
        'New sum = 126 + 2 = 128 and n = 8, so the new mean = 128/8 = 16.',
        `n is now EVEN, so the new median is the average of the 4th and 5th values: (17 + 18)/2 = 17.5. Forgetting that the count changed parity is exactly where students misreport this.`,
        `The mean fell a full 2 points (18 → 16); the median fell only 0.5 (18 → 17.5). One low outlier, two very different reactions.`,
      ],
      example: { problem: `Seven students score 15, 16, 17, 18, 19, 20, 21 on a quiz. An eighth student who missed the review scores 2. How much does each measure of center move?`, solution: 'Mean drops from 18 to 16 (−2); median drops from 18 to 17.5 (−0.5)' },
      relatedLoIds: ['alg1.one-variable-statistics'],
    },
  ],
  pointers: [
    { content: `Sort the data first: 3, 6, 8, 9, 15. With n = 5 the median is the 3rd value, so the median is 8. The word "middle" means middle in ORDER, not middle on the page.`, kind: 'common-error' },
    { content: `Mean = (9 + 3 + 15 + 6 + 8)/5 = 41/5 = 8.2, which is the mean, not the median. The median here is 8. They happen to be close because 15 is only a mild outlier; with a stronger outlier they would separate sharply.`, kind: 'common-error' },
    { content: `Mean = sum ÷ count; median = middle of the SORTED list (average the two middles if the count is even); mode = most frequent value.`, kind: 'tip' },
    { content: `Range = max − min. IQR = Q3 − Q1 = the width of the middle 50%, found by taking the median of the lower half and of the upper half.`, kind: 'tip' },
    { content: `An outlier drags the mean and barely moves the median — so report median + IQR for skewed or outlier-heavy data, mean + range for roughly symmetric data.`, kind: 'tip' },
    { content: `Right tail → mean > median; left tail → mean < median; symmetric → mean ≈ median.`, kind: 'tip' },
    { content: `A box plot shows min, Q1, median, Q3, max, and each of its four sections holds 25% of the values — a long section means spread out, not more data.`, kind: 'tip' },
    { content: `Sort before you touch the median, Q1, Q3, or range. "Middle" means middle in ORDER, not middle on the page — the median of 9, 3, 15, 6, 8 is 8, not 15.`, kind: 'common-error' },
    { content: `Check the parity of n every single time. Odd n → the median is one actual data value; even n → average the two middles, and the answer may not appear in the data at all (e.g. 1.5 pets).`, kind: 'gotcha' },
    { content: `"Average" is not a synonym for median. Mean = sum ÷ count; median = middle of the sorted list. They can land close on tame data and far apart with a real outlier — don't let one answer stand in for the other.`, kind: 'vocab-note' },
    { content: `With an odd count, exclude the median value from BOTH halves when finding Q1 and Q3. Including it in one half shifts your quartiles and corrupts the IQR.`, kind: 'edge-case' },
    { content: `A long whisker or wide box means those values are SPREAD OUT, not that more data sits there. Every one of the four box-plot sections holds exactly 25% of the values, regardless of length.`, kind: 'gotcha' },
    { content: `Range and IQR are not interchangeable. Range = max − min sees only the two extremes; IQR = Q3 − Q1 ignores them. Report IQR alongside the median for skewed data, range alongside the mean for symmetric data.`, kind: 'vocab-note' },
    { content: `Use shape to predict before you compute: right tail → mean > median, left tail → mean < median, symmetric → mean ≈ median. If your numbers disagree with the picture, recheck your sum or your sort.`, kind: 'tip' },
    { content: `Mode is about frequency, not size or position. A data set can have one mode, several tied modes, or none if every value appears once — "no mode" is a legitimate answer, not a blank.`, kind: 'edge-case' },
  ],
};
