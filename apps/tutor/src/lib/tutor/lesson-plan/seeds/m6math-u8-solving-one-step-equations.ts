/**
 * Grade 6 Math — Equations, Inequalities & Relationships: Solving One-Step
 * Equations.
 *
 * PROCEDURE-LED row for the m6math fan-out. Row 8.1 already built what it
 * means to solve an equation and how to check a candidate solution by
 * substitution; this lesson turns that idea into a runnable two-move
 * procedure for the two forms 6.EE.B.6/B.7 names: x + p = q and px = q
 * (CCSS 6.EE.B.6, 6.EE.B.7). The shape mirrors the procedure-led exemplar:
 * the concept segment is a short ordered recipe, both worked examples run
 * the same identify-the-operation / apply-the-inverse / check-by-
 * substitution pattern, and the second worked example carries a WRONG/
 * CORRECT trap. The trap this plan is built to kill: reaching for the
 * operation that "feels like undoing" (subtracting a number that is
 * actually multiplying x, or dividing a number that is actually added to
 * x) instead of the true inverse of the operation that is actually there.
 *
 * SCOPE GUARD: This lesson writes and solves one-step equations of the
 * form x + p = q and px = q only, using nonnegative rational numbers
 * (whole numbers, decimals, and simple fractions) throughout for p, q, and
 * every solution — no equation here ever needs two steps, a negative
 * coefficient, or a negative solution; all three are Grade 7 (m7math
 * U5-U6, and the legacy g7-math-one-step-equations.ts file this lesson
 * mined for problem structure only, keeping its examples nonnegative).
 * What it means to solve an equation and how to check a candidate solution
 * by substitution are row 8.1's job; this lesson applies that check on
 * every problem without re-explaining what a solution is. Writing and
 * graphing inequalities is row 8.3, and relating dependent and independent
 * variables is row 8.4; neither is taught or assessed here.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.1 -> 8.2 ->
 * 8.3. Both loIds resolve once the full 40-row batch is registered
 * together by the controller.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U8_SOLVING_ONE_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.ms.m6math.solving-one-step-equations.v1',
  title: 'Solving One-Step Equations',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.solving-one-step-equations',
      standard: 'M6MATH-8.2',
      description:
        'Write and solve one-step equations of the form x+p=q and px=q for nonnegative rational numbers (CCSS 6.EE.B.6, 6.EE.B.7).',
    },
  ],
  prerequisites: ['m6math.what-it-means-to-solve-an-equation'],
  followUps: ['m6math.writing-and-graphing-inequalities'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student a one-step equation hiding inside a familiar money story before naming any rule.',
      script:
        'Jayden counts his wallet before his little sister hands him $4.25 from her piggy bank. After the gift, he has $19.75 in total. How much did he have before the gift? You could guess and check, but guessing gets slow once the numbers stop being round. Today you learn a two-move method that solves that kind of question every time, plus a check that tells you the moment you have made a mistake.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-identify-and-undo',
      kind: 'concept',
      goal: 'Install the two-move procedure — identify the operation on x, undo it with its true inverse on both sides — plus the substitution check.',
      keyIdeas: [
        'A ONE-STEP EQUATION HIDES ONE OPERATION ON x — in x + p = q, the number p is ADDED to x. In px = q, the number p is MULTIPLYING x. Before doing anything else, look at the equation and name which one it is.',
        'UNDO WITH THE TRUE INVERSE — addition is undone by subtraction, and multiplication is undone by division. If p is added to x, subtract p from both sides. If p is multiplying x, divide both sides by p. Using the wrong inverse, such as subtracting a number that is actually multiplying x, does not isolate x at all.',
        'WHATEVER YOU DO, DO IT TO BOTH SIDES — the equal sign means the two sides balance. Applying an operation to only one side breaks that balance, so every move happens on both sides at once.',
        'p AND q CAN BE WHOLE NUMBERS, DECIMALS, OR FRACTIONS — the two moves above work no matter what kind of nonnegative number p and q are. 12x = 42 and x + 4.75 = 12.25 are solved with the exact same two-move method.',
        'CHECK EVERY SOLUTION BY SUBSTITUTING IT BACK IN — once x is isolated, put that value back into the ORIGINAL equation in place of x and compute both sides. If they come out equal, the solution is correct. If they do not, one of the two moves went wrong.',
      ],
      vocabulary: [
        { term: 'inverse operation', definition: 'an operation that undoes another: subtraction undoes addition, and division undoes multiplication.' },
        { term: 'coefficient', definition: 'the number multiplying a variable, such as the 12 in 12x.' },
        { term: 'isolate', definition: 'to get the variable alone on one side of the equation, with a coefficient of 1.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-jayden-wallet',
      kind: 'worked_example',
      problem:
        'Jayden had x dollars saved. His sister gave him $4.25 more, which brought his total to $19.75. Write an equation for x and solve it.',
      steps: [
        'Turn the story into an equation. The gift is ADDED to what Jayden already had: x + 4.25 = 19.75.',
        'Name the operation on x. The number 4.25 is added to x.',
        'The inverse of addition is subtraction, so subtract 4.25 from both sides: x + 4.25 - 4.25 = 19.75 - 4.25.',
        'x = 15.50.',
        'Check by substituting 15.50 back into the ORIGINAL equation: 15.50 + 4.25 = 19.75. Both sides match, so x = 15.50 is correct.',
      ],
      answer: 'x = 15.50, so Jayden had $15.50 saved before the gift.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bracelets-price',
      kind: 'worked_example',
      problem:
        'Four identical friendship bracelets cost $18 in total. Let x be the price of one bracelet. Write an equation for x and solve it.',
      steps: [
        'Turn the story into an equation. Four bracelets at the same price add up to $18: 4x = 18.',
        'Name the operation on x. The number 4 is MULTIPLYING x, not added to it.',
        'The inverse of multiplication is division, so divide both sides by 4: 4x ÷ 4 = 18 ÷ 4.',
        'x = 4.5.',
        'WRONG: subtracting 4 from both sides instead, because subtracting can feel like the natural way to remove a number sitting next to x. That gives 4x - 4 = 18 - 4, which is 4x = 14 — a different equation, not a solved one, since 4 was never added to x in the first place. CORRECT: 4 is multiplying x, so only division undoes it. Dividing both sides by 4 gives x = 4.5.',
        'Check by substituting 4.5 back into the ORIGINAL equation: 4 × 4.5 = 18. Both sides match, so x = 4.5 is correct.',
      ],
      answer: 'x = 4.5, so one bracelet costs $4.50.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-addition-form',
      kind: 'try_yourself',
      problem: 'Solve for x: x + 9 = 24.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '33' },
        { id: 'b', text: '24' },
        { id: 'c', text: '15', correct: true },
        { id: 'd', text: '9' },
      ],
      expectedAnswer: '15',
      hints: [
        'Name the operation on x first. Is 9 added to x, or is it multiplying x?',
        'Since 9 is added to x, undo it with the inverse: subtract 9 from both sides.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-solve-multiplication-form',
      kind: 'try_yourself',
      problem:
        'Twelve classmates are splitting a $42 gift for their teacher equally. Let x be the amount each classmate pays. Solve 12x = 42 for x.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3.5', correct: true },
        { id: 'b', text: '30' },
        { id: 'c', text: '504' },
        { id: 'd', text: '42' },
      ],
      expectedAnswer: '3.5',
      hints: [
        'Name the operation on x. The 12 sits right next to x with no plus sign, so it is multiplying x.',
        'Since 12 is multiplying x, undo it with the inverse: divide both sides by 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-maya-savings',
      kind: 'try_yourself',
      problem:
        'Maya had x dollars saved. Her grandma gave her $4.75 more, which brought her total to $12.25. Write an equation for x and solve it. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7.5',
      hints: [
        'Write the story as an equation first: x plus 4.75 equals 12.25.',
        'The 4.75 is added to x, so subtract 4.75 from both sides to find x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-inverse',
      kind: 'misconception_check',
      question:
        'One student solves 5x = 30 by subtracting 5 from both sides and gets x = 25. Another student solves y + 8 = 20 by dividing both sides by 8 and gets y = 2.5. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 25',
          misconception:
            'Subtracting the number attached to x instead of dividing by it, even though 5 is MULTIPLYING x in 5x, not being added to it.',
          correctsTo:
            'The 5 in 5x means 5 times x, so the inverse operation is division, not subtraction. Divide both sides by 5: 5x ÷ 5 = 30 ÷ 5, so x = 6. Check by substituting back: 5 × 6 = 30, which matches.',
        },
        {
          answer: 'y = 2.5',
          misconception:
            'Dividing by the number attached to y instead of subtracting it, even though 8 is ADDED to y in y + 8, not multiplying it.',
          correctsTo:
            'The 8 in y + 8 is added to y, so the inverse operation is subtraction, not division. Subtract 8 from both sides: y + 8 - 8 = 20 - 8, so y = 12. Check by substituting back: 12 + 8 = 20, which matches.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'In x + p = q, the number p is added to x; undo it by subtracting p from both sides.',
        'In px = q, the number p is multiplying x; undo it by dividing both sides by p.',
        'Name the operation that is actually there before picking an inverse — addition needs subtraction, multiplication needs division, never the other way around.',
        'Apply every move to both sides, so the equation stays balanced.',
        'Check every solution by substituting it back into the original equation.',
        'p, q, and the solution can be whole numbers, decimals, or fractions — the same two moves work every time.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Solving One-Step Equations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
