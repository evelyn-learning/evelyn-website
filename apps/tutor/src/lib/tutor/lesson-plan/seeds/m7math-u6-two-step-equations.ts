/**
 * Grade 7 Math — Equations & Inequalities: Two-Step Equations.
 *
 * Two operations wrapped around the variable, undone in reverse order of
 * operations (CCSS 7.EE.B.4a): addition and subtraction come off FIRST, then
 * multiplication and division. The error this plan is built to kill is
 * dividing by the coefficient before the constant has been cleared, which
 * quietly divides one term and not the other. Every solve here ends with a
 * substitution check, the habit started in 6.1.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U6_TWO_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.two-step-equations.v1',
  title: 'Two-Step Equations',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.two-step-equations',
      standard: 'M7MATH-6.2',
      description:
        'Solve two-step equations of the form px + q = r by undoing addition and subtraction first and multiplication and division second, including negative coefficients, and verify each solution by substitution (CCSS 7.EE.B.4a, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.one-step-equations'],
  followUps: ['m7math.writing-equations-from-word-problems'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a situation that needs two undo-steps, and give the reverse-order rule a picture.',
      script:
        'You and a friend split a pizza order. Three slices, plus one drink that costs 2 dollars, and the total is 11 dollars. How much was a slice? Call the price of a slice p. Then 3p + 2 = 11. There are TWO things wrapped around p now, a times 3 and a plus 2, so one undo-step is not enough. Here is the trick, and you already use it every morning: you put socks on first and shoes on second, so at night the shoes come off first. Undo in the opposite order from how things went on.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reverse-order',
      kind: 'concept',
      goal: 'Establish the reverse-order rule, why it works, and how negative coefficients behave.',
      keyIdeas: [
        'TWO OPERATIONS, TWO UNDO-STEPS — an equation like 3p + 2 = 11 has the variable multiplied AND then added to. Each operation needs its own inverse, so the solve takes two moves instead of one.',
        'UNDO IN REVERSE ORDER — order of operations says you would multiply first and add second when building the value. To take it apart you go backwards: undo the addition or subtraction FIRST, and undo the multiplication or division LAST. Shoes off before socks.',
        'WHY THAT ORDER — the plus 2 is sitting outside, added on at the end, so it is the easiest thing to reach. The times 3 is wrapped tightly around p and cannot come off until the 2 is gone. Reaching for the 3 first means dividing a side that still has two pieces on it, and then you must divide BOTH pieces or the equation stops being true.',
        'BOTH SIDES, EVERY MOVE — subtract 2 from the left, subtract 2 from the right. Divide the left by 3, divide the right by 3. The equation stays true only if the two sides get identical treatment.',
        'THE SIGN BELONGS TO THE TERM — in 9 − 2x = 23 the variable term is −2x, minus included. Clear the 9 first and you are left with −2x = 14, so the last step divides by −2 and the answer is negative. Dropping that minus sign is the second most common mistake in this lesson.',
        'CHECK BY SUBSTITUTING — put the answer back into the ORIGINAL equation, work out the left side, and compare it to the right side. Two-step equations give twice as many chances to slip, so the check matters twice as much.',
      ],
      vocabulary: [
        { term: 'two-step equation', definition: 'an equation needing two inverse operations to isolate the variable, such as px + q = r.' },
        { term: 'constant term', definition: 'the plain number added to or subtracted from the variable term, such as the +2 in 3p + 2.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-standard-two-step',
      kind: 'worked_example',
      problem: 'Solve: 4x + 7 = 31',
      steps: [
        'Name the two operations wrapped around x: it is multiplied by 4, and then 7 is added. Undo them backwards, so the +7 goes first.',
        'Subtract 7 from BOTH sides: 4x + 7 − 7 = 31 − 7, which leaves 4x = 24.',
        'Now the 4 is reachable. Divide BOTH sides by 4: 4x ÷ 4 = 24 ÷ 4, so x = 6.',
        'Check in the original: 4(6) + 7 = 24 + 7 = 31. The right side is 31, so the two sides match.',
        'Notice the order in the check: multiply first, add second. The solve ran that in reverse, which is exactly the point.',
      ],
      answer: 'x = 6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-coefficient',
      kind: 'worked_example',
      problem: 'Solve: −2x + 9 = 23',
      steps: [
        'The variable term is −2x, with the minus sign included. The constant is +9.',
        'Undo the +9 first. Subtract 9 from both sides: −2x + 9 − 9 = 23 − 9, which leaves −2x = 14.',
        'Now divide both sides by −2, not by 2. A positive divided by a negative is negative, so x = −7.',
        'WRONG answer to avoid: x = 7, which comes from dividing by 2 and leaving the minus sign behind. RIGHT answer: x = −7.',
        'Check in the original: −2(−7) + 9 = 14 + 9 = 23. Both sides are 23, so the answer holds. Testing the wrong one shows why it fails: −2(7) + 9 = −14 + 9 = −5, which is not 23.',
      ],
      answer: 'x = −7',
      estimatedMinutes: 3,
    },
    {
      id: 'try-basic-two-step',
      kind: 'try_yourself',
      problem: 'Solve for x: 2x + 6 = 22',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 14' },
        { id: 'b', text: 'x = 8', correct: true },
        { id: 'c', text: 'x = 16' },
        { id: 'd', text: 'x = 5' },
      ],
      expectedAnswer: 'x = 8',
      hints: [
        'The +6 came last, so it comes off first. Subtract 6 from both sides.',
        'That leaves 2x = 16, which is not the final answer yet. One more inverse operation to go.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-division-form',
      kind: 'try_yourself',
      problem: 'Solve for x: x/4 + 3 = 7',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 25' },
        { id: 'b', text: 'x = 1' },
        { id: 'c', text: 'x = 40' },
        { id: 'd', text: 'x = 16', correct: true },
      ],
      expectedAnswer: 'x = 16',
      hints: [
        'Take the +3 off both sides first. That leaves x divided by 4 equal to a single number.',
        'Division is undone by multiplication, so multiply both sides by 4. Then check: does your answer divided by 4, plus 3, really give 7?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-negative-answer',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 8 − 5x = 23',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'Subtract 8 from both sides first. Remember the variable term is −5x, with the minus sign attached.',
        'That leaves −5x = 15. Divide both sides by −5, and expect a negative answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-divide-before-subtract',
      kind: 'misconception_check',
      question: 'Eli solves 5x + 20 = 45 by dividing by 5 first. He writes x + 20 = 9, then x = −11. Substitute −11 back into the original equation. What went wrong?',
      commonErrors: [
        {
          answer: 'x = −11',
          misconception: 'Dividing by the coefficient before the constant is cleared, and then dividing only the 5x term while leaving the +20 untouched. Half of the left side got divided and half did not, so the equation stopped being true at that very step.',
          correctsTo: 'Undo the +20 FIRST: 5x = 25, then divide by 5 to get x = 5. Check: 5(5) + 20 = 25 + 20 = 45, so both sides match. Eli can catch himself the same way: 5(−11) + 20 = −55 + 20 = −35, which is nowhere near 45. Dividing first is only legal if EVERY term gets divided: (5x + 20) ÷ 5 = 45 ÷ 5 gives x + 4 = 9, which also leads to x = 5.',
        },
        {
          answer: 'x = 25',
          misconception: 'Doing the first undo-step correctly to reach 5x = 25 and then stopping, as if 25 were the answer. The variable is not alone yet, because it is still multiplied by 5.',
          correctsTo: '5x = 25 says five copies of x make 25, not that x is 25. Divide both sides by 5 to finish: x = 5. Check: 5(25) + 20 = 145, not 45, so 25 fails the substitution test. The solve is not over until the variable stands completely alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A two-step equation needs two inverse operations, done in reverse order of operations.',
        'Undo addition and subtraction FIRST, then undo multiplication and division.',
        'Dividing by the coefficient too early only works if every term on that side is divided too.',
        'The minus sign belongs to the variable term: 9 − 2x = 23 leads to −2x = 14 and x = −7.',
        'Substitute your answer into the original equation and make both sides match before you call it done.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Two-Step Equations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
