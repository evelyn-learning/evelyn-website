/**
 * Grade 7 Math — Statistics & Sampling: Measures of Center & Variability.
 *
 * Turning a list of numbers into a few numbers that describe it (CCSS 7.SP.B.3,
 * 7.SP.B.4). Mean, median and mode summarize the center; range and mean absolute
 * deviation summarize the spread. MAD is the grade-7 variability measure and the
 * whole reason Unit 9 can compare two groups later. Two traps get named here:
 * dropping the absolute value when computing MAD, and reporting a mean that an
 * outlier has dragged away from the rest of the data.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U9_MEASURES_OF_CENTER_AND_VARIABILITY: LessonPlan = {
  id: 'evelyn.ms.m7math.measures-of-center-and-variability.v1',
  title: 'Measures of Center & Variability',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.measures-of-center-and-variability',
      standard: 'M7MATH-9.3',
      description:
        'Compute the mean, median, mode, range and mean absolute deviation of a small data set, and choose the measure of center that best describes the data when an outlier is present (CCSS 7.SP.B.3, 7.SP.B.4).',
    },
  ],
  prerequisites: ['m7math.random-sampling-and-inferences'],
  followUps: ['m7math.comparing-two-populations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one number can summarize a list, and that the wrong number can lie about it.',
      script:
        'Six friends got birthday money this year: 10 dollars, 12, 15, 15, 18, and 20. If somebody asks what a typical birthday gift is around here, you would say about 15 dollars, and you would be right. Now a seventh friend joins the group, and his grandmother sent him 85 dollars. Suddenly the average birthday gift in the group is 25 dollars, which is more than six of the seven friends actually got. The average is telling the truth about the arithmetic and lying about the friends. Today we learn several ways to describe a pile of numbers, and how to tell which one is being honest.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-center-and-spread',
      kind: 'concept',
      goal: 'Define mean, median, mode, range and MAD, and explain what spread adds that center cannot say.',
      keyIdeas: [
        'THE MEAN IS THE BALANCE POINT — add every value, then divide by how many values there are. For 12, 15, 15, 18, 20, 22, 24 the sum is 126 and there are 7 values, so the mean is 126 divided by 7, which is 18. The mean uses every number, which is its strength and also its weakness: one extreme value drags it.',
        'THE MEDIAN IS THE MIDDLE — put the values in order, then take the one in the middle. With 7 values the median is the 4th one. With an EVEN number of values there is no single middle, so take the two middle values and average them: for 2, 3, 3, 5, 6, 9 the middle two are 3 and 5, and the median is 4. Order the list first, every single time.',
        'THE MODE IS THE REPEATER — the value that appears most often. A data set can have one mode, several modes, or none at all. Mode is useful for things you cannot average, such as favorite color, but it is a weak description of center for numbers.',
        'RANGE IS THE ROUGHEST MEASURE OF SPREAD — subtract the smallest value from the largest. It is quick, but it looks at only two numbers in the whole set and ignores everything in between, so one strange value can blow it up.',
        'MEAN ABSOLUTE DEVIATION MEASURES TYPICAL DISTANCE FROM THE MEAN — the MAD is the star of this lesson. Three steps. First, find the mean. Second, find how far each value sits from the mean, always as a positive distance. Third, average those distances. A small MAD means the values huddle close to the mean; a large MAD means they are scattered. Two data sets can share the same mean and be nothing alike, and the MAD is what tells them apart.',
        'AN OUTLIER PULLS THE MEAN AND BARELY MOVES THE MEDIAN — an outlier is a value far away from the rest. The mean is a balance point, so an extreme value tugs it hard. The median only counts positions, so an extreme value shifts it by at most one spot. When a data set has an outlier, report the median as the typical value.',
      ],
      vocabulary: [
        { term: 'mean', definition: 'the sum of all values divided by how many values there are.' },
        { term: 'median', definition: 'the middle value of an ordered list, or the average of the two middle values when the count is even.' },
        { term: 'mode', definition: 'the value that appears most often in a data set.' },
        { term: 'range', definition: 'the largest value minus the smallest value.' },
        { term: 'mean absolute deviation', definition: 'the average distance of the values from the mean, written MAD and never negative.' },
        { term: 'outlier', definition: 'a value that sits far away from the rest of the data.' },
      ],
      suggestedTools: ['show_table', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-outlier-mean-vs-median',
      kind: 'worked_example',
      problem:
        'Six friends got these amounts of birthday money, in dollars: 10, 12, 15, 15, 18, 20. Find the mean and the median. Then a seventh friend joins the group with 85 dollars. Find the new mean and the new median, and say which one describes the group better.',
      steps: [
        'The list is already in order, which makes both jobs easier. Always order first.',
        'Mean of the six: add them. 10 plus 12 is 22, plus 15 is 37, plus 15 is 52, plus 18 is 70, plus 20 is 90. The sum is 90 and there are 6 values, so the mean is 90 divided by 6, which is 15 dollars.',
        'Median of the six: 6 is even, so there is no single middle. The two middle values are the 3rd and 4th, which are 15 and 15. Their average is 15, so the median is 15 dollars. Mean and median agree, which is what happens when nothing extreme is present.',
        'Now add the 85. The ordered list is 10, 12, 15, 15, 18, 20, 85. The new sum is 90 plus 85, which is 175, and there are now 7 values, so the new mean is 175 divided by 7, which is 25 dollars.',
        'New median: 7 values, so the median is the 4th one in order. Counting in from the left, 10, 12, 15, 15 — the median is still 15 dollars.',
        'Compare what the 85 did. The mean jumped from 15 to 25, a move of 10 dollars, and 25 is more than six of the seven friends actually received. The median did not move at all. The range also exploded, from 20 minus 10 which is 10, to 85 minus 10 which is 75.',
        'So the median, 15 dollars, is the honest description of a typical gift in this group. The mode is 15 as well, since 15 is the only repeated value. WRONG answer to avoid: a typical gift here is 25 dollars. RIGHT answer: a typical gift here is 15 dollars, and one friend got a very unusual 85.',
      ],
      answer:
        'Six friends: mean 15 dollars, median 15 dollars. With the 85: mean 25 dollars, median 15 dollars. The median describes the group better.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compute-mad',
      kind: 'worked_example',
      problem:
        'Sam recorded how many minutes he spent on homework on six nights: 20, 25, 30, 35, 40, 30. Find the mean and the mean absolute deviation.',
      steps: [
        'Step one, find the mean. Add the values: 20 plus 25 is 45, plus 30 is 75, plus 35 is 110, plus 40 is 150, plus 30 is 180. The sum is 180 and there are 6 nights, so the mean is 180 divided by 6, which is 30 minutes.',
        'Step two, find each distance from the mean of 30. Distance is always positive, because it is a distance. From 20 the distance is 10. From 25 it is 5. From 30 it is 0. From 35 it is 5. From 40 it is 10. From the second 30 it is 0.',
        'List those six distances: 10, 5, 0, 5, 10, 0. Notice that none of them is negative. If you write minus 10 here you have measured a direction, not a distance, and the whole calculation collapses to zero.',
        'Step three, average the distances. Add them: 10 plus 5 is 15, plus 0 is 15, plus 5 is 20, plus 10 is 30, plus 0 is 30. The sum of the distances is 30. Divide by 6 nights: 30 divided by 6 is 5.',
        'So the MAD is 5 minutes. Read it out in words: on a typical night, Sam is about 5 minutes away from his own average of 30 minutes.',
        'Sanity check the size. The values run from 20 to 40, so distances from 30 can never be more than 10, and they cannot be less than 0. A MAD of 5 sits comfortably between 0 and 10, so it is believable. A MAD bigger than the range would be impossible.',
      ],
      answer: 'Mean 30 minutes, MAD 5 minutes',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-measure-of-center',
      kind: 'try_yourself',
      problem:
        'Seven friends sent these numbers of text messages yesterday: 8, 10, 10, 12, 14, 16, 70. The mean is 20, the median is 12, the mode is 10 and the range is 62. Which measure best describes a typical value for this group?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mean, 20, because it is the only measure that uses every value' },
        { id: 'b', text: 'The median, 12, because the single value of 70 pulls the mean far above most of the data', correct: true },
        { id: 'c', text: 'The range, 62, because it covers the whole data set' },
        { id: 'd', text: 'The mode, 10, because it is the only value that repeats' },
      ],
      expectedAnswer: 'The median, 12, because the single value of 70 pulls the mean far above most of the data',
      hints: [
        'Look at the seven values and ask how many of them are actually close to 20.',
        'One value sits far from the rest. Which measure of center does an outlier drag, and which one barely notices it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compute-mad-mcq',
      kind: 'try_yourself',
      problem:
        'Six students did these numbers of push-ups: 5, 7, 9, 11, 13, 15. The mean is 10. What is the mean absolute deviation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3', correct: true },
        { id: 'b', text: '18' },
        { id: 'c', text: '10' },
        { id: 'd', text: '0' },
      ],
      expectedAnswer: '3',
      hints: [
        'Find how far each of the six values sits from 10, and keep every distance positive.',
        'The distances are 5, 3, 1, 1, 3, 5. Add them, then divide by how many values there are.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-median-even',
      kind: 'try_yourself',
      problem:
        'A soccer team scored these numbers of goals in six games: 2, 3, 3, 5, 6, 9. What is the median? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'The list is already in order. Count how many values there are, and decide whether there is one middle value or two.',
        'Six values means the two middle ones are the 3rd and 4th, which are 3 and 5. The median is the average of those two.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mad-without-absolute-value',
      kind: 'misconception_check',
      question:
        'A student finds the MAD of 3, 5, 7, 9 by subtracting the mean from each value and averaging the results. The mean is 6, and the student gets an answer of 0. What went wrong?',
      commonErrors: [
        {
          answer: '0',
          misconception:
            'Keeping the signs on the differences, so the values below the mean cancel the values above it and the total is always zero.',
          correctsTo:
            'The mean is 6, and the signed differences are minus 3, minus 1, plus 1 and plus 3, which really do add to 0. That happens for EVERY data set, which is a clue that this cannot be the calculation. MAD asks for distance, and distance is never negative, so use the absolute values: 3, 1, 1, 3. Those add to 8, and 8 divided by 4 is 2. The MAD is 2.',
        },
        {
          answer: 'The median of 2, 3, 3, 5, 6, 9 is 3.',
          misconception:
            'With an even number of values, grabbing the value just left of the middle instead of averaging the two middle values.',
          correctsTo:
            'Six values have no single middle. The two middle values are the 3rd and the 4th, which are 3 and 5. Average them: 3 plus 5 is 8, and 8 divided by 2 is 4. The median is 4, and notice that the median does not have to be a value that appears in the list at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean is the sum divided by the count; median is the middle of the ORDERED list, averaging the two middle values when the count is even; mode is the value that repeats most.',
        'Range is the largest value minus the smallest, and it uses only those two numbers.',
        'MAD has three steps: find the mean, find each distance from the mean as a positive number, then average those distances.',
        'Never keep the signs when finding MAD. The signed differences always add to zero, for every data set.',
        'An outlier drags the mean and barely moves the median, so report the median as the typical value when one is present.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Measures of Center & Variability' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
