/**
 * Grade 6 Math — Unit 2 CED 2.2: Finding the Percent of a Quantity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.finding-the-percent-of-a-quantity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U2_FINDING_THE_PERCENT_OF_A_QUANTITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.finding-the-percent-of-a-quantity.v1',
  course: 'Grade 6 Math',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Finding the Percent of a Quantity',
  planId: 'evelyn.ms.m6math.finding-the-percent-of-a-quantity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.finding-the-percent-of-a-quantity.v1' }],
  theory: [
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'framework', title: 'Percent means per 100', content: `PERCENT MEANS PER 100 — a percent compares a number to 100. To find a percent OF an actual quantity, you scale that per-100 rate up or down until it matches the real whole.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', content: `FIND THE VALUE OF 1% FIRST — the value of 1% of any quantity is the whole divided by 100. For 80 cans, 1% of 80 is 80 divided by 100, which is 0.8 cans. That 0.8 is not an answer to anything by itself; it is the building block for every other percent of 80.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'framework', title: 'Multiply by the percent number', content: `MULTIPLY BY THE PERCENT NUMBER — once you know the value of 1%, multiply it by however many percent you actually need. 25% of 80 is 25 copies of 1% of 80, so it is 0.8 times 25, which is 20.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', content: `THE SHORTCUT: PERCENT AS A DECIMAL — the two moves above (divide by 100, then multiply by the percent number) can be done in one step: write the percent as a decimal by dividing it by 100, then multiply that decimal straight by the whole. 25% is 0.25, and 0.25 times 80 is 20, the same answer, found in one move instead of two.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'framework', title: 'Benchmark percents check your answer', content: `BENCHMARK PERCENTS CHECK YOUR ANSWER — 10% of a quantity is the quantity divided by 10, and 50% of a quantity is half of it. For 80 cans, 10% is 8 and 50% is 40, so 25% has to land somewhere between those two, closer to 8 since 25 is closer to 10 than to 50. 20 fits.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'framework', title: 'The percent number is never the answer by itself', content: `THE PERCENT NUMBER IS NEVER THE ANSWER BY ITSELF — 25% of 80 is not 25, and it is not 80 times 25 either. The percent number always has to be scaled down by 100, either by finding 1% first or by converting it to a decimal, before it multiplies the whole.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'definition', title: 'percent', content: 'a rate that compares a number to 100; 25% means 25 out of every 100.' },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'definition', title: 'benchmark percent', content: `an easy percent to compute in your head, such as 10%, 25%, or 50%, used to estimate or check another percent.` },
    { loId: 'm6math.finding-the-percent-of-a-quantity', kind: 'definition', title: 'decimal equivalent', content: `a percent written as a decimal, found by dividing the percent number by 100; the decimal equivalent of 25% is 0.25.` },
  ],
  methods: [
    {
      title: 'Worked cans donated',
      steps: [
        `Restate the question in the tool's terms: you need 25% of 80.`,
        `Find the value of 1% first by dividing the whole by 100: 80 divided by 100 is 0.8. So 1% of 80 cans is 0.8 cans.`,
        `Multiply the value of 1% by the percent number you actually need: 0.8 times 25 is 20.`,
        `Check with a benchmark: 25% is one quarter, and 80 divided by 4 is also 20, so the two methods agree.`,
        `Check the size: 25% is less than 50%, so the answer must be less than half of 80, which is 40. 20 is less than 40, so the size holds up.`,
        'Read it back into the story: Marcus donated 20 of the 80 cans.',
      ],
      example: { problem: `Your class collects 80 cans for a food drive. Marcus donated 25% of all the cans by himself. How many cans did Marcus donate?`, solution: '20 cans' },
      relatedLoIds: ['m6math.finding-the-percent-of-a-quantity'],
    },
    {
      title: 'Worked travel team',
      steps: [
        `Size test first: 15% is less than 20%, so the answer has to be less than one-fifth of 40 players, which is 8. Expect a number smaller than 8.`,
        `Find the value of 1% by dividing the whole by 100: 40 divided by 100 is 0.4. So 1% of 40 players is 0.4 players.`,
        'Multiply the value of 1% by the percent number: 0.4 times 15 is 6.',
        `WRONG: multiplying the whole quantity by the percent NUMBER without ever dividing by 100, giving 40 times 15, which is 600. CORRECT: the percent number always has to be scaled down by 100 first, either by finding 1% and multiplying, or by writing the percent as a decimal (15% is 0.15) and multiplying that decimal by the whole: 0.15 times 40 is 6. A team of 40 players cannot produce 600 travel-team players, so the size test catches this mistake immediately.`,
        `Benchmark check: 10% of 40 is 4, and 5% of 40 is half of that, which is 2. 15% is 10% plus 5%, so 4 plus 2 is 6, matching the earlier answer.`,
        'Read it back into the story: 6 of the 40 players make the travel team.',
      ],
      example: { problem: `40 players try out for a soccer team. 15% of them make the travel team. How many players make the travel team?`, solution: '6 players' },
      relatedLoIds: ['m6math.finding-the-percent-of-a-quantity'],
    },
  ],
  pointers: [
    { content: `Students often say "40 students" — The class only has 25 students in it, so the answer cannot be bigger than 25, and 40 already is. Find the value of 1% first: 25 divided by 100 is 0.25. Then multiply by the percent number: 0.25 times 40 is 10. Ten students voted for pizza.`, kind: 'common-error' },
    { content: `Students often say "1,000 students" — The percent number always has to be scaled down before it multiplies the whole, either by finding the value of 1% first or by writing the percent as a decimal: 40% is 0.40. Then 0.40 times 25 is 10. A class of 25 students cannot produce an answer of 1,000, so the size of that answer is the first clue something went wrong.`, kind: 'common-error' },
    { content: `A percent is a rate per 100; finding the percent of a quantity means scaling that rate to match the actual whole.`, kind: 'tip' },
    { content: 'Find the value of 1% first by dividing the whole quantity by 100.', kind: 'tip' },
    { content: 'Multiply the value of 1% by the percent number to find the answer.', kind: 'tip' },
    { content: `The shortcut: write the percent as a decimal (divide by 100) and multiply it directly by the quantity, for the exact same answer in one step.`, kind: 'tip' },
    { content: `Benchmark percents such as 10%, 25%, and 50% give a fast way to estimate or check an answer.`, kind: 'tip' },
    { content: `The percent number by itself is never the answer, and the whole times the percent number by itself is never the answer either; both need the percent scaled down by 100 first.`, kind: 'tip' },
    { content: `The percent number is NEVER the answer by itself. 40% of 25 is not 40—it's 10. Always divide the percent by 100 (or find 1% first) before you multiply.`, kind: 'common-error' },
    { content: `Whole × percent number ≠ answer. (25 × 40 = 1,000 is wrong!) You must scale down the percent first: use 0.40 × 25 or find 1% then multiply.`, kind: 'common-error' },
    { content: `1% of a quantity is the whole ÷ 100, not the answer. For 80 cans, 1% is 0.8 cans—that's just your building block. Multiply it by the percent you need to finish.`, kind: 'edge-case' },
    { content: `Check your answer with a benchmark. 10% = whole ÷ 10, and 50% = half. If your answer doesn't land in a sensible range, you scaled wrong.`, kind: 'tip' },
    { content: `A percent as a decimal: divide the percent number by 100. 25% → 0.25, 15% → 0.15, 5% → 0.05. Then multiply the decimal straight by the whole.`, kind: 'vocab-note' },
    { content: `Your answer must be smaller than the whole quantity. 6 players out of 40 makes sense; 600 doesn't. If your answer is too big, you forgot to divide the percent by 100.`, kind: 'gotcha' },
  ],
};
