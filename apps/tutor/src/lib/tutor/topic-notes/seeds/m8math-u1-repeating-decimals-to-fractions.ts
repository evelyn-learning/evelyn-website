/**
 * Grade 8 Math — Unit 1 CED 1.1: Repeating Decimals to Fractions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.repeating-decimals-to-fractions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U1_REPEATING_DECIMALS_TO_FRACTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.repeating-decimals-to-fractions.v1',
  course: 'Grade 8 Math',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Repeating Decimals to Fractions',
  planId: 'evelyn.ms.m8math.repeating-decimals-to-fractions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.repeating-decimals-to-fractions.v1' }],
  theory: [
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'framework', title: 'Every fraction gives a decimal that stops or repeats', content: `EVERY FRACTION GIVES A DECIMAL THAT STOPS OR REPEATS — you already turn a fraction into a decimal by dividing top by bottom, and you have met both endings: 3/8 = 0.375 stops, and 2/3 = 0.666… repeats. Those are the only two endings, and the remainders are the reason. When you divide by 11, every remainder is one of the numbers 0 through 10. Either a remainder of 0 shows up and the decimal stops, or within eleven steps some remainder has to come back, and from that point the digits repeat in a loop. That is what it means to say a rational number has a decimal that terminates or repeats.` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'framework', title: 'Find the repeating block first', content: `FIND THE REPEATING BLOCK FIRST — the digits that loop are the repeating block, and a bar over them means "forever". In 0.3636… the block is 36. In 0.777… the block is 7. In 0.8333… the block is just the 3, and the 8 in front is a lead digit that never repeats. Deciding exactly which digits loop is the first move, because it decides every number that comes next.` },
    { loId: 'm8math.repeating-decimals-to-fractions', content: `NAME IT x, THEN SHIFT IT — call the decimal x. Multiply by 10 for a one-digit block or by 100 for a two-digit block, which slides the decimal point past exactly one block. If x = 0.3636…, then 100x = 36.3636…, and look at the part after the decimal point: it is the same .3636… it was before. Shifting by a whole block leaves the tail untouched.` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'framework', title: 'Subtract, and the forever cancels', content: `SUBTRACT, AND THE FOREVER CANCELS — 100x - x = 36.3636… - 0.3636…. The two endless tails are identical, so they wipe each other out completely, leaving 99x = 36. That is the whole reason for the shift: the tails only cancel when they line up, and they only line up when the multiplier matches the block, 10 for one digit and 100 for two.` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'framework', title: 'Divide, then reduce', content: `DIVIDE, THEN REDUCE — 99x = 36 gives x = 36/99, and both 36 and 99 divide by 9, so x = 4/11. Lowest terms is part of the answer, not a bonus step. Then check the way you already know how: 4 ÷ 11 = 0.3636…, which is exactly where you started.` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'framework', title: 'A lead digit needs two shifted copies', content: `A LEAD DIGIT NEEDS TWO SHIFTED COPIES — in 0.1666… the 1 never repeats, so x and 10x do not share a tail: x = 0.1666… ends in 1666… but 10x = 1.666… ends in 666…. Shift again: 100x = 16.666…. Now 10x and 100x both end in the same 666… tail, so subtract those two: 100x - 10x = 16.666… - 1.666… = 15, which is 90x = 15, so x = 15/90 = 1/6. Check: 1 ÷ 6 = 0.1666….` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'definition', title: 'repeating decimal', content: 'a decimal whose digits loop forever in a pattern, such as 0.3636…' },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'definition', title: 'repeating block', content: `the group of digits that loops; in 0.3636… the block is 36, in 0.8333… the block is just the 3.` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'definition', title: 'lead digit', content: `a digit after the decimal point that comes before the block starts and never repeats, such as the 8 in 0.8333…` },
    { loId: 'm8math.repeating-decimals-to-fractions', kind: 'definition', title: 'lowest terms', content: `a fraction whose top and bottom share no common factor bigger than 1, such as 4/11 instead of 36/99.` },
  ],
  methods: [
    {
      title: 'Worked free throw two digit block',
      steps: [
        `Find the block. The digits 6, 3 loop, so the block is 63. It has two digits, so the multiplier is 100.`,
        `Name it and shift it. Let x = 0.6363…. Then 100x = 63.6363…. Compare the tails: both x and 100x end in the same .6363… after the decimal point.`,
        `Subtract to cancel the tails: 100x - x = 63.6363… - 0.6363…. The endless parts are identical and wipe out, so 99x = 63.`,
        `Divide: x = 63/99. Reduce: both 63 and 99 divide by 9, and 63 ÷ 9 = 7, 99 ÷ 9 = 11. So x = 7/11.`,
        `Check by dividing it back. 7 ÷ 11: 70 ÷ 11 = 6 remainder 4, then 40 ÷ 11 = 3 remainder 7, and remainder 7 is where we started, so the digits 6, 3 loop again. 7/11 = 0.6363…, which matches.`,
        `Read it back into the story: 7 makes out of 11 attempts. Lowest terms gives the smallest pair of whole numbers with that rate; 14 out of 22 would show the exact same decimal, but 7 out of 11 is the simplest version of it.`,
      ],
      example: { problem: `The stats app shows a free-throw rate of 0.636363…, with 63 repeating forever. Write it as a fraction in lowest terms, then read it back as makes out of attempts.`, solution: '7/11 (7 makes out of 11 attempts)' },
      relatedLoIds: ['m8math.repeating-decimals-to-fractions'],
    },
    {
      title: 'Worked lead digit',
      steps: [
        `Find the block. Only the 3 loops, so the block is one digit. The 8 is a lead digit: it sits before the block and never repeats. That means one shift will not line up two identical tails, because x = 0.8333… ends in 8333… while 10x = 8.333… ends in 333….`,
        `WRONG: reading the decimal as 0.838383…, writing 100x - x = 99x = 83, and answering 83/99. CORRECT: the 8 does not repeat, so 100x is 83.333…, not 83.8383…. The check exposes the slip: 83 ÷ 99 = 0.8383…, which is not the decimal we were given.`,
        `Shift twice so that two copies share a tail. 10x = 8.333… and 100x = 83.333…, and both of them end in the same 333….`,
        `Subtract those two copies: 100x - 10x = 83.333… - 8.333… = 75. On the left, 100x - 10x = 90x, so 90x = 75.`,
        `Divide: x = 75/90. Reduce: both 75 and 90 divide by 15, and 75 ÷ 15 = 5, 90 ÷ 15 = 6. So x = 5/6.`,
        `Check by dividing it back. 5 ÷ 6: 50 ÷ 6 = 8 remainder 2, then 20 ÷ 6 = 3 remainder 2, and the remainder 2 comes back, so the 3 loops forever. 5/6 = 0.8333…, which matches.`,
      ],
      example: { problem: 'Write 0.8333…, where only the 3 repeats, as a fraction in lowest terms.', solution: '5/6' },
      relatedLoIds: ['m8math.repeating-decimals-to-fractions'],
    },
  ],
  pointers: [
    { content: `Students often say "8/11" — Only the 2 repeats. The 7 is a lead digit, so 100x = 72.222…, not 72.7272…, and subtracting x from it leaves a tail behind. Use two copies that share the same tail: 10x = 7.222… and 100x = 72.222…, so 100x - 10x = 65, which is 90x = 65 and x = 65/90 = 13/18. The check tells the story: 8 ÷ 11 = 0.7272…, which is the wrong decimal, while 13 ÷ 18 gives 130 ÷ 18 = 7 remainder 4, then 40 ÷ 18 = 2 remainder 4 over and over, so 13/18 = 0.7222….`, kind: 'common-error' },
    { content: `Students often say "18/25" — Writing a decimal over 100 only works when the decimal actually ends after two places. This one never ends, so 18/25 = 0.72 exactly falls short of 0.7222… by the whole endless tail. A repeating decimal has to be converted by the shift-and-subtract method: 100x - 10x = 72.222… - 7.222… = 65, so 90x = 65 and x = 13/18. Dividing back, 13 ÷ 18 = 0.7222…, which matches, and 0.72 does not.`, kind: 'common-error' },
    { content: `A fraction always gives a decimal that stops or repeats, because the remainders in the division run out of new values and one has to come back.`, kind: 'tip' },
    { content: `Find the repeating block first. The block decides the multiplier: 10 for a one-digit block, 100 for a two-digit block.`, kind: 'tip' },
    { content: `Name it x, shift it, subtract, and the identical endless tails cancel: 100x - x = 99x for a two-digit block.`, kind: 'tip' },
    { content: `A lead digit that does not repeat needs two shifted copies that share a tail: 100x - 10x = 90x.`, kind: 'tip' },
    { content: `Divide, reduce to lowest terms, then check by dividing the fraction back into its decimal.`, kind: 'tip' },
    { content: `Find the repeating block FIRST, before you pick a multiplier. Count which digits loop—that count tells you whether to multiply by 10 or 100. Get the block wrong, and every step after breaks.`, kind: 'gotcha' },
    { content: `A lead digit is NOT part of the repeating block. In 0.8333…, the 8 comes before the loop starts, so you need TWO shifted copies (10x and 100x) to line up matching tails, not one.`, kind: 'vocab-note' },
    { content: `When you subtract, the two decimal tails must be identical and endless on both sides—that's the whole point. If the tails don't match, you shifted by the wrong multiplier or miscounted the block.`, kind: 'tip' },
    { content: `Don't treat a repeating decimal like a terminating one by just writing it as a fraction over 10, 100, etc. 0.7222… is NOT 72/100. The shift-and-subtract method is required because the decimal never ends.`, kind: 'common-error' },
    { content: `Always reduce your final fraction to lowest terms. The problem asks for lowest terms, and it matters for the story: 7/11 is simpler and clearer than 14/22, even though they're the same decimal.`, kind: 'common-error' },
    { content: `Check your answer by dividing the fraction back into a decimal. If you don't get the original repeating decimal, your block, multiplier, or arithmetic was wrong. The check tells you which.`, kind: 'tip' },
    { content: `For a one-digit block, multiply by 10. For a two-digit block, multiply by 100. For a lead digit plus a one-digit block, you still multiply by 100 (to shift past both). The multiplier depends on the block size, not the total size.`, kind: 'vocab-note' },
    { content: `Subtracting 100x - 10x leaves you with 90x on the left side, not 99x. A lead digit means you're subtracting two different powers of x, so the denominator changes. Count carefully.`, kind: 'common-error' },
  ],
};
