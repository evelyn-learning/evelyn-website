/**
 * Grade 6 Math — Statistics: Distributions, Center & Spread: Measures of
 * Center.
 *
 * CONCEPT-LED lesson for the m6math fan-out (row 10.3). The student already
 * knows how to build a dot plot or histogram (row 10.2); this lesson gives
 * them two numbers that summarize a data set instead of drawing it: the mean
 * and the median (CCSS 6.SP.A.3/B.5). Computing each is the easy half. The
 * real content is judgment: an outlier drags the mean toward itself, while
 * the median, which only depends on order, barely moves — so a data set with
 * an outlier is usually better described by its median, and a data set with
 * no outlier is described well by either. Two traps this plan is built to
 * kill: reporting the mean as "typical" when one extreme value has pulled it
 * away from where the data actually sits, and, when a data set has an even
 * number of values, treating one of the two middle values as the median
 * instead of averaging them.
 *
 * SCOPE GUARD: Grade 6 row 10.3 finds and interprets the mean and median of a
 * single data set, and teaches the student to choose the more appropriate one
 * when an outlier is present. It never computes range or interquartile range
 * and never builds a box plot — those measures of spread belong to row 10.4,
 * which follows this lesson and is named here only as "what comes next," with
 * no numbers attached. It never builds a dot plot, histogram, or any other
 * display — that is row 10.2, which this lesson assumes the student has
 * already done. It never samples from a population, compares two data sets,
 * or draws an inference from a sample — that is Grade 7 (m7math, Statistics &
 * Sampling). Every value in every data set in this lesson is a nonnegative
 * number small enough to add and order by hand; nothing here requires a
 * calculator or produces a negative result.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U10_MEASURES_OF_CENTER: LessonPlan = {
  id: 'evelyn.ms.m6math.measures-of-center.v1',
  title: 'Measures of Center',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.measures-of-center',
      standard: 'M6MATH-10.3',
      description:
        "Find and interpret the mean and median of a data set as measures of center; choose the more appropriate measure given the data's shape (CCSS 6.SP.A.3/B.5).",
    },
  ],
  prerequisites: ['m6math.dot-plots-and-histograms'],
  followUps: ['m6math.measures-of-spread-and-summarizing-data'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one unusual value can make the mean say something no one in the group actually experiences, to motivate why the choice of measure matters.',
      script:
        'Five friends compare how much allowance they get each week: $5, $6, $6, $7, and $8. That is pretty even, so it feels fair to say the group typically gets around $6 or $7 a week. Now a sixth friend joins the group. Her allowance is $50 a week, because her grandparents send extra money for her savings account. Add her number in with the rest, and the group average jumps to more than $13 a week. Does that match what any one of the first five friends actually gets? Not even close. Today you learn two different ways to describe the center of a data set, and how to tell which one is telling the truth when one number does not belong with the rest.',
      suggestedTools: ['show_stats'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mean-median-and-outliers',
      kind: 'concept',
      goal: 'Install how to find the mean and the median, what an outlier is, and how to decide which measure to trust.',
      keyIdeas: [
        'TWO WAYS TO NAME THE CENTER — the mean and the median are both single numbers that stand in for a whole data set. Both are called measures of center, and finding them is the first step toward describing what a data set looks like.',
        'FINDING THE MEAN — add up every value in the data set, then divide that total by how many values there are. The mean uses every single value, so one very unusual value pulls it toward itself.',
        'FINDING THE MEDIAN — put every value in order from least to greatest. With an odd number of values, the median is the one exactly in the middle. With an even number of values, there is no single middle value, so the median is the mean of the two middle values.',
        'AN OUTLIER IS A VALUE FAR FROM THE REST — most data sets cluster together, but sometimes one value sits far above or far below the others. That value is called an outlier.',
        'AN OUTLIER DRAGS THE MEAN BUT NOT THE MEDIAN — because the mean divides the total by the count, one extreme value changes the total enough to shift the mean noticeably, even though only one value moved. The median only cares about order, so an outlier at one end barely changes which value ends up in the middle.',
        'CHOOSING THE BETTER MEASURE — when a data set has no outlier, the mean and the median usually land close together, and either one describes the data well. When a data set has an outlier, the median usually describes the typical value better, because the mean has been pulled away from where most of the data actually sits.',
      ],
      vocabulary: [
        { term: 'mean', definition: 'the sum of every value in a data set divided by how many values there are; also called the average.' },
        { term: 'median', definition: 'the middle value of a data set once it is ordered from least to greatest; the mean of the two middle values when there is an even number of values.' },
        { term: 'outlier', definition: 'a value in a data set that is much higher or much lower than the rest of the values.' },
      ],
      suggestedTools: ['show_table', 'show_stats'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-piano-practice-no-outlier',
      kind: 'worked_example',
      problem:
        'Six kids in a music class practiced piano last night for these numbers of minutes: 12, 15, 15, 18, 20, 22. Find the mean and the median practice time.',
      steps: [
        'The values are already in order from least to greatest: 12, 15, 15, 18, 20, 22.',
        'Find the mean. Add every value: 12 + 15 + 15 + 18 + 20 + 22 = 102. Divide by how many kids there are, 6: 102 / 6 = 17 minutes.',
        'Find the median. There is an even number of values, 6, so there is no single middle value. The two middle values are the 3rd and 4th: 15 and 18. The median is their mean: (15 + 18) / 2 = 16.5 minutes.',
        'Compare the two answers to the data: the mean is 17 minutes, and the median is 16.5 minutes. They land close together, and every one of the six practice times is fairly close to both numbers, so there is no outlier pulling anything away.',
        'Check the mean by working backward: 17 x 6 = 102, which matches the total from the data. The mean and the median calculations both check out.',
      ],
      answer: 'Mean: 17 minutes; median: 16.5 minutes. Both are close together and either one describes a typical practice time well, since none of the six times is an outlier.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-backpack-prices-with-outlier',
      kind: 'worked_example',
      problem:
        'The school store lists the prices, in dollars, of six backpacks: 20, 22, 24, 25, 28, 130. One backpack is a designer brand and costs far more than the others. Find the mean and the median price, and decide which one better describes the price of a TYPICAL backpack at the store.',
      steps: [
        'The values are already in order: 20, 22, 24, 25, 28, 130.',
        'Find the mean. Add every value: 20 + 22 + 24 + 25 + 28 + 130 = 249. Divide by how many backpacks there are, 6: 249 / 6 = 41.5, so the mean price is $41.50.',
        'Find the median. There is an even number of values, 6, so average the 3rd and 4th values: 24 and 25. The median is (24 + 25) / 2 = 24.5, so the median price is $24.50.',
        'Compare both numbers to the data. Five of the six backpacks cost between $20 and $28. The mean, $41.50, is higher than every one of those five prices, because the single $130 backpack pulled it up. The median, $24.50, sits right inside that $20-$28 cluster, which is where most of the backpacks are actually priced.',
        'WRONG: reporting $41.50, the mean, as the price of a typical backpack. No backpack in the store is actually close to $41.50, except the one designer backpack that pulled the mean up. CORRECT: report $24.50, the median, because it matches where most of the prices sit, and it is not distorted by the one unusually expensive backpack.',
        'Check: the median, 24.5, sits between the two middle values 24 and 25, and both of those are inside the low cluster of prices, so the median calculation looks right.',
      ],
      answer: 'Mean: $41.50; median: $24.50. The median is the more appropriate measure here, because the $130 backpack is an outlier that pulls the mean away from where most of the prices sit.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-jumping-jacks-outlier-choice',
      kind: 'try_yourself',
      problem:
        'A P.E. teacher records how many jumping jacks seven students did in one minute: 30, 32, 33, 33, 34, 35, 95. One student is training for track and did far more than everyone else. Which measure of center best describes the number of jumping jacks a TYPICAL student in this group did?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mean, because it uses every value in the data set' },
        { id: 'b', text: 'The median, because the one very high score does not pull it away from the rest of the group', correct: true },
        { id: 'c', text: 'The mean, because dividing the total by the number of students removes the effect of the highest score' },
        { id: 'd', text: 'Neither the mean nor the median can describe a typical student once one score is unusual' },
      ],
      expectedAnswer: 'The median, because the one very high score does not pull it away from the rest of the group',
      hints: [
        'Think about what happens to the mean when one value in the data set is much larger than the rest.',
        'The median only depends on order, so one very large value near the top does not move it far. Which measure of center stays close to where most of the scores actually are?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-allowance-outlier-statement',
      kind: 'try_yourself',
      problem:
        'Six kids report their weekly allowance, in dollars: 4, 5, 5, 6, 6, 50. The $50 amount is a one-time birthday gift that got counted along with the regular allowances. Which statement about the mean and the median of this data set is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The median is affected more than the mean, because the median only looks at the values in the middle' },
        { id: 'b', text: 'The mean and the median are both close to $5, since most of the kids get a similar amount' },
        { id: 'c', text: 'The mean is the better measure here, since it is the only one that uses every amount in the data set' },
        { id: 'd', text: 'The mean is pulled up by the $50 amount, but the median stays close to the other five amounts', correct: true },
      ],
      expectedAnswer: 'The mean is pulled up by the $50 amount, but the median stays close to the other five amounts',
      hints: [
        'Work out roughly what the mean and the median would each be. Which one moves a lot once the $50 is included, and which one barely changes?',
        'The median only cares about the order of the values, not their size, so one very large amount at one end does not shift it far. The mean adds the $50 into the total and then divides it among only six kids.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-house-prices-median',
      kind: 'try_yourself',
      problem:
        'Five houses on the same street just sold for these prices, in thousands of dollars: 210, 215, 220, 225, 700. One of the five is a much larger house that sold for far more than the others. What is the median sale price, in thousands of dollars? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '220',
      hints: [
        'Put the five prices in order first (they already are). With five values, the median is the one exactly in the middle, not the mean.',
        'Count to the middle position: the third price, out of five, once they are ordered from least to greatest, is the median.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-even-median-and-mean-always-best',
      kind: 'misconception_check',
      question:
        'A student is asked to find the median of the data set 8, 9, 11, 12, 14, 15 and writes 11. A second student says the mean is always a better way to describe a typical value than the median. What went wrong in each case?',
      commonErrors: [
        {
          answer: '11',
          misconception:
            'Believing that with an even number of values, the median is just one of the two middle values, instead of the mean of both of them.',
          correctsTo:
            'With six values in order (8, 9, 11, 12, 14, 15), there is no single middle value. The two middle values are 11 and 12. The median is their mean: (11 + 12) / 2 = 11.5, not 11.',
        },
        {
          answer: 'The mean is always a better way to describe a typical value than the median.',
          misconception:
            'Assuming the mean is automatically the stronger measure because it uses every value in the data set, without checking whether an outlier is pulling it away from where most of the data actually sits.',
          correctsTo:
            'The mean does use every value, and that is exactly why one very large or very small value can drag it away from the rest of the data. When a data set has an outlier, the median usually describes the typical value better, because it depends only on the order of the values, not on how far away the extreme value sits. Compute both, look at where most of the data actually sits, and choose the one that matches it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The mean is the sum of every value in a data set divided by how many values there are.',
        'The median is the middle value once the data set is in order; with an even number of values, it is the mean of the two middle values.',
        'Both the mean and the median are called measures of center.',
        'An outlier is a value far above or far below the rest of the data.',
        'An outlier drags the mean toward itself, but the median barely moves, because the median depends only on order.',
        'When a data set has no outlier, the mean and the median usually land close together and either one works well; when it has an outlier, the median usually describes the typical value better.',
        'Finding the center is the first step in describing a data set; how spread out it is comes next.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Measures of Center' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
