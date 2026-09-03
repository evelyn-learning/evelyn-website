/**
 * Grade 6 Math — Unit 2 CED 2.4: Converting Measurement Units.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.converting-measurement-units.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U2_CONVERTING_MEASUREMENT_UNITS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.converting-measurement-units.v1',
  course: 'Grade 6 Math',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Converting Measurement Units',
  planId: 'evelyn.ms.m6math.converting-measurement-units.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.converting-measurement-units.v1' }],
  theory: [
    { loId: 'm6math.converting-measurement-units', kind: 'framework', title: 'A conversion factor is a ratio between equivalent units', content: `A CONVERSION FACTOR IS A RATIO BETWEEN EQUIVALENT UNITS — 1 foot and 12 inches describe the exact same length, just with different units. The ratio 12 inches to 1 foot is a conversion factor, and so is 1000 grams to 1 kilogram.` },
    { loId: 'm6math.converting-measurement-units', kind: 'framework', title: 'Multiplying by a ratio equal to 1 never changes the amount', content: `MULTIPLYING BY A RATIO EQUAL TO 1 NEVER CHANGES THE AMOUNT — 12 inches and 1 foot are the same length, so the ratio 12 inches over 1 foot equals 1. Multiplying a measurement by that ratio changes the units it is written in, not the actual size of the thing you are measuring.` },
    { loId: 'm6math.converting-measurement-units', content: `LARGER UNIT TO SMALLER UNIT: MULTIPLY — a smaller unit needs a bigger number to describe the same amount, so converting a bigger unit, like feet, into a smaller unit, like inches, means multiplying by the conversion factor.` },
    { loId: 'm6math.converting-measurement-units', content: `SMALLER UNIT TO LARGER UNIT: DIVIDE — a bigger unit needs a smaller number to describe the same amount, so converting a smaller unit, like grams, into a bigger unit, like kilograms, means dividing by the conversion factor.` },
    { loId: 'm6math.converting-measurement-units', kind: 'framework', title: 'Check by reversing the operation', content: `CHECK BY REVERSING THE OPERATION — if you multiplied to convert, divide back by the same factor and you should land on the number you started with. If you divided, multiply back. This catches a slip before it becomes a wrong answer.` },
    { loId: 'm6math.converting-measurement-units', kind: 'framework', title: 'Stay inside one system', content: `STAY INSIDE ONE SYSTEM — feet and inches both belong to the US customary system, and grams and kilograms both belong to the metric system. Every conversion in this lesson stays inside one system, and the conversion factor connecting the two units will always be one you already know or one the problem tells you directly.` },
    { loId: 'm6math.converting-measurement-units', kind: 'definition', title: 'conversion factor', content: `the ratio between two equivalent units within the same system of measurement, such as 12 inches in 1 foot, or 1000 grams in 1 kilogram.` },
    { loId: 'm6math.converting-measurement-units', kind: 'definition', title: 'equivalent measurement', content: `two measurements that describe the same actual amount, written with different units, such as 4 feet and 48 inches.` },
    { loId: 'm6math.converting-measurement-units', kind: 'definition', title: 'ratio', content: 'a comparison of two quantities, such as 1000 grams compared to 1 kilogram.' },
  ],
  methods: [
    {
      title: 'Worked feet to inches',
      steps: [
        `Read the question in words first: you need the same length written in a smaller unit, inches instead of feet. Going from a larger unit to a smaller unit means you multiply.`,
        `The conversion factor connecting feet and inches is 12: there are 12 inches in 1 foot.`,
        'Multiply the number of feet by the conversion factor: 4 × 12 = 48.',
        `Check by reversing the operation: divide back, 48 ÷ 12 = 4, which matches the 4 feet you started with.`,
        `Size test: inches is a smaller unit than feet, so the number of inches should be bigger than the number of feet. 48 is bigger than 4, so the answer holds.`,
      ],
      example: { problem: `You are building a raised garden bed. The plan calls for a board that is 4 feet long. The store sells lumber measured in inches. How many inches is 4 feet?`, solution: '48 inches' },
      relatedLoIds: ['m6math.converting-measurement-units'],
    },
    {
      title: 'Worked grams to kilograms',
      steps: [
        `Size test first: grams is a smaller unit than kilograms, so converting grams into kilograms should make the number smaller, not bigger.`,
        `The conversion factor connecting grams and kilograms is 1000: there are 1000 grams in 1 kilogram. Going from a smaller unit to a larger unit means you divide.`,
        `WRONG: multiplying instead of dividing gives 3500 × 1000 = 3,500,000, an enormous number that cannot be right for a bag of trail mix you can carry in one hand. CORRECT: divide, because converting a smaller unit into a larger unit always divides: 3500 ÷ 1000 = 3.5.`,
        `Check by reversing the operation: multiply back, 3.5 × 1000 = 3500, which matches the amount you started with.`,
        `Read it back into the story: a 3.5 kilogram bag of trail mix, a reasonable size for a snack bag.`,
      ],
      example: { problem: `A bag of trail mix is labeled 3,500 grams. A nutrition chart you are filling in uses kilograms. How many kilograms is 3,500 grams?`, solution: '3.5 kilograms' },
      relatedLoIds: ['m6math.converting-measurement-units'],
    },
  ],
  pointers: [
    { content: `Students often say "5/12" — Inches are a smaller unit than feet, so converting feet into inches must make the number bigger, not smaller. Multiply instead: 5 feet × 12 = 60 inches. Check by dividing back: 60 ÷ 12 = 5, which matches the 5 feet you started with.`, kind: 'common-error' },
    { content: `Students often say "17" — The conversion factor 12 tells you how many inches make one foot; it is not an amount to add on. Multiply: 5 feet × 12 = 60 inches, not 5 + 12. Check by dividing back: 60 ÷ 12 = 5, which matches the 5 feet you started with.`, kind: 'common-error' },
    { content: `A conversion factor is the ratio between two equivalent units within the same system, like 12 inches in 1 foot or 1000 grams in 1 kilogram.`, kind: 'tip' },
    { content: `Multiplying by a ratio equal to 1 changes the units a measurement is written in, not the actual amount.`, kind: 'tip' },
    { content: `Converting from a larger unit to a smaller unit means multiplying by the conversion factor.`, kind: 'tip' },
    { content: `Converting from a smaller unit to a larger unit means dividing by the conversion factor.`, kind: 'tip' },
    { content: `Check every conversion by reversing the operation: if you multiplied, divide back; if you divided, multiply back.`, kind: 'tip' },
    { content: `Size-test the answer: the number of small units should always be bigger than the number of large units for the same amount.`, kind: 'tip' },
  ],
};
