/**
 * Grade 6 Math — Negative Numbers & Absolute Value: Ordering Rational
 * Numbers.
 *
 * CONCEPT-LED fan-out lesson. The standard has two halves, and the second
 * half is the one that gets skipped if a lesson stops at "which number is
 * bigger": a student must also be able to EXPLAIN, in a full sentence about
 * the real situation, what a written inequality statement means (CCSS
 * 6.NS.C.7a/b). This plan treats writing an inequality and explaining it in
 * context as equally load-bearing, not as a bonus step after the "real" work
 * of ordering is done.
 *
 * SCOPE GUARD: This lesson writes inequality statements (using < and >) that
 * compare rational numbers drawn from real-world contexts, explains in a
 * full sentence what each such statement means about the situation it
 * describes, and orders short lists of three or four rational numbers from
 * least to greatest by their position on the number line. Explaining what a
 * written statement means about the real quantities involved carries equal
 * weight to writing the statement itself, not treated as an optional extra.
 * It never adds, subtracts, multiplies, or divides negative numbers; all
 * arithmetic with signed numbers is Grade 7 (m7math U1-U2). Placing
 * individual rational numbers on a number line and building the line itself
 * is row 5.2's job; this lesson borrows number-line position only as the
 * reason one number is greater than another, and does not teach how to
 * construct or read a number line as its own skill. Distinguishing an order
 * comparison ("which number is greater") from a comparison of which number
 * is bigger while ignoring its sign is row 5.3's job and is not retaught or
 * contradicted here; every comparison this lesson makes is strictly an order
 * comparison.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U5_ORDERING_RATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m6math.ordering-rational-numbers.v1',
  title: 'Ordering Rational Numbers',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.ordering-rational-numbers',
      standard: 'M6MATH-5.4',
      description:
        'Write, interpret, and order statements of inequality about rational numbers in real-world contexts (CCSS 6.NS.C.7a/b).',
    },
  ],
  prerequisites: ['m6math.absolute-value'],
  followUps: ['m6math.plotting-points-in-all-four-quadrants'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student compare two real, signed quantities in words before any inequality symbol appears.',
      script:
        'A weather app shows two temperatures at the same moment. In International Falls, Minnesota, it is -6 degrees Fahrenheit. In Miami, Florida, it is 68 degrees Fahrenheit. Anyone can say which city is colder just by reading the numbers. But turning that into a math statement, and explaining exactly what the statement means, takes a little more care. Today we learn how to write a comparison between two rational numbers using the symbols < and >, and just as important, how to explain in words what that statement says about the real situation.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-writing-and-ordering-inequalities',
      kind: 'concept',
      goal: 'Build the rule for comparing rational numbers with < and >, and make explaining the statement in context a required second step, not an optional one.',
      keyIdeas: [
        'GREATER MEANS FARTHER RIGHT — for any two rational numbers, the one farther to the right on the number line is the greater one, and the one farther left is the lesser one. This works the same way whether the numbers are positive, negative, whole numbers, or decimals: -6 is less than 68 because -6 sits far to the left of 68.',
        'TWO SYMBOLS, ONE MEANING EACH — the symbol < means "is less than" and the symbol > means "is greater than." The open side of the symbol always faces the greater number. Writing -6 < 68 and writing 68 > -6 say the exact same thing about the exact same two numbers, just in a different order.',
        'WRITING THE STATEMENT — to compare two rational numbers from a real situation, first identify the two numbers, then decide which one sits farther right on the number line, then write the inequality with the correct symbol between them.',
        'EXPLAINING THE STATEMENT IS PART OF THE ANSWER — a statement like -6 < 68 says nothing about weather by itself; it is only numbers and a symbol. Explaining it means turning it back into a sentence about the real quantities, such as "the temperature in International Falls is colder than the temperature in Miami." A comparison problem is not finished until this sentence is written.',
        'A MORE NEGATIVE NUMBER IS STILL THE LESSER NUMBER — comparing negative numbers can look backward at first. Between -9 and -2, the number -9 has the bigger digit, but -9 sits farther left on the number line, so -9 is the lesser number: -9 < -2. The size of the digit does not decide which number is greater; position on the number line does.',
        'ORDERING A LIST WORKS THE SAME WAY — to put three or four rational numbers in order from least to greatest, find where each one sits on the number line and read them off from left to right. The same left-to-right rule that compares two numbers also orders a whole list.',
      ],
      vocabulary: [
        { term: 'inequality', definition: 'a statement that compares two numbers using < or >, showing that one number is less than or greater than the other.' },
        { term: 'less than (<)', definition: 'the symbol used when the number on the left sits farther left on the number line than the number on the right.' },
        { term: 'greater than (>)', definition: 'the symbol used when the number on the left sits farther right on the number line than the number on the right.' },
        { term: 'order', definition: 'to arrange a list of numbers from least to greatest (or greatest to least) based on their position on the number line.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-writing-and-interpreting-an-inequality',
      kind: 'worked_example',
      problem:
        'A hiking club records two elevations for the same afternoon. Death Valley, California, sits at -282 feet. Denver, Colorado, sits at 5280 feet. Write an inequality comparing the two elevations, then explain what the statement means.',
      steps: [
        'Identify the two numbers to compare: -282 and 5280.',
        '-282 sits to the left of zero on the number line, and 5280 sits far to the right of zero, so -282 is the lesser number and 5280 is the greater number.',
        'Write the inequality with the symbol pointing toward the smaller number: -282 < 5280. This can also be written 5280 > -282; both say the same thing.',
        'Now explain the statement in a full sentence about the real situation, not just the numbers: -282 < 5280 means the elevation of Death Valley is lower than the elevation of Denver.',
        'Check by reading the story back: Death Valley is a desert basin below sea level, and Denver is called the Mile-High City. A lower elevation for Death Valley matches what the inequality says.',
      ],
      answer: '-282 < 5280; this means the elevation of Death Valley is lower than the elevation of Denver.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ordering-a-list-of-balances',
      kind: 'worked_example',
      problem:
        "Four friends check their allowance app after a busy week. Ravi's balance is -12.5 dollars. Priya's balance is -0.75 dollars. Sam's balance is 0 dollars. Tom's balance is 3 dollars. Order the four balances from least to greatest, then explain what the order means about who owes the most money.",
      steps: [
        'List the four numbers to order: -12.5, -0.75, 0, and 3.',
        'Place each one by its position on the number line. -12.5 sits farthest to the left, then -0.75, then 0, then 3 sits farthest to the right.',
        'WRONG: saying -12.5 is greater than -0.75 because 12.5 is a bigger digit than 0.75. CORRECT: -12.5 sits farther left on the number line than -0.75, so -12.5 is the lesser of the two balances, not the greater one.',
        'Reading the positions from left to right gives the order from least to greatest: -12.5, -0.75, 0, 3.',
        "Match each number back to its owner: Ravi's balance (-12.5) is least, then Priya's (-0.75), then Sam's (0), then Tom's (3) is greatest.",
        'Explain what the order means: Ravi owes the most money, since his balance is the most negative. Priya owes a smaller amount. Sam has an empty account. Tom has money saved, more than anyone else in the group.',
        'Check by working the order backward: reading right to left should go from greatest to least. 3, 0, -0.75, -12.5. Tom is greatest and Ravi is least either way the list is read, so the order is consistent.',
      ],
      answer: 'Least to greatest: -12.5, -0.75, 0, 3 (Ravi, Priya, Sam, Tom); Ravi owes the most and Tom has the most money saved.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-elevation-inequality',
      kind: 'try_yourself',
      problem:
        'A park sign gives two elevations for the same trail: the trailhead sits at -282 feet, and the mountain lookout at the end of the trail sits at 5280 feet. Which inequality statement correctly compares these two elevations?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-282 > 5280' },
        { id: 'b', text: '-282 < 5280', correct: true },
        { id: 'c', text: '5280 < -282' },
        { id: 'd', text: '-282 = 5280' },
      ],
      expectedAnswer: '-282 < 5280',
      hints: [
        'A negative number always sits to the left of a positive number on the number line, no matter how large its digits are.',
        '-282 sits left of zero and 5280 sits far to the right of zero, so -282 is the smaller number: -282 < 5280.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpreting-pond-temperatures',
      kind: 'try_yourself',
      problem:
        'A science class records the water temperature of two ponds during a winter study. Pond A is -3.5 degrees Celsius. Pond B is 1.5 degrees Celsius. Which statement correctly explains what the inequality -3.5 < 1.5 means for this situation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Pond A is 3.5 degrees warmer than Pond B.' },
        { id: 'b', text: 'Pond A and Pond B have the same temperature, since both readings are close to zero.' },
        { id: 'c', text: 'Pond B\'s temperature cannot be compared to a negative temperature.' },
        { id: 'd', text: 'Pond A\'s temperature is colder than Pond B\'s temperature.', correct: true },
      ],
      expectedAnswer: "Pond A's temperature is colder than Pond B's temperature.",
      hints: [
        '-3.5 < 1.5 means -3.5 sits to the left of 1.5 on the number line, so -3.5 is the smaller number.',
        'A smaller temperature reading means a colder pond. Match the direction of the inequality to which pond is colder.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-least-elevation',
      kind: 'try_yourself',
      problem:
        'Four hikers record their elevation relative to the trailhead, in feet: -8, -8.5, 2, and 0. Which elevation is the least, the lowest point among the four? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-8.5',
      hints: [
        'Least means farthest left on the number line. Compare the two negative numbers first: -8 and -8.5.',
        '-8.5 has the bigger digit but sits farther left than -8, so -8.5 is the smaller of the two, and it is less than both 0 and 2 as well.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-order-writing-and-explaining',
      kind: 'misconception_check',
      question:
        'A student compares the temperatures -9 degrees and -2 degrees and writes -9 > -2, saying nine is a bigger number than two. On a separate problem, the same student correctly writes -1 < 24 comparing a fish tank at -1 degree Celsius and a swimming pool at 24 degrees Celsius, then explains it by saying "the fish tank has less water, since -1 is a smaller number." What went wrong in each case?',
      commonErrors: [
        {
          answer: '-9 > -2, because nine is a bigger number than two.',
          misconception: 'Comparing the size of the digits while ignoring the negative signs, so a more negative number is mistaken for the greater number.',
          correctsTo:
            '-9 is less than -2: -9 < -2. -9 sits farther left on the number line than -2, so -9 is the lesser number. When comparing two negative numbers, the one with the larger digit sits farther from zero, on the smaller side, not the greater side.',
        },
        {
          answer: '"The fish tank has less water, since -1 is a smaller number."',
          misconception: 'Writing the inequality correctly, but then explaining it as a statement about the wrong quantity, so the explanation does not describe what the numbers actually represent.',
          correctsTo:
            'The inequality -1 < 24 compares only the temperatures of the fish tank and the pool, not any other quantity such as the amount of water. The correct explanation is: the fish tank\'s temperature is colder than the pool\'s temperature. Every explanation of an inequality statement must describe the exact quantity the numbers stand for.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On the number line, the number farther to the right is always the greater one, and the number farther to the left is always the lesser one.',
        'The symbol < means "is less than" and > means "is greater than"; the open side of the symbol always faces the greater number.',
        'Writing an inequality is only half the answer: always explain in a full sentence what the statement means about the real quantities being compared.',
        'A negative number with a bigger digit is still farther left on the number line, and so is still the lesser number: -9 < -2.',
        'To order a list of three or four rational numbers, find each one\'s position on the number line and read them off from left to right, least to greatest.',
        'An explanation of an inequality must describe the exact quantity the numbers represent, not a different quantity from the same story.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Ordering Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
