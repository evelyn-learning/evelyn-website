/**
 * Grade 7 Math — Probability: Probability of Simple Events.
 *
 * The first probability lesson of the course (CCSS 7.SP.C.5, 7.SP.C.7a).
 * P(event) = favorable outcomes / total outcomes, the 0-to-1 scale, and the
 * complement rule. Every probability is written three ways — fraction,
 * decimal, percent — which is the same conversion skill from Unit 1.4 doing
 * new work. The trap this plan is built to kill is "two outcomes, so it must
 * be 50-50", which ignores whether the outcomes are equally likely.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U10_PROBABILITY_OF_SIMPLE_EVENTS: LessonPlan = {
  id: 'evelyn.ms.m7math.probability-of-simple-events.v1',
  title: 'Probability of Simple Events',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.probability-of-simple-events',
      standard: 'M7MATH-10.1',
      description:
        'Find the probability of a simple chance event as favorable outcomes over total equally likely outcomes, place it on the 0-to-1 scale, use the complement rule, and write it as a fraction, a decimal and a percent (CCSS 7.SP.C.5, 7.SP.C.7a).',
    },
  ],
  prerequisites: ['m7math.comparing-two-populations'],
  followUps: ['m7math.experimental-vs-theoretical-probability'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn a familiar guess about luck into a number the student can compute.',
      script:
        'The school fun fair sells 200 raffle tickets and draws one winner. You bought 5 of them. Is that good? Right now it is just a feeling. Probability turns the feeling into a number: 5 chances out of 200, which is 1 out of 40, or 0.025, or 2.5 percent. Today we learn to build that number for any chance event, and to say it three different ways.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-probability-of-simple-events',
      kind: 'concept',
      goal: 'Build the probability formula, the 0-to-1 scale, the three ways to write a probability, and the complement rule.',
      keyIdeas: [
        'PROBABILITY COUNTS OUTCOMES — an outcome is one thing that can happen, and the sample space is the full list of them. An event is the group of outcomes you care about. When every outcome is equally likely, P(event) = number of favorable outcomes divided by number of total outcomes. On a fair number cube the sample space is 1, 2, 3, 4, 5, 6, so P(rolling a 4) = 1/6.',
        'THE SCALE RUNS FROM 0 TO 1 — a probability can never be negative and can never be bigger than 1, because the favorable outcomes are always part of the total. P = 0 means impossible, like rolling a 9 on a number cube. P = 1 means certain, like rolling a number less than 7. P = 1/2 means the event happens about half the time. If your answer comes out as 5/3 or as −0.2, you have made a mistake somewhere, no exceptions.',
        'THE DENOMINATOR IS THE TOTAL, NOT THE LEFTOVERS — in a bag of 3 red and 5 blue counters, P(red) = 3/8, because there are 8 counters in all. Writing 3/5 compares red to blue instead of red to everything. Always count the whole sample space for the bottom number.',
        'ONE PROBABILITY, THREE OUTFITS — the same number can be written as a fraction, a decimal or a percent, exactly the way you converted them back in Unit 1.4. Divide the fraction to get the decimal, then multiply by 100 to get the percent: 1/4 = 0.25 = 25 percent. Keep the fraction in lowest terms, and pick whichever form makes the answer easiest to talk about.',
        'THE COMPLEMENT IS EVERYTHING ELSE — the complement of an event is the event NOT happening, and together they cover the whole sample space. So P(not A) = 1 − P(A). If P(rain) = 0.3, then P(no rain) = 1 − 0.3 = 0.7. This is a shortcut worth having: counting what you do not want is often faster than counting what you do.',
        'EQUALLY LIKELY IS A CONDITION, NOT A FREEBIE — the favorable-over-total formula only works when each outcome has the same chance. Six equal sections on a spinner qualifies. A spinner with one huge section and one sliver does not, even though it still has two outcomes. Check for equal chances BEFORE you divide.',
      ],
      vocabulary: [
        { term: 'outcome', definition: 'one single result that a chance experiment can produce, such as landing on blue.' },
        { term: 'sample space', definition: 'the list of every possible outcome of the experiment.' },
        { term: 'event', definition: 'the outcome or group of outcomes you are asking about, such as rolling an even number.' },
        { term: 'complement', definition: 'the event not happening; its probability is 1 minus the probability of the event.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-spinner-three-forms',
      kind: 'worked_example',
      problem: 'A spinner is split into 8 equal sections: 3 red, 2 blue, 2 green, 1 yellow. Find P(green) as a fraction, a decimal and a percent.',
      steps: [
        'Check the sample space first. The sections are equal in size, so every section is equally likely, and 3 + 2 + 2 + 1 = 8 sections in all. The total is 8.',
        'Count the favorable outcomes. Two of the sections are green, so the favorable count is 2.',
        'Divide: P(green) = 2/8. In lowest terms that is 1/4, because 2 and 8 share a factor of 2.',
        'Turn the fraction into a decimal by dividing: 1 divided by 4 is 0.25.',
        'Turn the decimal into a percent by multiplying by 100: 0.25 becomes 25 percent. So P(green) = 1/4 = 0.25 = 25 percent, three names for one number.',
        'Sanity check the scale. 1/4 sits between 0 and 1, and green really does cover a quarter of the spinner, so the answer is believable.',
      ],
      answer: 'P(green) = 1/4 = 0.25 = 25 percent',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-complement-marbles',
      kind: 'worked_example',
      problem: 'A bag holds 20 marbles: 8 red, 7 blue and 5 green. One marble is picked without looking. Find P(red) and P(not red).',
      steps: [
        'Total outcomes: 8 + 7 + 5 = 20 marbles, and each marble is equally likely to be picked.',
        'P(red) = 8/20. Divide top and bottom by 4 to get 2/5. As a decimal, 2 divided by 5 is 0.4, which is 40 percent.',
        'Now the complement. P(not red) = 1 − P(red) = 1 − 2/5 = 3/5, which is 0.6, or 60 percent.',
        'Check it the long way by counting instead. Not red means blue or green: 7 + 5 = 12 marbles, so 12/20 = 3/5. Same answer, so the complement rule did its job.',
        'Check the two probabilities add up: 0.4 + 0.6 = 1. An event and its complement always add to 1, because between them they cover every marble in the bag.',
      ],
      answer: 'P(red) = 2/5 = 0.4 = 40 percent; P(not red) = 3/5 = 0.6 = 60 percent',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cube-less-than-three',
      kind: 'try_yourself',
      problem: 'A fair number cube has faces 1, 2, 3, 4, 5, 6. What is P(rolling a number less than 3)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/2' },
        { id: 'b', text: '1/3', correct: true },
        { id: 'c', text: '1/6' },
        { id: 'd', text: '2/3' },
      ],
      expectedAnswer: '1/3',
      hints: [
        'Write out the sample space, then circle every face that is genuinely less than 3.',
        'Less than 3 does not include 3 itself. Two faces qualify out of six, so the fraction is 2/6 before you reduce it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-three-forms',
      kind: 'try_yourself',
      problem: 'The probability of an event is 2/5. Which line gives the same probability as a decimal and as a percent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.4 and 40 percent', correct: true },
        { id: 'b', text: '0.25 and 25 percent' },
        { id: 'c', text: '2.5 and 250 percent' },
        { id: 'd', text: '0.4 and 4 percent' },
      ],
      expectedAnswer: '0.4 and 40 percent',
      hints: [
        'A fraction bar means divide. Divide the top number by the bottom number, in that order.',
        'To go from a decimal to a percent, multiply by 100, which slides the decimal point two places right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-complement',
      kind: 'try_yourself',
      problem: 'A box holds 25 counters and 10 of them are yellow. One counter is taken without looking. What is P(not yellow)? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '0.6',
      hints: [
        'Find P(yellow) first: favorable over total, using all 25 counters as the total.',
        'Then use the complement: P(not yellow) = 1 − P(yellow). You can also count the 15 counters that are not yellow and divide by 25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-two-outcomes-fifty-fifty',
      kind: 'misconception_check',
      question: 'A spinner has 8 equal sections and 3 of them are red. A student says P(red) = 1/2, because "either it lands on red or it does not, so it is 50-50." What went wrong?',
      commonErrors: [
        {
          answer: '1/2',
          misconception: 'Treating any two possibilities as automatically equally likely. Two outcomes only split 50-50 when they really do have the same chance.',
          correctsTo: 'Count the equal sections instead. There are 8 equally likely sections and 3 of them are red, so P(red) = 3/8 = 0.375, which is 37.5 percent. That is less than half. WRONG answer to avoid: 1/2. RIGHT answer: 3/8. Red and not-red are two outcomes, but they are not the same size, so the formula must count sections, not possibilities.',
        },
        {
          answer: '3/5',
          misconception: 'Comparing the red sections to the sections that are NOT red, instead of to every section on the spinner.',
          correctsTo: 'The denominator is always the total sample space. There are 8 sections in all, not 5, so P(red) = 3/8 and not 3/5. A quick guard: the numerator must be part of the denominator, so 5 can never be the bottom number when 3 red plus 5 other makes 8.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'When outcomes are equally likely, P(event) = favorable outcomes divided by total outcomes.',
        'The denominator is the whole sample space, so 3 red out of 3 red and 5 blue gives 3/8, never 3/5.',
        'Probability never leaves the 0-to-1 scale: 0 is impossible, 1 is certain, and 5/3 or −0.2 means a mistake.',
        'The same probability has three forms, just like Unit 1.4: 1/4 = 0.25 = 25 percent.',
        'The complement rule says P(not A) = 1 − P(A), and the two always add up to 1.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Probability of Simple Events' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
