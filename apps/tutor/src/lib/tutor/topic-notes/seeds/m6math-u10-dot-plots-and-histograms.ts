/**
 * Grade 6 Math — Unit 10 CED 10.2: Dot Plots & Histograms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.dot-plots-and-histograms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U10_DOT_PLOTS_AND_HISTOGRAMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.dot-plots-and-histograms.v1',
  course: 'Grade 6 Math',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Dot Plots & Histograms',
  planId: 'evelyn.ms.m6math.dot-plots-and-histograms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.dot-plots-and-histograms.v1' }],
  theory: [
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'What a dot plot shows', content: `WHAT A DOT PLOT SHOWS — a dot plot is a number line where every value in the data set gets its own dot placed above its spot on the line. When a value shows up more than once, its dots stack directly on top of each other. Every single value in the original data set is still visible; nothing is combined or thrown away.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'What a histogram shows', content: `WHAT A HISTOGRAM SHOWS — a histogram breaks the number line into equal-width intervals that sit side by side with no gaps, then draws a bar above each interval. The height of a bar is the count of values that land inside that interval. A histogram groups values together, so you can see how many values fall in an interval, but you can no longer see the exact values themselves.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'The trade-off', content: `THE TRADE-OFF — WHEN EACH ONE FITS — a dot plot works well for a small data set with only a few different values, because every one fits on the line without crowding. A histogram works well for a larger data set, or one where the values are spread across many different numbers, because grouping keeps the picture readable. That readability has a cost: once values are grouped into an interval, you cannot tell them apart from each other inside that interval anymore.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'Both displays share one horizontal number line', content: `BOTH DISPLAYS SHARE ONE HORIZONTAL NUMBER LINE — the horizontal axis on a dot plot or a histogram is always labeled with the quantity being measured, such as minutes, pets, or push-ups, marked with an even scale from one end to the other. A histogram also labels its other axis with how many values fall in each interval, usually called a count.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'Histogram intervals must be equal width and must not overlap', content: `HISTOGRAM INTERVALS MUST BE EQUAL WIDTH AND MUST NOT OVERLAP — every interval in one histogram covers the same number of units, such as all ten minutes wide, and each value belongs to exactly one interval. That is why the bars sit side by side touching each other, with no gaps and no value counted twice.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'framework', title: 'Check your display by counting', content: `CHECK YOUR DISPLAY BY COUNTING — the total number of dots in a dot plot, or the sum of every bar height in a histogram, must equal the total number of values in the data set. If those numbers do not match, a value was missed, miscounted, or placed in the wrong interval.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'definition', title: 'dot plot', content: `a display on a number line where each value in a data set gets its own dot, with repeated values stacked on top of each other.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'definition', title: 'histogram', content: `a display where a number line is broken into equal-width intervals and a bar is drawn above each interval, as tall as the count of values inside it.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'definition', title: 'interval', content: `one equal-width chunk of the number line in a histogram; every value in the data set belongs to exactly one interval.` },
    { loId: 'm6math.dot-plots-and-histograms', kind: 'definition', title: 'count', content: `the number of values that land in a given interval or at a given value; the height of a histogram bar, or the number of dots stacked at one spot.` },
  ],
  methods: [
    {
      title: 'Worked pets dot plot',
      steps: [
        `There are only 12 values here, and just five different numbers show up: 0, 1, 2, 3, 4. A small data set like this fits well on a dot plot, where every value gets to keep its own dot.`,
        `Count how many times each value appears in the list. Value 0 appears 1 time. Value 1 appears 2 times. Value 2 appears 3 times. Value 3 appears 3 times. Value 4 appears 3 times.`,
        `Draw a number line labeled 'Number of pets' with the whole numbers 0 through 4 marked, evenly spaced from left to right.`,
        `Above 0, place 1 dot. Above 1, place 2 dots, stacked directly on top of each other. Above 2, place 3 dots. Above 3, place 3 dots. Above 4, place 3 dots.`,
        `Check by counting every dot on the plot: 1 + 2 + 3 + 3 + 3 = 12, which matches the 12 students Ms. Rivera asked. Every one of the original 12 answers is still visible as its own dot; none of them were grouped together.`,
      ],
      example: { problem: `Ms. Rivera asks her 12 students how many pets they have. In the order she asked them, the answers are: 3, 1, 2, 0, 2, 4, 1, 3, 2, 3, 4, 4. Display this data set on a number line.`, solution: `A dot plot labeled "Number of pets" with 1 dot above 0, 2 dots above 1, 3 dots above 2, 3 dots above 3, and 3 dots above 4.` },
      relatedLoIds: ['m6math.dot-plots-and-histograms'],
    },
    {
      title: 'Worked homework histogram',
      steps: [
        `First decide which display fits. There are 20 values here, spread from 12 minutes all the way to 58 minutes, and almost every student reports a different exact number. A dot plot would need close to 20 separate marks strung along a very long number line, which would be hard to read. Group the values into equal-width intervals instead, and build a histogram.`,
        `Choose intervals that are the same width and do not overlap. Ten-minute intervals work well here: 10-19, 20-29, 30-39, 40-49, 50-59.`,
        `Sort each value into its interval and count. 10-19: 12, 15, 18, which is 3 values. 20-29: 21, 23, 25, 27, 29, which is 5 values. 30-39: 31, 33, 34, 36, 38, 39, which is 6 values. 40-49: 41, 44, 47, 49, which is 4 values. 50-59: 52, 58, which is 2 values.`,
        `Draw a number line labeled 'Minutes spent on homework' marked off in the five intervals from the step above, sitting side by side with no gaps between them. Label the other axis 'Number of students.'`,
        `Draw a bar above each interval as tall as its count: the bar above 10-19 is 3 units tall, the bar above 20-29 is 5 units tall, the bar above 30-39 is 6 units tall, the bar above 40-49 is 4 units tall, and the bar above 50-59 is 2 units tall.`,
        `WRONG: reading the bar above 30-39 as if it says exactly 6 students spent exactly 35 minutes on homework. CORRECT: the bar only says that 6 students spent somewhere between 30 and 39 minutes; their exact minutes are no longer visible once they are grouped into that interval.`,
        `Check by adding every bar height: 3 + 5 + 6 + 4 + 2 = 20, which matches the 20 students Mr. Okafor asked.`,
      ],
      example: { problem: `Twenty students in Mr. Okafor's class report how many minutes they spent on homework last night: 12, 15, 18, 21, 23, 25, 27, 29, 31, 33, 34, 36, 38, 39, 41, 44, 47, 49, 52, 58. Display this data set on a number line.`, solution: `A histogram labeled "Minutes spent on homework" with bars of height 3, 5, 6, 4, and 2 above the intervals 10-19, 20-29, 30-39, 40-49, and 50-59.` },
      relatedLoIds: ['m6math.dot-plots-and-histograms'],
    },
  ],
  pointers: [
    { content: `Students often say "4 students were surveyed in total." — The total number of values in a dot plot is the sum of every stack, not just the tallest one. If 3 has 4 dots, there are still more dots above the other values on the line, and all of those dots have to be added together to get the total count of students surveyed.`, kind: 'common-error' },
    { content: `Students often say "5 students spent exactly 25 minutes on homework." — A histogram bar of height 5 above 20-29 means 5 students spent somewhere between 20 and 29 minutes, not that all 5 spent exactly 25 minutes. Once values are grouped into an interval, their exact numbers are no longer shown; only the total count for that whole interval remains visible.`, kind: 'common-error' },
    { content: `A dot plot places one dot per value on a number line, stacking repeated values, and keeps every individual value visible.`, kind: 'tip' },
    { content: `A histogram groups a number line into equal-width, non-overlapping intervals and draws a bar as tall as the count of values in each one.`, kind: 'tip' },
    { content: `A dot plot suits a small data set with few different values; a histogram suits a larger or more spread-out data set, at the cost of losing individual values inside each interval.`, kind: 'tip' },
    { content: `Both displays label the horizontal axis with the quantity measured; a histogram also labels the other axis with the count in each interval.`, kind: 'tip' },
    { content: `A histogram bar tells you how many values fall somewhere in that interval, never the exact value for any one item inside it.`, kind: 'tip' },
    { content: `Check a finished display by counting: total dots, or the sum of every bar height, must equal the total number of values in the data set.`, kind: 'tip' },
  ],
};
