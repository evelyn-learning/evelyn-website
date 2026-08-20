/**
 * Grade 7 Math — Unit 4 CED 4.1: Finding a Percent of a Number.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.percent-of-a-number.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U4_PERCENT_OF_A_NUMBER: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.percent-of-a-number.v1',
  course: 'Grade 7 Math',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Finding a Percent of a Number',
  planId: 'evelyn.ms.m7math.percent-of-a-number.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.percent-of-a-number.v1' }],
  theory: [
    { loId: 'm7math.percent-of-a-number', kind: 'framework', title: 'Percent means per hundred', content: `PERCENT MEANS PER HUNDRED — the little % sign is shorthand for "out of 100". So 35% means 35 out of every 100, which is the fraction 35/100, which is the decimal 0.35. Every percent problem starts by rewriting the percent as a decimal: slide the decimal point TWO places to the left. 35% becomes 0.35, 8% becomes 0.08, and 7.5% becomes 0.075.` },
    { loId: 'm7math.percent-of-a-number', kind: 'framework', title: 'Two places, not one', content: `TWO PLACES, NOT ONE — this is where most wrong answers come from. 8% is 0.08, not 0.8. A quick sanity check: 8% of something should be a small slice, a bit less than a tenth. If your answer looks like almost the whole amount, you moved the decimal one place instead of two.` },
    { loId: 'm7math.percent-of-a-number', content: `THE WORD "OF" MEANS MULTIPLY — "35% of 80" is 0.35 times 80. That is the whole forward move: convert, then multiply. Written as a formula, part = percent as a decimal times whole.` },
    { loId: 'm7math.percent-of-a-number', kind: 'framework', title: 'Benchmarks let you check yourself', content: `BENCHMARKS LET YOU CHECK YOURSELF — 10% of a number is that number with the decimal moved one place left, so 10% of 80 is 8. 1% moves it two places, so 1% of 80 is 0.8. Half of 10% gives 5%. Build the percent you want out of these pieces: 35% of 80 is 24 (three tens) plus 4 (one five), which is 28. If that estimate does not match your multiplication, one of them is wrong.` },
    { loId: 'm7math.percent-of-a-number', kind: 'framework', title: 'Going backward, divide', content: `GOING BACKWARD, DIVIDE — sometimes you know the PART and the PERCENT and you want the WHOLE. If 12 dollars is 30% of the money in your wallet, then 0.30 times the whole equals 12. To undo a multiplication you divide, so the whole is 12 divided by 0.30, which is 40. The forward direction multiplies; the backward direction divides.` },
    { loId: 'm7math.percent-of-a-number', kind: 'framework', title: 'Decide which direction first', content: `DECIDE WHICH DIRECTION FIRST — read the sentence and ask what is missing. If the whole amount is sitting right there in the problem, multiply. If the problem hands you a piece and calls it a percent of something unknown, divide. Getting this backward is the second big source of wrong answers in this lesson.` },
    { loId: 'm7math.percent-of-a-number', kind: 'definition', title: 'percent', content: 'a number out of 100, written with the % sign: 35% means 35 out of every 100.' },
    { loId: 'm7math.percent-of-a-number', kind: 'definition', title: 'the whole', content: 'the full amount a percent is taken from — the number that counts as 100%.' },
    { loId: 'm7math.percent-of-a-number', kind: 'definition', title: 'the part', content: 'the piece you get after taking the percent of the whole.' },
  ],
  methods: [
    {
      title: 'Worked forward percent',
      steps: [
        `Sort out what you have. The whole is 80 dollars, the percent is 35%, and the part is what you are looking for. The whole is given, so this is the forward direction: multiply.`,
        `Convert the percent to a decimal by sliding the point two places left: 35% becomes 0.35.`,
        'Multiply: 0.35 times 80 = 28. So you have saved 28 dollars.',
        `Check it with benchmarks. 10% of 80 is 8, so 30% is 24. And 5% is half of 8, which is 4. Then 24 + 4 = 28. The two methods agree.`,
        `One more sanity look: 35% is a bit more than a third, and a third of 80 is about 27. An answer of 28 sits right where it should.`,
      ],
      example: { problem: `A skateboard costs $80. You have saved 35% of the price. How much money have you saved?`, solution: '$28' },
      relatedLoIds: ['m7math.percent-of-a-number'],
    },
    {
      title: 'Worked find the whole',
      steps: [
        `Sort out what you have. The part is 12 dollars, the percent is 30%, and the WHOLE is missing. That flips the problem into the backward direction.`,
        'Write what the forward version would say: 0.30 times the whole = 12.',
        'Multiplication is undone by division, so the whole is 12 divided by 0.30.',
        'Divide: 12 divided by 0.30 = 40. There was 40 dollars in your wallet.',
        `Check by going forward again: 0.30 times 40 = 12. That is the snack money, so the answer holds.`,
        `WRONG answer to avoid: 0.30 times 12 = 3.60, which comes from multiplying out of habit without asking what was missing. RIGHT answer: 40 dollars, found by dividing. Notice the size test too — the whole must be BIGGER than the part, and 3.60 is smaller than 12, so it could never be right.`,
      ],
      example: { problem: `You spent $12 on snacks at the movies. That was 30% of the money in your wallet. How much money was in your wallet to start?`, solution: '$40' },
      relatedLoIds: ['m7math.percent-of-a-number'],
    },
  ],
  pointers: [
    { content: `Students often say "40" — Percent means per hundred, so 8% is 8/100, which is 0.08. The right calculation is 0.08 times 50 = 4. The answer 40 came from 0.8 times 50, and 0.8 is 80%, not 8%. Use the size test: 8% is a small slice, less than a tenth of the amount, and 40 is most of 50. Benchmarks confirm it — 1% of 50 is 0.5, so 8% is eight of those, which is 4.`, kind: 'common-error' },
    { content: `Students often say "400" — The % sign is an instruction, not decoration: it says divide by 100. Multiplying 8 times 50 gives 400, which is eight WHOLE copies of 50 rather than eight hundredths of it. Convert first, every single time: 8% becomes 0.08, and 0.08 times 50 = 4.`, kind: 'common-error' },
    { content: `Percent means per hundred. Convert to a decimal by sliding the point TWO places left: 35% is 0.35 and 8% is 0.08.`, kind: 'tip' },
    { content: `The word "of" means multiply, so part = decimal times whole: 35% of 80 is 0.35 times 80 = 28.`, kind: 'tip' },
    { content: `When the WHOLE is missing, divide instead: if 12 is 30% of a number, that number is 12 divided by 0.30 = 40.`, kind: 'tip' },
    { content: `The whole is always bigger than the part, so an answer smaller than the part cannot be a whole.`, kind: 'tip' },
    { content: `Check every answer with benchmarks: 10% moves the decimal one place, 1% moves it two, and 5% is half of 10%.`, kind: 'tip' },
    { content: `Single-digit percents need a zero placeholder: 8% is **0.08**, not 0.8. Write the percent as a fraction over 100 first (8/100) if you're unsure — that never lies.`, kind: 'common-error' },
    { content: `The % sign is an instruction, not decoration. Never multiply by the bare number: 8% of 50 is 0.08 × 50 = 4, not 8 × 50 = 400.`, kind: 'gotcha' },
    { content: `Before you touch a calculator, ask: **is the whole given?** Whole given → multiply. Only a part and a percent given → divide. Circle the missing quantity in the sentence first.`, kind: 'tip' },
    { content: `The whole is always **bigger** than the part (for percents under 100%). If "12 is 30% of what?" gives you 3.60, you multiplied when you should have divided.`, kind: 'common-error' },
    { content: `Keep "part," "whole," and "percent" straight. The whole is the amount that counts as 100% — the thing right after the word "of." The part is the piece you end up with.`, kind: 'vocab-note' },
    { content: `Percents with decimals still slide two places: 7.5% → 0.075, and 12.5% → 0.125. Don't drop the extra digit or round the percent to a whole number.`, kind: 'edge-case' },
    { content: `Estimate with benchmarks before you multiply: 10% moves the decimal one place, 1% moves it two, 5% is half of 10%. If 40% of 65 doesn't land near 26, redo it.`, kind: 'tip' },
    { content: `Answers can be decimals, and money answers should keep two places: $3.6 should be written $3.60. Also keep the units — "28" and "$28" are not the same answer.`, kind: 'gotcha' },
  ],
};
