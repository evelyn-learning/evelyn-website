/**
 * ACT — Math / Statistics & Probability: mean, median, mode, weighted
 * averages, counting, and basic probability.
 *
 * This category is standalone (no passage), calculator-allowed, and almost
 * entirely formulaic — a handful of repeatable moves rather than deep
 * content knowledge. Pace is ~60 seconds per question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_STATISTICS_PROBABILITY: LessonPlan = {
  id: 'evelyn.testprep.act.statistics-probability.v1',
  title: 'Statistics & Probability: Mean, Median, Mode, Weighted Averages & Counting',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.statistics-probability',
      standard: 'ACT-2.10',
      description:
        'Compute mean, median, mode, and weighted averages, and solve basic counting and probability problems that appear on ACT Math.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 19,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe Statistics & Probability as one of the fastest categories to master on ACT Math — pure arithmetic, no surprises once you know the moves.',
      script:
        'Statistics & Probability shows up on roughly 8 of the 60 ACT Math questions — mean, median, mode, weighted averages, counting, and basic probability. None of it requires a formula sheet; it\'s four or five repeatable moves. At about 60 seconds a question, today\'s goal is to make those moves automatic so this category becomes free points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-tendency-and-counting',
      kind: 'concept',
      goal: 'The core moves: mean vs. median vs. mode, weighted averages, the "find the score I need" algebra, the counting principle, and basic probability — plus the traps for each.',
      keyIdeas: [
        'MEAN = sum of values ÷ number of values. This is the ACT\'s default "average" unless a question says otherwise.',
        'MEDIAN = the middle value after sorting least to greatest. Odd count → the single middle value; even count → average the two middle values. Forgetting to sort first is the #1 median trap.',
        'MODE = the value(s) that appear most often. A data set can have no mode, one mode, or several modes — the ACT sometimes tests whether you know "no mode" is a valid answer when nothing repeats.',
        'WEIGHTED AVERAGE: when scores count for different amounts (percentages, credit hours, quantities), multiply each value by its weight (as a decimal that sums to 1) and add. Do NOT just average the raw numbers when the weights differ.',
        '"FIND THE SCORE I NEED" CLASSIC: to hit a target mean, set target average × (total count) = target sum, then subtract the sum of the known scores.',
        'FUNDAMENTAL COUNTING PRINCIPLE: when a choice is made in independent stages, multiply the number of options at each stage to get the total number of outcomes.',
        'BASIC PROBABILITY: P(event) = favorable outcomes ÷ total outcomes. For "at least one" questions, it\'s usually faster to compute 1 − P(none of the event).',
        'TRAP: a single outlier drags the mean but barely moves the median — the ACT loves testing which measure you trust.',
      ],
      vocabulary: [
        { term: 'mean', definition: 'the sum of all values divided by the number of values; the everyday "average."' },
        { term: 'weighted average', definition: 'an average where some values count more than others, combined using each value\'s weight (as a decimal).' },
        { term: 'fundamental counting principle', definition: 'multiplying the number of independent choices at each stage to find the total number of possible outcomes.' },
        { term: 'complement', definition: 'the probability that an event does NOT happen; P(event) = 1 − P(complement).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-score-needed',
      kind: 'worked_example',
      problem:
        'A student has earned scores of 80, 86, 91, and 79 on her first four tests this term. What score does she need on her fifth test to raise her average to exactly 85 across all five tests?',
      steps: [
        'Add the four known scores: 80 + 86 + 91 + 79 = 336.',
        'Set up the target total: to average 85 across 5 tests, the sum of all five scores must be 85 × 5 = 425.',
        'Solve for the missing score: 425 − 336 = 89.',
        'Sanity check: her current average is 336 ÷ 4 = 84, so needing an 89 — above both the current average and the target — to pull the average up makes sense.',
      ],
      answer: '89',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-weighted-average-trap',
      kind: 'worked_example',
      problem:
        'In a chemistry course, the midterm counts for 40% of the final grade and the final exam counts for 60%. A student scored 78 on the midterm and 90 on the final exam. What is her overall weighted average grade?',
      steps: [
        'Trap: do NOT just average 78 and 90 to get 84 — that treats both scores as equally weighted, but they aren\'t.',
        'Multiply each score by its weight as a decimal: midterm 78 × 0.40 = 31.2.',
        'Final exam: 90 × 0.60 = 54.',
        'Add the weighted pieces: 31.2 + 54 = 85.2 — different from the naive (and wrong) 84.',
      ],
      answer: '85.2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-median-even-count',
      kind: 'try_yourself',
      problem:
        'The number of hours six students volunteered last week: 5, 9, 3, 12, 7, 9. What is the median number of hours?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7' },
        { id: 'b', text: '8', correct: true },
        { id: 'c', text: '9' },
        { id: 'd', text: '3' },
      ],
      expectedAnswer: '8',
      hints: [
        'Sort the six values from least to greatest before finding the middle.',
        'With an even count of values, the median is the average of the 3rd and 4th sorted values: (7 + 9) ÷ 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-counting-principle',
      kind: 'try_yourself',
      problem:
        'A deli lets you build a sandwich by choosing 1 of 3 breads, 1 of 4 meats, and 1 of 2 cheeses. How many different sandwiches are possible?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9' },
        { id: 'b', text: '12' },
        { id: 'c', text: '20' },
        { id: 'd', text: '24', correct: true },
      ],
      expectedAnswer: '24',
      hints: [
        'Use the Fundamental Counting Principle: multiply the number of choices at each independent step.',
        '3 breads × 4 meats × 2 cheeses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-probability-complement',
      kind: 'try_yourself',
      problem:
        'Type your answer: A bag contains 6 red chips, 3 blue chips, and 3 green chips. One chip is drawn at random. What is the probability that it is NOT blue? Express your answer as a fraction in lowest terms.',
      responseFormat: 'numeric',
      expectedAnswer: '3/4',
      hints: [
        'P(not blue) = 1 − P(blue). There are 12 chips total and 3 are blue.',
        '1 − 3/12 = 9/12, which reduces to 3/4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mean-vs-median',
      kind: 'misconception_check',
      question:
        'A real-estate agent advertises that "the average home price on this street is $400,000," based on five recent sales: $150,000, $170,000, $180,000, $200,000, and $1,300,000. A buyer assumes a "typical" home on the street costs around $400,000. What went wrong?',
      commonErrors: [
        {
          answer: 'Assuming a typical home costs about $400,000 because that\'s the mean',
          misconception: 'Treating the mean as if it represents a typical/central value even when one extreme outlier ($1,300,000) is present.',
          correctsTo: 'Use the median when outliers are present: sorted, the middle value here is $180,000 — much closer to what most homes actually sold for. The mean gets pulled toward extreme values; the median resists them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mean = sum ÷ count; sort the data first for median — average the two middle values when the count is even.',
        'Weighted average ≠ simple average: multiply each score by its weight (as a decimal), then add — never just average the raw numbers when weights differ.',
        'Fundamental Counting Principle: multiply the number of independent choices at each step to count total outcomes.',
        'A single outlier can drag the mean far from the "typical" value while barely moving the median; for "at least one" probability questions, it\'s often fastest to compute 1 − P(none).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.10', cedTitle: 'Statistics & Probability' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
