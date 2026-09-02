/**
 * Grade 6 Math — Equations, Inequalities & Relationships: What It Means to
 * Solve an Equation.
 *
 * CONCEPT-LED lesson for the m6math fan-out. This is the row that opens Unit
 * 8, and it deliberately teaches no procedure at all: a solution is a value
 * from a set of candidates that makes an equation or inequality true, and the
 * only skill this lesson builds is checking a candidate by substitution —
 * replace the letter with a number, compute, and compare (CCSS 6.EE.B.5). Two
 * traps this plan is built to kill: treating "solving" as the same thing as
 * "simplifying" an expression (last unit's skill), and assuming an inequality
 * must have exactly one solution the way many one-step equations do.
 *
 * SCOPE GUARD: this row teaches what it MEANS to solve an equation or
 * inequality — a solution is a value from a given set that makes the
 * statement true, found by substituting the value in and checking. It never
 * teaches a method for finding that value from scratch: no isolating the
 * variable, no "do the same thing to both sides," no inverse operations.
 * Solving one-step equations by that kind of procedure is row 8.2 and must
 * not appear here. Writing an inequality from a description and graphing its
 * solution set on a number line is row 8.3; this row only checks whether a
 * given candidate number makes an inequality true, it never writes one from
 * words or draws one on a line. Every equation and inequality in this lesson
 * uses a single operation (addition, subtraction, or multiplication) with a
 * nonnegative coefficient, and every candidate and result is a nonnegative
 * whole number; two-step equations and negative coefficients are Grade 7 and
 * do not appear here.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U8_WHAT_IT_MEANS_TO_SOLVE_AN_EQUATION: LessonPlan = {
  id: 'evelyn.ms.m6math.what-it-means-to-solve-an-equation.v1',
  title: 'What It Means to Solve an Equation',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.what-it-means-to-solve-an-equation',
      standard: 'M6MATH-8.1',
      description:
        'Understand solving an equation or inequality as finding the values from a set that make it true; use substitution to check a candidate solution (CCSS 6.EE.B.5).',
    },
  ],
  prerequisites: ['m6math.equivalent-expressions'],
  followUps: ['m6math.solving-one-step-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the difference between guessing a number and checking one, before any vocabulary is introduced.',
      script:
        'Someone in your class group chat posts a riddle: "I am thinking of a number. My number plus 6 equals 14. What is my number?" You could just start guessing. Or you could pick a number, add 6 to it, and see whether you land on 14. That second move, try a number and check whether the statement comes out true, is exactly what it means to solve an equation. Today you learn to say precisely what "solving" means, for both equations and inequalities, and how to check any candidate number by substitution.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-solution-and-substitution',
      kind: 'concept',
      goal: 'Define a solution as a value that makes a statement true, and install substitution as the one tool for checking a candidate.',
      keyIdeas: [
        'AN EQUATION OR INEQUALITY MAKES A CLAIM — a statement with a letter in it, like n + 8 = 20 or y × 3 < 16, does not have a fixed truth value by itself. It becomes true or false only once a number replaces the letter. Different numbers can make the same statement true or false.',
        'A SOLUTION IS A VALUE THAT MAKES THE STATEMENT TRUE — solving an equation or inequality means finding which value, or values, from a given set of candidates make the statement true when substituted in. Nothing needs to be calculated from scratch to do this; every candidate can simply be tested.',
        'CHECKING A CANDIDATE MEANS SUBSTITUTE, THEN COMPARE — replace the letter with the candidate number everywhere it appears, compute the resulting number, and compare it to the other side. For an equation, the two sides must come out exactly equal. For an inequality, the comparison itself, less than or greater than, must come out true.',
        'AN EQUATION USUALLY HAS ONE SOLUTION FROM A SET; AN INEQUALITY OFTEN HAS SEVERAL — n + 8 = 20 asks for the one candidate that lands exactly on 20. y × 3 < 16 can be true for many different candidates at once, because many numbers multiplied by 3 land below 16. Never assume an inequality has only one solution just because most equations in this course do.',
        'A CANDIDATE THAT FAILS IS STILL USEFUL — testing a candidate that turns out false is not wasted effort. It rules that value out and shows exactly why it does not work, which is different from a number simply looking close to right.',
        'SOLVING IS NOT THE SAME AS SIMPLIFYING — simplifying an expression, last lesson\'s skill, rewrites it into an equivalent form with no particular value in mind. Solving hunts for the specific value, or values, that make a true-or-false statement come out true. This lesson never turns an equation into a simpler one by working on both sides; every candidate here is checked directly by substitution.',
      ],
      vocabulary: [
        { term: 'solution', definition: 'a value that, when substituted for the letter, makes an equation or inequality true.' },
        { term: 'substitution', definition: 'replacing a letter with a specific number so a statement can be checked.' },
        { term: 'equation', definition: 'a statement that says two expressions are equal, using an equals sign.' },
        { term: 'inequality', definition: 'a statement that compares two expressions using less than or greater than instead of an equals sign.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-check-the-equation-candidates',
      kind: 'worked_example',
      problem:
        'In the group chat, Mia posts: "My number plus 8 equals 20. Which of these is my number: 10, 12, 13, or 15?" Check each candidate by substituting it into the equation n + 8 = 20.',
      steps: [
        'Solving this equation means finding the value of n that makes n + 8 = 20 a true statement. Check each candidate one at a time by substitution.',
        'Substitute n = 10: 10 + 8 = 18. Eighteen does not equal twenty, so the statement is false. 10 is not the solution.',
        'Substitute n = 12: 12 + 8 = 20. Twenty equals twenty, so the statement is true. 12 makes the equation true.',
        'Substitute n = 13: 13 + 8 = 21. Twenty-one does not equal twenty, so the statement is false. 13 is not the solution.',
        'Substitute n = 15: 15 + 8 = 23. Twenty-three does not equal twenty, so the statement is false. 15 is not the solution.',
        'Only one candidate worked. n = 12 is the solution to n + 8 = 20, because substituting 12 for n produces a true statement, and every other candidate produces a false one.',
      ],
      answer: 'n = 12',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-check-the-inequality-candidates',
      kind: 'worked_example',
      problem:
        'Ben says the inequality y × 3 < 16 has exactly one solution, the same way most equations in this course do. Check each candidate value, 3, 4, 5, and 6, by substitution and decide whether Ben is right.',
      steps: [
        'Solving this inequality means finding every value of y from the given set that makes y × 3 < 16 a true statement, not necessarily just one.',
        'Substitute y = 3: 3 × 3 = 9. Nine is less than sixteen, so the statement is true. 3 is a solution.',
        'Substitute y = 4: 4 × 3 = 12. Twelve is less than sixteen, so the statement is true. 4 is a solution.',
        'Substitute y = 5: 5 × 3 = 15. Fifteen is less than sixteen, so the statement is true. 5 is a solution.',
        'Substitute y = 6: 6 × 3 = 18. Eighteen is not less than sixteen, so the statement is false. 6 is not a solution.',
        'WRONG: Ben\'s claim that this inequality has exactly one solution, because that pattern only holds for many equations, not for inequalities. CORRECT: three of the four candidates, 3, 4, and 5, all make this inequality true. An inequality can have more than one solution from the same set of candidates, because many different numbers can satisfy a comparison like "less than sixteen."',
      ],
      answer: '3, 4, and 5 are solutions; 6 is not a solution.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-check-the-equation',
      kind: 'try_yourself',
      problem: 'Which of these values of k is the solution to the equation k + 7 = 19? Check each value by substituting it for k.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '11' },
        { id: 'b', text: '12', correct: true },
        { id: 'c', text: '19' },
        { id: 'd', text: '26' },
      ],
      expectedAnswer: '12',
      hints: [
        'Solving this equation means finding the value of k that makes k + 7 equal to 19. Substitute each choice for k and compute the left side.',
        'Substitute 12 for k: 12 + 7 = 19. That statement is true, so 12 is the solution. None of the other choices give exactly 19.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-meaning-of-solving-an-inequality',
      kind: 'try_yourself',
      problem: 'What does it mean to solve the inequality w × 4 < 24?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Multiply w by 4 to simplify the expression.' },
        { id: 'b', text: 'Rewrite the inequality as an equation and solve that instead.' },
        { id: 'c', text: 'Find the one exact value of w that makes both sides equal.' },
        { id: 'd', text: 'Find every value of w, from a given set, that makes the statement true when substituted in.', correct: true },
      ],
      expectedAnswer: 'Find every value of w, from a given set, that makes the statement true when substituted in.',
      hints: [
        'Solving an inequality is not the same as simplifying an expression, and it is not the same as solving an equation.',
        'An inequality compares two expressions instead of setting them equal. Solving it means finding which candidate values make that comparison true, and there can be more than one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-check-the-subtraction-equation',
      kind: 'try_yourself',
      problem:
        'The equation h - 6 = 9 has candidate solutions 13, 14, 15, and 16. Only one of them makes the equation true. Substitute each value for h to find that number. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Substitute each candidate for h and compute h - 6. The equation is true only when the result equals 9.',
        'Try h = 15: 15 - 6 = 9. That matches the right side exactly, so 15 is the solution.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slip-and-equation-only-thinking',
      kind: 'misconception_check',
      question:
        'One student checks whether p = 5 is a solution to p + 9 = 16, computes 5 + 9 = 16, and says yes. Another student checks whether m = 6 is a solution to m × 4 > 20 and says no, because 6 does not equal 20 divided by 4. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'p = 5 is a solution to p + 9 = 16.',
          misconception: 'Making an arithmetic slip during substitution and accepting the mistaken result without a second check.',
          correctsTo:
            'Recompute carefully: 5 + 9 = 14, not 16. Fourteen does not equal sixteen, so p = 5 is not a solution. A substitution check is only trustworthy if the arithmetic inside it is done correctly; among the candidates 5, 6, 7, and 8, it is p = 7 that gives 7 + 9 = 16.',
        },
        {
          answer: 'm = 6 is not a solution to m × 4 > 20.',
          misconception: 'Checking an inequality the same way as an equation, by looking for exact equality instead of checking whether the comparison is true.',
          correctsTo:
            'An inequality does not need both sides to be equal. Substitute m = 6: 6 × 4 = 24. Twenty-four IS greater than twenty, so the statement 24 > 20 is true, and m = 6 is a solution. Solving an inequality means checking whether the comparison holds, not whether the two sides match exactly.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An equation or inequality with a letter in it is neither true nor false until a number replaces the letter.',
        'A solution is a value from a given set that makes the statement true.',
        'Checking a candidate means substituting it in, computing the result, and comparing: exact equality for an equation, a true comparison for an inequality.',
        'An equation usually has one solution from a set of candidates; an inequality can have several, so never assume there is only one.',
        'A candidate that fails a check is still useful. It rules that value out.',
        'Solving is not the same as simplifying: simplifying rewrites an expression, solving finds the value that makes a statement true.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'What It Means to Solve an Equation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
