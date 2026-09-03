/**
 * Grade 8 Math — Linear Equations in One Variable: One, None or Infinitely
 * Many Solutions.
 *
 * CONCEPT-LED. Every equation the student has solved until now ended with the
 * variable equal to one number, and this lesson builds the mental model that
 * that is only one of three things an equation can say (CCSS 8.EE.C.7a). The
 * moves are the ones the student already owns from earlier in the unit —
 * distribute, combine like terms, collect the variable terms on one side —
 * and the new idea is to keep going until the equation reads in one of three
 * shapes and then READ the shape: x = a means exactly one solution, a = a
 * (a true statement with no variable left) means every number works, and
 * a = b (a false statement with no variable left) means no number works. The
 * standard's own pair runs through the whole plan: 2x + 6 = 2(x + 3) is
 * always true because both sides are the same expression in disguise, and
 * 2x + 6 = 2x + 5 is never true because the left side is always exactly 1
 * more than the right. Two traps the plan is built to kill: reading 0 = 0 as
 * "x = 0, one solution", and treating a vanished variable as a mistake or
 * reading the leftover number as the answer.
 *
 * SCOPE GUARD: Grade 8 row 4.4 transforms a linear equation in one variable
 * until it reads x = a, a = a, or a = b, and concludes one solution,
 * infinitely many, or none, explaining why 2x + 6 = 2(x + 3) is always true
 * and 2x + 6 = 2x + 5 never. Withholds: nothing further;
 * `alg1-u2-multi-step-equations.ts` repeats the classification as HS review.
 * Sideways: the moves used to reach the final shape — collecting variable
 * terms on one side (row 4.1) and distributing a factor, then combining like
 * terms (row 4.2) — are USED here as tools the student already owns and are
 * never re-taught; they have to appear, because the standard's own example
 * 2(x + 3) cannot be classified without distributing. Every coefficient,
 * constant and solution in this plan is an integer, so nothing from row 4.3
 * (fraction and decimal coefficients) appears. The plan never puts two
 * equations together, so the no-solution and infinitely-many outcomes for a
 * SYSTEM (parallel and coincident lines, row 5.2) are never mentioned, and
 * the words "system", "parallel" and "intersect" appear in no spoken field
 * (only in the `followUps` loId, which names the next row).
 * No inequality appears anywhere (no CCSS Grade 8 inequality standard
 * exists). Below, assumed and recalled in a clause at most: two-step
 * equations (`m7math-u6-two-step-equations.ts`) and distribution and like
 * terms (`m7math-u5-*`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U4_ONE_NONE_OR_INFINITELY_MANY_SOLUTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.one-none-or-infinitely-many-solutions.v1',
  title: 'One, None or Infinitely Many Solutions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.one-none-or-infinitely-many-solutions',
      standard: 'M8MATH-4.4',
      description:
        'Transform an equation until it reads x = a, a = a, or a = b, and conclude one solution, infinitely many, or none; explain why 2x + 6 = 2(x + 3) is always true and 2x + 6 = 2x + 5 never (CCSS 8.EE.C.7a).',
    },
  ],
  prerequisites: ['m8math.equations-with-rational-coefficients'],
  followUps: ['m8math.solutions-of-systems-as-intersection-points'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Let the student watch the variable vanish from a real question twice, once leaving a false statement and once a true one, so both outcomes feel like answers before they are named.',
      script:
        'Jayden has $20 saved and adds $5 every week from mowing lawns. Sofia has $12 saved and also adds $5 a week from babysitting. After how many weeks do they have the same amount? Call the number of weeks w: Jayden has 20 + 5w, Sofia has 12 + 5w, so the question is 20 + 5w = 12 + 5w. Subtract 5w from both sides, the move you own from earlier in this unit, and the w vanishes: 20 = 12. That is not a mistake. It is the equation telling you the truth: Jayden stays exactly $8 ahead every single week, so there is NO week when they are tied. Now try Leo, who also starts with $20 and saves $5 a week. Jayden and Leo: 20 + 5w = 20 + 5w. Subtract 5w and you get 20 = 20. This time the statement is true, and it is true for EVERY week, because the two of them are tied on week 1, on week 2, and on week 100. Until today, every equation you solved ended with x equal to one number. Today you meet the two other things an equation can say, and you learn to read them.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-shapes',
      kind: 'concept',
      goal: 'Install the model that every linear equation ends in one of three shapes, x = a, a = a, or a = b, and that the shape is the answer: one solution, infinitely many, or none.',
      keyIdeas: [
        'AN EQUATION ASKS A QUESTION — 5x - 4 = 2x + 11 asks "which values of x make the left side and the right side the same number?" Every equation you solved before this lesson answered with exactly one number. That is one of three possible answers, and the other two are just as real: EVERY number works, or NO number works.',
        'TRANSFORM UNTIL THE EQUATION SPEAKS — use the moves you already own: distribute any factor, combine like terms on each side, then subtract to collect the variable terms on one side. Keep going until the equation reads in one of three shapes: x = a (x equals one number), a = a (the same number on both sides), or a = b (two different numbers). The shape you land on IS the answer.',
        'x = a MEANS ONE SOLUTION — 5x - 4 = 2x + 11 becomes 3x - 4 = 11 after subtracting 2x from both sides, then 3x = 15, then x = 5. Exactly one number works, and the check proves it: 5(5) - 4 = 21 and 2(5) + 11 = 21. This is the shape every earlier lesson in this unit ended in.',
        'a = a MEANS INFINITELY MANY SOLUTIONS — 2x + 6 = 2(x + 3) distributes to 2x + 6 = 2x + 6. Subtract 2x from both sides and the x is gone: 6 = 6. That is a true statement with no x in it, so it stays true no matter what x is. Why: the two sides were the same expression wearing different clothes, so any number you put in comes out equal on both sides. Test it: x = 1 gives 8 = 8, x = 10 gives 26 = 26, x = -3 gives 0 = 0. Every number works, so the equation has infinitely many solutions. An equation that is true for every value of the variable is called an identity.',
        'a = b MEANS NO SOLUTION — 2x + 6 = 2x + 5 has nothing to distribute, so subtract 2x from both sides right away: 6 = 5. That is a false statement with no x in it, so it stays false no matter what x is. Why: whatever x is, the left side is always exactly 1 more than the right side, so the two sides can never be equal. Test it: x = 4 gives 14 on the left and 13 on the right, x = 100 gives 206 and 205, x = -6 gives -6 and -7. Nothing works, so the equation has no solution.',
        'THE VARIABLE VANISHING IS NOT A MISTAKE — when 2x - 2x leaves nothing on either side, students think they broke the equation. They did not; the equation answered in a different way, and the job is to read what is left. A true leftover, such as 6 = 6 or 0 = 0, means infinitely many solutions. A false leftover, such as 6 = 5 or 0 = -7, means no solution. And 0 = 0 does NOT say x = 0; there is no x in it at all. One shortcut to see it coming: if the x terms on the two sides match after simplifying, the equation is either always true or never true, and if they differ, there is exactly one solution.',
      ],
      vocabulary: [
        { term: 'solution', definition: 'a value of the variable that makes the left side and the right side of an equation equal.' },
        { term: 'identity', definition: 'an equation that is true for every value of the variable, such as 2x + 6 = 2(x + 3); it has infinitely many solutions.' },
        { term: 'no solution', definition: 'the outcome when no value of the variable makes the two sides equal; the equation simplifies to a false statement such as 6 = 5.' },
        { term: 'infinitely many solutions', definition: 'the outcome when every value of the variable works; the equation simplifies to a true statement such as 6 = 6.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-always-true-never-true',
      kind: 'worked_example',
      problem:
        'Decide how many solutions each equation has, and explain why. (a) 2x + 6 = 2(x + 3). (b) 2x + 6 = 2x + 5.',
      steps: [
        'Both equations start the same way, so the plan is the same: simplify each side, collect the variable terms, and read the shape that is left.',
        '(a) Distribute on the right: 2(x + 3) = 2x + 6. The equation is now 2x + 6 = 2x + 6, and you can already see that the two sides are identical. Subtract 2x from both sides: 6 = 6.',
        '(a) 6 = 6 is true, and there is no x in it, so nothing you choose for x can change it. Every number is a solution. Try a few to feel it: x = 1 gives 2(1) + 6 = 8 on the left and 2(1 + 3) = 8 on the right; x = -5 gives -10 + 6 = -4 on the left and 2(-5 + 3) = 2(-2) = -4 on the right. Infinitely many solutions, because the two sides are the same expression.',
        '(b) There is nothing to distribute. Subtract 2x from both sides: 6 = 5.',
        '(b) 6 = 5 is false, and there is no x in it, so nothing you choose for x can rescue it. No number is a solution. Try a few: x = 1 gives 8 on the left and 7 on the right; x = -5 gives -4 on the left and -5 on the right. The left side is always exactly 1 bigger than the right side, so they can never match. No solution.',
        'Read the two shapes side by side. The x term was 2x on both sides in both equations, so neither one could end with a single answer; the constants decided everything. Equal constants (6 and 6) made the equation always true, and different constants (6 and 5) made it never true.',
      ],
      answer: '(a) infinitely many solutions, because both sides simplify to 2x + 6; (b) no solution, because 6 = 5 is false for every x',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sort-three-equations',
      kind: 'worked_example',
      problem:
        'Three equations from one homework sheet. Decide how many solutions each has. (a) 5x - 3 = 2(x + 6). (b) 3(x - 2) + 4 = 3x - 2. (c) 4x + 9 = 2(2x + 1).',
      steps: [
        '(a) Distribute on the right: 5x - 3 = 2x + 12. The x terms are 5x and 2x, which are different, so expect exactly one solution. Subtract 2x from both sides: 3x - 3 = 12. Add 3 to both sides: 3x = 15. Divide both sides by 3: x = 5.',
        '(a) Check in both sides of the original: 5(5) - 3 = 22, and 2(5 + 6) = 2(11) = 22. One solution, x = 5.',
        '(b) Simplify the left: 3(x - 2) + 4 = 3x - 6 + 4 = 3x - 2. The equation is now 3x - 2 = 3x - 2, the same expression on both sides. Subtract 3x from both sides: -2 = -2, a true statement.',
        'WRONG: adding 2 to both sides to get 0 = 0 and then announcing "x = 0, one solution." CORRECT: 0 = 0 has no x in it. It is a true statement about the numbers 0 and 0, and it stays true for every x, so the equation has infinitely many solutions. Testing shows x = 0 is only one of them: x = 0 gives 3(-2) + 4 = -2 and 3(0) - 2 = -2, and x = 5 gives 3(3) + 4 = 13 and 3(5) - 2 = 13. Both work, and so does every other number.',
        '(c) Distribute on the right: 2(2x + 1) = 4x + 2, so the equation is 4x + 9 = 4x + 2. Subtract 4x from both sides: 9 = 2, a false statement.',
        'WRONG: "moving" the 9 across to get 0 = -7 and then announcing "x = -7." CORRECT: 0 = -7 has no x in it either, and it is false, so no value of x makes 4x + 9 equal 4x + 2. Test x = -7 to watch it fail: 4(-7) + 9 = -19 and 2(2(-7) + 1) = 2(-13) = -26, not equal. The left side is always 7 more than the right side, whatever x is. No solution.',
        'Line the three up. Different x terms (5x and 2x) gave one solution. Matching x terms with matching constants gave infinitely many. Matching x terms with different constants gave none.',
      ],
      answer: '(a) one solution, x = 5; (b) infinitely many solutions; (c) no solution',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-has-no-solution',
      kind: 'try_yourself',
      problem: 'Which equation has NO solution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x + 3 = 4x - 1', correct: true },
        { id: 'b', text: '4x + 3 = 2(2x + 1) + 1' },
        { id: 'c', text: '4x + 3 = 3x - 1' },
        { id: 'd', text: '4x + 3 = 3' },
      ],
      expectedAnswer: '4x + 3 = 4x - 1',
      hints: [
        'Simplify each side first, then compare the x terms. An equation can only end with no solution if the x terms on both sides match and the constants do not.',
        'Two of these have exactly one answer, and one of those answers is x = 0, which is a real solution, not a missing one. One of them is true for every x. Look for the one that leaves a false statement such as 3 = -1 after you subtract 4x from both sides.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-read-the-leftover',
      kind: 'try_yourself',
      problem:
        'A student is solving 5(x - 2) = 5x + 3. After distributing and subtracting 5x from both sides, the student is left with -10 = 3. What should the student conclude?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One solution, x = -10, because -10 is the number left on the left side' },
        { id: 'b', text: 'Infinitely many solutions, because the x terms canceled out' },
        { id: 'c', text: 'No solution, because -10 = 3 is false no matter what x is', correct: true },
        { id: 'd', text: 'Something went wrong, because the variable is not allowed to disappear' },
      ],
      expectedAnswer: 'No solution, because -10 = 3 is false no matter what x is',
      hints: [
        'The moves were correct: 5(x - 2) is 5x - 10, and subtracting 5x from both sides leaves -10 = 3. The variable is gone, so read the statement that is left.',
        'Is -10 = 3 true or false? A true leftover means every x works; a false leftover means no x works. You can also test one value: x = 1 gives 5(-1) = -5 on the left and 5 + 3 = 8 on the right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-make-it-an-identity',
      kind: 'try_yourself',
      problem:
        'For what value of c does the equation 3x + c = 3x + 7 have infinitely many solutions? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Infinitely many solutions happens when both sides are the same expression. The x terms already match, so compare the constants.',
        'Subtract 3x from both sides and you are left with c on one side and a plain number on the other. For that leftover to be a TRUE statement, c has to equal that number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-zero-equals-zero-and-leftover-number',
      kind: 'misconception_check',
      question:
        'Two students compare homework. Aisha solves 2(x + 4) = 2x + 8, reaches 0 = 0, and writes "x = 0, one solution." Marcus solves 6x - 5 = 6x + 1, reaches -5 = 1, adds 5 to both sides to get 0 = 6, and writes "x = 6." What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 0, one solution (for 2(x + 4) = 2x + 8)',
          misconception: 'Reading 0 = 0 as if it said x = 0, when the statement has no x in it at all and is simply true.',
          correctsTo:
            'Distributing gives 2x + 8 = 2x + 8, the same expression on both sides, and subtracting 2x and then 8 from both sides leaves 0 = 0. That is a true statement with no variable, so it is true for every x, not just x = 0. Test x = 3: 2(3 + 4) = 14 on the left and 2(3) + 8 = 14 on the right. Test x = -1: 2(-1 + 4) = 6 and 2(-1) + 8 = 6. The equation has infinitely many solutions, and x = 0 is only one of them.',
        },
        {
          answer: 'x = 6 (for 6x - 5 = 6x + 1)',
          misconception: 'Treating the number left over after the variable vanishes as the value of x, when 0 = 6 is a false statement with no x in it.',
          correctsTo:
            'Subtracting 6x from both sides leaves -5 = 1, which is already false, and adding 5 to both sides only rewrites it as 0 = 6, still false. Neither statement contains x, so no value of x can make it true; the left side of 6x - 5 = 6x + 1 is always 6 less than the right side. Test x = 6 to watch the claimed answer fail: 6(6) - 5 = 31 and 6(6) + 1 = 37, not equal. The equation has no solution.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simplify and collect until the equation reads x = a, a = a, or a = b. The shape you land on is the answer.',
        'x = a means exactly one solution. Check it by substituting into both sides of the original equation.',
        'a = a, such as 6 = 6 or 0 = 0, is true for every x: infinitely many solutions. Both sides were the same expression, as in 2x + 6 = 2(x + 3).',
        'a = b, such as 6 = 5, is false for every x: no solution. The two sides stay a fixed distance apart, as in 2x + 6 = 2x + 5.',
        'The variable vanishing is not a mistake. Read what is left: true means infinitely many, false means none, and 0 = 0 never means x = 0.',
        'Matching x terms on both sides means always true or never true; different x terms mean exactly one solution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'One, None or Infinitely Many Solutions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
