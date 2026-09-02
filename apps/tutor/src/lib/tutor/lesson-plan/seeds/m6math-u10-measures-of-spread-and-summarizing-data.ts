/**
 * Grade 6 Math — Statistics: Distributions, Center & Spread: Measures of
 * Spread & Summarizing Data.
 *
 * CONCEPT-LED exemplar-style closer for the m6math fan-out, and the final
 * lesson of the course. Row 10.3 already gave the student a center (mean,
 * median); this lesson supplies the piece a center alone cannot give: how
 * tightly or loosely the values are bunched, and how to turn all of that
 * into a summary that still names what was measured and in what units
 * (CCSS 6.SP.A.2/B.4/B.5). The five-number summary (minimum, Q1, median,
 * Q3, maximum) is built by hand from ordered lists throughout, and every box
 * plot is described in words a student could draw from, since the student
 * cannot see a picture here.
 *
 * SCOPE GUARD: This lesson teaches describing the SPREAD of a single data
 * set — range, quartiles, the interquartile range, and the five-number
 * summary a box plot is built from — plus reading the overall shape of a
 * distribution and writing a summary that names what was measured, how, and
 * in what units. It treats the median as an already-mastered step: worked
 * examples use it to locate the quartiles, but no key idea or vocabulary
 * entry defines or re-teaches how to find a median or a mean, and no step in
 * this file walks through computing one — that instruction belongs to row
 * 10.3; the hook only asks the student to apply the already-known mean
 * procedure and states the resulting value. It never builds a dot plot or a
 * histogram, which belongs to row 10.2. Everything here stays inside ONE
 * data set at a time: random sampling, drawing an
 * inference from a sample, and comparing two separate populations are Grade 7
 * (m7math, Statistics & Sampling) and do not appear, even though the hook
 * places two small data sets side by side to motivate why spread matters —
 * that is an informal, visual contrast to build intuition, not the
 * statistical population-comparison procedure Grade 7 teaches.
 *
 * NOTE ON prerequisites/followUps: this is the LAST row of the course (10.4),
 * so followUps stays empty. prerequisites points to row 10.3
 * (m6math.measures-of-center), which is authored in the same fan-out batch as
 * this file; `lint-ms-plans` checks prerequisite/followUp ids against the
 * whole batch, not per-file, so this resolves once all 40 rows are
 * registered together.
 *
 * QUARTILE CONVENTION: the median-excluded ("exclusive") method — order the
 * data, find the median, then EXCLUDE that middle value from both halves
 * before finding Q1 (the median of the lower half) and Q3 (the median of the
 * upper half). When a half has an even number of values, its median is the
 * average of its two middle values.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U10_MEASURES_OF_SPREAD_AND_SUMMARIZING_DATA: LessonPlan = {
  id: 'evelyn.ms.m6math.measures-of-spread-and-summarizing-data.v1',
  title: 'Measures of Spread & Summarizing Data',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.measures-of-spread-and-summarizing-data',
      standard: 'M6MATH-10.4',
      description:
        'Describe the spread (range, interquartile range, box plots) and overall shape of a distribution, and summarize a data set in the context it was collected (CCSS 6.SP.A.2/B.4/B.5).',
    },
  ],
  prerequisites: ['m6math.measures-of-center'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two data sets can share the same center and still tell completely different stories, so the student wants a way to measure spread.',
      script:
        'During Monday warm-up, the Robotics Club and the Chess Club both did a plank hold and timed every member with a stopwatch, in seconds. Robotics Club: 28, 29, 30, 31, 32. Chess Club: 10, 20, 30, 40, 50. Work out the mean of each list the way you already know how, and both clubs land on the exact same mean: 30 seconds. So are the two clubs the same? Not really. Every Robotics Club member held the plank for close to 30 seconds. Chess Club had one member at 10 seconds and one at 50, with the rest spread out between. The mean alone hides that difference completely. Today we learn how to measure and describe spread, so a summary can say more than just one number in the middle.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-spread-and-shape',
      kind: 'concept',
      goal: 'Build range, quartiles, the interquartile range, and the box plot as tools for describing spread, and set the expectation that a summary always includes context.',
      keyIdeas: [
        'A CENTER ALONE CAN HIDE THE STORY — two data sets can share the same mean or median and still look nothing alike. Spread tells you how tightly bunched or how spread out the values really are, which a center number cannot tell you by itself.',
        'RANGE IS THE QUICKEST MEASURE OF SPREAD — subtract the least value from the greatest value: range = maximum minus minimum. It is fast, but it only looks at two values, so one unusually high or unusually low value can make the range misleading.',
        'THE FIVE-NUMBER SUMMARY SPLITS ORDERED DATA INTO FOUR EQUAL GROUPS — order the data first. The median splits it in half. Then find the median of the lower half, called the first quartile (Q1), and the median of the upper half, called the third quartile (Q3). When the total count is odd, leave the overall median out of both halves before finding Q1 and Q3. Minimum, Q1, median, Q3, maximum together are the five-number summary, and each of the four gaps between them holds about one quarter of the data.',
        'THE INTERQUARTILE RANGE DESCRIBES THE MIDDLE HALF — interquartile range (IQR) = Q3 minus Q1. It describes the spread of just the middle half of the data, so one extreme value far from the rest barely changes it. That makes the IQR a steadier measure of spread than the range whenever a data set has an unusual value in it.',
        'A BOX PLOT IS A PICTURE OF THE FIVE-NUMBER SUMMARY — a box plot (or box-and-whisker plot) draws a box from Q1 to Q3, with a line inside the box at the median, and a whisker stretching out to the minimum on one side and the maximum on the other. The box always covers the middle half of the data. A short box packed close together means that middle half is tightly bunched; a long box means it is spread out. Long whiskers compared to a short box means most of the data clusters in the middle with a few values reaching far out.',
        'A REAL SUMMARY NAMES WHAT, HOW, AND IN WHAT UNITS — reporting numbers alone is not a summary. State what was measured (reading minutes, plank-hold seconds, throw distance), how it was collected (a reading log, a stopwatch, a tape measure), and the units, then use the five-number summary and the spread to say what that means for the group it came from.',
      ],
      vocabulary: [
        { term: 'range', definition: 'the difference between the greatest value and the least value in a data set: range = maximum minus minimum.' },
        { term: 'quartile', definition: 'one of the values (Q1, median, Q3) that splits an ordered data set into four groups with about the same number of values in each.' },
        { term: 'interquartile range (IQR)', definition: 'the difference between the third quartile and the first quartile, IQR = Q3 minus Q1; it measures the spread of the middle half of the data.' },
        { term: 'box plot', definition: 'a diagram built from the five-number summary that draws a box from Q1 to Q3 with a line at the median, and whiskers reaching out to the minimum and the maximum.' },
        { term: 'five-number summary', definition: 'the minimum, first quartile (Q1), median, third quartile (Q3), and maximum of an ordered data set, taken together.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reading-log-five-number-summary',
      kind: 'worked_example',
      problem:
        'Amir kept a reading log for one week, writing down how many pages of his book he read each night before bed: Sunday 15, Monday 30, Tuesday 12, Wednesday 24, Thursday 18, Friday 15, Saturday 20. Find the five-number summary, the range, and the interquartile range, then describe the box plot in words.',
      steps: [
        'Order the seven values from least to greatest first: 12, 15, 15, 18, 20, 24, 30.',
        'With 7 values, the median is the 4th value: 18 pages. That splits the week into a lower half and an upper half, and since 7 is odd, the median itself is left out of both halves.',
        'Lower half (the 3 values below the median): 12, 15, 15. Its median is the middle one, 15, so Q1 = 15 pages.',
        'Upper half (the 3 values above the median): 20, 24, 30. Its median is the middle one, 24, so Q3 = 24 pages.',
        'Five-number summary: minimum 12, Q1 15, median 18, Q3 24, maximum 30 (all in pages).',
        'Range = maximum minus minimum = 30 minus 12 = 18 pages.',
        'Interquartile range (IQR) = Q3 minus Q1 = 24 minus 15 = 9 pages.',
        'Describe the box plot in words: a left whisker from 12 to 15, a box from 15 to 24 with a line at 18, and a right whisker from 24 to 30.',
        'Summarize in context: over one week, Amir read between 12 and 30 pages a night. On half of those nights, he read between 15 and 24 pages, with a typical night at 18 pages. The one 30-page night stretches the range, but it barely changes the IQR, since it sits outside the middle half.',
      ],
      answer: 'Five-number summary: 12, 15, 18, 24, 30 (pages); range = 18 pages; IQR = 9 pages.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-chess-club-plank-times',
      kind: 'worked_example',
      problem:
        'Back to the Chess Club plank hold from warm-up, timed in seconds with a stopwatch: Riley 40, Jordan 10, Casey 50, Amara 20, Theo 30. Find the five-number summary, the range, and the IQR, and describe the box plot in words.',
      steps: [
        'Order the 5 times from least to greatest: 10, 20, 30, 40, 50.',
        'With 5 values, the median is the 3rd value: 30 seconds. Since 5 is odd, leave 30 out of both halves.',
        'Lower half (2 values): 10, 20. With an even count, its median is the average of both values: (10 + 20) / 2 = 15, so Q1 = 15 seconds.',
        'Upper half (2 values): 40, 50. Its median is (40 + 50) / 2 = 45, so Q3 = 45 seconds.',
        'Five-number summary: minimum 10, Q1 15, median 30, Q3 45, maximum 50 (all in seconds).',
        'WRONG: including the median value of 30 in the upper half, treating it as {30, 40, 50}, whose median is 40, and reporting Q3 = 40. CORRECT: with an odd count, the median is excluded from both halves, so the upper half is only {40, 50} and Q3 = 45, not 40.',
        'Range = 50 minus 10 = 40 seconds. IQR = Q3 minus Q1 = 45 minus 15 = 30 seconds.',
        'Describe the box plot in words: a left whisker from 10 to 15, a box from 15 to 45 with a line at 30, and a right whisker from 45 to 50. The box takes up most of the space between the whiskers, which is a picture of how spread out this club really is.',
        'Summarize in context: during Monday warm-up, Chess Club plank times ranged from 10 to 50 seconds, a spread of 40 seconds. The IQR of 30 seconds shows that even the middle half of the club is spread far apart, unlike a club where everyone lands close to the same time.',
      ],
      answer: 'Five-number summary: 10, 15, 30, 45, 50 (seconds); range = 40 seconds; IQR = 30 seconds.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-iqr-from-five-number-summary',
      kind: 'try_yourself',
      problem:
        'A five-number summary for the number of minutes a group of students spent on chores yesterday is: minimum 5, Q1 = 12, median = 18, Q3 = 22, maximum = 30. What is the interquartile range (IQR) of this data set?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '25 minutes' },
        { id: 'b', text: '30 minutes' },
        { id: 'c', text: '10 minutes', correct: true },
        { id: 'd', text: '6 minutes' },
      ],
      expectedAnswer: '10 minutes',
      hints: [
        'The IQR is Q3 minus Q1, not the maximum minus the minimum, and not the maximum by itself.',
        'Q3 is 22 and Q1 is 12. Subtract: 22 minus 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-box-represents',
      kind: 'try_yourself',
      problem:
        'A class recorded how many minutes each of 20 students spent on homework last night. The five-number summary was: minimum 10 minutes, Q1 = 20 minutes, median = 35 minutes, Q3 = 50 minutes, maximum = 90 minutes. In a box plot of this data, what does the box itself (the part between Q1 and Q3) represent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The middle half of the homework times, from 20 to 50 minutes', correct: true },
        { id: 'b', text: 'The lowest quarter of the homework times, from 10 to 20 minutes' },
        { id: 'c', text: 'Only the single time equal to the median, 35 minutes' },
        { id: 'd', text: 'The full range of homework times, from 10 to 90 minutes' },
      ],
      expectedAnswer: 'The middle half of the homework times, from 20 to 50 minutes',
      hints: [
        'The box stretches from Q1 to Q3. Think about how much of the ordered data sits between those two quartiles.',
        'Q1 and Q3 are the two quartiles that mark off the middle half of the data, the part between the lowest quarter and the highest quarter.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-video-game-minutes-iqr',
      kind: 'try_yourself',
      problem:
        'Diego tracked how many minutes he played video games each day for one week: 45, 30, 60, 20, 50, 35, 40. Find the interquartile range (IQR) of this data set. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: [
        'Put the seven values in order first: 20, 30, 35, 40, 45, 50, 60. Find the median, the 4th value, then leave it out of both halves.',
        'Q1 is the median of the three values below the median (20, 30, 35), which is 30. Q3 is the median of the three values above it (45, 50, 60), which is 50. Subtract Q1 from Q3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-range-vs-iqr-and-median-in-both-halves',
      kind: 'misconception_check',
      question:
        'A data set of daily step-club distances (in laps) is already in order: 20, 30, 35, 40, 45, 50, 60, with a median of 40. One student says the interquartile range is 40. Another student includes 40 in the upper half and says the interquartile range is 17.5. What went wrong in each case?',
      commonErrors: [
        {
          answer: '40',
          misconception: 'Computing the range (maximum minus minimum) and reporting it as the interquartile range, treating the two measures as the same thing.',
          correctsTo:
            'The IQR is not the range. Order the data (20, 30, 35, 40, 45, 50, 60), find the median (40), then find Q1 from the lower half (20, 30, 35), which gives Q1 = 30, and Q3 from the upper half (45, 50, 60), which gives Q3 = 50. IQR = 50 minus 30 = 20. The range, 60 minus 20 = 40, measures the whole spread including the most extreme values; the IQR measures only the middle half, and the two numbers answer different questions.',
        },
        {
          answer: '17.5',
          misconception: 'Including the overall median (40) in the upper half, making it {40, 45, 50, 60} instead of leaving the median out.',
          correctsTo:
            'With an odd number of values, the median is left out of BOTH halves before finding Q1 and Q3. The correct upper half is {45, 50, 60}, three values, so Q3 = 50, not the average of 40 and 50. With Q1 = 30 and the correct Q3 = 50, the IQR is 50 minus 30 = 20, not 17.5.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A center (mean or median) alone can hide how spread out a data set really is.',
        'Range = maximum minus minimum; it is quick but only looks at the two most extreme values.',
        'To find the five-number summary: order the data, find the median, then find Q1 (median of the lower half) and Q3 (median of the upper half), leaving the overall median out of both halves when the count is odd.',
        'Interquartile range (IQR) = Q3 minus Q1; it describes the middle half of the data and stays steady even when one value is unusually far from the rest.',
        'A box plot draws a box from Q1 to Q3 with a line at the median, and whiskers out to the minimum and the maximum, so its shape shows how bunched or spread out the data is.',
        'A real summary always names what was measured, how it was collected, and the units, alongside the numbers.',
        'That closes out Grade 6 Math: from ratios and fractions through equations, geometry, and now a full data set described in its own words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Measures of Spread & Summarizing Data' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
