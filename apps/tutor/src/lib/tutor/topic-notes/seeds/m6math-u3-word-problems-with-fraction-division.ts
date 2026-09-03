/**
 * Grade 6 Math — Unit 3 CED 3.4: Word Problems with Fraction Division.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.word-problems-with-fraction-division.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U3_WORD_PROBLEMS_WITH_FRACTION_DIVISION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.word-problems-with-fraction-division.v1',
  course: 'Grade 6 Math',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Word Problems with Fraction Division',
  planId: 'evelyn.ms.m6math.word-problems-with-fraction-division.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.word-problems-with-fraction-division.v1' }],
  theory: [
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'framework', title: 'How many groups fit inside', content: `HOW MANY GROUPS FIT INSIDE — most fraction word problems in this lesson ask one question in different clothes: how many groups of a certain size fit inside a total amount? "How many bags," "how many bows," "how many bottles," and "how many batches" are all that same question, and that question is division.` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'framework', title: 'The total comes first, the group size comes second', content: `THE TOTAL COMES FIRST, THE GROUP SIZE COMES SECOND — call the amount you start with the total, and the size of one bag, bow, or batch the group size. The division always reads total divided by group size, never the other way around. Setting it up backward answers a completely different question.` },
    { loId: 'm6math.word-problems-with-fraction-division', content: `THE WORD "OF" IS A MULTIPLY SIGNAL, NOT A DIVIDE SIGNAL — a problem that asks for a fraction OF an amount, like "what is 2/3 of 9 dollars," is multiplication. A problem that asks how many equal-sized pieces fit inside an amount is division. Read for which question is actually being asked before you pick an operation.` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'framework', title: 'A mixed number is just another number in the setup', content: `A MIXED NUMBER IS JUST ANOTHER NUMBER IN THE SETUP — if the total or the group size is a mixed number, convert it to an improper fraction first, the same way you learned in the last lesson. The rule for which number is the total and which is the group size does not change just because one of the numbers is mixed.` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'framework', title: 'Check the setup, then check the answer', content: `CHECK THE SETUP, THEN CHECK THE ANSWER — before you compute, say the division out loud as a full sentence and make sure it matches the question. After you compute, check the answer two ways: does its size make sense, and if the question asks for whole groups, does any leftover amount need to be reported separately instead of rounded into the count?` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'definition', title: 'dividend', content: `the total amount you start with in a division word problem; it is written first, before the division sign.` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'definition', title: 'divisor', content: `the size of one group or one share in a division word problem; it is written second, after the division sign.` },
    { loId: 'm6math.word-problems-with-fraction-division', kind: 'definition', title: 'quotient', content: `the answer to a division problem; in a word problem it tells you how many groups you can make, or how much is in one share.` },
  ],
  methods: [
    {
      title: 'Worked ribbon gift bags',
      steps: [
        `Name what you know and what you want. Known: total ribbon is 5 and 1/4 feet, one bow takes 3/4 foot. Unknown: how many bags.`,
        `Restate the question as "how many groups of 3/4 foot fit inside 5 and 1/4 feet?" That phrasing signals division, not multiplication.`,
        `Decide the setup. The total amount you start with, 5 and 1/4 feet, is the dividend. The size of one group, 3/4 foot, is the divisor. So the division is 5 and 1/4 divided by 3/4, not the other way around.`,
        `WRONG: setting it up backward as 3/4 divided by 5 and 1/4. That asks how many 5-and-1/4-foot pieces fit inside 3/4 foot of ribbon, which is not the question at all, and gives 3/4 divided by 21/4 = 3/4 x 4/21 = 12/84 = 1/7, an answer smaller than 1 — that cannot be the number of bags a big spool of ribbon fills. CORRECT: the total goes first, so the setup is 5 and 1/4 divided by 3/4.`,
        'Convert the mixed number: 5 and 1/4 = 21/4.',
        `Run the algorithm you already know. Keep 21/4, change the sign to multiplication, and flip 3/4 to 4/3: 21/4 x 4/3 = 84/12 = 7.`,
        `Check by multiplying back: 7 x 3/4 = 21/4 = 5 and 1/4, which matches the total exactly, so all of the ribbon is used with nothing left over.`,
      ],
      example: { problem: `You have 5 and 1/4 feet of ribbon. Each gift bag takes 3/4 foot to tie a bow. How many gift bags can you tie?`, solution: '7 gift bags' },
      relatedLoIds: ['m6math.word-problems-with-fraction-division'],
    },
    {
      title: 'Worked ribbon spool bows with leftover',
      steps: [
        `Restate the question the same way as before: how many groups of 3/4 foot fit inside 8 and 1/2 feet? The total, 8 and 1/2 feet, is the dividend again.`,
        'Convert the mixed number: 8 and 1/2 = 17/2.',
        'Run keep-change-flip: 17/2 x 4/3 = 68/6.',
        'Simplify: 68/6 = 34/3, which is 11 and 1/3.',
        `Interpret the fraction part. 11 and 1/3 means 11 full groups of 3/4 foot fit inside the ribbon, plus 1/3 of one more group. A bow needs a FULL 3/4 foot, so that leftover third of a group is not enough to tie another bow.`,
        `WRONG: rounding 11 and 1/3 up to 12 bows because 1/3 seems close enough. A bow cannot be tied from part of the ribbon it needs, so any leftover amount smaller than a full group rounds DOWN, never up. CORRECT: keep only the whole number of groups, 11 bows.`,
        `Find the leftover ribbon. The leftover is 1/3 of one group, and one group is 3/4 foot, so the leftover ribbon is 1/3 x 3/4 = 3/12 = 1/4 foot.`,
        `Check by adding back: 11 bows use 11 x 3/4 = 33/4 = 8 and 1/4 feet. Adding the leftover, 8 and 1/4 plus 1/4 = 8 and 1/2 feet, which matches the total. And 1/4 foot is less than the 3/4 foot a twelfth bow would need, so 11 is truly the most bows possible.`,
      ],
      example: { problem: `A different spool holds 8 and 1/2 feet of ribbon. Each bow still takes 3/4 foot. How many whole bows can be made, and how much ribbon is left over?`, solution: '11 bows, with 1/4 foot of ribbon left over' },
      relatedLoIds: ['m6math.word-problems-with-fraction-division'],
    },
  ],
  pointers: [
    { content: `Students often say "1/9" — The total amount of fabric, 7 and 1/2 yards, is always the dividend in a "how many groups fit inside" problem. The correct setup is 7 and 1/2 ÷ 5/6 = 15/2 ÷ 5/6 = 15/2 × 6/5 = 90/10 = 9. Check by multiplying back: 9 × 5/6 = 45/6 = 7 and 1/2, which matches the fabric on hand.`, kind: 'common-error' },
    { content: `Students often say "6 and 1/4" — The phrase "how many scarves" signals counting equal-sized pieces inside a total, which is division, not multiplication. The correct setup is 7 and 1/2 ÷ 5/6 = 9 scarves, and multiplying back confirms it: 9 × 5/6 = 7 and 1/2 yards, all of the fabric used with none left over.`, kind: 'common-error' },
    { content: `Division word problems usually ask "how many groups of a certain size fit inside a total" — that phrasing is the signal to divide.`, kind: 'tip' },
    { content: `The total amount you start with is the dividend; the size of one group or share is the divisor: total divided by group size, always in that order.`, kind: 'tip' },
    { content: `Setting up the division backward answers a completely different question, so name the total before you write anything.`, kind: 'tip' },
    { content: 'The word "of" between two amounts usually signals multiplication, not division.', kind: 'tip' },
    { content: `Convert any mixed number to an improper fraction first; the rule for which number is the total and which is the group size does not change.`, kind: 'tip' },
    { content: `When a problem asks for whole groups, round the quotient DOWN to a whole number, and find the leftover amount separately if the problem asks for it.`, kind: 'tip' },
  ],
};
