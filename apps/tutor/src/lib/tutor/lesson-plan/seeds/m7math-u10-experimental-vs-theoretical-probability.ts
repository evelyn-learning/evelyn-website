/**
 * Grade 7 Math — Probability: Experimental vs Theoretical Probability.
 *
 * What SHOULD happen against what DID happen (CCSS 7.SP.C.6, 7.SP.C.7).
 * Theoretical probability comes out of the model, experimental probability
 * comes out of the tally sheet, and the gap between them shrinks as the
 * number of trials grows. The plan is built to kill the gambler's fallacy:
 * five heads in a row does not make tails "due" on the sixth flip.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U10_EXPERIMENTAL_VS_THEORETICAL_PROBABILITY: LessonPlan = {
  id: 'evelyn.ms.m7math.experimental-vs-theoretical-probability.v1',
  title: 'Experimental vs Theoretical Probability',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.experimental-vs-theoretical-probability',
      standard: 'M7MATH-10.2',
      description:
        'Compute experimental probability from the results of trials, compare it with the theoretical probability from the model, explain why the two differ and why the gap narrows as the number of trials grows, and use a probability to predict how often an event will happen (CCSS 7.SP.C.6, 7.SP.C.7).',
    },
  ],
  prerequisites: ['m7math.probability-of-simple-events'],
  followUps: ['m7math.probability-models-and-simulations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up a chance event that cannot be computed from a model, so the student sees why data is needed.',
      script:
        'Your friend flips a half-full water bottle and it lands upright. They say they land it about one time in three. There is no formula for a bottle flip. A bottle is not a number cube, so nobody can count equally likely sides. The only way to find out is to flip it a hundred times and keep score. Today we look at two kinds of probability side by side: the one you work out on paper before anything happens, and the one you get from the tally sheet afterwards.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-theoretical-and-experimental',
      kind: 'concept',
      goal: 'Define both probabilities, explain the gap, and connect more trials to a smaller gap.',
      keyIdeas: [
        'THEORETICAL PROBABILITY COMES FROM THE MODEL — it is the favorable-over-total number you compute before you touch anything. On a fair number cube, P(rolling a 3) = 1/6, and that stays 1/6 whether you roll once or never roll at all. It describes what SHOULD happen in the long run.',
        'EXPERIMENTAL PROBABILITY COMES FROM THE TALLY SHEET — you run the experiment a set number of times and divide: successes over trials. Roll a cube 40 times, see a 3 on 9 of them, and the experimental probability is 9/40 = 0.225. It describes what DID happen. One trial is one run of the experiment, so 40 rolls is 40 trials.',
        'THE TWO NUMBERS ALMOST NEVER MATCH EXACTLY — and that is normal, not a mistake. A theoretical 1/6 does not promise exactly 10 threes in 60 rolls. Short runs wobble. Getting 9 threes when the model predicts about 7 is ordinary luck, not a broken cube.',
        'MORE TRIALS, SMALLER GAP — as the number of trials grows, the experimental probability drifts closer and closer to the theoretical one. Twenty coin flips might land 65 percent heads. Two hundred flips will usually sit much nearer to 50 percent. Mathematicians call this the law of large numbers, and it is why a real test of a bottle flip needs a hundred flips, not five.',
        'THE COIN HAS NO MEMORY — a fair coin that has just landed heads five times running still has P(heads) = 1/2 on the next flip. The coin does not know what it did before and it does not owe anybody a tails. Each flip is a fresh, separate trial with the same probability every time.',
        'PROBABILITY PREDICTS COUNTS — multiply the probability by the number of trials to predict how often an event happens. If P = 0.22, then in 500 trials you expect about 0.22 × 500 = 110 of them. That is a prediction, not a promise, and it works best when the number of trials is large.',
      ],
      vocabulary: [
        { term: 'theoretical probability', definition: 'the probability worked out from the model: favorable outcomes over total equally likely outcomes.' },
        { term: 'experimental probability', definition: 'the probability worked out from data: the number of successes divided by the number of trials.' },
        { term: 'trial', definition: 'one run of the experiment, such as one roll of a number cube.' },
      ],
      suggestedTools: ['show_table', 'show_stats'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cube-forty-rolls',
      kind: 'worked_example',
      problem: 'A fair number cube is rolled 40 times. A 3 comes up 9 times. Find the experimental probability of rolling a 3, compare it with the theoretical probability, and say how many 3s the model predicted.',
      steps: [
        'Experimental first, straight off the tally sheet: successes over trials, so 9/40. Dividing gives 0.225, which is 22.5 percent.',
        'Theoretical next, straight off the model: the cube has 6 equally likely faces and one of them is a 3, so P(3) = 1/6. Dividing gives about 0.167, which is about 16.7 percent.',
        'Compare them. The experimental 0.225 is higher than the theoretical 0.167, so the 3 showed up more often than the model expected. The gap is about 0.058.',
        'Predict the count the model expected: 40 trials times 1/6 is 40/6, which is about 6.7, so roughly 7 threes. The experiment gave 9, which is 2 more than predicted.',
        'Decide what it means. Two extra 3s in 40 rolls is a small wobble, not evidence of a loaded cube. To test the cube seriously you would roll it several hundred times and watch whether the experimental probability settles near 0.167.',
      ],
      answer: 'Experimental P(3) = 9/40 = 0.225; theoretical P(3) = 1/6 which is about 0.167; the model predicted about 7 threes, and 9 turned up',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-coin-gap-narrows',
      kind: 'worked_example',
      problem: 'A fair coin is flipped in three sessions. Session 1: 13 heads in 20 flips. Session 2: 108 heads in 200 flips. Session 3: 517 heads in 1000 flips. Show what happens to the gap between experimental and theoretical probability.',
      steps: [
        'The theoretical probability never moves: a fair coin has P(heads) = 1/2 = 0.5 in every session.',
        'Session 1: 13/20 = 0.65. The gap from 0.5 is 0.15, which is a big miss.',
        'Session 2: 108/200 = 0.54. The gap from 0.5 is 0.04, much smaller.',
        'Session 3: 517/1000 = 0.517. The gap from 0.5 is 0.017, smaller again. The experimental probability is closing in on the theoretical one.',
        'Notice the surprising part. The number of EXTRA heads grew each time: 3 extra in session 1, 8 extra in session 2, 17 extra in session 3. It is the PROPORTION that settles down, not the raw count. That is exactly what the law of large numbers claims.',
      ],
      answer: 'Experimental probabilities 0.65, 0.54 and 0.517, so the gaps from 0.5 shrink from 0.15 to 0.04 to 0.017',
      estimatedMinutes: 3,
    },
    {
      id: 'try-spinner-experimental',
      kind: 'try_yourself',
      problem: 'A spinner has 4 equal sections: red, green, blue and yellow. Nadia spins it 50 times and it lands on green 18 times. What is the EXPERIMENTAL probability of green?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9/25', correct: true },
        { id: 'b', text: '1/4' },
        { id: 'c', text: '18/32' },
        { id: 'd', text: '25/9' },
      ],
      expectedAnswer: '9/25',
      hints: [
        'Experimental probability comes from what happened, so the numbers you need are on the tally sheet, not on the spinner.',
        'Successes over trials: 18 greens out of 50 spins. Now reduce 18/50 by dividing top and bottom by 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-more-trials',
      kind: 'try_yourself',
      problem: 'Four students each test a fair coin. Whose experimental probability of heads is MOST likely to land closest to the theoretical 0.5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'the student who flips the coin 5 times, because a short run cannot drift far' },
        { id: 'b', text: 'the student who flips the coin 20 times' },
        { id: 'c', text: 'the student who flips the coin 400 times', correct: true },
        { id: 'd', text: 'all four are equally close, because the coin is fair either way' },
      ],
      expectedAnswer: 'the student who flips the coin 400 times',
      hints: [
        'Think about which run has the most room for the lucky streaks to cancel each other out.',
        'The law of large numbers says the experimental probability moves toward the theoretical one as the number of trials grows.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-predict',
      kind: 'try_yourself',
      problem: 'A number cube was rolled 200 times and landed on 5 exactly 44 times. Based on that experiment, how many 5s would you expect in 500 rolls? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '110',
      hints: [
        'Find the experimental probability first: successes over trials, 44 out of 200.',
        'Then multiply that probability by the new number of trials: 0.22 times 500.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-due-for-tails',
      kind: 'misconception_check',
      question: 'A fair coin lands heads five times in a row. A student says the next flip is more likely to be tails, because tails is "due." Is that right?',
      commonErrors: [
        {
          answer: 'tails is more likely now',
          misconception: 'The gambler\'s fallacy: believing that a run of one result builds up pressure that the next trial has to release, as if the coin were keeping score.',
          correctsTo: 'No. The coin has no memory. Flip six is a brand new trial, so P(tails) is still 1/2, exactly as it was on flip one. What the law of large numbers actually says is that the extra heads get DILUTED by the flips still to come, not canceled out by tails owed back. WRONG answer to avoid: tails is more likely. RIGHT answer: P(tails) = 1/2.',
        },
        {
          answer: 'P(heads) = 1, because heads won every trial so far',
          misconception: 'Trusting an experimental probability built from only five trials, and treating it as the true probability of the coin.',
          correctsTo: 'The experimental probability really is 5/5 = 1 for those five flips, but five trials is far too few to say anything about the coin. Flip it 400 times and the proportion of heads will almost certainly settle close to 0.5. A small experiment gives a noisy answer, and a noisy answer is not a new model.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Theoretical probability comes from the model: favorable over total, worked out before anything happens.',
        'Experimental probability comes from the data: successes divided by the number of trials.',
        'The two rarely match exactly, and a small gap in a short run is normal wobble, not a broken cube.',
        'More trials means a smaller gap: 13/20 = 0.65, but 517/1000 = 0.517, closing in on 0.5.',
        'Each trial is independent, so a coin that landed heads five times running is still 1/2 on the next flip.',
        'To predict a count, multiply the probability by the number of trials: 0.22 times 500 is about 110.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Experimental vs Theoretical Probability' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
