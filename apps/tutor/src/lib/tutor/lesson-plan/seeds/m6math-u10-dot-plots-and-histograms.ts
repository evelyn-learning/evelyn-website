/**
 * Grade 6 Math — Statistics: Distributions, Center & Spread: Dot Plots &
 * Histograms.
 *
 * CONCEPT-LED row in the m6math fan-out. The student already knows what a
 * data set is (row 10.1); this lesson gives them two ways to put that data
 * set on a number line and, more importantly, a reason to pick one over the
 * other (CCSS 6.SP.B.4). The load-bearing idea is not "how do I draw a dot"
 * or "how do I draw a bar" — it is the trade-off: a dot plot keeps every
 * value visible and suits a small data set, while a histogram groups values
 * into equal-width intervals and suits a larger or more spread-out data set,
 * at the cost of losing the individual values inside each interval. Every
 * data set in this lesson is described as an explicit list of numbers, and
 * every display is described in words precise enough to draw from: the
 * intervals, the count in each, and both axis labels, since the student
 * cannot see a picture. Two traps this plan is built to kill: reading a
 * histogram bar as if it names one exact value instead of a whole interval,
 * and treating one display as always correct regardless of the data set.
 *
 * SCOPE GUARD: This lesson displays ONE numerical data set as a dot plot or
 * a histogram on a number line, and teaches the trade-off between the two:
 * a dot plot keeps every individual value visible and suits a small data
 * set, while a histogram groups values into equal-width intervals and suits
 * a larger or more spread-out data set, at the cost of losing the individual
 * values inside each interval. It never computes a mean, median, or any
 * other measure of center — choosing and computing those is row 10.3. It
 * never discusses range, interquartile range, or box plots — those belong
 * to row 10.4. It never compares two different data sets or two populations
 * to each other; comparing two populations is Grade 7. No worked example or
 * try_yourself item in this plan involves more than one data set.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U10_DOT_PLOTS_AND_HISTOGRAMS: LessonPlan = {
  id: 'evelyn.ms.m6math.dot-plots-and-histograms.v1',
  title: 'Dot Plots & Histograms',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.dot-plots-and-histograms',
      standard: 'M6MATH-10.2',
      description:
        'Display a numerical data set using dot plots and histograms on a number line. (CCSS 6.SP.B.4)',
    },
  ],
  prerequisites: ['m6math.statistical-questions'],
  followUps: ['m6math.measures-of-center'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel why a small data set and a large, spread-out data set call for different displays, before naming either one.',
      script:
        'Picture your table of 10 friends at lunch, each one telling you how many hours of sleep they got last night. There are only 10 answers, and most of the numbers repeat, so you could mark every single answer on a number line, one dot for each friend. Now picture the whole grade, 300 students, all reporting their sleep hours, with almost every student giving a different exact number. Marking all 300 exact answers as separate dots would turn into a solid smear you could not read. Today you learn two ways to put a numerical data set on a number line: one that keeps every single value, and one that groups values together to keep the picture readable, and how to tell which one a data set actually calls for.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dot-plots-vs-histograms',
      kind: 'concept',
      goal: 'Install precise definitions of a dot plot and a histogram, and turn the choice between them into a reasoned trade-off based on the size and spread of the data set, not a guess.',
      keyIdeas: [
        'WHAT A DOT PLOT SHOWS — a dot plot is a number line where every value in the data set gets its own dot placed above its spot on the line. When a value shows up more than once, its dots stack directly on top of each other. Every single value in the original data set is still visible; nothing is combined or thrown away.',
        'WHAT A HISTOGRAM SHOWS — a histogram breaks the number line into equal-width intervals that sit side by side with no gaps, then draws a bar above each interval. The height of a bar is the count of values that land inside that interval. A histogram groups values together, so you can see how many values fall in an interval, but you can no longer see the exact values themselves.',
        'THE TRADE-OFF — WHEN EACH ONE FITS — a dot plot works well for a small data set with only a few different values, because every one fits on the line without crowding. A histogram works well for a larger data set, or one where the values are spread across many different numbers, because grouping keeps the picture readable. That readability has a cost: once values are grouped into an interval, you cannot tell them apart from each other inside that interval anymore.',
        'BOTH DISPLAYS SHARE ONE HORIZONTAL NUMBER LINE — the horizontal axis on a dot plot or a histogram is always labeled with the quantity being measured, such as minutes, pets, or push-ups, marked with an even scale from one end to the other. A histogram also labels its other axis with how many values fall in each interval, usually called a count.',
        'HISTOGRAM INTERVALS MUST BE EQUAL WIDTH AND MUST NOT OVERLAP — every interval in one histogram covers the same number of units, such as all ten minutes wide, and each value belongs to exactly one interval. That is why the bars sit side by side touching each other, with no gaps and no value counted twice.',
        'CHECK YOUR DISPLAY BY COUNTING — the total number of dots in a dot plot, or the sum of every bar height in a histogram, must equal the total number of values in the data set. If those numbers do not match, a value was missed, miscounted, or placed in the wrong interval.',
      ],
      vocabulary: [
        { term: 'dot plot', definition: 'a display on a number line where each value in a data set gets its own dot, with repeated values stacked on top of each other.' },
        { term: 'histogram', definition: 'a display where a number line is broken into equal-width intervals and a bar is drawn above each interval, as tall as the count of values inside it.' },
        { term: 'interval', definition: 'one equal-width chunk of the number line in a histogram; every value in the data set belongs to exactly one interval.' },
        { term: 'count', definition: 'the number of values that land in a given interval or at a given value; the height of a histogram bar, or the number of dots stacked at one spot.' },
      ],
      suggestedTools: ['show_diagram', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pets-dot-plot',
      kind: 'worked_example',
      problem:
        "Ms. Rivera asks her 12 students how many pets they have. In the order she asked them, the answers are: 3, 1, 2, 0, 2, 4, 1, 3, 2, 3, 4, 4. Display this data set on a number line.",
      steps: [
        'There are only 12 values here, and just five different numbers show up: 0, 1, 2, 3, 4. A small data set like this fits well on a dot plot, where every value gets to keep its own dot.',
        'Count how many times each value appears in the list. Value 0 appears 1 time. Value 1 appears 2 times. Value 2 appears 3 times. Value 3 appears 3 times. Value 4 appears 3 times.',
        "Draw a number line labeled 'Number of pets' with the whole numbers 0 through 4 marked, evenly spaced from left to right.",
        'Above 0, place 1 dot. Above 1, place 2 dots, stacked directly on top of each other. Above 2, place 3 dots. Above 3, place 3 dots. Above 4, place 3 dots.',
        'Check by counting every dot on the plot: 1 + 2 + 3 + 3 + 3 = 12, which matches the 12 students Ms. Rivera asked. Every one of the original 12 answers is still visible as its own dot; none of them were grouped together.',
      ],
      answer: 'A dot plot labeled "Number of pets" with 1 dot above 0, 2 dots above 1, 3 dots above 2, 3 dots above 3, and 3 dots above 4.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-homework-histogram',
      kind: 'worked_example',
      problem:
        'Twenty students in Mr. Okafor\'s class report how many minutes they spent on homework last night: 12, 15, 18, 21, 23, 25, 27, 29, 31, 33, 34, 36, 38, 39, 41, 44, 47, 49, 52, 58. Display this data set on a number line.',
      steps: [
        'First decide which display fits. There are 20 values here, spread from 12 minutes all the way to 58 minutes, and almost every student reports a different exact number. A dot plot would need close to 20 separate marks strung along a very long number line, which would be hard to read. Group the values into equal-width intervals instead, and build a histogram.',
        'Choose intervals that are the same width and do not overlap. Ten-minute intervals work well here: 10-19, 20-29, 30-39, 40-49, 50-59.',
        'Sort each value into its interval and count. 10-19: 12, 15, 18, which is 3 values. 20-29: 21, 23, 25, 27, 29, which is 5 values. 30-39: 31, 33, 34, 36, 38, 39, which is 6 values. 40-49: 41, 44, 47, 49, which is 4 values. 50-59: 52, 58, which is 2 values.',
        "Draw a number line labeled 'Minutes spent on homework' marked off in the five intervals from the step above, sitting side by side with no gaps between them. Label the other axis 'Number of students.'",
        'Draw a bar above each interval as tall as its count: the bar above 10-19 is 3 units tall, the bar above 20-29 is 5 units tall, the bar above 30-39 is 6 units tall, the bar above 40-49 is 4 units tall, and the bar above 50-59 is 2 units tall.',
        'WRONG: reading the bar above 30-39 as if it says exactly 6 students spent exactly 35 minutes on homework. CORRECT: the bar only says that 6 students spent somewhere between 30 and 39 minutes; their exact minutes are no longer visible once they are grouped into that interval.',
        'Check by adding every bar height: 3 + 5 + 6 + 4 + 2 = 20, which matches the 20 students Mr. Okafor asked.',
      ],
      answer: 'A histogram labeled "Minutes spent on homework" with bars of height 3, 5, 6, 4, and 2 above the intervals 10-19, 20-29, 30-39, 40-49, and 50-59.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-the-display',
      kind: 'try_yourself',
      problem:
        'A coach records the number of goals scored by each of 9 players this season: 2, 5, 3, 2, 4, 3, 2, 5, 3. Which type of display best fits this data set, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A dot plot, because there are only 9 values and just a few different scores, so every value can be shown as its own dot.', correct: true },
        { id: 'b', text: 'A histogram, because 9 values are too many to show as individual dots.' },
        { id: 'c', text: 'A dot plot, because every data set must always be shown as dots, never grouped into intervals.' },
        { id: 'd', text: 'A histogram, because goals scored can only ever be grouped into intervals, never listed one at a time.' },
      ],
      expectedAnswer: 'A dot plot, because there are only 9 values and just a few different scores, so every value can be shown as its own dot.',
      hints: [
        'Count how many total values are in the goal list, and how many different scores appear among them. Both numbers are small.',
        'A dot plot fits a small data set with only a few different values, because every one fits on the line without crowding. Look at how many values and how many different scores this data set actually has.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-read-the-histogram',
      kind: 'try_yourself',
      problem:
        'A gym teacher records how many push-ups each of 24 students can do. The data is shown as a histogram with four equal intervals, each 10 push-ups wide: 0-9, 10-19, 20-29, and 30-39. The bar above 0-9 is 4 units tall. The bar above 10-19 is 9 units tall. The bar above 20-29 is 8 units tall. The bar above 30-39 is 3 units tall. Which statement about this histogram is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly 9 students can do exactly 15 push-ups.' },
        { id: 'b', text: 'The tallest bar means most students can do zero push-ups.' },
        { id: 'c', text: '9 students can do somewhere between 10 and 19 push-ups, but the histogram does not show their exact counts.', correct: true },
        { id: 'd', text: 'The histogram shows that no student can do fewer than 10 push-ups.' },
      ],
      expectedAnswer: '9 students can do somewhere between 10 and 19 push-ups, but the histogram does not show their exact counts.',
      hints: [
        'Find the tallest bar first, and read which interval it sits above rather than assuming it is the interval with the smallest numbers.',
        'A histogram bar tells you how many values fall somewhere inside that whole interval. It never tells you the exact value for any one student.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-count-the-dots',
      kind: 'try_yourself',
      problem:
        'Fifteen students report how many books they read last month, in the order they were asked: 1, 2, 2, 3, 1, 4, 2, 3, 3, 2, 1, 4, 3, 2, 3. If this data set is displayed as a dot plot, how many dots would be stacked above the value 3? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Go through the list one number at a time and make a tally mark every time you see a 3.',
        'Count the tally marks for 3. That count is the number of dots stacked above 3 in the dot plot.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bar-height-and-total-count',
      kind: 'misconception_check',
      question:
        'One student looks at a dot plot where the value 3 has the most dots stacked above it, 4 dots, and says 4 students were surveyed in total. Another student looks at a histogram bar of height 5 above the interval 20-29 and says 5 students spent exactly 25 minutes on homework. What went wrong in each case?',
      commonErrors: [
        {
          answer: '4 students were surveyed in total.',
          misconception: 'Treating the height of the tallest single stack of dots as the total number of values in the whole data set.',
          correctsTo:
            'The total number of values in a dot plot is the sum of every stack, not just the tallest one. If 3 has 4 dots, there are still more dots above the other values on the line, and all of those dots have to be added together to get the total count of students surveyed.',
        },
        {
          answer: '5 students spent exactly 25 minutes on homework.',
          misconception: 'Reading a histogram bar as the count for one exact value inside the interval, instead of the count for the whole interval.',
          correctsTo:
            'A histogram bar of height 5 above 20-29 means 5 students spent somewhere between 20 and 29 minutes, not that all 5 spent exactly 25 minutes. Once values are grouped into an interval, their exact numbers are no longer shown; only the total count for that whole interval remains visible.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A dot plot places one dot per value on a number line, stacking repeated values, and keeps every individual value visible.',
        'A histogram groups a number line into equal-width, non-overlapping intervals and draws a bar as tall as the count of values in each one.',
        'A dot plot suits a small data set with few different values; a histogram suits a larger or more spread-out data set, at the cost of losing individual values inside each interval.',
        'Both displays label the horizontal axis with the quantity measured; a histogram also labels the other axis with the count in each interval.',
        'A histogram bar tells you how many values fall somewhere in that interval, never the exact value for any one item inside it.',
        'Check a finished display by counting: total dots, or the sum of every bar height, must equal the total number of values in the data set.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Dot Plots & Histograms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
