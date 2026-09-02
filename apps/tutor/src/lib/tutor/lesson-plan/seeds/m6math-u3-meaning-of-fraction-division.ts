/**
 * Grade 6 Math — Dividing Fractions: The Meaning of Fraction Division.
 *
 * CONCEPT-LED lesson for the m6math fan-out. This is the row that comes
 * BEFORE any algorithm: the student builds what a fraction divided by a
 * fraction actually asks by counting equal-size groups on a number line and
 * on an area (bar) model, rewriting both fractions with a shared denominator
 * so every piece being counted is the same size (CCSS 6.NS.A.1). No flipping,
 * no reciprocal, and no named computation shortcut appears anywhere in this
 * plan; that belongs to row 3.2. Two traps this plan is built to kill:
 * reading the division symbol as subtraction ("how much is left over"), and
 * reading "divided by" as "of" and multiplying instead.
 *
 * SCOPE GUARD: Row 3.1 builds MEANING for fraction division using a number
 * line and an area model, by counting how many divisor-size groups fit
 * inside the dividend. It never names or uses the invert-and-multiply /
 * reciprocal rule; that computation shortcut belongs entirely to row 3.2.
 * Every dividend and divisor in this plan is a proper fraction. A quotient
 * can still land on a leftover part of a group rather than a whole number
 * (5/2, written as "2 and 1/2"), and naming that leftover as a fraction of
 * one more group is exactly the meaning this lesson teaches — it is not the
 * same as row 3.3's skill, which is DIVIDING mixed-number INPUTS, something
 * no problem in this plan does. Real-world settings (ribbon, yarn, lemonade)
 * appear only to make the two models physical; row 3.4 owns fraction-division
 * WORD PROBLEMS as a stand-alone skill, and this plan never asks the student
 * to set up a multi-step or ambiguous problem the way that row does.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U3_MEANING_OF_FRACTION_DIVISION: LessonPlan = {
  id: 'evelyn.ms.m6math.meaning-of-fraction-division.v1',
  title: 'The Meaning of Fraction Division',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.meaning-of-fraction-division',
      standard: 'M6MATH-3.1',
      description:
        'Build meaning for dividing a fraction by a fraction using visual models (area models, number lines) before any algorithm (CCSS 6.NS.A.1).',
    },
  ],
  prerequisites: ['m6math.converting-measurement-units'],
  followUps: ['m6math.dividing-fractions-by-fractions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a fraction division question is really a counting-groups question, using a scenario the student can picture.',
      script:
        'You have 3/4 of a yard of ribbon left over from wrapping gifts. Every bow you tie uses 1/4 of a yard. How many bows can you make? You could just start cutting and count as you go, but there is a faster way to see the answer before you cut anything: draw a picture of the ribbon and mark off pieces the size of one bow. That picture is exactly what 3/4 ÷ 1/4 is asking. Today you learn to read a division problem like that one as a question about groups, and to answer it with a number line or a bar, no cutting required.',
      suggestedTools: ['show_number_line', 'show_fraction_bar'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-counting-equal-groups',
      kind: 'concept',
      goal: 'Build the counting-equal-groups meaning of fraction division using a number line and an area model, before naming any computation rule.',
      keyIdeas: [
        'DIVISION MEANS COUNTING EQUAL GROUPS — whole-number division such as 12 divided by 3 asks how many groups of 3 fit inside 12. Dividing fractions asks the exact same question: 3/4 divided by 1/4 asks how many groups of 1/4 fit inside 3/4.',
        'SAME-SIZE PIECES MAKE THE GROUPS EASY TO SEE — mark a number line off in pieces the size of the divisor, then count how many of those pieces reach the dividend. For 3/4 divided by 1/4, mark a line off in fourths, shade up to 3/4, and count the 1/4-size jumps that land inside the shaded part.',
        'A SHARED DENOMINATOR TURNS ANY TWO FRACTIONS INTO THE SAME SIZE PIECES — when the dividend and the divisor do not already share a denominator, rewrite both with the same denominator first. Once every piece on the model is the same size, counting groups works exactly the way it did when the denominators already matched.',
        'AN AREA MODEL SHOWS THE SAME COUNT A DIFFERENT WAY — draw a bar for one whole, shade the amount in the dividend, then slice the whole bar into strips the size of the divisor. Counting how many of those strips lie inside the shaded part gives the same answer as the number line.',
        'A LEFTOVER CAN BE PART OF ONE MORE GROUP — the groups do not always come out even. When a group is left unfinished at the end, compare what remains to the size of one full group; a piece that is half the size of a group counts as half of one more group, not as a whole extra group and not as nothing.',
        'DIVIDING BY A FRACTION SMALLER THAN 1 GIVES MORE GROUPS THAN YOU STARTED WITH — since each group is smaller than one whole, more of them fit inside the same amount. An answer smaller than the amount you started with is a signal that something went wrong, not a sign that the division is finished.',
      ],
      vocabulary: [
        { term: 'dividend', definition: 'the amount you start with, the number being divided; in 3/4 divided by 1/4, the dividend is 3/4.' },
        { term: 'divisor', definition: 'the size of one group, the number you are dividing by; in 3/4 divided by 1/4, the divisor is 1/4.' },
        { term: 'quotient', definition: 'the number of groups the dividend splits into; it is the answer to a division problem.' },
        {
          term: 'common denominator',
          definition: 'a shared bottom number that lets two fractions be cut into pieces of the same size, so the groups can be counted directly.',
        },
      ],
      suggestedTools: ['show_number_line', 'show_fraction_bar'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ribbon-bows',
      kind: 'worked_example',
      problem: 'You have 3/4 of a yard of ribbon. Each bow uses 1/4 of a yard. How many bows can you make? Work out 3/4 ÷ 1/4.',
      steps: [
        'Turn the question into a counting question: how many groups of 1/4 yard fit inside 3/4 yard of ribbon?',
        'Draw a number line from 0 to 1, marked off in fourths: 0, 1/4, 2/4, 3/4, 1.',
        'Shade the number line from 0 up to 3/4, since that is how much ribbon there is.',
        'Count the 1/4-size jumps that land inside the shaded part: the first jump lands on 1/4, the second on 2/4, the third on 3/4. That is 3 jumps, and the third jump lands exactly on the edge of the shaded part.',
        'Three jumps of 1/4 means three groups of 1/4, so the ribbon makes 3 bows.',
        'Check by multiplying the number of groups by the size of one group: 3 groups × 1/4 yard = 3/4 yard, exactly the ribbon there was to start. The count of 3 groups holds.',
      ],
      answer: '3 bows, since 3/4 ÷ 1/4 = 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-yarn-bracelets',
      kind: 'worked_example',
      problem: 'You have 5/6 of a yard of yarn left after making bracelets. Each bracelet uses 1/3 of a yard. How many bracelets can you make from the yarn you have left? Work out 5/6 ÷ 1/3.',
      steps: [
        'Turn the question into a counting question: how many groups of 1/3 yard fit inside 5/6 yard of yarn?',
        'The dividend is already in sixths, but the divisor is in thirds, so rewrite 1/3 as sixths first: 1/3 = 2/6. Now every piece on the model will be the same size, one sixth of a yard.',
        'Draw a bar for one whole yard, split into six equal strips, and shade 5 of the 6 strips to show 5/6 yard of yarn.',
        'Count off groups of 2 strips, since one bracelet uses 1/3 yard, which is 2 strips of 1/6: the first group uses 2 shaded strips, the second group uses 2 more shaded strips, using 4 of the 5 shaded strips in all.',
        'One shaded strip is left over, which is 1/6 of a yard. A full group needs 2 strips, or 2/6 of a yard, so the leftover strip is only half of one more group.',
        'WRONG: counting the single leftover strip as one whole extra group, making the answer 3 bracelets. CORRECT: the leftover strip is half the size of a group, since a group is 2/6 and the leftover is 1/6, so it counts as half of one more group. The full quotient is 2 and 1/2 groups.',
        'Check: 2 and 1/2 groups of 1/3 yard each is 2/3 yard for the two full groups plus 1/6 yard for the half group, and 2/3 + 1/6 = 4/6 + 1/6 = 5/6, which matches the yarn there was to start.',
        'Read it back into the story: enough yarn for 2 finished bracelets, with just enough yarn left over for half of a third one.',
      ],
      answer: '2 and 1/2 groups, since 5/6 ÷ 1/3 = 5/2: enough yarn for 2 full bracelets plus half of a third',
      estimatedMinutes: 3,
    },
    {
      id: 'try-interpret-the-question',
      kind: 'try_yourself',
      problem: 'A ribbon is 4/5 of a yard long. Each bookmark tassel uses 1/5 of a yard. Which question matches 4/5 ÷ 1/5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How many groups of 1/5 yard fit inside 4/5 yard?', correct: true },
        { id: 'b', text: 'What is 4/5 yard minus 1/5 yard?' },
        { id: 'c', text: 'What is 1/5 of 4/5 yard?' },
        { id: 'd', text: 'How many fifths are needed to make one whole yard?' },
      ],
      expectedAnswer: 'How many groups of 1/5 yard fit inside 4/5 yard?',
      hints: [
        'Division asks how many equal-size groups fit inside an amount, not how much is left after taking some away.',
        'Picture a number line marked off in fifths, shaded up to 4/5. The question a division problem asks is how many 1/5-size jumps land inside that shaded part.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-area-model-count',
      kind: 'try_yourself',
      problem: 'A bar shows one whole, shaded to represent 2/3. The whole bar is then cut into 6 equal strips, so each strip is 1/6. How many 1/6 strips fit inside the shaded 2/3?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '3' },
        { id: 'c', text: '4', correct: true },
        { id: 'd', text: '6' },
      ],
      expectedAnswer: '4',
      hints: [
        'Rewrite 2/3 with sixths first, so it is measured in the same size pieces as the strips: 2/3 = 4/6.',
        'Count only the strips that lie inside the shaded part, not every strip in the whole bar.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-lemonade-cups',
      kind: 'try_yourself',
      problem:
        'After a picnic, a pitcher has 5/8 of a gallon of lemonade left. Each cup holds 1/8 of a gallon. Draw a number line from 0 to 1 marked off in eighths, shade up to 5/8, and count how many 1/8-size jumps fit inside the shaded part. How many cups can be filled? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Mark the number line off in eighths: 0, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8, 1. Shade from 0 up to 5/8.',
        'Each jump the size of one cup is 1/8 of a gallon. Count the jumps that land on a mark up to 5/8: they land at 1/8, 2/8, 3/8, 4/8, and 5/8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subtracting-and-multiplying-instead-of-dividing',
      kind: 'misconception_check',
      question:
        'A student is asked to find 2/3 ÷ 1/3 using a pan of brownies cut into thirds. The student subtracts and says the answer is 1/3 of a pan. Another student multiplies and says the answer is 2/9 of a pan. What went wrong in each case?',
      commonErrors: [
        {
          answer: '1/3 of a pan',
          misconception:
            'Reading the division symbol as subtraction, so 2/3 minus 1/3 was computed instead of counting how many 1/3-size groups fit inside 2/3.',
          correctsTo:
            'Division counts groups, it does not remove an amount. A number line marked off in thirds and shaded to 2/3 shows exactly 2 jumps of 1/3, so 2/3 ÷ 1/3 = 2 groups, not a leftover amount of pan.',
        },
        {
          answer: '2/9 of a pan',
          misconception:
            'Reading "divided by" as "of," so 2/3 of 1/3 was multiplied instead of counted, which shrinks the answer instead of counting groups.',
          correctsTo:
            'Dividing by a fraction smaller than 1 always gives more groups, not less, so an answer smaller than the amount you started with is a warning sign. Counting 1/3-size groups on the model shows 2 groups fit inside 2/3, so 2/3 ÷ 1/3 = 2.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dividing by a fraction asks how many groups of that size fit inside the amount you have.',
        'A number line marked off in the size of the divisor lets you count the groups directly, jump by jump.',
        'An area model shows the same count a different way: shade the dividend on a bar, then count how many divisor-size strips fit inside the shaded part.',
        'Rewriting both fractions with a common denominator turns the question into counting same-size pieces.',
        'A leftover piece that does not fill a whole group is a fraction of one more group, not a whole extra group.',
        'Dividing by a fraction smaller than 1 gives MORE groups than you started with, not fewer; a smaller answer is a sign that something went wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'The Meaning of Fraction Division' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
