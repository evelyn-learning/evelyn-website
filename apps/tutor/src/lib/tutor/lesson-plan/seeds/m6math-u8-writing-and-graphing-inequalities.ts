/**
 * Grade 6 Math — Equations, Inequalities & Relationships: Writing & Graphing
 * Inequalities.
 *
 * CONCEPT-LED fan-out lesson. Lesson 8.2 solved one-step equations, each of
 * which has exactly one solution; this lesson's whole point is that an
 * inequality of the form x > c or x < c does not work that way — it holds
 * for every number on one side of a boundary, and there is no way to write
 * out that whole list. Translating a real-world phrase ("taller than,"
 * "fewer than") into the correct symbol is one required skill; drawing the
 * entire, infinite solution set as an open circle plus a shaded ray on a
 * number line is the other, and this plan treats both as equally
 * load-bearing. Two traps this plan is built to kill: filling in the
 * boundary circle as if the inequality included its own boundary number,
 * and shading toward the larger numbers out of habit instead of checking
 * which way the symbol actually points.
 *
 * SCOPE GUARD: This lesson writes an inequality of the form x > c or x < c
 * from a real-world constraint and graphs its solution set — an open circle
 * at the boundary number plus a shaded ray — on a number line. Every
 * boundary number and every context quantity used in this lesson's hook,
 * worked examples, try-yourself items, and misconception check is
 * nonnegative. No inequality here is ever combined, multi-step, or solved:
 * this lesson only writes and graphs an inequality that is already in
 * x > c or x < c form; it never isolates a variable the way lesson 8.2
 * solves an equation, and it never multiplies or divides an inequality by
 * anything, so the Grade-7-only rule about flipping the symbol when
 * multiplying or dividing by a negative number never applies here and is
 * not taught. No `expectedAnswer` or worked-example answer in this lesson
 * ever uses ≥ or ≤; every inequality this lesson asks a student
 * to WRITE, or confirms as correct, uses only the strict symbols > and <,
 * matching the standard's x > c / x < c form. The symbols ≥ and ≤
 * do appear, but only inside wrong-answer MCQ choices that name the
 * specific mistake of treating a strict, open-circle inequality as if it
 * were inclusive — correcting that mistake is in scope, the combined
 * "at least" / "at most" inequality form itself is not, and belongs to
 * Grade 7 along with negative-coefficient and multi-step inequalities (see
 * the salvage file g7-math-inequalities.ts, mined here only for its
 * open-circle/shaded-ray graphing convention, never for its solving
 * procedure or its sign-flip rule). This lesson is also not row 5.4: row
 * 5.4 writes a statement such as -6 < 68 comparing two already-known
 * rational numbers and explains what that comparison means, while this
 * lesson writes an inequality about an UNKNOWN quantity held by a
 * variable, whose solution is not one number or two numbers but an
 * infinite set — that infinite solution set is exactly the new idea this
 * row exists to teach.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U8_WRITING_AND_GRAPHING_INEQUALITIES: LessonPlan = {
  id: 'evelyn.ms.m6math.writing-and-graphing-inequalities.v1',
  title: 'Writing & Graphing Inequalities',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.writing-and-graphing-inequalities',
      standard: 'M6MATH-8.3',
      description:
        'Write an inequality to represent a real-world constraint and represent its infinitely many solutions on a number line (CCSS 6.EE.B.8).',
    },
  ],
  prerequisites: ['m6math.solving-one-step-equations'],
  followUps: ['m6math.dependent-and-independent-variables'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that a real-world rule can have infinitely many correct values before any inequality symbol appears.',
      script:
        'Think about the tallest ride at an amusement park, the one with a sign at the entrance: "You must be taller than 48 inches to ride." That sign does not name one exact height that gets you on the ride. A rider who is 49 inches tall can ride. So can a rider who is 60 inches tall, or 72 inches tall. There is no tallest height a person could be and still qualify, so the list of heights that work never ends. A rule like this has infinitely many solutions, and today you learn how to write it as an inequality, and how to draw every one of those solutions in a single picture on a number line.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-writing-and-graphing-inequalities',
      kind: 'concept',
      goal: 'Build the phrase-to-symbol translation, install the idea of an infinite solution set, and fix the open-circle graphing convention.',
      keyIdeas: [
        'A CONSTRAINT DESCRIBES A BOUNDARY, NOT ONE NUMBER — many real-world rules do not name a single value. A roller coaster does not require riders to be exactly one height; it requires them to be taller than some minimum height. Words like "more than," "greater than," "over," "fewer than," "less than," and "under" all describe a boundary a quantity must sit on one side of.',
        'LET A VARIABLE STAND FOR THE UNKNOWN QUANTITY — before writing any symbol, name what the letter represents and its units, such as h for a rider\'s height in inches or n for the number of books checked out. Every inequality in this lesson starts by naming its variable.',
        'TRANSLATE THE PHRASE INTO A SYMBOL — "more than," "greater than," and "over" all become the symbol >. "Fewer than," "less than," and "under" all become the symbol <. The boundary number itself is never included, because none of these phrases mean "or equal to."',
        'AN INEQUALITY LIKE x > c HAS INFINITELY MANY SOLUTIONS — an equation such as x = 7 has exactly one number that makes it true. An inequality such as h > 48 is true for 48.5, 49, 60, 1000, and every other number bigger than 48, with no biggest one and no way to list them all. That is what "infinitely many solutions" means.',
        'THE NUMBER LINE SHOWS EVERY SOLUTION AT ONCE — since the solutions cannot be listed, a number line pictures them all in one drawing: mark the boundary number, then shade every point in the direction the solutions extend, with an arrow to show the shading keeps going forever.',
        'THE CIRCLE AT THE BOUNDARY STAYS OPEN — draw an open, unfilled circle at the boundary number, because that number itself does NOT make a strict inequality true. A rider exactly 48 inches tall is not taller than 48 inches, so 48 is marked but not included. Shade right for > and shade left for <.',
      ],
      vocabulary: [
        { term: 'inequality', definition: 'a mathematical statement built with the symbol > or < that describes every number on one side of a boundary, rather than naming a single number.' },
        { term: 'solution of an inequality', definition: 'any number that makes the inequality a true statement when it replaces the variable.' },
        { term: 'boundary number', definition: 'the number that separates the solutions of an inequality from the numbers that are not solutions; written as c in x > c or x < c.' },
        { term: 'open circle', definition: 'an unfilled circle drawn at the boundary number on a number-line graph, showing that the boundary number itself is not a solution.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-roller-coaster-height',
      kind: 'worked_example',
      problem:
        'The Thunder Loop roller coaster has a sign: "Riders must be taller than 48 inches." Let h stand for a rider\'s height, in inches. Write an inequality for the height rule, then describe how to graph its solutions on a number line.',
      steps: [
        'Name the variable first: h stands for a rider\'s height, in inches.',
        'Find the boundary number in the rule: 48 inches.',
        'The phrase "taller than" means strictly more than, so it translates to the symbol >, not the symbol for "or equal to." Being exactly 48 inches tall is not taller than 48 inches.',
        'Write the inequality: h > 48.',
        'This inequality has infinitely many solutions: 48.5, 49, 60, and 1000 are all solutions, and there is no biggest height a solution could be, so the full list can never be written out.',
        'Graph the solutions: draw a number line, mark 48 with an OPEN circle because 48 itself is not a solution, then shade every point to the RIGHT of 48 and draw an arrow to show the shading continues without end.',
        'Check by testing a number in the shaded region and the boundary number itself: 50 > 48 is true, so 50 belongs in the shaded region. 48 > 48 is false, so 48 correctly stays outside the shading, marked with the open circle.',
      ],
      answer: 'h > 48; open circle at 48, shaded to the right with an arrow.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-library-book-limit',
      kind: 'worked_example',
      problem:
        'A school library rule says a student may check out fewer than 5 books at one time. Let n stand for the number of books a student checks out. Write an inequality for the rule, then graph its solutions on a number line.',
      steps: [
        'Name the variable: n stands for the number of books a student checks out.',
        'Find the boundary number: 5 books.',
        'The phrase "fewer than" means strictly less than, so it translates to the symbol <, not the symbol for "or equal to." Checking out exactly 5 books is not fewer than 5 books.',
        'Write the inequality: n < 5.',
        'WRONG: drawing an open circle at 5 and shading to the RIGHT, toward 6, 7, and 8. CORRECT: since the symbol is <, the solutions are the numbers SMALLER than 5, so the shading goes to the LEFT of the open circle at 5, toward 4, 3, 2, and beyond.',
        'Check by testing a number in each direction: 3 < 5 is true, so 3 belongs in the shaded region to the left. 7 < 5 is false, so 7 correctly stays out of the shading.',
        'This inequality also has infinitely many solutions: every number less than 5 works, and the shading keeps going without a smallest number ever marked.',
      ],
      answer: 'n < 5; open circle at 5, shaded to the left with an arrow.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-charity-walk-inequality',
      kind: 'try_yourself',
      problem:
        'A charity walk gives a finisher medal to anyone who walks more than 3 miles. Let m stand for the number of miles a person walks. Which inequality represents this rule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'm < 3' },
        { id: 'b', text: 'm ≥ 3' },
        { id: 'c', text: 'm = 3' },
        { id: 'd', text: 'm > 3', correct: true },
      ],
      expectedAnswer: 'm > 3',
      hints: [
        '"More than" means strictly greater than, and greater numbers sit to the right on a number line.',
        'The symbol for "greater than" is >, not the symbol for "or equal to," and not an equals sign. Walking exactly 3 miles does not satisfy "more than 3 miles."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reading-a-graphed-inequality',
      kind: 'try_yourself',
      problem:
        'A number line shows an open circle at 40, with every point to the RIGHT of 40 shaded and an arrow continuing to the right. Which inequality does this graph represent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x < 40' },
        { id: 'b', text: 'x > 40', correct: true },
        { id: 'c', text: 'x ≥ 40' },
        { id: 'd', text: 'x = 40' },
      ],
      expectedAnswer: 'x > 40',
      hints: [
        'Shading to the right of the boundary means the solutions are numbers greater than the boundary, not less than it.',
        'An open circle means the boundary number itself is not a solution, so the symbol cannot be the "or equal to" version. The graph matches x > 40.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-chess-club-games',
      kind: 'try_yourself',
      problem:
        'To join the after-school chess club, a student must have played more than 8 games this year. Let g stand for the number of games played, so the rule is g > 8. If g must be a whole number, what is the smallest number of games a student could have played and still qualify to join? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'The boundary number 8 does not qualify, since the rule needs MORE than 8 games, not exactly 8 games.',
        'The next whole number after 8 is the smallest one that is still greater than 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-open-circle-and-shading-direction',
      kind: 'misconception_check',
      question:
        'Two students graph two different rules. A community pool posts: "Lifeguards must be older than 15." A shipping company posts: "Boxes shipped at the discount rate must weigh under 20 pounds." The first student graphs a > 15 with a CLOSED, filled circle at 15, shaded to the right. The second student graphs p < 20 with an OPEN circle at 20, but shades to the RIGHT of 20. What went wrong in each graph?',
      commonErrors: [
        {
          answer: 'a > 15 graphed with a closed, filled circle at 15',
          misconception: 'Believing every boundary point on a number-line graph should be filled in, without checking whether the inequality is strict.',
          correctsTo:
            'The rule says "older than 15," which is a strict inequality, so 15 itself is not a solution: a lifeguard who is exactly 15 is not older than 15. The circle at 15 must stay OPEN and unfilled. Only the shaded ray to the right, every age greater than 15, is part of the solution.',
        },
        {
          answer: 'p < 20 graphed with shading to the right of 20',
          misconception: 'Shading toward the larger numbers out of habit, without checking which direction the inequality symbol actually points.',
          correctsTo:
            'The rule p < 20 means the weight must be LESS than 20 pounds, so the solutions are the smaller numbers, to the LEFT of 20. Shading to the right would show weights greater than 20, which is the opposite of what the rule requires. The open circle at 20 is correct in this graph; only the direction of the shading needs to move to the left.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Words like "more than," "greater than," and "over" translate to the symbol >. Words like "fewer than," "less than," and "under" translate to the symbol <.',
        'An inequality such as x > c or x < c has infinitely many solutions; there is no way to list every one, which is why a number-line graph is used instead.',
        'On the graph, the boundary number gets an OPEN, unfilled circle, because a strict inequality never includes its own boundary number.',
        'Shade to the RIGHT of the open circle for > and to the LEFT of the open circle for <, with an arrow showing the shading continues forever.',
        'Always name the variable and its units before writing the inequality, so the symbol and the story stay connected.',
        'Check an inequality by testing one number inside the shaded region and the boundary number itself; the shaded number should make the inequality true and the boundary number should make it false.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Writing & Graphing Inequalities' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
