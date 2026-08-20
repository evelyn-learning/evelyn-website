/**
 * Grade 7 Math — Unit 10 CED 10.2: Experimental vs Theoretical Probability.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.experimental-vs-theoretical-probability.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U10_EXPERIMENTAL_VS_THEORETICAL_PROBABILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.experimental-vs-theoretical-probability.v1',
  course: 'Grade 7 Math',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Experimental vs Theoretical Probability',
  planId: 'evelyn.ms.m7math.experimental-vs-theoretical-probability.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.experimental-vs-theoretical-probability.v1' }],
  theory: [
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'Theoretical probability comes from the model', content: `THEORETICAL PROBABILITY COMES FROM THE MODEL — it is the favorable-over-total number you compute before you touch anything. On a fair number cube, P(rolling a 3) = 1/6, and that stays 1/6 whether you roll once or never roll at all. It describes what SHOULD happen in the long run.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'Experimental probability comes from the tally sheet', content: `EXPERIMENTAL PROBABILITY COMES FROM THE TALLY SHEET — you run the experiment a set number of times and divide: successes over trials. Roll a cube 40 times, see a 3 on 9 of them, and the experimental probability is 9/40 = 0.225. It describes what DID happen. One trial is one run of the experiment, so 40 rolls is 40 trials.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'The two numbers almost never match exactly', content: `THE TWO NUMBERS ALMOST NEVER MATCH EXACTLY — and that is normal, not a mistake. A theoretical 1/6 does not promise exactly 10 threes in 60 rolls. Short runs wobble. Getting 9 threes when the model predicts about 7 is ordinary luck, not a broken cube.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'More trials, smaller gap', content: `MORE TRIALS, SMALLER GAP — as the number of trials grows, the experimental probability drifts closer and closer to the theoretical one. Twenty coin flips might land 65 percent heads. Two hundred flips will usually sit much nearer to 50 percent. Mathematicians call this the law of large numbers, and it is why a real test of a bottle flip needs a hundred flips, not five.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'The coin has no memory', content: `THE COIN HAS NO MEMORY — a fair coin that has just landed heads five times running still has P(heads) = 1/2 on the next flip. The coin does not know what it did before and it does not owe anybody a tails. Each flip is a fresh, separate trial with the same probability every time.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'framework', title: 'Probability predicts counts', content: `PROBABILITY PREDICTS COUNTS — multiply the probability by the number of trials to predict how often an event happens. If P = 0.22, then in 500 trials you expect about 0.22 × 500 = 110 of them. That is a prediction, not a promise, and it works best when the number of trials is large.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'definition', title: 'theoretical probability', content: `the probability worked out from the model: favorable outcomes over total equally likely outcomes.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'definition', title: 'experimental probability', content: `the probability worked out from data: the number of successes divided by the number of trials.` },
    { loId: 'm7math.experimental-vs-theoretical-probability', kind: 'definition', title: 'trial', content: 'one run of the experiment, such as one roll of a number cube.' },
  ],
  methods: [
    {
      title: 'Worked cube forty rolls',
      steps: [
        `Experimental first, straight off the tally sheet: successes over trials, so 9/40. Dividing gives 0.225, which is 22.5 percent.`,
        `Theoretical next, straight off the model: the cube has 6 equally likely faces and one of them is a 3, so P(3) = 1/6. Dividing gives about 0.167, which is about 16.7 percent.`,
        `Compare them. The experimental 0.225 is higher than the theoretical 0.167, so the 3 showed up more often than the model expected. The gap is about 0.058.`,
        `Predict the count the model expected: 40 trials times 1/6 is 40/6, which is about 6.7, so roughly 7 threes. The experiment gave 9, which is 2 more than predicted.`,
        `Decide what it means. Two extra 3s in 40 rolls is a small wobble, not evidence of a loaded cube. To test the cube seriously you would roll it several hundred times and watch whether the experimental probability settles near 0.167.`,
      ],
      example: { problem: `A fair number cube is rolled 40 times. A 3 comes up 9 times. Find the experimental probability of rolling a 3, compare it with the theoretical probability, and say how many 3s the model predicted.`, solution: `Experimental P(3) = 9/40 = 0.225; theoretical P(3) = 1/6 which is about 0.167; the model predicted about 7 threes, and 9 turned up` },
      relatedLoIds: ['m7math.experimental-vs-theoretical-probability'],
    },
    {
      title: 'Worked coin gap narrows',
      steps: [
        `The theoretical probability never moves: a fair coin has P(heads) = 1/2 = 0.5 in every session.`,
        'Session 1: 13/20 = 0.65. The gap from 0.5 is 0.15, which is a big miss.',
        'Session 2: 108/200 = 0.54. The gap from 0.5 is 0.04, much smaller.',
        `Session 3: 517/1000 = 0.517. The gap from 0.5 is 0.017, smaller again. The experimental probability is closing in on the theoretical one.`,
        `Notice the surprising part. The number of EXTRA heads grew each time: 3 extra in session 1, 8 extra in session 2, 17 extra in session 3. It is the PROPORTION that settles down, not the raw count. That is exactly what the law of large numbers claims.`,
      ],
      example: { problem: `A fair coin is flipped in three sessions. Session 1: 13 heads in 20 flips. Session 2: 108 heads in 200 flips. Session 3: 517 heads in 1000 flips. Show what happens to the gap between experimental and theoretical probability.`, solution: `Experimental probabilities 0.65, 0.54 and 0.517, so the gaps from 0.5 shrink from 0.15 to 0.04 to 0.017` },
      relatedLoIds: ['m7math.experimental-vs-theoretical-probability'],
    },
  ],
  pointers: [
    { content: `Students often say "tails is more likely now" — No. The coin has no memory. Flip six is a brand new trial, so P(tails) is still 1/2, exactly as it was on flip one. What the law of large numbers actually says is that the extra heads get DILUTED by the flips still to come, not canceled out by tails owed back. WRONG answer to avoid: tails is more likely. RIGHT answer: P(tails) = 1/2.`, kind: 'common-error' },
    { content: `Students often say "P(heads) = 1, because heads won every trial so far" — The experimental probability really is 5/5 = 1 for those five flips, but five trials is far too few to say anything about the coin. Flip it 400 times and the proportion of heads will almost certainly settle close to 0.5. A small experiment gives a noisy answer, and a noisy answer is not a new model.`, kind: 'common-error' },
    { content: `Theoretical probability comes from the model: favorable over total, worked out before anything happens.`, kind: 'tip' },
    { content: `Experimental probability comes from the data: successes divided by the number of trials.`, kind: 'tip' },
    { content: `The two rarely match exactly, and a small gap in a short run is normal wobble, not a broken cube.`, kind: 'tip' },
    { content: `More trials means a smaller gap: 13/20 = 0.65, but 517/1000 = 0.517, closing in on 0.5.`, kind: 'tip' },
    { content: `Each trial is independent, so a coin that landed heads five times running is still 1/2 on the next flip.`, kind: 'tip' },
    { content: `To predict a count, multiply the probability by the number of trials: 0.22 times 500 is about 110.`, kind: 'tip' },
    { content: `Experimental probability is successes ÷ **trials**, not successes ÷ the other outcomes. 9 threes in 40 rolls is 9/40, never 9/31.`, kind: 'common-error' },
    { content: `"Trial" means one run of the experiment — one roll, one flip, one spin. 40 rolls = 40 trials, not 40 outcomes and not 6 trials (one per face).`, kind: 'vocab-note' },
    { content: `The theoretical probability never changes because of data. A cube stays P(3) = 1/6 even if you roll nine 3s in 40 tries. Data updates the *experimental* number only.`, kind: 'gotcha' },
    { content: `Never say the coin is "due" for tails. Five heads in a row still leaves P(heads) = 1/2 on flip six. The coin has no memory and owes you nothing.`, kind: 'common-error' },
    { content: `More trials shrinks the **gap between the probabilities**, not the gap between counts. In the coin example the extra heads grew (3, then 8, then 17) while 0.65 → 0.54 → 0.517.`, kind: 'gotcha' },
    { content: `A tiny experiment can give a weird answer — 5 heads in 5 flips really is 5/5 = 1. That's a noisy result, not proof the coin is rigged. Judge a coin or cube on hundreds of trials.`, kind: 'edge-case' },
    { content: `Predicted counts don't have to be whole numbers. 40 × 1/6 ≈ 6.7 threes. Say "about 7" when reporting a count, but keep the decimal while comparing to the actual result.`, kind: 'edge-case' },
    { content: `To predict a count, multiply probability × trials — don't add or set up a backwards ratio. From 44/200, expected 5s in 500 rolls = 0.22 × 500 = 110.`, kind: 'tip' },
  ],
};
