/**
 * ACT — Unit 2 CED 2.10: Statistics & Probability.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.statistics-probability.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_STATISTICS_PROBABILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.statistics-probability.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.10',
  cedTitle: 'Statistics & Probability',
  planId: 'evelyn.testprep.act.statistics-probability.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.statistics-probability.v1' }],
  theory: [
    { loId: 'act.statistics-probability', content: `MEAN = sum of values ÷ number of values. This is the ACT's default "average" unless a question says otherwise.` },
    { loId: 'act.statistics-probability', content: `MEDIAN = the middle value after sorting least to greatest. Odd count → the single middle value; even count → average the two middle values. Forgetting to sort first is the #1 median trap.` },
    { loId: 'act.statistics-probability', content: `MODE = the value(s) that appear most often. A data set can have no mode, one mode, or several modes — the ACT sometimes tests whether you know "no mode" is a valid answer when nothing repeats.` },
    { loId: 'act.statistics-probability', content: `WEIGHTED AVERAGE: when scores count for different amounts (percentages, credit hours, quantities), multiply each value by its weight (as a decimal that sums to 1) and add. Do NOT just average the raw numbers when the weights differ.` },
    { loId: 'act.statistics-probability', content: `"FIND THE SCORE I NEED" CLASSIC: to hit a target mean, set target average × (total count) = target sum, then subtract the sum of the known scores.` },
    { loId: 'act.statistics-probability', content: `FUNDAMENTAL COUNTING PRINCIPLE: when a choice is made in independent stages, multiply the number of options at each stage to get the total number of outcomes.` },
    { loId: 'act.statistics-probability', content: `BASIC PROBABILITY: P(event) = favorable outcomes ÷ total outcomes. For "at least one" questions, it's usually faster to compute 1 − P(none of the event).` },
    { loId: 'act.statistics-probability', content: `TRAP: a single outlier drags the mean but barely moves the median — the ACT loves testing which measure you trust.` },
    { loId: 'act.statistics-probability', kind: 'definition', title: 'mean', content: 'the sum of all values divided by the number of values; the everyday "average."' },
    { loId: 'act.statistics-probability', kind: 'definition', title: 'weighted average', content: `an average where some values count more than others, combined using each value's weight (as a decimal).` },
    { loId: 'act.statistics-probability', kind: 'definition', title: 'fundamental counting principle', content: `multiplying the number of independent choices at each stage to find the total number of possible outcomes.` },
    { loId: 'act.statistics-probability', kind: 'definition', title: 'complement', content: 'the probability that an event does NOT happen; P(event) = 1 − P(complement).' },
  ],
  methods: [
    {
      title: 'Worked score needed',
      steps: [
        'Add the four known scores: 80 + 86 + 91 + 79 = 336.',
        `Set up the target total: to average 85 across 5 tests, the sum of all five scores must be 85 × 5 = 425.`,
        'Solve for the missing score: 425 − 336 = 89.',
        `Sanity check: her current average is 336 ÷ 4 = 84, so needing an 89 — above both the current average and the target — to pull the average up makes sense.`,
      ],
      example: { problem: `A student has earned scores of 80, 86, 91, and 79 on her first four tests this term. What score does she need on her fifth test to raise her average to exactly 85 across all five tests?`, solution: '89' },
      relatedLoIds: ['act.statistics-probability'],
    },
    {
      title: 'Worked weighted average trap',
      steps: [
        `Trap: do NOT just average 78 and 90 to get 84 — that treats both scores as equally weighted, but they aren't.`,
        'Multiply each score by its weight as a decimal: midterm 78 × 0.40 = 31.2.',
        'Final exam: 90 × 0.60 = 54.',
        `Add the weighted pieces: 31.2 + 54 = 85.2 — different from the naive (and wrong) 84.`,
      ],
      example: { problem: `In a chemistry course, the midterm counts for 40% of the final grade and the final exam counts for 60%. A student scored 78 on the midterm and 90 on the final exam. What is her overall weighted average grade?`, solution: '85.2' },
      relatedLoIds: ['act.statistics-probability'],
    },
  ],
  pointers: [
    { content: `Use the median when outliers are present: sorted, the middle value here is $180,000 — much closer to what most homes actually sold for. The mean gets pulled toward extreme values; the median resists them.`, kind: 'common-error' },
    { content: `Mean = sum ÷ count; sort the data first for median — average the two middle values when the count is even.`, kind: 'tip' },
    { content: `Weighted average ≠ simple average: multiply each score by its weight (as a decimal), then add — never just average the raw numbers when weights differ.`, kind: 'tip' },
    { content: `Fundamental Counting Principle: multiply the number of independent choices at each step to count total outcomes.`, kind: 'tip' },
    { content: `A single outlier can drag the mean far from the "typical" value while barely moving the median; for "at least one" probability questions, it's often fastest to compute 1 − P(none).`, kind: 'tip' },
    { content: `Weighted-average questions often hide the weights as *counts*, not percents: "12 students averaged 80, 18 students averaged 90." Weight by 12 and 18 — total = (12·80 + 18·90)/30 = 86, not 85. Any time two groups of different sizes are averaged, the naive midpoint is a trap answer.`, kind: 'gotcha' },
    { content: `Watch for "the average of the *remaining*" or "after one value is removed." Work in sums: new sum = old sum − removed value, and drop the count by 1. Don't try to adjust the average directly.`, kind: 'tip' },
    { content: `If the ACT asks for a value with "no mode" or "exactly two modes," remember mode counts *frequency*, not size. A set where every value appears once has no mode — "no mode" is a legitimate answer choice, not a trick.`, kind: 'edge-case' },
    { content: `Median of an even count: average the two middle numbers — the answer need not be a value in the list, and it can be a decimal even when all data are integers. In 5, 9, 3, 12, 7, 9 → sorted 3,5,7,9,9,12 → (7+9)/2 = 8.`, kind: 'common-error' },
    { content: `"Without replacement" changes the second denominator. P(two reds) from 6 red of 12 = (6/12)(5/11), not (6/12)(6/12). Scan for "replaced," "put back," or "a second chip is drawn" before multiplying.`, kind: 'gotcha' },
    { content: `Counting principle = multiply only when choices are *independent stages*. If a question says "no repeats" (e.g., 4 people in 4 seats), the options shrink: 4·3·2·1, not 4·4·4·4.`, kind: 'edge-case' },
    { content: `Probability answers must be between 0 and 1. If you get a whole number > 1, you likely divided favorable by *unfavorable* instead of by the total. Total = all outcomes, including the favorable ones (6 red + 3 blue + 3 green = 12, not 6).`, kind: 'common-error' },
    { content: `Read "average" vs. "median" in the *question stem*, not the setup. The ACT prints a table, computes both, and rewards whichever word the stem uses — outlier-heavy data sets exist to make the other measure look plausible.`, kind: 'vocab-note' },
  ],
};
