/**
 * Grade 7 Math — Percent & Applications: Finding a Percent of a Number.
 *
 * Percent as a proportional relationship (CCSS 7.RP.A.3). Percent means per
 * hundred, so a percent becomes a decimal and "of" becomes multiply. The half
 * of this lesson students actually struggle with is the REVERSE direction —
 * given the part and the percent, recover the whole by dividing. The two traps
 * this plan is built to kill are moving the decimal one place instead of two
 * (8% as 0.8) and multiplying when the missing quantity is the whole.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U4_PERCENT_OF_A_NUMBER: LessonPlan = {
  id: 'evelyn.ms.m7math.percent-of-a-number.v1',
  title: 'Finding a Percent of a Number',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.percent-of-a-number',
      standard: 'M7MATH-4.1',
      description:
        'Find a percent of a quantity by converting the percent to a decimal and multiplying, and find the whole when the part and the percent are known (CCSS 7.RP.A.3, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.constant-of-proportionality'],
  followUps: ['m7math.percent-increase-decrease'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor percent in a number the student reads a dozen times a day.',
      script:
        'Look at the top of your phone screen. The battery says something like 40 percent. Nobody has to explain that. You already know it means the battery is 40 out of every 100 bits of charge, and you already know it is running low. A percent is just a count out of 100. Today we turn that idea into arithmetic: how to find 40 percent of a real amount of money, and then the harder question in reverse — if you know the piece and you know what percent it is, how do you get back to the whole thing?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent-of-a-number',
      kind: 'concept',
      goal: 'Build percent as per-hundred, the decimal-and-multiply move, and the reverse direction.',
      keyIdeas: [
        'PERCENT MEANS PER HUNDRED — the little % sign is shorthand for "out of 100". So 35% means 35 out of every 100, which is the fraction 35/100, which is the decimal 0.35. Every percent problem starts by rewriting the percent as a decimal: slide the decimal point TWO places to the left. 35% becomes 0.35, 8% becomes 0.08, and 7.5% becomes 0.075.',
        'TWO PLACES, NOT ONE — this is where most wrong answers come from. 8% is 0.08, not 0.8. A quick sanity check: 8% of something should be a small slice, a bit less than a tenth. If your answer looks like almost the whole amount, you moved the decimal one place instead of two.',
        'THE WORD "OF" MEANS MULTIPLY — "35% of 80" is 0.35 times 80. That is the whole forward move: convert, then multiply. Written as a formula, part = percent as a decimal times whole.',
        'BENCHMARKS LET YOU CHECK YOURSELF — 10% of a number is that number with the decimal moved one place left, so 10% of 80 is 8. 1% moves it two places, so 1% of 80 is 0.8. Half of 10% gives 5%. Build the percent you want out of these pieces: 35% of 80 is 24 (three tens) plus 4 (one five), which is 28. If that estimate does not match your multiplication, one of them is wrong.',
        'GOING BACKWARD, DIVIDE — sometimes you know the PART and the PERCENT and you want the WHOLE. If 12 dollars is 30% of the money in your wallet, then 0.30 times the whole equals 12. To undo a multiplication you divide, so the whole is 12 divided by 0.30, which is 40. The forward direction multiplies; the backward direction divides.',
        'DECIDE WHICH DIRECTION FIRST — read the sentence and ask what is missing. If the whole amount is sitting right there in the problem, multiply. If the problem hands you a piece and calls it a percent of something unknown, divide. Getting this backward is the second big source of wrong answers in this lesson.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a number out of 100, written with the % sign: 35% means 35 out of every 100.' },
        { term: 'the whole', definition: 'the full amount a percent is taken from — the number that counts as 100%.' },
        { term: 'the part', definition: 'the piece you get after taking the percent of the whole.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-forward-percent',
      kind: 'worked_example',
      problem: 'A skateboard costs $80. You have saved 35% of the price. How much money have you saved?',
      steps: [
        'Sort out what you have. The whole is 80 dollars, the percent is 35%, and the part is what you are looking for. The whole is given, so this is the forward direction: multiply.',
        'Convert the percent to a decimal by sliding the point two places left: 35% becomes 0.35.',
        'Multiply: 0.35 times 80 = 28. So you have saved 28 dollars.',
        'Check it with benchmarks. 10% of 80 is 8, so 30% is 24. And 5% is half of 8, which is 4. Then 24 + 4 = 28. The two methods agree.',
        'One more sanity look: 35% is a bit more than a third, and a third of 80 is about 27. An answer of 28 sits right where it should.',
      ],
      answer: '$28',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-the-whole',
      kind: 'worked_example',
      problem: 'You spent $12 on snacks at the movies. That was 30% of the money in your wallet. How much money was in your wallet to start?',
      steps: [
        'Sort out what you have. The part is 12 dollars, the percent is 30%, and the WHOLE is missing. That flips the problem into the backward direction.',
        'Write what the forward version would say: 0.30 times the whole = 12.',
        'Multiplication is undone by division, so the whole is 12 divided by 0.30.',
        'Divide: 12 divided by 0.30 = 40. There was 40 dollars in your wallet.',
        'Check by going forward again: 0.30 times 40 = 12. That is the snack money, so the answer holds.',
        'WRONG answer to avoid: 0.30 times 12 = 3.60, which comes from multiplying out of habit without asking what was missing. RIGHT answer: 40 dollars, found by dividing. Notice the size test too — the whole must be BIGGER than the part, and 3.60 is smaller than 12, so it could never be right.',
      ],
      answer: '$40',
      estimatedMinutes: 3,
    },
    {
      id: 'try-forward-mcq',
      kind: 'try_yourself',
      problem: 'What is 40% of 65?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2.6' },
        { id: 'b', text: '26', correct: true },
        { id: 'c', text: '39' },
        { id: 'd', text: '162.5' },
      ],
      expectedAnswer: '26',
      hints: [
        'Turn 40% into a decimal first. Slide the point two places left, not one.',
        'The whole is given, so multiply: 0.40 times 65. Check with benchmarks — 10% of 65 is 6.5, so 40% is four of those.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-whole-mcq',
      kind: 'try_yourself',
      problem: '9 is 15% of what number?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.6' },
        { id: 'b', text: '1.35' },
        { id: 'c', text: '60', correct: true },
        { id: 'd', text: '135' },
      ],
      expectedAnswer: '60',
      hints: [
        'Ask which quantity is missing. Here 9 is the part and the WHOLE is what you want, so this is the backward direction.',
        'Write 0.15 times the whole = 9, then divide 9 by 0.15. The whole has to come out bigger than 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-percent',
      kind: 'try_yourself',
      problem: 'A gaming headset costs $250. A store credit covers 12% of the price. How many dollars does the credit cover? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '30',
      hints: [
        'The whole price is given, so multiply: 0.12 times 250.',
        'Build it from benchmarks to check. 10% of 250 is 25, and 1% is 2.50, so 2% is 5. Add the two pieces.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-decimal-place',
      kind: 'misconception_check',
      question: 'A student works out 8% of 50 and writes 40. What went wrong?',
      commonErrors: [
        {
          answer: '40',
          misconception: 'Converting 8% to 0.8 instead of 0.08, by sliding the decimal point one place left instead of two.',
          correctsTo: 'Percent means per hundred, so 8% is 8/100, which is 0.08. The right calculation is 0.08 times 50 = 4. The answer 40 came from 0.8 times 50, and 0.8 is 80%, not 8%. Use the size test: 8% is a small slice, less than a tenth of the amount, and 40 is most of 50. Benchmarks confirm it — 1% of 50 is 0.5, so 8% is eight of those, which is 4.',
        },
        {
          answer: '400',
          misconception: 'Skipping the conversion entirely and multiplying by the number 8 as if the % sign were decoration.',
          correctsTo: 'The % sign is an instruction, not decoration: it says divide by 100. Multiplying 8 times 50 gives 400, which is eight WHOLE copies of 50 rather than eight hundredths of it. Convert first, every single time: 8% becomes 0.08, and 0.08 times 50 = 4.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent means per hundred. Convert to a decimal by sliding the point TWO places left: 35% is 0.35 and 8% is 0.08.',
        'The word "of" means multiply, so part = decimal times whole: 35% of 80 is 0.35 times 80 = 28.',
        'When the WHOLE is missing, divide instead: if 12 is 30% of a number, that number is 12 divided by 0.30 = 40.',
        'The whole is always bigger than the part, so an answer smaller than the part cannot be a whole.',
        'Check every answer with benchmarks: 10% moves the decimal one place, 1% moves it two, and 5% is half of 10%.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Finding a Percent of a Number' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
