/**
 * Grade 6 Math — Percent & Measurement Conversion: Converting Measurement Units.
 *
 * PROCEDURE-LED fan-out lesson for m6math. Row 2.3 found the whole given a
 * part and a percent; this row leaves percent behind for a different
 * application of ratio reasoning: converting a measurement from one unit to
 * another within the same system (CCSS 6.RP.A.3d). The shape follows the
 * procedure-led exemplar: the concept segment installs a short two-branch
 * rule built on the idea that a conversion factor is a ratio equal to 1
 * (multiply going to a smaller unit, divide going to a larger unit), both
 * worked examples close with a reverse-operation check, and the second
 * worked example carries a WRONG/CORRECT step against the single most
 * common slip: multiplying and dividing in the wrong direction.
 *
 * SCOPE GUARD: this lesson converts measurement units WITHIN one system
 * only — feet to inches, pounds to ounces (both US customary), and grams
 * to kilograms, milliliters to liters (both metric) — using a conversion
 * factor the student is either already expected to know (12 inches in 1
 * foot; the metric powers of 1000) or is told directly in the problem (16
 * ounces in 1 pound). It never converts BETWEEN systems (miles to
 * kilometers, pounds to grams), because that needs a conversion factor a
 * sixth grader is not given. It also never touches percent, which is rows
 * 2.1-2.3's territory, and never divides a fraction, which is row 3.1, this
 * row's followUp.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U2_CONVERTING_MEASUREMENT_UNITS: LessonPlan = {
  id: 'evelyn.ms.m6math.converting-measurement-units.v1',
  title: 'Converting Measurement Units',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.converting-measurement-units',
      standard: 'M6MATH-2.4',
      description:
        'Use ratio reasoning to convert measurement units within a system (e.g., feet to inches, grams to kilograms) (CCSS 6.RP.A.3d).',
    },
  ],
  prerequisites: ['m6math.finding-the-whole-given-a-part-and-percent'],
  followUps: ['m6math.meaning-of-fraction-division'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student a real mismatched-units problem so they feel why a conversion rule is needed.',
      script:
        'Your family is building a raised garden bed this weekend. The plan says each board needs to be 4 feet long, but the hardware store only marks its lumber in inches. Right now you cannot answer how many inches that is without doing something first. By the end of this lesson, you will be able to switch between units like feet and inches, or grams and kilograms, any time a problem hands you the wrong unit for what you need. The trick is a special kind of ratio, one that always equals 1, so multiplying by it never changes the actual amount, only the units you see it written in.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conversion-factor',
      kind: 'concept',
      goal: 'Install the conversion-factor idea and the multiply/divide rule for which direction to go.',
      keyIdeas: [
        'A CONVERSION FACTOR IS A RATIO BETWEEN EQUIVALENT UNITS — 1 foot and 12 inches describe the exact same length, just with different units. The ratio 12 inches to 1 foot is a conversion factor, and so is 1000 grams to 1 kilogram.',
        'MULTIPLYING BY A RATIO EQUAL TO 1 NEVER CHANGES THE AMOUNT — 12 inches and 1 foot are the same length, so the ratio 12 inches over 1 foot equals 1. Multiplying a measurement by that ratio changes the units it is written in, not the actual size of the thing you are measuring.',
        'LARGER UNIT TO SMALLER UNIT: MULTIPLY — a smaller unit needs a bigger number to describe the same amount, so converting a bigger unit, like feet, into a smaller unit, like inches, means multiplying by the conversion factor.',
        'SMALLER UNIT TO LARGER UNIT: DIVIDE — a bigger unit needs a smaller number to describe the same amount, so converting a smaller unit, like grams, into a bigger unit, like kilograms, means dividing by the conversion factor.',
        'CHECK BY REVERSING THE OPERATION — if you multiplied to convert, divide back by the same factor and you should land on the number you started with. If you divided, multiply back. This catches a slip before it becomes a wrong answer.',
        'STAY INSIDE ONE SYSTEM — feet and inches both belong to the US customary system, and grams and kilograms both belong to the metric system. Every conversion in this lesson stays inside one system, and the conversion factor connecting the two units will always be one you already know or one the problem tells you directly.',
      ],
      vocabulary: [
        {
          term: 'conversion factor',
          definition:
            'the ratio between two equivalent units within the same system of measurement, such as 12 inches in 1 foot, or 1000 grams in 1 kilogram.',
        },
        {
          term: 'equivalent measurement',
          definition:
            'two measurements that describe the same actual amount, written with different units, such as 4 feet and 48 inches.',
        },
        {
          term: 'ratio',
          definition: 'a comparison of two quantities, such as 1000 grams compared to 1 kilogram.',
        },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-feet-to-inches',
      kind: 'worked_example',
      problem:
        'You are building a raised garden bed. The plan calls for a board that is 4 feet long. The store sells lumber measured in inches. How many inches is 4 feet?',
      steps: [
        'Read the question in words first: you need the same length written in a smaller unit, inches instead of feet. Going from a larger unit to a smaller unit means you multiply.',
        'The conversion factor connecting feet and inches is 12: there are 12 inches in 1 foot.',
        'Multiply the number of feet by the conversion factor: 4 × 12 = 48.',
        'Check by reversing the operation: divide back, 48 ÷ 12 = 4, which matches the 4 feet you started with.',
        'Size test: inches is a smaller unit than feet, so the number of inches should be bigger than the number of feet. 48 is bigger than 4, so the answer holds.',
      ],
      answer: '48 inches',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-grams-to-kilograms',
      kind: 'worked_example',
      problem:
        'A bag of trail mix is labeled 3,500 grams. A nutrition chart you are filling in uses kilograms. How many kilograms is 3,500 grams?',
      steps: [
        'Size test first: grams is a smaller unit than kilograms, so converting grams into kilograms should make the number smaller, not bigger.',
        'The conversion factor connecting grams and kilograms is 1000: there are 1000 grams in 1 kilogram. Going from a smaller unit to a larger unit means you divide.',
        'WRONG: multiplying instead of dividing gives 3500 × 1000 = 3,500,000, an enormous number that cannot be right for a bag of trail mix you can carry in one hand. CORRECT: divide, because converting a smaller unit into a larger unit always divides: 3500 ÷ 1000 = 3.5.',
        'Check by reversing the operation: multiply back, 3.5 × 1000 = 3500, which matches the amount you started with.',
        'Read it back into the story: a 3.5 kilogram bag of trail mix, a reasonable size for a snack bag.',
      ],
      answer: '3.5 kilograms',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ladder-feet-to-inches',
      kind: 'try_yourself',
      problem: 'A ladder is 6 feet tall. How many inches tall is the ladder?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '18' },
        { id: 'b', text: '0.5' },
        { id: 'c', text: '72', correct: true },
        { id: 'd', text: '60' },
      ],
      expectedAnswer: '72',
      hints: [
        'Inches are a smaller unit than feet, so converting feet into inches means multiplying, not dividing.',
        'The conversion factor between feet and inches is 12: multiply 6 by 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-milliliters-to-liters-setup',
      kind: 'try_yourself',
      problem:
        'A jug holds 9,000 milliliters of lemonade. There are 1000 milliliters in 1 liter. Which calculation converts this amount into liters?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '9000 × 1000' },
        { id: 'b', text: '9000 ÷ 1000', correct: true },
        { id: 'c', text: '1000 ÷ 9000' },
        { id: 'd', text: '9000 - 1000' },
      ],
      expectedAnswer: '9000 ÷ 1000',
      hints: [
        'Milliliters is the smaller unit and liters is the larger unit, so converting into liters means dividing.',
        'Divide the number of milliliters you have, 9000, by the conversion factor, 1000, the number of milliliters in 1 liter.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pounds-to-ounces',
      kind: 'try_yourself',
      problem:
        'A recipe calls for 2 pounds of flour. Your kitchen scale only shows ounces, and there are 16 ounces in 1 pound. How many ounces of flour do you need? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '32',
      hints: [
        'Ounces are a smaller unit than pounds, so converting pounds into ounces means multiplying.',
        'Multiply the number of pounds, 2, by the conversion factor, 16 ounces in 1 pound.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-direction',
      kind: 'misconception_check',
      question:
        'A window is 5 feet wide. One student converts this to inches and writes 5/12. Another student writes 17. What went wrong in each case?',
      commonErrors: [
        {
          answer: '5/12',
          misconception:
            'Dividing the number of feet by 12 instead of multiplying, because dividing feels like the "shrinking" operation to reach for.',
          correctsTo:
            'Inches are a smaller unit than feet, so converting feet into inches must make the number bigger, not smaller. Multiply instead: 5 feet × 12 = 60 inches. Check by dividing back: 60 ÷ 12 = 5, which matches the 5 feet you started with.',
        },
        {
          answer: '17',
          misconception:
            'Adding the conversion factor to the number of feet instead of multiplying by it, treating 12 like an amount to add rather than a ratio to multiply by.',
          correctsTo:
            'The conversion factor 12 tells you how many inches make one foot; it is not an amount to add on. Multiply: 5 feet × 12 = 60 inches, not 5 + 12. Check by dividing back: 60 ÷ 12 = 5, which matches the 5 feet you started with.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A conversion factor is the ratio between two equivalent units within the same system, like 12 inches in 1 foot or 1000 grams in 1 kilogram.',
        'Multiplying by a ratio equal to 1 changes the units a measurement is written in, not the actual amount.',
        'Converting from a larger unit to a smaller unit means multiplying by the conversion factor.',
        'Converting from a smaller unit to a larger unit means dividing by the conversion factor.',
        'Check every conversion by reversing the operation: if you multiplied, divide back; if you divided, multiply back.',
        'Size-test the answer: the number of small units should always be bigger than the number of large units for the same amount.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Converting Measurement Units' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
