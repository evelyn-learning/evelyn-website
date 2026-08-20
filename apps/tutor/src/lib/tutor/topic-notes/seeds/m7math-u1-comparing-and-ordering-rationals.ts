/**
 * Grade 7 Math — Unit 1 CED 1.3: Comparing & Ordering Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.comparing-and-ordering-rationals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U1_COMPARING_AND_ORDERING_RATIONALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.comparing-and-ordering-rationals.v1',
  course: 'Grade 7 Math',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Comparing & Ordering Rational Numbers',
  planId: 'evelyn.ms.m7math.comparing-and-ordering-rationals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.comparing-and-ordering-rationals.v1' }],
  theory: [
    { loId: 'm7math.comparing-and-ordering-rationals', content: `FURTHER RIGHT ON THE LINE IS ALWAYS GREATER. That is the only comparison rule there is, and it never breaks. Every trick below is just a way of finding out which number sits further right. The symbol < points its narrow end at the smaller number and opens its wide end toward the bigger one, so 3 < 8 and −8 < −3.` },
    { loId: 'm7math.comparing-and-ordering-rationals', content: `AMONG NEGATIVES, THE BIGGER THE ABSOLUTE VALUE, THE SMALLER THE NUMBER. −7 sits seven units left of zero and −2 sits only two units left, so −7 < −2. Think about money you owe: owing $7 leaves you worse off than owing $2. This is the single mistake this lesson exists to stop.` },
    { loId: 'm7math.comparing-and-ordering-rationals', content: `ZERO AND SIGNS SETTLE MOST COMPARISONS INSTANTLY. Every positive number is greater than zero, and zero is greater than every negative number, so every positive beats every negative no matter how the digits look. 0.01 is greater than −500. Sort a list into negatives, zero, and positives first, and half the work is already done.` },
    { loId: 'm7math.comparing-and-ordering-rationals', content: `TO COMPARE TWO FRACTIONS, PUT THEM IN THE SAME UNITS. Either rewrite them with a common denominator or divide each one into a decimal. Compare 3/5 and 5/8 with a denominator of 40: 3/5 = 24/40 and 5/8 = 25/40, so 5/8 is larger. As decimals, 0.6 against 0.625 says the same thing.` },
    { loId: 'm7math.comparing-and-ordering-rationals', content: `LINE UP THE DECIMAL PLACES BEFORE YOU COMPARE. More digits does not mean bigger. To compare 0.4 and 0.35, write 0.40 and 0.35, and now it is plain that 0.40 is larger. Padding with zeros on the right never changes a number, it just makes the columns match.` },
    { loId: 'm7math.comparing-and-ordering-rationals', content: `TO ORDER A MIXED SET, CONVERT EVERYTHING TO DECIMALS FIRST, sort with the number line, then rewrite the answer in the forms the question used. Least to greatest means reading the line left to right.` },
    { loId: 'm7math.comparing-and-ordering-rationals', kind: 'definition', title: 'common denominator', content: 'a shared bottom number that lets two fractions be compared piece for piece.' },
    { loId: 'm7math.comparing-and-ordering-rationals', kind: 'definition', title: 'least to greatest', content: 'the order you get by reading the number line from left to right.' },
    { loId: 'm7math.comparing-and-ordering-rationals', kind: 'definition', title: 'absolute value', content: `the distance a number sits from zero, which tells you how far left a negative number goes.` },
  ],
  methods: [
    {
      title: 'Worked two negatives',
      steps: [
        `Get both numbers into the same notation. The fraction bar means divide, so 3/4 = 3 ÷ 4 = 0.75, which makes −3/4 the same number as −0.75.`,
        `Compare the sizes first, with the signs set aside. Line up the decimal places: 0.75 against 0.70. Seventy-five hundredths is more than seventy hundredths, so 0.75 is the bigger size.`,
        `Now bring the signs back. Both numbers are negative, so a bigger size means a longer trip LEFT from zero. −0.75 sits further left than −0.70.`,
        `Further left is smaller. So −3/4 < −0.7, which means −0.7 is the greater number. WRONG answer to avoid: saying −3/4 is greater because 0.75 beats 0.7. RIGHT answer: −0.7 is greater, because it sits closer to zero.`,
        `Sanity check on the line: mark −1 and 0, cut the gap into quarters. −0.75 lands on the third mark left of zero, and −0.70 lands a little to the right of it. The picture agrees.`,
      ],
      example: { problem: 'Which is greater, −3/4 or −0.7?', solution: '−0.7 is greater, so −3/4 < −0.7' },
      relatedLoIds: ['m7math.comparing-and-ordering-rationals'],
    },
    {
      title: 'Worked order mixed set',
      steps: [
        `Turn every number into a decimal so one rule can handle all of them. 2/5 = 2 ÷ 5 = 0.4. And 3/4 = 0.75, so −3/4 = −0.75. The list is now 0.4, −1.5, 0, −0.75, 1.2.`,
        `Split the list by sign. Negatives: −1.5 and −0.75. Then zero. Then the positives: 0.4 and 1.2. Every negative is smaller than zero, and zero is smaller than every positive, so the three groups are already in order.`,
        `Order inside the negatives. The size 1.5 is bigger than the size 0.75, so −1.5 sits further left, and further left is smaller. That gives −1.5 first, then −0.75.`,
        'Order inside the positives. 0.4 is less than 1.2, so 0.4 comes first.',
        `Glue the groups together: −1.5, −0.75, 0, 0.4, 1.2. Then switch back to the forms the question used, because that is the answer it asked for.`,
      ],
      example: { problem: 'Order from least to greatest: 2/5, −1.5, 0, −3/4, 1.2', solution: '−1.5, −3/4, 0, 2/5, 1.2' },
      relatedLoIds: ['m7math.comparing-and-ordering-rationals'],
    },
  ],
  pointers: [
    { content: `Students often say "−7 > −2" — On the number line, −7 sits seven units to the LEFT of zero while −2 sits only two units left. Further left is smaller, so −7 < −2. The money version makes it obvious: owing $7 leaves you worse off than owing $2. With negatives, the number with the LARGER absolute value is the SMALLER number.`, kind: 'common-error' },
    { content: `Students often say "−0.75 > −0.7" — Line the decimals up as 0.75 and 0.70. The size 0.75 is indeed bigger, and that is exactly why −0.75 sits FURTHER LEFT than −0.70. Further left is smaller, so −0.75 < −0.7. Compare the sizes first, then flip the result whenever both numbers are negative.`, kind: 'common-error' },
    { content: `Further right on the number line is always greater. Every other rule is just a way of finding out which number sits further right.`, kind: 'tip' },
    { content: `Among negatives, the larger the absolute value the smaller the number: −7 < −2, and −0.75 < −0.7.`, kind: 'tip' },
    { content: `Every positive beats zero, and zero beats every negative, so sort a list by sign before doing any arithmetic.`, kind: 'tip' },
    { content: `To compare fractions, give them a common denominator or divide each into a decimal: 3/5 = 0.6 is less than 5/8 = 0.625.`, kind: 'tip' },
    { content: `Line up decimal places before comparing. Writing 0.4 as 0.40 shows at once that it is greater than 0.35.`, kind: 'tip' },
    { content: `With two negatives, compare the sizes first, then FLIP the result. 0.75 > 0.70, so −0.75 < −0.70. If you skip the flip you'll answer backwards every time.`, kind: 'common-error' },
    { content: `More digits does NOT mean bigger. 0.4 beats 0.35 — pad it to 0.40 and compare column by column. Only add zeros on the RIGHT of a decimal; 0.4 → 0.40 is fine, 0.4 → 0.04 is a different number.`, kind: 'gotcha' },
    { content: `Read < and > as directions on the number line, not as "bigger digits". The narrow point aims at the smaller number. Check your symbol by asking: is the left number further left on the line?`, kind: 'vocab-note' },
    { content: `Absolute value = distance from zero, not the answer to "which is greater". |−7| = 7 and |−2| = 2, but −7 < −2. Use absolute value to find how far LEFT a negative sits, then remember further left is smaller.`, kind: 'vocab-note' },
    { content: `Sort by sign before any arithmetic: all negatives < 0 < all positives. Don't waste time converting −500 and 0.01 — the signs already decide it.`, kind: 'tip' },
    { content: `When negatives share the whole-number part, line up the decimals: −4.2 = −4.20, −4.8 = −4.80, −4.02. Sizes 4.02 < 4.20 < 4.80, so flipped: −4.8 < −4.2 < −4.02. −4.02 is the greatest.`, kind: 'edge-case' },
    { content: `"Least to greatest" means left to right on the number line. If you accidentally list greatest first, the whole answer is wrong even though every comparison was right — reread the direction word before you write.`, kind: 'common-error' },
    { content: `Decimals are your scratch work, not your answer. If the question lists 2/5 and −3/4, give back 2/5 and −3/4 in the sorted order, not 0.4 and −0.75.`, kind: 'tip' },
  ],
};
