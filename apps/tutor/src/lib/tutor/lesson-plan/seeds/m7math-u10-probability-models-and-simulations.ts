/**
 * Grade 7 Math — Probability: Probability Models & Simulations.
 *
 * Building the model, then using a stand-in device to estimate a probability
 * that is awkward to compute (CCSS 7.SP.C.7a, 7.SP.C.7b, 7.SP.C.6). Uniform
 * and non-uniform models, the probabilities-add-to-1 check, and simulation
 * design. The trap this plan is built to kill is conflating a TRIAL with a
 * single outcome: when the question asks about three crates, one trial is
 * three spins, not one.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U10_PROBABILITY_MODELS_AND_SIMULATIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.probability-models-and-simulations.v1',
  title: 'Probability Models & Simulations',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.probability-models-and-simulations',
      standard: 'M7MATH-10.3',
      description:
        'Develop uniform and non-uniform probability models by listing every outcome with its probability, check that the probabilities sum to 1, and design and run a simulation whose trials estimate a probability that is awkward to compute directly (CCSS 7.SP.C.7a, 7.SP.C.7b, 7.SP.C.6).',
    },
  ],
  prerequisites: ['m7math.experimental-vs-theoretical-probability'],
  followUps: ['m7math.compound-events'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a question the student cannot answer with one division, so a simulation earns its place.',
      script:
        'A game says the rare hat drops from a crate 1 time in 4. You have saved up enough for three crates. What is the chance you walk away with at least one hat? Careful, it is not three quarters. Three tries at one quarter each does not simply add up. The chance is a real number and there is a way to get very close to it without any new formula at all: build a model, then act the whole thing out over and over and keep score. That is called a simulation, and today we build one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-models-and-simulations',
      kind: 'concept',
      goal: 'Define a probability model, separate uniform from non-uniform, and lay out how a simulation is designed and what one trial means.',
      keyIdeas: [
        'A PROBABILITY MODEL IS A COMPLETE LIST — every outcome in the sample space, each one paired with its probability. For a number cube the model is: 1 has probability 1/6, 2 has probability 1/6, and so on down to 6. Nothing may be left off the list, because a missing outcome quietly breaks every total that follows.',
        'THE PROBABILITIES MUST ADD TO 1 — this is the check that catches almost every broken model. Six outcomes at 1/6 each give 6 times 1/6, which is exactly 1. If your list adds to 0.9 you have forgotten an outcome, and if it adds to 1.3 you have double-counted one or measured something wrong. Add the column up every single time.',
        'UNIFORM MEANS EVERY OUTCOME IS EQUALLY LIKELY — a fair coin, a fair number cube, a spinner with equal sections. In a uniform model with n outcomes, each one has probability 1/n, and the favorable-over-total shortcut from the first lesson applies.',
        'NON-UNIFORM MEANS THE CHANCES ARE NOT EQUAL — a bag with more blue tiles than red ones, a spinner with one fat section, a bent coin. You build a non-uniform model either by counting unequal parts of the whole or by collecting data and using the experimental probabilities. The outcomes still have to add to 1.',
        'A SIMULATION IS A STAND-IN — pick a device whose probabilities MATCH the real situation, then run it instead. A 1-in-4 chance matches a spinner with 4 equal sections, or a card drawn from four cards, or a random digit where you use only 1, 2, 3, 4 and throw away 0 and 5 through 9. A number cube would be a bad stand-in for 1 in 4, because 1/6 is not 1/4.',
        'ONE TRIAL IS THE WHOLE QUESTION, NOT ONE OUTCOME — if the question asks about three crates, then one trial is three spins, and you write down one result for the trial: hat or no hat. Run many trials, count the successes, divide by the number of trials. Mixing up a trial with a single spin is the fastest way to get a simulation completely wrong.',
      ],
      vocabulary: [
        { term: 'probability model', definition: 'a list of every possible outcome together with the probability of each, adding up to 1.' },
        { term: 'uniform probability model', definition: 'a model in which every outcome has the same probability.' },
        { term: 'simulation', definition: 'a stand-in experiment whose probabilities match the real situation, run many times to estimate a probability.' },
        { term: 'trial', definition: 'one complete run of the simulation, which may take several spins or flips before it produces one result.' },
      ],
      suggestedTools: ['show_table', 'show_stats'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-two-models',
      kind: 'worked_example',
      problem: 'Build a probability model for each: (a) one roll of a fair number cube, (b) one tile drawn from a bag of 20 tiles that holds 9 blue, 6 red and 5 yellow.',
      steps: [
        '(a) List the sample space in order: 1, 2, 3, 4, 5, 6. The cube is fair, so this model is uniform and every outcome gets probability 1/6.',
        '(a) Check the total: 6 outcomes times 1/6 each is 6/6 = 1. The model is complete.',
        '(b) List the sample space by color: blue, red, yellow. There are only three outcomes here, but they are not equally likely, so this model is non-uniform.',
        '(b) Compute each probability out of 20 tiles. P(blue) = 9/20 = 0.45. P(red) = 6/20 = 3/10 = 0.3. P(yellow) = 5/20 = 1/4 = 0.25.',
        '(b) Check the total: 0.45 + 0.3 + 0.25 = 1. It adds up, so nothing was dropped or double-counted.',
        'Read the two models side by side. Both are legal models, both add to 1, but only the cube is uniform. Non-uniform does not mean wrong; it just means you must not use the equal-sections shortcut.',
      ],
      answer: '(a) each of 1 through 6 has probability 1/6, total 1; (b) P(blue) = 9/20 = 0.45, P(red) = 3/10 = 0.3, P(yellow) = 1/4 = 0.25, total 1',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-simulate-three-crates',
      kind: 'worked_example',
      problem: 'The rare hat drops from a crate 1 time in 4. Design a simulation to estimate the probability of getting at least one hat in 3 crates, then read the results: in 50 trials, 29 trials produced at least one hat.',
      steps: [
        'Choose a device that matches the model. The drop chance is 1/4, so use a spinner with 4 equal sections numbered 1, 2, 3, 4. Let section 1 mean HAT and let sections 2, 3 and 4 mean no hat. Each section is one quarter of the spinner, so P(hat) = 1/4 exactly as the game says.',
        'Define one trial, and say it out loud so it cannot slip: one trial is THREE spins, one spin for each crate. Three spins, then one verdict written down.',
        'Define success. A trial counts as a success if at least one of its three spins landed on section 1. Two hats in a trial still counts as one success, because the question only asks for at least one.',
        'Run it 50 times and tally. Suppose the tally shows 29 successful trials out of 50.',
        'Estimate the probability: 29/50 = 0.58, which is 58 percent. So opening three crates gives you a bit better than a coin flip at walking away with the hat.',
        'Sanity check the estimate against common sense. It has to be more than 1/4, because three crates beat one crate, and it has to be less than 3/4, because the chances do not simply add. 0.58 sits between them. Running 500 trials instead of 50 would tighten the estimate further, since more trials means a smaller gap.',
      ],
      answer: 'Spinner of 4 equal sections, one trial = 3 spins, success = at least one section 1; the estimate is 29/50 = 0.58',
      estimatedMinutes: 3,
    },
    {
      id: 'try-model-adds-to-one',
      kind: 'try_yourself',
      problem: 'A spinner has only three colors on it: red, blue and green. Which list could be its complete probability model?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'P(red) = 0.5, P(blue) = 0.3, P(green) = 0.2', correct: true },
        { id: 'b', text: 'P(red) = 0.5, P(blue) = 0.3, P(green) = 0.1' },
        { id: 'c', text: 'P(red) = 0.6, P(blue) = 0.5, P(green) = 0.2' },
        { id: 'd', text: 'P(red) = 1/3, P(blue) = 1/3, P(green) = 1/2' },
      ],
      expectedAnswer: 'P(red) = 0.5, P(blue) = 0.3, P(green) = 0.2',
      hints: [
        'Add each list up before you judge it. There is one total every complete model has to hit.',
        'The three colors cover the whole spinner, so their probabilities must add to exactly 1 — not 0.9, and not more than 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-is-one-trial',
      kind: 'try_yourself',
      problem: 'You want to estimate the probability that a family with 3 children has at least 2 girls. You flip a coin for each child, heads for a girl and tails for a boy. What is ONE trial of this simulation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'one coin flip' },
        { id: 'b', text: 'three coin flips, one for each child', correct: true },
        { id: 'c', text: 'flipping the coin until heads comes up' },
        { id: 'd', text: 'the whole set of 100 coin flips you plan to do' },
      ],
      expectedAnswer: 'three coin flips, one for each child',
      hints: [
        'A trial has to produce one answer to the actual question. Can one flip tell you whether a family of three has at least 2 girls?',
        'The question is about a family of three children, so a trial must build a whole family before you can judge it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-simulation-estimate',
      kind: 'try_yourself',
      problem: 'In 80 trials of that three-child simulation, 36 trials came out with at least 2 girls. What is the estimated probability? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '0.45',
      hints: [
        'The estimate is successful trials divided by total trials — the same successes-over-trials idea as experimental probability.',
        'Divide 36 by 80. Reducing first helps: 36/80 = 9/20.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-trial-is-one-flip',
      kind: 'misconception_check',
      question: 'For the three-child simulation, a student flips a coin 60 times, counts 33 heads, and reports "I ran 60 trials and the probability of at least 2 girls is 33/60." What went wrong?',
      commonErrors: [
        {
          answer: '33/60',
          misconception: 'Counting each individual flip as a trial. That measures the probability of one heads, which the student already knew was 1/2, and never answers the question that was asked.',
          correctsTo: 'One trial is three flips, because the question is about three children. Sixty flips is 20 trials, not 60. For each group of three, write down whether it contained at least 2 heads, then divide the number of successful GROUPS by 20. WRONG answer to avoid: 33/60 heads. RIGHT answer: successful groups out of 20 trials.',
        },
        {
          answer: 'the simulation gives the exact probability',
          misconception: 'Treating a simulation estimate as the true theoretical probability, so that a different result would mean the simulation failed.',
          correctsTo: 'A simulation only estimates. Run the same 80 trials again tomorrow and you will get a slightly different number, and neither run is wrong. More trials pulls the estimate closer to the true value, which is why 500 trials beats 50, but no number of trials makes it exact.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A probability model lists every outcome with its probability, and those probabilities must add to exactly 1.',
        'Uniform means every outcome is equally likely, each one 1/n; non-uniform means unequal chances, built from unequal parts or from data.',
        'A simulation needs a device whose probabilities match the real thing: 4 equal sections for a 1-in-4 chance, never a number cube.',
        'One trial is one complete run of the question, so three crates means three spins before you record a single result.',
        'Estimate the probability as successful trials over total trials, and remember it is an estimate that tightens as trials grow.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Probability Models & Simulations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
