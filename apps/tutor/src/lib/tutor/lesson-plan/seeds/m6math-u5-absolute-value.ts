/**
 * Grade 6 Math — Negative Numbers & Absolute Value: Absolute Value.
 *
 * CONCEPT-LED fan-out lesson. Absolute value is introduced as a distance from
 * zero, never as an operation performed on a number. The standard's second
 * half — distinguishing an absolute-value comparison from an order comparison
 * (CCSS 6.NS.C.7c/d) — is treated as the point of the lesson, not an
 * afterthought: a student who believes -20 is "bigger than" -5 because 20 is
 * bigger than 5 has conflated two different questions, and that conflation is
 * exactly what the second worked example, the second try_yourself, and the
 * misconception check are each built to surface and correct.
 *
 * SCOPE GUARD: This lesson teaches absolute value as a number's magnitude,
 * its distance from zero, and teaches that comparing which number is greater
 * (order) is a different question from comparing which number has the
 * greater absolute value (magnitude) -- that distinction is the standard
 * itself and could not be taught without at least one order-comparison
 * example alongside it. It never adds, subtracts, multiplies, or divides
 * negative numbers; all arithmetic with signed numbers is Grade 7. Placing
 * rational numbers on the number line and building the line itself is row
 * 5.2; systematically ordering lists of rational numbers with < and > is row
 * 5.4 -- this lesson borrows only enough of both (reading positions off a
 * line, comparing exactly two numbers once) to make the absolute-value-vs-
 * order distinction concrete, and does not teach either skill in its own
 * right.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U5_ABSOLUTE_VALUE: LessonPlan = {
  id: 'evelyn.ms.m6math.absolute-value.v1',
  title: 'Absolute Value',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.absolute-value',
      standard: 'M6MATH-5.3',
      description:
        "Interpret absolute value as a number's magnitude/distance from zero; distinguish an absolute-value comparison from an order comparison (CCSS 6.NS.C.7c/d).",
    },
  ],
  prerequisites: ['m6math.rational-numbers-on-the-number-line'],
  followUps: ['m6math.ordering-rational-numbers'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student meet two debts of different sizes before any absolute-value notation is introduced.',
      script:
        'Maya borrows $5 from her sister to buy a snack after school. Her friend Jake borrows $20 from his brother to buy a video game. Both of them owe money, but not the same amount. Jake owes more than Maya, even though we have not written a single negative number yet. Today we learn how to measure the SIZE of a signed number, like a debt, a temperature, or a position below sea level, no matter which direction it points. That size has a name: absolute value.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distance-and-magnitude',
      kind: 'concept',
      goal: 'Define absolute value as a distance from zero, and separate the question of size from the question of order.',
      keyIdeas: [
        'ABSOLUTE VALUE IS A DISTANCE — the absolute value of a number is how far that number sits from zero on the number line. Distance is never negative, so |7| = 7 and |-7| = 7: both 7 and -7 sit seven units from zero, just on opposite sides.',
        'THE BARS MEAN "DISTANCE FROM ZERO," NOT AN OPERATION — |-15| is read "the absolute value of negative fifteen." The two vertical bars do not double the number, add to it, or change it in any other way. They measure how far it sits from zero.',
        'OPPOSITES SHARE THE SAME ABSOLUTE VALUE — +9 and -9 sit the same distance from zero, on opposite sides of it, so |+9| = |-9| = 9. Any number and its opposite always have matching absolute values.',
        '"GREATER THAN" AND "GREATER ABSOLUTE VALUE" ARE DIFFERENT QUESTIONS — on the number line, greater means farther to the right, so -3 is greater than -18. But -18 sits eighteen units from zero while -3 sits only three units from zero, so |-18| is greater than |-3|. The same two numbers can give opposite answers depending on which question is asked.',
        'NAME THE COMPARISON BEFORE YOU ANSWER — before comparing two signed numbers, decide whether the question is asking which number is greater (order) or which one is bigger in size, ignoring direction (absolute value, or magnitude). A debt of $18 is a bigger debt than a debt of $3 because 18 is a greater magnitude, but a balance of -3 dollars is a better, greater balance than -18 dollars because -3 sits farther to the right on the number line.',
      ],
      vocabulary: [
        { term: 'absolute value', definition: 'the distance a number sits from zero on the number line, written with two vertical bars, such as |-15|.' },
        { term: 'magnitude', definition: "the size of a number, ignoring its direction; another name for a number's absolute value." },
        { term: 'order comparison', definition: 'comparing two numbers to see which one is greater on the number line, where farther right always means greater.' },
        { term: 'opposites', definition: 'two numbers the same distance from zero but on opposite sides of it, such as +9 and -9.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-computing-absolute-value',
      kind: 'worked_example',
      problem:
        "Maya's allowance app shows her balance as -8 dollars, because she borrowed $8 from her sister. Her friend Sam's app shows +8 dollars, because he saved $8. Find |-8| and |+8|. What does each result tell you?",
      steps: [
        'Absolute value asks one question: how far does this number sit from zero on the number line? Direction does not matter for this question.',
        '-8 sits 8 units to the left of zero, so |-8| = 8.',
        '+8 sits 8 units to the right of zero, so |+8| = 8.',
        "Both distances come out to the same number, 8, even though Maya's balance and Sam's balance mean opposite things: Maya owes $8, and Sam has saved $8.",
        "Check by reading each answer back as a sentence. |-8| = 8 means Maya's debt is a distance of 8 dollars from an empty balance. |+8| = 8 means Sam's savings are also a distance of 8 dollars from an empty balance. The sizes match; the situations do not.",
      ],
      answer: '|-8| = 8 and |+8| = 8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-vs-magnitude',
      kind: 'worked_example',
      problem:
        "Jayden's balance is -18 dollars. Priya's balance is -3 dollars. (a) Which balance is greater, as a signed number? (b) Which balance has the greater absolute value?",
      steps: [
        'These are two different questions. Part (a) asks which number is greater. Part (b) asks which distance from zero is greater.',
        '(a) On the number line, greater means farther to the right. -3 sits to the right of -18, closer to zero, so -3 is the greater number: -3 > -18.',
        'WRONG: saying -18 is greater than -3 because 18 is a bigger digit than 3. CORRECT: -3 is the greater number, because greater is about position on the number line, not the size of the digits.',
        '(b) |-18| = 18, because -18 sits 18 units from zero. |-3| = 3, because -3 sits 3 units from zero. Since 18 is greater than 3, |-18| is the greater absolute value.',
        'So -3 is the greater NUMBER, but -18 has the greater ABSOLUTE VALUE. Both answers are correct, because they answer different questions.',
        "Check with the story: a balance of -3 dollars is closer to owing nothing at all than a balance of -18 dollars, so -3 is the better, greater balance. But Jayden's debt of $18 is a bigger debt than Priya's debt of $3, which matches the absolute values.",
      ],
      answer: '(a) -3 is greater: -3 > -18. (b) |-18| = 18 is greater than |-3| = 3.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-absolute-value-basic',
      kind: 'try_yourself',
      problem: 'What is |-14|?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '14', correct: true },
        { id: 'b', text: '-14' },
        { id: 'c', text: '0' },
        { id: 'd', text: '28' },
      ],
      expectedAnswer: '14',
      hints: [
        'Absolute value asks how far a number sits from zero, not what sign it has.',
        '-14 sits 14 units from zero on the number line, the same distance as +14. The two bars around a number measure a distance; they do not multiply it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-order-vs-magnitude',
      kind: 'try_yourself',
      problem: 'Two balances: -18 dollars and -3 dollars. Which statement is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-18 is greater than -3, because 18 is a bigger number than 3.' },
        { id: 'b', text: '-18 and -3 are equal, because both numbers are negative.' },
        { id: 'c', text: '-3 is greater than -18, because -3 sits closer to zero, farther to the right on the number line.', correct: true },
        { id: 'd', text: 'There is not enough information to compare -18 and -3.' },
      ],
      expectedAnswer: '-3 is greater than -18, because -3 sits closer to zero, farther to the right on the number line.',
      hints: [
        'On a number line, greater means farther to the right, not the bigger digit.',
        '-3 sits to the right of -18, closer to zero, so -3 is the greater number even though 18 is a bigger digit than 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-submarine',
      kind: 'try_yourself',
      problem:
        "A submarine's position is recorded as -85 feet, meaning 85 feet below sea level. What is the absolute value of -85? Type your answer as a number.",
      responseFormat: 'numeric',
      expectedAnswer: '85',
      hints: [
        'Absolute value is the distance from zero, and distance is never negative.',
        '-85 sits 85 units from zero on the number line, so its absolute value is that distance, 85, without the minus sign.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-order-and-distance-confusion',
      kind: 'misconception_check',
      question:
        'A student compares the elevations -25 feet and -6 feet, both below sea level. The student says -25 is greater than -6, because 25 is a bigger number than 6. The same student then says |-6| is greater than |-25|, because -6 is closer to zero. What went wrong in each case?',
      commonErrors: [
        {
          answer: '-25 feet is greater than -6 feet, because 25 is a bigger number than 6.',
          misconception: 'Comparing the size of the digits instead of the position of the numbers on the number line, so a bigger digit is mistaken for a greater number.',
          correctsTo:
            '-6 is greater than -25. Greater means farther to the right on the number line, and -6 sits closer to zero than -25 does. Comparing which number is greater is an order comparison, and order depends on position, not on the size of the digits.',
        },
        {
          answer: '|-6| is greater than |-25|, because -6 is closer to zero.',
          misconception: 'Reading absolute value as closeness to zero instead of distance from zero, so a smaller distance is mistaken for a bigger absolute value.',
          correctsTo:
            '|-6| = 6 and |-25| = 25. Absolute value is the distance from zero, and -25 sits farther from zero than -6 does. Since 25 is greater than 6, |-25| is greater than |-6|. Being closer to zero means a smaller absolute value, not a bigger one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Absolute value is the distance a number sits from zero on the number line, and distance is never negative: |7| = 7 and |-7| = 7.',
        'The two vertical bars in |-15| mean the absolute value of negative fifteen; they measure a distance, they do not double or otherwise change the number.',
        'Opposites such as +9 and -9 sit the same distance from zero, on opposite sides, so they share the same absolute value: |+9| = |-9| = 9.',
        'On the number line, greater than means farther to the right, so -3 is greater than -18 even though 18 is a bigger digit than 3.',
        'Comparing which number is greater (order) and comparing which absolute value is bigger (magnitude) are different questions and can give opposite answers for the same two numbers.',
        'Before comparing two numbers, decide which question is being asked: order (which is greater as a signed number) or magnitude (which absolute value is bigger).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Absolute Value' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
