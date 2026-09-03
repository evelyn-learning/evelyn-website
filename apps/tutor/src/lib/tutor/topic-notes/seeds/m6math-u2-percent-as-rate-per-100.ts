/**
 * Grade 6 Math — Unit 2 CED 2.1: Percent as a Rate per 100.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.percent-as-rate-per-100.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U2_PERCENT_AS_RATE_PER_100: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.percent-as-rate-per-100.v1',
  course: 'Grade 6 Math',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Percent as a Rate per 100',
  planId: 'evelyn.ms.m6math.percent-as-rate-per-100.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.percent-as-rate-per-100.v1' }],
  theory: [
    { loId: 'm6math.percent-as-rate-per-100', content: `PERCENT MEANS "PER HUNDRED" — the word percent always compares a number to 100 equal parts. 60% means 60 out of every 100 equal parts, whether those parts are a download bar, a bag of marbles, or a whole class of students.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'framework', title: 'A percent is already a fraction over 100', content: `A PERCENT IS ALREADY A FRACTION OVER 100 — drop the % sign and write the number over 100: 60% = 60/100. The percent sign is just a shortcut for "out of 100"; writing the sign and writing /100 say the exact same thing.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'framework', title: 'Simplify the fraction if asked, but the rate does not change', content: `SIMPLIFY THE FRACTION IF ASKED, BUT THE RATE DOES NOT CHANGE — 60/100 simplifies to 3/5 by dividing the top and the bottom by 20, their greatest common factor. 60% and 3/5 name the exact same rate; only the way it is written has changed.` },
    { loId: 'm6math.percent-as-rate-per-100', content: `PERCENT TO DECIMAL: DIVIDE BY 100, SO THE POINT SLIDES TWO PLACES LEFT — dividing by 100 always slides a decimal point two places to the left. Write 60% as 60. first so both places are visible, then slide: 60. becomes 0.60, which is written 0.6. A small percent needs a placeholder zero: 7% is 07. first, then 0.07.` },
    { loId: 'm6math.percent-as-rate-per-100', content: `DECIMAL TO PERCENT: MULTIPLY BY 100, SO THE POINT SLIDES TWO PLACES RIGHT — the opposite move. 0.6 becomes 60., so 0.6 = 60%. Check every slide against something you already know: half of a whole is 0.5 and 50%, so if a rule ever turns 0.5 into 5%, the slide went the wrong number of places.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'framework', title: 'A hundredths grid makes the rate visible', content: `A HUNDREDTHS GRID MAKES THE RATE VISIBLE — picture a square split into 100 identical smaller squares. Shading 60 of them shows 60% at a glance, and that same shaded picture is also 60/100 and 0.60 — three names, one picture.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'definition', title: 'percent', content: `a rate that always compares a number to 100 equal parts; the % sign is shorthand for "out of 100."` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'definition', title: 'equivalent forms', content: `a percent, a fraction, and a decimal that name the exact same rate, such as 60%, 3/5, and 0.6.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'definition', title: 'hundredths grid', content: `a square split into 100 identical smaller squares, used to picture a percent by shading that many squares.` },
    { loId: 'm6math.percent-as-rate-per-100', kind: 'definition', title: 'simplest form', content: `a fraction written with the smallest possible whole numbers on top and bottom, found by dividing both by their greatest common factor.` },
  ],
  methods: [
    {
      title: 'Worked download bar',
      steps: [
        `Percent means per hundred, so write 60% as a fraction with 100 on the bottom: 60/100.`,
        `Find the greatest common factor of 60 and 100 to simplify. Both divide evenly by 20: 60 ÷ 20 = 3, and 100 ÷ 20 = 5. So 60/100 = 3/5.`,
        `Check the simplification by scaling back up: 3/5 × 20/20 = 60/100, which matches where you started.`,
        `To write 60% as a decimal, divide by 100, sliding the decimal point two places left: 60. becomes 0.60, which is written 0.6.`,
        `Check by converting back: 0.6 × 100 = 60, and 60 written with a % sign is 60%. That matches the loading bar you started with.`,
      ],
      example: { problem: `The loading bar for a game update shows 60%. Write 60% as a fraction in simplest form and as a decimal.`, solution: '3/5 and 0.6' },
      relatedLoIds: ['m6math.percent-as-rate-per-100'],
    },
    {
      title: 'Worked quarter of the class',
      steps: [
        `To turn a fraction into a percent, look for a number that scales the denominator up to 100. 4 × 25 = 100, so multiply the top and the bottom by 25.`,
        '1 × 25 = 25, and 4 × 25 = 100, so 1/4 = 25/100.',
        `A fraction with 100 on the bottom already tells you the percent directly: 25/100 = 25%.`,
        `WRONG: writing 1/4 as 1% because the numerator is 1. CORRECT: a percent compares to the whole fraction, not just the top number, so the fraction must be scaled until the denominator is 100 before you can read off the percent. That gives 25%, not 1%.`,
        `To find the decimal, divide the percent by 100, sliding the point two places left: 25% becomes 0.25.`,
        `Check by scaling back down: 25/100 divided by 25 on top and bottom is 1/4, which is exactly the fraction you started with, and 0.25 × 100 = 25 confirms the percent too.`,
      ],
      example: { problem: `In one class at school, 1/4 of the students play a musical instrument. Write 1/4 as a percent and as a decimal.`, solution: '25% and 0.25' },
      relatedLoIds: ['m6math.percent-as-rate-per-100'],
    },
  ],
  pointers: [
    { content: `Students often say "0.7" — Percent to decimal always divides by 100, which slides the point two places left. Write 7% as 07. first so both places are visible, then slide twice: 07. becomes 0.07. Check the size: 7% is a small slice, much less than one tenth, and 0.07 is small too, while 0.7 is nearly a whole. Whenever the size check fails, the slide went the wrong number of places.`, kind: 'common-error' },
    { content: `Students often say "0.5%" — Decimal to percent means multiply by 100, which slides the point two places right: 0.5 becomes 0.50, then 50., so 0.5 = 50%. The percent sign changes what the digits count, hundredths instead of ones, so it cannot simply be added on. 0.5% would mean only five-tenths of one percent, a much smaller rate than 0.5 itself.`, kind: 'common-error' },
    { content: `Percent means per hundred: a percent always compares a number to 100 equal parts.`, kind: 'tip' },
    { content: 'A percent is already a fraction over 100: 60% = 60/100, which simplifies to 3/5.', kind: 'tip' },
    { content: `Percent to decimal: divide by 100 and slide the decimal point two places LEFT, using a placeholder zero for small percents, such as 7% = 0.07.`, kind: 'tip' },
    { content: `Decimal to percent: multiply by 100 and slide the decimal point two places RIGHT, so 0.6 = 60%.`, kind: 'tip' },
    { content: `To turn a fraction into a percent, scale it so the denominator becomes 100, then read the numerator as the percent: 1/4 = 25/100 = 25%.`, kind: 'tip' },
    { content: `A hundredths grid shows all three forms in one picture: shading 60 of 100 squares is 60%, 60/100, and 0.60 at once.`, kind: 'tip' },
  ],
};
