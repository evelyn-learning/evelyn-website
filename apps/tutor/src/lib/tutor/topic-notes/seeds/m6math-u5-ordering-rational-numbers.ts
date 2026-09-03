/**
 * Grade 6 Math — Unit 5 CED 5.4: Ordering Rational Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.ordering-rational-numbers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U5_ORDERING_RATIONAL_NUMBERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.ordering-rational-numbers.v1',
  course: 'Grade 6 Math',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Ordering Rational Numbers',
  planId: 'evelyn.ms.m6math.ordering-rational-numbers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.ordering-rational-numbers.v1' }],
  theory: [
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'Greater means farther right', content: `GREATER MEANS FARTHER RIGHT — for any two rational numbers, the one farther to the right on the number line is the greater one, and the one farther left is the lesser one. This works the same way whether the numbers are positive, negative, whole numbers, or decimals: -6 is less than 68 because -6 sits far to the left of 68.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'Two symbols, one meaning each', content: `TWO SYMBOLS, ONE MEANING EACH — the symbol < means "is less than" and the symbol > means "is greater than." The open side of the symbol always faces the greater number. Writing -6 < 68 and writing 68 > -6 say the exact same thing about the exact same two numbers, just in a different order.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'Writing the statement', content: `WRITING THE STATEMENT — to compare two rational numbers from a real situation, first identify the two numbers, then decide which one sits farther right on the number line, then write the inequality with the correct symbol between them.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'Explaining the statement is part of the answer', content: `EXPLAINING THE STATEMENT IS PART OF THE ANSWER — a statement like -6 < 68 says nothing about weather by itself; it is only numbers and a symbol. Explaining it means turning it back into a sentence about the real quantities, such as "the temperature in International Falls is colder than the temperature in Miami." A comparison problem is not finished until this sentence is written.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'A more negative number is still the lesser number', content: `A MORE NEGATIVE NUMBER IS STILL THE LESSER NUMBER — comparing negative numbers can look backward at first. Between -9 and -2, the number -9 has the bigger digit, but -9 sits farther left on the number line, so -9 is the lesser number: -9 < -2. The size of the digit does not decide which number is greater; position on the number line does.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'framework', title: 'Ordering a list works the same way', content: `ORDERING A LIST WORKS THE SAME WAY — to put three or four rational numbers in order from least to greatest, find where each one sits on the number line and read them off from left to right. The same left-to-right rule that compares two numbers also orders a whole list.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'definition', title: 'inequality', content: `a statement that compares two numbers using < or >, showing that one number is less than or greater than the other.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'definition', title: 'less than (<)', content: `the symbol used when the number on the left sits farther left on the number line than the number on the right.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'definition', title: 'greater than (>)', content: `the symbol used when the number on the left sits farther right on the number line than the number on the right.` },
    { loId: 'm6math.ordering-rational-numbers', kind: 'definition', title: 'order', content: `to arrange a list of numbers from least to greatest (or greatest to least) based on their position on the number line.` },
  ],
  methods: [
    {
      title: 'Worked writing and interpreting an inequality',
      steps: [
        'Identify the two numbers to compare: -282 and 5280.',
        `-282 sits to the left of zero on the number line, and 5280 sits far to the right of zero, so -282 is the lesser number and 5280 is the greater number.`,
        `Write the inequality with the symbol pointing toward the smaller number: -282 < 5280. This can also be written 5280 > -282; both say the same thing.`,
        `Now explain the statement in a full sentence about the real situation, not just the numbers: -282 < 5280 means the elevation of Death Valley is lower than the elevation of Denver.`,
        `Check by reading the story back: Death Valley is a desert basin below sea level, and Denver is called the Mile-High City. A lower elevation for Death Valley matches what the inequality says.`,
      ],
      example: { problem: `A hiking club records two elevations for the same afternoon. Death Valley, California, sits at -282 feet. Denver, Colorado, sits at 5280 feet. Write an inequality comparing the two elevations, then explain what the statement means.`, solution: `-282 < 5280; this means the elevation of Death Valley is lower than the elevation of Denver.` },
      relatedLoIds: ['m6math.ordering-rational-numbers'],
    },
    {
      title: 'Worked ordering a list of balances',
      steps: [
        'List the four numbers to order: -12.5, -0.75, 0, and 3.',
        `Place each one by its position on the number line. -12.5 sits farthest to the left, then -0.75, then 0, then 3 sits farthest to the right.`,
        `WRONG: saying -12.5 is greater than -0.75 because 12.5 is a bigger digit than 0.75. CORRECT: -12.5 sits farther left on the number line than -0.75, so -12.5 is the lesser of the two balances, not the greater one.`,
        `Reading the positions from left to right gives the order from least to greatest: -12.5, -0.75, 0, 3.`,
        `Match each number back to its owner: Ravi's balance (-12.5) is least, then Priya's (-0.75), then Sam's (0), then Tom's (3) is greatest.`,
        `Explain what the order means: Ravi owes the most money, since his balance is the most negative. Priya owes a smaller amount. Sam has an empty account. Tom has money saved, more than anyone else in the group.`,
        `Check by working the order backward: reading right to left should go from greatest to least. 3, 0, -0.75, -12.5. Tom is greatest and Ravi is least either way the list is read, so the order is consistent.`,
      ],
      example: { problem: `Four friends check their allowance app after a busy week. Ravi's balance is -12.5 dollars. Priya's balance is -0.75 dollars. Sam's balance is 0 dollars. Tom's balance is 3 dollars. Order the four balances from least to greatest, then explain what the order means about who owes the most money.`, solution: `Least to greatest: -12.5, -0.75, 0, 3 (Ravi, Priya, Sam, Tom); Ravi owes the most and Tom has the most money saved.` },
      relatedLoIds: ['m6math.ordering-rational-numbers'],
    },
  ],
  pointers: [
    { content: `Students often say "-9 > -2, because nine is a bigger number than two." — -9 is less than -2: -9 < -2. -9 sits farther left on the number line than -2, so -9 is the lesser number. When comparing two negative numbers, the one with the larger digit sits farther from zero, on the smaller side, not the greater side.`, kind: 'common-error' },
    { content: `Students often say ""The fish tank has less water, since -1 is a smaller number."" — The inequality -1 < 24 compares only the temperatures of the fish tank and the pool, not any other quantity such as the amount of water. The correct explanation is: the fish tank's temperature is colder than the pool's temperature. Every explanation of an inequality statement must describe the exact quantity the numbers stand for.`, kind: 'common-error' },
    { content: `On the number line, the number farther to the right is always the greater one, and the number farther to the left is always the lesser one.`, kind: 'tip' },
    { content: `The symbol < means "is less than" and > means "is greater than"; the open side of the symbol always faces the greater number.`, kind: 'tip' },
    { content: `Writing an inequality is only half the answer: always explain in a full sentence what the statement means about the real quantities being compared.`, kind: 'tip' },
    { content: `A negative number with a bigger digit is still farther left on the number line, and so is still the lesser number: -9 < -2.`, kind: 'tip' },
    { content: `To order a list of three or four rational numbers, find each one's position on the number line and read them off from left to right, least to greatest.`, kind: 'tip' },
    { content: `An explanation of an inequality must describe the exact quantity the numbers represent, not a different quantity from the same story.`, kind: 'tip' },
    { content: `Don't compare the size of the digits—compare position on the number line. Between -9 and -2, the digit 9 is bigger, but -9 sits farther left, so -9 < -2. Always ask: which one is farther right?`, kind: 'common-error' },
    { content: `The open side of < or > always points to the *smaller* number. If you write it backward, flip the whole symbol: -6 < 68 and 68 > -6 are the same fact, just different symbol directions.`, kind: 'vocab-note' },
    { content: `An inequality statement with just numbers and a symbol is NOT a complete answer. Always write a sentence explaining what it means for the real quantities: 'The temperature in Death Valley is lower than in Denver,' not just '-282 < 5280.'`, kind: 'gotcha' },
    { content: `When you explain an inequality, describe the exact quantity the numbers represent—temperature, elevation, balance, etc. Don't swap in a different quantity from the story. Wrong: 'Since -1 < 24, the fish tank has less water.' Right: 'The fish tank is colder than the pool.'`, kind: 'common-error' },
    { content: `Zero is neither positive nor negative. When ordering a list that includes 0, place it between all negative numbers (to the right) and all positive numbers (to the left). Example: -0.75, 0, 3.`, kind: 'edge-case' },
    { content: `To order a list, find where each number sits on the number line, then read from left to right (least to greatest) or right to left (greatest to least). Don't sort by digit size or other shortcuts—use position every time.`, kind: 'tip' },
    { content: `Comparing two negatives: the one farther from zero is the smaller number, not the larger. -12.5 is farther left than -0.75, so -12.5 < -0.75, even though 12.5 > 0.75.`, kind: 'gotcha' },
  ],
};
