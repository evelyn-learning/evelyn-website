/**
 * Grade 7 Math — Unit 3 CED 3.2: Unit Rates with Fractions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.complex-fraction-unit-rates.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U3_COMPLEX_FRACTION_UNIT_RATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.complex-fraction-unit-rates.v1',
  course: 'Grade 7 Math',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Unit Rates with Fractions',
  planId: 'evelyn.ms.m7math.complex-fraction-unit-rates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.complex-fraction-unit-rates.v1' }],
  theory: [
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'A complex fraction is a fraction built out of fractions', content: `A COMPLEX FRACTION IS A FRACTION BUILT OUT OF FRACTIONS — writing (1/2) over (1/4) looks strange, but the bar in the middle still means exactly what it always means: divide. So (1/2) over (1/4) is just 1/2 ÷ 1/4.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'Decide which quantity is per which before you compute', content: `DECIDE WHICH QUANTITY IS PER WHICH BEFORE YOU COMPUTE — this is the step students skip, and skipping it is what makes the whole topic feel random. Miles per hour means miles ÷ hours, so distance goes on top and time goes on the bottom. Write the words down first, then replace them with numbers. Never the other way around.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'Dividing by a fraction means multiplying by its reciprocal', content: `DIVIDING BY A FRACTION MEANS MULTIPLYING BY ITS RECIPROCAL — keep the first fraction, flip the second one over, and multiply. So 1/2 ÷ 1/4 becomes 1/2 × 4/1 = 4/2 = 2. The flip happens to the SECOND fraction only. Flipping the first one instead is a common slip and it produces the wrong rate.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'Mixed numbers become improper fractions first', content: `MIXED NUMBERS BECOME IMPROPER FRACTIONS FIRST — you cannot flip a mixed number. Rewrite 1 1/2 as 3/2 and 2 1/3 as 7/3 before doing anything else, and the rest of the work is unchanged.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'Flipping the order gives the other rate, and it is also true', content: `FLIPPING THE ORDER GIVES THE OTHER RATE, AND IT IS ALSO TRUE — 1/2 ÷ 1/4 = 2 says 2 miles per hour. Turn it around and 1/4 ÷ 1/2 = 1/2 says half an hour per mile. Both statements describe the same walk. Only one of them answers the question that was asked, so read the question carefully.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'framework', title: 'Check by scaling back', content: `CHECK BY SCALING BACK — take the unit rate you found and multiply it by the amount of the per quantity you were given. You should land exactly on the other number in the problem. Here, 2 miles per hour times 1/4 hour gives 2/4 = 1/2 mile, which matches the walk.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'definition', title: 'complex fraction', content: `a fraction whose top, bottom, or both are themselves fractions, such as (1/2) over (1/4).` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'definition', title: 'reciprocal', content: `the fraction flipped upside down: the reciprocal of 1/4 is 4/1, and the reciprocal of 2/3 is 3/2.` },
    { loId: 'm7math.complex-fraction-unit-rates', kind: 'definition', title: 'unit rate', content: `the amount that goes with exactly ONE of the other quantity, such as 2 miles per one hour.` },
  ],
  methods: [
    {
      title: 'Worked half mile quarter hour',
      steps: [
        `Decide the order from the words. Miles per hour means miles ÷ hours. Distance is first, time is second. Write that sentence down before writing any numbers.`,
        'Fill in the numbers in that order: 1/2 ÷ 1/4.',
        `Dividing by a fraction means multiplying by its reciprocal. Keep 1/2, flip 1/4 into 4/1, and multiply: 1/2 × 4/1.`,
        `Multiply straight across. The tops give 1 × 4 = 4. The bottoms give 2 × 1 = 2. So the result is 4/2 = 2.`,
        'Attach the units: 2 miles per hour.',
        `Check by scaling. A quarter hour is one of the four quarters that fill an hour. Four of those quarters at 1/2 mile each give 4 × 1/2 = 2 miles in one hour, which matches.`,
      ],
      example: { problem: 'You walk 1/2 mile in 1/4 hour. What is your speed in miles per hour?', solution: '2 miles per hour' },
      relatedLoIds: ['m7math.complex-fraction-unit-rates'],
    },
    {
      title: 'Worked snail meters per minute',
      steps: [
        `Order first. Meters per minute means meters ÷ minutes, so 2/5 goes first and 2/3 goes second.`,
        'Write the division: 2/5 ÷ 2/3.',
        'Flip the second fraction and multiply: 2/5 × 3/2.',
        `Multiply across: tops give 2 × 3 = 6, bottoms give 5 × 2 = 10, so the result is 6/10.`,
        `Simplify 6/10 by dividing both parts by 2, which gives 3/5. As a decimal that is 0.6, so the snail crawls 3/5 of a meter per minute.`,
        `Check by scaling back: 3/5 × 2/3 = 6/15 = 2/5 of a meter in 2/3 of a minute, which is exactly what the problem said.`,
        `WRONG answer to avoid: 2/5 × 2/3 = 4/15, which comes from multiplying the two fractions without flipping. RIGHT answer: 3/5 of a meter per minute.`,
      ],
      example: { problem: `A snail crawls 2/5 of a meter in 2/3 of a minute. How many meters does it crawl per minute?`, solution: '3/5 of a meter per minute' },
      relatedLoIds: ['m7math.complex-fraction-unit-rates'],
    },
  ],
  pointers: [
    { content: `Students often say "1/2 mile per hour" — The number 1/2 is real, but it is 1/2 HOUR PER MILE, not miles per hour. Miles per hour means miles ÷ hours, which is 1/2 ÷ 1/4 = 1/2 × 4/1 = 2 miles per hour. A sanity check settles it: walking half a mile in fifteen minutes is a normal walking speed, and 1/2 mile per hour would be slower than that walk actually was. Decide which quantity is per which BEFORE dividing.`, kind: 'common-error' },
    { content: `Students often say "1/8 mile per hour" — Multiplying gives 1/2 × 1/4 = 1/8, which makes the answer smaller when the situation clearly calls for something bigger. Dividing by a fraction means flipping that fraction and then multiplying: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2. Flip only the second fraction, then multiply.`, kind: 'common-error' },
    { content: 'A complex fraction is just a division problem: (1/2) over (1/4) means 1/2 ÷ 1/4.', kind: 'tip' },
    { content: `Decide which quantity is per which FIRST. Miles per hour means miles ÷ hours, always in that order.`, kind: 'tip' },
    { content: `To divide by a fraction, keep the first, flip the second, and multiply: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2.`, kind: 'tip' },
    { content: `Rewrite mixed numbers as improper fractions before flipping anything: 1 1/2 becomes 3/2.`, kind: 'tip' },
    { content: `Check by scaling back: the unit rate times the given amount of the per quantity must land on the other given number.`, kind: 'tip' },
    { content: `The word **per** tells you the order: whatever comes AFTER "per" goes on the bottom. "Miles per hour" = miles ÷ hours. Write the word sentence before you write any numbers — don't just use the order the numbers appear in the problem.`, kind: 'tip' },
    { content: `Flip the SECOND fraction only. 1/2 ÷ 1/4 = 1/2 × 4/1 = 2. Flipping the first one (2/1 × 1/4) gives 1/2 — a real number, but the wrong rate.`, kind: 'common-error' },
    { content: `Don't multiply the two fractions and call it a rate. 2/5 × 2/3 = 4/15 is NOT the answer; 2/5 ÷ 2/3 = 3/5 is. If you never flipped anything, you divided nothing.`, kind: 'common-error' },
    { content: `You cannot flip a mixed number. Turn 1 1/2 into 3/2 and 2 1/3 into 7/3 BEFORE you flip or multiply. Flipping 1 1/2 into 1 2/1 is meaningless.`, kind: 'edge-case' },
    { content: `Both orders give true statements, so pick the one the question asks for. 1/2 ÷ 1/4 = 2 miles per hour; 1/4 ÷ 1/2 = 1/2 hour per mile. Same walk, different rates. Re-read the question before writing the final label.`, kind: 'gotcha' },
    { content: `A unit rate is the amount that goes with exactly ONE of the other quantity. "2 miles per hour" means per **one** hour — not per 1/4 hour. Say the word "one" out loud when you label your answer.`, kind: 'vocab-note' },
    { content: `Always attach units to the answer: 3/5 is not an answer, "3/5 of a meter per minute" is. Bare numbers hide order mistakes; the units expose them.`, kind: 'tip' },
    { content: `Check by scaling back: unit rate × the given amount of the "per" quantity should land exactly on the other given number. 3/5 × 2/3 = 2/5 ✓. Also sanity-check size — dividing by a fraction less than 1 makes the answer BIGGER.`, kind: 'tip' },
  ],
};
