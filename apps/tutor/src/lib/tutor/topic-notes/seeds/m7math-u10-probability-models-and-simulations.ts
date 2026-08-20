/**
 * Grade 7 Math — Unit 10 CED 10.3: Probability Models & Simulations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.probability-models-and-simulations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U10_PROBABILITY_MODELS_AND_SIMULATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.probability-models-and-simulations.v1',
  course: 'Grade 7 Math',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Probability Models & Simulations',
  planId: 'evelyn.ms.m7math.probability-models-and-simulations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.probability-models-and-simulations.v1' }],
  theory: [
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'A probability model is a complete list', content: `A PROBABILITY MODEL IS A COMPLETE LIST — every outcome in the sample space, each one paired with its probability. For a number cube the model is: 1 has probability 1/6, 2 has probability 1/6, and so on down to 6. Nothing may be left off the list, because a missing outcome quietly breaks every total that follows.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'The probabilities must add to 1', content: `THE PROBABILITIES MUST ADD TO 1 — this is the check that catches almost every broken model. Six outcomes at 1/6 each give 6 times 1/6, which is exactly 1. If your list adds to 0.9 you have forgotten an outcome, and if it adds to 1.3 you have double-counted one or measured something wrong. Add the column up every single time.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'Uniform means every outcome is equally likely', content: `UNIFORM MEANS EVERY OUTCOME IS EQUALLY LIKELY — a fair coin, a fair number cube, a spinner with equal sections. In a uniform model with n outcomes, each one has probability 1/n, and the favorable-over-total shortcut from the first lesson applies.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'Non-uniform means the chances are not equal', content: `NON-UNIFORM MEANS THE CHANCES ARE NOT EQUAL — a bag with more blue tiles than red ones, a spinner with one fat section, a bent coin. You build a non-uniform model either by counting unequal parts of the whole or by collecting data and using the experimental probabilities. The outcomes still have to add to 1.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'A simulation is a stand-in', content: `A SIMULATION IS A STAND-IN — pick a device whose probabilities MATCH the real situation, then run it instead. A 1-in-4 chance matches a spinner with 4 equal sections, or a card drawn from four cards, or a random digit where you use only 1, 2, 3, 4 and throw away 0 and 5 through 9. A number cube would be a bad stand-in for 1 in 4, because 1/6 is not 1/4.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'framework', title: 'One trial is the whole question, not one outcome', content: `ONE TRIAL IS THE WHOLE QUESTION, NOT ONE OUTCOME — if the question asks about three crates, then one trial is three spins, and you write down one result for the trial: hat or no hat. Run many trials, count the successes, divide by the number of trials. Mixing up a trial with a single spin is the fastest way to get a simulation completely wrong.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'definition', title: 'probability model', content: `a list of every possible outcome together with the probability of each, adding up to 1.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'definition', title: 'uniform probability model', content: 'a model in which every outcome has the same probability.' },
    { loId: 'm7math.probability-models-and-simulations', kind: 'definition', title: 'simulation', content: `a stand-in experiment whose probabilities match the real situation, run many times to estimate a probability.` },
    { loId: 'm7math.probability-models-and-simulations', kind: 'definition', title: 'trial', content: `one complete run of the simulation, which may take several spins or flips before it produces one result.` },
  ],
  methods: [
    {
      title: 'Worked build two models',
      steps: [
        `(a) List the sample space in order: 1, 2, 3, 4, 5, 6. The cube is fair, so this model is uniform and every outcome gets probability 1/6.`,
        `(a) Check the total: 6 outcomes times 1/6 each is 6/6 = 1. The model is complete.`,
        `(b) List the sample space by color: blue, red, yellow. There are only three outcomes here, but they are not equally likely, so this model is non-uniform.`,
        `(b) Compute each probability out of 20 tiles. P(blue) = 9/20 = 0.45. P(red) = 6/20 = 3/10 = 0.3. P(yellow) = 5/20 = 1/4 = 0.25.`,
        `(b) Check the total: 0.45 + 0.3 + 0.25 = 1. It adds up, so nothing was dropped or double-counted.`,
        `Read the two models side by side. Both are legal models, both add to 1, but only the cube is uniform. Non-uniform does not mean wrong; it just means you must not use the equal-sections shortcut.`,
      ],
      example: { problem: `Build a probability model for each: (a) one roll of a fair number cube, (b) one tile drawn from a bag of 20 tiles that holds 9 blue, 6 red and 5 yellow.`, solution: `(a) each of 1 through 6 has probability 1/6, total 1; (b) P(blue) = 9/20 = 0.45, P(red) = 3/10 = 0.3, P(yellow) = 1/4 = 0.25, total 1` },
      relatedLoIds: ['m7math.probability-models-and-simulations'],
    },
    {
      title: 'Worked simulate three crates',
      steps: [
        `Choose a device that matches the model. The drop chance is 1/4, so use a spinner with 4 equal sections numbered 1, 2, 3, 4. Let section 1 mean HAT and let sections 2, 3 and 4 mean no hat. Each section is one quarter of the spinner, so P(hat) = 1/4 exactly as the game says.`,
        `Define one trial, and say it out loud so it cannot slip: one trial is THREE spins, one spin for each crate. Three spins, then one verdict written down.`,
        `Define success. A trial counts as a success if at least one of its three spins landed on section 1. Two hats in a trial still counts as one success, because the question only asks for at least one.`,
        `Run it 50 times and tally. Suppose the tally shows 29 successful trials out of 50.`,
        `Estimate the probability: 29/50 = 0.58, which is 58 percent. So opening three crates gives you a bit better than a coin flip at walking away with the hat.`,
        `Sanity check the estimate against common sense. It has to be more than 1/4, because three crates beat one crate, and it has to be less than 3/4, because the chances do not simply add. 0.58 sits between them. Running 500 trials instead of 50 would tighten the estimate further, since more trials means a smaller gap.`,
      ],
      example: { problem: `The rare hat drops from a crate 1 time in 4. Design a simulation to estimate the probability of getting at least one hat in 3 crates, then read the results: in 50 trials, 29 trials produced at least one hat.`, solution: `Spinner of 4 equal sections, one trial = 3 spins, success = at least one section 1; the estimate is 29/50 = 0.58` },
      relatedLoIds: ['m7math.probability-models-and-simulations'],
    },
  ],
  pointers: [
    { content: `Students often say "33/60" — One trial is three flips, because the question is about three children. Sixty flips is 20 trials, not 60. For each group of three, write down whether it contained at least 2 heads, then divide the number of successful GROUPS by 20. WRONG answer to avoid: 33/60 heads. RIGHT answer: successful groups out of 20 trials.`, kind: 'common-error' },
    { content: `Students often say "the simulation gives the exact probability" — A simulation only estimates. Run the same 80 trials again tomorrow and you will get a slightly different number, and neither run is wrong. More trials pulls the estimate closer to the true value, which is why 500 trials beats 50, but no number of trials makes it exact.`, kind: 'common-error' },
    { content: `A probability model lists every outcome with its probability, and those probabilities must add to exactly 1.`, kind: 'tip' },
    { content: `Uniform means every outcome is equally likely, each one 1/n; non-uniform means unequal chances, built from unequal parts or from data.`, kind: 'tip' },
    { content: `A simulation needs a device whose probabilities match the real thing: 4 equal sections for a 1-in-4 chance, never a number cube.`, kind: 'tip' },
    { content: `One trial is one complete run of the question, so three crates means three spins before you record a single result.`, kind: 'tip' },
    { content: `Estimate the probability as successful trials over total trials, and remember it is an estimate that tightens as trials grow.`, kind: 'tip' },
    { content: `One trial = one complete run of the question. Three children means **three flips before you record one result**. 60 flips is 20 trials, not 60. Say your trial definition out loud before you start tallying.`, kind: 'common-error' },
    { content: `Add your probability column every single time. Under 1 means you dropped an outcome; over 1 means you double-counted or miscounted. Don't skip this because the list 'looks right'.`, kind: 'tip' },
    { content: `Non-uniform does NOT mean wrong or unfair-in-a-bad-way. A bag of 9 blue, 6 red, 5 yellow is a perfectly legal model — you just can't use the 'each outcome is 1/n' shortcut on it.`, kind: 'vocab-note' },
    { content: `Match the device to the chance. A number cube can't simulate a 1-in-4 event, since 1/6 ≠ 1/4. Use 4 equal sections, 4 cards, or random digits 1–4 with 0 and 5–9 thrown out.`, kind: 'gotcha' },
    { content: `A simulation gives an *estimate*, not the exact probability. Run it again tomorrow and you'll get a slightly different number — neither run is wrong. More trials tightens the estimate; nothing makes it exact.`, kind: 'gotcha' },
    { content: `For 'at least one' successes, a trial with two or three hits still counts as **one** success, not two. Tally trials, not hits.`, kind: 'edge-case' },
    { content: `Sample space outcomes don't have to be single numbers. For a bag of tiles the outcomes are the colors — blue, red, yellow — three outcomes, not twenty. Twenty is the denominator, not the outcome count.`, kind: 'vocab-note' },
    { content: `Sanity-check your estimate. Three crates at 1-in-4 each must beat 1/4 but stay under 3/4 — chances don't just add. If your estimate lands outside that range, recheck your tally.`, kind: 'tip' },
  ],
};
