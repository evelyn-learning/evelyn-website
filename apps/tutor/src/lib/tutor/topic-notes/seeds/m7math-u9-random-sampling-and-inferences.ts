/**
 * Grade 7 Math — Unit 9 CED 9.2: Random Sampling & Inferences.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.random-sampling-and-inferences.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U9_RANDOM_SAMPLING_AND_INFERENCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.random-sampling-and-inferences.v1',
  course: 'Grade 7 Math',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Random Sampling & Inferences',
  planId: 'evelyn.ms.m7math.random-sampling-and-inferences.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.random-sampling-and-inferences.v1' }],
  theory: [
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'Random means equal chance', content: `RANDOM MEANS EQUAL CHANCE — a sample is random when every member of the population has the same chance of being chosen. Draw numbered slips from a bin, or number the population from 1 to N and let a computer pick. Random is the one method that does not know anything about the people it picks, so it cannot tilt toward the loud, the nearby, or the sporty. That is exactly why a random sample is the only kind you are allowed to generalize from.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'An inference is a conclusion about the population', content: `AN INFERENCE IS A CONCLUSION ABOUT THE POPULATION — you measured the sample, but the sample is not the point. Using what you found in the sample to say something about the whole population is called making an inference. The word about belongs in every inference you say out loud.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'The sample proportion is the bridge', content: `THE SAMPLE PROPORTION IS THE BRIDGE — if 12 of the 50 students you asked prefer tacos, the sample proportion is 12 out of 50, which is 12 divided by 50, or 0.24, or 24 percent. That proportion is your best guess for the proportion in the whole population.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'Scale up with a scale factor', content: `SCALE UP WITH A SCALE FACTOR — to estimate a population total, work out how many sample-sized groups fit in the population, then multiply. With a sample of 50 and a population of 600, 600 divided by 50 is 12, so the population is 12 samples wide. Then 12 times 12 is 144. You can also set up the proportion 12 over 50 equals x over 600 and solve, and it gives the same 144. Check by dividing back: 144 divided by 600 is 0.24, which matches the sample.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'Larger samples give steadier estimates', content: `LARGER SAMPLES GIVE STEADIER ESTIMATES — imagine two different random samples of 20 books from a library of 1,200. One sample happens to hold 4 graphic novels and the other holds 9. Those scale up to 240 and to 540, which is a wild disagreement. Take samples of 200 instead and the two estimates land much closer together. More data means less bouncing around.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'framework', title: 'An estimate is not a promise', content: `AN ESTIMATE IS NOT A PROMISE — a random sample can still miss, purely by luck of the draw. Random protects you from a tilted method, not from chance. So the honest sentence is about 144 students prefer tacos, never exactly 144 students prefer tacos.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'definition', title: 'random sample', content: `a sample chosen so that every member of the population has an equal chance of being selected.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'definition', title: 'inference', content: 'a conclusion drawn about a whole population from data collected on a sample.' },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'definition', title: 'sample proportion', content: `the part of the sample with a trait, divided by the sample size, such as 12 out of 50.` },
    { loId: 'm7math.random-sampling-and-inferences', kind: 'definition', title: 'estimate', content: `a best guess about the population based on a sample, always reported with the word about.` },
  ],
  methods: [
    {
      title: 'Worked scale up tacos',
      steps: [
        `Check the sample first. It was random, so it is fair to generalize from it. If it had been the 50 students in the cafeteria line at the taco stand, this whole calculation would be worthless.`,
        `Write the sample proportion: 12 out of 50. As a decimal that is 12 divided by 50, which is 0.24, and as a percent it is 24 percent.`,
        `Find the scale factor: how many groups of 50 fit into 600? Divide 600 by 50 to get 12. The population is 12 sample-sized groups.`,
        `Scale the count up: each group of 50 contributes about 12 taco fans, and there are 12 such groups, so 12 times 12 equals 144.`,
        `Check by going backwards. If 144 of 600 like tacos, the proportion is 144 divided by 600, which equals 0.24. That matches the sample proportion exactly, so the scaling was done right.`,
        `Say it honestly. About 144 of the 600 students would say tacos. WRONG answer to avoid: exactly 144 students like tacos. RIGHT answer: about 144 students, because a different random sample of 50 would have given a slightly different number.`,
      ],
      example: { problem: `A school has 600 students. In a random sample of 50 students, 12 said tacos are their favorite lunch. About how many of the 600 students would say tacos?`, solution: 'About 144 of the 600 students' },
      relatedLoIds: ['m7math.random-sampling-and-inferences'],
    },
    {
      title: 'Worked library books',
      steps: [
        `Sample proportion: 18 out of 80. Divide 18 by 80 to get 0.225, which is 22.5 percent.`,
        `Scale factor: 1,200 divided by 80 equals 15. The library is 15 sample-sized groups of books.`,
        `Estimate the total: 18 times 15 equals 270. So about 270 of the 1,200 books are graphic novels.`,
        `Check by going backwards: 270 divided by 1,200 equals 0.225, which matches the sample proportion. The estimate holds up.`,
        `Now the small-sample question. With a sample of only 20 books, the scale factor would be 1,200 divided by 20, which is 60. A sample holding 4 graphic novels scales to 4 times 60, or 240. A sample holding 9 scales to 9 times 60, or 540.`,
        `Compare the two small-sample answers, 240 and 540. One lucky book either way moves the estimate by 60, because each book in a sample of 20 stands for 60 books. In the sample of 80, each book stands for only 15, so the estimate wobbles far less. Larger samples give steadier estimates.`,
      ],
      example: { problem: `A library has 1,200 books. A librarian picks 80 of them at random and finds that 18 are graphic novels. About how many graphic novels are in the library, and what would happen if she had only checked 20 books?`, solution: `About 270 graphic novels. A sample of 20 would give a much less reliable estimate.` },
      relatedLoIds: ['m7math.random-sampling-and-inferences'],
    },
  ],
  pointers: [
    { content: `Students often say "Exactly 120 students play an instrument." — The scaling itself is right: 400 divided by 10 is 40, and 3 times 40 is 120. What is wrong is the word exactly. A different random sample of 10 might have held 2 instrument players, giving 80, or 5, giving 200. The sample tells you the neighborhood, not the address. Say about 120 students.`, kind: 'common-error' },
    { content: `Students often say "The sample was random, so 10 students is enough to be sure." — Randomness and size fix two different problems. Randomness removes the tilt, so the estimate is not aimed wrong. Size controls the wobble. In a sample of 10 out of 400, every single student stands for 40 students, so one different person swings the estimate by 40. Sample 100 students instead and each one stands for only 4, so the estimate steadies down.`, kind: 'common-error' },
    { content: `A random sample gives every member of the population an equal chance, and only a random sample earns the right to speak for the population.`, kind: 'tip' },
    { content: `The sample proportion is the part with the trait divided by the sample size: 12 out of 50 is 0.24.`, kind: 'tip' },
    { content: `To estimate a population total, divide the population size by the sample size to get the scale factor, then multiply: 600 divided by 50 is 12, and 12 times 12 is 144.`, kind: 'tip' },
    { content: `Check any estimate by dividing it back by the population size; the proportion should match the sample.`, kind: 'tip' },
    { content: `Larger random samples give steadier estimates, but no sample is a promise. Report the result as about, because chance can still push a fair sample off.`, kind: 'tip' },
    { content: `Always say "**about** 144 students," never "exactly 144." You counted 50 students, not 600. Dropping the word *about* turns a good estimate into a false claim.`, kind: 'vocab-note' },
    { content: `Random and big are two different jobs. Random stops the sample from being tilted; size stops it from wobbling. A random sample of 10 is still fair — it's just shaky. Don't say "it was random, so 10 is enough."`, kind: 'gotcha' },
    { content: `Scale factor = population ÷ **sample size**, not sample ÷ population. With 600 students and a sample of 50, it's 600 ÷ 50 = 12. If your scale factor comes out less than 1, you flipped the division.`, kind: 'common-error' },
    { content: `Multiply the scale factor by the **count** with the trait (12 taco fans), not by the sample size (50). Multiplying 50 × 12 gives 600 — the whole school — which should tip you off instantly.`, kind: 'common-error' },
    { content: `Check every estimate backwards: divide it by the population size and see if you get the sample proportion. 144 ÷ 600 = 0.24, same as 12 ÷ 50. If it doesn't match, something got flipped.`, kind: 'tip' },
    { content: `Sample proportions often aren't tidy. 18 out of 80 is 0.225 — keep the decimal, don't round it to 0.2 before scaling. Rounding early can shift your final estimate by dozens.`, kind: 'edge-case' },
    { content: `Before any math, ask: was the sample random? Surveying the taco line about favorite lunch isn't random, and no amount of correct multiplying rescues it. A big biased sample is still worthless.`, kind: 'gotcha' },
    { content: `"Sample proportion" and "population estimate" are different animals. The proportion is a part-of-a-whole like 0.24 or 24%; the estimate is a count of people or things, like 144 students. Label your answer with what it counts.`, kind: 'vocab-note' },
  ],
};
