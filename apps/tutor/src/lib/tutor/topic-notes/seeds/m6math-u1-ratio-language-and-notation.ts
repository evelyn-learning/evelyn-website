/**
 * Grade 6 Math — Unit 1 CED 1.1: Ratio Language & Notation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.ratio-language-and-notation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U1_RATIO_LANGUAGE_AND_NOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.ratio-language-and-notation.v1',
  course: 'Grade 6 Math',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Ratio Language & Notation',
  planId: 'evelyn.ms.m6math.ratio-language-and-notation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.ratio-language-and-notation.v1' }],
  theory: [
    { loId: 'm6math.ratio-language-and-notation', kind: 'framework', title: 'A ratio keeps two numbers together', content: `A RATIO KEEPS TWO NUMBERS TOGETHER — a ratio compares two quantities by holding both numbers side by side, in a set order. It does not collapse them into one number the way subtraction does. Saying "raisins minus peanuts is 1" throws away information; saying "2 cups of peanuts to 3 cups of raisins" keeps it.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'framework', title: 'Three ways to write the same ratio', content: `THREE WAYS TO WRITE THE SAME RATIO — the ratio of 2 to 3 can be written 2:3, or in words as "2 to 3", or as 2/3. All three name the exact same comparison. Which form to use is usually just a matter of what looks cleanest in the sentence you are writing.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'framework', title: 'Order matters', content: `ORDER MATTERS — the ratio of peanuts to raisins is 2:3. The ratio of raisins to peanuts is 3:2. These are different comparisons, even though the same two numbers appear. Whatever quantity is named first in the sentence goes first in the ratio.` },
    { loId: 'm6math.ratio-language-and-notation', content: `"FOR EVERY" LANGUAGE TURNS A RATIO INTO A SENTENCE — the ratio 2:3 can be read aloud as "for every 2 cups of peanuts, there are 3 cups of raisins." This is the exact wording CCSS ratio language uses, and it is the clearest way to check that a ratio has been written in the right order.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'framework', title: 'Part-to-part vs part-to-whole', content: `PART-TO-PART VS PART-TO-WHOLE — a part-to-part ratio compares one part of a group to another part of the same group, such as peanuts to raisins. A part-to-whole ratio compares one part to the total of everything in the group, such as peanuts to the whole batch of trail mix. Both are ratios, and both use the same three notations, but they answer different questions.` },
    { loId: 'm6math.ratio-language-and-notation', content: `A RATIO WRITTEN AS A FRACTION IS NOT ALWAYS "PART OF A WHOLE" — a/b is a valid way to write a ratio, but that does not automatically mean a is part of a whole equal to b. If the ratio 2:3 is peanuts to raisins, writing it as 2/3 still compares peanuts to raisins, not peanuts to the total mix. Always check which two quantities the ratio is actually naming.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'definition', title: 'ratio', content: `a comparison of two quantities that keeps both numbers, and their order, together.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'definition', title: 'terms of a ratio', content: 'the two numbers in a ratio; in 2:3, the terms are 2 and 3.' },
    { loId: 'm6math.ratio-language-and-notation', kind: 'definition', title: 'part-to-part ratio', content: `a ratio that compares one part of a group to a different part of the same group, such as peanuts to raisins.` },
    { loId: 'm6math.ratio-language-and-notation', kind: 'definition', title: 'part-to-whole ratio', content: `a ratio that compares one part of a group to the total amount in the whole group, such as peanuts to the whole batch of trail mix.` },
  ],
  methods: [
    {
      title: 'Worked trail mix part to part and whole',
      steps: [
        `Peanuts to raisins compares one part of the mix to a different part, so this is a part-to-part ratio. Peanuts is named first, so its count goes first: 2 to 3, written 2:3, or as a fraction 2/3.`,
        `To compare peanuts to the whole batch, first find the whole. The whole batch is every cup in the mix added together: 2 cups of peanuts plus 3 cups of raisins is 2 + 3 = 5 cups in all.`,
        `Peanuts to the whole batch is a part-to-whole ratio: 2 cups of peanuts out of 5 cups total, written 2 to 5, or 2:5, or as a fraction 2/5.`,
        `Read both answers back as "for every" sentences to check them. "For every 2 cups of peanuts, there are 3 cups of raisins" matches the part-to-part ratio 2:3. "For every 2 cups of peanuts, there are 5 cups of trail mix in all" matches the part-to-whole ratio 2:5.`,
      ],
      example: { problem: `A trail mix recipe uses 2 cups of peanuts and 3 cups of raisins, with no other ingredients. Write the ratio of peanuts to raisins in all three notations. Then write the ratio of peanuts to the whole batch of trail mix in all three notations.`, solution: `Part-to-part (peanuts to raisins): 2:3, 2 to 3, 2/3. Part-to-whole (peanuts to whole batch): 2:5, 2 to 5, 2/5.` },
      relatedLoIds: ['m6math.ratio-language-and-notation'],
    },
    {
      title: 'Worked classroom lunch order matters',
      steps: [
        `The ratio asked for is "bring lunch to buy lunch," so the bring-lunch count is named first and the buy-lunch count is named second.`,
        `There are 5 students who bring lunch and 7 who buy lunch, so the ratio is 5 to 7, written 5:7 or 5/7.`,
        `WRONG: writing this ratio as 7:5, because 7 happens to be the bigger, more noticeable number. CORRECT: the order comes from the words in the problem, "bring lunch to buy lunch," not from which number looks bigger, so the ratio stays 5:7.`,
        `Read the correct ratio aloud as a check: "for every 5 students who bring lunch, 7 students buy lunch." That sentence matches the order the problem asked for, so 5:7 is confirmed.`,
        `If the problem had instead asked for the ratio of students who buy lunch to students who bring lunch, the answer would flip to 7:5, because the words named buy-lunch first. The two ratios describe the same class, but they are not the same ratio.`,
      ],
      example: { problem: `In Ms. Rivera's class, 5 students bring lunch from home and 7 students buy lunch in the cafeteria. Write the ratio of students who bring lunch to students who buy lunch, and read it aloud using "for every" language.`, solution: `5:7 (5 to 7, or 5/7); "for every 5 students who bring lunch, 7 students buy lunch."` },
      relatedLoIds: ['m6math.ratio-language-and-notation'],
    },
  ],
  pointers: [
    { content: `Students often say "3/5 of the balls in the bin are basketballs." — 3:5 compares basketballs to soccer balls only; it does not compare basketballs to the whole bin. The bin holds 3 + 5 = 8 balls in all, so the fraction of the bin that is basketballs is 3/8, not 3/5. The ratio 3:5 is a part-to-part comparison, while 3/8 is the part-to-whole comparison.`, kind: 'common-error' },
    { content: `Students often say "9:4" — Ratio language names the quantities in a fixed order: "pencils to pens" must list pencils first. The pencil count is 4 and the pen count is 9, so the correct ratio is 4:9. Writing 9:4 instead describes the ratio of pens to pencils, which is a different comparison.`, kind: 'common-error' },
    { content: `A ratio compares two quantities by keeping both numbers, and their order, together.`, kind: 'tip' },
    { content: 'The same ratio can be written three ways: a:b, "a to b", or a/b.', kind: 'tip' },
    { content: 'Order matters: the ratio of X to Y is not the same as the ratio of Y to X.', kind: 'tip' },
    { content: `"For every" language turns ratio notation into a sentence, such as "for every 2 cups of peanuts, there are 3 cups of raisins."`, kind: 'tip' },
    { content: `A part-to-part ratio compares one part to another part; a part-to-whole ratio compares one part to the total of everything in the group.`, kind: 'tip' },
    { content: `Writing a ratio as a fraction does not automatically mean "part of a whole" — always check which two quantities the ratio is actually naming.`, kind: 'tip' },
  ],
};
