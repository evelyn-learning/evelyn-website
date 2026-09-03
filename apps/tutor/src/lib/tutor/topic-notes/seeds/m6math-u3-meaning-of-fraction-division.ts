/**
 * Grade 6 Math — Unit 3 CED 3.1: The Meaning of Fraction Division.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.meaning-of-fraction-division.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U3_MEANING_OF_FRACTION_DIVISION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.meaning-of-fraction-division.v1',
  course: 'Grade 6 Math',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'The Meaning of Fraction Division',
  planId: 'evelyn.ms.m6math.meaning-of-fraction-division.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.meaning-of-fraction-division.v1' }],
  theory: [
    { loId: 'm6math.meaning-of-fraction-division', kind: 'framework', title: 'Division means counting equal groups', content: `DIVISION MEANS COUNTING EQUAL GROUPS — whole-number division such as 12 divided by 3 asks how many groups of 3 fit inside 12. Dividing fractions asks the exact same question: 3/4 divided by 1/4 asks how many groups of 1/4 fit inside 3/4.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'framework', title: 'Same-size pieces make the groups easy to see', content: `SAME-SIZE PIECES MAKE THE GROUPS EASY TO SEE — mark a number line off in pieces the size of the divisor, then count how many of those pieces reach the dividend. For 3/4 divided by 1/4, mark a line off in fourths, shade up to 3/4, and count the 1/4-size jumps that land inside the shaded part.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'framework', title: 'A shared denominator turns any two fractions into the same size pieces', content: `A SHARED DENOMINATOR TURNS ANY TWO FRACTIONS INTO THE SAME SIZE PIECES — when the dividend and the divisor do not already share a denominator, rewrite both with the same denominator first. Once every piece on the model is the same size, counting groups works exactly the way it did when the denominators already matched.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'framework', title: 'An area model shows the same count a different way', content: `AN AREA MODEL SHOWS THE SAME COUNT A DIFFERENT WAY — draw a bar for one whole, shade the amount in the dividend, then slice the whole bar into strips the size of the divisor. Counting how many of those strips lie inside the shaded part gives the same answer as the number line.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'framework', title: 'A leftover can be part of one more group', content: `A LEFTOVER CAN BE PART OF ONE MORE GROUP — the groups do not always come out even. When a group is left unfinished at the end, compare what remains to the size of one full group; a piece that is half the size of a group counts as half of one more group, not as a whole extra group and not as nothing.` },
    { loId: 'm6math.meaning-of-fraction-division', content: `DIVIDING BY A FRACTION SMALLER THAN 1 GIVES MORE GROUPS THAN YOU STARTED WITH — since each group is smaller than one whole, more of them fit inside the same amount. An answer smaller than the amount you started with is a signal that something went wrong, not a sign that the division is finished.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'definition', title: 'dividend', content: `the amount you start with, the number being divided; in 3/4 divided by 1/4, the dividend is 3/4.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'definition', title: 'divisor', content: `the size of one group, the number you are dividing by; in 3/4 divided by 1/4, the divisor is 1/4.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'definition', title: 'quotient', content: `the number of groups the dividend splits into; it is the answer to a division problem.` },
    { loId: 'm6math.meaning-of-fraction-division', kind: 'definition', title: 'common denominator', content: `a shared bottom number that lets two fractions be cut into pieces of the same size, so the groups can be counted directly.` },
  ],
  methods: [
    {
      title: 'Worked ribbon bows',
      steps: [
        `Turn the question into a counting question: how many groups of 1/4 yard fit inside 3/4 yard of ribbon?`,
        'Draw a number line from 0 to 1, marked off in fourths: 0, 1/4, 2/4, 3/4, 1.',
        'Shade the number line from 0 up to 3/4, since that is how much ribbon there is.',
        `Count the 1/4-size jumps that land inside the shaded part: the first jump lands on 1/4, the second on 2/4, the third on 3/4. That is 3 jumps, and the third jump lands exactly on the edge of the shaded part.`,
        'Three jumps of 1/4 means three groups of 1/4, so the ribbon makes 3 bows.',
        `Check by multiplying the number of groups by the size of one group: 3 groups × 1/4 yard = 3/4 yard, exactly the ribbon there was to start. The count of 3 groups holds.`,
      ],
      example: { problem: `You have 3/4 of a yard of ribbon. Each bow uses 1/4 of a yard. How many bows can you make? Work out 3/4 ÷ 1/4.`, solution: '3 bows, since 3/4 ÷ 1/4 = 3' },
      relatedLoIds: ['m6math.meaning-of-fraction-division'],
    },
    {
      title: 'Worked yarn bracelets',
      steps: [
        `Turn the question into a counting question: how many groups of 1/3 yard fit inside 5/6 yard of yarn?`,
        `The dividend is already in sixths, but the divisor is in thirds, so rewrite 1/3 as sixths first: 1/3 = 2/6. Now every piece on the model will be the same size, one sixth of a yard.`,
        `Draw a bar for one whole yard, split into six equal strips, and shade 5 of the 6 strips to show 5/6 yard of yarn.`,
        `Count off groups of 2 strips, since one bracelet uses 1/3 yard, which is 2 strips of 1/6: the first group uses 2 shaded strips, the second group uses 2 more shaded strips, using 4 of the 5 shaded strips in all.`,
        `One shaded strip is left over, which is 1/6 of a yard. A full group needs 2 strips, or 2/6 of a yard, so the leftover strip is only half of one more group.`,
        `WRONG: counting the single leftover strip as one whole extra group, making the answer 3 bracelets. CORRECT: the leftover strip is half the size of a group, since a group is 2/6 and the leftover is 1/6, so it counts as half of one more group. The full quotient is 2 and 1/2 groups.`,
        `Check: 2 and 1/2 groups of 1/3 yard each is 2/3 yard for the two full groups plus 1/6 yard for the half group, and 2/3 + 1/6 = 4/6 + 1/6 = 5/6, which matches the yarn there was to start.`,
        `Read it back into the story: enough yarn for 2 finished bracelets, with just enough yarn left over for half of a third one.`,
      ],
      example: { problem: `You have 5/6 of a yard of yarn left after making bracelets. Each bracelet uses 1/3 of a yard. How many bracelets can you make from the yarn you have left? Work out 5/6 ÷ 1/3.`, solution: `2 and 1/2 groups, since 5/6 ÷ 1/3 = 5/2: enough yarn for 2 full bracelets plus half of a third` },
      relatedLoIds: ['m6math.meaning-of-fraction-division'],
    },
  ],
  pointers: [
    { content: `Students often say "1/3 of a pan" — Division counts groups, it does not remove an amount. A number line marked off in thirds and shaded to 2/3 shows exactly 2 jumps of 1/3, so 2/3 ÷ 1/3 = 2 groups, not a leftover amount of pan.`, kind: 'common-error' },
    { content: `Students often say "2/9 of a pan" — Dividing by a fraction smaller than 1 always gives more groups, not less, so an answer smaller than the amount you started with is a warning sign. Counting 1/3-size groups on the model shows 2 groups fit inside 2/3, so 2/3 ÷ 1/3 = 2.`, kind: 'common-error' },
    { content: `Dividing by a fraction asks how many groups of that size fit inside the amount you have.`, kind: 'tip' },
    { content: `A number line marked off in the size of the divisor lets you count the groups directly, jump by jump.`, kind: 'tip' },
    { content: `An area model shows the same count a different way: shade the dividend on a bar, then count how many divisor-size strips fit inside the shaded part.`, kind: 'tip' },
    { content: `Rewriting both fractions with a common denominator turns the question into counting same-size pieces.`, kind: 'tip' },
    { content: `A leftover piece that does not fill a whole group is a fraction of one more group, not a whole extra group.`, kind: 'tip' },
    { content: `Dividing by a fraction smaller than 1 gives MORE groups than you started with, not fewer; a smaller answer is a sign that something went wrong.`, kind: 'tip' },
  ],
};
