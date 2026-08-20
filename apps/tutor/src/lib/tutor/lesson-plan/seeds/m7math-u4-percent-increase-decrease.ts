/**
 * Grade 7 Math — Percent & Applications: Percent Increase & Decrease.
 *
 * Percent change as a proportional comparison (CCSS 7.RP.A.3). The single
 * most-missed idea in the whole unit lives here: the denominator is ALWAYS
 * the ORIGINAL amount, never the new one and never whichever number happens
 * to be bigger. The plan also kills the belief that percent changes cancel —
 * 100 goes up 50% to 150, then down 50% to 75, not back to 100.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U4_PERCENT_INCREASE_DECREASE: LessonPlan = {
  id: 'evelyn.ms.m7math.percent-increase-decrease.v1',
  title: 'Percent Increase & Decrease',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.percent-increase-decrease',
      standard: 'M7MATH-4.2',
      description:
        'Compute percent increase and percent decrease by comparing the change to the ORIGINAL amount, and apply a single multiplier to find a new amount (CCSS 7.RP.A.3, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.percent-of-a-number'],
  followUps: ['m7math.tax-tip-discount-markup'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the size of a change only means something next to what you started with.',
      script:
        'The bag of chips at the school store used to be 2 dollars. This week it is 2 dollars and 50 cents. Everybody says the same thing: it went up 50 cents. True, but 50 cents does not tell you whether that is a small bump or a rip-off. Tape that same 50 cents onto a 40 dollar video game and nobody would even notice. The chips went up a QUARTER of what they used to cost. That is a 25 percent increase, and it is a big deal. Today we learn to measure change the way that actually tells you something: against the amount you started with.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-percent-change',
      kind: 'concept',
      goal: 'Build percent change as change over original, and the single-multiplier shortcut.',
      keyIdeas: [
        'FIND THE CHANGE FIRST — subtract to see how much the amount moved: change = new amount minus original amount. If the answer is positive the amount went up, and if it is negative the amount went down. When you report a percent DECREASE you use the size of that change, so you can drop the minus sign and just say the amount fell.',
        'THE DENOMINATOR IS ALWAYS THE ORIGINAL — percent change = (change divided by the ORIGINAL amount) times 100. This is the one idea that decides whether the whole unit goes right or wrong. Not the new amount. Not the bigger number. The amount you STARTED with, because a change only means something compared to where it began.',
        'WHY THE ORIGINAL — think about a price rising from 12 dollars to 15 dollars. The extra 3 dollars is being compared to the 12 you used to pay, so it is 3/12, which is 0.25, which is 25%. Dividing by 15 would answer a different question that nobody asked: what fraction of the NEW price the change is.',
        'ONE MULTIPLIER DOES BOTH STEPS — the original amount is 100% of itself. Increasing it by 20% leaves you with 120% of it, so multiply by 1.20. Decreasing it by 20% leaves you with 80% of it, so multiply by 0.80. Adding the change and subtracting the change both collapse into a single multiplication: 1 plus the rate for an increase, 1 minus the rate for a decrease.',
        'PERCENT CHANGES DO NOT CANCEL — go up 50%, then down 50%, and you do NOT land back where you started. Start at 100: up 50% gives 150, and then 50% OFF of 150 takes away 75, leaving 75. The reason is that each step uses its OWN original. The first 50% was taken of 100, but the second 50% was taken of 150, and 150 is a bigger amount, so the drop is bigger than the rise was.',
        'CHECK BY GOING FORWARD — once you have a percent change, apply it to the original and see if you land on the new amount. If 12 to 15 is a 25% increase, then 12 times 1.25 should give 15. It does, so the answer stands.',
      ],
      vocabulary: [
        { term: 'original amount', definition: 'the amount you started with — the number that goes on the bottom of the fraction.' },
        { term: 'percent increase', definition: 'how much an amount grew, written as a percent of the original amount.' },
        { term: 'percent decrease', definition: 'how much an amount shrank, written as a percent of the original amount.' },
        { term: 'multiplier', definition: 'the single number you multiply by to apply a change in one step: 1.20 for up 20%, 0.80 for down 20%.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-percent-increase',
      kind: 'worked_example',
      problem: 'Your weekly allowance goes from $12 to $15. What is the percent increase?',
      steps: [
        'Name the two amounts. The original is 12 dollars, because that is what you used to get. The new amount is 15 dollars.',
        'Find the change: 15 minus 12 = 3. The allowance went UP by 3 dollars, so this will be a percent increase.',
        'Divide the change by the ORIGINAL: 3 divided by 12 = 0.25.',
        'Turn the decimal into a percent by multiplying by 100: 0.25 becomes 25%. The allowance went up 25%.',
        'WRONG answer to avoid: 3 divided by 15 = 0.2, reported as 20%. That divides by the NEW amount, which is not what percent change asks for. RIGHT answer: 25%, because the change is compared to the 12 dollars you started with.',
        'Check by going forward: 12 times 1.25 = 15. That is exactly the new allowance, so 25% is correct.',
      ],
      answer: '25% increase',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-up-then-down',
      kind: 'worked_example',
      problem: 'A group chat has 100 members. In one month it grows 50%. The next month it shrinks 50%. Is it back to 100 members?',
      steps: [
        'Month one, the increase. 50% of the original 100 is 50, so the chat gains 50 members and ends the month at 150. As a multiplier that is 100 times 1.50 = 150.',
        'Month two, the decrease. Read carefully: the shrink is 50% of what the chat has NOW, and right now it has 150 members. So this step has a new original.',
        'Take 50% of 150: that is 75 members lost. The chat goes 150 minus 75 = 75. As a multiplier that is 150 times 0.50 = 75.',
        'So the chat ends at 75 members, not 100. The two 50 percents do not cancel, because they were taken of different amounts: the first of 100, the second of the larger 150.',
        'Measure the whole trip. From 100 down to 75 the change is 25 members, and dividing by the ORIGINAL 100 gives 0.25. Over the two months the chat is down 25%.',
        'The lesson: never add or cancel percent changes across steps. Apply each one to the amount that is actually there when that step happens.',
      ],
      answer: '75 members — a 25% decrease overall, not back to 100.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-percent-decrease-mcq',
      kind: 'try_yourself',
      problem: 'A pair of headphones drops from $40 to $34. What is the percent decrease?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6%' },
        { id: 'b', text: '15%', correct: true },
        { id: 'c', text: 'about 17.6%' },
        { id: 'd', text: '85%' },
      ],
      expectedAnswer: '15%',
      hints: [
        'Find the change in dollars first by subtracting, then decide which number belongs on the bottom of the fraction.',
        'The original price is 40, because that is what the headphones cost before the drop. Divide the change by 40, then multiply by 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-multiplier-mcq',
      kind: 'try_yourself',
      problem: 'A $60 skateboard goes UP in price by 15%. Which single multiplication gives the new price?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '60 × 0.15' },
        { id: 'b', text: '60 × 0.85' },
        { id: 'c', text: '60 × 1.15', correct: true },
        { id: 'd', text: '60 × 15' },
      ],
      expectedAnswer: '60 × 1.15',
      hints: [
        'The old price is 100% of itself. After a 15% increase, what percent of the old price do you have?',
        '100% plus 15% is 115%, and 115% written as a decimal is 1.15. Check your pick: the new price must come out bigger than 60.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-percent-change',
      kind: 'try_yourself',
      problem: 'A bike cost $250 last year and costs $280 this year. What is the percent increase? Type your answer as a number, without the percent sign.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Subtract to find the change in dollars: 280 minus 250.',
        'Divide that change by the ORIGINAL price of 250, then multiply by 100 to turn the decimal into a percent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-denominator',
      kind: 'misconception_check',
      question: 'A hoodie went from $20 to $25. A student says that is a 20% increase, because 5 out of 25 is 20%. What went wrong?',
      commonErrors: [
        {
          answer: '20%',
          misconception: 'Dividing the change by the NEW price instead of the original. The student found 5/25, which compares the change to where the price ended up rather than where it started.',
          correctsTo: 'Percent change is always the change divided by the ORIGINAL amount. The hoodie started at 20 dollars, so the calculation is 5 divided by 20 = 0.25, which is a 25% increase. Check it forward: 20 times 1.25 = 25, the new price exactly. Doing it the other way, 20 times 1.20 = 24, which is not the new price, so 20% cannot be right.',
        },
        {
          answer: '5%',
          misconception: 'Reporting the dollar change as if the number of dollars were already a percent.',
          correctsTo: 'Five dollars is a size, not a percent — the same 5 dollars is huge on a 20 dollar hoodie and tiny on a 500 dollar phone. To turn it into a percent you must divide by the original amount and then multiply by 100: 5 divided by 20 = 0.25, so 25%.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent change = change divided by the ORIGINAL amount, times 100. The original is the amount you started with.',
        'Find the change by subtracting first: 15 minus 12 = 3, then 3 divided by 12 = 25% increase.',
        'Dividing by the new amount is the classic error: 3 divided by 15 gives 20%, and that answers a different question.',
        'One multiplier does the whole job: up 15% is × 1.15, down 15% is × 0.85.',
        'Percent changes never cancel. 100 up 50% is 150, then down 50% is 75 — a 25% decrease overall.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Percent Increase & Decrease' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
