/**
 * Grade 6 Math — Percent & Measurement Conversion: Finding the Whole Given a
 * Part & Percent.
 *
 * PROCEDURE-LED lesson for the m6math fan-out. Row 2.2 gave the student a
 * percent and a whole and asked for the part, multiplying a decimal by the
 * whole. This row keeps the exact same equation, PART = PERCENT (as a
 * decimal) times WHOLE, and simply solves it for a different unknown: now
 * the part and the percent are known, and the whole is missing, so the
 * student divides instead of multiplying (CCSS 6.RP.A.3c). The two traps
 * this plan is built to kill are dividing by the raw percent number instead
 * of its decimal form (18 ÷ 60 instead of 18 ÷ 0.6), and multiplying instead
 * of dividing because the last lesson's move is still fresh.
 *
 * SCOPE GUARD: Grade 6 row 2.3 starts from a PART and the PERCENT it
 * represents and finds the WHOLE quantity — the reverse of row 2.2, which
 * starts from a percent and a whole and finds the part. Every worked
 * example, try_yourself item, and misconception in this plan hands the
 * student a part and a percent and asks for the whole; none of them hand
 * over a whole and ask for a percent or a part, and none of them chain two
 * percent steps together. Percent APPLICATIONS — tax, tip, discount,
 * markup, simple interest, and percent increase/decrease — are Grade 7
 * material and do not appear anywhere in this file. The one dollar amount
 * in this plan (Priya's video-game savings) is a plain part-of-a-total-price
 * example, not a tax/tip/discount calculation: nothing here is added on top
 * of a price or changes a value over time.
 *
 * NOTE ON prerequisites/followUps: this row's true chain is 2.2 -> 2.3 ->
 * 2.4, and both neighbors are written from the fan-out table now, even
 * though they are not yet registered on disk. The controller wires and
 * lints the full 40-row batch together in one commit.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U2_FINDING_THE_WHOLE_GIVEN_A_PART_AND_PERCENT: LessonPlan = {
  id: 'evelyn.ms.m6math.finding-the-whole-given-a-part-and-percent.v1',
  title: 'Finding the Whole Given a Part & Percent',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.finding-the-whole-given-a-part-and-percent',
      standard: 'M6MATH-2.3',
      description:
        'Given a part and the percent it represents, find the whole quantity by converting the percent to a decimal and dividing the part by that decimal, then check the result by multiplying back (CCSS 6.RP.A.3c).',
    },
  ],
  prerequisites: ['m6math.finding-the-percent-of-a-quantity'],
  followUps: ['m6math.converting-measurement-units'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same percent equation the student already knows can be solved for a different missing piece.',
      script:
        'Your soccer team posts a stat after every game. This week it says: "Jordan scored 3 goals, which is 25% of the whole team\'s goals." You want to know how many goals the team scored in total, but the post never says. You know the PART, 3 goals, and you know the PERCENT, 25%. What is missing is the WHOLE. Last time you knew the whole and had to find a part. This time the missing piece has moved to the other side of the same equation, and today you learn how to solve for it.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-divide-for-the-whole',
      kind: 'concept',
      goal: 'Reuse the part-percent-whole equation, solved for the whole this time, plus the size check and the multiply-back check.',
      keyIdeas: [
        'THE SAME EQUATION, A DIFFERENT MISSING PIECE — every percent problem connects three numbers: PART equals PERCENT, written as a decimal, times WHOLE. The last lesson used this equation to find the PART. This lesson uses the exact same equation to find the WHOLE instead.',
        'TURN THE PERCENT INTO A DECIMAL FIRST — divide the percent number by 100 before doing anything else. 40% becomes 0.40, 25% becomes 0.25, 60% becomes 0.60. Skipping this step, or moving the decimal point only one place instead of two, is the single most common way to get this kind of problem wrong.',
        'DIVIDE TO UNDO A MULTIPLICATION — since PART equals DECIMAL times WHOLE, dividing both sides of that equation by the decimal isolates the WHOLE: WHOLE equals PART divided by DECIMAL. If 4 times 5 equals 20 also means 20 divided by 4 equals 5, this is that same fact family, just with a decimal in place of 4.',
        'THE WHOLE IS ALWAYS BIGGER THAN THE PART — a part is never more than 100% of its whole, so as long as the percent is less than 100%, the whole quantity must come out BIGGER than the part you started with. If your answer to a "find the whole" problem is smaller than the part, you divided by the wrong number, or divided the wrong way around.',
        'CHECK BY MULTIPLYING BACK — once you have found the whole, multiply it by the decimal. That should return the exact part the problem gave you. If it does not, redo the division instead of trusting the first try.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a rate that compares a number to 100; 40 percent means 40 out of every 100.' },
        { term: 'decimal form', definition: 'a percent rewritten as a decimal by dividing it by 100, so 40% becomes 0.40 and 60% becomes 0.60.' },
        { term: 'whole', definition: 'the entire quantity a percent is describing; the part is only a piece of the whole.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-homeroom-vote',
      kind: 'worked_example',
      problem: '40% of the students in Ms. Kim\'s homeroom voted for the science museum on the class trip survey. That is 12 students. How many students are in Ms. Kim\'s homeroom in total?',
      steps: [
        'Sort out what is known. The part is 12 students, the percent is 40%, and the whole, the total number of students in the homeroom, is missing.',
        'Turn the percent into a decimal by dividing by 100: 40% becomes 0.40.',
        'Use the equation PART equals DECIMAL times WHOLE, and divide instead of multiply, since the whole is the missing piece: WHOLE equals 12 divided by 0.40.',
        'Divide: 12 divided by 0.40 equals 30. So there are 30 students in Ms. Kim\'s homeroom.',
        'Size check: 30 is bigger than 12, which makes sense, because 12 students are only 40% of the homeroom, not the whole homeroom.',
        'Check by multiplying back: 0.40 times 30 equals 12, exactly the part the problem gave. The answer holds.',
      ],
      answer: '30 students',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-book-pages',
      kind: 'worked_example',
      problem: 'Mateo read 15 pages of his book last night, and that is 25% of the whole book. How many pages are in the whole book?',
      steps: [
        'Sort out what is known. The part is 15 pages, the percent is 25%, and the whole, the total number of pages in the book, is missing.',
        'Turn the percent into a decimal: 25% becomes 0.25.',
        'WRONG: dividing 15 by 25, using the percent number itself instead of its decimal form: 15 divided by 25 equals 0.6. That answer is smaller than the part, which is impossible, since 15 pages is only 25% of the book, and the whole book has to be the BIGGER number.',
        'CORRECT: divide by the decimal, not the raw percent number: 15 divided by 0.25 equals 60. The book has 60 pages.',
        'Size check: 60 is bigger than 15, which matches the size check rule, since 25% is less than 100%.',
        'Check by multiplying back: 0.25 times 60 equals 15, exactly the part given in the problem. The answer holds.',
      ],
      answer: '60 pages',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sticker-collection',
      kind: 'try_yourself',
      problem: '20% of Amara\'s sticker collection is space stickers. She has 15 space stickers. How many stickers are in her whole collection?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '75', correct: true },
        { id: 'b', text: '3' },
        { id: 'c', text: '35' },
        { id: 'd', text: '0.75' },
      ],
      expectedAnswer: '75',
      hints: [
        'Turn 20% into its decimal form first: 20 divided by 100 equals 0.2.',
        'Since PART equals DECIMAL times WHOLE, divide the part by the decimal to find the whole: 15 divided by 0.2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-equation',
      kind: 'try_yourself',
      problem: '18 students signed up for the talent show, and that is 30% of the whole sixth grade. Which equation finds the total number of sixth graders?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '18 × 0.3' },
        { id: 'b', text: '18 ÷ 0.3', correct: true },
        { id: 'c', text: '18 ÷ 30' },
        { id: 'd', text: '0.3 ÷ 18' },
      ],
      expectedAnswer: '18 ÷ 0.3',
      hints: [
        'The whole is the missing piece here, and multiplying was last lesson\'s move. This lesson divides the part by the decimal form of the percent.',
        'Turn 30% into a decimal first: 0.3, not 30. Dividing by 30 instead of 0.3 is a common slip.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-chess-club',
      kind: 'try_yourself',
      problem: '15% of the kids in the chess club are sixth graders, and that is 12 kids. How many kids are in the chess club in total? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '80',
      hints: [
        'Turn 15% into its decimal form first: 15 divided by 100 equals 0.15.',
        'Since PART equals DECIMAL times WHOLE, divide instead of multiply to find the whole: 12 divided by 0.15.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-video-game-savings',
      kind: 'misconception_check',
      question: 'Priya has saved $18 toward a new video game. That $18 is 60% of the game\'s total price. One student answers $10.80. Another student answers $0.30. What went wrong in each case?',
      commonErrors: [
        {
          answer: '$10.80',
          misconception: 'Multiplying 18 by 0.6 instead of dividing, reusing the previous lesson\'s "find the part" move instead of the "find the whole" move.',
          correctsTo:
            'Multiplying 18 by 0.6 answers a different question: it finds 60% of $18, not the total price of the game. The part and the percent are known here, and the whole is missing, so divide: 18 divided by 0.6 equals 30. The game costs $30. Check by multiplying back: 0.6 times $30 equals $18, exactly the amount Priya saved, and $30 is bigger than $18, which makes sense since $18 is only part of the price.',
        },
        {
          answer: '$0.30',
          misconception: 'Dividing 18 by 60 instead of by 0.6, forgetting to turn the percent into its decimal form before dividing.',
          correctsTo:
            '60% must first become the decimal 0.6, since 60 divided by 100 equals 0.6. Dividing by 60 instead moves the decimal point two extra places and makes the answer far too small: a video game cannot cost $0.30. Divide by the decimal instead: 18 divided by 0.6 equals 30, so the game costs $30.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PART equals PERCENT, written as a decimal, times WHOLE — the same equation from the last lesson, now solved for the whole.',
        'Turn the percent into a decimal first by dividing by 100: 40% becomes 0.40, and 60% becomes 0.60.',
        'To find the whole, divide the part by the decimal: WHOLE equals PART divided by DECIMAL.',
        'The whole is always bigger than the part, as long as the percent is less than 100%. A smaller answer means something was divided by the wrong number.',
        'Check every answer by multiplying it back by the decimal. It should return the exact part the problem gave.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Finding the Whole Given a Part & Percent' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
