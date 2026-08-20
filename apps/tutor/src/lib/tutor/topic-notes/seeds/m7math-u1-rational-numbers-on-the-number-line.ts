/**
 * Grade 7 Math — Unit 1 CED 1.2: Rational Numbers on the Number Line.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.rational-numbers-on-the-number-line.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U1_RATIONAL_NUMBERS_ON_THE_NUMBER_LINE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.rational-numbers-on-the-number-line.v1',
  course: 'Grade 7 Math',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Rational Numbers on the Number Line',
  planId: 'evelyn.ms.m7math.rational-numbers-on-the-number-line.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.rational-numbers-on-the-number-line.v1' }],
  theory: [
    { loId: 'm7math.rational-numbers-on-the-number-line', content: `A RATIONAL NUMBER IS ANY NUMBER YOU CAN WRITE AS A FRACTION of two integers, with a bottom number that is not zero. That is a bigger club than it sounds. Integers join, because 6 is 6/1. Decimals that stop join, because 2.5 is 5/2. Negatives join, because −3/4 is (−3)/4.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', content: `THE DENOMINATOR SAYS HOW FINELY TO CUT, the numerator says how many pieces to count. To place 3/4, cut each unit on the line into 4 equal pieces and count 3 of them starting from zero. To place −3/4, cut the same way and count 3 pieces to the LEFT of zero instead.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'framework', title: 'Negative fractions are mirror images', content: `NEGATIVE FRACTIONS ARE MIRROR IMAGES — −3/4 sits exactly as far from zero as 3/4, just on the other side. That is why the minus sign can ride anywhere without changing the number: −3/4 and (−3)/4 and −(3/4) are one number in three costumes.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', content: `A DECIMAL WITH A WHOLE PART GOES PAST THE FIRST INTEGER. To place −1.25, travel one full unit left to reach −1, then keep going a quarter more. So −1.25 lands between −1 and −2. The single biggest placement mistake is looking at the 25 and dropping it between 0 and −1, which would be −0.25, a completely different point.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'framework', title: 'Equivalent forms are one point with many names', content: `EQUIVALENT FORMS ARE ONE POINT WITH MANY NAMES — 1/2, 2/4, 4/8, 0.5 and 50/100 all mark the identical spot. Nothing on the line moves when you simplify a fraction or rewrite it as a decimal. You only changed the label.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', content: `DIVIDE TOP BY BOTTOM TO GET THE DECIMAL, and the division ends one of two ways. Either the remainder hits zero and the decimal stops, like 3/4 = 0.75, or a remainder comes back around and the digits repeat forever, like 1/3 = 0.333… Both kinds are still rational, and both still sit at exactly one point.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'definition', title: 'rational number', content: `any number that can be written as one integer over another, with the bottom one not zero.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'definition', title: 'numerator', content: 'the top number of a fraction — how many equal pieces you count.' },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'definition', title: 'denominator', content: `the bottom number of a fraction — how many equal pieces each whole unit is cut into.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'definition', title: 'terminating decimal', content: `a decimal whose digits stop, such as 0.75, because the division reaches a remainder of zero.` },
    { loId: 'm7math.rational-numbers-on-the-number-line', kind: 'definition', title: 'repeating decimal', content: 'a decimal whose digits go on forever in a pattern, such as 0.333…' },
  ],
  methods: [
    {
      title: 'Worked place three numbers',
      steps: [
        `Draw the line and mark the whole numbers first: −2, −1, 0, 1, 2, 3. Those are your fence posts, and everything else goes between them.`,
        `Place −3/4. The denominator is 4, so cut each unit into 4 equal pieces. Count 3 of those pieces to the LEFT of zero. That lands between −1 and 0, and it is closer to −1, because 3 pieces out of 4 is more than half the way across.`,
        `Place 2.5. Point five means half a unit, so 2.5 sits exactly halfway between 2 and 3.`,
        `Place −1.25. Travel one whole unit left to reach −1, then keep going a quarter of a unit further left. So −1.25 sits between −1 and −2, a quarter of the way from −1 toward −2. WRONG placement to avoid: dropping it between 0 and −1 because the 25 looks small. RIGHT placement: between −1 and −2.`,
        `Read the finished line left to right, which is always least to greatest: −1.25, then −3/4, then 2.5. In decimals that is −1.25, −0.75, 2.5, and those are clearly in order.`,
      ],
      example: { problem: `Place −3/4, 2.5 and −1.25 on a number line, then read them off from least to greatest.`, solution: 'From left to right: −1.25, then −3/4, then 2.5' },
      relatedLoIds: ['m7math.rational-numbers-on-the-number-line'],
    },
    {
      title: 'Worked fraction to decimal',
      steps: [
        `A fraction bar is a division sign. 3/8 means 3 ÷ 8, so put a decimal point after the 3 and add zeros: 3.000 ÷ 8.`,
        `Divide step by step. 30 ÷ 8 = 3 with 6 left over, so the first digit is 0.3. Bring down a zero: 60 ÷ 8 = 7 with 4 left over, so now 0.37. Bring down a zero: 40 ÷ 8 = 5 with 0 left over, so 0.375 and the remainder is zero. The decimal stops. 3/8 = 0.375. Check it: 0.375 × 8 = 3.`,
        `Now 2/3, which means 2 ÷ 3. 20 ÷ 3 = 6 with 2 left over, giving 0.6. Bring down a zero: 20 ÷ 3 = 6 with 2 left over again. The same remainder came back, so the 6 repeats forever. 2/3 = 0.666…, written with a bar over the 6. It never stops, but it is still one single point, sitting just past 0.6 and just short of 0.7.`,
        `For 6/16, look for a common factor before dividing. Both 6 and 16 divide by 2, giving 3/8. That is the same fraction you already placed, so 6/16 lands on exactly the same point: 0.375. Simplifying renamed it and moved it nowhere.`,
      ],
      example: { problem: 'Write 3/8 and 2/3 as decimals. Then say which point 6/16 lands on.', solution: `3/8 = 0.375, 2/3 = 0.666… (repeating), and 6/16 sits at the same point as 3/8, which is 0.375` },
      relatedLoIds: ['m7math.rational-numbers-on-the-number-line'],
    },
  ],
  pointers: [
    { content: `Students often say "between 0 and −1" — −1.25 is one whole unit and a quarter away from zero. That first whole unit already carries you all the way to −1, and the extra 0.25 keeps traveling left from there. So −1.25 sits between −1 and −2, a quarter of the way from −1 toward −2. Say the number out loud as "one and a quarter, on the negative side" and the whole unit stops disappearing.`, kind: 'common-error' },
    { content: `Students often say "−1.75" — Always travel outward from zero. One full unit left puts you on −1, and the 0.25 is the next part of that same trip, so keep going left a quarter more. That is −1.25. Counting a quarter up from −2 gives −1.75, which is a different point entirely.`, kind: 'common-error' },
    { content: `A rational number is anything you can write as one integer over another, so integers, terminating decimals and negative fractions are all rational.`, kind: 'tip' },
    { content: `The denominator says how many equal pieces to cut each unit into; the numerator says how many pieces to count, left of zero if the number is negative.`, kind: 'tip' },
    { content: `A decimal with a whole part goes past the first integer: −1.25 sits between −1 and −2, never between 0 and −1.`, kind: 'tip' },
    { content: `Equivalent forms are one point with many names — 6/16, 3/8 and 0.375 are the same spot on the line.`, kind: 'tip' },
    { content: `Divide top by bottom to get the decimal. It either stops, like 3/8 = 0.375, or repeats forever, like 2/3 = 0.666…`, kind: 'tip' },
    { content: `For negative decimals, read the whole part FIRST. −1.25 goes between −1 and −2, not between 0 and −1. Say it out loud: "one and a quarter to the left of zero."`, kind: 'common-error' },
    { content: `When you step past a whole number on the negative side, keep moving LEFT from that fence post. From −1, a quarter more left is −1.25. Counting a quarter right from −2 gives −1.75 — a different point.`, kind: 'gotcha' },
    { content: `Simplifying or converting only renames a number — it never moves it. 6/16, 3/8, and 0.375 are one point with three labels. Same for 1/2, 2/4, and 0.5.`, kind: 'tip' },
    { content: `Numerator = top = how many pieces you count. Denominator = bottom = how many pieces each unit is cut into. Mixing them up turns 3/4 into 4/3 and lands you on the wrong side of 1.`, kind: 'vocab-note' },
    { content: `The minus sign can sit anywhere: −3/4, (−3)/4, and −(3/4) are the same number. Don't make two different marks on the line for them.`, kind: 'vocab-note' },
    { content: `A repeating decimal like 0.666… is still ONE exact point, and it's still rational. Don't round it to 0.67 and call that the same number — write the bar over the repeating digit instead.`, kind: 'edge-case' },
    { content: `The fraction bar means divide: 3/8 is 3 ÷ 8, not 8 ÷ 3. Put the top number inside the division box. Check your answer by multiplying back: 0.375 × 8 = 3.`, kind: 'common-error' },
    { content: `Left to right on the number line is ALWAYS least to greatest, even with negatives. −1.25 is less than −0.75 even though 1.25 looks bigger than 0.75.`, kind: 'gotcha' },
  ],
};
