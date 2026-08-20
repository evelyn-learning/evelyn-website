/**
 * Grade 7 Math — Unit 1 CED 1.4: Converting Fractions, Decimals & Percents.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.fractions-decimals-percents.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U1_FRACTIONS_DECIMALS_PERCENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.fractions-decimals-percents.v1',
  course: 'Grade 7 Math',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Converting Fractions, Decimals & Percents',
  planId: 'evelyn.ms.m7math.fractions-decimals-percents.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.fractions-decimals-percents.v1' }],
  theory: [
    { loId: 'm7math.fractions-decimals-percents', kind: 'framework', title: 'Three names, one number', content: `THREE NAMES, ONE NUMBER — 3/4 and 0.75 and 75% all mark the same point on the number line. The word percent means "out of one hundred", so 75% is a shorthand for 75/100. That is the key that unlocks every conversion below.` },
    { loId: 'm7math.fractions-decimals-percents', content: `FRACTION TO DECIMAL: DIVIDE TOP BY BOTTOM. The fraction bar IS a division sign, so 3/4 means 3 ÷ 4 = 0.75. Direction matters and is easy to flip by accident: 4 ÷ 3 gives 1.333…, which is a different number. Since 3/4 is less than a whole, its decimal has to be less than 1 — that is a free check.` },
    { loId: 'm7math.fractions-decimals-percents', content: `THE DIVISION ENDS ONE OF TWO WAYS. Either the remainder reaches zero and the digits stop, giving a terminating decimal like 3/8 = 0.375, or an old remainder comes back around and the digits repeat forever, giving a repeating decimal like 1/3 = 0.333… A repeating decimal is written with a bar over the part that repeats. Both kinds are still rational numbers.` },
    { loId: 'm7math.fractions-decimals-percents', content: `DECIMAL TO PERCENT: MULTIPLY BY 100, SO THE POINT SLIDES TWO PLACES RIGHT. 0.75 becomes 75%. Percent to decimal: divide by 100, so the point slides two places LEFT, and 8% becomes 0.08.` },
    { loId: 'm7math.fractions-decimals-percents', content: `WHICH DIRECTION? DECIDE IT BY SIZE, NEVER BY MEMORY. The percent number always LOOKS a hundred times bigger than its decimal, because it counts hundredths instead of ones. So heading toward a percent the number grows and the point goes right, and coming away from a percent the number shrinks and the point goes left. Test every answer against something you already know: one half is 0.5 and 50%, so if your rule turns 0.5 into 0.005% you slid the wrong way.` },
    { loId: 'm7math.fractions-decimals-percents', content: `PERCENT TO FRACTION: WRITE IT OVER 100, THEN SIMPLIFY. 40% = 40/100 = 2/5, and 24% = 24/100 = 6/25. Going the other way, a fraction becomes a percent either by dividing into a decimal and sliding right, or by building an equivalent fraction with 100 on the bottom: 7/20 = 35/100 = 35%.` },
    { loId: 'm7math.fractions-decimals-percents', kind: 'definition', title: 'percent', content: 'a number of hundredths, written with the % sign — 25% means 25 out of 100.' },
    { loId: 'm7math.fractions-decimals-percents', kind: 'definition', title: 'terminating decimal', content: 'a decimal whose digits stop, because the division reaches a remainder of zero.' },
    { loId: 'm7math.fractions-decimals-percents', kind: 'definition', title: 'repeating decimal', content: `a decimal whose digits repeat forever in a pattern, written with a bar over the repeating part.` },
  ],
  methods: [
    {
      title: 'Worked fill the triangle',
      steps: [
        `Start with 5/8. The bar means divide, so work out 5 ÷ 8. Write the 5 as 5.000 and divide: 50 ÷ 8 = 6 with 2 left over, giving 0.6. Bring down a zero: 20 ÷ 8 = 2 with 4 left over, giving 0.62. Bring down a zero: 40 ÷ 8 = 5 with 0 left over, giving 0.625. The remainder is zero, so it terminates. 5/8 = 0.625, and 0.625 × 8 = 5 confirms it.`,
        `Turn 0.625 into a percent by multiplying by 100, which slides the point two places right: 0.625 becomes 62.5%. Check the size: 5/8 is a little more than half, and 62.5% is a little more than 50%. That fits.`,
        `Now 24%. To reach a decimal, divide by 100, which slides the point two places LEFT. Write 24 as 24.0 and slide: 24% = 0.24. Check the size: 24% is close to a quarter, and 0.24 is close to a quarter. That fits too.`,
        `To reach a fraction, use what percent means and write it over 100: 24% = 24/100. Both numbers divide by 4, so 24 ÷ 4 = 6 and 100 ÷ 4 = 25, giving 6/25. Check by dividing back: 6 ÷ 25 = 0.24, which matches the decimal from the previous step.`,
      ],
      example: { problem: `Write 5/8 as a decimal and a percent. Then write 24% as a decimal and as a fraction in simplest form.`, solution: '5/8 = 0.625 = 62.5%, and 24% = 0.24 = 6/25' },
      relatedLoIds: ['m7math.fractions-decimals-percents'],
    },
    {
      title: 'Worked repeating and shortcut',
      steps: [
        `For 1/3, divide 1 ÷ 3. Write 1 as 1.000. Then 10 ÷ 3 = 3 with 1 left over, giving 0.3. Bring down a zero: 10 ÷ 3 = 3 with 1 left over again. The remainder 1 has come back, so the same step will repeat forever. 1/3 = 0.333…, written with a bar over the 3.`,
        `To a percent, multiply by 100 and slide the point two places right: 0.333… becomes 33.333…%, which people usually write as 33 1/3 percent. Check it against something known: one third of 100 is 33 and a third, so 33 1/3 % is exactly right.`,
        `For 7/20, look at the denominator before dividing. 20 × 5 = 100, so an equivalent fraction with 100 on the bottom is one step away. Multiply top and bottom by 5: 7 × 5 = 35 and 20 × 5 = 100, giving 35/100.`,
        `A fraction over 100 is already a percent, so 7/20 = 35%. Slide the point two places LEFT to read off the decimal: 35% = 0.35.`,
        `Confirm with division: 7 ÷ 20 = 0.35, and 20 × 0.35 = 7. The shortcut and the long way agree.`,
      ],
      example: { problem: `Write 1/3 as a decimal and as a percent. Then write 7/20 as a decimal and a percent without long division.`, solution: '1/3 = 0.333… = 33 1/3 %, and 7/20 = 0.35 = 35%' },
      relatedLoIds: ['m7math.fractions-decimals-percents'],
    },
  ],
  pointers: [
    { content: `Students often say "4%" — Write 0.4 as 0.40 first, so both hundredths places are visible. Multiplying by 100 slides the point two places right: 0.40 becomes 40, so 0.4 = 40%. Check it by size — 0.4 is a bit less than half, and 40% is a bit less than half, while 4% is a tiny sliver. Whenever the size check fails, you slid the wrong number of places.`, kind: 'common-error' },
    { content: `Students often say "0.4%" — The percent sign changes what the number counts: it counts hundredths instead of ones. So 0.4 means four tenths, but 0.4% means 0.4 out of 100, which is only 0.004. To cross from decimal to percent you must multiply by 100 first: 0.4 × 100 = 40, so 0.4 = 40%.`, kind: 'common-error' },
    { content: `A fraction, a decimal and a percent are three names for one number: 3/4 = 0.75 = 75%.`, kind: 'tip' },
    { content: 'Fraction to decimal means divide TOP by BOTTOM: 5/8 = 5 ÷ 8 = 0.625, not 8 ÷ 5.', kind: 'tip' },
    { content: `The division either stops, like 3/8 = 0.375, or repeats forever, like 1/3 = 0.333…`, kind: 'tip' },
    { content: `To a percent, multiply by 100 and slide the point two places RIGHT; from a percent, divide by 100 and slide two places LEFT. So 0.4 = 40% and 8% = 0.08.`, kind: 'tip' },
    { content: 'Percent to fraction means write it over 100 and simplify: 24% = 24/100 = 6/25.', kind: 'tip' },
    { content: `Divide TOP by BOTTOM, not bottom by top. 5/8 means 5 ÷ 8 = 0.625. If you get 1.6, you flipped it. Quick check: a fraction less than 1 must give a decimal less than 1.`, kind: 'common-error' },
    { content: `Don't just erase the "0." to make a percent. 0.4 is NOT 4%. Write it as 0.40 first, then slide two places: 0.4 = 40%.`, kind: 'common-error' },
    { content: `The % sign is not a unit like cm — it changes the number. 0.4 means four tenths, but 0.4% means 0.4 out of 100 = 0.004. You must multiply by 100 before you can attach %.`, kind: 'vocab-note' },
    { content: `Percents don't have to be whole numbers. 5/8 = 62.5% and 1/3 = 33 1/3 %. Don't round 62.5% to 63% or drop the .5 unless the problem asks you to.`, kind: 'edge-case' },
    { content: `Percents under 1 and over 100 are real. 0.5% = 0.005 (half of one percent) and 150% = 1.5. Sliding two places still works — just add zeros as placeholders.`, kind: 'edge-case' },
    { content: `A repeating decimal needs the bar over ONLY the repeating digits. 1/3 = 0.3 with a bar over the 3. Writing 0.33 or 0.333 without the bar is a different, smaller number.`, kind: 'vocab-note' },
    { content: `Before long division, peek at the denominator. If it divides into 100 (4, 5, 10, 20, 25, 50), build an equivalent fraction over 100 instead — 7/20 = 35/100 = 35% in one step.`, kind: 'tip' },
    { content: `After writing a percent over 100, don't stop — simplify. 24% = 24/100 = 6/25. Check by dividing back: 6 ÷ 25 = 0.24, which should match your decimal.`, kind: 'gotcha' },
  ],
};
