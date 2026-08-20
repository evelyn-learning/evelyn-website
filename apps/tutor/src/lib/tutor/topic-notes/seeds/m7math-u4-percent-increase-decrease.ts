/**
 * Grade 7 Math — Unit 4 CED 4.2: Percent Increase & Decrease.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.percent-increase-decrease.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U4_PERCENT_INCREASE_DECREASE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.percent-increase-decrease.v1',
  course: 'Grade 7 Math',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Percent Increase & Decrease',
  planId: 'evelyn.ms.m7math.percent-increase-decrease.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.percent-increase-decrease.v1' }],
  theory: [
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'Find the change first', content: `FIND THE CHANGE FIRST — subtract to see how much the amount moved: change = new amount minus original amount. If the answer is positive the amount went up, and if it is negative the amount went down. When you report a percent DECREASE you use the size of that change, so you can drop the minus sign and just say the amount fell.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'The denominator is always the original', content: `THE DENOMINATOR IS ALWAYS THE ORIGINAL — percent change = (change divided by the ORIGINAL amount) times 100. This is the one idea that decides whether the whole unit goes right or wrong. Not the new amount. Not the bigger number. The amount you STARTED with, because a change only means something compared to where it began.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'Why the original', content: `WHY THE ORIGINAL — think about a price rising from 12 dollars to 15 dollars. The extra 3 dollars is being compared to the 12 you used to pay, so it is 3/12, which is 0.25, which is 25%. Dividing by 15 would answer a different question that nobody asked: what fraction of the NEW price the change is.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'One multiplier does both steps', content: `ONE MULTIPLIER DOES BOTH STEPS — the original amount is 100% of itself. Increasing it by 20% leaves you with 120% of it, so multiply by 1.20. Decreasing it by 20% leaves you with 80% of it, so multiply by 0.80. Adding the change and subtracting the change both collapse into a single multiplication: 1 plus the rate for an increase, 1 minus the rate for a decrease.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'Percent changes do not cancel', content: `PERCENT CHANGES DO NOT CANCEL — go up 50%, then down 50%, and you do NOT land back where you started. Start at 100: up 50% gives 150, and then 50% OFF of 150 takes away 75, leaving 75. The reason is that each step uses its OWN original. The first 50% was taken of 100, but the second 50% was taken of 150, and 150 is a bigger amount, so the drop is bigger than the rise was.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'framework', title: 'Check by going forward', content: `CHECK BY GOING FORWARD — once you have a percent change, apply it to the original and see if you land on the new amount. If 12 to 15 is a 25% increase, then 12 times 1.25 should give 15. It does, so the answer stands.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'definition', title: 'original amount', content: `the amount you started with — the number that goes on the bottom of the fraction.` },
    { loId: 'm7math.percent-increase-decrease', kind: 'definition', title: 'percent increase', content: 'how much an amount grew, written as a percent of the original amount.' },
    { loId: 'm7math.percent-increase-decrease', kind: 'definition', title: 'percent decrease', content: 'how much an amount shrank, written as a percent of the original amount.' },
    { loId: 'm7math.percent-increase-decrease', kind: 'definition', title: 'multiplier', content: `the single number you multiply by to apply a change in one step: 1.20 for up 20%, 0.80 for down 20%.` },
  ],
  methods: [
    {
      title: 'Worked percent increase',
      steps: [
        `Name the two amounts. The original is 12 dollars, because that is what you used to get. The new amount is 15 dollars.`,
        `Find the change: 15 minus 12 = 3. The allowance went UP by 3 dollars, so this will be a percent increase.`,
        'Divide the change by the ORIGINAL: 3 divided by 12 = 0.25.',
        `Turn the decimal into a percent by multiplying by 100: 0.25 becomes 25%. The allowance went up 25%.`,
        `WRONG answer to avoid: 3 divided by 15 = 0.2, reported as 20%. That divides by the NEW amount, which is not what percent change asks for. RIGHT answer: 25%, because the change is compared to the 12 dollars you started with.`,
        `Check by going forward: 12 times 1.25 = 15. That is exactly the new allowance, so 25% is correct.`,
      ],
      example: { problem: 'Your weekly allowance goes from $12 to $15. What is the percent increase?', solution: '25% increase' },
      relatedLoIds: ['m7math.percent-increase-decrease'],
    },
    {
      title: 'Worked up then down',
      steps: [
        `Month one, the increase. 50% of the original 100 is 50, so the chat gains 50 members and ends the month at 150. As a multiplier that is 100 times 1.50 = 150.`,
        `Month two, the decrease. Read carefully: the shrink is 50% of what the chat has NOW, and right now it has 150 members. So this step has a new original.`,
        `Take 50% of 150: that is 75 members lost. The chat goes 150 minus 75 = 75. As a multiplier that is 150 times 0.50 = 75.`,
        `So the chat ends at 75 members, not 100. The two 50 percents do not cancel, because they were taken of different amounts: the first of 100, the second of the larger 150.`,
        `Measure the whole trip. From 100 down to 75 the change is 25 members, and dividing by the ORIGINAL 100 gives 0.25. Over the two months the chat is down 25%.`,
        `The lesson: never add or cancel percent changes across steps. Apply each one to the amount that is actually there when that step happens.`,
      ],
      example: { problem: `A group chat has 100 members. In one month it grows 50%. The next month it shrinks 50%. Is it back to 100 members?`, solution: '75 members — a 25% decrease overall, not back to 100.' },
      relatedLoIds: ['m7math.percent-increase-decrease'],
    },
  ],
  pointers: [
    { content: `Students often say "20%" — Percent change is always the change divided by the ORIGINAL amount. The hoodie started at 20 dollars, so the calculation is 5 divided by 20 = 0.25, which is a 25% increase. Check it forward: 20 times 1.25 = 25, the new price exactly. Doing it the other way, 20 times 1.20 = 24, which is not the new price, so 20% cannot be right.`, kind: 'common-error' },
    { content: `Students often say "5%" — Five dollars is a size, not a percent — the same 5 dollars is huge on a 20 dollar hoodie and tiny on a 500 dollar phone. To turn it into a percent you must divide by the original amount and then multiply by 100: 5 divided by 20 = 0.25, so 25%.`, kind: 'common-error' },
    { content: `Percent change = change divided by the ORIGINAL amount, times 100. The original is the amount you started with.`, kind: 'tip' },
    { content: `Find the change by subtracting first: 15 minus 12 = 3, then 3 divided by 12 = 25% increase.`, kind: 'tip' },
    { content: `Dividing by the new amount is the classic error: 3 divided by 15 gives 20%, and that answers a different question.`, kind: 'tip' },
    { content: 'One multiplier does the whole job: up 15% is × 1.15, down 15% is × 0.85.', kind: 'tip' },
    { content: `Percent changes never cancel. 100 up 50% is 150, then down 50% is 75 — a 25% decrease overall.`, kind: 'tip' },
    { content: `The denominator is the amount you STARTED with, not the bigger number and not the new one. From $20 to $25, divide 5 by 20 (25%), not 5 by 25 (20%). Circle the original before you divide.`, kind: 'common-error' },
    { content: `A dollar change is not a percent. Going up $5 is not "up 5%." $5 is huge on a $20 hoodie and tiny on a $500 phone — you must divide by the original and multiply by 100.`, kind: 'common-error' },
    { content: `For a decrease the subtraction gives a negative change (34 − 40 = −6). Drop the minus sign and say "15% DECREASE." Never write "−15% increase" or "15% increase" for a drop — the word carries the direction.`, kind: 'vocab-note' },
    { content: `Multiplier check: up 20% → ×1.20, down 20% → ×0.80. If your multiplier is less than 1 the amount must shrink; if it's more than 1 it must grow. A ×0.20 for "down 20%" leaves only 20% of the price — that's an 80% cut.`, kind: 'gotcha' },
    { content: `In a two-step problem, the second percent uses the amount there AFTER step one, not the starting amount. Up 50% then down 50% on 100 gives 75, not 100. Never add or cancel percents across steps.`, kind: 'gotcha' },
    { content: `Always check forward: multiply the original by your multiplier and see if you land on the new amount. $12 × 1.25 = $15 ✓. If $12 × 1.20 = $14.40 ≠ $15, your percent is wrong.`, kind: 'tip' },
    { content: `Percent increases can go past 100%. If a price goes from $10 to $30, the change is $20 and 20/10 = 2 = 200% increase. A number bigger than 100 is not a mistake — it just means the amount more than doubled.`, kind: 'edge-case' },
    { content: `Answers don't have to be whole numbers. 3 ÷ 7 ≈ 0.4286 → about 42.9%. Round only at the END, and keep the units/percent sign straight: 15% is the percent, $6 is the change.`, kind: 'edge-case' },
  ],
};
