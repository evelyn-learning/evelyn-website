/**
 * Grade 7 Math — Statistics & Sampling: Random Sampling & Inferences.
 *
 * Random selection is what earns you the right to generalize (CCSS 7.SP.A.1,
 * 7.SP.A.2). This plan turns a sample proportion into an estimate for a whole
 * population using the scale-factor method, shows why larger samples steady the
 * estimate, and states the honest limit out loud: even a properly random sample
 * can land off the true value, so every result is an estimate, never a count.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U9_RANDOM_SAMPLING_AND_INFERENCES: LessonPlan = {
  id: 'evelyn.ms.m7math.random-sampling-and-inferences.v1',
  title: 'Random Sampling & Inferences',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.random-sampling-and-inferences',
      standard: 'M7MATH-9.2',
      description:
        'Explain why random selection makes a sample generalizable, use a sample proportion to estimate a population total, and describe how sample size affects how reliable that estimate is (CCSS 7.SP.A.1, 7.SP.A.2).',
    },
  ],
  prerequisites: ['m7math.populations-and-samples'],
  followUps: ['m7math.measures-of-center-and-variability'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a small fair taste can speak for a huge batch, and connect that to counting people.',
      script:
        'You make a giant pot of soup for a family party. To find out whether it needs salt, you do not eat the whole pot. You stir it well and taste one spoonful. One spoonful out of a huge pot, and you trust it completely. The stirring is the important part. If you skimmed one spoonful off the top without stirring, you would learn about the top of the soup and nothing else. Picking people at random is the stirring. Today we take a fair spoonful of a school, and turn what is in that spoonful into a number for the whole school.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-random-sampling',
      kind: 'concept',
      goal: 'Define random sampling and inference, teach the scale-factor estimate, and set honest limits on it.',
      keyIdeas: [
        'RANDOM MEANS EQUAL CHANCE — a sample is random when every member of the population has the same chance of being chosen. Draw numbered slips from a bin, or number the population from 1 to N and let a computer pick. Random is the one method that does not know anything about the people it picks, so it cannot tilt toward the loud, the nearby, or the sporty. That is exactly why a random sample is the only kind you are allowed to generalize from.',
        'AN INFERENCE IS A CONCLUSION ABOUT THE POPULATION — you measured the sample, but the sample is not the point. Using what you found in the sample to say something about the whole population is called making an inference. The word about belongs in every inference you say out loud.',
        'THE SAMPLE PROPORTION IS THE BRIDGE — if 12 of the 50 students you asked prefer tacos, the sample proportion is 12 out of 50, which is 12 divided by 50, or 0.24, or 24 percent. That proportion is your best guess for the proportion in the whole population.',
        'SCALE UP WITH A SCALE FACTOR — to estimate a population total, work out how many sample-sized groups fit in the population, then multiply. With a sample of 50 and a population of 600, 600 divided by 50 is 12, so the population is 12 samples wide. Then 12 times 12 is 144. You can also set up the proportion 12 over 50 equals x over 600 and solve, and it gives the same 144. Check by dividing back: 144 divided by 600 is 0.24, which matches the sample.',
        'LARGER SAMPLES GIVE STEADIER ESTIMATES — imagine two different random samples of 20 books from a library of 1,200. One sample happens to hold 4 graphic novels and the other holds 9. Those scale up to 240 and to 540, which is a wild disagreement. Take samples of 200 instead and the two estimates land much closer together. More data means less bouncing around.',
        'AN ESTIMATE IS NOT A PROMISE — a random sample can still miss, purely by luck of the draw. Random protects you from a tilted method, not from chance. So the honest sentence is about 144 students prefer tacos, never exactly 144 students prefer tacos.',
      ],
      vocabulary: [
        { term: 'random sample', definition: 'a sample chosen so that every member of the population has an equal chance of being selected.' },
        { term: 'inference', definition: 'a conclusion drawn about a whole population from data collected on a sample.' },
        { term: 'sample proportion', definition: 'the part of the sample with a trait, divided by the sample size, such as 12 out of 50.' },
        { term: 'estimate', definition: 'a best guess about the population based on a sample, always reported with the word about.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-scale-up-tacos',
      kind: 'worked_example',
      problem:
        'A school has 600 students. In a random sample of 50 students, 12 said tacos are their favorite lunch. About how many of the 600 students would say tacos?',
      steps: [
        'Check the sample first. It was random, so it is fair to generalize from it. If it had been the 50 students in the cafeteria line at the taco stand, this whole calculation would be worthless.',
        'Write the sample proportion: 12 out of 50. As a decimal that is 12 divided by 50, which is 0.24, and as a percent it is 24 percent.',
        'Find the scale factor: how many groups of 50 fit into 600? Divide 600 by 50 to get 12. The population is 12 sample-sized groups.',
        'Scale the count up: each group of 50 contributes about 12 taco fans, and there are 12 such groups, so 12 times 12 equals 144.',
        'Check by going backwards. If 144 of 600 like tacos, the proportion is 144 divided by 600, which equals 0.24. That matches the sample proportion exactly, so the scaling was done right.',
        'Say it honestly. About 144 of the 600 students would say tacos. WRONG answer to avoid: exactly 144 students like tacos. RIGHT answer: about 144 students, because a different random sample of 50 would have given a slightly different number.',
      ],
      answer: 'About 144 of the 600 students',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-library-books',
      kind: 'worked_example',
      problem:
        'A library has 1,200 books. A librarian picks 80 of them at random and finds that 18 are graphic novels. About how many graphic novels are in the library, and what would happen if she had only checked 20 books?',
      steps: [
        'Sample proportion: 18 out of 80. Divide 18 by 80 to get 0.225, which is 22.5 percent.',
        'Scale factor: 1,200 divided by 80 equals 15. The library is 15 sample-sized groups of books.',
        'Estimate the total: 18 times 15 equals 270. So about 270 of the 1,200 books are graphic novels.',
        'Check by going backwards: 270 divided by 1,200 equals 0.225, which matches the sample proportion. The estimate holds up.',
        'Now the small-sample question. With a sample of only 20 books, the scale factor would be 1,200 divided by 20, which is 60. A sample holding 4 graphic novels scales to 4 times 60, or 240. A sample holding 9 scales to 9 times 60, or 540.',
        'Compare the two small-sample answers, 240 and 540. One lucky book either way moves the estimate by 60, because each book in a sample of 20 stands for 60 books. In the sample of 80, each book stands for only 15, so the estimate wobbles far less. Larger samples give steadier estimates.',
      ],
      answer: 'About 270 graphic novels. A sample of 20 would give a much less reliable estimate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-sample-is-random',
      kind: 'try_yourself',
      problem: 'Which plan gives a random sample of the 900 students at Riverside Middle School?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Survey the first 40 students who arrive at school in the morning' },
        { id: 'b', text: 'Number every student from 1 to 900 and have a computer pick 40 of the numbers', correct: true },
        { id: 'c', text: 'Survey the 40 students in the two classrooms closest to the office' },
        { id: 'd', text: 'Post a survey link online and use the first 40 replies that come in' },
      ],
      expectedAnswer: 'Number every student from 1 to 900 and have a computer pick 40 of the numbers',
      hints: [
        'Ask whether every one of the 900 students has the same chance of ending up in the sample.',
        'Three of these let something other than chance decide who is included: how early you arrive, where your classroom is, or how much you want to reply.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-estimate-walkers',
      kind: 'try_yourself',
      problem:
        'A school has 720 students. In a random sample of 40 students, 15 said they walk to school. About how many of the 720 students walk to school?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '270', correct: true },
        { id: 'b', text: '450' },
        { id: 'c', text: '15' },
        { id: 'd', text: '18' },
      ],
      expectedAnswer: '270',
      hints: [
        'First find the scale factor: how many groups of 40 fit into 720?',
        'The scale factor is 720 divided by 40. Multiply the number of walkers in the sample by that factor, not by anything else.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pizza-estimate',
      kind: 'try_yourself',
      problem:
        'Pine Middle School has 500 students. In a random sample of 25 students, 8 said pizza is their favorite lunch. About how many of the 500 students would say pizza? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '160',
      hints: [
        'Divide 500 by 25 to find how many sample-sized groups fit into the school.',
        'The scale factor is 20. Multiply the 8 pizza fans by 20, then check that your answer divided by 500 gives the same proportion as 8 divided by 25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-estimate-is-exact',
      kind: 'misconception_check',
      question:
        'A student takes a random sample of 10 students from a school of 400, finds that 3 of them play an instrument, estimates 120, and announces that exactly 120 students at the school play an instrument. What went wrong?',
      commonErrors: [
        {
          answer: 'Exactly 120 students play an instrument.',
          misconception:
            'Treating an estimate built from a sample as though it were a counted total, so the word about disappears from the conclusion.',
          correctsTo:
            'The scaling itself is right: 400 divided by 10 is 40, and 3 times 40 is 120. What is wrong is the word exactly. A different random sample of 10 might have held 2 instrument players, giving 80, or 5, giving 200. The sample tells you the neighborhood, not the address. Say about 120 students.',
        },
        {
          answer: 'The sample was random, so 10 students is enough to be sure.',
          misconception:
            'Believing that randomness alone removes all uncertainty, and so treating sample size as something that no longer matters once the picking is fair.',
          correctsTo:
            'Randomness and size fix two different problems. Randomness removes the tilt, so the estimate is not aimed wrong. Size controls the wobble. In a sample of 10 out of 400, every single student stands for 40 students, so one different person swings the estimate by 40. Sample 100 students instead and each one stands for only 4, so the estimate steadies down.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A random sample gives every member of the population an equal chance, and only a random sample earns the right to speak for the population.',
        'The sample proportion is the part with the trait divided by the sample size: 12 out of 50 is 0.24.',
        'To estimate a population total, divide the population size by the sample size to get the scale factor, then multiply: 600 divided by 50 is 12, and 12 times 12 is 144.',
        'Check any estimate by dividing it back by the population size; the proportion should match the sample.',
        'Larger random samples give steadier estimates, but no sample is a promise. Report the result as about, because chance can still push a fair sample off.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Random Sampling & Inferences' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
