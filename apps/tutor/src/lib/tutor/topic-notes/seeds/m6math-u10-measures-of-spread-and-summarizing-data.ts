/**
 * Grade 6 Math — Unit 10 CED 10.4: Measures of Spread & Summarizing Data.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.measures-of-spread-and-summarizing-data.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U10_MEASURES_OF_SPREAD_AND_SUMMARIZING_DATA: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.measures-of-spread-and-summarizing-data.v1',
  course: 'Grade 6 Math',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Measures of Spread & Summarizing Data',
  planId: 'evelyn.ms.m6math.measures-of-spread-and-summarizing-data.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.measures-of-spread-and-summarizing-data.v1' }],
  theory: [
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'A center alone can hide the story', content: `A CENTER ALONE CAN HIDE THE STORY — two data sets can share the same mean or median and still look nothing alike. Spread tells you how tightly bunched or how spread out the values really are, which a center number cannot tell you by itself.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'Range is the quickest measure of spread', content: `RANGE IS THE QUICKEST MEASURE OF SPREAD — subtract the least value from the greatest value: range = maximum minus minimum. It is fast, but it only looks at two values, so one unusually high or unusually low value can make the range misleading.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'The five-number summary splits ordered data into four equal groups', content: `THE FIVE-NUMBER SUMMARY SPLITS ORDERED DATA INTO FOUR EQUAL GROUPS — order the data first. The median splits it in half. Then find the median of the lower half, called the first quartile (Q1), and the median of the upper half, called the third quartile (Q3). When the total count is odd, leave the overall median out of both halves before finding Q1 and Q3. Minimum, Q1, median, Q3, maximum together are the five-number summary, and each of the four gaps between them holds about one quarter of the data.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'The interquartile range describes the middle half', content: `THE INTERQUARTILE RANGE DESCRIBES THE MIDDLE HALF — interquartile range (IQR) = Q3 minus Q1. It describes the spread of just the middle half of the data, so one extreme value far from the rest barely changes it. That makes the IQR a steadier measure of spread than the range whenever a data set has an unusual value in it.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'A box plot is a picture of the five-number summary', content: `A BOX PLOT IS A PICTURE OF THE FIVE-NUMBER SUMMARY — a box plot (or box-and-whisker plot) draws a box from Q1 to Q3, with a line inside the box at the median, and a whisker stretching out to the minimum on one side and the maximum on the other. The box always covers the middle half of the data. A short box packed close together means that middle half is tightly bunched; a long box means it is spread out. Long whiskers compared to a short box means most of the data clusters in the middle with a few values reaching far out.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'framework', title: 'A real summary names what, how, and in what units', content: `A REAL SUMMARY NAMES WHAT, HOW, AND IN WHAT UNITS — reporting numbers alone is not a summary. State what was measured (reading minutes, plank-hold seconds, throw distance), how it was collected (a reading log, a stopwatch, a tape measure), and the units, then use the five-number summary and the spread to say what that means for the group it came from.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'definition', title: 'range', content: `the difference between the greatest value and the least value in a data set: range = maximum minus minimum.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'definition', title: 'quartile', content: `one of the values (Q1, median, Q3) that splits an ordered data set into four groups with about the same number of values in each.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'definition', title: 'interquartile range (IQR)', content: `the difference between the third quartile and the first quartile, IQR = Q3 minus Q1; it measures the spread of the middle half of the data.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'definition', title: 'box plot', content: `a diagram built from the five-number summary that draws a box from Q1 to Q3 with a line at the median, and whiskers reaching out to the minimum and the maximum.` },
    { loId: 'm6math.measures-of-spread-and-summarizing-data', kind: 'definition', title: 'five-number summary', content: `the minimum, first quartile (Q1), median, third quartile (Q3), and maximum of an ordered data set, taken together.` },
  ],
  methods: [
    {
      title: 'Worked reading log five number summary',
      steps: [
        'Order the seven values from least to greatest first: 12, 15, 15, 18, 20, 24, 30.',
        `With 7 values, the median is the 4th value: 18 pages. That splits the week into a lower half and an upper half, and since 7 is odd, the median itself is left out of both halves.`,
        `Lower half (the 3 values below the median): 12, 15, 15. Its median is the middle one, 15, so Q1 = 15 pages.`,
        `Upper half (the 3 values above the median): 20, 24, 30. Its median is the middle one, 24, so Q3 = 24 pages.`,
        `Five-number summary: minimum 12, Q1 15, median 18, Q3 24, maximum 30 (all in pages).`,
        'Range = maximum minus minimum = 30 minus 12 = 18 pages.',
        'Interquartile range (IQR) = Q3 minus Q1 = 24 minus 15 = 9 pages.',
        `Describe the box plot in words: a left whisker from 12 to 15, a box from 15 to 24 with a line at 18, and a right whisker from 24 to 30.`,
        `Summarize in context: over one week, Amir read between 12 and 30 pages a night. On half of those nights, he read between 15 and 24 pages, with a typical night at 18 pages. The one 30-page night stretches the range, but it barely changes the IQR, since it sits outside the middle half.`,
      ],
      example: { problem: `Amir kept a reading log for one week, writing down how many pages of his book he read each night before bed: Sunday 15, Monday 30, Tuesday 12, Wednesday 24, Thursday 18, Friday 15, Saturday 20. Find the five-number summary, the range, and the interquartile range, then describe the box plot in words.`, solution: `Five-number summary: 12, 15, 18, 24, 30 (pages); range = 18 pages; IQR = 9 pages.` },
      relatedLoIds: ['m6math.measures-of-spread-and-summarizing-data'],
    },
    {
      title: 'Worked chess club plank times',
      steps: [
        'Order the 5 times from least to greatest: 10, 20, 30, 40, 50.',
        `With 5 values, the median is the 3rd value: 30 seconds. Since 5 is odd, leave 30 out of both halves.`,
        `Lower half (2 values): 10, 20. With an even count, its median is the average of both values: (10 + 20) / 2 = 15, so Q1 = 15 seconds.`,
        `Upper half (2 values): 40, 50. Its median is (40 + 50) / 2 = 45, so Q3 = 45 seconds.`,
        `Five-number summary: minimum 10, Q1 15, median 30, Q3 45, maximum 50 (all in seconds).`,
        `WRONG: including the median value of 30 in the upper half, treating it as {30, 40, 50}, whose median is 40, and reporting Q3 = 40. CORRECT: with an odd count, the median is excluded from both halves, so the upper half is only {40, 50} and Q3 = 45, not 40.`,
        'Range = 50 minus 10 = 40 seconds. IQR = Q3 minus Q1 = 45 minus 15 = 30 seconds.',
        `Describe the box plot in words: a left whisker from 10 to 15, a box from 15 to 45 with a line at 30, and a right whisker from 45 to 50. The box takes up most of the space between the whiskers, which is a picture of how spread out this club really is.`,
        `Summarize in context: during Monday warm-up, Chess Club plank times ranged from 10 to 50 seconds, a spread of 40 seconds. The IQR of 30 seconds shows that even the middle half of the club is spread far apart, unlike a club where everyone lands close to the same time.`,
      ],
      example: { problem: `Back to the Chess Club plank hold from warm-up, timed in seconds with a stopwatch: Riley 40, Jordan 10, Casey 50, Amara 20, Theo 30. Find the five-number summary, the range, and the IQR, and describe the box plot in words.`, solution: `Five-number summary: 10, 15, 30, 45, 50 (seconds); range = 40 seconds; IQR = 30 seconds.` },
      relatedLoIds: ['m6math.measures-of-spread-and-summarizing-data'],
    },
  ],
  pointers: [
    { content: `Students often say "40" — The IQR is not the range. Order the data (20, 30, 35, 40, 45, 50, 60), find the median (40), then find Q1 from the lower half (20, 30, 35), which gives Q1 = 30, and Q3 from the upper half (45, 50, 60), which gives Q3 = 50. IQR = 50 minus 30 = 20. The range, 60 minus 20 = 40, measures the whole spread including the most extreme values; the IQR measures only the middle half, and the two numbers answer different questions.`, kind: 'common-error' },
    { content: `Students often say "17.5" — With an odd number of values, the median is left out of BOTH halves before finding Q1 and Q3. The correct upper half is {45, 50, 60}, three values, so Q3 = 50, not the average of 40 and 50. With Q1 = 30 and the correct Q3 = 50, the IQR is 50 minus 30 = 20, not 17.5.`, kind: 'common-error' },
    { content: 'A center (mean or median) alone can hide how spread out a data set really is.', kind: 'tip' },
    { content: `Range = maximum minus minimum; it is quick but only looks at the two most extreme values.`, kind: 'tip' },
    { content: `To find the five-number summary: order the data, find the median, then find Q1 (median of the lower half) and Q3 (median of the upper half), leaving the overall median out of both halves when the count is odd.`, kind: 'tip' },
    { content: `Interquartile range (IQR) = Q3 minus Q1; it describes the middle half of the data and stays steady even when one value is unusually far from the rest.`, kind: 'tip' },
    { content: `A box plot draws a box from Q1 to Q3 with a line at the median, and whiskers out to the minimum and the maximum, so its shape shows how bunched or spread out the data is.`, kind: 'tip' },
    { content: `A real summary always names what was measured, how it was collected, and the units, alongside the numbers.`, kind: 'tip' },
    { content: `That closes out Grade 6 Math: from ratios and fractions through equations, geometry, and now a full data set described in its own words.`, kind: 'tip' },
  ],
};
