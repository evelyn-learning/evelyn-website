/**
 * Grade 8 Math — Linear Equations in One Variable: Equations with Variables
 * on Both Sides.
 *
 * PROCEDURE-LED exemplar for the m8math fan-out. The student already owns
 * two-step equations; what is new is a variable term on BOTH sides of the
 * equals sign, which none of the two-step moves can touch until the variable
 * lives on one side only (CCSS 8.EE.C.7b). The concept segment is a short
 * ordered recipe rather than a mental model: collect the variable terms,
 * collect the constants, finish the two-step equation that remains, check by
 * substituting into BOTH sides of the original. Both worked examples run the
 * same moves so the pattern is unmistakable, and every solve ends with a
 * two-sided substitution check. Two traps this plan is built to kill: moving
 * a term across the equals sign without changing its sign (a term does not
 * hop, it is subtracted from both sides), and the older "subtract first,
 * divide second" trap from two-step equations, which resurfaces the moment
 * the collected equation is reached.
 *
 * SCOPE GUARD: Grade 8 row 4.1 is ax + b = cx + d with integer coefficients.
 * Assumes `m7math-u6-two-step-equations.ts` (px + q = r, negative
 * coefficients — not re-taught). Withholds: distribution (row 4.2),
 * fraction/decimal coefficients (row 4.3), no-solution/identity outcomes
 * (row 4.4); literal equations → `alg1-u2-literal-equations.ts`. Once the
 * variable terms are collected on one side, the equation that remains IS a
 * two-step equation, and finishing it is in scope here; two-step solving
 * itself is Grade 7 material that this row assumes and recalls in a sentence,
 * never re-teaches. Every coefficient, constant and solution in this plan is
 * an integer, every equation has exactly one solution, no equation to be
 * solved contains a factor to distribute, and no step multiplies out a
 * bracket (the brackets that do appear are substitution checks such as 8(6)
 * and one aside that dividing EVERY term of 4x + 4 by 4 is legal). Negative
 * coefficients and
 * negative solutions DO appear (they are Grade 7 ground, not row 4.3's
 * rational coefficients), and choosing which side to collect on is taught
 * because it decides whether the last division is by a negative.
 *
 * NOTE ON prerequisites/followUps: left empty on purpose. The controller
 * wires the chain (row 3.4 `deriving-y-equals-mx-plus-b` before, row 4.2
 * `equations-with-distribution-and-like-terms` after) at batched
 * registration, when both neighbors exist for the lint to resolve.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U4_EQUATIONS_WITH_VARIABLES_ON_BOTH_SIDES: LessonPlan = {
  id: 'evelyn.ms.m8math.equations-with-variables-on-both-sides.v1',
  title: 'Equations with Variables on Both Sides',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.equations-with-variables-on-both-sides',
      standard: 'M8MATH-4.1',
      description:
        'Solve ax + b = cx + d with integer coefficients by collecting variable terms on one side and constants on the other, finishing as a two-step equation and checking by substitution (CCSS 8.EE.C.7b).',
    },
  ],
  prerequisites: ['m8math.deriving-y-equals-mx-plus-b'],
  followUps: ['m8math.equations-with-distribution-and-like-terms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put the variable on both sides of a real question, so the student feels why the two-step moves alone are not enough.',
      script:
        'Maya has $40 saved and adds $8 every week from walking dogs. Jordan has only $10 saved, but babysitting brings in $13 a week, so Jordan is catching up. After how many weeks do they have exactly the same amount? Call the number of weeks w. Maya has 40 + 8w, Jordan has 10 + 13w, and the question is asking when those are equal: 40 + 8w = 10 + 13w. Look at where the w is. It is on the left AND on the right, and every equation you have solved until now kept the variable on one side. The two-step moves you already own cannot reach a variable that is split across the equals sign. Today you learn one extra move that fixes that, and once it is done, the rest of the solve is a two-step equation you could do in your sleep.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-collect-then-finish',
      kind: 'concept',
      goal: 'Install the collect-then-finish recipe, the reason a term never hops across the equals sign, and the two-sided substitution check.',
      keyIdeas: [
        'THE VARIABLE MUST LIVE ON ONE SIDE — in 3x + 5 = 7x - 3, the x is on both sides, so nothing you can do to one side gets x alone. Every solve in this lesson starts with the same goal: get all the x terms together on one side, and all the plain numbers together on the other.',
        'COLLECT THE VARIABLE TERMS BY SUBTRACTING FROM BOTH SIDES — a term does not hop across the equals sign. To get the 3x off the left of 3x + 5 = 7x - 3, subtract 3x from BOTH sides: the left becomes 5, and the right becomes 7x - 3x - 3, which is 4x - 3. The equation is now 5 = 4x - 3, and the variable lives on one side only.',
        'SUBTRACT THE SMALLER VARIABLE TERM — you may collect on either side, and both roads reach the same answer. Subtracting 3x (the smaller one) leaves a positive 4x. Subtracting 7x instead leaves -4x + 5 = -3, which is also correct, but it ends with a division by -4, and that is one more place for a sign to go missing. Pick the road with the positive coefficient when you can.',
        'FINISH AS A TWO-STEP EQUATION — 5 = 4x - 3 is a two-step equation, the kind you already solve: add 3 to both sides to get 8 = 4x, then divide both sides by 4 to get x = 2. The old rule still holds here: clear the constant FIRST, divide by the coefficient LAST. Dividing 4x by 4 while the -3 is still on that side divides one term and not the other, and the equation stops being true.',
        'IF YOU CHANGE A SIDE, THE SIGN CHANGES WITH IT — students who "move" 7x to the left write 3x + 7x, as if the term kept its plus sign. It cannot, because what actually happened was a subtraction from both sides. If a term appears to switch sides, its sign switches too: +7x on the right becomes -7x on the left. Say the real move out loud, "subtract 7x from both sides", and the sign takes care of itself.',
        'CHECK BY SUBSTITUTING INTO BOTH SIDES — put the answer back into the ORIGINAL equation and work out the left side and the right side separately. For x = 2: left is 3(2) + 5 = 11, right is 7(2) - 3 = 11. Both sides have an x in them now, so both sides get a calculation, and they must land on the same number. If they do not, one of the moves went wrong, and a sign is the first place to look.',
      ],
      vocabulary: [
        { term: 'variable term', definition: 'a term with the variable in it, such as 3x or -7x, with its sign attached.' },
        { term: 'constant term', definition: 'a plain number in an equation with no variable attached, such as the +5 or the -3 in 3x + 5 = 7x - 3.' },
        { term: 'collecting terms', definition: 'using the same subtraction or addition on both sides so that every variable term sits on one side and every constant sits on the other.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-maya-and-jordan',
      kind: 'worked_example',
      problem: 'Maya has $40 and saves $8 a week. Jordan has $10 and saves $13 a week. After how many weeks do they have the same amount? Solve 40 + 8w = 10 + 13w.',
      steps: [
        'Name what is where. The variable terms are 8w on the left and 13w on the right. The constants are 40 on the left and 10 on the right. The variable is on both sides, so the first move has to collect it.',
        'Subtract the smaller variable term, 8w, from BOTH sides: 40 + 8w - 8w = 10 + 13w - 8w, which leaves 40 = 10 + 5w. Now every w is on the right.',
        'That is a two-step equation. Clear the constant first: subtract 10 from both sides, 40 - 10 = 5w, so 30 = 5w.',
        'Now divide both sides by 5: 30 ÷ 5 = 6, so w = 6.',
        'Check by substituting w = 6 into BOTH sides of the original. Left: 40 + 8(6) = 40 + 48 = 88. Right: 10 + 13(6) = 10 + 78 = 88. Both sides give 88, so the answer holds.',
        'Read it back into the story: after 6 weeks Maya and Jordan each have $88. Jordan started $30 behind and gained $5 a week on Maya, and 30 ÷ 5 = 6 is exactly the same arithmetic the equation did.',
      ],
      answer: 'w = 6 (both have $88 after 6 weeks)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-solution',
      kind: 'worked_example',
      problem: 'Solve: 6x + 14 = 2x - 2',
      steps: [
        'Name what is where. Variable terms: 6x on the left and 2x on the right. Constants: +14 on the left and -2 on the right, minus sign included.',
        'Subtract the smaller variable term, 2x, from BOTH sides: 6x - 2x + 14 = 2x - 2x - 2, which leaves 4x + 14 = -2.',
        'WRONG: sliding 2x across to the left and writing 6x + 2x + 14 = -2, so 8x = -16 and x = -2. CORRECT: a term does not hop across with its sign intact. Subtracting 2x from both sides leaves 4x on the left, not 8x. The check exposes the slip: for x = -2, the left is 6(-2) + 14 = 2 and the right is 2(-2) - 2 = -6, which do not match.',
        'Finish the two-step equation 4x + 14 = -2. Clear the constant first: subtract 14 from both sides, 4x = -2 - 14, so 4x = -16.',
        'Divide both sides by 4: -16 ÷ 4 = -4, so x = -4.',
        'Check by substituting x = -4 into BOTH sides of the original. Left: 6(-4) + 14 = -24 + 14 = -10. Right: 2(-4) - 2 = -8 - 2 = -10. Both sides give -10, so x = -4 is the solution.',
        'The other road, so you can see it lands in the same place: subtract 6x from both sides instead, 14 = -4x - 2, then add 2 to both sides, 16 = -4x, then divide by -4, x = -4. Same answer, one extra negative to keep track of. That is why the smaller variable term is the one to subtract.',
      ],
      answer: 'x = -4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-seven-x-plus-three',
      kind: 'try_yourself',
      problem: 'Solve for x: 7x + 3 = 4x + 18',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 7' },
        { id: 'b', text: 'x = 5', correct: true },
        { id: 'c', text: 'x = 15' },
        { id: 'd', text: 'x = 3' },
      ],
      expectedAnswer: 'x = 5',
      hints: [
        'Subtract 4x from both sides so the variable lives on the left only. What is left is a two-step equation.',
        'That leaves 3x + 3 = 18. Clear the +3 first, then divide by 3. Substitute your answer into both sides of the original equation; both sides must give the same number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-first-move',
      kind: 'try_yourself',
      problem: 'A student is solving 9x - 4 = 5x + 12 and wants all the variable terms on the left. Which equation is the result of one correct first move?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '14x - 4 = 12' },
        { id: 'b', text: '9x = 5x + 8' },
        { id: 'c', text: '9x - 4 = 12' },
        { id: 'd', text: '4x - 4 = 12', correct: true },
      ],
      expectedAnswer: '4x - 4 = 12',
      hints: [
        'A term never hops across the equals sign on its own. Whatever you do to remove the 5x from the right side, you must do to the left side as well.',
        'Subtract 5x from both sides. On the left, 9x - 5x is 4x, and the -4 has not moved yet. On the right, only the 12 is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-negative-solution',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 3x - 8 = 7x + 4',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'Subtract 3x, the smaller variable term, from both sides so the coefficient stays positive: -8 = 4x + 4.',
        'Add 8 to both sides to get -12 = 4x, then divide by 4. Expect a negative answer, and check it in both sides of the original equation.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sign-hop-and-early-divide',
      kind: 'misconception_check',
      question: 'Priya and Marcus both solve 6x + 4 = 2x + 20. Priya gets x = 2 and Marcus gets x = 1. Substitute each answer into both sides of the original equation. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 2',
          misconception: 'Moving the 2x across the equals sign without changing its sign, so the left side becomes 6x + 2x + 4 = 20, then 8x = 16 and x = 2.',
          correctsTo:
            'A term does not hop across with its sign intact. The real move is to subtract 2x from BOTH sides, which leaves 4x + 4 = 20, not 8x + 4 = 20. Then subtract 4 to get 4x = 16 and divide by 4 to get x = 4. The check tells the story: for x = 2, the left is 6(2) + 4 = 16 and the right is 2(2) + 20 = 24, which do not match. For x = 4, the left is 6(4) + 4 = 28 and the right is 2(4) + 20 = 28.',
        },
        {
          answer: 'x = 1',
          misconception: 'Collecting correctly to 4x + 4 = 20, then dividing by 4 before the +4 is cleared, and dividing only the 4x term: x + 4 = 5, so x = 1.',
          correctsTo:
            'Once the variable is collected, the old two-step rule takes over: clear the constant FIRST, then divide. Subtract 4 from both sides to get 4x = 16, then divide by 4 to get x = 4. Dividing first is only legal if EVERY term gets divided: (4x + 4) ÷ 4 = 20 ÷ 4 gives x + 1 = 5, which also leads to x = 4. The check exposes x = 1: the left is 6(1) + 4 = 10 and the right is 2(1) + 20 = 22, nowhere near equal.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'When the variable is on both sides, the first move is to collect every variable term on one side by subtracting from BOTH sides.',
        'Subtract the smaller variable term so the coefficient stays positive; either side works, but a positive coefficient means no division by a negative at the end.',
        'A term never hops across the equals sign. If it appears to switch sides, its sign switches too, because the real move was a subtraction from both sides.',
        'After collecting, what remains is a two-step equation: clear the constant first, then divide by the coefficient.',
        'Check by substituting into BOTH sides of the original equation. Both sides have their own calculation now, and they must land on the same number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Equations with Variables on Both Sides' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
