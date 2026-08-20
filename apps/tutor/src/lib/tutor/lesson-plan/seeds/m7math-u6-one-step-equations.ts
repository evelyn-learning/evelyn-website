/**
 * Grade 7 Math — Equations & Inequalities: One-Step Equations.
 *
 * The first lesson where students SOLVE instead of simplify (CCSS 7.EE.B.4a).
 * Unit 5 built expressions; this one sets an expression equal to a number and
 * finds the value that makes it true. Two habits are the whole lesson: undo
 * with the inverse operation, and do it to BOTH sides. The plan insists on
 * substituting the answer back every single time, because that check is what
 * makes every later solve self-correcting.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U6_ONE_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.one-step-equations.v1',
  title: 'One-Step Equations',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.one-step-equations',
      standard: 'M7MATH-6.1',
      description:
        'Solve one-step equations of the form x + p = q and px = q using inverse operations, including negative and fractional coefficients, and check each solution by substituting it back (CCSS 7.EE.B.4a, 6.EE.B.7).',
    },
  ],
  prerequisites: ['m7math.distributive-property-and-factoring'],
  followUps: ['m7math.two-step-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the balance idea in something the student can picture holding.',
      script:
        'Picture a playground seesaw with a bag on each end, perfectly level. On the left is a mystery bag plus a 5 pound weight. On the right is a 12 pound weight. Level means the two sides weigh exactly the same. So how heavy is the mystery bag? You already know: take 5 pounds off the left. But if you only take it off the left, the seesaw tips. You have to take 5 off the right too. That is the entire rule for solving equations, and today we use it on paper.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inverse-operations',
      kind: 'concept',
      goal: 'Build the balance rule, the four inverse pairs, and the substitute-back habit.',
      keyIdeas: [
        'AN EQUATION IS A CLAIM THAT TWO THINGS ARE EQUAL — the equals sign says the left side and the right side are the same value. An expression like 3x + 5 has no equals sign and cannot be solved. Once it becomes 3x + 5 = 20 there is a question to answer: which value of x makes that true?',
        'TO SOLVE MEANS TO GET THE VARIABLE ALONE — you want to end at x = something. Everything else that is stuck to x has to be peeled away, one operation at a time.',
        'THE GOLDEN RULE — whatever you do to one side, do the exact same thing to the other side. That keeps the two sides equal, the way the seesaw stays level. Doing something to only one side breaks the equation, and every answer after that is wrong.',
        'PEEL WITH THE INVERSE OPERATION — addition and subtraction undo each other, and multiplication and division undo each other. Ask what is being done TO the variable, then do the opposite to both sides. So x + 5 = 12 needs subtract 5 and gives x = 7; x − 4 = 9 needs add 4 and gives x = 13; 3x = 21 needs divide by 3 and gives x = 7; x/4 = 5 needs multiply by 4 and gives x = 20.',
        'THE SIGN BELONGS TO THE NUMBER IN FRONT — in −6m the coefficient is −6, not 6, so you divide both sides by −6. And a fraction coefficient works the same way: two thirds of x means (2/3)x, so multiply both sides by 3 and then divide by 2. Nothing new, just a messier number to divide by.',
        'ALWAYS CHECK BY SUBSTITUTING — put your answer back into the ORIGINAL equation and work out both sides. If they match, you are right and you know it. If they do not match, you just caught your own mistake for free. This check is not extra credit; it is part of solving, every time.',
      ],
      vocabulary: [
        { term: 'equation', definition: 'a statement that two expressions are equal, written with an equals sign.' },
        { term: 'solution', definition: 'the value of the variable that makes the equation true.' },
        { term: 'inverse operation', definition: 'the operation that undoes another: subtraction undoes addition, division undoes multiplication.' },
        { term: 'coefficient', definition: 'the number multiplying the variable, sign included: in −6m the coefficient is −6.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-add-to-negative',
      kind: 'worked_example',
      problem: 'Solve: y + 9 = 4',
      steps: [
        'Ask what is being done to y. It has 9 added to it. The inverse of adding 9 is subtracting 9.',
        'Subtract 9 from BOTH sides: y + 9 − 9 = 4 − 9.',
        'The left side becomes just y. The right side is 4 − 9, which is −5, because starting at 4 and going down nine steps lands five below zero.',
        'So y = −5. A negative answer is completely normal here, and it is not a sign that something went wrong.',
        'Check in the original equation: −5 + 9 = 4. The left side is 4 and the right side is 4, so they match. The answer holds.',
      ],
      answer: 'y = −5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-and-fraction',
      kind: 'worked_example',
      problem: 'Solve each one: (a) −6m = 42, (b) w/4 = −3',
      steps: [
        'Part (a): m is being multiplied by −6, so the inverse is dividing by −6. Divide BOTH sides: −6m ÷ (−6) = 42 ÷ (−6).',
        'A positive divided by a negative is negative, so m = −7. WRONG answer to avoid: m = 7, which comes from dividing by 6 and leaving the minus sign behind. RIGHT answer: m = −7.',
        'Check part (a): −6(−7) = 42. A negative times a negative is positive, so both sides are 42. It holds.',
        'Part (b): w is being divided by 4, so the inverse is multiplying by 4. Multiply BOTH sides: (w/4) × 4 = −3 × 4.',
        'The left side becomes w, and the right side is −12. So w = −12.',
        'Check part (b): −12/4 = −3. Both sides are −3, so it holds.',
      ],
      answer: '(a) m = −7, (b) w = −12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-subtraction-form',
      kind: 'try_yourself',
      problem: 'Solve for x: x − 7 = −2',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = −9' },
        { id: 'b', text: 'x = 5', correct: true },
        { id: 'c', text: 'x = 9' },
        { id: 'd', text: 'x = −5' },
      ],
      expectedAnswer: 'x = 5',
      hints: [
        'Seven is being subtracted from x, so the inverse is adding 7 to both sides.',
        'The right side becomes −2 + 7. Start at −2 on the number line and move seven steps right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-negative-coefficient',
      kind: 'try_yourself',
      problem: 'Solve for x: −4x = 20',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 5' },
        { id: 'b', text: 'x = 16' },
        { id: 'c', text: 'x = −5', correct: true },
        { id: 'd', text: 'x = −80' },
      ],
      expectedAnswer: 'x = −5',
      hints: [
        'x is multiplied by −4, sign included, so divide both sides by −4.',
        'A positive divided by a negative gives a negative. Then check: does −4 times your answer really give 20?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-fraction-coefficient',
      kind: 'try_yourself',
      problem: 'Two thirds of a number x is 10. In symbols, (2/3)x = 10. What is x? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'Undo the division by 3 first: multiply both sides by 3, which gives 2x = 30.',
        'Now undo the multiplication by 2: divide both sides by 2. Then check that two thirds of your answer really is 10.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-op-instead-of-inverse',
      kind: 'misconception_check',
      question: 'A student solves x − 6 = 10 and writes x = 4. Substitute 4 back into the original equation. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 4',
          misconception: 'Copying the operation that is already there instead of undoing it — seeing the minus 6 and subtracting 6 from the right side as well.',
          correctsTo: 'Subtraction is undone by ADDITION. Add 6 to both sides: x − 6 + 6 = 10 + 6, so x = 16. The substitution check catches the error instantly: 4 − 6 = −2, which is not 10, while 16 − 6 = 10 matches. Always ask what is being done to the variable, then do the OPPOSITE.',
        },
        {
          answer: 'x = 10',
          misconception: 'Treating the −6 as decoration that can simply be crossed out, so the variable is left equal to whatever is on the other side.',
          correctsTo: 'A term never just disappears. The only way to remove −6 from the left side is to add 6, and adding 6 to the left means adding 6 to the right too. That gives x = 16, not 10. Check: 10 − 6 = 4, which is not 10, so x = 10 fails.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solving means getting the variable alone on one side of the equals sign.',
        'Whatever you do to one side, do to the other side. That is what keeps the equation true.',
        'Undo with the inverse: subtraction undoes addition, and division undoes multiplication.',
        'The sign travels with the coefficient, so −4x = 20 gives x = −5, not x = 5.',
        'Substitute your answer back into the original equation every time. If both sides match, you are done.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'One-Step Equations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
